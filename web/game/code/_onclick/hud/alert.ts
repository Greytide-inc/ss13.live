// From code/_onclick/hud/alert.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4808, "/mob", "/atom/movable", {
	memory_throttle_time: 0,
	next_click: 0,
	next_move_adjust: 0,
	next_move_modifier: 1,
	alerts: null,
	screens: null,
	skincmds: null,
	sandbox: null,
	client_colours: null,
	suiciding: 0,
	bloody_hands: 0,
	lighting_alpha: 255,
	mind: null,
	typing_overlay: null,
	typing_timer: null,
	actions: null,
	stat: 0,
	zone_selected: null,
	macro_default: "default",
	macro_hotkeys: "hotkeys",
	damageoverlaytemp: 0,
	computer_id: null,
	lastattacker: null,
	lastattacked: null,
	logging: null,
	machine: null,
	other_mobs: null,
	disabilities: 0,
	movement_type: 1,
	pulling: null,
	grab_state: 0,
	next_move: null,
	notransform: null,
	eye_blind: 0,
	eye_blurry: 0,
	stuttering: 0,
	slurring: 0,
	cultslurring: 0,
	real_name: null,
	druggy: 0,
	confused: 0,
	resting: 0,
	lying: 0,
	lying_prev: 0,
	canmove: 1,
	lastpuke: 0,
	name_archive: null,
	timeofdeath: 0,
	cpr_time: 1,
	bodytemperature: 310.055,
	drowsyness: 0,
	dizziness: 0,
	jitteriness: 0,
	nutrition: 400,
	satiety: 0,
	overeatduration: 0,
	losebreath: 0,
	a_intent: "help",
	possible_a_intents: null,
	m_intent: "run",
	lastKnownIP: null,
	buckled: null,
	active_hand_index: 1,
	held_items: null,
	s_active: null,
	see_override: 0,
	hud_used: null,
	research_scanner: 0,
	mapobjs: null,
	in_throw_mode: 0,
	music_lastplayed: "null",
	job: null,
	radiation: 0,
	voice_name: "unidentifiable voice",
	faction: null,
	move_on_shuttle: 1,
	LAssailant: null,
	mob_spell_list: null,
	viruses: null,
	resistances: null,
	status_flags: 15,
	digitalcamo: 0,
	digitalinvis: 0,
	digitaldisguise: null,
	has_unlimited_silicon_privilege: 0,
	control_object: null,
	remote_control: null,
	listed_turf: null,
	permanent_huds: null,
	resize: 1,
	observers: null,
	progressbars: null,
	can_ride_typecache: null,
	open_uis: null,
	client: null,
	key: null,
	ckey: null,
	group: null,
	see_invisible: 0,
	see_infrared: 0,
	sight: 0,
	see_in_dark: 2,
	flags: 16,
	hud_possible: null,
	pressure_resistance: 8,
	density: 1,
	layer: 4,
	animate_movement: 2,
	mouse_drag_pointer: 1,
}, { global: { next_mob_id: 726 }, tmp: ["ckey","group"] });

// /mob/proc/throw_alert  (code/_onclick/hud/alert.dm:18)  may sleep
rt.def("/mob/proc/throw_alert", function* throw_alert(f: Frame, category: Value, type: Value, severity: Value, new_master: Value, override: Value) {
	let thealert: Value = null, old_layer: Value = null, old_plane: Value = null;
	f.vars = () => [category, type, severity, new_master, override, thealert, old_layer, old_plane];
	if (live(override) === null) {
		override = 0;
	}
	if (!truthy(live(category))) {
		return live(f.dot);
	}
	thealert = null;
	if (truthy(rt.index(rt.sv(f, "alerts"), live(category)))) {
		if (truthy(rt.gv(f, "override_alerts", (thealert = rt.index(rt.sv(f, "alerts"), live(category)))))) {
			return 0;
		}
		if ((truthy(live(new_master)) && !isEqual(live(new_master), rt.fv(f, "master", live(thealert))))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("＀ threw alert ＀ with new_master ＀ while already having that alert with master ＀", [live(f.src), live(category), live(new_master), rt.fv(f, "master", live(thealert))]), "code/_onclick/hud/alert.dm", 27, live(f.src), live(f.usr)])]);
			yield* g.srcCall(f, "clear_alert", live(category));
			return (yield* g.callSelf(f, []));
		}
		if (!isEqual(rt.fv(f, "type", live(thealert)), live(type))) {
			yield* g.srcCall(f, "clear_alert", live(category));
			return (yield* g.callSelf(f, []));
		}
		if ((!truthy(live(severity)) || isEqual(live(severity), rt.fv(f, "severity", live(thealert))))) {
			if (truthy(rt.fv(f, "timeout", live(thealert)))) {
				yield* g.srcCall(f, "clear_alert", live(category));
				return (yield* g.callSelf(f, []));
			}
			return 0;
		}
	} else {
		rt.setFv(f, "override_alerts", (thealert = (yield* g.new_(f, live(type), []))), live(override));
		if (truthy(live(override))) {
			rt.setFv(f, "timeout", live(thealert), null);
		}
	}
	rt.setFv(f, "mob_viewer", live(thealert), live(f.src));
	if (truthy(live(new_master))) {
		old_layer = rt.fv(f, "layer", live(new_master));
		old_plane = rt.fv(f, "plane", live(new_master));
		rt.setFv(f, "layer", live(new_master), -1);
		rt.setFv(f, "plane", live(new_master), -32767);
		yield* g.callName(f, live(thealert), "add_overlay", [live(new_master)]);
		rt.setFv(f, "layer", live(new_master), live(old_layer));
		rt.setFv(f, "plane", live(new_master), live(old_plane));
		rt.setFv(f, "icon_state", live(thealert), "template");
		rt.setFv(f, "master", live(thealert), live(new_master));
	} else {
		rt.setFv(f, "icon_state", live(thealert), fmt("＀＀", [rt.initial(f, live(thealert), "icon_state"), live(severity)]));
		rt.setFv(f, "severity", live(thealert), live(severity));
	}
	rt.setAt(rt.sv(f, "alerts"), live(category), live(thealert));
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		yield* g.callName(f, rt.sv(f, "hud_used"), "reorganize_alerts", []);
	}
	rt.setFv(f, "transform", live(thealert), (yield* g.call(f, P("/proc/matrix"), null, [32, 6, 7])));
	rt.op(f, "Animate", [2, 8], [null, live(thealert), "transform", (yield* g.call(f, P("/proc/matrix"), null, [])), "time", 2.5, "easing", 3]);
	if (truthy(rt.fv(f, "timeout", live(thealert)))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/proc/alert_timeout"), live(thealert), live(category)])), rt.fv(f, "timeout", live(thealert))]);
		rt.setFv(f, "timeout", live(thealert), subtract(add(rt.worldTime(f), rt.fv(f, "timeout", live(thealert))), rt.fv(f, "tick_lag", rt.world())));
	}
	return live(thealert);
}, true);

// /mob/proc/alert_timeout  (code/_onclick/hud/alert.dm:73)  may sleep
rt.def("/mob/proc/alert_timeout", function* alert_timeout(f: Frame, alert: Value, category: Value) {
	f.vars = () => [alert, category];
	if (!((truthy(rt.fv(f, "timeout", live(alert))) && isEqual(rt.index(rt.sv(f, "alerts"), live(category)), live(alert))) && rt.ge(rt.worldTime(f), rt.fv(f, "timeout", live(alert))))) return f.dot;
	yield* g.srcCall(f, "clear_alert", live(category));
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/screen/alert" }, {  }] });

// /mob/proc/clear_alert  (code/_onclick/hud/alert.dm:78)  may sleep
rt.def("/mob/proc/clear_alert", function* clear_alert(f: Frame, category: Value, clear_override: Value) {
	let alert: Value = null;
	f.vars = () => [category, clear_override, alert];
	if (live(clear_override) === null) {
		clear_override = 0;
	}
	if (!truthy((alert = rt.index(rt.sv(f, "alerts"), live(category))))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "override_alerts", live(alert))) && !truthy(live(clear_override)))) {
		return 0;
	}
	(rt.modSrcVar(f, "alerts", live(category), subtract));
	if ((truthy(rt.sv(f, "client")) && truthy(rt.sv(f, "hud_used")))) {
		yield* g.callName(f, rt.sv(f, "hud_used"), "reorganize_alerts", []);
		(rt.modField(f, rt.sv(f, "client"), "screen", live(alert), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(alert)]);
	return f.dot;
}, true);

rt.type(11021, "/obj/screen/alert", "/obj/screen", {
	timeout: 0,
	severity: 0,
	alerttooltipstyle: "",
	override_alerts: 0,
	mob_viewer: null,
	icon: rt.rsc("icons/mob/screen_alert.dmi"),
	icon_state: "default",
	name: "Alert",
	desc: "Something seems to have gone wrong with this alert, so report this bug please",
	mouse_opacity: 1,
});

// /obj/screen/alert/proc/MouseEntered  (code/_onclick/hud/alert.dm:104)
rt.def("/obj/screen/alert/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	rt.call(f, P("/proc/openToolTip"), null, [null, live(f.usr), null, live(f.src), null, live(params), "title", rt.sv(f, "name"), "content", rt.sv(f, "desc"), "theme", rt.sv(f, "alerttooltipstyle")], rt.Args.Named);
	return f.dot;
});

// /obj/screen/alert/proc/MouseExited  (code/_onclick/hud/alert.dm:108)
rt.def("/obj/screen/alert/proc/MouseExited", function MouseExited(f: Frame) {
	rt.call(f, P("/proc/closeToolTip"), null, [live(f.usr)]);
	return f.dot;
});

rt.type(11038, "/obj/screen/alert/embeddedobject", "/obj/screen/alert", {
	name: "Embedded Object",
	desc: "Something got lodged into your flesh and is causing major bleeding. It might fall out with time, but surgery is the safest way. If you're feeling frisky, click yourself in help intent to pull the object out.",
	icon_state: "embeddedobject",
});

// /obj/screen/alert/embeddedobject/proc/Click  (code/_onclick/hud/alert.dm:204)  may sleep
rt.def("/obj/screen/alert/embeddedobject/proc/Click", function* Click(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) return f.dot;
	return (yield* g.callName(f, (M = live(f.usr)), "help_shake_act", [live(M)]));
}, true);

rt.type(11040, "/obj/screen/alert/fire", "/obj/screen/alert", {
	name: "On Fire",
	desc: "You're on fire. Stop, drop and roll to put the fire out or move to a vacuum area.",
	icon_state: "fire",
});

// /obj/screen/alert/fire/proc/Click  (code/_onclick/hud/alert.dm:222)  may sleep
rt.def("/obj/screen/alert/fire/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) return f.dot;
	return (yield* g.callName(f, (L = live(f.usr)), "resist", []));
}, true);

rt.type(11045, "/obj/screen/alert/bloodsense", "/obj/screen/alert", {
	angle: 0,
	Cviewer: null,
	alerttooltipstyle: "cult",
	name: "Blood Sense",
	desc: "Allows you to sense blood that is manipulated by dark magicks.",
	icon_state: "cult_sense",
}, { global: { narnar: 773 } });

// /obj/screen/alert/bloodsense/proc/Initialize  (code/_onclick/hud/alert.dm:268)
rt.def("/obj/screen/alert/bloodsense/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setGl("narnar", rt.new_(f, T("/image"), [rt.rsc("icons/mob/screen_alert.dmi"), "mini_nar"]));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/screen/alert/bloodsense/proc/Destroy  (code/_onclick/hud/alert.dm:274)  may sleep
rt.def("/obj/screen/alert/bloodsense/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "Cviewer", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/screen/alert/bloodsense/proc/process  (code/_onclick/hud/alert.dm:280)
rt.def("/obj/screen/alert/bloodsense/proc/process", function process(f: Frame) {
	let blood_target: Value = null, _P: Value = null, Q: Value = null, A: Value = null, target_angle: Value = null, target_dist: Value = null, difference: Value = null, final: Value = null;
	let $0: any;
	f.vars = () => [blood_target, _P, Q, A, target_angle, target_dist, difference, final, $0];
	blood_target = null;
	if (truthy(rt.gl("blood_target"))) {
		if (!truthy(rt.getStep(f, rt.gl("blood_target"), 0))) {
			rt.setGl("blood_target", null);
		} else {
			blood_target = rt.gl("blood_target");
		}
	}
	if (((truthy(rt.sv(f, "Cviewer")) && truthy(rt.fv(f, "seeking", rt.sv(f, "Cviewer")))) && truthy(rt.fv(f, "master", rt.sv(f, "Cviewer"))))) {
		blood_target = rt.fv(f, "master", rt.sv(f, "Cviewer"));
		rt.setSv(f, "desc", fmt("Your blood sense is leading you to ＀", [rt.fv(f, "master", rt.sv(f, "Cviewer"))]));
	}
	if (!truthy(live(blood_target))) {
		if (!truthy(rt.gl("sac_complete"))) {
			if (isEqual(rt.sv(f, "icon_state"), "runed_sense0")) {
				return live(f.dot);
			}
			rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", null, "time", 1, "loop", 0]);
			rt.setSv(f, "angle", 0);
			rt.callSrc(f, "cut_overlays", []);
			rt.setSv(f, "icon_state", "runed_sense0");
			rt.setSv(f, "desc", fmt("Nar-Sie demands that ＀ be sacrificed before the summoning ritual can begin.", [rt.gl("sac_mind")]));
			rt.callSrc(f, "add_overlay", [rt.gl("sac_image")]);
		} else {
			if (isEqual(rt.sv(f, "icon_state"), "runed_sense1")) {
				return live(f.dot);
			}
			rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", null, "time", 1, "loop", 0]);
			rt.setSv(f, "angle", 0);
			rt.callSrc(f, "cut_overlays", []);
			rt.setSv(f, "icon_state", "runed_sense1");
			rt.setSv(f, "desc", fmt("The sacrifice is complete, summon Nar-Sie! The summoning can only take place in ＀!", [rt.call(f, P("/proc/english_list"), null, [rt.gl("summon_spots")])]));
			rt.callSrc(f, "add_overlay", [rt.gl("narnar")]);
		}
		return live(f.dot);
	}
	_P = rt.getStep(f, live(blood_target), 0);
	Q = rt.getStep(f, rt.sv(f, "mob_viewer"), 0);
	A = rt.call(f, P("/proc/get_area"), null, [live(_P)]);
	if (!isEqual(rt.fv(f, "z", live(_P)), rt.fv(f, "z", live(Q)))) {
		rt.setSv(f, "icon_state", "runed_sense2");
		rt.setSv(f, "desc", fmt("＀ is no longer in your sector, you cannot sense its presence here.", [live(blood_target)]));
		return live(f.dot);
	}
	rt.setSv(f, "desc", fmt("You are currently tracking ＀ in ＀.", [live(blood_target), rt.fv(f, "name", live(A))]));
	target_angle = rt.call(f, P("/proc/Get_Angle"), null, [live(Q), live(_P)]);
	target_dist = rt.call(f, P("/proc/get_dist"), null, [live(_P), live(Q)]);
	rt.callSrc(f, "cut_overlays", []);
	$0 = live(target_dist);
	if (rt.inRange($0, 0, 1)) {
		rt.setSv(f, "icon_state", "runed_sense2");
	} else if (rt.inRange($0, 2, 8)) {
		rt.setSv(f, "icon_state", "arrow8");
	} else if (rt.inRange($0, 9, 15)) {
		rt.setSv(f, "icon_state", "arrow7");
	} else if (rt.inRange($0, 16, 22)) {
		rt.setSv(f, "icon_state", "arrow6");
	} else if (rt.inRange($0, 23, 29)) {
		rt.setSv(f, "icon_state", "arrow5");
	} else if (rt.inRange($0, 30, 36)) {
		rt.setSv(f, "icon_state", "arrow4");
	} else if (rt.inRange($0, 37, 43)) {
		rt.setSv(f, "icon_state", "arrow3");
	} else if (rt.inRange($0, 44, 50)) {
		rt.setSv(f, "icon_state", "arrow2");
	} else if (rt.inRange($0, 51, 57)) {
		rt.setSv(f, "icon_state", "arrow1");
	} else if (rt.inRange($0, 58, 64)) {
		rt.setSv(f, "icon_state", "arrow0");
	} else if (rt.inRange($0, 65, 400)) {
		rt.setSv(f, "icon_state", "arrow");
	}
	difference = subtract(live(target_angle), rt.sv(f, "angle"));
	rt.setSv(f, "angle", live(target_angle));
	if (!truthy(live(difference))) {
		return live(f.dot);
	}
	rt.callName(f, (final = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")])), "Turn", [live(difference)]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(final), "time", 5, "loop", 0]);
	return f.dot;
}, false, { waitfor: false });

rt.type(11047, "/obj/screen/alert/clockwork/scripture_reqs", "/obj/screen/alert/clockwork", {
	name: "Next Tier Requirements",
	desc: "You shouldn't be seeing this description unless you're very fast. If you're very fast, good job!",
	icon_state: "no-servants-caches",
});

// /obj/screen/alert/clockwork/scripture_reqs/proc/Initialize  (code/_onclick/hud/alert.dm:361)
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	}
	rt.callSrc(f, "process", []);
	return f.dot;
});

// /obj/screen/alert/clockwork/scripture_reqs/proc/Destroy  (code/_onclick/hud/alert.dm:366)  may sleep
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/screen/alert/clockwork/scripture_reqs/proc/process  (code/_onclick/hud/alert.dm:371)  may sleep
rt.def("/obj/screen/alert/clockwork/scripture_reqs/proc/process", function* process(f: Frame) {
	let current_state: Value = null, i: Value = null, G: Value = null, gate_area: Value = null, validservants: Value = null, unconverted_ais_exist: Value = null, L: Value = null, req_servants: Value = null, req_caches: Value = null, req_cv: Value = null, req_ai: Value = null, textlist: Value = null;
	let $0: any, $e: any;
	f.vars = () => [current_state, i, G, gate_area, validservants, unconverted_ais_exist, L, req_servants, req_caches, req_cv, req_ai, textlist, $0, $e];
	if (truthy(rt.gl("clockwork_gateway_activated"))) {
		yield* g.callName(f, rt.sv(f, "mob_viewer"), "clear_alert", ["scripturereq"]);
		return live(f.dot);
	}
	current_state = null;
	i = null;
	rt.forList(f, 0, rt.fv(f, "scripture_states", rt.gl("SSticker")));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), live(i)))) {
			current_state = live(i);
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", "no");
	if (!truthy(live(current_state))) {
		rt.setSv(f, "name", "Current Objective");
		G = null;
		rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			rt.setSv(f, "desc", fmt("<b>Protect the Ark at ＀!</b>", [rt.gv(f, "map_name", (gate_area = (yield* g.call(f, P("/proc/get_area"), null, [live(G)]))))]));
			return live(f.dot);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "desc", "<b>All tiers of Scripture are unlocked.<br>Acquire components and summon the Ark.</b>");
	} else {
		rt.setSv(f, "name", "Next Tier Requirements");
		validservants = 0;
		unconverted_ais_exist = (yield* g.call(f, P("/proc/get_unconverted_ais"), null, []));
		L = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) && (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0))))) {
				validservants = rt.inc(live(validservants), 1);
			}
		}
		rt.endFor(f, 0);
		req_servants = 0;
		req_caches = 0;
		req_cv = 0;
		req_ai = 0;
		textlist = rt.list(fmt("Requirements for <b>＀ Scripture:</b>", [live(current_state)]));
		$0 = live(current_state);
		if ($0 === "Script") {
			req_servants = 6;
			req_caches = 1;
		} else if ($0 === "Application") {
			req_servants = 9;
			req_caches = 3;
			req_cv = 100;
		} else if ($0 === "Judgement") {
			req_servants = 12;
			req_caches = 5;
			req_cv = 300;
			req_ai = 1;
		}
		textlist = rt.modify(live(textlist), fmt("<br><b>＀/＀</b> Servants", [live(validservants), live(req_servants)]), add);
		if (rt.lt(live(validservants), live(req_servants))) {
			rt.modSrcVar(f, "icon_state", "-servants", add);
		} else {
			textlist = rt.modify(live(textlist), ": <b><font color=#5A6068>[CHECK]</font></b>", add);
		}
		textlist = rt.modify(live(textlist), fmt("<br><b>＀/＀</b> Tinkerer's Caches", [rt.gl("clockwork_caches"), live(req_caches)]), add);
		if (rt.lt(rt.gl("clockwork_caches"), live(req_caches))) {
			rt.modSrcVar(f, "icon_state", "-caches", add);
		} else {
			textlist = rt.modify(live(textlist), ": <b><font color=#5A6068>[CHECK]</font></b>", add);
		}
		if (truthy(live(req_cv))) {
			textlist = rt.modify(live(textlist), fmt("<br><b>＀/＀</b> Construction Value", [rt.gl("clockwork_construction_value"), live(req_cv)]), add);
			if (rt.lt(rt.gl("clockwork_construction_value"), live(req_cv))) {
				rt.modSrcVar(f, "icon_state", "-cv", add);
			} else {
				textlist = rt.modify(live(textlist), ": <b><font color=#5A6068>[CHECK]</font></b>", add);
			}
		}
		if (truthy(live(req_ai))) {
			if (truthy(live(unconverted_ais_exist))) {
				if (rt.gt(live(unconverted_ais_exist), 1)) {
					textlist = rt.modify(live(textlist), fmt("<br><b>＀ unconverted AIs exist!</b><br>", [live(unconverted_ais_exist)]), add);
				} else {
					textlist = rt.modify(live(textlist), "<br><b>An unconverted AI exists!</b>", add);
				}
				rt.modSrcVar(f, "icon_state", "-ai", add);
			} else {
				textlist = rt.modify(live(textlist), "<br>No unconverted AIs exist: <b><font color=#5A6068>[CHECK]</font></b>", add);
			}
		}
		rt.setSv(f, "desc", (yield* g.callName(f, live(textlist), "Join", [])));
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11048, "/obj/screen/alert/clockwork/infodump", "/obj/screen/alert/clockwork", {
	name: "Global Records",
	desc: "You shouldn't be seeing this description, because it should be dynamically generated.",
	icon_state: "clockinfo",
});

// /obj/screen/alert/clockwork/infodump/proc/MouseEntered  (code/_onclick/hud/alert.dm:446)
rt.def("/obj/screen/alert/clockwork/infodump/proc/MouseEntered", function MouseEntered(f: Frame) {
	let servants: Value = null, validservants: Value = null, unconverted_ais_exist: Value = null, textlist: Value = null, L: Value = null, G: Value = null, gate_area: Value = null, i: Value = null, i_4: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [servants, validservants, unconverted_ais_exist, textlist, L, G, gate_area, i, i_4, $0, $1, $e];
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "desc", "<font size=3><b>CHETR<br>NYY<br>HAGEHUGF-NAQ-UBABE<br>RATVAR.</b></font>");
	} else {
		servants = 0;
		validservants = 0;
		unconverted_ais_exist = rt.call(f, P("/proc/get_unconverted_ais"), null, []);
		textlist = null;
		L = null;
		rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) {
				servants = rt.inc(live(servants), 1);
				if ((truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0)))) {
					validservants = rt.inc(live(validservants), 1);
				}
			}
		}
		rt.endFor(f, 0);
		if (rt.gt(live(servants), 1)) {
			if (rt.gt(live(validservants), 1)) {
				textlist = rt.list(fmt("<b>＀</b> Servants, <b>＀</b> of which count towards scripture.<br>", [live(servants), live(validservants)]));
			} else {
				$0 = live(servants);
				if (truthy(live(validservants))) {
					$1 = fmt("<b>＀</b> of which counts", [live(validservants)]);
				} else {
					$1 = "none of which count";
				}
				textlist = rt.list(fmt("<b>＀</b> Servants, ＀ towards scripture.<br>", [$0, $1]));
			}
		} else {
			$0 = live(servants);
			if (truthy(live(validservants))) {
				$1 = "counts";
			} else {
				$1 = "does not count";
			}
			textlist = rt.list(fmt("<b>＀</b> Servant, who ＀ towards scripture.<br>", [$0, $1]));
		}
		if (truthy(rt.gl("clockwork_caches"))) {
			$0 = fmt("＀</b> Tinkerer's Caches.", [rt.gl("clockwork_caches")]);
		} else {
			$0 = "No Tinkerer's Caches, construct one!</b>";
		}
		textlist = rt.modify(live(textlist), fmt("<b>＀<br><b>＀</b> Construction Value.<br>", [$0, rt.gl("clockwork_construction_value")]), add);
		textlist = rt.modify(live(textlist), fmt("<b>＀</b> Tinkerer's Daemons can be active at once. <b>＀</b> are active.<br>", [rt.call(f, P("/proc/Floor"), null, [multiply(live(servants), 0.20000000298023224)]), rt.length(rt.gl("active_daemons"))]), add);
		G = null;
		rt.forList(f, 0, rt.gl("all_clockwork_objects"), T("/obj/structure/destructible/clockwork/massive/celestial_gateway"));
		if (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			textlist = rt.modify(live(textlist), fmt("Ark Location: <b>＀</b><br>", [rt.call(f, P("/proc/uppertext"), null, [rt.gv(f, "map_name", (gate_area = rt.call(f, P("/proc/get_area"), null, [live(G)])))])]), add);
			if (truthy(rt.callName(f, live(G), "still_needs_components", []))) {
				textlist = rt.modify(live(textlist), "Ark Components required: ", add);
				i = null;
				rt.forList(f, 1, rt.fv(f, "required_components", live(G)));
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					if (truthy(rt.index(rt.fv(f, "required_components", live(G)), live(i)))) {
						textlist = rt.modify(live(textlist), fmt("<b><font color=＀>＀</font></b> ", [rt.call(f, P("/proc/get_component_color_bright"), null, [live(i)]), rt.index(rt.fv(f, "required_components", live(G)), live(i))]), add);
					}
				}
				rt.endFor(f, 1);
				textlist = rt.modify(live(textlist), "<br>", add);
			} else {
				textlist = rt.modify(live(textlist), fmt("Seconds until Ratvar's arrival: <b>＀</b><br>", [rt.callName(f, live(G), "get_arrival_text", [1])]), add);
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(unconverted_ais_exist))) {
			if (rt.gt(live(unconverted_ais_exist), 1)) {
				textlist = rt.modify(live(textlist), fmt("<b>＀ unconverted AIs exist!</b><br>", [live(unconverted_ais_exist)]), add);
			} else {
				textlist = rt.modify(live(textlist), "<b>An unconverted AI exists!</b><br>", add);
			}
		}
		i_4 = null;
		rt.forList(f, 0, rt.fv(f, "scripture_states", rt.gl("SSticker")));
		while (($e = rt.next(f, 0)) !== undefined) {
			i_4 = $e;
			if (!isEqual(live(i_4), "Driver")) {
				$0 = live(i_4);
				if (truthy(rt.index(rt.fv(f, "scripture_states", rt.gl("SSticker")), live(i_4)))) {
					$1 = "UNLOCKED";
				} else {
					$1 = "LOCKED";
				}
				textlist = rt.modify(live(textlist), fmt("＀ Scripture: <b>＀</b><br>", [$0, $1]), add);
			}
		}
		rt.endFor(f, 0);
		rt.setSv(f, "desc", rt.callName(f, live(textlist), "Join", []));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

rt.type(11058, "/obj/screen/alert/hackingapc", "/obj/screen/alert", {
	target: null,
	timeout: 600,
	name: "Hacking APC",
	desc: "An Area Power Controller is being hacked. When the process is complete, you will have exclusive control of it, and you will gain additional processing time to unlock more malfunction abilities.",
	icon_state: "hackingapc",
});

// /obj/screen/alert/hackingapc/proc/Click  (code/_onclick/hud/alert.dm:557)  may sleep
rt.def("/obj/screen/alert/hackingapc/proc/Click", function* Click(f: Frame) {
	let AI: Value = null, _T: Value = null;
	f.vars = () => [AI, _T];
	if ((!truthy(live(f.usr)) || !truthy(rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "target"))) {
		return live(f.dot);
	}
	AI = live(f.usr);
	if (!truthy((_T = rt.getStep(f, rt.sv(f, "target"), 0)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "eyeobj", live(AI)), "setLoc", [live(_T)]);
	return f.dot;
}, true);

rt.type(11060, "/obj/screen/alert/notify_cloning", "/obj/screen/alert", {
	timeout: 300,
	name: "Revival",
	desc: "Someone is trying to revive you. Re-enter your corpse if you want to be revived!",
	icon_state: "template",
});

// /obj/screen/alert/notify_cloning/proc/Click  (code/_onclick/hud/alert.dm:581)  may sleep
rt.def("/obj/screen/alert/notify_cloning/proc/Click", function* Click(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	if ((!truthy(live(f.usr)) || !truthy(rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	yield* g.callName(f, (G = live(f.usr)), "reenter_corpse", []);
	return f.dot;
}, true);

rt.type(11061, "/obj/screen/alert/notify_action", "/obj/screen/alert", {
	target: null,
	action: "jump",
	timeout: 300,
	name: "Body created",
	desc: "A body was created. You can enter it.",
	icon_state: "template",
});

// /obj/screen/alert/notify_action/proc/Click  (code/_onclick/hud/alert.dm:594)  may sleep
rt.def("/obj/screen/alert/notify_action/proc/Click", function* Click(f: Frame) {
	let G: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [G, _T, $0];
	if ((!truthy(live(f.usr)) || !truthy(rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "target"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((G = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "action");
	if ($0 === "attack") {
		yield* g.callName(f, rt.sv(f, "target"), "attack_ghost", [live(G)]);
	} else if ($0 === "jump") {
		if ((truthy((_T = rt.getStep(f, rt.sv(f, "target"), 0))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
			rt.setFv(f, "loc", live(G), live(_T));
		}
	} else if ($0 === "orbit") {
		yield* g.callName(f, live(G), "ManualFollow", [rt.sv(f, "target")]);
	}
	return f.dot;
}, true);

rt.type(11062, "/obj/screen/alert/restrained", "/obj/screen/alert", {});

// /obj/screen/alert/restrained/proc/Click  (code/_onclick/hud/alert.dm:623)  may sleep
rt.def("/obj/screen/alert/restrained/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) return f.dot;
	return (yield* g.callName(f, (L = live(f.usr)), "resist", []));
}, true);

// /datum/hud/proc/reorganize_alerts  (code/_onclick/hud/alert.dm:633)
rt.def("/datum/hud/proc/reorganize_alerts", function reorganize_alerts(f: Frame) {
	let alerts: Value = null, icon_pref: Value = null, i: Value = null, alert: Value = null;
	let $0: any;
	f.vars = () => [alerts, icon_pref, i, alert, $0];
	alerts = rt.fv(f, "alerts", rt.sv(f, "mymob"));
	icon_pref = null;
	if (!truthy(rt.sv(f, "hud_shown"))) {
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, live(alerts)))) {
			(rt.modField(f, rt.fv(f, "client", rt.sv(f, "mymob")), "screen", rt.index(live(alerts), rt.index(live(alerts), live(i))), subtract));
			i = rt.inc(live(i), 1);
		}
		return 1;
	}
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, live(alerts)))) {
		if (isEqual(rt.gv(f, "icon_state", (alert = rt.index(live(alerts), rt.index(live(alerts), live(i))))), "template")) {
			if (!truthy(live(icon_pref))) {
				icon_pref = rt.call(f, P("/proc/ui_style2icon"), null, [rt.gv(f, "UI_style", rt.gv(f, "prefs", rt.fv(f, "client", rt.sv(f, "mymob"))))]);
			}
			rt.setFv(f, "icon", live(alert), live(icon_pref));
		}
		$0 = live(i);
		if ($0 === 1) {
			f.dot = "EAST-1:28,CENTER+5:27";
		} else if ($0 === 2) {
			f.dot = "EAST-1:28,CENTER+4:25";
		} else if ($0 === 3) {
			f.dot = "EAST-1:28,CENTER+3:23";
		} else if ($0 === 4) {
			f.dot = "EAST-1:28,CENTER+2:21";
		} else if ($0 === 5) {
			f.dot = "EAST-1:28,CENTER+1:19";
		} else {
			f.dot = "";
		}
		rt.setFv(f, "screen_loc", live(alert), live(f.dot));
		(rt.modField(f, rt.fv(f, "client", rt.sv(f, "mymob")), "screen", live(alert), rt.bitOr));
		i = rt.inc(live(i), 1);
	}
	return 1;
});

// /mob/proc/<init>  (code/_onclick/hud/alert.dm:661)
rt.def("/mob/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alerts", rt.list());
	$0 = $0;
	rt.setSv(f, "screens", rt.list());
	$0 = $0;
	rt.setSv(f, "skincmds", rt.list());
	$0 = $0;
	rt.setSv(f, "client_colours", rt.list());
	$0 = $0;
	rt.setSv(f, "hud_possible", rt.list("15"));
	$0 = $0;
	rt.setSv(f, "actions", rt.list());
	rt.setSv(f, "logging", rt.list("Attack log", "Say log", "Emote log", "OOC log"));
	$0 = $0;
	rt.setSv(f, "held_items", rt.list(null, null));
	$0 = $0;
	rt.setSv(f, "mapobjs", rt.list());
	$0 = $0;
	rt.setSv(f, "faction", rt.list("neutral"));
	$0 = $0;
	rt.setSv(f, "mob_spell_list", rt.list());
	$0 = $0;
	rt.setSv(f, "viruses", rt.list());
	$0 = $0;
	rt.setSv(f, "resistances", rt.list());
	$0 = $0;
	rt.setSv(f, "permanent_huds", rt.list());
	$0 = $0;
	rt.setSv(f, "can_ride_typecache", rt.list());
	$0 = $0;
	rt.setSv(f, "open_uis", rt.list());
	return f.dot;
});

// /obj/screen/alert/proc/Click  (code/_onclick/hud/alert.dm:664)  may sleep
rt.def("/obj/screen/alert/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let paramslist: Value = null;
	f.vars = () => [location, control, params, paramslist];
	if ((!truthy(live(f.usr)) || !truthy(rt.fv(f, "client", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy(rt.index((paramslist = (yield* g.call(f, P("/proc/params2list"), null, [live(params)]))), "shift"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='boldnotice'>＀</span> - <span class='info'>＀</span>", [rt.sv(f, "name"), rt.sv(f, "desc")])]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "master"))) return f.dot;
	return (yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "Click", [rt.sv(f, "master"), live(location), live(control), live(params)]));
}, true);

// /obj/screen/alert/proc/Destroy  (code/_onclick/hud/alert.dm:674)  may sleep
rt.def("/obj/screen/alert/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "severity", 0);
	rt.setSv(f, "master", null);
	rt.setSv(f, "screen_loc", "");
	return f.dot;
}, true);
