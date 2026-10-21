// From code/modules/mob/living/carbon/human/species_types/flypeople.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4079, "/datum/species/fly", "/datum/species", {
	name: "Flyperson",
	id: "fly",
	say_mod: "buzzes",
	mutanttongue: rt.typePath("/obj/item/organ/tongue/fly"),
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/fly"),
});

// /datum/species/fly/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/flypeople.dm:9)  may sleep
rt.def("/datum/species/fly/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	f.vars = () => [chem, H];
	if (!isEqual(rt.fv(f, "id", live(chem)), "pestkiller")) return f.dot;
	yield* g.callName(f, live(H), "adjustToxLoss", [3]);
	yield* g.callName(f, rt.fv(f, "reagents", live(H)), "remove_reagent", [rt.fv(f, "id", live(chem)), 0.4000000059604645]);
	return 1;
}, true);

// /datum/species/fly/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species_types/flypeople.dm:16)  may sleep
rt.def("/datum/species/fly/proc/handle_chemicals", function* handle_chemicals(f: Frame) {
	let nutri_check: Value = null, pos: Value = null;
	f.vars = () => [nutri_check, pos];
	if (truthy((rt.istype(live(f.args[0]), T("/datum/reagent/consumable")) ? 1 : 0))) {
		if (rt.gt(rt.gv(f, "nutriment_factor", (nutri_check = live(f.args[0]))), 0)) {
			pos = rt.getStep(f, live(f.args[1]), 0);
			yield* g.callName(f, live(f.args[1]), "vomit", [0, 0, 0, 2, 1]);
			yield* g.call(f, P("/proc/playsound"), null, [live(pos), rt.rsc("sound/effects/splat.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ vomits on the floor!</span>", [live(f.args[1])]), "<span class='userdanger'>You throw up on the floor!</span>"]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["chem", "H"] });

// /datum/species/fly/proc/check_weakness  (code/modules/mob/living/carbon/human/species_types/flypeople.dm:27)
rt.def("/datum/species/fly/proc/check_weakness", function check_weakness(f: Frame, weapon: Value, attacker: Value) {
	if (truthy((rt.istype(live(weapon), T("/obj/item/weapon/melee/flyswatter")) ? 1 : 0))) {
		return 29;
	}
	return 0;
});
