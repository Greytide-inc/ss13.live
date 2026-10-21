// From code/game/mecha/equipment/tools/other_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9614, "/obj/item/mecha_parts/mecha_equipment/teleporter", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 150,
	energy_drain: 1000,
	range: 2,
	name: "mounted teleporter",
	desc: "An exosuit module that allows exosuits to teleport to any position in view.",
	icon_state: "mecha_teleport",
	origin_tech: "bluespace=7",
});

// /obj/item/mecha_parts/mecha_equipment/teleporter/proc/action  (code/game/mecha/equipment/tools/other_tools.dm:17)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/teleporter/proc/action", function* action(f: Frame, target: Value) {
	let _T: Value = null;
	f.vars = () => [target, _T];
	if ((!truthy((yield* g.srcCall(f, "action_checks", live(target)))) || isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(f.src))), 1))) {
		return live(f.dot);
	}
	if (!truthy((_T = rt.getStep(f, live(target), 0)))) return f.dot;
	yield* g.call(f, P("/proc/do_teleport"), null, [rt.sv(f, "chassis"), live(_T), 4]);
	return 1;
}, true);

rt.type(9615, "/obj/item/mecha_parts/mecha_equipment/wormhole_generator", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 50,
	energy_drain: 300,
	range: 2,
	name: "mounted wormhole generator",
	desc: "An exosuit module that allows generating of small quasi-stable wormholes.",
	icon_state: "mecha_wholegen",
	origin_tech: "bluespace=4;magnets=4;plasmatech=2",
});

// /obj/item/mecha_parts/mecha_equipment/wormhole_generator/proc/action  (code/game/mecha/equipment/tools/other_tools.dm:38)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/wormhole_generator/proc/action", function* action(f: Frame, target: Value) {
	let theareas: Value = null, thearea: Value = null, L: Value = null, pos: Value = null, _T: Value = null, clear: Value = null, O: Value = null, target_turf: Value = null, created: Value = null, _T_6: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [target, theareas, thearea, L, pos, _T, clear, O, target_turf, created, _T_6, $0, $1, $e];
	if ((!truthy((yield* g.srcCall(f, "action_checks", live(target)))) || isEqual(rt.gv(f, "z", rt.fv(f, "loc", live(f.src))), 1))) {
		return live(f.dot);
	}
	if (!truthy(rt.getLen(f, (theareas = (yield* g.call(f, P("/proc/get_areas_in_range"), null, [100, rt.sv(f, "chassis")])))))) {
		return live(f.dot);
	}
	thearea = rt.op(f, "PickUnweighted", [1], [live(theareas)]);
	L = rt.list();
	pos = rt.getStep(f, live(f.src), 0);
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_area_turfs"), null, [rt.fv(f, "type", live(thearea))])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if ((!truthy(rt.fv(f, "density", live(_T))) && isEqual(rt.fv(f, "z", live(pos)), rt.fv(f, "z", live(_T))))) {
			clear = 1;
			O = null;
			rt.forList(f, 1, live(_T), T("/obj"));
			while (($e = rt.next(f, 1)) !== undefined) {
				O = $e;
				if (truthy(rt.fv(f, "density", live(O)))) {
					clear = 0;
					break;
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(clear))) {
				L = rt.modify(live(L), live(_T), add);
			}
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(L)))) {
		return live(f.dot);
	}
	if (!truthy((target_turf = rt.op(f, "PickUnweighted", [1], [live(L)])))) {
		return live(f.dot);
	}
	created = (yield* g.call(f, P("/proc/create_portal_pair"), null, [rt.getStep(f, live(f.src), 0), live(target_turf), live(f.src), 300, 1, T("/obj/effect/portal/anom")]));
	_T_6 = rt.getStep(f, live(target), 0);
	$0 = fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis"))])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [rt.fv(f, "occupant", rt.sv(f, "chassis"))])]);
	if (truthy(live(_T_6))) {
		$1 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T_6)), rt.fv(f, "y", live(_T_6)), rt.fv(f, "z", live(_T_6))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T_6)), rt.fv(f, "y", live(_T_6)), rt.fv(f, "z", live(_T_6))])]);
	} else {
		$1 = "nonexistent location";
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ used a Wormhole Generator in ＀", [$0, fmt("＀", [$1])]), 0, 1]);
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ used a Wormhole Generator in ＀", [(yield* g.call(f, P("/proc/key_name"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis"))])), fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T_6)), rt.fv(f, "y", live(_T_6)), rt.fv(f, "z", live(_T_6))])])]);
	f.src = null;
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/______qdel_list_wrapper"), live(created)])), (yield* g.call(f, P("/proc/rand"), null, [150, 300])), 8]);
	return 1;
}, true);

rt.type(9616, "/obj/item/mecha_parts/mecha_equipment/gravcatapult", "/obj/item/mecha_parts/mecha_equipment", {
	locked: null,
	mode: 1,
	equip_cooldown: 10,
	energy_drain: 100,
	range: 3,
	name: "mounted gravitational catapult",
	desc: "An exosuit mounted Gravitational Catapult.",
	icon_state: "mecha_teleport",
	origin_tech: "bluespace=3;magnets=3;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action  (code/game/mecha/equipment/tools/other_tools.dm:84)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action", function* action(f: Frame, target: Value) {
	let atoms: Value = null, A: Value = null, iter: Value = null, i: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [target, atoms, A, iter, i, _T, $0, $e];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		if (!truthy(rt.sv(f, "locked"))) {
			if ((!truthy((rt.istype(live(target), T("/atom/movable")) ? 1 : 0)) || truthy(rt.fv(f, "anchored", live(target))))) {
				yield* g.srcCall(f, "occupant_message", fmt("Unable to lock on ＀", [live(target)]));
				return live(f.dot);
			}
			rt.setSv(f, "locked", live(target));
			yield* g.srcCall(f, "occupant_message", fmt("Locked on ＀", [live(target)]));
			yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
		} else {
			if (!isEqual(live(target), rt.sv(f, "locked"))) {
				if (truthy((rt.isIn(f, rt.sv(f, "locked"), (yield* g.call(f, P("/proc/view"), null, [rt.sv(f, "chassis")]))) ? 1 : 0))) {
					yield* g.callName(f, rt.sv(f, "locked"), "throw_at", [live(target), 14, 1.5]);
					rt.setSv(f, "locked", null);
					yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
					return 1;
				} else {
					rt.setSv(f, "locked", null);
					yield* g.srcCall(f, "occupant_message", fmt("Lock on ＀ disengaged.", [rt.sv(f, "locked")]));
					yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
				}
			}
		}
	} else if ($0 === 2) {
		atoms = rt.list();
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
			atoms = (yield* g.call(f, P("/proc/range"), null, [3, live(target)]));
		} else {
			atoms = (yield* g.call(f, P("/proc/orange"), null, [3, live(target)]));
		}
		A = null;
		rt.forList(f, 0, live(atoms), T("/atom/movable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (truthy(rt.fv(f, "anchored", live(A)))) {
				continue;
			}
			rt.spawnTail(f, 0, "/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action: spawn at game/mecha/equipment/tools/other_tools.dm:113", target, atoms, A, iter, i, _T);
		}
		rt.endFor(f, 0);
		_T = rt.getStep(f, live(target), 0);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀(＀) used a Gravitational Catapult in (＀,＀,＀)", [rt.gv(f, "ckey", rt.fv(f, "occupant", rt.sv(f, "chassis"))), rt.fv(f, "occupant", rt.sv(f, "chassis")), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		return 1;
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/action: spawn at game/mecha/equipment/tools/other_tools.dm:113", function* (f: Frame, target: Value, atoms: Value, A: Value, iter: Value, i: Value, _T: Value) {
	let $e: any;
	f.vars = () => [target, atoms, A, iter, i, _T, $e];
	iter = subtract(5, (yield* g.call(f, P("/proc/get_dist"), null, [live(A), live(target)])));
	i = null;
	rt.forRange(f, 1, 0, live(iter), 1);
	while (($e = rt.next(f, 1)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/step_away"), null, [live(A), live(target)]);
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	rt.endFor(f, 1);
	return null;
});

// /obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/get_equip_info  (code/game/mecha/equipment/tools/other_tools.dm:124)
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.callSuper(f, [], rt.Args.Same);
	if (isEqual(rt.sv(f, "mode"), 1)) {
		$1 = fmt("(＀)", [(rt.sv(f, "locked") || "Nothing")]);
	} else {
		$1 = null;
	}
	return fmt("＀ ＀ [<a href='?src=＃;mode=1'>S</a>|<a href='?src=＃;mode=2'>P</a>]", [$0, $1, live(f.src), live(f.src)]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/Topic  (code/game/mecha/equipment/tools/other_tools.dm:127)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/gravcatapult/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.at(live(f.args[1]), "mode"))) {
		rt.setSv(f, "mode", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "mode")])));
		yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(9617, "/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster", "/obj/item/mecha_parts/mecha_equipment", {
	deflect_coeff: 1.15,
	damage_coeff: 0.8,
	equip_cooldown: 10,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "armor booster module (Close Combat Weaponry)",
	desc: "Boosts exosuit armor against armed melee attacks. Requires energy to operate.",
	icon_state: "mecha_abooster_ccw",
	origin_tech: "materials=4;combat=4",
});

// /obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster/proc/attack_react  (code/game/mecha/equipment/tools/other_tools.dm:152)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster/proc/attack_react", function* attack_react(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "action_checks", live(f.src))))) return f.dot;
	yield* g.srcCall(f, "start_cooldown");
	return 1;
}, true);

rt.type(9618, "/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster", "/obj/item/mecha_parts/mecha_equipment", {
	deflect_coeff: 1.15,
	damage_coeff: 0.8,
	equip_cooldown: 10,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "armor booster module (Ranged Weaponry)",
	desc: "Boosts exosuit armor against ranged attacks. Completely blocks taser shots. Requires energy to operate.",
	icon_state: "mecha_abooster_proj",
	origin_tech: "materials=4;combat=3;engineering=3",
});

// /obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster/proc/projectile_react  (code/game/mecha/equipment/tools/other_tools.dm:171)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster/proc/projectile_react", function* projectile_react(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "action_checks", live(f.src))))) return f.dot;
	yield* g.srcCall(f, "start_cooldown");
	return 1;
}, true);

rt.type(9619, "/obj/item/mecha_parts/mecha_equipment/repair_droid", "/obj/item/mecha_parts/mecha_equipment", {
	health_boost: 1,
	droid_overlay: null,
	repairable_damage: null,
	energy_drain: 50,
	range: 0,
	selectable: 0,
	name: "exosuit repair droid",
	desc: "An automated repair droid for exosuits. Scans for damage and repairs it. Can fix almost all types of external or internal damage.",
	icon_state: "repair_droid",
	origin_tech: "magnets=3;programming=3;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Destroy  (code/game/mecha/equipment/tools/other_tools.dm:192)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	if (truthy(rt.sv(f, "chassis"))) {
		yield* g.callName(f, rt.sv(f, "chassis"), "cut_overlay", [rt.sv(f, "droid_overlay")]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/attach  (code/game/mecha/equipment/tools/other_tools.dm:198)
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/attach", function attach(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "droid_overlay", rt.new_(f, T("/icon"), [null, rt.fv(f, "icon", live(f.src)), "icon_state", "repair_droid"], rt.Args.Named));
	rt.callName(f, live(f.args[0]), "add_overlay", [rt.sv(f, "droid_overlay")]);
	return f.dot;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/detach  (code/game/mecha/equipment/tools/other_tools.dm:203)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/detach", function* detach(f: Frame) {
	yield* g.callName(f, rt.sv(f, "chassis"), "cut_overlay", [rt.sv(f, "droid_overlay")]);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/get_equip_info  (code/game/mecha/equipment/tools/other_tools.dm:208)
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	if (!truthy(rt.sv(f, "chassis"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "equip_ready"))) {
		$0 = "#0f0";
	} else {
		$0 = "#f00";
	}
	$1 = rt.fv(f, "name", live(f.src));
	$2 = live(f.src);
	if (truthy(rt.sv(f, "equip_ready"))) {
		$3 = "A";
	} else {
		$3 = "Dea";
	}
	return fmt("<span style=\"color:＀;\">*</span>&nbsp; ＀ - <a href='?src=＃;toggle_repairs=1'>＀ctivate</a>", [$0, $1, $2, $3]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Topic  (code/game/mecha/equipment/tools/other_tools.dm:213)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "toggle_repairs"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "chassis"), "cut_overlay", [rt.sv(f, "droid_overlay")]);
	if (truthy(rt.sv(f, "equip_ready"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		rt.setSv(f, "droid_overlay", (yield* g.new_(f, T("/icon"), [null, rt.fv(f, "icon", live(f.src)), "icon_state", "repair_droid_a"], rt.Args.Named)));
		yield* g.srcCall(f, "log_message", "Activated.");
		yield* g.srcCall(f, "set_ready_state", 0);
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		rt.setSv(f, "droid_overlay", (yield* g.new_(f, T("/icon"), [null, rt.fv(f, "icon", live(f.src)), "icon_state", "repair_droid"], rt.Args.Named)));
		yield* g.srcCall(f, "log_message", "Deactivated.");
		yield* g.srcCall(f, "set_ready_state", 1);
	}
	yield* g.callName(f, rt.sv(f, "chassis"), "add_overlay", [rt.sv(f, "droid_overlay")]);
	yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/repair_droid/proc/process  (code/game/mecha/equipment/tools/other_tools.dm:231)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/repair_droid/proc/process", function* process(f: Frame) {
	let h_boost: Value = null, repaired: Value = null, int_dam_flag: Value = null;
	let $e: any;
	f.vars = () => [h_boost, repaired, int_dam_flag, $e];
	if (!truthy(rt.sv(f, "chassis"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		return live(f.dot);
	}
	h_boost = rt.sv(f, "health_boost");
	repaired = 0;
	if (truthy(rt.bitAnd(rt.fv(f, "internal_damage", rt.sv(f, "chassis")), 4))) {
		(h_boost = rt.modify(live(h_boost), -2, multiply));
	} else {
		if ((truthy(rt.fv(f, "internal_damage", rt.sv(f, "chassis"))) && truthy(rt.op(f, "Prob", [], [15])))) {
			int_dam_flag = null;
			rt.forList(f, 0, rt.sv(f, "repairable_damage"));
			while (($e = rt.next(f, 0)) !== undefined) {
				int_dam_flag = $e;
				if (truthy(rt.bitAnd(rt.fv(f, "internal_damage", rt.sv(f, "chassis")), live(int_dam_flag)))) {
					yield* g.callName(f, rt.sv(f, "chassis"), "clearInternalDamage", [live(int_dam_flag)]);
					repaired = 1;
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if ((rt.lt(rt.sv(f, "health_boost"), 0) || rt.lt(rt.fv(f, "obj_integrity", rt.sv(f, "chassis")), rt.fv(f, "max_integrity", rt.sv(f, "chassis"))))) {
		rt.modField(f, rt.sv(f, "chassis"), "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [rt.sv(f, "health_boost"), subtract(rt.fv(f, "max_integrity", rt.sv(f, "chassis")), rt.fv(f, "obj_integrity", rt.sv(f, "chassis")))])), add);
		repaired = 1;
	}
	if (truthy(live(repaired))) {
		if (!truthy((yield* g.callName(f, rt.sv(f, "chassis"), "use_power", [rt.sv(f, "energy_drain")])))) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
			yield* g.srcCall(f, "set_ready_state", 1);
		}
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.callName(f, rt.sv(f, "chassis"), "cut_overlay", [rt.sv(f, "droid_overlay")]);
		rt.setSv(f, "droid_overlay", (yield* g.new_(f, T("/icon"), [null, rt.fv(f, "icon", live(f.src)), "icon_state", "repair_droid"], rt.Args.Named)));
		yield* g.callName(f, rt.sv(f, "chassis"), "add_overlay", [rt.sv(f, "droid_overlay")]);
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9620, "/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay", "/obj/item/mecha_parts/mecha_equipment", {
	coeff: 100,
	use_channels: null,
	energy_drain: 0,
	range: 0,
	selectable: 0,
	name: "exosuit energy relay",
	desc: "An exosuit module that wirelessly drains energy from any available power channel in area. The performance index is quite low.",
	icon_state: "tesla",
	origin_tech: "magnets=4;powerstorage=4;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Destroy  (code/game/mecha/equipment/tools/other_tools.dm:276)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/detach  (code/game/mecha/equipment/tools/other_tools.dm:280)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/detach", function* detach(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_charge  (code/game/mecha/equipment/tools/other_tools.dm:287)
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_charge", function get_charge(f: Frame) {
	let A: Value = null, pow_chan: Value = null;
	f.vars = () => [A, pow_chan];
	if (truthy(rt.sv(f, "equip_ready"))) {
		return live(f.dot);
	}
	A = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "chassis")]);
	if (!truthy((pow_chan = rt.callSrc(f, "get_power_channel", [live(A)])))) return f.dot;
	return 1000;
});

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_power_channel  (code/game/mecha/equipment/tools/other_tools.dm:296)
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_power_channel", function get_power_channel(f: Frame, A: Value) {
	let pow_chan: Value = null, c: Value = null;
	let $e: any;
	f.vars = () => [pow_chan, c, $e];
	pow_chan = null;
	if (truthy(live(A))) {
		c = null;
		rt.forList(f, 0, rt.sv(f, "use_channels"));
		while (($e = rt.next(f, 0)) !== undefined) {
			c = $e;
			if (truthy(rt.callName(f, live(A), "powered", [live(c)]))) {
				pow_chan = live(c);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	return live(pow_chan);
});

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Topic  (code/game/mecha/equipment/tools/other_tools.dm:303)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "toggle_relay"))) return f.dot;
	if (truthy(rt.sv(f, "equip_ready"))) {
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		yield* g.srcCall(f, "set_ready_state", 0);
		yield* g.srcCall(f, "log_message", "Activated.");
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.srcCall(f, "log_message", "Deactivated.");
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_equip_info  (code/game/mecha/equipment/tools/other_tools.dm:315)
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/get_equip_info", function get_equip_info(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	if (!truthy(rt.sv(f, "chassis"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "equip_ready"))) {
		$0 = "#0f0";
	} else {
		$0 = "#f00";
	}
	$1 = rt.fv(f, "name", live(f.src));
	$2 = live(f.src);
	if (truthy(rt.sv(f, "equip_ready"))) {
		$3 = "A";
	} else {
		$3 = "Dea";
	}
	return fmt("<span style=\"color:＀;\">*</span>&nbsp; ＀ - <a href='?src=＃;toggle_relay=1'>＀ctivate</a>", [$0, $1, $2, $3]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/process  (code/game/mecha/equipment/tools/other_tools.dm:320)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/tesla_energy_relay/proc/process", function* process(f: Frame) {
	let cur_charge: Value = null, A: Value = null, pow_chan: Value = null, c: Value = null, delta: Value = null;
	let $e: any;
	f.vars = () => [cur_charge, A, pow_chan, c, delta, $e];
	if ((!truthy(rt.sv(f, "chassis")) || truthy(rt.bitAnd(rt.fv(f, "internal_damage", rt.sv(f, "chassis")), 4)))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		return live(f.dot);
	}
	if (((cur_charge = (yield* g.callName(f, rt.sv(f, "chassis"), "get_charge", []))) === null || !truthy(rt.fv(f, "cell", rt.sv(f, "chassis"))))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.srcCall(f, "occupant_message", "No powercell detected.");
		return live(f.dot);
	}
	if (!rt.lt(live(cur_charge), rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "chassis"))))) return f.dot;
	if (!truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [rt.sv(f, "chassis")]))))) return f.dot;
	pow_chan = null;
	c = null;
	rt.forList(f, 0, rt.list(1, 3, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		c = $e;
		if (truthy((yield* g.callName(f, live(A), "powered", [live(c)])))) {
			pow_chan = live(c);
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(pow_chan))) return f.dot;
	delta = (yield* g.call(f, P("/proc/min"), null, [20, subtract(rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "chassis"))), live(cur_charge))]));
	yield* g.callName(f, rt.sv(f, "chassis"), "give_power", [live(delta)]);
	yield* g.callName(f, live(A), "use_power", [multiply(live(delta), rt.sv(f, "coeff")), live(pow_chan)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(9621, "/obj/item/mecha_parts/mecha_equipment/generator", "/obj/item/mecha_parts/mecha_equipment", {
	coeff: 100,
	fuel: null,
	max_fuel: 150000,
	fuel_per_cycle_idle: 25,
	fuel_per_cycle_active: 200,
	power_per_cycle: 20,
	range: 1,
	name: "exosuit plasma converter",
	desc: "An exosuit module that generates power using solid plasma as fuel. Pollutes the environment.",
	icon_state: "tesla",
	origin_tech: "plasmatech=2;powerstorage=2;engineering=2",
});

// /obj/item/mecha_parts/mecha_equipment/generator/proc/New  (code/game/mecha/equipment/tools/other_tools.dm:363)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "generator_init");
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/Destroy  (code/game/mecha/equipment/tools/other_tools.dm:367)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/generator_init  (code/game/mecha/equipment/tools/other_tools.dm:371)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/generator_init", function* generator_init(f: Frame) {
	rt.setSv(f, "fuel", (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [live(f.src)])));
	rt.setFv(f, "amount", rt.sv(f, "fuel"), 0);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/detach  (code/game/mecha/equipment/tools/other_tools.dm:375)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/detach", function* detach(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/Topic  (code/game/mecha/equipment/tools/other_tools.dm:379)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/Topic", function* Topic(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.at(live(f.args[1]), "toggle"))) return f.dot;
	if (truthy(rt.sv(f, "equip_ready"))) {
		yield* g.srcCall(f, "set_ready_state", 0);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
		yield* g.srcCall(f, "log_message", "Activated.");
	} else {
		yield* g.srcCall(f, "set_ready_state", 1);
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "log_message", "Deactivated.");
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/mecha_parts/mecha_equipment/generator/proc/get_equip_info  (code/game/mecha/equipment/tools/other_tools.dm:391)
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/get_equip_info", function get_equip_info(f: Frame) {
	let output: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [output, $0, $1, $2, $3, $4];
	if (!truthy((output = rt.callSuper(f, [], rt.Args.Same)))) return f.dot;
	$0 = live(output);
	$1 = rt.sv(f, "fuel");
	$2 = rt.call(f, P("/proc/round"), null, [multiply(rt.fv(f, "amount", rt.sv(f, "fuel")), rt.fv(f, "perunit", rt.sv(f, "fuel"))), 0.10000000149011612]);
	$3 = live(f.src);
	if (truthy(rt.sv(f, "equip_ready"))) {
		$4 = "A";
	} else {
		$4 = "Dea";
	}
	return fmt("＀ [＀: ＀ cm<sup>3</sup>] - <a href='?src=＃;toggle=1'>＀ctivate</a>", [$0, $1, $2, $3, $4]);
	return f.dot;
});

// /obj/item/mecha_parts/mecha_equipment/generator/proc/action  (code/game/mecha/equipment/tools/other_tools.dm:397)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/action", function* action(f: Frame, target: Value) {
	let result: Value = null;
	f.vars = () => [target, result];
	if (!truthy(rt.sv(f, "chassis"))) return f.dot;
	if (!truthy((result = (yield* g.srcCall(f, "load_fuel", live(target)))))) return f.dot;
	yield* g.call(f, P("/proc/send_byjax"), null, [rt.fv(f, "occupant", rt.sv(f, "chassis")), "exosuit.browser", fmt("＃", [live(f.src)]), (yield* g.callName(f, live(f.src), "get_equip_info", []))]);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/load_fuel  (code/game/mecha/equipment/tools/other_tools.dm:402)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/load_fuel", function* load_fuel(f: Frame, _P: Value) {
	let to_load: Value = null, units: Value = null;
	f.vars = () => [_P, to_load, units];
	if ((isEqual(rt.fv(f, "type", live(_P)), rt.fv(f, "type", rt.sv(f, "fuel"))) && rt.gt(rt.fv(f, "amount", live(_P)), 0))) {
		if (truthy((to_load = (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "max_fuel"), multiply(rt.fv(f, "amount", rt.sv(f, "fuel")), rt.fv(f, "perunit", rt.sv(f, "fuel")))), 0]))))) {
			units = (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/round"), null, [divide(live(to_load), rt.fv(f, "perunit", live(_P)))])), 1])), rt.fv(f, "amount", live(_P))]));
			rt.modField(f, rt.sv(f, "fuel"), "amount", live(units), add);
			yield* g.callName(f, live(_P), "use", [live(units)]);
			yield* g.srcCall(f, "occupant_message", fmt("＀ unit５ of ＀ successfully loaded.", [live(units), rt.sv(f, "fuel")]));
			return live(units);
		} else {
			yield* g.srcCall(f, "occupant_message", "Unit is full.");
			return 0;
		}
	} else {
		yield* g.srcCall(f, "occupant_message", fmt("<span class='warning'>＀ traces in target minimal! ＀ cannot be used as fuel.</span>", [rt.sv(f, "fuel"), live(_P)]));
		return live(f.dot);
	}
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/attackby  (code/game/mecha/equipment/tools/other_tools.dm:418)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/attackby", function* attackby(f: Frame, weapon: Value, user: Value, params: Value) {
	f.vars = () => [weapon, user, params];
	yield* g.srcCall(f, "load_fuel", live(weapon));
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/critfail  (code/game/mecha/equipment/tools/other_tools.dm:421)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/critfail", function* critfail(f: Frame) {
	let _T: Value = null, GM: Value = null;
	let $0: any, $1: any;
	f.vars = () => [_T, GM, $0, $1];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype((_T = rt.getStep(f, live(f.src), 0)), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.callName(f, (GM = (yield* g.new_(f, T("/datum/gas_mixture"), []))), "assert_gas", ["plasma"]);
	if (truthy(rt.op(f, "Prob", [], [10]))) {
		rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "plasma"), 1, 100, add);
		rt.setFv(f, "temperature", live(GM), 1773.1500244140625);
		yield* g.callName(f, live(_T), "visible_message", [fmt("The ＀ suddenly disgorges a cloud of heated plasma.", [live(f.src)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		rt.modAt(rt.index(rt.fv(f, "gases", live(GM)), "plasma"), 1, 5, add);
		$0 = live(GM);
		if (truthy((rt.istype(live(_T), T("/turf/open")) ? 1 : 0))) {
			$1 = (yield* g.callName(f, rt.fv(f, "air", live(_T)), "return_temperature", []));
		} else {
			$1 = 293.1499938964844;
		}
		rt.setFv(f, "temperature", $0, $1);
		yield* g.callName(f, live(_T), "visible_message", [fmt("The ＀ suddenly disgorges a cloud of plasma.", [live(f.src)])]);
	}
	yield* g.callName(f, live(_T), "assume_air", [live(GM)]);
	return live(f.dot);
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/proc/process  (code/game/mecha/equipment/tools/other_tools.dm:440)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/proc/process", function* process(f: Frame) {
	let cur_charge: Value = null, use_fuel: Value = null;
	f.vars = () => [cur_charge, use_fuel];
	if (!truthy(rt.sv(f, "chassis"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "set_ready_state", 1);
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "amount", rt.sv(f, "fuel")), 0)) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.srcCall(f, "log_message", "Deactivated - no fuel.");
		yield* g.srcCall(f, "set_ready_state", 1);
		return live(f.dot);
	}
	if ((cur_charge = (yield* g.callName(f, rt.sv(f, "chassis"), "get_charge", []))) === null) {
		yield* g.srcCall(f, "set_ready_state", 1);
		yield* g.srcCall(f, "occupant_message", "No powercell detected.");
		yield* g.srcCall(f, "log_message", "Deactivated.");
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	use_fuel = rt.sv(f, "fuel_per_cycle_idle");
	if (rt.lt(live(cur_charge), rt.gv(f, "maxcharge", rt.fv(f, "cell", rt.sv(f, "chassis"))))) {
		use_fuel = rt.sv(f, "fuel_per_cycle_active");
		yield* g.callName(f, rt.sv(f, "chassis"), "give_power", [rt.sv(f, "power_per_cycle")]);
	}
	(rt.modField(f, rt.sv(f, "fuel"), "amount", (yield* g.call(f, P("/proc/min"), null, [divide(live(use_fuel), rt.fv(f, "perunit", rt.sv(f, "fuel"))), rt.fv(f, "amount", rt.sv(f, "fuel"))])), subtract));
	yield* g.srcCall(f, "update_equip_info");
	return 1;
}, true, { waitfor: false });

rt.type(9622, "/obj/item/mecha_parts/mecha_equipment/generator/nuclear", "/obj/item/mecha_parts/mecha_equipment/generator", {
	rad_per_cycle: 0.3,
	max_fuel: 50000,
	fuel_per_cycle_idle: 10,
	fuel_per_cycle_active: 30,
	power_per_cycle: 50,
	name: "exonuclear reactor",
	desc: "An exosuit module that generates power using uranium as fuel. Pollutes the environment.",
	icon_state: "tesla",
	origin_tech: "powerstorage=4;engineering=4",
});

// /obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/generator_init  (code/game/mecha/equipment/tools/other_tools.dm:477)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/generator_init", function* generator_init(f: Frame) {
	rt.setSv(f, "fuel", (yield* g.new_(f, T("/obj/item/stack/sheet/mineral/uranium"), [live(f.src)])));
	rt.setFv(f, "amount", rt.sv(f, "fuel"), 0);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/process  (code/game/mecha/equipment/tools/other_tools.dm:484)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/generator/nuclear/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 2, 7, rt.sv(f, "rad_per_cycle"), 1]);
	return f.dot;
}, true, { waitfor: false });
