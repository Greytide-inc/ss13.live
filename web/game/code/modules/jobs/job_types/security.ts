// Based on /tg/station's code/modules/jobs/job_types/security.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// security.dm:3
rt.def("/datum/job/proc/check_config_for_sec_maint", function check_config_for_sec_maint(f: Frame) {
	if (rt.bitAnd(GLOB.config.jobs_have_maint_access, 2)) {
		return list(12);
	}
	return list();
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

// security.dm:13
rt.def("/datum/job/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Captain");

	this.head_announce = list("Security");
	this.access = list(1, 63, 2, 3, 42, 66, 4, 6, 12, 21, 47, 10, 48, 5, 32, 50, 19, 58, 59, 60, 62, 12);
	this.minimal_access = list(1, 63, 2, 3, 42, 66, 4, 6, 12, 21, 47, 10, 48, 5, 32, 50, 19, 58, 59, 60, 62, 12);
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

// security.dm:51
rt.def("/datum/outfit/job/hos/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
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

// security.dm:66
rt.def("/datum/job/warden/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Security");
	this.access = list(1, 63, 2, 3, 42, 12, 6, 66, 4);
	this.minimal_access = list(1, 63, 2, 3, 42, 66);
	return f.dot;
});

// security.dm:81
rt.def("/datum/job/warden/proc/get_access", function get_access(f: Frame) {
	let L: Value = list();
	return (L = rt.bitOr(parent_proc(), this.check_config_for_sec_maint()));
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

// security.dm:100
rt.def("/datum/outfit/job/warden/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
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

// security.dm:116
rt.def("/datum/job/detective/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Security");
	this.access = list(63, 4, 6, 12, 42, 2, 66);
	this.minimal_access = list(63, 4, 6, 12, 42, 2, 66);
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

// security.dm:143
rt.def("/datum/outfit/job/detective/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/evidence"), 1, T("/obj/item/device/detective_scanner"), 1, T("/obj/item/weapon/melee/classic_baton"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
	return f.dot;
});

// security.dm:151
rt.def("/datum/outfit/job/detective/proc/post_equip", function* post_equip(f: Frame) {
	let cig: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	yield* (cig = f.args[0].wear_mask).light("");
	if (!f.args[1]) return f.dot;
	return f.dot;
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

// security.dm:164
rt.def("/datum/job/officer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Security");
	this.access = list(1, 63, 2, 42, 12, 6, 66, 4);
	this.minimal_access = list(1, 63, 2, 42, 66);
	return f.dot;
});

// security.dm:180
rt.def("/datum/job/officer/proc/get_access", function get_access(f: Frame) {
	let L: Value = list();
	(L = rt.modify(L, rt.bitOr(parent_proc(), this.check_config_for_sec_maint()), rt.bitOr));
	return L;
});

// security.dm:184
rt.def("/datum/controller/global_vars/proc/InitGlobalavailable_depts", function InitGlobalavailable_depts(f: Frame) {
	GLOB.available_depts = list("Engineering", "Medical", "Science", "Supply");
	this.gvars_datum_init_order += "available_depts";
	return f.dot;
});

// security.dm:189
rt.def("/datum/job/officer/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	let department: Value = null, ears: Value = null, accessory: Value = null, dep_access: Value = null, destination: Value = null, spawn_point: Value = null, U: Value = null, W: Value = null, _T: Value = null, safety: Value = null;
	if (M && M.client && M.client.prefs) {
		department = M.client.prefs.prefered_security_department;
		if (!rt.length(GLOB.available_depts) || department == "None") {
			return f.dot;
		} else if (rt.isIn(f, department, GLOB.available_depts)) {
			if (GLOB.available_depts) {
				GLOB.available_depts -= department;
				if (!rt.len(f, GLOB.available_depts)) {
					GLOB.available_depts = null;
				}
			}
		} else {
			department = pick_n_take(GLOB.available_depts);
		}
	}
	if (department === "Supply") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/supply");
		dep_access = list(50, 48, 54);
		destination = T("/area/security/checkpoint/supply");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/supply"), GLOB.department_security_spawns);
		accessory = T("/obj/item/clothing/accessory/armband/cargo");
	} else if (department === "Engineering") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/engi");
		dep_access = list(32, 10);
		destination = T("/area/security/checkpoint/engineering");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/engineering"), GLOB.department_security_spawns);
		accessory = T("/obj/item/clothing/accessory/armband/engine");
	} else if (department === "Medical") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/med");
		dep_access = list(5);
		destination = T("/area/security/checkpoint/medical");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/medical"), GLOB.department_security_spawns);
		accessory = T("/obj/item/clothing/accessory/armband/medblue");
	} else if (department === "Science") {
		ears = T("/obj/item/device/radio/headset/headset_sec/alt/department/sci");
		dep_access = list(47);
		destination = T("/area/security/checkpoint/science");
		spawn_point = rt.locateIn(f, T("/obj/effect/landmark/start/depsec/science"), GLOB.department_security_spawns);
		accessory = T("/obj/item/clothing/accessory/armband/science");
	}
	if (accessory) {
		yield* (U = H.w_uniform).attach_accessory((yield* new_(accessory)));
	}
	if (ears) {
		if (H.ears) {
			yield* qdel(H.ears);
		}
		yield* H.equip_to_slot_or_del((yield* new_(ears, H)), slot_ears);
	}
	(rt.modField(f, (W = H.wear_id), "access", dep_access, rt.bitOr));
	let teleport: Value = 0;
	if (!GLOB.config.sec_start_brig) {
		if (destination || spawn_point) {
			teleport = 1;
		}
	}
	if (teleport) {
		if (spawn_point) {
			_T = rt.getStep(f, spawn_point, 0);
			yield* H.Move(_T);
		} else {
			safety = 0;
			while (safety < 25) {
				if ((_T = safepick(get_area_turfs(destination))) && !(yield* H.Move(_T))) {
					safety += 1;
					continue;
				}
				break;
			}
		}
	}
	if (department) {
		to_chat(M, `<b>You have been assigned to ${department}!</b>`);
	} else {
		to_chat(M, "<b>You have not been assigned to any department. Patrol the halls and help where needed.</b>");
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

// security.dm:278
rt.def("/datum/outfit/job/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/baton/loaded"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/mindshield"));
	return f.dot;
});

rt.type(9175, "/obj/item/device/radio/headset/headset_sec/alt/department", "/obj/item/device/radio/headset/headset_sec/alt", {});

// security.dm:289
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/proc/Initialize", function* Initialize(f: Frame) {
	this.wires = (yield* new_(T("/datum/wires/radio"), this));
	this.secure_radio_connections = (yield* new_(T("/list")));
	this.recalculateChannels();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(9176, "/obj/item/device/radio/headset/headset_sec/alt/department/engi", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// security.dm:295
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/engi/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sec")));

	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/headset_eng")));
	return f.dot;
}, true);

rt.type(9177, "/obj/item/device/radio/headset/headset_sec/alt/department/supply", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// security.dm:299
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/supply/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sec")));

	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/headset_cargo")));
	return f.dot;
}, true);

rt.type(9178, "/obj/item/device/radio/headset/headset_sec/alt/department/med", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// security.dm:303
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/med/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sec")));

	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/headset_med")));
	return f.dot;
}, true);

rt.type(9179, "/obj/item/device/radio/headset/headset_sec/alt/department/sci", "/obj/item/device/radio/headset/headset_sec/alt/department", {
	keyslot: null,
	keyslot2: null,
});

// security.dm:307
rt.def("/obj/item/device/radio/headset/headset_sec/alt/department/sci/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/headset_sec")));

	this.keyslot2 = (yield* new_(T("/obj/item/device/encryptionkey/headset_sci")));
	return f.dot;
}, true);
