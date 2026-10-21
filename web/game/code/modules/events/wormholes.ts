// From code/modules/events/wormholes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(325, "/datum/round_event/wormholes", "/datum/round_event", {
	pick_turfs: null,
	wormholes: null,
	shift_frequency: 3,
	number_of_wormholes: 400,
	announceWhen: 10,
	endWhen: 60,
});

// /datum/round_event/wormholes/proc/<init>  (code/modules/events/wormholes.dm:13)
rt.def("/datum/round_event/wormholes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "pick_turfs", rt.list());
	$0 = $0;
	rt.setSv(f, "wormholes", rt.list());
	return f.dot;
});

// /datum/round_event/wormholes/proc/setup  (code/modules/events/wormholes.dm:19)
rt.def("/datum/round_event/wormholes/proc/setup", function setup(f: Frame) {
	rt.setSv(f, "announceWhen", rt.call(f, P("/proc/rand"), null, [0, 20]));
	rt.setSv(f, "endWhen", rt.call(f, P("/proc/rand"), null, [40, 80]));
	return f.dot;
});

// /datum/round_event/wormholes/proc/start  (code/modules/events/wormholes.dm:23)  may sleep
rt.def("/datum/round_event/wormholes/proc/start", function* start(f: Frame) {
	let _T: Value = null, i: Value = null, _T_1: Value = null;
	let $e: any;
	f.vars = () => [_T, i, _T_1, $e];
	_T = null;
	rt.forList(f, 0, rt.world(), T("/turf/open/floor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (isEqual(rt.fv(f, "z", live(_T)), 2)) {
			rt.modSrcVar(f, "pick_turfs", live(_T), add);
		}
	}
	rt.endFor(f, 0);
	i = null;
	i = 1;
	while (rt.le(live(i), rt.sv(f, "number_of_wormholes"))) {
		rt.modSrcVar(f, "wormholes", (yield* g.new_(f, T("/obj/effect/portal/wormhole"), [(_T_1 = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "pick_turfs")])), null, 300, null, 0])), add);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /datum/round_event/wormholes/proc/announce  (code/modules/events/wormholes.dm:32)  may sleep
rt.def("/datum/round_event/wormholes/proc/announce", function* announce(f: Frame) {
	yield* g.call(f, P("/proc/priority_announce"), null, ["Space-time anomalies detected on the station. There is no additional data.", "Anomaly Alert", rt.rsc("sound/ai/spanomalies.ogg")]);
	return f.dot;
}, true);

// /datum/round_event/wormholes/proc/tick  (code/modules/events/wormholes.dm:35)  may sleep
rt.def("/datum/round_event/wormholes/proc/tick", function* tick(f: Frame) {
	let O: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [O, _T, $e];
	if (!isEqual(rt.modulus(rt.sv(f, "activeFor"), rt.sv(f, "shift_frequency")), 0)) return f.dot;
	O = null;
	rt.forList(f, 0, rt.sv(f, "wormholes"), T("/obj/effect/portal/wormhole"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((_T = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "pick_turfs")])))) {
			yield* g.callName(f, live(O), "forceMove", [live(_T)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/round_event/wormholes/proc/end  (code/modules/events/wormholes.dm:42)  may sleep
rt.def("/datum/round_event/wormholes/proc/end", function* end(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (!truthy(rt.sv(f, "wormholes"))) return f.dot;
	I = null;
	rt.forList(f, 0, rt.sv(f, "wormholes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "wormholes"), "Cut", []);
	return f.dot;
}, true);

rt.type(11210, "/obj/effect/portal/wormhole", "/obj/effect/portal", {
	mech_sized: 1,
	name: "wormhole",
	desc: "It looks highly unstable; It could close at any moment.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "anom",
});

// /obj/effect/portal/wormhole/proc/attack_hand  (code/modules/events/wormholes.dm:52)  may sleep
rt.def("/obj/effect/portal/wormhole/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "teleport", live(user));
	return f.dot;
}, true);

// /obj/effect/portal/wormhole/proc/attackby  (code/modules/events/wormholes.dm:55)  may sleep
rt.def("/obj/effect/portal/wormhole/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	yield* g.srcCall(f, "teleport", live(user));
	return f.dot;
}, true);

// /obj/effect/portal/wormhole/proc/teleport  (code/modules/events/wormholes.dm:58)  may sleep
rt.def("/obj/effect/portal/wormhole/proc/teleport", function* teleport(f: Frame, M: Value) {
	let _P: Value = null;
	f.vars = () => [M, _P];
	if (truthy((rt.istype(live(M), T("/obj/effect")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(M)))) {
		if (!(truthy((rt.istype(live(M), T("/obj/mecha")) ? 1 : 0)) && truthy(rt.sv(f, "mech_sized")))) {
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(M), T("/atom/movable")) ? 1 : 0))) return f.dot;
	if (truthy(rt.len(f, rt.gl("portals")))) {
		if ((truthy((_P = rt.op(f, "PickUnweighted", [1], [rt.gl("portals")]))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(_P))]))))) {
			rt.setSv(f, "hard_target", rt.fv(f, "loc", live(_P)));
		}
	}
	if (!truthy(rt.sv(f, "hard_target"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/do_teleport"), null, [live(M), rt.sv(f, "hard_target"), 1, 1, 0, 0]);
	return f.dot;
}, true);
