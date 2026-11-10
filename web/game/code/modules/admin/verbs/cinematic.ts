// Based on /tg/station's code/modules/admin/verbs/cinematic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// cinematic.dm:6
rt.def("/client/proc/cinematic", function* cinematic(f: Frame, cinematic: Value) {
	let parameter: Value = null, override: Value = null;
	if (!GLOB.SSticker) {
		return f.dot;
	}
	if (cinematic === "explosion") {
		parameter = (yield* g.op(f, "Prompt", [32], [0, "Enter Parameter", "station_missed = ?", this, null]));
		if (parameter === 1) {
			override = (yield* g.op(f, "Prompt", [0], [null, "Enter Parameter", "mode = ?", this, list("nuclear emergency", "gang war", "fake", "no override")]));
		} else if (parameter === 0) {
			override = (yield* g.op(f, "Prompt", [0], [null, "Enter Parameter", "mode = ?", this, list("blob", "nuclear emergency", "AI malfunction", "no override")]));
		}
		yield* GLOB.SSticker.station_explosion_cinematic(parameter, override);
	}
	return f.dot;
}, true, { hidden: true, verb: { name: "cinematic", category: "Fun", desc: "Shows a cinematic." }, argTypes: [{ source: "?" }] });
