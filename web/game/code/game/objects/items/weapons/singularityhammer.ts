// From code/game/objects/items/weapons/singularityhammer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5622, "/obj/item/weapon/twohanded/singularityhammer", "/obj/item/weapon/twohanded", {
	charged: 5,
	flags: 64,
	throw_range: 1,
	name: "singularity hammer",
	desc: "The pinnacle of close combat technology, the hammer harnesses the power of a miniaturized singularity to deal crushing blows.",
	icon_state: "mjollnir0",
	slot_flags: 1024,
	force: 5,
	force_unwielded: 5,
	force_wielded: 20,
	throwforce: 15,
	w_class: 5,
	origin_tech: "combat=4;bluespace=4;plasmatech=7",
	armor: null,
	resistance_flags: 34,
	force_string: "LORD SINGULOTH HIMSELF",
});

// /obj/item/weapon/twohanded/singularityhammer/proc/<init>  (code/game/objects/items/weapons/singularityhammer.dm:15)
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 50, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/weapon/twohanded/singularityhammer/proc/New  (code/game/objects/items/weapons/singularityhammer.dm:20)  may sleep
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/singularityhammer/proc/Destroy  (code/game/objects/items/weapons/singularityhammer.dm:24)  may sleep
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/twohanded/singularityhammer/proc/process  (code/game/objects/items/weapons/singularityhammer.dm:28)
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/process", function process(f: Frame) {
	if (rt.lt(rt.sv(f, "charged"), 5)) {
		rt.incSrcVar(f, "charged", 1, true);
	}
	return live(f.dot);
}, false, { waitfor: false });

// /obj/item/weapon/twohanded/singularityhammer/proc/update_icon  (code/game/objects/items/weapons/singularityhammer.dm:33)
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("mjollnir＀", [rt.sv(f, "wielded")]));
	return live(f.dot);
});

// /obj/item/weapon/twohanded/singularityhammer/proc/vortex  (code/game/objects/items/weapons/singularityhammer.dm:37)  may sleep
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/vortex", function* vortex(f: Frame, pull: Value, wielder: Value) {
	let X: Value = null, A: Value = null, H: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [pull, wielder, X, A, H, M, $e];
	X = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [5, live(pull)])), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy((rt.istype(live(X), T("/atom/movable")) ? 1 : 0))) {
			if (isEqual((A = live(X)), live(wielder))) {
				continue;
			}
			if (((truthy(live(A)) && !truthy(rt.fv(f, "anchored", live(A)))) && !truthy((rt.istype(live(X), T("/mob/living/carbon/human")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/step_towards"), null, [live(A), live(pull)]);
				yield* g.call(f, P("/proc/step_towards"), null, [live(A), live(pull)]);
				yield* g.call(f, P("/proc/step_towards"), null, [live(A), live(pull)]);
			} else {
				if (truthy((rt.istype(live(X), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if (truthy((rt.istype(rt.gv(f, "shoes", (H = live(X))), T("/obj/item/clothing/shoes/magboots")) ? 1 : 0))) {
						if (truthy(rt.gv(f, "magpulse", (M = rt.fv(f, "shoes", live(H)))))) {
							continue;
						}
					}
					yield* g.callName(f, live(H), "apply_effect", [20, "knockdown", 0]);
					yield* g.call(f, P("/proc/step_towards"), null, [live(H), live(pull)]);
					yield* g.call(f, P("/proc/step_towards"), null, [live(H), live(pull)]);
					yield* g.call(f, P("/proc/step_towards"), null, [live(H), live(pull)]);
				}
			}
		}
	}
	rt.endFor(f, 0);
	return live(f.dot);
}, true);

// /obj/item/weapon/twohanded/singularityhammer/proc/afterattack  (code/game/objects/items/weapons/singularityhammer.dm:59)  may sleep
rt.def("/obj/item/weapon/twohanded/singularityhammer/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let Z: Value = null, target: Value = null;
	f.vars = () => [A, user, proximity, Z, target];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	if (!isEqual(rt.sv(f, "charged"), 5)) return f.dot;
	rt.setSv(f, "charged", 0);
	if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, (Z = live(A)), "take_bodypart_damage", [20, 0]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/marauder.ogg"), 50, 1]);
	yield* g.srcCall(f, "vortex", (target = rt.getStep(f, live(A), 0)), live(user));
	return f.dot;
}, true);

rt.type(5623, "/obj/item/weapon/twohanded/mjollnir", "/obj/item/weapon/twohanded", {
	flags: 64,
	throw_range: 7,
	name: "Mjolnir",
	desc: "A weapon worthy of a god, able to strike with the force of a lightning bolt. It crackles with barely contained energy.",
	icon_state: "mjollnir0",
	slot_flags: 1024,
	force: 5,
	force_unwielded: 5,
	force_wielded: 25,
	throwforce: 30,
	w_class: 5,
	origin_tech: "combat=4;powerstorage=7",
});

// /obj/item/weapon/twohanded/mjollnir/proc/shock  (code/game/objects/items/weapons/singularityhammer.dm:85)  may sleep
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/shock", function* shock(f: Frame, target: Value) {
	let s: Value = null, throw_target: Value = null;
	f.vars = () => [target, s, throw_target];
	yield* g.callName(f, live(target), "Stun", [60]);
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/lightning_spread"), []))), "set_up", [5, 1, rt.fv(f, "loc", live(target))]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.callName(f, live(target), "visible_message", [fmt("<span class='danger'>＀ was shocked by ＀!</span>", [rt.fv(f, "name", live(target)), live(f.src)]), "<span class='userdanger'>You feel a powerful shock course through your body sending you flying!</span>", "<span class='italics'>You hear a heavy electrical crack!</span>"]);
	throw_target = (yield* g.call(f, P("/proc/get_edge_target_turf"), null, [live(target), rt.getDir(f, live(f.src), (yield* g.call(f, P("/proc/get_step_away"), null, [live(target), live(f.src)])))]));
	yield* g.callName(f, live(target), "throw_at", [live(throw_target), 200, 4]);
	return live(f.dot);
}, true);

// /obj/item/weapon/twohanded/mjollnir/proc/attack  (code/game/objects/items/weapons/singularityhammer.dm:97)  may sleep
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/attack", function* attack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 50, 1]);
	yield* g.srcCall(f, "shock", live(f.args[0]));
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/twohanded/mjollnir/proc/throw_impact  (code/game/objects/items/weapons/singularityhammer.dm:103)  may sleep
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/throw_impact", function* throw_impact(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "shock", live(f.args[0]));
	return f.dot;
}, true, { args: ["target"], waitfor: false });

// /obj/item/weapon/twohanded/mjollnir/proc/update_icon  (code/game/objects/items/weapons/singularityhammer.dm:108)
rt.def("/obj/item/weapon/twohanded/mjollnir/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("mjollnir＀", [rt.sv(f, "wielded")]));
	return live(f.dot);
});
