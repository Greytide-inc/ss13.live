// From code/modules/projectiles/guns/ballistic/toy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5244, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol", "/obj/item/weapon/gun/ballistic/automatic/toy", {
	name: "foam force pistol",
	desc: "A small, easily concealable toy handgun. Ages 8 and up.",
	icon_state: "pistol",
	w_class: 2,
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/pistol"),
});

// /obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/<init>  (code/modules/projectiles/guns/ballistic/toy.dm:29)
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/update_icon  (code/modules/projectiles/guns/ballistic/toy.dm:32)
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/proc/update_icon", function update_icon(f: Frame) {
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
	return f.dot;
});

rt.type(5245, "/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot", "/obj/item/weapon/gun/ballistic/automatic/toy/pistol", {
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/toy/pistol/riot"),
});

// /obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot/proc/Initialize  (code/modules/projectiles/guns/ballistic/toy.dm:39)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/toy/pistol/riot/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "magazine", (yield* g.new_(f, T("/obj/item/ammo_box/magazine/toy/pistol/riot"), [live(f.src)])));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

rt.type(5259, "/obj/item/weapon/gun/ballistic/shotgun/toy", "/obj/item/weapon/gun/ballistic/shotgun", {
	name: "foam force shotgun",
	desc: "A toy shotgun with wood furniture and a four-shell capacity underneath. Ages 8 and up.",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	force: 0,
	throwforce: 0,
	origin_tech: null,
	clumsy_check: 0,
	needs_permit: 0,
	casing_ejector: 0,
	can_suppress: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/internal/shot/toy"),
});

// /obj/item/weapon/gun/ballistic/shotgun/toy/proc/process_chamber  (code/modules/projectiles/guns/ballistic/toy.dm:62)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/shotgun/toy/proc/process_chamber", function* process_chamber(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.sv(f, "chambered")) && !truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "chambered")]);
	return f.dot;
}, true, { args: ["empty_chamber"] });
