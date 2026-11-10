// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/mining_mobs/necropolis_tendril.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


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

// necropolis_tendril.dm:14
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("mining");
	this.weather_immunities = list("lava", "ash");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 5, "min_n2", 0, "max_n2", 0]);

	this.loot = list(T("/obj/effect/collapse"), T("/obj/structure/closet/crate/necropolis/tendril"));
	return f.dot;
});

// necropolis_tendril.dm:37
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null, M: Value = null;
	f.dot = (yield* parent_proc());
	this.emitted_light = (yield* new_(T("/obj/effect/light_emitter/tendril"), this.loc));
	for (F of each(block(rt.locate(max(this.x - 1, 1), max(this.y - 1, 1), this.z), rt.locate(min(this.x + 1, rt.world().maxx), min(this.y + 1, rt.world().maxy), this.z)))) {
		if (rt.istype(F, T("/turf/closed/mineral"))) {
			yield* (M = F).ChangeTurf(M.turf_type, 0, 1);
		}
	}
	this.gps = (yield* new_(T("/obj/item/device/gps/internal"), this));
	return f.dot;
}, true);

// necropolis_tendril.dm:46
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.emitted_light);
	this.emitted_light = null;
	yield* qdel(this.gps);
	this.gps = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// necropolis_tendril.dm:53
rt.def("/mob/living/simple_animal/hostile/spawner/lavaland/proc/death", function* death(f: Frame) {
	let other: Value = null;
	let last_tendril: Value = 1;
	for (other of each(GLOB.mob_list, T("/mob/living/simple_animal/hostile/spawner/lavaland"))) {
		if (other != this) {
			last_tendril = 0;
			break;
		}
	}
	yield* parent_proc();
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

// necropolis_tendril.dm:82
rt.def("/obj/effect/collapse/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.emitted_light = (yield* new_(T("/obj/effect/light_emitter/tendril"), this.loc));
	this.visible_message("<span class='boldannounce'>The tendril writhes in fury as the earth around it begins to crack and break apart! Get back!</span>");
	this.visible_message("<span class='warning'>Something falls free of the tendril!</span>");
	playsound(this.loc, rt.rsc("sound/effects/tendril_destroyed.ogg"), 200, 0, 50, 1, 1);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/collapse/proc/collapse"))), 50);
	return f.dot;
}, true);

// necropolis_tendril.dm:90
rt.def("/obj/effect/collapse/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.emitted_light);
	this.emitted_light = null;
	return (yield* parent_proc());
}, true);

// necropolis_tendril.dm:94
rt.def("/obj/effect/collapse/proc/collapse", function* collapse(f: Frame) {
	let M: Value = null, _T: Value = null;
	for (M of each(range(7, this), T("/mob"))) {
		shake_camera(M, 15, 1);
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/explosionfar.ogg"), 200, 1);
	this.visible_message("<span class='boldannounce'>The tendril falls inward, the ground around it widening into a yawning chasm!</span>");
	for (_T of each(range(2, this), T("/turf"))) {
		if (!_T.density) {
			yield* _T.TerraformTurf(T("/turf/open/chasm/straight_down/lava_land_surface"));
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);
