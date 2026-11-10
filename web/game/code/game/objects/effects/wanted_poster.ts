// Based on /tg/station's code/game/objects/effects/wanted_poster.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(6985, "/obj/item/weapon/poster/wanted", "/obj/item/weapon/poster", {
	icon_state: "rolled_poster",
});

// wanted_poster.dm:5
rt.def("/obj/item/weapon/poster/wanted/proc/Initialize", function* Initialize(f: Frame, mapload: Value, person_icon: Value, wanted_name: Value, description: Value) {
	f.dot = (yield* parent_proc(mapload, (yield* new_(T("/obj/structure/sign/poster/wanted"), this, person_icon, wanted_name, description))));
	this.name = `wanted poster (${wanted_name})`;
	this.desc = `A wanted poster for ${wanted_name}.`;
	return f.dot;
}, true);

rt.type(12657, "/obj/structure/sign/poster/wanted", "/obj/structure/sign/poster", {
	wanted_name: null,
});

// wanted_poster.dm:13
rt.def("/obj/structure/sign/poster/wanted/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (!f.args[1]) {
		return 2;
	}
	this.name = `wanted poster (${f.args[2]})`;
	this.wanted_name = f.args[2];
	this.desc = f.args[3];
	f.args[1] = icon(f.args[1], { dir: 2 });
	let the_icon: Value = icon({ icon: rt.rsc("icons/obj/poster_wanted.dmi"), icon_state: "wanted_background" });
	let icon_foreground: Value = icon({ icon: rt.rsc("icons/obj/poster_wanted.dmi"), icon_state: "wanted_foreground" });
	f.args[1].Shift(2, 7);
	f.args[1].Crop(7, 4, 26, 30);
	f.args[1].Crop(-5, -2, 26, 29);
	the_icon.Blend(f.args[1], 3);
	the_icon.Blend(icon_foreground, 3);
	the_icon.Insert(the_icon, "wanted");
	the_icon.Insert(icon(rt.rsc("icons/obj/contraband.dmi"), "poster_being_set"), "poster_being_set");
	the_icon.Insert(icon(rt.rsc("icons/obj/contraband.dmi"), "poster_ripped"), "poster_ripped");
	this.icon = the_icon;
	return f.dot;
}, false, { args: ["mapload", "person_icon", "person_name", "description"] });

// wanted_poster.dm:35
rt.def("/obj/structure/sign/poster/wanted/proc/roll_and_drop", function* roll_and_drop(f: Frame, location: Value) {
	let _P: Value = null;
	(_P = (yield* parent_proc(location))).name = `wanted poster (${this.wanted_name})`;
	_P.desc = `A wanted poster for ${this.wanted_name}.`;
	return _P;
}, true);
