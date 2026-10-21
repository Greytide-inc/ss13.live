// From code/game/objects/items/theft_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9782, "/obj/item/nuke_core", "/obj/item", {
	pulse: 0,
	cooldown: 0,
	pulseicon: "plutonium_core_pulse",
	item_state: "plutoniumcore",
	name: "plutonium core",
	desc: "Extremely radioactive. Wear goggles.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "plutonium_core",
	resistance_flags: 99,
});

// /obj/item/nuke_core/proc/Initialize  (code/game/objects/items/theft_tools.dm:19)  may sleep
rt.def("/obj/item/nuke_core/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/nuke_core/proc/Destroy  (code/game/objects/items/theft_tools.dm:23)  may sleep
rt.def("/obj/item/nuke_core/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/nuke_core/proc/attackby  (code/game/objects/items/theft_tools.dm:27)  may sleep
rt.def("/obj/item/nuke_core/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/nuke_core_container")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[0]), "load", [live(f.src), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["container", "user"] });

// /obj/item/nuke_core/proc/process  (code/game/objects/items/theft_tools.dm:33)  may sleep
rt.def("/obj/item/nuke_core/proc/process", function* process(f: Frame) {
	if (!rt.lt(rt.sv(f, "cooldown"), subtract(rt.worldTime(f), 60))) return f.dot;
	rt.setSv(f, "cooldown", rt.worldTime(f));
	yield* g.call(f, P("/proc/flick"), null, [rt.sv(f, "pulseicon"), live(f.src)]);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 1, 4, 40, 1]);
	return f.dot;
}, true, { waitfor: false });

rt.type(9784, "/obj/item/nuke_core_container", "/obj/item", {
	core: null,
	item_state: "tile",
	name: "nuke core container",
	desc: "Solid container for radioactive objects.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "core_container_empty",
});

// /obj/item/nuke_core_container/proc/Destroy  (code/game/objects/items/theft_tools.dm:48)  may sleep
rt.def("/obj/item/nuke_core_container/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "core")]);
	rt.setSv(f, "core", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/nuke_core_container/proc/load  (code/game/objects/items/theft_tools.dm:52)  may sleep
rt.def("/obj/item/nuke_core_container/proc/load", function* load(f: Frame, ncore: Value, user: Value) {
	f.vars = () => [ncore, user];
	if ((truthy(rt.sv(f, "core")) || !truthy((rt.istype(live(ncore), T("/obj/item/nuke_core")) ? 1 : 0)))) {
		return 0;
	}
	yield* g.callName(f, live(ncore), "forceMove", [live(f.src)]);
	rt.setSv(f, "core", live(ncore));
	rt.setSv(f, "icon_state", "core_container_loaded");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Container is sealing...</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/nuke_core_container/proc/seal")])), 50]);
	return 1;
}, true);

// /obj/item/nuke_core_container/proc/seal  (code/game/objects/items/theft_tools.dm:62)
rt.def("/obj/item/nuke_core_container/proc/seal", function seal(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "core"), T("/obj/item/nuke_core")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "isprocessing", rt.sv(f, "core"), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", rt.sv(f, "core"), subtract));
	rt.setSv(f, "icon_state", "core_container_sealed");
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 60, 1]);
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='warning'>＀ is permanently sealed, ＀'s radiation is contained.</span>", [live(f.src), rt.sv(f, "core")])]);
	return f.dot;
});

// /obj/item/nuke_core_container/proc/attackby  (code/game/objects/items/theft_tools.dm:70)  may sleep
rt.def("/obj/item/nuke_core_container/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/nuke_core")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ is stuck to your hand!</span>", [live(f.args[0])])]);
			return live(f.dot);
		} else {
			yield* g.srcCall(f, "load", live(f.args[0]), live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["core", "user"] });

rt.type(9783, "/obj/item/nuke_core/supermatter_sliver", "/obj/item/nuke_core", {
	item_state: "supermattersliver",
	pulseicon: "supermatter_sliver_pulse",
	name: "supermatter sliver",
	desc: "A tiny, highly volatile sliver of a supermatter crystal. Do not handle without protection!",
	icon_state: "supermatter_sliver",
});

// /obj/item/nuke_core/supermatter_sliver/proc/attackby  (code/game/objects/items/theft_tools.dm:126)  may sleep
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let tongs: Value = null;
	f.vars = () => [W, user, params, tongs];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/hemostat/supermatter")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "sliver", (tongs = live(W))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is already holding a supermatter sliver!</span>", [live(tongs)])]);
			return 0;
		}
		yield* g.srcCall(f, "forceMove", live(tongs));
		rt.setFv(f, "sliver", live(tongs), live(f.src));
		rt.setFv(f, "icon_state", live(tongs), "supermatter_tongs_loaded");
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You carefully pick up ＀ with ＀.</span>", [live(f.src), live(tongs)])]);
	} else {
		if ((truthy((rt.istype(live(W), T("/obj/item/weapon/scalpel/supermatter")) ? 1 : 0)) || truthy((rt.istype(live(W), T("/obj/item/nuke_core_container/supermatter")) ? 1 : 0)))) {
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>As it touches ％！, both ％！ and ％！ burst into dust!</span>", [live(f.src), live(f.src), live(W)])]);
			yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(user), 0), 1, 2, 10, 1]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	return f.dot;
}, true);

// /obj/item/nuke_core/supermatter_sliver/proc/pickup  (code/game/objects/items/theft_tools.dm:145)  may sleep
rt.def("/obj/item/nuke_core/supermatter_sliver/proc/pickup", function* pickup(f: Frame) {
	let ded: Value = null;
	f.vars = () => [ded];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		return 0;
	}
	ded = live(f.args[0]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You reach for the supermatter sliver with your hands. That was dumb.</span>"]);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.args[0]), 0), 2, 4, 50, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.args[0]), 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	yield* g.callName(f, live(ded), "dust", []);
	return f.dot;
}, true, { args: ["user"] });

rt.type(9785, "/obj/item/nuke_core_container/supermatter", "/obj/item/nuke_core_container", {
	sliver: null,
	name: "supermatter bin",
	desc: "A tiny receptacle that releases an inert freon mix upon sealing, allowing a sliver of a supermatter crystal to be safely stored..",
});

// /obj/item/nuke_core_container/supermatter/proc/Destroy  (code/game/objects/items/theft_tools.dm:160)  may sleep
rt.def("/obj/item/nuke_core_container/supermatter/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sliver")]);
	rt.setSv(f, "sliver", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/nuke_core_container/supermatter/proc/load  (code/game/objects/items/theft_tools.dm:164)  may sleep
rt.def("/obj/item/nuke_core_container/supermatter/proc/load", function* load(f: Frame, _T: Value, user: Value) {
	f.vars = () => [_T, user];
	if ((!truthy((rt.istype(live(_T), T("/obj/item/weapon/hemostat/supermatter")) ? 1 : 0)) || !truthy(rt.fv(f, "sliver", live(_T))))) {
		return 0;
	}
	yield* g.callName(f, rt.fv(f, "sliver", live(_T)), "forceMove", [live(f.src)]);
	rt.setSv(f, "sliver", rt.fv(f, "sliver", live(_T)));
	rt.setFv(f, "sliver", live(_T), null);
	rt.setSv(f, "icon_state", "core_container_loaded");
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Container is sealing...</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/nuke_core_container/supermatter/proc/seal")])), 50]);
	return 1;
}, true);

// /obj/item/nuke_core_container/supermatter/proc/seal  (code/game/objects/items/theft_tools.dm:175)
rt.def("/obj/item/nuke_core_container/supermatter/proc/seal", function seal(f: Frame) {
	if (!truthy((rt.istype(rt.sv(f, "sliver"), T("/obj/item/nuke_core/supermatter_sliver")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "isprocessing", rt.sv(f, "sliver"), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", rt.sv(f, "sliver"), subtract));
	rt.setSv(f, "icon_state", "core_container_sealed");
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 60, 1]);
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='warning'>＀ is permanently sealed, ＀ is safely contained.</span>", [live(f.src), rt.sv(f, "sliver")])]);
	return f.dot;
});

// /obj/item/nuke_core_container/supermatter/proc/attackby  (code/game/objects/items/theft_tools.dm:183)  may sleep
rt.def("/obj/item/nuke_core_container/supermatter/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hemostat/supermatter")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ is stuck to your hand!</span>", [live(f.args[0])])]);
		} else {
			yield* g.srcCall(f, "load", rt.sv(f, "sliver"), live(f.args[1]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["tongs", "user"] });

rt.type(6660, "/obj/item/weapon/hemostat/supermatter", "/obj/item/weapon/hemostat", {
	sliver: null,
	name: "supermatter extraction tongs",
	desc: "A pair of tongs made from condensed freon gas, searingly cold to the touch, that can safely grip a supermatter sliver.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "supermatter_tongs",
	toolspeed: 0.75,
	damtype: "fire",
});

// /obj/item/weapon/hemostat/supermatter/proc/Destroy  (code/game/objects/items/theft_tools.dm:210)  may sleep
rt.def("/obj/item/weapon/hemostat/supermatter/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sliver")]);
	rt.setSv(f, "sliver", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/hemostat/supermatter/proc/afterattack  (code/game/objects/items/theft_tools.dm:214)  may sleep
rt.def("/obj/item/weapon/hemostat/supermatter/proc/afterattack", function* afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	f.vars = () => [O, user, proximity];
	if (!truthy(rt.sv(f, "sliver"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(O), T("/atom/movable")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "Consume", live(O));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＄！ is dusted along with ％！!</span>", [rt.sv(f, "sliver"), live(O)])]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sliver")]);
	rt.setSv(f, "sliver", null);
	return f.dot;
}, true);

// /obj/item/weapon/hemostat/supermatter/proc/throw_impact  (code/game/objects/items/theft_tools.dm:223)  may sleep
rt.def("/obj/item/weapon/hemostat/supermatter/proc/throw_impact", function* throw_impact(f: Frame) {
	if (truthy(rt.sv(f, "sliver"))) {
		yield* g.callName(f, rt.sv(f, "sliver"), "forceMove", [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>＄！ falls out of ％！ as you throw them.</span>", [rt.sv(f, "sliver"), live(f.src)])]);
		rt.setSv(f, "sliver", null);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/hemostat/supermatter/proc/Consume  (code/game/objects/items/theft_tools.dm:229)  may sleep
rt.def("/obj/item/weapon/hemostat/supermatter/proc/Consume", function* Consume(f: Frame, AM: Value, user: Value) {
	let victim: Value = null;
	f.vars = () => [AM, user, victim];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		yield* g.callName(f, (victim = live(AM)), "dust", []);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has consumed ＀ ＀.", [live(f.src), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(victim)])), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(f.src)), rt.fv(f, "y", live(f.src)), rt.fv(f, "z", live(f.src))])])]);
		yield* g.srcCall(f, "investigate_log", fmt("has consumed ＀.", [(yield* g.call(f, P("/proc/key_name"), null, [live(victim)]))]), "supermatter");
	} else {
		yield* g.srcCall(f, "investigate_log", fmt("has consumed ＀.", [live(AM)]), "supermatter");
		yield* g.call(f, P("/proc/qdel"), null, [live(AM)]);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>As ＀ touches ％！ with ＇！, silence fills the room...</span>", [live(user), live(AM), live(f.src)]), fmt("<span class='userdanger'>You touch ％！ with ％！, and everything suddenly goes silent.</span>\n<span class='notice'>＄！ flashes into dust, and soon as you can register this, you do as well.</span>", [live(AM), live(f.src), live(AM)]), "<span class='italics'>Everything suddenly goes silent.</span>"]);
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(user), 0), 2, 4, 50, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/supermatter.ogg"), 50, 1]);
	yield* g.callName(f, live(user), "dust", []);
	rt.setSv(f, "icon_state", "supermatter_tongs");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "sliver")]);
	rt.setSv(f, "sliver", null);
	return f.dot;
}, true);
