// Based on /tg/station's code/game/gamemodes/wizard/spellbook.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(1435, "/datum/spellbook_entry", "/datum", {
	name: "Entry Name",
	spell_type: null,
	desc: "",
	category: "Offensive",
	cost: 2,
	refundable: 1,
	surplus: -1,
	S: null,
	buy_word: "Learn",
	limit: null,
	no_coexistance_typecache: null,
});

// spellbook.dm:16
rt.def("/datum/spellbook_entry/proc/New", function New(f: Frame) {
	parent_proc();
	this.no_coexistance_typecache = typecacheof(this.no_coexistance_typecache);
	return f.dot;
});

// spellbook.dm:23
rt.def("/datum/spellbook_entry/proc/CanBuy", function CanBuy(f: Frame, user: Value, book: Value) {
	let spell: Value = null;
	if (book.uses < this.cost || this.limit == 0) {
		return 0;
	}
	for (spell of each(user.mind.spell_list)) {
		if (is_type_in_typecache(spell, this.no_coexistance_typecache)) {
			return 0;
		}
	}
	return 1;
});

// spellbook.dm:31
rt.def("/datum/spellbook_entry/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	let aspell: Value = null;
	let $e: any;
	if (!this.S || !this.S || this.S.gc_destroyed) {
		this.S = (yield* new_(this.spell_type));
	}
	for (aspell of each(user.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
		if (rt.initial(f, this.S, "name") == rt.initial(f, aspell, "name")) {
			if (aspell.spell_level >= aspell.level_max) {
				to_chat(user, "<span class='warning'>This spell cannot be improved further.</span>");
				return 0;
			} else {
				aspell.name = rt.initial(f, aspell, "name");
				aspell.spell_level++;
				aspell.charge_max = round(rt.initial(f, aspell, "charge_max") - aspell.spell_level * (rt.initial(f, aspell, "charge_max") - aspell.cooldown_min) / aspell.level_max);
				if (aspell.charge_max < aspell.charge_counter) {
					aspell.charge_counter = aspell.charge_max;
				}
				if (aspell.spell_level === 1) {
					to_chat(user, `<span class='notice'>You have improved ${aspell.name} into Efficient ${aspell.name}.</span>`);
					aspell.name = `Efficient ${aspell.name}`;
				} else if (aspell.spell_level === 2) {
					to_chat(user, `<span class='notice'>You have further improved ${aspell.name} into Quickened ${aspell.name}.</span>`);
					aspell.name = `Quickened ${aspell.name}`;
				} else if (aspell.spell_level === 3) {
					to_chat(user, `<span class='notice'>You have further improved ${aspell.name} into Free ${aspell.name}.</span>`);
					aspell.name = `Free ${aspell.name}`;
				} else if (aspell.spell_level === 4) {
					to_chat(user, `<span class='notice'>You have further improved ${aspell.name} into Instant ${aspell.name}.</span>`);
					aspell.name = `Instant ${aspell.name}`;
				}
				if (aspell.spell_level >= aspell.level_max) {
					to_chat(user, "<span class='notice'>This spell cannot be strengthened any further.</span>");
				}
				return 1;
			}
		}
	}
	yield* user.mind.AddSpell(this.S);
	to_chat(user, `<span class='notice'>You have learned ${this.S.name}.</span>`);
	return 1;
}, true);

// spellbook.dm:69
rt.def("/datum/spellbook_entry/proc/CanRefund", function* CanRefund(f: Frame, user: Value, book: Value) {
	let aspell: Value = null;
	if (!this.refundable) {
		return 0;
	}
	if (!this.S) {
		this.S = (yield* new_(this.spell_type));
	}
	for (aspell of each(user.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
		if (rt.initial(f, this.S, "name") == rt.initial(f, aspell, "name")) {
			return 1;
		}
	}
	return 0;
}, true);

// spellbook.dm:79
rt.def("/datum/spellbook_entry/proc/Refund", function* Refund(f: Frame, user: Value, book: Value) {
	let aspell: Value = null;
	let A: Value = rt.locateIn(f, T("/area/wizard_station"), rt.world());
	if (!rt.isIn(f, user, A.contents)) {
		to_chat(user, "<span class='warning'>You can only refund spells at the wizard lair</span>");
		return -1;
	}
	if (!this.S) {
		this.S = (yield* new_(this.spell_type));
	}
	let spell_levels: Value = 0;
	for (aspell of each(user.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
		if (rt.initial(f, this.S, "name") == rt.initial(f, aspell, "name")) {
			spell_levels = aspell.spell_level;
			yield* user.mind.spell_list.Remove(aspell);
			yield* qdel(this.S);
			return this.cost * (spell_levels + 1);
		}
	}
	return -1;
}, true);

// spellbook.dm:94
rt.def("/datum/spellbook_entry/proc/GetInfo", function* GetInfo(f: Frame) {
	if (!this.S) {
		this.S = (yield* new_(this.spell_type));
	}
	let dat: Value = "";
	dat += `<b>${rt.initial(f, this.S, "name")}</b>`;
	if (this.S.charge_type == "recharge") {
		dat += ` Cooldown:${this.S.charge_max / 10}`;
	}
	dat += ` Cost:${this.cost}<br>`;
	dat += `<i>${this.S.desc}${this.desc}</i><br>`;
	return (dat += `${this.S.clothes_req ? "Needs wizard garb" : "Can be cast without wizard garb"}<br>`);
}, true);

rt.type(1457, "/datum/spellbook_entry/lightningbolt", "/datum/spellbook_entry", {
	name: "Lightning Bolt",
	cost: 3,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aimed/lightningbolt"),
});

// spellbook.dm:215
rt.def("/datum/spellbook_entry/lightningbolt/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.dot = (yield* parent_proc());
	if (!user.secondary_flags) {
		user.secondary_flags = list();
	}
	rt.setAt(user.secondary_flags, "tesla_ignore", 1);
	return f.dot;
}, true);

rt.type(1465, "/datum/spellbook_entry/item", "/datum/spellbook_entry", {
	item_path: null,
	name: "Buy Item",
	refundable: 0,
	buy_word: "Summon",
});

// spellbook.dm:267
rt.def("/datum/spellbook_entry/item/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	yield* new_(this.item_path, rt.getStep(f, user, 0));
	return 1;
}, true);

// spellbook.dm:272
rt.def("/datum/spellbook_entry/item/proc/GetInfo", function GetInfo(f: Frame) {
	let dat: Value = "";
	dat += `<b>${this.name}</b>`;
	dat += ` Cost:${this.cost}<br>`;
	dat += `<i>${this.desc}</i><br>`;
	if (this.surplus >= 0) {
		dat += `${this.surplus} left.<br>`;
	}
	return dat;
});

rt.type(1472, "/datum/spellbook_entry/item/scryingorb", "/datum/spellbook_entry/item", {
	name: "Scrying Orb",
	desc: "An incandescent orb of crackling energy, using it will allow you to ghost while alive, allowing you to spy upon the station with ease. In addition, buying it will permanently grant you x-ray vision.",
	category: "Defensive",
	item_path: rt.typePath("/obj/item/weapon/scrying"),
});

// spellbook.dm:322
rt.def("/datum/spellbook_entry/item/scryingorb/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	if (yield* parent_proc()) {
		if (!user.dna.check_mutation("X Ray Vision")) {
			yield* user.dna.add_mutation("X Ray Vision");
		}
	}
	return 1;
}, true);

rt.type(1473, "/datum/spellbook_entry/item/soulstones", "/datum/spellbook_entry/item", {
	name: "Six Soul Stone Shards and the spell Artificer",
	desc: "Soul Stone Shards are ancient tools capable of capturing and harnessing the spirits of the dead and dying. The spell Artificer allows you to create arcane machines for the captured souls to pilot.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/storage/belt/soulstone/full"),
});

// spellbook.dm:334
rt.def("/datum/spellbook_entry/item/soulstones/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		yield* user.mind.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct"), null)));
	}
	return f.dot;
}, true);

rt.type(1476, "/datum/spellbook_entry/item/armor", "/datum/spellbook_entry/item", {
	name: "Mastercrafted Armor Set",
	desc: "An artefact suit of armor that allows you to cast spells while providing more protection against attacks and the void of space.",
	category: "Defensive",
	item_path: rt.typePath("/obj/item/clothing/suit/space/hardsuit/wizard"),
});

// spellbook.dm:358
rt.def("/datum/spellbook_entry/item/armor/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* new_(T("/obj/item/clothing/shoes/sandal/magic"), rt.getStep(f, user, 0));
	yield* new_(T("/obj/item/clothing/gloves/color/purple"), rt.getStep(f, user, 0));
	return f.dot;
}, true);

rt.type(1478, "/datum/spellbook_entry/item/guardian", "/datum/spellbook_entry/item", {
	name: "Guardian Deck",
	desc: "A deck of guardian tarot cards, capable of binding a personal guardian to your body. There are multiple types of guardian available, but all of them will transfer some amount of damage to you. It would be wise to avoid buying these with anything capable of causing you to swap bodies with others.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/guardiancreator/choose/wizard"),
});

// spellbook.dm:377
rt.def("/datum/spellbook_entry/item/guardian/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* new_(T("/obj/item/weapon/paper/guardian/wizard"), rt.getStep(f, user, 0));
	return f.dot;
}, true);

rt.type(1486, "/datum/spellbook_entry/summon", "/datum/spellbook_entry", {
	active: 0,
	name: "Summon Stuff",
	category: "Rituals",
	refundable: 0,
	buy_word: "Cast",
});

// spellbook.dm:441
rt.def("/datum/spellbook_entry/summon/proc/CanBuy", function CanBuy(f: Frame, user: Value, book: Value) {
	return (parent_proc() && (!this.active ? 1 : 0));
}, false);

// spellbook.dm:444
rt.def("/datum/spellbook_entry/summon/proc/GetInfo", function GetInfo(f: Frame) {
	let dat: Value = "";
	dat += `<b>${this.name}</b>`;
	if (this.cost > 0) {
		dat += ` Cost:${this.cost}<br>`;
	} else {
		dat += " No Cost<br>";
	}
	dat += `<i>${this.desc}</i><br>`;
	if (this.active) {
		dat += "<b>Already cast!</b><br>";
	}
	return dat;
});

rt.type(1487, "/datum/spellbook_entry/summon/ghosts", "/datum/spellbook_entry/summon", {
	name: "Summon Ghosts",
	desc: "Spook the crew out by making them see dead people. Be warned, ghosts are capricious and occasionally vindicative, and some will use their incredibly minor abilties to frustrate you.",
	cost: 0,
});

// spellbook.dm:461
rt.def("/datum/spellbook_entry/summon/ghosts/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!GLOB.SSticker.mode) {
		return 0;
	} else {
		return 1;
	}
});

// spellbook.dm:467
rt.def("/datum/spellbook_entry/summon/ghosts/proc/Buy", function Buy(f: Frame, user: Value, book: Value) {
	new_(T("/datum/round_event/wizard/ghost"));
	this.active = 1;
	to_chat(user, "<span class='notice'>You have cast summon ghosts!</span>");
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/effects/ghost2.ogg"), 50, 1);
	return 1;
});

rt.type(1488, "/datum/spellbook_entry/summon/guns", "/datum/spellbook_entry/summon", {
	name: "Summon Guns",
	desc: "Nothing could possibly go wrong with arming a crew of lunatics just itching for an excuse to kill you. Just be careful not to stand still too long!",
});

// spellbook.dm:479
rt.def("/datum/spellbook_entry/summon/guns/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!GLOB.SSticker.mode) {
		return 0;
	}
	return (!GLOB.config.no_summon_guns ? 1 : 0);
});

// spellbook.dm:484
rt.def("/datum/spellbook_entry/summon/guns/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	yield* rightandwrong(0, user, 25);
	this.active = 1;
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1);
	to_chat(user, "<span class='notice'>You have cast summon guns!</span>");
	return 1;
}, true);

rt.type(1489, "/datum/spellbook_entry/summon/magic", "/datum/spellbook_entry/summon", {
	name: "Summon Magic",
	desc: "Share the wonders of magic with the crew and show them why they aren't to be trusted with it at the same time.",
});

// spellbook.dm:496
rt.def("/datum/spellbook_entry/summon/magic/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!GLOB.SSticker.mode) {
		return 0;
	}
	return (!GLOB.config.no_summon_magic ? 1 : 0);
});

// spellbook.dm:501
rt.def("/datum/spellbook_entry/summon/magic/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	yield* rightandwrong(1, user, 25);
	this.active = 1;
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1);
	to_chat(user, "<span class='notice'>You have cast summon magic!</span>");
	return 1;
}, true);

rt.type(1490, "/datum/spellbook_entry/summon/events", "/datum/spellbook_entry/summon", {
	times: 0,
	name: "Summon Events",
	desc: "Give Murphy's law a little push and replace all events with special wizard ones that will confound and confuse everyone. Multiple castings increase the rate of these events.",
});

// spellbook.dm:514
rt.def("/datum/spellbook_entry/summon/events/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!GLOB.SSticker.mode) {
		return 0;
	}
	return (!GLOB.config.no_summon_events ? 1 : 0);
});

// spellbook.dm:519
rt.def("/datum/spellbook_entry/summon/events/proc/Buy", function Buy(f: Frame, user: Value, book: Value) {
	summonevents();
	this.times++;
	playsound(rt.getStep(f, user, 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1);
	to_chat(user, "<span class='notice'>You have cast summon events.</span>");
	return 1;
});

// spellbook.dm:527
rt.def("/datum/spellbook_entry/summon/events/proc/GetInfo", function GetInfo(f: Frame) {
	f.dot = parent_proc();
	if (this.times > 0) {
		f.dot += `You cast it ${this.times} times.<br>`;
	}
	return f.dot;
});

rt.type(6696, "/obj/item/weapon/spellbook", "/obj/item/weapon", {
	uses: 10,
	temp: null,
	tab: null,
	owner: null,
	entries: null,
	categories: null,
	throw_speed: 2,
	throw_range: 5,
	name: "spell book",
	desc: "An unearthly tome that glows with power.",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "book",
	w_class: 1,
	persistence_replacement: rt.typePath("/obj/item/weapon/spellbook/oneuse/random"),
});

// spellbook.dm:545
rt.def("/obj/item/weapon/spellbook/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.entries = list();

	this.categories = list();
	return f.dot;
});

// spellbook.dm:549
rt.def("/obj/item/weapon/spellbook/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.owner) {
		to_chat(user, `There is a small signature on the front cover: "${this.owner}".`);
	} else {
		to_chat(user, "It appears to have no author.");
	}
	return f.dot;
}, false);

// spellbook.dm:556
rt.def("/obj/item/weapon/spellbook/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.prepare_spells();
	return f.dot;
}, true);

// spellbook.dm:560
rt.def("/obj/item/weapon/spellbook/proc/prepare_spells", function* prepare_spells(f: Frame) {
	let _T: Value = null, E: Value = null;
	let entry_types: Value = typesof(T("/datum/spellbook_entry")) - T("/datum/spellbook_entry") - T("/datum/spellbook_entry/item") - T("/datum/spellbook_entry/summon");
	for (_T of each(entry_types)) {
		if ((E = (yield* new_(_T))).IsAvailible()) {
			(rt.modSrcVar(f, "entries", E, rt.bitOr));
			(rt.modSrcVar(f, "categories", E.category, rt.bitOr));
		} else {
			yield* qdel(E);
		}
	}
	this.tab = rt.index(this.categories, 1);
	return f.dot;
}, true);

// spellbook.dm:571
rt.def("/obj/item/weapon/spellbook/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let contract: Value = null, CT: Value = null, BB: Value = null;
	if (rt.istype(O, T("/obj/item/weapon/antag_spawner/contract"))) {
		if ((contract = O).used) {
			to_chat(user, "<span class='warning'>The contract has been used, you can't get your points back now!</span>");
		} else {
			to_chat(user, "<span class='notice'>You feed the contract back into the spellbook, refunding your points.</span>");
			this.uses++;
			for (CT of each(this.entries, T("/datum/spellbook_entry/item/contract"))) {
				if (CT.limit !== null) {
					CT.limit++;
				}
			}
			yield* qdel(O);
		}
	} else {
		if (!rt.istype(O, T("/obj/item/weapon/antag_spawner/slaughter_demon"))) return f.dot;
		to_chat(user, "<span class='notice'>On second thought, maybe summoning a demon is a bad idea. You refund your points.</span>");
		this.uses++;
		for (BB of each(this.entries, T("/datum/spellbook_entry/item/bloodbottle"))) {
			if (BB.limit !== null) {
				BB.limit++;
			}
		}
		yield* qdel(O);
	}
	return f.dot;
}, true);

// spellbook.dm:591
rt.def("/obj/item/weapon/spellbook/proc/GetCategoryHeader", function GetCategoryHeader(f: Frame, category: Value) {
	let dat: Value = "";
	if (category === "Offensive") {
		dat += "Spells and items geared towards debilitating and destroying.<BR><BR>";
		dat += "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>";
		dat += "For spells: the number after the spell name is the cooldown time.<BR>";
		dat += "You can reduce this number by spending more points on the spell.<BR>";
	} else if (category === "Defensive") {
		dat += "Spells and items geared towards improving your survivabilty or reducing foes' ability to attack.<BR><BR>";
		dat += "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>";
		dat += "For spells: the number after the spell name is the cooldown time.<BR>";
		dat += "You can reduce this number by spending more points on the spell.<BR>";
	} else if (category === "Mobility") {
		dat += "Spells and items geared towards improving your ability to move. It is a good idea to take at least one.<BR><BR>";
		dat += "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>";
		dat += "For spells: the number after the spell name is the cooldown time.<BR>";
		dat += "You can reduce this number by spending more points on the spell.<BR>";
	} else if (category === "Assistance") {
		dat += "Spells and items geared towards bringing in outside forces to aid you or improving upon your other items and abilties.<BR><BR>";
		dat += "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>";
		dat += "For spells: the number after the spell name is the cooldown time.<BR>";
		dat += "You can reduce this number by spending more points on the spell.<BR>";
	} else if (category === "Challenges") {
		dat += "The Wizard Federation typically has hard limits on the potency and number of spells brought to the station based on risk.<BR>";
		dat += "Arming the station against you will increases the risk, but will grant you one more charge for your spellbook.<BR>";
	} else if (category === "Rituals") {
		dat += "These powerful spells change the very fabric of reality. Not always in your favour.<BR>";
	}
	return dat;
});

// spellbook.dm:621
rt.def("/obj/item/weapon/spellbook/proc/wrap", function wrap(f: Frame, content: Value) {
	let dat: Value = "";
	dat += "<html><head><title>Spellbook</title></head>";
	dat += "\n\t<head>\n\t\t<style type=\"text/css\">\n      \t\tbody { font-size: 80%; font-family: 'Lucida Grande', Verdana, Arial, Sans-Serif; }\n      \t\tul#tabs { list-style-type: none; margin: 30px 0 0 0; padding: 0 0 0.3em 0; }\n      \t\tul#tabs li { display: inline; }\n      \t\tul#tabs li a { color: #42454a; background-color: #dedbde; border: 1px solid #c9c3ba; border-bottom: none; padding: 0.3em; text-decoration: none; }\n      \t\tul#tabs li a:hover { background-color: #f1f0ee; }\n      \t\tul#tabs li a.selected { color: #000; background-color: #f1f0ee; font-weight: bold; padding: 0.7em 0.3em 0.38em 0.3em; }\n      \t\tdiv.tabContent { border: 1px solid #c9c3ba; padding: 0.5em; background-color: #f1f0ee; }\n      \t\tdiv.tabContent.hide { display: none; }\n    \t</style>\n  \t</head>\n\t";
	return (dat += `${content}</body></html>`);
});

// spellbook.dm:641
rt.def("/obj/item/weapon/spellbook/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let category: Value = null, E: Value = null, spell_info: Value = null, category_3: Value = null;
	let $0: any, $e: any;
	if (!this.owner) {
		to_chat(user, "<span class='notice'>You bind the spellbook to yourself.</span>");
		this.owner = user;
		return f.dot;
	}
	if (user != this.owner) {
		to_chat(user, `<span class='warning'>The ${this.name} does not recognize you as its owner and refuses to open!</span>`);
		return f.dot;
	}
	yield* user.set_machine(this);
	let dat: Value = "";
	dat += "<ul id=\"tabs\">";
	let cat_dat: Value = list();
	for (category of each(this.categories)) {
		rt.setAt(cat_dat, category, "<hr>");
		if (this.tab == category) {
			$0 = "class=selected";
		} else {
			$0 = "";
		}
		dat += fmt("<li><a ＀ href='byond://?src=＃;page=＀'>＀</a></li>", [$0, this, category, category]);
	}
	dat += `<li><a><b>Points remaining : ${this.uses}</b></a></li>`;
	dat += "</ul>";
	let i: Value = 1;
	while (i <= rt.len(f, this.entries)) {
		spell_info = "";
		spell_info += (yield* (E = rt.index(this.entries, i)).GetInfo());
		if (E.CanBuy(user, this)) {
			spell_info += fmt("<a href='byond://?src=＃;buy=＀'>＀</A><br>", [this, i, E.buy_word]);
		} else {
			spell_info += `<span>Can't ${E.buy_word}</span><br>`;
		}
		if (yield* E.CanRefund(user, this)) {
			spell_info += fmt("<a href='byond://?src=＃;refund=＀'>Refund</A><br>", [this, i]);
		}
		spell_info += "<hr>";
		if (rt.index(cat_dat, E.category)) {
			rt.modAt(cat_dat, E.category, spell_info, add);
		}
		i++;
	}
	for (category_3 of each(this.categories)) {
		dat += `<div class="${this.tab == category_3 ? "tabContent" : "tabContent hide"}" id="${category_3}">`;
		dat += this.GetCategoryHeader(category_3);
		dat += rt.index(cat_dat, category_3);
		dat += "</div>";
	}
	rt.op(f, "Browse", [], [user, this.wrap(dat), "window=spellbook;size=700x500"], false);
	onclose(user, "spellbook");
	return f.dot;
}, true);

// spellbook.dm:686
rt.def("/obj/item/weapon/spellbook/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let H: Value = null, E: Value = null, result: Value = null;
	yield* parent_proc();
	if ((H = f.usr).stat || H.restrained()) {
		return f.dot;
	}
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return 1;
	}
	if (H.mind.special_role == "apprentice") {
		this.temp = "If you got caught sneaking a peek from your teacher's spellbook, you'd likely be expelled from the Wizard Academy. Better not.";
		return f.dot;
	}
	if (this.loc == H || get_dist(this, H) <= 1 && isturf(this.loc)) {
		yield* H.set_machine(this);
		if (rt.at(href_list, "buy")) {
			if ((E = rt.index(this.entries, text2num(rt.at(href_list, "buy")))) && E.CanBuy(H, this)) {
				if (yield* E.Buy(H, this)) {
					if (E.limit) {
						E.limit--;
					}
					this.uses -= E.cost;
				}
			}
		} else if (rt.at(href_list, "refund")) {
			if ((E = rt.index(this.entries, text2num(rt.at(href_list, "refund")))) && E.refundable) {
				if ((result = (yield* E.Refund(H, this))) > 0) {
					if (E.limit !== null) {
						E.limit += result;
					}
					this.uses += result;
				}
			}
		} else if (rt.at(href_list, "page")) {
			this.tab = sanitize(rt.at(href_list, "page"));
		}
	}
	yield* this.attack_self(H);
	return f.dot;
}, true);

rt.type(6697, "/obj/item/weapon/spellbook/oneuse", "/obj/item/weapon/spellbook", {
	spellname: "sandbox",
	used: 0,
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"),
	uses: 1,
	name: "spellbook of ",
	desc: "This template spellbook was never meant for the eyes of man...",
	persistence_replacement: null,
});

// spellbook.dm:733
rt.def("/obj/item/weapon/spellbook/oneuse/proc/prepare_spells", function prepare_spells(f: Frame) {
	this.name += this.spellname;
	return f.dot;
});

// spellbook.dm:736
rt.def("/obj/item/weapon/spellbook/oneuse/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let knownspell: Value = null;
	let S: Value = (yield* new_(this.spell));
	for (knownspell of each(user.mind.spell_list, T("/obj/effect/proc_holder/spell"))) {
		if (knownspell.type == S.type) {
			if (user.mind) {
				if (user.mind.special_role == "apprentice" || user.mind.special_role == "Wizard") {
					to_chat(user, "<span class='notice'>You're already far more versed in this spell than this flimsy how-to book can provide.</span>");
				} else {
					to_chat(user, "<span class='notice'>You've already read this one.</span>");
				}
			}
			return f.dot;
		}
	}
	if (this.used) {
		yield* this.recoil(user);
	} else {
		yield* user.mind.AddSpell(S);
		to_chat(user, `<span class='notice'>You rapidly read through the arcane book. Suddenly you realize you understand ${this.spellname}!</span>`);
		user.log_message(`<font color='orange'>learned the spell ${this.spellname} (${S}).</font>`, "Attack log");
		this.onlearned(user);
	}
	return f.dot;
}, true);

// spellbook.dm:754
rt.def("/obj/item/weapon/spellbook/oneuse/proc/recoil", function recoil(f: Frame, user: Value) {
	user.visible_message(`<span class='warning'>${this} glows in a black light!</span>`);
	return f.dot;
});

// spellbook.dm:758
rt.def("/obj/item/weapon/spellbook/oneuse/proc/onlearned", function onlearned(f: Frame, user: Value) {
	this.used = 1;
	user.visible_message(`<span class='caution'>${this} glows dark for a second!</span>`);
	return f.dot;
});

rt.type(6698, "/obj/item/weapon/spellbook/oneuse/fireball", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "fireball",
	spell: rt.typePath("/obj/effect/proc_holder/spell/aimed/fireball"),
	icon_state: "bookfireball",
	desc: "This book feels warm to the touch.",
});

// spellbook.dm:770
rt.def("/obj/item/weapon/spellbook/oneuse/fireball/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	yield* explosion(user.loc, -1, 0, 2, 3, 0, { flame_range: 2 });
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6699, "/obj/item/weapon/spellbook/oneuse/smoke", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "smoke",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/smoke"),
	icon_state: "booksmoke",
	desc: "This book is overflowing with the dank arts.",
});

// spellbook.dm:784
rt.def("/obj/item/weapon/spellbook/oneuse/smoke/proc/recoil", function recoil(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, "<span class='caution'>Your stomach rumbles...</span>");
	if (!user.nutrition) return f.dot;
	user.nutrition -= 200;
	if (!(user.nutrition <= 0)) return f.dot;
	user.nutrition = 0;
	return f.dot;
}, false);

rt.type(6701, "/obj/item/weapon/spellbook/oneuse/blind", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "blind",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/trigger/blind"),
	icon_state: "bookblind",
	desc: "This book looks blurry, no matter how you look at it.",
});

// spellbook.dm:799
rt.def("/obj/item/weapon/spellbook/oneuse/blind/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='warning'>You go blind!</span>");
	yield* user.blind_eyes(10);
	return f.dot;
}, true);

rt.type(6702, "/obj/item/weapon/spellbook/oneuse/mindswap", "/obj/item/weapon/spellbook/oneuse", {
	stored_swap: null,
	spellname: "mindswap",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/mind_transfer"),
	icon_state: "bookmindswap",
	desc: "This book's cover is pristine, though its pages look ragged and torn.",
});

// spellbook.dm:811
rt.def("/obj/item/weapon/spellbook/oneuse/mindswap/proc/onlearned", function onlearned(f: Frame) {
	this.spellname = pick("fireball", "smoke", "blind", "forcewall", "knock", "barnyard", "charge");
	this.icon_state = `book${this.spellname}`;
	this.name = `spellbook of ${this.spellname}`;
	parent_proc();
	return f.dot;
});

// spellbook.dm:817
rt.def("/obj/item/weapon/spellbook/oneuse/mindswap/proc/recoil", function* recoil(f: Frame, user: Value) {
	let swapper: Value = null;
	yield* parent_proc();
	if (rt.isIn(f, this.stored_swap, GLOB.dead_mob_list)) {
		this.stored_swap = null;
	}
	if (!this.stored_swap) {
		this.stored_swap = user;
		to_chat(user, "<span class='warning'>For a moment you feel like you don't even know who you are anymore.</span>");
		return f.dot;
	}
	if (this.stored_swap == user) {
		to_chat(user, "<span class='notice'>You stare at the book some more, but there doesn't seem to be anything else to learn...</span>");
		return f.dot;
	}
	yield* (swapper = (yield* new_(T("/obj/effect/proc_holder/spell/targeted/mind_transfer")))).cast(user, this.stored_swap, 1);
	to_chat(this.stored_swap, "<span class='warning'>You're suddenly somewhere else... and someone else?!</span>");
	to_chat(user, `<span class='warning'>Suddenly you're staring at ${this} again... where are you, who are you?!</span>`);
	this.stored_swap = null;
	return f.dot;
}, true);

rt.type(6703, "/obj/item/weapon/spellbook/oneuse/forcewall", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "forcewall",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/forcewall"),
	icon_state: "bookforcewall",
	desc: "This book has a dedication to mimes everywhere inside the front cover.",
});

// spellbook.dm:842
rt.def("/obj/item/weapon/spellbook/oneuse/forcewall/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='warning'>You suddenly feel very solid!</span>");
	yield* user.Stun(40, { ignore_canstun: 1 });
	yield* user.petrify(30);
	return f.dot;
}, true);

rt.type(6704, "/obj/item/weapon/spellbook/oneuse/knock", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "knock",
	spell: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/knock"),
	icon_state: "bookknock",
	desc: "This book is hard to hold closed properly.",
});

// spellbook.dm:854
rt.def("/obj/item/weapon/spellbook/oneuse/knock/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, "<span class='warning'>You're knocked down!</span>");
	yield* user.Knockdown(40);
	return f.dot;
}, true);

rt.type(6705, "/obj/item/weapon/spellbook/oneuse/barnyard", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "barnyard",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/barnyardcurse"),
	icon_state: "bookhorses",
	desc: "This book is more horse than your mind has room for.",
});

// spellbook.dm:865
rt.def("/obj/item/weapon/spellbook/oneuse/barnyard/proc/recoil", function* recoil(f: Frame, user: Value) {
	let magichead: Value = null;
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		to_chat(user, "<font size='15' color='red'><b>HOR-SIE HAS RISEN</b></font>");
		(rt.modField(f, (magichead = (yield* new_(T("/obj/item/clothing/mask/horsehead")))), "flags", NODROP, rt.bitOr));
		(rt.modField(f, magichead, "flags_inv", 16777087, rt.bitAnd));
		magichead.voicechange = 1;
		if (!(yield* user.dropItemToGround(user.wear_mask))) {
			yield* qdel(user.wear_mask);
		}
		yield* user.equip_to_slot_if_possible(magichead, slot_wear_mask, 1, 1);
		yield* qdel(this);
	} else {
		to_chat(user, "<span class='notice'>I say thee neigh</span>");
	}
	return f.dot;
}, true);

rt.type(6706, "/obj/item/weapon/spellbook/oneuse/charge", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "charging",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/charge"),
	icon_state: "bookcharge",
	desc: "This book is made of 100% post-consumer wizard.",
});

// spellbook.dm:885
rt.def("/obj/item/weapon/spellbook/oneuse/charge/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, `<span class='warning'>${this} suddenly feels very warm!</span>`);
	yield* empulse(this, 1, 1);
	return f.dot;
}, true);

rt.type(6707, "/obj/item/weapon/spellbook/oneuse/summonitem", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "instant summons",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/summonitem"),
	icon_state: "booksummons",
	desc: "This book is bright and garish, very hard to miss.",
});

// spellbook.dm:896
rt.def("/obj/item/weapon/spellbook/oneuse/summonitem/proc/recoil", function* recoil(f: Frame, user: Value) {
	yield* parent_proc();
	to_chat(user, `<span class='warning'>${this} suddenly vanishes!</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6708, "/obj/item/weapon/spellbook/oneuse/random", "/obj/item/weapon/spellbook/oneuse", {});

// spellbook.dm:901
rt.def("/obj/item/weapon/spellbook/oneuse/random/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	let real_type: Value = pick(typesof(T("/obj/item/weapon/spellbook/oneuse")) - T("/obj/item/weapon/spellbook/oneuse") - GLOB.banned_spells);
	yield* new_(real_type, this.loc);
	yield* qdel(this);
	return f.dot;
}, true);
