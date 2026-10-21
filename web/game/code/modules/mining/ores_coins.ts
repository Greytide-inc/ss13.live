// From code/modules/mining/ores_coins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7036, "/obj/item/weapon/ore", "/obj/item/weapon", {
	points: 0,
	refined_type: null,
	name: "rock",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "ore",
});

// /obj/item/weapon/ore/proc/attackby  (code/modules/mining/ores_coins.dm:16)  may sleep
rt.def("/obj/item/weapon/ore/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if ((truthy((yield* g.callName(f, (W = live(f.args[0])), "remove_fuel", [15]))) && truthy(rt.sv(f, "refined_type")))) {
			yield* g.new_(f, rt.sv(f, "refined_type"), [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			if (truthy((yield* g.callName(f, live(W), "isOn", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='info'>Not enough fuel to smelt ＀.</span>", [live(f.src)])]);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/ore/proc/Crossed  (code/modules/mining/ores_coins.dm:27)  may sleep
rt.def("/obj/item/weapon/ore/proc/Crossed", function* Crossed(f: Frame) {
	let OB: Value = null, F: Value = null, H: Value = null, thing: Value = null, R: Value = null, L: Value = null, box: Value = null;
	let $e: any;
	f.vars = () => [OB, F, H, thing, R, L, box, $e];
	OB = null;
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open/floor/plating/asteroid")) ? 1 : 0))) {
		F = rt.sv(f, "loc");
		if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(f.args[0]);
			thing = null;
			rt.forList(f, 0, (yield* g.callName(f, live(H), "get_storage_slots", [])));
			while (($e = rt.next(f, 0)) !== undefined) {
				thing = $e;
				if (truthy((rt.istype(live(thing), T("/obj/item/weapon/storage/bag/ore")) ? 1 : 0))) {
					OB = live(thing);
					break;
				}
			}
			rt.endFor(f, 0);
			thing = null;
			rt.forList(f, 0, rt.fv(f, "held_items", live(H)));
			while (($e = rt.next(f, 0)) !== undefined) {
				thing = $e;
				if (truthy((rt.istype(live(thing), T("/obj/item/weapon/storage/bag/ore")) ? 1 : 0))) {
					OB = live(thing);
					break;
				}
			}
			rt.endFor(f, 0);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
				R = live(f.args[0]);
				thing = null;
				rt.forList(f, 0, rt.fv(f, "module_active", live(R)));
				while (($e = rt.next(f, 0)) !== undefined) {
					thing = $e;
					if (truthy((rt.istype(live(thing), T("/obj/item/weapon/storage/bag/ore")) ? 1 : 0))) {
						OB = live(thing);
						break;
					}
				}
				rt.endFor(f, 0);
			}
		}
		if (truthy(live(OB))) {
			yield* g.callName(f, live(F), "attackby", [live(OB), live(f.args[0])]);
			if (truthy((rt.istype(rt.gv(f, "pulling", (L = live(f.args[0]))), T("/obj/structure/ore_box")) ? 1 : 0))) {
				yield* g.callName(f, (box = rt.fv(f, "pulling", live(L))), "attackby", [live(OB), live(f.args[0])]);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM"] });

rt.type(7040, "/obj/item/weapon/ore/uranium", "/obj/item/weapon/ore", {
	points: 30,
	name: "uranium ore",
	icon_state: "Uranium ore",
	origin_tech: "materials=5",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
});

// /obj/item/weapon/ore/uranium/proc/<init>  (code/modules/mining/ores_coins.dm:60)
rt.def("/obj/item/weapon/ore/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$uranium", 2000]));
	return f.dot;
});

rt.type(7041, "/obj/item/weapon/ore/iron", "/obj/item/weapon/ore", {
	points: 1,
	name: "iron ore",
	icon_state: "Iron ore",
	origin_tech: "materials=1",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/metal"),
});

// /obj/item/weapon/ore/iron/proc/<init>  (code/modules/mining/ores_coins.dm:68)
rt.def("/obj/item/weapon/ore/iron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

rt.type(7042, "/obj/item/weapon/ore/glass", "/obj/item/weapon/ore", {
	points: 1,
	name: "sand pile",
	icon_state: "Glass ore",
	origin_tech: "materials=1",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/glass"),
	w_class: 1,
});

// /obj/item/weapon/ore/glass/proc/<init>  (code/modules/mining/ores_coins.dm:76)
rt.def("/obj/item/weapon/ore/glass/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 2000]));
	return f.dot;
});

// /obj/item/weapon/ore/glass/proc/attack_self  (code/modules/mining/ores_coins.dm:81)  may sleep
rt.def("/obj/item/weapon/ore/glass/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let sandAmt: Value = null, G: Value = null, SS: Value = null, SA: Value = null;
	let $e: any;
	f.vars = () => [user, sandAmt, G, SS, SA, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You use the sand to make sandstone.</span>"]);
	sandAmt = 1;
	G = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(user)), T("/obj/item/weapon/ore/glass"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		sandAmt = rt.modify(live(sandAmt), 1, add);
		yield* g.call(f, P("/proc/qdel"), null, [live(G)]);
	}
	rt.endFor(f, 0);
	while (rt.gt(live(sandAmt), 0)) {
		SS = (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/sandstone"), [rt.fv(f, "loc", live(user))]));
		if (rt.ge(live(sandAmt), rt.fv(f, "max_amount", live(SS)))) {
			rt.setFv(f, "amount", live(SS), rt.fv(f, "max_amount", live(SS)));
		} else {
			rt.setFv(f, "amount", live(SS), live(sandAmt));
			SA = null;
			rt.forList(f, 0, rt.fv(f, "loc", live(user)), T("/obj/item/stack/sheet/mineral/sandstone"));
			while (($e = rt.next(f, 0)) !== undefined) {
				SA = $e;
				if ((!isEqual(live(SA), live(SS)) && rt.lt(rt.fv(f, "amount", live(SA)), rt.fv(f, "max_amount", live(SA))))) {
					yield* g.callName(f, live(SA), "attackby", [live(SS), live(user)]);
				}
			}
			rt.endFor(f, 0);
		}
		(sandAmt = rt.modify(live(sandAmt), rt.fv(f, "max_amount", live(SS)), subtract));
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/item/weapon/ore/glass/proc/throw_impact  (code/modules/mining/ores_coins.dm:100)  may sleep
rt.def("/obj/item/weapon/ore/glass/proc/throw_impact", function* throw_impact(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((truthy(rt.gv(f, "head", (C = live(f.args[0])))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(C))), 4)))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s headgear blocks the sand!</span>", [live(C)]));
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "wear_mask", live(C))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(C))), 2)))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s mask blocks the sand!</span>", [live(C)]));
		return live(f.dot);
	}
	if ((truthy(rt.fv(f, "glasses", live(C))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "glasses", live(C))), 1)))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s glasses block the sand!</span>", [live(C)]));
		return live(f.dot);
	}
	yield* g.callName(f, live(C), "adjust_blurriness", [6]);
	yield* g.callName(f, live(C), "adjustStaminaLoss", [15]);
	rt.modField(f, live(C), "confused", 5, add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='userdanger'>＄！ gets into your eyes! The pain, it burns!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(7044, "/obj/item/weapon/ore/plasma", "/obj/item/weapon/ore", {
	points: 15,
	name: "plasma ore",
	icon_state: "Plasma ore",
	origin_tech: "plasmatech=2;materials=2",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
});

// /obj/item/weapon/ore/plasma/proc/<init>  (code/modules/mining/ores_coins.dm:127)
rt.def("/obj/item/weapon/ore/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$plasma", 2000]));
	return f.dot;
});

// /obj/item/weapon/ore/plasma/proc/attackby  (code/modules/mining/ores_coins.dm:131)  may sleep
rt.def("/obj/item/weapon/ore/plasma/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "welding", (W = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't hit a high enough temperature to smelt ＀ properly!</span>", [live(f.src)])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(7045, "/obj/item/weapon/ore/silver", "/obj/item/weapon/ore", {
	points: 16,
	name: "silver ore",
	icon_state: "Silver ore",
	origin_tech: "materials=3",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// /obj/item/weapon/ore/silver/proc/<init>  (code/modules/mining/ores_coins.dm:144)
rt.def("/obj/item/weapon/ore/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 2000]));
	return f.dot;
});

rt.type(7046, "/obj/item/weapon/ore/gold", "/obj/item/weapon/ore", {
	points: 18,
	name: "gold ore",
	icon_state: "Gold ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
});

// /obj/item/weapon/ore/gold/proc/<init>  (code/modules/mining/ores_coins.dm:152)
rt.def("/obj/item/weapon/ore/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 2000]));
	return f.dot;
});

rt.type(7047, "/obj/item/weapon/ore/diamond", "/obj/item/weapon/ore", {
	points: 50,
	name: "diamond ore",
	icon_state: "Diamond ore",
	origin_tech: "materials=6",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
});

// /obj/item/weapon/ore/diamond/proc/<init>  (code/modules/mining/ores_coins.dm:160)
rt.def("/obj/item/weapon/ore/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$diamond", 2000]));
	return f.dot;
});

rt.type(7048, "/obj/item/weapon/ore/bananium", "/obj/item/weapon/ore", {
	points: 60,
	name: "bananium ore",
	icon_state: "Clown ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
});

// /obj/item/weapon/ore/bananium/proc/<init>  (code/modules/mining/ores_coins.dm:168)
rt.def("/obj/item/weapon/ore/bananium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bananium", 2000]));
	return f.dot;
});

rt.type(7049, "/obj/item/weapon/ore/titanium", "/obj/item/weapon/ore", {
	points: 50,
	name: "titanium ore",
	icon_state: "Titanium ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
});

// /obj/item/weapon/ore/titanium/proc/<init>  (code/modules/mining/ores_coins.dm:176)
rt.def("/obj/item/weapon/ore/titanium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$titanium", 2000]));
	return f.dot;
});

rt.type(5631, "/obj/item/weapon/twohanded/required/gibtonite", "/obj/item/weapon/twohanded/required", {
	primed: 0,
	det_time: 100,
	quality: 1,
	attacher: "UNKNOWN",
	det_timer: null,
	throw_range: 0,
	name: "gibtonite ore",
	desc: "Extremely explosive if struck with mining equipment, Gibtonite is often used by miners to speed up their work by using it as a mining charge. This material is illegal to possess by unauthorized personnel under space law.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "Gibtonite ore",
	item_state: "Gibtonite ore",
	w_class: 4,
});

// /obj/item/weapon/twohanded/required/gibtonite/proc/Destroy  (code/modules/mining/ores_coins.dm:199)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/twohanded/required/gibtonite/proc/attackby  (code/modules/mining/ores_coins.dm:204)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(rt.sv(f, "wires")) && truthy((rt.istype(live(f.args[0]), T("/obj/item/device/assembly/igniter")) ? 1 : 0)))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ attaches ＀ to ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
		rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/explosive/gibtonite"), [live(f.src)])));
		rt.setSv(f, "attacher", (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		yield* g.srcCall(f, "add_overlay", "Gibtonite_igniter");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "wires")) && !truthy(rt.sv(f, "primed")))) {
		if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
			yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
			return live(f.dot);
		}
	}
	if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pickaxe")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/resonator")) ? 1 : 0))) || rt.ge(rt.fv(f, "force", live(f.args[0])), 10))) {
		yield* g.srcCall(f, "GibtoniteReaction", live(f.args[1]));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "primed"))) {
		if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mining_scanner")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/t_scanner/adv_mining_scanner")) ? 1 : 0))) || truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)))) {
			rt.setSv(f, "primed", 0);
			if (truthy(rt.sv(f, "det_timer"))) {
				yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "det_timer")]);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", ["The chain reaction was stopped! ...The ore's quality looks diminished.", "<span class='notice'>You stopped the chain reaction. ...The ore's quality looks diminished.</span>"]);
			rt.setSv(f, "icon_state", "Gibtonite ore");
			rt.setSv(f, "quality", 1);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/twohanded/required/gibtonite/proc/attack_self  (code/modules/mining/ores_coins.dm:233)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/attack_self", function* attack_self(f: Frame) {
	if (truthy(rt.sv(f, "wires"))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[0])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/required/gibtonite/proc/bullet_act  (code/modules/mining/ores_coins.dm:238)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.srcCall(f, "GibtoniteReaction", rt.fv(f, "firer", live(f.args[0])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["P"] });

// /obj/item/weapon/twohanded/required/gibtonite/proc/ex_act  (code/modules/mining/ores_coins.dm:242)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.srcCall(f, "GibtoniteReaction", null, 1);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/twohanded/required/gibtonite/proc/GibtoniteReaction  (code/modules/mining/ores_coins.dm:247)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/GibtoniteReaction", function* GibtoniteReaction(f: Frame, user: Value, triggered_by: Value) {
	let bombturf: Value = null, A: Value = null, notify_admins: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, triggered_by, bombturf, A, notify_admins, $0, $1, $2];
	if (live(triggered_by) === null) {
		triggered_by = 0;
	}
	if (truthy(rt.sv(f, "primed"))) return f.dot;
	rt.setSv(f, "primed", 1);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 50, 1]);
	rt.setSv(f, "icon_state", "Gibtonite active");
	bombturf = rt.getStep(f, live(f.src), 0);
	A = (yield* g.call(f, P("/proc/get_area"), null, [live(bombturf)]));
	notify_admins = 0;
	if (!isEqual(rt.sv(f, "z"), 5)) {
		notify_admins = 1;
	}
	if (truthy(live(notify_admins))) {
		if (isEqual(live(triggered_by), 1)) {
			$0 = rt.sv(f, "name");
			if (truthy(live(bombturf))) {
				$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
			} else {
				$1 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("An explosion has triggered a ＀ to detonate at ＀.", [$0, fmt("＀", [$1])])]);
		} else {
			if (isEqual(live(triggered_by), 2)) {
				$0 = rt.sv(f, "name");
				if (truthy(live(bombturf))) {
					$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
				} else {
					$1 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("A signal has triggered a ＀ to detonate at ＀. Igniter attacher: ＀", [$0, fmt("＀", [$1]), fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "attacher")])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "attacher")]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "attacher")])])])]);
			} else {
				$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.sv(f, "attacher")])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.sv(f, "attacher")]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.sv(f, "attacher")])]);
				$1 = rt.sv(f, "name");
				if (truthy(live(bombturf))) {
					$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])]);
				} else {
					$2 = "nonexistent location";
				}
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has triggered a ＀ to detonate at ＀.", [$0, $1, fmt("＀", [$2])])]);
			}
		}
	}
	if (isEqual(live(triggered_by), 1)) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("An explosion has primed a ＀ for detonation at ＀＀", [rt.sv(f, "name"), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
	} else {
		if (isEqual(live(triggered_by), 2)) {
			yield* g.call(f, P("/proc/log_game"), null, [fmt("A signal has primed a ＀ for detonation at ＀＀. Igniter attacher: ＀.", [rt.sv(f, "name"), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))]), (yield* g.call(f, P("/proc/key_name"), null, [rt.sv(f, "attacher")]))])]);
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ strikes ％！, causing a chain reaction!</span>", [live(user), live(f.src)]), fmt("<span class='danger'>You strike ％！, causing a chain reaction.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has primed a ＀ for detonation at ＀＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(user)])), rt.sv(f, "name"), live(A), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(bombturf)), rt.fv(f, "y", live(bombturf)), rt.fv(f, "z", live(bombturf))])])]);
		}
	}
	rt.setSv(f, "det_timer", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/twohanded/required/gibtonite/proc/detonate"), live(notify_admins)])), rt.sv(f, "det_time"), 8])));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/required/gibtonite/proc/detonate  (code/modules/mining/ores_coins.dm:275)  may sleep
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/detonate", function* detonate(f: Frame, notify_admins: Value) {
	let $0: any;
	f.vars = () => [notify_admins, $0];
	if (!truthy(rt.sv(f, "primed"))) return f.dot;
	$0 = rt.sv(f, "quality");
	if ($0 === 3) {
		yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, 2, null, 4, null, 9, "adminlog", live(notify_admins)], rt.Args.Named);
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, 1, null, 2, null, 5, "adminlog", live(notify_admins)], rt.Args.Named);
	} else if ($0 === 1) {
		yield* g.call(f, P("/proc/explosion"), null, [null, live(f.src), null, 0, null, 1, null, 3, "adminlog", live(notify_admins)], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/ore/proc/Initialize  (code/modules/mining/ores_coins.dm:285)  may sleep
rt.def("/obj/item/weapon/ore/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", subtract((yield* g.call(f, P("/proc/rand"), null, [0, 16])), 8));
	rt.setSv(f, "pixel_y", subtract((yield* g.call(f, P("/proc/rand"), null, [0, 8])), 8));
	return f.dot;
}, true);

rt.type(7516, "/obj/item/weapon/coin", "/obj/item/weapon", {
	string_attached: null,
	sideslist: null,
	cmineral: null,
	cooldown: 0,
	value: 1,
	flags: 64,
	icon: rt.rsc("icons/obj/economy.dmi"),
	name: "coin",
	icon_state: "coin__heads",
	force: 1,
	throwforce: 2,
	w_class: 1,
});

// /obj/item/weapon/coin/proc/Initialize  (code/modules/mining/ores_coins.dm:312)  may sleep
rt.def("/obj/item/weapon/coin/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", subtract((yield* g.call(f, P("/proc/rand"), null, [0, 16])), 8));
	rt.setSv(f, "pixel_y", subtract((yield* g.call(f, P("/proc/rand"), null, [0, 8])), 8));
	return f.dot;
}, true);

// /obj/item/weapon/coin/proc/examine  (code/modules/mining/ores_coins.dm:317)
rt.def("/obj/item/weapon/coin/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "value"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='info'>It's worth ＀ credit５.</span>", [rt.sv(f, "value")])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(7517, "/obj/item/weapon/coin/gold", "/obj/item/weapon/coin", {
	cmineral: "gold",
	value: 50,
	name: "gold coin",
	icon_state: "coin_gold_heads",
	materials: null,
});

// /obj/item/weapon/coin/gold/proc/<init>  (code/modules/mining/ores_coins.dm:326)
rt.def("/obj/item/weapon/coin/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 400]));
	return f.dot;
});

rt.type(7518, "/obj/item/weapon/coin/silver", "/obj/item/weapon/coin", {
	cmineral: "silver",
	value: 20,
	name: "silver coin",
	icon_state: "coin_silver_heads",
	materials: null,
});

// /obj/item/weapon/coin/silver/proc/<init>  (code/modules/mining/ores_coins.dm:333)
rt.def("/obj/item/weapon/coin/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 400]));
	return f.dot;
});

rt.type(7519, "/obj/item/weapon/coin/diamond", "/obj/item/weapon/coin", {
	cmineral: "diamond",
	value: 500,
	name: "diamond coin",
	icon_state: "coin_diamond_heads",
	materials: null,
});

// /obj/item/weapon/coin/diamond/proc/<init>  (code/modules/mining/ores_coins.dm:340)
rt.def("/obj/item/weapon/coin/diamond/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$diamond", 400]));
	return f.dot;
});

rt.type(7520, "/obj/item/weapon/coin/iron", "/obj/item/weapon/coin", {
	cmineral: "iron",
	value: 1,
	name: "iron coin",
	icon_state: "coin_iron_heads",
	materials: null,
});

// /obj/item/weapon/coin/iron/proc/<init>  (code/modules/mining/ores_coins.dm:347)
rt.def("/obj/item/weapon/coin/iron/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	return f.dot;
});

rt.type(7521, "/obj/item/weapon/coin/plasma", "/obj/item/weapon/coin", {
	cmineral: "plasma",
	value: 100,
	name: "plasma coin",
	icon_state: "coin_plasma_heads",
	materials: null,
});

// /obj/item/weapon/coin/plasma/proc/<init>  (code/modules/mining/ores_coins.dm:354)
rt.def("/obj/item/weapon/coin/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$plasma", 400]));
	return f.dot;
});

rt.type(7522, "/obj/item/weapon/coin/uranium", "/obj/item/weapon/coin", {
	cmineral: "uranium",
	value: 80,
	name: "uranium coin",
	icon_state: "coin_uranium_heads",
	materials: null,
});

// /obj/item/weapon/coin/uranium/proc/<init>  (code/modules/mining/ores_coins.dm:361)
rt.def("/obj/item/weapon/coin/uranium/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$uranium", 400]));
	return f.dot;
});

rt.type(7523, "/obj/item/weapon/coin/clown", "/obj/item/weapon/coin", {
	cmineral: "bananium",
	value: 1000,
	name: "bananium coin",
	icon_state: "coin_bananium_heads",
	materials: null,
});

// /obj/item/weapon/coin/clown/proc/<init>  (code/modules/mining/ores_coins.dm:368)
rt.def("/obj/item/weapon/coin/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$bananium", 400]));
	return f.dot;
});

rt.type(7526, "/obj/item/weapon/coin/twoheaded", "/obj/item/weapon/coin", {
	cmineral: "iron",
	sideslist: null,
	value: 1,
	icon_state: "coin_iron_heads",
	desc: "Hey, this coin's the same on both sides!",
	materials: null,
});

// /obj/item/weapon/coin/twoheaded/proc/<init>  (code/modules/mining/ores_coins.dm:386)
rt.def("/obj/item/weapon/coin/twoheaded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sideslist", rt.list("heads"));
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 400]));
	return f.dot;
});

// /obj/item/weapon/coin/proc/attackby  (code/modules/mining/ores_coins.dm:399)  may sleep
rt.def("/obj/item/weapon/coin/proc/attackby", function* attackby(f: Frame) {
	let CC: Value = null;
	f.vars = () => [CC];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
		CC = live(f.args[0]);
		if (truthy(rt.sv(f, "string_attached"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There already is a string attached to this coin!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(CC), "use", [1])))) {
			yield* g.srcCall(f, "add_overlay", "coin_string_overlay");
			rt.setSv(f, "string_attached", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You attach a string to the coin.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one length of cable to attach a string to the coin!</span>"]);
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "string_attached"))) {
				yield* g.callSuper(f, [], rt.Args.Same);
				return live(f.dot);
			}
			rt.setFv(f, "amount", (CC = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.fv(f, "loc", live(f.args[1]))]))), 1);
			yield* g.callName(f, live(CC), "update_icon", []);
			rt.setSv(f, "overlays", rt.list());
			rt.setSv(f, "string_attached", null);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You detach the string from the coin.</span>"]);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/coin/proc/attack_self  (code/modules/mining/ores_coins.dm:427)  may sleep
rt.def("/obj/item/weapon/coin/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let coinflip: Value = null, oldloc: Value = null;
	f.vars = () => [user, coinflip, oldloc];
	if (!rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) return f.dot;
	if (truthy(rt.sv(f, "string_attached"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The coin won't flip very well with something attached!</span>"]);
		return live(f.dot);
	}
	coinflip = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "sideslist")]);
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 15));
	yield* g.call(f, P("/proc/flick"), null, [fmt("coin_＀_flip", [rt.sv(f, "cmineral")]), live(f.src)]);
	rt.setSv(f, "icon_state", fmt("coin_＀_＀", [rt.sv(f, "cmineral"), live(coinflip)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/items/coinflip.ogg"), 50, 1]);
	oldloc = rt.sv(f, "loc");
	yield* g.call(f, P("/proc/sleep"), null, [15]);
	if (!((isEqual(rt.sv(f, "loc"), live(oldloc)) && truthy(live(user))) && !truthy((yield* g.callName(f, live(user), "incapacitated", []))))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ has flipped ＀. It lands on ＀.", [live(user), live(f.src), live(coinflip)]), fmt("<span class='notice'>You flip ＀. It lands on ＀.</span>", [live(f.src), live(coinflip)]), "<span class='italics'>You hear the clattering of loose change.</span>"]);
	return f.dot;
}, true);
