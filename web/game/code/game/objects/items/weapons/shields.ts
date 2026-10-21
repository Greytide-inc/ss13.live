// From code/game/objects/items/weapons/shields.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5699, "/obj/item/weapon/shield", "/obj/item/weapon", {
	name: "shield",
	block_chance: 50,
	armor: null,
});

// /obj/item/weapon/shield/proc/<init>  (code/game/objects/items/weapons/shields.dm:4)
rt.def("/obj/item/weapon/shield/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 80, "acid", 70]));
	return f.dot;
});

rt.type(5701, "/obj/item/weapon/shield/riot", "/obj/item/weapon/shield", {
	cooldown: 0,
	throw_speed: 2,
	throw_range: 3,
	name: "riot shield",
	desc: "A shield adept at blocking blunt objects from connecting with the torso of the shield wielder.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "riot",
	slot_flags: 1024,
	force: 10,
	throwforce: 5,
	w_class: 4,
	materials: null,
	origin_tech: "materials=3;combat=4",
	attack_verb: null,
});

// /obj/item/weapon/shield/riot/proc/<init>  (code/game/objects/items/weapons/shields.dm:17)
rt.def("/obj/item/weapon/shield/riot/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 7500, "$metal", 1000]));
	rt.setSv(f, "attack_verb", rt.list("shoved", "bashed"));
	return f.dot;
});

// /obj/item/weapon/shield/riot/proc/attackby  (code/game/objects/items/weapons/shields.dm:24)  may sleep
rt.def("/obj/item/weapon/shield/riot/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/melee/baton")) ? 1 : 0))) {
		if (rt.lt(rt.sv(f, "cooldown"), subtract(rt.worldTime(f), 25))) {
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ bashes ＀ with ＀!</span>", [live(f.args[1]), live(f.src), live(f.args[0])])]);
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.args[1])), rt.rsc("sound/effects/shieldbash.ogg"), 50, 1]);
			rt.setSv(f, "cooldown", rt.worldTime(f));
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/shield/proc/hit_reaction  (code/game/objects/items/weapons/shields.dm:33)
rt.def("/obj/item/weapon/shield/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (isEqual(live(f.args[5]), 4)) {
		f.args[3] = rt.modify(live(f.args[3]), 30, add);
	}
	if (isEqual(live(f.args[5]), 5)) {
		f.args[3] = 100;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

rt.type(5703, "/obj/item/weapon/shield/riot/buckler", "/obj/item/weapon/shield/riot", {
	name: "wooden buckler",
	desc: "A medieval wooden buckler.",
	icon_state: "buckler",
	item_state: "buckler",
	materials: null,
	origin_tech: "materials=1;combat=3;biotech=2",
	resistance_flags: 4,
	block_chance: 30,
});

// /obj/item/weapon/shield/riot/buckler/proc/<init>  (code/game/objects/items/weapons/shields.dm:50)
rt.def("/obj/item/weapon/shield/riot/buckler/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

rt.type(5705, "/obj/item/weapon/shield/energy", "/obj/item/weapon/shield", {
	active: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "energy combat shield",
	desc: "A shield capable of stopping most melee attacks. Protects user from almost all energy projectiles. It can be retracted, expanded, and stored anywhere.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "eshield0",
	force: 3,
	throwforce: 3,
	w_class: 1,
	origin_tech: "materials=4;magnets=5;syndicate=6",
	attack_verb: null,
});

// /obj/item/weapon/shield/energy/proc/attack_self  (code/game/objects/items/weapons/shields.dm:76)  may sleep
rt.def("/obj/item/weapon/shield/energy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(user)), 256)) && truthy(rt.op(f, "Prob", [], [50])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You beat yourself in the head with ＀.</span>", [live(f.src)])]);
		yield* g.callName(f, live(user), "take_bodypart_damage", [5]);
	}
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("eshield＀", [rt.sv(f, "active")]));
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "force", 10);
		rt.setSv(f, "throwforce", 8);
		rt.setSv(f, "throw_speed", 2);
		rt.setSv(f, "w_class", 4);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberon.ogg"), 35, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is now active.</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "force", 3);
		rt.setSv(f, "throwforce", 3);
		rt.setSv(f, "throw_speed", 3);
		rt.setSv(f, "w_class", 1);
		yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/saberoff.ogg"), 35, 1]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ can now be concealed.</span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);

rt.type(5704, "/obj/item/weapon/shield/riot/tele", "/obj/item/weapon/shield/riot", {
	active: 0,
	throw_speed: 3,
	throw_range: 4,
	name: "telescopic shield",
	desc: "An advanced riot shield made of lightweight materials that collapses for easy storage.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "teleriot0",
	origin_tech: "materials=3;combat=4;engineering=4",
	slot_flags: null,
	force: 3,
	throwforce: 3,
	w_class: 3,
});

// /obj/item/weapon/shield/riot/tele/proc/hit_reaction  (code/game/objects/items/weapons/shields.dm:114)
rt.def("/obj/item/weapon/shield/riot/tele/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (truthy(rt.sv(f, "active"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// /obj/item/weapon/shield/riot/tele/proc/attack_self  (code/game/objects/items/weapons/shields.dm:118)  may sleep
rt.def("/obj/item/weapon/shield/riot/tele/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "active", (!truthy(rt.sv(f, "active")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("teleriot＀", [rt.sv(f, "active")]));
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/batonextend.ogg"), 50, 1]);
	if (truthy(rt.sv(f, "active"))) {
		rt.setSv(f, "force", 8);
		rt.setSv(f, "throwforce", 5);
		rt.setSv(f, "throw_speed", 2);
		rt.setSv(f, "w_class", 4);
		rt.setSv(f, "slot_flags", 1024);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You extend ％！.</span>", [live(f.src)])]);
	} else {
		rt.setSv(f, "force", 3);
		rt.setSv(f, "throwforce", 3);
		rt.setSv(f, "throw_speed", 3);
		rt.setSv(f, "w_class", 3);
		rt.setSv(f, "slot_flags", null);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ can now be concealed.</span>", [live(f.src)])]);
	}
	yield* g.srcCall(f, "add_fingerprint", live(user));
	return f.dot;
}, true);
