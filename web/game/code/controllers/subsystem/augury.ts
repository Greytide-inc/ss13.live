// From code/controllers/subsystem/augury.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(16, "/datum/controller/subsystem/augury", "/datum/controller/subsystem", {
	watchers: null,
	doombringers: null,
	observers_given_action: null,
	name: "Augury",
	flags: 1,
	runlevels: 12,
});

// /datum/controller/subsystem/augury/proc/New  (code/controllers/subsystem/augury.dm:1)  may sleep
rt.def("/datum/controller/subsystem/augury/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSaugury"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSaugury"), T("/datum/controller/subsystem/augury")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSaugury")]);
		}
		rt.setGl("SSaugury", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/augury/proc/<init>  (code/controllers/subsystem/augury.dm:6)
rt.def("/datum/controller/subsystem/augury/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "watchers", rt.list());
	$0 = $0;
	rt.setSv(f, "doombringers", rt.list());
	$0 = $0;
	rt.setSv(f, "observers_given_action", rt.list());
	return f.dot;
});

// /datum/controller/subsystem/augury/proc/stat_entry  (code/controllers/subsystem/augury.dm:12)  may sleep
rt.def("/datum/controller/subsystem/augury/proc/stat_entry", function* stat_entry(f: Frame, msg: Value) {
	f.vars = () => [msg];
	yield* g.callSuper(f, [fmt("W:＀|D:＀", [rt.len(f, rt.sv(f, "watchers")), rt.len(f, rt.sv(f, "doombringers"))])]);
	return f.dot;
}, true);

// /datum/controller/subsystem/augury/proc/fire  (code/controllers/subsystem/augury.dm:21)  may sleep
rt.def("/datum/controller/subsystem/augury/proc/fire", function* fire(f: Frame) {
	let biggest_doom: Value = null, biggest_threat: Value = null, db: Value = null, d: Value = null, threat: Value = null, i: Value = null, A: Value = null, O: Value = null, A_4: Value = null, w: Value = null;
	let $e: any;
	f.vars = () => [biggest_doom, biggest_threat, db, d, threat, i, A, O, A_4, w, $e];
	biggest_doom = null;
	biggest_threat = null;
	db = null;
	rt.forList(f, 0, rt.sv(f, "doombringers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		db = $e;
		if ((!truthy((d = live(db))) || (!truthy(live(d)) || truthy(rt.fv(f, "gc_destroyed", live(d)))))) {
			(rt.modSrcVar(f, "doombringers", live(d), subtract));
			continue;
		}
		threat = rt.index(rt.sv(f, "doombringers"), live(d));
		if ((live(biggest_threat) === null || rt.lt(live(biggest_threat), live(threat)))) {
			biggest_doom = live(d);
			biggest_threat = live(threat);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "doombringers")))) {
		i = null;
		rt.forList(f, 0, rt.gl("player_list"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if ((truthy((rt.istype(live(i), T("/mob/dead/observer")) ? 1 : 0)) && !truthy(rt.index(rt.sv(f, "observers_given_action"), live(i))))) {
				yield* g.callName(f, (A = (yield* g.new_(f, T("/datum/action/innate/augury"), []))), "Grant", [live(i)]);
				rt.setAt(rt.sv(f, "observers_given_action"), live(i), 1);
			}
		}
		rt.endFor(f, 0);
	} else {
		i = null;
		rt.forList(f, 0, rt.sv(f, "observers_given_action"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if ((truthy(rt.index(rt.sv(f, "observers_given_action"), live(i))) && truthy((rt.istype(live(i), T("/mob/dead/observer")) ? 1 : 0)))) {
				O = live(i);
				A_4 = null;
				rt.forList(f, 1, rt.fv(f, "actions", live(O)), T("/datum/action/innate/augury"));
				while (($e = rt.next(f, 1)) !== undefined) {
					A_4 = $e;
					yield* g.call(f, P("/proc/qdel"), null, [live(A_4)]);
				}
				rt.endFor(f, 1);
			}
			(rt.modSrcVar(f, "observers_given_action", live(i), subtract));
		}
		rt.endFor(f, 0);
	}
	w = null;
	rt.forList(f, 0, rt.sv(f, "watchers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		w = $e;
		if (!truthy(live(w))) {
			(rt.modSrcVar(f, "watchers", live(w), subtract));
			continue;
		}
		O = live(w);
		if ((truthy(live(biggest_doom)) && (!truthy(rt.fv(f, "orbiting", live(O))) || !isEqual(rt.gv(f, "orbiting", rt.fv(f, "orbiting", live(O))), live(biggest_doom))))) {
			yield* g.callName(f, live(O), "ManualFollow", [live(biggest_doom)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(84, "/datum/action/innate/augury", "/datum/action/innate", {
	name: "Auto Follow Debris",
	icon_icon: rt.rsc("icons/obj/meteor.dmi"),
	button_icon_state: "flaming",
	background_icon_state: "default",
});

// /datum/action/innate/augury/proc/Destroy  (code/controllers/subsystem/augury.dm:61)  may sleep
rt.def("/datum/action/innate/augury/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		(rt.modField(f, rt.gl("SSaugury"), "watchers", rt.sv(f, "owner"), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/action/innate/augury/proc/Activate  (code/controllers/subsystem/augury.dm:66)  may sleep
rt.def("/datum/action/innate/augury/proc/Activate", function* Activate(f: Frame) {
	rt.modField(f, rt.gl("SSaugury"), "watchers", rt.sv(f, "owner"), add);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You are now auto-following debris.</span>"]);
	rt.setSv(f, "active", 1);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

// /datum/action/innate/augury/proc/Deactivate  (code/controllers/subsystem/augury.dm:71)  may sleep
rt.def("/datum/action/innate/augury/proc/Deactivate", function* Deactivate(f: Frame) {
	(rt.modField(f, rt.gl("SSaugury"), "watchers", rt.sv(f, "owner"), subtract));
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "owner"), "<span class='notice'>You are no longer auto-following debris.</span>"]);
	rt.setSv(f, "active", 0);
	yield* g.srcCall(f, "UpdateButtonIcon");
	return f.dot;
}, true);

// /datum/action/innate/augury/proc/UpdateButtonIcon  (code/controllers/subsystem/augury.dm:77)  may sleep
rt.def("/datum/action/innate/augury/proc/UpdateButtonIcon", function* UpdateButtonIcon(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "active"))) {
		rt.setFv(f, "icon_state", rt.sv(f, "button"), "template_active");
	} else {
		rt.setFv(f, "icon_state", rt.sv(f, "button"), "template");
	}
	return f.dot;
}, true, { args: ["status_only"] });
