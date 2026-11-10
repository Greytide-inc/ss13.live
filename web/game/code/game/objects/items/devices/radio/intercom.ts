// Based on /tg/station's code/game/objects/items/devices/radio/intercom.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9205, "/obj/item/device/radio/intercom", "/obj/item/device/radio", {
	number: 0,
	anyai: 1,
	ai: null,
	last_tick: null,
	unfastened: 0,
	anchored: 1,
	name: "station intercom",
	desc: "Talk through this.",
	icon_state: "intercom",
	w_class: 4,
	canhear_range: 2,
	dog_fashion: null,
});

// intercom.dm:10
rt.def("/obj/item/device/radio/intercom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ai = list();
	return f.dot;
});

// intercom.dm:19
rt.def("/obj/item/device/radio/intercom/proc/Initialize", function* Initialize(f: Frame, mapload: Value, ndir: Value, building: Value) {
	f.dot = (yield* parent_proc());
	if (building) {
		yield* this.setDir(ndir);
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// intercom.dm:25
rt.def("/obj/item/device/radio/intercom/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// intercom.dm:29
rt.def("/obj/item/device/radio/intercom/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.unfastened) {
		to_chat(user, "<span class='notice'>It's <b>screwed</b> and secured to the wall.</span>");
	} else {
		to_chat(user, "<span class='notice'>It's <i>unscrewed</i> from the wall, and can be <b>detached</b>.</span>");
	}
	return f.dot;
}, false);

// intercom.dm:36
rt.def("/obj/item/device/radio/intercom/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, W: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		S = I;
		if (this.unfastened) {
			user.visible_message(`<span class='notice'>${user} starts tightening ${this}'s screws...</span>`, `<span class='notice'>You start screwing in ${this}...</span>`);
			playsound(this, S.usesound, 50, 1);
			if (!(yield* do_after(user, 30 * S.toolspeed, { target: this }))) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} tightens ${this}'s screws!</span>`, `<span class='notice'>You tighten ${this}'s screws.</span>`);
			playsound(this, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
			this.unfastened = 0;
		} else {
			user.visible_message(`<span class='notice'>${user} starts loosening ${this}'s screws...</span>`, `<span class='notice'>You start unscrewing ${this}...</span>`);
			playsound(this, S.usesound, 50, 1);
			if (!(yield* do_after(user, 60 * S.toolspeed, { target: this }))) {
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} loosens ${this}'s screws!</span>`, `<span class='notice'>You unscrew ${this}, loosening it from the wall.</span>`);
			playsound(this, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
			this.unfastened = 1;
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (!this.unfastened) {
			to_chat(user, `<span class='warning'>You need to unscrew ${this} from the wall first!</span>`);
			return f.dot;
		}
		W = I;
		user.visible_message(`<span class='notice'>${user} starts unsecuring ${this}...</span>`, `<span class='notice'>You start unsecuring ${this}...</span>`);
		playsound(this, W.usesound, 50, 1);
		if (!(yield* do_after(user, 80 * W.toolspeed, { target: this }))) {
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} unsecures ${this}!</span>`, `<span class='notice'>You detach ${this} from the wall.</span>`);
		playsound(this, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		yield* new_(T("/obj/item/wallframe/intercom"), rt.getStep(f, this, 0));
		yield* qdel(this);
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// intercom.dm:72
rt.def("/obj/item/device/radio/intercom/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// intercom.dm:75
rt.def("/obj/item/device/radio/intercom/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// intercom.dm:78
rt.def("/obj/item/device/radio/intercom/proc/interact", function* interact(f: Frame, user: Value) {
	yield* parent_proc();
	yield* this.ui_interact(user, { state: GLOB.default_state });
	return f.dot;
}, true);

// intercom.dm:82
rt.def("/obj/item/device/radio/intercom/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	let position: Value = null;
	if (!this.on) {
		return -1;
	}
	if (this.wires.is_cut("Recieve")) {
		return -1;
	}
	if (!rt.isIn(f, 0, level)) {
		if ((position = rt.getStep(f, this, 0)) === null || !rt.isIn(f, position.z, level)) {
			return -1;
		}
	}
	if (!this.listening) {
		return -1;
	}
	if (freq == 1213) {
		if (!this.syndie) {
			return -1;
		}
	}
	return this.canhear_range;
});

// intercom.dm:100
rt.def("/obj/item/device/radio/intercom/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (!this.anyai && !rt.isIn(f, speaker, this.ai)) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// intercom.dm:105
rt.def("/obj/item/device/radio/intercom/proc/process", function process(f: Frame) {
	let A: Value = null;
	if (!(rt.world().timeofday - this.last_tick > 30 || rt.world().timeofday - this.last_tick < 0)) return f.dot;
	this.last_tick = rt.world().timeofday;
	if (!(A = get_area(this)) || this.emped) {
		this.on = 0;
	} else {
		this.on = A.powered(1);
	}
	if (!this.on) {
		this.icon_state = "intercom-p";
	} else {
		this.icon_state = "intercom";
	}
	return f.dot;
}, false, { waitfor: false });

rt.type(9547, "/obj/item/wallframe/intercom", "/obj/item/wallframe", {
	result_path: rt.typePath("/obj/item/device/radio/intercom/unscrewed"),
	pixel_shift: 29,
	inverse: 1,
	name: "intercom frame",
	desc: "A ready-to-go intercom. Just slap it on a wall and screw it in!",
	icon_state: "intercom",
	materials: null,
});

// intercom.dm:130
rt.def("/obj/item/wallframe/intercom/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 75, "$glass", 25]);
	return f.dot;
});
