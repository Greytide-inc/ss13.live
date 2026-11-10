// Based on /tg/station's code/game/objects/items/weapons/cards_ids.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(7088, "/obj/item/weapon/card", "/obj/item/weapon", {
	files: null,
	name: "card",
	desc: "Does card things.",
	icon: rt.rsc("icons/obj/card.dmi"),
	w_class: 1,
});

// cards_ids.dm:20
rt.def("/obj/item/weapon/card/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.files = list();
	return f.dot;
});

rt.type(7089, "/obj/item/weapon/card/data", "/obj/item/weapon/card", {
	function: "storage",
	data: "null",
	special: null,
	name: "data disk",
	desc: "A disk of data.",
	icon_state: "data",
	item_state: "card-id",
});

// cards_ids.dm:36
rt.def("/obj/item/weapon/card/data/verb/label", function* label(f: Frame, t: Value) {
	if (f.usr.stat || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (t) {
		this.name = `data disk- '${t}'`;
	} else {
		this.name = "data disk";
	}
	yield* this.add_fingerprint(f.usr);
	return f.dot;
}, true, { verb: { name: "Label Disk", category: "Object", src: 11 }, argTypes: [{ type: 2 }] });

rt.type(7090, "/obj/item/weapon/card/emag", "/obj/item/weapon/card", {
	prox_check: 1,
	flags: 4,
	desc: "It's a card with a magnetic strip attached to some circuitry.",
	name: "cryptographic sequencer",
	icon_state: "emag",
	item_state: "card-id",
	origin_tech: "magnets=2;syndicate=2",
});

// cards_ids.dm:69
rt.def("/obj/item/weapon/card/emag/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let A: Value = target;
	if (!proximity && this.prox_check) {
		return f.dot;
	}
	yield* A.emag_act(user);
	return f.dot;
}, true);

rt.type(7093, "/obj/item/weapon/card/id", "/obj/item/weapon/card", {
	mining_points: 0,
	access: null,
	registered_name: null,
	assignment: null,
	access_txt: null,
	name: "identification card",
	desc: "A card used to provide ID and determine access across the station.",
	icon_state: "id",
	item_state: "card-id",
	slot_flags: 256,
	armor: null,
	resistance_flags: 34,
});

// cards_ids.dm:83
rt.def("/obj/item/weapon/card/id/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]);
	return f.dot;
});

// cards_ids.dm:91
rt.def("/obj/item/weapon/card/id/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!(mapload && this.access_txt)) return f.dot;
	this.access = this.text2access(this.access_txt);
	return f.dot;
}, true);

// cards_ids.dm:96
rt.def("/obj/item/weapon/card/id/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (var_name === "assignment" || var_name === "registered_name") {
		this.update_label();
	}
	return f.dot;
}, true);

// cards_ids.dm:103
rt.def("/obj/item/weapon/card/id/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	user.visible_message(`<span class='notice'>${user} shows you: ${bicon(this)} ${this.name}.</span>`, fmt("<span class='notice'>You show ％！.</span>", [this.name]));
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// cards_ids.dm:109
rt.def("/obj/item/weapon/card/id/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.mining_points) return f.dot;
	to_chat(user, fmt("There's ＀ mining equipment redemption point５ loaded onto this card.", [this.mining_points]));
	return f.dot;
}, false);

// cards_ids.dm:128
rt.def("/obj/item/weapon/card/id/proc/update_label", function update_label(f: Frame, newname: Value, newjob: Value) {
	let $0: any;
	if (newname || newjob) {
		if (!newname) {
			$0 = "identification card";
		} else {
			$0 = `${newname}'s ID Card`;
		}
		this.name = `${$0}${!newjob ? "" : ` (${newjob})`}`;
		return f.dot;
	}
	if (!this.registered_name) {
		$0 = "identification card";
	} else {
		$0 = `${this.registered_name}'s ID Card`;
	}
	this.name = `${$0}${!this.assignment ? "" : ` (${this.assignment})`}`;
	return f.dot;
});

rt.type(7096, "/obj/item/weapon/card/id/syndicate", "/obj/item/weapon/card/id", {
	anyone: 0,
	name: "agent card",
	access: null,
	origin_tech: "syndicate=1",
});

// cards_ids.dm:153
rt.def("/obj/item/weapon/card/id/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	let chameleon_action: Value = null;
	yield* parent_proc();
	(chameleon_action = (yield* new_(T("/datum/action/item_action/chameleon/change"), this))).chameleon_type = T("/obj/item/weapon/card/id");
	chameleon_action.chameleon_name = "ID Card";
	chameleon_action.initialize_disguises();
	return f.dot;
}, true);

// cards_ids.dm:160
rt.def("/obj/item/weapon/card/id/syndicate/proc/afterattack", function afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(O, T("/obj/item/weapon/card/id"))) return f.dot;
	let I: Value = O;
	(rt.modField(f, this, "access", I.access, rt.bitOr));
	if (!(rt.istype(user, T("/mob/living")) && user.mind)) return f.dot;
	if (!user.mind.special_role) return f.dot;
	to_chat(f.usr, "<span class='notice'>The card's microscanners activate as you pass it over the ID, copying its access.</span>");
	return f.dot;
});

// cards_ids.dm:170
rt.def("/obj/item/weapon/card/id/syndicate/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let t: Value = null, u: Value = null;
	let $0: any;
	if (rt.istype(user, T("/mob/living")) && user.mind) {
		if (user.mind.special_role || this.anyone) {
			if ((yield* alert(user, "Action", "Agent ID", "Show", "Forge")) == "Forge") {
				if (this.registered_name) {
					$0 = this.registered_name;
				} else if (rt.istype(user, T("/mob/living/carbon/human"))) {
					$0 = user.real_name;
				} else {
					$0 = user.name;
				}
				if (!(t = copytext(sanitize((yield* g.op(f, "Prompt", [3], [$0, "Agent card name", "What name would you like to put on this card?", user, null]))), 1, 26)) || t == "Unknown" || t == "floor" || t == "wall" || t == "r-wall") {
					if (t) {
						yield* alert("Invalid name.");
					}
					return f.dot;
				}
				this.registered_name = t;
				if (!(u = copytext(sanitize((yield* g.op(f, "Prompt", [3], ["Assistant", "Agent card job assignment", "What occupation would you like to put on this card?\nNote: This will not grant any access levels other than Maintenance.", user, null]))), 1, 1024))) {
					this.registered_name = "";
					return f.dot;
				}
				this.assignment = u;
				this.update_label();
				to_chat(user, "<span class='notice'>You successfully forge the ID card.</span>");
				return f.dot;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7098, "/obj/item/weapon/card/id/syndicate_command", "/obj/item/weapon/card/id", {
	registered_name: "Syndicate",
	assignment: "Syndicate Overlord",
	name: "syndicate ID card",
	desc: "An ID straight from the Syndicate.",
	access: null,
});

// cards_ids.dm:198
rt.def("/obj/item/weapon/card/id/syndicate_command/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list(150);
	return f.dot;
});

rt.type(7099, "/obj/item/weapon/card/id/captains_spare", "/obj/item/weapon/card/id", {
	registered_name: "Captain",
	assignment: "Captain",
	name: "captain's spare ID",
	desc: "The spare ID of the High Lord himself.",
	icon_state: "gold",
	item_state: "gold_id",
});

// cards_ids.dm:209
rt.def("/obj/item/weapon/card/id/captains_spare/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	this.access = (J = (yield* new_(T("/datum/job/captain")))).get_access();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7100, "/obj/item/weapon/card/id/centcom", "/obj/item/weapon/card/id", {
	registered_name: "Central Command",
	assignment: "General",
	name: "１Centcom ID",
	desc: "An ID straight from Cent. Com.",
	icon_state: "centcom",
});

// cards_ids.dm:221
rt.def("/obj/item/weapon/card/id/centcom/proc/Initialize", function* Initialize(f: Frame) {
	this.access = get_all_centcom_access();
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7101, "/obj/item/weapon/card/id/ert", "/obj/item/weapon/card/id", {
	registered_name: "Emergency Response Team Commander",
	assignment: "Emergency Response Team Commander",
	name: "１Centcom ID",
	desc: "A ERT ID card",
	icon_state: "centcom",
});

// cards_ids.dm:232
rt.def("/obj/item/weapon/card/id/ert/proc/Initialize", function* Initialize(f: Frame) {
	this.access = get_all_accesses() + get_ert_access("commander") - 15;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7102, "/obj/item/weapon/card/id/ert/Security", "/obj/item/weapon/card/id/ert", {
	registered_name: "Security Response Officer",
	assignment: "Security Response Officer",
});

// cards_ids.dm:240
rt.def("/obj/item/weapon/card/id/ert/Security/proc/Initialize", function* Initialize(f: Frame) {
	this.access = get_all_accesses() + get_ert_access("sec") - 15;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7103, "/obj/item/weapon/card/id/ert/Engineer", "/obj/item/weapon/card/id/ert", {
	registered_name: "Engineer Response Officer",
	assignment: "Engineer Response Officer",
});

// cards_ids.dm:248
rt.def("/obj/item/weapon/card/id/ert/Engineer/proc/Initialize", function* Initialize(f: Frame) {
	this.access = get_all_accesses() + get_ert_access("eng") - 15;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7104, "/obj/item/weapon/card/id/ert/Medical", "/obj/item/weapon/card/id/ert", {
	registered_name: "Medical Response Officer",
	assignment: "Medical Response Officer",
});

// cards_ids.dm:256
rt.def("/obj/item/weapon/card/id/ert/Medical/proc/Initialize", function* Initialize(f: Frame) {
	this.access = get_all_accesses() + get_ert_access("med") - 15;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(7105, "/obj/item/weapon/card/id/prisoner", "/obj/item/weapon/card/id", {
	goal: 0,
	points: 0,
	assignment: "Prisoner",
	registered_name: "Scum",
	name: "prisoner ID card",
	desc: "You are a number, you are not a free man.",
	icon_state: "orange",
	item_state: "orange-id",
});

// cards_ids.dm:270
rt.def("/obj/item/weapon/card/id/prisoner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(f.usr, `<span class='notice'>You have accumulated ${this.points} out of the ${this.goal} points you need for freedom.</span>`);
	return f.dot;
});

rt.type(7114, "/obj/item/weapon/card/id/away", "/obj/item/weapon/card/id", {
	name: "a perfectly generic identification card",
	desc: "A perfectly generic identification card. Looks like it could use some flavor.",
	access: null,
});

// cards_ids.dm:307
rt.def("/obj/item/weapon/card/id/away/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list(200);
	return f.dot;
});

rt.type(7117, "/obj/item/weapon/card/id/away/old", "/obj/item/weapon/card/id/away", {
	name: "a perfectly generic identification card",
	desc: "A perfectly generic identification card. Looks like it could use some flavor.",
	access: null,
});

// cards_ids.dm:321
rt.def("/obj/item/weapon/card/id/away/old/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list(200);
	return f.dot;
});

rt.type(7121, "/obj/item/weapon/card/id/away/old/apc", "/obj/item/weapon/card/id/away/old", {
	name: "APC Access ID",
	desc: "Special ID card to allow access to APCs",
	icon_state: "centcom",
	access: null,
});

// cards_ids.dm:342
rt.def("/obj/item/weapon/card/id/away/old/apc/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.access = list(11);
	return f.dot;
});
