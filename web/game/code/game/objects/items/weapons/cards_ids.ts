// From code/game/objects/items/weapons/cards_ids.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7088, "/obj/item/weapon/card", "/obj/item/weapon", {
	files: null,
	name: "card",
	desc: "Does card things.",
	icon: rt.rsc("icons/obj/card.dmi"),
	w_class: 1,
});

// /obj/item/weapon/card/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:20)
rt.def("/obj/item/weapon/card/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "files", rt.list());
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

// /obj/item/weapon/card/data/verb/label  (code/game/objects/items/weapons/cards_ids.dm:36)  may sleep
rt.def("/obj/item/weapon/card/data/verb/label", function* label(f: Frame, t: Value) {
	f.vars = () => [t];
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || !truthy(rt.fv(f, "canmove", live(f.usr)))) || truthy((yield* g.callName(f, live(f.usr), "restrained", []))))) {
		return live(f.dot);
	}
	if (truthy(live(t))) {
		rt.setFv(f, "name", live(f.src), fmt("data disk- '＀'", [live(t)]));
	} else {
		rt.setFv(f, "name", live(f.src), "data disk");
	}
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(f.usr)]);
	return live(f.dot);
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

// /obj/item/weapon/card/emag/proc/afterattack  (code/game/objects/items/weapons/cards_ids.dm:69)  may sleep
rt.def("/obj/item/weapon/card/emag/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let A: Value = null;
	f.vars = () => [target, user, proximity, A];
	A = live(target);
	if ((!truthy(live(proximity)) && truthy(rt.sv(f, "prox_check")))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(A), "emag_act", [live(user)]);
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

// /obj/item/weapon/card/id/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:83)
rt.def("/obj/item/weapon/card/id/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list());
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 100]));
	return f.dot;
});

// /obj/item/weapon/card/id/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:91)  may sleep
rt.def("/obj/item/weapon/card/id/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!(truthy(live(f.args[0])) && truthy(rt.sv(f, "access_txt")))) return f.dot;
	rt.setSv(f, "access", (yield* g.srcCall(f, "text2access", rt.sv(f, "access_txt"))));
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/weapon/card/id/proc/vv_edit_var  (code/game/objects/items/weapons/cards_ids.dm:96)  may sleep
rt.def("/obj/item/weapon/card/id/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	$0 = live(f.args[0]);
	if ($0 === "assignment" || $0 === "registered_name") {
		yield* g.srcCall(f, "update_label");
	}
	return f.dot;
}, true, { args: ["var_name", "var_value"] });

// /obj/item/weapon/card/id/proc/attack_self  (code/game/objects/items/weapons/cards_ids.dm:103)  may sleep
rt.def("/obj/item/weapon/card/id/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.callName(f, live(user), "visible_message", [fmt("<span class='notice'>＀ shows you: ＀ ＀.</span>", [live(user), (yield* g.call(f, P("/proc/bicon"), null, [live(f.src)])), rt.fv(f, "name", live(f.src))]), fmt("<span class='notice'>You show ％！.</span>", [rt.fv(f, "name", live(f.src))])]);
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	return live(f.dot);
}, true);

// /obj/item/weapon/card/id/proc/examine  (code/game/objects/items/weapons/cards_ids.dm:109)
rt.def("/obj/item/weapon/card/id/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "mining_points"))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There's ＀ mining equipment redemption point５ loaded onto this card.", [rt.sv(f, "mining_points")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/card/id/proc/update_label  (code/game/objects/items/weapons/cards_ids.dm:128)
rt.def("/obj/item/weapon/card/id/proc/update_label", function update_label(f: Frame, newname: Value, newjob: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if ((truthy(live(newname)) || truthy(live(newjob)))) {
		if (!truthy(live(newname))) {
			$0 = "identification card";
		} else {
			$0 = fmt("＀'s ID Card", [live(newname)]);
		}
		if (!truthy(live(newjob))) {
			$1 = "";
		} else {
			$1 = fmt(" (＀)", [live(newjob)]);
		}
		rt.setSv(f, "name", fmt("＀＀", [$0, $1]));
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "registered_name"))) {
		$0 = "identification card";
	} else {
		$0 = fmt("＀'s ID Card", [rt.sv(f, "registered_name")]);
	}
	if (!truthy(rt.sv(f, "assignment"))) {
		$1 = "";
	} else {
		$1 = fmt(" (＀)", [rt.sv(f, "assignment")]);
	}
	rt.setSv(f, "name", fmt("＀＀", [$0, $1]));
	return f.dot;
});

rt.type(7096, "/obj/item/weapon/card/id/syndicate", "/obj/item/weapon/card/id", {
	anyone: 0,
	name: "agent card",
	access: null,
	origin_tech: "syndicate=1",
});

// /obj/item/weapon/card/id/syndicate/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:153)  may sleep
rt.def("/obj/item/weapon/card/id/syndicate/proc/Initialize", function* Initialize(f: Frame) {
	let chameleon_action: Value = null;
	f.vars = () => [chameleon_action];
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setFv(f, "chameleon_type", (chameleon_action = (yield* g.new_(f, T("/datum/action/item_action/chameleon/change"), [live(f.src)]))), T("/obj/item/weapon/card/id"));
	rt.setFv(f, "chameleon_name", live(chameleon_action), "ID Card");
	yield* g.callName(f, live(chameleon_action), "initialize_disguises", []);
	return f.dot;
}, true);

// /obj/item/weapon/card/id/syndicate/proc/afterattack  (code/game/objects/items/weapons/cards_ids.dm:160)
rt.def("/obj/item/weapon/card/id/syndicate/proc/afterattack", function afterattack(f: Frame, O: Value, user: Value, proximity: Value) {
	let I: Value = null;
	f.vars = () => [I];
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(O), T("/obj/item/weapon/card/id")) ? 1 : 0))) return f.dot;
	I = live(O);
	(rt.modField(f, live(f.src), "access", rt.fv(f, "access", live(I)), rt.bitOr));
	if (!(truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "mind", live(user))))) return f.dot;
	if (!truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>The card's microscanners activate as you pass it over the ID, copying its access.</span>"]);
	return f.dot;
});

// /obj/item/weapon/card/id/syndicate/proc/attack_self  (code/game/objects/items/weapons/cards_ids.dm:170)  may sleep
rt.def("/obj/item/weapon/card/id/syndicate/proc/attack_self", function* attack_self(f: Frame) {
	let t: Value = null, u: Value = null;
	let $0: any;
	f.vars = () => [t, u, $0];
	if ((truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "mind", live(f.args[0]))))) {
		if ((truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(f.args[0])))) || truthy(rt.sv(f, "anyone")))) {
			if (isEqual((yield* g.call(f, P("/proc/alert"), null, [live(f.args[0]), "Action", "Agent ID", "Show", "Forge"])), "Forge")) {
				if (truthy(rt.sv(f, "registered_name"))) {
					$0 = rt.sv(f, "registered_name");
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
						$0 = rt.fv(f, "real_name", live(f.args[0]));
					} else {
						$0 = rt.fv(f, "name", live(f.args[0]));
					}
				}
				if (((((!truthy((t = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [$0, "Agent card name", "What name would you like to put on this card?", live(f.args[0]), null]))])), 1, 26])))) || isEqual(live(t), "Unknown")) || isEqual(live(t), "floor")) || isEqual(live(t), "wall")) || isEqual(live(t), "r-wall"))) {
					if (truthy(live(t))) {
						yield* g.call(f, P("/proc/alert"), null, ["Invalid name."]);
					}
					return live(f.dot);
				}
				rt.setSv(f, "registered_name", live(t));
				if (!truthy((u = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], ["Assistant", "Agent card job assignment", "What occupation would you like to put on this card?\nNote: This will not grant any access levels other than Maintenance.", live(f.args[0]), null]))])), 1, 1024]))))) {
					rt.setSv(f, "registered_name", "");
					return live(f.dot);
				}
				rt.setSv(f, "assignment", live(u));
				yield* g.srcCall(f, "update_label");
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You successfully forge the ID card.</span>"]);
				return live(f.dot);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(7098, "/obj/item/weapon/card/id/syndicate_command", "/obj/item/weapon/card/id", {
	registered_name: "Syndicate",
	assignment: "Syndicate Overlord",
	name: "syndicate ID card",
	desc: "An ID straight from the Syndicate.",
	access: null,
});

// /obj/item/weapon/card/id/syndicate_command/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:198)
rt.def("/obj/item/weapon/card/id/syndicate_command/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(150));
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

// /obj/item/weapon/card/id/captains_spare/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:209)  may sleep
rt.def("/obj/item/weapon/card/id/captains_spare/proc/Initialize", function* Initialize(f: Frame) {
	let J: Value = null;
	f.vars = () => [J];
	rt.setSv(f, "access", (yield* g.callName(f, (J = (yield* g.new_(f, T("/datum/job/captain"), []))), "get_access", [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7100, "/obj/item/weapon/card/id/centcom", "/obj/item/weapon/card/id", {
	registered_name: "Central Command",
	assignment: "General",
	name: "１Centcom ID",
	desc: "An ID straight from Cent. Com.",
	icon_state: "centcom",
});

// /obj/item/weapon/card/id/centcom/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:221)  may sleep
rt.def("/obj/item/weapon/card/id/centcom/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "access", (yield* g.call(f, P("/proc/get_all_centcom_access"), null, [])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7101, "/obj/item/weapon/card/id/ert", "/obj/item/weapon/card/id", {
	registered_name: "Emergency Response Team Commander",
	assignment: "Emergency Response Team Commander",
	name: "１Centcom ID",
	desc: "A ERT ID card",
	icon_state: "centcom",
});

// /obj/item/weapon/card/id/ert/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:232)  may sleep
rt.def("/obj/item/weapon/card/id/ert/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "access", subtract(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_ert_access"), null, ["commander"]))), 15));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7102, "/obj/item/weapon/card/id/ert/Security", "/obj/item/weapon/card/id/ert", {
	registered_name: "Security Response Officer",
	assignment: "Security Response Officer",
});

// /obj/item/weapon/card/id/ert/Security/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:240)  may sleep
rt.def("/obj/item/weapon/card/id/ert/Security/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "access", subtract(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_ert_access"), null, ["sec"]))), 15));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7103, "/obj/item/weapon/card/id/ert/Engineer", "/obj/item/weapon/card/id/ert", {
	registered_name: "Engineer Response Officer",
	assignment: "Engineer Response Officer",
});

// /obj/item/weapon/card/id/ert/Engineer/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:248)  may sleep
rt.def("/obj/item/weapon/card/id/ert/Engineer/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "access", subtract(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_ert_access"), null, ["eng"]))), 15));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(7104, "/obj/item/weapon/card/id/ert/Medical", "/obj/item/weapon/card/id/ert", {
	registered_name: "Medical Response Officer",
	assignment: "Medical Response Officer",
});

// /obj/item/weapon/card/id/ert/Medical/proc/Initialize  (code/game/objects/items/weapons/cards_ids.dm:256)  may sleep
rt.def("/obj/item/weapon/card/id/ert/Medical/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "access", subtract(add((yield* g.call(f, P("/proc/get_all_accesses"), null, [])), (yield* g.call(f, P("/proc/get_ert_access"), null, ["med"]))), 15));
	yield* g.callSuper(f, [], rt.Args.Same);
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

// /obj/item/weapon/card/id/prisoner/proc/attack_self  (code/game/objects/items/weapons/cards_ids.dm:270)
rt.def("/obj/item/weapon/card/id/prisoner/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>You have accumulated ＀ out of the ＀ points you need for freedom.</span>", [rt.sv(f, "points"), rt.sv(f, "goal")])]);
	return f.dot;
});

rt.type(7114, "/obj/item/weapon/card/id/away", "/obj/item/weapon/card/id", {
	name: "a perfectly generic identification card",
	desc: "A perfectly generic identification card. Looks like it could use some flavor.",
	access: null,
});

// /obj/item/weapon/card/id/away/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:307)
rt.def("/obj/item/weapon/card/id/away/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(200));
	return f.dot;
});

rt.type(7117, "/obj/item/weapon/card/id/away/old", "/obj/item/weapon/card/id/away", {
	name: "a perfectly generic identification card",
	desc: "A perfectly generic identification card. Looks like it could use some flavor.",
	access: null,
});

// /obj/item/weapon/card/id/away/old/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:321)
rt.def("/obj/item/weapon/card/id/away/old/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(200));
	return f.dot;
});

rt.type(7121, "/obj/item/weapon/card/id/away/old/apc", "/obj/item/weapon/card/id/away/old", {
	name: "APC Access ID",
	desc: "Special ID card to allow access to APCs",
	icon_state: "centcom",
	access: null,
});

// /obj/item/weapon/card/id/away/old/apc/proc/<init>  (code/game/objects/items/weapons/cards_ids.dm:342)
rt.def("/obj/item/weapon/card/id/away/old/apc/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "access", rt.list(11));
	return f.dot;
});
