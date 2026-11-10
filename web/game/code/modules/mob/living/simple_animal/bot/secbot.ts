// Based on /tg/station's code/modules/mob/living/simple_animal/bot/secbot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5042, "/mob/living/simple_animal/bot/secbot", "/mob/living/simple_animal/bot", {
	target: null,
	oldtarget_name: null,
	threatlevel: 0,
	target_lastloc: null,
	last_found: null,
	declare_arrests: 1,
	idcheck: 0,
	weaponscheck: 0,
	check_records: 1,
	arrest_type: 0,
	baton_type: rt.typePath("/obj/item/weapon/melee/baton"),
	anchored: 0,
	pass_flags: 16,
	radio_channel: "Security",
	bot_type: 1,
	model: "Securitron",
	window_id: "autosec",
	window_name: "Automatic Security Unit v1.6",
	allow_pai: 0,
	data_hud_type: 2,
	name: "１Securitron",
	desc: "A little security robot.  He looks less than thrilled.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "secbot0",
	density: 0,
	health: 25,
	maxHealth: 25,
	damage_coeff: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/secbot"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/secbot"),
});

// secbot.dm:10
rt.def("/mob/living/simple_animal/bot/secbot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.5, "fire", 0.7, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	return f.dot;
});

rt.type(5044, "/mob/living/simple_animal/bot/secbot/beepsky/jr", "/mob/living/simple_animal/bot/secbot/beepsky", {
	name: "Officer Pipsqueak",
	desc: "It's Officer Beep O'sky's smaller, just-as aggressive cousin, Pipsqueak.",
});

// secbot.dm:47
rt.def("/mob/living/simple_animal/bot/secbot/beepsky/jr/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.resize = 0.8;
	yield* this.update_transform();
	return f.dot;
}, true);

rt.type(5043, "/mob/living/simple_animal/bot/secbot/beepsky", "/mob/living/simple_animal/bot/secbot", {
	idcheck: 0,
	weaponscheck: 0,
	auto_patrol: 1,
	name: "Officer Beep O'sky",
	desc: "It's Officer Beep O'sky! Powered by a potato and a shot of whiskey.",
});

// secbot.dm:53
rt.def("/mob/living/simple_animal/bot/secbot/beepsky/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null, S: Value = null;
	yield* new_(T("/obj/item/weapon/stock_parts/cell/potato"), (Tsec = rt.getStep(f, this, 0)));
	yield* (S = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass/shotglass"), Tsec))).reagents.add_reagent("whiskey", 15);
	S.on_reagent_change();
	yield* parent_proc();
	return f.dot;
}, true);

// secbot.dm:66
rt.def("/mob/living/simple_animal/bot/secbot/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null, secsensor: Value = null;
	yield* parent_proc();
	this.icon_state = `secbot${this.on}`;
	rt.spawnTail(f, 3, "/mob/living/simple_animal/bot/secbot/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/secbot.dm:68", J, secsensor);
	(secsensor = rt.index(GLOB.huds, DATA_HUD_SECURITY_ADVANCED)).add_hud_to(this);
	return f.dot;
}, true);

// a spawn(3) body of /mob/living/simple_animal/bot/secbot/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/Initialize: spawn at modules/mob/living/simple_animal/bot/secbot.dm:68", function* (f: Frame, J: Value, secsensor: Value) {
	J = (yield* new_(T("/datum/job/detective")));
	this.access_card.access += J.get_access();
	this.prev_access = this.access_card.access;
	return null;
});

// secbot.dm:78
rt.def("/mob/living/simple_animal/bot/secbot/proc/turn_on", function turn_on(f: Frame) {
	parent_proc();
	this.icon_state = `secbot${this.on}`;
	return f.dot;
});

// secbot.dm:82
rt.def("/mob/living/simple_animal/bot/secbot/proc/turn_off", function turn_off(f: Frame) {
	parent_proc();
	this.icon_state = `secbot${this.on}`;
	return f.dot;
});

// secbot.dm:86
rt.def("/mob/living/simple_animal/bot/secbot/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.target = null;
	this.oldtarget_name = null;
	this.anchored = 0;
	walk_to(this, 0);
	this.last_found = rt.worldTime(f);
	return f.dot;
});

// secbot.dm:95
rt.def("/mob/living/simple_animal/bot/secbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You overload ${this.name}'s target identification system.`;
	this.text_dehack = `You reboot ${this.name} and restore the target identification.`;
	this.text_dehack_fail = `${this.name} refuses to accept your authority!`;
	return f.dot;
});

// secbot.dm:101
rt.def("/mob/living/simple_animal/bot/secbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
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
	dat += `\n<TT><B>Securitron v1.6 controls</B></TT><BR><BR>\nStatus: ${$0}<BR>\nBehaviour controls are ${$1}<BR>\nMaintenance panel panel is ${$2}`;
	if (!this.locked || rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
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
		dat += `<BR>\nArrest Unidentifiable Persons: ${$0}<BR>\nArrest for Unauthorized Weapons: ${$1}<BR>\nArrest for Warrant: ${$2}<BR>\nOperating Mode: ${$3}<BR>\nReport Arrests${$4}<BR>\nAuto Patrol: ${fmt("<A href='?src=＃;operation=patrol'>＀</A>", [$5, $6])}`;
	}
	return dat;
});

// secbot.dm:130
rt.def("/mob/living/simple_animal/bot/secbot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
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

// secbot.dm:151
rt.def("/mob/living/simple_animal/bot/secbot/proc/retaliate", function* retaliate(f: Frame, H: Value) {
	let judgement_criteria: Value = this.judgement_criteria();
	this.threatlevel = (yield* H.assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons"))) }));
	if (!((this.threatlevel += 6) >= 4)) return f.dot;
	this.target = H;
	this.mode = BOT_HUNT;
	return f.dot;
}, true);

// secbot.dm:161
rt.def("/mob/living/simple_animal/bot/secbot/proc/judgement_criteria", function judgement_criteria(f: Frame) {
	let final: Value = 0;
	if (this.idcheck) {
		final = rt.bitOr(final, DATA_HUD_SECURITY_ADVANCED);
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
	return final;
});

// secbot.dm:171
rt.def("/mob/living/simple_animal/bot/secbot/proc/attack_hand", function* attack_hand(f: Frame, H: Value) {
	if (H.a_intent == "harm" || H.a_intent == "disarm") {
		yield* this.retaliate(H);
	}
	return (yield* parent_proc());
}, true);

// secbot.dm:177
rt.def("/mob/living/simple_animal/bot/secbot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		return f.dot;
	}
	if (!(!rt.istype(W, T("/obj/item/weapon/screwdriver")) && W.force && !this.target && W.damtype != "stamina")) return f.dot;
	yield* this.retaliate(user);
	return f.dot;
}, true);

// secbot.dm:184
rt.def("/mob/living/simple_animal/bot/secbot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.emagged != 2) return f.dot;
	if (user) {
		to_chat(user, `<span class='danger'>You short out ${this}'s target assessment circuits.</span>`);
		this.oldtarget_name = user.name;
	}
	this.audible_message(`<span class='danger'>${this} buzzes oddly!</span>`);
	this.declare_arrests = 0;
	this.icon_state = `secbot${this.on}`;
	return f.dot;
}, true);

// secbot.dm:194
rt.def("/mob/living/simple_animal/bot/secbot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (rt.istype(Proj, T("/obj/item/projectile/beam")) || rt.istype(Proj, T("/obj/item/projectile/bullet"))) {
		if (Proj.damage_type == "fire" || Proj.damage_type == "brute") {
			if (!Proj.nodamage && Proj.damage < this.health) {
				yield* this.retaliate(Proj.firer);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// secbot.dm:202
rt.def("/mob/living/simple_animal/bot/secbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
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

// secbot.dm:215
rt.def("/mob/living/simple_animal/bot/secbot/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, H: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/item"))) {
		if ((I = f.args[0]).throwforce < this.health && I.thrownby && rt.istype(I.thrownby, T("/mob/living/carbon/human"))) {
			yield* this.retaliate((H = I.thrownby));
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// secbot.dm:225
rt.def("/mob/living/simple_animal/bot/secbot/proc/cuff", function cuff(f: Frame, C: Value) {
	this.mode = BOT_ARREST;
	playsound(this.loc, rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2);
	C.visible_message(`<span class='danger'>${this} is trying to put zipties on ${C}!</span>`, `<span class='userdanger'>${this} is trying to put zipties on you!</span>`);
	rt.spawnTail(f, 60, "/mob/living/simple_animal/bot/secbot/proc/cuff: spawn at modules/mob/living/simple_animal/bot/secbot.dm:228", C);
	return f.dot;
});

// a spawn(60) body of /mob/living/simple_animal/bot/secbot/proc/cuff, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/cuff: spawn at modules/mob/living/simple_animal/bot/secbot.dm:228", function* (f: Frame, C: Value) {
	if (!this.Adjacent(C) || !isturf(C.loc)) {
		return f.dot;
	}
	if (!C.handcuffed) {
		C.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/cable/zipties/used"), C));
		yield* C.update_handcuffed();
		playsound(this.loc, pick(rt.rsc("sound/voice/bgod.ogg"), rt.rsc("sound/voice/biamthelaw.ogg"), rt.rsc("sound/voice/bsecureday.ogg"), rt.rsc("sound/voice/bradio.ogg"), rt.rsc("sound/voice/binsult.ogg"), rt.rsc("sound/voice/bcreep.ogg")), 50, 0);
		yield* this.back_to_idle();
	}
	return null;
});

// secbot.dm:238
rt.def("/mob/living/simple_animal/bot/secbot/proc/stun_attack", function* stun_attack(f: Frame, C: Value) {
	let threat: Value = null, H: Value = null, location: Value = null;
	let $0: any;
	let judgement_criteria: Value = this.judgement_criteria();
	playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
	this.icon_state = "secbot-c";
	rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/secbot/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/secbot.dm:241", C, judgement_criteria, threat, H, location);
	threat = 5;
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		C.stuttering = 5;
		yield* C.Knockdown(100);
		threat = (yield* (H = C).assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons"))) }));
	} else {
		yield* C.Knockdown(100);
		C.stuttering = 5;
		threat = (yield* C.assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons"))) }));
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

// a spawn(2) body of /mob/living/simple_animal/bot/secbot/proc/stun_attack, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/stun_attack: spawn at modules/mob/living/simple_animal/bot/secbot.dm:241", function* (f: Frame, C: Value, judgement_criteria: Value, threat: Value, H: Value, location: Value) {
	this.icon_state = `secbot${this.on}`;
	return null;
});

// secbot.dm:262
rt.def("/mob/living/simple_animal/bot/secbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let olddist: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.mode === BOT_IDLE) {
		walk_to(this, 0);
		yield* this.look_for_perp();
		if (!this.mode && this.auto_patrol) {
			this.mode = BOT_START_PATROL;
		}
	} else if (this.mode === BOT_HUNT) {
		if (this.frustration >= 8) {
			walk_to(this, 0);
			yield* this.back_to_idle();
			return f.dot;
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

// secbot.dm:355
rt.def("/mob/living/simple_animal/bot/secbot/proc/back_to_idle", function back_to_idle(f: Frame) {
	this.anchored = 0;
	this.mode = BOT_IDLE;
	this.target = null;
	this.last_found = rt.worldTime(f);
	this.frustration = 0;
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/back_to_idle: spawn at modules/mob/living/simple_animal/bot/secbot.dm:355");
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/back_to_idle, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/back_to_idle: spawn at modules/mob/living/simple_animal/bot/secbot.dm:355", function* (f: Frame) {
	yield* this.handle_automated_action();
	return null;
});

// secbot.dm:362
rt.def("/mob/living/simple_animal/bot/secbot/proc/back_to_hunt", function back_to_hunt(f: Frame) {
	this.anchored = 0;
	this.frustration = 0;
	this.mode = BOT_HUNT;
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/back_to_hunt: spawn at modules/mob/living/simple_animal/bot/secbot.dm:362");
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/back_to_hunt, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/back_to_hunt: spawn at modules/mob/living/simple_animal/bot/secbot.dm:362", function* (f: Frame) {
	yield* this.handle_automated_action();
	return null;
});

// secbot.dm:368
rt.def("/mob/living/simple_animal/bot/secbot/proc/look_for_perp", function* look_for_perp(f: Frame) {
	let C: Value = null;
	this.anchored = 0;
	let judgement_criteria: Value = this.judgement_criteria();
	for (C of each(view(7, this), T("/mob/living/carbon"))) {
		if (C.stat || C.handcuffed) {
			continue;
		}
		if (C.name == this.oldtarget_name && rt.worldTime(f) < this.last_found + 100) {
			continue;
		}
		this.threatlevel = (yield* C.assess_threat(judgement_criteria, { weaponcheck: (yield* new_(T("/datum/callback"), this, P("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons"))) }));
		if (!this.threatlevel) {
			continue;
		}
		if (this.threatlevel >= 4) {
			this.target = C;
			this.oldtarget_name = C.name;
			yield* this.speak(`Level ${this.threatlevel} infraction alert!`);
			playsound(this.loc, pick(rt.rsc("sound/voice/bcriminal.ogg"), rt.rsc("sound/voice/bjustice.ogg"), rt.rsc("sound/voice/bfreeze.ogg")), 50, 0);
			this.visible_message(`<b>${this}</b> points at ${C.name}!`);
			this.mode = BOT_HUNT;
			rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/secbot/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/secbot.dm:388", judgement_criteria, C);
			break;
		}
		continue;
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/secbot/proc/look_for_perp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/secbot/proc/look_for_perp: spawn at modules/mob/living/simple_animal/bot/secbot.dm:388", function* (f: Frame, judgement_criteria: Value, C: Value) {
	yield* this.handle_automated_action();
	return null;
});

// secbot.dm:394
rt.def("/mob/living/simple_animal/bot/secbot/proc/check_for_weapons", function check_for_weapons(f: Frame, slot_item: Value) {
	if (slot_item && slot_item.needs_permit) {
		return 1;
	}
	return 0;
}, false, { argTypes: [{ type: 4, path: "/obj/item" }] });

// secbot.dm:400
rt.def("/mob/living/simple_animal/bot/secbot/proc/explode", function* explode(f: Frame) {
	let Sa: Value = null;
	walk_to(this, 0);
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	let Tsec: Value = rt.getStep(f, this, 0);
	(Sa = (yield* new_(T("/obj/item/weapon/secbot_assembly"), Tsec))).build_step = 1;
	Sa.add_overlay("hs_hole");
	Sa.created_name = this.name;
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), Tsec);
	yield* new_(this.baton_type, Tsec);
	if (prob(50)) {
		yield* new_(T("/obj/item/bodypart/l_arm/robot"), Tsec);
	}
	yield* do_sparks(3, 1, this);
	yield* new_(T("/obj/effect/decal/cleanable/oil"), this.loc);
	yield* parent_proc();
	return f.dot;
}, true);

// secbot.dm:420
rt.def("/mob/living/simple_animal/bot/secbot/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* parent_proc();
	if (rt.istype(this.target, T("/mob/living/carbon/alien"))) return f.dot;
	this.target = user;
	this.mode = BOT_HUNT;
	return f.dot;
}, true);

// secbot.dm:426
rt.def("/mob/living/simple_animal/bot/secbot/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let C: Value = null;
	if (ismob(AM) && this.target) {
		if (!rt.istype((C = AM), T("/mob/living/carbon")) || !C || get_dist(this, this.target) <= 1) {
			return f.dot;
		}
		yield* this.knockOver(C);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10946, "/obj/machinery/bot_core/secbot", "/obj/machinery/bot_core", {
	req_access: null,
});

// secbot.dm:435
rt.def("/obj/machinery/bot_core/secbot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(1);
	return f.dot;
});
