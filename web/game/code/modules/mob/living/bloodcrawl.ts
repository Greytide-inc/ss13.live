// From code/modules/mob/living/bloodcrawl.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11949, "/obj/effect/dummy/slaughter", "/obj/effect/dummy", {
	canmove: 1,
	anchored: 1,
	name: "water",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "nothing",
	density: 0,
	invisibility: 60,
	resistance_flags: 51,
});

// /obj/effect/dummy/slaughter/proc/relaymove  (code/modules/mob/living/bloodcrawl.dm:12)  may sleep
rt.def("/obj/effect/dummy/slaughter/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(f.src), live(direction)));
	return f.dot;
}, true);

// /mob/living/proc/phaseout  (code/modules/mob/living/bloodcrawl.dm:25)  may sleep
rt.def("/mob/living/proc/phaseout", function* phaseout(f: Frame, B: Value) {
	let C: Value = null, I: Value = null, B1: Value = null, B2: Value = null;
	let $e: any;
	f.vars = () => [B, C, I, B1, B2, $e];
	if (truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(f.src);
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(C)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You may not hold items while blood crawling!</span>"]);
			return 0;
		}
		rt.endFor(f, 0);
		B1 = (yield* g.new_(f, T("/obj/item/weapon/bloodcrawl"), [live(C)]));
		B2 = (yield* g.new_(f, T("/obj/item/weapon/bloodcrawl"), [live(C)]));
		rt.setFv(f, "icon_state", live(B1), "bloodhand_left");
		rt.setFv(f, "icon_state", live(B2), "bloodhand_right");
		yield* g.callName(f, live(C), "put_in_hands", [live(B1)]);
		yield* g.callName(f, live(C), "put_in_hands", [live(B2)]);
		yield* g.callName(f, live(C), "regenerate_icons", []);
	}
	rt.setFv(f, "notransform", live(f.src), 1);
	rt.spawnTail(f, 0, "/mob/living/proc/phaseout: spawn at modules/mob/living/bloodcrawl.dm:41", B, C, I, B1, B2);
	return 1;
}, true);

// a spawn(0) body of /mob/living/proc/phaseout, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/proc/phaseout: spawn at modules/mob/living/bloodcrawl.dm:41", function* (f: Frame, B: Value, C: Value, I: Value, B1: Value, B2: Value) {
	f.vars = () => [B, C, I, B1, B2];
	yield* g.srcCall(f, "bloodpool_sink", live(B));
	rt.setFv(f, "notransform", live(f.src), 0);
	return null;
});

// /mob/living/proc/bloodpool_sink  (code/modules/mob/living/bloodcrawl.dm:47)  may sleep
rt.def("/mob/living/proc/bloodpool_sink", function* bloodpool_sink(f: Frame, B: Value) {
	let mobloc: Value = null, holder: Value = null, pullee: Value = null, victim: Value = null, kidnapped: Value = null, success: Value = null;
	f.vars = () => [B, mobloc, holder, pullee, victim, kidnapped, success];
	mobloc = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0);
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ sinks into the pool of blood!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/enter_blood.ogg"), 100, 1, -1]);
	holder = (yield* g.new_(f, T("/obj/effect/dummy/slaughter"), [live(mobloc)]));
	yield* g.callName(f, live(f.src), "ExtinguishMob", []);
	pullee = rt.fv(f, "pulling", live(f.src));
	rt.setFv(f, "holder", live(f.src), live(holder));
	yield* g.callName(f, live(f.src), "forceMove", [live(holder)]);
	if ((!truthy(live(pullee)) || !isEqual(rt.fv(f, "bloodcrawl", live(f.src)), 2))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(pullee), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	victim = live(pullee);
	kidnapped = 0;
	if (isEqual(rt.fv(f, "stat", live(victim)), 0)) {
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ kicks free of the blood pool just before entering it!</span>", [live(victim)]), null, "<span class='notice'>You hear splashing and struggling.</span>"]);
	} else {
		if ((truthy(rt.fv(f, "reagents", live(victim))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(victim)), "has_reagent", ["demonsblood"]))))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>Something prevents ＀ from entering the pool!</span>", [live(victim)]), fmt("<span class='warning'>A strange force is blocking ＀ from entering!</span>", [live(victim)]), "<span class='notice'>You hear a splash and a thud.</span>");
		} else {
			yield* g.callName(f, live(victim), "forceMove", [live(f.src)]);
			yield* g.callName(f, live(victim), "emote", ["scream"]);
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'><b>＀ drags ＀ into the pool of blood!</b></span>", [live(f.src), live(victim)]), null, "<span class='notice'>You hear a splash.</span>"]);
			kidnapped = 1;
		}
	}
	if (truthy(live(kidnapped))) {
		if (!truthy((success = (yield* g.srcCall(f, "bloodcrawl_consume", live(victim)))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You happily devour... nothing? Your meal vanished at some point!</span>"]);
		}
	}
	return 1;
}, true);

// /mob/living/proc/bloodcrawl_consume  (code/modules/mob/living/bloodcrawl.dm:91)  may sleep
rt.def("/mob/living/proc/bloodcrawl_consume", function* bloodcrawl_consume(f: Frame, victim: Value) {
	let sound: Value = null, SD: Value = null, i: Value = null, found_bloodpool: Value = null, target: Value = null;
	let $e: any;
	f.vars = () => [victim, sound, SD, i, found_bloodpool, target, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>You begin to feast on ＀. You can not move while you are doing this.</span>", [live(victim)])]);
	sound = null;
	if (truthy((rt.istype(live(f.src), T("/mob/living/simple_animal/slaughter")) ? 1 : 0))) {
		sound = rt.gv(f, "feast_sound", (SD = live(f.src)));
	} else {
		sound = rt.rsc("sound/magic/demon_consume.ogg");
	}
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), live(sound), 100, 1]);
		yield* g.call(f, P("/proc/sleep"), null, [30]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(victim))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "reagents", live(victim))) && truthy((yield* g.callName(f, rt.fv(f, "reagents", live(victim)), "has_reagent", ["devilskiss"]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'><b>AAH! THEIR FLESH! IT BURNS!</b></span>"]);
		yield* g.srcCall(f, "adjustBruteLoss", 25);
		found_bloodpool = 0;
		target = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, rt.getStep(f, live(victim), 0)])), T("/obj/effect/decal/cleanable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			target = $e;
			if (truthy((yield* g.callName(f, live(target), "can_bloodcrawl_in", [])))) {
				yield* g.callName(f, live(victim), "forceMove", [rt.getStep(f, live(target), 0)]);
				yield* g.callName(f, live(victim), "visible_message", [fmt("<span class='warning'>＀ violently expels ＀!</span>", [live(target), live(victim)])]);
				yield* g.callName(f, live(victim), "exit_blood_effect", [live(target)]);
				found_bloodpool = 1;
			}
		}
		rt.endFor(f, 0);
		if (!truthy(live(found_bloodpool))) {
			yield* g.callName(f, live(victim), "forceMove", [rt.getStep(f, live(victim), 0)]);
			yield* g.callName(f, live(victim), "visible_message", [fmt("<span class='warning'>＀ appears from nowhere, covered in blood!</span>", [live(victim)])]);
			yield* g.callName(f, live(victim), "exit_blood_effect", []);
		}
		return 1;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='danger'>You devour ＀. Your health is fully restored.</span>", [live(victim)])]);
	yield* g.callName(f, live(f.src), "revive", ["full_heal", 1], rt.Args.Named);
	yield* g.callName(f, live(victim), "adjustBruteLoss", [1000]);
	yield* g.callName(f, live(victim), "death", []);
	yield* g.srcCall(f, "bloodcrawl_swallow", live(victim));
	return 1;
}, true);

// /mob/living/proc/bloodcrawl_swallow  (code/modules/mob/living/bloodcrawl.dm:135)  may sleep
rt.def("/mob/living/proc/bloodcrawl_swallow", function* bloodcrawl_swallow(f: Frame, victim: Value) {
	f.vars = () => [victim];
	yield* g.call(f, P("/proc/qdel"), null, [live(victim)]);
	return f.dot;
}, true);

// /mob/living/proc/exit_blood_effect  (code/modules/mob/living/bloodcrawl.dm:144)
rt.def("/mob/living/proc/exit_blood_effect", function exit_blood_effect(f: Frame, B: Value) {
	let newcolor: Value = null;
	f.vars = () => [newcolor];
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/magic/exit_blood.ogg"), 100, 1, -1]);
	newcolor = "#950a0a";
	if (truthy((rt.istype(live(B), T("/obj/effect/decal/cleanable/xenoblood")) ? 1 : 0))) {
		newcolor = "#2bba00";
	}
	rt.callSrc(f, "add_atom_colour", [live(newcolor), 2]);
	rt.spawnTail(f, 30, "/mob/living/proc/exit_blood_effect: spawn at modules/mob/living/bloodcrawl.dm:151", B, newcolor);
	return f.dot;
});

// a spawn(30) body of /mob/living/proc/exit_blood_effect, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/proc/exit_blood_effect: spawn at modules/mob/living/bloodcrawl.dm:151", function* (f: Frame, B: Value, newcolor: Value) {
	f.vars = () => [B, newcolor];
	yield* g.srcCall(f, "remove_atom_colour", 2, live(newcolor));
	return null;
});

// /mob/living/proc/phasein  (code/modules/mob/living/bloodcrawl.dm:155)  may sleep
rt.def("/mob/living/proc/phasein", function* phasein(f: Frame, B: Value) {
	let C: Value = null, BC: Value = null;
	let $e: any;
	f.vars = () => [B, C, BC, $e];
	if (truthy(rt.fv(f, "notransform", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>Finish eating first!</span>"]);
		return 0;
	}
	yield* g.callName(f, live(B), "visible_message", [fmt("<span class='warning'>＀ starts to bubble...</span>", [live(B)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 20, "target", live(B)], rt.Args.Named)))) {
		return live(f.dot);
	}
	if (!truthy(live(B))) {
		return live(f.dot);
	}
	rt.setFv(f, "loc", live(f.src), rt.fv(f, "loc", live(B)));
	rt.setFv(f, "eye", rt.fv(f, "client", live(f.src)), live(f.src));
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'><B>＀ rises out of the pool of blood!</B>", [live(f.src)])]);
	yield* g.srcCall(f, "exit_blood_effect", live(B));
	if (truthy((rt.istype(live(f.src), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(f.src);
		BC = null;
		rt.forList(f, 0, live(C), T("/obj/item/weapon/bloodcrawl"));
		while (($e = rt.next(f, 0)) !== undefined) {
			BC = $e;
			rt.setFv(f, "flags", live(BC), null);
			yield* g.call(f, P("/proc/qdel"), null, [live(BC)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "holder", live(f.src))]);
	rt.setFv(f, "holder", live(f.src), null);
	return 1;
}, true);
