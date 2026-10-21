// From code/modules/events/alien_infestation.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(279, "/datum/round_event/ghost_role/alien_infestation", "/datum/round_event/ghost_role", {
	spawncount: 1,
	successSpawn: 0,
	announceWhen: 400,
	minimum_required: 1,
	role_name: "alien larva",
});

// /datum/round_event/ghost_role/alien_infestation/proc/setup  (code/modules/events/alien_infestation.dm:21)
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "announceWhen", rt.call(f, P("/proc/rand"), null, [rt.sv(f, "announceWhen"), add(rt.sv(f, "announceWhen"), 50)]));
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	rt.incSrcVar(f, "spawncount", 1, true);
	return f.dot;
});

// /datum/round_event/ghost_role/alien_infestation/proc/kill  (code/modules/events/alien_infestation.dm:26)
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/kill", function kill(f: Frame) {
	if ((!truthy(rt.sv(f, "successSpawn")) && truthy(rt.sv(f, "control")))) {
		rt.incField(f, rt.sv(f, "control"), "occurrences", -1, true);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /datum/round_event/ghost_role/alien_infestation/proc/announce  (code/modules/events/alien_infestation.dm:34)  may sleep
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/announce", function* announce(f: Frame) {
	if (!truthy(rt.sv(f, "successSpawn"))) return f.dot;
	yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Unidentified lifesigns detected coming aboard ＀. Secure any exterior access, including ducting and ventilation.", [(yield* g.call(f, P("/proc/station_name"), null, []))]), "Lifesign Alert", rt.rsc("sound/ai/aliens.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/ghost_role/alien_infestation/proc/spawn_role  (code/modules/events/alien_infestation.dm:38)  may sleep
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/spawn_role", function* spawn_role(f: Frame) {
	let vents: Value = null, temp_vent: Value = null, temp_vent_parent: Value = null, candidates: Value = null, vent: Value = null, C: Value = null, new_xeno: Value = null;
	let $e: any;
	f.vars = () => [vents, temp_vent, temp_vent_parent, candidates, vent, C, new_xeno, $e];
	vents = rt.list();
	temp_vent = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/atmospherics/components/unary/vent_pump"));
	while (($e = rt.next(f, 0)) !== undefined) {
		temp_vent = $e;
		if ((!truthy(live(temp_vent)) || truthy(rt.fv(f, "gc_destroyed", live(temp_vent))))) {
			continue;
		}
		if ((isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(temp_vent))), 2) && !truthy(rt.fv(f, "welded", live(temp_vent))))) {
			if (rt.gt(rt.getLen(f, rt.gv(f, "other_atmosmch", (temp_vent_parent = rt.index(rt.fv(f, "parents", live(temp_vent)), 1)))), 20)) {
				vents = rt.modify(live(vents), live(temp_vent), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(vents)))) {
		yield* g.call(f, P("/proc/message_admins"), null, ["An event attempted to spawn an alien but no suitable vents were found. Shutting down."]);
		return 4;
	}
	if (!truthy(rt.getLen(f, (candidates = (yield* g.srcCall(f, "get_candidates", "alien", null, "xenomorph")))))) {
		return 3;
	}
	while ((rt.gt(rt.sv(f, "spawncount"), 0) && truthy(rt.len(f, live(vents)))) && truthy(rt.len(f, live(candidates)))) {
		vent = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(vents)]));
		C = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
		rt.setFv(f, "key", (new_xeno = (yield* g.new_(f, T("/mob/living/carbon/alien/larva"), [rt.fv(f, "loc", live(vent))]))), rt.fv(f, "key", live(C)));
		rt.incSrcVar(f, "spawncount", -1, true);
		rt.setSv(f, "successSpawn", 1);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has been made into an alien by an event.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(new_xeno)]))])]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ was spawned as an alien by an event.", [(yield* g.call(f, P("/proc/key_name"), null, [live(new_xeno)]))])]);
		rt.modSrcVar(f, "spawned_mobs", live(new_xeno), add);
	}
	if (truthy(rt.sv(f, "successSpawn"))) {
		return 2;
	} else {
		return 0;
	}
	return f.dot;
}, true);
