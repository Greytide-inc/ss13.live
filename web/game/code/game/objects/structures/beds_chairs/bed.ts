// From code/game/objects/structures/beds_chairs/bed.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12244, "/obj/structure/bed", "/obj/structure", {
	buildstacktype: rt.typePath("/obj/item/stack/sheet/metal"),
	buildstackamount: 2,
	anchored: 1,
	can_buckle: 1,
	buckle_lying: 1,
	name: "bed",
	desc: "This is used to lie in, sleep in or strap on.",
	icon_state: "bed",
	icon: rt.rsc("icons/obj/objects.dmi"),
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
	integrity_failure: 30,
});

// /obj/structure/bed/proc/deconstruct  (code/game/objects/structures/beds_chairs/bed.dm:26)  may sleep
rt.def("/obj/structure/bed/proc/deconstruct", function* deconstruct(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(rt.sv(f, "buildstacktype"))) {
			yield* g.new_(f, rt.sv(f, "buildstacktype"), [rt.sv(f, "loc"), rt.sv(f, "buildstackamount")]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/structure/bed/proc/attack_paw  (code/game/objects/structures/beds_chairs/bed.dm:32)  may sleep
rt.def("/obj/structure/bed/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/bed/proc/attackby  (code/game/objects/structures/beds_chairs/bed.dm:35)  may sleep
rt.def("/obj/structure/bed/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		yield* g.srcCall(f, "deconstruct", 1);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(12247, "/obj/structure/bed/roller", "/obj/structure/bed", {
	foldabletype: rt.typePath("/obj/item/roller"),
	anchored: 0,
	name: "roller bed",
	icon: rt.rsc("icons/obj/rollerbed.dmi"),
	icon_state: "down",
	resistance_flags: 0,
});

// /obj/structure/bed/roller/proc/attackby  (code/game/objects/structures/beds_chairs/bed.dm:53)  may sleep
rt.def("/obj/structure/bed/roller/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/roller/robo")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "loaded", (R = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You already have a roller bed docked!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
			if (rt.gt(rt.len(f, rt.sv(f, "buckled_mobs")), 1)) {
				yield* g.srcCall(f, "unbuckle_all_mobs");
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ unbuckles all creatures from ＀.</span>", [live(f.args[1]), live(f.src)])]);
			} else {
				yield* g.srcCall(f, "user_unbuckle_mob", rt.index(rt.sv(f, "buckled_mobs"), 1), live(f.args[1]));
			}
		} else {
			rt.setFv(f, "loaded", live(R), live(f.src));
			yield* g.srcCall(f, "forceMove", live(R));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ collects ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You collect ＀.</span>", [live(f.src)])]);
		}
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/bed/roller/proc/MouseDrop  (code/game/objects/structures/beds_chairs/bed.dm:74)  may sleep
rt.def("/obj/structure/bed/roller/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(isEqual(live(f.args[0]), live(f.usr)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) return f.dot;
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (truthy((yield* g.srcCall(f, "has_buckled_mobs")))) {
		return 0;
	}
	if (truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't do that right now!</span>"]);
		return 0;
	}
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("＀ collapses ％！.", [live(f.usr), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You collapse ％！.</span>", [rt.fv(f, "name", live(f.src))])]);
	B = (yield* g.new_(f, rt.sv(f, "foldabletype"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(B)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

// /obj/structure/bed/roller/proc/post_buckle_mob  (code/game/objects/structures/beds_chairs/bed.dm:89)
rt.def("/obj/structure/bed/roller/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
		rt.setSv(f, "density", 1);
		rt.setSv(f, "icon_state", "up");
		rt.setFv(f, "pixel_y", live(M), rt.initial(f, live(M), "pixel_y"));
	} else {
		rt.setSv(f, "density", 0);
		rt.setSv(f, "icon_state", "down");
		rt.setFv(f, "pixel_x", live(M), rt.callName(f, live(M), "get_standard_pixel_x_offset", [rt.fv(f, "lying", live(M))]));
		rt.setFv(f, "pixel_y", live(M), rt.callName(f, live(M), "get_standard_pixel_y_offset", [rt.fv(f, "lying", live(M))]));
	}
	return f.dot;
});

rt.type(9875, "/obj/item/roller", "/obj/item", {
	w_class: 4,
	name: "roller bed",
	desc: "A collapsed roller bed that can be carried around.",
	icon: rt.rsc("icons/obj/rollerbed.dmi"),
	icon_state: "folded",
});

// /obj/item/roller/proc/attackby  (code/game/objects/structures/beds_chairs/bed.dm:108)  may sleep
rt.def("/obj/item/roller/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/roller/robo")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "loaded", (R = live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ already has a roller bed loaded!</span>", [live(R)])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ loads ＀.</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You load ＀ into ＀.</span>", [live(f.src), live(R)])]);
		rt.setFv(f, "loaded", live(R), (yield* g.new_(f, T("/obj/structure/bed/roller"), [live(R)])));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/roller/proc/attack_self  (code/game/objects/structures/beds_chairs/bed.dm:120)  may sleep
rt.def("/obj/item/roller/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "deploy_roller", live(user), rt.fv(f, "loc", live(user)));
	return f.dot;
}, true);

// /obj/item/roller/proc/afterattack  (code/game/objects/structures/beds_chairs/bed.dm:123)  may sleep
rt.def("/obj/item/roller/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	f.vars = () => [target, user, proximity];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(target), T("/turf/open")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "deploy_roller", live(user), live(target));
	return f.dot;
}, true);

// /obj/item/roller/proc/deploy_roller  (code/game/objects/structures/beds_chairs/bed.dm:129)  may sleep
rt.def("/obj/item/roller/proc/deploy_roller", function* deploy_roller(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	f.vars = () => [user, location, R];
	yield* g.callName(f, (R = (yield* g.new_(f, T("/obj/structure/bed/roller"), [live(location)]))), "add_fingerprint", [live(user)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9876, "/obj/item/roller/robo", "/obj/item/roller", {
	loaded: null,
	name: "roller bed dock",
});

// /obj/item/roller/robo/proc/New  (code/game/objects/structures/beds_chairs/bed.dm:138)  may sleep
rt.def("/obj/item/roller/robo/proc/New", function* New(f: Frame) {
	rt.setSv(f, "loaded", (yield* g.new_(f, T("/obj/structure/bed/roller"), [live(f.src)])));
	rt.setSv(f, "desc", "A collapsed roller bed that can be ejected for emergency use. Must be collected or replaced after use.");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/roller/robo/proc/examine  (code/game/objects/structures/beds_chairs/bed.dm:143)
rt.def("/obj/item/roller/robo/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "loaded"))) {
		$1 = "loaded";
	} else {
		$1 = "empty";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The dock is ＀", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/roller/robo/proc/deploy_roller  (code/game/objects/structures/beds_chairs/bed.dm:148)
rt.def("/obj/item/roller/robo/proc/deploy_roller", function deploy_roller(f: Frame, user: Value, location: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy(rt.sv(f, "loaded"))) {
		rt.setFv(f, "loc", (R = rt.sv(f, "loaded")), live(location));
		rt.callName(f, live(user), "visible_message", [fmt("＀ deploys ＀.", [live(user), rt.sv(f, "loaded")]), fmt("<span class='notice'>You deploy ＀.</span>", [rt.sv(f, "loaded")])]);
		rt.setSv(f, "loaded", null);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The dock is empty!</span>"]);
	}
	return f.dot;
});

rt.type(12248, "/obj/structure/bed/dogbed", "/obj/structure/bed", {
	owner: null,
	anchored: 0,
	buildstacktype: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	buildstackamount: 10,
	name: "dog bed",
	icon_state: "dogbed",
	desc: "A comfy-looking dog bed. You can even strap your pet in, in case the gravity turns off.",
});

// /obj/structure/bed/dogbed/proc/update_owner  (code/game/objects/structures/beds_chairs/bed.dm:167)
rt.def("/obj/structure/bed/dogbed/proc/update_owner", function update_owner(f: Frame, M: Value) {
	rt.setSv(f, "owner", live(M));
	rt.setSv(f, "name", fmt("＀'s bed", [live(M)]));
	rt.setSv(f, "desc", fmt("＀'s bed! Looks comfy.", [live(M)]));
	return f.dot;
});

// /obj/structure/bed/dogbed/proc/buckle_mob  (code/game/objects/structures/beds_chairs/bed.dm:172)  may sleep
rt.def("/obj/structure/bed/dogbed/proc/buckle_mob", function* buckle_mob(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_owner", live(f.args[0]));
	return f.dot;
}, true, { args: ["M", "force", "check_loc"] });
