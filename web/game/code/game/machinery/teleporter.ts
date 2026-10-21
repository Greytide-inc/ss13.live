// From code/game/machinery/teleporter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10361, "/obj/machinery/computer/teleporter", "/obj/machinery/computer", {
	locked: null,
	regime_set: "Teleporter",
	id: null,
	power_station: null,
	calibrating: null,
	target: null,
	light_color: "#6496FA",
	name: "Teleporter Control Console",
	desc: "Used to control a linked teleportation Hub and Station.",
	icon_screen: "teleport",
	icon_keyboard: "teleport_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/teleporter"),
});

// /obj/machinery/computer/teleporter/proc/New  (code/game/machinery/teleporter.dm:18)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/New", function* New(f: Frame) {
	rt.setFv(f, "id", live(f.src), fmt("＀", [(yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/machinery/computer/teleporter/proc/Initialize  (code/game/machinery/teleporter.dm:22)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "link_power_station");
	return f.dot;
}, true);

// /obj/machinery/computer/teleporter/proc/Destroy  (code/game/machinery/teleporter.dm:27)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "power_station"))) {
		rt.setFv(f, "teleporter_console", rt.sv(f, "power_station"), null);
		rt.setSv(f, "power_station", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/teleporter/proc/link_power_station  (code/game/machinery/teleporter.dm:34)
rt.def("/obj/machinery/computer/teleporter/proc/link_power_station", function link_power_station(f: Frame) {
	let $e: any;
	f.vars = () => [$e];
	if (truthy(rt.sv(f, "power_station"))) {
		return live(f.dot);
	}
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		rt.setSv(f, "power_station", rt.locateIn(f, T("/obj/machinery/teleport/station"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))));
		if (truthy(rt.sv(f, "power_station"))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return rt.sv(f, "power_station");
});

// /obj/machinery/computer/teleporter/proc/attackby  (code/game/machinery/teleporter.dm:41)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/attackby", function* attackby(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/gps")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "locked_location", (L = live(f.args[0])))) && !truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(L), live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(f.args[0]), live(f.src)])]);
				return live(f.dot);
			}
			rt.setSv(f, "locked", live(L));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>You insert the GPS device into the ＀'s slot.</span>", [rt.sv(f, "name")])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/teleporter/proc/attack_ai  (code/game/machinery/teleporter.dm:53)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(f.src), "attack_hand", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/computer/teleporter/proc/attack_hand  (code/game/machinery/teleporter.dm:56)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/teleporter/proc/interact  (code/game/machinery/teleporter.dm:61)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/interact", function* interact(f: Frame, user: Value) {
	let data: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, data, popup, $0, $1];
	data = "<h3>Teleporter Status</h3>";
	if (!truthy(rt.sv(f, "power_station"))) {
		data = rt.modify(live(data), "<div class='statusDisplay'>No power station linked.</div>", add);
	} else {
		if (!truthy(rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")))) {
			data = rt.modify(live(data), "<div class='statusDisplay'>No hub linked.</div>", add);
		} else {
			data = rt.modify(live(data), fmt("<div class='statusDisplay'>Current regime: ＀<BR>", [rt.sv(f, "regime_set")]), add);
			if (!truthy(rt.sv(f, "target"))) {
				$0 = "None";
			} else {
				$0 = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "target")]));
				if (!isEqual(rt.sv(f, "regime_set"), "Gate")) {
					$1 = "";
				} else {
					$1 = "Teleporter";
				}
				$0 = fmt("＀ ＀", [$0, $1]);
			}
			data = rt.modify(live(data), fmt("Current target: ＀<BR>", [$0]), add);
			if (truthy(rt.sv(f, "calibrating"))) {
				data = rt.modify(live(data), "Calibration: <font color='yellow'>In Progress</font>", add);
			} else {
				if ((truthy(rt.gv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")))) || rt.ge(rt.gv(f, "accurate", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station"))), 3))) {
					data = rt.modify(live(data), "Calibration: <font color='green'>Optimal</font>", add);
				} else {
					data = rt.modify(live(data), "Calibration: <font color='red'>Sub-Optimal</font>", add);
				}
			}
			data = rt.modify(live(data), "</div><BR>", add);
			data = rt.modify(live(data), fmt("<A href='?src=＃;regimeset=1'>Change regime</A><BR>", [live(f.src)]), add);
			data = rt.modify(live(data), fmt("<A href='?src=＃;settarget=1'>Set target</A><BR>", [live(f.src)]), add);
			if (truthy(rt.sv(f, "locked"))) {
				data = rt.modify(live(data), fmt("<BR><A href='?src=＃;locked=1'>Get target from memory</A><BR>", [live(f.src)]), add);
				data = rt.modify(live(data), fmt("<A href='?src=＃;eject=1'>Eject GPS device</A><BR>", [live(f.src)]), add);
			} else {
				data = rt.modify(live(data), "<BR><span class='linkOff'>Get target from memory</span><BR>", add);
				data = rt.modify(live(data), "<span class='linkOff'>Eject GPS device</span><BR>", add);
			}
			data = rt.modify(live(data), fmt("<BR><A href='?src=＃;calibrate=1'>Calibrate Hub</A>", [live(f.src)]), add);
		}
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "teleporter", rt.sv(f, "name"), 400, 400]))), "set_content", [live(data)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/teleporter/proc/Topic  (code/game/machinery/teleporter.dm:94)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/Topic", function* Topic(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "eject"))) {
		yield* g.srcCall(f, "eject");
		yield* g.srcCall(f, "updateDialog");
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "check_hub_connection")))) {
		yield* g.srcCall(f, "say", "Error: Unable to detect hub.");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "calibrating"))) {
		yield* g.srcCall(f, "say", "Error: Calibration in progress. Stand by.");
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "regimeset"))) {
		rt.setFv(f, "engaged", rt.sv(f, "power_station"), 0);
		yield* g.callName(f, rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), "update_icon", []);
		rt.setFv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), 0);
		yield* g.srcCall(f, "reset_regime");
	}
	if (truthy(rt.at(live(f.args[1]), "settarget"))) {
		rt.setFv(f, "engaged", rt.sv(f, "power_station"), 0);
		yield* g.callName(f, rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), "update_icon", []);
		rt.setFv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), 0);
		yield* g.srcCall(f, "set_target", live(f.usr));
	}
	if (truthy(rt.at(live(f.args[1]), "locked"))) {
		rt.setFv(f, "engaged", rt.sv(f, "power_station"), 0);
		yield* g.callName(f, rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), "update_icon", []);
		rt.setFv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), 0);
		rt.setSv(f, "target", rt.getStep(f, rt.fv(f, "locked_location", rt.sv(f, "locked")), 0));
	}
	if (truthy(rt.at(live(f.args[1]), "calibrate"))) {
		if (!truthy(rt.sv(f, "target"))) {
			yield* g.srcCall(f, "say", "Error: No target set to calibrate to.");
			return live(f.dot);
		}
		if ((truthy(rt.gv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")))) || rt.ge(rt.gv(f, "accurate", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station"))), 3))) {
			yield* g.srcCall(f, "say", "Hub is already calibrated!");
			return live(f.dot);
		}
		yield* g.srcCall(f, "say", "Processing hub calibration to target...");
		rt.setSv(f, "calibrating", 1);
		rt.spawnTail(f, multiply(50, subtract(3, rt.gv(f, "accurate", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station"))))), "/obj/machinery/computer/teleporter/proc/Topic: spawn at game/machinery/teleporter.dm:131");
	}
	yield* g.srcCall(f, "updateDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// a spawn(multiply(50, subtract(3, rt.getI(f, rt.fieldI(f, rt.srcVarI(f, $ic[64]), $ic[65]), $ic[66])))) body of /obj/machinery/computer/teleporter/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/teleporter/proc/Topic: spawn at game/machinery/teleporter.dm:131", function* (f: Frame) {
	rt.setSv(f, "calibrating", 0);
	if (truthy((yield* g.srcCall(f, "check_hub_connection")))) {
		rt.setFv(f, "calibrated", rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")), 1);
		yield* g.srcCall(f, "say", "Calibration complete.");
	} else {
		yield* g.srcCall(f, "say", "Error: Unable to detect hub.");
	}
	yield* g.srcCall(f, "updateDialog");
	return null;
});

// /obj/machinery/computer/teleporter/proc/check_hub_connection  (code/game/machinery/teleporter.dm:146)
rt.def("/obj/machinery/computer/teleporter/proc/check_hub_connection", function check_hub_connection(f: Frame) {
	if (!truthy(rt.sv(f, "power_station"))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "teleporter_hub", rt.sv(f, "power_station")))) {
		return live(f.dot);
	}
	return 1;
});

// /obj/machinery/computer/teleporter/proc/reset_regime  (code/game/machinery/teleporter.dm:154)
rt.def("/obj/machinery/computer/teleporter/proc/reset_regime", function reset_regime(f: Frame) {
	rt.setSv(f, "target", null);
	if (isEqual(rt.sv(f, "regime_set"), "Teleporter")) {
		rt.setSv(f, "regime_set", "Gate");
	} else {
		rt.setSv(f, "regime_set", "Teleporter");
	}
	return f.dot;
});

// /obj/machinery/computer/teleporter/proc/set_target  (code/game/machinery/teleporter.dm:165)  may sleep
rt.def("/obj/machinery/computer/teleporter/proc/set_target", function* set_target(f: Frame, user: Value) {
	let L: Value = null, areaindex: Value = null, R: Value = null, _T: Value = null, I: Value = null, M: Value = null, _T_4: Value = null, desc: Value = null, S: Value = null, R_3: Value = null, desc_3: Value = null, trg: Value = null;
	let $e: any;
	f.vars = () => [user, L, areaindex, R, _T, I, M, _T_4, desc, S, R_3, desc_3, trg, $e];
	L = rt.list();
	areaindex = rt.list();
	if (isEqual(rt.sv(f, "regime_set"), "Teleporter")) {
		R = null;
		rt.forList(f, 0, rt.gl("teleportbeacons"), T("/obj/item/device/radio/beacon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (!truthy((_T = rt.getStep(f, live(R), 0)))) {
				continue;
			}
			if ((isEqual(rt.fv(f, "z", live(_T)), 1) || rt.gt(rt.fv(f, "z", live(_T)), 12))) {
				continue;
			}
			rt.setAt(live(L), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.gv(f, "name", rt.fv(f, "loc", live(_T))), live(areaindex)])), live(R));
		}
		rt.endFor(f, 0);
		I = null;
		rt.forList(f, 0, rt.gl("tracked_implants"), T("/obj/item/weapon/implant/tracking"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if ((!truthy(rt.fv(f, "imp_in", live(I))) || !truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", live(I))]))))) {
				continue;
			}
			if (isEqual(rt.gv(f, "stat", (M = rt.fv(f, "loc", live(I)))), 2)) {
				if (rt.lt(add(rt.fv(f, "timeofdeath", live(M)), 6000), rt.worldTime(f))) {
					continue;
				}
			}
			if (!truthy((_T_4 = rt.getStep(f, live(M), 0)))) {
				continue;
			}
			if (isEqual(rt.fv(f, "z", live(_T_4)), 1)) {
				continue;
			}
			rt.setAt(live(L), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "real_name", live(M)), live(areaindex)])), live(I));
		}
		rt.endFor(f, 0);
		desc = (yield* g.op(f, "Prompt", [1], [null, null, "Locking Computer", "Please select a location to lock in.", live(L)]));
		rt.setSv(f, "target", rt.index(live(L), live(desc)));
	} else {
		if (!truthy(rt.getLen(f, (S = rt.fv(f, "linked_stations", rt.sv(f, "power_station")))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>No connected stations located.</span>"]);
			return live(f.dot);
		}
		R_3 = null;
		rt.forList(f, 0, live(S), T("/obj/machinery/teleport/station"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R_3 = $e;
			if (((!truthy((_T_4 = rt.getStep(f, live(R_3), 0))) || !truthy(rt.fv(f, "teleporter_hub", live(R_3)))) || !truthy(rt.fv(f, "teleporter_console", live(R_3))))) {
				continue;
			}
			if ((isEqual(rt.fv(f, "z", live(_T_4)), 1) || rt.gt(rt.fv(f, "z", live(_T_4)), 12))) {
				continue;
			}
			rt.setAt(live(L), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.gv(f, "name", rt.fv(f, "loc", live(_T_4))), live(areaindex)])), live(R_3));
		}
		rt.endFor(f, 0);
		desc_3 = (yield* g.op(f, "Prompt", [1], [null, null, "Locking Computer", "Please select a station to lock in.", live(L)]));
		rt.setSv(f, "target", rt.index(live(L), live(desc_3)));
		if (!truthy(rt.sv(f, "target"))) return f.dot;
		(rt.modField(f, (trg = rt.sv(f, "target")), "linked_stations", rt.sv(f, "power_station"), rt.bitOr));
		(rt.modField(f, live(trg), "stat", 16777213, rt.bitAnd));
		if (truthy(rt.fv(f, "teleporter_hub", live(trg)))) {
			(rt.modField(f, rt.fv(f, "teleporter_hub", live(trg)), "stat", 16777213, rt.bitAnd));
			yield* g.callName(f, rt.fv(f, "teleporter_hub", live(trg)), "update_icon", []);
		}
		if (!truthy(rt.fv(f, "teleporter_console", live(trg)))) return f.dot;
		(rt.modField(f, rt.fv(f, "teleporter_console", live(trg)), "stat", 16777213, rt.bitAnd));
		yield* g.callName(f, rt.fv(f, "teleporter_console", live(trg)), "update_icon", []);
	}
	return f.dot;
}, true);

rt.type(10336, "/obj/machinery/teleport/hub", "/obj/machinery/teleport", {
	accurate: 0,
	power_station: null,
	calibrated: null,
	name: "teleporter hub",
	desc: "It's the hub of a teleporting machine.",
	icon_state: "tele0",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 2000,
});

// /obj/machinery/teleport/hub/proc/New  (code/game/machinery/teleporter.dm:237)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/teleporter_hub"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6731, "/obj/item/weapon/circuitboard/machine/teleporter_hub", "/obj/item/weapon/circuitboard/machine", {
	name: "Teleporter Hub (Machine Board)",
	build_path: rt.typePath("/obj/machinery/teleport/hub"),
	origin_tech: "programming=3;engineering=4;bluespace=4;materials=4",
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/teleporter_hub/proc/<init>  (code/game/machinery/teleporter.dm:245)
rt.def("/obj/item/weapon/circuitboard/machine/teleporter_hub/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 3, T("/obj/item/weapon/stock_parts/matter_bin"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]));
	return f.dot;
});

// /obj/machinery/teleport/hub/proc/Initialize  (code/game/machinery/teleporter.dm:251)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "link_power_station");
	return f.dot;
}, true);

// /obj/machinery/teleport/hub/proc/Destroy  (code/game/machinery/teleporter.dm:256)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "power_station"))) {
		rt.setFv(f, "teleporter_hub", rt.sv(f, "power_station"), null);
		rt.setSv(f, "power_station", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/teleport/hub/proc/RefreshParts  (code/game/machinery/teleporter.dm:262)
rt.def("/obj/machinery/teleport/hub/proc/RefreshParts", function RefreshParts(f: Frame) {
	let A: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [A, M, $e];
	A = 0;
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/matter_bin"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		A = rt.modify(live(A), rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "accurate", live(A));
	return f.dot;
});

// /obj/machinery/teleport/hub/proc/link_power_station  (code/game/machinery/teleporter.dm:269)
rt.def("/obj/machinery/teleport/hub/proc/link_power_station", function link_power_station(f: Frame) {
	let $e: any;
	f.vars = () => [$e];
	if (truthy(rt.sv(f, "power_station"))) {
		return live(f.dot);
	}
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		rt.setSv(f, "power_station", rt.locateIn(f, T("/obj/machinery/teleport/station"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))));
		if (truthy(rt.sv(f, "power_station"))) {
			break;
		}
	}
	rt.endFor(f, 0);
	return rt.sv(f, "power_station");
});

// /obj/machinery/teleport/hub/proc/Bumped  (code/game/machinery/teleporter.dm:276)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	f.vars = () => [M];
	if (isEqual(rt.sv(f, "z"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "You can't use this here."]);
	}
	if (truthy((yield* g.srcCall(f, "is_ready")))) {
		yield* g.srcCall(f, "teleport", live(M));
		yield* g.srcCall(f, "use_power", 5000);
	}
	return live(f.dot);
}, true);

// /obj/machinery/teleport/hub/proc/attackby  (code/game/machinery/teleporter.dm:284)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "tele-o", "tele0", live(f.args[0]))))) {
		if ((truthy(rt.sv(f, "power_station")) && truthy(rt.fv(f, "engaged", rt.sv(f, "power_station"))))) {
			rt.setFv(f, "engaged", rt.sv(f, "power_station"), 0);
			yield* g.srcCall(f, "update_icon");
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/teleport/hub/proc/teleport  (code/game/machinery/teleporter.dm:297)  may sleep
rt.def("/obj/machinery/teleport/hub/proc/teleport", function* teleport(f: Frame, M: Value, _T: Value) {
	let com: Value = null, human: Value = null;
	f.vars = () => [M, _T, com, human];
	if (!truthy((com = rt.fv(f, "teleporter_console", rt.sv(f, "power_station"))))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "target", live(com)))) {
		yield* g.srcCall(f, "visible_message", "<span class='alert'>Cannot authenticate locked on coordinates. Please reinstate coordinate matrix.</span>");
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/atom/movable")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(M), rt.fv(f, "target", live(com))])))) {
			if ((!truthy(rt.sv(f, "calibrated")) && truthy(rt.op(f, "Prob", [], [subtract(30, multiply(rt.sv(f, "accurate"), 10))])))) {
				if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if ((truthy(rt.gv(f, "dna", (human = live(M)))) && isEqual(rt.gv(f, "id", rt.gv(f, "species", rt.fv(f, "dna", live(human)))), "human"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='italics'>You hear a buzzing in your ears.</span>"]);
						yield* g.callName(f, live(human), "set_species", [T("/datum/species/fly")]);
					}
					yield* g.callName(f, live(human), "apply_effect", [(yield* g.call(f, P("/proc/rand"), null, [subtract(120, multiply(rt.sv(f, "accurate"), 40)), subtract(180, multiply(rt.sv(f, "accurate"), 60))])), "irradiate", 0]);
				}
			}
			rt.setSv(f, "calibrated", 0);
		}
	}
	return live(f.dot);
}, true);

// /obj/machinery/teleport/hub/proc/update_icon  (code/game/machinery/teleporter.dm:317)
rt.def("/obj/machinery/teleport/hub/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", "tele-o");
	} else {
		if (truthy(rt.callSrc(f, "is_ready", []))) {
			rt.setSv(f, "icon_state", "tele1");
		} else {
			rt.setSv(f, "icon_state", "tele0");
		}
	}
	return f.dot;
});

// /obj/machinery/teleport/hub/proc/power_change  (code/game/machinery/teleporter.dm:324)
rt.def("/obj/machinery/teleport/hub/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/teleport/hub/proc/is_ready  (code/game/machinery/teleporter.dm:328)
rt.def("/obj/machinery/teleport/hub/proc/is_ready", function is_ready(f: Frame) {
	f.dot = (((((!truthy(rt.sv(f, "panel_open")) ? 1 : 0) && (!truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) ? 1 : 0)) && rt.sv(f, "power_station")) && rt.fv(f, "engaged", rt.sv(f, "power_station"))) && (!truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "power_station")), 3)) ? 1 : 0));
	return f.dot;
});

rt.type(10337, "/obj/machinery/teleport/hub/syndicate", "/obj/machinery/teleport/hub", {});

// /obj/machinery/teleport/hub/syndicate/proc/New  (code/game/machinery/teleporter.dm:331)  may sleep
rt.def("/obj/machinery/teleport/hub/syndicate/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "component_parts", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/matter_bin/super"), [null])), add);
	yield* g.srcCall(f, "RefreshParts");
	return f.dot;
}, true);

rt.type(10338, "/obj/machinery/teleport/station", "/obj/machinery/teleport", {
	engaged: 0,
	teleporter_console: null,
	teleporter_hub: null,
	linked_stations: null,
	efficiency: 0,
	name: "station",
	desc: "The power control station for a bluespace teleporter. Used for toggling power, and can activate a test-fire to prevent malfunctions.",
	icon_state: "controller",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 2000,
});

// /obj/machinery/teleport/station/proc/<init>  (code/game/machinery/teleporter.dm:346)
rt.def("/obj/machinery/teleport/station/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "linked_stations", rt.list());
	return f.dot;
});

// /obj/machinery/teleport/station/proc/New  (code/game/machinery/teleporter.dm:350)  may sleep
rt.def("/obj/machinery/teleport/station/proc/New", function* New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/teleporter_station"), [null]))), "apply_default_parts", [live(f.src)]);
	return f.dot;
}, true);

rt.type(6732, "/obj/item/weapon/circuitboard/machine/teleporter_station", "/obj/item/weapon/circuitboard/machine", {
	name: "Teleporter Station (Machine Board)",
	build_path: rt.typePath("/obj/machinery/teleport/station"),
	origin_tech: "programming=4;engineering=4;bluespace=4;plasmatech=3",
	req_components: null,
	def_components: null,
});

// /obj/item/weapon/circuitboard/machine/teleporter_station/proc/<init>  (code/game/machinery/teleporter.dm:358)
rt.def("/obj/item/weapon/circuitboard/machine/teleporter_station/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), 2, T("/obj/item/weapon/stock_parts/capacitor"), 2, T("/obj/item/weapon/stock_parts/console_screen"), 1]));
	$0 = $0;
	rt.setSv(f, "def_components", rt.alist(f, [T("/obj/item/weapon/ore/bluespace_crystal"), T("/obj/item/weapon/ore/bluespace_crystal/artificial")]));
	return f.dot;
});

// /obj/machinery/teleport/station/proc/Initialize  (code/game/machinery/teleporter.dm:365)  may sleep
rt.def("/obj/machinery/teleport/station/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "link_console_and_hub");
	return f.dot;
}, true);

// /obj/machinery/teleport/station/proc/RefreshParts  (code/game/machinery/teleporter.dm:370)
rt.def("/obj/machinery/teleport/station/proc/RefreshParts", function RefreshParts(f: Frame) {
	let E: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [E, C, $e];
	E = null;
	C = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/capacitor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		E = rt.modify(live(E), rt.fv(f, "rating", live(C)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "efficiency", subtract(live(E), 1));
	return f.dot;
});

// /obj/machinery/teleport/station/proc/link_console_and_hub  (code/game/machinery/teleporter.dm:375)
rt.def("/obj/machinery/teleport/station/proc/link_console_and_hub", function link_console_and_hub(f: Frame) {
	let $e: any;
	f.vars = () => [$e];
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		rt.setSv(f, "teleporter_hub", rt.locateIn(f, T("/obj/machinery/teleport/hub"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))));
		if (truthy(rt.sv(f, "teleporter_hub"))) {
			rt.callName(f, rt.sv(f, "teleporter_hub"), "link_power_station", []);
			break;
		}
	}
	rt.endFor(f, 0);
	rt.forList(f, 0, rt.list(1, 4, 2, 8));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		rt.setSv(f, "teleporter_console", rt.locateIn(f, T("/obj/machinery/computer/teleporter"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))));
		if (truthy(rt.sv(f, "teleporter_console"))) {
			rt.callName(f, rt.sv(f, "teleporter_console"), "link_power_station", []);
			break;
		}
	}
	rt.endFor(f, 0);
	return (rt.sv(f, "teleporter_hub") && rt.sv(f, "teleporter_console"));
});

// /obj/machinery/teleport/station/proc/Destroy  (code/game/machinery/teleporter.dm:390)  may sleep
rt.def("/obj/machinery/teleport/station/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "teleporter_hub"))) {
		rt.setFv(f, "power_station", rt.sv(f, "teleporter_hub"), null);
		yield* g.callName(f, rt.sv(f, "teleporter_hub"), "update_icon", []);
		rt.setSv(f, "teleporter_hub", null);
	}
	if (truthy(rt.sv(f, "teleporter_console"))) {
		rt.setFv(f, "power_station", rt.sv(f, "teleporter_console"), null);
		rt.setSv(f, "teleporter_console", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/teleport/station/proc/attackby  (code/game/machinery/teleporter.dm:399)  may sleep
rt.def("/obj/machinery/teleport/station/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		M = live(f.args[0]);
		if (truthy(rt.sv(f, "panel_open"))) {
			rt.setFv(f, "buffer", live(M), live(f.src));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>You download the data to the ＀'s buffer.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
		} else {
			if (((truthy(rt.fv(f, "buffer", live(M))) && truthy((rt.istype(rt.fv(f, "buffer", live(M)), T("/obj/machinery/teleport/station")) ? 1 : 0))) && !isEqual(rt.fv(f, "buffer", live(M)), live(f.src)))) {
				if (rt.lt(rt.len(f, rt.sv(f, "linked_stations")), rt.sv(f, "efficiency"))) {
					yield* g.callName(f, rt.sv(f, "linked_stations"), "Add", [rt.fv(f, "buffer", live(M))]);
					rt.setFv(f, "buffer", live(M), null);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>You upload the data from the ＀'s buffer.</span>", [rt.fv(f, "name", live(f.args[0]))])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='alert'>This station can't hold more information, try to use better parts.</span>"]);
				}
			}
		}
		return live(f.dot);
	} else {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), "controller-o", "controller", live(f.args[0]))))) {
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		} else {
			if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
				return live(f.dot);
			} else {
				if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
					return live(f.dot);
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
						if (truthy(rt.sv(f, "panel_open"))) {
							yield* g.srcCall(f, "link_console_and_hub");
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='caution'>You reconnect the station to nearby machinery.</span>"]);
							return live(f.dot);
						}
					} else {
						return (yield* g.callSuper(f, [], rt.Args.Same));
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/teleport/station/proc/attack_paw  (code/game/machinery/teleporter.dm:432)  may sleep
rt.def("/obj/machinery/teleport/station/proc/attack_paw", function* attack_paw(f: Frame) {
	yield* g.callName(f, live(f.src), "attack_hand", []);
	return f.dot;
}, true);

// /obj/machinery/teleport/station/proc/attack_ai  (code/game/machinery/teleporter.dm:435)  may sleep
rt.def("/obj/machinery/teleport/station/proc/attack_ai", function* attack_ai(f: Frame) {
	yield* g.callName(f, live(f.src), "attack_hand", []);
	return f.dot;
}, true);

// /obj/machinery/teleport/station/proc/attack_hand  (code/game/machinery/teleporter.dm:438)  may sleep
rt.def("/obj/machinery/teleport/station/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "panel_open"))) return f.dot;
	yield* g.srcCall(f, "toggle", live(user));
	return f.dot;
}, true);

// /obj/machinery/teleport/station/proc/toggle  (code/game/machinery/teleporter.dm:442)  may sleep
rt.def("/obj/machinery/teleport/station/proc/toggle", function* toggle(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (((truthy(rt.bitAnd(rt.sv(f, "stat"), 3)) || !truthy(rt.sv(f, "teleporter_hub"))) || !truthy(rt.sv(f, "teleporter_console")))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "target", rt.sv(f, "teleporter_console")))) {
		if ((truthy(rt.fv(f, "panel_open", rt.sv(f, "teleporter_hub"))) || truthy(rt.bitAnd(rt.fv(f, "stat", rt.sv(f, "teleporter_hub")), 3)))) {
			yield* g.srcCall(f, "visible_message", "<span class='alert'>The teleporter hub isn't responding.</span>");
		} else {
			rt.setFv(f, "engaged", live(f.src), (!truthy(rt.fv(f, "engaged", live(f.src))) ? 1 : 0));
			yield* g.srcCall(f, "use_power", 5000);
			if (truthy(rt.sv(f, "engaged"))) {
				$0 = "";
			} else {
				$0 = "dis";
			}
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>Teleporter ＀engaged!</span>", [$0]));
		}
	} else {
		yield* g.srcCall(f, "visible_message", "<span class='alert'>No target detected.</span>");
		rt.setFv(f, "engaged", live(f.src), 0);
	}
	yield* g.callName(f, rt.sv(f, "teleporter_hub"), "update_icon", []);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	return live(f.dot);
}, true);

// /obj/machinery/teleport/station/proc/power_change  (code/game/machinery/teleporter.dm:459)
rt.def("/obj/machinery/teleport/station/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	if (!truthy(rt.sv(f, "teleporter_hub"))) return f.dot;
	rt.callName(f, rt.sv(f, "teleporter_hub"), "update_icon", []);
	return f.dot;
});

// /obj/machinery/teleport/station/proc/update_icon  (code/game/machinery/teleporter.dm:466)
rt.def("/obj/machinery/teleport/station/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.setSv(f, "icon_state", "controller-o");
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
			rt.setSv(f, "icon_state", "controller-p");
		} else {
			rt.setSv(f, "icon_state", "controller");
		}
	}
	return f.dot;
});
