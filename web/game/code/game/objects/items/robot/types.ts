// Types declared in code/game/objects/items/robot that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(9809, "/obj/item/borg/cyborghug/peacekeeper", "/obj/item/borg/cyborghug", {
	shockallowed: 1,
});
rt.type(9810, "/obj/item/borg/cyborghug/medical", "/obj/item/borg/cyborghug", {
	boop: 1,
});
rt.type(9814, "/obj/item/borg/projectile_dampen/debug", "/obj/item/borg/projectile_dampen", {
	maxenergy: 50000,
	energy: 50000,
	energy_recharge: 5000,
});
rt.type(9836, "/obj/item/borg/upgrade/hypospray/expanded", "/obj/item/borg/upgrade/hypospray", {
	additional_reagents: null,
	origin_tech: "programming=5;engineering=4;biotech=5",
	name: "medical cyborg expanded hypospray",
	desc: "An upgrade to the Medical module's hypospray, allowing it to treat a wider range of conditions and problems.",
});
rt.type(9837, "/obj/item/borg/upgrade/hypospray/high_strength", "/obj/item/borg/upgrade/hypospray", {
	additional_reagents: null,
	origin_tech: "programming=5;engineering=5;biotech=6",
	name: "medical cyborg high-strength hypospray",
	desc: "An upgrade to the Medical module's hypospray, containing stronger versions of existing chemicals.",
});
