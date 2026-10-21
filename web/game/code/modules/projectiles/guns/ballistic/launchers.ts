// From code/modules/projectiles/guns/ballistic/launchers.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5265, "/obj/item/weapon/gun/ballistic/revolver/grenadelauncher", "/obj/item/weapon/gun/ballistic/revolver", {
	desc: "A break-operated grenade launcher.",
	name: "grenade launcher",
	icon_state: "dshotgun-sawn",
	item_state: "gun",
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/grenadelauncher"),
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	w_class: 3,
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// /obj/item/weapon/gun/ballistic/revolver/grenadelauncher/proc/attackby  (code/modules/projectiles/guns/ballistic/launchers.dm:18)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_box")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_casing")) ? 1 : 0)))) return f.dot;
	yield* g.srcCall(f, "chamber_round");
	return f.dot;
}, true, { args: ["A", "user", "params"] });

rt.type(5239, "/obj/item/weapon/gun/ballistic/automatic/gyropistol", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "gyrojet pistol",
	desc: "A prototype pistol designed to fire self propelled rockets.",
	icon_state: "gyropistol",
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	origin_tech: "combat=5",
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m75"),
});

// /obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/<init>  (code/modules/projectiles/guns/ballistic/launchers.dm:42)
rt.def("/obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/update_icon  (code/modules/projectiles/guns/ballistic/launchers.dm:46)
rt.def("/obj/item/weapon/gun/ballistic/automatic/gyropistol/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "magazine"))) {
		$1 = "loaded";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	return f.dot;
});

rt.type(5240, "/obj/item/weapon/gun/ballistic/automatic/speargun", "/obj/item/weapon/gun/ballistic/automatic", {
	select: 0,
	name: "kinetic speargun",
	desc: "A weapon favored by carp hunters. Fires specialized spears using kinetic energy.",
	icon_state: "speargun",
	item_state: "speargun",
	w_class: 4,
	origin_tech: "combat=4;engineering=4",
	force: 10,
	can_suppress: 0,
	fire_sound: rt.rsc("sound/weapons/grenadelaunch.ogg"),
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/speargun"),
});

// /obj/item/weapon/gun/ballistic/automatic/speargun/proc/<init>  (code/modules/projectiles/guns/ballistic/launchers.dm:63)
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/speargun/proc/attackby  (code/modules/projectiles/guns/ballistic/launchers.dm:73)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/speargun/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let num_loaded: Value = null;
	f.vars = () => [A, user, params, num_loaded];
	if (!truthy((num_loaded = (yield* g.callName(f, rt.sv(f, "magazine"), "attackby", [live(A), live(user), live(params), 1]))))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You load ＀ spear５ into ％！.</span>", [live(num_loaded), live(f.src)])]);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "chamber_round");
	return f.dot;
}, true);

rt.type(5241, "/obj/item/weapon/gun/ballistic/automatic/atlauncher", "/obj/item/weapon/gun/ballistic/automatic", {
	select: 0,
	desc: "A pre-loaded, single shot anti-armour launcher.",
	name: "anti-armour grenade launcher",
	icon_state: "rocketlauncher",
	item_state: "rocketlauncher",
	fire_sound: rt.rsc("sound/weapons/rocketlaunch.ogg"),
	w_class: 4,
	can_suppress: 0,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	casing_ejector: 0,
	weapon_weight: 3,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/rocketlauncher"),
});

// /obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/<init>  (code/modules/projectiles/guns/ballistic/launchers.dm:91)
rt.def("/obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/update_icon  (code/modules/projectiles/guns/ballistic/launchers.dm:99)
rt.def("/obj/item/weapon/gun/ballistic/automatic/atlauncher/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "magazine"))) {
		$0 = fmt("-＀", [rt.callSrc(f, "get_ammo", [1])]);
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("rocketlauncher＀", [$0]));
	return f.dot;
});
