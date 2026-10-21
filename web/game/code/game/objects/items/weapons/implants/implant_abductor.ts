// From code/game/objects/items/weapons/implants/implant_abductor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7400, "/obj/item/weapon/implant/abductor", "/obj/item/weapon/implant", {
	home: null,
	cooldown: 30,
	activated: 1,
	name: "recall implant",
	desc: "Returns you to the mothership.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "implant",
	origin_tech: "materials=2;biotech=7;magnets=4;bluespace=4;abductor=5",
});

// /obj/item/weapon/implant/abductor/proc/activate  (code/game/objects/items/weapons/implants/implant_abductor.dm:12)  may sleep
rt.def("/obj/item/weapon/implant/abductor/proc/activate", function* activate(f: Frame) {
	if (isEqual(rt.sv(f, "cooldown"), rt.initial(f, live(f.src), "cooldown"))) {
		yield* g.callName(f, rt.sv(f, "home"), "Retrieve", [rt.sv(f, "imp_in"), 1]);
		rt.setSv(f, "cooldown", 0);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "imp_in"), fmt("<span class='warning'>You must wait ＀ seconds to use ＀ again!</span>", [subtract(30, rt.sv(f, "cooldown")), live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/implant/abductor/proc/process  (code/game/objects/items/weapons/implants/implant_abductor.dm:20)
rt.def("/obj/item/weapon/implant/abductor/proc/process", function process(f: Frame) {
	if (!rt.lt(rt.sv(f, "cooldown"), rt.initial(f, live(f.src), "cooldown"))) return f.dot;
	rt.incSrcVar(f, "cooldown", 1, true);
	if (!isEqual(rt.sv(f, "cooldown"), rt.initial(f, live(f.src), "cooldown"))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, false, { waitfor: false });

// /obj/item/weapon/implant/abductor/proc/implant  (code/game/objects/items/weapons/implants/implant_abductor.dm:26)  may sleep
rt.def("/obj/item/weapon/implant/abductor/proc/implant", function* implant(f: Frame) {
	let console: Value = null, H: Value = null, S: Value = null;
	f.vars = () => [console, H, S];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	console = null;
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.gv(f, "dna", (H = live(f.args[0]))))), "abductor")) {
			rt.setSv(f, "home", rt.gv(f, "pad", (console = (yield* g.srcCall(f, "get_team_console", rt.gv(f, "team", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H))))))))));
		}
	}
	if (!truthy(rt.sv(f, "home"))) {
		rt.setSv(f, "home", rt.gv(f, "pad", (console = (yield* g.srcCall(f, "get_team_console", rt.op(f, "PickUnweighted", [4], [1, 2, 3, 4]))))));
	}
	return 1;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/implant/abductor/proc/get_team_console  (code/game/objects/items/weapons/implants/implant_abductor.dm:42)
rt.def("/obj/item/weapon/implant/abductor/proc/get_team_console", function get_team_console(f: Frame, team: Value) {
	let console: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [console, c, $e];
	console = null;
	c = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (isEqual(rt.fv(f, "team", live(c)), live(team))) {
			console = live(c);
			break;
		}
	}
	rt.endFor(f, 0);
	return live(console);
});
