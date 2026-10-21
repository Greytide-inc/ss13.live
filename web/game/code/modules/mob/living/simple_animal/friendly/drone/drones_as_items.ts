// From code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10123, "/obj/item/drone_shell", "/obj/item", {
	drone_type: rt.typePath("/mob/living/simple_animal/drone"),
	origin_tech: "programming=2;biotech=4",
	name: "drone shell",
	desc: "A shell of a maintenance drone, an expendable robot built to perform station repairs.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_hat",
});

// /obj/item/drone_shell/proc/New  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:20)  may sleep
rt.def("/obj/item/drone_shell/proc/New", function* New(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("A drone shell has been created in ％！.", [rt.fv(f, "name", live(A))]), "source", live(f.src), "action", "attack", "flashwindow", 0], rt.Args.Named);
	}
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, true);

// /obj/item/drone_shell/proc/Destroy  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:27)  may sleep
rt.def("/obj/item/drone_shell/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/drone_shell/proc/attack_ghost  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:31)  may sleep
rt.def("/obj/item/drone_shell/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let be_drone: Value = null, D: Value = null;
	f.vars = () => [user, be_drone, D];
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), "drone"])))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Can't become a drone before the game has started."]);
		return live(f.dot);
	}
	if (((isEqual((be_drone = (yield* g.call(f, P("/proc/alert"), null, ["Become a drone? (Warning, You can no longer be cloned!)", null, "Yes", "No"]))), "No") || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || !truthy((rt.istype(live(user), T("/mob/dead/observer")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.setFv(f, "admin_spawned", (D = (yield* g.new_(f, rt.sv(f, "drone_type"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))), rt.sv(f, "admin_spawned"));
	rt.setFv(f, "key", live(D), rt.fv(f, "key", live(user)));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8201, "/obj/item/clothing/head/drone_holder", "/obj/item/clothing/head", {
	drone: null,
	name: "drone (hiding)",
	desc: "This drone is scared and has curled up into a ball.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_hat",
});

// /obj/item/clothing/head/drone_holder/proc/uncurl  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:60)  may sleep
rt.def("/obj/item/clothing/head/drone_holder/proc/uncurl", function* uncurl(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "drone"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [(L = rt.sv(f, "loc")), fmt("<span class='warning'>＀ is trying to escape!</span>", [rt.sv(f, "drone")])]);
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, rt.sv(f, "drone"), null, 50, "target", live(L)], rt.Args.Named)))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(L), "dropItemToGround", [live(f.src)]);
	}
	(rt.modSrcVar(f, "contents", rt.sv(f, "drone"), subtract));
	rt.setFv(f, "loc", rt.sv(f, "drone"), rt.getStep(f, live(f.src), 0));
	yield* g.callName(f, rt.sv(f, "drone"), "reset_perspective", []);
	yield* g.callName(f, rt.sv(f, "drone"), "setDir", [2]);
	yield* g.callName(f, rt.sv(f, "drone"), "visible_message", [fmt("<span class='warning'>＀ uncurls!</span>", [rt.sv(f, "drone")])]);
	rt.setSv(f, "drone", null);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/clothing/head/drone_holder/proc/relaymove  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:80)  may sleep
rt.def("/obj/item/clothing/head/drone_holder/proc/relaymove", function* relaymove(f: Frame) {
	yield* g.srcCall(f, "uncurl");
	return f.dot;
}, true);

// /obj/item/clothing/head/drone_holder/proc/container_resist  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:83)  may sleep
rt.def("/obj/item/clothing/head/drone_holder/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "uncurl");
	return f.dot;
}, true);

// /obj/item/clothing/head/drone_holder/proc/updateVisualAppearence  (code/modules/mob/living/simple_animal/friendly/drone/drones_as_items.dm:87)
rt.def("/obj/item/clothing/head/drone_holder/proc/updateVisualAppearence", function updateVisualAppearence(f: Frame, D: Value) {
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	rt.setSv(f, "icon_state", fmt("＀_hat", [rt.fv(f, "visualAppearence", live(D))]));
	f.dot = rt.sv(f, "icon_state");
	return f.dot;
});
