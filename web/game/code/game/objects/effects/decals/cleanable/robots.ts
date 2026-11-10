// Based on /tg/station's code/game/objects/effects/decals/cleanable/robots.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// robots.dm:16
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/streak", function* streak(f: Frame, directions: Value) {
	let s: Value = null;
	let direction: Value = pick(directions);
	let i: Value = 0;
	while (i < rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50])) {
		yield* sleep(2);
		if (i > 0) {
			if (prob(40)) {
				yield* new_(T("/obj/effect/decal/cleanable/oil/streak"), this.loc);
			} else if (prob(10)) {
				yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, this);
				yield* s.start();
			}
		}
		if (!(yield* step_to(this, rt.getStep(f, this, direction), 0))) {
			break;
		}
		i++;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11761, "/obj/effect/decal/cleanable/oil", "/obj/effect/decal/cleanable", {
	viruses: null,
	random_icon_states: null,
	blood_state: "oil",
	bloodiness: 100,
	name: "motor oil",
	desc: "It's black and greasy. Looks like Beepsky made another mess.",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "floor1",
});

// robots.dm:46
rt.def("/obj/effect/decal/cleanable/oil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.viruses = list();
	this.random_icon_states = list("floor1", "floor2", "floor3", "floor4", "floor5", "floor6", "floor7");
	return f.dot;
});

// robots.dm:52
rt.def("/obj/effect/decal/cleanable/oil/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("oil", 30);
	return f.dot;
}, true);

// robots.dm:56
rt.def("/obj/effect/decal/cleanable/oil/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		yield* D.cure(0);
	}
	this.viruses = null;
	return (yield* parent_proc());
}, true);
