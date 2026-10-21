// From code/modules/mining/equipment/kinetic_crusher.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5632, "/obj/item/weapon/twohanded/required/kinetic_crusher", "/obj/item/weapon/twohanded/required", {
	trophies: null,
	charged: 1,
	charge_time: 15,
	force_unwielded: 20,
	force_wielded: 20,
	throw_speed: 4,
	light_range: 5,
	light_power: 1,
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "mining_hammer1",
	item_state: "mining_hammer1",
	name: "proto-kinetic crusher",
	desc: "An early design of the proto-kinetic accelerator, it is little more than an combination of various mining tools cobbled together, forming a high-tech club. While it is an effective mining tool, it did little to aid any but the most skilled and/or suicidal miners against local fauna.",
	force: 20,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 5,
	armour_penetration: 10,
	materials: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/<init>  (code/modules/mining/equipment/kinetic_crusher.dm:23)
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "trophies", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1150, "$glass", 2075]));
	rt.setSv(f, "attack_verb", rt.list("smashed", "crushed", "cleaved", "chopped", "pulped"));
	return f.dot;
});

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/Destroy  (code/modules/mining/equipment/kinetic_crusher.dm:28)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Destroy", function* Destroy(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	if (truthy(rt.sv(f, "trophies"))) {
		I = null;
		rt.forList(f, 0, rt.sv(f, "trophies"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "trophies"), "Cut", []);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/examine  (code/modules/mining/equipment/kinetic_crusher.dm:32)
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/examine", function examine(f: Frame) {
	let t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [t, _T, $e];
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Mark a large creature with the destabilizing force, then hit them in melee to do <b>50</b> damage.</span>"]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Does <b>80</b> damage if the target is backstabbed, instead of <b>50</b>.</span>"]);
	t = null;
	rt.forList(f, 0, rt.sv(f, "trophies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		_T = live(t);
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It has ＇！ attached, which cause ＀.</span>", [live(_T), rt.callName(f, live(_T), "effect_desc", [])])]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/attackby  (code/modules/mining/equipment/kinetic_crusher.dm:40)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null, _T: Value = null, _T_0: Value = null;
	let $e: any;
	f.vars = () => [t, _T, _T_0, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
		if (truthy(rt.length(rt.sv(f, "trophies")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove ＀'s trophies.</span>", [live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			t = null;
			rt.forList(f, 0, rt.sv(f, "trophies"));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				yield* g.callName(f, (_T = live(t)), "remove_from", [live(f.src), live(f.args[1])]);
			}
			rt.endFor(f, 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There are no trophies on ＀.</span>", [live(f.src)])]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/crusher_trophy")) ? 1 : 0))) {
			yield* g.callName(f, (_T_0 = live(f.args[0])), "add_to", [live(f.src), live(f.args[1])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/attack  (code/modules/mining/equipment/kinetic_crusher.dm:56)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/attack", function* attack(f: Frame) {
	let C: Value = null, target_health: Value = null, t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [C, target_health, t, _T, $e];
	C = (yield* g.callName(f, live(f.args[0]), "has_status_effect", [T("/datum/status_effect/crusher_damage")]));
	target_health = rt.fv(f, "health", live(f.args[0]));
	yield* g.callSuper(f, [], rt.Args.Same);
	t = null;
	rt.forList(f, 0, rt.sv(f, "trophies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if (!(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0]))))) {
			yield* g.callName(f, (_T = live(t)), "on_melee_hit", [live(f.args[0]), live(f.args[1])]);
		}
	}
	rt.endFor(f, 0);
	if (!(!(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C)))) && !(!truthy(live(f.args[0])) || truthy(rt.fv(f, "gc_destroyed", live(f.args[0])))))) return f.dot;
	rt.modField(f, live(C), "total_damage", subtract(live(target_health), rt.fv(f, "health", live(f.args[0]))), add);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/afterattack  (code/modules/mining/equipment/kinetic_crusher.dm:67)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let proj_turf: Value = null, D: Value = null, t: Value = null, _T: Value = null, L: Value = null, CM: Value = null, C: Value = null, target_health: Value = null, t_4: Value = null, _T_5: Value = null, backstab_dir: Value = null, def_check: Value = null;
	let $e: any;
	f.vars = () => [target, user, proximity_flag, proj_turf, D, t, _T, L, CM, C, target_health, t_4, _T_5, backstab_dir, def_check, $e];
	if ((!truthy(live(proximity_flag)) && truthy(rt.sv(f, "charged")))) {
		if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [(proj_turf = rt.fv(f, "loc", live(user)))])))) {
			return live(f.dot);
		}
		D = (yield* g.new_(f, T("/obj/item/projectile/destabilizer"), [live(proj_turf)]));
		t = null;
		rt.forList(f, 0, rt.sv(f, "trophies"));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			yield* g.callName(f, (_T = live(t)), "on_projectile_fire", [live(D), live(user)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, live(D), "preparePixelProjectile", [live(target), rt.getStep(f, live(target), 0), live(user)]);
		rt.setFv(f, "firer", live(D), live(user));
		rt.setFv(f, "hammer_synced", live(D), live(f.src));
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/plasma_cutter.ogg"), 100, 1]);
		yield* g.callName(f, live(D), "fire", []);
		rt.setSv(f, "charged", 0);
		rt.setSv(f, "icon_state", "mining_hammer1_uncharged");
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Recharge")])), rt.sv(f, "charge_time")]);
		return live(f.dot);
	}
	if (!(truthy(live(proximity_flag)) && truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)))) return f.dot;
	L = live(target);
	if (((!truthy((CM = (yield* g.callName(f, live(L), "has_status_effect", [T("/datum/status_effect/crusher_mark")])))) || !isEqual(rt.fv(f, "hammer_synced", live(CM)), live(f.src))) || !truthy((yield* g.callName(f, live(L), "remove_status_effect", [T("/datum/status_effect/crusher_mark")]))))) {
		return live(f.dot);
	}
	C = (yield* g.callName(f, live(L), "has_status_effect", [T("/datum/status_effect/crusher_damage")]));
	target_health = rt.fv(f, "health", live(L));
	t_4 = null;
	rt.forList(f, 0, rt.sv(f, "trophies"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t_4 = $e;
		yield* g.callName(f, (_T_5 = live(t_4)), "on_mark_detonation", [live(target), live(user)]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(L)) || truthy(rt.fv(f, "gc_destroyed", live(L)))) return f.dot;
	if (!(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C))))) {
		rt.modField(f, live(C), "total_damage", subtract(live(target_health), rt.fv(f, "health", live(L))), add);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/kinetic_blast"), [rt.getStep(f, live(L), 0)]);
	backstab_dir = rt.getDir(f, live(user), live(L));
	def_check = (yield* g.callName(f, live(L), "getarmor", ["type", "bomb"], rt.Args.Named));
	if ((truthy(rt.bitAnd(rt.fv(f, "dir", live(user)), live(backstab_dir))) && truthy(rt.bitAnd(rt.fv(f, "dir", live(L)), live(backstab_dir))))) {
		if (!(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C))))) {
			rt.modField(f, live(C), "total_damage", 80, add);
		}
		yield* g.callName(f, live(L), "apply_damage", [null, 80, null, "brute", "blocked", live(def_check)], rt.Args.Named);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/kenetic_accel.ogg"), 100, 1]);
	} else {
		if (!(!truthy(live(C)) || truthy(rt.fv(f, "gc_destroyed", live(C))))) {
			rt.modField(f, live(C), "total_damage", 50, add);
		}
		yield* g.callName(f, live(L), "apply_damage", [null, 50, null, "brute", "blocked", live(def_check)], rt.Args.Named);
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/required/kinetic_crusher/proc/Recharge  (code/modules/mining/equipment/kinetic_crusher.dm:111)
rt.def("/obj/item/weapon/twohanded/required/kinetic_crusher/proc/Recharge", function Recharge(f: Frame) {
	if (truthy(rt.sv(f, "charged"))) return f.dot;
	rt.setSv(f, "charged", 1);
	rt.setSv(f, "icon_state", "mining_hammer1");
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/kenetic_reload.ogg"), 60, 1]);
	return f.dot;
});

rt.type(8890, "/obj/item/projectile/destabilizer", "/obj/item/projectile", {
	hammer_synced: null,
	name: "destabilizing force",
	icon_state: "pulse1",
	nodamage: 1,
	damage: 0,
	damage_type: "brute",
	flag: "bomb",
	range: 6,
	log_override: 1,
});

// /obj/item/projectile/destabilizer/proc/Destroy  (code/modules/mining/equipment/kinetic_crusher.dm:130)  may sleep
rt.def("/obj/item/projectile/destabilizer/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "hammer_synced", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/projectile/destabilizer/proc/on_hit  (code/modules/mining/equipment/kinetic_crusher.dm:133)  may sleep
rt.def("/obj/item/projectile/destabilizer/proc/on_hit", function* on_hit(f: Frame) {
	let L: Value = null, had_effect: Value = null, CM: Value = null, t: Value = null, _T: Value = null, target_turf: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [L, had_effect, CM, t, _T, target_turf, M, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		L = live(f.args[0]);
		had_effect = (yield* g.callName(f, live(L), "has_status_effect", [T("/datum/status_effect/crusher_mark")]));
		CM = (yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/crusher_mark"), rt.sv(f, "hammer_synced")]));
		if (truthy(rt.sv(f, "hammer_synced"))) {
			t = null;
			rt.forList(f, 0, rt.fv(f, "trophies", rt.sv(f, "hammer_synced")));
			while (($e = rt.next(f, 0)) !== undefined) {
				t = $e;
				yield* g.callName(f, (_T = live(t)), "on_mark_application", [live(f.args[0]), live(CM), live(had_effect)]);
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy((rt.istype((target_turf = rt.getStep(f, live(f.args[0]), 0)), T("/turf/closed/mineral")) ? 1 : 0))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/kinetic_blast"), [(M = live(target_turf))]);
		yield* g.callName(f, live(M), "gets_drilled", [rt.sv(f, "firer")]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "blocked"] });

rt.type(10105, "/obj/item/crusher_trophy", "/obj/item", {
	bonus_value: 10,
	denied_type: rt.typePath("/obj/item/crusher_trophy"),
	name: "tail spike",
	desc: "A strange spike with no usage.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "tail_spike",
});

// /obj/item/crusher_trophy/proc/on_melee_hit  empty
rt.def("/obj/item/crusher_trophy/proc/on_melee_hit", undefined, false, { args: ["target", "user"] });

// /obj/item/crusher_trophy/proc/on_projectile_fire  empty
rt.def("/obj/item/crusher_trophy/proc/on_projectile_fire", undefined, false, { args: ["marker", "user"] });

// /obj/item/crusher_trophy/proc/on_mark_application  empty
rt.def("/obj/item/crusher_trophy/proc/on_mark_application", undefined, false, { args: ["target", "mark", "had_mark"] });

// /obj/item/crusher_trophy/proc/on_mark_detonation  empty
rt.def("/obj/item/crusher_trophy/proc/on_mark_detonation", undefined, false, { args: ["target", "user"] });

// /obj/item/crusher_trophy/proc/examine  (code/modules/mining/equipment/kinetic_crusher.dm:158)
rt.def("/obj/item/crusher_trophy/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Causes ＀ when attached to a kinetic crusher.</span>", [rt.callSrc(f, "effect_desc", [])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/crusher_trophy/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:162)
rt.def("/obj/item/crusher_trophy/proc/effect_desc", function effect_desc(f: Frame) {
	return "errors";
});

// /obj/item/crusher_trophy/proc/attackby  (code/modules/mining/equipment/kinetic_crusher.dm:165)  may sleep
rt.def("/obj/item/crusher_trophy/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/twohanded/required/kinetic_crusher")) ? 1 : 0))) {
		yield* g.srcCall(f, "add_to", live(f.args[0]), live(f.args[1]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A", "user"] });

// /obj/item/crusher_trophy/proc/add_to  (code/modules/mining/equipment/kinetic_crusher.dm:171)  may sleep
rt.def("/obj/item/crusher_trophy/proc/add_to", function* add_to(f: Frame, H: Value, user: Value) {
	let t: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [H, user, t, _T, $e];
	t = null;
	rt.forList(f, 0, rt.fv(f, "trophies", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		if ((truthy(rt.op(f, "IsType", [], [(_T = live(t)), rt.sv(f, "denied_type")])) || truthy(rt.op(f, "IsType", [], [live(f.src), rt.fv(f, "denied_type", live(_T))])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You can't seem to attach ＀ to ＀. Maybe remove a few trophies?</span>", [live(f.src), live(H)])]);
			return 0;
		}
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(f.src), live(H)])))) {
		return live(f.dot);
	}
	rt.modField(f, live(H), "trophies", live(f.src), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(f.src), live(H)])]);
	return 1;
}, true);

// /obj/item/crusher_trophy/proc/remove_from  (code/modules/mining/equipment/kinetic_crusher.dm:183)  may sleep
rt.def("/obj/item/crusher_trophy/proc/remove_from", function* remove_from(f: Frame, H: Value, user: Value) {
	f.vars = () => [H, user];
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(H), 0));
	(rt.modField(f, live(H), "trophies", live(f.src), subtract));
	return 1;
}, true);

rt.type(10106, "/obj/item/crusher_trophy/goliath_tentacle", "/obj/item/crusher_trophy", {
	missing_health_ratio: 0.1,
	missing_health_desc: 10,
	denied_type: rt.typePath("/obj/item/crusher_trophy/goliath_tentacle"),
	bonus_value: 2,
	name: "goliath tentacle",
	desc: "A sliced-off goliath tentacle. Suitable as a trophy for a kinetic crusher.",
	icon_state: "goliath_tentacle",
});

// /obj/item/crusher_trophy/goliath_tentacle/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:203)
rt.def("/obj/item/crusher_trophy/goliath_tentacle/proc/effect_desc", function effect_desc(f: Frame) {
	return fmt("mark detonation to do <b>＀</b> more damage for every <b>＀</b> health you are missing", [rt.sv(f, "bonus_value"), rt.sv(f, "missing_health_desc")]);
});

// /obj/item/crusher_trophy/goliath_tentacle/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:206)  may sleep
rt.def("/obj/item/crusher_trophy/goliath_tentacle/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let missing_health: Value = null;
	f.vars = () => [target, user, missing_health];
	missing_health = subtract(rt.fv(f, "health", live(user)), rt.fv(f, "maxHealth", live(user)));
	(missing_health = rt.modify(live(missing_health), rt.sv(f, "missing_health_ratio"), multiply));
	(missing_health = rt.modify(live(missing_health), rt.sv(f, "bonus_value"), multiply));
	if (!rt.gt(live(missing_health), 0)) return f.dot;
	yield* g.callName(f, live(target), "adjustBruteLoss", [live(missing_health)]);
	return f.dot;
}, true);

rt.type(10107, "/obj/item/crusher_trophy/watcher_wing", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/watcher_wing"),
	bonus_value: 8,
	name: "watcher wing",
	desc: "A wing ripped from a watcher. Suitable as a trophy for a kinetic crusher.",
	icon_state: "watcher_wing",
});

// /obj/item/crusher_trophy/watcher_wing/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:221)
rt.def("/obj/item/crusher_trophy/watcher_wing/proc/effect_desc", function effect_desc(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = multiply(rt.sv(f, "bonus_value"), 0.10000000149011612);
	if (isEqual(multiply(rt.sv(f, "bonus_value"), 0.10000000149011612), 1)) {
		$1 = "";
	} else {
		$1 = "s";
	}
	return fmt("mark detonation to prevent certain creatures from using certain attacks for <b>＀</b> second＀", [$0, $1]);
});

// /obj/item/crusher_trophy/watcher_wing/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:224)
rt.def("/obj/item/crusher_trophy/watcher_wing/proc/on_mark_detonation", function on_mark_detonation(f: Frame, target: Value, user: Value) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "ranged", (H = live(target))))) return f.dot;
	if (rt.ge(rt.fv(f, "ranged_cooldown_time", live(H)), rt.worldTime(f))) {
		rt.modField(f, live(H), "ranged_cooldown_time", rt.sv(f, "bonus_value"), add);
	} else {
		rt.setFv(f, "ranged_cooldown_time", live(H), add(rt.sv(f, "bonus_value"), rt.worldTime(f)));
	}
	return f.dot;
});

rt.type(10108, "/obj/item/crusher_trophy/legion_skull", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/legion_skull"),
	bonus_value: 3,
	name: "legion skull",
	desc: "A dead and lifeless legion skull. Suitable as a trophy for a kinetic crusher.",
	icon_state: "legion_skull",
});

// /obj/item/crusher_trophy/legion_skull/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:241)
rt.def("/obj/item/crusher_trophy/legion_skull/proc/effect_desc", function effect_desc(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = multiply(rt.sv(f, "bonus_value"), 0.10000000149011612);
	if (isEqual(multiply(rt.sv(f, "bonus_value"), 0.10000000149011612), 1)) {
		$1 = "";
	} else {
		$1 = "s";
	}
	return fmt("a kinetic crusher to recharge <b>＀</b> second＀ faster", [$0, $1]);
});

// /obj/item/crusher_trophy/legion_skull/proc/add_to  (code/modules/mining/equipment/kinetic_crusher.dm:244)  may sleep
rt.def("/obj/item/crusher_trophy/legion_skull/proc/add_to", function* add_to(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modField(f, live(f.args[0]), "charge_time", rt.sv(f, "bonus_value"), subtract));
	return f.dot;
}, true, { args: ["H", "user"] });

// /obj/item/crusher_trophy/legion_skull/proc/remove_from  (code/modules/mining/equipment/kinetic_crusher.dm:249)  may sleep
rt.def("/obj/item/crusher_trophy/legion_skull/proc/remove_from", function* remove_from(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.modField(f, live(f.args[0]), "charge_time", rt.sv(f, "bonus_value"), add);
	return f.dot;
}, true, { args: ["H", "user"] });

rt.type(10109, "/obj/item/crusher_trophy/miner_eye", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/miner_eye"),
	name: "eye of a blood-drunk hunter",
	desc: "Its pupil is collapsed and turned to mush. Suitable as a trophy for a kinetic crusher.",
	icon_state: "hunter_eye",
});

// /obj/item/crusher_trophy/miner_eye/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:261)
rt.def("/obj/item/crusher_trophy/miner_eye/proc/effect_desc", function effect_desc(f: Frame) {
	return "mark detonation to grant stun immunity and <b>90%</b> damage reduction for <b>1</b> second";
});

// /obj/item/crusher_trophy/miner_eye/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:264)  may sleep
rt.def("/obj/item/crusher_trophy/miner_eye/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.callName(f, live(user), "apply_status_effect", [T("/datum/status_effect/blooddrunk")]);
	return f.dot;
}, true);

rt.type(10110, "/obj/item/crusher_trophy/tail_spike", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/tail_spike"),
	bonus_value: 5,
	desc: "A spike taken from a ash drake's tail. Suitable as a trophy for a kinetic crusher.",
});

// /obj/item/crusher_trophy/tail_spike/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:273)
rt.def("/obj/item/crusher_trophy/tail_spike/proc/effect_desc", function effect_desc(f: Frame) {
	return fmt("mark detonation to do <b>＀</b> damage to nearby creatures and push them back", [rt.sv(f, "bonus_value")]);
});

// /obj/item/crusher_trophy/tail_spike/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:276)  may sleep
rt.def("/obj/item/crusher_trophy/tail_spike/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [target, user, L, $e];
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [2, live(user)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if (isEqual(rt.fv(f, "stat", live(L)), 2)) {
			continue;
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/magic/fireball.ogg"), 20, 1]);
		yield* g.new_(f, T("/obj/effect/temp_visual/fire"), [rt.fv(f, "loc", live(L))]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/crusher_trophy/tail_spike/proc/pushback"), live(L), live(user)])), 1]);
		yield* g.callName(f, live(L), "adjustBruteLoss", [rt.sv(f, "bonus_value")]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/crusher_trophy/tail_spike/proc/pushback  (code/modules/mining/equipment/kinetic_crusher.dm:285)  may sleep
rt.def("/obj/item/crusher_trophy/tail_spike/proc/pushback", function* pushback(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	if (!(!truthy(rt.fv(f, "anchored", live(target))) || truthy((rt.istype(live(target), T("/mob/living/simple_animal/hostile/megafauna")) ? 1 : 0)))) return f.dot;
	yield* g.call(f, P("/proc/step"), null, [live(target), rt.getDir(f, live(user), live(target))]);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }, { type: 8, path: "/mob/living" }] });

rt.type(10111, "/obj/item/crusher_trophy/demon_claws", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/demon_claws"),
	bonus_value: 10,
	name: "demon claws",
	desc: "A set of blood-drenched claws from a massive demon's hand. Suitable as a trophy for a kinetic crusher.",
	icon_state: "demon_claws",
	gender: "plural",
}, { global: { damage_heal_order: 743 } });

// /obj/item/crusher_trophy/demon_claws/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:299)
rt.def("/obj/item/crusher_trophy/demon_claws/proc/effect_desc", function effect_desc(f: Frame) {
	return fmt("melee hits to do <b>＀</b> more damage and heal you for <b>＀</b>; this effect is increased by <b>500%</b> during mark detonation", [multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), multiply(rt.sv(f, "bonus_value"), 0.10000000149011612)]);
	return f.dot;
});

// /obj/item/crusher_trophy/demon_claws/proc/add_to  (code/modules/mining/equipment/kinetic_crusher.dm:302)  may sleep
rt.def("/obj/item/crusher_trophy/demon_claws/proc/add_to", function* add_to(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.modField(f, live(f.args[0]), "force", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), add);
	rt.modField(f, live(f.args[0]), "force_unwielded", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), add);
	rt.modField(f, live(f.args[0]), "force_wielded", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), add);
	return f.dot;
}, true, { args: ["H", "user"] });

// /obj/item/crusher_trophy/demon_claws/proc/remove_from  (code/modules/mining/equipment/kinetic_crusher.dm:309)  may sleep
rt.def("/obj/item/crusher_trophy/demon_claws/proc/remove_from", function* remove_from(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	(rt.modField(f, live(f.args[0]), "force", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), subtract));
	(rt.modField(f, live(f.args[0]), "force_unwielded", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), subtract));
	(rt.modField(f, live(f.args[0]), "force_wielded", multiply(rt.sv(f, "bonus_value"), 0.20000000298023224), subtract));
	return f.dot;
}, true, { args: ["H", "user"] });

// /obj/item/crusher_trophy/demon_claws/proc/on_melee_hit  (code/modules/mining/equipment/kinetic_crusher.dm:316)  may sleep
rt.def("/obj/item/crusher_trophy/demon_claws/proc/on_melee_hit", function* on_melee_hit(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.callName(f, live(user), "heal_ordered_damage", [multiply(rt.sv(f, "bonus_value"), 0.10000000149011612), rt.gl("damage_heal_order#5")]);
	return f.dot;
}, true);

// /obj/item/crusher_trophy/demon_claws/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:319)  may sleep
rt.def("/obj/item/crusher_trophy/demon_claws/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.callName(f, live(target), "adjustBruteLoss", [multiply(rt.sv(f, "bonus_value"), 0.800000011920929)]);
	yield* g.callName(f, live(user), "heal_ordered_damage", [multiply(rt.sv(f, "bonus_value"), 0.4000000059604645), rt.gl("damage_heal_order#5")]);
	return f.dot;
}, true);

rt.type(10112, "/obj/item/crusher_trophy/blaster_tubes", "/obj/item/crusher_trophy", {
	deadly_shot: 0,
	denied_type: rt.typePath("/obj/item/crusher_trophy/blaster_tubes"),
	bonus_value: 15,
	name: "blaster tubes",
	desc: "The blaster tubes from a colossus's arm. Suitable as a trophy for a kinetic crusher.",
	icon_state: "blaster_tubes",
	gender: "plural",
});

// /obj/item/crusher_trophy/blaster_tubes/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:333)
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/effect_desc", function effect_desc(f: Frame) {
	return fmt("mark detonation to make the next destabilizer shot deal <b>＀</b> damage but move slower", [rt.sv(f, "bonus_value")]);
});

// /obj/item/crusher_trophy/blaster_tubes/proc/on_projectile_fire  (code/modules/mining/equipment/kinetic_crusher.dm:337)
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/on_projectile_fire", function on_projectile_fire(f: Frame, marker: Value, user: Value) {
	if (!truthy(rt.sv(f, "deadly_shot"))) return f.dot;
	rt.setFv(f, "name", live(marker), fmt("deadly ＀", [rt.fv(f, "name", live(marker))]));
	rt.setFv(f, "icon_state", live(marker), "chronobolt");
	rt.setFv(f, "damage", live(marker), rt.sv(f, "bonus_value"));
	rt.setFv(f, "nodamage", live(marker), 0);
	rt.setFv(f, "speed", live(marker), 2);
	rt.setSv(f, "deadly_shot", 0);
	return f.dot;
});

// /obj/item/crusher_trophy/blaster_tubes/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:346)  may sleep
rt.def("/obj/item/crusher_trophy/blaster_tubes/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	rt.setSv(f, "deadly_shot", 1);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/crusher_trophy/blaster_tubes/proc/reset_deadly_shot")])), 300, 2]);
	return f.dot;
}, true);

rt.type(10113, "/obj/item/crusher_trophy/vortex_talisman", "/obj/item/crusher_trophy", {
	denied_type: rt.typePath("/obj/item/crusher_trophy/vortex_talisman"),
	name: "vortex talisman",
	desc: "A glowing trinket that was originally the Hierophant's beacon. Suitable as a trophy for a kinetic crusher.",
	icon_state: "vortex_talisman",
});

// /obj/item/crusher_trophy/vortex_talisman/proc/effect_desc  (code/modules/mining/equipment/kinetic_crusher.dm:359)
rt.def("/obj/item/crusher_trophy/vortex_talisman/proc/effect_desc", function effect_desc(f: Frame) {
	return "mark detonation to create a barrier you can pass";
});

// /obj/item/crusher_trophy/vortex_talisman/proc/on_mark_detonation  (code/modules/mining/equipment/kinetic_crusher.dm:362)  may sleep
rt.def("/obj/item/crusher_trophy/vortex_talisman/proc/on_mark_detonation", function* on_mark_detonation(f: Frame, target: Value, user: Value) {
	let _T: Value = null, otherT: Value = null;
	f.vars = () => [target, user, _T, otherT];
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/wall/crusher"), [(_T = rt.getStep(f, live(user), 0)), live(user)]);
	if (truthy((otherT = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(user)), 90])))))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/wall/crusher"), [live(otherT), live(user)]);
	}
	if (!truthy((otherT = rt.getStep(f, live(_T), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(user)), -90])))))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/hierophant/wall/crusher"), [live(otherT), live(user)]);
	return f.dot;
}, true);
