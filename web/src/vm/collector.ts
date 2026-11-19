// collector - the VM's garbage collector (safe points, freeing, Del() calls, the debug count check), moved out of interpreter.ts. How reference counting works: gc.ts.

import { DMList, DMObject, releaseRefs, assocValues, taggedDatums } from "./objects.js";
import { GCFlag, GCNode, heap, markOf, PERMANENT_RC, setMark } from "./gc.js";
import { forgetRef } from "./refs.js";
import { diffHook } from "./clockhook.js";
import { DMAtom } from "./world.js";
import { DMAppearance } from "./appearances.js";
import type { DMProc, DMType } from "./objtree.js";
import type { Thread } from "./scheduler.js";
import type { Value } from "./value.js";
import { ListEnumerator, type Frame, type VM } from "./interpreter.js";

export class Collector {
	constructor(private readonly vm: VM) {}

	private epoch = 0;
	/** Collector stats for the boot log. */
	readonly stats = { safePoints: 0, ms: 0, freed: 0 };
	private readonly userDel = new Map<DMType, DMProc | null>();
	/**
	 * frames of translated plain procs (translate/runtime.ts), which aren't on any thread. They are
	 * GC roots like thread frames (their JS locals through Frame.vars). The runtime pushes and pops them.
	 */
	readonly extraFrames: Frame[] = [];
	private readonly extraThread = { frames: this.extraFrames } as unknown as Thread;

	/** The Del() a freed object of this type runs, or null when it's only the built-in one. */
	delProcOf(t: DMType): DMProc | null {
		let p = this.userDel.get(t);
		if (p === undefined) {
			const d = t.procs.get("Del");
			p = d && !d.isNative && d.owner?.path !== "/datum" ? d : null;
			this.userDel.set(t, p);
		}
		return p;
	}

	/**
	 * A safe point: frees everything in the zero-count table that no proc frame refers to, and what
	 * that frees in turn. `extra` holds values the caller has popped off the operand stack but still
	 * uses. Does nothing while a native has started a nested thread (its JS locals can't be scanned).
	 */
	safePoint(extra?: Value): void {
		if (heap.zct.length === 0) return;
		if (diffHook.gcTickOnly && !diffHook.atTick) return;
		if (this.vm.running.length > 1) for (let i = 1; i < this.vm.running.length; i++) if (!this.vm.running[i].rootsKnown) return;
		if (heap.off) {
			for (const n of heap.zct) n.gcFlags &= ~GCFlag.InZct;
			heap.zct = [];
			return;
		}
		const t0 = performance.now();
		const epoch = (this.epoch = (this.epoch + 1) & 0x7ffffff) || (this.epoch = 1);
		const mark = (v: Value | GCNode): void => {
			if (v instanceof GCNode) {
				setMark(v, epoch);
				if (v.gcFlags & GCFlag.View && v.viewTarget !== null) setMark(v.viewTarget, epoch);
			}
		};
		const markFrames = (th: Thread): void => {
			for (const f of th.frames) {
				mark(f.src);
				mark(f.usr);
				mark(f.dot);
				mark(f.lastDeref);
				if (f.boundSrc !== undefined) mark(f.boundSrc);
				for (const v of f.args) mark(v);
				for (const v of f.locals) mark(v);
				if (f.vars !== null) for (const v of f.vars()) mark(v);
				if (f.resume !== undefined) mark(f.resume);
				for (const en of f.enumerators) {
					if (!(en instanceof ListEnumerator)) continue;
					mark(en.list);
					for (const v of en.collectable()) mark(v);
				}
			}
		};
		for (const th of this.vm.running) markFrames(th);
		for (const th of this.vm.sched.sleepers()) markFrames(th);
		if (this.extraFrames.length) markFrames(this.extraThread);
		for (const a of this.vm.walkers.keys()) mark(a);
		if (extra !== undefined) mark(extra);

		const keep: GCNode[] = [];
		let roots = heap.zct;
		heap.zct = [];
		while (roots.length) {
			const dels = this.freeFrom(roots, epoch, keep);
			// Del() procs run after the pass, each then releasing its object's references. What that
			// frees (and whatever the Del() procs made and dropped) is freed in the next pass. BYOND
			// runs each Del() at once instead; only the order of Del() calls can differ.
			for (const [o, del] of dels) {
				this.vm.call(del, [], o);
				releaseRefs(o);
			}
			roots = heap.zct;
			heap.zct = [];
		}
		heap.zct = keep;
		this.stats.safePoints++;
		this.stats.ms += performance.now() - t0;
	}

	/** Frees what in `roots` has no references and isn't marked, and the cascade. Returns the pending Del() calls. */
	private freeFrom(roots: GCNode[], epoch: number, keep: GCNode[]): [DMObject, DMProc][] {
		const dels: [DMObject, DMProc][] = [];
		// Oldest first, and each one's cascade (depth first, parents before children) before the next.
		const stack: GCNode[] = [];
		for (const root of roots) {
			root.gcFlags &= ~GCFlag.InZct;
			stack.push(root);
			while (stack.length) {
				const o = stack.pop()!;
				if (o.rc > 0 || o.gcFlags & GCFlag.Collected) continue;
				if (markOf(o) === epoch) {
					// A proc still refers to it: check again at the next safe point.
					if (!(o.gcFlags & GCFlag.InZct)) {
						o.gcFlags |= GCFlag.InZct;
						keep.push(o);
					}
					continue;
				}
				o.gcFlags = (o.gcFlags & ~GCFlag.InZct) | GCFlag.Collected;
				this.stats.freed++;
				if (o instanceof DMObject) {
					if (o instanceof DMAtom) this.vm.map.removeAtom(o);
					else if (o instanceof DMAppearance) this.vm.appearances.forget(o);
					forgetRef(o);
					o.type.special?.free?.(o);
					const del = o.deleted ? null : this.delProcOf(o.type);
					if (del) {
						// Del() runs before what it refers to is released, so it can still read its vars.
						dels.push([o, del]);
						continue;
					}
				} else forgetRef(o as DMList);
				this.releaseInto(o, stack);
			}
		}
		return dels;
	}

	/**
	 * Debug check of the reference counts: walks everything reachable (globals, the map, tagged
	 * objects, proc frames, the ZCT) and counts the heap references to each object. A count below
	 * that is a missed incRef (the object could be freed while in use); above it is either a missed
	 * decRef or references from unreachable objects (cycles), so only the first kind is an error.
	 * Also reports reachable objects that were freed. Returns one line per problem type.
	 */
	verify(): string[] {
		const count = new Map<GCNode, number>();
		const seen = new Set<GCNode>();
		const todo: GCNode[] = [];
		const visit = (v: Value | GCNode): void => {
			if (!(v instanceof GCNode)) return;
			if (v.gcFlags & GCFlag.View && v.viewTarget !== null) visit(v.viewTarget);
			if (v.gcFlags & GCFlag.View) return;
			if (!seen.has(v)) {
				seen.add(v);
				todo.push(v);
			}
		};
		const edge = (v: Value | GCNode): void => {
			if (!(v instanceof GCNode)) return;
			let t: GCNode | null = v;
			if (t.gcFlags & GCFlag.View) t = t.viewTarget;
			if (t === null) return;
			count.set(t, (count.get(t) ?? 0) + 1);
			visit(t);
		};
		for (const v of this.vm.globals) edge(v);
		visit(this.vm.world);
		for (const a of this.vm.map.atoms) visit(a);
		for (const d of taggedDatums) visit(d);
		for (const n of heap.zct) visit(n);
		const frames = (th: Thread) => {
			for (const f of th.frames) {
				for (const v of [f.src, f.usr, f.dot, f.lastDeref, ...f.args, ...f.locals, f.resume ?? null, ...(f.vars?.() ?? [])]) visit(v);
				for (const en of f.enumerators) if (en instanceof ListEnumerator) { visit(en.list); if (!en.world) for (const v of en.items) visit(v); }
			}
		};
		for (const th of this.vm.running) frames(th);
		for (const th of this.vm.sched.sleepers()) frames(th);
		frames(this.extraThread);
		while (todo.length) {
			const n = todo.pop()!;
			if (n.gcFlags & GCFlag.Released) continue; // deleted: its references were released
			if (n instanceof DMObject) {
				if (n.vals) for (const v of n.vals) edge(v);
				if ((n.ownVar("tag") ?? null) !== null) count.set(n, (count.get(n) ?? 0) + 1);
				if (n instanceof DMAtom) {
					for (const c of n.contents) edge(c);
					if (n.loc && n.isMovable) edge(n.loc);
				}
			} else if (n instanceof DMList) {
				for (const v of n.items) edge(v);
				if (n.assoc) for (const v of assocValues(n.assoc)) edge(v);
			}
		}
		const problems = new Map<string, number>();
		const note = (k: string) => problems.set(k, (problems.get(k) ?? 0) + 1);
		const name = (n: GCNode) => (n instanceof DMObject ? n.type.path : "/list");
		for (const n of seen) {
			const rc = n.rc >= PERMANENT_RC ? n.rc - PERMANENT_RC : n.rc;
			const c = count.get(n) ?? 0;
			if (n.gcFlags & GCFlag.Collected && !(n instanceof DMObject && n.deleted)) note(`freed but reachable: ${name(n)}`);
			if (n instanceof DMObject && n.deleted) continue;
			if (rc < c) note(`count too low: ${name(n)}`);
		}
		return [...problems].map(([k, c]) => `${k} x${c}`);
	}

	/** Releases a freed object's references; those that reach 0 go on `stack` (children in order). */
	private releaseInto(o: GCNode, stack: GCNode[]): void {
		const before = heap.zct.length;
		releaseRefs(o);
		// releaseRefs queued what reached 0 on the ZCT; take them back to free them now.
		const z = heap.zct; // in place (splice allocated an array each time)
		for (let i = z.length - 1; i >= before; i--) {
			z[i].gcFlags &= ~GCFlag.InZct;
			stack.push(z[i]);
		}
		z.length = before;
	}

	/**
	 * Measured: BYOND frees what a proc was the last to refer to when it returns, and runs its Del()
	 * then. Only a user-defined Del() can tell the difference from the next safe point, so this
	 * checks just for objects that have one (tg defines none; the tests do).
	 */
	holdsDelCandidate(f: Frame): boolean {
		const c = (v: Value): boolean => v instanceof DMObject && v.rc === 0 && !(v.gcFlags & GCFlag.Collected) && this.delProcOf(v.type) !== null;
		if (c(f.lastDeref) || c(f.src) || c(f.dot)) return true;
		for (const v of f.locals) if (c(v)) return true;
		if (f.vars !== null) for (const v of f.vars()) if (c(v)) return true;
		for (const v of f.args) if (c(v)) return true;
		return false;
	}
}
