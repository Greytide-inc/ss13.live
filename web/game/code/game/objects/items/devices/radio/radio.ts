// Based on /tg/station's code/game/objects/items/devices/radio/radio.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(9166, "/obj/item/device/radio", "/obj/item/device", {
	on: 1,
	last_transmission: null,
	frequency: 1459,
	traitor_frequency: 0,
	canhear_range: 3,
	patch_link: null,
	secure_radio_connections: null,
	prison_radio: 0,
	b_stat: 0,
	broadcasting: 0,
	listening: 1,
	translate_binary: 0,
	freerange: 0,
	channels: null,
	keyslot: null,
	subspace_switchable: 0,
	subspace_transmission: 0,
	syndie: 0,
	independent: 0,
	freqlock: 0,
	emped: 0,
	TRANSMISSION_DELAY: 5,
	FREQ_LISTENING: 1,
	command: 0,
	use_command: 0,
	flags: 80,
	throw_speed: 3,
	throw_range: 7,
	icon: rt.rsc("icons/obj/radio.dmi"),
	name: "station bounced radio",
	suffix: "[3]",
	icon_state: "walkietalkie",
	item_state: "walkietalkie",
	dog_fashion: rt.typePath("/datum/dog_fashion/back"),
	slot_flags: 512,
	w_class: 2,
	materials: null,
}, { const: ["TRANSMISSION_DELAY","FREQ_LISTENING"] });

// radio.dm:21
rt.def("/obj/item/device/radio/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.channels = list();
	this.materials = rt.alist(f, ["$metal", 75, "$glass", 25]);
	return f.dot;
});

// radio.dm:45
rt.def("/obj/item/device/radio/proc/set_frequency", function set_frequency(f: Frame, new_frequency: Value) {
	remove_radio(this, this.frequency);
	this.frequency = add_radio(this, new_frequency);
	return f.dot;
});

// radio.dm:49
rt.def("/obj/item/device/radio/proc/recalculateChannels", function recalculateChannels(f: Frame) {
	let ch_name: Value = null;
	this.channels = list();
	this.translate_binary = 0;
	this.syndie = 0;
	this.independent = 0;
	if (this.keyslot) {
		for (ch_name of each(this.keyslot.channels)) {
			if (rt.isIn(f, ch_name, this.channels)) {
				continue;
			}
			rt.setAt((this.channels += ch_name), ch_name, rt.index(this.keyslot.channels, ch_name));
		}
		if (this.keyslot.translate_binary) {
			this.translate_binary = 1;
		}
		if (this.keyslot.syndie) {
			this.syndie = 1;
		}
		if (this.keyslot.independent) {
			this.independent = 1;
		}
	}
	ch_name = null;
	for (ch_name of each(this.channels)) {
		rt.setAt(this.secure_radio_connections, ch_name, add_radio(this, rt.index(GLOB.radiochannels, ch_name)));
	}
	return f.dot;
});

// radio.dm:74
rt.def("/obj/item/device/radio/proc/make_syndie", function* make_syndie(f: Frame) {
	yield* qdel(this.keyslot);
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/syndicate")));
	this.syndie = 1;
	this.recalculateChannels();
	return f.dot;
}, true);

// radio.dm:80
rt.def("/obj/item/device/radio/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	remove_radio_all(this);
	this.patch_link = null;
	this.keyslot = null;
	return (yield* parent_proc());
}, true);

// radio.dm:88
rt.def("/obj/item/device/radio/proc/Initialize", function* Initialize(f: Frame) {
	let ch_name: Value = null;
	this.wires = (yield* new_(T("/datum/wires/radio"), this));
	if (this.prison_radio) {
		yield* this.wires.cut("Transmit");
	}
	this.secure_radio_connections = (yield* new_(T("/list")));
	f.dot = (yield* parent_proc());
	this.frequency = sanitize_frequency(this.frequency, this.freerange);
	yield* this.set_frequency(this.frequency);
	for (ch_name of each(this.channels)) {
		rt.setAt(this.secure_radio_connections, ch_name, add_radio(this, rt.index(GLOB.radiochannels, ch_name)));
	}
	return f.dot;
}, true);

// radio.dm:100
rt.def("/obj/item/device/radio/proc/interact", function* interact(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.b_stat && !rt.istype(user, T("/mob/living/silicon/ai"))) {
		yield* this.wires.interact(user);
	} else {
		yield* this.ui_interact(user);
	}
	return f.dot;
}, true);

// radio.dm:109
rt.def("/obj/item/device/radio/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.inventory_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "radio", this.name, 370, 220 + rt.len(f, this.channels) * 22, master_ui, state))).open();
	return f.dot;
}, true);

// radio.dm:115
rt.def("/obj/item/device/radio/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, channel: Value = null;
	let $e: any;
	rt.setAt((data = list()), "broadcasting", this.broadcasting);
	rt.setAt(data, "listening", this.listening);
	rt.setAt(data, "frequency", this.frequency);
	let $0: any = data;
	let $1: any = "minFrequency";
	rt.setAt($0, $1, this.freerange ? 1201 : 1441);
	rt.setAt(data, "maxFrequency", this.freerange ? 1599 : MAX_FREQ);
	rt.setAt(data, "freqlock", this.freqlock);
	rt.setAt(data, "channels", list());
	for (channel of each(this.channels)) {
		rt.setAt(rt.at(data, "channels"), channel, rt.bitAnd(rt.index(this.channels, channel), 1));
	}
	rt.setAt(data, "command", this.command);
	rt.setAt(data, "useCommand", this.use_command);
	rt.setAt(data, "subspace", this.subspace_transmission);
	rt.setAt(data, "subspaceSwitchable", this.subspace_switchable);
	rt.setAt(data, "headset", (rt.istype(this, T("/obj/item/device/radio/headset")) ? 1 : 0));
	return data;
});

// radio.dm:135
rt.def("/obj/item/device/radio/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value) {
	let tune: Value = null, adjust: Value = null, min: Value = null, max: Value = null, channel: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	let $0: any = action;
	if ($0 === "frequency") {
		if (this.freqlock) {
			return f.dot;
		}
		tune = rt.at(params, "tune");
		adjust = text2num(rt.at(params, "adjust"));
		if (tune == "input") {
			if (this.freerange) {
				$0 = 1201;
			} else {
				$0 = 1441;
			}
			min = format_frequency($0);
			if (this.freerange) {
				$0 = 1599;
			} else {
				$0 = MAX_FREQ;
			}
			max = format_frequency($0);
			if ((tune = (yield* g.op(f, "Prompt", [33], [null, format_frequency(this.frequency), this.name, `Tune frequency (${min}-${max}):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (adjust) {
			tune = this.frequency + adjust * 10;
			f.dot = 1;
		} else if (text2num(tune) !== null) {
			tune = tune * 10;
			f.dot = 1;
		}
		if (f.dot) {
			this.frequency = sanitize_frequency(tune, this.freerange);
			yield* this.set_frequency(this.frequency);
			if (this.frequency == this.traitor_frequency && this.hidden_uplink) {
				yield* this.hidden_uplink.interact(f.usr);
				yield* ui.close();
			}
		}
	} else if ($0 === "listen") {
		this.listening = (!this.listening ? 1 : 0);
		f.dot = 1;
	} else if ($0 === "broadcast") {
		this.broadcasting = (!this.broadcasting ? 1 : 0);
		f.dot = 1;
	} else if ($0 === "channel") {
		if (!rt.isIn(f, (channel = rt.at(params, "channel")), this.channels)) {
			return f.dot;
		}
		if (rt.bitAnd(rt.index(this.channels, channel), 1)) {
			(rt.modAt(this.channels, channel, 16777214, rt.bitAnd));
		} else {
			(rt.modAt(this.channels, channel, 1, rt.bitOr));
		}
		f.dot = 1;
	} else if ($0 === "command") {
		this.use_command = (!this.use_command ? 1 : 0);
		f.dot = 1;
	} else if ($0 === "subspace") {
		if (!this.subspace_switchable) return f.dot;
		this.subspace_transmission = (!this.subspace_transmission ? 1 : 0);
		if (!this.subspace_transmission) {
			this.channels = list();
		} else {
			this.recalculateChannels();
		}
		f.dot = 1;
	}
	return f.dot;
}, true);

// radio.dm:189
rt.def("/obj/item/device/radio/proc/talk_into", function* talk_into(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	if (!spans) {
		spans = M.get_spans();
	}
	if (!language) {
		language = (yield* M.get_default_language());
	}
	yield* ImmediateInvokeAsync(this, P("/obj/item/device/radio/proc/talk_into_impl"), M, message, channel, spans, language);
	return 3;
}, true);

// radio.dm:197
rt.def("/obj/item/device/radio/proc/talk_into_impl", function* talk_into_impl(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	let freq: Value = null, jammer: Value = null, speaker: Value = null, jobname: Value = null, findjob: Value = null, B: Value = null, signal: Value = null, R: Value = null, signal_10: Value = null, R_11: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (!M || !message) {
		return f.dot;
	}
	if (this.wires.is_cut("Transmit")) {
		return f.dot;
	}
	if (!M.IsVocal()) {
		return f.dot;
	}
	if (this.use_command) {
		(spans = rt.modify(spans, "command_headset", rt.bitOr));
	}
	if (channel && this.channels && rt.len(f, this.channels) > 0) {
		if (channel == "department") {
			channel = rt.index(this.channels, 1);
		}
		freq = rt.index(this.secure_radio_connections, channel);
		if (!rt.index(this.channels, channel)) {
			return f.dot;
		}
	} else {
		freq = this.frequency;
		channel = null;
	}
	let freqnum: Value = text2num(freq);
	let position: Value = rt.getStep(f, this, 0);
	let jammed: Value = 0;
	for (jammer of each(GLOB.active_jammers, T("/obj/item/device/jammer"))) {
		if (get_dist(position, rt.getStep(f, jammer, 0)) < jammer.range) {
			jammed = 1;
			break;
		}
	}
	let real_name: Value = M.name;
	let mobkey: Value = "none";
	let voicemask: Value = 0;
	let voice: Value = M.GetVoice();
	if (ismob(M)) {
		real_name = (speaker = M).real_name;
		if (speaker.client) {
			mobkey = speaker.key;
		}
	}
	if (jammed) {
		message = Gibberish(message, 100);
	}
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		findjob = find_record("name", voice, GLOB.data_core.general);
		if (voice != real_name) {
			voicemask = 1;
		}
		if (findjob) {
			jobname = rt.index(findjob.fields, "rank");
		} else {
			jobname = "Unknown";
		}
	} else if (rt.istype(M, T("/mob/living/carbon"))) {
		jobname = "No id";
	} else if (rt.istype(M, T("/mob/living/silicon/ai"))) {
		jobname = "AI";
	} else if (rt.istype(M, T("/mob/living/silicon/robot"))) {
		jobname = `${(B = M).designation} Cyborg`;
	} else if (rt.istype(M, T("/mob/living/silicon/pai"))) {
		jobname = "Personal AI";
	} else if (rt.istype(M, T("/obj"))) {
		jobname = "Machine";
	} else {
		jobname = "Unknown";
	}
	if (this.independent) {
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 2;
		signal.data = rt.alist(f, ["mob", M, "mobtype", M.type, "realname", real_name, "name", voice, "job", jobname, "key", mobkey, "vmask", voicemask, "compression", 0, "message", message, "radio", this, "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", 0, "language", language, "spans", spans, "verb_say", M.verb_say, "verb_ask", M.verb_ask, "verb_exclaim", M.verb_exclaim, "verb_yell", M.verb_yell]);
		signal.frequency = freqnum;
		yield* Broadcast_Message(M, voicemask, this, message, voice, jobname, real_name, 5, rt.index(signal.data, "compression"), list(position.z, 0), freq, spans, this.verb_say, this.verb_ask, this.verb_exclaim, this.verb_yell, language);
		return f.dot;
	}
	if (this.subspace_transmission) {
		(signal = (yield* new_(T("/datum/signal")))).transmission_method = 2;
		signal.data = rt.alist(f, ["mob", M, "mobtype", M.type, "realname", real_name, "name", voice, "job", jobname, "key", mobkey, "vmask", voicemask, "compression", rand(35, 65), "message", message, "radio", this, "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", position.z, "language", language, "spans", spans, "verb_say", M.verb_say, "verb_ask", M.verb_ask, "verb_exclaim", M.verb_exclaim, "verb_yell", M.verb_yell]);
		signal.frequency = freq;
		for (R of each(GLOB.telecomms_list, T("/obj/machinery/telecomms/receiver"))) {
			yield* R.receive_signal(signal);
		}
		R = null;
		for (R of each(GLOB.telecomms_list, T("/obj/machinery/telecomms/allinone"))) {
			yield* R.receive_signal(signal);
		}
		return f.dot;
	}
	let filter_type: Value = 2;
	(signal_10 = (yield* new_(T("/datum/signal")))).transmission_method = 2;
	signal_10.data = rt.alist(f, ["mob", M, "mobtype", M.type, "realname", real_name, "name", voice, "job", jobname, "key", mobkey, "vmask", voicemask, "compression", 0, "message", message, "radio", this, "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", position.z, "language", language, "spans", spans, "verb_say", M.verb_say, "verb_ask", M.verb_ask, "verb_exclaim", M.verb_exclaim, "verb_yell", M.verb_yell]);
	signal_10.frequency = freqnum;
	for (R_11 of each(GLOB.telecomms_list, T("/obj/machinery/telecomms/receiver"))) {
		yield* R_11.receive_signal(signal_10);
	}
	rt.spawnTail(f, 20, "/obj/item/device/radio/proc/talk_into_impl: spawn at game/objects/items/devices/radio/radio.dm:431", M, message, channel, spans, language, freq, freqnum, position, jammed, jammer, real_name, mobkey, voicemask, voice, speaker, jobname, findjob, B, signal, R, filter_type, signal_10, R_11);
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }, {  }, {  }, { path: "/list" }, { path: "/datum/language" }] });

// a spawn(20) body of /obj/item/device/radio/proc/talk_into_impl, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/radio/proc/talk_into_impl: spawn at game/objects/items/devices/radio/radio.dm:431", function* (f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value, freq: Value, freqnum: Value, position: Value, jammed: Value, jammer: Value, real_name: Value, mobkey: Value, voicemask: Value, voice: Value, speaker: Value, jobname: Value, findjob: Value, B: Value, signal: Value, R: Value, filter_type: Value, signal_10: Value, R_11: Value) {
	if (rt.isIn(f, (rt.index(signal_10.data, "done") && position.z), rt.index(signal_10.data, "level"))) {
		return f.dot;
	}
	yield* Broadcast_Message(M, voicemask, this, message, voice, jobname, real_name, filter_type, rt.index(signal_10.data, "compression"), list(position.z), freq, spans, this.verb_say, this.verb_ask, this.verb_exclaim, this.verb_yell, language);
	return null;
});

// radio.dm:448
rt.def("/obj/item/device/radio/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (radio_freq) {
		return f.dot;
	}
	if (!this.broadcasting) return f.dot;
	if (!(get_dist(this, speaker) <= this.canhear_range)) return f.dot;
	yield* this.talk_into(speaker, raw_message, null, spans, { language: message_language });
	return f.dot;
}, true);

// radio.dm:468
rt.def("/obj/item/device/radio/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	let position: Value = null, accept: Value = null, ch_name: Value = null;
	if (this.wires.is_cut("Recieve")) {
		return -1;
	}
	if (!this.listening) {
		return -1;
	}
	if (!rt.isIn(f, 0, level)) {
		if (!(position = rt.getStep(f, this, 0)) || !rt.isIn(f, position.z, level)) {
			return -1;
		}
	}
	if (freq == 1213) {
		if (!this.syndie) {
			return -1;
		}
	}
	if (freq == 1337) {
		if (!this.independent) {
			return -1;
		}
	}
	if (!this.on) {
		return -1;
	}
	if (!freq) {
		if (!this.listening) {
			return -1;
		}
	} else {
		if (!(accept = ((freq == this.frequency ? 1 : 0) && this.listening))) {
			for (ch_name of each(this.channels)) {
				if (rt.bitAnd(rt.index(this.channels, ch_name), 1)) {
					if (rt.index(GLOB.radiochannels, ch_name) == text2num(freq) || this.syndie) {
						accept = 1;
						break;
					}
				}
			}
		}
		if (!accept) {
			return -1;
		}
	}
	return this.canhear_range;
});

// radio.dm:507
rt.def("/obj/item/device/radio/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.b_stat) {
		to_chat(user, `<span class='notice'>${this.name} can be attached and modified.</span>`);
	} else {
		to_chat(user, `<span class='notice'>${this.name} can not be modified or attached.</span>`);
	}
	return f.dot;
}, false);

// radio.dm:514
rt.def("/obj/item/device/radio/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		this.b_stat = (!this.b_stat ? 1 : 0);
		if (this.b_stat) {
			to_chat(user, "<span class='notice'>The radio can now be attached and modified!</span>");
		} else {
			to_chat(user, "<span class='notice'>The radio can no longer be modified or attached!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// radio.dm:525
rt.def("/obj/item/device/radio/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let ch_name: Value = null;
	this.emped++;
	let curremp: Value = this.emped;
	if (this.listening && ismob(this.loc)) {
		to_chat(this.loc, fmt("<span class='warning'>＄！ overloads.</span>", [this]));
	}
	this.broadcasting = 0;
	this.listening = 0;
	for (ch_name of each(this.channels)) {
		rt.setAt(this.channels, ch_name, 0);
	}
	this.on = 0;
	rt.spawnTail(f, 200, "/obj/item/device/radio/proc/emp_act: spawn at game/objects/items/devices/radio/radio.dm:534", curremp, ch_name);
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn(200) body of /obj/item/device/radio/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/radio/proc/emp_act: spawn at game/objects/items/devices/radio/radio.dm:534", function* (f: Frame, curremp: Value, ch_name: Value) {
	if (this.emped == curremp) {
		this.emped = 0;
		if (!rt.istype(this, T("/obj/item/device/radio/intercom"))) {
			this.on = 1;
		}
	}
	return null;
});

rt.type(9207, "/obj/item/device/radio/borg", "/obj/item/device/radio", {
	subspace_switchable: 1,
	name: "cyborg radio",
	dog_fashion: null,
});

// radio.dm:552
rt.def("/obj/item/device/radio/borg/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	if (!this.secondary_flags) {
		this.secondary_flags = list();
	}
	rt.setAt(this.secondary_flags, "no_emp_wires", 1);
	return f.dot;
}, true);

rt.type(9208, "/obj/item/device/radio/borg/syndicate", "/obj/item/device/radio/borg", {
	syndie: 1,
	keyslot: null,
});

// radio.dm:557
rt.def("/obj/item/device/radio/borg/syndicate/proc/<init>", function* _init_(f: Frame) {
	yield* parent_proc();
	this.keyslot = (yield* new_(T("/obj/item/device/encryptionkey/syndicate")));
	return f.dot;
}, true);

// radio.dm:560
rt.def("/obj/item/device/radio/borg/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.set_frequency(1213);
	return f.dot;
}, true);

// radio.dm:565
rt.def("/obj/item/device/radio/borg/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let ch_name: Value = null, _T: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.keyslot) {
			for (ch_name of each(this.channels)) {
				yield* GLOB.SSradio.remove_object(this, rt.index(GLOB.radiochannels, ch_name));
				rt.setAt(this.secure_radio_connections, ch_name, null);
			}
			if (this.keyslot) {
				if (_T = rt.getStep(f, user, 0)) {
					this.keyslot.loc = _T;
					this.keyslot = null;
				}
			}
			this.recalculateChannels();
			to_chat(user, "<span class='notice'>You pop out the encryption key in the radio.</span>");
		} else {
			to_chat(user, "<span class='warning'>This radio doesn't have any encryption keys!</span>");
		}
	} else {
		if (!rt.istype(W, T("/obj/item/device/encryptionkey"))) return f.dot;
		if (this.keyslot) {
			to_chat(user, "<span class='warning'>The radio can't hold another key!</span>");
			return f.dot;
		}
		if (!this.keyslot) {
			if (!(yield* user.transferItemToLoc(W, this))) {
				return f.dot;
			}
			this.keyslot = W;
		}
		this.recalculateChannels();
	}
	return f.dot;
}, true);
