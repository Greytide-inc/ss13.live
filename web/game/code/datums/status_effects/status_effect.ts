// Based on /tg/station's code/datums/status_effects/status_effect.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(917, "/datum/status_effect", "/datum", {
	id: "effect",
	duration: -1,
	tick_interval: 10,
	owner: null,
	status_type: 1,
	on_remove_on_mob_delete: 0,
	linked_alert: null,
	alert_type: rt.typePath("/obj/screen/alert/status_effect"),
});

// status_effect.dm:16
rt.def("/datum/status_effect/proc/New", function* New(f: Frame, _arguments: Value) {
	yield* g.callSrc(f, "on_creation", [_arguments], rt.Args.List);
	return f.dot;
}, true);

// status_effect.dm:20
rt.def("/datum/status_effect/proc/on_creation", function* on_creation(f: Frame, new_owner: Value) {
	let A: Value = null;
	if (new_owner) {
		this.owner = new_owner;
	}
	if (this.owner) {
		if (!this.owner.status_effects) {
			this.owner.status_effects = list();
		}
		this.owner.status_effects += this;
	}
	if (!this.owner || !(yield* this.on_apply())) {
		yield* qdel(this);
		return f.dot;
	}
	if (this.duration != -1) {
		this.duration = rt.worldTime(f) + this.duration;
	}
	this.tick_interval = rt.worldTime(f) + this.tick_interval;
	if (this.alert_type) {
		(A = (yield* this.owner.throw_alert(this.id, this.alert_type))).attached_effect = this;
		this.linked_alert = A;
	}
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	return 1;
}, true);

// status_effect.dm:37
rt.def("/datum/status_effect/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	if (this.owner) {
		yield* this.owner.clear_alert(this.id);
		if (this.owner.status_effects) {
			this.owner.status_effects -= this;
			if (!rt.len(f, this.owner.status_effects)) {
				this.owner.status_effects = null;
			}
		}
		yield* this.on_remove();
		this.owner = null;
	}
	return (yield* parent_proc());
}, true);

// status_effect.dm:46
rt.def("/datum/status_effect/proc/process", function* process(f: Frame) {
	if (!this.owner) {
		yield* qdel(this);
		return f.dot;
	}
	if (this.tick_interval < rt.worldTime(f)) {
		yield* this.tick();
		this.tick_interval = rt.worldTime(f) + rt.initial(f, this, "tick_interval");
	}
	if (!(this.duration != -1 && this.duration < rt.worldTime(f))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// status_effect.dm:60
rt.def("/datum/status_effect/proc/be_replaced", function* be_replaced(f: Frame) {
	yield* this.owner.clear_alert(this.id);
	if (this.owner.status_effects) {
		this.owner.status_effects -= this;
		if (!rt.len(f, this.owner.status_effects)) {
			this.owner.status_effects = null;
		}
	}
	this.owner = null;
	yield* qdel(this);
	return f.dot;
}, true);

// status_effect.dm:80
rt.def("/mob/living/proc/apply_status_effect", function* apply_status_effect(f: Frame) {
	let S: Value = null, _arguments: Value = null;
	f.dot = 0;
	let S1: Value = f.args[0];
	if (!this.status_effects) {
		this.status_effects = list();
	}
	for (S of each(this.status_effects, T("/datum/status_effect"))) {
		if (S.id == rt.initial(f, S1, "id") && S.status_type) {
			if (S.status_type == STATUS_EFFECT_REPLACE) {
				yield* S.be_replaced();
			} else {
				return f.dot;
			}
		}
	}
	rt.setAt((_arguments = (yield* f.argsList.Copy())), 1, this);
	f.dot = (S1 = (yield* new_(f.args[0], _arguments)));
	return f.dot;
}, true, { args: ["effect"] });

// status_effect.dm:96
rt.def("/mob/living/proc/remove_status_effect", function* remove_status_effect(f: Frame, effect: Value) {
	let S: Value = null;
	f.dot = 0;
	if (!this.status_effects) return f.dot;
	let S1: Value = effect;
	for (S of each(this.status_effects, T("/datum/status_effect"))) {
		if (rt.initial(f, S1, "id") == S.id) {
			yield* qdel(S);
			f.dot = 1;
		}
	}
	return f.dot;
}, true);

// status_effect.dm:105
rt.def("/mob/living/proc/has_status_effect", function has_status_effect(f: Frame, effect: Value) {
	let S: Value = null;
	f.dot = 0;
	if (!this.status_effects) return f.dot;
	let S1: Value = effect;
	for (S of each(this.status_effects, T("/datum/status_effect"))) {
		if (rt.initial(f, S1, "id") == S.id) {
			return S;
		}
	}
	return f.dot;
});

// status_effect.dm:111
rt.def("/mob/living/proc/has_status_effect_list", function has_status_effect_list(f: Frame, effect: Value) {
	let S: Value = null;
	f.dot = list();
	if (!this.status_effects) return f.dot;
	let S1: Value = effect;
	for (S of each(this.status_effects, T("/datum/status_effect"))) {
		if (rt.initial(f, S1, "id") == S.id) {
			f.dot += S;
		}
	}
	return f.dot;
});
