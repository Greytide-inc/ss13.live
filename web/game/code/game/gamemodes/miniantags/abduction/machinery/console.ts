// Based on /tg/station's code/game/gamemodes/miniantags/abduction/machinery/console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10438, "/obj/machinery/abductor/console", "/obj/machinery/abductor", {
	gizmo: null,
	vest: null,
	experiment: null,
	pad: null,
	camera: null,
	disguises: null,
	anchored: 1,
	name: "abductor console",
	desc: "Ship command center.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "console",
	density: 1,
});

// console.dm:21
rt.def("/obj/machinery/abductor/console/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.disguises = list();
	return f.dot;
});

// console.dm:24
rt.def("/obj/machinery/abductor/console/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let points: Value = null, credits: Value = null, mode: Value = null, popup: Value = null;
	let $0: any, $1: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!is_species(user, T("/datum/species/abductor"))) {
		to_chat(user, "<span class='warning'>You start mashing alien buttons at random!</span>");
		if (yield* do_after(user, 100, { target: this })) {
			yield* this.TeleporterSend();
		}
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	dat += "<H3> Abductsoft 3000 </H3>";
	if (this.experiment) {
		points = this.experiment.points;
		credits = this.experiment.credits;
		dat += `Collected Samples : ${points} <br>`;
		dat += `Gear Credits: ${credits} <br>`;
		dat += "<b>Transfer data in exchange for supplies:</b><br>";
		dat += fmt("<a href='?src=＃;dispense=baton'>Advanced Baton</A><br>", [this]);
		dat += fmt("<a href='?src=＃;dispense=helmet'>Agent Helmet</A><br>", [this]);
		dat += fmt("<a href='?src=＃;dispense=vest'>Agent Vest</A><br>", [this]);
		dat += fmt("<a href='?src=＃;dispense=silencer'>Radio Silencer</A><br>", [this]);
		dat += fmt("<a href='?src=＃;dispense=tool'>Science Tool</A><br>", [this]);
	} else {
		dat += "<span class='bad'>NO EXPERIMENT MACHINE DETECTED</span> <br>";
	}
	if (this.pad) {
		dat += "<span class='bad'>Emergency Teleporter System.</span>";
		dat += "<span class='bad'>Consider using primary observation console first.</span>";
		dat += fmt("<a href='?src=＃;teleporter_send=1'>Activate Teleporter</A><br>", [this]);
		if (this.gizmo && this.gizmo.marked) {
			dat += fmt("<a href='?src=＃;teleporter_retrieve=1'>Retrieve Mark</A><br>", [this]);
		} else {
			dat += "<span class='linkOff'>Retrieve Mark</span><br>";
		}
	} else {
		dat += "<span class='bad'>NO TELEPAD DETECTED</span></br>";
	}
	if (this.vest) {
		dat += "<h4> Agent Vest Mode </h4><br>";
		if ((mode = this.vest.mode) == VEST_STEALTH) {
			dat += fmt("<a href='?src=＃;flip_vest=1'>Combat</A>", [this]);
			dat += "<span class='linkOff'>Stealth</span>";
		} else {
			dat += "<span class='linkOff'>Combat</span>";
			dat += fmt("<a href='?src=＃;flip_vest=1'>Stealth</A>", [this]);
		}
		dat += "<br>";
		dat += fmt("<a href='?src=＃;select_disguise=1'>Select Agent Vest Disguise</a><br>", [this]);
		$0 = this;
		if (rt.bitAnd(this.vest.flags, NODROP)) {
			$1 = "Unlock";
		} else {
			$1 = "Lock";
		}
		dat += fmt("<a href='?src=＃;toggle_vest=1'>＀ Vest</a><br>", [$0, $1]);
	} else {
		dat += "<span class='bad'>NO AGENT VEST DETECTED</span>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Abductor Console", 400, 500))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// console.dm:80
rt.def("/obj/machinery/abductor/console/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "teleporter_send")) {
		yield* this.TeleporterSend();
	} else if (rt.at(href_list, "teleporter_retrieve")) {
		yield* this.TeleporterRetrieve();
	} else if (rt.at(href_list, "flip_vest")) {
		yield* this.FlipVest();
	} else if (rt.at(href_list, "toggle_vest")) {
		if (this.vest) {
			this.vest.toggle_nodrop();
		}
	} else if (rt.at(href_list, "select_disguise")) {
		yield* this.SelectDisguise();
	} else if (rt.at(href_list, "dispense")) {
		const item = rt.at(href_list, "dispense");
		if (item === "baton") {
			yield* this.Dispense(T("/obj/item/weapon/abductor_baton"), { cost: 2 });
		} else if (item === "helmet") {
			yield* this.Dispense(T("/obj/item/clothing/head/helmet/abductor"));
		} else if (item === "silencer") {
			yield* this.Dispense(T("/obj/item/device/abductor/silencer"));
		} else if (item === "tool") {
			yield* this.Dispense(T("/obj/item/device/abductor/gizmo"));
		} else if (item === "vest") {
			yield* this.Dispense(T("/obj/item/clothing/suit/armor/abductor/vest"));
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// console.dm:110
rt.def("/obj/machinery/abductor/console/proc/TeleporterRetrieve", function* TeleporterRetrieve(f: Frame) {
	if (!(this.pad && this.gizmo && this.gizmo.marked)) return f.dot;
	yield* this.pad.Retrieve(this.gizmo.marked);
	return f.dot;
}, true);

// console.dm:115
rt.def("/obj/machinery/abductor/console/proc/TeleporterSend", function* TeleporterSend(f: Frame) {
	if (!this.pad) return f.dot;
	yield* this.pad.Send();
	return f.dot;
}, true);

// console.dm:119
rt.def("/obj/machinery/abductor/console/proc/FlipVest", function* FlipVest(f: Frame) {
	if (!this.vest) return f.dot;
	yield* this.vest.flip_mode();
	return f.dot;
}, true);

// console.dm:122
rt.def("/obj/machinery/abductor/console/proc/SelectDisguise", function* SelectDisguise(f: Frame, remote: Value) {
	let chosen: Value = null;
	remote ??= 0;
	let entry_name: Value = (yield* g.op(f, "Prompt", [1], [null, null, "Disguise", "Choose Disguise", this.disguises]));
	if (!((chosen = rt.index(this.disguises, entry_name)) && this.vest && (remote || get_dist(f.usr, this) <= 1))) return f.dot;
	this.vest.SetDisguise(chosen);
	return f.dot;
}, true);

// console.dm:128
rt.def("/obj/machinery/abductor/console/proc/SetDroppoint", function SetDroppoint(f: Frame, location: Value, user: Value) {
	if (!rt.istype(location, T("/turf/open"))) {
		to_chat(user, "<span class='warning'>That place is not safe for the specimen.</span>");
		return f.dot;
	}
	if (!this.pad) return f.dot;
	this.pad.teleport_target = location;
	to_chat(user, "<span class='notice'>Location marked as test subject release point.</span>");
	return f.dot;
});

// console.dm:138
rt.def("/obj/machinery/abductor/console/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// console.dm:142
rt.def("/obj/machinery/abductor/console/proc/LateInitialize", function LateInitialize(f: Frame) {
	let p: Value = null, e: Value = null, c: Value = null;
	if (!this.team) {
		return f.dot;
	}
	for (p of each(GLOB.machines, T("/obj/machinery/abductor/pad"))) {
		if (p.team == this.team) {
			this.pad = p;
			break;
		}
	}
	for (e of each(GLOB.machines, T("/obj/machinery/abductor/experiment"))) {
		if (e.team == this.team) {
			this.experiment = e;
			e.console = this;
		}
	}
	for (c of each(GLOB.machines, T("/obj/machinery/computer/camera_advanced/abductor"))) {
		if (c.team == this.team) {
			this.camera = c;
			c.console = this;
		}
	}
	return f.dot;
});

// console.dm:161
rt.def("/obj/machinery/abductor/console/proc/AddSnapshot", function AddSnapshot(f: Frame, target: Value) {
	let entry: Value = null;
	(entry = new_(T("/datum/icon_snapshot"))).name = target.name;
	entry.icon = target.icon;
	entry.icon_state = target.icon_state;
	entry.overlays = target.get_overlays_copy(list(HANDS_LAYER));
	if (rt.index(this.disguises, entry.name)) {
		rt.setAt(this.disguises, entry.name, entry);
		return f.dot;
	}
	rt.setAt(this.disguises, entry.name, entry);
	return f.dot;
});

// console.dm:173
rt.def("/obj/machinery/abductor/console/proc/AddGizmo", function AddGizmo(f: Frame, G: Value) {
	if (G == this.gizmo && G.console == this) {
		return 0;
	}
	if (G.console) {
		G.console.gizmo = null;
	}
	this.gizmo = G;
	G.console = this;
	return 1;
});

// console.dm:184
rt.def("/obj/machinery/abductor/console/proc/AddVest", function AddVest(f: Frame, V: Value) {
	let C: Value = null;
	if (this.vest == V) {
		return 0;
	}
	for (C of each(GLOB.machines, T("/obj/machinery/abductor/console"))) {
		if (C.vest == V) {
			C.vest = null;
			break;
		}
	}
	this.vest = V;
	return 1;
});

// console.dm:196
rt.def("/obj/machinery/abductor/console/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/device/abductor/gizmo")) && this.AddGizmo(O)) {
		to_chat(user, "<span class='notice'>You link the tool to the console.</span>");
	} else if (rt.istype(O, T("/obj/item/clothing/suit/armor/abductor/vest")) && this.AddVest(O)) {
		to_chat(user, "<span class='notice'>You link the vest to the console.</span>");
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// console.dm:206
rt.def("/obj/machinery/abductor/console/proc/Dispense", function* Dispense(f: Frame, item: Value, cost: Value) {
	let drop_location: Value = null;
	cost ??= 1;
	if (this.experiment && this.experiment.credits >= cost) {
		this.experiment.credits -= cost;
		yield* this.say("Incoming supply!");
		drop_location = this.loc;
		if (this.pad) {
			flick("alien-pad", this.pad);
			drop_location = this.pad.loc;
		}
		yield* new_(item, drop_location);
	} else {
		yield* this.say("Insufficent data!");
	}
	return f.dot;
}, true);
