// From code/game/gamemodes/antag_spawner.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5647, "/obj/item/weapon/antag_spawner/contract", "/obj/item/weapon/antag_spawner", {
	name: "contract",
	desc: "A magic contract previously signed by an apprentice. In exchange for instruction in the magical arts, they are bound to answer your call for aid.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// /obj/item/weapon/antag_spawner/contract/proc/attack_self  (code/game/gamemodes/antag_spawner.dm:23)  may sleep
rt.def("/obj/item/weapon/antag_spawner/contract/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = null;
	if (truthy(rt.sv(f, "used"))) {
		dat = "<B>You have already summoned your apprentice.</B><BR>";
	} else {
		dat = "<B>Contract of Apprenticeship:</B><BR>";
		dat = rt.modify(live(dat), "<I>Using this contract, you may summon an apprentice to aid you on your mission.</I><BR>", add);
		dat = rt.modify(live(dat), "<I>If you are unable to establish contact with your apprentice, you can feed the contract back to the spellbook to refund your points.</I><BR>", add);
		dat = rt.modify(live(dat), "<B>Which school of magic is your apprentice studying?:</B><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;school=destruction'>Destruction</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<I>Your apprentice is skilled in offensive magic. They know Magic Missile and Fireball.</I><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;school=bluespace'>Bluespace Manipulation</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<I>Your apprentice is able to defy physics, melting through solid objects and travelling great distances in the blink of an eye. They know Teleport and Ethereal Jaunt.</I><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;school=healing'>Healing</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<I>Your apprentice is training to cast spells that will aid your survival. They know Forcewall and Charge and come with a Staff of Healing.</I><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='byond://?src=＃;school=robeless'>Robeless</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<I>Your apprentice is training to cast spells without their robes. They know Knock and Mindswap.</I><BR>", add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=radio"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "radio"]);
	return live(f.dot);
}, true);

// /obj/item/weapon/antag_spawner/contract/proc/Topic  (code/game/gamemodes/antag_spawner.dm:45)  may sleep
rt.def("/obj/item/weapon/antag_spawner/contract/proc/Topic", function* Topic(f: Frame) {
	let H: Value = null, candidates: Value = null, theghost: Value = null;
	f.vars = () => [H, candidates, theghost];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.gv(f, "stat", (H = live(f.usr)))) || truthy((yield* g.callName(f, live(H), "restrained", []))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 1;
	}
	if (!(isEqual(rt.sv(f, "loc"), live(H)) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(H)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))))) return f.dot;
	yield* g.callName(f, live(H), "set_machine", [live(f.src)]);
	if (!truthy(rt.at(live(f.args[1]), "school"))) return f.dot;
	if (truthy(rt.sv(f, "used"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You already used this contract!"]);
		return live(f.dot);
	}
	if (truthy(rt.getLen(f, (candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to play as a wizard's ＀ apprentice?", [rt.at(live(f.args[1]), "school")]), "wizard", null, "wizard", 150, live(f.src)])))))) {
		if (truthy(rt.sv(f, "used"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(H), "You already used this contract!"]);
			return live(f.dot);
		}
		rt.setSv(f, "used", 1);
		yield* g.srcCall(f, "spawn_antag", rt.gv(f, "client", (theghost = rt.op(f, "PickUnweighted", [1], [live(candidates)]))), rt.getStep(f, live(f.src), 0), rt.at(live(f.args[1]), "school"));
		if ((truthy(live(H)) && truthy(rt.fv(f, "mind", live(H))))) {
			yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_added", [rt.fv(f, "mind", live(H))]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "Unable to reach your apprentice! You can either attack the spellbook with the contract to refund your points, or wait and try again later."]);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });

// /obj/item/weapon/antag_spawner/contract/proc/spawn_antag  (code/game/gamemodes/antag_spawner.dm:73)  may sleep
rt.def("/obj/item/weapon/antag_spawner/contract/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value, type: Value) {
	let M: Value = null, wizard_name: Value = null, wizard_name_first: Value = null, wizard_name_second: Value = null, randomname: Value = null, new_objective: Value = null, newname: Value = null;
	let $0: any;
	f.vars = () => [C, _T, type, M, wizard_name, wizard_name_first, wizard_name_second, randomname, new_objective, newname, $0];
	if (live(type) === null) {
		type = "";
	}
	yield* g.new_(f, T("/obj/effect/particle_effect/smoke"), [live(_T)]);
	M = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(_T)]));
	yield* g.callName(f, rt.fv(f, "prefs", live(C)), "copy_to", [live(M)]);
	rt.setFv(f, "key", live(M), rt.fv(f, "key", live(C)));
	wizard_name = "the wizard";
	if (truthy(live(f.usr))) {
		wizard_name = rt.fv(f, "real_name", live(f.usr));
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>You are ＀'s apprentice! You are bound by magic contract to follow their orders and help them in accomplishing their goals.", [live(wizard_name)])]);
	$0 = live(type);
	if ($0 === "destruction") {
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball"), [null]))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>Your service has not gone unrewarded, however. Studying under ＀, you have learned powerful, destructive spells. You are able to cast magic missile and fireball.", [live(wizard_name)])]);
	} else if ($0 === "bluespace") {
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), [null]))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>Your service has not gone unrewarded, however. Studying under ＀, you have learned reality bending mobility spells. You are able to cast teleport and ethereal jaunt.", [live(wizard_name)])]);
	} else if ($0 === "healing") {
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/charge"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/forcewall"), [null]))]);
		yield* g.callName(f, live(M), "put_in_hands_or_del", [(yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/healing"), [live(M)]))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>Your service has not gone unrewarded, however. Studying under ＀, you have learned livesaving survival spells. You are able to cast charge and forcewall.", [live(wizard_name)])]);
	} else if ($0 === "robeless") {
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/knock"), [null]))]);
		yield* g.callName(f, rt.fv(f, "mind", live(M)), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/mind_transfer"), [null]))]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("<B>Your service has not gone unrewarded, however. Studying under ＀, you have learned stealthy, robeless spells. You are able to cast knock and mindswap.", [live(wizard_name)])]);
	}
	yield* g.srcCall(f, "equip_antag", live(M));
	wizard_name_first = rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_first")]);
	wizard_name_second = rt.op(f, "PickUnweighted", [1], [rt.gl("wizard_second")]);
	randomname = fmt("＀ ＀", [live(wizard_name_first), live(wizard_name_second)]);
	if (truthy(live(f.usr))) {
		rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/protect"), []))), rt.fv(f, "mind", live(M)));
		rt.setFv(f, "target", live(new_objective), rt.fv(f, "mind", live(f.usr)));
		rt.setFv(f, "explanation_text", live(new_objective), fmt("Protect ＀, the wizard.", [rt.fv(f, "real_name", live(f.usr))]));
		rt.modField(f, rt.fv(f, "mind", live(M)), "objectives", live(new_objective), add);
	}
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "apprentices", rt.fv(f, "mind", live(M)), add);
	rt.setFv(f, "special_role", rt.fv(f, "mind", live(M)), "apprentice");
	yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "update_wiz_icons_added", [rt.fv(f, "mind", live(M))]);
	rt.op(f, "Output", [], [live(M), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/effects/magic.ogg")]))], false);
	if (!truthy((newname = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/sanitize"), null, [(yield* g.op(f, "Prompt", [3], [live(randomname), "Name change", fmt("You are ＀'s apprentice. Would you like to change your name to something else?", [live(wizard_name)]), live(M), null]))])), 1, 42]))))) {
		newname = live(randomname);
	}
	rt.setFv(f, "name", rt.fv(f, "mind", live(M)), live(newname));
	rt.setFv(f, "real_name", live(M), live(newname));
	rt.setFv(f, "name", live(M), live(newname));
	rt.setFv(f, "age", live(M), (yield* g.call(f, P("/proc/rand"), null, [17, 29])));
	yield* g.callName(f, rt.fv(f, "dna", live(M)), "update_dna_identity", []);
	return f.dot;
}, true);

// /obj/item/weapon/antag_spawner/contract/proc/equip_antag  (code/game/gamemodes/antag_spawner.dm:124)  may sleep
rt.def("/obj/item/weapon/antag_spawner/contract/proc/equip_antag", function* equip_antag(f: Frame, target: Value) {
	f.vars = () => [target];
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/device/radio/headset"), [live(target)])), 7]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/color/lightpurple"), [live(target)])), 14]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [live(target)])), 12]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/suit/wizrobe"), [live(target)])), 13]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/head/wizard"), [live(target)])), 11]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/backpack"), [live(target)])), 1]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/box"), [live(target)])), 18]);
	yield* g.callName(f, live(target), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/teleportation_scroll/apprentice"), [live(target)])), 16]);
	return f.dot;
}, true);

rt.type(5648, "/obj/item/weapon/antag_spawner/nuke_ops", "/obj/item/weapon/antag_spawner", {
	borg_to_spawn: null,
	name: "syndicate operative teleporter",
	desc: "A single-use teleporter designed to quickly reinforce operatives in the field.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
});

// /obj/item/weapon/antag_spawner/nuke_ops/proc/check_usability  (code/game/gamemodes/antag_spawner.dm:144)
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/check_usability", function check_usability(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "used"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is out of power!</span>", [live(f.src)])]);
		return 0;
	}
	if (!truthy((rt.isIn(f, rt.fv(f, "mind", live(user)), rt.gv(f, "syndicates", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>AUTHENTICATION FAILURE. ACCESS DENIED.</span>"]);
		return 0;
	}
	if (!isEqual(rt.fv(f, "z", live(user)), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is out of range! It can only be used at your base!</span>", [live(f.src)])]);
		return 0;
	}
	return 1;
});

// /obj/item/weapon/antag_spawner/nuke_ops/proc/attack_self  (code/game/gamemodes/antag_spawner.dm:156)  may sleep
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let nuke_candidates: Value = null, theghost: Value = null;
	let $0: any;
	f.vars = () => [user, nuke_candidates, theghost, $0];
	if (!truthy((yield* g.srcCall(f, "check_usability", live(user))))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You activate ＀ and wait for confirmation.</span>", [live(f.src)])]);
	if (truthy(rt.sv(f, "borg_to_spawn"))) {
		$0 = fmt("＀ cyborg", [(yield* g.call(f, P("/proc/lowertext"), null, [rt.sv(f, "borg_to_spawn")]))]);
	} else {
		$0 = "operative";
	}
	if (truthy(rt.getLen(f, (nuke_candidates = (yield* g.call(f, P("/proc/pollGhostCandidates"), null, [fmt("Do you want to play as a syndicate ＀?", [$0]), "operative", null, "operative", 150, "syndicate"])))))) {
		if (!truthy((yield* g.srcCall(f, "check_usability", live(user))))) {
			return live(f.dot);
		}
		rt.setSv(f, "used", 1);
		yield* g.srcCall(f, "spawn_antag", rt.gv(f, "client", (theghost = rt.op(f, "PickUnweighted", [1], [live(nuke_candidates)]))), rt.getStep(f, live(f.src), 0), "syndieborg");
		yield* g.call(f, P("/proc/do_sparks"), null, [4, 1, live(f.src)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Unable to connect to Syndicate command. Please wait and try again later or use the teleporter on your uplink to get your points refunded.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/antag_spawner/nuke_ops/proc/spawn_antag  (code/game/gamemodes/antag_spawner.dm:173)  may sleep
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value) {
	let M: Value = null, code: Value = null, nuke: Value = null, newname: Value = null;
	f.vars = () => [C, _T, M, code, nuke, newname];
	M = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(_T)]));
	yield* g.callName(f, rt.fv(f, "prefs", live(C)), "copy_to", [live(M)]);
	rt.setFv(f, "key", live(M), rt.fv(f, "key", live(C)));
	code = "BOMB-NOT-FOUND";
	if (truthy((nuke = rt.locateIn(f, "syndienuke", rt.gl("nuke_list"))))) {
		code = rt.fv(f, "r_code", live(nuke));
	}
	yield* g.callName(f, rt.fv(f, "mind", live(M)), "make_Nuke", [null, live(code), 0, 0]);
	newname = (yield* g.callName(f, rt.gv(f, "species", rt.fv(f, "dna", live(M))), "random_name", [rt.fv(f, "gender", live(M)), 0, rt.gv(f, "nukeops_lastname", rt.fv(f, "mode", rt.gl("SSticker")))]));
	rt.setFv(f, "name", rt.fv(f, "mind", live(M)), live(newname));
	rt.setFv(f, "real_name", live(M), live(newname));
	rt.setFv(f, "name", live(M), live(newname));
	return f.dot;
}, true);

rt.type(5649, "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele", "/obj/item/weapon/antag_spawner/nuke_ops", {
	name: "syndicate cyborg teleporter",
	desc: "A single-use teleporter designed to quickly reinforce operatives in the field..",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
});

// /obj/item/weapon/antag_spawner/nuke_ops/borg_tele/proc/spawn_antag  (code/game/gamemodes/antag_spawner.dm:203)  may sleep
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value) {
	let R: Value = null, brainfirstname: Value = null, brainopslastname: Value = null, brainopsname: Value = null;
	let $0: any;
	f.vars = () => [C, _T, R, brainfirstname, brainopslastname, brainopsname, $0];
	R = null;
	$0 = rt.sv(f, "borg_to_spawn");
	if ($0 === "Medical") {
		R = (yield* g.new_(f, T("/mob/living/silicon/robot/syndicate/medical"), [live(_T)]));
	} else {
		R = (yield* g.new_(f, T("/mob/living/silicon/robot/syndicate"), [live(_T)]));
	}
	brainfirstname = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_male")]);
	if (truthy(rt.op(f, "Prob", [], [50]))) {
		brainfirstname = rt.op(f, "PickUnweighted", [1], [rt.gl("first_names_female")]);
	}
	brainopslastname = rt.op(f, "PickUnweighted", [1], [rt.gl("last_names")]);
	if (truthy(rt.gv(f, "nukeops_lastname", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		brainopslastname = rt.gv(f, "nukeops_lastname", rt.fv(f, "mode", rt.gl("SSticker")));
	}
	brainopsname = fmt("＀ ＀", [live(brainfirstname), live(brainopslastname)]);
	rt.setFv(f, "name", rt.fv(f, "mmi", live(R)), fmt("Man-Machine Interface: ＀", [live(brainopsname)]));
	rt.setFv(f, "name", rt.gv(f, "brain", rt.fv(f, "mmi", live(R))), fmt("＀'s brain", [live(brainopsname)]));
	rt.setFv(f, "real_name", rt.gv(f, "brainmob", rt.fv(f, "mmi", live(R))), live(brainopsname));
	rt.setFv(f, "name", rt.gv(f, "brainmob", rt.fv(f, "mmi", live(R))), live(brainopsname));
	rt.setFv(f, "key", live(R), rt.fv(f, "key", live(C)));
	yield* g.callName(f, rt.fv(f, "mind", live(R)), "make_Nuke", [null, null, "nuke_code", null, "leader", 0, "telecrystals", 1], rt.Args.Named);
	return f.dot;
}, true);

rt.type(5652, "/obj/item/weapon/antag_spawner/slaughter_demon", "/obj/item/weapon/antag_spawner", {
	shatter_msg: "<span class='notice'>You shatter the bottle, no turning back now!</span>",
	veil_msg: "<span class='warning'>You sense a dark presence lurking just beyond the veil...</span>",
	objective_verb: "Kill",
	demon_type: rt.typePath("/mob/living/simple_animal/slaughter"),
	name: "vial of blood",
	desc: "A magically infused bottle of blood, distilled from countless murder victims. Used in unholy rituals to attract horrifying creatures.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "vial",
});

// /obj/item/weapon/antag_spawner/slaughter_demon/proc/attack_self  (code/game/gamemodes/antag_spawner.dm:240)  may sleep
rt.def("/obj/item/weapon/antag_spawner/slaughter_demon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let demon_candidates: Value = null, theghost: Value = null;
	f.vars = () => [user, demon_candidates, theghost];
	if (!isEqual(rt.fv(f, "z", live(user)), 2)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You should probably wait until you reach the station.</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "used"))) {
		return live(f.dot);
	}
	if (truthy(rt.getLen(f, (demon_candidates = (yield* g.call(f, P("/proc/pollCandidatesForMob"), null, [fmt("Do you want to play as a ＀?", [rt.initial(f, rt.sv(f, "demon_type"), "name")]), null, null, "xenomorph", 50, live(f.src)])))))) {
		if (truthy(rt.sv(f, "used"))) {
			return live(f.dot);
		}
		rt.setSv(f, "used", 1);
		yield* g.srcCall(f, "spawn_antag", rt.gv(f, "client", (theghost = rt.op(f, "PickUnweighted", [1], [live(demon_candidates)]))), rt.getStep(f, live(f.src), 0), rt.initial(f, rt.sv(f, "demon_type"), "name"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "shatter_msg")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), rt.sv(f, "veil_msg")]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(user)), rt.rsc("sound/effects/glassbr1.ogg"), 100, 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You can't seem to work up the nerve to shatter the bottle. Perhaps you should try again later.</span>"]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/antag_spawner/slaughter_demon/proc/spawn_antag  (code/game/gamemodes/antag_spawner.dm:262)  may sleep
rt.def("/obj/item/weapon/antag_spawner/slaughter_demon/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value, type: Value) {
	let holder: Value = null, S: Value = null, new_objective: Value = null, new_objective2: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [C, _T, type, holder, S, new_objective, new_objective2, $0, $1, $2];
	if (live(type) === null) {
		type = "";
	}
	holder = (yield* g.new_(f, T("/obj/effect/dummy/slaughter"), [live(_T)]));
	rt.setFv(f, "holder", (S = (yield* g.new_(f, rt.sv(f, "demon_type"), [live(holder)]))), live(holder));
	rt.setFv(f, "key", live(S), rt.fv(f, "key", live(C)));
	rt.setFv(f, "assigned_role", rt.fv(f, "mind", live(S)), rt.fv(f, "name", live(S)));
	rt.setFv(f, "special_role", rt.fv(f, "mind", live(S)), rt.fv(f, "name", live(S)));
	rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(S)), add);
	new_objective = null;
	if (truthy(live(f.usr))) {
		rt.setFv(f, "owner", (new_objective = (yield* g.new_(f, T("/datum/objective/assassinate"), []))), rt.fv(f, "mind", live(S)));
		rt.setFv(f, "target", live(new_objective), rt.fv(f, "mind", live(f.usr)));
		rt.setFv(f, "explanation_text", live(new_objective), fmt("＀ ＀, the one who summoned you.", [rt.sv(f, "objective_verb"), rt.fv(f, "real_name", live(f.usr))]));
		rt.modField(f, rt.fv(f, "mind", live(S)), "objectives", live(new_objective), add);
	}
	rt.setFv(f, "owner", (new_objective2 = (yield* g.new_(f, T("/datum/objective"), []))), rt.fv(f, "mind", live(S)));
	$0 = live(new_objective2);
	$1 = rt.sv(f, "objective_verb");
	if (truthy(live(f.usr))) {
		$1 = $1;
		$2 = " else while you're at it";
	} else {
		$2 = "";
	}
	rt.setFv(f, "explanation_text", $0, fmt("＀ everyone＀.", [$1, $2]));
	rt.modField(f, rt.fv(f, "mind", live(S)), "objectives", live(new_objective2), add);
	yield* g.call(f, P("/proc/to_chat"), null, [live(S), rt.fv(f, "playstyle_string", live(S))]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(S), "<B>You are currently not currently in the same plane of existence as the station. Ctrl+Click a blood pool to manifest.</B>"]);
	if (truthy(live(new_objective))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(S), fmt("<B>Objective #＀</B>: ＀", [1, rt.fv(f, "explanation_text", live(new_objective))])]);
	}
	$0 = live(S);
	if (truthy(live(new_objective))) {
		$1 = fmt("＀", [2]);
	} else {
		$1 = fmt("＀", [1]);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<B>Objective #＀</B>: ＀", [$1, rt.fv(f, "explanation_text", live(new_objective2))])]);
	return f.dot;
}, true);
