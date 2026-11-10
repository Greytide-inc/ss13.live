// Based on /tg/station's code/_onclick/hud/blobbernauthud.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(65, "/datum/hud/blobbernaut", "/datum/hud", {});

// blobbernauthud.dm:3
rt.def("/datum/hud/blobbernaut/proc/New", function* New(f: Frame, owner: Value) {
	yield* parent_proc();
	this.blobpwrdisplay = (yield* new_(T("/obj/screen/healths/blob/naut/core")));
	this.infodisplay += this.blobpwrdisplay;
	this.healths = (yield* new_(T("/obj/screen/healths/blob/naut")));
	this.infodisplay += this.healths;
	return f.dot;
}, true);

// blobbernauthud.dm:12
rt.def("/mob/living/simple_animal/hostile/blob/blobbernaut/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/blobbernaut"), this));
	return f.dot;
}, true);
