// From code/game/machinery/gulag_item_reclaimer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10794, "/obj/machinery/gulag_item_reclaimer", "/obj/machinery", {
	stored_items: null,
	inserted_id: null,
	linked_teleporter: null,
	anchored: 1,
	name: "equipment reclaimer station",
	desc: "Used to reclaim your items after you finish your sentence at the labor camp",
	icon: rt.rsc("icons/obj/terminals.dmi"),
	icon_state: "dorm_taken",
	req_access: null,
	density: 0,
	use_power: 1,
	idle_power_usage: 100,
	active_power_usage: 2500,
});

// /obj/machinery/gulag_item_reclaimer/proc/<init>  (code/game/machinery/gulag_item_reclaimer.dm:12)
rt.def("/obj/machinery/gulag_item_reclaimer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stored_items", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(1));
	return f.dot;
});

// /obj/machinery/gulag_item_reclaimer/proc/Destroy  (code/game/machinery/gulag_item_reclaimer.dm:17)  may sleep
rt.def("/obj/machinery/gulag_item_reclaimer/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [i, I, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, (I = live(i)), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "linked_teleporter"))) {
		rt.setFv(f, "linked_reclaimer", rt.sv(f, "linked_teleporter"), null);
	}
	if (truthy(rt.sv(f, "inserted_id"))) {
		yield* g.callName(f, rt.sv(f, "inserted_id"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		rt.setSv(f, "inserted_id", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/gulag_item_reclaimer/proc/emag_act  (code/game/machinery/gulag_item_reclaimer.dm:28)
rt.def("/obj/machinery/gulag_item_reclaimer/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "req_access", rt.list());
	rt.setSv(f, "emagged", 1);
	return f.dot;
});

// /obj/machinery/gulag_item_reclaimer/proc/attackby  (code/game/machinery/gulag_item_reclaimer.dm:33)  may sleep
rt.def("/obj/machinery/gulag_item_reclaimer/proc/attackby", function* attackby(f: Frame) {
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
}, true, { args: ["I", "user"] });

// /obj/machinery/gulag_item_reclaimer/proc/ui_interact  (code/game/machinery/gulag_item_reclaimer.dm:47)  may sleep
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "gulag_item_reclaimer", rt.sv(f, "name"), 455, 440, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/gulag_item_reclaimer/proc/ui_data  (code/game/machinery/gulag_item_reclaimer.dm:53)
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, can_reclaim: Value = null, mobs: Value = null, i: Value = null, thismob: Value = null, mob_info: Value = null;
	let $e: any;
	f.vars = () => [data, can_reclaim, mobs, i, thismob, mob_info, $e];
	data = rt.list();
	can_reclaim = 0;
	if (truthy(rt.callSrc(f, "allowed", [live(user)]))) {
		can_reclaim = 1;
	}
	if (truthy(rt.sv(f, "inserted_id"))) {
		rt.setAt(live(data), "id", rt.sv(f, "inserted_id"));
		rt.setAt(live(data), "id_name", rt.fv(f, "registered_name", rt.sv(f, "inserted_id")));
		if (rt.ge(rt.fv(f, "points", rt.sv(f, "inserted_id")), rt.fv(f, "goal", rt.sv(f, "inserted_id")))) {
			can_reclaim = 1;
		}
	}
	mobs = rt.list();
	i = null;
	rt.forList(f, 0, rt.sv(f, "stored_items"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		thismob = live(i);
		rt.setAt((mob_info = rt.list()), "name", rt.fv(f, "real_name", live(thismob)));
		rt.setAt(live(mob_info), "mob", fmt("＃", [live(thismob)]));
		mobs = rt.modify(live(mobs), rt.list(live(mob_info)), add);
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "mobs", live(mobs));
	rt.setAt(live(data), "can_reclaim", live(can_reclaim));
	return live(data);
});

// /obj/machinery/gulag_item_reclaimer/proc/ui_act  (code/game/machinery/gulag_item_reclaimer.dm:81)  may sleep
rt.def("/obj/machinery/gulag_item_reclaimer/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let I: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [action, params, ui, I, M, $0];
	// An href can reach this with the window closed or out of reach: only an interactive window may act.
	if (!truthy(live(ui)) || !isEqual(rt.fv(f, "status", live(ui)), 2)) {
		return 1;
	}
	$0 = live(action);
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
	} else if ($0 === "release_items") {
		if ((isEqual((M = rt.locateIn(f, rt.at(live(params), "mobref"), rt.world())), live(f.usr)) || truthy((yield* g.srcCall(f, "allowed", live(f.usr)))))) {
			yield* g.srcCall(f, "drop_items", live(M));
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Access denied."]);
		}
	}
	return f.dot;
}, true);

// /obj/machinery/gulag_item_reclaimer/proc/drop_items  (code/game/machinery/gulag_item_reclaimer.dm:105)  may sleep
rt.def("/obj/machinery/gulag_item_reclaimer/proc/drop_items", function* drop_items(f: Frame, user: Value) {
	let i: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [user, i, W, $e];
	if (!truthy(rt.index(rt.sv(f, "stored_items"), live(user)))) {
		return live(f.dot);
	}
	i = null;
	rt.forList(f, 0, rt.index(rt.sv(f, "stored_items"), live(user)));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		W = live(i);
		(rt.modAt(rt.sv(f, "stored_items"), live(user), live(W), subtract));
		yield* g.callName(f, live(W), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "stored_items", live(user), subtract));
	return f.dot;
}, true);
