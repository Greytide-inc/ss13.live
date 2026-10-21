// From code/modules/mob/living/living.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/proc/Initialize  (code/modules/mob/living/living.dm:2)  may sleep
rt.def("/mob/living/proc/Initialize", function* Initialize(f: Frame) {
	let D: Value = null, medhud: Value = null;
	let $e: any;
	f.vars = () => [D, medhud, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "generateStaticOverlay");
	if (truthy(rt.len(f, rt.sv(f, "staticOverlays")))) {
		D = null;
		rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/simple_animal/drone"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if ((truthy(live(D)) && truthy(rt.fv(f, "seeStatic", live(D))))) {
				if (truthy((rt.isIn(f, rt.fv(f, "staticChoice", live(D)), rt.sv(f, "staticOverlays")) ? 1 : 0))) {
					(rt.modField(f, live(D), "staticOverlays", rt.index(rt.sv(f, "staticOverlays"), rt.fv(f, "staticChoice", live(D))), rt.bitOr));
					(rt.modField(f, rt.fv(f, "client", live(D)), "images", rt.index(rt.sv(f, "staticOverlays"), rt.fv(f, "staticChoice", live(D))), rt.bitOr));
				} else {
					(rt.modField(f, live(D), "staticOverlays", rt.at(rt.sv(f, "staticOverlays"), "static"), rt.bitOr));
					(rt.modField(f, rt.fv(f, "client", live(D)), "images", rt.at(rt.sv(f, "staticOverlays"), "static"), rt.bitOr));
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "unique_name"))) {
		rt.setSv(f, "name", fmt("＀ (＀)", [rt.sv(f, "name"), (yield* g.call(f, P("/proc/rand"), null, [1, 1000]))]));
		rt.setSv(f, "real_name", rt.sv(f, "name"));
	}
	yield* g.callName(f, (medhud = rt.index(rt.gl("huds"), 4)), "add_to_hud", [live(f.src)]);
	rt.modSrcVar(f, "faction", fmt("＃", [live(f.src)]), add);
	return f.dot;
}, true);

// /mob/living/proc/prepare_huds  (code/modules/mob/living/living.dm:22)  may sleep
rt.def("/mob/living/proc/prepare_huds", function* prepare_huds(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "prepare_data_huds");
	return f.dot;
}, true);

// /mob/living/proc/prepare_data_huds  (code/modules/mob/living/living.dm:26)  may sleep
rt.def("/mob/living/proc/prepare_data_huds", function* prepare_data_huds(f: Frame) {
	yield* g.srcCall(f, "med_hud_set_health");
	yield* g.srcCall(f, "med_hud_set_status");
	return f.dot;
}, true);

// /mob/living/proc/Destroy  (code/modules/mob/living/living.dm:30)  may sleep
rt.def("/mob/living/proc/Destroy", function* Destroy(f: Frame) {
	let s: Value = null, S: Value = null, D: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [s, S, D, I, $e];
	if (truthy(rt.length(rt.sv(f, "status_effects")))) {
		s = null;
		rt.forList(f, 0, rt.sv(f, "status_effects"));
		while (($e = rt.next(f, 0)) !== undefined) {
			s = $e;
			if (truthy(rt.gv(f, "on_remove_on_mob_delete", (S = live(s))))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
			} else {
				yield* g.callName(f, live(S), "be_replaced", []);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "ranged_ability"))) {
		yield* g.callName(f, rt.sv(f, "ranged_ability"), "remove_ranged_ability", [live(f.src)]);
	}
	if (truthy(rt.sv(f, "buckled"))) {
		yield* g.callName(f, rt.sv(f, "buckled"), "unbuckle_mob", [null, live(f.src), "force", 1], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "riding_datum")]);
	rt.setSv(f, "riding_datum", null);
	D = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/simple_animal/drone"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		I = null;
		rt.forList(f, 1, rt.sv(f, "staticOverlays"), T("/image"));
		while (($e = rt.next(f, 1)) !== undefined) {
			I = $e;
			yield* g.callName(f, rt.fv(f, "staticOverlays", live(D)), "Remove", [live(I)]);
			yield* g.callName(f, rt.gv(f, "images", rt.fv(f, "client", live(D))), "Remove", [live(I)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "len", rt.sv(f, "staticOverlays"), 0);
	yield* g.srcCall(f, "remove_from_all_data_huds");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/proc/ghostize  (code/modules/mob/living/living.dm:54)  may sleep
rt.def("/mob/living/proc/ghostize", function* ghostize(f: Frame) {
	let prev_client: Value = null;
	f.vars = () => [prev_client];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	prev_client = rt.sv(f, "client");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	if (!(truthy(rt.sv(f, "ranged_ability")) && truthy(live(prev_client)))) return f.dot;
	yield* g.callName(f, rt.sv(f, "ranged_ability"), "remove_mousepointer", [live(prev_client)]);
	return f.dot;
}, true, { args: ["can_reenter_corpse"] });

// /mob/living/proc/generateStaticOverlay  (code/modules/mob/living/living.dm:65)  may sleep
rt.def("/mob/living/proc/generateStaticOverlay", function* generateStaticOverlay(f: Frame) {
	let staticOverlay: Value = null;
	f.vars = () => [staticOverlay];
	yield* g.callName(f, rt.sv(f, "staticOverlays"), "Add", [rt.list("static", "blank", "letter", "animal")]);
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/image"), null, [null, (yield* g.call(f, P("/proc/getStaticIcon"), null, [(yield* g.new_(f, T("/icon"), [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))])), "loc", live(f.src)], rt.Args.Named))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "static", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/image"), null, [null, (yield* g.call(f, P("/proc/getBlankIcon"), null, [(yield* g.new_(f, T("/icon"), [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))])), "loc", live(f.src)], rt.Args.Named))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "blank", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/getLetterImage"), null, [live(f.src)]))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "letter", live(staticOverlay));
	rt.setFv(f, "override", (staticOverlay = (yield* g.call(f, P("/proc/getRandomAnimalImage"), null, [live(f.src)]))), 1);
	rt.setAt(rt.sv(f, "staticOverlays"), "animal", live(staticOverlay));
	return f.dot;
}, true);

// /mob/living/proc/Bump  (code/modules/mob/living/living.dm:85)  may sleep
rt.def("/mob/living/proc/Bump", function* Bump(f: Frame) {
	let M: Value = null, O: Value = null, AM: Value = null;
	f.vars = () => [M, O, AM];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((truthy(rt.sv(f, "buckled")) || !truthy(live(f.args[1]))) || truthy(rt.sv(f, "now_pushing")))) {
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
		if (truthy((yield* g.srcCall(f, "MobBump", (M = live(f.args[0])))))) {
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "ObjBump", (O = live(f.args[0])))))) {
			return live(f.dot);
		}
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/atom/movable")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "PushAM", (AM = live(f.args[0])))))) return f.dot;
	return live(f.dot);
}, true, { args: ["A", "yes"] });

// /mob/living/proc/Bumped  (code/modules/mob/living/living.dm:103)
rt.def("/mob/living/proc/Bumped", function Bumped(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "last_bumped", rt.worldTime(f));
	return f.dot;
}, false, { args: ["AM"] });

// /mob/living/proc/MobBump  (code/modules/mob/living/living.dm:109)  may sleep
rt.def("/mob/living/proc/MobBump", function* MobBump(f: Frame, M: Value) {
	let L: Value = null, _P: Value = null, mob_swap: Value = null, oldloc: Value = null, oldMloc: Value = null, M_passmob: Value = null, src_passmob: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [M, L, _P, mob_swap, oldloc, oldMloc, M_passmob, src_passmob, I, $e];
	yield* g.srcCall(f, "spreadFire", live(M));
	if (truthy(rt.sv(f, "now_pushing"))) {
		return 1;
	}
	if (truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		if (((truthy(rt.gv(f, "pulledby", (L = live(M)))) && !isEqual(rt.fv(f, "pulledby", live(L)), live(f.src))) && truthy((yield* g.callName(f, live(L), "restrained", []))))) {
			if (!truthy(rt.modulus(rt.worldTime(f), 5))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀ is restrained, you cannot push past.</span>", [live(L)])]);
			}
			return 1;
		}
		if (truthy(rt.fv(f, "pulling", live(L)))) {
			if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.fv(f, "pulling", live(L))])))) {
				if (truthy((yield* g.callName(f, (_P = rt.fv(f, "pulling", live(L))), "restrained", [])))) {
					if (!truthy(rt.modulus(rt.worldTime(f), 5))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀ is restraining ＀, you cannot push past.</span>", [live(L), live(_P)])]);
					}
					return 1;
				}
			}
		}
	}
	if (truthy(rt.sv(f, "moving_diagonally"))) {
		return 1;
	}
	if ((!truthy(rt.fv(f, "buckled", live(M))) && !truthy((yield* g.callName(f, live(M), "has_buckled_mobs", []))))) {
		mob_swap = null;
		if ((isEqual(rt.fv(f, "pulledby", live(M)), live(f.src)) && isEqual(rt.sv(f, "a_intent"), "grab"))) {
			mob_swap = 1;
		} else {
			if (((truthy((yield* g.callName(f, live(M), "restrained", []))) || isEqual(rt.fv(f, "a_intent", live(M)), "help")) && (truthy((yield* g.srcCall(f, "restrained"))) || isEqual(rt.sv(f, "a_intent"), "help")))) {
				mob_swap = 1;
			}
		}
		if (truthy(live(mob_swap))) {
			if ((truthy(rt.sv(f, "loc")) && !truthy((yield* g.callName(f, rt.sv(f, "loc"), "Adjacent", [rt.fv(f, "loc", live(M))]))))) {
				return 1;
			}
			rt.setSv(f, "now_pushing", 1);
			oldloc = rt.sv(f, "loc");
			oldMloc = rt.fv(f, "loc", live(M));
			M_passmob = rt.bitAnd(rt.fv(f, "pass_flags", live(M)), 16);
			src_passmob = rt.bitAnd(rt.sv(f, "pass_flags"), 16);
			(rt.modField(f, live(M), "pass_flags", 16, rt.bitOr));
			(rt.modSrcVar(f, "pass_flags", 16, rt.bitOr));
			yield* g.callName(f, live(M), "Move", [live(oldloc)]);
			yield* g.srcCall(f, "Move", live(oldMloc));
			if (!truthy(live(src_passmob))) {
				(rt.modSrcVar(f, "pass_flags", 16777199, rt.bitAnd));
			}
			if (!truthy(live(M_passmob))) {
				(rt.modField(f, live(M), "pass_flags", 16777199, rt.bitAnd));
			}
			rt.setSv(f, "now_pushing", 0);
			return 1;
		}
	}
	if (!truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 8))) {
		return 1;
	}
	I = null;
	rt.forList(f, 0, rt.fv(f, "held_items", live(M)), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((rt.istype(live(M), T("/obj/item/clothing")) ? 1 : 0))) {
			if (truthy(rt.op(f, "Prob", [], [multiply(rt.fv(f, "block_chance", live(I)), 2)]))) {
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/proc/PushAM  (code/modules/mob/living/living.dm:186)  may sleep
rt.def("/mob/living/proc/PushAM", function* PushAM(f: Frame, AM: Value) {
	let t: Value = null, W: Value = null, win: Value = null, current_dir: Value = null;
	let $e: any;
	f.vars = () => [AM, t, W, win, current_dir, $e];
	if (truthy(rt.sv(f, "now_pushing"))) {
		return 1;
	}
	if (truthy(rt.sv(f, "moving_diagonally"))) {
		return 1;
	}
	if ((!truthy(rt.sv(f, "client")) && rt.lt(rt.sv(f, "mob_size"), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "anchored", live(AM)))) return f.dot;
	rt.setSv(f, "now_pushing", 1);
	t = rt.getDir(f, live(f.src), live(AM));
	if (truthy((rt.istype(live(AM), T("/obj/structure/window")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "fulltile", (W = live(AM))))) {
			win = null;
			rt.forList(f, 0, rt.getStep(f, live(W), live(t)), T("/obj/structure/window"));
			while (($e = rt.next(f, 0)) !== undefined) {
				win = $e;
				rt.setSv(f, "now_pushing", 0);
				return live(f.dot);
			}
			rt.endFor(f, 0);
		}
	}
	if (isEqual(rt.sv(f, "pulling"), live(AM))) {
		yield* g.srcCall(f, "stop_pulling");
	}
	current_dir = null;
	if (truthy((rt.istype(live(AM), T("/mob/living")) ? 1 : 0))) {
		current_dir = rt.fv(f, "dir", live(AM));
	}
	yield* g.call(f, P("/proc/step"), null, [live(AM), live(t)]);
	if (truthy(live(current_dir))) {
		yield* g.callName(f, live(AM), "setDir", [live(current_dir)]);
	}
	rt.setSv(f, "now_pushing", 0);
	return f.dot;
}, true);

// /mob/living/verb/pulled  (code/modules/mob/living/living.dm:213)  may sleep
rt.def("/mob/living/verb/pulled", function* pulled(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if ((truthy((rt.istype(live(AM), T("/atom/movable")) ? 1 : 0)) && truthy((yield* g.srcCall(f, "Adjacent", live(AM)))))) {
		yield* g.srcCall(f, "start_pulling", live(AM));
	} else {
		yield* g.srcCall(f, "stop_pulling");
	}
	return f.dot;
}, true, { verb: { name: "Pull", category: "Object" }, argTypes: [{ type: 12, path: "/atom/movable", source: "oview:1" }] });

// /mob/living/pointed  (code/modules/mob/living/living.dm:220)  may sleep
rt.def("/mob/living/pointed", function* pointed(f: Frame) {
	if (truthy((yield* g.srcCall(f, "incapacitated")))) {
		return 0;
	}
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(f.src)), 8192))) {
		return 0;
	}
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 0;
	}
	yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> points to ＀", [live(f.src), live(f.args[0])]));
	return 1;
}, true, { args: ["A"], verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// /mob/living/verb/succumb  (code/modules/mob/living/living.dm:231)  may sleep
rt.def("/mob/living/verb/succumb", function* succumb(f: Frame, whispered: Value) {
	let $0: any, $1: any;
	f.vars = () => [whispered, $0, $1];
	if (!truthy((yield* g.srcCall(f, "InCritical")))) return f.dot;
	$0 = live(f.src);
	if (truthy(live(whispered))) {
		$1 = "whispered his final words";
	} else {
		$1 = "succumbed to death";
	}
	yield* g.callName(f, $0, "log_message", [fmt("Has ＀ with ＀ points of health!", [$1, (yield* g.call(f, P("/proc/round"), null, [rt.sv(f, "health"), 0.10000000149011612]))]), "Attack log"]);
	yield* g.callName(f, live(f.src), "adjustOxyLoss", [subtract(rt.fv(f, "health", live(f.src)), -100)]);
	yield* g.srcCall(f, "updatehealth");
	if (!truthy(live(whispered))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You have given up life and succumbed to death.</span>"]);
	}
	yield* g.srcCall(f, "death");
	return f.dot;
}, true, { hidden: true, argTypes: [{ type: 1 }] });

// /mob/living/proc/incapacitated  (code/modules/mob/living/living.dm:240)
rt.def("/mob/living/proc/incapacitated", function incapacitated(f: Frame, ignore_restraints: Value, ignore_grab: Value) {
	if (!((((truthy(rt.sv(f, "stat")) || truthy(rt.callSrc(f, "IsUnconscious", []))) || truthy(rt.callSrc(f, "IsStun", []))) || truthy(rt.callSrc(f, "IsKnockdown", []))) || (!truthy(live(ignore_restraints)) && truthy(rt.callSrc(f, "restrained", [live(ignore_grab)]))))) return f.dot;
	return 1;
});

// /mob/living/proc/InCritical  (code/modules/mob/living/living.dm:244)
rt.def("/mob/living/proc/InCritical", function InCritical(f: Frame) {
	return (((rt.lt(rt.sv(f, "health"), 0) ? 1 : 0) && (rt.gt(rt.sv(f, "health"), -100) ? 1 : 0)) && (isEqual(rt.sv(f, "stat"), 1) ? 1 : 0));
});

// /mob/living/proc/mob_sleep  (code/modules/mob/living/living.dm:284)  may sleep
rt.def("/mob/living/proc/mob_sleep", function* mob_sleep(f: Frame) {
	if (truthy((yield* g.srcCall(f, "IsSleeping")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You are already sleeping.</span>"]);
		return live(f.dot);
	} else {
		if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.src), "You sure you want to sleep for a while?", "Sleep", "Yes", "No"])), "Yes")) {
			yield* g.srcCall(f, "SetSleeping", 400);
		}
	}
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true, { verb: { name: "Sleep", category: "IC" } });

// /mob/living/proc/lay_down  (code/modules/mob/living/living.dm:298)  may sleep
rt.def("/mob/living/proc/lay_down", function* lay_down(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "resting", (!truthy(rt.sv(f, "resting")) ? 1 : 0));
	$0 = live(f.src);
	if (truthy(rt.sv(f, "resting"))) {
		$1 = "resting";
	} else {
		$1 = "getting up";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You are now ＀.</span>", [$1])]);
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true, { verb: { name: "Rest", category: "IC" } });

// /mob/living/proc/get_contents  (code/modules/mob/living/living.dm:304)
rt.def("/mob/living/proc/get_contents", function get_contents(f: Frame, Storage: Value) {
	let L: Value = null, S: Value = null, U: Value = null, F: Value = null;
	let $e: any;
	f.vars = () => [Storage, L, S, U, F, $e];
	if (live(Storage) === null) {
		Storage = null;
	}
	L = rt.list();
	if (truthy(live(Storage))) {
		return (L = rt.modify(live(L), rt.callName(f, live(Storage), "return_inv", []), add));
	}
	L = rt.modify(live(L), rt.fv(f, "contents", live(f.src)), add);
	S = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj/item/weapon/storage"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		L = rt.modify(live(L), rt.callSrc(f, "get_contents", [live(S)]), add);
	}
	rt.endFor(f, 0);
	U = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj/item/clothing/under"));
	while (($e = rt.next(f, 0)) !== undefined) {
		U = $e;
		L = rt.modify(live(L), rt.fv(f, "contents", live(U)), add);
	}
	rt.endFor(f, 0);
	F = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/obj/item/weapon/folder"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		L = rt.modify(live(L), rt.fv(f, "contents", live(F)), add);
	}
	rt.endFor(f, 0);
	return live(L);
});

// /mob/living/proc/get_organ_target  (code/modules/mob/living/living.dm:331)
rt.def("/mob/living/proc/get_organ_target", function get_organ_target(f: Frame) {
	let shooter: Value = null, t: Value = null, def_zone: Value = null;
	f.vars = () => [shooter, t, def_zone];
	shooter = live(f.src);
	if (truthy((rt.isIn(f, (t = rt.fv(f, "zone_selected", live(shooter))), rt.list("eyes", "mouth")) ? 1 : 0))) {
		t = "head";
	}
	return (def_zone = rt.call(f, P("/proc/ran_zone"), null, [live(t)]));
});

// /mob/living/proc/updatehealth  (code/modules/mob/living/living.dm:340)  may sleep
rt.def("/mob/living/proc/updatehealth", function* updatehealth(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "status_flags"), 4096))) {
		return live(f.dot);
	}
	rt.setSv(f, "health", subtract(subtract(subtract(subtract(subtract(rt.sv(f, "maxHealth"), (yield* g.srcCall(f, "getOxyLoss"))), (yield* g.srcCall(f, "getToxLoss"))), (yield* g.srcCall(f, "getFireLoss"))), (yield* g.srcCall(f, "getBruteLoss"))), (yield* g.srcCall(f, "getCloneLoss"))));
	yield* g.srcCall(f, "update_stat");
	yield* g.srcCall(f, "med_hud_set_health");
	yield* g.srcCall(f, "med_hud_set_status");
	return f.dot;
}, true);

// /mob/living/proc/revive  (code/modules/mob/living/living.dm:350)  may sleep
rt.def("/mob/living/proc/revive", function* revive(f: Frame, full_heal: Value, admin_revive: Value) {
	let S: Value = null, spell: Value = null;
	let $e: any;
	f.vars = () => [full_heal, admin_revive, S, spell, $e];
	if (live(full_heal) === null) {
		full_heal = 0;
	}
	if (live(admin_revive) === null) {
		admin_revive = 0;
	}
	if (truthy(live(full_heal))) {
		yield* g.srcCall(f, "fully_heal", live(admin_revive));
	}
	if (!(isEqual(rt.sv(f, "stat"), 2) && truthy((yield* g.srcCall(f, "can_be_revived"))))) return f.dot;
	(rt.modGl("dead_mob_list", live(f.src), subtract));
	rt.modGl("living_mob_list", live(f.src), add);
	rt.setSv(f, "suiciding", 0);
	rt.setSv(f, "stat", 1);
	yield* g.srcCall(f, "blind_eyes", 1);
	yield* g.srcCall(f, "updatehealth");
	yield* g.srcCall(f, "update_canmove");
	yield* g.srcCall(f, "update_sight");
	yield* g.srcCall(f, "clear_alert", "oxy");
	yield* g.srcCall(f, "reload_fullscreen");
	f.dot = 1;
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	S = null;
	rt.forList(f, 0, rt.fv(f, "spell_list", rt.sv(f, "mind")));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		yield* g.callName(f, (spell = live(S)), "updateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/proc/fully_heal  (code/modules/mob/living/living.dm:370)  may sleep
rt.def("/mob/living/proc/fully_heal", function* fully_heal(f: Frame, admin_revive: Value) {
	f.vars = () => [admin_revive];
	if (live(admin_revive) === null) {
		admin_revive = 0;
	}
	yield* g.srcCall(f, "restore_blood");
	yield* g.srcCall(f, "setToxLoss", 0, 0);
	yield* g.srcCall(f, "setOxyLoss", 0, 0);
	yield* g.srcCall(f, "setCloneLoss", 0, 0);
	yield* g.srcCall(f, "setBrainLoss", 0);
	yield* g.srcCall(f, "setStaminaLoss", 0, 0);
	yield* g.srcCall(f, "SetUnconscious", 0, 0);
	yield* g.srcCall(f, "SetStun", 0, 0);
	yield* g.srcCall(f, "SetKnockdown", 0, 0);
	yield* g.srcCall(f, "SetSleeping", 0, 0);
	rt.setSv(f, "radiation", 0);
	rt.setSv(f, "nutrition", 400);
	rt.setSv(f, "bodytemperature", 310);
	yield* g.srcCall(f, "set_blindness", 0);
	yield* g.srcCall(f, "set_blurriness", 0);
	yield* g.srcCall(f, "set_eye_damage", 0);
	yield* g.srcCall(f, "cure_nearsighted");
	yield* g.srcCall(f, "cure_blind");
	yield* g.srcCall(f, "cure_husk");
	rt.setSv(f, "disabilities", 0);
	rt.setSv(f, "hallucination", 0);
	yield* g.srcCall(f, "heal_overall_damage", 100000, 100000, 0, 0, 1);
	yield* g.srcCall(f, "ExtinguishMob");
	rt.setSv(f, "fire_stacks", 0);
	yield* g.srcCall(f, "update_canmove");
	return f.dot;
}, true);

// /mob/living/proc/can_be_revived  (code/modules/mob/living/living.dm:400)
rt.def("/mob/living/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = 1;
	if (!rt.le(rt.sv(f, "health"), -100)) return f.dot;
	return 0;
});

// /mob/living/proc/Move  (code/modules/mob/living/living.dm:422)  may sleep
rt.def("/mob/living/proc/Move", function* Move(f: Frame) {
	let pullee: Value = null, _T: Value = null, pull_dir: Value = null, M: Value = null;
	f.vars = () => [pullee, _T, pull_dir, M];
	if ((truthy(rt.sv(f, "buckled")) && !isEqual(rt.fv(f, "loc", rt.sv(f, "buckled")), live(f.args[0])))) {
		if (!truthy(rt.fv(f, "anchored", rt.sv(f, "buckled")))) {
			return (yield* g.callName(f, rt.sv(f, "buckled"), "Move", [live(f.args[0]), live(f.args[1])]));
		}
		return 0;
	}
	if ((truthy((pullee = rt.sv(f, "pulling"))) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(pullee)])), 1))) {
		yield* g.srcCall(f, "stop_pulling");
	}
	if (((truthy(live(pullee)) && !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(pullee))])))) && !isEqual(rt.fv(f, "loc", live(pullee)), rt.sv(f, "loc")))) {
		yield* g.call(f, P("/proc/log_game"), null, [fmt("DEBUG:＀'s pull on ＀ wasn't broken despite ＀ being in ＀. Pull stopped manually.", [live(f.src), live(pullee), live(pullee), rt.fv(f, "loc", live(pullee))])]);
		yield* g.srcCall(f, "stop_pulling");
	}
	_T = rt.sv(f, "loc");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (((truthy(live(f.dot)) && truthy(rt.sv(f, "pulling"))) && isEqual(rt.sv(f, "pulling"), live(pullee)))) {
		if (truthy(rt.fv(f, "anchored", rt.sv(f, "pulling")))) {
			yield* g.srcCall(f, "stop_pulling");
			return live(f.dot);
		}
		pull_dir = rt.getDir(f, live(f.src), rt.sv(f, "pulling"));
		// Fix of 2017 tg (modern tg's rule): on the second half of a diagonal step (moving_diagonally 2, SECOND_DIAG_STEP) a pullee left diagonal
		// stays put, so it trails on the tile the puller started the diagonal from. Before, it moved again into the half-way tile and ended up
		// beside the puller, not behind.
		if ((rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "pulling")])), 1) || (!isEqual(rt.sv(f, "moving_diagonally"), 2) && truthy(rt.bitAnd(subtract(live(pull_dir), 1), live(pull_dir)))))) {
			if (truthy((rt.istype(rt.sv(f, "pulling"), T("/mob/living")) ? 1 : 0))) {
				if (((truthy(rt.gv(f, "lying", (M = rt.sv(f, "pulling")))) && !truthy(rt.fv(f, "buckled", live(M)))) && truthy(rt.op(f, "Prob", [], [divide(multiply((yield* g.callName(f, live(M), "getBruteLoss", [])), 200), rt.fv(f, "maxHealth", live(M)))])))) {
					yield* g.callName(f, live(M), "makeTrail", [live(_T)]);
				}
			}
			rt.setFv(f, "glide_size", rt.sv(f, "pulling"), rt.sv(f, "glide_size"));
			yield* g.callName(f, rt.sv(f, "pulling"), "Move", [live(_T), rt.getDir(f, rt.sv(f, "pulling"), live(_T))]);
			if ((truthy(rt.sv(f, "pulling")) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "pulling")])), 1))) {
				yield* g.srcCall(f, "stop_pulling");
			}
		}
	}
	if (((truthy(rt.sv(f, "pulledby")) && !isEqual(rt.sv(f, "moving_diagonally"), 1)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "pulledby")])), 1))) {
		yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
	}
	if (!(truthy(rt.sv(f, "s_active")) && !truthy((yield* g.callSrc(f, "CanReach", [null, rt.sv(f, "s_active"), "view_only", 1], rt.Args.Named))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "s_active"), "close", [live(f.src)]);
	return f.dot;
}, true, { args: ["newloc", "direct"] });

// /mob/living/proc/movement_delay  (code/modules/mob/living/living.dm:459)
rt.def("/mob/living/proc/movement_delay", function movement_delay(f: Frame) {
	let _T: Value = null;
	let $0: any;
	f.vars = () => [_T, $0];
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(rt.sv(f, "loc"), T("/turf/open")) ? 1 : 0)) && !truthy(rt.callSrc(f, "is_flying", [])))) {
		f.dot = rt.modify(live(f.dot), rt.gv(f, "slowdown", (_T = rt.sv(f, "loc"))), add);
	}
	if (truthy(live(f.args[0]))) {
		f.dot = rt.modify(live(f.dot), rt.fv(f, "run_speed", rt.gl("config")), add);
	} else {
		$0 = rt.sv(f, "m_intent");
		if ($0 === "run") {
			if (rt.gt(rt.sv(f, "drowsyness"), 0)) {
				f.dot = rt.modify(live(f.dot), 6, add);
			}
			f.dot = rt.modify(live(f.dot), rt.fv(f, "run_speed", rt.gl("config")), add);
		} else if ($0 === "walk") {
			f.dot = rt.modify(live(f.dot), rt.fv(f, "walk_speed", rt.gl("config")), add);
		}
	}
	return f.dot;
}, false, { args: ["ignorewalk"] });

// /mob/living/proc/makeTrail  (code/modules/mob/living/living.dm:475)  may sleep
rt.def("/mob/living/proc/makeTrail", function* makeTrail(f: Frame, _T: Value) {
	let blood_exists: Value = null, C: Value = null, trail_type: Value = null, brute_ratio: Value = null, newdir: Value = null, TH: Value = null;
	let $e: any;
	f.vars = () => [_T, blood_exists, C, trail_type, brute_ratio, newdir, TH, $e];
	if (!truthy((yield* g.srcCall(f, "has_gravity")))) {
		return live(f.dot);
	}
	blood_exists = 0;
	C = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/effect/decal/cleanable/trail_holder"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		blood_exists = 1;
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))])))) return f.dot;
	if (!truthy((trail_type = (yield* g.srcCall(f, "getTrail"))))) return f.dot;
	brute_ratio = (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.srcCall(f, "getBruteLoss")), rt.sv(f, "maxHealth")), 0.10000000149011612]));
	if (!(truthy(rt.sv(f, "blood_volume")) && rt.gt(rt.sv(f, "blood_volume"), (yield* g.call(f, P("/proc/max"), null, [multiply(560, subtract(1, multiply(live(brute_ratio), 0.25))), 0]))))) return f.dot;
	rt.setSv(f, "blood_volume", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "blood_volume"), (yield* g.call(f, P("/proc/max"), null, [1, multiply(live(brute_ratio), 2)]))), 0])));
	if (!isEqual((newdir = rt.getDir(f, live(_T), rt.fv(f, "loc", live(f.src)))), rt.fv(f, "dir", live(f.src)))) {
		if (isEqual((newdir = rt.bitOr(live(newdir), rt.fv(f, "dir", live(f.src)))), 3)) {
			newdir = 1;
		} else {
			if (isEqual(live(newdir), 12)) {
				newdir = 4;
			}
		}
	}
	if ((truthy((rt.isIn(f, live(newdir), rt.gl("cardinal")) ? 1 : 0)) && truthy(rt.op(f, "Prob", [], [50])))) {
		newdir = (yield* g.call(f, P("/proc/turn"), null, [rt.getDir(f, live(_T), rt.fv(f, "loc", live(f.src))), 180]));
	}
	if (!truthy(live(blood_exists))) {
		yield* g.new_(f, T("/obj/effect/decal/cleanable/trail_holder"), [rt.fv(f, "loc", live(f.src))]);
	}
	TH = null;
	rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/effect/decal/cleanable/trail_holder"));
	while (($e = rt.next(f, 0)) !== undefined) {
		TH = $e;
		if ((((!truthy((rt.isIn(f, live(newdir), rt.fv(f, "existing_dirs", live(TH))) ? 1 : 0)) || isEqual(live(trail_type), "trails_1")) || isEqual(live(trail_type), "trails_2")) && rt.le(rt.getLen(f, rt.fv(f, "existing_dirs", live(TH))), 16))) {
			rt.modField(f, live(TH), "existing_dirs", live(newdir), add);
			yield* g.callName(f, live(TH), "add_overlay", [(yield* g.call(f, P("/proc/image"), null, [null, rt.rsc("icons/effects/blood.dmi"), null, live(trail_type), "dir", live(newdir)], rt.Args.Named))]);
			yield* g.callName(f, live(TH), "transfer_mob_blood_dna", [live(f.src)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/carbon/human/proc/makeTrail  (code/modules/mob/living/living.dm:505)  may sleep
rt.def("/mob/living/carbon/human/proc/makeTrail", function* makeTrail(f: Frame) {
	if (((truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0)) || !truthy(rt.sv(f, "bleed_rate"))) || truthy(rt.sv(f, "bleedsuppress")))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["T"] });

// /mob/living/proc/getTrail  (code/modules/mob/living/living.dm:510)
rt.def("/mob/living/proc/getTrail", function getTrail(f: Frame) {
	if (rt.lt(rt.callSrc(f, "getBruteLoss", []), 300)) {
		return rt.op(f, "PickUnweighted", [2], ["ltrails_1", "ltrails_2"]);
	}
	return rt.op(f, "PickUnweighted", [2], ["trails_1", "trails_2"]);
});

// /mob/living/proc/experience_pressure_difference  (code/modules/mob/living/living.dm:516)
rt.def("/mob/living/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value, pressure_resistance_prob_delta: Value) {
	let turfs_to_check: Value = null, _T: Value = null, t: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [pressure_resistance_prob_delta, turfs_to_check, _T, t, AM, $e];
	if (live(pressure_resistance_prob_delta) === null) {
		pressure_resistance_prob_delta = 0;
	}
	if ((truthy(rt.sv(f, "client")) && rt.ge(rt.fv(f, "move_delay", rt.sv(f, "client")), add(rt.worldTime(f), multiply(rt.fv(f, "tick_lag", rt.world()), 2))))) {
		(pressure_resistance_prob_delta = rt.modify(live(pressure_resistance_prob_delta), 30, subtract));
	}
	turfs_to_check = rt.list();
	if (truthy(rt.sv(f, "has_limbs"))) {
		if (truthy((_T = rt.getStep(f, live(f.src), rt.call(f, P("/proc/angle2dir"), null, [add(rt.call(f, P("/proc/dir2angle"), null, [live(direction)]), 90)]))))) {
			turfs_to_check = rt.modify(live(turfs_to_check), live(_T), add);
		}
		if (truthy((_T = rt.getStep(f, live(f.src), rt.call(f, P("/proc/angle2dir"), null, [subtract(rt.call(f, P("/proc/dir2angle"), null, [live(direction)]), 90)]))))) {
			turfs_to_check = rt.modify(live(turfs_to_check), live(_T), add);
		}
		t = null;
		rt.forList(f, 0, live(turfs_to_check));
		while (($e = rt.next(f, 0)) !== undefined) {
			t = $e;
			if (truthy(rt.gv(f, "density", (_T = live(t))))) {
				(pressure_resistance_prob_delta = rt.modify(live(pressure_resistance_prob_delta), 20, subtract));
				continue;
			}
			AM = null;
			rt.forList(f, 1, live(_T), T("/atom/movable"));
			while (($e = rt.next(f, 1)) !== undefined) {
				AM = $e;
				if ((truthy(rt.fv(f, "density", live(AM))) && truthy(rt.fv(f, "anchored", live(AM))))) {
					(pressure_resistance_prob_delta = rt.modify(live(pressure_resistance_prob_delta), 20, subtract));
					break;
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "force_moving"))) return f.dot;
	rt.callSuper(f, [live(pressure_difference), live(direction), live(pressure_resistance_prob_delta)]);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/verb/resist  (code/modules/mob/living/living.dm:546)  may sleep
rt.def("/mob/living/verb/resist", function* resist(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (((!truthy((rt.istype(live(f.src), T("/mob/living")) ? 1 : 0)) || rt.gt(rt.sv(f, "next_move"), rt.worldTime(f))) || truthy((yield* g.callSrc(f, "incapacitated", ["ignore_restraints", 1], rt.Args.Named))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "changeNext_move", 20);
	if ((!truthy((yield* g.callSrc(f, "restrained", ["ignore_grab", 1], rt.Args.Named))) && truthy(rt.sv(f, "pulledby")))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ resists against ＀'s grip!</span>", [live(f.src), rt.sv(f, "pulledby")]));
		yield* g.srcCall(f, "resist_grab");
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "buckled")) && rt.le(rt.sv(f, "last_special"), rt.worldTime(f)))) {
		yield* g.srcCall(f, "resist_buckle");
	} else {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj")) ? 1 : 0))) {
			yield* g.callName(f, (C = rt.sv(f, "loc")), "container_resist", [live(f.src)]);
		} else {
			if (truthy((yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/freon"))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You start breaking out of the ice cube!"]);
				if (truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(f.src), 40])))) {
					if (truthy((yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/freon"))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "You break out of the ice cube!"]);
						yield* g.srcCall(f, "remove_status_effect", T("/datum/status_effect/freon"));
						yield* g.srcCall(f, "update_canmove");
					}
				}
			} else {
				if (!truthy(rt.sv(f, "canmove"))) return f.dot;
				if (truthy(rt.sv(f, "on_fire"))) {
					yield* g.srcCall(f, "resist_fire");
				} else {
					if (!rt.le(rt.sv(f, "last_special"), rt.worldTime(f))) return f.dot;
					yield* g.srcCall(f, "resist_restraints");
				}
			}
		}
	}
	return f.dot;
}, true, { verb: { name: "Resist", category: "IC" } });

// /mob/living/proc/resist_grab  (code/modules/mob/living/living.dm:585)  may sleep
rt.def("/mob/living/proc/resist_grab", function* resist_grab(f: Frame, moving_resist: Value) {
	f.vars = () => [moving_resist];
	f.dot = 1;
	if (truthy(rt.fv(f, "grab_state", rt.sv(f, "pulledby")))) {
		if (truthy(rt.op(f, "Prob", [], [divide(30, rt.fv(f, "grab_state", rt.sv(f, "pulledby")))]))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ has broken free of ＀'s grip!</span>", [live(f.src), rt.sv(f, "pulledby")]));
			yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
			return 0;
		}
		if ((truthy(live(moving_resist)) && truthy(rt.sv(f, "client")))) {
			rt.setFv(f, "move_delay", rt.sv(f, "client"), add(rt.worldTime(f), 20));
		}
	} else {
		yield* g.callName(f, rt.sv(f, "pulledby"), "stop_pulling", []);
		return 0;
	}
	return f.dot;
}, true);

// /mob/living/proc/resist_buckle  (code/modules/mob/living/living.dm:597)  may sleep
rt.def("/mob/living/proc/resist_buckle", function* resist_buckle(f: Frame) {
	yield* g.callName(f, rt.sv(f, "buckled"), "user_unbuckle_mob", [live(f.src), live(f.src)]);
	return f.dot;
}, true);

// /mob/living/proc/update_gravity  (code/modules/mob/living/living.dm:609)  may sleep
rt.def("/mob/living/proc/update_gravity", function* update_gravity(f: Frame, has_gravity: Value, override: Value) {
	f.vars = () => [has_gravity, override];
	if (live(override) === null) {
		override = 0;
	}
	if (!truthy((yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", [])))) {
		return live(f.dot);
	}
	if (truthy(live(has_gravity))) {
		yield* g.srcCall(f, "clear_alert", "weightless");
	} else {
		yield* g.srcCall(f, "throw_alert", "weightless", T("/obj/screen/alert/weightless"));
	}
	if (truthy(live(override))) return f.dot;
	yield* g.srcCall(f, "float", (!truthy(live(has_gravity)) ? 1 : 0));
	return f.dot;
}, true);

// /mob/living/proc/float  (code/modules/mob/living/living.dm:622)  may sleep
rt.def("/mob/living/proc/float", function* float(f: Frame, on: Value) {
	let fixed: Value = null;
	f.vars = () => [on, fixed];
	if (truthy(rt.sv(f, "throwing"))) {
		return live(f.dot);
	}
	fixed = 0;
	if ((truthy(rt.sv(f, "anchored")) || (truthy(rt.sv(f, "buckled")) && truthy(rt.fv(f, "anchored", rt.sv(f, "buckled")))))) {
		fixed = 1;
	}
	if (((truthy(live(on)) && !truthy(rt.sv(f, "floating"))) && !truthy(live(fixed)))) {
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", add(rt.sv(f, "pixel_y"), 2), "time", 10, "loop", -1]);
		yield* g.call(f, P("/proc/sleep"), null, [10]);
		rt.op(f, "Animate", [2, 8], [null, live(f.src), "pixel_y", subtract(rt.sv(f, "pixel_y"), 2), "time", 10, "loop", -1]);
		rt.setSv(f, "floating", 1);
	} else {
		if (!((!truthy(live(on)) || truthy(live(fixed))) && truthy(rt.sv(f, "floating")))) return f.dot;
		rt.op(f, "Animate", [2, 6], [null, live(f.src), "pixel_y", (yield* g.srcCall(f, "get_standard_pixel_y_offset", rt.sv(f, "lying"))), "time", 10]);
		rt.setSv(f, "floating", 0);
	}
	return f.dot;
}, true);

// /mob/living/proc/stripPanelUnequip  (code/modules/mob/living/living.dm:636)  may sleep
rt.def("/mob/living/proc/stripPanelUnequip", function* stripPanelUnequip(f: Frame, what: Value, who: Value, where: Value) {
	let L: Value = null;
	f.vars = () => [what, who, where, L];
	if (truthy(rt.bitAnd(rt.fv(f, "flags", live(what)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You can't remove ％！, it appears to be stuck!</span>", [rt.fv(f, "name", live(what))])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(who), "visible_message", [fmt("<span class='danger'>＀ tries to remove ＀'s ＀.</span>", [live(f.src), live(who), rt.fv(f, "name", live(what))]), fmt("<span class='userdanger'>＀ tries to remove ＀'s ＀.</span>", [live(f.src), live(who), rt.fv(f, "name", live(what))])]);
	yield* g.callName(f, live(what), "add_fingerprint", [live(f.src)]);
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(who), rt.fv(f, "strip_delay", live(what))])))) return f.dot;
	if (!(truthy(live(what)) && truthy((yield* g.srcCall(f, "Adjacent", live(who)))))) return f.dot;
	if (truthy((rt.istype(live(where), T("/list")) ? 1 : 0))) {
		L = live(where);
		if (isEqual(live(what), (yield* g.callName(f, live(who), "get_item_for_held_index", [rt.index(live(L), 2)])))) {
			if (truthy((yield* g.callName(f, live(who), "dropItemToGround", [live(what)])))) {
				yield* g.call(f, P("/proc/add_logs"), null, [null, live(f.src), null, live(who), null, "stripped", "addition", fmt("of ＀", [live(what)])], rt.Args.Named);
			}
		}
	}
	if (!isEqual(live(what), (yield* g.callName(f, live(who), "get_item_by_slot", [live(where)])))) return f.dot;
	if (!truthy((yield* g.callName(f, live(who), "dropItemToGround", [live(what)])))) return f.dot;
	yield* g.call(f, P("/proc/add_logs"), null, [null, live(f.src), null, live(who), null, "stripped", "addition", fmt("of ＀", [live(what)])], rt.Args.Named);
	return f.dot;
}, true);

// /mob/living/proc/stripPanelEquip  (code/modules/mob/living/living.dm:656)  may sleep
rt.def("/mob/living/proc/stripPanelEquip", function* stripPanelEquip(f: Frame, what: Value, who: Value, where: Value) {
	let where_list: Value = null, final_where: Value = null;
	f.vars = () => [what, who, where, where_list, final_where];
	if ((truthy((what = (yield* g.callName(f, live(f.src), "get_active_held_item", [])))) && truthy(rt.bitAnd(rt.fv(f, "flags", live(what)), 2)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>You can't put ％！ on ＀, it's stuck to your hand!</span>", [rt.fv(f, "name", live(what)), live(who)])]);
		return live(f.dot);
	}
	if (!truthy(live(what))) return f.dot;
	where_list = null;
	final_where = null;
	if (truthy((rt.istype(live(where), T("/list")) ? 1 : 0))) {
		where_list = live(where);
		final_where = rt.index(live(where), 1);
	} else {
		final_where = live(where);
	}
	if (!truthy((yield* g.callName(f, live(what), "mob_can_equip", [live(who), live(f.src), live(final_where), 1, 1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＄！ doesn't fit in that place!</span>", [rt.fv(f, "name", live(what))])]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ tries to put ＀ on ＀.</span>", [live(f.src), live(what), live(who)]));
	if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(f.src), live(who), rt.fv(f, "equip_delay_other", live(what))])))) return f.dot;
	if (!((truthy(live(what)) && truthy((yield* g.srcCall(f, "Adjacent", live(who))))) && truthy((yield* g.callName(f, live(what), "mob_can_equip", [live(who), live(f.src), live(final_where), 1, 1]))))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "temporarilyRemoveItemFromInventory", live(what))))) return f.dot;
	if (truthy(live(where_list))) {
		if (!truthy((yield* g.callName(f, live(who), "put_in_hand", [live(what), rt.index(live(where_list), 2)])))) {
			yield* g.callName(f, live(what), "forceMove", [rt.getStep(f, live(who), 0)]);
		}
	} else {
		yield* g.callName(f, live(who), "equip_to_slot", [live(what), live(where), 1]);
	}
	return f.dot;
}, true);

// /mob/living/proc/singularity_pull  (code/modules/mob/living/living.dm:685)  may sleep
rt.def("/mob/living/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (rt.ge(live(current_size), 11)) {
		yield* g.callSrc(f, "throw_at", [null, live(S), null, 14, null, 3, "spin", 1], rt.Args.Named);
	} else {
		yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), live(S)]);
	}
	return f.dot;
}, true);

// /mob/living/proc/do_jitter_animation  (code/modules/mob/living/living.dm:691)
rt.def("/mob/living/proc/do_jitter_animation", function do_jitter_animation(f: Frame, jitteriness: Value) {
	let amplitude: Value = null, pixel_x_diff: Value = null, pixel_y_diff: Value = null, final_pixel_x: Value = null, final_pixel_y: Value = null;
	f.vars = () => [amplitude, pixel_x_diff, pixel_y_diff, final_pixel_x, final_pixel_y];
	amplitude = rt.call(f, P("/proc/min"), null, [4, add(divide(live(jitteriness), 100), 1)]);
	pixel_x_diff = rt.call(f, P("/proc/rand"), null, [rt.neg(live(amplitude)), live(amplitude)]);
	pixel_y_diff = rt.call(f, P("/proc/rand"), null, [divide(rt.neg(live(amplitude)), 3), divide(live(amplitude), 3)]);
	final_pixel_x = rt.callSrc(f, "get_standard_pixel_x_offset", [rt.sv(f, "lying")]);
	final_pixel_y = rt.callSrc(f, "get_standard_pixel_y_offset", [rt.sv(f, "lying")]);
	rt.op(f, "Animate", [2, 10], [null, live(f.src), "pixel_x", add(rt.sv(f, "pixel_x"), live(pixel_x_diff)), "pixel_y", add(rt.sv(f, "pixel_y"), live(pixel_y_diff)), "time", 2, "loop", 6]);
	rt.op(f, "Animate", [2, 6], ["pixel_x", live(final_pixel_x), "pixel_y", live(final_pixel_y), "time", 2]);
	rt.setSv(f, "floating", 0);
	return f.dot;
});

// /mob/living/proc/get_temperature  (code/modules/mob/living/living.dm:702)
rt.def("/mob/living/proc/get_temperature", function get_temperature(f: Frame, environment: Value) {
	let loc_temp: Value = null, M: Value = null, heat_turf: Value = null, C: Value = null, G: Value = null;
	f.vars = () => [loc_temp, M, heat_turf, C, G];
	loc_temp = 273.1499938964844;
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/mecha")) ? 1 : 0))) {
		loc_temp = rt.callName(f, (M = rt.sv(f, "loc")), "return_temperature", []);
	} else {
		if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/structure/transit_tube_pod")) ? 1 : 0))) {
			loc_temp = rt.fv(f, "temperature", live(environment));
		} else {
			if (truthy((rt.istype(rt.getStep(f, live(f.src), 0), T("/turf/open/space")) ? 1 : 0))) {
				loc_temp = rt.gv(f, "temperature", (heat_turf = rt.getStep(f, live(f.src), 0)));
			} else {
				if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/machinery/atmospherics/components/unary/cryo_cell")) ? 1 : 0))) {
					C = rt.sv(f, "loc");
					if (rt.lt(rt.callName(f, (G = rt.index(rt.fv(f, "airs", live(C)), 1)), "total_moles", []), 10)) {
						loc_temp = rt.fv(f, "temperature", live(environment));
					} else {
						loc_temp = rt.fv(f, "temperature", live(G));
					}
				} else {
					loc_temp = rt.fv(f, "temperature", live(environment));
				}
			}
		}
	}
	return live(loc_temp);
});

// /mob/living/proc/get_standard_pixel_x_offset  (code/modules/mob/living/living.dm:728)
rt.def("/mob/living/proc/get_standard_pixel_x_offset", function get_standard_pixel_x_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	return rt.initial(f, live(f.src), "pixel_x");
});

// /mob/living/proc/get_standard_pixel_y_offset  (code/modules/mob/living/living.dm:731)
rt.def("/mob/living/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	f.vars = () => [lying];
	if (live(lying) === null) {
		lying = 0;
	}
	return rt.initial(f, live(f.src), "pixel_y");
});

// /mob/living/proc/Stat  (code/modules/mob/living/living.dm:734)  may sleep
rt.def("/mob/living/proc/Stat", function* Stat(f: Frame) {
	let G: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [G, B, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.call(f, P("/proc/statpanel"), null, ["Status"])))) return f.dot;
	if (!(truthy(rt.gl("SSticker")) && truthy(rt.fv(f, "mode", rt.gl("SSticker"))))) return f.dot;
	G = null;
	rt.forList(f, 0, rt.gv(f, "gangs", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/gang"));
	while (($e = rt.next(f, 0)) !== undefined) {
		G = $e;
		if (truthy(rt.fv(f, "is_dominating", live(G)))) {
			yield* g.call(f, P("/proc/stat"), null, [null, fmt("＀ Gang Takeover: ＀", [rt.fv(f, "name", live(G)), (yield* g.call(f, P("/proc/max"), null, [(yield* g.callName(f, live(G), "domination_time_remaining", [])), 0]))])]);
		}
	}
	rt.endFor(f, 0);
	if (!truthy((rt.istype(rt.fv(f, "mode", rt.gl("SSticker")), T("/datum/game_mode/blob")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "message_sent", (B = rt.fv(f, "mode", rt.gl("SSticker")))))) return f.dot;
	yield* g.call(f, P("/proc/stat"), null, [null, fmt("Blobs to Blob Win: ＀/＀", [rt.len(f, rt.gl("blobs_legit")), rt.fv(f, "blobwincount", live(B))])]);
	return f.dot;
}, true);

// /mob/living/cancel_camera  (code/modules/mob/living/living.dm:747)  may sleep
rt.def("/mob/living/cancel_camera", function* cancel_camera(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "cameraFollow", null);
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// /mob/living/proc/can_track  (code/modules/mob/living/living.dm:752)
rt.def("/mob/living/proc/can_track", function can_track(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
		return 0;
	}
	if (isEqual(rt.fv(f, "z", live(_T)), 1)) {
		return 0;
	}
	if (rt.ge(rt.fv(f, "z", live(_T)), 12)) {
		return 0;
	}
	if ((live(user) !== null && isEqual(live(f.src), live(user)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "invisibility")) || isEqual(rt.sv(f, "alpha"), 0))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "digitalcamo")) || truthy(rt.sv(f, "digitalinvis")))) {
		return 0;
	}
	if (!truthy(rt.call(f, P("/proc/near_camera"), null, [live(f.src)]))) {
		return 0;
	}
	return 1;
});

// /mob/living/proc/harvest  (code/modules/mob/living/living.dm:777)  may sleep
rt.def("/mob/living/proc/harvest", function* harvest(f: Frame, user: Value) {
	let path: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [user, path, i, $e];
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "butcher_results"))) {
		path = null;
		rt.forList(f, 0, rt.sv(f, "butcher_results"));
		while (($e = rt.next(f, 0)) !== undefined) {
			path = $e;
			i = null;
			i = 1;
			while (rt.le(live(i), rt.index(rt.sv(f, "butcher_results"), live(path)))) {
				yield* g.new_(f, live(path), [rt.fv(f, "loc", live(f.src))]);
				i = rt.inc(live(i), 1);
			}
			yield* g.callName(f, rt.sv(f, "butcher_results"), "Remove", [live(path)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ butchers ＀.</span>", [live(user), live(f.src)]));
	yield* g.srcCall(f, "gib", 0, 0, 1);
	return f.dot;
}, true);

// /mob/living/proc/canUseTopic  (code/modules/mob/living/living.dm:788)
rt.def("/mob/living/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value, no_dextery: Value) {
	f.vars = () => [be_close, no_dextery];
	if (live(be_close) === null) {
		be_close = 0;
	}
	if (live(no_dextery) === null) {
		no_dextery = 0;
	}
	if (truthy(rt.callSrc(f, "incapacitated", []))) {
		return live(f.dot);
	}
	if (truthy(live(no_dextery))) {
		if ((truthy(live(be_close)) && rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
			return 1;
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
	}
	return live(f.dot);
});

// /mob/living/proc/can_use_guns  (code/modules/mob/living/living.dm:797)
rt.def("/mob/living/proc/can_use_guns", function can_use_guns(f: Frame, G: Value) {
	if ((!isEqual(rt.fv(f, "trigger_guard", live(G)), -1) && !truthy(rt.callSrc(f, "IsAdvancedToolUser", [])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return 0;
	}
	return 1;
});

// /mob/living/carbon/proc/update_stamina  (code/modules/mob/living/living.dm:804)  may sleep
rt.def("/mob/living/carbon/proc/update_stamina", function* update_stamina(f: Frame) {
	let total_health: Value = null;
	f.vars = () => [total_health];
	if (truthy(rt.sv(f, "staminaloss"))) {
		if ((rt.le((total_health = subtract(rt.sv(f, "health"), rt.sv(f, "staminaloss"))), 0) && !truthy(rt.sv(f, "stat")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='notice'>You're too exhausted to keep going...</span>"]);
			yield* g.srcCall(f, "Knockdown", 100);
			yield* g.srcCall(f, "setStaminaLoss", subtract(rt.sv(f, "health"), 2));
		}
	}
	yield* g.srcCall(f, "update_health_hud");
	return f.dot;
}, true);

// /mob/living/proc/owns_soul  (code/modules/mob/living/living.dm:816)
rt.def("/mob/living/proc/owns_soul", function owns_soul(f: Frame) {
	if (truthy(rt.sv(f, "mind"))) {
		return (isEqual(rt.fv(f, "soulOwner", rt.sv(f, "mind")), rt.sv(f, "mind")) ? 1 : 0);
	}
	return 1;
});

// /mob/living/proc/return_soul  (code/modules/mob/living/living.dm:822)  may sleep
rt.def("/mob/living/proc/return_soul", function* return_soul(f: Frame) {
	let devilInfo: Value = null;
	f.vars = () => [devilInfo];
	rt.setSv(f, "hellbound", 0);
	if (!truthy(rt.sv(f, "mind"))) return f.dot;
	if (truthy((devilInfo = (yield* g.callName(f, rt.fv(f, "soulOwner", rt.sv(f, "mind")), "has_antag_datum", [T("/datum/antagonist/devil")]))))) {
		yield* g.callName(f, live(devilInfo), "remove_soul", [rt.sv(f, "mind")]);
	}
	rt.setFv(f, "soulOwner", rt.sv(f, "mind"), rt.sv(f, "mind"));
	return f.dot;
}, true);

// /mob/living/proc/has_bane  (code/modules/mob/living/living.dm:828)
rt.def("/mob/living/proc/has_bane", function has_bane(f: Frame, banetype: Value) {
	let devilInfo: Value = null;
	f.vars = () => [devilInfo];
	return ((devilInfo = rt.call(f, P("/proc/is_devil"), null, [live(f.src)])) && (isEqual(live(banetype), rt.fv(f, "bane", live(devilInfo))) ? 1 : 0));
});

// /mob/living/proc/check_weakness  (code/modules/mob/living/living.dm:832)  may sleep
rt.def("/mob/living/proc/check_weakness", function* check_weakness(f: Frame, weapon: Value, attacker: Value) {
	f.vars = () => [weapon, attacker];
	if ((truthy(rt.sv(f, "mind")) && truthy((yield* g.callName(f, rt.sv(f, "mind"), "has_antag_datum", [T("/datum/antagonist/devil")]))))) {
		return (yield* g.srcCall(f, "check_devil_bane_multiplier", live(weapon), live(attacker)));
	}
	return 1;
}, true);

// /mob/living/proc/check_acedia  (code/modules/mob/living/living.dm:837)
rt.def("/mob/living/proc/check_acedia", function check_acedia(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	if ((truthy(rt.fv(f, "mind", live(f.src))) && truthy(rt.gv(f, "objectives", rt.fv(f, "mind", live(f.src)))))) {
		A = null;
		rt.forList(f, 0, rt.gv(f, "objectives", rt.fv(f, "mind", live(f.src))), T("/datum/objective/sintouched/acedia"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			return 1;
		}
		rt.endFor(f, 0);
	}
	return 0;
});

// /mob/living/proc/throw_at  (code/modules/mob/living/living.dm:843)  may sleep
rt.def("/mob/living/proc/throw_at", function* throw_at(f: Frame) {
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	yield* g.srcCall(f, "stop_pulling");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /mob/living/proc/wabbajack_act  (code/modules/mob/living/living.dm:853)  may sleep
rt.def("/mob/living/proc/wabbajack_act", function* wabbajack_act(f: Frame, new_mob: Value) {
	let para: Value = null, G: Value = null;
	let $e: any;
	f.vars = () => [new_mob, para, G, $e];
	rt.setFv(f, "name", live(new_mob), rt.sv(f, "real_name"));
	rt.setFv(f, "real_name", live(new_mob), rt.sv(f, "real_name"));
	if (truthy(rt.sv(f, "mind"))) {
		yield* g.callName(f, rt.sv(f, "mind"), "transfer_to", [live(new_mob)]);
	} else {
		rt.setFv(f, "key", live(new_mob), rt.sv(f, "key"));
	}
	para = null;
	rt.forList(f, 0, (yield* g.srcCall(f, "hasparasites")));
	while (($e = rt.next(f, 0)) !== undefined) {
		para = $e;
		rt.setFv(f, "summoner", (G = live(para)), live(new_mob));
		yield* g.callName(f, live(G), "Recall", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(G), "<span class='holoparasite'>Your summoner has changed form!</span>"]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /mob/living/proc/IgniteMob  (code/modules/mob/living/living.dm:873)  may sleep
rt.def("/mob/living/proc/IgniteMob", function* IgniteMob(f: Frame) {
	if ((rt.gt(rt.sv(f, "fire_stacks"), 0) && !truthy(rt.sv(f, "on_fire")))) {
		rt.setSv(f, "on_fire", 1);
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>＀ catches fire!</span>", [live(f.src)]), "<span class='userdanger'>You're set on fire!</span>"]);
		yield* g.callName(f, live(f.src), "set_light", [3]);
		yield* g.srcCall(f, "throw_alert", "fire", T("/obj/screen/alert/fire"));
		yield* g.srcCall(f, "update_fire");
		return 1;
	}
	return 0;
}, true);

// /mob/living/proc/ExtinguishMob  (code/modules/mob/living/living.dm:887)  may sleep
rt.def("/mob/living/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	if (!truthy(rt.sv(f, "on_fire"))) return f.dot;
	rt.setSv(f, "on_fire", 0);
	rt.setSv(f, "fire_stacks", 0);
	yield* g.callName(f, live(f.src), "set_light", [0]);
	yield* g.srcCall(f, "clear_alert", "fire");
	yield* g.srcCall(f, "update_fire");
	return f.dot;
}, true);

// /mob/living/proc/adjust_fire_stacks  (code/modules/mob/living/living.dm:892)  may sleep
rt.def("/mob/living/proc/adjust_fire_stacks", function* adjust_fire_stacks(f: Frame, add_fire_stacks: Value) {
	f.vars = () => [add_fire_stacks];
	rt.setSv(f, "fire_stacks", (yield* g.call(f, P("/proc/max"), null, [-20, (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "fire_stacks"), live(add_fire_stacks)), 20]))])));
	if (!(truthy(rt.sv(f, "on_fire")) && rt.le(rt.sv(f, "fire_stacks"), 0))) return f.dot;
	yield* g.srcCall(f, "ExtinguishMob");
	return f.dot;
}, true);

// /mob/living/proc/spreadFire  (code/modules/mob/living/living.dm:899)  may sleep
rt.def("/mob/living/proc/spreadFire", function* spreadFire(f: Frame, L: Value) {
	let L_old_on_fire: Value = null;
	f.vars = () => [L, L_old_on_fire];
	if (!truthy((rt.istype(live(L), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	L_old_on_fire = rt.fv(f, "on_fire", live(L));
	if (truthy(rt.sv(f, "on_fire"))) {
		(rt.modSrcVar(f, "fire_stacks", 2, divide));
		rt.modField(f, live(L), "fire_stacks", rt.sv(f, "fire_stacks"), add);
		if (truthy((yield* g.callName(f, live(L), "IgniteMob", [])))) {
			yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ bumped into ＀ and set them on fire", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.src)])), (yield* g.call(f, P("/proc/key_name"), null, [live(L)]))])]);
		}
	}
	if (!truthy(live(L_old_on_fire))) return f.dot;
	(rt.modField(f, live(L), "fire_stacks", 2, divide));
	rt.modSrcVar(f, "fire_stacks", rt.fv(f, "fire_stacks", live(L)), add);
	yield* g.srcCall(f, "IgniteMob");
	return f.dot;
}, true);

// /mob/living/proc/knockOver  (code/modules/mob/living/living.dm:918)  may sleep
rt.def("/mob/living/proc/knockOver", function* knockOver(f: Frame, C: Value) {
	f.vars = () => [C];
	if (truthy(rt.fv(f, "key", live(C)))) {
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀</span>", [rt.op(f, "PickUnweighted", [6], [fmt("＀ dives out of ＀'s way!", [live(C), live(f.src)]), fmt("＀ stumbles over ＀!", [live(C), live(f.src)]), fmt("＀ jumps out of ＀'s path!", [live(C), live(f.src)]), fmt("＀ trips over ＀ and falls!", [live(C), live(f.src)]), fmt("＀ topples over ＀!", [live(C), live(f.src)]), fmt("＀ leaps out of ＀'s way!", [live(C), live(f.src)])])])]);
	}
	yield* g.callName(f, live(C), "Knockdown", [40]);
	return f.dot;
}, true);

// /mob/living/proc/post_buckle_mob  (code/modules/mob/living/living.dm:930)  may sleep
rt.def("/mob/living/proc/post_buckle_mob", function* post_buckle_mob(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!truthy(rt.sv(f, "riding_datum"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_offsets", []);
	yield* g.callName(f, rt.sv(f, "riding_datum"), "handle_vehicle_layer", []);
	return f.dot;
}, true);

// /mob/living/proc/ConveyorMove  (code/modules/mob/living/living.dm:934)
rt.def("/mob/living/proc/ConveyorMove", function ConveyorMove(f: Frame) {
	if ((truthy(rt.bitAnd(rt.sv(f, "movement_type"), 2)) && !truthy(rt.sv(f, "stat")))) {
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /mob/living/proc/can_be_pulled  (code/modules/mob/living/living.dm:939)
rt.def("/mob/living/proc/can_be_pulled", function can_be_pulled(f: Frame) {
	return (rt.callSuper(f, [], rt.Args.Same) && (!(truthy(rt.sv(f, "buckled")) && truthy(rt.fv(f, "buckle_prevents_pull", rt.sv(f, "buckled")))) ? 1 : 0));
});

// /mob/living/proc/update_canmove  (code/modules/mob/living/living.dm:944)  may sleep
rt.def("/mob/living/proc/update_canmove", function* update_canmove(f: Frame) {
	let ko: Value = null, chokehold: Value = null, buckle_lying: Value = null, has_legs: Value = null, has_arms: Value = null, ignore_legs: Value = null;
	f.vars = () => [ko, chokehold, buckle_lying, has_legs, has_arms, ignore_legs];
	ko = ((((yield* g.srcCall(f, "IsKnockdown")) || (yield* g.srcCall(f, "IsUnconscious"))) || rt.sv(f, "stat")) || rt.bitAnd(rt.sv(f, "status_flags"), 8192));
	chokehold = (rt.sv(f, "pulledby") && (rt.ge(rt.fv(f, "grab_state", rt.sv(f, "pulledby")), 2) ? 1 : 0));
	buckle_lying = (!(truthy(rt.sv(f, "buckled")) && !truthy(rt.fv(f, "buckle_lying", rt.sv(f, "buckled")))) ? 1 : 0);
	has_legs = (yield* g.srcCall(f, "get_num_legs"));
	has_arms = (yield* g.srcCall(f, "get_num_arms"));
	ignore_legs = (yield* g.srcCall(f, "get_leg_ignore"));
	if ((((truthy(live(ko)) || truthy(rt.sv(f, "resting"))) || truthy((yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/incapacitating/stun"))))) || truthy(live(chokehold)))) {
		yield* g.srcCall(f, "drop_all_held_items");
		yield* g.srcCall(f, "unset_machine");
		if (truthy(rt.sv(f, "pulling"))) {
			yield* g.srcCall(f, "stop_pulling");
		}
	} else {
		if ((truthy(live(has_legs)) || truthy(live(ignore_legs)))) {
			rt.setSv(f, "lying", 0);
		}
	}
	if (truthy(rt.sv(f, "buckled"))) {
		rt.setSv(f, "lying", multiply(90, live(buckle_lying)));
	} else {
		if (!truthy(rt.sv(f, "lying"))) {
			if (truthy(rt.sv(f, "resting"))) {
				yield* g.srcCall(f, "fall");
			} else {
				if (((truthy(live(ko)) || (!truthy(live(has_legs)) && !truthy(live(ignore_legs)))) || truthy(live(chokehold)))) {
					yield* g.callSrc(f, "fall", ["forced", 1], rt.Args.Named);
				}
			}
		}
	}
	rt.setSv(f, "canmove", (!((((((truthy(live(ko)) || truthy(rt.sv(f, "resting"))) || truthy((yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/incapacitating/stun"))))) || truthy((yield* g.srcCall(f, "has_status_effect", T("/datum/status_effect/freon"))))) || truthy(live(chokehold))) || truthy(rt.sv(f, "buckled"))) || ((!truthy(live(has_legs)) && !truthy(live(ignore_legs))) && !truthy(live(has_arms)))) ? 1 : 0));
	rt.setSv(f, "density", (!truthy(rt.sv(f, "lying")) ? 1 : 0));
	if (truthy(rt.sv(f, "lying"))) {
		if (isEqual(rt.sv(f, "layer"), rt.initial(f, live(f.src), "layer"))) {
			rt.setSv(f, "layer", 3.799999952316284);
		}
	} else {
		if (isEqual(rt.sv(f, "layer"), 3.799999952316284)) {
			rt.setSv(f, "layer", rt.initial(f, live(f.src), "layer"));
		}
	}
	yield* g.srcCall(f, "update_transform");
	if ((!truthy(rt.sv(f, "lying")) && truthy(rt.sv(f, "lying_prev")))) {
		if (truthy(rt.sv(f, "client"))) {
			rt.setFv(f, "move_delay", rt.sv(f, "client"), add(rt.worldTime(f), (yield* g.srcCall(f, "movement_delay"))));
		}
	}
	rt.setSv(f, "lying_prev", rt.sv(f, "lying"));
	return rt.sv(f, "canmove");
}, true);
