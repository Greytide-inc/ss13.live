// screen.ts - fixture for the client.screen section (tests/engine-sections.ts runScreenCheck): the DM tests/dm/screen_helpers.dm.
import type { Frame, Value } from "./lib.js";
import { rt } from "./lib.js";
const { T, live, add, subtract, isEqual } = rt;

rt.type("/obj/screentest", "/obj", {});

rt.def("/proc/screen_make", function screen_make(f: Frame, n: Value) {
	const L = rt.list();
	for (let i = 1; rt.le(i, n); i++) {
		const O = rt.new_(f, T("/obj/screentest"), []);
		rt.set(f, live(O), "screen_loc", rt.fmt("＀,1", [i]));
		L.push(O);
	}
	return L;
});

rt.def("/proc/screen_open", function screen_open(f: Frame, C: Value, things: Value) {
	rt.modField(f, live(C), "screen", live(things), rt.bitOr);
	return f.dot;
});

rt.def("/proc/screen_close", function screen_close(f: Frame, C: Value, things: Value) {
	rt.modField(f, live(C), "screen", live(things), subtract);
	return f.dot;
});

rt.def("/proc/screen_len", function screen_len(f: Frame, C: Value) {
	return rt.get(f, rt.get(f, live(C), "screen"), "len");
});

// Same steps as tests/screen-dup (BYOND 511: T lines 1,0,0,2,0,0,1 with P first).
rt.def("/proc/screen_dup", function screen_dup(f: Frame, C: Value) {
	const O = rt.new_(f, T("/obj/screentest"), []);
	const P = rt.new_(f, T("/obj/screentest"), []);
	const L = rt.list(O, P);
	let r: Value = "";
	const scr = () => rt.get(f, live(C), "screen");
	const len = () => rt.get(f, scr(), "len");
	const mod = (v: Value, op: typeof add) => rt.modField(f, live(C), "screen", live(v), op);
	rt.callName(f, scr(), "Cut", []);
	mod(O, add);
	mod(O, add);
	r = add(r, rt.fmt("＀,", [len()]));
	mod(O, subtract);
	r = add(r, rt.fmt("＀,", [len()]));
	mod(O, subtract);
	r = add(r, rt.fmt("＀,", [len()]));
	mod(L, rt.bitOr);
	mod(L, rt.bitOr);
	r = add(r, rt.fmt("＀,", [len()]));
	mod(L, subtract);
	r = add(r, rt.fmt("＀,", [len()]));
	mod(O, add);
	mod(O, add);
	mod(P, add);
	mod(L, subtract);
	r = add(r, rt.fmt("＀,", [len()]));
	rt.callName(f, scr(), "Cut", []);
	mod(O, add);
	mod(P, add);
	mod(O, add);
	mod(O, subtract);
	r = add(r, rt.fmt("＀＀", [len(), live(len()) && isEqual(rt.index(scr(), 1), P) ? "P" : "?"]));
	return r;
});
