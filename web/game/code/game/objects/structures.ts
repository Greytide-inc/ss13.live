// From code/game/objects/structures.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12124, "/obj/structure", "/obj", {
	climb_time: 20,
	climb_stun: 20,
	climbable: 0,
	structureclimber: null,
	broken: 0,
	pressure_resistance: 8,
	icon: rt.rsc("icons/obj/structures.dmi"),
	obj_integrity: 300,
	max_integrity: 300,
});

// /obj/structure/proc/Initialize  (code/game/objects/structures.dm:13)
rt.def("/obj/structure/proc/Initialize", function Initialize(f: Frame) {
	if (!truthy(rt.sv(f, "armor"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "smooth"))) {
		rt.call(f, P("/proc/queue_smooth"), null, [live(f.src)]);
		rt.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
		rt.setSv(f, "icon_state", "");
	}
	if (!truthy(rt.gl("SSticker"))) return f.dot;
	rt.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src)]);
	return f.dot;
});

// /obj/structure/proc/Destroy  (code/game/objects/structures.dm:25)  may sleep
rt.def("/obj/structure/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.gl("SSticker"))) {
		yield* g.callName(f, rt.gl("cameranet"), "updateVisibility", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "smooth"))) {
		yield* g.call(f, P("/proc/queue_smooth_neighbors"), null, [live(f.src)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/proc/attack_hand  (code/game/objects/structures.dm:31)  may sleep
rt.def("/obj/structure/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	if ((truthy(rt.sv(f, "structureclimber")) && !isEqual(rt.sv(f, "structureclimber"), live(f.args[0])))) {
		yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
		yield* g.callName(f, live(f.args[0]), "do_attack_animation", [live(f.src)]);
		yield* g.callName(f, rt.sv(f, "structureclimber"), "Knockdown", [40]);
		yield* g.callName(f, rt.sv(f, "structureclimber"), "visible_message", [fmt("<span class='warning'>＀ has been knocked off the ＀", [rt.fv(f, "name", rt.sv(f, "structureclimber")), live(f.src)]), fmt("You're knocked off the ＀!", [live(f.src)]), fmt("You see ＀ get knocked off the ＀</span>", [rt.fv(f, "name", rt.sv(f, "structureclimber")), live(f.src)])]);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/structure/proc/interact  (code/game/objects/structures.dm:41)  may sleep
rt.def("/obj/structure/proc/interact", function* interact(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/structure/proc/ui_act  (code/game/objects/structures.dm:44)  may sleep
rt.def("/obj/structure/proc/ui_act", function* ui_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	return f.dot;
}, true, { args: ["action", "params"] });

// /obj/structure/proc/MouseDrop_T  (code/game/objects/structures.dm:48)  may sleep
rt.def("/obj/structure/proc/MouseDrop_T", function* MouseDrop_T(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "climbable"))) {
		return live(f.dot);
	}
	if ((isEqual(live(f.args[1]), live(f.args[0])) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) {
		if (truthy(rt.fv(f, "canmove", live(f.args[1])))) {
			yield* g.srcCall(f, "climb_structure", live(f.args[1]));
			return live(f.dot);
		}
	}
	if ((!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon")) ? 1 : 0)) || !isEqual((yield* g.callName(f, live(f.args[1]), "get_active_held_item", [])), live(f.args[0])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "loc", live(f.args[0])), rt.fv(f, "loc", live(f.src)))) {
		yield* g.call(f, P("/proc/step"), null, [live(f.args[0]), rt.getDir(f, live(f.args[0]), live(f.src))]);
	}
	return live(f.dot);
}, true, { args: ["O", "user"] });

// /obj/structure/proc/do_climb  (code/game/objects/structures.dm:68)  may sleep
rt.def("/obj/structure/proc/do_climb", function* do_climb(f: Frame, A: Value) {
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "climbable"))) return f.dot;
	rt.setSv(f, "density", 0);
	f.dot = (yield* g.call(f, P("/proc/step"), null, [live(A), rt.getDir(f, live(A), rt.fv(f, "loc", live(f.src)))]));
	rt.setSv(f, "density", 1);
	return f.dot;
}, true);

// /obj/structure/proc/climb_structure  (code/game/objects/structures.dm:72)  may sleep
rt.def("/obj/structure/proc/climb_structure", function* climb_structure(f: Frame, user: Value) {
	let adjusted_climb_time: Value = null;
	f.vars = () => [user, adjusted_climb_time];
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ starts climbing onto ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You start climbing onto ＀...</span>", [live(f.src)])]);
	adjusted_climb_time = rt.sv(f, "climb_time");
	if (truthy((yield* g.callName(f, live(user), "restrained", [])))) {
		(adjusted_climb_time = rt.modify(live(adjusted_climb_time), 2, multiply));
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/alien")) ? 1 : 0))) {
		(adjusted_climb_time = rt.modify(live(adjusted_climb_time), 0.25, multiply));
	}
	rt.setSv(f, "structureclimber", live(user));
	if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(user), live(adjusted_climb_time)])))) {
		if (truthy(rt.fv(f, "loc", live(f.src)))) {
			if (truthy((yield* g.srcCall(f, "do_climb", live(user))))) {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ climbs onto ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You climb onto ＀.</span>", [live(f.src)])]);
				yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(f.src), "climbed onto"]);
				if (truthy(rt.sv(f, "climb_stun"))) {
					yield* g.callName(f, live(user), "Stun", [rt.sv(f, "climb_stun")]);
				}
				f.dot = 1;
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to climb onto ＀.</span>", [live(f.src)])]);
			}
		}
	}
	rt.setSv(f, "structureclimber", null);
	return f.dot;
}, true);

// /obj/structure/proc/examine  (code/game/objects/structures.dm:95)
rt.def("/obj/structure/proc/examine", function examine(f: Frame) {
	let examine_status: Value = null;
	f.vars = () => [examine_status];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>It's on fire!</span>"]);
	}
	if (truthy(rt.sv(f, "broken"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It appears to be broken.</span>"]);
	}
	if (!truthy((examine_status = rt.callSrc(f, "examine_status", [live(f.args[0])])))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), live(examine_status)]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/proc/examine_status  (code/game/objects/structures.dm:106)
rt.def("/obj/structure/proc/examine_status", function examine_status(f: Frame, user: Value) {
	let healthpercent: Value = null;
	let $0: any;
	f.vars = () => [healthpercent, $0];
	$0 = (healthpercent = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100));
	if (rt.inRange($0, 50, 99)) {
		return "It looks slightly damaged.";
	} else if (rt.inRange($0, 25, 50)) {
		return "It appears heavily damaged.";
	} else if (rt.inRange($0, 0, 25)) {
		if (truthy(rt.sv(f, "broken"))) return f.dot;
		return "<span class='warning'>It's falling apart!</span>";
	}
	return f.dot;
});
