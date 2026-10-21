// From code/modules/stock_market/stocks.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(4224, "/datum/stock", "/datum", {
	name: "Stock",
	short_name: "STK",
	desc: "A company that does not exist.",
	values: null,
	current_value: 10,
	last_value: 10,
	products: null,
	performance: 0,
	fluctuational_coefficient: 1,
	average_optimism: 0,
	current_trend: 0,
	last_trend: 0,
	speculation: 0,
	bankrupt: 0,
	disp_value_change: 0,
	optimism: 0,
	last_unification: 0,
	average_shares: 100,
	outside_shareholders: 10000,
	available_shares: 500000,
	borrow_brokers: null,
	shareholders: null,
	borrows: null,
	events: null,
	articles: null,
	fluctuation_rate: 15,
	fluctuation_counter: 0,
	industry: null,
});

// /datum/stock/proc/<init>  (code/modules/stock_market/stocks.dm:18)
rt.def("/datum/stock/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "values", rt.list());
	$0 = $0;
	rt.setSv(f, "products", rt.list());
	$0 = $0;
	rt.setSv(f, "borrow_brokers", rt.list());
	$0 = $0;
	rt.setSv(f, "shareholders", rt.list());
	$0 = $0;
	rt.setSv(f, "borrows", rt.list());
	$0 = $0;
	rt.setSv(f, "events", rt.list());
	$0 = $0;
	rt.setSv(f, "articles", rt.list());
	return f.dot;
});

// /datum/stock/proc/addEvent  (code/modules/stock_market/stocks.dm:50)
rt.def("/datum/stock/proc/addEvent", function addEvent(f: Frame, E: Value) {
	(rt.modSrcVar(f, "events", live(E), rt.bitOr));
	return f.dot;
});

// /datum/stock/proc/addArticle  (code/modules/stock_market/stocks.dm:53)
rt.def("/datum/stock/proc/addArticle", function addArticle(f: Frame, A: Value) {
	if (!truthy((rt.isIn(f, live(A), rt.sv(f, "articles")) ? 1 : 0))) {
		rt.callName(f, rt.sv(f, "articles"), "Insert", [1, live(A)]);
	}
	rt.setFv(f, "ticks", live(A), rt.worldTime(f));
	return f.dot;
});

// /datum/stock/proc/generateEvents  (code/modules/stock_market/stocks.dm:58)  may sleep
rt.def("/datum/stock/proc/generateEvents", function* generateEvents(f: Frame) {
	let types: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [types, _T, $e];
	types = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/stockEvent")])), T("/datum/stockEvent"));
	_T = null;
	rt.forList(f, 0, live(types));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.srcCall(f, "generateEvent", live(_T));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/stock/proc/generateEvent  (code/modules/stock_market/stocks.dm:63)  may sleep
rt.def("/datum/stock/proc/generateEvent", function* generateEvent(f: Frame, _T: Value) {
	let E: Value = null;
	f.vars = () => [_T, E];
	yield* g.srcCall(f, "addEvent", (E = (yield* g.new_(f, live(_T), [live(f.src)]))));
	return f.dot;
}, true);

// /datum/stock/proc/affectPublicOpinion  (code/modules/stock_market/stocks.dm:67)
rt.def("/datum/stock/proc/affectPublicOpinion", function affectPublicOpinion(f: Frame, boost: Value) {
	rt.modSrcVar(f, "optimism", multiply(divide(rt.call(f, P("/proc/rand"), null, [0, 500]), 500), live(boost)), add);
	rt.modSrcVar(f, "average_optimism", multiply(divide(rt.call(f, P("/proc/rand"), null, [0, 150]), 5000), live(boost)), add);
	rt.modSrcVar(f, "speculation", multiply(divide(rt.call(f, P("/proc/rand"), null, [-1, 50]), 10), live(boost)), add);
	rt.modSrcVar(f, "performance", multiply(divide(rt.call(f, P("/proc/rand"), null, [0, 150]), 100), live(boost)), add);
	return f.dot;
});

// /datum/stock/proc/generateIndustry  (code/modules/stock_market/stocks.dm:73)  may sleep
rt.def("/datum/stock/proc/generateIndustry", function* generateIndustry(f: Frame) {
	let ts: Value = null, in_t: Value = null, i: Value = null;
	f.vars = () => [ts, in_t, i];
	if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Farms"])))) {
		rt.setSv(f, "industry", (yield* g.new_(f, T("/datum/industry/agriculture"), [])));
	} else {
		if ((((((truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Software"]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Programming"])))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "IT Group"])))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Electronics"])))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Electric"])))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Nanotechnology"]))))) {
			rt.setSv(f, "industry", (yield* g.new_(f, T("/datum/industry/it"), [])));
		} else {
			if ((truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Mobile"]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Communications"]))))) {
				rt.setSv(f, "industry", (yield* g.new_(f, T("/datum/industry/communications"), [])));
			} else {
				if ((truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Pharmaceuticals"]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Health"]))))) {
					rt.setSv(f, "industry", (yield* g.new_(f, T("/datum/industry/health"), [])));
				} else {
					if ((truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Wholesale"]))) || truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.sv(f, "name"), "Stores"]))))) {
						rt.setSv(f, "industry", (yield* g.new_(f, T("/datum/industry/consumer"), [])));
					} else {
						ts = subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/industry")])), T("/datum/industry"));
						in_t = rt.op(f, "PickUnweighted", [1], [live(ts)]);
						rt.setSv(f, "industry", (yield* g.new_(f, live(in_t), [])));
					}
				}
			}
		}
	}
	i = null;
	i = 0;
	while (rt.lt(live(i), (yield* g.call(f, P("/proc/rand"), null, [2, 5])))) {
		rt.modSrcVar(f, "products", (yield* g.callName(f, rt.sv(f, "industry"), "generateProductName", [rt.sv(f, "name")])), add);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /datum/stock/proc/frc  (code/modules/stock_market/stocks.dm:91)
rt.def("/datum/stock/proc/frc", function frc(f: Frame, amt: Value) {
	let shares: Value = null, fr: Value = null;
	f.vars = () => [shares, fr];
	shares = add(rt.sv(f, "available_shares"), multiply(rt.sv(f, "outside_shareholders"), rt.sv(f, "average_shares")));
	if (((rt.lt((fr = multiply(multiply(multiply(divide(divide(live(amt), 100), live(shares)), rt.sv(f, "fluctuational_coefficient")), rt.sv(f, "fluctuation_rate")), rt.call(f, P("/proc/max"), null, [rt.neg(divide(rt.sv(f, "current_trend"), 100)), 1]))), 0) && rt.lt(rt.sv(f, "speculation"), 0)) || (rt.gt(live(fr), 0) && rt.gt(rt.sv(f, "speculation"), 0)))) {
		(fr = rt.modify(live(fr), rt.call(f, P("/proc/max"), null, [divide(rt.op(f, "Abs", [], [rt.sv(f, "speculation")]), 5), 1]), multiply));
	} else {
		(fr = rt.modify(live(fr), rt.call(f, P("/proc/max"), null, [divide(rt.op(f, "Abs", [], [rt.sv(f, "speculation")]), 5), 1]), divide));
	}
	return live(fr);
});

// /datum/stock/proc/supplyGrowth  (code/modules/stock_market/stocks.dm:100)
rt.def("/datum/stock/proc/supplyGrowth", function supplyGrowth(f: Frame, amt: Value) {
	let fr: Value = null;
	f.vars = () => [fr];
	fr = rt.callSrc(f, "frc", [live(amt)]);
	rt.modSrcVar(f, "available_shares", live(amt), add);
	if (rt.lt(rt.op(f, "Abs", [], [live(fr)]), 0.00009999999747378752)) {
		return live(f.dot);
	}
	(rt.modSrcVar(f, "current_value", multiply(live(fr), rt.sv(f, "current_value")), subtract));
	return f.dot;
});

// /datum/stock/proc/supplyDrop  (code/modules/stock_market/stocks.dm:107)
rt.def("/datum/stock/proc/supplyDrop", function supplyDrop(f: Frame, amt: Value) {
	rt.callSrc(f, "supplyGrowth", [rt.neg(live(amt))]);
	return f.dot;
});

// /datum/stock/proc/fluctuate  (code/modules/stock_market/stocks.dm:110)
rt.def("/datum/stock/proc/fluctuate", function fluctuate(f: Frame) {
	let change: Value = null, shift_score: Value = null, as_score: Value = null, sh_change_dev: Value = null, sh_change: Value = null, shareholder_change: Value = null, share_change: Value = null, avg_change_dev: Value = null, avg_change: Value = null, cv: Value = null, aspec: Value = null, fucking_stock_spikes: Value = null, piece_of_shit_fuck: Value = null, i_hate_this_code: Value = null;
	let $0: any;
	f.vars = () => [change, shift_score, as_score, sh_change_dev, sh_change, shareholder_change, share_change, avg_change_dev, avg_change, cv, aspec, fucking_stock_spikes, piece_of_shit_fuck, i_hate_this_code, $0];
	change = add(divide(rt.call(f, P("/proc/rand"), null, [-100, 100]), 10), divide(multiply(rt.sv(f, "optimism"), rt.call(f, P("/proc/rand"), null, [200])), 10));
	(rt.modSrcVar(f, "optimism", multiply(subtract(rt.sv(f, "optimism"), rt.sv(f, "average_optimism")), divide(rt.call(f, P("/proc/rand"), null, [10, 80]), 1000)), subtract));
	shift_score = add(live(change), rt.sv(f, "current_trend"));
	as_score = rt.op(f, "Abs", [], [live(shift_score)]);
	sh_change_dev = divide(rt.call(f, P("/proc/rand"), null, [-10, 10]), 10);
	sh_change = add(divide(live(shift_score), add(live(as_score), 100)), live(sh_change_dev));
	rt.modSrcVar(f, "outside_shareholders", (shareholder_change = rt.call(f, P("/proc/round"), null, [live(sh_change)])), add);
	share_change = multiply(live(shareholder_change), rt.sv(f, "average_shares"));
	if ((rt.gt(live(as_score), 20) && truthy(rt.op(f, "Prob", [], [divide(live(as_score), 4)])))) {
		avg_change_dev = divide(rt.call(f, P("/proc/rand"), null, [-10, 10]), 10);
		rt.modSrcVar(f, "average_shares", (avg_change = add(divide(live(shift_score), add(live(as_score), 100)), live(avg_change_dev))), add);
		share_change = rt.modify(live(share_change), multiply(rt.sv(f, "outside_shareholders"), live(avg_change)), add);
	}
	cv = rt.sv(f, "last_value");
	rt.callSrc(f, "supplyDrop", [live(share_change)]);
	rt.modSrcVar(f, "available_shares", live(share_change), add);
	if (truthy(rt.op(f, "Prob", [], [25]))) {
		rt.setSv(f, "average_optimism", rt.call(f, P("/proc/max"), null, [rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "average_optimism"), divide(subtract(rt.call(f, P("/proc/rand"), null, [-3, 3]), multiply(rt.sv(f, "current_trend"), 0.15000000596046448)), 100)), 1]), -1]));
	}
	if (truthy(rt.op(f, "Prob", [], [multiply(subtract((aspec = rt.op(f, "Abs", [], [rt.sv(f, "speculation")])), 75), 2)]))) {
		rt.modSrcVar(f, "speculation", rt.call(f, P("/proc/rand"), null, [-4, 4]), add);
	} else {
		if (truthy(rt.op(f, "Prob", [], [50]))) {
			rt.modSrcVar(f, "speculation", rt.call(f, P("/proc/rand"), null, [-4, 4]), add);
		} else {
			rt.modSrcVar(f, "speculation", multiply(divide(rt.call(f, P("/proc/rand"), null, [-400, 0]), 1000), rt.sv(f, "speculation")), add);
			if ((truthy(rt.op(f, "Prob", [], [1])) && truthy(rt.op(f, "Prob", [], [5])))) {
				rt.modSrcVar(f, "speculation", multiply(divide(rt.call(f, P("/proc/rand"), null, [-4000, 0]), 1000), rt.sv(f, "speculation")), add);
			}
		}
	}
	fucking_stock_spikes = add(rt.sv(f, "current_value"), 500);
	piece_of_shit_fuck = subtract(rt.sv(f, "current_value"), 500);
	if ((rt.lt((i_hate_this_code = multiply(add(divide(rt.sv(f, "speculation"), rt.call(f, P("/proc/rand"), null, [25000, 50000])), divide(rt.sv(f, "performance"), rt.call(f, P("/proc/rand"), null, [100, 800]))), rt.sv(f, "current_value"))), live(fucking_stock_spikes)) || rt.gt(live(i_hate_this_code), live(piece_of_shit_fuck)))) {
		rt.modSrcVar(f, "current_value", live(i_hate_this_code), add);
	}
	if (rt.lt(rt.sv(f, "current_value"), 5)) {
		rt.setSv(f, "current_value", 5);
	}
	if (!isEqual(rt.sv(f, "performance"), 0)) {
		rt.setSv(f, "performance", multiply(divide(rt.call(f, P("/proc/rand"), null, [900, 1050]), 1000), rt.sv(f, "performance")));
		if (rt.lt(rt.op(f, "Abs", [], [rt.sv(f, "performance")]), 0.20000000298023224)) {
			rt.setSv(f, "performance", 0);
		}
	}
	if (rt.lt(live(cv), rt.sv(f, "current_value"))) {
		$0 = 1;
	} else {
		if (rt.gt(live(cv), rt.sv(f, "current_value"))) {
			$0 = -1;
		} else {
			$0 = 0;
		}
	}
	rt.setSv(f, "disp_value_change", $0);
	rt.setSv(f, "last_value", rt.sv(f, "current_value"));
	if (rt.ge(rt.len(f, rt.sv(f, "values")), 50)) {
		rt.callName(f, rt.sv(f, "values"), "Cut", [1, 2]);
	}
	rt.modSrcVar(f, "values", rt.sv(f, "current_value"), add);
	if (rt.lt(rt.sv(f, "current_value"), 10)) {
		rt.callSrc(f, "unifyShares", []);
	}
	rt.setSv(f, "last_trend", rt.sv(f, "current_trend"));
	rt.modSrcVar(f, "current_trend", add(add(add(divide(rt.call(f, P("/proc/rand"), null, [-200, 200]), 100), divide(multiply(rt.sv(f, "optimism"), rt.call(f, P("/proc/rand"), null, [200])), 10)), multiply(divide(multiply(divide(rt.call(f, P("/proc/max"), null, [subtract(50, rt.op(f, "Abs", [], [rt.sv(f, "speculation")])), 0]), 50), rt.call(f, P("/proc/rand"), null, [0, 200])), 1000), rt.neg(rt.sv(f, "current_trend")))), divide(multiply(divide(multiply(rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "speculation"), 50), 0]), rt.call(f, P("/proc/rand"), null, [0, 200])), 1000), rt.sv(f, "speculation")), 400)), add);
	return f.dot;
});

// /datum/stock/proc/unifyShares  (code/modules/stock_market/stocks.dm:168)
rt.def("/datum/stock/proc/unifyShares", function unifyShares(f: Frame) {
	let I: Value = null, shr: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [I, shr, B, $e];
	I = null;
	rt.forList(f, 0, rt.sv(f, "shareholders"));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy(rt.modulus((shr = rt.index(rt.sv(f, "shareholders"), live(I))), 2))) {
			rt.callSrc(f, "sellShares", [live(I), 1]);
		}
		(shr = rt.modify(live(shr), 1, subtract));
		(rt.modAt(rt.sv(f, "shareholders"), live(I), 2, divide));
		if (!truthy(rt.index(rt.sv(f, "shareholders"), live(I)))) {
			(rt.modSrcVar(f, "shareholders", live(I), subtract));
		}
	}
	rt.endFor(f, 0);
	B = null;
	rt.forList(f, 0, rt.sv(f, "borrow_brokers"), T("/datum/borrow"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.setFv(f, "share_amount", live(B), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "share_amount", live(B)), 2)]));
		rt.setFv(f, "share_debt", live(B), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "share_debt", live(B)), 2)]));
	}
	rt.endFor(f, 0);
	B = null;
	rt.forList(f, 0, rt.sv(f, "borrows"), T("/datum/borrow"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		rt.setFv(f, "share_amount", live(B), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "share_amount", live(B)), 2)]));
		rt.setFv(f, "share_debt", live(B), rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "share_debt", live(B)), 2)]));
	}
	rt.endFor(f, 0);
	(rt.modSrcVar(f, "average_shares", 2, divide));
	(rt.modSrcVar(f, "available_shares", 2, divide));
	(rt.modSrcVar(f, "current_value", 2, multiply));
	rt.setSv(f, "last_unification", rt.worldTime(f));
	return f.dot;
});

// /datum/stock/proc/process  (code/modules/stock_market/stocks.dm:188)  may sleep
rt.def("/datum/stock/proc/process", function* process(f: Frame) {
	let B: Value = null, borrow: Value = null, amt: Value = null, E: Value = null, EV: Value = null;
	let $e: any;
	f.vars = () => [B, borrow, amt, E, EV, $e];
	B = null;
	rt.forList(f, 0, rt.sv(f, "borrows"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		borrow = live(B);
		if (rt.gt(rt.worldTime(f), rt.fv(f, "grace_expires", live(borrow)))) {
			yield* g.srcCall(f, "modifyAccount", rt.fv(f, "borrower", live(borrow)), rt.neg((yield* g.call(f, P("/proc/max"), null, [multiply(rt.sv(f, "current_value"), rt.fv(f, "share_debt", live(borrow))), 0]))), 1);
			(rt.modSrcVar(f, "borrows", live(borrow), subtract));
			if (truthy((rt.isIn(f, rt.fv(f, "borrower", live(borrow)), rt.gl("FrozenAccounts")) ? 1 : 0))) {
				(rt.modAt(rt.gl("FrozenAccounts"), rt.fv(f, "borrower", live(borrow)), live(borrow), subtract));
				if (isEqual(rt.length(rt.index(rt.gl("FrozenAccounts"), rt.fv(f, "borrower", live(borrow)))), 0)) {
					(rt.modGl("FrozenAccounts", rt.fv(f, "borrower", live(borrow)), subtract));
				}
			}
			yield* g.call(f, P("/proc/qdel"), null, [live(borrow)]);
		} else {
			if (rt.gt(rt.worldTime(f), rt.fv(f, "lease_expires", live(borrow)))) {
				if (truthy((rt.isIn(f, rt.fv(f, "borrower", live(borrow)), rt.sv(f, "shareholders")) ? 1 : 0))) {
					if (rt.gt((amt = rt.index(rt.sv(f, "shareholders"), rt.fv(f, "borrower", live(borrow)))), rt.fv(f, "share_debt", live(borrow)))) {
						(rt.modAt(rt.sv(f, "shareholders"), rt.fv(f, "borrower", live(borrow)), rt.fv(f, "share_debt", live(borrow)), subtract));
						(rt.modSrcVar(f, "borrows", live(borrow), subtract));
						if (truthy((rt.isIn(f, rt.fv(f, "borrower", live(borrow)), rt.gl("FrozenAccounts")) ? 1 : 0))) {
							(rt.modAt(rt.gl("FrozenAccounts"), rt.fv(f, "borrower", live(borrow)), live(borrow), subtract));
						}
						if (isEqual(rt.length(rt.index(rt.gl("FrozenAccounts"), rt.fv(f, "borrower", live(borrow)))), 0)) {
							(rt.modGl("FrozenAccounts", rt.fv(f, "borrower", live(borrow)), subtract));
						}
						yield* g.call(f, P("/proc/qdel"), null, [live(borrow)]);
					} else {
						(rt.modSrcVar(f, "shareholders", rt.fv(f, "borrower", live(borrow)), subtract));
						(rt.modField(f, live(borrow), "share_debt", live(amt), subtract));
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "bankrupt"))) {
		return live(f.dot);
	}
	B = null;
	rt.forList(f, 0, rt.sv(f, "borrow_brokers"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		if (rt.lt(rt.gv(f, "offer_expires", (borrow = live(B))), rt.worldTime(f))) {
			(rt.modSrcVar(f, "borrow_brokers", live(borrow), subtract));
			yield* g.call(f, P("/proc/qdel"), null, [live(borrow)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.srcCall(f, "generateBrokers");
	}
	rt.incSrcVar(f, "fluctuation_counter", 1, true);
	if (!rt.ge(rt.sv(f, "fluctuation_counter"), rt.sv(f, "fluctuation_rate"))) return f.dot;
	E = null;
	rt.forList(f, 0, rt.sv(f, "events"));
	while (($e = rt.next(f, 0)) !== undefined) {
		E = $e;
		yield* g.callName(f, (EV = live(E)), "process", []);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "fluctuation_counter", 0);
	yield* g.srcCall(f, "fluctuate");
	return f.dot;
}, true, { waitfor: false });

// /datum/stock/proc/generateBrokers  (code/modules/stock_market/stocks.dm:230)
rt.def("/datum/stock/proc/generateBrokers", function generateBrokers(f: Frame) {
	let broker: Value = null, B: Value = null;
	f.vars = () => [broker, B];
	if (rt.gt(rt.len(f, rt.sv(f, "borrow_brokers")), 2)) {
		return live(f.dot);
	}
	if (!truthy(rt.getLen(f, rt.fv(f, "stockBrokers", rt.gl("stockExchange"))))) {
		rt.callName(f, rt.gl("stockExchange"), "generateBrokers", []);
	}
	broker = rt.op(f, "PickUnweighted", [1], [rt.fv(f, "stockBrokers", rt.gl("stockExchange"))]);
	rt.setFv(f, "broker", (B = rt.new_(f, T("/datum/borrow"), [])), live(broker));
	rt.setFv(f, "stock", live(B), live(f.src));
	rt.setFv(f, "lease_time", live(B), multiply(rt.call(f, P("/proc/rand"), null, [4, 7]), 600));
	rt.setFv(f, "grace_time", live(B), multiply(rt.call(f, P("/proc/rand"), null, [1, 3]), 600));
	rt.setFv(f, "share_amount", live(B), multiply(rt.call(f, P("/proc/rand"), null, [1, 10]), 100));
	rt.setFv(f, "deposit", live(B), divide(rt.call(f, P("/proc/rand"), null, [20, 70]), 100));
	rt.setFv(f, "share_debt", live(B), rt.fv(f, "share_amount", live(B)));
	rt.setFv(f, "offer_expires", live(B), add(multiply(rt.call(f, P("/proc/rand"), null, [5, 10]), 600), rt.worldTime(f)));
	rt.modSrcVar(f, "borrow_brokers", live(B), add);
	return f.dot;
});

// /datum/stock/proc/modifyAccount  (code/modules/stock_market/stocks.dm:247)
rt.def("/datum/stock/proc/modifyAccount", function modifyAccount(f: Frame, whose: Value, by: Value, force: Value) {
	f.vars = () => [force];
	if (live(force) === null) {
		force = 0;
	}
	if (truthy(rt.fv(f, "points", rt.gl("SSshuttle")))) {
		if (((rt.lt(live(by), 0) && rt.lt(add(rt.fv(f, "points", rt.gl("SSshuttle")), live(by)), 0)) && !truthy(live(force)))) {
			return 0;
		}
		rt.modField(f, rt.gl("SSshuttle"), "points", live(by), add);
		rt.callName(f, rt.gl("stockExchange"), "balanceLog", [live(whose), live(by)]);
		return 1;
	}
	return 0;
});

// /datum/stock/proc/borrow  (code/modules/stock_market/stocks.dm:256)
rt.def("/datum/stock/proc/borrow", function borrow(f: Frame, B: Value, who: Value) {
	let old_d: Value = null, d_amt: Value = null;
	f.vars = () => [old_d, d_amt];
	if (truthy(rt.fv(f, "lease_expires", live(B)))) {
		return 0;
	}
	rt.setFv(f, "lease_expires", live(B), add(rt.worldTime(f), rt.fv(f, "lease_time", live(B))));
	old_d = rt.fv(f, "deposit", live(B));
	d_amt = multiply(multiply(rt.fv(f, "deposit", live(B)), rt.sv(f, "current_value")), rt.fv(f, "share_amount", live(B)));
	if (!truthy(rt.callSrc(f, "modifyAccount", [live(who), rt.neg(live(d_amt))]))) {
		rt.setFv(f, "lease_expires", live(B), 0);
		rt.setFv(f, "deposit", live(B), live(old_d));
		return 0;
	}
	rt.setFv(f, "deposit", live(B), live(d_amt));
	if (!truthy((rt.isIn(f, live(who), rt.sv(f, "shareholders")) ? 1 : 0))) {
		rt.setAt(rt.sv(f, "shareholders"), live(who), rt.fv(f, "share_amount", live(B)));
	} else {
		rt.modAt(rt.sv(f, "shareholders"), live(who), rt.fv(f, "share_amount", live(B)), add);
	}
	(rt.modSrcVar(f, "borrow_brokers", live(B), subtract));
	rt.modSrcVar(f, "borrows", live(B), add);
	rt.setFv(f, "borrower", live(B), live(who));
	rt.setFv(f, "grace_expires", live(B), add(rt.fv(f, "lease_expires", live(B)), rt.fv(f, "grace_time", live(B))));
	if (!truthy((rt.isIn(f, live(who), rt.gl("FrozenAccounts")) ? 1 : 0))) {
		rt.setAt(rt.gl("FrozenAccounts"), live(who), rt.list(live(B)));
	} else {
		rt.modAt(rt.gl("FrozenAccounts"), live(who), live(B), add);
	}
	return 1;
});

// /datum/stock/proc/buyShares  (code/modules/stock_market/stocks.dm:281)
rt.def("/datum/stock/proc/buyShares", function buyShares(f: Frame, who: Value, howmany: Value) {
	let loss: Value = null;
	f.vars = () => [howmany, loss];
	if (rt.le(live(howmany), 0)) {
		return live(f.dot);
	}
	howmany = rt.call(f, P("/proc/round"), null, [live(howmany)]);
	loss = multiply(live(howmany), rt.sv(f, "current_value"));
	if (rt.lt(rt.sv(f, "available_shares"), live(howmany))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "modifyAccount", [live(who), rt.neg(live(loss))]))) {
		rt.callSrc(f, "supplyDrop", [live(howmany)]);
		if (!truthy((rt.isIn(f, live(who), rt.sv(f, "shareholders")) ? 1 : 0))) {
			rt.setAt(rt.sv(f, "shareholders"), live(who), live(howmany));
		} else {
			rt.modAt(rt.sv(f, "shareholders"), live(who), live(howmany), add);
		}
		return 1;
	}
	return 0;
});

// /datum/stock/proc/sellShares  (code/modules/stock_market/stocks.dm:297)
rt.def("/datum/stock/proc/sellShares", function sellShares(f: Frame, whose: Value, howmany: Value) {
	let gain: Value = null;
	f.vars = () => [howmany, gain];
	if (rt.lt(live(howmany), 0)) {
		return live(f.dot);
	}
	howmany = rt.call(f, P("/proc/round"), null, [live(howmany)]);
	gain = multiply(live(howmany), rt.sv(f, "current_value"));
	if (rt.lt(rt.index(rt.sv(f, "shareholders"), live(whose)), live(howmany))) {
		return 0;
	}
	if (truthy(rt.callSrc(f, "modifyAccount", [live(whose), live(gain)]))) {
		rt.callSrc(f, "supplyGrowth", [live(howmany)]);
		(rt.modAt(rt.sv(f, "shareholders"), live(whose), live(howmany), subtract));
		if (rt.le(rt.index(rt.sv(f, "shareholders"), live(whose)), 0)) {
			(rt.modSrcVar(f, "shareholders", live(whose), subtract));
		}
		return 1;
	}
	return 0;
});

// /datum/stock/proc/displayValues  (code/modules/stock_market/stocks.dm:312)
rt.def("/datum/stock/proc/displayValues", function displayValues(f: Frame, user: Value) {
	rt.op(f, "Browse", [], [live(user), rt.call(f, P("/proc/plotBarGraph"), null, [rt.sv(f, "values"), fmt("＀ share value per share", [rt.sv(f, "name")])]), fmt("window=stock_＀;size=450x450", [rt.sv(f, "name")])], false);
	return f.dot;
});
