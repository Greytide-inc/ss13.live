// Based on /tg/station's code/game/mecha/mecha_control_console.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10418, "/obj/machinery/computer/mecha", "/obj/machinery/computer", {
	located: null,
	screen: 0,
	stored_data: null,
	icon_screen: "mecha",
	icon_keyboard: "tech_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/mecha_control"),
	name: "exosuit control console",
	desc: "Used to remotely locate or lockdown exosuits.",
	req_access: null,
});

// mecha_control_console.dm:8
rt.def("/obj/machinery/computer/mecha/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.located = list();

	this.req_access = list(29);
	return f.dot;
});

// mecha_control_console.dm:13
rt.def("/obj/machinery/computer/mecha/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let trackerlist: Value = null, MC: Value = null, TR: Value = null, answer: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = `<html><head><title>${this.name}</title><style>h3 {margin: 0px; padding: 0px;}</style></head><body>`;
	if (this.screen == 0) {
		dat += "<h3>Tracking beacons data</h3>";
		trackerlist = list();
		for (MC of each(GLOB.mechas_list, T("/obj/mecha"))) {
			trackerlist += MC.trackers;
		}
		for (TR of each(trackerlist, T("/obj/item/mecha_parts/mecha_tracking"))) {
			if (answer = TR.get_mecha_info()) {
				dat += fmt("<hr>＀<br/>\n\t\t\t\t\t\t  <a href='?src=＃;send_message=＃'>Send message</a><br/>\n\t\t\t\t\t\t  <a href='?src=＃;get_log=＃'>Show exosuit log</a> | <a style='color: #f00;' href='?src=＃;shock=＃'>(EMP pulse)</a><br>", [answer, this, TR, this, TR, this, TR]);
			}
		}
	}
	if (this.screen == 1) {
		dat += "<h3>Log contents</h3>";
		dat += fmt("<a href='?src=＃;return=1'>Return</a><hr>", [this]);
		dat += `${this.stored_data}`;
	}
	dat += fmt("<A href='?src=＃;refresh=1'>(Refresh)</A><BR>", [this]);
	dat += "</body></html>";
	rt.op(f, "Browse", [], [user, dat, "window=computer;size=400x500"], false);
	onclose(user, "computer");
	return f.dot;
}, true);

// mecha_control_console.dm:42
rt.def("/obj/machinery/computer/mecha/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let MT: Value = null, message: Value = null, M: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let filter: Value = (yield* new_(T("/datum/topic_input"), href, href_list));
	if (rt.at(href_list, "send_message")) {
		MT = filter.getObj("send_message");
		message = (yield* stripped_input(f.usr, "Input message", "Transmit message"));
		M = MT.in_mecha();
		if (trim(message) && M) {
			M.occupant_message(message);
		}
		return f.dot;
	}
	if (rt.at(href_list, "shock")) {
		yield* (MT = filter.getObj("shock")).shock();
	}
	if (rt.at(href_list, "get_log")) {
		this.stored_data = (MT = filter.getObj("get_log")).get_mecha_log();
		this.screen = 1;
	}
	if (rt.at(href_list, "return")) {
		this.screen = 0;
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(9557, "/obj/item/mecha_parts/mecha_tracking", "/obj/item/mecha_parts", {
	ai_beacon: 0,
	name: "exosuit tracking beacon",
	desc: "Device used to transmit exosuit data.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "motion2",
	w_class: 2,
	origin_tech: "programming=2;magnets=2",
});

// mecha_control_console.dm:74
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/get_mecha_info", function get_mecha_info(f: Frame) {
	let RM: Value = null;
	let $2: any;
	if (!this.in_mecha()) {
		return 0;
	}
	let M: Value = this.loc;
	let cell_charge: Value = M.get_charge();
	let $0: any = M.name;
	let $1: any = M.obj_integrity / M.max_integrity * 100;
	if (cell_charge === null) {
		$2 = "Not found";
	} else {
		$2 = `${M.cell.percent()}%`;
	}
	let answer: Value = `<b>Name:</b> ${$0}\n<b>Integrity:</b> ${$1}%\n<b>Cell charge:</b> ${$2}\n<b>Airtank:</b> ${M.return_pressure()}kPa\n<b>Pilot:</b> ${(M.occupant || "None")}\n<b>Location:</b> ${(get_area(M) || "Unknown")}\n<b>Active equipment:</b> ${(M.selected || "None")} `;
	if (rt.istype(M, T("/obj/mecha/working/ripley"))) {
		answer += `<b>Used cargo space:</b> ${rt.len(f, (RM = M).cargo) / RM.cargo_capacity * 100}%<br>`;
	}
	return answer;
});

// mecha_control_console.dm:92
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/emp_act", function* emp_act(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

// mecha_control_console.dm:95
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null;
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		M = this.loc;
		if (rt.isIn(f, this, M.trackers)) {
			M.trackers -= this;
		}
	}
	return (yield* parent_proc());
}, true);

// mecha_control_console.dm:102
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/in_mecha", function in_mecha(f: Frame) {
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		return this.loc;
	}
	return 0;
});

// mecha_control_console.dm:107
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/shock", function* shock(f: Frame) {
	let M: Value = null;
	if (M = this.in_mecha()) {
		yield* M.emp_act(2);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// mecha_control_console.dm:113
rt.def("/obj/item/mecha_parts/mecha_tracking/proc/get_mecha_log", function get_mecha_log(f: Frame) {
	let M: Value = null;
	if (!rt.istype(this.loc, T("/obj/mecha"))) {
		return 0;
	}
	return (M = this.loc).get_log_html();
});

rt.type(5333, "/obj/item/weapon/storage/box/mechabeacons", "/obj/item/weapon/storage/box", {
	name: "exosuit tracking beacons",
});

// mecha_control_console.dm:130
rt.def("/obj/item/weapon/storage/box/mechabeacons/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	yield* new_(T("/obj/item/mecha_parts/mecha_tracking"), this);
	return f.dot;
}, true);
