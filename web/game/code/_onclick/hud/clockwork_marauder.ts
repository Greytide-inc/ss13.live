// Based on /tg/station's code/_onclick/hud/clockwork_marauder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(66, "/datum/hud/marauder", "/datum/hud", {
	hosthealth: null,
	blockchance: null,
	counterchance: null,
});

// clockwork_marauder.dm:7
rt.def("/datum/hud/marauder/proc/New", function* New(f: Frame, owner: Value) {
	let using: Value = null;
	yield* parent_proc();
	this.healths = (yield* new_(T("/obj/screen/healths/clock")));
	this.infodisplay += this.healths;
	this.hosthealth = (yield* new_(T("/obj/screen/healths/clock")));
	this.hosthealth.screen_loc = "EAST-1:28,CENTER:17";
	this.infodisplay += this.hosthealth;
	(using = (yield* new_(T("/obj/screen/marauder/emerge")))).screen_loc = "EAST-1:28,SOUTH:5";
	this.static_inventory += using;
	return f.dot;
}, true);

// clockwork_marauder.dm:25
rt.def("/datum/hud/marauder/proc/Destroy", function* Destroy(f: Frame) {
	this.blockchance = null;
	this.counterchance = null;
	this.hosthealth = null;
	return (yield* parent_proc());
}, true);

// clockwork_marauder.dm:28
rt.def("/mob/living/simple_animal/hostile/clockwork/marauder/proc/create_mob_hud", function* create_mob_hud(f: Frame) {
	if (!(this.client && !this.hud_used)) return f.dot;
	this.hud_used = (yield* new_(T("/datum/hud/marauder"), this, ui_style2icon(this.client.prefs.UI_style)));
	return f.dot;
}, true);

rt.type(11096, "/obj/screen/marauder/emerge", "/obj/screen/marauder", {
	icon_state: "marauder_emerge",
	name: "Emerge/Return",
	desc: "Emerge or Return.",
});

// clockwork_marauder.dm:40
rt.def("/obj/screen/marauder/emerge/proc/Click", function* Click(f: Frame) {
	let M: Value = null;
	if (!rt.istype(f.usr, T("/mob/living/simple_animal/hostile/clockwork/marauder"))) return f.dot;
	if ((M = f.usr).is_in_host()) {
		yield* M.try_emerge();
	} else {
		yield* M.return_to_host();
	}
	return f.dot;
}, true);
