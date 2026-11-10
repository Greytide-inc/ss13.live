// Based on /tg/station's code/modules/stock_market/industries.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4210, "/datum/industry", "/datum", {
	name: "Industry",
	tokens: null,
	title_templates: null,
	title_templates_neutral: null,
	title_templates_bad: null,
	title_templates_ooc: null,
	subtitle_templates: null,
});

// industries.dm:3
rt.def("/datum/industry/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = list();
	this.title_templates = list("The brand new %product_name% by %company_name% will revolutionize %industry%", "%jobs% rejoice as %product_name% hits shelves", "Does %product_name% threaten to reorganize the %industrial% status quo?", "%company_name% headed toward corporate renaissance with %product_name%");
	this.title_templates_neutral = list("%product_name%: as if nothing happened", "Nothing new but the name: %product_name% not quite exciting %jobs%", "Same old %company_name%, same old product", "%product_name% underwhelms, but sells");
	this.title_templates_bad = list("%product_name% shaping up to be the disappointment of the century", "Recipe for disaster: %company_name% releases %product_name%", "Atrocious quality - %jobs% boycott %product_name%", "%product_name%: Inside the worst product launch in recent history");
	this.title_templates_ooc = list("%company_name% is looking to enter the %industry% playing field with %product_name%", "%company_name% broadens spectrum, %product_name% is their latest and greatest");
	this.subtitle_templates = list("%author% investigates whether or not you should invest!", "%outlet%'s very own %author% takes it to the magnifying glass", "%outlet% lets you know if you should use it", "Read our top tips for investors", "%author% wants you to know if it's a safe bet to buy");
	return f.dot;
});

// industries.dm:32
rt.def("/datum/industry/proc/generateInCharacterProductArticle", function generateInCharacterProductArticle(f: Frame, product_name: Value, S: Value) {
	let A: Value = new_(T("/datum/article"));
	let add_tokens: Value = rt.alist(f, ["company_name", S.name, "product_name", product_name, "outlet", A.outlet, "author", A.author]);
	A.about = S;
	A.opinion = rand(-1, 1);
	A.subtitle = A.detokenize(pick(this.subtitle_templates), this.tokens, add_tokens);
	let article: Value = `%company_name% %expand_influence% %industry%. ${ucfirst(product_name)} %hit_shelves% %this_time% `;
	if (A.opinion > 0) {
		A.headline = A.detokenize(pick(this.title_templates), this.tokens, add_tokens);
		article += "but %positive_outcome%, %signifying% the %resounding% %success% the product is. The %stock_market% is %excited% over this %development%, and %stockholder% optimism is expected to %rise% as well as the stock value. Our advice: %buy%.";
	} else if (A.opinion == 0) {
		A.headline = A.detokenize(pick(this.title_templates_neutral), this.tokens, add_tokens);
		article += "but %neutral_outcome%. For the average %stockholder%, no significant change on the market will be apparent over this %development%. Our advice is to continue investing as if this product was never released.";
	} else {
		A.headline = A.detokenize(pick(this.title_templates_bad), this.tokens, add_tokens);
		article += "but %negative_outcome%. Following this %complete% %failure%, %stockholder% optimism and stock value are projected to %dip%. Our advice: %sell%.";
	}
	A.article = A.detokenize(article, this.tokens, add_tokens);
	return A;
});

// industries.dm:52
rt.def("/datum/industry/proc/detokenize", function detokenize(f: Frame, str: Value) {
	let _T: Value = null;
	for (_T of each(this.tokens)) {
		str = replacetext(str, `%${_T}%`, pick(rt.index(this.tokens, _T)));
	}
	return str;
});

rt.type(4211, "/datum/industry/agriculture", "/datum/industry", {
	name: "Agriculture",
	tokens: null,
	title_templates: null,
	title_templates_ooc: null,
});

// industries.dm:58
rt.def("/datum/industry/agriculture/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("agriculture", "farming", "botany", "horticulture", "hydroponics"), "industrial", list("agricultural", "horticultural", "botanical"), "jobs", list("farmers", "agricultural experts", "botanists", "assistant gardeners")]);
	this.title_templates = list("The brand new %product_name% by %company_name% will revolutionize %industry%", "%jobs% rejoice as %product_name% hits shelves", "Does %product name% threaten to reorganize the %industrial% status quo?", "Took it for a field trip: our first %sneak_peek% of %product_name%.", "Reaping the fruits of %product_name% - %sneak_peek% by %author%", "Cultivating a new %industrial% future with %product_name%", "%company_name% grows and thrives: %product_name% now on the farmer's market", "It's almost harvest season: %product_name% promises to ease your life", "Become the best on the farmer's market with %product_name%", "%product_name%: a gene-modified reimagination of an age-old classic");
	this.title_templates_ooc = list("%company_name% is looking to enter the %industry% playing field with %product_name%", "A questionable decision: %product_name% grown on the soil of %company_name%", "%company_name% broadens spectrum, %product_name% is their latest and greatest", "Will %company_name% grow on %industrial% wasteland? Owners of %product_name% may decide", "%company_name% looking to reap profits off the %industrial% sector with %product_name%");
	return f.dot;
});

// industries.dm:82
rt.def("/datum/industry/agriculture/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let products: Value = list("water tank", "cattle prod", "scythe", "plough", "sickle", "cultivator", "loy", "spade", "hoe", "daisy grubber", "cotton gin");
	let prefix: Value = list(`${company_name}'s `, `the ${company_name} `, "the fully automatic ", "the full-duplex ", "the semi-automatic ", "the drone-mounted ", "the industry-leading ", "the world-class ");
	let suffix: Value = list(" of farming", " multiplex", ` +${rand(1, 15)}`, ` ${consonant()}${rand(1000, 9999)}`, " hybrid", " maximus", " extreme");
	return `${pick(prefix)}${pick(products)}${pick(suffix)}`;
});

rt.type(4212, "/datum/industry/it", "/datum/industry", {
	name: "Information Technology",
	tokens: null,
});

// industries.dm:90
rt.def("/datum/industry/it/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("information technology", "computing", "computer industry"), "industrial", list("information technological", "computing", "computer industrial"), "jobs", list("coders", "electricians", "engineers", "programmers", "devops experts", "developers")]);
	return f.dot;
});

// industries.dm:97
rt.def("/datum/industry/it/proc/latin_number", function latin_number(f: Frame, n: Value) {
	if (n < 20 || !(n % 10)) {
		if (n === 0) {
			return "Nihil";
		} else if (n === 1) {
			return "Unus";
		} else if (n === 2) {
			return "Duo";
		} else if (n === 3) {
			return "Tres";
		} else if (n === 4) {
			return "Quattour";
		} else if (n === 5) {
			return "Quinque";
		} else if (n === 6) {
			return "Sex";
		} else if (n === 7) {
			return "Septem";
		} else if (n === 8) {
			return "Octo";
		} else if (n === 9) {
			return "Novem";
		} else if (n === 10) {
			return "Decim";
		} else if (n === 11) {
			return "Undecim";
		} else if (n === 12) {
			return "Duodecim";
		} else if (n === 13) {
			return "Tredecim";
		} else if (n === 14) {
			return "Quattourdecim";
		} else if (n === 15) {
			return "Quindecim";
		} else if (n === 16) {
			return "Sedecim";
		} else if (n === 17) {
			return "Septdecim";
		} else if (n === 18) {
			return "Duodeviginti";
		} else if (n === 19) {
			return "Undeviginti";
		} else if (n === 20) {
			return "Viginti";
		} else if (n === 30) {
			return "Triginta";
		} else if (n === 40) {
			return "Quadriginta";
		} else if (n === 50) {
			return "Quinquaginta";
		} else if (n === 60) {
			return "Sexaginta";
		} else if (n === 70) {
			return "Septuaginta";
		} else if (n === 80) {
			return "Octoginta";
		} else if (n === 90) {
			return "Nonaginta";
		}
	} else {
		return `${this.latin_number(n - n % 10)} ${lowertext(this.latin_number(n % 10))}`;
	}
	return f.dot;
});

// industries.dm:132
rt.def("/datum/industry/it/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let products: Value = list("generator", "laptop", "keyboard", "memory card", "display", "operating system", "processor", "graphics card", "nanobots", "power supply", "pAI", "mech", "capacitor", "cell");
	let prefix: Value = list(`the ${company_name} `, "the high performance ", "the mobile ", "the portable ", "the professional ", "the extreme ", "the incredible ", "the blazing fast ", "the bleeding edge ", "the bluespace-powered ", null);
	let L: Value = pick(consonant(), "Seed ", "Radiant ", "Robust ", "Pentathon ", "Athlete ", "Phantom ", "Semper Fi ");
	let N: Value = rand(0, 99);
	let $0: any = L;
	let $1: any = N;
	let prefix2: Value = `${$0}${$1}${prob(5) ? " " + this.latin_number(N) : null}`;
	return `${pick(prefix)}${prefix2} ${pick(products)}`;
});

rt.type(4213, "/datum/industry/communications", "/datum/industry", {
	name: "Communications",
	tokens: null,
});

// industries.dm:140
rt.def("/datum/industry/communications/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("telecommunications", "telecomms"), "industrial", list("telecommunicational"), "jobs", list("electrical engineers", "microengineers", "developers")]);
	return f.dot;
});

// industries.dm:148
rt.def("/datum/industry/communications/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let $2: any;
	let products: Value = list("mobile phone", "PDA", "tablet computer", "newscaster", "social network");
	let prefix: Value = list(`the ${company_name} `, "the high performance ", "the mobile ", "the portable ", "the professional ", "the extreme ", "the incredible ", "the blazing fast ", "the bleeding edge ", null);
	let L: Value = pick(`${lowertext(consonant())}Phone `, "Universe ", "Xperience ", "Next ", "Engin Y ", "Cyborg ", `${consonant()}`);
	let N: Value = rand(1, 99);
	let $0: any = L;
	let $1: any = N;
	if (prob(25)) {
		$2 = pick(" Tiny", " Mini", " Micro", " Slim", " Water", " Air", " Fire", " Earth", " Nano", " Pico", " Femto", " Planck");
	} else {
		$2 = null;
	}
	let prefix2: Value = `${$0}${$1}${$2}`;
	return `${pick(prefix)}${prefix2} ${pick(products)}`;
});

rt.type(4214, "/datum/industry/health", "/datum/industry", {
	name: "Medicine",
	tokens: null,
});

// industries.dm:156
rt.def("/datum/industry/health/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("medicine"), "industrial", list("medicinal"), "jobs", list("medical doctors", "nurses", "paramedics", "psychologists", "psychiatrists", "chemists")]);
	return f.dot;
});

// industries.dm:166
rt.def("/datum/industry/health/proc/generateProductName", function generateProductName(f: Frame, company_name: Value) {
	let prefix: Value = list("amino", "nucleo", "nitro", "panto", "meth", "eth", "as", "algo", "coca", "hero", "lotsu", "opiod", "morph", "trinitro", "prop", "but", "acet", "acyclo", "lansop", "dyclo", "hydro", "oxycod", "vicod", "cannabi", "cryo", "dex", "chloro");
	let suffix: Value = list("phen", "pirin", "pyrine", "ane", "amphetamine", "prazoline", "ine", "yl", "amine", "aminophen", "one", "ide", "phenate", "anol", "toulene", "glycerine", "vir", "tol", "trinic", "oxide");
	let uses: Value = list("antidepressant", "analgesic", "anesthetic", "antiretroviral", "antiviral", "antibiotic", "cough drop", "depressant", "hangover cure", "homeopathic", "fertility drug", "hypnotic", "narcotic", "laxative", "multivitamin", "patch", "purgative", "relaxant", "steroid", "sleeping pill", "suppository", "tranquilizer");
	return `${pick(prefix)}${pick(suffix)}, the ${pick(uses)}`;
});

rt.type(4215, "/datum/industry/consumer", "/datum/industry", {
	name: "Consumer",
	tokens: null,
});

// industries.dm:170
rt.def("/datum/industry/consumer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("shops", "stores"), "industrial", list("consumer industrial"), "jobs", list("shopkeepers", "assistants", "manual daytime hygiene engineers", "janitors", "chefs", "cooks")]);
	return f.dot;
});

// industries.dm:179
rt.def("/datum/industry/consumer/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let qualifier: Value = null;
	let meat: Value = list("chicken", "lizard", "corgi", "monkey", "goat", "fly", "xenomorph", "human", "walrus", "wendigo", "bear", "clown", "turkey", "pork", "carp", "crab", "mimic", "mystery");
	return `the ${pick((qualifier = list("synthetic", "organic", "bio", "diet", "sugar-free", "paleolithic", "homeopathic", "recycled", "reclaimed", "vat-grown")))} ${pick(meat)} meat product line`;
});

rt.type(4216, "/datum/industry/mining", "/datum/industry", {
	name: "Mining",
	tokens: null,
});

// industries.dm:183
rt.def("/datum/industry/mining/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("mines", "large scale mining operations"), "industrial", list("resource acquisitional"), "jobs", list("shaft miners", "drill operators", "mining foremen", "gibtonite handlers")]);
	return f.dot;
});

// industries.dm:192
rt.def("/datum/industry/mining/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let material: Value = null;
	let equipment: Value = list("drill", "pickaxe", "shovel", "jackhammer", "mini-pickaxe", "power hammer", "power gloves", "power armor", "hardsuit", "kinetic accelerator", "resonator", "oxygen tank", "emergency bike horn");
	return `the ${pick((material = list("mauxite", "pharosium", "molitz", "adamantium", "mithril", "cobryl", "bohrum", "claretine", "viscerite", "syreline", "cerenkite", "plasmastone", "gold", "koshmarite", "phoron", "carbon dioxide")))} ${pick(equipment)}`;
});

rt.type(4217, "/datum/industry/defense", "/datum/industry", {
	name: "Defense",
	tokens: null,
});

// industries.dm:196
rt.def("/datum/industry/defense/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.tokens = rt.alist(f, ["industry", list("defense", "warfare", "security", "law enforcement"), "industrial", list("defense"), "jobs", list("security officers", "government officials", "soldiers", "weapons engineers")]);
	return f.dot;
});

// industries.dm:205
rt.def("/datum/industry/defense/proc/generateProductName", function generateProductName(f: Frame, company: Value) {
	let material: Value = null;
	let equipment: Value = list("energy gun", "laser gun", "machine gun", "grenade", "stun baton", "artillery", "bomb", "attack drone", "missile", "chem sprayer");
	return `the ${pick((material = list("bluespace", "stealth", "heat-seeking", "crime-seeking", "wide-range", "bioterror", "auto-reloading", "smart", "sentient", "rapid-fire", "species-targeting", "gibtonite", "mass-market", "perpetual-motion", "nuclear", "fission", "fusion")))} ${pick(equipment)}`;
});
