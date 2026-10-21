// From code/game/gamemodes/changeling/powers/linglink.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11237, "/obj/effect/proc_holder/changeling/linglink", "/obj/effect/proc_holder/changeling", {
	chemical_cost: 0,
	dna_cost: 0,
	req_human: 1,
	name: "Hivemind Link",
	desc: "Link your victim's mind into the hivemind for personal interrogation",
});

// /obj/effect/proc_holder/changeling/linglink/proc/can_sting  (code/game/gamemodes/changeling/powers/linglink.dm:9)
rt.def("/obj/effect/proc_holder/changeling/linglink/proc/can_sting", function can_sting(f: Frame) {
	let changeling: Value = null, target: Value = null;
	f.vars = () => [changeling, target];
	if (!truthy(rt.callSuper(f, [], rt.Args.Same))) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "islinking", (changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(f.args[0]))))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We have already formed a link with the victim!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "pulling", live(f.args[0])))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We must be tightly grabbing a creature to link with them!</span>"]);
		return live(f.dot);
	}
	if (!truthy((rt.istype(rt.fv(f, "pulling", live(f.args[0])), T("/mob/living/carbon")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We cannot link with this creature!</span>"]);
		return live(f.dot);
	}
	if (!truthy(rt.gv(f, "mind", (target = rt.fv(f, "pulling", live(f.args[0])))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The victim has no mind to link to!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.fv(f, "stat", live(target)), 2)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The victim is dead, you cannot link to a dead mind!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "changeling", rt.fv(f, "mind", live(target))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The victim is already a part of the hivemind!</span>"]);
		return live(f.dot);
	}
	if (rt.le(rt.fv(f, "grab_state", live(f.args[0])), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>We must have a tighter grip to link with this creature!</span>"]);
		return live(f.dot);
	}
	return rt.callName(f, live(changeling), "can_absorb_dna", [live(f.args[0]), live(target)]);
}, false, { args: ["user"] });

// /obj/effect/proc_holder/changeling/linglink/proc/sting_action  (code/game/gamemodes/changeling/powers/linglink.dm:37)  may sleep
rt.def("/obj/effect/proc_holder/changeling/linglink/proc/sting_action", function* sting_action(f: Frame, user: Value) {
	let changeling: Value = null, target: Value = null, i: Value = null, M: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, changeling, target, i, M, $0, $e];
	changeling = rt.gv(f, "changeling", rt.fv(f, "mind", live(user)));
	target = rt.fv(f, "pulling", live(user));
	rt.setFv(f, "islinking", live(changeling), 1);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		$0 = live(i);
		if ($0 === 1) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This creature is compatible. We must hold still...</span>"]);
		} else if ($0 === 2) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We stealthily stab ＀ with a minor proboscis...</span>", [live(target)])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>You experience a stabbing sensation and your ears begin to ring...</span>"]);
		} else if ($0 === 3) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>We mold the ＀'s mind like clay, granting ＀ the ability to speak in the hivemind!</span>", [live(target), (yield* g.callName(f, live(target), "p_them", []))])]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>A migraine throbs behind your eyes, you hear yourself screaming - but your mouth has not opened!</span>"]);
			M = null;
			rt.forList(f, 1, rt.gl("mob_list"), T("/mob"));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				if (isEqual((yield* g.callName(f, live(M), "lingcheck", [])), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(M), "<i><font color=#800080>We can sense a foreign presence in the hivemind...</font></i>"]);
				}
			}
			rt.endFor(f, 1);
			rt.setFv(f, "linglink", rt.fv(f, "mind", live(target)), 1);
			yield* g.callName(f, live(target), "say", [":g AAAAARRRRGGGGGHHHHH!!"]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<font color=#800040><span class='boldannounce'>You can now communicate in the changeling hivemind, say \":g message\" to communicate!</span>"]);
			yield* g.callName(f, rt.fv(f, "reagents", live(target)), "add_reagent", ["salbutamol", 40]);
			yield* g.call(f, P("/proc/sleep"), null, [1800]);
		}
		if (!truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(target), 20])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>Our link with ＀ has ended!</span>", [live(target)])]);
			rt.setFv(f, "islinking", live(changeling), 0);
			rt.setFv(f, "linglink", rt.fv(f, "mind", live(target)), 0);
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "islinking", live(changeling), 0);
	rt.setFv(f, "linglink", rt.fv(f, "mind", live(target)), 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You cannot sustain the connection any longer, your victim fades from the hivemind</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(target), "<span class='userdanger'>The link cannot be sustained any longer, your connection to the hivemind has faded!</span>"]);
	return f.dot;
}, true);
