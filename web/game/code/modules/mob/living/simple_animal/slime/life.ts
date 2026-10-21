// From code/modules/mob/living/simple_animal/slime/life.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/simple_animal/slime/proc/Life  (code/modules/mob/living/simple_animal/slime/life.dm:16)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/Life", function* Life(f: Frame) {
	if (truthy(rt.sv(f, "notransform"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.srcCall(f, "handle_feeding");
	}
	if (truthy(rt.sv(f, "stat"))) return f.dot;
	yield* g.srcCall(f, "handle_nutrition");
	yield* g.srcCall(f, "handle_targets");
	if (truthy(rt.sv(f, "ckey"))) return f.dot;
	yield* g.srcCall(f, "handle_mood");
	yield* g.srcCall(f, "handle_speech");
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/slime/proc/update_stat  (code/modules/mob/living/simple_animal/slime/life.dm:28)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/update_stat", function* update_stat(f: Frame) {
	if ((isEqual(rt.sv(f, "stat"), 1) && rt.gt(rt.sv(f, "health"), 0))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/AIprocess  (code/modules/mob/living/simple_animal/slime/life.dm:34)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/AIprocess", function* AIprocess(f: Frame) {
	let hungry: Value = null, sleeptime: Value = null;
	f.vars = () => [hungry, sleeptime];
	if (((truthy(rt.sv(f, "AIproc")) || truthy(rt.sv(f, "stat"))) || truthy(rt.sv(f, "client")))) {
		return live(f.dot);
	}
	hungry = 0;
	if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_starve_nutrition")))) {
		hungry = 2;
	} else {
		if (((rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_grow_nutrition"))) && truthy(rt.op(f, "Prob", [], [25]))) || rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition"))))) {
			hungry = 1;
		}
	}
	rt.setSv(f, "AIproc", 1);
	while ((truthy(rt.sv(f, "AIproc")) && !isEqual(rt.sv(f, "stat"), 2)) && (((truthy(rt.sv(f, "attacked")) || truthy(live(hungry))) || truthy(rt.sv(f, "rabid"))) || truthy(rt.sv(f, "buckled")))) {
		if (truthy(rt.sv(f, "buckled"))) {
			break;
		}
		if ((!truthy(rt.sv(f, "Target")) || truthy(rt.sv(f, "client")))) {
			break;
		}
		if ((rt.le(rt.fv(f, "health", rt.sv(f, "Target")), -70) || isEqual(rt.fv(f, "stat", rt.sv(f, "Target")), 2))) {
			rt.setSv(f, "Target", null);
			rt.setSv(f, "AIproc", 0);
			break;
		}
		if (truthy(rt.sv(f, "Target"))) {
			if (truthy(rt.locateIn(f, T("/mob/living/simple_animal/slime"), rt.fv(f, "buckled_mobs", rt.sv(f, "Target"))))) {
				rt.setSv(f, "Target", null);
				rt.setSv(f, "AIproc", 0);
				break;
			}
			if (!truthy(rt.sv(f, "AIproc"))) {
				break;
			}
			if (truthy((rt.isIn(f, rt.sv(f, "Target"), (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)]))) ? 1 : 0))) {
				if (truthy((rt.istype(rt.sv(f, "Target"), T("/mob/living/silicon")) ? 1 : 0))) {
					if (!truthy(rt.sv(f, "Atkcool"))) {
						rt.setSv(f, "Atkcool", 1);
						rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:69", hungry, sleeptime);
						if (truthy((yield* g.callName(f, rt.sv(f, "Target"), "Adjacent", [live(f.src)])))) {
							yield* g.callName(f, rt.sv(f, "Target"), "attack_slime", [live(f.src)]);
						}
					}
					return live(f.dot);
				}
				if ((!truthy(rt.fv(f, "lying", rt.sv(f, "Target"))) && truthy(rt.op(f, "Prob", [], [80])))) {
					if ((truthy(rt.fv(f, "client", rt.sv(f, "Target"))) && rt.ge(rt.fv(f, "health", rt.sv(f, "Target")), 20))) {
						if (!truthy(rt.sv(f, "Atkcool"))) {
							rt.setSv(f, "Atkcool", 1);
							rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:80", hungry, sleeptime);
							if (truthy((yield* g.callName(f, rt.sv(f, "Target"), "Adjacent", [live(f.src)])))) {
								yield* g.callName(f, rt.sv(f, "Target"), "attack_slime", [live(f.src)]);
							}
						}
					} else {
						if ((!truthy(rt.sv(f, "Atkcool")) && truthy((yield* g.callName(f, rt.sv(f, "Target"), "Adjacent", [live(f.src)]))))) {
							yield* g.srcCall(f, "Feedon", rt.sv(f, "Target"));
						}
					}
				} else {
					if ((!truthy(rt.sv(f, "Atkcool")) && truthy((yield* g.callName(f, rt.sv(f, "Target"), "Adjacent", [live(f.src)]))))) {
						yield* g.srcCall(f, "Feedon", rt.sv(f, "Target"));
					}
				}
			} else {
				if (truthy((rt.isIn(f, rt.sv(f, "Target"), (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)]))) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, rt.sv(f, "Target"), "Adjacent", [live(f.src)])))) {
						yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.sv(f, "Target")]);
					}
				} else {
					rt.setSv(f, "Target", null);
					rt.setSv(f, "AIproc", 0);
					break;
				}
			}
		}
		if (rt.le((sleeptime = (yield* g.srcCall(f, "movement_delay"))), 0)) {
			sleeptime = 1;
		}
		yield* g.call(f, P("/proc/sleep"), null, [add(live(sleeptime), 2)]);
	}
	rt.setSv(f, "AIproc", 0);
	return f.dot;
}, true);

// a spawn(45) body of /mob/living/simple_animal/slime/proc/AIprocess, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:80", function* (f: Frame, hungry: Value, sleeptime: Value) {
	f.vars = () => [hungry, sleeptime];
	rt.setSv(f, "Atkcool", 0);
	return null;
});

// a spawn(45) body of /mob/living/simple_animal/slime/proc/AIprocess, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:69", function* (f: Frame, hungry: Value, sleeptime: Value) {
	f.vars = () => [hungry, sleeptime];
	rt.setSv(f, "Atkcool", 0);
	return null;
});

// /mob/living/simple_animal/slime/proc/handle_environment  (code/modules/mob/living/simple_animal/slime/life.dm:112)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let loc_temp: Value = null, bz_percentage: Value = null, stasis: Value = null;
	f.vars = () => [environment, loc_temp, bz_percentage, stasis];
	if (!truthy(live(environment))) {
		return live(f.dot);
	}
	loc_temp = (yield* g.srcCall(f, "get_temperature", live(environment)));
	if (rt.lt((rt.modSrcVar(f, "bodytemperature", (yield* g.srcCall(f, "adjust_body_temperature", rt.sv(f, "bodytemperature"), live(loc_temp), 1)), add)), 278.1499938964844)) {
		if (rt.le(rt.sv(f, "bodytemperature"), 233.14999389648438)) {
			rt.setSv(f, "Tempstun", 1);
		}
		if (rt.le(rt.sv(f, "bodytemperature"), 223.14999389648438)) {
			if (rt.le(rt.sv(f, "bodytemperature"), 50)) {
				yield* g.srcCall(f, "adjustBruteLoss", 200);
			} else {
				yield* g.srcCall(f, "adjustBruteLoss", multiply((yield* g.call(f, P("/proc/round"), null, [rt.op(f, "Sqrt", [], [rt.sv(f, "bodytemperature")])])), 2));
			}
		}
	} else {
		rt.setSv(f, "Tempstun", 0);
	}
	if (!isEqual(rt.sv(f, "stat"), 2)) {
		bz_percentage = 0;
		if (truthy((rt.isIn(f, "bz", rt.fv(f, "gases", live(environment))) ? 1 : 0))) {
			bz_percentage = divide(rt.index(rt.index(rt.fv(f, "gases", live(environment)), "bz"), 1), (yield* g.callName(f, live(environment), "total_moles", [])));
		}
		stasis = (((rt.ge(live(bz_percentage), 0.05000000074505806) ? 1 : 0) && (rt.lt(rt.sv(f, "bodytemperature"), 373.1499938964844) ? 1 : 0)) || rt.sv(f, "force_stasis"));
		if ((isEqual(rt.sv(f, "stat"), 0) && truthy(live(stasis)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='danger'>Nerve gas in the air has put you in stasis!</span>"]);
			rt.setSv(f, "stat", 1);
			rt.setSv(f, "powerlevel", 0);
			rt.setSv(f, "rabid", 0);
			yield* g.srcCall(f, "update_canmove");
			yield* g.srcCall(f, "regenerate_icons");
		} else {
			if ((isEqual(rt.sv(f, "stat"), 1) && !truthy(live(stasis)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You wake up from the stasis.</span>"]);
				rt.setSv(f, "stat", 0);
				yield* g.srcCall(f, "update_canmove");
				yield* g.srcCall(f, "regenerate_icons");
			}
		}
	}
	yield* g.srcCall(f, "updatehealth");
	return live(f.dot);
}, true);

// /mob/living/simple_animal/slime/proc/adjust_body_temperature  (code/modules/mob/living/simple_animal/slime/life.dm:160)
rt.def("/mob/living/simple_animal/slime/proc/adjust_body_temperature", function adjust_body_temperature(f: Frame, current: Value, loc_temp: Value, boost: Value) {
	let temperature: Value = null, difference: Value = null, increments: Value = null, change: Value = null, temp_change: Value = null;
	f.vars = () => [temperature, difference, increments, change, temp_change];
	temperature = live(current);
	difference = rt.op(f, "Abs", [], [subtract(live(current), live(loc_temp))]);
	increments = null;
	if (rt.gt(live(difference), 50)) {
		increments = divide(live(difference), 5);
	} else {
		increments = divide(live(difference), 10);
	}
	change = multiply(live(increments), live(boost));
	temp_change = null;
	if (rt.lt(live(current), live(loc_temp))) {
		temperature = rt.call(f, P("/proc/min"), null, [live(loc_temp), add(live(temperature), live(change))]);
	} else {
		if (rt.gt(live(current), live(loc_temp))) {
			temperature = rt.call(f, P("/proc/max"), null, [live(loc_temp), subtract(live(temperature), live(change))]);
		}
	}
	return (temp_change = subtract(live(temperature), live(current)));
});

// /mob/living/simple_animal/slime/proc/handle_status_effects  (code/modules/mob/living/simple_animal/slime/life.dm:177)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.op(f, "Prob", [], [30])) && !truthy(rt.sv(f, "stat")))) return f.dot;
	yield* g.srcCall(f, "adjustBruteLoss", -1);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/handle_feeding  (code/modules/mob/living/simple_animal/slime/life.dm:182)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_feeding", function* handle_feeding(f: Frame) {
	let M: Value = null, C: Value = null, SA: Value = null, totaldamage: Value = null;
	f.vars = () => [M, C, SA, totaldamage];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "buckled")])))) {
		return live(f.dot);
	}
	M = rt.sv(f, "buckled");
	if (truthy(rt.sv(f, "stat"))) {
		yield* g.callSrc(f, "Feedstop", ["silent", 1], rt.Args.Named);
	}
	if (isEqual(rt.fv(f, "stat", live(M)), 2)) {
		if (!truthy(rt.sv(f, "client"))) {
			if ((!truthy(rt.sv(f, "rabid")) && !truthy(rt.sv(f, "attacked")))) {
				if ((truthy(rt.fv(f, "LAssailant", live(M))) && !isEqual(rt.fv(f, "LAssailant", live(M)), live(M)))) {
					if (truthy(rt.op(f, "Prob", [], [50]))) {
						if (!truthy((rt.isIn(f, rt.fv(f, "LAssailant", live(M)), rt.sv(f, "Friends")) ? 1 : 0))) {
							rt.setAt(rt.sv(f, "Friends"), rt.fv(f, "LAssailant", live(M)), 1);
						} else {
							rt.incAt(rt.sv(f, "Friends"), rt.fv(f, "LAssailant", live(M)), 1, false);
						}
					}
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<i>This subject does not have a strong enough life energy anymore...</i>"]);
		}
		if ((truthy(rt.fv(f, "client", live(M))) && truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0)))) {
			if (truthy(rt.op(f, "Prob", [], [85]))) {
				rt.setSv(f, "rabid", 1);
			}
		}
		yield* g.srcCall(f, "Feedstop");
		return live(f.dot);
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(M)), "adjustCloneLoss", [(yield* g.call(f, P("/proc/rand"), null, [2, 4]))]);
		yield* g.callName(f, live(C), "adjustToxLoss", [(yield* g.call(f, P("/proc/rand"), null, [1, 2]))]);
		if ((truthy(rt.op(f, "Prob", [], [10])) && truthy(rt.fv(f, "client", live(C))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='userdanger'>＀</span>", [rt.op(f, "PickUnweighted", [7], ["You can feel your body becoming weak!", "You feel like you're about to die!", "You feel every part of your body screaming in agony!", "A low, rolling pain passes through your body!", "Your body feels as if it's falling apart!", "You feel extremely weak!", "A sharp, deep pain bathes every inch of your body!"])])]);
		}
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/simple_animal")) ? 1 : 0))) {
			SA = live(M);
			totaldamage = 0;
			totaldamage = rt.modify(live(totaldamage), (yield* g.callName(f, live(SA), "adjustCloneLoss", [(yield* g.call(f, P("/proc/rand"), null, [2, 4]))])), add);
			if (rt.le((totaldamage = rt.modify(live(totaldamage), (yield* g.callName(f, live(SA), "adjustToxLoss", [(yield* g.call(f, P("/proc/rand"), null, [1, 2]))])), add)), 0)) {
				yield* g.srcCall(f, "Feedstop", 0, 0);
				return live(f.dot);
			}
		} else {
			yield* g.srcCall(f, "Feedstop", 0, 0);
			return live(f.dot);
		}
	}
	yield* g.srcCall(f, "add_nutrition", multiply((yield* g.call(f, P("/proc/rand"), null, [7, 15])), rt.fv(f, "damage_multiplier", rt.gl("config"))));
	yield* g.srcCall(f, "adjustBruteLoss", -3);
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/handle_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:248)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_nutrition", function* handle_nutrition(f: Frame) {
	if (truthy(rt.sv(f, "docile"))) {
		rt.setSv(f, "nutrition", 700);
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		(rt.modSrcVar(f, "nutrition", add(1, rt.sv(f, "is_adult")), subtract));
	}
	if (rt.le(rt.sv(f, "nutrition"), 0)) {
		rt.setSv(f, "nutrition", 0);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.srcCall(f, "adjustBruteLoss", (yield* g.call(f, P("/proc/rand"), null, [0, 5])));
		}
	} else {
		if ((rt.ge(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_grow_nutrition"))) && rt.lt(rt.sv(f, "amount_grown"), 10))) {
			(rt.modSrcVar(f, "nutrition", 20, subtract));
			rt.incSrcVar(f, "amount_grown", 1, true);
			yield* g.srcCall(f, "update_action_buttons_icon");
		}
	}
	if (!(((rt.ge(rt.sv(f, "amount_grown"), 10) && !truthy(rt.sv(f, "buckled"))) && !truthy(rt.sv(f, "Target"))) && !truthy(rt.sv(f, "ckey")))) return f.dot;
	if (truthy(rt.sv(f, "is_adult"))) {
		yield* g.srcCall(f, "Reproduce");
	} else {
		yield* g.srcCall(f, "Evolve");
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/add_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:268)
rt.def("/mob/living/simple_animal/slime/proc/add_nutrition", function add_nutrition(f: Frame, nutrition_to_add: Value) {
	f.vars = () => [nutrition_to_add];
	if (live(nutrition_to_add) === null) {
		nutrition_to_add = 0;
	}
	rt.setSv(f, "nutrition", rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "nutrition"), live(nutrition_to_add)), rt.callSrc(f, "get_max_nutrition", [])]));
	if (rt.ge(rt.sv(f, "nutrition"), rt.callSrc(f, "get_grow_nutrition", []))) {
		if (rt.lt(rt.sv(f, "powerlevel"), 10)) {
			if (truthy(rt.op(f, "Prob", [], [subtract(30, multiply(rt.sv(f, "powerlevel"), 2))]))) {
				rt.incSrcVar(f, "powerlevel", 1, true);
			}
		}
	} else {
		if (!rt.ge(rt.sv(f, "nutrition"), add(rt.callSrc(f, "get_hunger_nutrition", []), 100))) return f.dot;
		if (!rt.lt(rt.sv(f, "powerlevel"), 5)) return f.dot;
		if (!truthy(rt.op(f, "Prob", [], [subtract(25, multiply(rt.sv(f, "powerlevel"), 5))]))) return f.dot;
		rt.incSrcVar(f, "powerlevel", 1, true);
	}
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/handle_targets  (code/modules/mob/living/simple_animal/slime/life.dm:283)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_targets", function* handle_targets(f: Frame) {
	let hungry: Value = null, nofriend: Value = null, targets: Value = null, L: Value = null, H: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [hungry, nofriend, targets, L, H, C, $e];
	if (truthy(rt.sv(f, "Tempstun"))) {
		if (!truthy(rt.sv(f, "buckled"))) {
			rt.setSv(f, "canmove", 0);
		}
	} else {
		rt.setSv(f, "canmove", 1);
	}
	if (rt.gt(rt.sv(f, "attacked"), 50)) {
		rt.setSv(f, "attacked", 50);
	}
	if (rt.gt(rt.sv(f, "attacked"), 0)) {
		rt.incSrcVar(f, "attacked", -1, true);
	}
	if (rt.gt(rt.sv(f, "Discipline"), 0)) {
		if ((rt.ge(rt.sv(f, "Discipline"), 5) && truthy(rt.sv(f, "rabid")))) {
			if (truthy(rt.op(f, "Prob", [], [60]))) {
				rt.setSv(f, "rabid", 0);
			}
		}
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.incSrcVar(f, "Discipline", -1, true);
		}
	}
	if (truthy(rt.sv(f, "client"))) return f.dot;
	if (!truthy(rt.sv(f, "canmove"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "buckled"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "Target"))) {
		rt.incSrcVar(f, "target_patience", -1, false);
		if (((((rt.le(rt.sv(f, "target_patience"), 0) || rt.gt(rt.sv(f, "SStun"), rt.worldTime(f))) || truthy(rt.sv(f, "Discipline"))) || truthy(rt.sv(f, "attacked"))) || truthy(rt.sv(f, "docile")))) {
			rt.setSv(f, "target_patience", 0);
			rt.setSv(f, "Target", null);
		}
	}
	if ((truthy(rt.sv(f, "AIproc")) && rt.gt(rt.sv(f, "SStun"), rt.worldTime(f)))) {
		return live(f.dot);
	}
	hungry = 0;
	if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_starve_nutrition")))) {
		hungry = 2;
	} else {
		if (((rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_grow_nutrition"))) && truthy(rt.op(f, "Prob", [], [25]))) || rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition"))))) {
			hungry = 1;
		}
	}
	if ((isEqual(live(hungry), 2) && !truthy(rt.sv(f, "client")))) {
		if ((rt.gt(rt.len(f, rt.sv(f, "Friends")), 0) && truthy(rt.op(f, "Prob", [], [1])))) {
			nofriend = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "Friends")]);
			rt.incAt(rt.sv(f, "Friends"), live(nofriend), -1, false);
		}
	}
	if (!truthy(rt.sv(f, "Target"))) {
		if ((((truthy((yield* g.srcCall(f, "will_hunt"))) && truthy(live(hungry))) || truthy(rt.sv(f, "attacked"))) || truthy(rt.sv(f, "rabid")))) {
			targets = rt.list();
			L = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L = $e;
				if ((truthy((rt.istype(live(L), T("/mob/living/simple_animal/slime")) ? 1 : 0)) || isEqual(rt.fv(f, "stat", live(L)), 2))) {
					continue;
				}
				if (truthy((rt.isIn(f, live(L), rt.sv(f, "Friends")) ? 1 : 0))) {
					continue;
				}
				if ((truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0)) && (truthy(rt.sv(f, "rabid")) || truthy(rt.sv(f, "attacked"))))) {
					targets = rt.modify(live(targets), live(L), add);
				}
				if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
					H = live(L);
					if (truthy((rt.isIn(f, rt.fv(f, "type", live(f.src)), rt.gv(f, "ignored_by", rt.gv(f, "species", rt.fv(f, "dna", live(H))))) ? 1 : 0))) {
						continue;
					}
				}
				if (truthy(rt.locateIn(f, T("/mob/living/simple_animal/slime"), rt.fv(f, "buckled_mobs", live(L))))) {
					continue;
				}
				targets = rt.modify(live(targets), live(L), add);
			}
			rt.endFor(f, 0);
			if (rt.gt(rt.len(f, live(targets)), 0)) {
				if (((truthy(rt.sv(f, "attacked")) || truthy(rt.sv(f, "rabid"))) || isEqual(live(hungry), 2))) {
					rt.setSv(f, "Target", rt.index(live(targets), 1));
				} else {
					C = null;
					rt.forList(f, 0, live(targets), T("/mob/living/carbon"));
					while (($e = rt.next(f, 0)) !== undefined) {
						C = $e;
						if ((!truthy(rt.sv(f, "Discipline")) && truthy(rt.op(f, "Prob", [], [5])))) {
							if ((truthy((rt.istype(live(C), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(C), T("/mob/living/carbon/alien/humanoid")) ? 1 : 0)))) {
								rt.setSv(f, "Target", live(C));
								break;
							}
						}
						if ((truthy((rt.istype(live(C), T("/mob/living/carbon/alien/larva")) ? 1 : 0)) || truthy((rt.istype(live(C), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
							rt.setSv(f, "Target", live(C));
							break;
						}
					}
					rt.endFor(f, 0);
				}
			}
		}
		if (truthy(rt.sv(f, "Target"))) {
			rt.setSv(f, "target_patience", (yield* g.call(f, P("/proc/rand"), null, [5, 7])));
			if (truthy(rt.sv(f, "is_adult"))) {
				rt.modSrcVar(f, "target_patience", 3, add);
			}
		}
	}
	if (!truthy(rt.sv(f, "Target"))) {
		if (truthy(rt.sv(f, "Leader"))) {
			if (truthy(rt.sv(f, "holding_still"))) {
				rt.setSv(f, "holding_still", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "holding_still"), 1), 0])));
			} else {
				if ((truthy(rt.sv(f, "canmove")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))))) {
					yield* g.call(f, P("/proc/step_to"), null, [live(f.src), rt.sv(f, "Leader")]);
				}
			}
		} else {
			if (truthy(live(hungry))) {
				if (truthy(rt.sv(f, "holding_still"))) {
					rt.setSv(f, "holding_still", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "holding_still"), live(hungry)), 0])));
				} else {
					if (((truthy(rt.sv(f, "canmove")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) && truthy(rt.op(f, "Prob", [], [50])))) {
						yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
					}
				}
			} else {
				if (truthy(rt.sv(f, "holding_still"))) {
					rt.setSv(f, "holding_still", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "holding_still"), 1), 0])));
				} else {
					if ((truthy(rt.sv(f, "docile")) && truthy(rt.sv(f, "pulledby")))) {
						rt.setSv(f, "holding_still", 10);
					} else {
						if (((truthy(rt.sv(f, "canmove")) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) && truthy(rt.op(f, "Prob", [], [33])))) {
							yield* g.call(f, P("/proc/step"), null, [live(f.src), rt.op(f, "PickUnweighted", [1], [rt.gl("cardinal")])]);
						}
					}
				}
			}
		}
	} else {
		if (truthy(rt.sv(f, "AIproc"))) return f.dot;
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/mob/living/simple_animal/slime/proc/AIprocess")]);
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/handle_mood  (code/modules/mob/living/simple_animal/slime/life.dm:405)
rt.def("/mob/living/simple_animal/slime/proc/handle_mood", function handle_mood(f: Frame) {
	let newmood: Value = null;
	f.vars = () => [newmood];
	newmood = "";
	if ((truthy(rt.sv(f, "rabid")) || truthy(rt.sv(f, "attacked")))) {
		newmood = "angry";
	} else {
		if (truthy(rt.sv(f, "docile"))) {
			newmood = ":3";
		} else {
			if (truthy(rt.sv(f, "Target"))) {
				newmood = "mischevous";
			}
		}
	}
	if (!truthy(live(newmood))) {
		if ((truthy(rt.sv(f, "Discipline")) && truthy(rt.op(f, "Prob", [], [25])))) {
			newmood = "pout";
		} else {
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				newmood = rt.op(f, "PickUnweighted", [3], ["sad", ":3", "pout"]);
			}
		}
	}
	if ((((isEqual(rt.sv(f, "mood"), "sad") || isEqual(rt.sv(f, "mood"), ":3")) || isEqual(rt.sv(f, "mood"), "pout")) && !truthy(live(newmood)))) {
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			newmood = rt.sv(f, "mood");
		}
	}
	if (isEqual(live(newmood), rt.sv(f, "mood"))) return f.dot;
	rt.setSv(f, "mood", live(newmood));
	rt.callSrc(f, "regenerate_icons", []);
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/handle_speech  (code/modules/mob/living/simple_animal/slime/life.dm:430)  may sleep
rt.def("/mob/living/simple_animal/slime/proc/handle_speech", function* handle_speech(f: Frame) {
	let to_say: Value = null, who: Value = null, phrase: Value = null, L: Value = null, t: Value = null, slimes_near: Value = null, dead_slimes: Value = null, friends_near: Value = null, L_5: Value = null, phrases: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [to_say, who, phrase, L, t, slimes_near, dead_slimes, friends_near, L_5, phrases, M, $e];
	to_say = null;
	if (rt.gt(rt.len(f, rt.sv(f, "speech_buffer")), 0)) {
		who = rt.index(rt.sv(f, "speech_buffer"), 1);
		if ((truthy((yield* g.call(f, P("/proc/findtext"), null, [(phrase = rt.index(rt.sv(f, "speech_buffer"), 2)), (yield* g.call(f, P("/proc/num2text"), null, [rt.sv(f, "number")]))]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "slimes"]))))) {
			if ((truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "hello"]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "hi"]))))) {
				to_say = rt.op(f, "PickUnweighted", [2], ["Hello...", "Hi..."]);
			} else {
				if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "follow"])))) {
					if (truthy(rt.sv(f, "Leader"))) {
						if (isEqual(rt.sv(f, "Leader"), live(who))) {
							to_say = rt.op(f, "PickUnweighted", [3], ["Yes...", "Lead...", "Follow..."]);
						} else {
							if (rt.gt(rt.index(rt.sv(f, "Friends"), live(who)), rt.index(rt.sv(f, "Friends"), rt.sv(f, "Leader")))) {
								rt.setSv(f, "Leader", live(who));
								to_say = fmt("Yes... I follow ＀...", [live(who)]);
							} else {
								to_say = fmt("No... I follow ＀...", [rt.sv(f, "Leader")]);
							}
						}
					} else {
						if (rt.ge(rt.index(rt.sv(f, "Friends"), live(who)), 3)) {
							rt.setSv(f, "Leader", live(who));
							to_say = "I follow...";
						} else {
							to_say = rt.op(f, "PickUnweighted", [2], ["No...", "I no follow..."]);
						}
					}
				} else {
					if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "stop"])))) {
						if (truthy(rt.sv(f, "buckled"))) {
							if (rt.ge(rt.index(rt.sv(f, "Friends"), live(who)), 5)) {
								yield* g.srcCall(f, "Feedstop");
								rt.setSv(f, "Target", null);
								if (rt.lt(rt.index(rt.sv(f, "Friends"), live(who)), 7)) {
									rt.incAt(rt.sv(f, "Friends"), live(who), -1, false);
									to_say = "Grrr...";
								} else {
									to_say = "Fine...";
								}
							}
						} else {
							if (truthy(rt.sv(f, "Target"))) {
								if (rt.ge(rt.index(rt.sv(f, "Friends"), live(who)), 4)) {
									rt.setSv(f, "Target", null);
									if (rt.lt(rt.index(rt.sv(f, "Friends"), live(who)), 6)) {
										rt.incAt(rt.sv(f, "Friends"), live(who), -1, false);
										to_say = "Grrr...";
									} else {
										to_say = "Fine...";
									}
								}
							} else {
								if (truthy(rt.sv(f, "Leader"))) {
									if (isEqual(rt.sv(f, "Leader"), live(who))) {
										to_say = "Yes... I stay...";
										rt.setSv(f, "Leader", null);
									} else {
										if (rt.gt(rt.index(rt.sv(f, "Friends"), live(who)), rt.index(rt.sv(f, "Friends"), rt.sv(f, "Leader")))) {
											rt.setSv(f, "Leader", null);
											to_say = "Yes... I stop...";
										} else {
											to_say = "No... keep follow...";
										}
									}
								}
							}
						}
					} else {
						if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "stay"])))) {
							if (truthy(rt.sv(f, "Leader"))) {
								if (isEqual(rt.sv(f, "Leader"), live(who))) {
									rt.setSv(f, "holding_still", multiply(rt.index(rt.sv(f, "Friends"), live(who)), 10));
									to_say = "Yes... stay...";
								} else {
									if (rt.gt(rt.index(rt.sv(f, "Friends"), live(who)), rt.index(rt.sv(f, "Friends"), rt.sv(f, "Leader")))) {
										rt.setSv(f, "holding_still", multiply(subtract(rt.index(rt.sv(f, "Friends"), live(who)), rt.index(rt.sv(f, "Friends"), rt.sv(f, "Leader"))), 10));
										to_say = "Yes... stay...";
									} else {
										to_say = "No... keep follow...";
									}
								}
							} else {
								if (rt.ge(rt.index(rt.sv(f, "Friends"), live(who)), 3)) {
									rt.setSv(f, "holding_still", multiply(rt.index(rt.sv(f, "Friends"), live(who)), 10));
									to_say = "Yes... stay...";
								} else {
									to_say = "No... won't stay...";
								}
							}
						} else {
							if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), "attack"])))) {
								if ((truthy(rt.sv(f, "rabid")) && truthy(rt.op(f, "Prob", [], [20])))) {
									rt.setSv(f, "Target", live(who));
									yield* g.srcCall(f, "AIprocess");
									to_say = "ATTACK!?!?";
								} else {
									if (rt.ge(rt.index(rt.sv(f, "Friends"), live(who)), 8)) {
										L = null;
										rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), rt.list(live(f.src), live(who))), T("/mob/living"));
										while (($e = rt.next(f, 0)) !== undefined) {
											L = $e;
											if (truthy((yield* g.call(f, P("/proc/findtext"), null, [live(phrase), (yield* g.call(f, P("/proc/lowertext"), null, [rt.fv(f, "name", live(L))]))])))) {
												if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/slime")) ? 1 : 0))) {
													to_say = fmt("NO... ＀ slime friend", [live(L)]);
													rt.incAt(rt.sv(f, "Friends"), live(who), -1, false);
												} else {
													if ((!truthy(rt.index(rt.sv(f, "Friends"), live(L))) || rt.lt(rt.index(rt.sv(f, "Friends"), live(L)), 1))) {
														rt.setSv(f, "Target", live(L));
														yield* g.srcCall(f, "AIprocess");
														to_say = fmt("Ok... I attack ＀", [rt.sv(f, "Target")]);
													} else {
														to_say = fmt("No... like ＀ ...", [live(L)]);
														rt.incAt(rt.sv(f, "Friends"), live(who), -1, false);
													}
												}
												break;
											}
										}
										rt.endFor(f, 0);
									} else {
										to_say = "No... no listen";
									}
								}
							}
						}
					}
				}
			}
		}
		rt.setSv(f, "speech_buffer", rt.list());
	}
	if (truthy(live(to_say))) {
		yield* g.srcCall(f, "say", live(to_say));
	} else {
		if (truthy(rt.op(f, "Prob", [], [1]))) {
			yield* g.srcCall(f, "emote", rt.op(f, "PickUnweighted", [5], ["bounce", "sway", "light", "vibrate", "jiggle"]));
		} else {
			t = 10;
			slimes_near = 0;
			dead_slimes = 0;
			friends_near = rt.list();
			L_5 = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, live(f.src)])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				L_5 = $e;
				if ((truthy((rt.istype(live(L_5), T("/mob/living/simple_animal/slime")) ? 1 : 0)) && !isEqual(live(L_5), live(f.src)))) {
					slimes_near = rt.inc(live(slimes_near), 1);
					if (isEqual(rt.fv(f, "stat", live(L_5)), 2)) {
						dead_slimes = rt.inc(live(dead_slimes), 1);
					}
				}
				if (truthy((rt.isIn(f, live(L_5), rt.sv(f, "Friends")) ? 1 : 0))) {
					t = rt.modify(live(t), 20, add);
					friends_near = rt.modify(live(friends_near), live(L_5), add);
				}
			}
			rt.endFor(f, 0);
			if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition")))) {
				t = rt.modify(live(t), 10, add);
			}
			if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_starve_nutrition")))) {
				t = rt.modify(live(t), 10, add);
			}
			if (!(truthy(rt.op(f, "Prob", [], [2])) && truthy(rt.op(f, "Prob", [], [live(t)])))) return f.dot;
			phrases = rt.list();
			if (truthy(rt.sv(f, "Target"))) {
				phrases = rt.modify(live(phrases), fmt("＀... look yummy...", [rt.sv(f, "Target")]), add);
			}
			if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_starve_nutrition")))) {
				phrases = rt.modify(live(phrases), "So... hungry...", add);
				phrases = rt.modify(live(phrases), "Very... hungry...", add);
				phrases = rt.modify(live(phrases), "Need... food...", add);
				phrases = rt.modify(live(phrases), "Must... eat...", add);
			} else {
				if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition")))) {
					phrases = rt.modify(live(phrases), "Hungry...", add);
					phrases = rt.modify(live(phrases), "Where food?", add);
					phrases = rt.modify(live(phrases), "I want to eat...", add);
				}
			}
			phrases = rt.modify(live(phrases), "Rawr...", add);
			phrases = rt.modify(live(phrases), "Blop...", add);
			phrases = rt.modify(live(phrases), "Blorble...", add);
			if ((truthy(rt.sv(f, "rabid")) || truthy(rt.sv(f, "attacked")))) {
				phrases = rt.modify(live(phrases), "Hrr...", add);
				phrases = rt.modify(live(phrases), "Nhuu...", add);
				phrases = rt.modify(live(phrases), "Unn...", add);
			}
			if (isEqual(rt.sv(f, "mood"), ":3")) {
				phrases = rt.modify(live(phrases), "Purr...", add);
			}
			if (truthy(rt.sv(f, "attacked"))) {
				phrases = rt.modify(live(phrases), "Grrr...", add);
			}
			if (rt.lt(rt.sv(f, "bodytemperature"), 273.1499938964844)) {
				phrases = rt.modify(live(phrases), "Cold...", add);
			}
			if (rt.lt(rt.sv(f, "bodytemperature"), 243.14999389648438)) {
				phrases = rt.modify(live(phrases), "So... cold...", add);
				phrases = rt.modify(live(phrases), "Very... cold...", add);
			}
			if (rt.lt(rt.sv(f, "bodytemperature"), 223.14999389648438)) {
				phrases = rt.modify(live(phrases), "...", add);
				phrases = rt.modify(live(phrases), "C... c...", add);
			}
			if (truthy(rt.sv(f, "buckled"))) {
				phrases = rt.modify(live(phrases), "Nom...", add);
				phrases = rt.modify(live(phrases), "Yummy...", add);
			}
			if (rt.gt(rt.sv(f, "powerlevel"), 3)) {
				phrases = rt.modify(live(phrases), "Bzzz...", add);
			}
			if (rt.gt(rt.sv(f, "powerlevel"), 5)) {
				phrases = rt.modify(live(phrases), "Zap...", add);
			}
			if (rt.gt(rt.sv(f, "powerlevel"), 8)) {
				phrases = rt.modify(live(phrases), "Zap... Bzz...", add);
			}
			if (isEqual(rt.sv(f, "mood"), "sad")) {
				phrases = rt.modify(live(phrases), "Bored...", add);
			}
			if (truthy(live(slimes_near))) {
				phrases = rt.modify(live(phrases), "Slime friend...", add);
			}
			if (rt.gt(live(slimes_near), 1)) {
				phrases = rt.modify(live(phrases), "Slime friends...", add);
			}
			if (truthy(live(dead_slimes))) {
				phrases = rt.modify(live(phrases), "What happened?", add);
			}
			if (!truthy(live(slimes_near))) {
				phrases = rt.modify(live(phrases), "Lonely...", add);
			}
			M = null;
			rt.forList(f, 0, live(friends_near));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				phrases = rt.modify(live(phrases), fmt("＀... friend...", [live(M)]), add);
				if (rt.lt(rt.sv(f, "nutrition"), (yield* g.srcCall(f, "get_hunger_nutrition")))) {
					phrases = rt.modify(live(phrases), fmt("＀... feed me...", [live(M)]), add);
				}
			}
			rt.endFor(f, 0);
			yield* g.srcCall(f, "say", rt.op(f, "PickUnweighted", [1], [live(phrases)]));
		}
	}
	return f.dot;
}, true);

// /mob/living/simple_animal/slime/proc/get_max_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:600)
rt.def("/mob/living/simple_animal/slime/proc/get_max_nutrition", function get_max_nutrition(f: Frame) {
	if (truthy(rt.sv(f, "is_adult"))) {
		return 1200;
	} else {
		return 1000;
	}
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/get_grow_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:606)
rt.def("/mob/living/simple_animal/slime/proc/get_grow_nutrition", function get_grow_nutrition(f: Frame) {
	if (truthy(rt.sv(f, "is_adult"))) {
		return 1000;
	} else {
		return 800;
	}
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/get_hunger_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:612)
rt.def("/mob/living/simple_animal/slime/proc/get_hunger_nutrition", function get_hunger_nutrition(f: Frame) {
	if (truthy(rt.sv(f, "is_adult"))) {
		return 600;
	} else {
		return 500;
	}
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/get_starve_nutrition  (code/modules/mob/living/simple_animal/slime/life.dm:618)
rt.def("/mob/living/simple_animal/slime/proc/get_starve_nutrition", function get_starve_nutrition(f: Frame) {
	if (truthy(rt.sv(f, "is_adult"))) {
		return 300;
	} else {
		return 200;
	}
	return f.dot;
});

// /mob/living/simple_animal/slime/proc/will_hunt  (code/modules/mob/living/simple_animal/slime/life.dm:625)
rt.def("/mob/living/simple_animal/slime/proc/will_hunt", function will_hunt(f: Frame, hunger: Value) {
	f.vars = () => [hunger];
	if (live(hunger) === null) {
		hunger = -1;
	}
	if (truthy(rt.sv(f, "docile"))) {
		return 0;
	}
	if (((isEqual(live(hunger), 2) || truthy(rt.sv(f, "rabid"))) || truthy(rt.sv(f, "attacked")))) {
		return 1;
	}
	if (truthy(rt.sv(f, "Leader"))) {
		return 0;
	}
	if (truthy(rt.sv(f, "holding_still"))) {
		return 0;
	}
	return 1;
});
