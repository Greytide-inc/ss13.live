// From code/game/area/Space_Station_13_areas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13111, "/area/asteroid/artifactroom", "/area/asteroid", {
	name: "Asteroid - Artifact",
	icon_state: "cave",
});

// /area/asteroid/artifactroom/proc/Initialize  (code/game/area/Space_Station_13_areas.dm:80)  may sleep
rt.def("/area/asteroid/artifactroom/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_dynamic_lighting");
	return f.dot;
}, true);

rt.type(13076, "/area/ai_monitored/turret_protected", "/area/ai_monitored", {
	ambientsounds: null,
});

// /area/ai_monitored/turret_protected/proc/<init>  (code/game/area/Space_Station_13_areas.dm:1349)
rt.def("/area/ai_monitored/turret_protected/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimalf.ogg")));
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalthe_station_areas  (code/game/area/Space_Station_13_areas.dm:1465)
rt.def("/datum/controller/global_vars/proc/InitGlobalthe_station_areas", function InitGlobalthe_station_areas(f: Frame) {
	rt.setGl("the_station_areas", rt.list(T("/area/assembly"), T("/area/bridge"), T("/area/chapel"), T("/area/construction"), T("/area/crew_quarters"), T("/area/engine"), T("/area/hallway"), T("/area/holodeck"), T("/area/hydroponics"), T("/area/janitor"), T("/area/lawoffice"), T("/area/library"), T("/area/maintenance"), T("/area/medical"), T("/area/quartermaster"), T("/area/science"), T("/area/security"), T("/area/solar"), T("/area/storage"), T("/area/teleporter"), T("/area/ai_monitored/storage/eva"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/ai_monitored/turret_protected/ai_upload_foyer"), T("/area/ai_monitored/turret_protected/ai")));
	rt.modSrcVar(f, "gvars_datum_init_order", "the_station_areas", add);
	return f.dot;
});
