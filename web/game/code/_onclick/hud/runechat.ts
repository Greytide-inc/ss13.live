// From code/_onclick/hud/runechat.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalrunechat_colors  (code/_onclick/hud/runechat.dm:14)
rt.def("/datum/controller/global_vars/proc/InitGlobalrunechat_colors", function InitGlobalrunechat_colors(f: Frame) {
	rt.setGl("runechat_colors", rt.list("#ff6b6b", "#ff9f43", "#f2d600", "#6bd36b", "#2ec4b6", "#4cc9f0", "#6b8cff", "#a56bff", "#e06bd6", "#ff7f50", "#9acd32", "#00bfff"));
	rt.modSrcVar(f, "gvars_datum_init_order", "runechat_colors", add);
	return f.dot;
});

rt.type(79, "/datum/chatmessage", "/datum", {
	owner: null,
	speaker: null,
	I: null,
	height: 10,
});

// /datum/chatmessage/proc/New  (code/_onclick/hud/runechat.dm:23)  may sleep
rt.def("/datum/chatmessage/proc/New", function* New(f: Frame, C: Value, S: Value, text: Value, spans: Value) {
	let lines: Value = null, name_sum: Value = null, nm: Value = null, i: Value = null, color: Value = null, style: Value = null, mine: Value = null, old: Value = null, oldest: Value = null, life: Value = null;
	let $0: any, $e: any;
	f.vars = () => [C, S, text, spans, lines, name_sum, nm, i, color, style, mine, old, oldest, life, $0, $e];
	if (((!truthy(live(C)) || !truthy(live(S))) || !truthy(live(text)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "owner", live(C));
	rt.setSv(f, "speaker", live(S));
	if (rt.gt(rt.length(live(text)), 60)) {
		text = fmt("＀...", [(yield* g.call(f, P("/proc/copytext"), null, [live(text), 1, 58]))]);
	}
	rt.setSv(f, "height", add(multiply((lines = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/round"), null, [divide(subtract(add(rt.length(live(text)), 20), 1), 20)]))]))), 10), 2));
	name_sum = 0;
	nm = fmt("＀", [rt.fv(f, "name", live(S))]);
	i = null;
	rt.forRange(f, 0, 1, rt.length(live(nm)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		name_sum = rt.modify(live(name_sum), (yield* g.call(f, P("/proc/text2ascii"), null, [live(nm), live(i)])), add);
	}
	rt.endFor(f, 0);
	color = rt.index(rt.gl("runechat_colors"), add(rt.modulus(live(name_sum), rt.len(f, rt.gl("runechat_colors"))), 1));
	if ((truthy(live(spans)) && truthy((rt.isIn(f, "emphasis", live(spans)) ? 1 : 0)))) {
		$0 = "font-style:italic;";
	} else {
		$0 = "";
	}
	style = $0;
	rt.setSv(f, "I", (yield* g.call(f, P("/proc/image"), null, ["loc", live(S)], rt.Args.Named)));
	rt.setFv(f, "layer", rt.sv(f, "I"), 5);
	rt.setFv(f, "maptext_y", rt.sv(f, "I"), 32);
	rt.setFv(f, "maptext_width", rt.sv(f, "I"), 120);
	rt.setFv(f, "maptext_height", rt.sv(f, "I"), rt.sv(f, "height"));
	rt.setFv(f, "maptext_x", rt.sv(f, "I"), -44);
	rt.setFv(f, "maptext", rt.sv(f, "I"), fmt("<div align='center' style='color:＀;font-size:7.5pt;＀text-shadow:1px 1px 1px #000;'>＀</div>", [live(color), live(style), live(text)]));
	rt.setFv(f, "alpha", rt.sv(f, "I"), 255);
	if (!truthy(rt.fv(f, "runechat_lines", rt.sv(f, "owner")))) {
		rt.setFv(f, "runechat_lines", rt.sv(f, "owner"), rt.list());
	}
	if (!truthy((mine = rt.index(rt.fv(f, "runechat_lines", rt.sv(f, "owner")), live(S))))) {
		mine = rt.list();
		rt.setAt(rt.fv(f, "runechat_lines", rt.sv(f, "owner")), live(S), live(mine));
	}
	old = null;
	rt.forList(f, 0, live(mine), T("/datum/chatmessage"));
	while (($e = rt.next(f, 0)) !== undefined) {
		old = $e;
		if (truthy(rt.fv(f, "I", live(old)))) {
			rt.op(f, "Animate", [2, 6], [null, rt.fv(f, "I", live(old)), "maptext_y", add(rt.gv(f, "maptext_y", rt.fv(f, "I", live(old))), rt.sv(f, "height")), "time", 3]);
		}
	}
	rt.endFor(f, 0);
	mine = rt.modify(live(mine), live(f.src), add);
	rt.modField(f, rt.sv(f, "owner"), "images", rt.sv(f, "I"), add);
	if (rt.gt(rt.len(f, live(mine)), 4)) {
		yield* g.call(f, P("/proc/qdel"), null, [(oldest = rt.index(live(mine), 1))]);
	}
	life = add(40, multiply(rt.length(live(text)), 0.30000001192092896));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/chatmessage/proc/begin_fade")])), live(life)]);
	return f.dot;
}, true);

// /datum/chatmessage/proc/begin_fade  (code/_onclick/hud/runechat.dm:64)  may sleep
rt.def("/datum/chatmessage/proc/begin_fade", function* begin_fade(f: Frame) {
	if (((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.sv(f, "I")))) {
		return live(f.dot);
	}
	rt.op(f, "Animate", [2, 6], [null, rt.sv(f, "I"), "alpha", 0, "time", 4]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 5, 8]);
	return f.dot;
}, true);

// /datum/chatmessage/proc/Destroy  (code/_onclick/hud/runechat.dm:72)  may sleep
rt.def("/datum/chatmessage/proc/Destroy", function* Destroy(f: Frame) {
	let mine: Value = null;
	let $0: any;
	f.vars = () => [mine, $0];
	if (truthy(rt.sv(f, "owner"))) {
		if (truthy(rt.sv(f, "I"))) {
			(rt.modField(f, rt.sv(f, "owner"), "images", rt.sv(f, "I"), subtract));
		}
		if (truthy(rt.fv(f, "runechat_lines", rt.sv(f, "owner")))) {
			$0 = rt.index(rt.fv(f, "runechat_lines", rt.sv(f, "owner")), rt.sv(f, "speaker"));
		} else {
			$0 = null;
		}
		if (truthy((mine = $0))) {
			(mine = rt.modify(live(mine), live(f.src), subtract));
			if (!truthy(rt.len(f, live(mine)))) {
				(rt.modField(f, rt.sv(f, "owner"), "runechat_lines", rt.sv(f, "speaker"), subtract));
			}
		}
	}
	rt.setSv(f, "I", null);
	rt.setSv(f, "owner", null);
	rt.setSv(f, "speaker", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/proc/show_runechat  (code/_onclick/hud/runechat.dm:84)  may sleep
rt.def("/mob/living/proc/show_runechat", function* show_runechat(f: Frame, speaker: Value, message_language: Value, raw_message: Value, spans: Value) {
	let D: Value = null;
	f.vars = () => [speaker, message_language, raw_message, spans, D];
	if ((((((!truthy(rt.sv(f, "client")) || !truthy(rt.fv(f, "prefs", rt.sv(f, "client")))) || !truthy(rt.gv(f, "runechat_pref", rt.fv(f, "prefs", rt.sv(f, "client"))))) || !truthy(live(raw_message))) || !truthy(live(speaker))) || !truthy(rt.fv(f, "loc", live(speaker))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "can_hear")))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "has_language", live(message_language))))) {
		if (!truthy(live(message_language))) {
			return live(f.dot);
		}
		if (truthy((D = rt.index(rt.gl("language_datum_instances"), live(message_language))))) {
			raw_message = (yield* g.callName(f, live(D), "scramble", [live(raw_message)]));
		}
	}
	yield* g.new_(f, T("/datum/chatmessage"), [rt.sv(f, "client"), live(speaker), live(raw_message), live(spans)]);
	return f.dot;
}, true);

// /client/verb/toggle_runechat  (code/_onclick/hud/runechat.dm:104)  may sleep
rt.def("/client/verb/toggle_runechat", function* toggle_runechat(f: Frame) {
	let S: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [S, M, $0, $1, $2, $e];
	rt.setFv(f, "runechat_pref", rt.sv(f, "prefs"), (!truthy(rt.fv(f, "runechat_pref", rt.sv(f, "prefs"))) ? 1 : 0));
	if ((!truthy(rt.fv(f, "runechat_pref", rt.sv(f, "prefs"))) && truthy(rt.sv(f, "runechat_lines")))) {
		S = null;
		rt.forList(f, 0, rt.sv(f, "runechat_lines"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			M = null;
			rt.forList(f, 1, rt.index(rt.sv(f, "runechat_lines"), live(S)), T("/datum/chatmessage"));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	$0 = live(f.src);
	$1 = "runechat";
	if (truthy(rt.fv(f, "runechat_pref", rt.sv(f, "prefs")))) {
		$2 = "true";
	} else {
		$2 = "false";
	}
	yield* g.call(f, P("/proc/winset"), null, [$0, $1, fmt("is-checked=＀", [$2])]);
	$0 = live(f.src);
	if (truthy(rt.fv(f, "runechat_pref", rt.sv(f, "prefs")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("Runechat is now ＀.", [$1])]);
	yield* g.callName(f, rt.sv(f, "prefs"), "save_preferences", []);
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-runechat", category: "OOC" } });

rt.type(80, "/datum/balloon_alert", "/datum", {
	owner: null,
	I: null,
});

// /datum/balloon_alert/proc/New  (code/_onclick/hud/runechat.dm:126)  may sleep
rt.def("/datum/balloon_alert/proc/New", function* New(f: Frame, C: Value, target: Value, text: Value) {
	f.vars = () => [C, target, text];
	if (((!truthy(live(C)) || !truthy(live(target))) || !truthy(live(text)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "owner", live(C));
	if (rt.gt(rt.length(live(text)), 40)) {
		text = fmt("＀...", [(yield* g.call(f, P("/proc/copytext"), null, [live(text), 1, 38]))]);
	}
	rt.setSv(f, "I", (yield* g.call(f, P("/proc/image"), null, ["loc", live(target)], rt.Args.Named)));
	rt.setFv(f, "layer", rt.sv(f, "I"), 5);
	rt.setFv(f, "maptext_width", rt.sv(f, "I"), 96);
	rt.setFv(f, "maptext_height", rt.sv(f, "I"), 12);
	rt.setFv(f, "maptext_x", rt.sv(f, "I"), -32);
	rt.setFv(f, "maptext_y", rt.sv(f, "I"), 24);
	rt.setFv(f, "maptext", rt.sv(f, "I"), fmt("<div align='center' style='color:#ffffff;font-size:6pt;text-shadow:1px 1px 1px #000;'>＀</div>", [live(text)]));
	rt.setFv(f, "alpha", rt.sv(f, "I"), 255);
	rt.modField(f, rt.sv(f, "owner"), "images", rt.sv(f, "I"), add);
	rt.op(f, "Animate", [2, 6], [null, rt.sv(f, "I"), "maptext_y", 36, "time", 20]);
	rt.op(f, "Animate", [2, 4], ["alpha", 0, "time", 6]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 27, 8]);
	return f.dot;
}, true);

// /datum/balloon_alert/proc/Destroy  (code/_onclick/hud/runechat.dm:146)  may sleep
rt.def("/datum/balloon_alert/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(rt.sv(f, "owner")) && truthy(rt.sv(f, "I")))) {
		(rt.modField(f, rt.sv(f, "owner"), "images", rt.sv(f, "I"), subtract));
	}
	rt.setSv(f, "I", null);
	rt.setSv(f, "owner", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /atom/proc/balloon_alert  (code/_onclick/hud/runechat.dm:154)  may sleep
rt.def("/atom/proc/balloon_alert", function* balloon_alert(f: Frame, viewer: Value, text: Value) {
	let target: Value = null;
	let $0: any;
	f.vars = () => [viewer, text, target, $0];
	if (((!truthy(live(viewer)) || !truthy(rt.fv(f, "client", live(viewer)))) || !truthy(live(text)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(f.src)])))) {
		$0 = live(f.src);
	} else {
		$0 = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src)]));
	}
	if ((!truthy((target = $0)) || !(truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) || truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(target))])))))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/datum/balloon_alert"), [rt.fv(f, "client", live(viewer)), live(target), live(text)]);
	return f.dot;
}, true);

// /atom/proc/balloon_alert_to_viewers  (code/_onclick/hud/runechat.dm:163)  may sleep
rt.def("/atom/proc/balloon_alert_to_viewers", function* balloon_alert_to_viewers(f: Frame, text: Value, self_text: Value, vision_distance: Value, ignored_mobs: Value) {
	let M: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [text, self_text, vision_distance, ignored_mobs, M, $0, $1, $e];
	if (live(vision_distance) === null) {
		vision_distance = 7;
	}
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(vision_distance), live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy(rt.fv(f, "client", live(M))) || (truthy(live(ignored_mobs)) && truthy((rt.isIn(f, live(M), live(ignored_mobs)) ? 1 : 0))))) {
			continue;
		}
		$0 = live(M);
		if ((truthy(live(self_text)) && isEqual(live(M), live(f.src)))) {
			$1 = live(self_text);
		} else {
			$1 = live(text);
		}
		yield* g.srcCall(f, "balloon_alert", $0, $1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
