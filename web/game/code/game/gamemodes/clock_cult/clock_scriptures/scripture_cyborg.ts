// Based on /tg/station's code/game/gamemodes/clock_cult/clock_scriptures/scripture_cyborg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// scripture_cyborg.dm:20
rt.def("/datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/check_special_requirements", function check_special_requirements(f: Frame) {
	if (!GLOB.ratvar_awakens && rt.istype(this.invoker.stun_absorption, T("/list")) && rt.index(this.invoker.stun_absorption, "vanguard") && rt.index(rt.index(this.invoker.stun_absorption, "vanguard"), "end_time") > rt.worldTime(f)) {
		to_chat(this.invoker, "<span class='warning'>You are already shielded by a Vanguard!</span>");
		return 0;
	}
	return 1;
});

// scripture_cyborg.dm:27
rt.def("/datum/clockwork_scripture/ranged_ability/linked_vanguard/proc/scripture_effects", function* scripture_effects(f: Frame) {
	let L: Value = null;
	if (GLOB.ratvar_awakens) {
		for (L of each(view(7, rt.getStep(f, this.invoker, 0)), T("/mob/living"))) {
			if (L.stat != 2 && is_servant_of_ratvar(L)) {
				yield* L.apply_status_effect(T("/datum/status_effect/vanguard_shield"));
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit) {
				yield* stoplag();
			}
		}
		return 1;
	}
	return (yield* parent_proc());
}, true);
