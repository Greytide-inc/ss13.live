// Based on /tg/station's code/_onclick/hud/alien_larva.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(63, "/datum/hud/larva", "/datum/hud", {});

// alien_larva.dm:2
rt.def("/datum/hud/larva/proc/New", function* New(f: Frame, owner: Value) {
	let using: Value = null;
	yield* parent_proc();
	(using = (yield* new_(T("/obj/screen/act_intent/alien")))).icon_state = this.mymob.a_intent;
	this.static_inventory += using;
	this.action_intent = using;
	this.healths = (yield* new_(T("/obj/screen/healths/alien")));
	this.infodisplay += this.healths;
	this.alien_queen_finder = (yield* new_(T("/obj/screen/alien/alien_queen_finder")));
	this.infodisplay += this.alien_queen_finder;
	this.pull_icon = (yield* new_(T("/obj/screen/pull")));
	this.pull_icon.icon = rt.rsc("icons/mob/screen_alien.dmi");
	yield* this.pull_icon.update_icon(this.mymob);
	this.pull_icon.screen_loc = "EAST-2:26,SOUTH+1:7";
	this.hotkeybuttons += this.pull_icon;
	(using = (yield* new_(T("/obj/screen/language_menu")))).screen_loc = "EAST-3:26,SOUTH:5";
	this.static_inventory += using;
	this.zone_select = (yield* new_(T("/obj/screen/zone_sel/alien")));
	yield* this.zone_select.update_icon(this.mymob);
	this.static_inventory += this.zone_select;
	return f.dot;
}, true);

// alien_larva.dm:30
rt.def("/mob/living/carbon/alien/larva/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/larva"), this));
	return f.dot;
}, true);
