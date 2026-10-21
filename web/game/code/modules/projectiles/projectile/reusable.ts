// From code/modules/projectiles/projectile/reusable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8791, "/obj/item/projectile/bullet/reusable", "/obj/item/projectile/bullet", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless"),
	dropped: 0,
	name: "reusable bullet",
	desc: "How do you even reuse a bullet?",
	impact_effect_type: null,
});

// /obj/item/projectile/bullet/reusable/proc/on_hit  (code/modules/projectiles/projectile/reusable.dm:9)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/proc/on_hit", function* on_hit(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "handle_drop");
	return f.dot;
}, true, { args: ["target", "blocked"] });

// /obj/item/projectile/bullet/reusable/proc/on_range  (code/modules/projectiles/projectile/reusable.dm:13)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/proc/on_range", function* on_range(f: Frame) {
	yield* g.srcCall(f, "handle_drop");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/reusable/proc/handle_drop  (code/modules/projectiles/projectile/reusable.dm:17)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/proc/handle_drop", function* handle_drop(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy(rt.sv(f, "dropped"))) return f.dot;
	yield* g.new_(f, rt.sv(f, "ammo_type"), [(_T = rt.getStep(f, live(f.src), 0))]);
	rt.setSv(f, "dropped", 1);
	return f.dot;
}, true);

rt.type(8796, "/obj/item/projectile/bullet/reusable/foam_dart", "/obj/item/projectile/bullet/reusable", {
	modified: 0,
	pen: null,
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless/foam_dart"),
	name: "foam dart",
	desc: "I hope you're wearing eye protection.",
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	icon: rt.rsc("icons/obj/guns/toy.dmi"),
	icon_state: "foamdart_proj",
	range: 10,
});

// /obj/item/projectile/bullet/reusable/foam_dart/proc/handle_drop  (code/modules/projectiles/projectile/reusable.dm:45)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/foam_dart/proc/handle_drop", function* handle_drop(f: Frame) {
	let _T: Value = null, newcasing: Value = null, newdart: Value = null;
	f.vars = () => [_T, newcasing, newdart];
	if (truthy(rt.sv(f, "dropped"))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	rt.setSv(f, "dropped", 1);
	rt.setFv(f, "modified", (newcasing = (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(_T)]))), rt.sv(f, "modified"));
	rt.setFv(f, "modified", (newdart = rt.fv(f, "BB", live(newcasing))), rt.sv(f, "modified"));
	rt.setFv(f, "damage", live(newdart), rt.sv(f, "damage"));
	rt.setFv(f, "nodamage", live(newdart), rt.sv(f, "nodamage"));
	rt.setFv(f, "damage_type", live(newdart), rt.sv(f, "damage_type"));
	if (truthy(rt.sv(f, "pen"))) {
		rt.setFv(f, "pen", live(newdart), rt.sv(f, "pen"));
		yield* g.callName(f, rt.sv(f, "pen"), "forceMove", [live(newdart)]);
		rt.setSv(f, "pen", null);
	}
	yield* g.callName(f, live(newdart), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/projectile/bullet/reusable/foam_dart/proc/Destroy  (code/modules/projectiles/projectile/reusable.dm:63)  may sleep
rt.def("/obj/item/projectile/bullet/reusable/foam_dart/proc/Destroy", function* Destroy(f: Frame) {
	rt.setSv(f, "pen", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
