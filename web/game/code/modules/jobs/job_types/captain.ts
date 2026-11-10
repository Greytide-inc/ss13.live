// Based on /tg/station's code/modules/jobs/job_types/captain.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(2744, "/datum/job/captain", "/datum/job", {
	title: "Captain",
	flag: 1,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "Nanotrasen officials and Space law",
	selection_color: "#ccccff",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/captain"),
	access: null,
	minimal_access: null,
});

// captain.dm:7
rt.def("/datum/job/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Centcom");

	this.access = list();

	this.minimal_access = list();
	return f.dot;
});

// captain.dm:23
rt.def("/datum/job/captain/proc/get_access", function get_access(f: Frame) {
	return get_all_accesses();
});

// captain.dm:26
rt.def("/datum/job/captain/proc/announce", function announce(f: Frame, H: Value) {
	parent_proc();
	GLOB.SSticker.OnRoundstart(new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/minor_announce"), `Captain ${H.real_name} on deck!`));
	return f.dot;
}, false);

rt.type(684, "/datum/outfit/job/captain", "/datum/outfit/job", {
	name: "Captain",
	jobtype: rt.typePath("/datum/job/captain"),
	id: rt.typePath("/obj/item/weapon/card/id/gold"),
	belt: rt.typePath("/obj/item/device/pda/captain"),
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/captain/alt"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/captain"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/captain"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest/capcarapace"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	head: rt.typePath("/obj/item/clothing/head/caphat"),
	backpack_contents: null,
	implants: null,
	accessory: rt.typePath("/obj/item/clothing/accessory/medal/gold/captain"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/captain"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/cap"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/captain"),
});

// captain.dm:42
rt.def("/datum/outfit/job/captain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/weapon/station_charter"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
	return f.dot;
});

rt.type(2745, "/datum/job/hop", "/datum/job", {
	title: "Head of Personnel",
	flag: 1,
	department_head: null,
	department_flag: 4,
	head_announce: null,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the captain",
	selection_color: "#ddddff",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/hop"),
	access: null,
	minimal_access: null,
});

// captain.dm:57
rt.def("/datum/job/hop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Captain");
	this.head_announce = list("Supply", "Service");
	this.access = list(1, 63, 42, 66, 5, 10, 15, 16, 18, 19, 21, 12, 25, 26, 32, 6, 27, 28, 31, 34, 50, 41, 35, 38, 46, 22, 37, 47, 48, 53, 54, 57, 59, 60, 62, 64);
	this.minimal_access = list(1, 63, 42, 66, 5, 10, 15, 16, 18, 19, 21, 12, 25, 26, 32, 6, 27, 28, 31, 34, 50, 41, 35, 38, 46, 22, 37, 47, 48, 53, 54, 57, 59, 60, 62, 64);
	return f.dot;
});

rt.type(685, "/datum/outfit/job/hop", "/datum/outfit/job", {
	name: "Head of Personnel",
	jobtype: rt.typePath("/datum/job/hop"),
	id: rt.typePath("/obj/item/weapon/card/id/silver"),
	belt: rt.typePath("/obj/item/device/pda/heads/hop"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/hop"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/head_of_personnel"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	head: rt.typePath("/obj/item/clothing/head/hopcap"),
	backpack_contents: null,
});

// captain.dm:94
rt.def("/datum/outfit/job/hop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/ids"), 1, T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]);
	return f.dot;
});
