// Based on /tg/station's code/game/gamemodes/miniantags/abduction/abduction_gear.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7766, "/obj/item/clothing/suit/armor/abductor/vest", "/obj/item/clothing/suit/armor/abductor", {
	mode: 1,
	stealth_active: 0,
	combat_cooldown: 10,
	disguise: null,
	stealth_armor: null,
	combat_armor: null,
	name: "agent vest",
	desc: "A vest outfitted with advanced stealth technology. It has two modes - combat and stealth.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "vest_stealth",
	item_state: "armor",
	blood_overlay_type: "armor",
	origin_tech: "magnets=7;biotech=4;powerstorage=4;abductor=4",
	armor: null,
	actions_types: null,
	allowed: null,
});

// abduction_gear.dm:28
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stealth_armor = rt.alist(f, ["melee", 15, "bullet", 15, "laser", 15, "energy", 15, "bomb", 15, "bio", 15, "rad", 15, "fire", 70, "acid", 70]);
	this.combat_armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 50, "bomb", 50, "bio", 50, "rad", 50, "fire", 90, "acid", 90]);
	this.armor = rt.alist(f, ["melee", 15, "bullet", 15, "laser", 15, "energy", 15, "bomb", 15, "bio", 15, "rad", 15, "fire", 70, "acid", 70]);

	this.actions_types = list(T("/datum/action/item_action/hands_free/activate"));

	this.allowed = list(T("/obj/item/device/abductor"), T("/obj/item/weapon/abductor_baton"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/restraints/handcuffs"));
	return f.dot;
});

// abduction_gear.dm:32
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/toggle_nodrop", function toggle_nodrop(f: Frame) {
	(rt.modSrcVar(f, "flags", NODROP, rt.bitXor));
	if (!ismob(this.loc)) return f.dot;
	let $0: any = this.loc;
	to_chat($0, `<span class='notice'>Your vest is now ${rt.bitAnd(this.flags, NODROP) ? "locked" : "unlocked"}.</span>`);
	return f.dot;
});

// abduction_gear.dm:37
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/flip_mode", function* flip_mode(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	if (this.mode === VEST_STEALTH) {
		this.mode = VEST_COMBAT;
		yield* this.DeactivateStealth();
		this.armor = this.combat_armor;
		this.icon_state = "vest_combat";
	} else if (this.mode === VEST_COMBAT) {
		this.mode = VEST_STEALTH;
		this.armor = this.stealth_armor;
		this.icon_state = "vest_stealth";
	}
	if (rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		yield* (H = this.loc).update_inv_wear_suit();
	}
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// abduction_gear.dm:55
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_wear_suit) return f.dot;
	return 1;
});

// abduction_gear.dm:59
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/SetDisguise", function SetDisguise(f: Frame, entry: Value) {
	this.disguise = entry;
	return f.dot;
});

// abduction_gear.dm:62
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/ActivateStealth", function* ActivateStealth(f: Frame) {
	let M: Value = null;
	if (this.disguise === null) {
		return f.dot;
	}
	this.stealth_active = 1;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja/cloak"), rt.getStep(f, (M = this.loc), 0), M.dir);
	M.name_override = this.disguise.name;
	M.icon = this.disguise.icon;
	M.icon_state = this.disguise.icon_state;
	M.cut_overlays();
	M.add_overlay(this.disguise.overlays);
	yield* M.update_inv_hands();
	return f.dot;
}, true);

// abduction_gear.dm:76
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/DeactivateStealth", function* DeactivateStealth(f: Frame) {
	let M: Value = null;
	if (!this.stealth_active) {
		return f.dot;
	}
	this.stealth_active = 0;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja"), rt.getStep(f, (M = this.loc), 0), M.dir);
	M.name_override = null;
	M.cut_overlays();
	yield* M.regenerate_icons();
	return f.dot;
}, true);

// abduction_gear.dm:87
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	yield* this.DeactivateStealth();
	return 0;
}, true);

// abduction_gear.dm:91
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/IsReflect", function* IsReflect(f: Frame) {
	yield* this.DeactivateStealth();
	return 0;
}, true);

// abduction_gear.dm:95
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/ui_action_click", function* ui_action_click(f: Frame) {
	if (this.mode === VEST_COMBAT) {
		yield* this.Adrenaline();
	} else if (this.mode === VEST_STEALTH) {
		if (this.stealth_active) {
			yield* this.DeactivateStealth();
		} else {
			yield* this.ActivateStealth();
		}
	}
	return f.dot;
}, true);

// abduction_gear.dm:105
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/Adrenaline", function* Adrenaline(f: Frame) {
	let M: Value = null;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	if (this.combat_cooldown != rt.initial(f, this, "combat_cooldown")) {
		to_chat(this.loc, "<span class='warning'>Combat injection is still recharging.</span>");
		return f.dot;
	}
	yield* (M = this.loc).adjustStaminaLoss(-75);
	yield* M.SetUnconscious(0);
	yield* M.SetStun(0);
	yield* M.SetKnockdown(0);
	this.combat_cooldown = 0;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// abduction_gear.dm:118
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/process", function process(f: Frame) {
	this.combat_cooldown++;
	if (this.combat_cooldown != rt.initial(f, this, "combat_cooldown")) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
}, false, { waitfor: false });

rt.type(7765, "/obj/item/clothing/suit/armor/abductor", "/obj/item/clothing/suit/armor", {});

// abduction_gear.dm:123
rt.def("/obj/item/clothing/suit/armor/abductor/proc/Destroy", function* Destroy(f: Frame) {
	let C: Value = null;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	for (C of each(GLOB.machines, T("/obj/machinery/abductor/console"))) {
		if (C.vest == this) {
			C.vest = null;
			break;
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(9148, "/obj/item/device/abductor", "/obj/item/device", {
	icon: rt.rsc("icons/obj/abductor.dmi"),
});

// abduction_gear.dm:135
rt.def("/obj/item/device/abductor/proc/AbductorCheck", function AbductorCheck(f: Frame, user: Value) {
	if (is_species(user, T("/datum/species/abductor"))) {
		return 1;
	}
	to_chat(user, "<span class='warning'>You can't figure how this works!</span>");
	return 0;
});

// abduction_gear.dm:141
rt.def("/obj/item/device/abductor/proc/ScientistCheck", function ScientistCheck(f: Frame, user: Value) {
	let S: Value = null;
	if (!this.AbductorCheck(user)) {
		return 0;
	}
	let H: Value = user;
	if ((S = H.dna.species).scientist) {
		return 1;
	}
	to_chat(user, "<span class='warning'>You're not trained to use this!</span>");
	return 0;
});

rt.type(9149, "/obj/item/device/abductor/gizmo", "/obj/item/device/abductor", {
	mode: 1,
	marked: null,
	console: null,
	name: "science tool",
	desc: "A dual-mode tool for retrieving specimens and scanning appearances. Scanning can be done through cameras.",
	icon_state: "gizmo_scan",
	item_state: "silencer",
	origin_tech: "engineering=7;magnets=4;bluespace=4;abductor=3",
});

// abduction_gear.dm:162
rt.def("/obj/item/device/abductor/gizmo/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.ScientistCheck(user)) {
		return f.dot;
	}
	if (!this.console) {
		to_chat(user, "<span class='warning'>The device is not linked to console!</span>");
		return f.dot;
	}
	if (this.mode == GIZMO_SCAN) {
		this.mode = GIZMO_MARK;
		this.icon_state = "gizmo_mark";
	} else {
		this.mode = GIZMO_SCAN;
		this.icon_state = "gizmo_scan";
	}
	let $0: any = user;
	to_chat($0, `<span class='notice'>You switch the device to ${this.mode == GIZMO_SCAN ? "SCAN" : "MARK"} MODE</span>`);
	return f.dot;
});

// abduction_gear.dm:177
rt.def("/obj/item/device/abductor/gizmo/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!this.ScientistCheck(user)) {
		return f.dot;
	}
	if (!this.console) {
		to_chat(user, "<span class='warning'>The device is not linked to console!</span>");
		return f.dot;
	}
	if (this.mode === GIZMO_SCAN) {
		yield* this.scan(M, user);
	} else if (this.mode === GIZMO_MARK) {
		yield* this.mark(M, user);
	}
	return f.dot;
}, true);

// abduction_gear.dm:193
rt.def("/obj/item/device/abductor/gizmo/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (flag) {
		return f.dot;
	}
	if (!this.ScientistCheck(user)) {
		return f.dot;
	}
	if (!this.console) {
		to_chat(user, "<span class='warning'>The device is not linked to console!</span>");
		return f.dot;
	}
	if (this.mode === GIZMO_SCAN) {
		yield* this.scan(target, user);
	} else if (this.mode === GIZMO_MARK) {
		yield* this.mark(target, user);
	}
	return f.dot;
}, true);

// abduction_gear.dm:206
rt.def("/obj/item/device/abductor/gizmo/proc/scan", function scan(f: Frame, target: Value, user: Value) {
	if (!rt.istype(target, T("/mob/living/carbon/human"))) return f.dot;
	this.console.AddSnapshot(target);
	to_chat(user, `<span class='notice'>You scan ${target} and add them to the database.</span>`);
	return f.dot;
});

// abduction_gear.dm:211
rt.def("/obj/item/device/abductor/gizmo/proc/mark", function* mark(f: Frame, target: Value, user: Value) {
	if (this.marked == target) {
		to_chat(user, "<span class='warning'>This specimen is already marked!</span>");
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		if (is_species(target, T("/datum/species/abductor"))) {
			this.marked = target;
			to_chat(user, `<span class='notice'>You mark ${target} for future retrieval.</span>`);
		} else {
			yield* this.prepare(target, user);
		}
	} else {
		yield* this.prepare(target, user);
	}
	return f.dot;
}, true);

// abduction_gear.dm:224
rt.def("/obj/item/device/abductor/gizmo/proc/prepare", function* prepare(f: Frame, target: Value, user: Value) {
	if (get_dist(target, user) > 1) {
		to_chat(user, "<span class='warning'>You need to be next to the specimen to prepare it for transport!</span>");
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You begin preparing ${target} for transport...</span>`);
	if (!(yield* do_after(user, 100, { target: target }))) return f.dot;
	this.marked = target;
	to_chat(user, `<span class='notice'>You finish preparing ${target} for transport.</span>`);
	return f.dot;
}, true);

// abduction_gear.dm:234
rt.def("/obj/item/device/abductor/gizmo/proc/Destroy", function* Destroy(f: Frame) {
	if (this.console) {
		this.console.gizmo = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(9150, "/obj/item/device/abductor/silencer", "/obj/item/device/abductor", {
	name: "abductor silencer",
	desc: "A compact device used to shut down communications equipment.",
	icon_state: "silencer",
	item_state: "gizmo",
	origin_tech: "materials=4;programming=7;abductor=3",
});

// abduction_gear.dm:246
rt.def("/obj/item/device/abductor/silencer/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	if (!this.AbductorCheck(user)) {
		return f.dot;
	}
	this.radio_off(M, user);
	return f.dot;
});

// abduction_gear.dm:253
rt.def("/obj/item/device/abductor/silencer/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (flag) {
		return f.dot;
	}
	if (!this.AbductorCheck(user)) {
		return f.dot;
	}
	this.radio_off(target, user);
	return f.dot;
});

// abduction_gear.dm:258
rt.def("/obj/item/device/abductor/silencer/proc/radio_off", function radio_off(f: Frame, target: Value, user: Value) {
	let M: Value = null;
	if (!rt.isIn(f, user, viewers(7, target))) {
		return f.dot;
	}
	let targloc: Value = rt.getStep(f, target, 0);
	for (M of each(view(2, targloc), T("/mob/living/carbon/human"))) {
		if (M == user) {
			continue;
		}
		to_chat(user, `<span class='notice'>You silence ${M}'s radio devices.</span>`);
		this.radio_off_mob(M);
	}
	return f.dot;
});

// abduction_gear.dm:271
rt.def("/obj/item/device/abductor/silencer/proc/radio_off_mob", function radio_off_mob(f: Frame, M: Value) {
	let I: Value = null, r: Value = null;
	let all_items: Value = M.GetAllContents();
	for (I of each(all_items, T("/obj"))) {
		if (rt.istype(I, T("/obj/item/device/radio"))) {
			(r = I).listening = 0;
			if (!rt.istype(I, T("/obj/item/device/radio/headset"))) {
				r.broadcasting = 0;
			}
		}
	}
	return f.dot;
});

rt.type(9152, "/obj/item/device/firing_pin/abductor", "/obj/item/device/firing_pin", {
	name: "alien firing pin",
	icon_state: "firing_pin_ayy",
	desc: "This firing pin is slimy and warm; you can swear you feel it constantly trying to mentally probe you.",
	fail_message: "<span class='abductor'>Firing error, please contact Command.</span>",
});

// abduction_gear.dm:289
rt.def("/obj/item/device/firing_pin/abductor/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	f.dot = is_species(user, T("/datum/species/abductor"));
	return f.dot;
});

rt.type(5132, "/obj/item/weapon/gun/energy/alien", "/obj/item/weapon/gun/energy", {
	name: "alien pistol",
	desc: "A complicated gun that fires bursts of high-intensity radiation.",
	icon_state: "alienpistol",
	item_state: "alienpistol",
	origin_tech: "combat=4;magnets=7;powerstorage=3;abductor=3",
	trigger_guard: -1,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin/abductor"),
});

// abduction_gear.dm:294
rt.def("/obj/item/weapon/gun/energy/alien/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/declone"));
	return f.dot;
});

rt.type(6654, "/obj/item/weapon/abductor_baton", "/obj/item/weapon", {
	mode: 0,
	name: "advanced baton",
	desc: "A quad-mode baton used for incapacitation and restraining of specimens.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "wonderprodStun",
	item_state: "wonderprod",
	slot_flags: 512,
	origin_tech: "materials=4;combat=4;biotech=7;abductor=4",
	force: 7,
	w_class: 3,
	actions_types: null,
});

// abduction_gear.dm:346
rt.def("/obj/item/weapon/abductor_baton/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_mode"));
	return f.dot;
});

// abduction_gear.dm:349
rt.def("/obj/item/weapon/abductor_baton/proc/toggle", function toggle(f: Frame, user: Value) {
	let txt: Value = null;
	user ??= f.usr;
	this.mode = (this.mode + 1) % BATON_MODES;
	if (this.mode === BATON_STUN) {
		txt = "stunning";
	} else if (this.mode === BATON_SLEEP) {
		txt = "sleep inducement";
	} else if (this.mode === BATON_CUFF) {
		txt = "restraining";
	} else if (this.mode === BATON_PROBE) {
		txt = "probing";
	}
	to_chat(f.usr, `<span class='notice'>You switch the baton to ${txt} mode.</span>`);
	this.update_icon();
	return f.dot;
});

// abduction_gear.dm:365
rt.def("/obj/item/weapon/abductor_baton/proc/update_icon", function update_icon(f: Frame) {
	if (this.mode === BATON_STUN) {
		this.icon_state = "wonderprodStun";
		this.item_state = "wonderprodStun";
	} else if (this.mode === BATON_SLEEP) {
		this.icon_state = "wonderprodSleep";
		this.item_state = "wonderprodSleep";
	} else if (this.mode === BATON_CUFF) {
		this.icon_state = "wonderprodCuff";
		this.item_state = "wonderprodCuff";
	} else if (this.mode === BATON_PROBE) {
		this.icon_state = "wonderprodProbe";
		this.item_state = "wonderprodProbe";
	}
	return f.dot;
});

// abduction_gear.dm:380
rt.def("/obj/item/weapon/abductor_baton/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	if (!is_species(user, T("/datum/species/abductor"))) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/silicon/robot"))) {
		yield* parent_proc();
		return f.dot;
	}
	if (!rt.istype(target, T("/mob/living"))) {
		return f.dot;
	}
	let L: Value = target;
	yield* user.do_attack_animation(L);
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		if (yield* (H = L).check_shields(this, 0, `${user}'s ${this.name}`, 1)) {
			playsound(L, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
			return 0;
		}
	}
	if (this.mode === BATON_STUN) {
		yield* this.StunAttack(L, user);
	} else if (this.mode === BATON_SLEEP) {
		yield* this.SleepAttack(L, user);
	} else if (this.mode === BATON_CUFF) {
		yield* this.CuffAttack(L, user);
	} else if (this.mode === BATON_PROBE) {
		this.ProbeAttack(L, user);
	}
	return f.dot;
}, true);

// abduction_gear.dm:411
rt.def("/obj/item/weapon/abductor_baton/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.toggle(user);
	return f.dot;
});

// abduction_gear.dm:417
rt.def("/obj/item/weapon/abductor_baton/proc/StunAttack", function* StunAttack(f: Frame, L: Value, user: Value) {
	let H: Value = null;
	user.lastattacked = L;
	L.lastattacker = user;
	yield* L.Knockdown(140);
	yield* L.apply_effect("stutter", 7);
	L.visible_message(`<span class='danger'>${user} has stunned ${L} with ${this}!</span>`, `<span class='userdanger'>${user} has stunned you with ${this}!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		yield* (H = L).forcesay(GLOB.hit_appends);
	}
	add_logs(user, L, "stunned");
	return f.dot;
}, true);

// abduction_gear.dm:431
rt.def("/obj/item/weapon/abductor_baton/proc/SleepAttack", function* SleepAttack(f: Frame, L: Value, user: Value) {
	if (L.incapacitated(1, 1)) {
		L.visible_message(`<span class='danger'>${user} has induced sleep in ${L} with ${this}!</span>`, "<span class='userdanger'>You suddenly feel very drowsy!</span>");
		playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
		yield* L.Sleeping(1200);
		add_logs(user, L, "put to sleep");
	} else {
		L.drowsyness += 1;
		to_chat(user, "<span class='warning'>Sleep inducement works fully only on stunned specimens! </span>");
		L.visible_message(`<span class='danger'>${user} tried to induce sleep in ${L} with ${this}!</span>`, "<span class='userdanger'>You suddenly feel drowsy!</span>");
	}
	return f.dot;
}, true);

// abduction_gear.dm:444
rt.def("/obj/item/weapon/abductor_baton/proc/CuffAttack", function* CuffAttack(f: Frame, L: Value, user: Value) {
	let C: Value = null;
	if (!rt.istype(L, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if ((C = L).handcuffed) return f.dot;
	if (C.get_num_arms() >= 2 || C.get_arm_ignore()) {
		playsound(this.loc, rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2);
		C.visible_message(`<span class='danger'>${user} begins restraining ${C} with ${this}!</span>`, `<span class='userdanger'>${user} begins shaping an energy field around your hands!</span>`);
		if ((yield* do_mob(user, C, 30)) && (C.get_num_arms() >= 2 || C.get_arm_ignore())) {
			if (!C.handcuffed) {
				C.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/energy/used"), C));
				yield* C.update_handcuffed();
				to_chat(user, `<span class='notice'>You restrain ${C}.</span>`);
				add_logs(user, C, "handcuffed");
			}
		} else {
			to_chat(user, `<span class='warning'>You fail to restrain ${C}.</span>`);
		}
	} else {
		to_chat(user, `<span class='warning'>${C} doesn't have two hands...</span>`);
	}
	return f.dot;
}, true);

// abduction_gear.dm:464
rt.def("/obj/item/weapon/abductor_baton/proc/ProbeAttack", function ProbeAttack(f: Frame, L: Value, user: Value) {
	let H: Value = null, temp: Value = null;
	L.visible_message(`<span class='danger'>${user} probes ${L} with ${this}!</span>`, `<span class='userdanger'>${user} probes you!</span>`);
	let species: Value = "<span class='warning'>Unknown species</span>";
	let helptext: Value = "<span class='warning'>Species unsuitable for experiments.</span>";
	if (rt.istype(L, T("/mob/living/carbon/human"))) {
		species = `<span clas=='notice'>${(H = L).dna.species.name}</span>`;
		if (L.mind && L.mind.changeling) {
			species = "<span class='warning'>Changeling lifeform</span>";
		}
		if (temp = rt.locateIn(f, T("/obj/item/organ/heart/gland"), H.internal_organs)) {
			helptext = "<span class='warning'>Experimental gland detected!</span>";
		} else {
			helptext = "<span class='notice'>Subject suitable for experiments.</span>";
		}
	}
	to_chat(user, `<span class='notice'>Probing result:</span>${species}`);
	to_chat(user, `${helptext}`);
	return f.dot;
});

rt.type(5779, "/obj/item/weapon/restraints/handcuffs/energy/used", "/obj/item/weapon/restraints/handcuffs/energy", {
	flags: 16384,
	desc: "energy discharge",
});

// abduction_gear.dm:497
rt.def("/obj/item/weapon/restraints/handcuffs/energy/used/proc/dropped", function* dropped(f: Frame, user: Value) {
	let S: Value = null;
	user.visible_message(`<span class='danger'>${user}'s ${this} break in a discharge of energy!</span>`, `<span class='userdanger'>${user}'s ${this} break in a discharge of energy!</span>`);
	yield* (S = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 0, user.loc);
	yield* S.start();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// abduction_gear.dm:505
rt.def("/obj/item/weapon/abductor_baton/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.mode === BATON_STUN) {
		to_chat(user, "<span class='warning'>The baton is in stun mode.</span>");
	} else if (this.mode === BATON_SLEEP) {
		to_chat(user, "<span class='warning'>The baton is in sleep inducement mode.</span>");
	} else if (this.mode === BATON_CUFF) {
		to_chat(user, "<span class='warning'>The baton is in restraining mode.</span>");
	} else if (this.mode === BATON_PROBE) {
		to_chat(user, "<span class='warning'>The baton is in probing mode.</span>");
	}
	return f.dot;
}, false);

rt.type(9168, "/obj/item/device/radio/headset/abductor", "/obj/item/device/radio/headset", {
	name: "alien headset",
	desc: "An advanced alien headset designed to monitor communications of human space stations. Why does it have a microphone? No one knows.",
	origin_tech: "magnets=2;abductor=3",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "abductor_headset",
	item_state: "abductor_headset",
	keyslot2: null,
});

// abduction_gear.dm:523
rt.def("/obj/item/device/radio/headset/abductor/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/heads/captain")));
	return f.dot;
}, true);

// abduction_gear.dm:526
rt.def("/obj/item/device/radio/headset/abductor/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "bang_protect", 1);
	yield* this.make_syndie();
	return f.dot;
}, true);

// abduction_gear.dm:531
rt.def("/obj/item/device/radio/headset/abductor/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(12205, "/obj/structure/table_frame/abductor", "/obj/structure/table_frame", {
	name: "alien table frame",
	desc: "A sturdy table frame made from alien alloy.",
	icon_state: "alien_frame",
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	framestackamount: 1,
	density: 1,
});

// abduction_gear.dm:606
rt.def("/obj/structure/table_frame/abductor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let i: Value = null, _P: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start disassembling ${this}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			i = 1;
			while (i <= this.framestackamount) {
				yield* new_(this.framestack, rt.getStep(f, this, 0));
				i++;
			}
			yield* qdel(this);
			return f.dot;
		}
	}
	if (rt.istype(I, T("/obj/item/stack/sheet/mineral/abductor"))) {
		if ((_P = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one alien alloy sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${_P} to ${this}...</span>`);
		if (yield* do_after(user, 50, { target: this })) {
			yield* _P.use(1);
			yield* new_(T("/obj/structure/table/abductor"), this.loc);
			yield* qdel(this);
		}
		return f.dot;
	}
	if (!rt.istype(I, T("/obj/item/stack/sheet/mineral/silver"))) return f.dot;
	if ((_P = I).get_amount() < 1) {
		to_chat(user, "<span class='warning'>You need one sheet of silver to do\tthis!</span>");
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You start adding ${_P} to ${this}...</span>`);
	if (!(yield* do_after(user, 50, { target: this }))) return f.dot;
	yield* _P.use(1);
	yield* new_(T("/obj/structure/table/optable/abductor"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12190, "/obj/structure/table/abductor", "/obj/structure/table", {
	canSmoothWith: null,
	name: "alien table",
	desc: "Advanced flat surface technology at work!",
	icon: rt.rsc("icons/obj/smooth_structures/alien_table.dmi"),
	icon_state: "alien_table",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	buildstackamount: 1,
	framestackamount: 1,
	frame: rt.typePath("/obj/structure/table_frame/abductor"),
});

// abduction_gear.dm:646
rt.def("/obj/structure/table/abductor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});

rt.type(12195, "/obj/structure/table/optable/abductor", "/obj/structure/table/optable", {
	can_buckle: 1,
	buckle_lying: 1,
	name: "alien operating table",
	desc: "Used for alien medical procedures. The surface is covered in tiny spines.",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	buildstackamount: 1,
	framestackamount: 1,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "bed",
	frame: rt.typePath("/obj/structure/table_frame/abductor"),
}, { global: { injected_reagents: 794 } });

// abduction_gear.dm:665
rt.def("/obj/structure/table/optable/abductor/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	f.dot = parent_proc();
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	to_chat(AM, "<span class='danger'>You feel a series of tiny pricks!</span>");
	return f.dot;
}, false);

// abduction_gear.dm:672
rt.def("/obj/structure/table/optable/abductor/proc/process", function* process(f: Frame) {
	let C: Value = null, chemical: Value = null;
	f.dot = PROCESS_KILL;
	for (C of each(rt.getStep(f, this, 0), T("/mob/living/carbon"))) {
		f.dot = 1;
		chemical = null;
		for (chemical of each(GLOB.injected_reagents)) {
			if (C.reagents.get_reagent_amount(chemical) < 1) {
				yield* C.reagents.add_reagent(chemical, 1);
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// abduction_gear.dm:679
rt.def("/obj/structure/table/optable/abductor/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(12411, "/obj/structure/door_assembly/door_assembly_abductor", "/obj/structure/door_assembly", {
	anchored: 1,
	name: "alien airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/abductor/abductor_airlock.dmi"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/abductor/overlays.dmi"),
	typetext: "abductor",
	icontext: "abductor",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/abductor"),
	state: 1,
});

// abduction_gear.dm:701
rt.def("/obj/structure/door_assembly/door_assembly_abductor/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && !this.anchored) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			user.visible_message(`<span class='warning'>${user} disassembles the airlock assembly.</span>`, "You start to disassemble the airlock assembly...");
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (!WT.isOn()) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You disassemble the airlock assembly.</span>");
				yield* new_(T("/obj/item/stack/sheet/mineral/abductor"), rt.getStep(f, this, 0), 4);
				yield* qdel(this);
			}
		} else {
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/airlock_painter"))) {
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/stack/sheet"))) {
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);
