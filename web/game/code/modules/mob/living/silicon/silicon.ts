// From code/modules/mob/living/silicon/silicon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4832, "/mob/living/silicon", "/mob/living", {
	syndicate: 0,
	laws: null,
	last_lawchange_announce: 0,
	alarms_to_show: null,
	alarms_to_clear: null,
	designation: "",
	radiomod: "",
	aicamera: null,
	radio: null,
	alarm_types_show: null,
	alarm_types_clear: null,
	lawcheck: null,
	ioncheck: null,
	devillawcheck: null,
	med_hud: 4,
	sec_hud: 2,
	d_hud: 5,
	law_change_counter: 0,
	verb_say: "states",
	verb_ask: "queries",
	verb_exclaim: "declares",
	verb_yell: "alarms",
	initial_language_holder: rt.typePath("/datum/language_holder/synthetic"),
	hud_possible: null,
	gender: "neuter",
	voice_name: "synthesized voice",
	has_unlimited_silicon_privilege: 1,
	see_in_dark: 8,
	bubble_icon: "machine",
	weather_immunities: null,
	possible_a_intents: null,
});

// /mob/living/silicon/proc/<init>  (code/modules/mob/living/silicon/silicon.dm:18)
rt.def("/mob/living/silicon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "alarms_to_show", rt.list());
	$0 = $0;
	rt.setSv(f, "alarms_to_clear", rt.list());
	rt.setSv(f, "hud_possible", rt.list("15", "8", "9", "13"));
	rt.setSv(f, "alarm_types_show", rt.alist(f, ["Motion", 0, "Fire", 0, "Atmosphere", 0, "Power", 0, "Camera", 0]));
	rt.setSv(f, "alarm_types_clear", rt.alist(f, ["Motion", 0, "Fire", 0, "Atmosphere", 0, "Power", 0, "Camera", 0]));
	$0 = $0;
	rt.setSv(f, "lawcheck", rt.op(f, "CreateMultidimensionalList", [1], [1]));
	$0 = $0;
	rt.setSv(f, "ioncheck", rt.op(f, "CreateMultidimensionalList", [1], [1]));
	$0 = $0;
	rt.setSv(f, "devillawcheck", rt.op(f, "CreateMultidimensionalList", [1], [5]));
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list("ash"));
	rt.setSv(f, "possible_a_intents", rt.list("help", "harm"));
	return f.dot;
});

// /mob/living/silicon/proc/Initialize  (code/modules/mob/living/silicon/silicon.dm:41)  may sleep
rt.def("/mob/living/silicon/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.vars = () => [diag_hud];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("silicon_mobs", live(f.src), add);
	yield* g.callName(f, (diag_hud = rt.index(rt.gl("huds"), 5)), "add_to_hud", [live(f.src)]);
	yield* g.srcCall(f, "diag_hud_set_status");
	yield* g.srcCall(f, "diag_hud_set_health");
	return f.dot;
}, true);

// /mob/living/silicon/proc/Destroy  (code/modules/mob/living/silicon/silicon.dm:57)  may sleep
rt.def("/mob/living/silicon/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "radio", null);
	rt.setSv(f, "aicamera", null);
	(rt.modGl("silicon_mobs", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/silicon/proc/queueAlarm  (code/modules/mob/living/silicon/silicon.dm:70)
rt.def("/mob/living/silicon/proc/queueAlarm", function queueAlarm(f: Frame, message: Value, type: Value, incoming: Value) {
	let in_cooldown: Value = null, msg: Value = null, key: Value = null;
	f.vars = () => [incoming, in_cooldown, msg, key];
	if (live(incoming) === null) {
		incoming = 1;
	}
	in_cooldown = ((rt.gt(rt.len(f, rt.sv(f, "alarms_to_show")), 0) ? 1 : 0) || (rt.gt(rt.len(f, rt.sv(f, "alarms_to_clear")), 0) ? 1 : 0));
	if (truthy(live(incoming))) {
		rt.modSrcVar(f, "alarms_to_show", live(message), add);
		rt.modAt(rt.sv(f, "alarm_types_show"), live(type), 1, add);
	} else {
		rt.modSrcVar(f, "alarms_to_clear", live(message), add);
		rt.modAt(rt.sv(f, "alarm_types_clear"), live(type), 1, add);
	}
	if (truthy(live(in_cooldown))) return f.dot;
	rt.spawnTail(f, 30, "/mob/living/silicon/proc/queueAlarm: spawn at modules/mob/living/silicon/silicon.dm:79", message, type, incoming, in_cooldown, msg, key);
	return f.dot;
});

// a spawn(30) body of /mob/living/silicon/proc/queueAlarm, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/proc/queueAlarm: spawn at modules/mob/living/silicon/silicon.dm:79", function* (f: Frame, message: Value, type: Value, incoming: Value, in_cooldown: Value, msg: Value, key: Value) {
	let $e: any;
	f.vars = () => [message, type, incoming, in_cooldown, msg, key, $e];
	if (rt.lt(rt.len(f, rt.sv(f, "alarms_to_show")), 5)) {
		msg = null;
		rt.forList(f, 0, rt.sv(f, "alarms_to_show"));
		while (($e = rt.next(f, 0)) !== undefined) {
			msg = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
		}
		rt.endFor(f, 0);
	} else {
		if (truthy(rt.len(f, rt.sv(f, "alarms_to_show")))) {
			msg = "--- ";
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Burglar"))) {
				msg = rt.modify(live(msg), fmt("BURGLAR: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Burglar")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Motion"))) {
				msg = rt.modify(live(msg), fmt("MOTION: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Motion")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Fire"))) {
				msg = rt.modify(live(msg), fmt("FIRE: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Fire")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Atmosphere"))) {
				msg = rt.modify(live(msg), fmt("ATMOSPHERE: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Atmosphere")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Power"))) {
				msg = rt.modify(live(msg), fmt("POWER: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Power")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Camera"))) {
				msg = rt.modify(live(msg), fmt("CAMERA: ＀ alarms detected. - ", [rt.at(rt.sv(f, "alarm_types_show"), "Camera")]), add);
			}
			msg = rt.modify(live(msg), fmt("<A href=?src=＃;showalerts=1'>[Show Alerts]</a>", [live(f.src)]), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
		}
	}
	if (rt.lt(rt.len(f, rt.sv(f, "alarms_to_clear")), 3)) {
		msg = null;
		rt.forList(f, 0, rt.sv(f, "alarms_to_clear"));
		while (($e = rt.next(f, 0)) !== undefined) {
			msg = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
		}
		rt.endFor(f, 0);
	} else {
		if (truthy(rt.len(f, rt.sv(f, "alarms_to_clear")))) {
			msg = "--- ";
			if (truthy(rt.at(rt.sv(f, "alarm_types_clear"), "Motion"))) {
				msg = rt.modify(live(msg), fmt("MOTION: ＀ alarms cleared. - ", [rt.at(rt.sv(f, "alarm_types_clear"), "Motion")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_clear"), "Fire"))) {
				msg = rt.modify(live(msg), fmt("FIRE: ＀ alarms cleared. - ", [rt.at(rt.sv(f, "alarm_types_clear"), "Fire")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_clear"), "Atmosphere"))) {
				msg = rt.modify(live(msg), fmt("ATMOSPHERE: ＀ alarms cleared. - ", [rt.at(rt.sv(f, "alarm_types_clear"), "Atmosphere")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_clear"), "Power"))) {
				msg = rt.modify(live(msg), fmt("POWER: ＀ alarms cleared. - ", [rt.at(rt.sv(f, "alarm_types_clear"), "Power")]), add);
			}
			if (truthy(rt.at(rt.sv(f, "alarm_types_show"), "Camera"))) {
				msg = rt.modify(live(msg), fmt("CAMERA: ＀ alarms cleared. - ", [rt.at(rt.sv(f, "alarm_types_clear"), "Camera")]), add);
			}
			msg = rt.modify(live(msg), fmt("<A href=?src=＃;showalerts=1'>[Show Alerts]</a>", [live(f.src)]), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), live(msg)]);
		}
	}
	rt.setSv(f, "alarms_to_show", rt.list());
	rt.setSv(f, "alarms_to_clear", rt.list());
	key = null;
	rt.forList(f, 0, rt.sv(f, "alarm_types_show"));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		rt.setAt(rt.sv(f, "alarm_types_show"), live(key), 0);
	}
	rt.endFor(f, 0);
	key = null;
	rt.forList(f, 0, rt.sv(f, "alarm_types_clear"));
	while (($e = rt.next(f, 0)) !== undefined) {
		key = $e;
		rt.setAt(rt.sv(f, "alarm_types_clear"), live(key), 0);
	}
	rt.endFor(f, 0);
	return null;
});

// /mob/living/silicon/proc/can_inject  (code/modules/mob/living/silicon/silicon.dm:147)
rt.def("/mob/living/silicon/proc/can_inject", function can_inject(f: Frame, user: Value, error_msg: Value) {
	if (truthy(live(error_msg))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>Their outer shell is too tough.</span>"]);
	}
	return 0;
});

// /mob/living/silicon/proc/Topic  (code/modules/mob/living/silicon/silicon.dm:161)  may sleep
rt.def("/mob/living/silicon/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let L: Value = null;
	let $0: any;
	f.vars = () => [href, href_list, L, $0];
	// The law-state checkboxes are the silicon's own: an href could name any silicon from anywhere.
	if (!isEqual(live(f.usr), live(f.src))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "lawc"))) {
		L = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "lawc")]));
		$0 = rt.index(rt.sv(f, "lawcheck"), add(live(L), 1));
		if ($0 === "Yes") {
			rt.setAt(rt.sv(f, "lawcheck"), add(live(L), 1), "No");
		} else if ($0 === "No") {
			rt.setAt(rt.sv(f, "lawcheck"), add(live(L), 1), "Yes");
		}
		yield* g.srcCall(f, "checklaws");
	}
	if (truthy(rt.at(live(href_list), "lawi"))) {
		L = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "lawi")]));
		$0 = rt.index(rt.sv(f, "ioncheck"), live(L));
		if ($0 === "Yes") {
			rt.setAt(rt.sv(f, "ioncheck"), live(L), "No");
		} else if ($0 === "No") {
			rt.setAt(rt.sv(f, "ioncheck"), live(L), "Yes");
		}
		yield* g.srcCall(f, "checklaws");
	}
	if (truthy(rt.at(live(href_list), "lawdevil"))) {
		L = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "lawdevil")]));
		$0 = rt.index(rt.sv(f, "devillawcheck"), live(L));
		if ($0 === "Yes") {
			rt.setAt(rt.sv(f, "devillawcheck"), live(L), "No");
		} else if ($0 === "No") {
			rt.setAt(rt.sv(f, "devillawcheck"), live(L), "Yes");
		}
		yield* g.srcCall(f, "checklaws");
	}
	if (truthy(rt.at(live(href_list), "laws"))) {
		yield* g.srcCall(f, "statelaws");
	}
	return live(f.dot);
}, true);

// /mob/living/silicon/proc/statelaws  (code/modules/mob/living/silicon/silicon.dm:198)  may sleep
rt.def("/mob/living/silicon/proc/statelaws", function* statelaws(f: Frame, force: Value) {
	let number: Value = null, index: Value = null, law: Value = null, num: Value = null;
	f.vars = () => [force, number, index, law, num];
	if (live(force) === null) {
		force = 0;
	}
	yield* g.callName(f, live(f.src), "say", [fmt("＀ Current Active Laws:", [rt.sv(f, "radiomod")])]);
	number = 1;
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if ((truthy(rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src)))) && truthy(rt.getLen(f, rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src))))))) {
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src)))))) {
			if ((truthy(live(force)) || isEqual(rt.index(rt.fv(f, "devillawcheck", live(f.src)), live(index)), "Yes"))) {
				yield* g.callName(f, live(f.src), "say", [fmt("＀ 666. ＀", [rt.sv(f, "radiomod"), rt.index(rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src))), live(index))])]);
				yield* g.call(f, P("/proc/sleep"), null, [10]);
			}
			index = rt.inc(live(index), 1);
		}
	}
	if (truthy(rt.gv(f, "zeroth", rt.fv(f, "laws", live(f.src))))) {
		if ((truthy(live(force)) || isEqual(rt.index(rt.fv(f, "lawcheck", live(f.src)), 1), "Yes"))) {
			yield* g.callName(f, live(f.src), "say", [fmt("＀ 0. ＀", [rt.sv(f, "radiomod"), rt.gv(f, "zeroth", rt.fv(f, "laws", live(f.src)))])]);
			yield* g.call(f, P("/proc/sleep"), null, [10]);
		}
	}
	index = null;
	index = 1;
	while (rt.le(live(index), rt.getLen(f, rt.gv(f, "ion", rt.fv(f, "laws", live(f.src)))))) {
		law = rt.index(rt.gv(f, "ion", rt.fv(f, "laws", live(f.src))), live(index));
		num = (yield* g.call(f, P("/proc/ionnum"), null, []));
		if (rt.gt(rt.length(live(law)), 0)) {
			if ((truthy(live(force)) || isEqual(rt.index(rt.fv(f, "ioncheck", live(f.src)), live(index)), "Yes"))) {
				yield* g.callName(f, live(f.src), "say", [fmt("＀ ＀. ＀", [rt.sv(f, "radiomod"), live(num), live(law)])]);
				yield* g.call(f, P("/proc/sleep"), null, [10]);
			}
		}
		index = rt.inc(live(index), 1);
	}
	index = null;
	index = 1;
	while (rt.le(live(index), rt.getLen(f, rt.gv(f, "inherent", rt.fv(f, "laws", live(f.src)))))) {
		if (rt.gt(rt.length((law = rt.index(rt.gv(f, "inherent", rt.fv(f, "laws", live(f.src))), live(index)))), 0)) {
			if ((truthy(live(force)) || isEqual(rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(index), 1)), "Yes"))) {
				yield* g.callName(f, live(f.src), "say", [fmt("＀ ＀. ＀", [rt.sv(f, "radiomod"), live(number), live(law)])]);
				number = rt.inc(live(number), 1);
				yield* g.call(f, P("/proc/sleep"), null, [10]);
			}
		}
		index = rt.inc(live(index), 1);
	}
	index = null;
	index = 1;
	while (rt.le(live(index), rt.getLen(f, rt.gv(f, "supplied", rt.fv(f, "laws", live(f.src)))))) {
		if (rt.gt(rt.length((law = rt.index(rt.gv(f, "supplied", rt.fv(f, "laws", live(f.src))), live(index)))), 0)) {
			if (rt.ge(rt.getLen(f, rt.fv(f, "lawcheck", live(f.src))), add(live(number), 1))) {
				if ((truthy(live(force)) || isEqual(rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1)), "Yes"))) {
					yield* g.callName(f, live(f.src), "say", [fmt("＀ ＀. ＀", [rt.sv(f, "radiomod"), live(number), live(law)])]);
					number = rt.inc(live(number), 1);
					yield* g.call(f, P("/proc/sleep"), null, [10]);
				}
			}
		}
		index = rt.inc(live(index), 1);
	}
	return f.dot;
}, true);

// /mob/living/silicon/proc/checklaws  (code/modules/mob/living/silicon/silicon.dm:246)
rt.def("/mob/living/silicon/proc/checklaws", function checklaws(f: Frame) {
	let list: Value = null, index: Value = null, law: Value = null, number: Value = null, index_2: Value = null, law_3: Value = null;
	f.vars = () => [list, index, law, number, index_2, law_3];
	list = "<b>Which laws do you want to include when stating them for the crew?</b><br><br>";
	if ((truthy(rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src)))) && truthy(rt.getLen(f, rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src))))))) {
		index = null;
		index = 1;
		while (rt.le(live(index), rt.getLen(f, rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src)))))) {
			if (!truthy(rt.index(rt.fv(f, "devillawcheck", live(f.src)), live(index)))) {
				rt.setAt(rt.fv(f, "devillawcheck", live(f.src)), live(index), "No");
			}
			list = rt.modify(live(list), fmt("<A href='byond://?src=＃;lawdevil=＀'>＀ 666:</A> ＀<BR>", [live(f.src), live(index), rt.index(rt.fv(f, "devillawcheck", live(f.src)), live(index)), rt.index(rt.gv(f, "devillaws", rt.fv(f, "laws", live(f.src))), live(index))]), add);
			index = rt.inc(live(index), 1);
		}
	}
	if (truthy(rt.gv(f, "zeroth", rt.fv(f, "laws", live(f.src))))) {
		if (!truthy(rt.index(rt.fv(f, "lawcheck", live(f.src)), 1))) {
			rt.setAt(rt.fv(f, "lawcheck", live(f.src)), 1, "No");
		}
		list = rt.modify(live(list), fmt("<A href='byond://?src=＃;lawc=0'>＀ 0:</A> ＀<BR>", [live(f.src), rt.index(rt.fv(f, "lawcheck", live(f.src)), 1), rt.gv(f, "zeroth", rt.fv(f, "laws", live(f.src)))]), add);
	}
	index = null;
	index = 1;
	while (rt.le(live(index), rt.getLen(f, rt.gv(f, "ion", rt.fv(f, "laws", live(f.src)))))) {
		if (rt.gt(rt.length((law = rt.index(rt.gv(f, "ion", rt.fv(f, "laws", live(f.src))), live(index)))), 0)) {
			if (!truthy(rt.index(rt.fv(f, "ioncheck", live(f.src)), live(index)))) {
				rt.setAt(rt.fv(f, "ioncheck", live(f.src)), live(index), "Yes");
			}
			list = rt.modify(live(list), fmt("<A href='byond://?src=＃;lawi=＀'>＀ ＀:</A> ＀<BR>", [live(f.src), live(index), rt.index(rt.fv(f, "ioncheck", live(f.src)), live(index)), rt.call(f, P("/proc/ionnum"), null, []), live(law)]), add);
			rt.modField(f, rt.fv(f, "ioncheck", live(f.src)), "len", 1, add);
		}
		index = rt.inc(live(index), 1);
	}
	number = 1;
	index_2 = null;
	index_2 = 1;
	while (rt.le(live(index_2), rt.getLen(f, rt.gv(f, "inherent", rt.fv(f, "laws", live(f.src)))))) {
		if (rt.gt(rt.length((law_3 = rt.index(rt.gv(f, "inherent", rt.fv(f, "laws", live(f.src))), live(index_2)))), 0)) {
			rt.modField(f, rt.fv(f, "lawcheck", live(f.src)), "len", 1, add);
			if (!truthy(rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1)))) {
				rt.setAt(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1), "Yes");
			}
			list = rt.modify(live(list), fmt("<A href='byond://?src=＃;lawc=＀'>＀ ＀:</A> ＀<BR>", [live(f.src), live(number), rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1)), live(number), live(law_3)]), add);
			number = rt.inc(live(number), 1);
		}
		index_2 = rt.inc(live(index_2), 1);
	}
	index_2 = null;
	index_2 = 1;
	while (rt.le(live(index_2), rt.getLen(f, rt.gv(f, "supplied", rt.fv(f, "laws", live(f.src)))))) {
		if (rt.gt(rt.length((law_3 = rt.index(rt.gv(f, "supplied", rt.fv(f, "laws", live(f.src))), live(index_2)))), 0)) {
			rt.modField(f, rt.fv(f, "lawcheck", live(f.src)), "len", 1, add);
			if (!truthy(rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1)))) {
				rt.setAt(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1), "Yes");
			}
			list = rt.modify(live(list), fmt("<A href='byond://?src=＃;lawc=＀'>＀ ＀:</A> ＀<BR>", [live(f.src), live(number), rt.index(rt.fv(f, "lawcheck", live(f.src)), add(live(number), 1)), live(number), live(law_3)]), add);
			number = rt.inc(live(number), 1);
		}
		index_2 = rt.inc(live(index_2), 1);
	}
	list = rt.modify(live(list), fmt("<br><br><A href='byond://?src=＃;laws=1'>State Laws</A>", [live(f.src)]), add);
	rt.op(f, "Browse", [], [live(f.usr), live(list), "window=laws"], false);
	return f.dot;
});

// /mob/living/silicon/proc/set_autosay  (code/modules/mob/living/silicon/silicon.dm:293)  may sleep
rt.def("/mob/living/silicon/proc/set_autosay", function* set_autosay(f: Frame) {
	let Autochan: Value = null, key: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [Autochan, key, $0, $1, $e];
	if (!truthy(rt.sv(f, "radio"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Radio not detected."]);
		return live(f.dot);
	}
	if (!truthy((Autochan = (yield* g.op(f, "Prompt", [1], [null, null, null, "Select a channel:", add(rt.list("Default", "None"), rt.fv(f, "channels", rt.sv(f, "radio")))]))))) {
		return live(f.dot);
	}
	if (isEqual(live(Autochan), "Default")) {
		rt.setSv(f, "radiomod", ";");
		Autochan = rt.modify(live(Autochan), fmt(" (＀)", [rt.fv(f, "frequency", rt.sv(f, "radio"))]), add);
	} else {
		if (isEqual(live(Autochan), "None")) {
			rt.setSv(f, "radiomod", "");
		} else {
			key = null;
			rt.forList(f, 0, rt.gl("department_radio_keys"));
			while (($e = rt.next(f, 0)) !== undefined) {
				key = $e;
				if (isEqual(rt.index(rt.gl("department_radio_keys"), live(key)), live(Autochan))) {
					rt.setSv(f, "radiomod", live(key));
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	$0 = live(f.src);
	if (isEqual(live(Autochan), "None")) {
		$1 = "will not use the radio.";
	} else {
		$1 = fmt("set to ＀.", [live(Autochan)]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Automatic announcements ＀</span>", [$1])]);
	return f.dot;
}, true);

// /mob/living/silicon/proc/remove_med_sec_hud  (code/modules/mob/living/silicon/silicon.dm:328)
rt.def("/mob/living/silicon/proc/remove_med_sec_hud", function remove_med_sec_hud(f: Frame) {
	let secsensor: Value = null, medsensor: Value = null, diagsensor: Value = null;
	f.vars = () => [secsensor, medsensor, diagsensor];
	secsensor = rt.index(rt.gl("huds"), rt.sv(f, "sec_hud"));
	medsensor = rt.index(rt.gl("huds"), rt.sv(f, "med_hud"));
	diagsensor = rt.index(rt.gl("huds"), rt.sv(f, "d_hud"));
	rt.callName(f, live(secsensor), "remove_hud_from", [live(f.src)]);
	rt.callName(f, live(medsensor), "remove_hud_from", [live(f.src)]);
	rt.callName(f, live(diagsensor), "remove_hud_from", [live(f.src)]);
	return f.dot;
});

// /mob/living/silicon/proc/add_sec_hud  (code/modules/mob/living/silicon/silicon.dm:336)
rt.def("/mob/living/silicon/proc/add_sec_hud", function add_sec_hud(f: Frame) {
	let secsensor: Value = null;
	f.vars = () => [secsensor];
	rt.callName(f, (secsensor = rt.index(rt.gl("huds"), rt.sv(f, "sec_hud"))), "add_hud_to", [live(f.src)]);
	return f.dot;
});

// /mob/living/silicon/proc/add_med_hud  (code/modules/mob/living/silicon/silicon.dm:340)
rt.def("/mob/living/silicon/proc/add_med_hud", function add_med_hud(f: Frame) {
	let medsensor: Value = null;
	f.vars = () => [medsensor];
	rt.callName(f, (medsensor = rt.index(rt.gl("huds"), rt.sv(f, "med_hud"))), "add_hud_to", [live(f.src)]);
	return f.dot;
});

// /mob/living/silicon/proc/add_diag_hud  (code/modules/mob/living/silicon/silicon.dm:344)
rt.def("/mob/living/silicon/proc/add_diag_hud", function add_diag_hud(f: Frame) {
	let diagsensor: Value = null;
	f.vars = () => [diagsensor];
	rt.callName(f, (diagsensor = rt.index(rt.gl("huds"), rt.sv(f, "d_hud"))), "add_hud_to", [live(f.src)]);
	return f.dot;
});

// /mob/living/silicon/proc/sensor_mode  (code/modules/mob/living/silicon/silicon.dm:348)  may sleep
rt.def("/mob/living/silicon/proc/sensor_mode", function* sensor_mode(f: Frame) {
	let sensor_type: Value = null;
	let $0: any;
	f.vars = () => [sensor_type, $0];
	if (truthy((yield* g.srcCall(f, "incapacitated")))) {
		return live(f.dot);
	}
	sensor_type = (yield* g.op(f, "Prompt", [0], [null, null, "Sensor Integration", "Please select sensor type.", rt.list("Security", "Medical", "Diagnostic", "Disable")]));
	yield* g.srcCall(f, "remove_med_sec_hud");
	$0 = live(sensor_type);
	if ($0 === "Security") {
		yield* g.srcCall(f, "add_sec_hud");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Security records overlay enabled.</span>"]);
	} else if ($0 === "Medical") {
		yield* g.srcCall(f, "add_med_hud");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Life signs monitor overlay enabled.</span>"]);
	} else if ($0 === "Diagnostic") {
		yield* g.srcCall(f, "add_diag_hud");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>Robotics diagnostic overlay enabled.</span>"]);
	} else if ($0 === "Disable") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "Sensor augmentations disabled."]);
	}
	return f.dot;
}, true);

// /mob/living/silicon/proc/GetPhoto  (code/modules/mob/living/silicon/silicon.dm:368)  may sleep
rt.def("/mob/living/silicon/proc/GetPhoto", function* GetPhoto(f: Frame) {
	if (!truthy(rt.sv(f, "aicamera"))) return f.dot;
	return (yield* g.callName(f, rt.sv(f, "aicamera"), "selectpicture", [rt.sv(f, "aicamera")]));
}, true);

// /mob/living/silicon/proc/update_transform  (code/modules/mob/living/silicon/silicon.dm:371)
rt.def("/mob/living/silicon/proc/update_transform", function update_transform(f: Frame) {
	let ntransform: Value = null, changed: Value = null;
	f.vars = () => [ntransform, changed];
	ntransform = rt.call(f, P("/proc/matrix"), null, [rt.sv(f, "transform")]);
	changed = 0;
	if (!isEqual(rt.sv(f, "resize"), 1)) {
		changed = rt.inc(live(changed), 1);
		rt.callName(f, live(ntransform), "Scale", [rt.sv(f, "resize")]);
		rt.setSv(f, "resize", 1);
	}
	if (truthy(live(changed))) {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(ntransform), "time", 2, "easing", 192]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});
