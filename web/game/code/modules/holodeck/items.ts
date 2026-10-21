// From code/modules/holodeck/items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7490, "/obj/item/weapon/holo/esword/green", "/obj/item/weapon/holo/esword", {});

// /obj/item/weapon/holo/esword/green/proc/New  (code/modules/holodeck/items.dm:27)  may sleep
rt.def("/obj/item/weapon/holo/esword/green/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "item_color", "green");
	return f.dot;
}, true);

rt.type(7491, "/obj/item/weapon/holo/esword/red", "/obj/item/weapon/holo/esword", {});

// /obj/item/weapon/holo/esword/red/proc/New  (code/modules/holodeck/items.dm:32)  may sleep
rt.def("/obj/item/weapon/holo/esword/red/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "item_color", "red");
	return f.dot;
}, true);

rt.type(7489, "/obj/item/weapon/holo/esword", "/obj/item/weapon/holo", {
	active: 0,
	throw_speed: 2,
	throw_range: 5,
	name: "holographic energy sword",
	desc: "May the force be with you. Sorta",
	icon_state: "sword0",
	force: 3,
	throwforce: 0,
	w_class: 2,
	hitsound: "swing_hit",
	armour_penetration: 50,
});

// /obj/item/weapon/holo/esword/proc/hit_reaction  (code/modules/holodeck/items.dm:37)
rt.def("/obj/item/weapon/holo/esword/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (truthy(rt.sv(f, "active"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// /obj/item/weapon/holo/esword/proc/attack  (code/modules/holodeck/items.dm:41)  may sleep
rt.def("/obj/item/weapon/holo/esword/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/holo/esword/proc/New  (code/modules/holodeck/items.dm:44)  may sleep
rt.def("/obj/item/weapon/holo/esword/proc/New", function* New(f: Frame) {
	rt.setSv(f, "item_color", rt.op(f, "PickUnweighted", [4], ["red", "blue", "green", "purple"]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/holo/esword/proc/attack_self  (code/modules/holodeck/items.dm:48)
rt.def("/obj/item/weapon/holo/esword/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "force", 30);
		rt.setSv(f, "icon_state", fmt("sword＀", [rt.sv(f, "item_color")]));
		rt.setSv(f, "w_class", 4);
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/blade1.ogg"));
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberon.ogg"), 20, 1]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is now active.</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "force", 3);
		rt.setSv(f, "icon_state", "sword0");
		rt.setSv(f, "w_class", 2);
		rt.setSv(f, "hitsound", "swing_hit");
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberoff.ogg"), 20, 1]);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ can now be concealed.</span>", [live(f.src)])]);
	}
	return live(f.dot);
});

rt.type(9728, "/obj/item/toy/beach_ball/holoball/dodgeball", "/obj/item/toy/beach_ball/holoball", {
	item_state: "dodgeball",
	name: "dodgeball",
	icon_state: "dodgeball",
	desc: "Used for playing the most violent and degrading of childhood games.",
});

// /obj/item/toy/beach_ball/holoball/dodgeball/proc/throw_impact  (code/modules/holodeck/items.dm:82)  may sleep
rt.def("/obj/item/toy/beach_ball/holoball/dodgeball/proc/throw_impact", function* throw_impact(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	M = live(f.args[0]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/dodgeball.ogg"), 50, 1]);
	yield* g.callName(f, live(M), "apply_damage", [10, "stamina"]);
	if (!truthy(rt.op(f, "Prob", [], [5]))) return f.dot;
	yield* g.callName(f, live(M), "Knockdown", [60]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is knocked right off ＀ feet!</span>", [live(M), (yield* g.callName(f, live(M), "p_their", []))]));
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(12937, "/obj/structure/holohoop", "/obj/structure", {
	anchored: 1,
	name: "basketball hoop",
	desc: "Boom, shakalaka!",
	icon: rt.rsc("icons/obj/basketball.dmi"),
	icon_state: "hoop",
	density: 1,
});

// /obj/structure/holohoop/proc/attackby  (code/modules/holodeck/items.dm:104)  may sleep
rt.def("/obj/structure/holohoop/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	f.vars = () => [W, user, params];
	if (!rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 2)) return f.dot;
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [live(f.src)])))) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'> ＀ dunks ＀ into ％！!</span>", [live(user), live(W), live(f.src)]));
	return f.dot;
}, true);

// /obj/structure/holohoop/proc/attack_hand  (code/modules/holodeck/items.dm:109)  may sleep
rt.def("/obj/structure/holohoop/proc/attack_hand", function* attack_hand(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (((truthy(rt.fv(f, "pulling", live(f.args[0]))) && isEqual(rt.fv(f, "a_intent", live(f.args[0])), "grab")) && truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living")) ? 1 : 0)))) {
		L = rt.fv(f, "pulling", live(f.args[0]));
		if (rt.lt(rt.fv(f, "grab_state", live(f.args[0])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a better grip to do that!</span>"]);
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(L), rt.fv(f, "loc", live(f.src)));
		yield* g.callName(f, live(L), "Knockdown", [100]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ dunks ＀ into ％！!</span>", [live(f.args[0]), live(L), live(f.src)]));
		yield* g.callName(f, live(f.args[0]), "stop_pulling", []);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/holohoop/proc/CanPass  (code/modules/holodeck/items.dm:122)  may sleep
rt.def("/obj/structure/holohoop/proc/CanPass", function* CanPass(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0)) && truthy(rt.fv(f, "throwing", live(f.args[0]))))) {
		if (truthy((rt.istype((I = live(f.args[0])), T("/obj/item/projectile")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.callName(f, live(I), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>Swish! ＀ lands in ＀.</span>", [live(I), live(f.src)]));
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bounces off of ＀'s rim!</span>", [live(I), live(f.src)]));
		}
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["mover", "target", "height"] });

rt.type(10915, "/obj/machinery/readybutton", "/obj/machinery", {
	ready: 0,
	currentarea: null,
	eventstarted: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 6,
	power_channel: 3,
	name: "ready declaration device",
	desc: "This device is used to declare ready. If all devices in an area are ready, the event will begin!",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "auth_off",
});

// /obj/machinery/readybutton/proc/attack_ai  (code/modules/holodeck/items.dm:157)
rt.def("/obj/machinery/readybutton/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "The station AI is not to interact with these devices"]);
	return live(f.dot);
});

// /obj/machinery/readybutton/proc/attack_paw  (code/modules/holodeck/items.dm:161)
rt.def("/obj/machinery/readybutton/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are too primitive to use this device!</span>"]);
	return live(f.dot);
});

// /obj/machinery/readybutton/proc/attackby  (code/modules/holodeck/items.dm:165)
rt.def("/obj/machinery/readybutton/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "The device is a solid button, there's nothing you can do with it!"]);
	return f.dot;
});

// /obj/machinery/readybutton/proc/attack_hand  (code/modules/holodeck/items.dm:168)  may sleep
rt.def("/obj/machinery/readybutton/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let numbuttons: Value = null, numready: Value = null, button: Value = null;
	let $e: any;
	f.vars = () => [user, numbuttons, numready, button, $e];
	if ((truthy(rt.fv(f, "stat", live(user))) || truthy(rt.bitAnd(rt.sv(f, "stat"), 3)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This device is not powered!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "currentarea", (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "loc", live(f.src))])));
	if (!truthy(rt.sv(f, "currentarea"))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (truthy(rt.sv(f, "eventstarted"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>The event has already begun!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "ready", (!truthy(rt.sv(f, "ready")) ? 1 : 0));
	yield* g.srcCall(f, "update_icon");
	numbuttons = 0;
	numready = 0;
	button = null;
	rt.forList(f, 0, rt.sv(f, "currentarea"), T("/obj/machinery/readybutton"));
	while (($e = rt.next(f, 0)) !== undefined) {
		button = $e;
		numbuttons = rt.inc(live(numbuttons), 1);
		if (truthy(rt.fv(f, "ready", live(button)))) {
			numready = rt.inc(live(numready), 1);
		}
	}
	rt.endFor(f, 0);
	if (!isEqual(live(numbuttons), live(numready))) return f.dot;
	yield* g.srcCall(f, "begin_event");
	return f.dot;
}, true);

// /obj/machinery/readybutton/proc/update_icon  (code/modules/holodeck/items.dm:196)
rt.def("/obj/machinery/readybutton/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "ready"))) {
		rt.setSv(f, "icon_state", "auth_on");
	} else {
		rt.setSv(f, "icon_state", "auth_off");
	}
	return f.dot;
});

// /obj/machinery/readybutton/proc/begin_event  (code/modules/holodeck/items.dm:204)  may sleep
rt.def("/obj/machinery/readybutton/proc/begin_event", function* begin_event(f: Frame) {
	let W: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [W, M, $e];
	rt.setSv(f, "eventstarted", 1);
	W = null;
	rt.forList(f, 0, rt.sv(f, "currentarea"), T("/obj/structure/window"));
	while (($e = rt.next(f, 0)) !== undefined) {
		W = $e;
		if (truthy(rt.bitAnd(rt.fv(f, "flags", live(W)), 128))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(W)]);
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "currentarea"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "FIGHT!"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(10917, "/obj/machinery/conveyor/holodeck", "/obj/machinery/conveyor", {});

// /obj/machinery/conveyor/holodeck/proc/attackby  (code/modules/holodeck/items.dm:214)  may sleep
rt.def("/obj/machinery/conveyor/holodeck/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
		rt.setFv(f, "loc", live(f.args[0]), rt.fv(f, "loc", live(f.src)));
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
