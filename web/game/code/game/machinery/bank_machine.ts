// From code/game/machinery/bank_machine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10354, "/obj/machinery/computer/bank_machine", "/obj/machinery/computer", {
	siphoning: 0,
	next_warning: 0,
	radio: null,
	radio_channel: "Common",
	minimum_time_between_warnings: 400,
	name: "bank machine",
	desc: "A machine used to deposit and withdraw station funds.",
	icon_screen: "vault",
	icon_keyboard: "security_key",
	idle_power_usage: 100,
});

// /obj/machinery/computer/bank_machine/proc/Initialize  (code/game/machinery/bank_machine.dm:13)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "subspace_transmission", rt.sv(f, "radio"), 1);
	rt.setFv(f, "canhear_range", rt.sv(f, "radio"), 0);
	yield* g.callName(f, rt.sv(f, "radio"), "recalculateChannels", []);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/machinery/computer/bank_machine/proc/Destroy  (code/game/machinery/bank_machine.dm:20)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
	rt.setSv(f, "radio", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/computer/bank_machine/proc/attackby  (code/game/machinery/bank_machine.dm:25)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/attackby", function* attackby(f: Frame) {
	let value: Value = null, C: Value = null;
	f.vars = () => [value, C];
	value = 0;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/spacecash")) ? 1 : 0))) {
		value = multiply(rt.gv(f, "value", (C = live(f.args[0]))), rt.fv(f, "amount", live(C)));
	}
	if (truthy(live(value))) {
		rt.modField(f, rt.gl("SSshuttle"), "points", live(value), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You deposit ＀. The station now has ＀ credits.</span>", [live(f.args[0]), rt.fv(f, "points", rt.gl("SSshuttle"))])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /obj/machinery/computer/bank_machine/proc/process  (code/game/machinery/bank_machine.dm:37)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/process", function* process(f: Frame) {
	let A: Value = null, message: Value = null;
	f.vars = () => [A, message];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "siphoning"))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		yield* g.srcCall(f, "say", "Insufficient power. Halting siphon.");
		rt.setSv(f, "siphoning", 0);
	}
	if (rt.lt(rt.fv(f, "points", rt.gl("SSshuttle")), 200)) {
		yield* g.srcCall(f, "say", "Station funds depleted. Halting siphon.");
		rt.setSv(f, "siphoning", 0);
	} else {
		yield* g.new_(f, T("/obj/item/stack/spacecash/c200"), [rt.getStep(f, live(f.src), 0)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_being_created.ogg"), 100, 1]);
		(rt.modField(f, rt.gl("SSshuttle"), "points", 200, subtract));
		if (!(rt.lt(rt.sv(f, "next_warning"), rt.worldTime(f)) && truthy(rt.op(f, "Prob", [], [15])))) return f.dot;
		A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "loc")]));
		message = fmt("Unauthorized credit withdrawal underway in ＀!!", [rt.fv(f, "map_name", live(A))]);
		yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), live(message), rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans"))]);
		rt.setSv(f, "next_warning", add(rt.worldTime(f), rt.sv(f, "minimum_time_between_warnings")));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/computer/bank_machine/proc/get_spans  (code/game/machinery/bank_machine.dm:56)
rt.def("/obj/machinery/computer/bank_machine/proc/get_spans", function get_spans(f: Frame) {
	f.dot = rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
	return f.dot;
});

// /obj/machinery/computer/bank_machine/proc/attack_hand  (code/game/machinery/bank_machine.dm:59)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, popup: Value = null;
	f.vars = () => [dat, popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	dat = fmt("＀ secure vault. Authorized personnel only.<br>", [rt.fv(f, "name", rt.world())]);
	dat = rt.modify(live(dat), fmt("Current Balance: ＀ credits.<br>", [rt.fv(f, "points", rt.gl("SSshuttle"))]), add);
	if (!truthy(rt.sv(f, "siphoning"))) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;siphon=1'>Siphon Credits</A><br>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;halt=1'>Halt Credit Siphon</A><br>", [live(f.src)]), add);
	}
	dat = rt.modify(live(dat), fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [live(f.args[0])]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Bank Vault", 300, 200]))), "set_content", [fmt("<center>＀</center>", [live(dat)])]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/bank_machine/proc/Topic  (code/game/machinery/bank_machine.dm:77)  may sleep
rt.def("/obj/machinery/computer/bank_machine/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "siphon"))) {
		yield* g.srcCall(f, "say", "Siphon of station credits has begun!");
		rt.setSv(f, "siphoning", 1);
	}
	if (!truthy(rt.at(live(f.args[1]), "halt"))) return f.dot;
	yield* g.srcCall(f, "say", "Station credit withdrawal halted.");
	rt.setSv(f, "siphoning", 0);
	return f.dot;
}, true, { args: ["href", "href_list"] });
