// Based on /tg/station's code/modules/stock_market/events.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


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

// events.dm:17
rt.def("/datum/stockEvent/proc/process", function* process(f: Frame) {
	if (this.finished) {
		return f.dot;
	}
	if (!(rt.worldTime(f) > this.next_phase)) return f.dot;
	yield* this.transition();
	return f.dot;
}, true, { waitfor: false });

// events.dm:24
rt.def("/datum/stockEvent/proc/spacetime", function spacetime(f: Frame, ticks: Value) {
	let minutes: Value = null;
	let seconds: Value = round(ticks / 10);
	seconds -= (minutes = round(seconds / 60)) * 60;
	return `${minutes} minute(s) and ${seconds} second(s)`;
});

rt.type(4207, "/datum/stockEvent/product", "/datum/stockEvent", {
	product_name: "",
	product_article: null,
	effect: 0,
	name: "product",
});

// events.dm:36
rt.def("/datum/stockEvent/product/proc/New", function New(f: Frame, S: Value) {
	let mins: Value = null;
	this.company = S;
	this.next_phase = (mins = rand(3.5, 14)) * 420 + rt.worldTime(f);
	this.current_title = "Product demo";
	this.current_desc = S.industry.detokenize(`${S.name} will unveil a new product on an upcoming %industrial% conference held at spacetime ${this.spacetime(this.next_phase)}`);
	S.addEvent(this);
	return f.dot;
});

// events.dm:46
rt.def("/datum/stockEvent/product/proc/transition", function* transition(f: Frame) {
	let A: Value = null;
	this.last_change = rt.worldTime(f);
	if (this.phase_id === 0) {
		this.next_phase = rt.worldTime(f) + rand(210, 420) * 7;
		this.product_name = this.company.industry.generateProductName(this.company.name);
		this.current_title = `Product release: ${this.product_name}`;
		this.current_desc = `${this.company.name} unveiled their newest product, ${this.product_name}, at a conference. Product release is expected to happen at spacetime ${this.spacetime(this.next_phase)}.`;
		this.product_article = (A = this.company.industry.generateInCharacterProductArticle(this.product_name, this.company));
		this.effect = A.opinion + rand(-1, 1);
		this.company.affectPublicOpinion(this.effect);
		this.phase_id = 1;
	} else if (this.phase_id === 1) {
		this.finished = 1;
		this.hidden = 1;
		this.company.addArticle(this.product_article);
		this.effect += this.product_article.opinion * 5;
		this.company.affectPublicOpinion(this.effect);
		this.phase_id = 2;
		yield* this.company.generateEvent(this.type);
	}
	return f.dot;
}, true);

rt.type(4208, "/datum/stockEvent/bankruptcy", "/datum/stockEvent", {
	effect: 0,
	bailout_millions: 0,
	name: "bankruptcy",
});

// events.dm:73
rt.def("/datum/stockEvent/bankruptcy/proc/New", function New(f: Frame, S: Value) {
	this.hidden = 1;
	this.company = S;
	let mins: Value = rand(6.2999997, 42);
	this.bailout_millions = rand(70, 190);
	this.next_phase = mins * 300 * TIME_MULTIPLIER + rt.worldTime(f);
	this.current_title = "";
	this.current_desc = "";
	S.addEvent(this);
	return f.dot;
});

// events.dm:82
rt.def("/datum/stockEvent/bankruptcy/proc/transition", function* transition(f: Frame) {
	let A: Value = null, X: Value = null, amt: Value = null, bailout: Value = null;
	let $1: any, $e: any;
	let $0: any = this.phase_id;
	if ($0 === 0) {
		this.next_phase = rt.worldTime(f) + rand(210, 420) * 7;
		if (!(A = this.generateBankruptcyArticle()).opinion) {
			$0 = rand(5);
			if (prob(50)) {
				$1 = -1;
			} else {
				$1 = 1;
			}
			this.effect = $0 * $1;
		} else {
			if (prob(25)) {
				$0 = -A.opinion * rand(8);
			} else {
				$0 = A.opinion * rand(4);
			}
			this.effect = $0;
		}
		this.company.addArticle(A);
		this.company.affectPublicOpinion(rand(-6, -3));
		this.hidden = 0;
		this.current_title = "Bailout pending due to bankruptcy";
		this.current_desc = `The government prepared a press release, which will occur at spacetime ${this.spacetime(this.next_phase)}.`;
		this.phase_id = 1;
	} else if ($0 === 1) {
		this.next_phase = rt.worldTime(f) + rand(210, 420) * 7;
		this.finished = 1;
		if (this.effect <= -5 && prob(10)) {
			this.current_title = `${this.company.name}: Complete crash`;
			this.current_desc = "The company had gone bankrupt, was not bailed out and could not recover. No further stock trade will take place. All shares in the company are effectively worthless.";
			this.company.bankrupt = 1;
			for (X of each(this.company.shareholders)) {
				amt = rt.index(this.company.shareholders, X);
				GLOB.stockExchange.balanceLog(X, -amt * this.company.current_value);
			}
			this.company.shareholders = list();
			this.company.current_value = 0;
			this.company.borrow_brokers = list();
			yield* GLOB.stockExchange.generateStocks(1);
		}
		bailout = (((this.effect > 0 ? 1 : 0) && prob(80)) || ((this.effect < 0 ? 1 : 0) && prob(20)));
		$0 = this.company.name;
		if (bailout) {

			$1 = "bailed out";
		} else {
			$1 = "on a painful rebound";
		}
		this.current_title = `${$0} ${$1}`;
		if (bailout) {
			this.current_desc = "The company has been bailed out by the government. Investors are highly optimistic.";
			this.company.affectPublicOpinion(rt.op(f, "Abs", [], [this.effect]) * 2);
		} else {
			this.current_desc = "The company was not bailed out, but managed to crawl out of bankruptcy. Stockholder trust is severely dented.";
			this.company.affectPublicOpinion(-rt.op(f, "Abs", [], [this.effect]) / 2);
		}
		yield* this.company.generateEvent(this.type);
	}
	return f.dot;
}, true);

// events.dm:122
rt.def("/datum/stockEvent/bankruptcy/proc/generateBankruptcyArticle", function generateBankruptcyArticle(f: Frame) {
	let $0: any;
	let A: Value = new_(T("/datum/article"));
	let bankrupt_reason: Value = list("investor pessimism", "failure of product lines", "economic recession", "overblown inflation", "overblown deflation", "collapsed pyramid schemes", "a Ponzi scheme", "economic terrorism", "extreme hedonism", "unfavourable economic climate", "rampant government corruption", "divine conspiracy", "some total bullshit", "volatile plans");
	A.about = this.company;
	A.headline = pick(`${this.company.name} filing for bankruptcy`, `${this.company.name} unable to pay, investors run`, `${this.company.name} crashes, in foreclosure`, `${this.company.name} in dire need of credits`);
	A.subtitle = "Investors panic, bailout pending";
	if (prob(15)) {
		A.opinion = rand(-1, 1);
	}
	if (this.company.current_trend > 0) {
		$0 = "despite their positive trend";
	} else {
		$0 = "in line with their failing model";
	}
	let article: Value = `Another one might bite the dust: ${$0}, ${this.company.name} files for bankruptcy citing ${pick(bankrupt_reason)}. The president of %country% has been asked to bail the company out, `;
	if (!A.opinion) {
		article += "but no answer has been given by the government to date. Our tip to stay safe is: %sell%";
	} else if (A.opinion > 0) {
		article += "and the government responded positively. When the share value hits its lowest, it is a safe bet to %buy%";
	} else {
		article += "but the outlook is not good. For investors, now would be an ideal time to %sell%";
	}
	A.article = A.detokenize(article, this.company.industry.tokens);
	return A;
});

rt.type(4209, "/datum/stockEvent/arrest", "/datum/stockEvent", {
	female: 0,
	tname: "Elvis Presley",
	position: "CEO",
	offenses: "murder",
	effect: 0,
	name: "arrest",
});

// events.dm:152
rt.def("/datum/stockEvent/arrest/proc/New", function New(f: Frame, S: Value) {
	let mins: Value = null, offense: Value = null;
	let $0: any, $1: any, $2: any;
	this.hidden = 1;
	this.company = S;
	this.next_phase = (mins = rand(7, 24.5)) * 600 * TIME_MULTIPLIER + rt.worldTime(f);
	this.current_title = "";
	this.current_desc = "";
	this.female = prob(50);
	if (prob(50)) {
		if (prob(20)) {
			$0 = vowel();
		} else {
			$0 = consonant();
		}
		this.position = `C${$0}O`;
	} else {
		this.position = ucfirsts(this.company.industry.detokenize("Lead %industrial% Engineer"));
	}
	this.offenses = "";
	let O: Value = list("corruption", "murder", "grand theft", "assault", "battery", "drug possession", "burglary", "theft", "grand sabotage", "bribery", "disorderly conduct", "treason", "sedition", "shoplifting", "tax evasion", "tax fraud", "insurance fraud", "perjury", "kidnapping", "manslaughter", "vandalism", "forgery", "extortion", "embezzlement", "public indecency", "public intoxication", "trespassing", "loitering", "littering", "vigilantism", "squatting", "panhandling", "arson", "spacepodjacking", "shuttlejacking", "carjacking", "singularityjacking", "dereliction of duty", "spacecraft piracy", "music piracy", "tabletop game piracy", "software piracy", "escaping from space prison", "seniornapping", "clownnapping", "corginapping", "catnapping", "sleeping on the job", "terrorism", "counterterrorism", "drug distribution", "insubordination", "jaywalking", "owning a computer", "owning a cellphone", "owning a PDA", "owning a pAI", "adultery", "committing an unnatural act with another person", "corrupting public morals", "skateboarding without a license", "shitcurity", "bestiality", "erotic roleplay", "accidentally strangling a prostitute");
	while (prob(60) && rt.len(f, O) > 2) {
		O -= (offense = pick(O));
		if (prob(20)) {
			$0 = "attempted ";
		} else if (prob(20)) {
			$0 = "being accessory to ";
		} else {
			$0 = null;
		}
		$1 = offense;
		if (prob(5)) {
			$2 = ` of the ${pick("first", "second", "third", "fourth", "fifth", "sixth")} degree`;
		} else {
			$2 = null;
		}
		offense = `${$0}${$1}${$2}`;
		if (this.offenses == "") {
			this.offenses = offense;
		} else {
			this.offenses += `, ${offense}`;
		}
	}
	if (prob(20)) {
		$0 = "attempted ";
	} else {
		$0 = null;
	}
	this.offenses += ` and ${$0}${pick(O)}`;
	S.addEvent(this);
	return f.dot;
});

// events.dm:181
rt.def("/datum/stockEvent/arrest/proc/transition", function* transition(f: Frame) {
	let A: Value = null;
	let $0: any = this.phase_id;
	if ($0 === 0) {
		if (this.female) {
			$0 = pick(GLOB.first_names_female);
		} else {
			$0 = pick(GLOB.first_names_male);
		}
		this.tname = `${$0} ${pick(GLOB.last_names)}`;
		this.next_phase = rt.worldTime(f) + rand(210, 420) * 7;
		if (!(A = this.generateArrestArticle()).opinion) {
			$0 = rand(5);
			this.effect = $0 * (prob(50) ? -1 : 1);
		} else {
			if (prob(25)) {
				$0 = -A.opinion * rand(5);
			} else {
				$0 = A.opinion * rand(3);
			}
			this.effect = $0;
		}
		this.company.addArticle(A);
		this.company.affectPublicOpinion(rand(-3, -1));
		this.hidden = 0;
		this.current_title = `Trial of ${this.tname} (${this.position}) scheduled`;
		if (this.female) {
			$0 = "She";
		} else {
			$0 = "He";
		}
		this.current_desc = `${$0} has been charged with ${this.offenses}; the trial is scheduled to occur at spacetime ${this.spacetime(this.next_phase)}.`;
		this.phase_id = 1;
	} else if ($0 === 1) {
		this.next_phase = rt.worldTime(f) + rand(210, 420) * 7;
		this.finished = 1;
		this.current_title = `${this.tname} ${this.effect > 0 ? "acquitted" : "found guilty"}`;
		if (this.effect > 0) {
			this.current_desc = "The accused has been acquitted of all charges. Investors optimistic.";
		} else {
			this.current_desc = "The accused has been found guilty of all charges. Investor trust takes massive hit.";
		}
		this.company.affectPublicOpinion(this.effect);
		yield* this.company.generateEvent(this.type);
	}
	return f.dot;
}, true);

// events.dm:208
rt.def("/datum/stockEvent/arrest/proc/generateArrestArticle", function generateArrestArticle(f: Frame) {
	let A: Value = null;
	(A = new_(T("/datum/article"))).about = this.company;
	A.headline = this.company.industry.detokenize(pick(`${this.tname}, ${this.position} of ${this.company.name} arrested`, `${this.position} of ${this.company.name} facing jail time`, `${this.tname} behind bars`, `${this.position} of %industrial% company before trial`, `Police arrest ${this.tname} in daring raid`, `Job vacancy ahead: ${this.company.name}'s ${this.position} in serious trouble`));
	A.subtitle = `${A.author} reporting directly from the courtroom`;
	if (prob(15)) {
		A.opinion = rand(-1, 1);
	}
	let article: Value = `${pick("Security", "Law enforcement")} forces issued a statement that ${this.tname}, the ${this.position} of ${this.company.name}, the %famous% %industrial% %company% was arrested %this_time%. The trial has been scheduled and the statement reports that the arrested individual is being charged with ${this.offenses}. `;
	if (!A.opinion) {
		article += "While we cannot predict the outcome of this trial, our tip to stay safe is: %sell%";
	} else if (A.opinion > 0) {
		article += "Our own investigation shows that these charges are baseless and the arrest is most likely a publicity stunt. Our advice? You should %buy%";
	} else {
		article += `${this.tname} has a prior history of similar misdeeds and we're confident the charges will stand. For investors, now would be an ideal time to %sell%`;
	}
	A.article = A.detokenize(article, this.company.industry.tokens);
	return A;
});
