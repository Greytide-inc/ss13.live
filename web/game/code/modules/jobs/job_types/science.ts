// From code/modules/jobs/job_types/science.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2766, "/datum/job/rd", "/datum/job", {
	title: "Research Director",
	flag: 1,
	department_head: null,
	department_flag: 2,
	head_announce: null,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the captain",
	selection_color: "#ffddff",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/rd"),
	access: null,
	minimal_access: null,
});

// /datum/job/rd/proc/<init>  (code/modules/jobs/job_types/science.dm:7)
rt.def("/datum/job/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Captain"));
	$0 = $0;
	rt.setSv(f, "head_announce", rt.list("Science"));
	rt.setSv(f, "access", rt.list(30, 19, 7, 9, 6, 8, 17, 63, 47, 29, 55, 16, 59, 60, 62, 64, 23, 65, 12, 67));
	rt.setSv(f, "minimal_access", rt.list(30, 19, 7, 9, 6, 8, 17, 63, 47, 29, 55, 16, 59, 60, 62, 64, 23, 65, 12, 67));
	return f.dot;
});

rt.type(713, "/datum/outfit/job/rd", "/datum/outfit/job", {
	name: "Research Director",
	jobtype: rt.typePath("/datum/job/rd"),
	id: rt.typePath("/obj/item/weapon/card/id/silver"),
	belt: rt.typePath("/obj/item/device/pda/heads/rd"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/rd"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/research_director"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/labcoat"),
	l_hand: rt.typePath("/obj/item/weapon/clipboard"),
	l_pocket: rt.typePath("/obj/item/device/laser_pointer"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/science"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/tox"),
});

// /datum/outfit/job/rd/proc/<init>  (code/modules/jobs/job_types/science.dm:44)
rt.def("/datum/outfit/job/rd/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});

rt.type(2767, "/datum/job/scientist", "/datum/job", {
	title: "Scientist",
	flag: 2,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 5,
	spawn_positions: 3,
	supervisors: "the research director",
	selection_color: "#ffeeff",
	outfit: rt.typePath("/datum/outfit/job/scientist"),
	access: null,
	minimal_access: null,
});

// /datum/job/scientist/proc/<init>  (code/modules/jobs/job_types/science.dm:64)
rt.def("/datum/job/scientist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Research Director"));
	rt.setSv(f, "access", rt.list(29, 7, 8, 47, 55, 64, 23, 9));
	rt.setSv(f, "minimal_access", rt.list(7, 8, 47, 55, 64));
	return f.dot;
});

rt.type(2768, "/datum/job/roboticist", "/datum/job", {
	title: "Roboticist",
	flag: 256,
	department_head: null,
	department_flag: 2,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 2,
	supervisors: "research director",
	selection_color: "#ffeeff",
	outfit: rt.typePath("/datum/outfit/job/roboticist"),
	access: null,
	minimal_access: null,
});

// /datum/job/roboticist/proc/<init>  (code/modules/jobs/job_types/science.dm:97)
rt.def("/datum/job/roboticist/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Research Director"));
	rt.setSv(f, "access", rt.list(29, 7, 8, 23, 6, 47, 64, 55, 9));
	rt.setSv(f, "minimal_access", rt.list(29, 23, 6, 47, 64));
	return f.dot;
});
