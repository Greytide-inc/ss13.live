// From code/modules/stock_market/events.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4206, "/datum/stockEvent", "/datum", {
	name: "event",
	next_phase: 0,
	company: null,
	current_title: "A company holding an pangalactic conference in the Seattle Conference Center, Seattle, Earth",
	current_desc: "We will continue to monitor their stocks as the situation unfolds.",
	phase_id: 0,
	hidden: 0,
	finished: 0,
	last_change: 0,
});

// /datum/stockEvent/proc/process  (code/modules/stock_market/events.dm:17)  may sleep
rt.def("/datum/stockEvent/proc/process", function* process(f: Frame) {
	if (truthy(rt.sv(f, "finished"))) {
		return live(f.dot);
	}
	if (!rt.gt(rt.worldTime(f), rt.sv(f, "next_phase"))) return f.dot;
	yield* g.srcCall(f, "transition");
	return f.dot;
}, true, { waitfor: false });

// /datum/stockEvent/proc/spacetime  (code/modules/stock_market/events.dm:24)
rt.def("/datum/stockEvent/proc/spacetime", function spacetime(f: Frame, ticks: Value) {
	let seconds: Value = null, minutes: Value = null;
	f.vars = () => [seconds, minutes];
	seconds = rt.call(f, P("/proc/round"), null, [divide(live(ticks), 10)]);
	(seconds = rt.modify(live(seconds), multiply((minutes = rt.call(f, P("/proc/round"), null, [divide(live(seconds), 60)])), 60), subtract));
	return fmt("＀ minute(s) and ＀ second(s)", [live(minutes), live(seconds)]);
});

rt.type(4207, "/datum/stockEvent/product", "/datum/stockEvent", {
	product_name: "",
	product_article: null,
	effect: 0,
	name: "product",
});

// /datum/stockEvent/product/proc/New  (code/modules/stock_market/events.dm:36)
rt.def("/datum/stockEvent/product/proc/New", function New(f: Frame, S: Value) {
	let mins: Value = null;
	f.vars = () => [mins];
	rt.setSv(f, "company", live(S));
	rt.setSv(f, "next_phase", add(multiply((mins = rt.call(f, P("/proc/rand"), null, [3.5, 14])), 420), rt.worldTime(f)));
	rt.setSv(f, "current_title", "Product demo");
	rt.setSv(f, "current_desc", rt.callName(f, rt.fv(f, "industry", live(S)), "detokenize", [fmt("＀ will unveil a new product on an upcoming %industrial% conference held at spacetime ＀", [rt.fv(f, "name", live(S)), rt.callSrc(f, "spacetime", [rt.sv(f, "next_phase")])])]));
	rt.callName(f, live(S), "addEvent", [live(f.src)]);
	return f.dot;
});

// /datum/stockEvent/product/proc/transition  (code/modules/stock_market/events.dm:46)  may sleep
rt.def("/datum/stockEvent/product/proc/transition", function* transition(f: Frame) {
	let A: Value = null;
	let $0: any;
	f.vars = () => [A, $0];
	rt.setSv(f, "last_change", rt.worldTime(f));
	$0 = rt.sv(f, "phase_id");
	if ($0 === 0) {
		rt.setSv(f, "next_phase", add(rt.worldTime(f), multiply((yield* g.call(f, P("/proc/rand"), null, [210, 420])), 7)));
		rt.setSv(f, "product_name", (yield* g.callName(f, rt.fv(f, "industry", rt.sv(f, "company")), "generateProductName", [rt.fv(f, "name", rt.sv(f, "company"))])));
		rt.setSv(f, "current_title", fmt("Product release: ＀", [rt.sv(f, "product_name")]));
		rt.setSv(f, "current_desc", fmt("＀ unveiled their newest product, ＀, at a conference. Product release is expected to happen at spacetime ＀.", [rt.fv(f, "name", rt.sv(f, "company")), rt.sv(f, "product_name"), (yield* g.srcCall(f, "spacetime", rt.sv(f, "next_phase")))]));
		rt.setSv(f, "product_article", (A = (yield* g.callName(f, rt.fv(f, "industry", rt.sv(f, "company")), "generateInCharacterProductArticle", [rt.sv(f, "product_name"), rt.sv(f, "company")]))));
		rt.setSv(f, "effect", add(rt.fv(f, "opinion", live(A)), (yield* g.call(f, P("/proc/rand"), null, [-1, 1]))));
		yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [rt.sv(f, "effect")]);
		rt.setSv(f, "phase_id", 1);
	} else if ($0 === 1) {
		rt.setSv(f, "finished", 1);
		rt.setSv(f, "hidden", 1);
		yield* g.callName(f, rt.sv(f, "company"), "addArticle", [rt.sv(f, "product_article")]);
		rt.modSrcVar(f, "effect", multiply(rt.fv(f, "opinion", rt.sv(f, "product_article")), 5), add);
		yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [rt.sv(f, "effect")]);
		rt.setSv(f, "phase_id", 2);
		yield* g.callName(f, rt.sv(f, "company"), "generateEvent", [rt.sv(f, "type")]);
	}
	return f.dot;
}, true);

rt.type(4208, "/datum/stockEvent/bankruptcy", "/datum/stockEvent", {
	effect: 0,
	bailout_millions: 0,
	name: "bankruptcy",
});

// /datum/stockEvent/bankruptcy/proc/New  (code/modules/stock_market/events.dm:73)
rt.def("/datum/stockEvent/bankruptcy/proc/New", function New(f: Frame, S: Value) {
	let mins: Value = null;
	f.vars = () => [mins];
	rt.setSv(f, "hidden", 1);
	rt.setSv(f, "company", live(S));
	mins = rt.call(f, P("/proc/rand"), null, [6.299999713897705, 42]);
	rt.setSv(f, "bailout_millions", rt.call(f, P("/proc/rand"), null, [70, 190]));
	rt.setSv(f, "next_phase", add(multiply(multiply(live(mins), 300), 0.699999988079071), rt.worldTime(f)));
	rt.setSv(f, "current_title", "");
	rt.setSv(f, "current_desc", "");
	rt.callName(f, live(S), "addEvent", [live(f.src)]);
	return f.dot;
});

// /datum/stockEvent/bankruptcy/proc/transition  (code/modules/stock_market/events.dm:82)  may sleep
rt.def("/datum/stockEvent/bankruptcy/proc/transition", function* transition(f: Frame) {
	let A: Value = null, X: Value = null, amt: Value = null, bailout: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [A, X, amt, bailout, $0, $1, $e];
	$0 = rt.sv(f, "phase_id");
	if ($0 === 0) {
		rt.setSv(f, "next_phase", add(rt.worldTime(f), multiply((yield* g.call(f, P("/proc/rand"), null, [210, 420])), 7)));
		if (!truthy(rt.gv(f, "opinion", (A = (yield* g.srcCall(f, "generateBankruptcyArticle")))))) {
			$0 = (yield* g.call(f, P("/proc/rand"), null, [5]));
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				$1 = -1;
			} else {
				$1 = 1;
			}
			rt.setSv(f, "effect", multiply($0, $1));
		} else {
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				$0 = multiply(rt.neg(rt.fv(f, "opinion", live(A))), (yield* g.call(f, P("/proc/rand"), null, [8])));
			} else {
				$0 = multiply(rt.fv(f, "opinion", live(A)), (yield* g.call(f, P("/proc/rand"), null, [4])));
			}
			rt.setSv(f, "effect", $0);
		}
		yield* g.callName(f, rt.sv(f, "company"), "addArticle", [live(A)]);
		yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [(yield* g.call(f, P("/proc/rand"), null, [-6, -3]))]);
		rt.setSv(f, "hidden", 0);
		rt.setSv(f, "current_title", "Bailout pending due to bankruptcy");
		rt.setSv(f, "current_desc", fmt("The government prepared a press release, which will occur at spacetime ＀.", [(yield* g.srcCall(f, "spacetime", rt.sv(f, "next_phase")))]));
		rt.setSv(f, "phase_id", 1);
	} else if ($0 === 1) {
		rt.setSv(f, "next_phase", add(rt.worldTime(f), multiply((yield* g.call(f, P("/proc/rand"), null, [210, 420])), 7)));
		rt.setSv(f, "finished", 1);
		if ((rt.le(rt.sv(f, "effect"), -5) && truthy(rt.op(f, "Prob", [], [10])))) {
			rt.setSv(f, "current_title", fmt("＀: Complete crash", [rt.fv(f, "name", rt.sv(f, "company"))]));
			rt.setSv(f, "current_desc", "The company had gone bankrupt, was not bailed out and could not recover. No further stock trade will take place. All shares in the company are effectively worthless.");
			rt.setFv(f, "bankrupt", rt.sv(f, "company"), 1);
			X = null;
			rt.forList(f, 0, rt.fv(f, "shareholders", rt.sv(f, "company")));
			while (($e = rt.next(f, 0)) !== undefined) {
				X = $e;
				amt = rt.index(rt.fv(f, "shareholders", rt.sv(f, "company")), live(X));
				yield* g.callName(f, rt.gl("stockExchange"), "balanceLog", [live(X), multiply(rt.neg(live(amt)), rt.fv(f, "current_value", rt.sv(f, "company")))]);
			}
			rt.endFor(f, 0);
			rt.setFv(f, "shareholders", rt.sv(f, "company"), rt.list());
			rt.setFv(f, "current_value", rt.sv(f, "company"), 0);
			rt.setFv(f, "borrow_brokers", rt.sv(f, "company"), rt.list());
			yield* g.callName(f, rt.gl("stockExchange"), "generateStocks", [1]);
		}
		bailout = (((rt.gt(rt.sv(f, "effect"), 0) ? 1 : 0) && rt.op(f, "Prob", [], [80])) || ((rt.lt(rt.sv(f, "effect"), 0) ? 1 : 0) && rt.op(f, "Prob", [], [20])));
		$0 = rt.fv(f, "name", rt.sv(f, "company"));
		if (truthy(live(bailout))) {
			$0 = $0;
			$1 = "bailed out";
		} else {
			$1 = "on a painful rebound";
		}
		rt.setSv(f, "current_title", fmt("＀ ＀", [$0, $1]));
		if (truthy(live(bailout))) {
			rt.setSv(f, "current_desc", "The company has been bailed out by the government. Investors are highly optimistic.");
			yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [multiply(rt.op(f, "Abs", [], [rt.sv(f, "effect")]), 2)]);
		} else {
			rt.setSv(f, "current_desc", "The company was not bailed out, but managed to crawl out of bankruptcy. Stockholder trust is severely dented.");
			yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [divide(rt.neg(rt.op(f, "Abs", [], [rt.sv(f, "effect")])), 2)]);
		}
		yield* g.callName(f, rt.sv(f, "company"), "generateEvent", [rt.sv(f, "type")]);
	}
	return f.dot;
}, true);

// /datum/stockEvent/bankruptcy/proc/generateBankruptcyArticle  (code/modules/stock_market/events.dm:122)
rt.def("/datum/stockEvent/bankruptcy/proc/generateBankruptcyArticle", function generateBankruptcyArticle(f: Frame) {
	let A: Value = null, bankrupt_reason: Value = null, article: Value = null;
	let $0: any;
	f.vars = () => [A, bankrupt_reason, article, $0];
	A = rt.new_(f, T("/datum/article"), []);
	bankrupt_reason = rt.list("investor pessimism", "failure of product lines", "economic recession", "overblown inflation", "overblown deflation", "collapsed pyramid schemes", "a Ponzi scheme", "economic terrorism", "extreme hedonism", "unfavourable economic climate", "rampant government corruption", "divine conspiracy", "some total bullshit", "volatile plans");
	rt.setFv(f, "about", live(A), rt.sv(f, "company"));
	rt.setFv(f, "headline", live(A), rt.op(f, "PickUnweighted", [4], [fmt("＀ filing for bankruptcy", [rt.fv(f, "name", rt.sv(f, "company"))]), fmt("＀ unable to pay, investors run", [rt.fv(f, "name", rt.sv(f, "company"))]), fmt("＀ crashes, in foreclosure", [rt.fv(f, "name", rt.sv(f, "company"))]), fmt("＀ in dire need of credits", [rt.fv(f, "name", rt.sv(f, "company"))])]));
	rt.setFv(f, "subtitle", live(A), "Investors panic, bailout pending");
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		rt.setFv(f, "opinion", live(A), rt.call(f, P("/proc/rand"), null, [-1, 1]));
	}
	if (rt.gt(rt.fv(f, "current_trend", rt.sv(f, "company")), 0)) {
		$0 = "despite their positive trend";
	} else {
		$0 = "in line with their failing model";
	}
	article = fmt("Another one might bite the dust: ＀, ＀ files for bankruptcy citing ＀. The president of %country% has been asked to bail the company out, ", [$0, rt.fv(f, "name", rt.sv(f, "company")), rt.op(f, "PickUnweighted", [1], [live(bankrupt_reason)])]);
	if (!truthy(rt.fv(f, "opinion", live(A)))) {
		article = rt.modify(live(article), "but no answer has been given by the government to date. Our tip to stay safe is: %sell%", add);
	} else {
		if (rt.gt(rt.fv(f, "opinion", live(A)), 0)) {
			article = rt.modify(live(article), "and the government responded positively. When the share value hits its lowest, it is a safe bet to %buy%", add);
		} else {
			article = rt.modify(live(article), "but the outlook is not good. For investors, now would be an ideal time to %sell%", add);
		}
	}
	rt.setFv(f, "article", live(A), rt.callName(f, live(A), "detokenize", [live(article), rt.gv(f, "tokens", rt.fv(f, "industry", rt.sv(f, "company")))]));
	return live(A);
});

rt.type(4209, "/datum/stockEvent/arrest", "/datum/stockEvent", {
	female: 0,
	tname: "Elvis Presley",
	position: "CEO",
	offenses: "murder",
	effect: 0,
	name: "arrest",
});

// /datum/stockEvent/arrest/proc/New  (code/modules/stock_market/events.dm:152)
rt.def("/datum/stockEvent/arrest/proc/New", function New(f: Frame, S: Value) {
	let mins: Value = null, O: Value = null, offense: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [mins, O, offense, $0, $1, $2];
	rt.setSv(f, "hidden", 1);
	rt.setSv(f, "company", live(S));
	rt.setSv(f, "next_phase", add(multiply(multiply((mins = rt.call(f, P("/proc/rand"), null, [7, 24.5])), 600), 0.699999988079071), rt.worldTime(f)));
	rt.setSv(f, "current_title", "");
	rt.setSv(f, "current_desc", "");
	rt.setSv(f, "female", rt.op(f, "Prob", [], [50]));
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			$0 = rt.call(f, P("/proc/vowel"), null, []);
		} else {
			$0 = rt.call(f, P("/proc/consonant"), null, []);
		}
		rt.setSv(f, "position", fmt("C＀O", [$0]));
	} else {
		rt.setSv(f, "position", rt.call(f, P("/proc/ucfirsts"), null, [rt.callName(f, rt.fv(f, "industry", rt.sv(f, "company")), "detokenize", ["Lead %industrial% Engineer"])]));
	}
	rt.setSv(f, "offenses", "");
	O = rt.list("corruption", "murder", "grand theft", "assault", "battery", "drug possession", "burglary", "theft", "grand sabotage", "bribery", "disorderly conduct", "treason", "sedition", "shoplifting", "tax evasion", "tax fraud", "insurance fraud", "perjury", "kidnapping", "manslaughter", "vandalism", "forgery", "extortion", "embezzlement", "public indecency", "public intoxication", "trespassing", "loitering", "littering", "vigilantism", "squatting", "panhandling", "arson", "spacepodjacking", "shuttlejacking", "carjacking", "singularityjacking", "dereliction of duty", "spacecraft piracy", "music piracy", "tabletop game piracy", "software piracy", "escaping from space prison", "seniornapping", "clownnapping", "corginapping", "catnapping", "sleeping on the job", "terrorism", "counterterrorism", "drug distribution", "insubordination", "jaywalking", "owning a computer", "owning a cellphone", "owning a PDA", "owning a pAI", "adultery", "committing an unnatural act with another person", "corrupting public morals", "skateboarding without a license", "shitcurity", "bestiality", "erotic roleplay", "accidentally strangling a prostitute");
	while (truthy(rt.op(f, "Prob", [], [60])) && rt.gt(rt.len(f, live(O)), 2)) {
		(O = rt.modify(live(O), (offense = rt.op(f, "PickUnweighted", [1], [live(O)])), subtract));
		if (truthy(rt.op(f, "Prob", [], [20]))) {
			$0 = "attempted ";
		} else {
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				$0 = "being accessory to ";
			} else {
				$0 = null;
			}
		}
		$1 = live(offense);
		if (truthy(rt.op(f, "Prob", [], [5]))) {
			$2 = fmt(" of the ＀ degree", [rt.op(f, "PickUnweighted", [6], ["first", "second", "third", "fourth", "fifth", "sixth"])]);
		} else {
			$2 = null;
		}
		offense = fmt("＀＀＀", [$0, $1, $2]);
		if (isEqual(rt.sv(f, "offenses"), "")) {
			rt.setSv(f, "offenses", live(offense));
		} else {
			rt.modSrcVar(f, "offenses", fmt(", ＀", [live(offense)]), add);
		}
	}
	if (truthy(rt.op(f, "Prob", [], [20]))) {
		$0 = "attempted ";
	} else {
		$0 = null;
	}
	rt.modSrcVar(f, "offenses", fmt(" and ＀＀", [$0, rt.op(f, "PickUnweighted", [1], [live(O)])]), add);
	rt.callName(f, live(S), "addEvent", [live(f.src)]);
	return f.dot;
});

// /datum/stockEvent/arrest/proc/transition  (code/modules/stock_market/events.dm:181)  may sleep
rt.def("/datum/stockEvent/arrest/proc/transition", function* transition(f: Frame) {
	let A: Value = null;
	let $0: any, $1: any;
	f.vars = () => [A, $0, $1];
	$0 = rt.sv(f, "phase_id");
	if ($0 === 0) {
		if (truthy(rt.sv(f, "female"))) {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
		} else {
			$0 = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
		}
		rt.setSv(f, "tname", fmt("＀ ＀", [$0, rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")])]));
		rt.setSv(f, "next_phase", add(rt.worldTime(f), multiply((yield* g.call(f, P("/proc/rand"), null, [210, 420])), 7)));
		if (!truthy(rt.gv(f, "opinion", (A = (yield* g.srcCall(f, "generateArrestArticle")))))) {
			$0 = (yield* g.call(f, P("/proc/rand"), null, [5]));
			if (truthy(rt.op(f, "Prob", [], [50]))) {
				$1 = -1;
			} else {
				$1 = 1;
			}
			rt.setSv(f, "effect", multiply($0, $1));
		} else {
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				$0 = multiply(rt.neg(rt.fv(f, "opinion", live(A))), (yield* g.call(f, P("/proc/rand"), null, [5])));
			} else {
				$0 = multiply(rt.fv(f, "opinion", live(A)), (yield* g.call(f, P("/proc/rand"), null, [3])));
			}
			rt.setSv(f, "effect", $0);
		}
		yield* g.callName(f, rt.sv(f, "company"), "addArticle", [live(A)]);
		yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [(yield* g.call(f, P("/proc/rand"), null, [-3, -1]))]);
		rt.setSv(f, "hidden", 0);
		rt.setSv(f, "current_title", fmt("Trial of ＀ (＀) scheduled", [rt.sv(f, "tname"), rt.sv(f, "position")]));
		if (truthy(rt.sv(f, "female"))) {
			$0 = "She";
		} else {
			$0 = "He";
		}
		rt.setSv(f, "current_desc", fmt("＀ has been charged with ＀; the trial is scheduled to occur at spacetime ＀.", [$0, rt.sv(f, "offenses"), (yield* g.srcCall(f, "spacetime", rt.sv(f, "next_phase")))]));
		rt.setSv(f, "phase_id", 1);
	} else if ($0 === 1) {
		rt.setSv(f, "next_phase", add(rt.worldTime(f), multiply((yield* g.call(f, P("/proc/rand"), null, [210, 420])), 7)));
		rt.setSv(f, "finished", 1);
		$0 = rt.sv(f, "tname");
		if (rt.gt(rt.sv(f, "effect"), 0)) {
			$1 = "acquitted";
		} else {
			$1 = "found guilty";
		}
		rt.setSv(f, "current_title", fmt("＀ ＀", [$0, $1]));
		if (rt.gt(rt.sv(f, "effect"), 0)) {
			rt.setSv(f, "current_desc", "The accused has been acquitted of all charges. Investors optimistic.");
		} else {
			rt.setSv(f, "current_desc", "The accused has been found guilty of all charges. Investor trust takes massive hit.");
		}
		yield* g.callName(f, rt.sv(f, "company"), "affectPublicOpinion", [rt.sv(f, "effect")]);
		yield* g.callName(f, rt.sv(f, "company"), "generateEvent", [rt.sv(f, "type")]);
	}
	return f.dot;
}, true);

// /datum/stockEvent/arrest/proc/generateArrestArticle  (code/modules/stock_market/events.dm:208)
rt.def("/datum/stockEvent/arrest/proc/generateArrestArticle", function generateArrestArticle(f: Frame) {
	let A: Value = null, article: Value = null;
	f.vars = () => [A, article];
	rt.setFv(f, "about", (A = rt.new_(f, T("/datum/article"), [])), rt.sv(f, "company"));
	rt.setFv(f, "headline", live(A), rt.callName(f, rt.fv(f, "industry", rt.sv(f, "company")), "detokenize", [rt.op(f, "PickUnweighted", [6], [fmt("＀, ＀ of ＀ arrested", [rt.sv(f, "tname"), rt.sv(f, "position"), rt.fv(f, "name", rt.sv(f, "company"))]), fmt("＀ of ＀ facing jail time", [rt.sv(f, "position"), rt.fv(f, "name", rt.sv(f, "company"))]), fmt("＀ behind bars", [rt.sv(f, "tname")]), fmt("＀ of %industrial% company before trial", [rt.sv(f, "position")]), fmt("Police arrest ＀ in daring raid", [rt.sv(f, "tname")]), fmt("Job vacancy ahead: ＀'s ＀ in serious trouble", [rt.fv(f, "name", rt.sv(f, "company")), rt.sv(f, "position")])])]));
	rt.setFv(f, "subtitle", live(A), fmt("＀ reporting directly from the courtroom", [rt.fv(f, "author", live(A))]));
	if (truthy(rt.op(f, "Prob", [], [15]))) {
		rt.setFv(f, "opinion", live(A), rt.call(f, P("/proc/rand"), null, [-1, 1]));
	}
	article = fmt("＀ forces issued a statement that ＀, the ＀ of ＀, the %famous% %industrial% %company% was arrested %this_time%. The trial has been scheduled and the statement reports that the arrested individual is being charged with ＀. ", [rt.op(f, "PickUnweighted", [2], ["Security", "Law enforcement"]), rt.sv(f, "tname"), rt.sv(f, "position"), rt.fv(f, "name", rt.sv(f, "company")), rt.sv(f, "offenses")]);
	if (!truthy(rt.fv(f, "opinion", live(A)))) {
		article = rt.modify(live(article), "While we cannot predict the outcome of this trial, our tip to stay safe is: %sell%", add);
	} else {
		if (rt.gt(rt.fv(f, "opinion", live(A)), 0)) {
			article = rt.modify(live(article), "Our own investigation shows that these charges are baseless and the arrest is most likely a publicity stunt. Our advice? You should %buy%", add);
		} else {
			article = rt.modify(live(article), fmt("＀ has a prior history of similar misdeeds and we're confident the charges will stand. For investors, now would be an ideal time to %sell%", [rt.sv(f, "tname")]), add);
		}
	}
	rt.setFv(f, "article", live(A), rt.callName(f, live(A), "detokenize", [live(article), rt.gv(f, "tokens", rt.fv(f, "industry", rt.sv(f, "company")))]));
	return live(A);
});
