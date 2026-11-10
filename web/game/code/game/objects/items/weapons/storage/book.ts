// Based on /tg/station's code/game/objects/items/weapons/storage/book.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5544, "/obj/item/weapon/storage/book", "/obj/item/weapon/storage", {
	title: "book",
	throw_speed: 2,
	throw_range: 5,
	name: "hollowed book",
	desc: "I guess someone didn't like it.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book",
	storage_slots: 1,
	w_class: 3,
	resistance_flags: 4,
});

// book.dm:14
rt.def("/obj/item/weapon/storage/book/proc/attack_self", function attack_self(f: Frame, user: Value) {
	to_chat(user, `<span class='notice'>The pages of ${this.title} have been cut out!</span>`);
	return f.dot;
});

// book.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalbiblenames", function InitGlobalbiblenames(f: Frame) {
	GLOB.biblenames = list("Bible", "Quran", "Scrapbook", "Burning Bible", "Clown Bible", "Banana Bible", "Creeper Bible", "White Bible", "Holy Light", "The God Delusion", "Tome", "The King in Yellow", "Ithaqua", "Scientology", "Melted Bible", "Necronomicon");
	this.gvars_datum_init_order += "biblenames";
	return f.dot;
});

// book.dm:17
rt.def("/datum/controller/global_vars/proc/InitGlobalbiblestates", function InitGlobalbiblestates(f: Frame) {
	GLOB.biblestates = list("bible", "koran", "scrapbook", "burning", "honk1", "honk2", "creeper", "white", "holylight", "atheist", "tome", "kingyellow", "ithaqua", "scientology", "melted", "necronomicon");
	this.gvars_datum_init_order += "biblestates";
	return f.dot;
});

// book.dm:18
rt.def("/datum/controller/global_vars/proc/InitGlobalbibleitemstates", function InitGlobalbibleitemstates(f: Frame) {
	GLOB.bibleitemstates = list("bible", "koran", "scrapbook", "bible", "bible", "bible", "syringe_kit", "syringe_kit", "syringe_kit", "syringe_kit", "syringe_kit", "kingyellow", "ithaqua", "scientology", "melted", "necronomicon");
	this.gvars_datum_init_order += "bibleitemstates";
	return f.dot;
});

rt.type(5545, "/obj/item/weapon/storage/book/bible", "/obj/item/weapon/storage/book", {
	affecting: null,
	deity_name: "Christ",
	name: "bible",
	desc: "Apply to head repeatedly.",
	icon: rt.rsc("icons/obj/storage.dmi"),
	icon_state: "bible",
	item_state: "bible",
	force_string: "holy",
});

// book.dm:31
rt.def("/obj/item/weapon/storage/book/bible/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	user.visible_message(`<span class='suicide'>${user} is offering ${user.p_them()}self to ${this.deity_name}! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	return 1;
});

// book.dm:35
rt.def("/obj/item/weapon/storage/book/bible/proc/attack_self", function attack_self(f: Frame, H: Value) {
	let i: Value = null, bibleicon: Value = null, nicename: Value = null;
	let $e: any;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (!(!GLOB.SSreligion.bible_icon_state && H.job == "Chaplain")) return f.dot;
	let dat: Value = "<html><head><title>Pick Bible Style</title></head><body><center><h2>Pick a bible style</h2></center><table>";
	rt.forRange(f, 0, 1, rt.len(f, GLOB.biblestates), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		bibleicon = icon(rt.rsc("icons/obj/storage.dmi"), rt.index(GLOB.biblestates, i));
		nicename = rt.index(GLOB.biblenames, i);
		rt.op(f, "BrowseResource", [], [H, bibleicon, nicename], false);
		dat += fmt("<tr><td><img src=\"＀\"></td><td><a href=\"?src=＃;seticon=＀\">＀</a></td></tr>", [nicename, this, i, nicename]);
	}
	rt.endFor(f, 0);
	dat += "</table></body></html>";
	rt.op(f, "Browse", [], [H, dat, "window=editicon;can_close=0;can_minimize=0;size=250x650"], false);
	return f.dot;
});

// book.dm:49
rt.def("/obj/item/weapon/storage/book/bible/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let B: Value = null, H: Value = null;
	if (!f.usr.canUseTopic(this)) {
		return f.dot;
	}
	if (!(rt.at(href_list, "seticon") && GLOB.SSreligion && !GLOB.SSreligion.bible_icon_state)) return f.dot;
	let iconi: Value = text2num(rt.at(href_list, "seticon"));
	// The href's icon number must be a real choice (a whole number in range), and the book is this one: tg located any object named by "src".
	if (!(typeof iconi === "number" && Number.isInteger(iconi) && iconi >= 1 && iconi <= rt.len(f, GLOB.biblestates))) return f.dot;
	let biblename: Value = rt.index(GLOB.biblenames, iconi);
	(B = this).icon_state = rt.index(GLOB.biblestates, iconi);
	B.item_state = rt.index(GLOB.bibleitemstates, iconi);
	if (B.icon_state == "honk1" || B.icon_state == "honk2") {
		yield* (H = f.usr).dna.add_mutation("Clumsiness");
		yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/mask/gas/clown_hat"), H)), 2);
	}
	GLOB.SSreligion.bible_icon_state = B.icon_state;
	GLOB.SSreligion.bible_item_state = B.item_state;
	rt.op(f, "Browse", [], [f.usr, null, "window=editicon"], false);
	return f.dot;
}, true);

// book.dm:70
rt.def("/obj/item/weapon/storage/book/bible/proc/bless", function* bless(f: Frame, H: Value, user: Value) {
	let X: Value = null, BP: Value = null, hurt_limbs: Value = null, X_2: Value = null, affecting: Value = null;
	for (X of each(H.bodyparts)) {
		if ((BP = X).status == BODYPART_ROBOTIC) {
			to_chat(user, `<span class='warning'>${this.deity_name} refuses to heal this metallic taint!</span>`);
			return 0;
		}
	}
	let heal_amt: Value = 10;
	if (rt.len(f, (hurt_limbs = H.get_damaged_bodyparts(1, 1)))) {
		for (X_2 of each(hurt_limbs)) {
			if (yield* (affecting = X_2).heal_damage(heal_amt, heal_amt)) {
				H.update_damage_overlays();
			}
		}
		H.visible_message(`<span class='notice'>${user} heals ${H} with the power of ${this.deity_name}!</span>`);
		to_chat(H, `<span class='boldnotice'>May the power of ${this.deity_name} compel you to be healed!</span>`);
		playsound(this.loc, "punch", 25, 1, -1);
	}
	return 1;
}, true);

// book.dm:91
rt.def("/obj/item/weapon/storage/book/bible/proc/attack", function* attack(f: Frame) {
	let C: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (!f.args[1].IsAdvancedToolUser()) {
		to_chat(f.args[1], "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (rt.bitAnd(f.args[1].disabilities, 256) && prob(50)) {
		to_chat(f.args[1], `<span class='danger'>${this} slips out of your hand and hits your head.</span>`);
		yield* f.args[1].take_bodypart_damage(10);
		yield* f.args[1].Unconscious(400);
		return f.dot;
	}
	let chaplain: Value = 0;
	if (f.args[1].mind && f.args[1].mind.isholy) {
		chaplain = 1;
	}
	if (!chaplain) {
		to_chat(f.args[1], "<span class='danger'>The book sizzles in your hands.</span>");
		yield* f.args[1].take_bodypart_damage(0, 10);
		return f.dot;
	}
	if (!f.args[2]) {
		return (yield* parent_proc());
	}
	let smack: Value = 1;
	if (f.args[0].stat != 2) {
		if (chaplain && f.args[1] == f.args[0]) {
			to_chat(f.args[1], "<span class='warning'>You can't heal yourself!</span>");
			return f.dot;
		}
		if (rt.istype(f.args[0], T("/mob/living/carbon/human")) && prob(60) && (yield* this.bless(f.args[0], f.args[1]))) {
			smack = 0;
		} else if (rt.istype(f.args[0], T("/mob/living/carbon"))) {
			if (!rt.istype((C = f.args[0]).head, T("/obj/item/clothing/head/helmet"))) {
				yield* C.adjustBrainLoss(10);
				to_chat(C, "<span class='danger'>You feel dumber.</span>");
			}
		}
		if (smack) {
			f.args[0].visible_message(`<span class='danger'>${f.args[1]} beats ${f.args[0]} over the head with ${this}!</span>`, `<span class='userdanger'>${f.args[1]} beats ${f.args[0]} over the head with ${this}!</span>`);
			playsound(this.loc, "punch", 25, 1, -1);
			add_logs(f.args[1], f.args[0], "attacked", this);
		}
	} else {
		f.args[0].visible_message(`<span class='danger'>${f.args[1]} smacks ${f.args[0]}'s lifeless corpse with ${this}.</span>`);
		playsound(this.loc, "punch", 25, 1, -1);
	}
	return f.dot;
}, true, { args: ["M", "user", "heal_mode"] });

// book.dm:139
rt.def("/obj/item/weapon/storage/book/bible/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let R: Value = null, water2holy: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (rt.istype(A, T("/turf/open/floor"))) {
		to_chat(user, "<span class='notice'>You hit the floor with the bible.</span>");
		if (user.mind && user.mind.isholy) {
			for (R of each(orange(2, user), T("/obj/effect/rune"))) {
				R.invisibility = 0;
			}
		}
	}
	if (!(user.mind && user.mind.isholy)) return f.dot;
	if (A.reagents && A.reagents.has_reagent("water")) {
		to_chat(user, `<span class='notice'>You bless ${A}.</span>`);
		water2holy = A.reagents.get_reagent_amount("water");
		yield* A.reagents.del_reagent("water");
		yield* A.reagents.add_reagent("holywater", water2holy);
	}
	if (!(A.reagents && A.reagents.has_reagent("unholywater"))) return f.dot;
	to_chat(user, `<span class='notice'>You purify ${A}.</span>`);
	let unholy2clean: Value = A.reagents.get_reagent_amount("unholywater");
	yield* A.reagents.del_reagent("unholywater");
	yield* A.reagents.add_reagent("holywater", unholy2clean);
	return f.dot;
}, true);

rt.type(5546, "/obj/item/weapon/storage/book/bible/booze", "/obj/item/weapon/storage/book/bible", {
	desc: "To be applied to the head repeatedly.",
});

// book.dm:162
rt.def("/obj/item/weapon/storage/book/bible/booze/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey"), this);
	return f.dot;
}, true);

rt.type(5547, "/obj/item/weapon/storage/book/bible/syndicate", "/obj/item/weapon/storage/book/bible", {
	uses: 1,
	deity_name: "The Syndicate",
	throw_speed: 2,
	throw_range: 7,
	icon_state: "ebook",
	throwforce: 18,
	force: 18,
	hitsound: rt.rsc("sound/weapons/sear.ogg"),
	damtype: "fire",
	name: "Syndicate Tome",
	attack_verb: null,
});

// book.dm:182
rt.def("/obj/item/weapon/storage/book/bible/syndicate/proc/attack_self", function* attack_self(f: Frame, H: Value) {
	let ownername: Value = null;
	if (!this.uses) return f.dot;
	H.mind.isholy = 1;
	this.uses -= 1;
	to_chat(H, "<span class='userdanger'>You try to open the book AND IT BITES YOU!</span>");
	playsound(this.loc, rt.rsc("sound/effects/snap.ogg"), 50, 1);
	yield* H.apply_damage(5, "brute", pick("l_arm", "r_arm"));
	to_chat(H, "<span class='notice'>Your name appears on the inside cover, in blood.</span>");
	this.desc += `<span class='warning'>The name ${(ownername = H.real_name)} is written in blood inside the cover.</span>`;
	return f.dot;
}, true);

// book.dm:191
rt.def("/obj/item/weapon/storage/book/bible/syndicate/proc/attack", function* attack(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[1].a_intent == "help") {
		return (yield* parent_proc());
	}
	return (yield* parent_proc(f.args[0], f.args[1], { heal_mode: 0 }));
}, true, { args: ["M", "user", "heal_mode"] });
