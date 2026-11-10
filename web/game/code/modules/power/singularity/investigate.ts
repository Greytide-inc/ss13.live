// Based on /tg/station's code/modules/power/singularity/investigate.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(13279, "/area/engine/engineering", "/area/engine", {
	name: "Engineering",
	icon_state: "engine",
});

// investigate.dm:2
rt.def("/area/engine/engineering/proc/poweralert", function poweralert(f: Frame, state: Value, source: Value) {
	if (state != this.poweralm) {
		this.investigate_log("has a power alarm!", "singulo");
	}
	parent_proc();
	return f.dot;
}, false);
