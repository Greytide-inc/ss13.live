// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/guardian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// guardian.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalparasites", function InitGlobalparasites(f: Frame) {
	GLOB.parasites = list();
	this.gvars_datum_init_order += "parasites";
	return f.dot;
});

rt.type(4872, "/mob/living/simple_animal/hostile/guardian", "/mob/living/simple_animal/hostile", {
	guardian_overlays: null,
	reset: 0,
	cooldown: 0,
	summoner: null,
	range: 10,
	namedatum: null,
	playstyle_string: "<span class='holoparasite'>You are a standard Guardian. You shouldn't exist!</span>",
	magic_fluff_string: "<span class='holoparasite'>You draw the Coder, symbolizing bugs and errors. This shouldn't happen! Submit a bug report!</span>",
	tech_fluff_string: "<span class='holoparasite'>BOOT SEQUENCE COMPLETE. ERROR MODULE LOADED. THIS SHOULDN'T HAPPEN. Submit a bug report!</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP SOME SORT OF HORRIFIC BUG BLAME THE CODERS CARP CARP CARP</span>",
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode/Inactive"),
	name: "Guardian Spirit",
	real_name: "Guardian Spirit",
	desc: "A mysterious being that stands by its charge, ever vigilant.",
	speak_emote: null,
	gender: "neuter",
	bubble_icon: "guardian",
	response_help: "passes through",
	response_disarm: "flails at",
	response_harm: "punches",
	icon: rt.rsc("icons/mob/guardian.dmi"),
	icon_state: "magicOrange",
	icon_living: "magicOrange",
	icon_dead: "magicOrange",
	speed: 0,
	a_intent: "harm",
	stop_automated_movement: 1,
	movement_type: 2,
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	attacktext: "punches",
	maxHealth: 1e+31,
	health: 1e+31,
	healable: 0,
	damage_coeff: null,
	environment_smash: 1,
	obj_damage: 40,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	butcher_results: null,
	AIStatus: 3,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous/guardian"),
});

// guardian.dm:41
rt.def("/mob/living/simple_animal/hostile/guardian/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.guardian_overlays = rt.op(f, "CreateMultidimensionalList", [1], [1]);

	this.namedatum = new_(T("/datum/guardianname"));

	this.speak_emote = list("hisses");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.damage_coeff = rt.alist(f, ["brute", 0.5, "fire", 0.5, "tox", 0.5, "clone", 0.5, "stamina", 0, "oxy", 0.5]);

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1]);
	return f.dot;
});

// guardian.dm:54
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Initialize", function* Initialize(f: Frame, mapload: Value, theme: Value) {
	GLOB.parasites += this;
	yield* this.setthemename(theme);
	yield* parent_proc();
	return f.dot;
}, true);

// guardian.dm:62
rt.def("/mob/living/simple_animal/hostile/guardian/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = null;
	if (!this.summoner) return f.dot;
	(holder = rt.at(this.hud_list, "1")).icon_state = `hud${RoundHealth(this.summoner)}`;
	return f.dot;
});

// guardian.dm:67
rt.def("/mob/living/simple_animal/hostile/guardian/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	if (!this.summoner) return f.dot;
	let holder: Value = rt.at(this.hud_list, "2");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.summoner.stat == 2) {
		holder.icon_state = "huddead";
	} else {
		holder.icon_state = "hudhealthy";
	}
	return f.dot;
});

// guardian.dm:75
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.parasites -= this;
	return (yield* parent_proc());
}, true);

// guardian.dm:79
rt.def("/mob/living/simple_animal/hostile/guardian/proc/setthemename", function* setthemename(f: Frame, pickedtheme: Value) {
	let type: Value = null;
	let $e: any;
	if (!pickedtheme) {
		pickedtheme = pick("magic", "tech", "carp");
	}
	let possible_names: Value = list();
	if (pickedtheme === "magic") {
		for (type of each(typesof(T("/datum/guardianname/magic")) - T("/datum/guardianname/magic") - this.namedatum.type)) {
			possible_names += (yield* new_(type));
		}
	} else if (pickedtheme === "tech") {
		type = null;
		for (type of each(typesof(T("/datum/guardianname/tech")) - T("/datum/guardianname/tech") - this.namedatum.type)) {
			possible_names += (yield* new_(type));
		}
	} else if (pickedtheme === "carp") {
		type = null;
		for (type of each(typesof(T("/datum/guardianname/carp")) - T("/datum/guardianname/carp") - this.namedatum.type)) {
			possible_names += (yield* new_(type));
		}
	}
	this.namedatum = pick(possible_names);
	this.updatetheme(pickedtheme);
	return f.dot;
}, true);

// guardian.dm:96
rt.def("/mob/living/simple_animal/hostile/guardian/proc/updatetheme", function updatetheme(f: Frame, theme: Value) {
	this.name = `${this.namedatum.prefixname} ${this.namedatum.suffixcolour}`;
	this.real_name = `${this.name}`;
	this.icon_living = `${this.namedatum.parasiteicon}`;
	this.icon_state = `${this.namedatum.parasiteicon}`;
	this.icon_dead = `${this.namedatum.parasiteicon}`;
	this.bubble_icon = `${this.namedatum.bubbleicon}`;
	if (this.namedatum.stainself) {
		this.add_atom_colour(this.namedatum.colour, FIXED_COLOUR_PRIORITY);
	}
	if (theme != "carp") return f.dot;
	this.speak_emote = list("gnashes");
	this.desc = "A mysterious fish that stands by its charge, ever vigilant.";
	this.attacktext = "bites";
	this.attack_sound = rt.rsc("sound/weapons/bite.ogg");
	return f.dot;
});

// guardian.dm:116
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	if (this.mind) {
		this.mind.name = `${this.real_name}`;
	}
	if (!this.summoner) {
		to_chat(this, "<span class='holoparasitebold'>For some reason, somehow, you have no summoner. Please report this bug immediately.</span>");
		return f.dot;
	}
	to_chat(this, `<span class='holoparasite'>You are <font color="${this.namedatum.colour}"><b>${this.real_name}</b></font>, bound to serve ${this.summoner.real_name}.</span>`);
	to_chat(this, "<span class='holoparasite'>You are capable of manifesting or recalling to your master with the buttons on your HUD. You will also find a button to communicate with them privately there.</span>");
	to_chat(this, `<span class='holoparasite'>While personally invincible, you will die if ${this.summoner.real_name} does, and any damage dealt to you will have a portion passed on to them as you feed upon them to sustain yourself.</span>`);
	to_chat(this, this.playstyle_string);
	return f.dot;
}, true);

// guardian.dm:128
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Life", function* Life(f: Frame) {
	let W: Value = null;
	f.dot = (yield* parent_proc());
	this.update_health_hud();
	yield* this.med_hud_set_health();
	this.med_hud_set_status();
	if (this.summoner) {
		if (this.summoner.stat == 2) {
			yield* this.forceMove(this.summoner.loc);
			to_chat(this, "<span class='danger'>Your summoner has died!</span>");
			this.visible_message(fmt("<span class='danger'><B>＄！ dies along with its user!</B></span>", [this]));
			this.summoner.visible_message(`<span class='danger'><B>${this.summoner}'s body is completely consumed by the strain of sustaining ${this}!</B></span>`);
			for (W of each(this.summoner, T("/obj/item"))) {
				if (!(yield* this.summoner.dropItemToGround(W))) {
					yield* qdel(W);
				}
			}
			yield* this.summoner.dust();
			yield* this.death(1);
			yield* qdel(this);
		}
	} else {
		to_chat(this, "<span class='danger'>Your summoner has died!</span>");
		this.visible_message(`<span class='danger'><B>The ${this} dies along with its user!</B></span>`);
		yield* this.death(1);
		yield* qdel(this);
	}
	yield* this.snapback();
	return f.dot;
}, true, { waitfor: false });

// guardian.dm:152
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Stat", function* Stat(f: Frame) {
	let resulthealth: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (this.summoner) {
		if (rt.istype(this.summoner, T("/mob/living/carbon"))) {
			resulthealth = round(rt.op(f, "Abs", [], [-100 - this.summoner.health]) / rt.op(f, "Abs", [], [-100 - this.summoner.maxHealth]) * 100);
		} else {
			resulthealth = round(this.summoner.health / this.summoner.maxHealth * 100, 0.5);
		}
		stat(null, `Summoner Health: ${resulthealth}%`);
	}
	if (!(this.cooldown >= rt.worldTime(f))) return f.dot;
	stat(null, `Manifest/Recall Cooldown Remaining: ${max(round((this.cooldown - rt.worldTime(f)) * 0.1, 0.1), 0)} seconds`);
	return f.dot;
}, true);

// guardian.dm:165
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.snapback();
	return f.dot;
}, true);

// guardian.dm:170
rt.def("/mob/living/simple_animal/hostile/guardian/proc/snapback", function* snapback(f: Frame) {
	if (!this.summoner) return f.dot;
	if (get_dist(rt.getStep(f, this.summoner, 0), rt.getStep(f, this, 0)) <= this.range) {
		return f.dot;
	} else {
		to_chat(this, `<span class='holoparasite'>You moved out of range, and were pulled back! You can only move ${this.range} meters from ${this.summoner.real_name}!</span>`);
		this.visible_message(fmt("<span class='danger'>＄！ jumps back to its user.</span>", [this]));
		if (rt.istype(this.summoner.loc, T("/obj/effect"))) {
			yield* this.Recall(1);
		} else {
			yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), this.loc);
			yield* this.forceMove(this.summoner.loc);
			yield* new_(T("/obj/effect/temp_visual/guardian/phase"), this.loc);
		}
	}
	return f.dot;
}, true);

// guardian.dm:186
rt.def("/mob/living/simple_animal/hostile/guardian/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.loc == this.summoner) {
		to_chat(this, "<span class='danger'><B>You must be manifested to attack!</span></B>");
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// guardian.dm:193
rt.def("/mob/living/simple_animal/hostile/guardian/proc/death", function* death(f: Frame) {
	yield* this.drop_all_held_items();
	yield* parent_proc();
	if (!this.summoner) return f.dot;
	to_chat(this.summoner, `<span class='danger'><B>Your ${this.name} died somehow!</span></B>`);
	yield* this.summoner.death();
	return f.dot;
}, true);

// guardian.dm:200
rt.def("/mob/living/simple_animal/hostile/guardian/proc/update_health_hud", function update_health_hud(f: Frame) {
	let resulthealth: Value = null;
	if (!(this.summoner && this.hud_used && this.hud_used.healths)) return f.dot;
	if (rt.istype(this.summoner, T("/mob/living/carbon"))) {
		resulthealth = round(rt.op(f, "Abs", [], [-100 - this.summoner.health]) / rt.op(f, "Abs", [], [-100 - this.summoner.maxHealth]) * 100);
	} else {
		resulthealth = round(this.summoner.health / this.summoner.maxHealth * 100, 0.5);
	}
	this.hud_used.healths.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#efeeef'>${resulthealth}%</font></div>`;
	return f.dot;
});

// guardian.dm:209
rt.def("/mob/living/simple_animal/hostile/guardian/proc/adjustHealth", function* adjustHealth(f: Frame, amount: Value, updating_health: Value, forced: Value) {
	updating_health ??= 1;
	forced ??= 0;
	f.dot = amount;
	if (!this.summoner) return f.dot;
	if (this.loc == this.summoner) {
		return 0;
	}
	yield* this.summoner.adjustBruteLoss(amount);
	if (amount > 0) {
		to_chat(this.summoner, `<span class='danger'><B>Your ${this.name} is under attack! You take damage!</span></B>`);
		this.summoner.visible_message(`<span class='danger'><B>Blood sprays from ${this.summoner} as ${this} takes damage!</B></span>`);
		if (this.summoner.stat == 1) {
			to_chat(this.summoner, `<span class='danger'><B>Your body can't take the strain of sustaining ${this} in this condition, it begins to fall apart!</span></B>`);
			yield* this.summoner.adjustCloneLoss(amount * 0.5);
		}
	}
	this.update_health_hud();
	return f.dot;
}, true);

// guardian.dm:223
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* this.gib();
		return f.dot;
	} else if (severity === 2) {
		yield* this.adjustBruteLoss(60);
	} else if (severity === 3) {
		yield* this.adjustBruteLoss(30);
	}
	return f.dot;
}, true, { waitfor: false });

// guardian.dm:234
rt.def("/mob/living/simple_animal/hostile/guardian/proc/gib", function* gib(f: Frame) {
	if (this.summoner) {
		to_chat(this.summoner, `<span class='danger'><B>Your ${this} was blown up!</span></B>`);
		yield* this.summoner.gib();
	}
	yield* this.ghostize();
	yield* qdel(this);
	return f.dot;
}, true);

// guardian.dm:242
rt.def("/mob/living/simple_animal/hostile/guardian/proc/equip_to_slot", function* equip_to_slot(f: Frame, I: Value, slot: Value) {
	let index: Value = null;
	if (!slot) {
		return 0;
	}
	if (!rt.istype(I, T("/obj/item"))) {
		return 0;
	}
	f.dot = 1;
	if (index = this.get_held_index_of_item(I)) {
		rt.setAt(this.held_items, index, null);
		yield* this.update_inv_hands();
	}
	if (I.pulledby) {
		yield* I.pulledby.stop_pulling();
	}
	I.screen_loc = null;
	I.loc = this;
	yield* I.equipped(this, slot);
	I.layer = ABOVE_HUD_LAYER;
	I.plane = ABOVE_HUD_PLANE;
	return f.dot;
}, true);

// guardian.dm:263
rt.def("/mob/living/simple_animal/hostile/guardian/proc/apply_overlay", function apply_overlay(f: Frame, cache_index: Value) {
	if (!(f.dot = rt.index(this.guardian_overlays, cache_index))) return f.dot;
	this.add_overlay(f.dot);
	return f.dot;
});

// guardian.dm:267
rt.def("/mob/living/simple_animal/hostile/guardian/proc/remove_overlay", function remove_overlay(f: Frame, cache_index: Value) {
	let I: Value = null;
	if (!(I = rt.index(this.guardian_overlays, cache_index))) return f.dot;
	this.cut_overlay(I);
	rt.setAt(this.guardian_overlays, cache_index, null);
	return f.dot;
});

// guardian.dm:273
rt.def("/mob/living/simple_animal/hostile/guardian/proc/update_inv_hands", function update_inv_hands(f: Frame) {
	let r_hand: Value = null, r_state: Value = null, l_state: Value = null;
	this.remove_overlay(GUARDIAN_HANDS_LAYER);
	let hands_overlays: Value = list();
	let l_hand: Value = this.get_item_for_held_index(1);
	if (r_hand = this.get_item_for_held_index(2)) {
		if (!(r_state = r_hand.item_state)) {
			r_state = r_hand.icon_state;
		}
		hands_overlays += r_hand.build_worn_icon({ state: r_state, default_layer: GUARDIAN_HANDS_LAYER, default_icon_file: r_hand.righthand_file, isinhands: GUARDIAN_HANDS_LAYER });
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			r_hand.layer = ABOVE_HUD_LAYER;
			r_hand.plane = ABOVE_HUD_PLANE;
			r_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(r_hand));
			(rt.modField(f, this.client, "screen", r_hand, rt.bitOr));
		}
	}
	if (l_hand) {
		if (!(l_state = l_hand.item_state)) {
			l_state = l_hand.icon_state;
		}
		hands_overlays += l_hand.build_worn_icon({ state: l_state, default_layer: GUARDIAN_HANDS_LAYER, default_icon_file: l_hand.lefthand_file, isinhands: GUARDIAN_HANDS_LAYER });
		if (this.client && this.hud_used && this.hud_used.hud_version != HUD_STYLE_NOHUD) {
			l_hand.layer = ABOVE_HUD_LAYER;
			l_hand.plane = ABOVE_HUD_PLANE;
			l_hand.screen_loc = ui_hand_position(this.get_held_index_of_item(l_hand));
			(rt.modField(f, this.client, "screen", l_hand, rt.bitOr));
		}
	}
	if (rt.len(f, hands_overlays)) {
		rt.setAt(this.guardian_overlays, GUARDIAN_HANDS_LAYER, hands_overlays);
	}
	this.apply_overlay(GUARDIAN_HANDS_LAYER);
	return f.dot;
});

// guardian.dm:309
rt.def("/mob/living/simple_animal/hostile/guardian/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	this.update_inv_hands();
	return f.dot;
});

// guardian.dm:314
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Manifest", function* Manifest(f: Frame, forced: Value) {
	if (rt.istype(this.summoner.loc, T("/obj/effect")) || this.cooldown > rt.worldTime(f) && !forced) {
		return 0;
	}
	if (this.loc == this.summoner) {
		yield* this.forceMove(this.summoner.loc);
		yield* new_(T("/obj/effect/temp_visual/guardian/phase"), this.loc);
		this.cooldown = rt.worldTime(f) + 10;
		return 1;
	}
	return 0;
}, true);

// guardian.dm:324
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Recall", function* Recall(f: Frame, forced: Value) {
	if (!this.summoner || this.loc == this.summoner || this.cooldown > rt.worldTime(f) && !forced) {
		return 0;
	}
	yield* new_(T("/obj/effect/temp_visual/guardian/phase/out"), this.loc);
	yield* this.forceMove(this.summoner);
	this.cooldown = rt.worldTime(f) + 10;
	return 1;
}, true);

// guardian.dm:333
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ToggleMode", function ToggleMode(f: Frame) {
	to_chat(this, "<span class='danger'><B>You don't have another mode!</span></B>");
	return f.dot;
});

// guardian.dm:336
rt.def("/mob/living/simple_animal/hostile/guardian/proc/ToggleLight", function ToggleLight(f: Frame) {
	if (this.light_range < 3) {
		to_chat(this, "<span class='notice'>You activate your light.</span>");
		this.set_light(3);
	} else {
		to_chat(this, "<span class='notice'>You deactivate your light.</span>");
		this.set_light(0);
	}
	return f.dot;
});

// guardian.dm:347
rt.def("/mob/living/simple_animal/hostile/guardian/verb/ShowType", function ShowType(f: Frame) {
	to_chat(this, this.playstyle_string);
	return f.dot;
}, false, { verb: { name: "Check Guardian Type", category: "Guardian", desc: "Check what type you are." } });

// guardian.dm:353
rt.def("/mob/living/simple_animal/hostile/guardian/proc/Communicate", function* Communicate(f: Frame) {
	let input: Value = null, para: Value = null, M: Value = null, link: Value = null;
	if (!this.summoner) return f.dot;
	if (!(input = (yield* stripped_input(this, "Please enter a message to tell your summoner.", "Guardian", "")))) {
		return f.dot;
	}
	let preliminary_message: Value = `<span class='holoparasitebold'>${input}</span>`;
	let my_message: Value = `<font color="${this.namedatum.colour}"><b><i>${this}:</i></b></font> ${preliminary_message}`;
	to_chat(this.summoner, my_message);
	let guardians: Value = this.summoner.hasparasites();
	for (para of each(guardians)) {
		to_chat(para, my_message);
	}
	for (M of each(GLOB.dead_mob_list)) {
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
		to_chat(M, `${link} ${my_message}`);
	}
	log_say(`${this.real_name}/${this.key} : ${input}`);
	return f.dot;
}, true);

// guardian.dm:374
rt.def("/mob/living/proc/guardian_comm", function* guardian_comm(f: Frame) {
	let input: Value = null, para: Value = null, G: Value = null, M: Value = null, link: Value = null;
	if (!(input = (yield* stripped_input(this, "Please enter a message to tell your guardian.", "Message", "")))) {
		return f.dot;
	}
	let preliminary_message: Value = `<span class='holoparasitebold'>${input}</span>`;
	let my_message: Value = `<span class='holoparasitebold'><i>${this}:</i> ${preliminary_message}</span>`;
	to_chat(this, my_message);
	let guardians: Value = this.hasparasites();
	for (para of each(guardians)) {
		to_chat((G = para), `<font color="${G.namedatum.colour}"><b><i>${this}:</i></b></font> ${preliminary_message}`);
	}
	for (M of each(GLOB.dead_mob_list)) {
		link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
		to_chat(M, `${link} ${my_message}`);
	}
	log_say(`${this.real_name}/${this.key} : ${this.text}`);
	return f.dot;
}, true, { verb: { name: "Communicate", category: "Guardian", desc: "Communicate telepathically with your guardian." } });

// guardian.dm:398
rt.def("/mob/living/proc/guardian_recall", function* guardian_recall(f: Frame) {
	let para: Value = null, G: Value = null;
	let guardians: Value = this.hasparasites();
	for (para of each(guardians)) {
		yield* (G = para).Recall();
	}
	return f.dot;
}, true, { verb: { name: "Recall Guardian", category: "Guardian", desc: "Forcibly recall your guardian." } });

// guardian.dm:408
rt.def("/mob/living/proc/guardian_reset", function* guardian_reset(f: Frame) {
	let para: Value = null, _P: Value = null, G: Value = null, candidates: Value = null, new_stand: Value = null;
	let $0: any, $1: any, $e: any;
	let guardians: Value = this.hasparasites();
	for (para of each(guardians)) {
		if ((_P = para).reset) {
			guardians -= _P;
		}
	}
	if (rt.len(f, guardians)) {
		if (G = (yield* g.op(f, "Prompt", [1], [null, "Guardian Reset", "Pick the guardian you wish to reset", this, guardians]))) {
			to_chat(this, `<span class='holoparasite'>You attempt to reset <font color="${G.namedatum.colour}"><b>${G.real_name}</b></font>'s personality...</span>`);
			candidates = (yield* pollGhostCandidates(`Do you want to play as ${this.real_name}'s ${G.real_name}?`, "pAI", null, 0, 100));
			if (rt.len(f, candidates)) {
				new_stand = pick(candidates);
				to_chat(G, "<span class='holoparasite'>Your user reset you, and your body was taken over by a ghost. Looks like they weren't happy with your performance.</span>");
				to_chat(this, `<span class='holoparasitebold'>Your <font color="${G.namedatum.colour}">${G.real_name}</font> has been successfully reset.</span>`);
				message_admins(`${key_name_admin(new_stand)} has taken control of (${key_name_admin(G)})`);
				yield* G.ghostize(0);
				yield* G.setthemename(G.namedatum.theme);
				G.key = new_stand.key;
				G.reset = 1;
				if (G.namedatum.theme === "tech") {
					to_chat(this, `<span class='holoparasite'><font color="${G.namedatum.colour}"><b>${G.real_name}</b></font> is now online!</span>`);
				} else if (G.namedatum.theme === "magic") {
					to_chat(this, `<span class='holoparasite'><font color="${G.namedatum.colour}"><b>${G.real_name}</b></font> has been summoned!</span>`);
				}
				guardians -= G;
				if (!rt.len(f, guardians)) {
					this.verbs -= P("/mob/living/proc/guardian_reset");
				}
			} else {
				to_chat(this, `<span class='holoparasite'>There were no ghosts willing to take control of <font color="${G.namedatum.colour}"><b>${G.real_name}</b></font>. Looks like you're stuck with it for now.</span>`);
			}
		} else {
			$0 = this;
			if (rt.len(f, guardians) > 1) {
				$1 = "any of your guardians";
			} else {
				$1 = "your guardian";
			}
			to_chat($0, `<span class='holoparasite'>You decide not to reset ${$1}.</span>`);
		}
	} else {
		this.verbs -= P("/mob/living/proc/guardian_reset");
	}
	return f.dot;
}, true, { verb: { name: "Reset Guardian Player (One Use)", category: "Guardian", desc: "Re-rolls which ghost will control your Guardian. One use per Guardian." } });

// guardian.dm:446
rt.def("/mob/living/proc/hasparasites", function hasparasites(f: Frame) {
	let _P: Value = null, G: Value = null;
	f.dot = list();
	for (_P of each(GLOB.parasites)) {
		if ((G = _P).summoner == this) {
			f.dot += G;
		}
	}
	return f.dot;
});

// guardian.dm:453
rt.def("/mob/living/simple_animal/hostile/guardian/proc/hasmatchingsummoner", function hasmatchingsummoner(f: Frame, G: Value) {
	return ((rt.istype(G, T("/mob/living/simple_animal/hostile/guardian")) ? 1 : 0) && (G.summoner == this.summoner ? 1 : 0));
});

rt.type(7568, "/obj/item/weapon/guardiancreator", "/obj/item/weapon", {
	used: 0,
	theme: "magic",
	mob_name: "Guardian Spirit",
	use_message: "<span class='holoparasite'>You shuffle the deck...</span>",
	used_message: "<span class='holoparasite'>All the cards seem to be blank now.</span>",
	failure_message: "<span class='holoparasitebold'>..And draw a card! It's...blank? Maybe you should try again later.</span>",
	ling_failure: "<span class='holoparasitebold'>The deck refuses to respond to a souless creature such as you.</span>",
	possible_guardians: null,
	random: 1,
	allowmultiple: 0,
	allowling: 1,
	allowguardian: 0,
	name: "deck of tarot cards",
	desc: "An enchanted deck of tarot cards, rumored to be a source of unimaginable power. ",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_syndicate_full",
});

// guardian.dm:477
rt.def("/obj/item/weapon/guardiancreator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let guardians: Value = null, theghost: Value = null;
	if (rt.istype(user, T("/mob/living/simple_animal/hostile/guardian")) && !this.allowguardian) {
		to_chat(user, `<span class='holoparasite'>${this.mob_name} chains are not allowed.</span>`);
		return f.dot;
	}
	if (rt.len(f, (guardians = user.hasparasites())) && !this.allowmultiple) {
		to_chat(user, `<span class='holoparasite'>You already have a ${this.mob_name}!</span>`);
		return f.dot;
	}
	if (user.mind && user.mind.changeling && !this.allowling) {
		to_chat(user, `${this.ling_failure}`);
		return f.dot;
	}
	if (this.used == 1) {
		to_chat(user, `${this.used_message}`);
		return f.dot;
	}
	this.used = 1;
	to_chat(user, `${this.use_message}`);
	let candidates: Value = (yield* pollGhostCandidates(`Do you want to play as the ${this.mob_name} of ${user.real_name}?`, "pAI", null, 0, 100));
	if (rt.len(f, candidates)) {
		theghost = pick(candidates);
		yield* this.spawn_guardian(user, theghost.key);
	} else {
		to_chat(user, `${this.failure_message}`);
		this.used = 0;
	}
	return f.dot;
}, true);

// guardian.dm:504
rt.def("/obj/item/weapon/guardiancreator/proc/spawn_guardian", function* spawn_guardian(f: Frame, user: Value, key: Value) {
	let guardians: Value = null, G: Value = null;
	let guardiantype: Value = "Standard";
	if (this.random) {
		guardiantype = pick(this.possible_guardians);
	} else if (!(guardiantype = (yield* g.op(f, "Prompt", [1], [null, `${this.mob_name} Creation`, `Pick the type of ${this.mob_name}`, user, this.possible_guardians])))) {
		to_chat(user, `${this.failure_message}`);
		this.used = 0;
		return f.dot;
	}
	let pickedtype: Value = T("/mob/living/simple_animal/hostile/guardian/punch");
	if (guardiantype === "Chaos") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/fire");
	} else if (guardiantype === "Standard") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/punch");
	} else if (guardiantype === "Ranged") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/ranged");
	} else if (guardiantype === "Support") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/healer");
	} else if (guardiantype === "Explosive") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/bomb");
	} else if (guardiantype === "Lightning") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/beam");
	} else if (guardiantype === "Protector") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/protector");
	} else if (guardiantype === "Charger") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/charger");
	} else if (guardiantype === "Assassin") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/assassin");
	} else if (guardiantype === "Dextrous") {
		pickedtype = T("/mob/living/simple_animal/hostile/guardian/dextrous");
	}
	if (rt.len(f, (guardians = user.hasparasites())) && !this.allowmultiple) {
		to_chat(user, `<span class='holoparasite'>You already have a ${this.mob_name}!</span>`);
		this.used = 0;
		return f.dot;
	}
	(G = (yield* new_(pickedtype, user, this.theme))).summoner = user;
	G.key = key;
	yield* G.mind.enslave_mind_to_creator(user);
	if (this.theme === "tech") {
		to_chat(user, `${G.tech_fluff_string}`);
		to_chat(user, `<span class='holoparasite'><font color="${G.namedatum.colour}"><b>${G.real_name}</b></font> is now online!</span>`);
	} else if (this.theme === "magic") {
		to_chat(user, `${G.magic_fluff_string}`);
		to_chat(user, `<span class='holoparasite'><font color="${G.namedatum.colour}"><b>${G.real_name}</b></font> has been summoned!</span>`);
	} else if (this.theme === "carp") {
		to_chat(user, `${G.carp_fluff_string}`);
		to_chat(user, `<span class='holoparasite'><font color="${G.namedatum.colour}"><b>${G.real_name}</b></font> has been caught!</span>`);
	}
	user.verbs += P("/mob/living/proc/guardian_comm");
	user.verbs += P("/mob/living/proc/guardian_recall");
	user.verbs += P("/mob/living/proc/guardian_reset");
	return f.dot;
}, true);

rt.type(5438, "/obj/item/weapon/storage/box/syndie_kit/guardian", "/obj/item/weapon/storage/box/syndie_kit", {
	name: "holoparasite injector kit",
});

// guardian.dm:657
rt.def("/obj/item/weapon/storage/box/syndie_kit/guardian/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/weapon/guardiancreator/tech/choose/traitor"), this);
	yield* new_(T("/obj/item/weapon/paper/guardian"), this);
	return f.dot;
}, true);
