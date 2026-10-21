// From code/modules/projectiles/box_magazine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9884, "/obj/item/ammo_box", "/obj/item", {
	stored_ammo: null,
	ammo_type: rt.typePath("/obj/item/ammo_casing"),
	max_ammo: 7,
	multiple_sprites: 0,
	caliber: null,
	multiload: 1,
	start_empty: 0,
	flags: 64,
	slot_flags: 512,
	item_state: "syringe_kit",
	materials: null,
	w_class: 1,
	throw_speed: 3,
	throw_range: 7,
	name: "ammo box (null_reference_exception)",
	desc: "A box of ammo.",
	icon_state: "357",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	throwforce: 2,
});

// /obj/item/ammo_box/proc/<init>  (code/modules/projectiles/box_magazine.dm:10)
rt.def("/obj/item/ammo_box/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 30000]));
	$0 = $0;
	rt.setSv(f, "stored_ammo", rt.list());
	return f.dot;
});

// /obj/item/ammo_box/proc/New  (code/modules/projectiles/box_magazine.dm:24)  may sleep
rt.def("/obj/item/ammo_box/proc/New", function* New(f: Frame) {
	let i: Value = null;
	f.vars = () => [i];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "start_empty"))) {
		i = null;
		i = 1;
		while (rt.le(live(i), rt.sv(f, "max_ammo"))) {
			rt.modSrcVar(f, "stored_ammo", (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(f.src)])), add);
			i = rt.inc(live(i), 1);
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/ammo_box/proc/get_round  (code/modules/projectiles/box_magazine.dm:31)
rt.def("/obj/item/ammo_box/proc/get_round", function get_round(f: Frame, keep: Value) {
	let b: Value = null;
	f.vars = () => [keep, b];
	if (live(keep) === null) {
		keep = 0;
	}
	if (!truthy(rt.len(f, rt.sv(f, "stored_ammo")))) {
		return null;
	}
	(rt.modSrcVar(f, "stored_ammo", (b = rt.index(rt.sv(f, "stored_ammo"), rt.len(f, rt.sv(f, "stored_ammo")))), subtract));
	if (truthy(live(keep))) {
		rt.callName(f, rt.sv(f, "stored_ammo"), "Insert", [1, live(b)]);
	}
	return live(b);
});

// /obj/item/ammo_box/proc/give_round  (code/modules/projectiles/box_magazine.dm:42)  may sleep
rt.def("/obj/item/ammo_box/proc/give_round", function* give_round(f: Frame, R: Value, replace_spent: Value) {
	let AC: Value = null;
	let $e: any;
	f.vars = () => [R, replace_spent, AC, $e];
	if (live(replace_spent) === null) {
		replace_spent = 0;
	}
	if (((!truthy(live(R)) || (truthy(rt.sv(f, "caliber")) && !isEqual(rt.fv(f, "caliber", live(R)), rt.sv(f, "caliber")))) || (!truthy(rt.sv(f, "caliber")) && !isEqual(rt.fv(f, "type", live(R)), rt.sv(f, "ammo_type"))))) {
		return 0;
	}
	if (rt.lt(rt.len(f, rt.sv(f, "stored_ammo")), rt.sv(f, "max_ammo"))) {
		rt.modSrcVar(f, "stored_ammo", live(R), add);
		yield* g.callName(f, live(R), "forceMove", [live(f.src)]);
		return 1;
	} else {
		if (truthy(live(replace_spent))) {
			AC = null;
			rt.forList(f, 0, rt.sv(f, "stored_ammo"), T("/obj/item/ammo_casing"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AC = $e;
				if (!truthy(rt.fv(f, "BB", live(AC)))) {
					(rt.modSrcVar(f, "stored_ammo", live(AC), subtract));
					yield* g.callName(f, live(AC), "forceMove", [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]);
					rt.modSrcVar(f, "stored_ammo", live(R), add);
					yield* g.callName(f, live(R), "forceMove", [live(f.src)]);
					return 1;
				}
			}
			rt.endFor(f, 0);
		}
	}
	return 0;
}, true);

// /obj/item/ammo_box/proc/attackby  (code/modules/projectiles/box_magazine.dm:68)  may sleep
rt.def("/obj/item/ammo_box/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value, silent: Value, replace_spent: Value) {
	let num_loaded: Value = null, AM: Value = null, AC: Value = null, did_load: Value = null, AC_1: Value = null;
	let $e: any;
	f.vars = () => [A, user, params, silent, replace_spent, num_loaded, AM, AC, did_load, AC_1, $e];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(replace_spent) === null) {
		replace_spent = 0;
	}
	num_loaded = 0;
	if (!truthy((yield* g.srcCall(f, "can_load", live(user))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(A), T("/obj/item/ammo_box")) ? 1 : 0))) {
		AM = live(A);
		AC = null;
		rt.forList(f, 0, rt.fv(f, "stored_ammo", live(AM)), T("/obj/item/ammo_casing"));
		while (($e = rt.next(f, 0)) !== undefined) {
			AC = $e;
			if (truthy((did_load = (yield* g.srcCall(f, "give_round", live(AC), live(replace_spent)))))) {
				(rt.modField(f, live(AM), "stored_ammo", live(AC), subtract));
				num_loaded = rt.inc(live(num_loaded), 1);
			}
			if ((!truthy(live(did_load)) || !truthy(rt.sv(f, "multiload")))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy((rt.istype(live(A), T("/obj/item/ammo_casing")) ? 1 : 0))) {
		if (truthy((yield* g.srcCall(f, "give_round", (AC_1 = live(A)), live(replace_spent))))) {
			yield* g.callName(f, live(user), "drop_item", []);
			yield* g.callName(f, live(AC_1), "forceMove", [live(f.src)]);
			num_loaded = rt.inc(live(num_loaded), 1);
		}
	}
	if (truthy(live(num_loaded))) {
		if (!truthy(live(silent))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You load ＀ shell５ into ％！!</span>", [live(num_loaded), live(f.src)])]);
			yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/bulletinsert.ogg"), 60, 1]);
		}
		yield* g.callName(f, live(A), "update_icon", []);
		yield* g.srcCall(f, "update_icon");
	}
	return live(num_loaded);
}, true);

// /obj/item/ammo_box/proc/attack_self  (code/modules/projectiles/box_magazine.dm:96)  may sleep
rt.def("/obj/item/ammo_box/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let A: Value = null;
	f.vars = () => [user, A];
	if (!truthy((A = (yield* g.srcCall(f, "get_round"))))) return f.dot;
	yield* g.callName(f, live(user), "put_in_hands", [live(A)]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You remove a round from ％！!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/bulletremove.ogg"), 60, 1]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/ammo_box/proc/update_icon  (code/modules/projectiles/box_magazine.dm:104)
rt.def("/obj/item/ammo_box/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.sv(f, "multiple_sprites");
	if ($0 === 1) {
		rt.setSv(f, "icon_state", fmt("＀-＀", [rt.initial(f, live(f.src), "icon_state"), rt.len(f, rt.sv(f, "stored_ammo"))]));
	} else if ($0 === 2) {
		$0 = rt.initial(f, live(f.src), "icon_state");
		if (truthy(rt.len(f, rt.sv(f, "stored_ammo")))) {
			$1 = fmt("＀", [rt.sv(f, "max_ammo")]);
		} else {
			$1 = "0";
		}
		rt.setSv(f, "icon_state", fmt("＀-＀", [$0, $1]));
	}
	rt.setSv(f, "desc", fmt("＀ There are ＀ shell５ left!", [rt.initial(f, live(f.src), "desc"), rt.len(f, rt.sv(f, "stored_ammo"))]));
	return f.dot;
});

rt.type(9885, "/obj/item/ammo_box/magazine", "/obj/item/ammo_box", {});

// /obj/item/ammo_box/magazine/proc/ammo_count  (code/modules/projectiles/box_magazine.dm:113)
rt.def("/obj/item/ammo_box/magazine/proc/ammo_count", function ammo_count(f: Frame) {
	return rt.len(f, rt.sv(f, "stored_ammo"));
});

// /obj/item/ammo_box/magazine/proc/empty_magazine  (code/modules/projectiles/box_magazine.dm:116)  may sleep
rt.def("/obj/item/ammo_box/magazine/proc/empty_magazine", function* empty_magazine(f: Frame) {
	let turf_mag: Value = null, ammo: Value = null;
	let $e: any;
	f.vars = () => [turf_mag, ammo, $e];
	turf_mag = rt.getStep(f, live(f.src), 0);
	ammo = null;
	rt.forList(f, 0, rt.sv(f, "stored_ammo"), T("/obj/item"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ammo = $e;
		yield* g.callName(f, live(ammo), "forceMove", [live(turf_mag)]);
		(rt.modSrcVar(f, "stored_ammo", live(ammo), subtract));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
