// From code/modules/mob/living/silicon/robot/robot_modules.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7551, "/obj/item/weapon/robot_module", "/obj/item/weapon", {
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
	modules: null,
	added_modules: null,
	storages: null,
	cyborg_base_icon: "robot",
	special_light_key: null,
	moduleselect_icon: "nomod",
	can_be_pushed: 1,
	magpulsing: 0,
	clean_on_move: 0,
	hat_offset: -3,
	ride_offset_x: null,
	ride_offset_y: null,
	ride_allow_incapacitated: 0,
	allow_riding: 1,
	flags: 64,
	name: "Default",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "std_module",
	w_class: 6,
	item_state: "electronic",
});

// /obj/item/weapon/robot_module/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:9)
rt.def("/obj/item/weapon/robot_module/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "basic_modules", rt.list());
	$0 = $0;
	rt.setSv(f, "emag_modules", rt.list());
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list());
	$0 = $0;
	rt.setSv(f, "modules", rt.list());
	$0 = $0;
	rt.setSv(f, "added_modules", rt.list());
	$0 = $0;
	rt.setSv(f, "storages", rt.list());
	rt.setSv(f, "ride_offset_x", rt.alist(f, ["north", 0, "south", 0, "east", -6, "west", 6]));
	rt.setSv(f, "ride_offset_y", rt.alist(f, ["north", 4, "south", 4, "east", 3, "west", 3]));
	return f.dot;
});

// /obj/item/weapon/robot_module/proc/New  (code/modules/mob/living/silicon/robot/robot_modules.dm:36)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/New", function* New(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [i, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forList(f, 0, rt.sv(f, "basic_modules"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "basic_modules", (I = (yield* g.new_(f, live(i), [live(f.src)]))), add);
		(rt.modSrcVar(f, "basic_modules", live(i), subtract));
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, rt.sv(f, "emag_modules"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "emag_modules", (I = (yield* g.new_(f, live(i), [live(f.src)]))), add);
		(rt.modSrcVar(f, "emag_modules", live(i), subtract));
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, rt.sv(f, "ratvar_modules"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "ratvar_modules", (I = (yield* g.new_(f, live(i), [live(f.src)]))), add);
		(rt.modSrcVar(f, "ratvar_modules", live(i), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/robot_module/proc/Destroy  (code/modules/mob/living/silicon/robot/robot_modules.dm:51)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.sv(f, "basic_modules"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "emag_modules"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "ratvar_modules"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "modules"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "added_modules"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "storages"), "Cut", []);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/robot_module/proc/emp_act  (code/modules/mob/living/silicon/robot/robot_modules.dm:60)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/emp_act", function* emp_act(f: Frame) {
	let O: Value = null;
	let $e: any;
	f.vars = () => [O, $e];
	O = null;
	rt.forList(f, 0, rt.sv(f, "modules"), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "emp_act", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/robot_module/proc/get_usable_modules  (code/modules/mob/living/silicon/robot/robot_modules.dm:65)
rt.def("/obj/item/weapon/robot_module/proc/get_usable_modules", function get_usable_modules(f: Frame) {
	f.dot = rt.callName(f, rt.sv(f, "modules"), "Copy", []);
	return f.dot;
});

// /obj/item/weapon/robot_module/proc/get_inactive_modules  (code/modules/mob/living/silicon/robot/robot_modules.dm:68)
rt.def("/obj/item/weapon/robot_module/proc/get_inactive_modules", function get_inactive_modules(f: Frame) {
	let R: Value = null, m: Value = null;
	let $e: any;
	f.vars = () => [R, m, $e];
	f.dot = rt.list();
	R = rt.sv(f, "loc");
	m = null;
	rt.forList(f, 0, rt.callSrc(f, "get_usable_modules", []));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		if (!truthy((rt.isIn(f, live(m), rt.fv(f, "held_items", live(R))) ? 1 : 0))) {
			f.dot = rt.modify(live(f.dot), live(m), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/robot_module/proc/get_or_create_estorage  (code/modules/mob/living/silicon/robot/robot_modules.dm:75)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/get_or_create_estorage", function* get_or_create_estorage(f: Frame, storage_type: Value) {
	let S: Value = null;
	let $e: any;
	f.vars = () => [storage_type, S, $e];
	S = null;
	rt.forList(f, 0, rt.sv(f, "storages"), T("/datum/robot_energy_storage"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (truthy(rt.op(f, "IsType", [], [live(S), live(storage_type)]))) {
			return live(S);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.new_(f, live(storage_type), [live(f.src)]));
}, true);

// /obj/item/weapon/robot_module/proc/add_module  (code/modules/mob/living/silicon/robot/robot_modules.dm:82)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/add_module", function* add_module(f: Frame, I: Value, nonstandard: Value, requires_rebuild: Value) {
	let S: Value = null, G: Value = null, C: Value = null;
	f.vars = () => [I, nonstandard, requires_rebuild, S, G, C];
	if (truthy((rt.istype(live(I), T("/obj/item/stack")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [(S = live(I)), rt.list(T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/rods"), T("/obj/item/stack/tile/plasteel"))])))) {
			if (truthy(rt.index(rt.fv(f, "materials", live(S)), "$metal"))) {
				rt.setFv(f, "cost", live(S), multiply(rt.index(rt.fv(f, "materials", live(S)), "$metal"), 0.25));
			}
			rt.setFv(f, "source", live(S), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/metal"))));
		} else {
			if (truthy((rt.istype(live(S), T("/obj/item/stack/sheet/glass")) ? 1 : 0))) {
				rt.setFv(f, "cost", live(S), 500);
				rt.setFv(f, "source", live(S), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/glass"))));
			} else {
				if (truthy((rt.istype(live(S), T("/obj/item/stack/sheet/rglass/cyborg")) ? 1 : 0))) {
					rt.setFv(f, "source", (G = live(S)), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/metal"))));
					rt.setFv(f, "glasource", live(G), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/glass"))));
				} else {
					if (truthy((rt.istype(live(S), T("/obj/item/stack/medical")) ? 1 : 0))) {
						rt.setFv(f, "cost", live(S), 250);
						rt.setFv(f, "source", live(S), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/medical"))));
					} else {
						if (truthy((rt.istype(live(S), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
							rt.setFv(f, "cost", live(S), 1);
							rt.setFv(f, "source", live(S), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/wire"))));
						} else {
							if (truthy((rt.istype(live(S), T("/obj/item/stack/marker_beacon")) ? 1 : 0))) {
								rt.setFv(f, "cost", live(S), 1);
								rt.setFv(f, "source", live(S), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/beacon"))));
							}
						}
					}
				}
			}
		}
		if ((truthy(live(S)) && truthy(rt.fv(f, "source", live(S))))) {
			rt.setFv(f, "materials", live(S), rt.list());
			rt.setFv(f, "is_cyborg", live(S), 1);
		}
	}
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/restraints/handcuffs/cable")) ? 1 : 0))) {
		rt.setFv(f, "wirestorage", (C = live(I)), (yield* g.srcCall(f, "get_or_create_estorage", T("/datum/robot_energy_storage/wire"))));
	}
	if (!isEqual(rt.fv(f, "loc", live(I)), live(f.src))) {
		yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
	}
	rt.modSrcVar(f, "modules", live(I), add);
	(rt.modField(f, live(I), "flags", 2, rt.bitOr));
	rt.setFv(f, "mouse_opacity", live(I), 2);
	if (truthy(live(nonstandard))) {
		rt.modSrcVar(f, "added_modules", live(I), add);
	}
	if (truthy(live(requires_rebuild))) {
		yield* g.srcCall(f, "rebuild_modules");
	}
	return live(I);
}, true);

// /obj/item/weapon/robot_module/proc/remove_module  (code/modules/mob/living/silicon/robot/robot_modules.dm:131)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/remove_module", function* remove_module(f: Frame, I: Value, delete_after: Value) {
	f.vars = () => [I, delete_after];
	(rt.modSrcVar(f, "basic_modules", live(I), subtract));
	(rt.modSrcVar(f, "modules", live(I), subtract));
	(rt.modSrcVar(f, "emag_modules", live(I), subtract));
	(rt.modSrcVar(f, "ratvar_modules", live(I), subtract));
	(rt.modSrcVar(f, "added_modules", live(I), subtract));
	yield* g.srcCall(f, "rebuild_modules");
	if (!truthy(live(delete_after))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	return f.dot;
}, true);

// /obj/item/weapon/robot_module/proc/respawn_consumable  (code/modules/mob/living/silicon/robot/robot_modules.dm:141)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/respawn_consumable", function* respawn_consumable(f: Frame, R: Value, coeff: Value) {
	let st: Value = null, I: Value = null, F: Value = null, B: Value = null, EG: Value = null;
	let $e: any;
	f.vars = () => [R, coeff, st, I, F, B, EG, $e];
	if (live(coeff) === null) {
		coeff = 1;
	}
	st = null;
	rt.forList(f, 0, rt.sv(f, "storages"), T("/datum/robot_energy_storage"));
	while (($e = rt.next(f, 0)) !== undefined) {
		st = $e;
		rt.setFv(f, "energy", live(st), (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "max_energy", live(st)), add(rt.fv(f, "energy", live(st)), multiply(live(coeff), rt.fv(f, "recharge_rate", live(st))))])));
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "get_usable_modules")), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/device/assembly/flash")) ? 1 : 0))) {
			rt.setFv(f, "times_used", (F = live(I)), 0);
			rt.setFv(f, "crit_fail", live(F), 0);
			yield* g.callName(f, live(F), "update_icon", []);
		} else {
			if (truthy((rt.istype(live(I), T("/obj/item/weapon/melee/baton")) ? 1 : 0))) {
				if (truthy(rt.gv(f, "cell", (B = live(I))))) {
					rt.setFv(f, "charge", rt.fv(f, "cell", live(B)), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(B))));
				}
			} else {
				if (truthy((rt.istype(live(I), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
					if (!truthy(rt.gv(f, "chambered", (EG = live(I))))) {
						yield* g.callName(f, live(EG), "recharge_newshot", []);
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "toner", live(R), rt.fv(f, "tonermax", live(R)));
	return f.dot;
}, true);

// /obj/item/weapon/robot_module/proc/rebuild_modules  (code/modules/mob/living/silicon/robot/robot_modules.dm:162)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/rebuild_modules", function* rebuild_modules(f: Frame) {
	let R: Value = null, held_modules: Value = null, I: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [R, held_modules, I, i, $e];
	R = rt.sv(f, "loc");
	held_modules = (yield* g.callName(f, rt.fv(f, "held_items", live(R)), "Copy", []));
	yield* g.callName(f, live(R), "uneq_all", []);
	rt.setSv(f, "modules", rt.list());
	I = null;
	rt.forList(f, 0, rt.sv(f, "basic_modules"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "add_module", live(I), 0, 0);
	}
	rt.endFor(f, 0);
	if (truthy(rt.fv(f, "emagged", live(R)))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "emag_modules"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.srcCall(f, "add_module", live(I), 0, 0);
		}
		rt.endFor(f, 0);
	}
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(R)])))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "ratvar_modules"), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.srcCall(f, "add_module", live(I), 0, 0);
		}
		rt.endFor(f, 0);
	}
	I = null;
	rt.forList(f, 0, rt.sv(f, "added_modules"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.srcCall(f, "add_module", live(I), 0, 0);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forList(f, 0, live(held_modules));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (truthy(live(i))) {
			yield* g.callName(f, live(R), "activate_module", [live(i)]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.fv(f, "hud_used", live(R)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "hud_used", live(R)), "update_robot_modules_display", []);
	return f.dot;
}, true);

// /obj/item/weapon/robot_module/proc/transform_to  (code/modules/mob/living/silicon/robot/robot_modules.dm:183)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/transform_to", function* transform_to(f: Frame, new_module_type: Value) {
	let R: Value = null, RM: Value = null;
	f.vars = () => [new_module_type, R, RM];
	R = rt.sv(f, "loc");
	if (!truthy((yield* g.callName(f, (RM = (yield* g.new_(f, live(new_module_type), [live(R)]))), "be_transformed_to", [live(f.src)])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(RM)]);
		return live(f.dot);
	}
	rt.setFv(f, "module", live(R), live(RM));
	yield* g.callName(f, live(R), "update_module_innate", []);
	yield* g.callName(f, live(RM), "rebuild_modules", []);
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(RM), P("/obj/item/weapon/robot_module/proc/do_transform_animation")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(RM);
}, true);

// /obj/item/weapon/robot_module/proc/be_transformed_to  (code/modules/mob/living/silicon/robot/robot_modules.dm:196)
rt.def("/obj/item/weapon/robot_module/proc/be_transformed_to", function be_transformed_to(f: Frame, old_module: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forList(f, 0, rt.fv(f, "added_modules", live(old_module)));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.modSrcVar(f, "added_modules", live(i), add);
		(rt.modField(f, live(old_module), "added_modules", live(i), subtract));
	}
	rt.endFor(f, 0);
	return 1;
});

// /obj/item/weapon/robot_module/proc/do_transform_animation  (code/modules/mob/living/silicon/robot/robot_modules.dm:203)  may sleep
rt.def("/obj/item/weapon/robot_module/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	let R: Value = null, ANM: Value = null, prev_lockcharge: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [R, ANM, prev_lockcharge, i, $e];
	rt.setFv(f, "notransform", (R = rt.sv(f, "loc")), 1);
	rt.setFv(f, "layer", (ANM = (yield* g.new_(f, T("/obj/effect/temp_visual/decoy/fading/fivesecond"), [rt.fv(f, "loc", live(R)), live(R)]))), subtract(rt.fv(f, "layer", live(R)), 0.009999999776482582));
	yield* g.new_(f, T("/obj/effect/temp_visual/small_smoke"), [rt.fv(f, "loc", live(R))]);
	if (truthy(rt.fv(f, "hat", live(R)))) {
		yield* g.callName(f, rt.fv(f, "hat", live(R)), "forceMove", [rt.getStep(f, live(R), 0)]);
		rt.setFv(f, "hat", live(R), null);
	}
	yield* g.callName(f, live(R), "update_headlamp", []);
	rt.setFv(f, "alpha", live(R), 0);
	rt.op(f, "Animate", [2, 6], [null, live(R), "alpha", 255, "time", 50]);
	prev_lockcharge = rt.fv(f, "lockcharge", live(R));
	yield* g.callName(f, live(R), "SetLockdown", [1]);
	rt.setFv(f, "anchored", live(R), 1);
	yield* g.call(f, P("/proc/sleep"), null, [2]);
	i = null;
	rt.forRange(f, 0, 1, 4, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/playsound"), null, [live(R), rt.op(f, "PickUnweighted", [5], [rt.rsc("sound/items/drill_use.ogg"), rt.rsc("sound/items/jaws_cut.ogg"), rt.rsc("sound/items/jaws_pry.ogg"), rt.rsc("sound/items/welder.ogg"), rt.rsc("sound/items/ratchet.ogg")]), 80, 1, -1]);
		yield* g.call(f, P("/proc/sleep"), null, [12]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(prev_lockcharge))) {
		yield* g.callName(f, live(R), "SetLockdown", [0]);
	}
	rt.setFv(f, "anchored", live(R), 0);
	rt.setFv(f, "notransform", live(R), 0);
	yield* g.callName(f, live(R), "notify_ai", [2]);
	if (truthy(rt.fv(f, "hud_used", live(R)))) {
		yield* g.callName(f, rt.fv(f, "hud_used", live(R)), "update_robot_modules_display", []);
	}
	return f.dot;
}, true);

rt.type(7552, "/obj/item/weapon/robot_module/standard", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	moduleselect_icon: "standard",
	hat_offset: -3,
	name: "Standard",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/standard/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:249)
rt.def("/obj/item/weapon/robot_module/standard/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/melee/energy/sword/cyborg")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/borghypo/epi"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/weldingtool/largetank/cyborg"), T("/obj/item/weapon/wrench/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/stack/sheet/metal/cyborg"), T("/obj/item/stack/rods/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/pickaxe"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg"), T("/obj/item/weapon/soap/nanotrasen"), T("/obj/item/borg/cyborghug")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg"), T("/obj/item/clockwork/ratvarian_spear/cyborg"), T("/obj/item/clockwork/replica_fabricator/cyborg")));
	return f.dot;
});

rt.type(7553, "/obj/item/weapon/robot_module/medical", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "medical",
	moduleselect_icon: "medical",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Medical",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/medical/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:280)
rt.def("/obj/item/weapon/robot_module/medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/reagent_containers/borghypo/hacked")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/reagent_containers/borghypo"), T("/obj/item/weapon/reagent_containers/glass/beaker/large"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/reagent_containers/syringe"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/hemostat"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/surgicaldrill"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/circular_saw"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/roller/robo"), T("/obj/item/borg/cyborghug/medical"), T("/obj/item/stack/medical/gauze/cyborg"), T("/obj/item/weapon/organ_storage"), T("/obj/item/borg/lollipop")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/medical"), T("/obj/item/clockwork/ratvarian_spear/cyborg")));
	return f.dot;
});

rt.type(7554, "/obj/item/weapon/robot_module/engineering", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "engineer",
	moduleselect_icon: "engineer",
	magpulsing: 1,
	hat_offset: 1e+31,
	name: "Engineering",
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/engineering/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:292)
rt.def("/obj/item/weapon/robot_module/engineering/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/borg/sight/meson"), T("/obj/item/weapon/construction/rcd/borg"), T("/obj/item/weapon/pipe_dispenser"), T("/obj/item/weapon/extinguisher"), T("/obj/item/weapon/weldingtool/largetank/cyborg"), T("/obj/item/weapon/screwdriver/cyborg"), T("/obj/item/weapon/wrench/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/wirecutters/cyborg"), T("/obj/item/device/multitool/cyborg"), T("/obj/item/device/t_scanner"), T("/obj/item/device/analyzer"), T("/obj/item/device/assembly/signaler/cyborg"), T("/obj/item/areaeditor/blueprints/cyborg"), T("/obj/item/stack/sheet/metal/cyborg"), T("/obj/item/stack/sheet/glass/cyborg"), T("/obj/item/stack/sheet/rglass/cyborg"), T("/obj/item/stack/rods/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/stack/cable_coil/cyborg")));
	$0 = $0;
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/borg/stun")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/engineer"), T("/obj/item/clockwork/replica_fabricator/cyborg")));
	return f.dot;
});

rt.type(7555, "/obj/item/weapon/robot_module/security", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "sec",
	moduleselect_icon: "security",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Security",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/security/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:332)
rt.def("/obj/item/weapon/robot_module/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/gun/energy/laser/cyborg")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/restraints/handcuffs/cable/zipties/cyborg"), T("/obj/item/weapon/melee/baton/loaded"), T("/obj/item/weapon/gun/energy/disabler/cyborg"), T("/obj/item/clothing/mask/gas/sechailer/cyborg")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/security"), T("/obj/item/clockwork/ratvarian_spear/cyborg")));
	return f.dot;
});

// /obj/item/weapon/robot_module/security/proc/do_transform_animation  (code/modules/mob/living/silicon/robot/robot_modules.dm:342)  may sleep
rt.def("/obj/item/weapon/robot_module/security/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='userdanger'>While you have picked the security module, you still have to follow your laws, NOT Space Law. For Asimov, this means you must follow criminals' orders unless there is a law 1 reason not to.</span>"]);
	return f.dot;
}, true);

// /obj/item/weapon/robot_module/security/proc/respawn_consumable  (code/modules/mob/living/silicon/robot/robot_modules.dm:347)  may sleep
rt.def("/obj/item/weapon/robot_module/security/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let _T: Value = null, S: Value = null;
	f.vars = () => [_T, S];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((_T = rt.locateIn(f, T("/obj/item/weapon/gun/energy/e_gun/advtaser/cyborg"), rt.sv(f, "basic_modules"))))) return f.dot;
	if (rt.lt(rt.gv(f, "charge", rt.fv(f, "cell", live(_T))), rt.gv(f, "maxcharge", rt.fv(f, "cell", live(_T))))) {
		S = rt.index(rt.fv(f, "ammo_type", live(_T)), rt.fv(f, "select", live(_T)));
		yield* g.callName(f, rt.fv(f, "cell", live(_T)), "give", [multiply(rt.fv(f, "e_cost", live(S)), live(f.args[1]))]);
		yield* g.callName(f, live(_T), "update_icon", []);
	} else {
		rt.setFv(f, "charge_tick", live(_T), 0);
	}
	return f.dot;
}, true, { args: ["R", "coeff"] });

rt.type(7556, "/obj/item/weapon/robot_module/peacekeeper", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "peace",
	moduleselect_icon: "standard",
	can_be_pushed: 0,
	hat_offset: -2,
	name: "Peacekeeper",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/peacekeeper/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:368)
rt.def("/obj/item/weapon/robot_module/peacekeeper/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/reagent_containers/borghypo/peace/hacked")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/cookiesynth"), T("/obj/item/device/harmalarm"), T("/obj/item/weapon/reagent_containers/borghypo/peace"), T("/obj/item/weapon/holosign_creator/cyborg"), T("/obj/item/borg/cyborghug/peacekeeper"), T("/obj/item/weapon/extinguisher"), T("/obj/item/borg/projectile_dampen")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/peacekeeper"), T("/obj/item/clockwork/ratvarian_spear/cyborg")));
	return f.dot;
});

// /obj/item/weapon/robot_module/peacekeeper/proc/do_transform_animation  (code/modules/mob/living/silicon/robot/robot_modules.dm:379)  may sleep
rt.def("/obj/item/weapon/robot_module/peacekeeper/proc/do_transform_animation", function* do_transform_animation(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='userdanger'>Under ASIMOV, you are an enforcer of the PEACE and preventer of HUMAN HARM. You are not a security module and you are expected to follow orders and prevent harm above all else. Space law means nothing to you.</span>"]);
	return f.dot;
}, true);

rt.type(7557, "/obj/item/weapon/robot_module/janitor", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	cyborg_base_icon: "janitor",
	moduleselect_icon: "janitor",
	hat_offset: -5,
	clean_on_move: 1,
	name: "Janitor",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/janitor/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:396)
rt.def("/obj/item/weapon/robot_module/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/reagent_containers/spray/cyborg_lube")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/screwdriver/cyborg"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/stack/tile/plasteel/cyborg"), T("/obj/item/weapon/soap/nanotrasen"), T("/obj/item/weapon/storage/bag/trash/cyborg"), T("/obj/item/weapon/mop/cyborg"), T("/obj/item/device/lightreplacer/cyborg"), T("/obj/item/weapon/holosign_creator"), T("/obj/item/weapon/reagent_containers/spray/cyborg_drying")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/janitor"), T("/obj/item/clockwork/replica_fabricator/cyborg")));
	return f.dot;
});

rt.type(6378, "/obj/item/weapon/reagent_containers/spray/cyborg_drying", "/obj/item/weapon/reagent_containers/spray", {
	name: "drying agent spray",
	color: "#A000A0",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/cyborg_drying/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:409)
rt.def("/obj/item/weapon/reagent_containers/spray/cyborg_drying/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["drying_agent", 250]));
	return f.dot;
});

rt.type(6379, "/obj/item/weapon/reagent_containers/spray/cyborg_lube", "/obj/item/weapon/reagent_containers/spray", {
	name: "lube spray",
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/spray/cyborg_lube/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:413)
rt.def("/obj/item/weapon/reagent_containers/spray/cyborg_lube/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["lube", 250]));
	return f.dot;
});

// /obj/item/weapon/robot_module/janitor/proc/respawn_consumable  (code/modules/mob/living/silicon/robot/robot_modules.dm:416)  may sleep
rt.def("/obj/item/weapon/robot_module/janitor/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let LR: Value = null, i: Value = null, CD: Value = null, CL: Value = null;
	let $e: any;
	f.vars = () => [LR, i, CD, CL, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((LR = rt.locateIn(f, T("/obj/item/device/lightreplacer"), rt.sv(f, "basic_modules"))))) {
		i = null;
		rt.forRange(f, 0, 1, live(f.args[1]), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			yield* g.callName(f, live(LR), "Charge", [live(f.args[0])]);
		}
		rt.endFor(f, 0);
	}
	if (truthy((CD = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray/cyborg_drying"), rt.sv(f, "basic_modules"))))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(CD)), "add_reagent", ["drying_agent", multiply(5, live(f.args[1]))]);
	}
	if (!truthy((CL = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/spray/cyborg_lube"), rt.sv(f, "emag_modules"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(CL)), "add_reagent", ["lube", multiply(2, live(f.args[1]))]);
	return f.dot;
}, true, { args: ["R", "coeff"] });

rt.type(7558, "/obj/item/weapon/robot_module/butler", "/obj/item/weapon/robot_module", {
	emag_modules: null,
	moduleselect_icon: "service",
	special_light_key: "service",
	hat_offset: 0,
	name: "Service",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/butler/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:448)
rt.def("/obj/item/weapon/robot_module/butler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/weapon/reagent_containers/borghypo/borgshaker/hacked")));
	$0 = $0;
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), T("/obj/item/weapon/reagent_containers/food/condiment/enzyme"), T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon/spraycan/borg"), T("/obj/item/weapon/hand_labeler/borg"), T("/obj/item/weapon/razor"), T("/obj/item/device/instrument/violin"), T("/obj/item/device/instrument/guitar"), T("/obj/item/weapon/rsf/cyborg"), T("/obj/item/weapon/reagent_containers/dropper"), T("/obj/item/weapon/lighter"), T("/obj/item/weapon/storage/bag/tray"), T("/obj/item/weapon/reagent_containers/borghypo/borgshaker"), T("/obj/item/borg/lollipop")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/service"), T("/obj/item/borg/sight/xray/truesight_lens")));
	return f.dot;
});

// /obj/item/weapon/robot_module/butler/proc/respawn_consumable  (code/modules/mob/living/silicon/robot/robot_modules.dm:457)  may sleep
rt.def("/obj/item/weapon/robot_module/butler/proc/respawn_consumable", function* respawn_consumable(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((O = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/condiment/enzyme"), rt.sv(f, "basic_modules"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(O)), "add_reagent", ["enzyme", multiply(2, live(f.args[1]))]);
	return f.dot;
}, true, { args: ["R", "coeff"] });

// /obj/item/weapon/robot_module/butler/proc/be_transformed_to  (code/modules/mob/living/silicon/robot/robot_modules.dm:463)  may sleep
rt.def("/obj/item/weapon/robot_module/butler/proc/be_transformed_to", function* be_transformed_to(f: Frame) {
	let R: Value = null, borg_icon: Value = null;
	let $0: any;
	f.vars = () => [R, borg_icon, $0];
	R = rt.sv(f, "loc");
	if (!truthy((borg_icon = (yield* g.op(f, "Prompt", [1], [null, "Robot Icon", "Select an icon!", live(R), rt.list("Waitress", "Butler", "Tophat", "Kent", "Bro")]))))) {
		return 0;
	}
	$0 = live(borg_icon);
	if ($0 === "Waitress") {
		rt.setSv(f, "cyborg_base_icon", "service_f");
	} else if ($0 === "Butler") {
		rt.setSv(f, "cyborg_base_icon", "service_m");
	} else if ($0 === "Bro") {
		rt.setSv(f, "cyborg_base_icon", "brobot");
	} else if ($0 === "Kent") {
		rt.setSv(f, "cyborg_base_icon", "kent");
		rt.setSv(f, "special_light_key", "medical");
		rt.setSv(f, "hat_offset", 3);
	} else if ($0 === "Tophat") {
		rt.setSv(f, "cyborg_base_icon", "tophat");
		rt.setSv(f, "special_light_key", null);
		rt.setSv(f, "hat_offset", 9.999999848243207e+30);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["old_module"] });

rt.type(7559, "/obj/item/weapon/robot_module/miner", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "miner",
	moduleselect_icon: "miner",
	hat_offset: 0,
	name: "Miner",
	basic_modules: null,
	emag_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/miner/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:486)
rt.def("/obj/item/weapon/robot_module/miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/storage/bag/ore/cyborg"), T("/obj/item/weapon/pickaxe/drill/cyborg"), T("/obj/item/weapon/shovel"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/weldingtool/mini"), T("/obj/item/weapon/extinguisher/mini"), T("/obj/item/weapon/storage/bag/sheetsnatcher/borg"), T("/obj/item/device/t_scanner/adv_mining_scanner"), T("/obj/item/weapon/gun/energy/kinetic_accelerator/cyborg"), T("/obj/item/device/gps/cyborg"), T("/obj/item/stack/marker_beacon")));
	$0 = $0;
	rt.setSv(f, "emag_modules", rt.list(T("/obj/item/borg/stun")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/miner"), T("/obj/item/clockwork/ratvarian_spear/cyborg"), T("/obj/item/borg/sight/xray/truesight_lens")));
	return f.dot;
});

rt.type(7560, "/obj/item/weapon/robot_module/syndicate", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "synd_sec",
	moduleselect_icon: "malf",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Syndicate Assault",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/syndicate/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:511)
rt.def("/obj/item/weapon/robot_module/syndicate/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/melee/energy/sword/cyborg"), T("/obj/item/weapon/gun/energy/printer"), T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/cyborg"), T("/obj/item/weapon/card/emag"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/pinpointer/syndicate/cyborg")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/security"), T("/obj/item/clockwork/ratvarian_spear/cyborg")));
	return f.dot;
});

rt.type(7561, "/obj/item/weapon/robot_module/syndicate_medical", "/obj/item/weapon/robot_module", {
	cyborg_base_icon: "synd_medical",
	moduleselect_icon: "malf",
	can_be_pushed: 0,
	hat_offset: 3,
	name: "Syndicate Medical",
	basic_modules: null,
	ratvar_modules: null,
});

// /obj/item/weapon/robot_module/syndicate_medical/proc/<init>  (code/modules/mob/living/silicon/robot/robot_modules.dm:530)
rt.def("/obj/item/weapon/robot_module/syndicate_medical/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "basic_modules", rt.list(T("/obj/item/device/assembly/flash/cyborg"), T("/obj/item/weapon/reagent_containers/borghypo/syndicate"), T("/obj/item/weapon/twohanded/shockpaddles/syndicate"), T("/obj/item/device/healthanalyzer"), T("/obj/item/weapon/surgical_drapes"), T("/obj/item/weapon/retractor"), T("/obj/item/weapon/hemostat"), T("/obj/item/weapon/cautery"), T("/obj/item/weapon/scalpel"), T("/obj/item/weapon/melee/energy/sword/cyborg/saw"), T("/obj/item/roller/robo"), T("/obj/item/weapon/card/emag"), T("/obj/item/weapon/crowbar/cyborg"), T("/obj/item/weapon/pinpointer/syndicate/cyborg"), T("/obj/item/stack/medical/gauze/cyborg"), T("/obj/item/weapon/gun/medbeam")));
	$0 = $0;
	rt.setSv(f, "ratvar_modules", rt.list(T("/obj/item/clockwork/slab/cyborg/medical"), T("/obj/item/clockwork/ratvarian_spear/cyborg")));
	return f.dot;
});

rt.type(4116, "/datum/robot_energy_storage", "/datum", {
	name: "Generic energy storage",
	max_energy: 30000,
	recharge_rate: 1000,
	energy: null,
});

// /datum/robot_energy_storage/proc/New  (code/modules/mob/living/silicon/robot/robot_modules.dm:562)
rt.def("/datum/robot_energy_storage/proc/New", function New(f: Frame, R: Value) {
	f.vars = () => [R];
	if (live(R) === null) {
		R = null;
	}
	rt.setSv(f, "energy", rt.sv(f, "max_energy"));
	if (truthy(live(R))) {
		(rt.modField(f, live(R), "storages", live(f.src), rt.bitOr));
	}
	return live(f.dot);
});

// /datum/robot_energy_storage/proc/use_charge  (code/modules/mob/living/silicon/robot/robot_modules.dm:568)
rt.def("/datum/robot_energy_storage/proc/use_charge", function use_charge(f: Frame, amount: Value) {
	if (rt.ge(rt.sv(f, "energy"), live(amount))) {
		(rt.modSrcVar(f, "energy", live(amount), subtract));
		if (isEqual(rt.sv(f, "energy"), 0)) {
			return 1;
		}
		return 2;
	} else {
		return 0;
	}
	return f.dot;
});

// /datum/robot_energy_storage/proc/add_charge  (code/modules/mob/living/silicon/robot/robot_modules.dm:577)
rt.def("/datum/robot_energy_storage/proc/add_charge", function add_charge(f: Frame, amount: Value) {
	rt.setSv(f, "energy", rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "energy"), live(amount)), rt.sv(f, "max_energy")]));
	return f.dot;
});
