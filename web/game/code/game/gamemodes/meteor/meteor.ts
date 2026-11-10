// Based on /tg/station's code/game/gamemodes/meteor/meteor.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1094, "/datum/game_mode/meteor", "/datum/game_mode", {
	meteordelay: 2000,
	nometeors: 0,
	rampupdelta: 5,
	name: "meteor",
	config_tag: "meteor",
	required_players: 0,
	announce_span: "danger",
	announce_text: "A major meteor shower is bombarding the station! The crew needs to evacuate or survive the onslaught.",
});

// meteor.dm:14
rt.def("/datum/game_mode/meteor/proc/process", function* process(f: Frame) {
	let meteorminutes: Value = null, ramp_up_final: Value = null;
	if (this.nometeors || this.meteordelay > rt.worldTime(f) - GLOB.SSticker.round_start_time) {
		return f.dot;
	}
	let wavetype: Value = GLOB.meteors_normal;
	if (prob((meteorminutes = (rt.worldTime(f) - GLOB.SSticker.round_start_time - this.meteordelay) / 10 / 60))) {
		wavetype = GLOB.meteors_threatening;
	}
	if (prob(meteorminutes / 2)) {
		wavetype = GLOB.meteors_catastrophic;
	}
	yield* spawn_meteors((ramp_up_final = max(1, min(round(meteorminutes / this.rampupdelta), 10))), wavetype);
	return f.dot;
}, true, { waitfor: false });

// meteor.dm:36
rt.def("/datum/game_mode/meteor/proc/declare_completion", function declare_completion(f: Frame) {
	let text: Value = null, player: Value = null;
	let survivors: Value = 0;
	for (player of each(GLOB.player_list, T("/mob/living"))) {
		if (player.stat != 2) {
			survivors++;
			if (player.onCentcom()) {
				text += `<br><b><font size=2>${player.real_name} escaped to the safety of Centcom.</font></b>`;
			} else if (player.onSyndieBase()) {
				text += `<br><b><font size=2>${player.real_name} escaped to the (relative) safety of Syndicate Space.</font></b>`;
			} else {
				text += `<br><font size=1>${player.real_name} survived but is stranded without any hope of rescue.</font>`;
			}
		}
	}
	if (survivors) {
		to_chat(rt.world(), `<span class='boldnotice'>The following survived the meteor storm</span>:${text}`);
	} else {
		to_chat(rt.world(), "<span class='boldnotice'>Nobody survived the meteor storm!</span>");
	}
	GLOB.SSticker.mode_result = "end - evacuation";
	parent_proc();
	return 1;
});
