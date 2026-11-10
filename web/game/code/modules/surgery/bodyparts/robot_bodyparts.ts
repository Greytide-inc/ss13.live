// Based on /tg/station's code/modules/surgery/bodyparts/robot_bodyparts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10171, "/obj/item/bodypart/chest/robot", "/obj/item/bodypart/chest", {
	wired: 0,
	cell: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg torso",
	desc: "A heavily reinforced case containing cyborg logic boards, with space for a standard power cell.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_chest",
});

// robot_bodyparts.dm:59
rt.def("/obj/item/bodypart/chest/robot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let coil: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		if (this.cell) {
			to_chat(user, "<span class='warning'>You have already inserted a cell!</span>");
			return f.dot;
		} else {
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.cell = W;
			to_chat(user, "<span class='notice'>You insert the cell.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		if (this.wired) {
			to_chat(user, "<span class='warning'>You have already inserted wire!</span>");
			return f.dot;
		}
		if (yield* (coil = W).use(1)) {
			this.wired = 1;
			to_chat(user, "<span class='notice'>You insert the wire.</span>");
		} else {
			to_chat(user, "<span class='warning'>You need one length of coil to wire it!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// robot_bodyparts.dm:83
rt.def("/obj/item/bodypart/chest/robot/proc/Destroy", function* Destroy(f: Frame) {
	if (this.cell) {
		yield* qdel(this.cell);
		this.cell = null;
	}
	return (yield* parent_proc());
}, true);

// robot_bodyparts.dm:90
rt.def("/obj/item/bodypart/chest/robot/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	if (this.wired) {
		yield* new_(T("/obj/item/stack/cable_coil"), user.loc, 1);
	}
	if (this.cell) {
		yield* this.cell.forceMove(user.loc);
		this.cell = null;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10203, "/obj/item/bodypart/head/robot", "/obj/item/bodypart/head", {
	flash1: null,
	flash2: null,
	item_state: "buildpipe",
	flags: 64,
	status: 2,
	name: "cyborg head",
	desc: "A standard reinforced braincase, with spine-plugged neural socket and sensor gimbals.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "borg_head",
});

// robot_bodyparts.dm:111
rt.def("/obj/item/bodypart/head/robot/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let F: Value = null;
	if (rt.istype(W, T("/obj/item/device/assembly/flash/handheld"))) {
		F = W;
		if (this.flash1 && this.flash2) {
			to_chat(user, "<span class='warning'>You have already inserted the eyes!</span>");
			return f.dot;
		} else if (F.crit_fail) {
			to_chat(user, "<span class='warning'>You can't use a broken flash!</span>");
			return f.dot;
		} else {
			if (!(yield* user.transferItemToLoc(F, this))) {
				return f.dot;
			}
			if (this.flash1) {
				this.flash2 = F;
			} else {
				this.flash1 = F;
			}
			to_chat(user, "<span class='notice'>You insert the flash into the eye socket.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		if (this.flash1 || this.flash2) {
			playsound(this.loc, W.usesound, 50, 1);
			to_chat(user, `<span class='notice'>You remove the flash from ${this}.</span>`);
			if (this.flash1) {
				yield* this.flash1.forceMove(user.loc);
				this.flash1 = null;
			}
			if (this.flash2) {
				yield* this.flash2.forceMove(user.loc);
				this.flash2 = null;
			}
		} else {
			to_chat(user, `<span class='warning'>There are no flash to remove from ${this}.</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// robot_bodyparts.dm:145
rt.def("/obj/item/bodypart/head/robot/proc/Destroy", function* Destroy(f: Frame) {
	if (this.flash1) {
		yield* qdel(this.flash1);
		this.flash1 = null;
	}
	if (this.flash2) {
		yield* qdel(this.flash2);
		this.flash2 = null;
	}
	return (yield* parent_proc());
}, true);

// robot_bodyparts.dm:155
rt.def("/obj/item/bodypart/head/robot/proc/drop_organs", function* drop_organs(f: Frame, user: Value) {
	if (this.flash1) {
		yield* this.flash1.forceMove(user.loc);
		this.flash1 = null;
	}
	if (this.flash2) {
		yield* this.flash2.forceMove(user.loc);
		this.flash2 = null;
	}
	yield* parent_proc();
	return f.dot;
}, true);
