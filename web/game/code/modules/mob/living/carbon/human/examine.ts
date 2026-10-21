// From code/modules/mob/living/carbon/human/examine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/examine  (code/modules/mob/living/carbon/human/examine.dm:3)
rt.def("/mob/living/carbon/human/proc/examine", function examine(f: Frame, user: Value) {
	let t_He: Value = null, t_His: Value = null, t_his: Value = null, t_him: Value = null, t_has: Value = null, t_is: Value = null, msg: Value = null, obscured: Value = null, skipface: Value = null, accessory_msg: Value = null, U: Value = null, I: Value = null, hand_number: Value = null, appears_dead: Value = null, foundghost: Value = null, G: Value = null, temp: Value = null, missing: Value = null, X: Value = null, BP: Value = null, I_14: Value = null, l_limbs_missing: Value = null, r_limbs_missing: Value = null, t: Value = null, i: Value = null, auto: Value = null, dodebug: Value = null, interestdebug: Value = null, H: Value = null, CIH: Value = null, perpname: Value = null, R: Value = null, cyberimp_detect: Value = null, CI: Value = null, health_r: Value = null, criminal: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [t_He, t_His, t_his, t_him, t_has, t_is, msg, obscured, skipface, accessory_msg, U, I, hand_number, appears_dead, foundghost, G, temp, missing, X, BP, I_14, l_limbs_missing, r_limbs_missing, t, i, auto, dodebug, interestdebug, H, CIH, perpname, R, cyberimp_detect, CI, health_r, criminal, $0, $1, $2, $3, $e];
	t_He = rt.callSrc(f, "p_they", [1]);
	t_His = rt.callSrc(f, "p_their", [1]);
	t_his = rt.callSrc(f, "p_their", []);
	t_him = rt.callSrc(f, "p_them", []);
	t_has = rt.callSrc(f, "p_have", []);
	t_is = rt.callSrc(f, "p_are", []);
	msg = fmt("<span class='info'>*---------*\nThis is <EM>＀</EM>!\n", [rt.fv(f, "name", live(f.src))]);
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy(rt.sv(f, "w_uniform")) && !truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)))) {
		accessory_msg = null;
		if (truthy((rt.istype(rt.sv(f, "w_uniform"), T("/obj/item/clothing/under")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "attached_accessory", (U = rt.sv(f, "w_uniform"))))) {
				accessory_msg = rt.modify(live(accessory_msg), fmt(" with ＀ ＇！", [rt.call(f, P("/proc/bicon"), null, [rt.fv(f, "attached_accessory", live(U))]), rt.fv(f, "attached_accessory", live(U))]), add);
			}
		}
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "w_uniform")))) {
			$0 = live(t_He);
			$1 = live(t_is);
			$2 = rt.sv(f, "w_uniform");
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "w_uniform")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ wearing ６＂ ＀ blood-stained ＀＀!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "w_uniform")), live(accessory_msg)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！＀.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "w_uniform")]), rt.sv(f, "w_uniform"), live(accessory_msg)]), add);
		}
	}
	if (truthy(rt.sv(f, "head"))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "head")))) {
			$0 = live(t_He);
			$1 = live(t_is);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "head")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "head")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ wearing ＀ ＀ blood-stained ＀ on ＀ head!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "head")), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ on ＀ head.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "head")]), rt.sv(f, "head"), live(t_his)]), add);
		}
	}
	if (truthy(rt.sv(f, "wear_suit"))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "wear_suit")))) {
			$0 = live(t_He);
			$1 = live(t_is);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_suit")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "wear_suit")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ wearing ＀ ＀ blood-stained ＀!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "wear_suit"))]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_suit")]), rt.sv(f, "wear_suit")]), add);
		}
		if (truthy(rt.sv(f, "s_store"))) {
			if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "s_store")))) {
				$0 = live(t_He);
				$1 = live(t_is);
				$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "s_store")]);
				if (isEqual(rt.fv(f, "gender", rt.sv(f, "s_store")), "plural")) {
					$3 = "some";
				} else {
					$3 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ carrying ＀ ＀ blood-stained ＀ on ＀ ＀!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "s_store")), live(t_his), rt.fv(f, "name", rt.sv(f, "wear_suit"))]), add);
			} else {
				msg = rt.modify(live(msg), fmt("＀ ＀ carrying ＀ ＇！ on ＀ ＀.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "s_store")]), rt.sv(f, "s_store"), live(t_his), rt.fv(f, "name", rt.sv(f, "wear_suit"))]), add);
			}
		}
	}
	if (truthy(rt.sv(f, "back"))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "back")))) {
			$0 = live(t_He);
			$1 = live(t_has);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "back")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "back")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ ＀ blood-stained ＀ on ＀ back.</span>\n", [$0, $1, $2, $3, rt.sv(f, "back"), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ on ＀ back.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "back")]), rt.sv(f, "back"), live(t_his)]), add);
		}
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "held_items"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(I)), 128))) {
			if (truthy(rt.fv(f, "blood_DNA", live(I)))) {
				$0 = live(t_He);
				$1 = live(t_is);
				$2 = rt.call(f, P("/proc/bicon"), null, [live(I)]);
				if (isEqual(rt.fv(f, "gender", live(I)), "plural")) {
					$3 = "some";
				} else {
					$3 = "a";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ holding ＀ ＀ blood-stained ＀ in ＀ ＀!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", live(I)), live(t_his), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			} else {
				msg = rt.modify(live(msg), fmt("＀ ＀ holding ＀ ＇！ in ＀ ＀.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [live(I)]), live(I), live(t_his), rt.callSrc(f, "get_held_index_name", [rt.callSrc(f, "get_held_index_of_item", [live(I)])])]), add);
			}
		}
	}
	rt.endFor(f, 0);
	if ((truthy(rt.sv(f, "gloves")) && !truthy((rt.isIn(f, 9, live(obscured)) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "gloves")))) {
			$0 = live(t_He);
			$1 = live(t_has);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "gloves")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "gloves")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ ＀ blood-stained ＀ on ＀ hands!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "gloves")), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ on ＀ hands.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "gloves")]), rt.sv(f, "gloves"), live(t_his)]), add);
		}
	} else {
		if (truthy(rt.sv(f, "blood_DNA"))) {
			if (truthy((hand_number = rt.callSrc(f, "get_num_arms", [])))) {
				$0 = live(t_He);
				$1 = live(t_has);
				if (rt.gt(live(hand_number), 1)) {
					$2 = "";
				} else {
					$2 = "a";
				}
				if (rt.gt(live(hand_number), 1)) {
					$3 = "s";
				} else {
					$3 = "";
				}
				msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ blood-stained hand＀!</span>\n", [$0, $1, $2, $3]), add);
			}
		}
	}
	if (truthy(rt.sv(f, "handcuffed"))) {
		if (truthy((rt.istype(rt.sv(f, "handcuffed"), T("/obj/item/weapon/restraints/handcuffs/cable")) ? 1 : 0))) {
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ restrained with cable!</span>\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "handcuffed")])]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ handcuffed!</span>\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "handcuffed")])]), add);
		}
	}
	if (truthy(rt.sv(f, "belt"))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "belt")))) {
			$0 = live(t_He);
			$1 = live(t_has);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "belt")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "belt")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ ＀ blood-stained ＀ about ＀ waist!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "belt")), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ about ＀ waist.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "belt")]), rt.sv(f, "belt"), live(t_his)]), add);
		}
	}
	if ((truthy(rt.sv(f, "shoes")) && !truthy((rt.isIn(f, 12, live(obscured)) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "shoes")))) {
			$0 = live(t_He);
			$1 = live(t_is);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "shoes")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "shoes")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ wearing ＀ ＀ blood-stained ＀ on ＀ feet!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "shoes")), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ on ＀ feet.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "shoes")]), rt.sv(f, "shoes"), live(t_his)]), add);
		}
	}
	if ((truthy(rt.sv(f, "wear_mask")) && !truthy((rt.isIn(f, 2, live(obscured)) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "wear_mask")))) {
			$0 = live(t_He);
			$1 = live(t_has);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_mask")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "wear_mask")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ ＀ blood-stained ＀ on ＀ face!</span>\n", [$0, $1, $2, $3, rt.fv(f, "name", rt.sv(f, "wear_mask")), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ on ＀ face.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_mask")]), rt.sv(f, "wear_mask"), live(t_his)]), add);
		}
	}
	if ((truthy(rt.sv(f, "wear_neck")) && !truthy((rt.isIn(f, 10, live(obscured)) ? 1 : 0)))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！ around ＀ neck.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_neck")]), rt.fv(f, "wear_neck", live(f.src)), live(t_his)]), add);
	}
	if ((truthy(rt.sv(f, "glasses")) && !truthy((rt.isIn(f, 8, live(obscured)) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "blood_DNA", rt.sv(f, "glasses")))) {
			$0 = live(t_He);
			$1 = live(t_has);
			$2 = rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "glasses")]);
			if (isEqual(rt.fv(f, "gender", rt.sv(f, "glasses")), "plural")) {
				$3 = "some";
			} else {
				$3 = "a";
			}
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ ＀ ＀ blood-stained ＀ covering ＀ eyes!</span>\n", [$0, $1, $2, $3, rt.sv(f, "glasses"), live(t_his)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ covering ＀ eyes.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "glasses")]), rt.sv(f, "glasses"), live(t_his)]), add);
		}
	}
	if ((truthy(rt.sv(f, "ears")) && !truthy((rt.isIn(f, 7, live(obscured)) ? 1 : 0)))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ ＀ ＇！ on ＀ ears.\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "ears")]), rt.sv(f, "ears"), live(t_his)]), add);
	}
	if (truthy(rt.sv(f, "wear_id"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ wearing ＀ ＇！.\n", [live(t_He), live(t_is), rt.call(f, P("/proc/bicon"), null, [rt.sv(f, "wear_id")]), rt.sv(f, "wear_id")]), add);
	}
	$0 = rt.sv(f, "jitteriness");
	if (rt.inRange($0, 300, 9.999999848243207e+30)) {
		msg = rt.modify(live(msg), fmt("<span class='warning'><B>＀ ＀ convulsing violently!</B></span>\n", [live(t_He), live(t_is)]), add);
	} else if (rt.inRange($0, 200, 300)) {
		msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ extremely jittery.</span>\n", [live(t_He), live(t_is)]), add);
	} else if (rt.inRange($0, 100, 200)) {
		msg = rt.modify(live(msg), fmt("<span class='warning'>＀ ＀ twitching ever so slightly.</span>\n", [live(t_He), live(t_is)]), add);
	}
	appears_dead = 0;
	if ((isEqual(rt.sv(f, "stat"), 2) || truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8192)))) {
		appears_dead = 1;
		if (truthy(rt.sv(f, "suiciding"))) {
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ appear＀ to have committed suicide... there is no hope of recovery.</span>\n", [live(t_He), rt.callSrc(f, "p_s", [])]), add);
		}
		if (truthy(rt.sv(f, "hellbound"))) {
			msg = rt.modify(live(msg), fmt("<span class='warning'>＀ soul seems to have been ripped out of ＀ body.  Revival is impossible.</span>\n", [live(t_His), live(t_his)]), add);
		}
		msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ ＀ limp and unresponsive; there are no signs of life", [live(t_He), live(t_is)]), add);
		if (truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")]))) {
			if (!truthy(rt.sv(f, "key"))) {
				foundghost = 0;
				if (truthy(rt.sv(f, "mind"))) {
					G = null;
					rt.forList(f, 0, rt.gl("player_list"), T("/mob/dead/observer"));
					while (($e = rt.next(f, 0)) !== undefined) {
						G = $e;
						if (isEqual(rt.fv(f, "mind", live(G)), rt.sv(f, "mind"))) {
							foundghost = 1;
							if (isEqual(rt.fv(f, "can_reenter_corpse", live(G)), 0)) {
								foundghost = 0;
							}
							break;
						}
					}
					rt.endFor(f, 0);
				}
				if (!truthy(live(foundghost))) {
					msg = rt.modify(live(msg), fmt(" and ＀ soul has departed", [live(t_his)]), add);
				}
			}
		}
		msg = rt.modify(live(msg), "...</span>\n", add);
	}
	if ((truthy(rt.callSrc(f, "get_bodypart", ["head"])) && !truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")])))) {
		msg = rt.modify(live(msg), fmt("<span class='deadsay'>It appears that ＀ brain is missing...</span>\n", [live(t_his)]), add);
	}
	temp = rt.callSrc(f, "getBruteLoss", []);
	msg = rt.modify(live(msg), "<span class='warning'>", add);
	missing = rt.list("head", "chest", "l_arm", "r_arm", "l_leg", "r_leg");
	X = null;
	rt.forList(f, 0, rt.sv(f, "bodyparts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		(missing = rt.modify(live(missing), rt.gv(f, "body_zone", (BP = live(X))), subtract));
		I_14 = null;
		rt.forList(f, 1, rt.fv(f, "embedded_objects", live(BP)), T("/obj/item"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I_14 = $e;
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ ＇！ ＀ embedded in ＀ ＀!</B>\n", [live(t_He), live(t_has), rt.call(f, P("/proc/bicon"), null, [live(I_14)]), live(I_14), live(t_his), rt.fv(f, "name", live(BP))]), add);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	l_limbs_missing = 0;
	r_limbs_missing = 0;
	t = null;
	rt.forList(f, 0, live(missing));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (isEqual(live(t), "head")) {
			msg = rt.modify(live(msg), fmt("<span class='deadsay'><B>＀ ＀ is missing!</B><span class='warning'>\n", [live(t_His), rt.call(f, P("/proc/parse_zone"), null, [live(t)])]), add);
			continue;
		}
		if ((isEqual(live(t), "l_arm") || isEqual(live(t), "l_leg"))) {
			l_limbs_missing = rt.inc(live(l_limbs_missing), 1);
		} else {
			if ((isEqual(live(t), "r_arm") || isEqual(live(t), "r_leg"))) {
				r_limbs_missing = rt.inc(live(r_limbs_missing), 1);
			}
		}
		msg = rt.modify(live(msg), fmt("<B>＀ ＀ is missing!</B>\n", [rt.call(f, P("/proc/capitalize"), null, [live(t_his)]), rt.call(f, P("/proc/parse_zone"), null, [live(t)])]), add);
	}
	rt.endFor(f, 0);
	if ((rt.ge(live(l_limbs_missing), 2) && isEqual(live(r_limbs_missing), 0))) {
		msg = rt.modify(live(msg), fmt("＀ looks all right now.\n", [live(t_He)]), add);
	} else {
		if ((isEqual(live(l_limbs_missing), 0) && rt.ge(live(r_limbs_missing), 2))) {
			msg = rt.modify(live(msg), fmt("＀ really keeps to the left.\n", [live(t_He)]), add);
		} else {
			if ((rt.ge(live(l_limbs_missing), 2) && rt.ge(live(r_limbs_missing), 2))) {
				msg = rt.modify(live(msg), fmt("＀ doesn't seem all there.\n", [live(t_He)]), add);
			}
		}
	}
	if (truthy(live(temp))) {
		if (rt.lt(live(temp), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ minor bruising.\n", [live(t_He), live(t_has)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ severe bruising!</B>\n", [live(t_He), live(t_has)]), add);
		}
	}
	if (truthy((temp = rt.callSrc(f, "getFireLoss", [])))) {
		if (rt.lt(live(temp), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ minor burns.\n", [live(t_He), live(t_has)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ severe burns!</B>\n", [live(t_He), live(t_has)]), add);
		}
	}
	if (truthy((temp = rt.callSrc(f, "getCloneLoss", [])))) {
		if (rt.lt(live(temp), 30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ minor cellular damage.\n", [live(t_He), live(t_has)]), add);
		} else {
			msg = rt.modify(live(msg), fmt("<B>＀ ＀ severe cellular damage.</B>\n", [live(t_He), live(t_has)]), add);
		}
	}
	if (rt.gt(rt.sv(f, "fire_stacks"), 0)) {
		msg = rt.modify(live(msg), fmt("＀ ＀ covered in something flammable.\n", [live(t_He), live(t_is)]), add);
	}
	if (rt.lt(rt.sv(f, "fire_stacks"), 0)) {
		msg = rt.modify(live(msg), fmt("＀ looks a little soaked.\n", [live(t_He)]), add);
	}
	if ((truthy(rt.sv(f, "pulledby")) && truthy(rt.fv(f, "grab_state", rt.sv(f, "pulledby"))))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ restrained by ＀'s grip.\n", [live(t_He), live(t_is), rt.sv(f, "pulledby")]), add);
	}
	if (rt.lt(rt.sv(f, "nutrition"), 100)) {
		msg = rt.modify(live(msg), fmt("＀ ＀ severely malnourished.\n", [live(t_He), live(t_is)]), add);
	} else {
		if (rt.ge(rt.sv(f, "nutrition"), 600)) {
			if (rt.lt(rt.fv(f, "nutrition", live(user)), 100)) {
				msg = rt.modify(live(msg), fmt("＀ ＀ plump and delicious looking - Like a fat little piggy. A tasty piggy.\n", [live(t_He), live(t_is)]), add);
			} else {
				msg = rt.modify(live(msg), fmt("＀ ＀ quite chubby.\n", [live(t_He), live(t_is)]), add);
			}
		}
	}
	if (rt.lt(rt.sv(f, "blood_volume"), 475)) {
		msg = rt.modify(live(msg), fmt("＀ ＀ pale skin.\n", [live(t_He), live(t_has)]), add);
	}
	if (truthy(rt.sv(f, "bleedsuppress"))) {
		msg = rt.modify(live(msg), fmt("＀ ＀ bandaged with something.\n", [live(t_He), live(t_is)]), add);
	} else {
		if (truthy(rt.sv(f, "bleed_rate"))) {
			if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["heparin"]))) {
				msg = rt.modify(live(msg), fmt("<b>＀ ＀ bleeding uncontrollably!</b>\n", [live(t_He), live(t_is)]), add);
			} else {
				msg = rt.modify(live(msg), fmt("<B>＀ ＀ bleeding!</B>\n", [live(t_He), live(t_is)]), add);
			}
		}
	}
	if (truthy(rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["teslium"]))) {
		msg = rt.modify(live(msg), fmt("＀ is emitting a gentle blue glow!\n", [live(t_He)]), add);
	}
	if (truthy((rt.istype(rt.sv(f, "stun_absorption"), T("/list")) ? 1 : 0))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "stun_absorption"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if ((rt.gt(rt.index(rt.index(rt.sv(f, "stun_absorption"), live(i)), "end_time"), rt.worldTime(f)) && truthy(rt.index(rt.index(rt.sv(f, "stun_absorption"), live(i)), "examine_message")))) {
				msg = rt.modify(live(msg), fmt("＀ ＀＀\n", [live(t_He), live(t_is), rt.index(rt.index(rt.sv(f, "stun_absorption"), live(i)), "examine_message")]), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (((truthy(rt.sv(f, "drunkenness")) && !truthy(live(skipface))) && !truthy(live(appears_dead)))) {
		$0 = rt.sv(f, "drunkenness");
		if (rt.inRange($0, 11, 21)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ slightly flushed.\n", [live(t_He), live(t_is)]), add);
		} else if (rt.inRange($0, 21.010000228881836, 41)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ flushed.\n", [live(t_He), live(t_is)]), add);
		} else if (rt.inRange($0, 41.0099983215332, 51)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ quite flushed and ＀ breath smells of alcohol.\n", [live(t_He), live(t_is), live(t_his)]), add);
		} else if (rt.inRange($0, 51.0099983215332, 61)) {
			msg = rt.modify(live(msg), fmt("＀ is very flushed and ＀ movements jerky, with breath reeking of alcohol.\n", [live(t_He), live(t_his)]), add);
		} else if (rt.inRange($0, 61.0099983215332, 91)) {
			msg = rt.modify(live(msg), fmt("＀ looks like a drunken mess.\n", [live(t_He)]), add);
		} else if (rt.inRange($0, 91.01000213623047, 9.999999848243207e+30)) {
			msg = rt.modify(live(msg), fmt("＀ ＀ a shitfaced, slobbering wreck.\n", [live(t_He), live(t_is)]), add);
		}
	}
	msg = rt.modify(live(msg), "</span>", add);
	if (!truthy(live(appears_dead))) {
		if (isEqual(rt.sv(f, "stat"), 1)) {
			msg = rt.modify(live(msg), fmt("＀ ＀n't responding to anything around ＀ and seems to be asleep.\n", [live(t_He), live(t_is), live(t_him)]), add);
		} else {
			if (rt.ge(rt.callSrc(f, "getBrainLoss", []), 60)) {
				msg = rt.modify(live(msg), fmt("＀ ＀ a stupid expression on ＀ face.\n", [live(t_He), live(t_has), live(t_his)]), add);
			}
		}
		if (truthy(rt.callSrc(f, "getorgan", [T("/obj/item/organ/brain")]))) {
			if (truthy((rt.istype(live(f.src), T("/mob/living/carbon/human/interactive")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "showexaminetext", (auto = live(f.src))))) {
					msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ ＀ appears to be some sort of sick automaton, ＀ eyes are glazed over and ＀ mouth is slightly agape.</span>\n", [live(t_He), live(t_is), live(t_his), live(t_his)]), add);
				}
				if (truthy(rt.fv(f, "debugexamine", live(auto)))) {
					dodebug = rt.callName(f, live(auto), "doing2string", [rt.fv(f, "doing", live(auto))]);
					interestdebug = rt.callName(f, live(auto), "interest2string", [rt.fv(f, "interest", live(auto))]);
					msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ ＀ appears to be ＀ and ＀.</span>\n", [live(t_He), live(t_is), live(interestdebug), live(dodebug)]), add);
				}
			} else {
				if (!truthy(rt.sv(f, "key"))) {
					msg = rt.modify(live(msg), fmt("<span class='deadsay'>＀ ＀ totally catatonic. The stresses of life in deep-space must have been too much for ＀. Any recovery is unlikely.</span>\n", [live(t_He), live(t_is), live(t_him)]), add);
				} else {
					if (!truthy(rt.sv(f, "client"))) {
						msg = rt.modify(live(msg), fmt("＀ ＀ a blank, absent-minded stare and appears completely unresponsive to anything. ＀ may snap out of it soon.\n", [live(t_He), live(t_has), live(t_He)]), add);
					}
				}
			}
		}
		if (truthy(rt.sv(f, "digitalcamo"))) {
			msg = rt.modify(live(msg), fmt("＀ ＀ moving ＀ body in an unnatural and blatantly inhuman manner.\n", [live(t_He), live(t_is), live(t_his)]), add);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(user);
		CIH = rt.callName(f, live(H), "getorgan", [T("/obj/item/organ/cyberimp/eyes/hud")]);
		if ((truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud")) ? 1 : 0)) || truthy(live(CIH)))) {
			if (truthy((perpname = rt.callSrc(f, "get_face_name", [rt.callSrc(f, "get_id_name", [""])])))) {
				if (truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "general", rt.gl("data_core"))])))) {
					msg = rt.modify(live(msg), fmt("<span class='deptradio'>Rank:</span> ＀<br>", [rt.index(rt.fv(f, "fields", live(R)), "rank")]), add);
					msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=1;photo_front=1'>[Front photo]</a> ", [live(f.src)]), add);
					msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=1;photo_side=1'>[Side photo]</a><br>", [live(f.src)]), add);
				}
				if ((truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/health")) ? 1 : 0)) || truthy((rt.istype(live(CIH), T("/obj/item/organ/cyberimp/eyes/hud/medical")) ? 1 : 0)))) {
					cyberimp_detect = null;
					CI = null;
					rt.forList(f, 0, rt.sv(f, "internal_organs"), T("/obj/item/organ/cyberimp"));
					while (($e = rt.next(f, 0)) !== undefined) {
						CI = $e;
						if (isEqual(rt.fv(f, "status", live(CI)), 2)) {
							cyberimp_detect = rt.modify(live(cyberimp_detect), fmt("＀ is modified with a ＀.<br>", [rt.sv(f, "name"), rt.fv(f, "name", live(CI))]), add);
						}
					}
					rt.endFor(f, 0);
					if (truthy(live(cyberimp_detect))) {
						msg = rt.modify(live(msg), "Detected cybernetic modifications:<br>", add);
						msg = rt.modify(live(msg), live(cyberimp_detect), add);
					}
					if (truthy(live(R))) {
						health_r = rt.index(rt.fv(f, "fields", live(R)), "p_stat");
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=m;p_stat=1'>[＀]</a>", [live(f.src), live(health_r)]), add);
						health_r = rt.index(rt.fv(f, "fields", live(R)), "m_stat");
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=m;m_stat=1'>[＀]</a><br>", [live(f.src), live(health_r)]), add);
					}
					if (truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "medical", rt.gl("data_core"))])))) {
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=m;evaluation=1'>[Medical evaluation]</a><br>", [live(f.src)]), add);
					}
				}
				if ((truthy((rt.istype(rt.fv(f, "glasses", live(H)), T("/obj/item/clothing/glasses/hud/security")) ? 1 : 0)) || truthy((rt.istype(live(CIH), T("/obj/item/organ/cyberimp/eyes/hud/security")) ? 1 : 0)))) {
					if ((!truthy(rt.fv(f, "stat", live(user))) && !isEqual(live(user), live(f.src)))) {
						criminal = "None";
						if (truthy((R = rt.call(f, P("/proc/find_record"), null, ["name", live(perpname), rt.fv(f, "security", rt.gl("data_core"))])))) {
							criminal = rt.index(rt.fv(f, "fields", live(R)), "criminal");
						}
						msg = rt.modify(live(msg), fmt("<span class='deptradio'>Criminal status:</span> <a href='?src=＃;hud=s;status=1'>[＀]</a>\n", [live(f.src), live(criminal)]), add);
						msg = rt.modify(live(msg), fmt("<span class='deptradio'>Security record:</span> <a href='?src=＃;hud=s;view=1'>[View]</a> ", [live(f.src)]), add);
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=s;add_crime=1'>[Add crime]</a> ", [live(f.src)]), add);
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=s;view_comment=1'>[View comment log]</a> ", [live(f.src)]), add);
						msg = rt.modify(live(msg), fmt("<a href='?src=＃;hud=s;add_comment=1'>[Add comment]</a>\n", [live(f.src)]), add);
					}
				}
			}
		}
	}
	msg = rt.modify(live(msg), "*---------*</span>", add);
	rt.call(f, P("/proc/to_chat"), null, [live(user), live(msg)]);
	return f.dot;
});
