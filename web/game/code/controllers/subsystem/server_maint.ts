// Based on /tg/station's code/controllers/subsystem/server_maint.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(38, "/datum/controller/subsystem/server_maint", "/datum/controller/subsystem", {
	currentrun: null,
	name: "Server Tasks",
	wait: 6,
	flags: 64,
	priority: 10,
	init_order: 16,
	runlevels: 15,
});

// server_maint.dm:3
rt.def("/datum/controller/subsystem/server_maint/proc/New", function* New(f: Frame) {
	if (GLOB.SSserver_maint != this) {
		if (rt.istype(GLOB.SSserver_maint, T("/datum/controller/subsystem/server_maint"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSserver_maint);
		}
		GLOB.SSserver_maint = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// server_maint.dm:13
rt.def("/datum/controller/subsystem/server_maint/proc/Initialize", function Initialize(f: Frame, timeofday: Value) {
	parent_proc();
	return f.dot;
}, false);

// server_maint.dm:18
rt.def("/datum/controller/subsystem/server_maint/proc/fire", function* fire(f: Frame, resumed: Value) {
	let I: Value = null, C: Value = null, cmob: Value = null;
	let $e: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = (yield* GLOB.clients.Copy());
	}
	let currentrun: Value = this.currentrun;
	let round_started: Value = GLOB.SSticker.HasRoundStarted();
	for (I of each(currentrun)) {
		C = I;
		if (round_started && GLOB.config.kick_inactive) {
			if (C.is_afk(GLOB.config.afk_period)) {
				if (!(rt.istype((cmob = C.mob), T("/mob/dead/observer")) || rt.istype(cmob, T("/mob/dead")) && C.holder)) {
					log_access(`AFK: ${key_name(C)}`);
					to_chat(C, `<span class='danger'>You have been inactive for more than ${GLOB.config.afk_period / 600} minutes and have been disconnected.</span>`);
					yield* qdel(C);
				}
			}
		}
		if (!(!C || rt.worldTime(f) - C.connection_time < PING_BUFFER_TIME || C.inactivity >= this.wait - 1)) {
			winset(C, null, `command=.update_ping+${rt.worldTime(f) + rt.world().tick_lag * rt.tickUsage(f) / 100}`);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
}, true);

// server_maint.dm:42
rt.def("/datum/controller/subsystem/server_maint/proc/Shutdown", function* Shutdown(f: Frame) {
	let thing: Value = null, C: Value = null;
	yield* kick_clients_in_lobby("<span class='boldannounce'>The round came to an end with you in the lobby.</span>", 1);
	for (thing of each(GLOB.clients)) {
		if ((C = thing) && GLOB.config.server) {
			rt.op(f, "Link", [], [C, fmt("byond://＀", [GLOB.config.server])], false);
		}
	}
	return f.dot;
}, true);
