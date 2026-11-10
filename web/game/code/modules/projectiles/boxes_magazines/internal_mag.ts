// Based on /tg/station's code/modules/projectiles/boxes_magazines/internal_mag.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9936, "/obj/item/ammo_box/magazine/internal", "/obj/item/ammo_box/magazine", {
	desc: "Oh god, this shouldn't be here",
});

// internal_mag.dm:8
rt.def("/obj/item/ammo_box/magazine/internal/proc/give_round", function* give_round(f: Frame, R: Value) {
	return (yield* parent_proc(R, 1));
}, true);

rt.type(9937, "/obj/item/ammo_box/magazine/internal/cylinder", "/obj/item/ammo_box/magazine/internal", {
	name: "revolver cylinder",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a357"),
	caliber: "357",
	max_ammo: 7,
});

// internal_mag.dm:21
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/ammo_count", function ammo_count(f: Frame, countempties: Value) {
	let bullet: Value = null;
	countempties ??= 1;
	let boolets: Value = 0;
	for (bullet of each(this.stored_ammo, T("/obj/item/ammo_casing"))) {
		if (bullet && (bullet.BB || countempties)) {
			boolets++;
		}
	}
	return boolets;
});

// internal_mag.dm:28
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/get_round", function get_round(f: Frame, keep: Value) {
	keep ??= 0;
	this.rotate();
	let b: Value = rt.index(this.stored_ammo, 1);
	if (!keep) {
		rt.setAt(this.stored_ammo, 1, null);
	}
	return b;
});

// internal_mag.dm:37
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/rotate", function rotate(f: Frame) {
	let b: Value = rt.index(this.stored_ammo, 1);
	this.stored_ammo.Cut(1, 2);
	this.stored_ammo.Insert(0, b);
	return f.dot;
});

// internal_mag.dm:42
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/spin", function spin(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, rand(0, this.max_ammo * 2), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		this.rotate();
	}
	rt.endFor(f, 0);
	return f.dot;
});

// internal_mag.dm:47
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/give_round", function give_round(f: Frame, R: Value, replace_spent: Value) {
	let i: Value = null, bullet: Value = null;
	let $e: any;
	replace_spent ??= 0;
	if (!R || this.caliber && R.caliber != this.caliber || !this.caliber && R.type != this.ammo_type) {
		return 0;
	}
	rt.forRange(f, 0, 1, rt.len(f, this.stored_ammo), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(bullet = rt.index(this.stored_ammo, i)) || !bullet.BB) {
			rt.setAt(this.stored_ammo, i, R);
			R.loc = this;
			if (bullet) {
				bullet.loc = rt.getStep(f, this.loc, 0);
			}
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});

rt.type(9942, "/obj/item/ammo_box/magazine/internal/shot", "/obj/item/ammo_box/magazine/internal", {
	name: "shotgun internal magazine",
	ammo_type: rt.typePath("/obj/item/ammo_casing/shotgun/beanbag"),
	caliber: "shotgun",
	max_ammo: 4,
	multiload: 0,
});

// internal_mag.dm:89
rt.def("/obj/item/ammo_box/magazine/internal/shot/proc/ammo_count", function ammo_count(f: Frame) {
	let boolets: Value = null, bullet: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!f.args[0]) {
		boolets = 0;
		for (bullet of each(this.stored_ammo, T("/obj/item/ammo_casing"))) {
			if (bullet.BB) {
				boolets++;
			}
		}
		return boolets;
	} else {
		return parent_proc();
	}
}, false, { args: ["countempties"] });

rt.type(9955, "/obj/item/ammo_box/magazine/internal/rus357", "/obj/item/ammo_box/magazine/internal", {});

// internal_mag.dm:160
rt.def("/obj/item/ammo_box/magazine/internal/rus357/proc/New", function* New(f: Frame) {
	this.stored_ammo += (yield* new_(this.ammo_type, this));
	yield* parent_proc();
	return f.dot;
}, true);
