// From code/modules/projectiles/guns/ballistic/shotgun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5248, "/obj/item/weapon/gun/ballistic/shotgun", "/obj/item/weapon/gun/ballistic", {
	recentpump: 0,
	flags: 64,
	name: "shotgun",
	desc: "A traditional shotgun with wood furniture and a four-shell capacity underneath.",
	icon_state: "shotgun",
	item_state: "shotgun",
	w_class: 4,
	force: 10,
	slot_flags: 1024,
	origin_tech: "combat=4;materials=2",
	casing_ejector: 0,
	weapon_weight: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot"),
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/attackby  (code/modules/projectiles/guns/ballistic/shotgun.dm:17)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/attackby", function* attackby(f: Frame) {
	let num_loaded: Value = null;
	f.vars = () => [num_loaded];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy((num_loaded = (yield* g.callName(f, rt.sv(f, "magazine"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2]), 1]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You load ＀ shell５ into ％！!</span>", [live(num_loaded), live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/weapons/shotguninsert.ogg"), 60, 1]);
	yield* g.callName(f, live(f.args[0]), "update_icon", []);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/shotgun/proc/process_chamber  (code/modules/projectiles/guns/ballistic/shotgun.dm:28)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/process_chamber", function* process_chamber(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["empty_chamber"] });

// /obj/item/weapon/gun/ballistic/shotgun/proc/can_shoot  (code/modules/projectiles/guns/ballistic/shotgun.dm:34)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/can_shoot", function can_shoot(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (!truthy(rt.sv(f, "chambered"))) {
		return 0;
	}
	if (truthy(rt.fv(f, "BB", rt.sv(f, "chambered")))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	return $0;
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/attack_self  (code/modules/projectiles/guns/ballistic/shotgun.dm:39)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (rt.gt(rt.sv(f, "recentpump"), rt.worldTime(f))) {
		return live(f.dot);
	}
	rt.callSrc(f, "pump", [live(user)]);
	rt.setSv(f, "recentpump", add(rt.worldTime(f), 10));
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/blow_up  (code/modules/projectiles/guns/ballistic/shotgun.dm:47)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/blow_up", function* blow_up(f: Frame, user: Value) {
	f.vars = () => [user];
	f.dot = 0;
	if (!(truthy(rt.sv(f, "chambered")) && truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) return f.dot;
	yield* g.srcCall(f, "process_fire", live(user), live(user), 0);
	f.dot = 1;
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/shotgun/proc/pump  (code/modules/projectiles/guns/ballistic/shotgun.dm:52)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump", function pump(f: Frame, M: Value) {
	rt.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/weapons/shotgunpump.ogg"), 60, 1]);
	rt.callSrc(f, "pump_unload", [live(M)]);
	rt.callSrc(f, "pump_reload", [live(M)]);
	rt.callSrc(f, "update_icon", []);
	return 1;
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/pump_unload  (code/modules/projectiles/guns/ballistic/shotgun.dm:60)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump_unload", function pump_unload(f: Frame, M: Value) {
	if (!truthy(rt.sv(f, "chambered"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "chambered"), rt.getStep(f, live(f.src), 0));
	rt.callName(f, rt.sv(f, "chambered"), "SpinAnimation", [5, 1]);
	rt.setSv(f, "chambered", null);
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/pump_reload  (code/modules/projectiles/guns/ballistic/shotgun.dm:65)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/pump_reload", function pump_reload(f: Frame, M: Value) {
	let AC: Value = null;
	f.vars = () => [AC];
	if (!truthy(rt.callName(f, rt.sv(f, "magazine"), "ammo_count", []))) {
		return 0;
	}
	rt.setSv(f, "chambered", (AC = rt.callName(f, rt.sv(f, "magazine"), "get_round", [])));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/shotgun/proc/examine  (code/modules/projectiles/guns/ballistic/shotgun.dm:72)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "chambered"))) return f.dot;
	$0 = live(f.args[0]);
	if (truthy(rt.fv(f, "BB", rt.sv(f, "chambered")))) {
		$1 = "live";
	} else {
		$1 = "spent";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("A ＀ one is in the chamber.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(5251, "/obj/item/weapon/gun/ballistic/shotgun/riot", "/obj/item/weapon/gun/ballistic/shotgun", {
	name: "riot shotgun",
	desc: "A sturdy shotgun with a longer magazine and a fixed tactical stock designed for non-lethal riot control.",
	icon_state: "riotshotgun",
	sawn_desc: "Come with me if you want to live.",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/riot"),
});

// /obj/item/weapon/gun/ballistic/shotgun/riot/proc/attackby  (code/modules/projectiles/guns/ballistic/shotgun.dm:89)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/riot/proc/attackby", function* attackby(f: Frame) {
	let W: Value = null;
	f.vars = () => [W];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circular_saw")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/gun/energy/plasmacutter")) ? 1 : 0)))) {
		yield* g.srcCall(f, "sawoff", live(f.args[1]));
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/melee/energy")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "active", (W = live(f.args[0]))))) return f.dot;
	yield* g.srcCall(f, "sawoff", live(f.args[1]));
	return f.dot;
}, true, { args: ["A", "user", "params"] });

rt.type(5252, "/obj/item/weapon/gun/ballistic/shotgun/boltaction", "/obj/item/weapon/gun/ballistic/shotgun", {
	bolt_open: 0,
	name: "１Mosin Nagant",
	desc: "This piece of junk looks like something that could have been used 700 years ago. It feels slightly moist.",
	icon_state: "moistnugget",
	item_state: "moistnugget",
	slot_flags: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/boltaction"),
});

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/pump  (code/modules/projectiles/guns/ballistic/shotgun.dm:111)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/pump", function pump(f: Frame, M: Value) {
	rt.call(f, P("/proc/playsound"), null, [live(M), rt.rsc("sound/weapons/shotgunpump.ogg"), 60, 1]);
	if (truthy(rt.sv(f, "bolt_open"))) {
		rt.callSrc(f, "pump_reload", [live(M)]);
	} else {
		rt.callSrc(f, "pump_unload", [live(M)]);
	}
	rt.setSv(f, "bolt_open", (!truthy(rt.sv(f, "bolt_open")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return 1;
});

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/attackby  (code/modules/projectiles/guns/ballistic/shotgun.dm:121)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/attackby", function* attackby(f: Frame) {
	if (!truthy(rt.sv(f, "bolt_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The bolt is closed!</span>"]);
		return live(f.dot);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/examine  (code/modules/projectiles/guns/ballistic/shotgun.dm:127)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "bolt_open"))) {
		$1 = "open";
	} else {
		$1 = "closed";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The bolt is ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(5253, "/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted", "/obj/item/weapon/gun/ballistic/shotgun/boltaction", {
	guns_left: 30,
	gun_type: null,
	name: "enchanted bolt action rifle",
	desc: "Careful not to lose your head.",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/boltaction/enchanted"),
});

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/Initialize  (code/modules/projectiles/guns/ballistic/shotgun.dm:151)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "bolt_open", 1);
	yield* g.srcCall(f, "pump");
	rt.setSv(f, "gun_type", rt.sv(f, "type"));
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/dropped  (code/modules/projectiles/guns/ballistic/shotgun.dm:157)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "guns_left", 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/discard_gun  (code/modules/projectiles/guns/ballistic/shotgun.dm:161)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/discard_gun", function* discard_gun(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "throw_at", rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [7, rt.getStep(f, live(user), 0)]))]), 1, 1);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ tosses aside the spent rifle!</span>", [live(user)])]);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/shoot_live_shot  (code/modules/projectiles/guns/ballistic/shotgun.dm:171)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/boltaction/enchanted/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	let GUN: Value = null;
	f.vars = () => [GUN];
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	if (live(f.args[2]) === null) {
		f.args[2] = null;
	}
	if (live(f.args[3]) === null) {
		f.args[3] = 1;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "guns_left"))) {
		rt.setFv(f, "guns_left", (GUN = (yield* g.new_(f, rt.sv(f, "gun_type"), []))), subtract(rt.sv(f, "guns_left"), 1));
		yield* g.callName(f, live(f.args[0]), "drop_item", []);
		yield* g.callName(f, live(f.args[0]), "swap_hand", []);
		yield* g.callName(f, live(f.args[0]), "put_in_hands", [live(GUN)]);
	} else {
		yield* g.callName(f, live(f.args[0]), "drop_item", []);
	}
	yield* g.srcCall(f, "discard_gun", live(f.args[0]));
	return f.dot;
}, true, { args: ["user", "pointblank", "pbtarget", "message"] });

rt.type(5255, "/obj/item/weapon/gun/ballistic/shotgun/automatic", "/obj/item/weapon/gun/ballistic/shotgun", {});

// /obj/item/weapon/gun/ballistic/shotgun/automatic/proc/shoot_live_shot  (code/modules/projectiles/guns/ballistic/shotgun.dm:185)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/proc/shoot_live_shot", function shoot_live_shot(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callName(f, live(f.src), "pump", [live(f.args[0])]);
	return f.dot;
}, false, { args: ["user"] });

rt.type(5258, "/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube", "/obj/item/weapon/gun/ballistic/shotgun/automatic", {
	toggled: 0,
	alternate_magazine: null,
	name: "cycler shotgun",
	desc: "An advanced shotgun with two separate magazine tubes, allowing you to quickly toggle between ammo types.",
	icon_state: "cycler",
	origin_tech: "combat=4;materials=2",
	w_class: 5,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/tube"),
});

// /obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/Initialize  (code/modules/projectiles/guns/ballistic/shotgun.dm:217)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "alternate_magazine"))) return f.dot;
	rt.setSv(f, "alternate_magazine", (yield* g.new_(f, rt.sv(f, "mag_type"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/attack_self  (code/modules/projectiles/guns/ballistic/shotgun.dm:222)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if ((!truthy(rt.sv(f, "chambered")) && truthy(rt.getLen(f, rt.fv(f, "contents", rt.sv(f, "magazine")))))) {
		rt.callSrc(f, "pump", []);
	} else {
		rt.callSrc(f, "toggle_tube", [live(user)]);
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/toggle_tube  (code/modules/projectiles/guns/ballistic/shotgun.dm:228)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/toggle_tube", function toggle_tube(f: Frame, user: Value) {
	let current_mag: Value = null, alt_mag: Value = null;
	f.vars = () => [current_mag, alt_mag];
	current_mag = rt.sv(f, "magazine");
	rt.setSv(f, "magazine", (alt_mag = rt.sv(f, "alternate_magazine")));
	rt.setSv(f, "alternate_magazine", live(current_mag));
	rt.setSv(f, "toggled", (!truthy(rt.sv(f, "toggled")) ? 1 : 0));
	if (truthy(rt.sv(f, "toggled"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You switch to tube B."]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You switch to tube A."]);
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/AltClick  (code/modules/projectiles/guns/ballistic/shotgun.dm:239)
rt.def("/obj/item/weapon/gun/ballistic/shotgun/automatic/dual_tube/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (((truthy(rt.callName(f, live(user), "incapacitated", [])) || !truthy(rt.callSrc(f, "Adjacent", [live(user)]))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.callSrc(f, "pump", []);
	return f.dot;
});
