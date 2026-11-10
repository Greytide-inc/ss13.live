// Based on /tg/station's code/datums/helper_datums/topic_input.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1050, "/datum/topic_input", "/datum", {
	href: null,
	href_list: null,
});

// topic_input.dm:6
rt.def("/datum/topic_input/proc/New", function New(f: Frame, thref: Value, thref_list: Value) {
	this.href = thref;
	this.href_list = thref_list.Copy();
	return f.dot;
});

// topic_input.dm:11
rt.def("/datum/topic_input/proc/get", function get(f: Frame, i: Value) {
	return listgetindex(this.href_list, i);
});

// topic_input.dm:14
rt.def("/datum/topic_input/proc/getAndLocate", function getAndLocate(f: Frame, i: Value) {
	let t: Value = null;
	if (t = rt.callSrc(f, "get", [i])) {
		t = rt.locateIn(f, t, rt.world());
	}
	if (istext(t)) {
		t = null;
	}
	return (t || null);
});

// topic_input.dm:22
rt.def("/datum/topic_input/proc/getNum", function getNum(f: Frame, i: Value) {
	let t: Value = null;
	if (t = rt.callSrc(f, "get", [i])) {
		t = text2num(t);
	}
	return isnum(t) ? t : null;
});

// topic_input.dm:28
rt.def("/datum/topic_input/proc/getObj", function getObj(f: Frame, i: Value) {
	let t: Value = null;
	return rt.istype((t = this.getAndLocate(i)), T("/obj")) ? t : null;
});

// topic_input.dm:32
rt.def("/datum/topic_input/proc/getMob", function getMob(f: Frame, i: Value) {
	let t: Value = null;
	return ismob((t = this.getAndLocate(i))) ? t : null;
});

// topic_input.dm:47
rt.def("/datum/topic_input/proc/getStr", function getStr(f: Frame, i: Value) {
	let t: Value = null;
	return istext((t = rt.callSrc(f, "get", [i]))) ? t : null;
});

// topic_input.dm:51
rt.def("/datum/topic_input/proc/getType", function getType(f: Frame, i: Value, type: Value) {
	let t: Value = null;
	return rt.op(f, "IsType", [], [(t = this.getAndLocate(i)), type]) ? t : null;
});
