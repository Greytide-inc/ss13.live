// Based on /tg/station's code/modules/games/cards.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(7486, "/obj/item/weapon/deck", "/obj/item/weapon", {
	cards: null,
	flags: 4,
	name: "deck of cards",
	desc: "A simple deck of playing cards.",
	icon: rt.rsc("icons/obj/playing_cards.dmi"),
	icon_state: "deck",
	w_class: 2,
});

// cards.dm:17
rt.def("/obj/item/weapon/deck/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cards = list();
	return f.dot;
});

// cards.dm:20
rt.def("/obj/item/weapon/deck/proc/New", function* New(f: Frame) {
	let cardcolor: Value = null, card: Value = null, suit: Value = null, number: Value = null;
	f.dot = (yield* parent_proc());
	for (suit of each(list("spades", "clubs", "diamonds", "hearts"))) {
		if (suit == "spades" || suit == "clubs") {
			cardcolor = "black_";
		} else {
			cardcolor = "red_";
		}
		number = null;
		for (number of each(list("ace", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"))) {
			(card = (yield* new_(T("/datum/playingcard")))).name = `${number} of ${suit}`;
			card.card_icon = `${cardcolor}num`;
			card.suit = suit;
			card.number = number;
			this.cards.Add(card);
		}
		number = null;
		for (number of each(list("jack", "queen", "king"))) {
			(card = (yield* new_(T("/datum/playingcard")))).name = `${number} of ${suit}`;
			card.card_icon = `${cardcolor}col`;
			card.suit = suit;
			card.number = number;
			this.cards.Add(card);
		}
	}
	let i: Value = 0;
	while (i < 2) {
		(card = (yield* new_(T("/datum/playingcard")))).name = "joker";
		card.card_icon = "joker";
		card.suit = "joker";
		card.number = "";
		this.cards.Add(card);
		i++;
	}
	return f.dot;
}, true);

// cards.dm:59
rt.def("/obj/item/weapon/deck/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	let H: Value = null, _P: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/hand"))) {
		H = O;
		for (_P of each(H.cards, T("/datum/playingcard"))) {
			this.cards.Add(_P);
		}
		yield* qdel(O);
		user.show_message("You place your cards on the bottom of the deck.");
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cards.dm:70
rt.def("/obj/item/weapon/deck/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let card: Value = null;
	let newcards: Value = list();
	while (rt.len(f, this.cards)) {
		card = pick(this.cards);
		newcards.Add(card);
		this.cards.Remove(card);
	}
	this.cards = newcards;
	user.visible_message(fmt("＄！ shuffles ＀.", [user, this]));
	return f.dot;
});

// cards.dm:86
rt.def("/obj/item/weapon/deck/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, flag: Value, params: Value) {
	if (flag) {
		return f.dot;
	}
	if (rt.istype(A, T("/mob/living"))) {
		yield* this.dealTo(A, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cards.dm:92
rt.def("/obj/item/weapon/deck/proc/attack", function* attack(f: Frame, M: Value, user: Value, def_zone: Value) {
	if (rt.istype(M, T("/mob/living"))) {
		yield* this.dealTo(M, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cards.dm:98
rt.def("/obj/item/weapon/deck/proc/dealTo", function* dealTo(f: Frame, target: Value, source: Value) {
	let H: Value = null;
	if (!rt.len(f, this.cards)) {
		source.show_message("There are no cards in the deck.");
		return f.dot;
	}
	let card: Value = rt.index(this.cards, 1);
	yield* this.cards.Remove(card);
	(H = (yield* new_(T("/obj/item/weapon/hand"), rt.getStep(f, this, 0)))).concealed = 1;
	yield* H.update_conceal();
	H.cards.Add(card);
	yield* H.update_icon();
	source.visible_message(fmt("＄！ deals a card to ％！.", [source, target]));
	yield* H.throw_at(rt.getStep(f, target, target.dir), 10, 1, source);
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

// cards.dm:128
rt.def("/obj/item/weapon/hand/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cards = list();
	return f.dot;
});

// cards.dm:133
rt.def("/obj/item/weapon/hand/proc/New", function* New(f: Frame, loc: Value) {
	f.dot = (yield* parent_proc());
	this.hi = (yield* new_(T("/datum/html_interface/cards"), this, "Your hand", 540, 302));
	yield* this.update_conceal();
	return f.dot;
}, true);

// cards.dm:139
rt.def("/obj/item/weapon/hand/proc/Destroy", function* Destroy(f: Frame) {
	if (this.hi) {
		yield* qdel(this.hi);
	}
	return (yield* parent_proc());
}, true);

// cards.dm:145
rt.def("/obj/item/weapon/hand/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	let _P: Value = null, cardtext: Value = null, H: Value = null, _P_1: Value = null;
	if (rt.len(f, this.cards) == 1 && rt.istype(O, T("/obj/item/weapon/pen"))) {
		_P = rt.index(this.cards, 1);
		if (!this.blank) {
			to_chat(user, "You cannot write on that card.");
			return f.dot;
		}
		if (!(cardtext = sanitize((yield* g.op(f, "Prompt", [3], [null, "Card Writing", "What do you wish to write on the card?", user, null])), 50))) {
			return f.dot;
		}
		_P.name = cardtext;
		this.blank = 0;
	} else if (rt.istype(O, T("/obj/item/weapon/hand"))) {
		H = O;
		for (_P_1 of each(this.cards, T("/datum/playingcard"))) {
			H.cards.Add(_P_1);
		}
		yield* H.update_icon();
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// cards.dm:171
rt.def("/obj/item/weapon/hand/verb/discard", function* discard(f: Frame, card: Value) {
	let H: Value = null;
	if (!card) {
		return f.dot;
	}
	(H = (yield* new_(T("/obj/item/weapon/hand"), this.loc))).concealed = 0;
	yield* H.update_conceal();
	H.cards.Add(card);
	yield* this.cards.Remove(card);
	yield* H.update_icon();
	if (H) {
	} else {
		CRASH("Assertion Failed: H");
	}
	f.usr.visible_message(fmt("＄！ plays ％！.", [f.usr, card.name]));
	H.loc = rt.getStep(f, f.usr, f.usr.dir);
	yield* this.update_icon();
	return f.dot;
}, true, { verb: { name: "Discard", category: "Object", desc: "Place a card from your hand in front of you." }, argTypes: [{ path: "/datum/playingcard", source: "cards" }] });

// cards.dm:196
rt.def("/obj/item/weapon/hand/verb/toggle_conceal", function* toggle_conceal(f: Frame) {
	let $2: any;
	this.concealed = (!this.concealed ? 1 : 0);
	yield* this.update_conceal();
	let $0: any = f.usr;
	let $1: any = f.usr;
	if (this.concealed) {

		$2 = "conceals";
	} else {
		$2 = "reveals";
	}
	$0.visible_message(fmt("＄！ ＀ their hand.", [$1, $2]));
	yield* this.update_icon();
	return f.dot;
}, true, { verb: { name: "Toggle conceal", category: "Object", desc: "Toggle concealment of your hand" } });

// cards.dm:205
rt.def("/obj/item/weapon/hand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.hi.show(user);
	return f.dot;
}, true);

// cards.dm:208
rt.def("/obj/item/weapon/hand/proc/examine", function examine(f: Frame) {
	let card: Value = null;
	f.dot = parent_proc();
	if (!((!this.concealed || this.loc == f.usr) && rt.len(f, this.cards))) return f.dot;
	f.usr.show_message("It contains: ", 1);
	for (card of each(this.cards, T("/datum/playingcard"))) {
		f.usr.show_message(`The ${card.name}.`, 1);
	}
	return f.dot;
});

// cards.dm:217
rt.def("/obj/item/weapon/hand/proc/update_conceal", function* update_conceal(f: Frame) {
	if (this.concealed) {
		yield* this.hi.updateContent("headbar", fmt("You are currently concealing your hand. <a href=\"byond://?src=＃&action=toggle_conceal\">Reveal your hand.</a>", [this.hi]));
	} else {
		yield* this.hi.updateContent("headbar", fmt("You are currently revealing your hand. <a href=\"byond://?src=＃&action=toggle_conceal\">Conceal your hand.</a>", [this.hi]));
	}
	return f.dot;
}, true);

// cards.dm:223
rt.def("/obj/item/weapon/hand/proc/update_icon", function* update_icon(f: Frame) {
	let _P: Value = null, card_overlay: Value = null, origin: Value = null, offset: Value = null, i: Value = null, card_overlay_3: Value = null, _P_4: Value = null, html: Value = null, card: Value = null;
	let $0: any, $1: any, $e: any;
	if (!rt.len(f, this.cards)) {
		yield* qdel(this);
	} else {
		if (rt.len(f, this.cards) > 1) {
			this.name = "hand of cards";
			this.desc = "Some playing cards.";
		} else {
			this.name = "a playing card";
			this.desc = "A playing card.";
		}
		this.cut_overlays();
		if (rt.len(f, this.cards) == 1) {
			_P = rt.index(this.cards, 1);
			$0 = this.icon;
			if (this.concealed) {
				$1 = "card_back";
			} else {
				$1 = `${_P.card_icon}`;
			}
			(card_overlay = mutable_appearance($0, $1)).pixel_x = card_overlay.pixel_x + (-5 + rand(10));
			card_overlay.pixel_y = card_overlay.pixel_y + (-5 + rand(10));
			this.add_overlay(card_overlay);
		} else {
			origin = -12;
			offset = round(32 / rt.len(f, this.cards));
			i = 0;
			for (_P_4 of each(this.cards, T("/datum/playingcard"))) {
				$0 = this.icon;
				if (this.concealed) {
					$1 = "card_back";
				} else {
					$1 = _P_4.card_icon;
				}
				(card_overlay_3 = mutable_appearance($0, $1)).pixel_x = origin + offset * i;
				this.add_overlay(card_overlay_3);
				i = i + 1;
			}
		}
		html = "";
		for (card of each(this.cards, T("/datum/playingcard"))) {
			html = html + fmt("<a href=\"byond://?src=＃&action=play_card&card=＃\" class=\"card ＀ ＀\"></a>", [this.hi, card, card.suit, card.number]);
		}
		yield* this.hi.updateContent("hand", html);
	}
	return f.dot;
}, true);

// cards.dm:265
rt.def("/obj/item/weapon/hand/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value, hclient: Value) {
	let card: Value = null;
	if (!rt.istype(hclient, T("/datum/html_interface_client"))) return f.dot;
	const item = rt.at(href_list, "action");
	if (item === "play_card") {
		if ((card = rt.locateIn(f, rt.at(href_list, "card"), this.cards)) && rt.istype(card, T("/datum/playingcard"))) {
			yield* this.discard(card);
		}
	} else if (item === "toggle_conceal") {
		yield* this.toggle_conceal();
	}
	return f.dot;
}, true);

// cards.dm:276
rt.def("/obj/item/weapon/hand/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	return ((hclient.client.mob && (hclient.client.mob.stat == 0 ? 1 : 0)) && (rt.isIn(f, this, hclient.client.mob.contents) ? 1 : 0));
});
