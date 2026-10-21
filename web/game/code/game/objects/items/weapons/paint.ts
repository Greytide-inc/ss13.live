// From code/game/objects/items/weapons/paint.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7320, "/obj/item/weapon/paint/anycolor", "/obj/item/weapon/paint", {
	gender: "plural",
	name: "any color",
	icon_state: "paint_neutral",
});

// /obj/item/weapon/paint/anycolor/proc/attack_self  (code/game/objects/items/weapons/paint.dm:60)  may sleep
rt.def("/obj/item/weapon/paint/anycolor/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let t1: Value = null;
	let $0: any;
	f.vars = () => [user, t1, $0];
	t1 = (yield* g.op(f, "Prompt", [0], [null, "Locking Computer", "Please select a color:", live(user), rt.list("red", "blue", "green", "yellow", "violet", "black", "white")]));
	if (((!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(f.src)) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "restrained", []))))) {
		return live(f.dot);
	}
	$0 = live(t1);
	if ($0 === "red") {
		rt.setSv(f, "item_color", "C73232");
	} else if ($0 === "blue") {
		rt.setSv(f, "item_color", "5998FF");
	} else if ($0 === "green") {
		rt.setSv(f, "item_color", "2A9C3B");
	} else if ($0 === "yellow") {
		rt.setSv(f, "item_color", "CFB52B");
	} else if ($0 === "violet") {
		rt.setSv(f, "item_color", "AE4CCD");
	} else if ($0 === "white") {
		rt.setSv(f, "item_color", "FFFFFF");
	} else if ($0 === "black") {
		rt.setSv(f, "item_color", "333333");
	}
	rt.setSv(f, "icon_state", fmt("paint_＀", [live(t1)]));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

rt.type(7312, "/obj/item/weapon/paint", "/obj/item/weapon", {
	paintleft: 10,
	gender: "plural",
	name: "paint",
	desc: "Used to recolor floors and walls. Can be removed by the janitor.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "paint_neutral",
	item_color: "FFFFFF",
	item_state: "paintcan",
	w_class: 3,
	resistance_flags: 4,
	obj_integrity: 100,
	max_integrity: 100,
});

// /obj/item/weapon/paint/proc/afterattack  (code/game/objects/items/weapons/paint.dm:83)
rt.def("/obj/item/weapon/paint/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let newcolor: Value = null;
	f.vars = () => [newcolor];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (rt.le(rt.sv(f, "paintleft"), 0)) {
		rt.setSv(f, "icon_state", "paint_empty");
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(target), T("/turf")) ? 1 : 0)) || truthy((rt.istype(live(target), T("/turf/open/space")) ? 1 : 0)))) {
		return live(f.dot);
	}
	newcolor = add("#", rt.sv(f, "item_color"));
	rt.callName(f, live(target), "add_atom_colour", [live(newcolor), 3]);
	return f.dot;
});

rt.type(7321, "/obj/item/weapon/paint/paint_remover", "/obj/item/weapon/paint", {
	gender: "plural",
	name: "paint remover",
	desc: "Used to remove color from floors and walls.",
	icon_state: "paint_neutral",
});

// /obj/item/weapon/paint/paint_remover/proc/afterattack  (code/game/objects/items/weapons/paint.dm:99)
rt.def("/obj/item/weapon/paint/paint_remover/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(target), T("/turf")) ? 1 : 0)) && !isEqual(rt.fv(f, "color", live(target)), rt.initial(f, live(target), "color")))) return f.dot;
	rt.callName(f, live(target), "remove_atom_colour", [3]);
	return f.dot;
});
