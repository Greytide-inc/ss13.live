// Based on /tg/station's code/modules/jobs/job_types/cargo_service.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2746, "/datum/job/qm", "/datum/job", {
	title: "Quartermaster",
	flag: 64,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#d7b088",
	outfit: rt.typePath("/datum/outfit/job/quartermaster"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:7
rt.def("/datum/job/qm/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(12, 50, 31, 34, 41, 48, 54, 64);
	this.minimal_access = list(12, 50, 31, 34, 41, 48, 54, 64);
	return f.dot;
});

rt.type(2747, "/datum/job/cargo_tech", "/datum/job", {
	title: "Cargo Technician",
	flag: 128,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 3,
	spawn_positions: 2,
	supervisors: "the quartermaster and the head of personnel",
	selection_color: "#dcba97",
	outfit: rt.typePath("/datum/outfit/job/cargo_tech"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:37
rt.def("/datum/job/cargo_tech/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(12, 50, 31, 34, 41, 48, 54, 64);
	this.minimal_access = list(12, 31, 34, 50, 64);
	return f.dot;
});

rt.type(2748, "/datum/job/mining", "/datum/job", {
	title: "Shaft Miner",
	flag: 256,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 3,
	spawn_positions: 3,
	supervisors: "the quartermaster and the head of personnel",
	selection_color: "#dcba97",
	outfit: rt.typePath("/datum/outfit/job/miner"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:65
rt.def("/datum/job/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(12, 50, 31, 34, 41, 48, 54, 64);
	this.minimal_access = list(48, 54, 50, 64);
	return f.dot;
});

rt.type(688, "/datum/outfit/job/miner", "/datum/outfit/job", {
	name: "Shaft Miner (Lavaland)",
	jobtype: rt.typePath("/datum/job/mining"),
	belt: rt.typePath("/obj/item/device/pda/shaftminer"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_cargo/mining"),
	shoes: rt.typePath("/obj/item/clothing/shoes/workboots/mining"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/miner/lavaland"),
	l_pocket: rt.typePath("/obj/item/weapon/reagent_containers/hypospray/medipen/survival"),
	r_pocket: rt.typePath("/obj/item/device/flashlight/seclite"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/explorer"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/explorer"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag"),
	box: rt.typePath("/obj/item/weapon/storage/box/survival_mining"),
});

// cargo_service.dm:89
rt.def("/datum/outfit/job/miner/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/bag/ore"), 1, T("/obj/item/weapon/kitchen/knife/combat/survival"), 1, T("/obj/item/weapon/mining_voucher"), 1, T("/obj/item/stack/marker_beacon/ten"), 1]);
	return f.dot;
});

rt.type(690, "/datum/outfit/job/miner/equipped", "/datum/outfit/job/miner", {
	name: "Shaft Miner (Lavaland + Equipment)",
	internals_slot: 17,
	suit: rt.typePath("/obj/item/clothing/suit/hooded/explorer"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/explorer"),
	glasses: rt.typePath("/obj/item/clothing/glasses/meson"),
	suit_store: rt.typePath("/obj/item/weapon/tank/internals/oxygen"),
	backpack_contents: null,
});

// cargo_service.dm:112
rt.def("/datum/outfit/job/miner/equipped/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/bag/ore"), 1, T("/obj/item/weapon/kitchen/knife/combat/survival"), 1, T("/obj/item/weapon/mining_voucher"), 1, T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), 1, T("/obj/item/weapon/gun/energy/kinetic_accelerator"), 1, T("/obj/item/stack/marker_beacon/ten"), 1]);
	return f.dot;
});

// cargo_service.dm:121
rt.def("/datum/outfit/job/miner/equipped/proc/post_equip", function* post_equip(f: Frame) {
	let S: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	if (!rt.istype(f.args[0].wear_suit, T("/obj/item/clothing/suit/hooded"))) return f.dot;
	yield* (S = f.args[0].wear_suit).ToggleHood();
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(2749, "/datum/job/bartender", "/datum/job", {
	title: "Bartender",
	flag: 2,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#bbe291",
	outfit: rt.typePath("/datum/outfit/job/bartender"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:143
rt.def("/datum/job/bartender/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(35, 25, 28, 6, 66);

	this.minimal_access = list(25);
	return f.dot;
});

rt.type(692, "/datum/outfit/job/bartender", "/datum/outfit/job", {
	name: "Bartender",
	jobtype: rt.typePath("/datum/job/bartender"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses/reagent"),
	belt: rt.typePath("/obj/item/device/pda/bar"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_srv"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/bartender"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest"),
	backpack_contents: null,
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
});

// cargo_service.dm:166
rt.def("/datum/outfit/job/bartender/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/beanbag"), 1]);
	return f.dot;
});

rt.type(2750, "/datum/job/cook", "/datum/job", {
	cooks: 0,
	title: "Cook",
	flag: 8,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#bbe291",
	outfit: rt.typePath("/datum/outfit/job/cook"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:175
rt.def("/datum/job/cook/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(35, 25, 28, 6);
	this.minimal_access = list(28, 6);
	return f.dot;
});

rt.type(693, "/datum/outfit/job/cook", "/datum/outfit/job", {
	name: "Cook",
	jobtype: rt.typePath("/datum/job/cook"),
	belt: rt.typePath("/obj/item/device/pda/cook"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_srv"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/chef"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/chef"),
	head: rt.typePath("/obj/item/clothing/head/chefhat"),
	backpack_contents: null,
});

// cargo_service.dm:198
rt.def("/datum/outfit/job/cook/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/sharpener"), 1]);
	return f.dot;
});

// cargo_service.dm:201
rt.def("/datum/outfit/job/cook/proc/pre_equip", function* pre_equip(f: Frame) {
	let J: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!(J = (yield* GLOB.SSjob.GetJobType(this.jobtype)))) return f.dot;
	if (J.cooks > 0) {
		this.suit = T("/obj/item/clothing/suit/apron/chef");
		this.head = T("/obj/item/clothing/head/soft/mime");
	}
	if (f.args[1]) return f.dot;
	J.cooks++;
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

// cargo_service.dm:211
rt.def("/datum/outfit/job/cook/proc/post_equip", function* post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	let possible_boxes: Value = typesof(T("/obj/item/weapon/storage/box/ingredients")) - T("/obj/item/weapon/storage/box/ingredients");
	let chosen_box: Value = pick(possible_boxes);
	let I: Value = (yield* new_(chosen_box, this));
	yield* f.args[0].equip_to_slot_or_del(I, 18);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(2751, "/datum/job/hydro", "/datum/job", {
	title: "Botanist",
	flag: 4,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 3,
	spawn_positions: 2,
	supervisors: "the head of personnel",
	selection_color: "#bbe291",
	outfit: rt.typePath("/datum/outfit/job/botanist"),
	access: null,
	minimal_access: null,
});

// cargo_service.dm:223
rt.def("/datum/job/hydro/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(35, 25, 28, 6);
	this.minimal_access = list(35, 6);
	return f.dot;
});

rt.type(2752, "/datum/job/janitor", "/datum/job", {
	title: "Janitor",
	flag: 16,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#bbe291",
	outfit: rt.typePath("/datum/outfit/job/janitor"),
	access: null,
	minimal_access: null,
}, { global: { janitors: 667 } });

// cargo_service.dm:261
rt.def("/datum/job/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(26, 12);
	this.minimal_access = list(26, 12);
	return f.dot;
});

rt.type(695, "/datum/outfit/job/janitor", "/datum/outfit/job", {
	name: "Janitor",
	jobtype: rt.typePath("/datum/job/janitor"),
	belt: rt.typePath("/obj/item/device/pda/janitor"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_srv"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/janitor"),
	backpack_contents: null,
});

// cargo_service.dm:282
rt.def("/datum/outfit/job/janitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]);
	return f.dot;
});
