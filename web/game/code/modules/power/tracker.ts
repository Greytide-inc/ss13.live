// From code/modules/power/tracker.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10324, "/obj/machinery/power/tracker", "/obj/machinery/power", {
	id: 0,
	sun_angle: 0,
	control: null,
	anchored: 1,
	name: "solar tracker",
	desc: "A solar directional tracker.",
	icon: rt.rsc("icons/obj/power.dmi"),
	icon_state: "tracker",
	density: 1,
	use_power: 0,
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 50,
});

// /obj/machinery/power/tracker/proc/New  (code/modules/power/tracker.dm:23)  may sleep
rt.def("/obj/machinery/power/tracker/proc/New", function* New(f: Frame, loc: Value, S: Value) {
	f.vars = () => [loc, S];
	yield* g.callSuper(f, [live(loc)]);
	yield* g.srcCall(f, "Make", live(S));
	yield* g.srcCall(f, "connect_to_network");
	return f.dot;
}, true);

// /obj/machinery/power/tracker/proc/Destroy  (code/modules/power/tracker.dm:28)  may sleep
rt.def("/obj/machinery/power/tracker/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "unset_control");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/power/tracker/proc/set_control  (code/modules/power/tracker.dm:33)
rt.def("/obj/machinery/power/tracker/proc/set_control", function set_control(f: Frame, SC: Value) {
	if ((!truthy(live(SC)) || rt.gt(rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(SC)]), 40))) {
		return 0;
	}
	rt.setSv(f, "control", live(SC));
	rt.setFv(f, "connected_tracker", live(SC), live(f.src));
	return 1;
});

// /obj/machinery/power/tracker/proc/unset_control  (code/modules/power/tracker.dm:42)
rt.def("/obj/machinery/power/tracker/proc/unset_control", function unset_control(f: Frame) {
	if (truthy(rt.sv(f, "control"))) {
		rt.setFv(f, "connected_tracker", rt.sv(f, "control"), null);
	}
	rt.setSv(f, "control", null);
	return f.dot;
});

// /obj/machinery/power/tracker/proc/Make  (code/modules/power/tracker.dm:46)  may sleep
rt.def("/obj/machinery/power/tracker/proc/Make", function* Make(f: Frame, S: Value) {
	f.vars = () => [S];
	if (!truthy(live(S))) {
		rt.setFv(f, "glass_type", (S = (yield* g.new_(f, T("/obj/item/solar_assembly"), [live(f.src)]))), T("/obj/item/stack/sheet/glass"));
		rt.setFv(f, "tracker", live(S), 1);
		rt.setFv(f, "anchored", live(S), 1);
	}
	rt.setFv(f, "loc", live(S), live(f.src));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/power/tracker/proc/set_angle  (code/modules/power/tracker.dm:56)
rt.def("/obj/machinery/power/tracker/proc/set_angle", function set_angle(f: Frame, angle: Value) {
	rt.setSv(f, "sun_angle", live(angle));
	rt.callSrc(f, "setDir", [rt.call(f, P("/proc/turn"), null, [1, subtract(rt.neg(live(angle)), 22.5)])]);
	if (!(truthy(rt.sv(f, "powernet")) && isEqual(rt.sv(f, "powernet"), rt.fv(f, "powernet", rt.sv(f, "control"))))) return f.dot;
	rt.setFv(f, "currentdir", rt.sv(f, "control"), live(angle));
	return f.dot;
});

// /obj/machinery/power/tracker/proc/attackby  (code/modules/power/tracker.dm:66)  may sleep
rt.def("/obj/machinery/power/tracker/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 50, 1]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ begins to take the glass off the solar tracker.", [live(f.args[1])]), "<span class='notice'>You begin to take the glass off the solar tracker...</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ takes the glass off the tracker.", [live(f.args[1])]), "<span class='notice'>You take the glass off the tracker.</span>"]);
			yield* g.srcCall(f, "deconstruct", 1);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/power/tracker/proc/obj_break  (code/modules/power/tracker.dm:77)
rt.def("/obj/machinery/power/tracker/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (!(!truthy(rt.bitAnd(rt.sv(f, "stat"), 1)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/glassbr3.ogg"), 100, 1]);
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "unset_control", []);
	return f.dot;
});

// /obj/machinery/power/solar/proc/deconstruct  (code/modules/power/tracker.dm:83)  may sleep
rt.def("/obj/machinery/power/solar/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let S: Value = null;
	f.vars = () => [disassembled, S];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			if (truthy((S = rt.locateIn(f, T("/obj/item/solar_assembly"), live(f.src))))) {
				yield* g.callName(f, live(S), "forceMove", [rt.sv(f, "loc")]);
				yield* g.callName(f, live(S), "give_glass", [rt.bitAnd(rt.sv(f, "stat"), 1)]);
			}
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), "shatter", 70, 1]);
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
			yield* g.new_(f, T("/obj/item/weapon/shard"), [rt.fv(f, "loc", live(f.src))]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
