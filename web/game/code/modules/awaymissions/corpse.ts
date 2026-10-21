// From code/modules/awaymissions/corpse.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11954, "/obj/effect/mob_spawn", "/obj/effect", {
	mob_type: null,
	mob_name: "",
	mob_gender: null,
	death: 1,
	roundstart: 1,
	instant: 0,
	flavour_text: "The mapper forgot to set this!",
	faction: null,
	permanent: 0,
	random: 0,
	objectives: null,
	uses: 1,
	brute_damage: 0,
	oxy_damage: 0,
	burn_damage: 0,
	mob_color: null,
	banType: "lavaland",
	anchored: 1,
	name: "Unknown",
	density: 1,
});

// /obj/effect/mob_spawn/proc/attack_ghost  (code/modules/awaymissions/corpse.dm:28)  may sleep
rt.def("/obj/effect/mob_spawn/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let ghost_role: Value = null;
	f.vars = () => [user, ghost_role];
	if ((!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", []))) || !truthy(rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "uses"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This spawner is out of charges!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(user), rt.sv(f, "banType")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You are jobanned!</span>"]);
		return live(f.dot);
	}
	if ((isEqual((ghost_role = (yield* g.call(f, P("/proc/alert"), null, [fmt("Become ＀? (Warning, You can no longer be cloned!)", [rt.sv(f, "mob_name")]), null, "Yes", "No"]))), "No") || !truthy(rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ became ＀", [rt.fv(f, "ckey", live(user)), rt.sv(f, "mob_name")])]);
	yield* g.callSrc(f, "create", ["ckey", rt.fv(f, "ckey", live(user))], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/mob_spawn/proc/Initialize  (code/modules/awaymissions/corpse.dm:43)  may sleep
rt.def("/obj/effect/mob_spawn/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if ((truthy(rt.sv(f, "instant")) || (truthy(rt.sv(f, "roundstart")) && (truthy(live(f.args[0])) || (truthy(rt.gl("SSticker")) && rt.gt(rt.fv(f, "current_state", rt.gl("SSticker")), 2)))))) {
		yield* g.srcCall(f, "create");
	} else {
		(rt.modGl("poi_list", live(f.src), rt.bitOr));
	}
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/effect/mob_spawn/proc/Destroy  (code/modules/awaymissions/corpse.dm:50)  may sleep
rt.def("/obj/effect/mob_spawn/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("poi_list"), "Remove", [live(f.src)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/mob_spawn/proc/create  (code/modules/awaymissions/corpse.dm:60)  may sleep
rt.def("/obj/effect/mob_spawn/proc/create", function* create(f: Frame, ckey: Value, flavour: Value, name: Value) {
	let M: Value = null, MM: Value = null, objective: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [ckey, flavour, name, M, MM, objective, $0, $1, $e];
	if (live(flavour) === null) {
		flavour = 1;
	}
	M = (yield* g.new_(f, rt.sv(f, "mob_type"), [rt.getStep(f, live(f.src), 0)]));
	if (!truthy(rt.sv(f, "random"))) {
		$0 = live(M);
		if (truthy(rt.sv(f, "mob_name"))) {
			$1 = rt.sv(f, "mob_name");
		} else {
			$1 = rt.fv(f, "name", live(M));
		}
		rt.setFv(f, "real_name", $0, $1);
		if (!truthy(rt.sv(f, "mob_gender"))) {
			rt.setSv(f, "mob_gender", rt.op(f, "PickUnweighted", [2], ["male", "female"]));
		}
		rt.setFv(f, "gender", live(M), rt.sv(f, "mob_gender"));
	}
	if (truthy(rt.sv(f, "faction"))) {
		rt.setFv(f, "faction", live(M), rt.list(rt.sv(f, "faction")));
	}
	if (truthy(rt.sv(f, "death"))) {
		yield* g.callName(f, live(M), "death", [1]);
	}
	yield* g.callName(f, live(M), "adjustOxyLoss", [rt.sv(f, "oxy_damage")]);
	yield* g.callName(f, live(M), "adjustBruteLoss", [rt.sv(f, "brute_damage")]);
	yield* g.callName(f, live(M), "adjustFireLoss", [rt.sv(f, "burn_damage")]);
	rt.setFv(f, "color", live(M), rt.sv(f, "mob_color"));
	yield* g.srcCall(f, "equip", live(M));
	if (truthy(live(ckey))) {
		rt.setFv(f, "ckey", live(M), live(ckey));
		if (truthy(live(flavour))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀", [rt.sv(f, "flavour_text")])]);
		}
		MM = rt.fv(f, "mind", live(M));
		if (truthy(rt.sv(f, "objectives"))) {
			objective = null;
			rt.forList(f, 0, rt.sv(f, "objectives"));
			while (($e = rt.next(f, 0)) !== undefined) {
				objective = $e;
				rt.modField(f, live(MM), "objectives", (yield* g.new_(f, T("/datum/objective"), [live(objective)])), add);
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "special", live(M), live(name));
		rt.setFv(f, "name", live(MM), rt.fv(f, "real_name", live(M)));
	}
	if (rt.gt(rt.sv(f, "uses"), 0)) {
		rt.incSrcVar(f, "uses", -1, true);
	}
	if (!(!truthy(rt.sv(f, "permanent")) && !truthy(rt.sv(f, "uses")))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11955, "/obj/effect/mob_spawn/human", "/obj/effect/mob_spawn", {
	mob_species: null,
	outfit: rt.typePath("/datum/outfit"),
	disable_pda: 1,
	id_job: null,
	id_access: null,
	id_access_list: null,
	husk: null,
	uniform: -1,
	r_hand: -1,
	l_hand: -1,
	suit: -1,
	shoes: -1,
	gloves: -1,
	ears: -1,
	glasses: -1,
	mask: -1,
	head: -1,
	belt: -1,
	r_pocket: -1,
	l_pocket: -1,
	back: -1,
	id: -1,
	neck: -1,
	backpack_contents: -1,
	suit_store: -1,
	mob_type: rt.typePath("/mob/living/carbon/human"),
});

// /obj/effect/mob_spawn/human/proc/Initialize  (code/modules/awaymissions/corpse.dm:127)  may sleep
rt.def("/obj/effect/mob_spawn/human/proc/Initialize", function* Initialize(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "outfit")])))) {
		rt.setSv(f, "outfit", (yield* g.new_(f, rt.sv(f, "outfit"), [])));
	}
	if (!truthy(rt.sv(f, "outfit"))) {
		rt.setSv(f, "outfit", (yield* g.new_(f, T("/datum/outfit"), [])));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/mob_spawn/human/proc/equip  (code/modules/awaymissions/corpse.dm:135)  may sleep
rt.def("/obj/effect/mob_spawn/human/proc/equip", function* equip(f: Frame, H: Value) {
	let slot: Value = null, _T: Value = null, PDA: Value = null, W: Value = null, jobtype: Value = null, J: Value = null;
	let $e: any;
	f.vars = () => [H, slot, _T, PDA, W, jobtype, J, $e];
	if (truthy(rt.sv(f, "mob_species"))) {
		yield* g.callName(f, live(H), "set_species", [rt.sv(f, "mob_species")]);
	}
	if (truthy(rt.sv(f, "husk"))) {
		yield* g.callName(f, live(H), "Drain", []);
	} else {
		yield* g.callName(f, live(H), "cure_husk", []);
	}
	rt.setFv(f, "underwear", live(H), "Nude");
	rt.setFv(f, "undershirt", live(H), "Nude");
	rt.setFv(f, "socks", live(H), "Nude");
	if (truthy(rt.sv(f, "outfit"))) {
		slot = null;
		rt.forList(f, 0, rt.gl("slots#2"));
		while (($e = rt.next(f, 0)) !== undefined) {
			slot = $e;
			if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [(_T = rt.index(rt.sv(f, "vars"), live(slot)))])))) {
				rt.setAt(rt.fv(f, "vars", rt.sv(f, "outfit")), live(slot), live(_T));
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(H), "equipOutfit", [rt.sv(f, "outfit")]);
		if (truthy(rt.sv(f, "disable_pda"))) {
			if (truthy((PDA = rt.locateIn(f, T("/obj/item/device/pda"), live(H))))) {
				rt.setFv(f, "toff", live(PDA), 1);
			}
		}
	}
	if (!truthy((W = rt.fv(f, "wear_id", live(H))))) return f.dot;
	if (truthy(rt.sv(f, "id_access"))) {
		jobtype = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/job")])));
		while (($e = rt.next(f, 0)) !== undefined) {
			jobtype = $e;
			if (isEqual(rt.gv(f, "title", (J = (yield* g.new_(f, live(jobtype), [])))), rt.sv(f, "id_access"))) {
				rt.setFv(f, "access", live(W), (yield* g.callName(f, live(J), "get_access", [])));
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "id_access_list"))) {
		if (!truthy((rt.istype(rt.fv(f, "access", live(W)), T("/list")) ? 1 : 0))) {
			rt.setFv(f, "access", live(W), rt.list());
		}
		(rt.modField(f, live(W), "access", rt.sv(f, "id_access_list"), rt.bitOr));
	}
	if (truthy(rt.sv(f, "id_job"))) {
		rt.setFv(f, "assignment", live(W), rt.sv(f, "id_job"));
	}
	rt.setFv(f, "registered_name", live(W), rt.fv(f, "real_name", live(H)));
	yield* g.callName(f, live(W), "update_label", []);
	return f.dot;
}, true);

rt.type(12025, "/obj/effect/mob_spawn/AICorpse", "/obj/effect/mob_spawn", {});

// /obj/effect/mob_spawn/AICorpse/proc/create  (code/modules/awaymissions/corpse.dm:190)  may sleep
rt.def("/obj/effect/mob_spawn/AICorpse/proc/create", function* create(f: Frame) {
	let A: Value = null, M: Value = null;
	f.vars = () => [A, M];
	if (truthy((A = rt.locateIn(f, T("/mob/living/silicon/ai"), rt.sv(f, "loc"))))) {
		return live(f.dot);
	}
	rt.setFv(f, "name", (M = (yield* g.new_(f, T("/mob/living/silicon/ai/spawned"), [rt.sv(f, "loc")]))), rt.fv(f, "name", live(f.src)));
	rt.setFv(f, "real_name", live(M), rt.fv(f, "name", live(f.src)));
	rt.setFv(f, "toff", rt.fv(f, "aiPDA", live(M)), 1);
	yield* g.callName(f, live(M), "death", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11994, "/obj/effect/mob_spawn/human/facehugger", "/obj/effect/mob_spawn/human", {});

// /obj/effect/mob_spawn/human/facehugger/proc/create  (code/modules/awaymissions/corpse.dm:210)  may sleep
rt.def("/obj/effect/mob_spawn/human/facehugger/proc/create", function* create(f: Frame) {
	let O: Value = null;
	f.vars = () => [O];
	rt.setFv(f, "name", (O = (yield* g.new_(f, T("/obj/item/clothing/mask/facehugger"), [rt.fv(f, "loc", live(f.src))]))), rt.fv(f, "name", live(f.src)));
	yield* g.callName(f, live(O), "Die", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(11964, "/obj/effect/mob_spawn/human/doctor/alive", "/obj/effect/mob_spawn/human/doctor", {
	death: 0,
	roundstart: 0,
	random: 1,
	name: "sleeper",
	icon: rt.rsc("icons/obj/cryogenic2.dmi"),
	icon_state: "sleeper",
	flavour_text: "You are a space doctor!",
});

// /obj/effect/mob_spawn/human/doctor/alive/proc/equip  (code/modules/awaymissions/corpse.dm:256)  may sleep
rt.def("/obj/effect/mob_spawn/human/doctor/alive/proc/equip", function* equip(f: Frame) {
	let del_types: Value = null, del_type: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [del_types, del_type, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	del_types = rt.list(T("/obj/item/device/pda"), T("/obj/item/device/radio/headset"));
	del_type = null;
	rt.forList(f, 0, live(del_types));
	while (($e = rt.next(f, 0)) !== undefined) {
		del_type = $e;
		yield* g.call(f, P("/proc/qdel"), null, [(I = rt.locateIn(f, live(del_type), live(f.args[0])))]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["H"] });

rt.type(12005, "/obj/effect/mob_spawn/human/bartender", "/obj/effect/mob_spawn/human", {
	id_job: "Bartender",
	outfit: rt.typePath("/datum/outfit/spacebartender"),
	name: "Space Bartender",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/bartender/proc/<init>  (code/modules/awaymissions/corpse.dm:297)
rt.def("/obj/effect/mob_spawn/human/bartender/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(25));
	return f.dot;
});

rt.type(638, "/datum/outfit/beachbum", "/datum/outfit", {
	name: "Beach Bum",
	glasses: rt.typePath("/obj/item/clothing/glasses/sunglasses"),
	uniform: rt.typePath("/obj/item/clothing/under/shorts/red"),
	r_pocket: rt.typePath("/obj/item/weapon/storage/wallet/random"),
});

// /datum/outfit/beachbum/proc/post_equip  (code/modules/awaymissions/corpse.dm:339)  may sleep
rt.def("/datum/outfit/beachbum/proc/post_equip", function* post_equip(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "add_mutation", ["Stoner"]);
	return f.dot;
}, true, { args: ["H", "visualsOnly"] });

rt.type(12009, "/obj/effect/mob_spawn/human/bridgeofficer", "/obj/effect/mob_spawn/human", {
	id_job: "Bridge Officer",
	outfit: rt.typePath("/datum/outfit/nanotrasenbridgeofficercorpse"),
	name: "Bridge Officer",
	id_access_list: null,
});

// /obj/effect/mob_spawn/human/bridgeofficer/proc/<init>  (code/modules/awaymissions/corpse.dm:349)
rt.def("/obj/effect/mob_spawn/human/bridgeofficer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "id_access_list", rt.list(109));
	return f.dot;
});

rt.type(11993, "/obj/effect/mob_spawn/human/alive/space_bar_patron", "/obj/effect/mob_spawn/human/alive", {
	outfit: rt.typePath("/datum/outfit/spacebartender"),
	name: "Bar cryogenics",
	mob_name: "Bar patron",
	random: 1,
	permanent: 1,
	uses: -1,
});

// /obj/effect/mob_spawn/human/alive/space_bar_patron/proc/attack_hand  (code/modules/awaymissions/corpse.dm:470)  may sleep
rt.def("/obj/effect/mob_spawn/human/alive/space_bar_patron/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let despawn: Value = null;
	f.vars = () => [user, despawn];
	if (((isEqual((despawn = (yield* g.call(f, P("/proc/alert"), null, ["Return to cryosleep? (Warning, Your mob will be deleted!)", null, "Yes", "No"]))), "No") || !truthy(rt.sv(f, "loc"))) || !truthy((yield* g.srcCall(f, "Adjacent", live(user)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ climbs back into cryosleep...</span>", [rt.fv(f, "name", live(user))])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(user)]);
	return f.dot;
}, true);
