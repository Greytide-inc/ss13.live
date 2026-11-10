// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/verbs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { g } = rt;


// verbs.dm:12
rt.def("/mob/living/simple_animal/drone/verb/check_laws", function check_laws(f: Frame) {
	to_chat(this, "<b>Drone Laws</b>");
	to_chat(this, this.laws);
	return f.dot;
}, false, { verb: { name: "Check Laws", category: "Drone" } });

// verbs.dm:19
rt.def("/mob/living/simple_animal/drone/verb/toggle_light", function toggle_light(f: Frame) {
	if (this.light_on) {
		this.set_light(0);
	} else {
		this.set_light(8);
	}
	this.light_on = (!this.light_on ? 1 : 0);
	let $0: any = this;
	to_chat($0, `<span class='notice'>Your light is now ${this.light_on ? "on" : "off"}.</span>`);
	return f.dot;
}, false, { verb: { name: "Toggle drone light", category: "Drone" } });

// verbs.dm:31
rt.def("/mob/living/simple_animal/drone/verb/drone_ping", function* drone_ping(f: Frame) {
	let msg: Value = null;
	let alert_s: Value = (yield* g.op(f, "Prompt", [1], [null, "Drone ping", "Alert severity level", this, list("Low", "Medium", "High", "Critical")]));
	let A: Value = get_area(this.loc);
	if (!(alert_s && A && this.stat != 2)) return f.dot;
	this.alert_drones((msg = `<span class='boldnotice'>DRONE PING: ${this.name}: ${alert_s} priority alert in ${A.name}!</span>`));
	return f.dot;
}, true, { verb: { name: "Drone ping", category: "Drone" } });

// verbs.dm:45
rt.def("/mob/living/simple_animal/drone/verb/toggle_statics", function* toggle_statics(f: Frame) {
	let selectedStatic: Value = null;
	if (!this.seeStatic) {
		to_chat(this, "<span class='warning'>You have no vision filter to change!</span>");
		return f.dot;
	}
	if (rt.isIn(f, (selectedStatic = (yield* g.op(f, "Prompt", [1], [null, null, "Vision Filter", "Select a vision filter", this.staticChoices]))), this.staticChoices)) {
		this.staticChoice = selectedStatic;
	}
	this.updateSeeStaticMobs();
	return f.dot;
}, true, { verb: { name: "Change Vision Filter", category: "Drone", desc: "Change the filter on the system used to remove non drone beings from your viewscreen." } });
