// Based on /tg/station's code/modules/mob/living/simple_animal/bot/ed209bot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5034, "/mob/living/simple_animal/bot/ed209", "/mob/living/simple_animal/bot", {
	lastfired: 0,
	shot_delay: 15,
	lasercolor: "",
	disabled: 0,
	target: null,
	oldtarget_name: null,
	threatlevel: 0,
	target_lastloc: null,
	last_found: null,
	declare_arrests: 1,
	idcheck: 1,
	weaponscheck: 1,
	check_records: 1,
	arrest_type: 0,
	shoot_sound: rt.rsc("sound/weapons/taser.ogg"),
	projectile: rt.typePath("/obj/item/projectile/energy/electrode"),
	anchored: 0,
	radio_channel: "Security",
	bot_type: 1,
	model: "ED-209",
	window_id: "autoed209",
	window_name: "Automatic Security Unit v2.6",
	allow_pai: 0,
	data_hud_type: 2,
	name: "１ED-209 Security Robot",
	desc: "A security robot.  He looks less than thrilled.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "ed2090",
	density: 1,
	health: 100,
	maxHealth: 100,
	damage_coeff: null,
	obj_damage: 60,
	environment_smash: 2,
	mob_size: 3,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_sec"),
	bot_core: rt.typePath("/obj/machinery/bot_core/secbot"),
});

// ed209bot.dm:10
rt.def("/mob/living/simple_animal/bot/ed209/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.5, "fire", 0.7, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	return f.dot;
});

// ed209bot.dm:46
rt.def("/mob/living/simple_animal/bot/ed209/proc/Initialize", function* Initialize(f: Frame, mapload: Value, created_name: Value, created_lasercolor: Value) {
	let J: Value = null, secsensor: Value = null;
	yield* parent_proc();
	if (created_name) {
		this.name = created_name;
	}
	if (created_lasercolor) {
		this.lasercolor = created_lasercolor;
	}
	this.icon_state = `${this.lasercolor}ed209${this.on}`;
	this.set_weapon();
	rt.spawnTail(f, 3, "/mob/living/simple_animal/bot/ed209/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:53", J, secsensor);
	(secsensor = rt.index(GLOB.huds, DATA_HUD_SECURITY_ADVANCED)).add_hud_to(this);
	return f.dot;
}, true);

// a spawn(3) body of /mob/living/simple_animal/bot/ed209/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:53", function* (f: Frame, J: Value, secsensor: Value) {
	J = (yield* new_(T("/datum/job/detective")));
	this.access_card.access += J.get_access();
	this.prev_access = this.access_card.access;
	if (this.lasercolor) {
		this.shot_delay = 6;
		this.check_records = 0;
		this.arrest_type = 1;
		this.bot_core.req_access = list(12, 46);
		this.arrest_type = 1;
		if (this.lasercolor == "b" && this.name == "ÿ\u0016ED-209 Security Robot") {
			this.name = pick("BLUE BALLER", "SANIC", "BLUE KILLDEATH MURDERBOT");
		}
		if (this.lasercolor == "r" && this.name == "ÿ\u0016ED-209 Security Robot") {
			this.name = pick("RED RAMPAGE", "RED ROVER", "RED KILLDEATH MURDERBOT");
		}
	}
	return null;
});

// ed209bot.dm:74
rt.def("/mob/living/simple_animal/bot/ed209/proc/turn_on", function turn_on(f: Frame) {
	f.dot = parent_proc();
	this.icon_state = `${this.lasercolor}ed209${this.on}`;
	this.mode = BOT_IDLE;
	return f.dot;
});

// ed209bot.dm:79
rt.def("/mob/living/simple_animal/bot/ed209/proc/turn_off", function turn_off(f: Frame) {
	parent_proc();
	this.icon_state = `${this.lasercolor}ed209${this.on}`;
	return f.dot;
});

// ed209bot.dm:83
rt.def("/mob/living/simple_animal/bot/ed209/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.target = null;
	this.oldtarget_name = null;
	this.anchored = 0;
	walk_to(this, 0);
	this.last_found = rt.worldTime(f);
	this.set_weapon();
	return f.dot;
});

// ed209bot.dm:92
rt.def("/mob/living/simple_animal/bot/ed209/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You disable ${this.name}'s combat inhibitor.`;
	this.text_dehack = `You restore ${this.name}'s combat inhibitor.`;
	this.text_dehack_fail = `${this.name} ignores your attempts to restrict him!`;
	return f.dot;
});

// ed209bot.dm:98
rt.def("/mob/living/simple_animal/bot/ed209/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $1: any, $2: any, $3: any, $4: any, $5: any, $6: any;
	dat += this.hack(user);
	dat += this.showpai(user);
	let $0: any = this;
	if (this.on) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	$0 = fmt("<A href='?src=＃;power=1'>＀</A>", [$0, $1]);
	if (this.locked) {
		$1 = "locked";
	} else {
		$1 = "unlocked";
	}
	if (this.open) {
		$2 = "opened";
	} else {
		$2 = "closed";
	}
	dat += `\n<TT><B>Security Unit v2.6 controls</B></TT><BR><BR>\nStatus: ${$0}<BR>\nBehaviour controls are ${$1}<BR>\nMaintenance panel panel is ${$2}<BR>`;
	if (!this.locked || rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
		if (!this.lasercolor) {
			$0 = this;
			$0 = fmt("<A href='?src=＃;operation=idcheck'>＀</A>", [$0, this.idcheck ? "Yes" : "No"]);
			$1 = this;
			$1 = fmt("<A href='?src=＃;operation=weaponscheck'>＀</A>", [$1, this.weaponscheck ? "Yes" : "No"]);
			$2 = this;
			$2 = fmt("<A href='?src=＃;operation=ignorerec'>＀</A>", [$2, this.check_records ? "Yes" : "No"]);
			$3 = this;
			$3 = fmt("<A href='?src=＃;operation=switchmode'>＀</A>", [$3, this.arrest_type ? "Detain" : "Arrest"]);
			$4 = this;
			$4 = fmt("<A href='?src=＃;operation=declarearrests'>＀</A>", [$4, this.declare_arrests ? "Yes" : "No"]);
			$5 = this;
			if (this.auto_patrol) {
				$6 = "On";
			} else {
				$6 = "Off";
			}
			dat += `<BR>\nArrest Unidentifiable Persons: ${$0}<BR>\nArrest for Unauthorized Weapons: ${$1}<BR>\nArrest for Warrant: ${$2}<BR>\n<BR>\nOperating Mode: ${$3}<BR>\nReport Arrests${$4}<BR>\nAuto Patrol${fmt("<A href='?src=＃;operation=patrol'>＀</A>", [$5, $6])}`;
		}
	}
	return dat;
});

// ed209bot.dm:129
rt.def("/mob/living/simple_animal/bot/ed209/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let H: Value = null;
	if (this.lasercolor && rt.istype(f.usr, T("/mob/living/carbon/human"))) {
		H = f.usr;
		if (this.lasercolor == "b" && rt.istype(H.wear_suit, T("/obj/item/clothing/suit/redtag"))) {
			return f.dot;
		} else if (this.lasercolor == "r" && rt.istype(H.wear_suit, T("/obj/item/clothing/suit/bluetag"))) {
			return f.dot;
		}
	}
	if (yield* parent_proc()) {
		return 1;
	}
	const item = rt.at(href_list, "operation");
	if (item === "idcheck") {
		this.idcheck = (!this.idcheck ? 1 : 0);
		yield* this.update_controls();
	} else if (item === "weaponscheck") {
		this.weaponscheck = (!this.weaponscheck ? 1 : 0);
		yield* this.update_controls();
	} else if (item === "ignorerec") {
		this.check_records = (!this.check_records ? 1 : 0);
		yield* this.update_controls();
	} else if (item === "switchmode") {
		this.arrest_type = (!this.arrest_type ? 1 : 0);
		yield* this.update_controls();
	} else if (item === "declarearrests") {
		this.declare_arrests = (!this.declare_arrests ? 1 : 0);
		yield* this.update_controls();
	}
	return f.dot;
}, true);

// ed209bot.dm:158
rt.def("/mob/living/simple_animal/bot/ed209/proc/judgement_criteria", function judgement_criteria(f: Frame) {
	let final: Value = 0;
	if (this.idcheck) {
		final = rt.bitOr(final, JUDGE_IDCHECK);
	}
	if (this.check_records) {
		final = rt.bitOr(final, 8);
	}
	if (this.weaponscheck) {
		final = rt.bitOr(final, 4);
	}
	if (this.emagged) {
		final = rt.bitOr(final, 1);
	}
	return (final = rt.bitOr(final, 16));
});

// ed209bot.dm:170
rt.def("/mob/living/simple_animal/bot/ed209/proc/retaliate", function* retaliate(f: Frame, H: Value) {
	let judgement_criteria: Value = this.judgement_criteria();
	this.threatlevel = (yield* H.assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons"))) }));
	if (!((this.threatlevel += 6) >= 4)) return f.dot;
	this.target = H;
	this.mode = BOT_HUNT;
	return f.dot;
}, true);

// ed209bot.dm:178
rt.def("/mob/living/simple_animal/bot/ed209/proc/attack_hand", function* attack_hand(f: Frame, H: Value) {
	if (H.a_intent == "harm") {
		yield* this.retaliate(H);
	}
	return (yield* parent_proc());
}, true);

// ed209bot.dm:183
rt.def("/mob/living/simple_animal/bot/ed209/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		return f.dot;
	}
	if (!(!rt.istype(W, T("/obj/item/weapon/screwdriver")) && !this.target)) return f.dot;
	if (!(W.force && W.damtype != "stamina")) return f.dot;
	yield* this.retaliate(user);
	if (!this.lasercolor) return f.dot;
	yield* this.shootAt(user);
	return f.dot;
}, true);

// ed209bot.dm:193
rt.def("/mob/living/simple_animal/bot/ed209/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.emagged != 2) return f.dot;
	if (user) {
		to_chat(user, `<span class='warning'>You short out ${this}'s target assessment circuits.</span>`);
		this.oldtarget_name = user.name;
	}
	this.audible_message(`<span class='danger'>${this} buzzes oddly!</span>`);
	this.declare_arrests = 0;
	this.icon_state = `${this.lasercolor}ed209${this.on}`;
	this.set_weapon();
	return f.dot;
}, true);

// ed209bot.dm:204
rt.def("/mob/living/simple_animal/bot/ed209/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (rt.istype(Proj, T("/obj/item/projectile/beam/laser")) || rt.istype(Proj, T("/obj/item/projectile/bullet"))) {
		if (Proj.damage_type == "fire" || Proj.damage_type == "brute") {
			if (!Proj.nodamage && Proj.damage < this.health) {
				yield* this.retaliate(Proj.firer);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ed209bot.dm:211
rt.def("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let C: Value = null, threatlevel: Value = null, dst: Value = null, t: Value = null, olddist: Value = null;
	let $e: any;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.disabled) {
		return f.dot;
	}
	let judgement_criteria: Value = this.judgement_criteria();
	let targets: Value = list();
	for (C of each(view(7, this), T("/mob/living/carbon"))) {
		threatlevel = 0;
		if (C.stat || C.lying) {
			continue;
		}
		if ((threatlevel = (yield* C.assess_threat(judgement_criteria, this.lasercolor, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons"))) }))) < 4) {
			continue;
		}
		if ((dst = get_dist(this, C)) <= 1 || dst > 7) {
			continue;
		}
		targets += C;
	}
	if (rt.len(f, targets) > 0) {
		if ((t = pick(targets)).stat != 2 && t.lying != 1 && !t.handcuffed) {
			yield* this.shootAt(t);
		}
	}
	if (this.mode === BOT_IDLE) {
		walk_to(this, 0);
		if (!this.lasercolor) {
			yield* this.look_for_perp();
		}
		if (!this.mode && this.auto_patrol) {
			this.mode = BOT_START_PATROL;
		}
	} else if (this.mode === BOT_HUNT) {
		if (this.frustration >= 8) {
			walk_to(this, 0);
			yield* this.back_to_idle();
		}
		if (this.target) {
			if (this.Adjacent(this.target) && isturf(this.target.loc)) {
				yield* this.stun_attack(this.target);
				this.mode = BOT_PREP_ARREST;
				this.anchored = 1;
				this.target_lastloc = this.target.loc;
				return f.dot;
			} else {
				olddist = get_dist(this, this.target);
				walk_to(this, this.target, 1, 4);
				if (get_dist(this, this.target) >= olddist) {
					this.frustration++;
				} else {
					this.frustration = 0;
				}
			}
		} else {
			yield* this.back_to_idle();
		}
	} else if (this.mode === BOT_PREP_ARREST) {
		if (!this.Adjacent(this.target) || !isturf(this.target.loc) || this.target.AmountKnockdown() < 40) {
			this.back_to_hunt();
			return f.dot;
		}
		if (rt.istype(this.target, T("/mob/living/carbon")) && this.target.canBeHandcuffed()) {
			if (!this.arrest_type) {
				if (!this.target.handcuffed) {
					this.cuff(this.target);
				} else {
					yield* this.back_to_idle();
					return f.dot;
				}
			}
		} else {
			yield* this.back_to_idle();
			return f.dot;
		}
	} else if (this.mode === BOT_ARREST) {
		if (!this.target) {
			this.anchored = 0;
			this.mode = BOT_IDLE;
			this.last_found = rt.worldTime(f);
			this.frustration = 0;
			return f.dot;
		}
		if (this.target.handcuffed) {
			yield* this.back_to_idle();
			return f.dot;
		}
		if (!this.Adjacent(this.target) || !isturf(this.target.loc) || this.target.loc != this.target_lastloc && this.target.AmountKnockdown() < 40) {
			this.back_to_hunt();
			return f.dot;
		} else {
			this.mode = BOT_PREP_ARREST;
			this.anchored = 0;
		}
	} else if (this.mode === BOT_START_PATROL) {
		yield* this.look_for_perp();
		yield* this.start_patrol();
	} else if (this.mode === BOT_PATROL) {
		yield* this.look_for_perp();
		yield* this.bot_patrol();
	}
	return f.dot;
}, true, { waitfor: false });

// ed209bot.dm:325
rt.def("/mob/living/simple_animal/bot/ed209/proc/back_to_idle", function back_to_idle(f: Frame) {
	this.anchored = 0;
	this.mode = BOT_IDLE;
	this.target = null;
	this.last_found = rt.worldTime(f);
	this.frustration = 0;
	ImmediateInvokeAsync(this, P("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action"));
	return f.dot;
});

// ed209bot.dm:331
rt.def("/mob/living/simple_animal/bot/ed209/proc/back_to_hunt", function back_to_hunt(f: Frame) {
	this.anchored = 0;
	this.frustration = 0;
	this.mode = BOT_HUNT;
	ImmediateInvokeAsync(this, P("/mob/living/simple_animal/bot/ed209/proc/handle_automated_action"));
	return f.dot;
});

// ed209bot.dm:340
rt.def("/mob/living/simple_animal/bot/ed209/proc/look_for_perp", function* look_for_perp(f: Frame) {
	let C: Value = null;
	if (this.disabled) {
		return f.dot;
	}
	this.anchored = 0;
	this.threatlevel = 0;
	let judgement_criteria: Value = this.judgement_criteria();
	for (C of each(view(7, this), T("/mob/living/carbon"))) {
		if (C.stat || C.handcuffed) {
			continue;
		}
		if (C.name == this.oldtarget_name && rt.worldTime(f) < this.last_found + 100) {
			continue;
		}
		this.threatlevel = (yield* C.assess_threat(judgement_criteria, this.lasercolor, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons"))) }));
		if (!this.threatlevel) {
			continue;
		}
		if (this.threatlevel >= 4) {
			this.target = C;
			this.oldtarget_name = C.name;
			yield* this.speak(`Level ${this.threatlevel} infraction alert!`);
			playsound(this.loc, pick(rt.rsc("sound/voice/ed209_20sec.ogg"), rt.rsc("sound/voice/edplaceholder.ogg")), 50, 0);
			this.visible_message(`<b>${this}</b> points at ${C.name}!`);
			this.mode = BOT_HUNT;
			rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/ed209/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:360", judgement_criteria, C);
			break;
		}
		continue;
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/ed209/proc/look_for_perp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:360", function* (f: Frame, judgement_criteria: Value, C: Value) {
	yield* this.handle_automated_action();
	return null;
});

// ed209bot.dm:367
rt.def("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons", function check_for_weapons(f: Frame, slot_item: Value) {
	if (slot_item && slot_item.needs_permit) {
		return 1;
	}
	return 0;
}, false, { argTypes: [{ type: 4, path: "/obj/item" }] });

// ed209bot.dm:372
rt.def("/mob/living/simple_animal/bot/ed209/proc/explode", function* explode(f: Frame) {
	let Sa: Value = null, G: Value = null;
	walk_to(this, 0);
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	let Tsec: Value = rt.getStep(f, this, 0);
	(Sa = (yield* new_(T("/obj/item/weapon/ed209_assembly"), Tsec))).build_step = 1;
	Sa.add_overlay("hs_hole");
	Sa.created_name = this.name;
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), Tsec);
	if (!this.lasercolor) {
		(G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun/advtaser"), Tsec))).cell.charge = 0;
		yield* G.update_icon();
	} else if (this.lasercolor == "b") {
		(G = (yield* new_(T("/obj/item/weapon/gun/energy/laser/bluetag"), Tsec))).cell.charge = 0;
		yield* G.update_icon();
	} else if (this.lasercolor == "r") {
		(G = (yield* new_(T("/obj/item/weapon/gun/energy/laser/redtag"), Tsec))).cell.charge = 0;
		yield* G.update_icon();
	}
	if (prob(50)) {
		yield* new_(T("/obj/item/bodypart/l_leg/robot"), Tsec);
		if (prob(25)) {
			yield* new_(T("/obj/item/bodypart/r_leg/robot"), Tsec);
		}
	}
	if (prob(25)) {
		if (prob(50)) {
			yield* new_(T("/obj/item/clothing/head/helmet"), Tsec);
		} else {
			if (!this.lasercolor) {
				yield* new_(T("/obj/item/clothing/suit/armor/vest"), Tsec);
			}
			if (this.lasercolor == "b") {
				yield* new_(T("/obj/item/clothing/suit/bluetag"), Tsec);
			}
			if (this.lasercolor == "r") {
				yield* new_(T("/obj/item/clothing/suit/redtag"), Tsec);
			}
		}
	}
	yield* do_sparks(3, 1, this);
	yield* new_(T("/obj/effect/decal/cleanable/oil"), this.loc);
	yield* parent_proc();
	return f.dot;
}, true);

// ed209bot.dm:416
rt.def("/mob/living/simple_animal/bot/ed209/proc/set_weapon", function set_weapon(f: Frame) {
	this.shoot_sound = rt.rsc("sound/weapons/laser.ogg");
	if (this.emagged == 2) {
		if (this.lasercolor) {
			this.projectile = T("/obj/item/projectile/beam/lasertag");
		} else {
			this.projectile = T("/obj/item/projectile/beam");
		}
	} else if (!this.lasercolor) {
		this.shoot_sound = rt.rsc("sound/weapons/taser.ogg");
		this.projectile = T("/obj/item/projectile/energy/electrode");
	} else if (this.lasercolor == "b") {
		this.projectile = T("/obj/item/projectile/beam/lasertag/bluetag");
	} else {
		if (this.lasercolor != "r") return f.dot;
		this.projectile = T("/obj/item/projectile/beam/lasertag/redtag");
	}
	return f.dot;
});

// ed209bot.dm:432
rt.def("/mob/living/simple_animal/bot/ed209/proc/shootAt", function* shootAt(f: Frame, target: Value) {
	let U: Value = null;
	if (this.lastfired && rt.worldTime(f) - this.lastfired < this.shot_delay) {
		return f.dot;
	}
	this.lastfired = rt.worldTime(f);
	let _T: Value = this.loc;
	if (!(U = rt.getStep(f, target, 0))) {
		return f.dot;
	}
	if (!isturf(_T)) {
		return f.dot;
	}
	if (!this.projectile) {
		return f.dot;
	}
	let A: Value = (yield* new_(this.projectile, this.loc));
	playsound(this.loc, this.shoot_sound, 50, 1);
	A.current = U;
	A.yo = U.y - _T.y;
	A.xo = U.x - _T.x;
	yield* A.fire();
	return f.dot;
}, true);

// ed209bot.dm:453
rt.def("/mob/living/simple_animal/bot/ed209/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* parent_proc();
	if (rt.istype(this.target, T("/mob/living/carbon/alien"))) return f.dot;
	this.target = user;
	this.mode = BOT_HUNT;
	return f.dot;
}, true);

// ed209bot.dm:461
rt.def("/mob/living/simple_animal/bot/ed209/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let targets: Value = null, C: Value = null, toshoot: Value = null, toarrest: Value = null;
	if (severity == 2 && prob(70)) {
		yield* parent_proc(severity - 1);
	} else {
		yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
		targets = (yield* new_(T("/list")));
		for (C of each(view(12, this), T("/mob/living/carbon"))) {
			if (C.stat == 2) {
				continue;
			}
			targets += C;
		}
		if (!rt.len(f, targets)) return f.dot;
		if (prob(50)) {
			if (toshoot = pick(targets)) {
				targets -= toshoot;
				if (prob(50) && this.emagged < 2) {
					this.emagged = 2;
					this.set_weapon();
					yield* this.shootAt(toshoot);
					this.emagged = 0;
					this.set_weapon();
				} else {
					yield* this.shootAt(toshoot);
				}
			}
		} else {
			if (!prob(50)) return f.dot;
			if (!rt.len(f, targets)) return f.dot;
			if (!(toarrest = pick(targets))) return f.dot;
			this.target = toarrest;
			this.mode = BOT_HUNT;
		}
	}
	return f.dot;
}, true);

// ed209bot.dm:492
rt.def("/mob/living/simple_animal/bot/ed209/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let lasertag_check: Value = null;
	if (!this.disabled) {
		lasertag_check = 0;
		if (this.lasercolor == "b") {
			if (rt.istype(Proj, T("/obj/item/projectile/beam/lasertag/redtag"))) {
				lasertag_check++;
			}
		} else if (this.lasercolor == "r") {
			if (rt.istype(Proj, T("/obj/item/projectile/beam/lasertag/bluetag"))) {
				lasertag_check++;
			}
		}
		if (lasertag_check) {
			this.icon_state = `${this.lasercolor}ed2090`;
			this.disabled = 1;
			this.target = null;
			rt.spawnTail(f, 100, "/mob/living/simple_animal/bot/ed209/proc/bullet_act: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:504", Proj, lasertag_check);
			return 1;
		} else {
			yield* parent_proc(Proj);
		}
	} else {
		yield* parent_proc(Proj);
	}
	return f.dot;
}, true);

// a spawn(100) body of /mob/living/simple_animal/bot/ed209/proc/bullet_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/bullet_act: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:504", function* (f: Frame, Proj: Value, lasertag_check: Value) {
	this.disabled = 0;
	this.icon_state = `${this.lasercolor}ed2091`;
	return null;
});

// ed209bot.dm:520
rt.def("/mob/living/simple_animal/bot/ed209/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	let C: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (rt.istype(A, T("/mob/living/carbon"))) {
		if (!(C = A).IsStun() || this.arrest_type) {
			yield* this.stun_attack(A);
		} else if (C.canBeHandcuffed() && !C.handcuffed) {
			this.cuff(A);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// ed209bot.dm:532
rt.def("/mob/living/simple_animal/bot/ed209/proc/RangedAttack", function* RangedAttack(f: Frame, A: Value) {
	if (!this.on) {
		return f.dot;
	}
	yield* this.shootAt(A);
	return f.dot;
}, true);

// ed209bot.dm:537
rt.def("/mob/living/simple_animal/bot/ed209/proc/stun_attack", function* stun_attack(f: Frame, C: Value) {
	let threat: Value = null, H: Value = null, judgement_criteria: Value = null, location: Value = null;
	let $0: any;
	playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
	this.icon_state = `${this.lasercolor}ed209-c`;
	rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/ed209/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:539", C, threat, H, judgement_criteria, location);
	threat = 5;
	yield* C.Knockdown(100);
	C.stuttering = 5;
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		H = C;
		judgement_criteria = this.judgement_criteria();
		threat = (yield* H.assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/ed209/proc/check_for_weapons"))) }));
	}
	add_logs(this, C, "stunned");
	if (this.declare_arrests) {
		location = get_area(this);
		if (this.arrest_type) {
			$0 = "Detaining";
		} else {
			$0 = "Arresting";
		}
		yield* this.speak(`${$0} level ${threat} scumbag <b>${C}</b> in ${location}.`, this.radio_channel);
	}
	C.visible_message(`<span class='danger'>${this} has stunned ${C}!</span>`, `<span class='userdanger'>${this} has stunned you!</span>`);
	return f.dot;
}, true);

// a spawn(2) body of /mob/living/simple_animal/bot/ed209/proc/stun_attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:539", function* (f: Frame, C: Value, threat: Value, H: Value, judgement_criteria: Value, location: Value) {
	this.icon_state = `${this.lasercolor}ed209${this.on}`;
	return null;
});

// ed209bot.dm:557
rt.def("/mob/living/simple_animal/bot/ed209/proc/cuff", function cuff(f: Frame, C: Value) {
	this.mode = BOT_ARREST;
	playsound(this.loc, rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2);
	C.visible_message(`<span class='danger'>${this} is trying to put zipties on ${C}!</span>`, `<span class='userdanger'>${this} is trying to put zipties on you!</span>`);
	rt.spawnTail(f, 60, "/mob/living/simple_animal/bot/ed209/proc/cuff: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:561", C);
	return f.dot;
});

// a spawn(60) body of /mob/living/simple_animal/bot/ed209/proc/cuff, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/ed209/proc/cuff: spawn at modules/mob/living/simple_animal/bot/ed209bot.dm:561", function* (f: Frame, C: Value) {
	if (!this.Adjacent(C) || !isturf(C.loc)) {
		return f.dot;
	}
	if (!C.handcuffed) {
		C.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), C));
		yield* C.update_handcuffed();
		yield* this.back_to_idle();
	}
	return null;
});
