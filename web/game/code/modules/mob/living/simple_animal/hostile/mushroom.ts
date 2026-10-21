// From code/modules/mob/living/simple_animal/hostile/mushroom.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4972, "/mob/living/simple_animal/hostile/mushroom", "/mob/living/simple_animal/hostile", {
	cap_color: "#ffffff",
	powerlevel: 0,
	bruised: 0,
	recovery_cooldown: 0,
	faint_ticker: 0,
	attack_same: 2,
	stat_attack: 2,
	robust_searching: 1,
	name: "walking mushroom",
	desc: "It's a massive mushroom... with legs?",
	icon_state: "mushroom_color",
	icon_living: "mushroom_color",
	icon_dead: "mushroom_dead",
	speak_chance: 0,
	turns_per_move: 1,
	maxHealth: 10,
	health: 10,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "whacks",
	harm_intent_damage: 5,
	obj_damage: 0,
	melee_damage_lower: 1,
	melee_damage_upper: 1,
	attacktext: "chomps",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	faction: null,
	environment_smash: 0,
	mouse_opacity: 1,
	speed: 1,
	ventcrawler: 2,
	unique_name: 1,
	speak_emote: null,
	deathmessage: "fainted.",
}, { global: { cap_living: 721, cap_dead: 722 } });

// /mob/living/simple_animal/hostile/mushroom/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:11)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice"), 1]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("mushroom"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("squeaks"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/mushroom/proc/examine  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:41)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.ge(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='info'>It looks healthy.</span>"]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='info'>It looks like it's been roughed up.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /mob/living/simple_animal/hostile/mushroom/proc/Life  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:48)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Life", function* Life(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "adjustBruteLoss", -2);
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/mushroom/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Initialize", function* Initialize(f: Frame) {
	rt.modSrcVar(f, "melee_damage_lower", (yield* g.call(f, P("/proc/rand"), null, [3, 5])), add);
	rt.modSrcVar(f, "melee_damage_upper", (yield* g.call(f, P("/proc/rand"), null, [10, 20])), add);
	rt.modSrcVar(f, "maxHealth", (yield* g.call(f, P("/proc/rand"), null, [40, 60])), add);
	rt.setSv(f, "move_to_delay", (yield* g.call(f, P("/proc/rand"), null, [3, 11])));
	rt.setGl("cap_living", (rt.gl("cap_living") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "mushroom_cap"]))));
	rt.setGl("cap_dead", (rt.gl("cap_dead") || (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "mushroom_cap_dead"]))));
	rt.setSv(f, "cap_color", rt.op(f, "Rgb", [1, 3], [(yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255])), (yield* g.call(f, P("/proc/rand"), null, [0, 255]))]));
	yield* g.srcCall(f, "UpdateMushroomCap");
	rt.setSv(f, "health", rt.sv(f, "maxHealth"));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mushroom/proc/adjustHealth  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:66)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if ((!truthy(rt.sv(f, "retreat_distance")) && truthy(rt.op(f, "Prob", [], [33])))) {
		rt.setSv(f, "retreat_distance", 5);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/mushroom/proc/stop_retreat")])), 30]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// /mob/living/simple_animal/hostile/mushroom/proc/stop_retreat  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:72)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/stop_retreat", function stop_retreat(f: Frame) {
	rt.setSv(f, "retreat_distance", null);
	return f.dot;
});

// /mob/living/simple_animal/hostile/mushroom/proc/attack_animal  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:75)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attack_animal", function* attack_animal(f: Frame) {
	let M: Value = null, level_gain: Value = null;
	f.vars = () => [M, level_gain];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/simple_animal/hostile/mushroom")) ? 1 : 0)) && isEqual(rt.sv(f, "stat"), 2))) {
		M = live(f.args[0]);
		if (rt.lt(rt.sv(f, "faint_ticker"), 2)) {
			yield* g.callName(f, live(M), "visible_message", [fmt("＀ chews a bit on ＀.", [live(M), live(f.src)])]);
			rt.incSrcVar(f, "faint_ticker", 1, true);
			return 1;
		}
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ devours ＀!</span>", [live(M), live(f.src)])]);
		if (((rt.ge((level_gain = subtract(rt.sv(f, "powerlevel"), rt.fv(f, "powerlevel", live(M)))), -1) && !truthy(rt.sv(f, "bruised"))) && !truthy(rt.fv(f, "ckey", live(M))))) {
			if (rt.lt(live(level_gain), 1)) {
				level_gain = 1;
			}
			yield* g.callName(f, live(M), "LevelUp", [live(level_gain)]);
		}
		yield* g.callName(f, live(M), "adjustBruteLoss", [rt.neg(rt.fv(f, "maxHealth", live(M)))]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["L"] });

// /mob/living/simple_animal/hostile/mushroom/proc/revive  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:93)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/revive", function* revive(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	rt.setSv(f, "icon_state", "mushroom_color");
	yield* g.srcCall(f, "UpdateMushroomCap");
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// /mob/living/simple_animal/hostile/mushroom/proc/death  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:99)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/death", function* death(f: Frame, gibbed: Value) {
	f.vars = () => [gibbed];
	yield* g.callSuper(f, [live(gibbed)]);
	yield* g.srcCall(f, "UpdateMushroomCap");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mushroom/proc/UpdateMushroomCap  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:103)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/UpdateMushroomCap", function UpdateMushroomCap(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	rt.setFv(f, "color", rt.gl("cap_living"), rt.sv(f, "cap_color"));
	rt.setFv(f, "color", rt.gl("cap_dead"), rt.sv(f, "cap_color"));
	if (isEqual(rt.sv(f, "health"), 0)) {
		rt.callSrc(f, "add_overlay", [rt.gl("cap_dead")]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.gl("cap_living")]);
	}
	return f.dot;
});

// /mob/living/simple_animal/hostile/mushroom/proc/Recover  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:112)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Recover", function* Recover(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ slowly begins to recover.", [live(f.src)]));
	rt.setSv(f, "faint_ticker", 0);
	yield* g.callSrc(f, "revive", ["full_heal", 1], rt.Args.Named);
	yield* g.srcCall(f, "UpdateMushroomCap");
	rt.setSv(f, "recovery_cooldown", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/simple_animal/hostile/mushroom/proc/recovery_recharge")])), 300]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mushroom/proc/LevelUp  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:123)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/LevelUp", function* LevelUp(f: Frame, level_gain: Value) {
	f.vars = () => [level_gain];
	if (rt.le(rt.sv(f, "powerlevel"), 9)) {
		rt.modSrcVar(f, "powerlevel", live(level_gain), add);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			rt.modSrcVar(f, "melee_damage_lower", multiply(live(level_gain), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
		} else {
			rt.modSrcVar(f, "melee_damage_upper", multiply(live(level_gain), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
		}
		rt.modSrcVar(f, "maxHealth", multiply(live(level_gain), (yield* g.call(f, P("/proc/rand"), null, [1, 5]))), add);
	}
	yield* g.srcCall(f, "adjustBruteLoss", rt.neg(rt.sv(f, "maxHealth")));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mushroom/proc/Bruise  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:133)
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/Bruise", function Bruise(f: Frame) {
	if (!(!truthy(rt.sv(f, "bruised")) && !truthy(rt.sv(f, "stat")))) return f.dot;
	rt.callName(f, live(f.src), "visible_message", [fmt("The ＀ was bruised!", [rt.fv(f, "name", live(f.src))])]);
	rt.setSv(f, "bruised", 1);
	return f.dot;
});

// /mob/living/simple_animal/hostile/mushroom/proc/attackby  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:138)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/grown/mushroom")) ? 1 : 0))) {
		if ((isEqual(rt.sv(f, "stat"), 2) && !truthy(rt.sv(f, "recovery_cooldown")))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ won't eat it!</span>", [live(f.src)])]);
		}
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "force", live(f.args[0])))) {
		yield* g.srcCall(f, "Bruise");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /mob/living/simple_animal/hostile/mushroom/proc/attack_hand  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:150)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[0])), "harm")) return f.dot;
	yield* g.srcCall(f, "Bruise");
	return f.dot;
}, true, { args: ["M"] });

// /mob/living/simple_animal/hostile/mushroom/proc/hitby  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:155)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/hitby", function* hitby(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "throwforce", (_T = live(f.args[0]))))) return f.dot;
	yield* g.srcCall(f, "Bruise");
	return f.dot;
}, true, { args: ["AM"] });

// /mob/living/simple_animal/hostile/mushroom/proc/bullet_act  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:162)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "Bruise");
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/mushroom/proc/harvest  (code/modules/mob/living/simple_animal/hostile/mushroom.dm:167)  may sleep
rt.def("/mob/living/simple_animal/hostile/mushroom/proc/harvest", function* harvest(f: Frame) {
	let counter: Value = null, S: Value = null;
	f.vars = () => [counter, S];
	counter = null;
	counter = 0;
	while (rt.le(live(counter), rt.sv(f, "powerlevel"))) {
		yield* g.callName(f, rt.gv(f, "reagents", (S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/hugemushroomslice"), [rt.fv(f, "loc", live(f.src))])))), "add_reagent", ["mushroomhallucinogen", rt.sv(f, "powerlevel")]);
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["omnizine", rt.sv(f, "powerlevel")]);
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["synaptizine", rt.sv(f, "powerlevel")]);
		counter = rt.inc(live(counter), 1);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
