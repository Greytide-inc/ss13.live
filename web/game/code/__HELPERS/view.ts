// Based on /tg/station's code/__HELPERS/view.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



// view.dm:5
rt.def("/proc/getviewsize", function getviewsize(f: Frame, view: Value) {
	let viewX: Value = null, viewY: Value = null, totalviewrange: Value = null, viewrangelist: Value = null;
	if (isnum(view)) {
		viewX = (totalviewrange = 1 + 2 * view);
		viewY = totalviewrange;
	} else {
		viewX = text2num(rt.index((viewrangelist = splittext(view, "x")), 1));
		viewY = text2num(rt.index(viewrangelist, 2));
	}
	return list(viewX, viewY);
});
