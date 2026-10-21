// From code/modules/clothing/masks/breath.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8541, "/obj/item/clothing/mask/breath", "/obj/item/clothing/mask", {
	flags: 8,
	desc: "A close-fitting mask that can be connected to an air supply.",
	name: "breath mask",
	icon_state: "breath",
	item_state: "m_mask",
	body_parts_covered: 0,
	visor_flags: 8,
	w_class: 2,
	gas_transfer_coefficient: 0.1,
	permeability_coefficient: 0.5,
	actions_types: null,
	flags_cover: 8,
	visor_flags_cover: 8,
	resistance_flags: 0,
});

// /obj/item/clothing/mask/breath/proc/<init>  (code/modules/clothing/masks/breath.dm:12)
rt.def("/obj/item/clothing/mask/breath/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/breath/proc/attack_self  (code/modules/clothing/masks/breath.dm:18)  may sleep
rt.def("/obj/item/clothing/mask/breath/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "adjustmask", live(user));
	return f.dot;
}, true);

// /obj/item/clothing/mask/breath/proc/AltClick  (code/modules/clothing/masks/breath.dm:21)  may sleep
rt.def("/obj/item/clothing/mask/breath/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "adjustmask", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/mask/breath/proc/examine  (code/modules/clothing/masks/breath.dm:29)
rt.def("/obj/item/clothing/mask/breath/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Alt-click ＀ to adjust it.</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });
