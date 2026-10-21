// From code/modules/hydroponics/beekeeping/honeycomb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6497, "/obj/item/weapon/reagent_containers/honeycomb", "/obj/item/weapon/reagent_containers", {
	honey_color: "",
	name: "honeycomb",
	desc: "A hexagonal mesh of honeycomb.",
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	icon_state: "honeycomb",
	possible_transfer_amounts: null,
	spillable: 0,
	disease_amount: 0,
	volume: 10,
	amount_per_transfer_from_this: 0,
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/honeycomb/proc/<init>  (code/modules/hydroponics/beekeeping/honeycomb.dm:7)
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_transfer_amounts", rt.list());
	rt.setSv(f, "list_reagents", rt.alist(f, ["honey", 5]));
	return f.dot;
});

// /obj/item/weapon/reagent_containers/honeycomb/proc/New  (code/modules/hydroponics/beekeeping/honeycomb.dm:16)  may sleep
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [8, -8])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [8, -8])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/honeycomb/proc/update_icon  (code/modules/hydroponics/beekeeping/honeycomb.dm:23)
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/update_icon", function update_icon(f: Frame) {
	let honey_overlay: Value = null;
	f.vars = () => [honey_overlay];
	rt.callSrc(f, "cut_overlays", []);
	honey_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "honey"]);
	if (truthy(rt.sv(f, "honey_color"))) {
		rt.setFv(f, "icon_state", live(honey_overlay), "greyscale_honey");
		rt.setFv(f, "color", live(honey_overlay), rt.sv(f, "honey_color"));
	}
	rt.callSrc(f, "add_overlay", [live(honey_overlay)]);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/honeycomb/proc/set_reagent  (code/modules/hydroponics/beekeeping/honeycomb.dm:32)  may sleep
rt.def("/obj/item/weapon/reagent_containers/honeycomb/proc/set_reagent", function* set_reagent(f: Frame, reagent: Value) {
	let R: Value = null;
	f.vars = () => [reagent, R];
	if (truthy((rt.istype((R = rt.index(rt.gl("chemical_reagents_list"), live(reagent))), T("/datum/reagent")) ? 1 : 0))) {
		rt.setSv(f, "name", fmt("honeycomb (＀)", [rt.fv(f, "name", live(R))]));
		rt.setSv(f, "honey_color", rt.fv(f, "color", live(R)));
		yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [rt.fv(f, "id", live(R)), 5]);
	} else {
		rt.setSv(f, "honey_color", "");
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);
