// Based on /tg/station's code/game/machinery/telecomms/broadcasting.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// broadcasting.dm:65
rt.def("/proc/Broadcast_Message", function* Broadcast_Message(f: Frame, AM: Value, vmask: Value, radio: Value, message: Value, name: Value, job: Value, realname: Value, data: Value, compression: Value, level: Value, freq: Value, spans: Value, verb_say: Value, verb_ask: Value, verb_exclaim: Value, verb_yell: Value, language: Value) {
	let virt: Value = null, R: Value = null, freqtext: Value = null, R_3: Value = null, M: Value = null, hearer: Value = null;
	if (!(message = copytext(message, 1, 512))) {
		return f.dot;
	}
	let radios: Value = list();
	(virt = (yield* new_(T("/atom/movable/virtualspeaker"), null))).name = name;
	virt.job = job;
	virt.source = AM;
	virt.radio = radio;
	virt.verb_say = verb_say;
	virt.verb_ask = verb_ask;
	virt.verb_exclaim = verb_exclaim;
	virt.verb_yell = verb_yell;
	if (compression > 0) {
		message = Gibberish(message, compression + 40);
	}
	if (data == 1) {
		for (R of each(rt.index(GLOB.all_radios, `${freq}`), T("/obj/item/device/radio/intercom"))) {
			if (R.receive_range(freq, level) > -1) {
				radios += R;
			}
		}
	} else if (data == 2) {
		R = null;
		for (R of each(rt.index(GLOB.all_radios, `${freq}`), T("/obj/item/device/radio"))) {
			if (R.subspace_transmission) {
				continue;
			}
			if (R.receive_range(freq, level) > -1) {
				radios += R;
			}
		}
	} else if (data == 5) {
		R = null;
		for (R of each(rt.index(GLOB.all_radios, `${freq}`), T("/obj/item/device/radio"))) {
			if (!R.independent) {
				continue;
			}
			if (R.receive_range(freq, level) > -1) {
				radios += R;
			}
		}
	} else {
		R = null;
		for (R of each(rt.index(GLOB.all_radios, `${freq}`), T("/obj/item/device/radio"))) {
			if (R.receive_range(freq, level) > -1) {
				radios += R;
			}
		}
		freqtext = num2text(freq);
		for (R_3 of each(rt.index(GLOB.all_radios, `${1213}`), T("/obj/item/device/radio"))) {
			if (rt.isIn(f, ((R_3.receive_range(1213, list(R_3.z)) > -1 ? 1 : 0) && freqtext), GLOB.reverseradiochannels)) {
				(radios = rt.modify(radios, R_3, rt.bitOr));
			}
		}
	}
	let receive: Value = get_mobs_in_radio_ranges(radios);
	R_3 = null;
	for (R_3 of each(receive, T("/mob"))) {
		if (R_3.client && R_3.client.holder && !rt.bitAnd(R_3.client.prefs.chat_toggles, 32)) {
			receive -= R_3;
		}
	}
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/dead/observer")) && M.client && rt.bitAnd(M.client.prefs.chat_toggles, 512)) {
			(receive = rt.modify(receive, M, rt.bitOr));
		}
	}
	let rendered: Value = (yield* virt.compose_message(virt, language, message, freq, spans));
	for (hearer of each(receive, T("/atom/movable"))) {
		yield* hearer.Hear(rendered, virt, language, message, freq, spans);
	}
	yield* sleep(50);
	if (!virt || virt.gc_destroyed) return f.dot;
	yield* qdel(virt);
	return f.dot;
}, true, { waitfor: false });

// broadcasting.dm:163
rt.def("/atom/proc/telecomms_process", function* telecomms_process(f: Frame) {
	let signal: Value = null, R: Value = null;
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 2;
	let pos: Value = rt.getStep(f, this, 0);
	signal.data = rt.alist(f, ["slow", 0, "message", "TEST", "compression", rand(45, 50), "traffic", 0, "type", 4, "reject", 0, "done", 0, "level", pos.z]);
	signal.frequency = 1459;
	for (R of each(GLOB.telecomms_list, T("/obj/machinery/telecomms/receiver"))) {
		yield* R.receive_signal(signal);
	}
	yield* sleep(rand(10, 25));
	return signal;
}, true);
