// From code/game/gamemodes/cult/runes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalsacrificed  (code/game/gamemodes/cult/runes.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobalsacrificed", function InitGlobalsacrificed(f: Frame) {
	rt.setGl("sacrificed", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "sacrificed", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalrune_types  (code/game/gamemodes/cult/runes.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalrune_types", function InitGlobalrune_types(f: Frame) {
	rt.setGl("rune_types", null);
	rt.modSrcVar(f, "gvars_datum_init_order", "rune_types", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalteleport_runes  (code/game/gamemodes/cult/runes.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalteleport_runes", function InitGlobalteleport_runes(f: Frame) {
	rt.setGl("teleport_runes", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "teleport_runes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobalwall_runes  (code/game/gamemodes/cult/runes.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalwall_runes", function InitGlobalwall_runes(f: Frame) {
	rt.setGl("wall_runes", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "wall_runes", add);
	return f.dot;
});

rt.type(11425, "/obj/effect/rune", "/obj/effect", {
	cultist_name: "basic rune",
	cultist_desc: "a basic rune with no function.",
	invocation: "Aiy ele-mayo!",
	req_cultists: 1,
	req_cultists_text: null,
	rune_in_use: 0,
	scribe_delay: 50,
	scribe_damage: 0.1,
	allow_excess_invokers: 0,
	invoke_damage: 0,
	construct_invoke: 1,
	req_keyword: 0,
	keyword: null,
	anchored: 1,
	name: "rune",
	desc: "An odd collection of symbols drawn in what seems to be blood.",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "1",
	resistance_flags: 50,
	layer: 2.5,
	color: "#FF0000",
});

// /obj/effect/rune/proc/Initialize  (code/game/gamemodes/cult/runes.dm:45)
rt.def("/obj/effect/rune/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) return f.dot;
	rt.setSv(f, "keyword", live(f.args[1]));
	return f.dot;
}, false, { args: ["mapload", "set_keyword"] });

// /obj/effect/rune/proc/examine  (code/game/gamemodes/cult/runes.dm:50)
rt.def("/obj/effect/rune/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>Name:</b> ＀", [rt.sv(f, "cultist_name")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>Effects:</b> ＀", [rt.call(f, P("/proc/capitalize"), null, [rt.sv(f, "cultist_desc")])])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "req_cultists_text"))) {
		$1 = fmt("＀", [rt.sv(f, "req_cultists_text")]);
	} else {
		$1 = fmt("＀", [rt.sv(f, "req_cultists")]);
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<b>Required Acolytes:</b> ＀", [$1])]);
	if (!(truthy(rt.sv(f, "req_keyword")) && truthy(rt.sv(f, "keyword")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>Keyword:</b> ＀", [rt.sv(f, "keyword")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/rune/proc/attackby  (code/game/gamemodes/cult/runes.dm:59)  may sleep
rt.def("/obj/effect/rune/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if ((truthy((rt.istype(live(I), T("/obj/item/weapon/tome")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You carefully erase the ＀ rune.</span>", [(yield* g.call(f, P("/proc/lowertext"), null, [rt.sv(f, "cultist_name")]))])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/nullrod")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, live(user), "say", ["BEGONE FOUL MAGIKS!!"]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>You disrupt the magic of ＀ with ＀.</span>", [live(f.src), live(I)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/effect/rune/proc/attack_hand  (code/game/gamemodes/cult/runes.dm:68)  may sleep
rt.def("/obj/effect/rune/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let invokers: Value = null;
	f.vars = () => [user, invokers];
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(user)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You aren't able to understand the words of ＀.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (rt.ge(rt.getLen(f, (invokers = (yield* g.srcCall(f, "can_invoke", live(user))))), rt.sv(f, "req_cultists"))) {
		yield* g.srcCall(f, "invoke", live(invokers));
	} else {
		yield* g.srcCall(f, "fail_invoke");
	}
	return f.dot;
}, true);

// /obj/effect/rune/proc/attack_animal  (code/game/gamemodes/cult/runes.dm:78)  may sleep
rt.def("/obj/effect/rune/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!(truthy((rt.istype(live(M), T("/mob/living/simple_animal/shade")) ? 1 : 0)) || truthy((rt.istype(live(M), T("/mob/living/simple_animal/hostile/construct")) ? 1 : 0)))) return f.dot;
	if ((truthy(rt.sv(f, "construct_invoke")) || !truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)]))))) {
		yield* g.srcCall(f, "attack_hand", live(M));
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You are unable to invoke the rune!</span>"]);
	}
	return f.dot;
}, true);

// /obj/effect/rune/proc/talismanhide  (code/game/gamemodes/cult/runes.dm:85)
rt.def("/obj/effect/rune/proc/talismanhide", function talismanhide(f: Frame) {
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>＀ fades away.</span>", [live(f.src)])]);
	rt.setSv(f, "invisibility", 60);
	rt.setSv(f, "alpha", 100);
	return f.dot;
});

// /obj/effect/rune/proc/talismanreveal  (code/game/gamemodes/cult/runes.dm:91)
rt.def("/obj/effect/rune/proc/talismanreveal", function talismanreveal(f: Frame) {
	rt.setSv(f, "invisibility", 0);
	rt.callSrc(f, "visible_message", [fmt("<span class='danger'>＀ suddenly appears!</span>", [live(f.src)])]);
	rt.setSv(f, "alpha", rt.initial(f, live(f.src), "alpha"));
	return f.dot;
});

// /obj/effect/rune/proc/can_invoke  (code/game/gamemodes/cult/runes.dm:106)
rt.def("/obj/effect/rune/proc/can_invoke", function can_invoke(f: Frame, user: Value) {
	let invokers: Value = null, chanters: Value = null, L: Value = null, H: Value = null, i: Value = null, L_3: Value = null;
	let $e: any;
	f.vars = () => [user, invokers, chanters, L, H, i, L_3, $e];
	if (live(user) === null) {
		user = null;
	}
	invokers = rt.list();
	chanters = rt.list();
	if (truthy(live(user))) {
		chanters = rt.modify(live(chanters), live(user), add);
		invokers = rt.modify(live(invokers), live(user), add);
	}
	if ((rt.gt(rt.sv(f, "req_cultists"), 1) || truthy(rt.sv(f, "allow_excess_invokers")))) {
		L = null;
		rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [1, live(f.src)]), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if (truthy(rt.call(f, P("/proc/iscultist"), null, [live(L)]))) {
				if (isEqual(live(L), live(user))) {
					continue;
				}
				if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
					if ((truthy(rt.bitAnd(rt.gv(f, "disabilities", (H = live(L))), 2)) || truthy(rt.fv(f, "silent", live(H))))) {
						continue;
					}
				}
				if (truthy(rt.fv(f, "stat", live(L)))) {
					continue;
				}
				invokers = rt.modify(live(invokers), live(L), add);
			}
		}
		rt.endFor(f, 0);
		if (rt.ge(rt.len(f, live(invokers)), rt.sv(f, "req_cultists"))) {
			(invokers = rt.modify(live(invokers), live(user), subtract));
			if (truthy(rt.sv(f, "allow_excess_invokers"))) {
				chanters = rt.modify(live(chanters), live(invokers), add);
			} else {
				rt.call(f, P("/proc/shuffle_inplace"), null, [live(invokers)]);
				i = null;
				rt.forRange(f, 0, 1, rt.sv(f, "req_cultists"), 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					if (truthy((L_3 = rt.call(f, P("/proc/pick_n_take"), null, [live(invokers)])))) {
						chanters = rt.modify(live(chanters), live(L_3), add);
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	return live(chanters);
});

// /obj/effect/rune/proc/invoke  (code/game/gamemodes/cult/runes.dm:137)  may sleep
rt.def("/obj/effect/rune/proc/invoke", function* invoke(f: Frame, invokers: Value) {
	let M: Value = null, L: Value = null;
	let $e: any;
	f.vars = () => [invokers, M, L, $e];
	M = null;
	rt.forList(f, 0, live(invokers));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		L = live(M);
		if (truthy(rt.sv(f, "invocation"))) {
			yield* g.callName(f, live(L), "say", [null, rt.sv(f, "invocation"), "language", T("/datum/language/common")], rt.Args.Named);
		}
		if (truthy(rt.sv(f, "invoke_damage"))) {
			yield* g.callName(f, live(L), "apply_damage", [rt.sv(f, "invoke_damage"), "brute"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='cultitalic'>＀ saps your strength!</span>", [live(f.src)])]);
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "do_invoke_glow");
	return f.dot;
}, true);

// /obj/effect/rune/proc/do_invoke_glow  (code/game/gamemodes/cult/runes.dm:148)  may sleep
rt.def("/obj/effect/rune/proc/do_invoke_glow", function* do_invoke_glow(f: Frame) {
	let oldtransform: Value = null;
	f.vars = () => [oldtransform];
	oldtransform = rt.sv(f, "transform");
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", multiply((yield* g.call(f, P("/proc/matrix"), null, [])), 2), "alpha", 0, "time", 5]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "transform", live(oldtransform), "alpha", 255, "time", 0]);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/rune/proc/fail_invoke  (code/game/gamemodes/cult/runes.dm:155)  may sleep
rt.def("/obj/effect/rune/proc/fail_invoke", function* fail_invoke(f: Frame) {
	let oldcolor: Value = null;
	f.vars = () => [oldcolor];
	yield* g.srcCall(f, "visible_message", "<span class='warning'>The markings pulse with a small flash of red light, then fall dark.</span>");
	oldcolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#ff0000");
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 5]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 5]);
	return f.dot;
}, true);

rt.type(11426, "/obj/effect/rune/malformed", "/obj/effect/rune", {
	cultist_name: "malformed rune",
	cultist_desc: "a senseless rune written in gibberish. No good can come from invoking this.",
	invocation: "Ra'sha yoka!",
	invoke_damage: 30,
});

// /obj/effect/rune/malformed/proc/Initialize  (code/game/gamemodes/cult/runes.dm:169)
rt.def("/obj/effect/rune/malformed/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀", [rt.call(f, P("/proc/rand"), null, [1, 7])]));
	rt.setSv(f, "color", rt.op(f, "Rgb", [1, 3], [rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255]), rt.call(f, P("/proc/rand"), null, [0, 255])]));
	return f.dot;
}, false, { args: ["mapload", "set_keyword"] });

// /obj/effect/rune/malformed/proc/invoke  (code/game/gamemodes/cult/runes.dm:174)  may sleep
rt.def("/obj/effect/rune/malformed/proc/invoke", function* invoke(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["invokers"] });

// /mob/proc/null_rod_check  (code/game/gamemodes/cult/runes.dm:178)
rt.def("/mob/proc/null_rod_check", function null_rod_check(f: Frame) {
	let N: Value = null;
	f.vars = () => [N];
	if ((truthy((N = rt.locateIn(f, T("/obj/item/weapon/nullrod"), live(f.src)))) && !truthy(rt.gl("ratvar_awakens")))) {
		return live(N);
	}
	return 0;
});

// /mob/proc/bible_check  (code/game/gamemodes/cult/runes.dm:184)
rt.def("/mob/proc/bible_check", function bible_check(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy(rt.callSrc(f, "is_holding", [(B = rt.locateIn(f, T("/obj/item/weapon/storage/book/bible"), live(f.src)))]))) {
		return live(B);
	}
	return 0;
});

rt.type(11427, "/obj/effect/rune/imbue", "/obj/effect/rune", {
	cultist_name: "Create Talisman",
	cultist_desc: "transforms paper into powerful magic talismans.",
	invocation: "H'drak v'loso, mir'kanas verbot!",
	icon_state: "3",
	color: "#0000FF",
});

// /obj/effect/rune/imbue/proc/invoke  (code/game/gamemodes/cult/runes.dm:198)  may sleep
rt.def("/obj/effect/rune/imbue/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, papers_on_rune: Value = null, entered_talisman_name: Value = null, talisman_type: Value = null, possible_talismans: Value = null, I: Value = null, J: Value = null, talisman_cult_name: Value = null, paper_to_imbue: Value = null;
	let $e: any;
	f.vars = () => [user, papers_on_rune, entered_talisman_name, talisman_type, possible_talismans, I, J, talisman_cult_name, paper_to_imbue, $e];
	user = rt.index(live(f.args[0]), 1);
	papers_on_rune = (yield* g.srcCall(f, "checkpapers"));
	entered_talisman_name = null;
	talisman_type = null;
	possible_talismans = rt.list();
	if (!truthy(rt.len(f, live(papers_on_rune)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>There must be a blank paper on top of ＀!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Talisman Creation rune failed - no blank papers on rune"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "rune_in_use"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>＀ can only support one ritual at a time!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Talisman Creation rune failed - already in use"]);
		return live(f.dot);
	}
	I = null;
	rt.forList(f, 0, subtract(subtract(subtract(subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/paper/talisman")])), T("/obj/item/weapon/paper/talisman")), T("/obj/item/weapon/paper/talisman/malformed")), T("/obj/item/weapon/paper/talisman/supply")), T("/obj/item/weapon/paper/talisman/supply/weak")), T("/obj/item/weapon/paper/talisman/summon_tome")));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		J = live(I);
		if (truthy((talisman_cult_name = rt.initial(f, live(J), "cultist_name")))) {
			rt.setAt(live(possible_talismans), live(talisman_cult_name), live(J));
		}
	}
	rt.endFor(f, 0);
	entered_talisman_name = (yield* g.op(f, "Prompt", [1], [null, "Talisman Choices", "Choose a talisman to imbue.", live(user), live(possible_talismans)]));
	talisman_type = rt.index(live(possible_talismans), live(entered_talisman_name));
	if ((((((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || truthy(rt.sv(f, "rune_in_use"))) || !truthy(live(talisman_type)))) {
		return live(f.dot);
	}
	if (!truthy(rt.getLen(f, (papers_on_rune = (yield* g.srcCall(f, "checkpapers")))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>There must be a blank paper on top of ＀!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Talisman Creation rune failed - no blank papers on rune"]);
		return live(f.dot);
	}
	paper_to_imbue = rt.index(live(papers_on_rune), 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "visible_message", "<span class='warning'>Dark power begins to channel into the paper!</span>");
	rt.setSv(f, "rune_in_use", 1);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.initial(f, live(talisman_type), "creation_time"), "target", live(paper_to_imbue)], rt.Args.Named)))) {
		yield* g.new_(f, live(talisman_type), [rt.getStep(f, live(f.src), 0)]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ glows with power, and bloody images form themselves on ＀.</span>", [live(f.src), live(paper_to_imbue)]));
		yield* g.call(f, P("/proc/qdel"), null, [live(paper_to_imbue)]);
	}
	rt.setSv(f, "rune_in_use", 0);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/imbue/proc/checkpapers  (code/game/gamemodes/cult/runes.dm:240)
rt.def("/obj/effect/rune/imbue/proc/checkpapers", function checkpapers(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	f.dot = rt.list();
	_P = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/obj/item/weapon/paper"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if ((!truthy(rt.fv(f, "info", live(_P))) && !truthy((rt.istype(live(_P), T("/obj/item/weapon/paper/talisman")) ? 1 : 0)))) {
			(f.dot = rt.modify(live(f.dot), live(_P), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(11428, "/obj/effect/rune/teleport", "/obj/effect/rune", {
	listkey: null,
	cultist_name: "Teleport",
	cultist_desc: "warps everything above it to another chosen teleport rune.",
	invocation: "Sas'so c'arta forbici!",
	req_keyword: 1,
	icon_state: "2",
	color: "#551A8B",
});

// /obj/effect/rune/teleport/proc/Initialize  (code/game/gamemodes/cult/runes.dm:255)
rt.def("/obj/effect/rune/teleport/proc/Initialize", function Initialize(f: Frame) {
	let A: Value = null, locname: Value = null;
	let $0: any;
	f.vars = () => [A, locname, $0];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	A = rt.call(f, P("/proc/get_area"), null, [live(f.src)]);
	locname = rt.initial(f, live(A), "name");
	if (truthy(live(f.args[1]))) {
		$0 = fmt("＀ ＀", [live(f.args[1]), live(locname)]);
	} else {
		$0 = fmt("＀", [live(locname)]);
	}
	rt.setSv(f, "listkey", $0);
	rt.modGl("teleport_runes", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload", "set_keyword"] });

// /obj/effect/rune/teleport/proc/Destroy  (code/game/gamemodes/cult/runes.dm:262)  may sleep
rt.def("/obj/effect/rune/teleport/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("teleport_runes", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/rune/teleport/proc/invoke  (code/game/gamemodes/cult/runes.dm:266)  may sleep
rt.def("/obj/effect/rune/teleport/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, potential_runes: Value = null, teleportnames: Value = null, R: Value = null, _T: Value = null, input_rune_key: Value = null, actual_selected_rune: Value = null, _T_5: Value = null, target: Value = null, movedsomething: Value = null, moveuserlater: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, potential_runes, teleportnames, R, _T, input_rune_key, actual_selected_rune, _T_5, target, movedsomething, moveuserlater, A, $0, $1, $e];
	user = rt.index(live(f.args[0]), 1);
	potential_runes = rt.list();
	teleportnames = rt.list();
	R = null;
	rt.forList(f, 0, rt.gl("teleport_runes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((!isEqual((_T = live(R)), live(f.src)) && rt.le(rt.fv(f, "z", live(_T)), 12))) {
			rt.setAt(live(potential_runes), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "listkey", live(_T)), live(teleportnames)])), live(_T));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(potential_runes)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There are no valid runes to teleport to!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Teleport rune failed - no other teleport runes"]);
		yield* g.srcCall(f, "fail_invoke");
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "z", live(user)), 12)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>You are not in the right dimension!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Teleport rune failed - user in away mission"]);
		yield* g.srcCall(f, "fail_invoke");
		return live(f.dot);
	}
	input_rune_key = (yield* g.op(f, "Prompt", [1], [null, "Rune to Teleport to", "Choose a rune to teleport to.", live(user), live(potential_runes)]));
	actual_selected_rune = rt.index(live(potential_runes), live(input_rune_key));
	if (((((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || truthy((yield* g.callName(f, live(user), "incapacitated", [])))) || !truthy(live(actual_selected_rune)))) {
		yield* g.srcCall(f, "fail_invoke");
		return live(f.dot);
	}
	_T_5 = rt.getStep(f, live(f.src), 0);
	if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [(target = rt.getStep(f, live(actual_selected_rune), 0)), 1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The target rune is blocked. Attempting to teleport to it would be massively unwise.</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		return live(f.dot);
	}
	movedsomething = 0;
	moveuserlater = 0;
	A = null;
	rt.forList(f, 0, live(_T_5), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(live(A), live(user))) {
			moveuserlater = 1;
			movedsomething = 1;
			continue;
		}
		if (!truthy(rt.fv(f, "anchored", live(A)))) {
			movedsomething = 1;
			yield* g.callName(f, live(A), "forceMove", [live(target)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(live(movedsomething))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.srcCall(f, "visible_message", "<span class='warning'>There is a sharp crack of inrushing air, and everything above the rune disappears!</span>", null, "<i>You hear a sharp crack.</i>");
		$0 = live(user);
		if (truthy(live(moveuserlater))) {
			$1 = "r vision blurs, and you suddenly appear somewhere else";
		} else {
			$1 = " send everything above the rune away";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='cult'>You＀.</span>", [$1])]);
		if (truthy(live(moveuserlater))) {
			yield* g.callName(f, live(user), "forceMove", [live(target)]);
		}
		yield* g.callName(f, live(target), "visible_message", ["<span class='warning'>There is a boom of outrushing air as something appears above the rune!</span>", null, "<i>You hear a boom.</i>"]);
	} else {
		yield* g.srcCall(f, "fail_invoke");
	}
	return f.dot;
}, true, { args: ["invokers"] });

rt.type(11429, "/obj/effect/rune/convert", "/obj/effect/rune", {
	cultist_name: "Offer",
	cultist_desc: "offers a noncultist above it to Nar-Sie, either converting them or sacrificing them.",
	req_cultists_text: "2 for conversion, 3 for living sacrifices and sacrifice targets.",
	invocation: "Mah'weyh pleggh at e'ntrath!",
	req_cultists: 1,
	allow_excess_invokers: 1,
	rune_in_use: 0,
	icon_state: "3",
	color: "#FFFFFF",
});

// /obj/effect/rune/convert/proc/invoke  (code/game/gamemodes/cult/runes.dm:337)  may sleep
rt.def("/obj/effect/rune/convert/proc/invoke", function* invoke(f: Frame) {
	let myriad_targets: Value = null, _T: Value = null, M: Value = null, oldcolor: Value = null, L: Value = null, is_clock: Value = null, is_convertable: Value = null;
	let $e: any;
	f.vars = () => [myriad_targets, _T, M, oldcolor, L, is_clock, is_convertable, $e];
	if (truthy(rt.sv(f, "rune_in_use"))) {
		return live(f.dot);
	}
	myriad_targets = rt.list();
	_T = rt.getStep(f, live(f.src), 0);
	M = null;
	rt.forList(f, 0, live(_T), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)])))) {
			(myriad_targets = rt.modify(live(myriad_targets), live(M), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(myriad_targets)))) {
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Offer rune failed - no eligible targets"]);
		return live(f.dot);
	}
	rt.setSv(f, "rune_in_use", 1);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ pulses blood red!</span>", [live(f.src)]));
	oldcolor = rt.sv(f, "color");
	rt.setSv(f, "color", "#7D1717");
	L = rt.op(f, "PickUnweighted", [1], [live(myriad_targets)]);
	is_clock = (yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]));
	is_convertable = (yield* g.call(f, P("/proc/is_convertable_to_cult"), null, [live(L)]));
	if ((!isEqual(rt.fv(f, "stat", live(L)), 2) && (truthy(live(is_clock)) || truthy(live(is_convertable))))) {
		rt.setSv(f, "invocation", "Mah'weyh pleggh at e'ntrath!");
		yield* g.callSuper(f, [], rt.Args.Same);
		if (truthy(live(is_clock))) {
			yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀'s eyes glow a defiant yellow!</span>", [live(L)]), "<span class='cultlarge'>\"Stop resisting. You <i>will</i> be mi-\"</span>\n<span class='large_brass'>\"Give up and you will feel pain unlike anything you've ever felt!\"</span>"]);
			yield* g.callName(f, live(L), "Knockdown", [80]);
		} else {
			if (truthy(live(is_convertable))) {
				yield* g.srcCall(f, "do_convert", live(L), live(f.args[0]));
			}
		}
	} else {
		rt.setSv(f, "invocation", "Barhah hra zar'garis!");
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.srcCall(f, "do_sacrifice", live(L), live(f.args[0]));
	}
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", live(oldcolor), "time", 5]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/atom/proc/update_atom_colour")])), 5]);
	rt.setSv(f, "rune_in_use", 0);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/convert/proc/do_convert  (code/game/gamemodes/cult/runes.dm:372)  may sleep
rt.def("/obj/effect/rune/convert/proc/do_convert", function* do_convert(f: Frame, convertee: Value, invokers: Value) {
	let M: Value = null, brutedamage: Value = null, burndamage: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [convertee, invokers, M, brutedamage, burndamage, $0, $1, $2, $e];
	if (rt.lt(rt.len(f, live(invokers)), 2)) {
		M = null;
		rt.forList(f, 0, live(invokers));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>You need more invokers to convert ＀!</span>", [live(convertee)])]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/log_game"), null, ["Offer rune failed - tried conversion with one invoker"]);
		return 0;
	}
	if (truthy((yield* g.callName(f, live(convertee), "null_rod_check", [])))) {
		M = null;
		rt.forList(f, 0, live(invokers));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='warning'>Something is shielding ＀'s mind!</span>", [live(convertee)])]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/log_game"), null, ["Offer rune failed - convertee had null rod"]);
		return 0;
	}
	brutedamage = (yield* g.callName(f, live(convertee), "getBruteLoss", []));
	burndamage = (yield* g.callName(f, live(convertee), "getFireLoss", []));
	if ((truthy(live(brutedamage)) || truthy(live(burndamage)))) {
		yield* g.callName(f, live(convertee), "adjustBruteLoss", [rt.neg(multiply(live(brutedamage), 0.75))]);
		yield* g.callName(f, live(convertee), "adjustFireLoss", [rt.neg(multiply(live(burndamage), 0.75))]);
	}
	$0 = live(convertee);
	$1 = live(convertee);
	if ((truthy(live(brutedamage)) || truthy(live(burndamage)))) {
		$2 = fmt("even as ＀ wounds heal and close", [(yield* g.callName(f, live(convertee), "p_their", []))]);
	} else {
		$2 = fmt("as the markings below ＀ glow a bloody red", [(yield* g.callName(f, live(convertee), "p_them", []))]);
	}
	yield* g.callName(f, $0, "visible_message", [fmt("<span class='warning'>＀ writhes in pain ＀!</span>", [$1, $2]), "<span class='cultlarge'><i>AAAAAAAAAAAAAA-</i></span>"]);
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [rt.fv(f, "mind", live(convertee)), 1]);
	yield* g.new_(f, T("/obj/item/weapon/tome"), [rt.getStep(f, live(f.src), 0)]);
	rt.setFv(f, "special_role", rt.fv(f, "mind", live(convertee)), "Cultist");
	yield* g.call(f, P("/proc/to_chat"), null, [live(convertee), "<span class='cultitalic'><b>Your blood pulses. Your head throbs. The world goes red. All at once you are aware of a horrible, horrible, truth. The veil of reality has been ripped away and something evil takes root.</b></span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(convertee), "<span class='cultitalic'><b>Assist your new compatriots in their dark dealings. Your goal is theirs, and theirs is yours. You serve the Geometer above all else. Bring it back.</b></span>"]);
	return 1;
}, true);

// /obj/effect/rune/convert/proc/do_sacrifice  (code/game/gamemodes/cult/runes.dm:401)  may sleep
rt.def("/obj/effect/rune/convert/proc/do_sacrifice", function* do_sacrifice(f: Frame, sacrificial: Value, invokers: Value) {
	let big_sac: Value = null, M: Value = null, stone: Value = null;
	let $e: any;
	f.vars = () => [sacrificial, invokers, big_sac, M, stone, $e];
	big_sac = 0;
	if (((((truthy((rt.istype(live(sacrificial), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(sacrificial), T("/mob/living/silicon/robot")) ? 1 : 0))) && !isEqual(rt.fv(f, "stat", live(sacrificial)), 2)) || truthy((yield* g.call(f, P("/proc/is_sacrifice_target"), null, [rt.fv(f, "mind", live(sacrificial))])))) && rt.lt(rt.len(f, live(invokers)), 3))) {
		M = null;
		rt.forList(f, 0, live(invokers));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='cultitalic'>＀ is too greatly linked to the world! You need three acolytes!</span>", [live(sacrificial)])]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/log_game"), null, ["Offer rune failed - not enough acolytes and target is living or sac target"]);
		return 0;
	}
	if (truthy(rt.fv(f, "mind", live(sacrificial)))) {
		rt.modGl("sacrificed", rt.fv(f, "mind", live(sacrificial)), add);
		if (truthy((yield* g.call(f, P("/proc/is_sacrifice_target"), null, [rt.fv(f, "mind", live(sacrificial))])))) {
			rt.setGl("sac_complete", 1);
			big_sac = 1;
		}
	} else {
		rt.modGl("sacrificed", live(sacrificial), add);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/cult/sac"), [rt.getStep(f, live(f.src), 0)]);
	M = null;
	rt.forList(f, 0, live(invokers));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy(live(big_sac))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='cultlarge'>\"Yes! This is the one I desire! You have done well.\"</span>"]);
		} else {
			if ((truthy((rt.istype(live(sacrificial), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(sacrificial), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='cultlarge'>\"I accept this sacrifice.\"</span>"]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='cultlarge'>\"I accept this meager sacrifice.\"</span>"]);
			}
		}
	}
	rt.endFor(f, 0);
	stone = (yield* g.new_(f, T("/obj/item/device/soulstone"), [rt.getStep(f, live(f.src), 0)]));
	if (truthy(rt.fv(f, "mind", live(sacrificial)))) {
		rt.setFv(f, "invisibility", live(stone), 100);
		yield* g.callName(f, live(stone), "transfer_soul", ["FORCE", live(sacrificial), live(f.usr)]);
		rt.setFv(f, "invisibility", live(stone), 0);
	}
	if (truthy(live(sacrificial))) {
		if (truthy((rt.istype(live(sacrificial), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(sacrificial), rt.rsc("sound/magic/disable_tech.ogg"), 100, 1]);
			yield* g.callName(f, live(sacrificial), "dust", []);
		} else {
			yield* g.call(f, P("/proc/playsound"), null, [live(sacrificial), rt.rsc("sound/magic/disintegrate.ogg"), 100, 1]);
			yield* g.callName(f, live(sacrificial), "gib", []);
		}
	}
	return 1;
}, true);

rt.type(11430, "/obj/effect/rune/narsie", "/obj/effect/rune", {
	used: 0,
	cultist_name: "Summon Nar-Sie",
	cultist_desc: "tears apart dimensional barriers, calling forth the Geometer. Requires 9 invokers.",
	invocation: "TOK-LYR RQA-NAP G'OLT-ULOFT!!",
	req_cultists: 9,
	scribe_delay: 500,
	scribe_damage: 40.1,
	icon: rt.rsc("icons/effects/96x96.dmi"),
	color: "#7D1717",
	icon_state: "rune_large",
	pixel_x: -32,
	pixel_y: -32,
});

// /obj/effect/rune/narsie/proc/Initialize  (code/game/gamemodes/cult/runes.dm:455)
rt.def("/obj/effect/rune/narsie/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	(rt.modGl("poi_list", live(f.src), rt.bitOr));
	return f.dot;
}, false, { args: ["mapload", "set_keyword"] });

// /obj/effect/rune/narsie/proc/Destroy  (code/game/gamemodes/cult/runes.dm:459)  may sleep
rt.def("/obj/effect/rune/narsie/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("poi_list", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/effect/rune/narsie/proc/invoke  (code/game/gamemodes/cult/runes.dm:468)  may sleep
rt.def("/obj/effect/rune/narsie/proc/invoke", function* invoke(f: Frame) {
	let M: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [M, _T, $e];
	if (truthy(rt.sv(f, "used"))) {
		return live(f.dot);
	}
	if (!isEqual(rt.sv(f, "z"), 2)) {
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/singularity/narsie"), rt.gl("poi_list")))) {
		M = null;
		rt.forList(f, 0, live(f.args[0]));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>Nar-Sie is already on this plane!</span>"]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/log_game"), null, ["Summon Nar-Sie rune failed - already summoned"]);
		return live(f.dot);
	}
	rt.setSv(f, "used", 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/send_to_playing_players"), null, [rt.rsc("sound/effects/dimensional_rend.ogg")]);
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.call(f, P("/proc/sleep"), null, [40]);
	if (truthy(live(f.src))) {
		rt.setSv(f, "color", "#FF0000");
	}
	rt.setFv(f, "eldergod", rt.fv(f, "mode", rt.gl("SSticker")), 0);
	yield* g.new_(f, T("/obj/singularity/narsie/large/cult"), [live(_T)]);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/narsie/proc/attackby  (code/game/gamemodes/cult/runes.dm:488)  may sleep
rt.def("/obj/effect/rune/narsie/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/tome")) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(f.args[1])]))))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ begins erasing the ＀...</span>", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You begin erasing the ＀...</span>", [live(f.src)])]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 50, "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/log_game"), null, [fmt("Summon Narsie rune erased by ＀ (ckey) with a tome", [rt.gv(f, "key", rt.fv(f, "mind", live(f.args[1])))])]);
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ erased a Narsie rune with a tome", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])]))])]);
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	} else {
		if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/nullrod")) ? 1 : 0))) return f.dot;
		yield* g.call(f, P("/proc/log_game"), null, [fmt("Summon Narsie rune erased by ＀ (ckey) using a null rod", [rt.gv(f, "key", rt.fv(f, "mind", live(f.args[1])))])]);
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ erased a Narsie rune with a null rod", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[1])]))])]);
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(11431, "/obj/effect/rune/raise_dead", "/obj/effect/rune", {
	cultist_name: "Resurrect Cultist",
	cultist_desc: "requires the corpse of a cultist placed upon the rune. Provided there have been sufficient sacrifices, they will be revived.",
	invocation: "Pasnar val'keriam usinar. Savrae ines amutan. Yam'toth remium il'tarat!",
	icon_state: "1",
	color: "#C80000",
}, { global: { revives_used: 778 } });

// /obj/effect/rune/raise_dead/proc/examine  (code/game/gamemodes/cult/runes.dm:510)
rt.def("/obj/effect/rune/raise_dead/proc/examine", function examine(f: Frame) {
	let revive_number: Value = null;
	f.vars = () => [revive_number];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/iscultist"), null, [live(f.args[0])])) || isEqual(rt.fv(f, "stat", live(f.args[0])), 2))) return f.dot;
	revive_number = subtract(rt.length(rt.gl("sacrificed")), rt.gl("revives_used"));
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<b>Revives Remaining:</b> ＀", [live(revive_number)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/rune/raise_dead/proc/invoke  (code/game/gamemodes/cult/runes.dm:516)  may sleep
rt.def("/obj/effect/rune/raise_dead/proc/invoke", function* invoke(f: Frame) {
	let _T: Value = null, mob_to_revive: Value = null, potential_revive_mobs: Value = null, user: Value = null, M: Value = null;
	let $e: any;
	f.vars = () => [_T, mob_to_revive, potential_revive_mobs, user, M, $e];
	_T = rt.getStep(f, live(f.src), 0);
	mob_to_revive = null;
	potential_revive_mobs = rt.list();
	user = rt.index(live(f.args[0]), 1);
	if (truthy(rt.sv(f, "rune_in_use"))) {
		return live(f.dot);
	}
	rt.setSv(f, "rune_in_use", 1);
	M = null;
	rt.forList(f, 0, rt.fv(f, "contents", live(_T)), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)]))) && isEqual(rt.fv(f, "stat", live(M)), 2))) {
			(potential_revive_mobs = rt.modify(live(potential_revive_mobs), live(M), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(potential_revive_mobs)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>There are no dead cultists on the rune!</span>"]);
		yield* g.call(f, P("/proc/log_game"), null, ["Raise Dead rune failed - no corpses to revive"]);
		yield* g.srcCall(f, "fail_invoke");
		rt.setSv(f, "rune_in_use", 0);
		return live(f.dot);
	}
	if (rt.le(rt.length(rt.gl("sacrificed")), rt.gl("revives_used"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You have sacrificed too few people to revive a cultist!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		rt.setSv(f, "rune_in_use", 0);
		return live(f.dot);
	}
	if (rt.gt(rt.len(f, live(potential_revive_mobs)), 1)) {
		mob_to_revive = (yield* g.op(f, "Prompt", [1], [null, "Cultist to Revive", "Choose a cultist to revive.", live(user), live(potential_revive_mobs)]));
	} else {
		mob_to_revive = rt.index(live(potential_revive_mobs), 1);
	}
	if ((((!truthy(live(f.src)) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || truthy(rt.sv(f, "rune_in_use"))) || !truthy((yield* g.srcCall(f, "validness_checks", live(mob_to_revive), live(user)))))) {
		rt.setSv(f, "rune_in_use", 0);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "name", live(user)), "Herbert West")) {
		rt.setSv(f, "invocation", "To life, to life, I bring them!");
	} else {
		rt.setSv(f, "invocation", rt.initial(f, live(f.src), "invocation"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.incGl("revives_used", 1, true);
	yield* g.callName(f, live(mob_to_revive), "revive", [1, 1]);
	yield* g.callName(f, live(mob_to_revive), "grab_ghost", []);
	yield* g.call(f, P("/proc/to_chat"), null, [live(mob_to_revive), "<span class='cultlarge'>\"PASNAR SAVRAE YAM'TOTH. Arise.\"</span>"]);
	yield* g.callName(f, live(mob_to_revive), "visible_message", [fmt("<span class='warning'>＀ draws in a huge breath, red light shining from ＀ eyes.</span>", [live(mob_to_revive), (yield* g.callName(f, live(mob_to_revive), "p_their", []))]), "<span class='cultlarge'>You awaken suddenly from the void. You're alive!</span>"]);
	rt.setSv(f, "rune_in_use", 0);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/raise_dead/proc/validness_checks  (code/game/gamemodes/cult/runes.dm:558)  may sleep
rt.def("/obj/effect/rune/raise_dead/proc/validness_checks", function* validness_checks(f: Frame, target_mob: Value, user: Value) {
	let _T: Value = null, ghost: Value = null;
	f.vars = () => [target_mob, user, _T, ghost];
	_T = rt.getStep(f, live(f.src), 0);
	if ((!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user))))) {
		return 0;
	}
	if ((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return 0;
	}
	if ((!truthy(live(target_mob)) || truthy(rt.fv(f, "gc_destroyed", live(target_mob))))) {
		yield* g.srcCall(f, "fail_invoke");
		return 0;
	}
	if (!truthy((rt.isIn(f, live(target_mob), rt.fv(f, "contents", live(_T))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>The cultist to revive has been moved!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Raise Dead rune failed - revival target moved"]);
		return 0;
	}
	if ((!truthy((ghost = (yield* g.callName(f, live(target_mob), "get_ghost", [1])))) && (!truthy(rt.fv(f, "mind", live(target_mob))) || !truthy(rt.gv(f, "active", rt.fv(f, "mind", live(target_mob))))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>The corpse to revive has no spirit!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Raise Dead rune failed - revival target has no ghost"]);
		return 0;
	}
	if ((!truthy(rt.len(f, rt.gl("sacrificed"))) || rt.le(rt.len(f, rt.gl("sacrificed")), rt.gl("revives_used")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You have sacrificed too few people to revive a cultist!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Raise Dead rune failed - too few sacrificed"]);
		return 0;
	}
	return 1;
}, true);

// /obj/effect/rune/raise_dead/proc/fail_invoke  (code/game/gamemodes/cult/runes.dm:585)  may sleep
rt.def("/obj/effect/rune/raise_dead/proc/fail_invoke", function* fail_invoke(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(M)]))) && isEqual(rt.fv(f, "stat", live(M)), 2))) {
			yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ twitches.</span>", [live(M)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11432, "/obj/effect/rune/emp", "/obj/effect/rune", {
	cultist_name: "Electromagnetic Disruption",
	cultist_desc: "emits a large electromagnetic pulse, increasing in size for each cultist invoking it, hindering electronics and disabling silicons.",
	invocation: "Ta'gh fara'qha fel d'amar det!",
	allow_excess_invokers: 1,
	icon_state: "5",
	color: "#4D94FF",
});

// /obj/effect/rune/emp/proc/invoke  (code/game/gamemodes/cult/runes.dm:601)  may sleep
rt.def("/obj/effect/rune/emp/proc/invoke", function* invoke(f: Frame) {
	let E: Value = null, M: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [E, M, L, $0, $e];
	E = rt.getStep(f, live(f.src), 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ glows blue for a moment before vanishing.</span>", [live(f.src)]));
	$0 = rt.len(f, live(f.args[0]));
	if (rt.inRange($0, 1, 2)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(E), rt.rsc("sound/items/welder2.ogg"), 25, 1]);
		M = null;
		rt.forList(f, 0, live(f.args[0]));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='warning'>You feel a minute vibration pass through you...</span>"]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 3, 6)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(E), rt.rsc("sound/magic/disable_tech.ogg"), 50, 1]);
		M = null;
		rt.forList(f, 0, live(f.args[0]));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>Your hair stands on end as a shockwave emanates from the rune!</span>"]);
		}
		rt.endFor(f, 0);
	} else if (rt.inRange($0, 7, 9.999999848243207e+30)) {
		yield* g.call(f, P("/proc/playsound"), null, [live(E), rt.rsc("sound/magic/disable_tech.ogg"), 100, 1]);
		M = null;
		rt.forList(f, 0, live(f.args[0]));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			yield* g.call(f, P("/proc/to_chat"), null, [(L = live(M)), "<span class='userdanger'>You chant in unison and a colossal burst of energy knocks you backward!</span>"]);
			yield* g.callName(f, live(L), "Knockdown", [40]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.call(f, P("/proc/empulse"), null, [live(E), multiply(9, rt.len(f, live(f.args[0]))), multiply(12, rt.len(f, live(f.args[0])))]);
	return f.dot;
}, true, { args: ["invokers"] });

rt.type(11433, "/obj/effect/rune/spirit", "/obj/effect/rune", {
	affecting: null,
	cultist_name: "Spirit Sight",
	cultist_desc: "severs the link between one's spirit and body. This effect is taxing and one's physical body will take damage while this is active.",
	invocation: "Fwe'sh mah erl nyag r'ya!",
	rune_in_use: 0,
	construct_invoke: 0,
	icon_state: "7",
	color: "#7D1717",
});

// /obj/effect/rune/spirit/proc/Destroy  (code/game/gamemodes/cult/runes.dm:635)  may sleep
rt.def("/obj/effect/rune/spirit/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "affecting", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/rune/spirit/proc/examine  (code/game/gamemodes/cult/runes.dm:638)
rt.def("/obj/effect/rune/spirit/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "affecting"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>A translucent field encases ＀ above the rune!</span>", [rt.sv(f, "affecting")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/rune/spirit/proc/can_invoke  (code/game/gamemodes/cult/runes.dm:644)
rt.def("/obj/effect/rune/spirit/proc/can_invoke", function can_invoke(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.sv(f, "rune_in_use"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>＀ cannot support more than one body!</span>", [live(f.src)])]);
		rt.call(f, P("/proc/log_game"), null, ["Spirit Sight rune failed - more than one user"]);
		return rt.list();
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (!truthy((rt.isIn(f, live(f.args[0]), live(_T)) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>You must be standing on top of ＀!</span>", [live(f.src)])]);
		rt.call(f, P("/proc/log_game"), null, ["Spirit Sight rune failed - user not standing on rune"]);
		return rt.list();
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["user"] });

// /obj/effect/rune/spirit/proc/invoke  (code/game/gamemodes/cult/runes.dm:655)  may sleep
rt.def("/obj/effect/rune/spirit/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, _T: Value = null, G: Value = null;
	f.vars = () => [user, _T, G];
	user = rt.index(live(f.args[0]), 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	_T = rt.getStep(f, live(f.src), 0);
	rt.setSv(f, "rune_in_use", 1);
	rt.setSv(f, "affecting", live(user));
	yield* g.callName(f, rt.sv(f, "affecting"), "add_atom_colour", ["#7D1717", 1]);
	yield* g.callName(f, rt.sv(f, "affecting"), "visible_message", [fmt("<span class='warning'>＀ freezes statue-still, glowing an unearthly red.</span>", [rt.sv(f, "affecting")]), "<span class='cult'>You see what lies beyond. All is revealed. While this is a wondrous experience, your physical form will waste away in this state. Hurry...</span>"]);
	yield* g.callName(f, rt.sv(f, "affecting"), "ghostize", [1]);
	while (!(!truthy(rt.sv(f, "affecting")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "affecting"))))) {
		yield* g.callName(f, rt.sv(f, "affecting"), "apply_damage", [0.10000000149011612, "brute"]);
		if (!truthy((rt.isIn(f, rt.sv(f, "affecting"), live(_T)) ? 1 : 0))) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>A spectral tendril wraps around ＀ and pulls ＀ back to the rune!</span>", [rt.sv(f, "affecting"), (yield* g.callName(f, rt.sv(f, "affecting"), "p_them", []))])]);
			yield* g.callSrc(f, "Beam", [null, rt.sv(f, "affecting"), "icon_state", "drainbeam", "time", 2], rt.Args.Named);
			yield* g.callName(f, rt.sv(f, "affecting"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		if (truthy(rt.fv(f, "key", rt.sv(f, "affecting")))) {
			yield* g.callName(f, rt.sv(f, "affecting"), "visible_message", [fmt("<span class='warning'>＀ slowly relaxes, the glow around ＀ dimming.</span>", [rt.sv(f, "affecting"), (yield* g.callName(f, rt.sv(f, "affecting"), "p_them", []))]), fmt("<span class='danger'>You are re-united with your physical form. ＀ releases its hold over you.</span>", [live(f.src)])]);
			yield* g.callName(f, rt.sv(f, "affecting"), "remove_atom_colour", [1, "#7D1717"]);
			yield* g.callName(f, rt.sv(f, "affecting"), "Knockdown", [60]);
			break;
		}
		if (isEqual(rt.fv(f, "stat", rt.sv(f, "affecting")), 1)) {
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				yield* g.call(f, P("/proc/to_chat"), null, [(G = (yield* g.callName(f, rt.sv(f, "affecting"), "get_ghost", []))), "<span class='cultitalic'>You feel the link between you and your body weakening... you must hurry!</span>"]);
			}
		} else {
			if (isEqual(rt.fv(f, "stat", rt.sv(f, "affecting")), 2)) {
				yield* g.callName(f, rt.sv(f, "affecting"), "remove_atom_colour", [1, "#7D1717"]);
				yield* g.call(f, P("/proc/to_chat"), null, [(G = (yield* g.callName(f, rt.sv(f, "affecting"), "get_ghost", []))), fmt("<span class='cultitalic'><b>You suddenly feel your physical form pass on. ＀'s exertion has killed you!</b></span>", [live(f.src)])]);
				break;
			}
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.setSv(f, "affecting", null);
	rt.setSv(f, "rune_in_use", 0);
	return f.dot;
}, true, { args: ["invokers"] });

rt.type(11434, "/obj/effect/rune/wall", "/obj/effect/rune", {
	density_timer: null,
	recharging: 0,
	cultist_name: "Form Barrier",
	cultist_desc: "when invoked, makes a temporary invisible wall to block passage. Can be invoked again to reverse this.",
	invocation: "Khari'd! Eske'te tannin!",
	CanAtmosPass: -2,
	icon_state: "1",
	color: "#C80000",
});

// /obj/effect/rune/wall/proc/Initialize  (code/game/gamemodes/cult/runes.dm:701)
rt.def("/obj/effect/rune/wall/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.modGl("wall_runes", live(f.src), add);
	return f.dot;
}, false, { args: ["mapload", "set_keyword"] });

// /obj/effect/rune/wall/proc/examine  (code/game/gamemodes/cult/runes.dm:705)
rt.def("/obj/effect/rune/wall/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "density"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>There is a barely perceptible shimmering of the air above ＀.</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/effect/rune/wall/proc/Destroy  (code/game/gamemodes/cult/runes.dm:711)  may sleep
rt.def("/obj/effect/rune/wall/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "density", 0);
	(rt.modGl("wall_runes", live(f.src), subtract));
	yield* g.srcCall(f, "air_update_turf", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/rune/wall/proc/invoke  (code/game/gamemodes/cult/runes.dm:721)  may sleep
rt.def("/obj/effect/rune/wall/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, carbon_user: Value = null, C: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [user, carbon_user, C, $0, $1, $2, $3, $4];
	if (truthy(rt.sv(f, "recharging"))) {
		return live(f.dot);
	}
	user = rt.index(live(f.args[0]), 1);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "density", (!truthy(rt.sv(f, "density")) ? 1 : 0));
	yield* g.srcCall(f, "update_state");
	if (truthy(rt.sv(f, "density"))) {
		yield* g.srcCall(f, "spread_density");
	}
	carbon_user = (rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0);
	$0 = live(user);
	$1 = live(user);
	if (truthy(live(carbon_user))) {
		$1 = $1;
		$2 = fmt("places ＀ hands on", [(yield* g.callName(f, live(user), "p_their", []))]);
	} else {
		$2 = "stares intently at";
	}
	$3 = live(f.src);
	if (truthy(rt.sv(f, "density"))) {
		$4 = "the air above it begins to shimmer";
	} else {
		$4 = "the shimmer above it fades";
	}
	$1 = fmt("<span class='warning'>＀ ＀ ＀, and ＀.</span>", [$1, $2, $3, $4]);
	if (truthy(live(carbon_user))) {
		$2 = "your life ";
	} else {
		$2 = "";
	}
	$3 = live(f.src);
	if (truthy(rt.sv(f, "density"))) {
		$4 = "temporarily preventing";
	} else {
		$4 = "allowing";
	}
	yield* g.callName(f, $0, "visible_message", [$1, fmt("<span class='cultitalic'>You channel ＀energy into ＀, ＀ passage above it.</span>", [$2, $3, $4])]);
	if (!truthy(live(carbon_user))) return f.dot;
	yield* g.callName(f, (C = live(user)), "apply_damage", [2, "brute", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/wall/proc/spread_density  (code/game/gamemodes/cult/runes.dm:735)  may sleep
rt.def("/obj/effect/rune/wall/proc/spread_density", function* spread_density(f: Frame) {
	let R: Value = null, W: Value = null;
	let $e: any;
	f.vars = () => [R, W, $e];
	R = null;
	rt.forList(f, 0, rt.gl("wall_runes"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		if ((((isEqual(rt.gv(f, "z", (W = live(R))), rt.sv(f, "z")) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(W)])), 2)) && !truthy(rt.fv(f, "density", live(W)))) && !truthy(rt.fv(f, "recharging", live(W))))) {
			rt.setFv(f, "density", live(W), 1);
			yield* g.callName(f, live(W), "update_state", []);
			yield* g.callName(f, live(W), "spread_density", []);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "density_timer", (yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/rune/wall/proc/lose_density")])), 900, 8])));
	return f.dot;
}, true);

// /obj/effect/rune/wall/proc/lose_density  (code/game/gamemodes/cult/runes.dm:747)  may sleep
rt.def("/obj/effect/rune/wall/proc/lose_density", function* lose_density(f: Frame) {
	let oldcolor: Value = null;
	f.vars = () => [oldcolor];
	if (!truthy(rt.sv(f, "density"))) return f.dot;
	rt.setSv(f, "recharging", 1);
	rt.setSv(f, "density", 0);
	yield* g.srcCall(f, "update_state");
	oldcolor = rt.sv(f, "color");
	yield* g.srcCall(f, "add_atom_colour", "#696969", 4);
	rt.op(f, "Animate", [2, 8], [null, live(f.src), "color", live(oldcolor), "time", 50, "easing", 64]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/rune/wall/proc/recharge")])), 50]);
	return f.dot;
}, true);

// /obj/effect/rune/wall/proc/recharge  (code/game/gamemodes/cult/runes.dm:755)
rt.def("/obj/effect/rune/wall/proc/recharge", function recharge(f: Frame) {
	rt.setSv(f, "recharging", 0);
	rt.callSrc(f, "add_atom_colour", ["#C80000", 4]);
	return f.dot;
});

// /obj/effect/rune/wall/proc/update_state  (code/game/gamemodes/cult/runes.dm:758)  may sleep
rt.def("/obj/effect/rune/wall/proc/update_state", function* update_state(f: Frame) {
	let shimmer: Value = null;
	f.vars = () => [shimmer];
	yield* g.call(f, P("/proc/deltimer"), null, [rt.sv(f, "density_timer")]);
	yield* g.srcCall(f, "air_update_turf", 1);
	if (truthy(rt.sv(f, "density"))) {
		(rt.modField(f, (shimmer = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/effects/effects.dmi"), "barriershimmer", 4.099999904632568]))), "appearance_flags", 2, rt.bitOr));
		rt.setFv(f, "alpha", live(shimmer), 60);
		rt.setFv(f, "color", live(shimmer), "#701414");
		yield* g.srcCall(f, "add_overlay", live(shimmer));
		yield* g.srcCall(f, "add_atom_colour", "#FF0000", 4);
	} else {
		yield* g.srcCall(f, "cut_overlays");
		yield* g.srcCall(f, "add_atom_colour", "#C80000", 4);
	}
	return f.dot;
}, true);

rt.type(11435, "/obj/effect/rune/summon", "/obj/effect/rune", {
	cultist_name: "Summon Cultist",
	cultist_desc: "summons a single cultist to the rune. Requires 2 invokers.",
	invocation: "N'ath reth sh'yro eth d'rekkathnor!",
	req_cultists: 2,
	invoke_damage: 10,
	icon_state: "5",
	color: "#00FF00",
});

// /obj/effect/rune/summon/proc/invoke  (code/game/gamemodes/cult/runes.dm:782)  may sleep
rt.def("/obj/effect/rune/summon/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, cultists: Value = null, M: Value = null, cultist_to_summon: Value = null;
	let $e: any;
	f.vars = () => [user, cultists, M, cultist_to_summon, $e];
	user = rt.index(live(f.args[0]), 1);
	cultists = rt.list();
	M = null;
	rt.forList(f, 0, rt.gv(f, "cult", rt.fv(f, "mode", rt.gl("SSticker"))), T("/datum/mind"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (((!truthy((rt.isIn(f, rt.fv(f, "current", live(M)), live(f.args[0])) ? 1 : 0)) && truthy(rt.fv(f, "current", live(M)))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", live(M))), 2))) {
			(cultists = rt.modify(live(cultists), rt.fv(f, "current", live(M)), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	cultist_to_summon = (yield* g.op(f, "Prompt", [1], [null, "Followers of the Geometer", fmt("Who do you wish to call to ＀?", [live(f.src)]), live(user), live(cultists)]));
	if ((((!truthy((yield* g.srcCall(f, "Adjacent", live(user)))) || !truthy(live(f.src))) || (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) || truthy((yield* g.callName(f, live(user), "incapacitated", []))))) {
		return live(f.dot);
	}
	if (!truthy(live(cultist_to_summon))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='cultitalic'>You require a summoning target!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Summon Cultist rune failed - no target"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "stat", live(cultist_to_summon)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>＀ has died!</span>", [live(cultist_to_summon)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Summon Cultist rune failed - target died"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(cultist_to_summon)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>＀ is not a follower of the Geometer!</span>", [live(cultist_to_summon)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Summon Cultist rune failed - target was deconverted"]);
		return live(f.dot);
	}
	if (rt.gt(rt.fv(f, "z", live(cultist_to_summon)), 12)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>＀ is not in our dimension!</span>", [live(cultist_to_summon)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Summon Cultist rune failed - target in away mission"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(cultist_to_summon), "visible_message", [fmt("<span class='warning'>＀ suddenly disappears in a flash of red light!</span>", [live(cultist_to_summon)]), "<span class='cultitalic'><b>Overwhelming vertigo consumes you as you are hurled through the air!</b></span>"]);
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>A foggy shape materializes atop ＀ and solidifes into ＀!</span>", [live(f.src), live(cultist_to_summon)]));
	yield* g.callName(f, live(cultist_to_summon), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["invokers"] });

rt.type(11436, "/obj/effect/rune/blood_boil", "/obj/effect/rune", {
	tick_damage: 25,
	cultist_name: "Boil Blood",
	cultist_desc: "boils the blood of non-believers who can see the rune, rapidly dealing extreme amounts of damage. Requires 3 invokers.",
	invocation: "Dedo ol'btoh!",
	light_color: "#C48A18",
	req_cultists: 3,
	invoke_damage: 10,
	construct_invoke: 0,
	rune_in_use: 0,
	icon_state: "4",
	color: "#C80000",
});

// /obj/effect/rune/blood_boil/proc/invoke  (code/game/gamemodes/cult/runes.dm:837)  may sleep
rt.def("/obj/effect/rune/blood_boil/proc/invoke", function* invoke(f: Frame) {
	let _T: Value = null, L: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [_T, L, N, $e];
	if (truthy(rt.sv(f, "rune_in_use"))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "rune_in_use", 1);
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ turns a bright, glowing orange!</span>", [live(f.src)]));
	rt.setSv(f, "color", "#FC9B54");
	yield* g.srcCall(f, "set_light", 6, 1, rt.sv(f, "color"));
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(_T)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)]))) && truthy(rt.fv(f, "blood_volume", live(L))))) {
			if (truthy((N = (yield* g.callName(f, live(L), "null_rod_check", []))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>＄！ suddenly burns hotly before returning to normal!</span>", [live(N)])]);
				continue;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='cultlarge'>Your blood boils in your veins!</span>"]);
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(L), "<span class='userdanger'>You feel an unholy darkness dimming the Justiciar's light!</span>"]);
			}
		}
	}
	rt.endFor(f, 0);
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#FCB56D", "time", 4]);
	yield* g.call(f, P("/proc/sleep"), null, [4]);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "do_area_burn", live(_T), 0.5);
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#FFDF80", "time", 5]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "do_area_burn", live(_T), 1);
	rt.op(f, "Animate", [2, 6], [null, live(f.src), "color", "#FFFDF4", "time", 6]);
	yield* g.call(f, P("/proc/sleep"), null, [6]);
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "do_area_burn", live(_T), 1.5);
	yield* g.new_(f, T("/obj/effect/hotspot"), [live(_T)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["invokers"] });

// /obj/effect/rune/blood_boil/proc/do_area_burn  (code/game/gamemodes/cult/runes.dm:871)  may sleep
rt.def("/obj/effect/rune/blood_boil/proc/do_area_burn", function* do_area_burn(f: Frame, _T: Value, multiplier: Value) {
	let L: Value = null, N: Value = null;
	let $e: any;
	f.vars = () => [_T, multiplier, L, N, $e];
	yield* g.srcCall(f, "set_light", 6, 1, rt.sv(f, "color"));
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [live(_T)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy((yield* g.call(f, P("/proc/iscultist"), null, [live(L)]))) && truthy(rt.fv(f, "blood_volume", live(L))))) {
			if (truthy((N = (yield* g.callName(f, live(L), "null_rod_check", []))))) {
				continue;
			}
			yield* g.callName(f, live(L), "take_overall_damage", [multiply(rt.sv(f, "tick_damage"), live(multiplier)), multiply(rt.sv(f, "tick_damage"), live(multiplier))]);
			if (truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)])))) {
				yield* g.callName(f, live(L), "adjustStaminaLoss", [multiply(rt.sv(f, "tick_damage"), 0.5)]);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(11437, "/obj/effect/rune/manifest", "/obj/effect/rune", {
	ghost_limit: 5,
	ghosts: 0,
	cultist_name: "Manifest Spirit",
	cultist_desc: "manifests a spirit as a servant of the Geometer. The invoker must not move from atop the rune, and will take damage for each summoned spirit.",
	invocation: "Gal'h'rfikk harfrandid mud'gib!",
	invoke_damage: 10,
	construct_invoke: 0,
	icon_state: "6",
	color: "#C80000",
});

// /obj/effect/rune/manifest/proc/Initialize  (code/game/gamemodes/cult/runes.dm:894)  may sleep
rt.def("/obj/effect/rune/manifest/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("Manifest rune created in ＀.", [(yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))]), null, rt.rsc("sound/effects/ghost2.ogg"), "source", live(f.src)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/effect/rune/manifest/proc/can_invoke  (code/game/gamemodes/cult/runes.dm:898)  may sleep
rt.def("/obj/effect/rune/manifest/proc/can_invoke", function* can_invoke(f: Frame) {
	let ghosts_on_rune: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [ghosts_on_rune, O, $e];
	if (!truthy((rt.isIn(f, live(f.args[0]), rt.getStep(f, live(f.src), 0)) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>You must be standing on ＀!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Manifest rune failed - user not standing on rune"]);
		return rt.list();
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_status_effect", [T("/datum/status_effect/cultghost")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultitalic'>Ghosts can't summon more ghosts!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Manifest rune failed - user is a ghost"]);
		return rt.list();
	}
	if (rt.ge(rt.sv(f, "ghosts"), rt.sv(f, "ghost_limit"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='cultitalic'>You are sustaining too many ghosts to summon more!</span>"]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Manifest rune failed - too many summoned ghosts"]);
		return rt.list();
	}
	ghosts_on_rune = rt.list();
	O = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "client", live(O))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(O), "cultist"]))))) {
			(ghosts_on_rune = rt.modify(live(ghosts_on_rune), live(O), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	if (!truthy(rt.len(f, live(ghosts_on_rune)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='cultitalic'>There are no spirits near ＀!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "fail_invoke");
		yield* g.call(f, P("/proc/log_game"), null, ["Manifest rune failed - no nearby ghosts"]);
		return rt.list();
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

// /obj/effect/rune/manifest/proc/invoke  (code/game/gamemodes/cult/runes.dm:925)  may sleep
rt.def("/obj/effect/rune/manifest/proc/invoke", function* invoke(f: Frame) {
	let user: Value = null, ghosts_on_rune: Value = null, O: Value = null, ghost_to_spawn: Value = null, new_human: Value = null, _T: Value = null, N: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, ghosts_on_rune, O, ghost_to_spawn, new_human, _T, N, I, $0, $1, $e];
	user = rt.index(live(f.args[0]), 1);
	ghosts_on_rune = rt.list();
	O = null;
	rt.forList(f, 0, rt.getStep(f, live(f.src), 0), T("/mob/dead/observer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		if ((truthy(rt.fv(f, "client", live(O))) && !truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(O), "cultist"]))))) {
			(ghosts_on_rune = rt.modify(live(ghosts_on_rune), live(O), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	ghost_to_spawn = rt.op(f, "PickUnweighted", [1], [live(ghosts_on_rune)]);
	rt.setFv(f, "real_name", (new_human = (yield* g.new_(f, T("/mob/living/carbon/human"), [rt.getStep(f, live(f.src), 0)]))), rt.fv(f, "real_name", live(ghost_to_spawn)));
	rt.setFv(f, "alpha", live(new_human), 150);
	yield* g.callName(f, live(new_human), "equipOutfit", [T("/datum/outfit/ghost_cultist")]);
	yield* g.callName(f, live(new_human), "apply_status_effect", [T("/datum/status_effect/cultghost")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.incSrcVar(f, "ghosts", 1, true);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/magic/exit_blood.ogg"), 50, 1]);
	$0 = live(f.src);
	if (isEqual(rt.fv(f, "gender", live(new_human)), "female")) {
		$1 = "wo";
	} else {
		$1 = "";
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>A cloud of red mist forms above ＀, and from within steps... a ＀man.</span>", [$0, $1]));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='cultitalic'>Your blood begins flowing into ＀. You must remain in place and conscious to maintain the forms of those summoned. This will hurt you slowly but surely...</span>", [live(f.src)])]);
	_T = rt.getStep(f, live(f.src), 0);
	N = (yield* g.new_(f, T("/obj/structure/emergency_shield/invoker"), [live(_T)]));
	rt.setFv(f, "key", live(new_human), rt.fv(f, "key", live(ghost_to_spawn)));
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "add_cultist", [rt.fv(f, "mind", live(new_human)), 0]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(new_human), "<span class='cultitalic'><b>You are a servant of the Geometer. You have been made semi-corporeal by the cult of Nar-Sie, and you are to serve them at all costs.</b></span>"]);
	while (((!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && !(!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user))))) && !(!truthy(live(new_human)) || truthy(rt.fv(f, "gc_destroyed", live(new_human))))) && truthy((rt.isIn(f, live(user), live(_T)) ? 1 : 0))) {
		if ((truthy(rt.fv(f, "stat", live(user))) || truthy((yield* g.callName(f, live(new_human), "InCritical", []))))) {
			break;
		}
		yield* g.callName(f, live(user), "apply_damage", [0.10000000149011612, "brute"]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(N)]);
	rt.incSrcVar(f, "ghosts", -1, true);
	if (!truthy(live(new_human))) return f.dot;
	yield* g.callName(f, live(new_human), "visible_message", [fmt("<span class='warning'>＀ suddenly dissolves into bones and ashes.</span>", [live(new_human)]), "<span class='cultlarge'>Your link to the world fades. Your form breaks apart.</span>"]);
	I = null;
	rt.forList(f, 0, live(new_human), T("/obj"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.callName(f, live(new_human), "dropItemToGround", [live(I), 1]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(new_human), "dust", []);
	return f.dot;
}, true, { args: ["invokers"] });
