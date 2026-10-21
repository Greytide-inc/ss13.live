// From code/game/objects/items/bodybag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9655, "/obj/item/bodybag", "/obj/item", {
	unfoldedbag_path: rt.typePath("/obj/structure/closet/body_bag"),
	w_class: 2,
	name: "body bag",
	desc: "A folded bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bodybag_folded",
});

// /obj/item/bodybag/proc/attack_self  (code/game/objects/items/bodybag.dm:11)  may sleep
rt.def("/obj/item/bodybag/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "deploy_bodybag", live(user), rt.fv(f, "loc", live(user)));
	return f.dot;
}, true);

// /obj/item/bodybag/proc/afterattack  (code/game/objects/items/bodybag.dm:15)  may sleep
rt.def("/obj/item/bodybag/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	f.vars = () => [target, user, proximity];
	if (!truthy(live(proximity))) return f.dot;
	if (!truthy((rt.istype(live(target), T("/turf/open")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "deploy_bodybag", live(user), live(target));
	return f.dot;
}, true);

// /obj/item/bodybag/proc/deploy_bodybag  (code/game/objects/items/bodybag.dm:19)  may sleep
rt.def("/obj/item/bodybag/proc/deploy_bodybag", function* deploy_bodybag(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	f.vars = () => [user, location, R];
	yield* g.callName(f, (R = (yield* g.new_(f, rt.sv(f, "unfoldedbag_path"), [live(location)]))), "open", [live(user)]);
	yield* g.callName(f, live(R), "add_fingerprint", [live(user)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9656, "/obj/item/bodybag/bluespace", "/obj/item/bodybag", {
	w_class: 2,
	origin_tech: "bluespace=4;materials=4;plasmatech=4",
	name: "bluespace body bag",
	desc: "A folded bluespace body bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bluebodybag_folded",
	unfoldedbag_path: rt.typePath("/obj/structure/closet/body_bag/bluespace"),
});

// /obj/item/bodybag/bluespace/proc/examine  (code/game/objects/items/bodybag.dm:37)
rt.def("/obj/item/bodybag/bluespace/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You can make out the shapes of ＀ objects through the fabric.</span>", [rt.len(f, rt.sv(f, "contents"))])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/bodybag/bluespace/proc/Destroy  (code/game/objects/items/bodybag.dm:42)  may sleep
rt.def("/obj/item/bodybag/bluespace/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<span class='notice'>You suddenly feel the space around you torn apart! You're free!</span>"]);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/bodybag/bluespace/proc/deploy_bodybag  (code/game/objects/items/bodybag.dm:49)  may sleep
rt.def("/obj/item/bodybag/bluespace/proc/deploy_bodybag", function* deploy_bodybag(f: Frame, user: Value, location: Value) {
	let R: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, location, R, A, $e];
	R = (yield* g.new_(f, rt.sv(f, "unfoldedbag_path"), [live(location)]));
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [live(R)]);
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<span class='notice'>You suddenly feel air around you! You're free!</span>"]);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(R), "open", [live(user)]);
	yield* g.callName(f, live(R), "add_fingerprint", [live(user)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/bodybag/bluespace/proc/container_resist  (code/game/objects/items/bodybag.dm:59)  may sleep
rt.def("/obj/item/bodybag/bluespace/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy((yield* g.callName(f, live(user), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't get out while you're restrained like this!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "changeNext_move", [100]);
	rt.setFv(f, "last_special", live(user), add(rt.worldTime(f), 100));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You claw at the fabric of ＀, trying to tear it open...</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='warning'>Someone starts trying to break free of ＀!</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 200, "target", live(f.src)], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='warning'>The pressure subsides. It seems that they've stopped resisting...</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "loc"), "visible_message", [fmt("<span class='warning'>＀ suddenly appears in front of ＀!</span>", [live(user), rt.sv(f, "loc")]), fmt("<span class='userdanger'>＀ breaks free of ＀!</span>", [live(user), live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
