// From code/modules/jobs/job_types/civilian.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2753, "/datum/job/clown", "/datum/job", {
	title: "Clown",
	flag: 2048,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#dddddd",
	outfit: rt.typePath("/datum/outfit/job/clown"),
	access: null,
	minimal_access: null,
});

// /datum/job/clown/proc/<init>  (code/modules/jobs/job_types/civilian.dm:7)
rt.def("/datum/job/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	$0 = $0;
	rt.setSv(f, "access", rt.list(46));
	$0 = $0;
	rt.setSv(f, "minimal_access", rt.list(46));
	return f.dot;
});

// /datum/job/clown/proc/after_spawn  (code/modules/jobs/job_types/civilian.dm:21)  may sleep
rt.def("/datum/job/clown/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	f.vars = () => [H, M];
	yield* g.callName(f, live(H), "rename_self", ["clown", rt.fv(f, "client", live(M))]);
	return f.dot;
}, true);

rt.type(696, "/datum/outfit/job/clown", "/datum/outfit/job", {
	name: "Clown",
	jobtype: rt.typePath("/datum/job/clown"),
	belt: rt.typePath("/obj/item/device/pda/clown"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/clown"),
	shoes: rt.typePath("/obj/item/clothing/shoes/clown_shoes"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/clown_hat"),
	l_pocket: rt.typePath("/obj/item/weapon/bikehorn"),
	backpack_contents: null,
	implants: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/clown"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/clown"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/clown"),
	box: rt.typePath("/obj/item/weapon/storage/box/hug/survival"),
});

// /datum/outfit/job/clown/proc/<init>  (code/modules/jobs/job_types/civilian.dm:32)
rt.def("/datum/outfit/job/clown/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/stamp/clown"), 1, T("/obj/item/weapon/reagent_containers/spray/waterflower"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/sad_trombone")));
	return f.dot;
});

// /datum/outfit/job/clown/proc/pre_equip  (code/modules/jobs/job_types/civilian.dm:48)
rt.def("/datum/outfit/job/clown/proc/pre_equip", function pre_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.callName(f, live(f.args[0]), "fully_replace_character_name", [rt.fv(f, "real_name", live(f.args[0])), rt.op(f, "PickUnweighted", [1], [rt.gl("clown_names")])]);
	return f.dot;
}, false, { args: ["H", "visualsOnly"] });

// /datum/outfit/job/clown/proc/post_equip  (code/modules/jobs/job_types/civilian.dm:55)  may sleep
rt.def("/datum/outfit/job/clown/proc/post_equip", function* post_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "add_mutation", ["Clumsiness"]);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(2754, "/datum/job/mime", "/datum/job", {
	title: "Mime",
	flag: 4096,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#dddddd",
	outfit: rt.typePath("/datum/outfit/job/mime"),
	access: null,
	minimal_access: null,
});

// /datum/job/mime/proc/<init>  (code/modules/jobs/job_types/civilian.dm:67)
rt.def("/datum/job/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	$0 = $0;
	rt.setSv(f, "access", rt.list(46));
	$0 = $0;
	rt.setSv(f, "minimal_access", rt.list(46));
	return f.dot;
});

// /datum/job/mime/proc/after_spawn  (code/modules/jobs/job_types/civilian.dm:81)  may sleep
rt.def("/datum/job/mime/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	f.vars = () => [H, M];
	yield* g.callName(f, live(H), "rename_self", ["mime", rt.fv(f, "client", live(M))]);
	return f.dot;
}, true);

rt.type(697, "/datum/outfit/job/mime", "/datum/outfit/job", {
	name: "Mime",
	jobtype: rt.typePath("/datum/job/mime"),
	belt: rt.typePath("/obj/item/device/pda/mime"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/mime"),
	mask: rt.typePath("/obj/item/clothing/mask/gas/mime"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/white"),
	head: rt.typePath("/obj/item/clothing/head/beret"),
	suit: rt.typePath("/obj/item/clothing/suit/suspenders"),
	backpack_contents: null,
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/cosmetology"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/mime"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/mime"),
});

// /datum/outfit/job/mime/proc/<init>  (code/modules/jobs/job_types/civilian.dm:93)
rt.def("/datum/outfit/job/mime/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing"), 1]));
	return f.dot;
});

// /datum/outfit/job/mime/proc/post_equip  (code/modules/jobs/job_types/civilian.dm:101)  may sleep
rt.def("/datum/outfit/job/mime/proc/post_equip", function* post_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "mind", live(f.args[0])))) return f.dot;
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall"), [null]))]);
	yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/mime/speak"), [null]))]);
	rt.setFv(f, "miming", rt.fv(f, "mind", live(f.args[0])), 1);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(2755, "/datum/job/curator", "/datum/job", {
	title: "Curator",
	flag: 32,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#dddddd",
	outfit: rt.typePath("/datum/outfit/job/curator"),
	access: null,
	minimal_access: null,
});

// /datum/job/curator/proc/<init>  (code/modules/jobs/job_types/civilian.dm:117)
rt.def("/datum/job/curator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	$0 = $0;
	rt.setSv(f, "access", rt.list(37));
	rt.setSv(f, "minimal_access", rt.list(37, 32, 54));
	return f.dot;
});

rt.type(698, "/datum/outfit/job/curator", "/datum/outfit/job", {
	name: "Curator",
	jobtype: rt.typePath("/datum/job/curator"),
	belt: rt.typePath("/obj/item/device/pda/curator"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/curator"),
	l_hand: rt.typePath("/obj/item/weapon/storage/bag/books"),
	r_pocket: rt.typePath("/obj/item/key/displaycase"),
	l_pocket: rt.typePath("/obj/item/device/laser_pointer"),
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/full"),
	backpack_contents: null,
});

// /datum/outfit/job/curator/proc/<init>  (code/modules/jobs/job_types/civilian.dm:140)
rt.def("/datum/outfit/job/curator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/curator_whip"), 1, T("/obj/item/soapstone"), 1, T("/obj/item/weapon/barcodescanner"), 1]));
	return f.dot;
});

// /datum/outfit/job/curator/proc/post_equip  (code/modules/jobs/job_types/civilian.dm:148)  may sleep
rt.def("/datum/outfit/job/curator/proc/post_equip", function* post_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "grant_all_languages", ["omnitongue", 1], rt.Args.Named);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(2756, "/datum/job/lawyer", "/datum/job", {
	lawyers: 0,
	title: "Lawyer",
	flag: 512,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 2,
	spawn_positions: 2,
	supervisors: "the head of personnel",
	selection_color: "#dddddd",
	outfit: rt.typePath("/datum/outfit/job/lawyer"),
	access: null,
	minimal_access: null,
});

// /datum/job/lawyer/proc/<init>  (code/modules/jobs/job_types/civilian.dm:161)
rt.def("/datum/job/lawyer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(38, 42, 63));
	rt.setSv(f, "minimal_access", rt.list(38, 42, 63));
	return f.dot;
});

rt.type(699, "/datum/outfit/job/lawyer", "/datum/outfit/job", {
	name: "Lawyer",
	jobtype: rt.typePath("/datum/job/lawyer"),
	belt: rt.typePath("/obj/item/device/pda/lawyer"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sec"),
	uniform: rt.typePath("/obj/item/clothing/under/lawyer/bluesuit"),
	suit: rt.typePath("/obj/item/clothing/suit/toggle/lawyer"),
	shoes: rt.typePath("/obj/item/clothing/shoes/laceup"),
	l_hand: rt.typePath("/obj/item/weapon/storage/briefcase/lawyer"),
	l_pocket: rt.typePath("/obj/item/device/laser_pointer"),
	r_pocket: rt.typePath("/obj/item/clothing/accessory/lawyers_badge"),
});

// /datum/outfit/job/lawyer/proc/pre_equip  (code/modules/jobs/job_types/civilian.dm:190)  may sleep
rt.def("/datum/outfit/job/lawyer/proc/pre_equip", function* pre_equip(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	rt.incField(f, (J = (yield* g.callName(f, rt.gl("SSjob"), "GetJobType", [rt.sv(f, "jobtype")]))), "lawyers", 1, true);
	if (!rt.gt(rt.fv(f, "lawyers", live(J)), 1)) return f.dot;
	rt.setSv(f, "uniform", T("/obj/item/clothing/under/lawyer/purpsuit"));
	rt.setSv(f, "suit", T("/obj/item/clothing/suit/toggle/lawyer/purple"));
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });
