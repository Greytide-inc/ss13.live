// Based on /tg/station's code/game/gamemodes/antag_spawner.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(5647, "/obj/item/weapon/antag_spawner/contract", "/obj/item/weapon/antag_spawner", {
	name: "contract",
	desc: "A magic contract previously signed by an apprentice. In exchange for instruction in the magical arts, they are bound to answer your call for aid.",
	icon: rt.rsc("icons/obj/wizard.dmi"),
	icon_state: "scroll2",
});

// antag_spawner.dm:23
rt.def("/obj/item/weapon/antag_spawner/contract/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	yield* user.set_machine(this);
	if (this.used) {
		dat = "<B>You have already summoned your apprentice.</B><BR>";
	} else {
		dat = "<B>Contract of Apprenticeship:</B><BR>";
		dat += "<I>Using this contract, you may summon an apprentice to aid you on your mission.</I><BR>";
		dat += "<I>If you are unable to establish contact with your apprentice, you can feed the contract back to the spellbook to refund your points.</I><BR>";
		dat += "<B>Which school of magic is your apprentice studying?:</B><BR>";
		dat += fmt("<A href='byond://?src=＃;school=destruction'>Destruction</A><BR>", [this]);
		dat += "<I>Your apprentice is skilled in offensive magic. They know Magic Missile and Fireball.</I><BR>";
		dat += fmt("<A href='byond://?src=＃;school=bluespace'>Bluespace Manipulation</A><BR>", [this]);
		dat += "<I>Your apprentice is able to defy physics, melting through solid objects and travelling great distances in the blink of an eye. They know Teleport and Ethereal Jaunt.</I><BR>";
		dat += fmt("<A href='byond://?src=＃;school=healing'>Healing</A><BR>", [this]);
		dat += "<I>Your apprentice is training to cast spells that will aid your survival. They know Forcewall and Charge and come with a Staff of Healing.</I><BR>";
		dat += fmt("<A href='byond://?src=＃;school=robeless'>Robeless</A><BR>", [this]);
		dat += "<I>Your apprentice is training to cast spells without their robes. They know Knock and Mindswap.</I><BR>";
	}
	rt.op(f, "Browse", [], [user, dat, "window=radio"], false);
	onclose(user, "radio");
	return f.dot;
}, true);

// antag_spawner.dm:45
rt.def("/obj/item/weapon/antag_spawner/contract/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let H: Value = null, candidates: Value = null, theghost: Value = null;
	yield* parent_proc();
	if ((H = f.usr).stat || H.restrained()) {
		return f.dot;
	}
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return 1;
	}
	if (!(this.loc == H || get_dist(this, H) <= 1 && isturf(this.loc))) return f.dot;
	yield* H.set_machine(this);
	if (!rt.at(href_list, "school")) return f.dot;
	if (this.used) {
		to_chat(H, "You already used this contract!");
		return f.dot;
	}
	if (rt.len(f, (candidates = (yield* pollCandidatesForMob(`Do you want to play as a wizard's ${rt.at(href_list, "school")} apprentice?`, "wizard", null, "wizard", 150, this))))) {
		if (this.used) {
			to_chat(H, "You already used this contract!");
			return f.dot;
		}
		this.used = 1;
		yield* this.spawn_antag((theghost = pick(candidates)).client, rt.getStep(f, this, 0), rt.at(href_list, "school"));
		if (H && H.mind) {
			GLOB.SSticker.mode.update_wiz_icons_added(H.mind);
		}
	} else {
		to_chat(H, "Unable to reach your apprentice! You can either attack the spellbook with the contract to refund your points, or wait and try again later.");
	}
	return f.dot;
}, true);

// antag_spawner.dm:73
rt.def("/obj/item/weapon/antag_spawner/contract/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value, type: Value) {
	let new_objective: Value = null, newname: Value = null;
	type ??= "";
	yield* new_(T("/obj/effect/particle_effect/smoke"), _T);
	let M: Value = (yield* new_(T("/mob/living/carbon/human"), _T));
	yield* C.prefs.copy_to(M);
	M.key = C.key;
	let wizard_name: Value = "the wizard";
	if (f.usr) {
		wizard_name = f.usr.real_name;
	}
	to_chat(M, `<B>You are ${wizard_name}'s apprentice! You are bound by magic contract to follow their orders and help them in accomplishing their goals.`);
	if (type === "destruction") {
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"), null)));
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball"), null)));
		to_chat(M, `<B>Your service has not gone unrewarded, however. Studying under ${wizard_name}, you have learned powerful, destructive spells. You are able to cast magic missile and fireball.`);
	} else if (type === "bluespace") {
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/area_teleport/teleport"), null)));
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"), null)));
		to_chat(M, `<B>Your service has not gone unrewarded, however. Studying under ${wizard_name}, you have learned reality bending mobility spells. You are able to cast teleport and ethereal jaunt.`);
	} else if (type === "healing") {
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/charge"), null)));
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/forcewall"), null)));
		yield* M.put_in_hands_or_del((yield* new_(T("/obj/item/weapon/gun/magic/staff/healing"), M)));
		to_chat(M, `<B>Your service has not gone unrewarded, however. Studying under ${wizard_name}, you have learned livesaving survival spells. You are able to cast charge and forcewall.`);
	} else if (type === "robeless") {
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/knock"), null)));
		yield* M.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/mind_transfer"), null)));
		to_chat(M, `<B>Your service has not gone unrewarded, however. Studying under ${wizard_name}, you have learned stealthy, robeless spells. You are able to cast knock and mindswap.`);
	}
	yield* this.equip_antag(M);
	let wizard_name_first: Value = pick(GLOB.wizard_first);
	let wizard_name_second: Value = pick(GLOB.wizard_second);
	let randomname: Value = `${wizard_name_first} ${wizard_name_second}`;
	if (f.usr) {
		(new_objective = (yield* new_(T("/datum/objective/protect")))).owner = M.mind;
		new_objective.target = f.usr.mind;
		new_objective.explanation_text = `Protect ${f.usr.real_name}, the wizard.`;
		M.mind.objectives += new_objective;
	}
	GLOB.SSticker.mode.apprentices += M.mind;
	M.mind.special_role = "apprentice";
	GLOB.SSticker.mode.update_wiz_icons_added(M.mind);
	rt.op(f, "Output", [], [M, sound(rt.rsc("sound/effects/magic.ogg"))], false);
	if (!(newname = copytext(sanitize((yield* g.op(f, "Prompt", [3], [randomname, "Name change", `You are ${wizard_name}'s apprentice. Would you like to change your name to something else?`, M, null]))), 1, 42))) {
		newname = randomname;
	}
	M.mind.name = newname;
	M.real_name = newname;
	M.name = newname;
	M.age = rand(AGE_MIN, 29);
	yield* M.dna.update_dna_identity();
	return f.dot;
}, true);

// antag_spawner.dm:124
rt.def("/obj/item/weapon/antag_spawner/contract/proc/equip_antag", function* equip_antag(f: Frame, target: Value) {
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/device/radio/headset"), target)), slot_ears);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/color/lightpurple"), target)), slot_w_uniform);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), target)), slot_shoes);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/suit/wizrobe"), target)), slot_wear_suit);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/head/wizard"), target)), slot_head);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/backpack"), target)), slot_back);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/box"), target)), slot_in_backpack);
	yield* target.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/teleportation_scroll/apprentice"), target)), slot_r_store);
	return f.dot;
}, true);

rt.type(5648, "/obj/item/weapon/antag_spawner/nuke_ops", "/obj/item/weapon/antag_spawner", {
	borg_to_spawn: null,
	name: "syndicate operative teleporter",
	desc: "A single-use teleporter designed to quickly reinforce operatives in the field.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
});

// antag_spawner.dm:144
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/check_usability", function check_usability(f: Frame, user: Value) {
	if (this.used) {
		to_chat(user, `<span class='warning'>${this} is out of power!</span>`);
		return 0;
	}
	if (!rt.isIn(f, user.mind, GLOB.SSticker.mode.syndicates)) {
		to_chat(user, "<span class='danger'>AUTHENTICATION FAILURE. ACCESS DENIED.</span>");
		return 0;
	}
	if (user.z != 1) {
		to_chat(user, `<span class='warning'>${this} is out of range! It can only be used at your base!</span>`);
		return 0;
	}
	return 1;
});

// antag_spawner.dm:156
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let nuke_candidates: Value = null, theghost: Value = null;
	let $0: any;
	if (!this.check_usability(user)) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You activate ${this} and wait for confirmation.</span>`);
	if (this.borg_to_spawn) {
		$0 = `${lowertext(this.borg_to_spawn)} cyborg`;
	} else {
		$0 = "operative";
	}
	if (rt.len(f, (nuke_candidates = (yield* pollGhostCandidates(`Do you want to play as a syndicate ${$0}?`, "operative", null, "operative", 150, "syndicate"))))) {
		if (!this.check_usability(user)) {
			return f.dot;
		}
		this.used = 1;
		yield* this.spawn_antag((theghost = pick(nuke_candidates)).client, rt.getStep(f, this, 0), "syndieborg");
		yield* do_sparks(4, 1, this);
		yield* qdel(this);
	} else {
		to_chat(user, "<span class='warning'>Unable to connect to Syndicate command. Please wait and try again later or use the teleporter on your uplink to get your points refunded.</span>");
	}
	return f.dot;
}, true);

// antag_spawner.dm:173
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value) {
	let nuke: Value = null;
	let M: Value = (yield* new_(T("/mob/living/carbon/human"), _T));
	yield* C.prefs.copy_to(M);
	M.key = C.key;
	let code: Value = "BOMB-NOT-FOUND";
	if (nuke = rt.locateIn(f, "syndienuke", GLOB.nuke_list)) {
		code = nuke.r_code;
	}
	yield* M.mind.make_Nuke(null, code, 0, 0);
	let newname: Value = M.dna.species.random_name(M.gender, 0, GLOB.SSticker.mode.nukeops_lastname);
	M.mind.name = newname;
	M.real_name = newname;
	M.name = newname;
	return f.dot;
}, true);

rt.type(5649, "/obj/item/weapon/antag_spawner/nuke_ops/borg_tele", "/obj/item/weapon/antag_spawner/nuke_ops", {
	name: "syndicate cyborg teleporter",
	desc: "A single-use teleporter designed to quickly reinforce operatives in the field..",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "locator",
});

// antag_spawner.dm:203
rt.def("/obj/item/weapon/antag_spawner/nuke_ops/borg_tele/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value) {
	let R: Value = null;
	if (this.borg_to_spawn === "Medical") {
		R = (yield* new_(T("/mob/living/silicon/robot/syndicate/medical"), _T));
	} else {
		R = (yield* new_(T("/mob/living/silicon/robot/syndicate"), _T));
	}
	let brainfirstname: Value = pick(GLOB.first_names_male);
	if (prob(50)) {
		brainfirstname = pick(GLOB.first_names_female);
	}
	let brainopslastname: Value = pick(GLOB.last_names);
	if (GLOB.SSticker.mode.nukeops_lastname) {
		brainopslastname = GLOB.SSticker.mode.nukeops_lastname;
	}
	let brainopsname: Value = `${brainfirstname} ${brainopslastname}`;
	R.mmi.name = `Man-Machine Interface: ${brainopsname}`;
	R.mmi.brain.name = `${brainopsname}'s brain`;
	R.mmi.brainmob.real_name = brainopsname;
	R.mmi.brainmob.name = brainopsname;
	R.key = C.key;
	yield* R.mind.make_Nuke(null, { nuke_code: null, leader: 0, telecrystals: 1 });
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

// antag_spawner.dm:240
rt.def("/obj/item/weapon/antag_spawner/slaughter_demon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let demon_candidates: Value = null, theghost: Value = null;
	if (user.z != ZLEVEL_STATION) {
		to_chat(user, "<span class='notice'>You should probably wait until you reach the station.</span>");
		return f.dot;
	}
	if (this.used) {
		return f.dot;
	}
	if (rt.len(f, (demon_candidates = (yield* pollCandidatesForMob(`Do you want to play as a ${rt.initial(f, this.demon_type, "name")}?`, null, null, "xenomorph", 50, this))))) {
		if (this.used) {
			return f.dot;
		}
		this.used = 1;
		yield* this.spawn_antag((theghost = pick(demon_candidates)).client, rt.getStep(f, this, 0), rt.initial(f, this.demon_type, "name"));
		to_chat(user, this.shatter_msg);
		to_chat(user, this.veil_msg);
		playsound(user.loc, rt.rsc("sound/effects/glassbr1.ogg"), 100, 1);
		yield* qdel(this);
	} else {
		to_chat(user, "<span class='notice'>You can't seem to work up the nerve to shatter the bottle. Perhaps you should try again later.</span>");
	}
	return f.dot;
}, true);

// antag_spawner.dm:262
rt.def("/obj/item/weapon/antag_spawner/slaughter_demon/proc/spawn_antag", function* spawn_antag(f: Frame, C: Value, _T: Value, type: Value) {
	let S: Value = null, new_objective: Value = null, new_objective2: Value = null;
	let $2: any;
	type ??= "";
	let holder: Value = (yield* new_(T("/obj/effect/dummy/slaughter"), _T));
	(S = (yield* new_(this.demon_type, holder))).holder = holder;
	S.key = C.key;
	S.mind.assigned_role = S.name;
	S.mind.special_role = S.name;
	GLOB.SSticker.mode.traitors += S.mind;
	if (f.usr) {
		(new_objective = (yield* new_(T("/datum/objective/assassinate")))).owner = S.mind;
		new_objective.target = f.usr.mind;
		new_objective.explanation_text = `${this.objective_verb} ${f.usr.real_name}, the one who summoned you.`;
		S.mind.objectives += new_objective;
	}
	(new_objective2 = (yield* new_(T("/datum/objective")))).owner = S.mind;
	let $0: any = new_objective2;
	let $1: any = this.objective_verb;
	if (f.usr) {

		$2 = " else while you're at it";
	} else {
		$2 = "";
	}
	$0.explanation_text = `${$1} everyone${$2}.`;
	S.mind.objectives += new_objective2;
	to_chat(S, S.playstyle_string);
	to_chat(S, "<B>You are currently not currently in the same plane of existence as the station. Ctrl+Click a blood pool to manifest.</B>");
	if (new_objective) {
		to_chat(S, `<B>Objective #${1}</B>: ${new_objective.explanation_text}`);
	}
	to_chat(S, `<B>Objective #${new_objective ? `${2}` : `${1}`}</B>: ${new_objective2.explanation_text}`);
	return f.dot;
}, true);
