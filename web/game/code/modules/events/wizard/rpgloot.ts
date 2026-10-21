// From code/modules/events/wizard/rpgloot.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(349, "/datum/round_event/wizard/rpgloot", "/datum/round_event/wizard", {});

// /datum/round_event/wizard/rpgloot/proc/start  (code/modules/events/wizard/rpgloot.dm:10)  may sleep
rt.def("/datum/round_event/wizard/rpgloot/proc/start", function* start(f: Frame) {
	let upgrade_scroll_chance: Value = null, I: Value = null, S: Value = null, scroll: Value = null;
	let $e: any;
	f.vars = () => [upgrade_scroll_chance, I, S, scroll, $e];
	upgrade_scroll_chance = 0;
	I = null;
	rt.forList(f, 0, rt.world(), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (!truthy((rt.istype(rt.fv(f, "rpg_loot", live(I)), T("/datum/rpg_loot")) ? 1 : 0))) {
			rt.setFv(f, "rpg_loot", live(I), (yield* g.new_(f, T("/datum/rpg_loot"), [live(I)])));
		}
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/storage")) ? 1 : 0))) {
			S = live(I);
			if (((truthy(rt.op(f, "Prob", [], [live(upgrade_scroll_chance)])) && rt.lt(rt.getLen(f, rt.fv(f, "contents", live(S))), rt.fv(f, "storage_slots", live(S)))) && !truthy(rt.fv(f, "invisibility", live(S))))) {
				scroll = (yield* g.new_(f, T("/obj/item/upgradescroll"), []));
				yield* g.callName(f, live(S), "handle_item_insertion", [live(scroll), 1]);
				upgrade_scroll_chance = (yield* g.call(f, P("/proc/max"), null, [0, subtract(live(upgrade_scroll_chance), 100)]));
			}
			upgrade_scroll_chance = rt.modify(live(upgrade_scroll_chance), 25, add);
		}
	}
	rt.endFor(f, 0);
	rt.setGl("rpg_loot_items", 1);
	return f.dot;
}, true);

rt.type(9976, "/obj/item/upgradescroll", "/obj/item", {
	upgrade_amount: 1,
	can_backfire: 1,
	one_use: 1,
	w_class: 1,
	name: "item fortification scroll",
	desc: "Somehow, this piece of paper can be applied to items to make them \"better\". Apparently there's a risk of losing the item if it's already \"too good\". <i>This all feels so arbitrary...</i>",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll",
});

// /obj/item/upgradescroll/proc/afterattack  (code/modules/events/wizard/rpgloot.dm:36)  may sleep
rt.def("/obj/item/upgradescroll/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let rpg_loot_datum: Value = null, quality: Value = null;
	f.vars = () => [target, user, proximity, rpg_loot_datum, quality];
	if ((!truthy(live(proximity)) || !truthy((rt.istype(live(target), T("/obj/item")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype((rpg_loot_datum = rt.fv(f, "rpg_loot", live(target))), T("/datum/rpg_loot")) ? 1 : 0))) {
		rpg_loot_datum = (yield* g.new_(f, T("/datum/rpg_loot"), [live(target)]));
	}
	quality = rt.fv(f, "quality", live(rpg_loot_datum));
	if ((truthy(rt.sv(f, "can_backfire")) && (rt.gt(live(quality), 9) && truthy(rt.op(f, "Prob", [], [multiply(subtract(live(quality), 9), 10)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ violently glows blue for a while, then evaporates.</span>", [live(target)])]);
		yield* g.callName(f, live(target), "burn", []);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ glows blue and seems vaguely \"better\"!</span>", [live(target)])]);
		yield* g.callName(f, live(rpg_loot_datum), "modify", [rt.sv(f, "upgrade_amount")]);
	}
	if (!truthy(rt.sv(f, "one_use"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(2315, "/datum/rpg_loot", "/datum", {
	positive_prefix: "okay",
	negative_prefix: "weak",
	suffix: "something profound",
	quality: 0,
	attached: null,
	original_name: null,
});

// /datum/rpg_loot/proc/New  (code/modules/events/wizard/rpgloot.dm:71)
rt.def("/datum/rpg_loot/proc/New", function New(f: Frame, attached_item: Value) {
	f.vars = () => [attached_item];
	if (live(attached_item) === null) {
		attached_item = null;
	}
	rt.setSv(f, "attached", live(attached_item));
	rt.callSrc(f, "randomise", []);
	return f.dot;
});

// /datum/rpg_loot/proc/Destroy  (code/modules/events/wizard/rpgloot.dm:76)
rt.def("/datum/rpg_loot/proc/Destroy", function Destroy(f: Frame) {
	rt.setSv(f, "attached", null);
	return f.dot;
});

// /datum/rpg_loot/proc/randomise  (code/modules/events/wizard/rpgloot.dm:83)
rt.def("/datum/rpg_loot/proc/randomise", function randomise(f: Frame) {
	let new_quality: Value = null;
	f.vars = () => [new_quality];
	new_quality = rt.op(f, "PickWeighted", [16], [1, 15, 2, 14, 2, 13, 2, 12, 3, 11, 3, 10, 3, 9, 4, 8, 4, 7, 4, 6, 5, 5, 5, 4, 5, 3, 6, 2, 6, 1, 6, 0]);
	rt.setSv(f, "suffix", rt.op(f, "PickUnweighted", [1], [rt.gl("suffixes")]));
	rt.setSv(f, "positive_prefix", rt.op(f, "PickUnweighted", [1], [rt.gl("prefixespositive")]));
	rt.setSv(f, "negative_prefix", rt.op(f, "PickUnweighted", [1], [rt.gl("prefixesnegative")]));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		new_quality = rt.neg(live(new_quality));
	}
	rt.callSrc(f, "modify", [live(new_quality)]);
	return f.dot;
});

// /datum/rpg_loot/proc/rename  (code/modules/events/wizard/rpgloot.dm:95)
rt.def("/datum/rpg_loot/proc/rename", function rename(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	I = rt.sv(f, "attached");
	if (!truthy(rt.sv(f, "original_name"))) {
		rt.setSv(f, "original_name", rt.fv(f, "name", live(I)));
	}
	if (rt.lt(rt.sv(f, "quality"), 0)) {
		rt.setFv(f, "name", live(I), fmt("＀ ＀ of ＀ ＀", [rt.sv(f, "negative_prefix"), rt.sv(f, "original_name"), rt.sv(f, "suffix"), rt.sv(f, "quality")]));
	} else {
		if (isEqual(rt.sv(f, "quality"), 0)) {
			rt.setFv(f, "name", live(I), fmt("＀ of ＀", [rt.sv(f, "original_name"), rt.sv(f, "suffix")]));
		} else {
			if (!rt.gt(rt.sv(f, "quality"), 0)) return f.dot;
			rt.setFv(f, "name", live(I), fmt("＀ ＀ of ＀ +＀", [rt.sv(f, "positive_prefix"), rt.sv(f, "original_name"), rt.sv(f, "suffix"), rt.sv(f, "quality")]));
		}
	}
	return f.dot;
});

// /datum/rpg_loot/proc/modify  (code/modules/events/wizard/rpgloot.dm:106)
rt.def("/datum/rpg_loot/proc/modify", function modify(f: Frame, quality_mod: Value) {
	let I: Value = null, value: Value = null;
	let $e: any;
	f.vars = () => [I, value, $e];
	I = rt.sv(f, "attached");
	rt.modSrcVar(f, "quality", live(quality_mod), add);
	rt.setFv(f, "force", live(I), rt.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "force", live(I)), live(quality_mod))]));
	rt.setFv(f, "throwforce", live(I), rt.call(f, P("/proc/max"), null, [0, add(rt.fv(f, "throwforce", live(I)), live(quality_mod))]));
	value = null;
	rt.forList(f, 0, rt.fv(f, "armor", live(I)));
	while (($e = rt.next(f, 0)) !== undefined) {
		value = $e;
		rt.modAt(rt.fv(f, "armor", live(I)), live(value), rt.sv(f, "quality"), add);
	}
	rt.endFor(f, 0);
	rt.callSrc(f, "rename", []);
	return f.dot;
});
