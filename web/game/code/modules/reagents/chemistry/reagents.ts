// Based on /tg/station's code/modules/reagents/chemistry/reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3356, "/datum/reagent", "/datum", {
	name: "Reagent",
	id: "reagent",
	description: "",
	taste_description: "metaphorical salt",
	taste_mult: 1,
	glass_name: "glass of ...what?",
	glass_desc: "You can't really tell what this is.",
	glass_icon_state: null,
	shot_glass_icon_state: null,
	holder: null,
	reagent_state: 2,
	data: null,
	current_cycle: 0,
	volume: 0,
	color: "#000000",
	can_synth: 1,
	metabolization_rate: 0.4,
	overrides_metab: 0,
	overdose_threshold: 0,
	addiction_threshold: 0,
	addiction_stage: 0,
	overdosed: 0,
});

// reagents.dm:36
rt.def("/datum/reagent/proc/Destroy", function* Destroy(f: Frame) {
	f.dot = (yield* parent_proc());
	this.holder = null;
	return f.dot;
}, true);

// reagents.dm:40
rt.def("/datum/reagent/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value) {
	let modifier: Value = null, amount: Value = null;
	method ??= TOUCH;
	show_message ??= 1;
	touch_protection ??= 0;
	if (!rt.istype(M, T("/mob/living"))) {
		return 0;
	}
	if (method == VAPOR) {
		if (M.reagents) {
			modifier = max(0, min(1 - touch_protection, 1));
			if ((amount = round(reac_volume * modifier, 0.1)) >= 0.5) {
				yield* M.reagents.add_reagent(this.id, amount);
			}
		}
	}
	return 1;
}, true);

// reagents.dm:57
rt.def("/datum/reagent/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	this.current_cycle++;
	yield* this.holder.remove_reagent(this.id, this.metabolization_rate * M.metabolism_efficiency);
	return f.dot;
}, true);

// reagents.dm:92
rt.def("/datum/reagent/proc/overdose_start", function overdose_start(f: Frame, M: Value) {
	to_chat(M, `<span class='userdanger'>You feel like you took too much of ${this.name}!</span>`);
	return f.dot;
});

// reagents.dm:96
rt.def("/datum/reagent/proc/addiction_act_stage1", function addiction_act_stage1(f: Frame, M: Value) {
	if (prob(30)) {
		to_chat(M, `<span class='notice'>You feel like some ${this.name} right about now.</span>`);
	}
	return f.dot;
});

// reagents.dm:101
rt.def("/datum/reagent/proc/addiction_act_stage2", function addiction_act_stage2(f: Frame, M: Value) {
	if (prob(30)) {
		to_chat(M, `<span class='notice'>You feel like you need ${this.name}. You just can't get enough.</span>`);
	}
	return f.dot;
});

// reagents.dm:106
rt.def("/datum/reagent/proc/addiction_act_stage3", function addiction_act_stage3(f: Frame, M: Value) {
	if (prob(30)) {
		to_chat(M, `<span class='danger'>You have an intense craving for ${this.name}.</span>`);
	}
	return f.dot;
});

// reagents.dm:111
rt.def("/datum/reagent/proc/addiction_act_stage4", function addiction_act_stage4(f: Frame, M: Value) {
	if (prob(30)) {
		to_chat(M, `<span class='boldannounce'>You're not feeling good at all! You really need some ${this.name}.</span>`);
	}
	return f.dot;
});

// reagents.dm:117
rt.def("/proc/pretty_string_from_reagent_list", function pretty_string_from_reagent_list(f: Frame, reagent_list: Value) {
	let R: Value = null;
	let result: Value = "| ";
	for (R of each(reagent_list, T("/datum/reagent"))) {
		result += `${R.name}, ${R.volume} | `;
	}
	return result;
});
