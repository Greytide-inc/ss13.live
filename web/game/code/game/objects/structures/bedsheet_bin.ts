// From code/game/objects/structures/bedsheet_bin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6951, "/obj/item/weapon/bedsheet", "/obj/item/weapon", {
	throw_speed: 1,
	throw_range: 2,
	name: "bedsheet",
	desc: "A surprisingly soft linen bedsheet.",
	icon: rt.rsc("icons/obj/bedsheets.dmi"),
	icon_state: "sheetwhite",
	item_state: "bedsheet",
	slot_flags: 8192,
	layer: 4,
	throwforce: 0,
	w_class: 1,
	item_color: "white",
	resistance_flags: 4,
	dog_fashion: rt.typePath("/datum/dog_fashion/head/ghost"),
});

// /obj/item/weapon/bedsheet/proc/attack  (code/game/objects/structures/bedsheet_bin.dm:25)  may sleep
rt.def("/obj/item/weapon/bedsheet/proc/attack", function* attack(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/attempt_initiate_surgery"), null, [live(f.src), live(f.args[0]), live(f.args[1])])))) return f.dot;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["M", "user"] });

// /obj/item/weapon/bedsheet/proc/attack_self  (code/game/objects/structures/bedsheet_bin.dm:29)  may sleep
rt.def("/obj/item/weapon/bedsheet/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "drop_item", []);
	if (isEqual(rt.sv(f, "layer"), rt.initial(f, live(f.src), "layer"))) {
		rt.setSv(f, "layer", 4.099999904632568);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You cover yourself with ＀.</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "layer", rt.initial(f, live(f.src), "layer"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You smooth ＀ out beneath you.</span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return live(f.dot);
}, true);

// /obj/item/weapon/bedsheet/proc/attackby  (code/game/objects/structures/bedsheet_bin.dm:40)  may sleep
rt.def("/obj/item/weapon/bedsheet/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) || truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", []))))) {
		yield* g.srcCall(f, "transfer_fingerprints_to", (C = (yield* g.new_(f, T("/obj/item/stack/sheet/cloth"), [rt.getStep(f, live(f.src), 0), 3]))));
		yield* g.callName(f, live(C), "add_fingerprint", [live(f.args[1])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You tear ＀ up.</span>", [live(f.src)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(6980, "/obj/item/weapon/bedsheet/random", "/obj/item/weapon/bedsheet", {
	icon_state: "sheetrainbow",
	item_color: "rainbow",
	name: "random bedsheet",
	desc: "If you're reading this description ingame, something has gone wrong! Honk!",
});

// /obj/item/weapon/bedsheet/random/proc/New  (code/game/objects/structures/bedsheet_bin.dm:204)
rt.def("/obj/item/weapon/bedsheet/random/proc/New", function New(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	rt.setSv(f, "name", rt.initial(f, (B = rt.op(f, "PickUnweighted", [1], [subtract(subtract(rt.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/bedsheet")]), T("/obj/item/weapon/bedsheet")), T("/obj/item/weapon/bedsheet/random"))])), "name"));
	rt.setSv(f, "desc", rt.initial(f, live(B), "desc"));
	rt.setSv(f, "icon_state", rt.initial(f, live(B), "icon_state"));
	rt.setSv(f, "item_state", rt.initial(f, live(B), "item_state"));
	rt.setSv(f, "item_color", rt.initial(f, live(B), "item_color"));
	return f.dot;
});

rt.type(12722, "/obj/structure/bedsheetbin", "/obj/structure", {
	amount: 10,
	sheets: null,
	hidden: null,
	anchored: 1,
	name: "linen bin",
	desc: "It looks rather cosy.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "linenbin-full",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
});

// /obj/structure/bedsheetbin/proc/<init>  (code/game/objects/structures/bedsheet_bin.dm:221)
rt.def("/obj/structure/bedsheetbin/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "sheets", rt.list());
	return f.dot;
});

// /obj/structure/bedsheetbin/proc/examine  (code/game/objects/structures/bedsheet_bin.dm:226)
rt.def("/obj/structure/bedsheetbin/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (rt.lt(rt.sv(f, "amount"), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There are no bed sheets in the bin."]);
	} else {
		if (isEqual(rt.sv(f, "amount"), 1)) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "There is one bed sheet in the bin."]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are ＀ bed sheets in the bin.", [rt.sv(f, "amount")])]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/bedsheetbin/proc/update_icon  (code/game/objects/structures/bedsheet_bin.dm:236)
rt.def("/obj/structure/bedsheetbin/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "amount");
	if ($0 === 0) {
		rt.setSv(f, "icon_state", "linenbin-empty");
	} else if (rt.inRange($0, 1, 5)) {
		rt.setSv(f, "icon_state", "linenbin-half");
	} else {
		rt.setSv(f, "icon_state", "linenbin-full");
	}
	return f.dot;
});

// /obj/structure/bedsheetbin/proc/fire_act  (code/game/objects/structures/bedsheet_bin.dm:247)  may sleep
rt.def("/obj/structure/bedsheetbin/proc/fire_act", function* fire_act(f: Frame) {
	if (truthy(rt.sv(f, "amount"))) {
		rt.setSv(f, "amount", 0);
		yield* g.srcCall(f, "update_icon");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/structure/bedsheetbin/proc/attackby  (code/game/objects/structures/bedsheet_bin.dm:251)  may sleep
rt.def("/obj/structure/bedsheetbin/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	f.vars = () => [I, user, params];
	if (truthy((rt.istype(live(I), T("/obj/item/weapon/bedsheet")) ? 1 : 0))) {
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(I), live(f.src));
		yield* g.callName(f, rt.sv(f, "sheets"), "Add", [live(I)]);
		rt.incSrcVar(f, "amount", 1, true);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(I), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (!((truthy(rt.sv(f, "amount")) && !truthy(rt.sv(f, "hidden"))) && rt.lt(rt.fv(f, "w_class", live(I)), 4))) return f.dot;
		if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＄！ is stuck to your hand, you cannot hide it among the sheets!</span>", [live(I)])]);
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(I), live(f.src));
		rt.setSv(f, "hidden", live(I));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You hide ＀ among the sheets.</span>", [live(I)])]);
	}
	return f.dot;
}, true);

// /obj/structure/bedsheetbin/proc/attack_paw  (code/game/objects/structures/bedsheet_bin.dm:270)  may sleep
rt.def("/obj/structure/bedsheetbin/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/structure/bedsheetbin/proc/attack_hand  (code/game/objects/structures/bedsheet_bin.dm:274)  may sleep
rt.def("/obj/structure/bedsheetbin/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let B: Value = null;
	f.vars = () => [user, B];
	if (truthy(rt.fv(f, "lying", live(user)))) {
		return live(f.dot);
	}
	if (rt.ge(rt.sv(f, "amount"), 1)) {
		rt.incSrcVar(f, "amount", -1, true);
		B = null;
		if (rt.gt(rt.len(f, rt.sv(f, "sheets")), 0)) {
			B = rt.index(rt.sv(f, "sheets"), rt.len(f, rt.sv(f, "sheets")));
			yield* g.callName(f, rt.sv(f, "sheets"), "Remove", [live(B)]);
		} else {
			B = (yield* g.new_(f, T("/obj/item/weapon/bedsheet"), [rt.sv(f, "loc")]));
		}
		rt.setFv(f, "loc", live(B), rt.fv(f, "loc", live(user)));
		yield* g.callName(f, live(user), "put_in_hands", [live(B)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ out of ＀.</span>", [live(B), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
		if (truthy(rt.sv(f, "hidden"))) {
			rt.setFv(f, "loc", rt.sv(f, "hidden"), rt.fv(f, "loc", live(user)));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ falls out of ＀!</span>", [rt.sv(f, "hidden"), live(B)])]);
			rt.setSv(f, "hidden", null);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/structure/bedsheetbin/proc/attack_tk  (code/game/objects/structures/bedsheet_bin.dm:300)  may sleep
rt.def("/obj/structure/bedsheetbin/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let B: Value = null;
	f.vars = () => [user, B];
	if (rt.ge(rt.sv(f, "amount"), 1)) {
		rt.incSrcVar(f, "amount", -1, true);
		B = null;
		if (rt.gt(rt.len(f, rt.sv(f, "sheets")), 0)) {
			B = rt.index(rt.sv(f, "sheets"), rt.len(f, rt.sv(f, "sheets")));
			yield* g.callName(f, rt.sv(f, "sheets"), "Remove", [live(B)]);
		} else {
			B = (yield* g.new_(f, T("/obj/item/weapon/bedsheet"), [rt.sv(f, "loc")]));
		}
		rt.setFv(f, "loc", live(B), rt.sv(f, "loc"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You telekinetically remove ＀ from ＀.</span>", [live(B), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
		if (truthy(rt.sv(f, "hidden"))) {
			rt.setFv(f, "loc", rt.sv(f, "hidden"), rt.sv(f, "loc"));
			rt.setSv(f, "hidden", null);
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);
