// Based on /tg/station's code/modules/power/singularity/singularity.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, truthy, add, subtract } = rt;


rt.type(13034, "/obj/singularity", "/obj", {
	current_size: 1,
	allowed_size: 1,
	contained: 1,
	energy: 100,
	dissipate: 1,
	dissipate_delay: 10,
	dissipate_track: 0,
	dissipate_strength: 1,
	move_self: 1,
	grav_pull: 4,
	consume_range: 0,
	event_chance: 15,
	target: null,
	last_failed_movement: 0,
	last_warning: null,
	consumedSupermatter: 0,
	anchored: 1,
	name: "gravitational singularity",
	desc: "A gravitational singularity.",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "singularity_s1",
	density: 1,
	layer: 11,
	luminosity: 6,
	appearance_flags: 0,
	resistance_flags: 115,
	dangerous_possession: 1,
});

// singularity.dm:34
rt.def("/obj/singularity/proc/Initialize", function Initialize(f: Frame) {
	let singubeacon: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 50;
	}
	this.admin_investigate_setup();
	this.energy = f.args[1];
	f.dot = parent_proc();
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	(rt.modGl("poi_list", this, rt.bitOr));
	(rt.modGl("singularities", this, rt.bitOr));
	for (singubeacon of each(GLOB.machines, T("/obj/machinery/power/singularity_beacon"))) {
		if (singubeacon.active) {
			this.target = singubeacon;
			break;
		}
	}
	return f.dot;
}, false, { args: ["mapload", "starting_energy"] });

// singularity.dm:48
rt.def("/obj/singularity/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* GLOB.poi_list.Remove(this);
	yield* GLOB.singularities.Remove(this);
	return (yield* parent_proc());
}, true);

// singularity.dm:54
rt.def("/obj/singularity/proc/Move", function* Move(f: Frame, newloc: Value, direct: Value) {
	if (this.current_size >= STAGE_FIVE || this.check_turfs_in(direct)) {
		this.last_failed_movement = 0;
		return (yield* parent_proc());
	}
	this.last_failed_movement = direct;
	return 0;
}, true);

// singularity.dm:63
rt.def("/obj/singularity/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.consume(user);
	return 1;
}, true);

// singularity.dm:67
rt.def("/obj/singularity/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.consume(user);
	return f.dot;
}, true);

// singularity.dm:70
rt.def("/obj/singularity/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.consume(user);
	return f.dot;
}, true);

// singularity.dm:73
rt.def("/obj/singularity/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	yield* this.consume(user);
	return f.dot;
}, true);

// singularity.dm:76
rt.def("/obj/singularity/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.consume(user);
	return 1;
}, true);

// singularity.dm:86
rt.def("/obj/singularity/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		if (this.current_size <= STAGE_TWO) {
			this.investigate_log("has been destroyed by a heavy explosion.", "singulo");
			yield* qdel(this);
			return f.dot;
		} else {
			this.energy -= round((this.energy + 1) / 2, 1);
		}
	} else if (severity === 2) {
		this.energy -= round((this.energy + 1) / 3, 1);
	} else if (severity === 3) {
		this.energy -= round((this.energy + 1) / 4, 1);
	}
	return f.dot;
}, true, { waitfor: false });

// singularity.dm:106
rt.def("/obj/singularity/proc/Bump", function* Bump(f: Frame, A: Value) {
	yield* this.consume(A);
	return f.dot;
}, true);

// singularity.dm:111
rt.def("/obj/singularity/proc/Bumped", function* Bumped(f: Frame, A: Value) {
	yield* this.consume(A);
	return f.dot;
}, true);

// singularity.dm:116
rt.def("/obj/singularity/proc/process", function* process(f: Frame) {
	if (this.current_size >= STAGE_TWO) {
		yield* this.move();
		yield* this.pulse();
		if (prob(this.event_chance)) {
			yield* this.event();
		}
	}
	yield* this.eat();
	yield* this.dissipate();
	yield* this.check_energy();
	return f.dot;
}, true, { waitfor: false });

// singularity.dm:134
rt.def("/obj/singularity/proc/admin_investigate_setup", function admin_investigate_setup(f: Frame) {
	let count: Value = null;
	let $0: any;
	this.last_warning = rt.worldTime(f);
	if (!(count = rt.locateIn(f, T("/obj/machinery/field/containment"), urange(30, this, 1)))) {
		message_admins(`A singulo has been created without containment fields active (${this.x},${this.y},${this.z})`, 1);
	}
	if (count) {
		$0 = "";
	} else {
		$0 = "<font color='red'>No containment fields were active</font>";
	}
	this.investigate_log(`was created. ${$0}`, "singulo");
	return f.dot;
});

// singularity.dm:140
rt.def("/obj/singularity/proc/dissipate", function dissipate(f: Frame) {
	if (!this.dissipate) {
		return f.dot;
	}
	if (this.dissipate_track >= this.dissipate_delay) {
		(rt.modField(f, this, "energy", this.dissipate_strength, subtract));
		this.dissipate_track = 0;
	} else {
		this.dissipate_track++;
	}
	return f.dot;
});

// singularity.dm:152
rt.def("/obj/singularity/proc/expand", function expand(f: Frame, force_size: Value) {
	force_size ??= 0;
	let temp_allowed_size: Value = this.allowed_size;
	if (force_size) {
		temp_allowed_size = force_size;
	}
	if (temp_allowed_size >= 11 && !this.consumedSupermatter) {
		temp_allowed_size = 9;
	}
	if (temp_allowed_size === 1) {
		this.current_size = 1;
		this.icon = rt.rsc("icons/obj/singularity.dmi");
		this.icon_state = "singularity_s1";
		this.pixel_x = 0;
		this.pixel_y = 0;
		this.grav_pull = 4;
		this.consume_range = 0;
		this.dissipate_delay = 10;
		this.dissipate_track = 0;
		this.dissipate_strength = 1;
	} else if (temp_allowed_size === 3) {
		if (this.check_turfs_in(1, 1) && this.check_turfs_in(2, 1) && this.check_turfs_in(4, 1) && this.check_turfs_in(8, 1)) {
			this.current_size = 3;
			this.icon = rt.rsc("icons/effects/96x96.dmi");
			this.icon_state = "singularity_s3";
			this.pixel_x = -32;
			this.pixel_y = -32;
			this.grav_pull = 6;
			this.consume_range = 1;
			this.dissipate_delay = 5;
			this.dissipate_track = 0;
			this.dissipate_strength = 5;
		}
	} else if (temp_allowed_size === 5) {
		if (this.check_turfs_in(1, 2) && this.check_turfs_in(2, 2) && this.check_turfs_in(4, 2) && this.check_turfs_in(8, 2)) {
			this.current_size = 5;
			this.icon = rt.rsc("icons/effects/160x160.dmi");
			this.icon_state = "singularity_s5";
			this.pixel_x = -64;
			this.pixel_y = -64;
			this.grav_pull = 8;
			this.consume_range = 2;
			this.dissipate_delay = 4;
			this.dissipate_track = 0;
			this.dissipate_strength = 20;
		}
	} else if (temp_allowed_size === 7) {
		if (this.check_turfs_in(1, 3) && this.check_turfs_in(2, 3) && this.check_turfs_in(4, 3) && this.check_turfs_in(8, 3)) {
			this.current_size = 7;
			this.icon = rt.rsc("icons/effects/224x224.dmi");
			this.icon_state = "singularity_s7";
			this.pixel_x = -96;
			this.pixel_y = -96;
			this.grav_pull = 10;
			this.consume_range = 3;
			this.dissipate_delay = 10;
			this.dissipate_track = 0;
			this.dissipate_strength = 10;
		}
	} else if (temp_allowed_size === 9) {
		this.current_size = 9;
		this.icon = rt.rsc("icons/effects/288x288.dmi");
		this.icon_state = "singularity_s9";
		this.pixel_x = -128;
		this.pixel_y = -128;
		this.grav_pull = 10;
		this.consume_range = 4;
		this.dissipate = 0;
	} else if (temp_allowed_size === 11) {
		this.current_size = 11;
		this.icon = rt.rsc("icons/effects/352x352.dmi");
		this.icon_state = "singularity_s11";
		this.pixel_x = -160;
		this.pixel_y = -160;
		this.grav_pull = 15;
		this.consume_range = 5;
		this.dissipate = 0;
	}
	if (this.current_size == this.allowed_size) {
		this.investigate_log(`<font color='red'>grew to size ${this.current_size}</font>`, "singulo");
		return 1;
	} else if (this.current_size < --temp_allowed_size) {
		this.expand(temp_allowed_size);
	} else {
		return 0;
	}
	return f.dot;
});

// singularity.dm:231
rt.def("/obj/singularity/proc/check_energy", function* check_energy(f: Frame) {
	if (this.energy <= 0) {
		this.investigate_log("collapsed.", "singulo");
		yield* qdel(this);
		return 0;
	}
	if (rt.inRange(this.energy, 1, 199)) {
		this.allowed_size = STAGE_ONE;
	} else if (rt.inRange(this.energy, 200, 499)) {
		this.allowed_size = STAGE_TWO;
	} else if (rt.inRange(this.energy, 500, 999)) {
		this.allowed_size = STAGE_THREE;
	} else if (rt.inRange(this.energy, 1000, 1999)) {
		this.allowed_size = STAGE_FOUR;
	} else if (rt.inRange(this.energy, 2000, 1e+31)) {
		if (this.energy >= 3000 && this.consumedSupermatter) {
			this.allowed_size = STAGE_SIX;
		} else {
			this.allowed_size = STAGE_FIVE;
		}
	}
	if (this.current_size != this.allowed_size) {
		yield* this.expand();
	}
	return 1;
}, true);

// singularity.dm:256
rt.def("/obj/singularity/proc/eat", function* eat(f: Frame) {
	let tile: Value = null, _T: Value = null, thing: Value = null, X: Value = null;
	let $e: any;
	// stress2c: TG_STRESS_COUNTS=1 counts what each pass pulls and consumes and notes the energy and size (printed at exit)
	const counting = truthy(rt.call(f, P("/proc/stress_counts_on"), null, []));
	const who = rt.istype(this, T("/obj/singularity/narsie")) ? "narsie" : "sing";
	if (counting) {
		rt.call(f, P("/proc/stress_count"), null, [who + "_passes", 1]);
		rt.call(f, P("/proc/stress_set"), null, [who + "_energy", this.energy]);
		rt.call(f, P("/proc/stress_set"), null, [who + "_size", this.current_size]);
	}
	// stress2c: pipes ripped out in this pass rebuild their neighbours' pipelines once at the end of the pass (flush_pipe_rebuilds),
	// not after each pipe. The pass can sleep (stoplag below) with rebuilds still waiting: everything that needs a pipe's pipeline
	// flushes first (SSair.fire, an atmos machine's Destroy and update_parents, a pipe's return_air/returnPipenets), so the wait is at
	// most until the air subsystem next fires. TG_PIPE_BATCH=0 turns it off.
	if (GLOB.pipe_rebuild_defer === null && rt.call(f, P("/proc/pipe_batch_on"), null, [])) GLOB.pipe_rebuild_defer = list();
	for (tile of each((yield* spiral_range_turfs(this.grav_pull, this)))) {
		if (!(_T = tile) || !isturf(this.loc)) {
			continue;
		}
		if (get_dist(_T, this) > this.consume_range) {
			if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_pulled", 1]);
			yield* _T.singularity_pull(this, this.current_size);
		} else {
			if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_consumed", 1]);
			yield* this.consume(_T);
		}
		thing = null;
		for (thing of each(_T)) {
			if (isturf(this.loc) && thing != this) {
				if (get_dist((X = thing), this) > this.consume_range) {
					if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_pulled", 1]);
					yield* X.singularity_pull(this, this.current_size);
				} else {
					if (counting) rt.call(f, P("/proc/stress_count"), null, [who + "_consumed", 1]);
					yield* this.consume(X);
				}
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
				if (GLOB.pipe_rebuild_defer === null && rt.call(f, P("/proc/pipe_batch_on"), null, [])) GLOB.pipe_rebuild_defer = list();
			}
		}
	}
	rt.call(f, P("/proc/flush_pipe_rebuilds"), null, []);
	GLOB.pipe_rebuild_defer = null;
	return f.dot;
}, true);

// singularity.dm:276
rt.def("/obj/singularity/proc/consume", function* consume(f: Frame, A: Value) {
	let gain: Value = (yield* A.singularity_act(this.current_size, this));
	rt.modField(f, this, "energy", gain, add);
	if (rt.istype(A, T("/obj/machinery/power/supermatter_shard")) && !this.consumedSupermatter) {
		this.desc = `${rt.initial(f, this, "desc")} It glows fiercely with inner fire.`;
		this.name = `supermatter-charged ${rt.initial(f, this, "name")}`;
		this.consumedSupermatter = 1;
		this.luminosity = 10;
	}
	return f.dot;
}, true);

// singularity.dm:287
rt.def("/obj/singularity/proc/move", function* move(f: Frame, force_move: Value) {
	force_move ??= 0;
	if (!this.move_self) {
		return 0;
	}
	let movement_dir: Value = pick(GLOB.alldirs - this.last_failed_movement);
	if (force_move) {
		movement_dir = force_move;
	}
	if (this.target && prob(60)) {
		movement_dir = rt.getDir(f, this, this.target);
	}
	yield* step(this, movement_dir);
	return f.dot;
}, true);

// singularity.dm:302
rt.def("/obj/singularity/proc/check_turfs_in", function check_turfs_in(f: Frame, direction: Value, step: Value) {
	let i: Value = null, j: Value = null, k: Value = null, T3: Value = null;
	let $e: any;
	direction ??= 0;
	step ??= 0;
	if (!direction) {
		return 0;
	}
	let steps: Value = 0;
	if (!step) {
		if (this.current_size === STAGE_ONE) {
			steps = 1;
		} else if (this.current_size === STAGE_TWO) {
			steps = 3;
		} else if (this.current_size === STAGE_THREE) {
			steps = 3;
		} else if (this.current_size === STAGE_FOUR) {
			steps = 4;
		} else if (this.current_size === STAGE_FIVE) {
			steps = 5;
		}
	} else {
		steps = step;
	}
	let turfs: Value = list();
	let _T: Value = this.loc;
	rt.forRange(f, 0, 1, steps, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		_T = rt.getStep(f, _T, direction);
	}
	rt.endFor(f, 0);
	if (!isturf(_T)) {
		return 0;
	}
	turfs.Add(_T);
	let dir2: Value = 0;
	let dir3: Value = 0;
	if (direction === 1) {
		dir2 = 4;
		dir3 = 8;
	} else if (direction === 4) {
		dir2 = 1;
		dir3 = 2;
	}
	let T2: Value = _T;
	rt.forRange(f, 0, 1, steps - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		j = $e;
		if (!isturf((T2 = rt.getStep(f, T2, dir2)))) {
			return 0;
		}
		turfs.Add(T2);
	}
	rt.endFor(f, 0);
	rt.forRange(f, 0, 1, steps - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		k = $e;
		if (!isturf((_T = rt.getStep(f, _T, dir3)))) {
			return 0;
		}
		turfs.Add(_T);
	}
	rt.endFor(f, 0);
	for (T3 of each(turfs, T("/turf"))) {
		if (T3 === null) {
			continue;
		}
		if (!this.can_move(T3)) {
			return 0;
		}
	}
	return 1;
});

// singularity.dm:355
rt.def("/obj/singularity/proc/can_move", function can_move(f: Frame, _T: Value) {
	let G: Value = null, S: Value = null;
	if (!_T) {
		return 0;
	}
	if (rt.locateIn(f, T("/obj/machinery/field/containment"), _T) || rt.locateIn(f, T("/obj/machinery/shieldwall"), _T)) {
		return 0;
	} else if (rt.locateIn(f, T("/obj/machinery/field/generator"), _T)) {
		if ((G = rt.locateIn(f, T("/obj/machinery/field/generator"), _T)) && G.active) {
			return 0;
		}
	} else if (rt.locateIn(f, T("/obj/machinery/shieldwallgen"), _T)) {
		if ((S = rt.locateIn(f, T("/obj/machinery/shieldwallgen"), _T)) && S.active) {
			return 0;
		}
	}
	return 1;
});

// singularity.dm:371
rt.def("/obj/singularity/proc/event", function* event(f: Frame) {
	let numb: Value = null;
	const subject = (numb = pick(1, 2, 3, 4, 5, 6));
	if (subject === 1) {
		yield* this.emp_area();
	} else if (subject === 2 || subject === 3) {
		yield* this.toxmob();
	} else if (subject === 4) {
		yield* this.mezzer();
	} else if (subject === 5 || subject === 6) {
		if (this.current_size < STAGE_SIX) {
			return 0;
		}
		yield* this.combust_mobs();
	} else {
		return 0;
	}
	return 1;
}, true);

// singularity.dm:392
rt.def("/obj/singularity/proc/toxmob", function* toxmob(f: Frame) {
	let M: Value = null;
	let toxrange: Value = 10;
	let radiation: Value = 15;
	let radiationmin: Value = 3;
	if (this.energy > 200) {
		radiationmin = round((radiation += round((this.energy - 150) / 10, 1)) / 5, 1);
	}
	for (M of each(view(toxrange, this.loc), T("/mob/living"))) {
		yield* M.rad_act(rand(radiationmin, radiation));
	}
	return f.dot;
}, true);

// singularity.dm:400
rt.def("/obj/singularity/proc/combust_mobs", function* combust_mobs(f: Frame) {
	let C: Value = null;
	for (C of each(urange(20, this, 1), T("/mob/living/carbon"))) {
		C.visible_message(`<span class='warning'>${C}'s skin bursts into flame!</span>`, "<span class='userdanger'>You feel an inner fire as your skin bursts into flames!</span>");
		yield* C.adjust_fire_stacks(5);
		yield* C.IgniteMob();
	}
	return f.dot;
}, true);

// singularity.dm:409
rt.def("/obj/singularity/proc/mezzer", function* mezzer(f: Frame) {
	let M: Value = null, H: Value = null, MS: Value = null;
	for (M of each(oviewers(8, this), T("/mob/living/carbon"))) {
		if (rt.istype(M, T("/mob/living/brain"))) {
			continue;
		}
		if (M.stat == 0) {
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if (rt.istype((H = M).glasses, T("/obj/item/clothing/glasses/meson"))) {
					if ((MS = H.glasses).vision_flags == 16) {
						to_chat(H, `<span class='notice'>You look directly into the ${this.name}, good thing you had your protective eyewear on!</span>`);
						return f.dot;
					}
				}
			}
		}
		yield* M.apply_effect(60, "stun");
		M.visible_message(`<span class='danger'>${M} stares blankly at the ${this.name}!</span>`, `<span class='userdanger'>You look directly into the ${this.name} and feel weak.</span>`);
	}
	return f.dot;
}, true);

// singularity.dm:429
rt.def("/obj/singularity/proc/emp_area", function* emp_area(f: Frame) {
	yield* empulse(this, 8, 10);
	return f.dot;
}, true);

// singularity.dm:434
rt.def("/obj/singularity/proc/pulse", function pulse(f: Frame) {
	let R: Value = null;
	for (R of each(GLOB.rad_collectors, T("/obj/machinery/power/rad_collector"))) {
		if (R.z == this.z && get_dist(R, this) <= 15) {
			R.receive_pulse(this.energy);
		}
	}
	return f.dot;
});

// singularity.dm:439
rt.def("/obj/singularity/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = this.energy / 2;
	let dist: Value = max(this.current_size - 2, 1);
	yield* explosion(this.loc, dist, dist * 2, dist * 4);
	yield* qdel(this);
	return gain;
}, true);
