// From code/game/machinery/camera/presets.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10624, "/obj/machinery/camera/emp_proof", "/obj/machinery/camera", {
	start_active: 1,
});

// /obj/machinery/camera/emp_proof/proc/Initialize  (code/game/machinery/camera/presets.dm:8)  may sleep
rt.def("/obj/machinery/camera/emp_proof/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "upgradeEmpProof");
	return f.dot;
}, true);

rt.type(10625, "/obj/machinery/camera/xray", "/obj/machinery/camera", {
	start_active: 1,
	icon_state: "xraycam",
});

// /obj/machinery/camera/xray/proc/Initialize  (code/game/machinery/camera/presets.dm:18)  may sleep
rt.def("/obj/machinery/camera/xray/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "upgradeXRay");
	return f.dot;
}, true);

rt.type(10626, "/obj/machinery/camera/motion", "/obj/machinery/camera", {
	start_active: 1,
	name: "motion-sensitive security camera",
});

// /obj/machinery/camera/motion/proc/Initialize  (code/game/machinery/camera/presets.dm:27)  may sleep
rt.def("/obj/machinery/camera/motion/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "upgradeMotion");
	return f.dot;
}, true);

rt.type(10627, "/obj/machinery/camera/all", "/obj/machinery/camera", {
	start_active: 1,
});

// /obj/machinery/camera/all/proc/Initialize  (code/game/machinery/camera/presets.dm:35)  may sleep
rt.def("/obj/machinery/camera/all/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "upgradeEmpProof");
	yield* g.srcCall(f, "upgradeXRay");
	yield* g.srcCall(f, "upgradeMotion");
	return f.dot;
}, true);

rt.type(10628, "/obj/machinery/camera/autoname", "/obj/machinery/camera", {
	number: 0,
});

// /obj/machinery/camera/autoname/proc/Initialize  (code/game/machinery/camera/presets.dm:47)  may sleep
rt.def("/obj/machinery/camera/autoname/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return 1;
}, true);

// /obj/machinery/camera/autoname/proc/LateInitialize  (code/game/machinery/camera/presets.dm:51)
rt.def("/obj/machinery/camera/autoname/proc/LateInitialize", function LateInitialize(f: Frame) {
	let A: Value = null, C: Value = null, CA: Value = null;
	let $e: any;
	f.vars = () => [A, C, CA, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "number", 1);
	if (!truthy((A = rt.call(f, P("/proc/get_area"), null, [live(f.src)])))) return f.dot;
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/camera/autoname"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (isEqual(live(C), live(f.src))) {
			continue;
		}
		if (isEqual(rt.gv(f, "type", (CA = rt.call(f, P("/proc/get_area"), null, [live(C)]))), rt.fv(f, "type", live(A)))) {
			if (truthy(rt.fv(f, "number", live(C)))) {
				rt.setSv(f, "number", rt.call(f, P("/proc/max"), null, [rt.sv(f, "number"), add(rt.fv(f, "number", live(C)), 1)]));
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "c_tag", fmt("＀ #＀", [rt.fv(f, "name", live(A)), rt.sv(f, "number")]));
	return f.dot;
});

// /obj/machinery/camera/proc/isEmpProof  (code/game/machinery/camera/presets.dm:66)
rt.def("/obj/machinery/camera/proc/isEmpProof", function isEmpProof(f: Frame) {
	return rt.bitAnd(rt.sv(f, "upgrades"), 2);
});

// /obj/machinery/camera/proc/isXRay  (code/game/machinery/camera/presets.dm:69)
rt.def("/obj/machinery/camera/proc/isXRay", function isXRay(f: Frame) {
	return rt.bitAnd(rt.sv(f, "upgrades"), 1);
});

// /obj/machinery/camera/proc/isMotion  (code/game/machinery/camera/presets.dm:72)
rt.def("/obj/machinery/camera/proc/isMotion", function isMotion(f: Frame) {
	return rt.bitAnd(rt.sv(f, "upgrades"), 4);
});

// /obj/machinery/camera/proc/upgradeEmpProof  (code/game/machinery/camera/presets.dm:77)  may sleep
rt.def("/obj/machinery/camera/proc/upgradeEmpProof", function* upgradeEmpProof(f: Frame) {
	yield* g.callName(f, rt.fv(f, "upgrades", rt.sv(f, "assembly")), "Add", [(yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [rt.sv(f, "assembly")]))]);
	(rt.modSrcVar(f, "upgrades", 2, rt.bitOr));
	return f.dot;
}, true);

// /obj/machinery/camera/proc/upgradeXRay  (code/game/machinery/camera/presets.dm:81)  may sleep
rt.def("/obj/machinery/camera/proc/upgradeXRay", function* upgradeXRay(f: Frame) {
	yield* g.callName(f, rt.fv(f, "upgrades", rt.sv(f, "assembly")), "Add", [(yield* g.new_(f, T("/obj/item/device/analyzer"), [rt.sv(f, "assembly")]))]);
	(rt.modSrcVar(f, "upgrades", 1, rt.bitOr));
	return f.dot;
}, true);

// /obj/machinery/camera/proc/upgradeMotion  (code/game/machinery/camera/presets.dm:86)  may sleep
rt.def("/obj/machinery/camera/proc/upgradeMotion", function* upgradeMotion(f: Frame) {
	yield* g.callName(f, rt.fv(f, "upgrades", rt.sv(f, "assembly")), "Add", [(yield* g.new_(f, T("/obj/item/device/assembly/prox_sensor"), [rt.sv(f, "assembly")]))]);
	(rt.modSrcVar(f, "upgrades", 4, rt.bitOr));
	return f.dot;
}, true);
