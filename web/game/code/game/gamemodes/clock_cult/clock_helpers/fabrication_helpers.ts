// From code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/consume_visual  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:12)  may sleep
rt.def("/atom/proc/consume_visual", function* consume_visual(f: Frame, fabricator: Value, power_amount: Value) {
	let B: Value = null;
	f.vars = () => [fabricator, power_amount, B];
	if (!truthy((yield* g.callName(f, live(fabricator), "can_use_power", [live(power_amount)])))) return f.dot;
	rt.setFv(f, "pixel_x", (B = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam/itemconsume"), [rt.getStep(f, live(f.src), 0)]))), rt.sv(f, "pixel_x"));
	rt.setFv(f, "pixel_y", live(B), rt.sv(f, "pixel_y"));
	return f.dot;
}, true);

// /turf/closed/wall/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:19)
rt.def("/turf/closed/wall/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1050, "spawn_dir", 2]);
});

// /turf/closed/wall/mineral/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:22)
rt.def("/turf/closed/wall/mineral/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1150, "spawn_dir", 2]);
});

// /turf/closed/wall/mineral/iron/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:25)
rt.def("/turf/closed/wall/mineral/iron/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1025, "spawn_dir", 2]);
});

// /turf/closed/wall/mineral/cult/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:28)
rt.def("/turf/closed/wall/mineral/cult/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 80, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1250, "spawn_dir", 2]);
});

rt.type(4440, "/turf/closed/wall/shuttle", "/turf/closed/wall", {});

// /turf/closed/wall/shuttle/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:31)
rt.def("/turf/closed/wall/shuttle/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1150, "spawn_dir", 2]);
});

// /turf/closed/wall/clockwork/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:37)
rt.def("/turf/closed/wall/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/turf/open/floor/clockwork"), "power_cost", -1000, "spawn_dir", 2]);
});

// /turf/open/floor/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:40)  may sleep
rt.def("/turf/open/floor/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	f.vars = () => [user, fabricator, silent];
	if (isEqual(rt.sv(f, "floor_tile"), T("/obj/item/stack/tile/plasteel"))) {
		yield* g.new_(f, rt.sv(f, "floor_tile"), [live(f.src)]);
		yield* g.srcCall(f, "make_plating");
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/crowbar.ogg"), 10, 1]);
	}
	return rt.alist(f, ["operation_time", 30, "new_obj_type", T("/turf/open/floor/clockwork"), "power_cost", 250, "spawn_dir", 2]);
}, true);

// /turf/open/floor/clockwork/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:56)
rt.def("/turf/open/floor/clockwork/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let operation_time: Value = null;
	f.vars = () => [operation_time];
	if (truthy(rt.locateIn(f, T("/obj/structure/table"), live(f.src)))) {
		return 0;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/falsewall"), rt.sv(f, "contents")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is a false wall in the way, preventing you from fabricating a clockwork wall on ＀.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy(rt.call(f, P("/proc/is_blocked_turf"), null, [live(f.src), 1]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Something is in the way, preventing you from fabricating a clockwork wall on ＀.</span>", [live(f.src)])]);
		return 1;
	}
	operation_time = 100;
	if ((!truthy(rt.gl("ratvar_awakens")) && rt.gt(rt.fv(f, "speed_multiplier", live(fabricator)), 0))) {
		(operation_time = rt.modify(live(operation_time), rt.fv(f, "speed_multiplier", live(fabricator)), divide));
	}
	return rt.alist(f, ["operation_time", live(operation_time), "new_obj_type", T("/turf/closed/wall/clockwork"), "power_cost", 1000, "spawn_dir", 2]);
});

// /obj/structure/falsewall/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:72)
rt.def("/obj/structure/falsewall/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let cost: Value = null;
	f.vars = () => [cost];
	cost = 1000;
	if (truthy(rt.call(f, P("/proc/ispath"), null, [rt.sv(f, "mineral"), T("/obj/item/stack/sheet/metal")]))) {
		(cost = rt.modify(live(cost), multiply(50, add(2, rt.sv(f, "mineral_amount"))), subtract));
	} else {
		(cost = rt.modify(live(cost), 100, subtract));
	}
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/obj/structure/falsewall/brass"), "power_cost", live(cost), "spawn_dir", 2]);
});

// /obj/structure/falsewall/iron/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:79)
rt.def("/obj/structure/falsewall/iron/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 50, "new_obj_type", T("/obj/structure/falsewall/brass"), "power_cost", 850, "spawn_dir", 2]);
});

// /obj/item/stack/tile/plasteel/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:91)  may sleep
rt.def("/obj/item/stack/tile/plasteel/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let amount_temp: Value = null, no_delete: Value = null;
	f.vars = () => [user, fabricator, silent, amount_temp, no_delete];
	if (truthy(rt.sv(f, "source"))) {
		return 0;
	}
	amount_temp = (yield* g.srcCall(f, "get_amount"));
	no_delete = 0;
	if (rt.lt(live(amount_temp), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need at least <b>2</b> floor tiles to convert into power.</span>"]);
		return 1;
	}
	if (truthy((yield* g.call(f, P("/proc/IsOdd"), null, [live(amount_temp)])))) {
		amount_temp = rt.inc(live(amount_temp), -1);
		no_delete = 1;
		yield* g.srcCall(f, "use", live(amount_temp));
	}
	(amount_temp = rt.modify(live(amount_temp), 12.5, multiply));
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(amount_temp));
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", rt.neg(live(amount_temp)), "spawn_dir", 2, "no_target_deletion", live(no_delete)]);
}, true);

// /obj/item/stack/rods/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:107)  may sleep
rt.def("/obj/item/stack/rods/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let power_amount: Value = null;
	f.vars = () => [user, fabricator, silent, power_amount];
	if (truthy(rt.sv(f, "source"))) {
		return 0;
	}
	power_amount = rt.neg(multiply(rt.sv(f, "amount"), 25));
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(power_amount));
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", live(power_amount), "spawn_dir", 2]);
}, true);

// /obj/item/stack/sheet/metal/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:114)  may sleep
rt.def("/obj/item/stack/sheet/metal/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let power_amount: Value = null;
	f.vars = () => [user, fabricator, silent, power_amount];
	if (truthy(rt.sv(f, "source"))) {
		return 0;
	}
	power_amount = rt.neg(multiply(rt.sv(f, "amount"), 50));
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(power_amount));
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", live(power_amount), "spawn_dir", 2]);
}, true);

// /obj/item/stack/sheet/plasteel/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:121)  may sleep
rt.def("/obj/item/stack/sheet/plasteel/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let power_amount: Value = null;
	f.vars = () => [user, fabricator, silent, power_amount];
	if (truthy(rt.sv(f, "source"))) {
		return 0;
	}
	power_amount = rt.neg(multiply(rt.sv(f, "amount"), 125));
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(power_amount));
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", live(power_amount), "spawn_dir", 2]);
}, true);

// /obj/item/stack/tile/brass/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:129)  may sleep
rt.def("/obj/item/stack/tile/brass/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let power_amount: Value = null;
	f.vars = () => [user, fabricator, silent, power_amount];
	if (truthy(rt.sv(f, "source"))) {
		return 0;
	}
	power_amount = rt.neg(multiply(rt.sv(f, "amount"), 250));
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(power_amount));
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", live(power_amount), "spawn_dir", 2]);
}, true);

// /obj/machinery/door/airlock/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:135)
rt.def("/obj/machinery/door/airlock/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let doortype: Value = null;
	f.vars = () => [doortype];
	doortype = T("/obj/machinery/door/airlock/clockwork");
	if (truthy(rt.sv(f, "glass"))) {
		doortype = T("/obj/machinery/door/airlock/clockwork/brass");
	}
	return rt.alist(f, ["operation_time", 60, "new_obj_type", live(doortype), "power_cost", 1250, "spawn_dir", rt.sv(f, "dir")]);
});

// /obj/structure/table/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:146)
rt.def("/obj/structure/table/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = null;
	f.vars = () => [fabrication_cost];
	fabrication_cost = 500;
	if (isEqual(rt.sv(f, "framestack"), T("/obj/item/stack/rods"))) {
		(fabrication_cost = rt.modify(live(fabrication_cost), multiply(25, rt.sv(f, "framestackamount")), subtract));
	} else {
		if (isEqual(rt.sv(f, "framestack"), T("/obj/item/stack/tile/brass"))) {
			(fabrication_cost = rt.modify(live(fabrication_cost), multiply(250, rt.sv(f, "framestackamount")), subtract));
		}
	}
	if (isEqual(rt.sv(f, "buildstack"), T("/obj/item/stack/sheet/metal"))) {
		(fabrication_cost = rt.modify(live(fabrication_cost), multiply(50, rt.sv(f, "buildstackamount")), subtract));
	} else {
		if (isEqual(rt.sv(f, "buildstack"), T("/obj/item/stack/sheet/plasteel"))) {
			(fabrication_cost = rt.modify(live(fabrication_cost), multiply(125, rt.sv(f, "buildstackamount")), subtract));
		}
	}
	return rt.alist(f, ["operation_time", 20, "new_obj_type", T("/obj/structure/table/reinforced/brass"), "power_cost", live(fabrication_cost), "spawn_dir", 2]);
});

// /obj/structure/table_frame/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:161)
rt.def("/obj/structure/table_frame/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = null;
	f.vars = () => [fabrication_cost];
	fabrication_cost = 250;
	if (isEqual(rt.sv(f, "framestack"), T("/obj/item/stack/rods"))) {
		(fabrication_cost = rt.modify(live(fabrication_cost), multiply(25, rt.sv(f, "framestackamount")), subtract));
	} else {
		if (isEqual(rt.sv(f, "framestack"), T("/obj/item/stack/tile/brass"))) {
			(fabrication_cost = rt.modify(live(fabrication_cost), multiply(250, rt.sv(f, "framestackamount")), subtract));
		}
	}
	return rt.alist(f, ["operation_time", 10, "new_obj_type", T("/obj/structure/table_frame/brass"), "power_cost", live(fabrication_cost), "spawn_dir", 2]);
});

// /obj/structure/window/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:172)
rt.def("/obj/structure/window/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let windowtype: Value = null, new_dir: Value = null, fabrication_time: Value = null, fabrication_cost: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [windowtype, new_dir, fabrication_time, fabrication_cost, G, $e];
	windowtype = T("/obj/structure/window/reinforced/clockwork");
	new_dir = 1;
	fabrication_time = 15;
	fabrication_cost = 250;
	if (truthy(rt.sv(f, "fulltile"))) {
		windowtype = T("/obj/structure/window/reinforced/clockwork/fulltile");
		new_dir = 0;
		fabrication_time = 30;
		fabrication_cost = 500;
		if (truthy(rt.sv(f, "reinf"))) {
			(fabrication_cost = rt.modify(live(fabrication_cost), 25, subtract));
		}
	}
	if (truthy(rt.sv(f, "reinf"))) {
		(fabrication_cost = rt.modify(live(fabrication_cost), 25, subtract));
	}
	G = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/structure/grille"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(fabricator), P("/obj/item/clockwork/replica_fabricator/proc/fabricate"), live(G), live(user)]);
	}
	rt.endFor(f, 0);
	return rt.alist(f, ["operation_time", live(fabrication_time), "new_obj_type", live(windowtype), "power_cost", live(fabrication_cost), "spawn_dir", rt.sv(f, "dir"), "dir_in_new", live(new_dir)]);
});

// /obj/machinery/door/window/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:194)
rt.def("/obj/machinery/door/window/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 30, "new_obj_type", T("/obj/machinery/door/window/clockwork"), "power_cost", 500, "spawn_dir", rt.sv(f, "dir"), "dir_in_new", 1]);
});

// /obj/structure/grille/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:201)
rt.def("/obj/structure/grille/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let grilletype: Value = null, fabrication_time: Value = null;
	f.vars = () => [grilletype, fabrication_time];
	grilletype = T("/obj/structure/grille/ratvar");
	fabrication_time = 15;
	if (truthy(rt.sv(f, "broken"))) {
		grilletype = T("/obj/structure/grille/ratvar/broken");
		fabrication_time = 5;
	}
	return rt.alist(f, ["operation_time", live(fabrication_time), "new_obj_type", live(grilletype), "power_cost", 0, "spawn_dir", rt.sv(f, "dir")]);
});

// /obj/structure/lattice/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:213)
rt.def("/obj/structure/lattice/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 0, "new_obj_type", T("/obj/structure/lattice/clockwork"), "power_cost", 0, "spawn_dir", 2, "no_target_deletion", 1]);
});

// /obj/structure/lattice/clockwork/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:216)  may sleep
rt.def("/obj/structure/lattice/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	f.vars = () => [user, fabricator, silent];
	yield* g.srcCall(f, "ratvar_act");
	return 0;
}, true);

// /obj/structure/lattice/catwalk/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:220)
rt.def("/obj/structure/lattice/catwalk/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	return rt.alist(f, ["operation_time", 0, "new_obj_type", T("/obj/structure/lattice/catwalk/clockwork"), "power_cost", 0, "spawn_dir", 2, "no_target_deletion", 1]);
});

// /obj/structure/girder/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:228)
rt.def("/obj/structure/girder/proc/fabrication_vals", function fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let fabrication_cost: Value = null;
	f.vars = () => [fabrication_cost];
	fabrication_cost = 650;
	if ((isEqual(rt.sv(f, "state"), 1) || isEqual(rt.sv(f, "state"), 2))) {
		(fabrication_cost = rt.modify(live(fabrication_cost), 125, subtract));
	}
	return rt.alist(f, ["operation_time", 20, "new_obj_type", T("/obj/structure/destructible/clockwork/wall_gear"), "power_cost", live(fabrication_cost), "spawn_dir", 2]);
});

// /obj/structure/destructible/clockwork/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:235)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let repair_values: Value = null;
	f.vars = () => [user, fabricator, silent, repair_values];
	f.dot = 1;
	repair_values = rt.list();
	if (!truthy((yield* g.callName(f, live(fabricator), "fabricator_repair_checks", [live(repair_values), live(f.src), live(user)])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀'s ＀ starts covering ＀ in glowing orange energy...</span>", [live(user), rt.fv(f, "name", live(fabricator)), live(f.src)]), fmt("<span class='alloy'>You start repairing ＀...</span>", [live(f.src)])]);
	rt.setFv(f, "repairing", live(fabricator), live(f.src));
	while ((truthy(live(fabricator)) && truthy(live(user))) && truthy(live(f.src))) {
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.at(live(repair_values), "healing_for_cycle"), rt.fv(f, "speed_multiplier", live(fabricator))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(fabricator), P("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks"), live(repair_values), live(f.src), live(user), 1]))], rt.Args.Named)))) {
			break;
		}
		rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "obj_integrity"), rt.at(live(repair_values), "healing_for_cycle")), rt.sv(f, "max_integrity")]))])));
		yield* g.callName(f, live(fabricator), "modify_stored_power", [rt.neg(rt.at(live(repair_values), "power_required"))]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	}
	if (!truthy(live(fabricator))) return f.dot;
	rt.setFv(f, "repairing", live(fabricator), null);
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀'s ＀ stops covering ＀ with glowing orange energy.</span>", [live(user), rt.fv(f, "name", live(fabricator)), live(f.src)]), fmt("<span class='alloy'>You finish repairing ＀. It is now at <b>＀/＀</b> integrity.</span>", [live(f.src), rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")])]);
	return f.dot;
}, true);

// /obj/effect/clockwork/sigil/transmission/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:258)  may sleep
rt.def("/obj/effect/clockwork/sigil/transmission/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let charge_values: Value = null;
	f.vars = () => [user, fabricator, silent, charge_values];
	f.dot = 1;
	charge_values = rt.list();
	if (!truthy((yield* g.callName(f, live(fabricator), "sigil_charge_checks", [live(charge_values), live(f.src), live(user)])))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀'s ＀ starts draining glowing orange energy from ＀...</span>", [live(user), rt.fv(f, "name", live(fabricator)), live(f.src)]), fmt("<span class='alloy'>You start recharging your ＀...</span>", [rt.fv(f, "name", live(fabricator))])]);
	rt.setFv(f, "recharging", live(fabricator), live(f.src));
	while ((truthy(live(fabricator)) && truthy(live(user))) && truthy(live(f.src))) {
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 10, "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(fabricator), P("/obj/item/clockwork/replica_fabricator/proc/sigil_charge_checks"), live(charge_values), live(f.src), live(user), 1]))], rt.Args.Named)))) {
			break;
		}
		yield* g.srcCall(f, "modify_charge", rt.at(live(charge_values), "power_gain"));
		yield* g.callName(f, live(fabricator), "modify_stored_power", [rt.at(live(charge_values), "power_gain")]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/light_flicker.ogg"), multiply(rt.at(live(charge_values), "power_gain"), 0.10000000149011612), 1]);
	}
	if (!truthy(live(fabricator))) return f.dot;
	rt.setFv(f, "recharging", live(fabricator), null);
	if (!truthy(live(user))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀'s ＀ stops draining glowing orange energy from ＀.</span>", [live(user), rt.fv(f, "name", live(fabricator)), live(f.src)]), fmt("<span class='alloy'>You finish recharging your ＀. It now contains <b>＀W/＀W</b> power.</span>", [rt.fv(f, "name", live(fabricator)), (yield* g.callName(f, live(fabricator), "get_power", [])), (yield* g.callName(f, live(fabricator), "get_max_power", []))])]);
	return f.dot;
}, true);

// /mob/living/proc/fabricator_heal  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:279)  may sleep
rt.def("/mob/living/proc/fabricator_heal", function* fabricator_heal(f: Frame, user: Value, fabricator: Value) {
	let repair_values: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [user, fabricator, repair_values, $0, $1, $2, $3];
	repair_values = rt.list();
	if (!truthy((yield* g.callName(f, live(fabricator), "fabricator_repair_checks", [live(repair_values), live(f.src), live(user)])))) {
		return live(f.dot);
	}
	$0 = live(user);
	$1 = live(user);
	$2 = rt.fv(f, "name", live(fabricator));
	if (isEqual(live(f.src), live(user))) {
		$3 = fmt("g ＀", [(yield* g.callName(f, live(user), "p_them", []))]);
	} else {
		$3 = fmt("g ＀", [live(f.src)]);
	}
	$1 = fmt("<span class='notice'>＀'s ＀ starts coverin＀ in glowing orange energy...</span>", [$1, $2, $3]);
	if (isEqual(live(f.src), live(user))) {
		$2 = "g yourself";
	} else {
		$2 = fmt("g ＀", [live(f.src)]);
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='alloy'>You start repairin＀...</span>", [$2])]);
	rt.setFv(f, "repairing", live(fabricator), live(f.src));
	while ((truthy(live(fabricator)) && truthy(live(user))) && truthy(live(f.src))) {
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.at(live(repair_values), "healing_for_cycle"), rt.fv(f, "speed_multiplier", live(fabricator))), "target", live(f.src), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [live(fabricator), P("/obj/item/clockwork/replica_fabricator/proc/fabricator_repair_checks"), live(repair_values), live(f.src), live(user), 1]))], rt.Args.Named)))) {
			break;
		}
		yield* g.srcCall(f, "fabricator_heal_tick", rt.at(live(repair_values), "healing_for_cycle"));
		yield* g.callName(f, live(fabricator), "modify_stored_power", [rt.neg(rt.at(live(repair_values), "power_required"))]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	}
	if (truthy(live(fabricator))) {
		rt.setFv(f, "repairing", live(fabricator), null);
	}
	return 1;
}, true);

// /mob/living/proc/fabricator_heal_tick  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:300)  may sleep
rt.def("/mob/living/proc/fabricator_heal_tick", function* fabricator_heal_tick(f: Frame, amount: Value) {
	f.vars = () => [amount];
	yield* g.srcCall(f, "heal_ordered_damage", live(amount), rt.gl("damage_heal_order#2"));
	return f.dot;
}, true);

// /mob/living/simple_animal/proc/fabricator_heal_tick  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:303)  may sleep
rt.def("/mob/living/simple_animal/proc/fabricator_heal_tick", function* fabricator_heal_tick(f: Frame, amount: Value) {
	f.vars = () => [amount];
	yield* g.srcCall(f, "adjustHealth", rt.neg(live(amount)));
	return f.dot;
}, true);

// /mob/living/silicon/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:308)  may sleep
rt.def("/mob/living/silicon/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [user, fabricator, silent, $0, $1, $2, $3];
	f.dot = 1;
	if (isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		return 0;
	} else {
		if (!(truthy((yield* g.srcCall(f, "fabricator_heal", live(user), live(fabricator)))) && truthy(live(user)))) return f.dot;
		$0 = live(user);
		$1 = live(user);
		$2 = rt.fv(f, "name", live(fabricator));
		if (isEqual(live(f.src), live(user))) {
			$3 = fmt("g ＀", [(yield* g.callName(f, live(user), "p_them", []))]);
		} else {
			$3 = fmt("g ＀", [live(f.src)]);
		}
		$1 = fmt("<span class='notice'>＀'s ＀ stops coverin＀ with glowing orange energy.</span>", [$1, $2, $3]);
		if (isEqual(live(f.src), live(user))) {
			$2 = "g yourself. You are";
		} else {
			$2 = fmt("g ＀. ＀ ＀", [live(f.src), (yield* g.srcCall(f, "p_they", 1)), (yield* g.srcCall(f, "p_are"))]);
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='alloy'>You finish repairin＀ now at <b>＀/＀</b> health.</span>", [$2, rt.op(f, "Abs", [], [subtract(-100, rt.sv(f, "health"))]), rt.op(f, "Abs", [], [subtract(-100, rt.sv(f, "maxHealth"))])])]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:317)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [user, fabricator, silent, $0, $1, $2, $3];
	f.dot = 1;
	if (isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		return 0;
	} else {
		if (!(truthy((yield* g.srcCall(f, "fabricator_heal", live(user), live(fabricator)))) && truthy(live(user)))) return f.dot;
		$0 = live(user);
		$1 = live(user);
		$2 = rt.fv(f, "name", live(fabricator));
		if (isEqual(live(f.src), live(user))) {
			$3 = fmt("g ＀", [(yield* g.callName(f, live(user), "p_them", []))]);
		} else {
			$3 = fmt("g ＀", [live(f.src)]);
		}
		$1 = fmt("<span class='notice'>＀'s ＀ stops coverin＀ with glowing orange energy.</span>", [$1, $2, $3]);
		if (isEqual(live(f.src), live(user))) {
			$2 = "g yourself. You are";
		} else {
			$2 = fmt("g ＀. ＀ ＀", [live(f.src), (yield* g.srcCall(f, "p_they", 1)), (yield* g.srcCall(f, "p_are"))]);
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='alloy'>You finish repairin＀ now at <b>＀/＀</b> health.</span>", [$2, rt.sv(f, "health"), rt.sv(f, "maxHealth")])]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/drone/cogscarab/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:326)  may sleep
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [user, fabricator, silent, $0, $1, $2, $3];
	f.dot = 1;
	if (isEqual(rt.sv(f, "stat"), 2)) {
		yield* g.srcCall(f, "try_reactivate", live(user));
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		return 0;
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "flags"), 4096))) return f.dot;
		$0 = live(user);
		$1 = live(user);
		$2 = rt.fv(f, "name", live(fabricator));
		if (isEqual(live(f.src), live(user))) {
			$3 = fmt("g ＀", [(yield* g.callName(f, live(user), "p_them", []))]);
		} else {
			$3 = fmt("g ＀", [live(f.src)]);
		}
		$1 = fmt("<span class='notice'>＀'s ＀ starts coverin＀ in glowing orange energy...</span>", [$1, $2, $3]);
		if (isEqual(live(f.src), live(user))) {
			$2 = "g yourself";
		} else {
			$2 = fmt("g ＀", [live(f.src)]);
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='alloy'>You start repairin＀...</span>", [$2])]);
		rt.setFv(f, "repairing", live(fabricator), live(f.src));
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(subtract(rt.sv(f, "maxHealth"), rt.sv(f, "health")), 2), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.srcCall(f, "adjustHealth", rt.neg(rt.sv(f, "maxHealth")));
			$0 = live(user);
			$1 = live(user);
			$2 = rt.fv(f, "name", live(fabricator));
			if (isEqual(live(f.src), live(user))) {
				$3 = fmt("g ＀", [(yield* g.callName(f, live(user), "p_them", []))]);
			} else {
				$3 = fmt("g ＀", [live(f.src)]);
			}
			$1 = fmt("<span class='notice'>＀'s ＀ stops coverin＀ with glowing orange energy.</span>", [$1, $2, $3]);
			if (isEqual(live(f.src), live(user))) {
				$2 = "g yourself";
			} else {
				$2 = fmt("g ＀", [live(f.src)]);
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='alloy'>You finish repairin＀.</span>", [$2])]);
		}
		if (!truthy(live(fabricator))) return f.dot;
		rt.setFv(f, "repairing", live(fabricator), null);
	}
	return f.dot;
}, true);

// /obj/item/clockwork/alloy_shards/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:344)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/proc/fabrication_vals", function* fabrication_vals(f: Frame, user: Value, fabricator: Value, silent: Value, power_amount: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [user, fabricator, silent, power_amount, S, $e];
	if (!truthy(live(power_amount))) {
		power_amount = -500;
	}
	yield* g.srcCall(f, "consume_visual", live(fabricator), live(power_amount));
	if (!truthy(live(silent))) {
		S = null;
		rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/item/clockwork/alloy_shards"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			if (isEqual(live(S), live(f.src))) {
				continue;
			}
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(fabricator), P("/obj/item/clockwork/replica_fabricator/proc/fabricate"), live(S), live(user), 1])), 0]);
		}
		rt.endFor(f, 0);
	}
	return rt.alist(f, ["operation_time", 0, "new_obj_type", null, "power_cost", live(power_amount), "spawn_dir", 2]);
}, true);

rt.type(8931, "/obj/item/clockwork/alloy_shards/medium/gear_bit/large", "/obj/item/clockwork/alloy_shards/medium/gear_bit", {});

// /obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:355)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/medium/gear_bit/large/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!truthy(live(f.args[3]))) {
		f.args[3] = -200;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8932, "/obj/item/clockwork/alloy_shards/large", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	icon_state: "shard_large",
	sprite_shift: 9,
});

// /obj/item/clockwork/alloy_shards/large/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:360)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/large/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!truthy(live(f.args[3]))) {
		f.args[3] = -150;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8929, "/obj/item/clockwork/alloy_shards/medium", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	icon_state: "shard_medium",
	sprite_shift: 10,
});

// /obj/item/clockwork/alloy_shards/medium/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:365)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/medium/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!truthy(live(f.args[3]))) {
		f.args[3] = -100;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });

rt.type(8933, "/obj/item/clockwork/alloy_shards/small", "/obj/item/clockwork/alloy_shards", {
	w_class: 1,
	randomsinglesprite: 1,
	randomspritemax: 3,
	icon_state: "shard_small",
	sprite_shift: 12,
});

// /obj/item/clockwork/alloy_shards/small/proc/fabrication_vals  (code/game/gamemodes/clock_cult/clock_helpers/fabrication_helpers.dm:370)  may sleep
rt.def("/obj/item/clockwork/alloy_shards/small/proc/fabrication_vals", function* fabrication_vals(f: Frame) {
	if (!truthy(live(f.args[3]))) {
		f.args[3] = -50;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "fabricator", "silent", "power_amount"] });
