// Based on /tg/station's code/controllers/admin.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11212, "/obj/effect/statclick", "/obj/effect", {
	target: null,
	name: "Initializing...",
});

// admin.dm:6
rt.def("/obj/effect/statclick/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.initialized) return f.dot;
	rt.setAt(f.argsList, 1, 1);
	yield* GLOB.SSatoms.InitAtom(this, f.argsList);
	return f.dot;
}, true, { args: ["loc"] });

// admin.dm:9
rt.def("/obj/effect/statclick/proc/Initialize", function Initialize(f: Frame, mapload: Value, text: Value, target: Value) {
	f.dot = parent_proc();
	this.name = text;
	this.target = target;
	return f.dot;
}, false);

// admin.dm:14
rt.def("/obj/effect/statclick/proc/update", function update(f: Frame, text: Value) {
	this.name = text;
	return this;
});

rt.type(11213, "/obj/effect/statclick/debug", "/obj/effect/statclick", {
	class: null,
});

// admin.dm:21
rt.def("/obj/effect/statclick/debug/proc/Click", function* Click(f: Frame) {
	if (!f.usr.client.holder || !this.target) {
		return f.dot;
	}
	if (!this.class) {
		if (rt.istype(this.target, T("/datum/controller/subsystem"))) {
			this.class = "subsystem";
		} else if (rt.istype(this.target, T("/datum/controller"))) {
			this.class = "controller";
		} else if (rt.istype(this.target, T("/datum"))) {
			this.class = "datum";
		} else {
			this.class = "unknown";
		}
	}
	yield* f.usr.client.debug_variables(this.target);
	message_admins(`Admin ${key_name_admin(f.usr)} is debugging the ${this.target} ${this.class}.`);
	return f.dot;
}, true);

// admin.dm:43
rt.def("/client/proc/restart_controller", function* restart_controller(f: Frame, controller: Value) {
	if (!this.holder) {
		return f.dot;
	}
	if (controller === "Master") {
		yield* Recreate_MC();
	} else if (controller === "Failsafe") {
		yield* new_(T("/datum/controller/failsafe"));
	}
	message_admins(`Admin ${key_name_admin(f.usr)} has restarted the ${controller} controller.`);
	return f.dot;
}, true, { verb: { name: "Restart Controller", category: "Debug", desc: "Restart one of the various periodic loop controllers for the game (be careful!)" }, argTypes: [{ source: "?" }] });
