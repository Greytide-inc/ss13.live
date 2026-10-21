// From code/modules/projectiles/boxes_magazines/internal_mag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9936, "/obj/item/ammo_box/magazine/internal", "/obj/item/ammo_box/magazine", {
	desc: "Oh god, this shouldn't be here",
});

// /obj/item/ammo_box/magazine/internal/proc/give_round  (code/modules/projectiles/boxes_magazines/internal_mag.dm:8)  may sleep
rt.def("/obj/item/ammo_box/magazine/internal/proc/give_round", function* give_round(f: Frame, R: Value) {
	f.vars = () => [R];
	return (yield* g.callSuper(f, [live(R), 1]));
}, true);

rt.type(9937, "/obj/item/ammo_box/magazine/internal/cylinder", "/obj/item/ammo_box/magazine/internal", {
	name: "revolver cylinder",
	ammo_type: rt.typePath("/obj/item/ammo_casing/a357"),
	caliber: "357",
	max_ammo: 7,
});

// /obj/item/ammo_box/magazine/internal/cylinder/proc/ammo_count  (code/modules/projectiles/boxes_magazines/internal_mag.dm:21)
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/ammo_count", function ammo_count(f: Frame, countempties: Value) {
	let boolets: Value = null, bullet: Value = null;
	let $e: any;
	f.vars = () => [countempties, boolets, bullet, $e];
	if (live(countempties) === null) {
		countempties = 1;
	}
	boolets = 0;
	bullet = null;
	rt.forList(f, 0, rt.sv(f, "stored_ammo"), T("/obj/item/ammo_casing"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bullet = $e;
		if ((truthy(live(bullet)) && (truthy(rt.fv(f, "BB", live(bullet))) || truthy(live(countempties))))) {
			boolets = rt.inc(live(boolets), 1);
		}
	}
	rt.endFor(f, 0);
	return live(boolets);
});

// /obj/item/ammo_box/magazine/internal/cylinder/proc/get_round  (code/modules/projectiles/boxes_magazines/internal_mag.dm:28)
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/get_round", function get_round(f: Frame, keep: Value) {
	let b: Value = null;
	f.vars = () => [keep, b];
	if (live(keep) === null) {
		keep = 0;
	}
	rt.callSrc(f, "rotate", []);
	b = rt.index(rt.sv(f, "stored_ammo"), 1);
	if (!truthy(live(keep))) {
		rt.setAt(rt.sv(f, "stored_ammo"), 1, null);
	}
	return live(b);
});

// /obj/item/ammo_box/magazine/internal/cylinder/proc/rotate  (code/modules/projectiles/boxes_magazines/internal_mag.dm:37)
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/rotate", function rotate(f: Frame) {
	let b: Value = null;
	f.vars = () => [b];
	b = rt.index(rt.sv(f, "stored_ammo"), 1);
	rt.callName(f, rt.sv(f, "stored_ammo"), "Cut", [1, 2]);
	rt.callName(f, rt.sv(f, "stored_ammo"), "Insert", [0, live(b)]);
	return f.dot;
});

// /obj/item/ammo_box/magazine/internal/cylinder/proc/spin  (code/modules/projectiles/boxes_magazines/internal_mag.dm:42)
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/spin", function spin(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.call(f, P("/proc/rand"), null, [0, multiply(rt.sv(f, "max_ammo"), 2)]), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		rt.callSrc(f, "rotate", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/ammo_box/magazine/internal/cylinder/proc/give_round  (code/modules/projectiles/boxes_magazines/internal_mag.dm:47)
rt.def("/obj/item/ammo_box/magazine/internal/cylinder/proc/give_round", function give_round(f: Frame, R: Value, replace_spent: Value) {
	let i: Value = null, bullet: Value = null;
	let $e: any;
	f.vars = () => [replace_spent, i, bullet, $e];
	if (live(replace_spent) === null) {
		replace_spent = 0;
	}
	if (((!truthy(live(R)) || (truthy(rt.sv(f, "caliber")) && !isEqual(rt.fv(f, "caliber", live(R)), rt.sv(f, "caliber")))) || (!truthy(rt.sv(f, "caliber")) && !isEqual(rt.fv(f, "type", live(R)), rt.sv(f, "ammo_type"))))) {
		return 0;
	}
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "stored_ammo")), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if ((!truthy((bullet = rt.index(rt.sv(f, "stored_ammo"), live(i)))) || !truthy(rt.fv(f, "BB", live(bullet))))) {
			rt.setAt(rt.sv(f, "stored_ammo"), live(i), live(R));
			rt.setFv(f, "loc", live(R), live(f.src));
			if (truthy(live(bullet))) {
				rt.setFv(f, "loc", live(bullet), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
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

// /obj/item/ammo_box/magazine/internal/shot/proc/ammo_count  (code/modules/projectiles/boxes_magazines/internal_mag.dm:89)
rt.def("/obj/item/ammo_box/magazine/internal/shot/proc/ammo_count", function ammo_count(f: Frame) {
	let boolets: Value = null, bullet: Value = null;
	let $e: any;
	f.vars = () => [boolets, bullet, $e];
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (!truthy(live(f.args[0]))) {
		boolets = 0;
		bullet = null;
		rt.forList(f, 0, rt.sv(f, "stored_ammo"), T("/obj/item/ammo_casing"));
		while (($e = rt.next(f, 0)) !== undefined) {
			bullet = $e;
			if (truthy(rt.fv(f, "BB", live(bullet)))) {
				boolets = rt.inc(live(boolets), 1);
			}
		}
		rt.endFor(f, 0);
		return live(boolets);
	} else {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, false, { args: ["countempties"] });

rt.type(9955, "/obj/item/ammo_box/magazine/internal/rus357", "/obj/item/ammo_box/magazine/internal", {});

// /obj/item/ammo_box/magazine/internal/rus357/proc/New  (code/modules/projectiles/boxes_magazines/internal_mag.dm:160)  may sleep
rt.def("/obj/item/ammo_box/magazine/internal/rus357/proc/New", function* New(f: Frame) {
	rt.modSrcVar(f, "stored_ammo", (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(f.src)])), add);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);
