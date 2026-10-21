// From code/game/objects/items/shooting_range.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9777, "/obj/item/target", "/obj/item", {
	hp: 1800,
	pinnedLoc: null,
	name: "shooting target",
	desc: "A shooting target.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "target_h",
	density: 0,
});

// /obj/item/target/proc/Destroy  (code/game/objects/items/shooting_range.dm:11)  may sleep
rt.def("/obj/item/target/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "removeOverlays");
	if (truthy(rt.sv(f, "pinnedLoc"))) {
		yield* g.callName(f, rt.sv(f, "pinnedLoc"), "nullPinnedTarget", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/target/proc/removeOverlays  (code/game/objects/items/shooting_range.dm:21)
rt.def("/obj/item/target/proc/removeOverlays", function removeOverlays(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	return f.dot;
});

// /obj/item/target/proc/Move  (code/game/objects/items/shooting_range.dm:24)  may sleep
rt.def("/obj/item/target/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "pinnedLoc"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "pinnedLoc"), rt.sv(f, "loc"));
	return f.dot;
}, true);

// /obj/item/target/proc/attackby  (code/game/objects/items/shooting_range.dm:29)  may sleep
rt.def("/obj/item/target/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
			yield* g.srcCall(f, "removeOverlays");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slice off ＀'s uneven chunks of aluminium and scorch marks.</span>", [live(f.src)])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/target/proc/attack_hand  (code/game/objects/items/shooting_range.dm:39)  may sleep
rt.def("/obj/item/target/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy(rt.sv(f, "pinnedLoc"))) {
		yield* g.callName(f, rt.sv(f, "pinnedLoc"), "removeTarget", [live(f.args[0])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(9780, "/obj/item/target/clown", "/obj/item/target", {
	hp: 2000,
	icon_state: "target_c",
	desc: "A shooting target that looks like a useless clown.",
});

// /obj/item/target/clown/proc/bullet_act  (code/game/objects/items/shooting_range.dm:61)  may sleep
rt.def("/obj/item/target/clown/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
	return f.dot;
}, true, { args: ["P"] });

// /obj/item/target/proc/bullet_act  (code/game/objects/items/shooting_range.dm:65)  may sleep
rt.def("/obj/item/target/proc/bullet_act", function* bullet_act(f: Frame, _P: Value) {
	let p_x: Value = null, p_y: Value = null, decaltype: Value = null, C: Value = null, bullet_hole: Value = null;
	f.vars = () => [_P, p_x, p_y, decaltype, C, bullet_hole];
	p_x = add(rt.fv(f, "p_x", live(_P)), rt.op(f, "PickUnweighted", [7], [0, 0, 0, 0, 0, -1, 1]));
	p_y = add(rt.fv(f, "p_y", live(_P)), rt.op(f, "PickUnweighted", [7], [0, 0, 0, 0, 0, -1, 1]));
	decaltype = 1;
	if (truthy(rt.op(f, "IsType", [], [T("/obj/item/projectile/bullet"), live(_P)]))) {
		decaltype = 2;
	}
	if (((truthy((yield* g.callName(f, (C = (yield* g.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))), "GetPixel", [live(p_x), live(p_y)]))) && isEqual(rt.fv(f, "original", live(_P)), live(f.src))) && rt.le(rt.len(f, rt.sv(f, "overlays")), 35))) {
		(rt.modSrcVar(f, "hp", rt.fv(f, "damage", live(_P)), subtract));
		if (rt.le(rt.sv(f, "hp"), 0)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ breaks into tiny pieces and collapses!</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		rt.setFv(f, "pixel_x", (bullet_hole = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/effects/effects.dmi"), "scorch", 3.5]))), subtract(live(p_x), 1));
		rt.setFv(f, "pixel_y", live(bullet_hole), subtract(live(p_y), 1));
		if (isEqual(live(decaltype), 1)) {
			yield* g.callName(f, live(bullet_hole), "setDir", [rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
			if ((rt.ge(rt.fv(f, "damage", live(_P)), 20) || truthy((rt.istype(live(_P), T("/obj/item/projectile/beam/practice")) ? 1 : 0)))) {
				yield* g.callName(f, live(bullet_hole), "setDir", [rt.op(f, "PickUnweighted", [4], [1, 2, 4, 8])]);
			} else {
				rt.setFv(f, "icon_state", live(bullet_hole), "light_scorch");
			}
		} else {
			rt.setFv(f, "icon_state", live(bullet_hole), "dent");
		}
		yield* g.srcCall(f, "add_overlay", live(bullet_hole));
		return live(f.dot);
	}
	return -1;
}, true);
