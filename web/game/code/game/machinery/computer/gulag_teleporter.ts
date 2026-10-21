// From code/game/machinery/computer/gulag_teleporter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10381, "/obj/machinery/computer/gulag_teleporter_computer", "/obj/machinery/computer", {
	default_goal: 200,
	id: null,
	teleporter: null,
	beacon: null,
	prisoner: null,
	temporary_record: null,
	icon_screen: "explosive",
	icon_keyboard: "security_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/gulag_teleporter_console"),
	light_color: "#FA8282",
	name: "labor camp teleporter console",
	desc: "Used to send criminals to the Labor Camp",
	req_access: null,
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/<init>  (code/game/machinery/computer/gulag_teleporter.dm:7)
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(3));
	return f.dot;
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/New  (code/game/machinery/computer/gulag_teleporter.dm:19)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/gulag_teleporter_computer/proc/scan_machinery")])), 5]);
	return f.dot;
}, true);

// /obj/machinery/computer/gulag_teleporter_computer/proc/Destroy  (code/game/machinery/computer/gulag_teleporter.dm:24)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "id"))) {
		yield* g.callName(f, rt.sv(f, "id"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/gulag_teleporter_computer/proc/attackby  (code/game/machinery/computer/gulag_teleporter.dm:28)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "id"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
			rt.setSv(f, "id", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There's an ID inserted already.</span>"]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user"] });

// /obj/machinery/computer/gulag_teleporter_computer/proc/ui_interact  (code/game/machinery/computer/gulag_teleporter.dm:42)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("default_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "gulag_console", rt.sv(f, "name"), 455, 440, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/gulag_teleporter_computer/proc/ui_data  (code/game/machinery/computer/gulag_teleporter.dm:48)
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, prisoner_list: Value = null, can_teleport: Value = null, r: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [data, prisoner_list, can_teleport, r, R, $e];
	data = rt.list();
	prisoner_list = rt.list();
	can_teleport = 0;
	if ((truthy(rt.sv(f, "teleporter")) && (truthy(rt.fv(f, "occupant", rt.sv(f, "teleporter"))) && truthy((rt.istype(rt.fv(f, "occupant", rt.sv(f, "teleporter")), T("/mob/living/carbon/human")) ? 1 : 0))))) {
		rt.setSv(f, "prisoner", rt.fv(f, "occupant", rt.sv(f, "teleporter")));
		rt.setAt(live(prisoner_list), "name", rt.fv(f, "real_name", rt.sv(f, "prisoner")));
		if (truthy(rt.sv(f, "id"))) {
			can_teleport = 1;
		}
		if (rt.fv(f, "general", rt.gl("data_core")) !== null) {
			r = null;
			rt.forList(f, 0, rt.fv(f, "security", rt.gl("data_core")));
			while (($e = rt.next(f, 0)) !== undefined) {
				r = $e;
				if (isEqual(rt.index(rt.gv(f, "fields", (R = live(r))), "name"), rt.at(live(prisoner_list), "name"))) {
					rt.setSv(f, "temporary_record", live(R));
					rt.setAt(live(prisoner_list), "crimstat", rt.index(rt.fv(f, "fields", rt.sv(f, "temporary_record")), "criminal"));
				}
			}
			rt.endFor(f, 0);
		}
	}
	rt.setAt(live(data), "prisoner", live(prisoner_list));
	if (truthy(rt.sv(f, "teleporter"))) {
		rt.setAt(live(data), "teleporter", rt.sv(f, "teleporter"));
		rt.setAt(live(data), "teleporter_location", fmt("(＀, ＀, ＀)", [rt.fv(f, "x", rt.sv(f, "teleporter")), rt.fv(f, "y", rt.sv(f, "teleporter")), rt.fv(f, "z", rt.sv(f, "teleporter"))]));
		rt.setAt(live(data), "teleporter_lock", rt.fv(f, "locked", rt.sv(f, "teleporter")));
		rt.setAt(live(data), "teleporter_state_open", rt.fv(f, "state_open", rt.sv(f, "teleporter")));
	}
	if (truthy(rt.sv(f, "beacon"))) {
		rt.setAt(live(data), "beacon", rt.sv(f, "beacon"));
		rt.setAt(live(data), "beacon_location", fmt("(＀, ＀, ＀)", [rt.fv(f, "x", rt.sv(f, "beacon")), rt.fv(f, "y", rt.sv(f, "beacon")), rt.fv(f, "z", rt.sv(f, "beacon"))]));
	}
	if (truthy(rt.sv(f, "id"))) {
		rt.setAt(live(data), "id", rt.sv(f, "id"));
		rt.setAt(live(data), "id_name", rt.fv(f, "registered_name", rt.sv(f, "id")));
		rt.setAt(live(data), "goal", rt.fv(f, "goal", rt.sv(f, "id")));
	}
	rt.setAt(live(data), "can_teleport", live(can_teleport));
	return live(data);
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/ui_act  (code/game/machinery/computer/gulag_teleporter.dm:84)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/ui_act", function* ui_act(f: Frame) {
	let I: Value = null, new_goal: Value = null;
	let $0: any;
	f.vars = () => [I, new_goal, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "allowed", live(f.usr))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Access denied.</span>"]);
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "scan_teleporter") {
		rt.setSv(f, "teleporter", (yield* g.srcCall(f, "findteleporter")));
	} else if ($0 === "scan_beacon") {
		rt.setSv(f, "beacon", (yield* g.srcCall(f, "findbeacon")));
	} else if ($0 === "handle_id") {
		if (truthy(rt.sv(f, "id"))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "id")]);
				rt.setSv(f, "id", null);
			} else {
				yield* g.callName(f, rt.sv(f, "id"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				rt.setSv(f, "id", null);
			}
		} else {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
				rt.setSv(f, "id", live(I));
			}
		}
	} else if ($0 === "set_goal") {
		if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [(new_goal = (yield* g.op(f, "Prompt", [33], [null, rt.fv(f, "goal", rt.sv(f, "id")), "Points", "Set the amount of points:", null])))])))) {
			return live(f.dot);
		}
		if (!truthy(live(new_goal))) {
			new_goal = rt.sv(f, "default_goal");
		}
		rt.setFv(f, "goal", rt.sv(f, "id"), (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [live(new_goal), 1000]))])));
	} else if ($0 === "toggle_open") {
		if (truthy(rt.fv(f, "locked", rt.sv(f, "teleporter")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "The teleporter is locked"]);
			return live(f.dot);
		}
		yield* g.callName(f, rt.sv(f, "teleporter"), "toggle_open", []);
	} else if ($0 === "teleporter_lock") {
		if (truthy(rt.fv(f, "state_open", rt.sv(f, "teleporter")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Close the teleporter before locking!"]);
			return live(f.dot);
		}
		rt.setFv(f, "locked", rt.sv(f, "teleporter"), (!truthy(rt.fv(f, "locked", rt.sv(f, "teleporter"))) ? 1 : 0));
	} else if ($0 === "teleport") {
		if ((!truthy(rt.sv(f, "teleporter")) || !truthy(rt.sv(f, "beacon")))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/computer/gulag_teleporter_computer/proc/teleport"), live(f.usr)])), 5]);
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/computer/gulag_teleporter_computer/proc/scan_machinery  (code/game/machinery/computer/gulag_teleporter.dm:132)
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/scan_machinery", function scan_machinery(f: Frame) {
	rt.setSv(f, "teleporter", rt.callSrc(f, "findteleporter", []));
	rt.setSv(f, "beacon", rt.callSrc(f, "findbeacon", []));
	return f.dot;
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/findteleporter  (code/game/machinery/computer/gulag_teleporter.dm:138)
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/findteleporter", function findteleporter(f: Frame) {
	let teleporterf: Value = null;
	let $e: any;
	f.vars = () => [teleporterf, $e];
	teleporterf = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		rt.setSv(f, "dir", $e);
		if ((truthy((teleporterf = rt.locateIn(f, T("/obj/machinery/gulag_teleporter"), rt.getStep(f, live(f.src), rt.sv(f, "dir"))))) && truthy(rt.callName(f, live(teleporterf), "is_operational", [])))) {
			return live(teleporterf);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/findbeacon  (code/game/machinery/computer/gulag_teleporter.dm:144)
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/findbeacon", function findbeacon(f: Frame) {
	return rt.locateIn(f, T("/obj/structure/gulag_beacon"), rt.world());
});

// /obj/machinery/computer/gulag_teleporter_computer/proc/teleport  (code/game/machinery/computer/gulag_teleporter.dm:147)  may sleep
rt.def("/obj/machinery/computer/gulag_teleporter_computer/proc/teleport", function* teleport(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀ teleported ＀(＀) to the Labor Camp (＀, ＀, ＀) for ＀ points.", [live(user), rt.fv(f, "ckey", live(user)), rt.sv(f, "prisoner"), rt.fv(f, "ckey", rt.sv(f, "prisoner")), rt.fv(f, "x", rt.sv(f, "beacon")), rt.fv(f, "y", rt.sv(f, "beacon")), rt.fv(f, "z", rt.sv(f, "beacon")), rt.fv(f, "goal", rt.sv(f, "id"))])]);
	yield* g.callName(f, rt.sv(f, "teleporter"), "handle_prisoner", [rt.sv(f, "id"), rt.sv(f, "temporary_record")]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/emitter.ogg"), 50, 1]);
	yield* g.callName(f, rt.sv(f, "prisoner"), "forceMove", [rt.getStep(f, rt.sv(f, "beacon"), 0)]);
	yield* g.callName(f, rt.sv(f, "prisoner"), "Knockdown", [40]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "prisoner"), "<span class='warning'>The teleportation makes you a little dizzy.</span>"]);
	yield* g.new_(f, T("/obj/effect/particle_effect/sparks"), [rt.fv(f, "loc", rt.sv(f, "prisoner"))]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 50, 1]);
	if (truthy(rt.fv(f, "locked", rt.sv(f, "teleporter")))) {
		rt.setFv(f, "locked", rt.sv(f, "teleporter"), 0);
	}
	yield* g.callName(f, rt.sv(f, "teleporter"), "toggle_open", []);
	rt.setSv(f, "id", null);
	rt.setSv(f, "temporary_record", null);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });
