// Based on /tg/station's code/game/objects/items/devices/multitool.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9268, "/obj/item/device/multitool", "/obj/item/device", {
	buffer: null,
	throw_range: 7,
	throw_speed: 3,
	name: "multitool",
	desc: "Used for pulsing wires to test which to cut. Not recommended by doctors.",
	icon_state: "multitool",
	force: 5,
	w_class: 2,
	throwforce: 0,
	materials: null,
	origin_tech: "magnets=1;engineering=2",
	hitsound: rt.rsc("sound/weapons/tap.ogg"),
	toolspeed: 1,
});

// multitool.dm:20
rt.def("/obj/item/device/multitool/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50, "$glass", 20]);
	return f.dot;
});

rt.type(9269, "/obj/item/device/multitool/ai_detect", "/obj/item/device/multitool", {
	track_cooldown: 0,
	track_delay: 10,
	detect_state: "",
	rangealert: 8,
	rangewarning: 20,
	origin_tech: "magnets=1;engineering=2;syndicate=1",
});

// multitool.dm:39
rt.def("/obj/item/device/multitool/ai_detect/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// multitool.dm:43
rt.def("/obj/item/device/multitool/ai_detect/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// multitool.dm:47
rt.def("/obj/item/device/multitool/ai_detect/proc/process", function process(f: Frame) {
	if (this.track_cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	this.detect_state = "";
	this.multitool_detect();
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.detect_state}`;
	this.track_cooldown = rt.worldTime(f) + this.track_delay;
	return f.dot;
}, false, { waitfor: false });

// multitool.dm:55
rt.def("/obj/item/device/multitool/ai_detect/proc/multitool_detect", function multitool_detect(f: Frame) {
	let AI: Value = null, chunk: Value = null, A: Value = null, detect_turf: Value = null;
	let our_turf: Value = rt.getStep(f, this, 0);
	for (AI of each(GLOB.ai_list, T("/mob/living/silicon/ai"))) {
		if (AI.cameraFollow == this) {
			this.detect_state = "_red";
			break;
		}
	}
	if (!(!this.detect_state && GLOB.cameranet.chunkGenerated(our_turf.x, our_turf.y, our_turf.z))) return f.dot;
	if (!(chunk = GLOB.cameranet.getCameraChunk(our_turf.x, our_turf.y, our_turf.z))) return f.dot;
	if (!rt.len(f, chunk.seenby)) return f.dot;
	for (A of each(chunk.seenby, T("/mob/camera/aiEye"))) {
		detect_turf = rt.getStep(f, A, 0);
		if (get_dist(our_turf, detect_turf) < this.rangealert) {
			this.detect_state = "_red";
			break;
		}
		if (get_dist(our_turf, detect_turf) < this.rangewarning) {
			this.detect_state = "_yellow";
			break;
		}
	}
	return f.dot;
});

rt.type(9270, "/obj/item/device/multitool/ai_detect/admin", "/obj/item/device/multitool/ai_detect", {
	track_delay: 5,
	desc: "Used for pulsing wires to test which to cut. Not recommended by doctors. Has a strange tag that says 'Grief in Safety'",
});

// multitool.dm:79
rt.def("/obj/item/device/multitool/ai_detect/admin/proc/multitool_detect", function multitool_detect(f: Frame) {
	let J: Value = null, detect_turf: Value = null;
	let our_turf: Value = rt.getStep(f, this, 0);
	for (J of each(urange(this.rangewarning, our_turf), T("/mob"))) {
		if (rt.index(GLOB.admin_datums, J.ckey)) {
			this.detect_state = "_yellow";
			detect_turf = rt.getStep(f, J, 0);
			if (get_dist(our_turf, detect_turf) < this.rangealert) {
				this.detect_state = "_red";
				break;
			}
		}
	}
	return f.dot;
});
