// From code/modules/admin/verbs/cinematic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/cinematic  (code/modules/admin/verbs/cinematic.dm:6)  may sleep
rt.def("/client/proc/cinematic", function* cinematic(f: Frame, cinematic: Value) {
	let parameter: Value = null, override: Value = null;
	let $0: any;
	f.vars = () => [cinematic, parameter, override, $0];
	if (!truthy(rt.gl("SSticker"))) {
		return live(f.dot);
	}
	$0 = live(cinematic);
	if ($0 === "explosion") {
		parameter = (yield* g.op(f, "Prompt", [32], [0, "Enter Parameter", "station_missed = ?", live(f.src), null]));
		override = null;
		$0 = live(parameter);
		if ($0 === 1) {
			override = (yield* g.op(f, "Prompt", [0], [null, "Enter Parameter", "mode = ?", live(f.src), rt.list("nuclear emergency", "gang war", "fake", "no override")]));
		} else if ($0 === 0) {
			override = (yield* g.op(f, "Prompt", [0], [null, "Enter Parameter", "mode = ?", live(f.src), rt.list("blob", "nuclear emergency", "AI malfunction", "no override")]));
		}
		yield* g.callName(f, rt.gl("SSticker"), "station_explosion_cinematic", [live(parameter), live(override)]);
	}
	return live(f.dot);
}, true, { hidden: true, verb: { name: "cinematic", category: "Fun", desc: "Shows a cinematic." }, argTypes: [{ source: "?" }] });
