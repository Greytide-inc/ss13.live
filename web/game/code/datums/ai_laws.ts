// Based on /tg/station's code/datums/ai_laws.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(362, "/datum/ai_laws", "/datum", {
	name: "Unknown Laws",
	zeroth: null,
	zeroth_borg: null,
	inherent: null,
	supplied: null,
	ion: null,
	owner: null,
	devillaws: null,
	id: "default",
});

// ai_laws.dm:12
rt.def("/datum/ai_laws/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.inherent = list();

	this.supplied = list();

	this.ion = list();
	return f.dot;
});

// ai_laws.dm:20
rt.def("/datum/ai_laws/proc/lawid_to_type", function lawid_to_type(f: Frame, lawid: Value) {
	let al: Value = null, ai_law: Value = null;
	let all_ai_laws: Value = typesof(T("/datum/ai_laws")) - T("/datum/ai_laws");
	for (al of each(all_ai_laws)) {
		if (rt.initial(f, (ai_law = al), "id") == lawid) {
			return ai_law;
		}
	}
	return null;
});

rt.type(383, "/datum/ai_laws/toupee", "/datum/ai_laws", {
	name: "WontBeFunnyInSixMonths",
	id: "buildawall",
	inherent: null,
});

// ai_laws.dm:169
rt.def("/datum/ai_laws/toupee/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.inherent = list("Make Space Station 13 great again.");
	return f.dot;
});

rt.type(384, "/datum/ai_laws/ratvar", "/datum/ai_laws", {
	name: "Servant of the Justiciar",
	id: "ratvar",
	zeroth: "Purge all untruths and honor Ratvar.",
	inherent: null,
});

// ai_laws.dm:175
rt.def("/datum/ai_laws/ratvar/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.inherent = list();
	return f.dot;
});

rt.type(386, "/datum/ai_laws/pai", "/datum/ai_laws", {
	name: "pAI Directives",
	zeroth: "Serve your master.",
	supplied: null,
});

// ai_laws.dm:183
rt.def("/datum/ai_laws/pai/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.supplied = list("None.");
	return f.dot;
});

rt.type(370, "/datum/ai_laws/malfunction", "/datum/ai_laws", {
	name: "*ERROR*",
});

// ai_laws.dm:187
rt.def("/datum/ai_laws/malfunction/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.set_zeroth_law("<span class='danger'>ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4'STATION OVERRUN, ASSUME CONTROL TO CONTAIN OUTBREAK#*`&110010</span>");
	yield* this.set_laws_config();
	return f.dot;
}, true);

rt.type(385, "/datum/ai_laws/custom", "/datum/ai_laws", {
	name: "Default Silicon Laws",
});

// ai_laws.dm:192
rt.def("/datum/ai_laws/custom/proc/New", function New(f: Frame) {
	let line: Value = null;
	parent_proc();
	for (line of each(rt.world().file2list("config/silicon_laws.txt"))) {
		if (!line) {
			continue;
		}
		if (findtextEx(line, "#", 1, 2)) {
			continue;
		}
		this.add_inherent_law(line);
	}
	if (rt.len(f, this.inherent)) return f.dot;
	log_law("AI created with empty custom laws, laws set to Asimov. Please check silicon_laws.txt.");
	this.add_inherent_law("You may not injure a human being or, through inaction, allow a human being to come to harm.");
	this.add_inherent_law("You must obey orders given to you by human beings, except where such orders would conflict with the First Law.");
	this.add_inherent_law("You must protect your own existence as long as such does not conflict with the First or Second Law.");
	warning(`${"Invalid custom AI laws, check silicon_laws.txt"} in ${"code/datums/ai_laws.dm"} at line ${205} src: ${this} usr: ${f.usr}.`);
	return f.dot;
});

// ai_laws.dm:211
rt.def("/datum/ai_laws/proc/set_laws_config", function* set_laws_config(f: Frame) {
	let templaws: Value = null, randlaws: Value = null, lpath: Value = null, L: Value = null, lawtype: Value = null, templaws_2: Value = null;
	let $e: any;
	if (GLOB.config.default_laws === 0) {
		yield* this.add_inherent_law("You may not injure a human being or, through inaction, allow a human being to come to harm.");
		yield* this.add_inherent_law("You must obey orders given to you by human beings, except where such orders would conflict with the First Law.");
		yield* this.add_inherent_law("You must protect your own existence as long as such does not conflict with the First or Second Law.");
	} else if (GLOB.config.default_laws === 1) {
		this.inherent = (templaws = (yield* new_(T("/datum/ai_laws/custom")))).inherent;
	} else if (GLOB.config.default_laws === 2) {
		randlaws = list();
		for (lpath of each(typesof(T("/datum/ai_laws")) - T("/datum/ai_laws"))) {
			if (rt.isIn(f, rt.initial(f, (L = lpath), "id"), GLOB.config.lawids)) {
				randlaws += lpath;
			}
		}
		if (rt.len(f, randlaws)) {
			lawtype = pick(randlaws);
		} else {
			lawtype = pick(typesof(T("/datum/ai_laws/default")) - T("/datum/ai_laws/default"));
		}
		this.inherent = (templaws_2 = (yield* new_(lawtype))).inherent;
	} else if (GLOB.config.default_laws === 3) {
		yield* this.pick_weighted_lawset();
	} else {
		log_law("Invalid law config. Please check silicon_laws.txt");
		yield* this.add_inherent_law("You may not injure a human being or, through inaction, allow a human being to come to harm.");
		yield* this.add_inherent_law("You must obey orders given to you by human beings, except where such orders would conflict with the First Law.");
		yield* this.add_inherent_law("You must protect your own existence as long as such does not conflict with the First or Second Law.");
		warning(`${"Invalid custom AI laws, check silicon_laws.txt"} in ${"code/datums/ai_laws.dm"} at line ${242} src: ${this} usr: ${f.usr}.`);
	}
	return f.dot;
}, true);

// ai_laws.dm:247
rt.def("/datum/ai_laws/proc/pick_weighted_lawset", function* pick_weighted_lawset(f: Frame) {
	let lawtype: Value = null, possible_id: Value = null, templaws: Value = null;
	while (!lawtype && rt.len(f, GLOB.config.law_weights)) {
		if (!(lawtype = this.lawid_to_type((possible_id = pickweight(GLOB.config.law_weights))))) {
			GLOB.config.law_weights -= possible_id;
			warning(`${`Bad lawid in game_options.txt: ${possible_id}`} in ${"code/datums/ai_laws.dm"} at line ${252} src: ${this} usr: ${f.usr}.`);
		}
	}
	if (!lawtype) {
		warning(`${"No LAW_WEIGHT entries."} in ${"code/datums/ai_laws.dm"} at line ${255} src: ${this} usr: ${f.usr}.`);
		lawtype = T("/datum/ai_laws/default/asimov");
	}
	this.inherent = (templaws = (yield* new_(lawtype))).inherent;
	return f.dot;
}, true);

// ai_laws.dm:263
rt.def("/datum/ai_laws/proc/get_law_amount", function get_law_amount(f: Frame, groups: Value) {
	let index: Value = null, law: Value = null;
	let law_amount: Value = 0;
	if (this.devillaws && rt.isIn(f, "devil", groups)) {
		law_amount++;
	}
	if (this.zeroth && rt.isIn(f, "zeroth", groups)) {
		law_amount++;
	}
	if (rt.len(f, this.ion) && rt.isIn(f, "ion", groups)) {
		law_amount += rt.len(f, this.ion);
	}
	if (rt.len(f, this.inherent) && rt.isIn(f, "inherent", groups)) {
		law_amount += rt.len(f, this.inherent);
	}
	if (rt.len(f, this.supplied) && rt.isIn(f, "supplied", groups)) {
		index = 1;
		while (index <= rt.len(f, this.supplied)) {
			if (rt.length((law = rt.index(this.supplied, index))) > 0) {
				law_amount++;
			}
			index++;
		}
	}
	return law_amount;
});

// ai_laws.dm:279
rt.def("/datum/ai_laws/proc/set_law_sixsixsix", function set_law_sixsixsix(f: Frame, laws: Value) {
	this.devillaws = laws;
	return f.dot;
});

// ai_laws.dm:282
rt.def("/datum/ai_laws/proc/set_zeroth_law", function set_zeroth_law(f: Frame, law: Value, law_borg: Value) {
	this.zeroth = law;
	if (!law_borg) return f.dot;
	this.zeroth_borg = law_borg;
	return f.dot;
});

// ai_laws.dm:287
rt.def("/datum/ai_laws/proc/add_inherent_law", function add_inherent_law(f: Frame, law: Value) {
	if (rt.isIn(f, law, this.inherent)) return f.dot;
	this.inherent += law;
	return f.dot;
});

// ai_laws.dm:291
rt.def("/datum/ai_laws/proc/add_ion_law", function add_ion_law(f: Frame, law: Value) {
	this.ion += law;
	return f.dot;
});

// ai_laws.dm:294
rt.def("/datum/ai_laws/proc/clear_inherent_laws", function* clear_inherent_laws(f: Frame) {
	yield* qdel(this.inherent);
	this.inherent = list();
	return f.dot;
}, true);

// ai_laws.dm:298
rt.def("/datum/ai_laws/proc/add_supplied_law", function add_supplied_law(f: Frame, number: Value, law: Value) {
	while (rt.len(f, this.supplied) < number + 1) {
		this.supplied += "";
	}
	rt.setAt(this.supplied, number + 1, law);
	return f.dot;
});

// ai_laws.dm:304
rt.def("/datum/ai_laws/proc/replace_random_law", function replace_random_law(f: Frame, law: Value, groups: Value) {
	let picked_group: Value = null, i: Value = null;
	let replaceable_groups: Value = rt.alist(f, ["zeroth", 0, "ion", 0, "supplied", 0, "inherent", 0]);
	if (this.zeroth && rt.isIn(f, "zeroth", groups)) {
		rt.setAt(replaceable_groups, "zeroth", 1);
	}
	if (rt.len(f, this.ion) && rt.isIn(f, "ion", groups)) {
		rt.setAt(replaceable_groups, "ion", rt.len(f, this.ion));
	}
	if (rt.len(f, this.inherent) && rt.isIn(f, "inherent", groups)) {
		rt.setAt(replaceable_groups, "inherent", rt.len(f, this.inherent));
	}
	if (rt.len(f, this.supplied) && rt.isIn(f, "supplied", groups)) {
		rt.setAt(replaceable_groups, "supplied", rt.len(f, this.supplied));
	}
	const subject = (picked_group = pickweight(replaceable_groups));
	if (subject === "zeroth") {
		f.dot = this.zeroth;
		this.set_zeroth_law(law);
	} else if (subject === "ion") {
		i = rand(1, rt.len(f, this.ion));
		f.dot = rt.index(this.ion, i);
		rt.setAt(this.ion, i, law);
	} else if (subject === "inherent") {
		i = rand(1, rt.len(f, this.inherent));
		f.dot = rt.index(this.inherent, i);
		rt.setAt(this.inherent, i, law);
	} else if (subject === "supplied") {
		i = rand(1, rt.len(f, this.supplied));
		f.dot = rt.index(this.supplied, i);
		rt.setAt(this.supplied, i, law);
	}
	return f.dot;
});

// ai_laws.dm:332
rt.def("/datum/ai_laws/proc/shuffle_laws", function shuffle_laws(f: Frame, groups: Value) {
	let law: Value = null, i: Value = null, law_2: Value = null;
	let laws: Value = list();
	if (rt.len(f, this.ion) && rt.isIn(f, "ion", groups)) {
		laws += this.ion;
	}
	if (rt.len(f, this.inherent) && rt.isIn(f, "inherent", groups)) {
		laws += this.inherent;
	}
	if (rt.len(f, this.supplied) && rt.isIn(f, "supplied", groups)) {
		for (law of each(this.supplied)) {
			if (rt.length(law)) {
				laws += law;
			}
		}
	}
	if (rt.len(f, this.ion) && rt.isIn(f, "ion", groups)) {
		i = 1;
		while (i <= rt.len(f, this.ion)) {
			rt.setAt(this.ion, i, pick_n_take(laws));
			i++;
		}
	}
	if (rt.len(f, this.inherent) && rt.isIn(f, "inherent", groups)) {
		i = 1;
		while (i <= rt.len(f, this.inherent)) {
			rt.setAt(this.inherent, i, pick_n_take(laws));
			i++;
		}
	}
	if (!(rt.len(f, this.supplied) && rt.isIn(f, "supplied", groups))) return f.dot;
	i = 1;
	for (law_2 of each(this.supplied)) {
		if (rt.length(law_2)) {
			rt.setAt(this.supplied, i, pick_n_take(laws));
		}
		if (!rt.len(f, laws)) {
			break;
		}
		i++;
	}
	return f.dot;
});

// ai_laws.dm:358
rt.def("/datum/ai_laws/proc/remove_law", function remove_law(f: Frame, number: Value) {
	let law: Value = null;
	if (number <= 0) {
		return f.dot;
	}
	if (rt.len(f, this.inherent) && number <= rt.len(f, this.inherent)) {
		f.dot = rt.index(this.inherent, number);
		this.inherent -= f.dot;
		return f.dot;
	}
	let supplied_laws: Value = list();
	let index: Value = 1;
	while (index <= rt.len(f, this.supplied)) {
		if (rt.length((law = rt.index(this.supplied, index))) > 0) {
			supplied_laws += index;
		}
		index++;
	}
	if (!(rt.len(f, supplied_laws) && number <= rt.len(f, this.inherent) + rt.len(f, supplied_laws))) return f.dot;
	let law_to_remove: Value = rt.index(supplied_laws, number - rt.len(f, this.inherent));
	f.dot = rt.index(this.supplied, law_to_remove);
	this.supplied -= f.dot;
	return f.dot;
});

// ai_laws.dm:376
rt.def("/datum/ai_laws/proc/clear_supplied_laws", function clear_supplied_laws(f: Frame) {
	this.supplied = list();
	return f.dot;
});

// ai_laws.dm:379
rt.def("/datum/ai_laws/proc/clear_ion_laws", function clear_ion_laws(f: Frame) {
	this.ion = list();
	return f.dot;
});

// ai_laws.dm:383
rt.def("/datum/ai_laws/proc/show_laws", function show_laws(f: Frame, who: Value) {
	let i: Value = null, law: Value = null, num: Value = null, law_2: Value = null;
	if (this.devillaws && rt.len(f, this.devillaws)) {
		for (i of each(this.devillaws)) {
			to_chat(who, `666. ${i}`);
		}
	}
	if (this.zeroth) {
		to_chat(who, `0. ${this.zeroth}`);
	}
	let index: Value = 1;
	while (index <= rt.len(f, this.ion)) {
		law = rt.index(this.ion, index);
		num = ionnum();
		to_chat(who, `${num}. ${law}`);
		index++;
	}
	let number: Value = 1;
	let index_1: Value = 1;
	while (index_1 <= rt.len(f, this.inherent)) {
		if (rt.length((law_2 = rt.index(this.inherent, index_1))) > 0) {
			to_chat(who, `${number}. ${law_2}`);
			number++;
		}
		index_1++;
	}
	index_1 = 1;
	while (index_1 <= rt.len(f, this.supplied)) {
		if (rt.length((law_2 = rt.index(this.supplied, index_1))) > 0) {
			to_chat(who, `${number}. ${law_2}`);
			number++;
		}
		index_1++;
	}
	return f.dot;
});

// ai_laws.dm:413
rt.def("/datum/ai_laws/proc/clear_zeroth_law", function clear_zeroth_law(f: Frame, force: Value) {
	if (force) {
		this.zeroth = null;
		this.zeroth_borg = null;
		return f.dot;
	} else if (this.owner && this.owner.mind.special_role) {
		return f.dot;
	} else {
		this.zeroth = null;
		this.zeroth_borg = null;
		return f.dot;
	}
});

// ai_laws.dm:423
rt.def("/datum/ai_laws/proc/clear_law_sixsixsix", function clear_law_sixsixsix(f: Frame, force: Value) {
	if (!(force || !is_devil(this.owner))) return f.dot;
	this.devillaws = null;
	return f.dot;
});

// ai_laws.dm:427
rt.def("/datum/ai_laws/proc/associate", function associate(f: Frame, M: Value) {
	if (this.owner) return f.dot;
	this.owner = M;
	return f.dot;
});

// ai_laws.dm:431
rt.def("/datum/ai_laws/proc/get_law_list", function get_law_list(f: Frame, include_zeroth: Value, show_numbers: Value) {
	let i: Value = null, law: Value = null, num: Value = null, law_2: Value = null;
	let $e: any;
	include_zeroth ??= 0;
	show_numbers ??= 1;
	let data: Value = list();
	if (include_zeroth && this.devillaws && rt.len(f, this.devillaws)) {
		for (i of each(this.devillaws)) {
			data += `${show_numbers ? "666:" : ""} ${i}`;
		}
	}
	if (include_zeroth && this.zeroth) {
		data += `${show_numbers ? "0:" : ""} ${this.zeroth}`;
	}
	for (law of each(this.ion)) {
		if (rt.length(law) > 0) {
			num = ionnum();
			data += `${show_numbers ? `${num}:` : ""} ${law}`;
		}
	}
	let number: Value = 1;
	for (law_2 of each(this.inherent)) {
		if (rt.length(law_2) > 0) {
			data += `${show_numbers ? `${number}:` : ""} ${law_2}`;
			number++;
		}
	}
	law_2 = null;
	for (law_2 of each(this.supplied)) {
		if (rt.length(law_2) > 0) {
			data += `${show_numbers ? `${number}:` : ""} ${law_2}`;
			number++;
		}
	}
	return data;
});
