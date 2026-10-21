// From code/modules/stock_market/articles.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/consonant  (code/modules/stock_market/articles.dm:2)
rt.def("/proc/consonant", function consonant(f: Frame) {
	return rt.op(f, "PickUnweighted", [21], ["B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z"]);
});

// /proc/vowel  (code/modules/stock_market/articles.dm:5)
rt.def("/proc/vowel", function vowel(f: Frame) {
	return rt.op(f, "PickUnweighted", [5], ["A", "E", "I", "O", "U"]);
});

// /proc/ucfirst  (code/modules/stock_market/articles.dm:8)
rt.def("/proc/ucfirst", function ucfirst(f: Frame, S: Value) {
	return fmt("＀＀", [rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/ascii2text"), null, [rt.call(f, P("/proc/text2ascii"), null, [live(S), 1])])]), rt.call(f, P("/proc/copytext"), null, [live(S), 2])]);
});

// /proc/ucfirsts  (code/modules/stock_market/articles.dm:11)
rt.def("/proc/ucfirsts", function ucfirsts(f: Frame, S: Value) {
	let L: Value = null, M: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [L, M, _P, $e];
	L = rt.call(f, P("/proc/splittext"), null, [live(S), " "]);
	M = rt.list();
	_P = null;
	rt.forList(f, 0, live(L));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		M = rt.modify(live(M), rt.call(f, P("/proc/ucfirst"), null, [live(_P)]), add);
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/jointext"), null, [live(M), " "]);
});

// /datum/controller/global_vars/proc/InitGlobalFrozenAccounts  (code/modules/stock_market/articles.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGlobalFrozenAccounts", function InitGlobalFrozenAccounts(f: Frame) {
	rt.setGl("FrozenAccounts", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "FrozenAccounts", add);
	return f.dot;
});

// /proc/list_frozen  (code/modules/stock_market/articles.dm:20)
rt.def("/proc/list_frozen", function list_frozen(f: Frame) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [A, $e];
	A = null;
	rt.forList(f, 0, rt.gl("FrozenAccounts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("＀: ＀ borrows", [live(A), rt.length(rt.index(rt.gl("FrozenAccounts"), live(A)))])]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

rt.type(4205, "/datum/article", "/datum", {
	headline: "Something big is happening",
	subtitle: "Investors panic as stock market collapses",
	article: "God, it's going to be fun to randomly generate this.",
	author: "P. Pubbie",
	spacetime: "",
	opinion: 0,
	ticks: 0,
	about: null,
	outlet: "",
}, { global: { outlets: 677, default_tokens: 678 } });

// /datum/article/proc/New  (code/modules/stock_market/articles.dm:64)
rt.def("/datum/article/proc/New", function New(f: Frame) {
	let ON: Value = null, authors: Value = null, AN: Value = null;
	f.vars = () => [ON, authors, AN];
	rt.callSuper(f, [], rt.Args.Same);
	if (((truthy(rt.len(f, rt.gl("outlets"))) && !truthy(rt.op(f, "Prob", [], [divide(100, add(rt.len(f, rt.gl("outlets")), 1))]))) || !truthy(rt.len(f, rt.gl("outlets"))))) {
		if (!truthy((rt.isIn(f, (ON = rt.callSrc(f, "generateOutletName", [])), rt.gl("outlets")) ? 1 : 0))) {
			rt.setAt(rt.gl("outlets"), live(ON), rt.list());
		}
		rt.setSv(f, "outlet", live(ON));
	} else {
		rt.setSv(f, "outlet", rt.op(f, "PickUnweighted", [1], [rt.gl("outlets")]));
	}
	if (((truthy(rt.getLen(f, (authors = rt.index(rt.gl("outlets"), rt.sv(f, "outlet"))))) && !truthy(rt.op(f, "Prob", [], [divide(100, add(rt.len(f, live(authors)), 1))]))) || !truthy(rt.len(f, live(authors))))) {
		AN = rt.callSrc(f, "generateAuthorName", []);
		rt.modAt(rt.gl("outlets"), rt.sv(f, "outlet"), live(AN), add);
		rt.setSv(f, "author", live(AN));
	} else {
		rt.setSv(f, "author", rt.op(f, "PickUnweighted", [1], [live(authors)]));
	}
	rt.setSv(f, "ticks", rt.worldTime(f));
	return f.dot;
});

// /datum/article/proc/generateOutletName  (code/modules/stock_market/articles.dm:88)
rt.def("/datum/article/proc/generateOutletName", function generateOutletName(f: Frame) {
	let locations: Value = null, nouns: Value = null, timely: Value = null;
	let $0: any;
	f.vars = () => [locations, nouns, timely, $0];
	locations = rt.list("Earth", "Luna", "Mars", "Saturn", "Jupiter", "Uranus", "Pluto", "Europa", "Io", "Phobos", "Deimos", "Space", "Venus", "Neptune", "Mercury", "Kalliope", "Ganymede", "Callisto", "Amalthea", "Himalia", "Orion", "Sybil", "Basil", "Badger", "Terry", "Artyom");
	nouns = rt.list("Post", "Herald", "Sun", "Tribune", "Mail", "Times", "Journal", "Report");
	timely = rt.list("Daily", "Hourly", "Weekly", "Biweekly", "Monthly", "Yearly");
	$0 = rt.call(f, P("/proc/rand"), null, [1, 2]);
	if ($0 === 1) {
		return fmt("The ＀ ＀", [rt.op(f, "PickUnweighted", [1], [live(locations)]), rt.op(f, "PickUnweighted", [1], [live(nouns)])]);
	} else if ($0 === 2) {
		return fmt("The ＀ ＀", [rt.op(f, "PickUnweighted", [1], [live(timely)]), rt.op(f, "PickUnweighted", [1], [live(nouns)])]);
	}
	return f.dot;
});

// /datum/article/proc/generateAuthorName  (code/modules/stock_market/articles.dm:95)
rt.def("/datum/article/proc/generateAuthorName", function generateAuthorName(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	$0 = rt.call(f, P("/proc/rand"), null, [1, 3]);
	if ($0 === 1) {
		return fmt("＀. ＀", [rt.call(f, P("/proc/consonant"), null, []), rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]);
	} else if ($0 === 2) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
		} else {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
		}
		$1 = rt.call(f, P("/proc/consonant"), null, []);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$2 = fmt("＀. ", [rt.call(f, P("/proc/consonant"), null, [])]);
		} else {
			$2 = null;
		}
		return fmt("＀ ＀.＀ ＀", [$0, $1, $2, rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]);
	} else if ($0 === 3) {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
		} else {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
		}
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$1 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
		} else {
			$1 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
		}
		return fmt("＀ \"＀\" ＀", [$0, $1, rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]);
	}
	return f.dot;
});

// /datum/article/proc/detokenize  (code/modules/stock_market/articles.dm:118)
rt.def("/datum/article/proc/detokenize", function detokenize(f: Frame, token_string: Value, industry_tokens: Value, product_tokens: Value) {
	let T_list: Value = null, I: Value = null;
	let $e: any;
	f.vars = () => [token_string, product_tokens, T_list, I, $e];
	if (live(product_tokens) === null) {
		product_tokens = rt.list();
	}
	T_list = rt.callName(f, rt.gl("default_tokens"), "Copy", []);
	I = null;
	rt.forList(f, 0, live(industry_tokens));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setAt(live(T_list), live(I), rt.index(live(industry_tokens), live(I)));
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, live(product_tokens));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		rt.setAt(live(T_list), live(I), rt.list(rt.index(live(product_tokens), live(I))));
	}
	rt.endFor(f, 0);
	I = null;
	rt.forList(f, 0, live(T_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		token_string = rt.call(f, P("/proc/replacetext"), null, [live(token_string), fmt("%＀%", [live(I)]), rt.op(f, "PickUnweighted", [1], [rt.index(live(T_list), live(I))])]);
	}
	rt.endFor(f, 0);
	return rt.call(f, P("/proc/ucfirst"), null, [live(token_string)]);
});
