// From Types/Atoms/_Atom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/handle_atom_del  empty
rt.def("/atom/proc/handle_atom_del", undefined, false, { args: ["A"] });

// /atom/proc/Cross  (Types/Atoms/_Atom.dm:95)
rt.def("/atom/proc/Cross", function Cross(f: Frame, O: Value) {
	return (!(truthy(rt.fv(f, "density", live(f.src))) && truthy(rt.fv(f, "density", live(O)))) ? 1 : 0);
});

// /atom/proc/Enter  (Types/Atoms/_Atom.dm:106)
rt.def("/atom/proc/Enter", function Enter(f: Frame, O: Value, oldloc: Value) {
	let content: Value = null;
	let $e: any;
	f.vars = () => [content, $e];
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(f.src)]))) {
		if (((truthy(rt.sv(f, "density")) && truthy(live(O))) && truthy(rt.fv(f, "density", live(O))))) {
			return 0;
		}
		content = null;
		rt.forList(f, 0, live(f.src), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			content = $e;
			if ((!isEqual(live(content), live(O)) && !truthy(rt.callName(f, live(content), "Cross", [live(O)])))) {
				return 0;
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /atom/proc/Exit  (Types/Atoms/_Atom.dm:115)
rt.def("/atom/proc/Exit", function Exit(f: Frame, O: Value, newloc: Value) {
	let content: Value = null, L: Value = null, sk: Value = null, r: Value = null;
	let $e: any;
	f.vars = () => [content, L, sk, r, $e];
	// stress2c: only the contents whose Uncross isn't the base one (which returns 1): hook_list, see src/vm/natives-world.ts
	if (truthy(rt.call(f, P("/proc/isturf"), null, [live(f.src)])) && (L = rt.call(f, P("/proc/hook_list"), null, [live(f.src), 1])) !== null) {
		const chk = truthy(rt.call(f, P("/proc/hook_check_mode"), null, []));
		content = null;
		rt.forList(f, 0, live(L), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			content = $e;
			if (isEqual(live(content), live(O))) continue;
			sk = (chk ? rt.call(f, P("/proc/hook_skips"), null, [live(content), 1]) : 0);
			r = rt.callName(f, live(content), "Uncross", [live(O)]);
			if (chk) rt.call(f, P("/proc/hook_check"), null, [sk, r, 1]);
			if (!truthy(live(r))) {
				return 0;
			}
		}
		rt.endFor(f, 0);
	}
	return 1;
});

// /atom/proc/New  (Types/Atoms/_Atom.dm:124)
rt.def("/atom/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["loc"] });
