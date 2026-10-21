// From code/modules/assembly/timer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9384, "/obj/item/device/assembly/timer", "/obj/item/device/assembly", {
	timing: 0,
	time: 5,
	saved_time: 5,
	loop: 0,
	attachable: 1,
	name: "timer",
	desc: "Used to time things. Works well with contraptions which has to count down. Tick tock.",
	icon_state: "timer",
	materials: null,
	origin_tech: "magnets=1;engineering=1",
});

// /obj/item/device/assembly/timer/proc/<init>  (code/modules/assembly/timer.dm:5)
rt.def("/obj/item/device/assembly/timer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500, "$glass", 50]));
	return f.dot;
});

// /obj/item/device/assembly/timer/proc/New  (code/modules/assembly/timer.dm:16)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/device/assembly/timer/proc/describe  (code/modules/assembly/timer.dm:21)
rt.def("/obj/item/device/assembly/timer/proc/describe", function describe(f: Frame) {
	if (truthy(rt.sv(f, "timing"))) {
		return fmt("The timer is counting down from ＀!", [rt.sv(f, "time")]);
	}
	return fmt("The timer is set for ＀ seconds.", [rt.sv(f, "time")]);
});

// /obj/item/device/assembly/timer/proc/activate  (code/modules/assembly/timer.dm:26)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/activate", function* activate(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	rt.setSv(f, "timing", (!truthy(rt.sv(f, "timing")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return 1;
}, true);

// /obj/item/device/assembly/timer/proc/toggle_secure  (code/modules/assembly/timer.dm:34)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/toggle_secure", function* toggle_secure(f: Frame) {
	rt.setSv(f, "secured", (!truthy(rt.sv(f, "secured")) ? 1 : 0));
	if (truthy(rt.sv(f, "secured"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	} else {
		rt.setSv(f, "timing", 0);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "update_icon");
	return rt.sv(f, "secured");
}, true);

// /obj/item/device/assembly/timer/proc/timer_end  (code/modules/assembly/timer.dm:45)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/timer_end", function* timer_end(f: Frame) {
	if ((!truthy(rt.sv(f, "secured")) || rt.gt(rt.sv(f, "next_activate"), rt.worldTime(f)))) {
		return 0;
	}
	yield* g.srcCall(f, "pulse", 0);
	yield* g.srcCall(f, "audible_message", fmt("＀ *beep* *beep*", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]), null, 3);
	if (truthy(rt.sv(f, "loop"))) {
		rt.setSv(f, "timing", 1);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/assembly/timer/proc/process  (code/modules/assembly/timer.dm:56)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "timing"))) return f.dot;
	rt.incSrcVar(f, "time", -1, true);
	if (!rt.le(rt.sv(f, "time"), 0)) return f.dot;
	rt.setSv(f, "timing", 0);
	yield* g.srcCall(f, "timer_end");
	rt.setSv(f, "time", rt.sv(f, "saved_time"));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/device/assembly/timer/proc/update_icon  (code/modules/assembly/timer.dm:64)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/update_icon", function* update_icon(f: Frame) {
	yield* g.srcCall(f, "cut_overlays");
	rt.setSv(f, "attached_overlays", rt.list());
	if (truthy(rt.sv(f, "timing"))) {
		yield* g.srcCall(f, "add_overlay", "timer_timing");
		rt.modSrcVar(f, "attached_overlays", "timer_timing", add);
	}
	if (!truthy(rt.sv(f, "holder"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "holder"), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/device/assembly/timer/proc/interact  (code/modules/assembly/timer.dm:74)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/interact", function* interact(f: Frame, user: Value) {
	let second: Value = null, minute: Value = null, dat: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, second, minute, dat, popup, $0, $1];
	if (!truthy((yield* g.srcCall(f, "is_secured", live(user))))) return f.dot;
	second = rt.modulus(rt.sv(f, "time"), 60);
	minute = divide(subtract(rt.sv(f, "time"), live(second)), 60);
	if (truthy(rt.sv(f, "timing"))) {
		$0 = fmt("<A href='?src=＃;time=0'>Timing</A>", [live(f.src)]);
	} else {
		$0 = fmt("<A href='?src=＃;time=1'>Not Timing</A>", [live(f.src)]);
	}
	dat = fmt("<TT><B>Timing Unit</B>\n＀ ＀:＀\n<A href='?src=＃;tp=-30'>-</A> <A href='?src=＃;tp=-1'>-</A> <A href='?src=＃;tp=1'>+</A> <A href='?src=＃;tp=30'>+</A>\n</TT>", [$0, live(minute), live(second), live(f.src), live(f.src), live(f.src), live(f.src)]);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "loop"))) {
		$1 = "0'>Stop repeating";
	} else {
		$1 = "1'>Set to repeat";
	}
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;repeat=＀</A>", [$0, $1]), add);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;refresh=1'>Refresh</A>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<BR><BR><A href='?src=＃;close=1'>Close</A>", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "timer", rt.sv(f, "name")]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/device/assembly/timer/proc/Topic  (code/modules/assembly/timer.dm:87)  may sleep
rt.def("/obj/item/device/assembly/timer/proc/Topic", function* Topic(f: Frame) {
	let timer_message: Value = null, tp: Value = null;
	f.vars = () => [timer_message, tp];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [rt.sv(f, "loc"), live(f.usr)])), 1))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=timer"], false);
		yield* g.call(f, P("/proc/onclose"), null, [live(f.usr), "timer"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "time"))) {
		rt.setSv(f, "timing", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "time")])));
		if ((truthy(rt.sv(f, "timing")) && truthy((rt.istype(rt.sv(f, "holder"), T("/obj/item/device/transfer_valve")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/message_admins"), null, [(timer_message = fmt("＀ activated ＀ attachment on ＀.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.usr)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.usr)])]), live(f.src), rt.sv(f, "holder")]))]);
			rt.modGl("bombers", live(timer_message), add);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ activated ＀ attachment on ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr)])), live(f.src), rt.sv(f, "holder")])]);
		}
		yield* g.srcCall(f, "update_icon");
	}
	if (truthy(rt.at(live(f.args[1]), "repeat"))) {
		rt.setSv(f, "loop", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "repeat")])));
	}
	if (truthy(rt.at(live(f.args[1]), "tp"))) {
		rt.setSv(f, "time", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [(rt.modSrcVar(f, "time", (tp = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "tp")]))), add))])), 1])), 600])));
		rt.setSv(f, "saved_time", rt.sv(f, "time"));
	}
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=timer"], false);
		return live(f.dot);
	}
	if (!truthy(live(f.usr))) return f.dot;
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });
