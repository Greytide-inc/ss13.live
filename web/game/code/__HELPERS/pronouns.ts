// From code/__HELPERS/pronouns.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(2, "/datum", "/", {
	gc_destroyed: null,
	active_timers: null,
	isprocessing: 0,
	var_edited: 0,
	fingerprintslast: null,
	ui_screen: "home",
	type: null,
	parent_type: null,
	vars: null,
	tag: null,
}, { tmp: ["type","parent_type","vars"] });

// /datum/proc/p_they  (code/__HELPERS/pronouns.dm:4)
rt.def("/datum/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "it";
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /datum/proc/p_their  (code/__HELPERS/pronouns.dm:9)
rt.def("/datum/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "its";
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /datum/proc/p_them  (code/__HELPERS/pronouns.dm:14)
rt.def("/datum/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "it";
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /datum/proc/p_have  (code/__HELPERS/pronouns.dm:19)
rt.def("/datum/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	f.dot = "has";
	return f.dot;
});

// /datum/proc/p_are  (code/__HELPERS/pronouns.dm:22)
rt.def("/datum/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	f.dot = "is";
	return f.dot;
});

// /datum/proc/p_were  (code/__HELPERS/pronouns.dm:25)
rt.def("/datum/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	f.dot = "was";
	return f.dot;
});

// /datum/proc/p_do  (code/__HELPERS/pronouns.dm:28)
rt.def("/datum/proc/p_do", function p_do(f: Frame, temp_gender: Value) {
	f.dot = "does";
	return f.dot;
});

// /datum/proc/p_theyve  (code/__HELPERS/pronouns.dm:31)
rt.def("/datum/proc/p_theyve", function p_theyve(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = add(add(rt.callSrc(f, "p_they", [live(capitalized), live(temp_gender)]), "'"), rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "p_have", [live(temp_gender)]), 3]));
	return f.dot;
});

// /datum/proc/p_theyre  (code/__HELPERS/pronouns.dm:34)
rt.def("/datum/proc/p_theyre", function p_theyre(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = add(add(rt.callSrc(f, "p_they", [live(capitalized), live(temp_gender)]), "'"), rt.call(f, P("/proc/copytext"), null, [rt.callSrc(f, "p_are", [live(temp_gender)]), 2]));
	return f.dot;
});

// /datum/proc/p_s  (code/__HELPERS/pronouns.dm:37)
rt.def("/datum/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	f.dot = "s";
	return f.dot;
});

// /client/proc/p_they  (code/__HELPERS/pronouns.dm:41)
rt.def("/client/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "they";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "she";
	} else if ($0 === "male") {
		f.dot = "he";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /client/proc/p_their  (code/__HELPERS/pronouns.dm:53)
rt.def("/client/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "their";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "her";
	} else if ($0 === "male") {
		f.dot = "his";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /client/proc/p_them  (code/__HELPERS/pronouns.dm:65)
rt.def("/client/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "them";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "her";
	} else if ($0 === "male") {
		f.dot = "him";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /client/proc/p_have  (code/__HELPERS/pronouns.dm:77)
rt.def("/client/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "has";
	if (!(isEqual(live(temp_gender), "plural") || isEqual(live(temp_gender), "neuter"))) return f.dot;
	f.dot = "have";
	return f.dot;
});

// /client/proc/p_are  (code/__HELPERS/pronouns.dm:84)
rt.def("/client/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "is";
	if (!(isEqual(live(temp_gender), "plural") || isEqual(live(temp_gender), "neuter"))) return f.dot;
	f.dot = "are";
	return f.dot;
});

// /client/proc/p_were  (code/__HELPERS/pronouns.dm:91)
rt.def("/client/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "was";
	if (!(isEqual(live(temp_gender), "plural") || isEqual(live(temp_gender), "neuter"))) return f.dot;
	f.dot = "were";
	return f.dot;
});

// /client/proc/p_do  (code/__HELPERS/pronouns.dm:98)
rt.def("/client/proc/p_do", function p_do(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "does";
	if (!(isEqual(live(temp_gender), "plural") || isEqual(live(temp_gender), "neuter"))) return f.dot;
	f.dot = "do";
	return f.dot;
});

// /client/proc/p_s  (code/__HELPERS/pronouns.dm:105)
rt.def("/client/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	if (!(!isEqual(live(temp_gender), "plural") && !isEqual(live(temp_gender), "neuter"))) return f.dot;
	f.dot = "s";
	return f.dot;
});

// /mob/proc/p_they  (code/__HELPERS/pronouns.dm:112)
rt.def("/mob/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "it";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "she";
	} else if ($0 === "male") {
		f.dot = "he";
	} else if ($0 === "plural") {
		f.dot = "they";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /mob/proc/p_their  (code/__HELPERS/pronouns.dm:126)
rt.def("/mob/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "its";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "her";
	} else if ($0 === "male") {
		f.dot = "his";
	} else if ($0 === "plural") {
		f.dot = "their";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /mob/proc/p_them  (code/__HELPERS/pronouns.dm:140)
rt.def("/mob/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	let $0: any;
	f.vars = () => [temp_gender, $0];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "it";
	$0 = live(temp_gender);
	if ($0 === "female") {
		f.dot = "her";
	} else if ($0 === "male") {
		f.dot = "him";
	} else if ($0 === "plural") {
		f.dot = "them";
	}
	if (!truthy(live(capitalized))) return f.dot;
	f.dot = rt.call(f, P("/proc/capitalize"), null, [live(f.dot)]);
	return f.dot;
});

// /mob/proc/p_have  (code/__HELPERS/pronouns.dm:154)
rt.def("/mob/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "has";
	if (!isEqual(live(temp_gender), "plural")) return f.dot;
	f.dot = "have";
	return f.dot;
});

// /mob/proc/p_are  (code/__HELPERS/pronouns.dm:161)
rt.def("/mob/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "is";
	if (!isEqual(live(temp_gender), "plural")) return f.dot;
	f.dot = "are";
	return f.dot;
});

// /mob/proc/p_were  (code/__HELPERS/pronouns.dm:168)
rt.def("/mob/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "was";
	if (!isEqual(live(temp_gender), "plural")) return f.dot;
	f.dot = "were";
	return f.dot;
});

// /mob/proc/p_do  (code/__HELPERS/pronouns.dm:175)
rt.def("/mob/proc/p_do", function p_do(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	f.dot = "does";
	if (!isEqual(live(temp_gender), "plural")) return f.dot;
	f.dot = "do";
	return f.dot;
});

// /mob/proc/p_s  (code/__HELPERS/pronouns.dm:182)
rt.def("/mob/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	f.vars = () => [temp_gender];
	if (!truthy(live(temp_gender))) {
		temp_gender = rt.sv(f, "gender");
	}
	if (isEqual(live(temp_gender), "plural")) return f.dot;
	f.dot = "s";
	return f.dot;
});

// /mob/living/carbon/human/proc/p_they  (code/__HELPERS/pronouns.dm:189)
rt.def("/mob/living/carbon/human/proc/p_they", function p_they(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[1] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["capitalized", "temp_gender"] });

// /mob/living/carbon/human/proc/p_their  (code/__HELPERS/pronouns.dm:196)
rt.def("/mob/living/carbon/human/proc/p_their", function p_their(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[1] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["capitalized", "temp_gender"] });

// /mob/living/carbon/human/proc/p_them  (code/__HELPERS/pronouns.dm:203)
rt.def("/mob/living/carbon/human/proc/p_them", function p_them(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[1] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["capitalized", "temp_gender"] });

// /mob/living/carbon/human/proc/p_have  (code/__HELPERS/pronouns.dm:210)
rt.def("/mob/living/carbon/human/proc/p_have", function p_have(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[0] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["temp_gender"] });

// /mob/living/carbon/human/proc/p_are  (code/__HELPERS/pronouns.dm:217)
rt.def("/mob/living/carbon/human/proc/p_are", function p_are(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[0] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["temp_gender"] });

// /mob/living/carbon/human/proc/p_were  (code/__HELPERS/pronouns.dm:224)
rt.def("/mob/living/carbon/human/proc/p_were", function p_were(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[0] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["temp_gender"] });

// /mob/living/carbon/human/proc/p_do  (code/__HELPERS/pronouns.dm:231)
rt.def("/mob/living/carbon/human/proc/p_do", function p_do(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[0] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["temp_gender"] });

// /mob/living/carbon/human/proc/p_s  (code/__HELPERS/pronouns.dm:238)
rt.def("/mob/living/carbon/human/proc/p_s", function p_s(f: Frame) {
	let obscured: Value = null, skipface: Value = null;
	f.vars = () => [obscured, skipface];
	obscured = rt.callSrc(f, "check_obscured_slots", []);
	skipface = ((rt.sv(f, "wear_mask") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "wear_mask")), 128)) || (rt.sv(f, "head") && rt.bitAnd(rt.fv(f, "flags_inv", rt.sv(f, "head")), 128)));
	if ((truthy((rt.isIn(f, 14, live(obscured)) ? 1 : 0)) && truthy(live(skipface)))) {
		f.args[0] = "plural";
	}
	return rt.callSuper(f, [], rt.Args.Same);
}, false, { args: ["temp_gender"] });
