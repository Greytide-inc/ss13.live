// From code/modules/admin/verbs/map_template_loadverb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /client/proc/map_template_load  (code/modules/admin/verbs/map_template_loadverb.dm:7)  may sleep
rt.def("/client/proc/map_template_load", function* map_template_load(f: Frame) {
	let template: Value = null, map: Value = null, _T: Value = null, preview: Value = null, S: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [template, map, _T, preview, S, $0, $1, $2, $e];
	template = null;
	if (!truthy((map = (yield* g.op(f, "Prompt", [1], [null, "Place Map Template", "Choose a Map Template to place at your CURRENT LOCATION", live(f.usr), rt.fv(f, "map_templates", rt.gl("SSmapping"))]))))) {
		return live(f.dot);
	}
	template = rt.index(rt.fv(f, "map_templates", rt.gl("SSmapping")), live(map));
	if (!truthy((_T = rt.getStep(f, rt.sv(f, "mob"), 0)))) {
		return live(f.dot);
	}
	preview = rt.list();
	S = null;
	rt.forList(f, 0, (yield* g.callName(f, live(template), "get_affected_turfs", [null, live(_T), "centered", 1], rt.Args.Named)));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		preview = rt.modify(live(preview), (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/turf/overlays.dmi"), live(S), "greenOverlay"])), add);
	}
	rt.endFor(f, 0);
	rt.modField(f, rt.fv(f, "client", live(f.usr)), "images", live(preview), add);
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.usr), "Confirm location.", "Template Confirm", "Yes", "No"])), "Yes")) {
		if (truthy((yield* g.callName(f, live(template), "load", [null, live(_T), "centered", 1], rt.Args.Named)))) {
			$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)]));
			$1 = rt.fv(f, "name", live(template));
			if (truthy(live(_T))) {
				$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
			} else {
				$2 = "nonexistent location";
			}
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has placed a map template (＀) at ＀</span>", [$0, $1, fmt("＀", [$2])])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Failed to place map"]);
		}
	}
	(rt.modField(f, rt.fv(f, "client", live(f.usr)), "images", live(preview), subtract));
	return f.dot;
}, true, { verb: { name: "Map template - Place", category: "Debug" } });

// /client/proc/map_template_upload  (code/modules/admin/verbs/map_template_loadverb.dm:31)  may sleep
rt.def("/client/proc/map_template_upload", function* map_template_upload(f: Frame) {
	let map: Value = null, M: Value = null;
	f.vars = () => [map, M];
	if (!truthy((map = (yield* g.op(f, "Prompt", [513], [null, "Upload Map Template", "Choose a Map Template to upload to template storage", live(f.usr), null]))))) {
		return live(f.dot);
	}
	if (!isEqual((yield* g.call(f, P("/proc/copytext"), null, [fmt("＀", [live(map)]), -4])), ".dmm")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Bad map file: ＀", [live(map)])]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, (M = (yield* g.new_(f, T("/datum/map_template"), [live(map), fmt("＀", [live(map)])]))), "preload_size", [live(map)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Map template '＀' ready to place (＀x＀)", [live(map), rt.fv(f, "width", live(M)), rt.fv(f, "height", live(M))])]);
		rt.setAt(rt.fv(f, "map_templates", rt.gl("SSmapping")), rt.fv(f, "name", live(M)), live(M));
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("<span class='adminnotice'>＀ has uploaded a map template (＀)</span>", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(map)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("Map template '＀' failed to load properly", [live(map)])]);
	}
	return f.dot;
}, true, { verb: { name: "Map Template - Upload", category: "Debug" } });
