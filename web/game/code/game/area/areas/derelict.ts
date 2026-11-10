// Based on /tg/station's code/game/area/areas/derelict.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13593, "/area/AIsattele", "/area", {
	music: "signal",
	ambientsounds: null,
	name: "Abandoned Teleporter",
	icon_state: "teleporter",
});

// derelict.dm:124
rt.def("/area/AIsattele/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ambientsounds = list(rt.rsc("sound/ambience/ambimalf.ogg"));
	return f.dot;
});
