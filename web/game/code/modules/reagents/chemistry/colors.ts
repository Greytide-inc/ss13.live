// From code/modules/reagents/chemistry/colors.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/mix_color_from_reagents  (code/modules/reagents/chemistry/colors.dm:2)
rt.def("/proc/mix_color_from_reagents", function mix_color_from_reagents(f: Frame, reagent_list: Value) {
	let mixcolor: Value = null, vol_counter: Value = null, vol_temp: Value = null, R: Value = null;
	let $e: any;
	f.vars = () => [mixcolor, vol_counter, vol_temp, R, $e];
	if (!truthy((rt.istype(live(reagent_list), T("/list")) ? 1 : 0))) {
		return live(f.dot);
	}
	mixcolor = null;
	vol_counter = 0;
	vol_temp = null;
	R = null;
	rt.forList(f, 0, live(reagent_list), T("/datum/reagent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		R = $e;
		vol_counter = rt.modify(live(vol_counter), (vol_temp = rt.fv(f, "volume", live(R))), add);
		if (!truthy(live(mixcolor))) {
			mixcolor = rt.fv(f, "color", live(R));
		} else {
			if (rt.ge(rt.length(live(mixcolor)), rt.length(rt.fv(f, "color", live(R))))) {
				mixcolor = rt.call(f, P("/proc/BlendRGB"), null, [live(mixcolor), rt.fv(f, "color", live(R)), divide(live(vol_temp), live(vol_counter))]);
			} else {
				mixcolor = rt.call(f, P("/proc/BlendRGB"), null, [rt.fv(f, "color", live(R)), live(mixcolor), divide(live(vol_temp), live(vol_counter))]);
			}
		}
	}
	rt.endFor(f, 0);
	return live(mixcolor);
});
