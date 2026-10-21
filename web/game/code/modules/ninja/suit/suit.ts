// From code/modules/ninja/suit/suit.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7760, "/obj/item/clothing/suit/space/space_ninja", "/obj/item/clothing/suit/space", {
	affecting: null,
	cell: null,
	spark_system: null,
	reagent_list: null,
	stored_research: null,
	t_disk: null,
	energyKatana: null,
	n_hood: null,
	n_shoes: null,
	n_gloves: null,
	s_initialized: 0,
	s_coold: 0,
	s_cost: 5,
	s_acost: 25,
	s_delay: 40,
	a_transfer: 20,
	r_maxamount: 80,
	spideros: 0,
	s_active: 0,
	s_busy: 0,
	s_bombs: 10,
	a_boost: 3,
	name: "ninja suit",
	desc: "A unique, vaccum-proof suit of nano-enhanced armor designed specifically for Spider Clan assassins.",
	icon_state: "s-ninja",
	item_state: "s-ninja_suit",
	allowed: null,
	slowdown: 0,
	resistance_flags: 33,
	armor: null,
	strip_delay: 12,
	actions_types: null,
});

// /obj/item/clothing/suit/space/space_ninja/proc/<init>  (code/modules/ninja/suit/suit.dm:32)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "reagent_list", rt.list("omnizine", "salbutamol", "spaceacillin", "charcoal", "nutriment", "radium", "potass_iodide"));
	$0 = $0;
	rt.setSv(f, "stored_research", rt.list());
	$0 = $0;
	rt.setSv(f, "allowed", rt.list(T("/obj/item/weapon/gun"), T("/obj/item/ammo_box"), T("/obj/item/ammo_casing"), T("/obj/item/weapon/melee/baton"), T("/obj/item/weapon/restraints/handcuffs"), T("/obj/item/weapon/tank/internals"), T("/obj/item/weapon/stock_parts/cell")));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 60, "bullet", 50, "laser", 30, "energy", 15, "bomb", 30, "bio", 30, "rad", 30, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/initialize_ninja_suit"), T("/datum/action/item_action/ninjasmoke"), T("/datum/action/item_action/ninjaboost"), T("/datum/action/item_action/ninjapulse"), T("/datum/action/item_action/ninjastar"), T("/datum/action/item_action/ninjanet"), T("/datum/action/item_action/ninja_sword_recall"), T("/datum/action/item_action/ninja_stealth"), T("/datum/action/item_action/toggle_glove")));
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/New  (code/modules/ninja/suit/suit.dm:64)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/New", function* New(f: Frame) {
	let _T: Value = null, reagent_amount: Value = null, reagent_id: Value = null;
	let $0: any, $e: any;
	f.vars = () => [_T, reagent_amount, reagent_id, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	rt.setSv(f, "stored_research", (yield* g.new_(f, T("/list"), [])));
	_T = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/tech")])), T("/datum/tech")));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		rt.modSrcVar(f, "stored_research", (yield* g.new_(f, live(_T), [live(f.src)])), add);
	}
	rt.endFor(f, 0);
	reagent_amount = null;
	reagent_id = null;
	rt.forList(f, 0, rt.sv(f, "reagent_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent_id = $e;
		if (isEqual(live(reagent_id), "radium")) {
			$0 = add(rt.sv(f, "r_maxamount"), multiply(rt.sv(f, "a_boost"), rt.sv(f, "a_transfer")));
		} else {
			$0 = rt.sv(f, "r_maxamount");
		}
		reagent_amount = rt.modify(live(reagent_amount), $0, add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "reagents", (yield* g.new_(f, T("/datum/reagents"), [live(reagent_amount)])));
	rt.setFv(f, "my_atom", rt.sv(f, "reagents"), live(f.src));
	reagent_id = null;
	rt.forList(f, 0, rt.sv(f, "reagent_list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reagent_id = $e;
		if (isEqual(live(reagent_id), "radium")) {
			$0 = (yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(reagent_id), add(rt.sv(f, "r_maxamount"), multiply(rt.sv(f, "a_boost"), rt.sv(f, "a_transfer")))]));
		} else {
			$0 = (yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", [live(reagent_id), rt.sv(f, "r_maxamount")]));
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "cell", (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high"), [])));
	rt.setFv(f, "charge", rt.sv(f, "cell"), 9000);
	rt.setFv(f, "name", rt.sv(f, "cell"), "black power cell");
	rt.setFv(f, "icon_state", rt.sv(f, "cell"), "bscell");
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/Destroy  (code/modules/ninja/suit/suit.dm:94)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "affecting"))) {
		rt.op(f, "Browse", [], [rt.sv(f, "affecting"), null, "window=hack spideros"], false);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/terminate  (code/modules/ninja/suit/suit.dm:100)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/terminate", function* terminate(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "n_hood")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "n_gloves")]);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "n_shoes")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/randomize_param  (code/modules/ninja/suit/suit.dm:108)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/randomize_param", function randomize_param(f: Frame) {
	rt.setSv(f, "s_cost", rt.call(f, P("/proc/rand"), null, [1, 20]));
	rt.setSv(f, "s_acost", rt.call(f, P("/proc/rand"), null, [20, 100]));
	rt.setSv(f, "s_delay", rt.call(f, P("/proc/rand"), null, [10, 100]));
	rt.setSv(f, "s_bombs", rt.call(f, P("/proc/rand"), null, [5, 20]));
	rt.setSv(f, "a_boost", rt.call(f, P("/proc/rand"), null, [1, 7]));
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/lock_suit  (code/modules/ninja/suit/suit.dm:117)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/lock_suit", function* lock_suit(f: Frame, H: Value) {
	f.vars = () => [H];
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (!truthy((yield* g.call(f, P("/proc/is_ninja"), null, [live(H)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), " <B>fÄTaL ÈÈRRoR</B>: 382200-*#00CÖDE <B>RED</B>\nUNAUHORIZED USÈ DETÈCeD\nCoMMÈNCING SUB-R0UIN3 13...\nTÈRMInATING U-U-USÈR..."]);
		yield* g.callName(f, live(H), "gib", []);
		return 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "head", live(H)), T("/obj/item/clothing/head/helmet/space/space_ninja")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>ERROR</span>: 100113 UNABLE TO LOCATE HEAD GEAR\nABORTING..."]);
		return 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "shoes", live(H)), T("/obj/item/clothing/shoes/space_ninja")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>ERROR</span>: 122011 UNABLE TO LOCATE FOOT GEAR\nABORTING..."]);
		return 0;
	}
	if (!truthy((rt.istype(rt.fv(f, "gloves", live(H)), T("/obj/item/clothing/gloves/space_ninja")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='userdanger'>ERROR</span>: 110223 UNABLE TO LOCATE HAND GEAR\nABORTING..."]);
		return 0;
	}
	rt.setSv(f, "affecting", live(H));
	(rt.modSrcVar(f, "flags", 2, rt.bitOr));
	rt.setSv(f, "slowdown", 0);
	rt.setSv(f, "n_hood", rt.fv(f, "head", live(H)));
	(rt.modField(f, rt.sv(f, "n_hood"), "flags", 2, rt.bitOr));
	rt.setSv(f, "n_shoes", rt.fv(f, "shoes", live(H)));
	(rt.modField(f, rt.sv(f, "n_shoes"), "flags", 2, rt.bitOr));
	rt.incField(f, rt.sv(f, "n_shoes"), "slowdown", -1, true);
	rt.setSv(f, "n_gloves", rt.fv(f, "gloves", live(H)));
	(rt.modField(f, rt.sv(f, "n_gloves"), "flags", 2, rt.bitOr));
	return 1;
}, true);

// /obj/item/clothing/suit/space/space_ninja/proc/lockIcons  (code/modules/ninja/suit/suit.dm:145)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/lockIcons", function lockIcons(f: Frame, H: Value) {
	let $0: any;
	f.vars = () => [$0];
	if (isEqual(rt.fv(f, "gender", live(H)), "female")) {
		$0 = "s-ninjanf";
	} else {
		$0 = "s-ninjan";
	}
	rt.setSv(f, "icon_state", $0);
	rt.setFv(f, "icon_state", rt.fv(f, "gloves", live(H)), "s-ninjan");
	rt.setFv(f, "item_state", rt.fv(f, "gloves", live(H)), "s-ninjan");
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/unlock_suit  (code/modules/ninja/suit/suit.dm:153)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/unlock_suit", function unlock_suit(f: Frame) {
	rt.setSv(f, "affecting", null);
	(rt.modSrcVar(f, "flags", 16777213, rt.bitAnd));
	rt.setSv(f, "slowdown", 1);
	rt.setSv(f, "icon_state", "s-ninja");
	if (truthy(rt.sv(f, "n_hood"))) {
		(rt.modField(f, rt.sv(f, "n_hood"), "flags", 16777213, rt.bitAnd));
	}
	if (truthy(rt.sv(f, "n_shoes"))) {
		(rt.modField(f, rt.sv(f, "n_shoes"), "flags", 16777213, rt.bitAnd));
		rt.incField(f, rt.sv(f, "n_shoes"), "slowdown", 1, true);
	}
	if (!truthy(rt.sv(f, "n_gloves"))) return f.dot;
	rt.setFv(f, "icon_state", rt.sv(f, "n_gloves"), "s-ninja");
	rt.setFv(f, "item_state", rt.sv(f, "n_gloves"), "s-ninja");
	(rt.modField(f, rt.sv(f, "n_gloves"), "flags", 16777213, rt.bitAnd));
	rt.setFv(f, "candrain", rt.sv(f, "n_gloves"), 0);
	rt.setFv(f, "draining", rt.sv(f, "n_gloves"), 0);
	return f.dot;
});

// /obj/item/clothing/suit/space/space_ninja/proc/examine  (code/modules/ninja/suit/suit.dm:170)
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "s_initialized"))) return f.dot;
	if (!isEqual(live(f.args[0]), rt.sv(f, "affecting"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("All systems operational. Current energy capacity: <B>＀</B>.", [rt.fv(f, "charge", rt.sv(f, "cell"))])]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "s_active"))) {
		$1 = "active";
	} else {
		$1 = "inactive";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The CLOAK-tech device is <B>＀</B>.", [$1])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are <B>＀</B> smoke bomb５ remaining.", [rt.sv(f, "s_bombs")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There are <B>＀</B> adrenaline booster５ remaining.", [rt.sv(f, "a_boost")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/suit/space/space_ninja/proc/ui_action_click  (code/modules/ninja/suit/suit.dm:179)  may sleep
rt.def("/obj/item/clothing/suit/space/space_ninja/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value, action: Value) {
	f.vars = () => [user, action];
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/initialize_ninja_suit")) ? 1 : 0))) {
		yield* g.srcCall(f, "toggle_on_off");
		return 1;
	}
	if (!truthy(rt.sv(f, "s_initialized"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'><b>ERROR</b>: suit offline.  Please activate suit.</span>"]);
		return 0;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninjasmoke")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninjasmoke");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninjaboost")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninjaboost");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninjapulse")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninjapulse");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninjastar")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninjastar");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninjanet")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninjanet");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninja_sword_recall")) ? 1 : 0))) {
		yield* g.srcCall(f, "ninja_sword_recall");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/ninja_stealth")) ? 1 : 0))) {
		yield* g.srcCall(f, "stealth");
		return 1;
	}
	if (truthy((rt.istype(live(action), T("/datum/action/item_action/toggle_glove")) ? 1 : 0))) {
		yield* g.callName(f, rt.sv(f, "n_gloves"), "toggledrain", []);
		return 1;
	}
	return 0;
}, true);
