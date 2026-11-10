// Based on /tg/station's code/modules/events/meteor_wave.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



rt.type(306, "/datum/round_event/meteor_wave", "/datum/round_event", {
	wave_type: null,
	wave_name: "normal",
	startWhen: 6,
	endWhen: 66,
	announceWhen: 1,
});

// meteor_wave.dm:18
rt.def("/datum/round_event/meteor_wave/proc/New", function New(f: Frame) {
	parent_proc();
	if (this.wave_type) return f.dot;
	this.determine_wave_type();
	return f.dot;
});

// meteor_wave.dm:23
rt.def("/datum/round_event/meteor_wave/proc/determine_wave_type", function determine_wave_type(f: Frame) {
	if (!this.wave_name) {
		this.wave_name = pickweight(rt.alist(f, ["normal", 50, "threatening", 40, "catastrophic", 10]));
	}
	if (this.wave_name === "normal") {
		this.wave_type = GLOB.meteors_normal;
	} else if (this.wave_name === "threatening") {
		this.wave_type = GLOB.meteors_threatening;
	} else if (this.wave_name === "catastrophic") {
		this.wave_type = GLOB.meteors_catastrophic;
	} else if (this.wave_name === "meaty") {
		this.wave_type = GLOB.meteorsB;
	} else if (this.wave_name === "space dust") {
		this.wave_type = GLOB.meteorsC;
	} else {
		warning(`${`Wave name of ${this.wave_name} not recognised.`} in ${"code/modules/events/meteor_wave.dm"} at line ${40} src: ${this} usr: ${f.usr}.`);
		this.kill();
	}
	return f.dot;
});

// meteor_wave.dm:44
rt.def("/datum/round_event/meteor_wave/proc/announce", function* announce(f: Frame) {
	yield* priority_announce("Meteors have been detected on collision course with the station.", "Meteor Alert", rt.rsc("sound/ai/meteors.ogg"));
	return f.dot;
}, true);

// meteor_wave.dm:47
rt.def("/datum/round_event/meteor_wave/proc/tick", function* tick(f: Frame) {
	if (!IsMultiple(this.activeFor, 3)) return f.dot;
	yield* spawn_meteors(5, this.wave_type);
	return f.dot;
}, true);
