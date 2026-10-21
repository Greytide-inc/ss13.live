// From code/game/objects/effects/mines.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11819, "/obj/effect/mine", "/obj/effect", {
	triggered: 0,
	anchored: 1,
	name: "dummy mine",
	desc: "Better stay away from that thing.",
	density: 0,
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "uglymine",
});

// /obj/effect/mine/proc/mineEffect  (code/game/objects/effects/mines.dm:11)
rt.def("/obj/effect/mine/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='danger'>*click*</span>"]);
	return f.dot;
});

// /obj/effect/mine/proc/Crossed  (code/game/objects/effects/mines.dm:14)  may sleep
rt.def("/obj/effect/mine/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let MM: Value = null;
	f.vars = () => [AM, MM];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(AM)])))) {
		if (!truthy(rt.bitAnd(rt.gv(f, "movement_type", (MM = live(AM))), 2))) {
			yield* g.srcCall(f, "triggermine", live(AM));
		}
	} else {
		yield* g.srcCall(f, "triggermine", live(AM));
	}
	return f.dot;
}, true);

// /obj/effect/mine/proc/triggermine  (code/game/objects/effects/mines.dm:25)  may sleep
rt.def("/obj/effect/mine/proc/triggermine", function* triggermine(f: Frame, victim: Value) {
	let s: Value = null;
	f.vars = () => [victim, s];
	if (truthy(rt.sv(f, "triggered"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ sets off ＀ ＀!</span>", [live(victim), (yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), live(f.src)]));
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.srcCall(f, "mineEffect", live(victim));
	rt.setSv(f, "triggered", 1);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11820, "/obj/effect/mine/explosive", "/obj/effect/mine", {
	range_devastation: 0,
	range_heavy: 1,
	range_light: 2,
	range_flash: 3,
	name: "explosive mine",
});

// /obj/effect/mine/explosive/proc/mineEffect  (code/game/objects/effects/mines.dm:42)
rt.def("/obj/effect/mine/explosive/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	rt.call(f, P("/proc/explosion"), null, [rt.sv(f, "loc"), rt.sv(f, "range_devastation"), rt.sv(f, "range_heavy"), rt.sv(f, "range_light"), rt.sv(f, "range_flash")]);
	return f.dot;
});

rt.type(11821, "/obj/effect/mine/stun", "/obj/effect/mine", {
	stun_time: 80,
	name: "stun mine",
});

// /obj/effect/mine/stun/proc/mineEffect  (code/game/objects/effects/mines.dm:50)  may sleep
rt.def("/obj/effect/mine/stun/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if (!truthy((rt.istype(live(victim), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, live(victim), "Knockdown", [rt.sv(f, "stun_time")]);
	return f.dot;
}, true);

rt.type(11822, "/obj/effect/mine/kickmine", "/obj/effect/mine", {
	name: "kick mine",
});

// /obj/effect/mine/kickmine/proc/mineEffect  (code/game/objects/effects/mines.dm:57)  may sleep
rt.def("/obj/effect/mine/kickmine/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if (!(truthy((rt.istype(live(victim), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(victim))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='userdanger'>You have been kicked FOR NO REISIN!</span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "client", live(victim))]);
	return f.dot;
}, true);

rt.type(11823, "/obj/effect/mine/gas", "/obj/effect/mine", {
	gas_amount: 360,
	gas_type: "o2",
	name: "oxygen mine",
});

// /obj/effect/mine/gas/proc/mineEffect  (code/game/objects/effects/mines.dm:68)
rt.def("/obj/effect/mine/gas/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	rt.callSrc(f, "atmos_spawn_air", [fmt("＀=＀", [rt.sv(f, "gas_type"), rt.sv(f, "gas_amount")])]);
	return f.dot;
});

rt.type(11826, "/obj/effect/mine/sound", "/obj/effect/mine", {
	sound: rt.rsc("sound/items/bikehorn.ogg"),
	name: "honkblaster 1000",
});

// /obj/effect/mine/sound/proc/mineEffect  (code/game/objects/effects/mines.dm:86)
rt.def("/obj/effect/mine/sound/proc/mineEffect", function mineEffect(f: Frame, victim: Value) {
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "sound"), 100, 1]);
	return f.dot;
});

rt.type(11828, "/obj/effect/mine/pickup", "/obj/effect/mine", {
	duration: 0,
	name: "pickup",
	desc: "pick me up",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "electricity2",
	density: 0,
});

// /obj/effect/mine/pickup/proc/New  (code/game/objects/effects/mines.dm:102)  may sleep
rt.def("/obj/effect/mine/pickup/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", 4, "time", 20, "loop", -1]);
	return f.dot;
}, true);

// /obj/effect/mine/pickup/proc/triggermine  (code/game/objects/effects/mines.dm:110)  may sleep
rt.def("/obj/effect/mine/pickup/proc/triggermine", function* triggermine(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if (truthy(rt.sv(f, "triggered"))) {
		return live(f.dot);
	}
	rt.setSv(f, "triggered", 1);
	rt.setSv(f, "invisibility", 101);
	yield* g.srcCall(f, "mineEffect", live(victim));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11829, "/obj/effect/mine/pickup/bloodbath", "/obj/effect/mine/pickup", {
	duration: 1200,
	name: "Red Orb",
	desc: "You feel angry just looking at it.",
	color: "#FF0000",
});

// /obj/effect/mine/pickup/bloodbath/proc/mineEffect  (code/game/objects/effects/mines.dm:121)  may sleep
rt.def("/obj/effect/mine/pickup/bloodbath/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	let old_color: Value = null, red_splash: Value = null, pure_red: Value = null, chainsaw: Value = null;
	f.vars = () => [victim, old_color, red_splash, pure_red, chainsaw];
	if ((!truthy(rt.fv(f, "client", live(victim))) || !truthy((rt.istype(live(victim), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='reallybig redtext'>RIP AND TEAR</span>"]);
	rt.op(f, "Output", [], [live(victim), rt.rsc("sound/misc/e1m1.ogg")], false);
	old_color = rt.gv(f, "color", rt.fv(f, "client", live(victim)));
	red_splash = rt.list(1, 0, 0, 0.800000011920929, 0.20000000298023224, 0, 0.800000011920929, 0, 0.20000000298023224, 0.10000000149011612, 0, 0);
	pure_red = rt.list(0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0);
	rt.spawnTail(f, 0, "/obj/effect/mine/pickup/bloodbath/proc/mineEffect: spawn at game/objects/effects/mines.dm:129", victim, old_color, red_splash, pure_red, chainsaw);
	(rt.modField(f, (chainsaw = (yield* g.new_(f, T("/obj/item/weapon/twohanded/required/chainsaw/doomslayer"), [rt.fv(f, "loc", live(victim))]))), "flags", 2, rt.bitOr));
	yield* g.callName(f, live(victim), "drop_all_held_items", []);
	yield* g.callName(f, live(victim), "put_in_hands", [live(chainsaw)]);
	yield* g.callName(f, live(chainsaw), "attack_self", [live(victim)]);
	yield* g.callName(f, live(chainsaw), "wield", [live(victim)]);
	yield* g.callName(f, rt.fv(f, "reagents", live(victim)), "add_reagent", ["adminordrazine", 25]);
	rt.setFv(f, "color", rt.fv(f, "client", live(victim)), live(pure_red));
	rt.op(f, "Animate", [2, 8], [null, rt.fv(f, "client", live(victim)), "color", live(red_splash), "time", 10, "easing", 129]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	rt.op(f, "Animate", [2, 6], [null, rt.fv(f, "client", live(victim)), "color", live(old_color), "time", rt.sv(f, "duration")]);
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "duration")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='notice'>Your bloodlust seeps back into the bog of your subconscious and you regain self control.<span>"]);
	yield* g.call(f, P("/proc/qdel"), null, [live(chainsaw)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

// a spawn(0) body of /obj/effect/mine/pickup/bloodbath/proc/mineEffect, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/mine/pickup/bloodbath/proc/mineEffect: spawn at game/objects/effects/mines.dm:129", function* (f: Frame, victim: Value, old_color: Value, red_splash: Value, pure_red: Value, chainsaw: Value) {
	f.vars = () => [victim, old_color, red_splash, pure_red, chainsaw];
	yield* g.new_(f, T("/obj/effect/hallucination/delusion"), [rt.fv(f, "loc", live(victim)), live(victim), "demon", rt.sv(f, "duration"), 0]);
	return null;
});

rt.type(11830, "/obj/effect/mine/pickup/healing", "/obj/effect/mine/pickup", {
	name: "Blue Orb",
	desc: "You feel better just looking at it.",
	color: "#0000FF",
});

// /obj/effect/mine/pickup/healing/proc/mineEffect  (code/game/objects/effects/mines.dm:155)  may sleep
rt.def("/obj/effect/mine/pickup/healing/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if ((!truthy(rt.fv(f, "client", live(victim))) || !truthy((rt.istype(live(victim), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='notice'>You feel great!</span>"]);
	yield* g.callName(f, live(victim), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(11831, "/obj/effect/mine/pickup/speed", "/obj/effect/mine/pickup", {
	duration: 300,
	name: "Yellow Orb",
	desc: "You feel faster just looking at it.",
	color: "#FFFF00",
});

// /obj/effect/mine/pickup/speed/proc/mineEffect  (code/game/objects/effects/mines.dm:167)  may sleep
rt.def("/obj/effect/mine/pickup/speed/proc/mineEffect", function* mineEffect(f: Frame, victim: Value) {
	f.vars = () => [victim];
	if ((!truthy(rt.fv(f, "client", live(victim))) || !truthy((rt.istype(live(victim), T("/mob/living/carbon")) ? 1 : 0)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='notice'>You feel fast!</span>"]);
	(rt.modField(f, live(victim), "status_flags", 64, rt.bitOr));
	yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "duration")]);
	(rt.modField(f, live(victim), "status_flags", 16777151, rt.bitAnd));
	yield* g.call(f, P("/proc/to_chat"), null, [live(victim), "<span class='notice'>You slow down.</span>"]);
	return f.dot;
}, true);
