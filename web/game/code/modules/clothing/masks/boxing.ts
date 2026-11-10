// Based on /tg/station's code/modules/clothing/masks/boxing.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// boxing.dm:9
rt.def("/obj/item/clothing/mask/balaclava/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/adjust"));
	return f.dot;
});

// boxing.dm:12
rt.def("/obj/item/clothing/mask/balaclava/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.adjustmask(user);
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

// boxing.dm:23
rt.def("/obj/item/clothing/mask/luchador/proc/speechModification", function speechModification(f: Frame, message: Value) {
	if (copytext(message, 1, 2) != "*") {
		message = uppertext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext((message = replacetext(message, "captain", "CAPITÁN")), "station", "ESTACIÓN")), "sir", "SEÑOR")), "the ", "el ")), "my ", "mi ")), "is ", "es ")), "it's", "es")), "friend", "amigo")), "buddy", "amigo")), "hello", "hola")), " hot", " caliente")), " very ", " muy ")), "sword", "espada")), "library", "biblioteca")), "traitor", "traidor")), "wizard", "mago")));
		if (prob(25)) {
			message += " OLE!";
		}
	}
	return message;
});
