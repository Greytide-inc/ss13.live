// From code/game/objects/items/devices/taperecorder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9289, "/obj/item/device/taperecorder", "/obj/item/device", {
	recording: 0,
	playing: 0,
	playsleepseconds: 0,
	mytape: null,
	open_panel: 0,
	canprint: 1,
	starting_tape_type: rt.typePath("/obj/item/device/tape/random"),
	flags: 16,
	name: "universal recorder",
	desc: "A device that can record to cassette tapes, and play them. It automatically translates the content in playback.",
	icon_state: "taperecorder_empty",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	materials: null,
	force: 2,
	throwforce: 0,
});

// /obj/item/device/taperecorder/proc/<init>  (code/game/objects/items/devices/taperecorder.dm:9)
rt.def("/obj/item/device/taperecorder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 60, "$glass", 30]));
	return f.dot;
});

// /obj/item/device/taperecorder/proc/Initialize  (code/game/objects/items/devices/taperecorder.dm:22)  may sleep
rt.def("/obj/item/device/taperecorder/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "starting_tape_type"))) {
		rt.setSv(f, "mytape", (yield* g.new_(f, rt.sv(f, "starting_tape_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/device/taperecorder/proc/examine  (code/game/objects/items/devices/taperecorder.dm:29)
rt.def("/obj/item/device/taperecorder/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "open_panel"))) {
		$1 = "opened";
	} else {
		$1 = "closed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The wire panel is ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/taperecorder/proc/attackby  (code/game/objects/items/devices/taperecorder.dm:34)  may sleep
rt.def("/obj/item/device/taperecorder/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (!(!truthy(rt.sv(f, "mytape")) && truthy((rt.istype(live(I), T("/obj/item/device/tape")) ? 1 : 0)))) return f.dot;
	if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
		return live(f.dot);
	}
	rt.setSv(f, "mytape", live(I));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(I), live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/taperecorder/proc/eject  (code/game/objects/items/devices/taperecorder.dm:44)  may sleep
rt.def("/obj/item/device/taperecorder/proc/eject", function* eject(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "mytape"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "mytape"), live(f.src)])]);
	yield* g.srcCall(f, "stop");
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "mytape")]);
	rt.setSv(f, "mytape", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/taperecorder/proc/fire_act  (code/game/objects/items/devices/taperecorder.dm:51)  may sleep
rt.def("/obj/item/device/taperecorder/proc/fire_act", function* fire_act(f: Frame) {
	yield* g.callName(f, rt.sv(f, "mytape"), "ruin", []);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/device/taperecorder/proc/attack_hand  (code/game/objects/items/devices/taperecorder.dm:55)  may sleep
rt.def("/obj/item/device/taperecorder/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		if (truthy(rt.sv(f, "mytape"))) {
			if (!truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)])))) {
				yield* g.callSuper(f, [], rt.Args.Same);
				return live(f.dot);
			}
			yield* g.srcCall(f, "eject", live(f.args[0]));
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/taperecorder/proc/can_use  (code/game/objects/items/devices/taperecorder.dm:66)
rt.def("/obj/item/device/taperecorder/proc/can_use", function can_use(f: Frame, user: Value) {
	if ((truthy(live(user)) && truthy(rt.call(f, P("/proc/ismob"), null, [live(user)])))) {
		if (!truthy(rt.callName(f, live(user), "incapacitated", []))) {
			return 1;
		}
	}
	return 0;
});

// /obj/item/device/taperecorder/verb/ejectverb  (code/game/objects/items/devices/taperecorder.dm:76)  may sleep
rt.def("/obj/item/device/taperecorder/verb/ejectverb", function* ejectverb(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "mytape"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "eject", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Eject Tape", category: "Object" } });

// /obj/item/device/taperecorder/proc/update_icon  (code/game/objects/items/devices/taperecorder.dm:85)
rt.def("/obj/item/device/taperecorder/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "mytape"))) {
		rt.setSv(f, "icon_state", "taperecorder_empty");
	} else {
		if (truthy(rt.sv(f, "recording"))) {
			rt.setSv(f, "icon_state", "taperecorder_recording");
		} else {
			if (truthy(rt.sv(f, "playing"))) {
				rt.setSv(f, "icon_state", "taperecorder_playing");
			} else {
				rt.setSv(f, "icon_state", "taperecorder_idle");
			}
		}
	}
	return f.dot;
});

// /obj/item/device/taperecorder/proc/Hear  (code/game/objects/items/devices/taperecorder.dm:96)
rt.def("/obj/item/device/taperecorder/proc/Hear", function Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (!(truthy(rt.sv(f, "mytape")) && truthy(rt.sv(f, "recording")))) return f.dot;
	rt.modField(f, rt.sv(f, "mytape"), "timestamp", rt.fv(f, "used_capacity", rt.sv(f, "mytape")), add);
	rt.modField(f, rt.sv(f, "mytape"), "storedinfo", fmt("[＀] ＀", [rt.call(f, P("/proc/time2text"), null, [multiply(rt.fv(f, "used_capacity", rt.sv(f, "mytape")), 10), "mm:ss"]), live(message)]), add);
	return f.dot;
});

// /obj/item/device/taperecorder/verb/record  (code/game/objects/items/devices/taperecorder.dm:104)  may sleep
rt.def("/obj/item/device/taperecorder/verb/record", function* record(f: Frame) {
	let used: Value = null, max: Value = null;
	f.vars = () => [used, max];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "mytape")) || truthy(rt.fv(f, "ruined", rt.sv(f, "mytape"))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "recording"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "playing"))) {
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "used_capacity", rt.sv(f, "mytape")), rt.fv(f, "max_capacity", rt.sv(f, "mytape")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Recording started.</span>"]);
		rt.setSv(f, "recording", 1);
		yield* g.srcCall(f, "update_icon");
		rt.modField(f, rt.sv(f, "mytape"), "timestamp", rt.fv(f, "used_capacity", rt.sv(f, "mytape")), add);
		rt.modField(f, rt.sv(f, "mytape"), "storedinfo", fmt("[＀] Recording started.", [(yield* g.call(f, P("/proc/time2text"), null, [multiply(rt.fv(f, "used_capacity", rt.sv(f, "mytape")), 10), "mm:ss"]))]), add);
		used = rt.fv(f, "used_capacity", rt.sv(f, "mytape"));
		max = rt.fv(f, "max_capacity", rt.sv(f, "mytape"));
		live(used);
		while (rt.lt(live(used), live(max))) {
			if (isEqual(rt.sv(f, "recording"), 0)) {
				break;
			}
			rt.incField(f, rt.sv(f, "mytape"), "used_capacity", 1, true);
			used = rt.inc(live(used), 1);
			yield* g.call(f, P("/proc/sleep"), null, [10]);
		}
		rt.setSv(f, "recording", 0);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The tape is full.</span>"]);
	}
	return f.dot;
}, true, { verb: { name: "Start Recording", category: "Object" } });

// /obj/item/device/taperecorder/verb/stop  (code/game/objects/items/devices/taperecorder.dm:137)
rt.def("/obj/item/device/taperecorder/verb/stop", function stop(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.callSrc(f, "can_use", [live(f.usr)]))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "recording"))) {
		rt.setSv(f, "recording", 0);
		rt.modField(f, rt.sv(f, "mytape"), "timestamp", rt.fv(f, "used_capacity", rt.sv(f, "mytape")), add);
		rt.modField(f, rt.sv(f, "mytape"), "storedinfo", fmt("[＀] Recording stopped.", [rt.call(f, P("/proc/time2text"), null, [multiply(rt.fv(f, "used_capacity", rt.sv(f, "mytape")), 10), "mm:ss"])]), add);
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Recording stopped.</span>"]);
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "playing"))) {
			rt.setSv(f, "playing", 0);
			rt.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", ["<font color=Maroon><B>Tape Recorder</B>: Playback stopped.</font>"]);
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Stop", category: "Object" } });

// /obj/item/device/taperecorder/verb/play  (code/game/objects/items/devices/taperecorder.dm:157)  may sleep
rt.def("/obj/item/device/taperecorder/verb/play", function* play(f: Frame) {
	let used: Value = null, max: Value = null, i: Value = null;
	f.vars = () => [used, max, i];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "mytape")) || truthy(rt.fv(f, "ruined", rt.sv(f, "mytape"))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "recording"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "playing"))) {
		return live(f.dot);
	}
	rt.setSv(f, "playing", 1);
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Playing started.</span>"]);
	used = rt.fv(f, "used_capacity", rt.sv(f, "mytape"));
	max = rt.fv(f, "max_capacity", rt.sv(f, "mytape"));
	i = null;
	i = 1;
	while (rt.lt(live(used), live(max))) {
		if (!truthy(rt.sv(f, "mytape"))) {
			break;
		}
		if (isEqual(rt.sv(f, "playing"), 0)) {
			break;
		}
		if (rt.lt(rt.getLen(f, rt.fv(f, "storedinfo", rt.sv(f, "mytape"))), live(i))) {
			break;
		}
		yield* g.srcCall(f, "say", rt.index(rt.fv(f, "storedinfo", rt.sv(f, "mytape")), live(i)));
		if (rt.lt(rt.getLen(f, rt.fv(f, "storedinfo", rt.sv(f, "mytape"))), add(live(i), 1))) {
			rt.setSv(f, "playsleepseconds", 1);
			yield* g.call(f, P("/proc/sleep"), null, [10]);
			yield* g.srcCall(f, "say", "End of recording.");
		} else {
			rt.setSv(f, "playsleepseconds", subtract(rt.index(rt.fv(f, "timestamp", rt.sv(f, "mytape")), add(live(i), 1)), rt.index(rt.fv(f, "timestamp", rt.sv(f, "mytape")), live(i))));
		}
		if (rt.gt(rt.sv(f, "playsleepseconds"), 14)) {
			yield* g.call(f, P("/proc/sleep"), null, [10]);
			yield* g.srcCall(f, "say", fmt("Skipping ＀ seconds of silence", [rt.sv(f, "playsleepseconds")]));
			rt.setSv(f, "playsleepseconds", 1);
		}
		i = rt.inc(live(i), 1);
		yield* g.call(f, P("/proc/sleep"), null, [multiply(10, rt.sv(f, "playsleepseconds"))]);
	}
	rt.setSv(f, "playing", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { verb: { name: "Play Tape", category: "Object" } });

// /obj/item/device/taperecorder/proc/attack_self  (code/game/objects/items/devices/taperecorder.dm:196)  may sleep
rt.def("/obj/item/device/taperecorder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy(rt.sv(f, "mytape")) || truthy(rt.fv(f, "ruined", rt.sv(f, "mytape"))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "recording"))) {
		yield* g.srcCall(f, "stop");
	} else {
		yield* g.srcCall(f, "record");
	}
	return f.dot;
}, true);

// /obj/item/device/taperecorder/verb/print_transcript  (code/game/objects/items/devices/taperecorder.dm:208)  may sleep
rt.def("/obj/item/device/taperecorder/verb/print_transcript", function* print_transcript(f: Frame) {
	let _P: Value = null, t1: Value = null, i: Value = null;
	f.vars = () => [_P, t1, i];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "mytape"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "canprint"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The recorder can't print that fast!</span>"]);
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "recording")) || truthy(rt.sv(f, "playing")))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Transcript printed.</span>"]);
	_P = (yield* g.new_(f, T("/obj/item/weapon/paper"), [rt.getStep(f, live(f.src), 0)]));
	t1 = "<B>Transcript:</B><BR><BR>";
	i = null;
	i = 1;
	while (rt.ge(rt.getLen(f, rt.fv(f, "storedinfo", rt.sv(f, "mytape"))), live(i))) {
		t1 = rt.modify(live(t1), fmt("＀<BR>", [rt.index(rt.fv(f, "storedinfo", rt.sv(f, "mytape")), live(i))]), add);
		i = rt.inc(live(i), 1);
	}
	rt.setFv(f, "info", live(_P), live(t1));
	rt.setFv(f, "name", live(_P), "paper- 'Transcript'");
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(_P)]);
	rt.setSv(f, "canprint", 0);
	yield* g.call(f, P("/proc/sleep"), null, [300]);
	rt.setSv(f, "canprint", 1);
	return f.dot;
}, true, { verb: { name: "Print Transcript", category: "Object" } });

rt.type(9291, "/obj/item/device/tape", "/obj/item/device", {
	max_capacity: 600,
	used_capacity: 0,
	storedinfo: null,
	timestamp: null,
	ruined: 0,
	name: "tape",
	desc: "A magnetic tape that can hold up to ten minutes of content.",
	icon_state: "tape_white",
	item_state: "analyzer",
	w_class: 1,
	materials: null,
	force: 1,
	throwforce: 0,
});

// /obj/item/device/tape/proc/<init>  (code/game/objects/items/devices/taperecorder.dm:247)
rt.def("/obj/item/device/tape/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "storedinfo", rt.list());
	$0 = $0;
	rt.setSv(f, "timestamp", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 20, "$glass", 5]));
	return f.dot;
});

// /obj/item/device/tape/proc/fire_act  (code/game/objects/items/devices/taperecorder.dm:252)  may sleep
rt.def("/obj/item/device/tape/proc/fire_act", function* fire_act(f: Frame) {
	yield* g.srcCall(f, "ruin");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/item/device/tape/proc/attack_self  (code/game/objects/items/devices/taperecorder.dm:256)
rt.def("/obj/item/device/tape/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "ruined"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You pull out all the tape!</span>"]);
	rt.callSrc(f, "ruin", []);
	return f.dot;
});

// /obj/item/device/tape/proc/ruin  (code/game/objects/items/devices/taperecorder.dm:264)
rt.def("/obj/item/device/tape/proc/ruin", function ruin(f: Frame) {
	if (!truthy(rt.sv(f, "ruined"))) {
		rt.callSrc(f, "add_overlay", ["ribbonoverlay"]);
	}
	rt.setSv(f, "ruined", 1);
	return f.dot;
});

// /obj/item/device/tape/proc/fix  (code/game/objects/items/devices/taperecorder.dm:270)
rt.def("/obj/item/device/tape/proc/fix", function fix(f: Frame) {
	rt.callSrc(f, "cut_overlay", ["ribbonoverlay"]);
	rt.setSv(f, "ruined", 0);
	return f.dot;
});

// /obj/item/device/tape/proc/attackby  (code/game/objects/items/devices/taperecorder.dm:277)  may sleep
rt.def("/obj/item/device/tape/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let delay: Value = null;
	f.vars = () => [I, user, params, delay];
	if (!truthy(rt.sv(f, "ruined"))) return f.dot;
	delay = -1;
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		delay = multiply(120, rt.fv(f, "toolspeed", live(I)));
	} else {
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/pen")) ? 1 : 0))) {
			delay = 180;
		}
	}
	if (isEqual(live(delay), -1)) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start winding the tape back in...</span>"]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, live(delay), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You wound the tape back in.</span>"]);
	yield* g.srcCall(f, "fix");
	return f.dot;
}, true);

rt.type(9292, "/obj/item/device/tape/random", "/obj/item/device/tape", {});

// /obj/item/device/tape/random/proc/New  (code/game/objects/items/devices/taperecorder.dm:289)  may sleep
rt.def("/obj/item/device/tape/random/proc/New", function* New(f: Frame) {
	rt.setSv(f, "icon_state", fmt("tape_＀", [rt.op(f, "PickUnweighted", [5], ["white", "blue", "red", "yellow", "purple"])]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
