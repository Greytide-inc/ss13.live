// From code/modules/jobs/job_types/civilian_chaplain.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/job/chaplain/proc/<init>  (code/modules/jobs/job_types/civilian_chaplain.dm:8)
rt.def("/datum/job/chaplain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "department_head", rt.list("Head of Personnel"));
	rt.setSv(f, "access", rt.list(6, 22, 27, 46));
	rt.setSv(f, "minimal_access", rt.list(6, 22, 27, 46));
	return f.dot;
});

// /datum/job/chaplain/proc/after_spawn  (code/modules/jobs/job_types/civilian_chaplain.dm:22)  may sleep
rt.def("/datum/job/chaplain/proc/after_spawn", function* after_spawn(f: Frame, H: Value, M: Value) {
	let B: Value = null, nrt: Value = null, N: Value = null, new_religion: Value = null, new_deity: Value = null;
	let $0: any;
	f.vars = () => [H, M, B, nrt, N, new_religion, new_deity, $0];
	if (truthy(rt.fv(f, "mind", live(H)))) {
		rt.setFv(f, "isholy", rt.fv(f, "mind", live(H)), 1);
	}
	B = (yield* g.new_(f, T("/obj/item/weapon/storage/book/bible/booze"), []));
	if (truthy(rt.fv(f, "religion", rt.gl("SSreligion")))) {
		rt.setFv(f, "deity_name", live(B), rt.fv(f, "deity", rt.gl("SSreligion")));
		rt.setFv(f, "name", live(B), rt.fv(f, "bible_name", rt.gl("SSreligion")));
		rt.setFv(f, "icon_state", live(B), rt.fv(f, "bible_icon_state", rt.gl("SSreligion")));
		rt.setFv(f, "item_state", live(B), rt.fv(f, "bible_item_state", rt.gl("SSreligion")));
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("There is already an established religion onboard the station. You are an acolyte of ＀. Defer to the Chaplain.", [rt.fv(f, "deity", rt.gl("SSreligion"))])]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(B), 18]);
		nrt = (rt.fv(f, "holy_weapon_type", rt.gl("SSreligion")) || T("/obj/item/weapon/nullrod"));
		N = (yield* g.new_(f, live(nrt), [live(H)]));
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(N), 18]);
		return live(f.dot);
	}
	new_religion = "Christianity";
	if ((truthy(rt.fv(f, "client", live(M))) && truthy(rt.index(rt.gv(f, "custom_names", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), "religion")))) {
		new_religion = rt.index(rt.gv(f, "custom_names", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), "religion");
	}
	new_deity = "Space Jesus";
	if ((truthy(rt.fv(f, "client", live(M))) && truthy(rt.index(rt.gv(f, "custom_names", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), "deity")))) {
		new_deity = rt.index(rt.gv(f, "custom_names", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), "deity");
	}
	rt.setFv(f, "deity_name", live(B), live(new_deity));
	$0 = (yield* g.call(f, P("/proc/lowertext"), null, [live(new_religion)]));
	if ($0 === "christianity") {
		rt.setFv(f, "name", live(B), rt.op(f, "PickUnweighted", [2], ["The Holy Bible", "The Dead Sea Scrolls"]));
	} else if ($0 === "satanism") {
		rt.setFv(f, "name", live(B), "The Unholy Bible");
	} else if ($0 === "cthulu") {
		rt.setFv(f, "name", live(B), "The Necronomicon");
	} else if ($0 === "islam") {
		rt.setFv(f, "name", live(B), "Quran");
	} else if ($0 === "scientology") {
		rt.setFv(f, "name", live(B), rt.op(f, "PickUnweighted", [2], ["The Biography of L. Ron Hubbard", "Dianetics"]));
	} else if ($0 === "chaos") {
		rt.setFv(f, "name", live(B), "The Book of Lorgar");
	} else if ($0 === "imperium") {
		rt.setFv(f, "name", live(B), "Uplifting Primer");
	} else if ($0 === "toolboxia") {
		rt.setFv(f, "name", live(B), "Toolbox Manifesto");
	} else if ($0 === "homosexuality") {
		rt.setFv(f, "name", live(B), "Guys Gone Wild");
	} else if ($0 === "lol" || $0 === "wtf" || $0 === "gay" || $0 === "penis" || $0 === "ass" || $0 === "poo" || $0 === "badmin" || $0 === "shitmin" || $0 === "deadmin" || $0 === "cock" || $0 === "cocks" || $0 === "meme" || $0 === "memes") {
		rt.setFv(f, "name", live(B), rt.op(f, "PickUnweighted", [3], ["Woodys Got Wood: The Aftermath", "War of the Cocks", "Sweet Bro and Hella Jef: Expanded Edition"]));
		yield* g.callName(f, live(H), "setBrainLoss", [100]);
	} else if ($0 === "science") {
		rt.setFv(f, "name", live(B), rt.op(f, "PickUnweighted", [8], ["Principle of Relativity", "Quantum Enigma: Physics Encounters Consciousness", "Programming the Universe", "Quantum Physics and Theology", "String Theory for Dummies", "How To: Build Your Own Warp Drive", "The Mysteries of Bluespace", "Playing God: Collector's Edition"]));
	} else {
		rt.setFv(f, "name", live(B), fmt("The Holy Book of ＀", [live(new_religion)]));
	}
	if (truthy(rt.gl("SSreligion"))) {
		rt.setFv(f, "religion", rt.gl("SSreligion"), live(new_religion));
		rt.setFv(f, "bible_name", rt.gl("SSreligion"), rt.fv(f, "name", live(B)));
		rt.setFv(f, "deity", rt.gl("SSreligion"), rt.fv(f, "deity_name", live(B)));
	}
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [live(B), 18]);
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

// /datum/outfit/job/chaplain/proc/<init>  (code/modules/jobs/job_types/civilian_chaplain.dm:94)
rt.def("/datum/outfit/job/chaplain/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "backpack_contents", rt.alist(f, [T("/obj/item/device/camera/spooky"), 1]));
	return f.dot;
});
