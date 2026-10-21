// Types declared in code/game/gamemodes/wizard that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";

rt.type(1436, "/datum/spellbook_entry/fireball", "/datum/spellbook_entry", {
	name: "Fireball",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aimed/fireball"),
});
rt.type(1437, "/datum/spellbook_entry/rod_form", "/datum/spellbook_entry", {
	name: "Rod Form",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/rod_form"),
});
rt.type(1438, "/datum/spellbook_entry/magicm", "/datum/spellbook_entry", {
	name: "Magic Missile",
	category: "Defensive",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"),
});
rt.type(1439, "/datum/spellbook_entry/disintegrate", "/datum/spellbook_entry", {
	name: "Disintegrate",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/touch/disintegrate"),
});
rt.type(1440, "/datum/spellbook_entry/disabletech", "/datum/spellbook_entry", {
	name: "Disable Tech",
	category: "Defensive",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/emplosion/disable_tech"),
});
rt.type(1441, "/datum/spellbook_entry/repulse", "/datum/spellbook_entry", {
	name: "Repulse",
	category: "Defensive",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/repulse"),
});
rt.type(1442, "/datum/spellbook_entry/lightningPacket", "/datum/spellbook_entry", {
	name: "Lightning bolt!  Lightning bolt!",
	category: "Defensive",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/conjure_item/spellpacket"),
});
rt.type(1443, "/datum/spellbook_entry/timestop", "/datum/spellbook_entry", {
	name: "Time Stop",
	category: "Defensive",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop"),
});
rt.type(1444, "/datum/spellbook_entry/smoke", "/datum/spellbook_entry", {
	name: "Smoke",
	category: "Defensive",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/smoke"),
});
rt.type(1445, "/datum/spellbook_entry/blind", "/datum/spellbook_entry", {
	name: "Blind",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/trigger/blind"),
});
rt.type(1446, "/datum/spellbook_entry/mindswap", "/datum/spellbook_entry", {
	name: "Mindswap",
	category: "Mobility",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/mind_transfer"),
});
rt.type(1447, "/datum/spellbook_entry/forcewall", "/datum/spellbook_entry", {
	name: "Force Wall",
	category: "Defensive",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/forcewall"),
});
rt.type(1448, "/datum/spellbook_entry/blink", "/datum/spellbook_entry", {
	name: "Blink",
	category: "Mobility",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/turf_teleport/blink"),
});
rt.type(1449, "/datum/spellbook_entry/teleport", "/datum/spellbook_entry", {
	name: "Teleport",
	category: "Mobility",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"),
});
rt.type(1450, "/datum/spellbook_entry/mutate", "/datum/spellbook_entry", {
	name: "Mutate",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/genetic/mutate"),
});
rt.type(1451, "/datum/spellbook_entry/jaunt", "/datum/spellbook_entry", {
	name: "Ethereal Jaunt",
	category: "Mobility",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"),
});
rt.type(1452, "/datum/spellbook_entry/knock", "/datum/spellbook_entry", {
	name: "Knock",
	category: "Mobility",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/knock"),
});
rt.type(1453, "/datum/spellbook_entry/fleshtostone", "/datum/spellbook_entry", {
	name: "Flesh to Stone",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/touch/flesh_to_stone"),
});
rt.type(1454, "/datum/spellbook_entry/summonitem", "/datum/spellbook_entry", {
	name: "Summon Item",
	category: "Assistance",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/summonitem"),
});
rt.type(1455, "/datum/spellbook_entry/lichdom", "/datum/spellbook_entry", {
	name: "Bind Soul",
	category: "Defensive",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/lichdom"),
});
rt.type(1456, "/datum/spellbook_entry/teslablast", "/datum/spellbook_entry", {
	name: "Tesla Blast",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/tesla"),
});
rt.type(1458, "/datum/spellbook_entry/infinite_guns", "/datum/spellbook_entry", {
	name: "Lesser Summon Guns",
	cost: 3,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/infinite_guns/gun"),
	no_coexistance_typecache: rt.typePath("/obj/effect/proc_holder/spell/targeted/infinite_guns/arcane_barrage"),
});
rt.type(1459, "/datum/spellbook_entry/arcane_barrage", "/datum/spellbook_entry", {
	name: "Arcane Barrage",
	cost: 3,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/infinite_guns/arcane_barrage"),
	no_coexistance_typecache: rt.typePath("/obj/effect/proc_holder/spell/targeted/infinite_guns/gun"),
});
rt.type(1460, "/datum/spellbook_entry/barnyard", "/datum/spellbook_entry", {
	name: "Barnyard Curse",
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/barnyardcurse"),
});
rt.type(1461, "/datum/spellbook_entry/charge", "/datum/spellbook_entry", {
	name: "Charge",
	category: "Assistance",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/charge"),
});
rt.type(1462, "/datum/spellbook_entry/shapeshift", "/datum/spellbook_entry", {
	name: "Wild Shapeshift",
	category: "Assistance",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/targeted/shapeshift"),
});
rt.type(1463, "/datum/spellbook_entry/spacetime_dist", "/datum/spellbook_entry", {
	name: "Spacetime Distortion",
	category: "Defensive",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/spacetime_dist"),
});
rt.type(1464, "/datum/spellbook_entry/the_traps", "/datum/spellbook_entry", {
	name: "The Traps!",
	category: "Defensive",
	cost: 1,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/conjure/the_traps"),
});
rt.type(1466, "/datum/spellbook_entry/item/staffchange", "/datum/spellbook_entry/item", {
	name: "Staff of Change",
	desc: "An artefact that spits bolts of coruscating energy which cause the target's very form to reshape itself.",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/change"),
});
rt.type(1467, "/datum/spellbook_entry/item/staffanimation", "/datum/spellbook_entry/item", {
	name: "Staff of Animation",
	desc: "An arcane staff capable of shooting bolts of eldritch energy which cause inanimate objects to come to life. This magic doesn't affect machines.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/animate"),
});
rt.type(1468, "/datum/spellbook_entry/item/staffchaos", "/datum/spellbook_entry/item", {
	name: "Staff of Chaos",
	desc: "A caprious tool that can fire all sorts of magic without any rhyme or reason. Using it on people you care about is not recommended.",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/chaos"),
});
rt.type(1469, "/datum/spellbook_entry/item/spellblade", "/datum/spellbook_entry/item", {
	name: "Spellblade",
	desc: "A sword capable of firing blasts of energy which rip targets limb from limb.",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/spellblade"),
});
rt.type(1470, "/datum/spellbook_entry/item/staffdoor", "/datum/spellbook_entry/item", {
	name: "Staff of Door Creation",
	desc: "A particular staff that can mold solid metal into ornate doors. Useful for getting around in the absence of other transportation. Does not work on glass.",
	cost: 1,
	category: "Mobility",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/door"),
});
rt.type(1471, "/datum/spellbook_entry/item/staffhealing", "/datum/spellbook_entry/item", {
	name: "Staff of Healing",
	desc: "An altruistic staff that can heal the lame and raise the dead.",
	cost: 1,
	category: "Defensive",
	item_path: rt.typePath("/obj/item/weapon/gun/magic/staff/healing"),
});
rt.type(1474, "/datum/spellbook_entry/item/necrostone", "/datum/spellbook_entry/item", {
	name: "A Necromantic Stone",
	desc: "A Necromantic stone is able to resurrect three dead individuals as skeletal thralls for you to command.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/device/necromantic_stone"),
});
rt.type(1475, "/datum/spellbook_entry/item/wands", "/datum/spellbook_entry/item", {
	name: "Wand Assortment",
	desc: "A collection of wands that allow for a wide variety of utility. Wands have a limited number of charges, so be conservative in use. Comes in a handy belt.",
	category: "Defensive",
	item_path: rt.typePath("/obj/item/weapon/storage/belt/wands/full"),
});
rt.type(1477, "/datum/spellbook_entry/item/contract", "/datum/spellbook_entry/item", {
	name: "Contract of Apprenticeship",
	desc: "A magical contract binding an apprentice wizard to your service, using it will summon them to your side.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/antag_spawner/contract"),
});
rt.type(1479, "/datum/spellbook_entry/item/bloodbottle", "/datum/spellbook_entry/item", {
	name: "Bottle of Blood",
	desc: "A bottle of magically infused blood, the smell of which will attract extradimensional beings when broken. Be careful though, the kinds of creatures summoned by blood magic are indiscriminate in their killing, and you yourself may become a victim.",
	limit: 3,
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/antag_spawner/slaughter_demon"),
});
rt.type(1480, "/datum/spellbook_entry/item/hugbottle", "/datum/spellbook_entry/item", {
	name: "Bottle of Tickles",
	desc: "A bottle of magically infused fun, the smell of which will attract adorable extradimensional beings when broken. These beings are similar to slaughter demons, but they do not permamently kill their victims, instead putting them in an extradimensional hugspace, to be released on the demon's death. Chaotic, but not ultimately damaging. The crew's reaction to the other hand could be very destructive.",
	cost: 1,
	limit: 3,
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/antag_spawner/slaughter_demon/laughter"),
});
rt.type(1481, "/datum/spellbook_entry/item/mjolnir", "/datum/spellbook_entry/item", {
	name: "Mjolnir",
	desc: "A mighty hammer on loan from Thor, God of Thunder. It crackles with barely contained power.",
	item_path: rt.typePath("/obj/item/weapon/twohanded/mjollnir"),
});
rt.type(1482, "/datum/spellbook_entry/item/singularity_hammer", "/datum/spellbook_entry/item", {
	name: "Singularity Hammer",
	desc: "A hammer that creates an intensely powerful field of gravity where it strikes, pulling everything nearby to the point of impact.",
	item_path: rt.typePath("/obj/item/weapon/twohanded/singularityhammer"),
});
rt.type(1483, "/datum/spellbook_entry/item/battlemage", "/datum/spellbook_entry/item", {
	name: "Battlemage Armour",
	desc: "An ensorcelled suit of armour, protected by a powerful shield. The shield can completly negate sixteen attacks before being permanently depleted.",
	limit: 1,
	category: "Defensive",
	item_path: rt.typePath("/obj/item/clothing/suit/space/hardsuit/shielded/wizard"),
});
rt.type(1484, "/datum/spellbook_entry/item/battlemage_charge", "/datum/spellbook_entry/item", {
	name: "Battlemage Armour Charges",
	desc: "A powerful defensive rune, it will grant eight additional charges to a suit of battlemage armour.",
	category: "Defensive",
	cost: 1,
	item_path: rt.typePath("/obj/item/wizard_armour_charge"),
});
rt.type(1485, "/datum/spellbook_entry/item/warpwhistle", "/datum/spellbook_entry/item", {
	name: "Warp Whistle",
	desc: "A strange whistle that will transport you to a distant safe place on the station. There is a window of vulnerability at the begining of every use.",
	category: "Mobility",
	cost: 1,
	item_path: rt.typePath("/obj/item/warpwhistle"),
});
rt.type(6692, "/obj/item/weapon/veilrender/vealrender", "/obj/item/weapon/veilrender", {
	spawn_amt: 20,
	activate_descriptor: "hunger",
	rend_desc: "Reverberates with the sound of ten thousand moos.",
	name: "veal render",
	desc: "A wicked curved blade of alien origin, recovered from the ruins of a vast farm.",
	spawn_type: rt.typePath("/mob/living/simple_animal/cow"),
});
rt.type(6693, "/obj/item/weapon/veilrender/honkrender", "/obj/item/weapon/veilrender", {
	spawn_amt: 10,
	activate_descriptor: "depression",
	rend_desc: "Gently wafting with the sounds of endless laughter.",
	name: "honk render",
	desc: "A wicked curved blade of alien origin, recovered from the ruins of a vast circus.",
	spawn_type: rt.typePath("/mob/living/simple_animal/hostile/retaliate/clown"),
	icon_state: "clownrender",
});
rt.type(6700, "/obj/item/weapon/spellbook/oneuse/smoke/lesser", "/obj/item/weapon/spellbook/oneuse/smoke", {
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/smoke/lesser"),
});
rt.type(6709, "/obj/item/weapon/spellbook/oneuse/sacredflame", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "sacred flame",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/sacred_flame"),
	icon_state: "booksacredflame",
	desc: "Become one with the flames that burn within... and invite others to do so as well.",
});
rt.type(6710, "/obj/item/weapon/spellbook/oneuse/mimery_blockade", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/forcewall/mime"),
	name: "Guide to Advanced Mimery Vol 1",
	desc: "The pages don't make any sound when turned.",
	icon_state: "bookmime",
});
rt.type(6711, "/obj/item/weapon/spellbook/oneuse/mimery_guns", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "",
	spell: rt.typePath("/obj/effect/proc_holder/spell/aimed/finger_guns"),
	name: "Guide to Advanced Mimery Vol 2",
	desc: "There aren't any words written...",
	icon_state: "bookmime",
});
rt.type(9217, "/obj/item/device/necromantic_stone/unlimited", "/obj/item/device/necromantic_stone", {
	unlimited: 1,
});
rt.type(9219, "/obj/item/device/soulstone/anybody", "/obj/item/device/soulstone", {
	usability: 1,
});
rt.type(9220, "/obj/item/device/soulstone/anybody/chaplain", "/obj/item/device/soulstone/anybody", {
	reusable: 0,
	name: "mysterious old shard",
});
