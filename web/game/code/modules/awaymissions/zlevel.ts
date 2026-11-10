// Based on /tg/station's code/modules/awaymissions/zlevel.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// zlevel.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobalpotentialRandomZlevels", function InitGlobalpotentialRandomZlevels(f: Frame) {
	GLOB.potentialRandomZlevels = generateMapList({ filename: "config/awaymissionconfig.txt" });
	this.gvars_datum_init_order += "potentialRandomZlevels";
	return f.dot;
});

// zlevel.dm:5
rt.def("/proc/createRandomZlevel", function* createRandomZlevel(f: Frame) {
	let map: Value = null;
	if (rt.len(f, GLOB.awaydestinations)) {
		return f.dot;
	}
	if (!(GLOB.potentialRandomZlevels && rt.len(f, GLOB.potentialRandomZlevels))) return f.dot;
	to_chat(rt.world(), "<span class='boldannounce'>Loading away mission...</span>");
	yield* load_new_z_level((map = pick(GLOB.potentialRandomZlevels)));
	to_chat(rt.world(), "<span class='boldannounce'>Away mission loaded.</span>");
	return f.dot;
}, true);

rt.type(11519, "/obj/effect/landmark/awaystart", "/obj/effect/landmark", {
	name: "away mission spawn",
	desc: "Randomly picked away mission spawn points",
});

// zlevel.dm:26
rt.def("/obj/effect/landmark/awaystart/proc/New", function* New(f: Frame) {
	GLOB.awaydestinations += this;
	yield* parent_proc();
	return f.dot;
}, true);

// zlevel.dm:30
rt.def("/obj/effect/landmark/awaystart/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.awaydestinations -= this;
	return (yield* parent_proc());
}, true);

// zlevel.dm:34
rt.def("/proc/generateMapList", function generateMapList(f: Frame, filename: Value) {
	let Lines: Value = null, t: Value = null, pos: Value = null, name: Value = null;
	let potentialMaps: Value = list();
	if (!rt.len(f, (Lines = rt.world().file2list(filename)))) {
		return f.dot;
	}
	for (t of each(Lines)) {
		if (!t) {
			continue;
		}
		if (rt.length((t = trim(t))) == 0) {
			continue;
		}
		if (copytext(t, 1, 2) == "#") {
			continue;
		}
		pos = findtext(t, " ");
		name = null;
		if (pos) {
			name = lowertext(copytext(t, 1, pos));
		} else {
			name = lowertext(t);
		}
		if (!name) {
			continue;
		}
		potentialMaps.Add(t);
	}
	return potentialMaps;
});
