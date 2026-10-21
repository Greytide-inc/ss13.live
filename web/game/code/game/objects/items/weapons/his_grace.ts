// From code/game/objects/items/weapons/his_grace.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7233, "/obj/item/weapon/his_grace", "/obj/item/weapon", {
	awakened: 0,
	bloodthirst: 0,
	prev_bloodthirst: 0,
	force_bonus: 0,
	name: "artistic toolbox",
	desc: "A toolbox painted bright green. Looking at it makes you feel uneasy.",
	icon_state: "his_grace",
	item_state: "artistic_toolbox",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	w_class: 6,
	origin_tech: "combat=4;engineering=4;syndicate=2",
	force: 12,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
});

// /obj/item/weapon/his_grace/proc/<init>  (code/game/objects/items/weapons/his_grace.dm:16)
rt.def("/obj/item/weapon/his_grace/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("robusted"));
	return f.dot;
});

// /obj/item/weapon/his_grace/proc/New  (code/game/objects/items/weapons/his_grace.dm:24)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/his_grace/proc/Destroy  (code/game/objects/items/weapons/his_grace.dm:28)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/Destroy", function* Destroy(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSprocessing"), "processing", live(f.src), subtract));
	L = null;
	rt.forList(f, 0, live(f.src), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		yield* g.callName(f, live(L), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/his_grace/proc/attack_self  (code/game/objects/items/weapons/his_grace.dm:34)
rt.def("/obj/item/weapon/his_grace/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "awakened"))) return f.dot;
	rt.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/his_grace/proc/awaken"), live(user)]);
	return f.dot;
});

// /obj/item/weapon/his_grace/proc/attack  (code/game/objects/items/weapons/his_grace.dm:38)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/attack", function* attack(f: Frame) {
	if ((truthy(rt.sv(f, "awakened")) && truthy(rt.fv(f, "stat", live(f.args[0]))))) {
		yield* g.srcCall(f, "consume", live(f.args[0]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/his_grace/proc/examine  (code/game/objects/items/weapons/his_grace.dm:47)
rt.def("/obj/item/weapon/his_grace/proc/examine", function examine(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "awakened"))) {
		$0 = rt.sv(f, "bloodthirst");
		if (rt.inRange($0, 0, 20)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace'>＀ isn't very hungry. Not yet.</span>", [live(f.src)])]);
		} else if (rt.inRange($0, 20, 60)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace'>＀ would like a snack.</span>", [live(f.src)])]);
		} else if (rt.inRange($0, 60, 100)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace'>＀ is quite hungry now.</span>", [live(f.src)])]);
		} else if (rt.inRange($0, 100, 120)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace'>＀ is openly salivating at the sight of you. Be careful.</span>", [live(f.src)])]);
		} else if (rt.inRange($0, 120, 140)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace bold'>You walk a fine line. ＀ is very close to devouring you.</span>", [live(f.src)])]);
		} else if (rt.inRange($0, 140, 160)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace bold'>＀ is shaking violently and staring directly at you.</span>", [live(f.src)])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='his_grace'>＀ is latched closed.</span>", [live(f.src)])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/his_grace/proc/relaymove  (code/game/objects/items/weapons/his_grace.dm:66)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "awakened"))) return f.dot;
	yield* g.callName(f, live(user), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ scrambles out of ＀!</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You climb out of ＀!</span>", [live(f.src)])]);
	return f.dot;
}, true);

// /obj/item/weapon/his_grace/proc/process  (code/game/objects/items/weapons/his_grace.dm:71)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/process", function* process(f: Frame) {
	let master: Value = null, targets: Value = null, L: Value = null;
	let $0: any, $e: any;
	f.vars = () => [master, targets, L, $0, $e];
	if (!truthy(rt.sv(f, "bloodthirst"))) {
		yield* g.srcCall(f, "drowse");
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "bloodthirst"), 140)) {
		yield* g.srcCall(f, "adjust_bloodthirst", add(1, (yield* g.call(f, P("/proc/Floor"), null, [multiply(rt.length(rt.sv(f, "contents")), 0.5)]))));
	} else {
		yield* g.srcCall(f, "adjust_bloodthirst", 1);
	}
	if ((truthy((rt.istype((master = (yield* g.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]))), T("/mob/living")) ? 1 : 0)) && truthy((rt.isIn(f, live(f.src), rt.fv(f, "held_items", live(master))) ? 1 : 0)))) {
		$0 = rt.sv(f, "bloodthirst");
		if (rt.inRange($0, 140, 160)) {
			yield* g.callName(f, live(master), "visible_message", [fmt("<span class='boldwarning'>＀ turns on ＀!</span>", [live(f.src), live(master)]), fmt("<span class='his_grace big bold'>＀ turns on you!</span>", [live(f.src)])]);
			yield* g.srcCall(f, "do_attack_animation", live(master), null, live(f.src));
			yield* g.callName(f, live(master), "emote", ["scream"]);
			yield* g.callName(f, live(master), "remove_status_effect", [T("/datum/status_effect/his_grace")]);
			(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
			yield* g.callName(f, live(master), "Knockdown", [60]);
			yield* g.callName(f, live(master), "adjustBruteLoss", [rt.fv(f, "maxHealth", live(master))]);
			yield* g.call(f, P("/proc/playsound"), null, [live(master), rt.rsc("sound/effects/splat.ogg"), 100, 0]);
		} else {
			yield* g.callName(f, live(master), "apply_status_effect", [T("/datum/status_effect/his_grace")]);
		}
		return live(f.dot);
	}
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(f.src), 0));
	if (rt.lt(rt.sv(f, "bloodthirst"), 140)) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "bloodthirst"), 160)) {
		yield* g.srcCall(f, "drowse");
		return live(f.dot);
	}
	targets = rt.list();
	L = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [2, live(f.src)])), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L = $e;
		targets = rt.modify(live(targets), live(L), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.length(live(targets)))) {
		return live(f.dot);
	}
	L = rt.op(f, "PickUnweighted", [1], [live(targets)]);
	yield* g.call(f, P("/proc/step_to"), null, [live(f.src), live(L)]);
	if (!truthy((yield* g.srcCall(f, "Adjacent", live(L))))) return f.dot;
	if (!truthy(rt.fv(f, "stat", live(L)))) {
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='warning'>＀ lunges at ＀!</span>", [live(f.src), live(L)]), fmt("<span class='his_grace big bold'>＀ lunges at you!</span>", [live(f.src)])]);
		yield* g.srcCall(f, "do_attack_animation", live(L), null, live(f.src));
		yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/weapons/smash.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/misc/desceration-01.ogg"), 50, 1]);
		yield* g.callName(f, live(L), "adjustBruteLoss", [rt.sv(f, "force")]);
		yield* g.srcCall(f, "adjust_bloodthirst", -5);
	} else {
		yield* g.srcCall(f, "consume", live(L));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/his_grace/proc/awaken  (code/game/objects/items/weapons/his_grace.dm:121)
rt.def("/obj/item/weapon/his_grace/proc/awaken", function awaken(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "awakened"))) {
		return live(f.dot);
	}
	rt.setSv(f, "awakened", 1);
	rt.callName(f, live(user), "visible_message", [fmt("<span class='boldwarning'>＀ begins to rattle. He thirsts.</span>", [live(f.src)]), fmt("<span class='his_grace'>You flick ＀'s latch up. You hope this is a good idea.</span>", [live(f.src)])]);
	rt.setSv(f, "name", "His Grace");
	rt.setSv(f, "desc", "A bloodthirsty artifact created by a profane rite.");
	rt.setSv(f, "gender", "male");
	rt.callSrc(f, "adjust_bloodthirst", [1]);
	rt.setSv(f, "force_bonus", multiply(4, rt.length(rt.sv(f, "contents"))));
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/effects/pope_entry.ogg"), 100]);
	rt.setSv(f, "icon_state", "his_grace_awakened");
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob" }] });

// /obj/item/weapon/his_grace/proc/drowse  (code/game/objects/items/weapons/his_grace.dm:131)
rt.def("/obj/item/weapon/his_grace/proc/drowse", function drowse(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (!truthy(rt.sv(f, "awakened"))) {
		return live(f.dot);
	}
	rt.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "visible_message", [fmt("<span class='boldwarning'>＀ slowly stops rattling and falls still, His latch snapping closed.</span>", [live(f.src)])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/batonextend.ogg"), 100, 1]);
	rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.setSv(f, "gender", rt.initial(f, live(f.src), "gender"));
	rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
	rt.setSv(f, "force_bonus", rt.initial(f, live(f.src), "force_bonus"));
	rt.setSv(f, "awakened", 0);
	rt.setSv(f, "bloodthirst", 0);
	return f.dot;
});

// /obj/item/weapon/his_grace/proc/consume  (code/game/objects/items/weapons/his_grace.dm:146)  may sleep
rt.def("/obj/item/weapon/his_grace/proc/consume", function* consume(f: Frame, meal: Value) {
	f.vars = () => [meal];
	if (!truthy(live(meal))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(meal), "visible_message", [fmt("<span class='warning'>＀ swings open and devours ＀!</span>", [live(f.src), live(meal)]), fmt("<span class='his_grace big bold'>＀ consumes you!</span>", [live(f.src)])]);
	yield* g.callName(f, live(meal), "adjustBruteLoss", [200]);
	yield* g.call(f, P("/proc/playsound"), null, [live(meal), rt.rsc("sound/misc/desceration-02.ogg"), 75, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/eatfood.ogg"), 100, 1]);
	yield* g.callName(f, live(meal), "forceMove", [live(f.src)]);
	rt.modSrcVar(f, "force_bonus", 4, add);
	rt.setSv(f, "prev_bloodthirst", rt.sv(f, "bloodthirst"));
	if (rt.lt(rt.sv(f, "prev_bloodthirst"), 140)) {
		rt.setSv(f, "bloodthirst", (yield* g.call(f, P("/proc/max"), null, [rt.length(rt.sv(f, "contents")), 1])));
	} else {
		rt.setSv(f, "bloodthirst", 140);
	}
	yield* g.srcCall(f, "update_stats");
	return f.dot;
}, true);

// /obj/item/weapon/his_grace/proc/adjust_bloodthirst  (code/game/objects/items/weapons/his_grace.dm:162)
rt.def("/obj/item/weapon/his_grace/proc/adjust_bloodthirst", function adjust_bloodthirst(f: Frame, amt: Value) {
	rt.setSv(f, "prev_bloodthirst", rt.sv(f, "bloodthirst"));
	if (rt.lt(rt.sv(f, "prev_bloodthirst"), 140)) {
		rt.setSv(f, "bloodthirst", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "bloodthirst"), live(amt)), 140])]));
	} else {
		rt.setSv(f, "bloodthirst", rt.call(f, P("/proc/max"), null, [140, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "bloodthirst"), live(amt)), 160])]));
	}
	rt.callSrc(f, "update_stats", []);
	return f.dot;
});

// /obj/item/weapon/his_grace/proc/update_stats  (code/game/objects/items/weapons/his_grace.dm:170)
rt.def("/obj/item/weapon/his_grace/proc/update_stats", function update_stats(f: Frame) {
	let master: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $4: any;
	f.vars = () => [master, $0, $1, $2, $3, $4];
	(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
	master = rt.call(f, P("/proc/get_atom_on_turf"), null, [live(f.src), T("/mob/living")]);
	$0 = rt.sv(f, "bloodthirst");
	if (rt.inRange($0, 140, 160)) {
		if (rt.gt(140, rt.sv(f, "prev_bloodthirst"))) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='userdanger'>＀ enters a frenzy!</span>", [live(f.src)])]);
		}
	} else if (rt.inRange($0, 120, 140)) {
		(rt.modSrcVar(f, "flags", 2, rt.bitOr));
		if (rt.gt(120, rt.sv(f, "prev_bloodthirst"))) {
			$0 = live(master);
			$1 = fmt("<span class='boldwarning'>＀ is starving!</span>", [live(f.src)]);
			$2 = live(f.src);
			$3 = live(f.src);
			if (rt.lt(rt.sv(f, "force_bonus"), 15)) {
				$4 = " And still, His power grows.";
			} else {
				$4 = "";
			}
			rt.callName(f, $0, "visible_message", [$1, fmt("<span class='his_grace big'>＀'s bloodlust overcomes you. ＀ must be fed, or you will become His meal.＀</span>", [$2, $3, $4])]);
			rt.setSv(f, "force_bonus", rt.call(f, P("/proc/max"), null, [rt.sv(f, "force_bonus"), 15]));
		}
	} else if (rt.inRange($0, 100, 120)) {
		(rt.modSrcVar(f, "flags", 2, rt.bitOr));
		if (rt.gt(100, rt.sv(f, "prev_bloodthirst"))) {
			$0 = live(master);
			$1 = fmt("<span class='warning'>＀ is very hungry!</span>", [live(f.src)]);
			$2 = live(f.src);
			if (rt.lt(rt.sv(f, "force_bonus"), 10)) {
				$3 = " His power grows.";
			} else {
				$3 = "";
			}
			rt.callName(f, $0, "visible_message", [$1, fmt("<span class='his_grace big'>Spines sink into your hand. ＀ must feed immediately.＀</span>", [$2, $3])]);
			rt.setSv(f, "force_bonus", rt.call(f, P("/proc/max"), null, [rt.sv(f, "force_bonus"), 10]));
		}
		if (rt.ge(rt.sv(f, "prev_bloodthirst"), 120)) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='warning'>＀ is now only very hungry!</span>", [live(f.src)]), "<span class='his_grace big'>Your bloodlust recedes.</span>"]);
		}
	} else if (rt.inRange($0, 60, 100)) {
		if (rt.gt(60, rt.sv(f, "prev_bloodthirst"))) {
			$0 = live(master);
			$1 = fmt("<span class='warning'>＀ is getting hungry.</span>", [live(f.src)]);
			$2 = live(f.src);
			if (rt.lt(rt.sv(f, "force_bonus"), 5)) {
				$3 = " His power grows.";
			} else {
				$3 = "";
			}
			rt.callName(f, $0, "visible_message", [$1, fmt("<span class='his_grace big'>You feel ＀'s hunger within you.＀</span>", [$2, $3])]);
			rt.setSv(f, "force_bonus", rt.call(f, P("/proc/max"), null, [rt.sv(f, "force_bonus"), 5]));
		}
		if (rt.ge(rt.sv(f, "prev_bloodthirst"), 100)) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='warning'>＀ is now only somewhat hungry.</span>", [live(f.src)]), fmt("<span class='his_grace'>＀'s hunger recedes a little...</span>", [live(f.src)])]);
		}
	} else if (rt.inRange($0, 20, 60)) {
		if (rt.gt(20, rt.sv(f, "prev_bloodthirst"))) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='warning'>＀ is feeling snackish.</span>", [live(f.src)]), fmt("<span class='his_grace'>＀ begins to hunger.</span>", [live(f.src)])]);
		}
		if (rt.ge(rt.sv(f, "prev_bloodthirst"), 60)) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='warning'>＀ is now only a little peckish.</span>", [live(f.src)]), fmt("<span class='his_grace big'>＀'s hunger recedes somewhat...</span>", [live(f.src)])]);
		}
	} else if (rt.inRange($0, 0, 20)) {
		if (rt.ge(rt.sv(f, "prev_bloodthirst"), 20)) {
			rt.callName(f, live(master), "visible_message", [fmt("<span class='warning'>＀ is satiated.</span>", [live(f.src)]), fmt("<span class='his_grace big'>＀'s hunger recedes...</span>", [live(f.src)])]);
		}
	}
	rt.setSv(f, "force", add(rt.initial(f, live(f.src), "force"), rt.sv(f, "force_bonus")));
	return f.dot;
});
