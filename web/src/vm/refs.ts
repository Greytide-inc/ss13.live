// `\ref[x]` and `locate("[0x...]")`: every object or list gets a text reference the first time
// one is asked for, and locate() turns it back into the object.
//
// BYOND's refs encode a type class and an index ("[0x2000012]" for an obj, "[0x21000003]" for a
// datum...) and indexes are reused after garbage collection (measured: a new datum can get the ref
// text a freed one had). We can't reproduce those numbers, so ours are just unique hex numbers in the
// same "[0x...]" shape and never reused. Nothing in tg parses them, and SSgarbage's gc_destroyed
// check exists precisely so that reuse doesn't matter.
import { DMList, DMObject } from "./objects.js";
import { DMProc, DMType } from "./objtree.js";
import { stringify, type Value } from "./value.js";

const ids = new WeakMap<object, string>();
/** Strong: an object BYOND hasn't freed (say, one in a reference cycle) must stay findable. The
 * collector removes freed objects (forgetRef). */
const byRef = new Map<string, DMObject | DMList>();
let next = 0x3000000;

export function refOf(v: Value): string {
	if (v instanceof DMObject || v instanceof DMList) {
		let r = ids.get(v);
		if (!r) {
			r = `[0x${(next++).toString(16)}]`;
			ids.set(v, r);
			byRef.set(r, v);
		}
		return r;
	}
	// Unverified: types and procs give their path, other values their text.
	if (v instanceof DMType || v instanceof DMProc) return v.path;
	return stringify(v);
}

/** The object a ref text names, or null (also for a deleted or freed object). */
export function fromRef(text: string): DMObject | DMList | null {
	const o = byRef.get(text);
	if (!o) return null;
	if (o instanceof DMObject && o.deleted) {
		byRef.delete(text);
		return null;
	}
	return o;
}

/** Whether a ref text was ever handed out for this object (so there's an entry to forget). */
export function forgetRef(o: DMObject | DMList): void {
	const r = ids.get(o);
	if (r !== undefined) byRef.delete(r);
}

// World snapshot (vm/snapshot.ts): the ref table's state, saved and restored as it is.
/** The ref text already handed out for an object, if any (doesn't hand out a new one). */
export function peekRef(o: object): string | undefined {
	return ids.get(o);
}
export function restoreRef(o: object, r: string): void {
	ids.set(o, r);
}
/** The strong ref-text table and the next number; `setRefNext` restores the counter. */
export function refTable(): Map<string, DMObject | DMList> {
	return byRef;
}
export function refNext(): number {
	return next;
}
export function setRefNext(n: number): void {
	next = n;
}
