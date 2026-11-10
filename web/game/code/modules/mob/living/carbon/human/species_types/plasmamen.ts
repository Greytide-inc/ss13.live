// Based on /tg/station's code/modules/mob/living/carbon/human/species_types/plasmamen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4105, "/datum/species/plasmaman", "/datum/species", {
	internal_fire: 0,
	name: "Plasmaman",
	id: "plasmaman",
	say_mod: "rattles",
	sexes: 0,
	species_traits: null,
	dangerous_existence: 1,
	blacklisted: 1,
	burnmod: 1.5,
	heatmod: 1.5,
	breathid: "tox",
	speedmod: 1,
	damage_overlay_type: "",
	meat: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
	mutantlungs: rt.typePath("/obj/item/organ/lungs/plasmaman"),
	mutanttongue: rt.typePath("/obj/item/organ/tongue/bone/plasmaman"),
});

// plasmamen.dm:20
rt.def("/datum/species/plasmaman/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let _P: Value = null;
	let environment: Value = H.loc.return_air();
	let atmos_sealed: Value = ((H.wear_suit && rt.bitAnd(H.wear_suit.flags, 1)) && (H.head && rt.bitAnd(H.head.flags, 1)));
	if ((!rt.istype(H.w_uniform, T("/obj/item/clothing/under/plasmaman")) || !rt.istype(H.head, T("/obj/item/clothing/head/helmet/space/plasmaman"))) && !atmos_sealed) {
		if (environment) {
			if (environment.total_moles()) {
				if (rt.index(environment.gases, "o2") && rt.index(rt.index(environment.gases, "o2"), 1) >= 1) {
					yield* H.adjust_fire_stacks(0.5);
					if (!H.on_fire && H.fire_stacks > 0) {
						H.visible_message(`<span class='danger'>${H}'s body reacts with the atmosphere and bursts into flames!</span>`, "<span class='userdanger'>Your body reacts with the atmosphere and bursts into flame!</span>");
					}
					yield* H.IgniteMob();
					this.internal_fire = 1;
				}
			}
		}
	} else if (H.fire_stacks) {
		if (rt.istype((_P = H.w_uniform), T("/obj/item/clothing/under/plasmaman"))) {
			yield* _P.Extinguish(H);
			this.internal_fire = 0;
		}
	} else {
		this.internal_fire = 0;
	}
	H.update_fire();
	return f.dot;
}, true);

// plasmamen.dm:44
rt.def("/datum/species/plasmaman/proc/handle_fire", function* handle_fire(f: Frame) {
	if (this.internal_fire) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["H", "no_protection"] });

// plasmamen.dm:47
rt.def("/datum/species/plasmaman/proc/before_equip_job", function* before_equip_job(f: Frame, J: Value, H: Value, visualsOnly: Value) {
	visualsOnly ??= 0;
	let O: Value = (yield* new_(T("/datum/outfit/plasmaman")));
	yield* H.equipOutfit(O, visualsOnly);
	H.internal = H.get_item_for_held_index(2);
	H.update_internals_hud_icon(1);
	return 0;
}, true);

// plasmamen.dm:54
rt.def("/datum/species/plasmaman/proc/qualifies_for_rank", function qualifies_for_rank(f: Frame, rank: Value, features: Value) {
	if (rt.isIn(f, rank, GLOB.security_positions)) {
		return 0;
	}
	if (rank == "Clown" || rank == "Mime") {
		return 0;
	}
	return parent_proc();
}, false);

// plasmamen.dm:62
rt.def("/datum/species/plasmaman/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	if (unique) {
		return random_unique_plasmaman_name();
	}
	let randname: Value = plasmaman_name();
	if (lastname) {
		randname += ` ${lastname}`;
	}
	return randname;
});
