// Reference counts: BYOND 511 frees a datum, list or movable as soon as nothing refers to
// it, runs its Del(), and from then on `locate(ref)` and `in world` loops no longer find it. Cycles
// are never freed. Measured in web/tests/dm/gc.dm.
//
// The VM does the same with *deferred* reference counting:
//  - Every reference stored in the heap counts: object vars, list items and associated values,
//    globals, `loc` (movable -> container) and `contents` (container -> movable), and a non-null tag.
//    Those writes go through incRef/decRef below.
//  - References held by running or sleeping procs (args, locals, the operand stack, `.`, src, usr,
//    `for` snapshots, and the object a proc last dereferenced, see Frame.lastDeref) are NOT counted.
//    An object whose count drops to 0 goes into the zero-count table (ZCT) instead, and the VM checks
//    the ZCT at safe points (between ticks, and just before a `\ref` lookup or an `in world` loop,
//    where tg could see the difference): anything in it that no proc frame refers to is freed, and
//    freeing it releases its own references, which can free more (parents before children).
//
// Freeing never sets `deleted` (that is `del`, which nulls every reference). A freed object is just
// dropped from the VM's registries (GameMap.atoms, the ref table); JS's own GC reclaims the memory.
// So if a reference the VM doesn't count slips through, the damage is limited to that object
// disappearing from `in world`/`locate()` (and its Del() running), never to nulled references.
// VM_GC_CHECK=1 reports any use of a freed object.

import type { Value } from "./value.js";

export const enum GCFlag {
	/** In the zero-count table. */
	InZct = 1,
	/** Freed by the collector. */
	Collected = 2,
	/** Its outgoing references were released (freed, or `del`eted): writes to it no longer count. */
	Released = 4,
	/** A list view (`args`, `vars`, `contents`): holds no counts of its own; a reference to it counts on `viewTarget`. */
	View = 8,
	/** a DMList whose assoc storage (array or Map) may be shared with other lists (copy-on-write: its
	 * first assoc write copies it; see DMList.ownAssoc). */
	AssocShared = 16,
	/** a DMList with a search index (its ListSearch in `listSearch` has one). */
	Indexed = 32,
}

export const MARK_SHIFT = 6;
const FLAG_MASK = (1 << MARK_SHIFT) - 1;

export function markOf(n: GCNode): number {
	return n.gcFlags >>> MARK_SHIFT;
}

export function setMark(n: GCNode, epoch: number): void {
	n.gcFlags = (n.gcFlags & FLAG_MASK) | (epoch << MARK_SHIFT);
}

/**
 * Never reaches 0: turfs, areas and the world object are never freed. 2^28 so that `rc` stays a Smi
 * (small integer) in Chrome too, where pointer compression makes Smis 31-bit (max 2^30 - 1); a larger
 * value would turn `rc` into a heap-number field on every GCNode.
 */
export const PERMANENT_RC = 1 << 28;

/** Base of DMObject and DMList: everything the reference counts track. */
export class GCNode {
	// Plain constructor stores, not class-field initializers: every heap class (DMObject, DMAtom,
	// DMList and its views...) runs this, and V8's define-property ICs in a shared field initializer go
	// megamorphic and slow (measured).
	declare rc: number;
	/** GCFlag bits, and above them (<< MARK_SHIFT) the safe-point epoch in which a proc frame was seen
	 * referring to this. Two small fields per object: there are millions of them. */
	declare gcFlags: number;
	/** Views only (not even present on other objects): the object a reference to the view keeps alive
	 * (null: nothing, e.g. `args`). */
	declare viewTarget: GCNode | null;

	constructor(view: boolean) {
		this.rc = 0;
		if (view) {
			this.gcFlags = GCFlag.View | GCFlag.Released;
			this.viewTarget = null;
		} else {
			// A new object starts with no references: freed at the next safe point unless stored.
			this.gcFlags = GCFlag.InZct;
			heap.zct.push(this);
		}
	}
}

export const heap = {
	/** Objects whose count reached 0 (or started there) since the last safe point. */
	zct: [] as GCNode[],
	/** VM_GC_CHECK: report uses of freed objects. */
	check: typeof process !== "undefined" && !!process.env?.VM_GC_CHECK,
	/** VM_GC_OFF=1: never free anything (to measure what freeing changes). */
	off: typeof process !== "undefined" && !!process.env?.VM_GC_OFF,
	/** Totals, for the boot log. */
	freed: 0,
};

export function incRef(v: Value): void {
	if (v instanceof GCNode) {
		if (v.gcFlags & GCFlag.View) {
			const t = v.viewTarget;
			if (t !== null) t.rc++;
		} else v.rc++;
	}
}

export function decRef(v: Value): void {
	if (v instanceof GCNode) {
		let t: GCNode | null = v;
		if (t.gcFlags & GCFlag.View) {
			t = t.viewTarget;
			if (t === null) return;
		}
		if (--t.rc <= 0 && !(t.gcFlags & GCFlag.InZct)) {
			if (t.rc < 0) t.rc = 0;
			t.gcFlags |= GCFlag.InZct;
			heap.zct.push(t);
		}
	}
}

/** Makes an object permanent (turfs, areas, world). */
export function pin(n: GCNode): void {
	n.rc += PERMANENT_RC;
}
