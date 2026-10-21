// From code/controllers/globals.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/New  (code/controllers/globals.dm:12)  may sleep
rt.def("/datum/controller/global_vars/proc/New", function* New(f: Frame) {
	let exclude_these: Value = null;
	f.vars = () => [exclude_these];
	if (truthy(rt.gl("GLOB"))) {
		yield* g.call(f, P("/proc/CRASH"), null, ["Multiple instances of global variable controller created"]);
	}
	rt.setGl("GLOB", live(f.src));
	rt.setSv(f, "gvars_datum_in_built_vars", add(rt.gv(f, "vars", (exclude_these = (yield* g.new_(f, T("/datum/controller"), [])))), rt.list("gvars_datum_protected_varlist", "gvars_datum_in_built_vars", "gvars_datum_init_order")));
	yield* g.call(f, P("/proc/qdel"), null, [live(exclude_these)]);
	yield* g.call(f, P("/proc/log_world"), null, [fmt("＀ global variables", [subtract(rt.len(f, rt.sv(f, "vars")), rt.len(f, rt.sv(f, "gvars_datum_in_built_vars")))])]);
	yield* g.srcCall(f, "Initialize");
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/Destroy  (code/controllers/globals.dm:24)  may sleep
rt.def("/datum/controller/global_vars/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/stack_trace"), null, ["Some fucker qdel'd the global holder!"]);
	if (!truthy(live(f.args[0]))) {
		return 1;
	}
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "statclick")]);
	rt.setSv(f, "statclick", null);
	yield* g.callName(f, rt.sv(f, "gvars_datum_protected_varlist"), "Cut", []);
	yield* g.callName(f, rt.sv(f, "gvars_datum_in_built_vars"), "Cut", []);
	rt.setGl("GLOB", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["force"] });

// /datum/controller/global_vars/proc/stat_entry  (code/controllers/globals.dm:37)  may sleep
rt.def("/datum/controller/global_vars/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!truthy(rt.sv(f, "statclick"))) {
		rt.setSv(f, "statclick", (yield* g.new_(f, T("/obj/effect/statclick/debug"), [null, "Initializing...", live(f.src)])));
	}
	yield* g.call(f, P("/proc/stat"), null, ["Globals:", (yield* g.callName(f, rt.sv(f, "statclick"), "update", ["Edit"]))]);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/can_vv_get  (code/controllers/globals.dm:43)
rt.def("/datum/controller/global_vars/proc/can_vv_get", function can_vv_get(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "gvars_datum_protected_varlist")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["var_name"] });

// /datum/controller/global_vars/proc/vv_edit_var  (code/controllers/globals.dm:48)
rt.def("/datum/controller/global_vars/proc/vv_edit_var", function vv_edit_var(f: Frame) {
	if (truthy((rt.isIn(f, live(f.args[0]), rt.sv(f, "gvars_datum_protected_varlist")) ? 1 : 0))) {
		return 0;
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["var_name", "var_value"] });

// /datum/controller/global_vars/proc/Initialize  (code/controllers/globals.dm:53)  may sleep
rt.def("/datum/controller/global_vars/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, CLEANBOT_RETURNS: Value = null, start_tick: Value = null, end_tick: Value = null;
	let $e: any;
	f.vars = () => [I, CLEANBOT_RETURNS, start_tick, end_tick, $e];
	rt.setSv(f, "gvars_datum_init_order", rt.list());
	rt.setSv(f, "gvars_datum_protected_varlist", rt.list("gvars_datum_protected_varlist"));
	I = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, ["/datum/controller/global_vars/proc"])));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		yield* g.call(f, P("/proc/pass"), null, [(CLEANBOT_RETURNS = fmt("＀", [live(I)]))]);
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, subtract(rt.sv(f, "vars"), rt.sv(f, "gvars_datum_in_built_vars")));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		start_tick = rt.worldTime(f);
		// tg_js: a global whose InitGlobalNAME proc was deleted (a dead global keeps its slot in _globals.ts) stays null.
		if (truthy(rt.call(f, P("/proc/hascall"), null, [live(f.src), fmt("InitGlobal＀", [live(I)])]))) yield* g.callDyn(f, live(f.src), fmt("InitGlobal＀", [live(I)]), []);
		if (truthy(subtract((end_tick = rt.worldTime(f)), live(start_tick)))) {
			yield* g.call(f, P("/proc/warning"), null, [fmt("Global ＀ slept during initialization!", [live(I)])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
