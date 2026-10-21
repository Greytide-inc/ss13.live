// From code/modules/projectiles/gun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5110, "/obj/item/weapon/gun", "/obj/item/weapon", {
	automatic: 0,
	fire_sound: "gunshot",
	suppressed: 0,
	can_suppress: 0,
	can_unsuppress: 1,
	recoil: 0,
	clumsy_check: 1,
	chambered: null,
	trigger_guard: 1,
	sawn_desc: null,
	sawn_state: 0,
	burst_size: 1,
	fire_delay: 0,
	firing_burst: 0,
	semicd: 0,
	weapon_weight: 1,
	spread: 0,
	randomspread: 1,
	gun_light: null,
	can_flashlight: 0,
	bayonet: null,
	can_bayonet: 0,
	alight: null,
	upgrades: null,
	ammo_x_offset: 0,
	ammo_y_offset: 0,
	flight_x_offset: 0,
	flight_y_offset: 0,
	knife_x_offset: 0,
	knife_y_offset: 0,
	zoomable: 0,
	zoomed: 0,
	zoom_amt: 3,
	zoom_out_amt: 0,
	azoom: null,
	pin: rt.typePath("/obj/item/device/firing_pin"),
	flags: 64,
	throw_speed: 3,
	throw_range: 5,
	name: "gun",
	desc: "It's a gun. It's pretty terrible, though.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "detective",
	item_state: "gun",
	slot_flags: 512,
	materials: null,
	w_class: 3,
	throwforce: 5,
	force: 5,
	origin_tech: "combat=1",
	needs_permit: 1,
	unique_rename: 0,
	attack_verb: null,
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
});

// /obj/item/weapon/gun/proc/<init>  (code/modules/projectiles/gun.dm:52)
rt.def("/obj/item/weapon/gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "upgrades", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	rt.setSv(f, "attack_verb", rt.list("struck", "hit", "bashed"));
	return f.dot;
});

// /obj/item/weapon/gun/proc/Initialize  (code/modules/projectiles/gun.dm:69)  may sleep
rt.def("/obj/item/weapon/gun/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "pin"))) {
		rt.setSv(f, "pin", (yield* g.new_(f, rt.sv(f, "pin"), [live(f.src)])));
	}
	if (truthy(rt.sv(f, "gun_light"))) {
		rt.setSv(f, "alight", (yield* g.new_(f, T("/datum/action/item_action/toggle_gunlight"), [live(f.src)])));
	}
	yield* g.srcCall(f, "build_zooming");
	return f.dot;
}, true);

// /obj/item/weapon/gun/proc/CheckParts  (code/modules/projectiles/gun.dm:78)  may sleep
rt.def("/obj/item/weapon/gun/proc/CheckParts", function* CheckParts(f: Frame) {
	let G: Value = null;
	f.vars = () => [G];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((G = rt.locateIn(f, T("/obj/item/weapon/gun"), rt.sv(f, "contents"))))) return f.dot;
	rt.setFv(f, "loc", live(G), rt.sv(f, "loc"));
	yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "pin", live(G))]);
	rt.setFv(f, "pin", live(G), null);
	yield* g.srcCall(f, "visible_message", fmt("＀ can now fit a new pin, but the old one was destroyed in the process.", [live(G)]), null, null, 3);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["parts_list"] });

// /obj/item/weapon/gun/proc/examine  (code/modules/projectiles/gun.dm:88)
rt.def("/obj/item/weapon/gun/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "pin"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("It has ＀ installed.", [rt.sv(f, "pin")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It doesn't have a firing pin installed, and won't fire."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/proc/shoot_with_empty_chamber  (code/modules/projectiles/gun.dm:106)
rt.def("/obj/item/weapon/gun/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>*click*</span>"]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	return f.dot;
});

// /obj/item/weapon/gun/proc/shoot_live_shot  (code/modules/projectiles/gun.dm:112)
rt.def("/obj/item/weapon/gun/proc/shoot_live_shot", function shoot_live_shot(f: Frame, user: Value, pointblank: Value, pbtarget: Value, message: Value) {
	f.vars = () => [pointblank, pbtarget, message];
	if (live(pointblank) === null) {
		pointblank = 0;
	}
	if (live(pbtarget) === null) {
		pbtarget = null;
	}
	if (live(message) === null) {
		message = 1;
	}
	if (truthy(rt.sv(f, "recoil"))) {
		rt.call(f, P("/proc/shake_camera"), null, [live(user), add(rt.sv(f, "recoil"), 1), rt.sv(f, "recoil")]);
	}
	if (truthy(rt.sv(f, "suppressed"))) {
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "fire_sound"), 10, 1]);
	} else {
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "fire_sound"), 50, 1]);
		if (!truthy(live(message))) return f.dot;
		if (truthy(live(pointblank))) {
			rt.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fires ＀ point blank at ＀!</span>", [live(user), live(f.src), live(pbtarget)]), null, null, 3]);
		} else {
			rt.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fires ＀!</span>", [live(user), live(f.src)]), null, null, 3]);
		}
	}
	return f.dot;
});

// /obj/item/weapon/gun/proc/emp_act  (code/modules/projectiles/gun.dm:125)  may sleep
rt.def("/obj/item/weapon/gun/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [severity, O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "emp_act", [live(severity)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/proc/afterattack  (code/modules/projectiles/gun.dm:133)  may sleep
rt.def("/obj/item/weapon/gun/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let L: Value = null, shot_leg: Value = null, bonus_spread: Value = null, loop_counter: Value = null, H: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [target, user, flag, params, L, shot_leg, bonus_spread, loop_counter, H, G, $e];
	if (truthy(rt.sv(f, "firing_burst"))) {
		return live(f.dot);
	}
	if (truthy(live(flag))) {
		if (truthy((rt.isIn(f, live(target), rt.fv(f, "contents", live(user))) ? 1 : 0))) {
			return live(f.dot);
		}
		if ((!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(target)]))) || isEqual(rt.fv(f, "a_intent", live(user)), "harm"))) {
			return live(f.dot);
		}
		if ((isEqual(live(target), live(user)) && !isEqual(rt.fv(f, "zone_selected", live(user)), "mouth"))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "can_trigger_gun", (L = live(user)))))) {
			return live(f.dot);
		}
	}
	if (!truthy((yield* g.srcCall(f, "can_shoot")))) {
		yield* g.srcCall(f, "shoot_with_empty_chamber", live(user));
		return live(f.dot);
	}
	if (truthy(live(flag))) {
		if (isEqual(rt.fv(f, "zone_selected", live(user)), "mouth")) {
			yield* g.srcCall(f, "handle_suicide", live(user), live(target), live(params));
			return live(f.dot);
		}
	}
	if (truthy(rt.sv(f, "clumsy_check"))) {
		if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
			if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [40])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>You shoot yourself in the foot with ＀!</span>", [live(f.src)])]);
				shot_leg = rt.op(f, "PickUnweighted", [2], ["l_leg", "r_leg"]);
				yield* g.callSrc(f, "process_fire", [null, live(user), null, live(user), null, 0, null, live(params), "zone_override", live(shot_leg)], rt.Args.Named);
				yield* g.callName(f, live(user), "drop_item", []);
				return live(f.dot);
			}
		}
	}
	if ((isEqual(rt.sv(f, "weapon_weight"), 3) && truthy((yield* g.callName(f, live(user), "get_inactive_held_item", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='userdanger'>You need both hands free to fire ＀!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	bonus_spread = 0;
	loop_counter = 0;
	if ((truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(user)), "harm"))) {
		H = live(user);
		G = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(H)), T("/obj/item/weapon/gun"));
		while (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			if ((isEqual(live(G), live(f.src)) || rt.ge(rt.fv(f, "weapon_weight", live(G)), 2))) {
				continue;
			}
			if (truthy((yield* g.callName(f, live(G), "can_trigger_gun", [live(user)])))) {
				bonus_spread = rt.modify(live(bonus_spread), multiply(24, rt.fv(f, "weapon_weight", live(G))), add);
				loop_counter = rt.inc(live(loop_counter), 1);
				yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(G), P("/obj/item/weapon/gun/proc/process_fire"), live(target), live(user), 1, live(params), null, live(bonus_spread)])), live(loop_counter)]);
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "process_fire", live(target), live(user), 1, live(params), null, live(bonus_spread));
	return f.dot;
}, true);

// /obj/item/weapon/gun/proc/can_trigger_gun  (code/modules/projectiles/gun.dm:188)  may sleep
rt.def("/obj/item/weapon/gun/proc/can_trigger_gun", function* can_trigger_gun(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((!truthy((yield* g.srcCall(f, "handle_pins", live(user)))) || !truthy((yield* g.callName(f, live(user), "can_use_guns", [live(f.src)]))))) {
		return 0;
	}
	return 1;
}, true);

// /obj/item/weapon/gun/proc/handle_pins  (code/modules/projectiles/gun.dm:195)  may sleep
rt.def("/obj/item/weapon/gun/proc/handle_pins", function* handle_pins(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "pin"))) {
		if ((truthy((yield* g.callName(f, rt.sv(f, "pin"), "pin_auth", [live(user)]))) || truthy(rt.fv(f, "emagged", rt.sv(f, "pin"))))) {
			return 1;
		} else {
			yield* g.callName(f, rt.sv(f, "pin"), "auth_fail", [live(user)]);
			return 0;
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀'s trigger is locked. This weapon doesn't have a firing pin installed!</span>", [live(f.src)])]);
	}
	return 0;
}, true);

// /obj/item/weapon/gun/proc/process_fire  (code/modules/projectiles/gun.dm:208)  may sleep
rt.def("/obj/item/weapon/gun/proc/process_fire", function* process_fire(f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value) {
	let sprd: Value = null, randomized_gun_spread: Value = null, rand_spr: Value = null, randomized_bonus_spread: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [target, user, message, params, zone_override, bonus_spread, sprd, randomized_gun_spread, rand_spr, randomized_bonus_spread, i, $e];
	if (live(message) === null) {
		message = 1;
	}
	if (live(bonus_spread) === null) {
		bonus_spread = 0;
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "semicd"))) {
		return live(f.dot);
	}
	sprd = 0;
	randomized_gun_spread = 0;
	rand_spr = (yield* g.call(f, P("/proc/rand"), null, []));
	if (truthy(rt.sv(f, "spread"))) {
		randomized_gun_spread = (yield* g.call(f, P("/proc/rand"), null, [0, rt.sv(f, "spread")]));
	}
	randomized_bonus_spread = (yield* g.call(f, P("/proc/rand"), null, [0, live(bonus_spread)]));
	if (rt.gt(rt.sv(f, "burst_size"), 1)) {
		rt.setSv(f, "firing_burst", 1);
		i = null;
		rt.forRange(f, 0, 1, rt.sv(f, "burst_size"), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!truthy(live(user))) {
				break;
			}
			if (!truthy((rt.istype(live(user), T("/mob/living/silicon")) ? 1 : 0))) {
				if ((rt.gt(live(i), 1) && !truthy((yield* g.callName(f, live(user), "is_holding", [live(f.src)]))))) {
					break;
				}
			}
			if ((truthy(rt.sv(f, "chambered")) && truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) {
				if (truthy(rt.sv(f, "randomspread"))) {
					sprd = (yield* g.call(f, P("/proc/round"), null, [multiply(multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), 1.399999976158142), add(live(randomized_gun_spread), live(randomized_bonus_spread)))]));
				} else {
					sprd = (yield* g.call(f, P("/proc/round"), null, [multiply(subtract(multiply(divide(live(rand_spr), rt.sv(f, "burst_size")), live(i)), add(0.5, multiply(live(rand_spr), 0.25))), add(live(randomized_gun_spread), live(randomized_bonus_spread)))]));
				}
				if (!truthy((yield* g.callName(f, rt.sv(f, "chambered"), "fire_casing", [live(target), live(user), live(params), null, rt.sv(f, "suppressed"), live(zone_override), live(sprd)])))) {
					yield* g.srcCall(f, "shoot_with_empty_chamber", live(user));
					break;
				}
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(target)])), 1)) {
					yield* g.srcCall(f, "shoot_live_shot", live(user), 1, live(target), live(message));
				} else {
					yield* g.srcCall(f, "shoot_live_shot", live(user), 0, live(target), live(message));
				}
			} else {
				yield* g.srcCall(f, "shoot_with_empty_chamber", live(user));
				break;
			}
			yield* g.srcCall(f, "process_chamber");
			yield* g.srcCall(f, "update_icon");
			yield* g.call(f, P("/proc/sleep"), null, [rt.sv(f, "fire_delay")]);
		}
		rt.endFor(f, 0);
		rt.setSv(f, "firing_burst", 0);
	} else {
		if (truthy(rt.sv(f, "chambered"))) {
			sprd = (yield* g.call(f, P("/proc/round"), null, [multiply(multiply(subtract((yield* g.call(f, P("/proc/rand"), null, [])), 0.5), 1.399999976158142), add(live(randomized_gun_spread), live(randomized_bonus_spread)))]));
			if (!truthy((yield* g.callName(f, rt.sv(f, "chambered"), "fire_casing", [live(target), live(user), live(params), null, rt.sv(f, "suppressed"), live(zone_override), live(sprd)])))) {
				yield* g.srcCall(f, "shoot_with_empty_chamber", live(user));
				return live(f.dot);
			} else {
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(target)])), 1)) {
					yield* g.srcCall(f, "shoot_live_shot", live(user), 1, live(target), live(message));
				} else {
					yield* g.srcCall(f, "shoot_live_shot", live(user), 0, live(target), live(message));
				}
			}
		} else {
			yield* g.srcCall(f, "shoot_with_empty_chamber", live(user));
			return live(f.dot);
		}
		yield* g.srcCall(f, "process_chamber");
		yield* g.srcCall(f, "update_icon");
		rt.setSv(f, "semicd", 1);
		rt.spawnTail(f, rt.sv(f, "fire_delay"), "/obj/item/weapon/gun/proc/process_fire: spawn at modules/projectiles/gun.dm:266", target, user, message, params, zone_override, bonus_spread, sprd, randomized_gun_spread, rand_spr, randomized_bonus_spread, i);
	}
	if (truthy(live(user))) {
		yield* g.callName(f, live(user), "update_inv_hands", []);
	}
	return 1;
}, true, { argTypes: [{ type: 28, path: "/atom" }, { type: 12, path: "/mob/living" }, {  }, {  }, {  }, {  }] });

// a spawn(rt.srcVarI(f, $ic[58])) body of /obj/item/weapon/gun/proc/process_fire, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/gun/proc/process_fire: spawn at modules/projectiles/gun.dm:266", function* (f: Frame, target: Value, user: Value, message: Value, params: Value, zone_override: Value, bonus_spread: Value, sprd: Value, randomized_gun_spread: Value, rand_spr: Value, randomized_bonus_spread: Value, i: Value) {
	f.vars = () => [target, user, message, params, zone_override, bonus_spread, sprd, randomized_gun_spread, rand_spr, randomized_bonus_spread, i];
	rt.setSv(f, "semicd", 0);
	return null;
});

// /obj/item/weapon/gun/proc/update_icon  (code/modules/projectiles/gun.dm:275)
rt.def("/obj/item/weapon/gun/proc/update_icon", function update_icon(f: Frame) {
	let state: Value = null, flashlight_overlay: Value = null, knife_overlay: Value = null;
	let $0: any;
	f.vars = () => [state, flashlight_overlay, knife_overlay, $0];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if ((truthy(rt.sv(f, "gun_light")) && truthy(rt.sv(f, "can_flashlight")))) {
		if (truthy(rt.fv(f, "on", rt.sv(f, "gun_light")))) {
			$0 = "_on";
		} else {
			$0 = "";
		}
		state = fmt("flight＀", [$0]);
		if (truthy((rt.isIn(f, rt.fv(f, "icon_state", rt.sv(f, "gun_light")), rt.call(f, P("/proc/icon_states"), null, [rt.rsc("icons/obj/guns/flashlights.dmi")])) ? 1 : 0))) {
			state = rt.fv(f, "icon_state", rt.sv(f, "gun_light"));
		}
		rt.setFv(f, "pixel_x", (flashlight_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/guns/flashlights.dmi"), live(state)])), rt.sv(f, "flight_x_offset"));
		rt.setFv(f, "pixel_y", live(flashlight_overlay), rt.sv(f, "flight_y_offset"));
		rt.callSrc(f, "add_overlay", [live(flashlight_overlay)]);
	}
	if (!(truthy(rt.sv(f, "bayonet")) && truthy(rt.sv(f, "can_bayonet")))) return f.dot;
	state = "bayonet";
	if (truthy((rt.isIn(f, rt.fv(f, "icon_state", rt.sv(f, "bayonet")), rt.call(f, P("/proc/icon_states"), null, [rt.rsc("icons/obj/guns/bayonets.dmi")])) ? 1 : 0))) {
		state = rt.fv(f, "icon_state", rt.sv(f, "bayonet"));
	}
	rt.setFv(f, "pixel_x", (knife_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/guns/bayonets.dmi"), live(state)])), rt.sv(f, "knife_x_offset"));
	rt.setFv(f, "pixel_y", live(knife_overlay), rt.sv(f, "knife_y_offset"));
	rt.callSrc(f, "add_overlay", [live(knife_overlay)]);
	return f.dot;
});

// /obj/item/weapon/gun/proc/attack  (code/modules/projectiles/gun.dm:295)  may sleep
rt.def("/obj/item/weapon/gun/proc/attack", function* attack(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		if (truthy(rt.sv(f, "bayonet"))) {
			yield* g.callName(f, live(f.args[0]), "attackby", [rt.sv(f, "bayonet"), live(f.args[1])]);
			return live(f.dot);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return live(f.dot);
}, true, { args: ["M", "user"] });

// /obj/item/weapon/gun/proc/attack_obj  (code/modules/projectiles/gun.dm:304)  may sleep
rt.def("/obj/item/weapon/gun/proc/attack_obj", function* attack_obj(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		if (truthy(rt.sv(f, "bayonet"))) {
			yield* g.callName(f, live(f.args[0]), "attackby", [rt.sv(f, "bayonet"), live(f.args[1])]);
			return live(f.dot);
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user"] });

// /obj/item/weapon/gun/proc/attackby  (code/modules/projectiles/gun.dm:311)  may sleep
rt.def("/obj/item/weapon/gun/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null, K: Value = null;
	f.vars = () => [S, K];
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/flashlight/seclite")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "can_flashlight"))) {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
		S = live(f.args[0]);
		if (!truthy(rt.sv(f, "gun_light"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You click ％！ into place on ％！.</span>", [live(S), live(f.src)])]);
			if (truthy(rt.fv(f, "on", live(S)))) {
				yield* g.srcCall(f, "set_light", 0);
			}
			rt.setSv(f, "gun_light", live(S));
			yield* g.srcCall(f, "update_icon");
			yield* g.srcCall(f, "update_gunlight", live(f.args[1]));
			rt.setSv(f, "alight", (yield* g.new_(f, T("/datum/action/item_action/toggle_gunlight"), [live(f.src)])));
			if (isEqual(rt.sv(f, "loc"), live(f.args[1]))) {
				yield* g.callName(f, rt.sv(f, "alight"), "Grant", [live(f.args[1])]);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/kitchen/knife")) ? 1 : 0))) {
			if (!truthy(rt.sv(f, "can_bayonet"))) {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
			K = live(f.args[0]);
			if (!truthy(rt.sv(f, "bayonet"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach ％！ to the front of ％！.</span>", [live(K), live(f.src)])]);
				rt.setSv(f, "bayonet", live(K));
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "gun_light"))) {
					S = rt.sv(f, "gun_light");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unscrew the seclite from ％！.</span>", [live(f.src)])]);
					rt.setSv(f, "gun_light", null);
					yield* g.callName(f, live(S), "forceMove", [rt.getStep(f, live(f.args[1]), 0)]);
					yield* g.srcCall(f, "update_gunlight", live(f.args[1]));
					yield* g.callName(f, live(S), "update_brightness", [live(f.args[1])]);
					yield* g.srcCall(f, "update_icon");
					yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "alight")]);
					rt.setSv(f, "alight", null);
				}
				if (truthy(rt.sv(f, "bayonet"))) {
					yield* g.callName(f, (K = rt.sv(f, "bayonet")), "forceMove", [rt.getStep(f, live(f.args[1]), 0)]);
					rt.setSv(f, "bayonet", null);
					yield* g.srcCall(f, "update_icon");
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/gun/proc/toggle_gunlight  (code/modules/projectiles/gun.dm:358)  may sleep
rt.def("/obj/item/weapon/gun/proc/toggle_gunlight", function* toggle_gunlight(f: Frame) {
	let user: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (!truthy(rt.sv(f, "gun_light"))) {
		return live(f.dot);
	}
	user = live(f.usr);
	rt.setFv(f, "on", rt.sv(f, "gun_light"), (!truthy(rt.fv(f, "on", rt.sv(f, "gun_light"))) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.fv(f, "on", rt.sv(f, "gun_light")))) {
		$1 = "on";
	} else {
		$1 = "off";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You toggle the gunlight ＀.</span>", [$1])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	yield* g.srcCall(f, "update_gunlight", live(user));
	return live(f.dot);
}, true);

// /obj/item/weapon/gun/proc/update_gunlight  (code/modules/projectiles/gun.dm:371)  may sleep
rt.def("/obj/item/weapon/gun/proc/update_gunlight", function* update_gunlight(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	if (live(user) === null) {
		user = null;
	}
	if (truthy(rt.sv(f, "gun_light"))) {
		if (truthy(rt.fv(f, "on", rt.sv(f, "gun_light")))) {
			yield* g.srcCall(f, "set_light", rt.fv(f, "brightness_on", rt.sv(f, "gun_light")));
		} else {
			yield* g.srcCall(f, "set_light", 0);
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.srcCall(f, "set_light", 0);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/proc/pickup  (code/modules/projectiles/gun.dm:384)  may sleep
rt.def("/obj/item/weapon/gun/proc/pickup", function* pickup(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "azoom"))) {
		yield* g.callName(f, rt.sv(f, "azoom"), "Grant", [live(f.args[0])]);
	}
	if (!truthy(rt.sv(f, "alight"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "alight"), "Grant", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/proc/dropped  (code/modules/projectiles/gun.dm:391)  may sleep
rt.def("/obj/item/weapon/gun/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "zoom", live(f.args[0]), 0);
	if (truthy(rt.sv(f, "azoom"))) {
		yield* g.callName(f, rt.sv(f, "azoom"), "Remove", [live(f.args[0])]);
	}
	if (!truthy(rt.sv(f, "alight"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "alight"), "Remove", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/proc/handle_suicide  (code/modules/projectiles/gun.dm:399)  may sleep
rt.def("/obj/item/weapon/gun/proc/handle_suicide", function* handle_suicide(f: Frame, user: Value, target: Value, params: Value) {
	f.vars = () => [user, target, params];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "semicd"))) {
		return live(f.dot);
	}
	if (isEqual(live(user), live(target))) {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ sticks ＀ in ＀ mouth, ready to pull the trigger...</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", []))]), fmt("<span class='userdanger'>You stick ＀ in your mouth, ready to pull the trigger...</span>", [live(f.src)])]);
	} else {
		yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ points ＀ at ＀'s head, ready to pull the trigger...</span>", [live(user), live(f.src), live(target)]), fmt("<span class='userdanger'>＀ points ＀ at your head, ready to pull the trigger...</span>", [live(user), live(f.src)])]);
	}
	rt.setSv(f, "semicd", 1);
	if ((!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target), 120]))) || !isEqual(rt.fv(f, "zone_selected", live(user)), "mouth"))) {
		if (truthy(live(user))) {
			if (isEqual(live(user), live(target))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ decided not to shoot.</span>", [live(user)])]);
			} else {
				if ((truthy(live(target)) && truthy((yield* g.callName(f, live(target), "Adjacent", [live(user)]))))) {
					yield* g.callName(f, live(target), "visible_message", [fmt("<span class='notice'>＀ has decided to spare ＀</span>", [live(user), live(target)]), fmt("<span class='notice'>＀ has decided to spare your life!</span>", [live(user)])]);
				}
			}
		}
		rt.setSv(f, "semicd", 0);
		return live(f.dot);
	}
	rt.setSv(f, "semicd", 0);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ pulls the trigger!</span>", [live(user)]), fmt("<span class='userdanger'>＀ pulls the trigger!</span>", [live(user)])]);
	if ((truthy(rt.sv(f, "chambered")) && truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) {
		(rt.modField(f, rt.fv(f, "BB", rt.sv(f, "chambered")), "damage", 5, multiply));
	}
	yield* g.srcCall(f, "process_fire", live(target), live(user), 1, live(params));
	return f.dot;
}, true);

// /obj/item/weapon/gun/proc/unlock  (code/modules/projectiles/gun.dm:434)  may sleep
rt.def("/obj/item/weapon/gun/proc/unlock", function* unlock(f: Frame) {
	if (truthy(rt.sv(f, "pin"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pin")]);
	}
	rt.setSv(f, "pin", (yield* g.new_(f, T("/obj/item/device/firing_pin"), [])));
	return f.dot;
}, true);

rt.type(270, "/datum/action/toggle_scope_zoom", "/datum/action", {
	gun: null,
	name: "Toggle Scope",
	check_flags: 15,
	button_icon_state: "sniper_zoom",
});

// /datum/action/toggle_scope_zoom/proc/Trigger  (code/modules/projectiles/gun.dm:448)  may sleep
rt.def("/datum/action/toggle_scope_zoom/proc/Trigger", function* Trigger(f: Frame) {
	yield* g.callName(f, rt.sv(f, "gun"), "zoom", [rt.sv(f, "owner")]);
	return f.dot;
}, true);

// /datum/action/toggle_scope_zoom/proc/IsAvailable  (code/modules/projectiles/gun.dm:451)  may sleep
rt.def("/datum/action/toggle_scope_zoom/proc/IsAvailable", function* IsAvailable(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy(live(f.dot)) && truthy(rt.sv(f, "gun")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "gun"), "zoom", [rt.sv(f, "owner"), 0]);
	return f.dot;
}, true);

// /datum/action/toggle_scope_zoom/proc/Remove  (code/modules/projectiles/gun.dm:456)  may sleep
rt.def("/datum/action/toggle_scope_zoom/proc/Remove", function* Remove(f: Frame) {
	yield* g.callName(f, rt.sv(f, "gun"), "zoom", [live(f.args[0]), 0]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["L"] });

// /obj/item/weapon/gun/proc/zoom  (code/modules/projectiles/gun.dm:461)  may sleep
rt.def("/obj/item/weapon/gun/proc/zoom", function* zoom(f: Frame, user: Value, forced_zoom: Value) {
	let _x: Value = null, _y: Value = null;
	let $0: any;
	f.vars = () => [user, forced_zoom, _x, _y, $0];
	if ((!truthy(live(user)) || !truthy(rt.fv(f, "client", live(user))))) {
		return live(f.dot);
	}
	$0 = live(forced_zoom);
	if ($0 === 0) {
		rt.setSv(f, "zoomed", 0);
	} else if ($0 === 1) {
		rt.setSv(f, "zoomed", 1);
	} else {
		rt.setSv(f, "zoomed", (!truthy(rt.sv(f, "zoomed")) ? 1 : 0));
	}
	if (truthy(rt.sv(f, "zoomed"))) {
		_x = 0;
		_y = 0;
		$0 = rt.fv(f, "dir", live(user));
		if ($0 === 1) {
			_y = rt.sv(f, "zoom_amt");
		} else if ($0 === 4) {
			_x = rt.sv(f, "zoom_amt");
		} else if ($0 === 2) {
			_y = rt.neg(rt.sv(f, "zoom_amt"));
		} else if ($0 === 8) {
			_x = rt.neg(rt.sv(f, "zoom_amt"));
		}
		yield* g.callName(f, rt.fv(f, "client", live(user)), "change_view", [rt.sv(f, "zoom_out_amt")]);
		rt.setFv(f, "pixel_x", rt.fv(f, "client", live(user)), multiply(rt.fv(f, "icon_size", rt.world()), live(_x)));
		rt.setFv(f, "pixel_y", rt.fv(f, "client", live(user)), multiply(rt.fv(f, "icon_size", rt.world()), live(_y)));
	} else {
		yield* g.callName(f, rt.fv(f, "client", live(user)), "change_view", [(yield* g.callName(f, rt.fv(f, "client", live(user)), "default_view", []))]);
		rt.setFv(f, "pixel_x", rt.fv(f, "client", live(user)), 0);
		rt.setFv(f, "pixel_y", rt.fv(f, "client", live(user)), 0);
	}
	return rt.sv(f, "zoomed");
}, true);

// /obj/item/weapon/gun/proc/build_zooming  (code/modules/projectiles/gun.dm:500)  may sleep
rt.def("/obj/item/weapon/gun/proc/build_zooming", function* build_zooming(f: Frame) {
	if (truthy(rt.sv(f, "azoom"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "zoomable"))) return f.dot;
	rt.setSv(f, "azoom", (yield* g.new_(f, T("/datum/action/toggle_scope_zoom"), [])));
	rt.setFv(f, "gun", rt.sv(f, "azoom"), live(f.src));
	return f.dot;
}, true);
