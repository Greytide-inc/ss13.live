// Based on /tg/station's code/modules/food_and_drinks/drinks/drinks/bottle.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5802, "/obj/item/weapon/reagent_containers/food/drinks/bottle", "/obj/item/weapon/reagent_containers/food/drinks", {
	duration: 13,
	isGlass: 1,
	amount_per_transfer_from_this: 10,
	volume: 100,
	throwforce: 15,
	item_state: "broken_beer",
}, { const: ["duration"] });

// bottle.dm:16
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/throw_impact", function* throw_impact(f: Frame, target: Value, thrower: Value) {
	yield* parent_proc();
	yield* this.smash(target, thrower, 1);
	return f.dot;
}, true, { waitfor: false });

// bottle.dm:22
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/smash", function* smash(f: Frame, target: Value, user: Value, ranged: Value) {
	let I: Value = null;
	ranged ??= 0;
	let new_location: Value = rt.getStep(f, this.loc, 0);
	let B: Value = (yield* new_(T("/obj/item/weapon/broken_bottle"), new_location));
	if (ranged) {
		B.loc = new_location;
	} else {
		yield* user.drop_item();
		yield* user.put_in_active_hand(B);
	}
	B.icon_state = this.icon_state;
	(I = (yield* new_(T("/icon"), rt.rsc("icons/obj/drinks.dmi"), this.icon_state))).Blend(B.broken_outline, 3, rand(5), 1);
	I.SwapColor("#ff00dcff", "#00000000");
	B.icon = I;
	if (this.isGlass) {
		if (prob(33)) {
			yield* new_(T("/obj/item/weapon/shard"), new_location);
		}
		playsound(this, "shatter", 70, 1);
	} else {
		B.name = "broken carton";
		B.force = 0;
		B.throwforce = 0;
		B.desc = "A carton with the bottom half burst open. Might give you a papercut.";
	}
	this.transfer_fingerprints_to(B);
	yield* qdel(this);
	return f.dot;
}, true);

// bottle.dm:51
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	let H: Value = null, headarmor: Value = null;
	if (!target) {
		return f.dot;
	}
	if (user.a_intent != "harm" || !this.isGlass) {
		return (yield* parent_proc());
	}
	this.force = 15;
	let affecting: Value = user.zone_selected;
	let armor_block: Value = 0;
	let armor_duration: Value = 0;
	if (rt.istype(target, T("/mob/living/carbon/human"))) {
		H = target;
		headarmor = 0;
		armor_block = H.run_armor_check(affecting, "melee", "", "", this.armour_penetration);
		if (rt.istype(H.head, T("/obj/item/clothing/head")) && affecting == "head") {
			if (rt.index(H.head.armor, "melee")) {
				headarmor = rt.index(H.head.armor, "melee");
			} else {
				headarmor = 0;
			}
		} else {
			headarmor = 0;
		}
		armor_duration = 13 - headarmor + this.force;
	} else {
		armor_block = target.run_armor_check(affecting, "melee");
		if (affecting == "head") {
			armor_duration = 13 + this.force;
		}
	}
	armor_block = min(90, armor_block);
	yield* target.apply_damage(this.force, "brute", affecting, armor_block);
	let head_attack_message: Value = "";
	if (affecting == "head" && rt.istype(target, T("/mob/living/carbon"))) {
		head_attack_message = " on the head";
		if (armor_duration) {
			yield* target.apply_effect(min(armor_duration, 200), "knockdown");
		}
	}
	if (target != user) {
		target.visible_message(`<span class='danger'>${user} has hit ${target}${head_attack_message} with a bottle of ${this.name}!</span>`, `<span class='userdanger'>${user} has hit ${target}${head_attack_message} with a bottle of ${this.name}!</span>`);
	} else {
		user.visible_message(`<span class='danger'>${target} hits ${target.p_them()}self with a bottle of ${this.name}${head_attack_message}!</span>`, `<span class='userdanger'>${target} hits ${target.p_them()}self with a bottle of ${this.name}${head_attack_message}!</span>`);
	}
	add_logs(user, target, "attacked", this);
	yield* this.SplashReagents(target);
	yield* this.smash(target, user);
	return f.dot;
}, true);

rt.type(7485, "/obj/item/weapon/broken_bottle", "/obj/item/weapon", {
	broken_outline: null,
	throw_speed: 3,
	throw_range: 5,
	name: "Broken Bottle",
	desc: "A bottle with a sharp broken bottom.",
	icon: rt.rsc("icons/obj/drinks.dmi"),
	icon_state: "broken_bottle",
	force: 9,
	throwforce: 5,
	w_class: 1,
	item_state: "beer",
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	sharpness: 1,
});

// bottle.dm:137
rt.def("/obj/item/weapon/broken_bottle/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("stabbed", "slashed", "attacked");

	this.broken_outline = icon(rt.rsc("icons/obj/drinks.dmi"), "broken");
	return f.dot;
});

rt.type(5804, "/obj/item/weapon/reagent_containers/food/drinks/bottle/gin", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Griffeater Gin",
	desc: "A bottle of high quality gin, produced in the New London Space Station.",
	icon_state: "ginbottle",
	list_reagents: null,
});

// bottle.dm:144
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/gin/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["gin", 100]);
	return f.dot;
});

rt.type(5805, "/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Uncle Git's Special Reserve",
	desc: "A premium single-malt whiskey, gently matured inside the tunnels of a nuclear shelter. TUNNEL WHISKEY RULES.",
	icon_state: "whiskeybottle",
	list_reagents: null,
});

// bottle.dm:150
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/whiskey/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["whiskey", 100]);
	return f.dot;
});

rt.type(5806, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Tunguska Triple Distilled",
	desc: "Aah, vodka. Prime choice of drink AND fuel by Russians worldwide.",
	icon_state: "vodkabottle",
	list_reagents: null,
});

// bottle.dm:156
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["vodka", 100]);
	return f.dot;
});

rt.type(5807, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka", "/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka", {
	name: "Badminka Vodka",
	desc: "The label's written in Cyrillic. All you can make out is the name and a word that looks vaguely like 'Vodka'.",
	icon_state: "badminka",
	list_reagents: null,
});

// bottle.dm:162
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vodka/badminka/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["vodka", 100]);
	return f.dot;
});

rt.type(5808, "/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Caccavo Guaranteed Quality Tequila",
	desc: "Made from premium petroleum distillates, pure thalidomide and other fine quality ingredients!",
	icon_state: "tequilabottle",
	list_reagents: null,
});

// bottle.dm:168
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/tequila/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["tequila", 100]);
	return f.dot;
});

rt.type(5809, "/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Bottle of Nothing",
	desc: "A bottle filled with nothing.",
	icon_state: "bottleofnothing",
	list_reagents: null,
});

// bottle.dm:174
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/bottleofnothing/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["nothing", 100]);
	return f.dot;
});

rt.type(5810, "/obj/item/weapon/reagent_containers/food/drinks/bottle/patron", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Wrapp Artiste Patron",
	desc: "Silver laced tequila, served in space night clubs across the galaxy.",
	icon_state: "patronbottle",
	list_reagents: null,
});

// bottle.dm:180
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/patron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["patron", 100]);
	return f.dot;
});

rt.type(5811, "/obj/item/weapon/reagent_containers/food/drinks/bottle/rum", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Captain Pete's Cuban Spiced Rum",
	desc: "This isn't just rum, oh no. It's practically GRIFF in a bottle.",
	icon_state: "rumbottle",
	list_reagents: null,
});

// bottle.dm:186
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/rum/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["rum", 100]);
	return f.dot;
});

rt.type(5812, "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Flask of Holy Water",
	desc: "A flask of the chaplain's holy water.",
	icon_state: "holyflask",
	list_reagents: null,
});

// bottle.dm:192
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["holywater", 100]);
	return f.dot;
});

rt.type(5813, "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell", "/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater", {
	desc: "A flask of holy water...it's been sitting in the Necropolis a while though.",
	list_reagents: null,
});

// bottle.dm:196
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/holywater/hell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["hell_water", 100]);
	return f.dot;
});

rt.type(5814, "/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Goldeneye Vermouth",
	desc: "Sweet, sweet dryness~",
	icon_state: "vermouthbottle",
	list_reagents: null,
});

// bottle.dm:202
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/vermouth/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["vermouth", 100]);
	return f.dot;
});

rt.type(5815, "/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Robert Robust's Coffee Liqueur",
	desc: "A widely known, Mexican coffee-flavoured liqueur. In production since 1936, HONK.",
	icon_state: "kahluabottle",
	list_reagents: null,
});

// bottle.dm:208
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/kahlua/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["kahlua", 100]);
	return f.dot;
});

rt.type(5816, "/obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "College Girl Goldschlager",
	desc: "Because they are the only ones who will drink 100 proof cinnamon schnapps.",
	icon_state: "goldschlagerbottle",
	list_reagents: null,
});

// bottle.dm:214
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/goldschlager/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["goldschlager", 100]);
	return f.dot;
});

rt.type(5817, "/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Chateau De Baton Premium Cognac",
	desc: "A sweet and strongly alchoholic drink, made after numerous distillations and years of maturing. You might as well not scream 'SHITCURITY' this time.",
	icon_state: "cognacbottle",
	list_reagents: null,
});

// bottle.dm:220
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/cognac/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cognac", 100]);
	return f.dot;
});

rt.type(5818, "/obj/item/weapon/reagent_containers/food/drinks/bottle/wine", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Doublebeard Bearded Special Wine",
	desc: "A faint aura of unease and asspainery surrounds the bottle.",
	icon_state: "winebottle",
	list_reagents: null,
});

// bottle.dm:226
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/wine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["wine", 100]);
	return f.dot;
});

rt.type(5819, "/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Extra-Strong Absinthe",
	desc: "An strong alcoholic drink brewed and distributed by",
	icon_state: "absinthebottle",
	list_reagents: null,
});

// bottle.dm:232
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["absinthe", 100]);
	return f.dot;
});

// bottle.dm:235
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.redact();
	return f.dot;
}, true);

// bottle.dm:242
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/absinthe/proc/redact", function redact(f: Frame) {
	let fullname: Value = null, chance: Value = null, word: Value = null;
	let $e: any;
	let shortname: Value = pickweight(rt.alist(f, ["T&T", 1, "A&A", 1, "Generic", 1]));
	if (shortname === "T&T") {
		fullname = "Teal and Tealer";
	} else if (shortname === "A&A") {
		fullname = "Ash and Asher";
	} else if (shortname === "Generic") {
		fullname = "Nanotrasen Cheap Imitations";
	}
	let removals: Value = list("[REDACTED]", "[EXPLETIVE DELETED]", "[EXPUNGED]", "[INFORMATION ABOVE YOUR SECURITY CLEARANCE]", "[MOVE ALONG CITIZEN]", "[NOTHING TO SEE HERE]");
	if (prob((chance = 50))) {
		shortname = pick_n_take(removals);
	}
	let final_fullname: Value = list();
	for (word of each(splittext(fullname, " "))) {
		if (prob(chance)) {
			word = pick_n_take(removals);
		}
		final_fullname += word;
	}
	fullname = jointext(final_fullname, " ");
	this.name = `${shortname} ${this.name}`;
	this.desc = `${this.desc} ${fullname} Inc.`;
	return f.dot;
});

rt.type(5821, "/obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Bottle of lizard wine",
	desc: "An alcoholic beverage from Space China, made by infusing lizard tails in ethanol. Inexplicably popular among command staff.",
	icon_state: "lizardwine",
	list_reagents: null,
});

// bottle.dm:285
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/lizardwine/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["lizardwine", 100]);
	return f.dot;
});

rt.type(5822, "/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Jian Hard Cider",
	desc: "Apple juice for adults.",
	icon_state: "hcider",
	volume: 50,
	list_reagents: null,
});

// bottle.dm:292
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/hcider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["hcider", 50]);
	return f.dot;
});

rt.type(5823, "/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	name: "Phillipes well-aged Grappa",
	desc: "Bottle of Grappa.",
	icon_state: "grappabottle",
	list_reagents: null,
});

// bottle.dm:298
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/grappa/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["grappa", 100]);
	return f.dot;
});

rt.type(5824, "/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Orange Juice",
	desc: "Full of vitamins and deliciousness!",
	icon_state: "orangejuice",
	item_state: "carton",
	list_reagents: null,
});

// bottle.dm:308
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/orangejuice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["orangejuice", 100]);
	return f.dot;
});

rt.type(5825, "/obj/item/weapon/reagent_containers/food/drinks/bottle/cream", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Milk Cream",
	desc: "It's cream. Made from milk. What else did you think you'd find in there?",
	icon_state: "cream",
	item_state: "carton",
	list_reagents: null,
});

// bottle.dm:316
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/cream/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["cream", 100]);
	return f.dot;
});

rt.type(5826, "/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Tomato Juice",
	desc: "Well, at least it LOOKS like tomato juice. You can't tell with all that redness.",
	icon_state: "tomatojuice",
	item_state: "carton",
	list_reagents: null,
});

// bottle.dm:324
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/tomatojuice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["tomatojuice", 100]);
	return f.dot;
});

rt.type(5827, "/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	isGlass: 0,
	name: "Lime Juice",
	desc: "Sweet-sour goodness.",
	icon_state: "limejuice",
	item_state: "carton",
	list_reagents: null,
});

// bottle.dm:332
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/limejuice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.list_reagents = rt.alist(f, ["limejuice", 100]);
	return f.dot;
});

rt.type(5828, "/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov", "/obj/item/weapon/reagent_containers/food/drinks/bottle", {
	accelerants: null,
	active: 0,
	name: "molotov cocktail",
	desc: "A throwing weapon used to ignite things, typically filled with an accelerant. Recommended highly by rioters and revolutionaries. Light and toss.",
	icon_state: "vodkabottle",
	list_reagents: null,
});

// bottle.dm:341
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.accelerants = list(T("/datum/reagent/consumable/ethanol"), T("/datum/reagent/fuel"), T("/datum/reagent/clf3"), T("/datum/reagent/phlogiston"), T("/datum/reagent/napalm"), T("/datum/reagent/hellwater"), T("/datum/reagent/toxin/plasma"), T("/datum/reagent/toxin/spore_burning"));

	this.list_reagents = list();
	return f.dot;
});

// bottle.dm:346
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let B: Value = null;
	yield* parent_proc();
	if (B = rt.locateIn(f, T("/obj/item/weapon/reagent_containers/food/drinks/bottle"), this.contents)) {
		this.icon_state = B.icon_state;
		yield* B.reagents.copy_to(this, 100);
		if (!B.isGlass) {
			this.desc += " You're not sure if making this out of a carton was the brightest idea.";
			this.isGlass = 0;
		}
	}
	return f.dot;
}, true);

// bottle.dm:358
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/throw_impact", function* throw_impact(f: Frame, target: Value, thrower: Value) {
	let R: Value = null, A: Value = null;
	let firestarter: Value = 0;
	for (R of each(this.reagents.reagent_list, T("/datum/reagent"))) {
		A = null;
		for (A of each(this.accelerants)) {
			if (rt.op(f, "IsType", [], [R, A])) {
				firestarter = 1;
				break;
			}
		}
	}
	if (firestarter && this.active) {
		yield* target.fire_act();
		yield* new_(T("/obj/effect/hotspot"), rt.getStep(f, target, 0));
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// bottle.dm:369
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby", function attackby(f: Frame, I: Value, user: Value, params: Value) {
	let message: Value = null, counter: Value = null, target: Value = null, S: Value = null, A: Value = null;
	let $2: any;
	if (!(I.is_hot() && !this.active)) return f.dot;
	this.active = 1;
	let bombturf: Value = rt.getStep(f, this, 0);
	let bombarea: Value = get_area(bombturf);
	let $0: any = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])}`;
	let $1: any = this.name;
	if (bombturf) {
		$2 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
	} else {
		$2 = "nonexistent location";
	}
	GLOB.bombers += (message = `${$0} has primed a ${$1} for detonation at ${`${$2}`}.`);
	message_admins(message);
	log_game(`${key_name(user)} has primed a ${this.name} for detonation at ${bombarea} ${`(${bombturf.x},${bombturf.y},${bombturf.z})`}.`);
	to_chat(user, `<span class='info'>You light ${this} on fire.</span>`);
	this.add_overlay(GLOB.fire_overlay);
	if (this.isGlass) return f.dot;
	rt.spawnTail(f, 50, "/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby: spawn at modules/food_and_drinks/drinks/drinks/bottle.dm:381", I, user, params, bombturf, bombarea, message, counter, target, S, A);
	return f.dot;
});

// a spawn(50) body of /obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attackby: spawn at modules/food_and_drinks/drinks/drinks/bottle.dm:381", function* (f: Frame, I: Value, user: Value, params: Value, bombturf: Value, bombarea: Value, message: Value, counter: Value, target: Value, S: Value, A: Value) {
	if (this.active) {
		counter = null;
		target = this.loc;
		counter = 0;
		while (counter < 2) {
			if (rt.istype(target, T("/obj/item/weapon/storage"))) {
				target = (S = target).loc;
			}
			counter++;
		}
		if (rt.istype(target, T("/atom"))) {
			yield* this.SplashReagents((A = target));
			yield* A.fire_act();
		}
		yield* qdel(this);
	}
	return null;
});

// bottle.dm:397
rt.def("/obj/item/weapon/reagent_containers/food/drinks/bottle/molotov/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.active) return f.dot;
	if (!this.isGlass) {
		to_chat(user, "<span class='danger'>The flame's spread too far on it!</span>");
		return f.dot;
	}
	to_chat(user, `<span class='info'>You snuff out the flame on ${this}.</span>`);
	this.cut_overlay(GLOB.fire_overlay);
	this.active = 0;
	return f.dot;
});
