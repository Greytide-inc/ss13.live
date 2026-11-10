// Based on /tg/station's code/modules/research/server.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10966, "/obj/machinery/r_n_d/server", "/obj/machinery/r_n_d", {
	files: null,
	heat_health: 100,
	id_with_upload: null,
	id_with_download: null,
	id_with_upload_string: "",
	id_with_download_string: "",
	server_id: 0,
	heat_gen: 100,
	heating_power: 40000,
	delay: 10,
	name: "R&D Server",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	icon_state: "server",
	req_access: null,
});

// server.dm:7
rt.def("/obj/machinery/r_n_d/server/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.id_with_upload = list();

	this.id_with_download = list();

	this.req_access = list(30);
	return f.dot;
});

// server.dm:18
rt.def("/obj/machinery/r_n_d/server/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/rdserver"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6783, "/obj/item/weapon/circuitboard/machine/rdserver", "/obj/item/weapon/circuitboard/machine", {
	name: "R&D Server (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/server"),
	origin_tech: "programming=3",
	req_components: null,
});

// server.dm:26
rt.def("/obj/item/weapon/circuitboard/machine/rdserver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/scanning_module"), 1]);
	return f.dot;
});

// server.dm:31
rt.def("/obj/machinery/r_n_d/server/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.griefProtection();
	return (yield* parent_proc());
}, true);

// server.dm:36
rt.def("/obj/machinery/r_n_d/server/proc/RefreshParts", function RefreshParts(f: Frame) {
	let SP: Value = null;
	let tot_rating: Value = 0;
	for (SP of each(this, T("/obj/item/weapon/stock_parts"))) {
		tot_rating += SP.rating;
	}
	this.heat_gen /= max(1, tot_rating);
	return f.dot;
});

// server.dm:41
rt.def("/obj/machinery/r_n_d/server/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let temp_list: Value = null, N: Value = null;
	f.dot = (yield* parent_proc());
	if (!this.files) {
		this.files = (yield* new_(T("/datum/research"), this));
	}
	if (!rt.len(f, this.id_with_upload)) {
		temp_list = list();
		temp_list = splittext(this.id_with_upload_string, ";");
		for (N of each(temp_list)) {
			this.id_with_upload += text2num(N);
		}
	}
	if (rt.len(f, this.id_with_download)) return f.dot;
	temp_list = list();
	temp_list = splittext(this.id_with_download_string, ";");
	N = null;
	for (N of each(temp_list)) {
		this.id_with_download += text2num(N);
	}
	return f.dot;
}, true);

// server.dm:56
rt.def("/obj/machinery/r_n_d/server/proc/process", function* process(f: Frame) {
	let environment: Value = null, updateRD: Value = null, v: Value = null, _T: Value = null;
	let $e: any;
	const temperature = (environment = this.loc.return_air()).temperature;
	if (rt.inRange(temperature, 0, T0C)) {
		this.heat_health = min(100, this.heat_health + 1);
	} else if (rt.inRange(temperature, T0C, 313.15)) {
		this.heat_health = max(0, min(this.heat_health, 100));
	} else if (rt.inRange(temperature, 313.15, 343.15)) {
		this.heat_health = max(0, this.heat_health - 1);
	}
	if (this.heat_health <= 0) {
		updateRD = 0;
		this.files.known_designs = list();
		for (v of each(this.files.known_tech)) {
			_T = rt.index(this.files.known_tech, v);
			if (prob(1)) {
				updateRD++;
				_T.level--;
			}
		}
		if (updateRD) {
			yield* this.files.RefreshResearch();
		}
	}
	if (this.delay) {
		this.delay--;
	} else {
		yield* this.produce_heat(this.heat_gen);
		this.delay = rt.initial(f, this, "delay");
	}
	return f.dot;
}, true, { waitfor: false });

// server.dm:84
rt.def("/obj/machinery/r_n_d/server/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.griefProtection();
	yield* parent_proc();
	return f.dot;
}, true);

// server.dm:88
rt.def("/obj/machinery/r_n_d/server/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.griefProtection();
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// server.dm:93
rt.def("/obj/machinery/r_n_d/server/proc/griefProtection", function* griefProtection(f: Frame) {
	let C: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	for (C of each(GLOB.machines, T("/obj/machinery/r_n_d/server/centcom"))) {
		v = null;
		for (v of each(this.files.known_tech)) {
			_T = rt.index(this.files.known_tech, v);
			yield* C.files.AddTech2Known(_T);
		}
		v = null;
		for (v of each(this.files.known_designs)) {
			D = rt.index(this.files.known_designs, v);
			C.files.AddDesign2Known(D);
		}
		yield* C.files.RefreshResearch();
	}
	return f.dot;
}, true);

// server.dm:103
rt.def("/obj/machinery/r_n_d/server/proc/produce_heat", function* produce_heat(f: Frame, heat_amt: Value) {
	let L: Value = null, env: Value = null, removed: Value = null, heat_capacity: Value = null;
	if (rt.bitAnd(this.stat, 3)) return f.dot;
	if (!rt.istype((L = this.loc), T("/turf"))) return f.dot;
	if (!((env = L.return_air()).temperature < heat_amt + T0C)) return f.dot;
	let transfer_moles: Value = 0.25 * env.total_moles();
	if (removed = (yield* env.remove(transfer_moles))) {
		if ((heat_capacity = removed.heat_capacity()) == 0 || heat_capacity === null) {
			heat_capacity = 1;
		}
		removed.temperature = min((removed.temperature * heat_capacity + this.heating_power) / heat_capacity, 1000);
	}
	yield* env.merge(removed);
	this.air_update_turf();
	return f.dot;
}, true);

// server.dm:125
rt.def("/obj/machinery/r_n_d/server/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	yield* this.griefProtection();
	yield* parent_proc();
	return f.dot;
}, true);

// server.dm:132
rt.def("/obj/machinery/r_n_d/server/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.disabled) {
		return f.dot;
	}
	if (this.shocked) {
		yield* this.shock(user, 50);
	}
	return f.dot;
}, true);

rt.type(10967, "/obj/machinery/r_n_d/server/centcom", "/obj/machinery/r_n_d/server", {
	server_id: -1,
	name: "Centcom Central R&D Database",
});

// server.dm:140
rt.def("/obj/machinery/r_n_d/server/centcom/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	fix_noid_research_servers();
	return f.dot;
}, true);

// server.dm:144
rt.def("/proc/fix_noid_research_servers", function fix_noid_research_servers(f: Frame) {
	let S: Value = null, num: Value = null;
	let $e: any;
	let no_id_servers: Value = list();
	let server_ids: Value = list();
	for (S of each(GLOB.machines, T("/obj/machinery/r_n_d/server"))) {
		if (S.server_id === -1) {
			continue;
		} else if (S.server_id === 0) {
			no_id_servers += S;
		} else {
			server_ids += S.server_id;
		}
	}
	S = null;
	for (S of each(no_id_servers, T("/obj/machinery/r_n_d/server"))) {
		num = 1;
		while (!S.server_id) {
			if (rt.isIn(f, num, server_ids)) {
				num++;
			} else {
				S.server_id = num;
				server_ids += num;
			}
		}
		no_id_servers -= S;
	}
	return f.dot;
});

rt.type(10432, "/obj/machinery/computer/rdservercontrol", "/obj/machinery/computer", {
	screen: 0,
	temp_server: null,
	servers: null,
	consoles: null,
	badmin: 0,
	icon_screen: "rdcomp",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/rdservercontrol"),
	name: "R&D Server Controller",
	desc: "Used to manage access to research and manufacturing databases.",
});

// server.dm:176
rt.def("/obj/machinery/computer/rdservercontrol/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.servers = list();

	this.consoles = list();
	return f.dot;
});

// server.dm:182
rt.def("/obj/machinery/computer/rdservercontrol/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let S: Value = null, C: Value = null, num: Value = null, choice: Value = null, _T: Value = null, D: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	yield* f.usr.set_machine(this);
	if (!(yield* this.allowed(f.usr)) && !this.emagged) {
		to_chat(f.usr, "<span class='danger'>You do not have the required access level.</span>");
		return f.dot;
	}
	if (rt.at(href_list, "main")) {
		this.screen = 0;
	} else if (rt.at(href_list, "access") || rt.at(href_list, "data") || rt.at(href_list, "transfer")) {
		this.temp_server = null;
		this.consoles = list();
		this.servers = list();
		for (S of each(GLOB.machines, T("/obj/machinery/r_n_d/server"))) {
			if (S.server_id == text2num(rt.at(href_list, "access")) || S.server_id == text2num(rt.at(href_list, "data")) || S.server_id == text2num(rt.at(href_list, "transfer"))) {
				this.temp_server = S;
				break;
			}
		}
		if (rt.at(href_list, "access")) {
			this.screen = 1;
			for (C of each(GLOB.machines, T("/obj/machinery/computer/rdconsole"))) {
				if (C.sync) {
					this.consoles += C;
				}
			}
		} else if (rt.at(href_list, "data")) {
			this.screen = 2;
		} else if (rt.at(href_list, "transfer")) {
			this.screen = 3;
			S = null;
			for (S of each(GLOB.machines, T("/obj/machinery/r_n_d/server"))) {
				if (S == this) {
					continue;
				}
				this.servers += S;
			}
		}
	} else if (rt.at(href_list, "upload_toggle")) {
		if (rt.isIn(f, (num = text2num(rt.at(href_list, "upload_toggle"))), this.temp_server.id_with_upload)) {
			this.temp_server.id_with_upload -= num;
		} else {
			this.temp_server.id_with_upload += num;
		}
	} else if (rt.at(href_list, "download_toggle")) {
		if (rt.isIn(f, (num = text2num(rt.at(href_list, "download_toggle"))), this.temp_server.id_with_download)) {
			this.temp_server.id_with_download -= num;
		} else {
			this.temp_server.id_with_download += num;
		}
	} else if (rt.at(href_list, "reset_tech")) {
		if ((choice = (yield* alert("Technology Data Reset", "Are you sure you want to reset this technology to its default data? Data lost cannot be recovered.", "Continue", "Cancel"))) == "Continue" && f.usr.canUseTopic(this)) {
			if (_T = rt.index(this.temp_server.files.known_tech, rt.at(href_list, "reset_tech"))) {
				_T.level = 1;
			}
		}
		yield* this.temp_server.files.RefreshResearch();
	} else if (rt.at(href_list, "reset_design")) {
		if ((choice = (yield* alert("Design Data Deletion", "Are you sure you want to delete this design? Data lost cannot be recovered.", "Continue", "Cancel"))) == "Continue" && f.usr.canUseTopic(this)) {
			if (D = rt.index(this.temp_server.files.known_designs, rt.at(href_list, "reset_design"))) {
				this.temp_server.files.known_designs -= D.id;
			}
		}
		yield* this.temp_server.files.RefreshResearch();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// server.dm:250
rt.def("/obj/machinery/computer/rdservercontrol/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null, C: Value = null, console_turf: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	if (this.screen === 0) {
		dat += "Connected Servers:<BR><BR>";
		for (S of each(GLOB.machines, T("/obj/machinery/r_n_d/server"))) {
			if (rt.istype(S, T("/obj/machinery/r_n_d/server/centcom")) && !this.badmin) {
				continue;
			}
			dat += `${S.name} || `;
			dat += fmt("<A href='?src=＃;access=＀'>Access Rights</A> | ", [this, S.server_id]);
			dat += fmt("<A href='?src=＃;data=＀'>Data Management</A>", [this, S.server_id]);
			if (this.badmin) {
				dat += fmt(" | <A href='?src=＃;transfer=＀'>Server-to-Server Transfer</A>", [this, S.server_id]);
			}
			dat += "<BR>";
		}
	} else if (this.screen === 1) {
		dat += `${this.temp_server.name} Access Rights<BR><BR>`;
		dat += "Consoles with Upload Access<BR>";
		for (C of each(this.consoles, T("/obj/machinery/computer/rdconsole"))) {
			console_turf = rt.getStep(f, C, 0);
			dat += fmt("* <A href='?src=＃;upload_toggle=＀'>＀", [this, C.id, console_turf.loc]);
			if (rt.isIn(f, C.id, this.temp_server.id_with_upload)) {
				dat += " (Remove)</A><BR>";
			} else {
				dat += " (Add)</A><BR>";
			}
		}
		dat += "Consoles with Download Access<BR>";
		C = null;
		for (C of each(this.consoles, T("/obj/machinery/computer/rdconsole"))) {
			console_turf = rt.getStep(f, C, 0);
			dat += fmt("* <A href='?src=＃;download_toggle=＀'>＀", [this, C.id, console_turf.loc]);
			if (rt.isIn(f, C.id, this.temp_server.id_with_download)) {
				dat += " (Remove)</A><BR>";
			} else {
				dat += " (Add)</A><BR>";
			}
		}
		dat += fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [this]);
	} else if (this.screen === 2) {
		dat += `${this.temp_server.name} Data ManagementP<BR><BR>`;
		dat += "Known Technologies<BR>";
		for (v of each(this.temp_server.files.known_tech)) {
			if ((_T = rt.index(this.temp_server.files.known_tech, v)).level <= 0) {
				continue;
			}
			dat += `* ${_T.name} `;
			dat += fmt("<A href='?src=＃;reset_tech=＀'>(Reset)</A><BR>", [this, _T.id]);
		}
		dat += "Known Designs<BR>";
		v = null;
		for (v of each(this.temp_server.files.known_designs)) {
			dat += `* ${(D = rt.index(this.temp_server.files.known_designs, v)).name} `;
			dat += fmt("<A href='?src=＃;reset_design=＀'>(Delete)</A><BR>", [this, D.id]);
		}
		dat += fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [this]);
	} else if (this.screen === 3) {
		dat += `${this.temp_server.name} Server to Server Transfer<BR><BR>`;
		dat += "Send Data to what server?<BR>";
		S = null;
		for (S of each(this.servers, T("/obj/machinery/r_n_d/server"))) {
			dat += fmt("＀ <A href='?src=＃;send_to=＀'>(Transfer)</A><BR>", [S.name, this, S.server_id]);
		}
		dat += fmt("<HR><A href='?src=＃;main=1'>Main Menu</A>", [this]);
	}
	rt.op(f, "Browse", [], [user, `<TITLE>R&D Server Control</TITLE><HR>${dat}`, "window=server_control;size=575x400"], false);
	onclose(user, "server_control");
	return f.dot;
}, true);

// server.dm:315
rt.def("/obj/machinery/computer/rdservercontrol/proc/attackby", function* attackby(f: Frame, D: Value, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// server.dm:319
rt.def("/obj/machinery/computer/rdservercontrol/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 75, 1);
	this.emagged = 1;
	to_chat(user, "<span class='notice'>You you disable the security protocols.</span>");
	return f.dot;
});
