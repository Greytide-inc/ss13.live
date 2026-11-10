// Based on /tg/station's code/game/machinery/telecomms/machine_interactions.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// machine_interactions.dm:13
rt.def("/obj/machinery/telecomms/proc/attackby", function* attackby(f: Frame, P: Value, user: Value, params: Value) {
	let icon_closed: Value = rt.initial(f, this, "icon_state");
	let icon_open: Value = `${rt.initial(f, this, "icon_state")}_o`;
	if (!this.on) {
		icon_closed = `${rt.initial(f, this, "icon_state")}_off`;
		icon_open = `${rt.initial(f, this, "icon_state")}_o_off`;
	}
	if (this.default_deconstruction_screwdriver(user, icon_open, icon_closed, P)) {
		return f.dot;
	} else if (yield* this.exchange_parts(user, P)) {
		return f.dot;
	} else if (rt.istype(P, T("/obj/item/device/multitool"))) {
		yield* this.attack_hand(user);
	} else if (yield* this.default_deconstruction_crowbar(P)) {
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// machine_interactions.dm:36
rt.def("/obj/machinery/telecomms/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// machine_interactions.dm:41
rt.def("/obj/machinery/telecomms/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let i: Value = null, _T: Value = null, x: Value = null;
	let $e: any;
	if (!rt.istype(user, T("/mob/living/silicon"))) {
		if (!rt.istype(user.get_active_held_item(), T("/obj/item/device/multitool"))) {
			return f.dot;
		}
	}
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	let _P: Value = this.get_multitool(user);
	yield* user.set_machine(this);
	let dat: Value = `<font face = "Courier"><HEAD><TITLE>${this.name}</TITLE></HEAD><center><H3>${this.name} Access</H3></center>`;
	dat += `<br>${this.temp}<br>`;
	let $0: any = this;
	dat += fmt("<br>Power Status: <a href='?src=＃;input=toggle'>＀</a>", [$0, this.toggled ? "On" : "Off"]);
	if (this.on && this.toggled) {
		if (this.id != "" && this.id) {
			dat += fmt("<br>Identification String: <a href='?src=＃;input=id'>＀</a>", [this, this.id]);
		} else {
			dat += fmt("<br>Identification String: <a href='?src=＃;input=id'>NULL</a>", [this]);
		}
		dat += fmt("<br>Network: <a href='?src=＃;input=network'>＀</a>", [this, this.network]);
		dat += `<br>Prefabrication: ${rt.len(f, this.autolinkers) ? "TRUE" : "FALSE"}`;
		if (this.hide) {
			dat += "<br>Shadow Link: ACTIVE</a>";
		}
		dat += this.Options_Menu();
		dat += "<br>Linked Network Entities: <ol>";
		i = 0;
		for (_T of each(this.links, T("/obj/machinery/telecomms"))) {
			i++;
			if (_T.hide && !this.hide) {
				continue;
			}
			dat += fmt("<li>＃ ＀ (＀)  <a href='?src=＃;unlink=＀'>[X]</a></li>", [_T, _T.name, _T.id, this, i]);
		}
		dat += "</ol>";
		dat += "<br>Filtering Frequencies: ";
		i = 0;
		if (rt.length(this.freq_listening)) {
			for (x of each(this.freq_listening)) {
				i++;
				if (i < rt.length(this.freq_listening)) {
					dat += fmt("＀ GHz<a href='?src=＃;delete=＀'>[X]</a>; ", [format_frequency(x), this, x]);
				} else {
					dat += fmt("＀ GHz<a href='?src=＃;delete=＀'>[X]</a>", [format_frequency(x), this, x]);
				}
			}
		} else {
			dat += "NONE";
		}
		dat += fmt("<br>  <a href='?src=＃;input=freq'>[Add Filter]</a>", [this]);
		dat += "<hr>";
		if (_P) {
			if (rt.istype((_T = _P.buffer), T("/obj/machinery/telecomms"))) {
				dat += fmt("<br><br>MULTITOOL BUFFER: ＀ (＀) <a href='?src=＃;link=1'>[Link]</a> <a href='?src=＃;flush=1'>[Flush]", [_T, _T.id, this, this]);
			} else {
				dat += fmt("<br><br>MULTITOOL BUFFER: <a href='?src=＃;buffer=1'>[Add Machine]</a>", [this]);
			}
		}
	}
	dat += "</font>";
	this.temp = "";
	rt.op(f, "Browse", [], [user, dat, "window=tcommachine;size=520x500;can_resize=0"], false);
	onclose(user, "dormitory");
	return f.dot;
}, true);

// machine_interactions.dm:128
rt.def("/obj/machinery/telecomms/proc/get_multitool", function get_multitool(f: Frame, user: Value) {
	let _P: Value = null, U: Value = null;
	if (!rt.istype(user, T("/mob/living/silicon")) && rt.istype(user.get_active_held_item(), T("/obj/item/device/multitool"))) {
		_P = user.get_active_held_item();
	} else if (rt.istype(user, T("/mob/living/silicon/ai"))) {
		_P = (U = user).aiMulti;
	} else if (rt.istype(user, T("/mob/living/silicon/robot")) && get_dist(user, this) <= 1) {
		if (rt.istype(user.get_active_held_item(), T("/obj/item/device/multitool"))) {
			_P = user.get_active_held_item();
		}
	}
	return _P;
});

// machine_interactions.dm:142
rt.def("/obj/machinery/telecomms/proc/Options_Menu", function Options_Menu(f: Frame) {
	return "";
});

// machine_interactions.dm:152
rt.def("/obj/machinery/telecomms/relay/proc/Options_Menu", function Options_Menu(f: Frame) {
	let dat: Value = "";
	let $0: any = this;
	dat += fmt("<br>Broadcasting: <A href='?src=＃;broadcast=1'>＀</a>", [$0, this.broadcasting ? "YES" : "NO"]);
	return (dat += fmt("<br>Receiving:    <A href='?src=＃;receive=1'>＀</a>", [this, this.receiving ? "YES" : "NO"]));
});

// machine_interactions.dm:159
rt.def("/obj/machinery/telecomms/relay/proc/Options_Topic", function Options_Topic(f: Frame, href: Value, href_list: Value) {
	if (rt.at(href_list, "receive")) {
		this.receiving = (!this.receiving ? 1 : 0);
		this.temp = "<font color = #666633>-% Receiving mode changed. %-</font color>";
	}
	if (!rt.at(href_list, "broadcast")) return f.dot;
	this.broadcasting = (!this.broadcasting ? 1 : 0);
	this.temp = "<font color = #666633>-% Broadcasting mode changed. %-</font color>";
	return f.dot;
});

rt.type(10714, "/obj/machinery/telecomms/bus", "/obj/machinery/telecomms", {
	change_frequency: 0,
	anchored: 1,
	name: "bus mainframe",
	icon_state: "bus",
	desc: "A mighty piece of hardware used to send massive amounts of data quickly.",
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	machinetype: 2,
	netspeed: 40,
});

// machine_interactions.dm:169
rt.def("/obj/machinery/telecomms/bus/proc/Options_Menu", function Options_Menu(f: Frame) {
	let dat: Value = null;
	let $1: any;
	let $0: any = this;
	if (this.change_frequency) {
		$1 = `YES (${this.change_frequency})`;
	} else {
		$1 = "NO";
	}
	return (dat = fmt("<br>Change Signal Frequency: <A href='?src=＃;change_freq=1'>＀</a>", [$0, $1]));
});

// machine_interactions.dm:174
rt.def("/obj/machinery/telecomms/bus/proc/Options_Topic", function* Options_Topic(f: Frame, href: Value, href_list: Value) {
	if (!rt.at(href_list, "change_freq")) return f.dot;
	let newfreq: Value = (yield* g.op(f, "Prompt", [33], [this.network, this, "Specify a new frequency for new signals to change to. Enter null to turn off frequency changing. Decimals assigned automatically.", f.usr, null]));
	if (!this.canAccess(f.usr)) return f.dot;
	if (newfreq) {
		if (findtext(num2text(newfreq), ".")) {
			newfreq *= 10;
		}
		if (newfreq < 10000) {
			this.change_frequency = newfreq;
			this.temp = `<font color = #666633>-% New frequency to change to assigned: "${newfreq} GHz" %-</font color>`;
		}
	} else {
		this.change_frequency = 0;
		this.temp = "<font color = #666633>-% Frequency changing deactivated %-</font color>";
	}
	return f.dot;
}, true);

// machine_interactions.dm:190
rt.def("/obj/machinery/telecomms/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let newid: Value = null, newnet: Value = null, _T: Value = null, newfreq: Value = null, x: Value = null, _T_1: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (!rt.istype(f.usr, T("/mob/living/silicon"))) {
		if (!rt.istype(f.usr.get_active_held_item(), T("/obj/item/device/multitool"))) {
			return f.dot;
		}
	}
	let _P: Value = this.get_multitool(f.usr);
	if (rt.at(href_list, "input")) {
		const item = rt.at(href_list, "input");
		if (item === "toggle") {
			this.toggled = (!this.toggled ? 1 : 0);
			this.temp = `<font color = #666633>-% ${this} has been ${this.toggled ? "activated" : "deactivated"}.</font color>`;
			this.update_power();
		} else if (item === "id") {
			if ((newid = copytext(reject_bad_text((yield* g.op(f, "Prompt", [3], [this.id, this, "Specify the new ID for this machine", f.usr, null]))), 1, 1024)) && this.canAccess(f.usr)) {
				this.id = newid;
				this.temp = `<font color = #666633>-% New ID assigned: "${this.id}" %-</font color>`;
			}
		} else if (item === "network") {
			if ((newnet = (yield* stripped_input(f.usr, "Specify the new network for this machine. This will break all current links.", this, this.network))) && this.canAccess(f.usr)) {
				if (rt.length(newnet) > 15) {
					this.temp = "<font color = #666633>-% Too many characters in new network tag %-</font color>";
				} else {
					for (_T of each(this.links, T("/obj/machinery/telecomms"))) {
						yield* _T.links.Remove(this);
					}
					this.network = newnet;
					this.links = list();
					this.temp = `<font color = #666633>-% New network tag assigned: "${this.network}" %-</font color>`;
				}
			}
		} else if (item === "freq") {
			if ((newfreq = (yield* g.op(f, "Prompt", [33], [this.network, this, "Specify a new frequency to filter (GHz). Decimals assigned automatically.", f.usr, null]))) && this.canAccess(f.usr)) {
				if (findtext(num2text(newfreq), ".")) {
					newfreq *= 10;
				}
				if (newfreq == 1213) {
					this.temp = `<font color = #FF0000>-% Error: Interference preventing filtering frequency: "${newfreq} GHz" %-</font color>`;
				} else if (!rt.isIn(f, newfreq, this.freq_listening) && newfreq < 10000) {
					this.freq_listening.Add(newfreq);
					this.temp = `<font color = #666633>-% New frequency filter assigned: "${newfreq} GHz" %-</font color>`;
				}
			}
		}
	}
	if (rt.at(href_list, "delete")) {
		this.temp = `<font color = #666633>-% Removed frequency filter ${(x = text2num(rt.at(href_list, "delete")))} %-</font color>`;
		yield* this.freq_listening.Remove(x);
	}
	if (rt.at(href_list, "unlink")) {
		if (text2num(rt.at(href_list, "unlink")) <= rt.length(this.links)) {
			if (_T_1 = rt.index(this.links, text2num(rt.at(href_list, "unlink")))) {
				this.temp = fmt("<font color = #666633>-% Removed ＃ ＀ from linked entities. %-</font color>", [_T_1, _T_1.name]);
				if (_T_1.links) {
					yield* _T_1.links.Remove(this);
				}
				yield* this.links.Remove(_T_1);
			} else {
				this.temp = "<font color = #666633>-% Unable to locate machine to unlink from, try again. %-</font color>";
			}
		}
	}
	if (rt.at(href_list, "link")) {
		if (_P) {
			if (rt.istype((_T_1 = _P.buffer), T("/obj/machinery/telecomms")) && _T_1 != this) {
				if (!rt.isIn(f, this, _T_1.links)) {
					_T_1.links += this;
				}
				if (!rt.isIn(f, _T_1, this.links)) {
					this.links += _T_1;
				}
				this.temp = fmt("<font color = #666633>-% Successfully linked with ＃ ＀ %-</font color>", [_T_1, _T_1.name]);
			} else {
				this.temp = "<font color = #666633>-% Unable to acquire buffer %-</font color>";
			}
		}
	}
	if (rt.at(href_list, "buffer")) {
		_P.buffer = this;
		this.temp = fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [_P.buffer, _P.buffer.name]);
	}
	if (rt.at(href_list, "flush")) {
		this.temp = "<font color = #666633>-% Buffer successfully flushed. %-</font color>";
		_P.buffer = null;
	}
	yield* this.Options_Topic(href, href_list);
	yield* f.usr.set_machine(this);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// machine_interactions.dm:301
rt.def("/obj/machinery/telecomms/proc/canAccess", function canAccess(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon")) || get_dist(user, this) <= 1) {
		return 1;
	}
	return 0;
});
