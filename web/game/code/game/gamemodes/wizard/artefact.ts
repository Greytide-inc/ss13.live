// From code/game/gamemodes/wizard/artefact.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6691, "/obj/item/weapon/veilrender", "/obj/item/weapon", {
	charges: 1,
	spawn_amt: 1,
	activate_descriptor: "reality",
	rend_desc: "You should run now.",
	spawn_fast: 0,
	spawn_type: rt.typePath("/obj/singularity/wizard"),
	name: "veil render",
	desc: "A wicked curved blade of alien origin, recovered from the ruins of a vast city.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "render",
	item_state: "render",
	force: 15,
	throwforce: 10,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// /obj/item/weapon/veilrender/proc/attack_self  (code/game/gamemodes/wizard/artefact.dm:24)
rt.def("/obj/item/weapon/veilrender/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (rt.gt(rt.sv(f, "charges"), 0)) {
		rt.new_(f, T("/obj/effect/rend"), [rt.getStep(f, live(user), 0), rt.sv(f, "spawn_type"), rt.sv(f, "spawn_amt"), rt.sv(f, "rend_desc"), rt.sv(f, "spawn_fast")]);
		rt.incSrcVar(f, "charges", -1, true);
		rt.callName(f, live(user), "visible_message", [fmt("<span class='boldannounce'>＀ hums with power as ＀ deals a blow to ＀ itself!</span>", [live(f.src), live(user), rt.sv(f, "activate_descriptor")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>The unearthly energies that powered the blade are now dormant.</span>"]);
	}
	return f.dot;
});

rt.type(11773, "/obj/effect/rend", "/obj/effect", {
	spawn_path: rt.typePath("/mob/living/simple_animal/cow"),
	spawn_amt_left: 20,
	spawn_fast: 0,
	anchored: 1,
	name: "tear in the fabric of reality",
	desc: "You should run now.",
	icon: rt.rsc("icons/obj/biomass.dmi"),
	icon_state: "rift",
	density: 1,
});

// /obj/effect/rend/proc/New  (code/game/gamemodes/wizard/artefact.dm:47)
rt.def("/obj/effect/rend/proc/New", function New(f: Frame, loc: Value, spawn_type: Value, spawn_amt: Value, desc: Value, spawn_fast: Value) {
	rt.setFv(f, "spawn_path", live(f.src), live(spawn_type));
	rt.setFv(f, "spawn_amt_left", live(f.src), live(spawn_amt));
	rt.setFv(f, "desc", live(f.src), live(desc));
	rt.setFv(f, "spawn_fast", live(f.src), live(spawn_fast));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	return live(f.dot);
});

// /obj/effect/rend/proc/process  (code/game/gamemodes/wizard/artefact.dm:51)  may sleep
rt.def("/obj/effect/rend/proc/process", function* process(f: Frame) {
	if (!truthy(rt.sv(f, "spawn_fast"))) {
		if (truthy(rt.locateIn(f, T("/mob"), rt.sv(f, "loc")))) {
			return live(f.dot);
		}
	}
	yield* g.new_(f, rt.sv(f, "spawn_path"), [rt.sv(f, "loc")]);
	rt.incSrcVar(f, "spawn_amt_left", -1, true);
	if (!rt.le(rt.sv(f, "spawn_amt_left"), 0)) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/rend/proc/attackby  (code/game/gamemodes/wizard/artefact.dm:60)  may sleep
rt.def("/obj/effect/rend/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/nullrod")) ? 1 : 0))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ seals ％！ with ％！.</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(13035, "/obj/singularity/wizard", "/obj/singularity", {
	name: "tear in the fabric of reality",
	desc: "This isn't right.",
	icon: rt.rsc("icons/effects/224x224.dmi"),
	icon_state: "reality",
	pixel_x: -96,
	pixel_y: -96,
	grav_pull: 6,
	consume_range: 3,
	current_size: 7,
	allowed_size: 7,
});

// /obj/singularity/wizard/proc/process  (code/game/gamemodes/wizard/artefact.dm:99)  may sleep
rt.def("/obj/singularity/wizard/proc/process", function* process(f: Frame) {
	yield* g.srcCall(f, "move");
	yield* g.srcCall(f, "eat");
	return live(f.dot);
}, true, { waitfor: false });

rt.type(6694, "/obj/item/weapon/scrying", "/obj/item/weapon", {
	throw_speed: 3,
	throw_range: 7,
	name: "scrying orb",
	desc: "An incandescent orb of otherworldly energy, staring into it gives you vision beyond mortal means.",
	icon: rt.rsc("icons/obj/projectiles.dmi"),
	icon_state: "bluespace",
	throwforce: 15,
	damtype: "fire",
	force: 15,
	hitsound: rt.rsc("sound/items/welder2.ogg"),
});

// /obj/item/weapon/scrying/proc/attack_self  (code/game/gamemodes/wizard/artefact.dm:117)  may sleep
rt.def("/obj/item/weapon/scrying/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can see...everything!</span>"]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ stares into ＀, their eyes glazing over.</span>", [live(user), live(f.src)]));
	yield* g.callName(f, live(user), "ghostize", [1]);
	return live(f.dot);
}, true);

rt.type(9216, "/obj/item/device/necromantic_stone", "/obj/item/device", {
	spooky_scaries: null,
	unlimited: 0,
	name: "necromantic stone",
	desc: "A shard capable of resurrecting humans as skeleton thralls.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "necrostone",
	item_state: "electronic",
	origin_tech: "bluespace=4;materials=4",
	w_class: 1,
});

// /obj/item/device/necromantic_stone/proc/<init>  (code/game/gamemodes/wizard/artefact.dm:132)
rt.def("/obj/item/device/necromantic_stone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "spooky_scaries", rt.list());
	return f.dot;
});

// /obj/item/device/necromantic_stone/proc/attack  (code/game/gamemodes/wizard/artefact.dm:139)  may sleep
rt.def("/obj/item/device/necromantic_stone/proc/attack", function* attack(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if ((!truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy((yield* g.callName(f, live(f.args[1]), "canUseTopic", [live(f.args[0]), 1]))))) {
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "stat", live(f.args[0])), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This artifact can only affect the dead!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "mind", live(f.args[0]))) || !truthy(rt.fv(f, "client", live(f.args[0]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is no soul connected to this body...</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "check_spooky");
	if ((rt.ge(rt.len(f, rt.sv(f, "spooky_scaries")), 3) && !truthy(rt.sv(f, "unlimited")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>This artifact can only affect three undead at a time!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "set_species", [null, T("/datum/species/skeleton"), "icon_update", 0], rt.Args.Named);
	yield* g.callName(f, live(f.args[0]), "revive", ["full_heal", 1, "admin_revive", 1], rt.Args.Named);
	(rt.modSrcVar(f, "spooky_scaries", live(f.args[0]), rt.bitOr));
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='userdanger'>You have been revived by </span><B>＀!</B>", [rt.fv(f, "real_name", live(f.args[1]))])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='userdanger'>＀ ＀ your master now, assist them even if it costs you your new life!</span>", [(yield* g.callName(f, live(f.args[1]), "p_they", [1])), (yield* g.callName(f, live(f.args[1]), "p_are", []))])]);
	yield* g.srcCall(f, "equip_roman_skeleton", live(f.args[0]));
	if (truthy(rt.sv(f, "unlimited"))) {
		$0 = ".";
	} else {
		$0 = fmt(", ＀/3 active thralls.", [rt.len(f, rt.sv(f, "spooky_scaries"))]);
	}
	rt.setSv(f, "desc", fmt("A shard capable of resurrecting humans as skeleton thralls＀", [$0]));
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/device/necromantic_stone/proc/check_spooky  (code/game/gamemodes/wizard/artefact.dm:172)  may sleep
rt.def("/obj/item/device/necromantic_stone/proc/check_spooky", function* check_spooky(f: Frame) {
	let X: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [X, H, $e];
	if (truthy(rt.sv(f, "unlimited"))) {
		return live(f.dot);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "spooky_scaries"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (!truthy((rt.istype(live(X), T("/mob/living/carbon/human")) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "spooky_scaries"), "Remove", [live(X)]);
			continue;
		}
		if (isEqual(rt.gv(f, "stat", (H = live(X))), 2)) {
			yield* g.callName(f, live(H), "dust", [1]);
			yield* g.callName(f, rt.sv(f, "spooky_scaries"), "Remove", [live(X)]);
			continue;
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/listclearnulls"), null, [rt.sv(f, "spooky_scaries")]);
	return f.dot;
}, true);

// /obj/item/device/necromantic_stone/proc/equip_roman_skeleton  (code/game/gamemodes/wizard/artefact.dm:185)  may sleep
rt.def("/obj/item/device/necromantic_stone/proc/equip_roman_skeleton", function* equip_roman_skeleton(f: Frame, H: Value) {
	let I: Value = null, hat: Value = null;
	let $e: any;
	f.vars = () => [H, I, hat, $e];
	I = null;
	rt.forList(f, 0, live(H), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(H), "dropItemToGround", [live(I)]);
	}
	rt.endFor(f, 0);
	hat = rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/head/helmet/roman"), T("/obj/item/clothing/head/helmet/roman/legionaire")]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, live(hat), [live(H)])), 11]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/roman"), [live(H)])), 14]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/roman"), [live(H)])), 12]);
	yield* g.callName(f, live(H), "put_in_hands_or_del", [(yield* g.new_(f, T("/obj/item/weapon/shield/riot/roman"), [live(H)]))]);
	yield* g.callName(f, live(H), "put_in_hands_or_del", [(yield* g.new_(f, T("/obj/item/weapon/claymore"), [live(H)]))]);
	yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/twohanded/spear"), [live(H)])), 1]);
	return f.dot;
}, true);

rt.type(6695, "/obj/item/weapon/multisword", "/obj/item/weapon", {
	faction: null,
	cooldown: 0,
	assigned: "unassigned",
	flags: 64,
	name: "multiverse sword",
	desc: "A weapon capable of conquering the universe and beyond. Activate it to summon copies of yourself from others dimensions to fight by your side.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "multiverse",
	item_state: "multiverse",
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	slot_flags: 512,
	sharpness: 1,
	force: 20,
	throwforce: 10,
	w_class: 3,
	attack_verb: null,
}, { global: { multiverse: 730 } });

// /obj/item/weapon/multisword/proc/<init>  (code/game/gamemodes/wizard/artefact.dm:214)
rt.def("/obj/item/weapon/multisword/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "faction", rt.list("unassigned"));
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	return f.dot;
});

// /obj/item/weapon/multisword/proc/New  (code/game/gamemodes/wizard/artefact.dm:220)  may sleep
rt.def("/obj/item/weapon/multisword/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.modGl("multiverse", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/multisword/proc/Destroy  (code/game/gamemodes/wizard/artefact.dm:225)  may sleep
rt.def("/obj/item/weapon/multisword/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.callName(f, rt.gl("multiverse"), "Remove", [live(f.src)]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/multisword/proc/attack_self  (code/game/gamemodes/wizard/artefact.dm:229)  may sleep
rt.def("/obj/item/weapon/multisword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let faction_check: Value = null, F: Value = null, G: Value = null, hijack_objective: Value = null, candidates: Value = null, C: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [user, faction_check, F, G, hijack_objective, candidates, C, M, $e];
	if (isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))), "apprentice")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You know better than to touch your teacher's stuff.</span>"]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		faction_check = 0;
		F = null;
		rt.forList(f, 0, rt.sv(f, "faction"));
		while (($e = rt.next(f, 0)) !== undefined) {
			F = $e;
			if (truthy((rt.isIn(f, live(F), rt.fv(f, "faction", live(user))) ? 1 : 0))) {
				faction_check = 1;
				break;
			}
		}
		rt.endFor(f, 0);
		if (isEqual(live(faction_check), 0)) {
			rt.setSv(f, "faction", rt.list(fmt("＀", [rt.fv(f, "real_name", live(user))])));
			rt.setSv(f, "assigned", fmt("＀", [rt.fv(f, "real_name", live(user))]));
			rt.setFv(f, "faction", live(user), rt.list(fmt("＀", [rt.fv(f, "real_name", live(user))])));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You bind the sword to yourself. You can now use it to summon help."]);
			if (!truthy((yield* g.call(f, P("/proc/is_gangster"), null, [live(user)])))) {
				G = (yield* g.new_(f, T("/datum/gang/multiverse"), [live(f.src), fmt("＀", [rt.fv(f, "real_name", live(user))])]));
				rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "gangs", live(G), add);
				rt.setAt(rt.fv(f, "bosses", live(G)), rt.fv(f, "mind", live(user)), 0);
				yield* g.callName(f, live(G), "add_gang_hud", [rt.fv(f, "mind", live(user))]);
				rt.setFv(f, "gang_datum", rt.fv(f, "mind", live(user)), live(G));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'><B>With your new found power you could easily conquer the station!</B></span>"]);
				rt.setFv(f, "owner", (hijack_objective = (yield* g.new_(f, T("/datum/objective/hijackclone"), []))), rt.fv(f, "mind", live(user)));
				rt.modField(f, rt.fv(f, "mind", live(user)), "objectives", live(hijack_objective), add);
				rt.setFv(f, "explanation_text", live(hijack_objective), fmt("Ensure only ＀ and their copies are on the shuttle!", [rt.fv(f, "real_name", live(user))]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<B>Objective #＀</B>: ＀", [1, rt.fv(f, "explanation_text", live(hijack_objective))])]);
				rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(user)), add);
				rt.setFv(f, "special_role", rt.fv(f, "mind", live(user)), fmt("＀ Prime", [rt.fv(f, "real_name", live(user))]));
			}
		} else {
			if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/get_candidates"), null, ["wizard"])))))) {
				yield* g.srcCall(f, "spawn_copy", (C = rt.op(f, "PickUnweighted", [1], [live(candidates)])), rt.getStep(f, rt.fv(f, "loc", live(user)), 0), live(user));
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'><B>The sword flashes, and you find yourself face to face with...you!</B></span>"]);
				rt.setSv(f, "cooldown", add(rt.worldTime(f), 400));
				M = null;
				rt.forList(f, 0, rt.gl("multiverse"), T("/obj/item/weapon/multisword"));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (isEqual(rt.fv(f, "assigned", live(M)), rt.sv(f, "assigned"))) {
						rt.setFv(f, "cooldown", live(M), rt.sv(f, "cooldown"));
					}
				}
				rt.endFor(f, 0);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You fail to summon any copies of yourself. Perhaps you should try again in a bit."]);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'><B>＀ is recharging! Keep in mind it shares a cooldown with the swords wielded by your copies.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/multisword/proc/spawn_copy  (code/game/gamemodes/wizard/artefact.dm:275)  may sleep
rt.def("/obj/item/weapon/multisword/proc/spawn_copy", function* spawn_copy(f: Frame, C: Value, _T: Value, user: Value) {
	let M: Value = null, all_species: Value = null, speciestype: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [C, _T, user, M, all_species, speciestype, S, $e];
	M = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(_T)]));
	yield* g.callName(f, rt.fv(f, "prefs", live(C)), "copy_to", [null, live(M), "icon_updates", 0], rt.Args.Named);
	rt.setFv(f, "key", live(M), rt.fv(f, "key", live(C)));
	rt.setFv(f, "name", rt.fv(f, "mind", live(M)), rt.fv(f, "real_name", live(user)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>You are an alternate version of ＀ from another universe! Help them accomplish their goals at all costs.</B>", [rt.fv(f, "real_name", live(user))])]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_gangster", [rt.fv(f, "mind", live(M)), rt.gv(f, "gang_datum", rt.fv(f, "mind", live(user))), 0]);
	rt.setFv(f, "real_name", live(M), rt.fv(f, "real_name", live(user)));
	rt.setFv(f, "name", live(M), rt.fv(f, "real_name", live(user)));
	rt.setFv(f, "faction", live(M), rt.list(fmt("＀", [rt.fv(f, "real_name", live(user))])));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		all_species = rt.list();
		speciestype = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/species")])), T("/datum/species")));
		while (($e = rt.next(f, 0)) !== undefined) {
			speciestype = $e;
			if (!truthy(rt.initial(f, (S = live(speciestype)), "dangerous_existence"))) {
				all_species = rt.modify(live(all_species), live(speciestype), add);
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(M), "set_species", [null, rt.op(f, "PickUnweighted", [1], [live(all_species)]), "icon_update", 0], rt.Args.Named);
	}
	yield* g.callName(f, live(M), "update_body", []);
	yield* g.callName(f, live(M), "update_hair", []);
	yield* g.callName(f, live(M), "update_body_parts", []);
	yield* g.callName(f, rt.fv(f, "dna", live(M)), "update_dna_identity", []);
	yield* g.srcCall(f, "equip_copy", live(M));
	return f.dot;
}, true);

// /obj/item/weapon/multisword/proc/equip_copy  (code/game/gamemodes/wizard/artefact.dm:299)  may sleep
rt.def("/obj/item/weapon/multisword/proc/equip_copy", function* equip_copy(f: Frame, M: Value) {
	let sword: Value = null, randomize: Value = null, hat: Value = null, X: Value = null, affecting: Value = null, carried_item: Value = null, I: Value = null, W: Value = null;
	let $0: any, $e: any;
	f.vars = () => [M, sword, randomize, hat, X, affecting, carried_item, I, W, $0, $e];
	rt.setFv(f, "assigned", (sword = (yield* g.new_(f, T("/obj/item/weapon/multisword"), []))), rt.sv(f, "assigned"));
	rt.setFv(f, "faction", live(sword), rt.list(fmt("＀", [rt.sv(f, "assigned")])));
	$0 = (randomize = rt.op(f, "PickUnweighted", [15], ["mobster", "roman", "wizard", "cyborg", "syndicate", "assistant", "animu", "cultist", "highlander", "clown", "killer", "pirate", "soviet", "officer", "gladiator"]));
	if ($0 === "mobster") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/fedora"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/color/black"), [live(M)])), 9]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/glasses/sunglasses"), [live(M)])), 8]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/suit_jacket/really_black"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "roman") {
		hat = rt.op(f, "PickUnweighted", [2], [T("/obj/item/clothing/head/helmet/roman"), T("/obj/item/clothing/head/helmet/roman/legionaire")]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, live(hat), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/roman"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/roman"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [(yield* g.new_(f, T("/obj/item/weapon/shield/riot/roman"), [live(M)]))]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "wizard") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/lightpurple"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe/red"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard/red"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "cyborg") {
		X = null;
		rt.forList(f, 0, rt.fv(f, "bodyparts", live(M)));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			yield* g.callName(f, (affecting = live(X)), "change_bodypart_status", [2, 0, 1]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/glasses/thermal/eyepatch"), [live(M)])), 8]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "syndicate") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/syndicate"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/combat"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(M)])), 9]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/swat"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/armor/vest"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/gas"), [live(M)])), 2]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "assistant") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/grey"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/black"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "animu") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/kitty"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/schoolgirl/red"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "cultist") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/culthood/alt"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/cultrobes/alt"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/cult"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "highlander") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/kilt"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/beret"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/combat"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "clown") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/rank/clown"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/clown_shoes"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/gas/clown_hat"), [live(M)])), 2]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/bikehorn"), [live(M)])), 15]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "killer") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/overalls"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/white"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/color/latex"), [live(M)])), 9]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/surgical"), [live(M)])), 2]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/welding"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/apron"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/kitchen/knife"), [live(M)])), 15]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/scalpel"), [live(M)])), 16]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
		carried_item = null;
		rt.forList(f, 0, (yield* g.callName(f, live(M), "get_equipped_items", [])), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			carried_item = $e;
			yield* g.callName(f, live(carried_item), "add_mob_blood", [live(M)]);
		}
		rt.endFor(f, 0);
		I = null;
		rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.callName(f, live(I), "add_mob_blood", [live(M)]);
		}
		rt.endFor(f, 0);
	} else if ($0 === "pirate") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/pirate"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sneakers/brown"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/bandana"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/glasses/eyepatch"), [live(M)])), 8]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "soviet") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/pirate/captain"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/combat"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(M)])), 9]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/pirate/captain"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/soviet"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "officer") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/space/beret"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/combat"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(M)])), 9]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/mask/cigarette/cigar/havana"), [live(M)])), 2]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/jacket/miljacket"), [live(M)])), 13]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/syndicate"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/glasses/eyepatch"), [live(M)])), 8]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else if ($0 === "gladiator") {
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/helmet/gladiator"), [live(M)])), 11]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/gladiator"), [live(M)])), 14]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(M)])), 7]);
		yield* g.callName(f, live(M), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal"), [live(M)])), 12]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [live(sword)]);
	} else {
		return live(f.dot);
	}
	yield* g.callName(f, live(M), "update_body_parts", []);
	rt.setFv(f, "icon_state", (W = (yield* g.new_(f, T("/obj/item/weapon/card/id"), []))), "centcom");
	rt.modField(f, live(W), "access", 12, add);
	rt.setFv(f, "assignment", live(W), "Multiverse Traveller");
	rt.setFv(f, "registered_name", live(W), rt.fv(f, "real_name", live(M)));
	yield* g.callName(f, live(W), "update_label", [rt.fv(f, "real_name", live(M))]);
	yield* g.callName(f, live(M), "equip_to_slot_or_del", [live(W), 6]);
	return f.dot;
}, true);

rt.type(9537, "/obj/item/voodoo", "/obj/item", {
	target: null,
	possible: null,
	link: null,
	cooldown_time: 30,
	cooldown: 0,
	name: "wicker doll",
	desc: "Something creepy about it.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "voodoo",
	item_state: "electronic",
	obj_integrity: 10,
	max_integrity: 10,
	resistance_flags: 4,
});

// /obj/item/voodoo/proc/<init>  (code/game/gamemodes/wizard/artefact.dm:454)
rt.def("/obj/item/voodoo/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible", rt.list());
	return f.dot;
});

// /obj/item/voodoo/proc/attackby  (code/game/gamemodes/wizard/artefact.dm:463)  may sleep
rt.def("/obj/item/voodoo/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if ((truthy(rt.sv(f, "target")) && rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f)))) {
		if (truthy((yield* g.callName(f, live(I), "is_hot", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class='userdanger'>You suddenly feel very hot</span>"]);
			rt.modField(f, rt.sv(f, "target"), "bodytemperature", 50, add);
			yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"));
		} else {
			if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(I), rt.gl("pointed_types")])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), fmt("<span class='userdanger'>You feel a stabbing pain in ＀!</span>", [(yield* g.call(f, P("/proc/parse_zone"), null, [rt.fv(f, "zone_selected", live(user))]))])]);
				yield* g.callName(f, rt.sv(f, "target"), "Knockdown", [40]);
				yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"));
			} else {
				if (truthy((rt.istype(live(I), T("/obj/item/weapon/bikehorn")) ? 1 : 0))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class='userdanger'>HONK</span>"]);
					rt.op(f, "OutputReference", [rt.R.srcVar("target")], [rt.rsc("sound/items/airhorn.ogg")], false);
					yield* g.callName(f, rt.sv(f, "target"), "adjustEarDamage", [0, 3]);
					yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"));
				}
			}
		}
		rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown_time")));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "link"))) return f.dot;
	if (!((isEqual(rt.fv(f, "loc", live(I)), live(user)) && truthy((rt.istype(live(I), T("/obj/item")) ? 1 : 0))) && rt.le(rt.fv(f, "w_class", live(I)), 2))) return f.dot;
	yield* g.callName(f, live(user), "drop_item", []);
	rt.setFv(f, "loc", live(I), live(f.src));
	rt.setSv(f, "link", live(I));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You attach ＀ to the doll.", [live(I)])]);
	yield* g.srcCall(f, "update_targets");
	return f.dot;
}, true);

// /obj/item/voodoo/proc/check_eye  (code/game/gamemodes/wizard/artefact.dm:489)  may sleep
rt.def("/obj/item/voodoo/proc/check_eye", function* check_eye(f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(rt.sv(f, "loc"), live(user))) return f.dot;
	yield* g.callName(f, live(user), "reset_perspective", [null]);
	yield* g.callName(f, live(user), "unset_machine", []);
	return f.dot;
}, true);

// /obj/item/voodoo/proc/attack_self  (code/game/gamemodes/wizard/artefact.dm:494)  may sleep
rt.def("/obj/item/voodoo/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let wgw: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [user, wgw, _T, $0];
	if ((!truthy(rt.sv(f, "target")) && truthy(rt.len(f, rt.sv(f, "possible"))))) {
		rt.setSv(f, "target", (yield* g.op(f, "Prompt", [1], [null, "Voodoo", "Select your victim!", live(user), rt.sv(f, "possible")])));
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "zone_selected", live(user)), "chest")) {
		if (truthy(rt.sv(f, "link"))) {
			rt.setSv(f, "target", null);
			rt.setFv(f, "loc", rt.sv(f, "link"), rt.getStep(f, live(f.src), 0));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove the ＀ from the doll.</span>", [rt.sv(f, "link")])]);
			rt.setSv(f, "link", null);
			yield* g.srcCall(f, "update_targets");
			return live(f.dot);
		}
	}
	if (!(truthy(rt.sv(f, "target")) && rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f)))) return f.dot;
	$0 = rt.fv(f, "zone_selected", live(user));
	if ($0 === "mouth") {
		wgw = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], [null, "Voodoo", "What would you like the victim to say", live(user), null]))]));
		yield* g.callName(f, rt.sv(f, "target"), "say", [live(wgw)]);
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀＀ made ＀＀ say ＀ with a voodoo doll.", [live(user), rt.fv(f, "key", live(user)), rt.sv(f, "target"), rt.fv(f, "key", rt.sv(f, "target")), live(wgw)])]);
	} else if ($0 === "eyes") {
		yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
		yield* g.callName(f, live(user), "reset_perspective", [rt.sv(f, "target")]);
		rt.spawnTail(f, 100, "/obj/item/voodoo/proc/attack_self: spawn at game/gamemodes/wizard/artefact.dm:516", user, wgw, _T);
	} else if ($0 === "r_leg" || $0 === "l_leg") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You move the doll's legs around.</span>"]);
		_T = rt.getStep(f, rt.sv(f, "target"), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")]));
		yield* g.callName(f, rt.sv(f, "target"), "Move", [live(_T)]);
	} else if ($0 === "r_arm" || $0 === "l_arm") {
		yield* g.callName(f, rt.sv(f, "target"), "click_random_mob", []);
		yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"));
	} else if ($0 === "head") {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You smack the doll's head with your hand.</span>"]);
		yield* g.callName(f, rt.sv(f, "target"), "Dizzy", [10]);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "target"), "<span class='warning'>You suddenly feel as if your head was hit with a hammer!</span>"]);
		yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"), live(user));
	}
	rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldown_time")));
	return f.dot;
}, true);

// a spawn(100) body of /obj/item/voodoo/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/voodoo/proc/attack_self: spawn at game/gamemodes/wizard/artefact.dm:516", function* (f: Frame, user: Value, wgw: Value, _T: Value) {
	f.vars = () => [user, wgw, _T];
	yield* g.callName(f, live(user), "reset_perspective", [null]);
	yield* g.callName(f, live(user), "unset_machine", []);
	return null;
});

// /obj/item/voodoo/proc/update_targets  (code/game/gamemodes/wizard/artefact.dm:534)
rt.def("/obj/item/voodoo/proc/update_targets", function update_targets(f: Frame) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [H, $e];
	rt.setSv(f, "possible", rt.list());
	if (!truthy(rt.sv(f, "link"))) {
		return live(f.dot);
	}
	H = null;
	rt.forList(f, 0, rt.gl("living_mob_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if (truthy((rt.isIn(f, rt.call(f, P("/proc/md5"), null, [rt.gv(f, "uni_identity", rt.fv(f, "dna", live(H)))]), rt.fv(f, "fingerprints", rt.sv(f, "link"))) ? 1 : 0))) {
			(rt.modSrcVar(f, "possible", live(H), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/voodoo/proc/GiveHint  (code/game/gamemodes/wizard/artefact.dm:542)
rt.def("/obj/item/voodoo/proc/GiveHint", function GiveHint(f: Frame, victim: Value, force: Value) {
	let way: Value = null, A: Value = null;
	f.vars = () => [force, way, A];
	if (live(force) === null) {
		force = 0;
	}
	if ((truthy(rt.op(f, "Prob", [], [50])) || truthy(live(force)))) {
		way = rt.call(f, P("/proc/dir2text"), null, [rt.getDir(f, live(victim), rt.getStep(f, live(f.src), 0))]);
		rt.call(f, P("/proc/to_chat"), null, [live(victim), fmt("<span class='notice'>You feel a dark presence from ＀</span>", [live(way)])]);
	}
	if (!(truthy(rt.op(f, "Prob", [], [20])) || truthy(live(force)))) return f.dot;
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	rt.call(f, P("/proc/to_chat"), null, [live(victim), fmt("<span class='notice'>You feel a dark presence from ＀</span>", [rt.fv(f, "name", live(A))])]);
	return f.dot;
});

// /obj/item/voodoo/proc/fire_act  (code/game/gamemodes/wizard/artefact.dm:551)  may sleep
rt.def("/obj/item/voodoo/proc/fire_act", function* fire_act(f: Frame) {
	if (truthy(rt.sv(f, "target"))) {
		yield* g.callName(f, rt.sv(f, "target"), "adjust_fire_stacks", [20]);
		yield* g.callName(f, rt.sv(f, "target"), "IgniteMob", []);
		yield* g.srcCall(f, "GiveHint", rt.sv(f, "target"), 1);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["exposed_temperature", "exposed_volume"] });

rt.type(9538, "/obj/item/warpwhistle", "/obj/item", {
	on_cooldown: 0,
	last_user: null,
	name: "warp whistle",
	desc: "One toot on this whistle will send you to a far away land!",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "whistle",
});

// /obj/item/warpwhistle/proc/interrupted  (code/game/gamemodes/wizard/artefact.dm:575)
rt.def("/obj/item/warpwhistle/proc/interrupted", function interrupted(f: Frame, user: Value) {
	if ((!truthy(live(user)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		rt.setSv(f, "on_cooldown", 0);
		return 1;
	}
	return 0;
});

// /obj/item/warpwhistle/proc/attack_self  (code/game/gamemodes/wizard/artefact.dm:581)  may sleep
rt.def("/obj/item/warpwhistle/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let _T: Value = null, breakout: Value = null, potential_T: Value = null;
	f.vars = () => [user, _T, breakout, potential_T];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0)) || truthy(rt.sv(f, "on_cooldown")))) {
		return live(f.dot);
	}
	rt.setSv(f, "on_cooldown", 1);
	rt.setSv(f, "last_user", live(user));
	yield* g.call(f, P("/proc/playsound"), null, [(_T = rt.getStep(f, live(user), 0)), rt.rsc("sound/magic/warpwhistle.ogg"), 200, 1]);
	rt.setFv(f, "canmove", live(user), 0);
	yield* g.new_(f, T("/obj/effect/temp_visual/tornado"), [live(_T)]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if (truthy((yield* g.srcCall(f, "interrupted", live(user))))) {
		return live(f.dot);
	}
	rt.setFv(f, "invisibility", live(user), 100);
	(rt.modField(f, live(user), "status_flags", 4096, rt.bitOr));
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if (truthy((yield* g.srcCall(f, "interrupted", live(user))))) {
		return live(f.dot);
	}
	breakout = 0;
	while (rt.lt(live(breakout), 50)) {
		potential_T = (yield* g.call(f, P("/proc/find_safe_turf"), null, []));
		if ((!isEqual(rt.fv(f, "z", live(_T)), rt.fv(f, "z", live(potential_T))) || rt.gt(rt.op(f, "Abs", [], [(yield* g.call(f, P("/proc/get_dist_euclidian"), null, [live(potential_T), live(_T)]))]), subtract(50, live(breakout))))) {
			yield* g.callName(f, live(user), "forceMove", [live(potential_T)]);
			rt.setFv(f, "canmove", live(user), 0);
			_T = live(potential_T);
			break;
		}
		breakout = rt.modify(live(breakout), 1, add);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/tornado"), [live(_T)]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if (truthy((yield* g.srcCall(f, "interrupted", live(user))))) {
		return live(f.dot);
	}
	rt.setFv(f, "invisibility", live(user), rt.initial(f, live(user), "invisibility"));
	(rt.modField(f, live(user), "status_flags", 16773119, rt.bitAnd));
	rt.setFv(f, "canmove", live(user), 1);
	rt.setSv(f, "on_cooldown", 2);
	yield* g.call(f, P("/proc/sleep"), null, [40]);
	rt.setSv(f, "on_cooldown", 0);
	return f.dot;
}, true);

// /obj/item/warpwhistle/proc/Destroy  (code/game/gamemodes/wizard/artefact.dm:618)  may sleep
rt.def("/obj/item/warpwhistle/proc/Destroy", function* Destroy(f: Frame) {
	if ((isEqual(rt.sv(f, "on_cooldown"), 1) && truthy(rt.sv(f, "last_user")))) {
		rt.setFv(f, "invisibility", rt.sv(f, "last_user"), rt.initial(f, rt.sv(f, "last_user"), "invisibility"));
		(rt.modField(f, rt.sv(f, "last_user"), "status_flags", 16773119, rt.bitAnd));
		rt.setFv(f, "canmove", rt.sv(f, "last_user"), 1);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(11533, "/obj/effect/temp_visual/tornado", "/obj/effect/temp_visual", {
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "tornado",
	name: "tornado",
	desc: "This thing sucks!",
	layer: 5,
	randomdir: 0,
	duration: 40,
	pixel_x: 500,
});

// /obj/effect/temp_visual/tornado/proc/Initialize  (code/game/gamemodes/wizard/artefact.dm:635)  may sleep
rt.def("/obj/effect/temp_visual/tornado/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "pixel_x", -500, "time", 40]);
	return f.dot;
}, true);
