// From code/modules/projectiles/guns/energy/energy_gun.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5151, "/obj/item/weapon/gun/energy/e_gun", "/obj/item/weapon/gun/energy", {
	name: "energy gun",
	desc: "A basic hybrid energy gun with two settings: disable and kill.",
	icon_state: "energy",
	item_state: null,
	origin_tech: "combat=4;magnets=3",
	modifystate: 1,
	can_flashlight: 1,
	ammo_x_offset: 3,
	flight_x_offset: 15,
	flight_y_offset: 10,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:6)
rt.def("/obj/item/weapon/gun/energy/e_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5156, "/obj/item/weapon/gun/energy/e_gun/mini", "/obj/item/weapon/gun/energy/e_gun", {
	name: "miniature energy gun",
	desc: "A small, pistol-sized energy gun with a built-in flashlight. It has two settings: stun and kill.",
	icon_state: "mini",
	item_state: "gun",
	w_class: 2,
	ammo_x_offset: 2,
	charge_sections: 3,
	can_flashlight: 0,
	cell_type: rt.typePath("/obj/item/weapon/stock_parts/cell"),
});

// /obj/item/weapon/gun/energy/e_gun/mini/proc/Initialize  (code/modules/projectiles/guns/energy/energy_gun.dm:26)  may sleep
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "gun_light", (yield* g.new_(f, T("/obj/item/device/flashlight/seclite"), [live(f.src)])));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/energy/e_gun/mini/proc/update_icon  (code/modules/projectiles/guns/energy/energy_gun.dm:30)
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "gun_light")) && truthy(rt.fv(f, "on", rt.sv(f, "gun_light"))))) return f.dot;
	rt.callSrc(f, "add_overlay", ["mini-light"]);
	return f.dot;
});

rt.type(5158, "/obj/item/weapon/gun/energy/e_gun/stun", "/obj/item/weapon/gun/energy/e_gun", {
	name: "tactical energy gun",
	desc: "Military issue energy gun, is able to fire stun rounds.",
	icon_state: "energytac",
	ammo_x_offset: 2,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/stun/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:39)
rt.def("/obj/item/weapon/gun/energy/e_gun/stun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode/spec"), T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5159, "/obj/item/weapon/gun/energy/e_gun/old", "/obj/item/weapon/gun/energy/e_gun", {
	name: "prototype energy gun",
	desc: "NT-P:01 Prototype Energy Gun. Early stage development of a unique laser rifle that has multifaceted energy lens allowing the gun to alter the form of projectile it fires on command.",
	icon_state: "protolaser",
	ammo_x_offset: 2,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/old/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:46)
rt.def("/obj/item/weapon/gun/energy/e_gun/old/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/laser"), T("/obj/item/ammo_casing/energy/electrode/old")));
	return f.dot;
});

rt.type(5157, "/obj/item/weapon/gun/energy/e_gun/mini/practice_phaser", "/obj/item/weapon/gun/energy/e_gun/mini", {
	name: "practice phaser",
	desc: "A modified version of the basic phaser gun, this one fires less concentrated energy bolts designed for target practice.",
	icon_state: "decloner",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/mini/practice_phaser/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:51)
rt.def("/obj/item/weapon/gun/energy/e_gun/mini/practice_phaser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/disabler"), T("/obj/item/ammo_casing/energy/laser/practice")));
	return f.dot;
});

rt.type(5160, "/obj/item/weapon/gun/energy/e_gun/hos", "/obj/item/weapon/gun/energy/e_gun", {
	name: "１X-01 MultiPhase Energy Gun",
	desc: "This is an expensive, modern recreation of an antique laser gun. This gun has several unique firemodes, but lacks the ability to recharge over time.",
	icon_state: "hoslaser",
	origin_tech: null,
	force: 10,
	ammo_x_offset: 4,
	resistance_flags: 99,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/hos/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:60)
rt.def("/obj/item/weapon/gun/energy/e_gun/hos/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode/hos"), T("/obj/item/ammo_casing/energy/laser/hos"), T("/obj/item/ammo_casing/energy/disabler")));
	return f.dot;
});

rt.type(5161, "/obj/item/weapon/gun/energy/e_gun/dragnet", "/obj/item/weapon/gun/energy/e_gun", {
	name: "１DRAGnet",
	desc: "The \"Dynamic Rapid-Apprehension of the Guilty\" net is a revolution in law enforcement technology.",
	icon_state: "dragnet",
	origin_tech: "combat=4;magnets=3;bluespace=4",
	can_flashlight: 0,
	ammo_x_offset: 1,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/dragnet/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:69)
rt.def("/obj/item/weapon/gun/energy/e_gun/dragnet/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/net"), T("/obj/item/ammo_casing/energy/trap")));
	return f.dot;
});

rt.type(5162, "/obj/item/weapon/gun/energy/e_gun/dragnet/snare", "/obj/item/weapon/gun/energy/e_gun/dragnet", {
	name: "Energy Snare Launcher",
	desc: "Fires an energy snare that slows the target down",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/dragnet/snare/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:76)
rt.def("/obj/item/weapon/gun/energy/e_gun/dragnet/snare/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/trap")));
	return f.dot;
});

rt.type(5152, "/obj/item/weapon/gun/energy/e_gun/turret", "/obj/item/weapon/gun/energy/e_gun", {
	name: "hybrid turret gun",
	desc: "A heavy hybrid energy cannon with two settings: Stun and kill.",
	icon_state: "turretlaser",
	item_state: "turretlaser",
	slot_flags: null,
	w_class: 5,
	weapon_weight: 3,
	can_flashlight: 0,
	trigger_guard: 0,
	ammo_x_offset: 2,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/turret/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:85)
rt.def("/obj/item/weapon/gun/energy/e_gun/turret/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser")));
	return f.dot;
});

rt.type(5163, "/obj/item/weapon/gun/energy/e_gun/nuclear", "/obj/item/weapon/gun/energy/e_gun", {
	fail_tick: 0,
	fail_chance: 0,
	name: "advanced energy gun",
	desc: "An energy gun with an experimental miniaturized nuclear reactor that automatically charges the internal power cell.",
	icon_state: "nucgun",
	item_state: "nucgun",
	origin_tech: "combat=4;magnets=4;powerstorage=4",
	charge_delay: 5,
	can_charge: 0,
	ammo_x_offset: 1,
	selfcharge: 1,
	pin: null,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/<init>  (code/modules/projectiles/guns/energy/energy_gun.dm:101)
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/electrode"), T("/obj/item/ammo_casing/energy/laser"), T("/obj/item/ammo_casing/energy/disabler")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/process  (code/modules/projectiles/guns/energy/energy_gun.dm:107)
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/process", function process(f: Frame) {
	if (rt.gt(rt.sv(f, "fail_tick"), 0)) {
		rt.incSrcVar(f, "fail_tick", -1, true);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { waitfor: false });

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/shoot_live_shot  (code/modules/projectiles/guns/energy/energy_gun.dm:112)  may sleep
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/shoot_live_shot", function* shoot_live_shot(f: Frame) {
	yield* g.srcCall(f, "failcheck");
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/failcheck  (code/modules/projectiles/guns/energy/energy_gun.dm:117)  may sleep
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/failcheck", function* failcheck(f: Frame) {
	let M: Value = null;
	let $0: any;
	f.vars = () => [M, $0];
	if (!(truthy(rt.op(f, "Prob", [], [rt.sv(f, "fail_chance")])) && truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0)))) return f.dot;
	M = rt.sv(f, "loc");
	$0 = rt.sv(f, "fail_tick");
	if (rt.inRange($0, 0, 200)) {
		rt.modSrcVar(f, "fail_tick", multiply(2, rt.sv(f, "fail_chance")), add);
		yield* g.callName(f, live(M), "rad_act", [40]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>Your ＀ feels warmer.</span>", [rt.sv(f, "name")])]);
	} else if (rt.inRange($0, 201, 9.999999848243207e+30)) {
		yield* g.callName(f, rt.fv(f, "processing", rt.gl("SSobj")), "Remove", [live(f.src)]);
		yield* g.callName(f, live(M), "rad_act", [80]);
		rt.setSv(f, "crit_fail", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<span class='userdanger'>Your ＀'s reactor overloads!</span>", [rt.sv(f, "name")])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/emp_act  (code/modules/projectiles/guns/energy/energy_gun.dm:131)  may sleep
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/emp_act", function* emp_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "fail_chance", (yield* g.call(f, P("/proc/min"), null, [add(rt.sv(f, "fail_chance"), (yield* g.call(f, P("/proc/round"), null, [divide(15, live(f.args[0]))]))), 100])));
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/weapon/gun/energy/e_gun/nuclear/proc/update_icon  (code/modules/projectiles/guns/energy/energy_gun.dm:135)
rt.def("/obj/item/weapon/gun/energy/e_gun/nuclear/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "crit_fail"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_fail_3", [rt.sv(f, "icon_state")])]);
	} else {
		$0 = rt.sv(f, "fail_tick");
		if ($0 === 0) {
			rt.callSrc(f, "add_overlay", [fmt("＀_fail_0", [rt.sv(f, "icon_state")])]);
		} else if (rt.inRange($0, 1, 150)) {
			rt.callSrc(f, "add_overlay", [fmt("＀_fail_1", [rt.sv(f, "icon_state")])]);
		} else if (rt.inRange($0, 151, 9.999999848243207e+30)) {
			rt.callSrc(f, "add_overlay", [fmt("＀_fail_2", [rt.sv(f, "icon_state")])]);
		}
	}
	return f.dot;
});
