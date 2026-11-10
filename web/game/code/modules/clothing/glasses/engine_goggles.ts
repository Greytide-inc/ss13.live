// Based on /tg/station's code/modules/clothing/glasses/engine_goggles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8212, "/obj/item/clothing/glasses/meson/engine", "/obj/item/clothing/glasses/meson", {
	mesons_on: 1,
	range: 1,
	name: "engineering scanner goggles",
	desc: "Goggles used by engineers. The Meson Scanner mode lets you see basic structural and terrain layouts through walls, regardless of lighting condition. The T-ray Scanner mode lets you see underfloor objects such as cables and pipes.",
	icon_state: "trayson-meson",
	actions_types: null,
	origin_tech: "materials=3;magnets=3;engineering=3;plasmatech=3",
});

// engine_goggles.dm:7
rt.def("/obj/item/clothing/glasses/meson/engine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_mode"));
	return f.dot;
});

// engine_goggles.dm:16
rt.def("/obj/item/clothing/glasses/meson/engine/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// engine_goggles.dm:20
rt.def("/obj/item/clothing/glasses/meson/engine/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// engine_goggles.dm:24
rt.def("/obj/item/clothing/glasses/meson/engine/proc/toggle_mode", function* toggle_mode(f: Frame, user: Value, voluntary: Value) {
	let H: Value = null, X: Value = null, A: Value = null;
	this.mesons_on = (!this.mesons_on ? 1 : 0);
	if (!this.mesons_on) {
		this.vision_flags = 0;
		this.darkness_view = 2;
		this.invis_view = 25;
		this.lighting_alpha = null;
		if (voluntary) {
			to_chat(user, "<span class='notice'>You toggle the goggles' scanning mode to [T-Ray].</span>");
		} else {
			to_chat(user, "<span class='warning'>The goggles abruptly toggle to [T-Ray] mode!</span>");
		}
	} else {
		this.vision_flags = 16;
		this.darkness_view = 1;
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
		if (voluntary) {
			to_chat(user, "<span class='notice'>You toggle the goggles' scanning mode to [Meson].</span>");
		} else {
			to_chat(user, "<span class='warning'>The goggles abruptly toggle to [Meson] mode!</span>");
		}
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).glasses == this) {
			yield* H.update_sight();
		}
	}
	yield* this.update_icon();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);

// engine_goggles.dm:55
rt.def("/obj/item/clothing/glasses/meson/engine/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.toggle_mode(user, 1);
	return f.dot;
}, true);

// engine_goggles.dm:59
rt.def("/obj/item/clothing/glasses/meson/engine/proc/process", function* process(f: Frame) {
	let _T: Value = null, user: Value = null;
	if (this.mesons_on) {
		if ((_T = rt.getStep(f, this, 0)) && _T.z == ZLEVEL_MINING) {
			yield* this.toggle_mode(this.loc);
		}
		return f.dot;
	}
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((user = this.loc).glasses != this) {
		return f.dot;
	}
	yield* this.scan();
	return f.dot;
}, true, { waitfor: false });

// engine_goggles.dm:73
rt.def("/obj/item/clothing/glasses/meson/engine/proc/scan", function* scan(f: Frame) {
	let _T: Value = null, O: Value = null;
	for (_T of each(range(this.range, this.loc), T("/turf"))) {
		O = null;
		for (O of each(_T.contents, T("/obj"))) {
			if (O.level != 1) {
				continue;
			}
			if (O.invisibility == INVISIBILITY_MAXIMUM) {
				yield* this.flick_sonar(O);
			}
		}
	}
	return f.dot;
}, true);

// engine_goggles.dm:82
rt.def("/obj/item/clothing/glasses/meson/engine/proc/flick_sonar", function* flick_sonar(f: Frame, pipe: Value) {
	let MA: Value = null;
	if (!ismob(this.loc)) return f.dot;
	let M: Value = this.loc;
	let I: Value = (yield* new_(T("/image"), { loc: rt.getStep(f, pipe, 0) }));
	(MA = (yield* new_(T("/mutable_appearance"), pipe))).alpha = 128;
	I.appearance = MA;
	if (!M.client) return f.dot;
	yield* flick_overlay(I, list(M.client), 8);
	return f.dot;
}, true);

// engine_goggles.dm:92
rt.def("/obj/item/clothing/glasses/meson/engine/proc/update_icon", function update_icon(f: Frame) {
	let user: Value = null;
	this.icon_state = this.mesons_on ? "trayson-meson" : "trayson-tray";
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	if ((user = this.loc).glasses != this) return f.dot;
	user.update_inv_glasses();
	return f.dot;
});

rt.type(8213, "/obj/item/clothing/glasses/meson/engine/tray", "/obj/item/clothing/glasses/meson/engine", {
	on: 0,
	mesons_on: 0,
	range: 2,
	name: "optical t-ray scanner",
	desc: "Used by engineering staff to see underfloor objects such as cables and pipes.",
	icon_state: "trayson-tray_off",
	origin_tech: "materials=3;magnets=2;engineering=2",
	vision_flags: 0,
	darkness_view: 2,
	invis_view: 25,
});

// engine_goggles.dm:113
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/process", function process(f: Frame) {
	if (!this.on) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// engine_goggles.dm:118
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/update_icon", function update_icon(f: Frame) {
	let user: Value = null;
	this.icon_state = `trayson-tray${this.on ? "" : "_off"}`;
	if (!rt.istype(this.loc, T("/mob/living/carbon/human"))) return f.dot;
	if ((user = this.loc).glasses != this) return f.dot;
	user.update_inv_glasses();
	return f.dot;
});

// engine_goggles.dm:125
rt.def("/obj/item/clothing/glasses/meson/engine/tray/proc/toggle_mode", function* toggle_mode(f: Frame, user: Value, voluntary: Value) {
	let X: Value = null, A: Value = null;
	let $1: any, $2: any, $e: any;
	this.on = (!this.on ? 1 : 0);
	let $0: any = user;
	if (voluntary) {
		$1 = "notice";
	} else {
		$1 = "warning";
	}
	if (voluntary) {
		$2 = "You turn the goggles";
	} else {
		$2 = "The goggles turn";
	}
	to_chat($0, `<span class='${$1}'>${$2} ${this.on ? "on" : "off"}${voluntary ? "." : "!"}</span>`);
	yield* this.update_icon();
	for (X of each(this.actions)) {
		yield* (A = X).UpdateButtonIcon();
	}
	return f.dot;
}, true);
