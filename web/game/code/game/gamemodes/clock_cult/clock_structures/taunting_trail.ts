// From code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12163, "/obj/structure/destructible/clockwork/taunting_trail", "/obj/structure/destructible/clockwork", {
	timerid: null,
	clockwork_desc: "A cloud of purple smoke that confuses and knocks down non-Servants that enter it.",
	name: "strange smoke",
	desc: "A cloud of purple smoke.",
	gender: "plural",
	max_integrity: 5,
	obj_integrity: 5,
	density: 1,
	color: null,
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "smoke",
	break_message: null,
	break_sound: rt.rsc("sound/magic/teleport_app.ogg"),
	debris: null,
});

// /obj/structure/destructible/clockwork/taunting_trail/proc/<init>  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:10)
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "color", rt.list("#AF0AAF", "#AF0AAF", "#AF0AAF", "#000000"));
	$0 = $0;
	rt.setSv(f, "debris", rt.list());
	return f.dot;
});

// /obj/structure/destructible/clockwork/taunting_trail/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:19)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Initialize", function* Initialize(f: Frame) {
	let Tt: Value = null, TT: Value = null;
	let $e: any;
	f.vars = () => [Tt, TT, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "timerid", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 15, 8])));
	if ((truthy((Tt = rt.locateIn(f, T("/obj/structure/destructible/clockwork/taunting_trail"), rt.sv(f, "loc")))) && !isEqual(live(Tt), live(f.src)))) {
		if (!truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")])])))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(Tt)]);
		} else {
			TT = null;
			rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/destructible/clockwork/taunting_trail"));
			while (($e = rt.next(f, 0)) !== undefined) {
				TT = $e;
				if (!isEqual(live(TT), live(f.src))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(TT)]);
				}
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
	rt.setSv(f, "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 1.2999999523162842));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 100, "time", 15]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/taunting_trail/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:34)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timerid")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/taunting_trail/proc/play_attack_sound  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:38)
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	f.vars = () => [damage_type, damage_flag];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 50, 1]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/taunting_trail/proc/Crossed  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:44)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Crossed", function* Crossed(f: Frame) {
	yield* g.srcCall(f, "affect_mob", live(f.args[0]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM"] });

// /obj/structure/destructible/clockwork/taunting_trail/proc/Bumped  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:48)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Bumped", function* Bumped(f: Frame) {
	yield* g.srcCall(f, "affect_mob", live(f.args[0]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM"] });

// /obj/structure/destructible/clockwork/taunting_trail/proc/Bump  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:52)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/Bump", function* Bump(f: Frame) {
	yield* g.srcCall(f, "affect_mob", live(f.args[0]));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM"] });

// /obj/structure/destructible/clockwork/taunting_trail/proc/affect_mob  (code/game/gamemodes/clock_cult/clock_structures/taunting_trail.dm:56)  may sleep
rt.def("/obj/structure/destructible/clockwork/taunting_trail/proc/affect_mob", function* affect_mob(f: Frame, L: Value) {
	f.vars = () => [L];
	if (!(truthy((rt.istype(live(L), T("/mob/living")) ? 1 : 0)) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) return f.dot;
	if (!truthy((yield* g.callName(f, live(L), "null_rod_check", [])))) {
		rt.setFv(f, "confused", live(L), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "confused", live(L)), 15), 50])));
		rt.setFv(f, "dizziness", live(L), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "dizziness", live(L)), 15), 50])));
		if (rt.ge(rt.fv(f, "confused", live(L)), 25)) {
			yield* g.callName(f, live(L), "Knockdown", [(yield* g.call(f, P("/proc/Floor"), null, [multiply(rt.fv(f, "confused", live(L)), 0.800000011920929)]))]);
		}
	}
	yield* g.srcCall(f, "take_damage", rt.sv(f, "max_integrity"));
	return f.dot;
}, true);
