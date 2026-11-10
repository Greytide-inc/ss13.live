// Based on /tg/station's code/modules/recycling/sortingmachinery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, add } = rt;


rt.type(12989, "/obj/structure/bigDelivery", "/obj/structure", {
	giftwrapped: 0,
	sortTag: 0,
	name: "large parcel",
	desc: "A large delivery parcel.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "deliverycloset",
	density: 1,
	mouse_drag_pointer: 1,
});

// sortingmachinery.dm:12
rt.def("/obj/structure/bigDelivery/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	playsound(this.loc, rt.rsc("sound/items/poster_ripped.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// sortingmachinery.dm:16
rt.def("/obj/structure/bigDelivery/proc/Destroy", function* Destroy(f: Frame) {
	let AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (AM of each(this.contents, T("/atom/movable"))) {
		yield* AM.forceMove(_T);
	}
	return (yield* parent_proc());
}, true);

// sortingmachinery.dm:22
rt.def("/obj/structure/bigDelivery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	for (AM of each(this.contents, T("/atom/movable"))) {
		AM.ex_act();
	}
	return f.dot;
});

// sortingmachinery.dm:26
rt.def("/obj/structure/bigDelivery/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let O: Value = null, tag: Value = null, str: Value = null, WP: Value = null;
	if (rt.istype(W, T("/obj/item/device/destTagger"))) {
		O = W;
		if (this.sortTag != O.currTag) {
			tag = uppertext(rt.index(GLOB.TAGGERLOCATIONS, O.currTag));
			to_chat(user, `<span class='notice'>*${tag}*</span>`);
			this.sortTag = O.currTag;
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 100, 1);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (!(str = copytext(sanitize((yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", user, null]))), 1, 42)) || !rt.length(str)) {
			to_chat(user, "<span class='warning'>Invalid text!</span>");
			return f.dot;
		}
		user.visible_message(`${user} labels ${this} as ${str}.`);
		this.name = `${this.name} (${str})`;
	} else if (rt.istype(W, T("/obj/item/stack/wrapping_paper")) && !this.giftwrapped) {
		if (yield* (WP = W).use(3)) {
			user.visible_message(`${user} wraps the package in festive paper!`);
			this.giftwrapped = 1;
			this.icon_state = `gift${this.icon_state}`;
		} else {
			to_chat(user, "<span class='warning'>You need more paper!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// sortingmachinery.dm:55
rt.def("/obj/structure/bigDelivery/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	let AM: Value = null;
	if (rt.istype(this.loc, T("/atom/movable"))) {
		yield* (AM = this.loc).relay_container_resist(user, O);
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You lean on the back of ${O} and start pushing to rip the wrapping around it.</span>`);
	if (yield* do_after(user, 50, { target: O })) {
		if (!user || user.stat != 0 || user.loc != O || O.loc != this) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You successfully removed ${O}'s wrapping !</span>`);
		O.loc = this.loc;
		playsound(this.loc, rt.rsc("sound/items/poster_ripped.ogg"), 50, 1);
		yield* qdel(this);
	} else {
		if (user.loc != this) return f.dot;
		to_chat(user, `<span class='warning'>You fail to remove ${O}'s wrapping!</span>`);
	}
	return f.dot;
}, true);

rt.type(9861, "/obj/item/smallDelivery", "/obj/item", {
	giftwrapped: 0,
	sortTag: 0,
	name: "parcel",
	desc: "A brown paper delivery parcel.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "deliverypackage3",
});

// sortingmachinery.dm:81
rt.def("/obj/item/smallDelivery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	for (AM of each(this.contents, T("/atom/movable"))) {
		AM.ex_act();
	}
	return f.dot;
});

// sortingmachinery.dm:85
rt.def("/obj/item/smallDelivery/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, AM: Value = null;
	yield* user.temporarilyRemoveItemFromInventory(this, 1);
	for (X of each(this.contents)) {
		AM = X;
		yield* user.put_in_hands(AM);
	}
	playsound(this.loc, rt.rsc("sound/items/poster_ripped.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// sortingmachinery.dm:93
rt.def("/obj/item/smallDelivery/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	let M: Value = null, X: Value = null, AM: Value = null, X_0: Value = null, AM_1: Value = null;
	if (ismob(this.loc)) {
		yield* (M = this.loc).temporarilyRemoveItemFromInventory(this, 1);
		for (X of each(this.contents)) {
			AM = X;
			yield* M.put_in_hands(AM);
		}
	} else {
		for (X_0 of each(this.contents)) {
			yield* (AM_1 = X_0).forceMove(this.loc);
		}
	}
	playsound(this.loc, rt.rsc("sound/items/poster_ripped.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// sortingmachinery.dm:107
rt.def("/obj/item/smallDelivery/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let O: Value = null, tag: Value = null, str: Value = null, WP: Value = null;
	if (rt.istype(W, T("/obj/item/device/destTagger"))) {
		O = W;
		if (this.sortTag != O.currTag) {
			tag = uppertext(rt.index(GLOB.TAGGERLOCATIONS, O.currTag));
			to_chat(user, `<span class='notice'>*${tag}*</span>`);
			this.sortTag = O.currTag;
			playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 100, 1);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/pen"))) {
		if (!(str = copytext(sanitize((yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", user, null]))), 1, 42)) || !rt.length(str)) {
			to_chat(user, "<span class='warning'>Invalid text!</span>");
			return f.dot;
		}
		user.visible_message(`${user} labels ${this} as ${str}.`);
		this.name = `${this.name} (${str})`;
	} else {
		if (!(rt.istype(W, T("/obj/item/stack/wrapping_paper")) && !this.giftwrapped)) return f.dot;
		if (yield* (WP = W).use(1)) {
			this.icon_state = `gift${this.icon_state}`;
			this.giftwrapped = 1;
			user.visible_message(`${user} wraps the package in festive paper!`);
		} else {
			to_chat(user, "<span class='warning'>You need more paper!</span>");
		}
	}
	return f.dot;
}, true);

rt.type(9429, "/obj/item/device/destTagger", "/obj/item/device", {
	currTag: 0,
	flags: 64,
	name: "destination tagger",
	desc: "Used to set the destination of properly wrapped packages.",
	icon_state: "cargotagger",
	w_class: 1,
	item_state: "electronic",
	slot_flags: 512,
});

// /obj/item/device/destTagger/proc/ui_interact  (tg_js, after modern tg's DestinationTagger)  may sleep
// Replaces the old openwindow HTML page. hands_state: the tagger has to stay in the user's hands.
rt.def("/obj/item/device/destTagger/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "destination_tagger", "TagMaster 2.2", 450, 350, master_ui, state))).open();
	return f.dot;
}, true);

// /obj/item/device/destTagger/proc/ui_data  (tg_js)
// locations: [{index, name}] in TAGGERLOCATIONS order (the index is what Topic's nextTag takes); currTag: the selected index (0 = none); current: its name.
rt.def("/obj/item/device/destTagger/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let E: Value = null;
	let data: Value = rt.list();
	let list: Value = rt.list();
	const n = Number(rt.len(f, GLOB.TAGGERLOCATIONS));
	for (let i = 1; i <= n; i++) {
		E = rt.list();
		rt.setAt(E, "index", i);
		rt.setAt(E, "name", `${rt.index(GLOB.TAGGERLOCATIONS, i)}`);
		rt.modify(list, rt.list(E), add);
	}
	rt.setAt(data, "locations", list);
	rt.setAt(data, "currTag", this.currTag ? this.currTag : 0);
	rt.setAt(data, "current", this.currTag ? `${rt.index(GLOB.TAGGERLOCATIONS, this.currTag)}` : "None");
	return data;
}, true);

// Added by tg_js.
rt.def("/obj/item/device/destTagger/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "set_tag") {
		yield* this.Topic("", rt.alist(f, ["nextTag", `${rt.at(params, "index")}`]));
	} else {
		return 0;
	}
	GLOB.SStgui.update_uis(this);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// sortingmachinery.dm:166
rt.def("/obj/item/device/destTagger/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// sortingmachinery.dm:170
// tg_js: no longer reopens the page; ui_act refreshes the window.
rt.def("/obj/item/device/destTagger/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let n: Value = null;
	// tg_js, 2017 tg's own holes: the old-style href had no who-may-use-it check (a player anywhere could set the tag), and nextTag was taken unchecked
	// (0, negative, fractional or past the end of TAGGERLOCATIONS made ui_data runtime). Only the one holding it, and only a whole number 1..len.
	if (this.loc != f.usr || f.usr.stat || f.usr.restrained()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	if (rt.at(href_list, "nextTag")) {
		n = text2num(rt.at(href_list, "nextTag"));
		if (typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= Number(rt.len(f, GLOB.TAGGERLOCATIONS))) {
			this.currTag = n;
		}
	}
	return f.dot;
}, true);
