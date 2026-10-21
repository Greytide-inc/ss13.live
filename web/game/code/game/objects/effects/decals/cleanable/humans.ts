// From code/game/objects/effects/decals/cleanable/humans.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11707, "/obj/effect/decal/cleanable/blood", "/obj/effect/decal/cleanable", {
	viruses: null,
	blood_DNA: null,
	name: "blood",
	desc: "It's red and gooey. Perhaps it's the chef's cooking?",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "floor1",
	random_icon_states: null,
	blood_state: "blood",
	bloodiness: 100,
});

// /obj/effect/decal/cleanable/blood/proc/<init>  (code/game/objects/effects/decals/cleanable/humans.dm:7)
rt.def("/obj/effect/decal/cleanable/blood/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "viruses", rt.list());
	$0 = $0;
	rt.setSv(f, "blood_DNA", rt.list());
	rt.setSv(f, "random_icon_states", rt.list("floor1", "floor2", "floor3", "floor4", "floor5", "floor6", "floor7"));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/proc/Destroy  (code/game/objects/effects/decals/cleanable/humans.dm:13)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/proc/Destroy", function* Destroy(f: Frame) {
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

// /obj/effect/decal/cleanable/blood/proc/replace_decal  (code/game/objects/effects/decals/cleanable/humans.dm:19)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/proc/replace_decal", function* replace_decal(f: Frame) {
	if (truthy(rt.fv(f, "blood_DNA", live(f.args[0])))) {
		(rt.modSrcVar(f, "blood_DNA", (yield* g.callName(f, rt.fv(f, "blood_DNA", live(f.args[0])), "Copy", [])), rt.bitOr));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

rt.type(11710, "/obj/effect/decal/cleanable/blood/old", "/obj/effect/decal/cleanable/blood", {
	name: "dried blood",
	desc: "Looks like it's been here a while.  Eew.",
	bloodiness: 0,
});

// /obj/effect/decal/cleanable/blood/old/proc/Initialize  (code/game/objects/effects/decals/cleanable/humans.dm:29)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modSrcVar(f, "icon_state", "-old", add);
	rt.setAt(rt.sv(f, "blood_DNA"), "Non-human DNA", "A+");
	return f.dot;
}, true);

rt.type(11712, "/obj/effect/decal/cleanable/blood/tracks", "/obj/effect/decal/cleanable/blood", {
	icon_state: "tracks",
	desc: "They look like tracks left by wheels.",
	random_icon_states: null,
});

// /obj/effect/decal/cleanable/blood/tracks/proc/<init>  (code/game/objects/effects/decals/cleanable/humans.dm:39)
rt.def("/obj/effect/decal/cleanable/blood/tracks/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", null);
	return f.dot;
});

rt.type(11736, "/obj/effect/decal/cleanable/trail_holder", "/obj/effect/decal/cleanable", {
	existing_dirs: null,
	random_icon_states: null,
	blood_DNA: null,
	name: "blood",
	icon_state: "ltrails_1",
	desc: "Your instincts say you shouldn't be following these.",
});

// /obj/effect/decal/cleanable/trail_holder/proc/<init>  (code/game/objects/effects/decals/cleanable/humans.dm:46)
rt.def("/obj/effect/decal/cleanable/trail_holder/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", null);
	$0 = $0;
	rt.setSv(f, "existing_dirs", rt.list());
	$0 = $0;
	rt.setSv(f, "blood_DNA", rt.list());
	return f.dot;
});

rt.type(11713, "/obj/effect/decal/cleanable/blood/gibs", "/obj/effect/decal/cleanable/blood", {
	name: "gibs",
	desc: "They look bloody and gruesome.",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "gibbl5",
	layer: 2.5,
	random_icon_states: null,
	mergeable_decal: 0,
});

// /obj/effect/decal/cleanable/blood/gibs/proc/Initialize  (code/game/objects/effects/decals/cleanable/humans.dm:64)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["liquidgibs", 5]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/blood/gibs/proc/streak  (code/game/objects/effects/decals/cleanable/humans.dm:72)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/streak", function* streak(f: Frame, directions: Value) {
	let direction: Value = null, i: Value = null, b: Value = null, D: Value = null, ND: Value = null;
	let $e: any;
	f.vars = () => [directions, direction, i, b, D, ND, $e];
	direction = rt.op(f, "PickUnweighted", [1], [live(directions)]);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50]))) {
		yield* g.call(f, P("/proc/sleep"), null, [2]);
		if (rt.gt(live(i), 0)) {
			b = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/splatter"), [rt.fv(f, "loc", live(f.src))]));
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

rt.type(11717, "/obj/effect/decal/cleanable/blood/gibs/torso", "/obj/effect/decal/cleanable/blood/gibs", {
	random_icon_states: null,
});

// /obj/effect/decal/cleanable/blood/gibs/torso/proc/<init>  (code/game/objects/effects/decals/cleanable/humans.dm:94)
rt.def("/obj/effect/decal/cleanable/blood/gibs/torso/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list("gibtorso"));
	return f.dot;
});

rt.type(11720, "/obj/effect/decal/cleanable/blood/gibs/old", "/obj/effect/decal/cleanable/blood/gibs", {
	name: "old rotting gibs",
	desc: "Space Jesus, why didn't anyone clean this up?  It smells terrible.",
	bloodiness: 0,
});

// /obj/effect/decal/cleanable/blood/gibs/old/proc/Initialize  (code/game/objects/effects/decals/cleanable/humans.dm:108)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/gibs/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8]));
	rt.modSrcVar(f, "icon_state", "-old", add);
	rt.setAt(rt.sv(f, "blood_DNA"), "Non-human DNA", "A+");
	return f.dot;
}, true);

rt.type(11723, "/obj/effect/decal/cleanable/blood/footprints", "/obj/effect/decal/cleanable/blood", {
	entered_dirs: 0,
	exited_dirs: 0,
	shoe_types: null,
	name: "footprints",
	icon: rt.rsc("icons/effects/footprints.dmi"),
	icon_state: "nothingwhatsoever",
	desc: "WHOSE FOOTPRINTS ARE THESE?",
	random_icon_states: null,
	blood_state: "blood",
});

// /obj/effect/decal/cleanable/blood/footprints/proc/<init>  (code/game/objects/effects/decals/cleanable/humans.dm:137)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "shoe_types", rt.list());
	$0 = $0;
	rt.setSv(f, "random_icon_states", null);
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/footprints/proc/Crossed  (code/game/objects/effects/decals/cleanable/humans.dm:140)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/Crossed", function Crossed(f: Frame, O: Value) {
	let H: Value = null, S: Value = null;
	f.vars = () => [H, S];
	if (truthy((rt.istype(live(O), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(O);
		if ((truthy((S = rt.fv(f, "shoes", live(H)))) && truthy(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state"))))) {
			rt.setAt(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state"), rt.call(f, P("/proc/max"), null, [subtract(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state")), 5), 0]));
			(rt.modSrcVar(f, "entered_dirs", rt.fv(f, "dir", live(H)), rt.bitOr));
			(rt.modSrcVar(f, "shoe_types", rt.gv(f, "type", rt.fv(f, "shoes", live(H))), rt.bitOr));
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/footprints/proc/Uncrossed  (code/game/objects/effects/decals/cleanable/humans.dm:150)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/Uncrossed", function Uncrossed(f: Frame, O: Value) {
	let H: Value = null, S: Value = null;
	f.vars = () => [H, S];
	if (truthy((rt.istype(live(O), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(O);
		if ((truthy((S = rt.fv(f, "shoes", live(H)))) && truthy(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state"))))) {
			rt.setAt(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state"), rt.call(f, P("/proc/max"), null, [subtract(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state")), 5), 0]));
			(rt.modSrcVar(f, "exited_dirs", rt.fv(f, "dir", live(H)), rt.bitOr));
			(rt.modSrcVar(f, "shoe_types", rt.gv(f, "type", rt.fv(f, "shoes", live(H))), rt.bitOr));
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/footprints/proc/update_icon  (code/game/objects/effects/decals/cleanable/humans.dm:160)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/update_icon", function update_icon(f: Frame) {
	let Ddir: Value = null, bloodstep_overlay: Value = null;
	let $e: any;
	f.vars = () => [Ddir, bloodstep_overlay, $e];
	rt.callSrc(f, "cut_overlays", []);
	Ddir = null;
	rt.forList(f, 0, rt.gl("cardinal"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Ddir = $e;
		if (truthy(rt.bitAnd(rt.sv(f, "entered_dirs"), live(Ddir)))) {
			if (!truthy((bloodstep_overlay = rt.index(rt.gl("bloody_footprints_cache"), fmt("entered-＀-＀", [rt.sv(f, "blood_state"), live(Ddir)]))))) {
				rt.setAt(rt.gl("bloody_footprints_cache"), fmt("entered-＀-＀", [rt.sv(f, "blood_state"), live(Ddir)]), (bloodstep_overlay = rt.call(f, P("/proc/image"), null, [null, rt.sv(f, "icon"), null, fmt("＀1", [rt.sv(f, "blood_state")]), "dir", live(Ddir)], rt.Args.Named)));
			}
			rt.callSrc(f, "add_overlay", [live(bloodstep_overlay)]);
		}
		if (truthy(rt.bitAnd(rt.sv(f, "exited_dirs"), live(Ddir)))) {
			if (!truthy((bloodstep_overlay = rt.index(rt.gl("bloody_footprints_cache"), fmt("exited-＀-＀", [rt.sv(f, "blood_state"), live(Ddir)]))))) {
				rt.setAt(rt.gl("bloody_footprints_cache"), fmt("exited-＀-＀", [rt.sv(f, "blood_state"), live(Ddir)]), (bloodstep_overlay = rt.call(f, P("/proc/image"), null, [null, rt.sv(f, "icon"), null, fmt("＀2", [rt.sv(f, "blood_state")]), "dir", live(Ddir)], rt.Args.Named)));
			}
			rt.callSrc(f, "add_overlay", [live(bloodstep_overlay)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "alpha", add(150, rt.sv(f, "bloodiness")));
	return f.dot;
});

// /obj/effect/decal/cleanable/blood/footprints/proc/examine  (code/game/objects/effects/decals/cleanable/humans.dm:178)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/examine", function examine(f: Frame) {
	let shoe: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [shoe, S, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.len(f, rt.sv(f, "shoe_types")))) {
		f.dot = rt.modify(live(f.dot), "You recognise the footprints as belonging to:\n", add);
		shoe = null;
		rt.forList(f, 0, rt.sv(f, "shoe_types"));
		while (($e = rt.next(f, 0)) !== undefined) {
			shoe = $e;
			f.dot = rt.modify(live(f.dot), fmt("some <B>＀</B> ＀\n", [rt.initial(f, (S = live(shoe)), "name"), rt.call(f, P("/proc/bicon"), null, [rt.initial(f, live(S), "icon")])]), add);
		}
		rt.endFor(f, 0);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(f.dot)]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/decal/cleanable/blood/footprints/proc/replace_decal  (code/game/objects/effects/decals/cleanable/humans.dm:188)  may sleep
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/replace_decal", function* replace_decal(f: Frame) {
	if (!isEqual(rt.sv(f, "blood_state"), rt.fv(f, "blood_state", live(f.args[0])))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C"] });

// /obj/effect/decal/cleanable/blood/footprints/proc/can_bloodcrawl_in  (code/game/objects/effects/decals/cleanable/humans.dm:193)
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	if ((!isEqual(rt.sv(f, "blood_state"), "oil") && !isEqual(rt.sv(f, "blood_state"), "no blood whatsoever"))) {
		return 1;
	}
	return 0;
});
