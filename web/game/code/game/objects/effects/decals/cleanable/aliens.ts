// From code/game/objects/effects/decals/cleanable/aliens.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/effect/decal/cleanable/xenoblood/proc/<init>  (code/game/objects/effects/decals/cleanable/aliens.dm:9)
rt.def("/obj/effect/decal/cleanable/xenoblood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xfloor1", "xfloor2", "xfloor3", "xfloor4", "xfloor5", "xfloor6", "xfloor7"));
	$0 = $0;
	rt.setSv(f, "viruses", rt.list());
	rt.setSv(f, "blood_DNA", rt.alist(f, ["UNKNOWN DNA", "X*"]));
	return f.dot;
});

// /obj/effect/decal/cleanable/xenoblood/proc/Destroy  (code/game/objects/effects/decals/cleanable/aliens.dm:15)  may sleep
rt.def("/obj/effect/decal/cleanable/xenoblood/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	D = null;
	rt.forList(f, 0, rt.sv(f, "viruses"), T("/datum/disease"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		yield* g.callName(f, live(D), "cure", [0]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "viruses", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
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

// /obj/effect/decal/cleanable/xenoblood/xgibs/proc/streak  (code/game/objects/effects/decals/cleanable/aliens.dm:34)  may sleep
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/proc/streak", function* streak(f: Frame, directions: Value) {
	let direction: Value = null, i: Value = null, b: Value = null, D: Value = null, ND: Value = null;
	let $e: any;
	f.vars = () => [directions, direction, i, b, D, ND, $e];
	direction = rt.op(f, "PickUnweighted", [1], [live(directions)]);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50]))) {
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		if (rt.gt(live(i), 0)) {
			b = (yield* g.new_(f, T("/obj/effect/decal/cleanable/xenoblood/xsplatter"), [rt.fv(f, "loc", live(f.src))]));
			D = null;
			rt.forList(f, 0, rt.fv(f, "viruses", live(f.src)), T("/datum/disease"));
			while (($e = rt.next(f, 0)) !== undefined) {
				D = $e;
				ND = (yield* g.callName(f, live(D), "Copy", [1]));
				rt.modField(f, live(b), "viruses", live(ND), add);
				rt.setFv(f, "holder", live(ND), live(b));
			}
			rt.endFor(f, 0);
		}
		if (!truthy((yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.getStep(f, live(f.src), live(direction)), 0])))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11731, "/obj/effect/decal/cleanable/xenoblood/xgibs/torso", "/obj/effect/decal/cleanable/xenoblood/xgibs", {
	random_icon_states: null,
});

// /obj/effect/decal/cleanable/xenoblood/xgibs/torso/proc/<init>  (code/game/objects/effects/decals/cleanable/aliens.dm:59)
rt.def("/obj/effect/decal/cleanable/xenoblood/xgibs/torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("xgibtorso"));
	return f.dot;
});

rt.type(11709, "/obj/effect/decal/cleanable/blood/xtracks", "/obj/effect/decal/cleanable/blood", {
	blood_DNA: null,
	icon_state: "xtracks",
	random_icon_states: null,
});

// /obj/effect/decal/cleanable/blood/xtracks/proc/<init>  (code/game/objects/effects/decals/cleanable/aliens.dm:76)
rt.def("/obj/effect/decal/cleanable/blood/xtracks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "blood_DNA", rt.alist(f, ["UNKNOWN DNA", "X*"]));
	$0 = $0;
	rt.setSv(f, "random_icon_states", null);
	return f.dot;
});
