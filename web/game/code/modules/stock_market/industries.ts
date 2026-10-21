// From code/modules/stock_market/industries.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4210, "/datum/industry", "/datum", {
	name: "Industry",
	tokens: null,
	title_templates: null,
	title_templates_neutral: null,
	title_templates_bad: null,
	title_templates_ooc: null,
	subtitle_templates: null,
});

// /datum/industry/proc/<init>  (code/modules/stock_market/industries.dm:3)
rt.def("/datum/industry/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.list());
	rt.setSv(f, "title_templates", rt.list("The brand new %product_name% by %company_name% will revolutionize %industry%", "%jobs% rejoice as %product_name% hits shelves", "Does %product_name% threaten to reorganize the %industrial% status quo?", "%company_name% headed toward corporate renaissance with %product_name%"));
	rt.setSv(f, "title_templates_neutral", rt.list("%product_name%: as if nothing happened", "Nothing new but the name: %product_name% not quite exciting %jobs%", "Same old %company_name%, same old product", "%product_name% underwhelms, but sells"));
	rt.setSv(f, "title_templates_bad", rt.list("%product_name% shaping up to be the disappointment of the century", "Recipe for disaster: %company_name% releases %product_name%", "Atrocious quality - %jobs% boycott %product_name%", "%product_name%: Inside the worst product launch in recent history"));
	rt.setSv(f, "title_templates_ooc", rt.list("%company_name% is looking to enter the %industry% playing field with %product_name%", "%company_name% broadens spectrum, %product_name% is their latest and greatest"));
	rt.setSv(f, "subtitle_templates", rt.list("%author% investigates whether or not you should invest!", "%outlet%'s very own %author% takes it to the magnifying glass", "%outlet% lets you know if you should use it", "Read our top tips for investors", "%author% wants you to know if it's a safe bet to buy"));
	return f.dot;
});

// /datum/industry/proc/generateInCharacterProductArticle  (code/modules/stock_market/industries.dm:32)
rt.def("/datum/industry/proc/generateInCharacterProductArticle", function generateInCharacterProductArticle(f: Frame, product_name: Value, S: Value) {
	let A: Value = null, add_tokens: Value = null, article: Value = null;
	f.vars = () => [A, add_tokens, article];
	A = rt.new_(f, T("/datum/article"), []);
	add_tokens = rt.alist(f, ["company_name", rt.fv(f, "name", live(S)), "product_name", live(product_name), "outlet", rt.fv(f, "outlet", live(A)), "author", rt.fv(f, "author", live(A))]);
	rt.setFv(f, "about", live(A), live(S));
	rt.setFv(f, "opinion", live(A), rt.call(f, P("/proc/rand"), null, [-1, 1]));
	rt.setFv(f, "subtitle", live(A), rt.callName(f, live(A), "detokenize", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "subtitle_templates")]), rt.sv(f, "tokens"), live(add_tokens)]));
	article = fmt("%company_name% %expand_influence% %industry%. ＀ %hit_shelves% %this_time% ", [rt.call(f, P("/proc/ucfirst"), null, [live(product_name)])]);
	if (rt.gt(rt.fv(f, "opinion", live(A)), 0)) {
		rt.setFv(f, "headline", live(A), rt.callName(f, live(A), "detokenize", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "title_templates")]), rt.sv(f, "tokens"), live(add_tokens)]));
		article = rt.modify(live(article), "but %positive_outcome%, %signifying% the %resounding% %success% the product is. The %stock_market% is %excited% over this %development%, and %stockholder% optimism is expected to %rise% as well as the stock value. Our advice: %buy%.", add);
	} else {
		if (isEqual(rt.fv(f, "opinion", live(A)), 0)) {
			rt.setFv(f, "headline", live(A), rt.callName(f, live(A), "detokenize", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "title_templates_neutral")]), rt.sv(f, "tokens"), live(add_tokens)]));
			article = rt.modify(live(article), "but %neutral_outcome%. For the average %stockholder%, no significant change on the market will be apparent over this %development%. Our advice is to continue investing as if this product was never released.", add);
		} else {
			rt.setFv(f, "headline", live(A), rt.callName(f, live(A), "detokenize", [rt.op(f, "PickUnweighted", [1], [rt.sv(f, "title_templates_bad")]), rt.sv(f, "tokens"), live(add_tokens)]));
			article = rt.modify(live(article), "but %negative_outcome%. Following this %complete% %failure%, %stockholder% optimism and stock value are projected to %dip%. Our advice: %sell%.", add);
		}
	}
	rt.setFv(f, "article", live(A), rt.callName(f, live(A), "detokenize", [live(article), rt.sv(f, "tokens"), live(add_tokens)]));
	return live(A);
});

// /datum/industry/proc/detokenize  (code/modules/stock_market/industries.dm:52)
rt.def("/datum/industry/proc/detokenize", function detokenize(f: Frame, str: Value) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [str, _T, $e];
	_T = null;
	rt.forList(f, 0, rt.sv(f, "tokens"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		str = rt.call(f, P("/proc/replacetext"), null, [live(str), fmt("%＀%", [live(_T)]), rt.op(f, "PickUnweighted", [1], [rt.index(rt.sv(f, "tokens"), live(_T))])]);
	}
	rt.endFor(f, 0);
	return live(str);
});

rt.type(4211, "/datum/industry/agriculture", "/datum/industry", {
	name: "Agriculture",
	tokens: null,
	title_templates: null,
	title_templates_ooc: null,
});

// /datum/industry/agriculture/proc/<init>  (code/modules/stock_market/industries.dm:58)
rt.def("/datum/industry/agriculture/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("agriculture", "farming", "botany", "horticulture", "hydroponics"), "industrial", rt.list("agricultural", "horticultural", "botanical"), "jobs", rt.list("farmers", "agricultural experts", "botanists", "assistant gardeners")]));
	rt.setSv(f, "title_templates", rt.list("The brand new %product_name% by %company_name% will revolutionize %industry%", "%jobs% rejoice as %product_name% hits shelves", "Does %product name% threaten to reorganize the %industrial% status quo?", "Took it for a field trip: our first %sneak_peek% of %product_name%.", "Reaping the fruits of %product_name% - %sneak_peek% by %author%", "Cultivating a new %industrial% future with %product_name%", "%company_name% grows and thrives: %product_name% now on the farmer's market", "It's almost harvest season: %product_name% promises to ease your life", "Become the best on the farmer's market with %product_name%", "%product_name%: a gene-modified reimagination of an age-old classic"));
	rt.setSv(f, "title_templates_ooc", rt.list("%company_name% is looking to enter the %industry% playing field with %product_name%", "A questionable decision: %product_name% grown on the soil of %company_name%", "%company_name% broadens spectrum, %product_name% is their latest and greatest", "Will %company_name% grow on %industrial% wasteland? Owners of %product_name% may decide", "%company_name% looking to reap profits off the %industrial% sector with %product_name%"));
	return f.dot;
});

// /datum/industry/agriculture/proc/generateProductName  (code/modules/stock_market/industries.dm:82)
rt.def("/datum/industry/agriculture/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let products: Value = null, prefix: Value = null, suffix: Value = null;
	f.vars = () => [products, prefix, suffix];
	products = rt.list("water tank", "cattle prod", "scythe", "plough", "sickle", "cultivator", "loy", "spade", "hoe", "daisy grubber", "cotton gin");
	prefix = rt.list(fmt("＀'s ", [live(company_name)]), fmt("the ＀ ", [live(company_name)]), "the fully automatic ", "the full-duplex ", "the semi-automatic ", "the drone-mounted ", "the industry-leading ", "the world-class ");
	suffix = rt.list(" of farming", " multiplex", fmt(" +＀", [rt.call(f, P("/proc/rand"), null, [1, 15])]), fmt(" ＀＀", [rt.call(f, P("/proc/consonant"), null, []), rt.call(f, P("/proc/rand"), null, [1000, 9999])]), " hybrid", " maximus", " extreme");
	return fmt("＀＀＀", [rt.op(f, "PickUnweighted", [1], [live(prefix)]), rt.op(f, "PickUnweighted", [1], [live(products)]), rt.op(f, "PickUnweighted", [1], [live(suffix)])]);
});

rt.type(4212, "/datum/industry/it", "/datum/industry", {
	name: "Information Technology",
	tokens: null,
});

// /datum/industry/it/proc/<init>  (code/modules/stock_market/industries.dm:90)
rt.def("/datum/industry/it/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("information technology", "computing", "computer industry"), "industrial", rt.list("information technological", "computing", "computer industrial"), "jobs", rt.list("coders", "electricians", "engineers", "programmers", "devops experts", "developers")]));
	return f.dot;
});

// /datum/industry/it/proc/latin_number  (code/modules/stock_market/industries.dm:97)
rt.def("/datum/industry/it/proc/latin_number", function latin_number(f: Frame, n: Value) {
	let $0: any;
	f.vars = () => [$0];
	if ((rt.lt(live(n), 20) || !truthy(rt.modulus(live(n), 10)))) {
		$0 = live(n);
		if ($0 === 0) {
			return "Nihil";
		} else if ($0 === 1) {
			return "Unus";
		} else if ($0 === 2) {
			return "Duo";
		} else if ($0 === 3) {
			return "Tres";
		} else if ($0 === 4) {
			return "Quattour";
		} else if ($0 === 5) {
			return "Quinque";
		} else if ($0 === 6) {
			return "Sex";
		} else if ($0 === 7) {
			return "Septem";
		} else if ($0 === 8) {
			return "Octo";
		} else if ($0 === 9) {
			return "Novem";
		} else if ($0 === 10) {
			return "Decim";
		} else if ($0 === 11) {
			return "Undecim";
		} else if ($0 === 12) {
			return "Duodecim";
		} else if ($0 === 13) {
			return "Tredecim";
		} else if ($0 === 14) {
			return "Quattourdecim";
		} else if ($0 === 15) {
			return "Quindecim";
		} else if ($0 === 16) {
			return "Sedecim";
		} else if ($0 === 17) {
			return "Septdecim";
		} else if ($0 === 18) {
			return "Duodeviginti";
		} else if ($0 === 19) {
			return "Undeviginti";
		} else if ($0 === 20) {
			return "Viginti";
		} else if ($0 === 30) {
			return "Triginta";
		} else if ($0 === 40) {
			return "Quadriginta";
		} else if ($0 === 50) {
			return "Quinquaginta";
		} else if ($0 === 60) {
			return "Sexaginta";
		} else if ($0 === 70) {
			return "Septuaginta";
		} else if ($0 === 80) {
			return "Octoginta";
		} else if ($0 === 90) {
			return "Nonaginta";
		}
	} else {
		return fmt("＀ ＀", [rt.callSrc(f, "latin_number", [subtract(live(n), rt.modulus(live(n), 10))]), rt.call(f, P("/proc/lowertext"), null, [rt.callSrc(f, "latin_number", [rt.modulus(live(n), 10)])])]);
	}
	return f.dot;
});

// /datum/industry/it/proc/generateProductName  (code/modules/stock_market/industries.dm:132)
rt.def("/datum/industry/it/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let products: Value = null, prefix: Value = null, L: Value = null, N: Value = null, prefix2: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [products, prefix, L, N, prefix2, $0, $1, $2];
	products = rt.list("generator", "laptop", "keyboard", "memory card", "display", "operating system", "processor", "graphics card", "nanobots", "power supply", "pAI", "mech", "capacitor", "cell");
	prefix = rt.list(fmt("the ＀ ", [live(company_name)]), "the high performance ", "the mobile ", "the portable ", "the professional ", "the extreme ", "the incredible ", "the blazing fast ", "the bleeding edge ", "the bluespace-powered ", null);
	L = rt.op(f, "PickUnweighted", [8], [rt.call(f, P("/proc/consonant"), null, []), "Seed ", "Radiant ", "Robust ", "Pentathon ", "Athlete ", "Phantom ", "Semper Fi "]);
	N = rt.call(f, P("/proc/rand"), null, [0, 99]);
	$0 = live(L);
	$1 = live(N);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		$2 = add(" ", rt.callSrc(f, "latin_number", [live(N)]));
	} else {
		$2 = null;
	}
	prefix2 = fmt("＀＀＀", [$0, $1, $2]);
	return fmt("＀＀ ＀", [rt.op(f, "PickUnweighted", [1], [live(prefix)]), live(prefix2), rt.op(f, "PickUnweighted", [1], [live(products)])]);
});

rt.type(4213, "/datum/industry/communications", "/datum/industry", {
	name: "Communications",
	tokens: null,
});

// /datum/industry/communications/proc/<init>  (code/modules/stock_market/industries.dm:140)
rt.def("/datum/industry/communications/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("telecommunications", "telecomms"), "industrial", rt.list("telecommunicational"), "jobs", rt.list("electrical engineers", "microengineers", "developers")]));
	return f.dot;
});

// /datum/industry/communications/proc/generateProductName  (code/modules/stock_market/industries.dm:148)
rt.def("/datum/industry/communications/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let products: Value = null, prefix: Value = null, L: Value = null, N: Value = null, prefix2: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [products, prefix, L, N, prefix2, $0, $1, $2];
	products = rt.list("mobile phone", "PDA", "tablet computer", "newscaster", "social network");
	prefix = rt.list(fmt("the ＀ ", [live(company_name)]), "the high performance ", "the mobile ", "the portable ", "the professional ", "the extreme ", "the incredible ", "the blazing fast ", "the bleeding edge ", null);
	L = rt.op(f, "PickUnweighted", [7], [fmt("＀Phone ", [rt.call(f, P("/proc/lowertext"), null, [rt.call(f, P("/proc/consonant"), null, [])])]), "Universe ", "Xperience ", "Next ", "Engin Y ", "Cyborg ", fmt("＀", [rt.call(f, P("/proc/consonant"), null, [])])]);
	N = rt.call(f, P("/proc/rand"), null, [1, 99]);
	$0 = live(L);
	$1 = live(N);
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		$2 = rt.op(f, "PickUnweighted", [12], [" Tiny", " Mini", " Micro", " Slim", " Water", " Air", " Fire", " Earth", " Nano", " Pico", " Femto", " Planck"]);
	} else {
		$2 = null;
	}
	prefix2 = fmt("＀＀＀", [$0, $1, $2]);
	return fmt("＀＀ ＀", [rt.op(f, "PickUnweighted", [1], [live(prefix)]), live(prefix2), rt.op(f, "PickUnweighted", [1], [live(products)])]);
});

rt.type(4214, "/datum/industry/health", "/datum/industry", {
	name: "Medicine",
	tokens: null,
});

// /datum/industry/health/proc/<init>  (code/modules/stock_market/industries.dm:156)
rt.def("/datum/industry/health/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("medicine"), "industrial", rt.list("medicinal"), "jobs", rt.list("medical doctors", "nurses", "paramedics", "psychologists", "psychiatrists", "chemists")]));
	return f.dot;
});

// /datum/industry/health/proc/generateProductName  (code/modules/stock_market/industries.dm:166)
rt.def("/datum/industry/health/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let prefix: Value = null, suffix: Value = null, uses: Value = null;
	f.vars = () => [prefix, suffix, uses];
	prefix = rt.list("amino", "nucleo", "nitro", "panto", "meth", "eth", "as", "algo", "coca", "hero", "lotsu", "opiod", "morph", "trinitro", "prop", "but", "acet", "acyclo", "lansop", "dyclo", "hydro", "oxycod", "vicod", "cannabi", "cryo", "dex", "chloro");
	suffix = rt.list("phen", "pirin", "pyrine", "ane", "amphetamine", "prazoline", "ine", "yl", "amine", "aminophen", "one", "ide", "phenate", "anol", "toulene", "glycerine", "vir", "tol", "trinic", "oxide");
	uses = rt.list("antidepressant", "analgesic", "anesthetic", "antiretroviral", "antiviral", "antibiotic", "cough drop", "depressant", "hangover cure", "homeopathic", "fertility drug", "hypnotic", "narcotic", "laxative", "multivitamin", "patch", "purgative", "relaxant", "steroid", "sleeping pill", "suppository", "tranquilizer");
	return fmt("＀＀, the ＀", [rt.op(f, "PickUnweighted", [1], [live(prefix)]), rt.op(f, "PickUnweighted", [1], [live(suffix)]), rt.op(f, "PickUnweighted", [1], [live(uses)])]);
});

rt.type(4215, "/datum/industry/consumer", "/datum/industry", {
	name: "Consumer",
	tokens: null,
});

// /datum/industry/consumer/proc/<init>  (code/modules/stock_market/industries.dm:170)
rt.def("/datum/industry/consumer/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("shops", "stores"), "industrial", rt.list("consumer industrial"), "jobs", rt.list("shopkeepers", "assistants", "manual daytime hygiene engineers", "janitors", "chefs", "cooks")]));
	return f.dot;
});

// /datum/industry/consumer/proc/generateProductName  (code/modules/stock_market/industries.dm:179)
rt.def("/datum/industry/consumer/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let meat: Value = null, qualifier: Value = null;
	f.vars = () => [meat, qualifier];
	meat = rt.list("chicken", "lizard", "corgi", "monkey", "goat", "fly", "xenomorph", "human", "walrus", "wendigo", "bear", "clown", "turkey", "pork", "carp", "crab", "mimic", "mystery");
	return fmt("the ＀ ＀ meat product line", [rt.op(f, "PickUnweighted", [1], [(qualifier = rt.list("synthetic", "organic", "bio", "diet", "sugar-free", "paleolithic", "homeopathic", "recycled", "reclaimed", "vat-grown"))]), rt.op(f, "PickUnweighted", [1], [live(meat)])]);
});

rt.type(4216, "/datum/industry/mining", "/datum/industry", {
	name: "Mining",
	tokens: null,
});

// /datum/industry/mining/proc/<init>  (code/modules/stock_market/industries.dm:183)
rt.def("/datum/industry/mining/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("mines", "large scale mining operations"), "industrial", rt.list("resource acquisitional"), "jobs", rt.list("shaft miners", "drill operators", "mining foremen", "gibtonite handlers")]));
	return f.dot;
});

// /datum/industry/mining/proc/generateProductName  (code/modules/stock_market/industries.dm:192)
rt.def("/datum/industry/mining/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let equipment: Value = null, material: Value = null;
	f.vars = () => [equipment, material];
	equipment = rt.list("drill", "pickaxe", "shovel", "jackhammer", "mini-pickaxe", "power hammer", "power gloves", "power armor", "hardsuit", "kinetic accelerator", "resonator", "oxygen tank", "emergency bike horn");
	return fmt("the ＀ ＀", [rt.op(f, "PickUnweighted", [1], [(material = rt.list("mauxite", "pharosium", "molitz", "adamantium", "mithril", "cobryl", "bohrum", "claretine", "viscerite", "syreline", "cerenkite", "plasmastone", "gold", "koshmarite", "phoron", "carbon dioxide"))]), rt.op(f, "PickUnweighted", [1], [live(equipment)])]);
});

rt.type(4217, "/datum/industry/defense", "/datum/industry", {
	name: "Defense",
	tokens: null,
});

// /datum/industry/defense/proc/<init>  (code/modules/stock_market/industries.dm:196)
rt.def("/datum/industry/defense/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "tokens", rt.alist(f, ["industry", rt.list("defense", "warfare", "security", "law enforcement"), "industrial", rt.list("defense"), "jobs", rt.list("security officers", "government officials", "soldiers", "weapons engineers")]));
	return f.dot;
});

// /datum/industry/defense/proc/generateProductName  (code/modules/stock_market/industries.dm:205)
rt.def("/datum/industry/defense/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let equipment: Value = null, material: Value = null;
	f.vars = () => [equipment, material];
	equipment = rt.list("energy gun", "laser gun", "machine gun", "grenade", "stun baton", "artillery", "bomb", "attack drone", "missile", "chem sprayer");
	return fmt("the ＀ ＀", [rt.op(f, "PickUnweighted", [1], [(material = rt.list("bluespace", "stealth", "heat-seeking", "crime-seeking", "wide-range", "bioterror", "auto-reloading", "smart", "sentient", "rapid-fire", "species-targeting", "gibtonite", "mass-market", "perpetual-motion", "nuclear", "fission", "fusion"))]), rt.op(f, "PickUnweighted", [1], [live(equipment)])]);
});
