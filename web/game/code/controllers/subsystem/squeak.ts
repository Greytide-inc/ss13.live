// Based on /tg/station's code/controllers/subsystem/squeak.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(41, "/datum/controller/subsystem/squeak", "/datum/controller/subsystem", {
	exposed_wires: null,
	name: "Squeak",
	init_order: -40,
	flags: 2,
});

// squeak.dm:5
rt.def("/datum/controller/subsystem/squeak/proc/New", function* New(f: Frame) {
	if (GLOB.SSsqueak != this) {
		if (rt.istype(GLOB.SSsqueak, T("/datum/controller/subsystem/squeak"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSsqueak);
		}
		GLOB.SSsqueak = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// squeak.dm:10
rt.def("/datum/controller/subsystem/squeak/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.exposed_wires = list();
	return f.dot;
});

// squeak.dm:13
rt.def("/datum/controller/subsystem/squeak/proc/Initialize", function* Initialize(f: Frame, timeofday: Value) {
	yield* this.trigger_migration(GLOB.config.mice_roundstart);
	return f.dot;
}, true);

// squeak.dm:16
rt.def("/datum/controller/subsystem/squeak/proc/trigger_migration", function* trigger_migration(f: Frame, num_mice: Value) {
	let M: Value = null, proposed_turf: Value = null;
	num_mice ??= 10;
	if (!num_mice) {
		return f.dot;
	}
	this.find_exposed_wires();
	while (num_mice > 0 && rt.len(f, this.exposed_wires)) {
		proposed_turf = pick_n_take(this.exposed_wires);
		if (!M) {
			M = (yield* new_(T("/mob/living/simple_animal/mouse"), proposed_turf));
		} else {
			yield* M.forceMove(proposed_turf);
		}
		if (M.environment_is_safe()) {
			num_mice -= 1;
			M = null;
		}
	}
	return f.dot;
}, true);

// squeak.dm:34
rt.def("/datum/controller/subsystem/squeak/proc/find_exposed_wires", function find_exposed_wires(f: Frame) {
	let _T: Value = null;
	this.exposed_wires.Cut();
	let all_turfs: Value = block(rt.locate(1, 1, 1), rt.locate(rt.world().maxx, rt.world().maxy, 1));
	for (_T of each(all_turfs, T("/turf/open/floor/plating"))) {
		if (is_blocked_turf(_T)) {
			continue;
		}
		if (rt.locateIn(f, T("/obj/structure/cable"), _T)) {
			this.exposed_wires += _T;
		}
	}
	return f.dot;
});
