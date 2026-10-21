// From code/modules/mob/dead/observer/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/dead/observer/proc/Login  (code/modules/mob/dead/observer/login.dm:2)  may sleep
rt.def("/mob/dead/observer/proc/Login", function* Login(f: Frame) {
	let preferred_form: Value = null;
	f.vars = () => [preferred_form];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "ghost_accs", rt.gv(f, "ghost_accs", rt.fv(f, "prefs", rt.sv(f, "client"))));
	rt.setSv(f, "ghost_others", rt.gv(f, "ghost_others", rt.fv(f, "prefs", rt.sv(f, "client"))));
	preferred_form = null;
	if (truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.src)])))) {
		rt.setSv(f, "has_unlimited_silicon_privilege", 1);
	}
	if (truthy(rt.gv(f, "unlock_content", rt.fv(f, "prefs", rt.sv(f, "client"))))) {
		preferred_form = rt.gv(f, "ghost_form", rt.fv(f, "prefs", rt.sv(f, "client")));
		rt.setSv(f, "ghost_orbit", rt.gv(f, "ghost_orbit", rt.fv(f, "prefs", rt.sv(f, "client"))));
	}
	yield* g.srcCall(f, "update_icon", live(preferred_form));
	yield* g.srcCall(f, "updateghostimages");
	return f.dot;
}, true);
