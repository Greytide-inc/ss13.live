// From code/modules/surgery/organs/augments_eyes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/organ/cyberimp/eyes/hud/proc/Insert  (code/modules/surgery/organs/augments_eyes.dm:18)  may sleep
rt.def("/obj/item/organ/cyberimp/eyes/hud/proc/Insert", function* Insert(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "HUD_type"))) return f.dot;
	yield* g.callName(f, (H = rt.index(rt.gl("huds"), rt.sv(f, "HUD_type"))), "add_hud_to", [live(f.args[0])]);
	(rt.modField(f, live(f.args[0]), "permanent_huds", live(H), rt.bitOr));
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/cyberimp/eyes/hud/proc/Remove  (code/modules/surgery/organs/augments_eyes.dm:26)  may sleep
rt.def("/obj/item/organ/cyberimp/eyes/hud/proc/Remove", function* Remove(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy(rt.sv(f, "HUD_type"))) {
		H = rt.index(rt.gl("huds"), rt.sv(f, "HUD_type"));
		(rt.modField(f, live(f.args[0]), "permanent_huds", live(H), rt.bitXor));
		yield* g.callName(f, live(H), "remove_hud_from", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "special"] });
