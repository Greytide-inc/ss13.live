// Types declared in code/modules/mob/living/carbon/alien that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(522, "/datum/emote/living/alien/gnarl", "/datum/emote/living/alien", {
	key: "gnarl",
	key_third_person: "gnarls",
	message: "gnarls and shows its teeth...",
});
rt.type(9467, "/obj/item/organ/alien/plasmavessel/large", "/obj/item/organ/alien/plasmavessel", {
	storedPlasma: 200,
	max_plasma: 500,
	plasma_rate: 15,
	name: "large plasma vessel",
	icon_state: "plasma_large",
	w_class: 4,
});
rt.type(9468, "/obj/item/organ/alien/plasmavessel/large/queen", "/obj/item/organ/alien/plasmavessel/large", {
	plasma_rate: 20,
	origin_tech: "biotech=6;plasmatech=4",
});
rt.type(9469, "/obj/item/organ/alien/plasmavessel/small", "/obj/item/organ/alien/plasmavessel", {
	storedPlasma: 100,
	max_plasma: 150,
	plasma_rate: 5,
	name: "small plasma vessel",
	icon_state: "plasma_small",
	w_class: 2,
});
