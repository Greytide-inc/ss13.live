// Based on /tg/station's code/__HELPERS/cmp.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";

// cmp.dm:5
rt.def("/proc/cmp_numeric_asc", function cmp_numeric_asc(f: Frame, a: Value, b: Value) {
	return a - b;
});

// cmp.dm:8
rt.def("/proc/cmp_text_asc", function cmp_text_asc(f: Frame, a: Value, b: Value) {
	return sorttext(b, a);
});

// cmp.dm:11
rt.def("/proc/cmp_text_dsc", function cmp_text_dsc(f: Frame, a: Value, b: Value) {
	return sorttext(a, b);
});

// cmp.dm:14
rt.def("/proc/cmp_name_asc", function cmp_name_asc(f: Frame, a: Value, b: Value) {
	return sorttext(b.name, a.name);
}, false, { argTypes: [{ path: "/atom" }, { path: "/atom" }] });

// cmp.dm:17
rt.def("/proc/cmp_name_dsc", function cmp_name_dsc(f: Frame, a: Value, b: Value) {
	return sorttext(a.name, b.name);
}, false, { argTypes: [{ path: "/atom" }, { path: "/atom" }] });

// cmp.dm:19
rt.def("/datum/controller/global_vars/proc/InitGlobalcmp_field", function InitGlobalcmp_field(f: Frame) {
	GLOB.cmp_field = "name";
	this.gvars_datum_init_order += "cmp_field";
	return f.dot;
});

// cmp.dm:21
rt.def("/proc/cmp_records_asc", function cmp_records_asc(f: Frame, a: Value, b: Value) {
	return sorttext(rt.index(b.fields, GLOB.cmp_field), rt.index(a.fields, GLOB.cmp_field));
}, false, { argTypes: [{ path: "/datum/data/record" }, { path: "/datum/data/record" }] });

// cmp.dm:24
rt.def("/proc/cmp_records_dsc", function cmp_records_dsc(f: Frame, a: Value, b: Value) {
	return sorttext(rt.index(a.fields, GLOB.cmp_field), rt.index(b.fields, GLOB.cmp_field));
}, false, { argTypes: [{ path: "/datum/data/record" }, { path: "/datum/data/record" }] });

// cmp.dm:27
rt.def("/proc/cmp_ckey_asc", function cmp_ckey_asc(f: Frame, a: Value, b: Value) {
	return sorttext(b.ckey, a.ckey);
}, false, { argTypes: [{ path: "/client" }, { path: "/client" }] });

// cmp.dm:30
rt.def("/proc/cmp_ckey_dsc", function cmp_ckey_dsc(f: Frame, a: Value, b: Value) {
	return sorttext(a.ckey, b.ckey);
}, false, { argTypes: [{ path: "/client" }, { path: "/client" }] });

// cmp.dm:33
rt.def("/proc/cmp_subsystem_init", function cmp_subsystem_init(f: Frame, a: Value, b: Value) {
	return b.init_order - a.init_order;
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// cmp.dm:36
rt.def("/proc/cmp_subsystem_display", function cmp_subsystem_display(f: Frame, a: Value, b: Value) {
	return sorttext(b.name, a.name);
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// cmp.dm:39
rt.def("/proc/cmp_subsystem_priority", function cmp_subsystem_priority(f: Frame, a: Value, b: Value) {
	return a.priority - b.priority;
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// cmp.dm:42
rt.def("/proc/cmp_timer", function cmp_timer(f: Frame, a: Value, b: Value) {
	return a.timeToRun - b.timeToRun;
}, false, { argTypes: [{ path: "/datum/timedevent" }, { path: "/datum/timedevent" }] });

// cmp.dm:45
rt.def("/proc/cmp_clientcolour_priority", function cmp_clientcolour_priority(f: Frame, A: Value, B: Value) {
	return B.priority - A.priority;
}, false, { argTypes: [{ path: "/datum/client_colour" }, { path: "/datum/client_colour" }] });

// cmp.dm:48
rt.def("/proc/cmp_clockscripture_priority", function cmp_clockscripture_priority(f: Frame, A: Value, B: Value) {
	return rt.initial(f, A, "sort_priority") - rt.initial(f, B, "sort_priority");
}, false, { argTypes: [{ path: "/datum/clockwork_scripture" }, { path: "/datum/clockwork_scripture" }] });
