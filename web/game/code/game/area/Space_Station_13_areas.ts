// Based on /tg/station's code/game/area/Space_Station_13_areas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13111, "/area/asteroid/artifactroom", "/area/asteroid", {
	name: "Asteroid - Artifact",
	icon_state: "cave",
});

// Space_Station_13_areas.dm:80
rt.def("/area/asteroid/artifactroom/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.set_dynamic_lighting();
	return f.dot;
}, true);

rt.type(13076, "/area/ai_monitored/turret_protected", "/area/ai_monitored", {
	ambientsounds: null,
});

// Space_Station_13_areas.dm:1349
rt.def("/area/ai_monitored/turret_protected/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambimalf.ogg"));
	return f.dot;
});

// Space_Station_13_areas.dm:1465
rt.def("/datum/controller/global_vars/proc/InitGlobalthe_station_areas", function InitGlobalthe_station_areas(f: Frame) {
	GLOB.the_station_areas = list(T("/area/assembly"), T("/area/bridge"), T("/area/chapel"), T("/area/construction"), T("/area/crew_quarters"), T("/area/engine"), T("/area/hallway"), T("/area/holodeck"), T("/area/hydroponics"), T("/area/janitor"), T("/area/lawoffice"), T("/area/library"), T("/area/maintenance"), T("/area/medical"), T("/area/quartermaster"), T("/area/science"), T("/area/security"), T("/area/solar"), T("/area/storage"), T("/area/teleporter"), T("/area/ai_monitored/storage/eva"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/ai_monitored/turret_protected/ai_upload_foyer"), T("/area/ai_monitored/turret_protected/ai"));
	this.gvars_datum_init_order += "the_station_areas";
	return f.dot;
});
