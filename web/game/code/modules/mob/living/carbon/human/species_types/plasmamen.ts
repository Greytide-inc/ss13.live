// From code/modules/mob/living/carbon/human/species_types/plasmamen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/species/plasmaman/proc/spec_life  (code/modules/mob/living/carbon/human/species_types/plasmamen.dm:20)  may sleep
rt.def("/datum/species/plasmaman/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let environment: Value = null, atmos_sealed: Value = null, _P: Value = null;
	f.vars = () => [H, environment, atmos_sealed, _P];
	environment = (yield* g.callName(f, rt.fv(f, "loc", live(H)), "return_air", []));
	atmos_sealed = ((rt.fv(f, "wear_suit", live(H)) && rt.bitAnd(rt.gv(f, "flags", rt.fv(f, "wear_suit", live(H))), 1)) && (rt.fv(f, "head", live(H)) && rt.bitAnd(rt.gv(f, "flags", rt.fv(f, "head", live(H))), 1)));
	if (((!truthy((rt.istype(rt.fv(f, "w_uniform", live(H)), T("/obj/item/clothing/under/plasmaman")) ? 1 : 0)) || !truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/helmet/space/plasmaman")) ? 1 : 0))) && !truthy(live(atmos_sealed)))) {
		if (truthy(live(environment))) {
			if (truthy((yield* g.callName(f, live(environment), "total_moles", [])))) {
				if ((truthy(rt.index(rt.fv(f, "gases", live(environment)), "o2")) && rt.ge(rt.index(rt.index(rt.fv(f, "gases", live(environment)), "o2"), 1), 1))) {
					yield* g.callName(f, live(H), "adjust_fire_stacks", [0.5]);
					if ((!truthy(rt.fv(f, "on_fire", live(H))) && rt.gt(rt.fv(f, "fire_stacks", live(H)), 0))) {
						yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀'s body reacts with the atmosphere and bursts into flames!</span>", [live(H)]), "<span class='userdanger'>Your body reacts with the atmosphere and bursts into flame!</span>"]);
					}
					yield* g.callName(f, live(H), "IgniteMob", []);
					rt.setSv(f, "internal_fire", 1);
				}
			}
		}
	} else {
		if (truthy(rt.fv(f, "fire_stacks", live(H)))) {
			if (truthy((rt.istype((_P = rt.fv(f, "w_uniform", live(H))), T("/obj/item/clothing/under/plasmaman")) ? 1 : 0))) {
				yield* g.callName(f, live(_P), "Extinguish", [live(H)]);
				rt.setSv(f, "internal_fire", 0);
			}
		} else {
			rt.setSv(f, "internal_fire", 0);
		}
	}
	yield* g.callName(f, live(H), "update_fire", []);
	return f.dot;
}, true);

// /datum/species/plasmaman/proc/handle_fire  (code/modules/mob/living/carbon/human/species_types/plasmamen.dm:44)  may sleep
rt.def("/datum/species/plasmaman/proc/handle_fire", function* handle_fire(f: Frame) {
	if (truthy(rt.sv(f, "internal_fire"))) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["H", "no_protection"] });

// /datum/species/plasmaman/proc/before_equip_job  (code/modules/mob/living/carbon/human/species_types/plasmamen.dm:47)  may sleep
rt.def("/datum/species/plasmaman/proc/before_equip_job", function* before_equip_job(f: Frame, J: Value, H: Value, visualsOnly: Value) {
	let O: Value = null;
	f.vars = () => [J, H, visualsOnly, O];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	O = (yield* g.new_(f, T("/datum/outfit/plasmaman"), []));
	yield* g.callName(f, live(H), "equipOutfit", [live(O), live(visualsOnly)]);
	rt.setFv(f, "internal", live(H), (yield* g.callName(f, live(H), "get_item_for_held_index", [2])));
	yield* g.callName(f, live(H), "update_internals_hud_icon", [1]);
	return 0;
}, true);

// /datum/species/plasmaman/proc/qualifies_for_rank  (code/modules/mob/living/carbon/human/species_types/plasmamen.dm:54)
rt.def("/datum/species/plasmaman/proc/qualifies_for_rank", function qualifies_for_rank(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.gl("security_positions")) ? 1 : 0))) {
		return 0;
	}
	if ((isEqual(live(f.args[0]), "Clown") || isEqual(live(f.args[0]), "Mime"))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["rank", "features"] });

// /datum/species/plasmaman/proc/random_name  (code/modules/mob/living/carbon/human/species_types/plasmamen.dm:62)
rt.def("/datum/species/plasmaman/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let randname: Value = null;
	f.vars = () => [randname];
	if (truthy(live(unique))) {
		return rt.call(f, P("/proc/random_unique_plasmaman_name"), null, []);
	}
	randname = rt.call(f, P("/proc/plasmaman_name"), null, []);
	if (truthy(live(lastname))) {
		randname = rt.modify(live(randname), fmt(" ＀", [live(lastname)]), add);
	}
	return live(randname);
});
