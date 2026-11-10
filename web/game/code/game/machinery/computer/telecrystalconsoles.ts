// Based on /tg/station's code/game/machinery/computer/telecrystalconsoles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// telecrystalconsoles.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalpossible_uplinker_IDs", function InitGlobalpossible_uplinker_IDs(f: Frame) {
	GLOB.possible_uplinker_IDs = list("Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Zero", "Niner");
	this.gvars_datum_init_order += "possible_uplinker_IDs";
	return f.dot;
});

rt.type(10412, "/obj/machinery/computer/telecrystals/uplinker", "/obj/machinery/computer/telecrystals", {
	uplinkholder: null,
	linkedboss: null,
	name: "１Telecrystal upload/receive station",
	desc: "A device used to manage telecrystals during group operations. To use, simply insert your uplink. With your uplink installed you can upload your telecrystals to the group's pool using the console, or be assigned additional telecrystals by your lieutenant.",
});

// telecrystalconsoles.dm:25
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/Initialize", function* Initialize(f: Frame) {
	let ID: Value = null;
	yield* parent_proc();
	if (!(ID = pick_n_take(GLOB.possible_uplinker_IDs))) {
		ID = rand(1, 999);
	}
	this.name = `${this.name} ${ID}`;
	return f.dot;
}, true);

// telecrystalconsoles.dm:34
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let I: Value = null;
	if (this.uplinkholder) {
		to_chat(user, `<span class='notice'>The ${this} already has an uplink in it.</span>`);
		return f.dot;
	}
	if (O.hidden_uplink) {
		I = user.get_active_held_item();
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.uplinkholder = I;
		I.loc = this;
		yield* I.add_fingerprint(user);
		yield* this.update_icon();
		yield* this.updateUsrDialog();
	} else {
		to_chat(user, `<span class='notice'>The ${O} doesn't appear to be an uplink...</span>`);
	}
	return f.dot;
}, true);

// telecrystalconsoles.dm:49
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (!this.uplinkholder) return f.dot;
	this.add_overlay(`${rt.initial(f, this, "icon_state")}-closed`);
	return f.dot;
});

// telecrystalconsoles.dm:55
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/ejectuplink", function ejectuplink(f: Frame) {
	if (!this.uplinkholder) return f.dot;
	this.uplinkholder.loc = rt.getStep(f, this.loc, 0);
	this.uplinkholder = null;
	this.update_icon();
	return f.dot;
});

// telecrystalconsoles.dm:60
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/donateTC", function donateTC(f: Frame, amt: Value, addLog: Value) {
	addLog ??= 1;
	if (!(this.uplinkholder && this.linkedboss)) return f.dot;
	if (amt < 0) {
		this.linkedboss.storedcrystals += this.uplinkholder.hidden_uplink.telecrystals;
		if (addLog) {
			this.linkedboss.logTransfer(`${this} donated ${this.uplinkholder.hidden_uplink.telecrystals} telecrystals to ${this.linkedboss}.`);
		}
		this.uplinkholder.hidden_uplink.telecrystals = 0;
	} else {
		if (!(amt <= this.uplinkholder.hidden_uplink.telecrystals)) return f.dot;
		this.uplinkholder.hidden_uplink.telecrystals -= amt;
		this.linkedboss.storedcrystals += amt;
		if (!addLog) return f.dot;
		this.linkedboss.logTransfer(`${this} donated ${amt} telecrystals to ${this.linkedboss}.`);
	}
	return f.dot;
});

// telecrystalconsoles.dm:73
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/giveTC", function giveTC(f: Frame, amt: Value, addLog: Value) {
	addLog ??= 1;
	if (!(this.uplinkholder && this.linkedboss)) return f.dot;
	if (amt < 0) {
		this.uplinkholder.hidden_uplink.telecrystals += this.linkedboss.storedcrystals;
		if (addLog) {
			this.linkedboss.logTransfer(`${this} received ${this.linkedboss.storedcrystals} telecrystals from ${this.linkedboss}.`);
		}
		this.linkedboss.storedcrystals = 0;
	} else {
		if (!(amt <= this.linkedboss.storedcrystals)) return f.dot;
		this.uplinkholder.hidden_uplink.telecrystals += amt;
		this.linkedboss.storedcrystals -= amt;
		if (!addLog) return f.dot;
		this.linkedboss.logTransfer(`${this} received ${amt} telecrystals from ${this.linkedboss}.`);
	}
	return f.dot;
});

// telecrystalconsoles.dm:88
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	yield* user.set_machine(this);
	let dat: Value = "";
	if (this.linkedboss) {
		dat += `${this.linkedboss} has ${this.linkedboss.storedcrystals} telecrystals available for distribution. <BR><BR>`;
	} else {
		dat += "No linked management consoles detected. Scan for uplink stations using the management console.<BR><BR>";
	}
	if (this.uplinkholder) {
		dat += `${this.uplinkholder.hidden_uplink.telecrystals} telecrystals remain in this uplink.<BR>`;
		if (this.linkedboss) {
			dat += fmt("Donate TC: <a href='byond://?src=＃;donate=1'>1</a> | <a href='byond://?src=＃;donate=5'>5</a> | <a href='byond://?src=＃;donate=-1'>All</a>", [this, this, this]);
		}
		dat += fmt("<br><a href='byond://?src=＃;eject=1'>Eject Uplink</a>", [this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Telecrystal Upload/Receive Station", 700, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// telecrystalconsoles.dm:113
rt.def("/obj/machinery/computer/telecrystals/uplinker/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let tcamt: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "donate")) {
		this.donateTC((tcamt = text2num(rt.at(href_list, "donate"))));
	}
	if (rt.at(href_list, "eject")) {
		this.ejectuplink();
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

rt.type(10413, "/obj/machinery/computer/telecrystals/boss", "/obj/machinery/computer/telecrystals", {
	virgin: 1,
	scanrange: 10,
	storedcrystals: 0,
	TCstations: null,
	transferlog: null,
	icon_screen: "tcboss",
	icon_keyboard: "syndie_key",
	name: "team Telecrystal management console",
	desc: "A device used to manage telecrystals during group operations. To use, simply initialize the machine by scanning for nearby uplink stations. Once the consoles are linked up, you can assign any telecrystals amongst your operatives; be they donated by your agents or rationed to the squad based on the danger rating of the mission.",
	icon_state: "computer",
});

// telecrystalconsoles.dm:138
rt.def("/obj/machinery/computer/telecrystals/boss/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.TCstations = list();

	this.transferlog = list();
	return f.dot;
});

// telecrystalconsoles.dm:142
rt.def("/obj/machinery/computer/telecrystals/boss/proc/logTransfer", function logTransfer(f: Frame, logmessage: Value) {
	this.transferlog += `<b>${worldtime2text()}</b> ${logmessage}`;
	return f.dot;
});

// telecrystalconsoles.dm:145
rt.def("/obj/machinery/computer/telecrystals/boss/proc/scanUplinkers", function scanUplinkers(f: Frame) {
	let A: Value = null;
	for (A of each(urange(this.scanrange, this.loc), T("/obj/machinery/computer/telecrystals/uplinker"))) {
		if (!A.linkedboss) {
			this.TCstations += A;
			A.linkedboss = this;
		}
	}
	if (!this.virgin) return f.dot;
	this.getDangerous();
	this.virgin = 0;
	return f.dot;
});

// telecrystalconsoles.dm:154
rt.def("/obj/machinery/computer/telecrystals/boss/proc/getDangerous", function getDangerous(f: Frame) {
	let danger: Value = null;
	parent_proc();
	this.scaleTC((danger = Ceiling((danger = rt.len(f, GLOB.joined_player_list) - rt.len(f, GLOB.SSticker.mode.syndicates)), 10)));
	return f.dot;
});

// telecrystalconsoles.dm:160
rt.def("/obj/machinery/computer/telecrystals/boss/proc/scaleTC", function scaleTC(f: Frame, amt: Value) {
	this.storedcrystals += amt * 1;
	return f.dot;
});

// telecrystalconsoles.dm:165
rt.def("/obj/machinery/computer/telecrystals/boss/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let A: Value = null, entry: Value = null, popup: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	yield* user.set_machine(this);
	let dat: Value = "";
	dat += fmt("<a href='byond://?src=＃;scan=1'>Scan for TC stations.</a><BR>", [this]);
	dat += `${this.storedcrystals} telecrystals are available for distribution. <BR>`;
	dat += "<BR><BR>";
	for (A of each(this.TCstations, T("/obj/machinery/computer/telecrystals/uplinker"))) {
		dat += `${A.name} | `;
		if (A.uplinkholder) {
			dat += `${A.uplinkholder.hidden_uplink.telecrystals} telecrystals.`;
		}
		if (this.storedcrystals) {
			dat += fmt("<BR>Add TC: <a href ='?src=＃;target=＃;give=1'>1</a> | <a href ='?src=＃;target=＃;give=5'>5</a> | <a href ='?src=＃;target=＃;give=10'>10</a> | <a href ='?src=＃;target=＃;give=-1'>All</a>", [this, A, this, A, this, A, this, A]);
		}
		dat += "<BR>";
	}
	if (rt.len(f, this.TCstations) && this.storedcrystals) {
		dat += fmt("<BR><BR><a href='byond://?src=＃;distrib=1'>Evenly distribute remaining TC.</a><BR><BR>", [this]);
	}
	for (entry of each(this.transferlog)) {
		dat += `<small>${entry}</small><BR>`;
	}
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Team Telecrystal Management Console", 700, 500))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// telecrystalconsoles.dm:200
rt.def("/obj/machinery/computer/telecrystals/boss/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let tcamt: Value = null, A: Value = null, sanity: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (rt.at(href_list, "scan")) {
		this.scanUplinkers();
	}
	if (rt.at(href_list, "give")) {
		tcamt = text2num(rt.at(href_list, "give"));
		if (rt.len(f, this.TCstations)) {
			(A = rt.locateIn(f, rt.at(href_list, "target"), this.TCstations)).giveTC(tcamt);
		}
	}
	if (rt.at(href_list, "distrib")) {
		sanity = 0;
		while (this.storedcrystals && sanity < 100) {
			A = null;
			for (A of each(this.TCstations, T("/obj/machinery/computer/telecrystals/uplinker"))) {
				A.giveTC(1, 0);
			}
			sanity++;
		}
		this.logTransfer(`${this} evenly distributed telecrystals.`);
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
