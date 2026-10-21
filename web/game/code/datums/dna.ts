// From code/datums/dna.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(397, "/datum/dna", "/datum", {
	unique_enzymes: null,
	struc_enzymes: null,
	uni_identity: null,
	blood_type: null,
	features: null,
	real_name: null,
	mutations: null,
	temporary_mutations: null,
	previous: null,
	holder: null,
	species: null,
});

// /datum/dna/proc/<init>  (code/datums/dna.dm:9)
rt.def("/datum/dna/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "features", rt.list("FFF"));
	$0 = $0;
	rt.setSv(f, "mutations", rt.list());
	$0 = $0;
	rt.setSv(f, "temporary_mutations", rt.list());
	$0 = $0;
	rt.setSv(f, "previous", rt.list());
	$0 = $0;
	rt.setSv(f, "species", rt.new_(f, T("/datum/species/human"), []));
	return f.dot;
});

// /datum/dna/proc/New  (code/datums/dna.dm:18)
rt.def("/datum/dna/proc/New", function New(f: Frame, new_holder: Value) {
	if (!truthy(live(new_holder))) return f.dot;
	rt.setSv(f, "holder", live(new_holder));
	return f.dot;
});

// /datum/dna/proc/transfer_identity  (code/datums/dna.dm:21)  may sleep
rt.def("/datum/dna/proc/transfer_identity", function* transfer_identity(f: Frame, destination: Value, transfer_SE: Value) {
	f.vars = () => [destination, transfer_SE];
	if (live(transfer_SE) === null) {
		transfer_SE = 0;
	}
	if (!truthy((rt.istype(live(destination), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	rt.setFv(f, "unique_enzymes", rt.fv(f, "dna", live(destination)), rt.sv(f, "unique_enzymes"));
	rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(destination)), rt.sv(f, "uni_identity"));
	rt.setFv(f, "blood_type", rt.fv(f, "dna", live(destination)), rt.sv(f, "blood_type"));
	yield* g.callName(f, live(destination), "set_species", [null, rt.fv(f, "type", rt.sv(f, "species")), "icon_update", 0], rt.Args.Named);
	rt.setFv(f, "features", rt.fv(f, "dna", live(destination)), (yield* g.callName(f, rt.sv(f, "features"), "Copy", [])));
	rt.setFv(f, "real_name", rt.fv(f, "dna", live(destination)), rt.sv(f, "real_name"));
	rt.setFv(f, "temporary_mutations", rt.fv(f, "dna", live(destination)), (yield* g.callName(f, rt.sv(f, "temporary_mutations"), "Copy", [])));
	if (!truthy(live(transfer_SE))) return f.dot;
	rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(destination)), rt.sv(f, "struc_enzymes"));
	return f.dot;
}, true);

// /datum/dna/proc/copy_dna  (code/datums/dna.dm:38)  may sleep
rt.def("/datum/dna/proc/copy_dna", function* copy_dna(f: Frame, new_dna: Value) {
	f.vars = () => [new_dna];
	rt.setFv(f, "unique_enzymes", live(new_dna), rt.sv(f, "unique_enzymes"));
	rt.setFv(f, "struc_enzymes", live(new_dna), rt.sv(f, "struc_enzymes"));
	rt.setFv(f, "uni_identity", live(new_dna), rt.sv(f, "uni_identity"));
	rt.setFv(f, "blood_type", live(new_dna), rt.sv(f, "blood_type"));
	rt.setFv(f, "features", live(new_dna), (yield* g.callName(f, rt.sv(f, "features"), "Copy", [])));
	rt.setFv(f, "species", live(new_dna), (yield* g.new_(f, rt.fv(f, "type", rt.sv(f, "species")), [])));
	rt.setFv(f, "real_name", live(new_dna), rt.sv(f, "real_name"));
	rt.setFv(f, "mutations", live(new_dna), (yield* g.callName(f, rt.sv(f, "mutations"), "Copy", [])));
	return f.dot;
}, true);

// /datum/dna/proc/add_mutation  (code/datums/dna.dm:44)  may sleep
rt.def("/datum/dna/proc/add_mutation", function* add_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = null;
	f.vars = () => [mutation_name, HM];
	yield* g.callName(f, (HM = rt.index(rt.gl("mutations_list"), live(mutation_name))), "on_acquiring", [rt.sv(f, "holder")]);
	return f.dot;
}, true);

// /datum/dna/proc/remove_mutation  (code/datums/dna.dm:48)  may sleep
rt.def("/datum/dna/proc/remove_mutation", function* remove_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = null;
	f.vars = () => [mutation_name, HM];
	yield* g.callName(f, (HM = rt.index(rt.gl("mutations_list"), live(mutation_name))), "on_losing", [rt.sv(f, "holder")]);
	return f.dot;
}, true);

// /datum/dna/proc/check_mutation  (code/datums/dna.dm:52)
rt.def("/datum/dna/proc/check_mutation", function check_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = null;
	f.vars = () => [HM];
	HM = rt.index(rt.gl("mutations_list"), live(mutation_name));
	return rt.callName(f, rt.sv(f, "mutations"), "Find", [live(HM)]);
});

// /datum/dna/proc/remove_all_mutations  (code/datums/dna.dm:56)  may sleep
rt.def("/datum/dna/proc/remove_all_mutations", function* remove_all_mutations(f: Frame) {
	yield* g.srcCall(f, "remove_mutation_group", rt.sv(f, "mutations"));
	return f.dot;
}, true);

// /datum/dna/proc/remove_mutation_group  (code/datums/dna.dm:59)  may sleep
rt.def("/datum/dna/proc/remove_mutation_group", function* remove_mutation_group(f: Frame, group: Value) {
	let HM: Value = null;
	let $e: any;
	f.vars = () => [group, HM, $e];
	if (!truthy(live(group))) {
		return live(f.dot);
	}
	HM = null;
	rt.forList(f, 0, live(group), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HM = $e;
		yield* g.callName(f, live(HM), "force_lose", [rt.sv(f, "holder")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/dna/proc/generate_uni_identity  (code/datums/dna.dm:65)  may sleep
rt.def("/datum/dna/proc/generate_uni_identity", function* generate_uni_identity(f: Frame) {
	let L: Value = null, H: Value = null, i: Value = null;
	f.vars = () => [L, H, i];
	f.dot = "";
	rt.setAt((L = (yield* g.new_(f, T("/list"), [7]))), 5, (yield* g.call(f, P("/proc/construct_block"), null, [add((!isEqual(rt.fv(f, "gender", rt.sv(f, "holder")), "male") ? 1 : 0), 1), 2])));
	if (truthy((rt.istype(rt.sv(f, "holder"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = rt.sv(f, "holder");
		if (!truthy(rt.len(f, rt.gl("hair_styles_list")))) {
			yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/hair"), rt.gl("hair_styles_list"), rt.gl("hair_styles_male_list"), rt.gl("hair_styles_female_list")]);
		}
		rt.setAt(live(L), 7, (yield* g.call(f, P("/proc/construct_block"), null, [(yield* g.callName(f, rt.gl("hair_styles_list"), "Find", [rt.fv(f, "hair_style", live(H))])), rt.len(f, rt.gl("hair_styles_list"))])));
		rt.setAt(live(L), 1, (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "hair_color", live(H))])));
		if (!truthy(rt.len(f, rt.gl("facial_hair_styles_list")))) {
			yield* g.call(f, P("/proc/init_sprite_accessory_subtypes"), null, [T("/datum/sprite_accessory/facial_hair"), rt.gl("facial_hair_styles_list"), rt.gl("facial_hair_styles_male_list"), rt.gl("facial_hair_styles_female_list")]);
		}
		rt.setAt(live(L), 6, (yield* g.call(f, P("/proc/construct_block"), null, [(yield* g.callName(f, rt.gl("facial_hair_styles_list"), "Find", [rt.fv(f, "facial_hair_style", live(H))])), rt.len(f, rt.gl("facial_hair_styles_list"))])));
		rt.setAt(live(L), 2, (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "facial_hair_color", live(H))])));
		rt.setAt(live(L), 3, (yield* g.call(f, P("/proc/construct_block"), null, [(yield* g.callName(f, rt.gl("skin_tones"), "Find", [rt.fv(f, "skin_tone", live(H))])), rt.len(f, rt.gl("skin_tones"))])));
		rt.setAt(live(L), 4, (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "eye_color", live(H))])));
	}
	i = null;
	i = 1;
	while (rt.le(live(i), 7)) {
		if (truthy(rt.index(live(L), live(i)))) {
			f.dot = rt.modify(live(f.dot), rt.index(live(L), live(i)), add);
		} else {
			f.dot = rt.modify(live(f.dot), (yield* g.call(f, P("/proc/random_string"), null, [3, rt.gl("hex_characters")])), add);
		}
		i = rt.inc(live(i), 1);
	}
	return live(f.dot);
}, true);

// /datum/dna/proc/generate_struc_enzymes  (code/datums/dna.dm:90)
rt.def("/datum/dna/proc/generate_struc_enzymes", function generate_struc_enzymes(f: Frame) {
	let sorting: Value = null, result: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [sorting, result, A, B, $e];
	sorting = rt.new_(f, T("/list"), [19]);
	result = "";
	A = null;
	rt.forList(f, 0, add(add(rt.gl("good_mutations"), rt.gl("bad_mutations")), rt.gl("not_good_mutations")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if ((isEqual(rt.fv(f, "name", live(A)), "Monkified") && truthy((rt.istype(rt.sv(f, "holder"), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
			rt.setAt(live(sorting), rt.fv(f, "dna_block", live(A)), rt.call(f, P("/proc/num2hex"), null, [add(rt.fv(f, "lowest_value", live(A)), rt.call(f, P("/proc/rand"), null, [0, 1536])), 3]));
			(rt.modSrcVar(f, "mutations", live(A), rt.bitOr));
		} else {
			rt.setAt(live(sorting), rt.fv(f, "dna_block", live(A)), rt.call(f, P("/proc/random_string"), null, [3, rt.list("0", "1", "2", "3", "4", "5", "6")]));
		}
	}
	rt.endFor(f, 0);
	B = null;
	rt.forList(f, 0, live(sorting));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		result = rt.modify(live(result), live(B), add);
	}
	rt.endFor(f, 0);
	return live(result);
});

// /datum/dna/proc/generate_unique_enzymes  (code/datums/dna.dm:104)
rt.def("/datum/dna/proc/generate_unique_enzymes", function generate_unique_enzymes(f: Frame) {
	f.dot = "";
	if (truthy((rt.istype(rt.sv(f, "holder"), T("/mob/living")) ? 1 : 0))) {
		rt.setSv(f, "real_name", rt.fv(f, "real_name", rt.sv(f, "holder")));
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/md5"), null, [rt.fv(f, "real_name", rt.sv(f, "holder"))]), add);
	} else {
		f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/random_string"), null, [32, rt.gl("hex_characters")]), add);
	}
	return live(f.dot);
});

// /datum/dna/proc/update_ui_block  (code/datums/dna.dm:113)
rt.def("/datum/dna/proc/update_ui_block", function update_ui_block(f: Frame, blocknumber: Value) {
	let H: Value = null;
	let $0: any;
	f.vars = () => [H, $0];
	if ((!truthy(live(blocknumber)) || !truthy((rt.istype(rt.sv(f, "holder"), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	H = rt.sv(f, "holder");
	$0 = live(blocknumber);
	if ($0 === 1) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "hair_color", live(H))])]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "facial_hair_color", live(H))])]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/construct_block"), null, [rt.callName(f, rt.gl("skin_tones"), "Find", [rt.fv(f, "skin_tone", live(H))]), rt.len(f, rt.gl("skin_tones"))])]);
	} else if ($0 === 4) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/sanitize_hexcolor"), null, [rt.fv(f, "eye_color", live(H))])]);
	} else if ($0 === 5) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/construct_block"), null, [add((!isEqual(rt.fv(f, "gender", live(H)), "male") ? 1 : 0), 1), 2])]);
	} else if ($0 === 6) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/construct_block"), null, [rt.callName(f, rt.gl("facial_hair_styles_list"), "Find", [rt.fv(f, "facial_hair_style", live(H))]), rt.len(f, rt.gl("facial_hair_styles_list"))])]);
	} else if ($0 === 7) {
		rt.call(f, P("/proc/setblock"), null, [rt.sv(f, "uni_identity"), live(blocknumber), rt.call(f, P("/proc/construct_block"), null, [rt.callName(f, rt.gl("hair_styles_list"), "Find", [rt.fv(f, "hair_style", live(H))]), rt.len(f, rt.gl("hair_styles_list"))])]);
	}
	return f.dot;
});

// /datum/dna/proc/mutations_say_mods  (code/datums/dna.dm:134)
rt.def("/datum/dna/proc/mutations_say_mods", function mutations_say_mods(f: Frame, message: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [message, M, $e];
	if (!truthy(live(message))) return f.dot;
	M = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		message = rt.callName(f, live(M), "say_mod", [live(message)]);
	}
	rt.endFor(f, 0);
	return live(message);
});

// /datum/dna/proc/mutations_get_spans  (code/datums/dna.dm:139)
rt.def("/datum/dna/proc/mutations_get_spans", function mutations_get_spans(f: Frame) {
	let spans: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [spans, M, $e];
	spans = rt.list();
	M = null;
	rt.forList(f, 0, rt.sv(f, "mutations"), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		(spans = rt.modify(live(spans), rt.callName(f, live(M), "get_spans", []), rt.bitOr));
	}
	rt.endFor(f, 0);
	return live(spans);
});

// /datum/dna/proc/species_get_spans  (code/datums/dna.dm:145)
rt.def("/datum/dna/proc/species_get_spans", function species_get_spans(f: Frame) {
	let spans: Value = null;
	f.vars = () => [spans];
	spans = rt.list();
	if (truthy(rt.sv(f, "species"))) {
		(spans = rt.modify(live(spans), rt.callName(f, rt.sv(f, "species"), "get_spans", []), rt.bitOr));
	}
	return live(spans);
});

// /datum/dna/proc/is_same_as  (code/datums/dna.dm:152)
rt.def("/datum/dna/proc/is_same_as", function is_same_as(f: Frame, D: Value) {
	if (((isEqual(rt.sv(f, "uni_identity"), rt.fv(f, "uni_identity", live(D))) && isEqual(rt.sv(f, "struc_enzymes"), rt.fv(f, "struc_enzymes", live(D)))) && isEqual(rt.sv(f, "real_name"), rt.fv(f, "real_name", live(D))))) {
		if (((isEqual(rt.fv(f, "type", rt.sv(f, "species")), rt.gv(f, "type", rt.fv(f, "species", live(D)))) && isEqual(rt.sv(f, "features"), rt.fv(f, "features", live(D)))) && isEqual(rt.sv(f, "blood_type"), rt.fv(f, "blood_type", live(D))))) {
			return 1;
		}
	}
	return 0;
});

// /datum/dna/proc/update_dna_identity  (code/datums/dna.dm:159)  may sleep
rt.def("/datum/dna/proc/update_dna_identity", function* update_dna_identity(f: Frame) {
	rt.setSv(f, "uni_identity", (yield* g.srcCall(f, "generate_uni_identity")));
	rt.setSv(f, "unique_enzymes", (yield* g.srcCall(f, "generate_unique_enzymes")));
	return f.dot;
}, true);

// /datum/dna/proc/initialize_dna  (code/datums/dna.dm:164)  may sleep
rt.def("/datum/dna/proc/initialize_dna", function* initialize_dna(f: Frame, newblood_type: Value) {
	f.vars = () => [newblood_type];
	if (truthy(live(newblood_type))) {
		rt.setSv(f, "blood_type", live(newblood_type));
	}
	rt.setSv(f, "unique_enzymes", (yield* g.srcCall(f, "generate_unique_enzymes")));
	rt.setSv(f, "uni_identity", (yield* g.srcCall(f, "generate_uni_identity")));
	rt.setSv(f, "struc_enzymes", (yield* g.srcCall(f, "generate_struc_enzymes")));
	rt.setSv(f, "features", (yield* g.call(f, P("/proc/random_features"), null, [])));
	return f.dot;
}, true);

// /mob/living/brain/proc/set_species  (code/datums/dna.dm:195)  may sleep
rt.def("/mob/living/brain/proc/set_species", function* set_species(f: Frame, mrace: Value, icon_update: Value) {
	f.vars = () => [mrace, icon_update];
	if (live(icon_update) === null) {
		icon_update = 1;
	}
	if (!truthy(live(mrace))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(mrace)])))) {
		rt.setFv(f, "species", rt.sv(f, "stored_dna"), (yield* g.new_(f, live(mrace), [])));
	} else {
		rt.setFv(f, "species", rt.sv(f, "stored_dna"), live(mrace));
	}
	return f.dot;
}, true);

// /mob/living/carbon/proc/set_species  (code/datums/dna.dm:202)  may sleep
rt.def("/mob/living/carbon/proc/set_species", function* set_species(f: Frame, mrace: Value, icon_update: Value) {
	let old_species: Value = null;
	f.vars = () => [mrace, icon_update, old_species];
	if (live(icon_update) === null) {
		icon_update = 1;
	}
	if (!(truthy(live(mrace)) && truthy((yield* g.srcCall(f, "has_dna"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "on_species_loss", [live(f.src)]);
	old_species = rt.fv(f, "species", rt.sv(f, "dna"));
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(mrace)])))) {
		rt.setFv(f, "species", rt.sv(f, "dna"), (yield* g.new_(f, live(mrace), [])));
	} else {
		rt.setFv(f, "species", rt.sv(f, "dna"), live(mrace));
	}
	yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "on_species_gain", [live(f.src), live(old_species)]);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/set_species  (code/datums/dna.dm:212)  may sleep
rt.def("/mob/living/carbon/human/proc/set_species", function* set_species(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	yield* g.srcCall(f, "update_body");
	yield* g.srcCall(f, "update_hair");
	yield* g.srcCall(f, "update_body_parts");
	yield* g.srcCall(f, "update_mutations_overlay");
	return f.dot;
}, true, { args: ["mrace", "icon_update"] });

// /mob/living/carbon/human/proc/hardset_dna  (code/datums/dna.dm:233)  may sleep
rt.def("/mob/living/carbon/human/proc/hardset_dna", function* hardset_dna(f: Frame, ui: Value, se: Value, newreal_name: Value, newblood_type: Value, mrace: Value, newfeatures: Value) {
	f.vars = () => [ui, se, newreal_name, newblood_type, mrace, newfeatures];
	if (truthy(live(newfeatures))) {
		rt.setFv(f, "features", rt.sv(f, "dna"), live(newfeatures));
	}
	if (truthy(live(mrace))) {
		yield* g.callSrc(f, "set_species", [null, live(mrace), "icon_update", 0], rt.Args.Named);
	}
	if (truthy(live(newreal_name))) {
		rt.setSv(f, "real_name", live(newreal_name));
		yield* g.callName(f, rt.sv(f, "dna"), "generate_unique_enzymes", []);
	}
	if (truthy(live(newblood_type))) {
		rt.setFv(f, "blood_type", rt.sv(f, "dna"), live(newblood_type));
	}
	if (truthy(live(ui))) {
		rt.setFv(f, "uni_identity", rt.sv(f, "dna"), live(ui));
		yield* g.callSrc(f, "updateappearance", ["icon_update", 0], rt.Args.Named);
	}
	if (truthy(live(se))) {
		rt.setFv(f, "struc_enzymes", rt.sv(f, "dna"), live(se));
		yield* g.srcCall(f, "domutcheck");
	}
	if (!((truthy(live(mrace)) || truthy(live(newfeatures))) || truthy(live(ui)))) return f.dot;
	yield* g.srcCall(f, "update_body");
	yield* g.srcCall(f, "update_hair");
	yield* g.srcCall(f, "update_body_parts");
	yield* g.srcCall(f, "update_mutations_overlay");
	return f.dot;
}, true);

// /mob/living/carbon/proc/create_dna  (code/datums/dna.dm:258)  may sleep
rt.def("/mob/living/carbon/proc/create_dna", function* create_dna(f: Frame) {
	let rando_race: Value = null;
	f.vars = () => [rando_race];
	rt.setSv(f, "dna", (yield* g.new_(f, T("/datum/dna"), [live(f.src)])));
	if (truthy(rt.fv(f, "species", rt.sv(f, "dna")))) return f.dot;
	rando_race = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "roundstart_races", rt.gl("config"))]);
	rt.setFv(f, "species", rt.sv(f, "dna"), (yield* g.new_(f, live(rando_race), [])));
	return f.dot;
}, true);

// /mob/living/carbon/proc/updateappearance  (code/datums/dna.dm:265)
rt.def("/mob/living/carbon/proc/updateappearance", function updateappearance(f: Frame, icon_update: Value, mutcolor_update: Value, mutations_overlay_update: Value) {
	let $0: any;
	f.vars = () => [icon_update, mutcolor_update, mutations_overlay_update, $0];
	if (live(icon_update) === null) {
		icon_update = 1;
	}
	if (live(mutcolor_update) === null) {
		mutcolor_update = 0;
	}
	if (live(mutations_overlay_update) === null) {
		mutations_overlay_update = 0;
	}
	if (!truthy(rt.callSrc(f, "has_dna", []))) {
		return live(f.dot);
	}
	if (truthy(subtract(rt.call(f, P("/proc/deconstruct_block"), null, [rt.call(f, P("/proc/getblock"), null, [rt.fv(f, "uni_identity", rt.sv(f, "dna")), 5]), 2]), 1))) {
		$0 = "female";
	} else {
		$0 = "male";
	}
	rt.setSv(f, "gender", $0);
	return f.dot;
});

// /mob/living/carbon/human/proc/updateappearance  (code/datums/dna.dm:270)  may sleep
rt.def("/mob/living/carbon/human/proc/updateappearance", function* updateappearance(f: Frame) {
	let structure: Value = null;
	f.vars = () => [structure];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [(yield* g.call(f, P("/proc/getblock"), null, [(structure = rt.fv(f, "uni_identity", rt.sv(f, "dna"))), 1]))])));
	rt.setSv(f, "facial_hair_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [(yield* g.call(f, P("/proc/getblock"), null, [live(structure), 2]))])));
	rt.setSv(f, "skin_tone", rt.index(rt.gl("skin_tones"), (yield* g.call(f, P("/proc/deconstruct_block"), null, [(yield* g.call(f, P("/proc/getblock"), null, [live(structure), 3])), rt.len(f, rt.gl("skin_tones"))]))));
	rt.setSv(f, "eye_color", (yield* g.call(f, P("/proc/sanitize_hexcolor"), null, [(yield* g.call(f, P("/proc/getblock"), null, [live(structure), 4]))])));
	rt.setSv(f, "facial_hair_style", rt.index(rt.gl("facial_hair_styles_list"), (yield* g.call(f, P("/proc/deconstruct_block"), null, [(yield* g.call(f, P("/proc/getblock"), null, [live(structure), 6])), rt.len(f, rt.gl("facial_hair_styles_list"))]))));
	rt.setSv(f, "hair_style", rt.index(rt.gl("hair_styles_list"), (yield* g.call(f, P("/proc/deconstruct_block"), null, [(yield* g.call(f, P("/proc/getblock"), null, [live(structure), 7])), rt.len(f, rt.gl("hair_styles_list"))]))));
	if (!truthy(live(f.args[0]))) return f.dot;
	yield* g.srcCall(f, "update_body");
	yield* g.srcCall(f, "update_hair");
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "update_body_parts");
	}
	if (!truthy(live(f.args[2]))) return f.dot;
	yield* g.srcCall(f, "update_mutations_overlay");
	return f.dot;
}, true, { args: ["icon_update", "mutcolor_update", "mutations_overlay_update"] });

// /mob/living/carbon/proc/domutcheck  (code/datums/dna.dm:291)  may sleep
rt.def("/mob/living/carbon/proc/domutcheck", function* domutcheck(f: Frame, force_powers: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [force_powers, A, $e];
	if (live(force_powers) === null) {
		force_powers = 0;
	}
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	A = null;
	rt.forList(f, 0, rt.bitOr(rt.bitOr(rt.gl("good_mutations"), rt.gl("bad_mutations")), rt.gl("not_good_mutations")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(yield* g.callName(f, live(A), "check_block", [live(f.src), live(force_powers)]))])))) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_mutations_overlay");
	return f.dot;
}, true);

// /proc/getleftblocks  (code/datums/dna.dm:304)
rt.def("/proc/getleftblocks", function getleftblocks(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	if (!rt.gt(live(blocknumber), 1)) return f.dot;
	return rt.call(f, P("/proc/copytext"), null, [live(input), 1, subtract(multiply(live(blocksize), live(blocknumber)), subtract(live(blocksize), 1))]);
});

// /proc/getrightblocks  (code/datums/dna.dm:308)
rt.def("/proc/getrightblocks", function getrightblocks(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	if (!rt.lt(live(blocknumber), divide(rt.length(live(input)), live(blocksize)))) return f.dot;
	return rt.call(f, P("/proc/copytext"), null, [live(input), add(multiply(live(blocksize), live(blocknumber)), 1), add(rt.length(live(input)), 1)]);
});

// /proc/getblock  (code/datums/dna.dm:312)
rt.def("/proc/getblock", function getblock(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	f.vars = () => [blocksize];
	if (live(blocksize) === null) {
		blocksize = 3;
	}
	return rt.call(f, P("/proc/copytext"), null, [live(input), add(multiply(live(blocksize), subtract(live(blocknumber), 1)), 1), add(multiply(live(blocksize), live(blocknumber)), 1)]);
});

// /proc/setblock  (code/datums/dna.dm:315)
rt.def("/proc/setblock", function setblock(f: Frame, istring: Value, blocknumber: Value, replacement: Value, blocksize: Value) {
	f.vars = () => [blocksize];
	if (live(blocksize) === null) {
		blocksize = 3;
	}
	if ((((!truthy(live(istring)) || !truthy(live(blocknumber))) || !truthy(live(replacement))) || !truthy(live(blocksize)))) {
		return 0;
	}
	return add(add(rt.call(f, P("/proc/getleftblocks"), null, [live(istring), live(blocknumber), live(blocksize)]), live(replacement)), rt.call(f, P("/proc/getrightblocks"), null, [live(istring), live(blocknumber), live(blocksize)]));
});

// /mob/living/carbon/proc/randmut  (code/datums/dna.dm:320)  may sleep
rt.def("/mob/living/carbon/proc/randmut", function* randmut(f: Frame, candidates: Value, difficulty: Value) {
	let num: Value = null;
	f.vars = () => [candidates, difficulty, num];
	if (live(difficulty) === null) {
		difficulty = 2;
	}
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callName(f, (num = rt.op(f, "PickUnweighted", [1], [live(candidates)])), "force_give", [live(f.src)]));
	return f.dot;
}, true);

// /mob/living/carbon/proc/randmutb  (code/datums/dna.dm:326)  may sleep
rt.def("/mob/living/carbon/proc/randmutb", function* randmutb(f: Frame) {
	let HM: Value = null;
	f.vars = () => [HM];
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callName(f, (HM = rt.op(f, "PickUnweighted", [1], [subtract(rt.bitOr(rt.gl("bad_mutations"), rt.gl("not_good_mutations")), rt.at(rt.gl("mutations_list"), "Monkified"))])), "force_give", [live(f.src)]));
	return f.dot;
}, true);

// /mob/living/carbon/proc/randmutg  (code/datums/dna.dm:332)  may sleep
rt.def("/mob/living/carbon/proc/randmutg", function* randmutg(f: Frame) {
	let HM: Value = null;
	f.vars = () => [HM];
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callName(f, (HM = rt.op(f, "PickUnweighted", [1], [rt.gl("good_mutations")])), "force_give", [live(f.src)]));
	return f.dot;
}, true);

// /mob/living/carbon/proc/randmutvg  (code/datums/dna.dm:338)  may sleep
rt.def("/mob/living/carbon/proc/randmutvg", function* randmutvg(f: Frame) {
	let HM: Value = null;
	f.vars = () => [HM];
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	f.dot = (yield* g.callName(f, (HM = rt.op(f, "PickUnweighted", [1], [subtract(subtract(rt.gl("good_mutations"), rt.at(rt.gl("mutations_list"), "Hulk")), rt.at(rt.gl("mutations_list"), "Dwarfism"))])), "force_give", [live(f.src)]));
	return f.dot;
}, true);

// /mob/living/carbon/proc/randmuti  (code/datums/dna.dm:344)  may sleep
rt.def("/mob/living/carbon/proc/randmuti", function* randmuti(f: Frame) {
	let num: Value = null, newdna: Value = null;
	f.vars = () => [num, newdna];
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	num = (yield* g.call(f, P("/proc/rand"), null, [1, 7]));
	newdna = (yield* g.call(f, P("/proc/setblock"), null, [rt.fv(f, "uni_identity", rt.sv(f, "dna")), live(num), (yield* g.call(f, P("/proc/random_string"), null, [3, rt.gl("hex_characters")]))]));
	rt.setFv(f, "uni_identity", rt.sv(f, "dna"), live(newdna));
	yield* g.callSrc(f, "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/carbon/proc/clean_dna  (code/datums/dna.dm:352)  may sleep
rt.def("/mob/living/carbon/proc/clean_dna", function* clean_dna(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "has_dna")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "dna"), "remove_all_mutations", []);
	return f.dot;
}, true);

// /mob/living/carbon/proc/clean_randmut  (code/datums/dna.dm:357)  may sleep
rt.def("/mob/living/carbon/proc/clean_randmut", function* clean_randmut(f: Frame, candidates: Value, difficulty: Value) {
	f.vars = () => [candidates, difficulty];
	if (live(difficulty) === null) {
		difficulty = 2;
	}
	yield* g.srcCall(f, "clean_dna");
	yield* g.srcCall(f, "randmut", live(candidates), live(difficulty));
	return f.dot;
}, true);

// /proc/scramble_dna  (code/datums/dna.dm:361)  may sleep
rt.def("/proc/scramble_dna", function* scramble_dna(f: Frame, M: Value, ui: Value, se: Value, probability: Value) {
	let i: Value = null;
	f.vars = () => [M, ui, se, probability, i];
	if (live(ui) === null) {
		ui = 0;
	}
	if (live(se) === null) {
		se = 0;
	}
	if (!truthy((yield* g.callName(f, live(M), "has_dna", [])))) {
		return 0;
	}
	if (truthy(live(se))) {
		i = null;
		i = 1;
		while (rt.le(live(i), 19)) {
			if (truthy(rt.op(f, "Prob", [], [live(probability)]))) {
				rt.setFv(f, "struc_enzymes", rt.fv(f, "dna", live(M)), (yield* g.call(f, P("/proc/setblock"), null, [rt.gv(f, "struc_enzymes", rt.fv(f, "dna", live(M))), live(i), (yield* g.call(f, P("/proc/random_string"), null, [3, rt.gl("hex_characters")]))])));
			}
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, live(M), "domutcheck", []);
	}
	if (truthy(live(ui))) {
		i = null;
		i = 1;
		while (rt.le(live(i), 7)) {
			if (truthy(rt.op(f, "Prob", [], [live(probability)]))) {
				rt.setFv(f, "uni_identity", rt.fv(f, "dna", live(M)), (yield* g.call(f, P("/proc/setblock"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(M))), live(i), (yield* g.call(f, P("/proc/random_string"), null, [3, rt.gl("hex_characters")]))])));
			}
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, live(M), "updateappearance", ["mutations_overlay_update", 1], rt.Args.Named);
	}
	return 1;
}, true);

// /proc/construct_block  (code/datums/dna.dm:378)
rt.def("/proc/construct_block", function construct_block(f: Frame, value: Value, values: Value, blocksize: Value) {
	let width: Value = null;
	f.vars = () => [value, blocksize, width];
	if (live(blocksize) === null) {
		blocksize = 3;
	}
	width = rt.call(f, P("/proc/round"), null, [divide(rt.power(16, live(blocksize)), live(values))]);
	if (rt.lt(live(value), 1)) {
		value = 1;
	}
	return rt.call(f, P("/proc/num2hex"), null, [(value = subtract(multiply(live(value), live(width)), rt.call(f, P("/proc/rand"), null, [1, live(width)]))), live(blocksize)]);
});

// /proc/deconstruct_block  (code/datums/dna.dm:386)
rt.def("/proc/deconstruct_block", function deconstruct_block(f: Frame, value: Value, values: Value, blocksize: Value) {
	let width: Value = null;
	f.vars = () => [value, blocksize, width];
	if (live(blocksize) === null) {
		blocksize = 3;
	}
	width = rt.call(f, P("/proc/round"), null, [divide(rt.power(16, live(blocksize)), live(values))]);
	if (rt.gt((value = add(rt.call(f, P("/proc/round"), null, [divide(rt.call(f, P("/proc/hex2num"), null, [live(value)]), live(width))]), 1)), live(values))) {
		value = live(values);
	}
	return live(value);
});
