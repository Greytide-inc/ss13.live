// Based on /tg/station's code/modules/events/spacevine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, subtract, fmt } = rt;


rt.type(321, "/datum/round_event/spacevine", "/datum/round_event", {});

// spacevine.dm:9
rt.def("/datum/round_event/spacevine/proc/start", function* start(f: Frame) {
	let A: Value = null, F: Value = null, _T: Value = null;
	let turfs: Value = list();
	let SV: Value = (yield* new_(T("/obj/structure/spacevine")));
	for (A of each(rt.world(), T("/area/hallway"))) {
		F = null;
		for (F of each(A, T("/turf"))) {
			if (yield* F.Enter(SV)) {
				turfs += F;
			}
		}
	}
	yield* qdel(SV);
	if (!rt.len(f, turfs)) return f.dot;
	yield* new_(T("/datum/spacevine_controller"), (_T = pick(turfs)));
	return f.dot;
}, true);

rt.type(2297, "/datum/spacevine_mutation", "/datum", {
	name: "",
	severity: 1,
	hue: null,
	quality: null,
});

// spacevine.dm:32
rt.def("/datum/spacevine_mutation/proc/add_mutation_to_vinepiece", function add_mutation_to_vinepiece(f: Frame, holder: Value) {
	(rt.modField(f, holder, "mutations", this, rt.bitOr));
	holder.add_atom_colour(this.hue, FIXED_COLOUR_PRIORITY);
	return f.dot;
});

// spacevine.dm:51
rt.def("/datum/spacevine_mutation/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	f.dot = expected_damage;
	return f.dot;
});

rt.type(2298, "/datum/spacevine_mutation/space_covering", "/datum/spacevine_mutation", {
	name: "space protective",
	hue: "#aa77aa",
	quality: 1,
}, { global: { coverable_turfs: 660 } });

// spacevine.dm:81
rt.def("/datum/spacevine_mutation/space_covering/proc/New", function New(f: Frame) {
	f.dot = parent_proc();
	if (GLOB.coverable_turfs) return f.dot;
	GLOB.coverable_turfs = typecacheof(list(T("/turf/open/space"))) - T("/turf/open/space/transit");
	return f.dot;
});

// spacevine.dm:86
rt.def("/datum/spacevine_mutation/space_covering/proc/on_grow", function* on_grow(f: Frame, holder: Value) {
	yield* this.process_mutation(holder);
	return f.dot;
}, true);

// spacevine.dm:89
rt.def("/datum/spacevine_mutation/space_covering/proc/process_mutation", function* process_mutation(f: Frame, holder: Value) {
	let _T: Value = null;
	if (!is_type_in_typecache((_T = rt.getStep(f, holder, 0)), GLOB.coverable_turfs)) return f.dot;
	let currtype: Value = _T.type;
	yield* _T.ChangeTurf(T("/turf/open/floor/vines"));
	_T.baseturf = currtype;
	return f.dot;
}, true);

// spacevine.dm:96
rt.def("/datum/spacevine_mutation/space_covering/proc/on_death", function* on_death(f: Frame, holder: Value) {
	let _T: Value = null;
	if (!rt.istype((_T = rt.getStep(f, holder, 0)), T("/turf/open/floor/vines"))) return f.dot;
	yield* _T.ChangeTurf(_T.baseturf);
	return f.dot;
}, true);

rt.type(2299, "/datum/spacevine_mutation/bluespace", "/datum/spacevine_mutation", {
	name: "bluespace",
	hue: "#3333ff",
	quality: 3,
});

// spacevine.dm:106
rt.def("/datum/spacevine_mutation/bluespace/proc/on_spread", function* on_spread(f: Frame, holder: Value, target: Value) {
	if (!(holder.energy > 1 && !rt.locateIn(f, T("/obj/structure/spacevine"), target))) return f.dot;
	yield* holder.master.spawn_spacevine_piece(target, holder);
	return f.dot;
}, true);

rt.type(2300, "/datum/spacevine_mutation/light", "/datum/spacevine_mutation", {
	name: "light",
	hue: "#ffff00",
	quality: 1,
	severity: 4,
});

// spacevine.dm:116
rt.def("/datum/spacevine_mutation/light/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	if (!holder.energy) return f.dot;
	holder.set_light(this.severity, 0.3);
	return f.dot;
});

rt.type(2301, "/datum/spacevine_mutation/toxicity", "/datum/spacevine_mutation", {
	name: "toxic",
	hue: "#ff00ff",
	severity: 10,
	quality: 2,
});

// spacevine.dm:126
rt.def("/datum/spacevine_mutation/toxicity/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	if (rt.istype(crosser, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (!(prob(this.severity) && rt.istype(crosser, T("/mob/living")) && !isvineimmune(crosser))) return f.dot;
	to_chat(crosser, "<span class='alert'>You accidently touch the vine and feel a strange sensation.</span>");
	yield* crosser.adjustToxLoss(5);
	return f.dot;
}, true);

// spacevine.dm:133
rt.def("/datum/spacevine_mutation/toxicity/proc/on_eat", function* on_eat(f: Frame, holder: Value, eater: Value) {
	if (isvineimmune(eater)) return f.dot;
	yield* eater.adjustToxLoss(5);
	return f.dot;
}, true);

rt.type(2302, "/datum/spacevine_mutation/explosive", "/datum/spacevine_mutation", {
	name: "explosive",
	hue: "#ff0000",
	quality: 2,
	severity: 2,
});

// spacevine.dm:143
rt.def("/datum/spacevine_mutation/explosive/proc/on_explosion", function* on_explosion(f: Frame, explosion_severity: Value, target: Value, holder: Value) {
	if (explosion_severity < 3) {
		yield* qdel(holder);
	} else {
		f.dot = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), holder)), 5, 8);
	}
	return f.dot;
}, true);

// spacevine.dm:150
rt.def("/datum/spacevine_mutation/explosive/proc/on_death", function on_death(f: Frame, holder: Value, hitter: Value, I: Value) {
	explosion(holder.loc, 0, 0, this.severity, 0, 0);
	return f.dot;
});

rt.type(2303, "/datum/spacevine_mutation/fire_proof", "/datum/spacevine_mutation", {
	name: "fire proof",
	hue: "#ff8888",
	quality: 3,
});

// spacevine.dm:161
rt.def("/datum/spacevine_mutation/fire_proof/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	if (I && I.damtype == "fire") {
		f.dot = 0;
	} else {
		f.dot = expected_damage;
	}
	return f.dot;
});

rt.type(2304, "/datum/spacevine_mutation/vine_eating", "/datum/spacevine_mutation", {
	name: "vine eating",
	hue: "#ff7700",
	quality: 3,
});

// spacevine.dm:172
rt.def("/datum/spacevine_mutation/vine_eating/proc/on_spread", function* on_spread(f: Frame, holder: Value, target: Value) {
	let prey: Value = null;
	if (!((prey = rt.locateIn(f, T("/obj/structure/spacevine"), target)) && !prey.mutations.Find(this))) return f.dot;
	yield* qdel(prey);
	return f.dot;
}, true);

rt.type(2305, "/datum/spacevine_mutation/aggressive_spread", "/datum/spacevine_mutation", {
	name: "aggressive spreading",
	hue: "#333333",
	severity: 3,
	quality: 2,
});

// spacevine.dm:183
rt.def("/datum/spacevine_mutation/aggressive_spread/proc/on_spread", function on_spread(f: Frame, holder: Value, target: Value) {
	target.ex_act(this.severity, null, this);
	return f.dot;
});

// spacevine.dm:186
rt.def("/datum/spacevine_mutation/aggressive_spread/proc/on_buckle", function on_buckle(f: Frame, holder: Value, buckled: Value) {
	buckled.ex_act(this.severity, null, this);
	return f.dot;
});

rt.type(2306, "/datum/spacevine_mutation/transparency", "/datum/spacevine_mutation", {
	name: "transparent",
	hue: "",
	quality: 1,
});

// spacevine.dm:194
rt.def("/datum/spacevine_mutation/transparency/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	holder.set_opacity(0);
	holder.alpha = 125;
	return f.dot;
});

rt.type(2307, "/datum/spacevine_mutation/oxy_eater", "/datum/spacevine_mutation", {
	name: "oxygen consuming",
	hue: "#ffff88",
	severity: 3,
	quality: 2,
});

// spacevine.dm:205
rt.def("/datum/spacevine_mutation/oxy_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	if (!rt.istype((_T = holder.loc), T("/turf/open/floor"))) return f.dot;
	if (!rt.index((GM = _T.air).gases, "o2")) {
		return f.dot;
	}
	(rt.modAt(rt.index(GM.gases, "o2"), 1, this.severity * holder.energy, subtract));
	GM.garbage_collect();
	return f.dot;
});

rt.type(2308, "/datum/spacevine_mutation/nitro_eater", "/datum/spacevine_mutation", {
	name: "nitrogen consuming",
	hue: "#8888ff",
	severity: 3,
	quality: 2,
});

// spacevine.dm:220
rt.def("/datum/spacevine_mutation/nitro_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	if (!rt.istype((_T = holder.loc), T("/turf/open/floor"))) return f.dot;
	if (!rt.index((GM = _T.air).gases, "n2")) {
		return f.dot;
	}
	(rt.modAt(rt.index(GM.gases, "n2"), 1, this.severity * holder.energy, subtract));
	GM.garbage_collect();
	return f.dot;
});

rt.type(2309, "/datum/spacevine_mutation/carbondioxide_eater", "/datum/spacevine_mutation", {
	name: "CO2 consuming",
	hue: "#00ffff",
	severity: 3,
	quality: 1,
});

// spacevine.dm:235
rt.def("/datum/spacevine_mutation/carbondioxide_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	if (!rt.istype((_T = holder.loc), T("/turf/open/floor"))) return f.dot;
	if (!rt.index((GM = _T.air).gases, "co2")) {
		return f.dot;
	}
	(rt.modAt(rt.index(GM.gases, "co2"), 1, this.severity * holder.energy, subtract));
	GM.garbage_collect();
	return f.dot;
});

rt.type(2310, "/datum/spacevine_mutation/plasma_eater", "/datum/spacevine_mutation", {
	name: "toxins consuming",
	hue: "#ffbbff",
	severity: 3,
	quality: 1,
});

// spacevine.dm:250
rt.def("/datum/spacevine_mutation/plasma_eater/proc/process_mutation", function process_mutation(f: Frame, holder: Value) {
	let _T: Value = null, GM: Value = null;
	if (!rt.istype((_T = holder.loc), T("/turf/open/floor"))) return f.dot;
	if (!rt.index((GM = _T.air).gases, "plasma")) {
		return f.dot;
	}
	(rt.modAt(rt.index(GM.gases, "plasma"), 1, this.severity * holder.energy, subtract));
	GM.garbage_collect();
	return f.dot;
});

rt.type(2311, "/datum/spacevine_mutation/thorns", "/datum/spacevine_mutation", {
	name: "thorny",
	hue: "#666666",
	severity: 10,
	quality: 2,
});

// spacevine.dm:264
rt.def("/datum/spacevine_mutation/thorns/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	let M: Value = null;
	if (!(prob(this.severity) && rt.istype(crosser, T("/mob/living")) && !isvineimmune(holder))) return f.dot;
	yield* (M = crosser).adjustBruteLoss(5);
	to_chat(M, "<span class='alert'>You cut yourself on the thorny vines.</span>");
	return f.dot;
}, true);

// spacevine.dm:270
rt.def("/datum/spacevine_mutation/thorns/proc/on_hit", function* on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	let M: Value = null;
	if (prob(this.severity) && rt.istype(hitter, T("/mob/living")) && !isvineimmune(holder)) {
		yield* (M = hitter).adjustBruteLoss(5);
		to_chat(M, "<span class='alert'>You cut yourself on the thorny vines.</span>");
	}
	f.dot = expected_damage;
	return f.dot;
}, true);

rt.type(2312, "/datum/spacevine_mutation/woodening", "/datum/spacevine_mutation", {
	name: "hardened",
	hue: "#997700",
	quality: 2,
});

// spacevine.dm:282
rt.def("/datum/spacevine_mutation/woodening/proc/on_grow", function on_grow(f: Frame, holder: Value) {
	if (holder.energy) {
		holder.density = 1;
	}
	holder.max_integrity = 100;
	holder.obj_integrity = holder.max_integrity;
	return f.dot;
});

// spacevine.dm:288
rt.def("/datum/spacevine_mutation/woodening/proc/on_hit", function on_hit(f: Frame, holder: Value, hitter: Value, I: Value, expected_damage: Value) {
	if (I.is_sharp()) {
		f.dot = expected_damage * 0.5;
	} else {
		f.dot = expected_damage;
	}
	return f.dot;
});

rt.type(2313, "/datum/spacevine_mutation/flowering", "/datum/spacevine_mutation", {
	name: "flowering",
	hue: "#0A480D",
	quality: 2,
	severity: 10,
});

// spacevine.dm:300
rt.def("/datum/spacevine_mutation/flowering/proc/on_grow", function* on_grow(f: Frame, holder: Value) {
	if (!(holder.energy == 2 && prob(this.severity) && !rt.locateIn(f, T("/obj/structure/alien/resin/flower_bud_enemy"), range(5, holder)))) return f.dot;
	yield* new_(T("/obj/structure/alien/resin/flower_bud_enemy"), rt.getStep(f, holder, 0));
	return f.dot;
}, true);

// spacevine.dm:304
rt.def("/datum/spacevine_mutation/flowering/proc/on_cross", function* on_cross(f: Frame, holder: Value, crosser: Value) {
	if (!prob(25)) return f.dot;
	yield* holder.entangle(crosser);
	return f.dot;
}, true);

rt.type(12936, "/obj/structure/spacevine", "/obj/structure", {
	energy: 0,
	master: null,
	mutations: null,
	anchored: 1,
	pass_flags: 5,
	name: "space vines",
	desc: "An extremely expansionistic species of vine.",
	icon: rt.rsc("icons/effects/spacevines.dmi"),
	icon_state: "Light1",
	density: 0,
	layer: 4.8,
	mouse_opacity: 2,
	obj_integrity: 50,
	max_integrity: 50,
});

// spacevine.dm:323
rt.def("/obj/structure/spacevine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutations = list();
	return f.dot;
});

// spacevine.dm:326
rt.def("/obj/structure/spacevine/proc/Initialize", function Initialize(f: Frame) {
	parent_proc();
	this.add_atom_colour("#ffffff", FIXED_COLOUR_PRIORITY);
	return f.dot;
});

// spacevine.dm:330
rt.def("/obj/structure/spacevine/proc/examine", function examine(f: Frame, user: Value) {
	let A: Value = null, SM: Value = null;
	parent_proc();
	let text: Value = "This one is a";
	if (rt.len(f, this.mutations)) {
		for (A of each(this.mutations)) {
			text += ` ${(SM = A).name}`;
		}
	} else {
		text += " normal";
	}
	text += " vine.";
	to_chat(user, text);
	return f.dot;
}, false);

// spacevine.dm:342
rt.def("/obj/structure/spacevine/proc/Destroy", function* Destroy(f: Frame) {
	let SM: Value = null;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_death(this);
	}
	if (this.master) {
		yield* this.master.VineDestroyed(this);
	}
	this.mutations = list();
	this.set_opacity(0);
	if (this.has_buckled_mobs()) {
		yield* this.unbuckle_all_mobs({ force: 1 });
	}
	return (yield* parent_proc());
}, true);

// spacevine.dm:354
rt.def("/obj/structure/spacevine/proc/on_chem_effect", function* on_chem_effect(f: Frame, R: Value) {
	let SM: Value = null;
	let override: Value = 0;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		override += SM.on_chem(this, R);
	}
	if (!(!override && rt.istype(R, T("/datum/reagent/toxin/plantbgone")))) return f.dot;
	if (!prob(50)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// spacevine.dm:362
rt.def("/obj/structure/spacevine/proc/eat", function* eat(f: Frame, eater: Value) {
	let SM: Value = null;
	let override: Value = 0;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		override += (yield* SM.on_eat(this, eater));
	}
	if (override) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// spacevine.dm:369
rt.def("/obj/structure/spacevine/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let B: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/scythe"))) {
		user.changeNext_move(8);
		for (B of each(orange(1, this), T("/obj/structure/spacevine"))) {
			yield* B.take_damage(W.force * 4, "brute", "melee", 1);
		}
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
}, true);

// spacevine.dm:380
rt.def("/obj/structure/spacevine/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	let SM: Value = null;
	let damage_dealt: Value = I.force;
	if (I.is_sharp()) {
		damage_dealt *= 4;
	}
	if (I.damtype == "fire") {
		damage_dealt *= 4;
	}
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		damage_dealt = (yield* SM.on_hit(this, user, I, damage_dealt));
	}
	yield* this.take_damage(damage_dealt, I.damtype, "melee", 1);
	return f.dot;
}, true);

// spacevine.dm:390
rt.def("/obj/structure/spacevine/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this, rt.rsc("sound/weapons/slash.ogg"), 50, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// spacevine.dm:400
rt.def("/obj/structure/spacevine/proc/Crossed", function* Crossed(f: Frame, crosser: Value) {
	let SM: Value = null;
	if (!rt.istype(crosser, T("/mob/living"))) return f.dot;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_cross(this, crosser);
	}
	return f.dot;
}, true);

// spacevine.dm:405
rt.def("/obj/structure/spacevine/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let SM: Value = null;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_hit(this, user);
	}
	yield* this.user_unbuckle_mob(user, user);
	return f.dot;
}, true);

// spacevine.dm:411
rt.def("/obj/structure/spacevine/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	let SM: Value = null;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_hit(this, user);
	}
	yield* this.user_unbuckle_mob(user, user);
	return f.dot;
}, true);

// spacevine.dm:416
rt.def("/obj/structure/spacevine/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.eat(user);
	return f.dot;
}, true);

rt.type(2314, "/datum/spacevine_controller", "/datum", {
	vines: null,
	growth_queue: null,
	spread_multiplier: 5,
	spread_cap: 30,
	vine_mutations_list: null,
	mutativeness: 1,
});

// spacevine.dm:427
rt.def("/datum/spacevine_controller/proc/New", function* New(f: Frame, location: Value, muts: Value, potency: Value, production: Value) {
	this.vines = list();
	this.growth_queue = list();
	yield* this.spawn_spacevine_piece(location, null, muts);
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.vine_mutations_list = list();
	yield* init_subtypes(T("/datum/spacevine_mutation"), this.vine_mutations_list);
	if (potency !== null) {
		this.mutativeness = potency / 10;
	}
	if (production === null) return f.dot;
	this.spread_cap *= production / 5;
	this.spread_multiplier /= production / 5;
	return f.dot;
}, true);

// spacevine.dm:440
rt.def("/datum/spacevine_controller/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	rt.setAt((f.dot += "---"), "Delete Vines", fmt("?_src_=＃;purge_vines=1", [this]));
	return f.dot;
});

// spacevine.dm:445
rt.def("/datum/spacevine_controller/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if ((yield* parent_proc()) || !check_rights(2, 0)) {
		return f.dot;
	}
	if (!rt.at(href_list, "purge_vines")) return f.dot;
	if ((yield* alert(f.usr, "Are you sure you want to delete this spacevine cluster?", "Delete Vines", "Yes", "No")) != "Yes") {
		return f.dot;
	}
	yield* this.DeleteVines();
	return f.dot;
}, true);

// spacevine.dm:454
rt.def("/datum/spacevine_controller/proc/DeleteVines", function* DeleteVines(f: Frame) {
	let I: Value = null;
	if (!this.vines) return f.dot;
	for (I of each(this.vines)) {
		yield* qdel(I);
	}
	this.vines.Cut();
	return f.dot;
}, true);

// spacevine.dm:457
rt.def("/datum/spacevine_controller/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// spacevine.dm:461
rt.def("/datum/spacevine_controller/proc/spawn_spacevine_piece", function* spawn_spacevine_piece(f: Frame, location: Value, parent: Value, muts: Value) {
	let SV: Value = null, M: Value = null, parentcolor: Value = null, randmut: Value = null, SM: Value = null;
	this.growth_queue += (SV = (yield* new_(T("/obj/structure/spacevine"), location)));
	this.vines += SV;
	SV.master = this;
	if (muts && rt.len(f, muts)) {
		for (M of each(muts, T("/datum/spacevine_mutation"))) {
			M.add_mutation_to_vinepiece(SV);
		}
		return f.dot;
	}
	if (parent) {
		(rt.modField(f, SV, "mutations", parent.mutations, rt.bitOr));
		parentcolor = rt.index(parent.atom_colours, FIXED_COLOUR_PRIORITY);
		SV.add_atom_colour(parentcolor, FIXED_COLOUR_PRIORITY);
		if (prob(this.mutativeness)) {
			(randmut = pick(this.vine_mutations_list - SV.mutations)).add_mutation_to_vinepiece(SV);
		}
	}
	for (SM of each(SV.mutations, T("/datum/spacevine_mutation"))) {
		SM.on_birth(SV);
	}
	yield* location.Entered(SV);
	return f.dot;
}, true);

// spacevine.dm:482
rt.def("/datum/spacevine_controller/proc/VineDestroyed", function* VineDestroyed(f: Frame, S: Value) {
	let KZ: Value = null;
	S.master = null;
	this.vines -= S;
	this.growth_queue -= S;
	if (rt.len(f, this.vines)) return f.dot;
	(rt.modField(f, (KZ = (yield* new_(T("/obj/item/seeds/kudzu"), S.loc))), "mutations", S.mutations, rt.bitOr));
	KZ.set_potency(this.mutativeness * 10);
	KZ.set_production(this.spread_cap / rt.initial(f, this, "spread_cap") * 5);
	yield* qdel(this);
	return f.dot;
}, true);

// spacevine.dm:493
rt.def("/datum/spacevine_controller/proc/process", function* process(f: Frame) {
	let SV: Value = null, SM: Value = null;
	if (!rt.length(this.vines)) {
		yield* qdel(this);
		return f.dot;
	}
	if (!this.growth_queue) {
		yield* qdel(this);
		return f.dot;
	}
	let length: Value = min(this.spread_cap, max(1, rt.len(f, this.vines) / this.spread_multiplier));
	let i: Value = 0;
	let queue_end: Value = list();
	for (SV of each(this.growth_queue, T("/obj/structure/spacevine"))) {
		if (!SV || SV.gc_destroyed) {
			continue;
		}
		i++;
		queue_end += SV;
		this.growth_queue -= SV;
		SM = null;
		for (SM of each(SV.mutations, T("/datum/spacevine_mutation"))) {
			yield* SM.process_mutation(SV);
		}
		if (SV.energy < 2) {
			if (prob(20)) {
				yield* SV.grow();
			}
		} else {
			yield* SV.entangle_mob();
		}
		yield* SV.spread();
		if (i >= length) {
			break;
		}
	}
	this.growth_queue = this.growth_queue + queue_end;
	return f.dot;
}, true, { waitfor: false });

// spacevine.dm:528
rt.def("/obj/structure/spacevine/proc/grow", function* grow(f: Frame) {
	let SM: Value = null;
	if (!this.energy) {
		this.icon_state = pick("Med1", "Med2", "Med3");
		this.energy = 1;
		this.set_opacity(1);
	} else {
		this.icon_state = pick("Hvy1", "Hvy2", "Hvy3");
		this.energy = 2;
	}
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_grow(this);
	}
	return f.dot;
}, true);

// spacevine.dm:540
rt.def("/obj/structure/spacevine/proc/entangle_mob", function* entangle_mob(f: Frame) {
	let V: Value = null;
	if (!(!this.has_buckled_mobs() && prob(25))) return f.dot;
	for (V of each(this.loc, T("/mob/living"))) {
		yield* this.entangle(V);
		if (this.has_buckled_mobs()) {
			break;
		}
	}
	return f.dot;
}, true);

// spacevine.dm:548
rt.def("/obj/structure/spacevine/proc/entangle", function* entangle(f: Frame, V: Value) {
	let SM: Value = null;
	if (!V || isvineimmune(V)) {
		return f.dot;
	}
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		SM.on_buckle(this, V);
	}
	if (!(V.stat != 2 && V.buckled != this)) return f.dot;
	to_chat(V, `<span class='danger'>The vines ${pick("wind", "tangle", "tighten")} around you!</span>`);
	yield* this.buckle_mob(V, 1);
	return f.dot;
}, true);

// spacevine.dm:557
rt.def("/obj/structure/spacevine/proc/spread", function* spread(f: Frame) {
	let SM: Value = null;
	let direction: Value = pick(GLOB.cardinal);
	let stepturf: Value = rt.getStep(f, this, direction);
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		yield* SM.on_spread(this, stepturf);
		stepturf = rt.getStep(f, this, direction);
	}
	if (rt.locateIn(f, T("/obj/structure/spacevine"), stepturf)) return f.dot;
	if (!(yield* stepturf.Enter(this))) return f.dot;
	if (!this.master) return f.dot;
	yield* this.master.spawn_spacevine_piece(stepturf, this);
	return f.dot;
}, true);

// spacevine.dm:568
rt.def("/obj/structure/spacevine/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let i: Value = null, SM: Value = null;
	if (rt.op(f, "IsType", [], [target, this.type])) {
		return f.dot;
	}
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		i += (yield* SM.on_explosion(severity, target, this));
	}
	if (!(!i && prob(100 / severity))) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// spacevine.dm:578
rt.def("/obj/structure/spacevine/proc/temperature_expose", function* temperature_expose(f: Frame, _null: Value, temp: Value, volume: Value) {
	let SM: Value = null;
	let override: Value = 0;
	for (SM of each(this.mutations, T("/datum/spacevine_mutation"))) {
		override += SM.process_temperature(this, temp, volume);
	}
	if (override) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// spacevine.dm:584
rt.def("/obj/structure/spacevine/proc/CanPass", function CanPass(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (isvineimmune(f.args[0])) {
		f.dot = 1;
	} else {
		f.dot = parent_proc();
	}
	return f.dot;
}, false, { args: ["mover", "target", "height"] });

// spacevine.dm:591
rt.def("/proc/isvineimmune", function isvineimmune(f: Frame, A: Value) {
	f.dot = 0;
	if (!rt.istype(A, T("/mob/living"))) return f.dot;
	let M: Value = A;
	if (!(rt.isIn(f, "vines", M.faction) || rt.isIn(f, "plants", M.faction))) return f.dot;
	f.dot = 1;
	return f.dot;
});
