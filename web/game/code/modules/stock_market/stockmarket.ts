// From code/modules/stock_market/stockmarket.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4222, "/datum/stockMarket", "/datum", {
	stocks: null,
	balances: null,
	last_read: null,
	stockBrokers: null,
	logs: null,
});

// /datum/stockMarket/proc/<init>  (code/modules/stock_market/stockmarket.dm:4)
rt.def("/datum/stockMarket/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "stocks", rt.list());
	$0 = $0;
	rt.setSv(f, "balances", rt.list());
	$0 = $0;
	rt.setSv(f, "last_read", rt.list());
	$0 = $0;
	rt.setSv(f, "stockBrokers", rt.list());
	$0 = $0;
	rt.setSv(f, "logs", rt.list());
	return f.dot;
});

// /datum/stockMarket/proc/New  (code/modules/stock_market/stockmarket.dm:11)  may sleep
rt.def("/datum/stockMarket/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "generateBrokers");
	yield* g.srcCall(f, "generateStocks");
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /datum/stockMarket/proc/balanceLog  (code/modules/stock_market/stockmarket.dm:17)
rt.def("/datum/stockMarket/proc/balanceLog", function balanceLog(f: Frame, whose: Value, net: Value) {
	if (!truthy((rt.isIn(f, live(whose), rt.sv(f, "balances")) ? 1 : 0))) {
		rt.setAt(rt.sv(f, "balances"), live(whose), live(net));
	} else {
		rt.modAt(rt.sv(f, "balances"), live(whose), live(net), add);
	}
	return f.dot;
});

// /datum/stockMarket/proc/generateBrokers  (code/modules/stock_market/stockmarket.dm:22)
rt.def("/datum/stockMarket/proc/generateBrokers", function generateBrokers(f: Frame) {
	let fnames: Value = null, names: Value = null, locations: Value = null, first: Value = null, company: Value = null, i: Value = null, pname: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [fnames, names, locations, first, company, i, pname, $0, $1, $2, $3, $e];
	rt.setSv(f, "stockBrokers", rt.list());
	fnames = rt.list("Goldman", "Edward", "James", "Luis", "Alexander", "Walter", "Eugene", "Mary", "Morgan", "Jane", "Elizabeth", "Xavier", "Hayden", "Samuel", "Lee");
	names = rt.list("Johnson", "Rothschild", "Sachs", "Stanley", "Hepburn", "Brown", "McColl", "Fischer", "Edwards", "Becker", "Witter", "Walker", "Lambert", "Smith", "Montgomery", "Lynch", "Roosevelt", "Lehman");
	locations = rt.list("Earth", "Luna", "Mars", "Saturn", "Jupiter", "Uranus", "Pluto", "Europa", "Io", "Phobos", "Deimos", "Space", "Venus", "Neptune", "Mercury", "Kalliope", "Ganymede", "Callisto", "Amalthea", "Himalia", "Sybil", "Basil", "Badger", "Terry", "Artyom");
	first = rt.list("The", "First", "Premier", "Finest", "Prime");
	company = rt.list("Investments", "Securities", "Corporation", "Bank", "Brokerage", "& Co.", "Brothers", "& Sons", "Investement Firm", "Union", "Partners", "Capital", "Trade", "Holdings");
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		pname = "";
		$0 = rt.call(f, P("/proc/rand"), null, [1, 5]);
		if ($0 === 1) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				$0 = add(rt.op(f, "PickUnweighted", [1], [live(first)]), " ");
			} else {
				$0 = null;
			}
			pname = fmt("＀＀ ＀", [$0, rt.op(f, "PickUnweighted", [1], [live(names)]), rt.op(f, "PickUnweighted", [1], [live(company)])]);
		} else if ($0 === 2) {
			$0 = rt.op(f, "PickUnweighted", [1], [live(names)]);
			$1 = rt.op(f, "PickUnweighted", [1], [live(names)]);
			if (truthy(rt.op(f, "Prob", [], [25]))) {
				$2 = add(" ", rt.op(f, "PickUnweighted", [1], [live(company)]));
			} else {
				$2 = null;
			}
			pname = fmt("＀ & ＀＀", [$0, $1, $2]);
		} else if ($0 === 3) {
			if (truthy(rt.op(f, "Prob", [], [45]))) {
				$0 = add(rt.op(f, "PickUnweighted", [1], [live(first)]), " ");
			} else {
				$0 = null;
			}
			pname = fmt("＀＀ ＀", [$0, rt.op(f, "PickUnweighted", [1], [live(locations)]), rt.op(f, "PickUnweighted", [1], [live(company)])]);
		} else if ($0 === 4) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				$0 = "The ";
			} else {
				$0 = null;
			}
			pname = fmt("＀＀ ＀ ＀", [$0, rt.op(f, "PickUnweighted", [1], [live(names)]), rt.op(f, "PickUnweighted", [1], [live(locations)]), rt.op(f, "PickUnweighted", [1], [live(company)])]);
		} else if ($0 === 5) {
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				$0 = "The ";
			} else {
				$0 = null;
			}
			$1 = rt.op(f, "PickUnweighted", [1], [live(fnames)]);
			$2 = rt.op(f, "PickUnweighted", [1], [live(names)]);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				$3 = add(" ", rt.op(f, "PickUnweighted", [1], [live(company)]));
			} else {
				$3 = null;
			}
			pname = fmt("＀＀ ＀＀", [$0, $1, $2, $3]);
		}
		if (truthy((rt.isIn(f, live(pname), rt.sv(f, "stockBrokers")) ? 1 : 0))) {
			i = rt.inc(live(i), -1);
			continue;
		}
		rt.modSrcVar(f, "stockBrokers", live(pname), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /datum/stockMarket/proc/generateDesignation  (code/modules/stock_market/stockmarket.dm:47)
rt.def("/datum/stockMarket/proc/generateDesignation", function generateDesignation(f: Frame, name: Value) {
	let w: Value = null, d: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [w, d, i, $e];
	if (rt.le(rt.length(live(name)), 4)) {
		return rt.call(f, P("/proc/uppertext"), null, [live(name)]);
	}
	if (rt.ge(rt.getLen(f, (w = rt.call(f, P("/proc/splittext"), null, [live(name), " "]))), 2)) {
		d = "";
		i = null;
		rt.forRange(f, 0, 1, rt.call(f, P("/proc/min"), null, [5, rt.len(f, live(w))]), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			d = rt.modify(live(d), rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/ascii2text"), null, [rt.call(f, P("/proc/text2ascii"), null, [rt.index(live(w), live(i)), 1])])]), add);
		}
		rt.endFor(f, 0);
		return live(d);
	} else {
		d = rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/ascii2text"), null, [rt.call(f, P("/proc/text2ascii"), null, [live(name), 1])])]);
		i = null;
		rt.forRange(f, 0, 2, rt.length(live(name)), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (truthy(rt.op(f, "Prob", [], [divide(100, live(i))]))) {
				d = rt.modify(live(d), rt.call(f, P("/proc/uppertext"), null, [rt.call(f, P("/proc/ascii2text"), null, [rt.call(f, P("/proc/text2ascii"), null, [live(name), live(i)])])]), add);
			}
		}
		rt.endFor(f, 0);
		return live(d);
	}
	return f.dot;
});

// /datum/stockMarket/proc/generateStocks  (code/modules/stock_market/stockmarket.dm:68)  may sleep
rt.def("/datum/stockMarket/proc/generateStocks", function* generateStocks(f: Frame, amt: Value) {
	let fruits: Value = null, tech_prefix: Value = null, tech_short: Value = null, random_nouns: Value = null, company: Value = null, i: Value = null, S: Value = null, sname: Value = null, fruit: Value = null, pname: Value = null, dv: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [amt, fruits, tech_prefix, tech_short, random_nouns, company, i, S, sname, fruit, pname, dv, $0, $1, $2];
	if (live(amt) === null) {
		amt = 15;
	}
	fruits = rt.list("Banana", "Mimana", "Watermelon", "Ambrosia", "Pomegranate", "Reishi", "Papaya", "Mango", "Tomato", "Conkerberry", "Wood", "Lychee", "Mandarin", "Harebell", "Pumpkin", "Rhubarb", "Tamarillo", "Yantok", "Ziziphus", "Oranges", "Gatfruit", "Daisy", "Kudzu");
	tech_prefix = rt.list("Nano", "Cyber", "Funk", "Astro", "Fusion", "Tera", "Exo", "Star", "Virtual", "Plasma", "Robust", "Bit", "Future", "Hugbox", "Carbon", "Nerf", "Buff", "Nova", "Space", "Meta", "Cyber");
	tech_short = rt.list("soft", "tech", "prog", "tec", "tek", "ware", "", "gadgets", "nics", "tric", "trasen", "tronic", "coin");
	random_nouns = rt.list("Johnson", "Cluwne", "General", "Specific", "Master", "King", "Queen", "Table", "Rupture", "Dynamic", "Massive", "Mega", "Giga", "Certain", "Singulo", "State", "National", "International", "Interplanetary", "Sector", "Planet", "Burn", "Robust", "Exotic", "Solar", "Lunar", "Chelp", "Corgi", "Lag", "Lizard");
	company = rt.list("Company", "Factory", "Incorporated", "Industries", "Group", "Consolidated", "GmbH", "LLC", "Ltd", "Inc.", "Association", "Limited", "Software", "Technology", "Programming", "IT Group", "Electronics", "Nanotechnology", "Farms", "Stores", "Mobile", "Motors", "Electric", "Designs", "Energy", "Pharmaceuticals", "Communications", "Wholesale", "Holding", "Health", "Machines", "Astrotech", "Gadgets", "Kinetics");
	i = null;
	i = 1;
	while (rt.le(live(i), live(amt))) {
		S = (yield* g.new_(f, T("/datum/stock"), []));
		sname = "";
		$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 6]));
		if ($0 === 1) {
			while (isEqual(live(sname), "") || isEqual(live(sname), "FAG")) {
				sname = fmt("＀＀＀", [(yield* g.call(f, P("/proc/consonant"), null, [])), (yield* g.call(f, P("/proc/vowel"), null, [])), (yield* g.call(f, P("/proc/consonant"), null, []))]);
			}
		} else if ($0 === 2) {
			$0 = rt.op(f, "PickUnweighted", [1], [live(tech_prefix)]);
			$1 = rt.op(f, "PickUnweighted", [1], [live(tech_short)]);
			if (truthy(rt.op(f, "Prob", [], [20]))) {
				$2 = add(" ", rt.op(f, "PickUnweighted", [1], [live(company)]));
			} else {
				$2 = null;
			}
			sname = fmt("＀＀＀", [$0, $1, $2]);
		} else if (rt.inRange($0, 3, 4)) {
			(fruits = rt.modify(live(fruits), (fruit = rt.op(f, "PickUnweighted", [1], [live(fruits)])), subtract));
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				$0 = "The ";
			} else {
				$0 = null;
			}
			$1 = live(fruit);
			if (truthy(rt.op(f, "Prob", [], [40]))) {
				$2 = add(" ", rt.op(f, "PickUnweighted", [1], [live(company)]));
			} else {
				$2 = null;
			}
			sname = fmt("＀＀＀", [$0, $1, $2]);
		} else if (rt.inRange($0, 5, 6)) {
			(random_nouns = rt.modify(live(random_nouns), (pname = rt.op(f, "PickUnweighted", [1], [live(random_nouns)])), subtract));
			$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
			if ($0 === 1) {
				sname = fmt("＀ & ＀", [live(pname), live(pname)]);
			} else if ($0 === 2) {
				sname = fmt("＀ ＀", [live(pname), rt.op(f, "PickUnweighted", [1], [live(company)])]);
			} else if ($0 === 3) {
				sname = fmt("＀", [live(pname)]);
			}
		}
		rt.setFv(f, "name", live(S), live(sname));
		rt.setFv(f, "short_name", live(S), (yield* g.srcCall(f, "generateDesignation", rt.fv(f, "name", live(S)))));
		rt.setFv(f, "current_value", live(S), (yield* g.call(f, P("/proc/rand"), null, [10, 125])));
		dv = divide((yield* g.call(f, P("/proc/rand"), null, [10, 40])), 10);
		$0 = live(S);
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			$1 = divide(1, live(dv));
		} else {
			$1 = live(dv);
		}
		rt.setFv(f, "fluctuational_coefficient", $0, $1);
		rt.setFv(f, "average_optimism", live(S), divide((yield* g.call(f, P("/proc/rand"), null, [-10, 10])), 100));
		rt.setFv(f, "optimism", live(S), add(rt.fv(f, "average_optimism", live(S)), divide((yield* g.call(f, P("/proc/rand"), null, [-40, 40])), 100)));
		rt.setFv(f, "current_trend", live(S), divide((yield* g.call(f, P("/proc/rand"), null, [-200, 200])), 10));
		rt.setFv(f, "last_trend", live(S), rt.fv(f, "current_trend", live(S)));
		rt.setFv(f, "disp_value_change", live(S), (yield* g.call(f, P("/proc/rand"), null, [-1, 1])));
		rt.setFv(f, "speculation", live(S), (yield* g.call(f, P("/proc/rand"), null, [-20, 20])));
		rt.setFv(f, "average_shares", live(S), (yield* g.call(f, P("/proc/round"), null, [divide((yield* g.call(f, P("/proc/rand"), null, [500, 10000])), 10)])));
		rt.setFv(f, "outside_shareholders", live(S), (yield* g.call(f, P("/proc/rand"), null, [1000, 30000])));
		rt.setFv(f, "available_shares", live(S), (yield* g.call(f, P("/proc/rand"), null, [200000, 800000])));
		rt.setFv(f, "fluctuation_rate", live(S), (yield* g.call(f, P("/proc/rand"), null, [6, 20])));
		yield* g.callName(f, live(S), "generateIndustry", []);
		yield* g.callName(f, live(S), "generateEvents", []);
		rt.modSrcVar(f, "stocks", live(S), add);
		rt.setAt(rt.sv(f, "last_read"), live(S), rt.list());
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /datum/stockMarket/proc/process  (code/modules/stock_market/stockmarket.dm:112)
rt.def("/datum/stockMarket/proc/process", function process(f: Frame) {
	let stock: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [stock, S, $e];
	stock = null;
	rt.forList(f, 0, rt.sv(f, "stocks"));
	while (($e = rt.next(f, 0)) !== undefined) {
		stock = $e;
		rt.callName(f, (S = live(stock)), "process", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { waitfor: false });

// /datum/stockMarket/proc/add_log  (code/modules/stock_market/stockmarket.dm:117)  may sleep
rt.def("/datum/stockMarket/proc/add_log", function* add_log(f: Frame, log_type: Value, user: Value, company_name: Value, stocks: Value, shareprice: Value, money: Value) {
	let L: Value = null;
	f.vars = () => [log_type, user, company_name, stocks, shareprice, money, L];
	rt.setFv(f, "user_name", (L = (yield* g.new_(f, live(log_type), []))), live(user));
	rt.setFv(f, "company_name", live(L), live(company_name));
	rt.setFv(f, "stocks", live(L), live(stocks));
	rt.setFv(f, "shareprice", live(L), live(shareprice));
	rt.setFv(f, "money", live(L), live(money));
	rt.setFv(f, "time", live(L), (yield* g.call(f, P("/proc/time2text"), null, [rt.fv(f, "timeofday", rt.world()), "hh:mm"])));
	rt.modSrcVar(f, "logs", live(L), add);
	return f.dot;
}, true);

// /datum/controller/global_vars/proc/InitGlobalstockExchange  (code/modules/stock_market/stockmarket.dm:126)  may sleep
rt.def("/datum/controller/global_vars/proc/InitGlobalstockExchange", function* InitGlobalstockExchange(f: Frame) {
	rt.setGl("stockExchange", (yield* g.new_(f, T("/datum/stockMarket"), [])));
	rt.modSrcVar(f, "gvars_datum_init_order", "stockExchange", add);
	return f.dot;
}, true);

// /proc/plotBarGraph  (code/modules/stock_market/stockmarket.dm:129)
rt.def("/proc/plotBarGraph", function plotBarGraph(f: Frame, points: Value, base_text: Value, width: Value, height: Value) {
	let output: Value = null, min: Value = null, max: Value = null, v: Value = null, cells: Value = null, diff: Value = null, ost: Value = null, cval: Value = null, cwid: Value = null, y: Value = null, x: Value = null, v_10: Value = null;
	let $e: any;
	f.vars = () => [width, height, output, min, max, v, cells, diff, ost, cval, cwid, y, x, v_10, $e];
	if (live(width) === null) {
		width = 400;
	}
	if (live(height) === null) {
		height = 400;
	}
	output = fmt("<table style='border:1px solid black; border-collapse: collapse; width: ＀px; height: ＀px'>", [live(width), live(height)]);
	if (((truthy(rt.len(f, live(points))) && rt.gt(live(height), 20)) && rt.gt(live(width), 20))) {
		min = rt.index(live(points), 1);
		max = rt.index(live(points), 1);
		v = null;
		rt.forList(f, 0, live(points));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (rt.lt(live(v), live(min))) {
				min = live(v);
			}
			if (rt.gt(live(v), live(max))) {
				max = live(v);
			}
		}
		rt.endFor(f, 0);
		if (rt.gt((cells = divide(subtract(live(height), 20), 20)), rt.call(f, P("/proc/round"), null, [live(cells)]))) {
			cells = add(rt.call(f, P("/proc/round"), null, [live(cells)]), 1);
		}
		diff = subtract(live(max), live(min));
		ost = divide(live(diff), live(cells));
		if (rt.gt(live(min), 0)) {
			min = rt.call(f, P("/proc/max"), null, [subtract(live(min), live(ost)), 0]);
		}
		ost = divide((diff = subtract(live(max), live(min))), live(cells));
		cval = live(max);
		cwid = divide(live(width), add(rt.len(f, live(points)), 1));
		y = null;
		y = live(cells);
		while (rt.gt(live(y), 0)) {
			if (isEqual(live(y), live(cells))) {
				output = rt.modify(live(output), "<tr>", add);
			} else {
				output = rt.modify(live(output), "<tr style='border:none; border-top:1px solid #00ff00; height: 20px'>", add);
			}
			x = null;
			x = 0;
			while (rt.le(live(x), rt.len(f, live(points)))) {
				if (isEqual(live(x), 0)) {
					output = rt.modify(live(output), fmt("<td style='border:none; height: 20px; width: ＀px; font-size:10px; color:#00ff00; background:black; text-align:right; vertical-align:bottom'>＀</td>", [live(cwid), rt.call(f, P("/proc/round"), null, [subtract(live(cval), live(ost))])]), add);
				} else {
					if (rt.ge((v_10 = rt.index(live(points), live(x))), live(cval))) {
						output = rt.modify(live(output), fmt("<td style='border:none; height: 20px; width: ＀px; background:#0000ff'>&nbsp;</td>", [live(cwid)]), add);
					} else {
						output = rt.modify(live(output), fmt("<td style='border:none; height: 20px; width: ＀px; background:black'>&nbsp;</td>", [live(cwid)]), add);
					}
				}
				x = rt.inc(live(x), 1);
			}
			output = rt.modify(live(output), "</tr>", add);
			(cval = rt.modify(live(cval), live(ost), subtract));
			y = rt.inc(live(y), -1);
		}
		output = rt.modify(live(output), fmt("<tr><td style='font-size:10px; height: 20px; width: 100%; background:black; color:green; text-align:center' colspan='＀'>＀</td></tr>", [add(rt.len(f, live(points)), 1), live(base_text)]), add);
	} else {
		output = rt.modify(live(output), fmt("<tr><td style='width:＀px; height:＀px; background: black'></td></tr>", [live(width), live(height)]), add);
		output = rt.modify(live(output), fmt("<tr><td style='font-size:10px; background:black; color:green; text-align:center'>＀</td></tr>", [live(base_text)]), add);
	}
	return fmt("＀</table>", [live(output)]);
});
