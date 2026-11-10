// Based on /tg/station's code/controllers/subsystem/mapping.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add } = rt;


rt.type(28, "/datum/controller/subsystem/mapping", "/datum/controller/subsystem", {
	nuke_tiles: null,
	nuke_threats: null,
	config: null,
	next_map_config: null,
	map_templates: null,
	ruins_templates: null,
	space_ruins_templates: null,
	lava_ruins_templates: null,
	shuttle_templates: null,
	shelter_templates: null,
	loading_ruins: 0,
	name: "Mapping",
	init_order: 12,
	flags: 2,
});

// mapping.dm:1
rt.def("/datum/controller/subsystem/mapping/proc/New", function* New(f: Frame) {
	if (GLOB.SSmapping != this) {
		if (rt.istype(GLOB.SSmapping, T("/datum/controller/subsystem/mapping"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSmapping);
		}
		GLOB.SSmapping = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// mapping.dm:6
rt.def("/datum/controller/subsystem/mapping/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.nuke_tiles = list();

	this.nuke_threats = list();

	this.map_templates = list();

	this.ruins_templates = list();

	this.space_ruins_templates = list();

	this.lava_ruins_templates = list();

	this.shuttle_templates = list();

	this.shelter_templates = list();
	return f.dot;
});

// mapping.dm:24
rt.def("/datum/controller/subsystem/mapping/proc/PreInit", function PreInit(f: Frame) {
	if (!this.config) {
		this.config = new_(T("/datum/map_config"));
	}
	return parent_proc();
});

// mapping.dm:34
rt.def("/datum/controller/subsystem/mapping/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	let mining_type: Value = null, i: Value = null;
	let $e: any;
	if (this.config.defaulted) {
		to_chat(rt.world(), "<span class='boldannounce'>Unable to load next map config, defaulting to Box Station</span>");
	}
	yield* this.loadWorld();
	yield* repopulate_sorted_areas();
	yield* process_teleport_locs();
	yield* this.preloadTemplates();
	yield* createRandomZlevel();
	this.loading_ruins = 1;
	if ((mining_type = this.config.minetype) == "lavaland") {
		yield* seedRuins(list(ZLEVEL_LAVALAND), GLOB.config.lavaland_budget, T("/area/lavaland/surface/outdoors/unexplored"), this.lava_ruins_templates);
		yield* spawn_rivers();
	}
	let space_zlevels: Value = list();
	rt.forRange(f, 0, ZLEVEL_SPACEMIN, ZLEVEL_SPACEMAX, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (i === ZLEVEL_MINING || i === ZLEVEL_LAVALAND || i === ZLEVEL_EMPTY_SPACE || i === ZLEVEL_TRANSIT) {
			continue;
		} else {
			space_zlevels += i;
		}
	}
	rt.endFor(f, 0);
	yield* seedRuins(space_zlevels, GLOB.config.space_budget, T("/area/space"), this.space_ruins_templates);
	this.loading_ruins = 0;
	yield* repopulate_sorted_areas();
	yield* setup_map_transitions();
	yield* parent_proc();
	return f.dot;
}, true);

// mapping.dm:71
rt.def("/datum/controller/subsystem/mapping/proc/add_nuke_threat", function add_nuke_threat(f: Frame, nuke: Value) {
	rt.setAt(this.nuke_threats, nuke, 1);
	this.check_nuke_threats();
	return f.dot;
});

// mapping.dm:74
rt.def("/datum/controller/subsystem/mapping/proc/remove_nuke_threat", function remove_nuke_threat(f: Frame, nuke: Value) {
	this.nuke_threats -= nuke;
	this.check_nuke_threats();
	return f.dot;
});

// mapping.dm:78
rt.def("/datum/controller/subsystem/mapping/proc/check_nuke_threats", function check_nuke_threats(f: Frame) {
	let d: Value = null, N: Value = null, C: Value = null;
	for (d of each(this.nuke_threats, T("/datum"))) {
		if (!rt.istype(d, T("/datum")) || !d || d.gc_destroyed) {
			this.nuke_threats -= d;
		}
	}
	for (N of each(this.nuke_tiles)) {
		(C = N).update_icon();
	}
	return f.dot;
});

// mapping.dm:87
rt.def("/datum/controller/subsystem/mapping/proc/Recover", function Recover(f: Frame) {
	(rt.modSrcVar(f, "flags", SS_NO_INIT, rt.bitOr));
	this.map_templates = GLOB.SSmapping.map_templates;
	this.ruins_templates = GLOB.SSmapping.ruins_templates;
	this.space_ruins_templates = GLOB.SSmapping.space_ruins_templates;
	this.lava_ruins_templates = GLOB.SSmapping.lava_ruins_templates;
	this.shuttle_templates = GLOB.SSmapping.shuttle_templates;
	this.shelter_templates = GLOB.SSmapping.shelter_templates;
	this.config = GLOB.SSmapping.config;
	this.next_map_config = GLOB.SSmapping.next_map_config;
	return f.dot;
});

// mapping.dm:100
rt.def("/datum/controller/subsystem/mapping/proc/TryLoadZ", function* TryLoadZ(f: Frame, filename: Value, errorList: Value, forceLevel: Value, last: Value) {
	if (!GLOB.loader) {
		GLOB.loader = (yield* new_(T("/dmm_suite")));
	}
	if (!(yield* GLOB.loader.load_map(file(filename), 0, 0, forceLevel, { no_changeturf: 1 }))) {
		(errorList = rt.modify(errorList, filename, rt.bitOr));
	}
	if (!last) return f.dot;
	yield* qdel(GLOB.loader);
	GLOB.loader = null;
	return f.dot;
}, true);

// mapping.dm:108
rt.def("/datum/controller/subsystem/mapping/proc/CreateSpace", function* CreateSpace(f: Frame, MaxZLevel: Value) {
	while (rt.world().maxz < MaxZLevel) {
		++rt.world().maxz;
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// mapping.dm:115
rt.def("/datum/controller/subsystem/mapping/proc/loadWorld", function* loadWorld(f: Frame) {
	let I: Value = null;
	let $2: any, $3: any, $e: any;
	let FailedZs: Value = list();
	let $0: any = rt.world().timeofday;
	let $1: any = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	let start_time: Value = $0 + $1 * $2;
	to_chat(rt.world(), `<span class='boldannounce'>${`Loading ${this.config.map_name}...`}</span>`);
	log_world(`Loading ${this.config.map_name}...`);
	yield* this.TryLoadZ(this.config.GetFullMapPath(), FailedZs, 2);
	$0 = rt.world();
	$1 = rt.world().timeofday;
	$2 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$3 = update_midnight_rollover();
	} else {
		$3 = GLOB.midnight_rollovers;
	}
	to_chat($0, `<span class='boldannounce'>${`Loaded station in ${($1 + $2 * $3 - start_time) / 10}s!`}</span>`);
	$0 = rt.world().timeofday;
	$1 = 864000;
	if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
		$2 = update_midnight_rollover();
	} else {
		$2 = GLOB.midnight_rollovers;
	}
	log_world(`Loaded station in ${($0 + $1 * $2 - start_time) / 10}s!`);
	if (this.config.minetype != "lavaland") {
		to_chat(rt.world(), `<span class='boldannounce'>${"WARNING: A map without lavaland set as it's minetype was loaded! This is being ignored! Update the maploader code!"}</span>`);
		log_world("WARNING: A map without lavaland set as it's minetype was loaded! This is being ignored! Update the maploader code!");
	}
	yield* this.CreateSpace(12);
	if (!rt.length(FailedZs)) return f.dot;
	let msg: Value = `RED ALERT! The following map files failed to load: ${rt.index(FailedZs, 1)}`;
	if (rt.len(f, FailedZs) > 1) {
		rt.forRange(f, 0, 2, rt.len(f, FailedZs), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			msg += `, ${rt.index(FailedZs, I)}`;
		}
		rt.endFor(f, 0);
	}
	msg += ". Yell at your server host!";
	to_chat(rt.world(), `<span class='boldannounce'>${msg}</span>`);
	log_world(msg);
	return f.dot;
}, true);

// mapping.dm:142
rt.def("/datum/controller/subsystem/mapping/proc/maprotate", function maprotate(f: Frame) {
	let c: Value = null, vote: Value = null, M: Value = null, map: Value = null, VM: Value = null, pickedmap: Value = null;
	let players: Value = rt.len(f, GLOB.clients);
	let mapvotes: Value = list();
	if (GLOB.config.allow_map_voting) {
		for (c of each(GLOB.clients, T("/client"))) {
			if (!(vote = c.prefs.preferred_map)) {
				if (GLOB.config.defaultmap) {
					rt.modAt(mapvotes, GLOB.config.defaultmap.map_name, 1, add);
				}
				continue;
			}
			rt.modAt(mapvotes, vote, 1, add);
		}
	} else {
		for (M of each(GLOB.config.maplist)) {
			rt.setAt(mapvotes, M, 1);
		}
	}
	for (map of each(mapvotes)) {
		if (!map) {
			mapvotes.Remove(map);
		}
		if (!rt.isIn(f, map, GLOB.config.maplist)) {
			mapvotes.Remove(map);
			continue;
		}
		if (!(VM = rt.index(GLOB.config.maplist, map))) {
			mapvotes.Remove(map);
			continue;
		}
		if (VM.voteweight <= 0) {
			mapvotes.Remove(map);
			continue;
		}
		if (VM.config_min_users > 0 && players < VM.config_min_users) {
			mapvotes.Remove(map);
			continue;
		}
		if (VM.config_max_users > 0 && players > VM.config_max_users) {
			mapvotes.Remove(map);
			continue;
		}
		if (GLOB.config.allow_map_voting) {
			rt.setAt(mapvotes, map, rt.index(mapvotes, map) * VM.voteweight);
		}
	}
	if (!(pickedmap = pickweight(mapvotes))) {
		return f.dot;
	}
	message_admins(`Randomly rotating map to ${(VM = rt.index(GLOB.config.maplist, pickedmap)).map_name}`);
	f.dot = this.changemap(VM);
	if (!(f.dot && VM.map_name != this.config.map_name)) return f.dot;
	to_chat(rt.world(), `<span class='boldannounce'>Map rotation has chosen ${VM.map_name} for next round!</span>`);
	return f.dot;
});

// mapping.dm:190
rt.def("/datum/controller/subsystem/mapping/proc/changemap", function changemap(f: Frame, VM: Value) {
	if (!VM.MakeNextMap()) {
		this.next_map_config = new_(T("/datum/map_config"), { default_to_box: 1 });
		message_admins(`Failed to set new map with next_map.json for ${VM.map_name}! Using default as backup!`);
		return f.dot;
	}
	this.next_map_config = VM;
	return 1;
});

// mapping.dm:199
rt.def("/datum/controller/subsystem/mapping/proc/preloadTemplates", function* preloadTemplates(f: Frame, path: Value) {
	let map: Value = null, _T: Value = null;
	path ??= "_maps/templates/";
	let filelist: Value = flist(path);
	for (map of each(filelist)) {
		_T = (yield* new_(T("/datum/map_template"), { path: `${path}${map}`, rename: `${map}` }));
		rt.setAt(this.map_templates, _T.name, _T);
	}
	yield* this.preloadRuinTemplates();
	yield* this.preloadShuttleTemplates();
	yield* this.preloadShelterTemplates();
	return f.dot;
}, true);

// mapping.dm:210
rt.def("/datum/controller/subsystem/mapping/proc/preloadRuinTemplates", function* preloadRuinTemplates(f: Frame) {
	let item: Value = null, ruin_type: Value = null, R: Value = null;
	let banned: Value = generateMapList("config/lavaruinblacklist.txt");
	banned += generateMapList("config/spaceruinblacklist.txt");
	for (item of each(typesof(T("/datum/map_template/ruin")) - T("/datum/map_template/ruin"))) {
		if (!rt.initial(f, (ruin_type = item), "id")) {
			continue;
		}
		R = (yield* new_(ruin_type));
		if (banned.Find(R.mappath)) {
			continue;
		}
		rt.setAt(this.map_templates, R.name, R);
		rt.setAt(this.ruins_templates, R.name, R);
		if (rt.istype(R, T("/datum/map_template/ruin/lavaland"))) {
			rt.setAt(this.lava_ruins_templates, R.name, R);
		} else if (rt.istype(R, T("/datum/map_template/ruin/space"))) {
			rt.setAt(this.space_ruins_templates, R.name, R);
		}
	}
	return f.dot;
}, true);

// mapping.dm:232
rt.def("/datum/controller/subsystem/mapping/proc/preloadShuttleTemplates", function* preloadShuttleTemplates(f: Frame) {
	let item: Value = null, shuttle_type: Value = null, S: Value = null;
	let unbuyable: Value = generateMapList("config/unbuyableshuttles.txt");
	for (item of each(typesof(T("/datum/map_template/shuttle")) - T("/datum/map_template/shuttle"))) {
		if (!rt.initial(f, (shuttle_type = item), "suffix")) {
			continue;
		}
		S = (yield* new_(shuttle_type));
		if (unbuyable.Find(S.mappath)) {
			S.can_be_bought = 0;
		}
		rt.setAt(this.shuttle_templates, S.shuttle_id, S);
		rt.setAt(this.map_templates, S.shuttle_id, S);
	}
	return f.dot;
}, true);

// mapping.dm:247
rt.def("/datum/controller/subsystem/mapping/proc/preloadShelterTemplates", function* preloadShelterTemplates(f: Frame) {
	let item: Value = null, shelter_type: Value = null, S: Value = null;
	for (item of each(typesof(T("/datum/map_template/shelter")) - T("/datum/map_template/shelter"))) {
		if (!rt.initial(f, (shelter_type = item), "mappath")) {
			continue;
		}
		S = (yield* new_(shelter_type));
		rt.setAt(this.shelter_templates, S.shelter_id, S);
		rt.setAt(this.map_templates, S.shelter_id, S);
	}
	return f.dot;
}, true);
