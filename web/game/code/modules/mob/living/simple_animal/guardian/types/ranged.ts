// Based on /tg/station's code/modules/mob/living/simple_animal/guardian/types/ranged.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, subtract } = rt;


rt.type(4880, "/mob/living/simple_animal/hostile/guardian/ranged", "/mob/living/simple_animal/hostile/guardian", {
	snares: null,
	toggle: 0,
	range: 13,
	playstyle_string: "<span class='holoparasite'>As a <b>ranged</b> type, you have only light damage resistance, but are capable of spraying shards of crystal at incredibly high speed. You can also deploy surveillance snares to monitor enemy movement. Finally, you can switch to scout mode, in which you can't attack, but can move without limit.</span>",
	magic_fluff_string: "<span class='holoparasite'>..And draw the Sentinel, an alien master of ranged combat.</span>",
	tech_fluff_string: "<span class='holoparasite'>Boot sequence complete. Ranged combat modules active. Holoparasite swarm online.</span>",
	carp_fluff_string: "<span class='holoparasite'>CARP CARP CARP! Caught one, it's a ranged carp. This fishy can watch people pee in the ocean.</span>",
	a_intent: "help",
	friendly: "quietly assesses",
	melee_damage_lower: 10,
	melee_damage_upper: 10,
	damage_coeff: null,
	projectiletype: rt.typePath("/obj/item/projectile/guardian"),
	ranged_cooldown_time: 1,
	projectilesound: rt.rsc("sound/effects/hit_on_shattered_glass.ogg"),
	ranged: 1,
	see_invisible: 25,
	see_in_dark: 8,
	toggle_button_type: rt.typePath("/obj/screen/guardian/ToggleMode"),
});

// ranged.dm:27
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.snares = list();
	this.damage_coeff = rt.alist(f, ["brute", 0.9, "fire", 0.9, "tox", 0.9, "clone", 0.9, "stamina", 0, "oxy", 0.9]);
	return f.dot;
});

// ranged.dm:31
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleMode", function ToggleMode(f: Frame) {
	if (this.loc == this.summoner) {
		if (this.toggle) {
			this.ranged = rt.initial(f, this, "ranged");
			this.melee_damage_lower = rt.initial(f, this, "melee_damage_lower");
			this.melee_damage_upper = rt.initial(f, this, "melee_damage_upper");
			this.obj_damage = rt.initial(f, this, "obj_damage");
			this.environment_smash = rt.initial(f, this, "environment_smash");
			this.alpha = 255;
			this.range = rt.initial(f, this, "range");
			this.incorporeal_move = 0;
			to_chat(this, "<span class='danger'><B>You switch to combat mode.</span></B>");
			this.toggle = 0;
		} else {
			this.ranged = 0;
			this.melee_damage_lower = 0;
			this.melee_damage_upper = 0;
			this.obj_damage = 0;
			this.environment_smash = 0;
			this.alpha = 45;
			this.range = 255;
			this.incorporeal_move = 1;
			to_chat(this, "<span class='danger'><B>You switch to scout mode.</span></B>");
			this.toggle = 1;
		}
	} else {
		to_chat(this, "<span class='danger'><B>You have to be recalled to toggle modes!</span></B>");
	}
	return f.dot;
});

// ranged.dm:58
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/Shoot", function* Shoot(f: Frame, targeted_atom: Value) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(f.dot, T("/obj/item/projectile"))) return f.dot;
	let _P: Value = f.dot;
	if (!this.namedatum) return f.dot;
	_P.color = this.namedatum.colour;
	return f.dot;
}, true);

// ranged.dm:66
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/proc/ToggleLight", function ToggleLight(f: Frame) {
	let msg: Value = null;
	if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE;
		msg = "You activate your night vision.";
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_VISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE;
		msg = "You increase your night vision.";
	} else if (this.lighting_alpha === LIGHTING_PLANE_ALPHA_MOSTLY_INVISIBLE) {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_INVISIBLE;
		msg = "You maximize your night vision.";
	} else {
		this.lighting_alpha = LIGHTING_PLANE_ALPHA_VISIBLE;
		msg = "You deactivate your night vision.";
	}
	to_chat(this, `<span class='notice'>${msg}</span>`);
	return f.dot;
});

// ranged.dm:87
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/verb/Snare", function* Snare(f: Frame) {
	let snare_loc: Value = null, S: Value = null;
	if (rt.len(f, this.snares) < 6) {
		snare_loc = rt.getStep(f, this.loc, 0);
		(S = (yield* new_(T("/obj/effect/snare"), snare_loc))).spawner = this;
		S.name = `${get_area(snare_loc)} snare (${rand(1, 1000)})`;
		(rt.modField(f, this, "snares", S, rt.bitOr));
		to_chat(this, "<span class='danger'><B>Surveillance snare deployed!</span></B>");
	} else {
		to_chat(this, "<span class='danger'><B>You have too many snares deployed. Remove some first.</span></B>");
	}
	return f.dot;
}, true, { verb: { name: "Set Surveillance Snare", category: "Guardian", desc: "Set an invisible snare that will alert you when living creatures walk over it. Max of 5" } });

// ranged.dm:101
rt.def("/mob/living/simple_animal/hostile/guardian/ranged/verb/DisarmSnare", function* DisarmSnare(f: Frame) {
	let picked_snare: Value = null;
	if (!(picked_snare = (yield* g.op(f, "Prompt", [1], [null, "Remove Snare", "Pick which snare to remove", this, this.snares])))) return f.dot;
	(rt.modField(f, this, "snares", picked_snare, subtract));
	yield* qdel(picked_snare);
	to_chat(this, "<span class='danger'><B>Snare disarmed.</span></B>");
	return f.dot;
}, true, { verb: { name: "Remove Surveillance Snare", category: "Guardian", desc: "Disarm unwanted surveillance snares." } });

rt.type(12085, "/obj/effect/snare", "/obj/effect", {
	spawner: null,
	name: "snare",
	desc: "You shouldn't be seeing this!",
	invisibility: 101,
});

// ranged.dm:115
rt.def("/obj/effect/snare/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let para: Value = null;
	if (!(rt.istype(AM, T("/mob/living")) && this.spawner && this.spawner.summoner && AM != this.spawner && !this.spawner.hasmatchingsummoner(AM))) return f.dot;
	to_chat(this.spawner.summoner, `<span class='danger'><B>${AM} has crossed surveillance snare, ${this.name}.</span></B>`);
	let guardians: Value = this.spawner.summoner.hasparasites();
	for (para of each(guardians)) {
		to_chat(para, `<span class='danger'><B>${AM} has crossed surveillance snare, ${this.name}.</span></B>`);
	}
	return f.dot;
});
