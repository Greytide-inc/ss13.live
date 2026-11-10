// Based on /tg/station's code/game/mecha/medical/odysseus.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// odysseus.dm:16
rt.def("/obj/mecha/medical/odysseus/proc/moved_inside", function* moved_inside(f: Frame, H: Value) {
	let A: Value = null;
	if (yield* parent_proc()) {
		if (H.glasses && rt.istype(H.glasses, T("/obj/item/clothing/glasses/hud"))) {
			this.occupant_message(`<span class='warning'>Your ${H.glasses} prevent you from using the built-in medical hud.</span>`);
		} else {
			(A = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED)).add_hud_to(H);
			this.builtin_hud_user = 1;
		}
		return 1;
	} else {
		return 0;
	}
}, true);

// odysseus.dm:28
rt.def("/obj/mecha/medical/odysseus/proc/go_out", function* go_out(f: Frame) {
	let H: Value = null, A: Value = null;
	if (rt.istype(this.occupant, T("/mob/living/carbon/human")) && this.builtin_hud_user) {
		H = this.occupant;
		(A = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED)).remove_hud_from(H);
	}
	yield* parent_proc();
	return f.dot;
}, true);
