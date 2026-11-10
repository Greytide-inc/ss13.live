// Based on /tg/station's code/modules/stock_market/stocks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract, divide } = rt;


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

// stocks.dm:18
rt.def("/datum/stock/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.values = list();

	this.products = list();

	this.borrow_brokers = list();

	this.shareholders = list();

	this.borrows = list();

	this.events = list();

	this.articles = list();
	return f.dot;
});

// stocks.dm:50
rt.def("/datum/stock/proc/addEvent", function addEvent(f: Frame, E: Value) {
	(rt.modSrcVar(f, "events", E, rt.bitOr));
	return f.dot;
});

// stocks.dm:53
rt.def("/datum/stock/proc/addArticle", function addArticle(f: Frame, A: Value) {
	if (!rt.isIn(f, A, this.articles)) {
		this.articles.Insert(1, A);
	}
	A.ticks = rt.worldTime(f);
	return f.dot;
});

// stocks.dm:58
rt.def("/datum/stock/proc/generateEvents", function* generateEvents(f: Frame) {
	let _T: Value = null;
	let types: Value = typesof(T("/datum/stockEvent")) - T("/datum/stockEvent");
	for (_T of each(types)) {
		yield* this.generateEvent(_T);
	}
	return f.dot;
}, true);

// stocks.dm:63
rt.def("/datum/stock/proc/generateEvent", function* generateEvent(f: Frame, _T: Value) {
	let E: Value = null;
	this.addEvent((E = (yield* new_(_T, this))));
	return f.dot;
}, true);

// stocks.dm:67
rt.def("/datum/stock/proc/affectPublicOpinion", function affectPublicOpinion(f: Frame, boost: Value) {
	this.optimism += rand(0, 500) / 500 * boost;
	this.average_optimism += rand(0, 150) / 5000 * boost;
	this.speculation += rand(-1, 50) / 10 * boost;
	this.performance += rand(0, 150) / 100 * boost;
	return f.dot;
});

// stocks.dm:73
rt.def("/datum/stock/proc/generateIndustry", function* generateIndustry(f: Frame) {
	let ts: Value = null, in_t: Value = null;
	if (findtext(this.name, "Farms")) {
		this.industry = (yield* new_(T("/datum/industry/agriculture")));
	} else if (findtext(this.name, "Software") || findtext(this.name, "Programming") || findtext(this.name, "IT Group") || findtext(this.name, "Electronics") || findtext(this.name, "Electric") || findtext(this.name, "Nanotechnology")) {
		this.industry = (yield* new_(T("/datum/industry/it")));
	} else if (findtext(this.name, "Mobile") || findtext(this.name, "Communications")) {
		this.industry = (yield* new_(T("/datum/industry/communications")));
	} else if (findtext(this.name, "Pharmaceuticals") || findtext(this.name, "Health")) {
		this.industry = (yield* new_(T("/datum/industry/health")));
	} else if (findtext(this.name, "Wholesale") || findtext(this.name, "Stores")) {
		this.industry = (yield* new_(T("/datum/industry/consumer")));
	} else {
		ts = typesof(T("/datum/industry")) - T("/datum/industry");
		in_t = pick(ts);
		this.industry = (yield* new_(in_t));
	}
	let i: Value = 0;
	while (i < rand(2, 5)) {
		this.products += this.industry.generateProductName(this.name);
		i++;
	}
	return f.dot;
}, true);

// stocks.dm:91
rt.def("/datum/stock/proc/frc", function frc(f: Frame, amt: Value) {
	let fr: Value = null;
	let shares: Value = this.available_shares + this.outside_shareholders * this.average_shares;
	if ((fr = amt / 100 / shares * this.fluctuational_coefficient * this.fluctuation_rate * max(-(this.current_trend / 100), 1)) < 0 && this.speculation < 0 || fr > 0 && this.speculation > 0) {
		fr *= max(rt.op(f, "Abs", [], [this.speculation]) / 5, 1);
	} else {
		fr /= max(rt.op(f, "Abs", [], [this.speculation]) / 5, 1);
	}
	return fr;
});

// stocks.dm:100
rt.def("/datum/stock/proc/supplyGrowth", function supplyGrowth(f: Frame, amt: Value) {
	let fr: Value = this.frc(amt);
	this.available_shares += amt;
	if (rt.op(f, "Abs", [], [fr]) < 0.0001) {
		return f.dot;
	}
	this.current_value -= fr * this.current_value;
	return f.dot;
});

// stocks.dm:107
rt.def("/datum/stock/proc/supplyDrop", function supplyDrop(f: Frame, amt: Value) {
	this.supplyGrowth(-amt);
	return f.dot;
});

// stocks.dm:110
rt.def("/datum/stock/proc/fluctuate", function fluctuate(f: Frame) {
	let shareholder_change: Value = null, avg_change_dev: Value = null, avg_change: Value = null, aspec: Value = null, i_hate_this_code: Value = null;
	let $0: any;
	let change: Value = rand(-100, 100) / 10 + this.optimism * rand(200) / 10;
	this.optimism -= (this.optimism - this.average_optimism) * (rand(10, 80) / 1000);
	let shift_score: Value = change + this.current_trend;
	let as_score: Value = rt.op(f, "Abs", [], [shift_score]);
	let sh_change_dev: Value = rand(-10, 10) / 10;
	let sh_change: Value = shift_score / (as_score + 100) + sh_change_dev;
	this.outside_shareholders += (shareholder_change = round(sh_change));
	let share_change: Value = shareholder_change * this.average_shares;
	if (as_score > 20 && prob(as_score / 4)) {
		avg_change_dev = rand(-10, 10) / 10;
		this.average_shares += (avg_change = shift_score / (as_score + 100) + avg_change_dev);
		share_change += this.outside_shareholders * avg_change;
	}
	let cv: Value = this.last_value;
	this.supplyDrop(share_change);
	this.available_shares += share_change;
	if (prob(25)) {
		this.average_optimism = max(min(this.average_optimism + (rand(-3, 3) - this.current_trend * 0.15) / 100, 1), -1);
	}
	if (prob(((aspec = rt.op(f, "Abs", [], [this.speculation])) - 75) * 2)) {
		this.speculation += rand(-4, 4);
	} else if (prob(50)) {
		this.speculation += rand(-4, 4);
	} else {
		this.speculation += rand(-400, 0) / 1000 * this.speculation;
		if (prob(1) && prob(5)) {
			this.speculation += rand(-4000, 0) / 1000 * this.speculation;
		}
	}
	let fucking_stock_spikes: Value = this.current_value + 500;
	let piece_of_shit_fuck: Value = this.current_value - 500;
	if ((i_hate_this_code = (this.speculation / rand(25000, 50000) + this.performance / rand(100, 800)) * this.current_value) < fucking_stock_spikes || i_hate_this_code > piece_of_shit_fuck) {
		this.current_value += i_hate_this_code;
	}
	if (this.current_value < 5) {
		this.current_value = 5;
	}
	if (this.performance != 0) {
		this.performance = rand(900, 1050) / 1000 * this.performance;
		if (rt.op(f, "Abs", [], [this.performance]) < 0.2) {
			this.performance = 0;
		}
	}
	if (cv < this.current_value) {
		$0 = 1;
	} else if (cv > this.current_value) {
		$0 = -1;
	} else {
		$0 = 0;
	}
	this.disp_value_change = $0;
	this.last_value = this.current_value;
	if (rt.len(f, this.values) >= 50) {
		this.values.Cut(1, 2);
	}
	this.values += this.current_value;
	if (this.current_value < 10) {
		this.unifyShares();
	}
	this.last_trend = this.current_trend;
	this.current_trend += rand(-200, 200) / 100 + this.optimism * rand(200) / 10 + max(50 - rt.op(f, "Abs", [], [this.speculation]), 0) / 50 * rand(0, 200) / 1000 * -this.current_trend + max(this.speculation - 50, 0) * rand(0, 200) / 1000 * this.speculation / 400;
	return f.dot;
});

// stocks.dm:168
rt.def("/datum/stock/proc/unifyShares", function unifyShares(f: Frame) {
	let I: Value = null, shr: Value = null, B: Value = null;
	for (I of each(this.shareholders)) {
		if ((shr = rt.index(this.shareholders, I)) % 2) {
			this.sellShares(I, 1);
		}
		shr -= 1;
		(rt.modAt(this.shareholders, I, 2, divide));
		if (!rt.index(this.shareholders, I)) {
			this.shareholders -= I;
		}
	}
	for (B of each(this.borrow_brokers, T("/datum/borrow"))) {
		B.share_amount = round(B.share_amount / 2);
		B.share_debt = round(B.share_debt / 2);
	}
	B = null;
	for (B of each(this.borrows, T("/datum/borrow"))) {
		B.share_amount = round(B.share_amount / 2);
		B.share_debt = round(B.share_debt / 2);
	}
	this.average_shares /= 2;
	this.available_shares /= 2;
	this.current_value *= 2;
	this.last_unification = rt.worldTime(f);
	return f.dot;
});

// stocks.dm:188
rt.def("/datum/stock/proc/process", function* process(f: Frame) {
	let B: Value = null, borrow: Value = null, amt: Value = null, E: Value = null, EV: Value = null;
	for (B of each(this.borrows)) {
		borrow = B;
		if (rt.worldTime(f) > borrow.grace_expires) {
			this.modifyAccount(borrow.borrower, -max(this.current_value * borrow.share_debt, 0), 1);
			this.borrows -= borrow;
			if (rt.isIn(f, borrow.borrower, GLOB.FrozenAccounts)) {
				(rt.modAt(GLOB.FrozenAccounts, borrow.borrower, borrow, subtract));
				if (rt.length(rt.index(GLOB.FrozenAccounts, borrow.borrower)) == 0) {
					GLOB.FrozenAccounts -= borrow.borrower;
				}
			}
			yield* qdel(borrow);
		} else if (rt.worldTime(f) > borrow.lease_expires) {
			if (rt.isIn(f, borrow.borrower, this.shareholders)) {
				if ((amt = rt.index(this.shareholders, borrow.borrower)) > borrow.share_debt) {
					(rt.modAt(this.shareholders, borrow.borrower, borrow.share_debt, subtract));
					this.borrows -= borrow;
					if (rt.isIn(f, borrow.borrower, GLOB.FrozenAccounts)) {
						(rt.modAt(GLOB.FrozenAccounts, borrow.borrower, borrow, subtract));
					}
					if (rt.length(rt.index(GLOB.FrozenAccounts, borrow.borrower)) == 0) {
						GLOB.FrozenAccounts -= borrow.borrower;
					}
					yield* qdel(borrow);
				} else {
					this.shareholders -= borrow.borrower;
					borrow.share_debt -= amt;
				}
			}
		}
	}
	if (this.bankrupt) {
		return f.dot;
	}
	B = null;
	for (B of each(this.borrow_brokers)) {
		if ((borrow = B).offer_expires < rt.worldTime(f)) {
			this.borrow_brokers -= borrow;
			yield* qdel(borrow);
		}
	}
	if (prob(5)) {
		this.generateBrokers();
	}
	this.fluctuation_counter++;
	if (!(this.fluctuation_counter >= this.fluctuation_rate)) return f.dot;
	for (E of each(this.events)) {
		yield* (EV = E).process();
	}
	this.fluctuation_counter = 0;
	this.fluctuate();
	return f.dot;
}, true, { waitfor: false });

// stocks.dm:230
rt.def("/datum/stock/proc/generateBrokers", function generateBrokers(f: Frame) {
	let B: Value = null;
	if (rt.len(f, this.borrow_brokers) > 2) {
		return f.dot;
	}
	if (!rt.len(f, GLOB.stockExchange.stockBrokers)) {
		GLOB.stockExchange.generateBrokers();
	}
	let broker: Value = pick(GLOB.stockExchange.stockBrokers);
	(B = new_(T("/datum/borrow"))).broker = broker;
	B.stock = this;
	B.lease_time = rand(4, 7) * 600;
	B.grace_time = rand(1, 3) * 600;
	B.share_amount = rand(1, 10) * 100;
	B.deposit = rand(20, 70) / 100;
	B.share_debt = B.share_amount;
	B.offer_expires = rand(5, 10) * 600 + rt.worldTime(f);
	this.borrow_brokers += B;
	return f.dot;
});

// stocks.dm:247
rt.def("/datum/stock/proc/modifyAccount", function modifyAccount(f: Frame, whose: Value, by: Value, force: Value) {
	force ??= 0;
	if (GLOB.SSshuttle.points) {
		if (by < 0 && GLOB.SSshuttle.points + by < 0 && !force) {
			return 0;
		}
		GLOB.SSshuttle.points += by;
		GLOB.stockExchange.balanceLog(whose, by);
		return 1;
	}
	return 0;
});

// stocks.dm:256
rt.def("/datum/stock/proc/borrow", function borrow(f: Frame, B: Value, who: Value) {
	if (B.lease_expires) {
		return 0;
	}
	B.lease_expires = rt.worldTime(f) + B.lease_time;
	let old_d: Value = B.deposit;
	let d_amt: Value = B.deposit * this.current_value * B.share_amount;
	if (!this.modifyAccount(who, -d_amt)) {
		B.lease_expires = 0;
		B.deposit = old_d;
		return 0;
	}
	B.deposit = d_amt;
	if (!rt.isIn(f, who, this.shareholders)) {
		rt.setAt(this.shareholders, who, B.share_amount);
	} else {
		rt.modAt(this.shareholders, who, B.share_amount, add);
	}
	this.borrow_brokers -= B;
	this.borrows += B;
	B.borrower = who;
	B.grace_expires = B.lease_expires + B.grace_time;
	if (!rt.isIn(f, who, GLOB.FrozenAccounts)) {
		rt.setAt(GLOB.FrozenAccounts, who, list(B));
	} else {
		rt.modAt(GLOB.FrozenAccounts, who, B, add);
	}
	return 1;
});

// stocks.dm:281
rt.def("/datum/stock/proc/buyShares", function buyShares(f: Frame, who: Value, howmany: Value) {
	if (howmany <= 0) {
		return f.dot;
	}
	howmany = round(howmany);
	let loss: Value = howmany * this.current_value;
	if (this.available_shares < howmany) {
		return 0;
	}
	if (this.modifyAccount(who, -loss)) {
		this.supplyDrop(howmany);
		if (!rt.isIn(f, who, this.shareholders)) {
			rt.setAt(this.shareholders, who, howmany);
		} else {
			rt.modAt(this.shareholders, who, howmany, add);
		}
		return 1;
	}
	return 0;
});

// stocks.dm:297
rt.def("/datum/stock/proc/sellShares", function sellShares(f: Frame, whose: Value, howmany: Value) {
	if (howmany < 0) {
		return f.dot;
	}
	howmany = round(howmany);
	let gain: Value = howmany * this.current_value;
	if (rt.index(this.shareholders, whose) < howmany) {
		return 0;
	}
	if (this.modifyAccount(whose, gain)) {
		this.supplyGrowth(howmany);
		(rt.modAt(this.shareholders, whose, howmany, subtract));
		if (rt.index(this.shareholders, whose) <= 0) {
			this.shareholders -= whose;
		}
		return 1;
	}
	return 0;
});

// stocks.dm:312
rt.def("/datum/stock/proc/displayValues", function displayValues(f: Frame, user: Value) {
	rt.op(f, "Browse", [], [user, plotBarGraph(this.values, `${this.name} share value per share`), `window=stock_${this.name};size=450x450`], false);
	return f.dot;
});
