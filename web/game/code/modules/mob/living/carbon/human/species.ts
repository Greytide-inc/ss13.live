// From code/modules/mob/living/carbon/human/species.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4074, "/datum/species", "/datum", {
	id: null,
	limbs_id: null,
	name: null,
	roundstart: 0,
	default_color: "#FFF",
	sexes: 1,
	face_y_offset: 0,
	hair_y_offset: 0,
	hair_color: null,
	hair_alpha: 255,
	use_skintones: 0,
	exotic_blood: "",
	exotic_bloodtype: "",
	skinned_type: null,
	no_equip: null,
	nojumpsuit: 0,
	blacklisted: 0,
	dangerous_existence: null,
	say_mod: "says",
	default_features: null,
	mutant_bodyparts: null,
	mutant_organs: null,
	speedmod: 0,
	armor: 0,
	brutemod: 1,
	burnmod: 1,
	coldmod: 1,
	heatmod: 1,
	stunmod: 1,
	punchdamagelow: 0,
	punchdamagehigh: 9,
	punchstunthreshold: 9,
	siemens_coeff: 1,
	damage_overlay_type: "human",
	fixed_mut_color: "",
	species_traits: null,
	attack_verb: "punch",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	miss_sound: rt.rsc("sound/weapons/punchmiss.ogg"),
	ignored_by: null,
	mutantlungs: null,
	breathid: "o2",
	override_float: 0,
	mutanthands: null,
	meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/human"),
	mutanteyes: rt.typePath("/obj/item/organ/eyes"),
	mutantears: rt.typePath("/obj/item/organ/ears"),
	mutanttongue: rt.typePath("/obj/item/organ/tongue"),
});

// /datum/species/proc/<init>  (code/modules/mob/living/carbon/human/species.dm:32)
rt.def("/datum/species/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "no_equip", rt.list());
	$0 = $0;
	rt.setSv(f, "default_features", rt.list());
	$0 = $0;
	rt.setSv(f, "mutant_bodyparts", rt.list());
	$0 = $0;
	rt.setSv(f, "mutant_organs", rt.list());
	$0 = $0;
	rt.setSv(f, "species_traits", rt.list());
	$0 = $0;
	rt.setSv(f, "ignored_by", rt.list());
	return f.dot;
});

// /datum/species/proc/New  (code/modules/mob/living/carbon/human/species.dm:81)
rt.def("/datum/species/proc/New", function New(f: Frame) {
	if (!truthy(rt.sv(f, "limbs_id"))) {
		rt.setSv(f, "limbs_id", rt.sv(f, "id"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/species/proc/random_name  (code/modules/mob/living/carbon/human/species.dm:88)
rt.def("/datum/species/proc/random_name", function random_name(f: Frame, gender: Value, unique: Value, lastname: Value) {
	let randname: Value = null;
	f.vars = () => [randname];
	if (truthy(live(unique))) {
		return rt.call(f, P("/proc/random_unique_name"), null, [live(gender)]);
	}
	randname = null;
	if (isEqual(live(gender), "male")) {
		randname = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
	} else {
		randname = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
	}
	if (truthy(live(lastname))) {
		randname = rt.modify(live(randname), fmt(" ＀", [live(lastname)]), add);
	} else {
		randname = rt.modify(live(randname), fmt(" ＀", [rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]), add);
	}
	return live(randname);
});

// /datum/species/proc/qualifies_for_rank  (code/modules/mob/living/carbon/human/species.dm:106)
rt.def("/datum/species/proc/qualifies_for_rank", function qualifies_for_rank(f: Frame, rank: Value, features: Value) {
	if (truthy((rt.isIn(f, live(rank), rt.gl("command_positions")) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

// /datum/species/proc/on_species_gain  (code/modules/mob/living/carbon/human/species.dm:112)  may sleep
rt.def("/datum/species/proc/on_species_gain", function* on_species_gain(f: Frame, C: Value, old_species: Value) {
	let slot_id: Value = null, thing: Value = null, heart: Value = null, lungs: Value = null, appendix: Value = null, eyes: Value = null, ears: Value = null, tongue: Value = null, path: Value = null, I: Value = null, I_6: Value = null, V: Value = null;
	let $e: any;
	f.vars = () => [C, old_species, slot_id, thing, heart, lungs, appendix, eyes, ears, tongue, path, I, I_6, V, $e];
	slot_id = null;
	rt.forList(f, 0, rt.sv(f, "no_equip"));
	while (($e = rt.next(f, 0)) !== undefined) {
		slot_id = $e;
		if ((truthy((thing = (yield* g.callName(f, live(C), "get_item_by_slot", [live(slot_id)])))) && (!truthy(rt.fv(f, "species_exception", live(thing))) || !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.fv(f, "species_exception", live(thing))])))))) {
			yield* g.callName(f, live(C), "dropItemToGround", [live(thing)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "hud_used", live(C)))) {
		yield* g.callName(f, rt.fv(f, "hud_used", live(C)), "update_locked_slots", []);
	}
	if ((truthy((rt.isIn(f, "legs", rt.gv(f, "mutant_bodyparts", rt.gv(f, "species", rt.fv(f, "dna", live(C))))) ? 1 : 0)) && isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(C))), "legs"), "Digitigrade Legs"))) {
		rt.modSrcVar(f, "species_traits", 25, add);
	}
	if (truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0))) {
		yield* g.callName(f, live(C), "Digitigrade_Leg_Swap", [0]);
	}
	heart = (yield* g.callName(f, live(C), "getorganslot", ["heart"]));
	lungs = (yield* g.callName(f, live(C), "getorganslot", ["lungs"]));
	appendix = (yield* g.callName(f, live(C), "getorganslot", ["appendix"]));
	eyes = (yield* g.callName(f, live(C), "getorganslot", ["eye_sight"]));
	ears = (yield* g.callName(f, live(C), "getorganslot", ["ears"]));
	tongue = (yield* g.callName(f, live(C), "getorganslot", ["tongue"]));
	if ((truthy((rt.isIn(f, 12, rt.sv(f, "species_traits")) ? 1 : 0)) && truthy(live(heart)))) {
		yield* g.callName(f, live(heart), "Remove", [live(C)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(heart)]);
	} else {
		if ((!truthy((rt.isIn(f, 12, rt.sv(f, "species_traits")) ? 1 : 0)) && !truthy(live(heart)))) {
			yield* g.callName(f, (heart = (yield* g.new_(f, T("/obj/item/organ/heart"), []))), "Insert", [live(C)]);
		}
	}
	if (truthy(live(lungs))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(lungs)]);
		lungs = null;
	}
	if (truthy((yield* g.callName(f, live(C), "get_bodypart", ["head"])))) {
		if (truthy(live(eyes))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(eyes)]);
			yield* g.callName(f, (eyes = (yield* g.new_(f, rt.sv(f, "mutanteyes"), []))), "Insert", [live(C)]);
		}
		if (truthy(live(ears))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(ears)]);
			yield* g.callName(f, (ears = (yield* g.new_(f, rt.sv(f, "mutantears"), []))), "Insert", [live(C)]);
		}
		if (truthy(live(tongue))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(tongue)]);
			yield* g.callName(f, (tongue = (yield* g.new_(f, rt.sv(f, "mutanttongue"), []))), "Insert", [live(C)]);
		}
	}
	if ((!truthy((rt.isIn(f, 10, rt.sv(f, "species_traits")) ? 1 : 0)) && !truthy(live(lungs)))) {
		if (truthy(rt.sv(f, "mutantlungs"))) {
			lungs = (yield* g.new_(f, rt.sv(f, "mutantlungs"), []));
		} else {
			lungs = (yield* g.new_(f, T("/obj/item/organ/lungs"), []));
		}
		yield* g.callName(f, live(lungs), "Insert", [live(C)]);
	}
	if ((truthy((rt.isIn(f, 19, rt.sv(f, "species_traits")) ? 1 : 0)) && truthy(live(appendix)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(appendix)]);
	} else {
		if ((!truthy((rt.isIn(f, 19, rt.sv(f, "species_traits")) ? 1 : 0)) && !truthy(live(appendix)))) {
			yield* g.callName(f, (appendix = (yield* g.new_(f, T("/obj/item/organ/appendix"), []))), "Insert", [live(C)]);
		}
	}
	path = null;
	rt.forList(f, 0, rt.sv(f, "mutant_organs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		yield* g.callName(f, (I = (yield* g.new_(f, live(path), []))), "Insert", [live(C)]);
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "exotic_bloodtype")) && !isEqual(rt.gv(f, "blood_type", rt.fv(f, "dna", live(C))), rt.sv(f, "exotic_bloodtype")))) {
		rt.setFv(f, "blood_type", rt.fv(f, "dna", live(C)), rt.sv(f, "exotic_bloodtype"));
	}
	if (truthy(rt.fv(f, "mutanthands", live(old_species)))) {
		I_6 = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(C)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I_6 = $e;
			if (truthy(rt.op(f, "IsType", [], [live(I_6), rt.fv(f, "mutanthands", live(old_species))]))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(I_6)]);
			}
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "mutanthands"))) return f.dot;
	V = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(C)));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy((rt.istype((I = live(V)), T("/obj/item")) ? 1 : 0))) {
			yield* g.callName(f, live(C), "dropItemToGround", [live(I)]);
		} else {
			yield* g.callName(f, live(C), "put_in_hands", [(yield* g.new_(f, rt.sv(f, "mutanthands"), []))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/species/proc/on_species_loss  (code/modules/mob/living/carbon/human/species.dm:195)  may sleep
rt.def("/datum/species/proc/on_species_loss", function* on_species_loss(f: Frame, C: Value) {
	f.vars = () => [C];
	if (truthy(rt.gv(f, "exotic_bloodtype", rt.gv(f, "species", rt.fv(f, "dna", live(C)))))) {
		rt.setFv(f, "blood_type", rt.fv(f, "dna", live(C)), (yield* g.call(f, P("/proc/random_blood_type"), null, [])));
	}
	if (!truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(C), "Digitigrade_Leg_Swap", [1]);
	return f.dot;
}, true);

// /datum/species/proc/handle_hair  (code/modules/mob/living/carbon/human/species.dm:201)  may sleep
rt.def("/datum/species/proc/handle_hair", function* handle_hair(f: Frame, H: Value, forced_colour: Value) {
	let HD: Value = null, S: Value = null, standing: Value = null, hair_hidden: Value = null, facialhair_hidden: Value = null, dynamic_hair_suffix: Value = null, dynamic_fhair_suffix: Value = null, I: Value = null, C: Value = null, M: Value = null, fhair_extensions: Value = null, s: Value = null, fhair_state: Value = null, fhair_file: Value = null, facial_overlay: Value = null, hair_overlay: Value = null, hair_extensions: Value = null, s_9: Value = null, hair_state: Value = null, hair_file: Value = null;
	let $e: any;
	f.vars = () => [H, forced_colour, HD, S, standing, hair_hidden, facialhair_hidden, dynamic_hair_suffix, dynamic_fhair_suffix, I, C, M, fhair_extensions, s, fhair_state, fhair_file, facial_overlay, hair_overlay, hair_extensions, s_9, hair_state, hair_file, $e];
	yield* g.callName(f, live(H), "remove_overlay", [8]);
	if (!truthy((HD = (yield* g.callName(f, live(H), "get_bodypart", ["head"]))))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 64))) {
		return live(f.dot);
	}
	S = null;
	standing = rt.list();
	hair_hidden = 0;
	facialhair_hidden = 0;
	dynamic_hair_suffix = "";
	dynamic_fhair_suffix = "";
	if (truthy(rt.fv(f, "head", live(H)))) {
		if (truthy((rt.istype((I = rt.fv(f, "head", live(H))), T("/obj/item/clothing")) ? 1 : 0))) {
			dynamic_fhair_suffix = rt.gv(f, "dynamic_fhair_suffix", (C = live(I)));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(I)), 512))) {
			facialhair_hidden = 1;
		}
	}
	if (truthy(rt.fv(f, "wear_mask", live(H)))) {
		dynamic_fhair_suffix = rt.gv(f, "dynamic_fhair_suffix", (M = rt.fv(f, "wear_mask", live(H))));
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(M)), 512))) {
			facialhair_hidden = 1;
		}
	}
	if (((truthy(rt.fv(f, "facial_hair_style", live(H))) && truthy((rt.isIn(f, 3, rt.sv(f, "species_traits")) ? 1 : 0))) && (!truthy(live(facialhair_hidden)) || truthy(live(dynamic_fhair_suffix))))) {
		if (truthy((S = rt.index(rt.gl("facial_hair_styles_list"), rt.fv(f, "facial_hair_style", live(H)))))) {
			if (!truthy(rt.gl("fextensions"))) {
				fhair_extensions = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/mob/facialhair_extensions.dmi")]));
				rt.setGl("fextensions", rt.list());
				s = null;
				rt.forList(f, 0, (yield* g.callName(f, live(fhair_extensions), "IconStates", [1])));
				while (($e = rt.next(f, 0)) !== undefined) {
					s = $e;
					rt.setAt(rt.gl("fextensions"), live(s), 1);
				}
				rt.endFor(f, 0);
				yield* g.call(f, P("/proc/qdel"), null, [live(fhair_extensions)]);
			}
			fhair_state = rt.fv(f, "icon_state", live(S));
			fhair_file = rt.fv(f, "icon", live(S));
			if (truthy(rt.index(rt.gl("fextensions"), add(live(fhair_state), live(dynamic_fhair_suffix))))) {
				fhair_state = rt.modify(live(fhair_state), live(dynamic_fhair_suffix), add);
				fhair_file = rt.rsc("icons/mob/facialhair_extensions.dmi");
			}
			facial_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [live(fhair_file), live(fhair_state), -8]));
			if (!truthy(live(forced_colour))) {
				if (truthy(rt.sv(f, "hair_color"))) {
					if (isEqual(rt.sv(f, "hair_color"), "mutcolor")) {
						rt.setFv(f, "color", live(facial_overlay), add("#", rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor")));
					} else {
						rt.setFv(f, "color", live(facial_overlay), add("#", rt.sv(f, "hair_color")));
					}
				} else {
					rt.setFv(f, "color", live(facial_overlay), add("#", rt.fv(f, "facial_hair_color", live(H))));
				}
			} else {
				rt.setFv(f, "color", live(facial_overlay), live(forced_colour));
			}
			rt.setFv(f, "alpha", live(facial_overlay), rt.sv(f, "hair_alpha"));
			standing = rt.modify(live(standing), live(facial_overlay), add);
		}
	}
	if (truthy(rt.fv(f, "head", live(H)))) {
		if (truthy((rt.istype((I = rt.fv(f, "head", live(H))), T("/obj/item/clothing")) ? 1 : 0))) {
			dynamic_hair_suffix = rt.gv(f, "dynamic_hair_suffix", (C = live(I)));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(I)), 256))) {
			hair_hidden = 1;
		}
	}
	if (truthy(rt.fv(f, "wear_mask", live(H)))) {
		M = rt.fv(f, "wear_mask", live(H));
		if (!truthy(live(dynamic_hair_suffix))) {
			dynamic_hair_suffix = rt.fv(f, "dynamic_hair_suffix", live(M));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(M)), 256))) {
			hair_hidden = 1;
		}
	}
	if ((!truthy(live(hair_hidden)) || truthy(live(dynamic_hair_suffix)))) {
		hair_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, ["layer", -8], rt.Args.Named));
		if ((!truthy(live(hair_hidden)) && !truthy((yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/brain")]))))) {
			if (!truthy((rt.isIn(f, 12, rt.sv(f, "species_traits")) ? 1 : 0))) {
				rt.setFv(f, "icon", live(hair_overlay), rt.rsc("icons/mob/human_face.dmi"));
				rt.setFv(f, "icon_state", live(hair_overlay), "debrained");
			}
		} else {
			if ((truthy(rt.fv(f, "hair_style", live(H))) && truthy((rt.isIn(f, 2, rt.sv(f, "species_traits")) ? 1 : 0)))) {
				if (truthy((S = rt.index(rt.gl("hair_styles_list"), rt.fv(f, "hair_style", live(H)))))) {
					if (!truthy(rt.gl("extensions"))) {
						hair_extensions = (yield* g.call(f, P("/proc/icon"), null, [rt.rsc("icons/mob/hair_extensions.dmi")]));
						rt.setGl("extensions", rt.list());
						s_9 = null;
						rt.forList(f, 0, (yield* g.callName(f, live(hair_extensions), "IconStates", [1])));
						while (($e = rt.next(f, 0)) !== undefined) {
							s_9 = $e;
							rt.setAt(rt.gl("extensions"), live(s_9), 1);
						}
						rt.endFor(f, 0);
						yield* g.call(f, P("/proc/qdel"), null, [live(hair_extensions)]);
					}
					hair_state = rt.fv(f, "icon_state", live(S));
					hair_file = rt.fv(f, "icon", live(S));
					if (truthy(rt.index(rt.gl("extensions"), add(live(hair_state), live(dynamic_hair_suffix))))) {
						hair_state = rt.modify(live(hair_state), live(dynamic_hair_suffix), add);
						hair_file = rt.rsc("icons/mob/hair_extensions.dmi");
					}
					rt.setFv(f, "icon", live(hair_overlay), live(hair_file));
					rt.setFv(f, "icon_state", live(hair_overlay), live(hair_state));
					if (!truthy(live(forced_colour))) {
						if (truthy(rt.sv(f, "hair_color"))) {
							if (isEqual(rt.sv(f, "hair_color"), "mutcolor")) {
								rt.setFv(f, "color", live(hair_overlay), add("#", rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor")));
							} else {
								rt.setFv(f, "color", live(hair_overlay), add("#", rt.sv(f, "hair_color")));
							}
						} else {
							rt.setFv(f, "color", live(hair_overlay), add("#", rt.fv(f, "hair_color", live(H))));
						}
					} else {
						rt.setFv(f, "color", live(hair_overlay), live(forced_colour));
					}
					rt.setFv(f, "alpha", live(hair_overlay), rt.sv(f, "hair_alpha"));
					rt.modField(f, live(hair_overlay), "pixel_y", rt.sv(f, "hair_y_offset"), add);
				}
			}
		}
		if (truthy(rt.fv(f, "icon", live(hair_overlay)))) {
			standing = rt.modify(live(standing), live(hair_overlay), add);
		}
	}
	if (truthy(rt.len(f, live(standing)))) {
		rt.setAt(rt.fv(f, "overlays_standing", live(H)), 8, live(standing));
	}
	yield* g.callName(f, live(H), "apply_overlay", [8]);
	return f.dot;
}, true);

// /datum/species/proc/handle_body  (code/modules/mob/living/carbon/human/species.dm:336)  may sleep
rt.def("/datum/species/proc/handle_body", function* handle_body(f: Frame, H: Value) {
	let standing: Value = null, HD: Value = null, lip_overlay: Value = null, eye_overlay: Value = null, underwear: Value = null, undershirt: Value = null, socks: Value = null;
	f.vars = () => [H, standing, HD, lip_overlay, eye_overlay, underwear, undershirt, socks];
	yield* g.callName(f, live(H), "remove_overlay", [22]);
	standing = rt.list();
	HD = (yield* g.callName(f, live(H), "get_bodypart", ["head"]));
	if (!truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 64))) {
		if (((truthy(rt.fv(f, "lip_style", live(H))) && truthy((rt.isIn(f, 5, rt.sv(f, "species_traits")) ? 1 : 0))) && truthy(live(HD)))) {
			rt.setFv(f, "color", (lip_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/human_face.dmi"), fmt("lips_＀", [rt.fv(f, "lip_style", live(H))]), -22]))), rt.fv(f, "lip_color", live(H)));
			rt.modField(f, live(lip_overlay), "pixel_y", rt.sv(f, "face_y_offset"), add);
			standing = rt.modify(live(standing), live(lip_overlay), add);
		}
		if ((truthy((rt.isIn(f, 4, rt.sv(f, "species_traits")) ? 1 : 0)) && truthy(live(HD)))) {
			rt.setFv(f, "color", (eye_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/human_face.dmi"), "eyes", -22]))), add("#", rt.fv(f, "eye_color", live(H))));
			rt.modField(f, live(eye_overlay), "pixel_y", rt.sv(f, "face_y_offset"), add);
			standing = rt.modify(live(standing), live(eye_overlay), add);
		}
	}
	if (!truthy((rt.isIn(f, 26, rt.sv(f, "species_traits")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "underwear", live(H)))) {
			if (truthy((underwear = rt.index(rt.gl("underwear_list"), rt.fv(f, "underwear", live(H)))))) {
				standing = rt.modify(live(standing), (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(underwear)), rt.fv(f, "icon_state", live(underwear)), -22])), add);
			}
		}
		if (truthy(rt.fv(f, "undershirt", live(H)))) {
			if (truthy((undershirt = rt.index(rt.gl("undershirt_list"), rt.fv(f, "undershirt", live(H)))))) {
				if ((truthy(rt.gv(f, "sexes", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && isEqual(rt.fv(f, "gender", live(H)), "female"))) {
					standing = rt.modify(live(standing), (yield* g.call(f, P("/proc/wear_female_version"), null, [rt.fv(f, "icon_state", live(undershirt)), rt.fv(f, "icon", live(undershirt)), 22])), add);
				} else {
					standing = rt.modify(live(standing), (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(undershirt)), rt.fv(f, "icon_state", live(undershirt)), -22])), add);
				}
			}
		}
		if (((truthy(rt.fv(f, "socks", live(H))) && rt.ge((yield* g.callName(f, live(H), "get_num_legs", [])), 2)) && !truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0)))) {
			if (truthy((socks = rt.index(rt.gl("socks_list"), rt.fv(f, "socks", live(H)))))) {
				standing = rt.modify(live(standing), (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", live(socks)), rt.fv(f, "icon_state", live(socks)), -22])), add);
			}
		}
	}
	if (truthy(rt.len(f, live(standing)))) {
		rt.setAt(rt.fv(f, "overlays_standing", live(H)), 22, live(standing));
	}
	yield* g.callName(f, live(H), "apply_overlay", [22]);
	yield* g.srcCall(f, "handle_mutant_bodyparts", live(H));
	return f.dot;
}, true);

// /datum/species/proc/handle_mutant_bodyparts  (code/modules/mob/living/carbon/human/species.dm:384)  may sleep
rt.def("/datum/species/proc/handle_mutant_bodyparts", function* handle_mutant_bodyparts(f: Frame, H: Value, forced_colour: Value) {
	let bodyparts_to_add: Value = null, relevent_layers: Value = null, standing: Value = null, HD: Value = null, update_needed: Value = null, not_digitigrade: Value = null, X: Value = null, O: Value = null, should_be_squished: Value = null, _g: Value = null, layer: Value = null, layertext: Value = null, bodypart: Value = null, S: Value = null, accessory_overlay: Value = null, inner_accessory_overlay: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, forced_colour, bodyparts_to_add, relevent_layers, standing, HD, update_needed, not_digitigrade, X, O, should_be_squished, _g, layer, layertext, bodypart, S, accessory_overlay, inner_accessory_overlay, $0, $e];
	bodyparts_to_add = (yield* g.callName(f, rt.sv(f, "mutant_bodyparts"), "Copy", []));
	relevent_layers = rt.list(25, 23, 2);
	standing = rt.list();
	yield* g.callName(f, live(H), "remove_overlay", [25]);
	yield* g.callName(f, live(H), "remove_overlay", [23]);
	yield* g.callName(f, live(H), "remove_overlay", [2]);
	if (!truthy(rt.sv(f, "mutant_bodyparts"))) {
		return live(f.dot);
	}
	HD = (yield* g.callName(f, live(H), "get_bodypart", ["head"]));
	if (truthy((rt.isIn(f, "tail_lizard", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "tail_lizard", subtract));
		}
	}
	if (truthy((rt.isIn(f, "waggingtail_lizard", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingtail_lizard", subtract));
		} else {
			if (truthy((rt.isIn(f, "tail_lizard", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
				(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingtail_lizard", subtract));
			}
		}
	}
	if (truthy((rt.isIn(f, "tail_human", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "tail_human", subtract));
		}
	}
	if (truthy((rt.isIn(f, "waggingtail_human", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingtail_human", subtract));
		} else {
			if (truthy((rt.isIn(f, "tail_human", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
				(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingtail_human", subtract));
			}
		}
	}
	if (truthy((rt.isIn(f, "spines", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines"), "None")) || (truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4))))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "spines", subtract));
		}
	}
	if (truthy((rt.isIn(f, "waggingspines", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines"), "None")) || (truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4))))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingspines", subtract));
		} else {
			if (truthy((rt.isIn(f, "tail", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
				(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "waggingspines", subtract));
			}
		}
	}
	if (truthy((rt.isIn(f, "snout", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((((truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_mask", live(H))), 128))) || (truthy(rt.fv(f, "head", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 128)))) || !truthy(live(HD))) || isEqual(rt.fv(f, "status", live(HD)), 2))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "snout", subtract));
		}
	}
	if (truthy((rt.isIn(f, "frills", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "frills")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "frills"), "None")) || (truthy(rt.fv(f, "head", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 32)))) || !truthy(live(HD))) || isEqual(rt.fv(f, "status", live(HD)), 2))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "frills", subtract));
		}
	}
	if (truthy((rt.isIn(f, "horns", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((((((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "horns")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "horns"), "None")) || (truthy(rt.fv(f, "head", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 256)))) || (truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_mask", live(H))), 256)))) || !truthy(live(HD))) || isEqual(rt.fv(f, "status", live(HD)), 2))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "horns", subtract));
		}
	}
	if (truthy((rt.isIn(f, "ears", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if ((((((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears"), "None")) || (truthy(rt.fv(f, "head", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "head", live(H))), 256)))) || (truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_mask", live(H))), 256)))) || !truthy(live(HD))) || isEqual(rt.fv(f, "status", live(HD)), 2))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "ears", subtract));
		}
	}
	if (truthy((rt.isIn(f, "wings", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((!truthy(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings")) || isEqual(rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings"), "None")) || ((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4))) && (!truthy(rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))) || !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))]))))))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "wings", subtract));
		}
	}
	if (truthy((rt.isIn(f, "wings_open", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
		if (((truthy(rt.fv(f, "wear_suit", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4))) && (!truthy(rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))) || !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.gv(f, "species_exception", rt.fv(f, "wear_suit", live(H)))])))))) {
			(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "wings_open", subtract));
		} else {
			if (truthy((rt.isIn(f, "wings", rt.sv(f, "mutant_bodyparts")) ? 1 : 0))) {
				(bodyparts_to_add = rt.modify(live(bodyparts_to_add), "wings_open", subtract));
			}
		}
	}
	update_needed = 0;
	not_digitigrade = 1;
	X = null;
	rt.forList(f, 0, rt.fv(f, "bodyparts", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (!truthy(rt.gv(f, "use_digitigrade", (O = live(X))))) {
			continue;
		}
		not_digitigrade = 0;
		if (!truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0))) {
			rt.modSrcVar(f, "species_traits", 25, add);
		}
		should_be_squished = 0;
		if (((truthy(rt.fv(f, "wear_suit", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(H))), 4)) || truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 24)))) || (truthy(rt.fv(f, "w_uniform", live(H))) && truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 24))))) {
			should_be_squished = 1;
		}
		if ((isEqual(rt.fv(f, "use_digitigrade", live(O)), 1) && truthy(live(should_be_squished)))) {
			rt.setFv(f, "use_digitigrade", live(O), 2);
			update_needed = 1;
		} else {
			if ((isEqual(rt.fv(f, "use_digitigrade", live(O)), 2) && !truthy(live(should_be_squished)))) {
				rt.setFv(f, "use_digitigrade", live(O), 1);
				update_needed = 1;
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(update_needed))) {
		yield* g.callName(f, live(H), "update_body_parts", []);
	}
	if ((truthy(live(not_digitigrade)) && truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0)))) {
		(rt.modSrcVar(f, "species_traits", 25, subtract));
	}
	if (!truthy(live(bodyparts_to_add))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "gender", live(H)), "female")) {
		$0 = "f";
	} else {
		$0 = "m";
	}
	_g = $0;
	layer = null;
	rt.forList(f, 0, live(relevent_layers));
	while (($e = rt.next(f, 0)) !== undefined) {
		layer = $e;
		layertext = (yield* g.srcCall(f, "mutant_bodyparts_layertext", live(layer)));
		bodypart = null;
		rt.forList(f, 1, live(bodyparts_to_add));
		while (($e = rt.next(f, 1)) !== undefined) {
			bodypart = $e;
			S = null;
			$0 = live(bodypart);
			if ($0 === "tail_lizard") {
				S = rt.index(rt.gl("tails_list_lizard"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_lizard"));
			} else if ($0 === "waggingtail_lizard") {
				S = rt.index(rt.gl("animated_tails_list_lizard"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_lizard"));
			} else if ($0 === "tail_human") {
				S = rt.index(rt.gl("tails_list_human"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"));
			} else if ($0 === "waggingtail_human") {
				S = rt.index(rt.gl("animated_tails_list_human"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human"));
			} else if ($0 === "spines") {
				S = rt.index(rt.gl("spines_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines"));
			} else if ($0 === "waggingspines") {
				S = rt.index(rt.gl("animated_spines_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "spines"));
			} else if ($0 === "snout") {
				S = rt.index(rt.gl("snouts_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "snout"));
			} else if ($0 === "frills") {
				S = rt.index(rt.gl("frills_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "frills"));
			} else if ($0 === "horns") {
				S = rt.index(rt.gl("horns_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "horns"));
			} else if ($0 === "ears") {
				S = rt.index(rt.gl("ears_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears"));
			} else if ($0 === "body_markings") {
				S = rt.index(rt.gl("body_markings_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "body_markings"));
			} else if ($0 === "wings") {
				S = rt.index(rt.gl("wings_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings"));
			} else if ($0 === "wingsopen") {
				S = rt.index(rt.gl("wings_open_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "wings"));
			} else if ($0 === "legs") {
				S = rt.index(rt.gl("legs_list"), rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "legs"));
			}
			if ((!truthy(live(S)) || isEqual(rt.fv(f, "icon_state", live(S)), "none"))) {
				continue;
			}
			accessory_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [null, rt.fv(f, "icon", live(S)), "layer", rt.neg(live(layer))], rt.Args.Named));
			if ((isEqual(live(bodypart), "tail_lizard") || isEqual(live(bodypart), "tail_human"))) {
				bodypart = "tail";
			} else {
				if ((isEqual(live(bodypart), "waggingtail_lizard") || isEqual(live(bodypart), "waggingtail_human"))) {
					bodypart = "waggingtail";
				}
			}
			if (truthy(rt.fv(f, "gender_specific", live(S)))) {
				rt.setFv(f, "icon_state", live(accessory_overlay), fmt("＀_＀_＀_＀", [live(_g), live(bodypart), rt.fv(f, "icon_state", live(S)), live(layertext)]));
			} else {
				rt.setFv(f, "icon_state", live(accessory_overlay), fmt("m_＀_＀_＀", [live(bodypart), rt.fv(f, "icon_state", live(S)), live(layertext)]));
			}
			if (truthy(rt.fv(f, "center", live(S)))) {
				accessory_overlay = (yield* g.call(f, P("/proc/center_image"), null, [live(accessory_overlay), rt.fv(f, "dimension_x", live(S)), rt.fv(f, "dimension_y", live(S))]));
			}
			if (!truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 64))) {
				if (!truthy(live(forced_colour))) {
					$0 = rt.fv(f, "color_src", live(S));
					if ($0 === 1) {
						if (truthy(rt.sv(f, "fixed_mut_color"))) {
							rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.sv(f, "fixed_mut_color")]));
						} else {
							rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor")]));
						}
					} else if ($0 === 2) {
						if (isEqual(rt.sv(f, "hair_color"), "mutcolor")) {
							rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.index(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor")]));
						} else {
							rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.fv(f, "hair_color", live(H))]));
						}
					} else if ($0 === 3) {
						rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.fv(f, "facial_hair_color", live(H))]));
					} else if ($0 === 4) {
						rt.setFv(f, "color", live(accessory_overlay), fmt("#＀", [rt.fv(f, "eye_color", live(H))]));
					}
				} else {
					rt.setFv(f, "color", live(accessory_overlay), live(forced_colour));
				}
			}
			standing = rt.modify(live(standing), live(accessory_overlay), add);
			if (truthy(rt.fv(f, "hasinner", live(S)))) {
				inner_accessory_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [null, rt.fv(f, "icon", live(S)), "layer", rt.neg(live(layer))], rt.Args.Named));
				if (truthy(rt.fv(f, "gender_specific", live(S)))) {
					rt.setFv(f, "icon_state", live(inner_accessory_overlay), fmt("＀_＀inner_＀_＀", [live(_g), live(bodypart), rt.fv(f, "icon_state", live(S)), live(layertext)]));
				} else {
					rt.setFv(f, "icon_state", live(inner_accessory_overlay), fmt("m_＀inner_＀_＀", [live(bodypart), rt.fv(f, "icon_state", live(S)), live(layertext)]));
				}
				if (truthy(rt.fv(f, "center", live(S)))) {
					inner_accessory_overlay = (yield* g.call(f, P("/proc/center_image"), null, [live(inner_accessory_overlay), rt.fv(f, "dimension_x", live(S)), rt.fv(f, "dimension_y", live(S))]));
				}
				standing = rt.modify(live(standing), live(inner_accessory_overlay), add);
			}
		}
		rt.endFor(f, 1);
		rt.setAt(rt.fv(f, "overlays_standing", live(H)), live(layer), (yield* g.callName(f, live(standing), "Copy", [])));
		standing = rt.list();
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(H), "apply_overlay", [25]);
	yield* g.callName(f, live(H), "apply_overlay", [23]);
	yield* g.callName(f, live(H), "apply_overlay", [2]);
	return f.dot;
}, true);

// /datum/species/proc/mutant_bodyparts_layertext  (code/modules/mob/living/carbon/human/species.dm:581)
rt.def("/datum/species/proc/mutant_bodyparts_layertext", function mutant_bodyparts_layertext(f: Frame, layer: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(layer);
	if ($0 === 25) {
		return "BEHIND";
	} else if ($0 === 23) {
		return "ADJ";
	} else if ($0 === 2) {
		return "FRONT";
	}
	return f.dot;
});

// /datum/species/proc/spec_life  (code/modules/mob/living/carbon/human/species.dm:591)  may sleep
rt.def("/datum/species/proc/spec_life", function* spec_life(f: Frame, H: Value) {
	let takes_crit_damage: Value = null;
	f.vars = () => [H, takes_crit_damage];
	if (!truthy((rt.isIn(f, 10, rt.sv(f, "species_traits")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(H), "setOxyLoss", [0]);
	rt.setFv(f, "losebreath", live(H), 0);
	takes_crit_damage = (!truthy((rt.isIn(f, 20, rt.sv(f, "species_traits")) ? 1 : 0)) ? 1 : 0);
	if (!(rt.lt(rt.fv(f, "health", live(H)), 0) && truthy(live(takes_crit_damage)))) return f.dot;
	yield* g.callName(f, live(H), "adjustBruteLoss", [1]);
	return f.dot;
}, true);

// /datum/species/proc/can_equip  (code/modules/mob/living/carbon/human/species.dm:607)  may sleep
rt.def("/datum/species/proc/can_equip", function* can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value, H: Value, bypass_equip_delay_self: Value) {
	let num_arms: Value = null, num_legs: Value = null, O: Value = null, B: Value = null;
	let $0: any;
	f.vars = () => [I, slot, disable_warning, H, bypass_equip_delay_self, num_arms, num_legs, O, B, $0];
	if (live(bypass_equip_delay_self) === null) {
		bypass_equip_delay_self = 0;
	}
	if (truthy((rt.isIn(f, live(slot), rt.sv(f, "no_equip")) ? 1 : 0))) {
		if ((!truthy(rt.fv(f, "species_exception", live(I))) || !truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.src), rt.fv(f, "species_exception", live(I))]))))) {
			return 0;
		}
	}
	num_arms = (yield* g.callName(f, live(H), "get_num_arms", []));
	num_legs = (yield* g.callName(f, live(H), "get_num_legs", []));
	$0 = live(slot);
	if ($0 === 4) {
		if (truthy((yield* g.callName(f, live(H), "get_empty_held_indexes", [])))) {
			return 1;
		}
		return 0;
	} else if ($0 === 2) {
		if (truthy(rt.fv(f, "wear_mask", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 32))) {
			return 0;
		}
		if (!truthy((yield* g.callName(f, live(H), "get_bodypart", ["head"])))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 10) {
		if (truthy(rt.fv(f, "wear_neck", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 8192))) {
			return 0;
		}
		return 1;
	} else if ($0 === 1) {
		if (truthy(rt.fv(f, "back", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 1024))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 13) {
		if (truthy(rt.fv(f, "wear_suit", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 1))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 9) {
		if (truthy(rt.fv(f, "gloves", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 4))) {
			return 0;
		}
		if (rt.lt(live(num_arms), 2)) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 12) {
		if (truthy(rt.fv(f, "shoes", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 128))) {
			return 0;
		}
		if (rt.lt(live(num_legs), 2)) {
			return 0;
		}
		if (truthy((rt.isIn(f, 25, rt.sv(f, "species_traits")) ? 1 : 0))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>The footwear around here isn't compatible with your feet!</span>"]);
			}
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 5) {
		if (truthy(rt.fv(f, "belt", live(H)))) {
			return 0;
		}
		O = (yield* g.callName(f, live(H), "get_bodypart", ["chest"]));
		if (((!truthy(rt.fv(f, "w_uniform", live(H))) && !truthy(rt.sv(f, "nojumpsuit"))) && (!truthy(live(O)) || !isEqual(rt.fv(f, "status", live(O)), 2)))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You need a jumpsuit before you can attach this ＀!</span>", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 512))) {
			return live(f.dot);
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 8) {
		if (truthy(rt.fv(f, "glasses", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 8))) {
			return 0;
		}
		if (!truthy((yield* g.callName(f, live(H), "get_bodypart", ["head"])))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 11) {
		if (truthy(rt.fv(f, "head", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 64))) {
			return 0;
		}
		if (!truthy((yield* g.callName(f, live(H), "get_bodypart", ["head"])))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 7) {
		if (truthy(rt.fv(f, "ears", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 16))) {
			return 0;
		}
		if (!truthy((yield* g.callName(f, live(H), "get_bodypart", ["head"])))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 14) {
		if (truthy(rt.fv(f, "w_uniform", live(H)))) {
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 2))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 6) {
		if (truthy(rt.fv(f, "wear_id", live(H)))) {
			return 0;
		}
		O = (yield* g.callName(f, live(H), "get_bodypart", ["chest"]));
		if (((!truthy(rt.fv(f, "w_uniform", live(H))) && !truthy(rt.sv(f, "nojumpsuit"))) && (!truthy(live(O)) || !isEqual(rt.fv(f, "status", live(O)), 2)))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You need a jumpsuit before you can attach this ＀!</span>", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (!truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 256))) {
			return 0;
		}
		return (yield* g.srcCall(f, "equip_delay_self_check", live(I), live(H), live(bypass_equip_delay_self)));
	} else if ($0 === 15) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			return 0;
		}
		if (truthy(rt.fv(f, "l_store", live(H)))) {
			return 0;
		}
		O = (yield* g.callName(f, live(H), "get_bodypart", ["l_leg"]));
		if (((!truthy(rt.fv(f, "w_uniform", live(H))) && !truthy(rt.sv(f, "nojumpsuit"))) && (!truthy(live(O)) || !isEqual(rt.fv(f, "status", live(O)), 2)))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You need a jumpsuit before you can attach this ＀!</span>", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 4096))) {
			return live(f.dot);
		}
		if ((rt.le(rt.fv(f, "w_class", live(I)), 2) || truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 2048)))) {
			return 1;
		}
	} else if ($0 === 16) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			return 0;
		}
		if (truthy(rt.fv(f, "r_store", live(H)))) {
			return 0;
		}
		O = (yield* g.callName(f, live(H), "get_bodypart", ["r_leg"]));
		if (((!truthy(rt.fv(f, "w_uniform", live(H))) && !truthy(rt.sv(f, "nojumpsuit"))) && (!truthy(live(O)) || !isEqual(rt.fv(f, "status", live(O)), 2)))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You need a jumpsuit before you can attach this ＀!</span>", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 4096))) {
			return 0;
		}
		if ((rt.le(rt.fv(f, "w_class", live(I)), 2) || truthy(rt.bitAnd(rt.fv(f, "slot_flags", live(I)), 2048)))) {
			return 1;
		}
		return 0;
	} else if ($0 === 17) {
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 2))) {
			return 0;
		}
		if (truthy(rt.fv(f, "s_store", live(H)))) {
			return 0;
		}
		if (!truthy(rt.fv(f, "wear_suit", live(H)))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You need a suit before you can attach this ＀!</span>", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (!truthy(rt.gv(f, "allowed", rt.fv(f, "wear_suit", live(H))))) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You somehow have a suit with no defined allowed items for suit storage, stop that."]);
			}
			return 0;
		}
		if (rt.gt(rt.fv(f, "w_class", live(I)), 4)) {
			if (!truthy(live(disable_warning))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("The ＀ is too big to attach.", [rt.fv(f, "name", live(I))])]);
			}
			return 0;
		}
		if (((truthy((rt.istype(live(I), T("/obj/item/device/pda")) ? 1 : 0)) || truthy((rt.istype(live(I), T("/obj/item/weapon/pen")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(I), rt.gv(f, "allowed", rt.fv(f, "wear_suit", live(H)))]))))) {
			return 1;
		}
		return 0;
	} else if ($0 === 3) {
		if (truthy(rt.fv(f, "handcuffed", live(H)))) {
			return 0;
		}
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/restraints/handcuffs")) ? 1 : 0))) {
			return 0;
		}
		if (rt.lt(live(num_arms), 2)) {
			return 0;
		}
		return 1;
	} else if ($0 === 19) {
		if (truthy(rt.fv(f, "legcuffed", live(H)))) {
			return 0;
		}
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/restraints/legcuffs")) ? 1 : 0))) {
			return 0;
		}
		if (rt.lt(live(num_legs), 2)) {
			return 0;
		}
		return 1;
	} else if ($0 === 18) {
		if ((truthy(rt.fv(f, "back", live(H))) && truthy((rt.istype(rt.fv(f, "back", live(H)), T("/obj/item/weapon/storage")) ? 1 : 0)))) {
			if (truthy((yield* g.callName(f, (B = rt.fv(f, "back", live(H))), "can_be_inserted", [live(I), 1, live(H)])))) {
				return 1;
			}
		}
		return 0;
	}
	return 0;
}, true);

// /datum/species/proc/equip_delay_self_check  (code/modules/mob/living/carbon/human/species.dm:798)  may sleep
rt.def("/datum/species/proc/equip_delay_self_check", function* equip_delay_self_check(f: Frame, I: Value, H: Value, bypass_equip_delay_self: Value) {
	f.vars = () => [I, H, bypass_equip_delay_self];
	if ((!truthy(rt.fv(f, "equip_delay_self", live(I))) || truthy(live(bypass_equip_delay_self)))) {
		return 1;
	}
	yield* g.callName(f, live(H), "visible_message", [fmt("<span class='notice'>＀ start putting on ＀...</span>", [live(H), live(I)]), fmt("<span class='notice'>You start putting on ＀...</span>", [live(I)])]);
	return (yield* g.call(f, P("/proc/do_after"), null, [null, live(H), null, rt.fv(f, "equip_delay_self", live(I)), "target", live(H)], rt.Args.Named));
}, true);

// /datum/species/proc/after_equip_job  (code/modules/mob/living/carbon/human/species.dm:807)  may sleep
rt.def("/datum/species/proc/after_equip_job", function* after_equip_job(f: Frame, J: Value, H: Value) {
	f.vars = () => [J, H];
	yield* g.callName(f, live(H), "update_mutant_bodyparts", []);
	return f.dot;
}, true);

// /datum/species/proc/handle_chemicals  (code/modules/mob/living/carbon/human/species.dm:810)  may sleep
rt.def("/datum/species/proc/handle_chemicals", function* handle_chemicals(f: Frame, chem: Value, H: Value) {
	f.vars = () => [chem, H];
	if (isEqual(rt.fv(f, "id", live(chem)), rt.sv(f, "exotic_blood"))) {
		rt.setFv(f, "blood_volume", live(H), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "blood_volume", live(H)), (yield* g.call(f, P("/proc/round"), null, [rt.fv(f, "volume", live(chem)), 0.10000000149011612]))), 2000])));
		yield* g.callName(f, rt.fv(f, "reagents", live(H)), "del_reagent", [rt.fv(f, "id", live(chem))]);
		return 1;
	}
	return 0;
}, true);

// /datum/species/proc/get_spans  (code/modules/mob/living/carbon/human/species.dm:821)
rt.def("/datum/species/proc/get_spans", function get_spans(f: Frame) {
	return rt.list();
});

// /datum/species/proc/handle_chemicals_in_body  (code/modules/mob/living/carbon/human/species.dm:833)  may sleep
rt.def("/datum/species/proc/handle_chemicals_in_body", function* handle_chemicals_in_body(f: Frame, H: Value) {
	let hunger_rate: Value = null;
	let $0: any;
	f.vars = () => [H, hunger_rate, $0];
	if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 32))) {
		if (rt.lt(rt.fv(f, "overeatduration", live(H)), 100)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel fit again!</span>"]);
			(rt.modField(f, live(H), "disabilities", 16777183, rt.bitAnd));
			yield* g.callName(f, live(H), "update_inv_w_uniform", []);
			yield* g.callName(f, live(H), "update_inv_wear_suit", []);
		}
	} else {
		if (rt.gt(rt.fv(f, "overeatduration", live(H)), 500)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You suddenly feel blubbery!</span>"]);
			(rt.modField(f, live(H), "disabilities", 32, rt.bitOr));
			yield* g.callName(f, live(H), "update_inv_w_uniform", []);
			yield* g.callName(f, live(H), "update_inv_wear_suit", []);
		}
	}
	if (((((rt.gt(rt.fv(f, "nutrition", live(H)), 0) && !isEqual(rt.fv(f, "stat", live(H)), 2)) && truthy(rt.fv(f, "dna", live(H)))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && !truthy((rt.isIn(f, 19, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0)))) {
		hunger_rate = 0.10000000149011612;
		if (rt.gt(rt.fv(f, "satiety", live(H)), 0)) {
			rt.incField(f, live(H), "satiety", -1, true);
		}
		if (rt.lt(rt.fv(f, "satiety", live(H)), 0)) {
			rt.incField(f, live(H), "satiety", 1, true);
			if (truthy(rt.op(f, "Prob", [], [(yield* g.call(f, P("/proc/round"), null, [divide(rt.neg(rt.fv(f, "satiety", live(H))), 40)]))]))) {
				yield* g.callName(f, live(H), "Jitter", [5]);
			}
			hunger_rate = 0.30000001192092896;
		}
		rt.setFv(f, "nutrition", live(H), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.fv(f, "nutrition", live(H)), live(hunger_rate))])));
	}
	if (rt.gt(rt.fv(f, "nutrition", live(H)), 550)) {
		if (rt.lt(rt.fv(f, "overeatduration", live(H)), 600)) {
			rt.incField(f, live(H), "overeatduration", 1, true);
		}
	} else {
		if (rt.gt(rt.fv(f, "overeatduration", live(H)), 1)) {
			(rt.modField(f, live(H), "overeatduration", 2, subtract));
		}
	}
	if (rt.gt(rt.fv(f, "nutrition", live(H)), 600)) {
		rt.setFv(f, "metabolism_efficiency", live(H), 1);
	} else {
		if ((rt.gt(rt.fv(f, "nutrition", live(H)), 350) && rt.gt(rt.fv(f, "satiety", live(H)), 80))) {
			if ((!isEqual(rt.fv(f, "metabolism_efficiency", live(H)), 1.25) && ((truthy(rt.fv(f, "dna", live(H))) && truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H))))) && !truthy((rt.isIn(f, 19, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel vigorous.</span>"]);
				rt.setFv(f, "metabolism_efficiency", live(H), 1.25);
			}
		} else {
			if (rt.lt(rt.fv(f, "nutrition", live(H)), 200)) {
				if (!isEqual(rt.fv(f, "metabolism_efficiency", live(H)), 0.800000011920929)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You feel sluggish.</span>"]);
				}
				rt.setFv(f, "metabolism_efficiency", live(H), 0.800000011920929);
			} else {
				if (isEqual(rt.fv(f, "metabolism_efficiency", live(H)), 1.25)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You no longer feel vigorous.</span>"]);
				}
				rt.setFv(f, "metabolism_efficiency", live(H), 1);
			}
		}
	}
	$0 = rt.fv(f, "nutrition", live(H));
	if (rt.inRange($0, 550, 9.999999848243207e+30)) {
		yield* g.callName(f, live(H), "throw_alert", ["nutrition", T("/obj/screen/alert/fat")]);
	} else if (rt.inRange($0, 250, 550)) {
		yield* g.callName(f, live(H), "clear_alert", ["nutrition"]);
	} else if (rt.inRange($0, 150, 250)) {
		yield* g.callName(f, live(H), "throw_alert", ["nutrition", T("/obj/screen/alert/hungry")]);
	} else {
		yield* g.callName(f, live(H), "throw_alert", ["nutrition", T("/obj/screen/alert/starving")]);
	}
	return f.dot;
}, true);

// /datum/species/proc/handle_mutations_and_radiation  (code/modules/mob/living/carbon/human/species.dm:899)  may sleep
rt.def("/datum/species/proc/handle_mutations_and_radiation", function* handle_mutations_and_radiation(f: Frame, H: Value) {
	let $0: any;
	f.vars = () => [H, $0];
	if (!truthy((rt.isIn(f, 9, rt.sv(f, "species_traits")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "radiation", live(H)))) {
			if (rt.gt(rt.fv(f, "radiation", live(H)), 100)) {
				if (!truthy((yield* g.callName(f, live(H), "IsKnockdown", [])))) {
					yield* g.callName(f, live(H), "emote", ["collapse"]);
				}
				yield* g.callName(f, live(H), "Knockdown", [200]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You feel weak.</span>"]);
			}
			$0 = rt.fv(f, "radiation", live(H));
			if (rt.inRange($0, 50, 75)) {
				if (truthy(rt.op(f, "Prob", [], [5]))) {
					if (!truthy((yield* g.callName(f, live(H), "IsKnockdown", [])))) {
						yield* g.callName(f, live(H), "emote", ["collapse"]);
					}
					yield* g.callName(f, live(H), "Knockdown", [60]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You feel weak.</span>"]);
				}
				if (truthy(rt.op(f, "Prob", [], [15]))) {
					if (((!isEqual(rt.fv(f, "hair_style", live(H)), "Shaved") || !isEqual(rt.fv(f, "hair_style", live(H)), "Bald")) || truthy((rt.isIn(f, 2, rt.sv(f, "species_traits")) ? 1 : 0)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>Your hair starts to fall out in clumps...<span>"]);
						yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/species/proc/go_bald"), live(H)])), 50]);
					}
				}
			} else if (rt.inRange($0, 75, 100)) {
				if (truthy(rt.op(f, "Prob", [], [1]))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='danger'>You mutate!</span>"]);
					yield* g.callName(f, live(H), "randmutb", []);
					yield* g.callName(f, live(H), "emote", ["gasp"]);
					yield* g.callName(f, live(H), "domutcheck", []);
				}
			}
		}
		return 0;
	}
	rt.setFv(f, "radiation", live(H), 0);
	return 1;
}, true);

// /datum/species/proc/go_bald  (code/modules/mob/living/carbon/human/species.dm:930)  may sleep
rt.def("/datum/species/proc/go_bald", function* go_bald(f: Frame, H: Value) {
	f.vars = () => [H];
	if ((!truthy(live(H)) || truthy(rt.fv(f, "gc_destroyed", live(H))))) {
		return live(f.dot);
	}
	rt.setFv(f, "facial_hair_style", live(H), "Shaved");
	rt.setFv(f, "hair_style", live(H), "Bald");
	yield* g.callName(f, live(H), "update_hair", []);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }] });

// /datum/species/proc/movement_delay  (code/modules/mob/living/carbon/human/species.dm:946)  may sleep
rt.def("/datum/species/proc/movement_delay", function* movement_delay(f: Frame, H: Value) {
	let flight: Value = null, flightpack: Value = null, ignoreslow: Value = null, gravity: Value = null, F: Value = null, J: Value = null, C: Value = null, _T: Value = null, I: Value = null, health_deficiency: Value = null, hungry: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, flight, flightpack, ignoreslow, gravity, F, J, C, _T, I, health_deficiency, hungry, $0, $e];
	f.dot = 0;
	flight = 0;
	flightpack = 0;
	ignoreslow = 0;
	gravity = 0;
	if ((truthy((rt.istype((F = (yield* g.callName(f, live(H), "get_flightpack", []))), T("/obj/item/device/flightpack")) ? 1 : 0)) && truthy(rt.fv(f, "flight", live(F))))) {
		flightpack = 1;
	}
	if (truthy(rt.bitAnd(rt.fv(f, "movement_type", live(H)), 2))) {
		flight = 1;
	}
	if (!truthy(live(flightpack))) {
		if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(H)), 32))) {
			(f.dot = rt.modify(live(f.dot), 1, subtract));
		}
		if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(H)), 64))) {
			(f.dot = rt.modify(live(f.dot), 2, subtract));
		}
		f.dot = rt.modify(live(f.dot), rt.sv(f, "speedmod"), add);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(H)), 16))) {
		ignoreslow = 1;
	}
	if (truthy((yield* g.callName(f, live(H), "has_gravity", [])))) {
		gravity = 1;
	}
	if (!truthy(live(gravity))) {
		J = rt.fv(f, "back", live(H));
		C = rt.fv(f, "wear_suit", live(H));
		_T = (yield* g.callName(f, live(H), "getorganslot", ["thrusters"]));
		if ((!truthy((rt.istype(live(J), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0)) && truthy((rt.istype(live(C), T("/obj/item/clothing/suit/space/hardsuit")) ? 1 : 0)))) {
			J = rt.fv(f, "jetpack", live(C));
		}
		if (((truthy((rt.istype(live(J), T("/obj/item/weapon/tank/jetpack")) ? 1 : 0)) && truthy(rt.fv(f, "full_speed", live(J)))) && truthy((yield* g.callName(f, live(J), "allow_thrust", [0.009999999776482582, live(H)]))))) {
			(f.dot = rt.modify(live(f.dot), 2, subtract));
		} else {
			if ((truthy((rt.istype(live(_T), T("/obj/item/organ/cyberimp/chest/thrusters")) ? 1 : 0)) && truthy((yield* g.callName(f, live(_T), "allow_thrust", [0.009999999776482582, live(H)]))))) {
				(f.dot = rt.modify(live(f.dot), 2, subtract));
			} else {
				if ((truthy(live(flightpack)) && truthy((yield* g.callName(f, live(F), "allow_thrust", [0.009999999776482582, live(f.src)]))))) {
					(f.dot = rt.modify(live(f.dot), 2, subtract));
				}
			}
		}
	}
	if ((truthy(live(flightpack)) && truthy(rt.fv(f, "boost", live(F))))) {
		(f.dot = rt.modify(live(f.dot), rt.fv(f, "boost_speed", live(F)), subtract));
	} else {
		if ((truthy(live(flightpack)) && truthy(rt.fv(f, "brake", live(F))))) {
			f.dot = rt.modify(live(f.dot), 2, add);
		}
	}
	if (((!truthy(live(ignoreslow)) && !truthy(live(flightpack))) && truthy(live(gravity)))) {
		if (truthy(rt.fv(f, "wear_suit", live(H)))) {
			f.dot = rt.modify(live(f.dot), rt.gv(f, "slowdown", rt.fv(f, "wear_suit", live(H))), add);
		}
		if (truthy(rt.fv(f, "shoes", live(H)))) {
			f.dot = rt.modify(live(f.dot), rt.gv(f, "slowdown", rt.fv(f, "shoes", live(H))), add);
		}
		if (truthy(rt.fv(f, "back", live(H)))) {
			f.dot = rt.modify(live(f.dot), rt.gv(f, "slowdown", rt.fv(f, "back", live(H))), add);
		}
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy(rt.fv(f, "secondary_flags", live(I)))) {
				$0 = rt.index(rt.fv(f, "secondary_flags", live(I)), "slows_while_in_hand");
			} else {
				$0 = 0;
			}
			if (truthy($0)) {
				f.dot = rt.modify(live(f.dot), rt.fv(f, "slowdown", live(I)), add);
			}
		}
		rt.endFor(f, 0);
		health_deficiency = add(subtract(100, rt.fv(f, "health", live(H))), rt.fv(f, "staminaloss", live(H)));
		hungry = divide(subtract(500, rt.fv(f, "nutrition", live(H))), 5);
		if (rt.ge(live(health_deficiency), 40)) {
			if (truthy(live(flight))) {
				f.dot = rt.modify(live(f.dot), divide(live(health_deficiency), 75), add);
			} else {
				f.dot = rt.modify(live(f.dot), divide(live(health_deficiency), 25), add);
			}
		}
		if ((rt.ge(live(hungry), 70) && !truthy(live(flight)))) {
			f.dot = rt.modify(live(f.dot), divide(live(hungry), 50), add);
		}
		if (truthy(rt.bitAnd(rt.fv(f, "disabilities", live(H)), 32))) {
			f.dot = rt.modify(live(f.dot), subtract(1.5, live(flight)), add);
		}
		if (rt.lt(rt.fv(f, "bodytemperature", live(H)), 260.1499938964844)) {
			f.dot = rt.modify(live(f.dot), divide(subtract(260.1499938964844, rt.fv(f, "bodytemperature", live(H))), 20), add);
		}
	}
	return live(f.dot);
}, true);

// /datum/species/proc/help  (code/modules/mob/living/carbon/human/species.dm:1017)  may sleep
rt.def("/datum/species/proc/help", function* help(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let we_breathe: Value = null, we_lung: Value = null;
	f.vars = () => [user, target, attacker_style, we_breathe, we_lung];
	if ((rt.ge(rt.fv(f, "health", live(target)), 0) && !truthy(rt.bitAnd(rt.fv(f, "status_flags", live(target)), 8192)))) {
		yield* g.callName(f, live(target), "help_shake_act", [live(user)]);
		if (!isEqual(live(target), live(user))) {
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "shaked"]);
		}
		return 1;
	} else {
		we_breathe = (!truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.gv(f, "species", rt.fv(f, "dna", live(user))))) ? 1 : 0)) ? 1 : 0);
		we_lung = (yield* g.callName(f, live(user), "getorganslot", ["lungs"]));
		if ((truthy(live(we_breathe)) && truthy(live(we_lung)))) {
			yield* g.callName(f, live(user), "do_cpr", [live(target)]);
		} else {
			if ((truthy(live(we_breathe)) && !truthy(live(we_lung)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You have no lungs to breathe with, so you cannot peform CPR.</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You do not breathe, so you cannot perform CPR.</span>"]);
			}
		}
	}
	return f.dot;
}, true);

// /datum/species/proc/grab  (code/modules/mob/living/carbon/human/species.dm:1034)  may sleep
rt.def("/datum/species/proc/grab", function* grab(f: Frame, user: Value, target: Value, attacker_style: Value) {
	f.vars = () => [user, target, attacker_style];
	if (truthy((yield* g.callName(f, live(target), "check_block", [])))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ blocks ＀'s grab attempt!</span>", [live(target), live(user)])]);
		return 0;
	}
	if ((truthy(live(attacker_style)) && truthy((yield* g.callName(f, live(attacker_style), "grab_act", [live(user), live(target)]))))) {
		return 1;
	} else {
		yield* g.callName(f, live(target), "grabbedby", [live(user)]);
		return 1;
	}
	return f.dot;
}, true);

// /datum/species/proc/harm  (code/modules/mob/living/carbon/human/species.dm:1048)  may sleep
rt.def("/datum/species/proc/harm", function* harm(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let atk_verb: Value = null, damage: Value = null, affecting: Value = null, armor_block: Value = null;
	let $0: any;
	f.vars = () => [user, target, attacker_style, atk_verb, damage, affecting, armor_block, $0];
	if (truthy((yield* g.callName(f, live(target), "check_block", [])))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ blocks ＀'s attack!</span>", [live(target), live(user)])]);
		return 0;
	}
	if ((truthy(live(attacker_style)) && truthy((yield* g.callName(f, live(attacker_style), "harm_act", [live(user), live(target)]))))) {
		return 1;
	} else {
		atk_verb = rt.gv(f, "attack_verb", rt.gv(f, "species", rt.fv(f, "dna", live(user))));
		if (truthy(rt.fv(f, "lying", live(target)))) {
			atk_verb = "kick";
		}
		$0 = live(atk_verb);
		if ($0 === "kick") {
			yield* g.callName(f, live(user), "do_attack_animation", [live(target), "kick"]);
		} else if ($0 === "slash") {
			yield* g.callName(f, live(user), "do_attack_animation", [live(target), "claw"]);
		} else if ($0 === "smash") {
			yield* g.callName(f, live(user), "do_attack_animation", [live(target), "smash"]);
		} else {
			yield* g.callName(f, live(user), "do_attack_animation", [live(target), "punch"]);
		}
		damage = (yield* g.call(f, P("/proc/rand"), null, [rt.gv(f, "punchdamagelow", rt.gv(f, "species", rt.fv(f, "dna", live(user)))), rt.gv(f, "punchdamagehigh", rt.gv(f, "species", rt.fv(f, "dna", live(user))))]));
		affecting = (yield* g.callName(f, live(target), "get_bodypart", [(yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(user))]))]));
		if ((!truthy(live(damage)) || !truthy(live(affecting)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(target)), rt.gv(f, "miss_sound", rt.gv(f, "species", rt.fv(f, "dna", live(user)))), 25, 1, -1]);
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has attempted to ＀ ＀!</span>", [live(user), live(atk_verb), live(target)]), fmt("<span class='userdanger'>＀ has attempted to ＀ ＀!</span>", [live(user), live(atk_verb), live(target)]), null, 3]);
			return 0;
		}
		armor_block = (yield* g.callName(f, live(target), "run_armor_check", [live(affecting), "melee"]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(target)), rt.gv(f, "attack_sound", rt.gv(f, "species", rt.fv(f, "dna", live(user)))), 25, 1, -1]);
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has ＀ed ＀!</span>", [live(user), live(atk_verb), live(target)]), fmt("<span class='userdanger'>＀ has ＀ed ＀!</span>", [live(user), live(atk_verb), live(target)]), null, 3]);
		if (truthy(rt.fv(f, "limb_destroyer", live(user)))) {
			yield* g.callName(f, live(target), "dismembering_strike", [live(user), rt.fv(f, "body_zone", live(affecting))]);
		}
		yield* g.callName(f, live(target), "apply_damage", [live(damage), "brute", live(affecting), live(armor_block)]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "punched"]);
		if ((!isEqual(rt.fv(f, "stat", live(target)), 2) && rt.ge(live(damage), rt.gv(f, "punchstunthreshold", rt.gv(f, "species", rt.fv(f, "dna", live(user))))))) {
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has knocked  ＀ down!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ has knocked ＀ down!</span>", [live(user), live(target)])]);
			yield* g.callName(f, live(target), "apply_effect", [80, "knockdown", live(armor_block)]);
			yield* g.callName(f, live(target), "forcesay", [rt.gl("hit_appends")]);
		} else {
			if (!truthy(rt.fv(f, "lying", live(target)))) return f.dot;
			yield* g.callName(f, live(target), "forcesay", [rt.gl("hit_appends")]);
		}
	}
	return f.dot;
}, true);

// /datum/species/proc/disarm  (code/modules/mob/living/carbon/human/species.dm:1102)  may sleep
rt.def("/datum/species/proc/disarm", function* disarm(f: Frame, user: Value, target: Value, attacker_style: Value) {
	let affecting: Value = null, randn: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [user, target, attacker_style, affecting, randn, I, $0, $1, $2, $3];
	if (truthy((yield* g.callName(f, live(target), "check_block", [])))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ blocks ＀'s disarm attempt!</span>", [live(target), live(user)])]);
		return 0;
	}
	if ((truthy(live(attacker_style)) && truthy((yield* g.callName(f, live(attacker_style), "disarm_act", [live(user), live(target)]))))) {
		return 1;
	} else {
		yield* g.callName(f, live(user), "do_attack_animation", [live(target), "disarm"]);
		if (truthy(rt.fv(f, "w_uniform", live(target)))) {
			yield* g.callName(f, rt.fv(f, "w_uniform", live(target)), "add_fingerprint", [live(user)]);
		}
		affecting = (yield* g.callName(f, live(target), "get_bodypart", [(yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(user))]))]));
		if (rt.le((randn = (yield* g.call(f, P("/proc/rand"), null, [1, 100]))), 25)) {
			yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has pushed ＀!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ has pushed ＀!</span>", [live(user), live(target)]), null, 3]);
			yield* g.callName(f, live(target), "apply_effect", [40, "knockdown", (yield* g.callName(f, live(target), "run_armor_check", [live(affecting), "melee", "Your armor prevents your fall!", "Your armor softens your fall!"]))]);
			yield* g.callName(f, live(target), "forcesay", [rt.gl("hit_appends")]);
			yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "disarmed", " pushing them to the ground"]);
			return live(f.dot);
		}
		if (rt.le(live(randn), 60)) {
			I = null;
			if (truthy(rt.fv(f, "pulling", live(target)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(target), fmt("<span class='warning'>＀ has broken ＀'s grip on ＀!</span>", [live(user), live(target), rt.fv(f, "pulling", live(target))])]);
				yield* g.callName(f, live(target), "stop_pulling", []);
			} else {
				I = (yield* g.callName(f, live(target), "get_active_held_item", []));
				if (truthy((yield* g.callName(f, live(target), "drop_item", [])))) {
					yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has disarmed ＀!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ has disarmed ＀!</span>", [live(user), live(target)]), null, 3]);
				} else {
					I = null;
				}
			}
			yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
			$0 = live(user);
			$1 = live(target);
			$2 = "disarmed";
			if (truthy(live(I))) {
				$3 = fmt(" removing ％！", [live(I)]);
			} else {
				$3 = "";
			}
			yield* g.call(f, P("/proc/add_logs"), null, [$0, $1, $2, fmt("＀", [$3])]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(target), rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1]);
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ attempted to disarm ＀!</span>", [live(user), live(target)]), fmt("<span class='userdanger'>＀ attemped to disarm ＀!</span>", [live(user), live(target)]), null, 3]);
	}
	return f.dot;
}, true);

// /datum/species/proc/spec_attack_hand  (code/modules/mob/living/carbon/human/species.dm:1150)  may sleep
rt.def("/datum/species/proc/spec_attack_hand", function* spec_attack_hand(f: Frame, M: Value, H: Value, attacker_style: Value) {
	let $0: any;
	f.vars = () => [M, H, attacker_style, $0];
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "dna", live(M))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(M)))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "dna", live(H))) || !truthy(rt.gv(f, "species", rt.fv(f, "dna", live(H)))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "mind", live(M)))) {
		attacker_style = rt.gv(f, "martial_art", rt.fv(f, "mind", live(M)));
	}
	if (((!isEqual(live(M), live(H)) && !isEqual(rt.fv(f, "a_intent", live(M)), "help")) && truthy((yield* g.callName(f, live(H), "check_shields", [null, live(M), null, 0, null, rt.fv(f, "name", live(M)), "attack_type", 2], rt.Args.Named))))) {
		yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(H), "attempted to touch"]);
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ attempted to touch ＀!</span>", [live(M), live(H)])]);
		return 0;
	}
	$0 = rt.fv(f, "a_intent", live(M));
	if ($0 === "help") {
		yield* g.srcCall(f, "help", live(M), live(H), live(attacker_style));
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grab", live(M), live(H), live(attacker_style));
	} else if ($0 === "harm") {
		yield* g.srcCall(f, "harm", live(M), live(H), live(attacker_style));
	} else if ($0 === "disarm") {
		yield* g.srcCall(f, "disarm", live(M), live(H), live(attacker_style));
	}
	return f.dot;
}, true);

// /datum/species/proc/spec_attacked_by  (code/modules/mob/living/carbon/human/species.dm:1178)  may sleep
rt.def("/datum/species/proc/spec_attacked_by", function* spec_attacked_by(f: Frame, I: Value, user: Value, affecting: Value, intent: Value, H: Value) {
	let hit_area: Value = null, def_zone: Value = null, armor_block: Value = null, Iforce: Value = null, weakness: Value = null, probability: Value = null, bloody: Value = null, location: Value = null;
	let $0: any;
	f.vars = () => [I, user, affecting, intent, H, hit_area, def_zone, armor_block, Iforce, weakness, probability, bloody, location, $0];
	if (!isEqual(live(user), live(H))) {
		if (truthy((yield* g.callName(f, live(H), "check_shields", [live(I), rt.fv(f, "force", live(I)), fmt("the ＀", [rt.fv(f, "name", live(I))]), 1, rt.fv(f, "armour_penetration", live(I))])))) {
			return 0;
		}
	}
	if (truthy((yield* g.callName(f, live(H), "check_block", [])))) {
		yield* g.callName(f, live(H), "visible_message", [fmt("<span class='warning'>＀ blocks ＀!</span>", [live(H), live(I)])]);
		return 0;
	}
	hit_area = null;
	if (!truthy(live(affecting))) {
		affecting = rt.index(rt.fv(f, "bodyparts", live(H)), 1);
	}
	hit_area = rt.fv(f, "name", live(affecting));
	def_zone = rt.fv(f, "body_zone", live(affecting));
	armor_block = (yield* g.callName(f, live(H), "run_armor_check", [live(affecting), "melee", fmt("<span class='notice'>Your armor has protected your ＀.</span>", [live(hit_area)]), fmt("<span class='notice'>Your armor has softened a hit to your ＀.</span>", [live(hit_area)]), rt.fv(f, "armour_penetration", live(I))]));
	armor_block = (yield* g.call(f, P("/proc/min"), null, [90, live(armor_block)]));
	Iforce = rt.fv(f, "force", live(I));
	weakness = (yield* g.callName(f, live(H), "check_weakness", [live(I), live(user)]));
	yield* g.srcCall(f, "apply_damage", multiply(rt.fv(f, "force", live(I)), live(weakness)), rt.fv(f, "damtype", live(I)), live(def_zone), live(armor_block), live(H));
	yield* g.callName(f, live(H), "damage_clothes", [rt.fv(f, "force", live(I)), rt.fv(f, "damtype", live(I)), "melee", rt.fv(f, "body_zone", live(affecting))]);
	yield* g.callName(f, live(H), "send_item_attack_message", [live(I), live(user), live(hit_area)]);
	if (!truthy(rt.fv(f, "force", live(I)))) {
		return 0;
	}
	if ((truthy(rt.op(f, "Prob", [], [(probability = (yield* g.callName(f, live(I), "get_dismemberment_chance", [live(affecting)])))])) || (truthy((rt.isIn(f, 22, rt.sv(f, "species_traits")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [multiply(2, live(probability))]))))) {
		if (truthy((yield* g.callName(f, live(affecting), "dismember", [rt.fv(f, "damtype", live(I))])))) {
			yield* g.callName(f, live(I), "add_mob_blood", [live(H)]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), (yield* g.callName(f, live(I), "get_dismember_sound", [])), 80, 1]);
		}
	}
	bloody = 0;
	if (((isEqual(rt.fv(f, "damtype", live(I)), "brute") && truthy(rt.fv(f, "force", live(I)))) && truthy(rt.op(f, "Prob", [], [add(25, multiply(rt.fv(f, "force", live(I)), 2))])))) {
		if (isEqual(rt.fv(f, "status", live(affecting)), 1)) {
			yield* g.callName(f, live(I), "add_mob_blood", [live(H)]);
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.fv(f, "force", live(I)), 2)]))) {
				bloody = 1;
				if (truthy((rt.istype((location = rt.fv(f, "loc", live(H))), T("/turf")) ? 1 : 0))) {
					yield* g.callName(f, live(H), "add_splatter_floor", [live(location)]);
				}
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(H)])), 1)) {
					yield* g.callName(f, live(user), "add_mob_blood", [live(H)]);
				}
			}
		}
		$0 = live(hit_area);
		if ($0 === "head") {
			if ((isEqual(rt.fv(f, "stat", live(H)), 0) && rt.lt(live(armor_block), 50))) {
				if (truthy(rt.op(f, "Prob", [], [rt.fv(f, "force", live(I))]))) {
					yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ has been knocked senseless!</span>", [live(H)]), fmt("<span class='userdanger'>＀ has been knocked senseless!</span>", [live(H)])]);
					rt.setFv(f, "confused", live(H), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "confused", live(H)), 20])));
					yield* g.callName(f, live(H), "adjust_blurriness", [10]);
				}
				if ((truthy(rt.op(f, "Prob", [], [add(rt.fv(f, "force", live(I)), divide(subtract(100, rt.fv(f, "health", live(H))), 2))])) && !isEqual(live(H), live(user)))) {
					yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_revolutionary", [rt.fv(f, "mind", live(H))]);
				}
			}
			if (truthy(live(bloody))) {
				if (truthy(rt.fv(f, "wear_mask", live(H)))) {
					yield* g.callName(f, rt.fv(f, "wear_mask", live(H)), "add_mob_blood", [live(H)]);
					yield* g.callName(f, live(H), "update_inv_wear_mask", []);
				}
				if (truthy(rt.fv(f, "head", live(H)))) {
					yield* g.callName(f, rt.fv(f, "head", live(H)), "add_mob_blood", [live(H)]);
					yield* g.callName(f, live(H), "update_inv_head", []);
				}
				if ((truthy(rt.fv(f, "glasses", live(H))) && truthy(rt.op(f, "Prob", [], [33])))) {
					yield* g.callName(f, rt.fv(f, "glasses", live(H)), "add_mob_blood", [live(H)]);
					yield* g.callName(f, live(H), "update_inv_glasses", []);
				}
			}
		} else if ($0 === "chest") {
			if ((isEqual(rt.fv(f, "stat", live(H)), 0) && rt.lt(live(armor_block), 50))) {
				if (truthy(rt.op(f, "Prob", [], [rt.fv(f, "force", live(I))]))) {
					yield* g.callName(f, live(H), "visible_message", [fmt("<span class='danger'>＀ has been knocked down!</span>", [live(H)]), fmt("<span class='userdanger'>＀ has been knocked down!</span>", [live(H)])]);
					yield* g.callName(f, live(H), "apply_effect", [60, "knockdown", live(armor_block)]);
				}
			}
			if (truthy(live(bloody))) {
				if (truthy(rt.fv(f, "wear_suit", live(H)))) {
					yield* g.callName(f, rt.fv(f, "wear_suit", live(H)), "add_mob_blood", [live(H)]);
					yield* g.callName(f, live(H), "update_inv_wear_suit", []);
				}
				if (truthy(rt.fv(f, "w_uniform", live(H)))) {
					yield* g.callName(f, rt.fv(f, "w_uniform", live(H)), "add_mob_blood", [live(H)]);
					yield* g.callName(f, live(H), "update_inv_w_uniform", []);
				}
			}
		}
		if ((rt.gt(live(Iforce), 10) || (rt.ge(live(Iforce), 5) && truthy(rt.op(f, "Prob", [], [33]))))) {
			yield* g.callName(f, live(H), "forcesay", [rt.gl("hit_appends")]);
		}
	}
	return 1;
}, true);

// /datum/species/proc/apply_damage  (code/modules/mob/living/carbon/human/species.dm:1267)  may sleep
rt.def("/datum/species/proc/apply_damage", function* apply_damage(f: Frame, damage: Value, damagetype: Value, def_zone: Value, blocked: Value, H: Value) {
	let hit_percent: Value = null, BP: Value = null;
	let $0: any;
	f.vars = () => [damage, damagetype, def_zone, blocked, H, hit_percent, BP, $0];
	if (live(damagetype) === null) {
		damagetype = "brute";
	}
	if (live(def_zone) === null) {
		def_zone = null;
	}
	hit_percent = divide(subtract(100, add(live(blocked), rt.sv(f, "armor"))), 100);
	if ((!truthy(live(damage)) || rt.le(live(hit_percent), 0))) {
		return 0;
	}
	BP = null;
	if (truthy((rt.istype(live(def_zone), T("/obj/item/bodypart")) ? 1 : 0))) {
		BP = live(def_zone);
	} else {
		if (!truthy(live(def_zone))) {
			def_zone = (yield* g.call(f, P("/proc/ran_zone"), null, [live(def_zone)]));
		}
		if (!truthy((BP = (yield* g.callName(f, live(H), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [live(def_zone)]))]))))) {
			BP = rt.index(rt.fv(f, "bodyparts", live(H)), 1);
		}
	}
	$0 = live(damagetype);
	if ($0 === "brute") {
		rt.setFv(f, "damageoverlaytemp", live(H), 20);
		if (truthy(live(BP))) {
			if (truthy((yield* g.callName(f, live(BP), "receive_damage", [multiply(multiply(live(damage), live(hit_percent)), rt.sv(f, "brutemod")), 0])))) {
				yield* g.callName(f, live(H), "update_damage_overlays", []);
			}
		} else {
			yield* g.callName(f, live(H), "adjustBruteLoss", [multiply(multiply(live(damage), live(hit_percent)), rt.sv(f, "brutemod"))]);
		}
	} else if ($0 === "fire") {
		rt.setFv(f, "damageoverlaytemp", live(H), 20);
		if (truthy(live(BP))) {
			if (truthy((yield* g.callName(f, live(BP), "receive_damage", [0, multiply(multiply(live(damage), live(hit_percent)), rt.sv(f, "burnmod"))])))) {
				yield* g.callName(f, live(H), "update_damage_overlays", []);
			}
		} else {
			yield* g.callName(f, live(H), "adjustFireLoss", [multiply(multiply(live(damage), live(hit_percent)), rt.sv(f, "burnmod"))]);
		}
	} else if ($0 === "tox") {
		yield* g.callName(f, live(H), "adjustToxLoss", [multiply(live(damage), live(hit_percent))]);
	} else if ($0 === "oxy") {
		yield* g.callName(f, live(H), "adjustOxyLoss", [multiply(live(damage), live(hit_percent))]);
	} else if ($0 === "clone") {
		yield* g.callName(f, live(H), "adjustCloneLoss", [multiply(live(damage), live(hit_percent))]);
	} else if ($0 === "stamina") {
		yield* g.callName(f, live(H), "adjustStaminaLoss", [multiply(live(damage), live(hit_percent))]);
	}
	return 1;
}, true);

// /datum/species/proc/on_hit  (code/modules/mob/living/carbon/human/species.dm:1308)
rt.def("/datum/species/proc/on_hit", function on_hit(f: Frame, _P: Value, H: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "type", live(_P));
	if (isEqual($0, T("/obj/item/projectile/energy/floramut"))) {
		rt.callName(f, live(H), "show_message", ["<span class='notice'>The radiation beam dissipates harmlessly through your body.</span>"]);
	} else if (isEqual($0, T("/obj/item/projectile/energy/florayield"))) {
		rt.callName(f, live(H), "show_message", ["<span class='notice'>The radiation beam dissipates harmlessly through your body.</span>"]);
	}
	return f.dot;
});

// /datum/species/proc/breathe  (code/modules/mob/living/carbon/human/species.dm:1323)
rt.def("/datum/species/proc/breathe", function breathe(f: Frame, H: Value) {
	if (!truthy((rt.isIn(f, 10, rt.sv(f, "species_traits")) ? 1 : 0))) return f.dot;
	return 1;
});

// /datum/species/proc/handle_environment  (code/modules/mob/living/carbon/human/species.dm:1327)  may sleep
rt.def("/datum/species/proc/handle_environment", function* handle_environment(f: Frame, environment: Value, H: Value) {
	let loc_temp: Value = null, thermal_protection: Value = null, burn_damage: Value = null, pressure: Value = null, adjusted_pressure: Value = null;
	let $0: any;
	f.vars = () => [environment, H, loc_temp, thermal_protection, burn_damage, pressure, adjusted_pressure, $0];
	if (!truthy(live(environment))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(H)), T("/obj/machinery/atmospherics/components/unary/cryo_cell")) ? 1 : 0))) {
		return live(f.dot);
	}
	loc_temp = (yield* g.callName(f, live(H), "get_temperature", [live(environment)]));
	if (!isEqual(rt.fv(f, "stat", live(H)), 2)) {
		yield* g.callName(f, live(H), "natural_bodytemperature_stabilization", []);
	}
	if (!truthy(rt.fv(f, "on_fire", live(H)))) {
		if (rt.lt(live(loc_temp), rt.fv(f, "bodytemperature", live(H)))) {
			if (rt.lt((thermal_protection = (yield* g.callName(f, live(H), "get_cold_protection", [live(loc_temp)]))), 1)) {
				rt.modField(f, live(H), "bodytemperature", (yield* g.call(f, P("/proc/min"), null, [multiply(subtract(1, live(thermal_protection)), divide(subtract(live(loc_temp), rt.fv(f, "bodytemperature", live(H))), 6)), 30])), add);
			}
		} else {
			if (rt.lt((thermal_protection = (yield* g.callName(f, live(H), "get_heat_protection", [live(loc_temp)]))), 1)) {
				rt.modField(f, live(H), "bodytemperature", (yield* g.call(f, P("/proc/min"), null, [multiply(subtract(1, live(thermal_protection)), divide(subtract(live(loc_temp), rt.fv(f, "bodytemperature", live(H))), 6)), 30])), add);
			}
		}
	}
	if ((rt.gt(rt.fv(f, "bodytemperature", live(H)), 360.1499938964844) && !truthy((rt.isIn(f, 6, rt.sv(f, "species_traits")) ? 1 : 0)))) {
		burn_damage = null;
		$0 = rt.fv(f, "bodytemperature", live(H));
		if (rt.inRange($0, 360, 400)) {
			yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/hot"), 1]);
			burn_damage = 2;
		} else if (rt.inRange($0, 400, 460)) {
			yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/hot"), 2]);
			burn_damage = 3;
		} else if (rt.inRange($0, 460, 9.999999848243207e+30)) {
			yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/hot"), 3]);
			if (truthy(rt.fv(f, "on_fire", live(H)))) {
				burn_damage = 8;
			} else {
				burn_damage = 3;
			}
		}
		(burn_damage = rt.modify(live(burn_damage), rt.sv(f, "heatmod"), multiply));
		if (truthy(divide(multiply(rt.op(f, "Prob", [], [live(burn_damage)]), 10), 4))) {
			yield* g.callName(f, live(H), "emote", ["scream"]);
		}
		yield* g.callName(f, live(H), "apply_damage", [live(burn_damage), "fire"]);
	} else {
		if ((rt.lt(rt.fv(f, "bodytemperature", live(H)), 260.1499938964844) && !truthy((rt.isIn(f, rt.at(rt.gl("mutations_list"), "Cold Resistance"), rt.gv(f, "mutations", rt.fv(f, "dna", live(H)))) ? 1 : 0)))) {
			$0 = rt.fv(f, "bodytemperature", live(H));
			if (rt.inRange($0, 200, 260)) {
				yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/cold"), 1]);
				yield* g.callName(f, live(H), "apply_damage", [multiply(0.5, rt.sv(f, "coldmod")), "fire"]);
			} else if (rt.inRange($0, 120, 200)) {
				yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/cold"), 2]);
				yield* g.callName(f, live(H), "apply_damage", [multiply(1.5, rt.sv(f, "coldmod")), "fire"]);
			} else if (rt.inRange($0, -9.999999848243207e+30, 120)) {
				yield* g.callName(f, live(H), "throw_alert", ["temp", T("/obj/screen/alert/cold"), 3]);
				yield* g.callName(f, live(H), "apply_damage", [multiply(3, rt.sv(f, "coldmod")), "fire"]);
			} else {
				yield* g.callName(f, live(H), "clear_alert", ["temp"]);
			}
		} else {
			yield* g.callName(f, live(H), "clear_alert", ["temp"]);
		}
	}
	pressure = (yield* g.callName(f, live(environment), "return_pressure", []));
	$0 = (adjusted_pressure = (yield* g.callName(f, live(H), "calculate_affecting_pressure", [live(pressure)])));
	if (rt.inRange($0, 550, 9.999999848243207e+30)) {
		if (!truthy((rt.isIn(f, 8, rt.sv(f, "species_traits")) ? 1 : 0))) {
			yield* g.callName(f, live(H), "adjustBruteLoss", [(yield* g.call(f, P("/proc/min"), null, [multiply(subtract(divide(live(adjusted_pressure), 550), 1), 4), 4]))]);
			yield* g.callName(f, live(H), "throw_alert", ["pressure", T("/obj/screen/alert/highpressure"), 2]);
		} else {
			yield* g.callName(f, live(H), "clear_alert", ["pressure"]);
		}
	} else if (rt.inRange($0, 325, 550)) {
		yield* g.callName(f, live(H), "throw_alert", ["pressure", T("/obj/screen/alert/highpressure"), 1]);
	} else if (rt.inRange($0, 50, 325)) {
		yield* g.callName(f, live(H), "clear_alert", ["pressure"]);
	} else if (rt.inRange($0, 20, 50)) {
		yield* g.callName(f, live(H), "throw_alert", ["pressure", T("/obj/screen/alert/lowpressure"), 1]);
	} else {
		if ((truthy((yield* g.callName(f, rt.fv(f, "dna", live(H)), "check_mutation", ["Cold Resistance"]))) || truthy((rt.isIn(f, 8, rt.sv(f, "species_traits")) ? 1 : 0)))) {
			yield* g.callName(f, live(H), "clear_alert", ["pressure"]);
		} else {
			yield* g.callName(f, live(H), "adjustBruteLoss", [2]);
			yield* g.callName(f, live(H), "throw_alert", ["pressure", T("/obj/screen/alert/lowpressure"), 2]);
		}
	}
	return f.dot;
}, true);

// /datum/species/proc/handle_fire  (code/modules/mob/living/carbon/human/species.dm:1419)  may sleep
rt.def("/datum/species/proc/handle_fire", function* handle_fire(f: Frame, H: Value, no_protection: Value) {
	let burning_items: Value = null, head_clothes: Value = null, chest_clothes: Value = null, arm_clothes: Value = null, leg_clothes: Value = null, X: Value = null, I: Value = null, thermal_protection: Value = null;
	let $e: any;
	f.vars = () => [H, no_protection, burning_items, head_clothes, chest_clothes, arm_clothes, leg_clothes, X, I, thermal_protection, $e];
	if (live(no_protection) === null) {
		no_protection = 0;
	}
	if (truthy((rt.isIn(f, 13, rt.sv(f, "species_traits")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "on_fire", live(H)))) return f.dot;
	burning_items = rt.list();
	head_clothes = null;
	if (truthy(rt.fv(f, "glasses", live(H)))) {
		head_clothes = rt.fv(f, "glasses", live(H));
	}
	if (truthy(rt.fv(f, "wear_mask", live(H)))) {
		head_clothes = rt.fv(f, "wear_mask", live(H));
	}
	if (truthy(rt.fv(f, "wear_neck", live(H)))) {
		head_clothes = rt.fv(f, "wear_neck", live(H));
	}
	if (truthy(rt.fv(f, "head", live(H)))) {
		head_clothes = rt.fv(f, "head", live(H));
	}
	if (truthy(live(head_clothes))) {
		burning_items = rt.modify(live(burning_items), live(head_clothes), add);
	} else {
		if (truthy(rt.fv(f, "ears", live(H)))) {
			burning_items = rt.modify(live(burning_items), rt.fv(f, "ears", live(H)), add);
		}
	}
	chest_clothes = null;
	if (truthy(rt.fv(f, "w_uniform", live(H)))) {
		chest_clothes = rt.fv(f, "w_uniform", live(H));
	}
	if (truthy(rt.fv(f, "wear_suit", live(H)))) {
		chest_clothes = rt.fv(f, "wear_suit", live(H));
	}
	if (truthy(live(chest_clothes))) {
		burning_items = rt.modify(live(burning_items), live(chest_clothes), add);
	}
	arm_clothes = null;
	if (truthy(rt.fv(f, "gloves", live(H)))) {
		arm_clothes = rt.fv(f, "gloves", live(H));
	}
	if ((truthy(rt.fv(f, "w_uniform", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 1536)) || truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 384))))) {
		arm_clothes = rt.fv(f, "w_uniform", live(H));
	}
	if ((truthy(rt.fv(f, "wear_suit", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 1536)) || truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 384))))) {
		arm_clothes = rt.fv(f, "wear_suit", live(H));
	}
	if (truthy(live(arm_clothes))) {
		burning_items = rt.modify(live(burning_items), live(arm_clothes), add);
	}
	leg_clothes = null;
	if (truthy(rt.fv(f, "shoes", live(H)))) {
		leg_clothes = rt.fv(f, "shoes", live(H));
	}
	if ((truthy(rt.fv(f, "w_uniform", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 96)) || truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "w_uniform", live(H))), 24))))) {
		leg_clothes = rt.fv(f, "w_uniform", live(H));
	}
	if ((truthy(rt.fv(f, "wear_suit", live(H))) && (truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 96)) || truthy(rt.bitAnd(rt.gv(f, "body_parts_covered", rt.fv(f, "wear_suit", live(H))), 24))))) {
		leg_clothes = rt.fv(f, "wear_suit", live(H));
	}
	if (truthy(live(leg_clothes))) {
		burning_items = rt.modify(live(burning_items), live(leg_clothes), add);
	}
	X = null;
	rt.forList(f, 0, live(burning_items));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (!truthy(rt.bitAnd(rt.gv(f, "resistance_flags", (I = live(X))), 2))) {
			yield* g.callName(f, live(I), "take_damage", [rt.fv(f, "fire_stacks", live(H)), "fire", "fire", 0]);
		}
	}
	rt.endFor(f, 0);
	if ((rt.ge((thermal_protection = (yield* g.callName(f, live(H), "get_thermal_protection", []))), 35000) && !truthy(live(no_protection)))) {
		return live(f.dot);
	}
	if ((rt.ge(live(thermal_protection), 30000) && !truthy(live(no_protection)))) {
		rt.modField(f, live(H), "bodytemperature", 11, add);
	} else {
		rt.modField(f, live(H), "bodytemperature", add(30, multiply(rt.fv(f, "fire_stacks", live(H)), 12)), add);
	}
	return f.dot;
}, true);

// /datum/species/proc/CanIgniteMob  (code/modules/mob/living/carbon/human/species.dm:1486)
rt.def("/datum/species/proc/CanIgniteMob", function CanIgniteMob(f: Frame, H: Value) {
	if (truthy((rt.isIn(f, 13, rt.sv(f, "species_traits")) ? 1 : 0))) {
		return 0;
	}
	return 1;
});

// /datum/species/proc/spec_stun  (code/modules/mob/living/carbon/human/species.dm:1499)
rt.def("/datum/species/proc/spec_stun", function spec_stun(f: Frame, H: Value, amount: Value) {
	f.dot = multiply(rt.sv(f, "stunmod"), live(amount));
	return f.dot;
});
