// Based on /tg/station's code/__DEFINES/flags.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// flags.dm:7
rt.def("/datum/controller/global_vars/proc/InitGlobalbitflags", function InitGlobalbitflags(f: Frame) {
	GLOB.bitflags = list(1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768);
	this.gvars_datum_init_order += "bitflags";
	return f.dot;
});
