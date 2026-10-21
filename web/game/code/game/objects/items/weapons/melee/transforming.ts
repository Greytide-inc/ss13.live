// From code/game/objects/items/weapons/melee/transforming.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5692, "/obj/item/weapon/melee/transforming", "/obj/item/weapon/melee", {
	active: 0,
	force_on: 30,
	throwforce_on: 20,
	icon_state_on: "axe1",
	hitsound_on: rt.rsc("sound/weapons/blade1.ogg"),
	attack_verb_on: null,
	attack_verb_off: null,
	w_class_on: 4,
	w_class: 2,
	sharpness: 1,
});

// /obj/item/weapon/melee/transforming/proc/Initialize  (code/game/objects/items/weapons/melee/transforming.dm:14)  may sleep
rt.def("/obj/item/weapon/melee/transforming/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "active"))) {
		if (truthy(rt.len(f, rt.sv(f, "attack_verb_on")))) {
			rt.setSv(f, "attack_verb", rt.sv(f, "attack_verb_on"));
		}
	} else {
		if (!truthy(rt.len(f, rt.sv(f, "attack_verb_off")))) return f.dot;
		rt.setSv(f, "attack_verb", rt.sv(f, "attack_verb_off"));
	}
	return f.dot;
}, true);

// /obj/item/weapon/melee/transforming/proc/attack_self  (code/game/objects/items/weapons/melee/transforming.dm:23)  may sleep
rt.def("/obj/item/weapon/melee/transforming/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((yield* g.srcCall(f, "transform_weapon", live(user))))) return f.dot;
	yield* g.srcCall(f, "clumsy_transform_effect", live(user));
	return f.dot;
}, true);

// /obj/item/weapon/melee/transforming/proc/transform_weapon  (code/game/objects/items/weapons/melee/transforming.dm:27)  may sleep
rt.def("/obj/item/weapon/melee/transforming/proc/transform_weapon", function* transform_weapon(f: Frame, user: Value, supress_message_text: Value) {
	f.vars = () => [user, supress_message_text];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "force", rt.sv(f, "force_on"));
		rt.setSv(f, "throwforce", rt.sv(f, "throwforce_on"));
		rt.setSv(f, "hitsound", rt.sv(f, "hitsound_on"));
		rt.setSv(f, "throw_speed", 4);
		if (truthy(rt.len(f, rt.sv(f, "attack_verb_on")))) {
			rt.setSv(f, "attack_verb", rt.sv(f, "attack_verb_on"));
		}
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_on"));
		rt.setSv(f, "w_class", rt.sv(f, "w_class_on"));
	} else {
		rt.setSv(f, "force", rt.initial(f, live(f.src), "force"));
		rt.setSv(f, "throwforce", rt.initial(f, live(f.src), "throwforce"));
		rt.setSv(f, "hitsound", rt.initial(f, live(f.src), "hitsound"));
		rt.setSv(f, "throw_speed", rt.initial(f, live(f.src), "throw_speed"));
		if (truthy(rt.len(f, rt.sv(f, "attack_verb_off")))) {
			rt.setSv(f, "attack_verb", rt.sv(f, "attack_verb_off"));
		}
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "w_class", rt.initial(f, live(f.src), "w_class"));
	}
	yield* g.srcCall(f, "transform_messages", live(user), live(supress_message_text));
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return 1;
}, true);

// /obj/item/weapon/melee/transforming/proc/transform_messages  (code/game/objects/items/weapons/melee/transforming.dm:51)
rt.def("/obj/item/weapon/melee/transforming/proc/transform_messages", function transform_messages(f: Frame, user: Value, supress_message_text: Value) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = live(user);
	if (truthy(rt.sv(f, "active"))) {
		$1 = rt.rsc("sound/weapons/saberon.ogg");
	} else {
		$1 = rt.rsc("sound/weapons/saberoff.ogg");
	}
	rt.call(f, P("/proc/playsound"), null, [$0, $1, 35, 1]);
	if (truthy(live(supress_message_text))) return f.dot;
	$0 = live(user);
	$1 = live(f.src);
	if (truthy(rt.sv(f, "active"))) {
		$1 = $1;
		$2 = "is now active";
	} else {
		$2 = "can now be concealed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ ＀.</span>", [$1, $2])]);
	return f.dot;
});

// /obj/item/weapon/melee/transforming/proc/clumsy_transform_effect  (code/game/objects/items/weapons/melee/transforming.dm:56)  may sleep
rt.def("/obj/item/weapon/melee/transforming/proc/clumsy_transform_effect", function* clumsy_transform_effect(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You accidentally cut yourself with ＀, like a doofus!</span>", [live(f.src)])]);
	yield* g.callName(f, live(user), "take_bodypart_damage", [5, 5]);
	return f.dot;
}, true);
