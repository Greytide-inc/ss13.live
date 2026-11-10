// Based on /tg/station's code/modules/VR/vr_human.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4818, "/mob/living/carbon/human/virtual_reality", "/mob/living/carbon/human", {
	real_me: null,
	vr_sleeper: null,
	quit_action: null,
});

// vr_human.dm:10
rt.def("/mob/living/carbon/human/virtual_reality/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.quit_action = (yield* new_(T("/datum/action/quit_vr")));
	yield* this.quit_action.Grant(this);
	return f.dot;
}, true);

// vr_human.dm:16
rt.def("/mob/living/carbon/human/virtual_reality/proc/death", function* death(f: Frame) {
	yield* this.revert_to_reality();
	yield* parent_proc();
	return f.dot;
}, true);

// vr_human.dm:21
rt.def("/mob/living/carbon/human/virtual_reality/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.revert_to_reality();
	return (yield* parent_proc());
}, true);

// vr_human.dm:29
rt.def("/mob/living/carbon/human/virtual_reality/ghost", function* ghost(f: Frame) {
	let H: Value = this.real_me;
	yield* this.revert_to_reality(0, 0);
	if (!H) return f.dot;
	yield* H.ghost();
	return f.dot;
}, true, { verb: { name: "Ghost", category: "OOC", desc: "Relinquish your life and enter the land of the dead." } });

// vr_human.dm:36
rt.def("/mob/living/carbon/human/virtual_reality/proc/revert_to_reality", function* revert_to_reality(f: Frame, refcleanup: Value, deathchecks: Value) {
	refcleanup ??= 1;
	deathchecks ??= 1;
	if (this.real_me && this.mind) {
		yield* this.mind.transfer_to(this.real_me);
		if (deathchecks && this.vr_sleeper && this.vr_sleeper.you_die_in_the_game_you_die_for_real) {
			yield* this.real_me.death(0);
		}
	}
	if (!refcleanup) return f.dot;
	this.vr_sleeper.vr_human = null;
	this.vr_sleeper = null;
	this.real_me = null;
	return f.dot;
}, true);

rt.type(271, "/datum/action/quit_vr", "/datum/action", {
	name: "Quit Virtual Reality",
});

// vr_human.dm:50
rt.def("/datum/action/quit_vr/proc/Trigger", function* Trigger(f: Frame) {
	let VR: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	if (rt.istype(this.owner, T("/mob/living/carbon/human/virtual_reality"))) {
		yield* (VR = this.owner).revert_to_reality(0, 0);
	} else {
		yield* this.Remove(this.owner);
	}
	return f.dot;
}, true);
