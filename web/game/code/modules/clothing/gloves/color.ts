// From code/modules/clothing/gloves/color.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7665, "/obj/item/clothing/gloves/color/fyellow", "/obj/item/clothing/gloves/color", {
	desc: "These gloves are cheap knockoffs of the coveted ones - no way this can end badly.",
	name: "budget insulated gloves",
	icon_state: "yellow",
	item_state: "ygloves",
	siemens_coefficient: 1,
	permeability_coefficient: 0.05,
	item_color: "yellow",
	resistance_flags: 0,
});

// /obj/item/clothing/gloves/color/fyellow/proc/New  (code/modules/clothing/gloves/color.dm:22)  may sleep
rt.def("/obj/item/clothing/gloves/color/fyellow/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "siemens_coefficient", rt.op(f, "PickUnweighted", [7], [0, 0.5, 0.5, 0.5, 0.5, 0.75, 1.5]));
	return f.dot;
}, true);

rt.type(7666, "/obj/item/clothing/gloves/color/black", "/obj/item/clothing/gloves/color", {
	can_be_cut: 1,
	desc: "These gloves are fire-resistant.",
	name: "black gloves",
	icon_state: "black",
	item_state: "blackgloves",
	item_color: "black",
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	resistance_flags: 0,
});

// /obj/item/clothing/gloves/color/black/proc/attackby  (code/modules/clothing/gloves/color.dm:45)  may sleep
rt.def("/obj/item/clothing/gloves/color/black/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "can_be_cut")) && isEqual(rt.sv(f, "icon_state"), rt.initial(f, live(f.src), "icon_state")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You snip the fingertips off of ＀.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.fv(f, "usesound", live(f.args[0])), (yield* g.call(f, P("/proc/rand"), null, [10, 50])), 1]);
			yield* g.new_(f, T("/obj/item/clothing/gloves/fingerless"), [rt.fv(f, "loc", live(f.args[1]))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(7683, "/obj/item/clothing/gloves/color/captain", "/obj/item/clothing/gloves/color", {
	desc: "Regal blue gloves, with a nice gold trim. Swanky.",
	name: "captain's gloves",
	icon_state: "captain",
	item_state: "egloves",
	item_color: "captain",
	siemens_coefficient: 0,
	permeability_coefficient: 0.05,
	cold_protection: 1536,
	min_cold_protection_temperature: 2,
	heat_protection: 1536,
	max_heat_protection_temperature: 1500,
	strip_delay: 60,
	armor: null,
});

// /obj/item/clothing/gloves/color/captain/proc/<init>  (code/modules/clothing/gloves/color.dm:149)
rt.def("/obj/item/clothing/gloves/color/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 70, "acid", 50]));
	return f.dot;
});

rt.type(7688, "/obj/item/clothing/gloves/color/random", "/obj/item/clothing/gloves/color", {
	name: "random gloves",
	desc: "These gloves are supposed to be a random color...",
	icon_state: "white",
	item_state: "wgloves",
	item_color: "mime",
});

// /obj/item/clothing/gloves/color/random/proc/New  (code/modules/clothing/gloves/color.dm:188)  may sleep
rt.def("/obj/item/clothing/gloves/color/random/proc/New", function* New(f: Frame) {
	let gloves: Value = null, selected: Value = null;
	f.vars = () => [gloves, selected];
	yield* g.callSuper(f, [], rt.Args.Same);
	gloves = rt.alist(f, [T("/obj/item/clothing/gloves/color/orange"), 1, T("/obj/item/clothing/gloves/color/red"), 1, T("/obj/item/clothing/gloves/color/blue"), 1, T("/obj/item/clothing/gloves/color/purple"), 1, T("/obj/item/clothing/gloves/color/green"), 1, T("/obj/item/clothing/gloves/color/grey"), 1, T("/obj/item/clothing/gloves/color/light_brown"), 1, T("/obj/item/clothing/gloves/color/brown"), 1]);
	rt.setSv(f, "name", rt.initial(f, (selected = rt.op(f, "PickUnweighted", [1], [live(gloves)])), "name"));
	rt.setSv(f, "desc", rt.initial(f, live(selected), "desc"));
	rt.setSv(f, "icon_state", rt.initial(f, live(selected), "icon_state"));
	rt.setSv(f, "item_state", rt.initial(f, live(selected), "item_state"));
	rt.setSv(f, "item_color", rt.initial(f, live(selected), "item_color"));
	return f.dot;
}, true);
