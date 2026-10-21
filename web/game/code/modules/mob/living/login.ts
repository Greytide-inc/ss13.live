// From code/modules/mob/living/login.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/Login  (code/modules/mob/living/login.dm:2)  may sleep
rt.def("/mob/living/proc/Login", function* Login(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "sync_mind");
	yield* g.callName(f, rt.sv(f, "mind"), "show_memory", [live(f.src), 0]);
	if (truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		$0 = rt.gv(f, "name", rt.fv(f, "mode", rt.gl("SSticker")));
		if ($0 === "sandbox") {
			yield* g.srcCall(f, "CanBuild");
		}
	}
	yield* g.srcCall(f, "update_damage_hud");
	yield* g.srcCall(f, "update_health_hud");
	if (truthy(rt.sv(f, "ventcrawler"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You can ventcrawl! Use alt+click on vents to quickly travel about the station.</span>"]);
	}
	if (!truthy(rt.sv(f, "ranged_ability"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "ranged_ability"), "add_ranged_ability", [live(f.src), fmt("<span class='notice'>You currently have <b>＀</b> active!</span>", [rt.sv(f, "ranged_ability")])]);
	return f.dot;
}, true);
