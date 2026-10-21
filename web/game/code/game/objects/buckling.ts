// From code/game/objects/buckling.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/movable/proc/attack_hand  (code/game/objects/buckling.dm:13)  may sleep
rt.def("/atom/movable/proc/attack_hand", function* attack_hand(f: Frame) {
	let unbuckled: Value = null;
	f.vars = () => [unbuckled];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "can_buckle")) && truthy((yield* g.srcCall(f, "has_buckled_mobs"))))) return f.dot;
	if (rt.gt(rt.len(f, rt.sv(f, "buckled_mobs")), 1)) {
		if (truthy((yield* g.srcCall(f, "user_unbuckle_mob", (unbuckled = (yield* g.op(f, "Prompt", [9], [null, "Unbuckle Who?", "Who do you wish to unbuckle?", live(f.args[0]), rt.sv(f, "buckled_mobs")]))), live(f.args[0]))))) {
			return 1;
		}
	} else {
		if (!truthy((yield* g.srcCall(f, "user_unbuckle_mob", rt.index(rt.sv(f, "buckled_mobs"), 1), live(f.args[0]))))) return f.dot;
		return 1;
	}
	return f.dot;
}, true, { args: ["user"] });

// /atom/movable/proc/MouseDrop_T  (code/game/objects/buckling.dm:24)  may sleep
rt.def("/atom/movable/proc/MouseDrop_T", function* MouseDrop_T(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(rt.sv(f, "can_buckle")) && truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "user_buckle_mob", live(f.args[0]), live(f.args[1]))))) return f.dot;
	return 1;
}, true, { args: ["M", "user"] });

// /atom/movable/proc/has_buckled_mobs  (code/game/objects/buckling.dm:30)
rt.def("/atom/movable/proc/has_buckled_mobs", function has_buckled_mobs(f: Frame) {
	if (!truthy(rt.sv(f, "buckled_mobs"))) {
		return 0;
	}
	if (!truthy(rt.len(f, rt.sv(f, "buckled_mobs")))) return f.dot;
	return 1;
});

// /atom/movable/proc/buckle_mob  (code/game/objects/buckling.dm:37)  may sleep
rt.def("/atom/movable/proc/buckle_mob", function* buckle_mob(f: Frame, M: Value, force: Value, check_loc: Value) {
	f.vars = () => [M, force, check_loc];
	if (live(force) === null) {
		force = 0;
	}
	if (live(check_loc) === null) {
		check_loc = 1;
	}
	if (!truthy(rt.sv(f, "buckled_mobs"))) {
		rt.setSv(f, "buckled_mobs", rt.list());
	}
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return 0;
	}
	if ((truthy(live(check_loc)) && !isEqual(rt.fv(f, "loc", live(M)), rt.sv(f, "loc")))) {
		return 0;
	}
	if ((((((!truthy(rt.sv(f, "can_buckle")) && !truthy(live(force))) || truthy(rt.fv(f, "buckled", live(M)))) || rt.ge(rt.len(f, rt.sv(f, "buckled_mobs")), rt.sv(f, "max_buckled_mobs"))) || (truthy(rt.sv(f, "buckle_requires_restraints")) && !truthy((yield* g.callName(f, live(M), "restrained", []))))) || isEqual(live(M), live(f.src)))) {
		return 0;
	}
	if ((!truthy((yield* g.callName(f, live(M), "can_buckle", []))) && !truthy(live(force)))) {
		if (isEqual(live(M), live(f.usr))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>You are unable to buckle yourself to the ＀!</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>You are unable to buckle ＀ to the ＀!</span>", [live(M), live(f.src)])]);
		}
		return 0;
	}
	if ((truthy(rt.fv(f, "pulledby", live(M))) && truthy(rt.sv(f, "buckle_prevents_pull")))) {
		yield* g.callName(f, rt.fv(f, "pulledby", live(M)), "stop_pulling", []);
	}
	if ((!truthy(live(check_loc)) && !isEqual(rt.fv(f, "loc", live(M)), rt.sv(f, "loc")))) {
		yield* g.callName(f, live(M), "forceMove", [rt.sv(f, "loc")]);
	}
	rt.setFv(f, "buckled", live(M), live(f.src));
	yield* g.callName(f, live(M), "setDir", [rt.sv(f, "dir")]);
	(rt.modSrcVar(f, "buckled_mobs", live(M), rt.bitOr));
	yield* g.callName(f, live(M), "update_canmove", []);
	yield* g.callName(f, live(M), "throw_alert", [null, "buckled", null, T("/obj/screen/alert/restrained/buckled"), "new_master", live(f.src)], rt.Args.Named);
	yield* g.srcCall(f, "post_buckle_mob", live(M));
	return 1;
}, true);

// /obj/proc/buckle_mob  (code/game/objects/buckling.dm:71)  may sleep
rt.def("/obj/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "adjust_fire_stacks", [1]);
	yield* g.callName(f, live(f.args[0]), "IgniteMob", []);
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });

// /atom/movable/proc/unbuckle_mob  (code/game/objects/buckling.dm:78)  may sleep
rt.def("/atom/movable/proc/unbuckle_mob", function* unbuckle_mob(f: Frame, buckled_mob: Value, force: Value) {
	f.vars = () => [buckled_mob, force];
	if (live(force) === null) {
		force = 0;
	}
	if (!((truthy((rt.istype(live(buckled_mob), T("/mob/living")) ? 1 : 0)) && isEqual(rt.fv(f, "buckled", live(buckled_mob)), live(f.src))) && (truthy((yield* g.callName(f, live(buckled_mob), "can_unbuckle", []))) || truthy(live(force))))) return f.dot;
	f.dot = live(buckled_mob);
	rt.setFv(f, "buckled", live(buckled_mob), null);
	rt.setFv(f, "anchored", live(buckled_mob), rt.initial(f, live(buckled_mob), "anchored"));
	yield* g.callName(f, live(buckled_mob), "update_canmove", []);
	yield* g.callName(f, live(buckled_mob), "clear_alert", ["buckled"]);
	(rt.modSrcVar(f, "buckled_mobs", live(buckled_mob), subtract));
	yield* g.srcCall(f, "post_buckle_mob", live(f.dot));
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, {  }] });

// /atom/movable/proc/unbuckle_all_mobs  (code/game/objects/buckling.dm:89)  may sleep
rt.def("/atom/movable/proc/unbuckle_all_mobs", function* unbuckle_all_mobs(f: Frame, force: Value) {
	let m: Value = null;
	let $e: any;
	f.vars = () => [force, m, $e];
	if (live(force) === null) {
		force = 0;
	}
	if (!truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		return live(f.dot);
	}
	m = null;
	rt.forList(f, 0, rt.sv(f, "buckled_mobs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		m = $e;
		yield* g.srcCall(f, "unbuckle_mob", live(m), live(force));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /atom/movable/proc/user_buckle_mob  (code/game/objects/buckling.dm:102)  may sleep
rt.def("/atom/movable/proc/user_buckle_mob", function* user_buckle_mob(f: Frame, M: Value, user: Value, check_loc: Value) {
	f.vars = () => [M, user, check_loc];
	if (live(check_loc) === null) {
		check_loc = 1;
	}
	if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(user), live(f.src)])), 1) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "restrained", []))))) {
		return 0;
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	f.dot = (yield* g.callSrc(f, "buckle_mob", [null, live(M), "check_loc", live(check_loc)], rt.Args.Named));
	if (!truthy(live(f.dot))) return f.dot;
	if (isEqual(live(M), live(user))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ buckles ＀self to ＀.</span>", [live(M), (yield* g.callName(f, live(M), "p_them", [])), live(f.src)]), fmt("<span class='notice'>You buckle yourself to ＀.</span>", [live(f.src)]), "<span class='italics'>You hear metal clanking.</span>"]);
	} else {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ buckles ＀ to ＀!</span>", [live(user), live(M), live(f.src)]), fmt("<span class='warning'>＀ buckles you to ＀!</span>", [live(user), live(f.src)]), "<span class='italics'>You hear metal clanking.</span>"]);
	}
	return f.dot;
}, true);

// /atom/movable/proc/user_unbuckle_mob  (code/game/objects/buckling.dm:120)  may sleep
rt.def("/atom/movable/proc/user_unbuckle_mob", function* user_unbuckle_mob(f: Frame, buckled_mob: Value, user: Value) {
	let M: Value = null;
	f.vars = () => [buckled_mob, user, M];
	if (truthy((M = (yield* g.srcCall(f, "unbuckle_mob", live(buckled_mob)))))) {
		if (!isEqual(live(M), live(user))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ unbuckles ＀ from ＀.</span>", [live(user), live(M), live(f.src)]), fmt("<span class='notice'>＀ unbuckles you from ＀.</span>", [live(user), live(f.src)]), "<span class='italics'>You hear metal clanking.</span>"]);
		} else {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＀ unbuckles ＀self from ＀.</span>", [live(M), (yield* g.callName(f, live(M), "p_them", [])), live(f.src)]), fmt("<span class='notice'>You unbuckle yourself from ＀.</span>", [live(f.src)]), "<span class='italics'>You hear metal clanking.</span>"]);
		}
		yield* g.srcCall(f, "add_fingerprint", live(user));
	}
	return live(M);
}, true);
