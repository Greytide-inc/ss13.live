// From code/game/objects/effects/landmarks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11448, "/obj/effect/landmark", "/obj/effect", {
	anchored: 1,
	name: "landmark",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x2",
	invisibility: 101,
});

// /obj/effect/landmark/proc/New  (code/game/objects/effects/landmarks.dm:9)  may sleep
rt.def("/obj/effect/landmark/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "tag", fmt("landmark*＀", [rt.sv(f, "name")]));
	rt.modGl("landmarks_list", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/landmark/proc/Destroy  (code/game/objects/effects/landmarks.dm:14)  may sleep
rt.def("/obj/effect/landmark/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("landmarks_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11452, "/obj/effect/landmark/start", "/obj/effect/landmark", {
	anchored: 1,
	name: "start",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	icon_state: "x",
});

// /obj/effect/landmark/start/proc/New  (code/game/objects/effects/landmarks.dm:24)  may sleep
rt.def("/obj/effect/landmark/start/proc/New", function* New(f: Frame) {
	rt.modGl("start_landmarks_list", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "name"), "start")) return f.dot;
	rt.setSv(f, "tag", fmt("start*＀", [rt.sv(f, "name")]));
	return f.dot;
}, true);

// /obj/effect/landmark/start/proc/Destroy  (code/game/objects/effects/landmarks.dm:30)  may sleep
rt.def("/obj/effect/landmark/start/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("start_landmarks_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11485, "/obj/effect/landmark/start/depsec", "/obj/effect/landmark/start", {
	name: "department_sec",
});

// /obj/effect/landmark/start/depsec/proc/New  (code/game/objects/effects/landmarks.dm:138)  may sleep
rt.def("/obj/effect/landmark/start/depsec/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("department_security_spawns", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/landmark/start/depsec/proc/Destroy  (code/game/objects/effects/landmarks.dm:142)  may sleep
rt.def("/obj/effect/landmark/start/depsec/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("department_security_spawns", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11490, "/obj/effect/landmark/start/wizard", "/obj/effect/landmark/start", {
	name: "wizard",
});

// /obj/effect/landmark/start/wizard/proc/Initialize  (code/game/objects/effects/landmarks.dm:161)  may sleep
rt.def("/obj/effect/landmark/start/wizard/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("wizardstart", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11491, "/obj/effect/landmark/start/new_player", "/obj/effect/landmark/start", {
	name: "New Player",
});

// /obj/effect/landmark/start/new_player/proc/New  (code/game/objects/effects/landmarks.dm:171)  may sleep
rt.def("/obj/effect/landmark/start/new_player/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("newplayer_start", live(f.args[0]), add);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/effect/landmark/start/new_player/proc/Initialize  (code/game/objects/effects/landmarks.dm:175)  may sleep
rt.def("/obj/effect/landmark/start/new_player/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11492, "/obj/effect/landmark/latejoin", "/obj/effect/landmark", {
	name: "JoinLate",
});

// /obj/effect/landmark/latejoin/proc/Initialize  (code/game/objects/effects/landmarks.dm:184)  may sleep
rt.def("/obj/effect/landmark/latejoin/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modField(f, rt.gl("SSjob"), "latejoin_trackers", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11502, "/obj/effect/landmark/xeno_spawn", "/obj/effect/landmark", {
	name: "xeno_spawn",
});

// /obj/effect/landmark/xeno_spawn/proc/Initialize  (code/game/objects/effects/landmarks.dm:230)  may sleep
rt.def("/obj/effect/landmark/xeno_spawn/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("xeno_spawn", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11503, "/obj/effect/landmark/blobstart", "/obj/effect/landmark", {
	name: "blobstart",
});

// /obj/effect/landmark/blobstart/proc/Initialize  (code/game/objects/effects/landmarks.dm:239)  may sleep
rt.def("/obj/effect/landmark/blobstart/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("blobstart", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11504, "/obj/effect/landmark/secequipment", "/obj/effect/landmark", {
	name: "secequipment",
});

// /obj/effect/landmark/secequipment/proc/Initialize  (code/game/objects/effects/landmarks.dm:247)  may sleep
rt.def("/obj/effect/landmark/secequipment/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("secequipment", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11505, "/obj/effect/landmark/prisonwarp", "/obj/effect/landmark", {
	name: "prisonwarp",
});

// /obj/effect/landmark/prisonwarp/proc/Initialize  (code/game/objects/effects/landmarks.dm:255)  may sleep
rt.def("/obj/effect/landmark/prisonwarp/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("prisonwarp", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11506, "/obj/effect/landmark/ert_spawn", "/obj/effect/landmark", {
	name: "Emergencyresponseteam",
});

// /obj/effect/landmark/ert_spawn/proc/Initialize  (code/game/objects/effects/landmarks.dm:263)  may sleep
rt.def("/obj/effect/landmark/ert_spawn/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("emergencyresponseteamspawn", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11507, "/obj/effect/landmark/holding_facility", "/obj/effect/landmark", {
	name: "Holding Facility",
});

// /obj/effect/landmark/holding_facility/proc/Initialize  (code/game/objects/effects/landmarks.dm:271)  may sleep
rt.def("/obj/effect/landmark/holding_facility/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("holdingfacility", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11509, "/obj/effect/landmark/thunderdome/observe", "/obj/effect/landmark/thunderdome", {
	name: "tdomeobserve",
});

// /obj/effect/landmark/thunderdome/observe/proc/Initialize  (code/game/objects/effects/landmarks.dm:279)  may sleep
rt.def("/obj/effect/landmark/thunderdome/observe/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("tdomeobserve", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11510, "/obj/effect/landmark/thunderdome/one", "/obj/effect/landmark/thunderdome", {
	name: "tdome1",
});

// /obj/effect/landmark/thunderdome/one/proc/Initialize  (code/game/objects/effects/landmarks.dm:287)  may sleep
rt.def("/obj/effect/landmark/thunderdome/one/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("tdome1", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11511, "/obj/effect/landmark/thunderdome/two", "/obj/effect/landmark/thunderdome", {
	name: "tdome2",
});

// /obj/effect/landmark/thunderdome/two/proc/Initialize  (code/game/objects/effects/landmarks.dm:295)  may sleep
rt.def("/obj/effect/landmark/thunderdome/two/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("tdome2", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11512, "/obj/effect/landmark/thunderdome/admin", "/obj/effect/landmark/thunderdome", {
	name: "tdomeadmin",
});

// /obj/effect/landmark/thunderdome/admin/proc/Initialize  (code/game/objects/effects/landmarks.dm:303)  may sleep
rt.def("/obj/effect/landmark/thunderdome/admin/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("tdomeadmin", rt.sv(f, "loc"), add);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(11513, "/obj/effect/landmark/event_spawn", "/obj/effect/landmark", {
	name: "generic event spawn",
	icon_state: "x4",
});

// /obj/effect/landmark/event_spawn/proc/New  (code/game/objects/effects/landmarks.dm:314)  may sleep
rt.def("/obj/effect/landmark/event_spawn/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("generic_event_spawns", live(f.src), add);
	return f.dot;
}, true);

// /obj/effect/landmark/event_spawn/proc/Destroy  (code/game/objects/effects/landmarks.dm:318)  may sleep
rt.def("/obj/effect/landmark/event_spawn/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("generic_event_spawns", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11514, "/obj/effect/landmark/ruin", "/obj/effect/landmark", {
	ruin_template: null,
});

// /obj/effect/landmark/ruin/proc/New  (code/game/objects/effects/landmarks.dm:325)  may sleep
rt.def("/obj/effect/landmark/ruin/proc/New", function* New(f: Frame, loc: Value, my_ruin_template: Value) {
	f.vars = () => [loc, my_ruin_template];
	rt.setSv(f, "name", fmt("ruin_＀", [add(rt.len(f, rt.gl("ruin_landmarks")), 1)]));
	yield* g.callSuper(f, [live(loc)]);
	rt.setSv(f, "ruin_template", live(my_ruin_template));
	(rt.modGl("ruin_landmarks", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/effect/landmark/ruin/proc/Destroy  (code/game/objects/effects/landmarks.dm:331)  may sleep
rt.def("/obj/effect/landmark/ruin/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("ruin_landmarks", live(f.src), subtract));
	rt.setSv(f, "ruin_template", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);
