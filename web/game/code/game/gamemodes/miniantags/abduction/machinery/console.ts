// From code/game/gamemodes/miniantags/abduction/machinery/console.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10438, "/obj/machinery/abductor/console", "/obj/machinery/abductor", {
	gizmo: null,
	vest: null,
	experiment: null,
	pad: null,
	camera: null,
	disguises: null,
	anchored: 1,
	name: "abductor console",
	desc: "Ship command center.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "console",
	density: 1,
});

// /obj/machinery/abductor/console/proc/<init>  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:21)
rt.def("/obj/machinery/abductor/console/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "disguises", rt.list());
	return f.dot;
});

// /obj/machinery/abductor/console/proc/attack_hand  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:24)  may sleep
rt.def("/obj/machinery/abductor/console/proc/attack_hand", function* attack_hand(f: Frame) {
	let dat: Value = null, points: Value = null, credits: Value = null, mode: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [dat, points, credits, mode, popup, $0, $1];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/abductor")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You start mashing alien buttons at random!</span>"]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[0]), null, 100, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "TeleporterSend");
		}
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_machine", [live(f.src)]);
	dat = "";
	dat = rt.modify(live(dat), "<H3> Abductsoft 3000 </H3>", add);
	if (truthy(rt.sv(f, "experiment"))) {
		points = rt.fv(f, "points", rt.sv(f, "experiment"));
		credits = rt.fv(f, "credits", rt.sv(f, "experiment"));
		dat = rt.modify(live(dat), fmt("Collected Samples : ＀ <br>", [live(points)]), add);
		dat = rt.modify(live(dat), fmt("Gear Credits: ＀ <br>", [live(credits)]), add);
		dat = rt.modify(live(dat), "<b>Transfer data in exchange for supplies:</b><br>", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;dispense=baton'>Advanced Baton</A><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;dispense=helmet'>Agent Helmet</A><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;dispense=vest'>Agent Vest</A><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;dispense=silencer'>Radio Silencer</A><br>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;dispense=tool'>Science Tool</A><br>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<span class='bad'>NO EXPERIMENT MACHINE DETECTED</span> <br>", add);
	}
	if (truthy(rt.sv(f, "pad"))) {
		dat = rt.modify(live(dat), "<span class='bad'>Emergency Teleporter System.</span>", add);
		dat = rt.modify(live(dat), "<span class='bad'>Consider using primary observation console first.</span>", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;teleporter_send=1'>Activate Teleporter</A><br>", [live(f.src)]), add);
		if ((truthy(rt.sv(f, "gizmo")) && truthy(rt.fv(f, "marked", rt.sv(f, "gizmo"))))) {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;teleporter_retrieve=1'>Retrieve Mark</A><br>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Retrieve Mark</span><br>", add);
		}
	} else {
		dat = rt.modify(live(dat), "<span class='bad'>NO TELEPAD DETECTED</span></br>", add);
	}
	if (truthy(rt.sv(f, "vest"))) {
		dat = rt.modify(live(dat), "<h4> Agent Vest Mode </h4><br>", add);
		if (isEqual((mode = rt.fv(f, "mode", rt.sv(f, "vest"))), 1)) {
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;flip_vest=1'>Combat</A>", [live(f.src)]), add);
			dat = rt.modify(live(dat), "<span class='linkOff'>Stealth</span>", add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Combat</span>", add);
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;flip_vest=1'>Stealth</A>", [live(f.src)]), add);
		}
		dat = rt.modify(live(dat), "<br>", add);
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;select_disguise=1'>Select Agent Vest Disguise</a><br>", [live(f.src)]), add);
		$0 = live(f.src);
		if (truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "vest")), 2))) {
			$1 = "Unlock";
		} else {
			$1 = "Lock";
		}
		dat = rt.modify(live(dat), fmt("<a href='?src=＃;toggle_vest=1'>＀ Vest</a><br>", [$0, $1]), add);
	} else {
		dat = rt.modify(live(dat), "<span class='bad'>NO AGENT VEST DETECTED</span>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Abductor Console", 400, 500]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/abductor/console/proc/Topic  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:80)  may sleep
rt.def("/obj/machinery/abductor/console/proc/Topic", function* Topic(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "teleporter_send"))) {
		yield* g.srcCall(f, "TeleporterSend");
	} else {
		if (truthy(rt.at(live(f.args[1]), "teleporter_retrieve"))) {
			yield* g.srcCall(f, "TeleporterRetrieve");
		} else {
			if (truthy(rt.at(live(f.args[1]), "flip_vest"))) {
				yield* g.srcCall(f, "FlipVest");
			} else {
				if (truthy(rt.at(live(f.args[1]), "toggle_vest"))) {
					if (truthy(rt.sv(f, "vest"))) {
						yield* g.callName(f, rt.sv(f, "vest"), "toggle_nodrop", []);
					}
				} else {
					if (truthy(rt.at(live(f.args[1]), "select_disguise"))) {
						yield* g.srcCall(f, "SelectDisguise");
					} else {
						if (truthy(rt.at(live(f.args[1]), "dispense"))) {
							$0 = rt.at(live(f.args[1]), "dispense");
							if ($0 === "baton") {
								yield* g.callSrc(f, "Dispense", [null, T("/obj/item/weapon/abductor_baton"), "cost", 2], rt.Args.Named);
							} else if ($0 === "helmet") {
								yield* g.srcCall(f, "Dispense", T("/obj/item/clothing/head/helmet/abductor"));
							} else if ($0 === "silencer") {
								yield* g.srcCall(f, "Dispense", T("/obj/item/device/abductor/silencer"));
							} else if ($0 === "tool") {
								yield* g.srcCall(f, "Dispense", T("/obj/item/device/abductor/gizmo"));
							} else if ($0 === "vest") {
								yield* g.srcCall(f, "Dispense", T("/obj/item/clothing/suit/armor/abductor/vest"));
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/abductor/console/proc/TeleporterRetrieve  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:110)  may sleep
rt.def("/obj/machinery/abductor/console/proc/TeleporterRetrieve", function* TeleporterRetrieve(f: Frame) {
	if (!((truthy(rt.sv(f, "pad")) && truthy(rt.sv(f, "gizmo"))) && truthy(rt.fv(f, "marked", rt.sv(f, "gizmo"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "pad"), "Retrieve", [rt.fv(f, "marked", rt.sv(f, "gizmo"))]);
	return f.dot;
}, true);

// /obj/machinery/abductor/console/proc/TeleporterSend  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:115)  may sleep
rt.def("/obj/machinery/abductor/console/proc/TeleporterSend", function* TeleporterSend(f: Frame) {
	if (!truthy(rt.sv(f, "pad"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "pad"), "Send", []);
	return f.dot;
}, true);

// /obj/machinery/abductor/console/proc/FlipVest  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:119)  may sleep
rt.def("/obj/machinery/abductor/console/proc/FlipVest", function* FlipVest(f: Frame) {
	if (!truthy(rt.sv(f, "vest"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "vest"), "flip_mode", []);
	return f.dot;
}, true);

// /obj/machinery/abductor/console/proc/SelectDisguise  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:122)  may sleep
rt.def("/obj/machinery/abductor/console/proc/SelectDisguise", function* SelectDisguise(f: Frame, remote: Value) {
	let entry_name: Value = null, chosen: Value = null;
	f.vars = () => [remote, entry_name, chosen];
	if (live(remote) === null) {
		remote = 0;
	}
	entry_name = (yield* g.op(f, "Prompt", [1], [null, null, "Disguise", "Choose Disguise", rt.sv(f, "disguises")]));
	if (!((truthy((chosen = rt.index(rt.sv(f, "disguises"), live(entry_name)))) && truthy(rt.sv(f, "vest"))) && (truthy(live(remote)) || rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.usr), live(f.src)])), 1)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "vest"), "SetDisguise", [live(chosen)]);
	return f.dot;
}, true);

// /obj/machinery/abductor/console/proc/SetDroppoint  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:128)
rt.def("/obj/machinery/abductor/console/proc/SetDroppoint", function SetDroppoint(f: Frame, location: Value, user: Value) {
	if (!truthy((rt.istype(live(location), T("/turf/open")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>That place is not safe for the specimen.</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "pad"))) return f.dot;
	rt.setFv(f, "teleport_target", rt.sv(f, "pad"), live(location));
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Location marked as test subject release point.</span>"]);
	return f.dot;
});

// /obj/machinery/abductor/console/proc/Initialize  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:138)  may sleep
rt.def("/obj/machinery/abductor/console/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true, { args: ["mapload"] });

// /obj/machinery/abductor/console/proc/LateInitialize  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:142)
rt.def("/obj/machinery/abductor/console/proc/LateInitialize", function LateInitialize(f: Frame) {
	let p: Value = null, e: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [p, e, c, $e];
	if (!truthy(rt.sv(f, "team"))) {
		return live(f.dot);
	}
	p = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/pad"));
	while (($e = rt.next(f, 0)) !== undefined) {
		p = $e;
		if (isEqual(rt.fv(f, "team", live(p)), rt.sv(f, "team"))) {
			rt.setSv(f, "pad", live(p));
			break;
		}
	}
	rt.endFor(f, 0);
	e = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/experiment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		e = $e;
		if (isEqual(rt.fv(f, "team", live(e)), rt.sv(f, "team"))) {
			rt.setSv(f, "experiment", live(e));
			rt.setFv(f, "console", live(e), live(f.src));
		}
	}
	rt.endFor(f, 0);
	c = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/computer/camera_advanced/abductor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (isEqual(rt.fv(f, "team", live(c)), rt.sv(f, "team"))) {
			rt.setSv(f, "camera", live(c));
			rt.setFv(f, "console", live(c), live(f.src));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/abductor/console/proc/AddSnapshot  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:161)
rt.def("/obj/machinery/abductor/console/proc/AddSnapshot", function AddSnapshot(f: Frame, target: Value) {
	let entry: Value = null;
	f.vars = () => [entry];
	rt.setFv(f, "name", (entry = rt.new_(f, T("/datum/icon_snapshot"), [])), rt.fv(f, "name", live(target)));
	rt.setFv(f, "icon", live(entry), rt.fv(f, "icon", live(target)));
	rt.setFv(f, "icon_state", live(entry), rt.fv(f, "icon_state", live(target)));
	rt.setFv(f, "overlays", live(entry), rt.callName(f, live(target), "get_overlays_copy", [rt.list(3)]));
	if (truthy(rt.index(rt.sv(f, "disguises"), rt.fv(f, "name", live(entry))))) {
		rt.setAt(rt.sv(f, "disguises"), rt.fv(f, "name", live(entry)), live(entry));
		return live(f.dot);
	}
	rt.setAt(rt.sv(f, "disguises"), rt.fv(f, "name", live(entry)), live(entry));
	return f.dot;
});

// /obj/machinery/abductor/console/proc/AddGizmo  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:173)
rt.def("/obj/machinery/abductor/console/proc/AddGizmo", function AddGizmo(f: Frame, G: Value) {
	if ((isEqual(live(G), rt.sv(f, "gizmo")) && isEqual(rt.fv(f, "console", live(G)), live(f.src)))) {
		return 0;
	}
	if (truthy(rt.fv(f, "console", live(G)))) {
		rt.setFv(f, "gizmo", rt.fv(f, "console", live(G)), null);
	}
	rt.setSv(f, "gizmo", live(G));
	rt.setFv(f, "console", live(G), live(f.src));
	return 1;
});

// /obj/machinery/abductor/console/proc/AddVest  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:184)
rt.def("/obj/machinery/abductor/console/proc/AddVest", function AddVest(f: Frame, V: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if (isEqual(rt.sv(f, "vest"), live(V))) {
		return 0;
	}
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "vest", live(C)), live(V))) {
			rt.setFv(f, "vest", live(C), null);
			break;
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "vest", live(V));
	return 1;
});

// /obj/machinery/abductor/console/proc/attackby  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:196)  may sleep
rt.def("/obj/machinery/abductor/console/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/abductor/gizmo")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "AddGizmo", live(f.args[0])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You link the tool to the console.</span>"]);
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/suit/armor/abductor/vest")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "AddVest", live(f.args[0])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You link the vest to the console.</span>"]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/abductor/console/proc/Dispense  (code/game/gamemodes/miniantags/abduction/machinery/console.dm:206)  may sleep
rt.def("/obj/machinery/abductor/console/proc/Dispense", function* Dispense(f: Frame, item: Value, cost: Value) {
	let drop_location: Value = null;
	f.vars = () => [item, cost, drop_location];
	if (live(cost) === null) {
		cost = 1;
	}
	if ((truthy(rt.sv(f, "experiment")) && rt.ge(rt.fv(f, "credits", rt.sv(f, "experiment")), live(cost)))) {
		(rt.modField(f, rt.sv(f, "experiment"), "credits", live(cost), subtract));
		yield* g.srcCall(f, "say", "Incoming supply!");
		drop_location = rt.sv(f, "loc");
		if (truthy(rt.sv(f, "pad"))) {
			yield* g.call(f, P("/proc/flick"), null, ["alien-pad", rt.sv(f, "pad")]);
			drop_location = rt.fv(f, "loc", rt.sv(f, "pad"));
		}
		yield* g.new_(f, live(item), [live(drop_location)]);
	} else {
		yield* g.srcCall(f, "say", "Insufficent data!");
	}
	return f.dot;
}, true);
