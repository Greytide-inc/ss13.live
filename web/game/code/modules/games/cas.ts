// From code/modules/games/cas.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/item/toy/cards/deck/cas/proc/<init>  (code/modules/games/cas.dm:18)
rt.def("/obj/item/toy/cards/deck/cas/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "allcards", rt.list());
	return f.dot;
});

// /obj/item/toy/cards/deck/cas/proc/New  (code/modules/games/cas.dm:32)  may sleep
rt.def("/obj/item/toy/cards/deck/cas/proc/New", function* New(f: Frame) {
	let possiblecards: Value = null, randomcards: Value = null, i: Value = null, cardtext: Value = null, _P: Value = null, x: Value = null, _P_3: Value = null;
	let $e: any;
	f.vars = () => [possiblecards, randomcards, i, cardtext, _P, x, _P_3, $e];
	rt.setSv(f, "allcards", rt.index(rt.gl("cards_against_space"), rt.sv(f, "card_face")));
	if (rt.lt(rt.getLen(f, (possiblecards = (yield* g.callName(f, rt.sv(f, "allcards"), "Copy", [])))), rt.sv(f, "decksize"))) {
		rt.setSv(f, "decksize", subtract(rt.len(f, live(possiblecards)), 1));
	}
	randomcards = rt.list();
	while (rt.lt(rt.len(f, live(randomcards)), rt.sv(f, "decksize"))) {
		randomcards = rt.modify(live(randomcards), (yield* g.call(f, P("/proc/pick_n_take"), null, [live(possiblecards)])), add);
	}
	i = null;
	rt.forRange(f, 0, 1, rt.len(f, live(randomcards)), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		cardtext = rt.index(live(randomcards), live(i));
		_P = null;
		rt.setFv(f, "name", (_P = (yield* g.new_(f, T("/datum/playingcard"), []))), fmt("＀", [live(cardtext)]));
		rt.setFv(f, "card_icon", live(_P), fmt("＀", [rt.fv(f, "card_face", live(f.src))]));
		rt.modSrcVar(f, "cards", live(_P), add);
	}
	rt.endFor(f, 0);
	if (!truthy(rt.sv(f, "blanks"))) {
		return live(f.dot);
	}
	x = null;
	rt.forRange(f, 0, 1, rt.sv(f, "blanks"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		x = $e;
		_P_3 = null;
		rt.setFv(f, "name", (_P_3 = (yield* g.new_(f, T("/datum/playingcard"), []))), "Blank Card");
		rt.setFv(f, "card_icon", live(_P_3), "cas_white");
		rt.modSrcVar(f, "cards", live(_P_3), add);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/shuffle_inplace"), null, [rt.sv(f, "cards")]);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/toy/cards/deck/cas/proc/attack_hand  (code/modules/games/cas.dm:58)  may sleep
rt.def("/obj/item/toy/cards/deck/cas/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null, choice: Value = null;
	f.vars = () => [user, H, choice];
	if (truthy(rt.fv(f, "lying", live(user)))) {
		return live(f.dot);
	}
	if (isEqual(rt.len(f, rt.sv(f, "cards")), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>There are no more cards to draw!</span>"]);
		return live(f.dot);
	}
	H = (yield* g.new_(f, T("/obj/item/toy/cards/singlecard/cas"), [rt.fv(f, "loc", live(user))]));
	if (isEqual(rt.gv(f, "name", (choice = rt.index(rt.sv(f, "cards"), 1))), "Blank Card")) {
		rt.setFv(f, "blank", live(H), 1);
	}
	rt.setFv(f, "name", live(H), rt.fv(f, "name", live(choice)));
	rt.setFv(f, "buffertext", live(H), rt.fv(f, "name", live(choice)));
	rt.setFv(f, "icon_state", live(H), rt.fv(f, "card_icon", live(choice)));
	rt.setFv(f, "card_face", live(H), rt.fv(f, "card_icon", live(choice)));
	rt.setFv(f, "parentdeck", live(H), live(f.src));
	(rt.modField(f, live(f.src), "cards", live(choice), subtract));
	yield* g.callName(f, live(H), "pickup", [live(user)]);
	yield* g.callName(f, live(user), "put_in_hands", [live(H)]);
	yield* g.callName(f, live(user), "visible_message", [fmt("＀ draws a card from the deck.", [live(user)]), "<span class='notice'>You draw a card from the deck.</span>"]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/toy/cards/deck/cas/proc/attackby  (code/modules/games/cas.dm:79)  may sleep
rt.def("/obj/item/toy/cards/deck/cas/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let SC: Value = null, RC: Value = null;
	f.vars = () => [I, user, params, SC, RC];
	if (truthy((rt.istype(live(I), T("/obj/item/toy/cards/singlecard/cas")) ? 1 : 0))) {
		SC = live(I);
		if (!truthy((yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(SC)])))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The card is stuck to your hand, you can't add it to the deck!</span>"]);
			return live(f.dot);
		}
		RC = null;
		rt.setFv(f, "name", (RC = (yield* g.new_(f, T("/datum/playingcard"), []))), fmt("＀", [rt.fv(f, "name", live(SC))]));
		rt.setFv(f, "card_icon", live(RC), rt.fv(f, "card_face", live(SC)));
		rt.modSrcVar(f, "cards", live(RC), add);
		yield* g.callName(f, live(user), "visible_message", [fmt("＀ adds a card to the bottom of the deck.", [live(user)]), "<span class='notice'>You add the card to the bottom of the deck.</span>"]);
		yield* g.call(f, P("/proc/qdel"), null, [live(SC)]);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/toy/cards/deck/cas/proc/update_icon  (code/modules/games/cas.dm:94)
rt.def("/obj/item/toy/cards/deck/cas/proc/update_icon", function update_icon(f: Frame) {
	if (!rt.lt(rt.len(f, rt.sv(f, "cards")), 26)) return f.dot;
	rt.setSv(f, "icon_state", fmt("deck_＀_low", [rt.sv(f, "deckstyle")]));
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

// /obj/item/toy/cards/singlecard/cas/proc/examine  (code/modules/games/cas.dm:108)
rt.def("/obj/item/toy/cards/singlecard/cas/proc/examine", function examine(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "flipped"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The card is face down.</span>"]);
	} else {
		if (truthy(rt.sv(f, "blank"))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>The card is blank. Write on it with a pen.</span>"]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The card reads: ＀</span>", [rt.sv(f, "name")])]);
		}
	}
	return f.dot;
});

// /obj/item/toy/cards/singlecard/cas/Flip  (code/modules/games/cas.dm:118)
rt.def("/obj/item/toy/cards/singlecard/cas/Flip", function Flip(f: Frame) {
	if (!truthy(rt.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1]))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "flipped"))) {
		rt.setSv(f, "name", "CAS card");
	} else {
		if (truthy(rt.sv(f, "flipped"))) {
			rt.setSv(f, "name", rt.sv(f, "buffertext"));
		}
	}
	rt.setSv(f, "flipped", (!truthy(rt.sv(f, "flipped")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Flip Card", category: "Object", src: 5, range: 1 } });

// /obj/item/toy/cards/singlecard/cas/proc/AltClick  (code/modules/games/cas.dm:128)
rt.def("/obj/item/toy/cards/singlecard/cas/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (!truthy(rt.callName(f, live(user), "canUseTopic", [live(f.src), 1]))) {
		return live(f.dot);
	}
	rt.callSrc(f, "Flip", []);
	return f.dot;
});

// /obj/item/toy/cards/singlecard/cas/proc/update_icon  (code/modules/games/cas.dm:134)
rt.def("/obj/item/toy/cards/singlecard/cas/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "flipped"))) {
		rt.setSv(f, "icon_state", fmt("＀_flipped", [rt.sv(f, "card_face")]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀", [rt.sv(f, "card_face")]));
	}
	return f.dot;
});

// /obj/item/toy/cards/singlecard/cas/proc/attackby  (code/modules/games/cas.dm:139)  may sleep
rt.def("/obj/item/toy/cards/singlecard/cas/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let cardtext: Value = null;
	f.vars = () => [I, user, params, cardtext];
	if (!truthy((rt.istype(live(I), T("/obj/item/weapon/pen")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.sv(f, "blank"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "You cannot write on that card."]);
		return live(f.dot);
	}
	if (!truthy((cardtext = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "What do you wish to write on the card?", "Card Writing", "", 50]))))) {
		return live(f.dot);
	}
	rt.setSv(f, "name", live(cardtext));
	rt.setSv(f, "buffertext", live(cardtext));
	rt.setSv(f, "blank", 0);
	return f.dot;
}, true);
