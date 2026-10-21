// From code/game/gamemodes/blob/blobs/node.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12143, "/obj/structure/blob/node", "/obj/structure/blob", {
	health_regen: 3,
	point_return: 25,
	name: "blob node",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blank_blob",
	desc: "A large, pulsating yellow mass.",
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// /obj/structure/blob/node/proc/<init>  (code/game/gamemodes/blob/blobs/node.dm:8)
rt.def("/obj/structure/blob/node/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 65, "acid", 90]));
	return f.dot;
});

// /obj/structure/blob/node/proc/Initialize  (code/game/gamemodes/blob/blobs/node.dm:14)  may sleep
rt.def("/obj/structure/blob/node/proc/Initialize", function* Initialize(f: Frame) {
	rt.modGl("blob_nodes", live(f.src), add);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/structure/blob/node/proc/scannerreport  (code/game/gamemodes/blob/blobs/node.dm:19)
rt.def("/obj/structure/blob/node/proc/scannerreport", function scannerreport(f: Frame) {
	return "Gradually expands and sustains nearby blob spores and blobbernauts.";
});

// /obj/structure/blob/node/proc/update_icon  (code/game/gamemodes/blob/blobs/node.dm:22)
rt.def("/obj/structure/blob/node/proc/update_icon", function update_icon(f: Frame) {
	let blob_overlay: Value = null;
	f.vars = () => [blob_overlay];
	rt.callSrc(f, "cut_overlays", []);
	rt.setSv(f, "color", null);
	blob_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/blob.dmi"), "blob"]);
	if (truthy(rt.sv(f, "overmind"))) {
		rt.setFv(f, "color", live(blob_overlay), rt.gv(f, "color", rt.fv(f, "blob_reagent_datum", rt.sv(f, "overmind"))));
	}
	rt.callSrc(f, "add_overlay", [live(blob_overlay)]);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/blob.dmi"), "blob_node_overlay"])]);
	return f.dot;
});

// /obj/structure/blob/node/proc/Destroy  (code/game/gamemodes/blob/blobs/node.dm:31)  may sleep
rt.def("/obj/structure/blob/node/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("blob_nodes", live(f.src), subtract));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/blob/node/proc/Life  (code/game/gamemodes/blob/blobs/node.dm:36)  may sleep
rt.def("/obj/structure/blob/node/proc/Life", function* Life(f: Frame) {
	yield* g.srcCall(f, "Pulse_Area", rt.sv(f, "overmind"), 10, 3, 2);
	return f.dot;
}, true);
