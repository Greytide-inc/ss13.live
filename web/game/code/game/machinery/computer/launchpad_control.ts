// Based on /tg/station's code/game/machinery/computer/launchpad_control.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10382, "/obj/machinery/computer/launchpad", "/obj/machinery/computer", {
	sending: 1,
	current_pad: null,
	launchpads: null,
	maximum_pads: 4,
	icon_screen: "teleport",
	icon_keyboard: "teleport_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/launchpad_console"),
	name: "１Launchpad Control Console",
	desc: "Used to teleport objects to and from a launchpad.",
});

// launchpad_control.dm:13
rt.def("/obj/machinery/computer/launchpad/proc/Initialize", function* Initialize(f: Frame) {
	this.launchpads = list();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// launchpad_control.dm:17
rt.def("/obj/machinery/computer/launchpad/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	to_chat(user, "<span class='warning'>You are too primitive to use this computer!</span>");
	return f.dot;
});

// launchpad_control.dm:21
rt.def("/obj/machinery/computer/launchpad/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if ((M = W).buffer && rt.istype(M.buffer, T("/obj/machinery/launchpad"))) {
			if (rt.length(this.launchpads) < this.maximum_pads) {
				(rt.modSrcVar(f, "launchpads", M.buffer, rt.bitOr));
				M.buffer = null;
				to_chat(user, `<span class='notice'>You upload the data from the ${W.name}'s buffer.</span>`);
			} else {
				to_chat(user, `<span class='warning'>${this} cannot handle any more connections!</span>`);
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// launchpad_control.dm:34
rt.def("/obj/machinery/computer/launchpad/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// launchpad_control.dm:37
rt.def("/obj/machinery/computer/launchpad/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// launchpad_control.dm:42
rt.def("/obj/machinery/computer/launchpad/proc/pad_exists", function pad_exists(f: Frame, number: Value) {
	let pad: Value = null;
	if (!(pad = rt.index(this.launchpads, number)) || pad.gc_destroyed) {
		return 0;
	}
	return 1;
});

// launchpad_control.dm:48
rt.def("/obj/machinery/computer/launchpad/proc/get_pad", function get_pad(f: Frame, number: Value) {
	let pad: Value = null;
	return (pad = rt.index(this.launchpads, number));
});

// launchpad_control.dm:52
rt.def("/obj/machinery/computer/launchpad/proc/interact", function* interact(f: Frame, user: Value) {
	let i: Value = null, pad: Value = null, pad_1: Value = null, popup: Value = null;
	let $e: any;
	let t: Value = list();
	if (!rt.length(this.launchpads)) {
		this.in_use = 0;
		t += "<div class='statusDisplay'>No launchpad located.</div><BR>";
	} else {
		rt.forRange(f, 0, 1, rt.length(this.launchpads), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (this.pad_exists(i)) {
				if (rt.bitAnd((pad = this.get_pad(i)).stat, 2)) {
					t += `<span class='linkOff'>${pad.display_name}</span>`;
				} else {
					t += fmt("<A href='?src=＃;choose_pad=1;pad=＀'>＀</A>", [this, i, pad.display_name]);
				}
			} else {
				this.launchpads -= this.get_pad(i);
			}
		}
		rt.endFor(f, 0);
		t += "<BR>";
		if (this.current_pad) {
			t += `<div class='statusDisplay'><b>${(pad_1 = this.get_pad(this.current_pad)).display_name}</b></div>`;
			t += fmt("<A href='?src=＃;change_name=1;pad=＀'>Rename</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;remove=1;pad=＀'>Remove</A><BR><BR>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;raisey=1;lowerx=1;pad=＀'>O</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;raisey=1;pad=＀'>^</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;raisey=1;raisex=1;pad=＀'>O</A><BR>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;lowerx=1;pad=＀'><</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;reset=1;pad=＀'>R</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;raisex=1;pad=＀'>></A><BR>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;lowery=1;lowerx=1;pad=＀'>O</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;lowery=1;pad=＀'>v</A>", [this, this.current_pad]);
			t += fmt("<A href='?src=＃;lowery=1;raisex=1;pad=＀'>O</A><BR>", [this, this.current_pad]);
			t += "<BR>";
			t += "<div class='statusDisplay'>Current offset:</div><BR>";
			t += `<div class='statusDisplay'>${rt.op(f, "Abs", [], [pad_1.y_offset])} ${pad_1.y_offset > 0 ? "N" : "S"}</div><BR>`;
			t += `<div class='statusDisplay'>${rt.op(f, "Abs", [], [pad_1.x_offset])} ${pad_1.x_offset > 0 ? "E" : "W"}</div><BR>`;
			t += fmt("<BR><A href='?src=＃;launch=1;pad=＀'>Launch</A>", [this, this.current_pad]);
			t += fmt(" <A href='?src=＃;pull=1;pad=＀'>Pull</A>", [this, this.current_pad]);
		}
	}
	(popup = (yield* new_(T("/datum/browser"), user, "launchpad", this.name, 300, 500))).set_content(t.Join());
	yield* popup.open();
	return f.dot;
}, true);

// launchpad_control.dm:95
rt.def("/obj/machinery/computer/launchpad/proc/teleport", function* teleport(f: Frame, user: Value, pad: Value) {
	if (!pad || pad.gc_destroyed) {
		to_chat(user, "<span class='warning'>ERROR: Launchpad not responding. Check launchpad integrity.</span>");
		return f.dot;
	}
	if (!pad.isAvailable()) {
		to_chat(user, "<span class='warning'>ERROR: Launchpad not operative. Make sure the launchpad is ready and powered.</span>");
		return f.dot;
	}
	yield* pad.doteleport(user, this.sending);
	return f.dot;
}, true);

// launchpad_control.dm:105
rt.def("/obj/machinery/computer/launchpad/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let pad: Value = null, new_name: Value = null;
	if (rt.at(href_list, "pad")) {
		pad = this.get_pad(text2num(rt.at(href_list, "pad")));
	}
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.length(this.launchpads)) {
		yield* this.updateDialog();
		return f.dot;
	}
	if (rt.at(href_list, "choose_pad")) {
		this.current_pad = text2num(rt.at(href_list, "pad"));
	}
	if (rt.at(href_list, "raisex")) {
		if (pad.x_offset < pad.range) {
			pad.x_offset++;
		}
	}
	if (rt.at(href_list, "lowerx")) {
		if (pad.x_offset > pad.range * -1) {
			pad.x_offset--;
		}
	}
	if (rt.at(href_list, "raisey")) {
		if (pad.y_offset < pad.range) {
			pad.y_offset++;
		}
	}
	if (rt.at(href_list, "lowery")) {
		if (pad.y_offset > pad.range * -1) {
			pad.y_offset--;
		}
	}
	if (rt.at(href_list, "reset")) {
		pad.y_offset = 0;
		pad.x_offset = 0;
	}
	if (rt.at(href_list, "change_name")) {
		if (!(new_name = (yield* stripped_input(f.usr, "What do you wish to name the launchpad?", "Launchpad", pad.display_name, 15)))) {
			return f.dot;
		}
		pad.display_name = new_name;
	}
	if (rt.at(href_list, "remove")) {
		if (f.usr && (yield* alert(f.usr, "Are you sure?", "Remove Launchpad", "I'm Sure", "Abort")) != "Abort") {
			this.launchpads -= pad;
		}
	}
	if (rt.at(href_list, "launch")) {
		this.sending = 1;
		yield* this.teleport(f.usr, pad);
	}
	if (rt.at(href_list, "pull")) {
		this.sending = 0;
		yield* this.teleport(f.usr, pad);
	}
	yield* this.updateDialog();
	return f.dot;
}, true);
