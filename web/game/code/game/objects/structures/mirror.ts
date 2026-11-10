// Based on /tg/station's code/game/objects/structures/mirror.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12806, "/obj/structure/mirror", "/obj/structure", {
	anchored: 1,
	name: "mirror",
	desc: "Mirror mirror on the wall, who's the most robust of them all?",
	icon: rt.rsc("icons/obj/watercloset.dmi"),
	icon_state: "mirror",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 100,
});

// mirror.dm:15
rt.def("/obj/structure/mirror/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let new_style: Value = null;
	if (this.broken || !this.Adjacent(user)) {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	let H: Value = user;
	let userloc: Value = H.loc;
	if (H.gender == "male") {
		new_style = (yield* g.op(f, "Prompt", [1], [null, "Grooming", "Select a facial hair style", user, GLOB.facial_hair_styles_list]));
		if (userloc != H.loc) {
			return f.dot;
		}
		if (new_style) {
			H.facial_hair_style = new_style;
		}
	} else {
		H.facial_hair_style = "Shaved";
	}
	new_style = (yield* g.op(f, "Prompt", [1], [null, "Grooming", "Select a hair style", user, GLOB.hair_styles_list]));
	if (userloc != H.loc) {
		return f.dot;
	}
	if (new_style) {
		H.hair_style = new_style;
	}
	yield* H.update_hair();
	return f.dot;
}, true);

// mirror.dm:48
rt.def("/obj/structure/mirror/proc/examine_status", function examine_status(f: Frame, user: Value) {
	if (this.broken) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false);

// mirror.dm:51
rt.def("/obj/structure/mirror/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	this.icon_state = "mirror_broke";
	playsound(this, "shatter", 70, 1);
	this.desc = "Oh no, seven years of bad luck!";
	this.broken = 1;
	return f.dot;
});

// mirror.dm:58
rt.def("/obj/structure/mirror/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!disassembled) {
			yield* new_(T("/obj/item/weapon/shard"), this.loc);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// mirror.dm:64
rt.def("/obj/structure/mirror/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		WT = I;
		if (this.broken) {
			user.changeNext_move(8);
			if (yield* WT.remove_fuel(0, user)) {
				to_chat(user, `<span class='notice'>You begin repairing ${this}...</span>`);
				playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
				if (yield* do_after(user, 10 * I.toolspeed, { target: this })) {
					if (!user || !WT || !WT.isOn()) {
						return f.dot;
					}
					to_chat(user, `<span class='notice'>You repair ${this}.</span>`);
					this.broken = 0;
					this.icon_state = rt.initial(f, this, "icon_state");
					this.desc = rt.initial(f, this, "desc");
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// mirror.dm:82
rt.def("/obj/structure/mirror/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 70, 1);
	}
	return f.dot;
});

rt.type(12807, "/obj/structure/mirror/magic", "/obj/structure/mirror", {
	races_blacklist: null,
	choosable_races: null,
	name: "magic mirror",
	desc: "Turn and face the strange... face.",
	icon_state: "magic_mirror",
});

// mirror.dm:94
rt.def("/obj/structure/mirror/magic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.races_blacklist = list("skeleton", "agent", "angel", "military_synth", "memezombie");

	this.choosable_races = list();
	return f.dot;
});

// mirror.dm:97
rt.def("/obj/structure/mirror/magic/proc/New", function* New(f: Frame) {
	let speciestype: Value = null, S: Value = null;
	if (!rt.len(f, this.choosable_races)) {
		for (speciestype of each(typesof(T("/datum/species")) - T("/datum/species"))) {
			if (!rt.isIn(f, (S = (yield* new_(speciestype))).id, this.races_blacklist)) {
				this.choosable_races += S.id;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12808, "/obj/structure/mirror/magic/lesser", "/obj/structure/mirror/magic", {});

// mirror.dm:105
rt.def("/obj/structure/mirror/magic/lesser/proc/New", function* New(f: Frame) {
	this.choosable_races = GLOB.roundstart_species;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(12809, "/obj/structure/mirror/magic/badmin", "/obj/structure/mirror/magic", {});

// mirror.dm:109
rt.def("/obj/structure/mirror/magic/badmin/proc/New", function* New(f: Frame) {
	let speciestype: Value = null, S: Value = null;
	for (speciestype of each(typesof(T("/datum/species")) - T("/datum/species"))) {
		this.choosable_races += (S = (yield* new_(speciestype))).id;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mirror.dm:115
rt.def("/obj/structure/mirror/magic/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let newname: Value = null, newrace: Value = null, racechoice: Value = null, new_s_tone: Value = null, new_mutantcolor: Value = null, temp_hsv: Value = null, hairchoice: Value = null, new_hair_color: Value = null, new_face_color: Value = null, new_eye_color: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	let H: Value = user;
	let choice: Value = (yield* g.op(f, "Prompt", [1], [null, "Magical Grooming", "Something to change?", user, list("name", "race", "gender", "hair", "eyes")]));
	if (!this.Adjacent(user)) {
		return f.dot;
	}
	if (choice === "name") {
		if (!(newname = copytext(sanitize((yield* g.op(f, "Prompt", [3], [H.name, "Name change", "Who are we again?", H, null]))), 1, 42))) {
			return f.dot;
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		H.real_name = newname;
		H.name = newname;
		if (H.dna) {
			H.dna.real_name = newname;
		}
		if (H.mind) {
			H.mind.name = newname;
		}
	} else if (choice === "race") {
		racechoice = (yield* g.op(f, "Prompt", [1], [null, "Race change", "What are we again?", H, this.choosable_races]));
		if (!(newrace = rt.index(GLOB.species_list, racechoice))) {
			return f.dot;
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		yield* H.set_species(newrace, { icon_update: 0 });
		if (H.dna.species.use_skintones) {
			if (new_s_tone = (yield* g.op(f, "Prompt", [1], [null, "Race change", "Choose your skin tone:", user, GLOB.skin_tones]))) {
				H.skin_tone = new_s_tone;
				H.dna.update_ui_block(DNA_SKIN_TONE_BLOCK);
			}
		}
		if (rt.isIn(f, MUTCOLORS, H.dna.species.species_traits)) {
			if (new_mutantcolor = (yield* g.op(f, "Prompt", [257], [null, "Race change", "Choose your skin color:", user, null]))) {
				if (rt.index(ReadHSV((temp_hsv = RGBtoHSV(new_mutantcolor))), 3) >= rt.index(ReadHSV("#7F7F7F"), 3)) {
					rt.setAt(H.dna.features, "mcolor", sanitize_hexcolor(new_mutantcolor));
				} else {
					to_chat(H, "<span class='notice'>Invalid color. Your color is not bright enough.</span>");
				}
			}
		}
		yield* H.update_body();
		yield* H.update_hair();
		yield* H.update_body_parts();
		yield* H.update_mutations_overlay();
	} else if (choice === "gender") {
		if (!rt.isIn(f, H.gender, list("male", "female"))) {
			return f.dot;
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (H.gender == "male") {
			if ((yield* alert(H, "Become a Witch?", "Confirmation", "Yes", "No")) == "Yes") {
				H.gender = "female";
				to_chat(H, "<span class='notice'>Man, you feel like a woman!</span>");
			} else {
				return f.dot;
			}
		} else if ((yield* alert(H, "Become a Warlock?", "Confirmation", "Yes", "No")) == "Yes") {
			H.gender = "male";
			to_chat(H, "<span class='notice'>Whoa man, you feel like a man!</span>");
		} else {
			return f.dot;
		}
		H.dna.update_ui_block(DNA_GENDER_BLOCK);
		yield* H.update_body();
		yield* H.update_mutations_overlay();
	} else if (choice === "hair") {
		hairchoice = (yield* alert(H, "Hair style or hair color?", "Change Hair", "Style", "Color"));
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (hairchoice == "Style") {
			yield* parent_proc();
		} else {
			if (new_hair_color = (yield* g.op(f, "Prompt", [257], [null, "Hair Color", "Choose your hair color", H, null]))) {
				H.hair_color = sanitize_hexcolor(new_hair_color);
				H.dna.update_ui_block(DNA_HAIR_COLOR_BLOCK);
			}
			if (H.gender == "male") {
				if (new_face_color = (yield* g.op(f, "Prompt", [257], [null, "Hair Color", "Choose your facial hair color", H, null]))) {
					H.facial_hair_color = sanitize_hexcolor(new_face_color);
					H.dna.update_ui_block(DNA_FACIAL_HAIR_COLOR_BLOCK);
				}
			}
			yield* H.update_hair();
		}
	} else if (choice === "eyes") {
		new_eye_color = (yield* g.op(f, "Prompt", [257], [null, "Eye Color", "Choose your eye color", H, null]));
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		if (new_eye_color) {
			H.eye_color = sanitize_hexcolor(new_eye_color);
			H.dna.update_ui_block(DNA_EYE_COLOR_BLOCK);
			yield* H.update_body();
		}
	}
	if (!choice) return f.dot;
	yield* this.curse(user);
	return f.dot;
}, true);
