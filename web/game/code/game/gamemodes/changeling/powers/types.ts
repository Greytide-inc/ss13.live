// Types declared in code/game/gamemodes/changeling/powers that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";

rt.type(5656, "/obj/item/weapon/melee/arm_blade/false", "/obj/item/weapon/melee/arm_blade", {
	desc: "A grotesque mass of flesh that used to be your arm. Although it looks dangerous at first, you can tell it's actually quite dull and useless.",
	force: 5,
});
rt.type(11240, "/obj/effect/proc_holder/changeling/weapon/arm_blade", "/obj/effect/proc_holder/changeling/weapon", {
	helptext: "We may retract our armblade in the same manner as we form it. Cannot be used while in lesser form.",
	chemical_cost: 20,
	dna_cost: 2,
	req_human: 1,
	weapon_type: rt.typePath("/obj/item/weapon/melee/arm_blade"),
	weapon_name_simple: "blade",
	name: "Arm Blade",
	desc: "We reform one of our arms into a deadly blade.",
});
rt.type(11241, "/obj/effect/proc_holder/changeling/weapon/tentacle", "/obj/effect/proc_holder/changeling/weapon", {
	helptext: "We can use it once to retrieve a distant item. If used on living creatures, the effect depends on the intent: Help will simply drag them closer, Disarm will grab whatever they're holding instead of them, Grab will put the victim in our hold after catching it, and Harm will stun it, and stab it if we're also holding a sharp weapon. Cannot be used while in lesser form.",
	chemical_cost: 10,
	dna_cost: 2,
	req_human: 1,
	weapon_type: rt.typePath("/obj/item/weapon/gun/magic/tentacle"),
	weapon_name_simple: "tentacle",
	silent: 1,
	name: "Tentacle",
	desc: "We ready a tentacle to grab items or victims with.",
});
rt.type(11244, "/obj/effect/proc_holder/changeling/suit/organic_space_suit", "/obj/effect/proc_holder/changeling/suit", {
	helptext: "We must constantly repair our form to make it space-proof, reducing chemical production while we are protected. Cannot be used in lesser form.",
	chemical_cost: 20,
	dna_cost: 2,
	req_human: 1,
	suit_type: rt.typePath("/obj/item/clothing/suit/space/changeling"),
	helmet_type: rt.typePath("/obj/item/clothing/head/helmet/space/changeling"),
	suit_name_simple: "flesh shell",
	helmet_name_simple: "space helmet",
	recharge_slowdown: 0.5,
	blood_on_castoff: 1,
	name: "Organic Space Suit",
	desc: "We grow an organic suit to protect ourselves from space exposure.",
});
rt.type(11245, "/obj/effect/proc_holder/changeling/suit/armor", "/obj/effect/proc_holder/changeling/suit", {
	helptext: "Upkeep of the armor requires a low expenditure of chemicals. The armor is strong against brute force, but does not provide much protection from lasers. Cannot be used in lesser form.",
	chemical_cost: 20,
	dna_cost: 1,
	req_human: 1,
	recharge_slowdown: 0.25,
	suit_type: rt.typePath("/obj/item/clothing/suit/armor/changeling"),
	helmet_type: rt.typePath("/obj/item/clothing/head/helmet/changeling"),
	suit_name_simple: "armor",
	helmet_name_simple: "helmet",
	name: "Chitinous Armor",
	desc: "We turn our skin into tough chitin to protect us from damage.",
});
