// From code/modules/projectiles/guns/ballistic/revolver.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5264, "/obj/item/weapon/gun/ballistic/revolver", "/obj/item/weapon/gun/ballistic", {
	casing_ejector: 0,
	name: "１.357 revolver",
	desc: "A suspicious revolver. Uses .357 ammo.",
	icon_state: "revolver",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder"),
	origin_tech: "combat=3;materials=2",
});

// /obj/item/weapon/gun/ballistic/revolver/proc/Initialize  (code/modules/projectiles/guns/ballistic/revolver.dm:10)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(rt.sv(f, "magazine"), T("/obj/item/ammo_box/magazine/internal/cylinder")) ? 1 : 0))) return f.dot;
	(rt.modSrcVar(f, "verbs", P("/obj/item/weapon/gun/ballistic/revolver/verb/spin"), subtract));
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/revolver/proc/chamber_round  (code/modules/projectiles/guns/ballistic/revolver.dm:16)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/chamber_round", function chamber_round(f: Frame, spin: Value) {
	f.vars = () => [spin];
	if (live(spin) === null) {
		spin = 1;
	}
	if (truthy(live(spin))) {
		rt.setSv(f, "chambered", rt.callName(f, rt.sv(f, "magazine"), "get_round", [1]));
	} else {
		rt.setSv(f, "chambered", rt.index(rt.fv(f, "stored_ammo", rt.sv(f, "magazine")), 1));
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/proc/shoot_with_empty_chamber  (code/modules/projectiles/guns/ballistic/revolver.dm:21)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "chamber_round", [1]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/ballistic/revolver/proc/attackby  (code/modules/projectiles/guns/ballistic/revolver.dm:25)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/attackby", function* attackby(f: Frame) {
	let num_loaded: Value = null;
	f.vars = () => [num_loaded];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy((num_loaded = (yield* g.callName(f, rt.sv(f, "magazine"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2]), 1]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load ＀ shell５ into ％！.</span>", [live(num_loaded), live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/weapons/bulletinsert.ogg"), 60, 1]);
	yield* g.callName(f, live(f.args[0]), "update_icon", []);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "chamber_round", 0);
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/revolver/proc/attack_self  (code/modules/projectiles/guns/ballistic/revolver.dm:39)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let num_unloaded: Value = null, CB: Value = null;
	f.vars = () => [num_unloaded, CB];
	num_unloaded = 0;
	rt.setSv(f, "chambered", null);
	while (rt.gt(rt.callSrc(f, "get_ammo", []), 0)) {
		CB = null;
		if (truthy((CB = rt.callName(f, rt.sv(f, "magazine"), "get_round", [0])))) {
			rt.setFv(f, "loc", live(CB), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
			rt.callName(f, live(CB), "SpinAnimation", [10, 1]);
			rt.callName(f, live(CB), "update_icon", []);
			num_unloaded = rt.inc(live(num_unloaded), 1);
		}
	}
	if (truthy(live(num_unloaded))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You unload ＀ shell５ from ＀.</span>", [live(num_unloaded), live(f.src)])]);
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/bulletremove.ogg"), 60, 1]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/verb/spin  (code/modules/projectiles/guns/ballistic/revolver.dm:58)
rt.def("/obj/item/weapon/gun/ballistic/revolver/verb/spin", function spin(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if ((truthy(rt.gv(f, "stat", (M = live(f.usr)))) || !rt.le(rt.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)]), 1))) {
		return live(f.dot);
	}
	if (truthy(rt.callSrc(f, "do_spin", []))) {
		rt.callName(f, live(f.usr), "visible_message", [fmt("＀ spins ＀'s chamber.", [live(f.usr), live(f.src)]), fmt("<span class='notice'>You spin ＀'s chamber.</span>", [live(f.src)])]);
	} else {
		(rt.modSrcVar(f, "verbs", P("/obj/item/weapon/gun/ballistic/revolver/verb/spin"), subtract));
	}
	return f.dot;
}, false, { verb: { name: "Spin Chamber", category: "Object", desc: "Click to spin your revolver's chamber." } });

// /obj/item/weapon/gun/ballistic/revolver/proc/do_spin  (code/modules/projectiles/guns/ballistic/revolver.dm:69)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/do_spin", function do_spin(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	f.dot = (rt.istype((C = rt.sv(f, "magazine")), T("/obj/item/ammo_box/magazine/internal/cylinder")) ? 1 : 0);
	if (!truthy(live(f.dot))) return f.dot;
	rt.callName(f, live(C), "spin", []);
	rt.callSrc(f, "chamber_round", [0]);
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/proc/can_shoot  (code/modules/projectiles/guns/ballistic/revolver.dm:76)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/can_shoot", function can_shoot(f: Frame) {
	return rt.callSrc(f, "get_ammo", [0, 0]);
});

// /obj/item/weapon/gun/ballistic/revolver/proc/get_ammo  (code/modules/projectiles/guns/ballistic/revolver.dm:80)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/get_ammo", function get_ammo(f: Frame, countchambered: Value, countempties: Value) {
	let boolets: Value = null;
	f.vars = () => [countchambered, countempties, boolets];
	if (live(countchambered) === null) {
		countchambered = 0;
	}
	if (live(countempties) === null) {
		countempties = 1;
	}
	boolets = 0;
	if ((truthy(rt.sv(f, "chambered")) && truthy(live(countchambered)))) {
		boolets = rt.inc(live(boolets), 1);
	}
	if (truthy(rt.sv(f, "magazine"))) {
		boolets = rt.modify(live(boolets), rt.callName(f, rt.sv(f, "magazine"), "ammo_count", [live(countempties)]), add);
	}
	return live(boolets);
});

// /obj/item/weapon/gun/ballistic/revolver/proc/examine  (code/modules/projectiles/guns/ballistic/revolver.dm:87)
rt.def("/obj/item/weapon/gun/ballistic/revolver/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ of those are live rounds.", [rt.callSrc(f, "get_ammo", [0, 0])])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(5268, "/obj/item/weapon/gun/ballistic/revolver/detective", "/obj/item/weapon/gun/ballistic/revolver", {
	name: "１.38 Mars Special",
	desc: "A cheap Martian knock-off of a classic law enforcement firearm. Uses .38-special rounds.",
	icon_state: "detective",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/rev38"),
	unique_rename: 1,
	unique_reskin: null,
});

// /obj/item/weapon/gun/ballistic/revolver/detective/proc/<init>  (code/modules/projectiles/guns/ballistic/revolver.dm:96)
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "unique_reskin", rt.alist(f, ["Default", "detective", "Leopard Spots", "detective_leopard", "Black Panther", "detective_panther", "Gold Trim", "detective_gold", "The Peacemaker", "detective_peacemaker"]));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/detective/proc/process_fire  (code/modules/projectiles/guns/ballistic/revolver.dm:104)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/process_fire", function* process_fire(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (live(f.args[4]) === null) {
		f.args[4] = "";
	}
	if (!isEqual(rt.fv(f, "caliber", rt.sv(f, "magazine")), rt.initial(f, rt.sv(f, "magazine"), "caliber"))) {
		if (truthy(rt.op(f, "Prob", [], [subtract(70, multiply((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])), 10))]))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.sv(f, "fire_sound"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='userdanger'>＀ blows up in your face!</span>", [live(f.src)])]);
			yield* g.callName(f, live(f.args[1]), "take_bodypart_damage", [0, 20]);
			yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(f.src)]);
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "message", "params", "zone_override"] });

// /obj/item/weapon/gun/ballistic/revolver/detective/proc/attackby  (code/modules/projectiles/guns/ballistic/revolver.dm:114)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/detective/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) return f.dot;
	if (isEqual(rt.fv(f, "caliber", rt.sv(f, "magazine")), "38")) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to reinforce the barrel of ＀...</span>", [live(f.src)])]);
		if (truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) {
			yield* g.srcCall(f, "afterattack", live(f.args[1]), live(f.args[1]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ goes off!</span>", [live(f.src)]), fmt("<span class='userdanger'>＀ goes off in your face!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			if (truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't modify it!</span>"]);
				return live(f.dot);
			}
			rt.setFv(f, "caliber", rt.sv(f, "magazine"), "357");
			rt.setSv(f, "desc", "The barrel and chamber assembly seems to have been modified.");
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You reinforce the barrel of ＀. Now it will fire .357 rounds.</span>", [live(f.src)])]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You begin to revert the modifications to ＀...</span>", [live(f.src)])]);
		if (truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) {
			yield* g.srcCall(f, "afterattack", live(f.args[1]), live(f.args[1]));
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='danger'>＀ goes off!</span>", [live(f.src)]), fmt("<span class='userdanger'>＀ goes off in your face!</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(30, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) return f.dot;
		if (truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can't modify it!</span>"]);
			return live(f.dot);
		}
		rt.setFv(f, "caliber", rt.sv(f, "magazine"), "38");
		rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You remove the modifications on ＀. Now it will fire .38 rounds.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

rt.type(5272, "/obj/item/weapon/gun/ballistic/revolver/russian", "/obj/item/weapon/gun/ballistic/revolver", {
	spun: 0,
	name: "１russian revolver",
	desc: "A Russian-made revolver for drinking games. Uses .357 ammo, and has a mechanism requiring you to spin the chamber before each trigger pull.",
	origin_tech: "combat=2;materials=2",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/cylinder/rus357"),
});

// /obj/item/weapon/gun/ballistic/revolver/russian/proc/Initialize  (code/modules/projectiles/guns/ballistic/revolver.dm:177)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "do_spin");
	rt.setSv(f, "spun", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/revolver/russian/proc/attackby  (code/modules/projectiles/guns/ballistic/revolver.dm:183)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (rt.gt((yield* g.srcCall(f, "get_ammo")), 0)) {
		yield* g.srcCall(f, "spin");
		rt.setSv(f, "spun", 1);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, live(f.args[0]), "update_icon", []);
	return live(f.dot);
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/revolver/russian/proc/attack_self  (code/modules/projectiles/guns/ballistic/revolver.dm:192)
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/attack_self", function attack_self(f: Frame) {
	if ((!truthy(rt.sv(f, "spun")) && truthy(rt.callSrc(f, "can_shoot", [])))) {
		rt.callSrc(f, "spin", []);
		rt.setSv(f, "spun", 1);
		return live(f.dot);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/ballistic/revolver/russian/proc/afterattack  (code/modules/projectiles/guns/ballistic/revolver.dm:200)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	let H: Value = null, AC: Value = null, zone: Value = null, affecting: Value = null;
	f.vars = () => [target, user, flag, params, H, AC, zone, affecting];
	if (truthy(live(flag))) {
		if ((!truthy((rt.isIn(f, live(target), rt.fv(f, "contents", live(user))) ? 1 : 0)) && truthy((yield* g.call(f, P("/proc/ismob"), null, [live(target)]))))) {
			if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) {
				return live(f.dot);
			}
		}
	}
	if (truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) {
		if (!truthy((yield* g.srcCall(f, "can_trigger_gun", live(user))))) {
			return live(f.dot);
		}
	}
	if (!isEqual(live(target), live(user))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(target)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>A mechanism prevents you from shooting anyone but yourself!</span>"]);
		}
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	H = live(user);
	if (!truthy(rt.sv(f, "spun"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to spin the revolver's chamber first!</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "spun", 0);
	if (truthy(rt.sv(f, "chambered"))) {
		if (truthy((yield* g.callName(f, (AC = rt.sv(f, "chambered")), "fire_casing", [live(user), live(user)])))) {
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "fire_sound"), 50, 1]);
			zone = (yield* g.call(f, P("/proc/check_zone"), null, [rt.fv(f, "zone_selected", live(user))]));
			affecting = (yield* g.callName(f, live(H), "get_bodypart", [live(zone)]));
			if (((isEqual(live(zone), "head") || isEqual(live(zone), "eyes")) || isEqual(live(zone), "mouth"))) {
				yield* g.srcCall(f, "shoot_self", live(user), live(affecting));
			} else {
				yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ cowardly fires ＀ at ＀ ＀!</span>", [rt.fv(f, "name", live(user)), live(f.src), (yield* g.callName(f, live(user), "p_their", [])), rt.fv(f, "name", live(affecting))]), fmt("<span class='userdanger'>You cowardly fire ＀ at your ＀!</span>", [live(f.src), rt.fv(f, "name", live(affecting))]), "<span class='italics'>You hear a gunshot!</span>"]);
			}
			rt.setSv(f, "chambered", null);
			return live(f.dot);
		}
	}
	yield* g.callName(f, live(user), "visible_message", ["<span class='danger'>*click*</span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/revolver/russian/proc/shoot_self  (code/modules/projectiles/guns/ballistic/revolver.dm:237)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/proc/shoot_self", function* shoot_self(f: Frame, user: Value, affecting: Value) {
	f.vars = () => [user, affecting];
	if (live(affecting) === null) {
		affecting = "head";
	}
	yield* g.callName(f, live(user), "apply_damage", [300, "brute", live(affecting)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ fires ＀ at ＀ head!</span>", [rt.fv(f, "name", live(user)), live(f.src), (yield* g.callName(f, live(user), "p_their", []))]), fmt("<span class='userdanger'>You fire ＀ at your head!</span>", [live(f.src)]), "<span class='italics'>You hear a gunshot!</span>"]);
	return f.dot;
}, true);

rt.type(5273, "/obj/item/weapon/gun/ballistic/revolver/russian/soul", "/obj/item/weapon/gun/ballistic/revolver/russian", {
	name: "cursed russian revolver",
	desc: "To play with this revolver requires wagering your very soul.",
});

// /obj/item/weapon/gun/ballistic/revolver/russian/soul/proc/shoot_self  (code/modules/projectiles/guns/ballistic/revolver.dm:245)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/russian/soul/proc/shoot_self", function* shoot_self(f: Frame) {
	let SS: Value = null;
	f.vars = () => [SS];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((yield* g.callName(f, (SS = (yield* g.new_(f, T("/obj/item/device/soulstone/anybody"), [rt.getStep(f, live(f.src), 0)]))), "transfer_soul", ["FORCE", live(f.args[0])])))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(SS)]);
		return live(f.dot);
	}
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='danger'>＀'s soul is captured by ％！!</span>", [rt.fv(f, "name", live(f.args[0])), live(f.src)]), "<span class='userdanger'>You've lost the gamble! Your soul is forfiet!</span>"]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5274, "/obj/item/weapon/gun/ballistic/revolver/doublebarrel", "/obj/item/weapon/gun/ballistic/revolver", {
	flags: 64,
	name: "double-barreled shotgun",
	desc: "A true classic.",
	icon_state: "dshotgun",
	item_state: "shotgun",
	w_class: 4,
	weapon_weight: 2,
	force: 10,
	slot_flags: 1024,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/dual"),
	sawn_desc: "Omar's coming!",
	unique_rename: 1,
	unique_reskin: null,
});

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/<init>  (code/modules/projectiles/guns/ballistic/revolver.dm:269)
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "unique_reskin", rt.alist(f, ["Default", "dshotgun", "Dark Red Finish", "dshotgun-d", "Ash", "dshotgun-f", "Faded Grey", "dshotgun-g", "Maple", "dshotgun-1", "Rosewood", "dshotgun-p"]));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attackby  (code/modules/projectiles/guns/ballistic/revolver.dm:278)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_box")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_casing")) ? 1 : 0)))) {
		yield* g.srcCall(f, "chamber_round");
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/melee/energy")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "active", (W = live(f.args[0]))))) {
			yield* g.srcCall(f, "sawoff", live(f.args[1]));
		}
	}
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circular_saw")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "sawoff", live(f.args[1]));
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attack_self  (code/modules/projectiles/guns/ballistic/revolver.dm:290)
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let num_unloaded: Value = null, CB: Value = null;
	f.vars = () => [num_unloaded, CB];
	num_unloaded = 0;
	while (rt.gt(rt.callSrc(f, "get_ammo", []), 0)) {
		CB = null;
		CB = rt.callName(f, rt.sv(f, "magazine"), "get_round", [0]);
		rt.setSv(f, "chambered", null);
		rt.setFv(f, "loc", live(CB), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
		rt.callName(f, live(CB), "update_icon", []);
		num_unloaded = rt.inc(live(num_unloaded), 1);
	}
	if (truthy(live(num_unloaded))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You break open ％！ and unload ＀ shell５.</span>", [live(f.src), live(num_unloaded)])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
	}
	return f.dot;
});

rt.type(5275, "/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised", "/obj/item/weapon/gun/ballistic/revolver/doublebarrel", {
	slung: 0,
	name: "improvised shotgun",
	desc: "Essentially a tube that aims shotgun shells.",
	icon_state: "ishotgun",
	item_state: "shotgun",
	w_class: 4,
	force: 10,
	slot_flags: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/improvised"),
	sawn_desc: "I'm just here for the gasoline.",
	unique_rename: 0,
	unique_reskin: null,
});

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/<init>  (code/modules/projectiles/guns/ballistic/revolver.dm:315)
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "unique_reskin", null);
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/attackby  (code/modules/projectiles/guns/ballistic/revolver.dm:319)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && !truthy(rt.sv(f, "sawn_state")))) return f.dot;
	if (truthy((yield* g.callName(f, (C = live(f.args[0])), "use", [10])))) {
		rt.setSv(f, "slot_flags", 1024);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You tie the lengths of cable to the shotgun, making a sling.</span>"]);
		rt.setSv(f, "slung", 1);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least ten lengths of cable if you want to make a sling!</span>"]);
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/update_icon  (code/modules/projectiles/guns/ballistic/revolver.dm:331)
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "slung"))) return f.dot;
	rt.modSrcVar(f, "icon_state", "sling", add);
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/sawoff  (code/modules/projectiles/guns/ballistic/revolver.dm:336)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/doublebarrel/improvised/proc/sawoff", function* sawoff(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.dot)) && truthy(rt.sv(f, "slung")))) return f.dot;
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.src), 0), 10]);
	rt.setSv(f, "slung", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });

rt.type(5277, "/obj/item/weapon/gun/ballistic/revolver/reverse", "/obj/item/weapon/gun/ballistic/revolver", {
	clumsy_check: 0,
});

// /obj/item/weapon/gun/ballistic/revolver/reverse/proc/can_trigger_gun  (code/modules/projectiles/guns/ballistic/revolver.dm:356)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/reverse/proc/can_trigger_gun", function* can_trigger_gun(f: Frame) {
	if ((truthy(rt.bitAnd(rt.fv(f, "disabilities", live(f.args[0])), 256)) || (truthy(rt.fv(f, "mind", live(f.args[0]))) && isEqual(rt.gv(f, "assigned_role", rt.fv(f, "mind", live(f.args[0]))), "Clown")))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!truthy((yield* g.callSrc(f, "process_fire", [null, live(f.args[0]), null, live(f.args[0]), null, 0, "zone_override", "head"], rt.Args.Named)))) return f.dot;
	yield* g.callName(f, live(f.args[0]), "visible_message", [fmt("<span class='warning'>＀ somehow manages to shoot ＀self in the face!</span>", [live(f.args[0]), (yield* g.callName(f, live(f.args[0]), "p_them", []))]), "<span class='userdanger'>You somehow shoot yourself in the face! How the hell?!</span>"]);
	yield* g.callName(f, live(f.args[0]), "emote", ["scream"]);
	yield* g.callName(f, live(f.args[0]), "drop_item", []);
	yield* g.callName(f, live(f.args[0]), "Knockdown", [80]);
	return f.dot;
}, true, { args: ["user"] });
