// From code/game/gamemodes/clock_cult/clock_mobs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4860, "/mob/living/simple_animal/hostile/clockwork", "/mob/living/simple_animal/hostile", {
	playstyle_string: "<span class='heavy_brass'>You are a bug, yell at whoever spawned you!</span>",
	verb_ask: "requests",
	verb_exclaim: "proclaims",
	verb_whisper: "imparts",
	verb_yell: "harangues",
	initial_language_holder: rt.typePath("/datum/language_holder/clockmob"),
	light_color: "#E42742",
	faction: null,
	gender: "neuter",
	icon: rt.rsc("icons/mob/clockwork_mobs.dmi"),
	unique_name: 1,
	minbodytemp: 0,
	unsuitable_atmos_damage: 0,
	atmos_requirements: null,
	damage_coeff: null,
	healable: 0,
	del_on_death: 1,
	speak_emote: null,
	bubble_icon: "clock",
	death_sound: rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"),
});

// /mob/living/simple_animal/hostile/clockwork/proc/<init>  (code/game/gamemodes/clock_cult/clock_mobs.dm:9)
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("neutral", "ratvar"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	rt.setSv(f, "damage_coeff", rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]));
	rt.setSv(f, "speak_emote", rt.list("clanks", "clinks", "clunks", "clangs"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/clockwork/proc/get_spans  (code/game/gamemodes/clock_cult/clock_mobs.dm:25)
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /mob/living/simple_animal/hostile/clockwork/proc/Login  (code/game/gamemodes/clock_cult/clock_mobs.dm:28)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/Login", function* Login(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(f.src), 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), rt.sv(f, "playstyle_string")]);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_mobs.dm:33)  may sleep
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* g.srcCall(f, "fully_heal", 1);
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/clockwork/proc/examine  (code/game/gamemodes/clock_cult/clock_mobs.dm:39)
rt.def("/mob/living/simple_animal/hostile/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = null, t_s: Value = null, msg: Value = null;
	f.vars = () => [t_He, t_s, msg];
	t_He = rt.callSrc(f, "p_they", [1]);
	t_s = rt.callSrc(f, "p_s", []);
	msg = fmt("<span class='brass'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(f.src)]);
	msg = rt.modify(live(msg), fmt("＀\n", [rt.sv(f, "desc")]), add);
	if (rt.lt(rt.sv(f, "health"), rt.sv(f, "maxHealth"))) {
		msg = rt.modify(live(msg), "<span class='warning'>", add);
		if (rt.ge(rt.sv(f, "health"), divide(rt.sv(f, "maxHealth"), 2))) {
			msg = rt.modify(live(msg), fmt("＀ look＀ slightly dented.\n", [live(t_He), live(t_s)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<b>＀ look＀ severely dented!</b>\n", [live(t_He), live(t_s)]), add);
		}
		msg = rt.modify(live(msg), "</span>", add);
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});
