// From code/game/area/areas/derelict.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13593, "/area/AIsattele", "/area", {
	music: "signal",
	ambientsounds: null,
	name: "Abandoned Teleporter",
	icon_state: "teleporter",
});

// /area/AIsattele/proc/<init>  (code/game/area/areas/derelict.dm:124)
rt.def("/area/AIsattele/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambimalf.ogg")));
	return f.dot;
});
