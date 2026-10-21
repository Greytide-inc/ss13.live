// From code/game/objects/items/weapons/stunbaton.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5661, "/obj/item/weapon/melee/baton", "/obj/item/weapon/melee", {
	stunforce: 140,
	status: 0,
	cell: null,
	hitcost: 1000,
	throw_hit_chance: 35,
	name: "stunbaton",
	desc: "A stun baton for incapacitating people with.",
	icon_state: "stunbaton",
	item_state: "baton",
	slot_flags: 512,
	force: 10,
	throwforce: 7,
	w_class: 3,
	origin_tech: "combat=2",
	attack_verb: null,
	armor: null,
});

// /obj/item/weapon/melee/baton/proc/<init>  (code/game/objects/items/weapons/stunbaton.dm:11)
rt.def("/obj/item/weapon/melee/baton/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("beaten"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 50, "bio", 0, "rad", 0, "fire", 80, "acid", 80]));
	return f.dot;
});

// /obj/item/weapon/melee/baton/proc/suicide_act  (code/game/objects/items/weapons/stunbaton.dm:24)
rt.def("/obj/item/weapon/melee/baton/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is putting the live ＀ in ＀ mouth! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.sv(f, "name"), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 2;
});

// /obj/item/weapon/melee/baton/proc/Initialize  (code/game/objects/items/weapons/stunbaton.dm:28)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/melee/baton/proc/throw_impact  (code/game/objects/items/weapons/stunbaton.dm:32)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/throw_impact", function* throw_impact(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((truthy(rt.sv(f, "status")) && truthy(rt.op(f, "Prob", [], [rt.sv(f, "throw_hit_chance")]))) && truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "baton_stun", live(f.args[0]));
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(5662, "/obj/item/weapon/melee/baton/loaded", "/obj/item/weapon/melee/baton", {});

// /obj/item/weapon/melee/baton/loaded/proc/Initialize  (code/game/objects/items/weapons/stunbaton.dm:38)  may sleep
rt.def("/obj/item/weapon/melee/baton/loaded/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/melee/baton/proc/deductcharge  (code/game/objects/items/weapons/stunbaton.dm:46)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/deductcharge", function* deductcharge(f: Frame, chrgdeductamt: Value) {
	f.vars = () => [chrgdeductamt];
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	f.dot = (yield* g.callName(f, rt.sv(f, "cell"), "use", [live(chrgdeductamt)]));
	if (!(truthy(rt.sv(f, "status")) && rt.lt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.sv(f, "hitcost")))) return f.dot;
	rt.setSv(f, "status", 0);
	yield* g.srcCall(f, "update_icon");
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 75, 1, -1]);
	return f.dot;
}, true);

// /obj/item/weapon/melee/baton/proc/update_icon  (code/game/objects/items/weapons/stunbaton.dm:56)
rt.def("/obj/item/weapon/melee/baton/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "status"))) {
		rt.setSv(f, "icon_state", fmt("＀_active", [rt.initial(f, live(f.src), "name")]));
	} else {
		if (!truthy(rt.sv(f, "cell"))) {
			rt.setSv(f, "icon_state", fmt("＀_nocell", [rt.initial(f, live(f.src), "name")]));
		} else {
			rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "name")]));
		}
	}
	return f.dot;
});

// /obj/item/weapon/melee/baton/proc/examine  (code/game/objects/items/weapons/stunbaton.dm:63)
rt.def("/obj/item/weapon/melee/baton/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "cell"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>The baton is ＀% charged.</span>", [rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.sv(f, "cell"), "percent", [])])])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The baton does not have a power source installed.</span>"]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/melee/baton/proc/attackby  (code/game/objects/items/weapons/stunbaton.dm:70)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (truthy(rt.sv(f, "cell"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already has a cell.</span>", [live(f.src)])]);
		} else {
			if (rt.lt(rt.fv(f, "maxcharge", live(C)), rt.sv(f, "hitcost"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ requires a higher capacity cell.</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "cell", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You install a cell in ＀.</span>", [live(f.src)])]);
			yield* g.srcCall(f, "update_icon");
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "cell"))) {
				yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
				yield* g.callName(f, rt.sv(f, "cell"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
				rt.setSv(f, "cell", null);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the cell from ＀.</span>", [live(f.src)])]);
				rt.setSv(f, "status", 0);
				yield* g.srcCall(f, "update_icon");
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/melee/baton/proc/attack_self  (code/game/objects/items/weapons/stunbaton.dm:96)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [user, $0, $1, $2];
	if ((truthy(rt.sv(f, "cell")) && rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.sv(f, "hitcost")))) {
		rt.setSv(f, "status", (!truthy(rt.sv(f, "status")) ? 1 : 0));
		$0 = live(user);
		$1 = live(f.src);
		if (truthy(rt.sv(f, "status"))) {
			$1 = $1;
			$2 = "on";
		} else {
			$2 = "off";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ is now ＀.</span>", [$1, $2])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), "sparks", 75, 1, -1]);
	} else {
		rt.setSv(f, "status", 0);
		if (!truthy(rt.sv(f, "cell"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not have a power source!</span>", [live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is out of charge.</span>", [live(f.src)])]);
		}
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/melee/baton/proc/attack  (code/game/objects/items/weapons/stunbaton.dm:110)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/attack", function* attack(f: Frame) {
	let L: Value = null;
	f.vars = () => [L];
	if (((truthy(rt.sv(f, "status")) && truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256))) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ accidentally hits themself with ＀!</span>", [live(f.args[1]), live(f.src)]), fmt("<span class='userdanger'>You accidentally hit yourself with ＀!</span>", [live(f.src)])]);
		yield* g.callName(f, live(f.args[1]), "Knockdown", [multiply(rt.sv(f, "stunforce"), 3)]);
		yield* g.srcCall(f, "deductcharge", rt.sv(f, "hitcost"));
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "check_martial_counter", (L = live(f.args[0])), live(f.args[1]))))) {
			return live(f.dot);
		}
	}
	if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		if (truthy(rt.sv(f, "status"))) {
			if (truthy((yield* g.srcCall(f, "baton_stun", live(f.args[0]), live(f.args[1]))))) {
				yield* g.callName(f, live(f.args[1]), "do_attack_animation", [live(f.args[0])]);
				return live(f.dot);
			}
		} else {
			yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ has prodded ＀ with ＀. Luckily it was off.</span>", [live(f.args[1]), live(f.args[0]), live(f.src)]), fmt("<span class='warning'>＀ has prodded you with ＀. Luckily it was off</span>", [live(f.args[1]), live(f.src)])]);
		}
	} else {
		if (truthy(rt.sv(f, "status"))) {
			yield* g.srcCall(f, "baton_stun", live(f.args[0]), live(f.args[1]));
		}
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/melee/baton/proc/baton_stun  (code/game/objects/items/weapons/stunbaton.dm:142)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/baton_stun", function* baton_stun(f: Frame, L: Value, user: Value) {
	let H: Value = null, R: Value = null;
	f.vars = () => [L, user, H, R];
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((yield* g.callName(f, (H = live(L)), "check_shields", [live(f.src), 0, fmt("＀'s ＀", [live(user), rt.sv(f, "name")]), 1])))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(L), rt.rsc("sound/weapons/genhit.ogg"), 50, 1]);
			return 0;
		}
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		if (((!truthy((R = rt.sv(f, "loc"))) || !truthy(rt.fv(f, "cell", live(R)))) || !truthy((yield* g.callName(f, rt.fv(f, "cell", live(R)), "use", [rt.sv(f, "hitcost")]))))) {
			return 0;
		}
	} else {
		if (!truthy((yield* g.srcCall(f, "deductcharge", rt.sv(f, "hitcost"))))) {
			return 0;
		}
	}
	yield* g.callName(f, live(L), "Knockdown", [rt.sv(f, "stunforce")]);
	yield* g.callName(f, live(L), "apply_effect", ["stutter", rt.sv(f, "stunforce")]);
	if (truthy(live(user))) {
		rt.setFv(f, "lastattacked", live(user), live(L));
		rt.setFv(f, "lastattacker", live(L), live(user));
		yield* g.callName(f, live(L), "visible_message", [fmt("<span class='danger'>＀ has stunned ＀ with ＀!</span>", [live(user), live(L), live(f.src)]), fmt("<span class='userdanger'>＀ has stunned you with ＀!</span>", [live(user), live(f.src)])]);
		yield* g.call(f, P("/proc/add_logs"), null, [live(user), live(L), "stunned"]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1]);
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(L)), "forcesay", [rt.gl("hit_appends")]);
	}
	return 1;
}, true);

// /obj/item/weapon/melee/baton/proc/emp_act  (code/game/objects/items/weapons/stunbaton.dm:174)  may sleep
rt.def("/obj/item/weapon/melee/baton/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.srcCall(f, "deductcharge", divide(1000, live(f.args[0])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

rt.type(5663, "/obj/item/weapon/melee/baton/cattleprod", "/obj/item/weapon/melee/baton", {
	sparkler: 0,
	stunforce: 100,
	hitcost: 2000,
	throw_hit_chance: 10,
	name: "stunprod",
	desc: "An improvised stun baton.",
	icon_state: "stunprod_nocell",
	item_state: "prod",
	w_class: 4,
	force: 3,
	throwforce: 5,
	slot_flags: 1024,
});

// /obj/item/weapon/melee/baton/cattleprod/proc/Initialize  (code/game/objects/items/weapons/stunbaton.dm:193)  may sleep
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "sparkler", (yield* g.new_(f, T("/obj/item/device/assembly/igniter"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/melee/baton/cattleprod/proc/baton_stun  (code/game/objects/items/weapons/stunbaton.dm:197)  may sleep
rt.def("/obj/item/weapon/melee/baton/cattleprod/proc/baton_stun", function* baton_stun(f: Frame) {
	if (!truthy((yield* g.callName(f, rt.sv(f, "sparkler"), "activate", [])))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
