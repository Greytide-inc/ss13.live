// Based on /tg/station's code/modules/mob/living/carbon/human/emote.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(507, "/datum/emote/living/carbon/human", "/datum/emote/living/carbon", {
	mob_type_allowed_typecache: null,
});

// emote.dm:2
rt.def("/datum/emote/living/carbon/human/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mob_type_allowed_typecache = list(T("/mob/living/carbon/human"));
	return f.dot;
});

rt.type(519, "/datum/emote/living/carbon/human/wag", "/datum/emote/living/carbon/human", {
	key: "wag",
	key_third_person: "wags",
	message: "wags their tail.",
});

// emote.dm:76
rt.def("/datum/emote/living/carbon/human/wag/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	let H: Value = user;
	if (f.dot) {
		yield* H.startTailWag();
	} else {
		yield* H.endTailWag();
	}
	return f.dot;
}, true);

// emote.dm:84
rt.def("/datum/emote/living/carbon/human/wag/proc/can_run_emote", function can_run_emote(f: Frame, user: Value) {
	let H: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if (!((H = user).dna && H.dna.species && (rt.isIn(f, "tail_lizard", H.dna.species.mutant_bodyparts) || rt.index(H.dna.features, "tail_human") != "None"))) return f.dot;
	return 1;
}, false);

// emote.dm:91
rt.def("/datum/emote/living/carbon/human/wag/proc/select_message_type", function select_message_type(f: Frame, user: Value) {
	f.dot = parent_proc();
	let H: Value = user;
	if (!(rt.isIn(f, "waggingtail_lizard", H.dna.species.mutant_bodyparts) || rt.isIn(f, "waggingtail_human", H.dna.species.mutant_bodyparts))) return f.dot;
	f.dot = null;
	return f.dot;
}, false);

rt.type(520, "/datum/emote/living/carbon/human/wing", "/datum/emote/living/carbon/human", {
	key: "wing",
	key_third_person: "wings",
	message: "their wings.",
});

// emote.dm:102
rt.def("/datum/emote/living/carbon/human/wing/proc/run_emote", function* run_emote(f: Frame, user: Value, params: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	let H: Value = user;
	if (findtext(this.select_message_type(user), "open")) {
		yield* H.OpenWings();
	} else {
		yield* H.CloseWings();
	}
	return f.dot;
}, true);

// emote.dm:111
rt.def("/datum/emote/living/carbon/human/wing/proc/select_message_type", function select_message_type(f: Frame, user: Value) {
	f.dot = parent_proc();
	let H: Value = user;
	if (rt.isIn(f, "wings", H.dna.species.mutant_bodyparts)) {
		f.dot = "opens " + rt.sv(f, "message");
	} else {
		f.dot = "closes " + rt.sv(f, "message");
	}
	return f.dot;
}, false);

// emote.dm:119
rt.def("/datum/emote/living/carbon/human/wing/proc/can_run_emote", function can_run_emote(f: Frame, user: Value) {
	let H: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	if (!((H = user).dna && H.dna.species && rt.index(H.dna.features, "wings") != "None")) return f.dot;
	return 1;
}, false);

// emote.dm:127
rt.def("/mob/living/carbon/human/proc/startTailWag", function* startTailWag(f: Frame) {
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, "tail_lizard", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "tail_lizard";
		this.dna.species.mutant_bodyparts -= "spines";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "waggingtail_lizard", rt.bitOr));
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "waggingspines", rt.bitOr));
	}
	if (rt.isIn(f, "tail_human", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "tail_human";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "waggingtail_human", rt.bitOr));
	}
	yield* this.update_body();
	return f.dot;
}, true);

// emote.dm:141
rt.def("/mob/living/carbon/human/proc/endTailWag", function* endTailWag(f: Frame) {
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, "waggingtail_lizard", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "waggingtail_lizard";
		this.dna.species.mutant_bodyparts -= "waggingspines";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "tail_lizard", rt.bitOr));
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "spines", rt.bitOr));
	}
	if (rt.isIn(f, "waggingtail_human", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "waggingtail_human";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "tail_human", rt.bitOr));
	}
	yield* this.update_body();
	return f.dot;
}, true);

// emote.dm:154
rt.def("/mob/living/carbon/human/proc/OpenWings", function* OpenWings(f: Frame) {
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, "wings", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "wings";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "wingsopen", rt.bitOr));
	}
	yield* this.update_body();
	return f.dot;
}, true);

// emote.dm:162
rt.def("/mob/living/carbon/human/proc/CloseWings", function* CloseWings(f: Frame) {
	let _T: Value = null;
	if (!this.dna || !this.dna.species) {
		return f.dot;
	}
	if (rt.isIn(f, "wingsopen", this.dna.species.mutant_bodyparts)) {
		this.dna.species.mutant_bodyparts -= "wingsopen";
		(rt.modField(f, this.dna.species, "mutant_bodyparts", "wings", rt.bitOr));
	}
	yield* this.update_body();
	if (!isturf(this.loc)) return f.dot;
	yield* (_T = this.loc).Entered(this);
	return f.dot;
}, true);
