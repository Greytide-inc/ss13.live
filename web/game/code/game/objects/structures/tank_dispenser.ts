// From code/game/objects/structures/tank_dispenser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12877, "/obj/structure/tank_dispenser", "/obj/structure", {
	oxygentanks: 10,
	plasmatanks: 10,
	anchored: 1,
	name: "tank dispenser",
	desc: "A simple yet bulky storage device for gas tanks. Holds up to 10 oxygen tanks and 10 plasma tanks.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "dispenser",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/structure/tank_dispenser/proc/Initialize  (code/game/objects/structures/tank_dispenser.dm:22)  may sleep
rt.def("/obj/structure/tank_dispenser/proc/Initialize", function* Initialize(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "oxygentanks"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/oxygen"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "plasmatanks"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/weapon/tank/internals/plasma"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/tank_dispenser/proc/update_icon  (code/game/objects/structures/tank_dispenser.dm:30)
rt.def("/obj/structure/tank_dispenser/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlays", []);
	$0 = rt.sv(f, "oxygentanks");
	if (rt.inRange($0, 1, 3)) {
		rt.callSrc(f, "add_overlay", [fmt("oxygen-＀", [rt.sv(f, "oxygentanks")])]);
	} else if (rt.inRange($0, 4, 10)) {
		rt.callSrc(f, "add_overlay", ["oxygen-4"]);
	}
	$0 = rt.sv(f, "plasmatanks");
	if (rt.inRange($0, 1, 4)) {
		rt.callSrc(f, "add_overlay", [fmt("plasma-＀", [rt.sv(f, "plasmatanks")])]);
	} else if (rt.inRange($0, 5, 10)) {
		rt.callSrc(f, "add_overlay", ["plasma-5"]);
	}
	return f.dot;
});

// /obj/structure/tank_dispenser/proc/attackby  (code/game/objects/structures/tank_dispenser.dm:44)  may sleep
rt.def("/obj/structure/tank_dispenser/proc/attackby", function* attackby(f: Frame) {
	let full: Value = null;
	f.vars = () => [full];
	full = null;
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank/internals/plasma")) ? 1 : 0))) {
		if (rt.lt(rt.sv(f, "plasmatanks"), 10)) {
			rt.incSrcVar(f, "plasmatanks", 1, true);
		} else {
			full = 1;
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tank/internals/oxygen")) ? 1 : 0))) {
			if (rt.lt(rt.sv(f, "oxygentanks"), 10)) {
				rt.incSrcVar(f, "oxygentanks", 1, true);
			} else {
				full = 1;
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
				yield* g.callSrc(f, "default_unfasten_wrench", [null, live(f.args[1]), null, live(f.args[0]), "time", 20], rt.Args.Named);
				return live(f.dot);
			} else {
				if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ does not fit into ＀.</span>", [live(f.args[0]), live(f.src)])]);
					return live(f.dot);
				} else {
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	if (truthy(live(full))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ can't hold any more of ＀.</span>", [live(f.src), live(f.args[0])])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(f.args[0]), live(f.src));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/tank_dispenser/proc/ui_interact  (code/game/objects/structures/tank_dispenser.dm:74)  may sleep
rt.def("/obj/structure/tank_dispenser/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
		state = rt.gl("physical_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "tank_dispenser", rt.sv(f, "name"), 275, 100, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/structure/tank_dispenser/proc/ui_data  (code/game/objects/structures/tank_dispenser.dm:80)
rt.def("/obj/structure/tank_dispenser/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	f.vars = () => [data];
	rt.setAt((data = rt.list()), "oxygen", rt.sv(f, "oxygentanks"));
	rt.setAt(live(data), "plasma", rt.sv(f, "plasmatanks"));
	return live(data);
});

// /obj/structure/tank_dispenser/proc/ui_act  (code/game/objects/structures/tank_dispenser.dm:87)  may sleep
rt.def("/obj/structure/tank_dispenser/proc/ui_act", function* ui_act(f: Frame) {
	let tank: Value = null;
	let $0: any;
	f.vars = () => [tank, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "plasma") {
		if ((truthy((tank = rt.locateIn(f, T("/obj/item/weapon/tank/internals/plasma"), live(f.src)))) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) {
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(tank)]);
			rt.incSrcVar(f, "plasmatanks", -1, true);
		}
		f.dot = 1;
	} else if ($0 === "oxygen") {
		if ((truthy((tank = rt.locateIn(f, T("/obj/item/weapon/tank/internals/oxygen"), live(f.src)))) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) {
			yield* g.callName(f, live(f.usr), "put_in_hands", [live(tank)]);
			rt.incSrcVar(f, "oxygentanks", -1, true);
		}
		f.dot = 1;
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/structure/tank_dispenser/proc/deconstruct  (code/game/objects/structures/tank_dispenser.dm:106)  may sleep
rt.def("/obj/structure/tank_dispenser/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let X: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [disassembled, X, I, $e];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		X = null;
		rt.forList(f, 0, live(f.src));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			yield* g.callName(f, (I = live(X)), "forceMove", [rt.sv(f, "loc")]);
		}
		rt.endFor(f, 0);
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
