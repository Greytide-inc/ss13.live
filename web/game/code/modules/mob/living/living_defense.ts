// From code/modules/mob/living/living_defense.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/run_armor_check  (code/modules/mob/living/living_defense.dm:3)
rt.def("/mob/living/proc/run_armor_check", function run_armor_check(f: Frame, def_zone: Value, attack_flag: Value, absorb_text: Value, soften_text: Value, armour_penetration: Value, penetrated_text: Value) {
	let armor: Value = null;
	f.vars = () => [def_zone, attack_flag, absorb_text, soften_text, armor];
	if (live(def_zone) === null) {
		def_zone = null;
	}
	if (live(attack_flag) === null) {
		attack_flag = "melee";
	}
	if (live(absorb_text) === null) {
		absorb_text = null;
	}
	if (live(soften_text) === null) {
		soften_text = null;
	}
	if ((truthy((armor = rt.callSrc(f, "getarmor", [live(def_zone), live(attack_flag)]))) && truthy(live(armour_penetration)))) {
		armor = rt.call(f, P("/proc/max"), null, [0, subtract(live(armor), live(armour_penetration))]);
		if (truthy(live(penetrated_text))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='userdanger'>＀</span>", [live(penetrated_text)])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Your armor was penetrated!</span>"]);
		}
	} else {
		if (rt.ge(live(armor), 100)) {
			if (truthy(live(absorb_text))) {
				rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='userdanger'>＀</span>", [live(absorb_text)])]);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Your armor absorbs the blow!</span>"]);
			}
		} else {
			if (rt.gt(live(armor), 0)) {
				if (truthy(live(soften_text))) {
					rt.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='userdanger'>＀</span>", [live(soften_text)])]);
				} else {
					rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>Your armor softens the blow!</span>"]);
				}
			}
		}
	}
	return live(armor);
});

// /mob/living/proc/bullet_act  (code/modules/mob/living/living_defense.dm:46)  may sleep
rt.def("/mob/living/proc/bullet_act", function* bullet_act(f: Frame, _P: Value, def_zone: Value) {
	let armor: Value = null;
	f.vars = () => [_P, def_zone, armor];
	armor = (yield* g.srcCall(f, "run_armor_check", live(def_zone), rt.fv(f, "flag", live(_P)), "", "", rt.fv(f, "armour_penetration", live(_P))));
	if (!truthy(rt.fv(f, "nodamage", live(_P)))) {
		yield* g.srcCall(f, "apply_damage", rt.fv(f, "damage", live(_P)), rt.fv(f, "damage_type", live(_P)), live(def_zone), live(armor));
		if (truthy(rt.fv(f, "dismemberment", live(_P)))) {
			yield* g.srcCall(f, "check_projectile_dismemberment", live(_P), live(def_zone));
		}
	}
	return (yield* g.callName(f, live(_P), "on_hit", [live(f.src), live(armor)]));
}, true);

// /obj/item/proc/get_volume_by_throwforce_and_or_w_class  (code/modules/mob/living/living_defense.dm:57)
rt.def("/obj/item/proc/get_volume_by_throwforce_and_or_w_class", function get_volume_by_throwforce_and_or_w_class(f: Frame) {
	if ((truthy(rt.sv(f, "throwforce")) && truthy(rt.sv(f, "w_class")))) {
		return rt.call(f, P("/proc/max"), null, [30, rt.call(f, P("/proc/min"), null, [multiply(add(rt.sv(f, "throwforce"), rt.sv(f, "w_class")), 5), 100])]);
	}
	if (truthy(rt.sv(f, "w_class"))) {
		return rt.call(f, P("/proc/max"), null, [20, rt.call(f, P("/proc/min"), null, [multiply(rt.sv(f, "w_class"), 8), 100])]);
	}
	return 0;
});

// /mob/living/proc/hitby  (code/modules/mob/living/living_defense.dm:65)  may sleep
rt.def("/mob/living/proc/hitby", function* hitby(f: Frame) {
	let I: Value = null, zone: Value = null, dtype: Value = null, volume: Value = null, W: Value = null, armor: Value = null;
	f.vars = () => [I, zone, dtype, volume, W, armor];
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item")) ? 1 : 0))) {
		I = live(f.args[0]);
		zone = (yield* g.call(f, P("/proc/ran_zone"), null, ["chest", 65]));
		dtype = "brute";
		volume = (yield* g.callName(f, live(I), "get_volume_by_throwforce_and_or_w_class", []));
		if (truthy((rt.istype(live(I), T("/obj/item/weapon")) ? 1 : 0))) {
			dtype = rt.gv(f, "damtype", (W = live(I)));
			if (rt.gt(rt.fv(f, "throwforce", live(W)), 0)) {
				if (truthy(rt.fv(f, "throwhitsound", live(W)))) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "throwhitsound", live(W)), live(volume), 1, -1]);
				} else {
					if (truthy(rt.fv(f, "hitsound", live(W)))) {
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "hitsound", live(W)), live(volume), 1, -1]);
					} else {
						if (!truthy(rt.fv(f, "throwhitsound", live(W)))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), live(volume), 1, -1]);
						}
					}
				}
			}
		} else {
			if ((!truthy(rt.fv(f, "throwhitsound", live(I))) && rt.gt(rt.fv(f, "throwforce", live(I)), 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), live(volume), 1, -1]);
			}
		}
		if (!truthy(rt.fv(f, "throwforce", live(I)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/throwtap.ogg"), 1, live(volume), -1]);
		}
		if (!truthy(live(f.args[3]))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has been hit by ＀.</span>", [live(f.src), live(I)]), fmt("<span class='userdanger'>＀ has been hit by ＀.</span>", [live(f.src), live(I)]));
			armor = (yield* g.srcCall(f, "run_armor_check", live(zone), "melee", fmt("Your armor has protected your ＀.", [(yield* g.call(f, P("/proc/parse_zone"), null, [live(zone)]))]), fmt("Your armor has softened hit to your ＀.", [(yield* g.call(f, P("/proc/parse_zone"), null, [live(zone)]))]), rt.fv(f, "armour_penetration", live(I))));
			yield* g.srcCall(f, "apply_damage", rt.fv(f, "throwforce", live(I)), live(dtype), live(zone), live(armor));
			if (truthy(rt.fv(f, "thrownby", live(I)))) {
				yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "thrownby", live(I)), live(f.src), "hit", live(I)]);
			}
		} else {
			return 1;
		}
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/genhit.ogg"), 50, 1, -1]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM", "skipcatch", "hitpush", "blocked"] });

// /mob/living/proc/mech_melee_attack  (code/modules/mob/living/living_defense.dm:101)  may sleep
rt.def("/mob/living/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	if (isEqual(rt.gv(f, "a_intent", rt.fv(f, "occupant", live(M))), "harm")) {
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
		if (isEqual(rt.fv(f, "damtype", live(M)), "brute")) {
			yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(M), 15]);
		}
		$0 = rt.fv(f, "damtype", live(M));
		if ($0 === "brute") {
			yield* g.srcCall(f, "Unconscious", 20);
			yield* g.srcCall(f, "take_overall_damage", (yield* g.call(f, P("/proc/rand"), null, [divide(rt.fv(f, "force", live(M)), 2), rt.fv(f, "force", live(M))])));
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/punch4.ogg"), 50, 1]);
		} else if ($0 === "fire") {
			yield* g.srcCall(f, "take_overall_damage", 0, (yield* g.call(f, P("/proc/rand"), null, [divide(rt.fv(f, "force", live(M)), 2), rt.fv(f, "force", live(M))])));
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 50, 1]);
		} else if ($0 === "tox") {
			yield* g.callName(f, live(M), "mech_toxin_damage", [live(f.src)]);
		} else {
			return live(f.dot);
		}
		yield* g.srcCall(f, "updatehealth");
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has hit ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='userdanger'>＀ has hit ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, 3);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", live(M)), live(f.src), "attacked", live(M), fmt("(INTENT: ＀) (DAMTYPE: ＀)", [(yield* g.call(f, P("/proc/uppertext"), null, [rt.gv(f, "a_intent", rt.fv(f, "occupant", live(M)))])), (yield* g.call(f, P("/proc/uppertext"), null, [rt.fv(f, "damtype", live(M))]))])]);
	} else {
		yield* g.call(f, P("/proc/step_away"), null, [live(f.src), live(M)]);
		yield* g.call(f, P("/proc/add_logs"), null, [rt.fv(f, "occupant", live(M)), live(f.src), "pushed", live(M)]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ pushes ＀ out of the way.</span>", [live(M), live(f.src)]), null, null, 5);
	}
	return f.dot;
}, true);

// /mob/living/proc/fire_act  (code/modules/mob/living/living_defense.dm:127)  may sleep
rt.def("/mob/living/proc/fire_act", function* fire_act(f: Frame) {
	yield* g.srcCall(f, "adjust_fire_stacks", 3);
	yield* g.srcCall(f, "IgniteMob");
	return f.dot;
}, true);

// /mob/living/proc/grabbedby  (code/modules/mob/living/living_defense.dm:131)  may sleep
rt.def("/mob/living/proc/grabbedby", function* grabbedby(f: Frame, user: Value, supress_message: Value) {
	f.vars = () => [user, supress_message];
	if (live(supress_message) === null) {
		supress_message = 0;
	}
	if (((isEqual(live(user), live(f.src)) || truthy(rt.sv(f, "anchored"))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))]))))) {
		return 0;
	}
	if ((!truthy(rt.fv(f, "pulling", live(user))) || !isEqual(rt.fv(f, "pulling", live(user)), live(f.src)))) {
		yield* g.callName(f, live(user), "start_pulling", [live(f.src), live(supress_message)]);
		return live(f.dot);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "status_flags"), 8))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ can't be grabbed more aggressively!</span>", [live(f.src)])]);
		return 0;
	}
	yield* g.srcCall(f, "grippedby", live(user));
	return f.dot;
}, true);

// /mob/living/proc/grippedby  (code/modules/mob/living/living_defense.dm:144)  may sleep
rt.def("/mob/living/proc/grippedby", function* grippedby(f: Frame, user: Value) {
	let old_grab_state: Value = null, grab_upgrade_time: Value = null;
	let $0: any;
	f.vars = () => [user, old_grab_state, grab_upgrade_time, $0];
	if (!rt.lt(rt.fv(f, "grab_state", live(user)), 3)) return f.dot;
	yield* g.callName(f, live(user), "changeNext_move", [10]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1]);
	if (truthy(rt.fv(f, "grab_state", live(user)))) {
		old_grab_state = rt.fv(f, "grab_state", live(user));
		grab_upgrade_time = 30;
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ starts to tighten ＀ grip on ＀!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src)]), fmt("<span class='userdanger'>＀ starts to tighten ＀ grip on you!</span>", [live(user), (yield* g.callName(f, live(user), "p_their", []))]));
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(f.src), live(grab_upgrade_time)])))) {
			return 0;
		}
		if ((((!truthy(rt.fv(f, "pulling", live(user))) || !isEqual(rt.fv(f, "pulling", live(user)), live(f.src))) || !isEqual(rt.fv(f, "grab_state", live(user)), live(old_grab_state))) || !isEqual(rt.fv(f, "a_intent", live(user)), "grab"))) {
			return 0;
		}
	}
	rt.incField(f, live(user), "grab_state", 1, true);
	$0 = rt.fv(f, "grab_state", live(user));
	if ($0 === 1) {
		yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(f.src), null, "grabbed", "addition", "aggressively"], rt.Args.Named);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has grabbed ＀ aggressively!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ has grabbed ＀ aggressively!</span>", [live(user), live(f.src)]));
		yield* g.srcCall(f, "drop_all_held_items");
		yield* g.srcCall(f, "stop_pulling");
	} else if ($0 === 2) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has grabbed ＀ by the neck!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ has grabbed you by the neck!</span>", [live(user)]));
		yield* g.srcCall(f, "update_canmove");
		if ((!truthy(rt.sv(f, "buckled")) && !truthy(rt.sv(f, "density")))) {
			yield* g.srcCall(f, "Move", rt.fv(f, "loc", live(user)));
		}
	} else if ($0 === 3) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ is strangling ＀!</span>", [live(user), live(f.src)]), fmt("<span class='userdanger'>＀ is strangling you!</span>", [live(user)]));
		yield* g.srcCall(f, "update_canmove");
		if ((!truthy(rt.sv(f, "buckled")) && !truthy(rt.sv(f, "density")))) {
			yield* g.srcCall(f, "Move", rt.fv(f, "loc", live(user)));
		}
	}
	return 1;
}, true);

// /mob/living/proc/attack_slime  (code/modules/mob/living/living_defense.dm:181)  may sleep
rt.def("/mob/living/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "You cannot attack people before the game has started."]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "buckled", live(M)))) {
		if (truthy((rt.isIn(f, live(M), rt.sv(f, "buckled_mobs")) ? 1 : 0))) {
			yield* g.callName(f, live(M), "Feedstop", []);
		}
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stat"), 2)) return f.dot;
	yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(f.src), "attacked"]);
	yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>The ＀ glomps ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='userdanger'>The ＀ glomps ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, 3);
	return 1;
}, true);

// /mob/living/proc/attack_animal  (code/modules/mob/living/living_defense.dm:198)  may sleep
rt.def("/mob/living/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "face_atom", [live(f.src)]);
	if (isEqual(rt.fv(f, "melee_damage_upper", live(M)), 0)) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='notice'>＄！ ＀ ＀!</span>", [live(M), rt.fv(f, "friendly", live(M)), live(f.src)])]);
		return 0;
	} else {
		if (truthy(rt.fv(f, "attack_sound", live(M)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "attack_sound", live(M)), 50, 1, 1]);
		}
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＄！ ＀ ＀!</span>", [live(M), rt.fv(f, "attacktext", live(M)), live(f.src)]), fmt("<span class='userdanger'>＄！ ＀ ＀!</span>", [live(M), rt.fv(f, "attacktext", live(M)), live(f.src)]), null, 3);
		yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(f.src), "attacked"]);
		return 1;
	}
	return f.dot;
}, true);

// /mob/living/proc/attack_paw  (code/modules/mob/living/living_defense.dm:213)  may sleep
rt.def("/mob/living/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	f.vars = () => [M];
	if ((truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "loc")), T("/area/start")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "No attacking people at spawn, you jackass."]);
		return 0;
	}
	if (isEqual(rt.fv(f, "a_intent", live(M)), "harm")) {
		if ((truthy((yield* g.callName(f, live(M), "is_muzzled", []))) || (truthy(rt.fv(f, "wear_mask", live(M))) && truthy(rt.bitAnd(rt.gv(f, "flags_cover", rt.fv(f, "wear_mask", live(M))), 8))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You can't bite with your mouth covered!</span>"]);
			return 0;
		}
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src), "bite"]);
		if (truthy(rt.op(f, "Prob", [], [75]))) {
			yield* g.call(f, P("/proc/add_logs"), null, [live(M), live(f.src), "attacked"]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='userdanger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, 3);
			return 1;
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to bite ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), fmt("<span class='userdanger'>＀ has attempted to bite ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, 3);
		}
	}
	return 0;
}, true);

// /mob/living/proc/attack_larva  (code/modules/mob/living/living_defense.dm:234)  may sleep
rt.def("/mob/living/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	let $0: any;
	f.vars = () => [L, $0];
	$0 = rt.fv(f, "a_intent", live(L));
	if ($0 === "help") {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ rubs its head against ＀.</span>", [rt.fv(f, "name", live(L)), live(f.src)]));
		return 0;
	} else {
		yield* g.callName(f, live(L), "do_attack_animation", [live(f.src)]);
		if (truthy(rt.op(f, "Prob", [], [90]))) {
			yield* g.call(f, P("/proc/add_logs"), null, [live(L), live(f.src), "attacked"]);
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(L)), live(f.src)]), fmt("<span class='userdanger'>＀ bites ＀!</span>", [rt.fv(f, "name", live(L)), live(f.src)]), null, 3);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/bite.ogg"), 50, 1, -1]);
			return 1;
		} else {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has attempted to bite ＀!</span>", [rt.fv(f, "name", live(L)), live(f.src)]), fmt("<span class='userdanger'>＀ has attempted to bite ＀!</span>", [rt.fv(f, "name", live(L)), live(f.src)]), null, 3);
		}
	}
	return 0;
}, true);

// /mob/living/proc/attack_alien  (code/modules/mob/living/living_defense.dm:253)  may sleep
rt.def("/mob/living/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	$0 = rt.fv(f, "a_intent", live(M));
	if ($0 === "help") {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ caresses ＀ with its scythe like arm.</span>", [live(M), live(f.src)]));
		return 0;
	} else if ($0 === "grab") {
		yield* g.srcCall(f, "grabbedby", live(M));
		return 0;
	} else if ($0 === "harm") {
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
		return 1;
	} else if ($0 === "disarm") {
		yield* g.callName(f, live(M), "do_attack_animation", [live(f.src), "disarm"]);
		return 1;
	}
	return f.dot;
}, true);

// /mob/living/proc/ex_act  (code/modules/mob/living/living_defense.dm:269)
rt.def("/mob/living/proc/ex_act", function ex_act(f: Frame) {
	if (((truthy(live(f.args[2])) && truthy((rt.istype(live(f.args[2]), T("/datum/spacevine_mutation")) ? 1 : 0))) && truthy(rt.call(f, P("/proc/isvineimmune"), null, [live(f.src)])))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["severity", "target", "origin"], waitfor: false });

// /mob/living/proc/acid_act  (code/modules/mob/living/living_defense.dm:276)  may sleep
rt.def("/mob/living/proc/acid_act", function* acid_act(f: Frame, acidpwr: Value, acid_volume: Value) {
	f.vars = () => [acidpwr, acid_volume];
	yield* g.srcCall(f, "take_bodypart_damage", multiply(live(acidpwr), (yield* g.call(f, P("/proc/min"), null, [1, multiply(live(acid_volume), 0.10000000149011612)]))));
	return 1;
}, true);

// /mob/living/proc/electrocute_act  (code/modules/mob/living/living_defense.dm:280)  may sleep
rt.def("/mob/living/proc/electrocute_act", function* electrocute_act(f: Frame, shock_damage: Value, source: Value, siemens_coeff: Value, safety: Value, tesla_shock: Value, illusion: Value, stun: Value) {
	let $0: any;
	f.vars = () => [shock_damage, source, siemens_coeff, safety, tesla_shock, illusion, stun, $0];
	if (live(siemens_coeff) === null) {
		siemens_coeff = 1;
	}
	if (live(safety) === null) {
		safety = 0;
	}
	if (live(tesla_shock) === null) {
		tesla_shock = 0;
	}
	if (live(illusion) === null) {
		illusion = 0;
	}
	if (live(stun) === null) {
		stun = 1;
	}
	$0 = live(tesla_shock);
	if (truthy($0)) {
		if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
			$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "tesla_ignore");
		} else {
			$0 = 0;
		}
	}
	if (truthy($0)) {
		return 0;
	}
	if (!rt.gt(live(shock_damage), 0)) return f.dot;
	if (!truthy(live(illusion))) {
		yield* g.srcCall(f, "adjustFireLoss", live(shock_damage));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ was shocked by ％！!</span>", [live(f.src), live(source)]), "<span class='userdanger'>You feel a powerful shock coursing through your body!</span>", "<span class='italics'>You hear a heavy electrical crack.</span>");
	return live(shock_damage);
}, true, { argTypes: [{  }, { type: 4, path: "/obj" }, {  }, {  }, {  }, {  }, {  }] });

// /mob/living/proc/emp_act  (code/modules/mob/living/living_defense.dm:293)  may sleep
rt.def("/mob/living/proc/emp_act", function* emp_act(f: Frame) {
	let L: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [L, O, $e];
	L = (yield* g.callName(f, live(f.src), "get_contents", []));
	O = null;
	rt.forList(f, 0, live(L), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		yield* g.callName(f, live(O), "emp_act", [live(f.args[0])]);
	}
	rt.endFor(f, 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /mob/living/proc/singularity_act  (code/modules/mob/living/living_defense.dm:300)  may sleep
rt.def("/mob/living/proc/singularity_act", function* singularity_act(f: Frame) {
	let gain: Value = null;
	f.vars = () => [gain];
	gain = 20;
	yield* g.srcCall(f, "investigate_log", fmt("(＀) has been consumed by the singularity.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)]))]), "singulo");
	yield* g.srcCall(f, "gib");
	return live(gain);
}, true);

// /mob/living/proc/narsie_act  (code/modules/mob/living/living_defense.dm:305)  may sleep
rt.def("/mob/living/proc/narsie_act", function* narsie_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)]))) && !truthy(rt.sv(f, "stat")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>You resist Nar-Sie's influence... but not all of it. <i>Run!</i></span>"]);
		yield* g.srcCall(f, "adjustBruteLoss", 35);
		if ((truthy(live(f.src)) && truthy(rt.sv(f, "reagents")))) {
			yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["heparin", 5]);
		}
		return 0;
	}
	if ((truthy(rt.gl("cult_narsie")) && truthy(rt.index(rt.fv(f, "souls_needed", rt.gl("cult_narsie")), live(f.src))))) {
		yield* g.callName(f, rt.gl("cult_narsie"), "resize", [1.100000023841858]);
		(rt.modField(f, rt.gl("cult_narsie"), "souls_needed", live(f.src), subtract));
		rt.modField(f, rt.gl("cult_narsie"), "souls", 1, add);
		if ((isEqual(rt.fv(f, "souls", rt.gl("cult_narsie")), rt.fv(f, "soul_goal", rt.gl("cult_narsie"))) && isEqual(rt.fv(f, "resolved", rt.gl("cult_narsie")), 0))) {
			rt.setFv(f, "resolved", rt.gl("cult_narsie"), 1);
			rt.op(f, "OutputReference", [rt.R.world], [(yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/machines/alarm.ogg")]))], false);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/cult_ending_helper"), 1])), 120]);
			yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/ending_helper")])), 270]);
		}
	}
	if (truthy(rt.sv(f, "client"))) {
		yield* g.call(f, P("/proc/makeNewConstruct"), null, [null, T("/mob/living/simple_animal/hostile/construct/harvester"), null, live(f.src), "cultoverride", 1], rt.Args.Named);
	} else {
		$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 6]));
		if ($0 === 1) {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/construct/armored/hostile"), [rt.getStep(f, live(f.src), 0)]);
		} else if ($0 === 2) {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/construct/wraith/hostile"), [rt.getStep(f, live(f.src), 0)]);
		} else if (rt.inRange($0, 3, 6)) {
			yield* g.new_(f, T("/mob/living/simple_animal/hostile/construct/builder/hostile"), [rt.getStep(f, live(f.src), 0)]);
		}
	}
	yield* g.srcCall(f, "spawn_dust");
	yield* g.srcCall(f, "gib");
	return 1;
}, true);

// /mob/living/proc/ratvar_act  (code/modules/mob/living/living_defense.dm:339)  may sleep
rt.def("/mob/living/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	if ((!isEqual(rt.sv(f, "stat"), 2) && !truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.src)]))))) {
		M = null;
		rt.forList(f, 0, rt.sv(f, "implants"), T("/obj/item/weapon/implant/mindshield"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
		}
		rt.endFor(f, 0);
		if (!truthy((yield* g.call(f, P("/proc/add_servant_of_ratvar"), null, [live(f.src)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='userdanger'>A blinding light boils you alive! <i>Run!</i></span>"]);
			yield* g.srcCall(f, "adjustFireLoss", 35);
			if (truthy(live(f.src))) {
				yield* g.srcCall(f, "adjust_fire_stacks", 1);
				yield* g.srcCall(f, "IgniteMob");
			}
			return 0;
		}
	}
	return 1;
}, true);

// /mob/living/proc/flash_act  (code/modules/mob/living/living_defense.dm:357)  may sleep
rt.def("/mob/living/proc/flash_act", function* flash_act(f: Frame, intensity: Value, override_blindness_check: Value, affect_silicon: Value, visual: Value, type: Value) {
	f.vars = () => [intensity, override_blindness_check, affect_silicon, visual, type];
	if (live(intensity) === null) {
		intensity = 1;
	}
	if (live(override_blindness_check) === null) {
		override_blindness_check = 0;
	}
	if (live(affect_silicon) === null) {
		affect_silicon = 0;
	}
	if (live(visual) === null) {
		visual = 0;
	}
	if (live(type) === null) {
		type = T("/obj/screen/fullscreen/flash");
	}
	if (!(rt.lt((yield* g.srcCall(f, "get_eye_protection")), live(intensity)) && (truthy(live(override_blindness_check)) || !truthy(rt.bitAnd(rt.sv(f, "disabilities"), 1))))) return f.dot;
	yield* g.srcCall(f, "overlay_fullscreen", "flash", live(type));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/proc/clear_fullscreen"), "flash", 25])), 25]);
	return 1;
}, true);

// /mob/living/proc/do_attack_animation  (code/modules/mob/living/living_defense.dm:372)  may sleep
rt.def("/mob/living/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!isEqual(live(f.args[0]), live(f.src))) {
		f.args[4] = (yield* g.srcCall(f, "get_standard_pixel_y_offset", rt.sv(f, "lying")));
	}
	if (!truthy(live(f.args[2]))) {
		f.args[2] = (yield* g.srcCall(f, "get_active_held_item"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "floating", 0);
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
