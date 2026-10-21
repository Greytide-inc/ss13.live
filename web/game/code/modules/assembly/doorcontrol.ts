// From code/modules/assembly/doorcontrol.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9363, "/obj/item/device/assembly/control", "/obj/item/device/assembly", {
	id: null,
	can_change_id: 0,
	cooldown: 0,
	attachable: 1,
	name: "blast door controller",
	desc: "A small electronic device able to control a blast door remotely.",
	icon_state: "control",
	origin_tech: "magnets=1;programming=2",
});

// /obj/item/device/assembly/control/proc/examine  (code/modules/assembly/doorcontrol.dm:12)
rt.def("/obj/item/device/assembly/control/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "id"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Its channel ID is '＀'.</span>", [rt.sv(f, "id")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/assembly/control/proc/activate  (code/modules/assembly/doorcontrol.dm:20)  may sleep
rt.def("/obj/item/device/assembly/control/proc/activate", function* activate(f: Frame) {
	let openclose: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [openclose, M, $e];
	rt.setSv(f, "cooldown", 1);
	openclose = null;
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/poddoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			if (live(openclose) === null) {
				openclose = rt.fv(f, "density", live(M));
			}
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/proc/activate: spawn at modules/assembly/doorcontrol.dm:24", openclose, M);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/proc/activate: spawn at modules/assembly/doorcontrol.dm:24", function* (f: Frame, openclose: Value, M: Value) {
	f.vars = () => [openclose, M];
	if (truthy(live(M))) {
		if (truthy(live(openclose))) {
			yield* g.callName(f, live(M), "open", []);
		} else {
			yield* g.callName(f, live(M), "close", []);
		}
	}
	return live(f.dot);
	return null;
});

rt.type(9364, "/obj/item/device/assembly/control/airlock", "/obj/item/device/assembly/control", {
	specialfunctions: 1,
	id: "badmin",
	name: "airlock controller",
	desc: "A small electronic device able to control an airlock remotely.",
});

// /obj/item/device/assembly/control/airlock/proc/activate  (code/modules/assembly/doorcontrol.dm:51)  may sleep
rt.def("/obj/item/device/assembly/control/airlock/proc/activate", function* activate(f: Frame) {
	let doors_need_closing: Value = null, open_or_close: Value = null, D: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [doors_need_closing, open_or_close, D, $0, $1, $e];
	rt.setSv(f, "cooldown", 1);
	doors_need_closing = 0;
	open_or_close = rt.list();
	D = null;
	rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (isEqual(rt.fv(f, "id_tag", live(D)), rt.fv(f, "id", live(f.src)))) {
			if (truthy(rt.bitAnd(rt.sv(f, "specialfunctions"), 1))) {
				open_or_close = rt.modify(live(open_or_close), live(D), add);
				if (!truthy(rt.fv(f, "density", live(D)))) {
					doors_need_closing = 1;
				}
			}
			if (truthy(rt.bitAnd(rt.sv(f, "specialfunctions"), 2))) {
				rt.setFv(f, "aiDisabledIdScanner", live(D), (!truthy(rt.fv(f, "aiDisabledIdScanner", live(D))) ? 1 : 0));
			}
			if (truthy(rt.bitAnd(rt.sv(f, "specialfunctions"), 4))) {
				if ((!truthy((yield* g.callName(f, rt.fv(f, "wires", live(D)), "is_cut", ["Bolts"]))) && truthy((yield* g.callName(f, live(D), "hasPower", []))))) {
					rt.setFv(f, "locked", live(D), (!truthy(rt.fv(f, "locked", live(D))) ? 1 : 0));
					yield* g.callName(f, live(D), "update_icon", []);
				}
			}
			if (truthy(rt.bitAnd(rt.sv(f, "specialfunctions"), 8))) {
				if (truthy(rt.fv(f, "secondsElectrified", live(D)))) {
					rt.setFv(f, "secondsElectrified", live(D), -1);
					rt.modField(f, live(D), "shockedby", fmt("[＀]＀(ckey:＀)", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(f.usr), rt.fv(f, "ckey", live(f.usr))]), add);
					yield* g.call(f, P("/proc/add_logs"), null, [live(f.usr), live(D), "electrified"]);
				} else {
					rt.setFv(f, "secondsElectrified", live(D), 0);
				}
			}
			if (truthy(rt.bitAnd(rt.sv(f, "specialfunctions"), 16))) {
				rt.setFv(f, "safe", live(D), (!truthy(rt.fv(f, "safe", live(D))) ? 1 : 0));
			}
		}
	}
	rt.endFor(f, 0);
	D = null;
	rt.forList(f, 0, live(open_or_close));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		$0 = live(D);
		if (truthy(live(doors_need_closing))) {
			$1 = P("/obj/machinery/door/airlock/proc/close");
		} else {
			$1 = P("/obj/machinery/door/airlock/proc/open");
		}
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [$0, $1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);

rt.type(9365, "/obj/item/device/assembly/control/massdriver", "/obj/item/device/assembly/control", {
	name: "mass driver controller",
	desc: "A small electronic device able to control a mass driver.",
});

// /obj/item/device/assembly/control/massdriver/proc/activate  (code/modules/assembly/doorcontrol.dm:87)  may sleep
rt.def("/obj/item/device/assembly/control/massdriver/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	rt.setSv(f, "cooldown", 1);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/poddoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:89", M);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/mass_driver"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			yield* g.callName(f, live(M), "drive", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [60]);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/poddoor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:102", M);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/massdriver/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:102", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "close", []);
	return null;
});

// a spawn(0) body of /obj/item/device/assembly/control/massdriver/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/massdriver/proc/activate: spawn at modules/assembly/doorcontrol.dm:89", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "open", []);
	return null;
});

rt.type(9366, "/obj/item/device/assembly/control/igniter", "/obj/item/device/assembly/control", {
	name: "ignition controller",
	desc: "A remote controller for a mounted igniter.",
});

// /obj/item/device/assembly/control/igniter/proc/activate  (code/modules/assembly/doorcontrol.dm:115)  may sleep
rt.def("/obj/item/device/assembly/control/igniter/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	rt.setSv(f, "cooldown", 1);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/sparker"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/igniter/proc/activate: spawn at modules/assembly/doorcontrol.dm:117", M);
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/igniter"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			yield* g.callName(f, live(M), "use_power", [50]);
			rt.setFv(f, "on", live(M), (!truthy(rt.fv(f, "on", live(M))) ? 1 : 0));
			rt.setFv(f, "icon_state", live(M), fmt("igniter＀", [rt.fv(f, "on", live(M))]));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/igniter/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/igniter/proc/activate: spawn at modules/assembly/doorcontrol.dm:117", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "ignite", []);
	return null;
});

rt.type(9367, "/obj/item/device/assembly/control/flasher", "/obj/item/device/assembly/control", {
	name: "flasher controller",
	desc: "A remote controller for a mounted flasher.",
});

// /obj/item/device/assembly/control/flasher/proc/activate  (code/modules/assembly/doorcontrol.dm:136)  may sleep
rt.def("/obj/item/device/assembly/control/flasher/proc/activate", function* activate(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	rt.setSv(f, "cooldown", 1);
	M = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/flasher"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "id", live(f.src)))) {
			rt.spawnTail(f, 0, "/obj/item/device/assembly/control/flasher/proc/activate: spawn at modules/assembly/doorcontrol.dm:138", M);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/control/flasher/proc/activate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/control/flasher/proc/activate: spawn at modules/assembly/doorcontrol.dm:138", function* (f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "flash", []);
	return null;
});

rt.type(9368, "/obj/item/device/assembly/control/crematorium", "/obj/item/device/assembly/control", {
	name: "crematorium controller",
	desc: "An evil-looking remote controller for a crematorium.",
});

// /obj/item/device/assembly/control/crematorium/proc/activate  (code/modules/assembly/doorcontrol.dm:151)  may sleep
rt.def("/obj/item/device/assembly/control/crematorium/proc/activate", function* activate(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.setSv(f, "cooldown", 1);
	C = null;
	rt.forList(f, 0, rt.gl("crematoriums"), T("/obj/structure/bodycontainer/crematorium"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "id", live(C)), rt.sv(f, "id"))) {
			yield* g.callName(f, live(C), "cremate", [live(f.usr)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	rt.setSv(f, "cooldown", 0);
	return f.dot;
}, true);
