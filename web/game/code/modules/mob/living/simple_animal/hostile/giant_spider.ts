// From code/modules/mob/living/simple_animal/hostile/giant_spider.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4909, "/mob/living/simple_animal/hostile/poison", "/mob/living/simple_animal/hostile", {
	poison_per_bite: 5,
	poison_type: "toxin",
});

// /mob/living/simple_animal/hostile/poison/proc/AttackingTarget  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:12)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy((rt.istype(rt.sv(f, "target"), T("/mob/living")) ? 1 : 0)))) return f.dot;
	if (!truthy(rt.gv(f, "reagents", (L = rt.sv(f, "target"))))) return f.dot;
	yield* g.callName(f, rt.fv(f, "reagents", live(L)), "add_reagent", [rt.sv(f, "poison_type"), rt.sv(f, "poison_per_bite")]);
	return f.dot;
}, true);

rt.type(4913, "/mob/living/simple_animal/hostile/poison/giant_spider", "/mob/living/simple_animal/hostile/poison", {
	busy: 0,
	playable_spider: 0,
	pass_flags: 1,
	name: "giant spider",
	desc: "Furry and black, it makes you shudder to look at it. This one has deep red eyes.",
	icon_state: "guard",
	icon_living: "guard",
	icon_dead: "guard_dead",
	speak_emote: null,
	emote_hear: null,
	speak_chance: 5,
	turns_per_move: 5,
	see_in_dark: 4,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	maxHealth: 200,
	health: 200,
	obj_damage: 60,
	melee_damage_lower: 15,
	melee_damage_upper: 20,
	faction: null,
	move_to_delay: 6,
	ventcrawler: 2,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	unique_name: 1,
	gold_core_spawnable: 1,
	lighting_alpha: 192,
});

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/<init>  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:27)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "speak_emote", rt.list("chitters"));
	$0 = $0;
	rt.setSv(f, "emote_hear", rt.list("chitters"));
	$0 = $0;
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/spiderleg"), 8]));
	$0 = $0;
	rt.setSv(f, "faction", rt.list("spiders"));
	return f.dot;
});

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/Topic  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:55)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	f.vars = () => [href, href_list, ghost];
	if (!truthy(rt.at(live(href_list), "activate"))) return f.dot;
	if (!(truthy((rt.istype((ghost = live(f.usr)), T("/mob/dead/observer")) ? 1 : 0)) && truthy(rt.sv(f, "playable_spider")))) return f.dot;
	yield* g.srcCall(f, "humanize_spider", live(ghost));
	return f.dot;
}, true);

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/attack_ghost  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:61)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/attack_ghost", function* attack_ghost(f: Frame) {
	if (truthy((yield* g.srcCall(f, "humanize_spider", live(f.args[0]))))) return f.dot;
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/humanize_spider  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:65)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/humanize_spider", function* humanize_spider(f: Frame, user: Value) {
	let spider_ask: Value = null;
	f.vars = () => [user, spider_ask];
	if ((truthy(rt.sv(f, "key")) || !truthy(rt.sv(f, "playable_spider")))) {
		return 0;
	}
	if (((isEqual((spider_ask = (yield* g.call(f, P("/proc/alert"), null, ["Become a spider?", "Are you australian?", "Yes", "No"]))), "No") || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))))) {
		return 1;
	}
	if (truthy(rt.sv(f, "key"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Someone else already took this spider.</span>"]);
		return 1;
	}
	rt.setSv(f, "key", rt.fv(f, "key", live(user)));
	return 1;
}, true);

rt.type(4914, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse", "/mob/living/simple_animal/hostile/poison/giant_spider", {
	cocoon_target: null,
	fed: 0,
	poison_per_bite: 3,
	desc: "Furry and black, it makes you shudder to look at it. This one has brilliant green eyes.",
	icon_state: "nurse",
	icon_living: "nurse",
	icon_dead: "nurse_dead",
	gender: "female",
	butcher_results: null,
	maxHealth: 40,
	health: 40,
	melee_damage_lower: 5,
	melee_damage_upper: 10,
}, { global: { consumed_mobs: 719 } });

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/<init>  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:83)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "butcher_results", rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/spiderleg"), 8, T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), 4]));
	return f.dot;
});

rt.type(4918, "/mob/living/simple_animal/hostile/poison/giant_spider/ice", "/mob/living/simple_animal/hostile/poison/giant_spider", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/hostile/poison/giant_spider/ice/proc/<init>  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:108)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

rt.type(4915, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse/ice", "/mob/living/simple_animal/hostile/poison/giant_spider/nurse", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/ice/proc/<init>  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:116)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

rt.type(4917, "/mob/living/simple_animal/hostile/poison/giant_spider/hunter/ice", "/mob/living/simple_animal/hostile/poison/giant_spider/hunter", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// /mob/living/simple_animal/hostile/poison/giant_spider/hunter/ice/proc/<init>  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:124)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/hunter/ice/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "atmos_requirements", rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]));
	return f.dot;
});

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:131)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action", function handle_automated_action(f: Frame) {
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return 0;
	}
	if (!isEqual(rt.sv(f, "AIStatus"), 2)) return f.dot;
	if ((!truthy(rt.sv(f, "busy")) && truthy(rt.op(f, "Prob", [], [1])))) {
		rt.setSv(f, "stop_automated_movement", 1);
		rt.callSrc(f, "Goto", [rt.op(f, "PickUnweighted", [1], [rt.call(f, P("/proc/urange"), null, [20, live(f.src), 1])]), rt.sv(f, "move_to_delay")]);
		rt.spawnTail(f, 50, "/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:138");
	}
	return 1;
}, false, { waitfor: false });

// a spawn(50) body of /mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:138", function* (f: Frame) {
	rt.setSv(f, "stop_automated_movement", 0);
	yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
	return null;
});

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:144)
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp", function GiveUp(f: Frame, C: Value) {
	rt.spawnTail(f, 100, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:144", C);
	return f.dot;
});

// a spawn(100) body of /mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:144", function* (f: Frame, C: Value) {
	f.vars = () => [C];
	if (isEqual(rt.sv(f, "busy"), 3)) {
		if ((isEqual(rt.sv(f, "cocoon_target"), live(C)) && rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "cocoon_target")])), 1))) {
			rt.setSv(f, "cocoon_target", null);
		}
		rt.setSv(f, "busy", 0);
		rt.setSv(f, "stop_automated_movement", 0);
	}
	return null;
});

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/handle_automated_action  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:152)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let can_see: Value = null, C: Value = null, W: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [can_see, C, W, O, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		can_see = (yield* g.call(f, P("/proc/view"), null, [live(f.src), 10]));
		if ((!truthy(rt.sv(f, "busy")) && truthy(rt.op(f, "Prob", [], [30])))) {
			C = null;
			rt.forList(f, 0, live(can_see), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				if (((truthy(rt.fv(f, "stat", live(C))) && !truthy((rt.istype(live(C), T("/mob/living/simple_animal/hostile/poison/giant_spider")) ? 1 : 0))) && !truthy(rt.fv(f, "anchored", live(C))))) {
					rt.setSv(f, "cocoon_target", live(C));
					rt.setSv(f, "busy", 3);
					yield* g.srcCall(f, "Goto", live(C), rt.sv(f, "move_to_delay"));
					yield* g.srcCall(f, "GiveUp", live(C));
					return live(f.dot);
				}
			}
			rt.endFor(f, 0);
			if (!truthy((W = rt.locateIn(f, T("/obj/structure/spider/stickyweb"), rt.getStep(f, live(f.src), 0))))) {
				yield* g.srcCall(f, "Web");
			} else {
				if (truthy(rt.sv(f, "fed"))) {
					yield* g.srcCall(f, "LayEggs");
				} else {
					O = null;
					rt.forList(f, 0, live(can_see), T("/obj"));
					while (($e = rt.next(f, 0)) !== undefined) {
						O = $e;
						if (truthy(rt.fv(f, "anchored", live(O)))) {
							continue;
						}
						if (((truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0)) || truthy((rt.istype(live(O), T("/obj/structure")) ? 1 : 0))) || truthy((rt.istype(live(O), T("/obj/machinery")) ? 1 : 0)))) {
							rt.setSv(f, "cocoon_target", live(O));
							rt.setSv(f, "busy", 3);
							rt.setSv(f, "stop_automated_movement", 1);
							yield* g.srcCall(f, "Goto", live(O), rt.sv(f, "move_to_delay"));
							yield* g.srcCall(f, "GiveUp", live(O));
						}
					}
					rt.endFor(f, 0);
				}
			}
		} else {
			if ((isEqual(rt.sv(f, "busy"), 3) && truthy(rt.sv(f, "cocoon_target")))) {
				if (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "cocoon_target")])), 1)) {
					yield* g.srcCall(f, "Wrap");
				}
			}
		}
	} else {
		rt.setSv(f, "busy", 0);
		rt.setSv(f, "stop_automated_movement", 0);
	}
	return f.dot;
}, true, { waitfor: false });

// /mob/living/simple_animal/hostile/poison/giant_spider/verb/Web  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:203)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/verb/Web", function* Web(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.fv(f, "loc", live(f.src));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "busy"), 1)) return f.dot;
	rt.setSv(f, "busy", 1);
	yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>％！ begins to secrete a sticky substance.</span>", [live(f.src)])]);
	rt.setSv(f, "stop_automated_movement", 1);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 40, "target", live(_T)], rt.Args.Named)))) {
		if ((isEqual(rt.sv(f, "busy"), 1) && isEqual(rt.fv(f, "loc", live(f.src)), live(_T)))) {
			yield* g.new_(f, T("/obj/structure/spider/stickyweb"), [live(_T)]);
		}
	}
	rt.setSv(f, "busy", 0);
	rt.setSv(f, "stop_automated_movement", 0);
	return f.dot;
}, true, { verb: { name: "Lay Web", category: "Spider", desc: "Spread a sticky web to slow down prey." } });

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/Wrap  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:221)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/Wrap", function* Wrap(f: Frame) {
	let choices: Value = null, L: Value = null, O: Value = null, temp_input: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [choices, L, O, temp_input, C, $e];
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "cocoon_target"))) {
		choices = rt.list();
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [1, live(f.src)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((isEqual(live(L), live(f.src)) || truthy(rt.fv(f, "anchored", live(L))))) {
				continue;
			}
			if (truthy((rt.istype(live(L), T("/mob/living/simple_animal/hostile/poison/giant_spider")) ? 1 : 0))) {
				continue;
			}
			if (truthy((yield* g.srcCall(f, "Adjacent", live(L))))) {
				choices = rt.modify(live(choices), live(L), add);
			}
		}
		rt.endFor(f, 0);
		O = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			if (truthy(rt.fv(f, "anchored", live(O)))) {
				continue;
			}
			if (truthy((yield* g.srcCall(f, "Adjacent", live(O))))) {
				choices = rt.modify(live(choices), live(O), add);
			}
		}
		rt.endFor(f, 0);
		if ((truthy((temp_input = (yield* g.op(f, "Prompt", [0], [null, null, "What do you wish to cocoon?", live(f.src), rt.bitOr(null, live(choices))])))) && !truthy(rt.sv(f, "cocoon_target")))) {
			rt.setSv(f, "cocoon_target", live(temp_input));
		}
	}
	if ((((!isEqual(rt.sv(f, "stat"), 2) && truthy(rt.sv(f, "cocoon_target"))) && truthy((yield* g.srcCall(f, "Adjacent", rt.sv(f, "cocoon_target"))))) && !truthy(rt.fv(f, "anchored", rt.sv(f, "cocoon_target"))))) {
		if (isEqual(rt.sv(f, "busy"), 4)) {
			return live(f.dot);
		}
		rt.setSv(f, "busy", 4);
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>％！ begins to secrete a sticky substance around ％！.</span>", [live(f.src), rt.sv(f, "cocoon_target")]));
		rt.setSv(f, "stop_automated_movement", 1);
		yield* g.call(f, P("/proc/walk"), null, [live(f.src), 0]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 50, "target", rt.sv(f, "cocoon_target")], rt.Args.Named)))) {
			if (isEqual(rt.sv(f, "busy"), 4)) {
				C = (yield* g.new_(f, T("/obj/structure/spider/cocoon"), [rt.fv(f, "loc", rt.sv(f, "cocoon_target"))]));
				if (truthy((rt.istype(rt.sv(f, "cocoon_target"), T("/mob/living")) ? 1 : 0))) {
					if ((truthy(rt.gv(f, "blood_volume", (L = rt.sv(f, "cocoon_target")))) && (!isEqual(rt.fv(f, "stat", live(L)), 2) || !truthy(rt.index(rt.gl("consumed_mobs"), rt.fv(f, "tag", live(L))))))) {
						rt.setAt(rt.gl("consumed_mobs"), rt.fv(f, "tag", live(L)), 1);
						rt.incSrcVar(f, "fed", 1, true);
						yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>％！ sticks a proboscis into ％！ and sucks a viscous substance out.</span>", [live(f.src), live(L)]));
						yield* g.callName(f, live(L), "death", []);
					} else {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀ cannot sate your hunger!</span>", [live(L)])]);
					}
				}
				yield* g.callName(f, rt.sv(f, "cocoon_target"), "forceMove", [live(C)]);
				if ((truthy(rt.fv(f, "density", rt.sv(f, "cocoon_target"))) || truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "cocoon_target")]))))) {
					rt.setFv(f, "icon_state", live(C), rt.op(f, "PickUnweighted", [3], ["cocoon_large1", "cocoon_large2", "cocoon_large3"]));
				}
			}
		}
	}
	rt.setSv(f, "cocoon_target", null);
	rt.setSv(f, "busy", 0);
	rt.setSv(f, "stop_automated_movement", 0);
	return f.dot;
}, true, { verb: { name: "Wrap", category: "Spider", desc: "Wrap up prey to feast upon and objects for safe keeping." } });

// /mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/LayEggs  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:273)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/LayEggs", function* LayEggs(f: Frame) {
	let E: Value = null, C: Value = null;
	f.vars = () => [E, C];
	E = rt.locateIn(f, T("/obj/structure/spider/eggcluster"), rt.getStep(f, live(f.src), 0));
	if (isEqual(rt.sv(f, "stat"), 2)) {
		return live(f.dot);
	}
	if (truthy(live(E))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>There is already a cluster of eggs here!</span>"]);
	} else {
		if (!truthy(rt.sv(f, "fed"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), "<span class='warning'>You are too hungry to do this!</span>"]);
		} else {
			if (isEqual(rt.sv(f, "busy"), 2)) return f.dot;
			rt.setSv(f, "busy", 2);
			yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='notice'>％！ begins to lay a cluster of eggs.</span>", [live(f.src)])]);
			rt.setSv(f, "stop_automated_movement", 1);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.src), null, 50, "target", rt.fv(f, "loc", live(f.src))], rt.Args.Named)))) {
				if (isEqual(rt.sv(f, "busy"), 2)) {
					if (!truthy((E = rt.locateIn(f, T("/obj/structure/spider/eggcluster"), rt.getStep(f, live(f.src), 0))))) {
						C = (yield* g.new_(f, T("/obj/structure/spider/eggcluster"), [rt.fv(f, "loc", live(f.src))]));
						if (truthy(rt.sv(f, "ckey"))) {
							rt.setFv(f, "player_spiders", live(C), 1);
						}
						rt.setFv(f, "poison_type", live(C), rt.sv(f, "poison_type"));
						rt.setFv(f, "poison_per_bite", live(C), rt.sv(f, "poison_per_bite"));
						rt.setFv(f, "faction", live(C), (yield* g.callName(f, rt.sv(f, "faction"), "Copy", [])));
						rt.incSrcVar(f, "fed", -1, true);
					}
				}
			}
			rt.setSv(f, "busy", 0);
			rt.setSv(f, "stop_automated_movement", 0);
		}
	}
	return f.dot;
}, true, { verb: { name: "Lay Eggs", category: "Spider", desc: "Lay a clutch of eggs, but you must wrap a creature for feeding first." } });

// /mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_temperature_damage  (code/modules/mob/living/simple_animal/hostile/giant_spider.dm:299)  may sleep
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (rt.lt(rt.sv(f, "bodytemperature"), rt.sv(f, "minbodytemp"))) {
		yield* g.srcCall(f, "adjustBruteLoss", 20);
	} else {
		if (!rt.gt(rt.sv(f, "bodytemperature"), rt.sv(f, "maxbodytemp"))) return f.dot;
		yield* g.srcCall(f, "adjustBruteLoss", 20);
	}
	return f.dot;
}, true);
