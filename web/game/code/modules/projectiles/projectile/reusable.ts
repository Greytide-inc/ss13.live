// Based on /tg/station's code/modules/projectiles/projectile/reusable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(8791, "/obj/item/projectile/bullet/reusable", "/obj/item/projectile/bullet", {
	ammo_type: rt.typePath("/obj/item/ammo_casing/caseless"),
	dropped: 0,
	name: "reusable bullet",
	desc: "How do you even reuse a bullet?",
	impact_effect_type: null,
});

// reusable.dm:9
rt.def("/obj/item/projectile/bullet/reusable/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	yield* this.handle_drop();
	return f.dot;
}, true, { args: ["target", "blocked"] });

// reusable.dm:13
rt.def("/obj/item/projectile/bullet/reusable/proc/on_range", function* on_range(f: Frame) {
	yield* this.handle_drop();
	yield* parent_proc();
	return f.dot;
}, true);

// reusable.dm:17
rt.def("/obj/item/projectile/bullet/reusable/proc/handle_drop", function* handle_drop(f: Frame) {
	let _T: Value = null;
	if (this.dropped) return f.dot;
	yield* new_(this.ammo_type, (_T = rt.getStep(f, this, 0)));
	this.dropped = 1;
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

// reusable.dm:45
rt.def("/obj/item/projectile/bullet/reusable/foam_dart/proc/handle_drop", function* handle_drop(f: Frame) {
	let newcasing: Value = null, newdart: Value = null;
	if (this.dropped) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	this.dropped = 1;
	(newcasing = (yield* new_(this.ammo_type, _T))).modified = this.modified;
	(newdart = newcasing.BB).modified = this.modified;
	newdart.damage = this.damage;
	newdart.nodamage = this.nodamage;
	newdart.damage_type = this.damage_type;
	if (this.pen) {
		newdart.pen = this.pen;
		yield* this.pen.forceMove(newdart);
		this.pen = null;
	}
	yield* newdart.update_icon();
	return f.dot;
}, true);

// reusable.dm:63
rt.def("/obj/item/projectile/bullet/reusable/foam_dart/proc/Destroy", function* Destroy(f: Frame) {
	this.pen = null;
	return (yield* parent_proc());
}, true);
