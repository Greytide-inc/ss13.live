// From code/modules/mob/living/carbon/human/human_movement.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/movement_delay  (code/modules/mob/living/carbon/human/human_movement.dm:3)  may sleep
rt.def("/mob/living/carbon/human/proc/movement_delay", function* movement_delay(f: Frame) {
	f.dot = 0;
	f.dot = rt.modify(live(f.dot), (yield* g.callSuper(f, [], rt.Args.Same)), add);
	f.dot = rt.modify(live(f.dot), rt.fv(f, "human_delay", rt.gl("config")), add);
	f.dot = rt.modify(live(f.dot), (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "movement_delay", [live(f.src)])), add);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/slip  (code/modules/mob/living/carbon/human/human_movement.dm:8)  may sleep
rt.def("/mob/living/carbon/human/proc/slip", function* slip(f: Frame) {
	if (((truthy((rt.istype(rt.sv(f, "shoes"), T("/obj")) ? 1 : 0)) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "shoes")), 1024))) && !truthy(rt.bitAnd(live(f.args[2]), 4)))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["knockdown_amount", "O", "lube"] });

// /mob/living/carbon/human/proc/experience_pressure_difference  (code/modules/mob/living/carbon/human/human_movement.dm:13)
rt.def("/mob/living/carbon/human/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame) {
	rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/space_wind.ogg"), 50, 1]);
	if ((truthy(rt.sv(f, "shoes")) && truthy(rt.bitAnd(rt.fv(f, "flags", rt.sv(f, "shoes")), 1024)))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { waitfor: false });

// /mob/living/carbon/human/proc/mob_has_gravity  (code/modules/mob/living/carbon/human/human_movement.dm:19)
rt.def("/mob/living/carbon/human/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.callSrc(f, "mob_negates_gravity", []))) return f.dot;
	f.dot = 1;
	return f.dot;
});

// /mob/living/carbon/human/proc/mob_negates_gravity  (code/modules/mob/living/carbon/human/human_movement.dm:25)
rt.def("/mob/living/carbon/human/proc/mob_negates_gravity", function mob_negates_gravity(f: Frame) {
	return ((rt.sv(f, "shoes") && rt.callName(f, rt.sv(f, "shoes"), "negates_gravity", [])) || rt.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "negates_gravity", [live(f.src)]));
});

// /mob/living/carbon/human/proc/Move  (code/modules/mob/living/carbon/human/human_movement.dm:28)  may sleep
rt.def("/mob/living/carbon/human/proc/Move", function* Move(f: Frame) {
	let HM: Value = null, S: Value = null, _T: Value = null, oldFP: Value = null, FP: Value = null;
	let $e: any;
	f.vars = () => [HM, S, _T, oldFP, FP, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	HM = null;
	rt.forList(f, 0, rt.fv(f, "mutations", rt.sv(f, "dna")), T("/datum/mutation/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		HM = $e;
		yield* g.callName(f, live(HM), "on_move", [live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "shoes"))) return f.dot;
	if (!(!truthy(rt.sv(f, "lying")) && !truthy(rt.sv(f, "buckled")))) return f.dot;
	if (!isEqual(rt.sv(f, "loc"), live(f.args[0]))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "has_gravity", rt.sv(f, "loc"))))) {
		return live(f.dot);
	}
	S = rt.sv(f, "shoes");
	_T = rt.getStep(f, live(f.src), 0);
	if ((truthy(rt.fv(f, "bloody_shoes", live(S))) && truthy(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.fv(f, "blood_state", live(S)))))) {
		if ((truthy((oldFP = rt.locateIn(f, T("/obj/effect/decal/cleanable/blood/footprints"), live(_T)))) && isEqual(rt.fv(f, "blood_state", live(oldFP)), rt.fv(f, "blood_state", live(S))))) {
			return live(f.dot);
		} else {
			rt.setAt(rt.fv(f, "bloody_shoes", live(S)), rt.fv(f, "blood_state", live(S)), (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.fv(f, "blood_state", live(S))), 5)])));
			rt.setFv(f, "blood_state", (FP = (yield* g.new_(f, T("/obj/effect/decal/cleanable/blood/footprints"), [live(_T)]))), rt.fv(f, "blood_state", live(S)));
			(rt.modField(f, live(FP), "entered_dirs", rt.sv(f, "dir"), rt.bitOr));
			rt.setFv(f, "bloodiness", live(FP), rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.fv(f, "blood_state", live(S))));
			if ((truthy(rt.fv(f, "blood_DNA", live(S))) && truthy(rt.getLen(f, rt.fv(f, "blood_DNA", live(S)))))) {
				yield* g.callName(f, live(FP), "transfer_blood_dna", [rt.fv(f, "blood_DNA", live(S))]);
			}
			yield* g.callName(f, live(FP), "update_icon", []);
			yield* g.srcCall(f, "update_inv_shoes");
		}
	}
	yield* g.callName(f, live(S), "step_action", []);
	return f.dot;
}, true, { args: ["NewLoc", "direct"] });

// /mob/living/carbon/human/proc/Moved  (code/modules/mob/living/carbon/human/human_movement.dm:60)  may sleep
rt.def("/mob/living/carbon/human/proc/Moved", function* Moved(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(rt.sv(f, "buckled_mobs")) && truthy(rt.len(f, rt.sv(f, "buckled_mobs")))) && truthy(rt.sv(f, "riding_datum")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "on_vehicle_move", []);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/Process_Spacemove  (code/modules/mob/living/carbon/human/human_movement.dm:65)  may sleep
rt.def("/mob/living/carbon/human/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	return (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "space_move", [live(f.src)]));
}, true, { args: ["movement_dir"] });
