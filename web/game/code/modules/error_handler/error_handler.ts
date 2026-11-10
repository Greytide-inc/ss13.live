// Based on /tg/station's code/modules/error_handler/error_handler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// error_handler.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_runtimes", function InitGlobaltotal_runtimes(f: Frame) {
	GLOB.total_runtimes = 0;
	this.gvars_datum_init_order += "total_runtimes";
	return f.dot;
});

// error_handler.dm:2
rt.def("/datum/controller/global_vars/proc/InitGlobaltotal_runtimes_skipped", function InitGlobaltotal_runtimes_skipped(f: Frame) {
	GLOB.total_runtimes_skipped = 0;
	this.gvars_datum_init_order += "total_runtimes_skipped";
	return f.dot;
});

// BYOND built-in.
rt.def("/world/proc/Error", undefined, false, { args: ["exception"] });

// error_handler.dm:6
rt.def("/world/proc/Error", function Error(f: Frame, E: Value, e_src: Value) {
	let skipcount: Value = null, usrinfo: Value = null, locinfo: Value = null, splitlines: Value = null, desclines: Value = null, line: Value = null, split: Value = null, i: Value = null;
	let $e: any;
	if (!rt.istype(E, T("/exception"))) {
		log_world(`[${time_stamp()}] Uncaught exception: ${E}`);
		return parent_proc();
	}
	if (!GLOB.error_last_seen) {
		return parent_proc();
	}
	GLOB.total_runtimes++;
	let erroruid: Value = `${E.file}${E.line}`;
	let last_seen: Value = rt.index(GLOB.error_last_seen, erroruid);
	let cooldown: Value = (rt.index(GLOB.error_cooldown, erroruid) || 0);
	if (last_seen === null) {
		rt.setAt(GLOB.error_last_seen, erroruid, rt.worldTime(f));
		last_seen = rt.worldTime(f);
	}
	if (cooldown < 0) {
		rt.incAt(GLOB.error_cooldown, erroruid, -1, true);
		GLOB.total_runtimes_skipped++;
		return f.dot;
	}
	let silencing: Value = 0;
	let configured_error_cooldown: Value = rt.initial(f, GLOB.config, "error_cooldown");
	let configured_error_limit: Value = rt.initial(f, GLOB.config, "error_limit");
	let configured_error_silence_time: Value = rt.initial(f, GLOB.config, "error_silence_time");
	if (GLOB.config) {
		configured_error_cooldown = GLOB.config.error_cooldown;
		configured_error_limit = GLOB.config.error_limit;
		configured_error_silence_time = GLOB.config.error_silence_time;
	}
	if ((cooldown = max(0, cooldown - (rt.worldTime(f) - last_seen)) + configured_error_cooldown) > configured_error_cooldown * configured_error_limit) {
		cooldown = -1;
		silencing = 1;
		rt.spawnTail(f, 0, "/world/proc/Error: spawn at modules/error_handler/error_handler.dm:52", erroruid, last_seen, cooldown, silencing, configured_error_cooldown, configured_error_limit, configured_error_silence_time, skipcount, usrinfo, locinfo, splitlines, desclines, line, split, i);
	}
	rt.setAt(GLOB.error_last_seen, erroruid, rt.worldTime(f));
	rt.setAt(GLOB.error_cooldown, erroruid, cooldown);
	if (rt.istype(f.usr, T("/mob"))) {
		usrinfo = list(`  usr: ${datum_info_line(f.usr)}`);
		if (locinfo = atom_loc_line(f.usr)) {
			usrinfo += `  usr.loc: ${locinfo}`;
		}
	}
	splitlines = splittext(E.desc, "\n");
	desclines = list();
	if (rt.length(splitlines) > 2) {
		for (line of each(splitlines)) {
			if (rt.length(line) < 3 || findtext(line, "source file:") || findtext(line, "usr.loc:")) {
				continue;
			}
			if (findtext(line, "usr:")) {
				if (usrinfo) {
					desclines.Add(usrinfo);
					usrinfo = null;
				}
				continue;
			}
			if (copytext(line, 1, 3) != "  ") {
				desclines += "  " + line;
			} else {
				desclines += line;
			}
		}
	}
	if (usrinfo) {
		desclines.Add(usrinfo);
	}
	if (silencing) {
		desclines += `  (This error will now be silenced for ${configured_error_silence_time / 600} minutes)`;
	}
	if (GLOB.error_cache) {
		GLOB.error_cache.log_error(E, desclines);
	}
	rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), `[${time_stamp()}] Runtime in ${E.file},${E.line}: ${E}`], false);
	line = null;
	for (line of each(desclines)) {
		rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), line], false);
	}
	E.name = `\n[${time2text(rt.world().timeofday, "hh:mm:ss")}]${E.name}`;
	split = splittext(E.desc, "\n");
	rt.forRange(f, 0, 1, rt.len(f, split), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (rt.index(split, i) != "") {
			rt.setAt(split, i, `[${time2text(rt.world().timeofday, "hh:mm:ss")}]${rt.index(split, i)}`);
		}
	}
	rt.endFor(f, 0);
	E.desc = jointext(split, "\n");
	rt.world().log = GLOB.world_runtime_log;
	parent_proc(E);
	rt.world().log = null;
	return f.dot;
}, false);

// a spawn(0) body of /world/proc/Error, a named tail so a world snapshot can hold it while it waits.
rt.tail("/world/proc/Error: spawn at modules/error_handler/error_handler.dm:52", function* (f: Frame, erroruid: Value, last_seen: Value, cooldown: Value, silencing: Value, configured_error_cooldown: Value, configured_error_limit: Value, configured_error_silence_time: Value, skipcount: Value, usrinfo: Value, locinfo: Value, splitlines: Value, desclines: Value, line: Value, split: Value, i: Value) {
	f.usr = null;
	yield* sleep(configured_error_silence_time);
	skipcount = rt.op(f, "Abs", [], [rt.index(GLOB.error_cooldown, erroruid)]) - 1;
	rt.setAt(GLOB.error_cooldown, erroruid, 0);
	if (skipcount > 0) {
		rt.op(f, "OutputReference", [rt.R.field("log")], [rt.world(), `[${time_stamp()}] Skipped ${skipcount} runtimes in ${f.args[0].file},${f.args[0].line}.`], false);
		yield* GLOB.error_cache.log_error(f.args[0], { skip_count: skipcount });
	}
	return null;
});
