// From code/_onclick/hud/drones.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(70, "/datum/hud/dextrous/drone", "/datum/hud/dextrous", {});

// /datum/hud/dextrous/drone/proc/New  (code/_onclick/hud/drones.dm:2)  may sleep
rt.def("/datum/hud/dextrous/drone/proc/New", function* New(f: Frame) {
	let inv_box: Value = null, inv: Value = null;
	let $e: any;
	f.vars = () => [inv_box, inv, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = rt.rsc("icons/mob/screen_midnight.dmi");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	inv_box = null;
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "internal storage");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "suit_storage");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-2:14,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 20);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	rt.setFv(f, "name", (inv_box = (yield* g.new_(f, T("/obj/screen/inventory"), []))), "head/mask");
	rt.setFv(f, "icon", live(inv_box), live(f.args[1]));
	rt.setFv(f, "icon_state", live(inv_box), "mask");
	rt.setFv(f, "screen_loc", live(inv_box), "CENTER-3:14,SOUTH:5");
	rt.setFv(f, "slot_id", live(inv_box), 11);
	rt.modSrcVar(f, "static_inventory", live(inv_box), add);
	inv = null;
	rt.forList(f, 0, add(rt.sv(f, "static_inventory"), rt.sv(f, "toggleable_inventory")), T("/obj/screen/inventory"));
	while (($e = rt.next(f, 0)) !== undefined) {
		inv = $e;
		if (truthy(rt.fv(f, "slot_id", live(inv)))) {
			rt.setFv(f, "hud", live(inv), live(f.src));
			rt.setAt(rt.sv(f, "inv_slots"), rt.fv(f, "slot_id", live(inv)), live(inv));
			yield* g.callName(f, live(inv), "update_icon", []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["owner", "ui_style"] });

// /datum/hud/dextrous/drone/proc/persistent_inventory_update  (code/_onclick/hud/drones.dm:31)
rt.def("/datum/hud/dextrous/drone/proc/persistent_inventory_update", function persistent_inventory_update(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	if (!truthy(rt.sv(f, "mymob"))) {
		return live(f.dot);
	}
	D = rt.sv(f, "mymob");
	if (truthy(rt.sv(f, "hud_shown"))) {
		if (truthy(rt.fv(f, "internal_storage", live(D)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "internal_storage", live(D)), "CENTER-2:14,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(D)), "screen", rt.fv(f, "internal_storage", live(D)), add);
		}
		if (truthy(rt.fv(f, "head", live(D)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "head", live(D)), "CENTER-3:14,SOUTH:5");
			rt.modField(f, rt.fv(f, "client", live(D)), "screen", rt.fv(f, "head", live(D)), add);
		}
	} else {
		if (truthy(rt.fv(f, "internal_storage", live(D)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "internal_storage", live(D)), null);
		}
		if (truthy(rt.fv(f, "head", live(D)))) {
			rt.setFv(f, "screen_loc", rt.fv(f, "head", live(D)), null);
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});
