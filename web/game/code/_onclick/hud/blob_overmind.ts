// From code/_onclick/hud/blob_overmind.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11085, "/obj/screen/blob", "/obj/screen", {
	icon: rt.rsc("icons/mob/blob.dmi"),
});

// /obj/screen/blob/proc/MouseEntered  (code/_onclick/hud/blob_overmind.dm:6)
rt.def("/obj/screen/blob/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	rt.call(f, P("/proc/openToolTip"), null, [null, live(f.usr), null, live(f.src), null, live(params), "title", rt.sv(f, "name"), "content", rt.sv(f, "desc"), "theme", "blob"], rt.Args.Named);
	return f.dot;
});

// /obj/screen/blob/proc/MouseExited  (code/_onclick/hud/blob_overmind.dm:9)
rt.def("/obj/screen/blob/proc/MouseExited", function MouseExited(f: Frame) {
	rt.call(f, P("/proc/closeToolTip"), null, [live(f.usr)]);
	return f.dot;
});

rt.type(11086, "/obj/screen/blob/BlobHelp", "/obj/screen/blob", {
	icon_state: "ui_help",
	name: "Blob Help",
	desc: "Help on playing blob!",
});

// /obj/screen/blob/BlobHelp/proc/Click  (code/_onclick/hud/blob_overmind.dm:17)
rt.def("/obj/screen/blob/BlobHelp/proc/Click", function Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	rt.callName(f, (B = live(f.usr)), "blob_help", []);
	return f.dot;
});

rt.type(11087, "/obj/screen/blob/JumpToNode", "/obj/screen/blob", {
	icon_state: "ui_tonode",
	name: "Jump to Node",
	desc: "Moves your camera to a selected blob node.",
});

// /obj/screen/blob/JumpToNode/proc/Click  (code/_onclick/hud/blob_overmind.dm:27)  may sleep
rt.def("/obj/screen/blob/JumpToNode/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "jump_to_node", []);
	return f.dot;
}, true);

rt.type(11088, "/obj/screen/blob/JumpToCore", "/obj/screen/blob", {
	icon_state: "ui_tocore",
	name: "Jump to Core",
	desc: "Moves your camera to your blob core.",
});

// /obj/screen/blob/JumpToCore/proc/MouseEntered  (code/_onclick/hud/blob_overmind.dm:37)
rt.def("/obj/screen/blob/JumpToCore/proc/MouseEntered", function MouseEntered(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (((truthy(rt.sv(f, "hud")) && truthy(rt.fv(f, "mymob", rt.sv(f, "hud")))) && truthy((rt.istype(rt.fv(f, "mymob", rt.sv(f, "hud")), T("/mob/camera/blob")) ? 1 : 0)))) {
		if (!truthy(rt.gv(f, "placed", (B = rt.fv(f, "mymob", rt.sv(f, "hud")))))) {
			rt.setSv(f, "name", "Place Blob Core");
			rt.setSv(f, "desc", "Attempt to place your blob core at this location.");
		} else {
			rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
			rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

// /obj/screen/blob/JumpToCore/proc/Click  (code/_onclick/hud/blob_overmind.dm:48)  may sleep
rt.def("/obj/screen/blob/JumpToCore/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.gv(f, "placed", (B = live(f.usr))))) {
		yield* g.callName(f, live(B), "place_blob_core", [rt.fv(f, "base_point_rate", live(B)), 0]);
	}
	yield* g.callName(f, live(B), "transport_core", []);
	return f.dot;
}, true);

rt.type(11089, "/obj/screen/blob/Blobbernaut", "/obj/screen/blob", {
	icon_state: "ui_blobbernaut",
	name: "Produce Blobbernaut (40)",
	desc: "Produces a strong, smart blobbernaut from a factory blob for 40 resources.<br>The factory blob used will become fragile and unable to produce spores.",
});

// /obj/screen/blob/Blobbernaut/proc/Click  (code/_onclick/hud/blob_overmind.dm:60)  may sleep
rt.def("/obj/screen/blob/Blobbernaut/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "create_blobbernaut", []);
	return f.dot;
}, true);

rt.type(11090, "/obj/screen/blob/ResourceBlob", "/obj/screen/blob", {
	icon_state: "ui_resource",
	name: "Produce Resource Blob (40)",
	desc: "Produces a resource blob for 40 resources.<br>Resource blobs will give you resources every few seconds.",
});

// /obj/screen/blob/ResourceBlob/proc/Click  (code/_onclick/hud/blob_overmind.dm:70)  may sleep
rt.def("/obj/screen/blob/ResourceBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "create_resource", []);
	return f.dot;
}, true);

rt.type(11091, "/obj/screen/blob/NodeBlob", "/obj/screen/blob", {
	icon_state: "ui_node",
	name: "Produce Node Blob (50)",
	desc: "Produces a node blob for 50 resources.<br>Node blobs will expand and activate nearby resource and factory blobs.",
});

// /obj/screen/blob/NodeBlob/proc/Click  (code/_onclick/hud/blob_overmind.dm:80)  may sleep
rt.def("/obj/screen/blob/NodeBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "create_node", []);
	return f.dot;
}, true);

rt.type(11092, "/obj/screen/blob/FactoryBlob", "/obj/screen/blob", {
	icon_state: "ui_factory",
	name: "Produce Factory Blob (60)",
	desc: "Produces a factory blob for 60 resources.<br>Factory blobs will produce spores every few seconds.",
});

// /obj/screen/blob/FactoryBlob/proc/Click  (code/_onclick/hud/blob_overmind.dm:90)  may sleep
rt.def("/obj/screen/blob/FactoryBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "create_factory", []);
	return f.dot;
}, true);

rt.type(11093, "/obj/screen/blob/ReadaptChemical", "/obj/screen/blob", {
	icon_state: "ui_chemswap",
	name: "Readapt Chemical (40)",
	desc: "Randomly rerolls your chemical for 40 resources.",
});

// /obj/screen/blob/ReadaptChemical/proc/MouseEntered  (code/_onclick/hud/blob_overmind.dm:100)
rt.def("/obj/screen/blob/ReadaptChemical/proc/MouseEntered", function MouseEntered(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (((truthy(rt.sv(f, "hud")) && truthy(rt.fv(f, "mymob", rt.sv(f, "hud")))) && truthy((rt.istype(rt.fv(f, "mymob", rt.sv(f, "hud")), T("/mob/camera/blob")) ? 1 : 0)))) {
		if (truthy(rt.gv(f, "free_chem_rerolls", (B = rt.fv(f, "mymob", rt.sv(f, "hud")))))) {
			rt.setSv(f, "name", "Readapt Chemical (FREE)");
			rt.setSv(f, "desc", "Randomly rerolls your chemical for free.");
		} else {
			rt.setSv(f, "name", rt.initial(f, live(f.src), "name"));
			rt.setSv(f, "desc", rt.initial(f, live(f.src), "desc"));
		}
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["location", "control", "params"] });

// /obj/screen/blob/ReadaptChemical/proc/Click  (code/_onclick/hud/blob_overmind.dm:111)  may sleep
rt.def("/obj/screen/blob/ReadaptChemical/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "chemical_reroll", []);
	return f.dot;
}, true);

rt.type(11094, "/obj/screen/blob/RelocateCore", "/obj/screen/blob", {
	icon_state: "ui_swap",
	name: "Relocate Core (80)",
	desc: "Swaps a node and your core for 80 resources.",
});

// /obj/screen/blob/RelocateCore/proc/Click  (code/_onclick/hud/blob_overmind.dm:121)  may sleep
rt.def("/obj/screen/blob/RelocateCore/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (!truthy((rt.istype(live(f.usr), T("/mob/camera/blob")) ? 1 : 0))) return f.dot;
	yield* g.callName(f, (B = live(f.usr)), "relocate_core", []);
	return f.dot;
}, true);

rt.type(64, "/datum/hud/blob_overmind", "/datum/hud", {});

// /datum/hud/blob_overmind/proc/New  (code/_onclick/hud/blob_overmind.dm:126)  may sleep
rt.def("/datum/hud/blob_overmind/proc/New", function* New(f: Frame) {
	let using: Value = null;
	f.vars = () => [using];
	yield* g.callSuper(f, [], rt.Args.Same);
	using = null;
	rt.setSv(f, "blobpwrdisplay", (yield* g.new_(f, T("/obj/screen"), [])));
	rt.setFv(f, "name", rt.sv(f, "blobpwrdisplay"), "blob power");
	rt.setFv(f, "icon_state", rt.sv(f, "blobpwrdisplay"), "block");
	rt.setFv(f, "screen_loc", rt.sv(f, "blobpwrdisplay"), "EAST-1:28,CENTER-1:15");
	rt.setFv(f, "mouse_opacity", rt.sv(f, "blobpwrdisplay"), 0);
	rt.setFv(f, "layer", rt.sv(f, "blobpwrdisplay"), 20);
	rt.setFv(f, "plane", rt.sv(f, "blobpwrdisplay"), 20);
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "blobpwrdisplay"), add);
	rt.setSv(f, "healths", (yield* g.new_(f, T("/obj/screen/healths/blob"), [])));
	rt.modSrcVar(f, "infodisplay", rt.sv(f, "healths"), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/BlobHelp"), []))), "WEST:6,NORTH:-3");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/JumpToNode"), []))), "WEST:6,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/JumpToCore"), []))), "EAST-1:28,SOUTH:5");
	rt.setFv(f, "hud", live(using), live(f.src));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/Blobbernaut"), []))), "CENTER-3:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/ResourceBlob"), []))), "CENTER-2:14,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/NodeBlob"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [2])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/FactoryBlob"), []))), (yield* g.call(f, P("/proc/ui_hand_position"), null, [1])));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/ReadaptChemical"), []))), "CENTER+1:18,SOUTH:5");
	rt.setFv(f, "hud", live(using), live(f.src));
	rt.modSrcVar(f, "static_inventory", live(using), add);
	rt.setFv(f, "screen_loc", (using = (yield* g.new_(f, T("/obj/screen/blob/RelocateCore"), []))), "CENTER+2:20,SOUTH:5");
	rt.modSrcVar(f, "static_inventory", live(using), add);
	return f.dot;
}, true, { args: ["owner"] });

// /mob/camera/blob/proc/create_mob_hud  (code/_onclick/hud/blob_overmind.dm:181)  may sleep
rt.def("/mob/camera/blob/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(truthy(rt.sv(f, "client")) && !truthy(rt.sv(f, "hud_used")))) return f.dot;
	rt.setSv(f, "hud_used", (yield* g.new_(f, T("/datum/hud/blob_overmind"), [live(f.src)])));
	return f.dot;
}, true);
