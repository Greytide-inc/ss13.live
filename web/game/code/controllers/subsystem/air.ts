// Based on /tg/station's code/controllers/subsystem/air.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(13, "/datum/controller/subsystem/air", "/datum/controller/subsystem", {
	cost_turfs: 0,
	cost_groups: 0,
	cost_highpressure: 0,
	cost_hotspots: 0,
	cost_superconductivity: 0,
	cost_pipenets: 0,
	cost_atmos_machinery: 0,
	excited_groups: null,
	active_turfs: null,
	hotspots: null,
	networks: null,
	atmos_machinery: null,
	active_super_conductivity: null,
	high_pressure_delta: null,
	currentrun: null,
	currentpart: 1,
	map_loading: 1,
	queued_for_activation: null,
	gas_reactions: null,
	name: "Atmospherics",
	init_order: -1,
	priority: 20,
	wait: 5,
	flags: 4,
	runlevels: 12,
});

// air.dm:9
rt.def("/datum/controller/subsystem/air/proc/New", function* New(f: Frame) {
	if (GLOB.SSair != this) {
		if (rt.istype(GLOB.SSair, T("/datum/controller/subsystem/air"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSair);
		}
		GLOB.SSair = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// air.dm:25
rt.def("/datum/controller/subsystem/air/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.excited_groups = list();

	this.active_turfs = list();

	this.hotspots = list();

	this.networks = list();

	this.atmos_machinery = list();

	this.active_super_conductivity = list();

	this.high_pressure_delta = list();

	this.currentrun = list();
	return f.dot;
});

// air.dm:45
rt.def("/datum/controller/subsystem/air/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	let $0: any;
	msg += "C:{";
	msg += `AT:${round(this.cost_turfs, 1)}|`;
	msg += `EG:${round(this.cost_groups, 1)}|`;
	msg += `HP:${round(this.cost_highpressure, 1)}|`;
	msg += `HS:${round(this.cost_hotspots, 1)}|`;
	msg += `SC:${round(this.cost_superconductivity, 1)}|`;
	msg += `PN:${round(this.cost_pipenets, 1)}|`;
	msg += `AM:${round(this.cost_atmos_machinery, 1)}`;
	msg += "} ";
	msg += `AT:${rt.len(f, this.active_turfs)}|`;
	msg += `EG:${rt.len(f, this.excited_groups)}|`;
	msg += `HS:${rt.len(f, this.hotspots)}|`;
	msg += `PN:${rt.len(f, this.networks)}|`;
	msg += `HP:${rt.len(f, this.high_pressure_delta)}|`;
	msg += `AS:${rt.len(f, this.active_super_conductivity)}|`;
	if (this.cost) {
		$0 = rt.len(f, this.active_turfs) / this.cost;
	} else {
		$0 = 0;
	}
	yield* parent_proc((msg += `AT/MS:${round($0, 0.1)}`));
	return f.dot;
}, true);

// air.dm:66
rt.def("/datum/controller/subsystem/air/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	this.map_loading = 0;
	yield* this.setup_allturfs();
	yield* this.setup_atmos_machinery();
	yield* this.setup_pipenets();
	this.gas_reactions = (yield* init_gas_reactions());
	yield* parent_proc();
	return f.dot;
}, true);

// air.dm:76
rt.def("/datum/controller/subsystem/air/proc/fire", function* fire(f: Frame, resumed: Value) {
	resumed ??= 0;
	// stress2c: no pipe may be without its pipeline when the pipenets and atmos machines run (a singularity pass that slept
	// somewhere unexpected with its rebuilds still waiting)
	if (GLOB.pipe_rebuild_defer !== null) rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	if (!resumed && rt.call(f, P("/proc/stress_counts_on"), null, [])) {
		let moles = 0, nopipes = 0, members = 0, machines = 0, net: Value = null, $e: any;
		for (net of each(this.networks)) {
			if (net.air) moles += Number(rt.callName(f, net.air, "total_moles", []));
			const m = Number(rt.len(f, net.members));
			members += m; if (!m) nopipes++;
			machines += Number(rt.len(f, net.other_atmosmch));
		}
		rt.call(f, P("/proc/stress_set"), null, ["pipelines_without_pipes", nopipes]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_pipes", members]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_machines", machines]);
		rt.call(f, P("/proc/stress_set"), null, ["pipelines", rt.len(f, this.networks)]);
		rt.call(f, P("/proc/stress_set"), null, ["pipeline_moles", moles]);
	}
	let timer: Value = rt.tickUsage(f);
	if (this.currentpart == 1 || !resumed) {
		this.process_pipenets(resumed);
		this.cost_pipenets = 0.8 * this.cost_pipenets + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 2;
	}
	if (this.currentpart == 2) {
		timer = rt.tickUsage(f);
		yield* this.process_atmos_machinery(resumed);
		this.cost_atmos_machinery = 0.8 * this.cost_atmos_machinery + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 3;
	}
	if (this.currentpart == 3) {
		timer = rt.tickUsage(f);
		yield* this.process_active_turfs(resumed);
		this.cost_turfs = 0.8 * this.cost_turfs + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 4;
	}
	if (this.currentpart == 4) {
		timer = rt.tickUsage(f);
		yield* this.process_excited_groups(resumed);
		this.cost_groups = 0.8 * this.cost_groups + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 5;
	}
	if (this.currentpart == 5) {
		timer = rt.tickUsage(f);
		this.process_high_pressure_delta(resumed);
		this.cost_highpressure = 0.8 * this.cost_highpressure + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 6;
	}
	if (this.currentpart == 6) {
		timer = rt.tickUsage(f);
		this.process_hotspots(resumed);
		this.cost_hotspots = 0.8 * this.cost_hotspots + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
		this.currentpart = 7;
	}
	if (this.currentpart == 7) {
		timer = rt.tickUsage(f);
		yield* this.process_super_conductivity(resumed);
		this.cost_superconductivity = 0.8 * this.cost_superconductivity + 0.2 * ((rt.tickUsage(f) - timer) * rt.world().tick_lag);
		if (this.state != 2) {
			return f.dot;
		}
		resumed = 0;
	}
	this.currentpart = 1;
	return f.dot;
}, true);

// air.dm:141
rt.def("/datum/controller/subsystem/air/proc/process_pipenets", function process_pipenets(f: Frame, resumed: Value) {
	let thing: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = this.networks.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		thing = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (thing) {
			thing.process();
		} else {
			this.networks.Remove(thing);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// air.dm:157
rt.def("/datum/controller/subsystem/air/proc/process_atmos_machinery", function* process_atmos_machinery(f: Frame, resumed: Value) {
	let M: Value = null;
	resumed ??= 0;
	let seconds: Value = this.wait * 0.1;
	if (!resumed) {
		this.currentrun = (yield* this.atmos_machinery.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		M = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (!M || (yield* M.process_atmos(seconds)) == PROCESS_KILL) {
			yield* this.atmos_machinery.Remove(M);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// air.dm:172
rt.def("/datum/controller/subsystem/air/proc/process_super_conductivity", function* process_super_conductivity(f: Frame, resumed: Value) {
	let _T: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.active_super_conductivity.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		_T = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		yield* _T.super_conduct();
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// air.dm:184
rt.def("/datum/controller/subsystem/air/proc/process_hotspots", function process_hotspots(f: Frame, resumed: Value) {
	let H: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = this.hotspots.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		H = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (H) {
			H.process();
		} else {
			this.hotspots -= H;
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// air.dm:200
rt.def("/datum/controller/subsystem/air/proc/process_high_pressure_delta", function process_high_pressure_delta(f: Frame, resumed: Value) {
	let _T: Value = null;
	resumed ??= 0;
	while (rt.len(f, this.high_pressure_delta)) {
		_T = rt.index(this.high_pressure_delta, rt.len(f, this.high_pressure_delta));
		this.high_pressure_delta.len--;
		_T.high_pressure_movements();
		_T.pressure_difference = 0;
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// air.dm:210
rt.def("/datum/controller/subsystem/air/proc/process_active_turfs", function* process_active_turfs(f: Frame, resumed: Value) {
	let _T: Value = null;
	resumed ??= 0;
	let fire_count: Value = this.times_fired;
	if (!resumed) {
		this.currentrun = (yield* this.active_turfs.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		_T = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (_T) {
			yield* _T.process_cell(fire_count);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// air.dm:224
rt.def("/datum/controller/subsystem/air/proc/process_excited_groups", function* process_excited_groups(f: Frame, resumed: Value) {
	let EG: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* this.excited_groups.Copy());
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		EG = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		EG.breakdown_cooldown++;
		EG.dismantle_cooldown++;
		if (EG.breakdown_cooldown >= 4) {
			yield* EG.self_breakdown();
		} else if (EG.dismantle_cooldown >= 16) {
			yield* EG.dismantle();
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// air.dm:242
rt.def("/datum/controller/subsystem/air/proc/remove_from_active", function remove_from_active(f: Frame, _T: Value) {
	this.active_turfs -= _T;
	if (this.currentpart == SSAIR_ACTIVETURFS) {
		this.currentrun -= _T;
	}
	if (!rt.istype(_T, T("/turf/open"))) return f.dot;
	_T.excited = 0;
	if (!_T.excited_group) return f.dot;
	_T.excited_group.garbage_collect();
	return f.dot;
});

// air.dm:254
rt.def("/datum/controller/subsystem/air/proc/add_to_active", function add_to_active(f: Frame, _T: Value, blockchanges: Value) {
	let S: Value = null;
	blockchanges ??= 1;
	if (rt.istype(_T, T("/turf/open")) && _T.air) {
		_T.excited = 1;
		(rt.modSrcVar(f, "active_turfs", _T, rt.bitOr));
		if (this.currentpart == SSAIR_ACTIVETURFS) {
			(rt.modSrcVar(f, "currentrun", _T, rt.bitOr));
		}
		if (blockchanges && _T.excited_group) {
			_T.excited_group.garbage_collect();
		}
	} else if (_T.initialized) {
		for (S of each(_T.atmos_adjacent_turfs, T("/turf"))) {
			this.add_to_active(S);
		}
	} else if (this.map_loading) {
		if (this.queued_for_activation) {
			rt.setAt(this.queued_for_activation, _T, _T);
		}
		return f.dot;
	} else {
		_T.requires_activation = 1;
	}
	return f.dot;
});

// air.dm:275
rt.def("/datum/controller/subsystem/air/proc/StartLoadingMap", function StartLoadingMap(f: Frame) {
	if (!this.queued_for_activation) {
		this.queued_for_activation = list();
	}
	this.map_loading = 1;
	return f.dot;
});

// air.dm:280
rt.def("/datum/controller/subsystem/air/proc/StopLoadingMap", function StopLoadingMap(f: Frame) {
	let _T: Value = null;
	this.map_loading = 0;
	for (_T of each(this.queued_for_activation)) {
		this.add_to_active(_T);
	}
	this.queued_for_activation.Cut();
	return f.dot;
});

// air.dm:285
rt.def("/datum/controller/subsystem/air/proc/setup_allturfs", function* setup_allturfs(f: Frame) {
	let thing: Value = null, _T: Value = null, _T_5: Value = null, new_turfs_to_check: Value = null, _T_7: Value = null, thing_7: Value = null, EG: Value = null;
	let turfs_to_init: Value = block(rt.locate(1, 1, 1), rt.locate(rt.world().maxx, rt.world().maxy, rt.world().maxz));
	let active_turfs: Value = this.active_turfs;
	let times_fired: Value = rt.incField(f, this, "times_fired", 1, false);
	for (thing of each(turfs_to_init)) {
		active_turfs -= (_T = thing);
		if (_T.blocks_air) {
			continue;
		}
		_T.Initalize_Atmos(times_fired);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	if (!rt.len(f, active_turfs)) return f.dot;
	let starting_ats: Value = rt.len(f, active_turfs);
	yield* sleep(rt.world().tick_lag);
	let timer: Value = rt.world().timeofday;
	warning(`There are ${starting_ats} active turfs at roundstart, this is a mapping error caused by a difference of the air between the adjacent turfs. You can see its coordinates using "Mapping -> Show roundstart AT list" verb (debug verbs required)`);
	for (_T_5 of each(active_turfs, T("/turf"))) {
		GLOB.active_turfs_startlist += _T_5;
	}
	let turfs_to_check: Value = (yield* active_turfs.Copy());
	while (true) {
		new_turfs_to_check = list();
		_T_7 = null;
		for (_T_7 of each(turfs_to_check, T("/turf/open"))) {
			new_turfs_to_check += _T_7.resolve_active_graph();
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
		active_turfs += new_turfs_to_check;
		if (!rt.len(f, (turfs_to_check = new_turfs_to_check))) break;
	}
	let ending_ats: Value = rt.len(f, active_turfs);
	for (thing_7 of each(this.excited_groups)) {
		yield* (EG = thing_7).self_breakdown({ space_is_all_consuming: 1 });
		yield* EG.dismantle();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	let msg: Value = `HEY! LISTEN! ${(rt.world().timeofday - timer) / 10} Seconds were wasted processing ${starting_ats} turf(s) (connected to ${ending_ats} other turfs) with atmos differences at round start.`;
	to_chat(rt.world(), `<span class='boldannounce'>${msg}</span>`);
	warning(msg);
	return f.dot;
}, true);

// air.dm:329
rt.def("/turf/open/proc/resolve_active_graph", function resolve_active_graph(f: Frame) {
	let ET: Value = null, ET_EG: Value = null;
	f.dot = list();
	let EG: Value = this.excited_group;
	if (this.blocks_air || !this.air) {
		return f.dot;
	}
	if (!EG) {
		(EG = new_(T("/datum/excited_group"))).add_turf(this);
	}
	for (ET of each(this.atmos_adjacent_turfs, T("/turf/open"))) {
		if (ET.blocks_air || !ET.air) {
			continue;
		}
		if (ET_EG = ET.excited_group) {
			if (ET_EG != EG) {
				EG.merge_groups(ET_EG);
				EG = this.excited_group;
			}
		} else {
			EG.add_turf(ET);
		}
		if (!ET.excited) {
			ET.excited = 1;
			f.dot += ET;
		}
	}
	return f.dot;
});

// air.dm:352
rt.def("/turf/open/space/proc/resolve_active_graph", function resolve_active_graph(f: Frame) {
	return list();
});

// air.dm:355
rt.def("/datum/controller/subsystem/air/proc/setup_atmos_machinery", function* setup_atmos_machinery(f: Frame) {
	let AM: Value = null;
	for (AM of each(this.atmos_machinery, T("/obj/machinery/atmospherics"))) {
		yield* AM.atmosinit();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// air.dm:363
rt.def("/datum/controller/subsystem/air/proc/setup_pipenets", function* setup_pipenets(f: Frame) {
	let AM: Value = null;
	for (AM of each(this.atmos_machinery, T("/obj/machinery/atmospherics"))) {
		AM.build_network();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// air.dm:368
rt.def("/datum/controller/subsystem/air/proc/setup_template_machinery", function* setup_template_machinery(f: Frame, atmos_machines: Value) {
	let A: Value = null, AM: Value = null;
	for (A of each(atmos_machines)) {
		yield* (AM = A).atmosinit();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	A = null;
	for (A of each(atmos_machines)) {
		(AM = A).build_network();
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);
