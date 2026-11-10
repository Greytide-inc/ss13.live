// Based on /tg/station's code/game/gamemodes/miniantags/abduction/machinery/pad.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10441, "/obj/machinery/abductor/pad", "/obj/machinery/abductor", {
	teleport_target: null,
	anchored: 1,
	name: "Alien Telepad",
	desc: "Use this to transport to and from the humans' habitat.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "alien-pad-idle",
});

// pad.dm:10
rt.def("/obj/machinery/abductor/pad/proc/Warp", function* Warp(f: Frame, target: Value) {
	if (target.buckled) return f.dot;
	yield* target.forceMove(rt.getStep(f, this, 0));
	return f.dot;
}, true);

// pad.dm:14
rt.def("/obj/machinery/abductor/pad/proc/Send", function* Send(f: Frame) {
	let target: Value = null;
	if (this.teleport_target === null) {
		this.teleport_target = rt.index(GLOB.teleportlocs, pick(GLOB.teleportlocs));
	}
	flick("alien-pad", this);
	for (target of each(this.loc, T("/mob/living"))) {
		yield* target.forceMove(this.teleport_target);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja"), rt.getStep(f, target, 0), target.dir);
		to_chat(target, "<span class='warning'>The instability of the warp leaves you disoriented!</span>");
		yield* target.Stun(60);
	}
	return f.dot;
}, true);

// pad.dm:24
rt.def("/obj/machinery/abductor/pad/proc/Retrieve", function* Retrieve(f: Frame, target: Value) {
	flick("alien-pad", this);
	yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja"), rt.getStep(f, target, 0), target.dir);
	yield* this.Warp(target);
	return f.dot;
}, true);

// pad.dm:29
rt.def("/obj/machinery/abductor/pad/proc/MobToLoc", function* MobToLoc(f: Frame, place: Value, target: Value) {
	yield* new_(T("/obj/effect/temp_visual/teleport_abductor"), place);
	yield* sleep(80);
	flick("alien-pad", this);
	yield* target.forceMove(place);
	yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja"), rt.getStep(f, target, 0), target.dir);
	return f.dot;
}, true);

// pad.dm:36
rt.def("/obj/machinery/abductor/pad/proc/PadToLoc", function* PadToLoc(f: Frame, place: Value) {
	let target: Value = null;
	yield* new_(T("/obj/effect/temp_visual/teleport_abductor"), place);
	yield* sleep(80);
	flick("alien-pad", this);
	for (target of each(rt.getStep(f, this, 0), T("/mob/living"))) {
		yield* target.forceMove(place);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja"), rt.getStep(f, target, 0), target.dir);
	}
	return f.dot;
}, true);

rt.type(11528, "/obj/effect/temp_visual/teleport_abductor", "/obj/effect/temp_visual", {
	name: "Huh",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "teleport",
	duration: 80,
});

// pad.dm:51
rt.def("/obj/effect/temp_visual/teleport_abductor/proc/Initialize", function* Initialize(f: Frame) {
	let S: Value = null;
	f.dot = (yield* parent_proc());
	yield* (S = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(10, 0, this.loc);
	yield* S.start();
	return f.dot;
}, true);
