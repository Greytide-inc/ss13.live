// From code/game/machinery/embedded_controller/access_controller.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10860, "/obj/machinery/doorButtons", "/obj/machinery", {
	idSelf: null,
	power_channel: 3,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 4,
	resistance_flags: 115,
});

// /obj/machinery/doorButtons/proc/attackby  (code/game/machinery/embedded_controller/access_controller.dm:17)  may sleep
rt.def("/obj/machinery/doorButtons/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/machinery/doorButtons/proc/Initialize  (code/game/machinery/embedded_controller/access_controller.dm:23)  may sleep
rt.def("/obj/machinery/doorButtons/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /obj/machinery/doorButtons/proc/LateInitialize  (code/game/machinery/embedded_controller/access_controller.dm:27)
rt.def("/obj/machinery/doorButtons/proc/LateInitialize", function LateInitialize(f: Frame) {
	rt.callSrc(f, "findObjsByTag", []);
	return f.dot;
});

// /obj/machinery/doorButtons/proc/emag_act  (code/game/machinery/embedded_controller/access_controller.dm:30)
rt.def("/obj/machinery/doorButtons/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.setSv(f, "req_access", rt.list());
	rt.setSv(f, "req_one_access", rt.list());
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 100, 1]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You short out the access controller.</span>"]);
	return f.dot;
});

rt.type(10861, "/obj/machinery/doorButtons/access_button", "/obj/machinery/doorButtons", {
	idDoor: null,
	door: null,
	controller: null,
	busy: null,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "access_button_standby",
	name: "access button",
});

// /obj/machinery/doorButtons/access_button/proc/findObjsByTag  (code/game/machinery/embedded_controller/access_controller.dm:50)
rt.def("/obj/machinery/doorButtons/access_button/proc/findObjsByTag", function findObjsByTag(f: Frame) {
	let A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [A, I, $e];
	A = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/doorButtons/airlock_controller"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "idSelf", live(A)), rt.sv(f, "idSelf"))) {
			rt.setSv(f, "controller", live(A));
			break;
		}
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (isEqual(rt.fv(f, "id_tag", live(I)), rt.sv(f, "idDoor"))) {
			rt.setSv(f, "door", live(I));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/doorButtons/access_button/proc/attack_hand  (code/game/machinery/embedded_controller/access_controller.dm:60)  may sleep
rt.def("/obj/machinery/doorButtons/access_button/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>Access denied.</span>"]);
		return live(f.dot);
	}
	if (!((truthy(rt.sv(f, "controller")) && !truthy(rt.fv(f, "busy", rt.sv(f, "controller")))) && truthy(rt.sv(f, "door")))) return f.dot;
	if (truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "controller")), 2))) {
		return live(f.dot);
	}
	rt.setSv(f, "busy", 1);
	yield* g.srcCall(f, "update_icon");
	if (truthy(rt.fv(f, "density", rt.sv(f, "door")))) {
		if ((!truthy(rt.fv(f, "exteriorAirlock", rt.sv(f, "controller"))) || !truthy(rt.fv(f, "interiorAirlock", rt.sv(f, "controller"))))) {
			yield* g.callName(f, rt.sv(f, "controller"), "onlyOpen", [rt.sv(f, "door")]);
		} else {
			if ((truthy(rt.gv(f, "density", rt.fv(f, "exteriorAirlock", rt.sv(f, "controller")))) && truthy(rt.gv(f, "density", rt.fv(f, "interiorAirlock", rt.sv(f, "controller")))))) {
				yield* g.callName(f, rt.sv(f, "controller"), "onlyOpen", [rt.sv(f, "door")]);
			} else {
				yield* g.callName(f, rt.sv(f, "controller"), "cycleClose", [rt.sv(f, "door")]);
			}
		}
	} else {
		yield* g.callName(f, rt.sv(f, "controller"), "onlyClose", [rt.sv(f, "door")]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	rt.setSv(f, "busy", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/doorButtons/access_button/proc/update_icon  (code/game/machinery/embedded_controller/access_controller.dm:87)
rt.def("/obj/machinery/doorButtons/access_button/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "access_button_off");
	} else {
		if (truthy(rt.sv(f, "busy"))) {
			rt.setSv(f, "icon_state", "access_button_cycle");
		} else {
			rt.setSv(f, "icon_state", "access_button_standby");
		}
	}
	return f.dot;
});

// /obj/machinery/doorButtons/access_button/proc/power_change  (code/game/machinery/embedded_controller/access_controller.dm:96)
rt.def("/obj/machinery/doorButtons/access_button/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/doorButtons/access_button/proc/removeMe  (code/game/machinery/embedded_controller/access_controller.dm:100)
rt.def("/obj/machinery/doorButtons/access_button/proc/removeMe", function removeMe(f: Frame, O: Value) {
	if (!isEqual(live(O), rt.sv(f, "door"))) return f.dot;
	rt.setSv(f, "door", null);
	return f.dot;
});

rt.type(10862, "/obj/machinery/doorButtons/airlock_controller", "/obj/machinery/doorButtons", {
	interiorAirlock: null,
	exteriorAirlock: null,
	idInterior: null,
	idExterior: null,
	busy: null,
	lostPower: null,
	icon: rt.rsc("icons/obj/airlock_machines.dmi"),
	icon_state: "access_control_standby",
	name: "access console",
});

// /obj/machinery/doorButtons/airlock_controller/proc/removeMe  (code/game/machinery/embedded_controller/access_controller.dm:117)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/removeMe", function removeMe(f: Frame, O: Value) {
	if (isEqual(live(O), rt.sv(f, "interiorAirlock"))) {
		rt.setSv(f, "interiorAirlock", null);
	} else {
		if (!isEqual(live(O), rt.sv(f, "exteriorAirlock"))) return f.dot;
		rt.setSv(f, "exteriorAirlock", null);
	}
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/Destroy  (code/game/machinery/embedded_controller/access_controller.dm:123)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/doorButtons/access_button"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "controller", live(A)), live(f.src))) {
			rt.setFv(f, "controller", live(A), null);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/doorButtons/airlock_controller/proc/Topic  (code/game/machinery/embedded_controller/access_controller.dm:129)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "busy"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Access denied.</span>"]);
		return live(f.dot);
	}
	$0 = rt.at(live(f.args[1]), "command");
	if ($0 === "close_exterior") {
		yield* g.srcCall(f, "onlyClose", rt.sv(f, "exteriorAirlock"));
	} else if ($0 === "close_interior") {
		yield* g.srcCall(f, "onlyClose", rt.sv(f, "interiorAirlock"));
	} else if ($0 === "cycle_exterior") {
		yield* g.srcCall(f, "cycleClose", rt.sv(f, "exteriorAirlock"));
	} else if ($0 === "cycle_interior") {
		yield* g.srcCall(f, "cycleClose", rt.sv(f, "interiorAirlock"));
	} else if ($0 === "open_exterior") {
		yield* g.srcCall(f, "onlyOpen", rt.sv(f, "exteriorAirlock"));
	} else if ($0 === "open_interior") {
		yield* g.srcCall(f, "onlyOpen", rt.sv(f, "interiorAirlock"));
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/doorButtons/airlock_controller/proc/onlyOpen  (code/game/machinery/embedded_controller/access_controller.dm:153)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/onlyOpen", function* onlyOpen(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(live(A))) return f.dot;
	rt.setSv(f, "busy", 1);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "openDoor", live(A));
	return f.dot;
}, true);

// /obj/machinery/doorButtons/airlock_controller/proc/onlyClose  (code/game/machinery/embedded_controller/access_controller.dm:159)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/onlyClose", function onlyClose(f: Frame, A: Value) {
	if (!truthy(live(A))) return f.dot;
	rt.setSv(f, "busy", 1);
	rt.callSrc(f, "closeDoor", [live(A)]);
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/closeDoor  (code/game/machinery/embedded_controller/access_controller.dm:163)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/closeDoor", function* closeDoor(f: Frame, A: Value) {
	f.vars = () => [A];
	if (truthy(rt.fv(f, "density", live(A)))) {
		yield* g.srcCall(f, "goIdle");
		return 0;
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, live(A), "unbolt", []);
	f.dot = 1;
	if ((truthy(live(A)) && truthy((yield* g.callName(f, live(A), "close", []))))) {
		if ((((truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) || truthy(rt.sv(f, "lostPower"))) || !truthy(live(A))) || (!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A)))))) {
			yield* g.srcCall(f, "goIdle", 1);
			return live(f.dot);
		}
		yield* g.callName(f, live(A), "bolt", []);
		if (isEqual(rt.sv(f, "busy"), 1)) {
			yield* g.srcCall(f, "goIdle", 1);
		}
	} else {
		yield* g.srcCall(f, "goIdle", 1);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/doorButtons/airlock_controller/proc/cycleClose  (code/game/machinery/embedded_controller/access_controller.dm:180)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/cycleClose", function cycleClose(f: Frame, A: Value) {
	if (((!truthy(live(A)) || !truthy(rt.sv(f, "exteriorAirlock"))) || !truthy(rt.sv(f, "interiorAirlock")))) {
		return live(f.dot);
	}
	if ((isEqual(rt.fv(f, "density", rt.sv(f, "exteriorAirlock")), rt.fv(f, "density", rt.sv(f, "interiorAirlock"))) || !truthy(rt.fv(f, "density", live(A))))) {
		return live(f.dot);
	}
	rt.setSv(f, "busy", 3);
	rt.callSrc(f, "update_icon", []);
	if (isEqual(live(A), rt.sv(f, "interiorAirlock"))) {
		if (truthy(rt.callSrc(f, "closeDoor", [rt.sv(f, "exteriorAirlock")]))) {
			rt.setSv(f, "busy", 5);
		}
	} else {
		if (!truthy(rt.callSrc(f, "closeDoor", [rt.sv(f, "interiorAirlock")]))) return f.dot;
		rt.setSv(f, "busy", 4);
	}
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/cycleOpen  (code/game/machinery/embedded_controller/access_controller.dm:194)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/cycleOpen", function* cycleOpen(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(live(A))) {
		yield* g.srcCall(f, "goIdle", 1);
	}
	if (isEqual(live(A), rt.sv(f, "exteriorAirlock"))) {
		if (truthy(rt.sv(f, "interiorAirlock"))) {
			if ((!truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock"))) || !truthy(rt.fv(f, "locked", rt.sv(f, "interiorAirlock"))))) {
				return live(f.dot);
			}
		}
	} else {
		if (truthy(rt.sv(f, "exteriorAirlock"))) {
			if ((!truthy(rt.fv(f, "density", rt.sv(f, "exteriorAirlock"))) || !truthy(rt.fv(f, "locked", rt.sv(f, "exteriorAirlock"))))) {
				return live(f.dot);
			}
		}
	}
	if (isEqual(rt.sv(f, "busy"), 2)) return f.dot;
	rt.setSv(f, "busy", 2);
	yield* g.srcCall(f, "openDoor", live(A));
	return f.dot;
}, true);

// /obj/machinery/doorButtons/airlock_controller/proc/openDoor  (code/game/machinery/embedded_controller/access_controller.dm:209)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/openDoor", function* openDoor(f: Frame, A: Value) {
	f.vars = () => [A];
	if (((truthy(rt.sv(f, "exteriorAirlock")) && truthy(rt.sv(f, "interiorAirlock"))) && (!truthy(rt.fv(f, "density", rt.sv(f, "exteriorAirlock"))) || !truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock")))))) {
		yield* g.srcCall(f, "goIdle", 1);
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "unbolt", []);
	rt.spawnTail(f, 0, "/obj/machinery/doorButtons/airlock_controller/proc/openDoor: spawn at game/machinery/embedded_controller/access_controller.dm:213", A);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/doorButtons/airlock_controller/proc/openDoor, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/doorButtons/airlock_controller/proc/openDoor: spawn at game/machinery/embedded_controller/access_controller.dm:213", function* (f: Frame, A: Value) {
	f.vars = () => [A];
	if ((truthy(live(A)) && truthy((yield* g.callName(f, live(A), "open", []))))) {
		if ((((truthy(rt.bitOr(rt.sv(f, "stat"), 2)) && !truthy(rt.sv(f, "lostPower"))) && truthy(live(A))) && !(!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A)))))) {
			yield* g.callName(f, live(A), "bolt", []);
		}
	}
	yield* g.srcCall(f, "goIdle", 1);
	return null;
});

// /obj/machinery/doorButtons/airlock_controller/proc/goIdle  (code/game/machinery/embedded_controller/access_controller.dm:223)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/goIdle", function* goIdle(f: Frame, update: Value) {
	f.vars = () => [update];
	rt.setSv(f, "lostPower", 0);
	rt.setSv(f, "busy", 0);
	if (truthy(live(update))) {
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true);

// /obj/machinery/doorButtons/airlock_controller/proc/process  (code/game/machinery/embedded_controller/access_controller.dm:227)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/process", function* process(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "busy"), 4)) {
		yield* g.srcCall(f, "cycleOpen", rt.sv(f, "exteriorAirlock"));
	} else {
		if (!isEqual(rt.sv(f, "busy"), 5)) return f.dot;
		yield* g.srcCall(f, "cycleOpen", rt.sv(f, "interiorAirlock"));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/doorButtons/airlock_controller/proc/power_change  (code/game/machinery/embedded_controller/access_controller.dm:235)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "lostPower", 1);
	} else {
		if (!truthy(rt.sv(f, "busy"))) {
			rt.setSv(f, "lostPower", 0);
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/findObjsByTag  (code/game/machinery/embedded_controller/access_controller.dm:244)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/findObjsByTag", function findObjsByTag(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/airlock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.fv(f, "id_tag", live(A)), rt.sv(f, "idInterior"))) {
			rt.setSv(f, "interiorAirlock", live(A));
		} else {
			if (isEqual(rt.fv(f, "id_tag", live(A)), rt.sv(f, "idExterior"))) {
				rt.setSv(f, "exteriorAirlock", live(A));
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/update_icon  (code/game/machinery/embedded_controller/access_controller.dm:251)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "access_control_off");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "busy")) || truthy(rt.sv(f, "lostPower")))) {
		rt.setSv(f, "icon_state", "access_control_process");
	} else {
		rt.setSv(f, "icon_state", "access_control_standby");
	}
	return f.dot;
});

// /obj/machinery/doorButtons/airlock_controller/proc/attack_hand  (code/game/machinery/embedded_controller/access_controller.dm:260)  may sleep
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/attack_hand", function* attack_hand(f: Frame) {
	let popup: Value = null;
	f.vars = () => [popup];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", rt.sv(f, "name")]))), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "set_content", [(yield* g.srcCall(f, "returnText"))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/doorButtons/airlock_controller/proc/returnText  (code/game/machinery/embedded_controller/access_controller.dm:269)
rt.def("/obj/machinery/doorButtons/airlock_controller/proc/returnText", function returnText(f: Frame) {
	let output: Value = null;
	let $0: any;
	f.vars = () => [output, $0];
	output = null;
	if ((!truthy(rt.sv(f, "exteriorAirlock")) && !truthy(rt.sv(f, "interiorAirlock")))) {
		return "ERROR ERROR ERROR ERROR";
	}
	if (truthy(rt.sv(f, "lostPower"))) {
		output = "Initializing...";
	} else {
		if ((!truthy(rt.sv(f, "exteriorAirlock")) || !truthy(rt.sv(f, "interiorAirlock")))) {
			if (!truthy(rt.sv(f, "exteriorAirlock"))) {
				if (truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock")))) {
					output = fmt("<A href='?src=＃;command=open_interior'>Open Interior Airlock</A><BR>", [live(f.src)]);
				} else {
					output = fmt("<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [live(f.src)]);
				}
			} else {
				if (truthy(rt.fv(f, "density", rt.sv(f, "exteriorAirlock")))) {
					output = fmt("<A href='?src=＃;command=open_exterior'>Open Exterior Airlock</A><BR>", [live(f.src)]);
				} else {
					output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>", [live(f.src)]);
				}
			}
		} else {
			if (truthy(rt.fv(f, "density", rt.sv(f, "exteriorAirlock")))) {
				if (truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock")))) {
					output = fmt("<A href='?src=＃;command=open_exterior'>Open Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=open_interior'>Open Interior Airlock</A><BR>", [live(f.src), live(f.src)]);
				} else {
					output = fmt("<A href='?src=＃;command=cycle_exterior'>Cycle to Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [live(f.src), live(f.src)]);
				}
			} else {
				if (truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock")))) {
					output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=cycle_interior'>Cycle to Interior Airlock</A><BR>", [live(f.src), live(f.src)]);
				} else {
					output = fmt("<A href='?src=＃;command=close_exterior'>Close Exterior Airlock</A><BR>\n\t\t\t\t\t<A href='?src=＃;command=close_interior'>Close Interior Airlock</A><BR>", [live(f.src), live(f.src)]);
				}
			}
		}
	}
	output = fmt("<B>Access Control Console</B><HR>\n\t\t\t\t＀<HR>", [live(output)]);
	if (truthy(rt.sv(f, "exteriorAirlock"))) {
		if (truthy(rt.fv(f, "density", rt.sv(f, "exteriorAirlock")))) {
			$0 = "closed";
		} else {
			$0 = "open";
		}
		output = rt.modify(live(output), fmt("<B>Exterior Door: </B> ＀<BR>", [$0]), add);
	}
	if (truthy(rt.sv(f, "interiorAirlock"))) {
		if (truthy(rt.fv(f, "density", rt.sv(f, "interiorAirlock")))) {
			$0 = "closed";
		} else {
			$0 = "open";
		}
		output = rt.modify(live(output), fmt("<B>Interior Door: </B> ＀<BR>", [$0]), add);
	}
	return live(output);
});
