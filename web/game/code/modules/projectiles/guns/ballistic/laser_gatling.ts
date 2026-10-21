// From code/modules/projectiles/guns/ballistic/laser_gatling.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7645, "/obj/item/weapon/minigunpack", "/obj/item/weapon", {
	gun: null,
	armed: 0,
	overheat: 0,
	overheat_max: 40,
	heat_diffusion: 1,
	name: "backpack power source",
	desc: "The massive external power source for the laser gatling gun",
	icon: rt.rsc("icons/obj/guns/minigun.dmi"),
	icon_state: "holstered",
	item_state: "backpack",
	slot_flags: 1024,
	w_class: 5,
});

// /obj/item/weapon/minigunpack/proc/Initialize  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:19)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "gun", (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/minigun"), [live(f.src)])));
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/minigunpack/proc/Destroy  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:24)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/minigunpack/proc/process  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:28)
rt.def("/obj/item/weapon/minigunpack/proc/process", function process(f: Frame) {
	rt.setSv(f, "overheat", rt.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "overheat"), rt.sv(f, "heat_diffusion"))]));
	return f.dot;
}, false, { waitfor: false });

// /obj/item/weapon/minigunpack/proc/attack_hand  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:31)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/attack_hand", function* attack_hand(f: Frame) {
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(f.args[0]))) {
		if (!truthy(rt.sv(f, "armed"))) {
			if (isEqual((yield* g.callName(f, live(f.args[0]), "get_item_by_slot", [1])), live(f.src))) {
				rt.setSv(f, "armed", 1);
				if (!truthy((yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "gun")])))) {
					rt.setSv(f, "armed", 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You need a free hand to hold the gun!</span>"]);
					return live(f.dot);
				}
				yield* g.srcCall(f, "update_icon");
				yield* g.callName(f, rt.sv(f, "gun"), "forceMove", [live(f.args[0])]);
				yield* g.callName(f, live(f.args[0]), "update_inv_back", []);
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You are already holding the gun!</span>"]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/minigunpack/proc/attackby  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:48)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/attackby", function* attackby(f: Frame) {
	if (isEqual(live(f.args[0]), rt.sv(f, "gun"))) {
		yield* g.callName(f, live(f.args[1]), "dropItemToGround", [rt.sv(f, "gun"), 1]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/minigunpack/proc/dropped  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:55)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "armed"))) return f.dot;
	yield* g.callName(f, live(user), "dropItemToGround", [rt.sv(f, "gun"), 1]);
	return f.dot;
}, true);

// /obj/item/weapon/minigunpack/proc/MouseDrop  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:60)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	f.vars = () => [over_object, M, H];
	if (truthy(rt.sv(f, "armed"))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	M = live(f.usr);
	if (!truthy(live(over_object))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, live(M), "incapacitated", [])))) return f.dot;
	if (!truthy((rt.istype(live(over_object), T("/obj/screen/inventory/hand")) ? 1 : 0))) return f.dot;
	H = live(over_object);
	yield* g.callName(f, live(M), "putItemFromInventoryInHandIfPossible", [live(f.src), rt.fv(f, "held_index", live(H))]);
	return f.dot;
}, true);

// /obj/item/weapon/minigunpack/proc/update_icon  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:75)
rt.def("/obj/item/weapon/minigunpack/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "armed"))) {
		rt.setSv(f, "icon_state", "notholstered");
	} else {
		rt.setSv(f, "icon_state", "holstered");
	}
	return f.dot;
});

// /obj/item/weapon/minigunpack/proc/attach_gun  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:80)  may sleep
rt.def("/obj/item/weapon/minigunpack/proc/attach_gun", function* attach_gun(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "gun"))) {
		rt.setSv(f, "gun", (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/minigun"), [live(f.src)])));
	}
	yield* g.callName(f, rt.sv(f, "gun"), "forceMove", [live(f.src)]);
	rt.setSv(f, "armed", 0);
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You attach the ＀ to the ＀.</span>", [rt.fv(f, "name", rt.sv(f, "gun")), rt.sv(f, "name")])]);
	} else {
		yield* g.callName(f, live(f.src), "visible_message", [fmt("<span class='warning'>The ＀ snaps back onto the ＀!</span>", [rt.fv(f, "name", rt.sv(f, "gun")), rt.sv(f, "name")])]);
	}
	yield* g.srcCall(f, "update_icon");
	yield* g.callName(f, live(user), "update_inv_back", []);
	return f.dot;
}, true);

rt.type(5263, "/obj/item/weapon/gun/ballistic/minigun", "/obj/item/weapon/gun/ballistic", {
	ammo_pack: null,
	flags: 64,
	automatic: 0,
	casing_ejector: 0,
	name: "laser gatling gun",
	desc: "An advanced laser cannon with an incredible rate of fire. Requires a bulky backpack power source to use.",
	icon: rt.rsc("icons/obj/guns/minigun.dmi"),
	icon_state: "minigun_spin",
	item_state: "minigun",
	origin_tech: "combat=6;powerstorage=5;magnets=4",
	slowdown: 1,
	slot_flags: null,
	w_class: 5,
	materials: null,
	burst_size: 3,
	fire_delay: 1,
	weapon_weight: 3,
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/minigun"),
});

// /obj/item/weapon/gun/ballistic/minigun/proc/<init>  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:103)
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/minigun/proc/Initialize  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:114)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/Initialize", function* Initialize(f: Frame) {
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "slows_while_in_hand", 1);
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/minigunpack")) ? 1 : 0))) {
		rt.setSv(f, "ammo_pack", rt.sv(f, "loc"));
	} else {
		return 2;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/ballistic/minigun/proc/dropped  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:128)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "ammo_pack"))) {
		yield* g.callName(f, rt.sv(f, "ammo_pack"), "attach_gun", [live(user)]);
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/minigun/proc/process_fire  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:134)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/process_fire", function* process_fire(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 1;
	}
	if (!truthy(rt.sv(f, "ammo_pack"))) return f.dot;
	if (rt.lt(rt.fv(f, "overheat", rt.sv(f, "ammo_pack")), rt.fv(f, "overheat_max", rt.sv(f, "ammo_pack")))) {
		rt.modField(f, rt.sv(f, "ammo_pack"), "overheat", rt.sv(f, "burst_size"), add);
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "The gun's heat sensor locked the trigger to prevent lens damage."]);
	}
	return f.dot;
}, true, { args: ["target", "user", "message", "params", "zone_override"] });

// /obj/item/weapon/gun/ballistic/minigun/proc/afterattack  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:141)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/afterattack", function* afterattack(f: Frame) {
	if ((!truthy(rt.sv(f, "ammo_pack")) || !isEqual(rt.fv(f, "loc", rt.sv(f, "ammo_pack")), live(f.args[1])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You need the backpack power source to fire the gun!"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "flag", "params"] });

// /obj/item/weapon/gun/ballistic/minigun/proc/dropped  (code/modules/projectiles/guns/ballistic/laser_gatling.dm:146)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/minigun/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.sv(f, "ammo_pack"), "attach_gun", [live(user)]);
	return f.dot;
}, true);
