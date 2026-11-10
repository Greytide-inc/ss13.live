// Based on /tg/station's code/modules/mob/living/silicon/ai/freelook/chunk.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4115, "/datum/camerachunk", "/datum", {
	obscuredTurfs: null,
	visibleTurfs: null,
	obscured: null,
	cameras: null,
	turfs: null,
	seenby: null,
	visible: 0,
	changed: 0,
	updating: 0,
	x: 0,
	y: 0,
	z: 0,
});

// chunk.dm:9
rt.def("/datum/camerachunk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.obscuredTurfs = list();

	this.visibleTurfs = list();

	this.obscured = list();

	this.cameras = list();

	this.turfs = list();

	this.seenby = list();
	return f.dot;
});

// chunk.dm:25
rt.def("/datum/camerachunk/proc/add", function _add(f: Frame, eye: Value) {
	let client: Value = null;
	if (client = eye.GetViewerClient()) {
		client.images += this.obscured;
	}
	eye.visibleCameraChunks += this;
	this.visible++;
	this.seenby += eye;
	if (!(this.changed && !this.updating)) return f.dot;
	this.update();
	return f.dot;
});

// chunk.dm:37
rt.def("/datum/camerachunk/proc/remove", function remove(f: Frame, eye: Value) {
	let client: Value = null;
	if (client = eye.GetViewerClient()) {
		client.images -= this.obscured;
	}
	eye.visibleCameraChunks -= this;
	this.seenby -= eye;
	if (!(this.visible > 0)) return f.dot;
	this.visible--;
	return f.dot;
});

// chunk.dm:48
rt.def("/datum/camerachunk/proc/visibilityChanged", function visibilityChanged(f: Frame, loc: Value) {
	if (!rt.index(this.visibleTurfs, loc)) {
		return f.dot;
	}
	this.hasChanged();
	return f.dot;
});

// chunk.dm:56
rt.def("/datum/camerachunk/proc/hasChanged", function hasChanged(f: Frame, update_now: Value) {
	update_now ??= 0;
	if (this.visible || update_now) {
		if (!this.updating) {
			this.updating = 1;
			rt.spawnTail(f, UPDATE_BUFFER, "/datum/camerachunk/proc/hasChanged: spawn at modules/mob/living/silicon/ai/freelook/chunk.dm:59", update_now);
		}
	} else {
		this.changed = 1;
	}
	return f.dot;
});

// a spawn(25) body of /datum/camerachunk/proc/hasChanged, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/camerachunk/proc/hasChanged: spawn at modules/mob/living/silicon/ai/freelook/chunk.dm:59", function* (f: Frame, update_now: Value) {
	yield* this.update();
	this.updating = 0;
	return null;
});

// chunk.dm:71
rt.def("/datum/camerachunk/proc/update", function update(f: Frame) {
	let camera: Value = null, c: Value = null, point: Value = null, t: Value = null, turf: Value = null, eye: Value = null, m: Value = null, client: Value = null;
	let newVisibleTurfs: Value = list();
	for (camera of each(this.cameras)) {
		if (!(c = camera)) {
			continue;
		}
		if (!c.can_use()) {
			continue;
		}
		if (get_dist((point = rt.locate(this.x + 8, this.y + 8, this.z)), c) > 24) {
			continue;
		}
		t = null;
		for (t of each(c.can_see(), T("/turf"))) {
			rt.setAt(newVisibleTurfs, t, t);
		}
	}
	(newVisibleTurfs = rt.modify(newVisibleTurfs, this.turfs, rt.bitAnd));
	let visAdded: Value = newVisibleTurfs - this.visibleTurfs;
	let visRemoved: Value = this.visibleTurfs - newVisibleTurfs;
	this.visibleTurfs = newVisibleTurfs;
	this.obscuredTurfs = this.turfs - newVisibleTurfs;
	for (turf of each(visAdded)) {
		if ((t = turf).obscured) {
			this.obscured -= t.obscured;
			eye = null;
			for (eye of each(this.seenby)) {
				if (!(m = eye)) {
					continue;
				}
				if (client = m.GetViewerClient()) {
					client.images -= t.obscured;
				}
			}
		}
	}
	turf = null;
	for (turf of each(visRemoved)) {
		t = turf;
		if (rt.index(this.obscuredTurfs, t)) {
			if (!t.obscured) {
				t.obscured = image(rt.rsc("icons/effects/cameravis.dmi"), t, null, CHUNK_SIZE);
				t.obscured.plane = CHUNK_SIZE;
			}
			this.obscured += t.obscured;
			eye = null;
			for (eye of each(this.seenby)) {
				if (!(m = eye)) {
					this.seenby -= m;
					continue;
				}
				if (client = m.GetViewerClient()) {
					client.images += t.obscured;
				}
			}
		}
	}
	this.changed = 0;
	return f.dot;
});

// chunk.dm:136
rt.def("/datum/camerachunk/proc/New", function New(f: Frame, loc: Value, x: Value, y: Value, z: Value) {
	let c: Value = null, t: Value = null, camera: Value = null, c_1: Value = null, t_2: Value = null, turf: Value = null, t_1: Value = null;
	(x = rt.modify(x, 16777200, rt.bitAnd));
	(y = rt.modify(y, 16777200, rt.bitAnd));
	this.x = x;
	this.y = y;
	this.z = z;
	for (c of each(urange(CHUNK_SIZE, rt.locate(x + 8, y + 8, z)), T("/obj/machinery/camera"))) {
		if (c.can_use()) {
			this.cameras += c;
		}
	}
	for (t of each(block(rt.locate(max(x, 1), max(y, 1), z), rt.locate(min(x + CHUNK_SIZE - 1, rt.world().maxx), min(y + CHUNK_SIZE - 1, rt.world().maxy), z)), T("/turf"))) {
		rt.setAt(this.turfs, t, t);
	}
	for (camera of each(this.cameras)) {
		if (!(c_1 = camera)) {
			continue;
		}
		if (!c_1.can_use()) {
			continue;
		}
		t_2 = null;
		for (t_2 of each(c_1.can_see(), T("/turf"))) {
			rt.setAt(this.visibleTurfs, t_2, t_2);
		}
	}
	(rt.modSrcVar(f, "visibleTurfs", this.turfs, rt.bitAnd));
	this.obscuredTurfs = this.turfs - this.visibleTurfs;
	for (turf of each(this.obscuredTurfs)) {
		if (!(t_1 = turf).obscured) {
			t_1.obscured = image(rt.rsc("icons/effects/cameravis.dmi"), t_1, null, CHUNK_SIZE);
			t_1.obscured.plane = CHUNK_SIZE;
		}
		this.obscured += t_1.obscured;
	}
	return f.dot;
});
