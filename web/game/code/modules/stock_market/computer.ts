// Based on /tg/station's code/modules/stock_market/computer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10436, "/obj/machinery/computer/stockexchange", "/obj/machinery/computer", {
	logged_in: "Cargo Department",
	vmode: 1,
	icon_screen: "stock_computer",
	icon_keyboard: "no_keyboard",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/stockexchange"),
	clockwork: 1,
	light_color: "#64C864",
	name: "stock exchange computer",
	icon: rt.rsc("icons/obj/computer.dmi"),
	icon_state: "oldcomp",
});

// computer.dm:15
rt.def("/obj/machinery/computer/stockexchange/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.logged_in = `${station_name()} Cargo Department`;
	return f.dot;
}, true);

// computer.dm:19
rt.def("/obj/machinery/computer/stockexchange/proc/balance", function balance(f: Frame) {
	if (!this.logged_in) {
		return 0;
	}
	return GLOB.SSshuttle.points;
});

// computer.dm:24
rt.def("/obj/machinery/computer/stockexchange/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// computer.dm:27
rt.def("/obj/machinery/computer/stockexchange/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// computer.dm:30
rt.def("/obj/machinery/computer/stockexchange/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null, LR: Value = null, mystocks: Value = null, prod: Value = null, news: Value = null, LR_5: Value = null, lrt: Value = null, A: Value = null, E: Value = null, popup: Value = null;
	let $1: any, $2: any, $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	user.machine = this;
	let css: Value = "<style>\n.change {\n\tfont-weight: bold;\n\tfont-family: monospace;\n}\n.up {\n\tbackground: #00a000;\n}\n.down {\n\tbackground: #a00000;\n}\n.stable {\n\twidth: 100%\n\tborder-collapse: collapse;\n\tborder: 1px solid #305260;\n\tborder-spacing: 4px 4px;\n}\n.stable td, .stable th {\n\tborder: 1px solid #305260;\n\tpadding: 0px 3px;\n}\n.bankrupt {\n\tborder: 1px solid #a00000;\n\tbackground: #a00000;\n}\n\na.updated {\n\tcolor: red;\n}\n</style>";
	let dat: Value = `<html><head><title>${station_name()} Stock Exchange</title>${css}</head><body>`;
	dat += `<span class='user'>Welcome, <b>${this.logged_in}</b></span><br><span class='balance'><b>Credits:</b> ${this.balance()} </span><br>`;
	for (S of each(GLOB.stockExchange.last_read, T("/datum/stock"))) {
		LR = rt.index(GLOB.stockExchange.last_read, S);
		if (!rt.isIn(f, this.logged_in, LR)) {
			rt.setAt(LR, this.logged_in, 0);
		}
	}
	let $0: any = this;
	dat += fmt("<b>View mode:</b> <a href='?src=＃;cycleview=1'>＀</a> ", [$0, this.vmode ? "Compact" : "Full"]);
	dat += fmt("<b>Stock Transaction Log:</b> <a href='?src=＃;show_logs=1'>Check</a><br>", [this]);
	dat += "<i>This is a work in progress. Certain features may not be available.</i>";
	dat += "<h3>Listed stocks</h3>";
	if (this.vmode == 0) {
		S = null;
		for (S of each(GLOB.stockExchange.stocks, T("/datum/stock"))) {
			mystocks = 0;
			if (this.logged_in && rt.isIn(f, this.logged_in, S.shareholders)) {
				mystocks = rt.index(S.shareholders, this.logged_in);
			}
			$0 = S.name;
			$1 = S.short_name;
			if (S.bankrupt) {
				$2 = " <b style='color:red'>BANKRUPT</b>";
			} else {
				$2 = null;
			}
			dat += `<hr /><div class='stock'><span class='company'>${$0}</span> <span class='s_company'>(${$1})</span>${$2}<br>`;
			if (S.last_unification) {
				dat += `<b>Unified shares</b> ${(rt.worldTime(f) - S.last_unification) / 600} minutes ago.<br>`;
			}
			dat += fmt("<b>Current value per share:</b> ＀ | <a href='?src=＃;viewhistory=＃'>View history</a><br><br>", [S.current_value, this, S]);
			dat += `You currently own <b>${mystocks}</b> shares in this company. There are ${S.available_shares} purchasable shares on the market currently.<br>`;
			if (S.bankrupt) {
				dat += "You cannot buy or sell shares in a bankrupt company!<br><br>";
			} else {
				dat += fmt("<a href='?src=＃;buyshares=＃'>Buy shares</a> | <a href='?src=＃;sellshares=＃'>Sell shares</a><br><br>", [this, S, this, S]);
			}
			dat += "<b>Prominent products:</b><br>";
			prod = null;
			for (prod of each(S.products)) {
				dat += `<i>${prod}</i><br>`;
			}
			news = 0;
			if (this.logged_in) {
				LR_5 = rt.index(GLOB.stockExchange.last_read, S);
				lrt = rt.index(LR_5, this.logged_in);
				A = null;
				for (A of each(S.articles, T("/datum/article"))) {
					if (A.ticks > lrt) {
						news = 1;
						break;
					}
				}
				if (!news) {
					E = null;
					for (E of each(S.events, T("/datum/stockEvent"))) {
						if (E.last_change > lrt && !E.hidden) {
							news = 1;
							break;
						}
					}
				}
			}
			$0 = this;
			$1 = S;
			if (news) {

				$2 = " <span style='color:red'>(updated)</span>";
			} else {
				$2 = null;
			}
			dat += fmt("<a href='?src=＃;archive=＃'>View news archives</a>＀</div>", [$0, $1, $2]);
		}
	} else if (this.vmode == 1) {
		dat += "<b>Actions:</b> + Buy, - Sell, (A)rchives, (H)istory<br><br>";
		dat += "<table class='stable'>";
		dat += "<tr><th>&nbsp;</th><th>ID</th><th>Name</th><th>Value</th><th>Owned</th><th>Avail</th><th>Actions</th></tr>";
		S = null;
		for (S of each(GLOB.stockExchange.stocks, T("/datum/stock"))) {
			mystocks = 0;
			if (this.logged_in && rt.isIn(f, this.logged_in, S.shareholders)) {
				mystocks = rt.index(S.shareholders, this.logged_in);
			}
			if (S.bankrupt) {
				dat += "<tr class='bankrupt'>";
			} else {
				dat += "<tr>";
			}
			if (S.disp_value_change > 0) {
				dat += "<td class='change up'>+</td>";
			} else if (S.disp_value_change < 0) {
				dat += "<td class='change down'>-</td>";
			} else {
				dat += "<td class='change'>=</td>";
			}
			dat += `<td><b>${S.short_name}</b></td>`;
			dat += `<td>${S.name}</td>`;
			if (!S.bankrupt) {
				dat += `<td>${S.current_value}</td>`;
			} else {
				dat += "<td>0</td>";
			}
			if (mystocks) {
				dat += `<td><b>${mystocks}</b></td>`;
			} else {
				dat += "<td>0</td>";
			}
			dat += `<td>${S.available_shares}</td>`;
			news = 0;
			if (this.logged_in) {
				LR_5 = rt.index(GLOB.stockExchange.last_read, S);
				lrt = rt.index(LR_5, this.logged_in);
				A = null;
				for (A of each(S.articles, T("/datum/article"))) {
					if (A.ticks > lrt) {
						news = 1;
						break;
					}
				}
				if (!news) {
					E = null;
					for (E of each(S.events, T("/datum/stockEvent"))) {
						if (E.last_change > lrt && !E.hidden) {
							news = 1;
							break;
						}
					}
				}
			}
			dat += "<td>";
			if (S.bankrupt) {
				dat += "<span class='linkOff'>+</span> <span class='linkOff'>-</span> ";
			} else {
				dat += fmt("<a href='?src=＃;buyshares=＃'>+</a> <a href='?src=＃;sellshares=＃'>-</a> ", [this, S, this, S]);
			}
			$0 = this;
			$1 = S;
			if (news) {

				$2 = "updated";
			} else {
				$2 = "default";
			}
			dat += fmt("<a href='?src=＃;archive=＃' class='＀'>(A)</a> <a href='?src=＃;viewhistory=＃'>(H)</a></td>", [$0, $1, $2, this, S]);
			dat += "</tr>";
		}
		dat += "</table>";
	}
	dat += "</body></html>";
	(popup = (yield* new_(T("/datum/browser"), user, "computer", "Stock Exchange", 600, 600))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// computer.dm:177
rt.def("/obj/machinery/computer/stockexchange/proc/sell_some_shares", function* sell_some_shares(f: Frame, S: Value, user: Value) {
	let li: Value = null, avail: Value = null, amt: Value = null;
	if (!user || !S) {
		return f.dot;
	}
	if (!(li = this.logged_in)) {
		to_chat(user, "<span class='danger'>No active account on the console!</span>");
		return f.dot;
	}
	let b: Value = GLOB.SSshuttle.points;
	if (!(avail = rt.index(S.shareholders, this.logged_in))) {
		to_chat(user, `<span class='danger'>This account does not own any shares of ${S.name}!</span>`);
		return f.dot;
	}
	let price: Value = S.current_value;
	amt = min((amt = round((yield* g.op(f, "Prompt", [33], [0, `Sell shares in ${S.name}`, `How many shares? \n(Have: ${avail}, unit price: ${price})`, user, null])))), rt.index(S.shareholders, this.logged_in));
	if (!user || !rt.isIn(f, user, range(1, this)) && rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (!amt) {
		return f.dot;
	}
	if (li != this.logged_in) {
		return f.dot;
	}
	if (!isnum((b = GLOB.SSshuttle.points))) {
		to_chat(user, "<span class='danger'>No active account on the console!</span>");
		return f.dot;
	}
	let total: Value = amt * S.current_value;
	if (!S.sellShares(this.logged_in, amt)) {
		to_chat(user, "<span class='danger'>Could not complete transaction.</span>");
		return f.dot;
	}
	to_chat(user, `<span class='notice'>Sold ${amt} shares of ${S.name} at ${S.current_value} a share for ${total} credits.</span>`);
	yield* GLOB.stockExchange.add_log(T("/datum/stock_log/sell"), user.name, S.name, amt, S.current_value, total);
	return f.dot;
}, true);

// computer.dm:211
rt.def("/obj/machinery/computer/stockexchange/proc/buy_some_shares", function* buy_some_shares(f: Frame, S: Value, user: Value) {
	let li: Value = null, b: Value = null;
	if (!user || !S) {
		return f.dot;
	}
	if (!(li = this.logged_in)) {
		to_chat(user, "<span class='danger'>No active account on the console!</span>");
		return f.dot;
	}
	if (!isnum((b = this.balance()))) {
		to_chat(user, "<span class='danger'>No active account on the console!</span>");
		return f.dot;
	}
	let avail: Value = S.available_shares;
	let price: Value = S.current_value;
	let canbuy: Value = round(b / price);
	let amt: Value = round((yield* g.op(f, "Prompt", [33], [0, `Buy shares in ${S.name}`, `How many shares? \n(Available: ${avail}, unit price: ${price}, can buy: ${canbuy})`, user, null])));
	if (!user || !rt.isIn(f, user, range(1, this)) && rt.istype(user, T("/mob/living/carbon"))) {
		return f.dot;
	}
	if (li != this.logged_in) {
		return f.dot;
	}
	if (!isnum((b = this.balance()))) {
		to_chat(user, "<span class='danger'>No active account on the console!</span>");
		return f.dot;
	}
	if (!(amt = min(amt, S.available_shares, round(b / S.current_value)))) {
		return f.dot;
	}
	if (!S.buyShares(this.logged_in, amt)) {
		to_chat(user, "<span class='danger'>Could not complete transaction.</span>");
		return f.dot;
	}
	let total: Value = amt * S.current_value;
	to_chat(user, `<span class='notice'>Bought ${amt} shares of ${S.name} at ${S.current_value} a share for ${total} credits.</span>`);
	yield* GLOB.stockExchange.add_log(T("/datum/stock_log/buy"), user.name, S.name, amt, S.current_value, total);
	return f.dot;
}, true);

// computer.dm:246
rt.def("/obj/machinery/computer/stockexchange/proc/do_borrowing_deal", function* do_borrowing_deal(f: Frame, B: Value, user: Value) {
	if (B.stock.borrow(B, this.logged_in)) {
		to_chat(user, `<span class='notice'>You successfully borrowed ${B.share_amount} shares. Deposit: ${B.deposit}.</span>`);
		yield* GLOB.stockExchange.add_log(T("/datum/stock_log/borrow"), user.name, B.stock.name, B.share_amount, B.deposit);
	} else {
		to_chat(user, "<span class='danger'>Could not complete transaction. Check your account balance.</span>");
	}
	return f.dot;
}, true);

// computer.dm:253
rt.def("/obj/machinery/computer/stockexchange/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let S: Value = null, dat: Value = null, D: Value = null, L: Value = null, popup: Value = null, LR: Value = null, dat_1: Value = null, p: Value = null, E: Value = null, A: Value = null, popup_3: Value = null;
	if (yield* parent_proc()) {
		return 1;
	}
	if (!f.usr || !rt.isIn(f, f.usr, range(1, this)) && rt.istype(f.usr, T("/mob/living/carbon"))) {
		f.usr.machine = this;
	}
	if (rt.at(href_list, "viewhistory")) {
		if (S = rt.locateIn(f, rt.at(href_list, "viewhistory"), GLOB.stockExchange.stocks)) {
			S.displayValues(f.usr);
		}
	}
	if (rt.at(href_list, "logout")) {
		this.logged_in = null;
	}
	if (rt.at(href_list, "buyshares")) {
		if (S = rt.locateIn(f, rt.at(href_list, "buyshares"), GLOB.stockExchange.stocks)) {
			yield* this.buy_some_shares(S, f.usr);
		}
	}
	if (rt.at(href_list, "sellshares")) {
		if (S = rt.locateIn(f, rt.at(href_list, "sellshares"), GLOB.stockExchange.stocks)) {
			yield* this.sell_some_shares(S, f.usr);
		}
	}
	if (rt.at(href_list, "show_logs")) {
		dat = fmt("<html><head><title>Stock Transaction Logs</title></head><body><h2>Stock Transaction Logs</h2><div><a href='?src=＃;show_logs=1'>Refresh</a></div><br>", [this]);
		for (D of each(GLOB.stockExchange.logs)) {
			if (rt.istype((L = D), T("/datum/stock_log/buy"))) {
				dat += `${L.time} | <b>${L.user_name}</b> bought <b>${L.stocks}</b> stocks at ${L.shareprice} a share for <b>${L.money}</b> total credits in <b>${L.company_name}</b>.<br>`;
				continue;
			}
			if (rt.istype(L, T("/datum/stock_log/sell"))) {
				dat += `${L.time} | <b>${L.user_name}</b> sold <b>${L.stocks}</b> stocks at ${L.shareprice} a share for <b>${L.money}</b> total credits from <b>${L.company_name}</b>.<br>`;
				continue;
			}
			if (rt.istype(L, T("/datum/stock_log/borrow"))) {
				dat += `${L.time} | <b>${L.user_name}</b> borrowed <b>${L.stocks}</b> stocks with a deposit of <b>${L.money}</b> credits in <b>${L.company_name}</b>.<br>`;
				continue;
			}
		}
		(popup = (yield* new_(T("/datum/browser"), f.usr, "stock_logs", "Stock Transaction Logs", 600, 400))).set_content(dat);
		popup.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
		yield* popup.open();
	}
	if (rt.at(href_list, "archive")) {
		S = rt.locateIn(f, rt.at(href_list, "archive"), rt.world());
		if (this.logged_in && this.logged_in != "") {
			rt.setAt((LR = rt.index(GLOB.stockExchange.last_read, S)), this.logged_in, rt.worldTime(f));
		}
		dat_1 = fmt("<html><head><title>News feed for ＀</title></head><body><h2>News feed for ＀</h2><div><a href='?src=＃;archive=＃'>Refresh</a></div>", [S.name, S.name, this, S]);
		dat_1 += "<div><h3>Events</h3>";
		p = 0;
		for (E of each(S.events, T("/datum/stockEvent"))) {
			if (E.hidden) {
				continue;
			}
			if (p > 0) {
				dat_1 += "<hr>";
			}
			dat_1 += `<div><b style='font-size:1.25em'>${E.current_title}</b><br>${E.current_desc}</div>`;
			p++;
		}
		dat_1 += "</div><hr><div><h3>Articles</h3>";
		p = 0;
		for (A of each(S.articles, T("/datum/article"))) {
			if (p > 0) {
				dat_1 += "<hr>";
			}
			dat_1 += `<div><b style='font-size:1.25em'>${A.headline}</b><br><i>${A.subtitle}</i><br><br>${A.article}<br>- ${A.author}, ${A.spacetime} (via <i>${A.outlet}</i>)</div>`;
			p++;
		}
		dat_1 += "</div></body></html>";
		(popup_3 = (yield* new_(T("/datum/browser"), f.usr, `archive_${S.name}`, "Stock News", 600, 400))).set_content(dat_1);
		popup_3.set_title_image(f.usr.browse_rsc_icon(this.icon, this.icon_state));
		yield* popup_3.open();
	}
	if (rt.at(href_list, "cycleview")) {
		this.vmode++;
		if (this.vmode > 1) {
			this.vmode = 0;
		}
	}
	yield* this.add_fingerprint(f.usr);
	yield* this.updateUsrDialog();
	return f.dot;
}, true);
