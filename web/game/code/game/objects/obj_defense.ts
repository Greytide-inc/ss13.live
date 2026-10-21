// From code/game/objects/obj_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5107, "/obj", "/atom/movable", {
	crit_fail: 0,
	throwforce: 0,
	in_use: 0,
	damtype: "brute",
	force: 0,
	armor: null,
	obj_integrity: 500,
	max_integrity: 500,
	integrity_failure: 0,
	resistance_flags: 0,
	acid_level: 0,
	being_shocked: 0,
	on_blueprints: 0,
	force_blueprints: 0,
	persistence_replacement: null,
	unique_rename: 0,
	current_skin: null,
	unique_reskin: null,
	dangerous_possession: 0,
	req_access: null,
	req_access_txt: "0",
	req_one_access: null,
	req_one_access_txt: "0",
	layer: 3,
	animate_movement: 2,
});

// /obj/proc/take_damage  (code/game/objects/obj_defense.dm:5)  may sleep
rt.def("/obj/proc/take_damage", function* take_damage(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value, attack_dir: Value) {
	f.vars = () => [damage_amount, damage_type, damage_flag, sound_effect, attack_dir];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	if (truthy(live(sound_effect))) {
		yield* g.srcCall(f, "play_attack_sound", live(damage_amount), live(damage_type), live(damage_flag));
	}
	if (!(!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64)) && rt.gt(rt.sv(f, "obj_integrity"), 0))) return f.dot;
	if (!rt.ge((damage_amount = (yield* g.srcCall(f, "run_obj_armor", live(damage_amount), live(damage_type), live(damage_flag), live(attack_dir)))), 1)) return f.dot;
	f.dot = live(damage_amount);
	rt.setSv(f, "obj_integrity", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "obj_integrity"), live(damage_amount)), 0])));
	if (rt.le(rt.sv(f, "obj_integrity"), 0)) {
		yield* g.srcCall(f, "obj_destruction", live(damage_flag));
	} else {
		if (!truthy(rt.sv(f, "integrity_failure"))) return f.dot;
		if (!rt.le(rt.sv(f, "obj_integrity"), rt.sv(f, "integrity_failure"))) return f.dot;
		yield* g.srcCall(f, "obj_break", live(damage_flag));
	}
	return f.dot;
}, true);

// /obj/proc/run_obj_armor  (code/game/objects/obj_defense.dm:19)
rt.def("/obj/proc/run_obj_armor", function run_obj_armor(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, attack_dir: Value) {
	let armor_protection: Value = null;
	let $0: any;
	f.vars = () => [damage_flag, armor_protection, $0];
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute" || $0 === "fire") {
	} else {
		return 0;
	}
	armor_protection = 0;
	if (truthy(live(damage_flag))) {
		armor_protection = rt.index(rt.sv(f, "armor"), live(damage_flag));
	}
	return rt.call(f, P("/proc/round"), null, [multiply(multiply(live(damage_amount), subtract(100, live(armor_protection))), 0.009999999776482582), 0.10000000149011612]);
});

// /obj/proc/play_attack_sound  (code/game/objects/obj_defense.dm:31)
rt.def("/obj/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	let $0: any;
	f.vars = () => [damage_type, damage_flag, $0];
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	$0 = live(damage_type);
	if ($0 === "brute") {
		if (truthy(live(damage_amount))) {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/smash.ogg"), 50, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	}
	return f.dot;
});

// /obj/proc/hitby  (code/game/objects/obj_defense.dm:41)  may sleep
rt.def("/obj/proc/hitby", function* hitby(f: Frame) {
	let tforce: Value = null, O: Value = null;
	f.vars = () => [tforce, O];
	yield* g.callSuper(f, [], rt.Args.Same);
	tforce = 0;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
		tforce = 10;
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0))) {
			tforce = rt.gv(f, "throwforce", (O = live(f.args[0])));
		}
	}
	yield* g.srcCall(f, "take_damage", live(tforce), "brute", "melee", 1, rt.getDir(f, live(f.src), live(f.args[0])));
	return f.dot;
}, true, { args: ["AM"] });

// /obj/proc/ex_act  (code/game/objects/obj_defense.dm:51)  may sleep
rt.def("/obj/proc/ex_act", function* ex_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 64))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[1]), live(f.src))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [100, 250])), "brute", "bomb", 0);
	} else if ($0 === 3) {
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [10, 90])), "brute", "bomb", 0);
	}
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/proc/bullet_act  (code/game/objects/obj_defense.dm:66)  may sleep
rt.def("/obj/proc/bullet_act", function* bullet_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "hitsound", live(f.args[0])), 50, 1]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is hit by ＇！!</span>", [live(f.src), live(f.args[0])]), null, null, 3);
	yield* g.srcCall(f, "take_damage", rt.fv(f, "damage", live(f.args[0])), rt.fv(f, "damage_type", live(f.args[0])), rt.fv(f, "flag", live(f.args[0])), 0, (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.args[0])), 180])));
	return f.dot;
}, true, { args: ["P"] });

// /obj/proc/attack_hulk  (code/game/objects/obj_defense.dm:75)  may sleep
rt.def("/obj/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
		yield* g.callSuper(f, [live(user), 1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ smashes ＀!</span>", [live(user), live(f.src)]), null, null, 3);
		if (truthy(rt.sv(f, "density"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
			yield* g.callName(f, live(user), "say", [rt.op(f, "PickUnweighted", [5], [";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"])]);
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		}
		yield* g.srcCall(f, "take_damage", (yield* g.srcCall(f, "hulk_damage")), "brute", "melee", 0, rt.getDir(f, live(f.src), live(user)));
		return 1;
	}
	return 0;
}, true);

// /obj/proc/blob_act  (code/game/objects/obj_defense.dm:88)  may sleep
rt.def("/obj/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let _T: Value = null;
	f.vars = () => [B, _T];
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		if ((truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc")))) && isEqual(rt.sv(f, "level"), 1))) {
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "take_damage", 400, "brute", "melee", 0, rt.getDir(f, live(f.src), live(B)));
	return f.dot;
}, true);

// /obj/proc/attack_generic  (code/game/objects/obj_defense.dm:95)  may sleep
rt.def("/obj/proc/attack_generic", function* attack_generic(f: Frame, user: Value, damage_amount: Value, damage_type: Value, damage_flag: Value, sound_effect: Value) {
	f.vars = () => [user, damage_amount, damage_type, damage_flag, sound_effect];
	if (live(damage_amount) === null) {
		damage_amount = 0;
	}
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(damage_flag) === null) {
		damage_flag = 0;
	}
	if (live(sound_effect) === null) {
		sound_effect = 1;
	}
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	return (yield* g.srcCall(f, "take_damage", live(damage_amount), live(damage_type), live(damage_flag), live(sound_effect), rt.getDir(f, live(f.src), live(user))));
}, true);

// /obj/proc/attack_alien  (code/game/objects/obj_defense.dm:100)  may sleep
rt.def("/obj/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "attack_generic", live(user), 60, "brute", "melee", 0)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 100, 1]);
	return f.dot;
}, true);

// /obj/proc/attack_animal  (code/game/objects/obj_defense.dm:104)  may sleep
rt.def("/obj/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	let play_soundeffect: Value = null;
	f.vars = () => [M, play_soundeffect];
	if ((!truthy(rt.fv(f, "melee_damage_upper", live(M))) && !truthy(rt.fv(f, "obj_damage", live(M))))) {
		yield* g.callName(f, live(M), "emote", [null, "custom", "message", fmt("＀ ＀.", [rt.fv(f, "friendly", live(M)), live(f.src)])], rt.Args.Named);
		return 0;
	} else {
		play_soundeffect = 1;
		if (truthy(rt.fv(f, "environment_smash", live(M)))) {
			play_soundeffect = 0;
		}
		if (truthy(rt.fv(f, "obj_damage", live(M)))) {
			f.dot = (yield* g.srcCall(f, "attack_generic", live(M), rt.fv(f, "obj_damage", live(M)), rt.fv(f, "melee_damage_type", live(M)), "melee", live(play_soundeffect)));
		} else {
			f.dot = (yield* g.srcCall(f, "attack_generic", live(M), (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(M)), rt.fv(f, "melee_damage_upper", live(M))])), rt.fv(f, "melee_damage_type", live(M)), "melee", live(play_soundeffect)));
		}
		if (!(truthy(live(f.dot)) && !truthy(live(play_soundeffect)))) return f.dot;
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
	}
	return f.dot;
}, true);

// /obj/proc/attack_slime  (code/game/objects/obj_defense.dm:119)  may sleep
rt.def("/obj/proc/attack_slime", function* attack_slime(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.fv(f, "is_adult", live(user)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_generic", live(user), (yield* g.call(f, P("/proc/rand"), null, [10, 15])), "melee", 1);
	return f.dot;
}, true);

// /obj/proc/mech_melee_attack  (code/game/objects/obj_defense.dm:124)  may sleep
rt.def("/obj/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	let play_soundeffect: Value = null, mech_damtype: Value = null;
	let $0: any;
	f.vars = () => [M, play_soundeffect, mech_damtype, $0];
	yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
	play_soundeffect = 0;
	mech_damtype = rt.fv(f, "damtype", live(M));
	if (truthy(rt.fv(f, "selected", live(M)))) {
		mech_damtype = rt.gv(f, "damtype", rt.fv(f, "selected", live(M)));
		play_soundeffect = 1;
	} else {
		$0 = rt.fv(f, "damtype", live(M));
		if ($0 === "brute") {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/punch4.ogg"), 50, 1]);
		} else if ($0 === "fire") {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 50, 1]);
		} else if ($0 === "tox") {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/spray2.ogg"), 50, 1]);
			return 0;
		} else {
			return 0;
		}
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has hit ＀.</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, null, 3);
	return (yield* g.srcCall(f, "take_damage", multiply(rt.fv(f, "force", live(M)), 3), live(mech_damtype), "melee", live(play_soundeffect), rt.getDir(f, live(f.src), live(M))));
}, true);

// /obj/proc/singularity_act  (code/game/objects/obj_defense.dm:145)  may sleep
rt.def("/obj/proc/singularity_act", function* singularity_act(f: Frame) {
	yield* g.srcCall(f, "ex_act", 1);
	if ((truthy(live(f.src)) && !(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return 2;
}, true);

// /datum/controller/global_vars/proc/InitGlobalacid_overlay  (code/game/objects/obj_defense.dm:153)
rt.def("/datum/controller/global_vars/proc/InitGlobalacid_overlay", function InitGlobalacid_overlay(f: Frame) {
	rt.setGl("acid_overlay", rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "acid"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "acid_overlay", add);
	return f.dot;
});

// /obj/proc/acid_act  (code/game/objects/obj_defense.dm:157)
rt.def("/obj/proc/acid_act", function acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	let acid_cap: Value = null;
	f.vars = () => [acid_cap];
	if (!(!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 16)) && truthy(live(acid_volume)))) return f.dot;
	if (!truthy(rt.sv(f, "acid_level"))) {
		rt.setAt(rt.fv(f, "processing", rt.gl("SSacid")), live(f.src), live(f.src));
		rt.callSrc(f, "add_overlay", [rt.gl("acid_overlay"), 1]);
	}
	acid_cap = multiply(live(acidpwr), 300);
	if (rt.lt(rt.sv(f, "acid_level"), live(acid_cap))) {
		rt.setSv(f, "acid_level", rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "acid_level"), multiply(live(acidpwr), live(acid_volume))), live(acid_cap)]));
	}
	return 1;
});

// /obj/proc/acid_processing  (code/game/objects/obj_defense.dm:170)  may sleep
rt.def("/obj/proc/acid_processing", function* acid_processing(f: Frame) {
	let armour_value: Value = null;
	let $e: any;
	f.vars = () => [armour_value, $e];
	f.dot = 1;
	if (!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 32))) {
		armour_value = null;
		rt.forList(f, 0, rt.sv(f, "armor"));
		while (($e = rt.next(f, 0)) !== undefined) {
			armour_value = $e;
			if ((!isEqual(live(armour_value), "acid") && !isEqual(live(armour_value), "fire"))) {
				rt.setAt(rt.sv(f, "armor"), live(armour_value), (yield* g.call(f, P("/proc/max"), null, [subtract(rt.index(rt.sv(f, "armor"), live(armour_value)), (yield* g.call(f, P("/proc/round"), null, [multiply(rt.op(f, "Sqrt", [], [rt.sv(f, "acid_level")]), 0.10000000149011612)]))), 0])));
			}
		}
		rt.endFor(f, 0);
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 150, 1]);
		}
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/min"), null, [add(1, (yield* g.call(f, P("/proc/round"), null, [multiply(rt.op(f, "Sqrt", [], [rt.sv(f, "acid_level")]), 0.30000001192092896)]))), 300])), "fire", "acid", 0);
	}
	rt.setSv(f, "acid_level", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "acid_level"), add(5, multiply(3, (yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [rt.sv(f, "acid_level")])]))))), 0])));
	if (truthy(rt.sv(f, "acid_level"))) return f.dot;
	return 0;
}, true);

// /obj/proc/acid_melt  (code/game/objects/obj_defense.dm:184)  may sleep
rt.def("/obj/proc/acid_melt", function* acid_melt(f: Frame) {
	(rt.modField(f, rt.gl("SSacid"), "processing", live(f.src), subtract));
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/proc/fire_act  (code/game/objects/obj_defense.dm:190)  may sleep
rt.def("/obj/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	let _T: Value = null;
	f.vars = () => [exposed_temperature, exposed_volume, _T];
	if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
		if ((truthy(rt.gv(f, "intact", (_T = rt.sv(f, "loc")))) && isEqual(rt.sv(f, "level"), 1))) {
			return live(f.dot);
		}
	}
	if ((truthy(live(exposed_temperature)) && !truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 2)))) {
		yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.call(f, P("/proc/min"), null, [multiply(0.019999999552965164, live(exposed_temperature)), 20]))])), "fire", "fire", 0);
	}
	if (!(!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8)) && truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 4)))) return f.dot;
	(rt.modSrcVar(f, "resistance_flags", 8, rt.bitOr));
	rt.setAt(rt.fv(f, "processing", rt.gl("SSfire_burning")), live(f.src), live(f.src));
	yield* g.srcCall(f, "add_overlay", rt.gl("fire_overlay"), 1);
	return 1;
}, true);

// /obj/proc/burn  (code/game/objects/obj_defense.dm:204)  may sleep
rt.def("/obj/proc/burn", function* burn(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) {
		(rt.modField(f, rt.gl("SSfire_burning"), "processing", live(f.src), subtract));
	}
	yield* g.srcCall(f, "deconstruct", 0);
	return f.dot;
}, true);

// /obj/proc/extinguish  (code/game/objects/obj_defense.dm:209)
rt.def("/obj/proc/extinguish", function extinguish(f: Frame) {
	if (!truthy(rt.bitAnd(rt.sv(f, "resistance_flags"), 8))) return f.dot;
	(rt.modSrcVar(f, "resistance_flags", 16777207, rt.bitAnd));
	rt.callSrc(f, "cut_overlay", [rt.gl("fire_overlay"), 1]);
	(rt.modField(f, rt.gl("SSfire_burning"), "processing", live(f.src), subtract));
	return f.dot;
});

// /obj/proc/tesla_act  (code/game/objects/obj_defense.dm:218)  may sleep
rt.def("/obj/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	let power_bounced: Value = null;
	f.vars = () => [power, power_bounced];
	rt.setSv(f, "being_shocked", 1);
	power_bounced = divide(live(power), 2);
	yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 3, live(power_bounced)]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/proc/reset_shocked")])), 10]);
	return f.dot;
}, true);

// /obj/proc/deconstruct  (code/game/objects/obj_defense.dm:227)  may sleep
rt.def("/obj/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/proc/obj_destruction  (code/game/objects/obj_defense.dm:235)  may sleep
rt.def("/obj/proc/obj_destruction", function* obj_destruction(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (isEqual(live(damage_flag), "acid")) {
		yield* g.srcCall(f, "acid_melt");
	} else {
		if (isEqual(live(damage_flag), "fire")) {
			yield* g.srcCall(f, "burn");
		} else {
			yield* g.srcCall(f, "deconstruct", 0);
		}
	}
	return f.dot;
}, true);

// /obj/proc/modify_max_integrity  (code/game/objects/obj_defense.dm:245)  may sleep
rt.def("/obj/proc/modify_max_integrity", function* modify_max_integrity(f: Frame, new_max: Value, can_break: Value, damage_type: Value, new_failure_integrity: Value) {
	let current_integrity: Value = null, current_max: Value = null, percentage: Value = null;
	f.vars = () => [new_max, can_break, damage_type, new_failure_integrity, current_integrity, current_max, percentage];
	if (live(can_break) === null) {
		can_break = 1;
	}
	if (live(damage_type) === null) {
		damage_type = "brute";
	}
	if (live(new_failure_integrity) === null) {
		new_failure_integrity = null;
	}
	current_integrity = rt.sv(f, "obj_integrity");
	current_max = rt.sv(f, "max_integrity");
	if ((!isEqual(live(current_integrity), 0) && !isEqual(live(current_max), 0))) {
		percentage = divide(live(current_integrity), live(current_max));
		rt.setSv(f, "obj_integrity", (current_integrity = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/round"), null, [multiply(live(percentage), live(new_max))]))]))));
	}
	rt.setSv(f, "max_integrity", live(new_max));
	if (live(new_failure_integrity) !== null) {
		rt.setSv(f, "integrity_failure", live(new_failure_integrity));
	}
	if (((truthy(live(can_break)) && truthy(rt.sv(f, "integrity_failure"))) && rt.le(live(current_integrity), rt.sv(f, "integrity_failure")))) {
		yield* g.srcCall(f, "obj_break", live(damage_type));
		return 1;
	}
	return 0;
}, true);

// /obj/proc/GetExplosionBlock  (code/game/objects/obj_defense.dm:265)
rt.def("/obj/proc/GetExplosionBlock", function GetExplosionBlock(f: Frame) {
	rt.call(f, P("/proc/CRASH"), null, ["Unimplemented GetExplosionBlock()"]);
	return f.dot;
});
