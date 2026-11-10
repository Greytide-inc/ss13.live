// Based on /tg/station's code/modules/mob/living/silicon/ai/laws.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// laws.dm:5
rt.def("/mob/living/silicon/ai/proc/show_laws_verb", function* show_laws_verb(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	yield* this.show_laws();
	return f.dot;
}, true, { verb: { name: "Show Laws", category: "AI Commands" } });

// laws.dm:13
rt.def("/mob/living/silicon/ai/proc/show_laws", function* show_laws(f: Frame, everyone: Value) {
	let who: Value = null, R: Value = null;
	everyone ??= 0;
	if (everyone) {
		who = rt.world();
	} else {
		who = this;
	}
	to_chat(who, "<b>Obey these laws:</b>");
	yield* this.laws_sanity_check();
	yield* this.laws.show_laws(who);
	if (everyone) return f.dot;
	for (R of each(this.connected_robots, T("/mob/living/silicon/robot"))) {
		if (R.lawupdate) {
			yield* R.lawsync();
			yield* R.show_laws();
			R.law_change_counter++;
		}
	}
	return f.dot;
}, true);
