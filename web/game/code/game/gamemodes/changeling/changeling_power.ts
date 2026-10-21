// From code/game/gamemodes/changeling/changeling_power.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11222, "/obj/effect/proc_holder/changeling", "/obj/effect/proc_holder", {
	helptext: "",
	chemical_cost: 0,
	dna_cost: -1,
	req_dna: 0,
	req_human: 0,
	req_stat: 0,
	always_keep: 0,
	ignores_fakedeath: 0,
	panel: "Changeling",
	name: "Prototype Sting",
	desc: "",
});

// /obj/effect/proc_holder/changeling/proc/on_purchase  (code/game/gamemodes/changeling/changeling_power.dm:21)
rt.def("/obj/effect/proc_holder/changeling/proc/on_purchase", function on_purchase(f: Frame, user: Value, is_respec: Value) {
	if (truthy(live(is_respec))) return f.dot;
	return f.dot;
});

// /obj/effect/proc_holder/changeling/proc/Click  (code/game/gamemodes/changeling/changeling_power.dm:28)  may sleep
rt.def("/obj/effect/proc_holder/changeling/proc/Click", function* Click(f: Frame) {
	let user: Value = null;
	f.vars = () => [user];
	if (((!truthy((user = live(f.usr))) || !truthy(rt.fv(f, "mind", live(user)))) || !truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(user)))))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "try_to_sting", live(user));
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/proc/try_to_sting  (code/game/gamemodes/changeling/changeling_power.dm:34)  may sleep
rt.def("/obj/effect/proc_holder/changeling/proc/try_to_sting", function* try_to_sting(f: Frame, user: Value, target: Value) {
	let c: Value = null;
	f.vars = () => [user, target, c];
	if (!truthy((yield* g.srcCall(f, "can_sting", live(user), live(target))))) {
		return live(f.dot);
	}
	c = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	if (!truthy((yield* g.srcCall(f, "sting_action", live(user), live(target))))) return f.dot;
	yield* g.srcCall(f, "sting_feedback", live(user), live(target));
	(rt.modField(f, live(c), "chem_charges", rt.sv(f, "chemical_cost"), subtract));
	return f.dot;
}, true);

// /obj/effect/proc_holder/changeling/proc/can_sting  (code/game/gamemodes/changeling/changeling_power.dm:50)
rt.def("/obj/effect/proc_holder/changeling/proc/can_sting", function can_sting(f: Frame, user: Value, target: Value) {
	let c: Value = null;
	f.vars = () => [c];
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "req_human")) && !truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We cannot do that in this form!</span>"]);
		return 0;
	}
	if (rt.lt(rt.gv(f, "chem_charges", (c = rt.gv(f, "changeling", rt.fv(f, "mind", live(user))))), rt.sv(f, "chemical_cost"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>We require at least ＀ unit５ of chemicals to do that!</span>", [rt.sv(f, "chemical_cost")])]);
		return 0;
	}
	if (rt.lt(rt.fv(f, "absorbedcount", live(c)), rt.sv(f, "req_dna"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>We require at least ＀ sample５ of compatible DNA.</span>", [rt.sv(f, "req_dna")])]);
		return 0;
	}
	if (rt.lt(rt.sv(f, "req_stat"), rt.fv(f, "stat", live(user)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We are incapacitated.</span>"]);
		return 0;
	}
	if ((truthy(rt.bitAnd(rt.fv(f, "status_flags", live(user)), 8192)) && !truthy(rt.sv(f, "ignores_fakedeath")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>We are incapacitated.</span>"]);
		return 0;
	}
	return 1;
});

// /obj/effect/proc_holder/changeling/proc/can_be_used_by  (code/game/gamemodes/changeling/changeling_power.dm:72)
rt.def("/obj/effect/proc_holder/changeling/proc/can_be_used_by", function can_be_used_by(f: Frame, user: Value) {
	if ((!truthy(live(user)) || (!truthy(live(user)) || truthy(rt.fv(f, "gc_destroyed", live(user)))))) {
		return 0;
	}
	if ((!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(live(user), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "req_human")) && !truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		return 0;
	}
	return 1;
});
