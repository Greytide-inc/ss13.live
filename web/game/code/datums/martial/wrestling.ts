// From code/datums/martial/wrestling.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/wrestling_help  (code/datums/martial/wrestling.dm:6)
rt.def("/mob/living/carbon/human/proc/wrestling_help", function wrestling_help(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<b><i>You flex your muscles and have a revelation...</i></b>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Clinch</span>: Grab. Passively gives you a chance to immediately aggressively grab someone. Not always successful."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Suplex</span>: Disarm someone you are grabbing. Suplexes your target to the floor. Greatly injures them and leaves both you and your target on the floor."]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Advanced grab</span>: Grab. Passively causes stamina damage when grabbing someone."]);
	return f.dot;
}, false, { verb: { name: "Recall Teachings", category: "Wrestling", desc: "Remember how to wrestle." } });

rt.type(573, "/datum/martial_art/wrestling", "/datum/martial_art", {
	slam: null,
	throw_wrassle: null,
	kick: null,
	strike: null,
	drop: null,
	name: "Wrestling",
});

// /datum/martial_art/wrestling/proc/<init>  (code/datums/martial/wrestling.dm:13)  may sleep
rt.def("/datum/martial_art/wrestling/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "slam", (yield* g.new_(f, T("/datum/action/slam"), [])));
	$0 = $0;
	rt.setSv(f, "throw_wrassle", (yield* g.new_(f, T("/datum/action/throw_wrassle"), [])));
	$0 = $0;
	rt.setSv(f, "kick", (yield* g.new_(f, T("/datum/action/kick"), [])));
	$0 = $0;
	rt.setSv(f, "strike", (yield* g.new_(f, T("/datum/action/strike"), [])));
	$0 = $0;
	rt.setSv(f, "drop", (yield* g.new_(f, T("/datum/action/drop"), [])));
	return f.dot;
}, true);

// /datum/martial_art/wrestling/proc/check_streak  (code/datums/martial/wrestling.dm:20)  may sleep
rt.def("/datum/martial_art/wrestling/proc/check_streak", function* check_streak(f: Frame, A: Value, D: Value) {
	let $0: any;
	f.vars = () => [A, D, $0];
	$0 = rt.sv(f, "streak");
	if ($0 === "drop") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "drop", live(A), live(D));
		return 1;
	} else if ($0 === "strike") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "strike", live(A), live(D));
		return 1;
	} else if ($0 === "kick") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "kick", live(A), live(D));
		return 1;
	} else if ($0 === "throw") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "throw_wrassle", live(A), live(D));
		return 1;
	} else if ($0 === "slam") {
		rt.setSv(f, "streak", "");
		yield* g.srcCall(f, "slam", live(A), live(D));
		return 1;
	}
	return 0;
}, true);

rt.type(261, "/datum/action/slam", "/datum/action", {
	name: "Slam (Cinch) - Slam a grappled opponent into the floor.",
	button_icon_state: "wrassle_slam",
});

// /datum/action/slam/proc/Trigger  (code/datums/martial/wrestling.dm:48)
rt.def("/datum/action/slam/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>"]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ prepares to BODY SLAM!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a BODY SLAM.</i></b>"]);
	rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner")))), "slam");
	return f.dot;
});

rt.type(262, "/datum/action/throw_wrassle", "/datum/action", {
	name: "Throw (Cinch) - Spin a cinched opponent around and throw them.",
	button_icon_state: "wrassle_throw",
});

// /datum/action/throw_wrassle/proc/Trigger  (code/datums/martial/wrestling.dm:60)
rt.def("/datum/action/throw_wrassle/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>"]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ prepares to THROW!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a THROW.</i></b>"]);
	rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner")))), "throw");
	return f.dot;
});

rt.type(263, "/datum/action/kick", "/datum/action", {
	name: "Kick - A powerful kick, sends people flying away from you. Also useful for escaping from bad situations.",
	button_icon_state: "wrassle_kick",
});

// /datum/action/kick/proc/Trigger  (code/datums/martial/wrestling.dm:72)
rt.def("/datum/action/kick/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>"]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ prepares to KICK!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a KICK.</i></b>"]);
	rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner")))), "kick");
	return f.dot;
});

rt.type(264, "/datum/action/strike", "/datum/action", {
	name: "Strike - Hit a neaby opponent with a quick attack.",
	button_icon_state: "wrassle_strike",
});

// /datum/action/strike/proc/Trigger  (code/datums/martial/wrestling.dm:84)
rt.def("/datum/action/strike/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>"]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ prepares to STRIKE!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a STRIKE.</i></b>"]);
	rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner")))), "strike");
	return f.dot;
});

rt.type(265, "/datum/action/drop", "/datum/action", {
	name: "Drop - Smash down onto an opponent.",
	button_icon_state: "wrassle_drop",
});

// /datum/action/drop/proc/Trigger  (code/datums/martial/wrestling.dm:96)
rt.def("/datum/action/drop/proc/Trigger", function Trigger(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (truthy(rt.callName(f, rt.sv(f, "owner"), "incapacitated", []))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You can't WRESTLE while you're OUT FOR THE COUNT.</span>"]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "owner"), "visible_message", [fmt("<span class='danger'>＀ prepares to LEG DROP!</span>", [rt.sv(f, "owner")]), "<b><i>Your next attack will be a LEG DROP.</i></b>"]);
	rt.setFv(f, "streak", rt.gv(f, "martial_art", rt.gv(f, "mind", (H = rt.sv(f, "owner")))), "drop");
	return f.dot;
});

// /datum/martial_art/wrestling/proc/teach  (code/datums/martial/wrestling.dm:104)  may sleep
rt.def("/datum/martial_art/wrestling/proc/teach", function* teach(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'userdanger'>SNAP INTO A THIN TIM!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'danger'>Place your cursor over a move at the top of the screen to see what it does.</span>"]);
	yield* g.callName(f, rt.sv(f, "drop"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "kick"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "slam"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "throw_wrassle"), "Grant", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "strike"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H", "make_temporary"] });

// /datum/martial_art/wrestling/proc/remove  (code/datums/martial/wrestling.dm:114)  may sleep
rt.def("/datum/martial_art/wrestling/proc/remove", function* remove(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class = 'userdanger'>You no longer feel that the tower of power is too sweet to be sour...</span>"]);
	yield* g.callName(f, rt.sv(f, "drop"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "kick"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "slam"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "throw_wrassle"), "Remove", [live(f.args[0])]);
	yield* g.callName(f, rt.sv(f, "strike"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["H"] });

// /datum/martial_art/wrestling/proc/harm_act  (code/datums/martial/wrestling.dm:123)  may sleep
rt.def("/datum/martial_art/wrestling/proc/harm_act", function* harm_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "check_streak", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.args[1]), "punched with wrestling"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "D"] });

// /datum/martial_art/wrestling/proc/throw_wrassle  (code/datums/martial/wrestling.dm:129)  may sleep
rt.def("/datum/martial_art/wrestling/proc/throw_wrassle", function* throw_wrassle(f: Frame, A: Value, D: Value) {
	let i: Value = null, delay: Value = null, _T: Value = null, S: Value = null, _T_0: Value = null;
	let $0: any;
	f.vars = () => [A, D, i, delay, _T, S, _T_0, $0];
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "pulling", live(A))) || !isEqual(rt.fv(f, "pulling", live(A)), live(D)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You need to have ＀ in a cinch!", [live(D)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "forceMove", [rt.fv(f, "loc", live(A))]);
	yield* g.callName(f, live(D), "setDir", [rt.getDir(f, live(D), live(A))]);
	yield* g.callName(f, live(D), "Stun", [80]);
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ starts spinning around with ＀!</B></span>", [live(A), live(D)])]);
	yield* g.callName(f, live(A), "emote", ["scream"]);
	i = null;
	i = 0;
	while (rt.lt(live(i), 20)) {
		delay = 5;
		$0 = live(i);
		if (rt.inRange($0, 17, 9.999999848243207e+30)) {
			delay = 0.25;
		} else if (rt.inRange($0, 14, 16)) {
			delay = 0.5;
		} else if (rt.inRange($0, 9, 13)) {
			delay = 1;
		} else if (rt.inRange($0, 5, 8)) {
			delay = 2;
		} else if (rt.inRange($0, 0, 4)) {
			delay = 3;
		}
		if ((truthy(live(A)) && truthy(live(D)))) {
			if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("＀ is too far away!", [live(D)])]);
				return 0;
			}
			if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You can't throw ＀ from here!", [live(D)])]);
				return 0;
			}
			yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), 90]))]);
			_T = rt.getStep(f, live(A), rt.fv(f, "dir", live(A)));
			if ((((truthy((S = rt.fv(f, "loc", live(D)))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(S)])))) && truthy((yield* g.callName(f, live(S), "Exit", [live(D)])))) && ((truthy(live(_T)) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) && truthy((yield* g.callName(f, live(_T), "Enter", [live(A)])))))) {
				yield* g.callName(f, live(D), "forceMove", [live(_T)]);
				yield* g.callName(f, live(D), "setDir", [rt.getDir(f, live(D), live(A))]);
			}
		} else {
			return 0;
		}
		yield* g.call(f, P("/proc/sleep"), null, [live(delay)]);
		i = rt.inc(live(i), 1);
	}
	if ((truthy(live(A)) && truthy(live(D)))) {
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("＀ is too far away!", [live(D)])]);
			return 0;
		}
		if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You can't throw ＀ from here!", [live(D)])]);
			return 0;
		}
		yield* g.callName(f, live(D), "forceMove", [rt.fv(f, "loc", live(A))]);
		yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ throws ＀!</B></span>", [live(A), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), "swing_hit", 50, 1]);
		if ((truthy((_T_0 = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(A), rt.fv(f, "dir", live(A))])))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T_0)]))))) {
			if (!truthy(rt.fv(f, "stat", live(D)))) {
				yield* g.callName(f, live(D), "emote", ["scream"]);
			}
			yield* g.callName(f, live(D), "throw_at", [null, live(_T_0), null, 10, null, 4, "callback", (yield* g.new_(f, T("/datum/callback"), [live(D), P("/mob/living/carbon/human/proc/Knockdown"), 20]))], rt.Args.Named);
		}
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "has thrown with wrestling"]);
	return 0;
}, true);

// /datum/martial_art/wrestling/proc/FlipAnimation  (code/datums/martial/wrestling.dm:202)  may sleep
rt.def("/datum/martial_art/wrestling/proc/FlipAnimation", function* FlipAnimation(f: Frame, D: Value) {
	f.vars = () => [D];
	if (truthy(live(D))) {
		rt.op(f, "Animate", [2, 8], [null, live(D), "transform", (yield* g.call(f, P("/proc/matrix"), null, [180, 5])), "time", 1, "loop", 0]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [15]);
	if (!truthy(live(D))) return f.dot;
	rt.op(f, "Animate", [2, 8], [null, live(D), "transform", null, "time", 1, "loop", 0]);
	return f.dot;
}, true, { waitfor: false });

// /datum/martial_art/wrestling/proc/slam  (code/datums/martial/wrestling.dm:208)  may sleep
rt.def("/datum/martial_art/wrestling/proc/slam", function* slam(f: Frame, A: Value, D: Value) {
	let i: Value = null, fluff: Value = null;
	let $0: any;
	f.vars = () => [A, D, i, fluff, $0];
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "pulling", live(A))) || !isEqual(rt.fv(f, "pulling", live(A)), live(D)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You need to have ＀ in a cinch!", [live(D)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "forceMove", [rt.fv(f, "loc", live(A))]);
	yield* g.callName(f, live(A), "setDir", [rt.getDir(f, live(A), live(D))]);
	yield* g.callName(f, live(D), "setDir", [rt.getDir(f, live(D), live(A))]);
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ lifts ＀ up!</B></span>", [live(A), live(D)])]);
	yield* g.srcCall(f, "FlipAnimation");
	i = null;
	i = 0;
	while (rt.lt(live(i), 3)) {
		if ((truthy(live(A)) && truthy(live(D)))) {
			rt.modField(f, live(A), "pixel_y", 3, add);
			rt.modField(f, live(D), "pixel_y", 3, add);
			yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), 90]))]);
			yield* g.callName(f, live(D), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(D)), 90]))]);
			$0 = rt.fv(f, "dir", live(A));
			if ($0 === 1) {
				rt.setFv(f, "pixel_x", live(D), rt.fv(f, "pixel_x", live(A)));
			} else if ($0 === 2) {
				rt.setFv(f, "pixel_x", live(D), rt.fv(f, "pixel_x", live(A)));
			} else if ($0 === 4) {
				rt.setFv(f, "pixel_x", live(D), subtract(rt.fv(f, "pixel_x", live(A)), 8));
			} else if ($0 === 8) {
				rt.setFv(f, "pixel_x", live(D), add(rt.fv(f, "pixel_x", live(A)), 8));
			}
			if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 1)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("＀ is too far away!", [live(D)])]);
				rt.setFv(f, "pixel_x", live(A), 0);
				rt.setFv(f, "pixel_y", live(A), 0);
				rt.setFv(f, "pixel_x", live(D), 0);
				rt.setFv(f, "pixel_y", live(D), 0);
				return 0;
			}
			if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You can't slam ＀ here!", [live(D)])]);
				rt.setFv(f, "pixel_x", live(A), 0);
				rt.setFv(f, "pixel_y", live(A), 0);
				rt.setFv(f, "pixel_x", live(D), 0);
				rt.setFv(f, "pixel_y", live(D), 0);
				return 0;
			}
		} else {
			if (truthy(live(A))) {
				rt.setFv(f, "pixel_x", live(A), 0);
				rt.setFv(f, "pixel_y", live(A), 0);
			}
			if (truthy(live(D))) {
				rt.setFv(f, "pixel_x", live(D), 0);
				rt.setFv(f, "pixel_y", live(D), 0);
			}
			return 0;
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
		i = rt.inc(live(i), 1);
	}
	if ((truthy(live(A)) && truthy(live(D)))) {
		rt.setFv(f, "pixel_x", live(A), 0);
		rt.setFv(f, "pixel_y", live(A), 0);
		rt.setFv(f, "pixel_x", live(D), 0);
		rt.setFv(f, "pixel_y", live(D), 0);
		if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("＀ is too far away!", [live(D)])]);
			return 0;
		}
		if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You can't slam ＀ here!", [live(D)])]);
			return 0;
		}
		yield* g.callName(f, live(D), "forceMove", [rt.fv(f, "loc", live(A))]);
		fluff = "body-slam";
		$0 = rt.op(f, "PickUnweighted", [2], [2, 3]);
		if ($0 === 2) {
			fluff = fmt("turbo ＀", [live(fluff)]);
		} else if ($0 === 3) {
			fluff = fmt("atomic ＀", [live(fluff)]);
		}
		yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ ＀ ＀!</B></span>", [live(A), live(fluff), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), "swing_hit", 50, 1]);
		if (!truthy(rt.fv(f, "stat", live(D)))) {
			yield* g.callName(f, live(D), "emote", ["scream"]);
			yield* g.callName(f, live(D), "Knockdown", [40]);
			$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
			if ($0 === 2) {
				yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [20, 30]))]);
			} else if ($0 === 3) {
				yield* g.callName(f, live(D), "ex_act", [3]);
			} else {
				yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
			}
		} else {
			yield* g.callName(f, live(D), "ex_act", [3]);
		}
	} else {
		if (truthy(live(A))) {
			rt.setFv(f, "pixel_x", live(A), 0);
			rt.setFv(f, "pixel_y", live(A), 0);
		}
		if (truthy(live(D))) {
			rt.setFv(f, "pixel_x", live(D), 0);
			rt.setFv(f, "pixel_y", live(D), 0);
		}
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "body-slammed"]);
	return 0;
}, true);

// /datum/martial_art/wrestling/proc/CheckStrikeTurf  (code/datums/martial/wrestling.dm:316)  may sleep
rt.def("/datum/martial_art/wrestling/proc/CheckStrikeTurf", function* CheckStrikeTurf(f: Frame, A: Value, _T: Value) {
	f.vars = () => [A, _T];
	if (!(truthy(live(A)) && ((truthy(live(_T)) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(_T)])), 1)))) return f.dot;
	yield* g.callName(f, live(A), "forceMove", [live(_T)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon/human" }, { path: "/turf" }] });

// /datum/martial_art/wrestling/proc/strike  (code/datums/martial/wrestling.dm:320)  may sleep
rt.def("/datum/martial_art/wrestling/proc/strike", function* strike(f: Frame, A: Value, D: Value) {
	let _T: Value = null, i: Value = null;
	f.vars = () => [A, D, _T, i];
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	if ((((truthy((_T = rt.getStep(f, live(A), 0))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) && truthy(live(D))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
		i = null;
		i = 0;
		while (rt.lt(live(i), 4)) {
			yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), 90]))]);
			i = rt.inc(live(i), 1);
		}
		yield* g.callName(f, live(A), "forceMove", [rt.fv(f, "loc", live(D))]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/datum/martial_art/wrestling/proc/CheckStrikeTurf"), live(A), live(_T)])), 4]);
		yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><b>＀ headbutts ＀!</b></span>", [live(A), live(D)])]);
		yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), "swing_hit", 50, 1]);
		yield* g.callName(f, live(D), "Unconscious", [20]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "headbutted"]);
	return f.dot;
}, true);

// /datum/martial_art/wrestling/proc/kick  (code/datums/martial/wrestling.dm:337)  may sleep
rt.def("/datum/martial_art/wrestling/proc/kick", function* kick(f: Frame, A: Value, D: Value) {
	let _T: Value = null;
	f.vars = () => [A, D, _T];
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "emote", ["scream"]);
	yield* g.callName(f, live(A), "emote", ["flip"]);
	yield* g.callName(f, live(A), "setDir", [(yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(A)), 90]))]);
	yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ roundhouse-kicks ＀!</B></span>", [live(A), live(D)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), "swing_hit", 50, 1]);
	yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
	if ((truthy((_T = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(A), rt.getDir(f, live(A), (yield* g.call(f, P("/proc/get_step_away"), null, [live(D), live(A)])))])))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)]))))) {
		yield* g.callName(f, live(D), "Knockdown", [20]);
		yield* g.callName(f, live(D), "throw_at", [live(_T), 3, 2]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "roundhouse-kicked"]);
	return f.dot;
}, true);

// /datum/martial_art/wrestling/proc/drop  (code/datums/martial/wrestling.dm:354)  may sleep
rt.def("/datum/martial_art/wrestling/proc/drop", function* drop(f: Frame, A: Value, D: Value) {
	let surface: Value = null, ST: Value = null, falling: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [A, D, surface, ST, falling, O, $e];
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	surface = null;
	ST = null;
	falling = 0;
	O = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [1, live(A)])), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (isEqual(rt.fv(f, "density", live(O)), 1)) {
			if (isEqual(live(O), live(A))) {
				continue;
			}
			if (isEqual(live(O), live(D))) {
				continue;
			}
			if (truthy(rt.fv(f, "opacity", live(O)))) {
				continue;
			}
			surface = live(O);
			ST = rt.getStep(f, live(O), 0);
			break;
		}
	}
	rt.endFor(f, 0);
	if ((truthy(live(surface)) && (truthy(live(ST)) && truthy((yield* g.call(f, P("/proc/isturf"), null, [live(ST)])))))) {
		yield* g.callName(f, live(A), "forceMove", [live(ST)]);
		yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ climbs onto ＀!</b></span>", [live(A), live(surface)])]);
		rt.setFv(f, "pixel_y", live(A), 10);
		falling = 1;
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	if ((truthy(live(A)) && truthy(live(D)))) {
		if (((isEqual(live(falling), 0) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 1)) || (isEqual(live(falling), 1) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(D)])), 2)))) {
			rt.setFv(f, "pixel_y", live(A), 0);
			if (isEqual(live(falling), 1)) {
				yield* g.callName(f, live(A), "visible_message", ["<span class = 'danger'><B>...and dives head-first into the ground, ouch!</b></span>"]);
				yield* g.callName(f, live(A), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [10, 20]))]);
				yield* g.callName(f, live(A), "Knockdown", [60]);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("＀ is too far away!", [live(D)])]);
			return 0;
		}
		if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(A))]))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(D))]))))) {
			rt.setFv(f, "pixel_y", live(A), 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), fmt("You can't drop onto ＀ from here!", [live(D)])]);
			return 0;
		}
		if (truthy(live(A))) {
			rt.op(f, "Animate", [2, 8], [null, live(A), "transform", (yield* g.call(f, P("/proc/matrix"), null, [90, 5])), "time", 1, "loop", 0]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		if (truthy(live(A))) {
			rt.op(f, "Animate", [2, 8], [null, live(A), "transform", null, "time", 1, "loop", 0]);
		}
		yield* g.callName(f, live(A), "forceMove", [rt.fv(f, "loc", live(D))]);
		yield* g.callName(f, live(A), "visible_message", [fmt("<span class = 'danger'><B>＀ leg-drops ＀!</B></span>", [live(A), live(D)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(A)), "swing_hit", 50, 1]);
		yield* g.callName(f, live(A), "emote", ["scream"]);
		if (isEqual(live(falling), 1)) {
			if ((truthy(rt.op(f, "Prob", [], [33])) || truthy(rt.fv(f, "stat", live(D))))) {
				yield* g.callName(f, live(D), "ex_act", [3]);
			} else {
				yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [20, 30]))]);
			}
		} else {
			yield* g.callName(f, live(D), "adjustBruteLoss", [(yield* g.call(f, P("/proc/rand"), null, [20, 30]))]);
		}
		yield* g.callName(f, live(D), "Knockdown", [40]);
		rt.setFv(f, "pixel_y", live(A), 0);
	} else {
		if (truthy(live(A))) {
			rt.setFv(f, "pixel_y", live(A), 0);
		}
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "leg-dropped"]);
	return live(f.dot);
}, true);

// /datum/martial_art/wrestling/proc/disarm_act  (code/datums/martial/wrestling.dm:425)  may sleep
rt.def("/datum/martial_art/wrestling/proc/disarm_act", function* disarm_act(f: Frame) {
	if (truthy((yield* g.srcCall(f, "check_streak", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.args[1]), "wrestling-disarmed"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "D"] });

// /datum/martial_art/wrestling/proc/grab_act  (code/datums/martial/wrestling.dm:431)  may sleep
rt.def("/datum/martial_art/wrestling/proc/grab_act", function* grab_act(f: Frame, A: Value, D: Value) {
	f.vars = () => [A, D];
	if (truthy((yield* g.srcCall(f, "check_streak", live(A), live(D))))) {
		return 1;
	}
	if (isEqual(rt.fv(f, "pulling", live(A)), live(D))) {
		return 1;
	}
	yield* g.callName(f, live(A), "start_pulling", [live(D)]);
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ gets ＀ in a cinch!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ gets ＀ in a cinch!</span>", [live(A), live(D)])]);
	yield* g.callName(f, live(D), "Stun", [(yield* g.call(f, P("/proc/rand"), null, [60, 100]))]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "cinched"]);
	return 1;
}, true);

rt.type(5289, "/obj/item/weapon/storage/belt/champion/wrestling", "/obj/item/weapon/storage/belt/champion", {
	style: null,
	name: "Wrestling Belt",
});

// /obj/item/weapon/storage/belt/champion/wrestling/proc/<init>  (code/datums/martial/wrestling.dm:444)  may sleep
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "style", (yield* g.new_(f, T("/datum/martial_art/wrestling"), [])));
	return f.dot;
}, true);

// /obj/item/weapon/storage/belt/champion/wrestling/proc/equipped  (code/datums/martial/wrestling.dm:447)  may sleep
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let H: Value = null;
	f.vars = () => [user, slot, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(live(slot), 5)) {
		H = live(user);
		yield* g.callName(f, rt.sv(f, "style"), "teach", [live(H), 1]);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/storage/belt/champion/wrestling/proc/dropped  (code/datums/martial/wrestling.dm:455)  may sleep
rt.def("/obj/item/weapon/storage/belt/champion/wrestling/proc/dropped", function* dropped(f: Frame, user: Value) {
	let H: Value = null;
	f.vars = () => [user, H];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual((yield* g.callName(f, (H = live(user)), "get_item_by_slot", [5])), live(f.src))) {
		yield* g.callName(f, rt.sv(f, "style"), "remove", [live(H)]);
	}
	return live(f.dot);
}, true);
