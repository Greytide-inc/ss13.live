// From code/_onclick/hud/screen_objects.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10999, "/obj/screen", "/obj", {
	master: null,
	hud: null,
	name: "",
	icon: rt.rsc("icons/mob/screen_gen.dmi"),
	layer: 20,
	plane: 20,
	resistance_flags: 115,
	appearance_flags: 26,
});

// /obj/screen/proc/Destroy  (code/_onclick/hud/screen_objects.dm:25)  may sleep
rt.def("/obj/screen/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "master", null);
	rt.setSv(f, "hud", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11156, "/obj/screen/swap_hand", "/obj/screen", {
	layer: 19,
	plane: 19,
	name: "swap hand",
});

// /obj/screen/swap_hand/proc/Click  (code/_onclick/hud/screen_objects.dm:49)
rt.def("/obj/screen/swap_hand/proc/Click", function Click(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (rt.le(rt.worldTime(f), rt.fv(f, "next_move", live(f.usr)))) {
		return 1;
	}
	if (truthy(rt.callName(f, live(f.usr), "incapacitated", []))) {
		return 1;
	}
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(f.usr)]))) {
		rt.callName(f, (M = live(f.usr)), "swap_hand", []);
	}
	return 1;
});

rt.type(11157, "/obj/screen/craft", "/obj/screen", {
	name: "crafting menu",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "craft",
	screen_loc: "EAST-4:22,SOUTH:5",
});

// /obj/screen/craft/proc/Click  (code/_onclick/hud/screen_objects.dm:67)  may sleep
rt.def("/obj/screen/craft/proc/Click", function* Click(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	M = live(f.usr);
	if (truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "OpenCraftingMenu", []);
	return f.dot;
}, true);

rt.type(11158, "/obj/screen/area_creator", "/obj/screen", {
	name: "create new area",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "area_edit",
	screen_loc: "EAST-4:22,SOUTH:21",
});

// /obj/screen/area_creator/proc/Click  (code/_onclick/hud/screen_objects.dm:79)  may sleep
rt.def("/obj/screen/area_creator/proc/Click", function* Click(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return 1;
	}
	if (!truthy(rt.gv(f, "outdoors", (A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.usr)])))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There is already a defined structure here.</span>"]);
		return 1;
	}
	yield* g.call(f, P("/proc/create_area"), null, [live(f.usr)]);
	return f.dot;
}, true);

rt.type(11159, "/obj/screen/language_menu", "/obj/screen", {
	name: "language menu",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "talk_wheel",
	screen_loc: "EAST-4:6,SOUTH+1:-11",
});

// /obj/screen/language_menu/proc/Click  (code/_onclick/hud/screen_objects.dm:94)  may sleep
rt.def("/obj/screen/language_menu/proc/Click", function* Click(f: Frame) {
	let M: Value = null, H: Value = null;
	f.vars = () => [M, H];
	M = live(f.usr);
	yield* g.callName(f, (H = (yield* g.callName(f, live(M), "get_language_holder", []))), "open_language_menu", [live(f.usr)]);
	return f.dot;
}, true);

rt.type(11160, "/obj/screen/inventory", "/obj/screen", {
	slot_id: null,
	icon_empty: null,
	icon_full: null,
	layer: 19,
	plane: 19,
});

// /obj/screen/inventory/proc/Click  (code/_onclick/hud/screen_objects.dm:108)  may sleep
rt.def("/obj/screen/inventory/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let inv_item: Value = null;
	f.vars = () => [location, control, params, inv_item];
	if (rt.le(rt.worldTime(f), rt.fv(f, "next_move", live(f.usr)))) {
		return 1;
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		return 1;
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return 1;
	}
	if (((truthy(rt.sv(f, "hud")) && truthy(rt.fv(f, "mymob", rt.sv(f, "hud")))) && truthy(rt.sv(f, "slot_id")))) {
		if (truthy((inv_item = (yield* g.callName(f, rt.fv(f, "mymob", rt.sv(f, "hud")), "get_item_by_slot", [rt.sv(f, "slot_id")]))))) {
			return (yield* g.callName(f, live(inv_item), "Click", [live(location), live(control), live(params)]));
		}
	}
	if (truthy((yield* g.callName(f, live(f.usr), "attack_ui", [rt.sv(f, "slot_id")])))) {
		yield* g.callName(f, live(f.usr), "update_inv_hands", []);
	}
	return 1;
}, true);

// /obj/screen/inventory/proc/update_icon  (code/_onclick/hud/screen_objects.dm:126)
rt.def("/obj/screen/inventory/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "icon_empty"))) {
		rt.setSv(f, "icon_empty", rt.sv(f, "icon_state"));
	}
	if (!(((truthy(rt.sv(f, "hud")) && truthy(rt.fv(f, "mymob", rt.sv(f, "hud")))) && truthy(rt.sv(f, "slot_id"))) && truthy(rt.sv(f, "icon_full")))) return f.dot;
	if (truthy(rt.callName(f, rt.fv(f, "mymob", rt.sv(f, "hud")), "get_item_by_slot", [rt.sv(f, "slot_id")]))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_full"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_empty"));
	}
	return f.dot;
});

rt.type(11161, "/obj/screen/inventory/hand", "/obj/screen/inventory", {
	handcuff_overlay: null,
	held_index: 0,
}, { global: { blocked_overlay: 774 } });

// /obj/screen/inventory/hand/proc/update_icon  (code/_onclick/hud/screen_objects.dm:141)
rt.def("/obj/screen/inventory/hand/proc/update_icon", function update_icon(f: Frame) {
	let state: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [state, C, $0];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "handcuff_overlay"))) {
		if (!truthy(rt.modulus(rt.sv(f, "held_index"), 2))) {
			$0 = "markus";
		} else {
			$0 = "gabrielle";
		}
		state = $0;
		rt.setSv(f, "handcuff_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/screen_gen.dmi"), live(state)]));
	}
	rt.callSrc(f, "cut_overlays", []);
	if (!(truthy(rt.sv(f, "hud")) && truthy(rt.fv(f, "mymob", rt.sv(f, "hud"))))) return f.dot;
	if (truthy((rt.istype(rt.fv(f, "mymob", rt.sv(f, "hud")), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "handcuffed", (C = rt.fv(f, "mymob", rt.sv(f, "hud")))))) {
			rt.callSrc(f, "add_overlay", [rt.sv(f, "handcuff_overlay")]);
		}
		if (truthy(rt.sv(f, "held_index"))) {
			if (!truthy(rt.callName(f, live(C), "has_hand_for_held_index", [rt.sv(f, "held_index")]))) {
				rt.callSrc(f, "add_overlay", [rt.gl("blocked_overlay")]);
			}
		}
	}
	if (!isEqual(rt.sv(f, "held_index"), rt.gv(f, "active_hand_index", rt.fv(f, "mymob", rt.sv(f, "hud"))))) return f.dot;
	rt.callSrc(f, "add_overlay", ["hand_active"]);
	return f.dot;
});

// /obj/screen/inventory/hand/proc/Click  (code/_onclick/hud/screen_objects.dm:166)  may sleep
rt.def("/obj/screen/inventory/hand/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let I: Value = null;
	f.vars = () => [location, control, params, I];
	if (rt.le(rt.worldTime(f), rt.fv(f, "next_move", live(f.usr)))) {
		return 1;
	}
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0)))) {
		return 1;
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return 1;
	}
	if (isEqual(rt.gv(f, "active_hand_index", rt.fv(f, "mymob", rt.sv(f, "hud"))), rt.sv(f, "held_index"))) {
		if (truthy((I = (yield* g.callName(f, rt.fv(f, "mymob", rt.sv(f, "hud")), "get_active_held_item", []))))) {
			yield* g.callName(f, live(I), "Click", [live(location), live(control), live(params)]);
		}
	} else {
		yield* g.callName(f, rt.fv(f, "mymob", rt.sv(f, "hud")), "swap_hand", [rt.sv(f, "held_index")]);
	}
	return 1;
}, true);

rt.type(11162, "/obj/screen/close", "/obj/screen", {
	name: "close",
});

// /obj/screen/close/proc/Click  (code/_onclick/hud/screen_objects.dm:185)
rt.def("/obj/screen/close/proc/Click", function Click(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype(rt.sv(f, "master"), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		rt.callName(f, (S = rt.sv(f, "master")), "close", [live(f.usr)]);
	}
	return 1;
});

rt.type(11163, "/obj/screen/drop", "/obj/screen", {
	name: "drop",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_drop",
	layer: 19,
	plane: 19,
});

// /obj/screen/drop/proc/Click  (code/_onclick/hud/screen_objects.dm:199)  may sleep
rt.def("/obj/screen/drop/proc/Click", function* Click(f: Frame) {
	yield* g.callName(f, live(f.usr), "drop_item_v", []);
	return f.dot;
}, true);

rt.type(11164, "/obj/screen/act_intent", "/obj/screen", {
	name: "intent",
	icon_state: "help",
	screen_loc: "EAST-3:24,SOUTH:5",
});

// /obj/screen/act_intent/proc/Click  (code/_onclick/hud/screen_objects.dm:207)
rt.def("/obj/screen/act_intent/proc/Click", function Click(f: Frame, location: Value, control: Value, params: Value) {
	rt.callName(f, live(f.usr), "a_intent_change", ["right"]);
	return f.dot;
});

rt.type(11165, "/obj/screen/act_intent/segmented", "/obj/screen/act_intent", {});

// /obj/screen/act_intent/segmented/proc/Click  (code/_onclick/hud/screen_objects.dm:210)
rt.def("/obj/screen/act_intent/segmented/proc/Click", function Click(f: Frame) {
	let _x: Value = null, _y: Value = null;
	f.vars = () => [_x, _y];
	if (truthy(rt.bitAnd(rt.gv(f, "toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 32))) {
		_x = rt.call(f, P("/proc/text2num"), null, [rt.index(rt.call(f, P("/proc/params2list"), null, [live(f.args[2])]), "icon-x")]);
		_y = rt.call(f, P("/proc/text2num"), null, [rt.index(rt.call(f, P("/proc/params2list"), null, [live(f.args[2])]), "icon-y")]);
		if ((rt.le(live(_x), 16) && rt.le(live(_y), 16))) {
			rt.callName(f, live(f.usr), "a_intent_change", ["harm"]);
		} else {
			if ((rt.le(live(_x), 16) && rt.ge(live(_y), 17))) {
				rt.callName(f, live(f.usr), "a_intent_change", ["help"]);
			} else {
				if ((rt.ge(live(_x), 17) && rt.le(live(_y), 16))) {
					rt.callName(f, live(f.usr), "a_intent_change", ["grab"]);
				} else {
					if ((rt.ge(live(_x), 17) && rt.ge(live(_y), 17))) {
						rt.callName(f, live(f.usr), "a_intent_change", ["disarm"]);
					}
				}
			}
		}
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["location", "control", "params"] });

rt.type(11168, "/obj/screen/internals", "/obj/screen", {
	name: "toggle internals",
	icon_state: "internal0",
	screen_loc: "EAST-1:28,CENTER:17",
});

// /obj/screen/internals/proc/Click  (code/_onclick/hud/screen_objects.dm:242)  may sleep
rt.def("/obj/screen/internals/proc/Click", function* Click(f: Frame) {
	let C: Value = null, M: Value = null, I: Value = null, H: Value = null;
	f.vars = () => [C, M, I, H];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, (C = live(f.usr)), "incapacitated", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "internal", live(C)))) {
		rt.setFv(f, "internal", live(C), null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='notice'>You are no longer running on internals.</span>"]);
		rt.setSv(f, "icon_state", "internal0");
	} else {
		if (!truthy((yield* g.callName(f, live(C), "getorganslot", ["breathing_tube"])))) {
			if (!truthy((rt.istype(rt.fv(f, "wear_mask", live(C)), T("/obj/item/clothing/mask")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You are not wearing an internals mask!</span>"]);
				return 1;
			} else {
				if (truthy(rt.gv(f, "mask_adjusted", (M = rt.fv(f, "wear_mask", live(C)))))) {
					yield* g.callName(f, live(M), "adjustmask", [live(C)]);
				}
				if (!truthy(rt.bitAnd(rt.fv(f, "flags", live(M)), 8))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You are not wearing an internals mask!</span>"]);
					return live(f.dot);
				}
			}
		}
		if (truthy((I = (yield* g.callName(f, live(C), "is_holding_item_of_type", [T("/obj/item/weapon/tank")]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='notice'>You are now running on internals from the ＀ on your ＀.</span>", [live(I), (yield* g.callName(f, live(C), "get_held_index_name", [(yield* g.callName(f, live(C), "get_held_index_of_item", [live(I)]))]))])]);
			rt.setFv(f, "internal", live(C), live(I));
		} else {
			if (truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0))) {
				if (truthy((rt.istype(rt.gv(f, "s_store", (H = live(C))), T("/obj/item/weapon/tank")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You are now running on internals from the ＀ on your ＀.</span>", [rt.fv(f, "s_store", live(H)), rt.fv(f, "wear_suit", live(H))])]);
					rt.setFv(f, "internal", live(H), rt.fv(f, "s_store", live(H)));
				} else {
					if (truthy((rt.istype(rt.fv(f, "belt", live(H)), T("/obj/item/weapon/tank")) ? 1 : 0))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You are now running on internals from the ＀ on your belt.</span>", [rt.fv(f, "belt", live(H))])]);
						rt.setFv(f, "internal", live(H), rt.fv(f, "belt", live(H)));
					} else {
						if (truthy((rt.istype(rt.fv(f, "l_store", live(H)), T("/obj/item/weapon/tank")) ? 1 : 0))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You are now running on internals from the ＀ in your left pocket.</span>", [rt.fv(f, "l_store", live(H))])]);
							rt.setFv(f, "internal", live(H), rt.fv(f, "l_store", live(H)));
						} else {
							if (truthy((rt.istype(rt.fv(f, "r_store", live(H)), T("/obj/item/weapon/tank")) ? 1 : 0))) {
								yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='notice'>You are now running on internals from the ＀ in your right pocket.</span>", [rt.fv(f, "r_store", live(H))])]);
								rt.setFv(f, "internal", live(H), rt.fv(f, "r_store", live(H)));
							}
						}
					}
				}
			}
		}
		if ((!truthy(rt.fv(f, "internal", live(C))) && truthy((rt.istype(rt.fv(f, "back", live(C)), T("/obj/item/weapon/tank")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='notice'>You are now running on internals from the ＀ on your back.</span>", [rt.fv(f, "back", live(C))])]);
			rt.setFv(f, "internal", live(C), rt.fv(f, "back", live(C)));
		}
		if (truthy(rt.fv(f, "internal", live(C)))) {
			rt.setSv(f, "icon_state", "internal1");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), "<span class='warning'>You don't have an oxygen tank!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(C), "update_action_buttons_icon", []);
	return f.dot;
}, true);

rt.type(11169, "/obj/screen/mov_intent", "/obj/screen", {
	name: "run/walk toggle",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "running",
});

// /obj/screen/mov_intent/proc/Click  (code/_onclick/hud/screen_objects.dm:302)  may sleep
rt.def("/obj/screen/mov_intent/proc/Click", function* Click(f: Frame) {
	yield* g.srcCall(f, "toggle", live(f.usr));
	return f.dot;
}, true);

// /obj/screen/mov_intent/proc/toggle  (code/_onclick/hud/screen_objects.dm:305)  may sleep
rt.def("/obj/screen/mov_intent/proc/toggle", function* toggle(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	$0 = rt.fv(f, "m_intent", live(user));
	if ($0 === "run") {
		rt.setFv(f, "m_intent", live(user), "walk");
		rt.setSv(f, "icon_state", "walking");
	} else if ($0 === "walk") {
		rt.setFv(f, "m_intent", live(user), "run");
		rt.setSv(f, "icon_state", "running");
	}
	yield* g.callName(f, live(user), "update_icons", []);
	return f.dot;
}, true);

rt.type(11170, "/obj/screen/pull", "/obj/screen", {
	name: "stop pulling",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "pull",
});

// /obj/screen/pull/proc/Click  (code/_onclick/hud/screen_objects.dm:322)  may sleep
rt.def("/obj/screen/pull/proc/Click", function* Click(f: Frame) {
	if (truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "stop_pulling", []);
	return f.dot;
}, true);

// /obj/screen/pull/proc/update_icon  (code/_onclick/hud/screen_objects.dm:327)
rt.def("/obj/screen/pull/proc/update_icon", function update_icon(f: Frame, mymob: Value) {
	if (!truthy(live(mymob))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "pulling", live(mymob)))) {
		rt.setSv(f, "icon_state", "pull");
	} else {
		rt.setSv(f, "icon_state", "pull0");
	}
	return f.dot;
});

rt.type(11171, "/obj/screen/resist", "/obj/screen", {
	name: "resist",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_resist",
	layer: 19,
	plane: 19,
});

// /obj/screen/resist/proc/Click  (code/_onclick/hud/screen_objects.dm:341)  may sleep
rt.def("/obj/screen/resist/proc/Click", function* Click(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (L = live(f.usr)), "resist", []);
	return f.dot;
}, true);

rt.type(11172, "/obj/screen/storage", "/obj/screen", {
	name: "storage",
});

// /obj/screen/storage/proc/Click  (code/_onclick/hud/screen_objects.dm:349)  may sleep
rt.def("/obj/screen/storage/proc/Click", function* Click(f: Frame, location: Value, control: Value, params: Value) {
	let I: Value = null;
	f.vars = () => [location, control, params, I];
	if (rt.le(rt.worldTime(f), rt.fv(f, "next_move", live(f.usr)))) {
		return 1;
	}
	if ((((truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "IsUnconscious", [])))) || truthy((yield* g.callName(f, live(f.usr), "IsKnockdown", [])))) || truthy((yield* g.callName(f, live(f.usr), "IsStun", []))))) {
		return 1;
	}
	if (truthy((rt.istype(rt.fv(f, "loc", live(f.usr)), T("/obj/mecha")) ? 1 : 0))) {
		return 1;
	}
	if (truthy(rt.sv(f, "master"))) {
		if (truthy((I = (yield* g.callName(f, live(f.usr), "get_active_held_item", []))))) {
			yield* g.callName(f, rt.sv(f, "master"), "attackby", [live(I), live(f.usr), live(params)]);
		}
	}
	return 1;
}, true);

rt.type(11173, "/obj/screen/throw_catch", "/obj/screen", {
	name: "throw/catch",
	icon: rt.rsc("icons/mob/screen_midnight.dmi"),
	icon_state: "act_throw_off",
});

// /obj/screen/throw_catch/proc/Click  (code/_onclick/hud/screen_objects.dm:367)
rt.def("/obj/screen/throw_catch/proc/Click", function Click(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	rt.callName(f, (C = live(f.usr)), "toggle_throw_mode", []);
	return f.dot;
});

rt.type(11174, "/obj/screen/zone_sel", "/obj/screen", {
	selecting: "chest",
	name: "damage zone",
	icon_state: "zone_sel",
	screen_loc: "EAST-1:28,SOUTH:5",
});

// /obj/screen/zone_sel/proc/Click  (code/_onclick/hud/screen_objects.dm:378)
rt.def("/obj/screen/zone_sel/proc/Click", function Click(f: Frame, location: Value, control: Value, params: Value) {
	let PL: Value = null, icon_x: Value = null, icon_y: Value = null, choice: Value = null;
	let $0: any;
	f.vars = () => [PL, icon_x, icon_y, choice, $0];
	if (truthy((rt.istype(live(f.usr), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	PL = rt.call(f, P("/proc/params2list"), null, [live(params)]);
	icon_x = rt.call(f, P("/proc/text2num"), null, [rt.at(live(PL), "icon-x")]);
	icon_y = rt.call(f, P("/proc/text2num"), null, [rt.at(live(PL), "icon-y")]);
	choice = null;
	$0 = live(icon_y);
	if (rt.inRange($0, 1, 9)) {
		$0 = live(icon_x);
		if (rt.inRange($0, 10, 15)) {
			choice = "r_leg";
		} else if (rt.inRange($0, 17, 22)) {
			choice = "l_leg";
		} else {
			return 1;
		}
	} else if (rt.inRange($0, 10, 13)) {
		$0 = live(icon_x);
		if (rt.inRange($0, 8, 11)) {
			choice = "r_arm";
		} else if (rt.inRange($0, 12, 20)) {
			choice = "groin";
		} else if (rt.inRange($0, 21, 24)) {
			choice = "l_arm";
		} else {
			return 1;
		}
	} else if (rt.inRange($0, 14, 22)) {
		$0 = live(icon_x);
		if (rt.inRange($0, 8, 11)) {
			choice = "r_arm";
		} else if (rt.inRange($0, 12, 20)) {
			choice = "chest";
		} else if (rt.inRange($0, 21, 24)) {
			choice = "l_arm";
		} else {
			return 1;
		}
	} else if (rt.inRange($0, 23, 30)) {
		if (truthy(rt.op(f, "IsInRange", [], [live(icon_x), 12, 20]))) {
			choice = "head";
			$0 = live(icon_y);
			if (rt.inRange($0, 23, 24)) {
				if (truthy(rt.op(f, "IsInRange", [], [live(icon_x), 15, 17]))) {
					choice = "mouth";
				}
			} else if ($0 === 26) {
				if (truthy(rt.op(f, "IsInRange", [], [live(icon_x), 14, 18]))) {
					choice = "eyes";
				}
			} else if (rt.inRange($0, 25, 27)) {
				if (truthy(rt.op(f, "IsInRange", [], [live(icon_x), 15, 17]))) {
					choice = "eyes";
				}
			}
		}
	}
	return rt.callSrc(f, "set_selected_zone", [live(choice), live(f.usr)]);
});

// /obj/screen/zone_sel/proc/set_selected_zone  (code/_onclick/hud/screen_objects.dm:432)
rt.def("/obj/screen/zone_sel/proc/set_selected_zone", function set_selected_zone(f: Frame, choice: Value, user: Value) {
	if (truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!isEqual(live(choice), rt.sv(f, "selecting"))) {
		rt.setSv(f, "selecting", live(choice));
		rt.callSrc(f, "update_icon", [live(f.usr)]);
	}
	return 1;
});

// /obj/screen/zone_sel/proc/update_icon  (code/_onclick/hud/screen_objects.dm:441)
rt.def("/obj/screen/zone_sel/proc/update_icon", function update_icon(f: Frame, user: Value) {
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/screen_gen.dmi"), fmt("＀", [rt.sv(f, "selecting")])])]);
	rt.setFv(f, "zone_selected", live(user), rt.sv(f, "selecting"));
	return f.dot;
});

rt.type(11175, "/obj/screen/zone_sel/alien", "/obj/screen/zone_sel", {
	icon: rt.rsc("icons/mob/screen_alien.dmi"),
});

// /obj/screen/zone_sel/alien/proc/update_icon  (code/_onclick/hud/screen_objects.dm:449)
rt.def("/obj/screen/zone_sel/alien/proc/update_icon", function update_icon(f: Frame, user: Value) {
	rt.callSrc(f, "cut_overlays", []);
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/mob/screen_alien.dmi"), fmt("＀", [rt.sv(f, "selecting")])])]);
	rt.setFv(f, "zone_selected", live(user), rt.sv(f, "selecting"));
	return f.dot;
});

rt.type(11192, "/obj/screen/splash", "/obj/screen", {
	holder: null,
	icon: rt.rsc("config/title_screens/images/blank.png"),
	icon_state: "",
	screen_loc: "CENTER-7,CENTER-7",
	layer: 21,
	plane: 21,
});

// /obj/screen/splash/proc/New  (code/_onclick/hud/screen_objects.dm:553)  may sleep
rt.def("/obj/screen/splash/proc/New", function* New(f: Frame) {
	let actualview: Value = null, scale: Value = null;
	f.vars = () => [actualview, scale];
	rt.setSv(f, "holder", live(f.args[0]));
	if (!truthy(live(f.args[1]))) {
		rt.setSv(f, "alpha", 0);
	}
	if (!truthy(live(f.args[2]))) {
		if (truthy(rt.fv(f, "icon", rt.gl("SStitle")))) {
			rt.setSv(f, "icon", rt.fv(f, "icon", rt.gl("SStitle")));
		}
	} else {
		if (!truthy(rt.fv(f, "previous_icon", rt.gl("SStitle")))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
		rt.setSv(f, "icon", rt.fv(f, "previous_icon", rt.gl("SStitle")));
	}
	actualview = (yield* g.call(f, P("/proc/getviewsize"), null, [rt.fv(f, "view", live(f.args[0]))]));
	if (!isEqual((scale = (yield* g.call(f, P("/proc/max"), null, [divide(rt.index(live(actualview), 1), 15), divide(rt.index(live(actualview), 2), 15)]))), 1)) {
		rt.setSv(f, "transform", (yield* g.call(f, P("/proc/matrix"), null, [live(scale), 0, 0, 0, live(scale), 0])));
	}
	rt.modField(f, rt.sv(f, "holder"), "screen", live(f.src), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["C", "visible", "use_previous_title"] });

// /obj/screen/splash/proc/Fade  (code/_onclick/hud/screen_objects.dm:577)  may sleep
rt.def("/obj/screen/splash/proc/Fade", function* Fade(f: Frame, out: Value, qdel_after: Value) {
	f.vars = () => [out, qdel_after];
	if (live(qdel_after) === null) {
		qdel_after = 1;
	}
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if (truthy(live(out))) {
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 0, "time", 30]);
	} else {
		rt.setSv(f, "alpha", 0);
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "alpha", 255, "time", 30]);
	}
	if (!truthy(live(qdel_after))) return f.dot;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 30, 8]);
	return f.dot;
}, true);

// /obj/screen/splash/proc/Destroy  (code/_onclick/hud/screen_objects.dm:589)  may sleep
rt.def("/obj/screen/splash/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "holder"))) {
		(rt.modField(f, rt.sv(f, "holder"), "screen", live(f.src), subtract));
		rt.setSv(f, "holder", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
