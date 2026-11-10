// Based on /tg/station's code/game/objects/effects/decals/cleanable/aliens.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11725, "/obj/effect/decal/cleanable/xenoblood", "/obj/effect/decal/cleanable", {
	viruses: null,
	random_icon_states: null,
	blood_DNA: null,
	bloodiness: 100,
	blood_state: "xeno",
	name: "xeno blood",
	desc: "It's green and acidic. It looks like... <i>blood?</i>",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "xfloor1",
});

// aliens.dm:9
rt.def("/obj/effect/decal/cleanable/xenoblood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("xfloor1", "xfloor2", "xfloor3", "xfloor4", "xfloor5", "xfloor6", "xfloor7");

	this.viruses = list();
	this.blood_DNA = rt.alist(f, ["UNKNOWN DNA", "X*"]);
	return f.dot;
});

// aliens.dm:15
rt.def("/obj/effect/decal/cleanable/xenoblood/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		yield* D.cure(0);
	}
	this.viruses = null;
	return (yield* parent_proc());
}, true);

rt.type(11727, "/obj/effect/decal/cleanable/xenoblood/xgibs", "/obj/effect/decal/cleanable/xenoblood", {
	random_icon_states: null,
	mergeable_decal: 0,
	name: "xeno gibs",
	desc: "Gnarly...",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "xgib1",
	layer: 2.5,
});

// aliens.dm:34
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/proc/streak", function* streak(f: Frame, directions: Value) {
	let b: Value = null, D: Value = null, ND: Value = null;
	let direction: Value = pick(directions);
	let i: Value = 0;
	while (i < rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50])) {
		yield* sleep(2);
		if (i > 0) {
			b = (yield* new_(T("/obj/effect/decal/cleanable/xenoblood/xsplatter"), this.loc));
			D = null;
			for (D of each(this.viruses, T("/datum/disease"))) {
				ND = (yield* D.Copy(1));
				b.viruses += ND;
				ND.holder = b;
			}
		}
		if (!(yield* step_to(this, rt.getStep(f, this, direction), 0))) {
			break;
		}
		i++;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11731, "/obj/effect/decal/cleanable/xenoblood/xgibs/torso", "/obj/effect/decal/cleanable/xenoblood/xgibs", {
	random_icon_states: null,
});

// aliens.dm:59
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/torso/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("xgibtorso");
	return f.dot;
});

rt.type(11709, "/obj/effect/decal/cleanable/blood/xtracks", "/obj/effect/decal/cleanable/blood", {
	blood_DNA: null,
	icon_state: "xtracks",
	random_icon_states: null,
});

// aliens.dm:76
rt.def("/obj/effect/decal/cleanable/blood/xtracks/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.blood_DNA = rt.alist(f, ["UNKNOWN DNA", "X*"]);

	this.random_icon_states = null;
	return f.dot;
});
