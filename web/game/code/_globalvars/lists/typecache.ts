// Based on /tg/station's code/_globalvars/lists/typecache.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// typecache.dm:6
rt.def("/datum/controller/global_vars/proc/InitGlobaltypecache_mob", function InitGlobaltypecache_mob(f: Frame) {
	GLOB.typecache_mob = typecacheof(list(T("/mob")));
	this.gvars_datum_init_order += "typecache_mob";
	return f.dot;
});
