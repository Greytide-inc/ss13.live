// Based on /tg/station's code/modules/reagents/chemistry/reagents/blob_reagents.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(3522, "/datum/reagent/blob", "/datum/reagent", {
	complementary_color: "#000000",
	shortdesc: null,
	effectdesc: null,
	analyzerdescdamage: "Unknown. Report this bug to a coder, or just adminhelp.",
	analyzerdesceffect: "N/A",
	blobbernaut_message: "slams",
	message: "The blob strikes you",
	message_living: null,
	name: "Unknown",
	description: "shouldn't exist and you should adminhelp immediately.",
	color: "#FFFFFF",
	taste_description: "slime and errors",
	can_synth: 0,
});

// blob_reagents.dm:18
rt.def("/datum/reagent/blob/proc/send_message", function send_message(f: Frame, M: Value) {
	let totalmessage: Value = rt.sv(f, "message");
	if (this.message_living && !rt.istype(M, T("/mob/living/silicon"))) {
		totalmessage += this.message_living;
	}
	totalmessage += "!";
	to_chat(M, `<span class='userdanger'>${totalmessage}</span>`);
	return f.dot;
});

// blob_reagents.dm:25
rt.def("/datum/reagent/blob/proc/reaction_mob", function reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value, O: Value) {
	method ??= TOUCH;
	if (M.stat == 2 || rt.istype(M, T("/mob/living/simple_animal/hostile/blob"))) {
		return 0;
	}
	return round(reac_volume * min(1.5 - touch_protection, 1), 0.1);
});

rt.type(3523, "/datum/reagent/blob/replicating_foam", "/datum/reagent/blob", {
	name: "Replicating Foam",
	id: "replicating_foam",
	description: "will do medium brute damage and occasionally expand again when expanding.",
	shortdesc: "will do medium brute damage.",
	effectdesc: "will also expand when attacked with burn damage, but takes more brute damage.",
	analyzerdescdamage: "Does medium brute damage.",
	analyzerdesceffect: "Expands when attacked with burn damage, will occasionally expand again when expanding, and is fragile to brute damage.",
	color: "#7B5A57",
	complementary_color: "#57787B",
});

// blob_reagents.dm:60
rt.def("/datum/reagent/blob/replicating_foam/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].apply_damage(0.7 * f.args[2], "brute");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:64
rt.def("/datum/reagent/blob/replicating_foam/proc/damage_reaction", function* damage_reaction(f: Frame) {
	let newB: Value = null;
	if (f.args[2] == "brute") {
		f.args[1] = f.args[1] * 2;
	} else if (f.args[2] == "fire" && f.args[1] > 0 && f.args[0].obj_integrity - f.args[1] > 0 && prob(60)) {
		if (newB = (yield* f.args[0].expand(null, null, 0))) {
			newB.obj_integrity = f.args[0].obj_integrity - f.args[1];
			yield* newB.update_icon();
		}
	}
	return (yield* parent_proc());
}, true, { args: ["B", "damage", "damage_type", "damage_flag"] });

// blob_reagents.dm:74
rt.def("/datum/reagent/blob/replicating_foam/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	if (!prob(30)) return f.dot;
	yield* newB.expand(null, null, 0);
	return f.dot;
}, true);

rt.type(3524, "/datum/reagent/blob/networked_fibers", "/datum/reagent/blob", {
	name: "Networked Fibers",
	id: "networked_fibers",
	description: "will do high brute and burn damage but non-manual expansion will only generate resources.",
	shortdesc: "will do high brute and burn damage.",
	effectdesc: "will move your core when manually expanding near it.",
	analyzerdescdamage: "Does high brute and burn damage.",
	analyzerdesceffect: "Is highly mobile and generates resources rapidly.",
	color: "#CDC0B0",
	complementary_color: "#FFF68F",
});

// blob_reagents.dm:90
rt.def("/datum/reagent/blob/networked_fibers/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].apply_damage(0.6 * f.args[2], "brute");
	if (!f.args[0]) return f.dot;
	yield* f.args[0].apply_damage(0.6 * f.args[2], "fire");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:96
rt.def("/datum/reagent/blob/networked_fibers/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	let A: Value = null, C: Value = null;
	if (!O && newB.overmind) {
		if (!rt.istype(B, T("/obj/structure/blob/node"))) {
			newB.overmind.add_points(1);
			yield* qdel(newB);
		}
	} else {
		A = get_area(_T);
		if (!(!rt.istype(_T, T("/turf/open/space")) && !rt.istype(A, T("/area/shuttle")))) return f.dot;
		for (C of each(range(1, newB), T("/obj/structure/blob/core"))) {
			if (C.overmind == O) {
				yield* newB.forceMove(rt.getStep(f, C, 0));
				yield* C.forceMove(_T);
				yield* C.setDir(rt.getDir(f, newB, C));
				O.add_points(1);
			}
		}
	}
	return f.dot;
}, true);

rt.type(3525, "/datum/reagent/blob/shifting_fragments", "/datum/reagent/blob", {
	name: "Shifting Fragments",
	id: "shifting_fragments",
	description: "will do medium brute damage.",
	effectdesc: "will also cause blob parts to shift away when attacked.",
	analyzerdescdamage: "Does medium brute damage.",
	analyzerdesceffect: "When attacked, may shift away from the attacker.",
	color: "#C8963C",
	complementary_color: "#3C6EC8",
});

// blob_reagents.dm:122
rt.def("/datum/reagent/blob/shifting_fragments/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].apply_damage(0.7 * f.args[2], "brute");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:126
rt.def("/datum/reagent/blob/shifting_fragments/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	if (!(rt.istype(B, T("/obj/structure/blob/normal")) || rt.istype(B, T("/obj/structure/blob/shield")) && prob(25))) return f.dot;
	yield* newB.forceMove(rt.getStep(f, B, 0));
	yield* B.forceMove(_T);
	return f.dot;
}, true);

// blob_reagents.dm:131
rt.def("/datum/reagent/blob/shifting_fragments/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let blobstopick: Value = null, OB: Value = null, targeted: Value = null, _T: Value = null;
	if ((damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser") && damage > 0 && B.obj_integrity - damage > 0 && prob(60 - damage)) {
		blobstopick = list();
		for (OB of each(orange(1, B), T("/obj/structure/blob"))) {
			if ((rt.istype(OB, T("/obj/structure/blob/normal")) || rt.istype(OB, T("/obj/structure/blob/shield")) && prob(25)) && OB.overmind && OB.overmind.blob_reagent_datum.id == B.overmind.blob_reagent_datum.id) {
				blobstopick += OB;
			}
		}
		if (rt.len(f, blobstopick)) {
			targeted = pick(blobstopick);
			_T = rt.getStep(f, targeted, 0);
			yield* targeted.forceMove(rt.getStep(f, B, 0));
			yield* B.forceMove(_T);
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(3526, "/datum/reagent/blob/blazing_oil", "/datum/reagent/blob", {
	name: "Blazing Oil",
	id: "blazing_oil",
	description: "will do medium burn damage and set targets on fire.",
	effectdesc: "will also release bursts of flame when burnt, but takes damage from water.",
	analyzerdescdamage: "Does medium burn damage and sets targets on fire.",
	analyzerdesceffect: "Releases fire when burnt, but takes damage from water and other extinguishing liquids.",
	color: "#B68D00",
	complementary_color: "#BE5532",
	blobbernaut_message: "splashes",
	message: "The blob splashes you with burning oil",
	message_living: ", and you feel your skin char and melt",
});

// blob_reagents.dm:158
rt.def("/datum/reagent/blob/blazing_oil/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].adjust_fire_stacks(round(f.args[2] / 10));
	yield* f.args[0].IgniteMob();
	if (f.args[0]) {
		yield* f.args[0].apply_damage(0.8 * f.args[2], "fire");
	}
	if (!rt.istype(f.args[0], T("/mob/living/carbon"))) return f.dot;
	yield* f.args[0].emote("scream");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:167
rt.def("/datum/reagent/blob/blazing_oil/proc/extinguish_reaction", function* extinguish_reaction(f: Frame, B: Value) {
	yield* B.take_damage(1.5, "fire", "energy");
	return f.dot;
}, true);

// blob_reagents.dm:170
rt.def("/datum/reagent/blob/blazing_oil/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let _T: Value = null, C: Value = null;
	if (damage_type == "fire" && damage_flag != "energy") {
		for (_T of each(range(1, B), T("/turf/open"))) {
			if (!((C = rt.locateIn(f, T("/obj/structure/blob"), _T)) && C.overmind && C.overmind.blob_reagent_datum.id == B.overmind.blob_reagent_datum.id) && prob(80)) {
				yield* new_(T("/obj/effect/hotspot"), _T);
			}
		}
	}
	if (damage_flag == "fire") {
		return 0;
	}
	return (yield* parent_proc());
}, true);

rt.type(3527, "/datum/reagent/blob/regenerative_materia", "/datum/reagent/blob", {
	name: "Regenerative Materia",
	id: "regenerative_materia",
	description: "will do toxin damage and cause targets to believe they are fully healed.",
	analyzerdescdamage: "Does toxin damage and injects a toxin that causes the target to believe they are fully healed.",
	color: "#C8A5DC",
	complementary_color: "#CD7794",
	message_living: ", and you feel <i>alive</i>",
});

// blob_reagents.dm:190
rt.def("/datum/reagent/blob/regenerative_materia/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].adjust_drugginess(f.args[2]);
	if (f.args[0].reagents) {
		yield* f.args[0].reagents.add_reagent("regenerative_materia", 0.2 * f.args[2]);
		yield* f.args[0].reagents.add_reagent("spore", 0.2 * f.args[2]);
	}
	yield* f.args[0].apply_damage(0.7 * f.args[2], "tox");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:198
rt.def("/datum/reagent/blob/regenerative_materia/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	let N: Value = null;
	yield* M.adjustToxLoss(1);
	if (rt.istype(M, T("/mob/living/carbon"))) {
		(N = M).hal_screwyhud = SCREWYHUD_HEALTHY;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// blob_reagents.dm:205
rt.def("/datum/reagent/blob/regenerative_materia/proc/on_mob_delete", function on_mob_delete(f: Frame, M: Value) {
	let N: Value = null;
	if (rt.istype(M, T("/mob/living/carbon"))) {
		(N = M).hal_screwyhud = 0;
	}
	parent_proc();
	return f.dot;
}, false);

rt.type(3528, "/datum/reagent/blob/zombifying_pods", "/datum/reagent/blob", {
	name: "Zombifying Pods",
	id: "zombifying_pods",
	description: "will do very low toxin damage and harvest sleeping targets for additional resources and a blob zombie.",
	effectdesc: "will also produce fragile spores when killed and on expanding.",
	shortdesc: "will do very low toxin damage and harvest sleeping targets for additional resources(for your overmind) and a blob zombie.",
	analyzerdescdamage: "Does very low toxin damage and kills unconscious humans, turning them into blob zombies.",
	analyzerdesceffect: "Produces spores when expanding and when killed.",
	color: "#E88D5D",
	complementary_color: "#823ABB",
	message_living: ", and you feel tired",
});

// blob_reagents.dm:224
rt.def("/datum/reagent/blob/zombifying_pods/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let BS: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].apply_damage(0.6 * f.args[2], "tox");
	if (!(f.args[5] && rt.istype(f.args[0], T("/mob/living/carbon/human")) && f.args[0].stat == 1)) return f.dot;
	yield* f.args[0].death();
	let points: Value = rand(5, 10);
	(BS = (yield* new_(T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), rt.getStep(f, f.args[0], 0)))).overmind = f.args[5];
	yield* BS.update_icons();
	f.args[5].blob_mobs.Add(BS);
	yield* BS.Zombify(f.args[0]);
	f.args[5].add_points(points);
	to_chat(f.args[5], `<span class='notice'>Gained ${points} resources from the zombification of ${f.args[0]}.</span>`);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:238
rt.def("/datum/reagent/blob/zombifying_pods/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let BS: Value = null;
	if ((damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser") && damage <= 20 && B.obj_integrity - damage <= 0 && prob(30)) {
		B.visible_message("<span class='warning'><b>A spore floats free of the blob!</b></span>");
		(BS = (yield* new_(T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), B.loc))).overmind = B.overmind;
		yield* BS.update_icons();
		B.overmind.blob_mobs.Add(BS);
	}
	return (yield* parent_proc());
}, true);

// blob_reagents.dm:247
rt.def("/datum/reagent/blob/zombifying_pods/proc/expand_reaction", function* expand_reaction(f: Frame, B: Value, newB: Value, _T: Value, O: Value) {
	let BS: Value = null;
	if (!prob(10)) return f.dot;
	(BS = (yield* new_(T("/mob/living/simple_animal/hostile/blob/blobspore/weak"), _T))).overmind = B.overmind;
	yield* BS.update_icons();
	newB.overmind.blob_mobs.Add(BS);
	return f.dot;
}, true);

rt.type(3529, "/datum/reagent/blob/energized_jelly", "/datum/reagent/blob", {
	name: "Energized Jelly",
	id: "energized_jelly",
	description: "will cause low stamina and high oxygen damage, and cause targets to be unable to breathe.",
	effectdesc: "will also conduct electricity, but takes damage from EMPs.",
	analyzerdescdamage: "Does low stamina damage, high oxygen damage, and prevents targets from breathing.",
	analyzerdesceffect: "Is immune to electricity and will easily conduct it, but is weak to EMPs.",
	color: "#EFD65A",
	complementary_color: "#00E5B1",
	message_living: ", and you feel a horrible tingling sensation",
});

// blob_reagents.dm:266
rt.def("/datum/reagent/blob/energized_jelly/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	f.args[0].losebreath += round(0.2 * f.args[2]);
	yield* f.args[0].adjustStaminaLoss(0.4 * f.args[2]);
	if (!f.args[0]) return f.dot;
	yield* f.args[0].apply_damage(0.6 * f.args[2], "oxy");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:273
rt.def("/datum/reagent/blob/energized_jelly/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	if ((damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser") && B.obj_integrity - damage <= 0 && prob(10)) {
		yield* do_sparks(rand(2, 4), 0, B);
	}
	return (yield* parent_proc());
}, true);

// blob_reagents.dm:281
rt.def("/datum/reagent/blob/energized_jelly/proc/emp_reaction", function* emp_reaction(f: Frame, B: Value, severity: Value) {
	let damage: Value = rand(30, 50) - severity * rand(10, 15);
	yield* B.take_damage(damage, "fire", "energy");
	return f.dot;
}, true);

rt.type(3530, "/datum/reagent/blob/explosive_lattice", "/datum/reagent/blob", {
	name: "Explosive Lattice",
	id: "explosive_lattice",
	description: "will do brute damage in an area around targets.",
	effectdesc: "will also resist explosions, but takes increased damage from fire and other energy sources.",
	analyzerdescdamage: "Does medium brute damage and causes damage to everyone near its targets.",
	analyzerdesceffect: "Is highly resistant to explosions, but takes increased damage from fire and other energy sources.",
	color: "#8B2500",
	complementary_color: "#00668B",
	blobbernaut_message: "blasts",
	message: "The blob blasts you",
});

// blob_reagents.dm:298
rt.def("/datum/reagent/blob/explosive_lattice/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let E: Value = null, L: Value = null, aoe_volume: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	let initial_volume: Value = f.args[2];
	if ((f.args[2] = (yield* parent_proc())) >= 10) {
		(E = (yield* new_(T("/obj/effect/temp_visual/explosion/fast"), rt.getStep(f, f.args[0], 0)))).alpha = 150;
		for (L of each(orange(rt.getStep(f, f.args[0], 0), 1), T("/mob/living"))) {
			if (rt.isIn(f, "blob", L.faction)) {
				continue;
			}
			aoe_volume = (yield* parent_proc(L, TOUCH, initial_volume, 0, L.get_permeability_protection(), f.args[5]));
			yield* L.apply_damage(0.4 * aoe_volume, "brute");
		}
		if (f.args[0]) {
			yield* f.args[0].apply_damage(0.6 * f.args[2], "brute");
		}
	} else {
		yield* f.args[0].apply_damage(0.6 * f.args[2], "brute");
	}
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:314
rt.def("/datum/reagent/blob/explosive_lattice/proc/damage_reaction", function damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	if (damage_flag == "bomb") {
		return 0;
	} else if (damage_flag != "melee" || damage_flag != "bullet" || damage_flag != "laser") {
		return damage * 1.5;
	}
	return parent_proc();
}, false);

rt.type(3531, "/datum/reagent/blob/cryogenic_poison", "/datum/reagent/blob", {
	name: "Cryogenic Poison",
	id: "cryogenic_poison",
	description: "will inject targets with a freezing poison that does high damage over time.",
	analyzerdescdamage: "Injects targets with a freezing poison that will gradually solidify the target's internal organs.",
	color: "#8BA6E9",
	complementary_color: "#7D6EB4",
	blobbernaut_message: "injects",
	message: "The blob stabs you",
	message_living: ", and you feel like your insides are solidifying",
});

// blob_reagents.dm:333
rt.def("/datum/reagent/blob/cryogenic_poison/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	if (f.args[0].reagents) {
		yield* f.args[0].reagents.add_reagent("frostoil", 0.3 * f.args[2]);
		yield* f.args[0].reagents.add_reagent("ice", 0.3 * f.args[2]);
		yield* f.args[0].reagents.add_reagent("cryogenic_poison", 0.3 * f.args[2]);
	}
	yield* f.args[0].apply_damage(0.2 * f.args[2], "brute");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:341
rt.def("/datum/reagent/blob/cryogenic_poison/proc/on_mob_life", function* on_mob_life(f: Frame, M: Value) {
	yield* M.adjustBruteLoss(0.3, 0);
	yield* M.adjustFireLoss(0.3, 0);
	yield* M.adjustToxLoss(0.3, 0);
	f.dot = 1;
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(3532, "/datum/reagent/blob/electromagnetic_web", "/datum/reagent/blob", {
	name: "Electromagnetic Web",
	id: "electromagnetic_web",
	description: "will do high burn damage and EMP targets.",
	effectdesc: "will also take massively increased damage and release an EMP when killed.",
	analyzerdescdamage: "Does low burn damage and EMPs targets.",
	analyzerdesceffect: "Is fragile to all types of damage, but takes massive damage from brute. In addition, releases a small EMP when killed.",
	color: "#83ECEC",
	complementary_color: "#EC8383",
	blobbernaut_message: "lashes",
	message: "The blob lashes you",
	message_living: ", and you hear a faint buzzing",
});

// blob_reagents.dm:362
rt.def("/datum/reagent/blob/electromagnetic_web/proc/reaction_mob", function* reaction_mob(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	if (prob((f.args[2] = (yield* parent_proc())) * 2)) {
		yield* f.args[0].emp_act(2);
	}
	if (!f.args[0]) return f.dot;
	yield* f.args[0].apply_damage(f.args[2], "fire");
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:369
rt.def("/datum/reagent/blob/electromagnetic_web/proc/damage_reaction", function damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	if (damage_type == "brute") {
		if (B.brute_resist === 0.5) {
			return damage * 2;
		} else if (B.brute_resist === 0.25) {
			return damage * 4;
		} else if (B.brute_resist === 0.1) {
			return damage * 10;
		}
	}
	return damage * 1.25;
});

// blob_reagents.dm:380
rt.def("/datum/reagent/blob/electromagnetic_web/proc/death_reaction", function* death_reaction(f: Frame, B: Value, damage_flag: Value) {
	if (!(damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser")) return f.dot;
	yield* empulse(B.loc, 1, 3);
	return f.dot;
}, true);

rt.type(3533, "/datum/reagent/blob/synchronous_mesh", "/datum/reagent/blob", {
	name: "Synchronous Mesh",
	id: "synchronous_mesh",
	description: "will do massively increased brute damage for each blob near the target.",
	effectdesc: "will also spread damage between each blob near the attacked blob.",
	analyzerdescdamage: "Does brute damage, increasing for each blob near the target.",
	analyzerdesceffect: "When attacked, spreads damage between all blobs near the attacked blob.",
	color: "#65ADA2",
	complementary_color: "#AD6570",
	blobbernaut_message: "synchronously strikes",
	message: "The blobs strike you",
});

// blob_reagents.dm:397
rt.def("/datum/reagent/blob/synchronous_mesh/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let B: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	yield* f.args[0].apply_damage(0.2 * f.args[2], "brute");
	if (!(f.args[0] && f.args[2])) return f.dot;
	for (B of each(range(1, f.args[0]), T("/obj/structure/blob"))) {
		if (f.args[0]) {
			yield* B.blob_attack_animation(f.args[0]);
			yield* f.args[0].apply_damage(0.3 * f.args[2], "brute");
		}
	}
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:406
rt.def("/datum/reagent/blob/synchronous_mesh/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let damagesplit: Value = null, C: Value = null;
	if (damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser") {
		damagesplit = 1;
		for (C of each(orange(1, B), T("/obj/structure/blob"))) {
			if (!rt.istype(C, T("/obj/structure/blob/core")) && !rt.istype(C, T("/obj/structure/blob/node")) && C.overmind && C.overmind.blob_reagent_datum.id == B.overmind.blob_reagent_datum.id) {
				damagesplit += 1;
			}
		}
		C = null;
		for (C of each(orange(1, B), T("/obj/structure/blob"))) {
			if (!rt.istype(C, T("/obj/structure/blob/core")) && !rt.istype(C, T("/obj/structure/blob/node")) && C.overmind && C.overmind.blob_reagent_datum.id == B.overmind.blob_reagent_datum.id) {
				yield* C.take_damage(damage / damagesplit, "clone", 0, 0);
			}
		}
		return damage / damagesplit;
	} else {
		return damage * 1.25;
	}
}, true);

rt.type(3534, "/datum/reagent/blob/reactive_spines", "/datum/reagent/blob", {
	name: "Reactive Spines",
	id: "reactive_spines",
	description: "will do medium brute damage through armor and bio resistance.",
	effectdesc: "will also react when attacked with brute damage, attacking all near the attacked blob.",
	analyzerdescdamage: "Does medium brute damage, ignoring armor and bio resistance.",
	analyzerdesceffect: "When attacked with brute damage, will lash out, attacking everything near it.",
	color: "#9ACD32",
	complementary_color: "#FFA500",
	blobbernaut_message: "stabs",
	message: "The blob stabs you",
});

// blob_reagents.dm:432
rt.def("/datum/reagent/blob/reactive_spines/proc/reaction_mob", function* reaction_mob(f: Frame, M: Value, method: Value, reac_volume: Value, show_message: Value, touch_protection: Value, O: Value) {
	method ??= TOUCH;
	if (M.stat == 2 || rt.istype(M, T("/mob/living/simple_animal/hostile/blob"))) {
		return 0;
	}
	yield* M.adjustBruteLoss(0.8 * reac_volume);
	return f.dot;
}, true);

// blob_reagents.dm:437
rt.def("/datum/reagent/blob/reactive_spines/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	let A: Value = null;
	if (damage && damage_type == "brute" && B.obj_integrity - damage > 0) {
		if (damage_flag == "melee") {
			B.visible_message("<span class='boldwarning'>The blob retaliates, lashing out!</span>");
		}
		for (A of each(range(1, B), T("/atom"))) {
			yield* A.blob_act(B);
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(3535, "/datum/reagent/blob/pressurized_slime", "/datum/reagent/blob", {
	name: "Pressurized Slime",
	id: "pressurized_slime",
	description: "will do low brute, oxygen, and stamina damage, and wet tiles under targets.",
	effectdesc: "will also wet tiles near blobs that are attacked or killed.",
	analyzerdescdamage: "Does low brute damage, low oxygen damage, drains stamina, and wets tiles under targets, extinguishing them.",
	analyzerdesceffect: "When attacked or killed, wets nearby tiles, extinguishing anything on them.",
	color: "#AAAABB",
	complementary_color: "#BBBBAA",
	blobbernaut_message: "emits slime at",
	message: "The blob splashes into you",
	message_living: ", and you gasp for breath",
});

// blob_reagents.dm:459
rt.def("/datum/reagent/blob/pressurized_slime/proc/reaction_mob", function* reaction_mob(f: Frame) {
	let _T: Value = null;
	if (f.args[1] === null) {
		f.args[1] = TOUCH;
	}
	f.args[2] = (yield* parent_proc());
	if (rt.istype((_T = rt.getStep(f, f.args[0], 0)), T("/turf/open")) && prob(f.args[2])) {
		yield* _T.MakeSlippery({ min_wet_time: 10, wet_time_to_add: 5 });
		yield* f.args[0].adjust_fire_stacks(-(f.args[2] / 10));
		yield* f.args[0].ExtinguishMob();
	}
	yield* f.args[0].apply_damage(0.4 * f.args[2], "brute");
	if (f.args[0]) {
		yield* f.args[0].apply_damage(0.4 * f.args[2], "oxy");
	}
	if (!f.args[0]) return f.dot;
	yield* f.args[0].adjustStaminaLoss(0.2 * f.args[2]);
	return f.dot;
}, true, { args: ["M", "method", "reac_volume", "show_message", "touch_protection", "O"] });

// blob_reagents.dm:472
rt.def("/datum/reagent/blob/pressurized_slime/proc/damage_reaction", function* damage_reaction(f: Frame, B: Value, damage: Value, damage_type: Value, damage_flag: Value) {
	if (damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser" || damage_type != "fire") {
		yield* this.extinguisharea(B, damage);
	}
	return (yield* parent_proc());
}, true);

// blob_reagents.dm:477
rt.def("/datum/reagent/blob/pressurized_slime/proc/death_reaction", function* death_reaction(f: Frame, B: Value, damage_flag: Value) {
	if (!(damage_flag == "melee" || damage_flag == "bullet" || damage_flag == "laser")) return f.dot;
	B.visible_message("<span class='boldwarning'>The blob ruptures, spraying the area with liquid!</span>");
	yield* this.extinguisharea(B, 50);
	return f.dot;
}, true);

// blob_reagents.dm:482
rt.def("/datum/reagent/blob/pressurized_slime/proc/extinguisharea", function* extinguisharea(f: Frame, B: Value, probchance: Value) {
	let _T: Value = null, O: Value = null, L: Value = null;
	for (_T of each(range(1, B), T("/turf/open"))) {
		if (prob(probchance)) {
			yield* _T.MakeSlippery({ min_wet_time: 10, wet_time_to_add: 5 });
			O = null;
			for (O of each(_T, T("/obj"))) {
				yield* O.extinguish();
			}
			L = null;
			for (L of each(_T, T("/mob/living"))) {
				yield* L.adjust_fire_stacks(-2.5);
				yield* L.ExtinguishMob();
			}
		}
	}
	return f.dot;
}, true);
