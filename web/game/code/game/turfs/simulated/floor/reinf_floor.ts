// Based on /tg/station's code/game/turfs/simulated/floor/reinf_floor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4757, "/turf/open/floor/engine", "/turf/open/floor", {
	name: "reinforced floor",
	icon_state: "engine",
	thermal_conductivity: 0.025,
	heat_capacity: 1e+31,
	floor_tile: rt.typePath("/obj/item/stack/rods"),
});

// reinf_floor.dm:20
rt.def("/turf/open/floor/engine/proc/make_plating", function* make_plating(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[0]) {
		yield* parent_proc();
	}
	return f.dot;
}, true, { args: ["force"] });

// reinf_floor.dm:24
rt.def("/turf/open/floor/engine/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (!C || !user) {
		return f.dot;
	}
	if (!rt.istype(C, T("/obj/item/weapon/wrench"))) return f.dot;
	to_chat(user, "<span class='notice'>You begin removing rods...</span>");
	playsound(this, C.usesound, 80, 1);
	if (!(yield* do_after(user, 30 * C.toolspeed, { target: this }))) return f.dot;
	if (!rt.istype(this, T("/turf/open/floor/engine"))) {
		return f.dot;
	}
	yield* new_(T("/obj/item/stack/rods"), this, 2);
	yield* this.ChangeTurf(T("/turf/open/floor/plating"));
	return f.dot;
}, true);

// reinf_floor.dm:37
rt.def("/turf/open/floor/engine/proc/acid_act", function* acid_act(f: Frame) {
	f.args[0] = min(f.args[0], 50);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["acidpwr", "acid_volume"] });

// reinf_floor.dm:41
rt.def("/turf/open/floor/engine/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let shielded: Value = this.is_shielded();
	yield* this.contents_explosion(severity, target);
	if (severity != 1 && shielded && target != this) {
		return f.dot;
	}
	if (target == this) {
		yield* this.ChangeTurf(this.baseturf);
		return f.dot;
	}
	if (severity === 1) {
		if (prob(80)) {
			yield* this.ReplaceWithLattice();
		} else if (prob(50)) {
			yield* this.ChangeTurf(this.baseturf);
		} else {
			yield* this.make_plating(1);
		}
	} else if (severity === 2) {
		if (!prob(50)) return f.dot;
		yield* this.make_plating(1);
	}
	return f.dot;
}, true, { waitfor: false });

// reinf_floor.dm:61
rt.def("/turf/open/floor/engine/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	if (this.floor_tile) {
		if (prob(30)) {
			yield* new_(this.floor_tile, this);
			yield* this.make_plating();
		}
	} else {
		if (!prob(30)) return f.dot;
		yield* this.ReplaceWithLattice();
	}
	return f.dot;
}, true);

// reinf_floor.dm:70
rt.def("/turf/open/floor/engine/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// reinf_floor.dm:73
rt.def("/turf/open/floor/engine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* user.Move_Pulled(this);
	return f.dot;
}, true);

rt.type(4765, "/turf/open/floor/engine/cult", "/turf/open/floor/engine", {
	realappearence: null,
	name: "engraved floor",
	icon_state: "plating",
});

// reinf_floor.dm:110
rt.def("/turf/open/floor/engine/cult/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/cult/turf/floor"), this);
	this.realappearence = (yield* new_(T("/obj/effect/clockwork/overlay/floor/bloodcult"), this));
	this.realappearence.linked = this;
	return f.dot;
}, true);

// reinf_floor.dm:116
rt.def("/turf/open/floor/engine/cult/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.be_removed();
	return (yield* parent_proc());
}, true);

// reinf_floor.dm:120
rt.def("/turf/open/floor/engine/cult/proc/ChangeTurf", function* ChangeTurf(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0] != this.type) {
		yield* this.be_removed();
	}
	return (yield* parent_proc());
}, true, { args: ["path", "defer_change"] });

// reinf_floor.dm:125
rt.def("/turf/open/floor/engine/cult/proc/be_removed", function* be_removed(f: Frame) {
	yield* qdel(this.realappearence);
	this.realappearence = null;
	return f.dot;
}, true);

// reinf_floor.dm:129
rt.def("/turf/open/floor/engine/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(this, T("/turf/open/floor/engine/cult"))) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#FAE48C";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);
