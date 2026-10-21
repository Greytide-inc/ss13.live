// From code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12161, "/obj/structure/destructible/clockwork/geis_binding", "/obj/structure/destructible/clockwork", {
	resisting: 0,
	can_resist: 0,
	mob_layer: 4,
	clockwork_desc: "A binding ring around a target, preventing them from taking action while they're being converted.",
	light_range: 2,
	light_power: 0.5,
	light_color: "#AF0AAF",
	immune_to_servant_attacks: 1,
	can_buckle: 1,
	buckle_lying: 0,
	buckle_prevents_pull: 1,
	name: "glowing ring",
	desc: "A flickering, glowing purple ring around a target.",
	max_integrity: 25,
	obj_integrity: 25,
	density: 0,
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "geisbinding_full",
	break_message: null,
	break_sound: rt.rsc("sound/magic/repulse.ogg"),
	debris: null,
});

// /obj/structure/destructible/clockwork/geis_binding/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:17)
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.list());
	return f.dot;
});

// /obj/structure/destructible/clockwork/geis_binding/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:26)
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/examine", function examine(f: Frame) {
	rt.setSv(f, "icon_state", "geisbinding_full");
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "geisbinding");
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/geis_binding/proc/emp_act  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:34)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/geis_binding/proc/post_buckle_mob  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:38)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/post_buckle_mob", function* post_buckle_mob(f: Frame) {
	let I: Value = null, i: Value = null, B: Value = null, G: Value = null, _T: Value = null, GB: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [I, i, B, G, _T, GB, $0, $1, $2, $3, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.fv(f, "buckled", live(f.args[0])), live(f.src))) {
		rt.setSv(f, "desc", fmt("A flickering, glowing purple ring around ＀.", [live(f.args[0])]));
		rt.setSv(f, "clockwork_desc", fmt("A binding ring around ＀, preventing ＀ from taking action while ＀ being converted.", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_them", [])), (yield* g.callName(f, live(f.args[0]), "p_theyre", []))]));
		rt.setSv(f, "icon_state", "geisbinding");
		rt.setSv(f, "mob_layer", rt.fv(f, "layer", live(f.args[0])));
		rt.setSv(f, "layer", subtract(rt.fv(f, "layer", live(f.args[0])), 0.009999999776482582));
		yield* g.srcCall(f, "add_overlay", (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/clockwork_effects.dmi"), "geisbinding_top", add(rt.fv(f, "layer", live(f.args[0])), 0.009999999776482582)])));
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(f.args[0])), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(I)]);
		}
		rt.endFor(f, 0);
		i = null;
		rt.forList(f, 0, (yield* g.callName(f, live(f.args[0]), "get_empty_held_indexes", [])));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			B = (yield* g.new_(f, T("/obj/item/geis_binding"), [live(f.args[0])]));
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(B), live(i)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(f.args[0]), "regenerate_icons", []);
		$0 = live(f.args[0]);
		$1 = fmt("<span class='warning'>A ＀ appears around ＀!</span>", [rt.sv(f, "name"), live(f.args[0])]);
		$2 = rt.sv(f, "name");
		if (truthy(rt.sv(f, "can_resist"))) {
			$3 = "\n<span class='userdanger'>Resist!</span>";
		} else {
			$3 = "";
		}
		yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='warning'>A ＀ appears around you!</span>＀", [$2, $3])]);
		if (!truthy(rt.sv(f, "can_resist"))) {
			yield* g.srcCall(f, "repair_and_interrupt");
		}
	} else {
		G = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding"), [rt.fv(f, "loc", live(f.args[0]))]));
		_T = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding/top"), [rt.fv(f, "loc", live(f.args[0]))]));
		rt.setFv(f, "layer", live(G), subtract(rt.sv(f, "mob_layer"), 0.009999999776482582));
		rt.setFv(f, "layer", live(_T), add(rt.sv(f, "mob_layer"), 0.009999999776482582));
		rt.setFv(f, "alpha", live(G), rt.sv(f, "alpha"));
		rt.setFv(f, "alpha", live(_T), rt.sv(f, "alpha"));
		rt.op(f, "Animate", [2, 10], [null, live(G), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "alpha", 0, "time", 8, "easing", 128]);
		rt.op(f, "Animate", [2, 10], [null, live(_T), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "alpha", 0, "time", 8, "easing", 128]);
		yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ snaps into glowing pieces and dissipates!</span>", [live(f.src)])]);
		GB = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(f.args[0])), T("/obj/item/geis_binding"));
		while (($e = rt.next(f, 0)) !== undefined) {
			GB = $e;
			yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(GB), 1]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/destructible/clockwork/geis_binding/proc/relaymove  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:70)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let L: Value = null;
	f.vars = () => [user, direction, L];
	if (!(truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.sv(f, "can_resist")))) return f.dot;
	yield* g.callName(f, (L = live(user)), "resist", []);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/geis_binding/proc/play_attack_sound  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:75)
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/empulse.ogg"), 50, 1]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/geis_binding/proc/take_damage  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:78)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/take_damage", function* take_damage(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/structure/destructible/clockwork/geis_binding/proc/update_icon  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:83)
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "alpha", rt.call(f, P("/proc/min"), null, [add(rt.initial(f, live(f.src), "alpha"), multiply(subtract(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 5)), 255]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/geis_binding/proc/repair_and_interrupt  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:86)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/repair_and_interrupt", function* repair_and_interrupt(f: Frame) {
	let m: Value = null, L: Value = null, C: Value = null, G1: Value = null, G2: Value = null, T1: Value = null, T2: Value = null;
	let $e: any;
	f.vars = () => [m, L, C, G1, G2, T1, T2, $e];
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	yield* g.srcCall(f, "update_icon");
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (truthy((L = live(m)))) {
			yield* g.callName(f, live(L), "Stun", [20, 1, 1]);
			if (truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
				rt.modField(f, (C = live(L)), "silent", 4, add);
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='sevtug'>＀ flares brightly!</span>", [live(f.src)]));
	G1 = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding"), [rt.sv(f, "loc")]));
	G2 = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding"), [rt.sv(f, "loc")]));
	T1 = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding/top"), [rt.sv(f, "loc")]));
	T2 = (yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/geis_binding/top"), [rt.sv(f, "loc")]));
	rt.setFv(f, "layer", live(G1), subtract(rt.sv(f, "mob_layer"), 0.009999999776482582));
	rt.setFv(f, "layer", live(G2), subtract(rt.sv(f, "mob_layer"), 0.009999999776482582));
	rt.setFv(f, "layer", live(T1), add(rt.sv(f, "mob_layer"), 0.009999999776482582));
	rt.setFv(f, "layer", live(T2), add(rt.sv(f, "mob_layer"), 0.009999999776482582));
	rt.op(f, "Animate", [2, 10], [null, live(G1), "pixel_y", add(rt.sv(f, "pixel_y"), 9), "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, live(G2), "pixel_y", subtract(rt.sv(f, "pixel_y"), 9), "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, live(T1), "pixel_y", add(rt.sv(f, "pixel_y"), 9), "alpha", 0, "time", 8, "easing", 64]);
	rt.op(f, "Animate", [2, 10], [null, live(T2), "pixel_y", subtract(rt.sv(f, "pixel_y"), 9), "alpha", 0, "time", 8, "easing", 64]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/geis_binding/proc/user_unbuckle_mob  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:110)  may sleep
rt.def("/obj/structure/destructible/clockwork/geis_binding/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame) {
	if (isEqual(live(f.args[0]), live(f.args[1]))) {
		if ((!truthy(rt.sv(f, "resisting")) && truthy(rt.sv(f, "can_resist")))) {
			rt.setSv(f, "resisting", 1);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ starts struggling against ＀...</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='userdanger'>You start breaking out of ＀...</span>", [live(f.src)])]);
			while ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 10, "target", live(f.src)], rt.Args.Named))) && truthy(rt.sv(f, "resisting"))) && truthy(rt.sv(f, "obj_integrity"))) {
				if (rt.le(subtract(rt.sv(f, "obj_integrity"), 5), 0)) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ breaks ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='userdanger'>You break ＀!</span>", [live(f.src)])]);
					yield* g.srcCall(f, "take_damage", 5);
					return live(f.args[1]);
				}
				yield* g.srcCall(f, "take_damage", 5);
			}
			rt.setSv(f, "resisting", 0);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["buckled_mob", "user"] });

rt.type(9438, "/obj/item/geis_binding", "/obj/item", {
	flags: 16514,
	name: "glowing ring",
	desc: "A flickering ring preventing you from holding items.",
	icon: rt.rsc("icons/effects/clockwork_effects.dmi"),
	icon_state: "geisbinding_full",
});

// /obj/item/geis_binding/proc/pre_attackby  (code/game/gamemodes/clock_cult/clock_structures/geis_binding.dm:132)  may sleep
rt.def("/obj/item/geis_binding/proc/pre_attackby", function* pre_attackby(f: Frame, target: Value, user: Value, params: Value) {
	f.vars = () => [target, user, params];
	yield* g.callName(f, live(user), "resist", []);
	return 0;
}, true);
