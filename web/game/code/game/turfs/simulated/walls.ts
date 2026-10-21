// From code/game/turfs/simulated/walls.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4414, "/turf/closed/wall", "/turf/closed", {
	hardness: 40,
	slicing_duration: 100,
	sheet_amount: 2,
	sheet_type: rt.typePath("/obj/item/stack/sheet/metal"),
	girder_type: rt.typePath("/obj/structure/girder"),
	name: "wall",
	desc: "A huge chunk of metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/wall.dmi"),
	icon_state: "wall",
	explosion_block: 1,
	thermal_conductivity: 0,
	heat_capacity: 312500,
	canSmoothWith: null,
	smooth: 1,
});

// /turf/closed/wall/proc/<init>  (code/game/turfs/simulated/walls.dm:17)
rt.def("/turf/closed/wall/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "canSmoothWith", rt.list(T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/brass"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/turf/closed/wall/clockwork")));
	return f.dot;
});

// /turf/closed/wall/proc/handle_ricochet  (code/game/turfs/simulated/walls.dm:32)
rt.def("/turf/closed/wall/proc/handle_ricochet", function handle_ricochet(f: Frame, _P: Value) {
	let p_turf: Value = null, face_direction: Value = null, face_angle: Value = null, incidence_s: Value = null, new_angle: Value = null, new_angle_s: Value = null;
	f.vars = () => [p_turf, face_direction, face_angle, incidence_s, new_angle, new_angle_s];
	p_turf = rt.getStep(f, live(_P), 0);
	face_direction = rt.getDir(f, live(f.src), live(p_turf));
	face_angle = rt.call(f, P("/proc/dir2angle"), null, [live(face_direction)]);
	incidence_s = rt.call(f, P("/proc/get_angle_of_incidence"), null, [live(face_angle), rt.fv(f, "Angle", live(_P))]);
	new_angle = add(live(face_angle), live(incidence_s));
	new_angle_s = live(new_angle);
	while (rt.gt(live(new_angle_s), 180)) {
		(new_angle_s = rt.modify(live(new_angle_s), 360, subtract));
	}
	while (rt.lt(live(new_angle_s), -180)) {
		new_angle_s = rt.modify(live(new_angle_s), 360, add);
	}
	rt.setFv(f, "Angle", live(_P), live(new_angle_s));
	return 1;
});

// /turf/closed/wall/proc/dismantle_wall  (code/game/turfs/simulated/walls.dm:47)  may sleep
rt.def("/turf/closed/wall/proc/dismantle_wall", function* dismantle_wall(f: Frame, devastated: Value, explode: Value) {
	let newgirder: Value = null, O: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [devastated, explode, newgirder, O, _P, $e];
	if (live(devastated) === null) {
		devastated = 0;
	}
	if (live(explode) === null) {
		explode = 0;
	}
	if (truthy(live(devastated))) {
		yield* g.srcCall(f, "devastate_wall");
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
		if (truthy((newgirder = (yield* g.srcCall(f, "break_wall"))))) {
			yield* g.srcCall(f, "transfer_fingerprints_to", live(newgirder));
		}
	}
	O = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if (truthy((rt.istype(live(O), T("/obj/structure/sign/poster")) ? 1 : 0))) {
			yield* g.callName(f, (_P = live(O)), "roll_and_drop", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
	return f.dot;
}, true);

// /turf/closed/wall/proc/break_wall  (code/game/turfs/simulated/walls.dm:62)  may sleep
rt.def("/turf/closed/wall/proc/break_wall", function* break_wall(f: Frame) {
	yield* g.new_(f, rt.sv(f, "sheet_type"), [live(f.src), rt.sv(f, "sheet_amount")]);
	return (yield* g.new_(f, rt.sv(f, "girder_type"), [live(f.src)]));
}, true);

// /turf/closed/wall/proc/devastate_wall  (code/game/turfs/simulated/walls.dm:66)  may sleep
rt.def("/turf/closed/wall/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* g.new_(f, rt.sv(f, "sheet_type"), [live(f.src), rt.sv(f, "sheet_amount")]);
	if (!truthy(rt.sv(f, "girder_type"))) return f.dot;
	yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(f.src)]);
	return f.dot;
}, true);

// /turf/closed/wall/proc/ex_act  (code/game/turfs/simulated/walls.dm:71)  may sleep
rt.def("/turf/closed/wall/proc/ex_act", function* ex_act(f: Frame) {
	let NT: Value = null;
	let $0: any;
	f.vars = () => [NT, $0];
	if (isEqual(live(f.args[1]), live(f.src))) {
		yield* g.srcCall(f, "dismantle_wall", 1, 1);
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === 1) {
		yield* g.callName(f, (NT = (yield* g.srcCall(f, "ChangeTurf", rt.sv(f, "baseturf")))), "contents_explosion", [live(f.args[0]), live(f.args[1])]);
		return live(f.dot);
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "dismantle_wall", 0, 1);
		} else {
			yield* g.srcCall(f, "dismantle_wall", 1, 1);
		}
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "hardness")]))) {
			yield* g.srcCall(f, "dismantle_wall", 0, 1);
		}
	}
	if (truthy(rt.sv(f, "density"))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /turf/closed/wall/proc/blob_act  (code/game/turfs/simulated/walls.dm:93)  may sleep
rt.def("/turf/closed/wall/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	f.vars = () => [B];
	if (!truthy(rt.op(f, "Prob", [], [50]))) return f.dot;
	yield* g.srcCall(f, "dismantle_wall");
	return f.dot;
}, true);

// /turf/closed/wall/proc/mech_melee_attack  (code/game/turfs/simulated/walls.dm:97)  may sleep
rt.def("/turf/closed/wall/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	let $0: any;
	f.vars = () => [M, $0];
	yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
	$0 = rt.fv(f, "damtype", live(M));
	if ($0 === "brute") {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/punch4.ogg"), 50, 1]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has hit ＀!</span>", [rt.fv(f, "name", live(M)), live(f.src)]), null, null, 3);
		if ((truthy(rt.op(f, "Prob", [], [add(rt.sv(f, "hardness"), rt.fv(f, "force", live(M)))])) && rt.gt(rt.fv(f, "force", live(M)), 20))) {
			yield* g.srcCall(f, "dismantle_wall", 1);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
		}
	} else if ($0 === "fire") {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	} else if ($0 === "tox") {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/spray2.ogg"), 100, 1]);
		return 0;
	}
	return f.dot;
}, true);

// /turf/closed/wall/proc/attack_paw  (code/game/turfs/simulated/walls.dm:112)  may sleep
rt.def("/turf/closed/wall/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	return (yield* g.callName(f, live(f.src), "attack_hand", [live(user)]));
}, true);

// /turf/closed/wall/proc/attack_animal  (code/game/turfs/simulated/walls.dm:117)  may sleep
rt.def("/turf/closed/wall/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.vars = () => [M];
	yield* g.callName(f, live(M), "changeNext_move", [8]);
	yield* g.callName(f, live(M), "do_attack_animation", [live(f.src)]);
	if (!rt.ge(rt.fv(f, "environment_smash", live(M)), 2)) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
	yield* g.srcCall(f, "dismantle_wall", 1);
	return live(f.dot);
}, true);

// /turf/closed/wall/proc/attack_hulk  (code/game/turfs/simulated/walls.dm:125)  may sleep
rt.def("/turf/closed/wall/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [user, does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	yield* g.callSuper(f, [live(user), 1]);
	if (truthy(rt.op(f, "Prob", [], [rt.sv(f, "hardness")]))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1]);
		yield* g.callName(f, live(user), "say", [rt.op(f, "PickUnweighted", [5], [";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"])]);
		yield* g.srcCall(f, "dismantle_wall", 1);
	} else {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/bang.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You punch the wall.</span>"]);
	}
	return 1;
}, true);

// /turf/closed/wall/proc/attack_hand  (code/game/turfs/simulated/walls.dm:136)  may sleep
rt.def("/turf/closed/wall/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* g.callName(f, live(f.args[0]), "changeNext_move", [8]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You push the wall but nothing happens!</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/weapons/genhit.ogg"), 25, 1]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.args[0])]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /turf/closed/wall/proc/attackby  (code/game/turfs/simulated/walls.dm:144)  may sleep
rt.def("/turf/closed/wall/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	f.vars = () => [W, user, params, _T];
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	if (truthy(rt.sv(f, "thermite"))) {
		if (truthy((yield* g.callName(f, live(W), "is_hot", [])))) {
			yield* g.srcCall(f, "thermitemelt", live(user));
			return live(f.dot);
		}
	}
	_T = rt.fv(f, "loc", live(user));
	if (!((truthy((yield* g.srcCall(f, "try_wallmount", live(W), live(user), live(_T)))) || truthy((yield* g.srcCall(f, "try_decon", live(W), live(user), live(_T))))) || truthy((yield* g.srcCall(f, "try_destroy", live(W), live(user), live(_T)))))) return f.dot;
	return live(f.dot);
}, true);

// /turf/closed/wall/proc/try_wallmount  (code/game/turfs/simulated/walls.dm:170)  may sleep
rt.def("/turf/closed/wall/proc/try_wallmount", function* try_wallmount(f: Frame, W: Value, user: Value, _T: Value) {
	let F: Value = null;
	f.vars = () => [W, user, _T, F];
	if (truthy((rt.istype(live(W), T("/obj/item/wallframe")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (F = live(W)), "try_build", [live(f.src), live(user)])))) {
			yield* g.callName(f, live(F), "attach", [live(f.src), live(user)]);
		}
		return 1;
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/poster")) ? 1 : 0))) {
			yield* g.srcCall(f, "place_poster", live(W), live(user));
			return 1;
		}
	}
	return 0;
}, true);

// /turf/closed/wall/proc/try_decon  (code/game/turfs/simulated/walls.dm:184)  may sleep
rt.def("/turf/closed/wall/proc/try_decon", function* try_decon(f: Frame, W: Value, user: Value, _T: Value) {
	let WT: Value = null;
	f.vars = () => [W, user, _T, WT];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (WT = live(W)), "remove_fuel", [0, live(user)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the outer plating...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(W)), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.sv(f, "slicing_duration"), rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if (((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall")) ? 1 : 0)) || !truthy(live(user))) || !truthy(live(WT))) || !truthy((yield* g.callName(f, live(WT), "isOn", [])))) || !truthy(live(_T)))) {
					return 1;
				}
				if ((isEqual(rt.fv(f, "loc", live(user)), live(_T)) && isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(WT)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the outer plating.</span>"]);
					yield* g.srcCall(f, "dismantle_wall");
					return 1;
				}
			}
		}
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You begin slicing through the outer plating...</span>"]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, multiply(rt.sv(f, "slicing_duration"), rt.fv(f, "toolspeed", live(W))), "target", live(f.src)], rt.Args.Named)))) {
				if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall")) ? 1 : 0)) || !truthy(live(user))) || !truthy(live(W))) || !truthy(live(_T)))) {
					return 1;
				}
				if ((isEqual(rt.fv(f, "loc", live(user)), live(_T)) && isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(W)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You remove the outer plating.</span>"]);
					yield* g.srcCall(f, "dismantle_wall");
					yield* g.srcCall(f, "visible_message", fmt("The wall was sliced apart by ＀!", [live(user)]), "<span class='italics'>You hear metal being sliced apart.</span>");
					return 1;
				}
			}
		}
	}
	return 0;
}, true);

// /turf/closed/wall/proc/try_destroy  (code/game/turfs/simulated/walls.dm:211)  may sleep
rt.def("/turf/closed/wall/proc/try_destroy", function* try_destroy(f: Frame, W: Value, user: Value, _T: Value) {
	let D: Value = null;
	f.vars = () => [W, user, _T, D];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/pickaxe/drill/jackhammer")) ? 1 : 0))) {
		D = live(W);
		if ((((!truthy((rt.istype(live(f.src), T("/turf/closed/wall")) ? 1 : 0)) || !truthy(live(user))) || !truthy(live(W))) || !truthy(live(_T)))) {
			return 1;
		}
		if ((isEqual(rt.fv(f, "loc", live(user)), live(_T)) && isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(W)))) {
			yield* g.callName(f, live(D), "playDigSound", []);
			yield* g.srcCall(f, "dismantle_wall");
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ smashes through the ＀ with the ＀!</span>", [live(user), rt.sv(f, "name"), rt.fv(f, "name", live(W))]), "<span class='italics'>You hear the grinding of metal.</span>");
			return 1;
		}
	}
	return 0;
}, true);

// /turf/closed/wall/proc/thermitemelt  (code/game/turfs/simulated/walls.dm:224)  may sleep
rt.def("/turf/closed/wall/proc/thermitemelt", function* thermitemelt(f: Frame, user: Value) {
	let O: Value = null, burning_time: Value = null, F: Value = null;
	f.vars = () => [user, O, burning_time, F];
	yield* g.srcCall(f, "cut_overlays");
	rt.setFv(f, "name", (O = (yield* g.new_(f, T("/obj/effect/overlay"), [live(f.src)]))), "thermite");
	rt.setFv(f, "desc", live(O), "Looks hot.");
	rt.setFv(f, "icon", live(O), rt.rsc("icons/effects/fire.dmi"));
	rt.setFv(f, "icon_state", live(O), "2");
	rt.setFv(f, "anchored", live(O), 1);
	rt.setFv(f, "opacity", live(O), 1);
	rt.setFv(f, "density", live(O), 1);
	rt.setFv(f, "layer", live(O), 5);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/welder.ogg"), 100, 1]);
	if (rt.ge(rt.sv(f, "thermite"), 50)) {
		burning_time = (yield* g.call(f, P("/proc/max"), null, [100, subtract(300, rt.sv(f, "thermite"))]));
		yield* g.callName(f, (F = (yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating")))), "burn_tile", []);
		yield* g.callName(f, live(F), "add_hiddenprint", [live(user)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(O)])), live(burning_time), 8]);
	} else {
		rt.setSv(f, "thermite", 0);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(O)])), 50, 8]);
	}
	return f.dot;
}, true);

// /turf/closed/wall/proc/singularity_pull  (code/game/turfs/simulated/walls.dm:248)  may sleep
rt.def("/turf/closed/wall/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (rt.ge(live(current_size), 9)) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			yield* g.srcCall(f, "dismantle_wall");
		}
		return live(f.dot);
	}
	if (!isEqual(live(current_size), 7)) return f.dot;
	if (!truthy(rt.op(f, "Prob", [], [30]))) return f.dot;
	yield* g.srcCall(f, "dismantle_wall");
	return f.dot;
}, true);

// /turf/closed/wall/proc/narsie_act  (code/game/turfs/simulated/walls.dm:257)  may sleep
rt.def("/turf/closed/wall/proc/narsie_act", function* narsie_act(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", T("/turf/closed/wall/mineral/cult"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs", "probability"] });

// /turf/closed/wall/proc/ratvar_act  (code/game/turfs/simulated/walls.dm:262)  may sleep
rt.def("/turf/closed/wall/proc/ratvar_act", function* ratvar_act(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.srcCall(f, "ChangeTurf", T("/turf/closed/wall/clockwork"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs"] });

// /turf/closed/wall/proc/acid_act  (code/game/turfs/simulated/walls.dm:270)  may sleep
rt.def("/turf/closed/wall/proc/acid_act", function* acid_act(f: Frame) {
	if (rt.ge(rt.sv(f, "explosion_block"), 2)) {
		f.args[0] = (yield* g.call(f, P("/proc/min"), null, [live(f.args[0]), 50]));
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["acidpwr", "acid_volume"] });

// /turf/closed/wall/proc/acid_melt  (code/game/turfs/simulated/walls.dm:275)  may sleep
rt.def("/turf/closed/wall/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* g.srcCall(f, "dismantle_wall", 1);
	return f.dot;
}, true);

// /turf/closed/wall/proc/rcd_vals  (code/game/turfs/simulated/walls.dm:278)
rt.def("/turf/closed/wall/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.fv(f, "mode", live(the_rcd));
	if ($0 === 3) {
		return rt.alist(f, ["mode", 3, "delay", 40, "cost", 26]);
	}
	return 0;
});

// /turf/closed/wall/proc/rcd_act  (code/game/turfs/simulated/walls.dm:284)  may sleep
rt.def("/turf/closed/wall/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let $0: any;
	f.vars = () => [user, the_rcd, passed_mode, $0];
	$0 = live(passed_mode);
	if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You deconstruct the wall.</span>"]);
		yield* g.srcCall(f, "ChangeTurf", T("/turf/open/floor/plating"));
		return 1;
	}
	return 0;
}, true);
