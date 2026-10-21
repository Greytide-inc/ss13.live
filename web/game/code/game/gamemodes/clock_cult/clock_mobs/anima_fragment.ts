// From code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4862, "/mob/living/simple_animal/hostile/clockwork/fragment", "/mob/living/simple_animal/hostile/clockwork", {
	movement_delay_time: null,
	light_range: 2,
	light_power: 0.8,
	playstyle_string: "<span class='heavy_brass'>You are an anima fragment</span><b>, a clockwork creation of Ratvar. As a fragment, you have decent health that very gradually regenerates, do decent damage, and move at extreme speed in addition to being immune to extreme temperatures and pressures. Taking damage, and slamming into non-Servants, will temporarily slow you down, however.\nYour goal is to serve the Justiciar and his servants in any way you can. You yourself are one of these servants, and will be able to utilize anything they can, assuming it doesn't require opposable thumbs.</b>",
	name: "anima fragment",
	desc: "An ominous humanoid shell with a spinning cogwheel as its head, lifted by a jet of blazing red flame.",
	icon_state: "anime_fragment",
	health: 90,
	maxHealth: 90,
	speed: -1,
	melee_damage_lower: 18,
	melee_damage_upper: 18,
	attacktext: "crushes",
	attack_sound: rt.rsc("sound/magic/clockwork/anima_fragment_attack.ogg"),
	loot: null,
	weather_immunities: null,
	movement_type: 2,
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/<init>  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:13)
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.list(T("/obj/item/clockwork/component/replicant_alloy/smashed_anima_fragment")));
	$0 = $0;
	rt.setSv(f, "weather_immunities", rt.list("lava"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/Initialize  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:25)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.op(f, "Prob", [], [1]))) return f.dot;
	rt.setSv(f, "name", "anime fragment");
	rt.setSv(f, "desc", "I-it's not like I want to show you the light of the Justiciar or anything, B-BAKA!");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/Life  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:31)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.gl("ratvar_awakens"))) {
		yield* g.srcCall(f, "adjustHealth", -5);
	} else {
		if (rt.gt(rt.sv(f, "movement_delay_time"), rt.worldTime(f))) {
			yield* g.srcCall(f, "adjustHealth", -0.20000000298023224);
		} else {
			yield* g.srcCall(f, "adjustHealth", -1);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/Stat  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:40)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"]))) && rt.gt(rt.sv(f, "movement_delay_time"), rt.worldTime(f))) && !truthy(rt.gl("ratvar_awakens")))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Movement delay(seconds): ＀", [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [multiply(subtract(rt.sv(f, "movement_delay_time"), rt.worldTime(f)), 0.10000000149011612), 0.10000000149011612])), 0]))])]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/death  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:45)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/death", function* death(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s flame jets cut out as it falls to the floor with a tremendous crash.</span>", [live(f.src)]), "<span class='userdanger'>Your gears seize up. Your flame jets flicker out. Your soul vessel belches smoke as you helplessly crash down.</span>");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["gibbed"] });

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/Bump  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/Bump", function* Bump(f: Frame) {
	let L: Value = null, previousattacktext: Value = null;
	f.vars = () => [L, previousattacktext];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(((rt.le(rt.sv(f, "movement_delay_time"), rt.worldTime(f)) && rt.le(rt.sv(f, "next_move"), rt.worldTime(f))) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))))) return f.dot;
	if (truthy(rt.gv(f, "stat", (L = live(f.args[0]))))) {
		return live(f.dot);
	}
	previousattacktext = rt.sv(f, "attacktext");
	rt.setSv(f, "attacktext", "slams into");
	yield* g.srcCall(f, "UnarmedAttack", live(L));
	rt.setSv(f, "attacktext", live(previousattacktext));
	yield* g.srcCall(f, "changeNext_move", 8);
	if (truthy(rt.gl("ratvar_awakens"))) return f.dot;
	yield* g.srcCall(f, "adjustHealth", 4);
	yield* g.srcCall(f, "adjust_movement_delay", 10);
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/emp_act  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:68)
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/emp_act", function emp_act(f: Frame, severity: Value) {
	rt.callSrc(f, "adjust_movement_delay", [divide(50, live(severity))]);
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/movement_delay  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:71)
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(rt.gt(rt.sv(f, "movement_delay_time"), rt.worldTime(f)) && !truthy(rt.gl("ratvar_awakens")))) return f.dot;
	f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/min"), null, [multiply(subtract(rt.sv(f, "movement_delay_time"), rt.worldTime(f)), 0.10000000149011612), 10]), add);
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/adjustHealth  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:76)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/adjustHealth", function* adjustHealth(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!rt.gt(live(f.args[0]), 0)) return f.dot;
	yield* g.srcCall(f, "adjust_movement_delay", multiply(live(f.args[0]), 2.5));
	return f.dot;
}, true, { args: ["amount"] });

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/adjust_movement_delay  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:82)
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/adjust_movement_delay", function adjust_movement_delay(f: Frame, amount: Value) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		rt.setSv(f, "movement_delay_time", 0);
	} else {
		if (rt.gt(rt.sv(f, "movement_delay_time"), rt.worldTime(f))) {
			rt.setSv(f, "movement_delay_time", add(rt.sv(f, "movement_delay_time"), live(amount)));
		} else {
			rt.setSv(f, "movement_delay_time", add(rt.worldTime(f), live(amount)));
		}
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/fragment/proc/updatehealth  (code/game/gamemodes/clock_cult/clock_mobs/anima_fragment.dm:89)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/fragment/proc/updatehealth", function* updatehealth(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		rt.setSv(f, "speed", rt.initial(f, live(f.src), "speed"));
	} else {
		rt.setSv(f, "speed", 0);
	}
	return f.dot;
}, true);
