// Based on /tg/station's code/modules/mob/living/silicon/death.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// death.dm:2
rt.def("/mob/living/silicon/proc/spawn_gibs", function* spawn_gibs(f: Frame) {
	yield* new_(T("/obj/effect/gibspawner/robot"), this.loc, this.viruses);
	return f.dot;
}, true);

// death.dm:5
rt.def("/mob/living/silicon/proc/spawn_dust", function* spawn_dust(f: Frame) {
	yield* new_(T("/obj/effect/decal/remains/robot"), this.loc);
	return f.dot;
}, true);

// death.dm:8
rt.def("/mob/living/silicon/proc/death", function* death(f: Frame, gibbed: Value) {
	if (!gibbed) {
		yield* this.emote("deathgasp");
	}
	this.diag_hud_set_status();
	this.diag_hud_set_health();
	this.update_health_hud();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
