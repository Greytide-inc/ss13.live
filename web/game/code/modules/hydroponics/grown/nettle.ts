// Based on /tg/station's code/modules/hydroponics/grown/nettle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10061, "/obj/item/seeds/nettle", "/obj/item/seeds", {
	species: "nettle",
	plantname: "Nettles",
	product: rt.typePath("/obj/item/weapon/grown/nettle/basic"),
	lifespan: 30,
	endurance: 40,
	yield: 4,
	growthstages: 5,
	genes: null,
	reagents_add: null,
	name: "pack of nettle seeds",
	desc: "These seeds grow into nettles.",
	icon_state: "seed-nettle",
	mutatelist: null,
});

// nettle.dm:12
rt.def("/obj/item/seeds/nettle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy"));
	this.reagents_add = rt.alist(f, ["sacid", 0.5]);

	this.mutatelist = list(T("/obj/item/seeds/nettle/death"));
	return f.dot;
});

rt.type(10062, "/obj/item/seeds/nettle/death", "/obj/item/seeds/nettle", {
	species: "deathnettle",
	plantname: "Death Nettles",
	product: rt.typePath("/obj/item/weapon/grown/nettle/death"),
	endurance: 25,
	maturation: 8,
	yield: 2,
	genes: null,
	mutatelist: null,
	reagents_add: null,
	rarity: 20,
	name: "pack of death-nettle seeds",
	desc: "These seeds grow into death-nettles.",
	icon_state: "seed-deathnettle",
});

// nettle.dm:26
rt.def("/obj/item/seeds/nettle/death/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.genes = list(T("/datum/plant_gene/trait/repeated_harvest"), T("/datum/plant_gene/trait/plant_type/weed_hardy"), T("/datum/plant_gene/trait/stinging"));

	this.mutatelist = list();
	this.reagents_add = rt.alist(f, ["facid", 0.5, "sacid", 0.5]);
	return f.dot;
});

rt.type(7501, "/obj/item/weapon/grown/nettle", "/obj/item/weapon/grown", {
	throw_speed: 1,
	throw_range: 3,
	name: "nettle",
	desc: "It's probably <B>not</B> wise to touch it with bare hands...",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "nettle",
	damtype: "fire",
	force: 15,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	throwforce: 5,
	w_class: 1,
	origin_tech: "combat=3",
	attack_verb: null,
});

// nettle.dm:44
rt.def("/obj/item/weapon/grown/nettle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("stung");
	return f.dot;
});

// nettle.dm:47
rt.def("/obj/item/weapon/grown/nettle/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is eating some of ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 5;
});

// nettle.dm:51
rt.def("/obj/item/weapon/grown/nettle/proc/pickup", function* pickup(f: Frame, user: Value) {
	let C: Value = null, H: Value = null, affecting: Value = null;
	yield* parent_proc();
	if (!rt.istype(user, T("/mob/living/carbon"))) {
		return 0;
	}
	if ((C = user).gloves) {
		return 0;
	}
	if (rt.istype(C, T("/mob/living/carbon/human"))) {
		if ((H = C).dna && H.dna.species) {
			if (rt.isIn(f, PIERCEIMMUNE, H.dna.species.species_traits)) {
				return 0;
			}
		}
	}
	let hit_zone: Value = (C.held_index_to_dir(C.active_hand_index) == "l" ? "l_" : "r_") + "arm";
	if (affecting = C.get_bodypart(hit_zone)) {
		if (yield* affecting.receive_damage(0, this.force)) {
			C.update_damage_overlays();
		}
	}
	to_chat(C, "<span class='userdanger'>The nettle burns your bare hand!</span>");
	return 1;
}, true);

// nettle.dm:71
rt.def("/obj/item/weapon/grown/nettle/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!proximity) {
		return f.dot;
	}
	if (this.force > 0) {
		this.force -= rand(1, this.force / 3 + 1);
	} else {
		to_chat(f.usr, "All the leaves have fallen off the nettle from violent whacking.");
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(7502, "/obj/item/weapon/grown/nettle/basic", "/obj/item/weapon/grown/nettle", {
	seed: rt.typePath("/obj/item/seeds/nettle"),
});

// nettle.dm:82
rt.def("/obj/item/weapon/grown/nettle/basic/proc/add_juice", function add_juice(f: Frame) {
	parent_proc();
	this.force = round(5 + this.seed.potency / 5, 1);
	return f.dot;
});

rt.type(7503, "/obj/item/weapon/grown/nettle/death", "/obj/item/weapon/grown/nettle", {
	seed: rt.typePath("/obj/item/seeds/nettle/death"),
	name: "deathnettle",
	desc: "The <span class='danger'>glowing</span> nettle incites <span class='boldannounce'>rage</span> in you just from looking at it!",
	icon_state: "deathnettle",
	force: 30,
	throwforce: 15,
	origin_tech: "combat=5",
});

// nettle.dm:95
rt.def("/obj/item/weapon/grown/nettle/death/proc/add_juice", function add_juice(f: Frame) {
	parent_proc();
	this.force = round(5 + this.seed.potency / 2.5, 1);
	return f.dot;
});

// nettle.dm:99
rt.def("/obj/item/weapon/grown/nettle/death/proc/pickup", function* pickup(f: Frame, user: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (!prob(50)) return f.dot;
	yield* user.Knockdown(100);
	to_chat(user, "<span class='userdanger'>You are stunned by the Deathnettle as you try picking it up!</span>");
	return f.dot;
}, true);

// nettle.dm:105
rt.def("/obj/item/weapon/grown/nettle/death/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living"))) return f.dot;
	to_chat(M, "<span class='danger'>You are stunned by the powerful acid of the Deathnettle!</span>");
	add_logs(user, M, "attacked", this);
	yield* M.adjust_blurriness(this.force / 7);
	if (prob(20)) {
		yield* M.Unconscious(this.force / 0.3);
		yield* M.Knockdown(this.force / 0.75);
	}
	yield* M.drop_item();
	return f.dot;
}, true);
