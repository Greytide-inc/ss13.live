// Based on /tg/station's code/game/gamemodes/blob/blobs/resource.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// resource.dm:12
rt.def("/obj/structure/blob/resource/proc/scannerreport", function scannerreport(f: Frame) {
	return "Gradually supplies the blob with resources, increasing the rate of expansion.";
});

// resource.dm:20
rt.def("/obj/structure/blob/resource/proc/Destroy", function* Destroy(f: Frame) {
	if (this.overmind) {
		this.overmind.resource_blobs -= this;
	}
	return (yield* parent_proc());
}, true);

// resource.dm:24
rt.def("/obj/structure/blob/resource/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.resource_delay > rt.worldTime(f)) {
		return f.dot;
	}
	flick("blob_resource_glow", this);
	if (this.overmind) {
		this.overmind.add_points(1);
		this.resource_delay = rt.worldTime(f) + 40 + rt.len(f, this.overmind.resource_blobs) * 2.5;
	} else {
		this.resource_delay = rt.worldTime(f) + 40;
	}
	return f.dot;
}, true);
