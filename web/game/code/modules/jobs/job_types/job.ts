// Based on /tg/station's code/modules/jobs/job_types/job.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(2742, "/datum/job", "/datum", {
	title: "NOPE",
	minimal_access: null,
	access: null,
	department_head: null,
	head_announce: null,
	flag: 0,
	department_flag: 0,
	faction: "None",
	total_positions: 0,
	spawn_positions: 0,
	current_positions: 0,
	supervisors: "",
	selection_color: "#ffffff",
	req_admin_notify: null,
	outfit: null,
});

// job.dm:6
rt.def("/datum/job/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.minimal_access = list();

	this.access = list();

	this.department_head = list();
	return f.dot;
});

// job.dm:54
rt.def("/datum/job/proc/announce", function announce(f: Frame, H: Value) {
	if (!this.head_announce) return f.dot;
	this.announce_head(H, this.head_announce);
	return f.dot;
});

// job.dm:59
rt.def("/datum/job/proc/equip", function* equip(f: Frame, H: Value, visualsOnly: Value, announce: Value) {
	visualsOnly ??= 0;
	announce ??= 1;
	if (!H) {
		return 0;
	}
	yield* H.dna.species.before_equip_job(this, H, visualsOnly);
	if (this.outfit) {
		yield* H.equipOutfit(this.outfit, visualsOnly);
	}
	yield* H.dna.species.after_equip_job(this, H, visualsOnly);
	if (!visualsOnly && announce) {
		yield* this.announce(H);
	}
	if (!(GLOB.config.enforce_human_authority && rt.isIn(f, this.title, GLOB.command_positions))) return f.dot;
	rt.setAt(H.dna.features, "tail_human", "None");
	rt.setAt(H.dna.features, "ears", "None");
	yield* H.regenerate_icons();
	return f.dot;
}, true);

// job.dm:79
rt.def("/datum/job/proc/get_access", function get_access(f: Frame) {
	if (!GLOB.config) {
		return this.minimal_access.Copy();
	}
	f.dot = list();
	if (GLOB.config.jobs_have_minimal_access) {
		f.dot = this.minimal_access.Copy();
	} else {
		f.dot = this.access.Copy();
	}
	if (!rt.bitAnd(GLOB.config.jobs_have_maint_access, 4)) return f.dot;
	(f.dot = rt.modify(f.dot, list(12), rt.bitOr));
	return f.dot;
});

// job.dm:93
rt.def("/datum/job/proc/announce_head", function announce_head(f: Frame, H: Value, channels: Value) {
	if (!(H && rt.len(f, GLOB.announcement_systems))) return f.dot;
	GLOB.SSticker.OnRoundstart(new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/addtimer"), new_(T("/datum/callback"), pick(GLOB.announcement_systems), P("/obj/machinery/announcement_system/proc/announce"), "NEWHEAD", H.real_name, H.job, channels), 1));
	return f.dot;
});

rt.type(682, "/datum/outfit/job", "/datum/outfit", {
	jobtype: null,
	pda_slot: 5,
	backpack: rt.typePath("/obj/item/weapon/storage/backpack"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/satchel"),
	duffelbag: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag"),
	box: rt.typePath("/obj/item/weapon/storage/box/survival"),
	name: "Standard Gear",
	uniform: rt.typePath("/obj/item/clothing/under/color/grey"),
	id: rt.typePath("/obj/item/weapon/card/id"),
	ears: rt.typePath("/obj/item/device/radio/headset"),
	belt: rt.typePath("/obj/item/device/pda"),
	back: rt.typePath("/obj/item/weapon/storage/backpack"),
	shoes: rt.typePath("/obj/item/clothing/shoes/sneakers/black"),
});

// job.dm:143
rt.def("/datum/outfit/job/proc/pre_equip", function pre_equip(f: Frame, H: Value, visualsOnly: Value) {
	visualsOnly ??= 0;
	if (H.backbag === "Grey Backpack") {
		this.back = T("/obj/item/weapon/storage/backpack");
	} else if (H.backbag === "Grey Satchel") {
		this.back = T("/obj/item/weapon/storage/backpack/satchel");
	} else if (H.backbag === "Grey Duffel Bag") {
		this.back = T("/obj/item/weapon/storage/backpack/duffelbag");
	} else if (H.backbag === "Leather Satchel") {
		this.back = T("/obj/item/weapon/storage/backpack/satchel/leather");
	} else if (H.backbag === "Department Satchel") {
		this.back = this.satchel;
	} else if (H.backbag === "Department Duffel Bag") {
		this.back = this.duffelbag;
	} else {
		this.back = this.backpack;
	}
	if (!this.box) return f.dot;
	if (!this.backpack_contents) {
		this.backpack_contents = list();
	}
	this.backpack_contents.Insert(1, this.box);
	rt.setAt(this.backpack_contents, this.box, 1);
	return f.dot;
});

// job.dm:169
rt.def("/datum/outfit/job/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let J: Value = null, C: Value = null, PDA: Value = null;
	visualsOnly ??= 0;
	if (visualsOnly) {
		return f.dot;
	}
	if (!(J = (yield* GLOB.SSjob.GetJobType(this.jobtype)))) {
		J = (yield* GLOB.SSjob.GetJob(H.job));
	}
	if (rt.istype((C = H.wear_id), T("/obj/item/weapon/card/id"))) {
		C.access = J.get_access();
		C.registered_name = H.real_name;
		C.assignment = J.title;
		C.update_label();
		yield* H.sec_hud_set_ID();
	}
	if (!rt.istype((PDA = H.get_item_by_slot(this.pda_slot)), T("/obj/item/device/pda"))) return f.dot;
	PDA.owner = H.real_name;
	PDA.ownjob = J.title;
	PDA.update_label();
	return f.dot;
}, true);
