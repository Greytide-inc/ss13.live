// From code/modules/jobs/job_types/engineering.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2758, "/datum/job/chief_engineer", "/datum/job", {
	title: "Chief Engineer",
	flag: 32,
	department_head: null,
	department_flag: 1,
	head_announce: null,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the captain",
	selection_color: "#ffeeaa",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/ce"),
	access: null,
	minimal_access: null,
});

// /datum/job/chief_engineer/proc/<init>  (code/modules/jobs/job_types/engineering.dm:7)
rt.def("/datum/job/chief_engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Captain"));
	$0 = $0;
	rt.setSv(f, "head_announce", rt.list("Engineering"));
	rt.setSv(f, "access", rt.list(10, 11, 23, 12, 13, 24, 14, 18, 19, 32, 63, 65, 56, 59, 60, 61, 64));
	rt.setSv(f, "minimal_access", rt.list(10, 11, 23, 12, 13, 24, 14, 18, 19, 32, 63, 65, 56, 59, 60, 61, 64));
	return f.dot;
});

rt.type(701, "/datum/outfit/job/ce", "/datum/outfit/job", {
	name: "Chief Engineer",
	jobtype: rt.typePath("/datum/job/chief_engineer"),
	id: rt.typePath("/obj/item/weapon/card/id/silver"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/utility/chief/full"),
	l_pocket: rt.typePath("/obj/item/device/pda/heads/ce"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/ce"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/chief_engineer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	head: rt.typePath("/obj/item/clothing/head/hardhat/white"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black/ce"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	backpack_contents: null,
	pda_slot: 15,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/industrial"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/eng"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/engineering"),
	box: rt.typePath("/obj/item/weapon/storage/box/engineer"),
});

// /datum/outfit/job/ce/proc/<init>  (code/modules/jobs/job_types/engineering.dm:42)
rt.def("/datum/outfit/job/ce/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});

rt.type(2759, "/datum/job/engineer", "/datum/job", {
	title: "Station Engineer",
	flag: 64,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 5,
	spawn_positions: 5,
	supervisors: "the chief engineer",
	selection_color: "#fff5cc",
	outfit: rt.typePath("/datum/outfit/job/engineer"),
	access: null,
	minimal_access: null,
});

// /datum/job/engineer/proc/<init>  (code/modules/jobs/job_types/engineering.dm:68)
rt.def("/datum/job/engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Chief Engineer"));
	rt.setSv(f, "access", rt.list(10, 11, 23, 12, 13, 32, 24, 61));
	rt.setSv(f, "minimal_access", rt.list(10, 11, 23, 12, 13, 32, 61));
	return f.dot;
});

rt.type(703, "/datum/outfit/job/engineer", "/datum/outfit/job", {
	name: "Station Engineer",
	jobtype: rt.typePath("/datum/job/engineer"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/utility/full/engi"),
	l_pocket: rt.typePath("/obj/item/device/pda/engineering"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_eng"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/engineer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/workboots"),
	head: rt.typePath("/obj/item/clothing/head/hardhat"),
	r_pocket: rt.typePath("/obj/item/device/t_scanner"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	pda_slot: 15,
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/industrial"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/eng"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/engineering"),
	box: rt.typePath("/obj/item/weapon/storage/box/engineer"),
});

// /datum/outfit/job/engineer/proc/<init>  (code/modules/jobs/job_types/engineering.dm:101)
rt.def("/datum/outfit/job/engineer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});

rt.type(2760, "/datum/job/atmos", "/datum/job", {
	title: "Atmospheric Technician",
	flag: 128,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 3,
	spawn_positions: 2,
	supervisors: "the chief engineer",
	selection_color: "#fff5cc",
	outfit: rt.typePath("/datum/outfit/job/atmos"),
	access: null,
	minimal_access: null,
});

// /datum/job/atmos/proc/<init>  (code/modules/jobs/job_types/engineering.dm:123)
rt.def("/datum/job/atmos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Chief Engineer"));
	rt.setSv(f, "access", rt.list(10, 11, 23, 12, 13, 32, 24));
	rt.setSv(f, "minimal_access", rt.list(24, 12, 14, 32));
	return f.dot;
});

rt.type(706, "/datum/outfit/job/atmos", "/datum/outfit/job", {
	name: "Atmospheric Technician",
	jobtype: rt.typePath("/datum/job/atmos"),
	belt: rt.typePath("/obj/item/weapon/storage/belt/utility/atmostech"),
	l_pocket: rt.typePath("/obj/item/device/pda/atmos"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_eng"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/atmospheric_technician"),
	r_pocket: rt.typePath("/obj/item/device/analyzer"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	pda_slot: 15,
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/industrial"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/eng"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/engineering"),
	box: rt.typePath("/obj/item/weapon/storage/box/engineer"),
});

// /datum/outfit/job/atmos/proc/<init>  (code/modules/jobs/job_types/engineering.dm:153)
rt.def("/datum/outfit/job/atmos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});
