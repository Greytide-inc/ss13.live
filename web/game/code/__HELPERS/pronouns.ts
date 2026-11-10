// Based on /tg/station's code/__HELPERS/pronouns.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";



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

// pronouns.dm:4
rt.def("/datum/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "it";
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:9
rt.def("/datum/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "its";
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:14
rt.def("/datum/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = "it";
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:19
rt.def("/datum/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	f.dot = "has";
	return f.dot;
});

// pronouns.dm:22
rt.def("/datum/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	f.dot = "is";
	return f.dot;
});

// pronouns.dm:25
rt.def("/datum/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	f.dot = "was";
	return f.dot;
});

// pronouns.dm:31
rt.def("/datum/proc/p_theyve", function p_theyve(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = this.p_they(capitalized, temp_gender) + "'" + copytext(this.p_have(temp_gender), 3);
	return f.dot;
});

// pronouns.dm:34
rt.def("/datum/proc/p_theyre", function p_theyre(f: Frame, capitalized: Value, temp_gender: Value) {
	f.dot = this.p_they(capitalized, temp_gender) + "'" + copytext(this.p_are(temp_gender), 2);
	return f.dot;
});

// pronouns.dm:37
rt.def("/datum/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	f.dot = "s";
	return f.dot;
});

// pronouns.dm:41
rt.def("/client/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "they";
	if (temp_gender === "female") {
		f.dot = "she";
	} else if (temp_gender === "male") {
		f.dot = "he";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:53
rt.def("/client/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "their";
	if (temp_gender === "female") {
		f.dot = "her";
	} else if (temp_gender === "male") {
		f.dot = "his";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:65
rt.def("/client/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "them";
	if (temp_gender === "female") {
		f.dot = "her";
	} else if (temp_gender === "male") {
		f.dot = "him";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:77
rt.def("/client/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "has";
	if (!(temp_gender == "plural" || temp_gender == "neuter")) return f.dot;
	f.dot = "have";
	return f.dot;
});

// pronouns.dm:84
rt.def("/client/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "is";
	if (!(temp_gender == "plural" || temp_gender == "neuter")) return f.dot;
	f.dot = "are";
	return f.dot;
});

// pronouns.dm:91
rt.def("/client/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "was";
	if (!(temp_gender == "plural" || temp_gender == "neuter")) return f.dot;
	f.dot = "were";
	return f.dot;
});

// pronouns.dm:105
rt.def("/client/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	if (!(temp_gender != "plural" && temp_gender != "neuter")) return f.dot;
	f.dot = "s";
	return f.dot;
});

// pronouns.dm:112
rt.def("/mob/proc/p_they", function p_they(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "it";
	if (temp_gender === "female") {
		f.dot = "she";
	} else if (temp_gender === "male") {
		f.dot = "he";
	} else if (temp_gender === "plural") {
		f.dot = "they";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:126
rt.def("/mob/proc/p_their", function p_their(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "its";
	if (temp_gender === "female") {
		f.dot = "her";
	} else if (temp_gender === "male") {
		f.dot = "his";
	} else if (temp_gender === "plural") {
		f.dot = "their";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:140
rt.def("/mob/proc/p_them", function p_them(f: Frame, capitalized: Value, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "it";
	if (temp_gender === "female") {
		f.dot = "her";
	} else if (temp_gender === "male") {
		f.dot = "him";
	} else if (temp_gender === "plural") {
		f.dot = "them";
	}
	if (!capitalized) return f.dot;
	f.dot = capitalize(f.dot);
	return f.dot;
});

// pronouns.dm:154
rt.def("/mob/proc/p_have", function p_have(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "has";
	if (temp_gender != "plural") return f.dot;
	f.dot = "have";
	return f.dot;
});

// pronouns.dm:161
rt.def("/mob/proc/p_are", function p_are(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "is";
	if (temp_gender != "plural") return f.dot;
	f.dot = "are";
	return f.dot;
});

// pronouns.dm:168
rt.def("/mob/proc/p_were", function p_were(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	f.dot = "was";
	if (temp_gender != "plural") return f.dot;
	f.dot = "were";
	return f.dot;
});

// pronouns.dm:182
rt.def("/mob/proc/p_s", function p_s(f: Frame, temp_gender: Value) {
	if (!temp_gender) {
		temp_gender = this.gender;
	}
	if (temp_gender == "plural") return f.dot;
	f.dot = "s";
	return f.dot;
});

// pronouns.dm:189
rt.def("/mob/living/carbon/human/proc/p_they", function p_they(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[1] = "plural";
	}
	return parent_proc();
}, false, { args: ["capitalized", "temp_gender"] });

// pronouns.dm:196
rt.def("/mob/living/carbon/human/proc/p_their", function p_their(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[1] = "plural";
	}
	return parent_proc();
}, false, { args: ["capitalized", "temp_gender"] });

// pronouns.dm:203
rt.def("/mob/living/carbon/human/proc/p_them", function p_them(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[1] = "plural";
	}
	return parent_proc();
}, false, { args: ["capitalized", "temp_gender"] });

// pronouns.dm:210
rt.def("/mob/living/carbon/human/proc/p_have", function p_have(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[0] = "plural";
	}
	return parent_proc();
}, false, { args: ["temp_gender"] });

// pronouns.dm:217
rt.def("/mob/living/carbon/human/proc/p_are", function p_are(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[0] = "plural";
	}
	return parent_proc();
}, false, { args: ["temp_gender"] });

// pronouns.dm:224
rt.def("/mob/living/carbon/human/proc/p_were", function p_were(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[0] = "plural";
	}
	return parent_proc();
}, false, { args: ["temp_gender"] });

// pronouns.dm:238
rt.def("/mob/living/carbon/human/proc/p_s", function p_s(f: Frame) {
	let obscured: Value = this.check_obscured_slots();
	let skipface: Value = ((this.wear_mask && rt.bitAnd(this.wear_mask.flags_inv, HIDEFACE)) || (this.head && rt.bitAnd(this.head.flags_inv, HIDEFACE)));
	if (rt.isIn(f, slot_w_uniform, obscured) && skipface) {
		f.args[0] = "plural";
	}
	return parent_proc();
}, false, { args: ["temp_gender"] });
