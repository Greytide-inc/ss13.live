// Based on /tg/station's code/modules/surgery/helpers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


// helpers.dm:2
rt.def("/proc/attempt_initiate_surgery", function* attempt_initiate_surgery(f: Frame, I: Value, M: Value, user: Value) {
	let C: Value = null, affecting: Value = null, current_surgery: Value = null, S: Value = null, all_surgeries: Value = null, available_surgeries: Value = null, S_6: Value = null, path: Value = null, _P: Value = null, S_7: Value = null, other: Value = null, procedure: Value = null;
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	let selected_zone: Value = user.zone_selected;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		affecting = (C = M).get_bodypart(check_zone(selected_zone));
	}
	if (!M.lying && !rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		return f.dot;
	}
	for (S of each(M.surgeries, T("/datum/surgery"))) {
		if (S.location == selected_zone) {
			current_surgery = S;
		}
	}
	if (!current_surgery) {
		all_surgeries = (yield* GLOB.surgeries_list.Copy());
		available_surgeries = list();
		for (S_6 of each(all_surgeries, T("/datum/surgery"))) {
			if (!S_6.possible_locs.Find(selected_zone)) {
				continue;
			}
			if (affecting) {
				if (!S_6.requires_bodypart) {
					continue;
				}
				if (S_6.requires_organic_bodypart && affecting.status == BODYPART_ROBOTIC) {
					continue;
				}
				if (S_6.requires_real_bodypart && affecting.is_pseudopart) {
					continue;
				}
			} else if (C && S_6.requires_bodypart) {
				continue;
			}
			if (!S_6.can_start(user, M)) {
				continue;
			}
			path = null;
			for (path of each(S_6.species)) {
				if (rt.op(f, "IsType", [], [M, path])) {
					rt.setAt(available_surgeries, S_6.name, S_6);
					break;
				}
			}
		}
		if ((_P = (yield* g.op(f, "Prompt", [1], [null, null, "Surgery", "Begin which procedure?", available_surgeries]))) && user && user.Adjacent(M) && rt.isIn(f, I, user)) {
			S_7 = rt.index(available_surgeries, _P);
			for (other of each(M.surgeries, T("/datum/surgery"))) {
				if (other.location == S_7.location) {
					return f.dot;
				}
			}
			if (C) {
				affecting = C.get_bodypart(check_zone(selected_zone));
			}
			if (affecting) {
				if (!S_7.requires_bodypart) {
					return f.dot;
				}
				if (S_7.requires_organic_bodypart && affecting.status == BODYPART_ROBOTIC) {
					return f.dot;
				}
			} else if (C && S_7.requires_bodypart) {
				return f.dot;
			}
			if (!S_7.can_start(user, M)) {
				return f.dot;
			}
			if (S_7.ignore_clothes || get_location_accessible(M, selected_zone)) {
				procedure = (yield* new_(S_7.type, M, selected_zone, affecting));
				user.visible_message(fmt("＀ drapes ＀ over ＀'s ＀ to prepare for ＇！.", [user, I, M, parse_zone(selected_zone), procedure.name]), fmt("<span class='notice'>You drape ＀ over ＀'s ＀ to prepare for ＇！.</span>", [I, M, parse_zone(selected_zone), procedure.name]));
				yield* add_logs(user, M, "operated", { addition: `Operation type: ${procedure.name}, location: ${selected_zone}` });
			} else {
				to_chat(user, `<span class='warning'>You need to expose ${M}'s ${parse_zone(selected_zone)} first!</span>`);
			}
		}
	} else if (!current_surgery.step_in_progress) {
		if (current_surgery.status == 1) {
			M.surgeries -= current_surgery;
			user.visible_message(`${user} removes the drapes from ${M}'s ${parse_zone(selected_zone)}.`, `<span class='notice'>You remove the drapes from ${M}'s ${parse_zone(selected_zone)}.</span>`);
			yield* qdel(current_surgery);
		} else if (rt.istype(user.get_inactive_held_item(), T("/obj/item/weapon/cautery")) && current_surgery.can_cancel) {
			M.surgeries -= current_surgery;
			user.visible_message(`${user} mends the incision and removes the drapes from ${M}'s ${parse_zone(selected_zone)}.`, `<span class='notice'>You mend the incision and remove the drapes from ${M}'s ${parse_zone(selected_zone)}.</span>`);
			yield* qdel(current_surgery);
		} else if (current_surgery.can_cancel) {
			to_chat(user, `<span class='warning'>You need to hold a cautery in inactive hand to stop ${M}'s surgery!</span>`);
		}
	}
	return 1;
}, true);

// helpers.dm:109
rt.def("/proc/get_location_accessible", function get_location_accessible(f: Frame, M: Value, location: Value) {
	let C: Value = null, I: Value = null, H: Value = null, I_5: Value = null;
	let $e: any;
	let covered_locations: Value = 0;
	let face_covered: Value = 0;
	let eyesmouth_covered: Value = 0;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		C = M;
		for (I of each(list(C.back, C.wear_mask, C.head), T("/obj/item/clothing"))) {
			(covered_locations = rt.modify(covered_locations, I.body_parts_covered, rt.bitOr));
			(face_covered = rt.modify(face_covered, I.flags_inv, rt.bitOr));
			(eyesmouth_covered = rt.modify(eyesmouth_covered, I.flags_cover, rt.bitOr));
		}
		if (rt.istype(C, T("/mob/living/carbon/human"))) {
			H = C;
			for (I_5 of each(list(H.wear_suit, H.w_uniform, H.shoes, H.belt, H.gloves, H.glasses, H.ears), T("/obj/item"))) {
				(covered_locations = rt.modify(covered_locations, I_5.body_parts_covered, rt.bitOr));
				(face_covered = rt.modify(face_covered, I_5.flags_inv, rt.bitOr));
				(eyesmouth_covered = rt.modify(eyesmouth_covered, I_5.flags_cover, rt.bitOr));
			}
		}
	}
	if (location === "head") {
		if (rt.bitAnd(covered_locations, HEAD)) {
			return 0;
		}
	} else if (location === "eyes") {
		if (rt.bitAnd(covered_locations, HEAD) || rt.bitAnd(face_covered, HIDEEYES) || rt.bitAnd(eyesmouth_covered, GLASSESCOVERSEYES)) {
			return 0;
		}
	} else if (location === "mouth") {
		if (rt.bitAnd(covered_locations, HEAD) || rt.bitAnd(face_covered, HIDEFACE) || rt.bitAnd(eyesmouth_covered, MASKCOVERSMOUTH) || rt.bitAnd(eyesmouth_covered, HEADCOVERSMOUTH)) {
			return 0;
		}
	} else if (location === "chest") {
		if (rt.bitAnd(covered_locations, CHEST)) {
			return 0;
		}
	} else if (location === "groin") {
		if (rt.bitAnd(covered_locations, GROIN)) {
			return 0;
		}
	} else if (location === "l_arm") {
		if (rt.bitAnd(covered_locations, ARM_LEFT)) {
			return 0;
		}
	} else if (location === "r_arm") {
		if (rt.bitAnd(covered_locations, ARM_RIGHT)) {
			return 0;
		}
	} else if (location === "l_leg") {
		if (rt.bitAnd(covered_locations, LEG_LEFT)) {
			return 0;
		}
	} else if (location === "r_leg") {
		if (rt.bitAnd(covered_locations, LEG_RIGHT)) {
			return 0;
		}
	} else if (location === "l_hand") {
		if (rt.bitAnd(covered_locations, HAND_LEFT)) {
			return 0;
		}
	} else if (location === "r_hand") {
		if (rt.bitAnd(covered_locations, HAND_RIGHT)) {
			return 0;
		}
	} else if (location === "l_foot") {
		if (rt.bitAnd(covered_locations, FOOT_LEFT)) {
			return 0;
		}
	} else if (location === "r_foot") {
		if (rt.bitAnd(covered_locations, FOOT_RIGHT)) {
			return 0;
		}
	}
	return 1;
});
