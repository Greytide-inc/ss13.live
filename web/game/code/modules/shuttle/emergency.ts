// Based on /tg/station's code/modules/shuttle/emergency.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10433, "/obj/machinery/computer/emergency_shuttle", "/obj/machinery/computer", {
	auth_need: 3,
	authorized: null,
	icon_screen: "shuttle",
	icon_keyboard: "tech_key",
	name: "emergency shuttle console",
	desc: "For shuttle control.",
});

// emergency.dm:12
rt.def("/obj/machinery/computer/emergency_shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.authorized = list();
	return f.dot;
});

// emergency.dm:15
rt.def("/obj/machinery/computer/emergency_shuttle/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/card/id"))) {
		yield* this.say("Please equip your ID card into your ID slot to authenticate.");
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// emergency.dm:21
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.human_adjacent_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "emergency_shuttle_console", this.name, 400, 400, master_ui, state))).open();
	return f.dot;
}, true);

// emergency.dm:28
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, i: Value = null, ID: Value = null, name: Value = null, job: Value = null;
	rt.setAt((data = list()), "timer_str", GLOB.SSshuttle.emergency.getTimerStr());
	rt.setAt(data, "engines_started", (GLOB.SSshuttle.emergency.mode == "igniting" ? 1 : 0));
	rt.setAt(data, "authorizations_remaining", max(this.auth_need - rt.len(f, this.authorized), 0));
	let A: Value = list();
	for (i of each(this.authorized)) {
		ID = i;
		name = ID.registered_name;
		job = ID.assignment;
		if (this.emagged) {
			name = Gibberish(name, 0);
			job = Gibberish(job, 0);
		}
		A += list(rt.alist(f, ["name", name, "job", job]));
	}
	rt.setAt(data, "authorizations", A);
	rt.setAt(data, "enabled", (((GLOB.SSshuttle.emergency.mode == "docked" ? 1 : 0) || (GLOB.SSshuttle.emergency.mode == "igniting" ? 1 : 0)) && (GLOB.SSshuttle.emergency.mode != "igniting" ? 1 : 0)));
	rt.setAt(data, "emagged", this.emagged);
	return data;
});

// emergency.dm:50
rt.def("/obj/machinery/computer/emergency_shuttle/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let ID: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (GLOB.SSshuttle.emergency.mode == "igniting") {
		return f.dot;
	}
	if (!(GLOB.SSshuttle.emergency.mode == "docked" || GLOB.SSshuttle.emergency.mode == "igniting")) {
		return f.dot;
	}
	let user: Value = f.usr;
	f.dot = 0;
	if (!(ID = user.get_idcard())) {
		to_chat(user, "<span class='warning'>You don't have an ID.</span>");
		return f.dot;
	}
	if (!rt.isIn(f, 19, ID.access)) {
		to_chat(user, "<span class='warning'>The access level of your card is not high enough.</span>");
		return f.dot;
	}
	let old_len: Value = rt.len(f, this.authorized);
	if (action === "authorize") {
		f.dot = this.authorize(user);
	} else if (action === "repeal") {
		this.authorized -= ID;
	} else if (action === "abort") {
		if (rt.len(f, this.authorized)) {
			this.authorized.Cut();
			f.dot = 1;
		}
	}
	if (!(old_len != rt.len(f, this.authorized) && GLOB.SSshuttle.emergency.mode != "igniting")) return f.dot;
	let alert: Value = (rt.len(f, this.authorized) > old_len ? 1 : 0);
	let repeal: Value = (rt.len(f, this.authorized) < old_len ? 1 : 0);
	let remaining: Value = this.auth_need - rt.len(f, this.authorized);
	if (rt.len(f, this.authorized) && remaining) {
		minor_announce(`${remaining} authorizations needed until shuttle is launched early`, null, alert);
	}
	if (!repeal) return f.dot;
	minor_announce(`Early launch authorization revoked, ${remaining} authorizations needed`);
	return f.dot;
}, true);

// emergency.dm:96
rt.def("/obj/machinery/computer/emergency_shuttle/proc/authorize", function authorize(f: Frame, user: Value, source: Value) {
	let ID: Value = null, i: Value = null, other: Value = null;
	if (rt.isIn(f, (ID = user.get_idcard()), this.authorized)) {
		return 0;
	}
	for (i of each(this.authorized)) {
		if ((other = i).registered_name == ID.registered_name) {
			return 0;
		}
	}
	this.authorized += ID;
	message_admins(`${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has authorized early shuttle launch`, 0, 1);
	log_game(`${key_name(user)} has authorized early shuttle launch in ${`(${this.x},${this.y},${this.z})`}`);
	f.dot = 1;
	this.process();
	return f.dot;
});

// emergency.dm:117
rt.def("/obj/machinery/computer/emergency_shuttle/proc/process", function process(f: Frame) {
	f.dot = 0;
	if (!GLOB.SSshuttle.emergency) {
		return f.dot;
	}
	if (GLOB.SSshuttle.emergency.mode == "stranded") {
		this.authorized.Cut();
		this.emagged = 0;
	}
	if (GLOB.SSshuttle.emergency.mode == "igniting" || !(GLOB.SSshuttle.emergency.mode == "docked" || GLOB.SSshuttle.emergency.mode == "igniting")) {
		return f.dot;
	}
	if (!(rt.len(f, this.authorized) >= this.auth_need || this.emagged)) return f.dot;
	GLOB.SSshuttle.emergency.setTimer(ENGINES_START_TIME);
	let system_error: Value = this.emagged ? "SYSTEM ERROR:" : null;
	minor_announce(`The emergency shuttle will launch in ${GLOB.SSshuttle.emergency.timeLeft()} seconds`, system_error, { alert: 1 });
	f.dot = 1;
	return f.dot;
}, false, { waitfor: false });

// emergency.dm:138
rt.def("/obj/machinery/computer/emergency_shuttle/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	let i: Value = null, ID: Value = null, J: Value = null;
	let $e: any;
	if (!(GLOB.SSshuttle.emergency.mode == "docked" || GLOB.SSshuttle.emergency.mode == "igniting")) {
		return f.dot;
	}
	if (this.emagged || GLOB.SSshuttle.emergency.mode == "igniting") {
		to_chat(user, "<span class='warning'>The shuttle is already about to launch!</span>");
		return f.dot;
	}
	let time: Value = GLOB.SSshuttle.emergency.timeLeft();
	message_admins(fmt("＀ (<A HREF='?_src_=holder;adminmoreinfo=＃'>?</A>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) has emagged the emergency shuttle ＀ seconds before launch.", [key_name_admin(user.client), user, user, time]), 0, 1);
	log_game(`${key_name(user)} has emagged the emergency shuttle in ${`(${this.x},${this.y},${this.z})`} ${time} seconds before launch.`);
	this.emagged = 1;
	let S: Value = (yield* new_(T("/datum/species")));
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		ID = (yield* new_(T("/obj/item/weapon/card/id"), this));
		J = pick(GLOB.SSjob.occupations);
		ID.registered_name = S.random_name(pick("male", "female"));
		ID.assignment = J.title;
		this.authorized += ID;
	}
	rt.endFor(f, 0);
	yield* this.process();
	return f.dot;
}, true);

// emergency.dm:170
rt.def("/obj/machinery/computer/emergency_shuttle/proc/Destroy", function* Destroy(f: Frame) {
	let ID: Value = null;
	for (ID of each(this, T("/obj/item/weapon/card/id"))) {
		yield* qdel(ID);
	}
	if (this.authorized && rt.len(f, this.authorized)) {
		this.authorized.Cut();
	}
	this.authorized = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(13049, "/obj/docking_port/mobile/emergency", "/obj/docking_port/mobile", {
	sound_played: 0,
	name: "emergency shuttle",
	id: "emergency",
	dwidth: 9,
	width: 22,
	height: 11,
	dir: 4,
	port_angle: -90,
	roundstart_move: "emergency_away",
});

// emergency.dm:191
rt.def("/obj/docking_port/mobile/emergency/proc/canDock", function canDock(f: Frame, S: Value) {
	return "can_dock";
});

// emergency.dm:194
rt.def("/obj/docking_port/mobile/emergency/proc/register", function register(f: Frame) {
	f.dot = parent_proc();
	GLOB.SSshuttle.emergency = this;
	return f.dot;
});

// emergency.dm:200
rt.def("/obj/docking_port/mobile/emergency/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	if (force) {
		if (this == GLOB.SSshuttle.emergency) {
			GLOB.SSshuttle.emergencyDeregister();
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// emergency.dm:207
rt.def("/obj/docking_port/mobile/emergency/proc/request", function* request(f: Frame, S: Value, signalOrigin: Value, reason: Value, redAlert: Value, set_coefficient: Value) {
	let security_num: Value = null;
	let $3: any;
	if (!isnum(set_coefficient)) {
		const subject = (security_num = seclevel2num(get_security_level()));
		if (subject === SEC_LEVEL_GREEN) {
			set_coefficient = 2;
		} else if (subject === SEC_LEVEL_BLUE) {
			set_coefficient = 1;
		} else {
			set_coefficient = 0.5;
		}
	}
	let call_time: Value = GLOB.SSshuttle.emergencyCallTime * set_coefficient * this.engine_coeff;
	let $0: any = this.mode;
	if ($0 === "recall" || $0 === "idle" || $0 === "call") {
		this.mode = "call";
		this.setTimer(call_time);
	} else {
		return f.dot;
	}
	GLOB.SSshuttle.emergencyCallAmount++;
	if (prob(70)) {
		GLOB.SSshuttle.emergencyLastCallLoc = signalOrigin;
	} else {
		GLOB.SSshuttle.emergencyLastCallLoc = null;
	}
	if (redAlert) {
		$0 = "Red Alert state confirmed: Dispatching priority shuttle. ";
	} else {
		$0 = "";
	}
	let $1: any = this.timeLeft(600);
	let $2: any = reason;
	if (GLOB.SSshuttle.emergencyLastCallLoc) {
		$3 = "\n\nCall signal traced. Results can be viewed on any communications console.";
	} else {
		$3 = "";
	}
	yield* priority_announce(`The emergency shuttle has been called. ${$0}It will arrive in ${$1} minutes.${$2}${$3}`, null, rt.rsc("sound/ai/shuttlecalled.ogg"), "Priority");
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/docking_port/stationary" }, { type: 128, path: "/area" }, {  }, {  }, {  }] });

// emergency.dm:236
rt.def("/obj/docking_port/mobile/emergency/proc/cancel", function* cancel(f: Frame, signalOrigin: Value) {
	let $0: any;
	if (this.mode != "call") {
		return f.dot;
	}
	if (GLOB.SSshuttle.emergencyNoRecall) {
		return f.dot;
	}
	this.invertTimer();
	this.mode = "recall";
	if (prob(70)) {
		GLOB.SSshuttle.emergencyLastCallLoc = signalOrigin;
	} else {
		GLOB.SSshuttle.emergencyLastCallLoc = null;
	}
	if (GLOB.SSshuttle.emergencyLastCallLoc) {
		$0 = " Recall signal traced. Results can be viewed on any communications console.";
	} else {
		$0 = "";
	}
	yield* priority_announce(`The emergency shuttle has been recalled.${$0}`, null, rt.rsc("sound/ai/shuttlerecalled.ogg"), "Priority");
	return f.dot;
}, true);

// emergency.dm:253
rt.def("/obj/docking_port/mobile/emergency/proc/is_hijacked", function is_hijacked(f: Frame) {
	let player: Value = null, location: Value = null;
	let has_people: Value = 0;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (player.mind) {
			if (player.stat != 2) {
				if (rt.istype(player, T("/mob/living/silicon"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/simple_animal"))) {
					continue;
				}
				if (rt.istype(player, T("/mob/living/brain"))) {
					continue;
				}
				if (get_area(player) == this.areaInstance) {
					has_people = 1;
					location = rt.getStep(f, player.mind.current, 0);
					if (!(player.mind.special_role == "traitor" || player.mind.special_role == "Syndicate") && !rt.istype(location, T("/turf/open/floor/plasteel/shuttle/red")) && !rt.istype(location, T("/turf/open/floor/mineral/plastitanium/brig"))) {
						return 0;
					}
				}
			}
		}
	}
	return has_people;
});

// emergency.dm:271
rt.def("/obj/docking_port/mobile/emergency/proc/check", function* check(f: Frame) {
	let destination: Value = null, G: Value = null, A: Value = null, M: Value = null, success: Value = null, A_2: Value = null, M_3: Value = null, areas: Value = null, E: Value = null, areas_1: Value = null, E_2: Value = null, destination_dock: Value = null;
	let $e: any;
	if (!this.timer) {
		return f.dot;
	}
	let time_left: Value = this.timeLeft(1);
	if (!rt.len(f, this.ripples) && time_left <= 100 && (this.mode == "call" || this.mode == "escape")) {
		if (this.mode == "call") {
			destination = GLOB.SSshuttle.getDock("emergency_home");
		} else if (this.mode == "escape") {
			destination = GLOB.SSshuttle.getDock("emergency_away");
		}
		yield* this.create_ripples(destination);
	}
	if (this.mode === "recall") {
		if (time_left <= 0) {
			this.mode = "idle";
			this.timer = 0;
		}
	} else if (this.mode === "call") {
		if (time_left <= 0) {
			if (yield* this.dock(GLOB.SSshuttle.getDock("emergency_home"))) {
				this.setTimer(20);
				return f.dot;
			}
			this.mode = "docked";
			this.setTimer(GLOB.SSshuttle.emergencyDockTime);
			yield* priority_announce(`The Emergency Shuttle has docked with the station. You have ${this.timeLeft(600)} minutes to board the Emergency Shuttle.`, null, rt.rsc("sound/ai/shuttledock.ogg"), "Priority");
			for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
				if (G.is_dominating) {
					G.dom_attempts = 0;
				} else {
					G.dom_attempts = min(1, G.dom_attempts);
				}
			}
		}
	} else if (this.mode === "docked") {
		if (time_left <= 100) {
			this.mode = "igniting";
			yield* GLOB.SSshuttle.checkHostileEnvironment();
			if (this.mode == "stranded") {
				return f.dot;
			}
			for (A of each(GLOB.SSshuttle.mobile)) {
				if ((M = A).launch_status == 0) {
					M.check_transit_zone();
				}
			}
		}
	} else if (this.mode === "igniting") {
		success = 1;
		yield* GLOB.SSshuttle.checkHostileEnvironment();
		if (this.mode == "stranded") {
			return f.dot;
		}
		(success = rt.modify(success, (this.check_transit_zone() == 2 ? 1 : 0), rt.bitAnd));
		for (A_2 of each(GLOB.SSshuttle.mobile)) {
			if ((M_3 = A_2).launch_status == 0) {
				(success = rt.modify(success, (M_3.check_transit_zone() == 2 ? 1 : 0), rt.bitAnd));
			}
		}
		if (!success) {
			this.setTimer(100);
		}
		if (time_left <= 50 && !this.sound_played) {
			this.sound_played = 1;
			areas = list();
			for (E of each(GLOB.sortedAreas, T("/area/shuttle/escape"))) {
				areas += E;
			}
			this.hyperspace_sound(1, areas);
		}
		if (time_left <= 0 && !GLOB.SSshuttle.emergencyNoEscape) {
			A_2 = null;
			for (A_2 of each(GLOB.SSshuttle.mobile)) {
				yield* (M_3 = A_2).on_emergency_launch();
			}
			areas = list();
			E = null;
			for (E of each(GLOB.sortedAreas, T("/area/shuttle/escape"))) {
				areas += E;
			}
			this.hyperspace_sound(2, areas);
			yield* this.enterTransit();
			this.mode = "escape";
			this.launch_status = 1;
			this.setTimer(GLOB.SSshuttle.emergencyEscapeTime * this.engine_coeff);
			yield* priority_announce(`The Emergency Shuttle has left the station. Estimate ${this.timeLeft(600)} minutes until the shuttle docks at Central Command.`, null, null, "Priority");
		}
	} else if (this.mode === "stranded") {
		yield* GLOB.SSshuttle.checkHostileEnvironment();
	} else if (this.mode === "escape") {
		if (this.sound_played && time_left <= 5) {
			areas_1 = list();
			for (E_2 of each(GLOB.sortedAreas, T("/area/shuttle/escape"))) {
				areas_1 += E_2;
			}
			this.hyperspace_sound(3, areas_1);
		}
		if (this.areaInstance.parallax_movedir && time_left <= 25) {
			yield* this.parallax_slowdown();
			A = null;
			for (A of each(GLOB.SSshuttle.mobile)) {
				if ((M = A).launch_status == 1) {
					if (rt.istype(M, T("/obj/docking_port/mobile/pod"))) {
						yield* M.parallax_slowdown();
					}
				}
			}
		}
		if (!(time_left <= 0)) return f.dot;
		A = null;
		for (A of each(GLOB.SSshuttle.mobile)) {
			yield* (M = A).on_emergency_dock();
		}
		destination_dock = "emergency_away";
		if (this.is_hijacked()) {
			destination_dock = "emergency_syndicate";
			yield* minor_announce("Corruption detected in shuttle navigation protocols. Please contact your supervisor.", "SYSTEM ERROR:", { alert: 1 });
		}
		yield* this.dock_id(destination_dock);
		this.mode = "endgame: game over";
		this.timer = 0;
	}
	return f.dot;
}, true);

// emergency.dm:400
rt.def("/obj/docking_port/mobile/emergency/proc/transit_failure", function* transit_failure(f: Frame) {
	yield* parent_proc();
	message_admins("Moving emergency shuttle directly to centcom dock to prevent deadlock.");
	this.mode = "escape";
	this.launch_status = ENDGAME_LAUNCHED;
	this.setTimer(GLOB.SSshuttle.emergencyEscapeTime);
	yield* priority_announce(`The Emergency Shuttle preparing for direct jump. Estimate ${this.timeLeft(600)} minutes until the shuttle docks at Central Command.`, null, null, "Priority");
	return f.dot;
}, true);

rt.type(13051, "/obj/docking_port/mobile/pod", "/obj/docking_port/mobile", {
	name: "escape pod",
	id: "pod",
	dwidth: 1,
	width: 3,
	height: 4,
	launch_status: 0,
});

// emergency.dm:418
rt.def("/obj/docking_port/mobile/pod/proc/request", function request(f: Frame) {
	let S: Value = this.getControlConsole();
	if (GLOB.security_level == SEC_LEVEL_RED || GLOB.security_level == SEC_LEVEL_DELTA || S && S.emagged) {
		if (this.launch_status == UNLAUNCHED) {
			this.launch_status = EARLY_LAUNCHED;
			return parent_proc();
		}
	} else {
		to_chat(f.usr, "<span class='warning'>Escape pods will only launch during \"Code Red\" security alert.</span>");
		return 1;
	}
	return f.dot;
});

// emergency.dm:429
rt.def("/obj/docking_port/mobile/pod/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.id != "pod") return f.dot;
	warning(`${`${this.type} id has not been changed from the default. Use the id convention "pod1" "pod2" etc.`} in ${"code/modules/shuttle/emergency.dm"} at line ${431} src: ${this} usr: ${f.usr}.`);
	return f.dot;
}, true);

rt.type(10394, "/obj/machinery/computer/shuttle/pod", "/obj/machinery/computer/shuttle", {
	admin_controlled: 1,
	shuttleId: "pod",
	possible_destinations: "pod_asteroid",
	light_color: "#6496FA",
	clockwork: 1,
	name: "pod control computer",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_available",
	density: 0,
});

// emergency.dm:451
rt.def("/obj/machinery/computer/shuttle/pod/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	to_chat(user, "<span class='warning'>You fry the pod's alert level checking system.</span>");
	return f.dot;
});

rt.type(13055, "/obj/docking_port/stationary/random", "/obj/docking_port/stationary", {
	edge_distance: 16,
	target_area: rt.typePath("/area/lavaland/surface/outdoors"),
	name: "escape pod",
	id: "pod",
	dwidth: 1,
	width: 3,
	height: 4,
});

// emergency.dm:466
rt.def("/obj/docking_port/stationary/random/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	if (!mapload) {
		return f.dot;
	}
	let turfs: Value = get_area_turfs(this.target_area);
	let _T: Value = pick(turfs);
	while (rt.len(f, turfs)) {
		if (_T.x < this.edge_distance || _T.y < this.edge_distance || rt.world().maxx + 1 - _T.x < this.edge_distance || rt.world().maxy + 1 - _T.y < this.edge_distance) {
			turfs -= _T;
			_T = pick(turfs);
		} else {
			this.loc = _T;
			break;
		}
	}
	return f.dot;
}, false);

rt.type(5607, "/obj/item/weapon/storage/pod", "/obj/item/weapon/storage", {
	unlocked: 0,
	anchored: 1,
	name: "emergency space suits",
	desc: "A wall mounted safe containing space suits. Will only open in emergencies.",
	density: 0,
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "safe",
});

// emergency.dm:509
rt.def("/obj/item/weapon/storage/pod/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/clothing/head/helmet/space/orange"), this);
	yield* new_(T("/obj/item/clothing/head/helmet/space/orange"), this);
	yield* new_(T("/obj/item/clothing/suit/space/orange"), this);
	yield* new_(T("/obj/item/clothing/suit/space/orange"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/clothing/mask/gas"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/oxygen/red"), this);
	yield* new_(T("/obj/item/weapon/tank/internals/oxygen/red"), this);
	yield* new_(T("/obj/item/weapon/pickaxe/emergency"), this);
	yield* new_(T("/obj/item/weapon/pickaxe/emergency"), this);
	yield* new_(T("/obj/item/weapon/survivalcapsule"), this);
	return f.dot;
}, true);

// emergency.dm:525
rt.def("/obj/item/weapon/storage/pod/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	if (GLOB.security_level == SEC_LEVEL_RED || GLOB.security_level == SEC_LEVEL_DELTA || this.unlocked) {
		f.dot = (yield* parent_proc());
	} else {
		to_chat(f.usr, "The storage unit will only unlock during a Red or Delta security alert.");
	}
	return f.dot;
}, true);

// emergency.dm:531
rt.def("/obj/item/weapon/storage/pod/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	return (yield* this.MouseDrop(user));
}, true);

// emergency.dm:536
rt.def("/obj/item/weapon/storage/pod/proc/onShuttleMove", function* onShuttleMove(f: Frame) {
	this.unlocked = 1;
	return (yield* parent_proc());
}, true);

rt.type(13050, "/obj/docking_port/mobile/emergency/backup", "/obj/docking_port/mobile/emergency", {
	name: "backup shuttle",
	id: "backup",
	dwidth: 2,
	width: 8,
	height: 8,
	dir: 4,
	roundstart_move: "backup_away",
});

// emergency.dm:554
rt.def("/obj/docking_port/mobile/emergency/backup/proc/Initialize", function* Initialize(f: Frame) {
	let current_emergency: Value = GLOB.SSshuttle.emergency;
	f.dot = (yield* parent_proc());
	GLOB.SSshuttle.emergency = current_emergency;
	GLOB.SSshuttle.backup_shuttle = this;
	return f.dot;
}, true);
