// Based on /tg/station's code/game/gamemodes/wizard/artefact.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(6691, "/obj/item/weapon/veilrender", "/obj/item/weapon", {
	charges: 1,
	spawn_amt: 1,
	activate_descriptor: "reality",
	rend_desc: "You should run now.",
	spawn_fast: 0,
	spawn_type: rt.typePath("/obj/singularity/wizard"),
	name: "veil render",
	desc: "A wicked curved blade of alien origin, recovered from the ruins of a vast city.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	item_state: "render",
	force: 15,
	throwforce: 10,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// artefact.dm:24
rt.def("/obj/item/weapon/veilrender/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.charges > 0) {
		new_(T("/obj/effect/rend"), rt.getStep(f, user, 0), this.spawn_type, this.spawn_amt, this.rend_desc, this.spawn_fast);
		this.charges--;
		user.visible_message(`<span class='boldannounce'>${this} hums with power as ${user} deals a blow to ${this.activate_descriptor} itself!</span>`);
	} else {
		to_chat(user, "<span class='danger'>The unearthly energies that powered the blade are now dormant.</span>");
	}
	return f.dot;
});

rt.type(11773, "/obj/effect/rend", "/obj/effect", {
	spawn_path: rt.typePath("/mob/living/simple_animal/cow"),
	spawn_amt_left: 20,
	spawn_fast: 0,
	anchored: 1,
	name: "tear in the fabric of reality",
	desc: "You should run now.",
	icon: rt.rsc("icons/obj/biomass.dmi"),
	icon_state: "rift",
	density: 1,
});

// artefact.dm:47
rt.def("/obj/effect/rend/proc/New", function New(f: Frame, loc: Value, spawn_type: Value, spawn_amt: Value, desc: Value, spawn_fast: Value) {
	this.spawn_path = spawn_type;
	this.spawn_amt_left = spawn_amt;
	this.desc = desc;
	this.spawn_fast = spawn_fast;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	return f.dot;
});

// artefact.dm:51
rt.def("/obj/effect/rend/proc/process", function* process(f: Frame) {
	if (!this.spawn_fast) {
		if (rt.locateIn(f, T("/mob"), this.loc)) {
			return f.dot;
		}
	}
	yield* new_(this.spawn_path, this.loc);
	this.spawn_amt_left--;
	if (!(this.spawn_amt_left <= 0)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// artefact.dm:60
rt.def("/obj/effect/rend/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/nullrod"))) {
		user.visible_message(fmt("<span class='danger'>＀ seals ％！ with ％！.</span>", [user, this, I]));
		yield* qdel(this);
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(13035, "/obj/singularity/wizard", "/obj/singularity", {
	name: "tear in the fabric of reality",
	desc: "This isn't right.",
	icon: rt.rsc("icons/effects/224x224.dmi"),
	icon_state: "reality",
	pixel_x: -96,
	pixel_y: -96,
	grav_pull: 6,
	consume_range: 3,
	current_size: 7,
	allowed_size: 7,
});

// artefact.dm:99
rt.def("/obj/singularity/wizard/proc/process", function* process(f: Frame) {
	yield* this.move();
	yield* this.eat();
	return f.dot;
}, true, { waitfor: false });

rt.type(6694, "/obj/item/weapon/scrying", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 7,
	name: "scrying orb",
	desc: "An incandescent orb of otherworldly energy, staring into it gives you vision beyond mortal means.",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	throwforce: 15,
	damtype: "fire",
	force: 15,
	hitsound: rt.rsc("sound/items/welder2.ogg"),
});

// artefact.dm:117
rt.def("/obj/item/weapon/scrying/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>You can see...everything!</span>");
	this.visible_message(`<span class='danger'>${user} stares into ${this}, their eyes glazing over.</span>`);
	yield* user.ghostize(1);
	return f.dot;
}, true);

rt.type(9216, "/obj/item/device/necromantic_stone", "/obj/item/device", {
	spooky_scaries: null,
	unlimited: 0,
	name: "necromantic stone",
	desc: "A shard capable of resurrecting humans as skeleton thralls.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "necrostone",
	item_state: "electronic",
	origin_tech: "bluespace=4;materials=4",
	w_class: 1,
});

// artefact.dm:132
rt.def("/obj/item/device/necromantic_stone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spooky_scaries = list();
	return f.dot;
});

// artefact.dm:139
rt.def("/obj/item/device/necromantic_stone/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let $0: any;
	if (!rt.istype(M, T("/mob/living/carbon/human"))) {
		return (yield* parent_proc());
	}
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !user.canUseTopic(M, 1)) {
		return f.dot;
	}
	if (M.stat != 2) {
		to_chat(user, "<span class='warning'>This artifact can only affect the dead!</span>");
		return f.dot;
	}
	if (!M.mind || !M.client) {
		to_chat(user, "<span class='warning'>There is no soul connected to this body...</span>");
		return f.dot;
	}
	yield* this.check_spooky();
	if (rt.len(f, this.spooky_scaries) >= 3 && !this.unlimited) {
		to_chat(user, "<span class='warning'>This artifact can only affect three undead at a time!</span>");
		return f.dot;
	}
	yield* M.set_species(T("/datum/species/skeleton"), { icon_update: 0 });
	yield* M.revive({ full_heal: 1, admin_revive: 1 });
	(rt.modSrcVar(f, "spooky_scaries", M, rt.bitOr));
	to_chat(M, `<span class='userdanger'>You have been revived by </span><B>${user.real_name}!</B>`);
	to_chat(M, `<span class='userdanger'>${user.p_they(1)} ${user.p_are()} your master now, assist them even if it costs you your new life!</span>`);
	yield* this.equip_roman_skeleton(M);
	if (this.unlimited) {
		$0 = ".";
	} else {
		$0 = `, ${rt.len(f, this.spooky_scaries)}/3 active thralls.`;
	}
	this.desc = `A shard capable of resurrecting humans as skeleton thralls${$0}`;
	return f.dot;
}, true);

// artefact.dm:172
rt.def("/obj/item/device/necromantic_stone/proc/check_spooky", function* check_spooky(f: Frame) {
	let X: Value = null, H: Value = null;
	if (this.unlimited) {
		return f.dot;
	}
	for (X of each(this.spooky_scaries)) {
		if (!rt.istype(X, T("/mob/living/carbon/human"))) {
			yield* this.spooky_scaries.Remove(X);
			continue;
		}
		if ((H = X).stat == 2) {
			yield* H.dust(1);
			yield* this.spooky_scaries.Remove(X);
			continue;
		}
	}
	listclearnulls(this.spooky_scaries);
	return f.dot;
}, true);

// artefact.dm:185
rt.def("/obj/item/device/necromantic_stone/proc/equip_roman_skeleton", function* equip_roman_skeleton(f: Frame, H: Value) {
	let I: Value = null;
	for (I of each(H, T("/obj/item"))) {
		yield* H.dropItemToGround(I);
	}
	let hat: Value = pick(T("/obj/item/clothing/head/helmet/roman"), T("/obj/item/clothing/head/helmet/roman/legionaire"));
	yield* H.equip_to_slot_or_del((yield* new_(hat, H)), slot_head);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/roman"), H)), slot_w_uniform);
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/roman"), H)), slot_shoes);
	yield* H.put_in_hands_or_del((yield* new_(T("/obj/item/weapon/shield/riot/roman"), H)));
	yield* H.put_in_hands_or_del((yield* new_(T("/obj/item/weapon/claymore"), H)));
	yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/twohanded/spear"), H)), slot_back);
	return f.dot;
}, true);

rt.type(6695, "/obj/item/weapon/multisword", "/obj/item/weapon", {
	faction: null,
	cooldown: 0,
	assigned: "unassigned",
	flags: 64,
	name: "multiverse sword",
	desc: "A weapon capable of conquering the universe and beyond. Activate it to summon copies of yourself from others dimensions to fight by your side.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "multiverse",
	item_state: "multiverse",
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	slot_flags: 512,
	sharpness: 1,
	force: 20,
	throwforce: 10,
	w_class: 3,
	attack_verb: null,
}, { global: { multiverse: 730 } });

// artefact.dm:214
rt.def("/obj/item/weapon/multisword/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("unassigned");
	this.attack_verb = list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut");
	return f.dot;
});

// artefact.dm:220
rt.def("/obj/item/weapon/multisword/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.multiverse += this;
	return f.dot;
}, true);

// artefact.dm:225
rt.def("/obj/item/weapon/multisword/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.multiverse.Remove(this);
	return (yield* parent_proc());
}, true);

// artefact.dm:229
rt.def("/obj/item/weapon/multisword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let faction_check: Value = null, F: Value = null, G: Value = null, hijack_objective: Value = null, candidates: Value = null, C: Value = null, M: Value = null;
	if (user.mind.special_role == "apprentice") {
		to_chat(user, "<span class='warning'>You know better than to touch your teacher's stuff.</span>");
		return f.dot;
	}
	if (this.cooldown < rt.worldTime(f)) {
		faction_check = 0;
		for (F of each(this.faction)) {
			if (rt.isIn(f, F, user.faction)) {
				faction_check = 1;
				break;
			}
		}
		if (faction_check == 0) {
			this.faction = list(`${user.real_name}`);
			this.assigned = `${user.real_name}`;
			user.faction = list(`${user.real_name}`);
			to_chat(user, "You bind the sword to yourself. You can now use it to summon help.");
			if (!is_gangster(user)) {
				G = (yield* new_(T("/datum/gang/multiverse"), this, `${user.real_name}`));
				GLOB.SSticker.mode.gangs += G;
				rt.setAt(G.bosses, user.mind, 0);
				G.add_gang_hud(user.mind);
				user.mind.gang_datum = G;
				to_chat(user, "<span class='warning'><B>With your new found power you could easily conquer the station!</B></span>");
				(hijack_objective = (yield* new_(T("/datum/objective/hijackclone")))).owner = user.mind;
				user.mind.objectives += hijack_objective;
				hijack_objective.explanation_text = `Ensure only ${user.real_name} and their copies are on the shuttle!`;
				to_chat(user, `<B>Objective #${1}</B>: ${hijack_objective.explanation_text}`);
				GLOB.SSticker.mode.traitors += user.mind;
				user.mind.special_role = `${user.real_name} Prime`;
			}
		} else if (rt.len(f, (candidates = get_candidates("wizard")))) {
			yield* this.spawn_copy((C = pick(candidates)), rt.getStep(f, user.loc, 0), user);
			to_chat(user, "<span class='warning'><B>The sword flashes, and you find yourself face to face with...you!</B></span>");
			this.cooldown = rt.worldTime(f) + 400;
			for (M of each(GLOB.multiverse, T("/obj/item/weapon/multisword"))) {
				if (M.assigned == this.assigned) {
					M.cooldown = this.cooldown;
				}
			}
		} else {
			to_chat(user, "You fail to summon any copies of yourself. Perhaps you should try again in a bit.");
		}
	} else {
		to_chat(user, `<span class='warning'><B>${this} is recharging! Keep in mind it shares a cooldown with the swords wielded by your copies.</span>`);
	}
	return f.dot;
}, true);

// artefact.dm:275
rt.def("/obj/item/weapon/multisword/proc/spawn_copy", function* spawn_copy(f: Frame, C: Value, _T: Value, user: Value) {
	let all_species: Value = null, speciestype: Value = null, S: Value = null;
	let M: Value = (yield* new_(T("/mob/living/carbon/human"), _T));
	yield* C.prefs.copy_to(M, { icon_updates: 0 });
	M.key = C.key;
	M.mind.name = user.real_name;
	to_chat(M, `<B>You are an alternate version of ${user.real_name} from another universe! Help them accomplish their goals at all costs.</B>`);
	yield* GLOB.SSticker.mode.add_gangster(M.mind, user.mind.gang_datum, 0);
	M.real_name = user.real_name;
	M.name = user.real_name;
	M.faction = list(`${user.real_name}`);
	if (prob(50)) {
		all_species = list();
		for (speciestype of each(typesof(T("/datum/species")) - T("/datum/species"))) {
			if (!rt.initial(f, (S = speciestype), "dangerous_existence")) {
				all_species += speciestype;
			}
		}
		yield* M.set_species(pick(all_species), { icon_update: 0 });
	}
	yield* M.update_body();
	yield* M.update_hair();
	yield* M.update_body_parts();
	yield* M.dna.update_dna_identity();
	yield* this.equip_copy(M);
	return f.dot;
}, true);

// artefact.dm:299
rt.def("/obj/item/weapon/multisword/proc/equip_copy", function* equip_copy(f: Frame, M: Value) {
	let sword: Value = null, randomize: Value = null, hat: Value = null, X: Value = null, affecting: Value = null, carried_item: Value = null, I: Value = null, W: Value = null;
	let $e: any;
	(sword = (yield* new_(T("/obj/item/weapon/multisword")))).assigned = this.assigned;
	sword.faction = list(`${this.assigned}`);
	const subject = (randomize = pick("mobster", "roman", "wizard", "cyborg", "syndicate", "assistant", "animu", "cultist", "highlander", "clown", "killer", "pirate", "soviet", "officer", "gladiator"));
	if (subject === "mobster") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/fedora"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/laceup"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/color/black"), M)), slot_gloves);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/glasses/sunglasses"), M)), slot_glasses);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/suit_jacket/really_black"), M)), slot_w_uniform);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "roman") {
		hat = pick(T("/obj/item/clothing/head/helmet/roman"), T("/obj/item/clothing/head/helmet/roman/legionaire"));
		yield* M.equip_to_slot_or_del((yield* new_(hat, M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/roman"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/roman"), M)), slot_shoes);
		yield* M.put_in_hands_or_del((yield* new_(T("/obj/item/weapon/shield/riot/roman"), M)));
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "wizard") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/lightpurple"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe/red"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard/red"), M)), slot_head);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "cyborg") {
		for (X of each(M.bodyparts)) {
			yield* (affecting = X).change_bodypart_status(BODYPART_ROBOTIC, 0, 1);
		}
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/glasses/thermal/eyepatch"), M)), slot_glasses);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "syndicate") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/syndicate"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/combat"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/combat"), M)), slot_gloves);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/helmet/swat"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/armor/vest"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/gas"), M)), slot_wear_mask);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "assistant") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/grey"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sneakers/black"), M)), slot_shoes);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "animu") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/kitty"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/schoolgirl/red"), M)), slot_w_uniform);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "cultist") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/culthood/alt"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/cultrobes/alt"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/cult"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "highlander") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/kilt"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/beret"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/combat"), M)), slot_shoes);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "clown") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/rank/clown"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/clown_shoes"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/gas/clown_hat"), M)), slot_wear_mask);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/bikehorn"), M)), slot_l_store);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "killer") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/overalls"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sneakers/white"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/color/latex"), M)), slot_gloves);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/surgical"), M)), slot_wear_mask);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/welding"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/apron"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/kitchen/knife"), M)), slot_l_store);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/scalpel"), M)), slot_r_store);
		yield* M.put_in_hands_or_del(sword);
		for (carried_item of each(M.get_equipped_items(), T("/obj/item"))) {
			yield* carried_item.add_mob_blood(M);
		}
		for (I of each(M.held_items, T("/obj/item"))) {
			yield* I.add_mob_blood(M);
		}
	} else if (subject === "pirate") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/pirate"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sneakers/brown"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/bandana"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/glasses/eyepatch"), M)), slot_glasses);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "soviet") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/pirate/captain"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/combat"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/combat"), M)), slot_gloves);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/pirate/captain"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/soviet"), M)), slot_w_uniform);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "officer") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/helmet/space/beret"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/combat"), M)), slot_shoes);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/gloves/combat"), M)), slot_gloves);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/cigarette/cigar/havana"), M)), slot_wear_mask);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/jacket/miljacket"), M)), slot_wear_suit);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/syndicate"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/glasses/eyepatch"), M)), slot_glasses);
		yield* M.put_in_hands_or_del(sword);
	} else if (subject === "gladiator") {
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/helmet/gladiator"), M)), slot_head);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/gladiator"), M)), slot_w_uniform);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), M)), slot_ears);
		yield* M.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal"), M)), slot_shoes);
		yield* M.put_in_hands_or_del(sword);
	} else {
		return f.dot;
	}
	yield* M.update_body_parts();
	(W = (yield* new_(T("/obj/item/weapon/card/id")))).icon_state = "centcom";
	W.access += slot_shoes;
	W.assignment = "Multiverse Traveller";
	W.registered_name = M.real_name;
	W.update_label(M.real_name);
	yield* M.equip_to_slot_or_del(W, slot_wear_id);
	return f.dot;
}, true);

rt.type(9537, "/obj/item/voodoo", "/obj/item", {
	target: null,
	possible: null,
	link: null,
	cooldown_time: 30,
	cooldown: 0,
	name: "wicker doll",
	desc: "Something creepy about it.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "voodoo",
	item_state: "electronic",
	obj_integrity: 10,
	max_integrity: 10,
	resistance_flags: 4,
});

// artefact.dm:454
rt.def("/obj/item/voodoo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.possible = list();
	return f.dot;
});

// artefact.dm:463
rt.def("/obj/item/voodoo/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.target && this.cooldown < rt.worldTime(f)) {
		if (I.is_hot()) {
			to_chat(this.target, "<span class='userdanger'>You suddenly feel very hot</span>");
			this.target.bodytemperature += 50;
			this.GiveHint(this.target);
		} else if (is_type_in_typecache(I, GLOB.pointed_types)) {
			to_chat(this.target, `<span class='userdanger'>You feel a stabbing pain in ${parse_zone(user.zone_selected)}!</span>`);
			yield* this.target.Knockdown(40);
			this.GiveHint(this.target);
		} else if (rt.istype(I, T("/obj/item/weapon/bikehorn"))) {
			to_chat(this.target, "<span class='userdanger'>HONK</span>");
			rt.op(f, "OutputReference", [rt.R.srcVar("target")], [rt.rsc("sound/items/airhorn.ogg")], false);
			this.target.adjustEarDamage(0, 3);
			this.GiveHint(this.target);
		}
		this.cooldown = rt.worldTime(f) + this.cooldown_time;
		return f.dot;
	}
	if (this.link) return f.dot;
	if (!(I.loc == user && rt.istype(I, T("/obj/item")) && I.w_class <= WEIGHT_CLASS_SMALL)) return f.dot;
	yield* user.drop_item();
	I.loc = this;
	this.link = I;
	to_chat(user, `You attach ${I} to the doll.`);
	this.update_targets();
	return f.dot;
}, true);

// artefact.dm:489
rt.def("/obj/item/voodoo/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	if (this.loc == user) return f.dot;
	yield* user.reset_perspective(null);
	yield* user.unset_machine();
	return f.dot;
}, true);

// artefact.dm:494
rt.def("/obj/item/voodoo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let wgw: Value = null, _T: Value = null;
	if (!this.target && rt.len(f, this.possible)) {
		this.target = (yield* g.op(f, "Prompt", [1], [null, "Voodoo", "Select your victim!", user, this.possible]));
		return f.dot;
	}
	if (user.zone_selected == "chest") {
		if (this.link) {
			this.target = null;
			this.link.loc = rt.getStep(f, this, 0);
			to_chat(user, `<span class='notice'>You remove the ${this.link} from the doll.</span>`);
			this.link = null;
			this.update_targets();
			return f.dot;
		}
	}
	if (!(this.target && this.cooldown < rt.worldTime(f))) return f.dot;
	if (user.zone_selected === "mouth") {
		wgw = sanitize((yield* g.op(f, "Prompt", [2], [null, "Voodoo", "What would you like the victim to say", user, null])));
		yield* this.target.say(wgw);
		log_game(`${user}${user.key} made ${this.target}${this.target.key} say ${wgw} with a voodoo doll.`);
	} else if (user.zone_selected === "eyes") {
		yield* user.set_machine(this);
		yield* user.reset_perspective(this.target);
		rt.spawnTail(f, 100, "/obj/item/voodoo/proc/attack_self: spawn at game/gamemodes/wizard/artefact.dm:516", user, wgw, _T);
	} else if (user.zone_selected === "r_leg" || user.zone_selected === "l_leg") {
		to_chat(user, "<span class='notice'>You move the doll's legs around.</span>");
		_T = rt.getStep(f, this.target, pick(GLOB.cardinal));
		yield* this.target.Move(_T);
	} else if (user.zone_selected === "r_arm" || user.zone_selected === "l_arm") {
		yield* this.target.click_random_mob();
		this.GiveHint(this.target);
	} else if (user.zone_selected === "head") {
		to_chat(user, "<span class='notice'>You smack the doll's head with your hand.</span>");
		this.target.Dizzy(10);
		to_chat(this.target, "<span class='warning'>You suddenly feel as if your head was hit with a hammer!</span>");
		this.GiveHint(this.target, user);
	}
	this.cooldown = rt.worldTime(f) + this.cooldown_time;
	return f.dot;
}, true);

// a spawn(100) body of /obj/item/voodoo/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/voodoo/proc/attack_self: spawn at game/gamemodes/wizard/artefact.dm:516", function* (f: Frame, user: Value, wgw: Value, _T: Value) {
	yield* user.reset_perspective(null);
	yield* user.unset_machine();
	return null;
});

// artefact.dm:534
rt.def("/obj/item/voodoo/proc/update_targets", function update_targets(f: Frame) {
	let H: Value = null;
	this.possible = list();
	if (!this.link) {
		return f.dot;
	}
	for (H of each(GLOB.living_mob_list, T("/mob/living/carbon/human"))) {
		if (rt.isIn(f, md5(H.dna.uni_identity), this.link.fingerprints)) {
			(rt.modSrcVar(f, "possible", H, rt.bitOr));
		}
	}
	return f.dot;
});

// artefact.dm:542
rt.def("/obj/item/voodoo/proc/GiveHint", function GiveHint(f: Frame, victim: Value, force: Value) {
	let way: Value = null;
	force ??= 0;
	if (prob(50) || force) {
		way = dir2text(rt.getDir(f, victim, rt.getStep(f, this, 0)));
		to_chat(victim, `<span class='notice'>You feel a dark presence from ${way}</span>`);
	}
	if (!(prob(20) || force)) return f.dot;
	let A: Value = get_area(this);
	to_chat(victim, `<span class='notice'>You feel a dark presence from ${A.name}</span>`);
	return f.dot;
});

// artefact.dm:551
rt.def("/obj/item/voodoo/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (this.target) {
		yield* this.target.adjust_fire_stacks(20);
		yield* this.target.IgniteMob();
		this.GiveHint(this.target, 1);
	}
	return (yield* parent_proc());
}, true);

rt.type(9538, "/obj/item/warpwhistle", "/obj/item", {
	on_cooldown: 0,
	last_user: null,
	name: "warp whistle",
	desc: "One toot on this whistle will send you to a far away land!",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "whistle",
});

// artefact.dm:575
rt.def("/obj/item/warpwhistle/proc/interrupted", function interrupted(f: Frame, user: Value) {
	if (!user || !this || this.gc_destroyed) {
		this.on_cooldown = 0;
		return 1;
	}
	return 0;
});

// artefact.dm:581
rt.def("/obj/item/warpwhistle/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let _T: Value = null, potential_T: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon")) || this.on_cooldown) {
		return f.dot;
	}
	this.on_cooldown = 1;
	this.last_user = user;
	playsound((_T = rt.getStep(f, user, 0)), rt.rsc("sound/magic/warpwhistle.ogg"), 200, 1);
	user.canmove = 0;
	yield* new_(T("/obj/effect/temp_visual/tornado"), _T);
	yield* sleep(20);
	if (this.interrupted(user)) {
		return f.dot;
	}
	user.invisibility = INVISIBILITY_MAXIMUM;
	(rt.modField(f, user, "status_flags", 4096, rt.bitOr));
	yield* sleep(20);
	if (this.interrupted(user)) {
		return f.dot;
	}
	let breakout: Value = 0;
	while (breakout < 50) {
		potential_T = find_safe_turf();
		if (_T.z != potential_T.z || rt.op(f, "Abs", [], [get_dist_euclidian(potential_T, _T)]) > 50 - breakout) {
			yield* user.forceMove(potential_T);
			user.canmove = 0;
			_T = potential_T;
			break;
		}
		breakout += 1;
	}
	yield* new_(T("/obj/effect/temp_visual/tornado"), _T);
	yield* sleep(20);
	if (this.interrupted(user)) {
		return f.dot;
	}
	user.invisibility = rt.initial(f, user, "invisibility");
	(rt.modField(f, user, "status_flags", 16773119, rt.bitAnd));
	user.canmove = 1;
	this.on_cooldown = 2;
	yield* sleep(40);
	this.on_cooldown = 0;
	return f.dot;
}, true);

// artefact.dm:618
rt.def("/obj/item/warpwhistle/proc/Destroy", function* Destroy(f: Frame) {
	if (this.on_cooldown == 1 && this.last_user) {
		this.last_user.invisibility = rt.initial(f, this.last_user, "invisibility");
		(rt.modField(f, this.last_user, "status_flags", 16773119, rt.bitAnd));
		this.last_user.canmove = 1;
	}
	return (yield* parent_proc());
}, true);

rt.type(11533, "/obj/effect/temp_visual/tornado", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "tornado",
	name: "tornado",
	desc: "This thing sucks!",
	layer: 5,
	randomdir: 0,
	duration: 40,
	pixel_x: 500,
});

// artefact.dm:635
rt.def("/obj/effect/temp_visual/tornado/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	rt.op(f, "Animate", [2, 6], [null, this, "pixel_x", -500, "time", 40]);
	return f.dot;
}, true);
