// From code/modules/power/singularity/investigate.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13279, "/area/engine/engineering", "/area/engine", {
	name: "Engineering",
	icon_state: "engine",
});

// /area/engine/engineering/proc/poweralert  (code/modules/power/singularity/investigate.dm:2)
rt.def("/area/engine/engineering/proc/poweralert", function poweralert(f: Frame) {
	if (!isEqual(live(f.args[0]), rt.sv(f, "poweralm"))) {
		rt.callSrc(f, "investigate_log", ["has a power alarm!", "singulo"]);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["state", "source"] });
