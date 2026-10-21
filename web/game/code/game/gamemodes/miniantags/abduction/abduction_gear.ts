// From code/game/gamemodes/miniantags/abduction/abduction_gear.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7766, "/obj/item/clothing/suit/armor/abductor/vest", "/obj/item/clothing/suit/armor/abductor", {
	mode: 1,
	stealth_active: 0,
	combat_cooldown: 10,
	disguise: null,
	stealth_armor: null,
	combat_armor: null,
	name: "agent vest",
	desc: "A vest outfitted with advanced stealth technology. It has two modes - combat and stealth.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "vest_stealth",
	item_state: "armor",
	blood_overlay_type: "armor",
	origin_tech: "magnets=7;biotech=4;powerstorage=4;abductor=4",
	armor: null,
	actions_types: null,
	allowed: null,
});

// /obj/item/clothing/suit/armor/abductor/vest/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:28)
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stealth_armor", rt.alist(f, ["melee", 15, "bullet", 15, "laser", 15, "energy", 15, "bomb", 15, "bio", 15, "rad", 15, "fire", 70, "acid", 70]));
	rt.setSv(f, "combat_armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 50, "bomb", 50, "bio", 50, "rad", 50, "fire", 90, "acid", 90]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 15, "laser", 15, "energy", 15, "bomb", 15, "bio", 15, "rad", 15, "fire", 70, "acid", 70]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/hands_free/activate")));
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/device/abductor"), T("/obj/item/weapon/abductor_baton"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/restraints/handcuffs")));
	return f.dot;
});

// /obj/item/clothing/suit/armor/abductor/vest/proc/toggle_nodrop  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:32)
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/toggle_nodrop", function toggle_nodrop(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	(rt.modSrcVar(f, "flags", 2, rt.bitXor));
	if (!truthy(rt.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))) return f.dot;
	$0 = rt.sv(f, "loc");
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 2))) {
		$1 = "locked";
	} else {
		$1 = "unlocked";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Your vest is now ＀.</span>", [$1])]);
	return f.dot;
});

// /obj/item/clothing/suit/armor/abductor/vest/proc/flip_mode  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:37)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/flip_mode", function* flip_mode(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, X, A, $0, $e];
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "mode", 2);
		yield* g.srcCall(f, "DeactivateStealth");
		rt.setSv(f, "armor", rt.sv(f, "combat_armor"));
		rt.setSv(f, "icon_state", "vest_combat");
	} else if ($0 === 2) {
		rt.setSv(f, "mode", 1);
		rt.setSv(f, "armor", rt.sv(f, "stealth_armor"));
		rt.setSv(f, "icon_state", "vest_stealth");
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = rt.sv(f, "loc")), "update_inv_wear_suit", []);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/item_action_slot_check  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:55)
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), 13)) return f.dot;
	return 1;
});

// /obj/item/clothing/suit/armor/abductor/vest/proc/SetDisguise  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:59)
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/SetDisguise", function SetDisguise(f: Frame, entry: Value) {
	rt.setSv(f, "disguise", live(entry));
	return f.dot;
});

// /obj/item/clothing/suit/armor/abductor/vest/proc/ActivateStealth  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:62)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/ActivateStealth", function* ActivateStealth(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (rt.sv(f, "disguise") === null) {
		return live(f.dot);
	}
	rt.setSv(f, "stealth_active", 1);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja/cloak"), [rt.getStep(f, (M = rt.sv(f, "loc")), 0), rt.fv(f, "dir", live(M))]);
	rt.setFv(f, "name_override", live(M), rt.fv(f, "name", rt.sv(f, "disguise")));
	rt.setFv(f, "icon", live(M), rt.fv(f, "icon", rt.sv(f, "disguise")));
	rt.setFv(f, "icon_state", live(M), rt.fv(f, "icon_state", rt.sv(f, "disguise")));
	yield* g.callName(f, live(M), "cut_overlays", []);
	yield* g.callName(f, live(M), "add_overlay", [rt.fv(f, "overlays", rt.sv(f, "disguise"))]);
	yield* g.callName(f, live(M), "update_inv_hands", []);
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/DeactivateStealth  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:76)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/DeactivateStealth", function* DeactivateStealth(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.sv(f, "stealth_active"))) {
		return live(f.dot);
	}
	rt.setSv(f, "stealth_active", 0);
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/dir_setting/ninja"), [rt.getStep(f, (M = rt.sv(f, "loc")), 0), rt.fv(f, "dir", live(M))]);
	rt.setFv(f, "name_override", live(M), null);
	yield* g.callName(f, live(M), "cut_overlays", []);
	yield* g.callName(f, live(M), "regenerate_icons", []);
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/hit_reaction  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:87)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	yield* g.srcCall(f, "DeactivateStealth");
	return 0;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/IsReflect  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:91)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/IsReflect", function* IsReflect(f: Frame) {
	yield* g.srcCall(f, "DeactivateStealth");
	return 0;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/ui_action_click  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:95)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/ui_action_click", function* ui_action_click(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === 2) {
		yield* g.srcCall(f, "Adrenaline");
	} else if ($0 === 1) {
		if (truthy(rt.sv(f, "stealth_active"))) {
			yield* g.srcCall(f, "DeactivateStealth");
		} else {
			yield* g.srcCall(f, "ActivateStealth");
		}
	}
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/Adrenaline  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:105)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/Adrenaline", function* Adrenaline(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.sv(f, "combat_cooldown"), rt.initial(f, live(f.src), "combat_cooldown"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='warning'>Combat injection is still recharging.</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, (M = rt.sv(f, "loc")), "adjustStaminaLoss", [-75]);
	yield* g.callName(f, live(M), "SetUnconscious", [0]);
	yield* g.callName(f, live(M), "SetStun", [0]);
	yield* g.callName(f, live(M), "SetKnockdown", [0]);
	rt.setSv(f, "combat_cooldown", 0);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/clothing/suit/armor/abductor/vest/proc/process  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:118)
rt.def("/obj/item/clothing/suit/armor/abductor/vest/proc/process", function process(f: Frame) {
	rt.incSrcVar(f, "combat_cooldown", 1, true);
	if (!isEqual(rt.sv(f, "combat_cooldown"), rt.initial(f, live(f.src), "combat_cooldown"))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return f.dot;
}, false, { waitfor: false });

rt.type(7765, "/obj/item/clothing/suit/armor/abductor", "/obj/item/clothing/suit/armor", {});

// /obj/item/clothing/suit/armor/abductor/proc/Destroy  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:123)  may sleep
rt.def("/obj/item/clothing/suit/armor/abductor/proc/Destroy", function* Destroy(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/abductor/console"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(rt.fv(f, "vest", live(C)), live(f.src))) {
			rt.setFv(f, "vest", live(C), null);
			break;
		}
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(9148, "/obj/item/device/abductor", "/obj/item/device", {
	icon: rt.rsc("icons/obj/abductor.dmi"),
});

// /obj/item/device/abductor/proc/AbductorCheck  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:135)
rt.def("/obj/item/device/abductor/proc/AbductorCheck", function AbductorCheck(f: Frame, user: Value) {
	if (truthy(rt.call(f, P("/proc/is_species"), null, [live(user), T("/datum/species/abductor")]))) {
		return 1;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't figure how this works!</span>"]);
	return 0;
});

// /obj/item/device/abductor/proc/ScientistCheck  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:141)
rt.def("/obj/item/device/abductor/proc/ScientistCheck", function ScientistCheck(f: Frame, user: Value) {
	let H: Value = null, S: Value = null;
	f.vars = () => [H, S];
	if (!truthy(rt.callSrc(f, "AbductorCheck", [live(user)]))) {
		return 0;
	}
	H = live(user);
	if (truthy(rt.gv(f, "scientist", (S = rt.gv(f, "species", rt.fv(f, "dna", live(H))))))) {
		return 1;
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You're not trained to use this!</span>"]);
	return 0;
});

rt.type(9149, "/obj/item/device/abductor/gizmo", "/obj/item/device/abductor", {
	mode: 1,
	marked: null,
	console: null,
	name: "science tool",
	desc: "A dual-mode tool for retrieving specimens and scanning appearances. Scanning can be done through cameras.",
	icon_state: "gizmo_scan",
	item_state: "silencer",
	origin_tech: "engineering=7;magnets=4;bluespace=4;abductor=3",
});

// /obj/item/device/abductor/gizmo/proc/attack_self  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:162)
rt.def("/obj/item/device/abductor/gizmo/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy(rt.callSrc(f, "ScientistCheck", [live(user)]))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "console"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The device is not linked to console!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "mode"), 1)) {
		rt.setSv(f, "mode", 2);
		rt.setSv(f, "icon_state", "gizmo_mark");
	} else {
		rt.setSv(f, "mode", 1);
		rt.setSv(f, "icon_state", "gizmo_scan");
	}
	$0 = live(user);
	if (isEqual(rt.sv(f, "mode"), 1)) {
		$1 = "SCAN";
	} else {
		$1 = "MARK";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You switch the device to ＀ MODE</span>", [$1])]);
	return f.dot;
});

// /obj/item/device/abductor/gizmo/proc/attack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:177)  may sleep
rt.def("/obj/item/device/abductor/gizmo/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let $0: any;
	f.vars = () => [M, user, $0];
	if (!truthy((yield* g.srcCall(f, "ScientistCheck", live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "console"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The device is not linked to console!</span>"]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		yield* g.srcCall(f, "scan", live(M), live(user));
	} else if ($0 === 2) {
		yield* g.srcCall(f, "mark", live(M), live(user));
	}
	return f.dot;
}, true);

// /obj/item/device/abductor/gizmo/proc/afterattack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:193)  may sleep
rt.def("/obj/item/device/abductor/gizmo/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let $0: any;
	f.vars = () => [target, user, flag, params, $0];
	if (truthy(live(flag))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "ScientistCheck", live(user))))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "console"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The device is not linked to console!</span>"]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		yield* g.srcCall(f, "scan", live(target), live(user));
	} else if ($0 === 2) {
		yield* g.srcCall(f, "mark", live(target), live(user));
	}
	return f.dot;
}, true);

// /obj/item/device/abductor/gizmo/proc/scan  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:206)
rt.def("/obj/item/device/abductor/gizmo/proc/scan", function scan(f: Frame, target: Value, user: Value) {
	if (!truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	rt.callName(f, rt.sv(f, "console"), "AddSnapshot", [live(target)]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You scan ＀ and add them to the database.</span>", [live(target)])]);
	return f.dot;
});

// /obj/item/device/abductor/gizmo/proc/mark  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:211)  may sleep
rt.def("/obj/item/device/abductor/gizmo/proc/mark", function* mark(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (isEqual(rt.sv(f, "marked"), live(target))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This specimen is already marked!</span>"]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.call(f, P("/proc/is_species"), null, [live(target), T("/datum/species/abductor")])))) {
			rt.setSv(f, "marked", live(target));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You mark ＀ for future retrieval.</span>", [live(target)])]);
		} else {
			yield* g.srcCall(f, "prepare", live(target), live(user));
		}
	} else {
		yield* g.srcCall(f, "prepare", live(target), live(user));
	}
	return f.dot;
}, true);

// /obj/item/device/abductor/gizmo/proc/prepare  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:224)  may sleep
rt.def("/obj/item/device/abductor/gizmo/proc/prepare", function* prepare(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(target), live(user)])), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to be next to the specimen to prepare it for transport!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You begin preparing ＀ for transport...</span>", [live(target)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 100, "target", live(target)], rt.Args.Named)))) return f.dot;
	rt.setSv(f, "marked", live(target));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You finish preparing ＀ for transport.</span>", [live(target)])]);
	return f.dot;
}, true);

// /obj/item/device/abductor/gizmo/proc/Destroy  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:234)  may sleep
rt.def("/obj/item/device/abductor/gizmo/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "console"))) {
		rt.setFv(f, "gizmo", rt.sv(f, "console"), null);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(9150, "/obj/item/device/abductor/silencer", "/obj/item/device/abductor", {
	name: "abductor silencer",
	desc: "A compact device used to shut down communications equipment.",
	icon_state: "silencer",
	item_state: "gizmo",
	origin_tech: "materials=4;programming=7;abductor=3",
});

// /obj/item/device/abductor/silencer/proc/attack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:246)
rt.def("/obj/item/device/abductor/silencer/proc/attack", function attack(f: Frame, M: Value, user: Value) {
	if (!truthy(rt.callSrc(f, "AbductorCheck", [live(user)]))) {
		return live(f.dot);
	}
	rt.callSrc(f, "radio_off", [live(M), live(user)]);
	return f.dot;
});

// /obj/item/device/abductor/silencer/proc/afterattack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:253)
rt.def("/obj/item/device/abductor/silencer/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (truthy(live(flag))) {
		return live(f.dot);
	}
	if (!truthy(rt.callSrc(f, "AbductorCheck", [live(user)]))) {
		return live(f.dot);
	}
	rt.callSrc(f, "radio_off", [live(target), live(user)]);
	return f.dot;
});

// /obj/item/device/abductor/silencer/proc/radio_off  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:258)
rt.def("/obj/item/device/abductor/silencer/proc/radio_off", function radio_off(f: Frame, target: Value, user: Value) {
	let targloc: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [targloc, M, $e];
	if (!truthy((rt.isIn(f, live(user), rt.call(f, P("/proc/viewers"), null, [7, live(target)])) ? 1 : 0))) {
		return live(f.dot);
	}
	targloc = rt.getStep(f, live(target), 0);
	M = null;
	rt.forList(f, 0, rt.call(f, P("/proc/view"), null, [2, live(targloc)]), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (isEqual(live(M), live(user))) {
			continue;
		}
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You silence ＀'s radio devices.</span>", [live(M)])]);
		rt.callSrc(f, "radio_off_mob", [live(M)]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/device/abductor/silencer/proc/radio_off_mob  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:271)
rt.def("/obj/item/device/abductor/silencer/proc/radio_off_mob", function radio_off_mob(f: Frame, M: Value) {
	let all_items: Value = null, I: Value = null, r: Value = null;
	let $e: any;
	f.vars = () => [all_items, I, r, $e];
	all_items = rt.callName(f, live(M), "GetAllContents", []);
	I = null;
	rt.forList(f, 0, live(all_items), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/device/radio")) ? 1 : 0))) {
			rt.setFv(f, "listening", (r = live(I)), 0);
			if (!truthy((rt.istype(live(I), T("/obj/item/device/radio/headset")) ? 1 : 0))) {
				rt.setFv(f, "broadcasting", live(r), 0);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(9152, "/obj/item/device/firing_pin/abductor", "/obj/item/device/firing_pin", {
	name: "alien firing pin",
	icon_state: "firing_pin_ayy",
	desc: "This firing pin is slimy and warm; you can swear you feel it constantly trying to mentally probe you.",
	fail_message: "<span class='abductor'>Firing error, please contact Command.</span>",
});

// /obj/item/device/firing_pin/abductor/proc/pin_auth  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:289)
rt.def("/obj/item/device/firing_pin/abductor/proc/pin_auth", function pin_auth(f: Frame, user: Value) {
	f.dot = rt.call(f, P("/proc/is_species"), null, [live(user), T("/datum/species/abductor")]);
	return f.dot;
});

rt.type(5132, "/obj/item/weapon/gun/energy/alien", "/obj/item/weapon/gun/energy", {
	name: "alien pistol",
	desc: "A complicated gun that fires bursts of high-intensity radiation.",
	icon_state: "alienpistol",
	item_state: "alienpistol",
	origin_tech: "combat=4;magnets=7;powerstorage=3;abductor=3",
	trigger_guard: -1,
	ammo_type: null,
	pin: rt.typePath("/obj/item/device/firing_pin/abductor"),
});

// /obj/item/weapon/gun/energy/alien/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:294)
rt.def("/obj/item/weapon/gun/energy/alien/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/declone")));
	return f.dot;
});

rt.type(6654, "/obj/item/weapon/abductor_baton", "/obj/item/weapon", {
	mode: 0,
	name: "advanced baton",
	desc: "A quad-mode baton used for incapacitation and restraining of specimens.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "wonderprodStun",
	item_state: "wonderprod",
	slot_flags: 512,
	origin_tech: "materials=4;combat=4;biotech=7;abductor=4",
	force: 7,
	w_class: 3,
	actions_types: null,
});

// /obj/item/weapon/abductor_baton/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:346)
rt.def("/obj/item/weapon/abductor_baton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_mode")));
	return f.dot;
});

// /obj/item/weapon/abductor_baton/proc/toggle  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:349)
rt.def("/obj/item/weapon/abductor_baton/proc/toggle", function toggle(f: Frame, user: Value) {
	let txt: Value = null;
	let $0: any;
	f.vars = () => [user, txt, $0];
	if (live(user) === null) {
		user = live(f.usr);
	}
	rt.setSv(f, "mode", rt.modulus(add(rt.sv(f, "mode"), 1), 4));
	txt = null;
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		txt = "stunning";
	} else if ($0 === 1) {
		txt = "sleep inducement";
	} else if ($0 === 2) {
		txt = "restraining";
	} else if ($0 === 3) {
		txt = "probing";
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You switch the baton to ＀ mode.</span>", [live(txt)])]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/abductor_baton/proc/update_icon  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:365)
rt.def("/obj/item/weapon/abductor_baton/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		rt.setSv(f, "icon_state", "wonderprodStun");
		rt.setSv(f, "item_state", "wonderprodStun");
	} else if ($0 === 1) {
		rt.setSv(f, "icon_state", "wonderprodSleep");
		rt.setSv(f, "item_state", "wonderprodSleep");
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", "wonderprodCuff");
		rt.setSv(f, "item_state", "wonderprodCuff");
	} else if ($0 === 3) {
		rt.setSv(f, "icon_state", "wonderprodProbe");
		rt.setSv(f, "item_state", "wonderprodProbe");
	}
	return f.dot;
});

// /obj/item/weapon/abductor_baton/proc/attack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:380)  may sleep
rt.def("/obj/item/weapon/abductor_baton/proc/attack", function* attack(f: Frame) {
	let L: Value = null, H: Value = null;
	let $0: any;
	f.vars = () => [L, H, $0];
	if (!truthy((yield* g.call(f, P("/proc/is_species"), null, [live(f.args[1]), T("/datum/species/abductor")])))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	L = live(f.args[0]);
	yield* g.callName(f, live(f.args[1]), "do_attack_animation", [live(L)]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (H = live(L)), "check_shields", [live(f.src), 0, fmt("＀'s ＀", [live(f.args[1]), rt.sv(f, "name")]), 1])))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			return 0;
		}
	}
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		yield* g.srcCall(f, "StunAttack", live(L), live(f.args[1]));
	} else if ($0 === 1) {
		yield* g.srcCall(f, "SleepAttack", live(L), live(f.args[1]));
	} else if ($0 === 2) {
		yield* g.srcCall(f, "CuffAttack", live(L), live(f.args[1]));
	} else if ($0 === 3) {
		yield* g.srcCall(f, "ProbeAttack", live(L), live(f.args[1]));
	}
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/abductor_baton/proc/attack_self  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:411)
rt.def("/obj/item/weapon/abductor_baton/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.callSrc(f, "toggle", [live(user)]);
	return f.dot;
});

// /obj/item/weapon/abductor_baton/proc/StunAttack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:417)  may sleep
rt.def("/obj/item/weapon/abductor_baton/proc/StunAttack", function* StunAttack(f: Frame, L: Value, user: Value) {
	let H: Value = null;
	f.vars = () => [L, user, H];
	rt.setFv(f, "lastattacked", live(user), live(L));
	rt.setFv(f, "lastattacker", live(L), live(user));
	yield* g.callName(f, live(L), "Knockdown", [140]);
	yield* g.callName(f, live(L), "apply_effect", ["stutter", 7]);
	yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ has stunned ＀ with ＀!</span>", [live(user), live(L), live(f.src)]), fmt("<span class='userdanger'>＀ has stunned you with ＀!</span>", [live(user), live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(L)), "forcesay", [rt.gl("hit_appends")]);
	}
	yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(L), "stunned"]);
	return f.dot;
}, true);

// /obj/item/weapon/abductor_baton/proc/SleepAttack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:431)  may sleep
rt.def("/obj/item/weapon/abductor_baton/proc/SleepAttack", function* SleepAttack(f: Frame, L: Value, user: Value) {
	f.vars = () => [L, user];
	if (truthy((yield* g.callName(f, live(L), "incapacitated", [1, 1])))) {
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ has induced sleep in ＀ with ＀!</span>", [live(user), live(L), live(f.src)]), "<span class='userdanger'>You suddenly feel very drowsy!</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
		yield* g.callName(f, live(L), "Sleeping", [1200]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(L), "put to sleep"]);
	} else {
		rt.modField(f, live(L), "drowsyness", 1, add);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Sleep inducement works fully only on stunned specimens! </span>"]);
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ tried to induce sleep in ＀ with ＀!</span>", [live(user), live(L), live(f.src)]), "<span class='userdanger'>You suddenly feel drowsy!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/abductor_baton/proc/CuffAttack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:444)  may sleep
rt.def("/obj/item/weapon/abductor_baton/proc/CuffAttack", function* CuffAttack(f: Frame, L: Value, user: Value) {
	let C: Value = null;
	f.vars = () => [L, user, C];
	if (!truthy((rt.istype(live(L), T("/mob/living/carbon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "handcuffed", (C = live(L))))) return f.dot;
	if ((rt.ge((yield* g.callName(f, live(C), "get_num_arms", [])), 2) || truthy((yield* g.callName(f, live(C), "get_arm_ignore", []))))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/cablecuff.ogg"), 30, 1, -2]);
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='danger'>＀ begins restraining ＀ with ＀!</span>", [live(user), live(C), live(f.src)]), fmt("<span class='userdanger'>＀ begins shaping an energy field around your hands!</span>", [live(user)])]);
		if ((truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(C), 30]))) && (rt.ge((yield* g.callName(f, live(C), "get_num_arms", [])), 2) || truthy((yield* g.callName(f, live(C), "get_arm_ignore", [])))))) {
			if (!truthy(rt.fv(f, "handcuffed", live(C)))) {
				rt.setFv(f, "handcuffed", live(C), (yield* g.new_(f, T("/obj/item/weapon/restraints/handcuffs/energy/used"), [live(C)])));
				yield* g.callName(f, live(C), "update_handcuffed", []);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You restrain ＀.</span>", [live(C)])]);
				yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(C), "handcuffed"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to restrain ＀.</span>", [live(C)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ doesn't have two hands...</span>", [live(C)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/abductor_baton/proc/ProbeAttack  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:464)
rt.def("/obj/item/weapon/abductor_baton/proc/ProbeAttack", function ProbeAttack(f: Frame, L: Value, user: Value) {
	let species: Value = null, helptext: Value = null, H: Value = null, temp: Value = null;
	f.vars = () => [species, helptext, H, temp];
	rt.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ probes ＀ with ＀!</span>", [live(user), live(L), live(f.src)]), fmt("<span class='userdanger'>＀ probes you!</span>", [live(user)])]);
	species = "<span class='warning'>Unknown species</span>";
	helptext = "<span class='warning'>Species unsuitable for experiments.</span>";
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		species = fmt("<span clas=='notice'>＀</span>", [rt.gv(f, "name", rt.gv(f, "species", rt.gv(f, "dna", (H = live(L)))))]);
		if ((truthy(rt.fv(f, "mind", live(L))) && truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(L)))))) {
			species = "<span class='warning'>Changeling lifeform</span>";
		}
		if (truthy((temp = rt.locateIn(f, T("/obj/item/organ/heart/gland"), rt.fv(f, "internal_organs", live(H)))))) {
			helptext = "<span class='warning'>Experimental gland detected!</span>";
		} else {
			helptext = "<span class='notice'>Subject suitable for experiments.</span>";
		}
	}
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Probing result:</span>＀", [live(species)])]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀", [live(helptext)])]);
	return f.dot;
});

rt.type(5779, "/obj/item/weapon/restraints/handcuffs/energy/used", "/obj/item/weapon/restraints/handcuffs/energy", {
	flags: 16384,
	desc: "energy discharge",
});

// /obj/item/weapon/restraints/handcuffs/energy/used/proc/dropped  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:497)  may sleep
rt.def("/obj/item/weapon/restraints/handcuffs/energy/used/proc/dropped", function* dropped(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀'s ＀ break in a discharge of energy!</span>", [live(f.args[0]), live(f.src)]), fmt("<span class='userdanger'>＀'s ＀ break in a discharge of energy!</span>", [live(f.args[0]), live(f.src)])]);
	yield* g.callName(f, (S = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [4, 0, rt.fv(f, "loc", live(f.args[0]))]);
	yield* g.callName(f, live(S), "start", []);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/abductor_baton/proc/examine  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:505)
rt.def("/obj/item/weapon/abductor_baton/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.sv(f, "mode");
	if ($0 === 0) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The baton is in stun mode.</span>"]);
	} else if ($0 === 1) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The baton is in sleep inducement mode.</span>"]);
	} else if ($0 === 2) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The baton is in restraining mode.</span>"]);
	} else if ($0 === 3) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The baton is in probing mode.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

rt.type(9168, "/obj/item/device/radio/headset/abductor", "/obj/item/device/radio/headset", {
	name: "alien headset",
	desc: "An advanced alien headset designed to monitor communications of human space stations. Why does it have a microphone? No one knows.",
	origin_tech: "magnets=2;abductor=3",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "abductor_headset",
	item_state: "abductor_headset",
	keyslot2: null,
});

// /obj/item/device/radio/headset/abductor/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:523)  may sleep
rt.def("/obj/item/device/radio/headset/abductor/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot2", (yield* g.new_(f, T("/obj/item/device/encryptionkey/heads/captain"), [])));
	return f.dot;
}, true);

// /obj/item/device/radio/headset/abductor/proc/Initialize  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:526)  may sleep
rt.def("/obj/item/device/radio/headset/abductor/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "bang_protect", 1);
	yield* g.srcCall(f, "make_syndie");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/device/radio/headset/abductor/proc/attackby  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:531)  may sleep
rt.def("/obj/item/device/radio/headset/abductor/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user", "params"] });

rt.type(12205, "/obj/structure/table_frame/abductor", "/obj/structure/table_frame", {
	name: "alien table frame",
	desc: "A sturdy table frame made from alien alloy.",
	icon_state: "alien_frame",
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	framestackamount: 1,
	density: 1,
});

// /obj/structure/table_frame/abductor/proc/attackby  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:606)  may sleep
rt.def("/obj/structure/table_frame/abductor/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let i: Value = null, _P: Value = null;
	f.vars = () => [I, user, params, i, _P];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start disassembling ＀...</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(I)), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(30, rt.fv(f, "toolspeed", live(I))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			i = null;
			i = 1;
			while (rt.le(live(i), rt.sv(f, "framestackamount"))) {
				yield* g.new_(f, rt.sv(f, "framestack"), [rt.getStep(f, live(f.src), 0)]);
				i = rt.inc(live(i), 1);
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(I), T("/obj/item/stack/sheet/mineral/abductor")) ? 1 : 0))) {
		if (rt.lt((yield* g.callName(f, (_P = live(I)), "get_amount", [])), 1)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need one alien alloy sheet to do this!</span>"]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(_P), live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.callName(f, live(_P), "use", [1]);
			yield* g.new_(f, T("/obj/structure/table/abductor"), [rt.fv(f, "loc", live(f.src))]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(I), T("/obj/item/stack/sheet/mineral/silver")) ? 1 : 0))) return f.dot;
	if (rt.lt((yield* g.callName(f, (_P = live(I)), "get_amount", [])), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need one sheet of silver to do\tthis!</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start adding ＀ to ＀...</span>", [live(_P), live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(f.src)], rt.Args.Named)))) return f.dot;
	yield* g.callName(f, live(_P), "use", [1]);
	yield* g.new_(f, T("/obj/structure/table/optable/abductor"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12190, "/obj/structure/table/abductor", "/obj/structure/table", {
	canSmoothWith: null,
	name: "alien table",
	desc: "Advanced flat surface technology at work!",
	icon: rt.rsc("icons/obj/smooth_structures/alien_table.dmi"),
	icon_state: "alien_table",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	buildstackamount: 1,
	framestackamount: 1,
	frame: rt.typePath("/obj/structure/table_frame/abductor"),
});

// /obj/structure/table/abductor/proc/<init>  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:646)
rt.def("/obj/structure/table/abductor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", null);
	return f.dot;
});

rt.type(12195, "/obj/structure/table/optable/abductor", "/obj/structure/table/optable", {
	can_buckle: 1,
	buckle_lying: 1,
	name: "alien operating table",
	desc: "Used for alien medical procedures. The surface is covered in tiny spines.",
	buildstack: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/abductor"),
	buildstackamount: 1,
	framestackamount: 1,
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "bed",
	frame: rt.typePath("/obj/structure/table_frame/abductor"),
}, { global: { injected_reagents: 794 } });

// /obj/structure/table/optable/abductor/proc/Crossed  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:665)
rt.def("/obj/structure/table/optable/abductor/proc/Crossed", function Crossed(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='danger'>You feel a series of tiny pricks!</span>"]);
	return f.dot;
}, false, { args: ["AM"] });

// /obj/structure/table/optable/abductor/proc/process  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:672)  may sleep
rt.def("/obj/structure/table/optable/abductor/proc/process", function* process(f: Frame) {
	let C: Value = null, chemical: Value = null;
	let $e: any;
	f.vars = () => [C, chemical, $e];
	f.dot = 26;
	C = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/living/carbon"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		f.dot = 1;
		chemical = null;
		rt.forList(f, 1, rt.gl("injected_reagents"));
		while (($e = rt.next(f, 1)) !== undefined) {
			chemical = $e;
			if (rt.lt((yield* g.callName(f, rt.fv(f, "reagents", live(C)), "get_reagent_amount", [live(chemical)])), 1)) {
				yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", [live(chemical), 1]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { waitfor: false });

// /obj/structure/table/optable/abductor/proc/Destroy  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:679)  may sleep
rt.def("/obj/structure/table/optable/abductor/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

rt.type(12411, "/obj/structure/door_assembly/door_assembly_abductor", "/obj/structure/door_assembly", {
	anchored: 1,
	name: "alien airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/abductor/abductor_airlock.dmi"),
	overlays_file: rt.rsc("icons/obj/doors/airlocks/abductor/overlays.dmi"),
	typetext: "abductor",
	icontext: "abductor",
	airlock_type: rt.typePath("/obj/machinery/door/airlock/abductor"),
	state: 1,
});

// /obj/structure/door_assembly/door_assembly_abductor/proc/attackby  (code/game/gamemodes/miniantags/abduction/abduction_gear.dm:701)  may sleep
rt.def("/obj/structure/door_assembly/door_assembly_abductor/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null;
	f.vars = () => [WT];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
		if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the airlock assembly.</span>", [live(f.args[1])]), "You start to disassemble the airlock assembly..."]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
				if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disassemble the airlock assembly.</span>"]);
				yield* g.new_(f, T("/obj/item/stack/sheet/mineral/abductor"), [rt.getStep(f, live(f.src), 0), 4]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		} else {
			return live(f.dot);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/airlock_painter")) ? 1 : 0))) {
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0))) {
				return live(f.dot);
			} else {
				yield* g.callSuper(f, [], rt.Args.Same);
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });
