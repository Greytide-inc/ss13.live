// Based on /tg/station's code/_onclick/hud/constructs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(67, "/datum/hud/constructs", "/datum/hud", {
	ui_style_icon: rt.rsc("icons/mob/screen_construct.dmi"),
});

// constructs.dm:6
rt.def("/datum/hud/constructs/proc/New", function* New(f: Frame, owner: Value) {
	yield* parent_proc();
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = rt.rsc("icons/mob/screen_construct.dmi");
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST,CENTER-2:15";
	this.static_inventory += this.pull_icon;
	this.healths = (yield* new_(T("/obj/screen/healths/construct")));
	this.infodisplay += this.healths;
	return f.dot;
}, true);

// constructs.dm:17
rt.def("/mob/living/simple_animal/hostile/construct/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/constructs"), this));
	return f.dot;
}, true);
