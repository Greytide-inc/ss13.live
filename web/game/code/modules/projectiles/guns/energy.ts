// From code/modules/projectiles/guns/energy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5131, "/obj/item/weapon/gun/energy", "/obj/item/weapon/gun", {
	cell: null,
	modifystate: 0,
	select: 1,
	can_charge: 1,
	automatic_charge_overlays: 1,
	charge_sections: 4,
	shaded_charge: 0,
	selfcharge: 0,
	charge_tick: 0,
	charge_delay: 4,
	use_cyborg_cell: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell"),
	ammo_type: null,
	icon_state: "energy",
	name: "energy gun",
	desc: "A basic energy-based gun.",
	icon: rt.rsc("icons/obj/guns/energy.dmi"),
	ammo_x_offset: 2,
});

// /obj/item/weapon/gun/energy/proc/<init>  (code/modules/projectiles/guns/energy.dm:10)
rt.def("/obj/item/weapon/gun/energy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/proc/emp_act  (code/modules/projectiles/guns/energy.dm:23)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	yield* g.callName(f, rt.sv(f, "cell"), "use", [(yield* g.call(f, P("/proc/round"), null, [divide(rt.fv(f, "charge", rt.sv(f, "cell")), live(severity))]))]);
	rt.setSv(f, "chambered", null);
	yield* g.srcCall(f, "recharge_newshot");
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/Initialize  (code/modules/projectiles/guns/energy.dm:32)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "cell_type"))) {
		rt.setSv(f, "cell", (yield* g.new_(f, rt.sv(f, "cell_type"), [live(f.src)])));
	} else {
		rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell"), [live(f.src)])));
	}
	yield* g.callName(f, rt.sv(f, "cell"), "give", [rt.fv(f, "maxcharge", rt.sv(f, "cell"))]);
	yield* g.srcCall(f, "update_ammo_types");
	yield* g.srcCall(f, "recharge_newshot", 1);
	if (truthy(rt.sv(f, "selfcharge"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/update_ammo_types  (code/modules/projectiles/guns/energy.dm:46)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/update_ammo_types", function* update_ammo_types(f: Frame) {
	let shot: Value = null, i: Value = null, shottype: Value = null;
	f.vars = () => [shot, i, shottype];
	shot = null;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "ammo_type")))) {
		shottype = rt.index(rt.sv(f, "ammo_type"), live(i));
		shot = (yield* g.new_(f, live(shottype), [live(f.src)]));
		rt.setAt(rt.sv(f, "ammo_type"), live(i), live(shot));
		i = rt.inc(live(i), 1);
	}
	rt.setSv(f, "fire_sound", rt.gv(f, "fire_sound", (shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select")))));
	rt.setSv(f, "fire_delay", rt.fv(f, "delay", live(shot)));
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/Destroy  (code/modules/projectiles/guns/energy.dm:55)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cell")]);
	rt.setSv(f, "cell", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/energy/proc/process  (code/modules/projectiles/guns/energy.dm:61)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "selfcharge"))) return f.dot;
	rt.incSrcVar(f, "charge_tick", 1, true);
	if (rt.lt(rt.sv(f, "charge_tick"), rt.sv(f, "charge_delay"))) {
		return live(f.dot);
	}
	rt.setSv(f, "charge_tick", 0);
	if (!truthy(rt.sv(f, "cell"))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "cell"), "give", [100]);
	if (!truthy(rt.sv(f, "chambered"))) {
		yield* g.srcCall(f, "recharge_newshot", 1);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/gun/energy/proc/attack_self  (code/modules/projectiles/guns/energy.dm:73)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!rt.gt(rt.len(f, rt.sv(f, "ammo_type")), 1)) return f.dot;
	yield* g.srcCall(f, "select_fire", live(user));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/can_shoot  (code/modules/projectiles/guns/energy.dm:78)
rt.def("/obj/item/weapon/gun/energy/proc/can_shoot", function can_shoot(f: Frame) {
	let shot: Value = null;
	f.vars = () => [shot];
	shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
	return (rt.ge(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "e_cost", live(shot))) ? 1 : 0);
});

// /obj/item/weapon/gun/energy/proc/recharge_newshot  (code/modules/projectiles/guns/energy.dm:82)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/recharge_newshot", function* recharge_newshot(f: Frame, no_cyborg_drain: Value) {
	let R: Value = null, shot: Value = null, AC: Value = null;
	f.vars = () => [no_cyborg_drain, R, shot, AC];
	if ((!truthy(rt.sv(f, "ammo_type")) || !truthy(rt.sv(f, "cell")))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "use_cyborg_cell")) && !truthy(live(no_cyborg_drain)))) {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "cell", (R = rt.sv(f, "loc"))))) {
				shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
				if (truthy((yield* g.callName(f, rt.fv(f, "cell", live(R)), "use", [rt.fv(f, "e_cost", live(shot))])))) {
					yield* g.callName(f, rt.sv(f, "cell"), "give", [rt.fv(f, "e_cost", live(shot))]);
				}
			}
		}
	}
	if (truthy(rt.sv(f, "chambered"))) return f.dot;
	AC = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
	if (!rt.ge(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "e_cost", live(AC)))) return f.dot;
	rt.setSv(f, "chambered", live(AC));
	if (truthy(rt.fv(f, "BB", rt.sv(f, "chambered")))) return f.dot;
	yield* g.callName(f, rt.sv(f, "chambered"), "newshot", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/process_chamber  (code/modules/projectiles/guns/energy.dm:99)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/process_chamber", function* process_chamber(f: Frame) {
	let shot: Value = null;
	f.vars = () => [shot];
	if ((truthy(rt.sv(f, "chambered")) && !truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) {
		shot = rt.sv(f, "chambered");
		yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "e_cost", live(shot))]);
	}
	rt.setSv(f, "chambered", null);
	yield* g.srcCall(f, "recharge_newshot");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/select_fire  (code/modules/projectiles/guns/energy.dm:106)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/select_fire", function* select_fire(f: Frame, user: Value) {
	let shot: Value = null;
	f.vars = () => [user, shot];
	rt.incSrcVar(f, "select", 1, true);
	if (rt.gt(rt.sv(f, "select"), rt.len(f, rt.sv(f, "ammo_type")))) {
		rt.setSv(f, "select", 1);
	}
	rt.setSv(f, "fire_sound", rt.gv(f, "fire_sound", (shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select")))));
	rt.setSv(f, "fire_delay", rt.fv(f, "delay", live(shot)));
	if (truthy(rt.fv(f, "select_name", live(shot)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now set to ＀.</span>", [live(f.src), rt.fv(f, "select_name", live(shot))])]);
	}
	rt.setSv(f, "chambered", null);
	yield* g.srcCall(f, "recharge_newshot", 1);
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/item/weapon/gun/energy/proc/update_icon  (code/modules/projectiles/guns/energy.dm:120)
rt.def("/obj/item/weapon/gun/energy/proc/update_icon", function update_icon(f: Frame) {
	let ratio: Value = null, shot: Value = null, iconState: Value = null, itemState: Value = null, charge_overlay: Value = null, i: Value = null;
	f.vars = () => [ratio, shot, iconState, itemState, charge_overlay, i];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "automatic_charge_overlays"))) {
		return live(f.dot);
	}
	ratio = rt.call(f, P("/proc/Ceiling"), null, [multiply(divide(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "maxcharge", rt.sv(f, "cell"))), rt.sv(f, "charge_sections"))]);
	shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
	iconState = fmt("＀_charge", [rt.sv(f, "icon_state")]);
	itemState = null;
	if (!truthy(rt.initial(f, live(f.src), "item_state"))) {
		itemState = rt.sv(f, "icon_state");
	}
	if (truthy(rt.sv(f, "modifystate"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_＀", [rt.sv(f, "icon_state"), rt.fv(f, "select_name", live(shot))])]);
		iconState = rt.modify(live(iconState), fmt("_＀", [rt.fv(f, "select_name", live(shot))]), add);
		if (truthy(live(itemState))) {
			itemState = rt.modify(live(itemState), fmt("＀", [rt.fv(f, "select_name", live(shot))]), add);
		}
	}
	if (rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "e_cost", live(shot)))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_empty", [rt.sv(f, "icon_state")])]);
	} else {
		if (!truthy(rt.sv(f, "shaded_charge"))) {
			charge_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), live(iconState)]);
			i = null;
			i = live(ratio);
			while (rt.ge(live(i), 1)) {
				rt.setFv(f, "pixel_x", live(charge_overlay), multiply(rt.sv(f, "ammo_x_offset"), subtract(live(i), 1)));
				rt.setFv(f, "pixel_y", live(charge_overlay), multiply(rt.sv(f, "ammo_y_offset"), subtract(live(i), 1)));
				rt.callSrc(f, "add_overlay", [live(charge_overlay)]);
				i = rt.inc(live(i), -1);
			}
		} else {
			rt.callSrc(f, "add_overlay", [fmt("＀_charge＀", [rt.sv(f, "icon_state"), live(ratio)])]);
		}
	}
	if (!truthy(live(itemState))) return f.dot;
	rt.setSv(f, "item_state", (itemState = rt.modify(live(itemState), fmt("＀", [live(ratio)]), add)));
	return f.dot;
});

// /obj/item/weapon/gun/energy/proc/ui_action_click  (code/modules/projectiles/guns/energy.dm:150)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "toggle_gunlight");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/suicide_act  (code/modules/projectiles/guns/energy.dm:153)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let shot: Value = null;
	f.vars = () => [user, shot];
	if ((truthy((yield* g.callName(f, live(f.src), "can_shoot", []))) && truthy((yield* g.srcCall(f, "can_trigger_gun", live(user)))))) {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting the barrel of ＀ in ＀ mouth.  It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.call(f, P("/proc/sleep"), null, [25]);
		if (truthy((yield* g.callName(f, live(user), "is_holding", [live(f.src)])))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ melts ＀ face off with ＀!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "fire_sound"), 50, 1, -1]);
			shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
			yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "e_cost", live(shot))]);
			yield* g.srcCall(f, "update_icon");
			return 2;
		} else {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ panics and starts choking to death!</span>", [live(user)])]);
			return 8;
		}
	} else {
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is pretending to blow ＀ brains out with ＀! It looks like ＀ trying to commit suicide!</b></span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src), (yield* g.callName(f, live(user), "p_theyre", []))])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/empty.ogg"), 50, 1, -1]);
		return 8;
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/proc/vv_edit_var  (code/modules/projectiles/guns/energy.dm:173)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(f.args[0]);
	if ($0 === "selfcharge") {
		if (truthy(live(f.args[1]))) {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		} else {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /obj/item/weapon/gun/energy/proc/ignition_effect  (code/modules/projectiles/guns/energy.dm:183)  may sleep
rt.def("/obj/item/weapon/gun/energy/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let E: Value = null, BB: Value = null;
	f.vars = () => [A, user, E, BB];
	if ((!truthy((yield* g.srcCall(f, "can_shoot"))) || !truthy(rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"))))) {
		yield* g.srcCall(f, "shoot_with_empty_chamber");
		f.dot = "";
	} else {
		E = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
		if (!truthy((BB = rt.fv(f, "BB", live(E))))) {
			f.dot = "";
		} else {
			if (((truthy(rt.fv(f, "nodamage", live(BB))) || !truthy(rt.fv(f, "damage", live(BB)))) || isEqual(rt.fv(f, "damage_type", live(BB)), "stamina"))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ tries to light their ＀ with ＀, but it doesn't do anything. Dumbass.</span>", [live(user), rt.fv(f, "name", live(A)), live(f.src)])]);
				yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "fire_sound", live(E)), 50, 1]);
				yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "hitsound", live(BB)), 50, 1]);
				yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "e_cost", live(E))]);
				f.dot = "";
			} else {
				if (!isEqual(rt.fv(f, "damage_type", live(BB)), "fire")) {
					yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ tries to light their ＀ with ＀, but only succeeds in utterly destroying it. Dumbass.</span>", [live(user), rt.fv(f, "name", live(A)), live(f.src)])]);
					yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "fire_sound", live(E)), 50, 1]);
					yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "hitsound", live(BB)), 50, 1]);
					yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "e_cost", live(E))]);
					yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
					f.dot = "";
				} else {
					yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "fire_sound", live(E)), 50, 1]);
					yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.fv(f, "hitsound", live(BB)), 50, 1]);
					yield* g.callName(f, rt.sv(f, "cell"), "use", [rt.fv(f, "e_cost", live(E))]);
					f.dot = fmt("<span class='danger'>＀ casually lights their ＀ with ＀. Damn.</span>", [live(user), rt.fv(f, "name", live(A)), live(f.src)]);
				}
			}
		}
	}
	return f.dot;
}, true);
