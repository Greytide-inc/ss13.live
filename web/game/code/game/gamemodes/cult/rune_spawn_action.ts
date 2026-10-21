// From code/game/gamemodes/cult/rune_spawn_action.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(98, "/datum/action/innate/cult/create_rune", "/datum/action/innate/cult", {
	rune_type: null,
	cooldown: 0,
	base_cooldown: 900,
	scribe_time: 100,
	damage_interrupt: 1,
	action_interrupt: 1,
	rune_word_type: null,
	rune_innerring_type: null,
	rune_center_type: null,
	rune_color: null,
	background_icon_state: "bg_cult",
});

// /datum/action/innate/cult/create_rune/proc/IsAvailable  (code/game/gamemodes/cult/rune_spawn_action.dm:16)
rt.def("/datum/action/innate/cult/create_rune/proc/IsAvailable", function IsAvailable(f: Frame) {
	if ((!truthy(rt.sv(f, "rune_type")) || rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f)))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/action/innate/cult/create_rune/proc/Activate  (code/game/gamemodes/cult/rune_spawn_action.dm:22)  may sleep
rt.def("/datum/action/innate/cult/create_rune/proc/Activate", function* Activate(f: Frame) {
	let chosen_keyword: Value = null, R1: Value = null, R2: Value = null, R3: Value = null, R4: Value = null, health: Value = null, L: Value = null, scribe_mod: Value = null, new_rune: Value = null;
	f.vars = () => [chosen_keyword, R1, R2, R3, R4, health, L, scribe_mod, new_rune];
	chosen_keyword = null;
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "owner"))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning>You need more space to scribe a rune!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.initial(f, rt.sv(f, "rune_type"), "req_keyword"))) {
		if (!truthy((chosen_keyword = (yield* g.call(f, P("/proc/stripped_input"), null, [rt.sv(f, "owner"), "Enter a keyword for the new rune.", "Words of Power"]))))) {
			return live(f.dot);
		}
	}
	R1 = (yield* g.new_(f, T("/obj/effect/temp_visual/cult/rune_spawn"), [rt.fv(f, "loc", rt.sv(f, "owner")), rt.sv(f, "scribe_time"), rt.sv(f, "rune_color")]));
	R2 = null;
	if (truthy(rt.sv(f, "rune_word_type"))) {
		R2 = (yield* g.new_(f, rt.sv(f, "rune_word_type"), [rt.fv(f, "loc", rt.sv(f, "owner")), rt.sv(f, "scribe_time"), rt.sv(f, "rune_color")]));
	}
	R3 = null;
	if (truthy(rt.sv(f, "rune_innerring_type"))) {
		R3 = (yield* g.new_(f, rt.sv(f, "rune_innerring_type"), [rt.fv(f, "loc", rt.sv(f, "owner")), rt.sv(f, "scribe_time"), rt.sv(f, "rune_color")]));
	}
	R4 = null;
	if (truthy(rt.sv(f, "rune_center_type"))) {
		R4 = (yield* g.new_(f, rt.sv(f, "rune_center_type"), [rt.fv(f, "loc", rt.sv(f, "owner")), rt.sv(f, "scribe_time"), rt.sv(f, "rune_color")]));
	}
	rt.setSv(f, "cooldown", add(rt.sv(f, "base_cooldown"), rt.worldTime(f)));
	yield* g.callName(f, rt.sv(f, "owner"), "update_action_buttons_icon", []);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "owner"), P("/mob/proc/update_action_buttons_icon")])), rt.sv(f, "base_cooldown")]);
	health = null;
	if ((truthy(rt.sv(f, "damage_interrupt")) && truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living")) ? 1 : 0)))) {
		L = rt.sv(f, "owner");
		health = rt.alist(f, ["health", rt.fv(f, "health", live(L))]);
	}
	scribe_mod = rt.sv(f, "scribe_time");
	if (truthy((rt.istype(rt.getStep(f, rt.sv(f, "owner"), 0), T("/turf/open/floor/engine/cult")) ? 1 : 0))) {
		(scribe_mod = rt.modify(live(scribe_mod), 0.5, multiply));
	}
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "owner"), null, live(scribe_mod), "target", rt.sv(f, "owner"), "extra_checks", (yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "owner"), P("/mob/proc/break_do_after_checks"), live(health), rt.sv(f, "action_interrupt")]))], rt.Args.Named)))) {
		rt.setFv(f, "keyword", (new_rune = (yield* g.new_(f, rt.sv(f, "rune_type"), [rt.fv(f, "loc", rt.sv(f, "owner"))]))), live(chosen_keyword));
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(R1)]);
		if (truthy(live(R2))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(R2)]);
		}
		if (truthy(live(R3))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(R3)]);
		}
		if (truthy(live(R4))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(R4)]);
		}
		rt.setSv(f, "cooldown", 0);
		yield* g.callName(f, rt.sv(f, "owner"), "update_action_buttons_icon", []);
	}
	return f.dot;
}, true);
