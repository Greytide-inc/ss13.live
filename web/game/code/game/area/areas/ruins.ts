// From code/game/area/areas/ruins.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13690, "/area/ruin/powered/aesthetic", "/area/ruin/powered", {
	ambientsounds: null,
	name: "Aesthetic",
});

// /area/ruin/powered/aesthetic/proc/<init>  (code/game/area/areas/ruins.dm:95)
rt.def("/area/ruin/powered/aesthetic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ambientsounds", rt.list(rt.rsc("sound/ambience/ambivapor1.ogg")));
	return f.dot;
});
