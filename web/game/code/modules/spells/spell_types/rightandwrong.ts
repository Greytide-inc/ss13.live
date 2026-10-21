// From code/modules/spells/spell_types/rightandwrong.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /proc/rightandwrong  (code/modules/spells/spell_types/rightandwrong.dm:9)  may sleep
rt.def("/proc/rightandwrong", function* rightandwrong(f: Frame, summon_type: Value, user: Value, survivor_probability: Value) {
	let gunslist: Value = null, magiclist: Value = null, magicspeciallist: Value = null, H: Value = null, guns: Value = null, magic: Value = null, survive: Value = null, randomizeguns: Value = null, randomizemagic: Value = null, randomizemagicspecial: Value = null, G: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [summon_type, user, survivor_probability, gunslist, magiclist, magicspeciallist, H, guns, magic, survive, randomizeguns, randomizemagic, randomizemagicspecial, G, $0, $1, $e];
	gunslist = rt.list("taser", "gravgun", "egun", "laser", "revolver", "detective", "c20r", "nuclear", "deagle", "gyrojet", "pulse", "suppressed", "cannon", "doublebarrel", "shotgun", "combatshotgun", "bulldog", "mateba", "sabr", "crossbow", "saw", "car", "boltaction", "speargun", "arg", "uzi", "alienpistol", "dragnet", "turret", "pulsecarbine", "decloner", "mindflayer", "hyperkinetic", "advplasmacutter", "wormhole", "wt550", "bulldog", "grenadelauncher", "goldenrevolver", "sniper", "medibeam", "scatterbeam");
	magiclist = rt.list("fireball", "smoke", "blind", "mindswap", "forcewall", "knock", "horsemask", "charge", "summonitem", "wandnothing", "wanddeath", "wandresurrection", "wandpolymorph", "wandteleport", "wanddoor", "wandfireball", "staffchange", "staffhealing", "armor", "scrying", "staffdoor", "voodoo", "whistle", "battlemage", "immortality", "ghostsword", "special");
	magicspeciallist = rt.list("staffchange", "staffanimation", "wandbelt", "contract", "staffchaos", "necromantic", "bloodcontract");
	if (truthy(live(user))) {
		$0 = live(user);
		if (truthy(live(summon_type))) {
			$1 = "magic";
		} else {
			$1 = "guns";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<B>You summoned ＀!</B>", [$1])]);
		$0 = (yield* g.call(f, P("/proc/key_name_admin"), null, [live(user), 1]));
		if (truthy(live(summon_type))) {
			$1 = "magic";
		} else {
			$1 = "guns";
		}
		yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ summoned ＀!", [$0, $1])]);
		$0 = (yield* g.call(f, P("/proc/key_name"), null, [live(user)]));
		if (truthy(live(summon_type))) {
			$1 = "magic";
		} else {
			$1 = "guns";
		}
		yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ summoned ＀!", [$0, $1])]);
	}
	H = null;
	rt.forList(f, 0, rt.gl("player_list"), T("/mob/living/carbon/human"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		if ((isEqual(rt.fv(f, "stat", live(H)), 2) || !truthy(rt.fv(f, "client", live(H))))) {
			continue;
		}
		if (truthy(rt.fv(f, "mind", live(H)))) {
			if (((isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(H))), "Wizard") || isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(H))), "apprentice")) || isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(H))), "survivalist"))) {
				continue;
			}
		}
		if ((truthy(rt.op(f, "Prob", [], [live(survivor_probability)])) && !truthy((rt.isIn(f, rt.fv(f, "mind", live(H)), rt.gv(f, "traitors", rt.fv(f, "mode", rt.gl("SSticker")))) ? 1 : 0)))) {
			rt.modField(f, rt.fv(f, "mode", rt.gl("SSticker")), "traitors", rt.fv(f, "mind", live(H)), add);
			if (!truthy(live(summon_type))) {
				rt.setFv(f, "owner", (guns = (yield* g.new_(f, T("/datum/objective/steal_five_of_type/summon_guns"), []))), rt.fv(f, "mind", live(H)));
				rt.modField(f, rt.fv(f, "mind", live(H)), "objectives", live(guns), add);
				rt.setFv(f, "special_role", rt.fv(f, "mind", live(H)), "survivalist");
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<B>You are the survivalist! Your own safety matters above all else, and the only way to ensure your safety is to stockpile weapons! Grab as many guns as possible, by any means necessary. Kill anyone who gets in your way.</B>"]);
			} else {
				rt.setFv(f, "owner", (magic = (yield* g.new_(f, T("/datum/objective/steal_five_of_type/summon_magic"), []))), rt.fv(f, "mind", live(H)));
				rt.modField(f, rt.fv(f, "mind", live(H)), "objectives", live(magic), add);
				rt.setFv(f, "special_role", rt.fv(f, "mind", live(H)), "amateur magician");
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<B>You are the amateur magician! Grow your newfound talent! Grab as many magical artefacts as possible, by any means necessary. Kill anyone who gets in your way.</B>"]);
			}
			rt.setFv(f, "owner", (survive = (yield* g.new_(f, T("/datum/objective/survive"), []))), rt.fv(f, "mind", live(H)));
			rt.modField(f, rt.fv(f, "mind", live(H)), "objectives", live(survive), add);
			yield* g.callName(f, live(H), "log_message", ["<font color='red'>Was made into a survivalist, and trusts no one!</font>", "Attack log"]);
			yield* g.callName(f, rt.fv(f, "mind", live(H)), "announce_objectives", []);
		}
		randomizeguns = rt.op(f, "PickUnweighted", [1], [live(gunslist)]);
		randomizemagic = rt.op(f, "PickUnweighted", [1], [live(magiclist)]);
		randomizemagicspecial = rt.op(f, "PickUnweighted", [1], [live(magicspeciallist)]);
		if (!truthy(live(summon_type))) {
			G = null;
			$0 = live(randomizeguns);
			if ($0 === "taser") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/advtaser"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "egun") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "laser") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "revolver") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "detective") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/detective"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "deagle") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol/deagle/camo"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "gyrojet") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/gyropistol"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "pulse") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/pulse"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "suppressed") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/pistol"), [rt.getStep(f, live(H), 0)]));
				yield* g.new_(f, T("/obj/item/weapon/suppressor"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "doublebarrel") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/doublebarrel"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "shotgun") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/shotgun"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "combatshotgun") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/shotgun/automatic/combat"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "arg") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/ar"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "mateba") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/mateba"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "boltaction") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/shotgun/boltaction"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "speargun") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/speargun"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "uzi") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/mini_uzi"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "cannon") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/lasercannon"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "crossbow") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/kinetic_accelerator/crossbow/large"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "nuclear") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/nuclear"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "sabr") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/proto"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "bulldog") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "c20r") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/c20r"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "saw") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/l6_saw"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "car") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/m90"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "alienpistol") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/alien"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "dragnet") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/dragnet"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "turret") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/e_gun/turret"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "pulsecarbine") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/pulse/carbine"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "decloner") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/decloner"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "mindflayer") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/mindflayer"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "hyperkinetic") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/kinetic_accelerator"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "advplasmacutter") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/plasmacutter/adv"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "wormhole") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/wormhole_projector"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "wt550") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/wt550"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "bulldog") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/shotgun"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "grenadelauncher") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "goldenrevolver") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/golden"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "sniper") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "medibeam") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/medbeam"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "scatterbeam") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/laser/scatter"), [rt.getStep(f, live(H), 0)]));
			} else if ($0 === "gravgun") {
				G = (yield* g.new_(f, T("/obj/item/weapon/gun/energy/gravity_gun"), [rt.getStep(f, live(H), 0)]));
			}
			yield* g.callName(f, live(G), "unlock", []);
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.rsc("sound/magic/summon_guns.ogg"), 50, 1]);
		} else {
			$0 = live(randomizemagic);
			if ($0 === "fireball") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/fireball"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "smoke") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/smoke"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "blind") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/blind"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "mindswap") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/mindswap"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "forcewall") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/forcewall"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "knock") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/knock"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "horsemask") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/barnyard"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "charge") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/charge"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "summonitem") {
				yield* g.new_(f, T("/obj/item/weapon/spellbook/oneuse/summonitem"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wandnothing") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wanddeath") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/death"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wandresurrection") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/resurrection"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wandpolymorph") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/polymorph"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wandteleport") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/teleport"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wanddoor") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/door"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "wandfireball") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/wand/fireball"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "staffhealing") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/healing"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "staffdoor") {
				yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/door"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "armor") {
				yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/wizard"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "scrying") {
				yield* g.new_(f, T("/obj/item/weapon/scrying"), [rt.getStep(f, live(H), 0)]);
				if (!truthy((yield* g.callName(f, rt.fv(f, "dna", live(H)), "check_mutation", ["X Ray Vision"])))) {
					yield* g.callName(f, rt.fv(f, "dna", live(H)), "add_mutation", ["X Ray Vision"]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>The walls suddenly disappear.</span>"]);
				}
			} else if ($0 === "voodoo") {
				yield* g.new_(f, T("/obj/item/voodoo"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "whistle") {
				yield* g.new_(f, T("/obj/item/warpwhistle"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "battlemage") {
				yield* g.new_(f, T("/obj/item/clothing/suit/space/hardsuit/shielded/wizard"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "immortality") {
				yield* g.new_(f, T("/obj/item/device/immortality_talisman"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "ghostsword") {
				yield* g.new_(f, T("/obj/item/weapon/melee/ghost_sword"), [rt.getStep(f, live(H), 0)]);
			} else if ($0 === "special") {
				(magiclist = rt.modify(live(magiclist), "special", subtract));
				$0 = live(randomizemagicspecial);
				if ($0 === "staffchange") {
					yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/change"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "staffanimation") {
					yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/animate"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "wandbelt") {
					yield* g.new_(f, T("/obj/item/weapon/storage/belt/wands/full"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "contract") {
					yield* g.new_(f, T("/obj/item/weapon/antag_spawner/contract"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "staffchaos") {
					yield* g.new_(f, T("/obj/item/weapon/gun/magic/staff/chaos"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "necromantic") {
					yield* g.new_(f, T("/obj/item/device/necromantic_stone"), [rt.getStep(f, live(H), 0)]);
				} else if ($0 === "bloodcontract") {
					yield* g.new_(f, T("/obj/item/blood_contract"), [rt.getStep(f, live(H), 0)]);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'>You suddenly feel lucky.</span>"]);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(H), 0), rt.rsc("sound/magic/summon_magic.ogg"), 50, 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /proc/summonevents  (code/modules/spells/spell_types/rightandwrong.dm:206)
rt.def("/proc/summonevents", function summonevents(f: Frame) {
	if (!truthy(rt.fv(f, "wizardmode", rt.gl("SSevents")))) {
		rt.setFv(f, "frequency_lower", rt.gl("SSevents"), 600);
		rt.setFv(f, "frequency_upper", rt.gl("SSevents"), 3000);
		rt.callName(f, rt.gl("SSevents"), "toggleWizardmode", []);
		rt.callName(f, rt.gl("SSevents"), "reschedule", []);
	} else {
		(rt.modField(f, rt.gl("SSevents"), "frequency_upper", 600, subtract));
		if (rt.lt(rt.fv(f, "frequency_upper", rt.gl("SSevents")), rt.fv(f, "frequency_lower", rt.gl("SSevents")))) {
			rt.setFv(f, "frequency_upper", rt.gl("SSevents"), rt.fv(f, "frequency_lower", rt.gl("SSevents")));
		}
		rt.callName(f, rt.gl("SSevents"), "reschedule", []);
		rt.call(f, P("/proc/message_admins"), null, [fmt("Summon Events intensifies, events will now occur every ＀ to ＀ minutes.", [divide(rt.fv(f, "frequency_lower", rt.gl("SSevents")), 600), divide(rt.fv(f, "frequency_upper", rt.gl("SSevents")), 600)])]);
		rt.call(f, P("/proc/log_game"), null, ["Summon Events was increased!"]);
	}
	return f.dot;
});
