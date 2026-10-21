// From code/game/machinery/slotmachine.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/slot_machine/proc/<init>  (code/game/machinery/slotmachine.dm:30)
rt.def("/obj/machinery/computer/slot_machine/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "coinvalues", rt.list());
	rt.setSv(f, "reels", rt.alist(f, [rt.list("", "", ""), 0, rt.list("", "", ""), 0, rt.list("", "", ""), 0, rt.list("", "", ""), 0, rt.list("", "", ""), 0]));
	rt.setSv(f, "symbols", rt.alist(f, ["<font color='red'>7</font>", 1, "<font color='orange'>&</font>", 2, "<font color='yellow'>@</font>", 2, "<font color='green'>$</font>", 2, "<font color='blue'>?</font>", 2, "<font color='grey'>#</font>", 2, "<font color='white'>!</font>", 2, "<font color='fuchsia'>%</font>", 2]));
	return f.dot;
});

// /obj/machinery/computer/slot_machine/proc/Initialize  (code/game/machinery/slotmachine.dm:37)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/Initialize", function* Initialize(f: Frame) {
	let reel: Value = null, i: Value = null, cointype: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [reel, i, cointype, C, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "jackpots", (yield* g.call(f, P("/proc/rand"), null, [1, 4])));
	rt.setSv(f, "plays", (yield* g.call(f, P("/proc/rand"), null, [75, 200])));
	yield* g.srcCall(f, "toggle_reel_spin", 1);
	reel = rt.index(rt.sv(f, "reels"), 1);
	i = null;
	i = 0;
	while (rt.lt(live(i), rt.len(f, live(reel)))) {
		yield* g.srcCall(f, "randomize_reels");
		i = rt.inc(live(i), 1);
	}
	yield* g.srcCall(f, "toggle_reel_spin", 0);
	cointype = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/coin")])));
	while (($e = rt.next(f, 0)) !== undefined) {
		cointype = $e;
		C = live(cointype);
		rt.setAt(rt.sv(f, "coinvalues"), fmt("＀", [live(cointype)]), rt.initial(f, live(C), "value"));
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/Destroy  (code/game/machinery/slotmachine.dm:55)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "balance"))) {
		yield* g.srcCall(f, "give_coins", rt.sv(f, "balance"));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/computer/slot_machine/proc/process  (code/game/machinery/slotmachine.dm:59)
rt.def("/obj/machinery/computer/slot_machine/proc/process", function process(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.dot))) {
		return live(f.dot);
	}
	rt.incSrcVar(f, "money", 1, true);
	return f.dot;
}, false, { waitfor: false });

// /obj/machinery/computer/slot_machine/proc/update_icon  (code/game/machinery/slotmachine.dm:66)
rt.def("/obj/machinery/computer/slot_machine/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.setSv(f, "icon_state", "slots0");
	} else {
		if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
			rt.setSv(f, "icon_state", "slotsb");
		} else {
			if (truthy(rt.sv(f, "working"))) {
				rt.setSv(f, "icon_state", "slots2");
			} else {
				rt.setSv(f, "icon_state", "slots1");
			}
		}
	}
	return f.dot;
});

// /obj/machinery/computer/slot_machine/proc/power_change  (code/game/machinery/slotmachine.dm:79)
rt.def("/obj/machinery/computer/slot_machine/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/computer/slot_machine/proc/attackby  (code/game/machinery/slotmachine.dm:83)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/attackby", function* attackby(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/coin")) ? 1 : 0))) {
		C = live(f.args[0]);
		if (truthy(rt.op(f, "Prob", [], [2]))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.setFv(f, "loc", live(C), rt.sv(f, "loc"));
			yield* g.callName(f, live(C), "throw_at", [live(f.args[1]), 3, 10]);
			if (truthy(rt.op(f, "Prob", [], [10]))) {
				rt.setSv(f, "balance", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "balance"), 5), 0])));
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ spits your coin back out!</span>", [live(f.src)])]);
		} else {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert a ＀ coin into ＀'s slot!</span>", [rt.fv(f, "cmineral", live(C)), live(f.src)])]);
			rt.modSrcVar(f, "balance", rt.fv(f, "value", live(C)), add);
			yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/machinery/computer/slot_machine/proc/emag_act  (code/game/machinery/slotmachine.dm:104)
rt.def("/obj/machinery/computer/slot_machine/proc/emag_act", function emag_act(f: Frame) {
	let spark_system: Value = null;
	f.vars = () => [spark_system];
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.setSv(f, "emagged", 1);
	rt.callName(f, (spark_system = rt.new_(f, T("/datum/effect_system/spark_spread"), [])), "set_up", [4, 0, rt.fv(f, "loc", live(f.src))]);
	rt.callName(f, live(spark_system), "start", []);
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", 50, 1]);
	return f.dot;
});

// /obj/machinery/computer/slot_machine/proc/attack_hand  (code/game/machinery/slotmachine.dm:112)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/attack_hand", function* attack_hand(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/slot_machine/proc/interact  (code/game/machinery/slotmachine.dm:119)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/interact", function* interact(f: Frame, user: Value) {
	let reeltext: Value = null, dat: Value = null, popup: Value = null;
	f.vars = () => [user, reeltext, dat, popup];
	reeltext = fmt("<center><font face=\"courier new\">\n\t/*****^*****^*****^*****^*****\\<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t| [＀] | [＀] | [＀] | [＀] | [＀] |<BR>\n\t\\*****v*****v*****v*****v*****/<BR>\n\t</center></font>", [rt.index(rt.index(rt.sv(f, "reels"), 1), 1), rt.index(rt.index(rt.sv(f, "reels"), 2), 1), rt.index(rt.index(rt.sv(f, "reels"), 3), 1), rt.index(rt.index(rt.sv(f, "reels"), 4), 1), rt.index(rt.index(rt.sv(f, "reels"), 5), 1), rt.index(rt.index(rt.sv(f, "reels"), 1), 2), rt.index(rt.index(rt.sv(f, "reels"), 2), 2), rt.index(rt.index(rt.sv(f, "reels"), 3), 2), rt.index(rt.index(rt.sv(f, "reels"), 4), 2), rt.index(rt.index(rt.sv(f, "reels"), 5), 2), rt.index(rt.index(rt.sv(f, "reels"), 1), 3), rt.index(rt.index(rt.sv(f, "reels"), 2), 3), rt.index(rt.index(rt.sv(f, "reels"), 3), 3), rt.index(rt.index(rt.sv(f, "reels"), 4), 3), rt.index(rt.index(rt.sv(f, "reels"), 5), 3)]);
	dat = null;
	if (truthy(rt.sv(f, "working"))) {
		dat = live(reeltext);
	} else {
		dat = fmt("Five credits to play!<BR>\n\t\t<B>Prize Money Available:</B> ＀ (jackpot payout is ALWAYS 100%!)<BR>\n\t\t<B>Credit Remaining:</B> ＀<BR>\n\t\t＀ players have tried their luck today, and ＀ have won a jackpot!<BR>\n\t\t<HR><BR>\n\t\t<A href='?src=＃;spin=1'>Play!</A><BR>\n\t\t<BR>\n\t\t＀\n\t\t<BR>\n\t\t<font size='1'><A href='?src=＃;refund=1'>Refund balance</A><BR>", [rt.sv(f, "money"), rt.sv(f, "balance"), rt.sv(f, "plays"), rt.sv(f, "jackpots"), live(f.src), live(reeltext), live(f.src)]);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "slotmachine", "Slot Machine"]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "set_title_image", [(yield* g.callName(f, live(user), "browse_rsc_icon", [rt.sv(f, "icon"), rt.sv(f, "icon_state")]))]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/Topic  (code/game/machinery/slotmachine.dm:149)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/Topic", function* Topic(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (truthy(rt.at(live(f.args[1]), "spin"))) {
		yield* g.srcCall(f, "spin", live(f.usr));
	} else {
		if (!truthy(rt.at(live(f.args[1]), "refund"))) return f.dot;
		yield* g.srcCall(f, "give_coins", rt.sv(f, "balance"));
		rt.setSv(f, "balance", 0);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/machinery/computer/slot_machine/proc/emp_act  (code/game/machinery/slotmachine.dm:161)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let severity_ascending: Value = null;
	f.vars = () => [severity, severity_ascending];
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 3))) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [multiply(15, live(severity))]))) {
		return live(f.dot);
	}
	if (truthy(rt.op(f, "Prob", [], [1]))) {
		rt.setSv(f, "emagged", 1);
	}
	severity_ascending = subtract(4, live(severity));
	rt.setSv(f, "money", (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/rand"), null, [subtract(rt.sv(f, "money"), multiply(200, live(severity_ascending))), add(rt.sv(f, "money"), multiply(200, live(severity_ascending)))])), 0])));
	rt.setSv(f, "balance", (yield* g.call(f, P("/proc/max"), null, [(yield* g.call(f, P("/proc/rand"), null, [subtract(rt.sv(f, "balance"), multiply(50, live(severity_ascending))), add(rt.sv(f, "balance"), multiply(50, live(severity_ascending)))])), 0])));
	(rt.modSrcVar(f, "money", (yield* g.call(f, P("/proc/max"), null, [0, (yield* g.srcCall(f, "give_coins", (yield* g.call(f, P("/proc/min"), null, [(yield* g.call(f, P("/proc/rand"), null, [-50, multiply(100, live(severity_ascending))]))])), rt.sv(f, "money")))])), subtract));
	yield* g.srcCall(f, "spin");
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/spin  (code/game/machinery/slotmachine.dm:174)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/spin", function* spin(f: Frame, user: Value) {
	let the_name: Value = null;
	f.vars = () => [user, the_name];
	if (!truthy((yield* g.srcCall(f, "can_spin", live(user))))) {
		return live(f.dot);
	}
	the_name = null;
	if (truthy(live(user))) {
		the_name = rt.fv(f, "real_name", live(user));
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ pulls the lever and the slot machine starts spinning!</span>", [live(user)]));
	} else {
		the_name = "Exaybachay";
	}
	(rt.modSrcVar(f, "balance", 5, subtract));
	rt.modSrcVar(f, "money", 5, add);
	rt.modSrcVar(f, "plays", 1, add);
	rt.setSv(f, "working", 1);
	yield* g.srcCall(f, "toggle_reel_spin", 1);
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateDialog");
	rt.spawnTail(f, 0, "/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193", user, the_name);
	rt.spawnTail(f, subtract(65, multiply(7, rt.len(f, rt.sv(f, "reels")))), "/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193 #2", user, the_name);
	return f.dot;
}, true);

// a spawn(subtract(65, multiply(7, rt.fieldI(f, rt.srcVarI(f, $ic[63]), $ic[64])))) body of /obj/machinery/computer/slot_machine/proc/spin, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193 #2", function* (f: Frame, user: Value, the_name: Value) {
	f.vars = () => [user, the_name];
	yield* g.srcCall(f, "toggle_reel_spin", 0, 7);
	rt.setSv(f, "working", 0);
	yield* g.srcCall(f, "give_prizes", live(the_name), live(user));
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "updateDialog");
	return null;
});

// a spawn(0) body of /obj/machinery/computer/slot_machine/proc/spin, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/slot_machine/proc/spin: spawn at game/machinery/slotmachine.dm:193", function* (f: Frame, user: Value, the_name: Value) {
	f.vars = () => [user, the_name];
	while (truthy(rt.sv(f, "working"))) {
		yield* g.srcCall(f, "randomize_reels");
		yield* g.srcCall(f, "updateDialog");
		yield* g.call(f, P("/proc/sleep"), null, [2]);
	}
	return null;
});

// /obj/machinery/computer/slot_machine/proc/can_spin  (code/game/machinery/slotmachine.dm:207)
rt.def("/obj/machinery/computer/slot_machine/proc/can_spin", function can_spin(f: Frame, user: Value) {
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The slot machine has no power!</span>"]);
	}
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The slot machine is broken!</span>"]);
	}
	if (truthy(rt.sv(f, "working"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need to wait until the machine stops spinning before you can play again!</span>"]);
		return 0;
	}
	if (rt.lt(rt.sv(f, "balance"), 5)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Insufficient money to play!</span>"]);
		return 0;
	}
	return 1;
});

// /obj/machinery/computer/slot_machine/proc/toggle_reel_spin  (code/game/machinery/slotmachine.dm:220)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/toggle_reel_spin", function* toggle_reel_spin(f: Frame, value: Value, delay: Value) {
	let reel: Value = null;
	let $e: any;
	f.vars = () => [value, delay, reel, $e];
	if (live(delay) === null) {
		delay = 0;
	}
	reel = null;
	rt.forList(f, 0, rt.sv(f, "reels"), T("/list"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reel = $e;
		rt.setAt(rt.sv(f, "reels"), live(reel), live(value));
		yield* g.call(f, P("/proc/sleep"), null, [live(delay)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/randomize_reels  (code/game/machinery/slotmachine.dm:226)
rt.def("/obj/machinery/computer/slot_machine/proc/randomize_reels", function randomize_reels(f: Frame) {
	let reel: Value = null;
	let $e: any;
	f.vars = () => [reel, $e];
	reel = null;
	rt.forList(f, 0, rt.sv(f, "reels"));
	while (($e = rt.next(f, 0)) !== undefined) {
		reel = $e;
		if (truthy(rt.index(rt.sv(f, "reels"), live(reel)))) {
			rt.setAt(live(reel), 3, rt.index(live(reel), 2));
			rt.setAt(live(reel), 2, rt.index(live(reel), 1));
			rt.setAt(live(reel), 1, rt.op(f, "PickUnweighted", [1], [rt.sv(f, "symbols")]));
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/computer/slot_machine/proc/give_prizes  (code/game/machinery/slotmachine.dm:233)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/give_prizes", function* give_prizes(f: Frame, usrname: Value, user: Value) {
	let linelength: Value = null, i: Value = null, cointype: Value = null, C: Value = null;
	let $0: any;
	f.vars = () => [usrname, user, linelength, i, cointype, C, $0];
	linelength = (yield* g.srcCall(f, "get_lines"));
	if (isEqual(add(add(add(add(rt.index(rt.index(rt.sv(f, "reels"), 1), 2), rt.index(rt.index(rt.sv(f, "reels"), 2), 2)), rt.index(rt.index(rt.sv(f, "reels"), 3), 2)), rt.index(rt.index(rt.sv(f, "reels"), 4), 2)), rt.index(rt.index(rt.sv(f, "reels"), 5), 2)), fmt("＀＀＀＀＀", ["<font color='red'>7</font>", "<font color='red'>7</font>", "<font color='red'>7</font>", "<font color='red'>7</font>", "<font color='red'>7</font>"]))) {
		yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> says, 'JACKPOT! You win ＀ credits worth of coins!'", [live(f.src), rt.sv(f, "money")]));
		if (truthy(live(user))) {
			$0 = rt.fv(f, "real_name", live(user));
		} else {
			$0 = live(usrname);
		}
		yield* g.call(f, P("/proc/priority_announce"), null, [fmt("Congratulations to ＀ for winning the jackpot at the slot machine in ＀!", [$0, (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)]))])]);
		rt.modSrcVar(f, "jackpots", 1, add);
		rt.modSrcVar(f, "balance", subtract(rt.sv(f, "money"), (yield* g.srcCall(f, "give_coins", 10000))), add);
		rt.setSv(f, "money", 0);
		i = null;
		i = 0;
		while (rt.lt(live(i), 5)) {
			cointype = rt.op(f, "PickUnweighted", [1], [subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/coin")])), T("/obj/item/weapon/coin"))]);
			yield* g.call(f, P("/proc/random_step"), null, [(C = (yield* g.new_(f, live(cointype), [rt.sv(f, "loc")]))), 2, 50]);
			i = rt.inc(live(i), 1);
		}
	} else {
		if (isEqual(live(linelength), 5)) {
			yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> says, 'Big Winner! You win a thousand credits worth of coins!'", [live(f.src)]));
			yield* g.srcCall(f, "give_money", 1000);
		} else {
			if (isEqual(live(linelength), 4)) {
				yield* g.srcCall(f, "visible_message", fmt("<b>＀</b> says, 'Winner! You win four hundred credits worth of coins!'", [live(f.src)]));
				yield* g.srcCall(f, "give_money", 400);
			} else {
				if (isEqual(live(linelength), 3)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You win three free games!</span>"]);
					rt.modSrcVar(f, "balance", 20, add);
					rt.setSv(f, "money", (yield* g.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "money"), 20), rt.sv(f, "money")])));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No luck!</span>"]);
				}
			}
		}
	}
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/get_lines  (code/game/machinery/slotmachine.dm:266)
rt.def("/obj/machinery/computer/slot_machine/proc/get_lines", function get_lines(f: Frame) {
	let amountthesame: Value = null, i: Value = null, inputtext: Value = null, symbol: Value = null, j: Value = null, symboltext: Value = null;
	let $e: any;
	f.vars = () => [amountthesame, i, inputtext, symbol, j, symboltext, $e];
	amountthesame = null;
	i = null;
	i = 1;
	while (rt.le(live(i), 3)) {
		inputtext = add(add(add(add(rt.index(rt.index(rt.sv(f, "reels"), 1), live(i)), rt.index(rt.index(rt.sv(f, "reels"), 2), live(i))), rt.index(rt.index(rt.sv(f, "reels"), 3), live(i))), rt.index(rt.index(rt.sv(f, "reels"), 4), live(i))), rt.index(rt.index(rt.sv(f, "reels"), 5), live(i)));
		symbol = null;
		rt.forList(f, 0, rt.sv(f, "symbols"));
		while (($e = rt.next(f, 0)) !== undefined) {
			symbol = $e;
			j = 3;
			symboltext = add(add(live(symbol), live(symbol)), live(symbol));
			while (rt.le(live(j), 5)) {
				if (truthy(rt.call(f, P("/proc/findtext"), null, [live(inputtext), live(symboltext)]))) {
					amountthesame = rt.call(f, P("/proc/max"), null, [live(j), live(amountthesame)]);
				}
				j = rt.inc(live(j), 1);
				symboltext = rt.modify(live(symboltext), live(symbol), add);
			}
			if (truthy(live(amountthesame))) {
				break;
			}
		}
		rt.endFor(f, 0);
		i = rt.inc(live(i), 1);
	}
	return live(amountthesame);
});

// /obj/machinery/computer/slot_machine/proc/give_money  (code/game/machinery/slotmachine.dm:283)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/give_money", function* give_money(f: Frame, amount: Value) {
	let amount_to_give: Value = null, surplus: Value = null;
	let $0: any;
	f.vars = () => [amount, amount_to_give, surplus, $0];
	if (rt.ge(rt.sv(f, "money"), live(amount))) {
		$0 = live(amount);
	} else {
		$0 = rt.sv(f, "money");
	}
	amount_to_give = $0;
	surplus = subtract(live(amount_to_give), (yield* g.srcCall(f, "give_coins", live(amount_to_give))));
	rt.setSv(f, "money", (yield* g.call(f, P("/proc/max"), null, [0, subtract(rt.sv(f, "money"), live(amount))])));
	rt.modSrcVar(f, "balance", live(surplus), add);
	return f.dot;
}, true);

// /obj/machinery/computer/slot_machine/proc/give_coins  (code/game/machinery/slotmachine.dm:289)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/give_coins", function* give_coins(f: Frame, amount: Value) {
	let cointype: Value = null, target: Value = null;
	let $0: any;
	f.vars = () => [amount, cointype, target, $0];
	if (truthy(rt.sv(f, "emagged"))) {
		$0 = T("/obj/item/weapon/coin/iron");
	} else {
		$0 = T("/obj/item/weapon/coin/silver");
	}
	cointype = $0;
	if (!truthy(rt.sv(f, "emagged"))) {
		amount = (yield* g.srcCall(f, "dispense", live(amount), live(cointype), null, 0));
	} else {
		target = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/range"), null, [2, live(f.src)])));
		amount = (yield* g.srcCall(f, "dispense", live(amount), live(cointype), live(target), 1));
	}
	return live(amount);
}, true);

// /obj/machinery/computer/slot_machine/proc/dispense  (code/game/machinery/slotmachine.dm:302)  may sleep
rt.def("/obj/machinery/computer/slot_machine/proc/dispense", function* dispense(f: Frame, amount: Value, cointype: Value, target: Value, throwit: Value) {
	let value: Value = null, C: Value = null;
	f.vars = () => [amount, cointype, target, throwit, value, C];
	if (live(amount) === null) {
		amount = 0;
	}
	if (live(cointype) === null) {
		cointype = T("/obj/item/weapon/coin/silver");
	}
	if (live(throwit) === null) {
		throwit = 0;
	}
	value = rt.index(rt.sv(f, "coinvalues"), fmt("＀", [live(cointype)]));
	while (rt.ge(live(amount), live(value))) {
		C = (yield* g.new_(f, live(cointype), [rt.sv(f, "loc")]));
		(amount = rt.modify(live(amount), live(value), subtract));
		if ((truthy(live(throwit)) && truthy(live(target)))) {
			yield* g.callName(f, live(C), "throw_at", [live(target), 3, 10]);
		} else {
			yield* g.call(f, P("/proc/random_step"), null, [live(C), 2, 40]);
		}
	}
	return live(amount);
}, true);
