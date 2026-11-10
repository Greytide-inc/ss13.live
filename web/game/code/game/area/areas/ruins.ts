// Based on /tg/station's code/game/area/areas/ruins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13690, "/area/ruin/powered/aesthetic", "/area/ruin/powered", {
	ambientsounds: null,
	name: "Aesthetic",
});

// ruins.dm:95
rt.def("/area/ruin/powered/aesthetic/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambivapor1.ogg"));
	return f.dot;
});
