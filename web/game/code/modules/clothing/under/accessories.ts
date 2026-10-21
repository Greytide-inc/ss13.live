// From code/modules/clothing/under/accessories.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8626, "/obj/item/clothing/accessory", "/obj/item/clothing", {
	above_suit: 0,
	minimize_when_attached: 1,
	name: "Accessory",
	desc: "Something has gone wrong!",
	icon: rt.rsc("icons/obj/clothing/accessories.dmi"),
	icon_state: "plasma",
	item_state: "",
	item_color: "plasma",
	slot_flags: 0,
	w_class: 2,
});

// /obj/item/clothing/accessory/proc/attach  (code/modules/clothing/under/accessories.dm:15)
rt.def("/obj/item/clothing/accessory/proc/attach", function attach(f: Frame, U: Value, user: Value) {
	let armor_type: Value = null;
	let $e: any;
	f.vars = () => [armor_type, $e];
	if (truthy(rt.sv(f, "pockets"))) {
		if (truthy(rt.fv(f, "pockets", live(U)))) {
			return 0;
		}
		rt.setFv(f, "loc", rt.sv(f, "pockets"), live(U));
		rt.setFv(f, "pockets", live(U), rt.sv(f, "pockets"));
	}
	rt.setFv(f, "attached_accessory", live(U), live(f.src));
	rt.setSv(f, "loc", live(U));
	rt.setSv(f, "layer", -1);
	rt.setSv(f, "plane", -32767);
	if (truthy(rt.sv(f, "minimize_when_attached"))) {
		(rt.modSrcVar(f, "transform", 0.5, multiply));
		rt.modSrcVar(f, "pixel_x", 8, add);
		(rt.modSrcVar(f, "pixel_y", 8, subtract));
	}
	rt.callName(f, live(U), "add_overlay", [live(f.src)]);
	armor_type = null;
	rt.forList(f, 0, rt.sv(f, "armor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		armor_type = $e;
		rt.modAt(rt.fv(f, "armor", live(U)), live(armor_type), rt.index(rt.sv(f, "armor"), live(armor_type)), add);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		rt.callSrc(f, "on_uniform_equip", [live(U), live(user)]);
	}
	return 1;
});

// /obj/item/clothing/accessory/proc/detach  (code/modules/clothing/under/accessories.dm:41)
rt.def("/obj/item/clothing/accessory/proc/detach", function detach(f: Frame, U: Value, user: Value) {
	let armor_type: Value = null;
	let $e: any;
	f.vars = () => [armor_type, $e];
	if ((truthy(rt.sv(f, "pockets")) && isEqual(rt.sv(f, "pockets"), rt.fv(f, "pockets", live(U))))) {
		rt.setFv(f, "loc", rt.sv(f, "pockets"), live(f.src));
		rt.setFv(f, "pockets", live(U), null);
	}
	armor_type = null;
	rt.forList(f, 0, rt.sv(f, "armor"));
	while (($e = rt.next(f, 0)) !== undefined) {
		armor_type = $e;
		(rt.modAt(rt.fv(f, "armor", live(U)), live(armor_type), rt.index(rt.sv(f, "armor"), live(armor_type)), subtract));
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		rt.callSrc(f, "on_uniform_dropped", [live(U), live(user)]);
	}
	if (truthy(rt.sv(f, "minimize_when_attached"))) {
		(rt.modSrcVar(f, "transform", 2, multiply));
		(rt.modSrcVar(f, "pixel_x", 8, subtract));
		rt.modSrcVar(f, "pixel_y", 8, add);
	}
	rt.setSv(f, "layer", rt.initial(f, live(f.src), "layer"));
	rt.setSv(f, "plane", rt.initial(f, live(f.src), "plane"));
	rt.callName(f, live(U), "cut_overlays", []);
	rt.setFv(f, "attached_accessory", live(U), null);
	rt.setFv(f, "accessory_overlay", live(U), null);
	return f.dot;
});

// /obj/item/clothing/accessory/proc/AltClick  (code/modules/clothing/under/accessories.dm:68)
rt.def("/obj/item/clothing/accessory/proc/AltClick", function AltClick(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (!truthy(rt.initial(f, live(f.src), "above_suit"))) return f.dot;
	rt.setSv(f, "above_suit", (!truthy(rt.sv(f, "above_suit")) ? 1 : 0));
	$0 = live(f.usr);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "above_suit"))) {
		$1 = $1;
		$2 = "above";
	} else {
		$2 = "below";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＄！ will be worn ＀ your suit.", [$1, $2])]);
	return f.dot;
});

// /obj/item/clothing/accessory/proc/examine  (code/modules/clothing/under/accessories.dm:73)
rt.def("/obj/item/clothing/accessory/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＄！ can be attached to a uniform. Alt-click to remove it once attached.</span>", [live(f.src)])]);
	if (!truthy(rt.initial(f, live(f.src), "above_suit"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＄！ can be worn above or below your suit. Alt-click to toggle.</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(8629, "/obj/item/clothing/accessory/medal", "/obj/item/clothing/accessory", {
	medaltype: "medal",
	commended: 0,
	name: "bronze medal",
	desc: "A bronze medal.",
	icon_state: "bronze",
	item_color: "bronze",
	materials: null,
	resistance_flags: 2,
});

// /obj/item/clothing/accessory/medal/proc/<init>  (code/modules/clothing/under/accessories.dm:103)
rt.def("/obj/item/clothing/accessory/medal/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1000]));
	return f.dot;
});

// /obj/item/clothing/accessory/medal/proc/attack  (code/modules/clothing/under/accessories.dm:110)  may sleep
rt.def("/obj/item/clothing/accessory/medal/proc/attack", function* attack(f: Frame) {
	let U: Value = null, delay: Value = null, input: Value = null;
	f.vars = () => [U, delay, input];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0)) && isEqual(rt.fv(f, "a_intent", live(f.args[1])), "help"))) {
		if (truthy(rt.fv(f, "wear_suit", live(f.args[0])))) {
			if (truthy(rt.bitAnd(rt.gv(f, "flags_inv", rt.fv(f, "wear_suit", live(f.args[0]))), 4))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Medals can only be pinned on jumpsuits.</span>"]);
				return live(f.dot);
			}
		}
		if (truthy(rt.fv(f, "w_uniform", live(f.args[0])))) {
			U = rt.fv(f, "w_uniform", live(f.args[0]));
			delay = 20;
			if (isEqual(live(f.args[1]), live(f.args[0]))) {
				delay = 0;
			} else {
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is trying to pin ＀ on ＀'s chest.", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You try to pin ＀ on ＀'s chest.</span>", [live(f.src), live(f.args[0])])]);
			}
			input = null;
			if ((!truthy(rt.sv(f, "commended")) && !isEqual(live(f.args[1]), live(f.args[0])))) {
				input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Please input a reason for this commendation, it will be recorded by Nanotrasen.", null, "", 140]));
			}
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, live(delay), "target", live(f.args[0])], rt.Args.Named)))) {
				if (truthy((yield* g.callName(f, live(U), "attach_accessory", [live(f.src), live(f.args[1]), 0])))) {
					if (isEqual(live(f.args[1]), live(f.args[0]))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach ＀ to ＀.</span>", [live(f.src), live(U)])]);
					} else {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ pins ％！ on ＀'s chest.", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You pin ％！ on ＀'s chest.</span>", [live(f.src), live(f.args[0])])]);
						if (truthy(live(input))) {
							rt.modGl("commendations", fmt("＀ awarded <b>＀</b> the <font color='blue'>＀</font>! \n- ＀", [rt.fv(f, "real_name", live(f.args[1])), rt.fv(f, "real_name", live(f.args[0])), rt.sv(f, "name"), live(input)]), add);
							rt.setSv(f, "commended", 1);
							yield* g.call(f, P("/proc/log_game"), null, [fmt("<b>＀</b> was given the following commendation by <b>＀</b>: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), live(input)])]);
							yield* g.call(f, P("/proc/message_admins"), null, [fmt("<b>＀</b> was given the following commendation by <b>＀</b>: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])])), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[1])])), live(input)])]);
						}
					}
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Medals can only be pinned on jumpsuits!</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(8632, "/obj/item/clothing/accessory/medal/silver", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-silver",
	name: "silver medal",
	desc: "A silver medal.",
	icon_state: "silver",
	item_color: "silver",
	materials: null,
});

// /obj/item/clothing/accessory/medal/silver/proc/<init>  (code/modules/clothing/under/accessories.dm:160)
rt.def("/obj/item/clothing/accessory/medal/silver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$silver", 1000]));
	return f.dot;
});

rt.type(8635, "/obj/item/clothing/accessory/medal/gold", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-gold",
	name: "gold medal",
	desc: "A prestigious golden medal.",
	icon_state: "gold",
	item_color: "gold",
	materials: null,
});

// /obj/item/clothing/accessory/medal/gold/proc/<init>  (code/modules/clothing/under/accessories.dm:176)
rt.def("/obj/item/clothing/accessory/medal/gold/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$gold", 1000]));
	return f.dot;
});

rt.type(8638, "/obj/item/clothing/accessory/medal/plasma", "/obj/item/clothing/accessory/medal", {
	medaltype: "medal-plasma",
	name: "plasma medal",
	desc: "An eccentric medal made of plasma.",
	icon_state: "plasma",
	item_color: "plasma",
	armor: null,
	materials: null,
});

// /obj/item/clothing/accessory/medal/plasma/proc/<init>  (code/modules/clothing/under/accessories.dm:193)
rt.def("/obj/item/clothing/accessory/medal/plasma/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", -10, "acid", 0]));
	rt.setSv(f, "materials", rt.alist(f, ["$plasma", 1000]));
	return f.dot;
});

// /obj/item/clothing/accessory/medal/plasma/proc/temperature_expose  (code/modules/clothing/under/accessories.dm:197)  may sleep
rt.def("/obj/item/clothing/accessory/medal/plasma/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [air, exposed_temperature, exposed_volume];
	if (!rt.gt(live(exposed_temperature), 300)) return f.dot;
	yield* g.srcCall(f, "atmos_spawn_air", fmt("plasma=20;TEMP=＀", [live(exposed_temperature)]));
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'> ＄！ bursts into flame!</span>", [live(f.src)]), fmt("<span class='userdanger'>Your ＀ bursts into flame!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(8648, "/obj/item/clothing/accessory/lawyers_badge", "/obj/item/clothing/accessory", {
	name: "attorney's badge",
	desc: "Fills you with the conviction of JUSTICE. Lawyers tend to want to show it to everyone they meet.",
	icon_state: "lawyerbadge",
	item_color: "lawyerbadge",
});

// /obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_equip  (code/modules/clothing/under/accessories.dm:269)
rt.def("/obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_equip", function on_uniform_equip(f: Frame, U: Value, user: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((L = live(user)))) return f.dot;
	rt.setFv(f, "bubble_icon", live(L), "lawyer");
	return f.dot;
});

// /obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_dropped  (code/modules/clothing/under/accessories.dm:274)
rt.def("/obj/item/clothing/accessory/lawyers_badge/proc/on_uniform_dropped", function on_uniform_dropped(f: Frame, U: Value, user: Value) {
	let L: Value = null;
	f.vars = () => [L];
	if (!truthy((L = live(user)))) return f.dot;
	rt.setFv(f, "bubble_icon", live(L), rt.initial(f, live(L), "bubble_icon"));
	return f.dot;
});

rt.type(8652, "/obj/item/clothing/accessory/talisman", "/obj/item/clothing/accessory", {
	name: "bone talisman",
	desc: "A hunter's talisman, some say the old gods smile on those who wear it.",
	icon_state: "talisman",
	item_color: "talisman",
	armor: null,
});

// /obj/item/clothing/accessory/talisman/proc/<init>  (code/modules/clothing/under/accessories.dm:304)
rt.def("/obj/item/clothing/accessory/talisman/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 5, "bomb", 20, "bio", 20, "rad", 5, "fire", 0, "acid", 25]));
	return f.dot;
});

rt.type(8653, "/obj/item/clothing/accessory/skullcodpiece", "/obj/item/clothing/accessory", {
	above_suit: 1,
	name: "skull codpiece",
	desc: "A skull shaped ornament, intended to protect the important things in life.",
	icon_state: "skull",
	item_color: "skull",
	armor: null,
});

// /obj/item/clothing/accessory/skullcodpiece/proc/<init>  (code/modules/clothing/under/accessories.dm:313)
rt.def("/obj/item/clothing/accessory/skullcodpiece/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 5, "bullet", 5, "laser", 5, "energy", 5, "bomb", 20, "bio", 20, "rad", 5, "fire", 0, "acid", 25]));
	return f.dot;
});
