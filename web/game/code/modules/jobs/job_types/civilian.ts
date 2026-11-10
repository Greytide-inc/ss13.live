// Based on /tg/station's code/modules/jobs/job_types/civilian.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// civilian.dm:7
rt.def("/datum/job/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");

	this.access = list(46);

	this.minimal_access = list(46);
	return f.dot;
});

// civilian.dm:21
rt.def("/datum/job/clown/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	yield* H.rename_self("clown", M.client);
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

// civilian.dm:32
rt.def("/datum/outfit/job/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/stamp/clown"), 1, T("/obj/item/weapon/reagent_containers/spray/waterflower"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/grown/banana"), 1]);

	this.implants = list(T("/obj/item/weapon/implant/sad_trombone"));
	return f.dot;
});

// civilian.dm:48
rt.def("/datum/outfit/job/clown/proc/pre_equip", function pre_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	f.args[0].fully_replace_character_name(f.args[0].real_name, pick(GLOB.clown_names));
	return f.dot;
}, false, { args: ["H", "visualsOnly"] });

// civilian.dm:55
rt.def("/datum/outfit/job/clown/proc/post_equip", function* post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	yield* f.args[0].dna.add_mutation("Clumsiness");
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

// civilian.dm:67
rt.def("/datum/job/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");

	this.access = list(46);

	this.minimal_access = list(46);
	return f.dot;
});

// civilian.dm:81
rt.def("/datum/job/mime/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	yield* H.rename_self("mime", M.client);
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

// civilian.dm:93
rt.def("/datum/outfit/job/mime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing"), 1]);
	return f.dot;
});

// civilian.dm:101
rt.def("/datum/outfit/job/mime/proc/post_equip", function* post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	if (!f.args[0].mind) return f.dot;
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/mime_wall"), null)));
	yield* f.args[0].mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/mime/speak"), null)));
	f.args[0].mind.miming = 1;
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

// civilian.dm:117
rt.def("/datum/job/curator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");

	this.access = list(37);
	this.minimal_access = list(37, 32, 54);
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

// civilian.dm:140
rt.def("/datum/outfit/job/curator/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/melee/curator_whip"), 1, T("/obj/item/soapstone"), 1, T("/obj/item/weapon/barcodescanner"), 1]);
	return f.dot;
});

// civilian.dm:148
rt.def("/datum/outfit/job/curator/proc/post_equip", function* post_equip(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	yield* f.args[0].grant_all_languages({ omnitongue: 1 });
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

// civilian.dm:161
rt.def("/datum/job/lawyer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(38, 42, 63);
	this.minimal_access = list(38, 42, 63);
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

// civilian.dm:190
rt.def("/datum/outfit/job/lawyer/proc/pre_equip", function* pre_equip(f: Frame) {
	let J: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (f.args[1]) {
		return f.dot;
	}
	(J = (yield* GLOB.SSjob.GetJobType(this.jobtype))).lawyers++;
	if (!(J.lawyers > 1)) return f.dot;
	this.uniform = T("/obj/item/clothing/under/lawyer/purpsuit");
	this.suit = T("/obj/item/clothing/suit/toggle/lawyer/purple");
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });
