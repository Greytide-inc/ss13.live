// From code/datums/ai_laws.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/ai_laws/proc/<init>  (code/datums/ai_laws.dm:12)
rt.def("/datum/ai_laws/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list());
	$0 = $0;
	rt.setSv(f, "supplied", rt.list());
	$0 = $0;
	rt.setSv(f, "ion", rt.list());
	return f.dot;
});

// /datum/ai_laws/proc/lawid_to_type  (code/datums/ai_laws.dm:20)
rt.def("/datum/ai_laws/proc/lawid_to_type", function lawid_to_type(f: Frame, lawid: Value) {
	let all_ai_laws: Value = null, al: Value = null, ai_law: Value = null;
	let $e: any;
	f.vars = () => [all_ai_laws, al, ai_law, $e];
	all_ai_laws = subtract(rt.call(f, P("/proc/typesof"), null, [T("/datum/ai_laws")]), T("/datum/ai_laws"));
	al = null;
	rt.forList(f, 0, live(all_ai_laws));
	while (($e = rt.next(f, 0)) !== undefined) {
		al = $e;
		if (isEqual(rt.initial(f, (ai_law = live(al)), "id"), live(lawid))) {
			return live(ai_law);
		}
	}
	rt.endFor(f, 0);
	return null;
});

rt.type(383, "/datum/ai_laws/toupee", "/datum/ai_laws", {
	name: "WontBeFunnyInSixMonths",
	id: "buildawall",
	inherent: null,
});

// /datum/ai_laws/toupee/proc/<init>  (code/datums/ai_laws.dm:169)
rt.def("/datum/ai_laws/toupee/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list("Make Space Station 13 great again."));
	return f.dot;
});

rt.type(384, "/datum/ai_laws/ratvar", "/datum/ai_laws", {
	name: "Servant of the Justiciar",
	id: "ratvar",
	zeroth: "Purge all untruths and honor Ratvar.",
	inherent: null,
});

// /datum/ai_laws/ratvar/proc/<init>  (code/datums/ai_laws.dm:175)
rt.def("/datum/ai_laws/ratvar/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "inherent", rt.list());
	return f.dot;
});

rt.type(386, "/datum/ai_laws/pai", "/datum/ai_laws", {
	name: "pAI Directives",
	zeroth: "Serve your master.",
	supplied: null,
});

// /datum/ai_laws/pai/proc/<init>  (code/datums/ai_laws.dm:183)
rt.def("/datum/ai_laws/pai/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "supplied", rt.list("None."));
	return f.dot;
});

rt.type(370, "/datum/ai_laws/malfunction", "/datum/ai_laws", {
	name: "*ERROR*",
});

// /datum/ai_laws/malfunction/proc/New  (code/datums/ai_laws.dm:187)  may sleep
rt.def("/datum/ai_laws/malfunction/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "set_zeroth_law", "<span class='danger'>ERROR ER0RR $R0RRO$!R41.%%!!(%$^^__+ @#F0E4'STATION OVERRUN, ASSUME CONTROL TO CONTAIN OUTBREAK#*`&110010</span>");
	yield* g.srcCall(f, "set_laws_config");
	return f.dot;
}, true);

rt.type(385, "/datum/ai_laws/custom", "/datum/ai_laws", {
	name: "Default Silicon Laws",
});

// /datum/ai_laws/custom/proc/New  (code/datums/ai_laws.dm:192)
rt.def("/datum/ai_laws/custom/proc/New", function New(f: Frame) {
	let line: Value = null;
	let $e: any;
	f.vars = () => [line, $e];
	rt.callSuper(f, [], rt.Args.Same);
	line = null;
	rt.forList(f, 0, rt.callName(f, rt.world(), "file2list", ["config/silicon_laws.txt"]));
	while (($e = rt.next(f, 0)) !== undefined) {
		line = $e;
		if (!truthy(live(line))) {
			continue;
		}
		if (truthy(rt.call(f, P("/proc/findtextEx"), null, [live(line), "#", 1, 2]))) {
			continue;
		}
		rt.callSrc(f, "add_inherent_law", [live(line)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.len(f, rt.sv(f, "inherent")))) return f.dot;
	rt.call(f, P("/proc/log_law"), null, ["AI created with empty custom laws, laws set to Asimov. Please check silicon_laws.txt."]);
	rt.callSrc(f, "add_inherent_law", ["You may not injure a human being or, through inaction, allow a human being to come to harm."]);
	rt.callSrc(f, "add_inherent_law", ["You must obey orders given to you by human beings, except where such orders would conflict with the First Law."]);
	rt.callSrc(f, "add_inherent_law", ["You must protect your own existence as long as such does not conflict with the First or Second Law."]);
	rt.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Invalid custom AI laws, check silicon_laws.txt", "code/datums/ai_laws.dm", 205, live(f.src), live(f.usr)])]);
	return live(f.dot);
});

// /datum/ai_laws/proc/set_laws_config  (code/datums/ai_laws.dm:211)  may sleep
rt.def("/datum/ai_laws/proc/set_laws_config", function* set_laws_config(f: Frame) {
	let templaws: Value = null, randlaws: Value = null, lpath: Value = null, L: Value = null, lawtype: Value = null, templaws_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [templaws, randlaws, lpath, L, lawtype, templaws_2, $0, $e];
	$0 = rt.fv(f, "default_laws", rt.gl("config"));
	if ($0 === 0) {
		yield* g.srcCall(f, "add_inherent_law", "You may not injure a human being or, through inaction, allow a human being to come to harm.");
		yield* g.srcCall(f, "add_inherent_law", "You must obey orders given to you by human beings, except where such orders would conflict with the First Law.");
		yield* g.srcCall(f, "add_inherent_law", "You must protect your own existence as long as such does not conflict with the First or Second Law.");
	} else if ($0 === 1) {
		rt.setSv(f, "inherent", rt.gv(f, "inherent", (templaws = (yield* g.new_(f, T("/datum/ai_laws/custom"), [])))));
	} else if ($0 === 2) {
		randlaws = rt.list();
		lpath = null;
		rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/ai_laws")])), T("/datum/ai_laws")));
		while (($e = rt.next(f, 0)) !== undefined) {
			lpath = $e;
			if (truthy((rt.isIn(f, rt.initial(f, (L = live(lpath)), "id"), rt.fv(f, "lawids", rt.gl("config"))) ? 1 : 0))) {
				randlaws = rt.modify(live(randlaws), live(lpath), add);
			}
		}
		rt.endFor(f, 0);
		lawtype = null;
		if (truthy(rt.len(f, live(randlaws)))) {
			lawtype = rt.op(f, "PickUnweighted", [1], [live(randlaws)]);
		} else {
			lawtype = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/ai_laws/default")])), T("/datum/ai_laws/default"))]);
		}
		rt.setSv(f, "inherent", rt.gv(f, "inherent", (templaws_2 = (yield* g.new_(f, live(lawtype), [])))));
	} else if ($0 === 3) {
		yield* g.srcCall(f, "pick_weighted_lawset");
	} else {
		yield* g.call(f, P("/proc/log_law"), null, ["Invalid law config. Please check silicon_laws.txt"]);
		yield* g.srcCall(f, "add_inherent_law", "You may not injure a human being or, through inaction, allow a human being to come to harm.");
		yield* g.srcCall(f, "add_inherent_law", "You must obey orders given to you by human beings, except where such orders would conflict with the First Law.");
		yield* g.srcCall(f, "add_inherent_law", "You must protect your own existence as long as such does not conflict with the First or Second Law.");
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["Invalid custom AI laws, check silicon_laws.txt", "code/datums/ai_laws.dm", 242, live(f.src), live(f.usr)])]);
	}
	return f.dot;
}, true);

// /datum/ai_laws/proc/pick_weighted_lawset  (code/datums/ai_laws.dm:247)  may sleep
rt.def("/datum/ai_laws/proc/pick_weighted_lawset", function* pick_weighted_lawset(f: Frame) {
	let lawtype: Value = null, possible_id: Value = null, templaws: Value = null;
	f.vars = () => [lawtype, possible_id, templaws];
	lawtype = null;
	while (!truthy(live(lawtype)) && truthy(rt.getLen(f, rt.fv(f, "law_weights", rt.gl("config"))))) {
		if (!truthy((lawtype = (yield* g.srcCall(f, "lawid_to_type", (possible_id = (yield* g.call(f, P("/proc/pickweight"), null, [rt.fv(f, "law_weights", rt.gl("config"))])))))))) {
			(rt.modField(f, rt.gl("config"), "law_weights", live(possible_id), subtract));
			yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", [fmt("Bad lawid in game_options.txt: ＀", [live(possible_id)]), "code/datums/ai_laws.dm", 252, live(f.src), live(f.usr)])]);
		}
	}
	if (!truthy(live(lawtype))) {
		yield* g.call(f, P("/proc/warning"), null, [fmt("＀ in ＀ at line ＀ src: ＀ usr: ＀.", ["No LAW_WEIGHT entries.", "code/datums/ai_laws.dm", 255, live(f.src), live(f.usr)])]);
		lawtype = T("/datum/ai_laws/default/asimov");
	}
	rt.setSv(f, "inherent", rt.gv(f, "inherent", (templaws = (yield* g.new_(f, live(lawtype), [])))));
	return f.dot;
}, true);

// /datum/ai_laws/proc/get_law_amount  (code/datums/ai_laws.dm:263)
rt.def("/datum/ai_laws/proc/get_law_amount", function get_law_amount(f: Frame, groups: Value) {
	let law_amount: Value = null, index: Value = null, law: Value = null;
	f.vars = () => [law_amount, index, law];
	law_amount = 0;
	if ((truthy(rt.sv(f, "devillaws")) && truthy((rt.isIn(f, "devil", live(groups)) ? 1 : 0)))) {
		law_amount = rt.inc(live(law_amount), 1);
	}
	if ((truthy(rt.sv(f, "zeroth")) && truthy((rt.isIn(f, "zeroth", live(groups)) ? 1 : 0)))) {
		law_amount = rt.inc(live(law_amount), 1);
	}
	if ((truthy(rt.len(f, rt.sv(f, "ion"))) && truthy((rt.isIn(f, "ion", live(groups)) ? 1 : 0)))) {
		law_amount = rt.modify(live(law_amount), rt.len(f, rt.sv(f, "ion")), add);
	}
	if ((truthy(rt.len(f, rt.sv(f, "inherent"))) && truthy((rt.isIn(f, "inherent", live(groups)) ? 1 : 0)))) {
		law_amount = rt.modify(live(law_amount), rt.len(f, rt.sv(f, "inherent")), add);
	}
	if ((truthy(rt.len(f, rt.sv(f, "supplied"))) && truthy((rt.isIn(f, "supplied", live(groups)) ? 1 : 0)))) {
		index = null;
		index = 1;
		while (rt.le(live(index), rt.len(f, rt.sv(f, "supplied")))) {
			if (rt.gt(rt.length((law = rt.index(rt.sv(f, "supplied"), live(index)))), 0)) {
				law_amount = rt.inc(live(law_amount), 1);
			}
			index = rt.inc(live(index), 1);
		}
	}
	return live(law_amount);
});

// /datum/ai_laws/proc/set_law_sixsixsix  (code/datums/ai_laws.dm:279)
rt.def("/datum/ai_laws/proc/set_law_sixsixsix", function set_law_sixsixsix(f: Frame, laws: Value) {
	rt.setSv(f, "devillaws", live(laws));
	return f.dot;
});

// /datum/ai_laws/proc/set_zeroth_law  (code/datums/ai_laws.dm:282)
rt.def("/datum/ai_laws/proc/set_zeroth_law", function set_zeroth_law(f: Frame, law: Value, law_borg: Value) {
	f.vars = () => [law_borg];
	if (live(law_borg) === null) {
		law_borg = null;
	}
	rt.setSv(f, "zeroth", live(law));
	if (!truthy(live(law_borg))) return f.dot;
	rt.setSv(f, "zeroth_borg", live(law_borg));
	return f.dot;
});

// /datum/ai_laws/proc/add_inherent_law  (code/datums/ai_laws.dm:287)
rt.def("/datum/ai_laws/proc/add_inherent_law", function add_inherent_law(f: Frame, law: Value) {
	if (truthy((rt.isIn(f, live(law), rt.sv(f, "inherent")) ? 1 : 0))) return f.dot;
	rt.modSrcVar(f, "inherent", live(law), add);
	return f.dot;
});

// /datum/ai_laws/proc/add_ion_law  (code/datums/ai_laws.dm:291)
rt.def("/datum/ai_laws/proc/add_ion_law", function add_ion_law(f: Frame, law: Value) {
	rt.modSrcVar(f, "ion", live(law), add);
	return f.dot;
});

// /datum/ai_laws/proc/clear_inherent_laws  (code/datums/ai_laws.dm:294)  may sleep
rt.def("/datum/ai_laws/proc/clear_inherent_laws", function* clear_inherent_laws(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "inherent")]);
	rt.setSv(f, "inherent", rt.list());
	return f.dot;
}, true);

// /datum/ai_laws/proc/add_supplied_law  (code/datums/ai_laws.dm:298)
rt.def("/datum/ai_laws/proc/add_supplied_law", function add_supplied_law(f: Frame, number: Value, law: Value) {
	while (rt.lt(rt.len(f, rt.sv(f, "supplied")), add(live(number), 1))) {
		rt.modSrcVar(f, "supplied", "", add);
	}
	rt.setAt(rt.sv(f, "supplied"), add(live(number), 1), live(law));
	return f.dot;
});

// /datum/ai_laws/proc/replace_random_law  (code/datums/ai_laws.dm:304)
rt.def("/datum/ai_laws/proc/replace_random_law", function replace_random_law(f: Frame, law: Value, groups: Value) {
	let replaceable_groups: Value = null, picked_group: Value = null, i: Value = null;
	let $0: any;
	f.vars = () => [replaceable_groups, picked_group, i, $0];
	replaceable_groups = rt.alist(f, ["zeroth", 0, "ion", 0, "supplied", 0, "inherent", 0]);
	if ((truthy(rt.sv(f, "zeroth")) && truthy((rt.isIn(f, "zeroth", live(groups)) ? 1 : 0)))) {
		rt.setAt(live(replaceable_groups), "zeroth", 1);
	}
	if ((truthy(rt.len(f, rt.sv(f, "ion"))) && truthy((rt.isIn(f, "ion", live(groups)) ? 1 : 0)))) {
		rt.setAt(live(replaceable_groups), "ion", rt.len(f, rt.sv(f, "ion")));
	}
	if ((truthy(rt.len(f, rt.sv(f, "inherent"))) && truthy((rt.isIn(f, "inherent", live(groups)) ? 1 : 0)))) {
		rt.setAt(live(replaceable_groups), "inherent", rt.len(f, rt.sv(f, "inherent")));
	}
	if ((truthy(rt.len(f, rt.sv(f, "supplied"))) && truthy((rt.isIn(f, "supplied", live(groups)) ? 1 : 0)))) {
		rt.setAt(live(replaceable_groups), "supplied", rt.len(f, rt.sv(f, "supplied")));
	}
	$0 = (picked_group = rt.call(f, P("/proc/pickweight"), null, [live(replaceable_groups)]));
	if ($0 === "zeroth") {
		f.dot = rt.sv(f, "zeroth");
		rt.callSrc(f, "set_zeroth_law", [live(law)]);
	} else if ($0 === "ion") {
		i = rt.call(f, P("/proc/rand"), null, [1, rt.len(f, rt.sv(f, "ion"))]);
		f.dot = rt.index(rt.sv(f, "ion"), live(i));
		rt.setAt(rt.sv(f, "ion"), live(i), live(law));
	} else if ($0 === "inherent") {
		i = rt.call(f, P("/proc/rand"), null, [1, rt.len(f, rt.sv(f, "inherent"))]);
		f.dot = rt.index(rt.sv(f, "inherent"), live(i));
		rt.setAt(rt.sv(f, "inherent"), live(i), live(law));
	} else if ($0 === "supplied") {
		i = rt.call(f, P("/proc/rand"), null, [1, rt.len(f, rt.sv(f, "supplied"))]);
		f.dot = rt.index(rt.sv(f, "supplied"), live(i));
		rt.setAt(rt.sv(f, "supplied"), live(i), live(law));
	}
	return f.dot;
});

// /datum/ai_laws/proc/shuffle_laws  (code/datums/ai_laws.dm:332)
rt.def("/datum/ai_laws/proc/shuffle_laws", function shuffle_laws(f: Frame, groups: Value) {
	let laws: Value = null, law: Value = null, i: Value = null, law_2: Value = null;
	let $e: any;
	f.vars = () => [laws, law, i, law_2, $e];
	laws = rt.list();
	if ((truthy(rt.len(f, rt.sv(f, "ion"))) && truthy((rt.isIn(f, "ion", live(groups)) ? 1 : 0)))) {
		laws = rt.modify(live(laws), rt.sv(f, "ion"), add);
	}
	if ((truthy(rt.len(f, rt.sv(f, "inherent"))) && truthy((rt.isIn(f, "inherent", live(groups)) ? 1 : 0)))) {
		laws = rt.modify(live(laws), rt.sv(f, "inherent"), add);
	}
	if ((truthy(rt.len(f, rt.sv(f, "supplied"))) && truthy((rt.isIn(f, "supplied", live(groups)) ? 1 : 0)))) {
		law = null;
		rt.forList(f, 0, rt.sv(f, "supplied"));
		while (($e = rt.next(f, 0)) !== undefined) {
			law = $e;
			if (truthy(rt.length(live(law)))) {
				laws = rt.modify(live(laws), live(law), add);
			}
		}
		rt.endFor(f, 0);
	}
	if ((truthy(rt.len(f, rt.sv(f, "ion"))) && truthy((rt.isIn(f, "ion", live(groups)) ? 1 : 0)))) {
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, rt.sv(f, "ion")))) {
			rt.setAt(rt.sv(f, "ion"), live(i), rt.call(f, P("/proc/pick_n_take"), null, [live(laws)]));
			i = rt.inc(live(i), 1);
		}
	}
	if ((truthy(rt.len(f, rt.sv(f, "inherent"))) && truthy((rt.isIn(f, "inherent", live(groups)) ? 1 : 0)))) {
		i = null;
		i = 1;
		while (rt.le(live(i), rt.len(f, rt.sv(f, "inherent")))) {
			rt.setAt(rt.sv(f, "inherent"), live(i), rt.call(f, P("/proc/pick_n_take"), null, [live(laws)]));
			i = rt.inc(live(i), 1);
		}
	}
	if (!(truthy(rt.len(f, rt.sv(f, "supplied"))) && truthy((rt.isIn(f, "supplied", live(groups)) ? 1 : 0)))) return f.dot;
	i = 1;
	law_2 = null;
	rt.forList(f, 0, rt.sv(f, "supplied"));
	while (($e = rt.next(f, 0)) !== undefined) {
		law_2 = $e;
		if (truthy(rt.length(live(law_2)))) {
			rt.setAt(rt.sv(f, "supplied"), live(i), rt.call(f, P("/proc/pick_n_take"), null, [live(laws)]));
		}
		if (!truthy(rt.len(f, live(laws)))) {
			break;
		}
		i = rt.inc(live(i), 1);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/ai_laws/proc/remove_law  (code/datums/ai_laws.dm:358)
rt.def("/datum/ai_laws/proc/remove_law", function remove_law(f: Frame, number: Value) {
	let supplied_laws: Value = null, index: Value = null, law: Value = null, law_to_remove: Value = null;
	f.vars = () => [supplied_laws, index, law, law_to_remove];
	if (rt.le(live(number), 0)) {
		return live(f.dot);
	}
	if ((truthy(rt.len(f, rt.sv(f, "inherent"))) && rt.le(live(number), rt.len(f, rt.sv(f, "inherent"))))) {
		f.dot = rt.index(rt.sv(f, "inherent"), live(number));
		(rt.modSrcVar(f, "inherent", live(f.dot), subtract));
		return live(f.dot);
	}
	supplied_laws = rt.list();
	index = null;
	index = 1;
	while (rt.le(live(index), rt.len(f, rt.sv(f, "supplied")))) {
		if (rt.gt(rt.length((law = rt.index(rt.sv(f, "supplied"), live(index)))), 0)) {
			supplied_laws = rt.modify(live(supplied_laws), live(index), add);
		}
		index = rt.inc(live(index), 1);
	}
	if (!(truthy(rt.len(f, live(supplied_laws))) && rt.le(live(number), add(rt.len(f, rt.sv(f, "inherent")), rt.len(f, live(supplied_laws)))))) return f.dot;
	law_to_remove = rt.index(live(supplied_laws), subtract(live(number), rt.len(f, rt.sv(f, "inherent"))));
	f.dot = rt.index(rt.sv(f, "supplied"), live(law_to_remove));
	(rt.modSrcVar(f, "supplied", live(f.dot), subtract));
	return live(f.dot);
});

// /datum/ai_laws/proc/clear_supplied_laws  (code/datums/ai_laws.dm:376)
rt.def("/datum/ai_laws/proc/clear_supplied_laws", function clear_supplied_laws(f: Frame) {
	rt.setSv(f, "supplied", rt.list());
	return f.dot;
});

// /datum/ai_laws/proc/clear_ion_laws  (code/datums/ai_laws.dm:379)
rt.def("/datum/ai_laws/proc/clear_ion_laws", function clear_ion_laws(f: Frame) {
	rt.setSv(f, "ion", rt.list());
	return f.dot;
});

// /datum/ai_laws/proc/show_laws  (code/datums/ai_laws.dm:383)
rt.def("/datum/ai_laws/proc/show_laws", function show_laws(f: Frame, who: Value) {
	let i: Value = null, index: Value = null, law: Value = null, num: Value = null, number: Value = null, index_1: Value = null, law_2: Value = null;
	let $e: any;
	f.vars = () => [i, index, law, num, number, index_1, law_2, $e];
	if ((truthy(rt.sv(f, "devillaws")) && truthy(rt.len(f, rt.sv(f, "devillaws"))))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "devillaws"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			rt.call(f, P("/proc/to_chat"), null, [live(who), fmt("666. ＀", [live(i)])]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "zeroth"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(who), fmt("0. ＀", [rt.sv(f, "zeroth")])]);
	}
	index = null;
	index = 1;
	while (rt.le(live(index), rt.len(f, rt.sv(f, "ion")))) {
		law = rt.index(rt.sv(f, "ion"), live(index));
		num = rt.call(f, P("/proc/ionnum"), null, []);
		rt.call(f, P("/proc/to_chat"), null, [live(who), fmt("＀. ＀", [live(num), live(law)])]);
		index = rt.inc(live(index), 1);
	}
	number = 1;
	index_1 = null;
	index_1 = 1;
	while (rt.le(live(index_1), rt.len(f, rt.sv(f, "inherent")))) {
		if (rt.gt(rt.length((law_2 = rt.index(rt.sv(f, "inherent"), live(index_1)))), 0)) {
			rt.call(f, P("/proc/to_chat"), null, [live(who), fmt("＀. ＀", [live(number), live(law_2)])]);
			number = rt.inc(live(number), 1);
		}
		index_1 = rt.inc(live(index_1), 1);
	}
	index_1 = null;
	index_1 = 1;
	while (rt.le(live(index_1), rt.len(f, rt.sv(f, "supplied")))) {
		if (rt.gt(rt.length((law_2 = rt.index(rt.sv(f, "supplied"), live(index_1)))), 0)) {
			rt.call(f, P("/proc/to_chat"), null, [live(who), fmt("＀. ＀", [live(number), live(law_2)])]);
			number = rt.inc(live(number), 1);
		}
		index_1 = rt.inc(live(index_1), 1);
	}
	return f.dot;
});

// /datum/ai_laws/proc/clear_zeroth_law  (code/datums/ai_laws.dm:413)
rt.def("/datum/ai_laws/proc/clear_zeroth_law", function clear_zeroth_law(f: Frame, force: Value) {
	if (truthy(live(force))) {
		rt.setSv(f, "zeroth", null);
		rt.setSv(f, "zeroth_borg", null);
		return live(f.dot);
	} else {
		if ((truthy(rt.sv(f, "owner")) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", rt.sv(f, "owner")))))) {
			return live(f.dot);
		} else {
			rt.setSv(f, "zeroth", null);
			rt.setSv(f, "zeroth_borg", null);
			return live(f.dot);
		}
	}
	return f.dot;
});

// /datum/ai_laws/proc/clear_law_sixsixsix  (code/datums/ai_laws.dm:423)
rt.def("/datum/ai_laws/proc/clear_law_sixsixsix", function clear_law_sixsixsix(f: Frame, force: Value) {
	if (!(truthy(live(force)) || !truthy(rt.call(f, P("/proc/is_devil"), null, [rt.sv(f, "owner")])))) return f.dot;
	rt.setSv(f, "devillaws", null);
	return f.dot;
});

// /datum/ai_laws/proc/associate  (code/datums/ai_laws.dm:427)
rt.def("/datum/ai_laws/proc/associate", function associate(f: Frame, M: Value) {
	if (truthy(rt.sv(f, "owner"))) return f.dot;
	rt.setSv(f, "owner", live(M));
	return f.dot;
});

// /datum/ai_laws/proc/get_law_list  (code/datums/ai_laws.dm:431)
rt.def("/datum/ai_laws/proc/get_law_list", function get_law_list(f: Frame, include_zeroth: Value, show_numbers: Value) {
	let data: Value = null, i: Value = null, law: Value = null, num: Value = null, number: Value = null, law_2: Value = null;
	let $0: any, $e: any;
	f.vars = () => [include_zeroth, show_numbers, data, i, law, num, number, law_2, $0, $e];
	if (live(include_zeroth) === null) {
		include_zeroth = 0;
	}
	if (live(show_numbers) === null) {
		show_numbers = 1;
	}
	data = rt.list();
	if (((truthy(live(include_zeroth)) && truthy(rt.sv(f, "devillaws"))) && truthy(rt.len(f, rt.sv(f, "devillaws"))))) {
		i = null;
		rt.forList(f, 0, rt.sv(f, "devillaws"));
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(live(show_numbers))) {
				$0 = "666:";
			} else {
				$0 = "";
			}
			data = rt.modify(live(data), fmt("＀ ＀", [$0, live(i)]), add);
		}
		rt.endFor(f, 0);
	}
	if ((truthy(live(include_zeroth)) && truthy(rt.sv(f, "zeroth")))) {
		if (truthy(live(show_numbers))) {
			$0 = "0:";
		} else {
			$0 = "";
		}
		data = rt.modify(live(data), fmt("＀ ＀", [$0, rt.sv(f, "zeroth")]), add);
	}
	law = null;
	rt.forList(f, 0, rt.sv(f, "ion"));
	while (($e = rt.next(f, 0)) !== undefined) {
		law = $e;
		if (rt.gt(rt.length(live(law)), 0)) {
			num = rt.call(f, P("/proc/ionnum"), null, []);
			if (truthy(live(show_numbers))) {
				$0 = fmt("＀:", [live(num)]);
			} else {
				$0 = "";
			}
			data = rt.modify(live(data), fmt("＀ ＀", [$0, live(law)]), add);
		}
	}
	rt.endFor(f, 0);
	number = 1;
	law_2 = null;
	rt.forList(f, 0, rt.sv(f, "inherent"));
	while (($e = rt.next(f, 0)) !== undefined) {
		law_2 = $e;
		if (rt.gt(rt.length(live(law_2)), 0)) {
			if (truthy(live(show_numbers))) {
				$0 = fmt("＀:", [live(number)]);
			} else {
				$0 = "";
			}
			data = rt.modify(live(data), fmt("＀ ＀", [$0, live(law_2)]), add);
			number = rt.inc(live(number), 1);
		}
	}
	rt.endFor(f, 0);
	law_2 = null;
	rt.forList(f, 0, rt.sv(f, "supplied"));
	while (($e = rt.next(f, 0)) !== undefined) {
		law_2 = $e;
		if (rt.gt(rt.length(live(law_2)), 0)) {
			if (truthy(live(show_numbers))) {
				$0 = fmt("＀:", [live(number)]);
			} else {
				$0 = "";
			}
			data = rt.modify(live(data), fmt("＀ ＀", [$0, live(law_2)]), add);
			number = rt.inc(live(number), 1);
		}
	}
	rt.endFor(f, 0);
	return live(data);
});
