// Based on /tg/station's code/controllers/subsystem/assets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(14, "/datum/controller/subsystem/assets", "/datum/controller/subsystem", {
	cache: null,
	name: "Assets",
	init_order: -3,
	flags: 2,
});

// assets.dm:1
rt.def("/datum/controller/subsystem/assets/proc/New", function* New(f: Frame) {
	if (GLOB.SSassets != this) {
		if (rt.istype(GLOB.SSassets, T("/datum/controller/subsystem/assets"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSassets);
		}
		GLOB.SSassets = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// assets.dm:5
rt.def("/datum/controller/subsystem/assets/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cache = list();
	return f.dot;
});

// assets.dm:8
rt.def("/datum/controller/subsystem/assets/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	let type: Value = null, A: Value = null, C: Value = null;
	for (type of each(typesof(T("/datum/asset")) - list(T("/datum/asset"), T("/datum/asset/simple")))) {
		yield* (A = (yield* new_(type))).register();
	}
	for (C of each(GLOB.clients, T("/client"))) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/getFilesSlow"), C, this.cache, 0)), 10);
	}
	yield* parent_proc();
	return f.dot;
}, true);
