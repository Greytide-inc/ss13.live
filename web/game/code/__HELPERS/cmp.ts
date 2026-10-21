// From code/__HELPERS/cmp.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/cmp_numeric_dsc  (code/__HELPERS/cmp.dm:2)
rt.def("/proc/cmp_numeric_dsc", function cmp_numeric_dsc(f: Frame, a: Value, b: Value) {
	return subtract(live(b), live(a));
});

// /proc/cmp_numeric_asc  (code/__HELPERS/cmp.dm:5)
rt.def("/proc/cmp_numeric_asc", function cmp_numeric_asc(f: Frame, a: Value, b: Value) {
	return subtract(live(a), live(b));
});

// /proc/cmp_text_asc  (code/__HELPERS/cmp.dm:8)
rt.def("/proc/cmp_text_asc", function cmp_text_asc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [live(b), live(a)]);
});

// /proc/cmp_text_dsc  (code/__HELPERS/cmp.dm:11)
rt.def("/proc/cmp_text_dsc", function cmp_text_dsc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [live(a), live(b)]);
});

// /proc/cmp_name_asc  (code/__HELPERS/cmp.dm:14)
rt.def("/proc/cmp_name_asc", function cmp_name_asc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "name", live(b)), rt.fv(f, "name", live(a))]);
}, false, { argTypes: [{ path: "/atom" }, { path: "/atom" }] });

// /proc/cmp_name_dsc  (code/__HELPERS/cmp.dm:17)
rt.def("/proc/cmp_name_dsc", function cmp_name_dsc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "name", live(a)), rt.fv(f, "name", live(b))]);
}, false, { argTypes: [{ path: "/atom" }, { path: "/atom" }] });

// /datum/controller/global_vars/proc/InitGlobalcmp_field  (code/__HELPERS/cmp.dm:19)
rt.def("/datum/controller/global_vars/proc/InitGlobalcmp_field", function InitGlobalcmp_field(f: Frame) {
	rt.setGl("cmp_field", "name");
	rt.modSrcVar(f, "gvars_datum_init_order", "cmp_field", add);
	return f.dot;
});

// /proc/cmp_records_asc  (code/__HELPERS/cmp.dm:21)
rt.def("/proc/cmp_records_asc", function cmp_records_asc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.index(rt.fv(f, "fields", live(b)), rt.gl("cmp_field")), rt.index(rt.fv(f, "fields", live(a)), rt.gl("cmp_field"))]);
}, false, { argTypes: [{ path: "/datum/data/record" }, { path: "/datum/data/record" }] });

// /proc/cmp_records_dsc  (code/__HELPERS/cmp.dm:24)
rt.def("/proc/cmp_records_dsc", function cmp_records_dsc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.index(rt.fv(f, "fields", live(a)), rt.gl("cmp_field")), rt.index(rt.fv(f, "fields", live(b)), rt.gl("cmp_field"))]);
}, false, { argTypes: [{ path: "/datum/data/record" }, { path: "/datum/data/record" }] });

// /proc/cmp_ckey_asc  (code/__HELPERS/cmp.dm:27)
rt.def("/proc/cmp_ckey_asc", function cmp_ckey_asc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "ckey", live(b)), rt.fv(f, "ckey", live(a))]);
}, false, { argTypes: [{ path: "/client" }, { path: "/client" }] });

// /proc/cmp_ckey_dsc  (code/__HELPERS/cmp.dm:30)
rt.def("/proc/cmp_ckey_dsc", function cmp_ckey_dsc(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "ckey", live(a)), rt.fv(f, "ckey", live(b))]);
}, false, { argTypes: [{ path: "/client" }, { path: "/client" }] });

// /proc/cmp_subsystem_init  (code/__HELPERS/cmp.dm:33)
rt.def("/proc/cmp_subsystem_init", function cmp_subsystem_init(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "init_order", live(b)), rt.fv(f, "init_order", live(a)));
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// /proc/cmp_subsystem_display  (code/__HELPERS/cmp.dm:36)
rt.def("/proc/cmp_subsystem_display", function cmp_subsystem_display(f: Frame, a: Value, b: Value) {
	return rt.call(f, P("/proc/sorttext"), null, [rt.fv(f, "name", live(b)), rt.fv(f, "name", live(a))]);
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// /proc/cmp_subsystem_priority  (code/__HELPERS/cmp.dm:39)
rt.def("/proc/cmp_subsystem_priority", function cmp_subsystem_priority(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "priority", live(a)), rt.fv(f, "priority", live(b)));
}, false, { argTypes: [{ path: "/datum/controller/subsystem" }, { path: "/datum/controller/subsystem" }] });

// /proc/cmp_timer  (code/__HELPERS/cmp.dm:42)
rt.def("/proc/cmp_timer", function cmp_timer(f: Frame, a: Value, b: Value) {
	return subtract(rt.fv(f, "timeToRun", live(a)), rt.fv(f, "timeToRun", live(b)));
}, false, { argTypes: [{ path: "/datum/timedevent" }, { path: "/datum/timedevent" }] });

// /proc/cmp_clientcolour_priority  (code/__HELPERS/cmp.dm:45)
rt.def("/proc/cmp_clientcolour_priority", function cmp_clientcolour_priority(f: Frame, A: Value, B: Value) {
	return subtract(rt.fv(f, "priority", live(B)), rt.fv(f, "priority", live(A)));
}, false, { argTypes: [{ path: "/datum/client_colour" }, { path: "/datum/client_colour" }] });

// /proc/cmp_clockscripture_priority  (code/__HELPERS/cmp.dm:48)
rt.def("/proc/cmp_clockscripture_priority", function cmp_clockscripture_priority(f: Frame, A: Value, B: Value) {
	return subtract(rt.initial(f, live(A), "sort_priority"), rt.initial(f, live(B), "sort_priority"));
}, false, { argTypes: [{ path: "/datum/clockwork_scripture" }, { path: "/datum/clockwork_scripture" }] });
