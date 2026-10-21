// From code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11262, "/obj/effect/proc_holder/slab", "/obj/effect/proc_holder", {
	slab: null,
	successful: 0,
	finished: 0,
	in_progress: 0,
});

// /obj/effect/proc_holder/slab/proc/Destroy  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:10)  may sleep
rt.def("/obj/effect/proc_holder/slab/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "slab", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/slab/proc/remove_ranged_ability  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:13)  may sleep
rt.def("/obj/effect/proc_holder/slab/proc/remove_ranged_ability", function* remove_ranged_ability(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "finished", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 6, 8]);
	return f.dot;
}, true, { args: ["msg"] });

// /obj/effect/proc_holder/slab/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:18)  may sleep
rt.def("/obj/effect/proc_holder/slab/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	if ((truthy((yield* g.callSuper(f, [], rt.Args.Same))) || truthy(rt.sv(f, "in_progress")))) {
		return 1;
	}
	if (!(((truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", []))) || !truthy(rt.sv(f, "slab"))) || !truthy((rt.isIn(f, rt.sv(f, "slab"), rt.fv(f, "held_items", rt.sv(f, "ranged_ability_user"))) ? 1 : 0))) || isEqual(live(f.args[2]), rt.sv(f, "slab")))) return f.dot;
	yield* g.srcCall(f, "remove_ranged_ability");
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(11263, "/obj/effect/proc_holder/slab/geis", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/geis_target.dmi"),
});

// /obj/effect/proc_holder/slab/geis/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:29)  may sleep
rt.def("/obj/effect/proc_holder/slab/geis/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, target_is_binding: Value = null, GB: Value = null, m: Value = null, L: Value = null, GB_3: Value = null, conversion: Value = null;
	let $e: any;
	f.vars = () => [_T, target_is_binding, GB, m, L, GB_3, conversion, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 1;
	}
	if (((truthy((target_is_binding = (rt.istype(live(f.args[2]), T("/obj/structure/destructible/clockwork/geis_binding")) ? 1 : 0))) || truthy((rt.istype(live(f.args[2]), T("/mob/living")) ? 1 : 0))) && truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "Adjacent", [live(f.args[2])]))))) {
		if (truthy(live(target_is_binding))) {
			yield* g.callName(f, (GB = live(f.args[2])), "repair_and_interrupt", []);
			m = null;
			rt.forList(f, 0, rt.fv(f, "buckled_mobs", live(GB)));
			while (($e = rt.next(f, 0)) !== undefined) {
				m = $e;
				if (truthy(live(m))) {
					yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(m), "rebound with Geis"]);
				}
			}
			rt.endFor(f, 0);
			rt.setSv(f, "successful", 1);
		} else {
			if (truthy((yield* g.callName(f, (L = live(f.args[2])), "null_rod_check", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), "<span class='sevtug'>\"A void weapon? Really, you expect me to be able to do anything?\"</span>"]);
				return 1;
			}
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
				if (!isEqual(live(L), rt.sv(f, "ranged_ability_user"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='sevtug'>\"＀ already serve＀ Ratvar. ＀\"</span>", [(yield* g.callName(f, live(L), "p_they", [1])), (yield* g.callName(f, live(L), "p_s", [])), (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("Perhaps ＀ into bondage?", [(yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "p_theyre", []))])]))])]);
				}
				return 1;
			}
			if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='sevtug'>\"＀ dead, idiot.\"</span>", [(yield* g.callName(f, live(L), "p_theyre", [1]))])]);
				return 1;
			}
			if (truthy((rt.istype(rt.fv(f, "buckled", live(L)), T("/obj/structure/destructible/clockwork/geis_binding")) ? 1 : 0))) {
				yield* g.callName(f, (GB_3 = rt.fv(f, "buckled", live(L))), "repair_and_interrupt", []);
				yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(L), "rebound with Geis"]);
				rt.setSv(f, "successful", 1);
			} else {
				rt.setSv(f, "in_progress", 1);
				yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "ranged_ability_user"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Be bound, heathen!"]))]);
				yield* g.srcCall(f, "remove_mousepointer", rt.fv(f, "client", rt.sv(f, "ranged_ability_user")));
				yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(L), "bound with Geis"]);
				if (rt.ge(rt.fv(f, "speed_multiplier", rt.sv(f, "slab")), 0.5)) {
					rt.setFv(f, "notransform", rt.sv(f, "ranged_ability_user"), 1);
					yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/proc_holder/slab/geis/proc/reset_user_notransform"), rt.sv(f, "ranged_ability_user")])), 5]);
				}
				rt.setFv(f, "busy", rt.sv(f, "slab"), null);
				rt.setFv(f, "slab", (conversion = (yield* g.new_(f, T("/datum/clockwork_scripture/geis"), []))), rt.sv(f, "slab"));
				rt.setFv(f, "invoker", live(conversion), rt.sv(f, "ranged_ability_user"));
				rt.setFv(f, "target", live(conversion), live(f.args[2]));
				yield* g.callName(f, live(conversion), "run_scripture", []);
				rt.setSv(f, "successful", 1);
			}
		}
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return 1;
}, true, { args: ["caller", "params", "target"] });

// /obj/effect/proc_holder/slab/geis/proc/reset_user_notransform  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:86)
rt.def("/obj/effect/proc_holder/slab/geis/proc/reset_user_notransform", function reset_user_notransform(f: Frame, user: Value) {
	if (!truthy(live(user))) return f.dot;
	rt.setFv(f, "notransform", live(user), 0);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living" }] });

rt.type(11264, "/obj/effect/proc_holder/slab/compromise", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/compromise_target.dmi"),
});

// /obj/effect/proc_holder/slab/compromise/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:93)  may sleep
rt.def("/obj/effect/proc_holder/slab/compromise/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, L: Value = null, brutedamage: Value = null, burndamage: Value = null, oxydamage: Value = null, totaldamage: Value = null, targetturf: Value = null, has_holy_water: Value = null, healseverity: Value = null, i: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [_T, L, brutedamage, burndamage, oxydamage, totaldamage, targetturf, has_holy_water, healseverity, i, $0, $1, $2, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 1;
	}
	if ((truthy((rt.istype(live(f.args[2]), T("/mob/living")) ? 1 : 0)) && truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0)))) {
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [(L = live(f.args[2]))])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ does not yet serve Ratvar.\"</span>", [live(L)])]);
			return 1;
		}
		if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ ＀ dead. ＀\"</span>", [(yield* g.callName(f, live(L), "p_they", [1])), (yield* g.callName(f, live(L), "p_are", [])), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Oh, child. To have your life cut short..."]))])]);
			return 1;
		}
		brutedamage = (yield* g.callName(f, live(L), "getBruteLoss", []));
		burndamage = (yield* g.callName(f, live(L), "getFireLoss", []));
		oxydamage = (yield* g.callName(f, live(L), "getOxyLoss", []));
		if ((!truthy((totaldamage = add(add(live(brutedamage), live(burndamage)), live(oxydamage)))) && (!truthy(rt.fv(f, "reagents", live(L))) || !truthy((yield* g.callName(f, rt.fv(f, "reagents", live(L)), "has_reagent", ["holywater"])))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ is unhurt and untainted.\"</span>", [live(L)])]);
			return 1;
		}
		rt.setSv(f, "successful", 1);
		$0 = rt.sv(f, "ranged_ability_user");
		if (isEqual(live(L), rt.sv(f, "ranged_ability_user"))) {
			$1 = "yourself";
		} else {
			$1 = fmt("＀", [live(L)]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='brass'>You bathe ＀ in Inath-neq's power!</span>", [$1])]);
		targetturf = rt.getStep(f, live(L), 0);
		has_holy_water = (rt.fv(f, "reagents", live(L)) && (yield* g.callName(f, rt.fv(f, "reagents", live(L)), "has_reagent", ["holywater"])));
		healseverity = (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(live(totaldamage), 0.05000000074505806), 1])), 1]));
		i = null;
		rt.forRange(f, 0, 1, live(healseverity), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.new_(f, T("/obj/effect/temp_visual/heal"), [live(targetturf), "#1E8CE1"]);
		}
		rt.endFor(f, 0);
		if (truthy(live(totaldamage))) {
			yield* g.callName(f, live(L), "adjustBruteLoss", [rt.neg(live(brutedamage))]);
			yield* g.callName(f, live(L), "adjustFireLoss", [rt.neg(live(burndamage))]);
			yield* g.callName(f, live(L), "adjustOxyLoss", [rt.neg(live(oxydamage))]);
			yield* g.callName(f, live(L), "adjustToxLoss", [multiply(live(totaldamage), 0.5), 1, 1]);
			$0 = rt.sv(f, "ranged_ability_user");
			if (truthy(live(has_holy_water))) {
				$1 = "Heal tainted";
			} else {
				$1 = "Mend wounded";
			}
			yield* g.call(f, P("/proc/clockwork_say"), null, [$0, (yield* g.call(f, P("/proc/text2ratvar"), null, [fmt("＀ flesh!", [$1])]))]);
			yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(L), "healed with Sentinel's Compromise"]);
			$0 = live(L);
			$1 = live(L);
			if (truthy(live(has_holy_water))) {
				$1 = $1;
				$2 = fmt("causing ＀ to briefly glow as it mends", [(yield* g.callName(f, live(L), "p_them", []))]);
			} else {
				$2 = " mending";
			}
			$1 = fmt("<span class='warning'>A blue light washes over ＀, ＀ ＀ bruises and burns!</span>", [$1, $2, (yield* g.callName(f, live(L), "p_their", []))]);
			if (truthy(live(has_holy_water))) {
				$2 = " and purging the darkness within you";
			} else {
				$2 = "";
			}
			yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='heavy_brass'>You feel Inath-neq's power healing your wounds＀, but a deep nausea overcomes you!</span>", [$2])]);
		} else {
			yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "ranged_ability_user"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Purge foul darkness!"]))]);
			yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(L), "purged of holy water with Sentinel's Compromise"]);
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>A blue light washes over ＀, causing ＀ to briefly glow!</span>", [live(L), (yield* g.callName(f, live(L), "p_them", []))]), "<span class='heavy_brass'>You feel Inath-neq's power purging the darkness within you!</span>"]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(targetturf), rt.rsc("sound/magic/staff_healing.ogg"), 50, 1]);
		if (truthy(live(has_holy_water))) {
			yield* g.callName(f, rt.fv(f, "reagents", live(L)), "remove_reagent", ["holywater", 1000]);
		}
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(11265, "/obj/effect/proc_holder/slab/volt", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/volt_target.dmi"),
});

// /obj/effect/proc_holder/slab/volt/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:153)  may sleep
rt.def("/obj/effect/proc_holder/slab/volt/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((isEqual(live(f.args[2]), rt.sv(f, "slab")) || truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 1;
	}
	if (truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) {
		rt.setSv(f, "successful", 1);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "visible_message", [fmt("<span class='warning'>＀ fires a ray of energy at ＀!</span>", [rt.sv(f, "ranged_ability_user"), live(f.args[2])]), fmt("<span class='nzcrentr'>You fire a volt ray at ＀.</span>", [live(f.args[2])])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "ranged_ability_user"), rt.rsc("sound/effects/light_flicker.ogg"), 50, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/volt_hit"), [(_T = rt.getStep(f, live(f.args[2]), 0)), rt.sv(f, "ranged_ability_user")]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(_T), "fired a volt ray"]);
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(11266, "/obj/effect/proc_holder/slab/vanguard", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/vanguard_target.dmi"),
});

// /obj/effect/proc_holder/slab/vanguard/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:176)  may sleep
rt.def("/obj/effect/proc_holder/slab/vanguard/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, L: Value = null, LT: Value = null;
	let $e: any;
	f.vars = () => [_T, L, LT, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 1;
	}
	if ((truthy((rt.istype(live(f.args[2]), T("/mob/living")) ? 1 : 0)) && truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0)))) {
		if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [(L = live(f.args[2]))])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ does not yet serve Ratvar.\"</span>", [live(L)])]);
			return 1;
		}
		if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ ＀ dead. ＀\"</span>", [(yield* g.callName(f, live(L), "p_they", [1])), (yield* g.callName(f, live(L), "p_are", [])), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Oh, child. To have your life cut short..."]))])]);
			return 1;
		}
		if (((truthy((rt.istype(rt.fv(f, "stun_absorption", live(L)), T("/list")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "stun_absorption", live(L)), "vanguard"))) && rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", live(L)), "vanguard"), "end_time"), rt.worldTime(f)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), fmt("<span class='inathneq'>\"＀ ＀ already shielded by a Vanguard.\"</span>", [(yield* g.callName(f, live(L), "p_they", [1])), (yield* g.callName(f, live(L), "p_are", []))])]);
			return 1;
		}
		rt.setSv(f, "successful", 1);
		if (isEqual(live(L), rt.sv(f, "ranged_ability_user"))) {
			LT = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/spiral_range"), null, [7, live(_T)])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				LT = $e;
				if (((((isEqual(rt.fv(f, "stat", live(LT)), 2) || !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(LT)])))) || isEqual(live(LT), rt.sv(f, "ranged_ability_user"))) || !truthy((rt.isIn(f, live(LT), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) || ((truthy((rt.istype(rt.fv(f, "stun_absorption", live(LT)), T("/list")) ? 1 : 0)) && truthy(rt.index(rt.fv(f, "stun_absorption", live(LT)), "vanguard"))) && rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", live(LT)), "vanguard"), "end_time"), rt.worldTime(f))))) {
					continue;
				}
				L = live(LT);
				break;
			}
			rt.endFor(f, 0);
		}
		yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/vanguard_shield")]);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "apply_status_effect", [T("/datum/status_effect/vanguard_shield")]);
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "ranged_ability_user"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Shield us from darkness!"]))]);
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(11267, "/obj/effect/proc_holder/slab/judicial", "/obj/effect/proc_holder/slab", {
	ranged_mousepointer: rt.rsc("icons/effects/visor_reticule.dmi"),
});

// /obj/effect/proc_holder/slab/judicial/proc/InterceptClickOn  (code/game/gamemodes/clock_cult/clock_helpers/slab_abilities.dm:219)  may sleep
rt.def("/obj/effect/proc_holder/slab/judicial/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	let _T: Value = null, targetturf: Value = null;
	f.vars = () => [_T, targetturf];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(_T = rt.fv(f, "loc", rt.sv(f, "ranged_ability_user")))])))) {
		return 1;
	}
	if (truthy((rt.isIn(f, live(f.args[2]), (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "ranged_ability_user"), 0)]))) ? 1 : 0))) {
		rt.setSv(f, "successful", 1);
		yield* g.call(f, P("/proc/clockwork_say"), null, [rt.sv(f, "ranged_ability_user"), (yield* g.call(f, P("/proc/text2ratvar"), null, ["Kneel, heathens!"]))]);
		yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "visible_message", [fmt("<span class='warning'>＀'s eyes fire a stream of energy at ＀, creating a strange mark!</span>", [rt.sv(f, "ranged_ability_user"), live(f.args[2])]), fmt("<span class='heavy_brass'>You direct the judicial force to ＀.</span>", [live(f.args[2])])]);
		yield* g.new_(f, T("/obj/effect/clockwork/judicial_marker"), [(targetturf = rt.getStep(f, live(f.args[2]), 0)), rt.sv(f, "ranged_ability_user")]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.sv(f, "ranged_ability_user"), live(targetturf), "created a judicial marker"]);
		yield* g.srcCall(f, "remove_ranged_ability");
	}
	return 1;
}, true, { args: ["caller", "params", "target"] });
