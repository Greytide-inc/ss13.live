// From code/modules/projectiles/guns/ballistic/pistol.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5203, "/obj/item/weapon/gun/ballistic/automatic/pistol", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "stechkin pistol",
	desc: "A small, easily concealable 10mm handgun. Has a threaded barrel for suppressors.",
	icon_state: "pistol",
	w_class: 2,
	origin_tech: "combat=3;materials=2;syndicate=4",
	can_suppress: 1,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/proc/<init>  (code/modules/projectiles/guns/ballistic/pistol.dm:11)
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/proc/update_icon  (code/modules/projectiles/guns/ballistic/pistol.dm:14)
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "chambered"))) {
		$1 = "";
	} else {
		$1 = "-e";
	}
	if (truthy(rt.sv(f, "suppressed"))) {
		$2 = "-suppressed";
	} else {
		$2 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀＀", [$0, $1, $2]));
	return live(f.dot);
});

rt.type(5204, "/obj/item/weapon/gun/ballistic/automatic/pistol/deagle", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "desert eagle",
	desc: "A robust .50 AE handgun.",
	icon_state: "deagle",
	force: 14,
	can_suppress: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m50"),
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/deagle/proc/update_icon  (code/modules/projectiles/guns/ballistic/pistol.dm:35)
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "magazine"))) {
		rt.callSrc(f, "cut_overlays", []);
		rt.callSrc(f, "add_overlay", ["deagle_magazine"]);
	} else {
		rt.callSrc(f, "cut_overlays", []);
	}
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "chambered"))) {
		$1 = "";
	} else {
		$1 = "-e";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	return f.dot;
});

rt.type(5209, "/obj/item/weapon/gun/ballistic/automatic/pistol/APS", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "stechkin APS pistol",
	desc: "The original russian version of a widely used Syndicate sidearm. Uses 9mm ammo.",
	icon_state: "aps",
	w_class: 3,
	origin_tech: "combat=3;materials=2;syndicate=3",
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 2,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/pistolm9mm"),
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/APS/proc/<init>  (code/modules/projectiles/guns/ballistic/pistol.dm:63)
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/APS/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_firemode")));
	return f.dot;
});

rt.type(5210, "/obj/item/weapon/gun/ballistic/automatic/pistol/stickman", "/obj/item/weapon/gun/ballistic/automatic/pistol", {
	name: "flat gun",
	desc: "A 2 dimensional gun.. what?",
	icon_state: "flatgun",
	origin_tech: "combat=3;materials=2;abductor=3",
});

// /obj/item/weapon/gun/ballistic/automatic/pistol/stickman/proc/pickup  (code/modules/projectiles/guns/ballistic/pistol.dm:72)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/pistol/stickman/proc/pickup", function* pickup(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>As you try to pick up ＀, it slips out of your grip..</span>", [live(f.src)])]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>..and vanishes from your vision! Where the hell did it go?</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		yield* g.callName(f, live(user), "update_icons", []);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>..and falls into view. Whew, that was a close one.</span>"]);
		yield* g.callName(f, live(user), "dropItemToGround", [live(f.src)]);
	}
	return f.dot;
}, true);
