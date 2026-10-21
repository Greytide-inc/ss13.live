// From code/game/objects/structures/plasticflaps.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12859, "/obj/structure/plasticflaps", "/obj/structure", {
	state: 0,
	anchored: 1,
	name: "plastic flaps",
	desc: "Definitely can't get past those. No way.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "plasticflaps",
	armor: null,
	density: 0,
	layer: 4.1,
});

// /obj/structure/plasticflaps/proc/<init>  (code/game/objects/structures/plasticflaps.dm:6)
rt.def("/obj/structure/plasticflaps/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 100, "bullet", 80, "laser", 80, "energy", 100, "bomb", 50, "bio", 100, "rad", 100, "fire", 50, "acid", 50]));
	return f.dot;
});

// /obj/structure/plasticflaps/proc/examine  (code/game/objects/structures/plasticflaps.dm:13)
rt.def("/obj/structure/plasticflaps/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "state");
	if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ are <b>screwed</b> to the floor.</span>", [live(f.src)])]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ are no longer <i>screwed</i> to the floor, and the flaps can be <b>cut</b> apart.</span>", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/plasticflaps/proc/attackby  (code/game/objects/structures/plasticflaps.dm:21)  may sleep
rt.def("/obj/structure/plasticflaps/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "state"), 0)) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ unscrews ＀ from the floor.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to unscrew ＀ from the floor...</span>", [live(f.src)]), "You hear rustling noises."]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(100, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (!isEqual(rt.sv(f, "state"), 0)) {
					return live(f.dot);
				}
				rt.setSv(f, "state", 1);
				rt.setSv(f, "anchored", 0);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unscrew ＀ from the floor.</span>", [live(f.src)])]);
			}
		} else {
			if (isEqual(rt.sv(f, "state"), 1)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ screws ＀ to the floor.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to screw ＀ to the floor...</span>", [live(f.src)]), "You hear rustling noises."]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (!isEqual(rt.sv(f, "state"), 1)) {
						return live(f.dot);
					}
					rt.setSv(f, "state", 0);
					rt.setSv(f, "anchored", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You screw ＀ from the floor.</span>", [live(f.src)])]);
				}
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "state"), 1)) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ cuts apart ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to cut apart ＀.</span>", [live(f.src)]), "You hear cutting."]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if (!isEqual(rt.sv(f, "state"), 1)) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You cut apart ＀.</span>", [live(f.src)])]);
					yield* g.callName(f, (_P = (yield* g.new_(f, T("/obj/item/stack/sheet/plastic/five"), [rt.sv(f, "loc")]))), "add_fingerprint", [live(f.args[1])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				}
			}
		} else {
			f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/plasticflaps/proc/CanAStarPass  (code/game/objects/structures/plasticflaps.dm:56)
rt.def("/obj/structure/plasticflaps/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value, caller: Value) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(caller), T("/mob/living")) ? 1 : 0))) {
		if (truthy((rt.istype(live(caller), T("/mob/living/simple_animal/bot")) ? 1 : 0))) {
			return 1;
		}
		if ((!truthy(rt.gv(f, "ventcrawler", (M = live(caller)))) && !isEqual(rt.fv(f, "mob_size", live(M)), 0))) {
			return 0;
		}
	}
	return 1;
});

// /obj/structure/plasticflaps/proc/CanPass  (code/game/objects/structures/plasticflaps.dm:67)
rt.def("/obj/structure/plasticflaps/proc/CanPass", function CanPass(f: Frame) {
	let B: Value = null, C: Value = null, M: Value = null;
	f.vars = () => [B, C, M];
	if ((truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(f.args[0]), "checkpass", [2])))) {
		return rt.op(f, "Prob", [], [60]);
	}
	B = live(f.args[0]);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/structure/bed")) ? 1 : 0)) && (truthy(rt.callName(f, live(B), "has_buckled_mobs", [])) || truthy(rt.fv(f, "density", live(B)))))) {
		return 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/structure/closet/cardboard")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "move_delay", (C = live(f.args[0]))))) {
			return 0;
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/mecha")) ? 1 : 0))) {
		return 0;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
			M = live(f.args[0]);
			if (truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/bot")) ? 1 : 0))) {
				return 1;
			}
			if ((truthy(rt.fv(f, "buckled", live(M))) && truthy((rt.istype(rt.fv(f, "buckled", live(M)), T("/mob/living/simple_animal/bot/mulebot")) ? 1 : 0)))) {
				return 1;
			}
			if (((!truthy(rt.fv(f, "lying", live(M))) && !truthy(rt.fv(f, "ventcrawler", live(M)))) && !isEqual(rt.fv(f, "mob_size", live(M)), 0))) {
				return 0;
			}
		}
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["A", "T"] });

// /obj/structure/plasticflaps/proc/deconstruct  (code/game/objects/structures/plasticflaps.dm:94)  may sleep
rt.def("/obj/structure/plasticflaps/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/plastic/five"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12860, "/obj/structure/plasticflaps/mining", "/obj/structure/plasticflaps", {
	CanAtmosPass: 0,
	name: "airtight plastic flaps",
	desc: "Heavy duty, airtight, plastic flaps.",
});

// /obj/structure/plasticflaps/mining/proc/New  (code/game/objects/structures/plasticflaps.dm:104)  may sleep
rt.def("/obj/structure/plasticflaps/mining/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "air_update_turf", 1);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/plasticflaps/mining/proc/Destroy  (code/game/objects/structures/plasticflaps.dm:108)  may sleep
rt.def("/obj/structure/plasticflaps/mining/proc/Destroy", function* Destroy(f: Frame) {
	let oldloc: Value = null;
	f.vars = () => [oldloc];
	oldloc = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(oldloc))) return f.dot;
	yield* g.callName(f, live(oldloc), "air_update_turf", [1]);
	return f.dot;
}, true);
