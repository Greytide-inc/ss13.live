// From code/game/gamemodes/changeling/powers/absorb.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11223, "/obj/effect/proc_holder/changeling/absorbDNA", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 0,
	dna_cost: 0,
	req_human: 1,
	name: "Absorb DNA",
	desc: "Absorb the DNA of our victim.",
});

// /obj/effect/proc_holder/changeling/absorbDNA/proc/can_sting  (code/game/gamemodes/changeling/powers/absorb.dm:9)
rt.def("/obj/effect/proc_holder/changeling/absorbDNA/proc/can_sting", function can_sting(f: Frame) {
	let changeling: Value = null, target: Value = null;
	f.vars = () => [changeling, target];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "isabsorbing", (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We are already absorbing!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.fv(f, "pulling", live(f.args[0]))) || !truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living/carbon")) ? 1 : 0)))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We must be grabbing a creature to absorb them!</span>"]);
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "grab_state", live(f.args[0])), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We must have a tighter grip to absorb this creature!</span>"]);
		return live(f.dot);
	}
	target = rt.fv(f, "pulling", live(f.args[0]));
	return rt.callName(f, live(changeling), "can_absorb_dna", [live(f.args[0]), live(target)]);
}, false, { args: ["user"] });

// /obj/effect/proc_holder/changeling/absorbDNA/proc/sting_action  (code/game/gamemodes/changeling/powers/absorb.dm:30)  may sleep
rt.def("/obj/effect/proc_holder/changeling/absorbDNA/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, target: Value = null, i: Value = null, recent_speech: Value = null, say_log: Value = null, spoken_memory: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, changeling, target, i, recent_speech, say_log, spoken_memory, $0, $e];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	target = rt.fv(f, "pulling", live(user));
	rt.setFv(f, "isabsorbing", live(changeling), 1);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(i);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This creature is compatible. We must hold still...</span>"]);
		} else if ($0 === 2) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ extends a proboscis!</span>", [live(user)]), "<span class='notice'>We extend a proboscis.</span>"]);
		} else if ($0 === 3) {
			yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ stabs ＀ with the proboscis!</span>", [live(user), live(target)]), fmt("<span class='notice'>We stab ＀ with the proboscis.</span>", [live(target)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>You feel a sharp stabbing pain!</span>"]);
			yield* g.callName(f, live(target), "take_overall_damage", [40]);
		}
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target), 150])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Our absorption of ＀ has been interrupted!</span>", [live(target)])]);
			rt.setFv(f, "isabsorbing", live(changeling), 0);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ sucks the fluids from ＀!</span>", [live(user), live(target)]), fmt("<span class='notice'>We have absorbed ＀.</span>", [live(target)])]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>You are absorbed by the changeling!</span>"]);
	if (!truthy((yield* g.callName(f, live(changeling), "has_dna", [rt.fv(f, "dna", live(target))])))) {
		yield* g.callName(f, live(changeling), "add_new_profile", [live(target), live(user)]);
	}
	if (rt.lt(rt.fv(f, "nutrition", live(user)), 450)) {
		rt.setFv(f, "nutrition", live(user), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "nutrition", live(user)), rt.fv(f, "nutrition", live(target))), 450])));
	}
	if (truthy(rt.fv(f, "mind", live(target)))) {
		yield* g.callName(f, rt.fv(f, "mind", live(target)), "show_memory", [live(user), 0]);
		recent_speech = rt.list();
		if (rt.gt(rt.length((say_log = rt.index(rt.fv(f, "logging", live(target)), "Say log"))), 8)) {
			recent_speech = (yield* g.callName(f, live(say_log), "Copy", [add(subtract(rt.len(f, live(say_log)), 8), 1), 0]));
		} else {
			spoken_memory = null;
			rt.forList(f, 0, live(say_log));
			while (($e = rt.next(f, 0)) !== undefined) {
				spoken_memory = $e;
				if (rt.ge(rt.len(f, live(recent_speech)), 8)) {
					break;
				}
				rt.setAt(live(recent_speech), live(spoken_memory), rt.index(live(say_log), live(spoken_memory)));
			}
			rt.endFor(f, 0);
		}
		if (truthy(rt.len(f, live(recent_speech)))) {
			yield* g.callName(f, rt.fv(f, "mind", live(user)), "store_memory", [fmt("<B>Some of ＀'s speech patterns, we should study these to better impersonate them!</B>", [live(target)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldnotice'>Some of ＀'s speech patterns, we should study these to better impersonate them!</span>", [live(target)])]);
			spoken_memory = null;
			rt.forList(f, 0, live(recent_speech));
			while (($e = rt.next(f, 0)) !== undefined) {
				spoken_memory = $e;
				yield* g.callName(f, rt.fv(f, "mind", live(user)), "store_memory", [fmt("\"＀\"", [rt.index(live(recent_speech), live(spoken_memory))])]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>\"＀\"</span>", [rt.index(live(recent_speech), live(spoken_memory))])]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, rt.fv(f, "mind", live(user)), "store_memory", [fmt("<B>We have no more knowledge of ＀'s speech patterns.</B>", [live(target)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='boldnotice'>We have no more knowledge of ＀'s speech patterns.</span>", [live(target)])]);
		}
		if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(target))))) {
			rt.modField(f, live(changeling), "chem_charges", (yield* g.call(f, P("/proc/min"), null, [rt.gv(f, "chem_charges", rt.gv(f, "changeling", rt.fv(f, "mind", live(target)))), rt.fv(f, "chem_storage", live(changeling))])), add);
			rt.modField(f, live(changeling), "absorbedcount", rt.gv(f, "absorbedcount", rt.gv(f, "changeling", rt.fv(f, "mind", live(target)))), add);
			rt.setFv(f, "len", rt.gv(f, "stored_profiles", rt.gv(f, "changeling", rt.fv(f, "mind", live(target)))), 1);
			rt.setFv(f, "absorbedcount", rt.gv(f, "changeling", rt.fv(f, "mind", live(target))), 0);
		}
	}
	rt.setFv(f, "chem_charges", live(changeling), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "chem_charges", live(changeling)), 10), rt.fv(f, "chem_storage", live(changeling))])));
	rt.setFv(f, "isabsorbing", live(changeling), 0);
	rt.setFv(f, "canrespec", live(changeling), 1);
	yield* g.callName(f, live(target), "death", [0]);
	yield* g.callName(f, live(target), "Drain", []);
	return 1;
}, true);
