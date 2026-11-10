// Based on /tg/station's code/_onclick/hud/blob_overmind.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11085, "/obj/screen/blob", "/obj/screen", {
	icon: rt.rsc("icons/mob/blob.dmi"),
});

// blob_overmind.dm:6
rt.def("/obj/screen/blob/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	openToolTip(f.usr, this, params, { title: this.name, content: this.desc, theme: "blob" });
	return f.dot;
});

// blob_overmind.dm:9
rt.def("/obj/screen/blob/proc/MouseExited", function MouseExited(f: Frame) {
	closeToolTip(f.usr);
	return f.dot;
});

rt.type(11086, "/obj/screen/blob/BlobHelp", "/obj/screen/blob", {
	icon_state: "ui_help",
	name: "Blob Help",
	desc: "Help on playing blob!",
});

// blob_overmind.dm:17
rt.def("/obj/screen/blob/BlobHelp/proc/Click", function Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	(B = f.usr).blob_help();
	return f.dot;
});

rt.type(11087, "/obj/screen/blob/JumpToNode", "/obj/screen/blob", {
	icon_state: "ui_tonode",
	name: "Jump to Node",
	desc: "Moves your camera to a selected blob node.",
});

// blob_overmind.dm:27
rt.def("/obj/screen/blob/JumpToNode/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).jump_to_node();
	return f.dot;
}, true);

rt.type(11088, "/obj/screen/blob/JumpToCore", "/obj/screen/blob", {
	icon_state: "ui_tocore",
	name: "Jump to Core",
	desc: "Moves your camera to your blob core.",
});

// blob_overmind.dm:37
rt.def("/obj/screen/blob/JumpToCore/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let B: Value = null;
	if (this.hud && this.hud.mymob && rt.istype(this.hud.mymob, T("/mob/camera/blob"))) {
		if (!(B = this.hud.mymob).placed) {
			this.name = "Place Blob Core";
			this.desc = "Attempt to place your blob core at this location.";
		} else {
			this.name = rt.initial(f, this, "name");
			this.desc = rt.initial(f, this, "desc");
		}
	}
	parent_proc();
	return f.dot;
}, false);

// blob_overmind.dm:48
rt.def("/obj/screen/blob/JumpToCore/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	if (!(B = f.usr).placed) {
		yield* B.place_blob_core(B.base_point_rate, 0);
	}
	B.transport_core();
	return f.dot;
}, true);

rt.type(11089, "/obj/screen/blob/Blobbernaut", "/obj/screen/blob", {
	icon_state: "ui_blobbernaut",
	name: "Produce Blobbernaut (40)",
	desc: "Produces a strong, smart blobbernaut from a factory blob for 40 resources.<br>The factory blob used will become fragile and unable to produce spores.",
});

// blob_overmind.dm:60
rt.def("/obj/screen/blob/Blobbernaut/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).create_blobbernaut();
	return f.dot;
}, true);

rt.type(11090, "/obj/screen/blob/ResourceBlob", "/obj/screen/blob", {
	icon_state: "ui_resource",
	name: "Produce Resource Blob (40)",
	desc: "Produces a resource blob for 40 resources.<br>Resource blobs will give you resources every few seconds.",
});

// blob_overmind.dm:70
rt.def("/obj/screen/blob/ResourceBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).create_resource();
	return f.dot;
}, true);

rt.type(11091, "/obj/screen/blob/NodeBlob", "/obj/screen/blob", {
	icon_state: "ui_node",
	name: "Produce Node Blob (50)",
	desc: "Produces a node blob for 50 resources.<br>Node blobs will expand and activate nearby resource and factory blobs.",
});

// blob_overmind.dm:80
rt.def("/obj/screen/blob/NodeBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).create_node();
	return f.dot;
}, true);

rt.type(11092, "/obj/screen/blob/FactoryBlob", "/obj/screen/blob", {
	icon_state: "ui_factory",
	name: "Produce Factory Blob (60)",
	desc: "Produces a factory blob for 60 resources.<br>Factory blobs will produce spores every few seconds.",
});

// blob_overmind.dm:90
rt.def("/obj/screen/blob/FactoryBlob/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).create_factory();
	return f.dot;
}, true);

rt.type(11093, "/obj/screen/blob/ReadaptChemical", "/obj/screen/blob", {
	icon_state: "ui_chemswap",
	name: "Readapt Chemical (40)",
	desc: "Randomly rerolls your chemical for 40 resources.",
});

// blob_overmind.dm:100
rt.def("/obj/screen/blob/ReadaptChemical/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let B: Value = null;
	if (this.hud && this.hud.mymob && rt.istype(this.hud.mymob, T("/mob/camera/blob"))) {
		if ((B = this.hud.mymob).free_chem_rerolls) {
			this.name = "Readapt Chemical (FREE)";
			this.desc = "Randomly rerolls your chemical for free.";
		} else {
			this.name = rt.initial(f, this, "name");
			this.desc = rt.initial(f, this, "desc");
		}
	}
	parent_proc();
	return f.dot;
}, false);

// blob_overmind.dm:111
rt.def("/obj/screen/blob/ReadaptChemical/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).chemical_reroll();
	return f.dot;
}, true);

rt.type(11094, "/obj/screen/blob/RelocateCore", "/obj/screen/blob", {
	icon_state: "ui_swap",
	name: "Relocate Core (80)",
	desc: "Swaps a node and your core for 80 resources.",
});

// blob_overmind.dm:121
rt.def("/obj/screen/blob/RelocateCore/proc/Click", function* Click(f: Frame) {
	let B: Value = null;
	if (!rt.istype(f.usr, T("/mob/camera/blob"))) return f.dot;
	yield* (B = f.usr).relocate_core();
	return f.dot;
}, true);

rt.type(64, "/datum/hud/blob_overmind", "/datum/hud", {});

// blob_overmind.dm:126
rt.def("/datum/hud/blob_overmind/proc/New", function* New(f: Frame, owner: Value) {
	let using: Value = null;
	yield* parent_proc();
	this.blobpwrdisplay = (yield* new_(T("/obj/screen")));
	this.blobpwrdisplay.name = "blob power";
	this.blobpwrdisplay.icon_state = "block";
	this.blobpwrdisplay.screen_loc = "EAST-1:28,CENTER-1:15";
	this.blobpwrdisplay.mouse_opacity = 0;
	this.blobpwrdisplay.layer = ABOVE_HUD_LAYER;
	this.blobpwrdisplay.plane = ABOVE_HUD_PLANE;
	this.infodisplay += this.blobpwrdisplay;
	this.healths = (yield* new_(T("/obj/screen/healths/blob")));
	this.infodisplay += this.healths;
	(using = (yield* new_(T("/obj/screen/blob/BlobHelp")))).screen_loc = "WEST:6,NORTH:-3";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/JumpToNode")))).screen_loc = "WEST:6,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/JumpToCore")))).screen_loc = "EAST-1:28,SOUTH:5";
	using.hud = this;
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/Blobbernaut")))).screen_loc = "CENTER-3:14,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/ResourceBlob")))).screen_loc = "CENTER-2:14,SOUTH:5";
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/NodeBlob")))).screen_loc = ui_hand_position(2);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/FactoryBlob")))).screen_loc = ui_hand_position(1);
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/ReadaptChemical")))).screen_loc = "CENTER+1:18,SOUTH:5";
	using.hud = this;
	this.static_inventory += using;
	(using = (yield* new_(T("/obj/screen/blob/RelocateCore")))).screen_loc = "CENTER+2:20,SOUTH:5";
	this.static_inventory += using;
	return f.dot;
}, true);

// blob_overmind.dm:181
rt.def("/mob/camera/blob/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/blob_overmind"), this));
	return f.dot;
}, true);
