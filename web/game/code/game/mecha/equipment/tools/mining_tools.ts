// From code/game/mecha/equipment/tools/mining_tools.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9611, "/obj/item/mecha_parts/mecha_equipment/drill", "/obj/item/mecha_parts/mecha_equipment", {
	equip_cooldown: 30,
	energy_drain: 10,
	name: "exosuit drill",
	desc: "Equipment for engineering and combat exosuits. This is the drill that'll pierce the heavens!",
	icon_state: "mecha_drill",
	force: 15,
});

// /obj/item/mecha_parts/mecha_equipment/drill/proc/action  (code/game/mecha/equipment/tools/mining_tools.dm:14)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/action", function* action(f: Frame, target: Value) {
	let target_obj: Value = null, _T: Value = null;
	f.vars = () => [target, target_obj, _T];
	if (!truthy((yield* g.srcCall(f, "action_checks", live(target))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/turf/open/space")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) {
		if (truthy(rt.bitAnd(rt.gv(f, "resistance_flags", (target_obj = live(target))), 16))) {
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='warning'>＀ starts to drill ＀.</span>", [rt.sv(f, "chassis"), live(target)]), fmt("<span class='userdanger'>＀ starts to drill ＀...</span>", [rt.sv(f, "chassis"), live(target)]), "<span class='italics'>You hear drilling.</span>"]);
	if (!truthy((yield* g.srcCall(f, "do_after_cooldown", live(target))))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)])))) {
		yield* g.callName(f, (_T = live(target)), "drill_act", [live(f.src)]);
	} else {
		yield* g.srcCall(f, "log_message", fmt("Drilled through ＀", [live(target)]));
		if (truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) {
			if (truthy((rt.istype(live(f.src), T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill")) ? 1 : 0))) {
				yield* g.srcCall(f, "drill_mob", live(target), rt.fv(f, "occupant", rt.sv(f, "chassis")), 120);
			} else {
				yield* g.srcCall(f, "drill_mob", live(target), rt.fv(f, "occupant", rt.sv(f, "chassis")));
			}
		} else {
			yield* g.callName(f, live(target), "ex_act", [2]);
		}
	}
	return f.dot;
}, true);

// /turf/closed/wall/r_wall/proc/drill_act  (code/game/mecha/equipment/tools/mining_tools.dm:44)  may sleep
rt.def("/turf/closed/wall/r_wall/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	f.vars = () => [drill];
	if (truthy((rt.istype(live(drill), T("/obj/item/mecha_parts/mecha_equipment/drill/diamonddrill")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, live(drill), "do_after_cooldown", [live(f.src)])))) {
			yield* g.callName(f, live(drill), "log_message", [fmt("Drilled through ＀", [live(f.src)])]);
			yield* g.srcCall(f, "ex_act", 3);
		}
	} else {
		yield* g.callName(f, live(drill), "occupant_message", [fmt("<span class='danger'>＀ is too durable to drill through.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /turf/closed/mineral/proc/drill_act  (code/game/mecha/equipment/tools/mining_tools.dm:52)  may sleep
rt.def("/turf/closed/mineral/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [drill, M, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.fv(f, "chassis", live(drill)), 1])), T("/turf/closed/mineral"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.bitAnd(rt.getDir(f, rt.fv(f, "chassis", live(drill)), live(M)), rt.gv(f, "dir", rt.fv(f, "chassis", live(drill)))))) {
			yield* g.callName(f, live(M), "gets_drilled", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(drill), "log_message", [fmt("Drilled through ＀", [live(f.src)])]);
	yield* g.callName(f, live(drill), "move_ores", []);
	return f.dot;
}, true);

// /turf/open/floor/plating/asteroid/proc/drill_act  (code/game/mecha/equipment/tools/mining_tools.dm:59)  may sleep
rt.def("/turf/open/floor/plating/asteroid/proc/drill_act", function* drill_act(f: Frame, drill: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [drill, M, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, rt.fv(f, "chassis", live(drill))])), T("/turf/open/floor/plating/asteroid"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.bitAnd(rt.getDir(f, rt.fv(f, "chassis", live(drill)), live(M)), rt.gv(f, "dir", rt.fv(f, "chassis", live(drill)))))) {
			yield* g.callName(f, live(M), "gets_dug", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(drill), "log_message", [fmt("Drilled through ＀", [live(f.src)])]);
	yield* g.callName(f, live(drill), "move_ores", []);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/drill/proc/move_ores  (code/game/mecha/equipment/tools/mining_tools.dm:67)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/move_ores", function* move_ores(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!truthy(rt.locateIn(f, T("/obj/item/mecha_parts/mecha_equipment/hydraulic_clamp"), (rt.fv(f, "equipment", rt.sv(f, "chassis")) && (rt.istype(rt.sv(f, "chassis"), T("/obj/mecha/working/ripley")) ? 1 : 0))))) return f.dot;
	yield* g.callName(f, (R = rt.sv(f, "chassis")), "collect_ore", []);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/drill/proc/can_attach  (code/game/mecha/equipment/tools/mining_tools.dm:72)
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/can_attach", function can_attach(f: Frame) {
	if (truthy(rt.callSuper(f, [], rt.Args.Same))) {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/mecha/working")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/mecha/combat")) ? 1 : 0)))) {
			return 1;
		}
	}
	return 0;
}, false, { args: ["M"] });

// /obj/item/mecha_parts/mecha_equipment/drill/proc/drill_mob  (code/game/mecha/equipment/tools/mining_tools.dm:78)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/drill/proc/drill_mob", function* drill_mob(f: Frame, target: Value, user: Value, drill_damage: Value) {
	f.vars = () => [target, user, drill_damage];
	if (live(drill_damage) === null) {
		drill_damage = 80;
	}
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ drills ＀ with ＀.</span>", [rt.sv(f, "chassis"), live(target), live(f.src)]), fmt("<span class='userdanger'>＀ drills ＀ with ＀.</span>", [rt.sv(f, "chassis"), live(target), live(f.src)])]);
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(target), "attacked", fmt("＀", [rt.sv(f, "name")]), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "a_intent", live(user))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.sv(f, "damtype")]))])]);
	if (isEqual(rt.fv(f, "stat", live(target)), 2)) {
		if (truthy(rt.fv(f, "butcher_results", live(target)))) {
			yield* g.callName(f, live(target), "harvest", [rt.sv(f, "chassis")]);
		} else {
			yield* g.callName(f, live(target), "gib", []);
		}
	} else {
		yield* g.callName(f, live(target), "take_bodypart_damage", [live(drill_damage)]);
	}
	if (!truthy(live(target))) return f.dot;
	yield* g.callName(f, live(target), "Unconscious", [200]);
	yield* g.callName(f, live(target), "updatehealth", []);
	return f.dot;
}, true);

rt.type(9613, "/obj/item/mecha_parts/mecha_equipment/mining_scanner", "/obj/item/mecha_parts/mecha_equipment", {
	scanning_time: 0,
	selectable: 0,
	equip_cooldown: 30,
	name: "exosuit mining scanner",
	desc: "Equipment for engineering and combat exosuits. It will automatically check surrounding rock for useful minerals.",
	icon_state: "mecha_analyzer",
});

// /obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/New  (code/game/mecha/equipment/tools/mining_tools.dm:112)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/process  (code/game/mecha/equipment/tools/mining_tools.dm:116)  may sleep
rt.def("/obj/item/mecha_parts/mecha_equipment/mining_scanner/proc/process", function* process(f: Frame) {
	let mecha: Value = null;
	f.vars = () => [mecha];
	if (!truthy(rt.sv(f, "loc"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	if (!(truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha/working")) ? 1 : 0)) && rt.le(rt.sv(f, "scanning_time"), rt.worldTime(f)))) return f.dot;
	if (!truthy(rt.gv(f, "occupant", (mecha = rt.sv(f, "loc"))))) {
		return live(f.dot);
	}
	rt.setSv(f, "scanning_time", add(rt.worldTime(f), rt.sv(f, "equip_cooldown")));
	yield* g.call(f, P("/proc/mineral_scan_pulse"), null, [rt.getStep(f, live(f.src), 0)]);
	return f.dot;
}, true, { waitfor: false });
