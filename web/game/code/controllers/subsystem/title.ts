// Based on /tg/station's code/controllers/subsystem/title.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(49, "/datum/controller/subsystem/title", "/datum/controller/subsystem", {
	file_path: null,
	icon: null,
	previous_icon: null,
	splash_turf: null,
	name: "Title Screen",
	flags: 3,
});

// title.dm:1
rt.def("/datum/controller/subsystem/title/proc/New", function* New(f: Frame) {
	if (GLOB.SStitle != this) {
		if (rt.istype(GLOB.SStitle, T("/datum/controller/subsystem/title"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SStitle);
		}
		GLOB.SStitle = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// title.dm:11
rt.def("/datum/controller/subsystem/title/proc/PreInit", function PreInit(f: Frame) {
	let previous_path: Value = null, S: Value = null, L: Value = null;
	if (this.file_path && this.icon) {
		return f.dot;
	}
	if (fexists("data/previous_title.dat")) {
		if (istext((previous_path = file2text("data/previous_title.dat")))) {
			this.previous_icon = new_(T("/icon"), this.previous_icon);
		}
	}
	fdel("data/previous_title.dat");
	let provisional_title_screens: Value = flist("config/title_screens/images/");
	let title_screens: Value = list();
	let use_rare_screens: Value = prob(1);
	for (S of each(provisional_title_screens)) {
		if (rt.len(f, (L = splittext(S, "+"))) == 1 && rt.index(L, 1) != "blank.png" || rt.len(f, L) > 1 && (use_rare_screens && lowertext(rt.index(L, 1)) == "rare" || lowertext(rt.index(L, 1)) == lowertext(GLOB.SSmapping.config.map_name))) {
			title_screens += S;
		}
	}
	if (isemptylist(title_screens)) return f.dot;
	if (rt.length(title_screens) > 1) {
		S = null;
		for (S of each(title_screens)) {
			if (rt.len(f, (L = splittext(S, "."))) != 2 || rt.index(L, 1) != "default") {
				continue;
			}
			title_screens -= S;
			break;
		}
	}
	this.file_path = `config/title_screens/images/${pick(title_screens)}`;
	this.icon = new_(T("/icon"), fcopy_rsc(this.file_path));
	if (!this.splash_turf) return f.dot;
	this.splash_turf.icon = this.icon;
	return f.dot;
});

// title.dm:46
rt.def("/datum/controller/subsystem/title/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	if (var_name === "icon") {
		if (!this.splash_turf) return f.dot;
		this.splash_turf.icon = this.icon;
	}
	return f.dot;
}, false);

// title.dm:55
rt.def("/datum/controller/subsystem/title/proc/Shutdown", function* Shutdown(f: Frame) {
	let F: Value = null, thing: Value = null, S: Value = null;
	if (this.file_path) {
		F = file("data/previous_title.dat");
		rt.op(f, "Output", [], [F, this.file_path], false);
	}
	for (thing of each(GLOB.clients)) {
		if (!thing) {
			continue;
		}
		yield* (S = (yield* new_(T("/obj/screen/splash"), thing, 0))).Fade(0, 0);
	}
	return f.dot;
}, true);
