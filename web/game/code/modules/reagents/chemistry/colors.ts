// Based on /tg/station's code/modules/reagents/chemistry/colors.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// colors.dm:2
rt.def("/proc/mix_color_from_reagents", function mix_color_from_reagents(f: Frame, reagent_list: Value) {
	let mixcolor: Value = null, vol_temp: Value = null, R: Value = null;
	if (!rt.istype(reagent_list, T("/list"))) {
		return f.dot;
	}
	let vol_counter: Value = 0;
	for (R of each(reagent_list, T("/datum/reagent"))) {
		vol_counter += (vol_temp = R.volume);
		if (!mixcolor) {
			mixcolor = R.color;
		} else if (rt.length(mixcolor) >= rt.length(R.color)) {
			mixcolor = BlendRGB(mixcolor, R.color, vol_temp / vol_counter);
		} else {
			mixcolor = BlendRGB(R.color, mixcolor, vol_temp / vol_counter);
		}
	}
	return mixcolor;
});
