// From code/modules/assembly/assembly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9360, "/obj/item/device/assembly", "/obj/item/device", {
	secured: 1,
	attached_overlays: null,
	holder: null,
	attachable: 0,
	connected: null,
	WIRE_RECEIVE: 1,
	WIRE_PULSE: 2,
	WIRE_PULSE_SPECIAL: 4,
	WIRE_RADIO_RECEIVE: 8,
	WIRE_RADIO_PULSE: 16,
	next_activate: 0,
	wire_type: 3,
	flags: 64,
	throw_speed: 3,
	throw_range: 7,
	name: "assembly",
	desc: "A small electronic device that should never exist.",
	icon: rt.rsc("icons/obj/assemblies/new_assemblies.dmi"),
	icon_state: "",
	w_class: 2,
	materials: null,
	throwforce: 2,
	origin_tech: "magnets=1;engineering=1",
}, { const: ["WIRE_RECEIVE","WIRE_PULSE","WIRE_PULSE_SPECIAL","WIRE_RADIO_RECEIVE","WIRE_RADIO_PULSE"] });

// /obj/item/device/assembly/proc/<init>  (code/modules/assembly/assembly.dm:8)
rt.def("/obj/item/device/assembly/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 100]));
	return f.dot;
});

// /obj/item/device/assembly/proc/describe  (code/modules/assembly/assembly.dm:37)
rt.def("/obj/item/device/assembly/proc/describe", function describe(f: Frame) {
	return "The trigger assembly looks broken!";
});

// /obj/item/device/assembly/proc/is_secured  (code/modules/assembly/assembly.dm:41)
rt.def("/obj/item/device/assembly/proc/is_secured", function is_secured(f: Frame, user: Value) {
	if (!truthy(rt.sv(f, "secured"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is unsecured!</span>", [rt.sv(f, "name")])]);
		return 0;
	}
	return 1;
});

// /obj/item/device/assembly/proc/pulsed  (code/modules/assembly/assembly.dm:49)
rt.def("/obj/item/device/assembly/proc/pulsed", function pulsed(f: Frame, radio: Value) {
	f.vars = () => [radio];
	if (live(radio) === null) {
		radio = 0;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "wire_type"), 1))) {
		rt.spawnTail(f, 0, "/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:50", radio);
	}
	if ((truthy(live(radio)) && truthy(rt.bitAnd(rt.sv(f, "wire_type"), 8)))) {
		rt.spawnTail(f, 0, "/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:53", radio);
	}
	return 1;
});

// a spawn(0) body of /obj/item/device/assembly/proc/pulsed, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:53", function* (f: Frame, radio: Value) {
	f.vars = () => [radio];
	yield* g.srcCall(f, "activate");
	return null;
});

// a spawn(0) body of /obj/item/device/assembly/proc/pulsed, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/proc/pulsed: spawn at modules/assembly/assembly.dm:50", function* (f: Frame, radio: Value) {
	f.vars = () => [radio];
	yield* g.srcCall(f, "activate");
	return null;
});

// /obj/item/device/assembly/proc/pulse  (code/modules/assembly/assembly.dm:60)  may sleep
rt.def("/obj/item/device/assembly/proc/pulse", function* pulse(f: Frame, radio: Value) {
	f.vars = () => [radio];
	if (live(radio) === null) {
		radio = 0;
	}
	if ((truthy(rt.sv(f, "connected")) && truthy(rt.sv(f, "wire_type")))) {
		yield* g.callName(f, rt.sv(f, "connected"), "pulse_assembly", [live(f.src)]);
		return 1;
	}
	if ((truthy(rt.sv(f, "holder")) && truthy(rt.bitAnd(rt.sv(f, "wire_type"), 2)))) {
		yield* g.callName(f, rt.sv(f, "holder"), "process_activation", [live(f.src), 1, 0]);
	}
	if ((truthy(rt.sv(f, "holder")) && truthy(rt.bitAnd(rt.sv(f, "wire_type"), 4)))) {
		yield* g.callName(f, rt.sv(f, "holder"), "process_activation", [live(f.src), 0, 1]);
	}
	return 1;
}, true);

// /obj/item/device/assembly/proc/activate  (code/modules/assembly/assembly.dm:72)
rt.def("/obj/item/device/assembly/proc/activate", function activate(f: Frame) {
	if ((((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) || !truthy(rt.sv(f, "secured"))) || rt.gt(rt.sv(f, "next_activate"), rt.worldTime(f)))) {
		return 0;
	}
	rt.setSv(f, "next_activate", add(rt.worldTime(f), 30));
	return 1;
});

// /obj/item/device/assembly/proc/toggle_secure  (code/modules/assembly/assembly.dm:79)  may sleep
rt.def("/obj/item/device/assembly/proc/toggle_secure", function* toggle_secure(f: Frame) {
	rt.setSv(f, "secured", (!truthy(rt.sv(f, "secured")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	return rt.sv(f, "secured");
}, true);

// /obj/item/device/assembly/proc/attackby  (code/modules/assembly/assembly.dm:85)  may sleep
rt.def("/obj/item/device/assembly/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "secured", (A = live(f.args[0])))) && !truthy(rt.sv(f, "secured")))) {
			rt.setSv(f, "holder", (yield* g.new_(f, T("/obj/item/device/assembly_holder"), [rt.getStep(f, live(f.src), 0)])));
			yield* g.callName(f, rt.sv(f, "holder"), "assemble", [live(f.src), live(A), live(f.args[1])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach and secure ％！ to ％！!</span>", [live(A), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Both devices must be in attachable mode to be attached together.</span>"]);
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "toggle_secure")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ is ready!</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ can now be attached!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/assembly/proc/examine  (code/modules/assembly/assembly.dm:104)
rt.def("/obj/item/device/assembly/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "secured"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＄！ is secured and ready to be used.", [live(f.src)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＄！ can be attached to other things.", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/assembly/proc/attack_self  (code/modules/assembly/assembly.dm:112)  may sleep
rt.def("/obj/item/device/assembly/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(live(user))) {
		return 0;
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return 1;
}, true);
