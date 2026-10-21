// From code/modules/events/vent_clog.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(324, "/datum/round_event/vent_clog", "/datum/round_event", {
	interval: 2,
	vents: null,
	gunk: null,
	announceWhen: 1,
	startWhen: 5,
	endWhen: 35,
});

// /datum/round_event/vent_clog/proc/<init>  (code/modules/events/vent_clog.dm:11)
rt.def("/datum/round_event/vent_clog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "vents", rt.list());
	rt.setSv(f, "gunk", rt.list("water", "carbon", "flour", "radium", "toxin", "cleaner", "nutriment", "condensedcapsaicin", "mushroomhallucinogen", "lube", "plantbgone", "banana", "charcoal", "space_drugs", "morphine", "holywater", "ethanol", "hot_coco", "sacid"));
	return f.dot;
});

// /datum/round_event/vent_clog/proc/announce  (code/modules/events/vent_clog.dm:16)  may sleep
rt.def("/datum/round_event/vent_clog/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["The scrubbers network is experiencing a backpressure surge. Some ejection of contents may occur.", "Atmospherics alert"]);
	return f.dot;
}, true);

// /datum/round_event/vent_clog/proc/setup  (code/modules/events/vent_clog.dm:20)
rt.def("/datum/round_event/vent_clog/proc/setup", function setup(f: Frame) {
	let temp_vent: Value = null, temp_vent_parent: Value = null;
	let $e: any;
	f.vars = () => [temp_vent, temp_vent_parent, $e];
	rt.setSv(f, "endWhen", rt.call(f, P("/proc/rand"), null, [25, 100]));
	temp_vent = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/atmospherics/components/unary/vent_scrubber"));
	while (($e = rt.next(f, 0)) !== undefined) {
		temp_vent = $e;
		if ((isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(temp_vent))), 2) && !truthy(rt.fv(f, "welded", live(temp_vent))))) {
			if (rt.gt(rt.getLen(f, rt.gv(f, "other_atmosmch", (temp_vent_parent = rt.index(rt.fv(f, "parents", live(temp_vent)), 1)))), 20)) {
				rt.modSrcVar(f, "vents", live(temp_vent), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "vents")))) return f.dot;
	return rt.callSrc(f, "kill", []);
});

// /datum/round_event/vent_clog/proc/tick  (code/modules/events/vent_clog.dm:30)  may sleep
rt.def("/datum/round_event/vent_clog/proc/tick", function* tick(f: Frame) {
	let vent: Value = null, R: Value = null, smoke: Value = null, cockroaches: Value = null;
	let $0: any;
	f.vars = () => [vent, R, smoke, cockroaches, $0];
	if (!isEqual(rt.modulus(rt.sv(f, "activeFor"), rt.sv(f, "interval")), 0)) return f.dot;
	vent = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "vents")]));
	while (truthy(live(vent)) && truthy(rt.fv(f, "welded", live(vent)))) {
		vent = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "vents")]));
	}
	if (!(truthy(live(vent)) && truthy(rt.fv(f, "loc", live(vent))))) return f.dot;
	rt.setFv(f, "my_atom", (R = (yield* g.new_(f, T("/datum/reagents"), [50]))), live(vent));
	yield* g.callName(f, live(R), "add_reagent", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "gunk")]), 50]);
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, live(R), null, 1, null, live(vent), "silent", 1], rt.Args.Named);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(vent)), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
	yield* g.callName(f, live(smoke), "start", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
	if (truthy(rt.op(f, "Prob", [], [33]))) {
		$0 = 3;
	} else {
		$0 = 0;
	}
	cockroaches = $0;
	while (truthy(live(cockroaches))) {
		yield* g.new_(f, T("/mob/living/simple_animal/cockroach"), [rt.getStep(f, live(vent), 0)]);
		cockroaches = rt.inc(live(cockroaches), -1);
	}
	return f.dot;
}, true);
