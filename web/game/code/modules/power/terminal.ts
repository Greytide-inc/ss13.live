// From code/modules/power/terminal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10323, "/obj/machinery/power/terminal", "/obj/machinery/power", {
	master: null,
	level: 1,
	anchored: 1,
	name: "terminal",
	icon_state: "term",
	desc: "It's an underfloor wiring terminal for power equipment.",
	layer: 2.45,
});

// /obj/machinery/power/terminal/proc/New  (code/modules/power/terminal.dm:17)  may sleep
rt.def("/obj/machinery/power/terminal/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.fv(f, "loc", live(f.src));
	if (isEqual(rt.sv(f, "level"), 1)) {
		yield* g.srcCall(f, "hide", rt.fv(f, "intact", live(_T)));
	}
	return live(f.dot);
}, true);

// /obj/machinery/power/terminal/proc/Destroy  (code/modules/power/terminal.dm:24)  may sleep
rt.def("/obj/machinery/power/terminal/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "disconnect_terminal", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/terminal/proc/hide  (code/modules/power/terminal.dm:30)
rt.def("/obj/machinery/power/terminal/proc/hide", function hide(f: Frame, i: Value) {
	if (truthy(live(i))) {
		rt.setSv(f, "invisibility", 100);
		rt.setSv(f, "icon_state", "term-f");
	} else {
		rt.setSv(f, "invisibility", 0);
		rt.setSv(f, "icon_state", "term");
	}
	return f.dot;
});

// /obj/machinery/power/terminal/proc/dismantle  (code/modules/power/terminal.dm:51)  may sleep
rt.def("/obj/machinery/power/terminal/proc/dismantle", function* dismantle(f: Frame, user: Value, W: Value) {
	let _T: Value = null;
	f.vars = () => [user, W, _T];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	if (truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You must first expose the power terminal!</span>"]);
		return live(f.dot);
	}
	if (!(!truthy(rt.sv(f, "master")) || truthy((yield* g.callName(f, rt.sv(f, "master"), "can_terminal_dismantle", []))))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ dismantles the power terminal from ＀.", [rt.fv(f, "name", live(user)), rt.sv(f, "master")]), "<span class='notice'>You begin to cut the cables...</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(50, rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	if (!(!truthy(rt.sv(f, "master")) || truthy((yield* g.callName(f, rt.sv(f, "master"), "can_terminal_dismantle", []))))) return f.dot;
	if ((truthy(rt.op(f, "Prob", [], [50])) && truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), rt.sv(f, "powernet"), live(f.src), 1, 1]))))) {
		yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, rt.sv(f, "master")]);
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 10]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You cut the cables and dismantle the power terminal.</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/power/terminal/proc/attackby  (code/modules/power/terminal.dm:73)  may sleep
rt.def("/obj/machinery/power/terminal/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		yield* g.srcCall(f, "dismantle", live(f.args[1]), live(f.args[0]));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
