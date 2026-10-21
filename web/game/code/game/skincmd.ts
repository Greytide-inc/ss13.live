// From code/game/skincmd.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/verb/skincmd  (code/game/skincmd.dm:10)
rt.def("/mob/verb/skincmd", function skincmd(f: Frame, data: Value) {
	let ref: Value = null, a: Value = null;
	f.vars = () => [ref, a];
	ref = rt.call(f, P("/proc/copytext"), null, [live(data), 1, rt.call(f, P("/proc/findtext"), null, [live(data), ";"])]);
	if (rt.index(rt.fv(f, "skincmds", live(f.src)), live(ref)) === null) return f.dot;
	rt.callName(f, (a = rt.index(rt.fv(f, "skincmds", live(f.src)), live(ref))), "SkinCmd", [live(f.src), rt.call(f, P("/proc/copytext"), null, [live(data), add(rt.call(f, P("/proc/findtext"), null, [live(data), ";"]), 1)])]);
	return f.dot;
}, false, { hidden: true, argTypes: [{ type: 2 }] });
