// From code/game/gamemodes/malfunction/Malf_Modules.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalblacklisted_malf_machines  (code/game/gamemodes/malfunction/Malf_Modules.dm:3)
rt.def("/datum/controller/global_vars/proc/InitGlobalblacklisted_malf_machines", function InitGlobalblacklisted_malf_machines(f: Frame) {
	rt.setGl("blacklisted_malf_machines", rt.call(f, P("/proc/typecacheof"), null, [rt.list(T("/obj/machinery/field/containment"), T("/obj/machinery/power/supermatter_shard"), T("/obj/machinery/doomsday_device"), T("/obj/machinery/nuclearbomb"), T("/obj/machinery/nuclearbomb/selfdestruct"), T("/obj/machinery/nuclearbomb/syndicate"), T("/obj/machinery/syndicatebomb"), T("/obj/machinery/syndicatebomb/badmin"), T("/obj/machinery/syndicatebomb/badmin/clown"), T("/obj/machinery/syndicatebomb/empty"), T("/obj/machinery/syndicatebomb/self_destruct"), T("/obj/machinery/syndicatebomb/training"))]));
	rt.modSrcVar(f, "gvars_datum_init_order", "blacklisted_malf_machines", add);
	return f.dot;
});

rt.type(102, "/datum/action/innate/ai", "/datum/action/innate", {
	owner_AI: null,
	uses: null,
	auto_use_uses: 1,
	cooldown_period: null,
	name: "AI Action",
	desc: "You aren't entirely sure what this does, but it's very beepy and boopy.",
	background_icon_state: "bg_tech_blue",
	icon_icon: rt.rsc("icons/mob/actions_AI.dmi"),
});

// /datum/action/innate/ai/proc/Grant  (code/game/gamemodes/malfunction/Malf_Modules.dm:30)  may sleep
rt.def("/datum/action/innate/ai/proc/Grant", function* Grant(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy((rt.istype(rt.sv(f, "owner"), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("AI action ＀ attempted to grant itself to non-AI mob ＀ (＀)!", [rt.sv(f, "name"), rt.fv(f, "real_name", live(f.args[0])), rt.fv(f, "key", live(f.args[0]))]), "code/game/gamemodes/malfunction/Malf_Modules.dm", 32, live(f.src), live(f.usr)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		rt.setSv(f, "owner_AI", rt.sv(f, "owner"));
	}
	return f.dot;
}, true, { args: ["L"] });

// /datum/action/innate/ai/proc/IsAvailable  (code/game/gamemodes/malfunction/Malf_Modules.dm:38)
rt.def("/datum/action/innate/ai/proc/IsAvailable", function IsAvailable(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "owner_AI")) && rt.gt(rt.fv(f, "malf_cooldown", rt.sv(f, "owner_AI")), rt.worldTime(f)))) return f.dot;
	return live(f.dot);
});

// /datum/action/innate/ai/proc/Trigger  (code/game/gamemodes/malfunction/Malf_Modules.dm:43)  may sleep
rt.def("/datum/action/innate/ai/proc/Trigger", function* Trigger(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "auto_use_uses"))) {
		yield* g.srcCall(f, "adjust_uses", -1);
	}
	if (!truthy(rt.sv(f, "cooldown_period"))) return f.dot;
	rt.setFv(f, "malf_cooldown", rt.sv(f, "owner_AI"), add(rt.worldTime(f), rt.sv(f, "cooldown_period")));
	return f.dot;
}, true);

// /datum/action/innate/ai/proc/adjust_uses  (code/game/gamemodes/malfunction/Malf_Modules.dm:50)  may sleep
rt.def("/datum/action/innate/ai/proc/adjust_uses", function* adjust_uses(f: Frame, amt: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [amt, silent, $0, $1, $2, $3];
	rt.modSrcVar(f, "uses", live(amt), add);
	if ((!truthy(live(silent)) && truthy(rt.sv(f, "uses")))) {
		$0 = rt.sv(f, "owner");
		$1 = rt.sv(f, "name");
		$2 = rt.sv(f, "uses");
		if (rt.gt(rt.sv(f, "uses"), 1)) {
			$3 = "s";
		} else {
			$3 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ now has <b>＀</b> use＀ remaining.</span>", [$1, $2, $3])]);
	}
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	if (rt.gt(rt.initial(f, live(f.src), "uses"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>＀ has run out of uses!</span>", [rt.sv(f, "name")])]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(103, "/datum/action/innate/ai/ranged", "/datum/action/innate/ai", {
	linked_ability: null,
	linked_ability_type: null,
	auto_use_uses: 0,
	name: "Ranged AI Action",
});

// /datum/action/innate/ai/ranged/proc/New  (code/game/gamemodes/malfunction/Malf_Modules.dm:66)  may sleep
rt.def("/datum/action/innate/ai/ranged/proc/New", function* New(f: Frame) {
	if (!truthy(rt.sv(f, "linked_ability_type"))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Ranged AI action ＀ attempted to spawn without a linked ability!", [rt.sv(f, "name")]), "code/game/gamemodes/malfunction/Malf_Modules.dm", 67, live(f.src), live(f.usr)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	rt.setSv(f, "linked_ability", (yield* g.new_(f, rt.sv(f, "linked_ability_type"), [])));
	rt.setFv(f, "attached_action", rt.sv(f, "linked_ability"), live(f.src));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /datum/action/innate/ai/ranged/proc/adjust_uses  (code/game/gamemodes/malfunction/Malf_Modules.dm:75)  may sleep
rt.def("/datum/action/innate/ai/ranged/proc/adjust_uses", function* adjust_uses(f: Frame, amt: Value, silent: Value) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [amt, silent, $0, $1, $2, $3];
	rt.modSrcVar(f, "uses", live(amt), add);
	if ((!truthy(live(silent)) && truthy(rt.sv(f, "uses")))) {
		$0 = rt.sv(f, "owner");
		$1 = rt.sv(f, "name");
		$2 = rt.sv(f, "uses");
		if (rt.gt(rt.sv(f, "uses"), 1)) {
			$3 = "s";
		} else {
			$3 = "";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ now has <b>＀</b> use＀ remaining.</span>", [$1, $2, $3])]);
	}
	if (truthy(rt.sv(f, "uses"))) return f.dot;
	if (rt.gt(rt.initial(f, live(f.src), "uses"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='warning'>＀ has run out of uses!</span>", [rt.sv(f, "name")])]);
	}
	yield* g.srcCall(f, "Remove", rt.sv(f, "owner"));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(f.src)])), 100, 8]);
	return f.dot;
}, true);

// /datum/action/innate/ai/ranged/proc/Destroy  (code/game/gamemodes/malfunction/Malf_Modules.dm:85)  may sleep
rt.def("/datum/action/innate/ai/ranged/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "linked_ability")]);
	rt.setSv(f, "linked_ability", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/innate/ai/ranged/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:89)  may sleep
rt.def("/datum/action/innate/ai/ranged/proc/Activate", function* Activate(f: Frame) {
	yield* g.callName(f, rt.sv(f, "linked_ability"), "toggle", [rt.sv(f, "owner")]);
	return 1;
}, true);

rt.type(11271, "/obj/effect/proc_holder/ranged_ai", "/obj/effect/proc_holder", {
	enable_text: "<span class='notice'>Hello World!</span>",
	disable_text: "<span class='danger'>Goodbye Cruel World!</span>",
	attached_action: null,
});

// /obj/effect/proc_holder/ranged_ai/proc/Destroy  (code/game/gamemodes/malfunction/Malf_Modules.dm:99)  may sleep
rt.def("/obj/effect/proc_holder/ranged_ai/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "attached_action")]);
	rt.setSv(f, "attached_action", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/proc_holder/ranged_ai/proc/toggle  (code/game/gamemodes/malfunction/Malf_Modules.dm:104)  may sleep
rt.def("/obj/effect/proc_holder/ranged_ai/proc/toggle", function* toggle(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "active"))) {
		yield* g.srcCall(f, "remove_ranged_ability", rt.sv(f, "disable_text"));
	} else {
		yield* g.srcCall(f, "add_ranged_ability", live(user), rt.sv(f, "enable_text"));
	}
	return f.dot;
}, true);

rt.type(1290, "/datum/module_picker", "/datum", {
	temp: null,
	processing_time: 50,
	possible_modules: null,
});

// /datum/module_picker/proc/New  (code/game/gamemodes/malfunction/Malf_Modules.dm:116)  may sleep
rt.def("/datum/module_picker/proc/New", function* New(f: Frame) {
	let type: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [type, AM, $e];
	rt.setSv(f, "possible_modules", rt.list());
	type = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/datum/AI_Module")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		type = $e;
		if (((truthy(rt.gv(f, "power_type", (AM = (yield* g.new_(f, live(type), []))))) && !isEqual(rt.fv(f, "power_type", live(AM)), T("/datum/action/innate/ai"))) || truthy(rt.fv(f, "upgrade", live(AM))))) {
			rt.modSrcVar(f, "possible_modules", live(AM), add);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/module_picker/proc/remove_malf_verbs  (code/game/gamemodes/malfunction/Malf_Modules.dm:123)  may sleep
rt.def("/datum/module_picker/proc/remove_malf_verbs", function* remove_malf_verbs(f: Frame, AI: Value) {
	let AM: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [AI, AM, A, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "possible_modules"), T("/datum/AI_Module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		A = null;
		rt.forList(f, 1, rt.fv(f, "actions", live(AI)), T("/datum/action"));
		while (($e = rt.next(f, 1)) !== undefined) {
			A = $e;
			if (truthy(rt.op(f, "IsType", [], [live(A), rt.initial(f, live(AM), "power_type")]))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(A)]);
			}
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/module_picker/proc/use  (code/game/gamemodes/malfunction/Malf_Modules.dm:129)  may sleep
rt.def("/datum/module_picker/proc/use", function* use(f: Frame, user: Value) {
	let dat: Value = null, module: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, module, popup, $e];
	dat = rt.list();
	dat = rt.modify(live(dat), fmt("<B>Select use of processing time: (currently #＀ left.)</B><BR>", [rt.sv(f, "processing_time")]), add);
	dat = rt.modify(live(dat), "<HR>", add);
	dat = rt.modify(live(dat), "<B>Install Module:</B><BR>", add);
	dat = rt.modify(live(dat), "<I>The number afterwards is the amount of processing time it consumes.</I><BR>", add);
	module = null;
	rt.forList(f, 0, rt.sv(f, "possible_modules"), T("/datum/AI_Module/large"));
	while (($e = rt.next(f, 0)) !== undefined) {
		module = $e;
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;＀=1'>＀</A><A href='byond://?src=＃;showdesc=＀'>[?]</A> (＀)<BR>", [live(f.src), rt.fv(f, "mod_pick_name", live(module)), rt.fv(f, "module_name", live(module)), live(f.src), rt.fv(f, "mod_pick_name", live(module)), rt.fv(f, "cost", live(module))]), add);
	}
	rt.endFor(f, 0);
	module = null;
	rt.forList(f, 0, rt.sv(f, "possible_modules"), T("/datum/AI_Module/small"));
	while (($e = rt.next(f, 0)) !== undefined) {
		module = $e;
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;＀=1'>＀</A><A href='byond://?src=＃;showdesc=＀'>[?]</A> (＀)<BR>", [live(f.src), rt.fv(f, "mod_pick_name", live(module)), rt.fv(f, "module_name", live(module)), live(f.src), rt.fv(f, "mod_pick_name", live(module)), rt.fv(f, "cost", live(module))]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "<HR>", add);
	if (truthy(rt.sv(f, "temp"))) {
		dat = rt.modify(live(dat), fmt("＀", [rt.sv(f, "temp")]), add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "modpicker", "Malf Module Menu"]))), "set_content", [(yield* g.callName(f, live(dat), "Join", []))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /datum/module_picker/proc/Topic  (code/game/gamemodes/malfunction/Malf_Modules.dm:146)  may sleep
rt.def("/datum/module_picker/proc/Topic", function* Topic(f: Frame) {
	let A: Value = null, AM: Value = null, action: Value = null, AC: Value = null;
	let $0: any, $e: any;
	f.vars = () => [A, AM, action, AC, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (isEqual(rt.gv(f, "stat", (A = live(f.usr))), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<span class='warning'>You are already dead!</span>"]);
		return live(f.dot);
	}
	AM = null;
	rt.forList(f, 0, rt.sv(f, "possible_modules"), T("/datum/AI_Module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		if (truthy(rt.index(live(f.args[1]), rt.fv(f, "mod_pick_name", live(AM))))) {
			if (rt.gt(rt.fv(f, "cost", live(AM)), rt.sv(f, "processing_time"))) {
				rt.setSv(f, "temp", "You cannot afford this module.");
				break;
			}
			action = rt.locateIn(f, rt.fv(f, "power_type", live(AM)), rt.fv(f, "actions", live(A)));
			if (truthy(rt.fv(f, "upgrade", live(AM)))) {
				yield* g.callName(f, live(AM), "upgrade", [live(A)]);
				(rt.modSrcVar(f, "possible_modules", live(AM), subtract));
				yield* g.call(f, P("/proc/to_chat"), null, [live(A), rt.fv(f, "unlock_text", live(AM))]);
				yield* g.callName(f, live(A), "playsound_local", [live(A), rt.fv(f, "unlock_sound", live(AM)), 50, 0]);
			} else {
				if (truthy(rt.fv(f, "power_type", live(AM)))) {
					if (!truthy(live(action))) {
						yield* g.callName(f, (AC = (yield* g.new_(f, rt.fv(f, "power_type", live(AM)), []))), "Grant", [live(A)]);
						rt.modField(f, live(A), "current_modules", (yield* g.new_(f, rt.fv(f, "type", live(AM)), [])), add);
						rt.setSv(f, "temp", rt.fv(f, "description", live(AM)));
						if (truthy(rt.fv(f, "one_purchase", live(AM)))) {
							(rt.modSrcVar(f, "possible_modules", live(AM), subtract));
						}
						if (truthy(rt.fv(f, "unlock_text", live(AM)))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(A), rt.fv(f, "unlock_text", live(AM))]);
						}
						if (truthy(rt.fv(f, "unlock_sound", live(AM)))) {
							yield* g.callName(f, live(A), "playsound_local", [live(A), rt.fv(f, "unlock_sound", live(AM)), 50, 0]);
						}
					} else {
						rt.modField(f, live(action), "uses", rt.initial(f, live(action), "uses"), add);
						if (rt.gt(rt.fv(f, "uses", live(action)), 1)) {
							$0 = "s";
						} else {
							$0 = "";
						}
						rt.setSv(f, "temp", fmt("Additional use＀ added to ＀!", [$0, rt.fv(f, "name", live(action))]));
					}
				}
			}
			(rt.modSrcVar(f, "processing_time", rt.fv(f, "cost", live(AM)), subtract));
		}
		if (truthy(rt.at(live(f.args[1]), "showdesc"))) {
			if (isEqual(rt.fv(f, "mod_pick_name", live(AM)), rt.at(live(f.args[1]), "showdesc"))) {
				rt.setSv(f, "temp", rt.fv(f, "description", live(AM)));
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "use", live(f.usr));
	return f.dot;
}, true, { args: ["href", "href_list"] });

rt.type(106, "/datum/action/innate/ai/nuke_station", "/datum/action/innate/ai", {
	auto_use_uses: 0,
	name: "Doomsday Device",
	desc: "Activates the doomsday device. This is not reversible.",
	button_icon_state: "doomsday_device",
});

// /datum/action/innate/ai/nuke_station/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:234)  may sleep
rt.def("/datum/action/innate/ai/nuke_station/proc/Activate", function* Activate(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if ((!truthy((rt.istype((_T = rt.getStep(f, rt.sv(f, "owner"), 0)), T("/turf")) ? 1 : 0)) || !isEqual(rt.fv(f, "z", live(_T)), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You cannot activate the doomsday device while off-station!</span>"]);
		return live(f.dot);
	}
	if (!isEqual((yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "owner"), "Send arming signal? (true = arm, false = cancel)", "purge_all_life()", "confirm = TRUE;", "confirm = FALSE;"])), "confirm = TRUE;")) {
		return live(f.dot);
	}
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "set_us_up_the_bomb", rt.sv(f, "owner"));
	return f.dot;
}, true);

// /datum/action/innate/ai/nuke_station/proc/set_us_up_the_bomb  (code/game/gamemodes/malfunction/Malf_Modules.dm:245)  may sleep
rt.def("/datum/action/innate/ai/nuke_station/proc/set_us_up_the_bomb", function* set_us_up_the_bomb(f: Frame, owner: Value) {
	let i: Value = null, DOOM: Value = null, pinpointer: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [owner, i, DOOM, pinpointer, _P, $e];
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>run -o -a 'selfdestruct'</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>Running executable 'selfdestruct'...</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [10, 30]))]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/bloblarm.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='userdanger'>!!! UNAUTHORIZED SELF-DESTRUCT ACCESS !!!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldannounce'>This is a class-3 security violation. This incident will be reported to Central Command.</span>"]);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/sleep"), null, [20]);
		if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(owner), fmt("<span class='boldannounce'>Sending security report to Central Command.....＀%</span>", [add((yield* g.call(f, P("/proc/rand"), null, [0, 9])), multiply((yield* g.call(f, P("/proc/rand"), null, [20, 30])), live(i)))])]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [3]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>auth 'akjv9c88asdf12nb' ******************</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/items/timer.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldnotice'>Credentials accepted. Welcome, akjv9c88asdf12nb.</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/server-ready.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [5]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldnotice'>Arm self-destruct device? (Y/N)</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/compiler-stage1.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [20]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>Y</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [15]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldnotice'>Confirm arming of self-destruct device? (Y/N)</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/compiler-stage2.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>Y</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [15, 25]))]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldnotice'>Please repeat password to confirm.</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/compiler-stage2.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [14]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='small boldannounce'>******************</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [40]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(owner), "<span class='boldnotice'>Credentials accepted. Transmitting arming signal...</span>"]);
	yield* g.callName(f, live(owner), "playsound_local", [live(owner), rt.rsc("sound/misc/server-ready.ogg"), 50, 0]);
	yield* g.call(f, P("/proc/sleep"), null, [30]);
	if ((!truthy(live(owner)) || (!truthy(live(owner)) || truthy(rt.fv(f, "gc_destroyed", live(owner)))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/priority_announce"), null, ["Hostile runtimes detected in all station systems, please deactivate your AI to prevent possible damage to its morality core.", "Anomaly Alert", rt.rsc("sound/ai/aimalf.ogg")]);
	yield* g.call(f, P("/proc/set_security_level"), null, ["delta"]);
	DOOM = (yield* g.new_(f, T("/obj/machinery/doomsday_device"), [rt.sv(f, "owner_AI")]));
	rt.setFv(f, "nuking", rt.sv(f, "owner_AI"), 1);
	rt.setFv(f, "doomsday_device", rt.sv(f, "owner_AI"), live(DOOM));
	yield* g.callName(f, rt.fv(f, "doomsday_device", rt.sv(f, "owner_AI")), "start", []);
	pinpointer = null;
	rt.forList(f, 0, rt.gl("pinpointer_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		pinpointer = $e;
		yield* g.callName(f, (_P = live(pinpointer)), "switch_mode_to", [2]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { waitfor: false });

rt.type(10348, "/obj/machinery/doomsday_device", "/obj/machinery", {
	timing: 0,
	countdown: null,
	detonation_timer: null,
	milestones: null,
	anchored: 1,
	verb_exclaim: "blares",
	icon: rt.rsc("icons/obj/machines/nuke_terminal.dmi"),
	name: "doomsday device",
	icon_state: "nuclearbomb_base",
	desc: "A weapon which disintegrates all organic life in a large area.",
	density: 1,
});

// /obj/machinery/doomsday_device/proc/Initialize  (code/game/gamemodes/malfunction/Malf_Modules.dm:331)  may sleep
rt.def("/obj/machinery/doomsday_device/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/doomsday"), [live(f.src)])));
	rt.setSv(f, "milestones", rt.list());
	return f.dot;
}, true);

// /obj/machinery/doomsday_device/proc/Destroy  (code/game/gamemodes/malfunction/Malf_Modules.dm:336)  may sleep
rt.def("/obj/machinery/doomsday_device/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, AI: Value = null;
	let $e: any;
	f.vars = () => [A, AI, $e];
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	rt.setSv(f, "countdown", null);
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
	yield* g.callName(f, rt.gl("SSmapping"), "remove_nuke_threat", [live(f.src)]);
	A = null;
	rt.forList(f, 0, rt.gl("ai_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (isEqual(rt.gv(f, "doomsday_device", (AI = live(A))), live(f.src))) {
			rt.setFv(f, "doomsday_device", live(AI), null);
		}
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/doomsday_device/proc/start  (code/game/gamemodes/malfunction/Malf_Modules.dm:347)  may sleep
rt.def("/obj/machinery/doomsday_device/proc/start", function* start(f: Frame) {
	rt.setSv(f, "detonation_timer", add(rt.worldTime(f), 4500));
	rt.setSv(f, "timing", 1);
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	}
	yield* g.callName(f, rt.gl("SSshuttle"), "registerHostileEnvironment", [live(f.src)]);
	yield* g.callName(f, rt.gl("SSmapping"), "add_nuke_threat", [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/doomsday_device/proc/seconds_remaining  (code/game/gamemodes/malfunction/Malf_Modules.dm:355)
rt.def("/obj/machinery/doomsday_device/proc/seconds_remaining", function seconds_remaining(f: Frame) {
	f.dot = rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/round"), null, [divide(subtract(rt.sv(f, "detonation_timer"), rt.worldTime(f)), 10)])]);
	return f.dot;
});

// /obj/machinery/doomsday_device/proc/process  (code/game/gamemodes/malfunction/Malf_Modules.dm:358)  may sleep
rt.def("/obj/machinery/doomsday_device/proc/process", function* process(f: Frame) {
	let _T: Value = null, sec_left: Value = null, key: Value = null;
	f.vars = () => [_T, sec_left, key];
	if ((!truthy((_T = rt.getStep(f, live(f.src), 0))) || !isEqual(rt.fv(f, "z", live(_T)), 2))) {
		yield* g.call(f, P("/proc/minor_announce"), null, ["DOOMSDAY DEVICE OUT OF STATION RANGE, ABORTING", "ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4", 1]);
		yield* g.callName(f, rt.gl("SSshuttle"), "clearHostileEnvironment", [live(f.src)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "timing"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
		return live(f.dot);
	}
	if (!truthy((sec_left = (yield* g.srcCall(f, "seconds_remaining"))))) {
		rt.setSv(f, "timing", 0);
		yield* g.srcCall(f, "detonate", rt.fv(f, "z", live(_T)));
	} else {
		key = (yield* g.call(f, P("/proc/num2text"), null, [live(sec_left)]));
		if (!(!truthy(rt.modulus(live(sec_left), 60)) && !truthy((rt.isIn(f, live(key), rt.sv(f, "milestones")) ? 1 : 0)))) return f.dot;
		rt.setAt(rt.sv(f, "milestones"), live(key), 1);
		yield* g.call(f, P("/proc/minor_announce"), null, [fmt("＀ SECONDS UNTIL DOOMSDAY DEVICE ACTIVATION!", [live(key)]), "ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4", 1]);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/doomsday_device/proc/detonate  (code/game/gamemodes/malfunction/Malf_Modules.dm:378)  may sleep
rt.def("/obj/machinery/doomsday_device/proc/detonate", function* detonate(f: Frame, z_level: Value) {
	let M: Value = null, L: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [z_level, M, L, _T, $e];
	if (live(z_level) === null) {
		z_level = 2;
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.op(f, "Output", [], [live(M), rt.rsc("sound/machines/alarm.ogg")], false);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	L = null;
	rt.forList(f, 0, rt.gl("mob_list"), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		if ((!truthy((_T = rt.getStep(f, live(L), 0))) || !isEqual(rt.fv(f, "z", live(_T)), live(z_level)))) {
			continue;
		}
		if (truthy((rt.istype(live(L), T("/mob/living/silicon")) ? 1 : 0))) {
			continue;
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(L), fmt("<span class='userdanger'>The blast wave from ＀ tears you atom from atom!</span>", [live(f.src)])]);
		yield* g.callName(f, live(L), "dust", []);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<B>The AI cleansed the station of life with the doomsday device!</B>"]);
	rt.setFv(f, "force_ending", rt.gl("SSticker"), 1);
	return f.dot;
}, true);

rt.type(1294, "/datum/AI_Module/large/upgrade_turrets", "/datum/AI_Module/large", {
	module_name: "AI Turret Upgrade",
	mod_pick_name: "turret",
	description: "Improves the power and health of all AI turrets. This effect is permanent.",
	cost: 30,
	upgrade: 1,
	unlock_text: "<span class='notice'>You establish a power diversion to your turrets, upgrading their health and damage.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// /datum/AI_Module/large/upgrade_turrets/proc/upgrade  (code/game/gamemodes/malfunction/Malf_Modules.dm:404)
rt.def("/datum/AI_Module/large/upgrade_turrets/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	let turret: Value = null;
	let $e: any;
	f.vars = () => [turret, $e];
	turret = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/porta_turret/ai"));
	while (($e = rt.next(f, 0)) !== undefined) {
		turret = $e;
		rt.modField(f, live(turret), "obj_integrity", 30, add);
		rt.setFv(f, "lethal_projectile", live(turret), T("/obj/item/projectile/beam/laser/heavylaser"));
		rt.setFv(f, "lethal_projectile_sound", live(turret), rt.rsc("sound/weapons/lasercannonfire.ogg"));
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(107, "/datum/action/innate/ai/lockdown", "/datum/action/innate/ai", {
	uses: 1,
	name: "Lockdown",
	desc: "Closes, bolts, and depowers every airlock, firelock, and blast door on the station. After 90 seconds, they will reset themselves.",
	button_icon_state: "lockdown",
});

// /datum/action/innate/ai/lockdown/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:429)  may sleep
rt.def("/datum/action/innate/ai/lockdown/proc/Activate", function* Activate(f: Frame) {
	let D: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [D, C, $e];
	D = null;
	rt.forList(f, 0, rt.gl("airlocks"), T("/obj/machinery/door"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (!isEqual(rt.fv(f, "z", live(D)), 2)) {
			continue;
		}
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(D), P("/obj/machinery/door/proc/hostile_lockdown"), live(f.src)]);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(D), P("/obj/machinery/door/proc/disable_lockdown")])), 900]);
	}
	rt.endFor(f, 0);
	if (truthy((C = rt.locateIn(f, T("/obj/machinery/computer/communications"), rt.gl("machines"))))) {
		yield* g.callName(f, live(C), "post_status", ["alert", "lockdown"]);
	}
	yield* g.call(f, P("/proc/minor_announce"), null, ["Hostile runtime detected in door controllers. Isolation lockdown protocols are now in effect. Please remain calm.", "Network Alert:", 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>Lockdown initiated. Network reset in 90 seconds.</span>"]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/minor_announce"), "Automatic system reboot complete. Have a secure day.", "Network reset:"])), 900]);
	return f.dot;
}, true);

rt.type(108, "/datum/action/innate/ai/destroy_rcds", "/datum/action/innate/ai", {
	uses: 1,
	cooldown_period: 100,
	name: "Destroy RCDs",
	desc: "Detonate all non-cyborg RCDs on the station.",
	button_icon_state: "detonate_rcds",
});

// /datum/action/innate/ai/destroy_rcds/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:465)  may sleep
rt.def("/datum/action/innate/ai/destroy_rcds/proc/Activate", function* Activate(f: Frame) {
	let I: Value = null, RCD: Value = null;
	let $e: any;
	f.vars = () => [I, RCD, $e];
	I = null;
	rt.forList(f, 0, rt.gl("rcd_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/construction/rcd/borg")) ? 1 : 0))) {
			yield* g.callName(f, (RCD = live(I)), "detonate_pulse", []);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='danger'>RCD detonation pulse emitted.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.sv(f, "owner"), rt.rsc("sound/machines/twobeep.ogg"), 50, 0]);
	return f.dot;
}, true);

rt.type(1297, "/datum/AI_Module/large/mecha_domination", "/datum/AI_Module/large", {
	module_name: "Unlock Mech Domination",
	mod_pick_name: "mechjack",
	description: "Allows you to hack into a mech's onboard computer, shunting all processes into it and ejecting any occupants. Once uploaded to the mech, it is impossible to leave.Do not allow the mech to leave the station's vicinity or allow it to be destroyed.",
	cost: 30,
	upgrade: 1,
	unlock_text: "<span class='notice'>Virus package compiled. Select a target mech at any time. <b>You must remain on the station at all times. Loss of signal will result in total system lockout.</b></span>",
	unlock_sound: rt.rsc("sound/mecha/nominal.ogg"),
});

// /datum/AI_Module/large/mecha_domination/proc/upgrade  (code/game/gamemodes/malfunction/Malf_Modules.dm:485)
rt.def("/datum/AI_Module/large/mecha_domination/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	rt.setFv(f, "can_dominate_mechs", live(AI), 1);
	return f.dot;
});

rt.type(109, "/datum/action/innate/ai/break_fire_alarms", "/datum/action/innate/ai", {
	uses: 1,
	name: "Override Thermal Sensors",
	desc: "Disables the automatic temperature sensing on all fire alarms, making them effectively useless.",
	button_icon_state: "break_fire_alarms",
});

// /datum/action/innate/ai/break_fire_alarms/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:507)
rt.def("/datum/action/innate/ai/break_fire_alarms/proc/Activate", function Activate(f: Frame) {
	let F: Value = null;
	let $e: any;
	f.vars = () => [F, $e];
	F = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/firealarm"));
	while (($e = rt.next(f, 0)) !== undefined) {
		F = $e;
		if (!isEqual(rt.fv(f, "z", live(F)), 2)) {
			continue;
		}
		rt.setFv(f, "emagged", live(F), 1);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>All thermal sensors on the station have been disabled. Fire alerts will no longer be recognized.</span>"]);
	rt.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.sv(f, "owner"), rt.rsc("sound/machines/terminal_off.ogg"), 50, 0]);
	return f.dot;
});

rt.type(110, "/datum/action/innate/ai/break_air_alarms", "/datum/action/innate/ai", {
	uses: 1,
	name: "Override Air Alarm Safeties",
	desc: "Enables the Flood setting on all air alarms.",
	button_icon_state: "break_air_alarms",
});

// /datum/action/innate/ai/break_air_alarms/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:534)
rt.def("/datum/action/innate/ai/break_air_alarms/proc/Activate", function Activate(f: Frame) {
	let AA: Value = null;
	let $e: any;
	f.vars = () => [AA, $e];
	AA = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/airalarm"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AA = $e;
		if (!isEqual(rt.fv(f, "z", live(AA)), 2)) {
			continue;
		}
		rt.setFv(f, "emagged", live(AA), 1);
	}
	rt.endFor(f, 0);
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>All air alarm safeties on the station have been overriden. Air alarms may now use the Flood environmental mode."]);
	rt.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.sv(f, "owner"), rt.rsc("sound/machines/terminal_off.ogg"), 50, 0]);
	return f.dot;
});

rt.type(104, "/datum/action/innate/ai/ranged/overload_machine", "/datum/action/innate/ai/ranged", {
	uses: 2,
	name: "Overload Machine",
	desc: "Overheats a machine, causing a small explosion after a short time.",
	button_icon_state: "overload_machine",
	linked_ability_type: rt.typePath("/obj/effect/proc_holder/ranged_ai/overload_machine"),
});

// /datum/action/innate/ai/ranged/overload_machine/proc/detonate_machine  (code/game/gamemodes/malfunction/Malf_Modules.dm:560)  may sleep
rt.def("/datum/action/innate/ai/ranged/overload_machine/proc/detonate_machine", function* detonate_machine(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!(truthy(live(M)) && !(!truthy(live(M)) || truthy(rt.fv(f, "gc_destroyed", live(M)))))) return f.dot;
	yield* g.call(f, P("/proc/explosion"), null, [rt.getStep(f, live(M), 0), 0, 2, 3, 0]);
	if (!truthy(live(M))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery" }] });

rt.type(11272, "/obj/effect/proc_holder/ranged_ai/overload_machine", "/obj/effect/proc_holder/ranged_ai", {
	enable_text: "<span class='notice'>You tap into the station's powernet. Click on a machine to detonate it, or use the ability again to cancel.</span>",
	disable_text: "<span class='notice'>You release your hold on the powernet.</span>",
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/overload_machine_target.dmi"),
});

// /obj/effect/proc_holder/ranged_ai/overload_machine/proc/InterceptClickOn  (code/game/gamemodes/malfunction/Malf_Modules.dm:572)  may sleep
rt.def("/obj/effect/proc_holder/ranged_ai/overload_machine/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", [])))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[2]), T("/obj/machinery")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), "<span class='warning'>You can only overload machines!</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[2]), rt.gl("blacklisted_malf_machines")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), "<span class='warning'>You cannot overload that device!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "playsound_local", [rt.sv(f, "ranged_ability_user"), "sparks", 50, 0]);
	yield* g.callName(f, rt.sv(f, "attached_action"), "adjust_uses", [-1]);
	yield* g.callName(f, live(f.args[2]), "audible_message", [fmt("<span class='userdanger'>You hear a loud electrical buzzing sound coming from ＀!</span>", [live(f.args[2])])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "attached_action"), P("/datum/action/innate/ai/ranged/overload_machine/proc/detonate_machine"), live(f.args[2])])), 50]);
	yield* g.srcCall(f, "remove_ranged_ability", "<span class='danger'>Overcharging machine...</span>");
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(105, "/datum/action/innate/ai/ranged/override_machine", "/datum/action/innate/ai/ranged", {
	uses: 4,
	name: "Override Machine",
	desc: "Animates a targeted machine, causing it to attack anyone nearby.",
	button_icon_state: "override_machine",
	linked_ability_type: rt.typePath("/obj/effect/proc_holder/ranged_ai/override_machine"),
});

// /datum/action/innate/ai/ranged/override_machine/proc/animate_machine  (code/game/gamemodes/malfunction/Malf_Modules.dm:609)  may sleep
rt.def("/datum/action/innate/ai/ranged/override_machine/proc/animate_machine", function* animate_machine(f: Frame, M: Value) {
	f.vars = () => [M];
	if (!(truthy(live(M)) && !(!truthy(live(M)) || truthy(rt.fv(f, "gc_destroyed", live(M)))))) return f.dot;
	yield* g.new_(f, T("/mob/living/simple_animal/hostile/mimic/copy/machine"), [rt.getStep(f, live(M), 0), live(M), rt.sv(f, "owner"), 1]);
	return f.dot;
}, true, { argTypes: [{ type: 4, path: "/obj/machinery" }] });

rt.type(11273, "/obj/effect/proc_holder/ranged_ai/override_machine", "/obj/effect/proc_holder/ranged_ai", {
	enable_text: "<span class='notice'>You tap into the station's powernet. Click on a machine to animate it, or use the ability again to cancel.</span>",
	disable_text: "<span class='notice'>You release your hold on the powernet.</span>",
	active: 0,
	ranged_mousepointer: rt.rsc("icons/effects/override_machine_target.dmi"),
});

// /obj/effect/proc_holder/ranged_ai/override_machine/proc/InterceptClickOn  (code/game/gamemodes/malfunction/Malf_Modules.dm:619)  may sleep
rt.def("/obj/effect/proc_holder/ranged_ai/override_machine/proc/InterceptClickOn", function* InterceptClickOn(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "incapacitated", [])))) {
		yield* g.srcCall(f, "remove_ranged_ability");
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[2]), T("/obj/machinery")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), "<span class='warning'>You can only animate machines!</span>"]);
		return live(f.dot);
	}
	if ((!truthy((yield* g.callName(f, live(f.args[2]), "can_be_overridden", []))) || truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[2]), rt.gl("blacklisted_malf_machines")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "ranged_ability_user"), "<span class='warning'>That machine can't be overriden!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "ranged_ability_user"), "playsound_local", [rt.sv(f, "ranged_ability_user"), rt.rsc("sound/misc/interference.ogg"), 50, 0]);
	yield* g.callName(f, rt.sv(f, "attached_action"), "adjust_uses", [-1]);
	yield* g.callName(f, live(f.args[2]), "audible_message", [fmt("<span class='userdanger'>You hear a loud electrical buzzing sound coming from ＀!</span>", [live(f.args[2])])]);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [rt.sv(f, "attached_action"), P("/datum/action/innate/ai/ranged/override_machine/proc/animate_machine"), live(f.args[2])])), 50]);
	yield* g.srcCall(f, "remove_ranged_ability", "<span class='danger'>Sending override signal...</span>");
	return 1;
}, true, { args: ["caller", "params", "target"] });

rt.type(111, "/datum/action/innate/ai/place_transformer", "/datum/action/innate/ai", {
	turfOverlays: null,
	uses: 1,
	auto_use_uses: 0,
	name: "Place Robotics Factory",
	desc: "Places a machine that converts humans into cyborgs. Conveyor belts included!",
	button_icon_state: "robotic_factory",
});

// /datum/action/innate/ai/place_transformer/proc/New  (code/game/gamemodes/malfunction/Malf_Modules.dm:658)  may sleep
rt.def("/datum/action/innate/ai/place_transformer/proc/New", function* New(f: Frame) {
	let i: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [i, I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		I = (yield* g.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/turf/overlays.dmi")], rt.Args.Named));
		if (!truthy(rt.sv(f, "turfOverlays"))) {
			rt.setSv(f, "turfOverlays", rt.list());
		}
		rt.modSrcVar(f, "turfOverlays", live(I), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/action/innate/ai/place_transformer/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:664)  may sleep
rt.def("/datum/action/innate/ai/place_transformer/proc/Activate", function* Activate(f: Frame) {
	let _T: Value = null, conveyor: Value = null;
	f.vars = () => [_T, conveyor];
	if (!truthy((yield* g.callName(f, rt.sv(f, "owner_AI"), "can_place_transformer", [live(f.src)])))) {
		return live(f.dot);
	}
	rt.setSv(f, "active", 1);
	if (isEqual((yield* g.call(f, P("/proc/alert"), null, [rt.sv(f, "owner"), "Are you sure you want to place the machine here?", "Are you sure?", "Yes", "No"])), "No")) {
		rt.setSv(f, "active", 0);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, rt.sv(f, "owner_AI"), "can_place_transformer", [live(f.src)])))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, rt.fv(f, "eyeobj", rt.sv(f, "owner_AI")), 0);
	rt.setFv(f, "masterAI", (conveyor = (yield* g.new_(f, T("/obj/machinery/transformer"), [live(_T)]))), rt.sv(f, "owner"));
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/effects/phasein.ogg"), 100, 1]);
	rt.setFv(f, "can_shunt", rt.sv(f, "owner_AI"), 1);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='warning'>You are no longer able to shunt your core to APCs.</span>"]);
	yield* g.srcCall(f, "adjust_uses", -1);
	return f.dot;
}, true);

// /mob/living/silicon/ai/proc/remove_transformer_image  (code/game/gamemodes/malfunction/Malf_Modules.dm:681)
rt.def("/mob/living/silicon/ai/proc/remove_transformer_image", function remove_transformer_image(f: Frame, C: Value, I: Value, _T: Value) {
	if (!(truthy(live(C)) && isEqual(rt.fv(f, "loc", live(I)), live(_T)))) return f.dot;
	(rt.modField(f, live(C), "images", live(I), subtract));
	return f.dot;
}, false, { argTypes: [{ path: "/client" }, { path: "/image" }, { path: "/turf" }] });

// /mob/living/silicon/ai/proc/can_place_transformer  (code/game/gamemodes/malfunction/Malf_Modules.dm:685)  may sleep
rt.def("/mob/living/silicon/ai/proc/can_place_transformer", function* can_place_transformer(f: Frame, action: Value) {
	let middle: Value = null, turfs: Value = null, alert_msg: Value = null, success: Value = null, n: Value = null, _T: Value = null, C: Value = null, AM: Value = null, I: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [action, middle, turfs, alert_msg, success, n, _T, C, AM, I, $0, $1, $e];
	if ((((!truthy(rt.sv(f, "eyeobj")) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) || !truthy((yield* g.srcCall(f, "canUseTopic")))) || !truthy(live(action)))) {
		return live(f.dot);
	}
	middle = rt.getStep(f, rt.sv(f, "eyeobj"), 0);
	turfs = rt.list(live(middle), rt.locate(subtract(rt.fv(f, "x", live(middle)), 1), rt.fv(f, "y", live(middle)), rt.fv(f, "z", live(middle))), rt.locate(add(rt.fv(f, "x", live(middle)), 1), rt.fv(f, "y", live(middle)), rt.fv(f, "z", live(middle))));
	alert_msg = "There isn't enough room! Make sure you are placing the machine in a clear area and on a floor.";
	success = 1;
	n = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		n = $e;
		if (!truthy((rt.istype((_T = rt.index(live(turfs), live(n))), T("/turf/open/floor")) ? 1 : 0))) {
			success = 0;
		}
		if (!truthy(rt.index(rt.gv(f, "visibleTurfs", (C = (yield* g.callName(f, rt.gl("cameranet"), "getCameraChunk", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])))), live(_T)))) {
			alert_msg = "You don't have camera vision of this location!";
			success = 0;
		}
		AM = null;
		rt.forList(f, 1, rt.fv(f, "contents", live(_T)), T("/atom/movable"));
		while (($e = rt.next(f, 1)) !== undefined) {
			AM = $e;
			if (truthy(rt.fv(f, "density", live(AM)))) {
				alert_msg = "That area must be clear of objects!";
				success = 0;
			}
		}
		rt.endFor(f, 1);
		rt.setFv(f, "loc", (I = rt.index(rt.fv(f, "turfOverlays", live(action)), live(n))), live(_T));
		rt.modField(f, rt.sv(f, "client"), "images", live(I), add);
		$0 = live(I);
		if (truthy(live(success))) {
			$1 = "green";
		} else {
			$1 = "red";
		}
		rt.setFv(f, "icon_state", $0, fmt("＀Overlay", [$1]));
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/mob/living/silicon/ai/proc/remove_transformer_image"), rt.sv(f, "client"), live(I), live(_T)])), 30]);
	}
	rt.endFor(f, 0);
	if (!truthy(live(success))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.src), fmt("<span class='warning'>＀</span>", [live(alert_msg)])]);
	}
	return live(success);
}, true);

rt.type(112, "/datum/action/innate/ai/blackout", "/datum/action/innate/ai", {
	uses: 3,
	name: "Blackout",
	desc: "Overloads lights across the station.",
	button_icon_state: "blackout",
});

// /datum/action/innate/ai/blackout/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:730)  may sleep
rt.def("/datum/action/innate/ai/blackout/proc/Activate", function* Activate(f: Frame) {
	let apc: Value = null;
	let $e: any;
	f.vars = () => [apc, $e];
	apc = null;
	rt.forList(f, 0, rt.gl("apcs_list"), T("/obj/machinery/power/apc"));
	while (($e = rt.next(f, 0)) !== undefined) {
		apc = $e;
		if (truthy(rt.op(f, "Prob", [], [multiply(30, rt.fv(f, "overload", live(apc)))]))) {
			yield* g.callName(f, live(apc), "overload_lighting", []);
		} else {
			rt.incField(f, live(apc), "overload", 1, true);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>Overcurrent applied to the powernet.</span>"]);
	yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.sv(f, "owner"), "sparks", 50, 0]);
	return f.dot;
}, true);

rt.type(113, "/datum/action/innate/ai/reactivate_cameras", "/datum/action/innate/ai", {
	uses: 30,
	auto_use_uses: 0,
	cooldown_period: 30,
	name: "Reactivate Cameras",
	desc: "Reactivates disabled cameras across the station; remaining uses can be used later.",
	button_icon_state: "reactivate_cameras",
});

// /datum/action/innate/ai/reactivate_cameras/proc/New  (code/game/gamemodes/malfunction/Malf_Modules.dm:759)  may sleep
rt.def("/datum/action/innate/ai/reactivate_cameras/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "desc", fmt("＀ There are 30 reactivations remaining.", [rt.sv(f, "desc")]));
	rt.setFv(f, "desc", rt.sv(f, "button"), rt.sv(f, "desc"));
	return f.dot;
}, true);

// /datum/action/innate/ai/reactivate_cameras/proc/Activate  (code/game/gamemodes/malfunction/Malf_Modules.dm:765)  may sleep
rt.def("/datum/action/innate/ai/reactivate_cameras/proc/Activate", function* Activate(f: Frame) {
	let fixed_cameras: Value = null, V: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [fixed_cameras, V, C, $e];
	fixed_cameras = 0;
	V = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (!truthy(rt.sv(f, "uses"))) {
			break;
		}
		if ((!truthy(rt.gv(f, "status", (C = live(V)))) || !isEqual(rt.fv(f, "view_range", live(C)), rt.initial(f, live(C), "view_range")))) {
			yield* g.callName(f, live(C), "toggle_cam", [rt.sv(f, "owner_AI"), 0]);
			rt.setFv(f, "view_range", live(C), rt.initial(f, live(C), "view_range"));
			fixed_cameras = rt.inc(live(fixed_cameras), 1);
			rt.incSrcVar(f, "uses", -1, true);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), fmt("<span class='notice'>Diagnostic complete! Cameras reactivated: <b>＀</b>. Reactivations remaining: <b>＀</b>.</span>", [live(fixed_cameras), rt.sv(f, "uses")])]);
	yield* g.callName(f, rt.sv(f, "owner"), "playsound_local", [rt.sv(f, "owner"), rt.rsc("sound/items/wirecutter.ogg"), 50, 0]);
	yield* g.srcCall(f, "adjust_uses", 0, 1);
	if (!(truthy(live(f.src)) && truthy(rt.sv(f, "uses")))) return f.dot;
	rt.setSv(f, "desc", fmt("＀ There are ＀ reactivations remaining.", [rt.initial(f, live(f.src), "desc"), rt.sv(f, "uses")]));
	return f.dot;
}, true);

rt.type(1301, "/datum/AI_Module/large/upgrade_cameras", "/datum/AI_Module/large", {
	module_name: "Upgrade Camera Network",
	mod_pick_name: "upgradecam",
	description: "Install broad-spectrum scanning and electrical redundancy firmware to the camera network, enabling EMP-proofing and light-amplified X-ray vision.",
	one_purchase: 1,
	cost: 35,
	upgrade: 1,
	unlock_text: "<span class='notice'>OTA firmware distribution complete! Cameras upgraded: CAMSUPGRADED. Light amplification system online.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// /datum/AI_Module/large/upgrade_cameras/proc/upgrade  (code/game/gamemodes/malfunction/Malf_Modules.dm:794)  may sleep
rt.def("/datum/AI_Module/large/upgrade_cameras/proc/upgrade", function* upgrade(f: Frame, AI: Value) {
	let upgraded_cameras: Value = null, V: Value = null, C: Value = null, upgraded: Value = null;
	let $e: any;
	f.vars = () => [AI, upgraded_cameras, V, C, upgraded, $e];
	rt.setFv(f, "see_override", live(AI), 5);
	yield* g.callName(f, live(AI), "update_sight", []);
	upgraded_cameras = 0;
	V = null;
	rt.forList(f, 0, rt.fv(f, "cameras", rt.gl("cameranet")));
	while (($e = rt.next(f, 0)) !== undefined) {
		V = $e;
		if (truthy(rt.gv(f, "assembly", (C = live(V))))) {
			upgraded = 0;
			if (!truthy((yield* g.callName(f, live(C), "isXRay", [])))) {
				yield* g.callName(f, live(C), "upgradeXRay", []);
				yield* g.callName(f, rt.gl("cameranet"), "updateVisibility", [live(C), 0]);
				upgraded = 1;
			}
			if (!truthy((yield* g.callName(f, live(C), "isEmpProof", [])))) {
				yield* g.callName(f, live(C), "upgradeEmpProof", []);
				upgraded = 1;
			}
			if (truthy(live(upgraded))) {
				upgraded_cameras = rt.inc(live(upgraded_cameras), 1);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "unlock_text", (yield* g.call(f, P("/proc/replacetext"), null, [rt.sv(f, "unlock_text"), "CAMSUPGRADED", fmt("<b>＀</b>", [live(upgraded_cameras)])])));
	return f.dot;
}, true);

rt.type(1302, "/datum/AI_Module/large/eavesdrop", "/datum/AI_Module/large", {
	module_name: "Enhanced Surveillance",
	mod_pick_name: "eavesdrop",
	description: "Via a combination of hidden microphones and lip reading software, you are able to use your cameras to listen in on conversations.",
	cost: 30,
	one_purchase: 1,
	upgrade: 1,
	unlock_text: "<span class='notice'>OTA firmware distribution complete! Cameras upgraded: Enhanced surveillance package online.</span>",
	unlock_sound: rt.rsc("sound/items/rped.ogg"),
});

// /datum/AI_Module/large/eavesdrop/proc/upgrade  (code/game/gamemodes/malfunction/Malf_Modules.dm:829)
rt.def("/datum/AI_Module/large/eavesdrop/proc/upgrade", function upgrade(f: Frame, AI: Value) {
	if (!truthy(rt.fv(f, "eyeobj", live(AI)))) return f.dot;
	rt.setFv(f, "relay_speech", rt.fv(f, "eyeobj", live(AI)), 1);
	return f.dot;
});
