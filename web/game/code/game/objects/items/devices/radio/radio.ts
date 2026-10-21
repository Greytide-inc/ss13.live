// From code/game/objects/items/devices/radio/radio.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/device/radio/proc/<init>  (code/game/objects/items/devices/radio/radio.dm:21)
rt.def("/obj/item/device/radio/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "channels", rt.list());
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 75, "$glass", 25]));
	return f.dot;
});

// /obj/item/device/radio/proc/set_frequency  (code/game/objects/items/devices/radio/radio.dm:45)
rt.def("/obj/item/device/radio/proc/set_frequency", function set_frequency(f: Frame, new_frequency: Value) {
	rt.call(f, P("/proc/remove_radio"), null, [live(f.src), rt.sv(f, "frequency")]);
	rt.setSv(f, "frequency", rt.call(f, P("/proc/add_radio"), null, [live(f.src), live(new_frequency)]));
	return f.dot;
});

// /obj/item/device/radio/proc/recalculateChannels  (code/game/objects/items/devices/radio/radio.dm:49)
rt.def("/obj/item/device/radio/proc/recalculateChannels", function recalculateChannels(f: Frame) {
	let ch_name: Value = null;
	let $e: any;
	f.vars = () => [ch_name, $e];
	rt.setSv(f, "channels", rt.list());
	rt.setSv(f, "translate_binary", 0);
	rt.setSv(f, "syndie", 0);
	rt.setSv(f, "independent", 0);
	if (truthy(rt.sv(f, "keyslot"))) {
		ch_name = null;
		rt.forList(f, 0, rt.fv(f, "channels", rt.sv(f, "keyslot")));
		while (($e = rt.next(f, 0)) !== undefined) {
			ch_name = $e;
			if (truthy((rt.isIn(f, live(ch_name), rt.fv(f, "channels", live(f.src))) ? 1 : 0))) {
				continue;
			}
			rt.setAt((rt.modSrcVar(f, "channels", live(ch_name), add)), live(ch_name), rt.index(rt.fv(f, "channels", rt.sv(f, "keyslot")), live(ch_name)));
		}
		rt.endFor(f, 0);
		if (truthy(rt.fv(f, "translate_binary", rt.sv(f, "keyslot")))) {
			rt.setSv(f, "translate_binary", 1);
		}
		if (truthy(rt.fv(f, "syndie", rt.sv(f, "keyslot")))) {
			rt.setSv(f, "syndie", 1);
		}
		if (truthy(rt.fv(f, "independent", rt.sv(f, "keyslot")))) {
			rt.setSv(f, "independent", 1);
		}
	}
	ch_name = null;
	rt.forList(f, 0, rt.sv(f, "channels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ch_name = $e;
		rt.setAt(rt.sv(f, "secure_radio_connections"), live(ch_name), rt.call(f, P("/proc/add_radio"), null, [live(f.src), rt.index(rt.gl("radiochannels"), live(ch_name))]));
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/device/radio/proc/make_syndie  (code/game/objects/items/devices/radio/radio.dm:74)  may sleep
rt.def("/obj/item/device/radio/proc/make_syndie", function* make_syndie(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "keyslot")]);
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/syndicate"), [])));
	rt.setSv(f, "syndie", 1);
	yield* g.srcCall(f, "recalculateChannels");
	return f.dot;
}, true);

// /obj/item/device/radio/proc/Destroy  (code/game/objects/items/devices/radio/radio.dm:80)  may sleep
rt.def("/obj/item/device/radio/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "wires")]);
	rt.setSv(f, "wires", null);
	yield* g.call(f, P("/proc/remove_radio_all"), null, [live(f.src)]);
	rt.setSv(f, "patch_link", null);
	rt.setSv(f, "keyslot", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/radio/proc/Initialize  (code/game/objects/items/devices/radio/radio.dm:88)  may sleep
rt.def("/obj/item/device/radio/proc/Initialize", function* Initialize(f: Frame) {
	let ch_name: Value = null;
	let $e: any;
	f.vars = () => [ch_name, $e];
	rt.setSv(f, "wires", (yield* g.new_(f, T("/datum/wires/radio"), [live(f.src)])));
	if (truthy(rt.sv(f, "prison_radio"))) {
		yield* g.callName(f, rt.sv(f, "wires"), "cut", ["Transmit"]);
	}
	rt.setSv(f, "secure_radio_connections", (yield* g.new_(f, T("/list"), [])));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "frequency", (yield* g.call(f, P("/proc/sanitize_frequency"), null, [rt.sv(f, "frequency"), rt.sv(f, "freerange")])));
	yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
	ch_name = null;
	rt.forList(f, 0, rt.sv(f, "channels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ch_name = $e;
		rt.setAt(rt.sv(f, "secure_radio_connections"), live(ch_name), (yield* g.call(f, P("/proc/add_radio"), null, [live(f.src), rt.index(rt.gl("radiochannels"), live(ch_name))])));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/device/radio/proc/interact  (code/game/objects/items/devices/radio/radio.dm:100)  may sleep
rt.def("/obj/item/device/radio/proc/interact", function* interact(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "b_stat")) && !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		yield* g.callName(f, rt.sv(f, "wires"), "interact", [live(f.args[0])]);
	} else {
		yield* g.srcCall(f, "ui_interact", live(f.args[0]));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/device/radio/proc/ui_interact  (code/game/objects/items/devices/radio/radio.dm:109)  may sleep
rt.def("/obj/item/device/radio/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(ui) === null) {
		ui = null;
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(master_ui) === null) {
		master_ui = null;
	}
	if (live(state) === null) {
		state = rt.gl("inventory_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "radio", rt.sv(f, "name"), 370, add(220, multiply(rt.len(f, rt.sv(f, "channels")), 22)), live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/device/radio/proc/ui_data  (code/game/objects/items/devices/radio/radio.dm:115)
rt.def("/obj/item/device/radio/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, channel: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [data, channel, $0, $1, $2, $e];
	rt.setAt((data = rt.list()), "broadcasting", rt.sv(f, "broadcasting"));
	rt.setAt(live(data), "listening", rt.sv(f, "listening"));
	rt.setAt(live(data), "frequency", rt.sv(f, "frequency"));
	$0 = live(data);
	$1 = "minFrequency";
	if (truthy(rt.sv(f, "freerange"))) {
		$2 = 1201;
	} else {
		$2 = 1441;
	}
	rt.setAt($0, $1, $2);
	$0 = live(data);
	$1 = "maxFrequency";
	if (truthy(rt.sv(f, "freerange"))) {
		$2 = 1599;
	} else {
		$2 = 1489;
	}
	rt.setAt($0, $1, $2);
	rt.setAt(live(data), "freqlock", rt.sv(f, "freqlock"));
	rt.setAt(live(data), "channels", rt.list());
	channel = null;
	rt.forList(f, 0, rt.sv(f, "channels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		channel = $e;
		rt.setAt(rt.at(live(data), "channels"), live(channel), rt.bitAnd(rt.index(rt.sv(f, "channels"), live(channel)), 1));
	}
	rt.endFor(f, 0);
	rt.setAt(live(data), "command", rt.sv(f, "command"));
	rt.setAt(live(data), "useCommand", rt.sv(f, "use_command"));
	rt.setAt(live(data), "subspace", rt.sv(f, "subspace_transmission"));
	rt.setAt(live(data), "subspaceSwitchable", rt.sv(f, "subspace_switchable"));
	rt.setAt(live(data), "headset", (rt.istype(live(f.src), T("/obj/item/device/radio/headset")) ? 1 : 0));
	return live(data);
});

// /obj/item/device/radio/proc/ui_act  (code/game/objects/items/devices/radio/radio.dm:135)  may sleep
rt.def("/obj/item/device/radio/proc/ui_act", function* ui_act(f: Frame) {
	let tune: Value = null, adjust: Value = null, min: Value = null, max: Value = null, channel: Value = null;
	let $0: any;
	f.vars = () => [tune, adjust, min, max, channel, $0];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	$0 = live(f.args[0]);
	if ($0 === "frequency") {
		if (truthy(rt.sv(f, "freqlock"))) {
			return live(f.dot);
		}
		tune = rt.at(live(f.args[1]), "tune");
		adjust = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "adjust")]));
		if (isEqual(live(tune), "input")) {
			if (truthy(rt.sv(f, "freerange"))) {
				$0 = 1201;
			} else {
				$0 = 1441;
			}
			min = (yield* g.call(f, P("/proc/format_frequency"), null, [$0]));
			if (truthy(rt.sv(f, "freerange"))) {
				$0 = 1599;
			} else {
				$0 = 1489;
			}
			max = (yield* g.call(f, P("/proc/format_frequency"), null, [$0]));
			if (((tune = (yield* g.op(f, "Prompt", [33], [null, (yield* g.call(f, P("/proc/format_frequency"), null, [rt.sv(f, "frequency")])), rt.sv(f, "name"), fmt("Tune frequency (＀-＀):", [live(min), live(max)]), null]))) !== null && !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
				f.dot = 1;
			}
		} else {
			if (truthy(live(adjust))) {
				tune = add(rt.sv(f, "frequency"), multiply(live(adjust), 10));
				f.dot = 1;
			} else {
				if ((yield* g.call(f, P("/proc/text2num"), null, [live(tune)])) !== null) {
					tune = multiply(live(tune), 10);
					f.dot = 1;
				}
			}
		}
		if (truthy(live(f.dot))) {
			rt.setSv(f, "frequency", (yield* g.call(f, P("/proc/sanitize_frequency"), null, [live(tune), rt.sv(f, "freerange")])));
			yield* g.srcCall(f, "set_frequency", rt.sv(f, "frequency"));
			if ((isEqual(rt.sv(f, "frequency"), rt.sv(f, "traitor_frequency")) && truthy(rt.sv(f, "hidden_uplink")))) {
				yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(f.usr)]);
				yield* g.callName(f, live(f.args[2]), "close", []);
			}
		}
	} else if ($0 === "listen") {
		rt.setSv(f, "listening", (!truthy(rt.sv(f, "listening")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "broadcast") {
		rt.setSv(f, "broadcasting", (!truthy(rt.sv(f, "broadcasting")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "channel") {
		if (!truthy((rt.isIn(f, (channel = rt.at(live(f.args[1]), "channel")), rt.sv(f, "channels")) ? 1 : 0))) {
			return live(f.dot);
		}
		if (truthy(rt.bitAnd(rt.index(rt.sv(f, "channels"), live(channel)), 1))) {
			(rt.modAt(rt.sv(f, "channels"), live(channel), 16777214, rt.bitAnd));
		} else {
			(rt.modAt(rt.sv(f, "channels"), live(channel), 1, rt.bitOr));
		}
		f.dot = 1;
	} else if ($0 === "command") {
		rt.setSv(f, "use_command", (!truthy(rt.sv(f, "use_command")) ? 1 : 0));
		f.dot = 1;
	} else if ($0 === "subspace") {
		if (!truthy(rt.sv(f, "subspace_switchable"))) return f.dot;
		rt.setSv(f, "subspace_transmission", (!truthy(rt.sv(f, "subspace_transmission")) ? 1 : 0));
		if (!truthy(rt.sv(f, "subspace_transmission"))) {
			rt.setSv(f, "channels", rt.list());
		} else {
			yield* g.srcCall(f, "recalculateChannels");
		}
		f.dot = 1;
	}
	return f.dot;
}, true, { args: ["action", "params", "ui"] });

// /obj/item/device/radio/proc/talk_into  (code/game/objects/items/devices/radio/radio.dm:189)  may sleep
rt.def("/obj/item/device/radio/proc/talk_into", function* talk_into(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	f.vars = () => [M, message, channel, spans, language];
	if (!truthy(live(spans))) {
		spans = (yield* g.callName(f, live(M), "get_spans", []));
	}
	if (!truthy(live(language))) {
		language = (yield* g.callName(f, live(M), "get_default_language", []));
	}
	yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/item/device/radio/proc/talk_into_impl"), live(M), live(message), live(channel), live(spans), live(language)]);
	return 3;
}, true);

// /obj/item/device/radio/proc/talk_into_impl  (code/game/objects/items/devices/radio/radio.dm:197)  may sleep
rt.def("/obj/item/device/radio/proc/talk_into_impl", function* talk_into_impl(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	let freq: Value = null, freqnum: Value = null, position: Value = null, jammed: Value = null, jammer: Value = null, real_name: Value = null, mobkey: Value = null, voicemask: Value = null, voice: Value = null, speaker: Value = null, jobname: Value = null, findjob: Value = null, B: Value = null, signal: Value = null, R: Value = null, filter_type: Value = null, signal_10: Value = null, R_11: Value = null;
	let $e: any;
	f.vars = () => [M, message, channel, spans, language, freq, freqnum, position, jammed, jammer, real_name, mobkey, voicemask, voice, speaker, jobname, findjob, B, signal, R, filter_type, signal_10, R_11, $e];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if ((!truthy(live(M)) || !truthy(live(message)))) {
		return live(f.dot);
	}
	if (truthy((yield* g.callName(f, rt.sv(f, "wires"), "is_cut", ["Transmit"])))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(M), "IsVocal", [])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "use_command"))) {
		(spans = rt.modify(live(spans), "command_headset", rt.bitOr));
	}
	freq = null;
	if (((truthy(live(channel)) && truthy(rt.sv(f, "channels"))) && rt.gt(rt.len(f, rt.sv(f, "channels")), 0))) {
		if (isEqual(live(channel), "department")) {
			channel = rt.index(rt.sv(f, "channels"), 1);
		}
		freq = rt.index(rt.sv(f, "secure_radio_connections"), live(channel));
		if (!truthy(rt.index(rt.sv(f, "channels"), live(channel)))) {
			return live(f.dot);
		}
	} else {
		freq = rt.sv(f, "frequency");
		channel = null;
	}
	freqnum = (yield* g.call(f, P("/proc/text2num"), null, [live(freq)]));
	position = rt.getStep(f, live(f.src), 0);
	jammed = 0;
	jammer = null;
	rt.forList(f, 0, rt.gl("active_jammers"), T("/obj/item/device/jammer"));
	while (($e = rt.next(f, 0)) !== undefined) {
		jammer = $e;
		if (rt.lt((yield* g.call(f, P("/proc/get_dist"), null, [live(position), rt.getStep(f, live(jammer), 0)])), rt.fv(f, "range", live(jammer)))) {
			jammed = 1;
			break;
		}
	}
	rt.endFor(f, 0);
	real_name = rt.fv(f, "name", live(M));
	mobkey = "none";
	voicemask = 0;
	voice = (yield* g.callName(f, live(M), "GetVoice", []));
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [live(M)])))) {
		real_name = rt.gv(f, "real_name", (speaker = live(M)));
		if (truthy(rt.fv(f, "client", live(speaker)))) {
			mobkey = rt.fv(f, "key", live(speaker));
		}
	}
	jobname = null;
	if (truthy(live(jammed))) {
		message = (yield* g.call(f, P("/proc/Gibberish"), null, [live(message), 100]));
	}
	if (truthy((rt.istype(live(M), T("/mob/living/carbon/human")) ? 1 : 0))) {
		findjob = (yield* g.call(f, P("/proc/find_record"), null, ["name", live(voice), rt.fv(f, "general", rt.gl("data_core"))]));
		if (!isEqual(live(voice), live(real_name))) {
			voicemask = 1;
		}
		if (truthy(live(findjob))) {
			jobname = rt.index(rt.fv(f, "fields", live(findjob)), "rank");
		} else {
			jobname = "Unknown";
		}
	} else {
		if (truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0))) {
			jobname = "No id";
		} else {
			if (truthy((rt.istype(live(M), T("/mob/living/silicon/ai")) ? 1 : 0))) {
				jobname = "AI";
			} else {
				if (truthy((rt.istype(live(M), T("/mob/living/silicon/robot")) ? 1 : 0))) {
					jobname = fmt("＀ Cyborg", [rt.gv(f, "designation", (B = live(M)))]);
				} else {
					if (truthy((rt.istype(live(M), T("/mob/living/silicon/pai")) ? 1 : 0))) {
						jobname = "Personal AI";
					} else {
						if (truthy((rt.istype(live(M), T("/obj")) ? 1 : 0))) {
							jobname = "Machine";
						} else {
							jobname = "Unknown";
						}
					}
				}
			}
		}
	}
	if (truthy(rt.sv(f, "independent"))) {
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 2);
		rt.setFv(f, "data", live(signal), rt.alist(f, ["mob", live(M), "mobtype", rt.fv(f, "type", live(M)), "realname", live(real_name), "name", live(voice), "job", live(jobname), "key", live(mobkey), "vmask", live(voicemask), "compression", 0, "message", live(message), "radio", live(f.src), "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", 0, "language", live(language), "spans", live(spans), "verb_say", rt.fv(f, "verb_say", live(M)), "verb_ask", rt.fv(f, "verb_ask", live(M)), "verb_exclaim", rt.fv(f, "verb_exclaim", live(M)), "verb_yell", rt.fv(f, "verb_yell", live(M))]));
		rt.setFv(f, "frequency", live(signal), live(freqnum));
		yield* g.call(f, P("/proc/Broadcast_Message"), null, [live(M), live(voicemask), live(f.src), live(message), live(voice), live(jobname), live(real_name), 5, rt.index(rt.fv(f, "data", live(signal)), "compression"), rt.list(rt.fv(f, "z", live(position)), 0), live(freq), live(spans), rt.sv(f, "verb_say"), rt.sv(f, "verb_ask"), rt.sv(f, "verb_exclaim"), rt.sv(f, "verb_yell"), live(language)]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "subspace_transmission"))) {
		rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 2);
		rt.setFv(f, "data", live(signal), rt.alist(f, ["mob", live(M), "mobtype", rt.fv(f, "type", live(M)), "realname", live(real_name), "name", live(voice), "job", live(jobname), "key", live(mobkey), "vmask", live(voicemask), "compression", (yield* g.call(f, P("/proc/rand"), null, [35, 65])), "message", live(message), "radio", live(f.src), "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", rt.fv(f, "z", live(position)), "language", live(language), "spans", live(spans), "verb_say", rt.fv(f, "verb_say", live(M)), "verb_ask", rt.fv(f, "verb_ask", live(M)), "verb_exclaim", rt.fv(f, "verb_exclaim", live(M)), "verb_yell", rt.fv(f, "verb_yell", live(M))]));
		rt.setFv(f, "frequency", live(signal), live(freq));
		R = null;
		rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms/receiver"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "receive_signal", [live(signal)]);
		}
		rt.endFor(f, 0);
		R = null;
		rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms/allinone"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "receive_signal", [live(signal)]);
		}
		rt.endFor(f, 0);
		return live(f.dot);
	}
	filter_type = 2;
	rt.setFv(f, "transmission_method", (signal_10 = (yield* g.new_(f, T("/datum/signal"), []))), 2);
	rt.setFv(f, "data", live(signal_10), rt.alist(f, ["mob", live(M), "mobtype", rt.fv(f, "type", live(M)), "realname", live(real_name), "name", live(voice), "job", live(jobname), "key", live(mobkey), "vmask", live(voicemask), "compression", 0, "message", live(message), "radio", live(f.src), "slow", 0, "traffic", 0, "type", 0, "server", null, "reject", 0, "level", rt.fv(f, "z", live(position)), "language", live(language), "spans", live(spans), "verb_say", rt.fv(f, "verb_say", live(M)), "verb_ask", rt.fv(f, "verb_ask", live(M)), "verb_exclaim", rt.fv(f, "verb_exclaim", live(M)), "verb_yell", rt.fv(f, "verb_yell", live(M))]));
	rt.setFv(f, "frequency", live(signal_10), live(freqnum));
	R_11 = null;
	rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms/receiver"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R_11 = $e;
		yield* g.callName(f, live(R_11), "receive_signal", [live(signal_10)]);
	}
	rt.endFor(f, 0);
	rt.spawnTail(f, 20, "/obj/item/device/radio/proc/talk_into_impl: spawn at game/objects/items/devices/radio/radio.dm:431", M, message, channel, spans, language, freq, freqnum, position, jammed, jammer, real_name, mobkey, voicemask, voice, speaker, jobname, findjob, B, signal, R, filter_type, signal_10, R_11);
	return f.dot;
}, true, { argTypes: [{ path: "/atom/movable" }, {  }, {  }, { path: "/list" }, { path: "/datum/language" }] });

// a spawn(20) body of /obj/item/device/radio/proc/talk_into_impl, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/radio/proc/talk_into_impl: spawn at game/objects/items/devices/radio/radio.dm:431", function* (f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value, freq: Value, freqnum: Value, position: Value, jammed: Value, jammer: Value, real_name: Value, mobkey: Value, voicemask: Value, voice: Value, speaker: Value, jobname: Value, findjob: Value, B: Value, signal: Value, R: Value, filter_type: Value, signal_10: Value, R_11: Value) {
	f.vars = () => [M, message, channel, spans, language, freq, freqnum, position, jammed, jammer, real_name, mobkey, voicemask, voice, speaker, jobname, findjob, B, signal, R, filter_type, signal_10, R_11];
	if (truthy((rt.isIn(f, (rt.index(rt.fv(f, "data", live(signal_10)), "done") && rt.fv(f, "z", live(position))), rt.index(rt.fv(f, "data", live(signal_10)), "level")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/Broadcast_Message"), null, [live(M), live(voicemask), live(f.src), live(message), live(voice), live(jobname), live(real_name), live(filter_type), rt.index(rt.fv(f, "data", live(signal_10)), "compression"), rt.list(rt.fv(f, "z", live(position))), live(freq), live(spans), rt.sv(f, "verb_say"), rt.sv(f, "verb_ask"), rt.sv(f, "verb_exclaim"), rt.sv(f, "verb_yell"), live(language)]);
	return null;
});

// /obj/item/device/radio/proc/Hear  (code/game/objects/items/devices/radio/radio.dm:448)  may sleep
rt.def("/obj/item/device/radio/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_language: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	f.vars = () => [message, speaker, message_language, raw_message, radio_freq, spans, message_mode];
	if (truthy(live(radio_freq))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "broadcasting"))) return f.dot;
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(speaker)])), rt.sv(f, "canhear_range"))) return f.dot;
	yield* g.callSrc(f, "talk_into", [null, live(speaker), null, live(raw_message), null, null, null, live(spans), "language", live(message_language)], rt.Args.Named);
	return f.dot;
}, true);

// /obj/item/device/radio/proc/receive_range  (code/game/objects/items/devices/radio/radio.dm:468)
rt.def("/obj/item/device/radio/proc/receive_range", function receive_range(f: Frame, freq: Value, level: Value) {
	let position: Value = null, accept: Value = null, ch_name: Value = null;
	let $e: any;
	f.vars = () => [position, accept, ch_name, $e];
	if (truthy(rt.callName(f, rt.sv(f, "wires"), "is_cut", ["Recieve"]))) {
		return -1;
	}
	if (!truthy(rt.sv(f, "listening"))) {
		return -1;
	}
	if (!truthy((rt.isIn(f, 0, live(level)) ? 1 : 0))) {
		if ((!truthy((position = rt.getStep(f, live(f.src), 0))) || !truthy((rt.isIn(f, rt.fv(f, "z", live(position)), live(level)) ? 1 : 0)))) {
			return -1;
		}
	}
	if (isEqual(live(freq), 1213)) {
		if (!truthy(rt.fv(f, "syndie", live(f.src)))) {
			return -1;
		}
	}
	if (isEqual(live(freq), 1337)) {
		if (!truthy(rt.sv(f, "independent"))) {
			return -1;
		}
	}
	if (!truthy(rt.sv(f, "on"))) {
		return -1;
	}
	if (!truthy(live(freq))) {
		if (!truthy(rt.sv(f, "listening"))) {
			return -1;
		}
	} else {
		if (!truthy((accept = ((isEqual(live(freq), rt.sv(f, "frequency")) ? 1 : 0) && rt.sv(f, "listening"))))) {
			ch_name = null;
			rt.forList(f, 0, rt.sv(f, "channels"));
			while (($e = rt.next(f, 0)) !== undefined) {
				ch_name = $e;
				if (truthy(rt.bitAnd(rt.index(rt.sv(f, "channels"), live(ch_name)), 1))) {
					if ((isEqual(rt.index(rt.gl("radiochannels"), live(ch_name)), rt.call(f, P("/proc/text2num"), null, [live(freq)])) || truthy(rt.sv(f, "syndie")))) {
						accept = 1;
						break;
					}
				}
			}
			rt.endFor(f, 0);
		}
		if (!truthy(live(accept))) {
			return -1;
		}
	}
	return rt.sv(f, "canhear_range");
});

// /obj/item/device/radio/proc/send_hear  (code/game/objects/items/devices/radio/radio.dm:501)
rt.def("/obj/item/device/radio/proc/send_hear", function send_hear(f: Frame, freq: Value, level: Value) {
	let range: Value = null;
	f.vars = () => [range];
	if (!rt.gt((range = rt.callSrc(f, "receive_range", [live(freq), live(level)])), -1)) return f.dot;
	return rt.call(f, P("/proc/get_hearers_in_view"), null, [rt.sv(f, "canhear_range"), live(f.src)]);
});

// /obj/item/device/radio/proc/examine  (code/game/objects/items/devices/radio/radio.dm:507)
rt.def("/obj/item/device/radio/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "b_stat"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ can be attached and modified.</span>", [rt.sv(f, "name")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＀ can not be modified or attached.</span>", [rt.sv(f, "name")])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/device/radio/proc/attackby  (code/game/objects/items/devices/radio/radio.dm:514)  may sleep
rt.def("/obj/item/device/radio/proc/attackby", function* attackby(f: Frame) {
	yield* g.srcCall(f, "add_fingerprint", live(f.args[1]));
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		rt.setSv(f, "b_stat", (!truthy(rt.sv(f, "b_stat")) ? 1 : 0));
		if (truthy(rt.sv(f, "b_stat"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The radio can now be attached and modified!</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>The radio can no longer be modified or attached!</span>"]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/radio/proc/emp_act  (code/game/objects/items/devices/radio/radio.dm:525)  may sleep
rt.def("/obj/item/device/radio/proc/emp_act", function* emp_act(f: Frame) {
	let curremp: Value = null, ch_name: Value = null;
	let $e: any;
	f.vars = () => [curremp, ch_name, $e];
	rt.incSrcVar(f, "emped", 1, true);
	curremp = rt.sv(f, "emped");
	if ((truthy(rt.sv(f, "listening")) && truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='warning'>＄！ overloads.</span>", [live(f.src)])]);
	}
	rt.setSv(f, "broadcasting", 0);
	rt.setSv(f, "listening", 0);
	ch_name = null;
	rt.forList(f, 0, rt.sv(f, "channels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		ch_name = $e;
		rt.setAt(rt.sv(f, "channels"), live(ch_name), 0);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "on", 0);
	rt.spawnTail(f, 200, "/obj/item/device/radio/proc/emp_act: spawn at game/objects/items/devices/radio/radio.dm:534", curremp, ch_name);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// a spawn(200) body of /obj/item/device/radio/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/radio/proc/emp_act: spawn at game/objects/items/devices/radio/radio.dm:534", function* (f: Frame, curremp: Value, ch_name: Value) {
	f.vars = () => [curremp, ch_name];
	if (isEqual(rt.sv(f, "emped"), live(curremp))) {
		rt.setSv(f, "emped", 0);
		if (!truthy((rt.istype(live(f.src), T("/obj/item/device/radio/intercom")) ? 1 : 0))) {
			rt.setSv(f, "on", 1);
		}
	}
	return null;
});

rt.type(9207, "/obj/item/device/radio/borg", "/obj/item/device/radio", {
	subspace_switchable: 1,
	name: "cyborg radio",
	dog_fashion: null,
});

// /obj/item/device/radio/borg/proc/Initialize  (code/game/objects/items/devices/radio/radio.dm:552)  may sleep
rt.def("/obj/item/device/radio/borg/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		rt.setFv(f, "secondary_flags", live(f.src), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.src)), "no_emp_wires", 1);
	return f.dot;
}, true, { args: ["mapload"] });

rt.type(9208, "/obj/item/device/radio/borg/syndicate", "/obj/item/device/radio/borg", {
	syndie: 1,
	keyslot: null,
});

// /obj/item/device/radio/borg/syndicate/proc/<init>  (code/game/objects/items/devices/radio/radio.dm:557)  may sleep
rt.def("/obj/item/device/radio/borg/syndicate/proc/<init>", function* _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = (yield* g.callSuper(f, []));
	rt.setSv(f, "keyslot", (yield* g.new_(f, T("/obj/item/device/encryptionkey/syndicate"), [])));
	return f.dot;
}, true);

// /obj/item/device/radio/borg/syndicate/proc/Initialize  (code/game/objects/items/devices/radio/radio.dm:560)  may sleep
rt.def("/obj/item/device/radio/borg/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "set_frequency", 1213);
	return f.dot;
}, true);

// /obj/item/device/radio/borg/proc/attackby  (code/game/objects/items/devices/radio/radio.dm:565)  may sleep
rt.def("/obj/item/device/radio/borg/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let ch_name: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [W, user, params, ch_name, _T, $e];
	if (truthy((rt.istype(live(W), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "keyslot"))) {
			ch_name = null;
			rt.forList(f, 0, rt.sv(f, "channels"));
			while (($e = rt.next(f, 0)) !== undefined) {
				ch_name = $e;
				yield* g.callName(f, rt.gl("SSradio"), "remove_object", [live(f.src), rt.index(rt.gl("radiochannels"), live(ch_name))]);
				rt.setAt(rt.sv(f, "secure_radio_connections"), live(ch_name), null);
			}
			rt.endFor(f, 0);
			if (truthy(rt.sv(f, "keyslot"))) {
				if (truthy((_T = rt.getStep(f, live(user), 0)))) {
					rt.setFv(f, "loc", rt.sv(f, "keyslot"), live(_T));
					rt.setSv(f, "keyslot", null);
				}
			}
			yield* g.srcCall(f, "recalculateChannels");
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You pop out the encryption key in the radio.</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This radio doesn't have any encryption keys!</span>"]);
		}
	} else {
		if (!truthy((rt.istype(live(W), T("/obj/item/device/encryptionkey")) ? 1 : 0))) return f.dot;
		if (truthy(rt.sv(f, "keyslot"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The radio can't hold another key!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "keyslot"))) {
			if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(W), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "keyslot", live(W));
		}
		yield* g.srcCall(f, "recalculateChannels");
	}
	return f.dot;
}, true);
