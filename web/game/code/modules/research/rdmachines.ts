// From code/modules/research/rdmachines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10965, "/obj/machinery/r_n_d", "/obj/machinery", {
	busy: 0,
	hacked: 0,
	disabled: 0,
	shocked: 0,
	linked_console: null,
	loaded_item: null,
	anchored: 1,
	use_power: 1,
	name: "R&D Device",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	density: 1,
});

// /obj/machinery/r_n_d/proc/Initialize  (code/modules/research/rdmachines.dm:20)  may sleep
rt.def("/obj/machinery/r_n_d/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/r_n_d"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/machinery/r_n_d/proc/Destroy  (code/modules/research/rdmachines.dm:24)  may sleep
rt.def("/obj/machinery/r_n_d/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/r_n_d/proc/shock  (code/modules/research/rdmachines.dm:29)  may sleep
rt.def("/obj/machinery/r_n_d/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	f.vars = () => [user, prb];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	yield* g.call(f, P("/proc/do_sparks"), null, [5, 1, live(f.src)]);
	if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])), live(f.src), 0.699999988079071, 1])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true);

// /obj/machinery/r_n_d/proc/attack_hand  (code/modules/research/rdmachines.dm:41)  may sleep
rt.def("/obj/machinery/r_n_d/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "shocked"))) {
		if (truthy((yield* g.srcCall(f, "shock", live(user), 50)))) {
			return live(f.dot);
		}
	}
	if (!truthy(rt.sv(f, "panel_open"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/proc/attackby  (code/modules/research/rdmachines.dm:50)  may sleep
rt.def("/obj/machinery/r_n_d/proc/attackby", function* attackby(f: Frame) {
	if (truthy(rt.sv(f, "shocked"))) {
		if (truthy((yield* g.srcCall(f, "shock", live(f.args[1]), 50)))) {
			return 1;
		}
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀_t", [rt.initial(f, live(f.src), "icon_state")]), rt.initial(f, live(f.src), "icon_state"), live(f.args[0]))))) {
		if (truthy(rt.sv(f, "linked_console"))) {
			yield* g.srcCall(f, "disconnect_console");
		}
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.srcCall(f, "is_open_container"))) && truthy((yield* g.callName(f, live(f.args[0]), "is_open_container", []))))) {
		return 0;
	}
	if (truthy((yield* g.srcCall(f, "Insert_Item", live(f.args[0]), live(f.args[1]))))) {
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/r_n_d/proc/disconnect_console  (code/modules/research/rdmachines.dm:69)
rt.def("/obj/machinery/r_n_d/proc/disconnect_console", function disconnect_console(f: Frame) {
	rt.setSv(f, "linked_console", null);
	return f.dot;
});

// /obj/machinery/r_n_d/proc/is_insertion_ready  (code/modules/research/rdmachines.dm:78)
rt.def("/obj/machinery/r_n_d/proc/is_insertion_ready", function is_insertion_ready(f: Frame, user: Value) {
	let console: Value = null;
	let $e: any;
	f.vars = () => [console, $e];
	if (truthy(rt.sv(f, "panel_open"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't load the ＀ while it's opened!</span>", [rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "disabled"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "linked_console"))) {
		console = null;
		rt.forList(f, 0, rt.call(f, P("/proc/oview"), null, [3, live(f.src)]), T("/obj/machinery/computer/rdconsole"));
		while (($e = rt.next(f, 0)) !== undefined) {
			console = $e;
			if (truthy(rt.fv(f, "first_use", live(console)))) {
				rt.callName(f, live(console), "SyncRDevices", []);
			}
		}
		rt.endFor(f, 0);
		if (!truthy(rt.sv(f, "linked_console"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ must be linked to an R&D console first!</span>", [rt.sv(f, "name")])]);
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "busy"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is busy right now.</span>", [rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is broken.</span>", [rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ has no power.</span>", [rt.fv(f, "name", live(f.src))])]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "loaded_item"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is already loaded.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	return 1;
});

// /obj/machinery/r_n_d/proc/on_deconstruction  (code/modules/research/rdmachines.dm:108)  may sleep
rt.def("/obj/machinery/r_n_d/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (truthy(rt.sv(f, "loaded_item"))) {
		yield* g.callName(f, rt.sv(f, "loaded_item"), "forceMove", [rt.sv(f, "loc")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
