// Types declared in code/modules/mob/living/carbon/alien/special that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../../build/dist/src/translate/runtime.js";

rt.type(8588, "/obj/item/clothing/mask/facehugger/toy", "/obj/item/clothing/mask/facehugger", {
	item_state: "facehugger_inactive",
	desc: "A toy often used to play pranks on other miners by putting it in their beds. It takes a bit to recharge after latching onto something.",
	throwforce: 0,
	real: 0,
	sterile: 1,
	tint: 3,
});
rt.type(8589, "/obj/item/clothing/mask/facehugger/lamarr", "/obj/item/clothing/mask/facehugger", {
	sterile: 1,
	name: "Lamarr",
});
rt.type(8590, "/obj/item/clothing/mask/facehugger/dead", "/obj/item/clothing/mask/facehugger", {
	stat: 2,
	icon_state: "facehugger_dead",
	item_state: "facehugger_inactive",
});
rt.type(8591, "/obj/item/clothing/mask/facehugger/impregnated", "/obj/item/clothing/mask/facehugger", {
	stat: 2,
	icon_state: "facehugger_impregnated",
	item_state: "facehugger_impregnated",
});
