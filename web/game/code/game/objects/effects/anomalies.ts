// Based on /tg/station's code/game/objects/effects/anomalies.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(11784, "/obj/effect/anomaly", "/obj/effect", {
	movechance: 70,
	aSignal: null,
	impact_area: null,
	lifespan: 990,
	death_time: null,
	countdown_colour: null,
	countdown: null,
	anchored: 1,
	light_range: 3,
	name: "anomaly",
	desc: "A mysterious anomaly, seen commonly only in the region of space that the station orbits...",
	icon_state: "bhole3",
	density: 0,
});

// anomalies.dm:21
rt.def("/obj/effect/anomaly/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_lifespan: Value) {
	yield* parent_proc();
	(rt.modGl("poi_list", this, rt.bitOr));
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.impact_area = get_area(this);
	this.aSignal = (yield* new_(T("/obj/item/device/assembly/signaler/anomaly"), this));
	this.aSignal.name = `${this.name} core`;
	this.aSignal.code = rand(1, 100);
	this.aSignal.frequency = rand(1200, 1599);
	if (IsMultiple(this.aSignal.frequency, 2)) {
		this.aSignal.frequency++;
	}
	if (new_lifespan) {
		this.lifespan = new_lifespan;
	}
	this.death_time = rt.worldTime(f) + this.lifespan;
	this.countdown = (yield* new_(T("/obj/effect/countdown/anomaly"), this));
	if (this.countdown_colour) {
		this.countdown.color = this.countdown_colour;
	}
	yield* this.countdown.start();
	return f.dot;
}, true);

// anomalies.dm:43
rt.def("/obj/effect/anomaly/proc/process", function* process(f: Frame) {
	yield* this.anomalyEffect();
	if (!(this.death_time < rt.worldTime(f))) return f.dot;
	if (this.loc) {
		yield* this.detonate();
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// anomalies.dm:50
rt.def("/obj/effect/anomaly/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.poi_list.Remove(this);
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* qdel(this.countdown);
	return (yield* parent_proc());
}, true);

// anomalies.dm:56
rt.def("/obj/effect/anomaly/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	if (!prob(this.movechance)) return f.dot;
	yield* step(this, pick(GLOB.alldirs));
	return f.dot;
}, true);

// anomalies.dm:63
rt.def("/obj/effect/anomaly/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity != 1) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// anomalies.dm:67
rt.def("/obj/effect/anomaly/proc/anomalyNeutralize", function* anomalyNeutralize(f: Frame) {
	let O: Value = null;
	yield* new_(T("/obj/effect/particle_effect/smoke/bad"), this.loc);
	for (O of each(this, T("/atom/movable"))) {
		O.loc = this.loc;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// anomalies.dm:76
rt.def("/obj/effect/anomaly/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!rt.istype(I, T("/obj/item/device/analyzer"))) return f.dot;
	to_chat(user, `<span class='notice'>Analyzing... ${this}'s unstable field is fluctuating along frequency ${format_frequency(this.aSignal.frequency)}, code ${this.aSignal.code}.</span>`);
	return f.dot;
});

rt.type(11785, "/obj/effect/anomaly/grav", "/obj/effect/anomaly", {
	boing: 0,
	name: "gravitational anomaly",
	icon_state: "shield2",
	density: 0,
});

// anomalies.dm:88
rt.def("/obj/effect/anomaly/grav/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.aSignal.origin_tech = "magnets=7";
	return f.dot;
}, true);

// anomalies.dm:92
rt.def("/obj/effect/anomaly/grav/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let O: Value = null, M: Value = null, target: Value = null;
	yield* parent_proc();
	this.boing = 1;
	for (O of each(orange(4, this), T("/obj"))) {
		if (!O.anchored) {
			yield* step_towards(O, this);
		}
	}
	for (M of each(range(0, this), T("/mob/living"))) {
		yield* this.gravShock(M);
	}
	M = null;
	for (M of each(orange(4, this), T("/mob/living"))) {
		yield* step_towards(M, this);
	}
	O = null;
	for (O of each(range(0, this), T("/obj"))) {
		if (!O.anchored) {
			if ((target = rt.locateIn(f, T("/mob/living"), view(4, this))) && !target.stat) {
				yield* O.throw_at(target, 5, 10);
			}
		}
	}
	return f.dot;
}, true);

// anomalies.dm:108
rt.def("/obj/effect/anomaly/grav/proc/Crossed", function* Crossed(f: Frame, A: Value) {
	yield* this.gravShock(A);
	return f.dot;
}, true);

// anomalies.dm:111
rt.def("/obj/effect/anomaly/grav/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* this.gravShock(A);
	return f.dot;
}, true);

// anomalies.dm:114
rt.def("/obj/effect/anomaly/grav/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	yield* this.gravShock(A);
	return f.dot;
}, true);

// anomalies.dm:117
rt.def("/obj/effect/anomaly/grav/proc/gravShock", function* gravShock(f: Frame, A: Value) {
	if (!(this.boing && rt.istype(A, T("/mob/living")) && !A.stat)) return f.dot;
	yield* A.Knockdown(40);
	let target: Value = get_edge_target_turf(A, rt.getDir(f, this, get_step_away(A, this)));
	yield* A.throw_at(target, 5, 1);
	this.boing = 0;
	return f.dot;
}, true);

rt.type(11786, "/obj/effect/anomaly/flux", "/obj/effect/anomaly", {
	canshock: 0,
	shockdamage: 20,
	explosive: 1,
	name: "flux wave anomaly",
	icon_state: "electricity2",
	density: 1,
});

// anomalies.dm:134
rt.def("/obj/effect/anomaly/flux/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.aSignal.origin_tech = "powerstorage=7";
	return f.dot;
}, true);

// anomalies.dm:138
rt.def("/obj/effect/anomaly/flux/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	this.canshock = 1;
	for (M of each(range(0, this), T("/mob/living"))) {
		yield* this.mobShock(M);
	}
	return f.dot;
}, true);

// anomalies.dm:144
rt.def("/obj/effect/anomaly/flux/proc/Crossed", function* Crossed(f: Frame, M: Value) {
	yield* this.mobShock(M);
	return f.dot;
}, true);

// anomalies.dm:147
rt.def("/obj/effect/anomaly/flux/proc/Bump", function* Bump(f: Frame, M: Value) {
	yield* this.mobShock(M);
	return f.dot;
}, true);

// anomalies.dm:150
rt.def("/obj/effect/anomaly/flux/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	yield* this.mobShock(M);
	return f.dot;
}, true);

// anomalies.dm:153
rt.def("/obj/effect/anomaly/flux/proc/mobShock", function* mobShock(f: Frame, M: Value) {
	if (!(this.canshock && rt.istype(M, T("/mob/living")))) return f.dot;
	this.canshock = 0;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			yield* M.electrocute_act(this.shockdamage, `${this.name}`, { safety: 1 });
			return f.dot;
		}
		yield* M.electrocute_act(this.shockdamage, `${this.name}`);
		return f.dot;
	} else {
		yield* M.adjustFireLoss(this.shockdamage);
		M.visible_message(fmt("<span class='danger'>＀ was shocked by ％！!</span>", [M, this.name]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
	}
	return f.dot;
}, true);

// anomalies.dm:169
rt.def("/obj/effect/anomaly/flux/proc/detonate", function* detonate(f: Frame) {
	if (this.explosive) {
		yield* explosion(this, 1, 4, 16, 18);
	} else {
		yield* new_(T("/obj/effect/particle_effect/sparks"), this.loc);
	}
	return f.dot;
}, true);

rt.type(11787, "/obj/effect/anomaly/bluespace", "/obj/effect/anomaly", {
	name: "bluespace anomaly",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	density: 1,
});

// anomalies.dm:183
rt.def("/obj/effect/anomaly/bluespace/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.aSignal.origin_tech = "bluespace=7";
	return f.dot;
}, true);

// anomalies.dm:187
rt.def("/obj/effect/anomaly/bluespace/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let M: Value = null;
	yield* parent_proc();
	for (M of each(range(1, this), T("/mob/living"))) {
		yield* do_teleport(M, rt.locate(M.x, M.y, M.z), 4);
	}
	return f.dot;
}, true);

// anomalies.dm:192
rt.def("/obj/effect/anomaly/bluespace/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	if (!rt.istype(A, T("/mob/living"))) return f.dot;
	yield* do_teleport(A, rt.locate(A.x, A.y, A.z), 8);
	return f.dot;
}, true);

// anomalies.dm:196
rt.def("/obj/effect/anomaly/bluespace/proc/detonate", function* detonate(f: Frame) {
	let _T: Value = null, chosen: Value = null, W: Value = null, TO: Value = null, C: Value = null, A: Value = null, newloc: Value = null, M: Value = null, blueeffect: Value = null;
	if (!(_T = safepick(get_area_turfs(this.impact_area)))) return f.dot;
	let possible: Value = list();
	for (W of each(GLOB.teleportbeacons, T("/obj/item/device/radio/beacon"))) {
		possible += W;
	}
	if (rt.len(f, possible) > 0) {
		chosen = pick(possible);
	}
	if (!chosen) return f.dot;
	let FROM: Value = _T;
	playsound((TO = rt.getStep(f, chosen, 0)), rt.rsc("sound/effects/phasein.ogg"), 100, 1);
	yield* priority_announce("Massive bluespace translocation detected.", "Anomaly Alert");
	let flashers: Value = list();
	for (C of each(viewers(TO, null), T("/mob/living/carbon"))) {
		if (yield* C.flash_act()) {
			flashers += C;
		}
	}
	let y_distance: Value = TO.y - FROM.y;
	let x_distance: Value = TO.x - FROM.x;
	for (A of each(urange(12, FROM), T("/atom/movable"))) {
		if (rt.istype(A, T("/obj/item/device/radio/beacon"))) {
			continue;
		}
		if (A.anchored) {
			continue;
		}
		newloc = rt.locate(A.x + x_distance, A.y + y_distance, TO.z);
		if (!(yield* A.Move(newloc)) && newloc) {
			A.loc = newloc;
		}
		rt.spawnTail(f, 0, "/obj/effect/anomaly/bluespace/proc/detonate: spawn at game/objects/effects/anomalies.dm:231", _T, chosen, possible, W, FROM, TO, flashers, C, y_distance, x_distance, A, newloc, M, blueeffect);
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/effect/anomaly/bluespace/proc/detonate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/anomaly/bluespace/proc/detonate: spawn at game/objects/effects/anomalies.dm:231", function* (f: Frame, _T: Value, chosen: Value, possible: Value, W: Value, FROM: Value, TO: Value, flashers: Value, C: Value, y_distance: Value, x_distance: Value, A: Value, newloc: Value, M: Value, blueeffect: Value) {
	if (ismob(A) && !rt.isIn(f, A, flashers)) {
		if ((M = A).client) {
			(blueeffect = (yield* new_(T("/obj"), this))).screen_loc = "WEST,SOUTH to EAST,NORTH";
			blueeffect.icon = rt.rsc("icons/effects/effects.dmi");
			blueeffect.icon_state = "shieldsparkles";
			blueeffect.layer = 18;
			blueeffect.plane = 18;
			blueeffect.mouse_opacity = 0;
			M.client.screen += blueeffect;
			yield* sleep(20);
			M.client.screen -= blueeffect;
			yield* qdel(blueeffect);
		}
	}
	return null;
});

rt.type(11788, "/obj/effect/anomaly/pyro", "/obj/effect/anomaly", {
	ticks: 0,
	name: "pyroclastic anomaly",
	icon_state: "mustard",
});

// anomalies.dm:255
rt.def("/obj/effect/anomaly/pyro/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.aSignal.origin_tech = "plasmatech=7";
	return f.dot;
}, true);

// anomalies.dm:259
rt.def("/obj/effect/anomaly/pyro/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let _T: Value = null;
	yield* parent_proc();
	this.ticks++;
	if (this.ticks < 5) {
		return f.dot;
	} else {
		this.ticks = 0;
	}
	if (!rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open"))) return f.dot;
	_T.atmos_spawn_air("o2=5;plasma=5;TEMP=1000");
	return f.dot;
}, true);

// anomalies.dm:270
rt.def("/obj/effect/anomaly/pyro/proc/detonate", function detonate(f: Frame) {
	ImmediateInvokeAsync(this, P("/obj/effect/anomaly/pyro/proc/makepyroslime"));
	return f.dot;
});

// anomalies.dm:273
rt.def("/obj/effect/anomaly/pyro/proc/makepyroslime", function* makepyroslime(f: Frame) {
	let _T: Value = null, S: Value = null;
	if (rt.istype((_T = rt.getStep(f, this, 0)), T("/turf/open"))) {
		_T.atmos_spawn_air("o2=500;plasma=500;TEMP=1000");
	}
	let new_colour: Value = pick("red", "orange");
	(S = (yield* new_(T("/mob/living/simple_animal/slime"), _T, new_colour))).rabid = 1;
	S.amount_grown = SLIME_EVOLUTION_THRESHOLD;
	yield* S.Evolve();
	yield* offer_control(S);
	return f.dot;
}, true);

rt.type(11789, "/obj/effect/anomaly/bhole", "/obj/effect/anomaly", {
	name: "vortex anomaly",
	icon_state: "bhole3",
	desc: "That's a nice station you have there. It'd be a shame if something happened to it.",
});

// anomalies.dm:291
rt.def("/obj/effect/anomaly/bhole/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.aSignal.origin_tech = "engineering=7";
	return f.dot;
}, true);

// anomalies.dm:295
rt.def("/obj/effect/anomaly/bhole/proc/anomalyEffect", function* anomalyEffect(f: Frame) {
	let O: Value = null, target: Value = null;
	yield* parent_proc();
	if (!isturf(this.loc)) {
		yield* qdel(this);
		return f.dot;
	}
	yield* this.grav(rand(0, 3), rand(2, 3), 50, 25);
	for (O of each(range(2, this), T("/obj"))) {
		if (O == this) {
			return f.dot;
		}
		if (!O.anchored) {
			if ((target = rt.locateIn(f, T("/mob/living"), view(4, this))) && !target.stat) {
				yield* O.throw_at(target, 7, 5);
			}
		} else {
			yield* O.ex_act(2);
		}
	}
	return f.dot;
}, true);

// anomalies.dm:314
rt.def("/obj/effect/anomaly/bhole/proc/grav", function* grav(f: Frame, r: Value, ex_act_force: Value, pull_chance: Value, turf_removal_chance: Value) {
	let t: Value = -r;
	while (t < r) {
		yield* this.affect_coord(this.x + t, this.y - r, ex_act_force, pull_chance, turf_removal_chance);
		yield* this.affect_coord(this.x - t, this.y + r, ex_act_force, pull_chance, turf_removal_chance);
		yield* this.affect_coord(this.x + r, this.y + t, ex_act_force, pull_chance, turf_removal_chance);
		yield* this.affect_coord(this.x - r, this.y - t, ex_act_force, pull_chance, turf_removal_chance);
		t++;
	}
	return f.dot;
}, true);

// anomalies.dm:322
rt.def("/obj/effect/anomaly/bhole/proc/affect_coord", function* affect_coord(f: Frame, x: Value, y: Value, ex_act_force: Value, pull_chance: Value, turf_removal_chance: Value) {
	let _T: Value = null, O: Value = null, M: Value = null;
	if ((_T = rt.locate(x, y, this.z)) === null) {
		return f.dot;
	}
	if (prob(pull_chance)) {
		for (O of each(_T.contents, T("/obj"))) {
			if (O.anchored) {
				yield* O.ex_act(ex_act_force);
			} else {
				yield* step_towards(O, this);
			}
		}
		for (M of each(_T.contents, T("/mob/living"))) {
			yield* step_towards(M, this);
		}
	}
	if (!(_T && prob(turf_removal_chance))) return f.dot;
	yield* _T.ex_act(ex_act_force);
	return f.dot;
}, true);
