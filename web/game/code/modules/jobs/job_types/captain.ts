// From code/modules/jobs/job_types/captain.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/job/captain/proc/<init>  (code/modules/jobs/job_types/captain.dm:7)
rt.def("/datum/job/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Centcom"));
	$0 = $0;
	rt.setSv(f, "access", rt.list());
	$0 = $0;
	rt.setSv(f, "minimal_access", rt.list());
	return f.dot;
});

// /datum/job/captain/proc/get_access  (code/modules/jobs/job_types/captain.dm:23)
rt.def("/datum/job/captain/proc/get_access", function get_access(f: Frame) {
	return rt.call(f, P("/proc/get_all_accesses"), null, []);
});

// /datum/job/captain/proc/announce  (code/modules/jobs/job_types/captain.dm:26)
rt.def("/datum/job/captain/proc/announce", function announce(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, rt.gl("SSticker"), "OnRoundstart", [rt.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/minor_announce"), fmt("Captain ＀ on deck!", [rt.fv(f, "real_name", live(f.args[0]))])])]);
	return f.dot;
}, false, { args: ["H"] });

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

// /datum/outfit/job/captain/proc/<init>  (code/modules/jobs/job_types/captain.dm:42)
rt.def("/datum/outfit/job/captain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/weapon/station_charter"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
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

// /datum/job/hop/proc/<init>  (code/modules/jobs/job_types/captain.dm:57)
rt.def("/datum/job/hop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Captain"));
	rt.setSv(f, "head_announce", rt.list("Supply", "Service"));
	rt.setSv(f, "access", rt.list(1, 63, 42, 66, 5, 10, 15, 16, 18, 19, 21, 12, 25, 26, 32, 6, 27, 28, 31, 34, 50, 41, 35, 38, 46, 22, 37, 47, 48, 53, 54, 57, 59, 60, 62, 64));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 42, 66, 5, 10, 15, 16, 18, 19, 21, 12, 25, 26, 32, 6, 27, 28, 31, 34, 50, 41, 35, 38, 46, 22, 37, 47, 48, 53, 54, 57, 59, 60, 62, 64));
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

// /datum/outfit/job/hop/proc/<init>  (code/modules/jobs/job_types/captain.dm:94)
rt.def("/datum/outfit/job/hop/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/ids"), 1, T("/obj/item/weapon/melee/classic_baton/telescopic"), 1, T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});
