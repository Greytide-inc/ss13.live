// Based on /tg/station's code/modules/games/cas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, subtract } = rt;


rt.type(9717, "/obj/item/toy/cards/deck/cas", "/obj/item/toy/cards/deck", {
	card_face: "cas_white",
	blanks: 25,
	decksize: 150,
	card_text_file: "strings/cas_white.txt",
	allcards: null,
	deckstyle: "caswhite",
	name: "１CAS deck (white)",
	desc: "A deck for the game Cards Against Spess, still popular after all these centuries. Warning: may include traces of broken fourth wall. This is the white deck.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_caswhite_full",
});

// cas.dm:18
rt.def("/obj/item/toy/cards/deck/cas/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allcards = list();
	return f.dot;
});

// cas.dm:32
rt.def("/obj/item/toy/cards/deck/cas/proc/New", function* New(f: Frame) {
	let possiblecards: Value = null, i: Value = null, cardtext: Value = null, _P: Value = null, x: Value = null, _P_3: Value = null;
	let $e: any;
	this.allcards = rt.index(GLOB.cards_against_space, this.card_face);
	if (rt.len(f, (possiblecards = (yield* this.allcards.Copy()))) < this.decksize) {
		this.decksize = rt.len(f, possiblecards) - 1;
	}
	let randomcards: Value = list();
	while (rt.len(f, randomcards) < this.decksize) {
		randomcards += pick_n_take(possiblecards);
	}
	rt.forRange(f, 0, 1, rt.len(f, randomcards), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		cardtext = rt.index(randomcards, i);
		_P = null;
		(_P = (yield* new_(T("/datum/playingcard")))).name = `${cardtext}`;
		_P.card_icon = `${this.card_face}`;
		this.cards += _P;
	}
	rt.endFor(f, 0);
	if (!this.blanks) {
		return f.dot;
	}
	rt.forRange(f, 0, 1, this.blanks, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		_P_3 = null;
		(_P_3 = (yield* new_(T("/datum/playingcard")))).name = "Blank Card";
		_P_3.card_icon = "cas_white";
		this.cards += _P_3;
	}
	rt.endFor(f, 0);
	shuffle_inplace(this.cards);
	yield* parent_proc();
	return f.dot;
}, true);

// cas.dm:58
rt.def("/obj/item/toy/cards/deck/cas/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let choice: Value = null;
	if (user.lying) {
		return f.dot;
	}
	if (rt.len(f, this.cards) == 0) {
		to_chat(user, "<span class='warning'>There are no more cards to draw!</span>");
		return f.dot;
	}
	let H: Value = (yield* new_(T("/obj/item/toy/cards/singlecard/cas"), user.loc));
	if ((choice = rt.index(this.cards, 1)).name == "Blank Card") {
		H.blank = 1;
	}
	H.name = choice.name;
	H.buffertext = choice.name;
	H.icon_state = choice.card_icon;
	H.card_face = choice.card_icon;
	H.parentdeck = this;
	(rt.modField(f, this, "cards", choice, subtract));
	yield* H.pickup(user);
	yield* user.put_in_hands(H);
	user.visible_message(`${user} draws a card from the deck.`, "<span class='notice'>You draw a card from the deck.</span>");
	yield* this.update_icon();
	return f.dot;
}, true);

// cas.dm:79
rt.def("/obj/item/toy/cards/deck/cas/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let SC: Value = null, RC: Value = null;
	if (rt.istype(I, T("/obj/item/toy/cards/singlecard/cas"))) {
		SC = I;
		if (!(yield* user.temporarilyRemoveItemFromInventory(SC))) {
			to_chat(user, "<span class='warning'>The card is stuck to your hand, you can't add it to the deck!</span>");
			return f.dot;
		}
		(RC = (yield* new_(T("/datum/playingcard")))).name = `${SC.name}`;
		RC.card_icon = SC.card_face;
		this.cards += RC;
		user.visible_message(`${user} adds a card to the bottom of the deck.`, "<span class='notice'>You add the card to the bottom of the deck.</span>");
		yield* qdel(SC);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// cas.dm:94
rt.def("/obj/item/toy/cards/deck/cas/proc/update_icon", function update_icon(f: Frame) {
	if (!(rt.len(f, this.cards) < 26)) return f.dot;
	this.icon_state = `deck_${this.deckstyle}_low`;
	return f.dot;
});

rt.type(9721, "/obj/item/toy/cards/singlecard/cas", "/obj/item/toy/cards/singlecard", {
	card_face: "cas_white",
	blank: 0,
	buffertext: "A funny bit of text.",
	flipped: 0,
	name: "CAS card",
	desc: "A CAS card.",
	icon_state: "cas_white",
});

// cas.dm:108
rt.def("/obj/item/toy/cards/singlecard/cas/proc/examine", function examine(f: Frame, user: Value) {
	if (this.flipped) {
		to_chat(user, "<span class='notice'>The card is face down.</span>");
	} else if (this.blank) {
		to_chat(user, "<span class='notice'>The card is blank. Write on it with a pen.</span>");
	} else {
		to_chat(user, `<span class='notice'>The card reads: ${this.name}</span>`);
	}
	return f.dot;
});

// cas.dm:118
rt.def("/obj/item/toy/cards/singlecard/cas/Flip", function Flip(f: Frame) {
	if (!f.usr.canUseTopic(this, 1)) {
		return f.dot;
	}
	if (!this.flipped) {
		this.name = "CAS card";
	} else if (this.flipped) {
		this.name = this.buffertext;
	}
	this.flipped = (!this.flipped ? 1 : 0);
	this.update_icon();
	return f.dot;
}, false, { verb: { name: "Flip Card", category: "Object", src: 5, range: 1 } });

// cas.dm:128
rt.def("/obj/item/toy/cards/singlecard/cas/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (!user.canUseTopic(this, 1)) {
		return f.dot;
	}
	this.Flip();
	return f.dot;
});

// cas.dm:134
rt.def("/obj/item/toy/cards/singlecard/cas/proc/update_icon", function update_icon(f: Frame) {
	if (this.flipped) {
		this.icon_state = `${this.card_face}_flipped`;
	} else {
		this.icon_state = `${this.card_face}`;
	}
	return f.dot;
});

// cas.dm:139
rt.def("/obj/item/toy/cards/singlecard/cas/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let cardtext: Value = null;
	if (!rt.istype(I, T("/obj/item/weapon/pen"))) return f.dot;
	if (!this.blank) {
		to_chat(user, "You cannot write on that card.");
		return f.dot;
	}
	if (!(cardtext = (yield* stripped_input(user, "What do you wish to write on the card?", "Card Writing", "", 50)))) {
		return f.dot;
	}
	this.name = cardtext;
	this.buffertext = cardtext;
	this.blank = 0;
	return f.dot;
}, true);
