// From code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4929, "/mob/living/simple_animal/hostile/spawner/lavaland", "/mob/living/simple_animal/hostile/spawner", {
	gps: null,
	emitted_light: null,
	max_mobs: 3,
	spawn_time: 300,
	spawn_text: "emerges from",
	name: "necropolis tendril",
	desc: "A vile tendril of corruption, originating deep underground. Terrible monsters are pouring out of it.",
	icon: rt.rsc("icons/mob/nest.dmi"),
	icon_state: "tendril",
	icon_living: "tendril",
	icon_dead: "tendril",
	faction: null,
	weather_immunities: null,
	health: 250,
	maxHealth: 250,
	mob_type: rt.typePath("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher/tendril"),
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1e+31,
	loot: null,
	del_on_death: 1,
});

// /mob/living/simple_animal/hostile/spawner/lavaland/proc/<init>  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:14)
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("mining"));
	rt.setSv(f, "weather_immunities", rt.list("lava", "ash"));
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]));
	$0 = $0;
	rt.setSv(f, "loot", rt.list(T("/obj/effect/collapse"), T("/obj/structure/closet/crate/necropolis/tendril")));
	return f.dot;
});

// /mob/living/simple_animal/hostile/spawner/lavaland/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:37)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [F, M, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "emitted_light", (yield* g.new_(f, T("/obj/effect/light_emitter/tendril"), [rt.sv(f, "loc")])));
	F = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/block"), null, [rt.locate((yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "x", live(f.src)), 1), 1])), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.fv(f, "y", live(f.src)), 1), 1])), rt.fv(f, "z", live(f.src))), rt.locate((yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "x", live(f.src)), 1), rt.fv(f, "maxx", rt.world())])), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "y", live(f.src)), 1), rt.fv(f, "maxy", rt.world())])), rt.fv(f, "z", live(f.src)))])));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (truthy((rt.istype(live(F), T("/turf/closed/mineral")) ? 1 : 0))) {
			yield* g.callName(f, (M = live(F)), "ChangeTurf", [rt.fv(f, "turf_type", live(M)), 0, 1]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "gps", (yield* g.new_(f, T("/obj/item/device/gps/internal"), [live(f.src)])));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/spawner/lavaland/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:46)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "emitted_light")]);
	rt.setSv(f, "emitted_light", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "gps")]);
	rt.setSv(f, "gps", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/spawner/lavaland/proc/death  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:53)  may sleep
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/death", function* death(f: Frame) {
	let last_tendril: Value = null, other: Value = null, L: Value = null, C: Value = null, suffixm: Value = null, prefix: Value = null;
	let $e: any;
	f.vars = () => [last_tendril, other, L, C, suffixm, prefix, $e];
	last_tendril = 1;
	other = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living/simple_animal/hostile/spawner/lavaland"));
	while (($e = rt.next(f, 0)) !== undefined) {
		other = $e;
		if (!isEqual(live(other), live(f.src))) {
			last_tendril = 0;
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(12089, "/obj/effect/collapse", "/obj/effect", {
	emitted_light: null,
	anchored: 1,
	name: "collapsing necropolis tendril",
	desc: "Get clear!",
	layer: 2.9,
	icon: rt.rsc("icons/mob/nest.dmi"),
	icon_state: "tendril",
	density: 1,
});

// /obj/effect/collapse/proc/Initialize  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:82)  may sleep
rt.def("/obj/effect/collapse/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "emitted_light", (yield* g.new_(f, T("/obj/effect/light_emitter/tendril"), [rt.sv(f, "loc")])));
	yield* g.srcCall(f, "visible_message", "<span class='boldannounce'>The tendril writhes in fury as the earth around it begins to crack and break apart! Get back!</span>");
	yield* g.srcCall(f, "visible_message", "<span class='warning'>Something falls free of the tendril!</span>");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/tendril_destroyed.ogg"), 200, 0, 50, 1, 1]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/collapse/proc/collapse")])), 50]);
	return f.dot;
}, true);

// /obj/effect/collapse/proc/Destroy  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:90)  may sleep
rt.def("/obj/effect/collapse/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "emitted_light")]);
	rt.setSv(f, "emitted_light", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/collapse/proc/collapse  (code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm:94)  may sleep
rt.def("/obj/effect/collapse/proc/collapse", function* collapse(f: Frame) {
	let M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, _T, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [7, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 15, 1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/explosionfar.ogg"), 200, 1]);
	yield* g.srcCall(f, "visible_message", "<span class='boldannounce'>The tendril falls inward, the ground around it widening into a yawning chasm!</span>");
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)])), T("/turf"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (!truthy(rt.fv(f, "density", live(_T)))) {
			yield* g.callName(f, live(_T), "TerraformTurf", [T("/turf/open/chasm/straight_down/lava_land_surface")]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
