// Based on /tg/station's code/modules/events/portal_storm.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(315, "/datum/round_event/portal_storm/syndicate_shocktroop", "/datum/round_event/portal_storm", {
	boss_types: null,
	hostile_types: null,
});

// portal_storm.dm:9
rt.def("/datum/round_event/portal_storm/syndicate_shocktroop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_types = rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate/melee/space/stormtrooper"), 2]);

	this.hostile_types = rt.alist(f, [T("/mob/living/simple_animal/hostile/syndicate/melee/space"), 8, T("/mob/living/simple_animal/hostile/syndicate/ranged/space"), 2]);
	return f.dot;
});

rt.type(316, "/datum/round_event/portal_storm/portal_storm_narsie", "/datum/round_event/portal_storm", {
	boss_types: null,
	hostile_types: null,
});

// portal_storm.dm:20
rt.def("/datum/round_event/portal_storm/portal_storm_narsie/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_types = rt.alist(f, [T("/mob/living/simple_animal/hostile/construct/builder"), 6]);

	this.hostile_types = rt.alist(f, [T("/mob/living/simple_animal/hostile/construct/armored/hostile"), 8, T("/mob/living/simple_animal/hostile/construct/wraith/hostile"), 6]);
	return f.dot;
});

rt.type(314, "/datum/round_event/portal_storm", "/datum/round_event", {
	boss_spawn: null,
	boss_types: null,
	number_of_bosses: null,
	next_boss_spawn: null,
	hostiles_spawn: null,
	hostile_types: null,
	number_of_hostiles: null,
	station_areas: null,
	storm: null,
	startWhen: 7,
	endWhen: 999,
	announceWhen: 1,
});

// portal_storm.dm:29
rt.def("/datum/round_event/portal_storm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.boss_spawn = list();

	this.boss_types = list();

	this.hostiles_spawn = list();

	this.hostile_types = list();

	this.station_areas = list();
	return f.dot;
});

// portal_storm.dm:40
rt.def("/datum/round_event/portal_storm/proc/setup", function setup(f: Frame) {
	let boss: Value = null, hostile: Value = null, F: Value = null, _T: Value = null;
	this.storm = (this.storm = mutable_appearance(rt.rsc("icons/obj/tesla_engine/energy_ball.dmi"), "energy_ball_fast", 5));
	this.storm.color = "#00FF00";
	this.station_areas = get_areas_in_z(ZLEVEL_STATION);
	this.number_of_bosses = 0;
	for (boss of each(this.boss_types)) {
		this.number_of_bosses += rt.index(this.boss_types, boss);
	}
	this.number_of_hostiles = 0;
	for (hostile of each(this.hostile_types)) {
		this.number_of_hostiles += rt.index(this.hostile_types, hostile);
	}
	let b_spawns: Value = GLOB.generic_event_spawns.Copy();
	while (this.number_of_bosses > rt.len(f, this.boss_spawn)) {
		if (!(F = rt.getStep(f, pick_n_take(b_spawns), 0))) {
			F = safepick(get_area_turfs(pick(this.station_areas)));
		}
		this.boss_spawn += F;
	}
	let h_spawns: Value = GLOB.generic_event_spawns.Copy();
	while (this.number_of_hostiles > rt.len(f, this.hostiles_spawn)) {
		if (!(_T = rt.getStep(f, pick_n_take(h_spawns), 0))) {
			_T = safepick(get_area_turfs(pick(this.station_areas)));
		}
		this.hostiles_spawn += _T;
	}
	this.next_boss_spawn = this.startWhen + Ceiling(2 * this.number_of_hostiles / this.number_of_bosses);
	return f.dot;
});

// portal_storm.dm:71
rt.def("/datum/round_event/portal_storm/proc/announce", function* announce(f: Frame) {
	yield* playsound_global(rt.rsc("sound/magic/lightning_chargeup.ogg"), { repeat: 0, channel: 1, volume: 100 });
	yield* sleep(80);
	yield* priority_announce(`Massive bluespace anomaly detected en route to ${station_name()}. Brace for impact.`);
	yield* sleep(20);
	yield* playsound_global(rt.rsc("sound/magic/lightningbolt.ogg"), { repeat: 0, channel: 1, volume: 100 });
	return f.dot;
}, true, { waitfor: false });

// portal_storm.dm:78
rt.def("/datum/round_event/portal_storm/proc/tick", function* tick(f: Frame) {
	let type: Value = null;
	this.spawn_effects();
	if (this.spawn_hostile()) {
		type = safepick(this.hostile_types);
		rt.setAt(this.hostile_types, type, rt.index(this.hostile_types, type) - 1);
		yield* this.spawn_mob(type, this.hostiles_spawn);
		if (!rt.index(this.hostile_types, type)) {
			this.hostile_types -= type;
		}
	}
	if (this.spawn_boss()) {
		type = safepick(this.boss_types);
		rt.setAt(this.boss_types, type, rt.index(this.boss_types, type) - 1);
		yield* this.spawn_mob(type, this.boss_spawn);
		if (!rt.index(this.boss_types, type)) {
			this.boss_types -= type;
		}
	}
	this.time_to_end();
	return f.dot;
}, true);

// portal_storm.dm:97
rt.def("/datum/round_event/portal_storm/proc/spawn_mob", function* spawn_mob(f: Frame, type: Value, spawn_list: Value) {
	let _T: Value = null;
	if (!type) {
		return f.dot;
	}
	if (!(_T = pick_n_take(spawn_list))) {
		return f.dot;
	}
	yield* new_(type, _T);
	this.spawn_effects(_T);
	return f.dot;
}, true);

// portal_storm.dm:107
rt.def("/datum/round_event/portal_storm/proc/spawn_effects", function spawn_effects(f: Frame, _T: Value) {
	let V: Value = null, A: Value = null, F: Value = null;
	if (_T) {
		_T = rt.getStep(f, _T, 10);
		flick_overlay_static(this.storm, _T, 15);
		playsound(_T, rt.rsc("sound/magic/lightningbolt.ogg"), 100, 1);
	} else {
		for (V of each(this.station_areas)) {
			A = V;
			F = rt.getStep(f, pick(A.contents), 0);
			flick_overlay_static(this.storm, F, 15);
			playsound(F, rt.rsc("sound/magic/lightningbolt.ogg"), 80, 1);
		}
	}
	return f.dot;
});

// portal_storm.dm:118
rt.def("/datum/round_event/portal_storm/proc/spawn_hostile", function spawn_hostile(f: Frame) {
	if (!this.hostile_types || !rt.len(f, this.hostile_types)) {
		return 0;
	}
	return IsMultiple(this.activeFor, 2);
});

// portal_storm.dm:123
rt.def("/datum/round_event/portal_storm/proc/spawn_boss", function spawn_boss(f: Frame) {
	if (!this.boss_types || !rt.len(f, this.boss_types)) {
		return 0;
	}
	if (this.activeFor != this.next_boss_spawn) return f.dot;
	this.next_boss_spawn += Ceiling(this.number_of_hostiles / this.number_of_bosses);
	return 1;
});

// portal_storm.dm:131
rt.def("/datum/round_event/portal_storm/proc/time_to_end", function time_to_end(f: Frame) {
	if (!rt.len(f, this.hostile_types) && !rt.len(f, this.boss_types)) {
		this.endWhen = this.activeFor;
	}
	if (!(!this.number_of_hostiles && this.number_of_bosses)) return f.dot;
	this.endWhen = this.activeFor;
	return f.dot;
});
