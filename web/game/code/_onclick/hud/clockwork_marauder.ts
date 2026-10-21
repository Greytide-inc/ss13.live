// From code/_onclick/hud/clockwork_marauder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(66, "/datum/hud/marauder", "/datum/hud", {
	hosthealth: null,
	blockchance: null,
	counterchance: null,
});

// /datum/hud/marauder/proc/New  (code/_onclick/hud/clockwork_marauder.dm:7)  may sleep
rt.def("/datum/hud/marauder/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/clock"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setSv(f, "hosthealth", (yield* g.new_(f, T("/obj/screen/healths/clock"), [])));
	rt.setFv(f, "screen_loc", rt.sv(f, "hosthealth"), "EAST-1:28,CENTER:17");
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "hosthealth"), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/marauder/emerge"), []))), "EAST-1:28,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner"] });

// /datum/hud/marauder/proc/Destroy  (code/_onclick/hud/clockwork_marauder.dm:25)  may sleep
rt.def("/datum/hud/marauder/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "blockchance", null);
	rt.setSv(f, "counterchance", null);
	rt.setSv(f, "hosthealth", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/simple_animal/hostile/clockwork/marauder/proc/create_mob_hud  (code/_onclick/hud/clockwork_marauder.dm:28)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/marauder"), [live(f.src), (yield* g.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.fv(f, "prefs", rt.sv(f, "client")))]))])));
	return f.dot;
}, true);

rt.type(11096, "/obj/screen/marauder/emerge", "/obj/screen/marauder", {
	icon_state: "marauder_emerge",
	name: "Emerge/Return",
	desc: "Emerge or Return.",
});

// /obj/screen/marauder/emerge/proc/Click  (code/_onclick/hud/clockwork_marauder.dm:40)  may sleep
rt.def("/obj/screen/marauder/emerge/proc/Click", function* Click(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/simple_animal/hostile/clockwork/marauder")) ? 1 : 0))) return f.dot;
	if (truthy((yield* g.callName(f, (M = live(f.usr)), "is_in_host", [])))) {
		yield* g.callName(f, live(M), "try_emerge", []);
	} else {
		yield* g.callName(f, live(M), "return_to_host", []);
	}
	return f.dot;
}, true);
