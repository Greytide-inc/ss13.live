// Based on /tg/station's code/modules/events/wormholes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(325, "/datum/round_event/wormholes", "/datum/round_event", {
	pick_turfs: null,
	wormholes: null,
	shift_frequency: 3,
	number_of_wormholes: 400,
	announceWhen: 10,
	endWhen: 60,
});

// wormholes.dm:13
rt.def("/datum/round_event/wormholes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.pick_turfs = list();

	this.wormholes = list();
	return f.dot;
});

// wormholes.dm:19
rt.def("/datum/round_event/wormholes/proc/setup", function setup(f: Frame) {
	this.announceWhen = rand(0, 20);
	this.endWhen = rand(40, 80);
	return f.dot;
});

// wormholes.dm:23
rt.def("/datum/round_event/wormholes/proc/start", function* start(f: Frame) {
	let _T: Value = null, _T_1: Value = null;
	for (_T of each(rt.world(), T("/turf/open/floor"))) {
		if (_T.z == ZLEVEL_STATION) {
			this.pick_turfs += _T;
		}
	}
	let i: Value = 1;
	while (i <= this.number_of_wormholes) {
		this.wormholes += (yield* new_(T("/obj/effect/portal/wormhole"), (_T_1 = pick(this.pick_turfs)), null, 300, null, 0));
		i++;
	}
	return f.dot;
}, true);

// wormholes.dm:32
rt.def("/datum/round_event/wormholes/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Space-time anomalies detected on the station. There is no additional data.", "Anomaly Alert", rt.rsc("sound/ai/spanomalies.ogg"));
	return f.dot;
}, true);

// wormholes.dm:35
rt.def("/datum/round_event/wormholes/proc/tick", function* tick(f: Frame) {
	let O: Value = null, _T: Value = null;
	if (this.activeFor % this.shift_frequency != 0) return f.dot;
	for (O of each(this.wormholes, T("/obj/effect/portal/wormhole"))) {
		if (_T = pick(this.pick_turfs)) {
			yield* O.forceMove(_T);
		}
	}
	return f.dot;
}, true);

// wormholes.dm:42
rt.def("/datum/round_event/wormholes/proc/end", function* end(f: Frame) {
	let I: Value = null;
	if (!this.wormholes) return f.dot;
	for (I of each(this.wormholes)) {
		yield* qdel(I);
	}
	this.wormholes.Cut();
	return f.dot;
}, true);

rt.type(11210, "/obj/effect/portal/wormhole", "/obj/effect/portal", {
	mech_sized: 1,
	name: "wormhole",
	desc: "It looks highly unstable; It could close at any moment.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "anom",
});

// wormholes.dm:52
rt.def("/obj/effect/portal/wormhole/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.teleport(user);
	return f.dot;
}, true);

// wormholes.dm:55
rt.def("/obj/effect/portal/wormhole/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	yield* this.teleport(user);
	return f.dot;
}, true);

// wormholes.dm:58
rt.def("/obj/effect/portal/wormhole/proc/teleport", function* teleport(f: Frame, M: Value) {
	let _P: Value = null;
	if (rt.istype(M, T("/obj/effect"))) {
		return f.dot;
	}
	if (M.anchored) {
		if (!(rt.istype(M, T("/obj/mecha")) && this.mech_sized)) {
			return f.dot;
		}
	}
	if (!rt.istype(M, T("/atom/movable"))) return f.dot;
	if (rt.len(f, GLOB.portals)) {
		if ((_P = pick(GLOB.portals)) && isturf(_P.loc)) {
			this.hard_target = _P.loc;
		}
	}
	if (!this.hard_target) {
		return f.dot;
	}
	yield* do_teleport(M, this.hard_target, 1, 1, 0, 0);
	return f.dot;
}, true);
