// Based on /tg/station's code/modules/assembly/signaler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(9380, "/obj/item/device/assembly/signaler", "/obj/item/device/assembly", {
	send_throttle_time: 0,
	code: 30,
	frequency: 1457,
	delay: 0,
	radio_connection: null,
	wires: 27,
	attachable: 1,
	name: "remote signaling device",
	desc: "Used to remotely activate devices. Allows for syncing when using a secure signaler on another.",
	icon_state: "signaller",
	item_state: "signaler",
	materials: null,
	origin_tech: "magnets=1;bluespace=1",
});

// signaler.dm:6
rt.def("/obj/item/device/assembly/signaler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400, "$glass", 120]);
	return f.dot;
});

// signaler.dm:17
rt.def("/obj/item/device/assembly/signaler/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	rt.spawnTail(f, 40, "/obj/item/device/assembly/signaler/proc/New: spawn at modules/assembly/signaler.dm:18");
	return f.dot;
}, true);

// a spawn(40) body of /obj/item/device/assembly/signaler/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/signaler/proc/New: spawn at modules/assembly/signaler.dm:18", function* (f: Frame) {
	yield* this.set_frequency(this.frequency);
	return null;
});

// signaler.dm:24
rt.def("/obj/item/device/assembly/signaler/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	return (yield* parent_proc());
}, true);

// signaler.dm:28
rt.def("/obj/item/device/assembly/signaler/proc/activate", function* activate(f: Frame) {
	if (!(yield* parent_proc())) {
		return 0;
	}
	yield* this.signal();
	return 1;
}, true);

// signaler.dm:35
rt.def("/obj/item/device/assembly/signaler/proc/update_icon", function* update_icon(f: Frame) {
	if (this.holder) {
		yield* this.holder.update_icon();
	}
	return f.dot;
}, true);

// signaler.dm:39
// tg_js: opens the `signaler` tgui window (after modern tg's Signaler) instead of a hand-built HTML page.
rt.def("/obj/item/device/assembly/signaler/proc/interact", function* interact(f: Frame, user: Value, flag1: Value) {
	if (!rt.callSrc(f, "is_secured", [user])) return f.dot;
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// Added by tg_js.
rt.def("/obj/item/device/assembly/signaler/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	if (state === null) {
		// In a holder (bomb, wire-attached) the signaler is nested inside another item, where default_state's view() check can't see it: always_state, and the old Topic's own distance/stat/restrained check (kept in ui_act) guards every click.
		state = this.holder ? GLOB.always_state : GLOB.default_state;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "signaler", this.name, 320, 220, master_ui, state))).open();
	return f.dot;
}, true);

// Added by tg_js.
rt.def("/obj/item/device/assembly/signaler/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = list();
	rt.setAt(data, "frequency", this.frequency);
	rt.setAt(data, "readable_frequency", format_frequency(this.frequency));
	rt.setAt(data, "code", this.code);
	return data;
}, true);

// /obj/item/device/assembly/signaler/proc/ui_act  (tg_js)  may sleep
// The buttons go through the old Topic (adjacency/stat checks, the frequency/code limits, the send).
rt.def("/obj/item/device/assembly/signaler/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "freq") {
		yield* this.Topic("", rt.alist(f, ["freq", `${rt.at(params, "adjust")}`]));
	} else if (action === "code") {
		yield* this.Topic("", rt.alist(f, ["code", `${rt.at(params, "adjust")}`]));
	} else if (action === "send") {
		yield* this.Topic("", rt.alist(f, ["send", 1]));
	} else {
		return 0;
	}
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// signaler.dm:71
rt.def("/obj/item/device/assembly/signaler/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let new_frequency: Value = null;
	yield* parent_proc();
	if (!f.usr.canmove || f.usr.stat || f.usr.restrained() || !(get_dist(this.loc, f.usr) <= 1)) {
		// tg_js, 2017 tg's own hole: this closed every viewer's window, so a far player's href closed the holder's. Only the sender's own window closes.
		yield* GLOB.SStgui.close_user_uis(f.usr, this);
		return f.dot;
	}
	if (rt.at(href_list, "freq")) {
		// tg_js, 2017 tg's own hole: a fractional adjust (0.5) left the frequency fractional inside 1200..1600; whole numbers only.
		if ((new_frequency = round(this.frequency + text2num(rt.at(href_list, "freq")))) < 1200 || new_frequency > 1600) {
			new_frequency = sanitize_frequency(new_frequency);
		}
		yield* this.set_frequency(new_frequency);
	}
	if (rt.at(href_list, "code")) {
		rt.modField(f, this, "code", text2num(rt.at(href_list, "code")), add);
		this.code = round(this.code);
		this.code = min(100, this.code);
		this.code = max(1, this.code);
	}
	if (rt.at(href_list, "send") && rt.worldTime(f) < this.send_throttle_time) {
		// tg_js, tg 5a59713592 (2021): spamming send floods the frequency; one signal per second per signaler.
		to_chat(f.usr, "<span class='warning'>The signaler is still recharging...</span>");
	} else if (rt.at(href_list, "send")) {
		this.send_throttle_time = rt.worldTime(f) + 10;
		rt.spawnTail(f, 0, "/obj/item/device/assembly/signaler/proc/Topic: spawn at modules/assembly/signaler.dm:91", new_frequency);
	}
	if (f.usr) {
		yield* this.attack_self(f.usr);
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/item/device/assembly/signaler/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/signaler/proc/Topic: spawn at modules/assembly/signaler.dm:91", function* (f: Frame, new_frequency: Value) {
	yield* this.signal();
	return null;
});

// signaler.dm:100
rt.def("/obj/item/device/assembly/signaler/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let signaler2: Value = null;
	if (rt.istype(W, T("/obj/item/device/assembly/signaler"))) {
		signaler2 = W;
		if (this.secured && signaler2.secured) {
			this.code = signaler2.code;
			// tg set `frequency` directly: the number changed but the radio connection stayed on the old frequency.
			yield* this.set_frequency(signaler2.frequency);
			to_chat(user, fmt("You transfer the frequency and code of ％！ to ％！", [signaler2.name, this.name]));
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// signaler.dm:110
rt.def("/obj/item/device/assembly/signaler/proc/signal", function* signal(f: Frame) {
	let signal: Value = null;
	if (!this.radio_connection) {
		return f.dot;
	}
	(signal = (yield* new_(T("/datum/signal")))).source = this;
	signal.encryption = this.code;
	rt.setAt(signal.data, "message", "ACTIVATE");
	yield* this.radio_connection.post_signal(this, signal);
	let time: Value = time2text(rt.world().realtime, "hh:mm:ss");
	let _T: Value = rt.getStep(f, this, 0);
	if (f.usr) {
		GLOB.lastsignalers.Add(`${time} <B>:</B> ${f.usr.key} used ${this} @ location (${_T.x},${_T.y},${_T.z}) <B>:</B> ${format_frequency(this.frequency)}/${this.code}`);
	}
	return f.dot;
}, true);

// signaler.dm:138
rt.def("/obj/item/device/assembly/signaler/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (!signal) {
		return 0;
	}
	if (signal.encryption != this.code) {
		return 0;
	}
	if (!rt.bitAnd(this.wires, 8)) {
		return 0;
	}
	yield* this.pulse(1);
	this.audible_message(`${bicon(this)} *beep* *beep*`, null, 1);
	return f.dot;
}, true);

// signaler.dm:150
rt.def("/obj/item/device/assembly/signaler/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	if (!GLOB.SSradio) {
		yield* sleep(20);
	}
	if (!GLOB.SSradio) {
		return f.dot;
	}
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, GLOB.RADIO_CHAT);
	return f.dot;
}, true);

rt.type(9381, "/obj/item/device/assembly/signaler/reciever", "/obj/item/device/assembly/signaler", {
	on: 0,
});

// signaler.dm:166
rt.def("/obj/item/device/assembly/signaler/reciever/proc/toggle_safety", function toggle_safety(f: Frame) {
	this.on = (!this.on ? 1 : 0);
	return f.dot;
});

// signaler.dm:169
rt.def("/obj/item/device/assembly/signaler/reciever/proc/activate", function activate(f: Frame) {
	this.toggle_safety();
	return 1;
});

// signaler.dm:173
rt.def("/obj/item/device/assembly/signaler/reciever/proc/describe", function describe(f: Frame) {
	return `The radio receiver is ${this.on ? "on" : "off"}.`;
});

// signaler.dm:176
rt.def("/obj/item/device/assembly/signaler/reciever/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (!this.on) {
		return f.dot;
	}
	return (yield* parent_proc(signal));
}, true);

rt.type(9382, "/obj/item/device/assembly/signaler/anomaly", "/obj/item/device/assembly/signaler", {
	name: "anomaly core",
	desc: "The neutralized core of an anomaly. It'd probably be valuable for research.",
	icon_state: "anomaly core",
	item_state: "electronic",
});

// signaler.dm:188
rt.def("/obj/item/device/assembly/signaler/anomaly/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let A: Value = null;
	if (!signal) {
		return 0;
	}
	if (signal.encryption != this.code) {
		return 0;
	}
	for (A of each(rt.getStep(f, this, 0), T("/obj/effect/anomaly"))) {
		yield* A.anomalyNeutralize();
	}
	return f.dot;
}, true);
