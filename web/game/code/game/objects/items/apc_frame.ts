// Based on /tg/station's code/game/objects/items/apc_frame.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9539, "/obj/item/wallframe", "/obj/item", {
	result_path: null,
	inverse: 0,
	pixel_shift: null,
	flags: 64,
	icon: rt.rsc("icons/obj/wallframe.dmi"),
	materials: null,
	origin_tech: "materials=1;engineering=1",
	item_state: "syringe_kit",
	w_class: 2,
});

// apc_frame.dm:3
rt.def("/obj/item/wallframe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 4000]);
	return f.dot;
});

// apc_frame.dm:13
rt.def("/obj/item/wallframe/proc/try_build", function try_build(f: Frame, on_wall: Value, user: Value) {
	let ndir: Value = null;
	if (get_dist(on_wall, user) > 1) {
		return f.dot;
	}
	if (!rt.isIn(f, (ndir = rt.getDir(f, on_wall, user)), GLOB.cardinal)) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, user, 0);
	let A: Value = get_area(_T);
	if (!rt.istype(_T, T("/turf/open/floor"))) {
		to_chat(user, `<span class='warning'>You cannot place ${this} on this spot!</span>`);
		return f.dot;
	}
	if (A.always_unpowered) {
		to_chat(user, `<span class='warning'>You cannot place ${this} in this area!</span>`);
		return f.dot;
	}
	if (gotwallitem(_T, ndir, this.inverse * 2)) {
		to_chat(user, "<span class='warning'>There's already an item on this wall!</span>");
		return f.dot;
	}
	return 1;
});

// apc_frame.dm:34
rt.def("/obj/item/wallframe/proc/attach", function* attach(f: Frame, on_wall: Value, user: Value) {
	let ndir: Value = null, O: Value = null;
	if (this.result_path) {
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 75, 1);
		user.visible_message(`${user.name} attaches ${this} to the wall.`, `<span class='notice'>You attach ${this} to the wall.</span>`, "<span class='italics'>You hear clicking.</span>");
		ndir = rt.getDir(f, on_wall, user);
		if (this.inverse) {
			ndir = turn(ndir, 180);
		}
		O = (yield* new_(this.result_path, rt.getStep(f, user, 0), ndir, 1));
		if (this.pixel_shift) {
			if (ndir === 1) {
				O.pixel_y = this.pixel_shift;
			} else if (ndir === 2) {
				O.pixel_y = -this.pixel_shift;
			} else if (ndir === 4) {
				O.pixel_x = this.pixel_shift;
			} else if (ndir === 8) {
				O.pixel_x = -this.pixel_shift;
			}
		}
		yield* this.after_attach(O);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// apc_frame.dm:58
rt.def("/obj/item/wallframe/proc/after_attach", function after_attach(f: Frame, O: Value) {
	this.transfer_fingerprints_to(O);
	return f.dot;
});

// apc_frame.dm:61
rt.def("/obj/item/wallframe/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null;
	yield* parent_proc();
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (rt.istype((_T = rt.getStep(f, rt.getStep(f, user, 0), user.dir)), T("/turf/closed/wall"))) {
			yield* _T.attackby(this, user, params);
		}
	}
	let metal_amt: Value = round(rt.at(this.materials, "$metal") / MINERAL_MATERIAL_AMOUNT);
	let glass_amt: Value = round(rt.at(this.materials, "$glass") / MINERAL_MATERIAL_AMOUNT);
	if (!(rt.istype(W, T("/obj/item/weapon/wrench")) && (metal_amt || glass_amt))) return f.dot;
	to_chat(user, `<span class='notice'>You dismantle ${this}.</span>`);
	if (metal_amt) {
		yield* new_(T("/obj/item/stack/sheet/metal"), rt.getStep(f, this, 0), metal_amt);
	}
	if (glass_amt) {
		yield* new_(T("/obj/item/stack/sheet/glass"), rt.getStep(f, this, 0), glass_amt);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9546, "/obj/item/wallframe/apc", "/obj/item/wallframe", {
	inverse: 1,
	name: "１APC frame",
	desc: "Used for repairing or building APCs",
	icon_state: "apc",
	result_path: rt.typePath("/obj/machinery/power/apc"),
});

// apc_frame.dm:91
rt.def("/obj/item/wallframe/apc/proc/try_build", function* try_build(f: Frame, on_wall: Value, user: Value) {
	let A: Value = null, E: Value = null, C: Value = null;
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, user, 0);
	if ((A = get_area(_T)).get_apc()) {
		to_chat(user, "<span class='warning'>This area already has an APC!</span>");
		return f.dot;
	}
	if (!A.requires_power) {
		to_chat(user, `<span class='warning'>You cannot place ${this} in this area!</span>`);
		return f.dot;
	}
	for (E of each(_T, T("/obj/machinery/power/terminal"))) {
		if (E.master) {
			to_chat(user, "<span class='warning'>There is another network terminal here!</span>");
			return f.dot;
		} else {
			(C = (yield* new_(T("/obj/item/stack/cable_coil"), _T))).amount = 10;
			to_chat(user, "<span class='notice'>You cut the cables and disassemble the unused power terminal.</span>");
			yield* qdel(E);
		}
	}
	return 1;
}, true);

rt.type(6933, "/obj/item/weapon/electronics", "/obj/item/weapon", {
	flags: 64,
	desc: "Looks like a circuit. Probably is.",
	icon: rt.rsc("icons/obj/module.dmi"),
	icon_state: "door_electronics",
	item_state: "electronic",
	w_class: 2,
	origin_tech: "engineering=2;programming=1",
	materials: null,
});

// apc_frame.dm:121
rt.def("/obj/item/weapon/electronics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 50, "$glass", 50]);
	return f.dot;
});
