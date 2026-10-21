// From code/game/objects/effects/wanted_poster.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6985, "/obj/item/weapon/poster/wanted", "/obj/item/weapon/poster", {
	icon_state: "rolled_poster",
});

// /obj/item/weapon/poster/wanted/proc/Initialize  (code/game/objects/effects/wanted_poster.dm:5)  may sleep
rt.def("/obj/item/weapon/poster/wanted/proc/Initialize", function* Initialize(f: Frame, mapload: Value, person_icon: Value, wanted_name: Value, description: Value) {
	f.vars = () => [mapload, person_icon, wanted_name, description];
	f.dot = (yield* g.callSuper(f, [live(mapload), (yield* g.new_(f, T("/obj/structure/sign/poster/wanted"), [live(f.src), live(person_icon), live(wanted_name), live(description)]))]));
	rt.setSv(f, "name", fmt("wanted poster (＀)", [live(wanted_name)]));
	rt.setSv(f, "desc", fmt("A wanted poster for ＀.", [live(wanted_name)]));
	return f.dot;
}, true);

rt.type(12657, "/obj/structure/sign/poster/wanted", "/obj/structure/sign/poster", {
	wanted_name: null,
});

// /obj/structure/sign/poster/wanted/proc/Initialize  (code/game/objects/effects/wanted_poster.dm:13)
rt.def("/obj/structure/sign/poster/wanted/proc/Initialize", function Initialize(f: Frame) {
	let the_icon: Value = null, icon_foreground: Value = null;
	f.vars = () => [the_icon, icon_foreground];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.args[1]))) {
		return 2;
	}
	rt.setSv(f, "name", fmt("wanted poster (＀)", [live(f.args[2])]));
	rt.setSv(f, "wanted_name", live(f.args[2]));
	rt.setSv(f, "desc", live(f.args[3]));
	f.args[1] = rt.call(f, P("/proc/icon"), null, [null, live(f.args[1]), "dir", 2], rt.Args.Named);
	the_icon = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/obj/poster_wanted.dmi"), "icon_state", "wanted_background"], rt.Args.Named);
	icon_foreground = rt.call(f, P("/proc/icon"), null, ["icon", rt.rsc("icons/obj/poster_wanted.dmi"), "icon_state", "wanted_foreground"], rt.Args.Named);
	rt.callName(f, live(f.args[1]), "Shift", [2, 7]);
	rt.callName(f, live(f.args[1]), "Crop", [7, 4, 26, 30]);
	rt.callName(f, live(f.args[1]), "Crop", [-5, -2, 26, 29]);
	rt.callName(f, live(the_icon), "Blend", [live(f.args[1]), 3]);
	rt.callName(f, live(the_icon), "Blend", [live(icon_foreground), 3]);
	rt.callName(f, live(the_icon), "Insert", [live(the_icon), "wanted"]);
	rt.callName(f, live(the_icon), "Insert", [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/contraband.dmi"), "poster_being_set"]), "poster_being_set"]);
	rt.callName(f, live(the_icon), "Insert", [rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/contraband.dmi"), "poster_ripped"]), "poster_ripped"]);
	rt.setSv(f, "icon", live(the_icon));
	return f.dot;
}, false, { args: ["mapload", "person_icon", "person_name", "description"] });

// /obj/structure/sign/poster/wanted/proc/roll_and_drop  (code/game/objects/effects/wanted_poster.dm:35)  may sleep
rt.def("/obj/structure/sign/poster/wanted/proc/roll_and_drop", function* roll_and_drop(f: Frame, location: Value) {
	let _P: Value = null;
	f.vars = () => [location, _P];
	rt.setFv(f, "name", (_P = (yield* g.callSuper(f, [live(location)]))), fmt("wanted poster (＀)", [rt.sv(f, "wanted_name")]));
	rt.setFv(f, "desc", live(_P), fmt("A wanted poster for ＀.", [rt.sv(f, "wanted_name")]));
	return live(_P);
}, true);
