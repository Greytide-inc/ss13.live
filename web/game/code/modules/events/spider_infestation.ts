// Based on /tg/station's code/modules/events/spider_infestation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(322, "/datum/round_event/spider_infestation", "/datum/round_event", {
	spawncount: 1,
	announceWhen: 400,
});

// spider_infestation.dm:15
rt.def("/datum/round_event/spider_infestation/proc/setup", function setup(f: Frame) {
	this.announceWhen = rand(this.announceWhen, this.announceWhen + 50);
	this.spawncount = rand(5, 8);
	return f.dot;
});

// spider_infestation.dm:19
rt.def("/datum/round_event/spider_infestation/proc/announce", function* announce(f: Frame) {
	yield* priority_announce(`Unidentified lifesigns detected coming aboard ${station_name()}. Secure any exterior access, including ducting and ventilation.`, "Lifesign Alert", rt.rsc("sound/ai/aliens.ogg"));
	return f.dot;
}, true);

// spider_infestation.dm:23
rt.def("/datum/round_event/spider_infestation/proc/start", function* start(f: Frame) {
	let temp_vent: Value = null, temp_vent_parent: Value = null, vent: Value = null, spawn_type: Value = null;
	let vents: Value = list();
	for (temp_vent of each(rt.world(), T("/obj/machinery/atmospherics/components/unary/vent_pump"))) {
		if (temp_vent.loc.z == ZLEVEL_STATION && !temp_vent.welded) {
			if (rt.len(f, (temp_vent_parent = rt.index(temp_vent.parents, 1)).other_atmosmch) > 20) {
				vents += temp_vent;
			}
		}
	}
	while (this.spawncount >= 1 && rt.len(f, vents)) {
		vent = pick(vents);
		spawn_type = T("/obj/structure/spider/spiderling");
		if (prob(66)) {
			spawn_type = T("/obj/structure/spider/spiderling/nurse");
		}
		yield* spawn_atom_to_turf(spawn_type, vent, 1, 0);
		vents -= vent;
		this.spawncount--;
	}
	return f.dot;
}, true);
