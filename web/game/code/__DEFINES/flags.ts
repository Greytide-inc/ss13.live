// From code/__DEFINES/flags.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalbitflags  (code/__DEFINES/flags.dm:7)
rt.def("/datum/controller/global_vars/proc/InitGlobalbitflags", function InitGlobalbitflags(f: Frame) {
	rt.setGl("bitflags", rt.list(1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768));
	rt.modSrcVar(f, "gvars_datum_init_order", "bitflags", add);
	return f.dot;
});
