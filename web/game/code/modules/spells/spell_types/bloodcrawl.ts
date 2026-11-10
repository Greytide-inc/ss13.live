// Based on /tg/station's code/modules/spells/spell_types/bloodcrawl.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11382, "/obj/effect/proc_holder/spell/bloodcrawl", "/obj/effect/proc_holder/spell", {
	phased: 0,
	charge_max: 0,
	clothes_req: 0,
	phase_allowed: 1,
	selection_type: "range",
	range: 1,
	cooldown_min: 0,
	overlay: null,
	action_icon_state: "bloodcrawl",
	action_background_icon_state: "bg_demon",
	name: "Blood Crawl",
	desc: "Use pools of blood to phase out of existence.",
});

// bloodcrawl.dm:17
rt.def("/obj/effect/proc_holder/spell/bloodcrawl/proc/choose_targets", function* choose_targets(f: Frame, user: Value) {
	let target: Value = null;
	user ??= f.usr;
	for (target of each(range(this.range, rt.getStep(f, user, 0)), T("/obj/effect/decal/cleanable"))) {
		if (target.can_bloodcrawl_in()) {
			yield* this.perform(target);
			return f.dot;
		}
	}
	yield* this.revert_cast();
	to_chat(user, "<span class='warning'>There must be a nearby source of blood!</span>");
	return f.dot;
}, true);

// bloodcrawl.dm:25
rt.def("/obj/effect/proc_holder/spell/bloodcrawl/proc/perform", function* perform(f: Frame, target: Value, recharge: Value, user: Value) {
	recharge ??= 1;
	user ??= f.usr;
	if (rt.istype(user, T("/mob/living"))) {
		if (this.phased) {
			if (yield* user.phasein(target)) {
				this.phased = 0;
			}
		} else if (yield* user.phaseout(target)) {
			this.phased = 1;
		}
		this.start_recharge();
		return f.dot;
	}
	yield* this.revert_cast();
	to_chat(user, "<span class='warning'>You are unable to blood crawl!</span>");
	return f.dot;
}, true);
