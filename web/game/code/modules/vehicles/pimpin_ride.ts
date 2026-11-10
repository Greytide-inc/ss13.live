// Based on /tg/station's code/modules/vehicles/pimpin_ride.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(13063, "/obj/vehicle/janicart", "/obj/vehicle", {
	mybag: null,
	floorbuffer: 0,
	name: "janicart (pimpin' ride)",
	desc: "A brave janitor cyborg gave its life to produce such an amazing combination of speed and utility.",
	icon_state: "pussywagon",
});

// pimpin_ride.dm:11
rt.def("/obj/vehicle/janicart/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	f.dot = parent_proc();
	this.update_icon();
	return f.dot;
}, false);

// pimpin_ride.dm:16
rt.def("/obj/vehicle/janicart/proc/Destroy", function* Destroy(f: Frame) {
	if (this.mybag) {
		yield* qdel(this.mybag);
		this.mybag = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// pimpin_ride.dm:21
rt.def("/obj/vehicle/janicart/proc/buckle_mob", function* buckle_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	this.riding_datum = (yield* new_(T("/datum/riding/janicart")));
	return f.dot;
}, true, { args: ["buckled_mob", "force", "check_loc"] });

// pimpin_ride.dm:40
rt.def("/obj/vehicle/janicart/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.floorbuffer) return f.dot;
	to_chat(user, "It has been upgraded with a floor buffer.");
	return f.dot;
}, false);

// pimpin_ride.dm:46
rt.def("/obj/vehicle/janicart/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/storage/bag/trash"))) {
		if (this.mybag) {
			to_chat(user, `<span class='warning'>${this} already has a trashbag hooked!</span>`);
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You hook the trashbag onto ${this}.</span>`);
		I.loc = this;
		this.mybag = I;
		yield* this.update_icon();
	} else if (rt.istype(I, T("/obj/item/janiupgrade"))) {
		if (this.floorbuffer) {
			to_chat(user, `<span class='warning'>${this} already has a floor buffer!</span>`);
			return f.dot;
		}
		this.floorbuffer = 1;
		yield* qdel(I);
		to_chat(user, `<span class='notice'>You upgrade ${this} with the floor buffer.</span>`);
		(rt.modSrcVar(f, "flags", 2048, rt.bitOr));
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// pimpin_ride.dm:70
rt.def("/obj/vehicle/janicart/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.mybag) {
		this.add_overlay("cart_garbage");
	}
	if (!this.floorbuffer) return f.dot;
	this.add_overlay("cart_buffer");
	return f.dot;
});

// pimpin_ride.dm:78
rt.def("/obj/vehicle/janicart/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return 1;
	} else {
		if (!this.mybag) return f.dot;
		this.mybag.loc = rt.getStep(f, user, 0);
		yield* user.put_in_hands(this.mybag);
		this.mybag = null;
		yield* this.update_icon();
	}
	return f.dot;
}, true);
