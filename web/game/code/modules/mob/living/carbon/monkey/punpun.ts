// Based on /tg/station's code/modules/mob/living/carbon/monkey/punpun.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4821, "/mob/living/carbon/monkey/punpun", "/mob/living/carbon/monkey", {
	ancestor_name: null,
	ancestor_chain: 1,
	relic_hat: null,
	relic_mask: null,
	memory_saved: 0,
	pet_monkey_names: null,
	rare_pet_monkey_names: null,
	name: "Pun Pun",
	unique_name: 0,
});

// punpun.dm:13
rt.def("/mob/living/carbon/monkey/punpun/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.Read_Memory();
	if (this.ancestor_name) {
		this.name = this.ancestor_name;
		if (this.ancestor_chain > 1) {
			this.name += fmt(" ３！", [this.ancestor_chain]);
		}
	} else {
		if (prob(5)) {
			this.name = pick(this.rare_pet_monkey_names);
		} else {
			this.name = pick(this.pet_monkey_names);
		}
		this.gender = pick("male", "female");
	}
	yield* parent_proc();
	if (this.relic_hat) {
		yield* this.equip_to_slot_or_del((yield* new_(this.relic_hat)), slot_head);
	}
	if (!this.relic_mask) return f.dot;
	yield* this.equip_to_slot_or_del((yield* new_(this.relic_mask)), slot_wear_mask);
	return f.dot;
}, true);

// punpun.dm:35
rt.def("/mob/living/carbon/monkey/punpun/proc/Life", function Life(f: Frame) {
	if (GLOB.SSticker.current_state == GAME_STATE_FINISHED && !this.memory_saved) {
		this.Write_Memory(0);
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// punpun.dm:40
rt.def("/mob/living/carbon/monkey/punpun/proc/death", function* death(f: Frame, gibbed: Value) {
	if (!this.memory_saved || gibbed) {
		this.Write_Memory(1, gibbed);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// punpun.dm:45
rt.def("/mob/living/carbon/monkey/punpun/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	this.ancestor_name = rt.input(f, rt.R.index, null, [(S = new_(T("/savefile"), "data/npc_saves/Punpun.sav")), "ancestor_name"]);
	this.ancestor_chain = rt.input(f, rt.R.index, null, [S, "ancestor_chain"]);
	this.relic_hat = rt.input(f, rt.R.index, null, [S, "relic_hat"]);
	this.relic_mask = rt.input(f, rt.R.index, null, [S, "relic_mask"]);
	return f.dot;
});

// punpun.dm:52
rt.def("/mob/living/carbon/monkey/punpun/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value, gibbed: Value) {
	let S: Value = new_(T("/savefile"), "data/npc_saves/Punpun.sav");
	if (gibbed) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "ancestor_name", null], false);
		rt.op(f, "OutputReference", [rt.R.index], [S, "ancestor_chain", 1], false);
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_hat", null], false);
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_mask", null], false);
		return f.dot;
	}
	if (dead) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "ancestor_name", this.ancestor_name], false);
		rt.op(f, "OutputReference", [rt.R.index], [S, "ancestor_chain", this.ancestor_chain + 1], false);
	}
	if (!this.ancestor_name) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "ancestor_name", this.name], false);
	}
	if (this.head) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_hat", this.head.type], false);
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_hat", null], false);
	}
	if (this.wear_mask) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_mask", this.wear_mask.type], false);
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [S, "relic_mask", null], false);
	}
	if (dead) return f.dot;
	this.memory_saved = 1;
	return f.dot;
});
