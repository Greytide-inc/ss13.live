// From code/modules/clothing/shoes/bananashoes.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8488, "/obj/item/clothing/shoes/clown_shoes/banana_shoes", "/obj/item/clothing/shoes/clown_shoes", {
	on: 0,
	bananium: null,
	name: "mk-honk prototype shoes",
	desc: "Lost prototype of advanced clown tech. Powered by bananium, these shoes leave a trail of chaos in their wake.",
	icon_state: "clown_prototype_off",
	actions_types: null,
});

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/<init>  (code/modules/clothing/shoes/bananashoes.dm:9)
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/New  (code/modules/clothing/shoes/bananashoes.dm:12)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "bananium", (yield* g.new_(f, T("/datum/material_container"), [live(f.src), rt.list("$bananium"), 200000])));
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/step_action  (code/modules/clothing/shoes/bananashoes.dm:17)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/step_action", function* step_action(f: Frame) {
	if (truthy(rt.sv(f, "on"))) {
		if (rt.gt(rt.sv(f, "footstep"), 1)) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/bikehorn.ogg"), 75, 1]);
			rt.setSv(f, "footstep", 0);
		} else {
			rt.incSrcVar(f, "footstep", 1, true);
		}
		yield* g.new_(f, T("/obj/item/weapon/grown/bananapeel/specialpeel"), [rt.getStep(f, live(f.src), (yield* g.call(f, P("/proc/turn"), null, [rt.fv(f, "dir", live(f.usr)), 180])))]);
		yield* g.callName(f, rt.sv(f, "bananium"), "use_amount_type", [100, "$bananium"]);
		if (rt.lt((yield* g.callName(f, rt.sv(f, "bananium"), "amount", ["$bananium"])), 100)) {
			rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
			(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
			yield* g.srcCall(f, "update_icon");
			yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), "<span class='warning'>You ran out of bananium!</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attack_self  (code/modules/clothing/shoes/bananashoes.dm:34)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let sheet_amount: Value = null;
	f.vars = () => [user, sheet_amount];
	if (truthy((sheet_amount = (yield* g.callName(f, rt.sv(f, "bananium"), "retrieve_all", []))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You retrieve ＀ sheets of bananium from the prototype shoes.</span>", [live(sheet_amount)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You cannot retrieve any bananium from the prototype shoes.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attackby  (code/modules/clothing/shoes/bananashoes.dm:41)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let bananium_amount: Value = null;
	f.vars = () => [O, user, params, bananium_amount];
	if (!truthy((yield* g.callName(f, rt.sv(f, "bananium"), "get_item_material_amount", [live(O)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This item has no bananium!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [live(O)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You can't drop ＀!</span>", [live(O)])]);
		return live(f.dot);
	}
	if (truthy((bananium_amount = (yield* g.callName(f, rt.sv(f, "bananium"), "insert_item", [live(O)]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You insert ＀ into the prototype shoes.</span>", [live(O)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You are unable to insert more bananium!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/examine  (code/modules/clothing/shoes/bananashoes.dm:56)
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/examine", function examine(f: Frame) {
	let ban_amt: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [ban_amt, $0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	ban_amt = rt.callName(f, rt.sv(f, "bananium"), "amount", ["$bananium"]);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "on"))) {
		$1 = "enabled";
	} else {
		$1 = "disabled";
	}
	if (truthy(live(ban_amt))) {
		$2 = live(ban_amt);
	} else {
		$2 = "no";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>The shoes are ＀. There is ＀ bananium left.</span>", [$1, $2])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/ui_action_click  (code/modules/clothing/shoes/bananashoes.dm:61)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (truthy((yield* g.callName(f, rt.sv(f, "bananium"), "amount", ["$bananium"])))) {
		rt.setSv(f, "on", (!truthy(rt.sv(f, "on")) ? 1 : 0));
		yield* g.srcCall(f, "update_icon");
		$0 = live(user);
		if (truthy(rt.sv(f, "on"))) {
			$1 = "activate";
		} else {
			$1 = "deactivate";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the prototype shoes.</span>", [$1])]);
		if (truthy(rt.sv(f, "on"))) {
			(rt.modSrcVar(f, "flags", 1024, rt.bitOr));
		} else {
			(rt.modSrcVar(f, "flags", 16776191, rt.bitAnd));
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need bananium to turn the prototype shoes on!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/update_icon  (code/modules/clothing/shoes/bananashoes.dm:74)  may sleep
rt.def("/obj/item/clothing/shoes/clown_shoes/banana_shoes/proc/update_icon", function* update_icon(f: Frame) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [X, A, $e];
	if (truthy(rt.sv(f, "on"))) {
		rt.setSv(f, "icon_state", "clown_prototype_on");
	} else {
		rt.setSv(f, "icon_state", "clown_prototype_off");
	}
	yield* g.callName(f, live(f.usr), "update_inv_shoes", []);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
