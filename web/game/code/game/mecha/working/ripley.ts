// From code/game/mecha/working/ripley.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12120, "/obj/mecha/working/ripley", "/obj/mecha/working", {
	hi_pres_step_in: 4,
	lo_pres_step_in: 2,
	cargo_capacity: 15,
	hides: 0,
	cargo: null,
	step_in: 4,
	max_temperature: 20000,
	lights_power: 7,
	deflect_chance: 15,
	max_equip: 6,
	desc: "Autonomous Power Loader Unit. This newer model is refitted with powerful armour against the dangers of the EVA mining process.",
	name: "１APLU \"Ripley\"",
	icon_state: "ripley",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley"),
});

// /obj/mecha/working/ripley/proc/<init>  (code/game/mecha/working/ripley.dm:13)  may sleep
rt.def("/obj/mecha/working/ripley/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 20, "laser", 10, "energy", 20, "bomb", 40, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "cargo", (yield* g.new_(f, T("/list"), [])));
	return f.dot;
}, true);

// /obj/mecha/working/ripley/proc/Move  (code/game/mecha/working/ripley.dm:21)  may sleep
rt.def("/obj/mecha/working/ripley/proc/Move", function* Move(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		yield* g.srcCall(f, "collect_ore");
	}
	yield* g.srcCall(f, "update_pressure");
	return f.dot;
}, true);

// /obj/mecha/working/ripley/proc/collect_ore  (code/game/mecha/working/ripley.dm:27)  may sleep
rt.def("/obj/mecha/working/ripley/proc/collect_ore", function* collect_ore(f: Frame) {
	let ore_box: Value = null, ore: Value = null;
	let $e: any;
	f.vars = () => [ore_box, ore, $e];
	if (!truthy(rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"), rt.sv(f, "equipment")))) return f.dot;
	if (!truthy((ore_box = rt.locateIn(f, T("/obj/structure/ore_box"), rt.sv(f, "cargo"))))) return f.dot;
	ore = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/obj/item/weapon/ore"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ore = $e;
		if ((truthy((yield* g.callName(f, live(ore), "Adjacent", [live(f.src)]))) && (truthy(rt.bitAnd(rt.getDir(f, live(f.src), live(ore)), rt.sv(f, "dir"))) || isEqual(rt.fv(f, "loc", live(ore)), rt.sv(f, "loc"))))) {
			yield* g.callName(f, live(ore), "forceMove", [live(ore_box)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/mecha/working/ripley/proc/Destroy  (code/game/mecha/working/ripley.dm:35)  may sleep
rt.def("/obj/mecha/working/ripley/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [i, A, $e];
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "hides"))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/animalhide/goliath_hide"), [rt.sv(f, "loc")]);
		i = rt.inc(live(i), 1);
	}
	A = null;
	rt.forList(f, 0, rt.sv(f, "cargo"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/step_rand"), null, [live(A)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "cargo"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/mecha/working/ripley/proc/go_out  (code/game/mecha/working/ripley.dm:44)  may sleep
rt.def("/obj/mecha/working/ripley/proc/go_out", function* go_out(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/mecha/working/ripley/proc/moved_inside  (code/game/mecha/working/ripley.dm:48)  may sleep
rt.def("/obj/mecha/working/ripley/proc/moved_inside", function* moved_inside(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["H"] });

// /obj/mecha/working/ripley/proc/update_icon  (code/game/mecha/working/ripley.dm:52)
rt.def("/obj/mecha/working/ripley/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "hides"))) return f.dot;
	rt.callSrc(f, "cut_overlays", []);
	if (rt.lt(rt.sv(f, "hides"), 3)) {
		if (truthy(rt.sv(f, "occupant"))) {
			$0 = "ripley-g";
		} else {
			$0 = "ripley-g-open";
		}
		rt.callSrc(f, "add_overlay", [$0]);
	} else {
		if (truthy(rt.sv(f, "occupant"))) {
			$0 = "ripley-g-full";
		} else {
			$0 = "ripley-g-full-open";
		}
		rt.callSrc(f, "add_overlay", [$0]);
	}
	return f.dot;
});

rt.type(12121, "/obj/mecha/working/ripley/firefighter", "/obj/mecha/working/ripley", {
	max_temperature: 65000,
	lights_power: 7,
	max_equip: 5,
	desc: "Autonomous Power Loader Unit. This model is refitted with additional thermal protection.",
	name: "１APLU \"Firefighter\"",
	icon_state: "firefighter",
	obj_integrity: 250,
	max_integrity: 250,
	resistance_flags: 35,
	armor: null,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley/firefighter"),
});

// /obj/mecha/working/ripley/firefighter/proc/<init>  (code/game/mecha/working/ripley.dm:70)  may sleep
rt.def("/obj/mecha/working/ripley/firefighter/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 40, "bullet", 30, "laser", 30, "energy", 30, "bomb", 60, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
}, true);

rt.type(12122, "/obj/mecha/working/ripley/deathripley", "/obj/mecha/working/ripley", {
	hi_pres_step_in: 3,
	lights_power: 7,
	step_energy_drain: 0,
	desc: "OH SHIT IT'S THE DEATHSQUAD WE'RE ALL GONNA DIE",
	name: "１DEATH-RIPLEY",
	icon_state: "deathripley",
	opacity: 0,
	wreckage: rt.typePath("/obj/structure/mecha_wreckage/ripley/deathripley"),
});

// /obj/mecha/working/ripley/deathripley/proc/New  (code/game/mecha/working/ripley.dm:86)  may sleep
rt.def("/obj/mecha/working/ripley/deathripley/proc/New", function* New(f: Frame) {
	let ME: Value = null;
	f.vars = () => [ME];
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (ME = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp/kill"), []))), "attach", [live(f.src)]);
	return live(f.dot);
}, true);

rt.type(12123, "/obj/mecha/working/ripley/mining", "/obj/mecha/working/ripley", {
	desc: "An old, dusty mining Ripley.",
	name: "１APLU \"Miner\"",
	obj_integrity: 75,
});

// /obj/mecha/working/ripley/mining/proc/Initialize  (code/game/mecha/working/ripley.dm:97)  may sleep
rt.def("/obj/mecha/working/ripley/mining/proc/Initialize", function* Initialize(f: Frame) {
	let D: Value = null, M: Value = null, HC: Value = null, B: Value = null, scanner: Value = null;
	let $e: any;
	f.vars = () => [D, M, HC, B, scanner, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "cell"))) {
		rt.setFv(f, "charge", rt.sv(f, "cell"), (yield* g.call(f, P("/proc/Floor"), null, [multiply(rt.fv(f, "charge", rt.sv(f, "cell")), 0.25)])));
	}
	if (truthy(rt.op(f, "Prob", [], [70]))) {
		if (truthy(rt.op(f, "Prob", [], [15]))) {
			yield* g.callName(f, (D = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill"), []))), "attach", [live(f.src)]);
		} else {
			yield* g.callName(f, (D = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/drill"), []))), "attach", [live(f.src)]);
		}
	} else {
		yield* g.callName(f, (M = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment"), []))), "attach", [live(f.src)]);
	}
	yield* g.callName(f, rt.sv(f, "cargo"), "Add", [(yield* g.new_(f, T("/obj/structure/ore_box"), [live(f.src)]))]);
	yield* g.callName(f, (HC = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"), []))), "attach", [live(f.src)]);
	B = null;
	rt.forList(f, 0, rt.sv(f, "trackers"), T("/obj/item/mecha_parts/mecha_tracking"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(B)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, (scanner = (yield* g.new_(f, T("/obj/item/mecha_parts/mecha_equipment/mining_scanner"), []))), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/mecha/working/ripley/proc/Exit  (code/game/mecha/working/ripley.dm:125)
rt.def("/obj/mecha/working/ripley/proc/Exit", function Exit(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "cargo")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["O"] });

// /obj/mecha/working/ripley/proc/Topic  (code/game/mecha/working/ripley.dm:130)  may sleep
rt.def("/obj/mecha/working/ripley/proc/Topic", function* Topic(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "drop_from_cargo"))) {
		if (truthy((rt.isIn(f, ((O = rt.locateIn(f, rt.at(live(f.args[1]), "drop_from_cargo"), rt.world())) && live(O)), rt.fv(f, "cargo", live(f.src))) ? 1 : 0))) {
			yield* g.callName(f, live(f.src), "occupant_message", [fmt("<span class='notice'>You unload ＀.</span>", [live(O)])]);
			yield* g.callName(f, live(O), "forceMove", [rt.sv(f, "loc")]);
			(rt.modField(f, live(f.src), "cargo", live(O), subtract));
			yield* g.callName(f, live(f.src), "log_message", [fmt("Unloaded ＀. Cargo compartment capacity: ＀", [live(O), subtract(rt.sv(f, "cargo_capacity"), rt.getLen(f, rt.fv(f, "cargo", live(f.src))))])]);
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/mecha/working/ripley/proc/contents_explosion  (code/game/mecha/working/ripley.dm:142)  may sleep
rt.def("/obj/mecha/working/ripley/proc/contents_explosion", function* contents_explosion(f: Frame) {
	let X: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [X, O, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "cargo"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		O = live(X);
		if (truthy(rt.op(f, "Prob", [], [divide(30, live(f.args[0]))]))) {
			(rt.modSrcVar(f, "cargo", live(O), subtract));
			yield* g.callName(f, live(O), "forceMove", [rt.sv(f, "loc")]);
		}
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["severity", "target"] });

// /obj/mecha/working/ripley/proc/get_stats_part  (code/game/mecha/working/ripley.dm:150)
rt.def("/obj/mecha/working/ripley/proc/get_stats_part", function get_stats_part(f: Frame) {
	let output: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [output, O, $e];
	output = rt.callSuper(f, [], rt.Args.Same);
	output = rt.modify(live(output), "<b>Cargo Compartment Contents:</b><div style=\"margin-left: 15px;\">", add);
	if (truthy(rt.len(f, rt.sv(f, "cargo")))) {
		O = null;
		rt.forList(f, 0, rt.sv(f, "cargo"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			output = rt.modify(live(output), fmt("<a href='?src=＃;drop_from_cargo=＃'>Unload</a> : ＀<br>", [live(f.src), live(O), live(O)]), add);
		}
		rt.endFor(f, 0);
	} else {
		output = rt.modify(live(output), "Nothing", add);
	}
	return (output = rt.modify(live(output), "</div>", add));
});

// /obj/mecha/working/ripley/proc/update_pressure  (code/game/mecha/working/ripley.dm:161)
rt.def("/obj/mecha/working/ripley/proc/update_pressure", function update_pressure(f: Frame) {
	let _T: Value = null, environment: Value = null, pressure: Value = null, drill: Value = null;
	let $e: any;
	f.vars = () => [_T, environment, pressure, drill, $e];
	_T = rt.getStep(f, rt.sv(f, "loc"), 0);
	environment = rt.callName(f, live(_T), "return_air", []);
	if (rt.lt((pressure = rt.callName(f, live(environment), "return_pressure", [])), 40)) {
		rt.setSv(f, "step_in", rt.sv(f, "lo_pres_step_in"));
		drill = null;
		rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment/drill"));
		while (($e = rt.next(f, 0)) !== undefined) {
			drill = $e;
			rt.setFv(f, "equip_cooldown", live(drill), divide(rt.initial(f, live(drill), "equip_cooldown"), 2));
		}
		rt.endFor(f, 0);
	} else {
		rt.setSv(f, "step_in", rt.sv(f, "hi_pres_step_in"));
		drill = null;
		rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment/drill"));
		while (($e = rt.next(f, 0)) !== undefined) {
			drill = $e;
			rt.setFv(f, "equip_cooldown", live(drill), rt.initial(f, live(drill), "equip_cooldown"));
		}
		rt.endFor(f, 0);
	}
	return f.dot;
});

// /obj/mecha/working/ripley/proc/relay_container_resist  (code/game/mecha/working/ripley.dm:175)  may sleep
rt.def("/obj/mecha/working/ripley/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	f.vars = () => [user, O];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing so it falls out of ＀.</span>", [live(O), live(f.src)])]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 300, "target", live(O)], rt.Args.Named)))) {
		if ((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(f.src))) || !isEqual(rt.fv(f, "loc", live(O)), live(f.src)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully pushed ＀ out of ＀!</span>", [live(O), live(f.src)])]);
		rt.setFv(f, "loc", live(O), rt.sv(f, "loc"));
		(rt.modSrcVar(f, "cargo", live(O), subtract));
	} else {
		if (!isEqual(rt.fv(f, "loc", live(user)), live(f.src))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to push ＀ out of ＀!</span>", [live(O), live(f.src)])]);
	}
	return f.dot;
}, true);
