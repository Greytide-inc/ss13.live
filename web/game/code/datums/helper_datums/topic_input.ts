// From code/datums/helper_datums/topic_input.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1050, "/datum/topic_input", "/datum", {
	href: null,
	href_list: null,
});

// /datum/topic_input/proc/New  (code/datums/helper_datums/topic_input.dm:6)
rt.def("/datum/topic_input/proc/New", function New(f: Frame, thref: Value, thref_list: Value) {
	rt.setSv(f, "href", live(thref));
	rt.setSv(f, "href_list", rt.callName(f, live(thref_list), "Copy", []));
	return live(f.dot);
});

// /datum/topic_input/proc/get  (code/datums/helper_datums/topic_input.dm:11)
rt.def("/datum/topic_input/proc/get", function get(f: Frame, i: Value) {
	return rt.call(f, P("/proc/listgetindex"), null, [rt.sv(f, "href_list"), live(i)]);
});

// /datum/topic_input/proc/getAndLocate  (code/datums/helper_datums/topic_input.dm:14)
rt.def("/datum/topic_input/proc/getAndLocate", function getAndLocate(f: Frame, i: Value) {
	let t: Value = null;
	f.vars = () => [t];
	if (truthy((t = rt.callSrc(f, "get", [live(i)])))) {
		t = rt.locateIn(f, live(t), rt.world());
	}
	if (truthy(rt.call(f, P("/proc/istext"), null, [live(t)]))) {
		t = null;
	}
	return (live(t) || null);
});

// /datum/topic_input/proc/getNum  (code/datums/helper_datums/topic_input.dm:22)
rt.def("/datum/topic_input/proc/getNum", function getNum(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy((t = rt.callSrc(f, "get", [live(i)])))) {
		t = rt.call(f, P("/proc/text2num"), null, [live(t)]);
	}
	if (truthy(rt.call(f, P("/proc/isnum"), null, [live(t)]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getObj  (code/datums/helper_datums/topic_input.dm:28)
rt.def("/datum/topic_input/proc/getObj", function getObj(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy((rt.istype((t = rt.callSrc(f, "getAndLocate", [live(i)])), T("/obj")) ? 1 : 0))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getMob  (code/datums/helper_datums/topic_input.dm:32)
rt.def("/datum/topic_input/proc/getMob", function getMob(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy(rt.call(f, P("/proc/ismob"), null, [(t = rt.callSrc(f, "getAndLocate", [live(i)]))]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getTurf  (code/datums/helper_datums/topic_input.dm:36)
rt.def("/datum/topic_input/proc/getTurf", function getTurf(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy(rt.call(f, P("/proc/isturf"), null, [(t = rt.callSrc(f, "getAndLocate", [live(i)]))]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getAtom  (code/datums/helper_datums/topic_input.dm:40)
rt.def("/datum/topic_input/proc/getAtom", function getAtom(f: Frame, i: Value) {
	return rt.callSrc(f, "getType", [live(i), T("/atom")]);
});

// /datum/topic_input/proc/getArea  (code/datums/helper_datums/topic_input.dm:43)
rt.def("/datum/topic_input/proc/getArea", function getArea(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy(rt.call(f, P("/proc/isarea"), null, [(t = rt.callSrc(f, "getAndLocate", [live(i)]))]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getStr  (code/datums/helper_datums/topic_input.dm:47)
rt.def("/datum/topic_input/proc/getStr", function getStr(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy(rt.call(f, P("/proc/istext"), null, [(t = rt.callSrc(f, "get", [live(i)]))]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getType  (code/datums/helper_datums/topic_input.dm:51)
rt.def("/datum/topic_input/proc/getType", function getType(f: Frame, i: Value, type: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy(rt.op(f, "IsType", [], [(t = rt.callSrc(f, "getAndLocate", [live(i)])), live(type)]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getPath  (code/datums/helper_datums/topic_input.dm:55)
rt.def("/datum/topic_input/proc/getPath", function getPath(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy((t = rt.callSrc(f, "get", [live(i)])))) {
		t = rt.call(f, P("/proc/text2path"), null, [live(t)]);
	}
	if (truthy(rt.call(f, P("/proc/ispath"), null, [live(t)]))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});

// /datum/topic_input/proc/getList  (code/datums/helper_datums/topic_input.dm:61)
rt.def("/datum/topic_input/proc/getList", function getList(f: Frame, i: Value) {
	let t: Value = null;
	let $0: any;
	f.vars = () => [t, $0];
	if (truthy((rt.istype((t = rt.callSrc(f, "getAndLocate", [live(i)])), T("/list")) ? 1 : 0))) {
		$0 = live(t);
	} else {
		$0 = null;
	}
	return $0;
});
