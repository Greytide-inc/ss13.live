// Based on /tg/station's code/game/objects/effects/temporary_visuals/temporary_visual.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(11527, "/obj/effect/temp_visual", "/obj/effect", {
	duration: 10,
	randomdir: 1,
	timerid: null,
	anchored: 1,
	icon_state: "nothing",
	layer: 4.1,
	mouse_opacity: 0,
});

// temporary_visual.dm:12
rt.def("/obj/effect/temp_visual/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.randomdir) {
		yield* this.setDir(pick(GLOB.cardinal));
	}
	this.timerid = (yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), this.duration, 8));
	return f.dot;
}, true);

// temporary_visual.dm:19
rt.def("/obj/effect/temp_visual/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* deltimer(this.timerid);
	return f.dot;
}, true);

rt.type(11600, "/obj/effect/temp_visual/dir_setting", "/obj/effect/temp_visual", {
	randomdir: 0,
});

// temporary_visual.dm:36
rt.def("/obj/effect/temp_visual/dir_setting/proc/Initialize", function* Initialize(f: Frame, mapload: Value, set_dir: Value) {
	if (set_dir) {
		yield* this.setDir(set_dir);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
