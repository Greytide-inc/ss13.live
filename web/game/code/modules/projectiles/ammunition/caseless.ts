// From code/modules/projectiles/ammunition/caseless.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8669, "/obj/item/ammo_casing/caseless", "/obj/item/ammo_casing", {
	desc: "A caseless bullet casing.",
	firing_effect_type: null,
});

// /obj/item/ammo_casing/caseless/proc/fire_casing  (code/modules/projectiles/ammunition/caseless.dm:9)  may sleep
rt.def("/obj/item/ammo_casing/caseless/proc/fire_casing", function* fire_casing(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.setSv(f, "loc", null);
		return 1;
	} else {
		return 0;
	}
	return f.dot;
}, true, { args: ["target", "user", "params", "distro", "quiet", "zone_override", "spread"] });

// /obj/item/ammo_casing/caseless/proc/update_icon  (code/modules/projectiles/ammunition/caseless.dm:16)
rt.def("/obj/item/ammo_casing/caseless/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀", [rt.initial(f, live(f.src), "icon_state")]));
	return f.dot;
});

rt.type(8680, "/obj/item/ammo_casing/caseless/foam_dart", "/obj/item/ammo_casing/caseless", {
	modified: 0,
	name: "foam dart",
	desc: "It's nerf or nothing! Ages 8 and up.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/reusable/foam_dart"),
	caliber: "foam_force",
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	icon_state: "foamdart",
});

// /obj/item/ammo_casing/caseless/foam_dart/proc/update_icon  (code/modules/projectiles/ammunition/caseless.dm:66)
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "modified"))) {
		rt.setSv(f, "icon_state", "foamdart_empty");
		rt.setSv(f, "desc", "It's nerf or nothing! ... Although, this one doesn't look too safe.");
		if (truthy(rt.sv(f, "BB"))) {
			rt.setFv(f, "icon_state", rt.sv(f, "BB"), "foamdart_empty");
		}
	} else {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
		rt.setSv(f, "desc", "It's nerf or nothing! Ages 8 and up.");
		if (!truthy(rt.sv(f, "BB"))) return f.dot;
		rt.setFv(f, "icon_state", rt.sv(f, "BB"), rt.initial(f, rt.sv(f, "BB"), "icon_state"));
	}
	return f.dot;
});

// /obj/item/ammo_casing/caseless/foam_dart/proc/attackby  (code/modules/projectiles/ammunition/caseless.dm:80)  may sleep
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/attackby", function* attackby(f: Frame) {
	let FD: Value = null;
	f.vars = () => [FD];
	FD = rt.sv(f, "BB");
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && !truthy(rt.sv(f, "modified")))) {
		rt.setSv(f, "modified", 1);
		rt.setFv(f, "modified", live(FD), 1);
		rt.setFv(f, "damage_type", live(FD), "brute");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You pop the safety cap off ＀.</span>", [live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "modified"))) {
				if (!truthy(rt.fv(f, "pen", live(FD)))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(FD)])))) {
						return live(f.dot);
					}
					rt.setFv(f, "pen", live(FD), live(f.args[0]));
					rt.setFv(f, "damage", live(FD), 5);
					rt.setFv(f, "nodamage", live(FD), 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There's already something in ＀.</span>", [live(f.src)])]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The safety cap prevents you from inserting ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/ammo_casing/caseless/foam_dart/proc/attack_self  (code/modules/projectiles/ammunition/caseless.dm:104)  may sleep
rt.def("/obj/item/ammo_casing/caseless/foam_dart/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let FD: Value = null;
	f.vars = () => [user, FD];
	if (!truthy(rt.gv(f, "pen", (FD = rt.sv(f, "BB"))))) return f.dot;
	rt.setFv(f, "damage", live(FD), rt.initial(f, live(FD), "damage"));
	rt.setFv(f, "nodamage", live(FD), rt.initial(f, live(FD), "nodamage"));
	yield* g.callName(f, live(user), "put_in_hands", [rt.fv(f, "pen", live(FD))]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.fv(f, "pen", live(FD)), live(f.src)])]);
	rt.setFv(f, "pen", live(FD), null);
	return f.dot;
}, true);
