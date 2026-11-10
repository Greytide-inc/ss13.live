// Based on /tg/station's code/game/objects/effects/effect_system/effects_other.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1516, "/datum/effect_system/trail_follow", "/datum/effect_system", {
	oldposition: null,
	processing: 1,
	on: 1,
});

// effects_other.dm:15
rt.def("/datum/effect_system/trail_follow/proc/set_up", function set_up(f: Frame, atom: Value) {
	this.attach(atom);
	this.oldposition = rt.getStep(f, atom, 0);
	return f.dot;
});

// effects_other.dm:20
rt.def("/datum/effect_system/trail_follow/proc/Destroy", function* Destroy(f: Frame) {
	this.oldposition = null;
	return (yield* parent_proc());
}, true);

// effects_other.dm:25
rt.def("/datum/effect_system/trail_follow/proc/stop", function stop(f: Frame) {
	this.processing = 0;
	this.on = 0;
	this.oldposition = null;
	return f.dot;
});

rt.type(1517, "/datum/effect_system/trail_follow/steam", "/datum/effect_system/trail_follow", {
	effect_type: rt.typePath("/obj/effect/particle_effect/steam"),
});

// effects_other.dm:31
rt.def("/datum/effect_system/trail_follow/steam/proc/start", function* start(f: Frame) {
	let I: Value = null;
	if (!this.on) {
		this.on = 1;
		this.processing = 1;
		if (!this.oldposition) {
			this.oldposition = rt.getStep(f, this.holder, 0);
		}
	}
	if (!this.processing) return f.dot;
	this.processing = 0;
	if (this.number < 3) {
		I = (yield* new_(T("/obj/effect/particle_effect/steam"), this.oldposition));
		this.number++;
		yield* I.setDir(this.holder.dir);
		this.oldposition = rt.getStep(f, this.holder, 0);
		rt.spawnTail(f, 10, "/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:43", I);
	}
	rt.spawnTail(f, 2, "/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:46", I);
	return f.dot;
}, true);

// a spawn(2) body of /datum/effect_system/trail_follow/steam/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:46", function* (f: Frame, I: Value) {
	if (this.on) {
		this.processing = 1;
		yield* this.start();
	}
	return null;
});

// a spawn(10) body of /datum/effect_system/trail_follow/steam/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/steam/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:43", function* (f: Frame, I: Value) {
	yield* qdel(I);
	this.number--;
	return null;
});

rt.type(1518, "/datum/effect_system/trail_follow/ion", "/datum/effect_system/trail_follow", {
	fadetype: "ion_fade",
	fade: 1,
	nograv_required: 1,
	effect_type: rt.typePath("/obj/effect/particle_effect/ion_trails"),
});

// effects_other.dm:66
rt.def("/datum/effect_system/trail_follow/ion/proc/start", function* start(f: Frame) {
	let _T: Value = null, I: Value = null;
	if (!this.on) {
		this.on = 1;
		this.processing = 1;
		if (!this.oldposition) {
			this.oldposition = rt.getStep(f, this.holder, 0);
		}
	}
	if (!this.processing) return f.dot;
	this.processing = 0;
	if ((_T = rt.getStep(f, this.holder, 0)) != this.oldposition) {
		if (!_T.has_gravity() || !this.nograv_required) {
			this.set_dir((I = (yield* new_(this.effect_type, this.oldposition))));
			if (this.fade) {
				flick(this.fadetype, I);
				I.icon_state = "";
			}
			rt.spawnTail(f, 20, "/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:81", _T, I);
		}
		this.oldposition = _T;
	}
	rt.spawnTail(f, 2, "/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:84", _T, I);
	return f.dot;
}, true);

// a spawn(2) body of /datum/effect_system/trail_follow/ion/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:84", function* (f: Frame, _T: Value, I: Value) {
	if (this.on) {
		this.processing = 1;
		yield* this.start();
	}
	return null;
});

// a spawn(20) body of /datum/effect_system/trail_follow/ion/proc/start, a named tail so a world snapshot can hold it while it waits.
rt.tail("/datum/effect_system/trail_follow/ion/proc/start: spawn at game/objects/effects/effect_system/effects_other.dm:81", function* (f: Frame, _T: Value, I: Value) {
	yield* qdel(I);
	return null;
});

// effects_other.dm:90
rt.def("/datum/effect_system/trail_follow/ion/proc/set_dir", function set_dir(f: Frame, I: Value) {
	I.setDir(this.holder.dir);
	return f.dot;
});

rt.type(1519, "/datum/effect_system/trail_follow/ion/flight", "/datum/effect_system/trail_follow/ion", {
	fadetype: "ion_fade_flight",
	nograv_required: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/ion_trails/flight"),
});

// effects_other.dm:98
rt.def("/datum/effect_system/trail_follow/ion/flight/proc/set_dir", function set_dir(f: Frame, I: Value) {
	if (!rt.istype(this.holder, T("/obj/item/device/flightpack"))) return f.dot;
	let F: Value = this.holder;
	I.setDir(F.suit.user.dir);
	return f.dot;
});

rt.type(1520, "/datum/effect_system/reagents_explosion", "/datum/effect_system", {
	amount: null,
	flashing: 0,
	flashing_factor: 0,
	explosion_message: 1,
});

// effects_other.dm:112
rt.def("/datum/effect_system/reagents_explosion/proc/set_up", function set_up(f: Frame, amt: Value, loca: Value, flash: Value, flash_fact: Value, message: Value) {
	flash ??= 0;
	flash_fact ??= 0;
	message ??= 1;
	this.amount = amt;
	this.explosion_message = message;
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	this.flashing = flash;
	this.flashing_factor = flash_fact;
	return f.dot;
});

// effects_other.dm:124
rt.def("/datum/effect_system/reagents_explosion/proc/start", function* start(f: Frame) {
	let s: Value = null, L: Value = null;
	if (this.explosion_message) {
		this.location.visible_message("<span class='danger'>The solution violently explodes!</span>", "<span class='italics'>You hear an explosion!</span>");
	}
	if (this.amount < 1) {
		yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(2, 1, this.location);
		yield* s.start();
		for (L of each(viewers(1, this.location), T("/mob/living"))) {
			if (prob(50 * this.amount)) {
				to_chat(L, "<span class='danger'>The explosion knocks you down.</span>");
				yield* L.Knockdown(rand(20, 100));
			}
		}
		return f.dot;
	} else {
		dyn_explosion(this.location, this.amount, this.flashing_factor);
	}
	return f.dot;
}, true);
