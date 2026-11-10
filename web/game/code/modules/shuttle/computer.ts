// Based on /tg/station's code/modules/shuttle/computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10389, "/obj/machinery/computer/shuttle", "/obj/machinery/computer", {
	shuttleId: null,
	possible_destinations: "",
	admin_controlled: null,
	no_destination_swap: 0,
	icon_screen: "shuttle",
	icon_keyboard: "tech_key",
	light_color: "#7DE1E1",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/shuttle"),
	name: "Shuttle Console",
	req_access: null,
});

// computer.dm:6
rt.def("/obj/machinery/computer/shuttle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list();
	return f.dot;
});

// computer.dm:14
rt.def("/obj/machinery/computer/shuttle/proc/Initialize", function* Initialize(f: Frame, mapload: Value, C: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(C, T("/obj/item/weapon/circuitboard/computer/shuttle"))) return f.dot;
	this.possible_destinations = C.possible_destinations;
	this.shuttleId = C.shuttleId;
	return f.dot;
}, true);

// computer.dm:20
rt.def("/obj/machinery/computer/shuttle/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let destination_found: Value = null, S: Value = null, popup: Value = null;
	let $0: any, $2: any, $e: any;
	if (yield* parent_proc(user)) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	let options: Value = params2list(this.possible_destinations);
	let M: Value = GLOB.SSshuttle.getShuttle(this.shuttleId);
	let dat: Value = `Status: ${M ? M.getStatusText() : "*Missing*"}<br><br>`;
	if (M) {
		for (S of each(GLOB.SSshuttle.stationary, T("/obj/docking_port/stationary"))) {
			if (!options.Find(S.id)) {
				continue;
			}
			if (!M.check_dock(S)) {
				continue;
			}
			destination_found = 1;
			dat += fmt("<A href='?src=＃;move=＀'>Send to ＀</A><br>", [this, S.id, S.name]);
		}
		if (!destination_found) {
			dat += "<B>Shuttle Locked</B><br>";
			if (this.admin_controlled) {
				dat += "Authorized personnel only<br>";
				dat += fmt("<A href='?src=＃;request=1]'>Request Authorization</A><br>", [this]);
			}
		}
	}
	dat += fmt("<a href='?src=＃;mach_close=computer'>Close</a>", [user]);
	$0 = user;
	let $1: any = "computer";
	if (M) {
		$2 = M.name;
	} else {
		$2 = "shuttle";
	}
	(popup = (yield* new_(T("/datum/browser"), $0, $1, $2, 300, 200))).set_content(`<center>${dat}</center>`);
	popup.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// computer.dm:49
rt.def("/obj/machinery/computer/shuttle/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let M: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	yield* this.add_fingerprint(f.usr);
	if (!(yield* this.allowed(f.usr))) {
		to_chat(f.usr, "<span class='danger'>Access denied.</span>");
		return f.dot;
	}
	if (!rt.at(href_list, "move")) return f.dot;
	if ((M = GLOB.SSshuttle.getShuttle(this.shuttleId)).launch_status == ENDGAME_LAUNCHED) {
		to_chat(f.usr, "<span class='warning'>You've already escaped. Never going back to that place again!</span>");
		return f.dot;
	}
	if (this.no_destination_swap) {
		if (M.mode != "idle") {
			to_chat(f.usr, "<span class='warning'>Shuttle already in transit.</span>");
			return f.dot;
		}
	}
	const subject = (yield* GLOB.SSshuttle.moveShuttle(this.shuttleId, rt.at(href_list, "move"), 1));
	if (subject === 0) {
		yield* this.say("Shuttle departing. Please stand away from the doors.");
	} else if (subject === 1) {
		to_chat(f.usr, "<span class='warning'>Invalid shuttle requested.</span>");
	} else {
		to_chat(f.usr, "<span class='notice'>Unable to comply.</span>");
	}
	return f.dot;
}, true);

// computer.dm:75
rt.def("/obj/machinery/computer/shuttle/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.req_access = list();
	this.emagged = 1;
	to_chat(user, "<span class='notice'>You fried the consoles ID checking system.</span>");
	return f.dot;
});
