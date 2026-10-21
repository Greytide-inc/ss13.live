// From code/game/gamemodes/blob/blobs/resource.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12144, "/obj/structure/blob/resource", "/obj/structure/blob", {
	resource_delay: 0,
	point_return: 15,
	name: "resource blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blob_resource",
	desc: "A thin spire of slightly swaying tendrils.",
	obj_integrity: 60,
	max_integrity: 60,
});

// /obj/structure/blob/resource/proc/scannerreport  (code/game/gamemodes/blob/blobs/resource.dm:12)
rt.def("/obj/structure/blob/resource/proc/scannerreport", function scannerreport(f: Frame) {
	return "Gradually supplies the blob with resources, increasing the rate of expansion.";
});

// /obj/structure/blob/resource/proc/Destroy  (code/game/gamemodes/blob/blobs/resource.dm:20)  may sleep
rt.def("/obj/structure/blob/resource/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "overmind"))) {
		(rt.modField(f, rt.sv(f, "overmind"), "resource_blobs", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/blob/resource/proc/Be_Pulsed  (code/game/gamemodes/blob/blobs/resource.dm:24)  may sleep
rt.def("/obj/structure/blob/resource/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (rt.gt(rt.sv(f, "resource_delay"), rt.worldTime(f))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/flick"), null, ["blob_resource_glow", live(f.src)]);
	if (truthy(rt.sv(f, "overmind"))) {
		yield* g.callName(f, rt.sv(f, "overmind"), "add_points", [1]);
		rt.setSv(f, "resource_delay", add(add(rt.worldTime(f), 40), multiply(rt.getLen(f, rt.fv(f, "resource_blobs", rt.sv(f, "overmind"))), 2.5)));
	} else {
		rt.setSv(f, "resource_delay", add(rt.worldTime(f), 40));
	}
	return f.dot;
}, true);
