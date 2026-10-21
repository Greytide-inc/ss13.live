// From code/game/objects/items/devices/radio/electropack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9333, "/obj/item/device/electropack", "/obj/item/device", {
	on: 1,
	code: 2,
	frequency: 1449,
	shock_cooldown: 0,
	flags: 64,
	name: "electropack",
	desc: "Dance my monkeys! DANCE!!!",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "electropack0",
	item_state: "electropack",
	slot_flags: 1024,
	w_class: 5,
	materials: null,
});

// /obj/item/device/electropack/proc/<init>  (code/game/objects/items/devices/radio/electropack.dm:10)
rt.def("/obj/item/device/electropack/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10000, "$glass", 2500]));
	return f.dot;
});

// /obj/item/device/electropack/proc/suicide_act  (code/game/objects/items/devices/radio/electropack.dm:17)
rt.def("/obj/item/device/electropack/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ hooks ＀self to the electropack and spams the trigger! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 2;
});

// /obj/item/device/electropack/proc/Initialize  (code/game/objects/items/devices/radio/electropack.dm:21)  may sleep
rt.def("/obj/item/device/electropack/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_CHAT")]);
	return f.dot;
}, true);

// /obj/item/device/electropack/proc/Destroy  (code/game/objects/items/devices/radio/electropack.dm:26)  may sleep
rt.def("/obj/item/device/electropack/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSradio"))) {
		yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/electropack/proc/attack_hand  (code/game/objects/items/devices/radio/electropack.dm:30)  may sleep
rt.def("/obj/item/device/electropack/proc/attack_hand", function* attack_hand(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (isEqual(live(f.src), rt.fv(f, "back", live(C)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need help taking this off!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/electropack/proc/attackby  (code/game/objects/items/devices/radio/electropack.dm:38)  may sleep
rt.def("/obj/item/device/electropack/proc/attackby", function* attackby(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/head/helmet")) ? 1 : 0))) {
		rt.setFv(f, "icon", (A = (yield* g.new_(f, T("/obj/item/assembly/shock_kit"), [live(f.args[1])]))), rt.rsc("icons/obj/assemblies.dmi"));
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(A)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is stuck to your hand, you cannot attach it to ＀!</span>", [live(f.args[0]), live(f.src)])]);
			return live(f.dot);
		}
		rt.setFv(f, "master", live(f.args[0]), live(A));
		rt.setFv(f, "part1", live(A), live(f.args[0]));
		yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.src), live(A), 1]);
		rt.setSv(f, "master", live(A));
		rt.setFv(f, "part2", live(A), live(f.src));
		yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(A)]);
		yield* g.callName(f, live(A), "add_fingerprint", [live(f.args[1])]);
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(f.src)), 2))) {
			(rt.modField(f, live(A), "flags", 2, rt.bitOr));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/electropack/proc/Topic  (code/game/objects/items/devices/radio/electropack.dm:61)  may sleep
rt.def("/obj/item/device/electropack/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [href, href_list, C, M, $e];
	C = live(f.usr);
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) || isEqual(rt.fv(f, "back", live(C)), live(f.src)))) {
		return live(f.dot);
	}
	if ((((truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) && truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)])))) || truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [rt.sv(f, "master")])))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(href_list), "freq"))) {
			yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.sv(f, "frequency")]);
			rt.setSv(f, "frequency", (yield* g.call(f, P("/proc/sanitize_frequency"), null, [add(rt.sv(f, "frequency"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "freq")])))])));
			yield* g.callName(f, rt.gl("SSradio"), "add_object", [live(f.src), rt.sv(f, "frequency"), rt.gl("RADIO_CHAT")]);
		} else {
			if (truthy(rt.at(live(href_list), "code"))) {
				rt.setSv(f, "code", (yield* g.call(f, P("/proc/round"), null, [(rt.modSrcVar(f, "code", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "code")])), add))])));
				rt.setSv(f, "code", (yield* g.call(f, P("/proc/min"), null, [100, rt.sv(f, "code")])));
				rt.setSv(f, "code", (yield* g.call(f, P("/proc/max"), null, [1, rt.sv(f, "code")])));
			} else {
				if (truthy(rt.at(live(href_list), "power"))) {
					rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
					rt.setSv(f, "icon_state", fmt("electropack＀", [rt.sv(f, "on")]));
				}
			}
		}
		if (!truthy(rt.sv(f, "master"))) {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
				yield* g.srcCall(f, "attack_self", rt.sv(f, "loc"));
			} else {
				M = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, live(f.src)])), T("/mob"));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (truthy(rt.fv(f, "client", live(M)))) {
						yield* g.srcCall(f, "attack_self", live(M));
					}
				}
				rt.endFor(f, 0);
			}
		} else {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "loc", rt.sv(f, "master"))])))) {
				yield* g.srcCall(f, "attack_self", rt.fv(f, "loc", rt.sv(f, "master")));
			} else {
				M = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, rt.sv(f, "master")])), T("/mob"));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (truthy(rt.fv(f, "client", live(M)))) {
						yield* g.srcCall(f, "attack_self", live(M));
					}
				}
				rt.endFor(f, 0);
			}
		}
	} else {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=radio"], false);
		return live(f.dot);
	}
	return live(f.dot);
}, true);

// /obj/item/device/electropack/proc/receive_signal  (code/game/objects/items/devices/radio/electropack.dm:100)  may sleep
rt.def("/obj/item/device/electropack/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let L: Value = null, s: Value = null;
	f.vars = () => [signal, L, s];
	if ((!truthy(live(signal)) || !isEqual(rt.fv(f, "encryption", live(signal)), rt.sv(f, "code")))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "on")))) {
		if (!isEqual(rt.sv(f, "shock_cooldown"), 0)) {
			return live(f.dot);
		}
		rt.setSv(f, "shock_cooldown", 1);
		rt.spawnTail(f, 100, "/obj/item/device/electropack/proc/receive_signal: spawn at game/objects/items/devices/radio/electropack.dm:107", signal, L, s);
		yield* g.call(f, P("/proc/step"), null, [(L = rt.sv(f, "loc")), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='danger'>You feel a sharp shock!</span>"]);
		yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(L)]);
		yield* g.callName(f, live(s), "start", []);
		yield* g.callName(f, live(L), "Knockdown", [100]);
	}
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "receive_signal", []);
	}
	return live(f.dot);
}, true);

// a spawn(100) body of /obj/item/device/electropack/proc/receive_signal, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/electropack/proc/receive_signal: spawn at game/objects/items/devices/radio/electropack.dm:107", function* (f: Frame, signal: Value, L: Value, s: Value) {
	f.vars = () => [signal, L, s];
	rt.setSv(f, "shock_cooldown", 0);
	return null;
});

// /obj/item/device/electropack/proc/attack_self  (code/game/objects/items/devices/radio/electropack.dm:125)  may sleep
rt.def("/obj/item/device/electropack/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [user, dat, $0];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "on"))) {
		$0 = "On";
	} else {
		$0 = "Off";
	}
	dat = fmt("<TT>Turned ＀ -\n<A href='?src=＃;power=1'>Toggle</A><BR>\n<B>Frequency/Code</B> for electropack:<BR>\nFrequency:\n<A href='byond://?src=＃;freq=-10'>-</A>\n<A href='byond://?src=＃;freq=-2'>-</A> ＀\n<A href='byond://?src=＃;freq=2'>+</A>\n<A href='byond://?src=＃;freq=10'>+</A><BR>\n\nCode:\n<A href='byond://?src=＃;code=-5'>-</A>\n<A href='byond://?src=＃;code=-1'>-</A> ＀\n<A href='byond://?src=＃;code=1'>+</A>\n<A href='byond://?src=＃;code=5'>+</A><BR>\n</TT>", [$0, live(f.src), live(f.src), live(f.src), (yield* g.call(f, P("/proc/format_frequency"), null, [rt.sv(f, "frequency")])), live(f.src), live(f.src), live(f.src), live(f.src), rt.sv(f, "code"), live(f.src), live(f.src)]);
	rt.op(f, "Browse", [], [live(user), live(dat), "window=radio"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "radio"]);
	return live(f.dot);
}, true);
