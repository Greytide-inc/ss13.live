// From code/modules/mob/living/silicon/ai/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/silicon/ai/proc/Login  (code/modules/mob/living/silicon/ai/login.dm:2)  may sleep
rt.def("/mob/living/silicon/ai/proc/Login", function* Login(f: Frame) {
	let rune: Value = null, blood: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [rune, blood, O, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rune = null;
	rt.forList(f, 0, rt.world(), T("/obj/effect/rune"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rune = $e;
		rt.setFv(f, "override", (blood = (yield* g.call(f, P("/proc/image"), null, ["loc", live(rune)], rt.Args.Named))), 1);
		rt.modField(f, rt.sv(f, "client"), "images", live(blood), add);
	}
	rt.endFor(f, 0);
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		O = null;
		rt.forList(f, 0, rt.gl("ai_status_displays"), T("/obj/machinery/ai_status_display"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			rt.setFv(f, "mode", live(O), 1);
			rt.setFv(f, "emotion", live(O), "Neutral");
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "view_core");
	return f.dot;
}, true);
