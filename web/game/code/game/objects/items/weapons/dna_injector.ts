// Based on /tg/station's code/game/objects/items/weapons/dna_injector.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(7175, "/obj/item/weapon/dnainjector", "/obj/item/weapon", {
	damage_coeff: 1,
	fields: null,
	add_mutations: null,
	remove_mutations: null,
	add_mutations_static: null,
	remove_mutations_static: null,
	used: 0,
	throw_speed: 3,
	throw_range: 5,
	name: "１DNA injector",
	desc: "This injects the person with DNA.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "dnainjector",
	w_class: 1,
	origin_tech: "biotech=1",
});

// dna_injector.dm:13
rt.def("/obj/item/weapon/dnainjector/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations = list();

	this.remove_mutations = list();

	this.add_mutations_static = list();

	this.remove_mutations_static = list();
	return f.dot;
});

// dna_injector.dm:22
rt.def("/obj/item/weapon/dnainjector/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// dna_injector.dm:25
rt.def("/obj/item/weapon/dnainjector/proc/prepare", function prepare(f: Frame) {
	let mut_key: Value = null;
	for (mut_key of each(this.add_mutations_static)) {
		this.add_mutations.Add(rt.index(GLOB.mutations_list, mut_key));
	}
	mut_key = null;
	for (mut_key of each(this.remove_mutations_static)) {
		this.remove_mutations.Add(rt.index(GLOB.mutations_list, mut_key));
	}
	return f.dot;
});

// dna_injector.dm:31
rt.def("/obj/item/weapon/dnainjector/proc/inject", function* inject(f: Frame, M: Value, user: Value) {
	let log_msg: Value = null, HM: Value = null;
	yield* this.prepare();
	if (M.has_dna() && !rt.isIn(f, RADIMMUNE, M.dna.species.species_traits) && !rt.bitAnd(M.disabilities, 128)) {
		M.radiation += rand(20 / this.damage_coeff ** 2, 50 / this.damage_coeff ** 2);
		log_msg = `${key_name(user)} injected ${key_name(M)} with the ${this.name}`;
		for (HM of each(this.remove_mutations, T("/datum/mutation/human"))) {
			yield* HM.force_lose(M);
		}
		HM = null;
		for (HM of each(this.add_mutations, T("/datum/mutation/human"))) {
			if (HM.name == "Monkified") {
				message_admins(`${key_name_admin(user)} injected ${key_name_admin(M)} with the ${this.name} <span class='danger'>(MONKEY)</span>`);
				log_msg += " (MONKEY)";
			}
			yield* HM.force_give(M);
		}
		if (this.fields) {
			if (rt.at(this.fields, "name") && rt.at(this.fields, "UE") && rt.at(this.fields, "blood_type")) {
				M.real_name = rt.at(this.fields, "name");
				M.dna.unique_enzymes = rt.at(this.fields, "UE");
				M.name = M.real_name;
				M.dna.blood_type = rt.at(this.fields, "blood_type");
			}
			if (rt.at(this.fields, "UI")) {
				M.dna.uni_identity = merge_text(M.dna.uni_identity, rt.at(this.fields, "UI"));
				yield* M.updateappearance({ mutations_overlay_update: 1 });
			}
		}
		log_attack(log_msg);
		return 1;
	}
	return 0;
}, true);

// dna_injector.dm:57
rt.def("/obj/item/weapon/dnainjector/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let humantarget: Value = null;
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (this.used) {
		to_chat(user, "<span class='warning'>This injector is used up!</span>");
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		if (!(yield* (humantarget = target).can_inject(user, 1))) {
			return f.dot;
		}
	}
	add_logs(user, target, "attempted to inject", this);
	if (target != user) {
		target.visible_message(`<span class='danger'>${user} is trying to inject ${target} with ${this}!</span>`, `<span class='userdanger'>${user} is trying to inject ${target} with ${this}!</span>`);
		if (!(yield* do_mob(user, target)) || this.used) {
			return f.dot;
		}
		target.visible_message(`<span class='danger'>${user} injects ${target} with the syringe with ${this}!`, `<span class='userdanger'>${user} injects ${target} with the syringe with ${this}!`);
	} else {
		to_chat(user, `<span class='notice'>You inject yourself with ${this}.</span>`);
	}
	add_logs(user, target, "injected", this);
	if (!(yield* this.inject(target, user))) {
		to_chat(user, `<span class='notice'>It appears that ${target} does not have compatible DNA.</span>`);
	}
	this.used = 1;
	this.icon_state = "dnainjector0";
	this.desc += " This one is used up.";
	return f.dot;
}, true);

rt.type(7176, "/obj/item/weapon/dnainjector/antihulk", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Hulk)",
	desc: "Cures green skin.",
});

// dna_injector.dm:92
rt.def("/obj/item/weapon/dnainjector/antihulk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Hulk");
	return f.dot;
});

rt.type(7177, "/obj/item/weapon/dnainjector/hulkmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Hulk)",
	desc: "This will make you big and strong, but give you a bad skin condition.",
});

// dna_injector.dm:97
rt.def("/obj/item/weapon/dnainjector/hulkmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Hulk");
	return f.dot;
});

rt.type(7178, "/obj/item/weapon/dnainjector/xraymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Xray)",
	desc: "Finally you can see what the Captain does.",
});

// dna_injector.dm:102
rt.def("/obj/item/weapon/dnainjector/xraymut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("X Ray Vision");
	return f.dot;
});

rt.type(7179, "/obj/item/weapon/dnainjector/antixray", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Xray)",
	desc: "It will make you see harder.",
});

// dna_injector.dm:107
rt.def("/obj/item/weapon/dnainjector/antixray/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("X Ray Vision");
	return f.dot;
});

rt.type(7180, "/obj/item/weapon/dnainjector/antiglasses", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Glasses)",
	desc: "Toss away those glasses!",
});

// dna_injector.dm:113
rt.def("/obj/item/weapon/dnainjector/antiglasses/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Near Sightness");
	return f.dot;
});

rt.type(7181, "/obj/item/weapon/dnainjector/glassesmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Glasses)",
	desc: "Will make you need dorkish glasses.",
});

// dna_injector.dm:118
rt.def("/obj/item/weapon/dnainjector/glassesmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Near Sightness");
	return f.dot;
});

rt.type(7182, "/obj/item/weapon/dnainjector/epimut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Epi.)",
	desc: "Shake shake shake the room!",
});

// dna_injector.dm:123
rt.def("/obj/item/weapon/dnainjector/epimut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Epilepsy");
	return f.dot;
});

rt.type(7183, "/obj/item/weapon/dnainjector/antiepi", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Epi.)",
	desc: "Will fix you up from shaking the room.",
});

// dna_injector.dm:128
rt.def("/obj/item/weapon/dnainjector/antiepi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Epilepsy");
	return f.dot;
});

rt.type(7184, "/obj/item/weapon/dnainjector/anticough", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Cough)",
	desc: "Will stop that aweful noise.",
});

// dna_injector.dm:133
rt.def("/obj/item/weapon/dnainjector/anticough/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Cough");
	return f.dot;
});

rt.type(7185, "/obj/item/weapon/dnainjector/coughmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Cough)",
	desc: "Will bring forth a sound of horror from your throat.",
});

// dna_injector.dm:138
rt.def("/obj/item/weapon/dnainjector/coughmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Cough");
	return f.dot;
});

rt.type(7186, "/obj/item/weapon/dnainjector/antidwarf", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Dwarfism)",
	desc: "Helps you grow big and strong.",
});

// dna_injector.dm:143
rt.def("/obj/item/weapon/dnainjector/antidwarf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Dwarfism");
	return f.dot;
});

rt.type(7187, "/obj/item/weapon/dnainjector/dwarf", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Dwarfism)",
	desc: "It's a small world after all.",
});

// dna_injector.dm:148
rt.def("/obj/item/weapon/dnainjector/dwarf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Dwarfism");
	return f.dot;
});

rt.type(7188, "/obj/item/weapon/dnainjector/clumsymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Clumsy)",
	desc: "Makes clown minions.",
});

// dna_injector.dm:153
rt.def("/obj/item/weapon/dnainjector/clumsymut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Clumsiness");
	return f.dot;
});

rt.type(7189, "/obj/item/weapon/dnainjector/anticlumsy", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Clumsy)",
	desc: "Apply this for Security Clown.",
});

// dna_injector.dm:158
rt.def("/obj/item/weapon/dnainjector/anticlumsy/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Clumsiness");
	return f.dot;
});

rt.type(7190, "/obj/item/weapon/dnainjector/antitour", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Tour.)",
	desc: "Will cure tourrets.",
});

// dna_injector.dm:163
rt.def("/obj/item/weapon/dnainjector/antitour/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Tourettes Syndrome");
	return f.dot;
});

rt.type(7191, "/obj/item/weapon/dnainjector/tourmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Tour.)",
	desc: "Gives you a nasty case of Tourette's.",
});

// dna_injector.dm:168
rt.def("/obj/item/weapon/dnainjector/tourmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Tourettes Syndrome");
	return f.dot;
});

rt.type(7192, "/obj/item/weapon/dnainjector/stuttmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Stutt.)",
	desc: "Makes you s-s-stuttterrr",
});

// dna_injector.dm:173
rt.def("/obj/item/weapon/dnainjector/stuttmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Nervousness");
	return f.dot;
});

rt.type(7193, "/obj/item/weapon/dnainjector/antistutt", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Stutt.)",
	desc: "Fixes that speaking impairment.",
});

// dna_injector.dm:178
rt.def("/obj/item/weapon/dnainjector/antistutt/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Nervousness");
	return f.dot;
});

rt.type(7194, "/obj/item/weapon/dnainjector/antifire", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Fire)",
	desc: "Cures fire.",
});

// dna_injector.dm:183
rt.def("/obj/item/weapon/dnainjector/antifire/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Cold Resistance");
	return f.dot;
});

rt.type(7195, "/obj/item/weapon/dnainjector/firemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Fire)",
	desc: "Gives you fire.",
});

// dna_injector.dm:188
rt.def("/obj/item/weapon/dnainjector/firemut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Cold Resistance");
	return f.dot;
});

rt.type(7196, "/obj/item/weapon/dnainjector/blindmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Blind)",
	desc: "Makes you not see anything.",
});

// dna_injector.dm:193
rt.def("/obj/item/weapon/dnainjector/blindmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Blindness");
	return f.dot;
});

rt.type(7197, "/obj/item/weapon/dnainjector/antiblind", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Blind)",
	desc: "IT'S A MIRACLE!!!",
});

// dna_injector.dm:198
rt.def("/obj/item/weapon/dnainjector/antiblind/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Blindness");
	return f.dot;
});

rt.type(7198, "/obj/item/weapon/dnainjector/antitele", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Tele.)",
	desc: "Will make you not able to control your mind.",
});

// dna_injector.dm:203
rt.def("/obj/item/weapon/dnainjector/antitele/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Telekinesis");
	return f.dot;
});

rt.type(7199, "/obj/item/weapon/dnainjector/telemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Tele.)",
	desc: "Super brain man!",
});

// dna_injector.dm:208
rt.def("/obj/item/weapon/dnainjector/telemut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Telekinesis");
	return f.dot;
});

rt.type(7201, "/obj/item/weapon/dnainjector/deafmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Deaf)",
	desc: "Sorry, what did you say?",
});

// dna_injector.dm:217
rt.def("/obj/item/weapon/dnainjector/deafmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Deafness");
	return f.dot;
});

rt.type(7202, "/obj/item/weapon/dnainjector/antideaf", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Deaf)",
	desc: "Will make you hear once more.",
});

// dna_injector.dm:222
rt.def("/obj/item/weapon/dnainjector/antideaf/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Deafness");
	return f.dot;
});

rt.type(7203, "/obj/item/weapon/dnainjector/h2m", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Human > Monkey)",
	desc: "Will make you a flea bag.",
});

// dna_injector.dm:227
rt.def("/obj/item/weapon/dnainjector/h2m/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Monkified");
	return f.dot;
});

rt.type(7204, "/obj/item/weapon/dnainjector/m2h", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Monkey > Human)",
	desc: "Will make you...less hairy.",
});

// dna_injector.dm:232
rt.def("/obj/item/weapon/dnainjector/m2h/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Monkified");
	return f.dot;
});

rt.type(7205, "/obj/item/weapon/dnainjector/antichameleon", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Chameleon)",
});

// dna_injector.dm:236
rt.def("/obj/item/weapon/dnainjector/antichameleon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Chameleon");
	return f.dot;
});

rt.type(7206, "/obj/item/weapon/dnainjector/chameleonmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Chameleon)",
});

// dna_injector.dm:240
rt.def("/obj/item/weapon/dnainjector/chameleonmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Chameleon");
	return f.dot;
});

rt.type(7207, "/obj/item/weapon/dnainjector/antiwacky", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Wacky)",
});

// dna_injector.dm:244
rt.def("/obj/item/weapon/dnainjector/antiwacky/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Wacky");
	return f.dot;
});

rt.type(7208, "/obj/item/weapon/dnainjector/wackymut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Wacky)",
});

// dna_injector.dm:248
rt.def("/obj/item/weapon/dnainjector/wackymut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Wacky");
	return f.dot;
});

rt.type(7209, "/obj/item/weapon/dnainjector/antimute", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Mute)",
});

// dna_injector.dm:252
rt.def("/obj/item/weapon/dnainjector/antimute/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Mute");
	return f.dot;
});

rt.type(7210, "/obj/item/weapon/dnainjector/mutemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Mute)",
});

// dna_injector.dm:256
rt.def("/obj/item/weapon/dnainjector/mutemut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Mute");
	return f.dot;
});

rt.type(7211, "/obj/item/weapon/dnainjector/antismile", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Smile)",
});

// dna_injector.dm:260
rt.def("/obj/item/weapon/dnainjector/antismile/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Smile");
	return f.dot;
});

rt.type(7212, "/obj/item/weapon/dnainjector/smilemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Smile)",
});

// dna_injector.dm:264
rt.def("/obj/item/weapon/dnainjector/smilemut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Smile");
	return f.dot;
});

rt.type(7213, "/obj/item/weapon/dnainjector/unintelligablemut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Unintelligable)",
});

// dna_injector.dm:268
rt.def("/obj/item/weapon/dnainjector/unintelligablemut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Unintelligable");
	return f.dot;
});

rt.type(7214, "/obj/item/weapon/dnainjector/antiunintelligable", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Unintelligable)",
});

// dna_injector.dm:272
rt.def("/obj/item/weapon/dnainjector/antiunintelligable/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Unintelligable");
	return f.dot;
});

rt.type(7215, "/obj/item/weapon/dnainjector/swedishmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Swedish)",
});

// dna_injector.dm:276
rt.def("/obj/item/weapon/dnainjector/swedishmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Swedish");
	return f.dot;
});

rt.type(7216, "/obj/item/weapon/dnainjector/antiswedish", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Swedish)",
});

// dna_injector.dm:280
rt.def("/obj/item/weapon/dnainjector/antiswedish/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Swedish");
	return f.dot;
});

rt.type(7217, "/obj/item/weapon/dnainjector/chavmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Chav)",
});

// dna_injector.dm:284
rt.def("/obj/item/weapon/dnainjector/chavmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Chav");
	return f.dot;
});

rt.type(7218, "/obj/item/weapon/dnainjector/antichav", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Chav)",
});

// dna_injector.dm:288
rt.def("/obj/item/weapon/dnainjector/antichav/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Chav");
	return f.dot;
});

rt.type(7219, "/obj/item/weapon/dnainjector/elvismut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Elvis)",
});

// dna_injector.dm:292
rt.def("/obj/item/weapon/dnainjector/elvismut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Elvis");
	return f.dot;
});

rt.type(7220, "/obj/item/weapon/dnainjector/antielvis", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Elvis)",
});

// dna_injector.dm:296
rt.def("/obj/item/weapon/dnainjector/antielvis/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Elvis");
	return f.dot;
});

rt.type(7221, "/obj/item/weapon/dnainjector/lasereyesmut", "/obj/item/weapon/dnainjector", {
	add_mutations_static: null,
	name: "１DNA injector (Laser Eyes)",
});

// dna_injector.dm:300
rt.def("/obj/item/weapon/dnainjector/lasereyesmut/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Laser Eyes");
	return f.dot;
});

rt.type(7222, "/obj/item/weapon/dnainjector/antilasereyes", "/obj/item/weapon/dnainjector", {
	remove_mutations_static: null,
	name: "１DNA injector (Anti-Laser Eyes)",
});

// dna_injector.dm:304
rt.def("/obj/item/weapon/dnainjector/antilasereyes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.remove_mutations_static = list("Laser Eyes");
	return f.dot;
});

rt.type(7223, "/obj/item/weapon/dnainjector/timed", "/obj/item/weapon/dnainjector", {
	duration: 600,
});

// dna_injector.dm:310
rt.def("/obj/item/weapon/dnainjector/timed/proc/inject", function* inject(f: Frame, M: Value, user: Value) {
	let log_msg: Value = null, endtime: Value = null, HM: Value = null;
	yield* this.prepare();
	if (M.stat == 2) {
		to_chat(user, `<span class='notice'>You can't modify ${M}'s DNA while ${M.p_theyre()} dead.</span>`);
		return 0;
	}
	if (M.has_dna() && !rt.bitAnd(M.disabilities, 128)) {
		M.radiation += rand(20 / this.damage_coeff ** 2, 50 / this.damage_coeff ** 2);
		log_msg = `${key_name(user)} injected ${key_name(M)} with the ${this.name}`;
		endtime = rt.worldTime(f) + this.duration;
		for (HM of each(this.remove_mutations, T("/datum/mutation/human"))) {
			if (HM.name == "Monkified") {
				if (rt.istype(M, T("/mob/living/carbon/human"))) {
					continue;
				}
				M = (yield* HM.force_lose(M));
			} else {
				yield* HM.force_lose(M);
			}
		}
		HM = null;
		for (HM of each(this.add_mutations, T("/datum/mutation/human"))) {
			if (rt.isIn(f, HM, M.dna.mutations) && !rt.index(M.dna.temporary_mutations, HM.name)) {
				continue;
			}
			if (HM.name == "Monkified" && rt.istype(M, T("/mob/living/carbon/human"))) {
				message_admins(`${key_name_admin(user)} injected ${key_name_admin(M)} with the ${this.name} <span class='danger'>(MONKEY)</span>`);
				log_msg += " (MONKEY)";
				M = (yield* HM.force_give(M));
			} else {
				yield* HM.force_give(M);
			}
			rt.setAt(M.dna.temporary_mutations, HM.name, endtime);
		}
		if (this.fields) {
			if (rt.at(this.fields, "name") && rt.at(this.fields, "UE") && rt.at(this.fields, "blood_type")) {
				if (!rt.index(M.dna.previous, "name")) {
					rt.setAt(M.dna.previous, "name", M.real_name);
				}
				if (!rt.index(M.dna.previous, "UE")) {
					rt.setAt(M.dna.previous, "UE", M.dna.unique_enzymes);
				}
				if (!rt.index(M.dna.previous, "blood_type")) {
					rt.setAt(M.dna.previous, "blood_type", M.dna.blood_type);
				}
				M.real_name = rt.at(this.fields, "name");
				M.dna.unique_enzymes = rt.at(this.fields, "UE");
				M.name = M.real_name;
				M.dna.blood_type = rt.at(this.fields, "blood_type");
				rt.setAt(M.dna.temporary_mutations, "ue changed", endtime);
			}
			if (rt.at(this.fields, "UI")) {
				if (!rt.index(M.dna.previous, "UI")) {
					rt.setAt(M.dna.previous, "UI", M.dna.uni_identity);
				}
				M.dna.uni_identity = merge_text(M.dna.uni_identity, rt.at(this.fields, "UI"));
				yield* M.updateappearance({ mutations_overlay_update: 1 });
				rt.setAt(M.dna.temporary_mutations, "ui changed", endtime);
			}
		}
		log_attack(log_msg);
		return 1;
	} else {
		return 0;
	}
}, true);

rt.type(7224, "/obj/item/weapon/dnainjector/timed/hulk", "/obj/item/weapon/dnainjector/timed", {
	add_mutations_static: null,
	name: "１DNA injector (Hulk)",
	desc: "This will make you big and strong, but give you a bad skin condition.",
});

// dna_injector.dm:363
rt.def("/obj/item/weapon/dnainjector/timed/hulk/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Hulk");
	return f.dot;
});

rt.type(7225, "/obj/item/weapon/dnainjector/timed/h2m", "/obj/item/weapon/dnainjector/timed", {
	add_mutations_static: null,
	name: "１DNA injector (Human > Monkey)",
	desc: "Will make you a flea bag.",
});

// dna_injector.dm:368
rt.def("/obj/item/weapon/dnainjector/timed/h2m/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.add_mutations_static = list("Monkified");
	return f.dot;
});
