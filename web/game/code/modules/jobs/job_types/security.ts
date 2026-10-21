// From code/modules/jobs/job_types/security.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/job/proc/check_config_for_sec_maint  (code/modules/jobs/job_types/security.dm:3)
rt.def("/datum/job/proc/check_config_for_sec_maint", function check_config_for_sec_maint(f: Frame) {
	if (truthy(rt.bitAnd(rt.fv(f, "jobs_have_maint_access", rt.gl("config")), 2))) {
		return rt.list(12);
	}
	return rt.list();
});

rt.type(2769, "/datum/job/hos", "/datum/job", {
	title: "Head of Security",
	flag: 2,
	department_head: null,
	department_flag: 1,
	head_announce: null,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the captain",
	selection_color: "#ffdddd",
	req_admin_notify: 1,
	outfit: rt.typePath("/datum/outfit/job/hos"),
	access: null,
	minimal_access: null,
});

// /datum/job/hos/proc/<init>  (code/modules/jobs/job_types/security.dm:13)
rt.def("/datum/job/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Captain"));
	$0 = $0;
	rt.setSv(f, "head_announce", rt.list("Security"));
	rt.setSv(f, "access", rt.list(1, 63, 2, 3, 42, 66, 4, 6, 12, 21, 47, 10, 48, 5, 32, 50, 19, 58, 59, 60, 62, 12));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 2, 3, 42, 66, 4, 6, 12, 21, 47, 10, 48, 5, 32, 50, 19, 58, 59, 60, 62, 12));
	return f.dot;
});

rt.type(717, "/datum/outfit/job/hos", "/datum/outfit/job", {
	name: "Head of Security",
	jobtype: rt.typePath("/datum/job/hos"),
	id: rt.typePath("/obj/item/weapon/card/id/silver"),
	belt: rt.typePath("/obj/item/device/pda/heads/hos"),
	ears: rt.typePath("/obj/item/device/radio/headset/heads/hos/alt"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/head_of_security"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/hos/trenchcoat"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black/hos"),
	head: rt.typePath("/obj/item/clothing/head/HoS/beret"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/security/sunglasses"),
	suit_store: rt.typePath("/obj/item/weapon/gun/energy/e_gun"),
	r_pocket: rt.typePath("/obj/item/device/assembly/flash/handheld"),
	l_pocket: rt.typePath("/obj/item/weapon/restraints/handcuffs"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/sec"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/sec"),
	box: rt.typePath("/obj/item/weapon/storage/box/security"),
	implants: null,
});

// /datum/outfit/job/hos/proc/<init>  (code/modules/jobs/job_types/security.dm:51)
rt.def("/datum/outfit/job/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
	return f.dot;
});

rt.type(2770, "/datum/job/warden", "/datum/job", {
	title: "Warden",
	flag: 4,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of security",
	selection_color: "#ffeeee",
	outfit: rt.typePath("/datum/outfit/job/warden"),
	access: null,
	minimal_access: null,
});

// /datum/job/warden/proc/<init>  (code/modules/jobs/job_types/security.dm:66)
rt.def("/datum/job/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Security"));
	rt.setSv(f, "access", rt.list(1, 63, 2, 3, 42, 12, 6, 66, 4));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 2, 3, 42, 66));
	return f.dot;
});

// /datum/job/warden/proc/get_access  (code/modules/jobs/job_types/security.dm:81)
rt.def("/datum/job/warden/proc/get_access", function get_access(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	L = rt.list();
	return (L = rt.bitOr(rt.callSuper(f, [], rt.Args.Same), rt.callSrc(f, "check_config_for_sec_maint", [])));
});

rt.type(718, "/datum/outfit/job/warden", "/datum/outfit/job", {
	name: "Warden",
	jobtype: rt.typePath("/datum/job/warden"),
	belt: rt.typePath("/obj/item/device/pda/warden"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sec/alt"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/warden"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest/warden/alt"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	head: rt.typePath("/obj/item/clothing/head/warden"),
	glasses: rt.typePath("/obj/item/clothing/glasses/hud/security/sunglasses"),
	r_pocket: rt.typePath("/obj/item/device/assembly/flash/handheld"),
	l_pocket: rt.typePath("/obj/item/weapon/restraints/handcuffs"),
	suit_store: rt.typePath("/obj/item/weapon/gun/energy/e_gun/advtaser"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/sec"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/sec"),
	box: rt.typePath("/obj/item/weapon/storage/box/security"),
	implants: null,
});

// /datum/outfit/job/warden/proc/<init>  (code/modules/jobs/job_types/security.dm:100)
rt.def("/datum/outfit/job/warden/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
	return f.dot;
});

rt.type(2771, "/datum/job/detective", "/datum/job", {
	title: "Detective",
	flag: 8,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of security",
	selection_color: "#ffeeee",
	outfit: rt.typePath("/datum/outfit/job/detective"),
	access: null,
	minimal_access: null,
});

// /datum/job/detective/proc/<init>  (code/modules/jobs/job_types/security.dm:116)
rt.def("/datum/job/detective/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Security"));
	rt.setSv(f, "access", rt.list(63, 4, 6, 12, 42, 2, 66));
	rt.setSv(f, "minimal_access", rt.list(63, 4, 6, 12, 42, 2, 66));
	return f.dot;
});

rt.type(719, "/datum/outfit/job/detective", "/datum/outfit/job", {
	name: "Detective",
	jobtype: rt.typePath("/datum/job/detective"),
	belt: rt.typePath("/obj/item/device/pda/detective"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sec/alt"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/det"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/brown"),
	suit: rt.typePath("/obj/item/clothing/suit/det_suit"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	head: rt.typePath("/obj/item/clothing/head/fedora/det_hat"),
	l_pocket: rt.typePath("/obj/item/toy/crayon/white"),
	r_pocket: rt.typePath("/obj/item/weapon/lighter"),
	backpack_contents: null,
	mask: rt.typePath("/obj/item/clothing/mask/cigarette"),
	implants: null,
});

// /datum/outfit/job/detective/proc/<init>  (code/modules/jobs/job_types/security.dm:143)
rt.def("/datum/outfit/job/detective/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/storage/box/evidence"), 1, T("/obj/item/device/detective_scanner"), 1, T("/obj/item/weapon/melee/classic_baton"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
	return f.dot;
});

// /datum/outfit/job/detective/proc/post_equip  (code/modules/jobs/job_types/security.dm:151)  may sleep
rt.def("/datum/outfit/job/detective/proc/post_equip", function* post_equip(f: Frame) {
	let cig: Value = null;
	f.vars = () => [cig];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, (cig = rt.fv(f, "wear_mask", live(f.args[0]))), "light", [""]);
	if (!truthy(live(f.args[1]))) return f.dot;
	return live(f.dot);
}, true, { args: ["H", "visualsOnly"] });

rt.type(2772, "/datum/job/officer", "/datum/job", {
	title: "Security Officer",
	flag: 16,
	department_head: null,
	department_flag: 1,
	faction: "Station",
	total_positions: 5,
	spawn_positions: 5,
	supervisors: "the head of security, and the head of your assigned department (if applicable)",
	selection_color: "#ffeeee",
	outfit: rt.typePath("/datum/outfit/job/security"),
	access: null,
	minimal_access: null,
});

// /datum/job/officer/proc/<init>  (code/modules/jobs/job_types/security.dm:164)
rt.def("/datum/job/officer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Security"));
	rt.setSv(f, "access", rt.list(1, 63, 2, 42, 12, 6, 66, 4));
	rt.setSv(f, "minimal_access", rt.list(1, 63, 2, 42, 66));
	return f.dot;
});

// /datum/job/officer/proc/get_access  (code/modules/jobs/job_types/security.dm:180)
rt.def("/datum/job/officer/proc/get_access", function get_access(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	L = rt.list();
	(L = rt.modify(live(L), rt.bitOr(rt.callSuper(f, [], rt.Args.Same), rt.callSrc(f, "check_config_for_sec_maint", [])), rt.bitOr));
	return live(L);
});

// /datum/controller/global_vars/proc/InitGlobalavailable_depts  (code/modules/jobs/job_types/security.dm:184)
rt.def("/datum/controller/global_vars/proc/InitGlobalavailable_depts", function InitGlobalavailable_depts(f: Frame) {
	rt.setGl("available_depts", rt.list("Engineering", "Medical", "Science", "Supply"));
	rt.modSrcVar(f, "gvars_datum_init_order", "available_depts", add);
	return f.dot;
});

// /datum/job/officer/proc/after_spawn  (code/modules/jobs/job_types/security.dm:189)  may sleep
rt.def("/datum/job/officer/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	let department: Value = null, ears: Value = null, accessory: Value = null, dep_access: Value = null, destination: Value = null, spawn_point: Value = null, U: Value = null, W: Value = null, teleport: Value = null, _T: Value = null, safety: Value = null;
	let $0: any;
	f.vars = () => [H, M, department, ears, accessory, dep_access, destination, spawn_point, U, W, teleport, _T, safety, $0];
	department = null;
	if (((truthy(live(M)) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.gv(f, "prefs", rt.fv(f, "client", live(M)))))) {
		department = rt.gv(f, "prefered_security_department", rt.gv(f, "prefs", rt.fv(f, "client", live(M))));
		if ((!truthy(rt.length(rt.gl("available_depts"))) || isEqual(live(department), "None"))) {
			return live(f.dot);
		} else {
			if (truthy((rt.isIn(f, live(department), rt.gl("available_depts")) ? 1 : 0))) {
				if (truthy(rt.gl("available_depts"))) {
					(rt.modGl("available_depts", live(department), subtract));
					if (!truthy(rt.len(f, rt.gl("available_depts")))) {
						rt.setGl("available_depts", null);
					}
				}
			} else {
				department = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.gl("available_depts")]));
			}
		}
	}
	ears = null;
	accessory = null;
	dep_access = null;
	destination = null;
	spawn_point = null;
	$0 = live(department);
	if ($0 === "Supply") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/supply");
		dep_access = rt.list(50, 48, 54);
		destination = T("/area/security/checkpoint/supply");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/supply"), rt.gl("department_security_spawns"));
		accessory = T("/obj/item/clothing/accessory/armband/cargo");
	} else if ($0 === "Engineering") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/engi");
		dep_access = rt.list(32, 10);
		destination = T("/area/security/checkpoint/engineering");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/engineering"), rt.gl("department_security_spawns"));
		accessory = T("/obj/item/clothing/accessory/armband/engine");
	} else if ($0 === "Medical") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/med");
		dep_access = rt.list(5);
		destination = T("/area/security/checkpoint/medical");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/medical"), rt.gl("department_security_spawns"));
		accessory = T("/obj/item/clothing/accessory/armband/medblue");
	} else if ($0 === "Science") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/sci");
		dep_access = rt.list(47);
		destination = T("/area/security/checkpoint/science");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/science"), rt.gl("department_security_spawns"));
		accessory = T("/obj/item/clothing/accessory/armband/science");
	}
	if (truthy(live(accessory))) {
		yield* g.callName(f, (U = rt.fv(f, "w_uniform", live(H))), "attach_accessory", [(yield* g.new_(f, live(accessory), []))]);
	}
	if (truthy(live(ears))) {
		if (truthy(rt.fv(f, "ears", live(H)))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "ears", live(H))]);
		}
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, live(ears), [live(H)])), 7]);
	}
	(rt.modField(f, (W = rt.fv(f, "wear_id", live(H))), "access", live(dep_access), rt.bitOr));
	teleport = 0;
	if (!truthy(rt.fv(f, "sec_start_brig", rt.gl("config")))) {
		if ((truthy(live(destination)) || truthy(live(spawn_point)))) {
			teleport = 1;
		}
	}
	if (truthy(live(teleport))) {
		_T = null;
		if (truthy(live(spawn_point))) {
			_T = rt.getStep(f, live(spawn_point), 0);
			yield* g.callName(f, live(H), "Move", [live(_T)]);
		} else {
			safety = 0;
			while (rt.lt(live(safety), 25)) {
				if ((truthy((_T = (yield* g.call(f, P("/proc/safepick"), null, [(yield* g.call(f, P("/proc/get_area_turfs"), null, [live(destination)]))])))) && !truthy((yield* g.callName(f, live(H), "Move", [live(_T)]))))) {
					safety = rt.modify(live(safety), 1, add);
					continue;
				}
				break;
			}
		}
	}
	if (truthy(live(department))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<b>You have been assigned to ＀!</b>", [live(department)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<b>You have not been assigned to any department. Patrol the halls and help where needed.</b>"]);
	}
	return f.dot;
}, true);

rt.type(720, "/datum/outfit/job/security", "/datum/outfit/job", {
	name: "Security Officer",
	jobtype: rt.typePath("/datum/job/officer"),
	belt: rt.typePath("/obj/item/device/pda/security"),
	ears: rt.typePath("/obj/item/device/radio/headset/headset_sec/alt"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/security"),
	gloves: rt.typePath("/obj/item/clothing/gloves/color/black"),
	head: rt.typePath("/obj/item/clothing/head/helmet/sec"),
	suit: rt.typePath("/obj/item/clothing/suit/armor/vest/alt"),
	shoes: rt.typePath("/obj/item/clothing/shoes/jackboots"),
	l_pocket: rt.typePath("/obj/item/weapon/restraints/handcuffs"),
	r_pocket: rt.typePath("/obj/item/device/assembly/flash/handheld"),
	suit_store: rt.typePath("/obj/item/weapon/gun/energy/e_gun/advtaser"),
	backpack_contents: null,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/security"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel/sec"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/sec"),
	box: rt.typePath("/obj/item/weapon/storage/box/security"),
	implants: null,
});

// /datum/outfit/job/security/proc/<init>  (code/modules/jobs/job_types/security.dm:278)
rt.def("/datum/outfit/job/security/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]));
	$0 = $0;
	rt.setSv(f, "implants", rt.list(T("/obj/item/weapon/implant/mindshield")));
	return f.dot;
});

rt.type(9175, "/obj/item/device/radio/headset/headset_sec/alt/department", "/obj/item/device/radio/headset/headset_sec/alt", {});

// /obj/item/device/radio/headset/headset_sec/alt/department/proc/Initialize  (code/modules/jobs/job_types/security.dm:289)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/radio"), [live(f.src)])));
	rt.setSv(f, "secure_radio_connections", (yield* g.new_(f, T("/list"), [])));
	yield* g.srcCall(f, "recalculateChannels");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9176, "/obj/item/device/radio/headset/headset_sec/alt/department/engi", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// /obj/item/device/radio/headset/headset_sec/alt/department/engi/proc/<init>  (code/modules/jobs/job_types/security.dm:295)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/engi/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sec"), [])));
	$0 = $0;
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_eng"), [])));
	return f.dot;
}, true);

rt.type(9177, "/obj/item/device/radio/headset/headset_sec/alt/department/supply", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// /obj/item/device/radio/headset/headset_sec/alt/department/supply/proc/<init>  (code/modules/jobs/job_types/security.dm:299)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/supply/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sec"), [])));
	$0 = $0;
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_cargo"), [])));
	return f.dot;
}, true);

rt.type(9178, "/obj/item/device/radio/headset/headset_sec/alt/department/med", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// /obj/item/device/radio/headset/headset_sec/alt/department/med/proc/<init>  (code/modules/jobs/job_types/security.dm:303)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/med/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sec"), [])));
	$0 = $0;
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_med"), [])));
	return f.dot;
}, true);

rt.type(9179, "/obj/item/device/radio/headset/headset_sec/alt/department/sci", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// /obj/item/device/radio/headset/headset_sec/alt/department/sci/proc/<init>  (code/modules/jobs/job_types/security.dm:307)  may sleep
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/sci/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sec"), [])));
	$0 = $0;
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/headset_sci"), [])));
	return f.dot;
}, true);
