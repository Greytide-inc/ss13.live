// From code/modules/jobs/job_types/cargo_service.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/job/qm/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:7)
rt.def("/datum/job/qm/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	rt.setSv(f, "minimal_access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
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

// /datum/job/cargo_tech/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:37)
rt.def("/datum/job/cargo_tech/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	rt.setSv(f, "minimal_access", rt.list(12, 31, 34, 50, 64));
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

// /datum/job/mining/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:65)
rt.def("/datum/job/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(12, 50, 31, 34, 41, 48, 54, 64));
	rt.setSv(f, "minimal_access", rt.list(48, 54, 50, 64));
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

// /datum/outfit/job/miner/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:89)
rt.def("/datum/outfit/job/miner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/bag/ore"), 1, T("/obj/item/weapon/kitchen/knife/combat/survival"), 1, T("/obj/item/weapon/mining_voucher"), 1, T("/obj/item/stack/marker_beacon/ten"), 1]));
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

// /datum/outfit/job/miner/equipped/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:112)
rt.def("/datum/outfit/job/miner/equipped/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/bag/ore"), 1, T("/obj/item/weapon/kitchen/knife/combat/survival"), 1, T("/obj/item/weapon/mining_voucher"), 1, T("/obj/item/device/t_scanner/adv_mining_scanner/lesser"), 1, T("/obj/item/weapon/gun/energy/kinetic_accelerator"), 1, T("/obj/item/stack/marker_beacon/ten"), 1]));
	return f.dot;
});

// /datum/outfit/job/miner/equipped/proc/post_equip  (code/modules/jobs/job_types/cargo_service.dm:121)  may sleep
rt.def("/datum/outfit/job/miner/equipped/proc/post_equip", function* post_equip(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.fv(f, "wear_suit", live(f.args[0])), T("/obj/item/clothing/suit/hooded")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (S = rt.fv(f, "wear_suit", live(f.args[0]))), "ToggleHood", []);
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

// /datum/job/bartender/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:143)
rt.def("/datum/job/bartender/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(35, 25, 28, 6, 66));
	$0 = $0;
	rt.setSv(f, "minimal_access", rt.list(25));
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

// /datum/outfit/job/bartender/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:166)
rt.def("/datum/outfit/job/bartender/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/beanbag"), 1]));
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

// /datum/job/cook/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:175)
rt.def("/datum/job/cook/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(35, 25, 28, 6));
	rt.setSv(f, "minimal_access", rt.list(28, 6));
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

// /datum/outfit/job/cook/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:198)
rt.def("/datum/outfit/job/cook/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/sharpener"), 1]));
	return f.dot;
});

// /datum/outfit/job/cook/proc/pre_equip  (code/modules/jobs/job_types/cargo_service.dm:201)  may sleep
rt.def("/datum/outfit/job/cook/proc/pre_equip", function* pre_equip(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((J = (yield* g.callName(f, rt.gl("SSjob"), "GetJobType", [rt.sv(f, "jobtype")]))))) return f.dot;
	if (rt.gt(rt.fv(f, "cooks", live(J)), 0)) {
		rt.setSv(f, "suit", T("/obj/item/clothing/suit/apron/chef"));
		rt.setSv(f, "head", T("/obj/item/clothing/head/soft/mime"));
	}
	if (truthy(live(f.args[1]))) return f.dot;
	rt.incField(f, live(J), "cooks", 1, true);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

// /datum/outfit/job/cook/proc/post_equip  (code/modules/jobs/job_types/cargo_service.dm:211)  may sleep
rt.def("/datum/outfit/job/cook/proc/post_equip", function* post_equip(f: Frame) {
	let possible_boxes: Value = null, chosen_box: Value = null, I: Value = null;
	f.vars = () => [possible_boxes, chosen_box, I];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	possible_boxes = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/storage/box/ingredients")])), T("/obj/item/weapon/storage/box/ingredients"));
	chosen_box = rt.op(f, "PickUnweighted", [1], [live(possible_boxes)]);
	I = (yield* g.new_(f, live(chosen_box), [live(f.src)]));
	yield* g.callName(f, live(f.args[0]), "equip_to_slot_or_del", [live(I), 18]);
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

// /datum/job/hydro/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:223)
rt.def("/datum/job/hydro/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(35, 25, 28, 6));
	rt.setSv(f, "minimal_access", rt.list(35, 6));
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

// /datum/job/janitor/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:261)
rt.def("/datum/job/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(26, 12));
	rt.setSv(f, "minimal_access", rt.list(26, 12));
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

// /datum/outfit/job/janitor/proc/<init>  (code/modules/jobs/job_types/cargo_service.dm:282)
rt.def("/datum/outfit/job/janitor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/device/modular_computer/tablet/preset/advanced"), 1]));
	return f.dot;
});
