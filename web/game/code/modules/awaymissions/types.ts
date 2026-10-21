// Types declared in code/modules/awaymissions that have no procs of their own (step 3, tools/export-types.mjs; see src/vm/typedefs.ts).
import * as rt from "../../../../build/dist/src/translate/runtime.js";

rt.type(632, "/datum/outfit/ctf/instagib", "/datum/outfit/ctf", {
	r_hand: rt.typePath("/obj/item/weapon/gun/energy/laser/instakill"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots/fast"),
});
rt.type(634, "/datum/outfit/ctf/red/instagib", "/datum/outfit/ctf/red", {
	r_hand: rt.typePath("/obj/item/weapon/gun/energy/laser/instakill/red"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots/fast"),
});
rt.type(636, "/datum/outfit/ctf/blue/instagib", "/datum/outfit/ctf/blue", {
	r_hand: rt.typePath("/obj/item/weapon/gun/energy/laser/instakill/blue"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots/fast"),
});
rt.type(5213, "/obj/item/weapon/gun/ballistic/automatic/laser/ctf/red", "/obj/item/weapon/gun/ballistic/automatic/laser/ctf", {
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/red"),
});
rt.type(5214, "/obj/item/weapon/gun/ballistic/automatic/laser/ctf/blue", "/obj/item/weapon/gun/ballistic/automatic/laser/ctf", {
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge/ctf/blue"),
});
rt.type(5644, "/obj/item/weapon/twohanded/ctf/red", "/obj/item/weapon/twohanded/ctf", {
	team: "red",
	name: "red flag",
	icon_state: "banner-red",
	item_state: "banner-red",
	desc: "A red banner used to play capture the flag.",
	reset_path: rt.typePath("/obj/effect/ctf/flag_reset/red"),
});
rt.type(5645, "/obj/item/weapon/twohanded/ctf/blue", "/obj/item/weapon/twohanded/ctf", {
	team: "blue",
	name: "blue flag",
	icon_state: "banner-blue",
	item_state: "banner-blue",
	desc: "A blue banner used to play capture the flag.",
	reset_path: rt.typePath("/obj/effect/ctf/flag_reset/blue"),
});
rt.type(8864, "/obj/item/projectile/beam/ctf/red", "/obj/item/projectile/beam/ctf", {
	icon_state: "laser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/red_laser"),
});
rt.type(8865, "/obj/item/projectile/beam/ctf/blue", "/obj/item/projectile/beam/ctf", {
	icon_state: "bluelaser",
	impact_effect_type: rt.typePath("/obj/effect/temp_visual/impact_effect/blue_laser"),
});
rt.type(9890, "/obj/item/ammo_box/magazine/recharge/ctf/red", "/obj/item/ammo_box/magazine/recharge/ctf", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser/ctf/red"),
});
rt.type(9891, "/obj/item/ammo_box/magazine/recharge/ctf/blue", "/obj/item/ammo_box/magazine/recharge/ctf", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/laser/ctf/blue"),
});
rt.type(10888, "/obj/machinery/capture_the_flag/red", "/obj/machinery/capture_the_flag", {
	team: "red",
	ctf_gear: rt.typePath("/datum/outfit/ctf/red"),
	instagib_gear: rt.typePath("/datum/outfit/ctf/red/instagib"),
	name: "Red CTF Controller",
	icon_state: "syndbeacon",
});
rt.type(10889, "/obj/machinery/capture_the_flag/blue", "/obj/machinery/capture_the_flag", {
	team: "blue",
	ctf_gear: rt.typePath("/datum/outfit/ctf/blue"),
	instagib_gear: rt.typePath("/datum/outfit/ctf/blue/instagib"),
	name: "Blue CTF Controller",
	icon_state: "bluebeacon",
});
rt.type(11963, "/obj/effect/mob_spawn/human/doctor", "/obj/effect/mob_spawn/human", {
	name: "Doctor",
	outfit: rt.typePath("/datum/outfit/job/doctor"),
});
rt.type(11965, "/obj/effect/mob_spawn/human/doctor/alive/lavaland", "/obj/effect/mob_spawn/human/doctor/alive", {
	name: "broken rejuvenation pod",
	desc: "A small sleeper typically used to instantly restore minor wounds. This one seems broken, and its occupant is comatose.",
	mob_name: "a translocated vet",
	flavour_text: "<font size=3><b>W</b></font><b>hat...? Where are you? Where are the others? This is still the animal hospital - you should know, you've been an intern here for weeks - but everyone's gone. One of the cats scratched you just a few minutes ago. That's why you were in the pod - to heal the scratch. The scabs are still fresh; you see them right now. So where is everyone? Where did they go? What happened to the hospital? And is that <i>smoke</i> you smell? You need to find someone else. Maybe they can tell you what happened.</b>",
});
rt.type(11977, "/obj/effect/mob_spawn/human/corpse", "/obj/effect/mob_spawn/human", {
	roundstart: 0,
	instant: 1,
});
rt.type(11978, "/obj/effect/mob_spawn/human/corpse/damaged", "/obj/effect/mob_spawn/human/corpse", {
	brute_damage: 1000,
});
rt.type(11983, "/obj/effect/mob_spawn/human/corpse/pirate", "/obj/effect/mob_spawn/human/corpse", {
	outfit: rt.typePath("/datum/outfit/piratecorpse"),
	name: "Pirate",
});
rt.type(11984, "/obj/effect/mob_spawn/human/corpse/pirate/ranged", "/obj/effect/mob_spawn/human/corpse/pirate", {
	outfit: rt.typePath("/datum/outfit/piratecorpse/ranged"),
	name: "Pirate Gunner",
});
rt.type(11985, "/obj/effect/mob_spawn/human/corpse/russian", "/obj/effect/mob_spawn/human/corpse", {
	outfit: rt.typePath("/datum/outfit/russiancorpse"),
	name: "Russian",
});
rt.type(11986, "/obj/effect/mob_spawn/human/corpse/russian/ranged", "/obj/effect/mob_spawn/human/corpse/russian", {
	outfit: rt.typePath("/datum/outfit/russiancorpse/ranged"),
});
rt.type(11987, "/obj/effect/mob_spawn/human/corpse/russian/ranged/trooper", "/obj/effect/mob_spawn/human/corpse/russian/ranged", {
	outfit: rt.typePath("/datum/outfit/russiancorpse/ranged/trooper"),
});
rt.type(11988, "/obj/effect/mob_spawn/human/corpse/russian/ranged/officer", "/obj/effect/mob_spawn/human/corpse/russian/ranged", {
	outfit: rt.typePath("/datum/outfit/russiancorpse/officer"),
	name: "Russian Officer",
});
rt.type(11989, "/obj/effect/mob_spawn/human/corpse/wizard", "/obj/effect/mob_spawn/human/corpse", {
	outfit: rt.typePath("/datum/outfit/wizardcorpse"),
	name: "Space Wizard Corpse",
});
rt.type(11990, "/obj/effect/mob_spawn/human/corpse/nanotrasensoldier", "/obj/effect/mob_spawn/human/corpse", {
	id_job: "Private Security Force",
	id_access: "Security Officer",
	outfit: rt.typePath("/datum/outfit/nanotrasensoldiercorpse2"),
	name: "Nanotrasen Private Security Officer",
});
rt.type(11991, "/obj/effect/mob_spawn/human/corpse/charredskeleton", "/obj/effect/mob_spawn/human/corpse", {
	husk: 0,
	mob_species: rt.typePath("/datum/species/skeleton"),
	name: "charred skeletal remains",
	burn_damage: 1000,
	mob_name: "ashen skeleton",
	mob_gender: "neuter",
	mob_color: "#454545",
});
rt.type(11992, "/obj/effect/mob_spawn/human/alive", "/obj/effect/mob_spawn/human", {
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	death: 0,
	roundstart: 0,
});
rt.type(11995, "/obj/effect/mob_spawn/human/cook", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/job/cook"),
	name: "Cook",
});
rt.type(11996, "/obj/effect/mob_spawn/human/engineer", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/job/engineer/gloved"),
	name: "Engineer",
});
rt.type(11997, "/obj/effect/mob_spawn/human/engineer/rig", "/obj/effect/mob_spawn/human/engineer", {
	outfit: rt.typePath("/datum/outfit/job/engineer/gloved/rig"),
});
rt.type(11998, "/obj/effect/mob_spawn/human/clown", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/job/clown"),
	name: "Clown",
});
rt.type(11999, "/obj/effect/mob_spawn/human/clown/corpse", "/obj/effect/mob_spawn/human/clown", {
	roundstart: 0,
	instant: 1,
});
rt.type(12000, "/obj/effect/mob_spawn/human/scientist", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/job/scientist"),
	name: "Scientist",
});
rt.type(12001, "/obj/effect/mob_spawn/human/miner", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/job/miner/asteroid"),
	name: "Shaft Miner",
});
rt.type(12002, "/obj/effect/mob_spawn/human/miner/rig", "/obj/effect/mob_spawn/human/miner", {
	outfit: rt.typePath("/datum/outfit/job/miner/equipped/asteroid"),
});
rt.type(12003, "/obj/effect/mob_spawn/human/miner/explorer", "/obj/effect/mob_spawn/human/miner", {
	outfit: rt.typePath("/datum/outfit/job/miner/equipped"),
});
rt.type(12004, "/obj/effect/mob_spawn/human/plasmaman", "/obj/effect/mob_spawn/human", {
	mob_species: rt.typePath("/datum/species/plasmaman"),
	outfit: rt.typePath("/datum/outfit/plasmaman"),
});
rt.type(12006, "/obj/effect/mob_spawn/human/bartender/alive", "/obj/effect/mob_spawn/human/bartender", {
	death: 0,
	roundstart: 0,
	random: 1,
	name: "bartender sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	flavour_text: "You are a space bartender!",
});
rt.type(12007, "/obj/effect/mob_spawn/human/beach", "/obj/effect/mob_spawn/human", {
	outfit: rt.typePath("/datum/outfit/beachbum"),
});
rt.type(12008, "/obj/effect/mob_spawn/human/beach/alive", "/obj/effect/mob_spawn/human/beach", {
	death: 0,
	roundstart: 0,
	random: 1,
	mob_name: "Beach Bum",
	name: "beach bum sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	flavour_text: "You are a beach bum!",
});
rt.type(12010, "/obj/effect/mob_spawn/human/commander", "/obj/effect/mob_spawn/human", {
	id_job: "Commander",
	outfit: rt.typePath("/datum/outfit/nanotrasencommandercorpse"),
	name: "Commander",
	id_access_list: null,
});
rt.type(12011, "/obj/effect/mob_spawn/human/commander/alive", "/obj/effect/mob_spawn/human/commander", {
	death: 0,
	roundstart: 0,
	mob_name: "Nanotrasen Commander",
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	flavour_text: "You are a Nanotrasen Commander!",
});
rt.type(12012, "/obj/effect/mob_spawn/human/nanotrasensoldier", "/obj/effect/mob_spawn/human", {
	id_job: "Private Security Force",
	outfit: rt.typePath("/datum/outfit/nanotrasensoldiercorpse"),
	name: "Nanotrasen Private Security Officer",
	id_access_list: null,
});
rt.type(12013, "/obj/effect/mob_spawn/human/nanotrasensoldier/alive", "/obj/effect/mob_spawn/human/nanotrasensoldier", {
	death: 0,
	roundstart: 0,
	mob_name: "Private Security Officer",
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	faction: "nanotrasenprivate",
	flavour_text: "You are a Nanotrasen Private Security Officer!",
});
rt.type(12014, "/obj/effect/mob_spawn/human/skeleton", "/obj/effect/mob_spawn/human", {
	mob_species: rt.typePath("/datum/species/skeleton"),
	name: "skeletal remains",
	mob_name: "skeleton",
	mob_gender: "neuter",
});
rt.type(12015, "/obj/effect/mob_spawn/human/skeleton/alive", "/obj/effect/mob_spawn/human/skeleton", {
	death: 0,
	roundstart: 0,
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "remains",
	flavour_text: "By unknown powers, your skeletal remains have been reanimated! Walk this mortal plain and terrorize all living adventurers who dare cross your path.",
});
rt.type(12016, "/obj/effect/mob_spawn/human/zombie", "/obj/effect/mob_spawn/human", {
	mob_species: rt.typePath("/datum/species/zombie"),
	name: "rotting corpse",
	mob_name: "zombie",
});
rt.type(12017, "/obj/effect/mob_spawn/human/zombie/alive", "/obj/effect/mob_spawn/human/zombie", {
	death: 0,
	roundstart: 0,
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "remains",
	flavour_text: "By unknown powers, your rotting remains have been resurrected! Walk this mortal plain and terrorize all living adventurers who dare cross your path.",
});
rt.type(12018, "/obj/effect/mob_spawn/human/abductor", "/obj/effect/mob_spawn/human", {
	mob_species: rt.typePath("/datum/species/abductor"),
	outfit: rt.typePath("/datum/outfit/abductorcorpse"),
	name: "abductor",
	mob_name: "alien",
});
rt.type(12019, "/obj/effect/mob_spawn/human/syndicatesoldier", "/obj/effect/mob_spawn/human", {});
rt.type(12020, "/obj/effect/mob_spawn/human/syndicatesoldier/coldres", "/obj/effect/mob_spawn/human/syndicatesoldier", {
	outfit: rt.typePath("/datum/outfit/snowsyndie/corpse"),
	name: "Syndicate Snow Operative",
});
rt.type(12021, "/obj/effect/mob_spawn/human/syndicatesoldier/coldres/alive", "/obj/effect/mob_spawn/human/syndicatesoldier/coldres", {
	outfit: rt.typePath("/datum/outfit/snowsyndie"),
	name: "sleeper",
	mob_name: "Syndicate Snow Operative",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	roundstart: 0,
	death: 0,
	faction: "syndicate",
	flavour_text: "You are a syndicate operative recently awoken from cyrostatis in an underground outpost. Monitor Nanotrasen communications and record infomation. All intruders should be\n\tdisposed of swirfly to assure no gathered infomation is stolen or lost. Try not to wander too far from the outpost as the caves can be a deadly place even for a trained operative such as yourself.",
});
rt.type(12022, "/obj/effect/mob_spawn/human/syndicatesoldier/coldres/alive/female", "/obj/effect/mob_spawn/human/syndicatesoldier/coldres/alive", {
	mob_gender: "female",
});
rt.type(12026, "/obj/effect/mob_spawn/slime", "/obj/effect/mob_spawn", {
	mobcolour: "grey",
	mob_type: rt.typePath("/mob/living/simple_animal/slime"),
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "grey baby slime",
});
rt.type(12027, "/obj/effect/mob_spawn/mouse", "/obj/effect/mob_spawn", {
	mob_type: rt.typePath("/mob/living/simple_animal/mouse"),
	death: 0,
	roundstart: 0,
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
});
rt.type(12028, "/obj/effect/mob_spawn/cow", "/obj/effect/mob_spawn", {
	mob_type: rt.typePath("/mob/living/simple_animal/cow"),
	death: 0,
	roundstart: 0,
	mob_gender: "female",
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
});
rt.type(12888, "/obj/structure/trap/ctf/red", "/obj/structure/trap/ctf", {
	team: "red",
	icon_state: "trap-fire",
});
rt.type(12889, "/obj/structure/trap/ctf/blue", "/obj/structure/trap/ctf", {
	team: "blue",
	icon_state: "trap-frost",
});
rt.type(12931, "/obj/structure/signpost/salvation", "/obj/structure/signpost", {
	name: "０salvation",
	desc: "In the darkest times, we will find our way home.",
});
