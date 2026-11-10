// Based on /tg/station's code/_onclick/hud/runechat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// runechat.dm:14
rt.def("/datum/controller/global_vars/proc/InitGlobalrunechat_colors", function InitGlobalrunechat_colors(f: Frame) {
	GLOB.runechat_colors = list("#ff6b6b", "#ff9f43", "#f2d600", "#6bd36b", "#2ec4b6", "#4cc9f0", "#6b8cff", "#a56bff", "#e06bd6", "#ff7f50", "#9acd32", "#00bfff");
	this.gvars_datum_init_order += "runechat_colors";
	return f.dot;
});

rt.type(79, "/datum/chatmessage", "/datum", {
	owner: null,
	speaker: null,
	I: null,
	height: 10,
});

// runechat.dm:23
rt.def("/datum/chatmessage/proc/New", function* New(f: Frame, C: Value, S: Value, text: Value, spans: Value) {
	let lines: Value = null, i: Value = null, mine: Value = null, old: Value = null, oldest: Value = null;
	let $e: any;
	if (!C || !S || !text) {
		yield* qdel(this);
		return f.dot;
	}
	this.owner = C;
	this.speaker = S;
	if (rt.length(text) > RUNECHAT_MAX_CHARS) {
		text = `${copytext(text, 1, 58)}...`;
	}
	this.height = (lines = max(1, round((rt.length(text) + 20 - 1) / 20))) * 10 + 2;
	let name_sum: Value = 0;
	let nm: Value = `${S.name}`;
	rt.forRange(f, 0, 1, rt.length(nm), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		name_sum += text2ascii(nm, i);
	}
	rt.endFor(f, 0);
	let color: Value = rt.index(GLOB.runechat_colors, name_sum % rt.len(f, GLOB.runechat_colors) + 1);
	let style: Value = spans && rt.isIn(f, "emphasis", spans) ? "font-style:italic;" : "";
	this.I = (yield* image({ loc: S }));
	this.I.layer = 5;
	this.I.maptext_y = 32;
	this.I.maptext_width = RUNECHAT_WIDTH;
	this.I.maptext_height = this.height;
	this.I.maptext_x = -44;
	this.I.maptext = `<div align='center' style='color:${color};font-size:7.5pt;${style}text-shadow:1px 1px 1px #000;'>${text}</div>`;
	this.I.alpha = 255;
	if (!this.owner.runechat_lines) {
		this.owner.runechat_lines = list();
	}
	if (!(mine = rt.index(this.owner.runechat_lines, S))) {
		mine = list();
		rt.setAt(this.owner.runechat_lines, S, mine);
	}
	for (old of each(mine, T("/datum/chatmessage"))) {
		if (old.I) {
			rt.op(f, "Animate", [2, 6], [null, old.I, "maptext_y", old.I.maptext_y + this.height, "time", 3]);
		}
	}
	mine += this;
	this.owner.images += this.I;
	if (rt.len(f, mine) > RUNECHAT_MAX_LINES) {
		yield* qdel((oldest = rt.index(mine, 1)));
	}
	let life: Value = RUNECHAT_LIFESPAN + rt.length(text) * RUNECHAT_EXTRA_PER_CHAR;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/datum/chatmessage/proc/begin_fade"))), life);
	return f.dot;
}, true);

// runechat.dm:64
rt.def("/datum/chatmessage/proc/begin_fade", function* begin_fade(f: Frame) {
	if (!this || this.gc_destroyed || !this.I) {
		return f.dot;
	}
	rt.op(f, "Animate", [2, 6], [null, this.I, "alpha", 0, "time", RUNECHAT_FADE]);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 5, 8);
	return f.dot;
}, true);

// runechat.dm:72
rt.def("/datum/chatmessage/proc/Destroy", function* Destroy(f: Frame) {
	let mine: Value = null;
	if (this.owner) {
		if (this.I) {
			this.owner.images -= this.I;
		}
		if (mine = this.owner.runechat_lines ? rt.index(this.owner.runechat_lines, this.speaker) : null) {
			mine -= this;
			if (!rt.len(f, mine)) {
				this.owner.runechat_lines -= this.speaker;
			}
		}
	}
	this.I = null;
	this.owner = null;
	this.speaker = null;
	return (yield* parent_proc());
}, true);

// runechat.dm:84
rt.def("/mob/living/proc/show_runechat", function* show_runechat(f: Frame, speaker: Value, message_language: Value, raw_message: Value, spans: Value) {
	let D: Value = null;
	if (!this.client || !this.client.prefs || !this.client.prefs.runechat_pref || !raw_message || !speaker || !speaker.loc) {
		return f.dot;
	}
	if (!this.can_hear()) {
		return f.dot;
	}
	if (!(yield* this.has_language(message_language))) {
		if (!message_language) {
			return f.dot;
		}
		if (D = rt.index(GLOB.language_datum_instances, message_language)) {
			raw_message = D.scramble(raw_message);
		}
	}
	yield* new_(T("/datum/chatmessage"), this.client, speaker, raw_message, spans);
	return f.dot;
}, true);

// runechat.dm:104
rt.def("/client/verb/toggle_runechat", function* toggle_runechat(f: Frame) {
	let S: Value = null, M: Value = null;
	let $e: any;
	this.prefs.runechat_pref = (!this.prefs.runechat_pref ? 1 : 0);
	if (!this.prefs.runechat_pref && this.runechat_lines) {
		for (S of each(this.runechat_lines)) {
			M = null;
			for (M of each(rt.index(this.runechat_lines, S), T("/datum/chatmessage"))) {
				yield* qdel(M);
			}
		}
	}
	let $0: any = this;
	let $1: any = "runechat";
	winset($0, $1, `is-checked=${this.prefs.runechat_pref ? "true" : "false"}`);
	to_chat(this, `Runechat is now ${this.prefs.runechat_pref ? "on" : "off"}.`);
	this.prefs.save_preferences();
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-runechat", category: "OOC" } });

rt.type(80, "/datum/balloon_alert", "/datum", {
	owner: null,
	I: null,
});

// runechat.dm:126
rt.def("/datum/balloon_alert/proc/New", function* New(f: Frame, C: Value, target: Value, text: Value) {
	if (!C || !target || !text) {
		yield* qdel(this);
		return f.dot;
	}
	this.owner = C;
	if (rt.length(text) > 40) {
		text = `${copytext(text, 1, 38)}...`;
	}
	this.I = (yield* image({ loc: target }));
	this.I.layer = 5;
	this.I.maptext_width = 96;
	this.I.maptext_height = 12;
	this.I.maptext_x = -32;
	this.I.maptext_y = 24;
	this.I.maptext = `<div align='center' style='color:#ffffff;font-size:6pt;text-shadow:1px 1px 1px #000;'>${text}</div>`;
	this.I.alpha = 255;
	this.owner.images += this.I;
	rt.op(f, "Animate", [2, BALLOON_ALERT_FADE], [null, this.I, "maptext_y", 36, "time", BALLOON_ALERT_LIFESPAN]);
	rt.op(f, "Animate", [2, 4], ["alpha", 0, "time", BALLOON_ALERT_FADE]);
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 27, 8);
	return f.dot;
}, true);

// runechat.dm:146
rt.def("/datum/balloon_alert/proc/Destroy", function* Destroy(f: Frame) {
	if (this.owner && this.I) {
		this.owner.images -= this.I;
	}
	this.I = null;
	this.owner = null;
	return (yield* parent_proc());
}, true);

// runechat.dm:154
rt.def("/atom/proc/balloon_alert", function* balloon_alert(f: Frame, viewer: Value, text: Value) {
	let target: Value = null;
	if (!viewer || !viewer.client || !text) {
		return f.dot;
	}
	if (!(target = isturf(this) ? this : get_atom_on_turf(this)) || !(isturf(target) || isturf(target.loc))) {
		return f.dot;
	}
	yield* new_(T("/datum/balloon_alert"), viewer.client, target, text);
	return f.dot;
}, true);
