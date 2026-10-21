// From code/game/objects/items/devices/PDA/PDA.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalPDAs  (code/game/objects/items/devices/PDA/PDA.dm:4)
rt.def("/datum/controller/global_vars/proc/InitGlobalPDAs", function InitGlobalPDAs(f: Frame) {
	rt.setGl("PDAs", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "PDAs", add);
	return f.dot;
});

rt.type(9297, "/obj/item/device/pda", "/obj/item/device", {
	owner: null,
	default_cartridge: 0,
	cartridge: null,
	mode: 0,
	icon_alert: "pda-r",
	scanmode: 0,
	fon: 0,
	f_lum: 3,
	silent: 0,
	toff: 0,
	tnote: null,
	msglog: null,
	chat_target: null,
	chat_name: null,
	last_text: null,
	last_noise: null,
	ttone: "beep",
	lock_code: "",
	honkamt: 0,
	mimeamt: 0,
	note: "Congratulations, your station has chosen the Thinktronic 5230 Personal Data Assistant!",
	notehtml: "",
	notescanned: 0,
	detonatable: 1,
	hidden: 0,
	emped: 0,
	id: null,
	ownjob: null,
	pai: null,
	photo: null,
	inserted_item: null,
	overlays_x_offset: 0,
	contained_item: null,
	flags: 4,
	name: "１PDA",
	desc: "A portable microcomputer by Thinktronic Systems, LTD. Functionality determined by a preprogrammed ROM cartridge.",
	icon: rt.rsc("icons/obj/pda.dmi"),
	icon_state: "pda",
	item_state: "electronic",
	w_class: 1,
	slot_flags: 768,
	origin_tech: "programming=2",
	armor: null,
	resistance_flags: 34,
});

// /obj/item/device/pda/proc/<init>  (code/game/objects/items/devices/PDA/PDA.dm:17)
rt.def("/obj/item/device/pda/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	$0 = $0;
	rt.setSv(f, "contained_item", rt.list(T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/lipstick"), T("/obj/item/device/flashlight/pen"), T("/obj/item/clothing/mask/cigarette")));
	return f.dot;
});

// /obj/item/device/pda/proc/Initialize  (code/game/objects/items/devices/PDA/PDA.dm:60)  may sleep
rt.def("/obj/item/device/pda/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(rt.sv(f, "fon"))) {
		yield* g.srcCall(f, "set_light", rt.sv(f, "f_lum"));
	}
	rt.modGl("PDAs", live(f.src), add);
	if (truthy(rt.sv(f, "default_cartridge"))) {
		rt.setSv(f, "cartridge", (yield* g.new_(f, rt.sv(f, "default_cartridge"), [live(f.src)])));
		// tg_js fix (2017 tg bug): atom/New passes `mapload` as Initialize's first argument, so a default cartridge never learned its PDA and its apps showed nothing
		rt.setFv(f, "host_pda", rt.sv(f, "cartridge"), live(f.src));
	}
	if (truthy(rt.sv(f, "inserted_item"))) {
		rt.setSv(f, "inserted_item", (yield* g.new_(f, rt.sv(f, "inserted_item"), [live(f.src)])));
	} else {
		rt.setSv(f, "inserted_item", (yield* g.new_(f, T("/obj/item/weapon/pen"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/pda/proc/update_label  (code/game/objects/items/devices/PDA/PDA.dm:74)
rt.def("/obj/item/device/pda/proc/update_label", function update_label(f: Frame) {
	rt.setSv(f, "name", fmt("PDA-＀ (＀)", [rt.sv(f, "owner"), rt.sv(f, "ownjob")]));
	return f.dot;
});

// /obj/item/device/pda/proc/GetAccess  (code/game/objects/items/devices/PDA/PDA.dm:78)
rt.def("/obj/item/device/pda/proc/GetAccess", function GetAccess(f: Frame) {
	if (truthy(rt.sv(f, "id"))) {
		return rt.callName(f, rt.sv(f, "id"), "GetAccess", []);
	}
	return rt.callSuper(f, [], rt.Args.Same);
});

// /obj/item/device/pda/proc/update_icon  (code/game/objects/items/devices/PDA/PDA.dm:86)
rt.def("/obj/item/device/pda/proc/update_icon", function update_icon(f: Frame) {
	let overlay: Value = null;
	f.vars = () => [overlay];
	rt.callSrc(f, "cut_overlays", []);
	rt.setFv(f, "pixel_x", (overlay = rt.new_(f, T("/mutable_appearance"), [])), rt.sv(f, "overlays_x_offset"));
	if (truthy(rt.sv(f, "id"))) {
		rt.setFv(f, "icon_state", live(overlay), "id_overlay");
		rt.callSrc(f, "add_overlay", [rt.new_(f, T("/mutable_appearance"), [live(overlay)])]);
	}
	if (truthy(rt.sv(f, "inserted_item"))) {
		rt.setFv(f, "icon_state", live(overlay), "insert_overlay");
		rt.callSrc(f, "add_overlay", [rt.new_(f, T("/mutable_appearance"), [live(overlay)])]);
	}
	if (truthy(rt.sv(f, "fon"))) {
		rt.setFv(f, "icon_state", live(overlay), "light_overlay");
		rt.callSrc(f, "add_overlay", [rt.new_(f, T("/mutable_appearance"), [live(overlay)])]);
	}
	if (!truthy(rt.sv(f, "pai"))) return f.dot;
	if (truthy(rt.fv(f, "pai", rt.sv(f, "pai")))) {
		rt.setFv(f, "icon_state", live(overlay), "pai_overlay");
		rt.callSrc(f, "add_overlay", [rt.new_(f, T("/mutable_appearance"), [live(overlay)])]);
	} else {
		rt.setFv(f, "icon_state", live(overlay), "pai_off_overlay");
		rt.callSrc(f, "add_overlay", [rt.new_(f, T("/mutable_appearance"), [live(overlay)])]);
	}
	return f.dot;
});

// /obj/item/device/pda/proc/MouseDrop  (code/game/objects/items/devices/PDA/PDA.dm:107)  may sleep
rt.def("/obj/item/device/pda/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let M: Value = null;
	f.vars = () => [over_object, src_location, over_location, M];
	M = live(f.usr);
	if ((!truthy((rt.istype(live(over_object), T("/obj/screen")) ? 1 : 0)) && truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))))) {
		return (yield* g.srcCall(f, "attack_self", live(M)));
	}
	return live(f.dot);
}, true);

// tg_js: the PDA window is the `pda` tgui (tgui/src/interfaces/pda.ract) instead of a browse() page. The helpers below build the
// lists ui_data sends; every button goes back through the old Topic (see ui_act), so all of its rules stay in one place.
function pdaRow(out: Value, pairs: any) {
	const E = rt.list();
	for (let i = 0; i < pairs.length; i += 2) rt.setAt(live(E), pairs[i], pairs[i + 1]);
	rt.modify(live(out), rt.list(live(E)), add);
	return E;
}
function pdaApp(items: Value, name: any, choice: any) {
	pdaRow(items, ["name", name, "choice", choice]);
}
function pdaSection(secs: Value, title: any) {
	const items = rt.list();
	pdaRow(secs, ["title", title, "items", items]);
	return items;
}
function pdaAcc(f: Frame, cart: Value, bit: any) {
	return truthy(live(cart)) && truthy(rt.bitAnd(rt.fv(f, "access", live(cart)), bit));
}

// /obj/item/device/pda/proc/attack_self  (code/game/objects/items/devices/PDA/PDA.dm:113)  may sleep
rt.def("/obj/item/device/pda/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if ((truthy(rt.sv(f, "hidden_uplink")) && truthy(rt.fv(f, "active", rt.sv(f, "hidden_uplink"))))) {
		yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(user)]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "ui_interact", live(user));
	return f.dot;
}, true);

// /obj/item/device/pda/proc/ui_interact  (tg_js, after modern tg's PDA)  may sleep
rt.def("/obj/item/device/pda/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	f.vars = () => [user, ui_key, ui, force_open, master_ui, state];
	if (live(ui_key) === null) {
		ui_key = "main";
	}
	if (live(force_open) === null) {
		force_open = 0;
	}
	if (live(state) === null) {
		state = rt.gl("inventory_state");
	}
	if (truthy((ui = (yield* g.callName(f, rt.gl("SStgui"), "try_update_ui", [live(user), live(f.src), live(ui_key), live(ui), live(force_open)]))))) return f.dot;
	yield* g.callName(f, (ui = (yield* g.new_(f, T("/datum/tgui"), [live(user), live(f.src), live(ui_key), "pda", "Personal Data Assistant", 500, 600, live(master_ui), live(state)]))), "open", []);
	return f.dot;
}, true);

// the window title for each screen (tgui.ract shows data.ui_title over config.title)
const PDA_TITLES: Record<number, string> = {0: "PDA Main Menu", 1: "Notekeeper", 2: "Messenger", 21: "Messages", 3: "Atmospheric Scan", 41: "Crew Manifest"};

// /obj/item/device/pda/proc/ui_data  (tg_js)  may sleep
// mode: 0 menu, 1 notes, 2 messenger, 21 message log, 3 atmos scan, 41 crew manifest, anything else = a cartridge app (cart_html, the old HTML).
rt.def("/obj/item/device/pda/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let data: Value = null, cart: Value = null, secs: Value = null, items: Value = null, mode: Value = null, _P: Value = null, E: Value = null, list: Value = null, _T: Value = null, environment: Value = null, env_gases: Value = null, total_moles: Value = null, id: Value = null, gas_level: Value = null;
	let $e: any;
	f.vars = () => [user, data, cart, secs, items, mode, _P, E, list, _T, environment, env_gases, total_moles, id, gas_level, $e];
	data = rt.list();
	cart = rt.sv(f, "cartridge");
	mode = rt.sv(f, "mode");
	rt.setAt(live(data), "mode", live(mode));
	rt.setAt(live(data), "owner", rt.sv(f, "owner"));
	rt.setAt(live(data), "ownjob", rt.sv(f, "ownjob"));
	rt.setAt(live(data), "has_id", truthy(rt.sv(f, "id")) ? 1 : 0);
	rt.setAt(live(data), "id_name", truthy(rt.sv(f, "id")) ? fmt("＀, ＀", [rt.fv(f, "registered_name", rt.sv(f, "id")), rt.fv(f, "assignment", rt.sv(f, "id"))]) : null);
	rt.setAt(live(data), "pen", truthy(rt.sv(f, "inserted_item")) ? fmt("＀", [rt.sv(f, "inserted_item")]) : null);
	rt.setAt(live(data), "cartridge", truthy(live(cart)) ? fmt("＀", [live(cart)]) : null);
	rt.setAt(live(data), "fon", truthy(rt.sv(f, "fon")) ? 1 : 0);
	rt.setAt(live(data), "silent", truthy(rt.sv(f, "silent")) ? 1 : 0);
	rt.setAt(live(data), "toff", truthy(rt.sv(f, "toff")) ? 1 : 0);
	rt.setAt(live(data), "ttone", rt.sv(f, "ttone"));
	rt.setAt(live(data), "scanmode", rt.sv(f, "scanmode"));
	rt.setAt(live(data), "time", (yield* g.call(f, P("/proc/worldtime2text"), null, [])));
	rt.setAt(live(data), "ui_title", PDA_TITLES[live(mode)] ?? "Personal Data Assistant");
	if (!truthy(rt.sv(f, "owner"))) {
		return live(data);
	}
	if (isEqual(live(mode), 0)) {
		secs = rt.list();
		items = pdaSection(secs, "General Functions");
		pdaApp(items, "Notekeeper", "1");
		pdaApp(items, "Messenger", "2");
		if (pdaAcc(f, cart, 32)) {
			pdaApp(items, "Honk Synthesizer", "Honk");
			pdaApp(items, "Sad Trombone", "Trombone");
		}
		if (pdaAcc(f, cart, 16)) pdaApp(items, "View Crew Manifest", "41");
		if (pdaAcc(f, cart, 2048)) pdaApp(items, "Set Status Display", "42");
		if (pdaAcc(f, cart, 2)) pdaApp(pdaSection(secs, "Engineering Functions"), "Power Monitor", "43");
		if (pdaAcc(f, cart, 8)) {
			items = pdaSection(secs, "Medical Functions");
			pdaApp(items, "Medical Records", "44");
			pdaApp(items, (isEqual(rt.sv(f, "scanmode"), 1) ? "Disable" : "Enable") + " Medical Scanner", "Medical Scan");
		}
		if (pdaAcc(f, cart, 1)) pdaApp(pdaSection(secs, "Security Functions"), "Security Records", "45");
		if (pdaAcc(f, cart, 4096)) pdaApp(pdaSection(secs, "Quartermaster Functions"), "Supply Records", "47");
		items = pdaSection(secs, "Utilities");
		if (truthy(live(cart))) {
			if (truthy(rt.fv(f, "bot_access_flags", live(cart)))) pdaApp(items, "Bots Access", "54");
			if (pdaAcc(f, cart, 128)) pdaApp(items, "Custodial Locator", "49");
			if (truthy((rt.istype(rt.fv(f, "radio", live(cart)), T("/obj/item/radio/integrated/signal")) ? 1 : 0))) pdaApp(items, "Signaler System", "40");
			if (pdaAcc(f, cart, 512)) pdaApp(items, "Newscaster Access", "53");
			if (pdaAcc(f, cart, 256)) pdaApp(items, (isEqual(rt.sv(f, "scanmode"), 3) ? "Disable" : "Enable") + " Reagent Scanner", "Reagent Scan");
			if (pdaAcc(f, cart, 2)) pdaApp(items, (isEqual(rt.sv(f, "scanmode"), 4) ? "Disable" : "Enable") + " Halogen Counter", "Halogen Counter");
			if (pdaAcc(f, cart, 4)) pdaApp(items, (isEqual(rt.sv(f, "scanmode"), 5) ? "Disable" : "Enable") + " Gas Scanner", "Gas Scan");
			if (pdaAcc(f, cart, 1024)) pdaApp(items, "Toggle Remote Door", "Toggle Door");
			if (pdaAcc(f, cart, 16384)) pdaApp(items, "Drone Phone", "Drone Phone");
		}
		pdaApp(items, "Atmospheric Scan", "3");
		pdaApp(items, (truthy(rt.sv(f, "fon")) ? "Disable" : "Enable") + " Flashlight", "Light");
		if (truthy(rt.sv(f, "pai"))) {
			if (!isEqual(rt.fv(f, "loc", rt.sv(f, "pai")), live(f.src))) {
				rt.setSv(f, "pai", null);
				yield* g.srcCall(f, "update_icon");
			} else {
				pdaApp(items, "pAI Device Configuration", "pai;1");
				pdaApp(items, "Eject pAI Device", "pai;2");
			}
		}
		rt.setAt(live(data), "sections", live(secs));
	} else if (isEqual(live(mode), 1)) {
		rt.setAt(live(data), "note", rt.sv(f, "note"));
		rt.setAt(live(data), "notehtml", rt.sv(f, "notehtml"));
		rt.setAt(live(data), "notescanned", truthy(rt.sv(f, "notescanned")) ? 1 : 0);
	} else if (isEqual(live(mode), 2) || isEqual(live(mode), 21)) {
		if (isEqual(live(mode), 21)) {
			const chat = rt.sv(f, "chat_target");
			rt.setAt(live(data), "msgs", rt.callSrc(f, "chat_messages", []));
			rt.setAt(live(data), "chat_target", chat);
			rt.setAt(live(data), "chat_name", chat === null ? null : rt.sv(f, "chat_name"));
		}
		if (truthy(live(cart))) {
			rt.setAt(live(data), "message_header", (yield* g.callName(f, live(cart), "message_header", [])));
		}
		list = rt.list();
		if (isEqual(live(mode), 2) && !truthy(rt.sv(f, "toff"))) {
			_P = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortNames"), null, [(yield* g.call(f, P("/proc/get_viewable_pdas"), null, []))])), T("/obj/item/device/pda"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				if (isEqual(live(_P), live(f.src))) {
					continue;
				}
				E = pdaRow(list, ["name", fmt("＀", [live(_P)]), "target", fmt("＃", [live(_P)])]);
				if (truthy(live(cart))) {
					rt.setAt(live(E), "special", (yield* g.callName(f, live(cart), "message_special", [live(_P)])));
				}
			}
			rt.endFor(f, 0);
		}
		rt.setAt(live(data), "pdas", live(list));
		rt.setAt(live(data), "can_all", (truthy(live(cart)) && truthy(rt.fv(f, "spam_enabled", live(cart)))) ? 1 : 0);
	} else if (isEqual(live(mode), 3)) {
		list = rt.list();
		_T = rt.fv(f, "loc", live(user));
		if (_T !== null) {
			environment = (yield* g.callName(f, live(_T), "return_air", []));
			env_gases = rt.fv(f, "gases", live(environment));
			total_moles = (yield* g.callName(f, live(environment), "total_moles", []));
			rt.setAt(live(data), "pressure", (yield* g.call(f, P("/proc/round"), null, [(yield* g.callName(f, live(environment), "return_pressure", [])), 0.10000000149011612])));
			rt.setAt(live(data), "temperature", (yield* g.call(f, P("/proc/round"), null, [subtract(rt.fv(f, "temperature", live(environment)), 273.1499938964844)])));
			if (truthy(live(total_moles))) {
				id = null;
				rt.forList(f, 0, live(env_gases));
				while (($e = rt.next(f, 0)) !== undefined) {
					id = $e;
					gas_level = divide(rt.index(rt.index(live(env_gases), live(id)), 1), live(total_moles));
					if (rt.gt(live(gas_level), 0)) {
						pdaRow(list, ["name", rt.index(rt.index(rt.index(live(env_gases), live(id)), 3), 2), "pct", (yield* g.call(f, P("/proc/round"), null, [multiply(live(gas_level), 100), 0.009999999776482582]))]);
					}
				}
				rt.endFor(f, 0);
			}
		}
		rt.setAt(live(data), "gases", live(list));
	} else if (isEqual(live(mode), 41)) {
		list = rt.list();
		if (truthy(rt.fv(f, "general", rt.gl("data_core")))) {
			_P = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/sortRecord"), null, [rt.fv(f, "general", rt.gl("data_core"))])), T("/datum/data/record"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_P = $e;
				pdaRow(list, ["name", rt.index(rt.fv(f, "fields", live(_P)), "name"), "rank", rt.index(rt.fv(f, "fields", live(_P)), "rank")]);
			}
			rt.endFor(f, 0);
		}
		rt.setAt(live(data), "manifest", live(list));
	} else if (truthy(live(cart))) {
		// a cartridge app: the cartridge builds the data for its screen (cart_data in cart.ts)
		E = (yield* g.callName(f, live(cart), "cart_data", [live(user)]));
		rt.setAt(live(data), "cart", live(E));
	}
	return live(data);
}, true);

// /obj/item/device/pda/proc/ui_act  (tg_js)  may sleep
// "choice" is one old Topic choice (params: choice, target); the rest are the few things Topic has no choice for.
rt.def("/obj/item/device/pda/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	f.vars = () => [action, params, ui, state];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	if (action === "choice") {
		if (isEqual(rt.at(live(params), "choice"), "pai;1")) {
			yield* g.srcCall(f, "Topic", "", rt.alist(f, ["choice", "pai", "option", "1"]));
		} else if (isEqual(rt.at(live(params), "choice"), "pai;2")) {
			yield* g.srcCall(f, "Topic", "", rt.alist(f, ["choice", "pai", "option", "2"]));
		} else {
			yield* g.srcCall(f, "Topic", "", rt.alist(f, ["choice", rt.at(live(params), "choice"), "target", rt.at(live(params), "target")]));
		}
	} else if (action === "cart") {
		// a cartridge app button: params are the old href_list, sent to the cartridge's own Topic
		if (rt.sv(f, "cartridge") !== null) {
			yield* g.callName(f, rt.sv(f, "cartridge"), "Topic", [null, live(params)]);
		}
	} else if (action === "remove_pen") {
		yield* g.srcCall(f, "remove_pen");
	} else {
		return 0;
	}
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// /obj/item/device/pda/proc/Topic  (code/game/objects/items/devices/PDA/PDA.dm:295)  may sleep
rt.def("/obj/item/device/pda/proc/Topic", function* Topic(f: Frame) {
	let U: Value = null, A: Value = null, alert_s: Value = null, msg: Value = null, n: Value = null, t: Value = null, _P: Value = null, M: Value = null, _T: Value = null;
	let $0: any, $e: any;
	f.vars = () => [U, A, alert_s, msg, n, t, _P, M, _T, $0, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	U = live(f.usr);
	if ((truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))) && !truthy(rt.at(live(f.args[1]), "close")))) {
		yield* g.srcCall(f, "add_fingerprint", live(U));
		yield* g.callName(f, live(U), "set_machine", [live(f.src)]);
		$0 = rt.at(live(f.args[1]), "choice");
		if ($0 === "Refresh") {
		} else if ($0 === "Return") {
			if (rt.le(rt.sv(f, "mode"), 9)) {
				rt.setSv(f, "mode", 0);
			} else if (isEqual(rt.sv(f, "mode"), 99)) {
				// tg_js fix (2017 tg bug): 99 is the newscaster's "channel locked" page, so go back to the newscaster (53), not round(99/10) = a blank page.
				rt.setSv(f, "mode", 53);
			} else {
				rt.setSv(f, "mode", (yield* g.call(f, P("/proc/round"), null, [divide(rt.sv(f, "mode"), 10)])));
				if ((isEqual(rt.sv(f, "mode"), 4) || isEqual(rt.sv(f, "mode"), 5))) {
					rt.setSv(f, "mode", 0);
				}
			}
		} else if ($0 === "Authenticate") {
			yield* g.srcCall(f, "id_check", live(U));
		} else if ($0 === "UpdateInfo") {
			// tg_js fix (2017 tg bug): the href with no ID in the PDA read null.assignment (a runtime); the button only shows with an ID.
			if (rt.sv(f, "id") === null) {
				return live(f.dot);
			}
			rt.setSv(f, "ownjob", rt.fv(f, "assignment", rt.sv(f, "id")));
			if (truthy((rt.istype(rt.sv(f, "id"), T("/obj/item/weapon/card/id/syndicate")) ? 1 : 0))) {
				rt.setSv(f, "owner", rt.fv(f, "registered_name", rt.sv(f, "id")));
			}
			yield* g.srcCall(f, "update_label");
		} else if ($0 === "Eject") {
			if (rt.sv(f, "cartridge") !== null) {
				yield* g.callName(f, live(U), "put_in_hands", [rt.sv(f, "cartridge")]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(U), fmt("<span class='notice'>You remove ＀ from ＀.</span>", [rt.sv(f, "cartridge"), live(f.src)])]);
				rt.setSv(f, "scanmode", 0);
				rt.setFv(f, "host_pda", rt.sv(f, "cartridge"), null);
				rt.setSv(f, "cartridge", null);
				yield* g.srcCall(f, "update_icon");
			}
		} else if ($0 === "0") {
			rt.setSv(f, "mode", 0);
		} else if ($0 === "1") {
			rt.setSv(f, "mode", 1);
		} else if ($0 === "2") {
			rt.setSv(f, "mode", 2);
		} else if ($0 === "21") {
			rt.setSv(f, "mode", 21);
			rt.setSv(f, "chat_target", null);
		} else if ($0 === "Chat") {
			// tg_js: the Messages screen showing only the messages between this PDA and one other
			_P = rt.locateIn(f, rt.at(live(f.args[1]), "target"), rt.world());
			if (truthy((rt.istype(live(_P), T("/obj/item/device/pda")) ? 1 : 0))) {
				rt.setSv(f, "mode", 21);
				rt.setSv(f, "chat_target", fmt("＃", [live(_P)]));
				rt.setSv(f, "chat_name", fmt("＀ (＀)", [rt.fv(f, "owner", live(_P)), rt.fv(f, "ownjob", live(_P))]));
			}
		} else if ($0 === "3") {
			rt.setSv(f, "mode", 3);
		} else if ($0 === "4") {
			rt.setSv(f, "mode", 0);
		} else if ($0 === "Light") {
			if (truthy(rt.sv(f, "fon"))) {
				rt.setSv(f, "fon", 0);
				yield* g.srcCall(f, "set_light", 0);
			} else {
				rt.setSv(f, "fon", 1);
				yield* g.srcCall(f, "set_light", 2.299999952316284);
			}
			yield* g.srcCall(f, "update_icon");
		} else if ($0 === "Medical Scan") {
			if (isEqual(rt.sv(f, "scanmode"), 1)) {
				rt.setSv(f, "scanmode", 0);
			} else {
				if ((rt.sv(f, "cartridge") !== null && truthy(rt.bitAnd(rt.fv(f, "access", rt.sv(f, "cartridge")), 8)))) {
					rt.setSv(f, "scanmode", 1);
				}
			}
		} else if ($0 === "Reagent Scan") {
			if (isEqual(rt.sv(f, "scanmode"), 3)) {
				rt.setSv(f, "scanmode", 0);
			} else {
				if ((rt.sv(f, "cartridge") !== null && truthy(rt.bitAnd(rt.fv(f, "access", rt.sv(f, "cartridge")), 256)))) {
					rt.setSv(f, "scanmode", 3);
				}
			}
		} else if ($0 === "Halogen Counter") {
			if (isEqual(rt.sv(f, "scanmode"), 4)) {
				rt.setSv(f, "scanmode", 0);
			} else {
				if ((rt.sv(f, "cartridge") !== null && truthy(rt.bitAnd(rt.fv(f, "access", rt.sv(f, "cartridge")), 2)))) {
					rt.setSv(f, "scanmode", 4);
				}
			}
		} else if ($0 === "Honk") {
			if (!(truthy(rt.sv(f, "last_noise")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_noise"), 20)))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 50, 1]);
				rt.setSv(f, "last_noise", rt.worldTime(f));
			}
		} else if ($0 === "Trombone") {
			if (!(truthy(rt.sv(f, "last_noise")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_noise"), 20)))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/misc/sadtrombone.ogg"), 50, 1]);
				rt.setSv(f, "last_noise", rt.worldTime(f));
			}
		} else if ($0 === "Gas Scan") {
			if (isEqual(rt.sv(f, "scanmode"), 5)) {
				rt.setSv(f, "scanmode", 0);
			} else {
				if ((rt.sv(f, "cartridge") !== null && truthy(rt.bitAnd(rt.fv(f, "access", rt.sv(f, "cartridge")), 4)))) {
					rt.setSv(f, "scanmode", 5);
				}
			}
		} else if ($0 === "Drone Phone") {
			A = (yield* g.call(f, P("/proc/get_area"), null, [live(U)]));
			alert_s = (yield* g.op(f, "Prompt", [1], [null, "Ping Drones", "Alert severity level", live(U), rt.list("Low", "Medium", "High", "Critical")]));
			if ((truthy(live(A)) && truthy(live(alert_s)))) {
				yield* g.call(f, P("/proc/_alert_drones"), null, [(msg = fmt("<span class='boldnotice'>NON-DRONE PING: ＀: ＀ priority alert in ＀!</span>", [rt.fv(f, "name", live(U)), live(alert_s), rt.fv(f, "name", live(A))])), 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(U), live(msg)]);
			}
		} else if ($0 === "Edit") {
			n = (yield* g.call(f, P("/proc/stripped_multiline_input"), null, [live(U), "Please enter message", rt.sv(f, "name"), rt.sv(f, "note")]));
			if ((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(U)])), 1) && isEqual(rt.sv(f, "loc"), live(U)))) {
				if ((isEqual(rt.sv(f, "mode"), 1) && truthy(live(n)))) {
					rt.setSv(f, "note", live(n));
					rt.setSv(f, "notehtml", (yield* g.call(f, P("/proc/parsepencode"), null, [live(n), live(U), "Times New Roman"])));
					rt.setSv(f, "notescanned", 0);
				}
			} else {
				rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
				return live(f.dot);
			}
		} else if ($0 === "Toggle Messenger") {
			rt.setSv(f, "toff", (!truthy(rt.sv(f, "toff")) ? 1 : 0));
		} else if ($0 === "Toggle Ringer") {
			rt.setSv(f, "silent", (!truthy(rt.sv(f, "silent")) ? 1 : 0));
		} else if ($0 === "Clear") {
			rt.setSv(f, "tnote", null);
			rt.setSv(f, "msglog", null);
		} else if ($0 === "Ringtone") {
			t = (yield* g.op(f, "Prompt", [2], [rt.sv(f, "ttone"), rt.sv(f, "name"), "Please enter new ringtone", live(U), null]));
			if (((rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(U)])), 1) && isEqual(rt.sv(f, "loc"), live(U))) && truthy(live(t)))) {
				if ((truthy(rt.sv(f, "hidden_uplink")) && isEqual((yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/lowertext"), null, [live(t)]))])), (yield* g.call(f, P("/proc/trim"), null, [(yield* g.call(f, P("/proc/lowertext"), null, [rt.sv(f, "lock_code")]))]))))) {
					yield* g.callName(f, rt.sv(f, "hidden_uplink"), "interact", [live(U)]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(U), "The PDA softly beeps."]);
					rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
					rt.setFv(f, "mode", live(f.src), 0);
				} else {
					rt.setSv(f, "ttone", (t = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [live(t)])), 1, 20]))));
				}
			} else {
				rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
				return live(f.dot);
			}
		} else if ($0 === "Message") {
			_P = rt.locateIn(f, rt.at(live(f.args[1]), "target"), rt.world());
			yield* g.callName(f, live(f.src), "create_message", [live(U), live(_P)]);
		} else if ($0 === "MessageAll") {
			yield* g.callName(f, live(f.src), "send_to_all", [live(U)]);
		} else if ($0 === "cart") {
			if (truthy(rt.sv(f, "cartridge"))) {
				yield* g.callName(f, rt.sv(f, "cartridge"), "special", [live(U), live(f.args[1])]);
			} else {
				rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
				return live(f.dot);
			}
		} else if ($0 === "Toggle Door") {
			if ((truthy(rt.sv(f, "cartridge")) && truthy(rt.bitAnd(rt.fv(f, "access", rt.sv(f, "cartridge")), 1024)))) {
				M = null;
				rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/door/poddoor"));
				while (($e = rt.next(f, 0)) !== undefined) {
					M = $e;
					if (isEqual(rt.fv(f, "id", live(M)), rt.fv(f, "remote_door_id", rt.sv(f, "cartridge")))) {
						if (truthy(rt.fv(f, "density", live(M)))) {
							yield* g.callName(f, live(M), "open", []);
						} else {
							yield* g.callName(f, live(M), "close", []);
						}
					}
				}
				rt.endFor(f, 0);
			}
		} else if ($0 === "pai") {
			$0 = rt.at(live(f.args[1]), "option");
			if ($0 === "1") {
				yield* g.callName(f, rt.sv(f, "pai"), "attack_self", [live(U)]);
			} else if ($0 === "2") {
				if (truthy((_T = rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)))) {
					rt.setFv(f, "loc", rt.sv(f, "pai"), live(_T));
				}
			}
		} else {
			// tg_js fix (2017 tg bug): any other choice went text2num'd straight into mode, so a made-up href left it null, negative or fractional. Only a page number (a whole number 0..999) is taken.
			_T = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "choice")]));
			if (typeof live(_T) === "number" && Number.isInteger(live(_T)) && live(_T) >= 0 && live(_T) <= 999) {
				rt.setSv(f, "mode", live(_T));
			}
		}
	} else {
		yield* g.callName(f, live(U), "unset_machine", []);
		rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "mode"), 2) || isEqual(rt.sv(f, "mode"), 21))) {
		yield* g.srcCall(f, "update_icon");
	}
	if ((rt.gt(rt.sv(f, "honkamt"), 0) && truthy(rt.op(f, "Prob", [], [60])))) {
		rt.incSrcVar(f, "honkamt", -1, true);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/bikehorn.ogg"), 30, 1]);
	}
	if ((isEqual(rt.fv(f, "machine", live(U)), live(f.src)) && !isEqual(rt.at(live(f.args[1]), "skiprefresh"), "1"))) {
		yield* g.srcCall(f, "attack_self", live(U));
	} else {
		yield* g.callName(f, live(U), "unset_machine", []);
		rt.op(f, "Browse", [], [live(U), null, "window=pda"], false);
	}
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/item/device/pda/proc/remove_id  (code/game/objects/items/devices/PDA/PDA.dm:492)  may sleep
rt.def("/obj/item/device/pda/proc/remove_id", function* remove_id(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!truthy(rt.sv(f, "id"))) return f.dot;
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "put_in_hands", [rt.sv(f, "id")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You remove the ID from the ＀.</span>", [rt.sv(f, "name")])]);
	} else {
		rt.setFv(f, "loc", rt.sv(f, "id"), rt.getStep(f, live(f.src), 0));
	}
	rt.setSv(f, "id", null);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/pda/proc/msg_input  (code/game/objects/items/devices/PDA/PDA.dm:502)  may sleep
rt.def("/obj/item/device/pda/proc/msg_input", function* msg_input(f: Frame, U: Value) {
	let t: Value = null;
	f.vars = () => [U, t];
	if (live(U) === null) {
		U = live(f.usr);
	}
	if ((!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(U), "Please enter message", rt.sv(f, "name"), null, 1024])))) || truthy(rt.sv(f, "toff")))) {
		return live(f.dot);
	}
	if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(U)])), 1) && !isEqual(rt.sv(f, "loc"), live(U)))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(U), "canUseTopic", [live(f.src)])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "emped"))) {
		t = (yield* g.call(f, P("/proc/Gibberish"), null, [live(t), 100]));
	}
	return live(t);
}, true);

// /obj/item/device/pda/proc/send_message  (code/game/objects/items/devices/PDA/PDA.dm:514)  may sleep
rt.def("/obj/item/device/pda/proc/send_message", function* send_message(f: Frame, user: Value, targets: Value) {
	let message: Value = null, multiple: Value = null, last_sucessful_msg: Value = null, _P: Value = null, MS: Value = null, msg: Value = null;
	let $e: any;
	f.vars = () => [user, targets, message, multiple, last_sucessful_msg, _P, MS, msg, $e];
	if (live(user) === null) {
		user = live(f.usr);
	}
	if ((!truthy((message = (yield* g.srcCall(f, "msg_input", live(user))))) || !truthy(rt.len(f, live(targets))))) {
		return live(f.dot);
	}
	if ((truthy(rt.sv(f, "last_text")) && rt.lt(rt.worldTime(f), add(rt.sv(f, "last_text"), 5)))) {
		return live(f.dot);
	}
	multiple = (rt.gt(rt.len(f, live(targets)), 1) ? 1 : 0);
	last_sucessful_msg = null;
	_P = null;
	rt.forList(f, 0, live(targets), T("/obj/item/device/pda"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (isEqual(live(_P), live(f.src))) {
			continue;
		}
		MS = null;
		if (truthy((MS = (yield* g.srcCall(f, "can_send", live(_P)))))) {
			if (truthy((msg = (yield* g.callName(f, live(MS), "send_pda_message", [fmt("＀", [rt.fv(f, "owner", live(_P))]), fmt("＀", [rt.sv(f, "owner")]), fmt("＀", [live(message)]), rt.sv(f, "photo")]))))) {
				last_sucessful_msg = live(msg);
			}
			if (!truthy(live(multiple))) {
				yield* g.srcCall(f, "show_to_sender", live(msg), 0, live(_P));
			}
			yield* g.callName(f, live(_P), "show_recieved_message", [live(msg), live(f.src)]);
			if (!truthy(live(multiple))) {
				yield* g.srcCall(f, "show_to_ghosts", live(user), live(msg));
				yield* g.call(f, P("/proc/log_pda"), null, [fmt("＀ (PDA: ＀) sent \"＀\" to ＀", [live(user), rt.fv(f, "name", live(f.src)), live(message), rt.fv(f, "name", live(_P))])]);
			}
		} else {
			if (!truthy(live(multiple))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>ERROR: Server isn't responding.</span>"]);
				return live(f.dot);
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "photo", null);
	if (!truthy(live(multiple))) return f.dot;
	yield* g.srcCall(f, "show_to_sender", live(last_sucessful_msg), 1);
	yield* g.srcCall(f, "show_to_ghosts", live(user), live(last_sucessful_msg), 1);
	yield* g.call(f, P("/proc/log_pda"), null, [fmt("＀ (PDA: ＀) sent \"＀\" to Everyone", [live(user), rt.fv(f, "name", live(f.src)), live(message)])]);
	return f.dot;
}, true);

// /obj/item/device/pda/proc/show_to_sender  (code/game/objects/items/devices/PDA/PDA.dm:552)
rt.def("/obj/item/device/pda/proc/show_to_sender", function show_to_sender(f: Frame, msg: Value, multiple: Value, target: Value) {
	let $0: any;
	f.vars = () => [multiple, target, $0];
	if (live(multiple) === null) {
		multiple = 0;
	}
	if (truthy(live(multiple))) {
		$0 = "Everyone";
	} else {
		$0 = rt.fv(f, "recipient", live(msg));
	}
	if (live(msg) !== null) {
		rt.callSrc(f, "log_message", [1, truthy(live(multiple)) ? null : live(target), truthy(live(multiple)) || live(target) === null ? $0 : fmt("＀ (＀)", [rt.fv(f, "owner", live(target)), rt.fv(f, "ownjob", live(target))]), rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", [])]);
	}
	rt.modSrcVar(f, "tnote", fmt("<i><b>&rarr; To ＀:</b></i><br>＀＀<br>", [$0, rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", [])]), add);
	rt.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return f.dot;
});

// /obj/item/device/pda/proc/log_message  (tg_js)
// The Messages screen's list: one entry per message, out = 1 for sent, pda = the other PDA's ref (null for Send To All), name = "Owner (Job)".
// text and photo are already HTML (stripped_input / get_photo_ref), as in tnote.
rt.def("/obj/item/device/pda/proc/log_message", function log_message(f: Frame, out: Value, other: Value, name: Value, text: Value, photo: Value) {
	f.vars = () => [out, other, name, text, photo];
	if (rt.sv(f, "msglog") === null) {
		rt.setSv(f, "msglog", rt.list());
	}
	pdaRow(rt.sv(f, "msglog"), ["out", live(out), "pda", live(other) === null ? null : fmt("＃", [live(other)]), "name", live(name), "text", live(text), "photo", live(photo)]);
	return f.dot;
});

// /obj/item/device/pda/proc/chat_messages  (tg_js)
// msglog as the Messages screen shows it: only the messages with chat_target's PDA when one is open, else all of them.
rt.def("/obj/item/device/pda/proc/chat_messages", function chat_messages(f: Frame) {
	const log = rt.sv(f, "msglog"), chat = rt.sv(f, "chat_target"), msgs = rt.list();
	for (let i = 1; log !== null && i <= rt.len(f, log); i++) {
		const M = rt.at(log, i);
		if (chat === null || isEqual(rt.at(M, "pda"), chat)) rt.modify(live(msgs), rt.list(M), add);
	}
	return msgs;
});

// /obj/item/device/pda/proc/show_recieved_message  (code/game/objects/items/devices/PDA/PDA.dm:555)
rt.def("/obj/item/device/pda/proc/show_recieved_message", function show_recieved_message(f: Frame, msg: Value, source: Value) {
	let L: Value = null, hrefstart: Value = null, hrefend: Value = null;
	f.vars = () => [L, hrefstart, hrefend];
	rt.callSrc(f, "log_message", [0, live(source), fmt("＀ (＀)", [rt.fv(f, "owner", live(source)), rt.fv(f, "ownjob", live(source))]), rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", [])]);
	rt.modSrcVar(f, "tnote", fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀＀<br>", [live(f.src), live(source), rt.fv(f, "owner", live(source)), rt.fv(f, "ownjob", live(source)), rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", [])]), add);
	if (!truthy(rt.sv(f, "silent"))) {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
		rt.callSrc(f, "audible_message", [fmt("＀ *＀*", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), rt.sv(f, "ttone")]), null, 3]);
	}
	L = null;
	if ((truthy(rt.sv(f, "loc")) && truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0)))) {
		L = rt.sv(f, "loc");
	} else {
		L = rt.call(f, P("/proc/get"), null, [live(f.src), T("/mob/living/silicon")]);
	}
	if ((truthy(live(L)) && !isEqual(rt.fv(f, "stat", live(L)), 1))) {
		hrefstart = null;
		hrefend = null;
		if (truthy((rt.istype(live(L), T("/mob/living/silicon/ai")) ? 1 : 0))) {
			hrefstart = fmt("<a href='?src=＃;track=＀'>", [live(L), rt.call(f, P("/proc/html_encode"), null, [rt.fv(f, "owner", live(source))])]);
			hrefend = "</a>";
		}
		rt.call(f, P("/proc/to_chat"), null, [live(L), fmt("＀ <b>Message from ＀＀ (＀)＀, </b>\"＀\"＀ (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [rt.call(f, P("/proc/bicon"), null, [live(f.src)]), live(hrefstart), rt.fv(f, "owner", live(source)), rt.fv(f, "ownjob", live(source)), live(hrefend), rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", []), live(f.src), live(source)])]);
	}
	rt.callSrc(f, "update_icon", []);
	rt.callSrc(f, "add_overlay", [rt.sv(f, "icon_alert")]);
	rt.callName(f, rt.gl("SStgui"), "update_uis", [live(f.src)]);
	return f.dot;
});

// /obj/item/device/pda/proc/show_to_ghosts  (code/game/objects/items/devices/PDA/PDA.dm:582)
rt.def("/obj/item/device/pda/proc/show_to_ghosts", function show_to_ghosts(f: Frame, user: Value, msg: Value, multiple: Value) {
	let M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	f.vars = () => [multiple, M, link, $0, $1, $2, $3, $e];
	if (live(multiple) === null) {
		multiple = 0;
	}
	M = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if (((truthy((rt.istype(live(M), T("/mob/dead/observer")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(M)))) && truthy(rt.bitAnd(rt.gv(f, "chat_toggles", rt.gv(f, "prefs", rt.fv(f, "client", live(M)))), 256)))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [live(M), live(user)]);
			$0 = live(M);
			$1 = live(link);
			$2 = rt.fv(f, "sender", live(msg));
			if (truthy(live(multiple))) {
				$2 = $2;
				$3 = "Everyone";
			} else {
				$3 = rt.fv(f, "recipient", live(msg));
			}
			rt.call(f, P("/proc/to_chat"), null, [$0, fmt("＀ <span class='name'>＀ </span><span class='game say'>PDA Message</span> --> <span class='name'>＀</span>: <span class='message'>＀＀</span></span>", [$1, $2, $3, rt.fv(f, "message", live(msg)), rt.callName(f, live(msg), "get_photo_ref", [])])]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/item/device/pda/proc/can_send  (code/game/objects/items/devices/PDA/PDA.dm:588)  may sleep
rt.def("/obj/item/device/pda/proc/can_send", function* can_send(f: Frame, _P: Value) {
	let useMS: Value = null, MS: Value = null, signal: Value = null, useTC: Value = null, pos: Value = null;
	let $e: any;
	f.vars = () => [_P, useMS, MS, signal, useTC, pos, $e];
	if (((!truthy(live(_P)) || (!truthy(live(_P)) || truthy(rt.fv(f, "gc_destroyed", live(_P))))) || truthy(rt.fv(f, "toff", live(_P))))) {
		return null;
	}
	useMS = null;
	if (truthy(rt.gl("message_servers"))) {
		MS = null;
		rt.forList(f, 0, rt.gl("message_servers"), T("/obj/machinery/message_server"));
		while (($e = rt.next(f, 0)) !== undefined) {
			MS = $e;
			if (truthy(rt.fv(f, "active", live(MS)))) {
				useMS = live(MS);
				break;
			}
		}
		rt.endFor(f, 0);
	}
	signal = (yield* g.callName(f, live(f.src), "telecomms_process", []));
	if (((!truthy(live(_P)) || (!truthy(live(_P)) || truthy(rt.fv(f, "gc_destroyed", live(_P))))) || truthy(rt.fv(f, "toff", live(_P))))) {
		return null;
	}
	useTC = 0;
	if (truthy(live(signal))) {
		if (truthy(rt.index(rt.fv(f, "data", live(signal)), "done"))) {
			useTC = 1;
			if (truthy((rt.isIn(f, rt.gv(f, "z", (pos = rt.getStep(f, live(_P), 0))), rt.index(rt.fv(f, "data", live(signal)), "level")) ? 1 : 0))) {
				useTC = 2;
			}
		}
	}
	if (isEqual(live(useTC), 2)) {
		return live(useMS);
	} else {
		return null;
	}
	return f.dot;
}, true);

// /obj/item/device/pda/proc/send_to_all  (code/game/objects/items/devices/PDA/PDA.dm:619)  may sleep
rt.def("/obj/item/device/pda/proc/send_to_all", function* send_to_all(f: Frame, U: Value) {
	f.vars = () => [U];
	if (live(U) === null) {
		U = live(f.usr);
	}
	yield* g.srcCall(f, "send_message", live(U), (yield* g.call(f, P("/proc/get_viewable_pdas"), null, [])));
	return f.dot;
}, true);

// /obj/item/device/pda/proc/create_message  (code/game/objects/items/devices/PDA/PDA.dm:622)  may sleep
rt.def("/obj/item/device/pda/proc/create_message", function* create_message(f: Frame, U: Value, _P: Value) {
	f.vars = () => [U, _P];
	if (live(U) === null) {
		U = live(f.usr);
	}
	yield* g.srcCall(f, "send_message", live(U), rt.list(live(_P)));
	return f.dot;
}, true);

// /obj/item/device/pda/proc/AltClick  (code/game/objects/items/devices/PDA/PDA.dm:625)  may sleep
rt.def("/obj/item/device/pda/proc/AltClick", function* AltClick(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	if (truthy(rt.sv(f, "id"))) {
		yield* g.srcCall(f, "remove_id");
	} else {
		yield* g.srcCall(f, "remove_pen");
	}
	return f.dot;
}, true);

// /obj/item/device/pda/verb/verb_remove_id  (code/game/objects/items/devices/PDA/PDA.dm:641)  may sleep
rt.def("/obj/item/device/pda/verb/verb_remove_id", function* verb_remove_id(f: Frame) {
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	if (truthy(rt.sv(f, "id"))) {
		yield* g.srcCall(f, "remove_id");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This PDA does not have an ID in it!</span>"]);
	}
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object", src: 11 } });

// /obj/item/device/pda/verb/verb_remove_pen  (code/game/objects/items/devices/PDA/PDA.dm:655)  may sleep
rt.def("/obj/item/device/pda/verb/verb_remove_pen", function* verb_remove_pen(f: Frame) {
	if (truthy((rt.istype(live(f.usr), T("/mob/living/silicon")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)])))) return f.dot;
	yield* g.srcCall(f, "remove_pen");
	return f.dot;
}, true, { verb: { name: "Remove Pen", category: "Object", src: 11 } });

// /obj/item/device/pda/proc/remove_pen  (code/game/objects/items/devices/PDA/PDA.dm:663)  may sleep
rt.def("/obj/item/device/pda/proc/remove_pen", function* remove_pen(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy(rt.sv(f, "inserted_item"))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.callName(f, (M = rt.sv(f, "loc")), "put_in_hands", [rt.sv(f, "inserted_item")]);
		} else {
			yield* g.callName(f, rt.sv(f, "inserted_item"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You remove ％！ from ％！.</span>", [rt.sv(f, "inserted_item"), live(f.src)])]);
		rt.setSv(f, "inserted_item", null);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>This PDA does not have a pen in it!</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/device/pda/proc/id_check  (code/game/objects/items/devices/PDA/PDA.dm:676)  may sleep
rt.def("/obj/item/device/pda/proc/id_check", function* id_check(f: Frame, user: Value, I: Value) {
	let C: Value = null, old_id: Value = null;
	f.vars = () => [user, I, C, old_id];
	if (!truthy(live(I))) {
		if (truthy(rt.sv(f, "id"))) {
			yield* g.srcCall(f, "remove_id");
			return 1;
		} else {
			if (truthy((rt.istype((C = (yield* g.callName(f, live(user), "get_active_held_item", []))), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
				I = live(C);
			}
		}
	}
	if ((truthy(live(I)) && truthy(rt.fv(f, "registered_name", live(I))))) {
		if (!truthy((yield* g.callName(f, live(user), "transferItemToLoc", [live(I), live(f.src)])))) {
			return 0;
		}
		old_id = rt.sv(f, "id");
		rt.setSv(f, "id", live(I));
		if (truthy(live(old_id))) {
			yield* g.callName(f, live(user), "put_in_hands", [live(old_id)]);
		}
		yield* g.srcCall(f, "update_icon");
	}
	return 1;
}, true);

// /obj/item/device/pda/proc/attackby  (code/game/objects/items/devices/PDA/PDA.dm:697)  may sleep
rt.def("/obj/item/device/pda/proc/attackby", function* attackby(f: Frame) {
	let idcard: Value = null, _P: Value = null;
	f.vars = () => [idcard, _P];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/cartridge")) ? 1 : 0)) && !truthy(rt.sv(f, "cartridge")))) {
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			return live(f.dot);
		}
		rt.setSv(f, "cartridge", live(f.args[0]));
		rt.setFv(f, "host_pda", rt.sv(f, "cartridge"), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [rt.sv(f, "cartridge"), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			if (!truthy(rt.gv(f, "registered_name", (idcard = live(f.args[0]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＄！ rejects the ID!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (!truthy(rt.sv(f, "owner"))) {
				rt.setSv(f, "owner", rt.fv(f, "registered_name", live(idcard)));
				rt.setSv(f, "ownjob", rt.fv(f, "assignment", live(idcard)));
				yield* g.srcCall(f, "update_label");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>Card scanned.</span>"]);
			} else {
				if (((truthy((rt.isIn(f, live(f.src), rt.fv(f, "contents", live(f.args[1]))) ? 1 : 0)) || (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")]))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1))) && truthy((rt.isIn(f, live(f.args[0]), rt.fv(f, "contents", live(f.args[1]))) ? 1 : 0)))) {
					if (!truthy((yield* g.srcCall(f, "id_check", live(f.args[1]), live(idcard))))) {
						return live(f.dot);
					}
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You put the ID into ％！'s slot.</span>", [live(f.src)])]);
					yield* g.srcCall(f, "updateSelfDialog");
				}
				return live(f.dot);
			}
			yield* g.srcCall(f, "updateSelfDialog");
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/paicard")) ? 1 : 0)) && !truthy(rt.fv(f, "pai", live(f.src))))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setSv(f, "pai", live(f.args[0]));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slot ％！ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
				yield* g.srcCall(f, "update_icon");
				yield* g.srcCall(f, "updateUsrDialog");
			} else {
				if (truthy((yield* g.call(f, P("/proc/is_type_in_list"), null, [live(f.args[0]), rt.sv(f, "contained_item")])))) {
					if (truthy(rt.sv(f, "inserted_item"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There is already ＇！ in ％！!</span>", [rt.sv(f, "inserted_item"), live(f.src)])]);
					} else {
						if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You slide ％！ into ％！.</span>", [live(f.args[0]), live(f.src)])]);
						rt.setSv(f, "inserted_item", live(f.args[0]));
						yield* g.srcCall(f, "update_icon");
					}
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/photo")) ? 1 : 0))) {
						rt.setSv(f, "photo", rt.gv(f, "img", (_P = live(f.args[0]))));
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You scan ％！.</span>", [live(f.args[0])])]);
					} else {
						if ((truthy(rt.sv(f, "hidden_uplink")) && truthy(rt.fv(f, "active", rt.sv(f, "hidden_uplink"))))) {
							yield* g.callName(f, rt.sv(f, "hidden_uplink"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2])]);
						} else {
							return (yield* g.callSuper(f, [], rt.Args.Same));
						}
					}
				}
			}
		}
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

// /obj/item/device/pda/proc/attack  (code/game/objects/items/devices/PDA/PDA.dm:750)  may sleep
rt.def("/obj/item/device/pda/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	let $0: any;
	f.vars = () => [C, user, $0];
	if (!truthy((rt.istype(live(C), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	$0 = rt.sv(f, "scanmode");
	if ($0 === 1) {
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='alert'>＀ has analyzed ＀'s vitals!</span>", [live(user), live(C)])]);
		yield* g.call(f, P("/proc/healthscan"), null, [live(user), live(C), 1]);
		yield* g.srcCall(f, "add_fingerprint", live(user));
	} else if ($0 === 2) {
	} else if ($0 === 4) {
		yield* g.callName(f, live(C), "visible_message", [fmt("<span class='warning'>＀ has analyzed ＀'s radiation levels!</span>", [live(user), live(C)])]);
		yield* g.callName(f, live(user), "show_message", [fmt("<span class='notice'>Analyzing Results for ＀:</span>", [live(C)])]);
		if (truthy(rt.fv(f, "radiation", live(C)))) {
			yield* g.callName(f, live(user), "show_message", [fmt(" Radiation Level:  ＀", [rt.fv(f, "radiation", live(C))])]);
		} else {
			yield* g.callName(f, live(user), "show_message", ["<span class='notice'>No radiation detected.</span>"]);
		}
	}
	return f.dot;
}, true);

// /obj/item/device/pda/proc/afterattack  (code/game/objects/items/devices/PDA/PDA.dm:771)
rt.def("/obj/item/device/pda/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let reagents_length: Value = null, re: Value = null, _T: Value = null, PA: Value = null, _P: Value = null, RC: Value = null, F: Value = null, PP: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	f.vars = () => [reagents_length, re, _T, PA, _P, RC, F, PP, $0, $1, $2, $e];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	$0 = rt.sv(f, "scanmode");
	if ($0 === 3) {
		if (rt.fv(f, "reagents", live(A)) !== null) {
			if (rt.gt(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A)))), 0)) {
				reagents_length = rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A))));
				$0 = live(user);
				$1 = live(reagents_length);
				if (rt.gt(live(reagents_length), 1)) {
					$2 = "s";
				} else {
					$2 = "";
				}
				rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ chemical agent＀ found.</span>", [$1, $2])]);
				re = null;
				rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", live(A))));
				while (($e = rt.next(f, 0)) !== undefined) {
					re = $e;
					rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>\t ＀</span>", [live(re)])]);
				}
				rt.endFor(f, 0);
			} else {
				rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>No active chemical agents found in ＀.</span>", [live(A)])]);
			}
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>No significant chemical agents found in ＀.</span>", [live(A)])]);
		}
	} else if ($0 === 5) {
		if (truthy((rt.istype(live(A), T("/obj/item/weapon/tank")) ? 1 : 0))) {
			rt.callSrc(f, "atmosanalyzer_scan", [rt.gv(f, "air_contents", (_T = live(A))), live(user), live(_T)]);
		} else {
			if (truthy((rt.istype(live(A), T("/obj/machinery/portable_atmospherics")) ? 1 : 0))) {
				rt.callSrc(f, "atmosanalyzer_scan", [rt.gv(f, "air_contents", (PA = live(A))), live(user), live(PA)]);
			} else {
				if (truthy((rt.istype(live(A), T("/obj/machinery/atmospherics/pipe")) ? 1 : 0))) {
					rt.callSrc(f, "atmosanalyzer_scan", [rt.gv(f, "air", rt.gv(f, "parent", (_P = live(A)))), live(user), live(_P)]);
				} else {
					if (truthy((rt.istype(live(A), T("/obj/machinery/power/rad_collector")) ? 1 : 0))) {
						if (truthy(rt.gv(f, "loaded_tank", (RC = live(A))))) {
							rt.callSrc(f, "atmosanalyzer_scan", [rt.gv(f, "air_contents", rt.fv(f, "loaded_tank", live(RC))), live(user), live(RC)]);
						}
					} else {
						if (truthy((rt.istype(live(A), T("/obj/item/weapon/flamethrower")) ? 1 : 0))) {
							if (truthy(rt.gv(f, "ptank", (F = live(A))))) {
								rt.callSrc(f, "atmosanalyzer_scan", [rt.gv(f, "air_contents", rt.fv(f, "ptank", live(F))), live(user), live(F)]);
							}
						}
					}
				}
			}
		}
	}
	if (!((!truthy(rt.sv(f, "scanmode")) && truthy((rt.istype(live(A), T("/obj/item/weapon/paper")) ? 1 : 0))) && truthy(rt.sv(f, "owner")))) return f.dot;
	if (!truthy(rt.gv(f, "info", (PP = live(A))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to scan! Paper is blank.</span>"]);
		return live(f.dot);
	}
	rt.setSv(f, "notehtml", rt.fv(f, "info", live(PP)));
	rt.setSv(f, "note", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "notehtml"), "<BR>", "[br]"]));
	rt.setSv(f, "note", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "note"), "<li>", "[*]"]));
	rt.setSv(f, "note", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "note"), "<ul>", "[list]"]));
	rt.setSv(f, "note", rt.call(f, P("/proc/replacetext"), null, [rt.sv(f, "note"), "</ul>", "[/list]"]));
	rt.setSv(f, "note", rt.call(f, P("/proc/html_encode"), null, [rt.sv(f, "note")]));
	rt.setSv(f, "notescanned", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>Paper scanned. Saved to PDA's notekeeper.</span>"]);
	return f.dot;
});

// /obj/item/device/pda/proc/explode  (code/game/objects/items/devices/PDA/PDA.dm:821)  may sleep
rt.def("/obj/item/device/pda/proc/explode", function* explode(f: Frame) {
	let _T: Value = null, M: Value = null;
	f.vars = () => [_T, M];
	if (!truthy(rt.sv(f, "detonatable"))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
		yield* g.callName(f, (M = rt.sv(f, "loc")), "show_message", [fmt("<span class='userdanger'>Your ＀ explodes!</span>", [live(f.src)]), 1]);
	} else {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ explodes!</span>", [live(f.src)]), "<span class='warning'>You hear a loud *pop*!</span>");
	}
	if (truthy(live(_T))) {
		yield* g.callName(f, live(_T), "hotspot_expose", [700, 125]);
		if (truthy((rt.istype(rt.sv(f, "cartridge"), T("/obj/item/weapon/cartridge/virus/syndicate")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/explosion"), null, [live(_T), -1, 1, 3, 4]);
		} else {
			yield* g.call(f, P("/proc/explosion"), null, [live(_T), -1, -1, 2, 3]);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/item/device/pda/proc/Destroy  (code/game/objects/items/devices/PDA/PDA.dm:840)  may sleep
rt.def("/obj/item/device/pda/proc/Destroy", function* Destroy(f: Frame) {
	(rt.modGl("PDAs", live(f.src), subtract));
	if (truthy((rt.istype(rt.sv(f, "id"), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "id")]);
		rt.setSv(f, "id", null);
	}
	if (truthy((rt.istype(rt.sv(f, "cartridge"), T("/obj/item/weapon/cartridge")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "cartridge")]);
		rt.setSv(f, "cartridge", null);
	}
	if (truthy((rt.istype(rt.sv(f, "pai"), T("/obj/item/device/paicard")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "pai")]);
		rt.setSv(f, "pai", null);
	}
	if (truthy((rt.istype(rt.sv(f, "inserted_item"), T("/obj/item")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "inserted_item")]);
		rt.setSv(f, "inserted_item", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /mob/living/silicon/ai/proc/cmd_send_pdamesg  (code/game/objects/items/devices/PDA/PDA.dm:854)  may sleep
rt.def("/mob/living/silicon/ai/proc/cmd_send_pdamesg", function* cmd_send_pdamesg(f: Frame, user: Value) {
	let plist: Value = null, namecounts: Value = null, _P: Value = null, c: Value = null, selected: Value = null, add_photo: Value = null, Pic: Value = null;
	let $e: any;
	f.vars = () => [user, plist, namecounts, _P, c, selected, add_photo, Pic, $e];
	plist = rt.list();
	namecounts = rt.list();
	if (isEqual(rt.fv(f, "stat", live(user)), 2)) {
		return live(f.dot);
	}
	if (truthy(rt.gv(f, "toff", rt.fv(f, "aiPDA", live(f.src))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "Turn on your receiver in order to send messages."]);
		return live(f.dot);
	}
	_P = null;
	rt.forList(f, 0, (yield* g.call(f, P("/proc/get_viewable_pdas"), null, [])), T("/obj/item/device/pda"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (isEqual(live(_P), live(f.src))) {
			continue;
		}
		if (isEqual(live(_P), rt.fv(f, "aiPDA", live(f.src)))) {
			continue;
		}
		rt.setAt(live(plist), (yield* g.call(f, P("/proc/avoid_assoc_duplicate_keys"), null, [rt.fv(f, "owner", live(_P)), live(namecounts)])), live(_P));
	}
	rt.endFor(f, 0);
	if (!truthy((c = (yield* g.op(f, "Prompt", [1], [null, null, "Please select a PDA", live(user), (yield* g.call(f, P("/proc/sortList"), null, [live(plist)]))]))))) {
		return live(f.dot);
	}
	selected = rt.index(live(plist), live(c));
	if (rt.gt(rt.getLen(f, rt.fv(f, "aipictures", rt.sv(f, "aicamera"))), 0)) {
		if (isEqual((add_photo = (yield* g.op(f, "Prompt", [1], ["No", "Photo", "Do you want to attach a photo?", live(user), rt.list("Yes", "No")]))), "Yes")) {
			Pic = (yield* g.callName(f, rt.sv(f, "aicamera"), "selectpicture", [rt.sv(f, "aicamera")]));
			rt.setFv(f, "photo", rt.fv(f, "aiPDA", live(f.src)), rt.index(rt.fv(f, "fields", live(Pic)), "img"));
		}
	}
	yield* g.callName(f, rt.fv(f, "aiPDA", live(f.src)), "create_message", [live(f.src), live(selected)]);
	return f.dot;
}, true);

// /mob/living/silicon/ai/verb/cmd_toggle_pda_receiver  (code/game/objects/items/devices/PDA/PDA.dm:890)
rt.def("/mob/living/silicon/ai/verb/cmd_toggle_pda_receiver", function cmd_toggle_pda_receiver(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	if (rt.sv(f, "aiPDA") !== null) {
		rt.setFv(f, "toff", rt.sv(f, "aiPDA"), (!truthy(rt.fv(f, "toff", rt.sv(f, "aiPDA"))) ? 1 : 0));
		$0 = live(f.usr);
		if (truthy(rt.fv(f, "toff", rt.sv(f, "aiPDA")))) {
			$1 = "Off";
		} else {
			$1 = "On";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>PDA sender/receiver toggled ＀!</span>", [$1])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You do not have a PDA. You should make an issue report about this."]);
	}
	return f.dot;
}, false, { verb: { name: "PDA - Toggle Sender/Receiver", category: "AI Commands" } });

// /mob/living/silicon/ai/verb/cmd_toggle_pda_silent  (code/game/objects/items/devices/PDA/PDA.dm:901)
rt.def("/mob/living/silicon/ai/verb/cmd_toggle_pda_silent", function cmd_toggle_pda_silent(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (isEqual(rt.fv(f, "stat", live(f.usr)), 2)) {
		return live(f.dot);
	}
	if (rt.sv(f, "aiPDA") !== null) {
		rt.setFv(f, "silent", rt.sv(f, "aiPDA"), (!truthy(rt.fv(f, "silent", rt.sv(f, "aiPDA"))) ? 1 : 0));
		$0 = live(f.usr);
		if (truthy(rt.fv(f, "silent", rt.sv(f, "aiPDA")))) {
			$1 = "Off";
		} else {
			$1 = "On";
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>PDA ringer toggled ＀!</span>", [$1])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "You do not have a PDA. You should make an issue report about this."]);
	}
	return f.dot;
}, false, { verb: { name: "PDA - Toggle Ringer", category: "AI Commands" } });

// /mob/living/silicon/ai/proc/cmd_show_message_log  (code/game/objects/items/devices/PDA/PDA.dm:911)
rt.def("/mob/living/silicon/ai/proc/cmd_show_message_log", function cmd_show_message_log(f: Frame, user: Value) {
	let HTML: Value = null;
	f.vars = () => [HTML];
	if (isEqual(rt.fv(f, "stat", live(user)), 2)) {
		return live(f.dot);
	}
	if (rt.sv(f, "aiPDA") !== null) {
		HTML = fmt("<html><head><title>AI PDA Message Log</title></head><body>＀</body></html>", [rt.fv(f, "tnote", rt.sv(f, "aiPDA"))]);
		rt.op(f, "Browse", [], [live(user), live(HTML), "window=log;size=400x444;border=1;can_resize=1;can_close=1;can_minimize=0"], false);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "You do not have a PDA. You should make an issue report about this."]);
	}
	return f.dot;
});

// /obj/item/device/pda/proc/emp_act  (code/game/objects/items/devices/PDA/PDA.dm:922)  may sleep
rt.def("/obj/item/device/pda/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let A: Value = null;
	let $e: any;
	f.vars = () => [severity, A, $e];
	A = null;
	rt.forList(f, 0, live(f.src), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "emp_act", [live(severity)]);
	}
	rt.endFor(f, 0);
	rt.modSrcVar(f, "emped", 1, add);
	rt.spawnTail(f, multiply(200, live(severity)), "/obj/item/device/pda/proc/emp_act: spawn at game/objects/items/devices/PDA/PDA.dm:925", severity, A);
	return f.dot;
}, true);

// a spawn(multiply(200, live(severity))) body of /obj/item/device/pda/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/pda/proc/emp_act: spawn at game/objects/items/devices/PDA/PDA.dm:925", function* (f: Frame, severity: Value, A: Value) {
	f.vars = () => [severity, A];
	(rt.modSrcVar(f, "emped", 1, subtract));
	return null;
});

// /proc/get_viewable_pdas  (code/game/objects/items/devices/PDA/PDA.dm:929)
rt.def("/proc/get_viewable_pdas", function get_viewable_pdas(f: Frame) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	f.dot = rt.list();
	_P = null;
	rt.forList(f, 0, rt.gl("PDAs"), T("/obj/item/device/pda"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (((!truthy(rt.fv(f, "owner", live(_P))) || truthy(rt.fv(f, "toff", live(_P)))) || truthy(rt.fv(f, "hidden", live(_P))))) {
			continue;
		}
		f.dot = rt.modify(live(f.dot), live(_P), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});
