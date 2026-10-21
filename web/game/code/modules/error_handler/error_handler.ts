// From code/modules/error_handler/error_handler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobaltotal_runtimes  (code/modules/error_handler/error_handler.dm:1)
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_runtimes", function InitGlobaltotal_runtimes(f: Frame) {
	rt.setGl("total_runtimes", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "total_runtimes", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaltotal_runtimes_skipped  (code/modules/error_handler/error_handler.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_runtimes_skipped", function InitGlobaltotal_runtimes_skipped(f: Frame) {
	rt.setGl("total_runtimes_skipped", 0);
	rt.modSrcVar(f, "gvars_datum_init_order", "total_runtimes_skipped", add);
	return f.dot;
});

// /world/proc/Error  built in (BYOND provides it)
rt.def("/world/proc/Error", undefined, false, { args: ["exception"] });

// /world/proc/Error  (code/modules/error_handler/error_handler.dm:6)
rt.def("/world/proc/Error", function Error(f: Frame) {
	let erroruid: Value = null, last_seen: Value = null, cooldown: Value = null, silencing: Value = null, configured_error_cooldown: Value = null, configured_error_limit: Value = null, configured_error_silence_time: Value = null, skipcount: Value = null, usrinfo: Value = null, locinfo: Value = null, splitlines: Value = null, desclines: Value = null, line: Value = null, split: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [erroruid, last_seen, cooldown, silencing, configured_error_cooldown, configured_error_limit, configured_error_silence_time, skipcount, usrinfo, locinfo, splitlines, desclines, line, split, i, $e];
	if (!truthy((rt.istype(live(f.args[0]), T("/exception")) ? 1 : 0))) {
		rt.call(f, P("/proc/log_world"), null, [fmt("[＀] Uncaught exception: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), live(f.args[0])])]);
		return rt.callSuper(f, [], rt.Args.Same);
	}
	if (!truthy(rt.gl("error_last_seen"))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	rt.incGl("total_runtimes", 1, true);
	erroruid = fmt("＀＀", [rt.fv(f, "file", live(f.args[0])), rt.fv(f, "line", live(f.args[0]))]);
	last_seen = rt.index(rt.gl("error_last_seen"), live(erroruid));
	cooldown = (rt.index(rt.gl("error_cooldown"), live(erroruid)) || 0);
	if (live(last_seen) === null) {
		rt.setAt(rt.gl("error_last_seen"), live(erroruid), rt.worldTime(f));
		last_seen = rt.worldTime(f);
	}
	if (rt.lt(live(cooldown), 0)) {
		rt.incAt(rt.gl("error_cooldown"), live(erroruid), -1, true);
		rt.incGl("total_runtimes_skipped", 1, true);
		return live(f.dot);
	}
	silencing = 0;
	configured_error_cooldown = rt.initial(f, rt.gl("config"), "error_cooldown");
	configured_error_limit = rt.initial(f, rt.gl("config"), "error_limit");
	configured_error_silence_time = rt.initial(f, rt.gl("config"), "error_silence_time");
	if (truthy(rt.gl("config"))) {
		configured_error_cooldown = rt.fv(f, "error_cooldown", rt.gl("config"));
		configured_error_limit = rt.fv(f, "error_limit", rt.gl("config"));
		configured_error_silence_time = rt.fv(f, "error_silence_time", rt.gl("config"));
	}
	if (rt.gt((cooldown = add(rt.call(f, P("/proc/max"), null, [0, subtract(live(cooldown), subtract(rt.worldTime(f), live(last_seen)))]), live(configured_error_cooldown))), multiply(live(configured_error_cooldown), live(configured_error_limit)))) {
		cooldown = -1;
		silencing = 1;
		rt.spawnTail(f, 0, "/world/proc/Error: spawn at modules/error_handler/error_handler.dm:52", erroruid, last_seen, cooldown, silencing, configured_error_cooldown, configured_error_limit, configured_error_silence_time, skipcount, usrinfo, locinfo, splitlines, desclines, line, split, i);
	}
	rt.setAt(rt.gl("error_last_seen"), live(erroruid), rt.worldTime(f));
	rt.setAt(rt.gl("error_cooldown"), live(erroruid), live(cooldown));
	usrinfo = null;
	locinfo = null;
	if (truthy((rt.istype(live(f.usr), T("/mob")) ? 1 : 0))) {
		usrinfo = rt.list(fmt("  usr: ＀", [rt.call(f, P("/proc/datum_info_line"), null, [live(f.usr)])]));
		if (truthy((locinfo = rt.call(f, P("/proc/atom_loc_line"), null, [live(f.usr)])))) {
			usrinfo = rt.modify(live(usrinfo), fmt("  usr.loc: ＀", [live(locinfo)]), add);
		}
	}
	splitlines = rt.call(f, P("/proc/splittext"), null, [rt.fv(f, "desc", live(f.args[0])), "\n"]);
	desclines = rt.list();
	if (rt.gt(rt.length(live(splitlines)), 2)) {
		line = null;
		rt.forList(f, 0, live(splitlines));
		while (($e = rt.next(f, 0)) !== undefined) {
			line = $e;
			if (((rt.lt(rt.length(live(line)), 3) || truthy(rt.call(f, P("/proc/findtext"), null, [live(line), "source file:"]))) || truthy(rt.call(f, P("/proc/findtext"), null, [live(line), "usr.loc:"])))) {
				continue;
			}
			if (truthy(rt.call(f, P("/proc/findtext"), null, [live(line), "usr:"]))) {
				if (truthy(live(usrinfo))) {
					rt.callName(f, live(desclines), "Add", [live(usrinfo)]);
					usrinfo = null;
				}
				continue;
			}
			if (!isEqual(rt.call(f, P("/proc/copytext"), null, [live(line), 1, 3]), "  ")) {
				desclines = rt.modify(live(desclines), add("  ", live(line)), add);
			} else {
				desclines = rt.modify(live(desclines), live(line), add);
			}
		}
		rt.endFor(f, 0);
	}
	if (truthy(live(usrinfo))) {
		rt.callName(f, live(desclines), "Add", [live(usrinfo)]);
	}
	if (truthy(live(silencing))) {
		desclines = rt.modify(live(desclines), fmt("  (This error will now be silenced for ＀ minutes)", [divide(live(configured_error_silence_time), 600)]), add);
	}
	if (truthy(rt.gl("error_cache"))) {
		rt.callName(f, rt.gl("error_cache"), "log_error", [live(f.args[0]), live(desclines)]);
	}
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), fmt("[＀] Runtime in ＀,＀: ＀", [rt.call(f, P("/proc/time_stamp"), null, []), rt.fv(f, "file", live(f.args[0])), rt.fv(f, "line", live(f.args[0])), live(f.args[0])])], false);
	line = null;
	rt.forList(f, 0, live(desclines));
	while (($e = rt.next(f, 0)) !== undefined) {
		line = $e;
		rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), live(line)], false);
	}
	rt.endFor(f, 0);
	rt.setFv(f, "name", live(f.args[0]), fmt("\n[＀]＀", [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "hh:mm:ss"]), rt.fv(f, "name", live(f.args[0]))]));
	split = rt.call(f, P("/proc/splittext"), null, [rt.fv(f, "desc", live(f.args[0])), "\n"]);
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(split)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!isEqual(rt.index(live(split), live(i)), "")) {
			rt.setAt(live(split), live(i), fmt("[＀]＀", [rt.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "hh:mm:ss"]), rt.index(live(split), live(i))]));
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "desc", live(f.args[0]), rt.call(f, P("/proc/jointext"), null, [live(split), "\n"]));
	rt.setFv(f, "log", rt.world(), rt.gl("world_runtime_log"));
	rt.callSuper(f, [live(f.args[0])]);
	rt.setFv(f, "log", rt.world(), null);
	return f.dot;
}, false, { args: ["E", "e_src"] });

// a spawn(0) body of /world/proc/Error, a named tail so a world snapshot can hold it while it waits.
rt.tail("/world/proc/Error: spawn at modules/error_handler/error_handler.dm:52", function* (f: Frame, erroruid: Value, last_seen: Value, cooldown: Value, silencing: Value, configured_error_cooldown: Value, configured_error_limit: Value, configured_error_silence_time: Value, skipcount: Value, usrinfo: Value, locinfo: Value, splitlines: Value, desclines: Value, line: Value, split: Value, i: Value) {
	f.vars = () => [erroruid, last_seen, cooldown, silencing, configured_error_cooldown, configured_error_limit, configured_error_silence_time, skipcount, usrinfo, locinfo, splitlines, desclines, line, split, i];
	f.usr = null;
	yield* g.call(f, P("/proc/sleep"), null, [live(configured_error_silence_time)]);
	skipcount = subtract(rt.op(f, "Abs", [], [rt.index(rt.gl("error_cooldown"), live(erroruid))]), 1);
	rt.setAt(rt.gl("error_cooldown"), live(erroruid), 0);
	if (rt.gt(live(skipcount), 0)) {
		rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), fmt("[＀] Skipped ＀ runtimes in ＀,＀.", [(yield* g.call(f, P("/proc/time_stamp"), null, [])), live(skipcount), rt.fv(f, "file", live(f.args[0])), rt.fv(f, "line", live(f.args[0]))])], false);
		yield* g.callName(f, rt.gl("error_cache"), "log_error", [null, live(f.args[0]), "skip_count", live(skipcount)], rt.Args.Named);
	}
	return null;
});
