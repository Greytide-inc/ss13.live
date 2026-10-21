// From code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12162, "/obj/structure/destructible/clockwork/ocular_warden", "/obj/structure/destructible/clockwork", {
	damage_per_tick: 2.7,
	sight_range: 3,
	target: null,
	idle_messages: null,
	clockwork_desc: "A fragile turret which will automatically attack nearby unrestrained non-Servants that can see it.",
	unanchored_icon: "ocular_warden_unwrenched",
	construction_value: 15,
	name: "ocular warden",
	desc: "A large brass eye with tendrils trailing below it and a wide red iris.",
	icon_state: "ocular_warden",
	obj_integrity: 25,
	max_integrity: 25,
	layer: 4.25,
	break_message: "<span class='warning'>The warden's eye gives a glare of utter hate before falling dark!</span>",
	debris: null,
	resistance_flags: 35,
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:13)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "idle_messages", rt.list(" sulkily glares around.", " lazily drifts from side to side.", " looks around for something to burn.", " slowly turns in circles."));
	$0 = $0;
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/component/belligerent_eye/blind_eye"), 1]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:21)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:25)  may sleep
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/ocular_warden/proc/examine  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:29)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "target"))) {
		$1 = fmt("<b>It's fixated on ＀!</b>", [rt.sv(f, "target")]);
	} else {
		$1 = "Its gaze is wandering aimlessly.";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='brass'>＀</span>", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/ocular_warden/proc/can_be_unfasten_wrench  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:37)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	let W: Value = null;
	let $e: any;
	f.vars = () => [W, $e];
	if (truthy(rt.sv(f, "anchored"))) {
		if (rt.le(rt.sv(f, "obj_integrity"), multiply(rt.sv(f, "max_integrity"), 0.25))) {
			if (!truthy(live(silent))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is too damaged to unsecure!</span>", [live(f.src)])]);
			}
			return 1;
		}
	} else {
		W = null;
		rt.forList(f, 0, rt.call(f, P("/proc/orange"), null, [3, live(f.src)]), T("/obj/structure/destructible/clockwork/ocular_warden"));
		while (($e = rt.next(f, 0)) !== undefined) {
			W = $e;
			if (!truthy(live(silent))) {
				rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='neovgre'>You sense another ocular warden too near this location. Activating this one this close would cause them to fight.</span>"]);
			}
			return 1;
		}
		rt.endFor(f, 0);
	}
	return 2;
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:49)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/ratvar_act", function ratvar_act(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "damage_per_tick", 10);
		rt.setSv(f, "sight_range", 6);
	} else {
		rt.setSv(f, "damage_per_tick", rt.initial(f, live(f.src), "damage_per_tick"));
		rt.setSv(f, "sight_range", rt.initial(f, live(f.src), "sight_range"));
	}
	return f.dot;
});

// /obj/structure/destructible/clockwork/ocular_warden/proc/process  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:58)  may sleep
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/process", function* process(f: Frame) {
	let validtargets: Value = null, L: Value = null, R: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [validtargets, L, R, M, $0, $1, $2];
	if (!truthy(rt.sv(f, "anchored"))) {
		yield* g.srcCall(f, "lose_target");
		return live(f.dot);
	}
	validtargets = (yield* g.srcCall(f, "acquire_nearby_targets"));
	if (truthy(rt.sv(f, "target"))) {
		if (!truthy((rt.isIn(f, rt.sv(f, "target"), live(validtargets)) ? 1 : 0))) {
			yield* g.srcCall(f, "lose_target");
		} else {
			if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, (L = rt.sv(f, "target")), "null_rod_check", [])))) {
					if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/revenant")) ? 1 : 0))) {
						if (truthy(rt.gv(f, "revealed", (R = live(L))))) {
							rt.modField(f, live(R), "unreveal_time", 2, add);
						} else {
							yield* g.callName(f, live(R), "reveal", [10]);
						}
					}
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						yield* g.callName(f, live(L), "playsound_local", [null, rt.rsc("sound/machines/clockcult/ocularwarden-dot1.ogg"), 50, 1]);
					} else {
						yield* g.callName(f, live(L), "playsound_local", [null, rt.rsc("sound/machines/clockcult/ocularwarden-dot2.ogg"), 50, 1]);
					}
					$0 = live(L);
					if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)])))) {
						$1 = rt.sv(f, "damage_per_tick");
					} else {
						$1 = multiply(rt.sv(f, "damage_per_tick"), 2);
					}
					yield* g.callName(f, $0, "adjustFireLoss", [multiply($1, (yield* g.srcCall(f, "get_efficiency_mod")))]);
					if ((truthy(rt.gl("ratvar_awakens")) && truthy(live(L)))) {
						yield* g.callName(f, live(L), "adjust_fire_stacks", [rt.sv(f, "damage_per_tick")]);
						yield* g.callName(f, live(L), "IgniteMob", []);
					}
				}
			} else {
				if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/mecha")) ? 1 : 0))) {
					yield* g.callName(f, (M = rt.sv(f, "target")), "take_damage", [multiply(rt.sv(f, "damage_per_tick"), (yield* g.srcCall(f, "get_efficiency_mod"))), "fire", "melee", 1, rt.getDir(f, live(f.src), live(M))]);
				}
			}
			yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/ocular_warden"), [rt.getStep(f, rt.sv(f, "target"), 0)]);
			yield* g.srcCall(f, "setDir", rt.getDir(f, rt.getStep(f, live(f.src), 0), rt.getStep(f, rt.sv(f, "target"), 0)));
		}
	}
	if (truthy(rt.sv(f, "target"))) return f.dot;
	if (truthy(rt.len(f, live(validtargets)))) {
		rt.setSv(f, "target", rt.op(f, "PickUnweighted", [1], [live(validtargets)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/machines/clockcult/ocularwarden-target.ogg"), 50, 1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ swivels to face ＀!</span>", [live(f.src), rt.sv(f, "target")]));
		if (truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0))) {
			$0 = (L = rt.sv(f, "target"));
			$1 = live(f.src);
			if (truthy(rt.gl("ratvar_awakens"))) {
				$2 = "melts you alive";
			} else {
				$2 = "burns you";
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='heavy_brass'>\"I SEE YOU!\"</span>\n<span class='userdanger'>＀'s gaze ＀!</span>", [$1, $2])]);
		} else {
			if (truthy((rt.istype(rt.sv(f, "target"), T("/obj/mecha")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.gv(f, "occupant", (M = rt.sv(f, "target"))), "<span class='heavy_brass'>\"I SEE YOU!\"</span>"]);
			}
		}
	} else {
		if (!truthy(rt.op(f, "Prob", [], [0.5]))) return f.dot;
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀＀</span>", [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.sv(f, "idle_messages")])]));
		} else {
			yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/destructible/clockwork/ocular_warden/proc/acquire_nearby_targets  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:108)  may sleep
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/acquire_nearby_targets", function* acquire_nearby_targets(f: Frame) {
	let L: Value = null, B: Value = null, BI: Value = null, H: Value = null, N: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, B, BI, H, N, M, $e];
	f.dot = rt.list();
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [rt.sv(f, "sight_range"), live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (truthy((B = (yield* g.callName(f, live(L), "bible_check", []))))) {
			if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(B)), 8))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='warning'>Your ＀ bursts into flames!</span>", [rt.fv(f, "name", live(B))])]);
			}
			BI = null;
			rt.forList(f, 1, (yield* g.callName(f, live(L), "GetAllContents", [])), T("/obj/item/weapon/storage/book/bible"));
			while (($e = rt.next(f, 1)) !== undefined) {
				BI = $e;
				if (!truthy(rt.bitAnd(rt.fv(f, "resistance_flags", live(BI)), 8))) {
					yield* g.callName(f, live(BI), "fire_act", []);
				}
			}
			rt.endFor(f, 1);
			continue;
		}
		if (((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))) || truthy(rt.bitAnd(rt.fv(f, "disabilities", live(L)), 1))) || truthy((yield* g.callName(f, live(L), "null_rod_check", []))))) {
			continue;
		}
		if (((((truthy(rt.fv(f, "stat", live(L))) || truthy((yield* g.callName(f, live(L), "restrained", [])))) || truthy(rt.fv(f, "buckled", live(L)))) || truthy(rt.fv(f, "lying", live(L)))) || truthy((rt.istype(rt.fv(f, "buckled", live(L)), T("/obj/structure/destructible/clockwork/geis_binding")) ? 1 : 0)))) {
			continue;
		}
		if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile")) ? 1 : 0))) {
			if ((truthy((rt.istype((H = live(L)), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0)) || (!truthy(rt.fv(f, "mind", live(H))) && isEqual(rt.fv(f, "AIStatus", live(H)), 3)))) {
				continue;
			}
			if ((truthy((rt.isIn(f, "ratvar", rt.fv(f, "faction", live(H))) ? 1 : 0)) || truthy((rt.isIn(f, "neutral", rt.fv(f, "faction", live(H))) ? 1 : 0)))) {
				continue;
			}
		} else {
			if (!truthy(rt.fv(f, "mind", live(L)))) {
				continue;
			}
		}
		f.dot = rt.modify(live(f.dot), live(L), add);
	}
	rt.endFor(f, 0);
	N = null;
	rt.forList(f, 0, rt.gl("mechas_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		N = $e;
		if ((((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [(M = live(N)), live(f.src)])), rt.sv(f, "sight_range")) && truthy(rt.fv(f, "occupant", live(M)))) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.fv(f, "occupant", live(M))])))) && truthy((rt.isIn(f, live(M), (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "sight_range"), live(f.src)]))) ? 1 : 0)))) {
			f.dot = rt.modify(live(f.dot), live(M), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/ocular_warden/proc/lose_target  (code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm:137)
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/lose_target", function lose_target(f: Frame) {
	if (!truthy(rt.sv(f, "target"))) {
		return 0;
	}
	rt.setSv(f, "target", null);
	rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ settles and seems almost disappointed.</span>", [live(f.src)])]);
	return 1;
});
