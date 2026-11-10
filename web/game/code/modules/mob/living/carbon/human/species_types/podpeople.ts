// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/podpeople.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4106, "/datum/species/pod", "/datum/species", {
	name: "Podperson",
	id: "pod",
	default_color: "59CE00",
	species_traits: null,
	attack_verb: "slash",
	attack_sound: rt.rsc("sound/weapons/slice.ogg"),
	miss_sound: rt.rsc("sound/weapons/slashmiss.ogg"),
	burnmod: 1.25,
	heatmod: 1.5,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human/mutant/plant"),
});

// podpeople.dm:15
rt.def("/datum/species/pod/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, C, "faction", "plants", rt.bitOr));
	(rt.modField(f, C, "faction", "vines", rt.bitOr));
	return f.dot;
}, true);

// podpeople.dm:20
rt.def("/datum/species/pod/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.dot = (yield* parent_proc());
	C.faction -= "plants";
	C.faction -= "vines";
	return f.dot;
}, true);

// podpeople.dm:25
rt.def("/datum/species/pod/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let _T: Value = null;
	if (H.stat == 2) {
		return f.dot;
	}
	let light_amount: Value = 0;
	if (isturf(H.loc)) {
		_T = H.loc;
		light_amount = min(1, _T.get_lumcount()) - 0.5;
		H.nutrition += light_amount * 10;
		if (H.nutrition > NUTRITION_LEVEL_FULL) {
			H.nutrition = NUTRITION_LEVEL_FULL;
		}
		if (light_amount > 0.2) {
			yield* H.heal_overall_damage(1, 1);
			yield* H.adjustToxLoss(-1);
			yield* H.adjustOxyLoss(-1);
		}
	}
	if (!(H.nutrition < 200)) return f.dot;
	yield* H.take_overall_damage(2, 0);
	return f.dot;
}, true);

// podpeople.dm:43
rt.def("/datum/species/pod/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	if (chem.id != "plantbgone") return f.dot;
	yield* H.adjustToxLoss(3);
	yield* H.reagents.remove_reagent(chem.id, REAGENTS_METABOLISM);
	return 1;
}, true);

// podpeople.dm:49
rt.def("/datum/species/pod/proc/on_hit", function* on_hit(f: Frame, _P: Value, H: Value) {
	let $0: any = _P.type;
	if ($0 == T("/obj/item/projectile/energy/floramut")) {
		if (prob(15)) {
			yield* H.rad_act(rand(30, 80));
			yield* H.Knockdown(100);
			H.visible_message(`<span class='warning'>${H} writhes in pain as ${H.p_their()} vacuoles boil.</span>`, "<span class='userdanger'>You writhe in pain as your vacuoles boil!</span>", "<span class='italics'>You hear the crunching of leaves.</span>");
			if (prob(80)) {
				yield* H.randmutb();
			} else {
				yield* H.randmutg();
			}
			yield* H.domutcheck();
		} else {
			yield* H.adjustFireLoss(rand(5, 15));
			H.show_message("<span class='userdanger'>The radiation beam singes you!</span>");
		}
	} else if ($0 == T("/obj/item/projectile/energy/florayield")) {
		H.nutrition = min(H.nutrition + 30, NUTRITION_LEVEL_FULL);
	}
	return f.dot;
}, true);
