// Based on /tg/station's code/game/gamemodes/sandbox/h_sandbox.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// h_sandbox.dm:3
rt.def("/datum/controller/global_vars/proc/InitGlobalhsboxspawn", function InitGlobalhsboxspawn(f: Frame) {
	GLOB.hsboxspawn = 1;
	this.gvars_datum_init_order += "hsboxspawn";
	return f.dot;
});

// h_sandbox.dm:8
rt.def("/mob/proc/CanBuild", function* CanBuild(f: Frame) {
	this.sandbox = (yield* new_(T("/datum/hSB")));
	this.sandbox.owner = this.ckey;
	if (this.client.holder) {
		this.sandbox.admin = 1;
	}
	this.verbs += (yield* new_(P("/mob/proc/sandbox_panel")));
	return f.dot;
}, true);

// h_sandbox.dm:16
rt.def("/mob/proc/sandbox_panel", function sandbox_panel(f: Frame) {
	if (!this.sandbox) return f.dot;
	this.sandbox.update();
	return f.dot;
}, false, { verb: { name: "Sandbox Panel" } });

rt.type(1434, "/datum/hSB", "/datum", {
	owner: null,
	admin: 0,
	clothinfo: null,
	reaginfo: null,
	objinfo: null,
	canisterinfo: null,
	hsbinfo: null,
}, { global: { spawn_forbidden: 960 } });

// h_sandbox.dm:76
rt.def("/datum/hSB/proc/update", function update(f: Frame) {
	let _T: Value = null, href: Value = null;
	if (!this.hsbinfo) {
		this.hsbinfo = "<center><b>Sandbox Panel</b></center><hr>";
		if (this.admin) {
			this.hsbinfo += "<b>Administration</b><br>";
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbtobj'>Toggle Object Spawning</a><br>", [this]);
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbtac'>Toggle Item Spawn Panel Auto-close</a><br>", [this]);
			this.hsbinfo += "<b>Canister Spawning</b><br>";
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn Plasma Canister</a><br>", [this, T("/obj/machinery/portable_atmospherics/canister/toxins")]);
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn CO2 Canister</a><br>", [this, T("/obj/machinery/portable_atmospherics/canister/carbon_dioxide")]);
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn Nitrogen Canister</a><br>", [this, T("/obj/machinery/portable_atmospherics/canister/nitrogen")]);
			this.hsbinfo += fmt("- <a href='?src=＃;hsb=hsbspawn&path=＀'>Spawn N2O Canister</a><hr>", [this, T("/obj/machinery/portable_atmospherics/canister/nitrous_oxide")]);
		} else {
			this.hsbinfo += "<i>Some item spawning may be disabled by the administrators.</i><br>";
			this.hsbinfo += "<i>Only administrators may spawn dangerous canisters.</i><br>";
		}
		for (_T of each(GLOB.hrefs)) {
			if (href = rt.index(GLOB.hrefs, _T)) {
				this.hsbinfo += fmt("- <a href='?＃;hsb=＀'>＀</a><br>", [this, rt.index(GLOB.hrefs, _T), _T]);
			} else {
				this.hsbinfo += `<br><b>${_T}</b><br>`;
			}
		}
		this.hsbinfo += "<hr>";
		this.hsbinfo += fmt("- <a href='?＃;hsb=hsbcloth'>Spawn Clothing...</a><br>", [this]);
		this.hsbinfo += fmt("- <a href='?＃;hsb=hsbreag'>Spawn Reagent Container...</a><br>", [this]);
		this.hsbinfo += fmt("- <a href='?＃;hsb=hsbobj'>Spawn Other Item...</a><br><br>", [this]);
	}
	rt.op(f, "Browse", [], [f.usr, this.hsbinfo, "window=hsbpanel"], false);
	return f.dot;
});

// h_sandbox.dm:104
rt.def("/datum/hSB/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let _P: Value = null, hsb: Value = null, ID: Value = null, all_items: Value = null, typekey: Value = null, O: Value = null, typepath: Value = null;
	let $e: any;
	if (!f.usr || !this || this.owner != f.usr.ckey) {
		if (f.usr) {
			rt.op(f, "Browse", [], [f.usr, null, "window=sandbox"], false);
		}
		return f.dot;
	}
	if (!rt.at(href_list, "hsb")) return f.dot;
	const item = rt.at(href_list, "hsb");
	if (item === "hsbtobj") {
		if (!this.admin) {
			return f.dot;
		}
		if (GLOB.hsboxspawn) {
			to_chat(rt.world(), `<span class='boldannounce'>Sandbox:</span> <b>${f.usr.key} has disabled object spawning!</b>`);
			GLOB.hsboxspawn = 0;
			return f.dot;
		} else {
			to_chat(rt.world(), `<span class='boldnotice'>Sandbox:</span> <b>${f.usr.key} has enabled object spawning!</b>`);
			GLOB.hsboxspawn = 1;
			return f.dot;
		}
	} else if (item === "hsbtac") {
		if (!this.admin) {
			return f.dot;
		}
		if (GLOB.config.sandbox_autoclose) {
			to_chat(rt.world(), `<span class='boldnotice'>Sandbox:</span> <b> ${f.usr.key} has removed the object spawn limiter.</b>`);
			GLOB.config.sandbox_autoclose = 0;
		} else {
			to_chat(rt.world(), `<span class='danger'>Sandbox:</span> <b> ${f.usr.key} has added a limiter to object spawning.  The window will now auto-close after use.</b>`);
			GLOB.config.sandbox_autoclose = 1;
		}
		return f.dot;
	} else if (item === "hsbsuit") {
		if (!rt.istype((_P = f.usr), T("/mob/living/carbon/human"))) {
			return f.dot;
		}
		if (_P.wear_suit) {
			_P.wear_suit.loc = _P.loc;
			_P.wear_suit.layer = rt.initial(f, _P.wear_suit, "layer");
			_P.wear_suit.plane = rt.initial(f, _P.wear_suit, "plane");
			_P.wear_suit = null;
		}
		_P.wear_suit = (yield* new_(T("/obj/item/clothing/suit/space"), _P));
		_P.wear_suit.layer = ABOVE_HUD_LAYER;
		_P.wear_suit.plane = ABOVE_HUD_PLANE;
		yield* _P.update_inv_wear_suit();
		if (_P.head) {
			_P.head.loc = _P.loc;
			_P.head.layer = rt.initial(f, _P.head, "layer");
			_P.head.plane = rt.initial(f, _P.head, "plane");
			_P.head = null;
		}
		_P.head = (yield* new_(T("/obj/item/clothing/head/helmet/space"), _P));
		_P.head.layer = ABOVE_HUD_LAYER;
		_P.head.plane = ABOVE_HUD_PLANE;
		yield* _P.update_inv_head();
		if (_P.wear_mask) {
			_P.wear_mask.loc = _P.loc;
			_P.wear_mask.layer = rt.initial(f, _P.wear_mask, "layer");
			_P.wear_mask.plane = rt.initial(f, _P.wear_mask, "plane");
			_P.wear_mask = null;
		}
		_P.wear_mask = (yield* new_(T("/obj/item/clothing/mask/gas"), _P));
		_P.wear_mask.layer = ABOVE_HUD_LAYER;
		_P.wear_mask.plane = ABOVE_HUD_PLANE;
		yield* _P.update_inv_wear_mask();
		if (_P.back) {
			_P.back.loc = _P.loc;
			_P.back.layer = rt.initial(f, _P.back, "layer");
			_P.back.plane = rt.initial(f, _P.back, "plane");
			_P.back = null;
		}
		_P.back = (yield* new_(T("/obj/item/weapon/tank/jetpack/oxygen"), _P));
		_P.back.layer = ABOVE_HUD_LAYER;
		_P.back.plane = ABOVE_HUD_PLANE;
		_P.update_inv_back();
		_P.internal = _P.back;
		_P.update_internals_hud_icon(1);
	} else if (item === "hsbscrubber") {
		yield* (hsb = (yield* g.newOv(f, T("/obj/machinery/portable_atmospherics/scrubber"), "{\"volume_rate\":5066.25,\"on\":1}", [f.usr.loc]))).update_icon();
	} else if (item === "hsbrglass") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/rglass"), "{\"amount\":50}", [f.usr.loc]);
	} else if (item === "hsbmetal") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/metal"), "{\"amount\":50}", [f.usr.loc]);
	} else if (item === "hsbplasteel") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/plasteel"), "{\"amount\":50}", [f.usr.loc]);
	} else if (item === "hsbglass") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/glass"), "{\"amount\":50}", [f.usr.loc]);
	} else if (item === "hsbwood") {
		yield* g.newOv(f, T("/obj/item/stack/sheet/mineral/wood"), "{\"amount\":50}", [f.usr.loc]);
	} else if (item === "hsbaaid") {
		(ID = (yield* new_(T("/obj/item/weapon/card/id/gold"), f.usr.loc))).registered_name = f.usr.real_name;
		ID.assignment = "Sandbox";
		ID.access = get_all_accesses();
		ID.update_label();
	} else if (item === "hsbrcd") {
		if (!GLOB.hsboxspawn) {
			return f.dot;
		}
		yield* new_(T("/obj/item/weapon/construction/rcd/combat"), f.usr.loc);
	} else if (item === "hsbairlock") {
		yield* new_(T("/datum/airlock_maker"), f.usr.loc);
	} else if (item === "hsbcloth") {
		if (!GLOB.hsboxspawn) {
			return f.dot;
		}
		if (!this.clothinfo) {
			this.clothinfo = fmt("<b>Clothing</b> <a href='?＃;hsb=hsbreag'>(Reagent Containers)</a> <a href='?＃;hsb=hsbobj'>(Other Items)</a><hr><br>", [this, this]);
			all_items = typesof(T("/obj/item/clothing")) - T("/obj/item/clothing");
			for (typekey of each(GLOB.spawn_forbidden)) {
				all_items -= typesof(typekey);
			}
			for (O of each(reverseRange(all_items))) {
				this.clothinfo += fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [this, O, O]);
			}
		}
		rt.op(f, "Browse", [], [f.usr, this.clothinfo, "window=sandbox"], false);
	} else if (item === "hsbreag") {
		if (!GLOB.hsboxspawn) {
			return f.dot;
		}
		if (!this.reaginfo) {
			this.reaginfo = fmt("<b>Reagent Containers</b> <a href='?＃;hsb=hsbcloth'>(Clothing)</a> <a href='?＃;hsb=hsbobj'>(Other Items)</a><hr><br>", [this, this]);
			all_items = typesof(T("/obj/item/weapon/reagent_containers")) - T("/obj/item/weapon/reagent_containers");
			typekey = null;
			for (typekey of each(GLOB.spawn_forbidden)) {
				all_items -= typesof(typekey);
			}
			O = null;
			for (O of each(reverseRange(all_items))) {
				this.reaginfo += fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [this, O, O]);
			}
		}
		rt.op(f, "Browse", [], [f.usr, this.reaginfo, "window=sandbox"], false);
	} else if (item === "hsbobj") {
		if (!GLOB.hsboxspawn) {
			return f.dot;
		}
		if (!this.objinfo) {
			this.objinfo = fmt("<b>Other Items</b> <a href='?＃;hsb=hsbcloth'>(Clothing)</a> <a href='?＃;hsb=hsbreag'>(Reagent Containers)</a><hr><br>", [this, this]);
			all_items = typesof(T("/obj/item")) - T("/obj/item") - typesof(T("/obj/item/clothing")) - typesof(T("/obj/item/weapon/reagent_containers"));
			typekey = null;
			for (typekey of each(GLOB.spawn_forbidden)) {
				all_items -= typesof(typekey);
			}
			O = null;
			for (O of each(reverseRange(all_items))) {
				this.objinfo += fmt("<a href='?src=＃;hsb=hsb_safespawn&path=＀'>＀</a><br>", [this, O, O]);
			}
		}
		rt.op(f, "Browse", [], [f.usr, this.objinfo, "window=sandbox"], false);
	} else if (item === "hsb_safespawn") {
		if (!GLOB.hsboxspawn) {
			rt.op(f, "Browse", [], [f.usr, null, "window=sandbox"], false);
			return f.dot;
		}
		if (!(typepath = text2path(rt.at(href_list, "path")))) {
			to_chat(f.usr, `Bad path: "${rt.at(href_list, "path")}"`);
			return f.dot;
		}
		yield* new_(typepath, f.usr.loc);
		if (GLOB.config.sandbox_autoclose) {
			rt.op(f, "Browse", [], [f.usr, null, "window=sandbox"], false);
		}
	} else if (item === "hsbspawn") {
		if (!(typepath = text2path(rt.at(href_list, "path")))) {
			to_chat(f.usr, `Bad path: "${rt.at(href_list, "path")}"`);
			return f.dot;
		}
		yield* new_(typepath, f.usr.loc);
		if (!GLOB.config.sandbox_autoclose) return f.dot;
		rt.op(f, "Browse", [], [f.usr, null, "window=sandbox"], false);
	}
	return f.dot;
}, true);
