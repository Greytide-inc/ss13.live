// From code/modules/events/sentience.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(283, "/datum/round_event/ghost_role/sentience", "/datum/round_event/ghost_role", {
	animals: 1,
	one: "one",
	minimum_required: 1,
	role_name: "random animal",
});

// /datum/round_event/ghost_role/sentience/proc/start  (code/modules/events/sentience.dm:14)  may sleep
rt.def("/datum/round_event/ghost_role/sentience/proc/start", function* start(f: Frame) {
	let sentience_report: Value = null, data: Value = null, pets: Value = null, strength: Value = null;
	f.vars = () => [sentience_report, data, pets, strength];
	sentience_report = fmt("<font size=3><b>＀ Medium-Priority Update</b></font>", [(yield* g.call(f, P("/proc/command_name"), null, []))]);
	data = rt.op(f, "PickUnweighted", [6], ["scans from our long-range sensors", "our sophisticated probabilistic models", "our omnipotence", "the communications traffic on your station", "energy emissions we detected", "[REDACTED]"]);
	pets = rt.op(f, "PickUnweighted", [6], ["animals/bots", "bots/animals", "pets", "simple animals", "lesser lifeforms", "[REDACTED]"]);
	strength = rt.op(f, "PickUnweighted", [9], ["human", "moderate", "lizard", "security", "command", "clown", "low", "very low", "[REDACTED]"]);
	sentience_report = rt.modify(live(sentience_report), fmt("<br><br>Based on ＀, we believe that ＀ of the station's ＀ has developed ＀ level intelligence, and the ability to communicate.", [live(data), rt.sv(f, "one"), live(pets), live(strength)]), add);
	yield* g.call(f, P("/proc/print_command_report"), null, ["text", live(sentience_report)], rt.Args.Named);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/round_event/ghost_role/sentience/proc/spawn_role  (code/modules/events/sentience.dm:27)  may sleep
rt.def("/datum/round_event/ghost_role/sentience/proc/spawn_role", function* spawn_role(f: Frame) {
	let candidates: Value = null, potential: Value = null, L: Value = null, _T: Value = null, spawned_animals: Value = null, SA: Value = null, SG: Value = null;
	let $e: any;
	f.vars = () => [candidates, potential, L, _T, spawned_animals, SA, SG, $e];
	candidates = null;
	candidates = (yield* g.srcCall(f, "get_candidates", "xenomorph", null, "xenomorph"));
	potential = rt.list();
	L = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/simple_animal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (!isEqual(rt.gv(f, "z", (_T = rt.getStep(f, live(L), 0))), 2)) {
			continue;
		}
		if ((!truthy((rt.isIn(f, live(L), rt.gl("player_list")) ? 1 : 0)) && !truthy(rt.fv(f, "mind", live(L))))) {
			potential = rt.modify(live(potential), live(L), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(potential)))) {
		return 5;
	}
	if (!truthy(rt.len(f, live(candidates)))) {
		return 3;
	}
	spawned_animals = 0;
	while ((rt.lt(live(spawned_animals), rt.sv(f, "animals")) && truthy(rt.len(f, live(candidates)))) && truthy(rt.len(f, live(potential)))) {
		SA = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(potential)]));
		SG = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
		spawned_animals = rt.inc(live(spawned_animals), 1);
		rt.setFv(f, "key", live(SA), rt.fv(f, "key", live(SG)));
		yield* g.callName(f, live(SA), "grant_language", [T("/datum/language/common")]);
		if (!truthy(rt.fv(f, "secondary_flags", live(SA)))) {
			rt.setFv(f, "secondary_flags", live(SA), rt.list());
		}
		rt.setAt(rt.fv(f, "secondary_flags", live(SA)), "omnitongue", 1);
		yield* g.callName(f, live(SA), "sentience_act", []);
		rt.setFv(f, "maxHealth", live(SA), (yield* g.call(f, P("/proc/max"), null, [rt.fv(f, "maxHealth", live(SA)), 200])));
		rt.setFv(f, "health", live(SA), rt.fv(f, "maxHealth", live(SA)));
		rt.setFv(f, "del_on_death", live(SA), 0);
		rt.modSrcVar(f, "spawned_mobs", live(SA), add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(SA), "<span class='userdanger'>Hello world!</span>"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(SA), "<span class='warning'>Due to freak radiation and/or chemicals and/or lucky chance, you have gained human level intelligence and the ability to speak and understand human language!</span>"]);
	}
	return 2;
}, true);
