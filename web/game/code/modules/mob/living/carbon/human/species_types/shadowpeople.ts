// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/shadowpeople.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4107, "/datum/species/shadow", "/datum/species", {
	name: "???",
	id: "shadow",
	sexes: 0,
	blacklisted: 1,
	species_traits: null,
	dangerous_existence: 1,
	ignored_by: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/shadow"),
	mutanteyes: rt.typePath("/obj/item/organ/eyes/night_vision"),
});

// shadowpeople.dm:7
rt.def("/datum/species/shadow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.species_traits = list(10, 12, 9, 14);

	this.ignored_by = list(T("/mob/living/simple_animal/hostile/faithless"));
	return f.dot;
});

// shadowpeople.dm:16
rt.def("/datum/species/shadow/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let _T: Value = null;
	let light_amount: Value = 0;
	if (!isturf(H.loc)) return f.dot;
	if ((light_amount = (_T = H.loc).get_lumcount()) > 0.2) {
		yield* H.take_overall_damage(1, 1);
	} else {
		if (!(light_amount < 0.2)) return f.dot;
		yield* H.heal_overall_damage(1, 1);
	}
	return f.dot;
}, true);
