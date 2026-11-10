// Based on /tg/station's code/modules/stock_market/articles.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { add } = rt;


// articles.dm:2
rt.def("/proc/consonant", function consonant(f: Frame) {
	return pick("B", "C", "D", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "X", "Y", "Z");
});

// articles.dm:5
rt.def("/proc/vowel", function vowel(f: Frame) {
	return pick("A", "E", "I", "O", "U");
});

// articles.dm:8
rt.def("/proc/ucfirst", function ucfirst(f: Frame, S: Value) {
	return `${uppertext(ascii2text(text2ascii(S, 1)))}${copytext(S, 2)}`;
});

// articles.dm:11
rt.def("/proc/ucfirsts", function ucfirsts(f: Frame, S: Value) {
	let _P: Value = null;
	let L: Value = splittext(S, " ");
	let M: Value = list();
	for (_P of each(L)) {
		M += ucfirst(_P);
	}
	return jointext(M, " ");
});

// articles.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalFrozenAccounts", function InitGlobalFrozenAccounts(f: Frame) {
	GLOB.FrozenAccounts = list();
	this.gvars_datum_init_order += "FrozenAccounts";
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

// articles.dm:64
rt.def("/datum/article/proc/New", function New(f: Frame) {
	let ON: Value = null, authors: Value = null, AN: Value = null;
	parent_proc();
	if (rt.len(f, GLOB.outlets) && !prob(100 / (rt.len(f, GLOB.outlets) + 1)) || !rt.len(f, GLOB.outlets)) {
		if (!rt.isIn(f, (ON = this.generateOutletName()), GLOB.outlets)) {
			rt.setAt(GLOB.outlets, ON, list());
		}
		this.outlet = ON;
	} else {
		this.outlet = pick(GLOB.outlets);
	}
	if (rt.len(f, (authors = rt.index(GLOB.outlets, this.outlet))) && !prob(100 / (rt.len(f, authors) + 1)) || !rt.len(f, authors)) {
		AN = this.generateAuthorName();
		rt.modAt(GLOB.outlets, this.outlet, AN, add);
		this.author = AN;
	} else {
		this.author = pick(authors);
	}
	this.ticks = rt.worldTime(f);
	return f.dot;
});

// articles.dm:88
rt.def("/datum/article/proc/generateOutletName", function generateOutletName(f: Frame) {
	let locations: Value = list("Earth", "Luna", "Mars", "Saturn", "Jupiter", "Uranus", "Pluto", "Europa", "Io", "Phobos", "Deimos", "Space", "Venus", "Neptune", "Mercury", "Kalliope", "Ganymede", "Callisto", "Amalthea", "Himalia", "Orion", "Sybil", "Basil", "Badger", "Terry", "Artyom");
	let nouns: Value = list("Post", "Herald", "Sun", "Tribune", "Mail", "Times", "Journal", "Report");
	let timely: Value = list("Daily", "Hourly", "Weekly", "Biweekly", "Monthly", "Yearly");
	const die = rand(1, 2);
	if (die === 1) {
		return `The ${pick(locations)} ${pick(nouns)}`;
	} else if (die === 2) {
		return `The ${pick(timely)} ${pick(nouns)}`;
	}
	return f.dot;
});

// articles.dm:95
rt.def("/datum/article/proc/generateAuthorName", function generateAuthorName(f: Frame) {
	let $0: any = rand(1, 3);
	if ($0 === 1) {
		return `${consonant()}. ${pick(GLOB.last_names)}`;
	} else if ($0 === 2) {
		if (prob(50)) {
			$0 = pick(GLOB.first_names_male);
		} else {
			$0 = pick(GLOB.first_names_female);
		}
		return `${$0} ${consonant()}.${prob(50) ? `${consonant()}. ` : null} ${pick(GLOB.last_names)}`;
	} else if ($0 === 3) {
		if (prob(50)) {
			$0 = pick(GLOB.first_names_male);
		} else {
			$0 = pick(GLOB.first_names_female);
		}
		return `${$0} "${prob(50) ? pick(GLOB.first_names_male) : pick(GLOB.first_names_female)}" ${pick(GLOB.last_names)}`;
	}
	return f.dot;
});

// articles.dm:118
rt.def("/datum/article/proc/detokenize", function detokenize(f: Frame, token_string: Value, industry_tokens: Value, product_tokens: Value) {
	let I: Value = null;
	product_tokens ??= list();
	let T_list: Value = GLOB.default_tokens.Copy();
	for (I of each(industry_tokens)) {
		rt.setAt(T_list, I, rt.index(industry_tokens, I));
	}
	I = null;
	for (I of each(product_tokens)) {
		rt.setAt(T_list, I, list(rt.index(product_tokens, I)));
	}
	I = null;
	for (I of each(T_list)) {
		token_string = replacetext(token_string, `%${I}%`, pick(rt.index(T_list, I)));
	}
	return ucfirst(token_string);
});
