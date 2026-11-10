// Based on /tg/station's code/modules/mob/living/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/proc/gib", function* gib(f: Frame, no_brain: Value, no_organs: Value, no_bodyparts: Value) {
	let prev_lying: Value = this.lying;
	if (this.stat != 2) {
		yield* this.death(1);
	}
	if (!prev_lying) {
		yield* this.gib_animation();
	}
	yield* this.spill_organs(no_brain, no_organs, no_bodyparts);
	if (!no_bodyparts) {
		yield* this.spread_bodyparts(no_brain, no_organs);
	}
	yield* this.spawn_gibs(no_bodyparts);
	yield* qdel(this);
	return f.dot;
}, true);

// death.dm:21
rt.def("/mob/living/proc/spawn_gibs", function* spawn_gibs(f: Frame) {
	yield* new_(T("/obj/effect/gibspawner/generic"), this.loc, this.viruses);
	return f.dot;
}, true);

// death.dm:30
rt.def("/mob/living/proc/dust", function* dust(f: Frame, just_ash: Value) {
	just_ash ??= 0;
	yield* this.death(1);
	if (this.buckled) {
		yield* this.buckled.unbuckle_mob(this, { force: 1 });
	}
	yield* this.dust_animation();
	yield* this.spawn_dust(just_ash);
	yield* qdel(this);
	return f.dot;
}, true);

// death.dm:43
rt.def("/mob/living/proc/spawn_dust", function* spawn_dust(f: Frame, just_ash: Value) {
	just_ash ??= 0;
	yield* new_(T("/obj/effect/decal/cleanable/ash"), this.loc);
	return f.dot;
}, true);

// death.dm:48
rt.def("/mob/living/proc/death", function* death(f: Frame, gibbed: Value) {
	let I: Value = null, rendered: Value = null, s: Value = null, S: Value = null;
	this.stat = 2;
	yield* this.set_typing_indicator(0);
	yield* this.unset_machine();
	this.timeofdeath = rt.worldTime(f);
	this.tod = worldtime2text();
	let _T: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(_T);
	for (I of each(this.contents, T("/obj/item"))) {
		yield* I.on_mob_death(this, gibbed);
	}
	if (this.mind && this.mind.name && this.mind.active && !rt.bitAnd(_T.flags, NO_DEATHRATTLE)) {
		rendered = `<span class='deadsay'><b>${this.mind.name}</b> has died at <b>${A.name}</b>.</span>`;
		yield* deadchat_broadcast(rendered, { follow_target: this, turf_target: _T, message_type: "deathrattle" });
	}
	if (this.mind) {
		this.mind.store_memory(`Time of death: ${this.tod}`, 0);
	}
	GLOB.living_mob_list -= this;
	if (!gibbed) {
		GLOB.dead_mob_list += this;
	}
	yield* this.set_drugginess(0);
	yield* this.SetSleeping(0, 0);
	yield* this.blind_eyes(1);
	yield* this.reset_perspective(null);
	this.reload_fullscreen();
	yield* this.update_action_buttons_icon();
	yield* this.update_damage_hud();
	this.update_health_hud();
	yield* this.update_canmove();
	yield* this.med_hud_set_health();
	this.med_hud_set_status();
	for (s of each(this.ownedSoullinks)) {
		yield* (S = s).ownerDies(gibbed);
	}
	s = null;
	for (s of each(this.sharedSoullinks)) {
		yield* (S = s).sharerDies(gibbed);
	}
	return 1;
}, true);
