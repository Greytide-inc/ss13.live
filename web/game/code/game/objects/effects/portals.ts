// Based on /tg/station's code/game/objects/effects/portals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// portals.dm:3
rt.def("/proc/create_portal_pair", function* create_portal_pair(f: Frame, source: Value, destination: Value, _creator: Value, _lifespan: Value, accuracy: Value, newtype: Value) {
	_lifespan ??= 300;
	accuracy ??= 0;
	newtype ??= T("/obj/effect/portal");
	if (!rt.istype(source, T("/turf")) || !rt.istype(destination, T("/turf"))) {
		return f.dot;
	}
	let actual_destination: Value = get_teleport_turf(destination, accuracy);
	let P1: Value = (yield* new_(newtype, source, _creator, _lifespan, null, 0));
	let P2: Value = (yield* new_(newtype, actual_destination, _creator, _lifespan, P1, 1));
	if (!rt.istype(P1, T("/obj/effect/portal")) || !rt.istype(P2, T("/obj/effect/portal"))) {
		return f.dot;
	}
	P1.link_portal(P2);
	P1.hardlinked = 1;
	return list(P1, P2);
}, true);

rt.type(11208, "/obj/effect/portal", "/obj/effect", {
	mech_sized: 0,
	linked: null,
	hardlinked: 1,
	creator: null,
	hard_target: null,
	atmos_link: 0,
	atmos_source: null,
	atmos_destination: null,
	anchored: 1,
	name: "portal",
	desc: "Looks unstable. Best to test it with the clown.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "portal",
});

// portals.dm:36
rt.def("/obj/effect/portal/proc/Move", function* Move(f: Frame, newloc: Value) {
	let _T: Value = null;
	for (_T of each(newloc)) {
		if (rt.istype(_T, T("/obj/effect/portal"))) {
			return 0;
		}
	}
	return (yield* parent_proc());
}, true);

// portals.dm:42
rt.def("/obj/effect/portal/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!(user && this.Adjacent(user))) return f.dot;
	yield* this.teleport(user);
	return f.dot;
}, true);

// portals.dm:49
rt.def("/obj/effect/portal/proc/Crossed", function* Crossed(f: Frame, AM: Value, oldloc: Value) {
	if (rt.getStep(f, oldloc, 0) == rt.getStep(f, this.linked, 0)) {
		return (yield* parent_proc());
	}
	if (yield* this.teleport(AM)) return f.dot;
	return (yield* parent_proc());
}, true);

// portals.dm:58
rt.def("/obj/effect/portal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.Adjacent(user)) return f.dot;
	yield* this.teleport(user);
	return f.dot;
}, true);

// portals.dm:62
rt.def("/obj/effect/portal/proc/Initialize", function* Initialize(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	f.dot = (yield* parent_proc());
	GLOB.portals += this;
	if (!rt.istype(f.args[3], T("/obj/effect/portal")) && f.args[4]) {
		f.dot = INITIALIZE_HINT_QDEL;
		CRASH("Somebody fucked up.");
	}
	if (f.args[2] > 0) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), f.args[2], 8);
	}
	if (f.args[6] !== null) {
		this.atmos_link = f.args[6];
	}
	this.link_portal(f.args[3]);
	this.hardlinked = f.args[4];
	this.creator = f.args[1];
	return f.dot;
}, true, { args: ["mapload", "_creator", "_lifespan", "_linked", "automatic_link", "hard_target_override", "atmos_link_override"] });

// portals.dm:76
rt.def("/obj/effect/portal/proc/link_portal", function link_portal(f: Frame, newlink: Value) {
	this.linked = newlink;
	if (!this.atmos_link) return f.dot;
	this.link_atmos();
	return f.dot;
});

// portals.dm:81
rt.def("/obj/effect/portal/proc/link_atmos", function link_atmos(f: Frame) {
	if (this.atmos_source || this.atmos_destination) {
		this.unlink_atmos();
	}
	if (!rt.istype(rt.getStep(f, this, 0), T("/turf/open"))) {
		return 0;
	}
	if (this.linked) {
		if (rt.istype(rt.getStep(f, this.linked, 0), T("/turf/open"))) {
			this.atmos_source = rt.getStep(f, this, 0);
			this.atmos_destination = rt.getStep(f, this.linked, 0);
		}
	} else if (this.hard_target) {
		if (rt.istype(this.hard_target, T("/turf/open"))) {
			this.atmos_source = rt.getStep(f, this, 0);
			this.atmos_destination = this.hard_target;
		}
	} else {
		return 0;
	}
	if (!rt.istype(this.atmos_source, T("/turf/open")) || !rt.istype(this.atmos_destination, T("/turf/open"))) {
		return 0;
	}
	if (!this.atmos_source.atmos_adjacent_turfs) {
		this.atmos_source.atmos_adjacent_turfs = list();
	}
	if (!this.atmos_destination.atmos_adjacent_turfs) {
		this.atmos_destination.atmos_adjacent_turfs = list();
	}
	if (rt.index(this.atmos_source.atmos_adjacent_turfs, this.atmos_destination) || rt.index(this.atmos_destination.atmos_adjacent_turfs, this.atmos_source)) {
		return 0;
	}
	rt.setAt(this.atmos_source.atmos_adjacent_turfs, this.atmos_destination, 1);
	rt.setAt(this.atmos_destination.atmos_adjacent_turfs, this.atmos_source, 1);
	this.atmos_source.air_update_turf(0);
	this.atmos_destination.air_update_turf(0);
	return f.dot;
});

// portals.dm:107
rt.def("/obj/effect/portal/proc/unlink_atmos", function unlink_atmos(f: Frame) {
	let $0: any;
	if (rt.istype(this.atmos_source, T("/turf/open"))) {
		$0 = ((rt.istype(this.atmos_destination, T("/turf/open")) ? 1 : 0) && (!this.atmos_source.Adjacent(this.atmos_destination) ? 1 : 0));
		if ($0) {
			if (this.atmos_destination.CanAtmosPass == -1) {
				$0 = this.atmos_destination.CanAtmosPass(this.atmos_source);
			} else if (this.atmos_destination.CanAtmosPass == -2) {
				$0 = (!this.atmos_destination.density ? 1 : 0);
			} else {
				$0 = this.atmos_destination.CanAtmosPass;
			}
			$0 = (!$0 ? 1 : 0);
		}
		if ($0) {
			if (this.atmos_source.atmos_adjacent_turfs) {
				this.atmos_source.atmos_adjacent_turfs -= this.atmos_destination;
				if (!rt.len(f, this.atmos_source.atmos_adjacent_turfs)) {
					this.atmos_source.atmos_adjacent_turfs = null;
				}
			}
		}
		this.atmos_source = null;
	}
	if (!rt.istype(this.atmos_destination, T("/turf/open"))) return f.dot;
	$0 = ((rt.istype(this.atmos_source, T("/turf/open")) ? 1 : 0) && (!this.atmos_destination.Adjacent(this.atmos_source) ? 1 : 0));
	if ($0) {
		if (this.atmos_source.CanAtmosPass == -1) {
			$0 = this.atmos_source.CanAtmosPass(this.atmos_destination);
		} else if (this.atmos_source.CanAtmosPass == -2) {
			$0 = (!this.atmos_source.density ? 1 : 0);
		} else {
			$0 = this.atmos_source.CanAtmosPass;
		}
		$0 = (!$0 ? 1 : 0);
	}
	if ($0) {
		if (this.atmos_destination.atmos_adjacent_turfs) {
			this.atmos_destination.atmos_adjacent_turfs -= this.atmos_source;
			if (!rt.len(f, this.atmos_destination.atmos_adjacent_turfs)) {
				this.atmos_destination.atmos_adjacent_turfs = null;
			}
		}
	}
	this.atmos_destination = null;
	return f.dot;
});

// portals.dm:117
rt.def("/obj/effect/portal/proc/Destroy", function* Destroy(f: Frame) {
	if (this.creator && hascall(this.creator, "on_portal_destroy")) {
		yield* g.callDyn(f, this.creator, "on_portal_destroy", [this, this.loc]);
	}
	this.creator = null;
	GLOB.portals -= this;
	this.unlink_atmos();
	if (this.hardlinked && !(!this.linked || this.linked.gc_destroyed)) {
		yield* qdel(this.linked);
		this.linked = null;
	} else {
		this.linked = null;
	}
	return (yield* parent_proc());
}, true);

// portals.dm:129
rt.def("/obj/effect/portal/proc/teleport", function* teleport(f: Frame, M: Value) {
	let real_target: Value = null, _P: Value = null;
	let $0: any, $1: any;
	if (!rt.istype(M, T("/atom/movable")) || rt.istype(M, T("/obj/effect")) || rt.istype(M, T("/obj/mecha")) && !this.mech_sized || !rt.istype(M, T("/obj")) && !ismob(M)) {
		return f.dot;
	}
	if (!rt.istype((real_target = (yield* this.get_link_target_turf())), T("/turf"))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/simple_animal/hostile/megafauna"))) {
		$0 = M;
		if (this) {
			$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`${$0} has used a portal at ${`${$1}`} made by ${f.usr}.`);
	}
	if (yield* do_teleport(M, real_target, 0)) {
		if (rt.istype(M, T("/obj/item/projectile"))) {
			(_P = M).ignore_source_check = 1;
		}
		return 1;
	}
	return 0;
}, true);

// portals.dm:145
rt.def("/obj/effect/portal/proc/get_link_target_turf", function* get_link_target_turf(f: Frame) {
	let real_target: Value = null;
	if (!rt.istype(this.linked, T("/obj/effect/portal")) || !this.linked || this.linked.gc_destroyed) {
		if (this.hardlinked) {
			yield* qdel(this);
		}
		if (!rt.istype(this.hard_target, T("/turf")) || !this.hard_target || this.hard_target.gc_destroyed) {
			this.hard_target = null;
			return f.dot;
		} else {
			real_target = this.hard_target;
			this.linked = null;
		}
	} else {
		real_target = rt.getStep(f, this.linked, 0);
	}
	return real_target;
}, true);
