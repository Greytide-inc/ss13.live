// From code/modules/projectiles/guns/ballistic/bow.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5262, "/obj/item/weapon/gun/ballistic/bow", "/obj/item/weapon/gun/ballistic", {
	icon_state_loaded: "bow_loaded",
	icon_state_firing: "bow_firing",
	item_state_loaded: "bow",
	item_state_firing: "bow",
	draw_sound: rt.rsc("sound/weapons/draw_bow.ogg"),
	ready_to_fire: 0,
	slowdown_when_ready: 2,
	name: "bow",
	desc: "A sturdy bow made out of wood and reinforced with iron.",
	icon_state: "bow_unloaded",
	item_state: "bow",
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/bow"),
	weapon_weight: 3,
});

// /obj/item/weapon/gun/ballistic/bow/proc/Initialize  (code/modules/projectiles/guns/ballistic/bow.dm:18)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "slows_while_in_hand", 1);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/gun/ballistic/bow/proc/update_icon  (code/modules/projectiles/guns/ballistic/bow.dm:23)
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "ready_to_fire"))) {
		rt.setSv(f, "icon_state", rt.sv(f, "icon_state_firing"));
		rt.setSv(f, "item_state", rt.sv(f, "item_state_firing"));
		rt.setSv(f, "slowdown", rt.sv(f, "slowdown_when_ready"));
	} else {
		if ((truthy(rt.callName(f, rt.sv(f, "magazine"), "ammo_count", [])) && !truthy(rt.sv(f, "ready_to_fire")))) {
			rt.setSv(f, "icon_state", rt.sv(f, "icon_state_loaded"));
			rt.setSv(f, "item_state", rt.sv(f, "item_state_loaded"));
			rt.setSv(f, "slowdown", rt.initial(f, live(f.src), "slowdown"));
		} else {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
			rt.setSv(f, "item_state", rt.initial(f, live(f.src), "item_state"));
			rt.setSv(f, "slowdown", rt.initial(f, live(f.src), "slowdown"));
		}
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/bow/proc/dropped  (code/modules/projectiles/guns/ballistic/bow.dm:36)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/dropped", function* dropped(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!(truthy(rt.sv(f, "magazine")) && truthy((yield* g.callName(f, rt.sv(f, "magazine"), "ammo_count", []))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "magazine"), "empty_magazine", []);
	rt.setSv(f, "ready_to_fire", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/bow/proc/attack_self  (code/modules/projectiles/guns/ballistic/bow.dm:42)
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if ((!truthy(rt.sv(f, "ready_to_fire")) && truthy(rt.callName(f, rt.sv(f, "magazine"), "ammo_count", [])))) {
		rt.setSv(f, "ready_to_fire", 1);
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "draw_sound"), 100, 1]);
		rt.callSrc(f, "update_icon", []);
	} else {
		rt.setSv(f, "ready_to_fire", 0);
		rt.callSrc(f, "update_icon", []);
	}
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/bow/proc/attackby  (code/modules/projectiles/guns/ballistic/bow.dm:51)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	f.vars = () => [A, user, params, num_loaded];
	if (!truthy((num_loaded = (yield* g.callName(f, rt.sv(f, "magazine"), "attackby", [live(A), live(user), live(params), 1]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You ready ％！ into ％！.</span>", [live(A), live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "chamber_round");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/bow/proc/can_shoot  (code/modules/projectiles/guns/ballistic/bow.dm:58)
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/can_shoot", function can_shoot(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "ready_to_fire"))) return f.dot;
	return 0;
});

// /obj/item/weapon/gun/ballistic/bow/proc/process_chamber  (code/modules/projectiles/guns/ballistic/bow.dm:66)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/bow/proc/process_chamber", function* process_chamber(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (live(f.args[1]) === null) {
		f.args[1] = 1;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "ready_to_fire", 0);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["eject_casing", "empty_chamber"] });

rt.type(5504, "/obj/item/weapon/storage/backpack/quiver", "/obj/item/weapon/storage/backpack", {
	name: "quiver",
	desc: "A quiver for holding arrows.",
	icon_state: "quiver",
	item_state: "quiver",
	storage_slots: 20,
	can_hold: null,
});

// /obj/item/weapon/storage/backpack/quiver/proc/<init>  (code/modules/projectiles/guns/ballistic/bow.dm:102)
rt.def("/obj/item/weapon/storage/backpack/quiver/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/ammo_casing/caseless/arrow")));
	return f.dot;
});

rt.type(5505, "/obj/item/weapon/storage/backpack/quiver/full", "/obj/item/weapon/storage/backpack/quiver", {});

// /obj/item/weapon/storage/backpack/quiver/full/proc/New  (code/modules/projectiles/guns/ballistic/bow.dm:107)  may sleep
rt.def("/obj/item/weapon/storage/backpack/quiver/full/proc/New", function* New(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "storage_slots"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, T("/obj/item/ammo_casing/caseless/arrow"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
