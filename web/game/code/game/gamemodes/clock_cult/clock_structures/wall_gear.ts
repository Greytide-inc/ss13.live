// From code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12165, "/obj/structure/destructible/clockwork/wall_gear", "/obj/structure/destructible/clockwork", {
	unanchored_icon: "wall_gear",
	construction_value: 3,
	name: "massive gear",
	icon_state: "wall_gear",
	climbable: 1,
	max_integrity: 100,
	obj_integrity: 100,
	layer: 2.9,
	desc: "A massive brass gear. You could probably secure or unsecure it with a wrench, or just climb over it.",
	break_message: "<span class='warning'>The gear breaks apart into shards of alloy!</span>",
	debris: null,
});

// /obj/structure/destructible/clockwork/wall_gear/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm:13)
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/alloy_shards/medium"), 4, T("/obj/item/clockwork/alloy_shards/small"), 2]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/wall_gear/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm:21)  may sleep
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/gear"), [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/wall_gear/proc/attackby  (code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm:28)  may sleep
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null, _T: Value = null, brass_floor: Value = null;
	let $0: any, $1: any;
	f.vars = () => [W, _T, brass_floor, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 10);
		return 1;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "anchored"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs to be unsecured to disassemble it!</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ starts to disassemble ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You start to disassemble ＀...</span>", [live(f.src)])]);
				if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && !truthy(rt.sv(f, "anchored")))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You disassemble ＀.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "deconstruct", 1);
				}
			}
			return 1;
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/tile/brass")) ? 1 : 0))) {
				if (rt.lt((yield* g.callName(f, (W = live(f.args[0])), "get_amount", [])), 1)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one brass sheet to do this!</span>"]);
					return live(f.dot);
				}
				if (truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/closed/wall")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a wall present!</span>"]);
					return live(f.dot);
				}
				if (!truthy((rt.istype(live(_T), T("/turf/open/floor")) ? 1 : 0))) {
					$0 = live(f.args[1]);
					if (truthy(rt.sv(f, "anchored"))) {
						$1 = "false ";
					} else {
						$1 = "";
					}
					yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>A floor must be present to build a ＀wall!</span>", [$1])]);
					return live(f.dot);
				}
				if (truthy(rt.locateIn(f, T("/obj/structure/falsewall"), rt.fv(f, "contents", live(_T))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a false wall present!</span>"]);
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(W), live(f.src)])]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
					brass_floor = 0;
					if (truthy((rt.istype(live(_T), T("/turf/open/floor/clockwork")) ? 1 : 0))) {
						brass_floor = 1;
					}
					if (truthy((yield* g.callName(f, live(W), "use", [subtract(2, live(brass_floor))])))) {
						if (truthy(rt.sv(f, "anchored"))) {
							yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/closed/wall/clockwork")]);
						} else {
							yield* g.callName(f, live(_T), "ChangeTurf", [T("/turf/open/floor/clockwork")]);
							yield* g.new_(f, T("/obj/structure/falsewall/brass"), [live(_T)]);
						}
						yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					} else {
						$0 = live(f.args[1]);
						if (truthy(rt.sv(f, "anchored"))) {
							$1 = "false ";
						} else {
							$1 = "";
						}
						yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>You need more brass to make a ＀wall!</span>", [$1])]);
					}
				}
				return 1;
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/structure/destructible/clockwork/wall_gear/proc/deconstruct  (code/game/gamemodes/clock_cult/clock_structures/wall_gear.dm:74)  may sleep
rt.def("/obj/structure/destructible/clockwork/wall_gear/proc/deconstruct", function* deconstruct(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if ((!truthy(rt.bitAnd(rt.sv(f, "flags"), 128)) && truthy(live(f.args[0])))) {
		yield* g.new_(f, T("/obj/item/stack/tile/brass"), [rt.sv(f, "loc"), 3]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["disassembled"] });
