// From code/game/machinery/telecomms/machines/allinone.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10720, "/obj/machinery/telecomms/allinone", "/obj/machinery/telecomms", {
	intercept: 0,
	anchored: 1,
	machinetype: 6,
	name: "telecommunications mainframe",
	icon_state: "comm_server",
	desc: "A compact machine used for portable subspace telecommuniations processing.",
	density: 1,
	use_power: 0,
	idle_power_usage: 0,
});

// /obj/machinery/telecomms/allinone/proc/receive_signal  (code/game/machinery/telecomms/machines/allinone.dm:19)  may sleep
rt.def("/obj/machinery/telecomms/allinone/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let original: Value = null;
	f.vars = () => [signal, original];
	if (!truthy(rt.sv(f, "on"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "is_freq_listening", live(signal))))) return f.dot;
	rt.setAt(rt.fv(f, "data", live(signal)), "done", 1);
	rt.setAt(rt.fv(f, "data", live(signal)), "compression", 0);
	if (truthy((original = rt.index(rt.fv(f, "data", live(signal)), "original")))) {
		rt.setAt(rt.fv(f, "data", live(original)), "done", 1);
	}
	if (rt.gt(rt.index(rt.fv(f, "data", live(signal)), "slow"), 0)) {
		yield* g.call(f, P("/proc/sleep"), null, [rt.index(rt.fv(f, "data", live(signal)), "slow")]);
	}
	if (!isEqual(rt.fv(f, "frequency", live(signal)), 1213)) return f.dot;
	yield* g.call(f, P("/proc/Broadcast_Message"), null, [rt.index(rt.fv(f, "data", live(signal)), "mob"), rt.index(rt.fv(f, "data", live(signal)), "vmask"), rt.index(rt.fv(f, "data", live(signal)), "radio"), rt.index(rt.fv(f, "data", live(signal)), "message"), rt.index(rt.fv(f, "data", live(signal)), "name"), rt.index(rt.fv(f, "data", live(signal)), "job"), rt.index(rt.fv(f, "data", live(signal)), "realname"), null, rt.index(rt.fv(f, "data", live(signal)), "compression"), rt.list(0, rt.sv(f, "z")), rt.fv(f, "frequency", live(signal)), rt.index(rt.fv(f, "data", live(signal)), "spans"), rt.index(rt.fv(f, "data", live(signal)), "verb_say"), rt.index(rt.fv(f, "data", live(signal)), "verb_ask"), rt.index(rt.fv(f, "data", live(signal)), "verb_exclaim"), rt.index(rt.fv(f, "data", live(signal)), "verb_yell"), rt.index(rt.fv(f, "data", live(signal)), "language")]);
	return f.dot;
}, true);

// /obj/machinery/telecomms/allinone/proc/attackby  (code/game/machinery/telecomms/machines/allinone.dm:47)  may sleep
rt.def("/obj/machinery/telecomms/allinone/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	f.vars = () => [_P, user, params];
	if (!truthy((rt.istype(live(_P), T("/obj/item/device/multitool")) ? 1 : 0))) return f.dot;
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);
