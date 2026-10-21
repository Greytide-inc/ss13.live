// From code/modules/games/cards.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7486, "/obj/item/weapon/deck", "/obj/item/weapon", {
	cards: null,
	flags: 4,
	name: "deck of cards",
	desc: "A simple deck of playing cards.",
	icon: rt.rsc("icons/obj/playing_cards.dmi"),
	icon_state: "deck",
	w_class: 2,
});

// /obj/item/weapon/deck/proc/<init>  (code/modules/games/cards.dm:17)
rt.def("/obj/item/weapon/deck/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cards", rt.list());
	return f.dot;
});

// /obj/item/weapon/deck/proc/New  (code/modules/games/cards.dm:20)  may sleep
rt.def("/obj/item/weapon/deck/proc/New", function* New(f: Frame) {
	let cardcolor: Value = null, card: Value = null, suit: Value = null, number: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [cardcolor, card, suit, number, i, $e];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	cardcolor = null;
	card = null;
	suit = null;
	rt.forList(f, 0, rt.list("spades", "clubs", "diamonds", "hearts"));
	while (($e = rt.next(f, 0)) !== undefined) {
		suit = $e;
		if ((isEqual(live(suit), "spades") || isEqual(live(suit), "clubs"))) {
			cardcolor = "black_";
		} else {
			cardcolor = "red_";
		}
		number = null;
		rt.forList(f, 1, rt.list("ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"));
		while (($e = rt.next(f, 1)) !== undefined) {
			number = $e;
			rt.setFv(f, "name", (card = (yield* g.new_(f, T("/datum/playingcard"), []))), fmt("＀ of ＀", [live(number), live(suit)]));
			rt.setFv(f, "card_icon", live(card), fmt("＀num", [live(cardcolor)]));
			rt.setFv(f, "suit", live(card), live(suit));
			rt.setFv(f, "number", live(card), live(number));
			yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Add", [live(card)]);
		}
		rt.endFor(f, 1);
		number = null;
		rt.forList(f, 1, rt.list("jack", "queen", "king"));
		while (($e = rt.next(f, 1)) !== undefined) {
			number = $e;
			rt.setFv(f, "name", (card = (yield* g.new_(f, T("/datum/playingcard"), []))), fmt("＀ of ＀", [live(number), live(suit)]));
			rt.setFv(f, "card_icon", live(card), fmt("＀col", [live(cardcolor)]));
			rt.setFv(f, "suit", live(card), live(suit));
			rt.setFv(f, "number", live(card), live(number));
			yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Add", [live(card)]);
		}
		rt.endFor(f, 1);
	}
	rt.endFor(f, 0);
	i = null;
	i = 0;
	while (rt.lt(live(i), 2)) {
		rt.setFv(f, "name", (card = (yield* g.new_(f, T("/datum/playingcard"), []))), "joker");
		rt.setFv(f, "card_icon", live(card), "joker");
		rt.setFv(f, "suit", live(card), "joker");
		rt.setFv(f, "number", live(card), "");
		yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Add", [live(card)]);
		i = rt.inc(live(i), 1);
	}
	return f.dot;
}, true);

// /obj/item/weapon/deck/proc/attackby  (code/modules/games/cards.dm:59)  may sleep
rt.def("/obj/item/weapon/deck/proc/attackby", function* attackby(f: Frame) {
	let H: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [H, _P, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hand")) ? 1 : 0))) {
		H = live(f.args[0]);
		_P = null;
		rt.forList(f, 0, rt.fv(f, "cards", live(H)), T("/datum/playingcard"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_P = $e;
			yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Add", [live(_P)]);
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
		yield* g.callName(f, live(f.args[1]), "show_message", ["You place your cards on the bottom of the deck."]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/weapon/deck/proc/attack_self  (code/modules/games/cards.dm:70)
rt.def("/obj/item/weapon/deck/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let newcards: Value = null, card: Value = null;
	f.vars = () => [newcards, card];
	newcards = rt.list();
	card = null;
	while (truthy(rt.len(f, rt.sv(f, "cards")))) {
		card = rt.op(f, "PickUnweighted", [1], [rt.sv(f, "cards")]);
		rt.callName(f, live(newcards), "Add", [live(card)]);
		rt.callName(f, rt.fv(f, "cards", live(f.src)), "Remove", [live(card)]);
	}
	rt.setFv(f, "cards", live(f.src), live(newcards));
	rt.callName(f, live(user), "visible_message", [fmt("＄！ shuffles ＀.", [live(user), live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/deck/proc/afterattack  (code/modules/games/cards.dm:86)  may sleep
rt.def("/obj/item/weapon/deck/proc/afterattack", function* afterattack(f: Frame) {
	if (truthy(live(f.args[2]))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, live(f.src), "dealTo", [live(f.args[0]), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["A", "user", "flag", "params"] });

// /obj/item/weapon/deck/proc/attack  (code/modules/games/cards.dm:92)  may sleep
rt.def("/obj/item/weapon/deck/proc/attack", function* attack(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) {
		yield* g.callName(f, live(f.src), "dealTo", [live(f.args[0]), live(f.args[1])]);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["M", "user", "def_zone"] });

// /obj/item/weapon/deck/proc/dealTo  (code/modules/games/cards.dm:98)  may sleep
rt.def("/obj/item/weapon/deck/proc/dealTo", function* dealTo(f: Frame, target: Value, source: Value) {
	let card: Value = null, H: Value = null;
	f.vars = () => [target, source, card, H];
	if (!truthy(rt.len(f, rt.sv(f, "cards")))) {
		yield* g.callName(f, live(source), "show_message", ["There are no cards in the deck."]);
		return live(f.dot);
	}
	card = rt.index(rt.fv(f, "cards", live(f.src)), 1);
	yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Remove", [live(card)]);
	rt.setFv(f, "concealed", (H = (yield* g.new_(f, T("/obj/item/weapon/hand"), [rt.getStep(f, live(f.src), 0)]))), 1);
	yield* g.callName(f, live(H), "update_conceal", []);
	yield* g.callName(f, rt.fv(f, "cards", live(H)), "Add", [live(card)]);
	yield* g.callName(f, live(H), "update_icon", []);
	yield* g.callName(f, live(source), "visible_message", [fmt("＄！ deals a card to ％！.", [live(source), live(target)])]);
	yield* g.callName(f, live(H), "throw_at", [rt.getStep(f, live(target), rt.fv(f, "dir", live(target))), 10, 1, live(source)]);
	return f.dot;
}, true);

rt.type(7487, "/obj/item/weapon/hand", "/obj/item/weapon", {
	concealed: 0,
	blank: 0,
	cards: null,
	hi: null,
	name: "hand of cards",
	desc: "Some playing cards.",
	icon: rt.rsc("icons/obj/playing_cards.dmi"),
	icon_state: "empty",
	w_class: 1,
	resistance_flags: 4,
});

// /obj/item/weapon/hand/proc/<init>  (code/modules/games/cards.dm:128)
rt.def("/obj/item/weapon/hand/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "cards", rt.list());
	return f.dot;
});

// /obj/item/weapon/hand/proc/New  (code/modules/games/cards.dm:133)  may sleep
rt.def("/obj/item/weapon/hand/proc/New", function* New(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setFv(f, "hi", live(f.src), (yield* g.new_(f, T("/datum/html_interface/cards"), [live(f.src), "Your hand", 540, 302])));
	yield* g.callName(f, live(f.src), "update_conceal", []);
	return f.dot;
}, true, { args: ["loc"] });

// /obj/item/weapon/hand/proc/Destroy  (code/modules/games/cards.dm:139)  may sleep
rt.def("/obj/item/weapon/hand/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.fv(f, "hi", live(f.src)))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "hi", live(f.src))]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/hand/proc/attackby  (code/modules/games/cards.dm:145)  may sleep
rt.def("/obj/item/weapon/hand/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, cardtext: Value = null, H: Value = null, _P_1: Value = null;
	let $e: any;
	f.vars = () => [_P, cardtext, H, _P_1, $e];
	if ((isEqual(rt.len(f, rt.sv(f, "cards")), 1) && truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)))) {
		_P = rt.index(rt.sv(f, "cards"), 1);
		if (!truthy(rt.sv(f, "blank"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "You cannot write on that card."]);
			return live(f.dot);
		}
		if (!truthy((cardtext = (yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [null, "Card Writing", "What do you wish to write on the card?", live(f.args[1]), null])), 50]))))) {
			return live(f.dot);
		}
		rt.setFv(f, "name", live(_P), live(cardtext));
		rt.setSv(f, "blank", 0);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/hand")) ? 1 : 0))) {
			H = live(f.args[0]);
			_P_1 = null;
			rt.forList(f, 0, rt.fv(f, "cards", live(f.src)), T("/datum/playingcard"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P_1 = $e;
				yield* g.callName(f, rt.fv(f, "cards", live(H)), "Add", [live(_P_1)]);
			}
			rt.endFor(f, 0);
			yield* g.callName(f, live(H), "update_icon", []);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user"] });

// /obj/item/weapon/hand/verb/discard  (code/modules/games/cards.dm:171)  may sleep
rt.def("/obj/item/weapon/hand/verb/discard", function* discard(f: Frame, card: Value) {
	let H: Value = null;
	let $0: any;
	f.vars = () => [card, H, $0];
	if (!truthy(live(card))) {
		return live(f.dot);
	}
	rt.setFv(f, "concealed", (H = (yield* g.new_(f, T("/obj/item/weapon/hand"), [rt.fv(f, "loc", live(f.src))]))), 0);
	yield* g.callName(f, live(H), "update_conceal", []);
	yield* g.callName(f, rt.fv(f, "cards", live(H)), "Add", [live(card)]);
	yield* g.callName(f, rt.fv(f, "cards", live(f.src)), "Remove", [live(card)]);
	yield* g.callName(f, live(H), "update_icon", []);
	if (truthy(live(H))) {
		$0 = null;
	} else {
		$0 = (yield* g.call(f, P("/proc/CRASH"), null, ["Assertion Failed: H"]));
	}
	yield* g.callName(f, live(f.usr), "visible_message", [fmt("＄！ plays ％！.", [live(f.usr), rt.fv(f, "name", live(card))])]);
	rt.setFv(f, "loc", live(H), rt.getStep(f, live(f.usr), rt.fv(f, "dir", live(f.usr))));
	yield* g.callName(f, live(f.src), "update_icon", []);
	return f.dot;
}, true, { verb: { name: "Discard", category: "Object", desc: "Place a card from your hand in front of you." }, argTypes: [{ path: "/datum/playingcard", source: "cards" }] });

// /obj/item/weapon/hand/verb/toggle_conceal  (code/modules/games/cards.dm:196)  may sleep
rt.def("/obj/item/weapon/hand/verb/toggle_conceal", function* toggle_conceal(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.setFv(f, "concealed", live(f.src), (!truthy(rt.fv(f, "concealed", live(f.src))) ? 1 : 0));
	yield* g.callName(f, live(f.src), "update_conceal", []);
	$0 = live(f.usr);
	$1 = live(f.usr);
	if (truthy(rt.sv(f, "concealed"))) {
		$1 = $1;
		$2 = "conceals";
	} else {
		$2 = "reveals";
	}
	yield* g.callName(f, $0, "visible_message", [fmt("＄！ ＀ their hand.", [$1, $2])]);
	yield* g.callName(f, live(f.src), "update_icon", []);
	return f.dot;
}, true, { verb: { name: "Toggle conceal", category: "Object", desc: "Toggle concealment of your hand" } });

// /obj/item/weapon/hand/proc/attack_self  (code/modules/games/cards.dm:205)  may sleep
rt.def("/obj/item/weapon/hand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, rt.fv(f, "hi", live(f.src)), "show", [live(user)]);
	return f.dot;
}, true);

// /obj/item/weapon/hand/proc/examine  (code/modules/games/cards.dm:208)
rt.def("/obj/item/weapon/hand/proc/examine", function examine(f: Frame) {
	let card: Value = null;
	let $e: any;
	f.vars = () => [card, $e];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!((!truthy(rt.sv(f, "concealed")) || isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) && truthy(rt.len(f, rt.sv(f, "cards"))))) return f.dot;
	rt.callName(f, live(f.usr), "show_message", ["It contains: ", 1]);
	card = null;
	rt.forList(f, 0, rt.sv(f, "cards"), T("/datum/playingcard"));
	while (($e = rt.next(f, 0)) !== undefined) {
		card = $e;
		rt.callName(f, live(f.usr), "show_message", [fmt("The ＀.", [rt.fv(f, "name", live(card))]), 1]);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/weapon/hand/proc/update_conceal  (code/modules/games/cards.dm:217)  may sleep
rt.def("/obj/item/weapon/hand/proc/update_conceal", function* update_conceal(f: Frame) {
	if (truthy(rt.fv(f, "concealed", live(f.src)))) {
		yield* g.callName(f, rt.fv(f, "hi", live(f.src)), "updateContent", ["headbar", fmt("You are currently concealing your hand. <a href=\"byond://?src=＃&action=toggle_conceal\">Reveal your hand.</a>", [rt.sv(f, "hi")])]);
	} else {
		yield* g.callName(f, rt.fv(f, "hi", live(f.src)), "updateContent", ["headbar", fmt("You are currently revealing your hand. <a href=\"byond://?src=＃&action=toggle_conceal\">Conceal your hand.</a>", [rt.sv(f, "hi")])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/hand/proc/update_icon  (code/modules/games/cards.dm:223)  may sleep
rt.def("/obj/item/weapon/hand/proc/update_icon", function* update_icon(f: Frame) {
	let _P: Value = null, card_overlay: Value = null, origin: Value = null, offset: Value = null, i: Value = null, card_overlay_3: Value = null, _P_4: Value = null, html: Value = null, card: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [_P, card_overlay, origin, offset, i, card_overlay_3, _P_4, html, card, $0, $1, $e];
	if (!truthy(rt.len(f, rt.sv(f, "cards")))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (rt.gt(rt.len(f, rt.sv(f, "cards")), 1)) {
			rt.setSv(f, "name", "hand of cards");
			rt.setSv(f, "desc", "Some playing cards.");
		} else {
			rt.setSv(f, "name", "a playing card");
			rt.setSv(f, "desc", "A playing card.");
		}
		yield* g.srcCall(f, "cut_overlays");
		if (isEqual(rt.len(f, rt.sv(f, "cards")), 1)) {
			_P = rt.index(rt.sv(f, "cards"), 1);
			$0 = rt.sv(f, "icon");
			if (truthy(rt.sv(f, "concealed"))) {
				$1 = "card_back";
			} else {
				$1 = fmt("＀", [rt.fv(f, "card_icon", live(_P))]);
			}
			rt.setFv(f, "pixel_x", (card_overlay = (yield* g.call(f, P("/proc/mutable_appearance"), null, [$0, $1]))), add(rt.fv(f, "pixel_x", live(card_overlay)), add(-5, (yield* g.call(f, P("/proc/rand"), null, [10])))));
			rt.setFv(f, "pixel_y", live(card_overlay), add(rt.fv(f, "pixel_y", live(card_overlay)), add(-5, (yield* g.call(f, P("/proc/rand"), null, [10])))));
			yield* g.srcCall(f, "add_overlay", live(card_overlay));
		} else {
			origin = -12;
			offset = (yield* g.call(f, P("/proc/round"), null, [divide(32, rt.len(f, rt.sv(f, "cards")))]));
			i = 0;
			card_overlay_3 = null;
			_P_4 = null;
			rt.forList(f, 0, rt.sv(f, "cards"), T("/datum/playingcard"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P_4 = $e;
				$0 = rt.sv(f, "icon");
				if (truthy(rt.sv(f, "concealed"))) {
					$1 = "card_back";
				} else {
					$1 = rt.fv(f, "card_icon", live(_P_4));
				}
				rt.setFv(f, "pixel_x", (card_overlay_3 = (yield* g.call(f, P("/proc/mutable_appearance"), null, [$0, $1]))), add(live(origin), multiply(live(offset), live(i))));
				yield* g.srcCall(f, "add_overlay", live(card_overlay_3));
				i = add(live(i), 1);
			}
			rt.endFor(f, 0);
		}
		html = "";
		card = null;
		rt.forList(f, 0, rt.sv(f, "cards"), T("/datum/playingcard"));
		while (($e = rt.next(f, 0)) !== undefined) {
			card = $e;
			html = add(live(html), fmt("<a href=\"byond://?src=＃&action=play_card&card=＃\" class=\"card ＀ ＀\"></a>", [rt.fv(f, "hi", live(f.src)), live(card), rt.fv(f, "suit", live(card)), rt.fv(f, "number", live(card))]));
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.fv(f, "hi", live(f.src)), "updateContent", ["hand", live(html)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/hand/proc/Topic  (code/modules/games/cards.dm:265)  may sleep
rt.def("/obj/item/weapon/hand/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hclient: Value) {
	let card: Value = null;
	let $0: any;
	f.vars = () => [href, href_list, hclient, card, $0];
	if (!truthy((rt.istype(live(hclient), T("/datum/html_interface_client")) ? 1 : 0))) return f.dot;
	$0 = rt.at(live(href_list), "action");
	if ($0 === "play_card") {
		if ((truthy((card = rt.locateIn(f, rt.at(live(href_list), "card"), rt.sv(f, "cards")))) && truthy((rt.istype(live(card), T("/datum/playingcard")) ? 1 : 0)))) {
			yield* g.callName(f, live(f.src), "discard", [live(card)]);
		}
	} else if ($0 === "toggle_conceal") {
		yield* g.callName(f, live(f.src), "toggle_conceal", []);
	}
	return f.dot;
}, true);

// /obj/item/weapon/hand/proc/hiIsValidClient  (code/modules/games/cards.dm:276)
rt.def("/obj/item/weapon/hand/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	return ((rt.gv(f, "mob", rt.fv(f, "client", live(hclient))) && (isEqual(rt.gv(f, "stat", rt.gv(f, "mob", rt.fv(f, "client", live(hclient)))), 0) ? 1 : 0)) && (rt.isIn(f, live(f.src), rt.gv(f, "contents", rt.gv(f, "mob", rt.fv(f, "client", live(hclient))))) ? 1 : 0));
});
