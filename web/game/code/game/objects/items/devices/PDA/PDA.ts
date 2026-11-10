// Based on /tg/station's code/game/objects/items/devices/PDA/PDA.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, truthy, add, fmt } = rt;


// PDA.dm:4
rt.def("/datum/controller/global_vars/proc/InitGlobalPDAs", function InitGlobalPDAs(f: Frame) {
	GLOB.PDAs = list();
	this.gvars_datum_init_order += "PDAs";
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

// PDA.dm:17
rt.def("/obj/item/device/pda/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);

	this.contained_item = list(T("/obj/item/weapon/pen"), T("/obj/item/toy/crayon"), T("/obj/item/weapon/lipstick"), T("/obj/item/device/flashlight/pen"), T("/obj/item/clothing/mask/cigarette"));
	return f.dot;
});

// PDA.dm:60
rt.def("/obj/item/device/pda/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.fon) {
		this.set_light(this.f_lum);
	}
	GLOB.PDAs += this;
	if (this.default_cartridge) {
		this.cartridge = (yield* new_(this.default_cartridge, this));
		// tg_js fix (2017 tg bug): atom/New passes `mapload` as Initialize's first argument, so a default cartridge never learned its PDA and its apps showed nothing
		this.cartridge.host_pda = this;
	}
	if (this.inserted_item) {
		this.inserted_item = (yield* new_(this.inserted_item, this));
	} else {
		this.inserted_item = (yield* new_(T("/obj/item/weapon/pen"), this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// PDA.dm:74
rt.def("/obj/item/device/pda/proc/update_label", function update_label(f: Frame) {
	this.name = `PDA-${this.owner} (${this.ownjob})`;
	return f.dot;
});

// PDA.dm:78
rt.def("/obj/item/device/pda/proc/GetAccess", function GetAccess(f: Frame) {
	if (this.id) {
		return this.id.GetAccess();
	}
	return parent_proc();
});

// PDA.dm:86
rt.def("/obj/item/device/pda/proc/update_icon", function update_icon(f: Frame) {
	let overlay: Value = null;
	this.cut_overlays();
	(overlay = new_(T("/mutable_appearance"))).pixel_x = this.overlays_x_offset;
	if (this.id) {
		overlay.icon_state = "id_overlay";
		this.add_overlay(new_(T("/mutable_appearance"), overlay));
	}
	if (this.inserted_item) {
		overlay.icon_state = "insert_overlay";
		this.add_overlay(new_(T("/mutable_appearance"), overlay));
	}
	if (this.fon) {
		overlay.icon_state = "light_overlay";
		this.add_overlay(new_(T("/mutable_appearance"), overlay));
	}
	if (!this.pai) return f.dot;
	if (this.pai.pai) {
		overlay.icon_state = "pai_overlay";
		this.add_overlay(new_(T("/mutable_appearance"), overlay));
	} else {
		overlay.icon_state = "pai_off_overlay";
		this.add_overlay(new_(T("/mutable_appearance"), overlay));
	}
	return f.dot;
});

// PDA.dm:107
rt.def("/obj/item/device/pda/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value, src_location: Value, over_location: Value) {
	let M: Value = f.usr;
	if (!rt.istype(over_object, T("/obj/screen")) && f.usr.canUseTopic(this)) {
		return (yield* this.attack_self(M));
	}
	return f.dot;
}, true);

// tg_js: the PDA window is the `pda` tgui (tgui/src/interfaces/pda.ract) instead of a browse() page. The helpers below build the
// lists ui_data sends; every button goes back through the old Topic (see ui_act), so all of its rules stay in one place.
function pdaRow(out: Value, pairs: any) {
	const E = rt.list();
	for (let i = 0; i < pairs.length; i += 2) rt.setAt(E, pairs[i], pairs[i + 1]);
	rt.modify(out, rt.list(E), add);
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
	return truthy(cart) && truthy(rt.bitAnd(rt.fv(f, "access", cart), bit));
}

// PDA.dm:113
rt.def("/obj/item/device/pda/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	if (this.hidden_uplink && this.hidden_uplink.active) {
		yield* this.hidden_uplink.interact(user);
		return f.dot;
	}
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// /obj/item/device/pda/proc/ui_interact  (tg_js, after modern tg's PDA)  may sleep
rt.def("/obj/item/device/pda/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.inventory_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "pda", "Personal Data Assistant", 500, 600, master_ui, state))).open();
	return f.dot;
}, true);

// the window title for each screen (tgui.ract shows data.ui_title over config.title)
const PDA_TITLES: Record<number, string> = {0: "PDA Main Menu", 1: "Notekeeper", 2: "Messenger", 21: "Messages", 3: "Atmospheric Scan", 41: "Crew Manifest"};

// /obj/item/device/pda/proc/ui_data  (tg_js)  may sleep
// mode: 0 menu, 1 notes, 2 messenger, 21 message log, 3 atmos scan, 41 crew manifest, anything else = a cartridge app (cart_html, the old HTML).
rt.def("/obj/item/device/pda/proc/ui_data", function* ui_data(f: Frame, user: Value) {
	let secs: Value = null, items: Value = null, _P: Value = null, E: Value = null, list: Value = null, _T: Value = null, environment: Value = null, env_gases: Value = null, total_moles: Value = null, id: Value = null, gas_level: Value = null;
	let data: Value = rt.list();
	let cart: Value = this.cartridge;
	let mode: Value = this.mode;
	rt.setAt(data, "mode", mode);
	rt.setAt(data, "owner", this.owner);
	rt.setAt(data, "ownjob", this.ownjob);
	rt.setAt(data, "has_id", this.id ? 1 : 0);
	rt.setAt(data, "id_name", this.id ? `${this.id.registered_name}, ${this.id.assignment}` : null);
	rt.setAt(data, "pen", this.inserted_item ? `${this.inserted_item}` : null);
	rt.setAt(data, "cartridge", cart ? `${cart}` : null);
	rt.setAt(data, "fon", this.fon ? 1 : 0);
	rt.setAt(data, "silent", this.silent ? 1 : 0);
	rt.setAt(data, "toff", this.toff ? 1 : 0);
	rt.setAt(data, "ttone", this.ttone);
	rt.setAt(data, "scanmode", this.scanmode);
	rt.setAt(data, "time", worldtime2text());
	rt.setAt(data, "ui_title", PDA_TITLES[mode] ?? "Personal Data Assistant");
	if (!this.owner) {
		return data;
	}
	if (mode == 0) {
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
			pdaApp(items, (this.scanmode == 1 ? "Disable" : "Enable") + " Medical Scanner", "Medical Scan");
		}
		if (pdaAcc(f, cart, 1)) pdaApp(pdaSection(secs, "Security Functions"), "Security Records", "45");
		if (pdaAcc(f, cart, 4096)) pdaApp(pdaSection(secs, "Quartermaster Functions"), "Supply Records", "47");
		items = pdaSection(secs, "Utilities");
		if (cart) {
			if (cart.bot_access_flags) pdaApp(items, "Bots Access", "54");
			if (pdaAcc(f, cart, 128)) pdaApp(items, "Custodial Locator", "49");
			if (rt.istype(cart.radio, T("/obj/item/radio/integrated/signal"))) pdaApp(items, "Signaler System", "40");
			if (pdaAcc(f, cart, 512)) pdaApp(items, "Newscaster Access", "53");
			if (pdaAcc(f, cart, 256)) pdaApp(items, (this.scanmode == 3 ? "Disable" : "Enable") + " Reagent Scanner", "Reagent Scan");
			if (pdaAcc(f, cart, 2)) pdaApp(items, (this.scanmode == 4 ? "Disable" : "Enable") + " Halogen Counter", "Halogen Counter");
			if (pdaAcc(f, cart, 4)) pdaApp(items, (this.scanmode == 5 ? "Disable" : "Enable") + " Gas Scanner", "Gas Scan");
			if (pdaAcc(f, cart, 1024)) pdaApp(items, "Toggle Remote Door", "Toggle Door");
			if (pdaAcc(f, cart, 16384)) pdaApp(items, "Drone Phone", "Drone Phone");
		}
		pdaApp(items, "Atmospheric Scan", "3");
		pdaApp(items, (this.fon ? "Disable" : "Enable") + " Flashlight", "Light");
		if (this.pai) {
			if (this.pai.loc != this) {
				this.pai = null;
				yield* this.update_icon();
			} else {
				pdaApp(items, "pAI Device Configuration", "pai;1");
				pdaApp(items, "Eject pAI Device", "pai;2");
			}
		}
		rt.setAt(data, "sections", secs);
	} else if (mode == 1) {
		rt.setAt(data, "note", this.note);
		rt.setAt(data, "notehtml", this.notehtml);
		rt.setAt(data, "notescanned", this.notescanned ? 1 : 0);
	} else if (mode == 2 || mode == 21) {
		if (mode == 21) {
			const chat = this.chat_target;
			rt.setAt(data, "msgs", rt.callSrc(f, "chat_messages", []));
			rt.setAt(data, "chat_target", chat);
			rt.setAt(data, "chat_name", chat === null ? null : this.chat_name);
		}
		if (cart) {
			rt.setAt(data, "message_header", cart.message_header());
		}
		list = rt.list();
		if (mode == 2 && !this.toff) {
			for (_P of each((yield* sortNames(get_viewable_pdas())), T("/obj/item/device/pda"))) {
				if (_P == this) {
					continue;
				}
				E = pdaRow(list, ["name", `${_P}`, "target", fmt("＃", [_P])]);
				if (cart) {
					rt.setAt(E, "special", cart.message_special(_P));
				}
			}
		}
		rt.setAt(data, "pdas", list);
		rt.setAt(data, "can_all", cart && cart.spam_enabled ? 1 : 0);
	} else if (mode == 3) {
		list = rt.list();
		_T = user.loc;
		if (_T !== null) {
			environment = _T.return_air();
			env_gases = environment.gases;
			total_moles = environment.total_moles();
			rt.setAt(data, "pressure", round(environment.return_pressure(), 0.1));
			rt.setAt(data, "temperature", round(environment.temperature - 273.15));
			if (total_moles) {
				for (id of each(env_gases)) {
					gas_level = rt.index(rt.index(env_gases, id), 1) / total_moles;
					if (gas_level > 0) {
						pdaRow(list, ["name", rt.index(rt.index(rt.index(env_gases, id), 3), 2), "pct", round(gas_level * 100, 0.01)]);
					}
				}
			}
		}
		rt.setAt(data, "gases", list);
	} else if (mode == 41) {
		list = rt.list();
		if (GLOB.data_core.general) {
			_P = null;
			for (_P of each((yield* sortRecord(GLOB.data_core.general)), T("/datum/data/record"))) {
				pdaRow(list, ["name", rt.index(_P.fields, "name"), "rank", rt.index(_P.fields, "rank")]);
			}
		}
		rt.setAt(data, "manifest", list);
	} else if (cart) {
		// a cartridge app: the cartridge builds the data for its screen (cart_data in cart.ts)
		E = (yield* cart.cart_data(user));
		rt.setAt(data, "cart", E);
	}
	return data;
}, true);

// /obj/item/device/pda/proc/ui_act  (tg_js)  may sleep
// "choice" is one old Topic choice (params: choice, target); the rest are the few things Topic has no choice for.
rt.def("/obj/item/device/pda/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value, ui: Value, state: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "choice") {
		if (rt.at(params, "choice") == "pai;1") {
			yield* this.Topic("", rt.alist(f, ["choice", "pai", "option", "1"]));
		} else if (rt.at(params, "choice") == "pai;2") {
			yield* this.Topic("", rt.alist(f, ["choice", "pai", "option", "2"]));
		} else {
			yield* this.Topic("", rt.alist(f, ["choice", rt.at(params, "choice"), "target", rt.at(params, "target")]));
		}
	} else if (action === "cart") {
		// a cartridge app button: params are the old href_list, sent to the cartridge's own Topic
		if (this.cartridge !== null) {
			yield* this.cartridge.Topic(null, params);
		}
	} else if (action === "remove_pen") {
		yield* this.remove_pen();
	} else {
		return 0;
	}
	return 1;
}, true, { args: ["action", "params", "ui", "state"] });

// PDA.dm:295
rt.def("/obj/item/device/pda/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let A: Value = null, alert_s: Value = null, msg: Value = null, n: Value = null, t: Value = null, _P: Value = null, M: Value = null, _T: Value = null;
	let $e: any;
	yield* parent_proc();
	let U: Value = f.usr;
	if (f.usr.canUseTopic(this) && !rt.at(href_list, "close")) {
		yield* this.add_fingerprint(U);
		yield* U.set_machine(this);
		const item = rt.at(href_list, "choice");
		if (item === "Refresh") {
		} else if (item === "Return") {
			if (this.mode <= 9) {
				this.mode = 0;
			} else if (this.mode == 99) {
				// tg_js fix (2017 tg bug): 99 is the newscaster's "channel locked" page, so go back to the newscaster (53), not round(99/10) = a blank page.
				this.mode = 53;
			} else {
				this.mode = round(this.mode / 10);
				if (this.mode == 4 || this.mode == 5) {
					this.mode = 0;
				}
			}
		} else if (item === "Authenticate") {
			yield* this.id_check(U);
		} else if (item === "UpdateInfo") {
			// tg_js fix (2017 tg bug): the href with no ID in the PDA read null.assignment (a runtime); the button only shows with an ID.
			if (this.id === null) {
				return f.dot;
			}
			this.ownjob = this.id.assignment;
			if (rt.istype(this.id, T("/obj/item/weapon/card/id/syndicate"))) {
				this.owner = this.id.registered_name;
			}
			this.update_label();
		} else if (item === "Eject") {
			if (this.cartridge !== null) {
				yield* U.put_in_hands(this.cartridge);
				to_chat(U, `<span class='notice'>You remove ${this.cartridge} from ${this}.</span>`);
				this.scanmode = 0;
				this.cartridge.host_pda = null;
				this.cartridge = null;
				yield* this.update_icon();
			}
		} else if (item === "0") {
			this.mode = 0;
		} else if (item === "1") {
			this.mode = 1;
		} else if (item === "2") {
			this.mode = 2;
		} else if (item === "21") {
			this.mode = 21;
			this.chat_target = null;
		} else if (item === "Chat") {
			// tg_js: the Messages screen showing only the messages between this PDA and one other
			_P = rt.locateIn(f, rt.at(href_list, "target"), rt.world());
			if (rt.istype(_P, T("/obj/item/device/pda"))) {
				this.mode = 21;
				this.chat_target = fmt("＃", [_P]);
				this.chat_name = `${_P.owner} (${_P.ownjob})`;
			}
		} else if (item === "3") {
			this.mode = 3;
		} else if (item === "4") {
			this.mode = 0;
		} else if (item === "Light") {
			if (this.fon) {
				this.fon = 0;
				this.set_light(0);
			} else {
				this.fon = 1;
				this.set_light(2.3);
			}
			yield* this.update_icon();
		} else if (item === "Medical Scan") {
			if (this.scanmode == 1) {
				this.scanmode = 0;
			} else if (this.cartridge !== null && rt.bitAnd(this.cartridge.access, 8)) {
				this.scanmode = 1;
			}
		} else if (item === "Reagent Scan") {
			if (this.scanmode == 3) {
				this.scanmode = 0;
			} else if (this.cartridge !== null && rt.bitAnd(this.cartridge.access, 256)) {
				this.scanmode = 3;
			}
		} else if (item === "Halogen Counter") {
			if (this.scanmode == 4) {
				this.scanmode = 0;
			} else if (this.cartridge !== null && rt.bitAnd(this.cartridge.access, 2)) {
				this.scanmode = 4;
			}
		} else if (item === "Honk") {
			if (!(this.last_noise && rt.worldTime(f) < this.last_noise + 20)) {
				playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 50, 1);
				this.last_noise = rt.worldTime(f);
			}
		} else if (item === "Trombone") {
			if (!(this.last_noise && rt.worldTime(f) < this.last_noise + 20)) {
				playsound(this.loc, rt.rsc("sound/misc/sadtrombone.ogg"), 50, 1);
				this.last_noise = rt.worldTime(f);
			}
		} else if (item === "Gas Scan") {
			if (this.scanmode == 5) {
				this.scanmode = 0;
			} else if (this.cartridge !== null && rt.bitAnd(this.cartridge.access, 4)) {
				this.scanmode = 5;
			}
		} else if (item === "Drone Phone") {
			A = get_area(U);
			alert_s = (yield* g.op(f, "Prompt", [1], [null, "Ping Drones", "Alert severity level", U, list("Low", "Medium", "High", "Critical")]));
			if (A && alert_s) {
				_alert_drones((msg = `<span class='boldnotice'>NON-DRONE PING: ${U.name}: ${alert_s} priority alert in ${A.name}!</span>`), 1);
				to_chat(U, msg);
			}
		} else if (item === "Edit") {
			n = (yield* stripped_multiline_input(U, "Please enter message", this.name, this.note));
			if (get_dist(this, U) <= 1 && this.loc == U) {
				if (this.mode == 1 && n) {
					this.note = n;
					this.notehtml = parsepencode(n, U, "Times New Roman");
					this.notescanned = 0;
				}
			} else {
				rt.op(f, "Browse", [], [U, null, "window=pda"], false);
				return f.dot;
			}
		} else if (item === "Toggle Messenger") {
			this.toff = (!this.toff ? 1 : 0);
		} else if (item === "Toggle Ringer") {
			this.silent = (!this.silent ? 1 : 0);
		} else if (item === "Clear") {
			this.tnote = null;
			this.msglog = null;
		} else if (item === "Ringtone") {
			t = (yield* g.op(f, "Prompt", [2], [this.ttone, this.name, "Please enter new ringtone", U, null]));
			if (get_dist(this, U) <= 1 && this.loc == U && t) {
				if (this.hidden_uplink && trim(lowertext(t)) == trim(lowertext(this.lock_code))) {
					yield* this.hidden_uplink.interact(U);
					to_chat(U, "The PDA softly beeps.");
					rt.op(f, "Browse", [], [U, null, "window=pda"], false);
					this.mode = 0;
				} else {
					this.ttone = (t = copytext(sanitize(t), 1, 20));
				}
			} else {
				rt.op(f, "Browse", [], [U, null, "window=pda"], false);
				return f.dot;
			}
		} else if (item === "Message") {
			_P = rt.locateIn(f, rt.at(href_list, "target"), rt.world());
			yield* this.create_message(U, _P);
		} else if (item === "MessageAll") {
			yield* this.send_to_all(U);
		} else if (item === "cart") {
			if (this.cartridge) {
				yield* this.cartridge.special(U, href_list);
			} else {
				rt.op(f, "Browse", [], [U, null, "window=pda"], false);
				return f.dot;
			}
		} else if (item === "Toggle Door") {
			if (this.cartridge && rt.bitAnd(this.cartridge.access, 1024)) {
				for (M of each(GLOB.machines, T("/obj/machinery/door/poddoor"))) {
					if (M.id == this.cartridge.remote_door_id) {
						if (M.density) {
							yield* M.open();
						} else {
							yield* M.close();
						}
					}
				}
			}
		} else if (item === "pai") {
			const item_2 = rt.at(href_list, "option");
			if (item_2 === "1") {
				yield* this.pai.attack_self(U);
			} else if (item_2 === "2") {
				if (_T = rt.getStep(f, this.loc, 0)) {
					this.pai.loc = _T;
				}
			}
		} else {
			// tg_js fix (2017 tg bug): any other choice went text2num'd straight into mode, so a made-up href left it null, negative or fractional. Only a page number (a whole number 0..999) is taken.
			_T = text2num(rt.at(href_list, "choice"));
			if (typeof _T === "number" && Number.isInteger(_T) && _T >= 0 && _T <= 999) {
				this.mode = _T;
			}
		}
	} else {
		yield* U.unset_machine();
		rt.op(f, "Browse", [], [U, null, "window=pda"], false);
		return f.dot;
	}
	if (this.mode == 2 || this.mode == 21) {
		yield* this.update_icon();
	}
	if (this.honkamt > 0 && prob(60)) {
		this.honkamt--;
		playsound(this.loc, rt.rsc("sound/items/bikehorn.ogg"), 30, 1);
	}
	if (U.machine == this && rt.at(href_list, "skiprefresh") != "1") {
		yield* this.attack_self(U);
	} else {
		yield* U.unset_machine();
		rt.op(f, "Browse", [], [U, null, "window=pda"], false);
	}
	return f.dot;
}, true);

// PDA.dm:492
rt.def("/obj/item/device/pda/proc/remove_id", function* remove_id(f: Frame) {
	let M: Value = null;
	if (!this.id) return f.dot;
	if (ismob(this.loc)) {
		yield* (M = this.loc).put_in_hands(this.id);
		to_chat(f.usr, `<span class='notice'>You remove the ID from the ${this.name}.</span>`);
	} else {
		this.id.loc = rt.getStep(f, this, 0);
	}
	this.id = null;
	yield* this.update_icon();
	return f.dot;
}, true);

// PDA.dm:502
rt.def("/obj/item/device/pda/proc/msg_input", function* msg_input(f: Frame, U: Value) {
	let t: Value = null;
	U ??= f.usr;
	if (!(t = (yield* stripped_input(U, "Please enter message", this.name, null, 1024))) || this.toff) {
		return f.dot;
	}
	if (!(get_dist(this, U) <= 1) && this.loc != U) {
		return f.dot;
	}
	if (!U.canUseTopic(this)) {
		return f.dot;
	}
	if (this.emped) {
		t = Gibberish(t, 100);
	}
	return t;
}, true);

// PDA.dm:514
rt.def("/obj/item/device/pda/proc/send_message", function* send_message(f: Frame, user: Value, targets: Value) {
	let message: Value = null, last_sucessful_msg: Value = null, _P: Value = null, MS: Value = null, msg: Value = null;
	user ??= f.usr;
	if (!(message = (yield* this.msg_input(user))) || !rt.len(f, targets)) {
		return f.dot;
	}
	if (this.last_text && rt.worldTime(f) < this.last_text + 5) {
		return f.dot;
	}
	let multiple: Value = (rt.len(f, targets) > 1 ? 1 : 0);
	for (_P of each(targets, T("/obj/item/device/pda"))) {
		if (_P == this) {
			continue;
		}
		MS = null;
		if (MS = (yield* this.can_send(_P))) {
			if (msg = MS.send_pda_message(`${_P.owner}`, `${this.owner}`, `${message}`, this.photo)) {
				last_sucessful_msg = msg;
			}
			if (!multiple) {
				this.show_to_sender(msg, 0, _P);
			}
			_P.show_recieved_message(msg, this);
			if (!multiple) {
				this.show_to_ghosts(user, msg);
				log_pda(`${user} (PDA: ${this.name}) sent "${message}" to ${_P.name}`);
			}
		} else if (!multiple) {
			to_chat(user, "<span class='notice'>ERROR: Server isn't responding.</span>");
			return f.dot;
		}
	}
	this.photo = null;
	if (!multiple) return f.dot;
	this.show_to_sender(last_sucessful_msg, 1);
	this.show_to_ghosts(user, last_sucessful_msg, 1);
	log_pda(`${user} (PDA: ${this.name}) sent "${message}" to Everyone`);
	return f.dot;
}, true);

// PDA.dm:552
rt.def("/obj/item/device/pda/proc/show_to_sender", function show_to_sender(f: Frame, msg: Value, multiple: Value, target: Value) {
	let $0: any;
	multiple ??= 0;
	if (multiple) {
		$0 = "Everyone";
	} else {
		$0 = msg.recipient;
	}
	if (msg !== null) {
		this.log_message(1, multiple ? null : target, multiple || target === null ? $0 : `${target.owner} (${target.ownjob})`, rt.fv(f, "message", msg), msg.get_photo_ref());
	}
	this.tnote += `<i><b>&rarr; To ${$0}:</b></i><br>${rt.fv(f, "message", msg)}${msg.get_photo_ref()}<br>`;
	GLOB.SStgui.update_uis(this);
	return f.dot;
});

// /obj/item/device/pda/proc/log_message  (tg_js)
// The Messages screen's list: one entry per message, out = 1 for sent, pda = the other PDA's ref (null for Send To All), name = "Owner (Job)".
// text and photo are already HTML (stripped_input / get_photo_ref), as in tnote.
rt.def("/obj/item/device/pda/proc/log_message", function log_message(f: Frame, out: Value, other: Value, name: Value, text: Value, photo: Value) {
	if (this.msglog === null) {
		this.msglog = list();
	}
	pdaRow(this.msglog, ["out", out, "pda", other === null ? null : fmt("＃", [other]), "name", name, "text", text, "photo", photo]);
	return f.dot;
});

// /obj/item/device/pda/proc/chat_messages  (tg_js)
// msglog as the Messages screen shows it: only the messages with chat_target's PDA when one is open, else all of them.
rt.def("/obj/item/device/pda/proc/chat_messages", function chat_messages(f: Frame) {
	const log = this.msglog, chat = this.chat_target, msgs = list();
	for (let i = 1; log !== null && i <= rt.len(f, log); i++) {
		const M = rt.at(log, i);
		if (chat === null || rt.at(M, "pda") == chat) rt.modify(msgs, list(M), add);
	}
	return msgs;
});

// PDA.dm:555
rt.def("/obj/item/device/pda/proc/show_recieved_message", function show_recieved_message(f: Frame, msg: Value, source: Value) {
	let L: Value = null, hrefstart: Value = null, hrefend: Value = null;
	this.log_message(0, source, `${source.owner} (${source.ownjob})`, rt.fv(f, "message", msg), msg.get_photo_ref());
	this.tnote += fmt("<i><b>&larr; From <a href='byond://?src=＃;choice=Message;target=＃'>＀</a> (＀):</b></i><br>＀＀<br>", [this, source, source.owner, source.ownjob, rt.fv(f, "message", msg), msg.get_photo_ref()]);
	if (!this.silent) {
		playsound(this.loc, rt.rsc("sound/machines/twobeep.ogg"), 50, 1);
		this.audible_message(`${bicon(this)} *${this.ttone}*`, null, 3);
	}
	if (this.loc && rt.istype(this.loc, T("/mob/living"))) {
		L = this.loc;
	} else {
		L = get(this, T("/mob/living/silicon"));
	}
	if (L && L.stat != 1) {
		if (rt.istype(L, T("/mob/living/silicon/ai"))) {
			hrefstart = fmt("<a href='?src=＃;track=＀'>", [L, html_encode(source.owner)]);
			hrefend = "</a>";
		}
		to_chat(L, fmt("＀ <b>Message from ＀＀ (＀)＀, </b>\"＀\"＀ (<a href='byond://?src=＃;choice=Message;skiprefresh=1;target=＃'>Reply</a>)", [bicon(this), hrefstart, source.owner, source.ownjob, hrefend, rt.fv(f, "message", msg), msg.get_photo_ref(), this, source]));
	}
	this.update_icon();
	this.add_overlay(this.icon_alert);
	GLOB.SStgui.update_uis(this);
	return f.dot;
});

// PDA.dm:582
rt.def("/obj/item/device/pda/proc/show_to_ghosts", function show_to_ghosts(f: Frame, user: Value, msg: Value, multiple: Value) {
	let M: Value = null, link: Value = null;
	let $0: any, $1: any, $2: any, $3: any, $e: any;
	multiple ??= 0;
	for (M of each(GLOB.player_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/dead/observer")) && M.client && rt.bitAnd(M.client.prefs.chat_toggles, 256)) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, user]);
			$0 = M;
			$1 = link;
			$2 = msg.sender;
			if (multiple) {

				$3 = "Everyone";
			} else {
				$3 = msg.recipient;
			}
			to_chat($0, `${$1} <span class='name'>${$2} </span><span class='game say'>PDA Message</span> --> <span class='name'>${$3}</span>: <span class='message'>${rt.fv(f, "message", msg)}${msg.get_photo_ref()}</span></span>`);
		}
	}
	return f.dot;
});

// PDA.dm:588
rt.def("/obj/item/device/pda/proc/can_send", function* can_send(f: Frame, _P: Value) {
	let useMS: Value = null, MS: Value = null, pos: Value = null;
	if (!_P || !_P || _P.gc_destroyed || _P.toff) {
		return null;
	}
	if (GLOB.message_servers) {
		for (MS of each(GLOB.message_servers, T("/obj/machinery/message_server"))) {
			if (MS.active) {
				useMS = MS;
				break;
			}
		}
	}
	let signal: Value = (yield* this.telecomms_process());
	if (!_P || !_P || _P.gc_destroyed || _P.toff) {
		return null;
	}
	let useTC: Value = 0;
	if (signal) {
		if (rt.index(signal.data, "done")) {
			useTC = 1;
			if (rt.isIn(f, (pos = rt.getStep(f, _P, 0)).z, rt.index(signal.data, "level"))) {
				useTC = 2;
			}
		}
	}
	if (useTC == 2) {
		return useMS;
	} else {
		return null;
	}
}, true);

// PDA.dm:619
rt.def("/obj/item/device/pda/proc/send_to_all", function* send_to_all(f: Frame, U: Value) {
	U ??= f.usr;
	yield* this.send_message(U, get_viewable_pdas());
	return f.dot;
}, true);

// PDA.dm:622
rt.def("/obj/item/device/pda/proc/create_message", function* create_message(f: Frame, U: Value, _P: Value) {
	U ??= f.usr;
	yield* this.send_message(U, list(_P));
	return f.dot;
}, true);

// PDA.dm:625
rt.def("/obj/item/device/pda/proc/AltClick", function* AltClick(f: Frame) {
	yield* parent_proc();
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this)) return f.dot;
	if (this.id) {
		yield* this.remove_id();
	} else {
		yield* this.remove_pen();
	}
	return f.dot;
}, true);

// PDA.dm:641
rt.def("/obj/item/device/pda/verb/verb_remove_id", function* verb_remove_id(f: Frame) {
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this)) return f.dot;
	if (this.id) {
		yield* this.remove_id();
	} else {
		to_chat(f.usr, "<span class='warning'>This PDA does not have an ID in it!</span>");
	}
	return f.dot;
}, true, { verb: { name: "Eject ID", category: "Object", src: 11 } });

// PDA.dm:655
rt.def("/obj/item/device/pda/verb/verb_remove_pen", function* verb_remove_pen(f: Frame) {
	if (rt.istype(f.usr, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!f.usr.canUseTopic(this)) return f.dot;
	yield* this.remove_pen();
	return f.dot;
}, true, { verb: { name: "Remove Pen", category: "Object", src: 11 } });

// PDA.dm:663
rt.def("/obj/item/device/pda/proc/remove_pen", function* remove_pen(f: Frame) {
	let M: Value = null;
	if (this.inserted_item) {
		if (ismob(this.loc)) {
			yield* (M = this.loc).put_in_hands(this.inserted_item);
		} else {
			yield* this.inserted_item.forceMove(rt.getStep(f, this, 0));
		}
		to_chat(f.usr, fmt("<span class='notice'>You remove ％！ from ％！.</span>", [this.inserted_item, this]));
		this.inserted_item = null;
		yield* this.update_icon();
	} else {
		to_chat(f.usr, "<span class='warning'>This PDA does not have a pen in it!</span>");
	}
	return f.dot;
}, true);

// PDA.dm:676
rt.def("/obj/item/device/pda/proc/id_check", function* id_check(f: Frame, user: Value, I: Value) {
	let C: Value = null, old_id: Value = null;
	if (!I) {
		if (this.id) {
			yield* this.remove_id();
			return 1;
		} else if (rt.istype((C = user.get_active_held_item()), T("/obj/item/weapon/card/id"))) {
			I = C;
		}
	}
	if (I && I.registered_name) {
		if (!(yield* user.transferItemToLoc(I, this))) {
			return 0;
		}
		old_id = this.id;
		this.id = I;
		if (old_id) {
			yield* user.put_in_hands(old_id);
		}
		yield* this.update_icon();
	}
	return 1;
}, true);

// PDA.dm:697
rt.def("/obj/item/device/pda/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let idcard: Value = null, _P: Value = null;
	if (rt.istype(C, T("/obj/item/weapon/cartridge")) && !this.cartridge) {
		if (!(yield* user.transferItemToLoc(C, this))) {
			return f.dot;
		}
		this.cartridge = C;
		this.cartridge.host_pda = this;
		to_chat(user, `<span class='notice'>You insert ${this.cartridge} into ${this}.</span>`);
		yield* this.update_icon();
	} else if (rt.istype(C, T("/obj/item/weapon/card/id"))) {
		if (!(idcard = C).registered_name) {
			to_chat(user, fmt("<span class='warning'>＄！ rejects the ID!</span>", [this]));
			return f.dot;
		}
		if (!this.owner) {
			this.owner = idcard.registered_name;
			this.ownjob = idcard.assignment;
			this.update_label();
			to_chat(user, "<span class='notice'>Card scanned.</span>");
		} else {
			if ((rt.isIn(f, this, user.contents) || isturf(this.loc) && get_dist(this, user) <= 1) && rt.isIn(f, C, user.contents)) {
				if (!(yield* this.id_check(user, idcard))) {
					return f.dot;
				}
				to_chat(user, fmt("<span class='notice'>You put the ID into ％！'s slot.</span>", [this]));
				yield* this.updateSelfDialog();
			}
			return f.dot;
		}
		yield* this.updateSelfDialog();
	} else if (rt.istype(C, T("/obj/item/device/paicard")) && !this.pai) {
		if (!(yield* user.transferItemToLoc(C, this))) {
			return f.dot;
		}
		this.pai = C;
		to_chat(user, fmt("<span class='notice'>You slot ％！ into ＀.</span>", [C, this]));
		yield* this.update_icon();
		yield* this.updateUsrDialog();
	} else if (is_type_in_list(C, this.contained_item)) {
		if (this.inserted_item) {
			to_chat(user, fmt("<span class='warning'>There is already ＇！ in ％！!</span>", [this.inserted_item, this]));
		} else {
			if (!(yield* user.transferItemToLoc(C, this))) {
				return f.dot;
			}
			to_chat(user, fmt("<span class='notice'>You slide ％！ into ％！.</span>", [C, this]));
			this.inserted_item = C;
			yield* this.update_icon();
		}
	} else if (rt.istype(C, T("/obj/item/weapon/photo"))) {
		this.photo = (_P = C).img;
		to_chat(user, fmt("<span class='notice'>You scan ％！.</span>", [C]));
	} else if (this.hidden_uplink && this.hidden_uplink.active) {
		yield* this.hidden_uplink.attackby(C, user, params);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// PDA.dm:750
rt.def("/obj/item/device/pda/proc/attack", function* attack(f: Frame, C: Value, user: Value) {
	if (!rt.istype(C, T("/mob/living/carbon"))) return f.dot;
	if (this.scanmode === 1) {
		C.visible_message(`<span class='alert'>${user} has analyzed ${C}'s vitals!</span>`);
		healthscan(user, C, 1);
		yield* this.add_fingerprint(user);
	} else if (this.scanmode === 2) {
	} else if (this.scanmode === 4) {
		C.visible_message(`<span class='warning'>${user} has analyzed ${C}'s radiation levels!</span>`);
		user.show_message(`<span class='notice'>Analyzing Results for ${C}:</span>`);
		if (C.radiation) {
			user.show_message(` Radiation Level:  ${C.radiation}`);
		} else {
			user.show_message("<span class='notice'>No radiation detected.</span>");
		}
	}
	return f.dot;
}, true);

// PDA.dm:771
rt.def("/obj/item/device/pda/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let reagents_length: Value = null, re: Value = null, _T: Value = null, PA: Value = null, _P: Value = null, RC: Value = null, F: Value = null, PP: Value = null;
	let $e: any;
	if (!proximity) {
		return f.dot;
	}
	if (this.scanmode === 3) {
		if (A.reagents !== null) {
			if (rt.len(f, A.reagents.reagent_list) > 0) {
				reagents_length = rt.len(f, A.reagents.reagent_list);
				to_chat(user, `<span class='notice'>${reagents_length} chemical agent${reagents_length > 1 ? "s" : ""} found.</span>`);
				for (re of each(A.reagents.reagent_list)) {
					to_chat(user, `<span class='notice'>\t ${re}</span>`);
				}
			} else {
				to_chat(user, `<span class='notice'>No active chemical agents found in ${A}.</span>`);
			}
		} else {
			to_chat(user, `<span class='notice'>No significant chemical agents found in ${A}.</span>`);
		}
	} else if (this.scanmode === 5) {
		if (rt.istype(A, T("/obj/item/weapon/tank"))) {
			this.atmosanalyzer_scan((_T = A).air_contents, user, _T);
		} else if (rt.istype(A, T("/obj/machinery/portable_atmospherics"))) {
			this.atmosanalyzer_scan((PA = A).air_contents, user, PA);
		} else if (rt.istype(A, T("/obj/machinery/atmospherics/pipe"))) {
			this.atmosanalyzer_scan((_P = A).parent.air, user, _P);
		} else if (rt.istype(A, T("/obj/machinery/power/rad_collector"))) {
			if ((RC = A).loaded_tank) {
				this.atmosanalyzer_scan(RC.loaded_tank.air_contents, user, RC);
			}
		} else if (rt.istype(A, T("/obj/item/weapon/flamethrower"))) {
			if ((F = A).ptank) {
				this.atmosanalyzer_scan(F.ptank.air_contents, user, F);
			}
		}
	}
	if (!(!this.scanmode && rt.istype(A, T("/obj/item/weapon/paper")) && this.owner)) return f.dot;
	if (!(PP = A).info) {
		to_chat(user, "<span class='warning'>Unable to scan! Paper is blank.</span>");
		return f.dot;
	}
	this.notehtml = PP.info;
	this.note = replacetext(this.notehtml, "<BR>", "[br]");
	this.note = replacetext(this.note, "<li>", "[*]");
	this.note = replacetext(this.note, "<ul>", "[list]");
	this.note = replacetext(this.note, "</ul>", "[/list]");
	this.note = html_encode(this.note);
	this.notescanned = 1;
	to_chat(user, "<span class='notice'>Paper scanned. Saved to PDA's notekeeper.</span>");
	return f.dot;
});

// PDA.dm:821
rt.def("/obj/item/device/pda/proc/explode", function* explode(f: Frame) {
	let M: Value = null;
	if (!this.detonatable) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (ismob(this.loc)) {
		(M = this.loc).show_message(`<span class='userdanger'>Your ${this} explodes!</span>`, 1);
	} else {
		this.visible_message(`<span class='danger'>${this} explodes!</span>`, "<span class='warning'>You hear a loud *pop*!</span>");
	}
	if (_T) {
		yield* _T.hotspot_expose(700, 125);
		if (rt.istype(this.cartridge, T("/obj/item/weapon/cartridge/virus/syndicate"))) {
			yield* explosion(_T, -1, 1, 3, 4);
		} else {
			yield* explosion(_T, -1, -1, 2, 3);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// PDA.dm:840
rt.def("/obj/item/device/pda/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.PDAs -= this;
	if (rt.istype(this.id, T("/obj/item/weapon/card/id"))) {
		yield* qdel(this.id);
		this.id = null;
	}
	if (rt.istype(this.cartridge, T("/obj/item/weapon/cartridge"))) {
		yield* qdel(this.cartridge);
		this.cartridge = null;
	}
	if (rt.istype(this.pai, T("/obj/item/device/paicard"))) {
		yield* qdel(this.pai);
		this.pai = null;
	}
	if (rt.istype(this.inserted_item, T("/obj/item"))) {
		yield* qdel(this.inserted_item);
		this.inserted_item = null;
	}
	return (yield* parent_proc());
}, true);

// PDA.dm:854
rt.def("/mob/living/silicon/ai/proc/cmd_send_pdamesg", function* cmd_send_pdamesg(f: Frame, user: Value) {
	let _P: Value = null, c: Value = null, add_photo: Value = null, Pic: Value = null;
	let plist: Value = list();
	let namecounts: Value = list();
	if (user.stat == 2) {
		return f.dot;
	}
	if (this.aiPDA.toff) {
		to_chat(user, "Turn on your receiver in order to send messages.");
		return f.dot;
	}
	for (_P of each(get_viewable_pdas(), T("/obj/item/device/pda"))) {
		if (_P == this) {
			continue;
		}
		if (_P == this.aiPDA) {
			continue;
		}
		rt.setAt(plist, avoid_assoc_duplicate_keys(_P.owner, namecounts), _P);
	}
	if (!(c = (yield* g.op(f, "Prompt", [1], [null, null, "Please select a PDA", user, (yield* sortList(plist))])))) {
		return f.dot;
	}
	let selected: Value = rt.index(plist, c);
	if (rt.len(f, this.aicamera.aipictures) > 0) {
		if ((add_photo = (yield* g.op(f, "Prompt", [1], ["No", "Photo", "Do you want to attach a photo?", user, list("Yes", "No")]))) == "Yes") {
			Pic = (yield* this.aicamera.selectpicture(this.aicamera));
			this.aiPDA.photo = rt.index(Pic.fields, "img");
		}
	}
	yield* this.aiPDA.create_message(this, selected);
	return f.dot;
}, true);

// PDA.dm:890
rt.def("/mob/living/silicon/ai/verb/cmd_toggle_pda_receiver", function cmd_toggle_pda_receiver(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	if (this.aiPDA !== null) {
		this.aiPDA.toff = (!this.aiPDA.toff ? 1 : 0);
		to_chat(f.usr, `<span class='notice'>PDA sender/receiver toggled ${this.aiPDA.toff ? "Off" : "On"}!</span>`);
	} else {
		to_chat(f.usr, "You do not have a PDA. You should make an issue report about this.");
	}
	return f.dot;
}, false, { verb: { name: "PDA - Toggle Sender/Receiver", category: "AI Commands" } });

// PDA.dm:901
rt.def("/mob/living/silicon/ai/verb/cmd_toggle_pda_silent", function cmd_toggle_pda_silent(f: Frame) {
	if (f.usr.stat == 2) {
		return f.dot;
	}
	if (this.aiPDA !== null) {
		this.aiPDA.silent = (!this.aiPDA.silent ? 1 : 0);
		to_chat(f.usr, `<span class='notice'>PDA ringer toggled ${this.aiPDA.silent ? "Off" : "On"}!</span>`);
	} else {
		to_chat(f.usr, "You do not have a PDA. You should make an issue report about this.");
	}
	return f.dot;
}, false, { verb: { name: "PDA - Toggle Ringer", category: "AI Commands" } });

// PDA.dm:911
rt.def("/mob/living/silicon/ai/proc/cmd_show_message_log", function cmd_show_message_log(f: Frame, user: Value) {
	let HTML: Value = null;
	if (user.stat == 2) {
		return f.dot;
	}
	if (this.aiPDA !== null) {
		HTML = `<html><head><title>AI PDA Message Log</title></head><body>${this.aiPDA.tnote}</body></html>`;
		rt.op(f, "Browse", [], [user, HTML, "window=log;size=400x444;border=1;can_resize=1;can_close=1;can_minimize=0"], false);
	} else {
		to_chat(user, "You do not have a PDA. You should make an issue report about this.");
	}
	return f.dot;
});

// PDA.dm:922
rt.def("/obj/item/device/pda/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	let A: Value = null;
	for (A of each(this, T("/atom"))) {
		yield* A.emp_act(severity);
	}
	this.emped += 1;
	rt.spawnTail(f, 200 * severity, "/obj/item/device/pda/proc/emp_act: spawn at game/objects/items/devices/PDA/PDA.dm:925", severity, A);
	return f.dot;
}, true);

// a spawn(multiply(200, live(severity))) body of /obj/item/device/pda/proc/emp_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/pda/proc/emp_act: spawn at game/objects/items/devices/PDA/PDA.dm:925", function* (f: Frame, severity: Value, A: Value) {
	this.emped -= 1;
	return null;
});

// PDA.dm:929
rt.def("/proc/get_viewable_pdas", function get_viewable_pdas(f: Frame) {
	let _P: Value = null;
	f.dot = list();
	for (_P of each(GLOB.PDAs, T("/obj/item/device/pda"))) {
		if (!_P.owner || _P.toff || _P.hidden) {
			continue;
		}
		f.dot += _P;
	}
	return f.dot;
});
