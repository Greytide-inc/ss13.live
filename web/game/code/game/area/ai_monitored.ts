// From code/game/area/ai_monitored.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(13075, "/area/ai_monitored", "/area", {
	motioncameras: null,
	motionTargets: null,
	name: "AI Monitored Area",
});

// /area/ai_monitored/proc/<init>  (code/game/area/ai_monitored.dm:3)
rt.def("/area/ai_monitored/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "motioncameras", rt.list());
	$0 = $0;
	rt.setSv(f, "motionTargets", rt.list());
	return f.dot;
});

// /area/ai_monitored/proc/Initialize  (code/game/area/ai_monitored.dm:7)  may sleep
rt.def("/area/ai_monitored/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[0]))) return f.dot;
	M = null;
	rt.forList(f, 0, live(f.src), T("/obj/machinery/camera"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (truthy((yield* g.callName(f, live(M), "isMotion", [])))) {
			yield* g.callName(f, rt.sv(f, "motioncameras"), "Add", [live(M)]);
			rt.setFv(f, "area_motion", live(M), live(f.src));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { args: ["mapload"] });

// /area/ai_monitored/proc/Entered  (code/game/area/ai_monitored.dm:17)
rt.def("/area/ai_monitored/proc/Entered", function Entered(f: Frame) {
	let X: Value = null, cam: Value = null;
	let $e: any;
	f.vars = () => [X, cam, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/ismob"), null, [live(f.args[0])])) && truthy(rt.len(f, rt.sv(f, "motioncameras"))))) return f.dot;
	X = null;
	rt.forList(f, 0, rt.sv(f, "motioncameras"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.callName(f, (cam = live(X)), "newTarget", [live(f.args[0])]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["O"], waitfor: false });

// /area/ai_monitored/proc/Exited  (code/game/area/ai_monitored.dm:25)
rt.def("/area/ai_monitored/proc/Exited", function Exited(f: Frame) {
	let X: Value = null, cam: Value = null;
	let $e: any;
	f.vars = () => [X, cam, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!(truthy(rt.call(f, P("/proc/ismob"), null, [live(f.args[0])])) && truthy(rt.len(f, rt.sv(f, "motioncameras"))))) return f.dot;
	X = null;
	rt.forList(f, 0, rt.sv(f, "motioncameras"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		rt.callName(f, (cam = live(X)), "lostTarget", [live(f.args[0])]);
		return live(f.dot);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["O"] });
