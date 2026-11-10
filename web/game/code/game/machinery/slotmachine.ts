// Based on /tg/station's code/game/machinery/slotmachine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10360, "/obj/machinery/computer/slot_machine", "/obj/machinery/computer", {
	money: 3000,
	plays: 0,
	working: 0,
	balance: 0,
	jackpots: 0,
	coinvalues: null,
	reels: null,
	symbols: null,
	anchored: 1,
	light_color: "#966432",
	name: "slot machine",
	desc: "Gambling for the antisocial.",
	icon: rt.rsc("icons/obj/economy.dmi"),
	icon_state: "slots1",
	density: 1,
	use_power: 1,
	idle_power_usage: 50,
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/slot_machine"),
});

// slotmachine.dm:30
rt.def("/obj/machinery/computer/slot_machine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.coinvalues = list();
	this.reels = rt.alist(f, [list("", "", ""), 0, list("", "", ""), 0, list("", "", ""), 0, list("", "", ""), 0, list("", "", ""), 0]);
	this.symbols = rt.alist(f, ["<font color='red'>7</font>", 1, "<font color='orange'>&</font>", 2, "<font color='yellow'>@</font>", 2, "<font color='green'>$</font>", 2, "<font color='blue'>?</font>", 2, "<font color='grey'>#</font>", 2, "<font color='white'>!</font>", 2, "<font color='fuchsia'>%</font>", 2]);
	return f.dot;
});

// slotmachine.dm:37
rt.def("/obj/machinery/computer/slot_machine/proc/Initialize", function* Initialize(f: Frame) {
	let cointype: Value = null, C: Value = null;
	yield* parent_proc();
	this.jackpots = rand(1, 4);
	this.plays = rand(75, 200);
	yield* this.toggle_reel_spin(1);
	let reel: Value = rt.index(this.reels, 1);
	let i: Value = 0;
	while (i < rt.len(f, reel)) {
		this.randomize_reels();
		i++;
	}
	yield* this.toggle_reel_spin(0);
	for (cointype of each(typesof(T("/obj/item/weapon/coin")))) {
		C = cointype;
		rt.setAt(this.coinvalues, `${cointype}`, rt.initial(f, C, "value"));
	}
	return f.dot;
}, true);

// slotmachine.dm:55
rt.def("/obj/machinery/computer/slot_machine/proc/Destroy", function* Destroy(f: Frame) {
	if (this.balance) {
		yield* this.give_coins(this.balance);
	}
	return (yield* parent_proc());
}, true);

// slotmachine.dm:59
rt.def("/obj/machinery/computer/slot_machine/proc/process", function process(f: Frame) {
	f.dot = parent_proc();
	if (!f.dot) {
		return f.dot;
	}
	this.money++;
	return f.dot;
}, false, { waitfor: false });

// slotmachine.dm:66
rt.def("/obj/machinery/computer/slot_machine/proc/update_icon", function update_icon(f: Frame) {
	if (rt.bitAnd(this.stat, 2)) {
		this.icon_state = "slots0";
	} else if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = "slotsb";
	} else if (this.working) {
		this.icon_state = "slots2";
	} else {
		this.icon_state = "slots1";
	}
	return f.dot;
});

// slotmachine.dm:79
rt.def("/obj/machinery/computer/slot_machine/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// slotmachine.dm:83
rt.def("/obj/machinery/computer/slot_machine/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/coin"))) {
		C = I;
		if (prob(2)) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			C.loc = this.loc;
			yield* C.throw_at(user, 3, 10);
			if (prob(10)) {
				this.balance = max(this.balance - SPIN_PRICE, 0);
			}
			to_chat(user, `<span class='warning'>${this} spits your coin back out!</span>`);
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You insert a ${C.cmineral} coin into ${this}'s slot!</span>`);
			this.balance += rt.fv(f, "value", C);
			yield* qdel(C);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// slotmachine.dm:104
rt.def("/obj/machinery/computer/slot_machine/proc/emag_act", function emag_act(f: Frame) {
	let spark_system: Value = null;
	if (this.emagged) return f.dot;
	this.emagged = 1;
	(spark_system = new_(T("/datum/effect_system/spark_spread"))).set_up(4, 0, this.loc);
	spark_system.start();
	playsound(this.loc, "sparks", 50, 1);
	return f.dot;
});

// slotmachine.dm:112
rt.def("/obj/machinery/computer/slot_machine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// slotmachine.dm:119
rt.def("/obj/machinery/computer/slot_machine/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, popup: Value = null;
	let reeltext: Value = fmt("<center><font face=\"courier new\">\n\t/*****^*****^*****^*****^*****\\<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t\\*****v*****v*****v*****v*****/<BR>\n\t</center></font>", [rt.index(rt.index(this.reels, 1), 1), rt.index(rt.index(this.reels, 2), 1), rt.index(rt.index(this.reels, 3), 1), rt.index(rt.index(this.reels, 4), 1), rt.index(rt.index(this.reels, 5), 1), rt.index(rt.index(this.reels, 1), 2), rt.index(rt.index(this.reels, 2), 2), rt.index(rt.index(this.reels, 3), 2), rt.index(rt.index(this.reels, 4), 2), rt.index(rt.index(this.reels, 5), 2), rt.index(rt.index(this.reels, 1), 3), rt.index(rt.index(this.reels, 2), 3), rt.index(rt.index(this.reels, 3), 3), rt.index(rt.index(this.reels, 4), 3), rt.index(rt.index(this.reels, 5), 3)]);
	if (this.working) {
		dat = reeltext;
	} else {
		dat = fmt("Five credits to play!<BR>\n\t\t<B>Prize Money Available:</B> ＀ (jackpot payout is ALWAYS 100%!)<BR>\n\t\t<B>Credit Remaining:</B> ＀<BR>\n\t\t＀ players have tried their luck today, and ＀ have won a jackpot!<BR>\n\t\t<HR><BR>\n\t\t<A href='?src=＃;spin=1'>Play!</A><BR>\n\t\t<BR>\n\t\t＀\n\t\t<BR>\n\t\t<font size='1'><A href='?src=＃;refund=1'>Refund balance</A><BR>", [this.money, this.balance, this.plays, this.jackpots, this, reeltext, this]);
	}
	(popup = (yield* new_(T("/datum/browser"), user, "slotmachine", "Slot Machine"))).set_content(dat);
	popup.set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	yield* popup.open();
	return f.dot;
}, true);

// slotmachine.dm:149
rt.def("/obj/machinery/computer/slot_machine/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	if (rt.at(href_list, "spin")) {
		yield* this.spin(f.usr);
	} else {
		if (!rt.at(href_list, "refund")) return f.dot;
		yield* this.give_coins(this.balance);
		this.balance = 0;
	}
	return f.dot;
}, true);

// slotmachine.dm:161
rt.def("/obj/machinery/computer/slot_machine/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (prob(15 * severity)) {
		return f.dot;
	}
	if (prob(1)) {
		this.emagged = 1;
	}
	let severity_ascending: Value = 4 - severity;
	this.money = max(rand(this.money - 200 * severity_ascending, this.money + 200 * severity_ascending), 0);
	this.balance = max(rand(this.balance - 50 * severity_ascending, this.balance + 50 * severity_ascending), 0);
	this.money -= max(0, (yield* this.give_coins(min(rand(-50, 100 * severity_ascending)), this.money)));
	yield* this.spin();
	return f.dot;
}, true);

// slotmachine.dm:174
rt.def("/obj/machinery/computer/slot_machine/proc/spin", function* spin(f: Frame, user: Value) {
	let the_name: Value = null;
	if (!this.can_spin(user)) {
		return f.dot;
	}
	if (user) {
		the_name = user.real_name;
		this.visible_message(`<span class='notice'>${user} pulls the lever and the slot machine starts spinning!</span>`);
	} else {
		the_name = "Exaybachay";
	}
	this.balance -= SPIN_PRICE;
	this.money += SPIN_PRICE;
	this.plays += 1;
	this.working = 1;
	yield* this.toggle_reel_spin(1);
	yield* this.update_icon();
	yield* this.updateDialog();
	rt.spawnTail(f, 0, "/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193", user, the_name);
	rt.spawnTail(f, SPIN_TIME - 7 * rt.len(f, this.reels), "/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193 #2", user, the_name);
	return f.dot;
}, true);

// a spawn(subtract(65, multiply(7, rt.fieldI(f, rt.srcVarI(f, $ic[63]), $ic[64])))) body of /obj/machinery/computer/slot_machine/proc/spin, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193 #2", function* (f: Frame, user: Value, the_name: Value) {
	yield* this.toggle_reel_spin(0, 7);
	this.working = 0;
	yield* this.give_prizes(the_name, user);
	yield* this.update_icon();
	yield* this.updateDialog();
	return null;
});

// a spawn(0) body of /obj/machinery/computer/slot_machine/proc/spin, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193", function* (f: Frame, user: Value, the_name: Value) {
	while (this.working) {
		this.randomize_reels();
		yield* this.updateDialog();
		yield* sleep(2);
	}
	return null;
});

// slotmachine.dm:207
rt.def("/obj/machinery/computer/slot_machine/proc/can_spin", function can_spin(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 2)) {
		to_chat(user, "<span class='warning'>The slot machine has no power!</span>");
	}
	if (rt.bitAnd(this.stat, 1)) {
		to_chat(user, "<span class='warning'>The slot machine is broken!</span>");
	}
	if (this.working) {
		to_chat(user, "<span class='warning'>You need to wait until the machine stops spinning before you can play again!</span>");
		return 0;
	}
	if (this.balance < SPIN_PRICE) {
		to_chat(user, "<span class='warning'>Insufficient money to play!</span>");
		return 0;
	}
	return 1;
});

// slotmachine.dm:220
rt.def("/obj/machinery/computer/slot_machine/proc/toggle_reel_spin", function* toggle_reel_spin(f: Frame, value: Value, delay: Value) {
	let reel: Value = null;
	delay ??= 0;
	for (reel of each(this.reels, T("/list"))) {
		rt.setAt(this.reels, reel, value);
		yield* sleep(delay);
	}
	return f.dot;
}, true);

// slotmachine.dm:226
rt.def("/obj/machinery/computer/slot_machine/proc/randomize_reels", function randomize_reels(f: Frame) {
	let reel: Value = null;
	for (reel of each(this.reels)) {
		if (rt.index(this.reels, reel)) {
			rt.setAt(reel, 3, rt.index(reel, 2));
			rt.setAt(reel, 2, rt.index(reel, 1));
			rt.setAt(reel, 1, pick(this.symbols));
		}
	}
	return f.dot;
});

// slotmachine.dm:233
rt.def("/obj/machinery/computer/slot_machine/proc/give_prizes", function* give_prizes(f: Frame, usrname: Value, user: Value) {
	let i: Value = null, cointype: Value = null, C: Value = null;
	let $0: any;
	let linelength: Value = this.get_lines();
	if (rt.index(rt.index(this.reels, 1), 2) + rt.index(rt.index(this.reels, 2), 2) + rt.index(rt.index(this.reels, 3), 2) + rt.index(rt.index(this.reels, 4), 2) + rt.index(rt.index(this.reels, 5), 2) == `${"<font color='red'>7</font>"}${"<font color='red'>7</font>"}${"<font color='red'>7</font>"}${"<font color='red'>7</font>"}${"<font color='red'>7</font>"}`) {
		this.visible_message(`<b>${this}</b> says, 'JACKPOT! You win ${this.money} credits worth of coins!'`);
		if (user) {
			$0 = user.real_name;
		} else {
			$0 = usrname;
		}
		yield* priority_announce(`Congratulations to ${$0} for winning the jackpot at the slot machine in ${get_area(this)}!`);
		this.jackpots += 1;
		this.balance += this.money - (yield* this.give_coins(JACKPOT));
		this.money = 0;
		i = 0;
		while (i < 5) {
			cointype = pick(typesof(T("/obj/item/weapon/coin")) - T("/obj/item/weapon/coin"));
			yield* random_step((C = (yield* new_(cointype, this.loc))), 2, 50);
			i++;
		}
	} else if (linelength == 5) {
		this.visible_message(`<b>${this}</b> says, 'Big Winner! You win a thousand credits worth of coins!'`);
		yield* this.give_money(BIG_PRIZE);
	} else if (linelength == 4) {
		this.visible_message(`<b>${this}</b> says, 'Winner! You win four hundred credits worth of coins!'`);
		yield* this.give_money(SMALL_PRIZE);
	} else if (linelength == 3) {
		to_chat(user, "<span class='notice'>You win three free games!</span>");
		this.balance += 20;
		this.money = max(this.money - 20, this.money);
	} else {
		to_chat(user, "<span class='warning'>No luck!</span>");
	}
	return f.dot;
}, true);

// slotmachine.dm:266
rt.def("/obj/machinery/computer/slot_machine/proc/get_lines", function get_lines(f: Frame) {
	let amountthesame: Value = null, inputtext: Value = null, symbol: Value = null, j: Value = null, symboltext: Value = null;
	let i: Value = 1;
	while (i <= 3) {
		inputtext = rt.index(rt.index(this.reels, 1), i) + rt.index(rt.index(this.reels, 2), i) + rt.index(rt.index(this.reels, 3), i) + rt.index(rt.index(this.reels, 4), i) + rt.index(rt.index(this.reels, 5), i);
		symbol = null;
		for (symbol of each(this.symbols)) {
			j = 3;
			symboltext = symbol + symbol + symbol;
			while (j <= 5) {
				if (findtext(inputtext, symboltext)) {
					amountthesame = max(j, amountthesame);
				}
				j++;
				symboltext += symbol;
			}
			if (amountthesame) {
				break;
			}
		}
		i++;
	}
	return amountthesame;
});

// slotmachine.dm:283
rt.def("/obj/machinery/computer/slot_machine/proc/give_money", function* give_money(f: Frame, amount: Value) {
	let amount_to_give: Value = this.money >= amount ? amount : this.money;
	let surplus: Value = amount_to_give - (yield* this.give_coins(amount_to_give));
	this.money = max(0, this.money - amount);
	this.balance += surplus;
	return f.dot;
}, true);

// slotmachine.dm:289
rt.def("/obj/machinery/computer/slot_machine/proc/give_coins", function* give_coins(f: Frame, amount: Value) {
	let target: Value = null;
	let cointype: Value = this.emagged ? T("/obj/item/weapon/coin/iron") : T("/obj/item/weapon/coin/silver");
	if (!this.emagged) {
		amount = (yield* this.dispense(amount, cointype, null, 0));
	} else {
		target = rt.locateIn(f, T("/mob/living"), range(2, this));
		amount = (yield* this.dispense(amount, cointype, target, 1));
	}
	return amount;
}, true);

// slotmachine.dm:302
rt.def("/obj/machinery/computer/slot_machine/proc/dispense", function* dispense(f: Frame, amount: Value, cointype: Value, target: Value, throwit: Value) {
	let C: Value = null;
	amount ??= 0;
	cointype ??= T("/obj/item/weapon/coin/silver");
	throwit ??= 0;
	let value: Value = rt.index(this.coinvalues, `${cointype}`);
	while (amount >= value) {
		C = (yield* new_(cointype, this.loc));
		amount -= value;
		if (throwit && target) {
			yield* C.throw_at(target, 3, 10);
		} else {
			yield* random_step(C, 2, 40);
		}
	}
	return amount;
}, true);
