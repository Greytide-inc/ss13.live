// Types declared in code/modules/assembly that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(9362, "/obj/item/device/assembly/igniter/cold", "/obj/item/device/assembly/igniter", {});
rt.type(9371, "/obj/item/device/assembly/flash/memorizer", "/obj/item/device/assembly/flash", {
	name: "memorizer",
	desc: "If you see this, you're not likely to remember it any time soon.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "memorizer",
	item_state: "nullrod",
});
rt.type(9372, "/obj/item/device/assembly/flash/handheld", "/obj/item/device/assembly/flash", {});
rt.type(9378, "/obj/item/device/assembly/mousetrap/armed", "/obj/item/device/assembly/mousetrap", {
	armed: 1,
	icon_state: "mousetraparmed",
});
rt.type(9383, "/obj/item/device/assembly/signaler/cyborg", "/obj/item/device/assembly/signaler", {
	origin_tech: null,
});
