// Based on /tg/station's code/game/machinery/telecomms/computers/telemonitor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10416, "/obj/machinery/computer/telecomms/monitor", "/obj/machinery/computer/telecomms", {
	screen: 0,
	machinelist: null,
	SelectedMachine: null,
	network: "NULL",
	temp: "",
	icon_screen: "comm_monitor",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_monitor"),
	name: "telecommunications monitoring console",
});

// telemonitor.dm:13
rt.def("/obj/machinery/computer/telecomms/monitor/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.machinelist = list();
	return f.dot;
});

// telemonitor.dm:22
rt.def("/obj/machinery/computer/telecomms/monitor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _T: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "<TITLE>Telecommunications Monitor</TITLE><center><b>Telecommunications Monitor</b></center>";
	if (this.screen === 0) {
		dat += `<br>${this.temp}<br><br>`;
		dat += fmt("<br>Current Network: <a href='?src=＃;network=1'>＀</a><br>", [this, this.network]);
		if (rt.len(f, this.machinelist)) {
			dat += "<br>Detected Network Entities:<ul>";
			for (_T of each(this.machinelist, T("/obj/machinery/telecomms"))) {
				dat += fmt("<li><a href='?src=＃;viewmachine=＀'>＃ ＀</a> (＀)</li>", [this, _T.id, _T, _T.name, _T.id]);
			}
			dat += "</ul>";
			dat += fmt("<br><a href='?src=＃;operation=release'>[Flush Buffer]</a>", [this]);
		} else {
			dat += fmt("<a href='?src=＃;operation=probe'>[Probe Network]</a>", [this]);
		}
	} else if (this.screen === 1) {
		dat += `<br>${this.temp}<br>`;
		dat += fmt("<center><a href='?src=＃;operation=mainmenu'>[Main Menu]</a></center>", [this]);
		dat += `<br>Current Network: ${this.network}<br>`;
		dat += `Selected Network Entity: ${this.SelectedMachine.name} (${this.SelectedMachine.id})<br>`;
		dat += "Linked Entities: <ol>";
		_T = null;
		for (_T of each(this.SelectedMachine.links, T("/obj/machinery/telecomms"))) {
			if (!_T.hide) {
				dat += fmt("<li><a href='?src=＃;viewmachine=＀'>＃ ＀</a> (＀)</li>", [this, _T.id, _T.id, _T.name, _T.id]);
			}
		}
		dat += "</ol>";
	}
	rt.op(f, "Browse", [], [user, dat, "window=comm_monitor;size=575x400"], false);
	onclose(user, "server_control");
	this.temp = "";
	return f.dot;
}, true);

// telemonitor.dm:68
rt.def("/obj/machinery/computer/telecomms/monitor/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _T: Value = null, newnet: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "viewmachine")) {
		this.screen = 1;
		for (_T of each(this.machinelist, T("/obj/machinery/telecomms"))) {
			if (_T.id == rt.at(href_list, "viewmachine")) {
				this.SelectedMachine = _T;
				break;
			}
		}
	}
	if (rt.at(href_list, "operation")) {
		const item = rt.at(href_list, "operation");
		if (item === "release") {
			this.machinelist = list();
			this.screen = 0;
		} else if (item === "mainmenu") {
			this.screen = 0;
		} else if (item === "probe") {
			if (rt.len(f, this.machinelist) > 0) {
				this.temp = "<font color = #D70B00>- FAILED: CANNOT PROBE WHEN BUFFER FULL -</font color>";
			} else {
				_T = null;
				for (_T of each(urange(25, this), T("/obj/machinery/telecomms"))) {
					if (_T.network == this.network) {
						this.machinelist.Add(_T);
					}
				}
				if (!rt.len(f, this.machinelist)) {
					this.temp = `<font color = #D70B00>- FAILED: UNABLE TO LOCATE NETWORK ENTITIES IN [${this.network}] -</font color>`;
				} else {
					this.temp = `<font color = #336699>- ${rt.len(f, this.machinelist)} ENTITIES LOCATED & BUFFERED -</font color>`;
				}
				this.screen = 0;
			}
		}
	}
	if (rt.at(href_list, "network")) {
		if ((newnet = (yield* stripped_input(f.usr, "Which network do you want to view?", "Comm Monitor", this.network))) && (rt.isIn(f, f.usr, range(1, this)) || rt.istype(f.usr, T("/mob/living/silicon")))) {
			if (rt.length(newnet) > 15) {
				this.temp = "<font color = #D70B00>- FAILED: NETWORK TAG STRING TOO LENGHTLY -</font color>";
			} else {
				this.network = newnet;
				this.screen = 0;
				this.machinelist = list();
				this.temp = `<font color = #336699>- NEW NETWORK TAG SET IN ADDRESS [${this.network}] -</font color>`;
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// telemonitor.dm:126
rt.def("/obj/machinery/computer/telecomms/monitor/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
