// From code/datums/martial.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(567, "/datum/martial_art", "/datum", {
	name: "Martial Art",
	streak: "",
	max_streak_length: 6,
	current_target: null,
	temporary: 0,
	base: null,
	deflection_chance: 0,
	block_chance: 0,
	restraining: 0,
	help_verb: null,
	no_guns: 0,
	allow_temp_override: 1,
});

// /datum/martial_art/proc/add_to_streak  (code/datums/martial.dm:25)
rt.def("/datum/martial_art/proc/add_to_streak", function add_to_streak(f: Frame, element: Value, D: Value) {
	if (!isEqual(live(D), rt.sv(f, "current_target"))) {
		rt.setSv(f, "current_target", live(D));
		rt.setSv(f, "streak", "");
		rt.setSv(f, "restraining", 0);
	}
	rt.setSv(f, "streak", add(rt.sv(f, "streak"), live(element)));
	if (rt.gt(rt.length(rt.sv(f, "streak")), rt.sv(f, "max_streak_length"))) {
		rt.setSv(f, "streak", rt.call(f, P("/proc/copytext"), null, [rt.sv(f, "streak"), 2]));
	}
	return live(f.dot);
});

// /datum/martial_art/proc/basic_hit  (code/datums/martial.dm:36)  may sleep
rt.def("/datum/martial_art/proc/basic_hit", function* basic_hit(f: Frame, A: Value, D: Value) {
	let damage: Value = null, atk_verb: Value = null, affecting: Value = null, armor_block: Value = null;
	let $0: any;
	f.vars = () => [A, D, damage, atk_verb, affecting, armor_block, $0];
	damage = (yield* g.call(f, P("/proc/rand"), null, [rt.gv(f, "punchdamagelow", rt.gv(f, "species", rt.fv(f, "dna", live(A)))), rt.gv(f, "punchdamagehigh", rt.gv(f, "species", rt.fv(f, "dna", live(A))))]));
	atk_verb = rt.gv(f, "attack_verb", rt.gv(f, "species", rt.fv(f, "dna", live(A))));
	if (truthy(rt.fv(f, "lying", live(D)))) {
		atk_verb = "kick";
	}
	$0 = live(atk_verb);
	if ($0 === "kick") {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "kick"]);
	} else if ($0 === "slash") {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "claw"]);
	} else if ($0 === "smash") {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "smash"]);
	} else {
		yield* g.callName(f, live(A), "do_attack_animation", [live(D), "punch"]);
	}
	if (!truthy(live(damage))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.gv(f, "miss_sound", rt.gv(f, "species", rt.fv(f, "dna", live(A)))), 25, 1, -1]);
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀ has attempted to ＀ ＀!</span>", [live(A), live(atk_verb), live(D)]), fmt("<span class='userdanger'>＀ has attempted to ＀ ＀!</span>", [live(A), live(atk_verb), live(D)]), null, 3]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), fmt("attempted to ＀", [live(atk_verb)])]);
		return 0;
	}
	affecting = (yield* g.callName(f, live(D), "get_bodypart", [(yield* g.call(f, P("/proc/ran_zone"), null, [rt.fv(f, "zone_selected", live(A))]))]));
	armor_block = (yield* g.callName(f, live(D), "run_armor_check", [live(affecting), "melee"]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(D)), rt.gv(f, "attack_sound", rt.gv(f, "species", rt.fv(f, "dna", live(A)))), 25, 1, -1]);
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has ＀ed ＀!</span>", [live(A), live(atk_verb), live(D)]), fmt("<span class='userdanger'>＀ has ＀ed ＀!</span>", [live(A), live(atk_verb), live(D)]), null, 3]);
	yield* g.callName(f, live(D), "apply_damage", [live(damage), "brute", live(affecting), live(armor_block)]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(A), live(D), "punched"]);
	if ((!isEqual(rt.fv(f, "stat", live(D)), 2) && rt.ge(live(damage), rt.gv(f, "punchstunthreshold", rt.gv(f, "species", rt.fv(f, "dna", live(A))))))) {
		yield* g.callName(f, live(D), "visible_message", [fmt("<span class='danger'>＀ has knocked ＀ down!!</span>", [live(A), live(D)]), fmt("<span class='userdanger'>＀ has knocked ＀ down!</span>", [live(A), live(D)])]);
		yield* g.callName(f, live(D), "apply_effect", [40, "knockdown", live(armor_block)]);
		yield* g.callName(f, live(D), "forcesay", [rt.gl("hit_appends")]);
	} else {
		if (truthy(rt.fv(f, "lying", live(D)))) {
			yield* g.callName(f, live(D), "forcesay", [rt.gl("hit_appends")]);
		}
	}
	return 1;
}, true);

// /datum/martial_art/proc/teach  (code/datums/martial.dm:82)
rt.def("/datum/martial_art/proc/teach", function teach(f: Frame, H: Value, make_temporary: Value) {
	f.vars = () => [make_temporary];
	if (live(make_temporary) === null) {
		make_temporary = 0;
	}
	if (truthy(live(make_temporary))) {
		rt.setSv(f, "temporary", 1);
	}
	if ((truthy(rt.sv(f, "temporary")) && truthy(rt.gv(f, "martial_art", rt.fv(f, "mind", live(H)))))) {
		if (!truthy(rt.gv(f, "allow_temp_override", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H)))))) {
			return live(f.dot);
		}
		rt.setSv(f, "base", rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))));
	}
	if (truthy(rt.sv(f, "help_verb"))) {
		rt.modField(f, live(H), "verbs", rt.sv(f, "help_verb"), add);
	}
	rt.setFv(f, "martial_art", rt.fv(f, "mind", live(H)), live(f.src));
	return f.dot;
});

// /datum/martial_art/proc/remove  (code/datums/martial.dm:91)
rt.def("/datum/martial_art/proc/remove", function remove(f: Frame, H: Value) {
	if (!isEqual(rt.gv(f, "martial_art", rt.fv(f, "mind", live(H))), live(f.src))) {
		return live(f.dot);
	}
	rt.setFv(f, "martial_art", rt.fv(f, "mind", live(H)), rt.sv(f, "base"));
	if (!truthy(rt.sv(f, "help_verb"))) return f.dot;
	(rt.modField(f, live(H), "verbs", rt.sv(f, "help_verb"), subtract));
	return f.dot;
});
