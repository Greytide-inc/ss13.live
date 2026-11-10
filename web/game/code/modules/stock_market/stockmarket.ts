// Based on /tg/station's code/modules/stock_market/stockmarket.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add } = rt;


rt.type(4222, "/datum/stockMarket", "/datum", {
	stocks: null,
	balances: null,
	last_read: null,
	stockBrokers: null,
	logs: null,
});

// stockmarket.dm:4
rt.def("/datum/stockMarket/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stocks = list();

	this.balances = list();

	this.last_read = list();

	this.stockBrokers = list();

	this.logs = list();
	return f.dot;
});

// stockmarket.dm:11
rt.def("/datum/stockMarket/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.generateBrokers();
	yield* this.generateStocks();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// stockmarket.dm:17
rt.def("/datum/stockMarket/proc/balanceLog", function balanceLog(f: Frame, whose: Value, net: Value) {
	if (!rt.isIn(f, whose, this.balances)) {
		rt.setAt(this.balances, whose, net);
	} else {
		rt.modAt(this.balances, whose, net, add);
	}
	return f.dot;
});

// stockmarket.dm:22
rt.def("/datum/stockMarket/proc/generateBrokers", function generateBrokers(f: Frame) {
	let i: Value = null, pname: Value = null;
	let $0: any, $e: any;
	this.stockBrokers = list();
	let fnames: Value = list("Goldman", "Edward", "James", "Luis", "Alexander", "Walter", "Eugene", "Mary", "Morgan", "Jane", "Elizabeth", "Xavier", "Hayden", "Samuel", "Lee");
	let names: Value = list("Johnson", "Rothschild", "Sachs", "Stanley", "Hepburn", "Brown", "McColl", "Fischer", "Edwards", "Becker", "Witter", "Walker", "Lambert", "Smith", "Montgomery", "Lynch", "Roosevelt", "Lehman");
	let locations: Value = list("Earth", "Luna", "Mars", "Saturn", "Jupiter", "Uranus", "Pluto", "Europa", "Io", "Phobos", "Deimos", "Space", "Venus", "Neptune", "Mercury", "Kalliope", "Ganymede", "Callisto", "Amalthea", "Himalia", "Sybil", "Basil", "Badger", "Terry", "Artyom");
	let first: Value = list("The", "First", "Premier", "Finest", "Prime");
	let company: Value = list("Investments", "Securities", "Corporation", "Bank", "Brokerage", "& Co.", "Brothers", "& Sons", "Investement Firm", "Union", "Partners", "Capital", "Trade", "Holdings");
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		pname = "";
		$0 = rand(1, 5);
		if ($0 === 1) {
			if (prob(10)) {
				$0 = pick(first) + " ";
			} else {
				$0 = null;
			}
			pname = `${$0}${pick(names)} ${pick(company)}`;
		} else if ($0 === 2) {
			$0 = pick(names);
			pname = `${$0} & ${pick(names)}${prob(25) ? " " + pick(company) : null}`;
		} else if ($0 === 3) {
			if (prob(45)) {
				$0 = pick(first) + " ";
			} else {
				$0 = null;
			}
			pname = `${$0}${pick(locations)} ${pick(company)}`;
		} else if ($0 === 4) {
			if (prob(10)) {
				$0 = "The ";
			} else {
				$0 = null;
			}
			pname = `${$0}${pick(names)} ${pick(locations)} ${pick(company)}`;
		} else if ($0 === 5) {
			pname = `${prob(10) ? "The " : null}${pick(fnames)} ${pick(names)}${prob(10) ? " " + pick(company) : null}`;
		}
		if (rt.isIn(f, pname, this.stockBrokers)) {
			i--;
			continue;
		}
		this.stockBrokers += pname;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// stockmarket.dm:47
rt.def("/datum/stockMarket/proc/generateDesignation", function generateDesignation(f: Frame, name: Value) {
	let w: Value = null, d: Value = null, i: Value = null;
	let $e: any;
	if (rt.length(name) <= 4) {
		return uppertext(name);
	}
	if (rt.len(f, (w = splittext(name, " "))) >= 2) {
		d = "";
		rt.forRange(f, 0, 1, min(5, rt.len(f, w)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			d += uppertext(ascii2text(text2ascii(rt.index(w, i), 1)));
		}
		rt.endFor(f, 0);
		return d;
	} else {
		d = uppertext(ascii2text(text2ascii(name, 1)));
		i = null;
		rt.forRange(f, 0, 2, rt.length(name), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (prob(100 / i)) {
				d += uppertext(ascii2text(text2ascii(name, i)));
			}
		}
		rt.endFor(f, 0);
		return d;
	}
});

// stockmarket.dm:68
rt.def("/datum/stockMarket/proc/generateStocks", function* generateStocks(f: Frame, amt: Value) {
	let S: Value = null, sname: Value = null, fruit: Value = null, pname: Value = null, dv: Value = null;
	let $0: any, $1: any, $2: any;
	amt ??= 15;
	let fruits: Value = list("Banana", "Mimana", "Watermelon", "Ambrosia", "Pomegranate", "Reishi", "Papaya", "Mango", "Tomato", "Conkerberry", "Wood", "Lychee", "Mandarin", "Harebell", "Pumpkin", "Rhubarb", "Tamarillo", "Yantok", "Ziziphus", "Oranges", "Gatfruit", "Daisy", "Kudzu");
	let tech_prefix: Value = list("Nano", "Cyber", "Funk", "Astro", "Fusion", "Tera", "Exo", "Star", "Virtual", "Plasma", "Robust", "Bit", "Future", "Hugbox", "Carbon", "Nerf", "Buff", "Nova", "Space", "Meta", "Cyber");
	let tech_short: Value = list("soft", "tech", "prog", "tec", "tek", "ware", "", "gadgets", "nics", "tric", "trasen", "tronic", "coin");
	let random_nouns: Value = list("Johnson", "Cluwne", "General", "Specific", "Master", "King", "Queen", "Table", "Rupture", "Dynamic", "Massive", "Mega", "Giga", "Certain", "Singulo", "State", "National", "International", "Interplanetary", "Sector", "Planet", "Burn", "Robust", "Exotic", "Solar", "Lunar", "Chelp", "Corgi", "Lag", "Lizard");
	let company: Value = list("Company", "Factory", "Incorporated", "Industries", "Group", "Consolidated", "GmbH", "LLC", "Ltd", "Inc.", "Association", "Limited", "Software", "Technology", "Programming", "IT Group", "Electronics", "Nanotechnology", "Farms", "Stores", "Mobile", "Motors", "Electric", "Designs", "Energy", "Pharmaceuticals", "Communications", "Wholesale", "Holding", "Health", "Machines", "Astrotech", "Gadgets", "Kinetics");
	let i: Value = 1;
	while (i <= amt) {
		S = (yield* new_(T("/datum/stock")));
		sname = "";
		$0 = rand(1, 6);
		if ($0 === 1) {
			while (sname == "" || sname == "FAG") {
				sname = `${consonant()}${vowel()}${consonant()}`;
			}
		} else if ($0 === 2) {
			$0 = pick(tech_prefix);
			$1 = pick(tech_short);
			if (prob(20)) {
				$2 = " " + pick(company);
			} else {
				$2 = null;
			}
			sname = `${$0}${$1}${$2}`;
		} else if (rt.inRange($0, 3, 4)) {
			fruits -= (fruit = pick(fruits));
			if (prob(10)) {
				$0 = "The ";
			} else {
				$0 = null;
			}
			$1 = fruit;
			if (prob(40)) {
				$2 = " " + pick(company);
			} else {
				$2 = null;
			}
			sname = `${$0}${$1}${$2}`;
		} else if (rt.inRange($0, 5, 6)) {
			random_nouns -= (pname = pick(random_nouns));
			const die = rand(1, 3);
			if (die === 1) {
				sname = `${pname} & ${pname}`;
			} else if (die === 2) {
				sname = `${pname} ${pick(company)}`;
			} else if (die === 3) {
				sname = `${pname}`;
			}
		}
		S.name = sname;
		S.short_name = this.generateDesignation(S.name);
		S.current_value = rand(10, 125);
		dv = rand(10, 40) / 10;
		S.fluctuational_coefficient = prob(50) ? 1 / dv : dv;
		S.average_optimism = rand(-10, 10) / 100;
		S.optimism = S.average_optimism + rand(-40, 40) / 100;
		S.current_trend = rand(-200, 200) / 10;
		S.last_trend = S.current_trend;
		S.disp_value_change = rand(-1, 1);
		S.speculation = rand(-20, 20);
		S.average_shares = round(rand(500, 10000) / 10);
		S.outside_shareholders = rand(1000, 30000);
		S.available_shares = rand(200000, 800000);
		S.fluctuation_rate = rand(6, 20);
		yield* S.generateIndustry();
		yield* S.generateEvents();
		this.stocks += S;
		rt.setAt(this.last_read, S, list());
		i++;
	}
	return f.dot;
}, true);

// stockmarket.dm:112
rt.def("/datum/stockMarket/proc/process", function process(f: Frame) {
	let stock: Value = null, S: Value = null;
	for (stock of each(this.stocks)) {
		(S = stock).process();
	}
	return f.dot;
}, false, { waitfor: false });

// stockmarket.dm:117
rt.def("/datum/stockMarket/proc/add_log", function* add_log(f: Frame, log_type: Value, user: Value, company_name: Value, stocks: Value, shareprice: Value, money: Value) {
	let L: Value = null;
	(L = (yield* new_(log_type))).user_name = user;
	L.company_name = company_name;
	L.stocks = stocks;
	L.shareprice = shareprice;
	L.money = money;
	L.time = time2text(rt.world().timeofday, "hh:mm");
	this.logs += L;
	return f.dot;
}, true);

// stockmarket.dm:126
rt.def("/datum/controller/global_vars/proc/InitGlobalstockExchange", function* InitGlobalstockExchange(f: Frame) {
	GLOB.stockExchange = (yield* new_(T("/datum/stockMarket")));
	this.gvars_datum_init_order += "stockExchange";
	return f.dot;
}, true);

// stockmarket.dm:129
rt.def("/proc/plotBarGraph", function plotBarGraph(f: Frame, points: Value, base_text: Value, width: Value, height: Value) {
	let min: Value = null, max: Value = null, v: Value = null, cells: Value = null, diff: Value = null, ost: Value = null, cval: Value = null, cwid: Value = null, y: Value = null, x: Value = null, v_10: Value = null;
	width ??= 400;
	height ??= 400;
	let output: Value = `<table style='border:1px solid black; border-collapse: collapse; width: ${width}px; height: ${height}px'>`;
	if (rt.len(f, points) && height > 20 && width > 20) {
		min = rt.index(points, 1);
		max = rt.index(points, 1);
		for (v of each(points)) {
			if (v < min) {
				min = v;
			}
			if (v > max) {
				max = v;
			}
		}
		if ((cells = (height - 20) / 20) > round(cells)) {
			cells = round(cells) + 1;
		}
		diff = max - min;
		ost = diff / cells;
		if (min > 0) {
			min = rt.call(f, P("/proc/max"), null, [min - ost, 0]);
		}
		ost = (diff = max - min) / cells;
		cval = max;
		cwid = width / (rt.len(f, points) + 1);
		y = cells;
		while (y > 0) {
			if (y == cells) {
				output += "<tr>";
			} else {
				output += "<tr style='border:none; border-top:1px solid #00ff00; height: 20px'>";
			}
			x = 0;
			while (x <= rt.len(f, points)) {
				if (x == 0) {
					output += `<td style='border:none; height: 20px; width: ${cwid}px; font-size:10px; color:#00ff00; background:black; text-align:right; vertical-align:bottom'>${round(cval - ost)}</td>`;
				} else if ((v_10 = rt.index(points, x)) >= cval) {
					output += `<td style='border:none; height: 20px; width: ${cwid}px; background:#0000ff'>&nbsp;</td>`;
				} else {
					output += `<td style='border:none; height: 20px; width: ${cwid}px; background:black'>&nbsp;</td>`;
				}
				x++;
			}
			output += "</tr>";
			cval -= ost;
			y--;
		}
		output += `<tr><td style='font-size:10px; height: 20px; width: 100%; background:black; color:green; text-align:center' colspan='${rt.len(f, points) + 1}'>${base_text}</td></tr>`;
	} else {
		output += `<tr><td style='width:${width}px; height:${height}px; background: black'></td></tr>`;
		output += `<tr><td style='font-size:10px; background:black; color:green; text-align:center'>${base_text}</td></tr>`;
	}
	return `${output}</table>`;
});
