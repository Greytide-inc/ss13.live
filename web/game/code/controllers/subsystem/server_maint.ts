// From code/controllers/subsystem/server_maint.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(38, "/datum/controller/subsystem/server_maint", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Server Tasks",
	wait: 6,
	flags: 64,
	priority: 10,
	init_order: 16,
	runlevels: 15,
});

// /datum/controller/subsystem/server_maint/proc/New  (code/controllers/subsystem/server_maint.dm:3)  may sleep
rt.def("/datum/controller/subsystem/server_maint/proc/New", function* New(f: Frame) {
	if (!isEqual(rt.gl("SSserver_maint"), live(f.src))) {
		if (truthy((rt.istype(rt.gl("SSserver_maint"), T("/datum/controller/subsystem/server_maint")) ? 1 : 0))) {
			yield* g.srcCall(f, "Recover");
			yield* g.call(f, P("/proc/qdel"), null, [rt.gl("SSserver_maint")]);
		}
		rt.setGl("SSserver_maint", live(f.src));
	}
	yield* g.srcCall(f, "PreInit");
	return f.dot;
}, true);

// /datum/controller/subsystem/server_maint/proc/Initialize  (code/controllers/subsystem/server_maint.dm:13)
rt.def("/datum/controller/subsystem/server_maint/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["timeofday"] });

// /datum/controller/subsystem/server_maint/proc/fire  (code/controllers/subsystem/server_maint.dm:18)  may sleep
rt.def("/datum/controller/subsystem/server_maint/proc/fire", function* fire(f: Frame, resumed: Value) {
	let currentrun: Value = null, round_started: Value = null, I: Value = null, C: Value = null, cmob: Value = null;
	let $0: any, $e: any;
	f.vars = () => [resumed, currentrun, round_started, I, C, cmob, $0, $e];
	if (live(resumed) === null) {
		resumed = 0;
	}
	if (!truthy(live(resumed))) {
		rt.setFv(f, "currentrun", live(f.src), (yield* g.callName(f, rt.gl("clients"), "Copy", [])));
	}
	currentrun = rt.fv(f, "currentrun", live(f.src));
	round_started = (yield* g.callName(f, rt.gl("SSticker"), "HasRoundStarted", []));
	I = null;
	rt.forList(f, 0, live(currentrun));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		C = live(I);
		if ((truthy(live(round_started)) && truthy(rt.fv(f, "kick_inactive", rt.gl("config"))))) {
			if (truthy((yield* g.callName(f, live(C), "is_afk", [rt.fv(f, "afk_period", rt.gl("config"))])))) {
				if (!(truthy((rt.istype((cmob = rt.fv(f, "mob", live(C))), T("/mob/dead/observer")) ? 1 : 0)) || (truthy((rt.istype(live(cmob), T("/mob/dead")) ? 1 : 0)) && truthy(rt.fv(f, "holder", live(C)))))) {
					yield* g.call(f, P("/proc/log_access"), null, [fmt("AFK: ＀", [(yield* g.call(f, P("/proc/key_name"), null, [live(C)]))])]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(C), fmt("<span class='danger'>You have been inactive for more than ＀ minutes and have been disconnected.</span>", [divide(rt.fv(f, "afk_period", rt.gl("config")), 600)])]);
					yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
				}
			}
		}
		if (!((!truthy(live(C)) || rt.lt(subtract(rt.worldTime(f), rt.fv(f, "connection_time", live(C))), 25)) || rt.ge(rt.fv(f, "inactivity", live(C)), subtract(rt.sv(f, "wait"), 1)))) {
			yield* g.call(f, P("/proc/winset"), null, [live(C), null, fmt("command=.update_ping+＀", [add(rt.worldTime(f), divide(multiply(rt.fv(f, "tick_lag", rt.world()), rt.tickUsage(f)), 100))])]);
		}
		if ((rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit")) || !isEqual(rt.fv(f, "state", live(f.src)), 2))) {
			$0 = (yield* g.srcCall(f, "pause"));
		} else {
			$0 = 0;
		}
		if (truthy($0)) {
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/controller/subsystem/server_maint/proc/Shutdown  (code/controllers/subsystem/server_maint.dm:42)  may sleep
rt.def("/datum/controller/subsystem/server_maint/proc/Shutdown", function* Shutdown(f: Frame) {
	let thing: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [thing, C, $e];
	yield* g.call(f, P("/proc/kick_clients_in_lobby"), null, ["<span class='boldannounce'>The round came to an end with you in the lobby.</span>", 1]);
	thing = null;
	rt.forList(f, 0, rt.gl("clients"));
	while (($e = rt.next(f, 0)) !== undefined) {
		thing = $e;
		if ((truthy((C = live(thing))) && truthy(rt.fv(f, "server", rt.gl("config"))))) {
			rt.op(f, "Link", [], [live(C), fmt("byond://＀", [rt.fv(f, "server", rt.gl("config"))])], false);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
