// From code/modules/food_and_drinks/pizzabox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9978, "/obj/item/pizzabox", "/obj/item", {
	open: 0,
	boxtag: "",
	boxes: null,
	pizza: null,
	bomb: null,
	bomb_active: 0,
	bomb_defused: 1,
	bomb_timer: 1,
	BOMB_TIMER_MIN: 1,
	BOMB_TIMER_MAX: 10,
	item_state: "pizzabox",
	name: "pizza box",
	desc: "A box suited for pizzas.",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "pizzabox1",
}, { const: ["BOMB_TIMER_MIN","BOMB_TIMER_MAX"] });

// /obj/item/pizzabox/proc/<init>  (code/modules/food_and_drinks/pizzabox.dm:18)
rt.def("/obj/item/pizzabox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "boxes", rt.list());
	return f.dot;
});

// /obj/item/pizzabox/proc/New  (code/modules/food_and_drinks/pizzabox.dm:30)  may sleep
rt.def("/obj/item/pizzabox/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/pizzabox/proc/Destroy  (code/modules/food_and_drinks/pizzabox.dm:34)  may sleep
rt.def("/obj/item/pizzabox/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "unprocess");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/pizzabox/proc/update_icon  (code/modules/food_and_drinks/pizzabox.dm:39)
rt.def("/obj/item/pizzabox/proc/update_icon", function update_icon(f: Frame) {
	let box: Value = null, pizza_overlay: Value = null, bomb_overlay: Value = null, tag_overlay: Value = null;
	let $0: any, $1: any;
	f.vars = () => [box, pizza_overlay, bomb_overlay, tag_overlay, $0, $1];
	rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
	if (truthy(rt.sv(f, "open"))) {
		if (truthy(rt.sv(f, "pizza"))) {
			rt.setSv(f, "desc", fmt("＀ It appears to have ＇！ inside. Use your other hand to take it out.", [rt.sv(f, "desc"), rt.sv(f, "pizza")]));
		}
		if (truthy(rt.sv(f, "bomb"))) {
			rt.setSv(f, "desc", fmt("＀ Wait, what?! It has ＇！ inside!", [rt.sv(f, "desc"), rt.sv(f, "bomb")]));
			if (truthy(rt.sv(f, "bomb_defused"))) {
				rt.setSv(f, "desc", fmt("＀ The bomb seems inert. Use your other hand to activate it.", [rt.sv(f, "desc")]));
			}
			if (truthy(rt.sv(f, "bomb_active"))) {
				rt.setSv(f, "desc", fmt("＀ It looks like it's about to go off!", [rt.sv(f, "desc")]));
			}
		}
	} else {
		if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
			$0 = rt.index(rt.sv(f, "boxes"), rt.len(f, rt.sv(f, "boxes")));
		} else {
			$0 = live(f.src);
		}
		box = $0;
		if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
			rt.setSv(f, "desc", fmt("A pile of boxes suited for pizzas. There appears to be ＀ boxes in the pile.", [add(rt.len(f, rt.sv(f, "boxes")), 1)]));
		}
		if (!isEqual(rt.fv(f, "boxtag", live(box)), "")) {
			$0 = rt.sv(f, "desc");
			if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
				$1 = "top box";
			} else {
				$1 = "box";
			}
			rt.setSv(f, "desc", fmt("＀ The ＀'s tag reads: ＀", [$0, $1, rt.fv(f, "boxtag", live(box))]));
		}
	}
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "open"))) {
		rt.setSv(f, "icon_state", "pizzabox_open");
		if (truthy(rt.sv(f, "pizza"))) {
			rt.setSv(f, "icon_state", "pizzabox_messy");
			rt.setFv(f, "pixel_y", (pizza_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", rt.sv(f, "pizza")), rt.fv(f, "icon_state", rt.sv(f, "pizza"))])), -3);
			rt.callSrc(f, "add_overlay", [live(pizza_overlay)]);
		}
		if (truthy(rt.sv(f, "bomb"))) {
			$0 = rt.sv(f, "bomb");
			if (truthy(rt.sv(f, "bomb_active"))) {
				$1 = "active";
			} else {
				$1 = "inactive";
			}
			rt.setFv(f, "icon_state", $0, fmt("pizzabomb_＀", [$1]));
			rt.setFv(f, "pixel_y", (bomb_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.fv(f, "icon", rt.sv(f, "bomb")), rt.fv(f, "icon_state", rt.sv(f, "bomb"))])), 5);
			rt.callSrc(f, "add_overlay", [live(bomb_overlay)]);
		}
	} else {
		rt.setSv(f, "icon_state", fmt("pizzabox＀", [add(rt.len(f, rt.sv(f, "boxes")), 1)]));
		if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
			$0 = rt.index(rt.sv(f, "boxes"), rt.len(f, rt.sv(f, "boxes")));
		} else {
			$0 = live(f.src);
		}
		if (isEqual(rt.gv(f, "boxtag", (box = $0)), "")) return f.dot;
		rt.setFv(f, "pixel_y", (tag_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), "pizzabox_tag"])), multiply(rt.len(f, rt.sv(f, "boxes")), 3));
		rt.callSrc(f, "add_overlay", [live(tag_overlay)]);
	}
	return f.dot;
});

// /obj/item/pizzabox/proc/attack_self  (code/modules/food_and_drinks/pizzabox.dm:79)
rt.def("/obj/item/pizzabox/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (rt.gt(rt.len(f, rt.sv(f, "boxes")), 0)) {
		return live(f.dot);
	}
	rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
	if ((truthy(rt.sv(f, "open")) && !truthy(rt.sv(f, "bomb_defused")))) {
		rt.callSrc(f, "audible_message", [fmt("<span class='warning'>＀ *beep*</span>", [rt.call(f, P("/proc/bicon"), null, [live(f.src)])])]);
		rt.setSv(f, "bomb_active", 1);
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
		}
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/pizzabox/proc/attack_hand  (code/modules/food_and_drinks/pizzabox.dm:89)  may sleep
rt.def("/obj/item/pizzabox/proc/attack_hand", function* attack_hand(f: Frame) {
	let message: Value = null, topbox: Value = null;
	f.vars = () => [message, topbox];
	if (!isEqual((yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", [])), live(f.src))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "open"))) {
		if (truthy(rt.sv(f, "pizza"))) {
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "pizza")]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You take ＀ out of ＀.</span>", [rt.sv(f, "pizza"), live(f.src)])]);
			rt.setSv(f, "pizza", null);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		} else {
			if (truthy(rt.sv(f, "bomb"))) {
				if ((truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_all_cut", []))) && truthy(rt.sv(f, "bomb_defused")))) {
					yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "bomb")]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You carefully remove the ＀ from ＀.</span>", [rt.sv(f, "bomb"), live(f.src)])]);
					rt.setSv(f, "bomb", null);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				} else {
					rt.setSv(f, "bomb_timer", (yield* g.op(f, "Prompt", [32], [rt.sv(f, "bomb_timer"), rt.sv(f, "bomb"), fmt("Set the ＀ timer from ＀ to ＀.", [rt.sv(f, "bomb"), 1, 10]), live(f.args[0]), null])));
					rt.setSv(f, "bomb_timer", (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/Ceiling"), null, [divide(rt.sv(f, "bomb_timer"), 2)])), 10]))])));
					rt.setSv(f, "bomb_defused", 0);
					rt.modGl("bombers", (message = fmt("＀ has trapped a ＀ with ＀ set to ＀ seconds.", [fmt("＀＀ ＀", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.args[0])])), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(f.args[0])]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(f.args[0])])]), live(f.src), rt.sv(f, "bomb"), multiply(rt.sv(f, "bomb_timer"), 2)])), add);
					yield* g.call(f, P("/proc/message_admins"), null, [live(message)]);
					yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ has trapped a ＀ with ＀ set to ＀ seconds.", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])])), live(f.src), rt.sv(f, "bomb"), multiply(rt.sv(f, "bomb_timer"), 2)])]);
					rt.setFv(f, "adminlog", rt.sv(f, "bomb"), fmt("The ＀ in ＀ that ＀ activated has detonated!", [rt.fv(f, "name", rt.sv(f, "bomb")), rt.fv(f, "name", live(f.src)), (yield* g.call(f, P("/proc/key_name"), null, [live(f.args[0])]))]));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You trap ＀ with ＀.</span>", [live(f.src), rt.sv(f, "bomb")])]);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			}
		}
	} else {
		if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
			(rt.modSrcVar(f, "boxes", (topbox = rt.index(rt.sv(f, "boxes"), rt.len(f, rt.sv(f, "boxes")))), subtract));
			yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(topbox)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You remove the topmost ＀ from the stack.</span>", [rt.sv(f, "name")])]);
			yield* g.callName(f, live(topbox), "update_icon", []);
			yield* g.srcCall(f, "update_icon");
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/pizzabox/proc/attackby  (code/modules/food_and_drinks/pizzabox.dm:131)  may sleep
rt.def("/obj/item/pizzabox/proc/attackby", function* attackby(f: Frame) {
	let newbox: Value = null, _add: Value = null, box: Value = null;
	let $0: any, $1: any;
	f.vars = () => [newbox, _add, box, $0, $1];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/pizzabox")) ? 1 : 0))) {
		newbox = live(f.args[0]);
		if ((!truthy(rt.sv(f, "open")) && !truthy(rt.fv(f, "open", live(newbox))))) {
			_add = rt.list();
			_add = rt.modify(live(_add), live(newbox), add);
			_add = rt.modify(live(_add), rt.fv(f, "boxes", live(newbox)), add);
			if (rt.le(add(add(rt.len(f, rt.sv(f, "boxes")), 1), rt.len(f, live(_add))), 5)) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.modSrcVar(f, "boxes", live(_add), add);
				yield* g.callName(f, rt.fv(f, "boxes", live(newbox)), "Cut", []);
				rt.setFv(f, "loc", live(newbox), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ on top of ＀!</span>", [live(newbox), live(f.src)])]);
				yield* g.callName(f, live(newbox), "update_icon", []);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The stack is dangerously high!</span>"]);
			}
		} else {
			$0 = live(f.args[1]);
			if (truthy(rt.sv(f, "open"))) {
				$1 = live(f.src);
			} else {
				$1 = live(newbox);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Close ＀ first!</span>", [$1])]);
		}
	} else {
		if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/pizza")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/snacks/customizable/pizza")) ? 1 : 0)))) {
			if (truthy(rt.sv(f, "open"))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				rt.setSv(f, "pizza", live(f.args[0]));
				rt.setFv(f, "loc", live(f.args[0]), live(f.src));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/bombcore/pizza")) ? 1 : 0))) {
				if ((truthy(rt.sv(f, "open")) && !truthy(rt.sv(f, "bomb")))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/explosive/pizza"), [live(f.src)])));
					rt.setSv(f, "bomb", live(f.args[0]));
					rt.setFv(f, "loc", live(f.args[0]), live(f.src));
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put ＀ in ＀. Sneeki breeki...</span>", [live(f.args[0]), live(f.src)])]);
					yield* g.srcCall(f, "update_icon");
					return live(f.dot);
				} else {
					if (truthy(rt.sv(f, "bomb"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ already has a bomb in it!</span>", [live(f.src)])]);
					}
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
					if (!truthy(rt.sv(f, "open"))) {
						if (truthy(rt.len(f, rt.sv(f, "boxes")))) {
							$0 = rt.index(rt.sv(f, "boxes"), rt.len(f, rt.sv(f, "boxes")));
						} else {
							$0 = live(f.src);
						}
						rt.modField(f, (box = $0), "boxtag", (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), fmt("Write on ＀'s tag:", [live(box)]), live(box), "", 30])), add);
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You write with ＀ on ＀.</span>", [live(f.args[0]), live(f.src)])]);
						yield* g.srcCall(f, "update_icon");
						return live(f.dot);
					}
				} else {
					if (truthy((yield* g.call(f, P("/proc/is_wire_tool"), null, [live(f.args[0])])))) {
						if ((truthy(rt.sv(f, "wires")) && truthy(rt.sv(f, "bomb")))) {
							yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[1])]);
						}
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food")) ? 1 : 0))) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>That's not a pizza!</span>"]);
						}
					}
				}
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/pizzabox/proc/process  (code/modules/food_and_drinks/pizzabox.dm:188)  may sleep
rt.def("/obj/item/pizzabox/proc/process", function* process(f: Frame) {
	if (((truthy(rt.sv(f, "bomb_active")) && !truthy(rt.sv(f, "bomb_defused"))) && rt.gt(rt.sv(f, "bomb_timer"), 0))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/timer.ogg"), 50, 0]);
		rt.incSrcVar(f, "bomb_timer", -1, true);
	}
	if (((truthy(rt.sv(f, "bomb_active")) && !truthy(rt.sv(f, "bomb_defused"))) && rt.le(rt.sv(f, "bomb_timer"), 0))) {
		if (truthy((rt.isIn(f, rt.sv(f, "bomb"), live(f.src)) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "bomb"), "detonate", []);
			yield* g.srcCall(f, "unprocess");
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	}
	if ((!truthy(rt.sv(f, "bomb_active")) || truthy(rt.sv(f, "bomb_defused")))) {
		if (truthy((rt.isIn(f, (rt.sv(f, "bomb_defused") && rt.sv(f, "bomb")), live(f.src)) ? 1 : 0))) {
			yield* g.callName(f, rt.sv(f, "bomb"), "defuse", []);
			rt.setSv(f, "bomb_active", 0);
			yield* g.srcCall(f, "unprocess");
		}
	}
	return live(f.dot);
}, true, { waitfor: false });

// /obj/item/pizzabox/proc/unprocess  (code/modules/food_and_drinks/pizzabox.dm:204)  may sleep
rt.def("/obj/item/pizzabox/proc/unprocess", function* unprocess(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(9979, "/obj/item/pizzabox/bomb", "/obj/item/pizzabox", {});

// /obj/item/pizzabox/bomb/proc/New  (code/modules/food_and_drinks/pizzabox.dm:210)  may sleep
rt.def("/obj/item/pizzabox/bomb/proc/New", function* New(f: Frame) {
	let randompizza: Value = null;
	f.vars = () => [randompizza];
	randompizza = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/reagent_containers/food/snacks/pizza")])), T("/obj/item/weapon/reagent_containers/food/snacks/pizza"))]);
	rt.setSv(f, "pizza", (yield* g.new_(f, live(randompizza), [live(f.src)])));
	rt.setSv(f, "bomb", (yield* g.new_(f, T("/obj/item/weapon/bombcore/pizza"), [live(f.src)])));
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/explosive/pizza"), [live(f.src)])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9980, "/obj/item/pizzabox/margherita", "/obj/item/pizzabox", {});

// /obj/item/pizzabox/margherita/proc/New  (code/modules/food_and_drinks/pizzabox.dm:217)  may sleep
rt.def("/obj/item/pizzabox/margherita/proc/New", function* New(f: Frame) {
	rt.setSv(f, "pizza", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pizza/margherita"), [live(f.src)])));
	rt.setSv(f, "boxtag", "Margherita Deluxe");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9981, "/obj/item/pizzabox/vegetable", "/obj/item/pizzabox", {});

// /obj/item/pizzabox/vegetable/proc/New  (code/modules/food_and_drinks/pizzabox.dm:222)  may sleep
rt.def("/obj/item/pizzabox/vegetable/proc/New", function* New(f: Frame) {
	rt.setSv(f, "pizza", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pizza/vegetable"), [live(f.src)])));
	rt.setSv(f, "boxtag", "Gourmet Vegatable");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9982, "/obj/item/pizzabox/mushroom", "/obj/item/pizzabox", {});

// /obj/item/pizzabox/mushroom/proc/New  (code/modules/food_and_drinks/pizzabox.dm:227)  may sleep
rt.def("/obj/item/pizzabox/mushroom/proc/New", function* New(f: Frame) {
	rt.setSv(f, "pizza", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pizza/mushroom"), [live(f.src)])));
	rt.setSv(f, "boxtag", "Mushroom Special");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(9983, "/obj/item/pizzabox/meat", "/obj/item/pizzabox", {});

// /obj/item/pizzabox/meat/proc/New  (code/modules/food_and_drinks/pizzabox.dm:232)  may sleep
rt.def("/obj/item/pizzabox/meat/proc/New", function* New(f: Frame) {
	rt.setSv(f, "pizza", (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/pizza/meat"), [live(f.src)])));
	rt.setSv(f, "boxtag", "Meatlover's Supreme");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
