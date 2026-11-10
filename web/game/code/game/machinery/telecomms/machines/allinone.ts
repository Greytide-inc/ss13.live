// Based on /tg/station's code/game/machinery/telecomms/machines/allinone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// allinone.dm:19
rt.def("/obj/machinery/telecomms/allinone/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	let original: Value = null;
	if (!this.on) {
		return f.dot;
	}
	if (!this.is_freq_listening(signal)) return f.dot;
	rt.setAt(signal.data, "done", 1);
	rt.setAt(signal.data, "compression", 0);
	if (original = rt.index(signal.data, "original")) {
		rt.setAt(original.data, "done", 1);
	}
	if (rt.index(signal.data, "slow") > 0) {
		yield* sleep(rt.index(signal.data, "slow"));
	}
	if (signal.frequency != 1213) return f.dot;
	yield* Broadcast_Message(rt.index(signal.data, "mob"), rt.index(signal.data, "vmask"), rt.index(signal.data, "radio"), rt.index(signal.data, "message"), rt.index(signal.data, "name"), rt.index(signal.data, "job"), rt.index(signal.data, "realname"), null, rt.index(signal.data, "compression"), list(0, this.z), signal.frequency, rt.index(signal.data, "spans"), rt.index(signal.data, "verb_say"), rt.index(signal.data, "verb_ask"), rt.index(signal.data, "verb_exclaim"), rt.index(signal.data, "verb_yell"), rt.index(signal.data, "language"));
	return f.dot;
}, true);

// allinone.dm:47
rt.def("/obj/machinery/telecomms/allinone/proc/attackby", function* attackby(f: Frame, _P: Value, user: Value, params: Value) {
	if (!rt.istype(_P, T("/obj/item/device/multitool"))) return f.dot;
	yield* this.attack_hand(user);
	return f.dot;
}, true);
