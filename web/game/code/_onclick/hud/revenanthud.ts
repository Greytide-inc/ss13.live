// Based on /tg/station's code/_onclick/hud/revenanthud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(77, "/datum/hud/revenant", "/datum/hud", {});

// revenanthud.dm:3
rt.def("/datum/hud/revenant/proc/New", function* New(f: Frame, owner: Value) {
	yield* parent_proc();
	this.healths = (yield* new_(T("/obj/screen/healths/revenant")));
	this.infodisplay += this.healths;
	return f.dot;
}, true);

// revenanthud.dm:9
rt.def("/mob/living/simple_animal/revenant/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/revenant"), this));
	return f.dot;
}, true);
