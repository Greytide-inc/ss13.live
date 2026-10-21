// From code/game/objects/items/weapons/twohanded.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5611, "/obj/item/weapon/twohanded", "/obj/item/weapon", {
	wielded: 0,
	force_unwielded: 0,
	force_wielded: 0,
	wieldsound: null,
	unwieldsound: null,
});

// /obj/item/weapon/twohanded/proc/unwield  (code/game/objects/items/weapons/twohanded.dm:33)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/unwield", function* unwield(f: Frame, user: Value, show_message: Value) {
	let sf: Value = null, O: Value = null;
	f.vars = () => [user, show_message, sf, O];
	if (live(show_message) === null) {
		show_message = 1;
	}
	if ((!truthy(rt.sv(f, "wielded")) || !truthy(live(user)))) {
		return live(f.dot);
	}
	rt.setSv(f, "wielded", 0);
	if (truthy(rt.sv(f, "force_unwielded"))) {
		rt.setSv(f, "force", rt.sv(f, "force_unwielded"));
	}
	if (truthy((sf = (yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), " (Wielded)"]))))) {
		rt.setSv(f, "name", (yield* g.call(f, P("/proc/copytext"), null, [rt.sv(f, "name"), 1, live(sf)])));
	} else {
		rt.setSv(f, "name", fmt("＀", [rt.initial(f, live(f.src), "name")]));
	}
	yield* g.srcCall(f, "update_icon");
	if (truthy(live(show_message))) {
		if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You free up your module.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You are now carrying ＀ with one hand.</span>", [live(f.src)])]);
		}
	}
	if (truthy(rt.sv(f, "unwieldsound"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "unwieldsound"), 50, 1]);
	}
	if ((truthy((O = (yield* g.callName(f, live(user), "get_inactive_held_item", [])))) && truthy((rt.istype(live(O), T("/obj/item/weapon/twohanded/offhand")) ? 1 : 0)))) {
		yield* g.callName(f, live(O), "unwield", []);
	}
	return live(f.dot);
}, true);

// /obj/item/weapon/twohanded/proc/wield  (code/game/objects/items/weapons/twohanded.dm:59)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/wield", function* wield(f: Frame, user: Value) {
	let O: Value = null;
	f.vars = () => [user, O];
	if (truthy(rt.sv(f, "wielded"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>It's too heavy for you to wield fully.</span>"]);
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(user), "get_inactive_held_item", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need your other hand to be empty!</span>"]);
		return live(f.dot);
	}
	if (rt.lt((yield* g.callName(f, live(user), "get_num_arms", [])), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have enough hands.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "wielded", 1);
	if (truthy(rt.sv(f, "force_wielded"))) {
		rt.setSv(f, "force", rt.sv(f, "force_wielded"));
	}
	rt.setSv(f, "name", fmt("＀ (Wielded)", [rt.sv(f, "name")]));
	yield* g.srcCall(f, "update_icon");
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You dedicate your module to ＀.</span>", [live(f.src)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You grab ＀ with both hands.</span>", [live(f.src)])]);
	}
	if (truthy(rt.sv(f, "wieldsound"))) {
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "wieldsound"), 50, 1]);
	}
	rt.setFv(f, "name", (O = (yield* g.new_(f, T("/obj/item/weapon/twohanded/offhand"), [live(user)]))), fmt("＀ - offhand", [rt.sv(f, "name")]));
	rt.setFv(f, "desc", live(O), fmt("Your second grip on ＀.", [live(f.src)]));
	rt.setFv(f, "wielded", live(O), 1);
	yield* g.callName(f, live(user), "put_in_inactive_hand", [live(O)]);
	return live(f.dot);
}, true);

// /obj/item/weapon/twohanded/proc/dropped  (code/game/objects/items/weapons/twohanded.dm:87)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "wielded"))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "unwield", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/proc/attack_self  (code/game/objects/items/weapons/twohanded.dm:97)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/attack_self", function* attack_self(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "wielded"))) {
		yield* g.srcCall(f, "unwield", live(f.args[0]));
	} else {
		yield* g.srcCall(f, "wield", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/proc/equip_to_best_slot  (code/game/objects/items/weapons/twohanded.dm:104)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/equip_to_best_slot", function* equip_to_best_slot(f: Frame) {
	if (!truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (truthy((rt.istype(live(f.src), T("/obj/item/weapon/twohanded/required")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "unwield", live(f.args[0]));
	return live(f.dot);
}, true, { args: ["M"] });

// /obj/item/weapon/twohanded/proc/equipped  (code/game/objects/items/weapons/twohanded.dm:111)  may sleep
rt.def("/obj/item/weapon/twohanded/proc/equipped", function* equipped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((!truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)]))) && truthy(rt.sv(f, "wielded"))) && !truthy((rt.istype(live(f.src), T("/obj/item/weapon/twohanded/required")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "unwield", live(f.args[0]));
	return f.dot;
}, true, { args: ["user", "slot"] });

rt.type(5624, "/obj/item/weapon/twohanded/offhand", "/obj/item/weapon/twohanded", {
	flags: 130,
	name: "offhand",
	icon_state: "offhand",
	w_class: 5,
	resistance_flags: 115,
});

// /obj/item/weapon/twohanded/offhand/proc/unwield  (code/game/objects/items/weapons/twohanded.dm:126)  may sleep
rt.def("/obj/item/weapon/twohanded/offhand/proc/unwield", function* unwield(f: Frame) {
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	rt.setSv(f, "wielded", 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/offhand/proc/wield  (code/game/objects/items/weapons/twohanded.dm:131)  may sleep
rt.def("/obj/item/weapon/twohanded/offhand/proc/wield", function* wield(f: Frame) {
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	rt.setSv(f, "wielded", 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/offhand/proc/attack_self  (code/game/objects/items/weapons/twohanded.dm:134)  may sleep
rt.def("/obj/item/weapon/twohanded/offhand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let O: Value = null;
	f.vars = () => [user, O];
	if ((truthy((rt.istype((O = (yield* g.callName(f, live(user), "get_inactive_held_item", []))), T("/obj/item/weapon/twohanded")) ? 1 : 0)) && !truthy((rt.istype(live(O), T("/obj/item/weapon/twohanded/offhand")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(5625, "/obj/item/weapon/twohanded/required", "/obj/item/weapon/twohanded", {
	w_class: 5,
});

// /obj/item/weapon/twohanded/required/proc/mob_can_equip  (code/game/objects/items/weapons/twohanded.dm:150)  may sleep
rt.def("/obj/item/weapon/twohanded/required/proc/mob_can_equip", function* mob_can_equip(f: Frame) {
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if ((truthy(rt.sv(f, "wielded")) && !truthy(rt.sv(f, "slot_flags")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ is too cumbersome to carry with anything but your hands!</span>", [live(f.src)])]);
		return 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "equipper", "slot", "disable_warning"] });

// /obj/item/weapon/twohanded/required/proc/attack_hand  (code/game/objects/items/weapons/twohanded.dm:156)  may sleep
rt.def("/obj/item/weapon/twohanded/required/proc/attack_hand", function* attack_hand(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	H = (yield* g.callName(f, live(f.args[0]), "get_inactive_held_item", []));
	if (rt.gt((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	}
	if (live(H) !== null) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is too cumbersome to carry in one hand!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	if (!isEqual(rt.fv(f, "loc", live(f.src)), live(f.args[0]))) {
		yield* g.srcCall(f, "wield", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/required/proc/equipped  (code/game/objects/items/weapons/twohanded.dm:167)  may sleep
rt.def("/obj/item/weapon/twohanded/required/proc/equipped", function* equipped(f: Frame) {
	let slotbit: Value = null, O: Value = null;
	f.vars = () => [slotbit, O];
	yield* g.callSuper(f, [], rt.Args.Same);
	slotbit = (yield* g.call(f, P("/proc/slotdefine2slotbit"), null, [live(f.args[1])]));
	if (truthy(rt.bitAnd(rt.sv(f, "slot_flags"), live(slotbit)))) {
		if ((!truthy((O = (yield* g.callName(f, live(f.args[0]), "is_holding_item_of_type", [T("/obj/item/weapon/twohanded/offhand")])))) || (!truthy(live(O)) || truthy(rt.fv(f, "gc_destroyed", live(O)))))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		return live(f.dot);
	}
	if (isEqual(live(f.args[1]), 4)) {
		yield* g.srcCall(f, "wield", live(f.args[0]));
	} else {
		yield* g.srcCall(f, "unwield", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user", "slot"] });

// /obj/item/weapon/twohanded/required/proc/wield  (code/game/objects/items/weapons/twohanded.dm:181)  may sleep
rt.def("/obj/item/weapon/twohanded/required/proc/wield", function* wield(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "wielded"))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "dropItemToGround", [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/required/proc/unwield  (code/game/objects/items/weapons/twohanded.dm:187)  may sleep
rt.def("/obj/item/weapon/twohanded/required/proc/unwield", function* unwield(f: Frame, user: Value, show_message: Value) {
	f.vars = () => [user, show_message];
	if (live(show_message) === null) {
		show_message = 1;
	}
	if (truthy(live(show_message))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You drop ＀.</span>", [live(f.src)])]);
	}
	yield* g.callSuper(f, [live(user), 0]);
	yield* g.callName(f, live(user), "dropItemToGround", [live(f.src)]);
	return f.dot;
}, true);

rt.type(5633, "/obj/item/weapon/twohanded/fireaxe", "/obj/item/weapon/twohanded", {
	force_unwielded: 5,
	force_wielded: 24,
	icon_state: "fireaxe0",
	name: "fire axe",
	desc: "Truly, the weapon of a madman. Who would think to fight fire with an axe?",
	force: 5,
	throwforce: 15,
	w_class: 4,
	slot_flags: 1024,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/twohanded/fireaxe/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:209)
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "chopped", "cleaved", "torn", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/twohanded/fireaxe/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:213)
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("fireaxe＀", [rt.sv(f, "wielded")]));
	return live(f.dot);
});

// /obj/item/weapon/twohanded/fireaxe/proc/suicide_act  (code/game/objects/items/weapons/twohanded.dm:217)
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ axes ＀self from head to toe! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/twohanded/fireaxe/proc/afterattack  (code/game/objects/items/weapons/twohanded.dm:221)  may sleep
rt.def("/obj/item/weapon/twohanded/fireaxe/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let W: Value = null, G: Value = null;
	f.vars = () => [A, user, proximity, W, G];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	if (truthy((rt.istype(live(A), T("/obj/structure/window")) ? 1 : 0))) {
		yield* g.callName(f, (W = live(A)), "take_damage", [200, "brute", "melee", 0]);
	} else {
		if (!truthy((rt.istype(live(A), T("/obj/structure/grille")) ? 1 : 0))) return f.dot;
		yield* g.callName(f, (G = live(A)), "take_damage", [40, "brute", "melee", 0]);
	}
	return f.dot;
}, true);

rt.type(5613, "/obj/item/weapon/twohanded/dualsaber", "/obj/item/weapon/twohanded", {
	w_class_on: 4,
	hacked: 0,
	brightness_on: 6,
	possible_colors: null,
	throw_speed: 3,
	throw_range: 5,
	light_color: "#00ff00",
	icon_state: "dualsaber0",
	name: "double-bladed energy sword",
	desc: "Handle with care.",
	force: 3,
	throwforce: 5,
	w_class: 2,
	force_unwielded: 3,
	force_wielded: 34,
	wieldsound: rt.rsc("sound/weapons/saberon.ogg"),
	unwieldsound: rt.rsc("sound/weapons/saberoff.ogg"),
	hitsound: "swing_hit",
	armour_penetration: 35,
	origin_tech: "magnets=4;syndicate=5",
	item_color: "green",
	attack_verb: null,
	block_chance: 75,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/twohanded/dualsaber/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:258)
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("red", "blue", "green", "purple"));
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "stabbed", "sliced", "torn", "ripped", "diced", "cut"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]));
	return f.dot;
});

// /obj/item/weapon/twohanded/dualsaber/proc/Initialize  (code/game/objects/items/weapons/twohanded.dm:265)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/Initialize", function* Initialize(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.length(rt.sv(f, "possible_colors")))) return f.dot;
	rt.setSv(f, "item_color", rt.op(f, "PickUnweighted", [1], [rt.sv(f, "possible_colors")]));
	$0 = rt.sv(f, "item_color");
	if ($0 === "red") {
		rt.setSv(f, "light_color", "#FA8282");
	} else if ($0 === "green") {
		rt.setSv(f, "light_color", "#64C864");
	} else if ($0 === "blue") {
		rt.setSv(f, "light_color", "#40CEFF");
	} else if ($0 === "purple") {
		rt.setSv(f, "light_color", "#9B51FF");
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/dualsaber/proc/Destroy  (code/game/objects/items/weapons/twohanded.dm:279)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/dualsaber/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:284)
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "wielded"))) {
		rt.setSv(f, "icon_state", fmt("dualsaber＀＀", [rt.sv(f, "item_color"), rt.sv(f, "wielded")]));
	} else {
		rt.setSv(f, "icon_state", "dualsaber0");
	}
	rt.callSrc(f, "clean_blood", []);
	return f.dot;
});

// /obj/item/weapon/twohanded/dualsaber/proc/attack  (code/game/objects/items/weapons/twohanded.dm:290)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attack", function* attack(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[1]), "has_dna", [])))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "dna", live(f.args[1])), "check_mutation", ["Hulk"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You grip the blade too hard and accidentally close it!</span>"]);
			yield* g.srcCall(f, "unwield");
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[1])), 256)) && truthy(rt.sv(f, "wielded"))) && truthy(rt.op(f, "Prob", [], [40])))) {
		yield* g.srcCall(f, "impale", live(f.args[1]));
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "wielded")) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin"), live(f.args[1])]);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/twohanded/dualsaber/proc/jedi_spin  (code/game/objects/items/weapons/twohanded.dm:303)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin", function* jedi_spin(f: Frame, user: Value) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [user, i, $e];
	i = null;
	rt.forList(f, 0, rt.list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.callName(f, live(user), "setDir", [live(i)]);
		if (isEqual(live(i), 8)) {
			yield* g.callName(f, live(user), "emote", ["flip"]);
		}
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /obj/item/weapon/twohanded/dualsaber/proc/impale  (code/game/objects/items/weapons/twohanded.dm:310)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/impale", function* impale(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You twirl around a bit before losing your balance and impaling yourself on ＀.</span>", [live(f.src)])]);
	if (truthy(rt.sv(f, "force_wielded"))) {
		yield* g.callName(f, live(user), "take_bodypart_damage", [20, 25]);
	} else {
		yield* g.callName(f, live(user), "adjustStaminaLoss", [25]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/dualsaber/proc/hit_reaction  (code/game/objects/items/weapons/twohanded.dm:318)
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/hit_reaction", function hit_reaction(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = "the attack";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 0;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 1;
	}
	if (truthy(rt.sv(f, "wielded"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// /obj/item/weapon/twohanded/dualsaber/proc/attack_hulk  (code/game/objects/items/weapons/twohanded.dm:323)
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attack_hulk", function attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	f.vars = () => [does_attack_animation];
	if (live(does_attack_animation) === null) {
		does_attack_animation = 0;
	}
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't pick up such dangerous item with your meaty hands without losing fingers, better not to!</span>"]);
	return 1;
});

// /obj/item/weapon/twohanded/dualsaber/proc/wield  (code/game/objects/items/weapons/twohanded.dm:327)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/wield", function* wield(f: Frame) {
	if (truthy((yield* g.callName(f, live(f.args[0]), "has_dna", [])))) {
		if (truthy((yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "check_mutation", ["Hulk"])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You lack the grace to wield this!</span>"]);
			return live(f.dot);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	rt.setSv(f, "sharpness", 1);
	rt.setSv(f, "w_class", rt.sv(f, "w_class_on"));
	rt.setSv(f, "hitsound", rt.rsc("sound/weapons/blade1.ogg"));
	if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
		rt.setFv(f, "isprocessing", live(f.src), 1);
		rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	}
	yield* g.srcCall(f, "set_light", rt.sv(f, "brightness_on"));
	return f.dot;
}, true, { args: ["M"] });

// /obj/item/weapon/twohanded/dualsaber/proc/unwield  (code/game/objects/items/weapons/twohanded.dm:340)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/unwield", function* unwield(f: Frame) {
	rt.setSv(f, "sharpness", rt.initial(f, live(f.src), "sharpness"));
	rt.setSv(f, "w_class", rt.initial(f, live(f.src), "w_class"));
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "hitsound", "swing_hit");
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	yield* g.srcCall(f, "set_light", 0);
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/dualsaber/proc/process  (code/game/objects/items/weapons/twohanded.dm:350)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "wielded"))) {
		if (truthy(rt.sv(f, "hacked"))) {
			rt.setSv(f, "light_color", rt.op(f, "PickUnweighted", [4], ["#FA8282", "#64C864", "#40CEFF", "#9B51FF"]));
		}
		yield* g.srcCall(f, "open_flame");
	} else {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/item/weapon/twohanded/dualsaber/proc/ignition_effect  (code/game/objects/items/weapons/twohanded.dm:361)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/ignition_effect", function* ignition_effect(f: Frame, A: Value, user: Value) {
	let in_mouth: Value = null, C: Value = null;
	f.vars = () => [A, user, in_mouth, C];
	if (!truthy(rt.sv(f, "wielded"))) {
		return "";
	}
	in_mouth = "";
	if (truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "wear_mask", (C = live(user))), live(f.src))) {
			in_mouth = ", barely missing their nose";
		}
	}
	f.dot = fmt("<span class='warning'>＀ swings ＀ ＀＀. ＀ light＀ ＀ in the process.</span>", [live(user), (yield* g.callName(f, live(user), "p_their", [])), live(f.src), live(in_mouth), (yield* g.callName(f, live(user), "p_they", [])), (yield* g.callName(f, live(user), "p_s", [])), live(A)]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "hitsound"), (yield* g.srcCall(f, "get_clamped_volume")), 1, -1]);
	yield* g.srcCall(f, "add_fingerprint", live(user));
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/weapon/twohanded/dualsaber/proc/jedi_spin"), live(user)]);
	return f.dot;
}, true);

rt.type(5615, "/obj/item/weapon/twohanded/dualsaber/green", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// /obj/item/weapon/twohanded/dualsaber/green/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:375)
rt.def("/obj/item/weapon/twohanded/dualsaber/green/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("green"));
	return f.dot;
});

rt.type(5616, "/obj/item/weapon/twohanded/dualsaber/red", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// /obj/item/weapon/twohanded/dualsaber/red/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:378)
rt.def("/obj/item/weapon/twohanded/dualsaber/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("red"));
	return f.dot;
});

rt.type(5617, "/obj/item/weapon/twohanded/dualsaber/blue", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// /obj/item/weapon/twohanded/dualsaber/blue/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:381)
rt.def("/obj/item/weapon/twohanded/dualsaber/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("blue"));
	return f.dot;
});

rt.type(5618, "/obj/item/weapon/twohanded/dualsaber/purple", "/obj/item/weapon/twohanded/dualsaber", {
	possible_colors: null,
});

// /obj/item/weapon/twohanded/dualsaber/purple/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:384)
rt.def("/obj/item/weapon/twohanded/dualsaber/purple/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "possible_colors", rt.list("purple"));
	return f.dot;
});

// /obj/item/weapon/twohanded/dualsaber/proc/attackby  (code/game/objects/items/weapons/twohanded.dm:387)  may sleep
rt.def("/obj/item/weapon/twohanded/dualsaber/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (isEqual(rt.sv(f, "hacked"), 0)) {
			rt.setSv(f, "hacked", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>2XRNBW_ENGAGE</span>"]);
			rt.setSv(f, "item_color", "rainbow");
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's starting to look like a triple rainbow - no, nevermind.</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(5635, "/obj/item/weapon/twohanded/spear", "/obj/item/weapon/twohanded", {
	explosive: null,
	war_cry: "AAAAARGH!!!",
	force_unwielded: 10,
	force_wielded: 18,
	throw_speed: 4,
	icon_state: "spearglass0",
	name: "spear",
	desc: "A haphazardly-constructed yet still deadly weapon of ancient design.",
	force: 10,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 20,
	embedded_impact_pain_multiplier: 3,
	armour_penetration: 10,
	materials: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
});

// /obj/item/weapon/twohanded/spear/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:412)
rt.def("/obj/item/weapon/twohanded/spear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 1150, "$glass", 2075]));
	rt.setSv(f, "attack_verb", rt.list("attacked", "poked", "jabbed", "torn", "gored"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 30]));
	return f.dot;
});

// /obj/item/weapon/twohanded/spear/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:424)
rt.def("/obj/item/weapon/twohanded/spear/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "explosive"))) {
		rt.setSv(f, "icon_state", fmt("spearbomb＀", [rt.sv(f, "wielded")]));
	} else {
		rt.setSv(f, "icon_state", fmt("spearglass＀", [rt.sv(f, "wielded")]));
	}
	return f.dot;
});

// /obj/item/weapon/twohanded/spear/proc/afterattack  (code/game/objects/items/weapons/twohanded.dm:429)  may sleep
rt.def("/obj/item/weapon/twohanded/spear/proc/afterattack", function* afterattack(f: Frame, AM: Value, user: Value, proximity: Value) {
	f.vars = () => [AM, user, proximity];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(AM), T("/turf/open")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(truthy(rt.sv(f, "explosive")) && truthy(rt.sv(f, "wielded")))) return f.dot;
	yield* g.callName(f, live(user), "say", [fmt("＀", [rt.sv(f, "war_cry")])]);
	rt.setFv(f, "loc", rt.sv(f, "explosive"), live(AM));
	yield* g.callName(f, rt.sv(f, "explosive"), "prime", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/spear/proc/throw_impact  (code/game/objects/items/weapons/twohanded.dm:441)  may sleep
rt.def("/obj/item/weapon/twohanded/spear/proc/throw_impact", function* throw_impact(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) return f.dot;
	if (!truthy(rt.sv(f, "explosive"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "explosive"), "prime", []);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["target"], waitfor: false });

// /obj/item/weapon/twohanded/spear/proc/AltClick  (code/game/objects/items/weapons/twohanded.dm:448)  may sleep
rt.def("/obj/item/weapon/twohanded/spear/proc/AltClick", function* AltClick(f: Frame) {
	let M: Value = null, input: Value = null;
	f.vars = () => [M, input];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "explosive"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) return f.dot;
	M = rt.sv(f, "loc");
	if (!truthy((input = (yield* g.call(f, P("/proc/stripped_input"), null, [live(M), "What do you want your war cry to be? You will shout it when you hit someone in melee.", null, "", 50]))))) return f.dot;
	rt.setFv(f, "war_cry", live(f.src), live(input));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/spear/proc/CheckParts  (code/game/objects/items/weapons/twohanded.dm:458)  may sleep
rt.def("/obj/item/weapon/twohanded/spear/proc/CheckParts", function* CheckParts(f: Frame) {
	let S: Value = null, G: Value = null;
	f.vars = () => [S, G];
	if (truthy((S = rt.locateIn(f, T("/obj/item/weapon/twohanded/spear"), live(f.args[0]))))) {
		if (truthy(rt.fv(f, "explosive", live(S)))) {
			yield* g.callName(f, rt.fv(f, "explosive", live(S)), "forceMove", [rt.getStep(f, live(f.src), 0)]);
			rt.setFv(f, "explosive", live(S), null);
		}
		(f.args[0] = rt.modify(live(f.args[0]), live(S), subtract));
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((G = rt.locateIn(f, T("/obj/item/weapon/grenade"), rt.sv(f, "contents"))))) {
		rt.setSv(f, "explosive", live(G));
		rt.setSv(f, "name", "explosive lance");
		rt.setSv(f, "desc", fmt("A makeshift spear with ＀ attached to it. Alt+click on the spear to set your war cry!", [live(G)]));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["parts_list"] });

rt.type(5626, "/obj/item/weapon/twohanded/required/chainsaw", "/obj/item/weapon/twohanded/required", {
	force_on: 21,
	on: 0,
	flags: 64,
	throw_speed: 2,
	throw_range: 4,
	name: "chainsaw",
	desc: "A versatile power tool. Useful for limbing trees and delimbing humans.",
	icon_state: "chainsaw_off",
	force: 13,
	w_class: 5,
	throwforce: 13,
	materials: null,
	origin_tech: "materials=3;engineering=4;combat=2",
	attack_verb: null,
	hitsound: "swing_hit",
	sharpness: 1,
	actions_types: null,
});

// /obj/item/weapon/twohanded/required/chainsaw/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:485)
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 13000]));
	rt.setSv(f, "attack_verb", rt.list("sawed", "torn", "cut", "chopped", "diced"));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/startchainsaw")));
	return f.dot;
});

// /obj/item/weapon/twohanded/required/chainsaw/proc/attack_self  (code/game/objects/items/weapons/twohanded.dm:494)  may sleep
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [user, X, A, $0, $1, $2, $e];
	rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "on"))) {
		$1 = $1;
		$2 = "it begins to whirr.";
	} else {
		$2 = "the chain stops moving.";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("As you pull the starting cord dangling from ＀, ＀", [$1, $2])]);
	if (truthy(rt.sv(f, "on"))) {
		$0 = rt.sv(f, "force_on");
	} else {
		$0 = rt.initial(f, live(f.src), "force");
	}
	rt.setSv(f, "force", $0);
	if (truthy(rt.sv(f, "on"))) {
		$0 = rt.sv(f, "force_on");
	} else {
		$0 = rt.initial(f, live(f.src), "force");
	}
	rt.setSv(f, "throwforce", $0);
	if (truthy(rt.sv(f, "on"))) {
		$0 = "on";
	} else {
		$0 = "off";
	}
	rt.setSv(f, "icon_state", fmt("chainsaw_＀", [$0]));
	if (isEqual(rt.sv(f, "hitsound"), "swing_hit")) {
		rt.setSv(f, "hitsound", rt.rsc("sound/weapons/chainsawhit.ogg"));
	} else {
		rt.setSv(f, "hitsound", "swing_hit");
	}
	if (isEqual(live(f.src), (yield* g.callName(f, live(user), "get_active_held_item", [])))) {
		yield* g.callName(f, live(user), "update_inv_hands", []);
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

// /obj/item/weapon/twohanded/required/chainsaw/proc/get_dismemberment_chance  (code/game/objects/items/weapons/twohanded.dm:513)
rt.def("/obj/item/weapon/twohanded/required/chainsaw/proc/get_dismemberment_chance", function get_dismemberment_chance(f: Frame) {
	if (!truthy(rt.sv(f, "wielded"))) return f.dot;
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(5627, "/obj/item/weapon/twohanded/required/chainsaw/doomslayer", "/obj/item/weapon/twohanded/required/chainsaw", {
	force_on: 30,
	name: "THE GREAT COMMUNICATOR",
	desc: "<span class='warning'>VRRRRRRR!!!</span>",
	armour_penetration: 100,
});

// /obj/item/weapon/twohanded/required/chainsaw/doomslayer/proc/hit_reaction  (code/game/objects/items/weapons/twohanded.dm:522)
rt.def("/obj/item/weapon/twohanded/required/chainsaw/doomslayer/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (isEqual(live(attack_type), 3)) {
		rt.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>Ranged attacks just make ＀ angrier!</span>", [live(owner)])]);
		rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")]), 75, 1]);
		return 1;
	}
	return 0;
});

rt.type(5636, "/obj/item/weapon/twohanded/spear/grey_tide", "/obj/item/weapon/twohanded/spear", {
	force_unwielded: 15,
	force_wielded: 25,
	throw_speed: 4,
	icon_state: "spearglass0",
	name: "１Grey Tide",
	desc: "Recovered from the aftermath of a revolt aboard Defense Outpost Theta Aegis, in which a seemingly endless tide of Assistants caused heavy casualities among Nanotrasen military forces.",
	throwforce: 20,
	attack_verb: null,
});

// /obj/item/weapon/twohanded/spear/grey_tide/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:537)
rt.def("/obj/item/weapon/twohanded/spear/grey_tide/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("gored"));
	return f.dot;
});

// /obj/item/weapon/twohanded/spear/grey_tide/proc/afterattack  (code/game/objects/items/weapons/twohanded.dm:540)  may sleep
rt.def("/obj/item/weapon/twohanded/spear/grey_tide/proc/afterattack", function* afterattack(f: Frame) {
	let L: Value = null, M: Value = null;
	f.vars = () => [L, M];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	(rt.modField(f, live(f.args[1]), "faction", fmt("greytide(＃)", [live(f.args[1])]), rt.bitOr));
	if (!truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) return f.dot;
	if (truthy((rt.istype((L = live(f.args[0])), T("/mob/living/simple_animal/hostile/illusion")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(!truthy(rt.fv(f, "stat", live(L))) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	rt.setFv(f, "faction", (M = (yield* g.new_(f, T("/mob/living/simple_animal/hostile/illusion"), [rt.fv(f, "loc", live(f.args[1]))]))), (yield* g.callName(f, rt.fv(f, "faction", live(f.args[1])), "Copy", [])));
	yield* g.callName(f, live(M), "Copy_Parent", [live(f.args[1]), 100, divide(rt.fv(f, "health", live(f.args[1])), 2.5), 12, 30]);
	yield* g.callName(f, live(M), "GiveTarget", [live(L)]);
	return f.dot;
}, true, { args: ["AM", "user", "proximity"] });

rt.type(5637, "/obj/item/weapon/twohanded/pitchfork", "/obj/item/weapon/twohanded", {
	force_unwielded: 7,
	force_wielded: 15,
	icon_state: "pitchfork0",
	name: "pitchfork",
	desc: "A simple tool used for moving hay.",
	force: 7,
	throwforce: 15,
	w_class: 4,
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	armor: null,
	resistance_flags: 2,
});

// /obj/item/weapon/twohanded/pitchfork/proc/<init>  (code/game/objects/items/weapons/twohanded.dm:568)
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("attacked", "impaled", "pierced"));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 30]));
	return f.dot;
});

rt.type(5638, "/obj/item/weapon/twohanded/pitchfork/demonic", "/obj/item/weapon/twohanded/pitchfork", {
	force_unwielded: 19,
	force_wielded: 25,
	name: "demonic pitchfork",
	desc: "A red pitchfork, it looks like the work of the devil.",
	force: 19,
	throwforce: 24,
});

// /obj/item/weapon/twohanded/pitchfork/demonic/proc/Initialize  (code/game/objects/items/weapons/twohanded.dm:580)
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/Initialize", function Initialize(f: Frame) {
	rt.callSrc(f, "set_light", [3, 6, "#FA8282"]);
	return f.dot;
});

// /obj/item/weapon/twohanded/pitchfork/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:595)
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("pitchfork＀", [rt.sv(f, "wielded")]));
	return f.dot;
});

// /obj/item/weapon/twohanded/pitchfork/proc/suicide_act  (code/game/objects/items/weapons/twohanded.dm:598)
rt.def("/obj/item/weapon/twohanded/pitchfork/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ impales ＀self in ＀ abdomen with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_their", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

// /obj/item/weapon/twohanded/pitchfork/demonic/proc/pickup  (code/game/objects/items/weapons/twohanded.dm:602)  may sleep
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/pickup", function* pickup(f: Frame, user: Value) {
	let U: Value = null, H: Value = null;
	f.vars = () => [user, U, H];
	if (!(((truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "mind", live(user)))) && truthy((yield* g.callName(f, live(user), "owns_soul", [])))) && !truthy((yield* g.call(f, P("/proc/is_devil"), null, [live(user)]))))) return f.dot;
	yield* g.callName(f, (U = live(user)), "visible_message", [fmt("<span class='warning'>As ＀ picks ＀ up, ＀'s arms briefly catch fire.</span>", [live(U), live(f.src), live(U)]), fmt("<span class='warning'>\"As you pick up ＀ your arms ignite, reminding you of all your past sins.\"</span>", [live(f.src)])]);
	if (truthy((rt.istype(live(U), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(U)), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [divide(rt.sv(f, "force"), 2), rt.sv(f, "force")])), "fire", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	} else {
		yield* g.callName(f, live(U), "adjustFireLoss", [(yield* g.call(f, P("/proc/rand"), null, [divide(rt.sv(f, "force"), 2), rt.sv(f, "force")]))]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/pitchfork/demonic/proc/attack  (code/game/objects/items/weapons/twohanded.dm:613)  may sleep
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/proc/attack", function* attack(f: Frame) {
	if (((truthy(rt.fv(f, "mind", live(f.args[1]))) && truthy((yield* g.callName(f, live(f.args[1]), "owns_soul", [])))) && !truthy((yield* g.call(f, P("/proc/is_devil"), null, [live(f.args[1])]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class ='warning'>＀ burns in your hands.</span>", [live(f.src)])]);
		yield* g.callName(f, live(f.args[1]), "apply_damage", [(yield* g.call(f, P("/proc/rand"), null, [divide(rt.sv(f, "force"), 2), rt.sv(f, "force")])), "fire", rt.op(f, "PickUnweighted", [2], ["l_arm", "r_arm"])]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

rt.type(5640, "/obj/item/weapon/twohanded/pitchfork/demonic/ascended", "/obj/item/weapon/twohanded/pitchfork/demonic", {
	force_unwielded: 100,
	force_wielded: 500000,
	force: 100,
	throwforce: 100,
});

// /obj/item/weapon/twohanded/pitchfork/demonic/ascended/proc/afterattack  (code/game/objects/items/weapons/twohanded.dm:619)  may sleep
rt.def("/obj/item/weapon/twohanded/pitchfork/demonic/ascended/proc/afterattack", function* afterattack(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	if ((!truthy(live(f.args[2])) || !truthy(rt.sv(f, "wielded")))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/turf/closed/wall")) ? 1 : 0))) {
		W = live(f.args[0]);
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ blasts ％！ with ％！!</span>", [live(f.args[1]), live(f.args[0]), live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/magic/disintegrate.ogg"), 100, 1]);
		yield* g.callName(f, live(W), "break_wall", []);
		return 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "proximity"] });

rt.type(5641, "/obj/item/weapon/twohanded/vibro_weapon", "/obj/item/weapon/twohanded", {
	force_unwielded: 20,
	force_wielded: 40,
	throw_speed: 4,
	icon_state: "hfrequency0",
	name: "vibro sword",
	desc: "A potent weapon capable of cutting through nearly anything. Wielding it in two hands will allow you to deflect gunfire.",
	armour_penetration: 100,
	block_chance: 40,
	throwforce: 20,
	sharpness: 1,
	attack_verb: null,
	w_class: 4,
	slot_flags: 1024,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
});

// /obj/item/weapon/twohanded/vibro_weapon/proc/hit_reaction  (code/game/objects/items/weapons/twohanded.dm:649)
rt.def("/obj/item/weapon/twohanded/vibro_weapon/proc/hit_reaction", function hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	f.vars = () => [attack_text, final_block_chance, damage, attack_type];
	if (live(attack_text) === null) {
		attack_text = "the attack";
	}
	if (live(final_block_chance) === null) {
		final_block_chance = 0;
	}
	if (live(damage) === null) {
		damage = 0;
	}
	if (live(attack_type) === null) {
		attack_type = 1;
	}
	if (truthy(rt.sv(f, "wielded"))) {
		(final_block_chance = rt.modify(live(final_block_chance), 2, multiply));
	}
	if ((truthy(rt.sv(f, "wielded")) || !isEqual(live(attack_type), 3))) {
		if (truthy(rt.op(f, "Prob", [], [live(final_block_chance)]))) {
			if (isEqual(live(attack_type), 3)) {
				rt.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ deflects ＀ with ＀!</span>", [live(owner), live(attack_text), live(f.src)])]);
				rt.call(f, P("/proc/playsound"), null, [live(f.src), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/weapons/bulletflyby.ogg"), rt.rsc("sound/weapons/bulletflyby2.ogg"), rt.rsc("sound/weapons/bulletflyby3.ogg")]), 75, 1]);
				return 1;
			} else {
				rt.callName(f, live(owner), "visible_message", [fmt("<span class='danger'>＀ parries ＀ with ＀!</span>", [live(owner), live(attack_text), live(f.src)])]);
				return 1;
			}
		}
	}
	return 0;
});

// /obj/item/weapon/twohanded/vibro_weapon/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:662)
rt.def("/obj/item/weapon/twohanded/vibro_weapon/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("hfrequency＀", [rt.sv(f, "wielded")]));
	return f.dot;
});

rt.type(5634, "/obj/item/weapon/twohanded/fireaxe/boneaxe", "/obj/item/weapon/twohanded/fireaxe", {
	force_wielded: 23,
	icon_state: "bone_axe0",
	name: "bone axe",
	desc: "A large, vicious axe crafted out of several sharpened bone plates and crudely tied together. Made of monsters, by killing monsters, for killing monsters.",
});

// /obj/item/weapon/twohanded/fireaxe/boneaxe/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:674)
rt.def("/obj/item/weapon/twohanded/fireaxe/boneaxe/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("bone_axe＀", [rt.sv(f, "wielded")]));
	return f.dot;
});

rt.type(5642, "/obj/item/weapon/twohanded/bonespear", "/obj/item/weapon/twohanded", {
	force_unwielded: 11,
	force_wielded: 20,
	throw_speed: 4,
	icon_state: "bone_spear0",
	name: "bone spear",
	desc: "A haphazardly-constructed yet still deadly weapon. The pinnacle of modern technology.",
	force: 11,
	w_class: 4,
	slot_flags: 1024,
	throwforce: 22,
	embedded_impact_pain_multiplier: 3,
	armour_penetration: 15,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// /obj/item/weapon/twohanded/bonespear/proc/update_icon  (code/game/objects/items/weapons/twohanded.dm:697)
rt.def("/obj/item/weapon/twohanded/bonespear/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("bone_spear＀", [rt.sv(f, "wielded")]));
	return f.dot;
});
