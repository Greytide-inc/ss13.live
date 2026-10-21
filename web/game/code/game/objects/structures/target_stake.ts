// From code/game/objects/structures/target_stake.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12880, "/obj/structure/target_stake", "/obj/structure", {
	pinned_target: null,
	flags: 64,
	name: "target stake",
	desc: "A thin platform with negatively-magnetized wheels.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "target_stake",
	density: 1,
});

// /obj/structure/target_stake/proc/Destroy  (code/game/objects/structures/target_stake.dm:12)  may sleep
rt.def("/obj/structure/target_stake/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "pinned_target"))) {
		yield* g.callName(f, rt.sv(f, "pinned_target"), "nullPinnedLoc", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/target_stake/proc/nullPinnedTarget  (code/game/objects/structures/target_stake.dm:16)
rt.def("/obj/structure/target_stake/proc/nullPinnedTarget", function nullPinnedTarget(f: Frame) {
	rt.setSv(f, "pinned_target", null);
	return f.dot;
});

// /obj/structure/target_stake/proc/Move  (code/game/objects/structures/target_stake.dm:19)  may sleep
rt.def("/obj/structure/target_stake/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "pinned_target"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "pinned_target"), rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/structure/target_stake/proc/attackby  (code/game/objects/structures/target_stake.dm:26)  may sleep
rt.def("/obj/structure/target_stake/proc/attackby", function* attackby(f: Frame, _T: Value, user: Value) {
	f.vars = () => [_T, user];
	if (truthy(rt.sv(f, "pinned_target"))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(_T), T("/obj/item/target")) ? 1 : 0)) && truthy((yield* g.callName(f, live(user), "drop_item", []))))) return f.dot;
	rt.setSv(f, "pinned_target", live(_T));
	rt.setFv(f, "pinnedLoc", live(_T), live(f.src));
	rt.setFv(f, "density", live(_T), 1);
	rt.setFv(f, "layer", live(_T), 3.009999990463257);
	rt.setFv(f, "loc", live(_T), rt.sv(f, "loc"));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You slide the target into the stake.</span>"]);
	return f.dot;
}, true);

// /obj/structure/target_stake/proc/attack_hand  (code/game/objects/structures/target_stake.dm:36)  may sleep
rt.def("/obj/structure/target_stake/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "pinned_target"))) return f.dot;
	yield* g.srcCall(f, "removeTarget", live(user));
	return f.dot;
}, true);

// /obj/structure/target_stake/proc/removeTarget  (code/game/objects/structures/target_stake.dm:39)  may sleep
rt.def("/obj/structure/target_stake/proc/removeTarget", function* removeTarget(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setFv(f, "layer", rt.sv(f, "pinned_target"), 3);
	rt.setFv(f, "loc", rt.sv(f, "pinned_target"), rt.fv(f, "loc", live(user)));
	yield* g.callName(f, rt.sv(f, "pinned_target"), "nullPinnedLoc", []);
	yield* g.srcCall(f, "nullPinnedTarget");
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(user), "get_active_held_item", [])))) {
			yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "pinned_target")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You take the target out of the stake.</span>"]);
		}
	} else {
		rt.setFv(f, "loc", rt.sv(f, "pinned_target"), rt.getStep(f, live(user), 0));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You take the target out of the stake.</span>"]);
	}
	return f.dot;
}, true);

// /obj/structure/target_stake/proc/bullet_act  (code/game/objects/structures/target_stake.dm:53)  may sleep
rt.def("/obj/structure/target_stake/proc/bullet_act", function* bullet_act(f: Frame) {
	if (truthy(rt.sv(f, "pinned_target"))) {
		yield* g.callName(f, rt.sv(f, "pinned_target"), "bullet_act", [live(f.args[0])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["P"] });
