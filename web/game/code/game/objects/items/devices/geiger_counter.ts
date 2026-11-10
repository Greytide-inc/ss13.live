// Based on /tg/station's code/game/objects/items/devices/geiger_counter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9231, "/obj/item/device/geiger_counter", "/obj/item/device", {
	scanning: 0,
	radiation_count: 0,
	emagged: 0,
	name: "geiger counter",
	desc: "A handheld device used for detecting and measuring radiation pulses.",
	icon_state: "geiger_off",
	item_state: "multitool",
	w_class: 2,
	slot_flags: 512,
	materials: null,
});

// geiger_counter.dm:14
rt.def("/obj/item/device/geiger_counter/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 150, "$glass", 150]);
	return f.dot;
});

// geiger_counter.dm:20
rt.def("/obj/item/device/geiger_counter/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// geiger_counter.dm:24
rt.def("/obj/item/device/geiger_counter/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// geiger_counter.dm:29
rt.def("/obj/item/device/geiger_counter/proc/process", function process(f: Frame) {
	if (this.emagged) {
		if (this.radiation_count < 20) {
			this.radiation_count++;
		}
		return 0;
	}
	if (!(this.radiation_count > 0)) return f.dot;
	this.radiation_count--;
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

// geiger_counter.dm:37
rt.def("/obj/item/device/geiger_counter/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.scanning) {
		return 1;
	}
	to_chat(user, "<span class='info'>Alt-click it to clear stored radiation levels.</span>");
	if (this.emagged) {
		to_chat(user, "<span class='warning'>The display seems to be incomprehensible.</span>");
		return 1;
	}
	if (rt.inRange(this.radiation_count, -1e+31, 10)) {
		to_chat(user, "<span class='notice'>Ambient radiation level count reports that all is well.</span>");
	} else if (rt.inRange(this.radiation_count, 11, RAD_LEVEL_MODERATE)) {
		to_chat(user, "<span class='disarm'>Ambient radiation levels slightly above average.</span>");
	} else if (rt.inRange(this.radiation_count, 31, RAD_LEVEL_HIGH)) {
		to_chat(user, "<span class='warning'>Ambient radiation levels above average.</span>");
	} else if (rt.inRange(this.radiation_count, 76, RAD_LEVEL_VERY_HIGH)) {
		to_chat(user, "<span class='danger'>Ambient radiation levels highly above average.</span>");
	} else if (rt.inRange(this.radiation_count, 126, RAD_LEVEL_CRITICAL)) {
		to_chat(user, "<span class='suicide'>Ambient radiation levels nearing critical level.</span>");
	} else if (rt.inRange(this.radiation_count, 201, 1e+31)) {
		to_chat(user, "<span class='boldannounce'>Ambient radiation levels above critical level!</span>");
	}
	return f.dot;
}, false);

// geiger_counter.dm:59
rt.def("/obj/item/device/geiger_counter/proc/update_icon", function update_icon(f: Frame) {
	if (!this.scanning) {
		this.icon_state = "geiger_off";
		return 1;
	}
	if (this.emagged) {
		this.icon_state = "geiger_on_emag";
		return 1;
	}
	if (rt.inRange(this.radiation_count, -1e+31, 10)) {
		this.icon_state = "geiger_on_1";
	} else if (rt.inRange(this.radiation_count, 11, RAD_LEVEL_MODERATE)) {
		this.icon_state = "geiger_on_2";
	} else if (rt.inRange(this.radiation_count, 31, RAD_LEVEL_HIGH)) {
		this.icon_state = "geiger_on_3";
	} else if (rt.inRange(this.radiation_count, 76, RAD_LEVEL_VERY_HIGH)) {
		this.icon_state = "geiger_on_4";
	} else if (rt.inRange(this.radiation_count, 126, RAD_LEVEL_CRITICAL)) {
		this.icon_state = "geiger_on_4";
	} else if (rt.inRange(this.radiation_count, 201, 1e+31)) {
		this.icon_state = "geiger_on_5";
	}
	parent_proc();
	return f.dot;
});

// geiger_counter.dm:81
rt.def("/obj/item/device/geiger_counter/proc/rad_act", function rad_act(f: Frame, amount: Value) {
	let M: Value = null;
	if (!amount && this.scanning) {
		return 0;
	}
	if (this.emagged) {
		amount = max(0, min(amount, 25));
	}
	this.radiation_count += amount;
	if (rt.istype(this.loc, T("/mob/living"))) {
		M = this.loc;
		if (!this.emagged) {
			to_chat(M, `<span class='boldannounce'>${bicon(this)} RADIATION PULSE DETECTED.</span>`);
			to_chat(M, `<span class='boldannounce'>${bicon(this)} Severity: ${amount}</span>`);
		} else {
			to_chat(M, `<span class='boldannounce'>${bicon(this)} !@%$AT!(N P!LS! D/TEC?ED.</span>`);
			to_chat(M, `<span class='boldannounce'>${bicon(this)} &!F2rity: <=${amount}#1</span>`);
		}
	}
	this.update_icon();
	return f.dot;
});

// geiger_counter.dm:97
rt.def("/obj/item/device/geiger_counter/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.scanning = (!this.scanning ? 1 : 0);
	this.update_icon();
	let $0: any = user;
	let $1: any = bicon(this);
	to_chat($0, `<span class='notice'>${$1} You switch ${this.scanning ? "on" : "off"} ${this}.</span>`);
	return f.dot;
});

// geiger_counter.dm:102
rt.def("/obj/item/device/geiger_counter/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (user.a_intent == "help") {
		if (!this.emagged) {
			user.visible_message(`<span class='notice'>${user} scans ${M} with ${this}.</span>`, `<span class='notice'>You scan ${M}'s radiation levels with ${this}...</span>`);
			if (!M.radiation) {
				to_chat(user, `<span class='notice'>${bicon(this)} Radiation levels within normal boundaries.</span>`);
				return 1;
			} else {
				to_chat(user, `<span class='boldannounce'>${bicon(this)} Subject is irradiated. Radiation levels: ${M.radiation}.</span>`);
				return 1;
			}
		} else {
			user.visible_message(`<span class='notice'>${user} scans ${M} with ${this}.</span>`, `<span class='danger'>You project ${this}'s stored radiation into ${M}'s body!</span>`);
			yield* M.rad_act(this.radiation_count);
			this.radiation_count = 0;
		}
		return 1;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// geiger_counter.dm:119
rt.def("/obj/item/device/geiger_counter/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver")) && this.emagged) {
		if (this.scanning) {
			to_chat(user, `<span class='warning'>Turn off ${this} before you perform this action!</span>`);
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} unscrews ${this}'s maintenance panel and begins fiddling with its innards...</span>`, `<span class='notice'>You begin resetting ${this}...</span>`);
		playsound(user, I.usesound, 50, 1);
		if (!(yield* do_after(user, 40 * I.toolspeed, { target: user }))) {
			return 0;
		}
		user.visible_message(`<span class='notice'>${user} refastens ${this}'s maintenance panel!</span>`, `<span class='notice'>You reset ${this} to its factory settings!</span>`);
		playsound(user, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
		this.emagged = 0;
		this.radiation_count = 0;
		yield* this.update_icon();
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// geiger_counter.dm:137
rt.def("/obj/item/device/geiger_counter/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living")) || user.incapacitated()) {
		return (yield* parent_proc());
	}
	if (!this.scanning) {
		to_chat(f.usr, `<span class='warning'>${this} must be on to reset its radiation level!</span>`);
		return 0;
	}
	this.radiation_count = 0;
	to_chat(f.usr, `<span class='notice'>You flush ${this}'s radiation counts, resetting it to normal.</span>`);
	yield* this.update_icon();
	return f.dot;
}, true);

// geiger_counter.dm:147
rt.def("/obj/item/device/geiger_counter/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	if (this.scanning) {
		to_chat(user, `<span class='warning'>Turn off ${this} before you perform this action!</span>`);
		return 0;
	}
	to_chat(user, `<span class='warning'>You override ${this}'s radiation storing protocols. It will now generate small doses of radiation, and stored rads are now projected into creatures you scan.</span>`);
	this.emagged = 1;
	return f.dot;
});
