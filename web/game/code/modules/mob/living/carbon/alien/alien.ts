// From code/modules/mob/living/carbon/alien/alien.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4822, "/mob/living/carbon/alien", "/mob/living/carbon", {
	nightvision: 1,
	wear_id: null,
	has_fine_manipulation: 0,
	move_delay_add: 0,
	heat_protection: 0.5,
	leaping: 0,
	verb_say: "hisses",
	initial_language_holder: rt.typePath("/datum/language_holder/alien"),
	name: "alien",
	voice_name: "alien",
	icon: rt.rsc("icons/mob/alien.dmi"),
	gender: "female",
	dna: null,
	faction: null,
	ventcrawler: 2,
	sight: 4,
	see_in_dark: 4,
	bubble_icon: "alien",
	status_flags: 12,
	unique_name: 1,
	type_of_meat: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/xeno"),
	gib_type: rt.typePath("/obj/effect/decal/cleanable/xenoblood/xgibs"),
}, { global: { alien_name_regex: 1042 } });

// /mob/living/carbon/alien/proc/<init>  (code/modules/mob/living/carbon/alien/alien.dm:12)
rt.def("/mob/living/carbon/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("alien"));
	return f.dot;
});

// /mob/living/carbon/alien/proc/Initialize  (code/modules/mob/living/carbon/alien/alien.dm:36)  may sleep
rt.def("/mob/living/carbon/alien/proc/Initialize", function* Initialize(f: Frame) {
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/mob_sleep"), add);
	rt.modSrcVar(f, "verbs", P("/mob/living/proc/lay_down"), add);
	yield* g.srcCall(f, "create_bodyparts");
	yield* g.srcCall(f, "create_internal_organs");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/create_internal_organs  (code/modules/mob/living/carbon/alien/alien.dm:46)  may sleep
rt.def("/mob/living/carbon/alien/proc/create_internal_organs", function* create_internal_organs(f: Frame) {
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/brain/alien"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/alien/hivenode"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/tongue/alien"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/eyes/night_vision/alien"), [])), add);
	rt.modSrcVar(f, "internal_organs", (yield* g.new_(f, T("/obj/item/organ/ears"), [])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/handle_environment  (code/modules/mob/living/carbon/alien/alien.dm:57)  may sleep
rt.def("/mob/living/carbon/alien/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let loc_temp: Value = null, thermal_protection: Value = null;
	let $0: any;
	f.vars = () => [environment, loc_temp, thermal_protection, $0];
	if (!truthy(live(environment))) {
		return live(f.dot);
	}
	loc_temp = (yield* g.srcCall(f, "get_temperature", live(environment)));
	if (!truthy(rt.sv(f, "on_fire"))) {
		if (rt.gt(live(loc_temp), rt.sv(f, "bodytemperature"))) {
			if (rt.lt((thermal_protection = rt.sv(f, "heat_protection")), 1)) {
				rt.modSrcVar(f, "bodytemperature", multiply(subtract(1, live(thermal_protection)), divide(subtract(live(loc_temp), rt.sv(f, "bodytemperature")), 6)), add);
			}
		} else {
			rt.modSrcVar(f, "bodytemperature", multiply(1, divide(subtract(live(loc_temp), rt.sv(f, "bodytemperature")), 6)), add);
		}
	}
	if (rt.gt(rt.sv(f, "bodytemperature"), 360.1499938964844)) {
		yield* g.srcCall(f, "throw_alert", "alien_fire", T("/obj/screen/alert/alien_fire"));
		$0 = rt.sv(f, "bodytemperature");
		if (rt.inRange($0, 360, 400)) {
			yield* g.srcCall(f, "apply_damage", 2, "fire");
		} else if (rt.inRange($0, 400, 460)) {
			yield* g.srcCall(f, "apply_damage", 3, "fire");
		} else if (rt.inRange($0, 460, 9.999999848243207e+30)) {
			if (truthy(rt.sv(f, "on_fire"))) {
				yield* g.srcCall(f, "apply_damage", 8, "fire");
			} else {
				yield* g.srcCall(f, "apply_damage", 3, "fire");
			}
		}
	} else {
		yield* g.srcCall(f, "clear_alert", "alien_fire");
	}
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/Stat  (code/modules/mob/living/carbon/alien/alien.dm:97)  may sleep
rt.def("/mob/living/carbon/alien/proc/Stat", function* Stat(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Intent: ＀", [rt.sv(f, "a_intent")])]);
	return f.dot;
}, true);

// /mob/living/carbon/alien/proc/getTrail  (code/modules/mob/living/carbon/alien/alien.dm:103)
rt.def("/mob/living/carbon/alien/proc/getTrail", function getTrail(f: Frame) {
	if (rt.lt(rt.callSrc(f, "getBruteLoss", []), 200)) {
		return rt.op(f, "PickUnweighted", [1], [rt.list("xltrails_1", "xltrails2")]);
	}
	return rt.op(f, "PickUnweighted", [1], [rt.list("xttrails_1", "xttrails2")]);
});

// /mob/living/carbon/alien/proc/AddInfectionImages  (code/modules/mob/living/carbon/alien/alien.dm:113)
rt.def("/mob/living/carbon/alien/proc/AddInfectionImages", function AddInfectionImages(f: Frame) {
	let C: Value = null, A: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [C, A, I, $e];
	if (truthy(rt.sv(f, "client"))) {
		C = null;
		rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(C)), 32768))) {
				if (truthy((A = rt.callName(f, live(C), "getorgan", [T("/obj/item/organ/body_egg/alien_embryo")])))) {
					I = rt.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/alien.dmi"), "loc", live(C), "icon_state", fmt("infected＀", [rt.fv(f, "stage", live(A))])], rt.Args.Named);
					rt.modField(f, rt.sv(f, "client"), "images", live(I), add);
				}
			}
		}
		rt.endFor(f, 0);
	}
	return live(f.dot);
});

// /mob/living/carbon/alien/proc/RemoveInfectionImages  (code/modules/mob/living/carbon/alien/alien.dm:128)  may sleep
rt.def("/mob/living/carbon/alien/proc/RemoveInfectionImages", function* RemoveInfectionImages(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "client"))) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "images", rt.sv(f, "client")), T("/image"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy((yield* g.call(f, P("/proc/dd_hasprefix_case"), null, [rt.fv(f, "icon_state", live(I)), "infected"])))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
			}
		}
		rt.endFor(f, 0);
	}
	return live(f.dot);
}, true);

// /mob/living/carbon/alien/proc/get_standard_pixel_y_offset  (code/modules/mob/living/carbon/alien/alien.dm:137)
rt.def("/mob/living/carbon/alien/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	return rt.initial(f, live(f.src), "pixel_y");
});

// /mob/living/carbon/alien/proc/alien_evolve  (code/modules/mob/living/carbon/alien/alien.dm:140)  may sleep
rt.def("/mob/living/carbon/alien/proc/alien_evolve", function* alien_evolve(f: Frame, new_xeno: Value) {
	f.vars = () => [new_xeno];
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='noticealien'>You begin to evolve!</span>"]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='alertalien'>＀ begins to twist and contort!</span>", [live(f.src)]));
	yield* g.callName(f, live(new_xeno), "setDir", [rt.sv(f, "dir")]);
	if (!truthy((yield* g.callName(f, rt.gl("alien_name_regex"), "Find", [rt.sv(f, "name")])))) {
		rt.setFv(f, "name", live(new_xeno), rt.sv(f, "name"));
		rt.setFv(f, "real_name", live(new_xeno), rt.sv(f, "real_name"));
	}
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(new_xeno)]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
