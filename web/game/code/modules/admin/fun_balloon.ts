// Based on /tg/station's code/modules/admin/fun_balloon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(12030, "/obj/effect/fun_balloon", "/obj/effect", {
	popped: 0,
	anchored: 1,
	name: "fun balloon",
	desc: "This is going to be a laugh riot.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// fun_balloon.dm:10
rt.def("/obj/effect/fun_balloon/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	(rt.modField(f, GLOB.SSobj, "processing", this, rt.bitOr));
	return f.dot;
}, true);

// fun_balloon.dm:14
rt.def("/obj/effect/fun_balloon/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// fun_balloon.dm:18
rt.def("/obj/effect/fun_balloon/proc/process", function* process(f: Frame) {
	if (!(!this.popped && (yield* this.check()) && !(!this || this.gc_destroyed))) return f.dot;
	this.popped = 1;
	yield* this.effect();
	yield* g.srcCall(f, "pop");
	return f.dot;
}, true, { waitfor: false });

// fun_balloon.dm:30
rt.def("/obj/effect/fun_balloon/proc/pop", function* pop(f: Frame) {
	this.visible_message(`${this} pops!`);
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/items/party_horn.ogg"), 50, 1, -1);
	yield* qdel(this);
	return f.dot;
}, true);

// fun_balloon.dm:35
rt.def("/obj/effect/fun_balloon/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (!user.client || !user.client.holder || this.popped) {
		return f.dot;
	}
	if ((yield* alert(`Pop ${this}?`, "Fun Balloon", "Yes", "No")) === "Yes") {
		yield* this.effect();
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

// fun_balloon.dm:49
rt.def("/obj/effect/fun_balloon/sentience/proc/effect", function* effect(f: Frame) {
	let M: Value = null, ghost: Value = null, body: Value = null;
	let bodies: Value = list();
	for (M of each(range(this.effect_range, rt.getStep(f, this, 0)), T("/mob/living"))) {
		bodies += M;
	}
	let question: Value = `Would you like to be ${this.group_name}?`;
	let candidates: Value = (yield* pollCandidatesForMobs(question, "pAI", null, 0, 100, bodies));
	while (rt.len(f, candidates) && rt.len(f, bodies)) {
		ghost = pick_n_take(candidates);
		to_chat((body = pick_n_take(bodies)), "Your mob has been taken over by a ghost!");
		message_admins(`${key_name_admin(ghost)} has taken control of (${key_name_admin(body)})`);
		yield* body.ghostize(0);
		body.key = ghost.key;
		yield* new_(T("/obj/effect/temp_visual/gravpush"), rt.getStep(f, body, 0));
	}
	return f.dot;
}, true);

rt.type(12032, "/obj/effect/fun_balloon/sentience/emergency_shuttle", "/obj/effect/fun_balloon/sentience", {
	trigger_time: 60,
	name: "shuttle sentience fun balloon",
});

// fun_balloon.dm:71
rt.def("/obj/effect/fun_balloon/sentience/emergency_shuttle/proc/check", function check(f: Frame) {
	f.dot = 0;
	if (!(GLOB.SSshuttle.emergency && GLOB.SSshuttle.emergency.timeLeft() <= this.trigger_time && GLOB.SSshuttle.emergency.mode == "call")) return f.dot;
	f.dot = 1;
	return f.dot;
});

rt.type(12033, "/obj/effect/fun_balloon/scatter", "/obj/effect/fun_balloon", {
	effect_range: 5,
	name: "scatter fun balloon",
	desc: "When this pops, you're not going to be around here anymore.",
});

// fun_balloon.dm:80
rt.def("/obj/effect/fun_balloon/scatter/proc/effect", function* effect(f: Frame) {
	let M: Value = null, _T: Value = null;
	for (M of each(range(this.effect_range, rt.getStep(f, this, 0)), T("/mob/living"))) {
		_T = find_safe_turf();
		yield* new_(T("/obj/effect/temp_visual/gravpush"), rt.getStep(f, M, 0));
		yield* M.forceMove(_T);
		to_chat(M, "<span class='notice'>Pop!</span>");
	}
	return f.dot;
}, true);

rt.type(12034, "/obj/effect/station_crash", "/obj/effect", {
	anchored: 1,
	name: "station crash",
	desc: "With no survivors!",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// fun_balloon.dm:94
rt.def("/obj/effect/station_crash/proc/New", function* New(f: Frame) {
	let S: Value = null, SM: Value = null, new_dir: Value = null;
	for (S of each(GLOB.SSshuttle.stationary)) {
		if ((SM = S).id == "emergency_home") {
			new_dir = turn(SM.dir, 180);
			SM.loc = get_ranged_target_turf(SM, new_dir, rand(3, 15));
			break;
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12035, "/obj/effect/shuttle_build", "/obj/effect", {
	anchored: 1,
	name: "shuttle_build",
	desc: "Some assembly required",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "syndballoon",
});

// fun_balloon.dm:113
// tg_js: was New(), which ran while the "Build your own shuttle kit" template was still loading (atom setup off), so the
// turfs the emergency shuttle left and landed on never got set up (no air: LINDA "Cannot execute null.archive()").
// Initialize() runs after the load, as later tg does it; INITIALIZE_HINT_QDEL replaces the qdel(src).
rt.def("/obj/effect/shuttle_build/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* GLOB.SSshuttle.emergency.dock(GLOB.SSshuttle.getDock("emergency_home"));
	return 2;
}, true);

rt.type(11814, "/obj/effect/forcefield/arena_shuttle", "/obj/effect/forcefield", {
	warp_points: null,
	name: "portal",
});

// fun_balloon.dm:120
rt.def("/obj/effect/forcefield/arena_shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.warp_points = list();
	return f.dot;
});

// fun_balloon.dm:124
rt.def("/obj/effect/forcefield/arena_shuttle/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let _T: Value = null, AM: Value = null, L: Value = null, LA: Value = null, chainsaw: Value = null;
	if (!rt.len(f, this.warp_points)) {
		this.warp_points = get_area_turfs(T("/area/shuttle/escape"));
		for (_T of each(this.warp_points, T("/turf"))) {
			AM = null;
			for (AM of each(_T, T("/atom/movable"))) {
				if (AM.density && AM.anchored) {
					this.warp_points -= _T;
					break;
				}
			}
		}
	}
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	} else if ((L = M).pulling && rt.istype(L.pulling, T("/obj/item/bodypart/head"))) {
		to_chat(L, "Your offering is accepted. You may pass.");
		yield* qdel(L.pulling);
		LA = pick(this.warp_points);
		yield* L.forceMove(LA);
		L.hallucination = 0;
		to_chat(L, "<span class='reallybig redtext'>The battle is won. Your bloodlust subsides.</span>");
		for (chainsaw of each(L, T("/obj/item/weapon/twohanded/required/chainsaw/doomslayer"))) {
			yield* qdel(chainsaw);
		}
	} else {
		to_chat(L, "You are not yet worthy of passing. Drag a severed head to the barrier to be allowed entry to the hall of champions.");
	}
	return f.dot;
}, true);

rt.type(11815, "/obj/effect/forcefield/arena_shuttle_entrance", "/obj/effect/forcefield", {
	warp_points: null,
	name: "portal",
});

// fun_balloon.dm:158
rt.def("/obj/effect/forcefield/arena_shuttle_entrance/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.warp_points = list();
	return f.dot;
});

// fun_balloon.dm:161
rt.def("/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped", function* Bumped(f: Frame, M: Value) {
	let S: Value = null, B: Value = null;
	if (!rt.len(f, this.warp_points)) {
		for (S of each(GLOB.landmarks_list, T("/obj/effect/landmark/shuttle_arena_entrance"))) {
			(rt.modSrcVar(f, "warp_points", S, rt.bitOr));
		}
	}
	if (!rt.istype(M, T("/mob/living"))) {
		return f.dot;
	}
	let LA: Value = pick(this.warp_points);
	yield* M.forceMove(rt.getStep(f, LA, 0));
	to_chat(M, "<span class='reallybig redtext'>You're trapped in a deadly arena! To escape, you'll need to drag a severed head to the escape portals.</span>");
	rt.spawnTail(f, 0, "/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped: spawn at modules/admin/fun_balloon.dm:171", M, S, LA, B);
	return f.dot;
}, true);

// a spawn(0) body of /obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/forcefield/arena_shuttle_entrance/proc/Bumped: spawn at modules/admin/fun_balloon.dm:171", function* (f: Frame, M: Value, S: Value, LA: Value, B: Value) {
	yield* (B = (yield* new_(T("/obj/effect/mine/pickup/bloodbath"), M))).mineEffect(M);
	return null;
});
