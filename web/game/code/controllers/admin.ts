// From code/controllers/admin.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11212, "/obj/effect/statclick", "/obj/effect", {
	target: null,
	name: "Initializing...",
});

// /obj/effect/statclick/proc/New  (code/controllers/admin.dm:6)  may sleep
rt.def("/obj/effect/statclick/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "initialized"))) return f.dot;
	rt.setAt(f.argsList, 1, 1);
	yield* g.callName(f, rt.gl("SSatoms"), "InitAtom", [live(f.src), f.argsList]);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/effect/statclick/proc/Initialize  (code/controllers/admin.dm:9)
rt.def("/obj/effect/statclick/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", live(f.args[1]));
	rt.setFv(f, "target", live(f.src), live(f.args[2]));
	return f.dot;
}, false, { args: ["mapload", "text", "target"] });

// /obj/effect/statclick/proc/update  (code/controllers/admin.dm:14)
rt.def("/obj/effect/statclick/proc/update", function update(f: Frame, text: Value) {
	rt.setSv(f, "name", live(text));
	return live(f.src);
});

rt.type(11213, "/obj/effect/statclick/debug", "/obj/effect/statclick", {
	class: null,
});

// /obj/effect/statclick/debug/proc/Click  (code/controllers/admin.dm:21)  may sleep
rt.def("/obj/effect/statclick/debug/proc/Click", function* Click(f: Frame) {
	if ((!truthy(rt.gv(f, "holder", rt.fv(f, "client", live(f.usr)))) || !truthy(rt.sv(f, "target")))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "class"))) {
		if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/controller/subsystem")) ? 1 : 0))) {
			rt.setSv(f, "class", "subsystem");
		} else {
			if (truthy((rt.istype(rt.sv(f, "target"), T("/datum/controller")) ? 1 : 0))) {
				rt.setSv(f, "class", "controller");
			} else {
				if (truthy((rt.istype(rt.sv(f, "target"), T("/datum")) ? 1 : 0))) {
					rt.setSv(f, "class", "datum");
				} else {
					rt.setSv(f, "class", "unknown");
				}
			}
		}
	}
	yield* g.callName(f, rt.fv(f, "client", live(f.usr)), "debug_variables", [rt.sv(f, "target")]);
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ is debugging the ＀ ＀.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.sv(f, "target"), rt.sv(f, "class")])]);
	return f.dot;
}, true);

// /client/proc/restart_controller  (code/controllers/admin.dm:43)  may sleep
rt.def("/client/proc/restart_controller", function* restart_controller(f: Frame, controller: Value) {
	let $0: any;
	f.vars = () => [controller, $0];
	if (!truthy(rt.sv(f, "holder"))) {
		return live(f.dot);
	}
	$0 = live(controller);
	if ($0 === "Master") {
		yield* g.call(f, P("/proc/Recreate_MC"), null, []);
	} else if ($0 === "Failsafe") {
		yield* g.new_(f, T("/datum/controller/failsafe"), []);
	}
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Admin ＀ has restarted the ＀ controller.", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), live(controller)])]);
	return f.dot;
}, true, { verb: { name: "Restart Controller", category: "Debug", desc: "Restart one of the various periodic loop controllers for the game (be careful!)" }, argTypes: [{ source: "?" }] });
