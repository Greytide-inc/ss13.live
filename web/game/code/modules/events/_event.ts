// Based on /tg/station's code/modules/events/_event.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(1351, "/datum/round_event_control", "/datum", {
	name: null,
	typepath: null,
	weight: 10,
	earliest_start: 12000,
	min_players: 0,
	occurrences: 0,
	max_occurrences: 20,
	holidayID: "",
	wizardevent: 0,
	alertadmins: 1,
	gamemode_blacklist: null,
	gamemode_whitelist: null,
	triggering: null,
});

// _event.dm:25
rt.def("/datum/round_event_control/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.gamemode_blacklist = list();

	this.gamemode_whitelist = list();
	return f.dot;
});

// _event.dm:31
rt.def("/datum/round_event_control/proc/New", function New(f: Frame) {
	parent_proc();
	if (!(GLOB.config && !this.wizardevent)) return f.dot;
	this.earliest_start = Ceiling(this.earliest_start * GLOB.config.events_min_time_mul);
	this.min_players = Ceiling(this.min_players * GLOB.config.events_min_players_mul);
	return f.dot;
});

// _event.dm:42
rt.def("/datum/round_event_control/proc/canSpawnEvent", function canSpawnEvent(f: Frame, players_amt: Value, gamemode: Value) {
	if (this.occurrences >= this.max_occurrences) {
		return 0;
	}
	if (this.earliest_start >= rt.worldTime(f)) {
		return 0;
	}
	if (this.wizardevent != GLOB.SSevents.wizardmode) {
		return 0;
	}
	if (players_amt < this.min_players) {
		return 0;
	}
	if (rt.len(f, this.gamemode_blacklist) && rt.isIn(f, gamemode, this.gamemode_blacklist)) {
		return 0;
	}
	if (rt.len(f, this.gamemode_whitelist) && !rt.isIn(f, gamemode, this.gamemode_whitelist)) {
		return 0;
	}
	if (this.holidayID && (!GLOB.SSevents.holidays || !rt.index(GLOB.SSevents.holidays, this.holidayID))) {
		return 0;
	}
	return 1;
});

// _event.dm:59
rt.def("/datum/round_event_control/proc/preRunEvent", function* preRunEvent(f: Frame) {
	let gamemode: Value = null, players_amt: Value = null;
	if (!ispath(this.typepath, T("/datum/round_event"))) {
		return EVENT_CANT_RUN;
	}
	this.triggering = 1;
	if (this.alertadmins) {
		message_admins(fmt("Random Event triggering in 10 seconds: ＀ (＀) (<a href='?src=＃;cancel=1'>CANCEL</a>)", [this.name, this.typepath, this]));
		yield* sleep(100);
		gamemode = GLOB.SSticker.mode.config_tag;
		if (!this.canSpawnEvent((players_amt = (yield* get_active_player_count({ alive_check: 1, afk_check: 1, human_check: 1 }))), gamemode)) {
			message_admins(`Second pre-condition check for ${this.name} failed, skipping...`);
			return EVENT_INTERRUPTED;
		}
	}
	if (!this.triggering) {
		return EVENT_CANCELLED;
	}
	this.triggering = 0;
	return EVENT_READY;
}, true);

// _event.dm:78
rt.def("/datum/round_event_control/proc/Topic", function Topic(f: Frame, href: Value, href_list: Value) {
	parent_proc();
	if (!rt.at(href_list, "cancel")) return f.dot;
	if (!this.triggering) {
		to_chat(f.usr, "<span class='admin'>You are too late to cancel that event</span>");
		return f.dot;
	}
	this.triggering = 0;
	message_admins(`${key_name_admin(f.usr)} cancelled event ${this.name}.`);
	log_admin_private(`${key_name(f.usr)} cancelled event ${this.name}.`);
	return f.dot;
}, false);

// _event.dm:89
rt.def("/datum/round_event_control/proc/runEvent", function* runEvent(f: Frame, random: Value) {
	let E: Value = null;
	(E = (yield* new_(this.typepath))).current_players = (yield* get_active_player_count({ alive_check: 1, afk_check: 1, human_check: 1 }));
	E.control = this;
	this.occurrences++;
	if (random) {
		if (this.alertadmins) {
			yield* deadchat_broadcast(`<span class='deadsay'><b>${this.name}</b> has just been randomly triggered!</span>`);
		}
		log_game(`Random Event triggering: ${this.name} (${this.typepath})`);
	}
	return E;
}, true);

rt.type(272, "/datum/round_event", "/datum", {
	processing: 1,
	control: null,
	startWhen: 0,
	announceWhen: 0,
	endWhen: 0,
	activeFor: 0,
	current_players: 0,
});

// _event.dm:157
rt.def("/datum/round_event/proc/process", function* process(f: Frame) {
	if (!this.processing) {
		return f.dot;
	}
	if (this.activeFor == this.startWhen) {
		yield* this.start();
	}
	if (this.activeFor == this.announceWhen) {
		yield* this.announce();
	}
	if (this.startWhen < this.activeFor && this.activeFor < this.endWhen) {
		yield* this.tick();
	}
	if (this.activeFor == this.endWhen) {
		yield* this.end();
	}
	if (this.activeFor >= this.endWhen && this.activeFor >= this.announceWhen && this.activeFor >= this.startWhen) {
		this.kill();
	}
	this.activeFor++;
	return f.dot;
}, true, { waitfor: false });

// _event.dm:183
rt.def("/datum/round_event/proc/kill", function kill(f: Frame) {
	GLOB.SSevents.running -= this;
	return f.dot;
});

// _event.dm:188
rt.def("/datum/round_event/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	this.setup();
	this.processing = f.args[0];
	GLOB.SSevents.running += this;
	return parent_proc();
}, false, { args: ["my_processing"] });
