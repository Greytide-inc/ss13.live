// Based on /tg/station's code/modules/mob/living/carbon/alien/screen.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// screen.dm:4
rt.def("/mob/living/carbon/alien/proc/updatePlasmaDisplay", function updatePlasmaDisplay(f: Frame) {
	if (!this.hud_used) return f.dot;
	this.hud_used.alien_plasma_display.maptext = `<div align='center' valign='middle' style='position:relative; top:0px; left:6px'><font color='magenta'>${round(this.getPlasma())}</font></div>`;
	return f.dot;
});

// screen.dm:11
rt.def("/mob/living/carbon/alien/proc/findQueen", function findQueen(f: Frame) {
	let queen: Value = null;
	if (!this.hud_used) return f.dot;
	this.hud_used.alien_queen_finder.cut_overlays();
	if (!(queen = get_alien_type(T("/mob/living/carbon/alien/humanoid/royal/queen")))) {
		return f.dot;
	}
	let Q: Value = rt.getStep(f, queen, 0);
	let A: Value = rt.getStep(f, this, 0);
	if (Q.z != A.z) {
		return f.dot;
	}
	let Qdir: Value = rt.getDir(f, this, Q);
	let Qdist: Value = get_dist(this, Q);
	let finder_icon: Value = "finder_center";
	if (rt.inRange(Qdist, 2, 7)) {
		finder_icon = "finder_near";
	} else if (rt.inRange(Qdist, 8, 20)) {
		finder_icon = "finder_med";
	} else if (rt.inRange(Qdist, 21, 1e+31)) {
		finder_icon = "finder_far";
	}
	let finder_eye: Value = image(rt.rsc("icons/mob/screen_alien.dmi"), finder_icon, { dir: Qdir });
	this.hud_used.alien_queen_finder.add_overlay(finder_eye);
	return f.dot;
});
