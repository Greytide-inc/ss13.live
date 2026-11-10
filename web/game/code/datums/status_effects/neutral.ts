// Based on /tg/station's code/datums/status_effects/neutral.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(940, "/datum/status_effect/sigil_mark", "/datum/status_effect", {
	stat_allowed: 2,
	id: "sigil_mark",
	duration: -1,
	alert_type: null,
});

// neutral.dm:10
rt.def("/datum/status_effect/sigil_mark/proc/tick", function* tick(f: Frame) {
	if (!(this.owner.stat < this.stat_allowed)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(942, "/datum/status_effect/syphon_mark", "/datum/status_effect", {
	reward_target: null,
	id: "syphon_mark",
	duration: 50,
	status_type: 0,
	on_remove_on_mob_delete: 1,
	alert_type: null,
});

// neutral.dm:29
rt.def("/datum/status_effect/syphon_mark/proc/on_creation", function* on_creation(f: Frame, new_owner: Value, new_reward_target: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.reward_target = new_reward_target;
	return f.dot;
}, true);

// neutral.dm:34
rt.def("/datum/status_effect/syphon_mark/proc/on_apply", function on_apply(f: Frame) {
	if (this.owner.stat == 2) {
		return 0;
	}
	return parent_proc();
});

// neutral.dm:39
rt.def("/datum/status_effect/syphon_mark/proc/get_kill", function get_kill(f: Frame) {
	if (!this.reward_target || this.reward_target.gc_destroyed) return f.dot;
	this.reward_target.get_kill(this.owner);
	return f.dot;
});

// neutral.dm:43
rt.def("/datum/status_effect/syphon_mark/proc/tick", function* tick(f: Frame) {
	if (this.owner.stat != 2) return f.dot;
	this.get_kill();
	yield* qdel(this);
	return f.dot;
}, true);

// neutral.dm:48
rt.def("/datum/status_effect/syphon_mark/proc/on_remove", function on_remove(f: Frame) {
	this.get_kill();
	f.dot = parent_proc();
	return f.dot;
});
