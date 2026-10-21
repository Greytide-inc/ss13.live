// From code/modules/projectiles/guns/syringe_gun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5281, "/obj/item/weapon/gun/syringe", "/obj/item/weapon/gun", {
	syringes: null,
	max_syringes: 1,
	throw_speed: 3,
	throw_range: 7,
	clumsy_check: 0,
	fire_sound: rt.rsc("sound/items/syringeproj.ogg"),
	name: "syringe gun",
	desc: "A spring loaded rifle designed to fit syringes, used to incapacitate unruly patients from a distance.",
	icon_state: "syringegun",
	item_state: "syringegun",
	w_class: 3,
	force: 4,
	materials: null,
	origin_tech: "combat=2;biotech=3",
});

// /obj/item/weapon/gun/syringe/proc/<init>  (code/modules/projectiles/guns/syringe_gun.dm:14)
rt.def("/obj/item/weapon/gun/syringe/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "syringes", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	return f.dot;
});

// /obj/item/weapon/gun/syringe/proc/Initialize  (code/modules/projectiles/guns/syringe_gun.dm:18)  may sleep
rt.def("/obj/item/weapon/gun/syringe/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "chambered", (yield* g.new_(f, T("/obj/item/ammo_casing/syringegun"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/gun/syringe/proc/recharge_newshot  (code/modules/projectiles/guns/syringe_gun.dm:22)  may sleep
rt.def("/obj/item/weapon/gun/syringe/proc/recharge_newshot", function* recharge_newshot(f: Frame) {
	if (!truthy(rt.len(f, rt.sv(f, "syringes")))) {
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "chambered"), "newshot", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/syringe/proc/can_shoot  (code/modules/projectiles/guns/syringe_gun.dm:27)
rt.def("/obj/item/weapon/gun/syringe/proc/can_shoot", function can_shoot(f: Frame) {
	return rt.len(f, rt.sv(f, "syringes"));
});

// /obj/item/weapon/gun/syringe/proc/process_chamber  (code/modules/projectiles/guns/syringe_gun.dm:30)  may sleep
rt.def("/obj/item/weapon/gun/syringe/proc/process_chamber", function* process_chamber(f: Frame) {
	if (!(truthy(rt.sv(f, "chambered")) && !truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) return f.dot;
	yield* g.srcCall(f, "recharge_newshot");
	return f.dot;
}, true);

// /obj/item/weapon/gun/syringe/proc/examine  (code/modules/projectiles/guns/syringe_gun.dm:34)
rt.def("/obj/item/weapon/gun/syringe/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Can hold ＀ syringe５. Has ＀ syringe５ remaining.", [rt.sv(f, "max_syringes"), rt.len(f, rt.sv(f, "syringes"))])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/syringe/proc/attack_self  (code/modules/projectiles/guns/syringe_gun.dm:38)
rt.def("/obj/item/weapon/gun/syringe/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let S: Value = null;
	f.vars = () => [S];
	if (!truthy(rt.len(f, rt.sv(f, "syringes")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is empty!</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((S = rt.index(rt.sv(f, "syringes"), rt.len(f, rt.sv(f, "syringes")))))) {
		return 0;
	}
	rt.setFv(f, "loc", live(S), rt.fv(f, "loc", live(user)));
	rt.callName(f, rt.sv(f, "syringes"), "Remove", [live(S)]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You unload ＀ from ％！.</span>", [live(S), live(f.src)])]);
	return 1;
});

// /obj/item/weapon/gun/syringe/proc/attackby  (code/modules/projectiles/guns/syringe_gun.dm:53)  may sleep
rt.def("/obj/item/weapon/gun/syringe/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, show_msg: Value) {
	f.vars = () => [A, user, params, show_msg];
	if (live(show_msg) === null) {
		show_msg = 1;
	}
	if (truthy((rt.istype(live(A), T("/obj/item/weapon/reagent_containers/syringe")) ? 1 : 0))) {
		if (rt.lt(rt.len(f, rt.sv(f, "syringes")), rt.sv(f, "max_syringes"))) {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(A), live(f.src)])))) {
				return 0;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You load ＀ into ％！.</span>", [live(A), live(f.src)])]);
			rt.modSrcVar(f, "syringes", live(A), add);
			yield* g.srcCall(f, "recharge_newshot");
			return 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ cannot hold more syringes!</span>", [live(f.src)])]);
		}
	}
	return 0;
}, true);

rt.type(5284, "/obj/item/weapon/gun/syringe/dna", "/obj/item/weapon/gun/syringe", {
	name: "modified syringe gun",
	desc: "A syringe gun that has been modified to fit DNA injectors instead of normal syringes.",
	origin_tech: "combat=2;syndicate=2;biotech=3",
});

// /obj/item/weapon/gun/syringe/dna/proc/Initialize  (code/modules/projectiles/guns/syringe_gun.dm:88)  may sleep
rt.def("/obj/item/weapon/gun/syringe/dna/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "chambered", (yield* g.new_(f, T("/obj/item/ammo_casing/dnainjector"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/weapon/gun/syringe/dna/proc/attackby  (code/modules/projectiles/guns/syringe_gun.dm:92)  may sleep
rt.def("/obj/item/weapon/gun/syringe/dna/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, show_msg: Value) {
	let D: Value = null;
	f.vars = () => [A, user, params, show_msg, D];
	if (live(show_msg) === null) {
		show_msg = 1;
	}
	if (truthy((rt.istype(live(A), T("/obj/item/weapon/dnainjector")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "used", (D = live(A))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This injector is used up!</span>"]);
			return live(f.dot);
		}
		if (rt.lt(rt.len(f, rt.sv(f, "syringes")), rt.sv(f, "max_syringes"))) {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(D), live(f.src)])))) {
				return 0;
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You load ％！ into ％！.</span>", [live(D), live(f.src)])]);
			rt.modSrcVar(f, "syringes", live(D), add);
			yield* g.srcCall(f, "recharge_newshot");
			return 1;
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ cannot hold more syringes!</span>", [live(f.src)])]);
		}
	}
	return 0;
}, true);
