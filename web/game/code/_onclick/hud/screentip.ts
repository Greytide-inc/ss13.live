// Based on /tg/station's code/_onclick/hud/screentip.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// BYOND built-in.
rt.def("/atom/proc/MouseEntered", undefined, false, { args: ["location", "control", "params"] });

// screentip.dm:14
rt.def("/atom/proc/MouseEntered", function MouseEntered(f: Frame, location: Value, control: Value, params: Value) {
	let M: Value = null, tip: Value = null;
	if (!(M = f.usr) || !M.client || !M.client.prefs || !M.client.prefs.screentip_pref) {
		return f.dot;
	}
	if (!M.hud_used || !M.hud_used.screentip_text) {
		return f.dot;
	}
	if (rt.istype(this, T("/turf/open/floor")) || this.name == "") {
		M.hud_used.screentip_text.maptext = "";
		return f.dot;
	}
	if (text2ascii((tip = `${this.name}`)) == 255) {
		tip = copytext(tip, 3);
	}
	M.hud_used.screentip_text.maptext = `<div align='center' style='color:#ffd391; font-size:8pt'>${tip}</div>`;
	return f.dot;
});

// BYOND built-in.
rt.def("/atom/proc/MouseExited", undefined, false, { args: ["location", "control", "params"] });

// screentip.dm:28
rt.def("/atom/proc/MouseExited", function MouseExited(f: Frame) {
	let M: Value = null;
	if (!((M = f.usr) && M.hud_used && M.hud_used.screentip_text)) return f.dot;
	M.hud_used.screentip_text.maptext = "";
	return f.dot;
});

// screentip.dm:37
rt.def("/client/verb/toggle_screentips", function toggle_screentips(f: Frame) {
	this.prefs.screentip_pref = (!this.prefs.screentip_pref ? 1 : 0);
	if (!this.prefs.screentip_pref && this.mob && this.mob.hud_used && this.mob.hud_used.screentip_text) {
		this.mob.hud_used.screentip_text.maptext = "";
	}
	let $0: any = this;
	let $1: any = "screentips";
	winset($0, $1, `is-checked=${this.prefs.screentip_pref ? "true" : "false"}`);
	to_chat(this, `Screentips are now ${this.prefs.screentip_pref ? "on" : "off"}.`);
	this.prefs.save_preferences();
	return f.dot;
}, false, { hidden: true, verb: { name: "toggle-screentips", category: "OOC" } });
