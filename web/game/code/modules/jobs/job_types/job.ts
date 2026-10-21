// From code/modules/jobs/job_types/job.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/job/proc/<init>  (code/modules/jobs/job_types/job.dm:6)
rt.def("/datum/job/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "minimal_access", rt.list());
	$0 = $0;
	rt.setSv(f, "access", rt.list());
	$0 = $0;
	rt.setSv(f, "department_head", rt.list());
	return f.dot;
});

// /datum/job/proc/announce  (code/modules/jobs/job_types/job.dm:54)
rt.def("/datum/job/proc/announce", function announce(f: Frame, H: Value) {
	if (!truthy(rt.sv(f, "head_announce"))) return f.dot;
	rt.callSrc(f, "announce_head", [live(H), rt.sv(f, "head_announce")]);
	return f.dot;
});

// /datum/job/proc/equip  (code/modules/jobs/job_types/job.dm:59)  may sleep
rt.def("/datum/job/proc/equip", function* equip(f: Frame, H: Value, visualsOnly: Value, announce: Value) {
	f.vars = () => [H, visualsOnly, announce];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	if (live(announce) === null) {
		announce = 1;
	}
	if (!truthy(live(H))) {
		return 0;
	}
	yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "before_equip_job", [live(f.src), live(H), live(visualsOnly)]);
	if (truthy(rt.sv(f, "outfit"))) {
		yield* g.callName(f, live(H), "equipOutfit", [rt.sv(f, "outfit"), live(visualsOnly)]);
	}
	yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(H))), "after_equip_job", [live(f.src), live(H), live(visualsOnly)]);
	if ((!truthy(live(visualsOnly)) && truthy(live(announce)))) {
		yield* g.srcCall(f, "announce", live(H));
	}
	if (!(truthy(rt.fv(f, "enforce_human_authority", rt.gl("config"))) && truthy((rt.isIn(f, rt.sv(f, "title"), rt.gl("command_positions")) ? 1 : 0)))) return f.dot;
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "tail_human", "None");
	rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "ears", "None");
	yield* g.callName(f, live(H), "regenerate_icons", []);
	return f.dot;
}, true);

// /datum/job/proc/get_access  (code/modules/jobs/job_types/job.dm:79)
rt.def("/datum/job/proc/get_access", function get_access(f: Frame) {
	if (!truthy(rt.gl("config"))) {
		return rt.callName(f, rt.fv(f, "minimal_access", live(f.src)), "Copy", []);
	}
	f.dot = rt.list();
	if (truthy(rt.fv(f, "jobs_have_minimal_access", rt.gl("config")))) {
		f.dot = rt.callName(f, rt.fv(f, "minimal_access", live(f.src)), "Copy", []);
	} else {
		f.dot = rt.callName(f, rt.fv(f, "access", live(f.src)), "Copy", []);
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "jobs_have_maint_access", rt.gl("config")), 4))) return f.dot;
	(f.dot = rt.modify(live(f.dot), rt.list(12), rt.bitOr));
	return f.dot;
});

// /datum/job/proc/announce_head  (code/modules/jobs/job_types/job.dm:93)
rt.def("/datum/job/proc/announce_head", function announce_head(f: Frame, H: Value, channels: Value) {
	if (!(truthy(live(H)) && truthy(rt.len(f, rt.gl("announcement_systems"))))) return f.dot;
	rt.callName(f, rt.gl("SSticker"), "OnRoundstart", [rt.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/addtimer"), rt.new_(f, T("/datum/callback"), [rt.op(f, "PickUnweighted", [1], [rt.gl("announcement_systems")]), P("/obj/machinery/announcement_system/proc/announce"), "NEWHEAD", rt.fv(f, "real_name", live(H)), rt.fv(f, "job", live(H)), live(channels)]), 1])]);
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

// /datum/outfit/job/proc/pre_equip  (code/modules/jobs/job_types/job.dm:143)
rt.def("/datum/outfit/job/proc/pre_equip", function pre_equip(f: Frame, H: Value, visualsOnly: Value) {
	let $0: any;
	f.vars = () => [visualsOnly, $0];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	$0 = rt.fv(f, "backbag", live(H));
	if ($0 === "Grey Backpack") {
		rt.setSv(f, "back", T("/obj/item/weapon/storage/backpack"));
	} else if ($0 === "Grey Satchel") {
		rt.setSv(f, "back", T("/obj/item/weapon/storage/backpack/satchel"));
	} else if ($0 === "Grey Duffel Bag") {
		rt.setSv(f, "back", T("/obj/item/weapon/storage/backpack/duffelbag"));
	} else if ($0 === "Leather Satchel") {
		rt.setSv(f, "back", T("/obj/item/weapon/storage/backpack/satchel/leather"));
	} else if ($0 === "Department Satchel") {
		rt.setSv(f, "back", rt.sv(f, "satchel"));
	} else if ($0 === "Department Duffel Bag") {
		rt.setSv(f, "back", rt.sv(f, "duffelbag"));
	} else {
		rt.setSv(f, "back", rt.sv(f, "backpack"));
	}
	if (!truthy(rt.sv(f, "box"))) return f.dot;
	if (!truthy(rt.sv(f, "backpack_contents"))) {
		rt.setSv(f, "backpack_contents", rt.list());
	}
	rt.callName(f, rt.sv(f, "backpack_contents"), "Insert", [1, rt.sv(f, "box")]);
	rt.setAt(rt.sv(f, "backpack_contents"), rt.sv(f, "box"), 1);
	return f.dot;
});

// /datum/outfit/job/proc/post_equip  (code/modules/jobs/job_types/job.dm:169)  may sleep
rt.def("/datum/outfit/job/proc/post_equip", function* post_equip(f: Frame, H: Value, visualsOnly: Value) {
	let J: Value = null, C: Value = null, PDA: Value = null;
	f.vars = () => [H, visualsOnly, J, C, PDA];
	if (live(visualsOnly) === null) {
		visualsOnly = 0;
	}
	if (truthy(live(visualsOnly))) {
		return live(f.dot);
	}
	if (!truthy((J = (yield* g.callName(f, rt.gl("SSjob"), "GetJobType", [rt.sv(f, "jobtype")]))))) {
		J = (yield* g.callName(f, rt.gl("SSjob"), "GetJob", [rt.fv(f, "job", live(H))]));
	}
	if (truthy((rt.istype((C = rt.fv(f, "wear_id", live(H))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		rt.setFv(f, "access", live(C), (yield* g.callName(f, live(J), "get_access", [])));
		rt.setFv(f, "registered_name", live(C), rt.fv(f, "real_name", live(H)));
		rt.setFv(f, "assignment", live(C), rt.fv(f, "title", live(J)));
		yield* g.callName(f, live(C), "update_label", []);
		yield* g.callName(f, live(H), "sec_hud_set_ID", []);
	}
	if (!truthy((rt.istype((PDA = (yield* g.callName(f, live(H), "get_item_by_slot", [rt.sv(f, "pda_slot")]))), T("/obj/item/device/pda")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "owner", live(PDA), rt.fv(f, "real_name", live(H)));
	rt.setFv(f, "ownjob", live(PDA), rt.fv(f, "title", live(J)));
	yield* g.callName(f, live(PDA), "update_label", []);
	return f.dot;
}, true);
