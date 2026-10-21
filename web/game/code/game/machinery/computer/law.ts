// From code/game/machinery/computer/law.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10383, "/obj/machinery/computer/upload", "/obj/machinery/computer", {
	current: null,
	icon_screen: "command",
});

// /obj/machinery/computer/upload/proc/attackby  (code/game/machinery/computer/law.dm:8)  may sleep
rt.def("/obj/machinery/computer/upload/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null, currentloc: Value = null;
	f.vars = () => [M, currentloc];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/aiModule")) ? 1 : 0))) {
		M = live(f.args[0]);
		if (truthy(rt.bitAnd(rt.fv(f, "stat", live(f.src)), 11))) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "current"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='caution'>You haven't selected anything to transmit laws to!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.srcCall(f, "can_upload_to", rt.sv(f, "current"))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>Upload failed!</span> Check to make sure ＀ is functioning properly.", [rt.fv(f, "name", rt.sv(f, "current"))])]);
			rt.setSv(f, "current", null);
			return live(f.dot);
		}
		if ((truthy((currentloc = rt.getStep(f, rt.sv(f, "current"), 0))) && !isEqual(rt.fv(f, "z", live(f.args[1])), rt.fv(f, "z", live(currentloc))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='caution'>Upload failed!</span> Unable to establish a connection to ＀. You're too far away!", [rt.fv(f, "name", rt.sv(f, "current"))])]);
			rt.setSv(f, "current", null);
			return live(f.dot);
		}
		yield* g.callName(f, live(M), "install", [rt.fv(f, "laws", rt.sv(f, "current")), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/computer/upload/proc/can_upload_to  (code/game/machinery/computer/law.dm:29)
rt.def("/obj/machinery/computer/upload/proc/can_upload_to", function can_upload_to(f: Frame, S: Value) {
	if ((isEqual(rt.fv(f, "stat", live(S)), 2) || truthy(rt.fv(f, "syndicate", live(S))))) {
		return 0;
	}
	return 1;
});

rt.type(10384, "/obj/machinery/computer/upload/ai", "/obj/machinery/computer/upload", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/aiupload"),
	name: "１AI upload console",
	desc: "Used to upload laws to the AI.",
});

// /obj/machinery/computer/upload/ai/proc/attack_hand  (code/game/machinery/computer/law.dm:39)  may sleep
rt.def("/obj/machinery/computer/upload/ai/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.setFv(f, "current", live(f.src), (yield* g.call(f, P("/proc/select_active_ai"), null, [live(f.args[0])])));
	if (!truthy(rt.fv(f, "current", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='caution'>No active AIs detected!</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ selected for law changes.", [rt.gv(f, "name", rt.fv(f, "current", live(f.src)))])]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/upload/ai/proc/can_upload_to  (code/game/machinery/computer/law.dm:50)
rt.def("/obj/machinery/computer/upload/ai/proc/can_upload_to", function can_upload_to(f: Frame) {
	if ((!truthy(live(f.args[0])) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/ai")) ? 1 : 0)))) {
		return 0;
	}
	if (truthy(rt.fv(f, "control_disabled", live(f.args[0])))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["A"] });

rt.type(10385, "/obj/machinery/computer/upload/borg", "/obj/machinery/computer/upload", {
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/borgupload"),
	name: "cyborg upload console",
	desc: "Used to upload laws to Cyborgs.",
});

// /obj/machinery/computer/upload/borg/proc/attack_hand  (code/game/machinery/computer/law.dm:63)  may sleep
rt.def("/obj/machinery/computer/upload/borg/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.setFv(f, "current", live(f.src), (yield* g.call(f, P("/proc/select_active_free_borg"), null, [live(f.args[0])])));
	if (!truthy(rt.fv(f, "current", live(f.src)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='caution'>No active unslaved cyborgs detected!</span>"]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("＀ selected for law changes.", [rt.gv(f, "name", rt.fv(f, "current", live(f.src)))])]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/upload/borg/proc/can_upload_to  (code/game/machinery/computer/law.dm:74)
rt.def("/obj/machinery/computer/upload/borg/proc/can_upload_to", function can_upload_to(f: Frame) {
	if ((!truthy(live(f.args[0])) || !truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "scrambledcodes", live(f.args[0]))) || truthy(rt.fv(f, "emagged", live(f.args[0]))))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["B"] });
