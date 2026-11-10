// Based on /tg/station's code/modules/mining/equipment/mineral_scanner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


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

// mineral_scanner.dm:15
rt.def("/obj/item/device/mining_scanner/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!user.client) {
		return f.dot;
	}
	if (!(this.current_cooldown <= rt.worldTime(f))) return f.dot;
	this.current_cooldown = rt.worldTime(f) + this.cooldown;
	yield* mineral_scan_pulse(rt.getStep(f, user, 0));
	return f.dot;
}, true);

rt.type(9401, "/obj/item/device/mining_scanner/admin", "/obj/item/device/mining_scanner", {});

// mineral_scanner.dm:25
rt.def("/obj/item/device/mining_scanner/admin/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	for (M of each(rt.world(), T("/turf/closed/mineral"))) {
		if (M.scan_state) {
			M.icon_state = M.scan_state;
		}
	}
	yield* qdel(this);
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

// mineral_scanner.dm:50
rt.def("/obj/item/device/t_scanner/adv_mining_scanner/proc/scan", function* scan(f: Frame) {
	let t: Value = null;
	if (!(this.current_cooldown <= rt.worldTime(f))) return f.dot;
	this.current_cooldown = rt.worldTime(f) + this.cooldown;
	yield* mineral_scan_pulse((t = rt.getStep(f, this, 0)), this.range);
	return f.dot;
}, true);

// mineral_scanner.dm:56
rt.def("/proc/mineral_scan_pulse", function* mineral_scan_pulse(f: Frame, _T: Value, range: Value) {
	let M: Value = null, oldC: Value = null, C: Value = null;
	range ??= rt.world().view;
	let minerals: Value = list();
	for (M of each((yield* g.call(f, P("/proc/range"), null, [range, _T])), T("/turf/closed/mineral"))) {
		if (M.scan_state) {
			minerals += M;
		}
	}
	if (!rt.length(minerals)) return f.dot;
	M = null;
	for (M of each(minerals, T("/turf/closed/mineral"))) {
		if (oldC = rt.locateIn(f, T("/obj/effect/temp_visual/mining_overlay"), M)) {
			yield* qdel(oldC);
		}
		(C = (yield* new_(T("/obj/effect/temp_visual/mining_overlay"), M))).icon_state = M.scan_state;
	}
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

// mineral_scanner.dm:78
rt.def("/obj/effect/temp_visual/mining_overlay/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 0, "time", this.duration, "easing", 64]);
	return f.dot;
}, true);
