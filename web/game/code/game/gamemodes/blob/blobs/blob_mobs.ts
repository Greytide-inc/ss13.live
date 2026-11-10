// Based on /tg/station's code/game/gamemodes/blob/blobs/blob_mobs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4855, "/mob/living/simple_animal/hostile/blob", "/mob/living/simple_animal/hostile", {
	overmind: null,
	factory: null,
	pass_flags: 8,
	icon: rt.rsc("icons/mob/blob.dmi"),
	faction: null,
	bubble_icon: "blob",
	speak_emote: null,
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 360,
	unique_name: 1,
	a_intent: "harm",
});

// blob_mobs.dm:10
rt.def("/mob/living/simple_animal/hostile/blob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("blob");
	this.speak_emote = null;
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// blob_mobs.dm:23
rt.def("/mob/living/simple_animal/hostile/blob/proc/update_icons", function update_icons(f: Frame) {
	if (this.overmind) {
		this.add_atom_colour(this.overmind.blob_reagent_datum.color, 4);
	} else {
		this.remove_atom_colour(4);
	}
	return f.dot;
});

// blob_mobs.dm:29
rt.def("/mob/living/simple_animal/hostile/blob/proc/Destroy", function* Destroy(f: Frame) {
	if (this.overmind) {
		this.overmind.blob_mobs -= this;
	}
	return (yield* parent_proc());
}, true);

// blob_mobs.dm:33
rt.def("/mob/living/simple_animal/hostile/blob/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let i: Value = null, H: Value = null;
	let $e: any;
	if (!(this.stat != 2 && this.health < this.maxHealth)) return f.dot;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		H = (yield* new_(T("/obj/effect/temp_visual/heal"), rt.getStep(f, this, 0)));
		if (this.overmind) {
			H.color = this.overmind.blob_reagent_datum.complementary_color;
		} else {
			H.color = "#000000";
		}
	}
	rt.endFor(f, 0);
	yield* this.adjustHealth(-this.maxHealth * 0.0125);
	return f.dot;
}, true);

// blob_mobs.dm:43
rt.def("/mob/living/simple_animal/hostile/blob/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* parent_proc();
	if (exposed_temperature) {
		yield* this.adjustFireLoss(max(1, min(0.01 * exposed_temperature, 5)));
	} else {
		yield* this.adjustFireLoss(5);
	}
	return f.dot;
}, true);

// blob_mobs.dm:50
rt.def("/mob/living/simple_animal/hostile/blob/proc/CanPass", function CanPass(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/structure/blob"))) {
		return 1;
	}
	return parent_proc();
}, false, { args: ["mover", "target", "height"] });

// blob_mobs.dm:55
rt.def("/mob/living/simple_animal/hostile/blob/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let B: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	for (B of each(range(1, this), T("/obj/structure/blob"))) {
		return 1;
	}
	return (yield* parent_proc());
}, true, { args: ["movement_dir"] });

// blob_mobs.dm:60
rt.def("/mob/living/simple_animal/hostile/blob/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	if (message_mode == "binary") {
		this.blob_chat(message);
		return 1;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// blob_mobs.dm:67
rt.def("/mob/living/simple_animal/hostile/blob/proc/blob_chat", function blob_chat(f: Frame, msg: Value) {
	let M: Value = null, link: Value = null;
	let spanned_message: Value = this.say_quote(msg, this.get_spans());
	let rendered: Value = `<font color="#EE4000"><b>[Blob Telepathy] ${this.real_name}</b> ${spanned_message}</font>`;
	for (M of each(GLOB.mob_list)) {
		if (rt.istype(M, T("/mob/camera/blob")) || rt.istype(M, T("/mob/living/simple_animal/hostile/blob"))) {
			to_chat(M, rendered);
		}
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			to_chat(M, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

rt.type(4858, "/mob/living/simple_animal/hostile/blob/blobspore", "/mob/living/simple_animal/hostile/blob", {
	death_cloud_size: 1,
	oldguy: null,
	is_zombie: 0,
	verb_say: "psychically pulses",
	verb_ask: "psychically probes",
	verb_exclaim: "psychically yells",
	verb_yell: "psychically screams",
	name: "blob spore",
	desc: "A floating, fragile spore.",
	icon_state: "blobpod",
	icon_living: "blobpod",
	health: 30,
	maxHealth: 30,
	melee_damage_lower: 2,
	melee_damage_upper: 4,
	obj_damage: 20,
	environment_smash: 1,
	attacktext: "hits",
	attack_sound: rt.rsc("sound/weapons/genhit1.ogg"),
	movement_type: 2,
	del_on_death: 1,
	deathmessage: "explodes into a cloud of gas!",
	gold_core_spawnable: 1,
});

// blob_mobs.dm:106
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Initialize", function* Initialize(f: Frame, mapload: Value, linked_node: Value) {
	if (rt.istype(linked_node, T("/obj/structure/blob/factory"))) {
		this.factory = linked_node;
		this.factory.spores += this;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// blob_mobs.dm:112
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Life", function* Life(f: Frame) {
	let H: Value = null;
	if (!this.is_zombie && isturf(this.loc)) {
		for (H of each(view(this, 1), T("/mob/living/carbon/human"))) {
			if (H.stat == 2) {
				yield* this.Zombify(H);
				break;
			}
		}
	}
	if (this.factory && this.z != this.factory.z) {
		yield* this.death();
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// blob_mobs.dm:123
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Zombify", function* Zombify(f: Frame, H: Value) {
	let A: Value = null;
	this.is_zombie = 1;
	if (H.wear_suit) {
		if ((A = H.wear_suit).armor && rt.index(A.armor, "melee")) {
			this.maxHealth += rt.index(A.armor, "melee");
		}
	}
	this.health = (this.maxHealth += 40);
	this.name = "blob zombie";
	this.desc = "A shambling corpse animated by the blob.";
	this.melee_damage_lower += 8;
	this.melee_damage_upper += 11;
	this.movement_type = 1;
	this.death_cloud_size = 0;
	this.icon = H.icon;
	this.icon_state = "zombie";
	H.hair_style = null;
	yield* H.update_hair();
	yield* H.forceMove(this);
	this.oldguy = H;
	yield* this.update_icons();
	this.visible_message(`<span class='warning'>The corpse of ${H.name} suddenly rises!</span>`);
	return f.dot;
}, true);

// blob_mobs.dm:146
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/death", function* death(f: Frame, gibbed: Value) {
	let S: Value = (yield* new_(T("/datum/effect_system/smoke_spread/chem")));
	let location: Value = rt.getStep(f, this, 0);
	yield* this.create_reagents(10);
	if (this.overmind && this.overmind.blob_reagent_datum) {
		yield* this.reagents.add_reagent(this.overmind.blob_reagent_datum.id, 10);
	} else {
		yield* this.reagents.add_reagent("spore", 10);
	}
	yield* S.attach(location);
	yield* S.set_up(this.reagents, this.death_cloud_size, location, { silent: 1 });
	yield* S.start();
	if (this.factory) {
		this.factory.spore_delay = rt.worldTime(f) + this.factory.spore_cooldown;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// blob_mobs.dm:168
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/Destroy", function* Destroy(f: Frame) {
	if (this.factory) {
		this.factory.spores -= this;
	}
	this.factory = null;
	if (this.oldguy) {
		yield* this.oldguy.forceMove(rt.getStep(f, this, 0));
		this.oldguy = null;
	}
	return (yield* parent_proc());
}, true);

// blob_mobs.dm:177
rt.def("/mob/living/simple_animal/hostile/blob/blobspore/proc/update_icons", function update_icons(f: Frame) {
	if (this.overmind) {
		this.add_atom_colour(this.overmind.blob_reagent_datum.complementary_color, 4);
	} else {
		this.remove_atom_colour(4);
	}
	if (!this.is_zombie) return f.dot;
	this.copy_overlays(this.oldguy, 1);
	let blob_head_overlay: Value = mutable_appearance(rt.rsc("icons/mob/blob.dmi"), "blob_head");
	if (this.overmind) {
		blob_head_overlay.color = this.overmind.blob_reagent_datum.complementary_color;
	}
	this.color = rt.initial(f, this, "color");
	this.add_overlay(blob_head_overlay);
	return f.dot;
});

rt.type(4856, "/mob/living/simple_animal/hostile/blob/blobbernaut", "/mob/living/simple_animal/hostile/blob", {
	independent: 0,
	verb_say: "gurgles",
	verb_ask: "demands",
	verb_exclaim: "roars",
	verb_yell: "bellows",
	pressure_resistance: 50,
	name: "blobbernaut",
	desc: "A hulking, mobile chunk of blobmass.",
	icon_state: "blobbernaut",
	icon_living: "blobbernaut",
	icon_dead: "blobbernaut_dead",
	health: 200,
	maxHealth: 200,
	damage_coeff: null,
	melee_damage_lower: 20,
	melee_damage_upper: 20,
	obj_damage: 60,
	attacktext: "slams",
	attack_sound: rt.rsc("sound/effects/blobattack.ogg"),
	force_threshold: 10,
	mob_size: 3,
	see_in_dark: 8,
	lighting_alpha: 128,
});

// blob_mobs.dm:208
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.5, "fire", 1, "tox", 1, "clone", 1, "stamina", 0, "oxy", 1]);
	return f.dot;
});

// blob_mobs.dm:226
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (this.independent) return f.dot;
	this.verbs -= P("/mob/living/verb/pulled");
	return f.dot;
}, true);

// blob_mobs.dm:231
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/Life", function* Life(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	if (!(yield* parent_proc())) return f.dot;
	if (this.independent) {
		return f.dot;
	}
	let damagesources: Value = 0;
	if (!rt.locateIn(f, T("/obj/structure/blob"), range(2, this))) {
		damagesources++;
	}
	if (!this.factory) {
		damagesources++;
	}
	if (!damagesources) return f.dot;
	rt.forRange(f, 0, 1, damagesources, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* this.adjustHealth(this.maxHealth * 0.025);
	}
	rt.endFor(f, 0);
	(I = (yield* new_(T("/image"), rt.rsc("icons/mob/blob.dmi"), this, "nautdamage", 4.01))).appearance_flags = 2;
	if (this.overmind) {
		I.color = this.overmind.blob_reagent_datum.complementary_color;
	}
	yield* flick_overlay_view(I, this, 8);
	return f.dot;
}, true, { waitfor: false });

// blob_mobs.dm:249
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.args[1]) return f.dot;
	this.update_health_hud();
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// blob_mobs.dm:255
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_health_hud", function update_health_hud(f: Frame) {
	if (!this.hud_used) return f.dot;
	this.hud_used.healths.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='#e36600'>${round(this.health / this.maxHealth * 100, 0.5)}%</font></div>`;
	return f.dot;
});

// blob_mobs.dm:258
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living")) && this.overmind)) return f.dot;
	let L: Value = this.target;
	let mob_protection: Value = L.get_permeability_protection();
	yield* this.overmind.blob_reagent_datum.reaction_mob(L, VAPOR, 20, 0, mob_protection, this.overmind);
	return f.dot;
}, true);

// blob_mobs.dm:265
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/update_icons", function update_icons(f: Frame) {
	parent_proc();
	if (this.overmind) {
		this.melee_damage_lower = 4;
		this.melee_damage_upper = 4;
		this.attacktext = this.overmind.blob_reagent_datum.blobbernaut_message;
	} else {
		this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
		this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
		this.attacktext = rt.initial(f, this, "attacktext");
	}
	return f.dot;
});

// blob_mobs.dm:276
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc(gibbed);
	if (this.factory) {
		this.factory.naut = null;
		this.factory.max_integrity = rt.initial(f, this.factory, "max_integrity");
	}
	flick("blobbernaut_death", this);
	return f.dot;
}, true);
