// From code/game/objects/items/weapons/inducer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7267, "/obj/item/weapon/inducer", "/obj/item/weapon", {
	powertransfer: 1000,
	opened: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell/high"),
	cell: null,
	recharging: 0,
	name: "inducer",
	desc: "A tool for inductively charging internal power cells.",
	icon: rt.rsc("icons/obj/tools.dmi"),
	icon_state: "inducer-engi",
	item_state: "inducer-engi",
	origin_tech: "engineering=4;magnets=4;powerstorage=4",
	force: 7,
});

// /obj/item/weapon/inducer/proc/Initialize  (code/game/objects/items/weapons/inducer.dm:16)  may sleep
rt.def("/obj/item/weapon/inducer/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(!truthy(rt.sv(f, "cell")) && truthy(rt.sv(f, "cell_type")))) return f.dot;
	rt.setSv(f, "cell", (yield* g.new_(f, rt.sv(f, "cell_type"), [])));
	return f.dot;
}, true);

// /obj/item/weapon/inducer/proc/induce  (code/game/objects/items/weapons/inducer.dm:21)  may sleep
rt.def("/obj/item/weapon/inducer/proc/induce", function* induce(f: Frame, target: Value, coefficient: Value) {
	let totransfer: Value = null, transferred: Value = null;
	f.vars = () => [target, coefficient, totransfer, transferred];
	totransfer = (yield* g.call(f, P("/proc/min"), null, [rt.fv(f, "charge", rt.sv(f, "cell")), multiply(rt.sv(f, "powertransfer"), live(coefficient))]));
	transferred = (yield* g.callName(f, live(target), "give", [live(totransfer)]));
	yield* g.callName(f, rt.sv(f, "cell"), "use", [live(transferred)]);
	yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
	yield* g.callName(f, live(target), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/weapon/inducer/proc/emp_act  (code/game/objects/items/weapons/inducer.dm:31)  may sleep
rt.def("/obj/item/weapon/inducer/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "cell"), "emp_act", [live(f.args[0])]);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/inducer/proc/attack_obj  (code/game/objects/items/weapons/inducer.dm:36)  may sleep
rt.def("/obj/item/weapon/inducer/proc/attack_obj", function* attack_obj(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.srcCall(f, "cantbeused", live(f.args[1]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "recharge", live(f.args[0]), live(f.args[1]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["O", "user"] });

// /obj/item/weapon/inducer/proc/cantbeused  (code/game/objects/items/weapons/inducer.dm:48)
rt.def("/obj/item/weapon/inducer/proc/cantbeused", function cantbeused(f: Frame, user: Value) {
	if (!truthy(rt.callName(f, live(user), "IsAdvancedToolUser", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't have the dexterity to use ％！!</span>", [live(f.src)])]);
		return 1;
	}
	if (!truthy(rt.sv(f, "cell"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ doesn't have a power cell installed!</span>", [live(f.src)])]);
		return 1;
	}
	if (!truthy(rt.fv(f, "charge", rt.sv(f, "cell")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！'s battery is dead!</span>", [live(f.src)])]);
		return 1;
	}
	return 0;
});

// /obj/item/weapon/inducer/proc/attackby  (code/game/objects/items/weapons/inducer.dm:63)  may sleep
rt.def("/obj/item/weapon/inducer/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (!truthy(rt.sv(f, "opened"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unscrew the battery compartment.</span>"]);
			rt.setSv(f, "opened", 1);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You close the battery compartment.</span>"]);
			rt.setSv(f, "opened", 0);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/stock_parts/cell")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "opened"))) {
			if (!truthy(rt.sv(f, "cell"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ％！ into ％！.</span>", [live(f.args[0]), live(f.src)])]);
				rt.setSv(f, "cell", live(f.args[0]));
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＄！ already has ＇！ installed!</span>", [live(f.src), rt.sv(f, "cell")])]);
				return live(f.dot);
			}
		}
	}
	if (truthy((yield* g.srcCall(f, "cantbeused", live(f.args[1]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "recharge", live(f.args[0]), live(f.args[1]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "user"] });

// /obj/item/weapon/inducer/proc/recharge  (code/game/objects/items/weapons/inducer.dm:98)  may sleep
rt.def("/obj/item/weapon/inducer/proc/recharge", function* recharge(f: Frame, A: Value, user: Value) {
	let C: Value = null, E: Value = null, O: Value = null, coefficient: Value = null;
	f.vars = () => [A, user, C, E, O, coefficient];
	if (truthy(rt.sv(f, "recharging"))) {
		return 1;
	} else {
		rt.setSv(f, "recharging", 1);
	}
	C = (yield* g.callName(f, live(A), "get_cell", []));
	E = null;
	O = null;
	coefficient = 1;
	if (truthy((rt.istype(live(A), T("/obj/item/weapon/gun/energy")) ? 1 : 0))) {
		coefficient = 0.07500000298023224;
		E = live(A);
	}
	if (truthy((rt.istype(live(A), T("/obj")) ? 1 : 0))) {
		O = live(A);
	}
	if (truthy(live(C))) {
		if (rt.ge(rt.fv(f, "charge", live(C)), rt.fv(f, "maxcharge", live(C)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＄！ is fully charged!</span>", [live(A)])]);
			rt.setSv(f, "recharging", 0);
			return 1;
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ starts recharging ％！ with ％！", [live(user), live(A), live(f.src)]), fmt("<span class='notice'>You start recharging ＀ with ％！</span>", [live(A), live(f.src)])]);
		while (rt.lt(rt.fv(f, "charge", live(C)), rt.fv(f, "maxcharge", live(C)))) {
			if (truthy(live(E))) {
				rt.setFv(f, "chambered", live(E), null);
			}
			if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 10, "target", live(user)], rt.Args.Named))) && truthy(rt.fv(f, "charge", rt.sv(f, "cell"))))) {
				yield* g.srcCall(f, "induce", live(C), live(coefficient));
				yield* g.call(f, P("/proc/do_sparks"), null, [1, 0, live(A)]);
				if (truthy(live(O))) {
					yield* g.callName(f, live(O), "update_icon", []);
				}
			} else {
				break;
			}
		}
		if (truthy(live(E))) {
			yield* g.callName(f, live(E), "recharge_newshot", []);
		}
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ recharged ％！!", [live(user), live(A)]), fmt("<span class='notice'>You recharged ％！!</span>", [live(A)])]);
		rt.setSv(f, "recharging", 0);
		return 1;
	}
	rt.setSv(f, "recharging", 0);
	return f.dot;
}, true);

// /obj/item/weapon/inducer/proc/attack  (code/game/objects/items/weapons/inducer.dm:135)  may sleep
rt.def("/obj/item/weapon/inducer/proc/attack", function* attack(f: Frame) {
	if (isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (truthy((yield* g.srcCall(f, "cantbeused", live(f.args[1]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "recharge", live(f.args[0]), live(f.args[1]))))) {
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user"] });

// /obj/item/weapon/inducer/proc/attack_self  (code/game/objects/items/weapons/inducer.dm:147)  may sleep
rt.def("/obj/item/weapon/inducer/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy(rt.sv(f, "opened")) && truthy(rt.sv(f, "cell")))) return f.dot;
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ removes ％！ from ％！!", [live(user), rt.sv(f, "cell"), live(f.src)]), fmt("<span class='notice'>You remove ％！.</span>", [rt.sv(f, "cell")])]);
	yield* g.callName(f, rt.sv(f, "cell"), "update_icon", []);
	yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "cell")]);
	rt.setSv(f, "cell", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/inducer/proc/examine  (code/game/objects/items/weapons/inducer.dm:156)
rt.def("/obj/item/weapon/inducer/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "cell"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>It's display shows: ＀W</span>", [rt.fv(f, "charge", rt.sv(f, "cell"))])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It's display is dark.</span>"]);
	}
	if (!truthy(rt.sv(f, "opened"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>It's battery compartment is open.</span>"]);
	return f.dot;
}, false, { args: ["M"] });

// /obj/item/weapon/inducer/proc/update_icon  (code/game/objects/items/weapons/inducer.dm:165)
rt.def("/obj/item/weapon/inducer/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "opened"))) return f.dot;
	if (!truthy(rt.sv(f, "cell"))) {
		rt.callSrc(f, "add_overlay", ["inducer-nobat"]);
	} else {
		rt.callSrc(f, "add_overlay", ["inducer-bat"]);
	}
	return f.dot;
});

rt.type(7268, "/obj/item/weapon/inducer/sci", "/obj/item/weapon/inducer", {
	cell_type: null,
	powertransfer: 500,
	opened: 1,
	icon_state: "inducer-sci",
	item_state: "inducer-sci",
	desc: "A tool for inductively charging internal power cells. This one has a science color scheme, and is less potent than it's engineering counterpart.",
});

// /obj/item/weapon/inducer/sci/proc/Initialize  (code/game/objects/items/weapons/inducer.dm:181)  may sleep
rt.def("/obj/item/weapon/inducer/sci/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);
