// From code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5028, "/mob/living/simple_animal/hostile/megafauna/legion", "/mob/living/simple_animal/hostile/megafauna", {
	size: 5,
	charging: 0,
	ranged: 1,
	retreat_distance: 5,
	minimum_distance: 5,
	ranged_cooldown_time: 20,
	vision_range: 13,
	idle_vision_range: 13,
	name: "Legion",
	health: 800,
	maxHealth: 800,
	icon_state: "legion",
	icon_living: "legion",
	desc: "One of many.",
	icon: rt.rsc("icons/mob/lavaland/legion.dmi"),
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/magic/demon_attack1.ogg"),
	speak_emote: null,
	armour_penetration: 50,
	melee_damage_lower: 25,
	melee_damage_upper: 25,
	speed: 2,
	del_on_death: 1,
	medal_type: "Legion",
	score_type: "Legion Killed",
	pixel_y: -90,
	pixel_x: -75,
	loot: null,
	wander: 0,
	elimination: 1,
	appearance_flags: 0,
	mouse_opacity: 1,
});

// /mob/living/simple_animal/hostile/megafauna/legion/proc/<init>  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:30)
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("echoes"));
	$0 = $0;
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/stack/sheet/bone"), 3]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/megafauna/legion/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:55)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "internal", (yield* g.new_(f, T("/obj/item/device/gps/internal/legion"), [live(f.src)])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/legion/proc/GiveTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:59)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/GiveTarget", function* GiveTarget(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "target"))) return f.dot;
	rt.setSv(f, "wander", 1);
	return f.dot;
}, true, { args: ["new_target"] });

// /mob/living/simple_animal/hostile/megafauna/legion/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:65)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (truthy(rt.gl("necropolis_gate"))) {
		yield* g.callName(f, rt.gl("necropolis_gate"), "toggle_the_gate", [null, 1]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/megafauna/legion/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:69)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null, A: Value = null;
	f.vars = () => [L, A];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living/carbon/human")) ? 1 : 0)))) return f.dot;
	if (!isEqual(rt.gv(f, "stat", (L = rt.sv(f, "target"))), 1)) return f.dot;
	yield* g.callName(f, (A = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion"), [rt.sv(f, "loc")]))), "infest", [live(L)]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/legion/proc/OpenFire  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:77)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/OpenFire", function* OpenFire(f: Frame, the_target: Value) {
	let A: Value = null;
	f.vars = () => [the_target, A];
	if (!(rt.ge(rt.worldTime(f), rt.sv(f, "ranged_cooldown")) && !truthy(rt.sv(f, "charging")))) return f.dot;
	if (truthy(rt.op(f, "Prob", [], [75]))) {
		yield* g.callName(f, (A = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood/legion"), [rt.sv(f, "loc")]))), "GiveTarget", [rt.sv(f, "target")]);
		rt.setFv(f, "friends", live(A), rt.sv(f, "friends"));
		rt.setFv(f, "faction", live(A), rt.sv(f, "faction"));
		rt.setSv(f, "ranged_cooldown", add(rt.worldTime(f), rt.sv(f, "ranged_cooldown_time")));
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'><b>＀ charges!</b></span>", [live(f.src)]));
		yield* g.callSrc(f, "SpinAnimation", ["speed", 20, "loops", 5], rt.Args.Named);
		rt.setSv(f, "ranged", 0);
		rt.setSv(f, "retreat_distance", 0);
		rt.setSv(f, "minimum_distance", 0);
		rt.setSv(f, "speed", 0);
		rt.setSv(f, "charging", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/megafauna/legion/proc/reset_charge")])), 50]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/megafauna/legion/proc/death  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:102)  may sleep
rt.def("/mob/living/simple_animal/hostile/megafauna/legion/proc/death", function* death(f: Frame) {
	let L: Value = null, last_legion: Value = null, other: Value = null;
	let $e: any;
	f.vars = () => [L, last_legion, other, $e];
	if (rt.gt(rt.sv(f, "health"), 0)) {
		return live(f.dot);
	}
	if (rt.gt(rt.sv(f, "size"), 1)) {
		yield* g.srcCall(f, "adjustHealth", rt.neg(rt.sv(f, "maxHealth")));
		rt.setFv(f, "maxHealth", (L = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/megafauna/legion"), [rt.sv(f, "loc")]))), multiply(rt.sv(f, "maxHealth"), 0.6000000238418579));
		rt.setSv(f, "maxHealth", rt.fv(f, "maxHealth", live(L)));
		rt.setFv(f, "health", live(L), rt.fv(f, "maxHealth", live(L)));
		rt.setSv(f, "health", rt.sv(f, "maxHealth"));
		rt.incSrcVar(f, "size", -1, true);
		rt.setFv(f, "size", live(L), rt.sv(f, "size"));
		rt.setFv(f, "resize", live(L), multiply(rt.fv(f, "size", live(L)), 0.20000000298023224));
		rt.setSv(f, "transform", rt.initial(f, live(f.src), "transform"));
		rt.setSv(f, "resize", multiply(rt.sv(f, "size"), 0.20000000298023224));
		yield* g.callName(f, live(L), "update_transform", []);
		yield* g.srcCall(f, "update_transform");
		rt.setFv(f, "faction", live(L), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
		yield* g.callName(f, live(L), "GiveTarget", [rt.sv(f, "target")]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='boldannounce'>＀ splits in twain!</span>", [live(f.src)]));
	} else {
		last_legion = 1;
		other = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/hostile/megafauna/legion"));
		while (($e = rt.next(f, 0)) !== undefined) {
			other = $e;
			if (!isEqual(live(other), live(f.src))) {
				last_legion = 0;
				break;
			}
		}
		rt.endFor(f, 0);
		if (truthy(live(last_legion))) {
			rt.setSv(f, "loot", rt.list(T("/obj/item/weapon/staff/storm")));
			rt.setSv(f, "elimination", 0);
		} else {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				rt.setSv(f, "loot", rt.list(T("/obj/structure/closet/crate/necropolis/tendril")));
			}
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

rt.type(7395, "/obj/item/weapon/staff/storm", "/obj/item/weapon/staff", {
	storm_type: rt.typePath("/datum/weather/ash_storm"),
	storm_cooldown: 0,
	name: "staff of storms",
	desc: "An ancient staff retrieved from the remains of Legion. The wind stirs as you move it.",
	icon_state: "staffofstorms",
	item_state: "staffofstorms",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	slot_flags: 1024,
	w_class: 4,
	force: 25,
	damtype: "fire",
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
});

// /obj/item/weapon/staff/storm/proc/attack_self  (code/modules/mob/living/simple_animal/hostile/megafauna/legion.dm:169)  may sleep
rt.def("/obj/item/weapon/staff/storm/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let user_area: Value = null, A: Value = null, V: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [user, user_area, A, V, W, $e];
	if (rt.gt(rt.sv(f, "storm_cooldown"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The staff is still recharging!</span>"]);
		return live(f.dot);
	}
	user_area = (yield* g.call(f, P("/proc/get_area"), null, [live(user)]));
	A = null;
	V = null;
	rt.forList(f, 0, rt.fv(f, "existing_weather", rt.gl("SSweather")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if ((isEqual(rt.gv(f, "target_z", (W = live(V))), rt.fv(f, "z", live(user))) && isEqual(rt.fv(f, "area_type", live(W)), rt.fv(f, "type", live(user_area))))) {
			A = live(W);
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(A))) {
		if (!isEqual(rt.fv(f, "stage", live(A)), 4)) {
			if (isEqual(rt.fv(f, "stage", live(A)), 3)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The storm is already ending! It would be a waste to use the staff now.</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ holds ＀ skywards as an orange beam travels into the sky!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You hold ＀ skyward, dispelling the storm!</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/magic/staff_change.ogg"), 200, 0]);
			yield* g.callName(f, live(A), "wind_down", []);
			return live(f.dot);
		}
	} else {
		rt.setFv(f, "name", (A = (yield* g.new_(f, rt.sv(f, "storm_type"), []))), "staff storm");
		rt.setFv(f, "area_type", live(A), rt.fv(f, "type", live(user_area)));
		rt.setFv(f, "target_z", live(A), rt.fv(f, "z", live(user)));
		rt.setFv(f, "telegraph_duration", live(A), 100);
		rt.setFv(f, "end_duration", live(A), 100);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ holds ＀ skywards as red lightning crackles into the sky!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You hold ＀ skyward, calling down a terrible storm!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/magic/staff_change.ogg"), 200, 0]);
	yield* g.callName(f, live(A), "telegraph", []);
	rt.setSv(f, "storm_cooldown", add(rt.worldTime(f), 200));
	return f.dot;
}, true);
