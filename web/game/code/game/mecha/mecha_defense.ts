// From code/game/mecha/mecha_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/mecha/proc/get_armour_facing  (code/game/mecha/mecha_defense.dm:2)
rt.def("/obj/mecha/proc/get_armour_facing", function get_armour_facing(f: Frame, relative_dir: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = live(relative_dir);
	if ($0 === 0) {
		return rt.index(rt.sv(f, "facing_modifiers"), 3);
	} else if ($0 === 45 || $0 === 90 || $0 === 270 || $0 === 315) {
		return rt.index(rt.sv(f, "facing_modifiers"), 2);
	} else if ($0 === 225 || $0 === 180 || $0 === 135) {
		return rt.index(rt.sv(f, "facing_modifiers"), 1);
	}
	return 1;
});

// /obj/mecha/proc/take_damage  (code/game/mecha/mecha_defense.dm:12)  may sleep
rt.def("/obj/mecha/proc/take_damage", function* take_damage(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[1]) === null) {
		f.args[1] = "brute";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && rt.gt(rt.sv(f, "obj_integrity"), 0))) return f.dot;
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	$0 = live(f.args[2]);
	if ($0 === "fire") {
		yield* g.srcCall(f, "check_for_internal_damage", rt.list(1, 2));
	} else if ($0 === "melee") {
		yield* g.srcCall(f, "check_for_internal_damage", rt.list(2, 8, 16));
	} else {
		yield* g.srcCall(f, "check_for_internal_damage", rt.list(1, 2, 8, 16, 4));
	}
	if ((rt.ge(live(f.dot), 5) || truthy(rt.op(f, "Prob", [], [33])))) {
		yield* g.srcCall(f, "occupant_message", "<span class='userdanger'>Taking damage!</span>");
	}
	yield* g.srcCall(f, "log_append_to_last", fmt("Took ＀ points of damage. Damage type: \"＀\".", [live(f.args[0]), live(f.args[1])]), 1);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// /obj/mecha/proc/run_obj_armor  (code/game/mecha/mecha_defense.dm:27)  may sleep
rt.def("/obj/mecha/proc/run_obj_armor", function* run_obj_armor(f: Frame) {
	let booster_deflection_modifier: Value = null, booster_damage_modifier: Value = null, B: Value = null, facing_modifier: Value = null;
	let $e: any;
	f.vars = () => [booster_deflection_modifier, booster_damage_modifier, B, facing_modifier, $e];
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	booster_deflection_modifier = 1;
	booster_damage_modifier = 1;
	if (((isEqual(live(f.args[2]), "bullet") || isEqual(live(f.args[2]), "laser")) || isEqual(live(f.args[2]), "energy"))) {
		B = null;
		rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"));
		while (($e = rt.next(f, 0)) !== undefined) {
			B = $e;
			if (truthy((yield* g.callName(f, live(B), "projectile_react", [])))) {
				booster_deflection_modifier = rt.fv(f, "deflect_coeff", live(B));
				booster_damage_modifier = rt.fv(f, "damage_coeff", live(B));
				break;
			}
		}
		rt.endFor(f, 0);
	} else {
		if (isEqual(live(f.args[2]), "melee")) {
			B = null;
			rt.forList(f, 0, rt.sv(f, "equipment"), T("/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster"));
			while (($e = rt.next(f, 0)) !== undefined) {
				B = $e;
				if (truthy((yield* g.callName(f, live(B), "attack_react", [])))) {
					(booster_deflection_modifier = rt.modify(live(booster_deflection_modifier), rt.fv(f, "deflect_coeff", live(B)), multiply));
					(booster_damage_modifier = rt.modify(live(booster_damage_modifier), rt.fv(f, "damage_coeff", live(B)), multiply));
					break;
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (truthy(live(f.args[3]))) {
		(booster_damage_modifier = rt.modify(live(booster_damage_modifier), (facing_modifier = (yield* g.srcCall(f, "get_armour_facing", subtract((yield* g.call(f, P("/proc/dir2angle"), null, [live(f.args[3])])), (yield* g.call(f, P("/proc/dir2angle"), null, [live(f.src)])))))), divide));
		(booster_deflection_modifier = rt.modify(live(booster_deflection_modifier), live(facing_modifier), multiply));
	}
	if (truthy(rt.op(f, "Prob", [], [multiply(rt.sv(f, "deflect_chance"), live(booster_deflection_modifier))]))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s armour deflects the attack!</span>", [live(f.src)]));
		yield* g.srcCall(f, "log_append_to_last", "Armor saved.");
		return 0;
	}
	if (!truthy(live(f.dot))) return f.dot;
	(f.dot = rt.modify(live(f.dot), live(booster_damage_modifier), multiply));
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// /obj/mecha/proc/attack_hand  (code/game/mecha/mecha_defense.dm:56)  may sleep
rt.def("/obj/mecha/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "punch"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 40, 1, -1]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ hits ＀. Nothing happens</span>", [live(user), rt.sv(f, "name")]), null, null, 3]);
	yield* g.srcCall(f, "log_message", fmt("Attack by hand/paw. Attacker - ＀.", [live(user)]), 1);
	yield* g.srcCall(f, "log_append_to_last", "Armor saved.");
	return f.dot;
}, true);

// /obj/mecha/proc/attack_paw  (code/game/mecha/mecha_defense.dm:64)  may sleep
rt.def("/obj/mecha/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/mecha/proc/attack_alien  (code/game/mecha/mecha_defense.dm:68)  may sleep
rt.def("/obj/mecha/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "log_message", fmt("Attack by alien. Attacker - ＀.", [live(user)]), 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/slash.ogg"), 100, 1]);
	yield* g.srcCall(f, "attack_generic", live(user), 15, "brute", "melee", 0);
	return f.dot;
}, true);

// /obj/mecha/proc/attack_animal  (code/game/mecha/mecha_defense.dm:73)  may sleep
rt.def("/obj/mecha/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	let play_soundeffect: Value = null, animal_damage: Value = null;
	f.vars = () => [user, play_soundeffect, animal_damage];
	yield* g.srcCall(f, "log_message", fmt("Attack by simple animal. Attacker - ＀.", [live(user)]), 1);
	if ((!truthy(rt.fv(f, "melee_damage_upper", live(user))) && !truthy(rt.fv(f, "obj_damage", live(user))))) {
		yield* g.callName(f, live(user), "emote", [null, "custom", "message", fmt("＀ ＀.", [rt.fv(f, "friendly", live(user)), live(f.src)])], rt.Args.Named);
		return 0;
	} else {
		play_soundeffect = 1;
		if (truthy(rt.fv(f, "environment_smash", live(user)))) {
			play_soundeffect = 0;
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		}
		animal_damage = (yield* g.call(f, P("/proc/rand"), null, [rt.fv(f, "melee_damage_lower", live(user)), rt.fv(f, "melee_damage_upper", live(user))]));
		if (truthy(rt.fv(f, "obj_damage", live(user)))) {
			animal_damage = rt.fv(f, "obj_damage", live(user));
		}
		animal_damage = (yield* g.call(f, P("/proc/min"), null, [live(animal_damage), multiply(20, rt.fv(f, "environment_smash", live(user)))]));
		yield* g.srcCall(f, "attack_generic", live(user), live(animal_damage), rt.fv(f, "melee_damage_type", live(user)), "melee", live(play_soundeffect));
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(f.src), "attacked"]);
		return 1;
	}
	return f.dot;
}, true);

// /obj/mecha/proc/attack_hulk  (code/game/mecha/mecha_defense.dm:95)  may sleep
rt.def("/obj/mecha/proc/attack_hulk", function* attack_hulk(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "log_message", fmt("Attack by hulk. Attacker - ＀.", [live(f.args[0])]), 1);
	yield* g.call(f, P("/proc/add_logs"), null, [live(f.args[0]), live(f.src), "punched", "hulk powers"]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/mecha/proc/blob_act  (code/game/mecha/mecha_defense.dm:101)  may sleep
rt.def("/obj/mecha/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	yield* g.srcCall(f, "take_damage", 30, "brute", "melee", 0, rt.getDir(f, live(f.src), live(B)));
	return f.dot;
}, true);

// /obj/mecha/proc/hitby  (code/game/mecha/mecha_defense.dm:107)  may sleep
rt.def("/obj/mecha/proc/hitby", function* hitby(f: Frame) {
	yield* g.srcCall(f, "log_message", fmt("Hit by ＀.", [live(f.args[0])]), 1);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["A"] });

// /obj/mecha/proc/bullet_act  (code/game/mecha/mecha_defense.dm:112)  may sleep
rt.def("/obj/mecha/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* g.srcCall(f, "log_message", fmt("Hit by projectile. Type: ＀(＀).", [rt.fv(f, "name", live(f.args[0])), rt.fv(f, "flag", live(f.args[0]))]), 1);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["Proj"] });

// /obj/mecha/proc/ex_act  (code/game/mecha/mecha_defense.dm:116)
rt.def("/obj/mecha/proc/ex_act", function ex_act(f: Frame) {
	rt.callSrc(f, "log_message", [fmt("Affected by explosion of severity: ＀.", [live(f.args[0])]), 1]);
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "deflect_chance")]))) {
		f.args[0] = rt.inc(live(f.args[0]), 1);
		rt.callSrc(f, "log_append_to_last", [fmt("Armor saved, changing severity to ＀.", [live(f.args[0])])]);
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// /obj/mecha/proc/contents_explosion  (code/game/mecha/mecha_defense.dm:123)
rt.def("/obj/mecha/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let X: Value = null, ME: Value = null, Y: Value = null, MT: Value = null;
	let $e: any;
	f.vars = () => [severity, X, ME, Y, MT, $e];
	severity = rt.inc(live(severity), 1);
	X = null;
	rt.forList(f, 0, rt.sv(f, "equipment"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.callName(f, (ME = live(X)), "ex_act", [live(severity), live(target)]);
	}
	rt.endFor(f, 0);
	Y = null;
	rt.forList(f, 0, rt.sv(f, "trackers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		Y = $e;
		rt.callName(f, (MT = live(Y)), "ex_act", [live(severity), live(target)]);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	rt.callName(f, rt.sv(f, "occupant"), "ex_act", [live(severity), live(target)]);
	return f.dot;
});

// /obj/mecha/proc/handle_atom_del  (code/game/mecha/mecha_defense.dm:134)
rt.def("/obj/mecha/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "occupant"))) return f.dot;
	rt.setSv(f, "occupant", null);
	rt.setSv(f, "icon_state", add(rt.initial(f, live(f.src), "icon_state"), "-open"));
	rt.callSrc(f, "setDir", [rt.sv(f, "dir_in")]);
	return f.dot;
});

// /obj/mecha/proc/emp_act  (code/game/mecha/mecha_defense.dm:140)  may sleep
rt.def("/obj/mecha/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (truthy((yield* g.srcCall(f, "get_charge")))) {
		yield* g.srcCall(f, "use_power", divide(divide(rt.fv(f, "charge", rt.sv(f, "cell")), 3), multiply(live(severity), 2)));
		yield* g.srcCall(f, "take_damage", divide(30, live(severity)), "fire", "energy", 1);
	}
	yield* g.srcCall(f, "log_message", "EMP detected", 1);
	yield* g.srcCall(f, "check_for_internal_damage", rt.list(1, 2, 16, 4), 1);
	return f.dot;
}, true);

// /obj/mecha/proc/temperature_expose  (code/game/mecha/mecha_defense.dm:147)  may sleep
rt.def("/obj/mecha/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), rt.sv(f, "max_temperature"))) return f.dot;
	yield* g.srcCall(f, "log_message", "Exposed to dangerous temperature.", 1);
	yield* g.srcCall(f, "take_damage", 5, "fire", 0, 1);
	return f.dot;
}, true);

// /obj/mecha/proc/attackby  (code/game/mecha/mecha_defense.dm:153)  may sleep
rt.def("/obj/mecha/proc/attackby", function* attackby(f: Frame) {
	let E: Value = null, id_card: Value = null, pda: Value = null, CC: Value = null, C: Value = null, WT: Value = null;
	f.vars = () => [E, id_card, pda, CC, C, WT];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mmi")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "mmi_move_inside", live(f.args[0]), live(f.args[1]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀-＀ interface initialized successfully.", [live(f.src), live(f.args[0])])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("＀-＀ interface initialization failed.", [live(f.src), live(f.args[0])])]);
		}
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/mecha_parts/mecha_equipment")) ? 1 : 0))) {
		E = live(f.args[0]);
		rt.spawnTail(f, 0, "/obj/mecha/proc/attackby: spawn at game/mecha/mecha_defense.dm:162", E, id_card, pda, CC, C, WT);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
		if ((truthy(rt.sv(f, "add_req_access")) || truthy(rt.sv(f, "maint_access")))) {
			if (truthy((yield* g.srcCall(f, "internals_access_allowed", live(f.args[1]))))) {
				id_card = null;
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
					id_card = live(f.args[0]);
				} else {
					id_card = rt.gv(f, "id", (pda = live(f.args[0])));
				}
				yield* g.srcCall(f, "output_maintenance_dialog", live(id_card), live(f.args[1]));
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Invalid ID: Access denied.</span>"]);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Maintenance protocols disabled by operator.</span>"]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "state"), 1)) {
				rt.setSv(f, "state", 2);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You undo the securing bolts.</span>"]);
			} else {
				if (isEqual(rt.sv(f, "state"), 2)) {
					rt.setSv(f, "state", 1);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You tighten the securing bolts.</span>"]);
				}
			}
			return live(f.dot);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				if (isEqual(rt.sv(f, "state"), 2)) {
					rt.setSv(f, "state", 3);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You open the hatch to the power unit.</span>"]);
				} else {
					if (isEqual(rt.sv(f, "state"), 3)) {
						rt.setSv(f, "state", 2);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the hatch to the power unit.</span>"]);
					}
				}
				return live(f.dot);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
					if ((isEqual(rt.sv(f, "state"), 3) && truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 4)))) {
						if (truthy((yield* g.callName(f, (CC = live(f.args[0])), "use", [2])))) {
							yield* g.srcCall(f, "clearInternalDamage", 4);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You replace the fused wires.</span>"]);
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two lengths of cable to fix this mech!</span>"]);
						}
					}
					return live(f.dot);
				} else {
					if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
						if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 2))) {
							yield* g.srcCall(f, "clearInternalDamage", 2);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You repair the damaged temperature controller.</span>"]);
						} else {
							if ((isEqual(rt.sv(f, "state"), 3) && truthy(rt.sv(f, "cell")))) {
								yield* g.callName(f, rt.sv(f, "cell"), "forceMove", [rt.sv(f, "loc")]);
								rt.setSv(f, "cell", null);
								rt.setSv(f, "state", 4);
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unscrew and pry out the powercell.</span>"]);
								yield* g.srcCall(f, "log_message", "Powercell removed");
							} else {
								if ((isEqual(rt.sv(f, "state"), 4) && truthy(rt.sv(f, "cell")))) {
									rt.setSv(f, "state", 3);
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You screw the cell in place.</span>"]);
								}
							}
						}
						return live(f.dot);
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
							if (isEqual(rt.sv(f, "state"), 4)) {
								if (!truthy(rt.sv(f, "cell"))) {
									if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
										return live(f.dot);
									}
									C = live(f.args[0]);
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install the powercell.</span>"]);
									yield* g.callName(f, live(C), "forceMove", [live(f.src)]);
									rt.setSv(f, "cell", live(C));
									yield* g.srcCall(f, "log_message", "Powercell installed");
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>There's already a powercell installed.</span>"]);
								}
							}
							return live(f.dot);
						} else {
							if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
								yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
								WT = live(f.args[0]);
								if (rt.lt(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity"))) {
									if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
										if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 8))) {
											yield* g.srcCall(f, "clearInternalDamage", 8);
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You repair the damaged gas tank.</span>"]);
										} else {
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ repairs some damage to ＀.</span>", [live(f.args[1]), rt.sv(f, "name")])]);
											rt.modSrcVar(f, "obj_integrity", (yield* g.call(f, P("/proc/min"), null, [10, subtract(rt.sv(f, "max_integrity"), rt.sv(f, "obj_integrity"))])), add);
										}
									} else {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The welder must be on for this task!</span>"]);
										return 1;
									}
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The ＀ is at full integrity!</span>", [rt.sv(f, "name")])]);
								}
								return 1;
							} else {
								if (truthy((rt.istype(live(f.args[0]), T("/obj/item/mecha_parts/mecha_tracking")) ? 1 : 0))) {
									if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [live(f.args[0]), live(f.src)])]);
										return live(f.dot);
									}
									rt.modSrcVar(f, "trackers", live(f.args[0]), add);
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ attaches ＀ to ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
									yield* g.srcCall(f, "diag_hud_set_mechtracking");
									return live(f.dot);
								} else {
									return (yield* g.callSuper(f, [], rt.Args.Same));
								}
							}
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// a spawn(0) body of /obj/mecha/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/attackby: spawn at game/mecha/mecha_defense.dm:162", function* (f: Frame, E: Value, id_card: Value, pda: Value, CC: Value, C: Value, WT: Value) {
	f.vars = () => [E, id_card, pda, CC, C, WT];
	if (truthy((yield* g.callName(f, live(E), "can_attach", [live(f.src)])))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		yield* g.callName(f, live(E), "attach", [live(f.src)]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ attaches ＀ to ＀.", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(f.args[0]), live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You were unable to attach ＀ to ＀!</span>", [live(f.args[0]), live(f.src)])]);
	}
	return null;
});

// /obj/mecha/proc/attacked_by  (code/game/mecha/mecha_defense.dm:270)  may sleep
rt.def("/obj/mecha/proc/attacked_by", function* attacked_by(f: Frame) {
	yield* g.srcCall(f, "log_message", fmt("Attacked by ＀. Attacker - ＀", [live(f.args[0]), live(f.args[1])]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user"] });

// /obj/mecha/proc/mech_toxin_damage  (code/game/mecha/mecha_defense.dm:274)  may sleep
rt.def("/obj/mecha/proc/mech_toxin_damage", function* mech_toxin_damage(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/spray2.ogg"), 50, 1]);
	if (!truthy(rt.fv(f, "reagents", live(target)))) return f.dot;
	if (rt.lt(add((yield* g.callName(f, rt.fv(f, "reagents", live(target)), "get_reagent_amount", ["cryptobiolin"])), rt.sv(f, "force")), multiply(rt.sv(f, "force"), 2))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(target)), "add_reagent", ["cryptobiolin", divide(rt.sv(f, "force"), 2)]);
	}
	if (!rt.lt(add((yield* g.callName(f, rt.fv(f, "reagents", live(target)), "get_reagent_amount", ["toxin"])), rt.sv(f, "force")), multiply(rt.sv(f, "force"), 2))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(target)), "add_reagent", ["toxin", divide(rt.sv(f, "force"), 2.5)]);
	return f.dot;
}, true);

// /obj/mecha/proc/mech_melee_attack  (code/game/mecha/mecha_defense.dm:283)  may sleep
rt.def("/obj/mecha/proc/mech_melee_attack", function* mech_melee_attack(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "has_charge", rt.sv(f, "melee_energy_drain"))))) {
		return 0;
	}
	yield* g.srcCall(f, "use_power", rt.sv(f, "melee_energy_drain"));
	if (!(isEqual(rt.fv(f, "damtype", live(f.args[0])), "brute") || isEqual(rt.fv(f, "damtype", live(f.args[0])), "fire"))) return f.dot;
	yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", live(f.args[0])), live(f.src), "attacked", live(f.args[0]), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "a_intent", rt.fv(f, "occupant", live(f.args[0])))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "damtype", live(f.args[0]))]))])]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["M"] });

// /obj/mecha/proc/full_repair  (code/game/mecha/mecha_defense.dm:291)
rt.def("/obj/mecha/proc/full_repair", function full_repair(f: Frame, charge_cell: Value) {
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	if ((truthy(rt.sv(f, "cell")) && truthy(live(charge_cell)))) {
		rt.setFv(f, "charge", rt.sv(f, "cell"), rt.fv(f, "maxcharge", rt.sv(f, "cell")));
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 1))) {
		rt.callSrc(f, "clearInternalDamage", [1]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 2))) {
		rt.callSrc(f, "clearInternalDamage", [2]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 4))) {
		rt.callSrc(f, "clearInternalDamage", [4]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 8))) {
		rt.callSrc(f, "clearInternalDamage", [8]);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "internal_damage"), 16))) return f.dot;
	rt.callSrc(f, "clearInternalDamage", [16]);
	return f.dot;
});

// /obj/mecha/proc/narsie_act  (code/game/mecha/mecha_defense.dm:307)  may sleep
rt.def("/obj/mecha/proc/narsie_act", function* narsie_act(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy(rt.sv(f, "occupant"))) return f.dot;
	L = rt.sv(f, "occupant");
	yield* g.srcCall(f, "go_out", 1);
	if (!truthy(live(L))) return f.dot;
	yield* g.callName(f, live(L), "narsie_act", []);
	return f.dot;
}, true);

// /obj/mecha/proc/ratvar_act  (code/game/mecha/mecha_defense.dm:313)  may sleep
rt.def("/obj/mecha/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (!((truthy(rt.gl("ratvar_awakens")) || truthy(rt.gl("clockwork_gateway_activated"))) && truthy(rt.sv(f, "occupant")))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.sv(f, "occupant")])))) {
		yield* g.srcCall(f, "full_repair", 1);
	} else {
		L = rt.sv(f, "occupant");
		yield* g.srcCall(f, "go_out", 1);
		if (!truthy(live(L))) return f.dot;
		yield* g.callName(f, live(L), "ratvar_act", []);
	}
	return f.dot;
}, true);

// /obj/mecha/proc/do_attack_animation  (code/game/mecha/mecha_defense.dm:323)  may sleep
rt.def("/obj/mecha/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!truthy(live(f.args[3]))) {
		if (truthy(rt.sv(f, "selected"))) {
			f.args[2] = rt.sv(f, "selected");
		} else {
			if (!truthy(live(f.args[1]))) {
				f.args[1] = "smash";
				if (isEqual(rt.sv(f, "damtype"), "fire")) {
					f.args[1] = "mech_fire";
				} else {
					if (isEqual(rt.sv(f, "damtype"), "tox")) {
						f.args[1] = "mech_toxin";
					}
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
