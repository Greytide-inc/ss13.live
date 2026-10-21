// From code/modules/recycling/disposal-unit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10984, "/obj/machinery/disposal", "/obj/machinery", {
	air_contents: null,
	full_pressure: 0,
	pressure_charging: 1,
	flush: 0,
	trunk: null,
	flushing: 0,
	flush_every_ticks: 30,
	flush_count: 0,
	last_sound: 0,
	stored: null,
	anchored: 1,
	interact_open: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	density: 1,
	on_blueprints: 1,
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	resistance_flags: 2,
});

// /obj/machinery/disposal/proc/<init>  (code/modules/recycling/disposal-unit.dm:11)
rt.def("/obj/machinery/disposal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]));
	return f.dot;
});

// /obj/machinery/disposal/proc/Initialize  (code/modules/recycling/disposal-unit.dm:30)  may sleep
rt.def("/obj/machinery/disposal/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.args[1]))) {
		yield* g.srcCall(f, "setDir", rt.fv(f, "dir", live(f.args[1])));
		rt.setFv(f, "loc", live(f.args[1]), 0);
		rt.setSv(f, "stored", live(f.args[1]));
	} else {
		rt.setSv(f, "stored", (yield* g.new_(f, T("/obj/structure/disposalconstruct"), [0, 6, rt.sv(f, "dir")])));
	}
	yield* g.srcCall(f, "trunk_check");
	rt.setSv(f, "air_contents", (yield* g.new_(f, T("/datum/gas_mixture"), [])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload", "make_from"] });

// /obj/machinery/disposal/proc/trunk_check  (code/modules/recycling/disposal-unit.dm:45)
rt.def("/obj/machinery/disposal/proc/trunk_check", function trunk_check(f: Frame) {
	rt.setSv(f, "trunk", rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), rt.sv(f, "loc")));
	if (!truthy(rt.sv(f, "trunk"))) {
		rt.setSv(f, "pressure_charging", 0);
		rt.setSv(f, "flush", 0);
	} else {
		if (truthy(rt.initial(f, live(f.src), "pressure_charging"))) {
			rt.setSv(f, "pressure_charging", 1);
		}
		rt.setSv(f, "flush", rt.initial(f, live(f.src), "flush"));
		rt.setFv(f, "linked", rt.sv(f, "trunk"), live(f.src));
	}
	return f.dot;
});

// /obj/machinery/disposal/proc/Destroy  (code/modules/recycling/disposal-unit.dm:56)  may sleep
rt.def("/obj/machinery/disposal/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "eject");
	if (truthy(rt.sv(f, "trunk"))) {
		rt.setFv(f, "linked", rt.sv(f, "trunk"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/disposal/proc/singularity_pull  (code/modules/recycling/disposal-unit.dm:62)  may sleep
rt.def("/obj/machinery/disposal/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!rt.ge(live(current_size), 9)) return f.dot;
	yield* g.srcCall(f, "deconstruct");
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/Initialize  (code/modules/recycling/disposal-unit.dm:66)  may sleep
rt.def("/obj/machinery/disposal/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true, { args: ["mapload"] });

// /obj/machinery/disposal/proc/LateInitialize  (code/modules/recycling/disposal-unit.dm:71)  may sleep
rt.def("/obj/machinery/disposal/proc/LateInitialize", function* LateInitialize(f: Frame) {
	let L: Value = null, env: Value = null, removed: Value = null;
	f.vars = () => [L, env, removed];
	L = rt.sv(f, "loc");
	yield* g.callName(f, (env = (yield* g.new_(f, T("/datum/gas_mixture"), []))), "copy_from", [(yield* g.callName(f, live(L), "return_air", []))]);
	removed = (yield* g.callName(f, live(env), "remove", [6.066249847412109]));
	yield* g.callName(f, rt.sv(f, "air_contents"), "merge", [live(removed)]);
	yield* g.srcCall(f, "trunk_check");
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/attackby  (code/modules/recycling/disposal-unit.dm:79)  may sleep
rt.def("/obj/machinery/disposal/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	let $0: any, $1: any;
	f.vars = () => [W, $0, $1];
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (((!truthy(rt.sv(f, "pressure_charging")) && !truthy(rt.sv(f, "full_pressure"))) && !truthy(rt.sv(f, "flush")))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			rt.setSv(f, "panel_open", (!truthy(rt.sv(f, "panel_open")) ? 1 : 0));
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "panel_open"))) {
				$1 = "remove";
			} else {
				$1 = "attach";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the screws around the power connection.</span>", [$1])]);
			return live(f.dot);
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && truthy(rt.sv(f, "panel_open")))) {
				if (truthy((yield* g.callName(f, (W = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 100, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start slicing the floorweld off ％！...</span>", [live(f.src)])]);
					if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && truthy(rt.sv(f, "panel_open")))) {
						if (!truthy((yield* g.callName(f, live(W), "isOn", [])))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slice the floorweld off ％！.</span>", [live(f.src)])]);
						yield* g.srcCall(f, "deconstruct");
					}
				}
				return live(f.dot);
			}
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		if ((!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", []))) || truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 128)))) {
			return live(f.dot);
		}
		yield* g.srcCall(f, "place_item_in_disposal", live(f.args[0]), live(f.args[1]));
		yield* g.srcCall(f, "update_icon");
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/disposal/proc/place_item_in_disposal  (code/modules/recycling/disposal-unit.dm:108)  may sleep
rt.def("/obj/machinery/disposal/proc/place_item_in_disposal", function* place_item_in_disposal(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ places ％！ into ％！.", [rt.fv(f, "name", live(user)), live(I), live(f.src)]), fmt("<span class='notice'>You place ％！ into ％！.</span>", [live(I), live(f.src)])]);
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/MouseDrop_T  (code/modules/recycling/disposal-unit.dm:113)  may sleep
rt.def("/obj/machinery/disposal/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (!truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "stuff_mob_in", live(target), live(user));
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/stuff_mob_in  (code/modules/recycling/disposal-unit.dm:117)  may sleep
rt.def("/obj/machinery/disposal/proc/stuff_mob_in", function* stuff_mob_in(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)) && !truthy(rt.fv(f, "ventcrawler", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "buckled", live(target))) || truthy((yield* g.callName(f, live(target), "has_buckled_mobs", []))))) {
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "mob_size", live(target)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't fit inside ＀!</span>", [live(target), live(f.src)])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (isEqual(live(user), live(target))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ starts climbing into ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You start climbing into ＀...</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ starts putting ＀ into ＀.</span>", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ starts putting you into ＀!</span>", [live(user), live(f.src)])]);
	}
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target), 20])))) return f.dot;
	if (!truthy(rt.sv(f, "loc"))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(target), "forceMove", [live(f.src)]);
	if (isEqual(live(user), live(target))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ climbs into ＀.", [live(user), live(f.src)]), fmt("<span class='notice'>You climb into ＀.</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ has placed ＀ in ＀.</span>", [live(user), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ has placed ＀ in ＀.</span>", [live(user), live(target), live(f.src)])]);
		yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(target), null, "stuffed", "addition", fmt("into ＀", [live(f.src)])], rt.Args.Named);
		rt.setFv(f, "LAssailant", live(target), live(user));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/relaymove  (code/modules/recycling/disposal-unit.dm:144)  may sleep
rt.def("/obj/machinery/disposal/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attempt_escape", live(user));
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/container_resist  (code/modules/recycling/disposal-unit.dm:148)  may sleep
rt.def("/obj/machinery/disposal/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attempt_escape", live(user));
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/attempt_escape  (code/modules/recycling/disposal-unit.dm:153)  may sleep
rt.def("/obj/machinery/disposal/proc/attempt_escape", function* attempt_escape(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "flushing"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "go_out", live(user));
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/go_out  (code/modules/recycling/disposal-unit.dm:157)  may sleep
rt.def("/obj/machinery/disposal/proc/go_out", function* go_out(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "forceMove", [rt.sv(f, "loc")]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/attack_paw  (code/modules/recycling/disposal-unit.dm:162)
rt.def("/obj/machinery/disposal/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	rt.setSv(f, "flush", (!truthy(rt.sv(f, "flush")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/disposal/proc/attack_ai  (code/modules/recycling/disposal-unit.dm:169)  may sleep
rt.def("/obj/machinery/disposal/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user), 1);
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/attack_hand  (code/modules/recycling/disposal-unit.dm:173)  may sleep
rt.def("/obj/machinery/disposal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(live(user)) && isEqual(rt.fv(f, "loc", live(user)), live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You cannot reach the controls from inside!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(user), 0);
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/eject  (code/modules/recycling/disposal-unit.dm:180)  may sleep
rt.def("/obj/machinery/disposal/proc/eject", function* eject(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
		yield* g.callName(f, live(AM), "pipe_eject", [0]);
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/flush  (code/modules/recycling/disposal-unit.dm:192)  may sleep
rt.def("/obj/machinery/disposal/proc/flush", function* flush(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	rt.setSv(f, "flushing", 1);
	yield* g.srcCall(f, "flushAnimation");
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if (rt.lt(rt.sv(f, "last_sound"), add(rt.worldTime(f), 1))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/disposalflush.ogg"), 50, 0, 0]);
		rt.setSv(f, "last_sound", rt.worldTime(f));
	}
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "newHolderDestination", (H = (yield* g.new_(f, T("/obj/structure/disposalholder"), []))));
	yield* g.callName(f, live(H), "init", [live(f.src)]);
	rt.setSv(f, "air_contents", (yield* g.new_(f, T("/datum/gas_mixture"), [])));
	yield* g.callName(f, live(H), "start", [live(f.src)]);
	rt.setSv(f, "flushing", 0);
	rt.setSv(f, "flush", 0);
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/newHolderDestination  (code/modules/recycling/disposal-unit.dm:209)
rt.def("/obj/machinery/disposal/proc/newHolderDestination", function newHolderDestination(f: Frame, H: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/smallDelivery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setFv(f, "tomail", live(H), 1);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/disposal/proc/flushAnimation  (code/modules/recycling/disposal-unit.dm:214)
rt.def("/obj/machinery/disposal/proc/flushAnimation", function flushAnimation(f: Frame) {
	rt.call(f, P("/proc/flick"), null, [fmt("＀-flush", [rt.sv(f, "icon_state")]), live(f.src)]);
	return f.dot;
});

// /obj/machinery/disposal/proc/power_change  (code/modules/recycling/disposal-unit.dm:218)
rt.def("/obj/machinery/disposal/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/disposal/proc/expel  (code/modules/recycling/disposal-unit.dm:224)  may sleep
rt.def("/obj/machinery/disposal/proc/expel", function* expel(f: Frame, H: Value) {
	let _T: Value = null, target: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [H, _T, target, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	target = null;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0]);
	if (!truthy(live(H))) return f.dot;
	AM = null;
	rt.forList(f, 0, live(H), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		target = (yield* g.call(f, P("/proc/get_offset_target_turf"), null, [rt.fv(f, "loc", live(f.src)), subtract((yield* g.call(f, P("/proc/rand"), null, [5])), (yield* g.call(f, P("/proc/rand"), null, [5]))), subtract((yield* g.call(f, P("/proc/rand"), null, [5])), (yield* g.call(f, P("/proc/rand"), null, [5])))]));
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
		yield* g.callName(f, live(AM), "pipe_eject", [0]);
		yield* g.callName(f, live(AM), "throw_at", [live(target), 5, 1]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(H), "vent_gas", [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	return f.dot;
}, true);

// /obj/machinery/disposal/proc/deconstruct  (code/modules/recycling/disposal-unit.dm:239)  may sleep
rt.def("/obj/machinery/disposal/proc/deconstruct", function* deconstruct(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	_T = rt.sv(f, "loc");
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "stored"))) {
			yield* g.callName(f, rt.sv(f, "stored"), "forceMove", [live(_T)]);
			yield* g.callName(f, live(f.src), "transfer_fingerprints_to", [rt.sv(f, "stored")]);
			rt.setFv(f, "anchored", rt.sv(f, "stored"), 0);
			rt.setFv(f, "density", rt.sv(f, "stored"), 1);
			yield* g.callName(f, rt.sv(f, "stored"), "update_icon", []);
		}
	}
	AM = null;
	rt.forList(f, 0, live(f.src), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/machinery/disposal/proc/storage_contents_dump_act  (code/modules/recycling/disposal-unit.dm:253)  may sleep
rt.def("/obj/machinery/disposal/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [src_object, user, I, $e];
	I = null;
	rt.forList(f, 0, live(src_object), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!isEqual(rt.fv(f, "s_active", live(user)), live(src_object))) {
			if (truthy((yield* g.callName(f, live(I), "on_found", [live(user)])))) {
				return live(f.dot);
			}
		}
		yield* g.callName(f, live(src_object), "remove_from_storage", [live(I), live(f.src)]);
	}
	rt.endFor(f, 0);
	return 1;
}, true);

rt.type(10985, "/obj/machinery/disposal/bin", "/obj/machinery/disposal", {
	name: "disposal unit",
	desc: "A pneumatic waste disposal unit.",
	icon_state: "disposal",
});

// /obj/machinery/disposal/bin/proc/attackby  (code/modules/recycling/disposal-unit.dm:274)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [_T, O, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/storage/bag/trash")) ? 1 : 0))) {
		_T = live(f.args[0]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You empty the bag.</span>"]);
		O = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			yield* g.callName(f, live(_T), "remove_from_storage", [live(O), live(f.src)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(_T), "update_icon", []);
		yield* g.srcCall(f, "update_icon");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/disposal/bin/proc/ui_interact  (code/modules/recycling/disposal-unit.dm:288)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
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
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "loc", live(user)), live(f.src))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot reach the controls from inside!</span>"]);
		return live(f.dot);
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "disposal_unit", rt.sv(f, "name"), 300, 200, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/machinery/disposal/bin/proc/ui_data  (code/modules/recycling/disposal-unit.dm:299)
rt.def("/obj/machinery/disposal/bin/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, per: Value = null;
	f.vars = () => [data, per];
	rt.setAt((data = rt.list()), "flush", rt.sv(f, "flush"));
	rt.setAt(live(data), "full_pressure", rt.sv(f, "full_pressure"));
	rt.setAt(live(data), "pressure_charging", rt.sv(f, "pressure_charging"));
	rt.setAt(live(data), "panel_open", rt.sv(f, "panel_open"));
	per = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [divide(multiply(100, rt.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])), 5.066249847412109), 100])]);
	rt.setAt(live(data), "per", rt.call(f, P("/proc/round"), null, [live(per), 1]));
	rt.setAt(live(data), "isai", (rt.istype(live(user), T("/mob/living/silicon/ai")) ? 1 : 0));
	return live(data);
});

// /obj/machinery/disposal/bin/proc/ui_act  (code/modules/recycling/disposal-unit.dm:310)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/ui_act", function* ui_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "handle-0") {
		rt.setSv(f, "flush", 0);
		yield* g.srcCall(f, "update_icon");
		f.dot = 1;
	} else if ($0 === "handle-1") {
		if (!truthy(rt.sv(f, "panel_open"))) {
			rt.setSv(f, "flush", 1);
			yield* g.srcCall(f, "update_icon");
		}
		f.dot = 1;
	} else if ($0 === "pump-0") {
		if (truthy(rt.sv(f, "pressure_charging"))) {
			rt.setSv(f, "pressure_charging", 0);
			yield* g.srcCall(f, "update_icon");
		}
		f.dot = 1;
	} else if ($0 === "pump-1") {
		if (!truthy(rt.sv(f, "pressure_charging"))) {
			rt.setSv(f, "pressure_charging", 1);
			yield* g.srcCall(f, "update_icon");
		}
		f.dot = 1;
	} else if ($0 === "eject") {
		yield* g.srcCall(f, "eject");
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/machinery/disposal/bin/proc/CanPass  (code/modules/recycling/disposal-unit.dm:337)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let I: Value = null;
	f.vars = () => [mover, target, height, I];
	if (live(height) === null) {
		height = 0;
	}
	if ((truthy((rt.istype(live(mover), T("/obj/item")) ? 1 : 0)) && truthy(rt.fv(f, "throwing", live(mover))))) {
		if (truthy((rt.istype((I = live(mover)), T("/obj/item/projectile")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ lands in ＀.</span>", [live(I), live(f.src)]));
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ bounces off of ＀'s rim!</span>", [live(I), live(f.src)]));
		}
		return 0;
	} else {
		return (yield* g.callSuper(f, [live(mover), live(target), live(height)]));
	}
	return f.dot;
}, true);

// /obj/machinery/disposal/bin/proc/flush  (code/modules/recycling/disposal-unit.dm:352)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/flush", function* flush(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "full_pressure", 0);
	rt.setSv(f, "pressure_charging", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/machinery/disposal/bin/proc/update_icon  (code/modules/recycling/disposal-unit.dm:358)
rt.def("/obj/machinery/disposal/bin/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "pressure_charging", 0);
		rt.setSv(f, "flush", 0);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "flush"))) {
		rt.callSrc(f, "add_overlay", ["dispover-handle"]);
	}
	if ((truthy(rt.bitAnd(rt.sv(f, "stat"), 2)) || truthy(rt.sv(f, "panel_open")))) {
		return live(f.dot);
	}
	if (rt.gt(rt.len(f, rt.sv(f, "contents")), 0)) {
		rt.callSrc(f, "add_overlay", ["dispover-full"]);
	}
	if (truthy(rt.sv(f, "pressure_charging"))) {
		rt.callSrc(f, "add_overlay", ["dispover-charge"]);
	} else {
		if (!truthy(rt.sv(f, "full_pressure"))) return f.dot;
		rt.callSrc(f, "add_overlay", ["dispover-ready"]);
	}
	return f.dot;
});

// /obj/machinery/disposal/bin/proc/process  (code/modules/recycling/disposal-unit.dm:385)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/process", function* process(f: Frame) {
	let L: Value = null, env: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	f.vars = () => [L, env, pressure_delta, transfer_moles, removed];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "flush_count", 1, true);
	if (rt.ge(rt.sv(f, "flush_count"), rt.sv(f, "flush_every_ticks"))) {
		if (truthy(rt.len(f, rt.sv(f, "contents")))) {
			if (truthy(rt.sv(f, "full_pressure"))) {
				rt.spawnTail(f, 0, "/obj/machinery/disposal/bin/proc/process: spawn at modules/recycling/disposal-unit.dm:392", L, env, pressure_delta, transfer_moles, removed);
			}
		}
		rt.setSv(f, "flush_count", 0);
	}
	yield* g.srcCall(f, "updateDialog");
	if ((truthy(rt.sv(f, "flush")) && rt.ge((yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])), 5.066249847412109))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/disposal/bin/proc/flush")]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 100);
	if (!truthy(rt.sv(f, "pressure_charging"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "use_power", 500);
	L = rt.sv(f, "loc");
	env = (yield* g.callName(f, live(L), "return_air", []));
	pressure_delta = subtract(5.116912364959717, (yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])));
	if (rt.gt(rt.fv(f, "temperature", live(env)), 0)) {
		transfer_moles = divide(multiply(multiply(0.10000000149011612, live(pressure_delta)), rt.fv(f, "volume", rt.sv(f, "air_contents"))), multiply(rt.fv(f, "temperature", live(env)), 8.3100004196167));
		removed = (yield* g.callName(f, live(env), "remove", [live(transfer_moles)]));
		yield* g.callName(f, rt.sv(f, "air_contents"), "merge", [live(removed)]);
		yield* g.srcCall(f, "air_update_turf");
	}
	if (rt.ge((yield* g.callName(f, rt.sv(f, "air_contents"), "return_pressure", [])), 5.066249847412109)) {
		rt.setSv(f, "full_pressure", 1);
		rt.setSv(f, "pressure_charging", 0);
		yield* g.srcCall(f, "update_icon");
	}
	return live(f.dot);
}, true, { waitfor: false });

// a spawn(0) body of /obj/machinery/disposal/bin/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/disposal/bin/proc/process: spawn at modules/recycling/disposal-unit.dm:392", function* (f: Frame, L: Value, env: Value, pressure_delta: Value, transfer_moles: Value, removed: Value) {
	f.vars = () => [L, env, pressure_delta, transfer_moles, removed];
	yield* g.srcCall(f, "flush");
	return null;
});

// /obj/machinery/disposal/bin/proc/get_remote_view_fullscreens  (code/modules/recycling/disposal-unit.dm:435)  may sleep
rt.def("/obj/machinery/disposal/bin/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(isEqual(rt.fv(f, "stat", live(user)), 2) || !truthy(rt.bitAnd(rt.fv(f, "sight", live(user)), 12)))) return f.dot;
	yield* g.callName(f, live(user), "overlay_fullscreen", ["remote_view", T("/obj/screen/fullscreen/impaired"), 2]);
	return f.dot;
}, true);

rt.type(10986, "/obj/machinery/disposal/deliveryChute", "/obj/machinery/disposal", {
	pressure_charging: 0,
	name: "delivery chute",
	desc: "A chute for big and small packages alike!",
	density: 1,
	icon_state: "intake",
});

// /obj/machinery/disposal/deliveryChute/proc/Initialize  (code/modules/recycling/disposal-unit.dm:448)  may sleep
rt.def("/obj/machinery/disposal/deliveryChute/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "ptype", rt.sv(f, "stored"), 8);
	rt.spawnTail(f, 5, "/obj/machinery/disposal/deliveryChute/proc/Initialize: spawn at modules/recycling/disposal-unit.dm:450");
	return f.dot;
}, true, { args: ["mapload", "make_from"] });

// a spawn(5) body of /obj/machinery/disposal/deliveryChute/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/disposal/deliveryChute/proc/Initialize: spawn at modules/recycling/disposal-unit.dm:450", function* (f: Frame) {
	rt.setSv(f, "trunk", rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), rt.sv(f, "loc")));
	if (truthy(rt.sv(f, "trunk"))) {
		rt.setFv(f, "linked", rt.sv(f, "trunk"), live(f.src));
	}
	return null;
});

// /obj/machinery/disposal/deliveryChute/proc/place_item_in_disposal  (code/modules/recycling/disposal-unit.dm:456)  may sleep
rt.def("/obj/machinery/disposal/deliveryChute/proc/place_item_in_disposal", function* place_item_in_disposal(f: Frame) {
	if (!truthy((yield* g.callName(f, live(f.args[0]), "disposalEnterTry", [])))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "flush");
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/machinery/disposal/deliveryChute/proc/Bumped  (code/modules/recycling/disposal-unit.dm:461)  may sleep
rt.def("/obj/machinery/disposal/deliveryChute/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let O: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [AM, O, M, $0];
	if (!truthy((yield* g.callName(f, live(AM), "disposalEnterTry", [])))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "dir");
	if ($0 === 1) {
		if (!isEqual(rt.gv(f, "y", rt.fv(f, "loc", live(AM))), add(rt.fv(f, "y", rt.sv(f, "loc")), 1))) {
			return live(f.dot);
		}
	} else if ($0 === 4) {
		if (!isEqual(rt.gv(f, "x", rt.fv(f, "loc", live(AM))), add(rt.fv(f, "x", rt.sv(f, "loc")), 1))) {
			return live(f.dot);
		}
	} else if ($0 === 2) {
		if (!isEqual(rt.gv(f, "y", rt.fv(f, "loc", live(AM))), subtract(rt.fv(f, "y", rt.sv(f, "loc")), 1))) {
			return live(f.dot);
		}
	} else if ($0 === 8) {
		if (!isEqual(rt.gv(f, "x", rt.fv(f, "loc", live(AM))), subtract(rt.fv(f, "x", rt.sv(f, "loc")), 1))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(AM), T("/obj")) ? 1 : 0))) {
		rt.setFv(f, "loc", (O = live(AM)), live(f.src));
	} else {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
			M = live(AM);
			if (truthy(rt.op(f, "Prob", [], [2]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You hit the edge of the chute.</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(M), "forceMove", [live(f.src)]);
		}
	}
	yield* g.srcCall(f, "flush");
	return f.dot;
}, true);

// /obj/machinery/disposal/deliveryChute/proc/newHolderDestination  (code/modules/recycling/disposal-unit.dm:497)
rt.def("/obj/machinery/disposal/deliveryChute/proc/newHolderDestination", function newHolderDestination(f: Frame, H: Value) {
	rt.setFv(f, "destinationTag", live(H), 1);
	return f.dot;
});
