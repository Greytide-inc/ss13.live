// From code/modules/clothing/suits/toggles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7809, "/obj/item/clothing/suit/hooded", "/obj/item/clothing/suit", {
	hood: null,
	hoodtype: rt.typePath("/obj/item/clothing/head/hooded/winterhood"),
	actions_types: null,
	hooded: 1,
});

// /obj/item/clothing/suit/hooded/proc/<init>  (code/modules/clothing/suits/toggles.dm:4)
rt.def("/obj/item/clothing/suit/hooded/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_hood")));
	return f.dot;
});

// /obj/item/clothing/suit/hooded/proc/New  (code/modules/clothing/suits/toggles.dm:10)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "MakeHood");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/Destroy  (code/modules/clothing/suits/toggles.dm:14)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "hood")]);
	rt.setSv(f, "hood", null);
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/MakeHood  (code/modules/clothing/suits/toggles.dm:19)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/MakeHood", function* MakeHood(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (truthy(rt.sv(f, "hood"))) return f.dot;
	rt.setFv(f, "suit", (W = (yield* g.new_(f, rt.sv(f, "hoodtype"), [live(f.src)]))), live(f.src));
	rt.setSv(f, "hood", live(W));
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/ui_action_click  (code/modules/clothing/suits/toggles.dm:25)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "ToggleHood");
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/item_action_slot_check  (code/modules/clothing/suits/toggles.dm:28)
rt.def("/obj/item/clothing/suit/hooded/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), 13)) return f.dot;
	return 1;
});

// /obj/item/clothing/suit/hooded/proc/equipped  (code/modules/clothing/suits/toggles.dm:32)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/equipped", function* equipped(f: Frame) {
	if (!isEqual(live(f.args[1]), 13)) {
		yield* g.srcCall(f, "RemoveHood");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/suit/hooded/proc/RemoveHood  (code/modules/clothing/suits/toggles.dm:37)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/RemoveHood", function* RemoveHood(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [H, X, A, $e];
	rt.setFv(f, "icon_state", live(f.src), fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	rt.setSv(f, "suittoggled", 0);
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "hood")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = rt.fv(f, "loc", rt.sv(f, "hood"))), "transferItemToLoc", [rt.sv(f, "hood"), live(f.src), 1]);
		yield* g.callName(f, live(H), "update_inv_wear_suit", []);
	} else {
		yield* g.callName(f, rt.sv(f, "hood"), "forceMove", [live(f.src)]);
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/dropped  (code/modules/clothing/suits/toggles.dm:50)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "RemoveHood");
	return f.dot;
}, true);

// /obj/item/clothing/suit/hooded/proc/ToggleHood  (code/modules/clothing/suits/toggles.dm:54)  may sleep
rt.def("/obj/item/clothing/suit/hooded/proc/ToggleHood", function* ToggleHood(f: Frame) {
	let H: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [H, X, A, $e];
	if (!truthy(rt.sv(f, "suittoggled"))) {
		if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "wear_suit", (H = rt.fv(f, "loc", live(f.src)))), live(f.src))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You must be wearing ＀ to put up the hood!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (truthy(rt.fv(f, "head", live(H)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You're already wearing something on your head!</span>"]);
				return live(f.dot);
			} else {
				if (truthy((yield* g.callName(f, live(H), "equip_to_slot_if_possible", [rt.sv(f, "hood"), 11, 0, 0, 1])))) {
					rt.setSv(f, "suittoggled", 1);
					rt.setFv(f, "icon_state", live(f.src), fmt("＀_t", [rt.initial(f, live(f.src), "icon_state")]));
					yield* g.callName(f, live(H), "update_inv_wear_suit", []);
					X = null;
					rt.forList(f, 0, rt.sv(f, "actions"));
					while (($e = rt.next(f, 0)) !== undefined) {
						X = $e;
						yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
					}
					rt.endFor(f, 0);
				}
			}
		}
	} else {
		yield* g.srcCall(f, "RemoveHood");
	}
	return f.dot;
}, true);

rt.type(8029, "/obj/item/clothing/head/hooded", "/obj/item/clothing/head", {
	suit: null,
});

// /obj/item/clothing/head/hooded/proc/Destroy  (code/modules/clothing/suits/toggles.dm:78)  may sleep
rt.def("/obj/item/clothing/head/hooded/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "suit", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/head/hooded/proc/dropped  (code/modules/clothing/suits/toggles.dm:81)  may sleep
rt.def("/obj/item/clothing/head/hooded/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "suit"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "suit"), "RemoveHood", []);
	return f.dot;
}, true);

// /obj/item/clothing/head/hooded/proc/equipped  (code/modules/clothing/suits/toggles.dm:86)  may sleep
rt.def("/obj/item/clothing/head/hooded/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (isEqual(live(f.args[1]), 11)) return f.dot;
	if (truthy(rt.sv(f, "suit"))) {
		yield* g.callName(f, rt.sv(f, "suit"), "RemoveHood", []);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(7849, "/obj/item/clothing/suit/toggle", "/obj/item/clothing/suit", {});

// /obj/item/clothing/suit/toggle/proc/AltClick  (code/modules/clothing/suits/toggles.dm:96)  may sleep
rt.def("/obj/item/clothing/suit/toggle/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, live(f.args[0]), "canUseTopic", [null, live(f.src), "be_close", 1], rt.Args.Named)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	} else {
		yield* g.srcCall(f, "suit_toggle", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/clothing/suit/toggle/proc/ui_action_click  (code/modules/clothing/suits/toggles.dm:104)  may sleep
rt.def("/obj/item/clothing/suit/toggle/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "suit_toggle");
	return f.dot;
}, true);

// /obj/item/clothing/suit/toggle/proc/suit_toggle  (code/modules/clothing/suits/toggles.dm:109)  may sleep
rt.def("/obj/item/clothing/suit/toggle/proc/suit_toggle", function* suit_toggle(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [X, A, $e];
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return 0;
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You toggle ＀'s ＀.</span>", [live(f.src), rt.sv(f, "togglename")])]);
	if (truthy(rt.fv(f, "suittoggled", live(f.src)))) {
		rt.setFv(f, "icon_state", live(f.src), fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
		rt.setFv(f, "suittoggled", live(f.src), 0);
	} else {
		if (!truthy(rt.fv(f, "suittoggled", live(f.src)))) {
			rt.setFv(f, "icon_state", live(f.src), fmt("＀_t", [rt.initial(f, live(f.src), "icon_state")]));
			rt.setFv(f, "suittoggled", live(f.src), 1);
		}
	}
	yield* g.callName(f, live(f.usr), "update_inv_wear_suit", []);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { verb: { src: 11 } });

// /obj/item/clothing/suit/toggle/proc/examine  (code/modules/clothing/suits/toggles.dm:125)
rt.def("/obj/item/clothing/suit/toggle/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Alt-click on ＀ to toggle the ＀.", [live(f.src), rt.sv(f, "togglename")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/suit/space/hardsuit/proc/New  (code/modules/clothing/suits/toggles.dm:130)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "MakeHelmet");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/Destroy  (code/modules/clothing/suits/toggles.dm:135)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "helmet"))) {
		rt.setFv(f, "suit", rt.sv(f, "helmet"), null);
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "helmet")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "jetpack")]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/head/helmet/space/hardsuit/proc/Destroy  (code/modules/clothing/suits/toggles.dm:142)  may sleep
rt.def("/obj/item/clothing/head/helmet/space/hardsuit/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "suit"))) {
		rt.setFv(f, "helmet", rt.sv(f, "suit"), null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/MakeHelmet  (code/modules/clothing/suits/toggles.dm:146)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/MakeHelmet", function* MakeHelmet(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if (!truthy(rt.sv(f, "helmettype"))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "helmet"))) return f.dot;
	rt.setFv(f, "suit", (W = (yield* g.new_(f, rt.sv(f, "helmettype"), [live(f.src)]))), live(f.src));
	rt.setSv(f, "helmet", live(W));
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/ui_action_click  (code/modules/clothing/suits/toggles.dm:154)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "ToggleHelmet");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/equipped  (code/modules/clothing/suits/toggles.dm:158)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/equipped", function* equipped(f: Frame) {
	if (!truthy(rt.sv(f, "helmettype"))) {
		return live(f.dot);
	}
	if (!isEqual(live(f.args[1]), 13)) {
		yield* g.srcCall(f, "RemoveHelmet");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/clothing/suit/space/hardsuit/proc/RemoveHelmet  (code/modules/clothing/suits/toggles.dm:165)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/RemoveHelmet", function* RemoveHelmet(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	if (!truthy(rt.sv(f, "helmet"))) {
		return live(f.dot);
	}
	rt.setSv(f, "suittoggled", 0);
	if (truthy((rt.istype(rt.fv(f, "loc", rt.sv(f, "helmet")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = rt.fv(f, "loc", rt.sv(f, "helmet"));
		if (truthy(rt.fv(f, "on", rt.sv(f, "helmet")))) {
			yield* g.callName(f, rt.sv(f, "helmet"), "attack_self", [live(H)]);
		}
		yield* g.callName(f, live(H), "transferItemToLoc", [rt.sv(f, "helmet"), live(f.src), 1]);
		yield* g.callName(f, live(H), "update_inv_wear_suit", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>The helmet on the hardsuit disengages.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
	} else {
		yield* g.callName(f, rt.sv(f, "helmet"), "forceMove", [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/dropped  (code/modules/clothing/suits/toggles.dm:180)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "RemoveHelmet");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/hardsuit/proc/ToggleHelmet  (code/modules/clothing/suits/toggles.dm:185)  may sleep
rt.def("/obj/item/clothing/suit/space/hardsuit/proc/ToggleHelmet", function* ToggleHelmet(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	H = rt.fv(f, "loc", live(f.src));
	if (!truthy(rt.sv(f, "helmettype"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "helmet"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "suittoggled"))) {
		if (truthy((rt.istype(rt.fv(f, "loc", live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if (!isEqual(rt.fv(f, "wear_suit", live(H)), live(f.src))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), fmt("<span class='warning'>You must be wearing ＀ to engage the helmet!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (truthy(rt.fv(f, "head", live(H)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='warning'>You're already wearing something on your head!</span>"]);
				return live(f.dot);
			} else {
				if (truthy((yield* g.callName(f, live(H), "equip_to_slot_if_possible", [rt.sv(f, "helmet"), 11, 0, 0, 1])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You engage the helmet on the hardsuit.</span>"]);
					rt.setSv(f, "suittoggled", 1);
					yield* g.callName(f, live(H), "update_inv_wear_suit", []);
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/mecha/mechmove03.ogg"), 50, 1]);
				}
			}
		}
	} else {
		yield* g.srcCall(f, "RemoveHelmet");
	}
	return f.dot;
}, true);
