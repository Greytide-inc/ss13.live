// From code/game/objects/structures/tables_racks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12187, "/obj/structure/table", "/obj/structure", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	buildstack: rt.typePath("/obj/item/stack/sheet/metal"),
	busy: 0,
	buildstackamount: 1,
	framestackamount: 2,
	deconstruction_ready: 1,
	frame: rt.typePath("/obj/structure/table_frame"),
	anchored: 1,
	pass_flags: 32,
	smooth: 1,
	canSmoothWith: null,
	name: "table",
	desc: "A square piece of metal standing on four metal legs. It can not move.",
	icon: rt.rsc("icons/obj/smooth_structures/table.dmi"),
	icon_state: "table",
	density: 1,
	layer: 2.8,
	climbable: 1,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 30,
});

// /obj/structure/table/proc/<init>  (code/game/objects/structures/tables_racks.dm:36)
rt.def("/obj/structure/table/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/table"), T("/obj/structure/table/reinforced")));
	return f.dot;
});

// /obj/structure/table/proc/New  (code/game/objects/structures/tables_racks.dm:39)  may sleep
rt.def("/obj/structure/table/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/structure/table"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!isEqual(live(_T), live(f.src))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/table/proc/update_icon  (code/game/objects/structures/tables_racks.dm:46)
rt.def("/obj/structure/table/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "smooth"))) return f.dot;
	rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
	rt.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	return f.dot;
});

// /obj/structure/table/proc/narsie_act  (code/game/objects/structures/tables_racks.dm:50)  may sleep
rt.def("/obj/structure/table/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/table/wood"), [rt.fv(f, "loc", live(f.src))]);
	return f.dot;
}, true);

// /obj/structure/table/proc/ratvar_act  (code/game/objects/structures/tables_racks.dm:53)  may sleep
rt.def("/obj/structure/table/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/table/reinforced/brass"), [rt.fv(f, "loc", live(f.src))]);
	return f.dot;
}, true);

// /obj/structure/table/proc/attack_paw  (code/game/objects/structures/tables_racks.dm:57)  may sleep
rt.def("/obj/structure/table/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/table/proc/attack_hand  (code/game/objects/structures/tables_racks.dm:60)  may sleep
rt.def("/obj/structure/table/proc/attack_hand", function* attack_hand(f: Frame) {
	let pushed_mob: Value = null;
	f.vars = () => [pushed_mob];
	if (((isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab") && truthy(rt.fv(f, "pulling", live(f.args[0])))) && truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living")) ? 1 : 0)))) {
		if (truthy(rt.gv(f, "buckled", (pushed_mob = rt.fv(f, "pulling", live(f.args[0])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is buckled to ＀!</span>", [live(pushed_mob), rt.fv(f, "buckled", live(pushed_mob))])]);
			return live(f.dot);
		}
		if (rt.lt(rt.fv(f, "grab_state", live(f.args[0])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a better grip to do that!</span>"]);
			return live(f.dot);
		}
		yield* g.srcCall(f, "tablepush", live(f.args[0]), live(pushed_mob));
		yield* g.callName(f, live(f.args[0]), "stop_pulling", []);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/table/proc/CanPass  (code/game/objects/structures/tables_racks.dm:74)
rt.def("/obj/structure/table/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [1])))) {
		return 1;
	}
	if (truthy(rt.fv(f, "throwing", live(mover)))) {
		return 1;
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/table"), rt.getStep(f, live(mover), 0)))) {
		return 1;
	} else {
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return f.dot;
});

// /obj/structure/table/proc/CanAStarPass  (code/game/objects/structures/tables_racks.dm:86)
rt.def("/obj/structure/table/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [1]));
	return f.dot;
});

// /obj/structure/table/proc/tablepush  (code/game/objects/structures/tables_racks.dm:92)  may sleep
rt.def("/obj/structure/table/proc/tablepush", function* tablepush(f: Frame, user: Value, pushed_mob: Value) {
	f.vars = () => [user, pushed_mob];
	yield* g.callName(f, live(pushed_mob), "forceMove", [rt.fv(f, "loc", live(f.src))]);
	yield* g.callName(f, live(pushed_mob), "Knockdown", [40]);
	yield* g.callName(f, live(pushed_mob), "visible_message", [fmt("<span class='danger'>＀ pushes ＀ onto ＀.</span>", [live(user), live(pushed_mob), live(f.src)]), fmt("<span class='userdanger'>＀ pushes ＀ onto ＀.</span>", [live(user), live(pushed_mob), live(f.src)])]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(pushed_mob), "pushed"]);
	return f.dot;
}, true);

// /obj/structure/table/proc/attackby  (code/game/objects/structures/tables_racks.dm:100)  may sleep
rt.def("/obj/structure/table/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, oldContents: Value = null, C: Value = null, click_params: Value = null;
	let $e: any;
	f.vars = () => [_T, oldContents, C, click_params, $e];
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "deconstruction_ready")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start disassembling ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.srcCall(f, "deconstruct", 1);
			}
			return live(f.dot);
		}
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && truthy(rt.sv(f, "deconstruction_ready")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start deconstructing ＀...</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.srcCall(f, "deconstruct", 1, 1);
			}
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/tray")) ? 1 : 0))) {
		if (rt.gt(rt.getLen(f, rt.gv(f, "contents", (_T = live(f.args[0])))), 0)) {
			oldContents = (yield* g.callName(f, rt.fv(f, "contents", live(_T)), "Copy", []));
			yield* g.callName(f, live(_T), "quick_empty", []);
			C = null;
			rt.forList(f, 0, live(oldContents), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				rt.setFv(f, "loc", live(C), rt.fv(f, "loc", live(f.src)));
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ empties ＀ on ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
			return live(f.dot);
		}
	}
	if ((!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm") && !truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 128)))) {
		if (truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			yield* g.callName(f, live(f.args[0]), "Move", [rt.sv(f, "loc")]);
			yield* g.callName(f, live(f.args[0]), "do_drop_animation", [live(f.args[1])]); // tg #90895's slide from the mob, for placing too (it waits a tick for the pixel_x/y below)
			if (((!truthy((click_params = (yield* g.call(f, P("/proc/params2list"), null, [live(f.args[2])])))) || !truthy(rt.at(live(click_params), "icon-x"))) || !truthy(rt.at(live(click_params), "icon-y")))) {
				return live(f.dot);
			}
			rt.setFv(f, "pixel_x", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.neg(divide(rt.fv(f, "icon_size", rt.world()), 2)), (yield* g.call(f, P("/proc/min"), null, [subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-x")])), 16), divide(rt.fv(f, "icon_size", rt.world()), 2)]))])));
			rt.setFv(f, "pixel_y", live(f.args[0]), (yield* g.call(f, P("/proc/max"), null, [rt.neg(divide(rt.fv(f, "icon_size", rt.world()), 2)), (yield* g.call(f, P("/proc/min"), null, [subtract((yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-y")])), 16), divide(rt.fv(f, "icon_size", rt.world()), 2)]))])));
			return 1;
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/table/proc/deconstruct  (code/game/objects/structures/tables_racks.dm:145)  may sleep
rt.def("/obj/structure/table/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, wrench_disassembly: Value) {
	let _T: Value = null;
	f.vars = () => [disassembled, wrench_disassembly, _T];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (live(wrench_disassembly) === null) {
		wrench_disassembly = 0;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, rt.sv(f, "buildstack"), [(_T = rt.getStep(f, live(f.src), 0)), rt.sv(f, "buildstackamount")]);
		if (!truthy(live(wrench_disassembly))) {
			yield* g.new_(f, rt.sv(f, "frame"), [live(_T)]);
		} else {
			yield* g.new_(f, rt.sv(f, "framestack"), [live(_T), rt.sv(f, "framestackamount")]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12196, "/obj/structure/table/glass", "/obj/structure/table", {
	debris: null,
	buildstack: rt.typePath("/obj/item/stack/sheet/glass"),
	canSmoothWith: null,
	name: "glass table",
	desc: "What did I say about leaning on the glass tables? Now you need surgery.",
	icon: rt.rsc("icons/obj/smooth_structures/glass_table.dmi"),
	icon_state: "glass_table",
	obj_integrity: 70,
	max_integrity: 70,
	resistance_flags: 32,
	armor: null,
});

// /obj/structure/table/glass/proc/<init>  (code/game/objects/structures/tables_racks.dm:169)
rt.def("/obj/structure/table/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	$0 = $0;
	rt.setSv(f, "debris", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 100]));
	return f.dot;
});

// /obj/structure/table/glass/proc/New  (code/game/objects/structures/tables_racks.dm:172)  may sleep
rt.def("/obj/structure/table/glass/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.modSrcVar(f, "debris", (yield* g.new_(f, rt.sv(f, "frame"), [])), add);
	rt.modSrcVar(f, "debris", (yield* g.new_(f, T("/obj/item/weapon/shard"), [])), add);
	return f.dot;
}, true);

// /obj/structure/table/glass/proc/Destroy  (code/game/objects/structures/tables_racks.dm:177)  may sleep
rt.def("/obj/structure/table/glass/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.sv(f, "debris"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(i)]);
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/table/glass/proc/Crossed  (code/game/objects/structures/tables_racks.dm:182)  may sleep
rt.def("/obj/structure/table/glass/proc/Crossed", function* Crossed(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "throwing", live(f.args[0])))) {
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/structure/table/glass/proc/throw_check"), live(f.args[0])])), 5]);
	} else {
		yield* g.srcCall(f, "check_break", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["AM"] });

// /obj/structure/table/glass/proc/throw_check  (code/game/objects/structures/tables_racks.dm:194)  may sleep
rt.def("/obj/structure/table/glass/proc/throw_check", function* throw_check(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!isEqual(rt.fv(f, "loc", live(M)), rt.getStep(f, live(f.src), 0))) return f.dot;
	yield* g.srcCall(f, "check_break", live(M));
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /obj/structure/table/glass/proc/check_break  (code/game/objects/structures/tables_racks.dm:198)  may sleep
rt.def("/obj/structure/table/glass/proc/check_break", function* check_break(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!((truthy((yield* g.callName(f, live(M), "has_gravity", []))) && rt.gt(rt.fv(f, "mob_size", live(M)), 1)) && !truthy(rt.bitAnd(rt.fv(f, "movement_type", live(M)), 2)))) return f.dot;
	yield* g.srcCall(f, "table_shatter", live(M));
	return f.dot;
}, true);

// /obj/structure/table/glass/proc/table_shatter  (code/game/objects/structures/tables_racks.dm:202)  may sleep
rt.def("/obj/structure/table/glass/proc/table_shatter", function* table_shatter(f: Frame, L: Value) {
	let _T: Value = null, I: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [L, _T, I, AM, $e];
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ breaks!</span>", [live(f.src)]), "<span class='danger'>You hear breaking glass.</span>");
	yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(f.src), 0)), "shatter", 50, 1]);
	I = null;
	rt.forList(f, 0, rt.sv(f, "debris"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, (AM = live(I)), "forceMove", [live(_T)]);
		(rt.modSrcVar(f, "debris", live(AM), subtract));
		if (truthy((rt.istype(live(AM), T("/obj/item/weapon/shard")) ? 1 : 0))) {
			yield* g.callName(f, live(AM), "throw_impact", [live(L)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(L), "Knockdown", [100]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/table/glass/proc/deconstruct  (code/game/objects/structures/tables_racks.dm:216)  may sleep
rt.def("/obj/structure/table/glass/proc/deconstruct", function* deconstruct(f: Frame) {
	let _T: Value = null, X: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, X, AM, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(f.args[0]))) {
			yield* g.callSuper(f, [], rt.Args.Same);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(f.src), 0)), "shatter", 50, 1]);
			X = null;
			rt.forList(f, 0, rt.sv(f, "debris"));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				yield* g.callName(f, (AM = live(X)), "forceMove", [live(_T)]);
				(rt.modSrcVar(f, "debris", live(AM), subtract));
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["disassembled", "wrench_disassembly"] });

// /obj/structure/table/glass/proc/narsie_act  (code/game/objects/structures/tables_racks.dm:230)
rt.def("/obj/structure/table/glass/proc/narsie_act", function narsie_act(f: Frame) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [S, $e];
	rt.setSv(f, "color", "#7D1919");
	S = null;
	rt.forList(f, 0, rt.sv(f, "debris"), T("/obj/item/weapon/shard"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.setFv(f, "color", live(S), "#7D1919");
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(12197, "/obj/structure/table/wood", "/obj/structure/table", {
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	name: "wooden table",
	desc: "Do not apply fire to this. Rumour says it burns easily.",
	icon: rt.rsc("icons/obj/smooth_structures/wood_table.dmi"),
	icon_state: "wood_table",
	frame: rt.typePath("/obj/structure/table_frame/wood"),
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	canSmoothWith: null,
});

// /obj/structure/table/wood/proc/<init>  (code/game/objects/structures/tables_racks.dm:249)
rt.def("/obj/structure/table/wood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/table/wood"), T("/obj/structure/table/wood/poker"), T("/obj/structure/table/wood/bar")));
	return f.dot;
});

rt.type(12198, "/obj/structure/table/wood/poker", "/obj/structure/table/wood", {
	buildstack: rt.typePath("/obj/item/stack/tile/carpet"),
	name: "gambling table",
	desc: "A seedy table for seedy dealings in seedy places.",
	icon: rt.rsc("icons/obj/smooth_structures/poker_table.dmi"),
	icon_state: "poker_table",
});

// /obj/structure/table/wood/poker/proc/narsie_act  (code/game/objects/structures/tables_racks.dm:264)  may sleep
rt.def("/obj/structure/table/wood/poker/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* g.new_(f, T("/obj/structure/table/wood"), [rt.fv(f, "loc", live(f.src))]);
	return f.dot;
}, true);

rt.type(12199, "/obj/structure/table/wood/fancy", "/obj/structure/table/wood", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	buildstack: rt.typePath("/obj/item/stack/tile/carpet"),
	name: "fancy table",
	desc: "A standard metal table frame covered with an amazingly fancy, patterned cloth.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "fancy_table",
	frame: rt.typePath("/obj/structure/table_frame"),
	canSmoothWith: null,
});

// /obj/structure/table/wood/fancy/proc/<init>  (code/game/objects/structures/tables_racks.dm:274)
rt.def("/obj/structure/table/wood/fancy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/table/wood/fancy"), T("/obj/structure/table/wood/fancy/black")));
	return f.dot;
});

// /obj/structure/table/wood/fancy/proc/New  (code/game/objects/structures/tables_racks.dm:277)  may sleep
rt.def("/obj/structure/table/wood/fancy/proc/New", function* New(f: Frame) {
	rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/fancy_table.dmi"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12200, "/obj/structure/table/wood/fancy/black", "/obj/structure/table/wood/fancy", {
	buildstack: rt.typePath("/obj/item/stack/tile/carpet/black"),
	icon_state: "fancy_table_black",
});

// /obj/structure/table/wood/fancy/black/proc/New  (code/game/objects/structures/tables_racks.dm:285)  may sleep
rt.def("/obj/structure/table/wood/fancy/black/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon", rt.rsc("icons/obj/smooth_structures/fancy_table_black.dmi"));
	return f.dot;
}, true);

rt.type(12188, "/obj/structure/table/reinforced", "/obj/structure/table", {
	canSmoothWith: null,
	name: "reinforced table",
	desc: "A reinforced version of the four legged table, much harder to simply deconstruct.",
	icon: rt.rsc("icons/obj/smooth_structures/reinforced_table.dmi"),
	icon_state: "r_table",
	deconstruction_ready: 0,
	buildstack: rt.typePath("/obj/item/stack/sheet/plasteel"),
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	armor: null,
});

// /obj/structure/table/reinforced/proc/<init>  (code/game/objects/structures/tables_racks.dm:298)
rt.def("/obj/structure/table/reinforced/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/table/reinforced"), T("/obj/structure/table")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 30, "laser", 30, "energy", 100, "bomb", 20, "bio", 0, "rad", 0, "fire", 80, "acid", 70]));
	return f.dot;
});

// /obj/structure/table/reinforced/proc/attackby  (code/game/objects/structures/tables_racks.dm:305)  may sleep
rt.def("/obj/structure/table/reinforced/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			if (truthy(rt.sv(f, "deconstruction_ready"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start strengthening the reinforced table...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You strengthen the table.</span>"]);
					rt.setSv(f, "deconstruction_ready", 0);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start weakening the reinforced table...</span>"]);
				if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(50, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
					if ((!truthy(live(f.src)) || !truthy((yield* g.callName(f, live(WT), "isOn", []))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You weaken the table.</span>"]);
					rt.setSv(f, "deconstruction_ready", 1);
				}
			}
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(12189, "/obj/structure/table/reinforced/brass", "/obj/structure/table/reinforced", {
	canSmoothWith: null,
	name: "brass table",
	desc: "A solid, slightly beveled brass table.",
	icon: rt.rsc("icons/obj/smooth_structures/brass_table.dmi"),
	icon_state: "brass_table",
	resistance_flags: 34,
	framestack: rt.typePath("/obj/item/stack/tile/brass"),
	buildstack: rt.typePath("/obj/item/stack/tile/brass"),
	framestackamount: 1,
	buildstackamount: 1,
	frame: rt.typePath("/obj/structure/table_frame/brass"),
});

// /obj/structure/table/reinforced/brass/proc/<init>  (code/game/objects/structures/tables_racks.dm:335)
rt.def("/obj/structure/table/reinforced/brass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/obj/structure/table/reinforced/brass")));
	return f.dot;
});

// /obj/structure/table/reinforced/brass/proc/New  (code/game/objects/structures/tables_racks.dm:338)  may sleep
rt.def("/obj/structure/table/reinforced/brass/proc/New", function* New(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [2]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/table/reinforced/brass/proc/Destroy  (code/game/objects/structures/tables_racks.dm:342)  may sleep
rt.def("/obj/structure/table/reinforced/brass/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [-2]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/table/reinforced/brass/proc/narsie_act  (code/game/objects/structures/tables_racks.dm:347)  may sleep
rt.def("/obj/structure/table/reinforced/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [15, 45])), "brute");
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /obj/structure/table/reinforced/brass/proc/ratvar_act  (code/game/objects/structures/tables_racks.dm:355)
rt.def("/obj/structure/table/reinforced/brass/proc/ratvar_act", function ratvar_act(f: Frame) {
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	return f.dot;
});

rt.type(12194, "/obj/structure/table/optable", "/obj/structure/table", {
	patient: null,
	computer: null,
	smooth: 0,
	can_buckle: 1,
	buckle_lying: 1,
	buckle_requires_restraints: 1,
	name: "operating table",
	desc: "Used for advanced medical procedures.",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	icon_state: "optable",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// /obj/structure/table/optable/proc/New  (code/game/objects/structures/tables_racks.dm:375)  may sleep
rt.def("/obj/structure/table/optable/proc/New", function* New(f: Frame) {
	let dir: Value = null;
	let $e: any;
	f.vars = () => [dir, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	dir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		dir = $e;
		rt.setSv(f, "computer", rt.locateIn(f, T("/obj/machinery/computer/operating"), rt.getStep(f, live(f.src), live(dir))));
		if (truthy(rt.sv(f, "computer"))) {
			rt.setFv(f, "table", rt.sv(f, "computer"), live(f.src));
			break;
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/table/optable/proc/tablepush  (code/game/objects/structures/tables_racks.dm:383)  may sleep
rt.def("/obj/structure/table/optable/proc/tablepush", function* tablepush(f: Frame, user: Value, pushed_mob: Value) {
	f.vars = () => [user, pushed_mob];
	yield* g.callName(f, live(pushed_mob), "forceMove", [rt.fv(f, "loc", live(f.src))]);
	rt.setFv(f, "resting", live(pushed_mob), 1);
	yield* g.callName(f, live(pushed_mob), "update_canmove", []);
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ has laid ＀ on ＀.</span>", [live(user), live(pushed_mob), live(f.src)]));
	yield* g.srcCall(f, "check_patient");
	return f.dot;
}, true);

// /obj/structure/table/optable/proc/check_patient  (code/game/objects/structures/tables_racks.dm:390)
rt.def("/obj/structure/table/optable/proc/check_patient", function check_patient(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((M = rt.locateIn(f, T("/mob/living/carbon/human"), rt.sv(f, "loc"))))) {
		if (truthy(rt.fv(f, "resting", live(M)))) {
			rt.setSv(f, "patient", live(M));
			return 1;
		}
	} else {
		rt.setSv(f, "patient", null);
		return 0;
	}
	return f.dot;
});

rt.type(12876, "/obj/structure/rack", "/obj/structure", {
	anchored: 1,
	pass_flags: 32,
	name: "rack",
	desc: "Different from the Middle Ages version.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "rack",
	density: 1,
	obj_integrity: 20,
	max_integrity: 20,
});

// /obj/structure/rack/proc/CanPass  (code/game/objects/structures/tables_racks.dm:416)
rt.def("/obj/structure/rack/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if (isEqual(rt.fv(f, "density", live(f.src)), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [1])))) {
		return 1;
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/structure/rack/proc/CanAStarPass  (code/game/objects/structures/tables_racks.dm:425)
rt.def("/obj/structure/rack/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [1]));
	return f.dot;
});

// /obj/structure/rack/proc/MouseDrop_T  (code/game/objects/structures/tables_racks.dm:431)  may sleep
rt.def("/obj/structure/rack/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, O: Value, user: Value) {
	f.vars = () => [O, user];
	if ((!truthy((rt.istype(live(O), T("/obj/item/weapon")) ? 1 : 0)) || !isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(O)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", live(O)), rt.fv(f, "loc", live(f.src)))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(O), rt.getDir(f, live(O), live(f.src))]);
	return f.dot;
}, true);

// /obj/structure/rack/proc/attackby  (code/game/objects/structures/tables_racks.dm:440)  may sleep
rt.def("/obj/structure/rack/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.srcCall(f, "deconstruct", 1);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "Move", [rt.sv(f, "loc")]);
	yield* g.callName(f, live(f.args[0]), "do_drop_animation", [live(f.args[1])]); // the slide from the mob, as tables
	return 1;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/rack/proc/attack_paw  (code/game/objects/structures/tables_racks.dm:451)  may sleep
rt.def("/obj/structure/rack/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/rack/proc/attack_hand  (code/game/objects/structures/tables_racks.dm:454)  may sleep
rt.def("/obj/structure/rack/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((((truthy((yield* g.callName(f, live(user), "IsKnockdown", []))) || truthy(rt.fv(f, "resting", live(user)))) || truthy(rt.fv(f, "lying", live(user)))) || rt.lt((yield* g.callName(f, live(user), "get_num_legs", [])), 2))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "kick"]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ kicks ＀.</span>", [live(user), live(f.src)]), null, null, 3]);
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [4, 8])), "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/structure/rack/proc/play_attack_sound  (code/game/objects/structures/tables_racks.dm:463)
rt.def("/obj/structure/rack/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/dodgeball.ogg"), 80, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 40, 1]);
	}
	return f.dot;
});

// /obj/structure/rack/proc/deconstruct  (code/game/objects/structures/tables_racks.dm:477)  may sleep
rt.def("/obj/structure/rack/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let newparts: Value = null;
	f.vars = () => [disassembled, newparts];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		rt.setSv(f, "density", 0);
		yield* g.srcCall(f, "transfer_fingerprints_to", (newparts = (yield* g.new_(f, T("/obj/item/weapon/rack_parts"), [rt.sv(f, "loc")]))));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(7478, "/obj/item/weapon/rack_parts", "/obj/item/weapon", {
	building: 0,
	flags: 64,
	name: "rack parts",
	desc: "Parts of a rack.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "rack_parts",
	materials: null,
});

// /obj/item/weapon/rack_parts/proc/<init>  (code/game/objects/structures/tables_racks.dm:494)
rt.def("/obj/item/weapon/rack_parts/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/weapon/rack_parts/proc/attackby  (code/game/objects/structures/tables_racks.dm:498)  may sleep
rt.def("/obj/item/weapon/rack_parts/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.args[1]))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/rack_parts/proc/attack_self  (code/game/objects/structures/tables_racks.dm:508)  may sleep
rt.def("/obj/item/weapon/rack_parts/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [user, R];
	if (truthy(rt.sv(f, "building"))) {
		return live(f.dot);
	}
	rt.setSv(f, "building", 1);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You start constructing a rack...</span>"]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(f.src), "progress", 1], rt.Args.Named)))) {
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			return live(f.dot);
		}
		R = (yield* g.new_(f, T("/obj/structure/rack"), [rt.fv(f, "loc", live(user))]));
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ assembles ＇！.</span>", [live(user), live(R)]), fmt("<span class='notice'>You assemble ＇！.</span>", [live(R)])]);
		yield* g.callName(f, live(R), "add_fingerprint", [live(user)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	rt.setSv(f, "building", 0);
	return f.dot;
}, true);
