// Based on /tg/station's code/game/objects/structures/artstuff.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12721, "/obj/structure/easel", "/obj/structure", {
	painting: null,
	name: "easel",
	desc: "Only for the finest of art!",
	icon: rt.rsc("icons/obj/artstuff.dmi"),
	icon_state: "easel",
	density: 1,
	resistance_flags: 4,
	obj_integrity: 60,
	max_integrity: 60,
});

// artstuff.dm:20
rt.def("/obj/structure/easel/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/canvas"))) {
		C = I;
		yield* user.dropItemToGround(C);
		this.painting = C;
		C.loc = rt.getStep(f, this, 0);
		C.layer = this.layer + 0.1;
		user.visible_message(fmt("<span class='notice'>＀ puts ％！ on ％！.</span>", [user, C, this]), fmt("<span class='notice'>You place ％！ on ％！.</span>", [C, this]));
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// artstuff.dm:33
rt.def("/obj/structure/easel/proc/Move", function* Move(f: Frame) {
	let _T: Value = rt.getStep(f, this, 0);
	yield* parent_proc();
	if (this.painting && this.painting.loc == _T) {
		this.painting.loc = rt.getStep(f, this, 0);
	} else {
		this.painting = null;
	}
	return f.dot;
}, true);

// artstuff.dm:48
rt.def("/datum/controller/global_vars/proc/InitGlobalglobalBlankCanvases", function InitGlobalglobalBlankCanvases(f: Frame) {
	GLOB.globalBlankCanvases = new_(T("/list"), 4);
	this.gvars_datum_init_order += "globalBlankCanvases";
	return f.dot;
});

rt.type(7474, "/obj/item/weapon/canvas", "/obj/item/weapon", {
	whichGlobalBackup: 1,
	name: "canvas",
	desc: "Draw out your soul on this canvas!",
	icon: rt.rsc("icons/obj/artstuff.dmi"),
	icon_state: "11x11",
	resistance_flags: 4,
});

// artstuff.dm:74
rt.def("/obj/item/weapon/canvas/proc/getGlobalBackup", function getGlobalBackup(f: Frame) {
	let I: Value = null;
	f.dot = null;
	if (rt.index(GLOB.globalBlankCanvases, this.whichGlobalBackup)) {
		f.dot = rt.index(GLOB.globalBlankCanvases, this.whichGlobalBackup);
	} else {
		I = icon(rt.initial(f, this, "icon"), rt.initial(f, this, "icon_state"));
		rt.setAt(GLOB.globalBlankCanvases, this.whichGlobalBackup, I);
		f.dot = I;
	}
	return f.dot;
});

// artstuff.dm:86
rt.def("/obj/item/weapon/canvas/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let masterpiece: Value = null, thePix: Value = null, Ico: Value = null, theOriginalPix: Value = null, C: Value = null;
	let click_params: Value = params2list(params);
	let pixX: Value = text2num(rt.at(click_params, "icon-x"));
	let pixY: Value = text2num(rt.at(click_params, "icon-y"));
	if (!click_params || !rt.at(click_params, "icon-x") || !rt.at(click_params, "icon-y")) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/soap")) || rt.istype(I, T("/obj/item/weapon/reagent_containers/glass/rag"))) {
		masterpiece = icon(this.icon, this.icon_state);
		thePix = masterpiece.GetPixel(pixX, pixY);
		if (!(Ico = this.getGlobalBackup())) {
			yield* qdel(masterpiece);
			return f.dot;
		}
		theOriginalPix = Ico.GetPixel(pixX, pixY);
		if (thePix != theOriginalPix) {
			this.DrawPixelOn(theOriginalPix, pixX, pixY);
		}
		yield* qdel(masterpiece);
	} else if (rt.istype(I, T("/obj/item/toy/crayon"))) {
		this.DrawPixelOn((C = I).paint_color, pixX, pixY);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// artstuff.dm:119
rt.def("/obj/item/weapon/canvas/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let blank: Value = null;
	if (!user) {
		return f.dot;
	}
	if (!(blank = this.getGlobalBackup())) return f.dot;
	this.icon = blank;
	user.visible_message(`<span class='notice'>${user} cleans the canvas.</span>`, "<span class='notice'>You clean the canvas.</span>");
	return f.dot;
});
