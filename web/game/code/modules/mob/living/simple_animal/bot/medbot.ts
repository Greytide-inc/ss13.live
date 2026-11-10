// Based on /tg/station's code/modules/mob/living/simple_animal/bot/medbot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5038, "/mob/living/simple_animal/bot/medbot", "/mob/living/simple_animal/bot", {
	reagent_glass: null,
	skin: null,
	patient: null,
	oldpatient: null,
	oldloc: null,
	last_found: 0,
	last_newpatient_speak: 0,
	injection_amount: 15,
	heal_threshold: 10,
	use_beaker: 0,
	declare_crit: 1,
	declare_cooldown: 0,
	stationary_mode: 0,
	treatment_brute_avoid: "tricordrazine",
	treatment_brute: "bicaridine",
	treatment_oxy_avoid: null,
	treatment_oxy: "dexalin",
	treatment_fire_avoid: "tricordrazine",
	treatment_fire: "kelotane",
	treatment_tox_avoid: "tricordrazine",
	treatment_tox: "charcoal",
	treatment_virus_avoid: null,
	treatment_virus: "spaceacillin",
	treat_virus: 1,
	shut_up: 0,
	anchored: 0,
	pass_flags: 16,
	radio_channel: "Medical",
	bot_type: 16,
	model: "Medibot",
	window_id: "automed",
	window_name: "Automatic Medical Unit v1.1",
	data_hud_type: 4,
	name: "１Medibot",
	desc: "A little medical robot. He looks somewhat underwhelmed.",
	icon: rt.rsc("icons/mob/aibots.dmi"),
	icon_state: "medibot0",
	density: 0,
	health: 20,
	maxHealth: 20,
	status_flags: 9,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/medbot"),
});

// medbot.dm:79
rt.def("/mob/living/simple_animal/bot/medbot/proc/update_icon", function update_icon(f: Frame) {
	if (!this.on) {
		this.icon_state = "medibot0";
		return f.dot;
	}
	if (this.IsStun()) {
		this.icon_state = "medibota";
		return f.dot;
	}
	if (this.mode == BOT_HEALING) {
		this.icon_state = `medibots${this.stationary_mode}`;
		return f.dot;
	} else if (this.stationary_mode) {
		this.icon_state = "medibot2";
	} else {
		this.icon_state = "medibot1";
	}
	return f.dot;
});

// medbot.dm:94
rt.def("/mob/living/simple_animal/bot/medbot/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	if (this.skin) {
		this.add_overlay(`medskin_${this.skin}`);
	}
	let J: Value = (yield* new_(T("/datum/job/doctor")));
	this.access_card.access += J.get_access();
	this.prev_access = this.access_card.access;
	yield* qdel(J);
	return f.dot;
}, true);

// medbot.dm:106
rt.def("/mob/living/simple_animal/bot/medbot/proc/update_canmove", function* update_canmove(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.update_icon();
	return f.dot;
}, true);

// medbot.dm:110
rt.def("/mob/living/simple_animal/bot/medbot/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.patient = null;
	this.oldpatient = null;
	this.oldloc = null;
	this.last_found = rt.worldTime(f);
	this.declare_cooldown = 0;
	this.update_icon();
	return f.dot;
});

// medbot.dm:119
rt.def("/mob/living/simple_animal/bot/medbot/proc/soft_reset", function soft_reset(f: Frame) {
	this.path = list();
	this.patient = null;
	this.mode = BOT_IDLE;
	this.last_found = rt.worldTime(f);
	this.update_icon();
	return f.dot;
});

// medbot.dm:127
rt.def("/mob/living/simple_animal/bot/medbot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You corrupt ${this.name}'s reagent processor circuits.`;
	this.text_dehack = `You reset ${this.name}'s reagent processor circuits.`;
	this.text_dehack_fail = `${this.name} seems damaged and does not respond to reprogramming!`;
	return f.dot;
});

// medbot.dm:132
rt.def("/mob/living/simple_animal/bot/medbot/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// medbot.dm:136
rt.def("/mob/living/simple_animal/bot/medbot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $1: any;
	dat += this.hack(user);
	dat += this.showpai(user);
	dat += "<TT><B>Medical Unit Controls v1.1</B></TT><BR><BR>";
	let $0: any = this;
	if (this.on) {
		$1 = "On";
	} else {
		$1 = "Off";
	}
	dat += fmt("Status: <A href='?src=＃;power=1'>＀</A><BR>", [$0, $1]);
	dat += `Maintenance panel panel is ${this.open ? "opened" : "closed"}<BR>`;
	dat += "Beaker: ";
	if (this.reagent_glass) {
		dat += fmt("<A href='?src=＃;eject=1'>Loaded [＀/＀]</a>", [this, this.reagent_glass.reagents.total_volume, this.reagent_glass.reagents.maximum_volume]);
	} else {
		dat += "None Loaded";
	}
	dat += `<br>Behaviour controls are ${this.locked ? "locked" : "unlocked"}<hr>`;
	if (!this.locked || rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
		dat += "<TT>Healing Threshold: ";
		dat += fmt("<a href='?src=＃;adj_threshold=-10'>--</a> ", [this]);
		dat += fmt("<a href='?src=＃;adj_threshold=-5'>-</a> ", [this]);
		dat += `${this.heal_threshold} `;
		dat += fmt("<a href='?src=＃;adj_threshold=5'>+</a> ", [this]);
		dat += fmt("<a href='?src=＃;adj_threshold=10'>++</a>", [this]);
		dat += "</TT><br>";
		dat += "<TT>Injection Level: ";
		dat += fmt("<a href='?src=＃;adj_inject=-5'>-</a> ", [this]);
		dat += `${this.injection_amount} `;
		dat += fmt("<a href='?src=＃;adj_inject=5'>+</a> ", [this]);
		dat += "</TT><br>";
		dat += "Reagent Source: ";
		$0 = this;
		if (this.use_beaker) {
			$1 = "Loaded Beaker (When available)";
		} else {
			$1 = "Internal Synthesizer";
		}
		dat += fmt("<a href='?src=＃;use_beaker=1'>＀</a><br>", [$0, $1]);
		$0 = this;
		if (this.treat_virus) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Treat Viral Infections: <a href='?src=＃;virus=1'>＀</a><br>", [$0, $1]);
		if (this.shut_up) {
			$0 = "off";
		} else {
			$0 = "on";
		}
		dat += fmt("The speaker switch is ＀. <a href='?src=＃;togglevoice=＀'>Toggle</a><br>", [$0, this, 1]);
		$0 = this;
		if (this.declare_crit) {
			$1 = "Yes";
		} else {
			$1 = "No";
		}
		dat += fmt("Critical Patient Alerts: <a href='?src=＃;critalerts=1'>＀</a><br>", [$0, $1]);
		dat += fmt("Patrol Station: <a href='?src=＃;operation=patrol'>＀</a><br>", [this, this.auto_patrol ? "Yes" : "No"]);
		dat += fmt("Stationary Mode: <a href='?src=＃;stationary=1'>＀</a><br>", [this, this.stationary_mode ? "Yes" : "No"]);
	}
	return dat;
});

// medbot.dm:174
rt.def("/mob/living/simple_animal/bot/medbot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let adjust_num: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (rt.at(href_list, "adj_threshold")) {
		if ((this.heal_threshold += (adjust_num = text2num(rt.at(href_list, "adj_threshold")))) < 5) {
			this.heal_threshold = 5;
		}
		if (this.heal_threshold > 75) {
			this.heal_threshold = 75;
		}
	} else if (rt.at(href_list, "adj_inject")) {
		if ((this.injection_amount += (adjust_num = text2num(rt.at(href_list, "adj_inject")))) < 5) {
			this.injection_amount = 5;
		}
		if (this.injection_amount > 15) {
			this.injection_amount = 15;
		}
	} else if (rt.at(href_list, "use_beaker")) {
		this.use_beaker = (!this.use_beaker ? 1 : 0);
	} else if (rt.at(href_list, "eject") && this.reagent_glass !== null) {
		this.reagent_glass.loc = rt.getStep(f, this, 0);
		this.reagent_glass = null;
	} else if (rt.at(href_list, "togglevoice")) {
		this.shut_up = (!this.shut_up ? 1 : 0);
	} else if (rt.at(href_list, "critalerts")) {
		this.declare_crit = (!this.declare_crit ? 1 : 0);
	} else if (rt.at(href_list, "stationary")) {
		this.stationary_mode = (!this.stationary_mode ? 1 : 0);
		this.path = list();
		yield* this.update_icon();
	} else if (rt.at(href_list, "virus")) {
		this.treat_virus = (!this.treat_virus ? 1 : 0);
	}
	yield* this.update_controls();
	return f.dot;
}, true);

// medbot.dm:218
rt.def("/mob/living/simple_animal/bot/medbot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let current_health: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers/glass"))) {
		f.dot = 1;
		if (this.locked) {
			to_chat(user, "<span class='warning'>You cannot insert a beaker because the panel is locked!</span>");
			return f.dot;
		}
		if (this.reagent_glass !== null) {
			to_chat(user, "<span class='warning'>There is already a beaker loaded!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		W.loc = this;
		this.reagent_glass = W;
		to_chat(user, `<span class='notice'>You insert ${W}.</span>`);
		yield* this.show_controls(user);
	} else {
		current_health = this.health;
		yield* parent_proc();
		if (!(this.health < current_health)) return f.dot;
		yield* step_to(this, get_step_away(this, user));
	}
	return f.dot;
}, true);

// medbot.dm:241
rt.def("/mob/living/simple_animal/bot/medbot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.emagged != 2) return f.dot;
	this.declare_crit = 0;
	if (user) {
		to_chat(user, `<span class='notice'>You short out ${this}'s reagent synthesis circuits.</span>`);
	}
	this.audible_message(`<span class='danger'>${this} buzzes oddly!</span>`);
	flick("medibot_spark", this);
	if (!user) return f.dot;
	this.oldpatient = user;
	return f.dot;
}, true);

// medbot.dm:252
rt.def("/mob/living/simple_animal/bot/medbot/proc/process_scan", function* process_scan(f: Frame, H: Value) {
	let messagevoice: Value = null, message: Value = null;
	if (H.stat == 2) {
		return f.dot;
	}
	if (H == this.oldpatient && rt.worldTime(f) < this.last_found + 200) {
		return f.dot;
	}
	if (yield* this.assess_patient(H)) {
		this.last_found = rt.worldTime(f);
		if (this.last_newpatient_speak + 300 < rt.worldTime(f)) {
			messagevoice = rt.alist(f, [`Hey, ${H.name}! Hold on, I'm coming.`, rt.rsc("sound/voice/mcoming.ogg"), `Wait ${H.name}! I want to help!`, rt.rsc("sound/voice/mhelp.ogg"), `${H.name}, you appear to be injured!`, rt.rsc("sound/voice/minjured.ogg")]);
			yield* this.speak((message = pick(messagevoice)));
			playsound(this.loc, rt.index(messagevoice, message), 50, 0);
			this.last_newpatient_speak = rt.worldTime(f);
		}
		return H;
	} else {
		return f.dot;
	}
}, true);

// medbot.dm:271
rt.def("/mob/living/simple_animal/bot/medbot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let messagevoice: Value = null, message: Value = null, scan_range: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (this.mode == BOT_HEALING) {
		return f.dot;
	}
	if (this.IsStun()) {
		this.oldpatient = this.patient;
		this.patient = null;
		this.mode = BOT_IDLE;
		return f.dot;
	}
	if (this.frustration > 8) {
		this.oldpatient = this.patient;
		this.soft_reset();
	}
	if (!this.patient) {
		if (!this.shut_up && prob(1)) {
			messagevoice = rt.alist(f, ["Radar, put a mask on!", rt.rsc("sound/voice/mradar.ogg"), "There's always a catch, and I'm the best there is.", rt.rsc("sound/voice/mcatch.ogg"), "I knew it, I should've been a plastic surgeon.", rt.rsc("sound/voice/msurgeon.ogg"), "What kind of medbay is this? Everyone's dropping like flies.", rt.rsc("sound/voice/mflies.ogg"), "Delicious!", rt.rsc("sound/voice/mdelicious.ogg")]);
			yield* this.speak((message = pick(messagevoice)));
			playsound(this.loc, rt.index(messagevoice, message), 50, 0);
		}
		scan_range = this.stationary_mode ? 1 : DEFAULT_SCAN_RANGE;
		this.patient = (yield* this.scan(T("/mob/living/carbon/human"), this.oldpatient, scan_range));
		this.oldpatient = this.patient;
	}
	if (this.patient && get_dist(this, this.patient) <= 1) {
		if (this.mode != BOT_HEALING) {
			this.mode = BOT_HEALING;
			yield* this.update_icon();
			this.frustration = 0;
			yield* this.medicate_patient(this.patient);
		}
		return f.dot;
	} else if (this.patient && rt.len(f, this.path) && get_dist(this.patient, rt.index(this.path, rt.len(f, this.path))) > 2) {
		this.path = list();
		this.mode = BOT_IDLE;
		this.last_found = rt.worldTime(f);
	} else if (this.stationary_mode && this.patient) {
		this.soft_reset();
		return f.dot;
	}
	if (this.patient && rt.len(f, this.path) == 0 && get_dist(this, this.patient) > 1) {
		this.path = (yield* get_path_to(this, rt.getStep(f, this.patient, 0), P("/turf/proc/Distance_cardinal"), 0, 30, { id: this.access_card }));
		this.mode = BOT_MOVING;
		if (!rt.len(f, this.path)) {
			this.path = (yield* get_path_to(this, rt.getStep(f, this.patient, 0), P("/turf/proc/Distance_cardinal"), 0, 30, 1, { id: this.access_card }));
			if (!rt.len(f, this.path)) {
				this.soft_reset();
			}
		}
	}
	if (rt.len(f, this.path) > 0 && this.patient) {
		if (!this.bot_move(rt.index(this.path, rt.len(f, this.path)))) {
			this.oldpatient = this.patient;
			this.soft_reset();
		}
		return f.dot;
	}
	if (rt.len(f, this.path) > 8 && this.patient) {
		this.frustration++;
	}
	if (this.auto_patrol && !this.stationary_mode && !this.patient) {
		if (this.mode == BOT_IDLE || this.mode == BOT_START_PATROL) {
			yield* this.start_patrol();
		}
		if (this.mode == BOT_PATROL) {
			yield* this.bot_patrol();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// medbot.dm:343
rt.def("/mob/living/simple_animal/bot/medbot/proc/assess_patient", function* assess_patient(f: Frame, C: Value) {
	let R: Value = null, D: Value = null;
	if (C.stat == 2 || rt.bitAnd(C.status_flags, FAKEDEATH)) {
		return 0;
	}
	if (C.suiciding) {
		return 0;
	}
	if (this.emagged == 2) {
		return 1;
	}
	if (this.declare_crit && C.health <= 0) {
		yield* this.declare(C);
	}
	if (this.reagent_glass && this.use_beaker && (C.getBruteLoss() >= this.heal_threshold || C.getToxLoss() >= this.heal_threshold || C.getToxLoss() >= this.heal_threshold || C.getOxyLoss() >= this.heal_threshold + 15)) {
		for (R of each(this.reagent_glass.reagents.reagent_list, T("/datum/reagent"))) {
			if (!C.reagents.has_reagent(R.id)) {
				return 1;
			}
		}
	}
	if (!C.reagents.has_reagent(this.treatment_brute_avoid) && C.getBruteLoss() >= this.heal_threshold && !C.reagents.has_reagent(this.treatment_brute)) {
		return 1;
	}
	if (!C.reagents.has_reagent(this.treatment_oxy_avoid) && C.getOxyLoss() >= 15 + this.heal_threshold && !C.reagents.has_reagent(this.treatment_oxy)) {
		return 1;
	}
	if (!C.reagents.has_reagent(this.treatment_fire_avoid) && C.getFireLoss() >= this.heal_threshold && !C.reagents.has_reagent(this.treatment_fire)) {
		return 1;
	}
	if (!C.reagents.has_reagent(this.treatment_tox_avoid) && C.getToxLoss() >= this.heal_threshold && !C.reagents.has_reagent(this.treatment_tox)) {
		return 1;
	}
	if (this.treat_virus && !C.reagents.has_reagent(this.treatment_virus_avoid) && !C.reagents.has_reagent(this.treatment_virus)) {
		for (D of each(C.viruses, T("/datum/disease"))) {
			if (!(rt.bitAnd(D.visibility_flags, HIDDEN_SCANNER) || rt.bitAnd(D.visibility_flags, HIDDEN_PANDEMIC)) && D.severity != "No threat" && (D.stage > 1 || rt.bitAnd(D.spread_flags, AIRBORNE))) {
				return 1;
			}
		}
	}
	return 0;
}, true);

// medbot.dm:385
rt.def("/mob/living/simple_animal/bot/medbot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	let C: Value = null;
	if (rt.istype(A, T("/mob/living/carbon"))) {
		this.patient = (C = A);
		this.mode = BOT_HEALING;
		yield* this.update_icon();
		yield* this.medicate_patient(C);
		yield* this.update_icon();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// medbot.dm:396
rt.def("/mob/living/simple_animal/bot/medbot/examinate", function* examinate(f: Frame, A: Value) {
	yield* parent_proc();
	if (is_blind(this)) return f.dot;
	chemscan(this, A);
	return f.dot;
}, true, { verb: { name: "Examine", category: "IC" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// medbot.dm:401
rt.def("/mob/living/simple_animal/bot/medbot/proc/medicate_patient", function* medicate_patient(f: Frame, C: Value) {
	let messagevoice: Value = null, message: Value = null, reagent_id: Value = null, virus: Value = null, D: Value = null, R: Value = null, messagevoice_1: Value = null, message_2: Value = null, failed: Value = null, fraction: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		this.oldpatient = this.patient;
		this.soft_reset();
		return f.dot;
	}
	if (C.stat == 2 || rt.bitAnd(C.status_flags, FAKEDEATH)) {
		messagevoice = rt.alist(f, ["No! Stay with me!", rt.rsc("sound/voice/mno.ogg"), "Live, damnit! LIVE!", rt.rsc("sound/voice/mlive.ogg"), "I...I've never lost a patient before. Not today, I mean.", rt.rsc("sound/voice/mlost.ogg")]);
		yield* this.speak((message = pick(messagevoice)));
		playsound(this.loc, rt.index(messagevoice, message), 50, 0);
		this.oldpatient = this.patient;
		this.soft_reset();
		return f.dot;
	}
	if (this.emagged == 2) {
		reagent_id = "toxin";
	} else {
		if (this.treat_virus) {
			virus = 0;
			for (D of each(C.viruses, T("/datum/disease"))) {
				if (!rt.bitAnd(D.visibility_flags, HIDDEN_SCANNER) || !rt.bitAnd(D.visibility_flags, HIDDEN_PANDEMIC)) {
					if (D.severity != "No threat") {
						if (D.stage > 1 || rt.bitAnd(D.spread_flags, AIRBORNE)) {
							virus = 1;
						}
					}
				}
			}
			if (!reagent_id && virus) {
				if (!C.reagents.has_reagent(this.treatment_virus) && !C.reagents.has_reagent(this.treatment_virus_avoid)) {
					reagent_id = this.treatment_virus;
				}
			}
		}
		if (!reagent_id && C.getBruteLoss() >= this.heal_threshold) {
			if (!C.reagents.has_reagent(this.treatment_brute) && !C.reagents.has_reagent(this.treatment_brute_avoid)) {
				reagent_id = this.treatment_brute;
			}
		}
		if (!reagent_id && C.getOxyLoss() >= 15 + this.heal_threshold) {
			if (!C.reagents.has_reagent(this.treatment_oxy) && !C.reagents.has_reagent(this.treatment_oxy_avoid)) {
				reagent_id = this.treatment_oxy;
			}
		}
		if (!reagent_id && C.getFireLoss() >= this.heal_threshold) {
			if (!C.reagents.has_reagent(this.treatment_fire) && !C.reagents.has_reagent(this.treatment_fire_avoid)) {
				reagent_id = this.treatment_fire;
			}
		}
		if (!reagent_id && C.getToxLoss() >= this.heal_threshold) {
			if (!C.reagents.has_reagent(this.treatment_tox) && !C.reagents.has_reagent(this.treatment_tox_avoid)) {
				reagent_id = this.treatment_tox;
			}
		}
		if (reagent_id && this.use_beaker && this.reagent_glass && this.reagent_glass.reagents.total_volume) {
			for (R of each(this.reagent_glass.reagents.reagent_list, T("/datum/reagent"))) {
				if (!C.reagents.has_reagent(R.id)) {
					reagent_id = "internal_beaker";
					break;
				}
			}
		}
	}
	if (!reagent_id) {
		messagevoice_1 = rt.alist(f, ["All patched up!", rt.rsc("sound/voice/mpatchedup.ogg"), "An apple a day keeps me away.", rt.rsc("sound/voice/mapple.ogg"), "Feel better soon!", rt.rsc("sound/voice/mfeelbetter.ogg")]);
		yield* this.speak((message_2 = pick(messagevoice_1)));
		playsound(this.loc, rt.index(messagevoice_1, message_2), 50, 0);
		this.bot_reset();
		return f.dot;
	} else {
		if (!this.emagged && this.check_overdose(this.patient, reagent_id, this.injection_amount)) {
			this.soft_reset();
			return f.dot;
		}
		C.visible_message(`<span class='danger'>${this} is trying to inject ${this.patient}!</span>`, `<span class='userdanger'>${this} is trying to inject you!</span>`);
		failed = 0;
		if (yield* do_mob(this, this.patient, 30)) {
			if (get_dist(this, this.patient) <= 1 && this.on && (yield* this.assess_patient(this.patient))) {
				if (reagent_id == "internal_beaker") {
					if (this.use_beaker && this.reagent_glass && this.reagent_glass.reagents.total_volume) {
						fraction = min(this.injection_amount / this.reagent_glass.reagents.total_volume, 1);
						yield* this.reagent_glass.reagents.reaction(this.patient, INJECT, fraction);
						yield* this.reagent_glass.reagents.trans_to(this.patient, this.injection_amount);
					}
				} else {
					yield* this.patient.reagents.add_reagent(reagent_id, this.injection_amount);
				}
				C.visible_message(`<span class='danger'>${this} injects ${this.patient} with its syringe!</span>`, `<span class='userdanger'>${this} injects you with its syringe!</span>`);
			} else {
				failed = 1;
			}
		} else {
			failed = 1;
		}
		if (failed) {
			this.visible_message(`${this} retracts its syringe.`);
		}
		yield* this.update_icon();
		this.soft_reset();
		return f.dot;
	}
	reagent_id = null;
	return f.dot;
}, true);

// medbot.dm:501
rt.def("/mob/living/simple_animal/bot/medbot/proc/check_overdose", function check_overdose(f: Frame, patient: Value, reagent_id: Value, injection_amount: Value) {
	let R: Value = null, current_volume: Value = null;
	if (!(R = rt.index(GLOB.chemical_reagents_list, reagent_id)).overdose_threshold) {
		return 0;
	}
	if ((current_volume = patient.reagents.get_reagent_amount(reagent_id)) + injection_amount > R.overdose_threshold) {
		return 1;
	}
	return 0;
});

// medbot.dm:511
rt.def("/mob/living/simple_animal/bot/medbot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	this.on = 0;
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	yield* new_(T("/obj/item/weapon/storage/firstaid"), (Tsec = rt.getStep(f, this, 0)));
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), Tsec);
	yield* new_(T("/obj/item/device/healthanalyzer"), Tsec);
	if (this.reagent_glass) {
		this.reagent_glass.loc = Tsec;
		this.reagent_glass = null;
	}
	if (prob(50)) {
		yield* new_(T("/obj/item/bodypart/l_arm/robot"), Tsec);
	}
	if (this.emagged && prob(25)) {
		playsound(this.loc, rt.rsc("sound/voice/minsult.ogg"), 50, 0);
	}
	yield* do_sparks(3, 1, this);
	yield* parent_proc();
	return f.dot;
}, true);

// medbot.dm:534
rt.def("/mob/living/simple_animal/bot/medbot/proc/declare", function* declare(f: Frame, crit_patient: Value) {
	let $0: any;
	if (this.declare_cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	let location: Value = get_area(this);
	if (crit_patient) {
		$0 = `<b>${crit_patient}</b>`;
	} else {
		$0 = "A patient";
	}
	yield* this.speak(`Medical emergency! ${$0} is in critical condition at ${location}!`, this.radio_channel);
	this.declare_cooldown = rt.worldTime(f) + 200;
	return f.dot;
}, true);
