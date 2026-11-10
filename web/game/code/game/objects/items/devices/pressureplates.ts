// Based on /tg/station's code/game/objects/items/devices/pressureplates.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9278, "/obj/item/device/pressure_plate", "/obj/item/device", {
	trigger_mob: 1,
	trigger_item: 0,
	trigger_silent: 0,
	trigger_sound: rt.rsc("sound/effects/pressureplate.ogg"),
	sigdev: null,
	roundstart_signaller: 0,
	roundstart_signaller_freq: 1447,
	roundstart_signaller_code: 30,
	roundstart_hide: 0,
	removable_signaller: 1,
	active: 0,
	tile_overlay: null,
	crossed: 0,
	trigger_delay: 10,
	level: 1,
	name: "pressure plate",
	desc: "Useful for autismforts",
	item_state: "flash",
	icon_state: "pressureplate",
});

// pressureplates.dm:24
rt.def("/obj/item/device/pressure_plate/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.tile_overlay = (yield* image({ icon: rt.rsc("icons/turf/floors.dmi"), icon_state: "pp_overlay" }));
	if (!this.roundstart_signaller) return f.dot;
	this.sigdev = (yield* new_(T("/obj/item/device/assembly/signaler")));
	this.sigdev.code = this.roundstart_signaller_code;
	this.sigdev.frequency = this.roundstart_signaller_freq;
	if (!rt.istype(this.loc, T("/turf/open"))) return f.dot;
	yield* this.hide(1);
	return f.dot;
}, true);

// pressureplates.dm:34
rt.def("/obj/item/device/pressure_plate/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	if (!this.active) {
		return f.dot;
	}
	if (rt.istype(AM, T("/mob/living")) && this.trigger_mob) {
		this.step_living((L = AM));
		this.crossed = 1;
	} else if (this.trigger_item) {
		this.step_item(AM);
		this.crossed = 1;
	}
	if (!this.trigger_silent) {
		if (isturf(this.loc)) {
			this.loc.visible_message("<span class='danger'>Click!</span>");
			playsound(this.loc, this.trigger_sound, 50, 1);
		}
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// pressureplates.dm:51
rt.def("/obj/item/device/pressure_plate/proc/Uncrossed", function* Uncrossed(f: Frame, AM: Value) {
	let L: Value = null;
	if (this.crossed) {
		playsound(this.loc, this.trigger_sound, 50, 1);
		if (rt.istype(AM, T("/mob/living"))) {
			to_chat((L = AM), `<span class='warning'>You feel something click back into place as you step off ${this.loc}!</span>`);
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/pressure_plate/proc/trigger"))), this.trigger_delay);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// pressureplates.dm:59
rt.def("/obj/item/device/pressure_plate/proc/trigger", function* trigger(f: Frame) {
	if (!rt.istype(this.sigdev, T("/obj/item/device/assembly/signaler"))) return f.dot;
	yield* this.sigdev.signal();
	return f.dot;
}, true);

// pressureplates.dm:63
rt.def("/obj/item/device/pressure_plate/proc/step_living", function step_living(f: Frame, L: Value) {
	to_chat(L, "<span class='warning'>You feel a click under your feet!</span>");
	return f.dot;
});

// pressureplates.dm:69
rt.def("/obj/item/device/pressure_plate/proc/attackby", function* attackby(f: Frame, I: Value, L: Value) {
	if (rt.istype(I, T("/obj/item/device/assembly/signaler")) && !rt.istype(this.sigdev, T("/obj/item/device/assembly/signaler")) && this.removable_signaller && (yield* L.transferItemToLoc(I, this))) {
		this.sigdev = I;
		to_chat(L, `<span class='notice'>You attach ${I} to ${this}!</span>`);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// pressureplates.dm:75
rt.def("/obj/item/device/pressure_plate/proc/attack_self", function* attack_self(f: Frame, L: Value) {
	if (this.removable_signaller && rt.istype(this.sigdev, T("/obj/item/device/assembly/signaler"))) {
		to_chat(L, `<span class='notice'>You remove ${this.sigdev} from ${this}</span>`);
		if (!(yield* L.put_in_hands(this.sigdev))) {
			yield* this.sigdev.forceMove(rt.getStep(f, this, 0));
		}
		this.sigdev = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// pressureplates.dm:89
rt.def("/obj/item/device/pressure_plate/proc/hide", function* hide(f: Frame, yes: Value) {
	if (yes) {
		this.invisibility = 100;
		this.anchored = 1;
		this.icon_state = null;
		this.active = 1;
		if (this.tile_overlay) {
			this.loc.overlays += this.tile_overlay;
		}
	} else {
		if (this.crossed) {
			yield* this.trigger();
		}
		this.invisibility = rt.initial(f, this, "invisibility");
		this.anchored = 0;
		this.icon_state = rt.initial(f, this, "icon_state");
		this.active = 0;
		if (!this.tile_overlay) return f.dot;
		this.loc.overlays -= this.tile_overlay;
	}
	return f.dot;
}, true);
