// Based on /tg/station's code/game/machinery/telecomms/computers/logbrowser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10415, "/obj/machinery/computer/telecomms/server", "/obj/machinery/computer/telecomms", {
	screen: 0,
	servers: null,
	SelectedServer: null,
	network: "NULL",
	temp: "",
	universal_translate: 0,
	icon_screen: "comm_logs",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/comm_server"),
	name: "telecommunications server monitoring console",
	req_access: null,
});

// logbrowser.dm:8
rt.def("/obj/machinery/computer/telecomms/server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.servers = list();

	this.req_access = list(61);
	return f.dot;
});

// logbrowser.dm:20
rt.def("/obj/machinery/computer/telecomms/server/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let _T: Value = null, i: Value = null, C: Value = null, race: Value = null, language: Value = null, mobtype: Value = null, humans: Value = null, monkeys: Value = null, silicons: Value = null, slimes: Value = null, animals: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "<TITLE>Telecommunication Server Monitor</TITLE><center><b>Telecommunications Server Monitor</b></center>";
	if (this.screen === 0) {
		dat += `<br>${this.temp}<br>`;
		dat += fmt("<br>Current Network: <a href='?src=＃;network=1'>＀</a><br>", [this, this.network]);
		if (rt.len(f, this.servers)) {
			dat += "<br>Detected Telecommunication Servers:<ul>";
			for (_T of each(this.servers, T("/obj/machinery/telecomms"))) {
				dat += fmt("<li><a href='?src=＃;viewserver=＀'>＃ ＀</a> (＀)</li>", [this, _T.id, _T, _T.name, _T.id]);
			}
			dat += "</ul>";
			dat += fmt("<br><a href='?src=＃;operation=release'>[Flush Buffer]</a>", [this]);
		} else {
			dat += fmt("<br>No servers detected. Scan for servers: <a href='?src=＃;operation=scan'>[Scan]</a>", [this]);
		}
	} else if (this.screen === 1) {
		dat += `<br>${this.temp}<br>`;
		dat += fmt("<center><a href='?src=＃;operation=mainmenu'>[Main Menu]</a>     <a href='?src=＃;operation=refresh'>[Refresh]</a></center>", [this, this]);
		dat += `<br>Current Network: ${this.network}`;
		dat += `<br>Selected Server: ${this.SelectedServer.id}`;
		if (this.SelectedServer.totaltraffic >= 1024) {
			dat += `<br>Total recorded traffic: ${round(this.SelectedServer.totaltraffic / 1024)} Terrabytes<br><br>`;
		} else {
			dat += `<br>Total recorded traffic: ${this.SelectedServer.totaltraffic} Gigabytes<br><br>`;
		}
		dat += "Stored Logs: <ol>";
		i = 0;
		for (C of each(this.SelectedServer.log_entries, T("/datum/comm_log_entry"))) {
			i++;
			if (C.input_type == "Speech File") {
				dat += fmt("<li><font color = #008F00>＀</font color>  <font color = #FF0000><a href='?src=＃;delete=＀'>[X]</a></font color><br>", [C.name, this, i]);
				race = null;
				language = "Human";
				mobtype = rt.index(C.parameters, "mobtype");
				humans = typesof(T("/mob/living/carbon/human"), T("/mob/living/brain"));
				monkeys = typesof(T("/mob/living/carbon/monkey"));
				silicons = typesof(T("/mob/living/silicon"));
				slimes = typesof(T("/mob/living/simple_animal/slime"));
				animals = typesof(T("/mob/living/simple_animal"));
				if (rt.isIn(f, mobtype, humans)) {
					language = (race = "Humanoid");
				} else if (rt.isIn(f, mobtype, slimes)) {
					language = (race = "Slime");
				} else if (rt.isIn(f, mobtype, monkeys)) {
					language = (race = "Monkey");
				} else if (rt.isIn(f, mobtype, (silicons || (rt.index(C.parameters, "job") == "AI" ? 1 : 0)))) {
					race = "Artificial Life";
					language = "Humanoid";
				} else if (rt.istype(mobtype, T("/obj"))) {
					language = (race = "Machinery");
				} else if (rt.isIn(f, mobtype, animals)) {
					language = (race = "Domestic Animal");
				} else {
					language = (race = "<i>Unidentifiable</i>");
				}
				if (language == "Humanoid" || this.universal_translate || rt.index(C.parameters, "uspeech")) {
					dat += `<u><font color = #18743E>Data type</font color></u>: ${C.input_type}<br>`;
					dat += `<u><font color = #18743E>Source</font color></u>: ${rt.index(C.parameters, "name")} (Job: ${rt.index(C.parameters, "job")})<br>`;
					dat += `<u><font color = #18743E>Class</font color></u>: ${race}<br>`;
					dat += `<u><font color = #18743E>Contents</font color></u>: "${rt.index(C.parameters, "message")}"<br>`;
				} else {
					dat += "<u><font color = #18743E>Data type</font color></u>: Audio File<br>";
					dat += "<u><font color = #18743E>Source</font color></u>: <i>Unidentifiable</i><br>";
					dat += `<u><font color = #18743E>Class</font color></u>: ${race}<br>`;
					dat += "<u><font color = #18743E>Contents</font color></u>: <i>Unintelligble</i><br>";
				}
				dat += "</li><br>";
			} else if (C.input_type == "Execution Error") {
				dat += fmt("<li><font color = #990000>＀</font color>  <font color = #FF0000><a href='?src=＃;delete=＀'>[X]</a></font color><br>", [C.name, this, i]);
				dat += `<u><font color = #787700>Output</font color></u>: "${rt.index(C.parameters, "message")}"<br>`;
				dat += "</li><br>";
			}
		}
		dat += "</ol>";
	}
	rt.op(f, "Browse", [], [user, dat, "window=comm_monitor;size=575x400"], false);
	onclose(user, "server_control");
	this.temp = "";
	return f.dot;
}, true);

// logbrowser.dm:147
rt.def("/obj/machinery/computer/telecomms/server/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _T: Value = null, D: Value = null, newnet: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "viewserver")) {
		this.screen = 1;
		for (_T of each(this.servers, T("/obj/machinery/telecomms"))) {
			if (_T.id == rt.at(href_list, "viewserver")) {
				this.SelectedServer = _T;
				break;
			}
		}
	}
	if (rt.at(href_list, "operation")) {
		const item = rt.at(href_list, "operation");
		if (item === "release") {
			this.servers = list();
			this.screen = 0;
		} else if (item === "mainmenu") {
			this.screen = 0;
		} else if (item === "scan") {
			if (rt.len(f, this.servers) > 0) {
				this.temp = "<font color = #D70B00>- FAILED: CANNOT PROBE WHEN BUFFER FULL -</font color>";
			} else {
				_T = null;
				for (_T of each(urange(25, this), T("/obj/machinery/telecomms/server"))) {
					if (_T.network == this.network) {
						this.servers.Add(_T);
					}
				}
				if (!rt.len(f, this.servers)) {
					this.temp = `<font color = #D70B00>- FAILED: UNABLE TO LOCATE SERVERS IN [${this.network}] -</font color>`;
				} else {
					this.temp = `<font color = #336699>- ${rt.len(f, this.servers)} SERVERS PROBED & BUFFERED -</font color>`;
				}
				this.screen = 0;
			}
		}
	}
	if (rt.at(href_list, "delete")) {
		if (!(yield* this.allowed(f.usr)) && !this.emagged) {
			to_chat(f.usr, "<span class='danger'>ACCESS DENIED.</span>");
			return f.dot;
		}
		if (this.SelectedServer) {
			this.temp = `<font color = #336699>- DELETED ENTRY: ${(D = rt.index(this.SelectedServer.log_entries, text2num(rt.at(href_list, "delete")))).name} -</font color>`;
			yield* this.SelectedServer.log_entries.Remove(D);
			yield* qdel(D);
		} else {
			this.temp = "<font color = #D70B00>- FAILED: NO SELECTED MACHINE -</font color>";
		}
	}
	if (rt.at(href_list, "network")) {
		if ((newnet = (yield* stripped_input(f.usr, "Which network do you want to view?", "Comm Monitor", this.network))) && (rt.isIn(f, f.usr, range(1, this)) || rt.istype(f.usr, T("/mob/living/silicon")))) {
			if (rt.length(newnet) > 15) {
				this.temp = "<font color = #D70B00>- FAILED: NETWORK TAG STRING TOO LENGHTLY -</font color>";
			} else {
				this.network = newnet;
				this.screen = 0;
				this.servers = list();
				this.temp = `<font color = #336699>- NEW NETWORK TAG SET IN ADDRESS [${this.network}] -</font color>`;
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// logbrowser.dm:224
rt.def("/obj/machinery/computer/telecomms/server/proc/attackby", function* attackby(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
