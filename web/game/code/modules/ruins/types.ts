// Types declared in code/modules/ruins that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(735, "/datum/outfit/lavaland_syndicate/comms", "/datum/outfit/lavaland_syndicate", {
	name: "Lavaland Syndicate Comms Agent",
	r_hand: rt.typePath("/obj/item/weapon/melee/energy/sword/saber"),
	mask: rt.typePath("/obj/item/clothing/mask/chameleon"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	l_pocket: rt.typePath("/obj/item/weapon/card/id/syndicate/anyone"),
});
rt.type(10161, "/obj/item/golem_shell/servant", "/obj/item/golem_shell", {
	name: "incomplete servant golem shell",
	shell_type: rt.typePath("/obj/effect/mob_spawn/human/golem/servant"),
});
rt.type(12024, "/obj/effect/mob_spawn/human/lavaland_syndicate/comms", "/obj/effect/mob_spawn/human/lavaland_syndicate", {
	outfit: rt.typePath("/datum/outfit/lavaland_syndicate/comms"),
	name: "Syndicate Comms Agent",
	flavour_text: "<font size=3>You are a syndicate agent, employed in a top secret research facility developing biological weapons. Unfortunately, your hated enemy, Nanotrasen, has begun mining in this sector. <b>Monitor enemy activity as best you can, and try to keep a low profile. <font size=6><b>DON'T</b></font> abandon the base without good cause.</b> Use the communication equipment to provide support to any field agents, and sow disinformation to throw Nanotrasen off your trail. Do not let the base fall into enemy hands!</b>",
});
