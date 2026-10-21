// From code/modules/clothing/shoes/magboots.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8489, "/obj/item/clothing/shoes/magboots", "/obj/item/clothing/shoes", {
	magboot_state: "magboots",
	magpulse: 0,
	slowdown_active: 2,
	desc: "Magnetic boots, often used during extravehicular activity to ensure the user remains safely attached to the vehicle.",
	name: "magboots",
	icon_state: "magboots0",
	actions_types: null,
	strip_delay: 70,
	equip_delay_other: 70,
	resistance_flags: 2,
	origin_tech: "materials=3;magnets=4;engineering=4",
});

// /obj/item/clothing/shoes/magboots/proc/<init>  (code/modules/clothing/shoes/magboots.dm:8)
rt.def("/obj/item/clothing/shoes/magboots/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle")));
	return f.dot;
});

// /obj/item/clothing/shoes/magboots/verb/toggle  (code/modules/clothing/shoes/magboots.dm:18)  may sleep
rt.def("/obj/item/clothing/shoes/magboots/verb/toggle", function* toggle(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "can_use", live(f.usr))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_self", live(f.usr));
	return f.dot;
}, true, { verb: { name: "Toggle Magboots", category: "Object", src: 11 } });

// /obj/item/clothing/shoes/magboots/proc/attack_self  (code/modules/clothing/shoes/magboots.dm:24)  may sleep
rt.def("/obj/item/clothing/shoes/magboots/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [user, X, A, $0, $1, $e];
	if (truthy(rt.fv(f, "magpulse", live(f.src)))) {
		(rt.modField(f, live(f.src), "flags", 16776191, rt.bitAnd));
		rt.setFv(f, "slowdown", live(f.src), 0);
	} else {
		(rt.modField(f, live(f.src), "flags", 1024, rt.bitOr));
		rt.setFv(f, "slowdown", live(f.src), rt.sv(f, "slowdown_active"));
	}
	rt.setSv(f, "magpulse", (!truthy(rt.sv(f, "magpulse")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "magboot_state"), rt.sv(f, "magpulse")]));
	$0 = live(user);
	if (truthy(rt.sv(f, "magpulse"))) {
		$1 = "enable";
	} else {
		$1 = "disable";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the mag-pulse traction system.</span>", [$1])]);
	yield* g.callName(f, live(user), "update_inv_shoes", []);
	yield* g.callName(f, live(user), "update_gravity", [(yield* g.callName(f, live(user), "has_gravity", []))]);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/clothing/shoes/magboots/proc/negates_gravity  (code/modules/clothing/shoes/magboots.dm:40)
rt.def("/obj/item/clothing/shoes/magboots/proc/negates_gravity", function negates_gravity(f: Frame) {
	return rt.bitAnd(rt.sv(f, "flags"), 1024);
});

// /obj/item/clothing/shoes/magboots/proc/examine  (code/modules/clothing/shoes/magboots.dm:43)
rt.def("/obj/item/clothing/shoes/magboots/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "magpulse"))) {
		$1 = "enabled";
	} else {
		$1 = "disabled";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("Its mag-pulse traction system appears to be ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });
