// From code/modules/mob/living/carbon/alien/screen.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /mob/living/carbon/alien/proc/updatePlasmaDisplay  (code/modules/mob/living/carbon/alien/screen.dm:4)
rt.def("/mob/living/carbon/alien/proc/updatePlasmaDisplay", function updatePlasmaDisplay(f: Frame) {
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	rt.setFv(f, "maptext", rt.fv(f, "alien_plasma_display", rt.sv(f, "hud_used")), fmt("<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='magenta'>＀</font></div>", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "getPlasma", [])])]));
	return f.dot;
});

// /mob/living/carbon/alien/proc/findQueen  (code/modules/mob/living/carbon/alien/screen.dm:11)
rt.def("/mob/living/carbon/alien/proc/findQueen", function findQueen(f: Frame) {
	let queen: Value = null, Q: Value = null, A: Value = null, Qdir: Value = null, Qdist: Value = null, finder_icon: Value = null, finder_eye: Value = null;
	let $0: any;
	f.vars = () => [queen, Q, A, Qdir, Qdist, finder_icon, finder_eye, $0];
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	rt.callName(f, rt.fv(f, "alien_queen_finder", rt.sv(f, "hud_used")), "cut_overlays", []);
	if (!truthy((queen = rt.call(f, P("/proc/get_alien_type"), null, [T("/mob/living/carbon/alien/humanoid/royal/queen")])))) {
		return live(f.dot);
	}
	Q = rt.getStep(f, live(queen), 0);
	A = rt.getStep(f, live(f.src), 0);
	if (!isEqual(rt.fv(f, "z", live(Q)), rt.fv(f, "z", live(A)))) {
		return live(f.dot);
	}
	Qdir = rt.getDir(f, live(f.src), live(Q));
	Qdist = rt.call(f, P("/proc/get_dist"), null, [live(f.src), live(Q)]);
	finder_icon = "finder_center";
	$0 = live(Qdist);
	if (rt.inRange($0, 2, 7)) {
		finder_icon = "finder_near";
	} else if (rt.inRange($0, 8, 20)) {
		finder_icon = "finder_med";
	} else if (rt.inRange($0, 21, 9.999999848243207e+30)) {
		finder_icon = "finder_far";
	}
	finder_eye = rt.call(f, P("/proc/image"), null, [null, rt.rsc("icons/mob/screen_alien.dmi"), null, live(finder_icon), "dir", live(Qdir)], rt.Args.Named);
	rt.callName(f, rt.fv(f, "alien_queen_finder", rt.sv(f, "hud_used")), "add_overlay", [live(finder_eye)]);
	return f.dot;
});
