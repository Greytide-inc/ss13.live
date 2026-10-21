// From code/game/gamemodes/gang/dominator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/dominator/proc/<init>  (code/game/gamemodes/gang/dominator.dm:16)
rt.def("/obj/machinery/dominator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 10, "acid", 70]));
	return f.dot;
});

// /obj/machinery/dominator/proc/hulk_damage  (code/game/gamemodes/gang/dominator.dm:25)
rt.def("/obj/machinery/dominator/proc/hulk_damage", function hulk_damage(f: Frame) {
	return divide(subtract(rt.sv(f, "max_integrity"), rt.sv(f, "integrity_failure")), 10);
});

// /proc/dominator_excessive_walls  (code/game/gamemodes/gang/dominator.dm:29)
rt.def("/proc/dominator_excessive_walls", function dominator_excessive_walls(f: Frame, A: Value) {
	let open: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [open, _T, $e];
	open = 0;
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [3, live(A)]), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy((rt.istype(live(_T), T("/turf/closed")) ? 1 : 0))) {
			open = rt.inc(live(open), 1);
		}
	}
	rt.endFor(f, 0);
	if (rt.lt(live(open), 30)) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/machinery/dominator/proc/tesla_act  (code/game/gamemodes/gang/dominator.dm:38)  may sleep
rt.def("/obj/machinery/dominator/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/dominator/proc/Initialize  (code/game/gamemodes/gang/dominator.dm:41)  may sleep
rt.def("/obj/machinery/dominator/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_light", 2);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 1, live(f.src)]);
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/dominator"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/dominator/proc/examine  (code/game/gamemodes/gang/dominator.dm:50)
rt.def("/obj/machinery/dominator/proc/examine", function examine(f: Frame) {
	let time: Value = null;
	f.vars = () => [time];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	time = null;
	if ((truthy(rt.sv(f, "gang")) && truthy(rt.fv(f, "is_dominating", rt.sv(f, "gang"))))) {
		if (rt.gt((time = rt.callName(f, rt.sv(f, "gang"), "domination_time_remaining", [])), 0)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Hostile Takeover in progress. Estimated ＀ seconds remain.</span>", [live(time)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Hostile Takeover of ＀ successful. Have a great day.</span>", [rt.call(f, P("/proc/station_name"), null, [])])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>System on standby.</span>"]);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='danger'>System Integrity: ＀%</span>", [rt.call(f, P("/proc/round"), null, [multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100), 1])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/dominator/proc/process  (code/game/gamemodes/gang/dominator.dm:66)  may sleep
rt.def("/obj/machinery/dominator/proc/process", function* process(f: Frame) {
	let time_remaining: Value = null, domloc: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [time_remaining, domloc, G, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "gang")) && truthy(rt.fv(f, "is_dominating", rt.sv(f, "gang"))))) {
		if (rt.gt((time_remaining = (yield* g.callName(f, rt.sv(f, "gang"), "domination_time_remaining", []))), 0)) {
			if (truthy((yield* g.call(f, P("/proc/dominator_excessive_walls"), null, [live(f.src)])))) {
				rt.modField(f, rt.sv(f, "gang"), "domination_timer", 20, add);
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/buzz-two.ogg"), 50, 0]);
				if (rt.lt(rt.sv(f, "spam_prevention"), 6)) {
					rt.incSrcVar(f, "spam_prevention", 1, true);
				} else {
					yield* g.callName(f, rt.sv(f, "gang"), "message_gangtools", ["Warning: There are too many walls around your gang's dominator, its signal is being blocked!"]);
					yield* g.srcCall(f, "say", "Error: Takeover signal is currently blocked! There are too many walls within 3 standard units of this device.");
					rt.setSv(f, "spam_prevention", 0);
				}
				return live(f.dot);
			}
			f.dot = 1;
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 10, 0]);
			if ((!truthy(rt.sv(f, "warned")) && rt.lt(live(time_remaining), 180))) {
				rt.setSv(f, "warned", 1);
				domloc = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")]));
				yield* g.callName(f, rt.sv(f, "gang"), "message_gangtools", [fmt("Less than 3 minutes remains in hostile takeover. Defend your dominator at ＀!", [rt.fv(f, "map_name", live(domloc))])]);
				G = null;
				rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
				while (($e = rt.next(f, 0)) !== undefined) {
					G = $e;
					if (!isEqual(live(G), rt.sv(f, "gang"))) {
						yield* g.callName(f, live(G), "message_gangtools", [fmt("WARNING: ＀ Gang takeover imminent. Their dominator at ＀ must be destroyed!", [rt.fv(f, "name", rt.sv(f, "gang")), rt.fv(f, "map_name", live(domloc))]), 1, 1]);
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	if (truthy(live(f.dot))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), subtract));
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/dominator/proc/play_attack_sound  (code/game/gamemodes/gang/dominator.dm:94)
rt.def("/obj/machinery/dominator/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/machinery/dominator/proc/take_damage  (code/game/gamemodes/gang/dominator.dm:104)  may sleep
rt.def("/obj/machinery/dominator/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (rt.gt(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 0.6600000262260437)) {
		if (truthy(rt.op(f, "Prob", [], [multiply(live(f.args[0]), 2)]))) {
			yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
		}
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/machinery/dominator/proc/update_icon  (code/game/gamemodes/gang/dominator.dm:114)
rt.def("/obj/machinery/dominator/proc/update_icon", function update_icon(f: Frame) {
	let dominator_overlay: Value = null;
	f.vars = () => [dominator_overlay];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", "dominator-active");
		if (truthy(rt.sv(f, "operating"))) {
			dominator_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/machines/dominator.dmi"), "dominator-overlay"]);
			if (truthy(rt.sv(f, "gang"))) {
				rt.setFv(f, "color", live(dominator_overlay), rt.fv(f, "color_hex", rt.sv(f, "gang")));
			}
			rt.callSrc(f, "add_overlay", [live(dominator_overlay)]);
		} else {
			rt.setSv(f, "icon_state", "dominator");
		}
		if (rt.lt(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 0.6600000262260437)) {
			rt.callSrc(f, "add_overlay", ["damage"]);
		}
	} else {
		rt.setSv(f, "icon_state", "dominator-broken");
	}
	return f.dot;
});

// /obj/machinery/dominator/proc/obj_break  (code/game/gamemodes/gang/dominator.dm:130)  may sleep
rt.def("/obj/machinery/dominator/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.srcCall(f, "set_broken");
	return f.dot;
}, true);

// /obj/machinery/dominator/proc/deconstruct  (code/game/gamemodes/gang/dominator.dm:134)  may sleep
rt.def("/obj/machinery/dominator/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			yield* g.srcCall(f, "set_broken");
		}
		yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.fv(f, "loc", live(f.src))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/dominator/proc/attacked_by  (code/game/gamemodes/gang/dominator.dm:141)  may sleep
rt.def("/obj/machinery/dominator/proc/attacked_by", function* attacked_by(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/machinery/dominator/proc/set_broken  (code/game/gamemodes/gang/dominator.dm:146)  may sleep
rt.def("/obj/machinery/dominator/proc/set_broken", function* set_broken(f: Frame) {
	let takeover_in_progress: Value = null, G: Value = null, was_stranded: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [takeover_in_progress, G, was_stranded, $0, $1, $e];
	if (truthy(rt.sv(f, "gang"))) {
		rt.setFv(f, "is_dominating", rt.sv(f, "gang"), 0);
		takeover_in_progress = 0;
		G = null;
		rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if (truthy(rt.fv(f, "is_dominating", live(G)))) {
				takeover_in_progress = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(takeover_in_progress))) {
			was_stranded = (isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "stranded") ? 1 : 0);
			yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
			if (!truthy(live(was_stranded))) {
				yield* g.call(f, P("/proc/priority_announce"), null, ["All hostile activity within station systems has ceased.", "Network Alert"]);
			}
			if (isEqual((yield* g.call(f, P("/proc/get_security_level"), null, [])), "delta")) {
				yield* g.call(f, P("/proc/set_security_level"), null, ["red"]);
			}
		}
		$0 = rt.sv(f, "gang");
		if (truthy(rt.fv(f, "dom_attempts", rt.sv(f, "gang")))) {
			$1 = fmt(" You have ＀ attempt remaining.", [rt.fv(f, "dom_attempts", rt.sv(f, "gang"))]);
		} else {
			$1 = " The station network will have likely blocked any more attempts by us.";
		}
		yield* g.callName(f, $0, "message_gangtools", [fmt("Hostile takeover cancelled: Dominator is no longer operational.＀", [$1]), 1, 1]);
	}
	yield* g.srcCall(f, "set_light", 0);
	rt.setSv(f, "operating", 0);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	yield* g.srcCall(f, "update_icon");
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), subtract));
	return f.dot;
}, true);

// /obj/machinery/dominator/proc/Destroy  (code/game/gamemodes/gang/dominator.dm:171)  may sleep
rt.def("/obj/machinery/dominator/proc/Destroy", function* Destroy(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		yield* g.srcCall(f, "set_broken");
	}
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	rt.setSv(f, "gang", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	rt.setSv(f, "countdown", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/dominator/proc/emp_act  (code/game/gamemodes/gang/dominator.dm:181)  may sleep
rt.def("/obj/machinery/dominator/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "take_damage", 100, "fire", "energy", 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/dominator/proc/attack_hand  (code/game/gamemodes/gang/dominator.dm:185)  may sleep
rt.def("/obj/machinery/dominator/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let tempgang: Value = null, time: Value = null, A: Value = null, locname: Value = null, G: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, tempgang, time, A, locname, G, $0, $1, $2, $e];
	if ((truthy(rt.sv(f, "operating")) || truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
		yield* g.srcCall(f, "examine", live(user));
		return live(f.dot);
	}
	tempgang = null;
	if (truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), (yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "get_all_gangsters", []))) ? 1 : 0))) {
		tempgang = rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user)));
	} else {
		yield* g.srcCall(f, "examine", live(user));
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "is_dominating", live(tempgang)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Error: Hostile Takeover is already in progress.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "dom_attempts", live(tempgang)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Error: Unable to breach station network. Firewall has logged our signature and is blocking all further attempts.</span>"]);
		return live(f.dot);
	}
	time = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/determine_domination_time"), null, [live(tempgang)])), 60), 0.10000000149011612]));
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [live(user), fmt("With ＀% station control, a takeover will require ＀ minutes.\nYour gang will be unable to gain influence while it is active.\nThe entire station will likely be alerted to it once it starts.\nYou have ＀ attempt(s) remaining. Are you ready?", [(yield* g.call(f, P("/proc/round"), null, [multiply(divide(rt.getLen(f, rt.fv(f, "territory", live(tempgang))), rt.fv(f, "num_territories", rt.gl("start_state"))), 100), 1])), live(time), rt.fv(f, "dom_attempts", live(tempgang))]), "Confirm", "Ready", "Later"])), "Ready")) return f.dot;
	if ((((truthy(rt.fv(f, "is_dominating", live(tempgang))) || !truthy(rt.fv(f, "dom_attempts", live(tempgang)))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
		return 0;
	}
	A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")]));
	locname = rt.fv(f, "map_name", live(A));
	rt.setSv(f, "gang", live(tempgang));
	rt.incField(f, rt.sv(f, "gang"), "dom_attempts", -1, true);
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Network breach detected in ＀. The ＀ Gang is attempting to seize control of the station!", [live(locname), rt.fv(f, "name", rt.sv(f, "gang"))]), "Network Alert"]);
	yield* g.callName(f, rt.sv(f, "gang"), "domination", []);
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	rt.setSv(f, "name", fmt("＀ Gang ＀", [rt.fv(f, "name", rt.sv(f, "gang")), rt.sv(f, "name")]));
	rt.setSv(f, "operating", 1);
	yield* g.srcCall(f, "update_icon");
	rt.setFv(f, "color", rt.sv(f, "countdown"), rt.fv(f, "color_hex", rt.sv(f, "gang")));
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	yield* g.srcCall(f, "set_light", 3);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), add);
	}
	$0 = rt.sv(f, "gang");
	$1 = live(time);
	if (truthy(rt.fv(f, "dom_attempts", rt.sv(f, "gang")))) {
		$2 = "";
	} else {
		$2 = " This is your final attempt.";
	}
	yield* g.callName(f, $0, "message_gangtools", [fmt("Hostile takeover in progress: Estimated ＀ minutes until victory.＀", [$1, $2])]);
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (!isEqual(live(G), rt.sv(f, "gang"))) {
			yield* g.callName(f, live(G), "message_gangtools", [fmt("Enemy takeover attempt detected in ＀: Estimated ＀ minutes until our defeat.", [live(locname), live(time)]), 1, 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
