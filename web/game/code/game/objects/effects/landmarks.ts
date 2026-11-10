// Based on /tg/station's code/game/objects/effects/landmarks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(11448, "/obj/effect/landmark", "/obj/effect", {
	anchored: 1,
	name: "landmark",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	invisibility: 101,
});

// landmarks.dm:9
rt.def("/obj/effect/landmark/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.tag = `landmark*${this.name}`;
	GLOB.landmarks_list += this;
	return f.dot;
}, true);

// landmarks.dm:14
rt.def("/obj/effect/landmark/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.landmarks_list -= this;
	return (yield* parent_proc());
}, true);

rt.type(11452, "/obj/effect/landmark/start", "/obj/effect/landmark", {
	anchored: 1,
	name: "start",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// landmarks.dm:24
rt.def("/obj/effect/landmark/start/proc/New", function* New(f: Frame) {
	GLOB.start_landmarks_list += this;
	yield* parent_proc();
	if (this.name == "start") return f.dot;
	this.tag = `start*${this.name}`;
	return f.dot;
}, true);

// landmarks.dm:30
rt.def("/obj/effect/landmark/start/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.start_landmarks_list -= this;
	return (yield* parent_proc());
}, true);

rt.type(11485, "/obj/effect/landmark/start/depsec", "/obj/effect/landmark/start", {
	name: "department_sec",
});

// landmarks.dm:138
rt.def("/obj/effect/landmark/start/depsec/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.department_security_spawns += this;
	return f.dot;
}, true);

// landmarks.dm:142
rt.def("/obj/effect/landmark/start/depsec/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.department_security_spawns -= this;
	return (yield* parent_proc());
}, true);

rt.type(11490, "/obj/effect/landmark/start/wizard", "/obj/effect/landmark/start", {
	name: "wizard",
});

// landmarks.dm:161
rt.def("/obj/effect/landmark/start/wizard/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.wizardstart += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11491, "/obj/effect/landmark/start/new_player", "/obj/effect/landmark/start", {
	name: "New Player",
});

// landmarks.dm:171
rt.def("/obj/effect/landmark/start/new_player/proc/New", function* New(f: Frame, loc: Value) {
	yield* parent_proc();
	GLOB.newplayer_start += loc;
	return f.dot;
}, true);

// landmarks.dm:175
rt.def("/obj/effect/landmark/start/new_player/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11492, "/obj/effect/landmark/latejoin", "/obj/effect/landmark", {
	name: "JoinLate",
});

// landmarks.dm:184
rt.def("/obj/effect/landmark/latejoin/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.SSjob.latejoin_trackers += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11502, "/obj/effect/landmark/xeno_spawn", "/obj/effect/landmark", {
	name: "xeno_spawn",
});

// landmarks.dm:230
rt.def("/obj/effect/landmark/xeno_spawn/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.xeno_spawn += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11503, "/obj/effect/landmark/blobstart", "/obj/effect/landmark", {
	name: "blobstart",
});

// landmarks.dm:239
rt.def("/obj/effect/landmark/blobstart/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.blobstart += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11504, "/obj/effect/landmark/secequipment", "/obj/effect/landmark", {
	name: "secequipment",
});

// landmarks.dm:247
rt.def("/obj/effect/landmark/secequipment/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.secequipment += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11505, "/obj/effect/landmark/prisonwarp", "/obj/effect/landmark", {
	name: "prisonwarp",
});

// landmarks.dm:255
rt.def("/obj/effect/landmark/prisonwarp/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.prisonwarp += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11506, "/obj/effect/landmark/ert_spawn", "/obj/effect/landmark", {
	name: "Emergencyresponseteam",
});

// landmarks.dm:263
rt.def("/obj/effect/landmark/ert_spawn/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.emergencyresponseteamspawn += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11507, "/obj/effect/landmark/holding_facility", "/obj/effect/landmark", {
	name: "Holding Facility",
});

// landmarks.dm:271
rt.def("/obj/effect/landmark/holding_facility/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.holdingfacility += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11509, "/obj/effect/landmark/thunderdome/observe", "/obj/effect/landmark/thunderdome", {
	name: "tdomeobserve",
});

// landmarks.dm:279
rt.def("/obj/effect/landmark/thunderdome/observe/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.tdomeobserve += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11510, "/obj/effect/landmark/thunderdome/one", "/obj/effect/landmark/thunderdome", {
	name: "tdome1",
});

// landmarks.dm:287
rt.def("/obj/effect/landmark/thunderdome/one/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.tdome1 += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11511, "/obj/effect/landmark/thunderdome/two", "/obj/effect/landmark/thunderdome", {
	name: "tdome2",
});

// landmarks.dm:295
rt.def("/obj/effect/landmark/thunderdome/two/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.tdome2 += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11512, "/obj/effect/landmark/thunderdome/admin", "/obj/effect/landmark/thunderdome", {
	name: "tdomeadmin",
});

// landmarks.dm:303
rt.def("/obj/effect/landmark/thunderdome/admin/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	GLOB.tdomeadmin += this.loc;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(11513, "/obj/effect/landmark/event_spawn", "/obj/effect/landmark", {
	name: "generic event spawn",
	icon_state: "x4",
});

// landmarks.dm:314
rt.def("/obj/effect/landmark/event_spawn/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.generic_event_spawns += this;
	return f.dot;
}, true);

// landmarks.dm:318
rt.def("/obj/effect/landmark/event_spawn/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.generic_event_spawns -= this;
	return (yield* parent_proc());
}, true);

rt.type(11514, "/obj/effect/landmark/ruin", "/obj/effect/landmark", {
	ruin_template: null,
});

// landmarks.dm:325
rt.def("/obj/effect/landmark/ruin/proc/New", function* New(f: Frame, loc: Value, my_ruin_template: Value) {
	this.name = `ruin_${rt.len(f, GLOB.ruin_landmarks) + 1}`;
	yield* parent_proc(loc);
	this.ruin_template = my_ruin_template;
	(rt.modGl("ruin_landmarks", this, rt.bitOr));
	return f.dot;
}, true);

// landmarks.dm:331
rt.def("/obj/effect/landmark/ruin/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.ruin_landmarks -= this;
	this.ruin_template = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
