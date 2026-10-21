// From code/game/objects/items/weapons/signs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7344, "/obj/item/weapon/picket_sign", "/obj/item/weapon", {
	label: "",
	last_wave: 0,
	icon_state: "picket",
	name: "blank picket sign",
	desc: "It's blank",
	force: 5,
	w_class: 4,
	attack_verb: null,
	resistance_flags: 4,
});

// /obj/item/weapon/picket_sign/proc/attackby  (code/game/objects/items/weapons/signs.dm:14)  may sleep
rt.def("/obj/item/weapon/picket_sign/proc/attackby", function* attackby(f: Frame) {
	let txt: Value = null;
	f.vars = () => [txt];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		if (truthy((txt = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like to write on the sign?", "Sign Label", null, 30]))))) {
			rt.setSv(f, "label", live(txt));
			rt.setFv(f, "name", live(f.src), fmt("＀ sign", [rt.sv(f, "label")]));
			rt.setSv(f, "desc", fmt("It reads: ＀", [rt.sv(f, "label")]));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/picket_sign/proc/attack_self  (code/game/objects/items/weapons/signs.dm:24)
rt.def("/obj/item/weapon/picket_sign/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!rt.lt(add(rt.sv(f, "last_wave"), 20), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "last_wave", rt.worldTime(f));
	if (truthy(rt.sv(f, "label"))) {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ waves around ％\"！\" sign.</span>", [live(user), rt.sv(f, "label")])]);
	} else {
		rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ waves around blank sign.</span>", [live(user)])]);
	}
	rt.callName(f, live(user), "changeNext_move", [8]);
	return f.dot;
});

rt.type(1536, "/datum/crafting_recipe/picket_sign", "/datum/crafting_recipe", {
	name: "Picket Sign",
	result: rt.typePath("/obj/item/weapon/picket_sign"),
	reqs: null,
	time: 80,
	category: "Misc",
});

// /datum/crafting_recipe/picket_sign/proc/<init>  (code/game/objects/items/weapons/signs.dm:35)
rt.def("/datum/crafting_recipe/picket_sign/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reqs", rt.alist(f, [T("/obj/item/stack/rods"), 1, T("/obj/item/stack/sheet/cardboard"), 2]));
	return f.dot;
});
