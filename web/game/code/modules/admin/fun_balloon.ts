// From code/modules/admin/fun_balloon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12030, "/obj/effect/fun_balloon", "/obj/effect", {
	popped: 0,
	anchored: 1,
	name: "fun balloon",
	desc: "This is going to be a laugh riot.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// /obj/effect/fun_balloon/proc/New  (code/modules/admin/fun_balloon.dm:10)  may sleep
rt.def("/obj/effect/fun_balloon/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/effect/fun_balloon/proc/Destroy  (code/modules/admin/fun_balloon.dm:14)  may sleep
rt.def("/obj/effect/fun_balloon/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/fun_balloon/proc/process  (code/modules/admin/fun_balloon.dm:18)  may sleep
rt.def("/obj/effect/fun_balloon/proc/process", function* process(f: Frame) {
	if (!((!truthy(rt.sv(f, "popped")) && truthy((yield* g.srcCall(f, "check")))) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) return f.dot;
	rt.setSv(f, "popped", 1);
	yield* g.srcCall(f, "effect");
	yield* g.srcCall(f, "pop");
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/fun_balloon/proc/pop  (code/modules/admin/fun_balloon.dm:30)  may sleep
rt.def("/obj/effect/fun_balloon/proc/pop", function* pop(f: Frame) {
	yield* g.srcCall(f, "visible_message", fmt("＀ pops!", [live(f.src)]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/items/party_horn.ogg"), 50, 1, -1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/effect/fun_balloon/proc/attack_ghost  (code/modules/admin/fun_balloon.dm:35)  may sleep
rt.def("/obj/effect/fun_balloon/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	if (((!truthy(rt.fv(f, "client", live(user))) || !truthy(rt.gv(f, "holder", rt.fv(f, "client", live(user))))) || truthy(rt.sv(f, "popped")))) {
		return live(f.dot);
	}
	$0 = (yield* g.call(f, P("/proc/alert"), null, [fmt("Pop ＀?", [live(f.src)]), "Fun Balloon", "Yes", "No"]));
	if ($0 === "Yes") {
		yield* g.srcCall(f, "effect");
		yield* g.srcCall(f, "pop");
	}
	return f.dot;
}, true);

rt.type(12031, "/obj/effect/fun_balloon/sentience", "/obj/effect/fun_balloon", {
	effect_range: 3,
	group_name: "a bunch of giant spiders",
	name: "sentience fun balloon",
	desc: "When this pops, things are gonna get more aware around here.",
});

// /obj/effect/fun_balloon/sentience/proc/effect  (code/modules/admin/fun_balloon.dm:49)  may sleep
rt.def("/obj/effect/fun_balloon/sentience/proc/effect", function* effect(f: Frame) {
	let bodies: Value = null, M: Value = null, question: Value = null, candidates: Value = null, ghost: Value = null, body: Value = null;
	let $e: any;
	f.vars = () => [bodies, M, question, candidates, ghost, body, $e];
	bodies = rt.list();
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "effect_range"), rt.getStep(f, live(f.src), 0)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		bodies = rt.modify(live(bodies), live(M), add);
	}
	rt.endFor(f, 0);
	question = fmt("Would you like to be ＀?", [rt.sv(f, "group_name")]);
	candidates = (yield* g.call(f, P("/proc/pollCandidatesForMobs"), null, [live(question), "pAI", null, 0, 100, live(bodies)]));
	while (truthy(rt.len(f, live(candidates))) && truthy(rt.len(f, live(bodies)))) {
		ghost = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(candidates)]));
		yield* g.call(f, P("/proc/to_chat"), null, [(body = (yield* g.call(f, P("/proc/pick_n_take"), null, [live(bodies)]))), "Your mob has been taken over by a ghost!"]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ has taken control of (＀)", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(ghost)])), (yield* g.call(f, P("/proc/key_name_admin"), null, [live(body)]))])]);
		yield* g.callName(f, live(body), "ghostize", [0]);
		rt.setFv(f, "key", live(body), rt.fv(f, "key", live(ghost)));
		yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [rt.getStep(f, live(body), 0)]);
	}
	return f.dot;
}, true);

rt.type(12032, "/obj/effect/fun_balloon/sentience/emergency_shuttle", "/obj/effect/fun_balloon/sentience", {
	trigger_time: 60,
	name: "shuttle sentience fun balloon",
});

// /obj/effect/fun_balloon/sentience/emergency_shuttle/proc/check  (code/modules/admin/fun_balloon.dm:71)
rt.def("/obj/effect/fun_balloon/sentience/emergency_shuttle/proc/check", function check(f: Frame) {
	f.dot = 0;
	if (!((truthy(rt.fv(f, "emergency", rt.gl("SSshuttle"))) && rt.le(rt.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "timeLeft", []), rt.sv(f, "trigger_time"))) && isEqual(rt.gv(f, "mode", rt.fv(f, "emergency", rt.gl("SSshuttle"))), "call"))) return f.dot;
	f.dot = 1;
	return f.dot;
});

rt.type(12033, "/obj/effect/fun_balloon/scatter", "/obj/effect/fun_balloon", {
	effect_range: 5,
	name: "scatter fun balloon",
	desc: "When this pops, you're not going to be around here anymore.",
});

// /obj/effect/fun_balloon/scatter/proc/effect  (code/modules/admin/fun_balloon.dm:80)  may sleep
rt.def("/obj/effect/fun_balloon/scatter/proc/effect", function* effect(f: Frame) {
	let M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, _T, $e];
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [rt.sv(f, "effect_range"), rt.getStep(f, live(f.src), 0)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		_T = (yield* g.call(f, P("/proc/find_safe_turf"), null, []));
		yield* g.new_(f, T("/obj/effect/temp_visual/gravpush"), [rt.getStep(f, live(M), 0)]);
		yield* g.callName(f, live(M), "forceMove", [live(_T)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='notice'>Pop!</span>"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(12034, "/obj/effect/station_crash", "/obj/effect", {
	anchored: 1,
	name: "station crash",
	desc: "With no survivors!",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// /obj/effect/station_crash/proc/New  (code/modules/admin/fun_balloon.dm:94)  may sleep
rt.def("/obj/effect/station_crash/proc/New", function* New(f: Frame) {
	let S: Value = null, SM: Value = null, new_dir: Value = null;
	let $e: any;
	f.vars = () => [S, SM, new_dir, $e];
	S = null;
	rt.forList(f, 0, rt.fv(f, "stationary", rt.gl("SSshuttle")));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		if (isEqual(rt.gv(f, "id", (SM = live(S))), "emergency_home")) {
			new_dir = (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(SM)), 180]));
			rt.setFv(f, "loc", live(SM), (yield* g.call(f, P("/proc/get_ranged_target_turf"), null, [live(SM), live(new_dir), (yield* g.call(f, P("/proc/rand"), null, [3, 15]))])));
			break;
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12035, "/obj/effect/shuttle_build", "/obj/effect", {
	anchored: 1,
	name: "shuttle_build",
	desc: "Some assembly required",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// /obj/effect/shuttle_build/proc/New  (code/modules/admin/fun_balloon.dm:113)  may sleep
// tg_js: was New(), which ran while the "Build your own shuttle kit" template was still loading (atom setup off), so the
// turfs the emergency shuttle left and landed on never got set up (no air: LINDA "Cannot execute null.archive()").
// Initialize() runs after the load, as later tg does it; INITIALIZE_HINT_QDEL replaces the qdel(src).
rt.def("/obj/effect/shuttle_build/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "dock", [(yield* g.callName(f, rt.gl("SSshuttle"), "getDock", ["emergency_home"]))]);
	return 2;
}, true);

rt.type(11814, "/obj/effect/forcefield/arena_shuttle", "/obj/effect/forcefield", {
	warp_points: null,
	name: "portal",
});

// /obj/effect/forcefield/arena_shuttle/proc/<init>  (code/modules/admin/fun_balloon.dm:120)
rt.def("/obj/effect/forcefield/arena_shuttle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "warp_points", rt.list());
	return f.dot;
});

// /obj/effect/forcefield/arena_shuttle/proc/Bumped  (code/modules/admin/fun_balloon.dm:124)  may sleep
rt.def("/obj/effect/forcefield/arena_shuttle/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let _T: Value = null, AM: Value = null, L: Value = null, LA: Value = null, chainsaw: Value = null;
	let $e: any;
	f.vars = () => [M, _T, AM, L, LA, chainsaw, $e];
	if (!truthy(rt.len(f, rt.sv(f, "warp_points")))) {
		rt.setSv(f, "warp_points", (yield* g.call(f, P("/proc/get_area_turfs"), null, [T("/area/shuttle/escape")])));
		_T = null;
		rt.forList(f, 0, rt.sv(f, "warp_points"), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			AM = null;
			rt.forList(f, 1, live(_T), T("/atom/movable"));
			while (($e = rt.next(f, 1)) !== undefined) {
				AM = $e;
				if ((truthy(rt.fv(f, "density", live(AM))) && truthy(rt.fv(f, "anchored", live(AM))))) {
					(rt.modSrcVar(f, "warp_points", live(_T), subtract));
					break;
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	} else {
		if ((truthy(rt.gv(f, "pulling", (L = live(M)))) && truthy((rt.istype(rt.fv(f, "pulling", live(L)), T("/obj/item/bodypart/head")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "Your offering is accepted. You may pass."]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "pulling", live(L))]);
			LA = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "warp_points")]);
			yield* g.callName(f, live(L), "forceMove", [live(LA)]);
			rt.setFv(f, "hallucination", live(L), 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='reallybig redtext'>The battle is won. Your bloodlust subsides.</span>"]);
			chainsaw = null;
			rt.forList(f, 0, live(L), T("/obj/item/weapon/twohanded/required/chainsaw/doomslayer"));
			while (($e = rt.next(f, 0)) !== undefined) {
				chainsaw = $e;
				yield* g.call(f, P("/proc/qdel"), null, [live(chainsaw)]);
			}
			rt.endFor(f, 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "You are not yet worthy of passing. Drag a severed head to the barrier to be allowed entry to the hall of champions."]);
		}
	}
	return f.dot;
}, true);

rt.type(11815, "/obj/effect/forcefield/arena_shuttle_entrance", "/obj/effect/forcefield", {
	warp_points: null,
	name: "portal",
});

// /obj/effect/forcefield/arena_shuttle_entrance/proc/<init>  (code/modules/admin/fun_balloon.dm:158)
rt.def("/obj/effect/forcefield/arena_shuttle_entrance/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "warp_points", rt.list());
	return f.dot;
});

// /obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped  (code/modules/admin/fun_balloon.dm:161)  may sleep
rt.def("/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let S: Value = null, LA: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [M, S, LA, B, $e];
	if (!truthy(rt.len(f, rt.sv(f, "warp_points")))) {
		S = null;
		rt.forList(f, 0, rt.gl("landmarks_list"), T("/obj/effect/landmark/shuttle_arena_entrance"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			(rt.modSrcVar(f, "warp_points", live(S), rt.bitOr));
		}
		rt.endFor(f, 0);
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	LA = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "warp_points")]);
	yield* g.callName(f, live(M), "forceMove", [rt.getStep(f, live(LA), 0)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='reallybig redtext'>You're trapped in a deadly arena! To escape, you'll need to drag a severed head to the escape portals.</span>"]);
	rt.spawnTail(f, 0, "/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped: spawn at modules/admin/fun_balloon.dm:171", M, S, LA, B);
	return f.dot;
}, true);

// a spawn(0) body of /obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped: spawn at modules/admin/fun_balloon.dm:171", function* (f: Frame, M: Value, S: Value, LA: Value, B: Value) {
	f.vars = () => [M, S, LA, B];
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/effect/mine/pickup/bloodbath"), [live(M)]))), "mineEffect", [live(M)]);
	return null;
});
