// From code/game/gamemodes/clock_cult/clock_scriptures/scripture_cyborg.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1225, "/datum/clockwork_scripture/ranged_ability/linked_vanguard", "/datum/clockwork_scripture/ranged_ability", {
	name: "Linked Vanguard",
	invocations: null,
	channel_time: 30,
	primary_component: "vanguard_cogwheel",
	quickbind_desc: "Allows you to grant a Servant and yourself stun immunity, as the Vanguard scripture.<br><b>Click your slab to disable.</b>",
	slab_icon: "vanguard",
	ranged_message: "<span class='inathneq_small'><i>You charge the clockwork slab with defensive strength.</i>\n<b>Left-click a fellow Servant or yourself to grant Vanguard!\nClick your slab to cancel.</b></span>",
	timeout_time: 50,
	ranged_type: rt.typePath("/obj/effect/proc_holder/slab/vanguard"),
});

// /datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/check_special_requirements  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_cyborg.dm:20)
rt.def("/datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	if ((((!truthy(rt.gl("ratvar_awakens")) && truthy((rt.istype(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), T("/list")) ? 1 : 0))) && truthy(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), "vanguard"))) && rt.gt(rt.index(rt.index(rt.fv(f, "stun_absorption", rt.sv(f, "invoker")), "vanguard"), "end_time"), rt.worldTime(f)))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "invoker"), "<span class='warning'>You are already shielded by a Vanguard!</span>"]);
		return 0;
	}
	return 1;
});

// /datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/scripture_effects  (code/game/gamemodes/clock_cult/clock_scriptures/scripture_cyborg.dm:27)  may sleep
rt.def("/datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let L: Value = null;
	let $e: any;
	f.vars = () => [L, $e];
	if (truthy(rt.gl("ratvar_awakens"))) {
		L = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [7, rt.getStep(f, rt.sv(f, "invoker"), 0)])), T("/mob/living"));
		while (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			if ((!isEqual(rt.fv(f, "stat", live(L)), 2) && truthy((yield* g.call(f, P("/proc/is_servant_of_ratvar"), null, [live(L)]))))) {
				yield* g.callName(f, live(L), "apply_status_effect", [T("/datum/status_effect/vanguard_shield")]);
			}
			if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
				yield* g.call(f, P("/proc/stoplag"), null, []);
			}
		}
		rt.endFor(f, 0);
		return 1;
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
