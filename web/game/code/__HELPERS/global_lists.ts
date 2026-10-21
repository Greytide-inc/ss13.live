// From code/__HELPERS/global_lists.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/make_datum_references_lists  (code/__HELPERS/global_lists.dm:7)  may sleep
rt.def("/proc/make_datum_references_lists", function* make_datum_references_lists(f: Frame) {
	let spath: Value = null, S: Value = null, path: Value = null, D: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [spath, S, path, D, E, $e];
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/hair"), rt.gl("hair_styles_list"), rt.gl("hair_styles_male_list"), rt.gl("hair_styles_female_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/facial_hair"), rt.gl("facial_hair_styles_list"), rt.gl("facial_hair_styles_male_list"), rt.gl("facial_hair_styles_female_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/underwear"), rt.gl("underwear_list"), rt.gl("underwear_m"), rt.gl("underwear_f")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/undershirt"), rt.gl("undershirt_list"), rt.gl("undershirt_m"), rt.gl("undershirt_f")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/socks"), rt.gl("socks_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/body_markings"), rt.gl("body_markings_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails/lizard"), rt.gl("tails_list_lizard")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails_animated/lizard"), rt.gl("animated_tails_list_lizard")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails/human"), rt.gl("tails_list_human")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/tails_animated/human"), rt.gl("animated_tails_list_human")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/snouts"), rt.gl("snouts_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/horns"), rt.gl("horns_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/ears"), rt.gl("ears_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/wings"), rt.gl("wings_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/wings_open"), rt.gl("wings_open_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/frills"), rt.gl("frills_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/spines"), rt.gl("spines_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/spines_animated"), rt.gl("animated_spines_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/legs"), rt.gl("legs_list")]);
	yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [null, T("/datum/sprite_accessory/wings"), null, rt.gl("r_wings_list"), "roundstart", 1], rt.Args.Named);
	spath = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
	while (($e = rt.next(f, 0)) !== undefined) {
		spath = $e;
		if (truthy(rt.gv(f, "roundstart", (S = (yield* g.new_(f, live(spath), [])))))) {
			rt.setAt(rt.gl("roundstart_species"), rt.fv(f, "id", live(S)), rt.fv(f, "type", live(S)));
		}
		rt.setAt(rt.gl("species_list"), rt.fv(f, "id", live(S)), rt.fv(f, "type", live(S)));
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/surgery")])), T("/datum/surgery")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		rt.modGl("surgeries_list", (yield* g.new_(f, live(path), [])), add);
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/material")])), T("/datum/material")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		D = (yield* g.new_(f, live(path), []));
		rt.setAt(rt.gl("materials_list"), rt.fv(f, "id", live(D)), live(D));
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		D = (yield* g.new_(f, live(path), []));
		rt.setAt(rt.gl("tech_list"), rt.fv(f, "id", live(D)), live(D));
	}
	rt.endFor(f, 0);
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/emote")])), T("/datum/emote")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		E = (yield* g.new_(f, live(path), []));
		rt.setAt(rt.gl("emote_list"), rt.fv(f, "key", live(E)), live(E));
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/init_subtypes"), null, [T("/datum/crafting_recipe"), rt.gl("crafting_recipes")]);
	return f.dot;
}, true);

// /proc/init_subtypes  (code/__HELPERS/global_lists.dm:77)  may sleep
rt.def("/proc/init_subtypes", function* init_subtypes(f: Frame, prototype: Value, L: Value) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [prototype, L, path, $e];
	if (!truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) {
		L = rt.list();
	}
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [live(prototype)])), live(prototype)));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		L = rt.modify(live(L), (yield* g.new_(f, live(path), [])), add);
	}
	rt.endFor(f, 0);
	return live(L);
}, true);

// /proc/init_paths  (code/__HELPERS/global_lists.dm:86)
rt.def("/proc/init_paths", function init_paths(f: Frame, prototype: Value, L: Value) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [L, path, $e];
	if (truthy((rt.istype(live(L), T("/list")) ? 1 : 0))) return f.dot;
	L = rt.list();
	path = null;
	rt.forList(f, 0, subtract(rt.call(f, P("/proc/typesof"), null, [live(prototype)]), live(prototype)));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		L = rt.modify(live(L), live(path), add);
	}
	rt.endFor(f, 0);
	return live(L);
});
