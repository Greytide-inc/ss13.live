// From code/modules/projectiles/guns/energy/special.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5183, "/obj/item/weapon/gun/energy/ionrifle", "/obj/item/weapon/gun/energy", {
	flags: 64,
	name: "ion rifle",
	desc: "A man-portable anti-armor weapon designed to disable mechanical threats at range.",
	icon_state: "ionrifle",
	item_state: null,
	origin_tech: "combat=4;magnets=4",
	can_flashlight: 1,
	w_class: 5,
	slot_flags: 1024,
	ammo_type: null,
	ammo_x_offset: 3,
	flight_x_offset: 17,
	flight_y_offset: 9,
});

// /obj/item/weapon/gun/energy/ionrifle/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:11)
rt.def("/obj/item/weapon/gun/energy/ionrifle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/ion")));
	return f.dot;
});

rt.type(5185, "/obj/item/weapon/gun/energy/decloner", "/obj/item/weapon/gun/energy", {
	name: "biological demolecularisor",
	desc: "A gun that discharges high amounts of controlled radiation to slowly break a target into component elements.",
	icon_state: "decloner",
	origin_tech: "combat=4;materials=4;biotech=5;plasmatech=6",
	ammo_type: null,
	ammo_x_offset: 1,
	pin: null,
});

// /obj/item/weapon/gun/energy/decloner/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:35)
rt.def("/obj/item/weapon/gun/energy/decloner/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/declone")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/decloner/proc/update_icon  (code/modules/projectiles/guns/energy/special.dm:40)
rt.def("/obj/item/weapon/gun/energy/decloner/proc/update_icon", function update_icon(f: Frame) {
	let shot: Value = null;
	f.vars = () => [shot];
	rt.callSuper(f, [], rt.Args.Same);
	shot = rt.index(rt.sv(f, "ammo_type"), rt.sv(f, "select"));
	if (!rt.gt(rt.fv(f, "charge", rt.sv(f, "cell")), rt.fv(f, "e_cost", live(shot)))) return f.dot;
	rt.callSrc(f, "add_overlay", ["decloner_spin"]);
	return f.dot;
});

rt.type(5186, "/obj/item/weapon/gun/energy/floragun", "/obj/item/weapon/gun/energy", {
	modifystate: 1,
	selfcharge: 1,
	name: "floral somatoray",
	desc: "A tool that discharges controlled radiation which induces mutation in plant cells.",
	icon_state: "flora",
	item_state: "gun",
	ammo_type: null,
	origin_tech: "materials=2;biotech=4",
	ammo_x_offset: 1,
});

// /obj/item/weapon/gun/energy/floragun/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:50)
rt.def("/obj/item/weapon/gun/energy/floragun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/flora/yield"), T("/obj/item/ammo_casing/energy/flora/mut")));
	return f.dot;
});

rt.type(5187, "/obj/item/weapon/gun/energy/meteorgun", "/obj/item/weapon/gun/energy", {
	selfcharge: 1,
	name: "meteor gun",
	desc: "For the love of god, make sure you're aiming this the right way!",
	icon_state: "meteor_gun",
	item_state: "c20r",
	w_class: 4,
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/potato",
	clumsy_check: 0,
});

// /obj/item/weapon/gun/energy/meteorgun/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:62)
rt.def("/obj/item/weapon/gun/energy/meteorgun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/meteor")));
	return f.dot;
});

rt.type(5189, "/obj/item/weapon/gun/energy/mindflayer", "/obj/item/weapon/gun/energy", {
	name: "１Mind Flayer",
	desc: "A prototype weapon recovered from the ruins of Research-Station Epsilon.",
	icon_state: "xray",
	item_state: null,
	ammo_type: null,
	ammo_x_offset: 2,
});

// /obj/item/weapon/gun/energy/mindflayer/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:82)
rt.def("/obj/item/weapon/gun/energy/mindflayer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/mindflayer")));
	return f.dot;
});

rt.type(5169, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", "/obj/item/weapon/gun/energy/kinetic_accelerator", {
	overheat_time: 20,
	holds_charge: 1,
	unique_frequency: 1,
	max_mod_capacity: 0,
	empty_state: null,
	name: "mini energy crossbow",
	desc: "A weapon favored by syndicate stealth specialists.",
	icon_state: "crossbow",
	item_state: "crossbow",
	w_class: 2,
	materials: null,
	origin_tech: "combat=4;magnets=4;syndicate=5",
	suppressed: 1,
	ammo_type: null,
	weapon_weight: 1,
	unique_rename: 0,
	can_flashlight: 0,
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:91)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 2000]));
	$0 = $0;
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/bolt")));
	return f.dot;
});

rt.type(5170, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/halloween", "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", {
	name: "candy corn crossbow",
	desc: "A weapon favored by Syndicate trick-or-treaters.",
	icon_state: "crossbow_halloween",
	item_state: "crossbow",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/halloween/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:109)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/halloween/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/bolt/halloween")));
	return f.dot;
});

rt.type(5171, "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large", "/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow", {
	name: "energy crossbow",
	desc: "A reverse engineered weapon using syndicate technology.",
	icon_state: "crossbowlarge",
	w_class: 3,
	materials: null,
	origin_tech: "combat=4;magnets=4;syndicate=2",
	suppressed: 0,
	ammo_type: null,
	pin: null,
});

// /obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:116)
rt.def("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 4000]));
	$0 = $0;
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/bolt/large")));
	return f.dot;
});

rt.type(5190, "/obj/item/weapon/gun/energy/plasmacutter", "/obj/item/weapon/gun/energy", {
	flags: 64,
	container_type: 4096,
	can_charge: 0,
	name: "plasma cutter",
	desc: "A mining tool capable of expelling concentrated plasma bursts. You could use it to cut limbs off xenos! Or, you know, mine stuff.",
	icon_state: "plasmacutter",
	item_state: "plasmacutter",
	origin_tech: "combat=1;materials=3;magnets=2;plasmatech=3;engineering=1",
	ammo_type: null,
	attack_verb: null,
	force: 12,
	sharpness: 1,
	heat: 3800,
	toolspeed: 0.7,
});

// /obj/item/weapon/gun/energy/plasmacutter/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:128)
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/plasma")));
	rt.setSv(f, "attack_verb", rt.list("attacked", "slashed", "cut", "sliced"));
	return f.dot;
});

// /obj/item/weapon/gun/energy/plasmacutter/proc/examine  (code/modules/projectiles/guns/energy/special.dm:139)
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "cell"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ is ＀% charged.</span>", [live(f.src), rt.call(f, P("/proc/round"), null, [rt.callName(f, rt.sv(f, "cell"), "percent", [])])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/energy/plasmacutter/proc/attackby  (code/modules/projectiles/guns/energy/special.dm:144)  may sleep
rt.def("/obj/item/weapon/gun/energy/plasmacutter/proc/attackby", function* attackby(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/mineral/plasma")) ? 1 : 0))) {
		yield* g.callName(f, (S = live(f.args[0])), "use", [1]);
		yield* g.callName(f, rt.sv(f, "cell"), "give", [1000]);
		yield* g.srcCall(f, "recharge_newshot", 1);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ in ＀, recharging it.</span>", [live(f.args[0]), live(f.src)])]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/ore/plasma")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
			yield* g.callName(f, rt.sv(f, "cell"), "give", [500]);
			yield* g.srcCall(f, "recharge_newshot", 1);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ in ＀, recharging it.</span>", [live(f.args[0]), live(f.src)])]);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	}
	return f.dot;
}, true, { args: ["A", "user"] });

rt.type(5191, "/obj/item/weapon/gun/energy/plasmacutter/adv", "/obj/item/weapon/gun/energy/plasmacutter", {
	name: "advanced plasma cutter",
	icon_state: "adv_plasmacutter",
	origin_tech: "combat=3;materials=4;magnets=3;plasmatech=4;engineering=2",
	force: 15,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/plasmacutter/adv/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:166)
rt.def("/obj/item/weapon/gun/energy/plasmacutter/adv/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/plasma/adv")));
	return f.dot;
});

rt.type(5192, "/obj/item/weapon/gun/energy/wormhole_projector", "/obj/item/weapon/gun/energy", {
	p_blue: null,
	p_orange: null,
	name: "bluespace wormhole projector",
	desc: "A projector that emits high density quantum-coupled bluespace beams.",
	ammo_type: null,
	item_state: null,
	icon_state: "wormhole_projector",
	origin_tech: "combat=4;bluespace=6;plasmatech=4;engineering=4",
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:171)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/wormhole"), T("/obj/item/ammo_casing/energy/wormhole/orange")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/update_icon  (code/modules/projectiles/guns/energy/special.dm:179)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.sv(f, "select")]));
	rt.setSv(f, "item_state", rt.sv(f, "icon_state"));
	return live(f.dot);
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/process_chamber  (code/modules/projectiles/guns/energy/special.dm:184)  may sleep
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/process_chamber", function* process_chamber(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "select_fire");
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/wormhole_projector/proc/on_portal_destroy  (code/modules/projectiles/guns/energy/special.dm:188)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/on_portal_destroy", function on_portal_destroy(f: Frame, _P: Value) {
	if (isEqual(live(_P), rt.sv(f, "p_blue"))) {
		rt.setSv(f, "p_blue", null);
	} else {
		if (!isEqual(live(_P), rt.sv(f, "p_orange"))) return f.dot;
		rt.setSv(f, "p_orange", null);
	}
	return f.dot;
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/has_blue_portal  (code/modules/projectiles/guns/energy/special.dm:194)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/has_blue_portal", function has_blue_portal(f: Frame) {
	if ((truthy((rt.istype(rt.sv(f, "p_blue"), T("/obj/effect/portal")) ? 1 : 0)) && !(!truthy(rt.sv(f, "p_blue")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "p_blue")))))) {
		return 1;
	}
	return 0;
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/has_orange_portal  (code/modules/projectiles/guns/energy/special.dm:199)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/has_orange_portal", function has_orange_portal(f: Frame) {
	if ((truthy((rt.istype(rt.sv(f, "p_orange"), T("/obj/effect/portal")) ? 1 : 0)) && !(!truthy(rt.sv(f, "p_orange")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "p_orange")))))) {
		return 1;
	}
	return 0;
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/crosslink  (code/modules/projectiles/guns/energy/special.dm:204)
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/crosslink", function crosslink(f: Frame) {
	if ((!truthy(rt.callSrc(f, "has_blue_portal", [])) && !truthy(rt.callSrc(f, "has_orange_portal", [])))) {
		return live(f.dot);
	}
	if ((!truthy(rt.callSrc(f, "has_blue_portal", [])) && truthy(rt.callSrc(f, "has_orange_portal", [])))) {
		rt.callName(f, rt.sv(f, "p_orange"), "link_portal", [null]);
		return live(f.dot);
	}
	if ((!truthy(rt.callSrc(f, "has_orange_portal", [])) && truthy(rt.callSrc(f, "has_blue_portal", [])))) {
		rt.callName(f, rt.sv(f, "p_blue"), "link_portal", [null]);
		return live(f.dot);
	}
	rt.callName(f, rt.sv(f, "p_orange"), "link_portal", [rt.sv(f, "p_blue")]);
	rt.callName(f, rt.sv(f, "p_blue"), "link_portal", [rt.sv(f, "p_orange")]);
	return f.dot;
});

// /obj/item/weapon/gun/energy/wormhole_projector/proc/create_portal  (code/modules/projectiles/guns/energy/special.dm:216)  may sleep
rt.def("/obj/item/weapon/gun/energy/wormhole_projector/proc/create_portal", function* create_portal(f: Frame, W: Value, target: Value) {
	let _P: Value = null;
	f.vars = () => [W, target, _P];
	_P = (yield* g.new_(f, T("/obj/effect/portal"), [live(target), live(f.src), 300, null, 0, null]));
	if (truthy((rt.istype(live(W), T("/obj/item/projectile/beam/wormhole/orange")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "p_orange")]);
		rt.setSv(f, "p_orange", live(_P));
		rt.setFv(f, "icon_state", live(_P), "portal1");
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "p_blue")]);
		rt.setSv(f, "p_blue", live(_P));
	}
	yield* g.srcCall(f, "crosslink");
	return f.dot;
}, true);

rt.type(5193, "/obj/item/weapon/gun/energy/printer", "/obj/item/weapon/gun/energy", {
	can_charge: 0,
	use_cyborg_cell: 1,
	name: "cyborg lmg",
	desc: "A machinegun that fires 3d-printed flechettes slowly regenerated using a cyborg's internal power source.",
	icon_state: "l6closed0",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	cell_type: "/obj/item/weapon/stock_parts/cell/secborg",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/printer/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:234)
rt.def("/obj/item/weapon/gun/energy/printer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/c3dbullet")));
	return f.dot;
});

rt.type(5194, "/obj/item/weapon/gun/energy/temperature", "/obj/item/weapon/gun/energy", {
	name: "temperature gun",
	icon_state: "freezegun",
	desc: "A gun that changes temperatures.",
	origin_tech: "combat=4;materials=4;powerstorage=3;magnets=2",
	ammo_type: null,
	cell_type: "/obj/item/weapon/stock_parts/cell/high",
	pin: null,
});

// /obj/item/weapon/gun/energy/temperature/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:249)
rt.def("/obj/item/weapon/gun/energy/temperature/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/temp"), T("/obj/item/ammo_casing/energy/temp/hot")));
	return f.dot;
});

rt.type(5148, "/obj/item/weapon/gun/energy/laser/instakill", "/obj/item/weapon/gun/energy/laser", {
	name: "instakill rifle",
	icon_state: "instagib",
	item_state: "instagib",
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit.",
	force: 60,
	origin_tech: "combat=7;magnets=6",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/instakill/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:264)
rt.def("/obj/item/weapon/gun/energy/laser/instakill/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/instakill")));
	return f.dot;
});

rt.type(5149, "/obj/item/weapon/gun/energy/laser/instakill/red", "/obj/item/weapon/gun/energy/laser/instakill", {
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit. This one has a red design.",
	icon_state: "instagibred",
	item_state: "instagibred",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/instakill/red/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:272)
rt.def("/obj/item/weapon/gun/energy/laser/instakill/red/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/instakill/red")));
	return f.dot;
});

rt.type(5150, "/obj/item/weapon/gun/energy/laser/instakill/blue", "/obj/item/weapon/gun/energy/laser/instakill", {
	desc: "A specialized ASMD laser-rifle, capable of flat-out disintegrating most targets in a single hit. This one has a blue design.",
	icon_state: "instagibblue",
	item_state: "instagibblue",
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/laser/instakill/blue/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:278)
rt.def("/obj/item/weapon/gun/energy/laser/instakill/blue/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/instakill/blue")));
	return f.dot;
});

rt.type(5196, "/obj/item/weapon/gun/energy/gravity_gun", "/obj/item/weapon/gun/energy", {
	power: 4,
	name: "one-point bluespace-gravitational manipulator",
	desc: "An experimental, multi-mode device that fires bolts of Zero-Point Energy, causing local distortions in gravity.",
	ammo_type: null,
	origin_tech: "combat=4;magnets=4;materials=6;powerstorage=4;bluespace=4",
	item_state: null,
	icon_state: "gravity_gun",
});

// /obj/item/weapon/gun/energy/gravity_gun/proc/<init>  (code/modules/projectiles/guns/energy/special.dm:286)
rt.def("/obj/item/weapon/gun/energy/gravity_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/gravityrepulse"), T("/obj/item/ammo_casing/energy/gravityattract"), T("/obj/item/ammo_casing/energy/gravitychaos")));
	return f.dot;
});
