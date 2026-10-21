// From code/modules/stock_market/computer.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/stockexchange/proc/New  (code/modules/stock_market/computer.dm:15)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "logged_in", fmt("＀ Cargo Department", [(yield* g.call(f, P("/proc/station_name"), null, []))]));
	return f.dot;
}, true);

// /obj/machinery/computer/stockexchange/proc/balance  (code/modules/stock_market/computer.dm:19)
rt.def("/obj/machinery/computer/stockexchange/proc/balance", function balance(f: Frame) {
	if (!truthy(rt.sv(f, "logged_in"))) {
		return 0;
	}
	return rt.fv(f, "points", rt.gl("SSshuttle"));
});

// /obj/machinery/computer/stockexchange/proc/attack_ai  (code/modules/stock_market/computer.dm:24)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/computer/stockexchange/proc/attack_robot  (code/modules/stock_market/computer.dm:27)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	f.vars = () => [user];
	return (yield* g.srcCall(f, "attack_hand", live(user)));
}, true);

// /obj/machinery/computer/stockexchange/proc/attack_hand  (code/modules/stock_market/computer.dm:30)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/attack_hand", function* attack_hand(f: Frame) {
	let css: Value = null, dat: Value = null, S: Value = null, LR: Value = null, mystocks: Value = null, prod: Value = null, news: Value = null, LR_5: Value = null, lrt: Value = null, A: Value = null, E: Value = null, popup: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [css, dat, S, LR, mystocks, prod, news, LR_5, lrt, A, E, popup, $0, $1, $2, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	rt.setFv(f, "machine", live(f.args[0]), live(f.src));
	css = "<style>\n.change {\n\tfont-weight: bold;\n\tfont-family: monospace;\n}\n.up {\n\tbackground: #00a000;\n}\n.down {\n\tbackground: #a00000;\n}\n.stable {\n\twidth: 100%\n\tborder-collapse: collapse;\n\tborder: 1px solid #305260;\n\tborder-spacing: 4px 4px;\n}\n.stable td, .stable th {\n\tborder: 1px solid #305260;\n\tpadding: 0px 3px;\n}\n.bankrupt {\n\tborder: 1px solid #a00000;\n\tbackground: #a00000;\n}\n\na.updated {\n\tcolor: red;\n}\n</style>";
	dat = fmt("<html><head><title>＀ Stock Exchange</title>＀</head><body>", [(yield* g.call(f, P("/proc/station_name"), null, [])), live(css)]);
	dat = rt.modify(live(dat), fmt("<span class='user'>Welcome, <b>＀</b></span><br><span class='balance'><b>Credits:</b> ＀ </span><br>", [rt.sv(f, "logged_in"), (yield* g.srcCall(f, "balance"))]), add);
	S = null;
	rt.forList(f, 0, rt.fv(f, "last_read", rt.gl("stockExchange")), T("/datum/stock"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		LR = rt.index(rt.fv(f, "last_read", rt.gl("stockExchange")), live(S));
		if (!truthy((rt.isIn(f, rt.sv(f, "logged_in"), live(LR)) ? 1 : 0))) {
			rt.setAt(live(LR), rt.sv(f, "logged_in"), 0);
		}
	}
	rt.endFor(f, 0);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "vmode"))) {
		$1 = "Compact";
	} else {
		$1 = "Full";
	}
	dat = rt.modify(live(dat), fmt("<b>View mode:</b> <a href='?src=＃;cycleview=1'>＀</a> ", [$0, $1]), add);
	dat = rt.modify(live(dat), fmt("<b>Stock Transaction Log:</b> <a href='?src=＃;show_logs=1'>Check</a><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), "<i>This is a work in progress. Certain features may not be available.</i>", add);
	dat = rt.modify(live(dat), "<h3>Listed stocks</h3>", add);
	if (isEqual(rt.sv(f, "vmode"), 0)) {
		S = null;
		rt.forList(f, 0, rt.fv(f, "stocks", rt.gl("stockExchange")), T("/datum/stock"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S = $e;
			mystocks = 0;
			if ((truthy(rt.sv(f, "logged_in")) && truthy((rt.isIn(f, rt.sv(f, "logged_in"), rt.fv(f, "shareholders", live(S))) ? 1 : 0)))) {
				mystocks = rt.index(rt.fv(f, "shareholders", live(S)), rt.sv(f, "logged_in"));
			}
			$0 = rt.fv(f, "name", live(S));
			$1 = rt.fv(f, "short_name", live(S));
			if (truthy(rt.fv(f, "bankrupt", live(S)))) {
				$2 = " <b style='color:red'>BANKRUPT</b>";
			} else {
				$2 = null;
			}
			dat = rt.modify(live(dat), fmt("<hr /><div class='stock'><span class='company'>＀</span> <span class='s_company'>(＀)</span>＀<br>", [$0, $1, $2]), add);
			if (truthy(rt.fv(f, "last_unification", live(S)))) {
				dat = rt.modify(live(dat), fmt("<b>Unified shares</b> ＀ minutes ago.<br>", [divide(subtract(rt.worldTime(f), rt.fv(f, "last_unification", live(S))), 600)]), add);
			}
			dat = rt.modify(live(dat), fmt("<b>Current value per share:</b> ＀ | <a href='?src=＃;viewhistory=＃'>View history</a><br><br>", [rt.fv(f, "current_value", live(S)), live(f.src), live(S)]), add);
			dat = rt.modify(live(dat), fmt("You currently own <b>＀</b> shares in this company. There are ＀ purchasable shares on the market currently.<br>", [live(mystocks), rt.fv(f, "available_shares", live(S))]), add);
			if (truthy(rt.fv(f, "bankrupt", live(S)))) {
				dat = rt.modify(live(dat), "You cannot buy or sell shares in a bankrupt company!<br><br>", add);
			} else {
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;buyshares=＃'>Buy shares</a> | <a href='?src=＃;sellshares=＃'>Sell shares</a><br><br>", [live(f.src), live(S), live(f.src), live(S)]), add);
			}
			dat = rt.modify(live(dat), "<b>Prominent products:</b><br>", add);
			prod = null;
			rt.forList(f, 1, rt.fv(f, "products", live(S)));
			while (($e = rt.next(f, 1)) !== undefined) {
				prod = $e;
				dat = rt.modify(live(dat), fmt("<i>＀</i><br>", [live(prod)]), add);
			}
			rt.endFor(f, 1);
			news = 0;
			if (truthy(rt.sv(f, "logged_in"))) {
				LR_5 = rt.index(rt.fv(f, "last_read", rt.gl("stockExchange")), live(S));
				lrt = rt.index(live(LR_5), rt.sv(f, "logged_in"));
				A = null;
				rt.forList(f, 1, rt.fv(f, "articles", live(S)), T("/datum/article"));
				while (($e = rt.next(f, 1)) !== undefined) {
					A = $e;
					if (rt.gt(rt.fv(f, "ticks", live(A)), live(lrt))) {
						news = 1;
						break;
					}
				}
				rt.endFor(f, 1);
				if (!truthy(live(news))) {
					E = null;
					rt.forList(f, 1, rt.fv(f, "events", live(S)), T("/datum/stockEvent"));
					while (($e = rt.next(f, 1)) !== undefined) {
						E = $e;
						if ((rt.gt(rt.fv(f, "last_change", live(E)), live(lrt)) && !truthy(rt.fv(f, "hidden", live(E))))) {
							news = 1;
							break;
						}
					}
					rt.endFor(f, 1);
				}
			}
			$0 = live(f.src);
			$1 = live(S);
			if (truthy(live(news))) {
				$1 = $1;
				$2 = " <span style='color:red'>(updated)</span>";
			} else {
				$2 = null;
			}
			dat = rt.modify(live(dat), fmt("<a href='?src=＃;archive=＃'>View news archives</a>＀</div>", [$0, $1, $2]), add);
		}
		rt.endFor(f, 0);
	} else {
		if (isEqual(rt.sv(f, "vmode"), 1)) {
			dat = rt.modify(live(dat), "<b>Actions:</b> + Buy, - Sell, (A)rchives, (H)istory<br><br>", add);
			dat = rt.modify(live(dat), "<table class='stable'>", add);
			dat = rt.modify(live(dat), "<tr><th>&nbsp;</th><th>ID</th><th>Name</th><th>Value</th><th>Owned</th><th>Avail</th><th>Actions</th></tr>", add);
			S = null;
			rt.forList(f, 0, rt.fv(f, "stocks", rt.gl("stockExchange")), T("/datum/stock"));
			while (($e = rt.next(f, 0)) !== undefined) {
				S = $e;
				mystocks = 0;
				if ((truthy(rt.sv(f, "logged_in")) && truthy((rt.isIn(f, rt.sv(f, "logged_in"), rt.fv(f, "shareholders", live(S))) ? 1 : 0)))) {
					mystocks = rt.index(rt.fv(f, "shareholders", live(S)), rt.sv(f, "logged_in"));
				}
				if (truthy(rt.fv(f, "bankrupt", live(S)))) {
					dat = rt.modify(live(dat), "<tr class='bankrupt'>", add);
				} else {
					dat = rt.modify(live(dat), "<tr>", add);
				}
				if (rt.gt(rt.fv(f, "disp_value_change", live(S)), 0)) {
					dat = rt.modify(live(dat), "<td class='change up'>+</td>", add);
				} else {
					if (rt.lt(rt.fv(f, "disp_value_change", live(S)), 0)) {
						dat = rt.modify(live(dat), "<td class='change down'>-</td>", add);
					} else {
						dat = rt.modify(live(dat), "<td class='change'>=</td>", add);
					}
				}
				dat = rt.modify(live(dat), fmt("<td><b>＀</b></td>", [rt.fv(f, "short_name", live(S))]), add);
				dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "name", live(S))]), add);
				if (!truthy(rt.fv(f, "bankrupt", live(S)))) {
					dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "current_value", live(S))]), add);
				} else {
					dat = rt.modify(live(dat), "<td>0</td>", add);
				}
				if (truthy(live(mystocks))) {
					dat = rt.modify(live(dat), fmt("<td><b>＀</b></td>", [live(mystocks)]), add);
				} else {
					dat = rt.modify(live(dat), "<td>0</td>", add);
				}
				dat = rt.modify(live(dat), fmt("<td>＀</td>", [rt.fv(f, "available_shares", live(S))]), add);
				news = 0;
				if (truthy(rt.sv(f, "logged_in"))) {
					LR_5 = rt.index(rt.fv(f, "last_read", rt.gl("stockExchange")), live(S));
					lrt = rt.index(live(LR_5), rt.sv(f, "logged_in"));
					A = null;
					rt.forList(f, 1, rt.fv(f, "articles", live(S)), T("/datum/article"));
					while (($e = rt.next(f, 1)) !== undefined) {
						A = $e;
						if (rt.gt(rt.fv(f, "ticks", live(A)), live(lrt))) {
							news = 1;
							break;
						}
					}
					rt.endFor(f, 1);
					if (!truthy(live(news))) {
						E = null;
						rt.forList(f, 1, rt.fv(f, "events", live(S)), T("/datum/stockEvent"));
						while (($e = rt.next(f, 1)) !== undefined) {
							E = $e;
							if ((rt.gt(rt.fv(f, "last_change", live(E)), live(lrt)) && !truthy(rt.fv(f, "hidden", live(E))))) {
								news = 1;
								break;
							}
						}
						rt.endFor(f, 1);
					}
				}
				dat = rt.modify(live(dat), "<td>", add);
				if (truthy(rt.fv(f, "bankrupt", live(S)))) {
					dat = rt.modify(live(dat), "<span class='linkOff'>+</span> <span class='linkOff'>-</span> ", add);
				} else {
					dat = rt.modify(live(dat), fmt("<a href='?src=＃;buyshares=＃'>+</a> <a href='?src=＃;sellshares=＃'>-</a> ", [live(f.src), live(S), live(f.src), live(S)]), add);
				}
				$0 = live(f.src);
				$1 = live(S);
				if (truthy(live(news))) {
					$1 = $1;
					$2 = "updated";
				} else {
					$2 = "default";
				}
				dat = rt.modify(live(dat), fmt("<a href='?src=＃;archive=＃' class='＀'>(A)</a> <a href='?src=＃;viewhistory=＃'>(H)</a></td>", [$0, $1, $2, live(f.src), live(S)]), add);
				dat = rt.modify(live(dat), "</tr>", add);
			}
			rt.endFor(f, 0);
			dat = rt.modify(live(dat), "</table>", add);
		}
	}
	dat = rt.modify(live(dat), "</body></html>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.args[0]), "computer", "Stock Exchange", 600, 600]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.args[0]), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true, { args: ["user"] });

// /obj/machinery/computer/stockexchange/proc/sell_some_shares  (code/modules/stock_market/computer.dm:177)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/sell_some_shares", function* sell_some_shares(f: Frame, S: Value, user: Value) {
	let li: Value = null, b: Value = null, avail: Value = null, price: Value = null, amt: Value = null, total: Value = null;
	f.vars = () => [S, user, li, b, avail, price, amt, total];
	if ((!truthy(live(user)) || !truthy(live(S)))) {
		return live(f.dot);
	}
	if (!truthy((li = rt.sv(f, "logged_in")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>No active account on the console!</span>"]);
		return live(f.dot);
	}
	b = rt.fv(f, "points", rt.gl("SSshuttle"));
	if (!truthy((avail = rt.index(rt.fv(f, "shareholders", live(S)), rt.sv(f, "logged_in"))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>This account does not own any shares of ＀!</span>", [rt.fv(f, "name", live(S))])]);
		return live(f.dot);
	}
	price = rt.fv(f, "current_value", live(S));
	amt = (yield* g.call(f, P("/proc/min"), null, [(amt = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [0, fmt("Sell shares in ＀", [rt.fv(f, "name", live(S))]), fmt("How many shares? \n(Have: ＀, unit price: ＀)", [live(avail), live(price)]), live(user), null]))]))), rt.index(rt.fv(f, "shareholders", live(S)), rt.sv(f, "logged_in"))]));
	if ((!truthy(live(user)) || (!truthy((rt.isIn(f, live(user), (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)]))) ? 1 : 0)) && truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))))) {
		return live(f.dot);
	}
	if (!truthy(live(amt))) {
		return live(f.dot);
	}
	if (!isEqual(live(li), rt.sv(f, "logged_in"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [(b = rt.fv(f, "points", rt.gl("SSshuttle")))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>No active account on the console!</span>"]);
		return live(f.dot);
	}
	total = multiply(live(amt), rt.fv(f, "current_value", live(S)));
	if (!truthy((yield* g.callName(f, live(S), "sellShares", [rt.sv(f, "logged_in"), live(amt)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Could not complete transaction.</span>"]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Sold ＀ shares of ＀ at ＀ a share for ＀ credits.</span>", [live(amt), rt.fv(f, "name", live(S)), rt.fv(f, "current_value", live(S)), live(total)])]);
	yield* g.callName(f, rt.gl("stockExchange"), "add_log", [T("/datum/stock_log/sell"), rt.fv(f, "name", live(user)), rt.fv(f, "name", live(S)), live(amt), rt.fv(f, "current_value", live(S)), live(total)]);
	return f.dot;
}, true);

// /obj/machinery/computer/stockexchange/proc/buy_some_shares  (code/modules/stock_market/computer.dm:211)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/buy_some_shares", function* buy_some_shares(f: Frame, S: Value, user: Value) {
	let li: Value = null, b: Value = null, avail: Value = null, price: Value = null, canbuy: Value = null, amt: Value = null, total: Value = null;
	f.vars = () => [S, user, li, b, avail, price, canbuy, amt, total];
	if ((!truthy(live(user)) || !truthy(live(S)))) {
		return live(f.dot);
	}
	if (!truthy((li = rt.sv(f, "logged_in")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>No active account on the console!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [(b = (yield* g.srcCall(f, "balance")))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>No active account on the console!</span>"]);
		return live(f.dot);
	}
	avail = rt.fv(f, "available_shares", live(S));
	price = rt.fv(f, "current_value", live(S));
	canbuy = (yield* g.call(f, P("/proc/round"), null, [divide(live(b), live(price))]));
	amt = (yield* g.call(f, P("/proc/round"), null, [(yield* g.op(f, "Prompt", [33], [0, fmt("Buy shares in ＀", [rt.fv(f, "name", live(S))]), fmt("How many shares? \n(Available: ＀, unit price: ＀, can buy: ＀)", [live(avail), live(price), live(canbuy)]), live(user), null]))]));
	if ((!truthy(live(user)) || (!truthy((rt.isIn(f, live(user), (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)]))) ? 1 : 0)) && truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))))) {
		return live(f.dot);
	}
	if (!isEqual(live(li), rt.sv(f, "logged_in"))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.call(f, P("/proc/isnum"), null, [(b = (yield* g.srcCall(f, "balance")))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>No active account on the console!</span>"]);
		return live(f.dot);
	}
	if (!truthy((amt = (yield* g.call(f, P("/proc/min"), null, [live(amt), rt.fv(f, "available_shares", live(S)), (yield* g.call(f, P("/proc/round"), null, [divide(live(b), rt.fv(f, "current_value", live(S)))]))]))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(S), "buyShares", [rt.sv(f, "logged_in"), live(amt)])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Could not complete transaction.</span>"]);
		return live(f.dot);
	}
	total = multiply(live(amt), rt.fv(f, "current_value", live(S)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Bought ＀ shares of ＀ at ＀ a share for ＀ credits.</span>", [live(amt), rt.fv(f, "name", live(S)), rt.fv(f, "current_value", live(S)), live(total)])]);
	yield* g.callName(f, rt.gl("stockExchange"), "add_log", [T("/datum/stock_log/buy"), rt.fv(f, "name", live(user)), rt.fv(f, "name", live(S)), live(amt), rt.fv(f, "current_value", live(S)), live(total)]);
	return f.dot;
}, true);

// /obj/machinery/computer/stockexchange/proc/do_borrowing_deal  (code/modules/stock_market/computer.dm:246)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/do_borrowing_deal", function* do_borrowing_deal(f: Frame, B: Value, user: Value) {
	f.vars = () => [B, user];
	if (truthy((yield* g.callName(f, rt.fv(f, "stock", live(B)), "borrow", [live(B), rt.sv(f, "logged_in")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully borrowed ＀ shares. Deposit: ＀.</span>", [rt.fv(f, "share_amount", live(B)), rt.fv(f, "deposit", live(B))])]);
		yield* g.callName(f, rt.gl("stockExchange"), "add_log", [T("/datum/stock_log/borrow"), rt.fv(f, "name", live(user)), rt.gv(f, "name", rt.fv(f, "stock", live(B))), rt.fv(f, "share_amount", live(B)), rt.fv(f, "deposit", live(B))]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Could not complete transaction. Check your account balance.</span>"]);
	}
	return f.dot;
}, true);

// /obj/machinery/computer/stockexchange/proc/Topic  (code/modules/stock_market/computer.dm:253)  may sleep
rt.def("/obj/machinery/computer/stockexchange/proc/Topic", function* Topic(f: Frame) {
	let S: Value = null, dat: Value = null, D: Value = null, L: Value = null, popup: Value = null, LR: Value = null, dat_1: Value = null, p: Value = null, E: Value = null, A: Value = null, popup_3: Value = null;
	let $e: any;
	f.vars = () => [S, dat, D, L, popup, LR, dat_1, p, E, A, popup_3, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return 1;
	}
	if ((!truthy(live(f.usr)) || (!truthy((rt.isIn(f, live(f.usr), (yield* g.call(f, P("/proc/range"), null, [1, live(f.src)]))) ? 1 : 0)) && truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))))) {
		rt.setFv(f, "machine", live(f.usr), live(f.src));
	}
	if (truthy(rt.at(live(f.args[1]), "viewhistory"))) {
		if (truthy((S = rt.locateIn(f, rt.at(live(f.args[1]), "viewhistory"), rt.fv(f, "stocks", rt.gl("stockExchange")))))) {
			yield* g.callName(f, live(S), "displayValues", [live(f.usr)]);
		}
	}
	if (truthy(rt.at(live(f.args[1]), "logout"))) {
		rt.setSv(f, "logged_in", null);
	}
	if (truthy(rt.at(live(f.args[1]), "buyshares"))) {
		if (truthy((S = rt.locateIn(f, rt.at(live(f.args[1]), "buyshares"), rt.fv(f, "stocks", rt.gl("stockExchange")))))) {
			yield* g.srcCall(f, "buy_some_shares", live(S), live(f.usr));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "sellshares"))) {
		if (truthy((S = rt.locateIn(f, rt.at(live(f.args[1]), "sellshares"), rt.fv(f, "stocks", rt.gl("stockExchange")))))) {
			yield* g.srcCall(f, "sell_some_shares", live(S), live(f.usr));
		}
	}
	if (truthy(rt.at(live(f.args[1]), "show_logs"))) {
		dat = fmt("<html><head><title>Stock Transaction Logs</title></head><body><h2>Stock Transaction Logs</h2><div><a href='?src=＃;show_logs=1'>Refresh</a></div><br>", [live(f.src)]);
		D = null;
		rt.forList(f, 0, rt.fv(f, "logs", rt.gl("stockExchange")));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			if (truthy((rt.istype((L = live(D)), T("/datum/stock_log/buy")) ? 1 : 0))) {
				dat = rt.modify(live(dat), fmt("＀ | <b>＀</b> bought <b>＀</b> stocks at ＀ a share for <b>＀</b> total credits in <b>＀</b>.<br>", [rt.fv(f, "time", live(L)), rt.fv(f, "user_name", live(L)), rt.fv(f, "stocks", live(L)), rt.fv(f, "shareprice", live(L)), rt.fv(f, "money", live(L)), rt.fv(f, "company_name", live(L))]), add);
				continue;
			}
			if (truthy((rt.istype(live(L), T("/datum/stock_log/sell")) ? 1 : 0))) {
				dat = rt.modify(live(dat), fmt("＀ | <b>＀</b> sold <b>＀</b> stocks at ＀ a share for <b>＀</b> total credits from <b>＀</b>.<br>", [rt.fv(f, "time", live(L)), rt.fv(f, "user_name", live(L)), rt.fv(f, "stocks", live(L)), rt.fv(f, "shareprice", live(L)), rt.fv(f, "money", live(L)), rt.fv(f, "company_name", live(L))]), add);
				continue;
			}
			if (truthy((rt.istype(live(L), T("/datum/stock_log/borrow")) ? 1 : 0))) {
				dat = rt.modify(live(dat), fmt("＀ | <b>＀</b> borrowed <b>＀</b> stocks with a deposit of <b>＀</b> credits in <b>＀</b>.<br>", [rt.fv(f, "time", live(L)), rt.fv(f, "user_name", live(L)), rt.fv(f, "stocks", live(L)), rt.fv(f, "money", live(L)), rt.fv(f, "company_name", live(L))]), add);
				continue;
			}
		}
		rt.endFor(f, 0);
		yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), "stock_logs", "Stock Transaction Logs", 600, 400]))), "set_content", [live(dat)]);
		yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
		yield* g.callName(f, live(popup), "open", []);
	}
	if (truthy(rt.at(live(f.args[1]), "archive"))) {
		S = rt.locateIn(f, rt.at(live(f.args[1]), "archive"), rt.world());
		if ((truthy(rt.sv(f, "logged_in")) && !isEqual(rt.sv(f, "logged_in"), ""))) {
			rt.setAt((LR = rt.index(rt.fv(f, "last_read", rt.gl("stockExchange")), live(S))), rt.sv(f, "logged_in"), rt.worldTime(f));
		}
		dat_1 = fmt("<html><head><title>News feed for ＀</title></head><body><h2>News feed for ＀</h2><div><a href='?src=＃;archive=＃'>Refresh</a></div>", [rt.fv(f, "name", live(S)), rt.fv(f, "name", live(S)), live(f.src), live(S)]);
		dat_1 = rt.modify(live(dat_1), "<div><h3>Events</h3>", add);
		p = 0;
		E = null;
		rt.forList(f, 0, rt.fv(f, "events", live(S)), T("/datum/stockEvent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			E = $e;
			if (truthy(rt.fv(f, "hidden", live(E)))) {
				continue;
			}
			if (rt.gt(live(p), 0)) {
				dat_1 = rt.modify(live(dat_1), "<hr>", add);
			}
			dat_1 = rt.modify(live(dat_1), fmt("<div><b style='font-size:1.25em'>＀</b><br>＀</div>", [rt.fv(f, "current_title", live(E)), rt.fv(f, "current_desc", live(E))]), add);
			p = rt.inc(live(p), 1);
		}
		rt.endFor(f, 0);
		dat_1 = rt.modify(live(dat_1), "</div><hr><div><h3>Articles</h3>", add);
		p = 0;
		A = null;
		rt.forList(f, 0, rt.fv(f, "articles", live(S)), T("/datum/article"));
		while (($e = rt.next(f, 0)) !== undefined) {
			A = $e;
			if (rt.gt(live(p), 0)) {
				dat_1 = rt.modify(live(dat_1), "<hr>", add);
			}
			dat_1 = rt.modify(live(dat_1), fmt("<div><b style='font-size:1.25em'>＀</b><br><i>＀</i><br><br>＀<br>- ＀, ＀ (via <i>＀</i>)</div>", [rt.fv(f, "headline", live(A)), rt.fv(f, "subtitle", live(A)), rt.fv(f, "article", live(A)), rt.fv(f, "author", live(A)), rt.fv(f, "spacetime", live(A)), rt.fv(f, "outlet", live(A))]), add);
			p = rt.inc(live(p), 1);
		}
		rt.endFor(f, 0);
		dat_1 = rt.modify(live(dat_1), "</div></body></html>", add);
		yield* g.callName(f, (popup_3 = (yield* g.new_(f, T("/datum/browser"), [live(f.usr), fmt("archive_＀", [rt.fv(f, "name", live(S))]), "Stock News", 600, 400]))), "set_content", [live(dat_1)]);
		yield* g.callName(f, live(popup_3), "set_title_image", [(yield* g.callName(f, live(f.usr), "browse_rsc_icon", [rt.fv(f, "icon", live(f.src)), rt.fv(f, "icon_state", live(f.src))]))]);
		yield* g.callName(f, live(popup_3), "open", []);
	}
	if (truthy(rt.at(live(f.args[1]), "cycleview"))) {
		rt.incSrcVar(f, "vmode", 1, true);
		if (rt.gt(rt.sv(f, "vmode"), 1)) {
			rt.setSv(f, "vmode", 0);
		}
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return f.dot;
}, true, { args: ["href", "href_list"] });
