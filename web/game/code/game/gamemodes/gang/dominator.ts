// Based on /tg/station's code/game/gamemodes/gang/dominator.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10347, "/obj/machinery/dominator", "/obj/machinery", {
	gang: null,
	operating: 0,
	warned: 0,
	spam_prevention: 6,
	spark_system: null,
	countdown: null,
	anchored: 1,
	name: "dominator",
	desc: "A visibly sinister device. Looks like you can break it if you hit it enough.",
	icon: rt.rsc("icons/obj/machines/dominator.dmi"),
	icon_state: "dominator",
	density: 1,
	layer: 3.6,
	max_integrity: 300,
	obj_integrity: 300,
	integrity_failure: 100,
	armor: null,
});

// dominator.dm:16
rt.def("/obj/machinery/dominator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 20, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 10, "acid", 70]);
	return f.dot;
});

// dominator.dm:25
rt.def("/obj/machinery/dominator/proc/hulk_damage", function hulk_damage(f: Frame) {
	return (this.max_integrity - this.integrity_failure) / DOM_HULK_HITS_REQUIRED;
});

// dominator.dm:29
rt.def("/proc/dominator_excessive_walls", function dominator_excessive_walls(f: Frame, A: Value) {
	let _T: Value = null;
	let open: Value = 0;
	for (_T of each(view(3, A), T("/turf"))) {
		if (!rt.istype(_T, T("/turf/closed"))) {
			open++;
		}
	}
	if (open < DOM_REQUIRED_TURFS) {
		return 1;
	} else {
		return 0;
	}
});

// dominator.dm:38
rt.def("/obj/machinery/dominator/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// dominator.dm:41
rt.def("/obj/machinery/dominator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.set_light(2);
	(rt.modGl("poi_list", this, rt.bitOr));
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 1, this);
	this.countdown = (yield* new_(T("/obj/effect/countdown/dominator"), this));
	yield* this.update_icon();
	return f.dot;
}, true);

// dominator.dm:50
rt.def("/obj/machinery/dominator/proc/examine", function examine(f: Frame, user: Value) {
	let time: Value = null;
	parent_proc();
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.gang && this.gang.is_dominating) {
		if ((time = this.gang.domination_time_remaining()) > 0) {
			to_chat(user, `<span class='notice'>Hostile Takeover in progress. Estimated ${time} seconds remain.</span>`);
		} else {
			to_chat(user, `<span class='notice'>Hostile Takeover of ${station_name()} successful. Have a great day.</span>`);
		}
	} else {
		to_chat(user, "<span class='notice'>System on standby.</span>");
	}
	to_chat(user, `<span class='danger'>System Integrity: ${round(this.obj_integrity / this.max_integrity * 100, 1)}%</span>`);
	return f.dot;
}, false);

// dominator.dm:66
rt.def("/obj/machinery/dominator/proc/process", function* process(f: Frame) {
	let time_remaining: Value = null, domloc: Value = null, G: Value = null;
	yield* parent_proc();
	if (this.gang && this.gang.is_dominating) {
		if ((time_remaining = this.gang.domination_time_remaining()) > 0) {
			if (dominator_excessive_walls(this)) {
				this.gang.domination_timer += 20;
				playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 0);
				if (this.spam_prevention < DOM_BLOCKED_SPAM_CAP) {
					this.spam_prevention++;
				} else {
					this.gang.message_gangtools("Warning: There are too many walls around your gang's dominator, its signal is being blocked!");
					yield* this.say("Error: Takeover signal is currently blocked! There are too many walls within 3 standard units of this device.");
					this.spam_prevention = 0;
				}
				return f.dot;
			}
			f.dot = 1;
			playsound(this.loc, rt.rsc("sound/items/timer.ogg"), 10, 0);
			if (!this.warned && time_remaining < 180) {
				this.warned = 1;
				domloc = get_area(this.loc);
				this.gang.message_gangtools(`Less than 3 minutes remains in hostile takeover. Defend your dominator at ${domloc.map_name}!`);
				for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
					if (G != this.gang) {
						G.message_gangtools(`WARNING: ${this.gang.name} Gang takeover imminent. Their dominator at ${domloc.map_name} must be destroyed!`, 1, 1);
					}
				}
			}
		}
	}
	if (f.dot) return f.dot;
	this.isprocessing = 0;
	GLOB.SSmachines.processing -= this;
	return f.dot;
}, true, { waitfor: false });

// dominator.dm:94
rt.def("/obj/machinery/dominator/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// dominator.dm:104
rt.def("/obj/machinery/dominator/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (this.obj_integrity / this.max_integrity > 0.66) {
		if (prob(f.args[0] * 2)) {
			yield* this.spark_system.start();
		}
	} else {
		if (rt.bitAnd(this.stat, 1)) return f.dot;
		yield* this.spark_system.start();
		yield* this.update_icon();
	}
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// dominator.dm:114
rt.def("/obj/machinery/dominator/proc/update_icon", function update_icon(f: Frame) {
	let dominator_overlay: Value = null;
	this.cut_overlays();
	if (!rt.bitAnd(this.stat, 1)) {
		this.icon_state = "dominator-active";
		if (this.operating) {
			dominator_overlay = mutable_appearance(rt.rsc("icons/obj/machines/dominator.dmi"), "dominator-overlay");
			if (this.gang) {
				dominator_overlay.color = this.gang.color_hex;
			}
			this.add_overlay(dominator_overlay);
		} else {
			this.icon_state = "dominator";
		}
		if (this.obj_integrity / this.max_integrity < 0.66) {
			this.add_overlay("damage");
		}
	} else {
		this.icon_state = "dominator-broken";
	}
	return f.dot;
});

// dominator.dm:130
rt.def("/obj/machinery/dominator/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	yield* this.set_broken();
	return f.dot;
}, true);

// dominator.dm:134
rt.def("/obj/machinery/dominator/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!rt.bitAnd(this.stat, 1)) {
			yield* this.set_broken();
		}
		yield* new_(T("/obj/item/stack/sheet/plasteel"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// dominator.dm:141
rt.def("/obj/machinery/dominator/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	yield* this.add_fingerprint(user);
	yield* parent_proc();
	return f.dot;
}, true);

// dominator.dm:146
rt.def("/obj/machinery/dominator/proc/set_broken", function* set_broken(f: Frame) {
	let takeover_in_progress: Value = null, G: Value = null, was_stranded: Value = null;
	let $0: any, $1: any, $e: any;
	if (this.gang) {
		this.gang.is_dominating = 0;
		takeover_in_progress = 0;
		for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
			if (G.is_dominating) {
				takeover_in_progress = 1;
				break;
			}
		}
		if (!takeover_in_progress) {
			was_stranded = (GLOB.SSshuttle.emergency.mode == "stranded" ? 1 : 0);
			yield* GLOB.SSshuttle.clearHostileEnvironment(this);
			if (!was_stranded) {
				yield* priority_announce("All hostile activity within station systems has ceased.", "Network Alert");
			}
			if (get_security_level() == "delta") {
				set_security_level("red");
			}
		}
		$0 = this.gang;
		if (this.gang.dom_attempts) {
			$1 = ` You have ${this.gang.dom_attempts} attempt remaining.`;
		} else {
			$1 = " The station network will have likely blocked any more attempts by us.";
		}
		$0.message_gangtools(`Hostile takeover cancelled: Dominator is no longer operational.${$1}`, 1, 1);
	}
	this.set_light(0);
	this.operating = 0;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	yield* this.update_icon();
	this.isprocessing = 0;
	GLOB.SSmachines.processing -= this;
	return f.dot;
}, true);

// dominator.dm:171
rt.def("/obj/machinery/dominator/proc/Destroy", function* Destroy(f: Frame) {
	if (!rt.bitAnd(this.stat, 1)) {
		yield* this.set_broken();
	}
	yield* GLOB.poi_list.Remove(this);
	this.gang = null;
	yield* qdel(this.spark_system);
	this.spark_system = null;
	yield* qdel(this.countdown);
	this.countdown = null;
	this.isprocessing = 0;
	GLOB.SSmachines.processing -= this;
	return (yield* parent_proc());
}, true);

// dominator.dm:181
rt.def("/obj/machinery/dominator/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.take_damage(100, "fire", "energy", 0);
	yield* parent_proc();
	return f.dot;
}, true);

// dominator.dm:185
rt.def("/obj/machinery/dominator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let tempgang: Value = null, G: Value = null;
	let $2: any, $e: any;
	if (this.operating || rt.bitAnd(this.stat, 1)) {
		yield* this.examine(user);
		return f.dot;
	}
	if (rt.isIn(f, user.mind, GLOB.SSticker.mode.get_all_gangsters())) {
		tempgang = user.mind.gang_datum;
	} else {
		yield* this.examine(user);
		return f.dot;
	}
	if (tempgang.is_dominating) {
		to_chat(user, "<span class='warning'>Error: Hostile Takeover is already in progress.</span>");
		return f.dot;
	}
	if (!tempgang.dom_attempts) {
		to_chat(user, "<span class='warning'>Error: Unable to breach station network. Firewall has logged our signature and is blocking all further attempts.</span>");
		return f.dot;
	}
	let time: Value = round(determine_domination_time(tempgang) / 60, 0.1);
	if ((yield* alert(user, `With ${round(rt.len(f, tempgang.territory) / GLOB.start_state.num_territories * 100, 1)}% station control, a takeover will require ${time} minutes.\nYour gang will be unable to gain influence while it is active.\nThe entire station will likely be alerted to it once it starts.\nYou have ${tempgang.dom_attempts} attempt(s) remaining. Are you ready?`, "Confirm", "Ready", "Later")) != "Ready") return f.dot;
	if (tempgang.is_dominating || !tempgang.dom_attempts || !(get_dist(this, user) <= 1) || !isturf(this.loc)) {
		return 0;
	}
	let A: Value = get_area(this.loc);
	let locname: Value = A.map_name;
	this.gang = tempgang;
	this.gang.dom_attempts--;
	yield* priority_announce(`Network breach detected in ${locname}. The ${this.gang.name} Gang is attempting to seize control of the station!`, "Network Alert");
	this.gang.domination();
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	this.name = `${this.gang.name} Gang ${this.name}`;
	this.operating = 1;
	yield* this.update_icon();
	this.countdown.color = this.gang.color_hex;
	yield* this.countdown.start();
	this.set_light(3);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSmachines.processing += this;
	}
	let $0: any = this.gang;
	let $1: any = time;
	if (this.gang.dom_attempts) {
		$2 = "";
	} else {
		$2 = " This is your final attempt.";
	}
	$0.message_gangtools(`Hostile takeover in progress: Estimated ${$1} minutes until victory.${$2}`);
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		if (G != this.gang) {
			G.message_gangtools(`Enemy takeover attempt detected in ${locname}: Estimated ${time} minutes until our defeat.`, 1, 1);
		}
	}
	return f.dot;
}, true);
