// Based on /tg/station's code/datums/dna.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// dna.dm:9
rt.def("/datum/dna/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.features = list("FFF");

	this.mutations = list();

	this.temporary_mutations = list();

	this.previous = list();

	this.species = new_(T("/datum/species/human"));
	return f.dot;
});

// dna.dm:18
rt.def("/datum/dna/proc/New", function New(f: Frame, new_holder: Value) {
	if (!new_holder) return f.dot;
	this.holder = new_holder;
	return f.dot;
});

// dna.dm:21
rt.def("/datum/dna/proc/transfer_identity", function* transfer_identity(f: Frame, destination: Value, transfer_SE: Value) {
	transfer_SE ??= 0;
	if (!rt.istype(destination, T("/mob/living/carbon"))) {
		return f.dot;
	}
	destination.dna.unique_enzymes = this.unique_enzymes;
	destination.dna.uni_identity = this.uni_identity;
	destination.dna.blood_type = this.blood_type;
	yield* destination.set_species(this.species.type, { icon_update: 0 });
	destination.dna.features = (yield* this.features.Copy());
	destination.dna.real_name = this.real_name;
	destination.dna.temporary_mutations = (yield* this.temporary_mutations.Copy());
	if (!transfer_SE) return f.dot;
	destination.dna.struc_enzymes = this.struc_enzymes;
	return f.dot;
}, true);

// dna.dm:38
rt.def("/datum/dna/proc/copy_dna", function* copy_dna(f: Frame, new_dna: Value) {
	new_dna.unique_enzymes = this.unique_enzymes;
	new_dna.struc_enzymes = this.struc_enzymes;
	new_dna.uni_identity = this.uni_identity;
	new_dna.blood_type = this.blood_type;
	new_dna.features = (yield* this.features.Copy());
	new_dna.species = (yield* new_(this.species.type));
	new_dna.real_name = this.real_name;
	new_dna.mutations = (yield* this.mutations.Copy());
	return f.dot;
}, true);

// dna.dm:44
rt.def("/datum/dna/proc/add_mutation", function* add_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = null;
	yield* (HM = rt.index(GLOB.mutations_list, mutation_name)).on_acquiring(this.holder);
	return f.dot;
}, true);

// dna.dm:48
rt.def("/datum/dna/proc/remove_mutation", function* remove_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = null;
	yield* (HM = rt.index(GLOB.mutations_list, mutation_name)).on_losing(this.holder);
	return f.dot;
}, true);

// dna.dm:52
rt.def("/datum/dna/proc/check_mutation", function check_mutation(f: Frame, mutation_name: Value) {
	let HM: Value = rt.index(GLOB.mutations_list, mutation_name);
	return this.mutations.Find(HM);
});

// dna.dm:56
rt.def("/datum/dna/proc/remove_all_mutations", function* remove_all_mutations(f: Frame) {
	yield* this.remove_mutation_group(this.mutations);
	return f.dot;
}, true);

// dna.dm:59
rt.def("/datum/dna/proc/remove_mutation_group", function* remove_mutation_group(f: Frame, group: Value) {
	let HM: Value = null;
	if (!group) {
		return f.dot;
	}
	for (HM of each(group, T("/datum/mutation/human"))) {
		yield* HM.force_lose(this.holder);
	}
	return f.dot;
}, true);

// dna.dm:65
rt.def("/datum/dna/proc/generate_uni_identity", function* generate_uni_identity(f: Frame) {
	let L: Value = null, H: Value = null;
	f.dot = "";
	rt.setAt((L = (yield* new_(T("/list"), DNA_UNI_IDENTITY_BLOCKS))), DNA_GENDER_BLOCK, construct_block((this.holder.gender != "male" ? 1 : 0) + DNA_HAIR_COLOR_BLOCK, DNA_FACIAL_HAIR_COLOR_BLOCK));
	if (rt.istype(this.holder, T("/mob/living/carbon/human"))) {
		H = this.holder;
		if (!rt.len(f, GLOB.hair_styles_list)) {
			yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/hair"), GLOB.hair_styles_list, GLOB.hair_styles_male_list, GLOB.hair_styles_female_list);
		}
		rt.setAt(L, DNA_HAIR_STYLE_BLOCK, construct_block(GLOB.hair_styles_list.Find(H.hair_style), rt.len(f, GLOB.hair_styles_list)));
		rt.setAt(L, DNA_HAIR_COLOR_BLOCK, sanitize_hexcolor(H.hair_color));
		if (!rt.len(f, GLOB.facial_hair_styles_list)) {
			yield* init_sprite_accessory_subtypes(T("/datum/sprite_accessory/facial_hair"), GLOB.facial_hair_styles_list, GLOB.facial_hair_styles_male_list, GLOB.facial_hair_styles_female_list);
		}
		rt.setAt(L, DNA_FACIAL_HAIR_STYLE_BLOCK, construct_block(GLOB.facial_hair_styles_list.Find(H.facial_hair_style), rt.len(f, GLOB.facial_hair_styles_list)));
		rt.setAt(L, DNA_FACIAL_HAIR_COLOR_BLOCK, sanitize_hexcolor(H.facial_hair_color));
		rt.setAt(L, DNA_SKIN_TONE_BLOCK, construct_block(GLOB.skin_tones.Find(H.skin_tone), rt.len(f, GLOB.skin_tones)));
		rt.setAt(L, DNA_EYE_COLOR_BLOCK, sanitize_hexcolor(H.eye_color));
	}
	let i: Value = 1;
	while (i <= DNA_UNI_IDENTITY_BLOCKS) {
		if (rt.index(L, i)) {
			f.dot += rt.index(L, i);
		} else {
			f.dot += random_string(DNA_BLOCK_SIZE, GLOB.hex_characters);
		}
		i++;
	}
	return f.dot;
}, true);

// dna.dm:90
rt.def("/datum/dna/proc/generate_struc_enzymes", function generate_struc_enzymes(f: Frame) {
	let A: Value = null, B: Value = null;
	let sorting: Value = new_(T("/list"), DNA_STRUC_ENZYMES_BLOCKS);
	let result: Value = "";
	for (A of each(GLOB.good_mutations + GLOB.bad_mutations + GLOB.not_good_mutations, T("/datum/mutation/human"))) {
		if (A.name == "Monkified" && rt.istype(this.holder, T("/mob/living/carbon/monkey"))) {
			rt.setAt(sorting, A.dna_block, num2hex(A.lowest_value + rand(0, 1536), DNA_BLOCK_SIZE));
			(rt.modSrcVar(f, "mutations", A, rt.bitOr));
		} else {
			rt.setAt(sorting, A.dna_block, random_string(DNA_BLOCK_SIZE, list("0", "1", "2", "3", "4", "5", "6")));
		}
	}
	for (B of each(sorting)) {
		result += B;
	}
	return result;
});

// dna.dm:104
rt.def("/datum/dna/proc/generate_unique_enzymes", function generate_unique_enzymes(f: Frame) {
	f.dot = "";
	if (rt.istype(this.holder, T("/mob/living"))) {
		this.real_name = this.holder.real_name;
		f.dot += md5(this.holder.real_name);
	} else {
		f.dot += random_string(DNA_UNIQUE_ENZYMES_LEN, GLOB.hex_characters);
	}
	return f.dot;
});

// dna.dm:113
rt.def("/datum/dna/proc/update_ui_block", function update_ui_block(f: Frame, blocknumber: Value) {
	if (!blocknumber || !rt.istype(this.holder, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	let H: Value = this.holder;
	if (blocknumber === DNA_HAIR_COLOR_BLOCK) {
		setblock(this.uni_identity, blocknumber, sanitize_hexcolor(H.hair_color));
	} else if (blocknumber === DNA_FACIAL_HAIR_COLOR_BLOCK) {
		setblock(this.uni_identity, blocknumber, sanitize_hexcolor(H.facial_hair_color));
	} else if (blocknumber === DNA_SKIN_TONE_BLOCK) {
		setblock(this.uni_identity, blocknumber, construct_block(GLOB.skin_tones.Find(H.skin_tone), rt.len(f, GLOB.skin_tones)));
	} else if (blocknumber === DNA_EYE_COLOR_BLOCK) {
		setblock(this.uni_identity, blocknumber, sanitize_hexcolor(H.eye_color));
	} else if (blocknumber === DNA_GENDER_BLOCK) {
		setblock(this.uni_identity, blocknumber, construct_block((H.gender != "male" ? DNA_HAIR_COLOR_BLOCK : 0) + 1, 2));
	} else if (blocknumber === DNA_FACIAL_HAIR_STYLE_BLOCK) {
		setblock(this.uni_identity, blocknumber, construct_block(GLOB.facial_hair_styles_list.Find(H.facial_hair_style), rt.len(f, GLOB.facial_hair_styles_list)));
	} else if (blocknumber === DNA_HAIR_STYLE_BLOCK) {
		setblock(this.uni_identity, blocknumber, construct_block(GLOB.hair_styles_list.Find(H.hair_style), rt.len(f, GLOB.hair_styles_list)));
	}
	return f.dot;
});

// dna.dm:134
rt.def("/datum/dna/proc/mutations_say_mods", function mutations_say_mods(f: Frame, message: Value) {
	let M: Value = null;
	if (!message) return f.dot;
	for (M of each(this.mutations, T("/datum/mutation/human"))) {
		message = M.say_mod(message);
	}
	return message;
});

// dna.dm:139
rt.def("/datum/dna/proc/mutations_get_spans", function mutations_get_spans(f: Frame) {
	let M: Value = null;
	let spans: Value = list();
	for (M of each(this.mutations, T("/datum/mutation/human"))) {
		(spans = rt.modify(spans, M.get_spans(), rt.bitOr));
	}
	return spans;
});

// dna.dm:145
rt.def("/datum/dna/proc/species_get_spans", function species_get_spans(f: Frame) {
	let spans: Value = list();
	if (this.species) {
		(spans = rt.modify(spans, this.species.get_spans(), rt.bitOr));
	}
	return spans;
});

// dna.dm:152
rt.def("/datum/dna/proc/is_same_as", function is_same_as(f: Frame, D: Value) {
	if (this.uni_identity == D.uni_identity && this.struc_enzymes == D.struc_enzymes && this.real_name == D.real_name) {
		if (this.species.type == D.species.type && this.features == D.features && this.blood_type == D.blood_type) {
			return 1;
		}
	}
	return 0;
});

// dna.dm:159
rt.def("/datum/dna/proc/update_dna_identity", function* update_dna_identity(f: Frame) {
	this.uni_identity = (yield* this.generate_uni_identity());
	this.unique_enzymes = this.generate_unique_enzymes();
	return f.dot;
}, true);

// dna.dm:164
rt.def("/datum/dna/proc/initialize_dna", function* initialize_dna(f: Frame, newblood_type: Value) {
	if (newblood_type) {
		this.blood_type = newblood_type;
	}
	this.unique_enzymes = this.generate_unique_enzymes();
	this.uni_identity = (yield* this.generate_uni_identity());
	this.struc_enzymes = this.generate_struc_enzymes();
	this.features = (yield* random_features());
	return f.dot;
}, true);

// dna.dm:195
rt.def("/mob/living/brain/proc/set_species", function* set_species(f: Frame, mrace: Value, icon_update: Value) {
	icon_update ??= 1;
	if (!mrace) return f.dot;
	if (ispath(mrace)) {
		this.stored_dna.species = (yield* new_(mrace));
	} else {
		this.stored_dna.species = mrace;
	}
	return f.dot;
}, true);

// dna.dm:202
rt.def("/mob/living/carbon/proc/set_species", function* set_species(f: Frame, mrace: Value, icon_update: Value) {
	icon_update ??= 1;
	if (!(mrace && this.has_dna())) return f.dot;
	yield* this.dna.species.on_species_loss(this);
	let old_species: Value = this.dna.species;
	if (ispath(mrace)) {
		this.dna.species = (yield* new_(mrace));
	} else {
		this.dna.species = mrace;
	}
	yield* this.dna.species.on_species_gain(this, old_species);
	return f.dot;
}, true);

// dna.dm:212
rt.def("/mob/living/carbon/human/proc/set_species", function* set_species(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	yield* parent_proc();
	if (!f.args[1]) return f.dot;
	yield* this.update_body();
	yield* this.update_hair();
	yield* this.update_body_parts();
	yield* this.update_mutations_overlay();
	return f.dot;
}, true, { args: ["mrace", "icon_update"] });

// dna.dm:233
rt.def("/mob/living/carbon/human/proc/hardset_dna", function* hardset_dna(f: Frame, ui: Value, se: Value, newreal_name: Value, newblood_type: Value, mrace: Value, newfeatures: Value) {
	if (newfeatures) {
		this.dna.features = newfeatures;
	}
	if (mrace) {
		yield* this.set_species(mrace, { icon_update: 0 });
	}
	if (newreal_name) {
		this.real_name = newreal_name;
		this.dna.generate_unique_enzymes();
	}
	if (newblood_type) {
		this.dna.blood_type = newblood_type;
	}
	if (ui) {
		this.dna.uni_identity = ui;
		yield* this.updateappearance({ icon_update: 0 });
	}
	if (se) {
		this.dna.struc_enzymes = se;
		yield* this.domutcheck();
	}
	if (!(mrace || newfeatures || ui)) return f.dot;
	yield* this.update_body();
	yield* this.update_hair();
	yield* this.update_body_parts();
	yield* this.update_mutations_overlay();
	return f.dot;
}, true);

// dna.dm:258
rt.def("/mob/living/carbon/proc/create_dna", function* create_dna(f: Frame) {
	this.dna = (yield* new_(T("/datum/dna"), this));
	if (this.dna.species) return f.dot;
	let rando_race: Value = pick(GLOB.config.roundstart_races);
	this.dna.species = (yield* new_(rando_race));
	return f.dot;
}, true);

// dna.dm:265
rt.def("/mob/living/carbon/proc/updateappearance", function updateappearance(f: Frame, icon_update: Value, mutcolor_update: Value, mutations_overlay_update: Value) {
	icon_update ??= 1;
	mutcolor_update ??= 0;
	mutations_overlay_update ??= 0;
	if (!this.has_dna()) {
		return f.dot;
	}
	this.gender = deconstruct_block(getblock(this.dna.uni_identity, DNA_GENDER_BLOCK), 2) - 1 ? "female" : "male";
	return f.dot;
});

// dna.dm:270
rt.def("/mob/living/carbon/human/proc/updateappearance", function* updateappearance(f: Frame) {
	let structure: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* parent_proc();
	this.hair_color = sanitize_hexcolor(getblock((structure = this.dna.uni_identity), DNA_HAIR_COLOR_BLOCK));
	this.facial_hair_color = sanitize_hexcolor(getblock(structure, DNA_FACIAL_HAIR_COLOR_BLOCK));
	this.skin_tone = rt.index(GLOB.skin_tones, deconstruct_block(getblock(structure, DNA_SKIN_TONE_BLOCK), rt.len(f, GLOB.skin_tones)));
	this.eye_color = sanitize_hexcolor(getblock(structure, DNA_EYE_COLOR_BLOCK));
	this.facial_hair_style = rt.index(GLOB.facial_hair_styles_list, deconstruct_block(getblock(structure, DNA_FACIAL_HAIR_STYLE_BLOCK), rt.len(f, GLOB.facial_hair_styles_list)));
	this.hair_style = rt.index(GLOB.hair_styles_list, deconstruct_block(getblock(structure, DNA_HAIR_STYLE_BLOCK), rt.len(f, GLOB.hair_styles_list)));
	if (!f.args[0]) return f.dot;
	yield* this.update_body();
	yield* this.update_hair();
	if (f.args[1]) {
		yield* this.update_body_parts();
	}
	if (!f.args[2]) return f.dot;
	yield* this.update_mutations_overlay();
	return f.dot;
}, true, { args: ["icon_update", "mutcolor_update", "mutations_overlay_update"] });

// dna.dm:291
rt.def("/mob/living/carbon/proc/domutcheck", function* domutcheck(f: Frame, force_powers: Value) {
	let A: Value = null;
	force_powers ??= 0;
	if (!this.has_dna()) {
		return f.dot;
	}
	for (A of each(rt.bitOr(rt.bitOr(GLOB.good_mutations, GLOB.bad_mutations), GLOB.not_good_mutations), T("/datum/mutation/human"))) {
		if (ismob((yield* A.check_block(this, force_powers)))) {
			return f.dot;
		}
	}
	yield* this.update_mutations_overlay();
	return f.dot;
}, true);

// dna.dm:304
rt.def("/proc/getleftblocks", function getleftblocks(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	if (!(blocknumber > 1)) return f.dot;
	return copytext(input, 1, blocksize * blocknumber - (blocksize - 1));
});

// dna.dm:308
rt.def("/proc/getrightblocks", function getrightblocks(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	if (!(blocknumber < rt.length(input) / blocksize)) return f.dot;
	return copytext(input, blocksize * blocknumber + 1, rt.length(input) + 1);
});

// dna.dm:312
rt.def("/proc/getblock", function getblock(f: Frame, input: Value, blocknumber: Value, blocksize: Value) {
	blocksize ??= DNA_BLOCK_SIZE;
	return copytext(input, blocksize * (blocknumber - 1) + 1, blocksize * blocknumber + 1);
});

// dna.dm:315
rt.def("/proc/setblock", function setblock(f: Frame, istring: Value, blocknumber: Value, replacement: Value, blocksize: Value) {
	blocksize ??= DNA_BLOCK_SIZE;
	if (!istring || !blocknumber || !replacement || !blocksize) {
		return 0;
	}
	return getleftblocks(istring, blocknumber, blocksize) + replacement + getrightblocks(istring, blocknumber, blocksize);
});

// dna.dm:320
rt.def("/mob/living/carbon/proc/randmut", function* randmut(f: Frame, candidates: Value, difficulty: Value) {
	let num: Value = null;
	difficulty ??= 2;
	if (!this.has_dna()) {
		return f.dot;
	}
	f.dot = (yield* (num = pick(candidates)).force_give(this));
	return f.dot;
}, true);

// dna.dm:326
rt.def("/mob/living/carbon/proc/randmutb", function* randmutb(f: Frame) {
	let HM: Value = null;
	if (!this.has_dna()) {
		return f.dot;
	}
	f.dot = (yield* (HM = pick(rt.bitOr(GLOB.bad_mutations, GLOB.not_good_mutations) - rt.at(GLOB.mutations_list, "Monkified"))).force_give(this));
	return f.dot;
}, true);

// dna.dm:332
rt.def("/mob/living/carbon/proc/randmutg", function* randmutg(f: Frame) {
	let HM: Value = null;
	if (!this.has_dna()) {
		return f.dot;
	}
	f.dot = (yield* (HM = pick(GLOB.good_mutations)).force_give(this));
	return f.dot;
}, true);

// dna.dm:338
rt.def("/mob/living/carbon/proc/randmutvg", function* randmutvg(f: Frame) {
	let HM: Value = null;
	if (!this.has_dna()) {
		return f.dot;
	}
	f.dot = (yield* (HM = pick(GLOB.good_mutations - rt.at(GLOB.mutations_list, "Hulk") - rt.at(GLOB.mutations_list, "Dwarfism"))).force_give(this));
	return f.dot;
}, true);

// dna.dm:344
rt.def("/mob/living/carbon/proc/randmuti", function* randmuti(f: Frame) {
	if (!this.has_dna()) {
		return f.dot;
	}
	let num: Value = rand(1, DNA_UNI_IDENTITY_BLOCKS);
	let newdna: Value = setblock(this.dna.uni_identity, num, random_string(DNA_BLOCK_SIZE, GLOB.hex_characters));
	this.dna.uni_identity = newdna;
	yield* this.updateappearance({ mutations_overlay_update: 1 });
	return f.dot;
}, true);

// dna.dm:361
rt.def("/proc/scramble_dna", function* scramble_dna(f: Frame, M: Value, ui: Value, se: Value, probability: Value) {
	let i: Value = null;
	ui ??= 0;
	se ??= 0;
	if (!M.has_dna()) {
		return 0;
	}
	if (se) {
		i = 1;
		while (i <= DNA_STRUC_ENZYMES_BLOCKS) {
			if (prob(probability)) {
				M.dna.struc_enzymes = setblock(M.dna.struc_enzymes, i, random_string(DNA_BLOCK_SIZE, GLOB.hex_characters));
			}
			i++;
		}
		yield* M.domutcheck();
	}
	if (ui) {
		i = 1;
		while (i <= DNA_UNI_IDENTITY_BLOCKS) {
			if (prob(probability)) {
				M.dna.uni_identity = setblock(M.dna.uni_identity, i, random_string(DNA_BLOCK_SIZE, GLOB.hex_characters));
			}
			i++;
		}
		yield* M.updateappearance({ mutations_overlay_update: 1 });
	}
	return 1;
}, true);

// dna.dm:378
rt.def("/proc/construct_block", function construct_block(f: Frame, value: Value, values: Value, blocksize: Value) {
	blocksize ??= DNA_BLOCK_SIZE;
	let width: Value = round(16 ** blocksize / values);
	if (value < 1) {
		value = 1;
	}
	return num2hex((value = value * width - rand(1, width)), blocksize);
});

// dna.dm:386
rt.def("/proc/deconstruct_block", function deconstruct_block(f: Frame, value: Value, values: Value, blocksize: Value) {
	blocksize ??= DNA_BLOCK_SIZE;
	let width: Value = round(16 ** blocksize / values);
	if ((value = round(hex2num(value) / width) + 1) > values) {
		value = values;
	}
	return value;
});
