// Based on /tg/station's code/modules/power/singularity/particle_accelerator/particle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12090, "/obj/effect/accelerated_particle", "/obj/effect", {
	movement_range: 10,
	energy: 10,
	speed: 1,
	anchored: 1,
	name: "Accelerated Particles",
	desc: "Small things moving very fast.",
	icon: rt.rsc("icons/obj/machines/particle_accelerator.dmi"),
	icon_state: "particle",
	density: 0,
});

// particle.dm:26
rt.def("/obj/effect/accelerated_particle/proc/New", function* New(f: Frame, loc: Value) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/accelerated_particle/proc/move"))), 1);
	return f.dot;
}, true);

// particle.dm:33
rt.def("/obj/effect/accelerated_particle/proc/Bump", function* Bump(f: Frame, A: Value) {
	let S: Value = null;
	if (!A) return f.dot;
	if (rt.istype(A, T("/mob/living"))) {
		yield* this.toxmob(A);
	} else if (rt.istype(A, T("/obj/machinery/the_singularitygen"))) {
		(S = A).energy += this.energy;
	} else {
		if (!rt.istype(A, T("/obj/singularity"))) return f.dot;
		(S = A).energy += this.energy;
	}
	return f.dot;
}, true);

// particle.dm:44
rt.def("/obj/effect/accelerated_particle/proc/Crossed", function* Crossed(f: Frame, A: Value) {
	if (!rt.istype(A, T("/mob/living"))) return f.dot;
	yield* this.toxmob(A);
	return f.dot;
}, true);

// particle.dm:49
rt.def("/obj/effect/accelerated_particle/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// particle.dm:52
rt.def("/obj/effect/accelerated_particle/proc/toxmob", function* toxmob(f: Frame, M: Value) {
	yield* M.rad_act(this.energy * 6);
	return f.dot;
}, true);

// particle.dm:55
rt.def("/obj/effect/accelerated_particle/proc/move", function* move(f: Frame) {
	if (!(yield* step(this, this.dir))) {
		yield* this.forceMove(rt.getStep(f, this, this.dir));
	}
	this.movement_range--;
	if (this.movement_range == 0) {
		yield* qdel(this);
	} else {
		yield* sleep(this.speed);
		yield* this.move();
	}
	return f.dot;
}, true);
