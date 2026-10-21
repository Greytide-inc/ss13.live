// From code/modules/awaymissions/mission_code/snowdin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11881, "/obj/effect/spawner/lootdrop/snowdin", "/obj/effect/spawner/lootdrop", {
	lootdoubles: 0,
	lootcount: 1,
	loot: null,
	name: "why are you using this dummy",
});

// /obj/effect/spawner/lootdrop/snowdin/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:78)
rt.def("/obj/effect/spawner/lootdrop/snowdin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/bikehorn"), 100]));
	return f.dot;
});

rt.type(11882, "/obj/effect/spawner/lootdrop/snowdin/dungeonlite", "/obj/effect/spawner/lootdrop/snowdin", {
	loot: null,
	name: "dungeon lite",
});

// /obj/effect/spawner/lootdrop/snowdin/dungeonlite/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:82)
rt.def("/obj/effect/spawner/lootdrop/snowdin/dungeonlite/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/melee/classic_baton"), 11, T("/obj/item/weapon/melee/classic_baton/telescopic"), 12, T("/obj/item/weapon/spellbook/oneuse/smoke"), 10, T("/obj/item/weapon/spellbook/oneuse/blind"), 10, T("/obj/item/weapon/storage/firstaid/regular"), 45, T("/obj/item/weapon/storage/firstaid/toxin"), 35, T("/obj/item/weapon/storage/firstaid/brute"), 27, T("/obj/item/weapon/storage/firstaid/fire"), 27, T("/obj/item/weapon/storage/toolbox/syndicate"), 12, T("/obj/item/weapon/grenade/plastic/c4"), 7, T("/obj/item/weapon/grenade/clusterbuster/smoke"), 15, T("/obj/item/clothing/under/chameleon"), 13, T("/obj/item/clothing/shoes/chameleon"), 10, T("/obj/item/borg/upgrade/ddrill"), 3, T("/obj/item/borg/upgrade/soh"), 3]));
	return f.dot;
});

rt.type(11883, "/obj/effect/spawner/lootdrop/snowdin/dungeonmid", "/obj/effect/spawner/lootdrop/snowdin", {
	loot: null,
	name: "dungeon mid",
});

// /obj/effect/spawner/lootdrop/snowdin/dungeonmid/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:100)
rt.def("/obj/effect/spawner/lootdrop/snowdin/dungeonmid/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/defibrillator/compact"), 6, T("/obj/item/weapon/storage/firstaid/tactical"), 35, T("/obj/item/weapon/shield/energy"), 6, T("/obj/item/weapon/shield/riot/tele"), 12, T("/obj/item/weapon/dnainjector/lasereyesmut"), 7, T("/obj/item/weapon/gun/magic/wand/fireball/inert"), 3, T("/obj/item/weapon/pneumatic_cannon"), 15, T("/obj/item/weapon/melee/energy/sword"), 7, T("/obj/item/weapon/spellbook/oneuse/knock"), 15, T("/obj/item/weapon/spellbook/oneuse/summonitem"), 20, T("/obj/item/weapon/spellbook/oneuse/forcewall"), 17, T("/obj/item/weapon/storage/backpack/holding"), 12, T("/obj/item/weapon/grenade/spawnergrenade/manhacks"), 6, T("/obj/item/weapon/grenade/spawnergrenade/spesscarp"), 7, T("/obj/item/weapon/grenade/clusterbuster/inferno"), 3, T("/obj/item/stack/sheet/mineral/diamond"), 10, T("/obj/item/stack/sheet/mineral/uranium"), 10, T("/obj/item/stack/sheet/mineral/plasma"), 10, T("/obj/item/stack/sheet/mineral/gold"), 10, T("/obj/item/weapon/spellbook/oneuse/barnyard"), 4, T("/obj/item/weapon/pickaxe/drill/diamonddrill"), 6, T("/obj/item/borg/upgrade/vtec"), 7, T("/obj/item/borg/upgrade/disablercooler"), 7]));
	return f.dot;
});

rt.type(11884, "/obj/effect/spawner/lootdrop/snowdin/dungeonheavy", "/obj/effect/spawner/lootdrop/snowdin", {
	loot: null,
	name: "dungeon heavy",
});

// /obj/effect/spawner/lootdrop/snowdin/dungeonheavy/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:127)
rt.def("/obj/effect/spawner/lootdrop/snowdin/dungeonheavy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/weapon/twohanded/singularityhammer"), 25, T("/obj/item/weapon/twohanded/mjollnir"), 10, T("/obj/item/weapon/twohanded/fireaxe"), 25, T("/obj/item/organ/brain/alien"), 17, T("/obj/item/weapon/twohanded/dualsaber"), 15, T("/obj/item/organ/heart/demon"), 7, T("/obj/item/weapon/gun/ballistic/automatic/c20r/unrestricted"), 16, T("/obj/item/weapon/gun/magic/wand/resurrection/inert"), 15, T("/obj/item/weapon/gun/magic/wand/resurrection"), 10, T("/obj/item/device/radio/uplink/old"), 2, T("/obj/item/weapon/spellbook/oneuse/charge"), 12, T("/obj/item/weapon/grenade/clusterbuster/spawner_manhacks"), 15, T("/obj/item/weapon/spellbook/oneuse/fireball"), 10, T("/obj/item/weapon/pickaxe/drill/jackhammer"), 30, T("/obj/item/borg/upgrade/syndicate"), 13, T("/obj/item/borg/upgrade/selfrepair"), 17]));
	return f.dot;
});

rt.type(11885, "/obj/effect/spawner/lootdrop/snowdin/dungeonmisc", "/obj/effect/spawner/lootdrop/snowdin", {
	lootdoubles: 2,
	lootcount: 1,
	loot: null,
	name: "dungeon misc",
});

// /obj/effect/spawner/lootdrop/snowdin/dungeonmisc/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:149)
rt.def("/obj/effect/spawner/lootdrop/snowdin/dungeonmisc/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "loot", rt.alist(f, [T("/obj/item/stack/sheet/mineral/snow"), 10, T("/obj/item/toy/snowball"), 15, T("/obj/item/weapon/shovel"), 10, T("/obj/item/weapon/twohanded/spear"), 8]));
	return f.dot;
});

rt.type(8337, "/obj/item/clothing/under/syndicate/coldres", "/obj/item/clothing/under/syndicate", {
	name: "insulated tactical turtleneck",
	desc: "A non-descript and slightly suspicious looking turtleneck with digital camouflage cargo pants. The interior has been padded with special insulation for both warmth and protection",
	armor: null,
	cold_protection: 414,
	min_cold_protection_temperature: 60,
});

// /obj/item/clothing/under/syndicate/coldres/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:160)
rt.def("/obj/item/clothing/under/syndicate/coldres/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 20, "bullet", 10, "laser", 0, "energy", 5, "bomb", 0, "bio", 0, "rad", 0, "fire", 25, "acid", 25]));
	return f.dot;
});

rt.type(9211, "/obj/item/device/radio/uplink/old", "/obj/item/device/radio/uplink", {
	name: "dusty radio",
	desc: "A dusty looking radio.",
});

// /obj/item/device/radio/uplink/old/proc/Initialize  (code/modules/awaymissions/mission_code/snowdin.dm:183)  may sleep
rt.def("/obj/item/device/radio/uplink/old/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "name", rt.sv(f, "hidden_uplink"), "dusty radio");
	rt.setFv(f, "telecrystals", rt.sv(f, "hidden_uplink"), 10);
	return f.dot;
}, true);

rt.type(650, "/datum/outfit/snowsyndie/corpse", "/datum/outfit/snowsyndie", {
	name: "Syndicate Snow Operative Corpse",
	implants: null,
});

// /datum/outfit/snowsyndie/corpse/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:193)
rt.def("/datum/outfit/snowsyndie/corpse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", null);
	return f.dot;
});

rt.type(649, "/datum/outfit/snowsyndie", "/datum/outfit", {
	name: "Syndicate Snow Operative",
	uniform: rt.typePath("/obj/item/clothing/under/syndicate/coldres"),
	shoes: rt.typePath("/obj/item/clothing/shoes/combat/coldres"),
	ears: rt.typePath("/obj/item/device/radio/headset/syndicate/alt"),
	r_pocket: rt.typePath("/obj/item/weapon/gun/ballistic/automatic/pistol"),
	l_pocket: rt.typePath("/obj/item/weapon/card/id/syndicate"),
	implants: null,
});

// /datum/outfit/snowsyndie/proc/<init>  (code/modules/awaymissions/mission_code/snowdin.dm:214)
rt.def("/datum/outfit/snowsyndie/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/exile")));
	return f.dot;
});
