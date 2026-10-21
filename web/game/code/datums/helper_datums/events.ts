// From code/datums/helper_datums/events.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(1045, "/datum/events", "/datum", {
	events: null,
});

// /datum/events/proc/New  (code/datums/helper_datums/events.dm:10)
rt.def("/datum/events/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "events", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/events/proc/Destroy  (code/datums/helper_datums/events.dm:14)  may sleep
rt.def("/datum/events/proc/Destroy", function* Destroy(f: Frame) {
	let elist: Value = null, e: Value = null;
	let $e: any;
	f.vars = () => [elist, e, $e];
	elist = null;
	rt.forList(f, 0, rt.sv(f, "events"));
	while (($e = rt.next(f, 0)) !== undefined) {
		elist = $e;
		e = null;
		rt.forList(f, 1, rt.index(rt.sv(f, "events"), live(elist)));
		while (($e = rt.next(f, 1)) !== undefined) {
			e = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(e)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "events", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /datum/events/proc/addEventType  (code/datums/helper_datums/events.dm:21)
rt.def("/datum/events/proc/addEventType", function addEventType(f: Frame, event_type: Value) {
	if ((!truthy((rt.isIn(f, live(event_type), rt.sv(f, "events")) ? 1 : 0)) || !truthy((rt.istype(rt.index(rt.sv(f, "events"), live(event_type)), T("/list")) ? 1 : 0)))) {
		rt.setAt(rt.sv(f, "events"), live(event_type), rt.list());
		return 1;
	}
	return 0;
});

// /datum/events/proc/addEvent  (code/datums/helper_datums/events.dm:29)
rt.def("/datum/events/proc/addEvent", function addEvent(f: Frame, event_type: Value, cb: Value) {
	let event: Value = null;
	f.vars = () => [event];
	if ((!truthy(live(event_type)) || !truthy(live(cb)))) {
		return live(f.dot);
	}
	rt.callSrc(f, "addEventType", [live(event_type)]);
	event = rt.index(rt.sv(f, "events"), live(event_type));
	event = rt.modify(live(event), live(cb), add);
	return live(cb);
});

// /datum/events/proc/fireEvent  (code/datums/helper_datums/events.dm:39)
rt.def("/datum/events/proc/fireEvent", function fireEvent(f: Frame) {
	let event: Value = null, E: Value = null, cb: Value = null;
	let $e: any;
	f.vars = () => [event, E, cb, $e];
	if (!truthy((rt.istype((event = rt.call(f, P("/proc/listgetindex"), null, [rt.sv(f, "events"), live(f.args[0])])), T("/list")) ? 1 : 0))) return f.dot;
	E = null;
	rt.forList(f, 0, live(event));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		rt.callName(f, (cb = live(E)), "InvokeAsync", [rt.callName(f, f.argsList, "Copy", [2])], rt.Args.List);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["eventName"] });

// /datum/events/proc/clearEvent  (code/datums/helper_datums/events.dm:49)  may sleep
rt.def("/datum/events/proc/clearEvent", function* clearEvent(f: Frame, event_type: Value, cb: Value) {
	let event: Value = null;
	f.vars = () => [event_type, cb, event];
	if ((!truthy(live(event_type)) || !truthy(live(cb)))) {
		return 0;
	}
	event = (yield* g.call(f, P("/proc/listgetindex"), null, [rt.sv(f, "events"), live(event_type)]));
	(event = rt.modify(live(event), live(cb), subtract));
	yield* g.call(f, P("/proc/qdel"), null, [live(cb)]);
	return 1;
}, true);
