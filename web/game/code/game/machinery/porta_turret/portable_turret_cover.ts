// From code/game/machinery/porta_turret/portable_turret_cover.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10871, "/obj/machinery/porta_turret_cover", "/obj/machinery", {
	parent_turret: null,
	anchored: 1,
	name: "turret",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turretCover",
	layer: 3.6,
	density: 0,
	obj_integrity: 80,
	max_integrity: 80,
});

// /obj/machinery/porta_turret_cover/proc/Destroy  (code/game/machinery/porta_turret/portable_turret_cover.dm:19)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "parent_turret"))) {
		rt.setFv(f, "cover", rt.sv(f, "parent_turret"), null);
		rt.setFv(f, "invisibility", rt.sv(f, "parent_turret"), 0);
		rt.setSv(f, "parent_turret", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/porta_turret_cover/proc/attack_ai  (code/game/machinery/porta_turret/portable_turret_cover.dm:29)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attack_ai", function* attack_ai(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	return (yield* g.callName(f, rt.sv(f, "parent_turret"), "attack_ai", [live(f.args[0])]));
}, true, { args: ["user"] });

// /obj/machinery/porta_turret_cover/proc/attack_hand  (code/game/machinery/porta_turret/portable_turret_cover.dm:37)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	return (yield* g.callName(f, rt.sv(f, "parent_turret"), "attack_hand", [live(f.args[0])]));
}, true, { args: ["user"] });

// /obj/machinery/porta_turret_cover/proc/attackby  (code/game/machinery/porta_turret/portable_turret_cover.dm:45)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	let $0: any, $1: any;
	f.vars = () => [M, $0, $1];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.fv(f, "on", rt.sv(f, "parent_turret"))))) {
		if (truthy(rt.fv(f, "raised", rt.sv(f, "parent_turret")))) {
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "anchored", rt.sv(f, "parent_turret")))) {
			rt.setFv(f, "anchored", rt.sv(f, "parent_turret"), 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the exterior bolts on the turret.</span>"]);
			rt.setFv(f, "invisibility", rt.sv(f, "parent_turret"), 0);
			yield* g.callName(f, rt.sv(f, "parent_turret"), "update_icon", []);
		} else {
			rt.setFv(f, "anchored", rt.sv(f, "parent_turret"), 0);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the exterior bolts on the turret.</span>"]);
			rt.setFv(f, "invisibility", rt.sv(f, "parent_turret"), 100);
			yield* g.callName(f, rt.sv(f, "parent_turret"), "update_icon", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
			if (truthy((yield* g.callName(f, rt.sv(f, "parent_turret"), "allowed", [live(f.args[1])])))) {
				rt.setFv(f, "locked", rt.sv(f, "parent_turret"), (!truthy(rt.fv(f, "locked", rt.sv(f, "parent_turret"))) ? 1 : 0));
				$0 = live(f.args[1]);
				if (truthy(rt.fv(f, "locked", rt.sv(f, "parent_turret")))) {
					$1 = "locked";
				} else {
					$1 = "unlocked";
				}
				yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Controls are now ＀.</span>", [$1])]);
				yield* g.srcCall(f, "updateUsrDialog");
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Access denied.</span>"]);
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0)) && !truthy(rt.fv(f, "locked", rt.sv(f, "parent_turret"))))) {
				rt.setFv(f, "buffer", (M = live(f.args[0])), rt.sv(f, "parent_turret"));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to multitool buffer.</span>", [rt.sv(f, "parent_turret")])]);
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/porta_turret_cover/proc/attacked_by  (code/game/machinery/porta_turret/portable_turret_cover.dm:76)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	f.vars = () => [I, user];
	yield* g.callName(f, rt.sv(f, "parent_turret"), "attacked_by", [live(I), live(user)]);
	return f.dot;
}, true);

// /obj/machinery/porta_turret_cover/proc/attack_alien  (code/game/machinery/porta_turret/portable_turret_cover.dm:79)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "parent_turret"), "attack_alien", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/porta_turret_cover/proc/attack_animal  (code/game/machinery/porta_turret/portable_turret_cover.dm:82)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "parent_turret"), "attack_animal", [live(user)]);
	return f.dot;
}, true);

// /obj/machinery/porta_turret_cover/proc/attack_hulk  (code/game/machinery/porta_turret/portable_turret_cover.dm:85)  may sleep
rt.def("/obj/machinery/porta_turret_cover/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	return (yield* g.callName(f, rt.sv(f, "parent_turret"), "attack_hulk", [live(user)]));
}, true);

// /obj/machinery/porta_turret_cover/proc/emag_act  (code/game/machinery/porta_turret/portable_turret_cover.dm:91)
rt.def("/obj/machinery/porta_turret_cover/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.fv(f, "emagged", rt.sv(f, "parent_turret")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You short out ＀'s threat assessment circuits.</span>", [rt.sv(f, "parent_turret")])]);
	rt.callSrc(f, "visible_message", [fmt("＀ hums oddly...", [rt.sv(f, "parent_turret")])]);
	rt.setFv(f, "emagged", rt.sv(f, "parent_turret"), 1);
	rt.setFv(f, "on", rt.sv(f, "parent_turret"), 0);
	rt.spawnTail(f, 40, "/obj/machinery/porta_turret_cover/proc/emag_act: spawn at game/machinery/porta_turret/portable_turret_cover.dm:96", user);
	return f.dot;
});

// a spawn(40) body of /obj/machinery/porta_turret_cover/proc/emag_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret_cover/proc/emag_act: spawn at game/machinery/porta_turret/portable_turret_cover.dm:96", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setFv(f, "on", rt.sv(f, "parent_turret"), 1);
	return null;
});
