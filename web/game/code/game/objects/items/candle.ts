// Based on /tg/station's code/game/objects/items/candle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9657, "/obj/item/candle", "/obj/item", {
	wax: 200,
	lit: 0,
	infinite: 0,
	start_lit: 0,
	item_state: "candle1",
	w_class: 1,
	light_color: "#FAA019",
	heat: 1000,
	name: "red candle",
	desc: "In Greek myth, Prometheus stole fire from the Gods and gave it to humankind. The jewelry he kept for himself.",
	icon: rt.rsc("icons/obj/candle.dmi"),
	icon_state: "candle1",
});

// candle.dm:18
rt.def("/obj/item/candle/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (!this.start_lit) return f.dot;
	yield* this.light({ show_message: 0 });
	return f.dot;
}, true);

// candle.dm:25
rt.def("/obj/item/candle/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null;
	if (this.wax > 150) {
		i = 1;
	} else if (this.wax > 80) {
		i = 2;
	} else {
		i = 3;
	}
	let $0: any = i;
	this.icon_state = `candle${$0}${this.lit ? "_lit" : ""}`;
	return f.dot;
});

// candle.dm:34
rt.def("/obj/item/candle/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let msg: Value = null;
	yield* parent_proc();
	if (!(msg = (yield* W.ignition_effect(this, user)))) return f.dot;
	yield* this.light(msg);
	return f.dot;
}, true);

// candle.dm:40
rt.def("/obj/item/candle/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	if (!this.lit) {
		yield* this.light();
	}
	yield* parent_proc();
	return f.dot;
}, true);

// candle.dm:45
rt.def("/obj/item/candle/proc/light", function light(f: Frame, show_message: Value) {
	if (this.lit) return f.dot;
	this.lit = 1;
	if (show_message) {
		f.usr.visible_message(show_message);
	}
	this.set_light(2);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.update_icon();
	return f.dot;
});

// candle.dm:56
rt.def("/obj/item/candle/proc/process", function* process(f: Frame) {
	if (!this.lit) {
		return f.dot;
	}
	if (!this.infinite) {
		this.wax--;
	}
	if (!this.wax) {
		yield* new_(T("/obj/item/trash/candle"), this.loc);
		yield* qdel(this);
	}
	yield* this.update_icon();
	yield* this.open_flame();
	return f.dot;
}, true, { waitfor: false });

// candle.dm:68
rt.def("/obj/item/candle/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.lit) return f.dot;
	user.visible_message(`<span class='notice'>${user} snuffs ${this}.</span>`);
	this.lit = 0;
	this.update_icon();
	this.set_light(0);
	return f.dot;
});

// candle.dm:75
rt.def("/obj/item/candle/proc/is_hot", function is_hot(f: Frame) {
	return this.lit * this.heat;
});
