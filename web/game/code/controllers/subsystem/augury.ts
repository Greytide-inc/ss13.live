// Based on /tg/station's code/controllers/subsystem/augury.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(16, "/datum/controller/subsystem/augury", "/datum/controller/subsystem", {
	watchers: null,
	doombringers: null,
	observers_given_action: null,
	name: "Augury",
	flags: 1,
	runlevels: 12,
});

// augury.dm:1
rt.def("/datum/controller/subsystem/augury/proc/New", function* New(f: Frame) {
	if (GLOB.SSaugury != this) {
		if (rt.istype(GLOB.SSaugury, T("/datum/controller/subsystem/augury"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSaugury);
		}
		GLOB.SSaugury = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// augury.dm:6
rt.def("/datum/controller/subsystem/augury/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.watchers = list();

	this.doombringers = list();

	this.observers_given_action = list();
	return f.dot;
});

// augury.dm:12
rt.def("/datum/controller/subsystem/augury/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	yield* parent_proc(`W:${rt.len(f, this.watchers)}|D:${rt.len(f, this.doombringers)}`);
	return f.dot;
}, true);

// augury.dm:21
rt.def("/datum/controller/subsystem/augury/proc/fire", function* fire(f: Frame) {
	let biggest_doom: Value = null, biggest_threat: Value = null, db: Value = null, d: Value = null, threat: Value = null, i: Value = null, A: Value = null, O: Value = null, A_4: Value = null, w: Value = null;
	for (db of each(this.doombringers)) {
		if (!(d = db) || !d || d.gc_destroyed) {
			this.doombringers -= d;
			continue;
		}
		threat = rt.index(this.doombringers, d);
		if (biggest_threat === null || biggest_threat < threat) {
			biggest_doom = d;
			biggest_threat = threat;
		}
	}
	if (rt.len(f, this.doombringers)) {
		for (i of each(GLOB.player_list)) {
			if (rt.istype(i, T("/mob/dead/observer")) && !rt.index(this.observers_given_action, i)) {
				yield* (A = (yield* new_(T("/datum/action/innate/augury")))).Grant(i);
				rt.setAt(this.observers_given_action, i, 1);
			}
		}
	} else {
		i = null;
		for (i of each(this.observers_given_action)) {
			if (rt.index(this.observers_given_action, i) && rt.istype(i, T("/mob/dead/observer"))) {
				O = i;
				A_4 = null;
				for (A_4 of each(O.actions, T("/datum/action/innate/augury"))) {
					yield* qdel(A_4);
				}
			}
			this.observers_given_action -= i;
		}
	}
	for (w of each(this.watchers)) {
		if (!w) {
			this.watchers -= w;
			continue;
		}
		O = w;
		if (biggest_doom && (!O.orbiting || O.orbiting.orbiting != biggest_doom)) {
			yield* O.ManualFollow(biggest_doom);
		}
	}
	return f.dot;
}, true);

rt.type(84, "/datum/action/innate/augury", "/datum/action/innate", {
	name: "Auto Follow Debris",
	icon_icon: rt.rsc("icons/obj/meteor.dmi"),
	button_icon_state: "flaming",
	background_icon_state: "default",
});

// augury.dm:61
rt.def("/datum/action/innate/augury/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner) {
		GLOB.SSaugury.watchers -= this.owner;
	}
	return (yield* parent_proc());
}, true);

// augury.dm:66
rt.def("/datum/action/innate/augury/proc/Activate", function* Activate(f: Frame) {
	GLOB.SSaugury.watchers += this.owner;
	to_chat(this.owner, "<span class='notice'>You are now auto-following debris.</span>");
	this.active = 1;
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

// augury.dm:71
rt.def("/datum/action/innate/augury/proc/Deactivate", function* Deactivate(f: Frame) {
	GLOB.SSaugury.watchers -= this.owner;
	to_chat(this.owner, "<span class='notice'>You are no longer auto-following debris.</span>");
	this.active = 0;
	yield* this.UpdateButtonIcon();
	return f.dot;
}, true);

// augury.dm:77
rt.def("/datum/action/innate/augury/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	yield* parent_proc();
	if (this.active) {
		this.button.icon_state = "template_active";
	} else {
		this.button.icon_state = "template";
	}
	return f.dot;
}, true, { args: ["status_only"] });
