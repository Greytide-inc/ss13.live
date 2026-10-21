// From code/game/machinery/telecomms/broadcasting.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/Broadcast_Message  (code/game/machinery/telecomms/broadcasting.dm:65)  may sleep
rt.def("/proc/Broadcast_Message", function* Broadcast_Message(f: Frame, AM: Value, vmask: Value, radio: Value, message: Value, name: Value, job: Value, realname: Value, data: Value, compression: Value, level: Value, freq: Value, spans: Value, verb_say: Value, verb_ask: Value, verb_exclaim: Value, verb_yell: Value, language: Value) {
	let radios: Value = null, virt: Value = null, R: Value = null, freqtext: Value = null, R_3: Value = null, receive: Value = null, M: Value = null, rendered: Value = null, hearer: Value = null;
	let $e: any;
	f.vars = () => [AM, vmask, radio, message, name, job, realname, data, compression, level, freq, spans, verb_say, verb_ask, verb_exclaim, verb_yell, language, radios, virt, R, freqtext, R_3, receive, M, rendered, hearer, $e];
	if (!truthy((message = (yield* g.call(f, P("/proc/copytext"), null, [live(message), 1, 512]))))) {
		return live(f.dot);
	}
	radios = rt.list();
	rt.setFv(f, "name", (virt = (yield* g.new_(f, T("/atom/movable/virtualspeaker"), [null]))), live(name));
	rt.setFv(f, "job", live(virt), live(job));
	rt.setFv(f, "source", live(virt), live(AM));
	rt.setFv(f, "radio", live(virt), live(radio));
	rt.setFv(f, "verb_say", live(virt), live(verb_say));
	rt.setFv(f, "verb_ask", live(virt), live(verb_ask));
	rt.setFv(f, "verb_exclaim", live(virt), live(verb_exclaim));
	rt.setFv(f, "verb_yell", live(virt), live(verb_yell));
	if (rt.gt(live(compression), 0)) {
		message = (yield* g.call(f, P("/proc/Gibberish"), null, [live(message), add(live(compression), 40)]));
	}
	if (isEqual(live(data), 1)) {
		R = null;
		rt.forList(f, 0, rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])), T("/obj/item/device/radio/intercom"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			if (rt.gt((yield* g.callName(f, live(R), "receive_range", [live(freq), live(level)])), -1)) {
				radios = rt.modify(live(radios), live(R), add);
			}
		}
		rt.endFor(f, 0);
	} else {
		if (isEqual(live(data), 2)) {
			R = null;
			rt.forList(f, 0, rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])), T("/obj/item/device/radio"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (truthy(rt.fv(f, "subspace_transmission", live(R)))) {
					continue;
				}
				if (rt.gt((yield* g.callName(f, live(R), "receive_range", [live(freq), live(level)])), -1)) {
					radios = rt.modify(live(radios), live(R), add);
				}
			}
			rt.endFor(f, 0);
		} else {
			if (isEqual(live(data), 5)) {
				R = null;
				rt.forList(f, 0, rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])), T("/obj/item/device/radio"));
				while (($e = rt.next(f, 0)) !== undefined) {
					R = $e;
					if (!truthy(rt.fv(f, "independent", live(R)))) {
						continue;
					}
					if (rt.gt((yield* g.callName(f, live(R), "receive_range", [live(freq), live(level)])), -1)) {
						radios = rt.modify(live(radios), live(R), add);
					}
				}
				rt.endFor(f, 0);
			} else {
				R = null;
				rt.forList(f, 0, rt.index(rt.gl("all_radios"), fmt("＀", [live(freq)])), T("/obj/item/device/radio"));
				while (($e = rt.next(f, 0)) !== undefined) {
					R = $e;
					if (rt.gt((yield* g.callName(f, live(R), "receive_range", [live(freq), live(level)])), -1)) {
						radios = rt.modify(live(radios), live(R), add);
					}
				}
				rt.endFor(f, 0);
				freqtext = (yield* g.call(f, P("/proc/num2text"), null, [live(freq)]));
				R_3 = null;
				rt.forList(f, 0, rt.index(rt.gl("all_radios"), fmt("＀", [1213])), T("/obj/item/device/radio"));
				while (($e = rt.next(f, 0)) !== undefined) {
					R_3 = $e;
					if (truthy((rt.isIn(f, ((rt.gt((yield* g.callName(f, live(R_3), "receive_range", [1213, rt.list(rt.fv(f, "z", live(R_3)))])), -1) ? 1 : 0) && live(freqtext)), rt.gl("reverseradiochannels")) ? 1 : 0))) {
						(radios = rt.modify(live(radios), live(R_3), rt.bitOr));
					}
				}
				rt.endFor(f, 0);
			}
		}
	}
	receive = (yield* g.call(f, P("/proc/get_mobs_in_radio_ranges"), null, [live(radios)]));
	R_3 = null;
	rt.forList(f, 0, live(receive), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R_3 = $e;
		if (((truthy(rt.fv(f, "client", live(R_3))) && truthy(rt.gv(f, "holder", rt.fv(f, "client", live(R_3))))) && !truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(R_3)))), 32)))) {
			(receive = rt.modify(live(receive), live(R_3), subtract));
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (((truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 512)))) {
			(receive = rt.modify(live(receive), live(M), rt.bitOr));
		}
	}
	rt.endFor(f, 0);
	rendered = (yield* g.callName(f, live(virt), "compose_message", [live(virt), live(language), live(message), live(freq), live(spans)]));
	hearer = null;
	rt.forList(f, 0, live(receive), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		hearer = $e;
		yield* g.callName(f, live(hearer), "Hear", [live(rendered), live(virt), live(language), live(message), live(freq), live(spans)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (!truthy(live(virt)) || truthy(rt.fv(f, "gc_destroyed", live(virt)))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(virt)]);
	return f.dot;
}, true, { waitfor: false });

// /atom/proc/test_telecomms  (code/game/machinery/telecomms/broadcasting.dm:156)  may sleep
rt.def("/atom/proc/test_telecomms", function* test_telecomms(f: Frame) {
	let signal: Value = null, position: Value = null;
	f.vars = () => [signal, position];
	signal = (yield* g.srcCall(f, "telecomms_process"));
	return (rt.isIn(f, rt.gv(f, "z", (position = rt.getStep(f, live(f.src), 0))), (rt.index(rt.fv(f, "data", live(signal)), "level") && rt.index(rt.fv(f, "data", live(signal)), "done"))) ? 1 : 0);
}, true);

// /atom/proc/telecomms_process  (code/game/machinery/telecomms/broadcasting.dm:163)  may sleep
rt.def("/atom/proc/telecomms_process", function* telecomms_process(f: Frame) {
	let signal: Value = null, pos: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [signal, pos, R, $e];
	rt.setFv(f, "transmission_method", (signal = (yield* g.new_(f, T("/datum/signal"), []))), 2);
	pos = rt.getStep(f, live(f.src), 0);
	rt.setFv(f, "data", live(signal), rt.alist(f, ["slow", 0, "message", "TEST", "compression", (yield* g.call(f, P("/proc/rand"), null, [45, 50])), "traffic", 0, "type", 4, "reject", 0, "done", 0, "level", rt.fv(f, "z", live(pos))]));
	rt.setFv(f, "frequency", live(signal), 1459);
	R = null;
	rt.forList(f, 0, rt.gl("telecomms_list"), T("/obj/machinery/telecomms/receiver"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		yield* g.callName(f, live(R), "receive_signal", [live(signal)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [(yield* g.call(f, P("/proc/rand"), null, [10, 25]))]);
	return live(signal);
}, true);
