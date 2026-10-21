// Types declared in code/game/gamemodes/nuclear that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(620, "/datum/outfit/syndicate/no_crystals", "/datum/outfit/syndicate", {
	tc: 0,
});
rt.type(6689, "/obj/item/weapon/pinpointer/syndicate", "/obj/item/weapon/pinpointer", {
	name: "syndicate pinpointer",
	desc: "A handheld tracking device that locks onto certain signals. It's configured to switch tracking modes once it detects the activation signal of a nuclear device.",
});
rt.type(6690, "/obj/item/weapon/pinpointer/syndicate/cyborg", "/obj/item/weapon/pinpointer/syndicate", {
	mode: 4,
	flags: 2,
	name: "cyborg syndicate pinpointer",
	desc: "An integrated tracking device, jury-rigged to search for living Syndicate operatives.",
});
