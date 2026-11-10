// Based on /tg/station's code/game/objects/items/devices/doorCharge.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9229, "/obj/item/device/doorCharge", "/obj/item/device", {
	throw_range: 4,
	throw_speed: 1,
	flags: 4,
	name: "airlock charge",
	desc: null,
	item_state: "electronic",
	icon_state: "doorCharge",
	w_class: 2,
	force: 3,
	attack_verb: null,
	materials: null,
	origin_tech: "syndicate=1;combat=3;engineering=3",
});

// doorCharge.dm:12
rt.def("/obj/item/device/doorCharge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("blown up", "exploded", "detonated");
	this.materials = rt.alist(f, ["$metal", 50, "$glass", 30]);
	return f.dot;
});

// doorCharge.dm:16
rt.def("/obj/item/device/doorCharge/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	if (severity === 1) {
		this.visible_message(`<span class='warning'>${this} detonates!</span>`);
		yield* explosion(this.loc, 0, 2, 1, { flame_range: 4 });
		yield* qdel(this);
	} else if (severity === 2) {
		if (prob(50)) {
			yield* this.ex_act(1);
		}
	} else if (severity === 3) {
		if (!prob(25)) return f.dot;
		yield* this.ex_act(1);
	}
	return f.dot;
}, true, { waitfor: false });

// doorCharge.dm:29
rt.def("/obj/item/device/doorCharge/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null;
	if (rt.istype(this.loc, T("/obj/machinery/door/airlock"))) {
		if ((A = this.loc).charge == this) {
			A.charge = null;
		}
	}
	return (yield* parent_proc());
}, true);

// doorCharge.dm:36
rt.def("/obj/item/device/doorCharge/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (rt.isIn(f, user.mind, GLOB.SSticker.mode.traitors)) {
		to_chat(user, "A small explosive device that can be used to sabotage airlocks to cause an explosion upon opening. To apply, remove the airlock's maintenance panel and place it within.");
	} else {
		to_chat(user, "A small, suspicious object that feels lukewarm when held.");
	}
	return f.dot;
}, false);
