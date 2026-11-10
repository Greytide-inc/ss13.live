// Based on /tg/station's code/modules/events/alien_infestation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(279, "/datum/round_event/ghost_role/alien_infestation", "/datum/round_event/ghost_role", {
	spawncount: 1,
	successSpawn: 0,
	announceWhen: 400,
	minimum_required: 1,
	role_name: "alien larva",
});

// alien_infestation.dm:21
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/setup", function setup(f: Frame) {
	this.announceWhen = rand(this.announceWhen, this.announceWhen + 50);
	if (!prob(50)) return f.dot;
	this.spawncount++;
	return f.dot;
});

// alien_infestation.dm:26
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/kill", function kill(f: Frame) {
	if (!this.successSpawn && this.control) {
		this.control.occurrences--;
	}
	return parent_proc();
});

// alien_infestation.dm:34
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/announce", function* announce(f: Frame) {
	if (!this.successSpawn) return f.dot;
	yield* priority_announce(`Unidentified lifesigns detected coming aboard ${station_name()}. Secure any exterior access, including ducting and ventilation.`, "Lifesign Alert", rt.rsc("sound/ai/aliens.ogg"));
	return f.dot;
}, true);

// alien_infestation.dm:38
rt.def("/datum/round_event/ghost_role/alien_infestation/proc/spawn_role", function* spawn_role(f: Frame) {
	let temp_vent: Value = null, temp_vent_parent: Value = null, candidates: Value = null, vent: Value = null, C: Value = null, new_xeno: Value = null;
	let vents: Value = list();
	for (temp_vent of each(GLOB.machines, T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		if (!temp_vent || temp_vent.gc_destroyed) {
			continue;
		}
		if (temp_vent.loc.z == ZLEVEL_STATION && !temp_vent.welded) {
			if (rt.len(f, (temp_vent_parent = rt.index(temp_vent.parents, 1)).other_atmosmch) > 20) {
				vents += temp_vent;
			}
		}
	}
	if (!rt.len(f, vents)) {
		message_admins("An event attempted to spawn an alien but no suitable vents were found. Shutting down.");
		return MAP_ERROR;
	}
	if (!rt.len(f, (candidates = (yield* this.get_candidates("alien", null, "xenomorph"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	while (this.spawncount > 0 && rt.len(f, vents) && rt.len(f, candidates)) {
		vent = pick_n_take(vents);
		C = pick_n_take(candidates);
		(new_xeno = (yield* new_(T("/mob/living/carbon/alien/larva"), vent.loc))).key = C.key;
		this.spawncount--;
		this.successSpawn = 1;
		message_admins(`${key_name_admin(new_xeno)} has been made into an alien by an event.`);
		log_game(`${key_name(new_xeno)} was spawned as an alien by an event.`);
		this.spawned_mobs += new_xeno;
	}
	if (this.successSpawn) {
		return SUCCESSFUL_SPAWN;
	} else {
		return 0;
	}
}, true);
