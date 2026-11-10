// Based on /tg/station's code/game/gamemodes/blob/blobs/node.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// node.dm:8
rt.def("/obj/structure/blob/node/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 65, "acid", 90]);
	return f.dot;
});

// node.dm:14
rt.def("/obj/structure/blob/node/proc/Initialize", function* Initialize(f: Frame) {
	GLOB.blob_nodes += this;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// node.dm:19
rt.def("/obj/structure/blob/node/proc/scannerreport", function scannerreport(f: Frame) {
	return "Gradually expands and sustains nearby blob spores and blobbernauts.";
});

// node.dm:22
rt.def("/obj/structure/blob/node/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	this.color = null;
	let blob_overlay: Value = mutable_appearance(rt.rsc("icons/mob/blob.dmi"), "blob");
	if (this.overmind) {
		blob_overlay.color = this.overmind.blob_reagent_datum.color;
	}
	this.add_overlay(blob_overlay);
	this.add_overlay(mutable_appearance(rt.rsc("icons/mob/blob.dmi"), "blob_node_overlay"));
	return f.dot;
});

// node.dm:31
rt.def("/obj/structure/blob/node/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.blob_nodes -= this;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// node.dm:36
rt.def("/obj/structure/blob/node/proc/Life", function* Life(f: Frame) {
	yield* this.Pulse_Area(this.overmind, 10, 3, 2);
	return f.dot;
}, true);
