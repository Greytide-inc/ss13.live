// From code/modules/surgery/helpers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/attempt_initiate_surgery  (code/modules/surgery/helpers.dm:2)  may sleep
rt.def("/proc/attempt_initiate_surgery", function* attempt_initiate_surgery(f: Frame, I: Value, M: Value, user: Value) {
	let C: Value = null, affecting: Value = null, selected_zone: Value = null, current_surgery: Value = null, S: Value = null, all_surgeries: Value = null, available_surgeries: Value = null, S_6: Value = null, path: Value = null, _P: Value = null, S_7: Value = null, other: Value = null, procedure: Value = null;
	let $e: any;
	f.vars = () => [I, M, user, C, affecting, selected_zone, current_surgery, S, all_surgeries, available_surgeries, S_6, path, _P, S_7, other, procedure, $e];
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	C = null;
	affecting = null;
	selected_zone = rt.fv(f, "zone_selected", live(user));
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		affecting = (yield* g.callName(f, (C = live(M)), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [live(selected_zone)]))]));
	}
	if ((!truthy(rt.fv(f, "lying", live(M))) && !truthy((rt.istype(live(M), T("/mob/living/simple_animal/slime")) ? 1 : 0)))) {
		return live(f.dot);
	}
	current_surgery = null;
	S = null;
	rt.forList(f, 0, rt.fv(f, "surgeries", live(M)), T("/datum/surgery"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.fv(f, "location", live(S)), live(selected_zone))) {
			current_surgery = live(S);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(current_surgery))) {
		all_surgeries = (yield* g.callName(f, rt.gl("surgeries_list"), "Copy", []));
		available_surgeries = rt.list();
		S_6 = null;
		rt.forList(f, 0, live(all_surgeries), T("/datum/surgery"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S_6 = $e;
			if (!truthy((yield* g.callName(f, rt.fv(f, "possible_locs", live(S_6)), "Find", [live(selected_zone)])))) {
				continue;
			}
			if (truthy(live(affecting))) {
				if (!truthy(rt.fv(f, "requires_bodypart", live(S_6)))) {
					continue;
				}
				if ((truthy(rt.fv(f, "requires_organic_bodypart", live(S_6))) && isEqual(rt.fv(f, "status", live(affecting)), 2))) {
					continue;
				}
				if ((truthy(rt.fv(f, "requires_real_bodypart", live(S_6))) && truthy(rt.fv(f, "is_pseudopart", live(affecting))))) {
					continue;
				}
			} else {
				if ((truthy(live(C)) && truthy(rt.fv(f, "requires_bodypart", live(S_6))))) {
					continue;
				}
			}
			if (!truthy((yield* g.callName(f, live(S_6), "can_start", [live(user), live(M)])))) {
				continue;
			}
			path = null;
			rt.forList(f, 1, rt.fv(f, "species", live(S_6)));
			while (($e = rt.next(f, 1)) !== undefined) {
				path = $e;
				if (truthy(rt.op(f, "IsType", [], [live(M), live(path)]))) {
					rt.setAt(live(available_surgeries), rt.fv(f, "name", live(S_6)), live(S_6));
					break;
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
		if ((((truthy((_P = (yield* g.op(f, "Prompt", [1], [null, null, "Surgery", "Begin which procedure?", live(available_surgeries)])))) && truthy(live(user))) && truthy((yield* g.callName(f, live(user), "Adjacent", [live(M)])))) && truthy((rt.isIn(f, live(I), live(user)) ? 1 : 0)))) {
			S_7 = rt.index(live(available_surgeries), live(_P));
			other = null;
			rt.forList(f, 0, rt.fv(f, "surgeries", live(M)), T("/datum/surgery"));
			while (($e = rt.next(f, 0)) !== undefined) {
				other = $e;
				if (isEqual(rt.fv(f, "location", live(other)), rt.fv(f, "location", live(S_7)))) {
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			if (truthy(live(C))) {
				affecting = (yield* g.callName(f, live(C), "get_bodypart", [(yield* g.call(f, P("/proc/check_zone"), null, [live(selected_zone)]))]));
			}
			if (truthy(live(affecting))) {
				if (!truthy(rt.fv(f, "requires_bodypart", live(S_7)))) {
					return live(f.dot);
				}
				if ((truthy(rt.fv(f, "requires_organic_bodypart", live(S_7))) && isEqual(rt.fv(f, "status", live(affecting)), 2))) {
					return live(f.dot);
				}
			} else {
				if ((truthy(live(C)) && truthy(rt.fv(f, "requires_bodypart", live(S_7))))) {
					return live(f.dot);
				}
			}
			if (!truthy((yield* g.callName(f, live(S_7), "can_start", [live(user), live(M)])))) {
				return live(f.dot);
			}
			if ((truthy(rt.fv(f, "ignore_clothes", live(S_7))) || truthy((yield* g.call(f, P("/proc/get_location_accessible"), null, [live(M), live(selected_zone)]))))) {
				procedure = (yield* g.new_(f, rt.fv(f, "type", live(S_7)), [live(M), live(selected_zone), live(affecting)]));
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ drapes ＀ over ＀'s ＀ to prepare for ＇！.", [live(user), live(I), live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)])), rt.fv(f, "name", live(procedure))]), fmt("<span class='notice'>You drape ＀ over ＀'s ＀ to prepare for ＇！.</span>", [live(I), live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)])), rt.fv(f, "name", live(procedure))])]);
				yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(M), null, "operated", "addition", fmt("Operation type: ＀, location: ＀", [rt.fv(f, "name", live(procedure)), live(selected_zone)])], rt.Args.Named);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to expose ＀'s ＀ first!</span>", [live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)]))])]);
			}
		}
	} else {
		if (!truthy(rt.fv(f, "step_in_progress", live(current_surgery)))) {
			if (isEqual(rt.fv(f, "status", live(current_surgery)), 1)) {
				(rt.modField(f, live(M), "surgeries", live(current_surgery), subtract));
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ removes the drapes from ＀'s ＀.", [live(user), live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)]))]), fmt("<span class='notice'>You remove the drapes from ＀'s ＀.</span>", [live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)]))])]);
				yield* g.call(f, P("/proc/qdel"), null, [live(current_surgery)]);
			} else {
				if ((truthy((rt.istype((yield* g.callName(f, live(user), "get_inactive_held_item", [])), T("/obj/item/weapon/cautery")) ? 1 : 0)) && truthy(rt.fv(f, "can_cancel", live(current_surgery))))) {
					(rt.modField(f, live(M), "surgeries", live(current_surgery), subtract));
					yield* g.callName(f, live(user), "visible_message", [fmt("＀ mends the incision and removes the drapes from ＀'s ＀.", [live(user), live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)]))]), fmt("<span class='notice'>You mend the incision and remove the drapes from ＀'s ＀.</span>", [live(M), (yield* g.call(f, P("/proc/parse_zone"), null, [live(selected_zone)]))])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(current_surgery)]);
				} else {
					if (truthy(rt.fv(f, "can_cancel", live(current_surgery)))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need to hold a cautery in inactive hand to stop ＀'s surgery!</span>", [live(M)])]);
					}
				}
			}
		}
	}
	return 1;
}, true);

// /proc/get_location_modifier  (code/modules/surgery/helpers.dm:94)
rt.def("/proc/get_location_modifier", function get_location_modifier(f: Frame, M: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, live(M), 0);
	if (truthy(rt.locateIn(f, T("/obj/structure/table/optable"), live(_T)))) {
		return 1;
	} else {
		if (truthy(rt.locateIn(f, T("/obj/structure/table"), live(_T)))) {
			return 0.800000011920929;
		} else {
			if (truthy(rt.locateIn(f, T("/obj/structure/bed"), live(_T)))) {
				return 0.699999988079071;
			} else {
				return 0.5;
			}
		}
	}
	return f.dot;
});

// /proc/get_location_accessible  (code/modules/surgery/helpers.dm:109)
rt.def("/proc/get_location_accessible", function get_location_accessible(f: Frame, M: Value, location: Value) {
	let covered_locations: Value = null, face_covered: Value = null, eyesmouth_covered: Value = null, C: Value = null, I: Value = null, H: Value = null, I_5: Value = null;
	let $0: any, $e: any;
	f.vars = () => [covered_locations, face_covered, eyesmouth_covered, C, I, H, I_5, $0, $e];
	covered_locations = 0;
	face_covered = 0;
	eyesmouth_covered = 0;
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		C = live(M);
		I = null;
		rt.forList(f, 0, rt.list(rt.fv(f, "back", live(C)), rt.fv(f, "wear_mask", live(C)), rt.fv(f, "head", live(C))), T("/obj/item/clothing"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			(covered_locations = rt.modify(live(covered_locations), rt.fv(f, "body_parts_covered", live(I)), rt.bitOr));
			(face_covered = rt.modify(live(face_covered), rt.fv(f, "flags_inv", live(I)), rt.bitOr));
			(eyesmouth_covered = rt.modify(live(eyesmouth_covered), rt.fv(f, "flags_cover", live(I)), rt.bitOr));
		}
		rt.endFor(f, 0);
		if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
			H = live(C);
			I_5 = null;
			rt.forList(f, 0, rt.list(rt.fv(f, "wear_suit", live(H)), rt.fv(f, "w_uniform", live(H)), rt.fv(f, "shoes", live(H)), rt.fv(f, "belt", live(H)), rt.fv(f, "gloves", live(H)), rt.fv(f, "glasses", live(H)), rt.fv(f, "ears", live(H))), T("/obj/item"));
			while (($e = rt.next(f, 0)) !== undefined) {
				I_5 = $e;
				(covered_locations = rt.modify(live(covered_locations), rt.fv(f, "body_parts_covered", live(I_5)), rt.bitOr));
				(face_covered = rt.modify(live(face_covered), rt.fv(f, "flags_inv", live(I_5)), rt.bitOr));
				(eyesmouth_covered = rt.modify(live(eyesmouth_covered), rt.fv(f, "flags_cover", live(I_5)), rt.bitOr));
			}
			rt.endFor(f, 0);
		}
	}
	$0 = live(location);
	if ($0 === "head") {
		if (truthy(rt.bitAnd(live(covered_locations), 1))) {
			return 0;
		}
	} else if ($0 === "eyes") {
		if (((truthy(rt.bitAnd(live(covered_locations), 1)) || truthy(rt.bitAnd(live(face_covered), 64))) || truthy(rt.bitAnd(live(eyesmouth_covered), 1)))) {
			return 0;
		}
	} else if ($0 === "mouth") {
		if ((((truthy(rt.bitAnd(live(covered_locations), 1)) || truthy(rt.bitAnd(live(face_covered), 128))) || truthy(rt.bitAnd(live(eyesmouth_covered), 8))) || truthy(rt.bitAnd(live(eyesmouth_covered), 16)))) {
			return 0;
		}
	} else if ($0 === "chest") {
		if (truthy(rt.bitAnd(live(covered_locations), 2))) {
			return 0;
		}
	} else if ($0 === "groin") {
		if (truthy(rt.bitAnd(live(covered_locations), 4))) {
			return 0;
		}
	} else if ($0 === "l_arm") {
		if (truthy(rt.bitAnd(live(covered_locations), 128))) {
			return 0;
		}
	} else if ($0 === "r_arm") {
		if (truthy(rt.bitAnd(live(covered_locations), 256))) {
			return 0;
		}
	} else if ($0 === "l_leg") {
		if (truthy(rt.bitAnd(live(covered_locations), 8))) {
			return 0;
		}
	} else if ($0 === "r_leg") {
		if (truthy(rt.bitAnd(live(covered_locations), 16))) {
			return 0;
		}
	} else if ($0 === "l_hand") {
		if (truthy(rt.bitAnd(live(covered_locations), 512))) {
			return 0;
		}
	} else if ($0 === "r_hand") {
		if (truthy(rt.bitAnd(live(covered_locations), 1024))) {
			return 0;
		}
	} else if ($0 === "l_foot") {
		if (truthy(rt.bitAnd(live(covered_locations), 32))) {
			return 0;
		}
	} else if ($0 === "r_foot") {
		if (truthy(rt.bitAnd(live(covered_locations), 64))) {
			return 0;
		}
	}
	return 1;
});
