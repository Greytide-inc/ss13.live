// Based on /tg/station's code/modules/power/singularity/narsie.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(13039, "/obj/singularity/narsie/large", "/obj/singularity/narsie", {
	name: "Nar-Sie",
	icon: rt.rsc("icons/obj/narsie.dmi"),
	pixel_x: -236,
	pixel_y: -256,
	current_size: 12,
	grav_pull: 10,
	consume_range: 12,
});

// narsie.dm:31
rt.def("/obj/singularity/narsie/large/proc/Initialize", function* Initialize(f: Frame) {
	let A: Value = null, alert_overlay: Value = null;
	f.dot = (yield* parent_proc());
	send_to_playing_players("<span class='narsie'>NAR-SIE HAS RISEN</span>");
	sound_to_playing_players("im_here");
	if (A = get_area(this)) {
		alert_overlay = mutable_appearance(rt.rsc("icons/effects/cult_effects.dmi"), "ghostalertsie");
		yield* notify_ghosts(fmt("Nar-Sie has risen in ％！. Reach out to the Geometer to be given a new shell for your soul.", [A.name]), { source: this, alert_overlay: alert_overlay, action: "attack" });
	}
	yield* ImmediateInvokeAsync(this, P("/obj/singularity/narsie/proc/narsie_spawn_animation"));
	return f.dot;
}, true);

rt.type(13040, "/obj/singularity/narsie/large/cult", "/obj/singularity/narsie/large", {
	souls_needed: null,
	soul_goal: 0,
	souls: 0,
	resolved: 0,
});

// narsie.dm:42
rt.def("/obj/singularity/narsie/large/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.souls_needed = list();
	return f.dot;
});

// narsie.dm:48
rt.def("/obj/singularity/narsie/large/cult/proc/resize", function resize(f: Frame, ratio: Value) {
	let ntransform: Value = null;
	(ntransform = matrix(this.transform)).Scale(ratio);
	rt.op(f, "Animate", [2, 8], [null, this, "transform", ntransform, "time", 40, "easing", 192]);
	return f.dot;
});

// narsie.dm:53
rt.def("/obj/singularity/narsie/large/cult/proc/Initialize", function* Initialize(f: Frame) {
	let cult_mind: Value = null, L: Value = null, player: Value = null;
	f.dot = (yield* parent_proc());
	GLOB.cult_narsie = this;
	yield* deltimer(GLOB.blood_target_reset_timer);
	GLOB.blood_target = this;
	this.resize(0.6);
	for (cult_mind of each(GLOB.SSticker.mode.cult, T("/datum/mind"))) {
		if (rt.istype(cult_mind.current, T("/mob/living"))) {
			yield* (L = cult_mind.current).narsie_act();
		}
	}
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (player.stat != 2 && player.loc.z == 2 && !iscultist(player)) {
			rt.setAt(this.souls_needed, player, 1);
		}
	}
	this.soul_goal = round(1 + rt.length(this.souls_needed) * 0.6);
	yield* ImmediateInvokeAsync(this, P("/obj/singularity/narsie/large/cult/proc/begin_the_end"));
	return f.dot;
}, true);

// narsie.dm:69
rt.def("/obj/singularity/narsie/large/cult/proc/begin_the_end", function* begin_the_end(f: Frame) {
	yield* sleep(50);
	yield* priority_announce("An acausal dimensional event has been detected in your sector. Event has been flagged EXTINCTION-CLASS. Directing all available assets toward simulating solutions. SOLUTION ETA: 60 SECONDS.", "Central Command Higher Dimensional Affairs", rt.rsc("sound/misc/airraid.ogg"));
	yield* sleep(550);
	yield* priority_announce("Simulations on acausal dimensional event complete. Deploying solution package now. Deployment ETA: TWO MINUTES. ", "Central Command Higher Dimensional Affairs");
	yield* sleep(50);
	set_security_level("delta");
	yield* GLOB.SSshuttle.registerHostileEnvironment(this);
	GLOB.SSshuttle.lockdown = 1;
	yield* sleep(1150);
	if (this.resolved != 0) return f.dot;
	this.resolved = 1;
	rt.op(f, "OutputReference", [rt.R.world], [sound(rt.rsc("sound/machines/alarm.ogg"))], false);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/cult_ending_helper"))), 120);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/ending_helper"))), 220);
	return f.dot;
}, true);

// narsie.dm:86
rt.def("/obj/singularity/narsie/large/cult/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.cult_narsie = null;
	return (yield* parent_proc());
}, true);

// narsie.dm:89
rt.def("/proc/ending_helper", function ending_helper(f: Frame) {
	GLOB.SSticker.force_ending = 1;
	return f.dot;
});

// narsie.dm:92
rt.def("/proc/cult_ending_helper", function* cult_ending_helper(f: Frame, no_explosion: Value) {
	no_explosion ??= 0;
	yield* GLOB.SSticker.station_explosion_cinematic(no_explosion, "cult", null);
	return f.dot;
}, true);

// narsie.dm:96
rt.def("/obj/singularity/narsie/large/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	yield* makeNewConstruct(T("/mob/living/simple_animal/hostile/construct/harvester"), user, { cultoverride: 1, loc_override: this.loc });
	return f.dot;
}, true);

rt.type(13037, "/obj/singularity/narsie", "/obj/singularity", {
	clashing: 0,
	light_power: 0.7,
	light_range: 15,
	light_color: "#ff0000",
	name: "Nar-sie's Avatar",
	desc: "Your mind begins to bubble and ooze as it tries to comprehend what it sees.",
	icon: rt.rsc("icons/obj/magic_terror.dmi"),
	pixel_x: -89,
	pixel_y: -85,
	density: 0,
	current_size: 9,
	contained: 0,
	dissipate: 0,
	move_self: 1,
	grav_pull: 5,
	consume_range: 6,
	gender: "female",
});

// narsie.dm:102
rt.def("/obj/singularity/narsie/proc/process", function* process(f: Frame) {
	if (this.clashing) {
		return f.dot;
	}
	yield* this.eat();
	if (!this.target || prob(5)) {
		this.pickcultist();
	}
	if (rt.istype(this.target, T("/obj/structure/destructible/clockwork/massive/ratvar"))) {
		yield* this.move(rt.getDir(f, this, this.target));
	} else {
		yield* this.move();
	}
	if (!prob(25)) return f.dot;
	yield* this.mezzer();
	return f.dot;
}, true, { waitfor: false });

// narsie.dm:118
rt.def("/obj/singularity/narsie/proc/Bump", function* Bump(f: Frame, A: Value) {
	let _T: Value = null;
	if ((_T = rt.getStep(f, A, 0)) == this.loc) {
		_T = rt.getStep(f, A, A.dir);
	}
	yield* this.forceMove(_T);
	return f.dot;
}, true);

// narsie.dm:125
rt.def("/obj/singularity/narsie/proc/mezzer", function* mezzer(f: Frame) {
	let M: Value = null;
	for (M of each(viewers(this.consume_range, this), T("/mob/living/carbon"))) {
		if (M.stat == 0) {
			if (!iscultist(M)) {
				to_chat(M, `<span class='cultsmall'>You feel conscious thought crumble away in an instant as you gaze upon ${this.name}...</span>`);
				yield* M.apply_effect(60, "stun");
			}
		}
	}
	return f.dot;
}, true);

// narsie.dm:133
rt.def("/obj/singularity/narsie/proc/consume", function* consume(f: Frame, A: Value) {
	if (!isturf(A)) return f.dot;
	yield* A.narsie_act();
	return f.dot;
}, true);

// narsie.dm:142
rt.def("/obj/singularity/narsie/proc/pickcultist", function pickcultist(f: Frame) {
	let enemy: Value = null, food: Value = null, pos: Value = null, ghost: Value = null;
	let cultists: Value = list();
	let noncultists: Value = list();
	for (enemy of each(GLOB.poi_list, T("/obj/structure/destructible/clockwork/massive/ratvar"))) {
		if (enemy.z != this.z) {
			continue;
		}
		this.acquire(enemy);
		return f.dot;
	}
	for (food of each(GLOB.living_mob_list, T("/mob/living/carbon"))) {
		if ((pos = rt.getStep(f, food, 0)).z != this.z) {
			continue;
		}
		if (iscultist(food)) {
			cultists += food;
		} else {
			noncultists += food;
		}
		if (rt.len(f, cultists)) {
			this.acquire(pick(cultists));
			return f.dot;
		}
		if (rt.len(f, noncultists)) {
			this.acquire(pick(noncultists));
			return f.dot;
		}
	}
	for (ghost of each(GLOB.player_list, T("/mob/dead/observer"))) {
		if (!ghost.client) {
			continue;
		}
		if ((pos = rt.getStep(f, ghost, 0)).z != this.z) {
			continue;
		}
		cultists += ghost;
	}
	if (!rt.len(f, cultists)) return f.dot;
	this.acquire(pick(cultists));
	return f.dot;
});

// narsie.dm:182
rt.def("/obj/singularity/narsie/proc/acquire", function acquire(f: Frame, food: Value) {
	if (food == this.target) {
		return f.dot;
	}
	to_chat(this.target, "<span class='cultsmall'>NAR-SIE HAS LOST INTEREST IN YOU.</span>");
	this.target = food;
	if (rt.istype(this.target, T("/mob/living/carbon/human"))) {
		to_chat(this.target, "<span class ='cult'>NAR-SIE HUNGERS FOR YOUR SOUL.</span>");
	} else {
		to_chat(this.target, "<span class ='cult'>NAR-SIE HAS CHOSEN YOU TO LEAD HER TO HER NEXT MEAL.</span>");
	}
	return f.dot;
});

rt.type(13041, "/obj/singularity/narsie/wizard", "/obj/singularity/narsie", {
	grav_pull: 0,
});

// narsie.dm:199
rt.def("/obj/singularity/narsie/wizard/proc/eat", function* eat(f: Frame) {
	let X: Value = null;
	for (X of each(urange(this.consume_range, this, 1), T("/atom"))) {
		if (isturf(X) || rt.istype(X, T("/atom/movable"))) {
			yield* this.consume(X);
		}
	}
	return f.dot;
}, true);

// narsie.dm:208
rt.def("/obj/singularity/narsie/proc/narsie_spawn_animation", function* narsie_spawn_animation(f: Frame) {
	this.icon = rt.rsc("icons/obj/narsie_spawn_anim.dmi");
	yield* this.setDir(2);
	this.move_self = 0;
	flick("narsie_spawn_anim", this);
	yield* sleep(11);
	this.move_self = 1;
	this.icon = rt.initial(f, this, "icon");
	return f.dot;
}, true);
