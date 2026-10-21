// From code/game/objects/items/weapons/RSF.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7339, "/obj/item/weapon/rsf", "/obj/item/weapon", {
	matter: 0,
	mode: 1,
	anchored: 0,
	flags: 4,
	name: "１Rapid-Service-Fabricator",
	desc: "A device used to rapidly deploy service items.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
	opacity: 0,
	density: 0,
	armor: null,
	w_class: 3,
});

// /obj/item/weapon/rsf/proc/<init>  (code/game/objects/items/weapons/RSF.dm:15)
rt.def("/obj/item/weapon/rsf/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	return f.dot;
});

// /obj/item/weapon/rsf/proc/examine  (code/game/objects/items/weapons/RSF.dm:21)
rt.def("/obj/item/weapon/rsf/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It currently holds ＀/30 fabrication-units.</span>", [rt.sv(f, "matter")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/rsf/proc/attackby  (code/game/objects/items/weapons/RSF.dm:28)  may sleep
rt.def("/obj/item/weapon/rsf/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/rcd_ammo")) ? 1 : 0))) {
		if (rt.gt(add(rt.sv(f, "matter"), 10), 30)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "The RSF can't hold any more matter."]);
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		rt.modSrcVar(f, "matter", 10, add);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 10, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("The RSF now holds ＀/30 fabrication-units.", [rt.sv(f, "matter")])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/rsf/proc/attack_self  (code/game/objects/items/weapons/RSF.dm:40)
rt.def("/obj/item/weapon/rsf/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [$0];
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/pop.ogg"), 50, 0]);
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		rt.setSv(f, "mode", 2);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Drinking Glass'"]);
	} else if ($0 === 2) {
		rt.setSv(f, "mode", 3);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Paper'"]);
	} else if ($0 === 3) {
		rt.setSv(f, "mode", 4);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Pen'"]);
	} else if ($0 === 4) {
		rt.setSv(f, "mode", 5);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Dice Pack'"]);
	} else if ($0 === 5) {
		rt.setSv(f, "mode", 6);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Cigarette'"]);
	} else if ($0 === 6) {
		rt.setSv(f, "mode", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Changed dispensing mode to 'Dosh'"]);
	}
	return f.dot;
});

// /obj/item/weapon/rsf/proc/afterattack  (code/game/objects/items/weapons/RSF.dm:63)  may sleep
rt.def("/obj/item/weapon/rsf/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null, _T: Value = null;
	let $0: any;
	f.vars = () => [A, user, proximity, R, _T, $0];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(A), T("/obj/structure/table")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "matter"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ doesn't have enough matter left.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "cell", (R = live(user)))) || rt.lt(rt.gv(f, "charge", rt.fv(f, "cell", live(R))), 200))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You do not have enough power to use ＀.</span>", [live(f.src)])]);
			return live(f.dot);
		}
	}
	_T = rt.getStep(f, live(A), 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 10, 1]);
	$0 = rt.sv(f, "mode");
	if ($0 === 1) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Dosh..."]);
		yield* g.new_(f, T("/obj/item/stack/spacecash/c10"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 200, live(user));
	} else if ($0 === 2) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Drinking Glass..."]);
		yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/drinkingglass"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 20, live(user));
	} else if ($0 === 3) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Paper Sheet..."]);
		yield* g.new_(f, T("/obj/item/weapon/paper"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 10, live(user));
	} else if ($0 === 4) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Pen..."]);
		yield* g.new_(f, T("/obj/item/weapon/pen"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 50, live(user));
	} else if ($0 === 5) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Dice Pack..."]);
		yield* g.new_(f, T("/obj/item/weapon/storage/pill_bottle/dice"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 200, live(user));
	} else if ($0 === 6) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Dispensing Cigarette..."]);
		yield* g.new_(f, T("/obj/item/clothing/mask/cigarette"), [live(_T)]);
		yield* g.srcCall(f, "use_matter", 10, live(user));
	}
	return f.dot;
}, true);

// /obj/item/weapon/rsf/proc/use_matter  (code/game/objects/items/weapons/RSF.dm:106)
rt.def("/obj/item/weapon/rsf/proc/use_matter", function use_matter(f: Frame, charge: Value, user: Value) {
	let R: Value = null;
	f.vars = () => [R];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		(rt.modField(f, rt.gv(f, "cell", (R = live(user))), "charge", live(charge), subtract));
	} else {
		rt.incSrcVar(f, "matter", -1, true);
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("The RSF now holds ＀/30 fabrication-units.", [rt.sv(f, "matter")])]);
	}
	return f.dot;
});

rt.type(7341, "/obj/item/weapon/cookiesynth", "/obj/item/weapon", {
	matter: 10,
	toxin: 0,
	cooldown: 0,
	cooldowndelay: 10,
	emagged: 0,
	name: "Cookie Synthesizer",
	desc: "A self-recharging device used to rapidly deploy cookies.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "rcd",
	w_class: 3,
});

// /obj/item/weapon/cookiesynth/proc/examine  (code/game/objects/items/weapons/RSF.dm:126)
rt.def("/obj/item/weapon/cookiesynth/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It currently holds ＀/10 cookie-units.</span>", [rt.sv(f, "matter")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/cookiesynth/proc/emag_act  (code/game/objects/items/weapons/RSF.dm:133)
rt.def("/obj/item/weapon/cookiesynth/proc/emag_act", function emag_act(f: Frame, user: Value) {
	rt.setSv(f, "emagged", (!truthy(rt.sv(f, "emagged")) ? 1 : 0));
	if (truthy(rt.sv(f, "emagged"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You short out the ＀'s reagent safety checker!</span>", [live(f.src)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You reset the ＀'s reagent safety checker!</span>", [live(f.src)])]);
		rt.setSv(f, "toxin", 0);
	}
	return f.dot;
});

// /obj/item/weapon/cookiesynth/proc/attack_self  (code/game/objects/items/weapons/RSF.dm:142)
rt.def("/obj/item/weapon/cookiesynth/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let _P: Value = null;
	f.vars = () => [_P];
	_P = null;
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		_P = live(user);
	}
	if ((truthy(rt.sv(f, "emagged")) && !truthy(rt.sv(f, "toxin")))) {
		rt.setSv(f, "toxin", 1);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "Cookie Synthesizer Hacked"]);
	} else {
		if ((truthy(rt.fv(f, "emagged", live(_P))) && !truthy(rt.sv(f, "toxin")))) {
			rt.setSv(f, "toxin", 1);
			rt.call(f, P("/proc/to_chat"), null, [live(user), "Cookie Synthesizer Hacked"]);
		} else {
			rt.setSv(f, "toxin", 0);
			rt.call(f, P("/proc/to_chat"), null, [live(user), "Cookie Synthesizer Reset"]);
		}
	}
	return f.dot;
});

// /obj/item/weapon/cookiesynth/proc/process  (code/game/objects/items/weapons/RSF.dm:155)
rt.def("/obj/item/weapon/cookiesynth/proc/process", function process(f: Frame) {
	if (!rt.lt(rt.sv(f, "matter"), 10)) return f.dot;
	rt.incSrcVar(f, "matter", 1, true);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/weapon/cookiesynth/proc/afterattack  (code/game/objects/items/weapons/RSF.dm:159)  may sleep
rt.def("/obj/item/weapon/cookiesynth/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null, _T: Value = null, S: Value = null, R_2: Value = null;
	f.vars = () => [A, user, proximity, R, _T, S, R_2];
	if (rt.gt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		return live(f.dot);
	}
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!(truthy((rt.istype(live(A), T("/obj/structure/table")) ? 1 : 0)) || truthy((rt.istype(live(A), T("/turf/open/floor")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "matter"), 1)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ doesn't have enough matter left. Wait for it to recharge!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if ((!truthy(rt.gv(f, "cell", (R = live(user)))) || rt.lt(rt.gv(f, "charge", rt.fv(f, "cell", live(R))), 400))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You do not have enough power to use ＀.</span>", [live(f.src)])]);
			return live(f.dot);
		}
	}
	_T = rt.getStep(f, live(A), 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 10, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Fabricating Cookie.."]);
	S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), [live(_T)]));
	if (truthy(rt.sv(f, "toxin"))) {
		yield* g.callName(f, rt.fv(f, "reagents", live(S)), "add_reagent", ["chloralhydrate2", 10]);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		(rt.modField(f, rt.gv(f, "cell", (R_2 = live(user))), "charge", 100, subtract));
	} else {
		rt.incSrcVar(f, "matter", -1, true);
	}
	rt.setSv(f, "cooldown", add(rt.worldTime(f), rt.sv(f, "cooldowndelay")));
	return f.dot;
}, true);
