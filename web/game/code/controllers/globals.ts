// Based on /tg/station's code/controllers/globals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// globals.dm:12
rt.def("/datum/controller/global_vars/proc/New", function* New(f: Frame) {
	let exclude_these: Value = null;
	if (GLOB.GLOB) {
		CRASH("Multiple instances of global variable controller created");
	}
	GLOB.GLOB = this;
	this.gvars_datum_in_built_vars = (exclude_these = (yield* new_(T("/datum/controller")))).vars + list("gvars_datum_protected_varlist", "gvars_datum_in_built_vars", "gvars_datum_init_order");
	yield* qdel(exclude_these);
	log_world(`${rt.len(f, this.vars) - rt.len(f, this.gvars_datum_in_built_vars)} global variables`);
	yield* this.Initialize();
	return f.dot;
}, true);

// globals.dm:24
rt.def("/datum/controller/global_vars/proc/Destroy", function* Destroy(f: Frame, force: Value) {
	stack_trace("Some fucker qdel'd the global holder!");
	if (!force) {
		return QDEL_HINT_LETMELIVE;
	}
	yield* qdel(this.statclick);
	this.statclick = null;
	this.gvars_datum_protected_varlist.Cut();
	this.gvars_datum_in_built_vars.Cut();
	GLOB.GLOB = null;
	return (yield* parent_proc());
}, true);

// globals.dm:37
rt.def("/datum/controller/global_vars/proc/stat_entry", function* stat_entry(f: Frame) {
	if (!this.statclick) {
		this.statclick = (yield* new_(T("/obj/effect/statclick/debug"), null, "Initializing...", this));
	}
	stat("Globals:", (yield* this.statclick.update("Edit")));
	return f.dot;
}, true);

// globals.dm:43
rt.def("/datum/controller/global_vars/proc/can_vv_get", function can_vv_get(f: Frame, var_name: Value) {
	if (rt.isIn(f, var_name, this.gvars_datum_protected_varlist)) {
		return 0;
	}
	return parent_proc();
}, false);

// globals.dm:48
rt.def("/datum/controller/global_vars/proc/vv_edit_var", function vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (rt.isIn(f, var_name, this.gvars_datum_protected_varlist)) {
		return 0;
	}
	return parent_proc();
}, false);

// globals.dm:53
rt.def("/datum/controller/global_vars/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, CLEANBOT_RETURNS: Value = null, start_tick: Value = null, end_tick: Value = null;
	this.gvars_datum_init_order = list();
	this.gvars_datum_protected_varlist = list("gvars_datum_protected_varlist");
	for (I of each(typesof("/datum/controller/global_vars/proc"))) {
		pass((CLEANBOT_RETURNS = `${I}`));
	}
	I = null;
	for (I of each(this.vars - this.gvars_datum_in_built_vars)) {
		start_tick = rt.worldTime(f);
		// tg_js: a global whose InitGlobalNAME proc was deleted (a dead global keeps its slot in _globals.ts) stays null.
		if (rt.call(f, P("/proc/hascall"), null, [this, `InitGlobal${I}`])) yield* g.callDyn(f, this, `InitGlobal${I}`, []);
		if ((end_tick = rt.worldTime(f)) - start_tick) {
			warning(`Global ${I} slept during initialization!`);
		}
	}
	return f.dot;
}, true);
