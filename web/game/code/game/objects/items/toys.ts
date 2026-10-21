// From code/game/objects/items/toys.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9684, "/obj/item/toy/balloon", "/obj/item/toy", {
	item_state: "balloon-empty",
	name: "water balloon",
	desc: "A translucent balloon. There's nothing in it.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "waterballoon-e",
});

// /obj/item/toy/balloon/proc/New  (code/game/objects/items/toys.dm:45)  may sleep
rt.def("/obj/item/toy/balloon/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "create_reagents", 10);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/toy/balloon/proc/afterattack  (code/game/objects/items/toys.dm:52)  may sleep
rt.def("/obj/item/toy/balloon/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let RD: Value = null;
	f.vars = () => [A, user, proximity, RD];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(A), T("/obj/structure/reagent_dispensers")) ? 1 : 0))) return f.dot;
	if (rt.le(rt.gv(f, "total_volume", rt.gv(f, "reagents", (RD = live(A)))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty.</span>", [live(RD)])]);
	} else {
		if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 10)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is full.</span>", [live(f.src)])]);
		} else {
			yield* g.callName(f, rt.fv(f, "reagents", live(A)), "trans_to", [live(f.src), 10]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You fill the balloon with the contents of ＀.</span>", [live(A)])]);
			rt.setSv(f, "desc", "A translucent balloon with some form of liquid sloshing around in it.");
			yield* g.srcCall(f, "update_icon");
		}
	}
	return f.dot;
}, true);

// /obj/item/toy/balloon/proc/attackby  (code/game/objects/items/toys.dm:66)  may sleep
rt.def("/obj/item/toy/balloon/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "reagents", live(f.args[0])))) {
			if (rt.le(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.args[0]))), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is empty.</span>", [live(f.args[0])])]);
			} else {
				if (rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 10)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is full.</span>", [live(f.src)])]);
				} else {
					rt.setSv(f, "desc", "A translucent balloon with some form of liquid sloshing around in it.");
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You fill the balloon with the contents of ＀.</span>", [live(f.args[0])])]);
					yield* g.callName(f, rt.fv(f, "reagents", live(f.args[0])), "trans_to", [live(f.src), 10]);
					yield* g.srcCall(f, "update_icon");
				}
			}
		}
	} else {
		if (truthy((yield* g.callName(f, live(f.args[0]), "is_sharp", [])))) {
			yield* g.srcCall(f, "balloon_burst");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/toy/balloon/proc/throw_impact  (code/game/objects/items/toys.dm:83)  may sleep
rt.def("/obj/item/toy/balloon/proc/throw_impact", function* throw_impact(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "balloon_burst", live(f.args[0]));
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/toy/balloon/proc/balloon_burst  (code/game/objects/items/toys.dm:87)  may sleep
rt.def("/obj/item/toy/balloon/proc/balloon_burst", function* balloon_burst(f: Frame, AT: Value) {
	let _T: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [AT, _T, A, $e];
	if (!rt.ge(rt.fv(f, "total_volume", rt.sv(f, "reagents")), 1)) return f.dot;
	_T = null;
	if (truthy(live(AT))) {
		_T = rt.getStep(f, live(AT), 0);
	} else {
		_T = rt.getStep(f, live(f.src), 0);
	}
	yield* g.callName(f, live(_T), "visible_message", [fmt("<span class='danger'>＀ bursts!</span>", [live(f.src)]), "<span class='italics'>You hear a pop and a splash.</span>"]);
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(_T)]);
	A = null;
	rt.forList(f, 0, live(_T), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(A)]);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "icon_state", "burst");
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/toy/balloon/proc/update_icon  (code/game/objects/items/toys.dm:101)
rt.def("/obj/item/toy/balloon/proc/update_icon", function update_icon(f: Frame) {
	if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.src))), 1)) {
		rt.setSv(f, "icon_state", "waterballoon");
		rt.setSv(f, "item_state", "balloon");
	} else {
		rt.setSv(f, "icon_state", "waterballoon-e");
		rt.setSv(f, "item_state", "balloon-empty");
	}
	return f.dot;
});

rt.type(9687, "/obj/item/toy/gun", "/obj/item/toy", {
	bullets: 7,
	item_state: "gun",
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
	flags: 64,
	slot_flags: 512,
	w_class: 3,
	materials: null,
	attack_verb: null,
	name: "cap gun",
	desc: "Looks almost like the real thing! Ages 8 and up. Please recycle in an autolathe when you're out of caps.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "revolver",
});

// /obj/item/toy/gun/proc/<init>  (code/game/objects/items/toys.dm:143)
rt.def("/obj/item/toy/gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 10]));
	rt.setSv(f, "attack_verb", rt.list("struck", "pistol whipped", "hit", "bashed"));
	return f.dot;
});

// /obj/item/toy/gun/proc/examine  (code/game/objects/items/toys.dm:148)
rt.def("/obj/item/toy/gun/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (isEqual(rt.sv(f, "bullets"), 1)) {
		$1 = "is";
	} else {
		$1 = "are";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("There ＀ ＀ cap５ left.", [$1, rt.sv(f, "bullets")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/toy/gun/proc/attackby  (code/game/objects/items/toys.dm:153)  may sleep
rt.def("/obj/item/toy/gun/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/ammo/gun")) ? 1 : 0))) {
		if (rt.ge(rt.fv(f, "bullets", live(f.src)), 7)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's already fully loaded!</span>"]);
			return 1;
		}
		if (rt.le(rt.fv(f, "amount_left", live(f.args[0])), 0)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There are no more caps!</span>"]);
			return 1;
		}
		if (rt.lt(rt.fv(f, "amount_left", live(f.args[0])), subtract(7, rt.fv(f, "bullets", live(f.src))))) {
			rt.modField(f, live(f.src), "bullets", rt.fv(f, "amount_left", live(f.args[0])), add);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You reload ＀ cap５.</span>", [rt.fv(f, "amount_left", live(f.args[0]))])]);
			rt.setFv(f, "amount_left", live(f.args[0]), 0);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You reload ＀ cap５.</span>", [subtract(7, rt.fv(f, "bullets", live(f.src)))])]);
			(rt.modField(f, live(f.args[0]), "amount_left", subtract(7, rt.fv(f, "bullets", live(f.src))), subtract));
			rt.setFv(f, "bullets", live(f.src), 7);
		}
		yield* g.callName(f, live(f.args[0]), "update_icon", []);
		return 1;
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/toy/gun/proc/afterattack  (code/game/objects/items/toys.dm:176)  may sleep
rt.def("/obj/item/toy/gun/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	f.vars = () => [target, user, flag];
	if (truthy(live(flag))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You don't have the dexterity to do this!</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if (rt.lt(rt.fv(f, "bullets", live(f.src)), 1)) {
		yield* g.callName(f, live(user), "show_message", ["<span class='warning'>*click*</span>", 2]);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/gunshot.ogg"), 100, 1]);
	rt.incField(f, live(f.src), "bullets", -1, true);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fires ＀ at ＀!</span>", [live(user), live(f.src), live(target)]), fmt("<span class='danger'>You fire ＀ at ＀!</span>", [live(f.src), live(target)]), "<span class='italics'>You hear a gunshot!</span>"]);
	return f.dot;
}, true);

rt.type(9689, "/obj/item/toy/ammo/gun", "/obj/item/toy/ammo", {
	amount_left: 7,
	w_class: 1,
	materials: null,
	name: "capgun ammo",
	desc: "Make sure to recyle the box in an autolathe when it gets empty.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "357OLD-7",
});

// /obj/item/toy/ammo/gun/proc/<init>  (code/game/objects/items/toys.dm:196)
rt.def("/obj/item/toy/ammo/gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 10, "$glass", 10]));
	return f.dot;
});

// /obj/item/toy/ammo/gun/proc/update_icon  (code/game/objects/items/toys.dm:200)
rt.def("/obj/item/toy/ammo/gun/proc/update_icon", function update_icon(f: Frame) {
	rt.setFv(f, "icon_state", live(f.src), fmt("357OLD-＀", [rt.fv(f, "amount_left", live(f.src))]));
	return f.dot;
});

// /obj/item/toy/ammo/gun/proc/examine  (code/game/objects/items/toys.dm:203)
rt.def("/obj/item/toy/ammo/gun/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (isEqual(rt.sv(f, "amount_left"), 1)) {
		$1 = "is";
	} else {
		$1 = "are";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("There ＀ ＀ cap５ left.", [$1, rt.sv(f, "amount_left")])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(9690, "/obj/item/toy/sword", "/obj/item/toy", {
	active: 0,
	hacked: 0,
	item_state: "sword0",
	w_class: 2,
	attack_verb: null,
	name: "toy sword",
	desc: "A cheap, plastic replica of an energy sword. Realistic sounds! Ages 8 and up.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "sword0",
});

// /obj/item/toy/sword/proc/attack_self  (code/game/objects/items/toys.dm:221)  may sleep
rt.def("/obj/item/toy/sword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	if (truthy(rt.sv(f, "active"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You extend the plastic blade with a quick flick of your wrist.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberon.ogg"), 20, 1]);
		if (truthy(rt.sv(f, "hacked"))) {
			rt.setSv(f, "icon_state", "swordrainbow");
			rt.setSv(f, "item_state", "swordrainbow");
		} else {
			rt.setSv(f, "icon_state", "swordblue");
			rt.setSv(f, "item_state", "swordblue");
		}
		rt.setSv(f, "w_class", 4);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You push the plastic blade back down into the handle.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberoff.ogg"), 20, 1]);
		rt.setSv(f, "icon_state", "sword0");
		rt.setSv(f, "item_state", "sword0");
		rt.setSv(f, "w_class", 2);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

// /obj/item/toy/sword/proc/attackby  (code/game/objects/items/toys.dm:242)  may sleep
rt.def("/obj/item/toy/sword/proc/attackby", function* attackby(f: Frame) {
	let newSaber: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [newSaber, $0, $1, $2];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/sword")) ? 1 : 0))) {
		if ((truthy(rt.bitAnd(rt.fv(f, "flags", live(f.args[0])), 2)) || truthy(rt.bitAnd(rt.sv(f, "flags"), 2)))) {
			$0 = live(f.args[1]);
			if (truthy(rt.bitAnd(rt.sv(f, "flags"), 2))) {
				$1 = live(f.src);
			} else {
				$1 = live(f.args[0]);
			}
			if (truthy(rt.bitAnd(rt.sv(f, "flags"), 2))) {
				$2 = live(f.args[0]);
			} else {
				$2 = live(f.src);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='warning'>％！ is stuck to your hand, you can't attach it to ％！!</span>", [$1, $2])]);
			return live(f.dot);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You attach the ends of the two plastic swords, making a single double-bladed toy! You're fake-cool.</span>"]);
			newSaber = (yield* g.new_(f, T("/obj/item/weapon/twohanded/dualsaber/toy"), [rt.fv(f, "loc", live(f.args[1]))]));
			if (truthy(rt.sv(f, "hacked"))) {
				rt.setFv(f, "hacked", live(newSaber), 1);
				rt.setFv(f, "item_color", live(newSaber), "rainbow");
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
			if (isEqual(rt.sv(f, "hacked"), 0)) {
				rt.setSv(f, "hacked", 1);
				rt.setSv(f, "item_color", "rainbow");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>RNBW_ENGAGE</span>"]);
				if (truthy(rt.sv(f, "active"))) {
					rt.setSv(f, "icon_state", "swordrainbow");
					yield* g.callName(f, live(f.args[1]), "update_inv_hands", []);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>It's already fabulous!</span>"]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(9692, "/obj/item/toy/windupToolbox", "/obj/item/toy", {
	active: 0,
	item_state: "artistic_toolbox",
	attack_verb: null,
	name: "windup toolbox",
	desc: "A replica toolbox that rumbles when you turn the key",
	icon_state: "his_grace",
	icon: rt.rsc("icons/obj/weapons.dmi"),
});

// /obj/item/toy/windupToolbox/proc/<init>  (code/game/objects/items/toys.dm:289)
rt.def("/obj/item/toy/windupToolbox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "attack_verb", rt.list("robusted"));
	return f.dot;
});

// /obj/item/toy/windupToolbox/proc/attack_self  (code/game/objects/items/toys.dm:292)  may sleep
rt.def("/obj/item/toy/windupToolbox/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "icon_state", "his_grace_awakened");
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You wind up ＀, it begins to rumble.</span>", [live(f.src)])]);
		rt.setSv(f, "active", 1);
		yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/toy/windupToolbox/proc/stopRumble")])), 600]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("＀ is already active.", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/toy/windupToolbox/proc/stopRumble  (code/game/objects/items/toys.dm:301)
rt.def("/obj/item/toy/windupToolbox/proc/stopRumble", function stopRumble(f: Frame) {
	rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	rt.setSv(f, "active", 0);
	return f.dot;
});

rt.type(9694, "/obj/item/toy/snappop", "/obj/item/toy", {
	ash_type: rt.typePath("/obj/effect/decal/cleanable/ash"),
	w_class: 1,
	name: "snap pop",
	desc: "Wow!",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snappop",
});

// /obj/item/toy/snappop/proc/pop_burst  (code/game/objects/items/toys.dm:352)  may sleep
rt.def("/obj/item/toy/snappop/proc/pop_burst", function* pop_burst(f: Frame, n: Value, c: Value) {
	let s: Value = null;
	f.vars = () => [n, c, s];
	if (live(n) === null) {
		n = 3;
	}
	if (live(c) === null) {
		c = 1;
	}
	yield* g.callName(f, (s = (yield* g.new_(f, T("/datum/effect_system/spark_spread"), []))), "set_up", [live(n), live(c), live(f.src)]);
	yield* g.callName(f, live(s), "start", []);
	yield* g.new_(f, rt.sv(f, "ash_type"), [rt.sv(f, "loc")]);
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ explodes!</span>", [live(f.src)]), "<span class='italics'>You hear a snap!</span>");
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/snap.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/toy/snappop/proc/fire_act  (code/game/objects/items/toys.dm:362)  may sleep
rt.def("/obj/item/toy/snappop/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	f.vars = () => [exposed_temperature, exposed_volume];
	yield* g.srcCall(f, "pop_burst");
	return f.dot;
}, true);

// /obj/item/toy/snappop/proc/throw_impact  (code/game/objects/items/toys.dm:365)  may sleep
rt.def("/obj/item/toy/snappop/proc/throw_impact", function* throw_impact(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "pop_burst");
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/toy/snappop/proc/Crossed  (code/game/objects/items/toys.dm:369)  may sleep
rt.def("/obj/item/toy/snappop/proc/Crossed", function* Crossed(f: Frame, H: Value) {
	let M: Value = null;
	f.vars = () => [H, M];
	if (!(truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(H), T("/mob/living/silicon")) ? 1 : 0)))) return f.dot;
	M = live(H);
	if (!(truthy((rt.istype(live(H), T("/mob/living/silicon")) ? 1 : 0)) || isEqual(rt.fv(f, "m_intent", live(M)), "run"))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<span class='danger'>You step on the snap pop!</span>"]);
	yield* g.srcCall(f, "pop_burst", 2, 0);
	return f.dot;
}, true);

rt.type(11740, "/obj/effect/decal/cleanable/ash/snappop_phoenix", "/obj/effect/decal/cleanable/ash", {
	respawn_time: 300,
});

// /obj/effect/decal/cleanable/ash/snappop_phoenix/proc/New  (code/game/objects/items/toys.dm:384)  may sleep
rt.def("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/respawn")])), rt.sv(f, "respawn_time")]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/ash/snappop_phoenix/proc/respawn  (code/game/objects/items/toys.dm:388)  may sleep
rt.def("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/respawn", function* respawn(f: Frame) {
	yield* g.new_(f, T("/obj/item/toy/snappop/phoenix"), [rt.getStep(f, live(f.src), 0)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(9696, "/obj/item/toy/prize", "/obj/item/toy", {
	timer: 0,
	cooldown: 30,
	quiet: 0,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "ripleytoy",
});

// /obj/item/toy/prize/proc/attack_self  (code/game/objects/items/toys.dm:404)  may sleep
rt.def("/obj/item/toy/prize/proc/attack_self", function* attack_self(f: Frame) {
	if (rt.lt(rt.sv(f, "timer"), rt.worldTime(f))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You play with ＀.</span>", [live(f.src)])]);
		rt.setSv(f, "timer", add(rt.worldTime(f), rt.sv(f, "cooldown")));
		if (!truthy(rt.sv(f, "quiet"))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/mecha/mechstep.ogg"), 20, 1]);
		}
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/toy/prize/proc/attack_hand  (code/game/objects/items/toys.dm:413)  may sleep
rt.def("/obj/item/toy/prize/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		yield* g.srcCall(f, "attack_self", live(f.args[0]));
	} else {
		f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

rt.type(9709, "/obj/item/toy/talking", "/obj/item/toy", {
	cooldown: 0,
	messages: null,
	span: "danger",
	recharge_time: 30,
	chattering: 0,
	phomeme: null,
	w_class: 2,
	name: "talking action figure",
	desc: "A generic action figure modeled after nothing in particular.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "owlprize",
});

// /obj/item/toy/talking/proc/attack_alien  (code/game/objects/items/toys.dm:495)  may sleep
rt.def("/obj/item/toy/talking/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = (yield* g.srcCall(f, "attack_hand", live(user)));
	return f.dot;
}, true);

// /obj/item/toy/talking/proc/attack_self  (code/game/objects/items/toys.dm:498)  may sleep
rt.def("/obj/item/toy/talking/proc/attack_self", function* attack_self(f: Frame) {
	let messages: Value = null, message: Value = null;
	f.vars = () => [messages, message];
	if (!truthy(rt.sv(f, "cooldown"))) {
		messages = (yield* g.srcCall(f, "generate_messages"));
		yield* g.srcCall(f, "activation_message", live(f.args[0]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/click.ogg"), 20, 1]);
		rt.spawnTail(f, 0, "/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:503", messages, message);
		rt.setSv(f, "cooldown", 1);
		rt.spawnTail(f, rt.sv(f, "recharge_time"), "/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:509", messages, message);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// a spawn(rt.srcVarI(f, $ic[89])) body of /obj/item/toy/talking/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:509", function* (f: Frame, messages: Value, message: Value) {
	f.vars = () => [messages, message];
	rt.setSv(f, "cooldown", 0);
	return null;
});

// a spawn(0) body of /obj/item/toy/talking/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:503", function* (f: Frame, messages: Value, message: Value) {
	let $e: any;
	f.vars = () => [messages, message, $e];
	message = null;
	rt.forList(f, 0, live(messages));
	while (($e = rt.next(f, 0)) !== undefined) {
		message = $e;
		yield* g.srcCall(f, "toy_talk", live(f.args[0]), live(message));
		yield* g.call(f, P("/proc/sleep"), null, [10]);
	}
	rt.endFor(f, 0);
	return null;
});

// /obj/item/toy/talking/proc/activation_message  (code/game/objects/items/toys.dm:515)
rt.def("/obj/item/toy/talking/proc/activation_message", function activation_message(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ pulls the string on ％！.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You pull the string on ％！.</span>", [live(f.src)]), "<span class='notice'>You hear a string being pulled.</span>"]);
	return f.dot;
});

// /obj/item/toy/talking/proc/generate_messages  (code/game/objects/items/toys.dm:521)
rt.def("/obj/item/toy/talking/proc/generate_messages", function generate_messages(f: Frame) {
	return rt.list(rt.op(f, "PickUnweighted", [1], [rt.sv(f, "messages")]));
});

// /obj/item/toy/talking/proc/toy_talk  (code/game/objects/items/toys.dm:524)
rt.def("/obj/item/toy/talking/proc/toy_talk", function toy_talk(f: Frame, user: Value, message: Value) {
	rt.callName(f, rt.fv(f, "loc", live(user)), "visible_message", [fmt("<span class='＀'>＀ ＀</span>", [rt.sv(f, "span"), rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(message)])]);
	if (!truthy(rt.sv(f, "chattering"))) return f.dot;
	rt.call(f, P("/proc/chatter"), null, [live(message), rt.sv(f, "phomeme"), live(user)]);
	return f.dot;
});

rt.type(9710, "/obj/item/toy/talking/AI", "/obj/item/toy/talking", {
	name: "toy AI",
	desc: "A little toy model AI core with real law announcing action!",
	icon_state: "AI",
});

// /obj/item/toy/talking/AI/proc/generate_messages  (code/game/objects/items/toys.dm:537)
rt.def("/obj/item/toy/talking/AI/proc/generate_messages", function generate_messages(f: Frame) {
	return rt.list(rt.call(f, P("/proc/generate_ion_law"), null, []));
});

rt.type(9711, "/obj/item/toy/talking/codex_gigas", "/obj/item/toy/talking", {
	w_class: 2,
	recharge_time: 60,
	name: "Toy Codex Gigas",
	desc: "A tool to help you write fictional devils!",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "demonomicon",
});

// /obj/item/toy/talking/codex_gigas/proc/activation_message  (code/game/objects/items/toys.dm:548)
rt.def("/obj/item/toy/talking/codex_gigas/proc/activation_message", function activation_message(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ presses the button on ％！.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You press the button on ％！.</span>", [live(f.src)]), "<span class='notice'>You hear a soft click.</span>"]);
	return f.dot;
});

// /obj/item/toy/talking/codex_gigas/proc/generate_messages  (code/game/objects/items/toys.dm:554)
rt.def("/obj/item/toy/talking/codex_gigas/proc/generate_messages", function generate_messages(f: Frame) {
	let devil: Value = null, messages: Value = null;
	f.vars = () => [devil, messages];
	devil = rt.new_(f, T("/datum/fakeDevil"), []);
	messages = rt.list();
	messages = rt.modify(live(messages), fmt("Some fun facts about: ＀", [rt.fv(f, "truename", live(devil))]), add);
	messages = rt.modify(live(messages), fmt("＀", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "bane", live(devil)))]), add);
	messages = rt.modify(live(messages), fmt("＀", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "obligation", live(devil)))]), add);
	messages = rt.modify(live(messages), fmt("＀", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "ban", live(devil)))]), add);
	return (messages = rt.modify(live(messages), fmt("＀", [rt.index(rt.index(rt.gl("lawlorify"), 1), rt.fv(f, "banish", live(devil)))]), add));
});

rt.type(9714, "/obj/item/toy/cards", "/obj/item/toy", {
	parentdeck: null,
	deckstyle: "nanotrasen",
	card_hitsound: null,
	card_force: 0,
	card_throwforce: 0,
	card_throw_speed: 3,
	card_throw_range: 7,
	card_attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/item/toy/cards/proc/<init>  (code/game/objects/items/toys.dm:596)
rt.def("/obj/item/toy/cards/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "card_attack_verb", rt.list("attacked"));
	return f.dot;
});

// /obj/item/toy/cards/proc/apply_card_vars  (code/game/objects/items/toys.dm:599)
rt.def("/obj/item/toy/cards/proc/apply_card_vars", function apply_card_vars(f: Frame, newobj: Value, sourceobj: Value) {
	if (truthy((rt.istype(live(sourceobj), T("/obj/item/toy/cards")) ? 1 : 0))) return f.dot;
	return live(f.dot);
});

rt.type(9715, "/obj/item/toy/cards/deck", "/obj/item/toy/cards", {
	cooldown: 0,
	holo: null,
	cards: null,
	deckstyle: "nanotrasen",
	w_class: 2,
	name: "deck of cards",
	desc: "A deck of space-grade playing cards.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_nanotrasen_full",
});

// /obj/item/toy/cards/deck/proc/<init>  (code/game/objects/items/toys.dm:611)
rt.def("/obj/item/toy/cards/deck/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cards", rt.list());
	return f.dot;
});

// /obj/item/toy/cards/deck/proc/New  (code/game/objects/items/toys.dm:614)  may sleep
rt.def("/obj/item/toy/cards/deck/proc/New", function* New(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("deck_＀_full", [rt.sv(f, "deckstyle")]));
	i = null;
	i = 2;
	while (rt.le(live(i), 10)) {
		rt.modSrcVar(f, "cards", fmt("＀ of Hearts", [live(i)]), add);
		rt.modSrcVar(f, "cards", fmt("＀ of Spades", [live(i)]), add);
		rt.modSrcVar(f, "cards", fmt("＀ of Clubs", [live(i)]), add);
		rt.modSrcVar(f, "cards", fmt("＀ of Diamonds", [live(i)]), add);
		i = rt.inc(live(i), 1);
	}
	rt.modSrcVar(f, "cards", "King of Hearts", add);
	rt.modSrcVar(f, "cards", "King of Spades", add);
	rt.modSrcVar(f, "cards", "King of Clubs", add);
	rt.modSrcVar(f, "cards", "King of Diamonds", add);
	rt.modSrcVar(f, "cards", "Queen of Hearts", add);
	rt.modSrcVar(f, "cards", "Queen of Spades", add);
	rt.modSrcVar(f, "cards", "Queen of Clubs", add);
	rt.modSrcVar(f, "cards", "Queen of Diamonds", add);
	rt.modSrcVar(f, "cards", "Jack of Hearts", add);
	rt.modSrcVar(f, "cards", "Jack of Spades", add);
	rt.modSrcVar(f, "cards", "Jack of Clubs", add);
	rt.modSrcVar(f, "cards", "Jack of Diamonds", add);
	rt.modSrcVar(f, "cards", "Ace of Hearts", add);
	rt.modSrcVar(f, "cards", "Ace of Spades", add);
	rt.modSrcVar(f, "cards", "Ace of Clubs", add);
	rt.modSrcVar(f, "cards", "Ace of Diamonds", add);
	return f.dot;
}, true);

// /obj/item/toy/cards/deck/proc/attack_hand  (code/game/objects/items/toys.dm:640)  may sleep
rt.def("/obj/item/toy/cards/deck/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null, H: Value = null, O: Value = null;
	f.vars = () => [user, choice, H, O];
	if (truthy(rt.fv(f, "lying", live(user)))) {
		return live(f.dot);
	}
	choice = null;
	if (isEqual(rt.len(f, rt.sv(f, "cards")), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There are no more cards to draw!</span>"]);
		return live(f.dot);
	}
	H = (yield* g.new_(f, T("/obj/item/toy/cards/singlecard"), [rt.fv(f, "loc", live(user))]));
	if (truthy(rt.sv(f, "holo"))) {
		rt.modField(f, rt.sv(f, "holo"), "spawned", live(H), add);
	}
	choice = rt.index(rt.sv(f, "cards"), 1);
	rt.setFv(f, "cardname", live(H), live(choice));
	rt.setFv(f, "parentdeck", live(H), live(f.src));
	O = live(f.src);
	yield* g.callName(f, live(H), "apply_card_vars", [live(H), live(O)]);
	(rt.modField(f, live(f.src), "cards", live(choice), subtract));
	yield* g.callName(f, live(H), "pickup", [live(user)]);
	yield* g.callName(f, live(user), "put_in_hands", [live(H)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ draws a card from the deck.", [live(user)]), "<span class='notice'>You draw a card from the deck.</span>"]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/toy/cards/deck/proc/update_icon  (code/game/objects/items/toys.dm:661)
rt.def("/obj/item/toy/cards/deck/proc/update_icon", function update_icon(f: Frame) {
	if (rt.gt(rt.len(f, rt.sv(f, "cards")), 26)) {
		rt.setSv(f, "icon_state", fmt("deck_＀_full", [rt.sv(f, "deckstyle")]));
	} else {
		if (rt.gt(rt.len(f, rt.sv(f, "cards")), 10)) {
			rt.setSv(f, "icon_state", fmt("deck_＀_half", [rt.sv(f, "deckstyle")]));
		} else {
			if (rt.gt(rt.len(f, rt.sv(f, "cards")), 0)) {
				rt.setSv(f, "icon_state", fmt("deck_＀_low", [rt.sv(f, "deckstyle")]));
			} else {
				if (!isEqual(rt.len(f, rt.sv(f, "cards")), 0)) return f.dot;
				rt.setSv(f, "icon_state", fmt("deck_＀_empty", [rt.sv(f, "deckstyle")]));
			}
		}
	}
	return f.dot;
});

// /obj/item/toy/cards/deck/proc/attack_self  (code/game/objects/items/toys.dm:671)
rt.def("/obj/item/toy/cards/deck/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!rt.lt(rt.sv(f, "cooldown"), subtract(rt.worldTime(f), 50))) return f.dot;
	rt.setSv(f, "cards", rt.call(f, P("/proc/shuffle"), null, [rt.sv(f, "cards")]));
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/items/cardshuffle.ogg"), 50, 1]);
	rt.callName(f, live(user), "visible_message", [fmt("＀ shuffles the deck.", [live(user)]), "<span class='notice'>You shuffle the deck.</span>"]);
	rt.setSv(f, "cooldown", rt.worldTime(f));
	return f.dot;
});

// /obj/item/toy/cards/deck/proc/attackby  (code/game/objects/items/toys.dm:678)  may sleep
rt.def("/obj/item/toy/cards/deck/proc/attackby", function* attackby(f: Frame) {
	let SC: Value = null, CH: Value = null;
	f.vars = () => [SC, CH];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/cards/singlecard")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "parentdeck", (SC = live(f.args[0]))), live(f.src))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(SC)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The card is stuck to your hand, you can't add it to the deck!</span>"]);
				return live(f.dot);
			}
			rt.modSrcVar(f, "cards", rt.fv(f, "cardname", live(SC)), add);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds a card to the bottom of the deck.", [live(f.args[1])]), "<span class='notice'>You add the card to the bottom of the deck.</span>"]);
			yield* g.call(f, P("/proc/qdel"), null, [live(SC)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't mix cards from other decks!</span>"]);
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/cards/cardhand")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "parentdeck", (CH = live(f.args[0]))), live(f.src))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(CH)])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The hand of cards is stuck to your hand, you can't add it to the deck!</span>"]);
					return live(f.dot);
				}
				rt.modSrcVar(f, "cards", rt.fv(f, "currenthand", live(CH)), add);
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ puts their hand of cards in the deck.", [live(f.args[1])]), "<span class='notice'>You put the hand of cards in the deck.</span>"]);
				yield* g.call(f, P("/proc/qdel"), null, [live(CH)]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't mix cards from other decks!</span>"]);
			}
			yield* g.srcCall(f, "update_icon");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/toy/cards/deck/proc/MouseDrop  (code/game/objects/items/toys.dm:706)  may sleep
rt.def("/obj/item/toy/cards/deck/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (((!truthy((rt.istype((M = live(f.usr)), T("/mob/living")) ? 1 : 0)) || truthy((yield* g.callName(f, live(f.usr), "incapacitated", [])))) || truthy(rt.fv(f, "lying", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) {
		if ((isEqual(live(over_object), live(M)) && !isEqual(rt.sv(f, "loc"), live(M)))) {
			yield* g.callName(f, live(M), "put_in_hands", [live(f.src)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You pick up the deck.</span>"]);
		} else {
			if (truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) {
				H = live(over_object);
				if (truthy((yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))])))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>You pick up the deck.</span>"]);
				}
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't reach it from here!</span>"]);
	}
	return f.dot;
}, true);

rt.type(9719, "/obj/item/toy/cards/cardhand", "/obj/item/toy/cards", {
	currenthand: null,
	choice: null,
	w_class: 1,
	name: "hand of cards",
	desc: "A number of cards not in a deck, customarily held in ones hand.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nanotrasen_hand2",
});

// /obj/item/toy/cards/cardhand/proc/<init>  (code/game/objects/items/toys.dm:730)
rt.def("/obj/item/toy/cards/cardhand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "currenthand", rt.list());
	return f.dot;
});

// /obj/item/toy/cards/cardhand/proc/attack_self  (code/game/objects/items/toys.dm:735)  may sleep
rt.def("/obj/item/toy/cards/cardhand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	yield* g.srcCall(f, "interact", live(user));
	return f.dot;
}, true);

// /obj/item/toy/cards/cardhand/proc/interact  (code/game/objects/items/toys.dm:739)  may sleep
rt.def("/obj/item/toy/cards/cardhand/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, t: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, t, popup, $e];
	dat = "You have:<BR>";
	t = null;
	rt.forList(f, 0, rt.sv(f, "currenthand"));
	while (($e = rt.next(f, 0)) !== undefined) {
		t = $e;
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;pick=＀'>A ＀.</A><BR>", [live(f.src), live(t), live(t)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), "Which card will you remove next?", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "cardhand", "Hand of Cards", 400, 240]))), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/toy/cards/cardhand/proc/Topic  (code/game/objects/items/toys.dm:750)  may sleep
rt.def("/obj/item/toy/cards/cardhand/proc/Topic", function* Topic(f: Frame) {
	let cardUser: Value = null, O: Value = null, choice: Value = null, C: Value = null, N: Value = null;
	f.vars = () => [cardUser, O, choice, C, N];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	cardUser = live(f.usr);
	O = live(f.src);
	if (!truthy(rt.at(live(f.args[1]), "pick"))) return f.dot;
	if (truthy((yield* g.callName(f, live(cardUser), "is_holding", [live(f.src)])))) {
		choice = rt.at(live(f.args[1]), "pick");
		C = (yield* g.new_(f, T("/obj/item/toy/cards/singlecard"), [rt.fv(f, "loc", live(cardUser))]));
		(rt.modField(f, live(f.src), "currenthand", live(choice), subtract));
		rt.setFv(f, "parentdeck", live(C), rt.fv(f, "parentdeck", live(f.src)));
		rt.setFv(f, "cardname", live(C), live(choice));
		yield* g.callName(f, live(C), "apply_card_vars", [live(C), live(O)]);
		yield* g.callName(f, live(C), "pickup", [live(cardUser)]);
		yield* g.callName(f, live(cardUser), "put_in_hands", [live(C)]);
		yield* g.callName(f, live(cardUser), "visible_message", [fmt("<span class='notice'>＀ draws a card from ＀ hand.</span>", [live(cardUser), (yield* g.callName(f, live(cardUser), "p_their", []))]), fmt("<span class='notice'>You take the ＀ from your hand.</span>", [rt.fv(f, "cardname", live(C))])]);
		yield* g.srcCall(f, "interact", live(cardUser));
		if (rt.lt(rt.getLen(f, rt.fv(f, "currenthand", live(f.src))), 3)) {
			rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand2", [rt.sv(f, "deckstyle")]));
		} else {
			if (rt.lt(rt.getLen(f, rt.fv(f, "currenthand", live(f.src))), 4)) {
				rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand3", [rt.sv(f, "deckstyle")]));
			} else {
				if (rt.lt(rt.getLen(f, rt.fv(f, "currenthand", live(f.src))), 5)) {
					rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand4", [rt.sv(f, "deckstyle")]));
				}
			}
		}
		if (isEqual(rt.getLen(f, rt.fv(f, "currenthand", live(f.src))), 1)) {
			rt.setFv(f, "parentdeck", (N = (yield* g.new_(f, T("/obj/item/toy/cards/singlecard"), [rt.fv(f, "loc", live(f.src))]))), rt.fv(f, "parentdeck", live(f.src)));
			rt.setFv(f, "cardname", live(N), rt.index(rt.fv(f, "currenthand", live(f.src)), 1));
			yield* g.callName(f, live(N), "apply_card_vars", [live(N), live(O)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(N), "pickup", [live(cardUser)]);
			yield* g.callName(f, live(cardUser), "put_in_hands", [live(N)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(cardUser), fmt("<span class='notice'>You also take ＀ and hold it.</span>", [rt.index(rt.sv(f, "currenthand"), 1)])]);
			rt.op(f, "Browse", [], [live(cardUser), null, "window=cardhand"], false);
		}
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/toy/cards/cardhand/proc/attackby  (code/game/objects/items/toys.dm:788)  may sleep
rt.def("/obj/item/toy/cards/cardhand/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/cards/singlecard")) ? 1 : 0))) {
		if (isEqual(rt.fv(f, "parentdeck", live(f.args[0])), rt.fv(f, "parentdeck", live(f.src)))) {
			rt.modField(f, live(f.src), "currenthand", rt.fv(f, "cardname", live(f.args[0])), add);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds a card to ＀ hand.", [live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_their", []))]), fmt("<span class='notice'>You add the ＀ to your hand.</span>", [rt.fv(f, "cardname", live(f.args[0]))])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.srcCall(f, "interact", live(f.args[1]));
			if (rt.gt(rt.len(f, rt.sv(f, "currenthand")), 4)) {
				rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand5", [rt.sv(f, "deckstyle")]));
			} else {
				if (rt.gt(rt.len(f, rt.sv(f, "currenthand")), 3)) {
					rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand4", [rt.sv(f, "deckstyle")]));
				} else {
					if (rt.gt(rt.len(f, rt.sv(f, "currenthand")), 2)) {
						rt.setFv(f, "icon_state", live(f.src), fmt("＀_hand3", [rt.sv(f, "deckstyle")]));
					}
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't mix cards from other decks!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

// /obj/item/toy/cards/cardhand/proc/apply_card_vars  (code/game/objects/items/toys.dm:806)
rt.def("/obj/item/toy/cards/cardhand/proc/apply_card_vars", function apply_card_vars(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "deckstyle", live(f.args[0]), rt.fv(f, "deckstyle", live(f.args[1])));
	rt.setFv(f, "icon_state", live(f.args[0]), fmt("＀_hand2", [rt.sv(f, "deckstyle")]));
	rt.setFv(f, "card_hitsound", live(f.args[0]), rt.fv(f, "card_hitsound", live(f.args[1])));
	rt.setFv(f, "card_force", live(f.args[0]), rt.fv(f, "card_force", live(f.args[1])));
	rt.setFv(f, "card_throwforce", live(f.args[0]), rt.fv(f, "card_throwforce", live(f.args[1])));
	rt.setFv(f, "card_throw_speed", live(f.args[0]), rt.fv(f, "card_throw_speed", live(f.args[1])));
	rt.setFv(f, "card_throw_range", live(f.args[0]), rt.fv(f, "card_throw_range", live(f.args[1])));
	rt.setFv(f, "card_attack_verb", live(f.args[0]), rt.fv(f, "card_attack_verb", live(f.args[1])));
	rt.setFv(f, "resistance_flags", live(f.args[0]), rt.fv(f, "resistance_flags", live(f.args[1])));
	return f.dot;
}, false, { args: ["newobj", "sourceobj"] });

rt.type(9720, "/obj/item/toy/cards/singlecard", "/obj/item/toy/cards", {
	cardname: null,
	flipped: 0,
	w_class: 1,
	name: "card",
	desc: "a card",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "singlecard_nanotrasen_down",
	pixel_x: -5,
});

// /obj/item/toy/cards/singlecard/proc/examine  (code/game/objects/items/toys.dm:829)
rt.def("/obj/item/toy/cards/singlecard/proc/examine", function examine(f: Frame, user: Value) {
	let cardUser: Value = null;
	f.vars = () => [cardUser];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (truthy(rt.callName(f, (cardUser = live(user)), "is_holding", [live(f.src)]))) {
		rt.callName(f, live(cardUser), "visible_message", [fmt("＀ checks ＀ card.", [live(cardUser), rt.callName(f, live(cardUser), "p_their", [])]), fmt("<span class='notice'>The card reads: ＀</span>", [rt.sv(f, "cardname")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(cardUser), "<span class='warning'>You need to have the card in your hand to check it!</span>"]);
	}
	return f.dot;
});

// /obj/item/toy/cards/singlecard/verb/Flip  (code/game/objects/items/toys.dm:841)
rt.def("/obj/item/toy/cards/singlecard/verb/Flip", function Flip(f: Frame) {
	if ((((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "flipped"))) {
		rt.setFv(f, "flipped", live(f.src), 1);
		if (truthy(rt.sv(f, "cardname"))) {
			rt.setFv(f, "icon_state", live(f.src), fmt("sc_＀_＀", [rt.sv(f, "cardname"), rt.sv(f, "deckstyle")]));
			rt.setFv(f, "name", live(f.src), rt.fv(f, "cardname", live(f.src)));
		} else {
			rt.setFv(f, "icon_state", live(f.src), fmt("sc_Ace of Spades_＀", [rt.sv(f, "deckstyle")]));
			rt.setFv(f, "name", live(f.src), "What Card");
		}
		rt.setFv(f, "pixel_x", live(f.src), 5);
	} else {
		if (!truthy(rt.sv(f, "flipped"))) return f.dot;
		rt.setFv(f, "flipped", live(f.src), 0);
		rt.setFv(f, "icon_state", live(f.src), fmt("singlecard_down_＀", [rt.sv(f, "deckstyle")]));
		rt.setFv(f, "name", live(f.src), "card");
		rt.setFv(f, "pixel_x", live(f.src), -5);
	}
	return f.dot;
}, false, { verb: { name: "Flip Card", category: "Object", src: 5, range: 1 } });

// /obj/item/toy/cards/singlecard/proc/attackby  (code/game/objects/items/toys.dm:859)  may sleep
rt.def("/obj/item/toy/cards/singlecard/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null, H: Value = null, H_0: Value = null;
	f.vars = () => [C, H, H_0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/cards/singlecard")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "parentdeck", (C = live(f.args[0]))), rt.fv(f, "parentdeck", live(f.src)))) {
			rt.modField(f, (H = (yield* g.new_(f, T("/obj/item/toy/cards/cardhand"), [rt.fv(f, "loc", live(f.args[1]))]))), "currenthand", rt.fv(f, "cardname", live(C)), add);
			rt.modField(f, live(H), "currenthand", rt.fv(f, "cardname", live(f.src)), add);
			rt.setFv(f, "parentdeck", live(H), rt.fv(f, "parentdeck", live(C)));
			yield* g.callName(f, live(H), "apply_card_vars", [live(H), live(C)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You combine the ＀ and the ＀ into a hand.</span>", [rt.fv(f, "cardname", live(C)), rt.fv(f, "cardname", live(f.src))])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(H), "pickup", [live(f.args[1])]);
			yield* g.callName(f, live(f.args[1]), "put_in_active_hand", [live(H)]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't mix cards from other decks!</span>"]);
		}
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/cards/cardhand")) ? 1 : 0))) {
		if (isEqual(rt.gv(f, "parentdeck", (H_0 = live(f.args[0]))), rt.sv(f, "parentdeck"))) {
			rt.modField(f, live(H_0), "currenthand", rt.sv(f, "cardname"), add);
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds a card to ＀ hand.", [live(f.args[1]), (yield* g.callName(f, live(f.args[1]), "p_their", []))]), fmt("<span class='notice'>You add the ＀ to your hand.</span>", [rt.sv(f, "cardname")])]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			yield* g.callName(f, live(H_0), "interact", [live(f.args[1])]);
			if (rt.gt(rt.getLen(f, rt.fv(f, "currenthand", live(H_0))), 4)) {
				rt.setFv(f, "icon_state", live(H_0), fmt("＀_hand5", [rt.sv(f, "deckstyle")]));
			} else {
				if (rt.gt(rt.getLen(f, rt.fv(f, "currenthand", live(H_0))), 3)) {
					rt.setFv(f, "icon_state", live(H_0), fmt("＀_hand4", [rt.sv(f, "deckstyle")]));
				} else {
					if (rt.gt(rt.getLen(f, rt.fv(f, "currenthand", live(H_0))), 2)) {
						rt.setFv(f, "icon_state", live(H_0), fmt("＀_hand3", [rt.sv(f, "deckstyle")]));
					}
				}
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't mix cards from other decks!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/toy/cards/singlecard/proc/attack_self  (code/game/objects/items/toys.dm:894)
rt.def("/obj/item/toy/cards/singlecard/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if ((((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy(rt.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	rt.callSrc(f, "Flip", []);
	return f.dot;
});

// /obj/item/toy/cards/singlecard/proc/apply_card_vars  (code/game/objects/items/toys.dm:899)
rt.def("/obj/item/toy/cards/singlecard/proc/apply_card_vars", function apply_card_vars(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "deckstyle", live(f.args[0]), rt.fv(f, "deckstyle", live(f.args[1])));
	rt.setFv(f, "icon_state", live(f.args[0]), fmt("singlecard_down_＀", [rt.sv(f, "deckstyle")]));
	rt.setFv(f, "card_hitsound", live(f.args[0]), rt.fv(f, "card_hitsound", live(f.args[1])));
	rt.setFv(f, "hitsound", live(f.args[0]), rt.fv(f, "card_hitsound", live(f.args[0])));
	rt.setFv(f, "card_force", live(f.args[0]), rt.fv(f, "card_force", live(f.args[1])));
	rt.setFv(f, "force", live(f.args[0]), rt.fv(f, "card_force", live(f.args[0])));
	rt.setFv(f, "card_throwforce", live(f.args[0]), rt.fv(f, "card_throwforce", live(f.args[1])));
	rt.setFv(f, "throwforce", live(f.args[0]), rt.fv(f, "card_throwforce", live(f.args[0])));
	rt.setFv(f, "card_throw_speed", live(f.args[0]), rt.fv(f, "card_throw_speed", live(f.args[1])));
	rt.setFv(f, "throw_speed", live(f.args[0]), rt.fv(f, "card_throw_speed", live(f.args[0])));
	rt.setFv(f, "card_throw_range", live(f.args[0]), rt.fv(f, "card_throw_range", live(f.args[1])));
	rt.setFv(f, "throw_range", live(f.args[0]), rt.fv(f, "card_throw_range", live(f.args[0])));
	rt.setFv(f, "card_attack_verb", live(f.args[0]), rt.fv(f, "card_attack_verb", live(f.args[1])));
	rt.setFv(f, "attack_verb", live(f.args[0]), rt.fv(f, "card_attack_verb", live(f.args[0])));
	return f.dot;
}, false, { args: ["newobj", "sourceobj"] });

rt.type(9722, "/obj/item/toy/nuke", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	name: "１Nuclear Fission Explosive toy",
	desc: "A plastic model of a Nuclear Fission Explosive.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nuketoyidle",
});

// /obj/item/toy/nuke/proc/attack_self  (code/game/objects/items/toys.dm:945)  may sleep
rt.def("/obj/item/toy/nuke/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let timeleft: Value = null;
	f.vars = () => [user, timeleft];
	if (rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 1800));
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ presses a button on ＀.</span>", [live(user), live(f.src)]), fmt("<span class='notice'>You activate ＀, it plays a loud noise!</span>", [live(f.src)]), "<span class='italics'>You hear the click of a button.</span>"]);
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		rt.setSv(f, "icon_state", "nuketoy");
		yield* g.call(f, P("/proc/playsound"), null, [null, live(f.src), null, rt.rsc("sound/machines/alarm.ogg"), null, 100, null, 0, "surround", 0], rt.Args.Named);
		yield* g.call(f, P("/proc/sleep"), null, [135]);
		rt.setSv(f, "icon_state", "nuketoycool");
		yield* g.call(f, P("/proc/sleep"), null, [subtract(rt.sv(f, "cooldown"), rt.worldTime(f))]);
		rt.setSv(f, "icon_state", "nuketoyidle");
	} else {
		timeleft = subtract(rt.sv(f, "cooldown"), rt.worldTime(f));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Nothing happens, and '</span>＀<span class='alert'>' appears on a small display.</span>", [(yield* g.call(f, P("/proc/round"), null, [divide(live(timeleft), 10)]))])]);
	}
	return f.dot;
}, true);

rt.type(9723, "/obj/item/toy/minimeteor", "/obj/item/toy", {
	w_class: 2,
	name: "１Mini-Meteor",
	desc: "Relive the excitement of a meteor shower! SweetMeat-eor. Co is not responsible for any injuries, headaches or hearing loss caused by Mini-Meteor.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "minimeteor",
});

// /obj/item/toy/minimeteor/proc/throw_impact  (code/game/objects/items/toys.dm:971)  may sleep
rt.def("/obj/item/toy/minimeteor/proc/throw_impact", function* throw_impact(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/meteorimpact.ogg"), 40, 1]);
	M = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [10, live(f.src)])), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((!truthy(rt.fv(f, "stat", live(M))) && !truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
			yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 3, 1]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(9679, "/obj/item/toy/carpplushie", "/obj/item/toy", {
	bitesound: rt.rsc("sound/weapons/bite.ogg"),
	item_state: "carp_plushie",
	w_class: 2,
	attack_verb: null,
	name: "space carp plushie",
	desc: "An adorable stuffed toy that resembles a space carp.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "carpplushie",
	resistance_flags: 4,
});

// /obj/item/toy/carpplushie/proc/attack  (code/game/objects/items/toys.dm:995)  may sleep
rt.def("/obj/item/toy/carpplushie/proc/attack", function* attack(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "bitesound"), 20, 1]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["M", "user"] });

// /obj/item/toy/carpplushie/proc/attack_self  (code/game/objects/items/toys.dm:1000)  may sleep
rt.def("/obj/item/toy/carpplushie/proc/attack_self", function* attack_self(f: Frame) {
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.sv(f, "bitesound"), 20, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You pet ＀. D'awww.</span>", [live(f.src)])]);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["user"] });

rt.type(9724, "/obj/item/toy/redbutton", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	name: "big red button",
	desc: "A big, plastic red button. Reads 'From HonkCo Pranks?' on the back.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bigred",
});

// /obj/item/toy/redbutton/proc/attack_self  (code/game/objects/items/toys.dm:1016)  may sleep
rt.def("/obj/item/toy/redbutton/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [user, M, $e];
	if (rt.lt(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 300));
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ presses the big red button.</span>", [live(user)]), "<span class='notice'>You press the button, it plays a loud noise!</span>", "<span class='italics'>The button clicks loudly.</span>"]);
		yield* g.call(f, P("/proc/playsound"), null, [null, live(f.src), null, rt.rsc("sound/effects/explosionfar.ogg"), null, 50, null, 0, "surround", 0], rt.Args.Named);
		M = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/urange"), null, [10, live(f.src)])), T("/mob"));
		while (($e = rt.next(f, 0)) !== undefined) {
			M = $e;
			if ((!truthy(rt.fv(f, "stat", live(M))) && !truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
				yield* g.call(f, P("/proc/sleep"), null, [8]);
				yield* g.call(f, P("/proc/shake_camera"), null, [live(M), 2, 1]);
			}
		}
		rt.endFor(f, 0);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='alert'>Nothing happens.</span>"]);
	}
	return f.dot;
}, true);

rt.type(9725, "/obj/item/toy/snowball", "/obj/item/toy", {
	name: "snowball",
	desc: "A compact ball of snow. Good for throwing at people.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snowball",
	throwforce: 12,
});

// /obj/item/toy/snowball/proc/afterattack  (code/game/objects/items/toys.dm:1040)  may sleep
rt.def("/obj/item/toy/snowball/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.callName(f, live(f.src), "throw_at", [live(target), rt.sv(f, "throw_range"), rt.sv(f, "throw_speed")]);
	return f.dot;
}, true);

// /obj/item/toy/snowball/proc/throw_impact  (code/game/objects/items/toys.dm:1044)  may sleep
rt.def("/obj/item/toy/snowball/proc/throw_impact", function* throw_impact(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/effects/pop.ogg"), 20, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

rt.type(9726, "/obj/item/toy/beach_ball", "/obj/item/toy", {
	item_state: "beachball",
	w_class: 4,
	icon: rt.rsc("icons/misc/beach.dmi"),
	icon_state: "ball",
	name: "beach ball",
});

// /obj/item/toy/beach_ball/proc/afterattack  (code/game/objects/items/toys.dm:1059)  may sleep
rt.def("/obj/item/toy/beach_ball/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	f.vars = () => [target, user];
	yield* g.callName(f, live(user), "drop_item", []);
	yield* g.callName(f, live(f.src), "throw_at", [live(target), rt.sv(f, "throw_range"), rt.sv(f, "throw_speed")]);
	return f.dot;
}, true);

rt.type(9729, "/obj/item/toy/toy_xeno", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "toy_xeno",
	name: "xenomorph action figure",
	desc: "MEGA presents the new Xenos Isolated action figure! Comes complete with realistic sounds! Pull back string to use.",
});

// /obj/item/toy/toy_xeno/proc/attack_self  (code/game/objects/items/toys.dm:1075)  may sleep
rt.def("/obj/item/toy/toy_xeno/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let possible_sounds: Value = null, chosen_sound: Value = null;
	f.vars = () => [user, possible_sounds, chosen_sound];
	if (rt.le(rt.sv(f, "cooldown"), rt.worldTime(f))) {
		rt.setSv(f, "cooldown", add(rt.worldTime(f), 50));
		yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ pulls back the string on ＀.</span>", [live(user), live(f.src)])]);
		rt.setSv(f, "icon_state", fmt("＀_used", [rt.initial(f, live(f.src), "icon_state")]));
		yield* g.call(f, P("/proc/sleep"), null, [5]);
		yield* g.srcCall(f, "audible_message", fmt("<span class='danger'>＀ Hiss!</span>", [(yield* g.call(f, P("/proc/bicon"), null, [live(f.src)]))]));
		possible_sounds = rt.list(rt.rsc("sound/voice/hiss1.ogg"), rt.rsc("sound/voice/hiss2.ogg"), rt.rsc("sound/voice/hiss3.ogg"), rt.rsc("sound/voice/hiss4.ogg"));
		chosen_sound = rt.op(f, "PickUnweighted", [1], [live(possible_sounds)]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), live(chosen_sound), 50, 1]);
		rt.spawnTail(f, 45, "/obj/item/toy/toy_xeno/proc/attack_self: spawn at game/objects/items/toys.dm:1084", user, possible_sounds, chosen_sound);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The string on ＀ hasn't rewound all the way!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	return f.dot;
}, true);

// a spawn(45) body of /obj/item/toy/toy_xeno/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/toy_xeno/proc/attack_self: spawn at game/objects/items/toys.dm:1084", function* (f: Frame, user: Value, possible_sounds: Value, chosen_sound: Value) {
	f.vars = () => [user, possible_sounds, chosen_sound];
	if (truthy(live(f.src))) {
		rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return null;
});

rt.type(9731, "/obj/item/toy/figure", "/obj/item/toy", {
	cooldown: 0,
	toysay: "What the fuck did you do?",
	toysound: rt.rsc("sound/machines/click.ogg"),
	name: "Non-Specific Action Figure action figure",
	desc: null,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nuketoy",
});

// /obj/item/toy/figure/proc/New  (code/game/objects/items/toys.dm:1117)  may sleep
rt.def("/obj/item/toy/figure/proc/New", function* New(f: Frame) {
	rt.setSv(f, "desc", fmt("A \"Space Life\" brand ＀.", [live(f.src)]));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/toy/figure/proc/attack_self  (code/game/objects/items/toys.dm:1121)
rt.def("/obj/item/toy/figure/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!rt.le(rt.sv(f, "cooldown"), rt.worldTime(f))) return f.dot;
	rt.setSv(f, "cooldown", add(rt.worldTime(f), 50));
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ says \"＀\"</span>", [live(f.src), rt.sv(f, "toysay")])]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "toysound"), 20, 1]);
	return f.dot;
});

rt.type(9768, "/obj/item/toy/dummy", "/obj/item/toy", {
	doll_name: "Dummy",
	item_state: "doll",
	name: "ventriloquist dummy",
	desc: "It's a dummy, dummy.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "assistant",
});

// /obj/item/toy/dummy/proc/attack_self  (code/game/objects/items/toys.dm:1324)  may sleep
rt.def("/obj/item/toy/dummy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let new_name: Value = null;
	f.vars = () => [user, new_name];
	if (!truthy((new_name = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.usr), "What would you like to name the dummy?", "Input a name", rt.sv(f, "doll_name"), 42]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "doll_name", live(new_name));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("You name the dummy as \"＀\"", [rt.sv(f, "doll_name")])]);
	rt.setSv(f, "name", fmt("＀ - ＀", [rt.initial(f, live(f.src), "name"), rt.sv(f, "doll_name")]));
	return f.dot;
}, true);

// /obj/item/toy/dummy/proc/talk_into  (code/game/objects/items/toys.dm:1332)  may sleep
rt.def("/obj/item/toy/dummy/proc/talk_into", function* talk_into(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	f.vars = () => [M, message, channel, spans, language];
	yield* g.call(f, P("/proc/log_say"), null, [fmt("＀ : through dummy : ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(M)])), live(message)])]);
	yield* g.srcCall(f, "say", live(message), live(language));
	return 4;
}, true);
