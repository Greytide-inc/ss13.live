// From code/modules/mining/laborcamp/laborstacker.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10939, "/obj/machinery/mineral/labor_claim_console", "/obj/machinery/mineral", {
	stacking_machine: null,
	machinedir: 2,
	inserted_id: null,
	release_door: null,
	door_tag: "prisonshuttle",
	Radio: null,
	anchored: 1,
	name: "point claim console",
	desc: "A stacking console with an electromagnetic writer, used to track ore mined by prisoners.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// /obj/machinery/mineral/labor_claim_console/proc/New  (code/modules/mining/laborcamp/laborstacker.dm:19)  may sleep
rt.def("/obj/machinery/mineral/labor_claim_console/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "Radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "listening", rt.sv(f, "Radio"), 0);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/machinery/mineral/labor_claim_console/proc/locate_stacking_machine")])), 7]);
	return f.dot;
}, true);

// /obj/machinery/mineral/labor_claim_console/proc/attackby  (code/modules/mining/laborcamp/laborstacker.dm:25)  may sleep
rt.def("/obj/machinery/mineral/labor_claim_console/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "inserted_id"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
			rt.setSv(f, "inserted_id", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀.</span>", [live(f.args[0])])]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There's an ID inserted already.</span>"]);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/mineral/labor_claim_console/proc/ui_interact  (code/modules/mining/laborcamp/laborstacker.dm:39)  may sleep
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "labor_claim_console", rt.sv(f, "name"), 450, 475, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/mineral/labor_claim_console/proc/ui_data  (code/modules/mining/laborcamp/laborstacker.dm:45)
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, can_go_home: Value = null, ores: Value = null, ore: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [data, can_go_home, ores, ore, O, $e];
	data = rt.list();
	can_go_home = 0;
	rt.setAt(live(data), "emagged", rt.sv(f, "emagged"));
	if (truthy(rt.sv(f, "inserted_id"))) {
		rt.setAt(live(data), "id", rt.sv(f, "inserted_id"));
		rt.setAt(live(data), "id_name", rt.fv(f, "registered_name", rt.sv(f, "inserted_id")));
		rt.setAt(live(data), "points", rt.fv(f, "points", rt.sv(f, "inserted_id")));
		rt.setAt(live(data), "goal", rt.fv(f, "goal", rt.sv(f, "inserted_id")));
	}
	if (truthy(rt.callSrc(f, "check_auth", []))) {
		can_go_home = 1;
	}
	ores = rt.list();
	if (truthy(rt.sv(f, "stacking_machine"))) {
		rt.setAt(live(data), "unclaimed_points", rt.fv(f, "points", rt.sv(f, "stacking_machine")));
		ore = null;
		rt.forList(f, 0, rt.fv(f, "ore_values", rt.sv(f, "stacking_machine")));
		while (($e = rt.next(f, 0)) !== undefined) {
			ore = $e;
			rt.setAt((O = rt.list()), "ore", live(ore));
			rt.setAt(live(O), "value", rt.index(rt.fv(f, "ore_values", rt.sv(f, "stacking_machine")), live(ore)));
			ores = rt.modify(live(ores), rt.list(live(O)), add);
		}
		rt.endFor(f, 0);
	}
	rt.setAt(live(data), "ores", live(ores));
	rt.setAt(live(data), "can_go_home", live(can_go_home));
	return live(data);
});

// /obj/machinery/mineral/labor_claim_console/proc/ui_act  (code/modules/mining/laborcamp/laborstacker.dm:72)  may sleep
rt.def("/obj/machinery/mineral/labor_claim_console/proc/ui_act", function* ui_act(f: Frame) {
	let I: Value = null;
	let $0: any;
	f.vars = () => [I, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "handle_id") {
		if (truthy(rt.sv(f, "inserted_id"))) {
			if (!truthy((yield* g.callName(f, live(f.usr), "get_active_held_item", [])))) {
				yield* g.callName(f, live(f.usr), "put_in_hands", [rt.sv(f, "inserted_id")]);
				rt.setSv(f, "inserted_id", null);
			} else {
				yield* g.callName(f, rt.sv(f, "inserted_id"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				rt.setSv(f, "inserted_id", null);
			}
		} else {
			if (truthy((rt.istype((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.usr), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
				rt.setSv(f, "inserted_id", live(I));
			}
		}
	} else if ($0 === "claim_points") {
		rt.modField(f, rt.sv(f, "inserted_id"), "points", rt.fv(f, "points", rt.sv(f, "stacking_machine")), add);
		rt.setFv(f, "points", rt.sv(f, "stacking_machine"), 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Points transferred."]);
	} else if ($0 === "move_shuttle") {
		if (!truthy((yield* g.call(f, P("/proc/alone_in_area"), null, [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.usr)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>Prisoners are only allowed to be released while alone.</span>"]);
		} else {
			$0 = (yield* g.callName(f, rt.gl("SSshuttle"), "moveShuttle", ["laborcamp", "laborcamp_home"]));
			if ($0 === 1) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Shuttle not found</span>"]);
			} else if ($0 === 2) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Shuttle already at station</span>"]);
			} else if ($0 === 3) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>No permission to dock could be granted.</span>"]);
			} else {
				if (!truthy(rt.sv(f, "emagged"))) {
					yield* g.callName(f, rt.sv(f, "Radio"), "set_frequency", [1359]);
					yield* g.callName(f, rt.sv(f, "Radio"), "talk_into", [live(f.src), fmt("＀ has returned to the station. Minerals and Prisoner ID card ready for retrieval.", [rt.fv(f, "registered_name", rt.sv(f, "inserted_id"))]), 1359, (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>Shuttle received message and will be sent shortly.</span>"]);
			}
		}
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/mineral/labor_claim_console/proc/check_auth  (code/modules/mining/laborcamp/laborstacker.dm:114)
rt.def("/obj/machinery/mineral/labor_claim_console/proc/check_auth", function check_auth(f: Frame) {
	if (truthy(rt.sv(f, "emagged"))) {
		return 1;
	}
	return ((rt.istype(rt.sv(f, "inserted_id"), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0) && (rt.ge(rt.fv(f, "points", rt.sv(f, "inserted_id")), rt.fv(f, "goal", rt.sv(f, "inserted_id"))) ? 1 : 0));
});

// /obj/machinery/mineral/labor_claim_console/proc/locate_stacking_machine  (code/modules/mining/laborcamp/laborstacker.dm:117)  may sleep
rt.def("/obj/machinery/mineral/labor_claim_console/proc/locate_stacking_machine", function* locate_stacking_machine(f: Frame) {
	rt.setSv(f, "stacking_machine", rt.locateIn(f, T("/obj/machinery/mineral/stacking_machine"), rt.getStep(f, live(f.src), rt.sv(f, "machinedir"))));
	if (truthy(rt.sv(f, "stacking_machine"))) {
		rt.setFv(f, "CONSOLE", rt.sv(f, "stacking_machine"), live(f.src));
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/machinery/mineral/labor_claim_console/proc/emag_act  (code/modules/mining/laborcamp/laborstacker.dm:124)
rt.def("/obj/machinery/mineral/labor_claim_console/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>PZZTTPFFFT</span>"]);
	return f.dot;
});

rt.type(10934, "/obj/machinery/mineral/stacking_machine/laborstacker", "/obj/machinery/mineral/stacking_machine", {
	points: 0,
	ore_values: null,
});

// /obj/machinery/mineral/stacking_machine/laborstacker/proc/<init>  (code/modules/mining/laborcamp/laborstacker.dm:134)
rt.def("/obj/machinery/mineral/stacking_machine/laborstacker/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ore_values", rt.alist(f, ["glass", 1, "metal", 2, "solid plasma", 20, "plasteel", 23, "reinforced glass", 4, "gold", 20, "silver", 20, "uranium", 20, "diamond", 25, "bananium", 50]));
	return f.dot;
});

// /obj/machinery/mineral/stacking_machine/laborstacker/proc/process_sheet  (code/modules/mining/laborcamp/laborstacker.dm:137)  may sleep
rt.def("/obj/machinery/mineral/stacking_machine/laborstacker/proc/process_sheet", function* process_sheet(f: Frame) {
	let n: Value = null, a: Value = null;
	f.vars = () => [n, a];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
		n = rt.fv(f, "name", live(f.args[0]));
		a = rt.fv(f, "amount", live(f.args[0]));
		if (truthy((rt.isIn(f, live(n), rt.sv(f, "ore_values")) ? 1 : 0))) {
			rt.modSrcVar(f, "points", multiply(rt.index(rt.sv(f, "ore_values"), live(n)), live(a)), add);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["inp"] });

rt.type(10940, "/obj/machinery/mineral/labor_points_checker", "/obj/machinery/mineral", {
	anchored: 1,
	name: "points checking console",
	desc: "A console used by prisoners to check the progress on their quotas. Simply swipe a prisoner ID.",
	icon: rt.rsc("icons/obj/machines/mining_machines.dmi"),
	icon_state: "console",
	density: 0,
});

// /obj/machinery/mineral/labor_points_checker/proc/attack_hand  (code/modules/mining/laborcamp/laborstacker.dm:155)  may sleep
rt.def("/obj/machinery/mineral/labor_points_checker/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "examinate", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/mineral/labor_points_checker/proc/attackby  (code/modules/mining/laborcamp/laborstacker.dm:158)  may sleep
rt.def("/obj/machinery/mineral/labor_points_checker/proc/attackby", function* attackby(f: Frame) {
	let prisoner_id: Value = null;
	f.vars = () => [prisoner_id];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id/prisoner")) ? 1 : 0))) {
			prisoner_id = live(f.args[0]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'><B>ID: ＀</B></span>", [rt.fv(f, "registered_name", live(prisoner_id))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Points Collected:＀</span>", [rt.fv(f, "points", live(prisoner_id))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>Point Quota: ＀</span>", [rt.fv(f, "goal", live(prisoner_id))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Collect points by bringing smelted minerals to the Labor Shuttle stacking machine. Reach your quota to earn your release.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Error: Invalid ID</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
