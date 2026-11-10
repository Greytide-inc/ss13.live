// Based on /tg/station's code/__HELPERS/global_lists.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// global_lists.dm:7
rt.def("/proc/make_datum_references_lists", function* make_datum_references_lists(f: Frame) {
	let spath: Value = null, S: Value = null, path: Value = null, D: Value = null, E: Value = null;
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/hair"), GLOB.hair_styles_list, GLOB.hair_styles_male_list, GLOB.hair_styles_female_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/facial_hair"), GLOB.facial_hair_styles_list, GLOB.facial_hair_styles_male_list, GLOB.facial_hair_styles_female_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/underwear"), GLOB.underwear_list, GLOB.underwear_m, GLOB.underwear_f);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/undershirt"), GLOB.undershirt_list, GLOB.undershirt_m, GLOB.undershirt_f);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/socks"), GLOB.socks_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/body_markings"), GLOB.body_markings_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails/lizard"), GLOB.tails_list_lizard);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails_animated/lizard"), GLOB.animated_tails_list_lizard);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails/human"), GLOB.tails_list_human);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/tails_animated/human"), GLOB.animated_tails_list_human);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/snouts"), GLOB.snouts_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/horns"), GLOB.horns_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/ears"), GLOB.ears_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/wings"), GLOB.wings_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/wings_open"), GLOB.wings_open_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/frills"), GLOB.frills_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/spines"), GLOB.spines_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/spines_animated"), GLOB.animated_spines_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/legs"), GLOB.legs_list);
	yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/wings"), GLOB.r_wings_list, { roundstart: 1 });
	for (spath of each(typesof(T("/datum/species")) - T("/datum/species"))) {
		if ((S = (yield* new_(spath))).roundstart) {
			rt.setAt(GLOB.roundstart_species, S.id, S.type);
		}
		rt.setAt(GLOB.species_list, S.id, S.type);
	}
	for (path of each(typesof(T("/datum/surgery")) - T("/datum/surgery"))) {
		GLOB.surgeries_list += (yield* new_(path));
	}
	path = null;
	for (path of each(typesof(T("/datum/material")) - T("/datum/material"))) {
		D = (yield* new_(path));
		rt.setAt(GLOB.materials_list, D.id, D);
	}
	path = null;
	for (path of each(typesof(T("/datum/tech")) - T("/datum/tech"))) {
		D = (yield* new_(path));
		rt.setAt(GLOB.tech_list, D.id, D);
	}
	path = null;
	for (path of each(typesof(T("/datum/emote")) - T("/datum/emote"))) {
		E = (yield* new_(path));
		rt.setAt(GLOB.emote_list, E.key, E);
	}
	yield* init_subtypes(T("/datum/crafting_recipe"), GLOB.crafting_recipes);
	return f.dot;
}, true);

// global_lists.dm:77
rt.def("/proc/init_subtypes", function* init_subtypes(f: Frame, prototype: Value, L: Value) {
	let path: Value = null;
	if (!rt.istype(L, T("/list"))) {
		L = list();
	}
	for (path of each(typesof(prototype) - prototype)) {
		L += (yield* new_(path));
	}
	return L;
}, true);
