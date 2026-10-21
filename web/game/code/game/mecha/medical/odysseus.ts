// From code/game/mecha/medical/odysseus.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12118, "/obj/mecha/medical/odysseus", "/obj/mecha/medical", {
	builtin_hud_user: 0,
	step_in: 3,
	max_temperature: 15000,
	internal_damage_threshold: 35,
	deflect_chance: 15,
	step_energy_drain: 6,
	desc: "These exosuits are developed and produced by Vey-Med. (&copy; All rights reserved).",
	name: "１Odysseus",
	icon_state: "odysseus",
	obj_integrity: 120,
	max_integrity: 120,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/odysseus"),
});

// /obj/mecha/medical/odysseus/proc/moved_inside  (code/game/mecha/medical/odysseus.dm:16)  may sleep
rt.def("/obj/mecha/medical/odysseus/proc/moved_inside", function* moved_inside(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if ((truthy(rt.fv(f, "glasses", live(f.args[0]))) && truthy((rt.istype(rt.fv(f, "glasses", live(f.args[0])), T("/obj/item/clothing/glasses/hud")) ? 1 : 0)))) {
			yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>Your ＀ prevent you from using the built-in medical hud.</span>", [rt.fv(f, "glasses", live(f.args[0]))]));
		} else {
			yield* g.callName(f, (A = rt.index(rt.gl("huds"), 4)), "add_hud_to", [live(f.args[0])]);
			rt.setSv(f, "builtin_hud_user", 1);
		}
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true, { args: ["H"] });

// /obj/mecha/medical/odysseus/proc/go_out  (code/game/mecha/medical/odysseus.dm:28)  may sleep
rt.def("/obj/mecha/medical/odysseus/proc/go_out", function* go_out(f: Frame) {
	let H: Value = null, A: Value = null;
	f.vars = () => [H, A];
	if ((truthy((rt.istype(rt.sv(f, "occupant"), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy(rt.sv(f, "builtin_hud_user")))) {
		H = rt.sv(f, "occupant");
		yield* g.callName(f, (A = rt.index(rt.gl("huds"), 4)), "remove_hud_from", [live(H)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);
