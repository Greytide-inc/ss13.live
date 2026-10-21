// From code/modules/zombie/organs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9536, "/obj/item/organ/zombie_infection", "/obj/item/organ", {
	old_species: rt.typePath("/datum/species/human"),
	living_transformation_time: 30,
	converts_living: 0,
	revive_time_min: 450,
	revive_time_max: 700,
	timer_id: null,
	zone: "head",
	slot: "zombie_infection",
	name: "festering ooze",
	desc: "A black web of pus and vicera.",
	icon_state: "blacktumor",
	origin_tech: "biotech=5",
});

// /obj/item/organ/zombie_infection/proc/Initialize  (code/modules/zombie/organs.dm:17)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.srcCall(f, "Insert", rt.sv(f, "loc"));
	}
	rt.modGl("zombie_infection_list", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/organ/zombie_infection/proc/Destroy  (code/modules/zombie/organs.dm:23)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("zombie_infection_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/organ/zombie_infection/proc/Insert  (code/modules/zombie/organs.dm:27)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/Insert", function* Insert(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/zombie_infection/proc/Remove  (code/modules/zombie/organs.dm:31)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/Remove", function* Remove(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if ((truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[0]), T("/datum/species/zombie")]))) && truthy(rt.sv(f, "old_species")))) {
		yield* g.callName(f, live(f.args[0]), "set_species", [rt.sv(f, "old_species")]);
	}
	if (!truthy(rt.sv(f, "timer_id"))) return f.dot;
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "timer_id")]);
	return f.dot;
}, true, { args: ["M", "special"] });

// /obj/item/organ/zombie_infection/proc/on_find  (code/modules/zombie/organs.dm:39)
rt.def("/obj/item/organ/zombie_infection/proc/on_find", function on_find(f: Frame, finder: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(finder), "<span class='warning'>Inside the head is a disgusting black web of pus and vicera, bound tightly around the brain like some biological harness.</span>"]);
	return f.dot;
});

// /obj/item/organ/zombie_infection/proc/process  (code/modules/zombie/organs.dm:44)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/process", function* process(f: Frame) {
	let revive_time: Value = null, flags: Value = null;
	f.vars = () => [revive_time, flags];
	if (!truthy(rt.sv(f, "owner"))) {
		return live(f.dot);
	}
	if (!truthy((rt.isIn(f, live(f.src), rt.fv(f, "internal_organs", rt.sv(f, "owner"))) ? 1 : 0))) {
		yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	}
	if (truthy(rt.sv(f, "timer_id"))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2) && !truthy(rt.sv(f, "converts_living")))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [rt.sv(f, "owner"), T("/datum/species/zombie")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='cultlarge'>You can feel your heart stopping, but something isn't right... life has not abandoned your broken form. You can only feel a deep and immutable hunger that not even death can stop, you will rise again!</span>"]);
	}
	revive_time = (yield* g.call(f, P("/proc/rand"), null, [rt.sv(f, "revive_time_min"), rt.sv(f, "revive_time_max")]));
	flags = 8;
	rt.setSv(f, "timer_id", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/organ/zombie_infection/proc/zombify")])), live(revive_time), live(flags)])));
	return f.dot;
}, true, { waitfor: false });

// /obj/item/organ/zombie_infection/proc/zombify  (code/modules/zombie/organs.dm:64)  may sleep
rt.def("/obj/item/organ/zombie_infection/proc/zombify", function* zombify(f: Frame) {
	let stand_up: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [stand_up, $0, $1, $2, $3];
	rt.setSv(f, "timer_id", null);
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [rt.sv(f, "owner"), T("/datum/species/zombie")])))) {
		rt.setSv(f, "old_species", rt.gv(f, "type", rt.gv(f, "species", rt.fv(f, "dna", rt.sv(f, "owner")))));
		yield* g.callName(f, rt.sv(f, "owner"), "set_species", [T("/datum/species/zombie/infectious")]);
	}
	if ((!truthy(rt.sv(f, "converts_living")) && !isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2))) {
		return live(f.dot);
	}
	stand_up = ((isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 2) ? 1 : 0) || (isEqual(rt.fv(f, "stat", rt.sv(f, "owner")), 1) ? 1 : 0));
	if (!truthy((yield* g.callName(f, rt.sv(f, "owner"), "revive", ["full_heal", 1], rt.Args.Named)))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "owner"), "grab_ghost", []);
	$0 = rt.sv(f, "owner");
	$1 = rt.sv(f, "owner");
	$2 = (yield* g.callName(f, rt.sv(f, "owner"), "p_they", []));
	if (truthy(live(stand_up))) {
		$3 = fmt(" stagger to ＀ feet and", [(yield* g.callName(f, rt.sv(f, "owner"), "p_their", []))]);
	} else {
		$3 = "";
	}
	yield* g.callName(f, $0, "visible_message", [fmt("<span class='danger'>＀ suddenly convulses, as ＀＀ gain a ravenous hunger in ＀ eyes!</span>", [$1, $2, $3, (yield* g.callName(f, rt.sv(f, "owner"), "p_their", []))]), "<span class='alien'>You HUNGER!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", rt.sv(f, "owner")), rt.rsc("sound/hallucinations/far_noise.ogg"), 50, 1]);
	yield* g.callName(f, rt.sv(f, "owner"), "do_jitter_animation", [rt.sv(f, "living_transformation_time")]);
	yield* g.callName(f, rt.sv(f, "owner"), "Stun", [rt.sv(f, "living_transformation_time")]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='alertalien'>You are now a zombie!</span>"]);
	return f.dot;
}, true);
