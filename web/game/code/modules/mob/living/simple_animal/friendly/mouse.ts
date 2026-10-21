// From code/modules/mob/living/simple_animal/friendly/mouse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5085, "/mob/living/simple_animal/mouse", "/mob/living/simple_animal", {
	body_color: null,
	chew_probability: 1,
	icon_living: "mouse_gray",
	icon_dead: "mouse_gray_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "splats",
	pass_flags: 21,
	gold_core_spawnable: 2,
	name: "mouse",
	desc: "It's a nasty, ugly, evil, disease-ridden rodent.",
	icon_state: "mouse_gray",
	see_in_dark: 6,
	maxHealth: 5,
	health: 5,
	butcher_results: null,
	density: 0,
	ventcrawler: 2,
	mob_size: 0,
});

// /mob/living/simple_animal/mouse/proc/<init>  (code/modules/mob/living/simple_animal/friendly/mouse.dm:8)
rt.def("/mob/living/simple_animal/mouse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak", rt.list("Squeek!", "SQUEEK!", "Squeek?"));
	$0 = $0;
	rt.setSv(f, "speak_emote", rt.list("squeeks"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("squeeks."));
	rt.setSv(f, "emote_see", rt.list("runs in a circle.", "shakes."));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]));
	return f.dot;
});

// /mob/living/simple_animal/mouse/proc/Initialize  (code/modules/mob/living/simple_animal/friendly/mouse.dm:29)  may sleep
rt.def("/mob/living/simple_animal/mouse/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "body_color"))) {
		rt.setSv(f, "body_color", rt.op(f, "PickUnweighted", [1], [rt.list("brown", "gray", "white")]));
	}
	rt.setSv(f, "icon_state", fmt("mouse_＀", [rt.sv(f, "body_color")]));
	rt.setSv(f, "icon_living", fmt("mouse_＀", [rt.sv(f, "body_color")]));
	rt.setSv(f, "icon_dead", fmt("mouse_＀_dead", [rt.sv(f, "body_color")]));
	return f.dot;
}, true);

// /mob/living/simple_animal/mouse/proc/splat  (code/modules/mob/living/simple_animal/friendly/mouse.dm:38)  may sleep
rt.def("/mob/living/simple_animal/mouse/proc/splat", function* splat(f: Frame) {
	rt.setFv(f, "health", live(f.src), 0);
	rt.setFv(f, "icon_dead", live(f.src), fmt("mouse_＀_splat", [rt.sv(f, "body_color")]));
	yield* g.srcCall(f, "death");
	return f.dot;
}, true);

// /mob/living/simple_animal/mouse/proc/death  (code/modules/mob/living/simple_animal/friendly/mouse.dm:43)  may sleep
rt.def("/mob/living/simple_animal/mouse/proc/death", function* death(f: Frame, gibbed: Value, toast: Value) {
	let M: Value = null;
	f.vars = () => [gibbed, toast, M];
	if (!truthy(rt.sv(f, "ckey"))) {
		yield* g.callSuper(f, [1]);
		rt.setFv(f, "icon_state", (M = (yield* g.new_(f, T("/obj/item/trash/deadmouse"), [rt.fv(f, "loc", live(f.src))]))), rt.sv(f, "icon_dead"));
		rt.setFv(f, "name", live(M), rt.sv(f, "name"));
		if (truthy(live(toast))) {
			yield* g.callName(f, live(M), "add_atom_colour", ["#3A3A3A", 4]);
			rt.setFv(f, "desc", live(M), "It's toast.");
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.callSuper(f, [live(gibbed)]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/mouse/proc/Crossed  (code/modules/mob/living/simple_animal/friendly/mouse.dm:56)
rt.def("/mob/living/simple_animal/mouse/proc/Crossed", function Crossed(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "stat"))) {
			rt.call(f, P("/proc/to_chat"), null, [(M = live(f.args[0])), fmt("<span class='notice'>＀ Squeek!</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)])])]);
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/mousesqueek.ogg"), 100, 1]);
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["AM"] });

// /mob/living/simple_animal/mouse/proc/handle_automated_action  (code/modules/mob/living/simple_animal/friendly/mouse.dm:64)  may sleep
rt.def("/mob/living/simple_animal/mouse/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let F: Value = null, C: Value = null;
	f.vars = () => [F, C];
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "chew_probability")]))) return f.dot;
	if (!(truthy((rt.istype((F = rt.getStep(f, live(f.src), 0)), T("/turf/open/floor")) ? 1 : 0)) && !truthy(rt.fv(f, "intact", live(F))))) return f.dot;
	if (!(truthy((C = rt.locateIn(f, T("/obj/structure/cable"), live(F)))) && truthy(rt.op(f, "Prob", [], [15])))) return f.dot;
	if (truthy((yield* g.callName(f, live(C), "avail", [])))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ chews through the ＀. It's toast!</span>", [live(f.src), live(C)]));
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/sparks2.ogg"), 100, 1]);
		yield* g.callName(f, live(C), "deconstruct", []);
		yield* g.callSrc(f, "death", ["toast", 1], rt.Args.Named);
	} else {
		yield* g.callName(f, live(C), "deconstruct", []);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ chews through the ＀.</span>", [live(f.src), live(C)]));
	}
	return f.dot;
}, true, { waitfor: false });
