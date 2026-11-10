// Based on /tg/station's code/modules/events/vent_clog.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(324, "/datum/round_event/vent_clog", "/datum/round_event", {
	interval: 2,
	vents: null,
	gunk: null,
	announceWhen: 1,
	startWhen: 5,
	endWhen: 35,
});

// vent_clog.dm:11
rt.def("/datum/round_event/vent_clog/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.vents = list();
	this.gunk = list("water", "carbon", "flour", "radium", "toxin", "cleaner", "nutriment", "condensedcapsaicin", "mushroomhallucinogen", "lube", "plantbgone", "banana", "charcoal", "space_drugs", "morphine", "holywater", "ethanol", "hot_coco", "sacid");
	return f.dot;
});

// vent_clog.dm:16
rt.def("/datum/round_event/vent_clog/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("The scrubbers network is experiencing a backpressure surge. Some ejection of contents may occur.", "Atmospherics alert");
	return f.dot;
}, true);

// vent_clog.dm:20
rt.def("/datum/round_event/vent_clog/proc/setup", function setup(f: Frame) {
	let temp_vent: Value = null, temp_vent_parent: Value = null;
	this.endWhen = rand(25, 100);
	for (temp_vent of each(GLOB.machines, T("/obj/machinery/atmospherics/components/unary/vent_scrubber"))) {
		if (temp_vent.loc.z == ZLEVEL_STATION && !temp_vent.welded) {
			if (rt.len(f, (temp_vent_parent = rt.index(temp_vent.parents, 1)).other_atmosmch) > 20) {
				this.vents += temp_vent;
			}
		}
	}
	if (rt.len(f, this.vents)) return f.dot;
	return this.kill();
});

// vent_clog.dm:30
rt.def("/datum/round_event/vent_clog/proc/tick", function* tick(f: Frame) {
	let R: Value = null, smoke: Value = null;
	if (this.activeFor % this.interval != 0) return f.dot;
	let vent: Value = pick_n_take(this.vents);
	while (vent && vent.welded) {
		vent = pick_n_take(this.vents);
	}
	if (!(vent && vent.loc)) return f.dot;
	(R = (yield* new_(T("/datum/reagents"), 50))).my_atom = vent;
	yield* R.add_reagent(pick(this.gunk), 50);
	yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread/chem")))).set_up(R, 1, vent, { silent: 1 });
	playsound(vent.loc, rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3);
	yield* smoke.start();
	yield* qdel(R);
	let cockroaches: Value = prob(33) ? 3 : 0;
	while (cockroaches) {
		yield* new_(T("/mob/living/simple_animal/cockroach"), rt.getStep(f, vent, 0));
		cockroaches--;
	}
	return f.dot;
}, true);
