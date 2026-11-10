// Based on /tg/station's code/modules/awaymissions/mission_code/Academy.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(13036, "/obj/singularity/academy", "/obj/singularity", {
	dissipate: 0,
	move_self: 0,
	grav_pull: 1,
});

// Academy.dm:13
rt.def("/obj/singularity/academy/proc/process", function* process(f: Frame) {
	yield* this.eat();
	if (!prob(1)) return f.dot;
	yield* this.mezzer();
	return f.dot;
}, true, { waitfor: false });

rt.type(12934, "/obj/structure/academy_wizard_spawner", "/obj/structure", {
	current_wizard: null,
	next_check: 0,
	cooldown: 600,
	faction: "wizard",
	braindead_check: 0,
	anchored: 1,
	name: "Academy Defensive System",
	desc: "Made by Abjuration Inc",
	icon: rt.rsc("icons/obj/cult.dmi"),
	icon_state: "forge",
	obj_integrity: 200,
	max_integrity: 200,
});

// Academy.dm:40
rt.def("/obj/structure/academy_wizard_spawner/proc/New", function New(f: Frame) {
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// Academy.dm:43
rt.def("/obj/structure/academy_wizard_spawner/proc/Destroy", function* Destroy(f: Frame) {
	if (!this.broken) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return (yield* parent_proc());
}, true);

// Academy.dm:48
rt.def("/obj/structure/academy_wizard_spawner/proc/process", function* process(f: Frame) {
	let L: Value = null;
	if (!(this.next_check < rt.worldTime(f))) return f.dot;
	if (!this.current_wizard) {
		for (L of each(GLOB.player_list, T("/mob/living"))) {
			if (L.z == this.z && L.stat != 2 && !rt.isIn(f, this.faction, L.faction)) {
				yield* this.summon_wizard();
				break;
			}
		}
	} else {
		if (this.current_wizard.stat == 2) {
			this.current_wizard = null;
			yield* this.summon_wizard();
		}
		if (!this.current_wizard.client) {
			if (!this.braindead_check) {
				this.braindead_check = 1;
			} else {
				this.braindead_check = 0;
				yield* this.give_control();
			}
		}
	}
	this.next_check = rt.worldTime(f) + this.cooldown;
	return f.dot;
}, true, { waitfor: false });

// Academy.dm:69
rt.def("/obj/structure/academy_wizard_spawner/proc/give_control", function* give_control(f: Frame) {
	let chosen: Value = null;
	if (!this.current_wizard) {
		return f.dot;
	}
	let candidates: Value = (yield* pollCandidatesForMob("Do you want to play as Wizard Academy Defender?", "wizard", null, { be_special_flag: "wizard", M: this.current_wizard }));
	if (!rt.len(f, candidates)) return f.dot;
	message_admins(`${key_name_admin((chosen = pick(candidates)))} was spawned as Wizard Academy Defender`);
	yield* this.current_wizard.ghostize();
	this.current_wizard.key = chosen.key;
	return f.dot;
}, true, { waitfor: false });

// Academy.dm:83
rt.def("/obj/structure/academy_wizard_spawner/proc/summon_wizard", function* summon_wizard(f: Frame) {
	let wizbody: Value = null, Implant: Value = null, wizmind: Value = null;
	let _T: Value = this.loc;
	yield* (wizbody = (yield* new_(T("/mob/living/carbon/human"), _T))).equipOutfit(T("/datum/outfit/wizard/academy"));
	yield* (Implant = (yield* new_(T("/obj/item/weapon/implant/exile"), wizbody))).implant(wizbody);
	(rt.modField(f, wizbody, "faction", "wizard", rt.bitOr));
	wizbody.real_name = "Academy Teacher";
	wizbody.name = "Academy Teacher";
	(wizmind = (yield* new_(T("/datum/mind")))).name = "Wizard Defender";
	wizmind.special_role = "Academy Defender";
	let O: Value = (yield* new_(T("/datum/objective"), "Protect Wizard Academy from the intruders"));
	wizmind.objectives += O;
	yield* wizmind.transfer_to(wizbody);
	(rt.modField(f, GLOB.SSticker.mode, "wizards", wizmind, rt.bitOr));
	yield* wizmind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/ethereal_jaunt"))));
	yield* wizmind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"))));
	yield* wizmind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball"))));
	this.current_wizard = wizbody;
	yield* this.give_control();
	return f.dot;
}, true);

// Academy.dm:108
rt.def("/obj/structure/academy_wizard_spawner/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (this.broken) return f.dot;
	this.broken = 1;
	this.visible_message(`<span class='warning'>${this} breaks down!</span>`);
	this.icon_state = "forge_off";
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

rt.type(645, "/datum/outfit/wizard/academy", "/datum/outfit/wizard", {
	name: "Academy Wizard",
	r_pocket: null,
	r_hand: null,
	suit: rt.typePath("/obj/item/clothing/suit/wizrobe/red"),
	head: rt.typePath("/obj/item/clothing/head/wizard/red"),
	backpack_contents: null,
});

// Academy.dm:120
rt.def("/datum/outfit/wizard/academy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.backpack_contents = rt.alist(f, [T("/obj/item/weapon/storage/box/survival"), 1]);
	return f.dot;
});

rt.type(7170, "/obj/item/weapon/dice/d20/fate", "/obj/item/weapon/dice/d20", {
	reusable: 1,
	used: 0,
	sides: 20,
	can_be_rigged: 0,
	name: "Die of Fate",
	desc: "A die with twenty sides. You can feel unearthly energies radiating from it. Using this might be VERY risky.",
	icon_state: "d20",
});

// Academy.dm:135
rt.def("/obj/item/weapon/dice/d20/fate/proc/diceroll", function* diceroll(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.used) return f.dot;
	if (!rt.istype(user, T("/mob/living/carbon/human")) || !user.mind || rt.isIn(f, user.mind, GLOB.SSticker.mode.wizards)) {
		to_chat(user, "<span class='warning'>You feel the magic of the dice is restricted to ordinary humans!</span>");
		return f.dot;
	}
	if (this.rigged) {
		yield* this.effect(user, this.rigged);
	} else {
		yield* this.effect(user, this.result);
	}
	return f.dot;
}, true);

// Academy.dm:146
rt.def("/obj/item/weapon/dice/d20/fate/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	if (!(!rt.istype(user, T("/mob/living/carbon/human")) || !user.mind || rt.isIn(f, user.mind, GLOB.SSticker.mode.wizards))) return f.dot;
	to_chat(user, "<span class='warning'>You feel the magic of the dice is restricted to ordinary humans! You should leave it alone.</span>");
	yield* user.drop_item();
	return f.dot;
}, true);

// Academy.dm:152
rt.def("/obj/item/weapon/dice/d20/fate/proc/effect", function* effect(f: Frame, user: Value, roll: Value) {
	let direction: Value = null, _T: Value = null, I: Value = null, S: Value = null, throw_dir: Value = null, throw_target: Value = null, D: Value = null, C: Value = null, Start: Value = null, direction_1: Value = null, _T_2: Value = null, M: Value = null, i: Value = null, H: Value = null, servant_mind: Value = null, O: Value = null, candidates: Value = null, chosen: Value = null, S_5: Value = null;
	let $e: any;
	if (!this.reusable) {
		this.used = 1;
	}
	this.visible_message("<span class='userdanger'>The die flare briefly.</span>");
	if (roll === 1) {
		yield* user.dust();
	} else if (roll === 2) {
		yield* user.death();
	} else if (roll === 3) {
		for (direction of each(GLOB.alldirs)) {
			yield* new_(T("/mob/living/simple_animal/hostile/creature"), rt.getStep(f, (_T = rt.getStep(f, this, 0)), direction));
		}
	} else if (roll === 4) {
		for (I of each(user, T("/obj/item"))) {
			if (rt.istype(I, T("/obj/item/weapon/implant"))) {
				continue;
			}
			yield* qdel(I);
		}
	} else if (roll === 5) {
		yield* user.monkeyize();
	} else if (roll === 6) {
		(S = user.dna.species).speedmod += 1;
	} else if (roll === 7) {
		yield* user.Stun(60);
		yield* user.adjustBruteLoss(50);
		throw_dir = pick(GLOB.cardinal);
		throw_target = get_edge_target_turf(user, throw_dir);
		yield* user.throw_at(throw_target, 200, 4);
	} else if (roll === 8) {
		yield* explosion(this.loc, -1, 0, 2, { flame_range: 2 });
	} else if (roll === 9) {
		D = (yield* new_(T("/datum/disease/cold")));
		yield* user.ForceContractDisease(D);
	} else if (roll === 10) {
		this.visible_message(`<span class='notice'>${this} roll perfectly.</span>`);
	} else if (roll === 11) {
		(C = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/cookie"), rt.getStep(f, this, 0)))).name = "Cookie of Fate";
	} else if (roll === 12) {
		yield* user.revive({ full_heal: 1, admin_revive: 1 });
	} else if (roll === 13) {
		Start = rt.getStep(f, this, 0);
		for (direction_1 of each(GLOB.alldirs)) {
			_T_2 = rt.getStep(f, Start, direction_1);
			if (rand(0, 1)) {
				yield* new_(T("/obj/item/stack/spacecash/c1000"), _T_2);
			} else {
				M = (yield* new_(T("/obj/item/weapon/storage/bag/money"), _T_2));
				i = null;
				rt.forRange(f, 1, 1, rand(5, 50), 1);
				while (($e = rt.next(f, 1)) !== undefined) {
					i = $e;
					yield* new_(T("/obj/item/weapon/coin/gold"), M);
				}
				rt.endFor(f, 1);
			}
		}
	} else if (roll === 14) {
		yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/mateba"), rt.getStep(f, this, 0));
	} else if (roll === 15) {
		yield* new_(T("/obj/item/weapon/spellbook/oneuse/random"), rt.getStep(f, this, 0));
	} else if (roll === 16) {
		yield* (H = (yield* new_(T("/mob/living/carbon/human"), rt.getStep(f, this, 0)))).equipOutfit(T("/datum/outfit/butler"));
		servant_mind = (yield* new_(T("/datum/mind")));
		O = (yield* new_(T("/datum/objective"), `Serve ${user.real_name}.`));
		servant_mind.objectives += O;
		yield* servant_mind.transfer_to(H);
		candidates = (yield* pollCandidatesForMob(`Do you want to play as ${user.real_name} Servant?`, "wizard", { mob: H }));
		if (rt.len(f, candidates)) {
			message_admins(`${key_name_admin((chosen = pick(candidates)))} was spawned as Dice Servant`);
			H.key = chosen.key;
		}
		(S_5 = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/summonmob")))).target_mob = H;
		yield* user.mind.AddSpell(S_5);
	} else if (roll === 17) {
		yield* new_(T("/obj/item/weapon/storage/box/syndicate"), rt.getStep(f, this, 0));
	} else if (roll === 18) {
		yield* new_(T("/obj/item/weapon/card/id/captains_spare"), rt.getStep(f, this, 0));
	} else if (roll === 19) {
		to_chat(user, "<span class='notice'>You feel robust.</span>");
		(S = user.dna.species).brutemod *= 0.5;
		S.burnmod *= 0.5;
		S.coldmod *= 0.5;
	} else if (roll === 20) {
		yield* user.mind.make_Wizard();
	}
	return f.dot;
}, true);

rt.type(11279, "/obj/effect/proc_holder/spell/targeted/summonmob", "/obj/effect/proc_holder/spell/targeted", {
	target_mob: null,
	name: "Summon Servant",
	desc: "This spell can be used to call your servant, whenever you need it.",
	charge_max: 100,
	clothes_req: 0,
	invocation: "JE VES",
	invocation_type: "whisper",
	range: -1,
	level_max: 0,
	cooldown_min: 100,
	include_user: 1,
	action_icon_state: "summons",
});

// Academy.dm:285
rt.def("/obj/effect/proc_holder/spell/targeted/summonmob/proc/cast", function* cast(f: Frame, targets: Value, user: Value) {
	let direction: Value = null, _T: Value = null;
	user ??= f.usr;
	if (!this.target_mob) {
		return f.dot;
	}
	let Start: Value = rt.getStep(f, user, 0);
	for (direction of each(GLOB.alldirs)) {
		if (!(_T = rt.getStep(f, Start, direction)).density) {
			yield* this.target_mob.Move(_T);
		}
	}
	return f.dot;
}, true);

rt.type(12793, "/obj/structure/ladder/unbreakable/rune", "/obj/structure/ladder/unbreakable", {
	name: "Teleportation Rune",
	desc: "Could lead anywhere.",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "1",
	color: "#0000ff",
});

// Academy.dm:304
rt.def("/obj/structure/ladder/unbreakable/rune/proc/show_fluff_message", function show_fluff_message(f: Frame, up: Value, user: Value) {
	user.visible_message(fmt("＀ activates ％！.", [user, this]), fmt("<span class='notice'>You activate ％！.</span>", [this]));
	return f.dot;
});

// Academy.dm:307
rt.def("/obj/structure/ladder/proc/can_use", function can_use(f: Frame, user: Value) {
	if (rt.isIn(f, user.mind, GLOB.SSticker.mode.wizards)) {
		return 0;
	}
	return 1;
});
