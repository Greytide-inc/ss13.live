// From code/game/gamemodes/clock_cult/clock_structure.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12148, "/obj/structure/destructible/clockwork", "/obj/structure/destructible", {
	clockwork_desc: null,
	unanchored_icon: null,
	can_be_repaired: 1,
	construction_value: 0,
	immune_to_servant_attacks: 0,
	anchored: 1,
	name: "meme structure",
	desc: "Some frog or something, the fuck?",
	icon: rt.rsc("icons/obj/clockwork_objects.dmi"),
	icon_state: "rare_pepe",
	density: 1,
	resistance_flags: 34,
	break_message: "<span class='warning'>The frog isn't a meme after all!</span>",
	break_sound: rt.rsc("sound/magic/clockwork/anima_fragment_death.ogg"),
	debris: null,
});

// /obj/structure/destructible/clockwork/proc/<init>  (code/game/gamemodes/clock_cult/clock_structure.dm:15)
rt.def("/obj/structure/destructible/clockwork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "debris", rt.alist(f, [T("/obj/item/clockwork/alloy_shards/large"), 1, T("/obj/item/clockwork/alloy_shards/medium"), 2, T("/obj/item/clockwork/alloy_shards/small"), 3]));
	return f.dot;
});

// /obj/structure/destructible/clockwork/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structure.dm:22)
rt.def("/obj/structure/destructible/clockwork/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/change_construction_value"), null, [rt.sv(f, "construction_value")]);
	rt.modGl("all_clockwork_objects", live(f.src), add);
	return f.dot;
});

// /obj/structure/destructible/clockwork/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structure.dm:27)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/change_construction_value"), null, [rt.neg(rt.sv(f, "construction_value"))]);
	(rt.modGl("all_clockwork_objects", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/proc/ratvar_act  (code/game/gamemodes/clock_cult/clock_structure.dm:32)
rt.def("/obj/structure/destructible/clockwork/proc/ratvar_act", function ratvar_act(f: Frame) {
	if (!(truthy(rt.gl("ratvar_awakens")) || truthy(rt.gl("clockwork_gateway_activated")))) return f.dot;
	rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
	return f.dot;
});

// /obj/structure/destructible/clockwork/proc/narsie_act  (code/game/gamemodes/clock_cult/clock_structure.dm:36)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	if (!(truthy((yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [25, 50])), "brute"))) && truthy(live(f.src)))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/proc/examine  (code/game/gamemodes/clock_cult/clock_structure.dm:43)
rt.def("/obj/structure/destructible/clockwork/proc/examine", function examine(f: Frame) {
	let can_see_clockwork: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [can_see_clockwork, $0, $1, $2];
	if ((truthy((can_see_clockwork = (rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]) || (rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) && truthy(rt.sv(f, "clockwork_desc")))) {
		rt.setSv(f, "desc", rt.sv(f, "clockwork_desc"));
	}
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	if (!truthy(rt.sv(f, "unanchored_icon"))) return f.dot;
	$0 = live(f.args[0]);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "anchored"))) {
		$1 = $1;
		$2 = "";
	} else {
		$2 = "not ";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ is ＀secured to the floor.</span>", [$1, $2])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/proc/examine_status  (code/game/gamemodes/clock_cult/clock_structure.dm:52)
rt.def("/obj/structure/destructible/clockwork/proc/examine_status", function examine_status(f: Frame) {
	let t_It: Value = null, t_is: Value = null, heavily_damaged: Value = null, healthpercent: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any;
	f.vars = () => [t_It, t_is, heavily_damaged, healthpercent, $0, $1, $2, $3, $4, $5];
	if ((truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) {
		t_It = rt.callSrc(f, "p_they", [1]);
		t_is = rt.callSrc(f, "p_are", []);
		heavily_damaged = 0;
		if (rt.lt((healthpercent = multiply(divide(rt.sv(f, "obj_integrity"), rt.sv(f, "max_integrity")), 100)), 50)) {
			heavily_damaged = 1;
		}
		if (truthy(live(heavily_damaged))) {
			$0 = "alloy";
		} else {
			$0 = "brass";
		}
		$1 = live(t_It);
		$2 = live(t_is);
		$3 = rt.sv(f, "obj_integrity");
		$4 = rt.sv(f, "max_integrity");
		if (truthy(live(heavily_damaged))) {
			$5 = "!";
		} else {
			$5 = ".";
		}
		return fmt("<span class='＀'>＀ ＀ at <b>＀/＀</b> integrity＀</span>", [$0, $1, $2, $3, $4, $5]);
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/proc/attack_hulk  (code/game/gamemodes/clock_cult/clock_structure.dm:63)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "immune_to_servant_attacks")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "does_attack_animation"] });

// /obj/structure/destructible/clockwork/proc/attack_generic  (code/game/gamemodes/clock_cult/clock_structure.dm:71)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attack_generic", function* attack_generic(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = "brute";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])]))) && truthy(rt.sv(f, "immune_to_servant_attacks")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user", "damage_amount", "damage_type", "damage_flag", "sound_effect"] });

// /obj/structure/destructible/clockwork/proc/mech_melee_attack  (code/game/gamemodes/clock_cult/clock_structure.dm:76)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/mech_melee_attack", function* mech_melee_attack(f: Frame) {
	if (((truthy(rt.fv(f, "occupant", live(f.args[0]))) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [rt.fv(f, "occupant", live(f.args[0]))])))) && truthy(rt.sv(f, "immune_to_servant_attacks")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M"] });

// /obj/structure/destructible/clockwork/proc/get_efficiency_mod  (code/game/gamemodes/clock_cult/clock_structure.dm:85)
rt.def("/obj/structure/destructible/clockwork/proc/get_efficiency_mod", function get_efficiency_mod(f: Frame, increasing: Value) {
	if (truthy(rt.gl("ratvar_awakens"))) {
		if (truthy(live(increasing))) {
			return 0.5;
		}
		return 2;
	}
	f.dot = rt.call(f, P("/proc/max"), null, [rt.op(f, "Sqrt", [], [divide(rt.sv(f, "obj_integrity"), rt.call(f, P("/proc/max"), null, [rt.sv(f, "max_integrity"), 1]))]), 0.5]);
	if (truthy(live(increasing))) {
		(f.dot = rt.modify(live(f.dot), rt.call(f, P("/proc/min"), null, [divide(rt.sv(f, "max_integrity"), rt.call(f, P("/proc/max"), null, [rt.sv(f, "obj_integrity"), 1])), 4]), multiply));
	}
	f.dot = rt.call(f, P("/proc/round"), null, [live(f.dot), 0.009999999776482582]);
	return f.dot;
});

// /obj/structure/destructible/clockwork/proc/can_be_unfasten_wrench  (code/game/gamemodes/clock_cult/clock_structure.dm:91)
rt.def("/obj/structure/destructible/clockwork/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if ((truthy(rt.sv(f, "anchored")) && rt.le(rt.sv(f, "obj_integrity"), rt.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "max_integrity"), 0.25), 1])))) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is too damaged to unsecure!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/structure/destructible/clockwork/proc/attack_ai  (code/game/gamemodes/clock_cult/clock_structure.dm:98)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)])))) return f.dot;
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/proc/attack_animal  (code/game/gamemodes/clock_cult/clock_structure.dm:102)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attack_animal", function* attack_animal(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])))) {
		yield* g.srcCall(f, "attack_hand", live(f.args[0]));
		return 0;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M"] });

// /obj/structure/destructible/clockwork/proc/attackby  (code/game/gamemodes/clock_cult/clock_structure.dm:109)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attackby", function* attackby(f: Frame) {
	if (((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) && truthy(rt.sv(f, "unanchored_icon")))) {
		if (isEqual((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 50)), 2)) {
			yield* g.srcCall(f, "update_anchored", live(f.args[1]), 1);
		}
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user", "params"] });

// /obj/structure/destructible/clockwork/proc/attacked_by  (code/game/gamemodes/clock_cult/clock_structure.dm:116)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/attacked_by", function* attacked_by(f: Frame) {
	if ((truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[1])]))) && truthy(rt.sv(f, "immune_to_servant_attacks")))) {
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["I", "user"] });

// /obj/structure/destructible/clockwork/proc/update_anchored  (code/game/gamemodes/clock_cult/clock_structure.dm:122)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/update_anchored", function* update_anchored(f: Frame, user: Value, do_damage: Value) {
	f.vars = () => [user, do_damage];
	if (truthy(rt.sv(f, "anchored"))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "unanchored_icon"));
		if (truthy(live(do_damage))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.sv(f, "break_sound"), multiply(10, (yield* g.srcCall(f, "get_efficiency_mod", 1))), 1]);
			yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/round"), null, [multiply(rt.sv(f, "max_integrity"), 0.25), 1])), "brute");
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>As you unsecure ＀ from the floor, you see cracks appear in its surface!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/proc/emp_act  (code/game/gamemodes/clock_cult/clock_structure.dm:131)  may sleep
rt.def("/obj/structure/destructible/clockwork/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!(truthy(rt.sv(f, "anchored")) && truthy(rt.sv(f, "unanchored_icon")))) return f.dot;
	rt.setSv(f, "anchored", 0);
	yield* g.srcCall(f, "update_anchored", null, (rt.gt(rt.sv(f, "obj_integrity"), multiply(rt.sv(f, "max_integrity"), 0.25)) ? 1 : 0));
	yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

rt.type(12149, "/obj/structure/destructible/clockwork/massive", "/obj/structure/destructible/clockwork", {
	name: "massive construct",
	desc: "A very large construction.",
	layer: 11,
	density: 0,
	resistance_flags: 35,
});

// /obj/structure/destructible/clockwork/massive/proc/Initialize  (code/game/gamemodes/clock_cult/clock_structure.dm:146)
rt.def("/obj/structure/destructible/clockwork/massive/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("poi_list", live(f.src), add);
	return f.dot;
});

// /obj/structure/destructible/clockwork/massive/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structure.dm:150)  may sleep
rt.def("/obj/structure/destructible/clockwork/massive/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(12152, "/obj/structure/destructible/clockwork/powered", "/obj/structure/destructible/clockwork", {
	target_apc: null,
	active: 0,
	needs_power: 1,
	active_icon: null,
	inactive_icon: null,
});

// /obj/structure/destructible/clockwork/powered/proc/examine  (code/game/gamemodes/clock_cult/clock_structure.dm:166)
rt.def("/obj/structure/destructible/clockwork/powered/proc/examine", function examine(f: Frame) {
	let powered: Value = null, sigil_number: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any, $5: any;
	f.vars = () => [powered, sigil_number, $0, $1, $2, $3, $4, $5];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(f.args[0])])) || truthy((rt.istype(live(f.args[0]), T("/mob/dead/observer")) ? 1 : 0)))) return f.dot;
	powered = rt.callSrc(f, "total_accessable_power", []);
	sigil_number = rt.length(rt.callSrc(f, "check_apc_and_sigils", []));
	$0 = live(f.args[0]);
	if (truthy(live(powered))) {
		$1 = "brass";
	} else {
		$1 = "alloy";
	}
	if (isEqual(live(powered), 9.999999848243207e+30)) {
		$2 = "INFINITY";
	} else {
		$2 = fmt("＀", [live(powered)]);
	}
	$3 = live(sigil_number);
	if (isEqual(live(sigil_number), 1)) {
		$4 = "";
	} else {
		$4 = "s";
	}
	if (isEqual(live(sigil_number), 1)) {
		$5 = "is";
	} else {
		$5 = "are";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='＀'>It has access to <b>＀W</b> of power, and <b>＀</b> Sigil＀ of Transmission ＀ in range.</span>", [$1, $2, $3, $4, $5])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/destructible/clockwork/powered/proc/Destroy  (code/game/gamemodes/clock_cult/clock_structure.dm:174)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/destructible/clockwork/powered/proc/process  (code/game/gamemodes/clock_cult/clock_structure.dm:179)
rt.def("/obj/structure/destructible/clockwork/powered/proc/process", function process(f: Frame) {
	let powered: Value = null;
	let $0: any;
	f.vars = () => [powered, $0];
	if (isEqual((powered = rt.callSrc(f, "total_accessable_power", [])), 26)) {
		$0 = 25;
	} else {
		$0 = live(powered);
	}
	return $0;
}, false, { waitfor: false });

// /obj/structure/destructible/clockwork/powered/proc/can_be_unfasten_wrench  (code/game/gamemodes/clock_cult/clock_structure.dm:184)
rt.def("/obj/structure/destructible/clockwork/powered/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame) {
	if (truthy(rt.sv(f, "active"))) {
		if (!truthy(live(f.args[1]))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ needs to be disabled before it can be unsecured!</span>", [live(f.src)])]);
		}
		return 1;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user", "silent"] });

// /obj/structure/destructible/clockwork/powered/proc/toggle  (code/game/gamemodes/clock_cult/clock_structure.dm:191)
rt.def("/obj/structure/destructible/clockwork/powered/proc/toggle", function toggle(f: Frame, fast_process: Value, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(live(user))) {
		if (!truthy(rt.call(f, P("/proc/is_servant_of_ratvar"), null, [live(user)]))) {
			return 0;
		}
		if ((!truthy(rt.sv(f, "anchored")) && !truthy(rt.sv(f, "active")))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ needs to be secured to the floor before it can be activated!</span>", [live(f.src)])]);
			return 0;
		}
		$0 = live(user);
		if (truthy(rt.sv(f, "active"))) {
			$1 = "dis";
		} else {
			$1 = "en";
		}
		$0 = fmt("<span class='notice'>＀ ＀ables ＀.</span>", [$0, $1, live(f.src)]);
		if (truthy(rt.sv(f, "active"))) {
			$1 = "dis";
		} else {
			$1 = "en";
		}
		rt.callSrc(f, "visible_message", [$0, fmt("<span class='brass'>You ＀able ＀.</span>", [$1, live(f.src)])]);
	}
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "active_icon"));
		if (truthy(live(fast_process))) {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
			}
		} else {
			if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
				rt.setFv(f, "isprocessing", live(f.src), 1);
				rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
			}
		}
	} else {
		rt.setSv(f, "icon_state", rt.sv(f, "inactive_icon"));
		if (truthy(live(fast_process))) {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
		} else {
			rt.setFv(f, "isprocessing", live(f.src), 0);
			(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
		}
	}
	return 1;
});

// /obj/structure/destructible/clockwork/powered/proc/forced_disable  (code/game/gamemodes/clock_cult/clock_structure.dm:214)
rt.def("/obj/structure/destructible/clockwork/powered/proc/forced_disable", function forced_disable(f: Frame, bad_effects: Value) {
	if (!truthy(rt.sv(f, "active"))) return f.dot;
	rt.callSrc(f, "toggle", []);
	return f.dot;
});

// /obj/structure/destructible/clockwork/powered/proc/emp_act  (code/game/gamemodes/clock_cult/clock_structure.dm:217)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	f.vars = () => [severity];
	if (!truthy((yield* g.srcCall(f, "forced_disable", 1)))) return f.dot;
	yield* g.new_(f, T("/obj/effect/temp_visual/emp"), [rt.sv(f, "loc")]);
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/powered/proc/total_accessable_power  (code/game/gamemodes/clock_cult/clock_structure.dm:221)
rt.def("/obj/structure/destructible/clockwork/powered/proc/total_accessable_power", function total_accessable_power(f: Frame) {
	let power: Value = null;
	f.vars = () => [power];
	if ((!truthy(rt.sv(f, "needs_power")) || truthy(rt.gl("ratvar_awakens")))) {
		return 9.999999848243207e+30;
	}
	power = 0;
	power = rt.modify(live(power), rt.callSrc(f, "accessable_apc_power", []), add);
	return (power = rt.modify(live(power), rt.callSrc(f, "accessable_sigil_power", []), add));
});

// /obj/structure/destructible/clockwork/powered/proc/accessable_apc_power  (code/game/gamemodes/clock_cult/clock_structure.dm:231)
rt.def("/obj/structure/destructible/clockwork/powered/proc/accessable_apc_power", function accessable_apc_power(f: Frame) {
	let power: Value = null, A: Value = null, targetAPCA: Value = null, APC: Value = null, APCA: Value = null, apccharge: Value = null;
	let $e: any;
	f.vars = () => [power, A, targetAPCA, APC, APCA, apccharge, $e];
	power = 0;
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	targetAPCA = null;
	APC = null;
	rt.forList(f, 0, rt.gl("apcs_list"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		APC = $e;
		if (isEqual((APCA = rt.call(f, P("/proc/get_area"), null, [live(APC)])), live(A))) {
			rt.setSv(f, "target_apc", live(APC));
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "target_apc"))) {
		if (!isEqual((targetAPCA = rt.call(f, P("/proc/get_area"), null, [rt.sv(f, "target_apc")])), live(A))) {
			rt.setSv(f, "target_apc", null);
		} else {
			if (truthy(rt.fv(f, "cell", rt.sv(f, "target_apc")))) {
				if (rt.ge((apccharge = rt.gv(f, "charge", rt.fv(f, "cell", rt.sv(f, "target_apc")))), 25)) {
					power = rt.modify(live(power), live(apccharge), add);
				}
			}
		}
	}
	return live(power);
});

// /obj/structure/destructible/clockwork/powered/proc/accessable_sigil_power  (code/game/gamemodes/clock_cult/clock_structure.dm:249)
rt.def("/obj/structure/destructible/clockwork/powered/proc/accessable_sigil_power", function accessable_sigil_power(f: Frame) {
	let power: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [power, _T, $e];
	power = 0;
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [2, live(f.src)]), T("/obj/effect/clockwork/sigil/transmission"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		power = rt.modify(live(power), rt.fv(f, "power_charge", live(_T)), add);
	}
	rt.endFor(f, 0);
	return live(power);
});

// /obj/structure/destructible/clockwork/powered/proc/try_use_power  (code/game/gamemodes/clock_cult/clock_structure.dm:255)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/proc/try_use_power", function* try_use_power(f: Frame, amount: Value) {
	let power: Value = null;
	f.vars = () => [amount, power];
	if ((!truthy(rt.sv(f, "needs_power")) || truthy(rt.gl("ratvar_awakens")))) {
		return 1;
	}
	if (rt.le(live(amount), 0)) {
		return 0;
	}
	if ((!truthy((power = (yield* g.srcCall(f, "total_accessable_power")))) || rt.lt(live(power), live(amount)))) {
		return 0;
	}
	return (yield* g.srcCall(f, "use_power", live(amount)));
}, true);

// /obj/structure/destructible/clockwork/powered/proc/use_power  (code/game/gamemodes/clock_cult/clock_structure.dm:265)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/proc/use_power", function* use_power(f: Frame, amount: Value) {
	let sigilpower: Value = null, sigils_in_range: Value = null, _T: Value = null, S: Value = null, _T_3: Value = null, apcpower: Value = null;
	let $e: any;
	f.vars = () => [amount, sigilpower, sigils_in_range, _T, S, _T_3, apcpower, $e];
	sigilpower = (yield* g.srcCall(f, "accessable_sigil_power"));
	sigils_in_range = rt.list();
	_T = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)])), T("/obj/effect/clockwork/sigil/transmission"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		sigils_in_range = rt.modify(live(sigils_in_range), live(_T), add);
	}
	rt.endFor(f, 0);
	while (truthy(live(sigilpower)) && rt.ge(live(amount), 25)) {
		S = null;
		rt.forList(f, 0, live(sigils_in_range));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			_T_3 = live(S);
			if ((rt.ge(live(amount), 25) && truthy((yield* g.callName(f, live(_T_3), "modify_charge", [25]))))) {
				(sigilpower = rt.modify(live(sigilpower), 25, subtract));
				(amount = rt.modify(live(amount), 25, subtract));
			}
		}
		rt.endFor(f, 0);
	}
	apcpower = (yield* g.srcCall(f, "accessable_apc_power"));
	while (rt.ge(live(apcpower), 25) && rt.ge(live(amount), 25)) {
		if (truthy((yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "target_apc")), "use", [25])))) {
			(apcpower = rt.modify(live(apcpower), 25, subtract));
			(amount = rt.modify(live(amount), 25, subtract));
			rt.setFv(f, "charging", rt.sv(f, "target_apc"), 1);
			rt.setFv(f, "chargemode", rt.sv(f, "target_apc"), 1);
			yield* g.callName(f, rt.sv(f, "target_apc"), "update", []);
			yield* g.callName(f, rt.sv(f, "target_apc"), "update_icon", []);
			yield* g.callName(f, rt.sv(f, "target_apc"), "updateUsrDialog", []);
		} else {
			apcpower = 0;
		}
	}
	if (truthy(live(amount))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
}, true);

// /obj/structure/destructible/clockwork/powered/proc/return_power  (code/game/gamemodes/clock_cult/clock_structure.dm:293)  may sleep
rt.def("/obj/structure/destructible/clockwork/powered/proc/return_power", function* return_power(f: Frame, amount: Value) {
	let sigils_in_range: Value = null, S: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [amount, sigils_in_range, S, _T, $e];
	if (rt.le(live(amount), 0)) {
		return 0;
	}
	if (!truthy((rt.istype((sigils_in_range = (yield* g.srcCall(f, "check_apc_and_sigils"))), T("/list")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.len(f, live(sigils_in_range)))) {
		while (rt.ge(live(amount), 25)) {
			S = null;
			rt.forList(f, 0, live(sigils_in_range));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				_T = live(S);
				if ((rt.ge(live(amount), 25) && truthy((yield* g.callName(f, live(_T), "modify_charge", [-25]))))) {
					(amount = rt.modify(live(amount), 25, subtract));
				}
			}
			rt.endFor(f, 0);
		}
	}
	if (((truthy(rt.sv(f, "target_apc")) && truthy(rt.fv(f, "cell", rt.sv(f, "target_apc")))) && truthy((yield* g.callName(f, rt.fv(f, "cell", rt.sv(f, "target_apc")), "give", [live(amount)]))))) {
		rt.setFv(f, "charging", rt.sv(f, "target_apc"), 1);
		rt.setFv(f, "chargemode", rt.sv(f, "target_apc"), 1);
		yield* g.callName(f, rt.sv(f, "target_apc"), "update", []);
		yield* g.callName(f, rt.sv(f, "target_apc"), "update_icon", []);
		yield* g.callName(f, rt.sv(f, "target_apc"), "updateUsrDialog", []);
	}
	return 1;
}, true);

// /obj/structure/destructible/clockwork/powered/proc/check_apc_and_sigils  (code/game/gamemodes/clock_cult/clock_structure.dm:313)
rt.def("/obj/structure/destructible/clockwork/powered/proc/check_apc_and_sigils", function check_apc_and_sigils(f: Frame) {
	let _T: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [_T, L, $e];
	f.dot = rt.list();
	_T = null;
	rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [2, live(f.src)]), T("/obj/effect/clockwork/sigil/transmission"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		f.dot = rt.modify(live(f.dot), live(_T), add);
	}
	rt.endFor(f, 0);
	if (!(!truthy(rt.getLen(f, (L = live(f.dot)))) && (!truthy(rt.sv(f, "target_apc")) || !truthy(rt.fv(f, "cell", rt.sv(f, "target_apc")))))) return f.dot;
	return 0;
});
