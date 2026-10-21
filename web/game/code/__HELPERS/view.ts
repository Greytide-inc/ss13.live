// From code/__HELPERS/view.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/getviewsize  (code/__HELPERS/view.dm:5)
rt.def("/proc/getviewsize", function getviewsize(f: Frame, view: Value) {
	let viewX: Value = null, viewY: Value = null, totalviewrange: Value = null, viewrangelist: Value = null;
	f.vars = () => [viewX, viewY, totalviewrange, viewrangelist];
	viewX = null;
	viewY = null;
	if (truthy(rt.call(f, P("/proc/isnum"), null, [live(view)]))) {
		viewX = (totalviewrange = add(1, multiply(2, live(view))));
		viewY = live(totalviewrange);
	} else {
		viewX = rt.call(f, P("/proc/text2num"), null, [rt.index((viewrangelist = rt.call(f, P("/proc/splittext"), null, [live(view), "x"])), 1)]);
		viewY = rt.call(f, P("/proc/text2num"), null, [rt.index(live(viewrangelist), 2)]);
	}
	return rt.list(live(viewX), live(viewY));
});
