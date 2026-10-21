// From code/game/mecha/mecha_wreckage.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12556, "/obj/structure/mecha_wreckage", "/obj/structure", {
	welder_salvage: null,
	wirecutters_salvage: null,
	crowbar_salvage: null,
	salvage_num: 5,
	AI: null,
	anchored: 0,
	name: "exosuit wreckage",
	desc: "Remains of some unfortunate mecha. Completely unrepairable, but perhaps something can be salvaged.",
	icon: rt.rsc("icons/mecha/mecha.dmi"),
	density: 1,
	opacity: 0,
});

// /obj/structure/mecha_wreckage/proc/<init>  (code/game/mecha/mecha_wreckage.dm:13)
rt.def("/obj/structure/mecha_wreckage/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "welder_salvage", rt.list(T("/obj/item/stack/sheet/plasteel"), T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/rods")));
	$0 = $0;
	rt.setSv(f, "wirecutters_salvage", rt.list(T("/obj/item/stack/cable_coil")));
	$0 = $0;
	rt.setSv(f, "crowbar_salvage", rt.list());
	return f.dot;
});

// /obj/structure/mecha_wreckage/proc/New  (code/game/mecha/mecha_wreckage.dm:20)  may sleep
rt.def("/obj/structure/mecha_wreckage/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "AI", live(f.args[1]));
	yield* g.callName(f, rt.sv(f, "AI"), "apply_damage", [150, "fire"]);
	yield* g.callName(f, rt.sv(f, "AI"), "death", []);
	yield* g.callName(f, rt.sv(f, "AI"), "forceMove", [live(f.src)]);
	yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/projectiles.dmi"), "green_laser"])));
	rt.setFv(f, "controlled_mech", rt.sv(f, "AI"), null);
	rt.setFv(f, "remote_control", rt.sv(f, "AI"), null);
	return f.dot;
}, true, { args: ["loc", "AI_pilot"] });

// /obj/structure/mecha_wreckage/proc/examine  (code/game/mecha/mecha_wreckage.dm:31)
rt.def("/obj/structure/mecha_wreckage/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "AI"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The AI recovery beacon is active.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/mecha_wreckage/proc/attackby  (code/game/mecha/mecha_wreckage.dm:36)  may sleep
rt.def("/obj/structure/mecha_wreckage/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, type: Value = null, N: Value = null, type_0: Value = null, N_1: Value = null, S: Value = null;
	let $0: any;
	f.vars = () => [I, user, params, WT, type, N, type_0, N_1, S, $0];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (rt.le(rt.sv(f, "salvage_num"), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't see anything that can be cut with ＀!</span>", [live(I)])]);
			return live(f.dot);
		}
		WT = live(I);
		if (((truthy(rt.sv(f, "welder_salvage")) && truthy(rt.len(f, rt.sv(f, "welder_salvage")))) && truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(user)]))))) {
			if (truthy(rt.op(f, "Prob", [], [70]))) {
				$0 = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "welder_salvage")]);
			} else {
				$0 = null;
			}
			if (truthy((type = $0))) {
				N = (yield* g.new_(f, live(type), [rt.getStep(f, live(user), 0)]));
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ cuts ＀ from ＀.", [live(user), live(N), live(f.src)]), fmt("<span class='notice'>You cut ＀ from ＀.</span>", [live(N), live(f.src)])]);
				if (truthy((rt.istype(live(N), T("/obj/item/mecha_parts/part")) ? 1 : 0))) {
					(rt.modSrcVar(f, "welder_salvage", live(type), subtract));
				}
				rt.incSrcVar(f, "salvage_num", -1, true);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to salvage anything valuable from ＀!</span>", [live(f.src)])]);
			}
		} else {
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			if (rt.le(rt.sv(f, "salvage_num"), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't see anything that can be cut with ＀!</span>", [live(I)])]);
				return live(f.dot);
			} else {
				if ((truthy(rt.sv(f, "wirecutters_salvage")) && truthy(rt.len(f, rt.sv(f, "wirecutters_salvage"))))) {
					if (truthy(rt.op(f, "Prob", [], [70]))) {
						$0 = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "wirecutters_salvage")]);
					} else {
						$0 = null;
					}
					if (truthy((type_0 = $0))) {
						N_1 = (yield* g.new_(f, live(type_0), [rt.getStep(f, live(user), 0)]));
						yield* g.callName(f, live(user), "visible_message", [fmt("＀ cuts ＀ from ＀.", [live(user), live(N_1), live(f.src)]), fmt("<span class='notice'>You cut ＀ from ＀.</span>", [live(N_1), live(f.src)])]);
						rt.incSrcVar(f, "salvage_num", -1, true);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to salvage anything valuable from ＀!</span>", [live(f.src)])]);
					}
				}
			}
		} else {
			if (!truthy((rt.istype(live(I), T("/obj/item/weapon/crowbar")) ? 1 : 0))) return f.dot;
			if ((truthy(rt.sv(f, "crowbar_salvage")) && truthy(rt.len(f, rt.sv(f, "crowbar_salvage"))))) {
				if (truthy((S = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "crowbar_salvage")])))) {
					rt.setFv(f, "loc", live(S), rt.getStep(f, live(user), 0));
					(rt.modSrcVar(f, "crowbar_salvage", live(S), subtract));
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ pries ＀ from ＀.", [live(user), live(S), live(f.src)]), fmt("<span class='notice'>You pry ＀ from ＀.</span>", [live(S), live(f.src)])]);
				}
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't see anything that can be pried with ＀!</span>", [live(I)])]);
			}
		}
	}
	return f.dot;
}, true);

// /obj/structure/mecha_wreckage/proc/transfer_ai  (code/game/mecha/mecha_wreckage.dm:80)  may sleep
rt.def("/obj/structure/mecha_wreckage/proc/transfer_ai", function* transfer_ai(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[0]), 1)) {
		if (!truthy(rt.sv(f, "AI"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>No AI backups found.</span>"]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "cut_overlays");
		yield* g.callName(f, rt.sv(f, "AI"), "forceMove", [live(f.args[3])]);
		rt.setFv(f, "AI", live(f.args[3]), rt.sv(f, "AI"));
		if (truthy(rt.fv(f, "client", rt.sv(f, "AI")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "AI"), "The remains of your file system have been recovered on a mobile storage device."]);
		} else {
			yield* g.callName(f, rt.sv(f, "AI"), "notify_ghost_cloning", [null, "You have been recovered from the wreckage!", "source", live(f.args[3])], rt.Args.Named);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Backup files recovered</span>: ＀ (＀.exe) salvaged from ＀ and stored within local memory.", [rt.fv(f, "name", rt.sv(f, "AI")), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999])), rt.sv(f, "name")])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["interaction", "user", "null", "card"] });

rt.type(12557, "/obj/structure/mecha_wreckage/gygax", "/obj/structure/mecha_wreckage", {
	name: "１Gygax wreckage",
	icon_state: "gygax-broken",
});

// /obj/structure/mecha_wreckage/gygax/proc/New  (code/game/mecha/mecha_wreckage.dm:106)  may sleep
rt.def("/obj/structure/mecha_wreckage/gygax/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/part/gygax_torso"), T("/obj/item/mecha_parts/part/gygax_head"), T("/obj/item/mecha_parts/part/gygax_left_arm"), T("/obj/item/mecha_parts/part/gygax_right_arm"), T("/obj/item/mecha_parts/part/gygax_left_leg"), T("/obj/item/mecha_parts/part/gygax_right_leg"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12563, "/obj/structure/mecha_wreckage/ripley", "/obj/structure/mecha_wreckage", {
	name: "１Ripley wreckage",
	icon_state: "ripley-broken",
});

// /obj/structure/mecha_wreckage/ripley/proc/New  (code/game/mecha/mecha_wreckage.dm:149)  may sleep
rt.def("/obj/structure/mecha_wreckage/ripley/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/part/ripley_torso"), T("/obj/item/mecha_parts/part/ripley_left_arm"), T("/obj/item/mecha_parts/part/ripley_right_arm"), T("/obj/item/mecha_parts/part/ripley_left_leg"), T("/obj/item/mecha_parts/part/ripley_right_leg"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12564, "/obj/structure/mecha_wreckage/ripley/firefighter", "/obj/structure/mecha_wreckage/ripley", {
	name: "１Firefighter wreckage",
	icon_state: "firefighter-broken",
});

// /obj/structure/mecha_wreckage/ripley/firefighter/proc/New  (code/game/mecha/mecha_wreckage.dm:167)  may sleep
rt.def("/obj/structure/mecha_wreckage/ripley/firefighter/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/part/ripley_torso"), T("/obj/item/mecha_parts/part/ripley_left_arm"), T("/obj/item/mecha_parts/part/ripley_right_arm"), T("/obj/item/mecha_parts/part/ripley_left_leg"), T("/obj/item/mecha_parts/part/ripley_right_leg"), T("/obj/item/clothing/suit/fire"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12566, "/obj/structure/mecha_wreckage/honker", "/obj/structure/mecha_wreckage", {
	name: "１H.O.N.K wreckage",
	icon_state: "honker-broken",
	desc: "All is right in the universe.",
});

// /obj/structure/mecha_wreckage/honker/proc/New  (code/game/mecha/mecha_wreckage.dm:192)  may sleep
rt.def("/obj/structure/mecha_wreckage/honker/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/chassis/honker"), T("/obj/item/mecha_parts/part/honker_torso"), T("/obj/item/mecha_parts/part/honker_head"), T("/obj/item/mecha_parts/part/honker_left_arm"), T("/obj/item/mecha_parts/part/honker_right_arm"), T("/obj/item/mecha_parts/part/honker_left_leg"), T("/obj/item/mecha_parts/part/honker_right_leg"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12567, "/obj/structure/mecha_wreckage/durand", "/obj/structure/mecha_wreckage", {
	name: "１Durand wreckage",
	icon_state: "durand-broken",
});

// /obj/structure/mecha_wreckage/durand/proc/New  (code/game/mecha/mecha_wreckage.dm:213)  may sleep
rt.def("/obj/structure/mecha_wreckage/durand/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/part/durand_torso"), T("/obj/item/mecha_parts/part/durand_head"), T("/obj/item/mecha_parts/part/durand_left_arm"), T("/obj/item/mecha_parts/part/durand_right_arm"), T("/obj/item/mecha_parts/part/durand_left_leg"), T("/obj/item/mecha_parts/part/durand_right_leg"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

rt.type(12569, "/obj/structure/mecha_wreckage/odysseus", "/obj/structure/mecha_wreckage", {
	name: "１Odysseus wreckage",
	icon_state: "odysseus-broken",
});

// /obj/structure/mecha_wreckage/odysseus/proc/New  (code/game/mecha/mecha_wreckage.dm:238)  may sleep
rt.def("/obj/structure/mecha_wreckage/odysseus/proc/New", function* New(f: Frame) {
	let parts: Value = null, i: Value = null, part: Value = null;
	f.vars = () => [parts, i, part];
	yield* g.callSuper(f, [], rt.Args.Same);
	parts = rt.list(T("/obj/item/mecha_parts/part/odysseus_torso"), T("/obj/item/mecha_parts/part/odysseus_head"), T("/obj/item/mecha_parts/part/odysseus_left_arm"), T("/obj/item/mecha_parts/part/odysseus_right_arm"), T("/obj/item/mecha_parts/part/odysseus_left_leg"), T("/obj/item/mecha_parts/part/odysseus_right_leg"));
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		if ((truthy(rt.len(f, live(parts))) && truthy(rt.op(f, "Prob", [], [40])))) {
			rt.modSrcVar(f, "welder_salvage", (part = rt.op(f, "PickUnweighted", [1], [live(parts)])), add);
			(parts = rt.modify(live(parts), live(part), subtract));
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);
