// Types declared in code/modules/surgery that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(6656, "/obj/item/weapon/scalpel/alien", "/obj/item/weapon/scalpel", {
	name: "alien scalpel",
	desc: "It's a gleaming sharp knife made out of silvery-green metal.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
rt.type(6657, "/obj/item/weapon/scalpel/supermatter", "/obj/item/weapon/scalpel", {
	name: "supermatter scalpel",
	desc: "A scalpel with a tip of condensed freon gas, searingly cold to the touch, that can safely shave a sliver off a supermatter crystal.",
	icon: rt.rsc("icons/obj/nuke_tools.dmi"),
	icon_state: "supermatter_scalpel",
	toolspeed: 0.5,
	damtype: "fire",
	usesound: rt.rsc("sound/weapons/bladeslice.ogg"),
});
rt.type(6659, "/obj/item/weapon/hemostat/alien", "/obj/item/weapon/hemostat", {
	name: "alien hemostat",
	desc: "You've never seen this before.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
rt.type(6662, "/obj/item/weapon/retractor/alien", "/obj/item/weapon/retractor", {
	name: "alien retractor",
	desc: "You're not sure if you want the veil pulled back.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
rt.type(6664, "/obj/item/weapon/circular_saw/alien", "/obj/item/weapon/circular_saw", {
	name: "alien saw",
	desc: "Do the aliens also lose this, and need to find an alien hatchet?",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
rt.type(6666, "/obj/item/weapon/surgicaldrill/alien", "/obj/item/weapon/surgicaldrill", {
	name: "alien drill",
	desc: "Maybe alien surgeons have finally found a use for the drill.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
rt.type(6668, "/obj/item/weapon/cautery/alien", "/obj/item/weapon/cautery", {
	name: "alien cautery",
	desc: "Why would bloodless aliens have a tool to stop bleeding? Unless...",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	origin_tech: "materials=2;biotech=2;abductor=2",
	toolspeed: 0.25,
});
