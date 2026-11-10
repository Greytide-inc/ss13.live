// Based on /tg/station's code/modules/events/wizard/aid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(334, "/datum/round_event/wizard/robelesscasting", "/datum/round_event/wizard", {});

// aid.dm:12
rt.def("/datum/round_event/wizard/robelesscasting/proc/start", function start(f: Frame) {
	let L: Value = null, spell_improved: Value = null, S: Value = null;
	for (L of each(GLOB.mob_list, T("/mob/living"))) {
		if (L.mind && rt.len(f, L.mind.spell_list) != 0) {
			spell_improved = 0;
			S = null;
			for (S of each(L.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
				if (S.clothes_req) {
					S.clothes_req = 0;
					spell_improved = 1;
				}
			}
			if (spell_improved) {
				to_chat(L, "<span class='notice'>You suddenly feel like you never needed those garish robes in the first place...</span>");
			}
		}
	}
	return f.dot;
});

rt.type(335, "/datum/round_event/wizard/improvedcasting", "/datum/round_event/wizard", {});

// aid.dm:32
rt.def("/datum/round_event/wizard/improvedcasting/proc/start", function start(f: Frame) {
	let L: Value = null, S: Value = null;
	let $e: any;
	for (L of each(GLOB.mob_list, T("/mob/living"))) {
		if (L.mind && rt.len(f, L.mind.spell_list) != 0) {
			S = null;
			for (S of each(L.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
				S.name = rt.initial(f, S, "name");
				S.spell_level++;
				if (S.spell_level >= 6 || S.charge_max <= 0) {
					continue;
				}
				if (S.level_max <= 0) {
					continue;
				}
				S.charge_max = round(rt.initial(f, S, "charge_max") - S.spell_level * (rt.initial(f, S, "charge_max") - S.cooldown_min) / S.level_max);
				if (S.charge_max < S.charge_counter) {
					S.charge_counter = S.charge_max;
				}
				if (S.spell_level === 1) {
					S.name = `Efficient ${S.name}`;
				} else if (S.spell_level === 2) {
					S.name = `Quickened ${S.name}`;
				} else if (S.spell_level === 3) {
					S.name = `Free ${S.name}`;
				} else if (S.spell_level === 4) {
					S.name = `Instant ${S.name}`;
				} else if (S.spell_level === 5) {
					S.name = `Ludicrous ${S.name}`;
				}
			}
			to_chat(L, "<span class='notice'>You suddenly feel more competent with your casting!</span>");
		}
	}
	return f.dot;
});
