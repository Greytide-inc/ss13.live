// Types declared in code/game/objects/items/weapons/melee that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";

rt.type(5666, "/obj/item/weapon/melee/chainofcommand/tailwhip", "/obj/item/weapon/melee/chainofcommand", {
	name: "liz o' nine tails",
	desc: "A whip fashioned from the severed tails of lizards.",
	icon_state: "tailwhip",
	origin_tech: "engineering=3;combat=3;biotech=3",
	needs_permit: 0,
});
rt.type(5667, "/obj/item/weapon/melee/chainofcommand/tailwhip/kitty", "/obj/item/weapon/melee/chainofcommand/tailwhip", {
	name: "cat o' nine tails",
	desc: "A whip fashioned from the severed tails of cats.",
	icon_state: "catwhip",
});
rt.type(5683, "/obj/item/weapon/melee/energy/sword/pirate", "/obj/item/weapon/melee/energy/sword", {
	icon_state_on: "cutlass1",
	light_color: "#ff0000",
	name: "energy cutlass",
	desc: "Arrrr matey.",
	icon_state: "cutlass0",
});
rt.type(5685, "/obj/item/weapon/melee/energy/blade/hardlight", "/obj/item/weapon/melee/energy/blade", {
	name: "hardlight blade",
	desc: "An extremely sharp blade made out of hard light. Packs quite a punch.",
	icon_state: "lightblade",
	item_state: "lightblade",
});
rt.type(5686, "/obj/item/weapon/melee/synthetic_arm_blade", "/obj/item/weapon/melee", {
	name: "synthetic arm blade",
	desc: "A grotesque blade that on closer inspection seems made of synthentic flesh, it still feels like it would hurt very badly as a weapon.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "arm_blade",
	item_state: "arm_blade",
	origin_tech: "combat=5;biotech=5",
	w_class: 5,
	force: 20,
	throwforce: 10,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});
