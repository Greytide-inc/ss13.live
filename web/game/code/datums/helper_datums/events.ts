// Based on /tg/station's code/datums/helper_datums/events.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1045, "/datum/events", "/datum", {
	events: null,
});

// events.dm:10
rt.def("/datum/events/proc/New", function New(f: Frame) {
	parent_proc();
	this.events = new_(T("/list"));
	return f.dot;
});

// events.dm:14
rt.def("/datum/events/proc/Destroy", function* Destroy(f: Frame) {
	let elist: Value = null, e: Value = null;
	for (elist of each(this.events)) {
		e = null;
		for (e of each(rt.index(this.events, elist))) {
			yield* qdel(e);
		}
	}
	this.events = null;
	return (yield* parent_proc());
}, true);

// events.dm:21
rt.def("/datum/events/proc/addEventType", function addEventType(f: Frame, event_type: Value) {
	if (!rt.isIn(f, event_type, this.events) || !rt.istype(rt.index(this.events, event_type), T("/list"))) {
		rt.setAt(this.events, event_type, list());
		return 1;
	}
	return 0;
});

// events.dm:29
rt.def("/datum/events/proc/addEvent", function addEvent(f: Frame, event_type: Value, cb: Value) {
	if (!event_type || !cb) {
		return f.dot;
	}
	this.addEventType(event_type);
	let event: Value = rt.index(this.events, event_type);
	event += cb;
	return cb;
});

// events.dm:39
rt.def("/datum/events/proc/fireEvent", function fireEvent(f: Frame) {
	let event: Value = null, E: Value = null, cb: Value = null;
	if (!rt.istype((event = listgetindex(this.events, f.args[0])), T("/list"))) return f.dot;
	for (E of each(event)) {
		rt.callName(f, (cb = E), "InvokeAsync", [f.argsList.Copy(2)], rt.Args.List);
	}
	return f.dot;
}, false, { args: ["eventName"] });

// events.dm:49
rt.def("/datum/events/proc/clearEvent", function* clearEvent(f: Frame, event_type: Value, cb: Value) {
	if (!event_type || !cb) {
		return 0;
	}
	let event: Value = listgetindex(this.events, event_type);
	event -= cb;
	yield* qdel(cb);
	return 1;
}, true);
