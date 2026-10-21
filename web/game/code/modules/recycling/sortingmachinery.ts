// From code/modules/recycling/sortingmachinery.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/structure/bigDelivery/proc/attack_hand  (code/modules/recycling/sortingmachinery.dm:12)  may sleep
rt.def("/obj/structure/bigDelivery/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_ripped.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/bigDelivery/proc/Destroy  (code/modules/recycling/sortingmachinery.dm:16)  may sleep
rt.def("/obj/structure/bigDelivery/proc/Destroy", function* Destroy(f: Frame) {
	let _T: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [_T, AM, $e];
	_T = rt.getStep(f, live(f.src), 0);
	AM = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		yield* g.callName(f, live(AM), "forceMove", [live(_T)]);
	}
	rt.endFor(f, 0);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/bigDelivery/proc/contents_explosion  (code/modules/recycling/sortingmachinery.dm:22)
rt.def("/obj/structure/bigDelivery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.callName(f, live(AM), "ex_act", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/structure/bigDelivery/proc/attackby  (code/modules/recycling/sortingmachinery.dm:26)  may sleep
rt.def("/obj/structure/bigDelivery/proc/attackby", function* attackby(f: Frame) {
	let O: Value = null, tag: Value = null, str: Value = null, WP: Value = null;
	f.vars = () => [O, tag, str, WP];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/destTagger")) ? 1 : 0))) {
		O = live(f.args[0]);
		if (!isEqual(rt.sv(f, "sortTag"), rt.fv(f, "currTag", live(O)))) {
			tag = (yield* g.call(f, P("/proc/uppertext"), null, [rt.index(rt.gl("TAGGERLOCATIONS"), rt.fv(f, "currTag", live(O)))]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>*＀*</span>", [live(tag)])]);
			rt.setSv(f, "sortTag", rt.fv(f, "currTag", live(O)));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/twobeep.ogg"), 100, 1]);
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
			if ((!truthy((str = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", live(f.args[1]), null]))])), 1, 42])))) || !truthy(rt.length(live(str))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Invalid text!</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ labels ＀ as ＀.", [live(f.args[1]), live(f.src), live(str)])]);
			rt.setSv(f, "name", fmt("＀ (＀)", [rt.sv(f, "name"), live(str)]));
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/wrapping_paper")) ? 1 : 0)) && !truthy(rt.sv(f, "giftwrapped")))) {
				if (truthy((yield* g.callName(f, (WP = live(f.args[0])), "use", [3])))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wraps the package in festive paper!", [live(f.args[1])])]);
					rt.setSv(f, "giftwrapped", 1);
					rt.setSv(f, "icon_state", fmt("gift＀", [rt.sv(f, "icon_state")]));
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need more paper!</span>"]);
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/bigDelivery/proc/relay_container_resist  (code/modules/recycling/sortingmachinery.dm:55)  may sleep
rt.def("/obj/structure/bigDelivery/proc/relay_container_resist", function* relay_container_resist(f: Frame, user: Value, O: Value) {
	let AM: Value = null;
	f.vars = () => [user, O, AM];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/atom/movable")) ? 1 : 0))) {
		yield* g.callName(f, (AM = rt.sv(f, "loc")), "relay_container_resist", [live(user), live(O)]);
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You lean on the back of ＀ and start pushing to rip the wrapping around it.</span>", [live(O)])]);
	if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, 50, "target", live(O)], rt.Args.Named)))) {
		if ((((!truthy(live(user)) || !isEqual(rt.fv(f, "stat", live(user)), 0)) || !isEqual(rt.fv(f, "loc", live(user)), live(O))) || !isEqual(rt.fv(f, "loc", live(O)), live(f.src)))) {
			return live(f.dot);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You successfully removed ＀'s wrapping !</span>", [live(O)])]);
		rt.setFv(f, "loc", live(O), rt.sv(f, "loc"));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_ripped.ogg"), 50, 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		if (!isEqual(rt.fv(f, "loc", live(user)), live(f.src))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You fail to remove ＀'s wrapping!</span>", [live(O)])]);
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

// /obj/item/smallDelivery/proc/contents_explosion  (code/modules/recycling/sortingmachinery.dm:81)
rt.def("/obj/item/smallDelivery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let AM: Value = null;
	let $e: any;
	f.vars = () => [AM, $e];
	AM = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		AM = $e;
		rt.callName(f, live(AM), "ex_act", []);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/smallDelivery/proc/attack_self  (code/modules/recycling/sortingmachinery.dm:85)  may sleep
rt.def("/obj/item/smallDelivery/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let X: Value = null, AM: Value = null;
	let $e: any;
	f.vars = () => [user, X, AM, $e];
	yield* g.callName(f, live(user), "temporarilyRemoveItemFromInventory", [live(f.src), 1]);
	X = null;
	rt.forList(f, 0, rt.sv(f, "contents"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		AM = live(X);
		yield* g.callName(f, live(user), "put_in_hands", [live(AM)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_ripped.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/smallDelivery/proc/attack_self_tk  (code/modules/recycling/sortingmachinery.dm:93)  may sleep
rt.def("/obj/item/smallDelivery/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	let M: Value = null, X: Value = null, AM: Value = null, X_0: Value = null, AM_1: Value = null;
	let $e: any;
	f.vars = () => [user, M, X, AM, X_0, AM_1, $e];
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "temporarilyRemoveItemFromInventory", [live(f.src), 1]);
		X = null;
		rt.forList(f, 0, rt.sv(f, "contents"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			AM = live(X);
			yield* g.callName(f, live(M), "put_in_hands", [live(AM)]);
		}
		rt.endFor(f, 0);
	} else {
		X_0 = null;
		rt.forList(f, 0, rt.sv(f, "contents"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X_0 = $e;
			yield* g.callName(f, (AM_1 = live(X_0)), "forceMove", [rt.fv(f, "loc", live(f.src))]);
		}
		rt.endFor(f, 0);
	}
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/poster_ripped.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/smallDelivery/proc/attackby  (code/modules/recycling/sortingmachinery.dm:107)  may sleep
rt.def("/obj/item/smallDelivery/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let O: Value = null, tag: Value = null, str: Value = null, WP: Value = null;
	f.vars = () => [W, user, params, O, tag, str, WP];
	if (truthy((rt.istype(live(W), T("/obj/item/device/destTagger")) ? 1 : 0))) {
		O = live(W);
		if (!isEqual(rt.sv(f, "sortTag"), rt.fv(f, "currTag", live(O)))) {
			tag = (yield* g.call(f, P("/proc/uppertext"), null, [rt.index(rt.gl("TAGGERLOCATIONS"), rt.fv(f, "currTag", live(O)))]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>*＀*</span>", [live(tag)])]);
			rt.setSv(f, "sortTag", rt.fv(f, "currTag", live(O)));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/twobeep.ogg"), 100, 1]);
		}
	} else {
		if (truthy((rt.istype(live(W), T("/obj/item/weapon/pen")) ? 1 : 0))) {
			if ((!truthy((str = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", live(user), null]))])), 1, 42])))) || !truthy(rt.length(live(str))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Invalid text!</span>"]);
				return live(f.dot);
			}
			yield* g.callName(f, live(user), "visible_message", [fmt("＀ labels ＀ as ＀.", [live(user), live(f.src), live(str)])]);
			rt.setSv(f, "name", fmt("＀ (＀)", [rt.sv(f, "name"), live(str)]));
		} else {
			if (!(truthy((rt.istype(live(W), T("/obj/item/stack/wrapping_paper")) ? 1 : 0)) && !truthy(rt.sv(f, "giftwrapped")))) return f.dot;
			if (truthy((yield* g.callName(f, (WP = live(W)), "use", [1])))) {
				rt.setSv(f, "icon_state", fmt("gift＀", [rt.sv(f, "icon_state")]));
				rt.setSv(f, "giftwrapped", 1);
				yield* g.callName(f, live(user), "visible_message", [fmt("＀ wraps the package in festive paper!", [live(user)])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You need more paper!</span>"]);
			}
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
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("hands_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "destination_tagger", "TagMaster 2.2", 450, 350, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// /obj/item/device/destTagger/proc/ui_data  (tg_js)
// locations: [{index, name}] in TAGGERLOCATIONS order (the index is what Topic's nextTag takes); currTag: the selected index (0 = none); current: its name.
rt.def("/obj/item/device/destTagger/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, list: Value = null, E: Value = null;
	f.vars = () => [user, data, list, E];
	data = rt.list();
	list = rt.list();
	const n = Number(rt.len(f, rt.gl("TAGGERLOCATIONS")));
	for (let i = 1; i <= n; i++) {
		E = rt.list();
		rt.setAt(live(E), "index", i);
		rt.setAt(live(E), "name", fmt("＀", [rt.index(rt.gl("TAGGERLOCATIONS"), i)]));
		rt.modify(live(list), rt.list(live(E)), add);
	}
	rt.setAt(live(data), "locations", live(list));
	rt.setAt(live(data), "currTag", truthy(rt.sv(f, "currTag")) ? rt.sv(f, "currTag") : 0);
	rt.setAt(live(data), "current", truthy(rt.sv(f, "currTag")) ? fmt("＀", [rt.index(rt.gl("TAGGERLOCATIONS"), rt.sv(f, "currTag"))]) : "None");
	return live(data);
}, true);

// /obj/item/device/destTagger/proc/ui_act  (tg_js)  may sleep
rt.def("/obj/item/device/destTagger/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "set_tag") {
		yield* g.srcCall(f, "Topic", "", rt.alist(f, ["nextTag", fmt("＀", [rt.at(live(params), "index")])]));
	} else {
		return 0;
	}
	yield* g.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/item/device/destTagger/proc/attack_self  (code/modules/recycling/sortingmachinery.dm:166)  may sleep
rt.def("/obj/item/device/destTagger/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "ui_interact", live(user));
	return live(f.dot);
}, true);

// /obj/item/device/destTagger/proc/Topic  (code/modules/recycling/sortingmachinery.dm:170)  may sleep
// tg_js: no longer reopens the page; ui_act refreshes the window.
rt.def("/obj/item/device/destTagger/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let n: Value = null;
	f.vars = () => [href, href_list, n];
	// tg_js, 2017 tg's own holes: the old-style href had no who-may-use-it check (a player anywhere could set the tag), and nextTag was taken unchecked
	// (0, negative, fractional or past the end of TAGGERLOCATIONS made ui_data runtime). Only the one holding it, and only a whole number 1..len.
	if (!isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr)) || truthy(rt.fv(f, "stat", live(f.usr))) || truthy((yield* g.callName(f, live(f.usr), "restrained", [])))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	if (truthy(rt.at(live(href_list), "nextTag"))) {
		n = live(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(href_list), "nextTag")]));
		if (typeof n === "number" && Number.isInteger(n) && n >= 1 && n <= Number(rt.len(f, rt.gl("TAGGERLOCATIONS")))) {
			rt.setSv(f, "currTag", n);
		}
	}
	return f.dot;
}, true);
