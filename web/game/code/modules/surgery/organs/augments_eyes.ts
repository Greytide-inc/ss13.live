// Based on /tg/station's code/modules/surgery/organs/augments_eyes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(9508, "/obj/item/organ/cyberimp/eyes/hud", "/obj/item/organ/cyberimp/eyes", {
	HUD_type: 0,
	name: "HUD implant",
	desc: "These cybernetic eyes will display a HUD over everything you see. Maybe.",
	icon_state: "eye_implant",
	implant_overlay: "eye_implant_overlay",
	slot: "eye_hud",
	zone: "eyes",
	w_class: 1,
});

// augments_eyes.dm:18
rt.def("/obj/item/organ/cyberimp/eyes/hud/proc/Insert", function* Insert(f: Frame) {
	let H: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!this.HUD_type) return f.dot;
	(H = rt.index(GLOB.huds, this.HUD_type)).add_hud_to(f.args[0]);
	(rt.modField(f, f.args[0], "permanent_huds", H, rt.bitOr));
	return f.dot;
}, true, { args: ["M", "special"] });

// augments_eyes.dm:26
rt.def("/obj/item/organ/cyberimp/eyes/hud/proc/Remove", function* Remove(f: Frame) {
	let H: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (this.HUD_type) {
		H = rt.index(GLOB.huds, this.HUD_type);
		(rt.modField(f, f.args[0], "permanent_huds", H, rt.bitXor));
		H.remove_hud_from(f.args[0]);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });
