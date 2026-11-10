// Based on /tg/station's code/__DEFINES/misc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// misc.dm:199
rt.def("/datum/controller/global_vars/proc/InitGlobalbloody_footprints_cache", function InitGlobalbloody_footprints_cache(f: Frame) {
	GLOB.bloody_footprints_cache = list();
	this.gvars_datum_init_order += "bloody_footprints_cache";
	return f.dot;
});

// misc.dm:272
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_accs_options", function InitGlobalghost_accs_options(f: Frame) {
	GLOB.ghost_accs_options = list(1, 50, 100);
	this.gvars_datum_init_order += "ghost_accs_options";
	return f.dot;
});

// misc.dm:288
rt.def("/datum/controller/global_vars/proc/InitGlobalghost_others_options", function InitGlobalghost_others_options(f: Frame) {
	GLOB.ghost_others_options = list(1, 50, 100);
	this.gvars_datum_init_order += "ghost_others_options";
	return f.dot;
});
