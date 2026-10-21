// From code/modules/mining/equipment/mineral_scanner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9400, "/obj/item/device/mining_scanner", "/obj/item/device", {
	cooldown: 35,
	current_cooldown: 0,
	flags: 64,
	desc: "A scanner that checks surrounding rock for useful minerals; it can also be used to stop gibtonite detonations.",
	name: "manual mining scanner",
	icon_state: "mining1",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "engineering=1;magnets=1",
});

// /obj/item/device/mining_scanner/proc/attack_self  (code/modules/mining/equipment/mineral_scanner.dm:15)  may sleep
rt.def("/obj/item/device/mining_scanner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.fv(f, "client", live(user)))) {
		return live(f.dot);
	}
	if (!rt.le(rt.sv(f, "current_cooldown"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "current_cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown")));
	yield* g.call(f, P("/proc/mineral_scan_pulse"), null, [rt.getStep(f, live(user), 0)]);
	return f.dot;
}, true);

rt.type(9401, "/obj/item/device/mining_scanner/admin", "/obj/item/device/mining_scanner", {});

// /obj/item/device/mining_scanner/admin/proc/attack_self  (code/modules/mining/equipment/mineral_scanner.dm:25)  may sleep
rt.def("/obj/item/device/mining_scanner/admin/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [user, M, $e];
	M = null;
	rt.forList(f, 0, rt.world(), T("/turf/closed/mineral"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "scan_state", live(M)))) {
			rt.setFv(f, "icon_state", live(M), rt.fv(f, "scan_state", live(M)));
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9280, "/obj/item/device/t_scanner/adv_mining_scanner", "/obj/item/device/t_scanner", {
	cooldown: 35,
	current_cooldown: 0,
	range: 7,
	flags: 64,
	desc: "A scanner that automatically checks surrounding rock for useful minerals; it can also be used to stop gibtonite detonations. This one has an extended range.",
	name: "advanced automatic mining scanner",
	icon_state: "mining0",
	item_state: "analyzer",
	w_class: 2,
	slot_flags: 512,
	origin_tech: "engineering=3;magnets=3",
});

// /obj/item/device/t_scanner/adv_mining_scanner/proc/scan  (code/modules/mining/equipment/mineral_scanner.dm:50)  may sleep
rt.def("/obj/item/device/t_scanner/adv_mining_scanner/proc/scan", function* scan(f: Frame) {
	let t: Value = null;
	f.vars = () => [t];
	if (!rt.le(rt.sv(f, "current_cooldown"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "current_cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown")));
	yield* g.call(f, P("/proc/mineral_scan_pulse"), null, [(t = rt.getStep(f, live(f.src), 0)), rt.sv(f, "range")]);
	return f.dot;
}, true);

// /proc/mineral_scan_pulse  (code/modules/mining/equipment/mineral_scanner.dm:56)  may sleep
rt.def("/proc/mineral_scan_pulse", function* mineral_scan_pulse(f: Frame, _T: Value, range: Value) {
	let minerals: Value = null, M: Value = null, oldC: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [_T, range, minerals, M, oldC, C, $e];
	if (live(range) === null) {
		range = rt.fv(f, "view", rt.world());
	}
	minerals = rt.list();
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [live(range), live(_T)])), T("/turf/closed/mineral"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(rt.fv(f, "scan_state", live(M)))) {
			minerals = rt.modify(live(minerals), live(M), add);
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.length(live(minerals)))) return f.dot;
	M = null;
	rt.forList(f, 0, live(minerals), T("/turf/closed/mineral"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((oldC = rt.locateIn(f, T("/obj/effect/temp_visual/mining_overlay"), live(M))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(oldC)]);
		}
		rt.setFv(f, "icon_state", (C = (yield* g.new_(f, T("/obj/effect/temp_visual/mining_overlay"), [live(M)]))), rt.fv(f, "scan_state", live(M)));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11671, "/obj/effect/temp_visual/mining_overlay", "/obj/effect/temp_visual", {
	duration: 35,
	plane: 18,
	layer: 18,
	icon: rt.rsc("icons/effects/ore_visuals.dmi"),
	appearance_flags: 0,
	pixel_x: -224,
	pixel_y: -224,
});

// /obj/effect/temp_visual/mining_overlay/proc/Initialize  (code/modules/mining/equipment/mineral_scanner.dm:78)  may sleep
rt.def("/obj/effect/temp_visual/mining_overlay/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "alpha", 0, "time", rt.sv(f, "duration"), "easing", 64]);
	return f.dot;
}, true);
