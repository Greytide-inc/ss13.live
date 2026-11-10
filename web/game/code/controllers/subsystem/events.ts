// Based on /tg/station's code/controllers/subsystem/events.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(19, "/datum/controller/subsystem/events", "/datum/controller/subsystem", {
	control: null,
	running: null,
	currentrun: null,
	scheduled: 0,
	frequency_lower: 1800,
	frequency_upper: 6000,
	holidays: null,
	wizardmode: 0,
	name: "Events",
	init_order: 14,
	runlevels: 4,
});

// events.dm:1
rt.def("/datum/controller/subsystem/events/proc/New", function* New(f: Frame) {
	if (GLOB.SSevents != this) {
		if (rt.istype(GLOB.SSevents, T("/datum/controller/subsystem/events"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSevents);
		}
		GLOB.SSevents = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// events.dm:6
rt.def("/datum/controller/subsystem/events/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.control = list();

	this.running = list();

	this.currentrun = list();
	return f.dot;
});

// events.dm:18
rt.def("/datum/controller/subsystem/events/proc/Initialize", function* Initialize(f: Frame, time: Value, zlevel: Value) {
	let type: Value = null, E: Value = null;
	for (type of each(typesof(T("/datum/round_event_control")))) {
		if (!(E = (yield* new_(type))).typepath) {
			continue;
		}
		this.control += E;
	}
	this.reschedule();
	yield* this.getHoliday();
	yield* parent_proc();
	return f.dot;
}, true);

// events.dm:29
rt.def("/datum/controller/subsystem/events/proc/fire", function fire(f: Frame, resumed: Value) {
	let thing: Value = null;
	resumed ??= 0;
	if (!resumed) {
		this.checkEvent();
		this.currentrun = this.running.Copy();
	}
	let currentrun: Value = this.currentrun;
	while (rt.len(f, currentrun)) {
		thing = rt.index(currentrun, rt.len(f, currentrun));
		currentrun.len--;
		if (thing) {
			thing.process();
		} else {
			this.running.Remove(thing);
		}
		if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
			return f.dot;
		}
	}
	return f.dot;
});

// events.dm:48
rt.def("/datum/controller/subsystem/events/proc/checkEvent", function checkEvent(f: Frame) {
	if (!(this.scheduled <= rt.worldTime(f))) return f.dot;
	this.spawnEvent();
	this.reschedule();
	return f.dot;
});

// events.dm:54
rt.def("/datum/controller/subsystem/events/proc/reschedule", function reschedule(f: Frame) {
	this.scheduled = rt.worldTime(f) + rand(this.frequency_lower, max(this.frequency_lower, this.frequency_upper));
	return f.dot;
});

// events.dm:59
rt.def("/datum/controller/subsystem/events/proc/spawnEvent", function* spawnEvent(f: Frame) {
	let E: Value = null, res: Value = null;
	if (!GLOB.config.allow_random_events) {
		return f.dot;
	}
	let gamemode: Value = GLOB.SSticker.mode.config_tag;
	let players_amt: Value = (yield* get_active_player_count({ alive_check: 1, afk_check: 1, human_check: 1 }));
	let sum_of_weights: Value = 0;
	for (E of each(this.control, T("/datum/round_event_control"))) {
		if (!E.canSpawnEvent(players_amt, gamemode)) {
			continue;
		}
		if (E.weight < 0) {
			if ((res = (yield* this.TriggerEvent(E))) == EVENT_INTERRUPTED) {
				continue;
			}
			if (res == EVENT_CANT_RUN) {
				return f.dot;
			}
		}
		sum_of_weights += E.weight;
	}
	sum_of_weights = rand(0, sum_of_weights);
	E = null;
	for (E of each(this.control, T("/datum/round_event_control"))) {
		if (!E.canSpawnEvent(players_amt, gamemode)) {
			continue;
		}
		sum_of_weights -= E.weight;
		if (sum_of_weights <= 0) {
			if (yield* this.TriggerEvent(E)) {
				return f.dot;
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// events.dm:92
rt.def("/datum/controller/subsystem/events/proc/TriggerEvent", function* TriggerEvent(f: Frame, E: Value) {
	f.dot = (yield* E.preRunEvent());
	if (f.dot == EVENT_CANT_RUN) {
		E.max_occurrences = 0;
	} else {
		if (f.dot != 1) return f.dot;
		yield* E.runEvent(1);
	}
	return f.dot;
}, true);

// events.dm:99
rt.def("/datum/round_event/proc/findEventArea", function findEventArea(f: Frame) {
	let safe_areas: Value = list(T("/area/ai_monitored/turret_protected/ai"), T("/area/ai_monitored/turret_protected/ai_upload"), T("/area/engine"), T("/area/solar"), T("/area/holodeck"), T("/area/shuttle"));
	let danger_areas: Value = list(T("/area/engine/break_room"), T("/area/crew_quarters/heads/chief"));
	return rt.locateIn(f, pick(GLOB.the_station_areas - safe_areas + danger_areas), rt.world());
});

// events.dm:123
rt.def("/client/proc/forceEvent", function* forceEvent(f: Frame) {
	if (!this.holder || !check_rights(8)) {
		return f.dot;
	}
	yield* this.holder.forceEvent();
	return f.dot;
}, true, { verb: { name: "Trigger Event", category: "Fun" } });

// events.dm:129
rt.def("/datum/admins/proc/forceEvent", function* forceEvent(f: Frame) {
	let E: Value = null, popup: Value = null;
	let dat: Value = "";
	let normal: Value = "";
	let magic: Value = "";
	let holiday: Value = "";
	for (E of each(GLOB.SSevents.control, T("/datum/round_event_control"))) {
		dat = fmt("<BR><A href='?src=＃;forceevent=＃'>＀</A>", [this, E, E]);
		if (E.holidayID) {
			holiday += dat;
		} else if (E.wizardevent) {
			magic += dat;
		} else {
			normal += dat;
		}
	}
	dat = normal + "<BR>" + magic + "<BR>" + holiday;
	(popup = (yield* new_(T("/datum/browser"), f.usr, "forceevent", "Force Random Event", 300, 750))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// events.dm:172
rt.def("/datum/controller/subsystem/events/proc/getHoliday", function* getHoliday(f: Frame) {
	let H: Value = null, holiday: Value = null;
	if (!GLOB.config.allow_holidays) {
		return f.dot;
	}
	let YY: Value = text2num(time2text(rt.world().timeofday, "YY"));
	let MM: Value = text2num(time2text(rt.world().timeofday, "MM"));
	let DD: Value = text2num(time2text(rt.world().timeofday, "DD"));
	let DDD: Value = text2num(time2text(rt.world().timeofday, "DDD"));
	let W: Value = weekdayofthemonth();
	for (H of each(typesof(T("/datum/holiday")) - T("/datum/holiday"))) {
		if ((holiday = (yield* new_(H))).shouldCelebrate(DD, MM, YY, W, DDD)) {
			yield* holiday.celebrate();
			if (!this.holidays) {
				this.holidays = list();
			}
			rt.setAt(this.holidays, holiday.name, holiday);
		} else {
			yield* qdel(holiday);
		}
	}
	if (!this.holidays) return f.dot;
	this.holidays = shuffle(this.holidays);
	set_station_name(new_station_name());
	yield* rt.world().update_status();
	return f.dot;
}, true);

// events.dm:198
rt.def("/datum/controller/subsystem/events/proc/toggleWizardmode", function toggleWizardmode(f: Frame) {
	let $0: any;
	this.wizardmode = (!this.wizardmode ? 1 : 0);
	if (this.wizardmode) {
		$0 = `enabled, events will occur every ${GLOB.SSevents.frequency_lower / 600} to ${GLOB.SSevents.frequency_upper / 600} minutes`;
	} else {
		$0 = "disabled";
	}
	message_admins(`Summon Events has been ${$0}!`);
	log_game(`Summon Events was ${this.wizardmode ? "enabled" : "disabled"}!`);
	return f.dot;
});

// events.dm:204
rt.def("/datum/controller/subsystem/events/proc/resetFrequency", function resetFrequency(f: Frame) {
	this.frequency_lower = rt.initial(f, this, "frequency_lower");
	this.frequency_upper = rt.initial(f, this, "frequency_upper");
	return f.dot;
});
