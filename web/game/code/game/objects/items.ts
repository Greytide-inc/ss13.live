// From code/game/objects/items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalfire_overlay  (code/game/objects/items.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalfire_overlay", function InitGlobalfire_overlay(f: Frame) {
	rt.setGl("fire_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/fire.dmi"), "fire"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "fire_overlay", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalrpg_loot_items  (code/game/objects/items.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalrpg_loot_items", function InitGlobalrpg_loot_items(f: Frame) {
	rt.setGl("rpg_loot_items", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "rpg_loot_items", add);
	return f.dot;
});

rt.type(5108, "/obj/item", "/obj", {
	canMouseDown: 0,
	item_state: null,
	lefthand_file: rt.rsc("icons/mob/inhands/items_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/items_righthand.dmi"),
	worn_x_dimension: 32,
	worn_y_dimension: 32,
	inhand_x_dimension: 32,
	inhand_y_dimension: 32,
	alternate_worn_icon: null,
	alternate_worn_layer: null,
	hitsound: null,
	usesound: null,
	throwhitsound: null,
	w_class: 3,
	slot_flags: 0,
	master: null,
	heat_protection: 0,
	cold_protection: 0,
	max_heat_protection_temperature: null,
	min_cold_protection_temperature: null,
	actions: null,
	actions_types: null,
	flags_inv: null,
	item_color: null,
	body_parts_covered: 0,
	gas_transfer_coefficient: 1,
	permeability_coefficient: 1,
	siemens_coefficient: 1,
	slowdown: 0,
	armour_penetration: 0,
	allowed: null,
	hidden_uplink: null,
	equip_delay_self: 0,
	equip_delay_other: 20,
	strip_delay: 40,
	breakouttime: 0,
	materials: null,
	origin_tech: null,
	needs_permit: 0,
	attack_verb: null,
	species_exception: null,
	suittoggled: 0,
	hooded: 0,
	thrownby: null,
	embed_chance: 45,
	embedded_fall_chance: 5,
	embedded_pain_chance: 15,
	embedded_pain_multiplier: 2,
	embedded_fall_pain_multiplier: 5,
	embedded_impact_pain_multiplier: 4,
	embedded_unsafe_removal_pain_multiplier: 8,
	embedded_unsafe_removal_time: 30,
	flags_cover: 0,
	heat: 0,
	sharpness: 0,
	toolspeed: 1,
	block_chance: 0,
	hit_reaction_chance: 0,
	reach: 1,
	slot_equipment_priority: null,
	dog_fashion: null,
	rpg_loot: null,
	in_inventory: 0,
	force_string: null,
	last_force_string_check: 0,
	tip_timer: null,
	force_string_override: null,
	pass_flags: 1,
	pressure_resistance: 4,
	name: "item",
	icon: rt.rsc("icons/obj/items.dmi"),
	obj_integrity: 200,
	max_integrity: 200,
	mouse_drag_pointer: 1,
});

// /obj/item/proc/Initialize  (code/game/objects/items.dm:118)  may sleep
rt.def("/obj/item/proc/Initialize", function* Initialize(f: Frame) {
	let path: Value = null;
	let $e: any;
	f.vars = () => [path, $e];
	if (!truthy(rt.sv(f, "materials"))) {
		rt.setSv(f, "materials", rt.list());
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	path = null;
	rt.forList(f, 0, rt.sv(f, "actions_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		yield* g.new_(f, live(path), [live(f.src)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "actions_types", null);
	if (truthy(rt.gl("rpg_loot_items"))) {
		rt.setSv(f, "rpg_loot", (yield* g.new_(f, T("/datum/rpg_loot"), [live(f.src)])));
	}
	if (!truthy(rt.sv(f, "force_string"))) return f.dot;
	rt.setSv(f, "force_string_override", 1);
	return f.dot;
}, true);

// /obj/item/proc/Destroy  (code/game/objects/items.dm:132)  may sleep
rt.def("/obj/item/proc/Destroy", function* Destroy(f: Frame) {
	let m: Value = null, X: Value = null;
	let $e: any;
	f.vars = () => [m, X, $e];
	(rt.modSrcVar(f, "flags", 16760831, rt.bitAnd));
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (m = rt.sv(f, "loc")), "temporarilyRemoveItemFromInventory", [live(f.src), 1]);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(X)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "rpg_loot")]);
	rt.setSv(f, "rpg_loot", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/proc/check_allowed_items  (code/game/objects/items.dm:145)
rt.def("/obj/item/proc/check_allowed_items", function check_allowed_items(f: Frame, target: Value, not_inside: Value, target_self: Value) {
	if (((truthy((rt.isIn(f, live(f.src), live(target)) ? 1 : 0)) && !truthy(live(target_self))) || ((!truthy(rt.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(target))])) && !truthy(rt.call(f, P("/proc/isturf"), null, [live(target)]))) && truthy(live(not_inside))))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /obj/item/proc/blob_act  (code/game/objects/items.dm:151)  may sleep
rt.def("/obj/item/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!(truthy(live(B)) && isEqual(rt.fv(f, "loc", live(B)), rt.sv(f, "loc")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/verb/move_to_top  (code/game/objects/items.dm:169)
rt.def("/obj/item/verb/move_to_top", function move_to_top(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((((!truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])) || truthy(rt.fv(f, "stat", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", []))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	_T = rt.fv(f, "loc", live(f.src));
	rt.setFv(f, "loc", live(f.src), null);
	rt.setFv(f, "loc", live(f.src), live(_T));
	return f.dot;
}, false, { verb: { name: "Move To Top", category: "Object", src: 3, range: 1 } });

// /obj/item/proc/examine  (code/game/objects/items.dm:179)
rt.def("/obj/item/proc/examine", function examine(f: Frame) {
	let pronoun: Value = null, size: Value = null, msg: Value = null, techlvls: Value = null, _T: Value = null, mat: Value = null;
	let $e: any;
	f.vars = () => [pronoun, size, msg, techlvls, _T, mat, $e];
	rt.callSuper(f, [], rt.Args.Same);
	pronoun = null;
	if (isEqual(rt.fv(f, "gender", live(f.src)), "plural")) {
		pronoun = "They are";
	} else {
		pronoun = "It is";
	}
	size = rt.call(f, P("/proc/weightclass2text"), null, [rt.fv(f, "w_class", live(f.src))]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ a ＀ item.", [live(pronoun), live(size)])]);
	if (!truthy(rt.fv(f, "research_scanner", live(f.args[0])))) return f.dot;
	msg = "*--------* <BR>";
	if (truthy(rt.sv(f, "origin_tech"))) {
		msg = rt.modify(live(msg), "<span class='notice'>Testing potentials:</span><BR>", add);
		techlvls = rt.call(f, P("/proc/params2list"), null, [rt.sv(f, "origin_tech")]);
		_T = null;
		rt.forList(f, 0, live(techlvls));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			msg = rt.modify(live(msg), fmt("Tech: ＀ | magnitude: ＀ <BR>", [rt.call(f, P("/proc/CallTechName"), null, [live(_T)]), rt.index(live(techlvls), live(_T))]), add);
		}
		rt.endFor(f, 0);
	} else {
		msg = rt.modify(live(msg), "<span class='danger'>No tech origins detected.</span><BR>", add);
	}
	if (truthy(rt.len(f, rt.sv(f, "materials")))) {
		msg = rt.modify(live(msg), "<span class='notice'>Extractable materials:<BR>", add);
		mat = null;
		rt.forList(f, 0, rt.sv(f, "materials"));
		while (($e = rt.next(f, 0)) !== undefined) {
			mat = $e;
			msg = rt.modify(live(msg), fmt("＀<BR>", [rt.call(f, P("/proc/CallMaterialName"), null, [live(mat)])]), add);
		}
		rt.endFor(f, 0);
	} else {
		msg = rt.modify(live(msg), "<span class='danger'>No extractable materials detected.</span><BR>", add);
	}
	msg = rt.modify(live(msg), "*--------*", add);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(msg)]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/proc/attack_self  (code/game/objects/items.dm:211)  may sleep
rt.def("/obj/item/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/proc/interact  (code/game/objects/items.dm:214)  may sleep
rt.def("/obj/item/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if ((truthy(rt.sv(f, "hidden_uplink")) && truthy(rt.fv(f, "active", rt.sv(f, "hidden_uplink"))))) {
		yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(user)]);
		return 1;
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/item/proc/ui_act  (code/game/objects/items.dm:221)  may sleep
rt.def("/obj/item/proc/ui_act", function* ui_act(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["action", "params"] });

// /obj/item/proc/attack_hand  (code/game/objects/items.dm:225)  may sleep
rt.def("/obj/item/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let C: Value = null, affecting: Value = null, S: Value = null, pickup_from: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, C, affecting, S, pickup_from, $0, $1];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		if (truthy((rt.istype((C = live(user)), T("/mob/living/carbon")) ? 1 : 0))) {
			if ((truthy(rt.fv(f, "gloves", live(C))) && rt.gt(rt.gv(f, "max_heat_protection_temperature", rt.fv(f, "gloves", live(C))), 360))) {
				yield* g.srcCall(f, "extinguish");
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You put out the fire on ＀.</span>", [live(f.src)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You burn your hand on ＀!</span>", [live(f.src)])]);
				$0 = live(C);
				if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2), 0)) {
					$1 = "r";
				} else {
					$1 = "l";
				}
				if ((truthy((affecting = (yield* g.callName(f, $0, "get_bodypart", [fmt("＀_arm", [$1])])))) && truthy((yield* g.callName(f, live(affecting), "receive_damage", [0, 5]))))) {
					yield* g.callName(f, live(C), "update_damage_overlays", []);
				}
				return live(f.dot);
			}
		} else {
			yield* g.srcCall(f, "extinguish");
		}
	}
	if ((rt.gt(rt.sv(f, "acid_level"), 20) && !truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))))) {
		if (truthy((rt.istype((C = live(user)), T("/mob/living/carbon")) ? 1 : 0))) {
			if ((!truthy(rt.fv(f, "gloves", live(C))) || !truthy(rt.bitAnd(rt.gv(f, "resistance_flags", rt.fv(f, "gloves", live(C))), 48)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The acid on ＀ burns your hand!</span>", [live(f.src)])]);
				$0 = live(C);
				if (isEqual(rt.modulus(rt.fv(f, "active_hand_index", live(user)), 2), 0)) {
					$1 = "r";
				} else {
					$1 = "l";
				}
				if ((truthy((affecting = (yield* g.callName(f, $0, "get_bodypart", [fmt("＀_arm", [$1])])))) && truthy((yield* g.callName(f, live(affecting), "receive_damage", [0, 5]))))) {
					yield* g.callName(f, live(C), "update_damage_overlays", []);
				}
			}
		}
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		yield* g.callName(f, (S = rt.sv(f, "loc")), "remove_from_storage", [live(f.src), rt.fv(f, "loc", live(user))]);
	}
	if (truthy(rt.sv(f, "throwing"))) {
		yield* g.callName(f, rt.sv(f, "throwing"), "finalize", [0]);
	}
	if (isEqual(rt.sv(f, "loc"), live(user))) {
		if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(f.src)])))) {
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "pickup", live(user));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		$0 = rt.sv(f, "loc");
	} else {
		$0 = null;
	}
	pickup_from = $0;
	if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(f.src)])))) {
		yield* g.srcCall(f, "dropped", live(user));
	} else {
		if (!truthy(live(pickup_from))) return f.dot;
		yield* g.srcCall(f, "do_pickup_animation", live(user), live(pickup_from));
	}
	return f.dot;
}, true);

// /obj/item/proc/attack_paw  (code/game/objects/items.dm:276)  may sleep
rt.def("/obj/item/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	let S: Value = null, pickup_from: Value = null;
	let $0: any;
	f.vars = () => [user, S, pickup_from, $0];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		yield* g.callName(f, (S = rt.sv(f, "loc")), "remove_from_storage", [live(f.src), rt.fv(f, "loc", live(user))]);
	}
	if (truthy(rt.sv(f, "throwing"))) {
		yield* g.callName(f, rt.sv(f, "throwing"), "finalize", [0]);
	}
	if (isEqual(rt.sv(f, "loc"), live(user))) {
		if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(f.src)])))) {
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "pickup", live(user));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		$0 = rt.sv(f, "loc");
	} else {
		$0 = null;
	}
	pickup_from = $0;
	if (!truthy((yield* g.callName(f, live(user), "put_in_active_hand", [live(f.src)])))) {
		yield* g.srcCall(f, "dropped", live(user));
	} else {
		if (!truthy(live(pickup_from))) return f.dot;
		yield* g.srcCall(f, "do_pickup_animation", live(user), live(pickup_from));
	}
	return f.dot;
}, true);

// /obj/item/proc/attack_alien  (code/game/objects/items.dm:300)  may sleep
rt.def("/obj/item/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [user, A];
	if (!truthy(rt.gv(f, "has_fine_manipulation", (A = live(user))))) {
		if (truthy((rt.isIn(f, live(f.src), rt.fv(f, "contents", live(A))) ? 1 : 0))) {
			yield* g.callName(f, live(A), "dropItemToGround", [live(f.src)]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Your claws aren't capable of such fine manipulation!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_paw", live(A));
	return f.dot;
}, true);

// /obj/item/proc/attack_ai  (code/game/objects/items.dm:310)  may sleep
rt.def("/obj/item/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let R: Value = null;
	f.vars = () => [user, R];
	if (!truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/obj/item/weapon/robot_module")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "low_power_mode", (R = live(user))))) return f.dot;
	yield* g.callName(f, live(R), "activate_module", [live(f.src)]);
	yield* g.callName(f, rt.fv(f, "hud_used", live(R)), "update_robot_modules_display", []);
	return f.dot;
}, true);

// /obj/item/proc/attackby  (code/game/objects/items.dm:323)  may sleep
rt.def("/obj/item/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, rejections: Value = null, things: Value = null, len: Value = null, progress: Value = null;
	f.vars = () => [W, user, params, S, rejections, things, len, progress];
	if (!truthy((rt.istype(live(W), T("/obj/item/weapon/storage")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "use_to_pickup", (S = live(W))))) return f.dot;
	if (truthy(rt.fv(f, "collection_mode", live(S)))) {
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			rejections = rt.list();
			things = (yield* g.callName(f, rt.fv(f, "contents", rt.sv(f, "loc")), "Copy", []));
			if (isEqual(rt.fv(f, "collection_mode", live(S)), 2)) {
				things = (yield* g.call(f, P("/proc/typecache_filter_list"), null, [live(things), (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "type")]))]));
			}
			if (!truthy((len = rt.len(f, live(things))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You failed to pick up anything with ＀.</span>", [live(S)])]);
				return live(f.dot);
			}
			progress = (yield* g.new_(f, T("/datum/progressbar"), [live(user), live(len), rt.sv(f, "loc")]));
			while (truthy((yield* g.call(f, P("/proc/do_after"), null, [live(user), 10, 1, live(S), 0, (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/proc/handle_mass_pickup"), live(S), live(things), rt.sv(f, "loc"), live(rejections), live(progress)]))])))) {
				yield* g.call(f, P("/proc/sleep"), null, [1]);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(progress)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You put everything you could ＀ ＀.</span>", [rt.fv(f, "preposition", live(S)), live(S)])]);
		}
	} else {
		if (!truthy((yield* g.callName(f, live(S), "can_be_inserted", [live(f.src)])))) return f.dot;
		yield* g.callName(f, live(S), "handle_item_insertion", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/proc/handle_mass_pickup  (code/game/objects/items.dm:351)  may sleep
rt.def("/obj/item/proc/handle_mass_pickup", function* handle_mass_pickup(f: Frame, S: Value, things: Value, thing_loc: Value, rejections: Value, progress: Value) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [S, things, thing_loc, rejections, progress, I, $e];
	I = null;
	rt.forList(f, 0, live(things), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		(things = rt.modify(live(things), live(I), subtract));
		if (!isEqual(rt.fv(f, "loc", live(I)), live(thing_loc))) {
			continue;
		}
		if (truthy((rt.isIn(f, rt.fv(f, "type", live(I)), live(rejections)) ? 1 : 0))) {
			continue;
		}
		if (!truthy((yield* g.callName(f, live(S), "can_be_inserted", [null, live(I), "stop_messages", 1], rt.Args.Named)))) {
			if (rt.ge(rt.getLen(f, rt.fv(f, "contents", live(S))), rt.fv(f, "storage_slots", live(S)))) {
				break;
			}
			rejections = rt.modify(live(rejections), rt.fv(f, "type", live(I)), add);
			continue;
		}
		yield* g.callName(f, live(S), "handle_item_insertion", [live(I), 1]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
			return 1;
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(progress), "update", [subtract(rt.fv(f, "goal", live(progress)), rt.len(f, live(things)))]);
	return 0;
}, true, { argTypes: [{ type: 4, path: "/obj/item/weapon/storage" }, { path: "/list" }, { path: "/atom" }, { path: "/list" }, { path: "/datum/progressbar" }] });

// /obj/item/proc/hit_reaction  (code/game/objects/items.dm:375)
rt.def("/obj/item/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (truthy(rt.op(f, "Prob", [], [live(final_block_chance)]))) {
		rt.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ blocks ＀ with ＀!</span>", [live(owner), live(attack_text), live(f.src)])]);
		return 1;
	}
	return 0;
});

// /obj/item/proc/dropped  (code/game/objects/items.dm:384)  may sleep
rt.def("/obj/item/proc/dropped", function* dropped(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Remove", [live(user)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.bitAnd(16384, rt.sv(f, "flags")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	rt.setSv(f, "in_inventory", 0);
	return f.dot;
}, true);

// /obj/item/proc/do_pickup_animation  (code/game/objects/items.dm:394)  may sleep
rt.def("/obj/item/proc/do_pickup_animation", function* do_pickup_animation(f: Frame, target: Value, from: Value) {
	let I: Value = null, to_x: Value = null, to_y: Value = null, M: Value = null;
	f.vars = () => [target, from, I, to_x, to_y, M];
	if ((!truthy(live(target)) || !truthy(live(from)))) {
		return live(f.dot);
	}
	rt.setFv(f, "overlays", (I = (yield* g.call(f, P("/proc/image"), null, ["icon", rt.sv(f, "icon"), "icon_state", rt.sv(f, "icon_state"), "loc", live(from), "layer", 4.5], rt.Args.Named))), (yield* g.callName(f, rt.sv(f, "overlays"), "Copy", [])));
	rt.setFv(f, "pixel_x", live(I), rt.sv(f, "pixel_x"));
	rt.setFv(f, "pixel_y", live(I), rt.sv(f, "pixel_y"));
	to_x = multiply(subtract(rt.fv(f, "x", live(target)), rt.fv(f, "x", live(from))), rt.fv(f, "icon_size", rt.world()));
	to_y = multiply(subtract(rt.fv(f, "y", live(target)), rt.fv(f, "y", live(from))), rt.fv(f, "icon_size", rt.world()));
	yield* g.call(f, P("/proc/flick_overlay_view"), null, [live(I), live(from), 5]);
	yield* g.callName(f, (M = (yield* g.call(f, P("/proc/matrix"), null, [rt.fv(f, "transform", live(I))]))), "Scale", [0.6499999761581421]);
	rt.op(f, "Animate", [2, 14], [null, live(I), "alpha", 175, "pixel_x", live(to_x), "pixel_y", live(to_y), "transform", live(M), "time", 3, "easing", 3]);
	rt.op(f, "Animate", [2, 4], ["alpha", 0, "time", 2]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/proc/do_drop_animation  (code/game/objects/items.dm:411)  may sleep
rt.def("/obj/item/proc/do_drop_animation", function* do_drop_animation(f: Frame, source: Value) {
	let _T: Value = null, px: Value = null, py: Value = null;
	f.vars = () => [source, _T, px, py];
	_T = rt.sv(f, "loc");
	if (((!truthy(live(source)) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [live(_T)])))) || isEqual(live(_T), rt.getStep(f, live(source), 0)))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/sleep"), null, [0]);
	if ((!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || !isEqual(rt.sv(f, "loc"), live(_T)))) {
		return live(f.dot);
	}
	px = rt.sv(f, "pixel_x");
	py = rt.sv(f, "pixel_y");
	rt.setSv(f, "pixel_x", add(live(px), multiply(subtract(rt.fv(f, "x", live(source)), rt.fv(f, "x", live(_T))), rt.fv(f, "icon_size", rt.world()))));
	rt.setSv(f, "pixel_y", add(live(py), multiply(subtract(rt.fv(f, "y", live(source)), rt.fv(f, "y", live(_T))), rt.fv(f, "icon_size", rt.world()))));
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", live(px), "pixel_y", live(py), "time", 3, "easing", 3]);
	return f.dot;
}, true, { waitfor: false });

// /obj/item/proc/equipped  (code/game/objects/items.dm:447)  may sleep
rt.def("/obj/item/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, slot, X, A, $e];
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		A = live(X);
		if (truthy((yield* g.srcCall(f, "item_action_slot_check", live(slot), live(user))))) {
			yield* g.callName(f, live(A), "Grant", [live(user)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "in_inventory", 1);
	return f.dot;
}, true);

// /obj/item/proc/item_action_slot_check  (code/game/objects/items.dm:455)
rt.def("/obj/item/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if ((isEqual(live(slot), 18) || isEqual(live(slot), 19))) {
		return 0;
	}
	return 1;
});

// /obj/item/proc/mob_can_equip  (code/game/objects/items.dm:464)  may sleep
rt.def("/obj/item/proc/mob_can_equip", function* mob_can_equip(f: Frame, M: Value, equipper: Value, slot: Value, disable_warning: Value, bypass_equip_delay_self: Value) {
	f.vars = () => [M, equipper, slot, disable_warning, bypass_equip_delay_self];
	if (live(disable_warning) === null) {
		disable_warning = 0;
	}
	if (live(bypass_equip_delay_self) === null) {
		bypass_equip_delay_self = 0;
	}
	if (!truthy(live(M))) {
		return 0;
	}
	return (yield* g.callName(f, live(M), "can_equip", [live(f.src), live(slot), live(disable_warning), live(bypass_equip_delay_self)]));
}, true);

// /obj/item/verb/verb_pickup  (code/game/objects/items.dm:474)  may sleep
rt.def("/obj/item/verb/verb_pickup", function* verb_pickup(f: Frame) {
	if (((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) || truthy(rt.fv(f, "lying", live(f.usr))))) {
		return live(f.dot);
	}
	if ((yield* g.callName(f, live(f.usr), "get_active_held_item", [])) !== null) return f.dot;
	yield* g.callName(f, live(f.usr), "UnarmedAttack", [live(f.src)]);
	return f.dot;
}, true, { verb: { name: "Pick up", category: "Object", src: 3, range: 1 } });

// /obj/item/proc/ui_action_click  (code/game/objects/items.dm:484)  may sleep
rt.def("/obj/item/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, actiontype: Value) {
	f.vars = () => [user, actiontype];
	yield* g.srcCall(f, "attack_self", live(user));
	return f.dot;
}, true);

// /obj/item/proc/eyestab  (code/game/objects/items.dm:492)  may sleep
rt.def("/obj/item/proc/eyestab", function* eyestab(f: Frame, M: Value, user: Value) {
	let is_human_victim: Value = null, affecting: Value = null, H: Value = null, Mo: Value = null, U: Value = null, eyes: Value = null;
	f.vars = () => [M, user, is_human_victim, affecting, H, Mo, U, eyes];
	is_human_victim = 0;
	affecting = (yield* g.callName(f, live(M), "get_bodypart", ["head"]));
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy(live(affecting))) {
			return live(f.dot);
		}
		is_human_victim = 1;
		if ((((truthy(rt.gv(f, "head", (H = live(M)))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "head", live(H))), 4))) || (truthy(rt.fv(f, "wear_mask", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(H))), 2)))) || (truthy(rt.fv(f, "glasses", live(H))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "glasses", live(H))), 1))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You're going to need to remove that mask/helmet/glasses first!</span>"]);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		if ((truthy(rt.gv(f, "wear_mask", (Mo = live(M)))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(Mo))), 2)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You're going to need to remove that mask/helmet/glasses first!</span>"]);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/alien")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot locate any eyes on this creature!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/brain")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You cannot locate any organic eyes on this brain!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "hitsound", live(f.src)), 30, 1, -1]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(M)]);
	if (!isEqual(live(M), live(user))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='danger'>＀ has stabbed ＀ in the eye with ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='userdanger'>＀ stabs you in the eye with ＀!</span>", [live(user), live(f.src)])]);
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ has stabbed themself in the eyes with ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>You stab yourself in the eyes with ＀!</span>", [live(f.src)])]);
	}
	if (truthy(live(is_human_victim))) {
		yield* g.callName(f, (U = live(M)), "apply_damage", [7, "brute", live(affecting)]);
	} else {
		yield* g.callName(f, live(M), "take_bodypart_damage", [7]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(M), "attacked", fmt("＀", [rt.fv(f, "name", live(f.src))]), fmt("(INTENT: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))]))])]);
	yield* g.callName(f, live(M), "adjust_blurriness", [3]);
	yield* g.callName(f, live(M), "adjust_eye_damage", [(yield* g.call(f, P("/proc/rand"), null, [2, 4]))]);
	if (!truthy((eyes = (yield* g.callName(f, live(M), "getorganslot", ["eyes_sight"]))))) {
		return live(f.dot);
	}
	if (!rt.ge(rt.fv(f, "eye_damage", live(eyes)), 10)) return f.dot;
	yield* g.callName(f, live(M), "adjust_blurriness", [15]);
	if (!isEqual(rt.fv(f, "stat", live(M)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Your eyes start to bleed profusely!</span>"]);
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "disabilities", live(M)), 9))) {
		if (truthy((yield* g.callName(f, live(M), "become_nearsighted", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>You become nearsighted!</span>"]);
		}
	}
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		if (!isEqual(rt.fv(f, "stat", live(M)), 2)) {
			if (truthy((yield* g.callName(f, live(M), "drop_item", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>You drop what you're holding and clutch at your eyes!</span>"]);
			}
		}
		yield* g.callName(f, live(M), "adjust_blurriness", [10]);
		yield* g.callName(f, live(M), "Unconscious", [20]);
		yield* g.callName(f, live(M), "Knockdown", [40]);
	}
	if (!truthy(rt.op(f, "Prob", [], [add(subtract(rt.fv(f, "eye_damage", live(eyes)), 10), 1)]))) return f.dot;
	if (!truthy((yield* g.callName(f, live(M), "become_blind", [])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>You go blind!</span>"]);
	return f.dot;
}, true);

// /obj/item/proc/clean_blood  (code/game/objects/items.dm:567)
rt.def("/obj/item/proc/clean_blood", function clean_blood(f: Frame) {
	let index: Value = null, blood_splatter_icon: Value = null;
	f.vars = () => [index, blood_splatter_icon];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	if (!(truthy(rt.initial(f, live(f.src), "icon")) && truthy(rt.initial(f, live(f.src), "icon_state")))) return f.dot;
	index = rt.callSrc(f, "blood_splatter_index", []);
	if (!truthy((blood_splatter_icon = rt.index(rt.gl("blood_splatter_icons"), live(index))))) return f.dot;
	rt.callSrc(f, "cut_overlay", [live(blood_splatter_icon)]);
	return f.dot;
});

// /obj/item/clothing/gloves/proc/clean_blood  (code/game/objects/items.dm:576)
rt.def("/obj/item/clothing/gloves/proc/clean_blood", function clean_blood(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "transfer_blood", 0);
	return f.dot;
});

// /obj/item/proc/singularity_pull  (code/game/objects/items.dm:581)  may sleep
rt.def("/obj/item/proc/singularity_pull", function* singularity_pull(f: Frame) {
	if (rt.ge(live(f.args[1]), 7)) {
		yield* g.callSrc(f, "throw_at", [null, live(f.args[0]), null, 14, null, 3, "spin", 0], rt.Args.Named);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["S", "current_size"] });

// /obj/item/proc/throw_impact  (code/game/objects/items.dm:586)  may sleep
rt.def("/obj/item/proc/throw_impact", function* throw_impact(f: Frame, A: Value) {
	let L: Value = null, itempush: Value = null;
	f.vars = () => [A, L, itempush];
	if (!(truthy(live(A)) && !(!truthy(live(A)) || truthy(rt.fv(f, "gc_destroyed", live(A)))))) return f.dot;
	if ((truthy((yield* g.srcCall(f, "is_hot"))) && truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0)))) {
		yield* g.callName(f, (L = live(A)), "IgniteMob", []);
	}
	itempush = 1;
	if (rt.lt(rt.sv(f, "w_class"), 4)) {
		itempush = 0;
	}
	return (yield* g.callName(f, live(A), "hitby", [live(f.src), 0, live(itempush)]));
}, true, { waitfor: false });

// /obj/item/proc/throw_at  (code/game/objects/items.dm:596)  may sleep
rt.def("/obj/item/proc/throw_at", function* throw_at(f: Frame, target: Value, range: Value, speed: Value, thrower: Value, spin: Value, diagonals_first: Value, callback: Value) {
	f.vars = () => [target, range, speed, thrower, spin, diagonals_first, callback];
	if (live(spin) === null) {
		spin = 1;
	}
	if (live(diagonals_first) === null) {
		diagonals_first = 0;
	}
	rt.setSv(f, "thrownby", live(thrower));
	callback = (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/proc/after_throw"), live(callback)]));
	f.dot = (yield* g.callSuper(f, [live(target), live(range), live(speed), live(thrower), live(spin), live(diagonals_first), live(callback)]));
	return f.dot;
}, true);

// /obj/item/proc/after_throw  (code/game/objects/items.dm:603)  may sleep
rt.def("/obj/item/proc/after_throw", function* after_throw(f: Frame, callback: Value) {
	f.vars = () => [callback];
	if (truthy(live(callback))) {
		f.dot = (yield* g.callName(f, live(callback), "Invoke", []));
	}
	rt.setSv(f, "throw_speed", rt.initial(f, live(f.src), "throw_speed"));
	rt.setSv(f, "in_inventory", 0);
	return f.dot;
}, true, { argTypes: [{ path: "/datum/callback" }] });

// /obj/item/proc/remove_item_from_storage  (code/game/objects/items.dm:608)  may sleep
rt.def("/obj/item/proc/remove_item_from_storage", function* remove_item_from_storage(f: Frame, newLoc: Value) {
	let S: Value = null;
	f.vars = () => [newLoc, S];
	if (!truthy(live(newLoc))) {
		return 0;
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/storage")) ? 1 : 0))) {
		yield* g.callName(f, (S = rt.sv(f, "loc")), "remove_from_storage", [live(f.src), live(newLoc)]);
		return 1;
	}
	return 0;
}, true);

// /obj/item/proc/get_dismemberment_chance  (code/game/objects/items.dm:623)
rt.def("/obj/item/proc/get_dismemberment_chance", function get_dismemberment_chance(f: Frame, affecting: Value) {
	if (!truthy(rt.callName(f, live(affecting), "can_dismember", [live(f.src)]))) return f.dot;
	if (!((truthy(rt.sv(f, "sharpness")) || isEqual(rt.sv(f, "damtype"), "fire")) && rt.ge(rt.sv(f, "w_class"), 3))) return f.dot;
	f.dot = multiply(rt.sv(f, "force"), subtract(rt.sv(f, "w_class"), 1));
	return f.dot;
});

// /obj/item/proc/get_dismember_sound  (code/game/objects/items.dm:628)
rt.def("/obj/item/proc/get_dismember_sound", function get_dismember_sound(f: Frame) {
	if (isEqual(rt.sv(f, "damtype"), "fire")) {
		f.dot = rt.rsc("sound/weapons/sear.ogg");
	} else {
		f.dot = rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/misc/desceration-01.ogg"), rt.rsc("sound/misc/desceration-02.ogg"), rt.rsc("sound/misc/desceration-03.ogg")]);
	}
	return f.dot;
});

// /obj/item/proc/open_flame  (code/game/objects/items.dm:634)  may sleep
rt.def("/obj/item/proc/open_flame", function* open_flame(f: Frame, flame_heat: Value) {
	let location: Value = null, M: Value = null, success: Value = null;
	f.vars = () => [flame_heat, location, M, success];
	if (live(flame_heat) === null) {
		flame_heat = 700;
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(location = rt.sv(f, "loc"))])))) {
		M = live(location);
		success = 0;
		if (isEqual(live(f.src), (yield* g.callName(f, live(M), "get_item_by_slot", [2])))) {
			success = 1;
		}
		if (truthy(live(success))) {
			location = rt.getStep(f, live(M), 0);
		}
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(location)])))) return f.dot;
	yield* g.callName(f, live(location), "hotspot_expose", [live(flame_heat), 5]);
	return f.dot;
}, true);

// /obj/item/proc/ignition_effect  (code/game/objects/items.dm:646)
rt.def("/obj/item/proc/ignition_effect", function ignition_effect(f: Frame, A: Value, user: Value) {
	if (truthy(rt.callSrc(f, "is_hot", []))) {
		f.dot = fmt("<span class='notice'>＀ lights ＀ with ＀.</span>", [live(user), live(A), live(f.src)]);
	} else {
		f.dot = "";
	}
	return f.dot;
});

// /obj/item/proc/burn  (code/game/objects/items.dm:669)  may sleep
rt.def("/obj/item/proc/burn", function* burn(f: Frame) {
	let _T: Value = null, ash_type: Value = null, A: Value = null;
	f.vars = () => [_T, ash_type, A];
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	ash_type = T("/obj/effect/decal/cleanable/ash");
	if ((isEqual(rt.sv(f, "w_class"), 5) || isEqual(rt.sv(f, "w_class"), 6))) {
		ash_type = T("/obj/effect/decal/cleanable/ash/large");
	}
	rt.modField(f, (A = (yield* g.new_(f, live(ash_type), [live(_T)]))), "desc", fmt("\nLooks like this used to be ＇！ some time ago.", [rt.sv(f, "name")]), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/proc/acid_melt  (code/game/objects/items.dm:679)  may sleep
rt.def("/obj/item/proc/acid_melt", function* acid_melt(f: Frame) {
	let _T: Value = null, MO: Value = null;
	f.vars = () => [_T, MO];
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	_T = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "pixel_x", (MO = (yield* g.new_(f, T("/obj/effect/decal/cleanable/molten_object"), [live(_T)]))), (yield* g.call(f, P("/proc/rand"), null, [-16, 16])));
	rt.setFv(f, "pixel_y", live(MO), (yield* g.call(f, P("/proc/rand"), null, [-16, 16])));
	rt.setFv(f, "desc", live(MO), fmt("Looks like this was ＇！ some time ago.", [live(f.src)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/proc/microwave_act  (code/game/objects/items.dm:688)
rt.def("/obj/item/proc/microwave_act", function microwave_act(f: Frame, M: Value) {
	if (!(truthy(live(M)) && rt.lt(rt.fv(f, "dirty", live(M)), 100))) return f.dot;
	rt.incField(f, live(M), "dirty", 1, true);
	return f.dot;
});

// /obj/item/proc/set_force_string  (code/game/objects/items.dm:694)
rt.def("/obj/item/proc/set_force_string", function set_force_string(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "force");
	if (rt.inRange($0, 0, 4)) {
		rt.setSv(f, "force_string", "very low");
	} else if (rt.inRange($0, 4, 7)) {
		rt.setSv(f, "force_string", "low");
	} else if (rt.inRange($0, 7, 10)) {
		rt.setSv(f, "force_string", "medium");
	} else if (rt.inRange($0, 10, 11)) {
		rt.setSv(f, "force_string", "high");
	} else if (rt.inRange($0, 11, 20)) {
		rt.setSv(f, "force_string", "robust");
	} else if (rt.inRange($0, 20, 25)) {
		rt.setSv(f, "force_string", "very robust");
	} else {
		rt.setSv(f, "force_string", "exceptionally robust");
	}
	rt.setSv(f, "last_force_string_check", rt.sv(f, "force"));
	return f.dot;
});

// /obj/item/proc/openTip  (code/game/objects/items.dm:712)
rt.def("/obj/item/proc/openTip", function openTip(f: Frame, location: Value, control: Value, params: Value, user: Value) {
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any, $6: any, $7: any, $8: any, $9: any, $10: any;
	f.vars = () => [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10];
	if ((!isEqual(rt.sv(f, "last_force_string_check"), rt.sv(f, "force")) && !truthy(rt.sv(f, "force_string_override")))) {
		rt.callSrc(f, "set_force_string", []);
	}
	if (!truthy(rt.sv(f, "force_string_override"))) {
		$0 = null;
		$1 = live(user);
		$2 = null;
		$3 = live(f.src);
		$4 = null;
		$5 = live(params);
		$6 = "title";
		$7 = rt.sv(f, "name");
		$8 = "content";
		$9 = rt.sv(f, "desc");
		if (truthy(rt.sv(f, "force"))) {
			$10 = fmt("<b>Force:</b> ＀", [rt.sv(f, "force_string")]);
		} else {
			$10 = "";
		}
		rt.call(f, P("/proc/openToolTip"), null, [$0, $1, $2, $3, $4, $5, $6, $7, $8, fmt("＀<br>＀", [$9, $10]), "theme", ""], rt.Args.Named);
	} else {
		rt.call(f, P("/proc/openToolTip"), null, [null, live(user), null, live(f.src), null, live(params), "title", rt.sv(f, "name"), "content", fmt("＀<br><b>Force:</b> ＀", [rt.sv(f, "desc"), rt.sv(f, "force_string")]), "theme", ""], rt.Args.Named);
	}
	return f.dot;
});

// /obj/item/proc/MouseEntered  (code/game/objects/items.dm:720)  may sleep
rt.def("/obj/item/proc/MouseEntered", function* MouseEntered(f: Frame) {
	let timedelay: Value = null, user: Value = null;
	f.vars = () => [timedelay, user];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "in_inventory")) && truthy(rt.gv(f, "enable_tips", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr))))))) return f.dot;
	timedelay = divide(rt.gv(f, "tip_delay", rt.gv(f, "prefs", rt.fv(f, "client", live(f.usr)))), 100);
	user = live(f.usr);
	rt.setSv(f, "tip_timer", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/proc/openTip"), live(f.args[0]), live(f.args[1]), live(f.args[2]), live(user)])), live(timedelay), 8])));
	return f.dot;
}, true, { args: ["location", "control", "params"] });

// /obj/item/proc/MouseExited  (code/game/objects/items.dm:727)  may sleep
rt.def("/obj/item/proc/MouseExited", function* MouseExited(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "tip_timer")]);
	yield* g.call(f, P("/proc/closeToolTip"), null, [live(f.usr)]);
	return f.dot;
}, true);
