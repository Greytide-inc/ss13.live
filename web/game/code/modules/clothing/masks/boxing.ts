// From code/modules/clothing/masks/boxing.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8537, "/obj/item/clothing/mask/balaclava", "/obj/item/clothing/mask", {
	name: "balaclava",
	desc: "LOADSAMONEY",
	icon_state: "balaclava",
	item_state: "balaclava",
	flags_inv: 896,
	visor_flags_inv: 640,
	w_class: 2,
	actions_types: null,
});

// /obj/item/clothing/mask/balaclava/proc/<init>  (code/modules/clothing/masks/boxing.dm:9)
rt.def("/obj/item/clothing/mask/balaclava/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/adjust")));
	return f.dot;
});

// /obj/item/clothing/mask/balaclava/proc/attack_self  (code/modules/clothing/masks/boxing.dm:12)  may sleep
rt.def("/obj/item/clothing/mask/balaclava/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "adjustmask", live(user));
	return f.dot;
}, true);

rt.type(8538, "/obj/item/clothing/mask/luchador", "/obj/item/clothing/mask", {
	name: "Luchador Mask",
	desc: "Worn by robust fighters, flying high to defeat their foes!",
	icon_state: "luchag",
	item_state: "luchag",
	flags_inv: 896,
	w_class: 2,
});

// /obj/item/clothing/mask/luchador/proc/speechModification  (code/modules/clothing/masks/boxing.dm:23)
rt.def("/obj/item/clothing/mask/luchador/proc/speechModification", function speechModification(f: Frame, message: Value) {
	f.vars = () => [message];
	if (!isEqual(rt.call(f, P("/proc/copytext"), null, [live(message), 1, 2]), "*")) {
		message = rt.call(f, P("/proc/uppertext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [(message = rt.call(f, P("/proc/replacetext"), null, [live(message), "captain", "CAPITÁN"])), "station", "ESTACIÓN"])), "sir", "SEÑOR"])), "the ", "el "])), "my ", "mi "])), "is ", "es "])), "it's", "es"])), "friend", "amigo"])), "buddy", "amigo"])), "hello", "hola"])), " hot", " caliente"])), " very ", " muy "])), "sword", "espada"])), "library", "biblioteca"])), "traitor", "traidor"])), "wizard", "mago"]))]);
		if (truthy(rt.op(f, "Prob", [], [25]))) {
			message = rt.modify(live(message), " OLE!", add);
		}
	}
	return live(message);
});
