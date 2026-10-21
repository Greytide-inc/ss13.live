// From code/modules/mob/living/carbon/human/inventory.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/human/proc/can_equip  (code/modules/mob/living/carbon/human/inventory.dm:2)  may sleep
rt.def("/mob/living/carbon/human/proc/can_equip", function* can_equip(f: Frame, I: Value, slot: Value, disable_warning: Value, bypass_equip_delay_self: Value) {
	f.vars = () => [I, slot, disable_warning, bypass_equip_delay_self];
	if (live(disable_warning) === null) {
		disable_warning = 0;
	}
	if (live(bypass_equip_delay_self) === null) {
		bypass_equip_delay_self = 0;
	}
	return (yield* g.callName(f, rt.fv(f, "species", rt.sv(f, "dna")), "can_equip", [live(I), live(slot), live(disable_warning), live(f.src), live(bypass_equip_delay_self)]));
}, true);

// /mob/living/carbon/human/proc/get_item_by_slot  (code/modules/mob/living/carbon/human/inventory.dm:6)
rt.def("/mob/living/carbon/human/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(slot_id);
	if ($0 === 1) {
		return rt.sv(f, "back");
	} else if ($0 === 2) {
		return rt.sv(f, "wear_mask");
	} else if ($0 === 10) {
		return rt.sv(f, "wear_neck");
	} else if ($0 === 3) {
		return rt.sv(f, "handcuffed");
	} else if ($0 === 19) {
		return rt.sv(f, "legcuffed");
	} else if ($0 === 5) {
		return rt.sv(f, "belt");
	} else if ($0 === 6) {
		return rt.sv(f, "wear_id");
	} else if ($0 === 7) {
		return rt.sv(f, "ears");
	} else if ($0 === 8) {
		return rt.sv(f, "glasses");
	} else if ($0 === 9) {
		return rt.sv(f, "gloves");
	} else if ($0 === 11) {
		return rt.sv(f, "head");
	} else if ($0 === 12) {
		return rt.sv(f, "shoes");
	} else if ($0 === 13) {
		return rt.sv(f, "wear_suit");
	} else if ($0 === 14) {
		return rt.sv(f, "w_uniform");
	} else if ($0 === 15) {
		return rt.sv(f, "l_store");
	} else if ($0 === 16) {
		return rt.sv(f, "r_store");
	} else if ($0 === 17) {
		return rt.sv(f, "s_store");
	}
	return null;
});

// /mob/living/carbon/human/proc/get_all_slots  (code/modules/mob/living/carbon/human/inventory.dm:44)
rt.def("/mob/living/carbon/human/proc/get_all_slots", function get_all_slots(f: Frame) {
	f.dot = rt.bitOr(rt.callSrc(f, "get_head_slots", []), rt.callSrc(f, "get_body_slots", []));
	return f.dot;
});

// /mob/living/carbon/human/proc/get_body_slots  (code/modules/mob/living/carbon/human/inventory.dm:47)
rt.def("/mob/living/carbon/human/proc/get_body_slots", function get_body_slots(f: Frame) {
	return rt.list(rt.sv(f, "back"), rt.sv(f, "s_store"), rt.sv(f, "handcuffed"), rt.sv(f, "legcuffed"), rt.sv(f, "wear_suit"), rt.sv(f, "gloves"), rt.sv(f, "shoes"), rt.sv(f, "belt"), rt.sv(f, "wear_id"), rt.sv(f, "l_store"), rt.sv(f, "r_store"), rt.sv(f, "w_uniform"));
});

// /mob/living/carbon/human/proc/get_head_slots  (code/modules/mob/living/carbon/human/inventory.dm:63)
rt.def("/mob/living/carbon/human/proc/get_head_slots", function get_head_slots(f: Frame) {
	return rt.list(rt.sv(f, "head"), rt.sv(f, "wear_mask"), rt.sv(f, "glasses"), rt.sv(f, "ears"));
});

// /mob/living/carbon/human/proc/get_storage_slots  (code/modules/mob/living/carbon/human/inventory.dm:71)
rt.def("/mob/living/carbon/human/proc/get_storage_slots", function get_storage_slots(f: Frame) {
	return rt.list(rt.sv(f, "back"), rt.sv(f, "belt"), rt.sv(f, "l_store"), rt.sv(f, "r_store"), rt.sv(f, "s_store"));
});

// /mob/living/carbon/human/proc/equip_to_slot  (code/modules/mob/living/carbon/human/inventory.dm:81)  may sleep
rt.def("/mob/living/carbon/human/proc/equip_to_slot", function* equip_to_slot(f: Frame) {
	let not_handled: Value = null, G: Value = null;
	let $0: any;
	f.vars = () => [not_handled, G, $0];
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	not_handled = 0;
	$0 = live(f.args[1]);
	if ($0 === 5) {
		rt.setSv(f, "belt", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_belt");
	} else if ($0 === 6) {
		rt.setSv(f, "wear_id", live(f.args[0]));
		yield* g.srcCall(f, "sec_hud_set_ID");
		yield* g.srcCall(f, "update_inv_wear_id");
	} else if ($0 === 7) {
		rt.setSv(f, "ears", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_ears");
	} else if ($0 === 8) {
		rt.setSv(f, "glasses", live(f.args[0]));
		if (truthy(rt.gv(f, "glass_colour_type", (G = live(f.args[0]))))) {
			yield* g.srcCall(f, "update_glasses_color", live(G), 1);
		}
		if (truthy(rt.fv(f, "tint", live(G)))) {
			yield* g.srcCall(f, "update_tint");
		}
		if (truthy(rt.fv(f, "vision_correction", live(G)))) {
			yield* g.srcCall(f, "clear_fullscreen", "nearsighted");
		}
		if (((((truthy(rt.fv(f, "vision_flags", live(G))) || truthy(rt.fv(f, "darkness_view", live(G)))) || truthy(rt.fv(f, "invis_override", live(G)))) || truthy(rt.fv(f, "invis_view", live(G)))) || rt.fv(f, "lighting_alpha", live(G)) !== null)) {
			yield* g.srcCall(f, "update_sight");
		}
		yield* g.srcCall(f, "update_inv_glasses");
	} else if ($0 === 9) {
		rt.setSv(f, "gloves", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_gloves");
	} else if ($0 === 12) {
		rt.setSv(f, "shoes", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_shoes");
	} else if ($0 === 13) {
		rt.setSv(f, "wear_suit", live(f.args[0]));
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 4))) {
			yield* g.srcCall(f, "update_inv_w_uniform");
		}
		if (truthy(rt.fv(f, "breakouttime", rt.sv(f, "wear_suit")))) {
			yield* g.srcCall(f, "stop_pulling");
			yield* g.srcCall(f, "update_action_buttons_icon");
		}
		yield* g.srcCall(f, "update_inv_wear_suit");
	} else if ($0 === 14) {
		rt.setSv(f, "w_uniform", live(f.args[0]));
		yield* g.srcCall(f, "update_suit_sensors");
		yield* g.srcCall(f, "update_inv_w_uniform");
	} else if ($0 === 15) {
		rt.setSv(f, "l_store", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_pockets");
	} else if ($0 === 16) {
		rt.setSv(f, "r_store", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_pockets");
	} else if ($0 === 17) {
		rt.setSv(f, "s_store", live(f.args[0]));
		yield* g.srcCall(f, "update_inv_s_store");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>You are trying to equip this item to an unsupported inventory slot. Report this to a coder!</span>"]);
	}
	if (!truthy(live(not_handled))) {
		yield* g.callName(f, live(f.args[0]), "equipped", [live(f.src), live(f.args[1])]);
	}
	return live(not_handled);
}, true, { args: ["I", "slot"] });

// /mob/living/carbon/human/proc/doUnEquip  (code/modules/mob/living/carbon/human/inventory.dm:145)  may sleep
rt.def("/mob/living/carbon/human/proc/doUnEquip", function* doUnEquip(f: Frame) {
	let index: Value = null, G: Value = null;
	f.vars = () => [index, G];
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	index = (yield* g.srcCall(f, "get_held_index_of_item", live(f.args[0])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((!truthy(live(f.dot)) || !truthy(live(f.args[0])))) {
		return live(f.dot);
	}
	if ((truthy(live(index)) && truthy(rt.gv(f, "mutanthands", rt.fv(f, "species", rt.sv(f, "dna")))))) {
		yield* g.srcCall(f, "put_in_hand", (yield* g.new_(f, rt.gv(f, "mutanthands", rt.fv(f, "species", rt.sv(f, "dna"))), [])), live(index));
	}
	if (isEqual(live(f.args[0]), rt.sv(f, "wear_suit"))) {
		if ((truthy(rt.sv(f, "s_store")) && truthy(live(f.args[4])))) {
			yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "s_store"), 1);
		}
		if (truthy(rt.fv(f, "breakouttime", rt.sv(f, "wear_suit")))) {
			yield* g.srcCall(f, "update_action_buttons_icon");
		}
		rt.setSv(f, "wear_suit", null);
		if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 4))) {
			yield* g.srcCall(f, "update_inv_w_uniform");
		}
		yield* g.srcCall(f, "update_inv_wear_suit");
	} else {
		if (isEqual(live(f.args[0]), rt.sv(f, "w_uniform"))) {
			if (truthy(live(f.args[4]))) {
				if (truthy(rt.sv(f, "r_store"))) {
					yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "r_store"), 1);
				}
				if (truthy(rt.sv(f, "l_store"))) {
					yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "l_store"), 1);
				}
				if (truthy(rt.sv(f, "wear_id"))) {
					yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "wear_id"));
				}
				if (truthy(rt.sv(f, "belt"))) {
					yield* g.srcCall(f, "dropItemToGround", rt.sv(f, "belt"));
				}
			}
			rt.setSv(f, "w_uniform", null);
			yield* g.srcCall(f, "update_suit_sensors");
			yield* g.srcCall(f, "update_inv_w_uniform", live(f.args[4]));
		} else {
			if (isEqual(live(f.args[0]), rt.sv(f, "gloves"))) {
				rt.setSv(f, "gloves", null);
				yield* g.srcCall(f, "update_inv_gloves");
			} else {
				if (isEqual(live(f.args[0]), rt.sv(f, "glasses"))) {
					rt.setSv(f, "glasses", null);
					if (truthy(rt.gv(f, "glass_colour_type", (G = live(f.args[0]))))) {
						yield* g.srcCall(f, "update_glasses_color", live(G), 0);
					}
					if (truthy(rt.fv(f, "tint", live(G)))) {
						yield* g.srcCall(f, "update_tint");
					}
					if (truthy(rt.fv(f, "vision_correction", live(G)))) {
						if (truthy(rt.bitAnd(rt.sv(f, "disabilities"), 8))) {
							yield* g.srcCall(f, "overlay_fullscreen", "nearsighted", T("/obj/screen/fullscreen/impaired"), 1);
						}
					}
					if (((((truthy(rt.fv(f, "vision_flags", live(G))) || truthy(rt.fv(f, "darkness_view", live(G)))) || truthy(rt.fv(f, "invis_override", live(G)))) || truthy(rt.fv(f, "invis_view", live(G)))) || rt.fv(f, "lighting_alpha", live(G)) !== null)) {
						yield* g.srcCall(f, "update_sight");
					}
					yield* g.srcCall(f, "update_inv_glasses");
				} else {
					if (isEqual(live(f.args[0]), rt.sv(f, "ears"))) {
						rt.setSv(f, "ears", null);
						yield* g.srcCall(f, "update_inv_ears");
					} else {
						if (isEqual(live(f.args[0]), rt.sv(f, "shoes"))) {
							rt.setSv(f, "shoes", null);
							yield* g.srcCall(f, "update_inv_shoes");
						} else {
							if (isEqual(live(f.args[0]), rt.sv(f, "belt"))) {
								rt.setSv(f, "belt", null);
								yield* g.srcCall(f, "update_inv_belt");
							} else {
								if (isEqual(live(f.args[0]), rt.sv(f, "wear_id"))) {
									rt.setSv(f, "wear_id", null);
									yield* g.srcCall(f, "sec_hud_set_ID");
									yield* g.srcCall(f, "update_inv_wear_id");
								} else {
									if (isEqual(live(f.args[0]), rt.sv(f, "r_store"))) {
										rt.setSv(f, "r_store", null);
										yield* g.srcCall(f, "update_inv_pockets");
									} else {
										if (isEqual(live(f.args[0]), rt.sv(f, "l_store"))) {
											rt.setSv(f, "l_store", null);
											yield* g.srcCall(f, "update_inv_pockets");
										} else {
											if (!isEqual(live(f.args[0]), rt.sv(f, "s_store"))) return f.dot;
											rt.setSv(f, "s_store", null);
											yield* g.srcCall(f, "update_inv_s_store");
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "force", "newloc", "no_move", "invdrop"] });

// /mob/living/carbon/human/proc/wear_mask_update  (code/modules/mob/living/carbon/human/inventory.dm:213)  may sleep
rt.def("/mob/living/carbon/human/proc/wear_mask_update", function* wear_mask_update(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 768)) || truthy(rt.bitAnd(rt.initial(f, live(f.args[0]), "flags_inv"), 768)))) {
		yield* g.srcCall(f, "update_hair");
	}
	if (((truthy(live(f.args[1])) && truthy(rt.sv(f, "internal"))) && !truthy((yield* g.srcCall(f, "getorganslot", "breathing_tube"))))) {
		yield* g.srcCall(f, "update_internals_hud_icon", 0);
		rt.setSv(f, "internal", null);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 64))) {
		yield* g.srcCall(f, "update_inv_glasses");
	}
	yield* g.srcCall(f, "sec_hud_set_security_status");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C", "toggle_off"] });

// /mob/living/carbon/human/proc/head_update  (code/modules/mob/living/carbon/human/inventory.dm:224)  may sleep
rt.def("/mob/living/carbon/human/proc/head_update", function* head_update(f: Frame) {
	if ((truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 768)) || truthy(live(f.args[1])))) {
		yield* g.srcCall(f, "update_hair");
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 64)) || truthy(live(f.args[1])))) {
		yield* g.srcCall(f, "update_inv_glasses");
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "flags_inv", live(f.args[0])), 32)) || truthy(live(f.args[1])))) {
		yield* g.srcCall(f, "update_body");
	}
	yield* g.srcCall(f, "sec_hud_set_security_status");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "forced"] });

// /mob/living/carbon/human/proc/equipOutfit  (code/modules/mob/living/carbon/human/inventory.dm:236)  may sleep
rt.def("/mob/living/carbon/human/proc/equipOutfit", function* equipOutfit(f: Frame, outfit: Value, visualsOnly: Value) {
	let O: Value = null;
	f.vars = () => [outfit, visualsOnly, O];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	O = null;
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [live(outfit)])))) {
		O = (yield* g.new_(f, live(outfit), []));
	} else {
		if (!truthy((rt.istype((O = live(outfit)), T("/datum/outfit")) ? 1 : 0))) {
			return 0;
		}
	}
	if (!truthy(live(O))) {
		return 0;
	}
	return (yield* g.callName(f, live(O), "equip", [live(f.src), live(visualsOnly)]));
}, true);
