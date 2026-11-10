// Based on /tg/station's code/modules/mob/living/silicon/ai/freelook/cameranet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// cameranet.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalcameranet", function InitGlobalcameranet(f: Frame) {
	GLOB.cameranet = new_(T("/datum/cameranet"));
	this.gvars_datum_init_order += "cameranet";
	return f.dot;
});

rt.type(4114, "/datum/cameranet", "/datum", {
	name: "Camera Net",
	cameras: null,
	chunks: null,
	ready: 0,
	statclick: null,
});

// cameranet.dm:13
rt.def("/datum/cameranet/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cameras = list();

	this.chunks = list();
	return f.dot;
});

// cameranet.dm:23
rt.def("/datum/cameranet/proc/chunkGenerated", function chunkGenerated(f: Frame, x: Value, y: Value, z: Value) {
	(x = rt.modify(x, 16777200, rt.bitAnd));
	(y = rt.modify(y, 16777200, rt.bitAnd));
	let key: Value = `${x},${y},${z}`;
	return rt.index(this.chunks, key);
});

// cameranet.dm:31
rt.def("/datum/cameranet/proc/getCameraChunk", function getCameraChunk(f: Frame, x: Value, y: Value, z: Value) {
	(x = rt.modify(x, 16777200, rt.bitAnd));
	(y = rt.modify(y, 16777200, rt.bitAnd));
	let key: Value = `${x},${y},${z}`;
	if (!rt.index(this.chunks, key)) {
		rt.setAt(this.chunks, key, new_(T("/datum/camerachunk"), null, x, y, z));
	}
	return rt.index(this.chunks, key);
});

// cameranet.dm:43
rt.def("/datum/cameranet/proc/visibility", function visibility(f: Frame, ai: Value) {
	let y: Value = null, chunk: Value = null, c: Value = null;
	let x1: Value = rt.bitAnd(max(0, ai.x - 16), 16777200);
	let y1: Value = rt.bitAnd(max(0, ai.y - 16), 16777200);
	let x2: Value = rt.bitAnd(min(rt.world().maxx, ai.x + CHUNK_SIZE), 16777200);
	let y2: Value = rt.bitAnd(min(rt.world().maxy, ai.y + CHUNK_SIZE), 16777200);
	let visibleChunks: Value = list();
	let x: Value = x1;
	while (x <= x2) {
		y = y1;
		while (y <= y2) {
			(visibleChunks = rt.modify(visibleChunks, this.getCameraChunk(x, y, ai.z), rt.bitOr));
			y += CHUNK_SIZE;
		}
		x += CHUNK_SIZE;
	}
	let remove: Value = ai.visibleCameraChunks - visibleChunks;
	let _add: Value = visibleChunks - ai.visibleCameraChunks;
	for (chunk of each(remove)) {
		(c = chunk).remove(ai);
	}
	chunk = null;
	for (chunk of each(_add)) {
		rt.callName(f, (c = chunk), "add", [ai]);
	}
	return f.dot;
});

// cameranet.dm:69
rt.def("/datum/cameranet/proc/updateVisibility", function updateVisibility(f: Frame, A: Value, opacity_check: Value) {
	opacity_check ??= 1;
	if (!GLOB.SSticker || opacity_check && !A.opacity) {
		return f.dot;
	}
	this.majorChunkChange(A, 2);
	return f.dot;
});

// cameranet.dm:75
rt.def("/datum/cameranet/proc/updateChunk", function updateChunk(f: Frame, x: Value, y: Value, z: Value) {
	let chunk: Value = null;
	if (!this.chunkGenerated(x, y, z)) {
		return f.dot;
	}
	(chunk = this.getCameraChunk(x, y, z)).hasChanged();
	return f.dot;
});

// cameranet.dm:83
rt.def("/datum/cameranet/proc/removeCamera", function removeCamera(f: Frame, c: Value) {
	if (!c.can_use()) return f.dot;
	this.majorChunkChange(c, 0);
	return f.dot;
});

// cameranet.dm:89
rt.def("/datum/cameranet/proc/addCamera", function addCamera(f: Frame, c: Value) {
	if (!c.can_use()) return f.dot;
	this.majorChunkChange(c, 1);
	return f.dot;
});

// cameranet.dm:95
rt.def("/datum/cameranet/proc/updatePortableCamera", function updatePortableCamera(f: Frame, c: Value) {
	if (!c.can_use()) return f.dot;
	this.majorChunkChange(c, 1);
	return f.dot;
});

// cameranet.dm:108
rt.def("/datum/cameranet/proc/majorChunkChange", function majorChunkChange(f: Frame, c: Value, choice: Value) {
	let _T: Value = null, y: Value = null, chunk: Value = null;
	if (!c) {
		return f.dot;
	}
	if (!(_T = rt.getStep(f, c, 0))) return f.dot;
	let x1: Value = rt.bitAnd(max(0, _T.x - 8), 16777200);
	let y1: Value = rt.bitAnd(max(0, _T.y - 8), 16777200);
	let x2: Value = rt.bitAnd(min(rt.world().maxx, _T.x + 8), 16777200);
	let y2: Value = rt.bitAnd(min(rt.world().maxy, _T.y + 8), 16777200);
	let x: Value = x1;
	while (x <= x2) {
		y = y1;
		while (y <= y2) {
			if (this.chunkGenerated(x, y, _T.z)) {
				chunk = this.getCameraChunk(x, y, _T.z);
				if (choice == 0) {
					chunk.cameras -= c;
				} else if (choice == 1) {
					(rt.modField(f, chunk, "cameras", c, rt.bitOr));
				}
				chunk.hasChanged();
			}
			y += CHUNK_SIZE;
		}
		x += CHUNK_SIZE;
	}
	return f.dot;
});

// cameranet.dm:137
rt.def("/datum/cameranet/proc/checkCameraVis", function checkCameraVis(f: Frame, target: Value) {
	let position: Value = null;
	return this.checkTurfVis((position = rt.getStep(f, target, 0)));
});

// cameranet.dm:142
rt.def("/datum/cameranet/proc/checkTurfVis", function checkTurfVis(f: Frame, position: Value) {
	let chunk: Value = null;
	if (chunk = this.getCameraChunk(position.x, position.y, position.z)) {
		if (chunk.changed) {
			chunk.hasChanged(1);
		}
		if (rt.index(chunk.visibleTurfs, position)) {
			return 1;
		}
	}
	return 0;
});

// cameranet.dm:151
rt.def("/datum/cameranet/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Initializing...", this));
	}
	stat(this.name, (yield* this.statclick.update(`Cameras: ${rt.len(f, GLOB.cameranet.cameras)} | Chunks: ${rt.len(f, GLOB.cameranet.chunks)}`)));
	return f.dot;
}, true);
