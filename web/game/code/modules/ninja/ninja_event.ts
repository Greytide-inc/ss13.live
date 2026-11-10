// Based on /tg/station's code/modules/ninja/ninja_event.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(285, "/datum/round_event/ghost_role/ninja", "/datum/round_event/ghost_role", {
	success_spawn: 0,
	helping_station: null,
	spawn_loc: null,
	give_objectives: 1,
	role_name: "space ninja",
	minimum_required: 1,
});

// ninja_event.dm:29
rt.def("/datum/round_event/ghost_role/ninja/proc/setup", function setup(f: Frame) {
	this.helping_station = rand(0, 1);
	return f.dot;
});

// ninja_event.dm:33
rt.def("/datum/round_event/ghost_role/ninja/proc/kill", function kill(f: Frame) {
	if (!this.success_spawn && this.control) {
		this.control.occurrences--;
	}
	return parent_proc();
});

// ninja_event.dm:40
rt.def("/datum/round_event/ghost_role/ninja/proc/spawn_role", function* spawn_role(f: Frame) {
	let spawn_locs: Value = null, L: Value = null, candidates: Value = null, Mind: Value = null, ninjadatum: Value = null;
	let $e: any;
	if (!this.spawn_loc) {
		spawn_locs = list();
		for (L of each(GLOB.landmarks_list, T("/obj/effect/landmark"))) {
			if (isturf(L.loc)) {
				if (L.name === "ninjaspawn" || L.name === "carpspawn") {
					spawn_locs += L.loc;
				}
			}
		}
		if (!rt.len(f, spawn_locs)) {
			return this.kill();
		}
		this.spawn_loc = pick(spawn_locs);
	}
	if (!this.spawn_loc) {
		return MAP_ERROR;
	}
	if (!rt.len(f, (candidates = (yield* this.get_candidates("ninja", null, "space ninja"))))) {
		return NOT_ENOUGH_PLAYERS;
	}
	let selected_candidate: Value = pick_n_take(candidates);
	let key: Value = selected_candidate.key;
	(Mind = create_ninja_mind(key)).active = 1;
	let Ninja: Value = (yield* create_space_ninja(this.spawn_loc));
	yield* Mind.transfer_to(Ninja);
	yield* (ninjadatum = (yield* add_ninja(Ninja))).equip_space_ninja();
	Ninja.internal = Ninja.s_store;
	Ninja.update_internals_hud_icon(1);
	if (Ninja.mind != Mind) {
		rt.throw_(f, (yield* new_(T("/exception"), "Ninja created with incorrect mind", "code/modules/ninja/ninja_event.dm", 78)));
	}
	GLOB.SSticker.mode.update_ninja_icons_added(Ninja);
	this.spawned_mobs += Ninja;
	message_admins(`${key_name_admin(Ninja)} has been made into a ninja by an event.`);
	log_game(`${key_name(Ninja)} was spawned as a ninja by an event.`);
	return SUCCESSFUL_SPAWN;
}, true);

// ninja_event.dm:92
rt.def("/proc/create_space_ninja", function* create_space_ninja(f: Frame, spawn_loc: Value) {
	let A: Value = null;
	let new_ninja: Value = (yield* new_(T("/mob/living/carbon/human"), spawn_loc));
	(A = (yield* new_(T("/datum/preferences")))).real_name = `${pick(GLOB.ninja_titles)} ${pick(GLOB.ninja_names)}`;
	yield* A.copy_to(new_ninja);
	yield* new_ninja.dna.update_dna_identity();
	return new_ninja;
}, true);

// ninja_event.dm:101
rt.def("/proc/create_ninja_mind", function create_ninja_mind(f: Frame, key: Value) {
	let Mind: Value = null;
	(Mind = new_(T("/datum/mind"), key)).assigned_role = "Space Ninja";
	Mind.special_role = "Space Ninja";
	(rt.modField(f, GLOB.SSticker.mode, "traitors", Mind, rt.bitOr));
	return Mind;
});

// ninja_event.dm:109
rt.def("/datum/game_mode/proc/update_ninja_icons_added", function update_ninja_icons_added(f: Frame, ninja: Value) {
	let ninjahud: Value = null;
	(ninjahud = rt.index(GLOB.huds, ANTAG_HUD_NINJA)).join_hud(ninja);
	this.set_antag_hud(ninja, "ninja");
	return f.dot;
});
