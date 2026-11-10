// Based on /tg/station's code/modules/jobs/job_types/civilian_chaplain.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2757, "/datum/job/chaplain", "/datum/job", {
	title: "Chaplain",
	flag: 1024,
	department_head: null,
	department_flag: 4,
	faction: "Station",
	total_positions: 1,
	spawn_positions: 1,
	supervisors: "the head of personnel",
	selection_color: "#dddddd",
	outfit: rt.typePath("/datum/outfit/job/chaplain"),
	access: null,
	minimal_access: null,
});

// civilian_chaplain.dm:8
rt.def("/datum/job/chaplain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.department_head = list("Head of Personnel");
	this.access = list(6, 22, 27, 46);
	this.minimal_access = list(6, 22, 27, 46);
	return f.dot;
});

// civilian_chaplain.dm:22
rt.def("/datum/job/chaplain/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	let nrt: Value = null, N: Value = null;
	if (H.mind) {
		H.mind.isholy = 1;
	}
	let B: Value = (yield* new_(T("/obj/item/weapon/storage/book/bible/booze")));
	if (GLOB.SSreligion.religion) {
		B.deity_name = GLOB.SSreligion.deity;
		B.name = GLOB.SSreligion.bible_name;
		B.icon_state = GLOB.SSreligion.bible_icon_state;
		B.item_state = GLOB.SSreligion.bible_item_state;
		to_chat(H, `There is already an established religion onboard the station. You are an acolyte of ${GLOB.SSreligion.deity}. Defer to the Chaplain.`);
		yield* H.equip_to_slot_or_del(B, slot_in_backpack);
		nrt = (GLOB.SSreligion.holy_weapon_type || T("/obj/item/weapon/nullrod"));
		N = (yield* new_(nrt, H));
		yield* H.equip_to_slot_or_del(N, slot_in_backpack);
		return f.dot;
	}
	let new_religion: Value = "Christianity";
	if (M.client && rt.index(M.client.prefs.custom_names, "religion")) {
		new_religion = rt.index(M.client.prefs.custom_names, "religion");
	}
	let new_deity: Value = "Space Jesus";
	if (M.client && rt.index(M.client.prefs.custom_names, "deity")) {
		new_deity = rt.index(M.client.prefs.custom_names, "deity");
	}
	B.deity_name = new_deity;
	const lowertext_2 = lowertext(new_religion);
	if (lowertext_2 === "christianity") {
		B.name = pick("The Holy Bible", "The Dead Sea Scrolls");
	} else if (lowertext_2 === "satanism") {
		B.name = "The Unholy Bible";
	} else if (lowertext_2 === "cthulu") {
		B.name = "The Necronomicon";
	} else if (lowertext_2 === "islam") {
		B.name = "Quran";
	} else if (lowertext_2 === "scientology") {
		B.name = pick("The Biography of L. Ron Hubbard", "Dianetics");
	} else if (lowertext_2 === "chaos") {
		B.name = "The Book of Lorgar";
	} else if (lowertext_2 === "imperium") {
		B.name = "Uplifting Primer";
	} else if (lowertext_2 === "toolboxia") {
		B.name = "Toolbox Manifesto";
	} else if (lowertext_2 === "homosexuality") {
		B.name = "Guys Gone Wild";
	} else if (lowertext_2 === "lol" || lowertext_2 === "wtf" || lowertext_2 === "gay" || lowertext_2 === "penis" || lowertext_2 === "ass" || lowertext_2 === "poo" || lowertext_2 === "badmin" || lowertext_2 === "shitmin" || lowertext_2 === "deadmin" || lowertext_2 === "cock" || lowertext_2 === "cocks" || lowertext_2 === "meme" || lowertext_2 === "memes") {
		B.name = pick("Woodys Got Wood: The Aftermath", "War of the Cocks", "Sweet Bro and Hella Jef: Expanded Edition");
		H.setBrainLoss(100);
	} else if (lowertext_2 === "science") {
		B.name = pick("Principle of Relativity", "Quantum Enigma: Physics Encounters Consciousness", "Programming the Universe", "Quantum Physics and Theology", "String Theory for Dummies", "How To: Build Your Own Warp Drive", "The Mysteries of Bluespace", "Playing God: Collector's Edition");
	} else {
		B.name = `The Holy Book of ${new_religion}`;
	}
	if (GLOB.SSreligion) {
		GLOB.SSreligion.religion = new_religion;
		GLOB.SSreligion.bible_name = B.name;
		GLOB.SSreligion.deity = B.deity_name;
	}
	yield* H.equip_to_slot_or_del(B, slot_in_backpack);
	return f.dot;
}, true);

rt.type(700, "/datum/outfit/job/chaplain", "/datum/outfit/job", {
	name: "Chaplain",
	jobtype: rt.typePath("/datum/job/chaplain"),
	belt: rt.typePath("/obj/item/device/pda/chaplain"),
	uniform: rt.typePath("/obj/item/clothing/under/rank/chaplain"),
	backpack_contents: null,
	accessory: rt.typePath("/obj/item/clothing/accessory/pocketprotector/cosmetology"),
	backpack: rt.typePath("/obj/item/weapon/storage/backpack/cultpack"),
	satchel: rt.typePath("/obj/item/weapon/storage/backpack/cultpack"),
});

// civilian_chaplain.dm:94
rt.def("/datum/outfit/job/chaplain/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/device/camera/spooky"), 1]);
	return f.dot;
});
