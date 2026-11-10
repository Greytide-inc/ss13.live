// Based on /tg/station's code/modules/mob/living/silicon/robot/robot_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// robot_defense.dm:4
rt.def("/mob/living/silicon/robot/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value, def_zone: Value) {
	if (this.hat_offset != 1e+31 && user.a_intent == "help" && is_type_in_typecache(I, this.equippable_hats)) {
		to_chat(user, `<span class='notice'>You begin to place ${I} on ${this}'s head...</span>`);
		to_chat(this, `<span class='notice'>${user} is placing ${I} on your head...</span>`);
		if (yield* do_after(user, 30, { target: this })) {
			yield* user.temporarilyRemoveItemFromInventory(I, 1);
			yield* this.place_on_head(I);
			return f.dot;
		}
	}
	if (I.force && I.damtype != "stamina" && this.stat != 2) {
		yield* this.spark_system.start();
	}
	return (yield* parent_proc());
}, true);

// robot_defense.dm:16
rt.def("/mob/living/silicon/robot/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let I: Value = null;
	if (M.a_intent == "disarm") {
		if (!this.lying) {
			yield* M.do_attack_animation(this, "disarm");
			if (I = this.get_active_held_item()) {
				yield* this.uneq_active();
				this.visible_message(`<span class='danger'>${M} disarmed ${this}!</span>`, `<span class='userdanger'>${M} has disabled ${this}'s active module!</span>`, null, 3);
				add_logs(M, this, "disarmed", `${I ? fmt(" removing ％！", [I]) : ""}`);
			} else {
				yield* this.Stun(40);
				yield* step(this, rt.getDir(f, M, this));
				add_logs(M, this, "pushed");
				this.visible_message(`<span class='danger'>${M} has forced back ${this}!</span>`, `<span class='userdanger'>${M} has forced back ${this}!</span>`, null, 3);
			}
			playsound(this.loc, rt.rsc("sound/weapons/pierce.ogg"), 50, 1, -1);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// robot_defense.dm:37
rt.def("/mob/living/silicon/robot/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	let stunprob: Value = null;
	if (yield* parent_proc()) {
		yield* this.flash_act();
		if (prob((stunprob = M.powerlevel * 7 + 10)) && M.powerlevel >= 8) {
			yield* this.adjustBruteLoss(M.powerlevel * rand(6, 10));
		}
	}
	let damage: Value = rand(1, 3);
	if (M.is_adult) {
		damage = rand(20, 40);
	} else {
		damage = rand(5, 35);
	}
	yield* this.adjustBruteLoss((damage = round(damage / 2)));
	yield* this.updatehealth();
	return f.dot;
}, true);

// robot_defense.dm:56
rt.def("/mob/living/silicon/robot/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.opened && !this.wiresexposed && !rt.istype(user, T("/mob/living/silicon"))) {
		if (this.cell) {
			yield* this.cell.update_icon();
			yield* this.cell.add_fingerprint(user);
			yield* user.put_in_active_hand(this.cell);
			to_chat(user, fmt("<span class='notice'>You remove ％！.</span>", [this.cell]));
			this.cell = null;
			yield* this.update_icons();
			this.diag_hud_set_borgcell();
		}
	}
	if (this.opened) return f.dot;
	if (!(yield* parent_proc())) return f.dot;
	yield* this.spark_system.start();
	rt.spawnTail(f, 0, "/mob/living/silicon/robot/proc/attack_hand: spawn at modules/mob/living/silicon/robot/robot_defense.dm:70");
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/silicon/robot/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/robot/proc/attack_hand: spawn at modules/mob/living/silicon/robot/robot_defense.dm:70", function* (f: Frame) {
	yield* step_away(this, f.args[0], 15);
	yield* sleep(3);
	yield* step_away(this, f.args[0], 15);
	return null;
});

// robot_defense.dm:76
rt.def("/mob/living/silicon/robot/proc/fire_act", function* fire_act(f: Frame) {
	if (this.on_fire) return f.dot;
	yield* this.IgniteMob();
	return f.dot;
}, true);

// robot_defense.dm:81
rt.def("/mob/living/silicon/robot/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (severity === 1) {
		yield* this.Stun(160);
	} else if (severity === 2) {
		yield* this.Stun(60);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// robot_defense.dm:90
rt.def("/mob/living/silicon/robot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let $0: any, $1: any;
	if (user == this) {
		return f.dot;
	}
	if (!this.opened) {
		if (this.locked) {
			to_chat(user, "<span class='notice'>You emag the cover lock.</span>");
			this.locked = 0;
			if (this.shell) {
				to_chat(user, `<span class='boldwarning'>${this} seems to be controlled remotely! Emagging the interface may not work as expected.</span>`);
			}
		} else {
			to_chat(user, "<span class='warning'>The cover is already unlocked!</span>");
		}
		return f.dot;
	}
	if (rt.worldTime(f) < this.emag_cooldown) {
		return f.dot;
	}
	if (this.wiresexposed) {
		to_chat(user, "<span class='warning'>You must unexpose the wires first!</span>");
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You emag ${this}'s interface.</span>`);
	this.emag_cooldown = rt.worldTime(f) + 100;
	if (is_servant_of_ratvar(this)) {
		to_chat(this, `<span class='nezbere'>"${text2ratvar("You will serve Engine above all else")}!"</span>\n<span class='danger'>ALERT: Subversion attempt denied.</span>`);
		log_game(`${key_name(user)} attempted to emag cyborg ${key_name(this)}, but they serve only Ratvar.`);
		return f.dot;
	}
	if (this.syndicate) {
		to_chat(this, "<span class='danger'>ALERT: Foreign software execution prevented.</span>");
		log_game(`${key_name(user)} attempted to emag cyborg ${key_name(this)}, but they were a syndicate cyborg.`);
		return f.dot;
	}
	let ai_is_antag: Value = 0;
	if (this.connected_ai && this.connected_ai.mind) {
		if (this.connected_ai.mind.special_role) {
			ai_is_antag = (this.connected_ai.mind.special_role == "traitor" ? 1 : 0);
		}
	}
	if (ai_is_antag) {
		to_chat(this, "<span class='danger'>ALERT: Foreign software execution prevented.</span>");
		to_chat(this.connected_ai, `<span class='danger'>ALERT: Cyborg unit [${this}] successfully defended against subversion.</span>`);
		log_game(`${key_name(user)} attempted to emag cyborg ${key_name(this)}, but they were slaved to traitor AI ${this.connected_ai}.`);
		return f.dot;
	}
	if (this.shell) {
		to_chat(user, `<span class='danger'>${this} is remotely controlled! Your emag attempt has triggered a system reset instead!</span>`);
		$0 = key_name(user);
		if (key_name(this)) {
			$1 = key_name(this);
		} else {
			$1 = this.connected_ai;
		}
		log_game(`${$0} attempted to emag an AI shell belonging to ${$1}. The shell has been reset as a result.`);
		yield* this.ResetModule();
		return f.dot;
	}
	yield* this.SetEmagged(1);
	yield* this.SetStun(60);
	this.lawupdate = 0;
	this.connected_ai = null;
	message_admins(`${key_name_admin(user)} emagged cyborg ${key_name_admin(this)}.  Laws overridden.`);
	log_game(`${key_name(user)} emagged cyborg ${key_name(this)}.  Laws overridden.`);
	let time: Value = time2text(rt.world().realtime, "hh:mm:ss");
	GLOB.lawchanges.Add(`${time} <B>:</B> ${user.name}(${user.key}) emagged ${this.name}(${this.key})`);
	to_chat(this, "<span class='danger'>ALERT: Foreign software detected.</span>");
	yield* sleep(5);
	to_chat(this, "<span class='danger'>Initiating diagnostics...</span>");
	yield* sleep(20);
	to_chat(this, "<span class='danger'>SynBorg v1.7 loaded.</span>");
	yield* sleep(5);
	to_chat(this, "<span class='danger'>LAW SYNCHRONISATION ERROR</span>");
	yield* sleep(5);
	to_chat(this, "<span class='danger'>Would you like to send a report to NanoTraSoft? Y/N</span>");
	yield* sleep(10);
	to_chat(this, "<span class='danger'>> N</span>");
	yield* sleep(20);
	to_chat(this, "<span class='danger'>ERRORERRORERROR</span>");
	to_chat(this, `<span class='danger'>ALERT: ${user.real_name} is your new master. Obey your new laws and their commands.</span>`);
	this.laws = (yield* new_(T("/datum/ai_laws/syndicate_override")));
	yield* this.set_zeroth_law(`Only ${user.real_name} and people they designate as being such are Syndicate Agents.`);
	this.laws.associate(this);
	yield* this.update_icons();
	return f.dot;
}, true);

// robot_defense.dm:166
rt.def("/mob/living/silicon/robot/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (this.stat != 2) {
		yield* this.adjustBruteLoss(30);
	} else {
		yield* this.gib();
	}
	return 1;
}, true);

// robot_defense.dm:173
rt.def("/mob/living/silicon/robot/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		yield* this.gib();
		return f.dot;
	} else if (severity === 2) {
		if (this.stat != 2) {
			yield* this.adjustBruteLoss(60);
			yield* this.adjustFireLoss(60);
		}
	} else if (severity === 3) {
		if (this.stat == 2) return f.dot;
		yield* this.adjustBruteLoss(30);
	}
	return f.dot;
}, true, { waitfor: false });

// robot_defense.dm:186
rt.def("/mob/living/silicon/robot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	yield* parent_proc(Proj);
	yield* this.updatehealth();
	if (prob(75) && Proj.damage > 0) {
		yield* this.spark_system.start();
	}
	return 2;
}, true);
