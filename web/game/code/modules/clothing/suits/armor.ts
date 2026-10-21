// From code/modules/clothing/suits/armor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7762, "/obj/item/clothing/suit/armor", "/obj/item/clothing/suit", {
	allowed: null,
	body_parts_covered: 2,
	cold_protection: 6,
	min_cold_protection_temperature: 160,
	heat_protection: 6,
	max_heat_protection_temperature: 600,
	strip_delay: 60,
	equip_delay_other: 40,
	obj_integrity: 250,
	max_integrity: 250,
	resistance_flags: 0,
	armor: null,
});

// /obj/item/clothing/suit/armor/proc/<init>  (code/modules/clothing/suits/armor.dm:2)
rt.def("/obj/item/clothing/suit/armor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/device/flashlight/seclite"), T("/obj/item/weapon/melee/classic_baton/telescopic"), T("/obj/item/weapon/kitchen/knife/combat"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(7782, "/obj/item/clothing/suit/armor/hos", "/obj/item/clothing/suit/armor", {
	name: "armored greatcoat",
	desc: "A greatcoat enhanced with a special alloy for some extra protection and style for those with a commanding presence.",
	icon_state: "hos",
	item_state: "greatcoat",
	body_parts_covered: 414,
	armor: null,
	cold_protection: 414,
	heat_protection: 414,
	strip_delay: 80,
});

// /obj/item/clothing/suit/armor/hos/proc/<init>  (code/modules/clothing/suits/armor.dm:45)
rt.def("/obj/item/clothing/suit/armor/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 30, "bullet", 30, "laser", 30, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 70, "acid", 90]));
	return f.dot;
});

rt.type(7778, "/obj/item/clothing/suit/armor/vest/capcarapace", "/obj/item/clothing/suit/armor/vest", {
	name: "captain's carapace",
	desc: "A fireproof armored chestpiece reinforced with ceramic plates and plasteel pauldrons to provide additional protection whilst still offering maximum mobility and flexibility. Issued only to the station's finest, although it does chafe your nipples.",
	icon_state: "capcarapace",
	item_state: "armor",
	body_parts_covered: 6,
	armor: null,
	dog_fashion: null,
	resistance_flags: 2,
});

// /obj/item/clothing/suit/armor/vest/capcarapace/proc/<init>  (code/modules/clothing/suits/armor.dm:91)
rt.def("/obj/item/clothing/suit/armor/vest/capcarapace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 40, "laser", 50, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 100, "acid", 90]));
	return f.dot;
});

rt.type(7784, "/obj/item/clothing/suit/armor/riot", "/obj/item/clothing/suit/armor", {
	name: "riot suit",
	desc: "A suit of semi-flexible polycarbonate body armor with heavy padding to protect against melee attacks.",
	icon_state: "riot",
	item_state: "swat_suit",
	body_parts_covered: 2046,
	cold_protection: 2046,
	heat_protection: 2046,
	armor: null,
	strip_delay: 80,
	equip_delay_other: 60,
});

// /obj/item/clothing/suit/armor/riot/proc/<init>  (code/modules/clothing/suits/armor.dm:114)
rt.def("/obj/item/clothing/suit/armor/riot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 10, "laser", 10, "energy", 10, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 80]));
	return f.dot;
});

rt.type(7790, "/obj/item/clothing/suit/armor/bone", "/obj/item/clothing/suit/armor", {
	name: "bone armor",
	desc: "A tribal armor plate, crafted from animal bone.",
	icon_state: "bonearmor",
	item_state: "bonearmor",
	blood_overlay_type: "armor",
	armor: null,
	body_parts_covered: 510,
});

// /obj/item/clothing/suit/armor/bone/proc/<init>  (code/modules/clothing/suits/armor.dm:124)
rt.def("/obj/item/clothing/suit/armor/bone/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 35, "bullet", 25, "laser", 25, "energy", 10, "bomb", 25, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(7791, "/obj/item/clothing/suit/armor/bulletproof", "/obj/item/clothing/suit/armor", {
	name: "bulletproof armor",
	desc: "A Type III heavy bulletproof vest that excels in protecting the wearer against traditional projectile weaponry and explosives to a minor extent.",
	icon_state: "bulletproof",
	item_state: "armor",
	blood_overlay_type: "armor",
	armor: null,
	strip_delay: 70,
	equip_delay_other: 50,
});

// /obj/item/clothing/suit/armor/bulletproof/proc/<init>  (code/modules/clothing/suits/armor.dm:133)
rt.def("/obj/item/clothing/suit/armor/bulletproof/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 15, "bullet", 60, "laser", 10, "energy", 10, "bomb", 40, "bio", 0, "rad", 0, "fire", 50, "acid", 50]));
	return f.dot;
});

rt.type(7792, "/obj/item/clothing/suit/armor/laserproof", "/obj/item/clothing/suit/armor", {
	hit_reflect_chance: 40,
	name: "reflector vest",
	desc: "A vest that excels in protecting the wearer against energy projectiles, as well as occasionally reflecting them.",
	icon_state: "armor_reflec",
	item_state: "armor_reflec",
	blood_overlay_type: "armor",
	armor: null,
	resistance_flags: 99,
});

// /obj/item/clothing/suit/armor/laserproof/proc/<init>  (code/modules/clothing/suits/armor.dm:143)
rt.def("/obj/item/clothing/suit/armor/laserproof/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 10, "bullet", 10, "laser", 60, "energy", 50, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/clothing/suit/armor/laserproof/proc/IsReflect  (code/modules/clothing/suits/armor.dm:148)
rt.def("/obj/item/clothing/suit/armor/laserproof/proc/IsReflect", function IsReflect(f: Frame, def_zone: Value) {
	if (!truthy((rt.isIn(f, live(def_zone), rt.list("chest", "groin")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reflect_chance")]))) return f.dot;
	return 1;
});

rt.type(7781, "/obj/item/clothing/suit/armor/vest/det_suit", "/obj/item/clothing/suit/armor/vest", {
	name: "detective's armor vest",
	desc: "An armored vest with a detective's badge on it.",
	icon_state: "detective-armor",
	allowed: null,
	resistance_flags: 4,
	dog_fashion: null,
});

// /obj/item/clothing/suit/armor/vest/det_suit/proc/<init>  (code/modules/clothing/suits/armor.dm:157)
rt.def("/obj/item/clothing/suit/armor/vest/det_suit/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/tank/internals/emergency_oxygen"), T("/obj/item/weapon/reagent_containers/spray/pepper"), T("/obj/item/device/flashlight"), T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/gun/ballistic"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/storage/fancy/cigarettes"), T("/obj/item/weapon/lighter"), T("/obj/item/device/detective_scanner"), T("/obj/item/device/taperecorder"), T("/obj/item/weapon/melee/classic_baton")));
	return f.dot;
});

rt.type(7793, "/obj/item/clothing/suit/armor/reactive", "/obj/item/clothing/suit/armor", {
	active: 0,
	reactivearmor_cooldown_duration: 0,
	reactivearmor_cooldown: 0,
	name: "reactive armor",
	desc: "Doesn't seem to do much for some reason.",
	icon_state: "reactiveoff",
	item_state: "reactiveoff",
	blood_overlay_type: "armor",
	armor: null,
	actions_types: null,
	resistance_flags: 99,
	hit_reaction_chance: 50,
});

// /obj/item/clothing/suit/armor/reactive/proc/<init>  (code/modules/clothing/suits/armor.dm:172)
rt.def("/obj/item/clothing/suit/armor/reactive/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/suit/armor/reactive/proc/attack_self  (code/modules/clothing/suits/armor.dm:179)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setFv(f, "active", live(f.src), (!truthy(rt.fv(f, "active", live(f.src))) ? 1 : 0));
	if (truthy(rt.fv(f, "active", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now active.</span>", [live(f.src)])]);
		rt.setFv(f, "icon_state", live(f.src), "reactive");
		rt.setFv(f, "item_state", live(f.src), "reactive");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now inactive.</span>", [live(f.src)])]);
		rt.setFv(f, "icon_state", live(f.src), "reactiveoff");
		rt.setFv(f, "item_state", live(f.src), "reactiveoff");
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	return live(f.dot);
}, true);

// /obj/item/clothing/suit/armor/reactive/proc/emp_act  (code/modules/clothing/suits/armor.dm:193)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/proc/emp_act", function* emp_act(f: Frame) {
	rt.setSv(f, "active", 0);
	rt.setFv(f, "icon_state", live(f.src), "reactiveoff");
	rt.setFv(f, "item_state", live(f.src), "reactiveoff");
	rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), 200));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(7794, "/obj/item/clothing/suit/armor/reactive/teleport", "/obj/item/clothing/suit/armor/reactive", {
	tele_range: 6,
	rad_amount: 15,
	reactivearmor_cooldown_duration: 100,
	name: "reactive teleport armor",
	desc: "Someone seperated our Research Director from his own head!",
});

// /obj/item/clothing/suit/armor/reactive/teleport/proc/hit_reaction  (code/modules/clothing/suits/armor.dm:207)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/teleport/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let H: Value = null, turfs: Value = null, _T: Value = null, picked: Value = null;
	let $e: any;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, H, turfs, _T, picked, $e];
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
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")]))) {
		H = live(owner);
		if (rt.lt(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown"))) {
			yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The reactive teleport system is still recharging! It fails to teleport ＀!</span>", [live(H)])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The reactive teleport system flings ＀ clear of ＀, shutting itself off in the process!</span>", [live(H), live(attack_text)])]);
		turfs = (yield* g.new_(f, T("/list"), []));
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "tele_range"), live(H)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy(rt.fv(f, "density", live(_T)))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "maxx", rt.world()), rt.sv(f, "tele_range"))) || rt.lt(rt.fv(f, "x", live(_T)), rt.sv(f, "tele_range")))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "maxy", rt.world()), rt.sv(f, "tele_range"))) || rt.lt(rt.fv(f, "y", live(_T)), rt.sv(f, "tele_range")))) {
				continue;
			}
			turfs = rt.modify(live(turfs), live(_T), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(turfs)))) {
			turfs = rt.modify(live(turfs), rt.op(f, "PickUnweighted", [1], [(rt.isIn(f, T("/turf"), (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "tele_range"), live(H)]))) ? 1 : 0)]), add);
		}
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(picked = rt.op(f, "PickUnweighted", [1], [live(turfs)]))])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(H), "forceMove", [live(picked)]);
		yield* g.callName(f, live(H), "rad_act", [rt.sv(f, "rad_amount")]);
		rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown_duration")));
		return 1;
	}
	return 0;
}, true);

rt.type(7795, "/obj/item/clothing/suit/armor/reactive/fire", "/obj/item/clothing/suit/armor/reactive", {
	name: "reactive incendiary armor",
	desc: "An experimental suit of armor with a reactive sensor array rigged to a flame emitter. For the stylish pyromaniac.",
});

// /obj/item/clothing/suit/armor/reactive/fire/proc/hit_reaction  (code/modules/clothing/suits/armor.dm:240)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/fire/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, C, $e];
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
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")]))) {
		if (rt.lt(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown"))) {
			yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The reactive incendiary armor on ＀ activates, but fails to send out flames as it is still recharging its flame jets!</spawn>", [live(owner)])]);
			return live(f.dot);
		}
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The ＀ blocks the ＀, sending out jets of flame!</span>", [live(f.src), live(attack_text)])]);
		C = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [6, live(owner)])), T("/mob/living/carbon"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if (!isEqual(live(C), live(owner))) {
				rt.modField(f, live(C), "fire_stacks", 8, add);
				yield* g.callName(f, live(C), "IgniteMob", []);
			}
		}
		rt.endFor(f, 0);
		rt.setFv(f, "fire_stacks", live(owner), -20);
		rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown_duration")));
		return 1;
	}
	return 0;
}, true);

rt.type(7796, "/obj/item/clothing/suit/armor/reactive/stealth", "/obj/item/clothing/suit/armor/reactive", {
	name: "reactive stealth armor",
	desc: "An experimental suit of armor that renders the wearer invisible on detection of imminent harm, and creates a decoy that runs away from the owner. You can't fight what you can't see.",
});

// /obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction  (code/modules/clothing/suits/armor.dm:262)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let E: Value = null;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, E];
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
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")]))) return f.dot;
	if (rt.lt(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown"))) {
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The reactive stealth system on ＀ activates, but is still recharging its holographic emitters!</spawn>", [live(owner)])]);
		return live(f.dot);
	}
	yield* g.callName(f, (E = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/illusion/escape"), [rt.fv(f, "loc", live(owner))]))), "Copy_Parent", [live(owner), 50]);
	yield* g.callName(f, live(E), "GiveTarget", [live(owner)]);
	yield* g.callName(f, live(E), "Goto", [live(owner), rt.fv(f, "move_to_delay", live(E)), rt.fv(f, "minimum_distance", live(E))]);
	rt.setFv(f, "alpha", live(owner), 0);
	yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ is hit by ＀ in the chest!</span>", [live(owner), live(attack_text)])]);
	rt.spawnTail(f, 40, "/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction: spawn at modules/clothing/suits/armor.dm:274", owner, hitby, attack_text, final_block_chance, damage, attack_type, E);
	rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown_duration")));
	return 1;
}, true);

// a spawn(40) body of /obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/clothing/suit/armor/reactive/stealth/proc/hit_reaction: spawn at modules/clothing/suits/armor.dm:274", function* (f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value, E: Value) {
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, E];
	rt.setFv(f, "alpha", live(owner), rt.initial(f, live(owner), "alpha"));
	return null;
});

rt.type(7797, "/obj/item/clothing/suit/armor/reactive/tesla", "/obj/item/clothing/suit/armor/reactive", {
	tesla_power: 25000,
	tesla_range: 20,
	tesla_boom: 0,
	tesla_stun: 0,
	name: "reactive tesla armor",
	desc: "An experimental suit of armor with sensitive detectors hooked up to a huge capacitor grid, with emitters strutting out of it. Zap.",
	siemens_coefficient: -1,
});

// /obj/item/clothing/suit/armor/reactive/tesla/proc/hit_reaction  (code/modules/clothing/suits/armor.dm:289)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/tesla/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let sparks: Value = null;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, sparks];
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
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")]))) return f.dot;
	if (rt.lt(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown"))) {
		yield* g.callName(f, (sparks = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [1, 1, live(f.src)]);
		yield* g.callName(f, live(sparks), "start", []);
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The tesla capacitors on ＀'s reactive tesla armor are still recharging! The armor merely emits some sparks.</spawn>", [live(owner)])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The ＀ blocks the ＀, sending out arcs of lightning!</span>", [live(f.src), live(attack_text)])]);
	yield* g.call(f, P("/proc/tesla_zap"), null, [live(owner), rt.sv(f, "tesla_range"), rt.sv(f, "tesla_power"), rt.sv(f, "tesla_boom"), rt.sv(f, "tesla_stun")]);
	rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown_duration")));
	return 1;
}, true);

rt.type(7798, "/obj/item/clothing/suit/armor/reactive/table", "/obj/item/clothing/suit/armor/reactive", {
	tele_range: 10,
	name: "reactive table armor",
	desc: "If you can't beat the memes, embrace them.",
});

// /obj/item/clothing/suit/armor/reactive/table/proc/hit_reaction  (code/modules/clothing/suits/armor.dm:309)  may sleep
rt.def("/obj/item/clothing/suit/armor/reactive/table/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	let H: Value = null, turfs: Value = null, _T: Value = null, picked: Value = null;
	let $e: any;
	f.vars = () => [owner, hitby, attack_text, final_block_chance, damage, attack_type, H, turfs, _T, picked, $e];
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
	if (!truthy(rt.sv(f, "active"))) {
		return 0;
	}
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "hit_reaction_chance")]))) {
		H = live(owner);
		if (rt.lt(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown"))) {
			yield* g.callName(f, live(owner), "visible_message", ["<span class='danger'>The reactive table armor's fabricators are still on cooldown!</span>"]);
			return live(f.dot);
		}
		yield* g.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>The reactive teleport system flings ＀ clear of ＀ and slams them into a fabricated table!</span>", [live(H), live(attack_text)])]);
		yield* g.callName(f, live(owner), "visible_message", [fmt("<font color='red' size='3'>＀ GOES ON THE TABLE!!!</font>", [live(H)])]);
		yield* g.callName(f, live(owner), "Knockdown", [40]);
		turfs = (yield* g.new_(f, T("/list"), []));
		_T = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "tele_range"), live(H)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			if (truthy(rt.fv(f, "density", live(_T)))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "x", live(_T)), subtract(rt.fv(f, "maxx", rt.world()), rt.sv(f, "tele_range"))) || rt.lt(rt.fv(f, "x", live(_T)), rt.sv(f, "tele_range")))) {
				continue;
			}
			if ((rt.gt(rt.fv(f, "y", live(_T)), subtract(rt.fv(f, "maxy", rt.world()), rt.sv(f, "tele_range"))) || rt.lt(rt.fv(f, "y", live(_T)), rt.sv(f, "tele_range")))) {
				continue;
			}
			turfs = rt.modify(live(turfs), live(_T), add);
		}
		rt.endFor(f, 0);
		if (!truthy(rt.len(f, live(turfs)))) {
			turfs = rt.modify(live(turfs), rt.op(f, "PickUnweighted", [1], [(rt.isIn(f, T("/turf"), (yield* g.call(f, P("/proc/orange"), null, [rt.sv(f, "tele_range"), live(H)]))) ? 1 : 0)]), add);
		}
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(picked = rt.op(f, "PickUnweighted", [1], [live(turfs)]))])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(H), "forceMove", [live(picked)]);
		yield* g.new_(f, T("/obj/structure/table"), [rt.getStep(f, live(owner), 0)]);
		rt.setSv(f, "reactivearmor_cooldown", add(rt.worldTime(f), rt.sv(f, "reactivearmor_cooldown_duration")));
		return 1;
	}
	return 0;
}, true);

rt.type(7799, "/obj/item/clothing/suit/armor/centcom", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	name: "１Centcom armor",
	desc: "A suit that protects against some damage.",
	icon_state: "centcom",
	item_state: "centcom",
	w_class: 4,
	body_parts_covered: 2046,
	allowed: null,
	flags_inv: 13,
	cold_protection: 2046,
	min_cold_protection_temperature: 2,
	heat_protection: 2046,
	max_heat_protection_temperature: 1500,
	armor: null,
});

// /obj/item/clothing/suit/armor/centcom/proc/<init>  (code/modules/clothing/suits/armor.dm:351)
rt.def("/obj/item/clothing/suit/armor/centcom/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun/energy"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals/emergency_oxygen")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]));
	return f.dot;
});

rt.type(7800, "/obj/item/clothing/suit/armor/heavy", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	name: "heavy armor",
	desc: "A heavily armored suit that protects against moderate damage.",
	icon_state: "heavy",
	item_state: "swat_suit",
	w_class: 4,
	gas_transfer_coefficient: 0.9,
	body_parts_covered: 2046,
	slowdown: 3,
	flags_inv: 13,
	armor: null,
});

// /obj/item/clothing/suit/armor/heavy/proc/<init>  (code/modules/clothing/suits/armor.dm:371)
rt.def("/obj/item/clothing/suit/armor/heavy/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]));
	return f.dot;
});

rt.type(7801, "/obj/item/clothing/suit/armor/tdome", "/obj/item/clothing/suit/armor", {
	flags: 8192,
	body_parts_covered: 2046,
	flags_inv: 13,
	cold_protection: 2046,
	heat_protection: 2046,
	armor: null,
});

// /obj/item/clothing/suit/armor/tdome/proc/<init>  (code/modules/clothing/suits/armor.dm:379)
rt.def("/obj/item/clothing/suit/armor/tdome/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 80, "bullet", 80, "laser", 50, "energy", 50, "bomb", 100, "bio", 100, "rad", 100, "fire", 90, "acid", 90]));
	return f.dot;
});
