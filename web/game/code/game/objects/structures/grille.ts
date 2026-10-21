// From code/game/objects/structures/grille.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12230, "/obj/structure/grille", "/obj/structure", {
	rods_type: rt.typePath("/obj/item/stack/rods"),
	rods_amount: 2,
	rods_broken: 1,
	grille_type: null,
	broken_type: rt.typePath("/obj/structure/grille/broken"),
	anchored: 1,
	flags: 64,
	pressure_resistance: 506.625,
	desc: "A flimsy lattice of metal rods, with screws to secure it to the floor.",
	name: "grille",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "grille",
	density: 1,
	layer: 2.9,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
	integrity_failure: 20,
});

// /obj/structure/grille/proc/<init>  (code/game/objects/structures/grille.dm:11)
rt.def("/obj/structure/grille/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 70, "laser", 70, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/structure/grille/proc/rcd_vals  (code/game/objects/structures/grille.dm:22)
rt.def("/obj/structure/grille/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 20, "cost", 5]);
	} else if ($0 === 4) {
		if (isEqual(rt.fv(f, "window_type", live(the_rcd)), T("/obj/structure/window/reinforced/fulltile"))) {
			return rt.alist(f, ["mode", 4, "delay", 40, "cost", 12]);
		}
		return rt.alist(f, ["mode", 4, "delay", 20, "cost", 8]);
	}
	return 0;
});

// /obj/structure/grille/proc/rcd_act  (code/game/objects/structures/grille.dm:32)  may sleep
rt.def("/obj/structure/grille/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let WD: Value = null;
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, WD, $0];
	$0 = live(passed_mode);
	if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deconstruct the grille.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return 1;
	} else if ($0 === 4) {
		if (truthy(rt.locateIn(f, T("/obj/structure/window"), rt.sv(f, "loc")))) {
			return 0;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You construct the window.</span>"]);
		rt.setFv(f, "anchored", (WD = (yield* g.new_(f, rt.fv(f, "window_type", live(the_rcd)), [rt.sv(f, "loc")]))), 1);
		return 1;
	}
	return 0;
}, true);

// /obj/structure/grille/proc/ratvar_act  (code/game/objects/structures/grille.dm:48)  may sleep
rt.def("/obj/structure/grille/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (truthy(rt.sv(f, "broken"))) {
		yield* g.new_(f, T("/obj/structure/grille/ratvar/broken"), [rt.fv(f, "loc", live(f.src))]);
	} else {
		yield* g.new_(f, T("/obj/structure/grille/ratvar"), [rt.fv(f, "loc", live(f.src))]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/grille/proc/Bumped  (code/game/objects/structures/grille.dm:54)  may sleep
rt.def("/obj/structure/grille/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	let tile_density: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [user, tile_density, AM, $e];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(user)])))) return f.dot;
	tile_density = 0;
	AM = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (isEqual(live(AM), live(f.src))) {
			continue;
		}
		if ((truthy(rt.fv(f, "density", live(AM))) && rt.ge(rt.fv(f, "layer", live(AM)), rt.sv(f, "layer")))) {
			tile_density = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(tile_density))) return f.dot;
	yield* g.srcCall(f, "shock", live(user), 70);
	return f.dot;
}, true);

// /obj/structure/grille/proc/attack_paw  (code/game/objects/structures/grille.dm:67)  may sleep
rt.def("/obj/structure/grille/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/grille/proc/attack_hulk  (code/game/objects/structures/grille.dm:73)  may sleep
rt.def("/obj/structure/grille/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	if (!truthy((yield* g.srcCall(f, "shock", live(user), 70)))) {
		yield* g.callSuper(f, [live(user), 1]);
	}
	return 1;
}, true);

// /obj/structure/grille/proc/attack_hand  (code/game/objects/structures/grille.dm:79)  may sleep
rt.def("/obj/structure/grille/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src), "kick"]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ hits ＀.</span>", [live(user), live(f.src)]), null, null, 3]);
	if (truthy((yield* g.srcCall(f, "shock", live(user), 70)))) return f.dot;
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [5, 10])), "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/structure/grille/proc/attack_alien  (code/game/objects/structures/grille.dm:86)  may sleep
rt.def("/obj/structure/grille/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "do_attack_animation", [live(f.src)]);
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ mangles ＀.</span>", [live(user), live(f.src)]), null, null, 3]);
	if (truthy((yield* g.srcCall(f, "shock", live(user), 70)))) return f.dot;
	yield* g.srcCall(f, "take_damage", 20, "brute", "melee", 1);
	return f.dot;
}, true);

// /obj/structure/grille/proc/CanPass  (code/game/objects/structures/grille.dm:94)
rt.def("/obj/structure/grille/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	f.vars = () => [height];
	if (live(height) === null) {
		height = 0;
	}
	if (isEqual(live(height), 0)) {
		return 1;
	}
	if ((truthy((rt.istype(live(mover), T("/atom/movable")) ? 1 : 0)) && truthy(rt.callName(f, live(mover), "checkpass", [4])))) {
		return 1;
	} else {
		if ((truthy((rt.istype(live(mover), T("/obj/item/projectile")) ? 1 : 0)) && truthy(rt.sv(f, "density")))) {
			return rt.op(f, "Prob", [], [30]);
		}
		return (!truthy(rt.sv(f, "density")) ? 1 : 0);
	}
	return f.dot;
});

// /obj/structure/grille/proc/CanAStarPass  (code/game/objects/structures/grille.dm:104)
rt.def("/obj/structure/grille/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	let mover: Value = null;
	f.vars = () => [mover];
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	if (!truthy((rt.istype(live(caller), T("/atom/movable")) ? 1 : 0))) return f.dot;
	mover = live(caller);
	f.dot = (live(f.dot) || rt.callName(f, live(mover), "checkpass", [4]));
	return f.dot;
});

// /obj/structure/grille/proc/attackby  (code/game/objects/structures/grille.dm:110)  may sleep
rt.def("/obj/structure/grille/proc/attackby", function* attackby(f: Frame) {
	let R: Value = null, ST: Value = null, dir_to_set: Value = null, WINDOW: Value = null, WD: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [R, ST, dir_to_set, WINDOW, WD, $0, $1, $2, $e];
	yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "shock", live(f.args[1]), 100)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
			yield* g.srcCall(f, "deconstruct");
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) || truthy(rt.sv(f, "anchored"))))) {
			if (!truthy((yield* g.srcCall(f, "shock", live(f.args[1]), 90)))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
				rt.setSv(f, "anchored", (!truthy(rt.sv(f, "anchored")) ? 1 : 0));
				$0 = live(f.args[1]);
				$1 = live(f.args[1]);
				if (truthy(rt.sv(f, "anchored"))) {
					$1 = $1;
					$2 = "fastens";
				} else {
					$2 = "unfastens";
				}
				$1 = fmt("<span class='notice'>＀ ＀ ＀.</span>", [$1, $2, live(f.src)]);
				if (truthy(rt.sv(f, "anchored"))) {
					$2 = fmt("fasten ＀ to", [live(f.src)]);
				} else {
					$2 = fmt("unfasten ＀ from", [live(f.src)]);
				}
				yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='notice'>You ＀ the floor.</span>", [$2])]);
				return live(f.dot);
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/rods")) ? 1 : 0)) && truthy(rt.sv(f, "broken")))) {
				R = live(f.args[0]);
				if (!truthy((yield* g.srcCall(f, "shock", live(f.args[1]), 90)))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ rebuilds the broken grille.</span>", [live(f.args[1])]), "<span class='notice'>You rebuild the broken grille.</span>"]);
					yield* g.new_(f, rt.sv(f, "grille_type"), [rt.fv(f, "loc", live(f.src))]);
					yield* g.callName(f, live(R), "use", [1]);
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					return live(f.dot);
				}
			} else {
				if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/rglass")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/glass")) ? 1 : 0)))) {
					if (!truthy(rt.sv(f, "broken"))) {
						if (rt.lt((yield* g.callName(f, (ST = live(f.args[0])), "get_amount", [])), 2)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least two sheets of glass for that!</span>"]);
							return live(f.dot);
						}
						dir_to_set = 10;
						if (!truthy(rt.sv(f, "anchored"))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ needs to be fastened to the floor first!</span>", [live(f.src)])]);
							return live(f.dot);
						}
						WINDOW = null;
						rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/window"));
						while (($e = rt.next(f, 0)) !== undefined) {
							WINDOW = $e;
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a window there!</span>"]);
							return live(f.dot);
						}
						rt.endFor(f, 0);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start placing the window...</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named)))) {
							if ((!truthy(rt.fv(f, "loc", live(f.src))) || !truthy(rt.sv(f, "anchored")))) {
								return live(f.dot);
							}
							WINDOW = null;
							rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/structure/window"));
							while (($e = rt.next(f, 0)) !== undefined) {
								WINDOW = $e;
								return live(f.dot);
							}
							rt.endFor(f, 0);
							WD = null;
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/rglass")) ? 1 : 0))) {
								WD = (yield* g.new_(f, T("/obj/structure/window/reinforced/fulltile"), [rt.sv(f, "loc")]));
							} else {
								WD = (yield* g.new_(f, T("/obj/structure/window/fulltile"), [rt.sv(f, "loc")]));
							}
							yield* g.callName(f, live(WD), "setDir", [live(dir_to_set)]);
							rt.setFv(f, "ini_dir", live(WD), live(dir_to_set));
							rt.setFv(f, "anchored", live(WD), 0);
							rt.setFv(f, "state", live(WD), 0);
							yield* g.callName(f, live(ST), "use", [2]);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You place ＀ on ＀.</span>", [live(WD), live(f.src)])]);
						}
						return live(f.dot);
					}
				} else {
					if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/shard")) ? 1 : 0)) || !truthy((yield* g.srcCall(f, "shock", live(f.args[1]), 70))))) return f.dot;
					return (yield* g.callSuper(f, [], rt.Args.Same));
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/grille/proc/play_attack_sound  (code/game/objects/structures/grille.dm:171)
rt.def("/obj/structure/grille/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
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
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/effects/grillehit.ogg"), 80, 1]);
		} else {
			rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/tap.ogg"), 50, 1]);
		}
	} else if ($0 === "fire") {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder.ogg"), 80, 1]);
	}
	return f.dot;
});

// /obj/structure/grille/proc/deconstruct  (code/game/objects/structures/grille.dm:182)  may sleep
rt.def("/obj/structure/grille/proc/deconstruct", function* deconstruct(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(rt.sv(f, "loc"))) {
		return live(f.dot);
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.srcCall(f, "transfer_fingerprints_to", (R = (yield* g.new_(f, rt.sv(f, "rods_type"), [rt.fv(f, "loc", live(f.src)), rt.sv(f, "rods_amount")]))));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/structure/grille/proc/obj_break  (code/game/objects/structures/grille.dm:191)  may sleep
rt.def("/obj/structure/grille/proc/obj_break", function* obj_break(f: Frame) {
	let R: Value = null;
	f.vars = () => [R];
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	yield* g.new_(f, rt.sv(f, "broken_type"), [rt.fv(f, "loc", live(f.src))]);
	yield* g.srcCall(f, "transfer_fingerprints_to", (R = (yield* g.new_(f, rt.sv(f, "rods_type"), [rt.fv(f, "loc", live(f.src)), rt.sv(f, "rods_broken")]))));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/grille/proc/shock  (code/game/objects/structures/grille.dm:202)  may sleep
rt.def("/obj/structure/grille/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let _T: Value = null, C: Value = null, s: Value = null;
	f.vars = () => [user, prb, _T, C, s];
	if ((!truthy(rt.sv(f, "anchored")) || truthy(rt.sv(f, "broken")))) {
		return 0;
	}
	if (!truthy(rt.op(f, "Prob", [], [live(prb)]))) {
		return 0;
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return 0;
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy((C = (yield* g.callName(f, live(_T), "get_cable_node", []))))) {
		if (truthy((yield* g.call(f, P("/proc/electrocute_mob"), null, [live(user), live(C), live(f.src), 1, 1])))) {
			yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [3, 1, live(f.src)]);
			yield* g.callName(f, live(s), "start", []);
			return 1;
		} else {
			return 0;
		}
	}
	return 0;
}, true);

// /obj/structure/grille/proc/temperature_expose  (code/game/objects/structures/grille.dm:221)  may sleep
rt.def("/obj/structure/grille/proc/temperature_expose", function* temperature_expose(f: Frame) {
	if (!truthy(rt.sv(f, "broken"))) {
		if (rt.gt(live(f.args[1]), 1773.1500244140625)) {
			yield* g.srcCall(f, "take_damage", 1, "fire", 0, 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["air", "exposed_temperature", "exposed_volume"] });

// /obj/structure/grille/proc/hitby  (code/game/objects/structures/grille.dm:227)  may sleep
rt.def("/obj/structure/grille/proc/hitby", function* hitby(f: Frame) {
	let _T: Value = null, C: Value = null;
	f.vars = () => [_T, C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0))) {
		if (((truthy(rt.op(f, "Prob", [], [50])) && truthy(rt.sv(f, "anchored"))) && !truthy(rt.sv(f, "broken")))) {
			_T = rt.getStep(f, live(f.src), 0);
			if (truthy((C = (yield* g.callName(f, live(_T), "get_cable_node", []))))) {
				yield* g.call(f, P("/proc/playsound"), null, [null, rt.fv(f, "loc", live(f.src)), null, rt.rsc("sound/magic/lightningshock.ogg"), null, 100, null, 1, "extrarange", 5], rt.Args.Named);
				yield* g.call(f, P("/proc/tesla_zap"), null, [live(f.src), 3, multiply(rt.gv(f, "avail", rt.fv(f, "powernet", live(C))), 0.009999999776482582)]);
				rt.modField(f, rt.fv(f, "powernet", live(C)), "load", multiply(rt.gv(f, "avail", rt.fv(f, "powernet", live(C))), 0.03750000149011612), add);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["AM"] });

rt.type(12231, "/obj/structure/grille/ratvar", "/obj/structure/grille", {
	icon_state: "ratvargrille",
	name: "cog grille",
	desc: "A strangely-shaped grille.",
	broken_type: rt.typePath("/obj/structure/grille/ratvar/broken"),
});

// /obj/structure/grille/ratvar/proc/New  (code/game/objects/structures/grille.dm:258)  may sleep
rt.def("/obj/structure/grille/ratvar/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "broken"))) {
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/grille/broken"), [rt.getStep(f, live(f.src), 0)]);
	} else {
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/grille"), [rt.getStep(f, live(f.src), 0)]);
		yield* g.new_(f, T("/obj/effect/temp_visual/ratvar/beam/grille"), [rt.getStep(f, live(f.src), 0)]);
	}
	return f.dot;
}, true);

// /obj/structure/grille/ratvar/proc/narsie_act  (code/game/objects/structures/grille.dm:266)  may sleep
rt.def("/obj/structure/grille/ratvar/proc/narsie_act", function* narsie_act(f: Frame) {
	let previouscolor: Value = null;
	f.vars = () => [previouscolor];
	yield* g.srcCall(f, "take_damage", (yield* g.call(f, P("/proc/rand"), null, [1, 3])), "brute");
	if (!truthy(live(f.src))) return f.dot;
	previouscolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#960000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(previouscolor), "time", 8]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 8]);
	return f.dot;
}, true);
