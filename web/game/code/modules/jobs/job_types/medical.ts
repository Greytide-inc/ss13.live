// Based on /tg/station's code/modules/jobs/job_types/medical.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2761, "/datum/job/cmo", "/datum/job", {
	title: "Chief Medical Officer",
	flag: 8,
	department_head: null,
	department_flag: 2,
	head_announce: null,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the captain",
	selection_color: "#ffddf0",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/cmo"),
	access: null,
	minimal_access: null,
});

// medical.dm:7
rt.def("/datum/job/cmo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Captain");

	this.head_announce = list("Medical");
	this.access = list(5, 6, 9, 68, 19, 64, 33, 39, 40, 45, 59, 60, 63, 12);
	this.minimal_access = list(5, 6, 9, 68, 19, 64, 33, 39, 40, 45, 59, 60, 63, 12);
	return f.dot;
});

rt.type(708, "/datum/outfit/job/cmo", "/datum/outfit/job", {
	name: "Chief Medical Officer",
	jobtype: rt.typePath("/datum/job/cmo"),
	id: rt.typePath("/obj/item/weapon/card/id/silver"),
	belt: rt.typePath("/obj/item/device/pda/heads/cmo"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/cmo"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/chief_medical_officer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat/cmo"),
	l_hand: rt.typePath("/obj/item/weapon/storage/firstaid/regular"),
	suit_store: rt.typePath("/obj/item/device/flashlight/pen"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/medic"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/med"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/med"),
});

// medical.dm:39
rt.def("/datum/outfit/job/cmo/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/classic_baton/telescopic"), 1]);
	return f.dot;
});

rt.type(2762, "/datum/job/doctor", "/datum/job", {
	title: "Medical Doctor",
	flag: 16,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 5,
	spawn_positions: 3,
	supervisors: "the chief medical officer",
	selection_color: "#ffeef0",
	outfit: rt.typePath("/datum/outfit/job/doctor"),
	access: null,
	minimal_access: null,
});

// medical.dm:51
rt.def("/datum/job/doctor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Chief Medical Officer");
	this.access = list(5, 6, 45, 33, 9, 68, 64);
	this.minimal_access = list(5, 6, 45, 68);
	return f.dot;
});

rt.type(2763, "/datum/job/chemist", "/datum/job", {
	title: "Chemist",
	flag: 4,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 2,
	supervisors: "the chief medical officer",
	selection_color: "#ffeef0",
	outfit: rt.typePath("/datum/outfit/job/chemist"),
	access: null,
	minimal_access: null,
});

// medical.dm:86
rt.def("/datum/job/chemist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Chief Medical Officer");
	this.access = list(5, 6, 45, 33, 9, 68, 64);
	this.minimal_access = list(5, 33, 64);
	return f.dot;
});

rt.type(2765, "/datum/job/virologist", "/datum/job", {
	title: "Virologist",
	flag: 64,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the chief medical officer",
	selection_color: "#ffeef0",
	outfit: rt.typePath("/datum/outfit/job/virologist"),
	access: null,
	minimal_access: null,
});

// medical.dm:154
rt.def("/datum/job/virologist/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Chief Medical Officer");
	this.access = list(5, 6, 45, 33, 39, 9, 68, 64);
	this.minimal_access = list(5, 39, 64);
	return f.dot;
});
