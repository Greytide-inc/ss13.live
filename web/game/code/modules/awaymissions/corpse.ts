// Based on /tg/station's code/modules/awaymissions/corpse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11954, "/obj/effect/mob_spawn", "/obj/effect", {
	mob_type: null,
	mob_name: "",
	mob_gender: null,
	death: 1,
	roundstart: 1,
	instant: 0,
	flavour_text: "The mapper forgot to set this!",
	faction: null,
	permanent: 0,
	random: 0,
	objectives: null,
	uses: 1,
	brute_damage: 0,
	oxy_damage: 0,
	burn_damage: 0,
	mob_color: null,
	banType: "lavaland",
	anchored: 1,
	name: "Unknown",
	density: 1,
});

// corpse.dm:28
rt.def("/obj/effect/mob_spawn/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let ghost_role: Value = null;
	if (!GLOB.SSticker.HasRoundStarted() || !this.loc) {
		return f.dot;
	}
	if (!this.uses) {
		to_chat(user, "<span class='warning'>This spawner is out of charges!</span>");
		return f.dot;
	}
	if (jobban_isbanned(user, this.banType)) {
		to_chat(user, "<span class='warning'>You are jobanned!</span>");
		return f.dot;
	}
	if ((ghost_role = (yield* alert(`Become ${this.mob_name}? (Warning, You can no longer be cloned!)`, null, "Yes", "No"))) == "No" || !this.loc) {
		return f.dot;
	}
	log_game(`${user.ckey} became ${this.mob_name}`);
	yield* this.create({ ckey: user.ckey });
	return f.dot;
}, true);

// corpse.dm:43
rt.def("/obj/effect/mob_spawn/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (this.instant || this.roundstart && (mapload || GLOB.SSticker && GLOB.SSticker.current_state > GAME_STATE_SETTING_UP)) {
		yield* this.create();
	} else {
		(rt.modGl("poi_list", this, rt.bitOr));
	}
	return f.dot;
}, true);

// corpse.dm:50
rt.def("/obj/effect/mob_spawn/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.poi_list.Remove(this);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// corpse.dm:60
rt.def("/obj/effect/mob_spawn/proc/create", function* create(f: Frame, ckey: Value, flavour: Value, name: Value) {
	let MM: Value = null, objective: Value = null;
	let $e: any;
	flavour ??= 1;
	let M: Value = (yield* new_(this.mob_type, rt.getStep(f, this, 0)));
	if (!this.random) {
		M.real_name = this.mob_name ? this.mob_name : M.name;
		if (!this.mob_gender) {
			this.mob_gender = pick("male", "female");
		}
		M.gender = this.mob_gender;
	}
	if (this.faction) {
		M.faction = list(this.faction);
	}
	if (this.death) {
		yield* M.death(1);
	}
	yield* M.adjustOxyLoss(this.oxy_damage);
	yield* M.adjustBruteLoss(this.brute_damage);
	yield* M.adjustFireLoss(this.burn_damage);
	M.color = this.mob_color;
	yield* this.equip(M);
	if (ckey) {
		M.ckey = ckey;
		if (flavour) {
			to_chat(M, `${this.flavour_text}`);
		}
		MM = M.mind;
		if (this.objectives) {
			for (objective of each(this.objectives)) {
				MM.objectives += (yield* new_(T("/datum/objective"), objective));
			}
		}
		yield* this.special(M, name);
		MM.name = M.real_name;
	}
	if (this.uses > 0) {
		this.uses--;
	}
	if (!(!this.permanent && !this.uses)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11955, "/obj/effect/mob_spawn/human", "/obj/effect/mob_spawn", {
	mob_species: null,
	outfit: rt.typePath("/datum/outfit"),
	disable_pda: 1,
	id_job: null,
	id_access: null,
	id_access_list: null,
	husk: null,
	uniform: -1,
	r_hand: -1,
	l_hand: -1,
	suit: -1,
	shoes: -1,
	gloves: -1,
	ears: -1,
	glasses: -1,
	mask: -1,
	head: -1,
	belt: -1,
	r_pocket: -1,
	l_pocket: -1,
	back: -1,
	id: -1,
	neck: -1,
	backpack_contents: -1,
	suit_store: -1,
	mob_type: rt.typePath("/mob/living/carbon/human"),
});

// corpse.dm:127
rt.def("/obj/effect/mob_spawn/human/proc/Initialize", function* Initialize(f: Frame) {
	if (ispath(this.outfit)) {
		this.outfit = (yield* new_(this.outfit));
	}
	if (!this.outfit) {
		this.outfit = (yield* new_(T("/datum/outfit")));
	}
	return (yield* parent_proc());
}, true);

// corpse.dm:135
rt.def("/obj/effect/mob_spawn/human/proc/equip", function* equip(f: Frame, H: Value) {
	let slot: Value = null, _T: Value = null, PDA: Value = null, W: Value = null, jobtype: Value = null, J: Value = null;
	if (this.mob_species) {
		yield* H.set_species(this.mob_species);
	}
	if (this.husk) {
		yield* H.Drain();
	} else {
		yield* H.cure_husk();
	}
	H.underwear = "Nude";
	H.undershirt = "Nude";
	H.socks = "Nude";
	if (this.outfit) {
		for (slot of each(rt.gl("slots#2"))) {
			if (!isnum((_T = rt.index(this.vars, slot)))) {
				rt.setAt(this.outfit.vars, slot, _T);
			}
		}
		yield* H.equipOutfit(this.outfit);
		if (this.disable_pda) {
			if (PDA = rt.locateIn(f, T("/obj/item/device/pda"), H)) {
				PDA.toff = 1;
			}
		}
	}
	if (!(W = H.wear_id)) return f.dot;
	if (this.id_access) {
		for (jobtype of each(typesof(T("/datum/job")))) {
			if ((J = (yield* new_(jobtype))).title == this.id_access) {
				W.access = J.get_access();
				break;
			}
		}
	}
	if (this.id_access_list) {
		if (!rt.istype(W.access, T("/list"))) {
			W.access = list();
		}
		(rt.modField(f, W, "access", this.id_access_list, rt.bitOr));
	}
	if (this.id_job) {
		W.assignment = this.id_job;
	}
	W.registered_name = H.real_name;
	W.update_label();
	return f.dot;
}, true);

rt.type(12025, "/obj/effect/mob_spawn/AICorpse", "/obj/effect/mob_spawn", {});

// corpse.dm:190
rt.def("/obj/effect/mob_spawn/AICorpse/proc/create", function* create(f: Frame) {
	let A: Value = null, M: Value = null;
	if (A = rt.locateIn(f, T("/mob/living/silicon/ai"), this.loc)) {
		return f.dot;
	}
	(M = (yield* new_(T("/mob/living/silicon/ai/spawned"), this.loc))).name = this.name;
	M.real_name = this.name;
	M.aiPDA.toff = 1;
	yield* M.death();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11994, "/obj/effect/mob_spawn/human/facehugger", "/obj/effect/mob_spawn/human", {});

// corpse.dm:210
rt.def("/obj/effect/mob_spawn/human/facehugger/proc/create", function* create(f: Frame) {
	let O: Value = null;
	(O = (yield* new_(T("/obj/item/clothing/mask/facehugger"), this.loc))).name = this.name;
	O.Die();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11964, "/obj/effect/mob_spawn/human/doctor/alive", "/obj/effect/mob_spawn/human/doctor", {
	death: 0,
	roundstart: 0,
	random: 1,
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	flavour_text: "You are a space doctor!",
});

// corpse.dm:256
rt.def("/obj/effect/mob_spawn/human/doctor/alive/proc/equip", function* equip(f: Frame, H: Value) {
	let del_type: Value = null, I: Value = null;
	yield* parent_proc();
	let del_types: Value = list(T("/obj/item/device/pda"), T("/obj/item/device/radio/headset"));
	for (del_type of each(del_types)) {
		yield* qdel((I = rt.locateIn(f, del_type, H)));
	}
	return f.dot;
}, true);

rt.type(12005, "/obj/effect/mob_spawn/human/bartender", "/obj/effect/mob_spawn/human", {
	id_job: "Bartender",
	outfit: rt.typePath("/datum/outfit/spacebartender"),
	name: "Space Bartender",
	id_access_list: null,
});

// corpse.dm:297
rt.def("/obj/effect/mob_spawn/human/bartender/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(25);
	return f.dot;
});

rt.type(638, "/datum/outfit/beachbum", "/datum/outfit", {
	name: "Beach Bum",
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	uniform: rt.typePath("/obj/item/clothing/under/shorts/red"),
	r_pocket: rt.typePath("/obj/item/weapon/storage/wallet/random"),
});

// corpse.dm:339
rt.def("/datum/outfit/beachbum/proc/post_equip", function* post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	yield* f.args[0].dna.add_mutation("Stoner");
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(12009, "/obj/effect/mob_spawn/human/bridgeofficer", "/obj/effect/mob_spawn/human", {
	id_job: "Bridge Officer",
	outfit: rt.typePath("/datum/outfit/nanotrasenbridgeofficercorpse"),
	name: "Bridge Officer",
	id_access_list: null,
});

// corpse.dm:349
rt.def("/obj/effect/mob_spawn/human/bridgeofficer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_access_list = list(109);
	return f.dot;
});

rt.type(11993, "/obj/effect/mob_spawn/human/alive/space_bar_patron", "/obj/effect/mob_spawn/human/alive", {
	outfit: rt.typePath("/datum/outfit/spacebartender"),
	name: "Bar cryogenics",
	mob_name: "Bar patron",
	random: 1,
	permanent: 1,
	uses: -1,
});

// corpse.dm:470
rt.def("/obj/effect/mob_spawn/human/alive/space_bar_patron/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let despawn: Value = null;
	if ((despawn = (yield* alert("Return to cryosleep? (Warning, Your mob will be deleted!)", null, "Yes", "No"))) == "No" || !this.loc || !this.Adjacent(user)) {
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user.name} climbs back into cryosleep...</span>`);
	yield* qdel(user);
	return f.dot;
}, true);
