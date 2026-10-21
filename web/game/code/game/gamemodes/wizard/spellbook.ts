// From code/game/gamemodes/wizard/spellbook.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /datum/spellbook_entry/proc/New  (code/game/gamemodes/wizard/spellbook.dm:16)
rt.def("/datum/spellbook_entry/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "no_coexistance_typecache", rt.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "no_coexistance_typecache")]));
	return f.dot;
});

// /datum/spellbook_entry/proc/CanBuy  (code/game/gamemodes/wizard/spellbook.dm:23)
rt.def("/datum/spellbook_entry/proc/CanBuy", function CanBuy(f: Frame, user: Value, book: Value) {
	let spell: Value = null;
	let $e: any;
	f.vars = () => [spell, $e];
	if ((rt.lt(rt.fv(f, "uses", live(book)), rt.sv(f, "cost")) || isEqual(rt.sv(f, "limit"), 0))) {
		return 0;
	}
	spell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))));
	while (($e = rt.next(f, 0)) !== undefined) {
		spell = $e;
		if (truthy(rt.call(f, P("/proc/is_type_in_typecache"), null, [live(spell), rt.sv(f, "no_coexistance_typecache")]))) {
			return 0;
		}
	}
	rt.endFor(f, 0);
	return 1;
});

// /datum/spellbook_entry/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:31)  may sleep
rt.def("/datum/spellbook_entry/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	let aspell: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, book, aspell, $0, $e];
	if ((!truthy(rt.sv(f, "S")) || (!truthy(rt.sv(f, "S")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "S")))))) {
		rt.setSv(f, "S", (yield* g.new_(f, rt.sv(f, "spell_type"), [])));
	}
	aspell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aspell = $e;
		if (isEqual(rt.initial(f, rt.sv(f, "S"), "name"), rt.initial(f, live(aspell), "name"))) {
			if (rt.ge(rt.fv(f, "spell_level", live(aspell)), rt.fv(f, "level_max", live(aspell)))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This spell cannot be improved further.</span>"]);
				return 0;
			} else {
				rt.setFv(f, "name", live(aspell), rt.initial(f, live(aspell), "name"));
				rt.incField(f, live(aspell), "spell_level", 1, true);
				rt.setFv(f, "charge_max", live(aspell), (yield* g.call(f, P("/proc/round"), null, [subtract(rt.initial(f, live(aspell), "charge_max"), divide(multiply(rt.fv(f, "spell_level", live(aspell)), subtract(rt.initial(f, live(aspell), "charge_max"), rt.fv(f, "cooldown_min", live(aspell)))), rt.fv(f, "level_max", live(aspell))))])));
				if (rt.lt(rt.fv(f, "charge_max", live(aspell)), rt.fv(f, "charge_counter", live(aspell)))) {
					rt.setFv(f, "charge_counter", live(aspell), rt.fv(f, "charge_max", live(aspell)));
				}
				$0 = rt.fv(f, "spell_level", live(aspell));
				if ($0 === 1) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You have improved ＀ into Efficient ＀.</span>", [rt.fv(f, "name", live(aspell)), rt.fv(f, "name", live(aspell))])]);
					rt.setFv(f, "name", live(aspell), fmt("Efficient ＀", [rt.fv(f, "name", live(aspell))]));
				} else if ($0 === 2) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You have further improved ＀ into Quickened ＀.</span>", [rt.fv(f, "name", live(aspell)), rt.fv(f, "name", live(aspell))])]);
					rt.setFv(f, "name", live(aspell), fmt("Quickened ＀", [rt.fv(f, "name", live(aspell))]));
				} else if ($0 === 3) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You have further improved ＀ into Free ＀.</span>", [rt.fv(f, "name", live(aspell)), rt.fv(f, "name", live(aspell))])]);
					rt.setFv(f, "name", live(aspell), fmt("Free ＀", [rt.fv(f, "name", live(aspell))]));
				} else if ($0 === 4) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You have further improved ＀ into Instant ＀.</span>", [rt.fv(f, "name", live(aspell)), rt.fv(f, "name", live(aspell))])]);
					rt.setFv(f, "name", live(aspell), fmt("Instant ＀", [rt.fv(f, "name", live(aspell))]));
				}
				if (rt.ge(rt.fv(f, "spell_level", live(aspell)), rt.fv(f, "level_max", live(aspell)))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>This spell cannot be strengthened any further.</span>"]);
				}
				return 1;
			}
		}
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.fv(f, "mind", live(user)), "AddSpell", [rt.sv(f, "S")]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You have learned ＀.</span>", [rt.fv(f, "name", rt.sv(f, "S"))])]);
	return 1;
}, true);

// /datum/spellbook_entry/proc/CanRefund  (code/game/gamemodes/wizard/spellbook.dm:69)  may sleep
rt.def("/datum/spellbook_entry/proc/CanRefund", function* CanRefund(f: Frame, user: Value, book: Value) {
	let aspell: Value = null;
	let $e: any;
	f.vars = () => [user, book, aspell, $e];
	if (!truthy(rt.sv(f, "refundable"))) {
		return 0;
	}
	if (!truthy(rt.sv(f, "S"))) {
		rt.setSv(f, "S", (yield* g.new_(f, rt.sv(f, "spell_type"), [])));
	}
	aspell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aspell = $e;
		if (isEqual(rt.initial(f, rt.sv(f, "S"), "name"), rt.initial(f, live(aspell), "name"))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
}, true);

// /datum/spellbook_entry/proc/Refund  (code/game/gamemodes/wizard/spellbook.dm:79)  may sleep
rt.def("/datum/spellbook_entry/proc/Refund", function* Refund(f: Frame, user: Value, book: Value) {
	let A: Value = null, spell_levels: Value = null, aspell: Value = null;
	let $e: any;
	f.vars = () => [user, book, A, spell_levels, aspell, $e];
	A = rt.locateIn(f, T("/area/wizard_station"), rt.world());
	if (!truthy((rt.isIn(f, live(user), rt.fv(f, "contents", live(A))) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can only refund spells at the wizard lair</span>"]);
		return -1;
	}
	if (!truthy(rt.sv(f, "S"))) {
		rt.setSv(f, "S", (yield* g.new_(f, rt.sv(f, "spell_type"), [])));
	}
	spell_levels = 0;
	aspell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		aspell = $e;
		if (isEqual(rt.initial(f, rt.sv(f, "S"), "name"), rt.initial(f, live(aspell), "name"))) {
			spell_levels = rt.fv(f, "spell_level", live(aspell));
			yield* g.callName(f, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))), "Remove", [live(aspell)]);
			yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "S")]);
			return multiply(rt.sv(f, "cost"), add(live(spell_levels), 1));
		}
	}
	rt.endFor(f, 0);
	return -1;
}, true);

// /datum/spellbook_entry/proc/GetInfo  (code/game/gamemodes/wizard/spellbook.dm:94)  may sleep
rt.def("/datum/spellbook_entry/proc/GetInfo", function* GetInfo(f: Frame) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [dat, $0];
	if (!truthy(rt.sv(f, "S"))) {
		rt.setSv(f, "S", (yield* g.new_(f, rt.sv(f, "spell_type"), [])));
	}
	dat = "";
	dat = rt.modify(live(dat), fmt("<b>＀</b>", [rt.initial(f, rt.sv(f, "S"), "name")]), add);
	if (isEqual(rt.fv(f, "charge_type", rt.sv(f, "S")), "recharge")) {
		dat = rt.modify(live(dat), fmt(" Cooldown:＀", [divide(rt.fv(f, "charge_max", rt.sv(f, "S")), 10)]), add);
	}
	dat = rt.modify(live(dat), fmt(" Cost:＀<br>", [rt.sv(f, "cost")]), add);
	dat = rt.modify(live(dat), fmt("<i>＀＀</i><br>", [rt.fv(f, "desc", rt.sv(f, "S")), rt.sv(f, "desc")]), add);
	if (truthy(rt.fv(f, "clothes_req", rt.sv(f, "S")))) {
		$0 = "Needs wizard garb";
	} else {
		$0 = "Can be cast without wizard garb";
	}
	return (dat = rt.modify(live(dat), fmt("＀<br>", [$0]), add));
}, true);

rt.type(1457, "/datum/spellbook_entry/lightningbolt", "/datum/spellbook_entry", {
	name: "Lightning Bolt",
	cost: 3,
	spell_type: rt.typePath("/obj/effect/proc_holder/spell/aimed/lightningbolt"),
});

// /datum/spellbook_entry/lightningbolt/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:215)  may sleep
rt.def("/datum/spellbook_entry/lightningbolt/proc/Buy", function* Buy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.fv(f, "secondary_flags", live(f.args[0])))) {
		rt.setFv(f, "secondary_flags", live(f.args[0]), rt.list());
	}
	rt.setAt(rt.fv(f, "secondary_flags", live(f.args[0])), "tesla_ignore", 1);
	return f.dot;
}, true, { args: ["user", "book"] });

rt.type(1465, "/datum/spellbook_entry/item", "/datum/spellbook_entry", {
	item_path: null,
	name: "Buy Item",
	refundable: 0,
	buy_word: "Summon",
});

// /datum/spellbook_entry/item/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:267)  may sleep
rt.def("/datum/spellbook_entry/item/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.vars = () => [user, book];
	yield* g.new_(f, rt.sv(f, "item_path"), [rt.getStep(f, live(user), 0)]);
	return 1;
}, true);

// /datum/spellbook_entry/item/proc/GetInfo  (code/game/gamemodes/wizard/spellbook.dm:272)
rt.def("/datum/spellbook_entry/item/proc/GetInfo", function GetInfo(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "";
	dat = rt.modify(live(dat), fmt("<b>＀</b>", [rt.sv(f, "name")]), add);
	dat = rt.modify(live(dat), fmt(" Cost:＀<br>", [rt.sv(f, "cost")]), add);
	dat = rt.modify(live(dat), fmt("<i>＀</i><br>", [rt.sv(f, "desc")]), add);
	if (rt.ge(rt.sv(f, "surplus"), 0)) {
		dat = rt.modify(live(dat), fmt("＀ left.<br>", [rt.sv(f, "surplus")]), add);
	}
	return live(dat);
});

rt.type(1472, "/datum/spellbook_entry/item/scryingorb", "/datum/spellbook_entry/item", {
	name: "Scrying Orb",
	desc: "An incandescent orb of crackling energy, using it will allow you to ghost while alive, allowing you to spy upon the station with ease. In addition, buying it will permanently grant you x-ray vision.",
	category: "Defensive",
	item_path: rt.typePath("/obj/item/weapon/scrying"),
});

// /datum/spellbook_entry/item/scryingorb/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:322)  may sleep
rt.def("/datum/spellbook_entry/item/scryingorb/proc/Buy", function* Buy(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		if (!truthy((yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "check_mutation", ["X Ray Vision"])))) {
			yield* g.callName(f, rt.fv(f, "dna", live(f.args[0])), "add_mutation", ["X Ray Vision"]);
		}
	}
	return 1;
}, true, { args: ["user", "book"] });

rt.type(1473, "/datum/spellbook_entry/item/soulstones", "/datum/spellbook_entry/item", {
	name: "Six Soul Stone Shards and the spell Artificer",
	desc: "Soul Stone Shards are ancient tools capable of capturing and harnessing the spirits of the dead and dying. The spell Artificer allows you to create arcane machines for the captured souls to pilot.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/storage/belt/soulstone/full"),
});

// /datum/spellbook_entry/item/soulstones/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:334)  may sleep
rt.def("/datum/spellbook_entry/item/soulstones/proc/Buy", function* Buy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		yield* g.callName(f, rt.fv(f, "mind", live(f.args[0])), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aoe_turf/conjure/construct"), [null]))]);
	}
	return live(f.dot);
}, true, { args: ["user", "book"] });

rt.type(1476, "/datum/spellbook_entry/item/armor", "/datum/spellbook_entry/item", {
	name: "Mastercrafted Armor Set",
	desc: "An artefact suit of armor that allows you to cast spells while providing more protection against attacks and the void of space.",
	category: "Defensive",
	item_path: rt.typePath("/obj/item/clothing/suit/space/hardsuit/wizard"),
});

// /datum/spellbook_entry/item/armor/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:358)  may sleep
rt.def("/datum/spellbook_entry/item/armor/proc/Buy", function* Buy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.new_(f, T("/obj/item/clothing/shoes/sandal/magic"), [rt.getStep(f, live(f.args[0]), 0)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/color/purple"), [rt.getStep(f, live(f.args[0]), 0)]);
	return f.dot;
}, true, { args: ["user", "book"] });

rt.type(1478, "/datum/spellbook_entry/item/guardian", "/datum/spellbook_entry/item", {
	name: "Guardian Deck",
	desc: "A deck of guardian tarot cards, capable of binding a personal guardian to your body. There are multiple types of guardian available, but all of them will transfer some amount of damage to you. It would be wise to avoid buying these with anything capable of causing you to swap bodies with others.",
	category: "Assistance",
	item_path: rt.typePath("/obj/item/weapon/guardiancreator/choose/wizard"),
});

// /datum/spellbook_entry/item/guardian/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:377)  may sleep
rt.def("/datum/spellbook_entry/item/guardian/proc/Buy", function* Buy(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	yield* g.new_(f, T("/obj/item/weapon/paper/guardian/wizard"), [rt.getStep(f, live(f.args[0]), 0)]);
	return f.dot;
}, true, { args: ["user", "book"] });

rt.type(1486, "/datum/spellbook_entry/summon", "/datum/spellbook_entry", {
	active: 0,
	name: "Summon Stuff",
	category: "Rituals",
	refundable: 0,
	buy_word: "Cast",
});

// /datum/spellbook_entry/summon/proc/CanBuy  (code/game/gamemodes/wizard/spellbook.dm:441)
rt.def("/datum/spellbook_entry/summon/proc/CanBuy", function CanBuy(f: Frame) {
	return (rt.callSuper(f, [], rt.Args.Same) && (!truthy(rt.sv(f, "active")) ? 1 : 0));
}, false, { args: ["user", "book"] });

// /datum/spellbook_entry/summon/proc/GetInfo  (code/game/gamemodes/wizard/spellbook.dm:444)
rt.def("/datum/spellbook_entry/summon/proc/GetInfo", function GetInfo(f: Frame) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "";
	dat = rt.modify(live(dat), fmt("<b>＀</b>", [rt.sv(f, "name")]), add);
	if (rt.gt(rt.sv(f, "cost"), 0)) {
		dat = rt.modify(live(dat), fmt(" Cost:＀<br>", [rt.sv(f, "cost")]), add);
	} else {
		dat = rt.modify(live(dat), " No Cost<br>", add);
	}
	dat = rt.modify(live(dat), fmt("<i>＀</i><br>", [rt.sv(f, "desc")]), add);
	if (truthy(rt.sv(f, "active"))) {
		dat = rt.modify(live(dat), "<b>Already cast!</b><br>", add);
	}
	return live(dat);
});

rt.type(1487, "/datum/spellbook_entry/summon/ghosts", "/datum/spellbook_entry/summon", {
	name: "Summon Ghosts",
	desc: "Spook the crew out by making them see dead people. Be warned, ghosts are capricious and occasionally vindicative, and some will use their incredibly minor abilties to frustrate you.",
	cost: 0,
});

// /datum/spellbook_entry/summon/ghosts/proc/IsAvailible  (code/game/gamemodes/wizard/spellbook.dm:461)
rt.def("/datum/spellbook_entry/summon/ghosts/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		return 0;
	} else {
		return 1;
	}
	return f.dot;
});

// /datum/spellbook_entry/summon/ghosts/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:467)
rt.def("/datum/spellbook_entry/summon/ghosts/proc/Buy", function Buy(f: Frame, user: Value, book: Value) {
	rt.new_(f, T("/datum/round_event/wizard/ghost"), []);
	rt.setSv(f, "active", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You have cast summon ghosts!</span>"]);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/effects/ghost2.ogg"), 50, 1]);
	return 1;
});

rt.type(1488, "/datum/spellbook_entry/summon/guns", "/datum/spellbook_entry/summon", {
	name: "Summon Guns",
	desc: "Nothing could possibly go wrong with arming a crew of lunatics just itching for an excuse to kill you. Just be careful not to stand still too long!",
});

// /datum/spellbook_entry/summon/guns/proc/IsAvailible  (code/game/gamemodes/wizard/spellbook.dm:479)
rt.def("/datum/spellbook_entry/summon/guns/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		return 0;
	}
	return (!truthy(rt.fv(f, "no_summon_guns", rt.gl("config"))) ? 1 : 0);
});

// /datum/spellbook_entry/summon/guns/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:484)  may sleep
rt.def("/datum/spellbook_entry/summon/guns/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.vars = () => [user, book];
	yield* g.call(f, P("/proc/rightandwrong"), null, [0, live(user), 25]);
	rt.setSv(f, "active", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You have cast summon guns!</span>"]);
	return 1;
}, true);

rt.type(1489, "/datum/spellbook_entry/summon/magic", "/datum/spellbook_entry/summon", {
	name: "Summon Magic",
	desc: "Share the wonders of magic with the crew and show them why they aren't to be trusted with it at the same time.",
});

// /datum/spellbook_entry/summon/magic/proc/IsAvailible  (code/game/gamemodes/wizard/spellbook.dm:496)
rt.def("/datum/spellbook_entry/summon/magic/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		return 0;
	}
	return (!truthy(rt.fv(f, "no_summon_magic", rt.gl("config"))) ? 1 : 0);
});

// /datum/spellbook_entry/summon/magic/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:501)  may sleep
rt.def("/datum/spellbook_entry/summon/magic/proc/Buy", function* Buy(f: Frame, user: Value, book: Value) {
	f.vars = () => [user, book];
	yield* g.call(f, P("/proc/rightandwrong"), null, [1, live(user), 25]);
	rt.setSv(f, "active", 1);
	yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You have cast summon magic!</span>"]);
	return 1;
}, true);

rt.type(1490, "/datum/spellbook_entry/summon/events", "/datum/spellbook_entry/summon", {
	times: 0,
	name: "Summon Events",
	desc: "Give Murphy's law a little push and replace all events with special wizard ones that will confound and confuse everyone. Multiple castings increase the rate of these events.",
});

// /datum/spellbook_entry/summon/events/proc/IsAvailible  (code/game/gamemodes/wizard/spellbook.dm:514)
rt.def("/datum/spellbook_entry/summon/events/proc/IsAvailible", function IsAvailible(f: Frame) {
	if (!truthy(rt.fv(f, "mode", rt.gl("SSticker")))) {
		return 0;
	}
	return (!truthy(rt.fv(f, "no_summon_events", rt.gl("config"))) ? 1 : 0);
});

// /datum/spellbook_entry/summon/events/proc/Buy  (code/game/gamemodes/wizard/spellbook.dm:519)
rt.def("/datum/spellbook_entry/summon/events/proc/Buy", function Buy(f: Frame, user: Value, book: Value) {
	rt.call(f, P("/proc/summonevents"), null, []);
	rt.incSrcVar(f, "times", 1, true);
	rt.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(user), 0), rt.rsc("sound/magic/castsummon.ogg"), 50, 1]);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You have cast summon events.</span>"]);
	return 1;
});

// /datum/spellbook_entry/summon/events/proc/GetInfo  (code/game/gamemodes/wizard/spellbook.dm:527)
rt.def("/datum/spellbook_entry/summon/events/proc/GetInfo", function GetInfo(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (rt.gt(rt.sv(f, "times"), 0)) {
		f.dot = rt.modify(live(f.dot), fmt("You cast it ＀ times.<br>", [rt.sv(f, "times")]), add);
	}
	return live(f.dot);
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

// /obj/item/weapon/spellbook/proc/<init>  (code/game/gamemodes/wizard/spellbook.dm:545)
rt.def("/obj/item/weapon/spellbook/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "entries", rt.list());
	$0 = $0;
	rt.setSv(f, "categories", rt.list());
	return f.dot;
});

// /obj/item/weapon/spellbook/proc/examine  (code/game/gamemodes/wizard/spellbook.dm:549)
rt.def("/obj/item/weapon/spellbook/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "owner"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is a small signature on the front cover: \"＀\".", [rt.sv(f, "owner")])]);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It appears to have no author."]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/spellbook/proc/Initialize  (code/game/gamemodes/wizard/spellbook.dm:556)  may sleep
rt.def("/obj/item/weapon/spellbook/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "prepare_spells");
	return f.dot;
}, true);

// /obj/item/weapon/spellbook/proc/prepare_spells  (code/game/gamemodes/wizard/spellbook.dm:560)  may sleep
rt.def("/obj/item/weapon/spellbook/proc/prepare_spells", function* prepare_spells(f: Frame) {
	let entry_types: Value = null, _T: Value = null, E: Value = null;
	let $e: any;
	f.vars = () => [entry_types, _T, E, $e];
	entry_types = subtract(subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/datum/spellbook_entry")])), T("/datum/spellbook_entry")), T("/datum/spellbook_entry/item")), T("/datum/spellbook_entry/summon"));
	_T = null;
	rt.forList(f, 0, live(entry_types));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy((yield* g.callName(f, (E = (yield* g.new_(f, live(_T), []))), "IsAvailible", [])))) {
			(rt.modSrcVar(f, "entries", live(E), rt.bitOr));
			(rt.modSrcVar(f, "categories", rt.fv(f, "category", live(E)), rt.bitOr));
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(E)]);
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "tab", rt.index(rt.sv(f, "categories"), 1));
	return f.dot;
}, true);

// /obj/item/weapon/spellbook/proc/attackby  (code/game/gamemodes/wizard/spellbook.dm:571)  may sleep
rt.def("/obj/item/weapon/spellbook/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let contract: Value = null, CT: Value = null, BB: Value = null;
	let $e: any;
	f.vars = () => [O, user, params, contract, CT, BB, $e];
	if (truthy((rt.istype(live(O), T("/obj/item/weapon/antag_spawner/contract")) ? 1 : 0))) {
		if (truthy(rt.gv(f, "used", (contract = live(O))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>The contract has been used, you can't get your points back now!</span>"]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You feed the contract back into the spellbook, refunding your points.</span>"]);
			rt.incSrcVar(f, "uses", 1, true);
			CT = null;
			rt.forList(f, 0, rt.sv(f, "entries"), T("/datum/spellbook_entry/item/contract"));
			while (($e = rt.next(f, 0)) !== undefined) {
				CT = $e;
				if (rt.fv(f, "limit", live(CT)) !== null) {
					rt.incField(f, live(CT), "limit", 1, true);
				}
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
		}
	} else {
		if (!truthy((rt.istype(live(O), T("/obj/item/weapon/antag_spawner/slaughter_demon")) ? 1 : 0))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>On second thought, maybe summoning a demon is a bad idea. You refund your points.</span>"]);
		rt.incSrcVar(f, "uses", 1, true);
		BB = null;
		rt.forList(f, 0, rt.sv(f, "entries"), T("/datum/spellbook_entry/item/bloodbottle"));
		while (($e = rt.next(f, 0)) !== undefined) {
			BB = $e;
			if (rt.fv(f, "limit", live(BB)) !== null) {
				rt.incField(f, live(BB), "limit", 1, true);
			}
		}
		rt.endFor(f, 0);
		yield* g.call(f, P("/proc/qdel"), null, [live(O)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/spellbook/proc/GetCategoryHeader  (code/game/gamemodes/wizard/spellbook.dm:591)
rt.def("/obj/item/weapon/spellbook/proc/GetCategoryHeader", function GetCategoryHeader(f: Frame, category: Value) {
	let dat: Value = null;
	let $0: any;
	f.vars = () => [dat, $0];
	dat = "";
	$0 = live(category);
	if ($0 === "Offensive") {
		dat = rt.modify(live(dat), "Spells and items geared towards debilitating and destroying.<BR><BR>", add);
		dat = rt.modify(live(dat), "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>", add);
		dat = rt.modify(live(dat), "For spells: the number after the spell name is the cooldown time.<BR>", add);
		dat = rt.modify(live(dat), "You can reduce this number by spending more points on the spell.<BR>", add);
	} else if ($0 === "Defensive") {
		dat = rt.modify(live(dat), "Spells and items geared towards improving your survivabilty or reducing foes' ability to attack.<BR><BR>", add);
		dat = rt.modify(live(dat), "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>", add);
		dat = rt.modify(live(dat), "For spells: the number after the spell name is the cooldown time.<BR>", add);
		dat = rt.modify(live(dat), "You can reduce this number by spending more points on the spell.<BR>", add);
	} else if ($0 === "Mobility") {
		dat = rt.modify(live(dat), "Spells and items geared towards improving your ability to move. It is a good idea to take at least one.<BR><BR>", add);
		dat = rt.modify(live(dat), "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>", add);
		dat = rt.modify(live(dat), "For spells: the number after the spell name is the cooldown time.<BR>", add);
		dat = rt.modify(live(dat), "You can reduce this number by spending more points on the spell.<BR>", add);
	} else if ($0 === "Assistance") {
		dat = rt.modify(live(dat), "Spells and items geared towards bringing in outside forces to aid you or improving upon your other items and abilties.<BR><BR>", add);
		dat = rt.modify(live(dat), "Items are not bound to you and can be stolen. Additionaly they cannot typically be returned once purchased.<BR>", add);
		dat = rt.modify(live(dat), "For spells: the number after the spell name is the cooldown time.<BR>", add);
		dat = rt.modify(live(dat), "You can reduce this number by spending more points on the spell.<BR>", add);
	} else if ($0 === "Challenges") {
		dat = rt.modify(live(dat), "The Wizard Federation typically has hard limits on the potency and number of spells brought to the station based on risk.<BR>", add);
		dat = rt.modify(live(dat), "Arming the station against you will increases the risk, but will grant you one more charge for your spellbook.<BR>", add);
	} else if ($0 === "Rituals") {
		dat = rt.modify(live(dat), "These powerful spells change the very fabric of reality. Not always in your favour.<BR>", add);
	}
	return live(dat);
});

// /obj/item/weapon/spellbook/proc/wrap  (code/game/gamemodes/wizard/spellbook.dm:621)
rt.def("/obj/item/weapon/spellbook/proc/wrap", function wrap(f: Frame, content: Value) {
	let dat: Value = null;
	f.vars = () => [dat];
	dat = "";
	dat = rt.modify(live(dat), "<html><head><title>Spellbook</title></head>", add);
	dat = rt.modify(live(dat), "\n\t<head>\n\t\t<style type=\"text/css\">\n      \t\tbody { font-size: 80%; font-family: 'Lucida Grande', Verdana, Arial, Sans-Serif; }\n      \t\tul#tabs { list-style-type: none; margin: 30px 0 0 0; padding: 0 0 0.3em 0; }\n      \t\tul#tabs li { display: inline; }\n      \t\tul#tabs li a { color: #42454a; background-color: #dedbde; border: 1px solid #c9c3ba; border-bottom: none; padding: 0.3em; text-decoration: none; }\n      \t\tul#tabs li a:hover { background-color: #f1f0ee; }\n      \t\tul#tabs li a.selected { color: #000; background-color: #f1f0ee; font-weight: bold; padding: 0.7em 0.3em 0.38em 0.3em; }\n      \t\tdiv.tabContent { border: 1px solid #c9c3ba; padding: 0.5em; background-color: #f1f0ee; }\n      \t\tdiv.tabContent.hide { display: none; }\n    \t</style>\n  \t</head>\n\t", add);
	return (dat = rt.modify(live(dat), fmt("＀</body></html>", [live(content)]), add));
});

// /obj/item/weapon/spellbook/proc/attack_self  (code/game/gamemodes/wizard/spellbook.dm:641)  may sleep
rt.def("/obj/item/weapon/spellbook/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null, cat_dat: Value = null, category: Value = null, E: Value = null, i: Value = null, spell_info: Value = null, category_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, cat_dat, category, E, i, spell_info, category_3, $0, $e];
	if (!truthy(rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You bind the spellbook to yourself.</span>"]);
		rt.setSv(f, "owner", live(user));
		return live(f.dot);
	}
	if (!isEqual(live(user), rt.sv(f, "owner"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ does not recognize you as its owner and refuses to open!</span>", [rt.sv(f, "name")])]);
		return live(f.dot);
	}
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "";
	dat = rt.modify(live(dat), "<ul id=\"tabs\">", add);
	cat_dat = rt.list();
	category = null;
	rt.forList(f, 0, rt.sv(f, "categories"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category = $e;
		rt.setAt(live(cat_dat), live(category), "<hr>");
		if (isEqual(rt.sv(f, "tab"), live(category))) {
			$0 = "class=selected";
		} else {
			$0 = "";
		}
		dat = rt.modify(live(dat), fmt("<li><a ＀ href='byond://?src=＃;page=＀'>＀</a></li>", [$0, live(f.src), live(category), live(category)]), add);
	}
	rt.endFor(f, 0);
	dat = rt.modify(live(dat), fmt("<li><a><b>Points remaining : ＀</b></a></li>", [rt.sv(f, "uses")]), add);
	dat = rt.modify(live(dat), "</ul>", add);
	E = null;
	i = null;
	i = 1;
	while (rt.le(live(i), rt.len(f, rt.sv(f, "entries")))) {
		spell_info = "";
		spell_info = rt.modify(live(spell_info), (yield* g.callName(f, (E = rt.index(rt.sv(f, "entries"), live(i))), "GetInfo", [])), add);
		if (truthy((yield* g.callName(f, live(E), "CanBuy", [live(user), live(f.src)])))) {
			spell_info = rt.modify(live(spell_info), fmt("<a href='byond://?src=＃;buy=＀'>＀</A><br>", [live(f.src), live(i), rt.fv(f, "buy_word", live(E))]), add);
		} else {
			spell_info = rt.modify(live(spell_info), fmt("<span>Can't ＀</span><br>", [rt.fv(f, "buy_word", live(E))]), add);
		}
		if (truthy((yield* g.callName(f, live(E), "CanRefund", [live(user), live(f.src)])))) {
			spell_info = rt.modify(live(spell_info), fmt("<a href='byond://?src=＃;refund=＀'>Refund</A><br>", [live(f.src), live(i)]), add);
		}
		spell_info = rt.modify(live(spell_info), "<hr>", add);
		if (truthy(rt.index(live(cat_dat), rt.fv(f, "category", live(E))))) {
			rt.modAt(live(cat_dat), rt.fv(f, "category", live(E)), live(spell_info), add);
		}
		i = rt.inc(live(i), 1);
	}
	category_3 = null;
	rt.forList(f, 0, rt.sv(f, "categories"));
	while (($e = rt.next(f, 0)) !== undefined) {
		category_3 = $e;
		if (isEqual(rt.sv(f, "tab"), live(category_3))) {
			$0 = "tabContent";
		} else {
			$0 = "tabContent hide";
		}
		dat = rt.modify(live(dat), fmt("<div class=\"＀\" id=\"＀\">", [$0, live(category_3)]), add);
		dat = rt.modify(live(dat), (yield* g.srcCall(f, "GetCategoryHeader", live(category_3))), add);
		dat = rt.modify(live(dat), rt.index(live(cat_dat), live(category_3)), add);
		dat = rt.modify(live(dat), "</div>", add);
	}
	rt.endFor(f, 0);
	rt.op(f, "Browse", [], [live(user), (yield* g.srcCall(f, "wrap", live(dat))), "window=spellbook;size=700x500"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "spellbook"]);
	return live(f.dot);
}, true);

// /obj/item/weapon/spellbook/proc/Topic  (code/game/gamemodes/wizard/spellbook.dm:686)  may sleep
rt.def("/obj/item/weapon/spellbook/proc/Topic", function* Topic(f: Frame) {
	let H: Value = null, E: Value = null, result: Value = null;
	f.vars = () => [H, E, result];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.gv(f, "stat", (H = live(f.usr)))) || truthy((yield* g.callName(f, live(H), "restrained", []))))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(H), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 1;
	}
	if (isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(H))), "apprentice")) {
		rt.setSv(f, "temp", "If you got caught sneaking a peek from your teacher's spellbook, you'd likely be expelled from the Wizard Academy. Better not.");
		return live(f.dot);
	}
	E = null;
	if ((isEqual(rt.sv(f, "loc"), live(H)) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(H)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))))) {
		yield* g.callName(f, live(H), "set_machine", [live(f.src)]);
		if (truthy(rt.at(live(f.args[1]), "buy"))) {
			if ((truthy((E = rt.index(rt.sv(f, "entries"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "buy")]))))) && truthy((yield* g.callName(f, live(E), "CanBuy", [live(H), live(f.src)]))))) {
				if (truthy((yield* g.callName(f, live(E), "Buy", [live(H), live(f.src)])))) {
					if (truthy(rt.fv(f, "limit", live(E)))) {
						rt.incField(f, live(E), "limit", -1, true);
					}
					(rt.modSrcVar(f, "uses", rt.fv(f, "cost", live(E)), subtract));
				}
			}
		} else {
			if (truthy(rt.at(live(f.args[1]), "refund"))) {
				if ((truthy((E = rt.index(rt.sv(f, "entries"), (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "refund")]))))) && truthy(rt.fv(f, "refundable", live(E))))) {
					if (rt.gt((result = (yield* g.callName(f, live(E), "Refund", [live(H), live(f.src)]))), 0)) {
						if (rt.fv(f, "limit", live(E)) !== null) {
							rt.modField(f, live(E), "limit", live(result), add);
						}
						rt.modSrcVar(f, "uses", live(result), add);
					}
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "page"))) {
					rt.setSv(f, "tab", (yield* g.call(f, P("/proc/sanitize"), null, [rt.at(live(f.args[1]), "page")])));
				}
			}
		}
	}
	yield* g.srcCall(f, "attack_self", live(H));
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

rt.type(6697, "/obj/item/weapon/spellbook/oneuse", "/obj/item/weapon/spellbook", {
	spellname: "sandbox",
	used: 0,
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/projectile/magic_missile"),
	uses: 1,
	name: "spellbook of ",
	desc: "This template spellbook was never meant for the eyes of man...",
	persistence_replacement: null,
});

// /obj/item/weapon/spellbook/oneuse/proc/prepare_spells  (code/game/gamemodes/wizard/spellbook.dm:733)
rt.def("/obj/item/weapon/spellbook/oneuse/proc/prepare_spells", function prepare_spells(f: Frame) {
	rt.modSrcVar(f, "name", rt.sv(f, "spellname"), add);
	return f.dot;
});

// /obj/item/weapon/spellbook/oneuse/proc/attack_self  (code/game/gamemodes/wizard/spellbook.dm:736)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let S: Value = null, knownspell: Value = null;
	let $e: any;
	f.vars = () => [user, S, knownspell, $e];
	S = (yield* g.new_(f, rt.sv(f, "spell"), []));
	knownspell = null;
	rt.forList(f, 0, rt.gv(f, "spell_list", rt.fv(f, "mind", live(user))), T("/obj/effect/proc_holder/spell"));
	while (($e = rt.next(f, 0)) !== undefined) {
		knownspell = $e;
		if (isEqual(rt.fv(f, "type", live(knownspell)), rt.fv(f, "type", live(S)))) {
			if (truthy(rt.fv(f, "mind", live(user)))) {
				if ((isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))), "apprentice") || isEqual(rt.gv(f, "special_role", rt.fv(f, "mind", live(user))), "Wizard"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You're already far more versed in this spell than this flimsy how-to book can provide.</span>"]);
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You've already read this one.</span>"]);
				}
			}
			return live(f.dot);
		}
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "used"))) {
		yield* g.srcCall(f, "recoil", live(user));
	} else {
		yield* g.callName(f, rt.fv(f, "mind", live(user)), "AddSpell", [live(S)]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You rapidly read through the arcane book. Suddenly you realize you understand ＀!</span>", [rt.sv(f, "spellname")])]);
		yield* g.callName(f, live(user), "log_message", [fmt("<font color='orange'>learned the spell ＀ (＀).</font>", [rt.sv(f, "spellname"), live(S)]), "Attack log"]);
		yield* g.srcCall(f, "onlearned", live(user));
	}
	return f.dot;
}, true);

// /obj/item/weapon/spellbook/oneuse/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:754)
rt.def("/obj/item/weapon/spellbook/oneuse/proc/recoil", function recoil(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='warning'>＀ glows in a black light!</span>", [live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/spellbook/oneuse/proc/onlearned  (code/game/gamemodes/wizard/spellbook.dm:758)
rt.def("/obj/item/weapon/spellbook/oneuse/proc/onlearned", function onlearned(f: Frame, user: Value) {
	rt.setSv(f, "used", 1);
	rt.callName(f, live(user), "visible_message", [fmt("<span class='caution'>＀ glows dark for a second!</span>", [live(f.src)])]);
	return f.dot;
});

rt.type(6698, "/obj/item/weapon/spellbook/oneuse/fireball", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "fireball",
	spell: rt.typePath("/obj/effect/proc_holder/spell/aimed/fireball"),
	icon_state: "bookfireball",
	desc: "This book feels warm to the touch.",
});

// /obj/item/weapon/spellbook/oneuse/fireball/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:770)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/fireball/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.args[0])), null, -1, null, 0, null, 2, null, 3, null, 0, "flame_range", 2], rt.Args.Named);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6699, "/obj/item/weapon/spellbook/oneuse/smoke", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "smoke",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/smoke"),
	icon_state: "booksmoke",
	desc: "This book is overflowing with the dank arts.",
});

// /obj/item/weapon/spellbook/oneuse/smoke/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:784)
rt.def("/obj/item/weapon/spellbook/oneuse/smoke/proc/recoil", function recoil(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='caution'>Your stomach rumbles...</span>"]);
	if (!truthy(rt.fv(f, "nutrition", live(f.args[0])))) return f.dot;
	(rt.modField(f, live(f.args[0]), "nutrition", 200, subtract));
	if (!rt.le(rt.fv(f, "nutrition", live(f.args[0])), 0)) return f.dot;
	rt.setFv(f, "nutrition", live(f.args[0]), 0);
	return f.dot;
}, false, { args: ["user"] });

rt.type(6701, "/obj/item/weapon/spellbook/oneuse/blind", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "blind",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/trigger/blind"),
	icon_state: "bookblind",
	desc: "This book looks blurry, no matter how you look at it.",
});

// /obj/item/weapon/spellbook/oneuse/blind/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:799)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/blind/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You go blind!</span>"]);
	yield* g.callName(f, live(f.args[0]), "blind_eyes", [10]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6702, "/obj/item/weapon/spellbook/oneuse/mindswap", "/obj/item/weapon/spellbook/oneuse", {
	stored_swap: null,
	spellname: "mindswap",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/mind_transfer"),
	icon_state: "bookmindswap",
	desc: "This book's cover is pristine, though its pages look ragged and torn.",
});

// /obj/item/weapon/spellbook/oneuse/mindswap/proc/onlearned  (code/game/gamemodes/wizard/spellbook.dm:811)
rt.def("/obj/item/weapon/spellbook/oneuse/mindswap/proc/onlearned", function onlearned(f: Frame) {
	rt.setSv(f, "spellname", rt.op(f, "PickUnweighted", [7], ["fireball", "smoke", "blind", "forcewall", "knock", "barnyard", "charge"]));
	rt.setSv(f, "icon_state", fmt("book＀", [rt.sv(f, "spellname")]));
	rt.setSv(f, "name", fmt("spellbook of ＀", [rt.sv(f, "spellname")]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/item/weapon/spellbook/oneuse/mindswap/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:817)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/mindswap/proc/recoil", function* recoil(f: Frame) {
	let swapper: Value = null;
	f.vars = () => [swapper];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.isIn(f, rt.sv(f, "stored_swap"), rt.gl("dead_mob_list")) ? 1 : 0))) {
		rt.setSv(f, "stored_swap", null);
	}
	if (!truthy(rt.sv(f, "stored_swap"))) {
		rt.setSv(f, "stored_swap", live(f.args[0]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>For a moment you feel like you don't even know who you are anymore.</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "stored_swap"), live(f.args[0]))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You stare at the book some more, but there doesn't seem to be anything else to learn...</span>"]);
		return live(f.dot);
	}
	yield* g.callName(f, (swapper = (yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/mind_transfer"), []))), "cast", [live(f.args[0]), rt.sv(f, "stored_swap"), 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "stored_swap"), "<span class='warning'>You're suddenly somewhere else... and someone else?!</span>"]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>Suddenly you're staring at ＀ again... where are you, who are you?!</span>", [live(f.src)])]);
	rt.setSv(f, "stored_swap", null);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6703, "/obj/item/weapon/spellbook/oneuse/forcewall", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "forcewall",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/forcewall"),
	icon_state: "bookforcewall",
	desc: "This book has a dedication to mimes everywhere inside the front cover.",
});

// /obj/item/weapon/spellbook/oneuse/forcewall/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:842)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/forcewall/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You suddenly feel very solid!</span>"]);
	yield* g.callName(f, live(f.args[0]), "Stun", [null, 40, "ignore_canstun", 1], rt.Args.Named);
	yield* g.callName(f, live(f.args[0]), "petrify", [30]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6704, "/obj/item/weapon/spellbook/oneuse/knock", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "knock",
	spell: rt.typePath("/obj/effect/proc_holder/spell/aoe_turf/knock"),
	icon_state: "bookknock",
	desc: "This book is hard to hold closed properly.",
});

// /obj/item/weapon/spellbook/oneuse/knock/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:854)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/knock/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You're knocked down!</span>"]);
	yield* g.callName(f, live(f.args[0]), "Knockdown", [40]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6705, "/obj/item/weapon/spellbook/oneuse/barnyard", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "barnyard",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/barnyardcurse"),
	icon_state: "bookhorses",
	desc: "This book is more horse than your mind has room for.",
});

// /obj/item/weapon/spellbook/oneuse/barnyard/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:865)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/barnyard/proc/recoil", function* recoil(f: Frame, user: Value) {
	let magichead: Value = null;
	f.vars = () => [user, magichead];
	if (truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<font size='15' color='red'><b>HOR-SIE HAS RISEN</b></font>"]);
		(rt.modField(f, (magichead = (yield* g.new_(f, T("/obj/item/clothing/mask/horsehead"), []))), "flags", 2, rt.bitOr));
		(rt.modField(f, live(magichead), "flags_inv", 16777087, rt.bitAnd));
		rt.setFv(f, "voicechange", live(magichead), 1);
		if (!truthy((yield* g.callName(f, live(user), "dropItemToGround", [rt.fv(f, "wear_mask", live(user))])))) {
			yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "wear_mask", live(user))]);
		}
		yield* g.callName(f, live(user), "equip_to_slot_if_possible", [live(magichead), 2, 1, 1]);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>I say thee neigh</span>"]);
	}
	return f.dot;
}, true);

rt.type(6706, "/obj/item/weapon/spellbook/oneuse/charge", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "charging",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/charge"),
	icon_state: "bookcharge",
	desc: "This book is made of 100% post-consumer wizard.",
});

// /obj/item/weapon/spellbook/oneuse/charge/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:885)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/charge/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ suddenly feels very warm!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/empulse"), null, [live(f.src), 1, 1]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6707, "/obj/item/weapon/spellbook/oneuse/summonitem", "/obj/item/weapon/spellbook/oneuse", {
	spellname: "instant summons",
	spell: rt.typePath("/obj/effect/proc_holder/spell/targeted/summonitem"),
	icon_state: "booksummons",
	desc: "This book is bright and garish, very hard to miss.",
});

// /obj/item/weapon/spellbook/oneuse/summonitem/proc/recoil  (code/game/gamemodes/wizard/spellbook.dm:896)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/summonitem/proc/recoil", function* recoil(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ suddenly vanishes!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(6708, "/obj/item/weapon/spellbook/oneuse/random", "/obj/item/weapon/spellbook/oneuse", {});

// /obj/item/weapon/spellbook/oneuse/random/proc/Initialize  (code/game/gamemodes/wizard/spellbook.dm:901)  may sleep
rt.def("/obj/item/weapon/spellbook/oneuse/random/proc/Initialize", function* Initialize(f: Frame) {
	let real_type: Value = null;
	f.vars = () => [real_type];
	yield* g.callSuper(f, [], rt.Args.Same);
	real_type = rt.op(f, "PickUnweighted", [1], [subtract(subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/weapon/spellbook/oneuse")])), T("/obj/item/weapon/spellbook/oneuse")), rt.gl("banned_spells"))]);
	yield* g.new_(f, live(real_type), [rt.sv(f, "loc")]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
