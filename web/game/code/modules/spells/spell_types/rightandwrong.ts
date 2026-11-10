// Based on /tg/station's code/modules/spells/spell_types/rightandwrong.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// rightandwrong.dm:9
rt.def("/proc/rightandwrong", function* rightandwrong(f: Frame, summon_type: Value, user: Value, survivor_probability: Value) {
	let H: Value = null, guns: Value = null, magic: Value = null, survive: Value = null, randomizeguns: Value = null, randomizemagic: Value = null, randomizemagicspecial: Value = null, G: Value = null;
	let $e: any;
	let gunslist: Value = list("taser", "gravgun", "egun", "laser", "revolver", "detective", "c20r", "nuclear", "deagle", "gyrojet", "pulse", "suppressed", "cannon", "doublebarrel", "shotgun", "combatshotgun", "bulldog", "mateba", "sabr", "crossbow", "saw", "car", "boltaction", "speargun", "arg", "uzi", "alienpistol", "dragnet", "turret", "pulsecarbine", "decloner", "mindflayer", "hyperkinetic", "advplasmacutter", "wormhole", "wt550", "bulldog", "grenadelauncher", "goldenrevolver", "sniper", "medibeam", "scatterbeam");
	let magiclist: Value = list("fireball", "smoke", "blind", "mindswap", "forcewall", "knock", "horsemask", "charge", "summonitem", "wandnothing", "wanddeath", "wandresurrection", "wandpolymorph", "wandteleport", "wanddoor", "wandfireball", "staffchange", "staffhealing", "armor", "scrying", "staffdoor", "voodoo", "whistle", "battlemage", "immortality", "ghostsword", "special");
	let magicspeciallist: Value = list("staffchange", "staffanimation", "wandbelt", "contract", "staffchaos", "necromantic", "bloodcontract");
	if (user) {
		to_chat(user, `<B>You summoned ${summon_type ? "magic" : "guns"}!</B>`);
		message_admins(`${key_name_admin(user, 1)} summoned ${summon_type ? "magic" : "guns"}!`);
		log_game(`${key_name(user)} summoned ${summon_type ? "magic" : "guns"}!`);
	}
	for (H of each(GLOB.player_list, T("/mob/living/carbon/human"))) {
		if (H.stat == 2 || !H.client) {
			continue;
		}
		if (H.mind) {
			if (H.mind.special_role == "Wizard" || H.mind.special_role == "apprentice" || H.mind.special_role == "survivalist") {
				continue;
			}
		}
		if (prob(survivor_probability) && !rt.isIn(f, H.mind, GLOB.SSticker.mode.traitors)) {
			GLOB.SSticker.mode.traitors += H.mind;
			if (!summon_type) {
				(guns = (yield* new_(T("/datum/objective/steal_five_of_type/summon_guns")))).owner = H.mind;
				H.mind.objectives += guns;
				H.mind.special_role = "survivalist";
				to_chat(H, "<B>You are the survivalist! Your own safety matters above all else, and the only way to ensure your safety is to stockpile weapons! Grab as many guns as possible, by any means necessary. Kill anyone who gets in your way.</B>");
			} else {
				(magic = (yield* new_(T("/datum/objective/steal_five_of_type/summon_magic")))).owner = H.mind;
				H.mind.objectives += magic;
				H.mind.special_role = "amateur magician";
				to_chat(H, "<B>You are the amateur magician! Grow your newfound talent! Grab as many magical artefacts as possible, by any means necessary. Kill anyone who gets in your way.</B>");
			}
			(survive = (yield* new_(T("/datum/objective/survive")))).owner = H.mind;
			H.mind.objectives += survive;
			H.log_message("<font color='red'>Was made into a survivalist, and trusts no one!</font>", "Attack log");
			H.mind.announce_objectives();
		}
		randomizeguns = pick(gunslist);
		randomizemagic = pick(magiclist);
		randomizemagicspecial = pick(magicspeciallist);
		if (!summon_type) {
			G = null;
			if (randomizeguns === "taser") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun/advtaser"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "egun") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "laser") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/laser"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "revolver") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "detective") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/detective"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "deagle") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/camo"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "gyrojet") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/gyropistol"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "pulse") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/pulse"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "suppressed") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/pistol"), rt.getStep(f, H, 0)));
				yield* new_(T("/obj/item/weapon/suppressor"), rt.getStep(f, H, 0));
			} else if (randomizeguns === "doublebarrel") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/doublebarrel"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "shotgun") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/shotgun"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "combatshotgun") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "arg") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/ar"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "mateba") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/mateba"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "boltaction") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/shotgun/boltaction"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "speargun") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/speargun"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "uzi") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/mini_uzi"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "cannon") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/lasercannon"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "crossbow") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "nuclear") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun/nuclear"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "sabr") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/proto"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "bulldog") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "c20r") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/c20r"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "saw") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/l6_saw"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "car") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/m90"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "alienpistol") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/alien"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "dragnet") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun/dragnet"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "turret") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/e_gun/turret"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "pulsecarbine") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/pulse/carbine"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "decloner") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/decloner"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "mindflayer") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/mindflayer"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "hyperkinetic") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/kinetic_accelerator"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "advplasmacutter") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/plasmacutter/adv"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "wormhole") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/wormhole_projector"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "wt550") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/wt550"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "bulldog") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/shotgun"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "grenadelauncher") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "goldenrevolver") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/revolver/golden"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "sniper") {
				G = (yield* new_(T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "medibeam") {
				G = (yield* new_(T("/obj/item/weapon/gun/medbeam"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "scatterbeam") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/laser/scatter"), rt.getStep(f, H, 0)));
			} else if (randomizeguns === "gravgun") {
				G = (yield* new_(T("/obj/item/weapon/gun/energy/gravity_gun"), rt.getStep(f, H, 0)));
			}
			yield* G.unlock();
			playsound(rt.getStep(f, H, 0), rt.rsc("sound/magic/summon_guns.ogg"), 50, 1);
		} else {
			if (randomizemagic === "fireball") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/fireball"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "smoke") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/smoke"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "blind") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/blind"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "mindswap") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/mindswap"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "forcewall") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/forcewall"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "knock") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/knock"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "horsemask") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/barnyard"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "charge") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/charge"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "summonitem") {
				yield* new_(T("/obj/item/weapon/spellbook/oneuse/summonitem"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wandnothing") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wanddeath") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/death"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wandresurrection") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/resurrection"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wandpolymorph") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/polymorph"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wandteleport") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/teleport"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wanddoor") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/door"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "wandfireball") {
				yield* new_(T("/obj/item/weapon/gun/magic/wand/fireball"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "staffhealing") {
				yield* new_(T("/obj/item/weapon/gun/magic/staff/healing"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "staffdoor") {
				yield* new_(T("/obj/item/weapon/gun/magic/staff/door"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "armor") {
				yield* new_(T("/obj/item/clothing/suit/space/hardsuit/wizard"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "scrying") {
				yield* new_(T("/obj/item/weapon/scrying"), rt.getStep(f, H, 0));
				if (!H.dna.check_mutation("X Ray Vision")) {
					yield* H.dna.add_mutation("X Ray Vision");
					to_chat(H, "<span class='notice'>The walls suddenly disappear.</span>");
				}
			} else if (randomizemagic === "voodoo") {
				yield* new_(T("/obj/item/voodoo"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "whistle") {
				yield* new_(T("/obj/item/warpwhistle"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "battlemage") {
				yield* new_(T("/obj/item/clothing/suit/space/hardsuit/shielded/wizard"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "immortality") {
				yield* new_(T("/obj/item/device/immortality_talisman"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "ghostsword") {
				yield* new_(T("/obj/item/weapon/melee/ghost_sword"), rt.getStep(f, H, 0));
			} else if (randomizemagic === "special") {
				magiclist -= "special";
				if (randomizemagicspecial === "staffchange") {
					yield* new_(T("/obj/item/weapon/gun/magic/staff/change"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "staffanimation") {
					yield* new_(T("/obj/item/weapon/gun/magic/staff/animate"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "wandbelt") {
					yield* new_(T("/obj/item/weapon/storage/belt/wands/full"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "contract") {
					yield* new_(T("/obj/item/weapon/antag_spawner/contract"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "staffchaos") {
					yield* new_(T("/obj/item/weapon/gun/magic/staff/chaos"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "necromantic") {
					yield* new_(T("/obj/item/device/necromantic_stone"), rt.getStep(f, H, 0));
				} else if (randomizemagicspecial === "bloodcontract") {
					yield* new_(T("/obj/item/blood_contract"), rt.getStep(f, H, 0));
				}
				to_chat(H, "<span class='notice'>You suddenly feel lucky.</span>");
			}
			playsound(rt.getStep(f, H, 0), rt.rsc("sound/magic/summon_magic.ogg"), 50, 1);
		}
	}
	return f.dot;
}, true);

// rightandwrong.dm:206
rt.def("/proc/summonevents", function summonevents(f: Frame) {
	if (!GLOB.SSevents.wizardmode) {
		GLOB.SSevents.frequency_lower = 600;
		GLOB.SSevents.frequency_upper = 3000;
		GLOB.SSevents.toggleWizardmode();
		GLOB.SSevents.reschedule();
	} else {
		GLOB.SSevents.frequency_upper -= 600;
		if (GLOB.SSevents.frequency_upper < GLOB.SSevents.frequency_lower) {
			GLOB.SSevents.frequency_upper = GLOB.SSevents.frequency_lower;
		}
		GLOB.SSevents.reschedule();
		message_admins(`Summon Events intensifies, events will now occur every ${GLOB.SSevents.frequency_lower / 600} to ${GLOB.SSevents.frequency_upper / 600} minutes.`);
		log_game("Summon Events was increased!");
	}
	return f.dot;
});
