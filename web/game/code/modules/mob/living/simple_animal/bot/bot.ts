// Based on /tg/station's code/modules/mob/living/simple_animal/bot/bot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(5032, "/mob/living/simple_animal/bot", "/mob/living/simple_animal", {
	bot_core: null,
	users: null,
	window_id: "bot_control",
	window_name: "Protobot 1.0",
	window_width: 0,
	window_height: 0,
	paicard: null,
	allow_pai: 1,
	bot_name: null,
	player_access: null,
	emagged: 0,
	prev_access: null,
	on: 1,
	open: 0,
	locked: 1,
	hacked: 0,
	text_hack: "",
	text_dehack: "",
	text_dehack_fail: "",
	declare_message: "",
	frustration: 0,
	base_speed: 2,
	ai_waypoint: null,
	path: null,
	pathset: 0,
	ignore_list: null,
	mode: 0,
	tries: 0,
	remote_disabled: 0,
	calling_ai: null,
	Radio: null,
	radio_key: null,
	radio_channel: "Common",
	auto_patrol: 0,
	patrol_target: null,
	summon_target: null,
	new_destination: null,
	destination: null,
	next_destination: null,
	shuffle: 0,
	blockcount: 0,
	awaiting_beacon: 0,
	nearest_beacon: null,
	nearest_beacon_loc: null,
	beacon_freq: 1445,
	model: "",
	bot_type: 0,
	data_hud_type: 5,
	mode_name: null,
	bot_core_type: rt.typePath("/obj/machinery/bot_core"),
	verb_say: "states",
	verb_ask: "queries",
	verb_exclaim: "declares",
	verb_yell: "alarms",
	initial_language_holder: rt.typePath("/datum/language_holder/synthetic"),
	hud_possible: null,
	icon: rt.rsc("icons/mob/aibots.dmi"),
	layer: 4,
	gender: "neuter",
	luminosity: 3,
	stop_automated_movement: 1,
	wander: 0,
	healable: 0,
	damage_coeff: null,
	atmos_requirements: null,
	maxbodytemp: 1e+31,
	minbodytemp: 0,
	has_unlimited_silicon_privilege: 1,
	sentience_type: 2,
	status_flags: 0,
	bubble_icon: "machine",
	faction: null,
});

// bot.dm:30
rt.def("/mob/living/simple_animal/bot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.users = list();

	this.player_access = list();

	this.prev_access = list();

	this.path = list();

	this.ignore_list = list();
	this.mode_name = list("In Pursuit", "Preparing to Arrest", "Arresting", "Beginning Patrol", "Patrolling", "Summoned by PDA", "Cleaning", "Repairing", "Proceeding to work site", "Healing", "Proceeding to AI waypoint", "Navigating to Delivery Location", "Navigating to Home", "Waiting for clear path", "Calculating navigation path", "Pinging beacon network", "Unable to reach destination");
	this.hud_possible = list("8", "12", "9");
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.faction = list("neutral", "silicon", "turret");
	return f.dot;
});

// bot.dm:93
rt.def("/mob/living/simple_animal/bot/proc/get_mode", function get_mode(f: Frame) {
	if (this.client) {
		if (this.paicard) {
			return "<b>pAI Controlled</b>";
		}
		return "<b>Autonomous</b>";
	} else {
		if (!this.on) {
			return "<span class='bad'>Inactive</span>";
		}
		if (!this.mode) {
			return "<span class='good'>Idle</span>";
		}
		return `<span class='average'>${rt.index(this.mode_name, this.mode)}</span>`;
	}
});

// bot.dm:107
rt.def("/mob/living/simple_animal/bot/proc/turn_on", function turn_on(f: Frame) {
	if (this.stat) {
		return 0;
	}
	this.on = 1;
	this.set_light(rt.initial(f, this, "light_range"));
	this.update_icon();
	this.diag_hud_set_botstat();
	return 1;
});

// bot.dm:114
rt.def("/mob/living/simple_animal/bot/proc/turn_off", function turn_off(f: Frame) {
	this.on = 0;
	this.set_light(0);
	this.bot_reset();
	this.update_icon();
	return f.dot;
});

// bot.dm:119
rt.def("/mob/living/simple_animal/bot/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	yield* parent_proc();
	this.access_card = (yield* new_(T("/obj/item/weapon/card/id"), this));
	this.access_card.access += 29;
	this.set_custom_texts();
	this.Radio = (yield* new_(T("/obj/item/device/radio"), this));
	if (this.radio_key) {
		this.Radio.keyslot = (yield* new_(this.radio_key));
	}
	this.Radio.subspace_transmission = 1;
	this.Radio.canhear_range = 0;
	this.Radio.recalculateChannels();
	this.bot_core = (yield* new_(this.bot_core_type, this));
	yield* this.prepare_huds();
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	this.diag_hud_set_bothealth();
	this.diag_hud_set_botstat();
	this.diag_hud_set_botmode();
	this.activate_data_hud();
	return f.dot;
}, true);

// bot.dm:146
rt.def("/mob/living/simple_animal/bot/proc/update_canmove", function* update_canmove(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.on) {
		f.dot = 0;
	}
	this.canmove = f.dot;
	return f.dot;
}, true);

// bot.dm:153
rt.def("/mob/living/simple_animal/bot/proc/Destroy", function* Destroy(f: Frame) {
	if (this.paicard) {
		yield* this.ejectpai();
	}
	yield* qdel(this.Radio);
	yield* qdel(this.access_card);
	yield* qdel(this.bot_core);
	return (yield* parent_proc());
}, true);

// bot.dm:163
rt.def("/mob/living/simple_animal/bot/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* this.explode();
	yield* parent_proc();
	return f.dot;
}, true);

// bot.dm:167
rt.def("/mob/living/simple_animal/bot/proc/explode", function* explode(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// bot.dm:173
rt.def("/mob/living/simple_animal/bot/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (this.locked) {
		this.locked = 0;
		this.emagged = 1;
		to_chat(user, `<span class='notice'>You bypass ${this}'s controls.</span>`);
		return f.dot;
	}
	if (!this.locked && this.open) {
		this.emagged = 2;
		this.remote_disabled = 1;
		this.locked = 1;
		this.bot_reset();
		yield* this.turn_on();
		to_chat(this, "<span class='userdanger'>(#$*#$^^( OVERRIDE DETECTED</span>");
		add_logs(user, this, "emagged");
		return f.dot;
	} else {
		to_chat(user, "<span class='warning'>You need to open maintenance panel first!</span>");
	}
	return f.dot;
}, true);

// bot.dm:188
rt.def("/mob/living/simple_animal/bot/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.health < this.maxHealth) {
		if (this.health > this.maxHealth / 3) {
			to_chat(user, `${this}'s parts look loose.`);
		} else {
			to_chat(user, `${this}'s parts look very loose!`);
		}
	} else {
		to_chat(user, `${this} is in pristine condition.`);
	}
	return f.dot;
}, false);

// bot.dm:198
rt.def("/mob/living/simple_animal/bot/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[0] > 0 && prob(10)) {
		yield* new_(T("/obj/effect/decal/cleanable/oil"), this.loc);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// bot.dm:203
rt.def("/mob/living/simple_animal/bot/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* parent_proc();
	this.diag_hud_set_bothealth();
	return f.dot;
}, true);

// bot.dm:214
rt.def("/mob/living/simple_animal/bot/proc/handle_automated_action", function handle_automated_action(f: Frame) {
	this.diag_hud_set_botmode();
	if (!this.on || this.client) {
		return f.dot;
	}
	if (this.mode === BOT_RESPONDING) {
		this.call_mode();
		return f.dot;
	} else if (this.mode === BOT_SUMMON) {
		this.bot_summon();
		return f.dot;
	}
	return 1;
}, false, { waitfor: false });

// bot.dm:230
rt.def("/mob/living/simple_animal/bot/proc/attack_hand", function* attack_hand(f: Frame, H: Value) {
	if (H.a_intent == "help") {
		yield* this.interact(H);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// bot.dm:236
rt.def("/mob/living/simple_animal/bot/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!this.topic_denied(user)) {
		yield* this.interact(user);
	} else {
		to_chat(user, `<span class='warning'>${this}'s interface is not responding!</span>`);
	}
	return f.dot;
}, true);

// bot.dm:242
rt.def("/mob/living/simple_animal/bot/proc/interact", function* interact(f: Frame, user: Value) {
	yield* this.show_controls(user);
	return f.dot;
}, true);

// bot.dm:245
rt.def("/mob/living/simple_animal/bot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (!this.locked) {
			this.open = (!this.open ? 1 : 0);
			to_chat(user, `<span class='notice'>The maintenance panel is now ${this.open ? "opened" : "closed"}.</span>`);
		} else {
			to_chat(user, "<span class='warning'>The maintenance panel is locked.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/card/id")) || rt.istype(W, T("/obj/item/device/pda"))) {
		if ((yield* this.bot_core.allowed(user)) && !this.open && !this.emagged) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `Controls are now ${this.locked ? "locked." : "unlocked."}`);
		} else {
			if (this.emagged) {
				to_chat(user, "<span class='danger'>ERROR</span>");
			}
			if (this.open) {
				to_chat(user, "<span class='warning'>Please close the access panel before locking it.</span>");
			} else {
				to_chat(user, "<span class='warning'>Access denied.</span>");
			}
		}
	} else if (rt.istype(W, T("/obj/item/device/paicard"))) {
		yield* this.insertpai(user, W);
	} else if (rt.istype(W, T("/obj/item/weapon/hemostat")) && this.paicard) {
		if (this.open) {
			to_chat(user, "<span class='warning'>Close the access panel before manipulating the personality slot!</span>");
		} else {
			to_chat(user, `<span class='notice'>You attempt to pull ${this.paicard} free...</span>`);
			if (yield* do_after(user, 30, { target: this })) {
				if (this.paicard) {
					user.visible_message(`<span class='notice'>${user} uses ${W} to pull ${this.paicard} out of ${this.bot_name}!</span>`, `<span class='notice'>You pull ${this.paicard} out of ${this.bot_name} with ${W}.</span>`);
					yield* this.ejectpai(user);
				}
			}
		}
	} else {
		user.changeNext_move(8);
		if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
			if (this.health >= this.maxHealth) {
				to_chat(user, `<span class='warning'>${this} does not need a repair!</span>`);
				return f.dot;
			}
			if (!this.open) {
				to_chat(user, "<span class='warning'>Unable to repair with the maintenance panel closed!</span>");
				return f.dot;
			}
			if (yield* (WT = W).remove_fuel(0, user)) {
				yield* this.adjustHealth(-10);
				user.visible_message(`${user} repairs ${this}!`, `<span class='notice'>You repair ${this}.</span>`);
			} else {
				to_chat(user, "<span class='warning'>The welder must be on for this task!</span>");
			}
		} else {
			if (W.force) {
				yield* do_sparks(5, 1, this);
			}
			yield* parent_proc();
		}
	}
	return f.dot;
}, true);

// bot.dm:294
rt.def("/mob/living/simple_animal/bot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (Proj && (Proj.damage_type == "brute" || Proj.damage_type == "fire")) {
		if (prob(75) && Proj.damage > 0) {
			yield* do_sparks(5, 1, this);
		}
	}
	return (yield* parent_proc());
}, true);

// bot.dm:300
rt.def("/mob/living/simple_animal/bot/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let was_on: Value = this.on;
	(rt.modSrcVar(f, "stat", EMPED, rt.bitOr));
	yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
	if (this.paicard) {
		yield* this.paicard.emp_act(severity);
		this.visible_message(`${this.paicard} is flies out of ${this.bot_name}!`, `<span class='warning'>You are forcefully ejected from ${this.bot_name}!</span>`);
		yield* this.ejectpai(0);
	}
	if (this.on) {
		yield* this.turn_off();
	}
	rt.spawnTail(f, severity * 300, "/mob/living/simple_animal/bot/proc/emp_act: spawn at modules/mob/living/simple_animal/bot/bot.dm:309", severity, was_on);
	return f.dot;
}, true);

// a spawn(multiply(live(severity), 300)) body of /mob/living/simple_animal/bot/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/emp_act: spawn at modules/mob/living/simple_animal/bot/bot.dm:309", function* (f: Frame, severity: Value, was_on: Value) {
	(rt.modSrcVar(f, "stat", 16777199, rt.bitAnd));
	if (was_on) {
		yield* this.turn_on();
	}
	return null;
});

// bot.dm:315
rt.def("/mob/living/simple_animal/bot/proc/set_custom_texts", function set_custom_texts(f: Frame) {
	this.text_hack = `You hack ${this.name}.`;
	this.text_dehack = `You reset ${this.name}.`;
	this.text_dehack_fail = `You fail to reset ${this.name}.`;
	return f.dot;
});

// bot.dm:320
rt.def("/mob/living/simple_animal/bot/proc/speak", function* speak(f: Frame, message: Value, channel: Value) {
	if (!this.on || !message) {
		return f.dot;
	}
	if (channel && rt.index(this.Radio.channels, channel)) {
		yield* this.Radio.talk_into(this, message, channel, this.get_spans(), (yield* this.get_default_language()));
	} else {
		yield* this.say(message);
	}
	return f.dot;
}, true);

// bot.dm:328
rt.def("/mob/living/simple_animal/bot/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// bot.dm:331
rt.def("/mob/living/simple_animal/bot/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot != 0) {
		return f.dot;
	}
	if (message_mode === "headset") {
		yield* this.Radio.talk_into(this, message, null, spans, language);
		return REDUCE_RANGE;
	} else if (message_mode === "department") {
		yield* this.Radio.talk_into(this, message, message_mode, spans, language);
		return REDUCE_RANGE;
	}
	if (rt.isIn(f, message_mode, GLOB.radiochannels)) {
		yield* this.Radio.talk_into(this, message, message_mode, spans, language);
		return REDUCE_RANGE;
	}
	return 0;
}, true);

// Speed: for a scan that looks for mobs (medbot patients, cleanbots going after mobs), true if some mob of scan_type might be inside
// view(scan_range, src) or on an adjacent turf: same z, within scan_range of src's turf (view is a square box). Reads the atoms'
// loc/x/y/z/type directly. Conservative: any doubt (src not on a turf, odd range) says true, so the real scan runs.
const botMobTypeOk = new Map();
function botScanTurf(o: any) {
	let t = o;
	for (let i = 0; i < 20 && t !== null && t !== undefined && t.x === 0; i++) t = t.loc;
	return t === undefined ? null : t;
}
function botScanMobCandidate(f: Frame, scan_type: any, scan_range: any) {
	if (typeof scan_range !== "number" || !(scan_range >= 1)) return true;
	if (scan_type === null || typeof scan_type !== "object" || typeof scan_type.isSubtypeOf !== "function") return true;
	const mobT = T("/mob");
	let isMob = botMobTypeOk.get(scan_type);
	if (isMob === undefined) { isMob = scan_type.isSubtypeOf(mobT); botMobTypeOk.set(scan_type, isMob); }
	if (!isMob) return true;
	const st = botScanTurf(f.src);
	if (st === null || !(st.x > 0)) return true;
	const sx = st.x, sy = st.y, sz = st.z;
	const ml: any = rt.gl("mob_list");
	const items = ml.items;
	for (let i = 0; i < items.length; i++) {
		const m = items[i];
		if (m === null || typeof m !== "object" || m.deleted) continue;
		if (!m.type.isSubtypeOf(scan_type)) continue;
		const t = botScanTurf(m);
		if (t === null) continue; // in nullspace (a preview mannequin): never in view()
		if (!(t.x > 0)) return true;
		if (t.z === sz && Math.abs(t.x - sx) <= scan_range && Math.abs(t.y - sy) <= scan_range) return true;
	}
	return false;
}

// bot.dm:362
rt.def("/mob/living/simple_animal/bot/proc/scan", function* scan(f: Frame, scan_type: Value, old_target: Value, scan_range: Value) {
	let _T: Value = null, scan: Value = null, final_result: Value = null, turfy: Value = null, deepscan: Value = null, final_result_5: Value = null;
	scan_range ??= 7;
	if (!botScanMobCandidate(f, scan_type, scan_range)) {
		if (this.shuffle) this.shuffle = 0;
		return f.dot;
	}
	if (!(_T = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	let adjacent: Value = _T.GetAtmosAdjacentTurfs(1);
	if (this.shuffle) {
		adjacent = shuffle(adjacent);
		this.shuffle = 0;
	}
	for (scan of each(adjacent)) {
		if (this.check_bot(scan)) {
			continue;
		}
		if (isturf(scan_type)) {
			if (final_result = (yield* this.checkscan(scan, scan_type, old_target))) {
				return final_result;
			}
		} else {
			turfy = scan;
			deepscan = null;
			for (deepscan of each(turfy.contents)) {
				if (final_result_5 = (yield* this.checkscan(deepscan, scan_type, old_target))) {
					return final_result_5;
				}
			}
		}
	}
	scan = null;
	for (scan of each(shuffle(view(scan_range, this)) - adjacent)) {
		if (final_result = (yield* this.checkscan(scan, scan_type, old_target))) {
			return final_result;
		}
	}
	return f.dot;
}, true);

// bot.dm:388
rt.def("/mob/living/simple_animal/bot/proc/checkscan", function* checkscan(f: Frame, scan: Value, scan_type: Value, old_target: Value) {
	let scan_result: Value = null;
	if (!rt.op(f, "IsType", [], [scan, scan_type])) {
		return 0;
	}
	if (rt.isIn(f, scan, this.ignore_list) || scan == old_target) {
		return 0;
	}
	if (scan_result = (yield* this.process_scan(scan))) {
		return scan_result;
	} else {
		return 0;
	}
}, true);

// bot.dm:401
rt.def("/mob/living/simple_animal/bot/proc/check_bot", function check_bot(f: Frame, targ: Value) {
	let _T: Value = null, C: Value = null;
	if (!(_T = rt.getStep(f, targ, 0))) return f.dot;
	for (C of each(_T.contents)) {
		if (rt.op(f, "IsType", [], [C, this.type]) && C != this) {
			return 1;
		}
	}
	return f.dot;
});

// bot.dm:413
rt.def("/mob/living/simple_animal/bot/proc/add_to_ignore", function add_to_ignore(f: Frame, subject: Value) {
	if (rt.len(f, this.ignore_list) < 50) {
		(rt.modSrcVar(f, "ignore_list", subject, rt.bitOr));
	} else {
		if (!(rt.len(f, this.ignore_list) >= subject)) return f.dot;
		this.ignore_list -= rt.index(this.ignore_list, 1);
		(rt.modSrcVar(f, "ignore_list", subject, rt.bitOr));
	}
	return f.dot;
});

// bot.dm:425
rt.def("/mob/living/simple_animal/bot/proc/bot_move", function bot_move(f: Frame, dest: Value, move_speed: Value) {
	let step_count: Value = null, step_number: Value = null;
	if (!dest || !this.path || rt.len(f, this.path) == 0) {
		this.path = list();
		return 0;
	}
	dest = rt.getStep(f, dest, 0);
	let last_node: Value = rt.getStep(f, rt.index(this.path, rt.len(f, this.path)), 0);
	if (rt.getStep(f, this, 0) == dest) {
		return 1;
	} else if (dest != last_node) {
		this.path = list();
		return 0;
	}
	if ((step_count = move_speed ? move_speed : this.base_speed) >= 1 && this.tries < BOT_STEP_MAX_RETRIES) {
		step_number = 0;
		while (step_number < step_count) {
			rt.spawnTail(f, BOT_STEP_DELAY * step_number, "/mob/living/simple_animal/bot/proc/bot_move: spawn at modules/mob/living/simple_animal/bot/bot.dm:439", dest, move_speed, last_node, step_count, step_number);
			step_number++;
		}
	} else {
		return 0;
	}
	return 1;
});

// a spawn(multiply(4, live(step_number))) body of /mob/living/simple_animal/bot/proc/bot_move, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/bot_move: spawn at modules/mob/living/simple_animal/bot/bot.dm:439", function* (f: Frame, dest: Value, move_speed: Value, last_node: Value, step_count: Value, step_number: Value) {
	yield* this.bot_step(dest);
	return null;
});

// bot.dm:447
rt.def("/mob/living/simple_animal/bot/proc/bot_step", function* bot_step(f: Frame, dest: Value) {
	if (!this.path) {
		return 0;
	}
	if (rt.len(f, this.path) > 1) {
		yield* step_towards(this, rt.index(this.path, 1));
		if (rt.getStep(f, this, 0) == rt.index(this.path, 1)) {
			this.path -= rt.index(this.path, 1);
			this.tries = 0;
		} else {
			this.tries++;
			return 0;
		}
	} else if (rt.len(f, this.path) == 1) {
		yield* step_to(this, dest);
		this.path = list();
	}
	return 1;
}, true);

// bot.dm:464
rt.def("/mob/living/simple_animal/bot/proc/check_bot_access", function check_bot_access(f: Frame) {
	if (!(this.mode != BOT_SUMMON && this.mode != BOT_RESPONDING)) return f.dot;
	this.access_card.access = this.prev_access;
	return f.dot;
});

// bot.dm:468
rt.def("/mob/living/simple_animal/bot/proc/call_bot", function* call_bot(f: Frame, caller: Value, waypoint: Value, message: Value) {
	message ??= 1;
	this.bot_reset();
	let end_area: Value = get_area(waypoint);
	if (this.client) {
		to_chat(this, `<span class='noticebig'>Priority waypoint set by ${bicon(caller)} <b>${caller}</b>. Proceed to <b>${end_area.name}<>.`);
	}
	let all_access: Value = (yield* new_(T("/obj/item/weapon/card/id")));
	let All: Value = (yield* new_(T("/datum/job/captain")));
	all_access.access = All.get_access();
	this.path = (yield* get_path_to(this, waypoint, P("/turf/proc/Distance_cardinal"), 0, 200, { id: all_access }));
	this.calling_ai = caller;
	this.ai_waypoint = waypoint;
	if (this.path && rt.len(f, this.path)) {
		if (!this.on) {
			yield* this.turn_on();
		}
		this.access_card = all_access;
		if (message) {
			to_chat(this.calling_ai, `<span class='notice'>${bicon(this)} ${this.name} called to ${end_area.name}. ${rt.len(f, this.path) - 1} meters to destination.</span>`);
		}
		this.pathset = 1;
		this.mode = BOT_RESPONDING;
		this.tries = 0;
	} else {
		if (message) {
			to_chat(this.calling_ai, "<span class='danger'>Failed to calculate a valid route. Ensure destination is clear of obstructions and within range.</span>");
		}
		this.calling_ai = null;
		this.path = list();
	}
	return f.dot;
}, true);

// bot.dm:500
rt.def("/mob/living/simple_animal/bot/proc/call_mode", function call_mode(f: Frame) {
	let success: Value = null;
	let $0: any, $1: any, $2: any;
	if (success = this.bot_move(this.ai_waypoint, 3)) return f.dot;
	if (this.calling_ai) {
		$0 = this.calling_ai;
		$1 = bicon(this);
		if (rt.getStep(f, this, 0) == this.ai_waypoint) {
			$2 = `<span class='notice'>${this} successfully arrived to waypoint.</span>`;
		} else {
			$2 = `<span class='danger'>${this} failed to reach waypoint.</span>`;
		}
		to_chat($0, `${$1} ${$2}`);
		this.calling_ai = null;
	}
	this.bot_reset();
	return f.dot;
});

// bot.dm:509
rt.def("/mob/living/simple_animal/bot/proc/bot_reset", function bot_reset(f: Frame) {
	if (this.calling_ai) {
		to_chat(this.calling_ai, "<span class='danger'>Call command to a bot has been reset.</span>");
		this.calling_ai = null;
	}
	this.path = list();
	this.summon_target = null;
	this.pathset = 0;
	this.access_card.access = this.prev_access;
	this.tries = 0;
	this.mode = 0;
	this.diag_hud_set_botstat();
	this.diag_hud_set_botmode();
	return f.dot;
});

// bot.dm:528
rt.def("/mob/living/simple_animal/bot/proc/bot_patrol", function* bot_patrol(f: Frame) {
	yield* this.patrol_step();
	rt.spawnTail(f, 5, "/mob/living/simple_animal/bot/proc/bot_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:529");
	return f.dot;
}, true);

// a spawn(5) body of /mob/living/simple_animal/bot/proc/bot_patrol, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/bot_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:529", function* (f: Frame) {
	if (this.mode == 5) {
		yield* this.patrol_step();
	}
	return null;
});

// bot.dm:536
rt.def("/mob/living/simple_animal/bot/proc/start_patrol", function* start_patrol(f: Frame) {
	if (this.tries >= BOT_STEP_MAX_RETRIES) {
		this.auto_patrol = 0;
		this.tries = 0;
		yield* this.speak("Unable to start patrol.");
		return f.dot;
	}
	if (!this.auto_patrol) {
		this.mode = 0;
		return f.dot;
	}
	if (this.patrol_target) {
		rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/proc/start_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:548");
	} else {
		yield* this.speak("Engaging patrol mode.");
		yield* this.find_patrol_target();
		this.tries++;
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/proc/start_patrol, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/start_patrol: spawn at modules/mob/living/simple_animal/bot/bot.dm:548", function* (f: Frame) {
	yield* this.calc_path();
	if (rt.len(f, this.path) == 0) {
		this.patrol_target = null;
		return f.dot;
	}
	this.mode = 5;
	return null;
});

// bot.dm:567
rt.def("/mob/living/simple_animal/bot/proc/patrol_step", function* patrol_step(f: Frame) {
	let next: Value = null, moved: Value = null;
	if (this.client) {
		return f.dot;
	}
	if (this.loc == this.patrol_target) {
		if (!this.get_next_patrol_target()) {
			yield* this.find_patrol_target();
		}
		return f.dot;
	} else if (rt.len(f, this.path) > 0 && this.patrol_target) {
		if ((next = rt.index(this.path, 1)) == this.loc) {
			this.path -= next;
			return f.dot;
		}
		if (!(moved = this.bot_move(this.patrol_target))) {
			rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/proc/patrol_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:582", next, moved);
		}
	} else {
		this.mode = BOT_START_PATROL;
	}
	return f.dot;
}, true);

// a spawn(2) body of /mob/living/simple_animal/bot/proc/patrol_step, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/patrol_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:582", function* (f: Frame, next: Value, moved: Value) {
	yield* this.calc_path();
	if (rt.len(f, this.path) == 0) {
		yield* this.find_patrol_target();
	}
	this.tries = 0;
	return null;
});

// bot.dm:595
rt.def("/mob/living/simple_animal/bot/proc/find_patrol_target", function* find_patrol_target(f: Frame) {
	this.nearest_beacon = null;
	this.new_destination = null;
	this.find_nearest_beacon();
	if (this.nearest_beacon) {
		this.patrol_target = this.nearest_beacon_loc;
		this.destination = this.next_destination;
	} else {
		this.auto_patrol = 0;
		this.mode = BOT_IDLE;
		yield* this.speak("Disengaging patrol mode.");
	}
	return f.dot;
}, true);

// bot.dm:606
rt.def("/mob/living/simple_animal/bot/proc/get_next_patrol_target", function get_next_patrol_target(f: Frame) {
	let NB: Value = null;
	for (NB of each(rt.index(GLOB.navbeacons, `${this.z}`), T("/obj/machinery/navbeacon"))) {
		if (NB.location == this.next_destination) {
			this.destination = this.new_destination;
			this.patrol_target = NB.loc;
			this.next_destination = rt.index(NB.codes, "next_patrol");
			return 1;
		}
	}
	return f.dot;
});

// bot.dm:614
rt.def("/mob/living/simple_animal/bot/proc/find_nearest_beacon", function find_nearest_beacon(f: Frame) {
	let NB: Value = null, dist: Value = null;
	for (NB of each(rt.index(GLOB.navbeacons, `${this.z}`), T("/obj/machinery/navbeacon"))) {
		dist = get_dist(this, NB);
		if (this.nearest_beacon) {
			if (dist > 1 && dist < get_dist(this, this.nearest_beacon_loc)) {
				this.nearest_beacon = NB.location;
				this.nearest_beacon_loc = NB.loc;
				this.next_destination = rt.index(NB.codes, "next_patrol");
			} else {
				continue;
			}
		} else if (dist > 1) {
			this.nearest_beacon = NB.location;
			this.nearest_beacon_loc = NB.loc;
		}
	}
	this.patrol_target = this.nearest_beacon_loc;
	this.destination = this.nearest_beacon;
	return f.dot;
});

// bot.dm:632
rt.def("/mob/living/simple_animal/bot/proc/bot_control", function* bot_control(f: Frame, command: Value, user: Value, user_turf: Value, user_access: Value) {
	user_access ??= list();
	if (!this.on || this.emagged == 2 || this.remote_disabled) {
		return 1;
	}
	if (this.client) {
		this.bot_control_message(command, user, user_turf, user_access);
	}
	if (command === "patroloff") {
		this.bot_reset();
		this.auto_patrol = 0;
	} else if (command === "patrolon") {
		this.auto_patrol = 1;
	} else if (command === "summon") {
		this.bot_reset();
		this.summon_target = user_turf;
		if (rt.len(f, user_access) != 0) {
			this.access_card.access = user_access + this.prev_access;
		}
		this.mode = BOT_SUMMON;
		yield* this.speak("Responding.", this.radio_channel);
		this.calc_summon_path();
	} else if (command === "ejectpai") {
		yield* this.ejectpairemote(user);
	}
	return f.dot;
}, true);

// bot.dm:660
rt.def("/mob/living/simple_animal/bot/proc/bot_control_message", function bot_control_message(f: Frame, command: Value, user: Value, user_turf: Value, user_access: Value) {
	let a: Value = null;
	if (command === "patroloff") {
		to_chat(this, "<span class='warning big'>STOP PATROL</span>");
	} else if (command === "patrolon") {
		to_chat(this, "<span class='warning big'>START PATROL</span>");
	} else if (command === "summon") {
		a = get_area(user_turf);
		to_chat(this, `<span class='warning big'>PRIORITY ALERT:${user} in ${a.name}!</span>`);
	} else if (command === "stop") {
		to_chat(this, "<span class='warning big'>STOP!</span>");
	} else if (command === "go") {
		to_chat(this, "<span class='warning big'>GO!</span>");
	} else if (command === "home") {
		to_chat(this, "<span class='warning big'>RETURN HOME!</span>");
	} else if (command === "ejectpai") {
		return f.dot;
	} else {
		to_chat(this, `<span class='warning'>Unidentified control sequence recieved:${command}</span>`);
	}
	return f.dot;
});

// bot.dm:682
rt.def("/mob/living/simple_animal/bot/proc/bot_summon", function bot_summon(f: Frame) {
	this.summon_step();
	return f.dot;
});

// bot.dm:687
rt.def("/mob/living/simple_animal/bot/proc/calc_path", function* calc_path(f: Frame, avoid: Value) {
	this.check_bot_access();
	this.path = (yield* get_path_to(this, this.patrol_target, P("/turf/proc/Distance_cardinal"), 0, 120, { id: this.access_card, exclude: avoid }));
	return f.dot;
}, true);

// bot.dm:691
rt.def("/mob/living/simple_animal/bot/proc/calc_summon_path", function calc_summon_path(f: Frame, avoid: Value) {
	this.check_bot_access();
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/proc/calc_summon_path: spawn at modules/mob/living/simple_animal/bot/bot.dm:692", avoid);
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/proc/calc_summon_path, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/calc_summon_path: spawn at modules/mob/living/simple_animal/bot/bot.dm:692", function* (f: Frame, avoid: Value) {
	this.path = (yield* get_path_to(this, this.summon_target, P("/turf/proc/Distance_cardinal"), 0, 150, { id: this.access_card, exclude: avoid }));
	if (!rt.len(f, this.path)) {
		yield* this.speak("Summon command failed, destination unreachable.", this.radio_channel);
		this.bot_reset();
	}
	return null;
});

// bot.dm:703
rt.def("/mob/living/simple_animal/bot/proc/summon_step", function summon_step(f: Frame) {
	let next: Value = null, moved: Value = null;
	if (this.client) {
		return f.dot;
	}
	if (this.loc == this.summon_target) {
		this.bot_reset();
		return f.dot;
	} else if (rt.len(f, this.path) > 0 && this.summon_target) {
		if ((next = rt.index(this.path, 1)) == this.loc) {
			this.path -= next;
			return f.dot;
		}
		if (!(moved = this.bot_move(this.summon_target, 3))) {
			rt.spawnTail(f, 2, "/mob/living/simple_animal/bot/proc/summon_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:715", next, moved);
		}
	} else {
		this.calc_summon_path();
	}
	return f.dot;
});

// a spawn(2) body of /mob/living/simple_animal/bot/proc/summon_step, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/proc/summon_step: spawn at modules/mob/living/simple_animal/bot/bot.dm:715", function* (f: Frame, next: Value, moved: Value) {
	this.calc_summon_path();
	this.tries = 0;
	return null;
});

// bot.dm:723
rt.def("/mob/living/simple_animal/bot/proc/Bump", function* Bump(f: Frame, M: Value) {
	let D: Value = null;
	f.dot = (yield* parent_proc());
	if (!((rt.istype(M, T("/obj/machinery/door/airlock")) || rt.istype(M, T("/obj/machinery/door/window"))) && this.access_card !== null)) return f.dot;
	if (!(D = M).check_access(this.access_card)) return f.dot;
	yield* D.open();
	this.frustration = 0;
	return f.dot;
}, true);

// bot.dm:731
rt.def("/mob/living/simple_animal/bot/proc/show_controls", function* show_controls(f: Frame, M: Value) {
	let popup: Value = null;
	(rt.modSrcVar(f, "users", M, rt.bitOr));
	let dat: Value = this.get_controls(M);
	(popup = (yield* new_(T("/datum/browser"), M, this.window_id, this.window_name, 350, 600))).set_content(dat);
	yield* popup.open({ use_onclose: 0 });
	yield* onclose(M, this.window_id, { ref: this });
	return f.dot;
}, true);

// bot.dm:741
rt.def("/mob/living/simple_animal/bot/proc/update_controls", function* update_controls(f: Frame) {
	let M: Value = null;
	for (M of each(this.users, T("/mob"))) {
		yield* this.show_controls(M);
	}
	return f.dot;
}, true);

// bot.dm:745
rt.def("/mob/living/simple_animal/bot/proc/get_controls", function get_controls(f: Frame, M: Value) {
	return "PROTOBOT - NOT FOR USE";
});

// bot.dm:749
rt.def("/mob/living/simple_animal/bot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (rt.at(href_list, "close")) {
		if (rt.isIn(f, f.usr, this.users)) {
			yield* this.users.Remove(f.usr);
		}
		return 1;
	}
	if (this.topic_denied(f.usr)) {
		to_chat(f.usr, `<span class='warning'>${this}'s interface is not responding!</span>`);
		return 1;
	}
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "power") && ((yield* this.bot_core.allowed(f.usr)) || !this.locked)) {
		if (this.on) {
			yield* this.turn_off();
		} else {
			yield* this.turn_on();
		}
	}
	const item = rt.at(href_list, "operation");
	if (item === "patrol") {
		this.auto_patrol = (!this.auto_patrol ? 1 : 0);
		this.bot_reset();
	} else if (item === "remote") {
		this.remote_disabled = (!this.remote_disabled ? 1 : 0);
	} else if (item === "hack") {
		if (this.emagged != 2) {
			this.emagged = 2;
			this.hacked = 1;
			this.locked = 1;
			to_chat(f.usr, `<span class='warning'>${this.text_hack}</span>`);
			this.bot_reset();
		} else if (!this.hacked) {
			to_chat(f.usr, `<span class='boldannounce'>${this.text_dehack_fail}</span>`);
		} else {
			this.emagged = 0;
			this.hacked = 0;
			to_chat(f.usr, `<span class='notice'>${this.text_dehack}</span>`);
			this.bot_reset();
		}
	} else if (item === "ejectpai") {
		if (this.paicard && (!this.locked || rt.istype(f.usr, T("/mob/living/silicon")) || IsAdminGhost(f.usr))) {
			to_chat(f.usr, `<span class='notice'>You eject ${this.paicard} from ${this.bot_name}</span>`);
			yield* this.ejectpai(f.usr);
		}
	}
	yield* this.update_controls();
	return f.dot;
}, true);

// bot.dm:792
rt.def("/mob/living/simple_animal/bot/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.on}`;
	return f.dot;
});

rt.type(10941, "/obj/machinery/bot_core", "/obj/machinery", {
	owner: null,
	use_power: 0,
});

// bot.dm:800
rt.def("/obj/machinery/bot_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.owner = this.loc;
	if (rt.istype(this.owner, T("/mob/living/simple_animal/bot"))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// bot.dm:806
rt.def("/mob/living/simple_animal/bot/proc/topic_denied", function topic_denied(f: Frame, user: Value) {
	if (!user.canUseTopic(this)) {
		return 1;
	}
	if (this.emagged == 2) {
		if (!this.hacked) {
			return 1;
		} else if (!rt.istype(user, T("/mob/living/silicon")) && !IsAdminGhost(user)) {
			return 1;
		}
	}
	return 0;
});

// bot.dm:818
rt.def("/mob/living/simple_animal/bot/proc/hack", function hack(f: Frame, user: Value) {
	let hack: Value = null;
	let $0: any, $1: any;
	if (rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user)) {
		if (this.emagged == 2) {
			$0 = "Software compromised! Unit may exhibit dangerous or erratic behavior.";
		} else {
			$0 = "Unit operating normally. Release safety lock?";
		}
		hack += `${$0}<BR>`;
		$0 = this;
		if (this.emagged) {
			$1 = "<span class='bad'>DANGER</span>";
		} else {
			$1 = "Engaged";
		}
		hack += fmt("Harm Prevention Safety System: <A href='?src=＃;operation=hack'>＀</A><BR>", [$0, $1]);
	} else if (!this.locked) {
		$0 = this;
		if (this.remote_disabled) {
			$1 = "Disconnected";
		} else {
			$1 = "Connected";
		}
		hack += fmt("Remote network control radio: <A href='?src=＃;operation=remote'>＀</A><BR>", [$0, $1]);
	}
	return hack;
});

// bot.dm:826
rt.def("/mob/living/simple_animal/bot/proc/showpai", function showpai(f: Frame, user: Value) {
	let eject: Value = "";
	if (!this.locked || rt.istype(f.usr, T("/mob/living/silicon")) || IsAdminGhost(f.usr)) {
		if (this.paicard || this.allow_pai) {
			eject += "Personality card status: ";
			if (this.paicard) {
				if (this.client) {
					eject += fmt("<A href='?src=＃;operation=ejectpai'>Active</A>", [this]);
				} else {
					eject += fmt("<A href='?src=＃;operation=ejectpai'>Inactive</A>", [this]);
				}
			} else if (!this.allow_pai || this.key) {
				eject += "Unavailable";
			} else {
				eject += "Not inserted";
			}
			eject += "<BR>";
		}
		eject += "<BR>";
	}
	return eject;
});

// bot.dm:845
rt.def("/mob/living/simple_animal/bot/proc/insertpai", function* insertpai(f: Frame, user: Value, card: Value) {
	if (this.paicard) {
		to_chat(user, `<span class='warning'>A ${this.paicard} is already inserted!</span>`);
	} else if (this.allow_pai && !this.key) {
		if (!this.locked && !this.open) {
			if (card.pai && card.pai.mind) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				yield* card.forceMove(this);
				this.paicard = card;
				user.visible_message(`${user} inserts ${card} into ${this}!`, `<span class='notice'>You insert ${card} into ${this}.</span>`);
				yield* this.paicard.pai.mind.transfer_to(this);
				to_chat(this, `<span class='notice'>You sense your form change as you are uploaded into ${this}.</span>`);
				this.bot_name = this.name;
				this.name = this.paicard.pai.name;
				this.faction = (yield* user.faction.Copy());
				add_logs(user, this.paicard.pai, `uploaded to ${this.bot_name},`);
				return 1;
			} else {
				to_chat(user, `<span class='warning'>${card} is inactive.</span>`);
			}
		} else {
			to_chat(user, "<span class='warning'>The personality slot is locked.</span>");
		}
	} else {
		to_chat(user, `<span class='warning'>${this} is not compatible with ${card}</span>`);
	}
	return f.dot;
}, true);

// bot.dm:870
rt.def("/mob/living/simple_animal/bot/proc/ejectpai", function* ejectpai(f: Frame, user: Value, announce: Value) {
	announce ??= 1;
	if (!this.paicard) return f.dot;
	if (this.mind && this.paicard.pai) {
		yield* this.mind.transfer_to(this.paicard.pai);
	} else if (this.paicard.pai) {
		this.paicard.pai.key = this.key;
	} else {
		yield* this.ghostize(0);
	}
	this.key = null;
	yield* this.paicard.forceMove(this.loc);
	if (user) {
		add_logs(user, this.paicard.pai, `ejected from ${this.bot_name},`);
	} else {
		add_logs(this, this.paicard.pai, "ejected");
	}
	if (announce) {
		to_chat(this.paicard.pai, `<span class='notice'>You feel your control fade as ${this.paicard} ejects from ${this.bot_name}.</span>`);
	}
	this.paicard = null;
	this.name = this.bot_name;
	this.faction = rt.initial(f, this, "faction");
	return f.dot;
}, true);

// bot.dm:889
rt.def("/mob/living/simple_animal/bot/proc/ejectpairemote", function* ejectpairemote(f: Frame, user: Value) {
	if (!((yield* this.bot_core.allowed(user)) && this.paicard)) return f.dot;
	yield* this.speak("Ejecting personality chip.", this.radio_channel);
	yield* this.ejectpai(user);
	return f.dot;
}, true);

// bot.dm:894
rt.def("/mob/living/simple_animal/bot/proc/Login", function* Login(f: Frame) {
	f.dot = (yield* parent_proc());
	this.access_card.access += this.player_access;
	this.diag_hud_set_botmode();
	this.activate_data_hud();
	return f.dot;
}, true);

// bot.dm:900
rt.def("/mob/living/simple_animal/bot/proc/Logout", function* Logout(f: Frame) {
	f.dot = (yield* parent_proc());
	this.bot_reset();
	return f.dot;
}, true);

// bot.dm:904
rt.def("/mob/living/simple_animal/bot/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	yield* this.update_icon();
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// bot.dm:909
rt.def("/mob/living/simple_animal/bot/ghost", function* ghost(f: Frame) {
	if (this.stat != 2) {
		yield* parent_proc();
	}
	if (!(this.paicard && (!this.client || this.stat == 2))) return f.dot;
	yield* this.ejectpai(0);
	return f.dot;
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// bot.dm:915
rt.def("/mob/living/simple_animal/bot/proc/sentience_act", function sentience_act(f: Frame) {
	this.faction -= "silicon";
	return f.dot;
});

// bot.dm:919
rt.def("/mob/living/simple_animal/bot/proc/activate_data_hud", function activate_data_hud(f: Frame) {
	let datahud: Value = null;
	if (!this.data_hud_type) {
		return f.dot;
	}
	(datahud = rt.index(GLOB.huds, this.data_hud_type)).add_hud_to(this);
	return f.dot;
});
