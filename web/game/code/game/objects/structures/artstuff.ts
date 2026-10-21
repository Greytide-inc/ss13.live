// From code/game/objects/structures/artstuff.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/structure/easel/proc/attackby  (code/game/objects/structures/artstuff.dm:20)  may sleep
rt.def("/obj/structure/easel/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/canvas")) ? 1 : 0))) {
		C = live(f.args[0]);
		yield* g.callName(f, live(f.args[1]), "dropItemToGround", [live(C)]);
		rt.setSv(f, "painting", live(C));
		rt.setFv(f, "loc", live(C), rt.getStep(f, live(f.src), 0));
		rt.setFv(f, "layer", live(C), add(rt.sv(f, "layer"), 0.10000000149011612));
		yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ puts ％！ on ％！.</span>", [live(f.args[1]), live(C), live(f.src)]), fmt("<span class='notice'>You place ％！ on ％！.</span>", [live(C), live(f.src)])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/easel/proc/Move  (code/game/objects/structures/artstuff.dm:33)  may sleep
rt.def("/obj/structure/easel/proc/Move", function* Move(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	_T = rt.getStep(f, live(f.src), 0);
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "painting")) && isEqual(rt.fv(f, "loc", rt.sv(f, "painting")), live(_T)))) {
		rt.setFv(f, "loc", rt.sv(f, "painting"), rt.getStep(f, live(f.src), 0));
	} else {
		rt.setSv(f, "painting", null);
	}
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalglobalBlankCanvases  (code/game/objects/structures/artstuff.dm:48)
rt.def("/datum/controller/global_vars/proc/InitGlobalglobalBlankCanvases", function InitGlobalglobalBlankCanvases(f: Frame) {
	rt.setGl("globalBlankCanvases", rt.new_(f, T("/list"), [4]));
	rt.modSrcVar(f, "gvars_datum_init_order", "globalBlankCanvases", add);
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

// /obj/item/weapon/canvas/proc/getGlobalBackup  (code/game/objects/structures/artstuff.dm:74)
rt.def("/obj/item/weapon/canvas/proc/getGlobalBackup", function getGlobalBackup(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	f.dot = null;
	if (truthy(rt.index(rt.gl("globalBlankCanvases"), rt.sv(f, "whichGlobalBackup")))) {
		f.dot = rt.index(rt.gl("globalBlankCanvases"), rt.sv(f, "whichGlobalBackup"));
	} else {
		I = rt.call(f, P("/proc/icon"), null, [rt.initial(f, live(f.src), "icon"), rt.initial(f, live(f.src), "icon_state")]);
		rt.setAt(rt.gl("globalBlankCanvases"), rt.sv(f, "whichGlobalBackup"), live(I));
		f.dot = live(I);
	}
	return f.dot;
});

// /obj/item/weapon/canvas/proc/attackby  (code/game/objects/structures/artstuff.dm:86)  may sleep
rt.def("/obj/item/weapon/canvas/proc/attackby", function* attackby(f: Frame) {
	let click_params: Value = null, pixX: Value = null, pixY: Value = null, masterpiece: Value = null, thePix: Value = null, Ico: Value = null, theOriginalPix: Value = null, C: Value = null;
	f.vars = () => [click_params, pixX, pixY, masterpiece, thePix, Ico, theOriginalPix, C];
	click_params = (yield* g.call(f, P("/proc/params2list"), null, [live(f.args[2])]));
	pixX = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-x")]));
	pixY = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(click_params), "icon-y")]));
	if (((!truthy(live(click_params)) || !truthy(rt.at(live(click_params), "icon-x"))) || !truthy(rt.at(live(click_params), "icon-y")))) {
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/soap")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass/rag")) ? 1 : 0)))) {
		masterpiece = (yield* g.call(f, P("/proc/icon"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_state")]));
		thePix = (yield* g.callName(f, live(masterpiece), "GetPixel", [live(pixX), live(pixY)]));
		if (!truthy((Ico = (yield* g.srcCall(f, "getGlobalBackup"))))) {
			yield* g.call(f, P("/proc/qdel"), null, [live(masterpiece)]);
			return live(f.dot);
		}
		theOriginalPix = (yield* g.callName(f, live(Ico), "GetPixel", [live(pixX), live(pixY)]));
		if (!isEqual(live(thePix), live(theOriginalPix))) {
			yield* g.srcCall(f, "DrawPixelOn", live(theOriginalPix), live(pixX), live(pixY));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(masterpiece)]);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0))) {
			yield* g.srcCall(f, "DrawPixelOn", rt.gv(f, "paint_color", (C = live(f.args[0]))), live(pixX), live(pixY));
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/item/weapon/canvas/proc/attack_self  (code/game/objects/structures/artstuff.dm:119)
rt.def("/obj/item/weapon/canvas/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let blank: Value = null;
	f.vars = () => [blank];
	if (!truthy(live(user))) {
		return live(f.dot);
	}
	if (!truthy((blank = rt.callSrc(f, "getGlobalBackup", [])))) return f.dot;
	rt.setSv(f, "icon", live(blank));
	rt.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ cleans the canvas.</span>", [live(user)]), "<span class='notice'>You clean the canvas.</span>"]);
	return f.dot;
});
