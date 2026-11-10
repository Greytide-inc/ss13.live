// Based on /tg/station's code/game/machinery/camera/presets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10624, "/obj/machinery/camera/emp_proof", "/obj/machinery/camera", {
	start_active: 1,
});

// presets.dm:8
rt.def("/obj/machinery/camera/emp_proof/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.upgradeEmpProof();
	return f.dot;
}, true);

rt.type(10625, "/obj/machinery/camera/xray", "/obj/machinery/camera", {
	start_active: 1,
	icon_state: "xraycam",
});

// presets.dm:18
rt.def("/obj/machinery/camera/xray/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.upgradeXRay();
	return f.dot;
}, true);

rt.type(10626, "/obj/machinery/camera/motion", "/obj/machinery/camera", {
	start_active: 1,
	name: "motion-sensitive security camera",
});

// presets.dm:27
rt.def("/obj/machinery/camera/motion/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.upgradeMotion();
	return f.dot;
}, true);

rt.type(10627, "/obj/machinery/camera/all", "/obj/machinery/camera", {
	start_active: 1,
});

// presets.dm:35
rt.def("/obj/machinery/camera/all/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.upgradeEmpProof();
	yield* this.upgradeXRay();
	yield* this.upgradeMotion();
	return f.dot;
}, true);

rt.type(10628, "/obj/machinery/camera/autoname", "/obj/machinery/camera", {
	number: 0,
});

// presets.dm:47
rt.def("/obj/machinery/camera/autoname/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// presets.dm:51
rt.def("/obj/machinery/camera/autoname/proc/LateInitialize", function LateInitialize(f: Frame) {
	let A: Value = null, C: Value = null, CA: Value = null;
	f.dot = parent_proc();
	this.number = 1;
	if (!(A = get_area(this))) return f.dot;
	for (C of each(GLOB.machines, T("/obj/machinery/camera/autoname"))) {
		if (C == this) {
			continue;
		}
		if ((CA = get_area(C)).type == A.type) {
			if (C.number) {
				this.number = max(this.number, C.number + 1);
			}
		}
	}
	this.c_tag = `${A.name} #${this.number}`;
	return f.dot;
});

// presets.dm:66
rt.def("/obj/machinery/camera/proc/isEmpProof", function isEmpProof(f: Frame) {
	return rt.bitAnd(this.upgrades, CAMERA_UPGRADE_EMP_PROOF);
});

// presets.dm:69
rt.def("/obj/machinery/camera/proc/isXRay", function isXRay(f: Frame) {
	return rt.bitAnd(this.upgrades, CAMERA_UPGRADE_XRAY);
});

// presets.dm:72
rt.def("/obj/machinery/camera/proc/isMotion", function isMotion(f: Frame) {
	return rt.bitAnd(this.upgrades, CAMERA_UPGRADE_MOTION);
});

// presets.dm:77
rt.def("/obj/machinery/camera/proc/upgradeEmpProof", function* upgradeEmpProof(f: Frame) {
	this.assembly.upgrades.Add((yield* new_(T("/obj/item/stack/sheet/mineral/plasma"), this.assembly)));
	(rt.modSrcVar(f, "upgrades", CAMERA_UPGRADE_EMP_PROOF, rt.bitOr));
	return f.dot;
}, true);

// presets.dm:81
rt.def("/obj/machinery/camera/proc/upgradeXRay", function* upgradeXRay(f: Frame) {
	this.assembly.upgrades.Add((yield* new_(T("/obj/item/device/analyzer"), this.assembly)));
	(rt.modSrcVar(f, "upgrades", CAMERA_UPGRADE_XRAY, rt.bitOr));
	return f.dot;
}, true);

// presets.dm:86
rt.def("/obj/machinery/camera/proc/upgradeMotion", function* upgradeMotion(f: Frame) {
	this.assembly.upgrades.Add((yield* new_(T("/obj/item/device/assembly/prox_sensor"), this.assembly)));
	(rt.modSrcVar(f, "upgrades", CAMERA_UPGRADE_MOTION, rt.bitOr));
	return f.dot;
}, true);
