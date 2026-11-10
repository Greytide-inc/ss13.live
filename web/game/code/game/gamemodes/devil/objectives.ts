// Based on /tg/station's code/game/gamemodes/devil/objectives.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(1135, "/datum/objective/devil/soulquantity", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL1",
	target_amount: 4,
});

// objectives.dm:9
rt.def("/datum/objective/devil/soulquantity/proc/New", function New(f: Frame) {
	this.target_amount = pick(6, 7, 8);
	this.update_explanation_text();
	return f.dot;
});

// objectives.dm:13
rt.def("/datum/objective/devil/soulquantity/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	this.explanation_text = `Purchase, and retain control over at least ${this.target_amount} souls.`;
	return f.dot;
});

// objectives.dm:17
rt.def("/datum/objective/devil/soulquantity/proc/check_completion", function check_completion(f: Frame) {
	let S: Value = null, L: Value = null;
	let count: Value = 0;
	let devilDatum: Value = this.owner.has_antag_datum(T("/datum/antagonist/devil"));
	let souls: Value = devilDatum.soulsOwned;
	for (S of each(souls)) {
		if ((L = S).soulOwner == this.owner) {
			count++;
		}
	}
	return (count >= this.target_amount ? 1 : 0);
});

rt.type(1136, "/datum/objective/devil/soulquality", "/datum/objective/devil", {
	contractType: null,
	contractName: null,
	explanation_text: "You shouldn't see this text.  Error:DEVIL2",
});

// objectives.dm:33
rt.def("/datum/objective/devil/soulquality/proc/New", function New(f: Frame) {
	this.contractType = pick("power", "wealth", "prestige", "magic", "revive", "knowledge");
	this.target_amount = pick(1, 2);
	if (this.contractType === "power") {
		this.contractName = "for power";
	} else if (this.contractType === "wealth") {
		this.contractName = "for wealth";
	} else if (this.contractType === "prestige") {
		this.contractName = "for prestige";
	} else if (this.contractType === "magic") {
		this.contractName = "for magic";
	} else if (this.contractType === "revive") {
		this.contractName = "of revival";
	} else if (this.contractType === "knowledge") {
		this.contractName = "for knowledge";
	}
	this.update_explanation_text();
	return f.dot;
});

// objectives.dm:53
rt.def("/datum/objective/devil/soulquality/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	this.explanation_text = `Have mortals sign at least ${this.target_amount} contracts ${this.contractName}`;
	return f.dot;
});

// objectives.dm:57
rt.def("/datum/objective/devil/soulquality/proc/check_completion", function check_completion(f: Frame) {
	let S: Value = null, L: Value = null;
	let count: Value = 0;
	let devilDatum: Value = this.owner.has_antag_datum(T("/datum/antagonist/devil"));
	let souls: Value = devilDatum.soulsOwned;
	for (S of each(souls)) {
		if (!(L = S).owns_soul() && L.damnation_type == this.contractType) {
			count++;
		}
	}
	return (count >= this.target_amount ? 1 : 0);
});

rt.type(1137, "/datum/objective/devil/sintouch", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL3",
});

// objectives.dm:71
rt.def("/datum/objective/devil/sintouch/proc/New", function New(f: Frame) {
	this.target_amount = pick(4, 5);
	this.explanation_text = `Ensure at least ${this.target_amount} mortals are sintouched.`;
	return f.dot;
});

// objectives.dm:75
rt.def("/datum/objective/devil/sintouch/proc/check_completion", function check_completion(f: Frame) {
	return (this.target_amount >= rt.len(f, GLOB.SSticker.mode.sintouched) ? 1 : 0);
});

rt.type(1138, "/datum/objective/devil/buy_target", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL4",
});

// objectives.dm:84
rt.def("/datum/objective/devil/buy_target/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	if (this.target) {
		this.explanation_text = `Purchase and retain the soul of ${this.target.name}, the ${this.target.assigned_role}.`;
	} else {
		this.explanation_text = "Free objective.";
	}
	return f.dot;
});

// objectives.dm:89
rt.def("/datum/objective/devil/buy_target/proc/check_completion", function check_completion(f: Frame) {
	return (this.target.soulOwner == this.owner ? 1 : 0);
});

rt.type(1139, "/datum/objective/devil/outsell", "/datum/objective/devil", {
	explanation_text: "You shouldn't see this text.  Error:DEVIL5",
});

// Empty in tg.
rt.def("/datum/objective/devil/outsell/proc/New");

// objectives.dm:98
rt.def("/datum/objective/devil/outsell/proc/update_explanation_text", function update_explanation_text(f: Frame) {
	let opponent: Value = null;
	this.explanation_text = `Purchase and retain control over more souls than ${(opponent = this.target.has_antag_datum(T("/datum/antagonist/devil"))).truename}, known to mortals as ${this.target.name}, the ${this.target.assigned_role}.`;
	return f.dot;
});

// objectives.dm:103
rt.def("/datum/objective/devil/outsell/proc/check_completion", function check_completion(f: Frame) {
	let S: Value = null, L: Value = null, S_4: Value = null, L_5: Value = null;
	let selfcount: Value = 0;
	let devilDatum: Value = this.owner.has_antag_datum(T("/datum/antagonist/devil"));
	let souls: Value = devilDatum.soulsOwned;
	for (S of each(souls)) {
		if ((L = S).soulOwner == this.owner) {
			selfcount++;
		}
	}
	let targetcount: Value = 0;
	souls = (devilDatum = this.target.has_antag_datum(T("/datum/antagonist/devil"))).soulsOwned;
	for (S_4 of each(souls)) {
		if ((L_5 = S_4).soulOwner == this.target) {
			targetcount++;
		}
	}
	return (selfcount > targetcount ? 1 : 0);
});
