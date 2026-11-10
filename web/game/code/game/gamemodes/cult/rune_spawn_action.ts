// Based on /tg/station's code/game/gamemodes/cult/rune_spawn_action.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(98, "/datum/action/innate/cult/create_rune", "/datum/action/innate/cult", {
	rune_type: null,
	cooldown: 0,
	base_cooldown: 900,
	scribe_time: 100,
	damage_interrupt: 1,
	action_interrupt: 1,
	rune_word_type: null,
	rune_innerring_type: null,
	rune_center_type: null,
	rune_color: null,
	background_icon_state: "bg_cult",
});

// rune_spawn_action.dm:16
rt.def("/datum/action/innate/cult/create_rune/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!this.rune_type || this.cooldown > rt.worldTime(f)) {
		return 0;
	}
	return parent_proc();
});

// rune_spawn_action.dm:22
rt.def("/datum/action/innate/cult/create_rune/proc/Activate", function* Activate(f: Frame) {
	let chosen_keyword: Value = null, R2: Value = null, R3: Value = null, R4: Value = null, health: Value = null, L: Value = null, new_rune: Value = null;
	if (!isturf(this.owner.loc)) {
		to_chat(this.owner, "<span class='warning>You need more space to scribe a rune!</span>");
		return f.dot;
	}
	if (rt.initial(f, this.rune_type, "req_keyword")) {
		if (!(chosen_keyword = (yield* stripped_input(this.owner, "Enter a keyword for the new rune.", "Words of Power")))) {
			return f.dot;
		}
	}
	let R1: Value = (yield* new_(T("/obj/effect/temp_visual/cult/rune_spawn"), this.owner.loc, this.scribe_time, this.rune_color));
	if (this.rune_word_type) {
		R2 = (yield* new_(this.rune_word_type, this.owner.loc, this.scribe_time, this.rune_color));
	}
	if (this.rune_innerring_type) {
		R3 = (yield* new_(this.rune_innerring_type, this.owner.loc, this.scribe_time, this.rune_color));
	}
	if (this.rune_center_type) {
		R4 = (yield* new_(this.rune_center_type, this.owner.loc, this.scribe_time, this.rune_color));
	}
	this.cooldown = this.base_cooldown + rt.worldTime(f);
	yield* this.owner.update_action_buttons_icon();
	yield* addtimer((yield* new_(T("/datum/callback"), this.owner, P("/mob/proc/update_action_buttons_icon"))), this.base_cooldown);
	if (this.damage_interrupt && rt.istype(this.owner, T("/mob/living"))) {
		L = this.owner;
		health = rt.alist(f, ["health", L.health]);
	}
	let scribe_mod: Value = this.scribe_time;
	if (rt.istype(rt.getStep(f, this.owner, 0), T("/turf/open/floor/engine/cult"))) {
		scribe_mod *= 0.5;
	}
	if (yield* do_after(this.owner, scribe_mod, { target: this.owner, extra_checks: (yield* new_(T("/datum/callback"), this.owner, P("/mob/proc/break_do_after_checks"), health, this.action_interrupt)) })) {
		(new_rune = (yield* new_(this.rune_type, this.owner.loc))).keyword = chosen_keyword;
	} else {
		yield* qdel(R1);
		if (R2) {
			yield* qdel(R2);
		}
		if (R3) {
			yield* qdel(R3);
		}
		if (R4) {
			yield* qdel(R4);
		}
		this.cooldown = 0;
		yield* this.owner.update_action_buttons_icon();
	}
	return f.dot;
}, true);
