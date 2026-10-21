// From code/datums/antagonists/devil.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalallDevils  (code/datums/antagonists/devil.dm:16)
rt.def("/datum/controller/global_vars/proc/InitGlobalallDevils", function InitGlobalallDevils(f: Frame) {
	rt.setGl("allDevils", rt.list());
	rt.modSrcVar(f, "gvars_datum_init_order", "allDevils", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGloballawlorify  (code/datums/antagonists/devil.dm:17)
rt.def("/datum/controller/global_vars/proc/InitGloballawlorify", function InitGloballawlorify(f: Frame) {
	rt.setGl("lawlorify", rt.alist(f, [1, rt.alist(f, ["food", "This devil seems to always offer its victims food before slaughtering them.", "fiddle", "This devil will never turn down a musical challenge.", "danceoff", "This devil will never turn down a dance off.", "greet", "This devil seems to only be able to converse with people it knows the name of.", "presenceknown", "This devil seems to be unable to attack from stealth.", "sayname", "He will always chant his name upon killing someone.", "announcekill", "This devil always loudly announces his kills for the world to hear.", "answername", "This devil always responds to his truename.", "silver", "Silver seems to gravely injure this devil.", "salt", "Throwing salt at this devil will hinder his ability to use infernal powers temporarily.", "light", "Bright flashes will disorient the devil, likely causing him to flee.", "iron", "Cold iron will slowly injure him, until he can purge it from his system.", "whiteclothes", "Wearing clean white clothing will help ward off this devil.", "harvest", "Presenting the labors of a harvest will disrupt the devil.", "toolbox", "That which holds the means of creation also holds the means of the devil's undoing.", "hurtwoman", "This devil seems to prefer hunting men.", "chapel", "This devil avoids holy ground.", "hurtpriest", "The annointed clergy appear to be immune to his powers.", "avoidwater", "The devil seems to have some sort of aversion to water, though it does not appear to harm him.", "strikeunconcious", "This devil only shows interest in those who are awake.", "hurtlizard", "This devil will not strike a lizardman first.", "hurtanimal", "This devil avoids hurting animals.", "water", "To banish the devil, you must infuse its body with holy water.", "coffin", "This devil will return to life if its remains are not placed within a coffin.", "embalm", "To banish the devil, you must inject its lifeless body with embalming fluid.", "runes", "This devil will resurrect after death, unless its remains are within a rune.", "candles", "A large number of nearby lit candles will prevent it from resurrecting.", "destruction", "Its corpse must be utterly destroyed to prevent resurrection.", "funeral", "If clad in funeral garments, this devil will be unable to resurrect.  Should the clothes not fit, lay them gently on top of the devil's corpse."]), 2, rt.alist(f, ["food", "When not acting in self defense, you must always offer your victim food before harming them.", "fiddle", "When not in immediate danger, if you are challenged to a musical duel, you must accept it.  You are not obligated to duel the same person twice.", "danceoff", "When not in immediate danger, if you are challenged to a dance off, you must accept it. You are not obligated to face off with the same person twice.", "greet", "You must always greet other people by their last name before talking with them.", "presenceknown", "You must always make your presence known before attacking.", "sayname", "You must always say your true name after you kill someone.", "announcekill", "Upon killing someone, you must make your deed known to all within earshot, over comms if reasonably possible.", "answername", "If you are not under attack, you must always respond to your true name.", "hurtwoman", "You must never harm a female outside of self defense.", "chapel", "You must never attempt to enter the chapel.", "hurtpriest", "You must never attack a priest.", "avoidwater", "You must never willingly touch a wet surface.", "strikeunconcious", "You must never strike an unconscious person.", "hurtlizard", "You must never harm a lizardman outside of self defense.", "hurtanimal", "You must never harm a non-sentient creature or robot outside of self defense.", "silver", "Silver, in all of its forms shall be your downfall.", "salt", "Salt will disrupt your magical abilities.", "light", "Blinding lights will prevent you from using offensive powers for a time.", "iron", "Cold wrought iron shall act as poison to you.", "whiteclothes", "Those clad in pristine white garments will strike you true.", "harvest", "The fruits of the harvest shall be your downfall.", "toolbox", "Toolboxes are bad news for you, for some reason.", "water", "If your corpse is filled with holy water, you will be unable to resurrect.", "coffin", "If your corpse is in a coffin, you will be unable to resurrect.", "embalm", "If your corpse is embalmed, you will be unable to resurrect.", "runes", "If your corpse is placed within a rune, you will be unable to resurrect.", "candles", "If your corpse is near lit candles, you will be unable to resurrect.", "destruction", "If your corpse is destroyed, you will be unable to resurrect.", "funeral", "If your corpse is clad in funeral garments, you will be unable to resurrect."])]));
	rt.modSrcVar(f, "gvars_datum_init_order", "lawlorify", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldevil_pre_title  (code/datums/antagonists/devil.dm:83)
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_pre_title", function InitGlobaldevil_pre_title(f: Frame) {
	rt.setGl("devil_pre_title", rt.list("Dark ", "Hellish ", "Fallen ", "Fiery ", "Sinful ", "Blood ", "Fluffy "));
	rt.modSrcVar(f, "gvars_datum_init_order", "devil_pre_title", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldevil_title  (code/datums/antagonists/devil.dm:84)
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_title", function InitGlobaldevil_title(f: Frame) {
	rt.setGl("devil_title", rt.list("Lord ", "Prelate ", "Count ", "Viscount ", "Vizier ", "Elder ", "Adept "));
	rt.modSrcVar(f, "gvars_datum_init_order", "devil_title", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldevil_syllable  (code/datums/antagonists/devil.dm:85)
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_syllable", function InitGlobaldevil_syllable(f: Frame) {
	rt.setGl("devil_syllable", rt.list("hal", "ve", "odr", "neit", "ci", "quon", "mya", "folth", "wren", "geyr", "hil", "niet", "twou", "phi", "coa"));
	rt.modSrcVar(f, "gvars_datum_init_order", "devil_syllable", add);
	return f.dot;
});

// /datum/controller/global_vars/proc/InitGlobaldevil_suffix  (code/datums/antagonists/devil.dm:86)
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_suffix", function InitGlobaldevil_suffix(f: Frame) {
	rt.setGl("devil_suffix", rt.list(" the Red", " the Soulless", " the Master", ", the Lord of all things", ", Jr."));
	rt.modSrcVar(f, "gvars_datum_init_order", "devil_suffix", add);
	return f.dot;
});

rt.type(912, "/datum/antagonist/devil", "/datum/antagonist", {
	obligation: null,
	ban: null,
	bane: null,
	banish: null,
	truename: null,
	reviveNumber: 0,
	form: 0,
	ascendable: 0,
	soulsOwned: null,
	delete_on_death: 0,
	name: "Devil",
}, { global: { devil_spells: 949 } });

// /datum/antagonist/devil/proc/<init>  (code/datums/antagonists/devil.dm:95)
rt.def("/datum/antagonist/devil/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "soulsOwned", rt.new_(f, T("/list"), []));
	return f.dot;
});

// /datum/antagonist/devil/proc/New  (code/datums/antagonists/devil.dm:114)
rt.def("/datum/antagonist/devil/proc/New", function New(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "truename", rt.call(f, P("/proc/randomDevilName"), null, []));
	rt.setSv(f, "ban", rt.call(f, P("/proc/randomdevilban"), null, []));
	rt.setSv(f, "bane", rt.call(f, P("/proc/randomdevilbane"), null, []));
	rt.setSv(f, "obligation", rt.call(f, P("/proc/randomdevilobligation"), null, []));
	rt.setSv(f, "banish", rt.call(f, P("/proc/randomdevilbanish"), null, []));
	rt.setAt(rt.gl("allDevils"), rt.call(f, P("/proc/lowertext"), null, [rt.sv(f, "truename")]), live(f.src));
	return f.dot;
});

// /proc/devilInfo  (code/datums/antagonists/devil.dm:124)
rt.def("/proc/devilInfo", function devilInfo(f: Frame, name: Value) {
	let devil: Value = null;
	f.vars = () => [devil];
	if (truthy(rt.index(rt.gl("allDevils"), rt.call(f, P("/proc/lowertext"), null, [live(name)])))) {
		return rt.index(rt.gl("allDevils"), rt.call(f, P("/proc/lowertext"), null, [live(name)]));
	}
	devil = rt.new_(f, T("/datum/fakeDevil"), [live(name)]);
	rt.setAt(rt.gl("allDevils"), rt.call(f, P("/proc/lowertext"), null, [live(name)]), live(devil));
	return live(devil);
});

// /proc/randomDevilName  (code/datums/antagonists/devil.dm:132)
rt.def("/proc/randomDevilName", function randomDevilName(f: Frame) {
	let name: Value = null, probability: Value = null;
	f.vars = () => [name, probability];
	name = "";
	if (truthy(rt.op(f, "Prob", [], [65]))) {
		if (truthy(rt.op(f, "Prob", [], [35]))) {
			name = rt.op(f, "PickUnweighted", [1], [rt.gl("devil_pre_title")]);
		}
		name = rt.modify(live(name), rt.op(f, "PickUnweighted", [1], [rt.gl("devil_title")]), add);
	}
	probability = 100;
	name = rt.modify(live(name), rt.op(f, "PickUnweighted", [1], [rt.gl("devil_syllable")]), add);
	while (truthy(rt.op(f, "Prob", [], [live(probability)]))) {
		name = rt.modify(live(name), rt.op(f, "PickUnweighted", [1], [rt.gl("devil_syllable")]), add);
		(probability = rt.modify(live(probability), 20, subtract));
	}
	if (truthy(rt.op(f, "Prob", [], [40]))) {
		name = rt.modify(live(name), rt.op(f, "PickUnweighted", [1], [rt.gl("devil_suffix")]), add);
	}
	return live(name);
});

// /proc/randomdevilobligation  (code/datums/antagonists/devil.dm:147)
rt.def("/proc/randomdevilobligation", function randomdevilobligation(f: Frame) {
	return rt.op(f, "PickUnweighted", [8], ["food", "fiddle", "danceoff", "greet", "presenceknown", "sayname", "announcekill", "answername"]);
});

// /proc/randomdevilban  (code/datums/antagonists/devil.dm:150)
rt.def("/proc/randomdevilban", function randomdevilban(f: Frame) {
	return rt.op(f, "PickUnweighted", [7], ["hurtwoman", "chapel", "hurtpriest", "avoidwater", "strikeunconcious", "hurtlizard", "hurtanimal"]);
});

// /proc/randomdevilbane  (code/datums/antagonists/devil.dm:153)
rt.def("/proc/randomdevilbane", function randomdevilbane(f: Frame) {
	return rt.op(f, "PickUnweighted", [7], ["salt", "light", "iron", "whiteclothes", "silver", "harvest", "toolbox"]);
});

// /proc/randomdevilbanish  (code/datums/antagonists/devil.dm:156)
rt.def("/proc/randomdevilbanish", function randomdevilbanish(f: Frame) {
	return rt.op(f, "PickUnweighted", [7], ["water", "coffin", "embalm", "runes", "candles", "destruction", "funeral"]);
});

// /datum/antagonist/devil/proc/add_soul  (code/datums/antagonists/devil.dm:159)  may sleep
rt.def("/datum/antagonist/devil/proc/add_soul", function* add_soul(f: Frame, soul: Value) {
	let $0: any;
	f.vars = () => [soul, $0];
	if (truthy((yield* g.callName(f, rt.sv(f, "soulsOwned"), "Find", [live(soul)])))) {
		return live(f.dot);
	}
	rt.modSrcVar(f, "soulsOwned", live(soul), add);
	rt.setFv(f, "nutrition", rt.fv(f, "current", rt.sv(f, "owner")), 550);
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>You feel satiated as you received a new soul.</span>"]);
	yield* g.srcCall(f, "update_hud");
	$0 = subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber"));
	if ($0 === 0) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>Your hellish powers have been restored."]);
		yield* g.srcCall(f, "give_appropriate_spells");
	} else if ($0 === 3) {
		yield* g.srcCall(f, "increase_blood_lizard");
	} else if ($0 === 7) {
		yield* g.srcCall(f, "increase_true_devil");
	} else if ($0 === 12) {
		yield* g.srcCall(f, "increase_arch_devil");
	}
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/remove_soul  (code/datums/antagonists/devil.dm:177)  may sleep
rt.def("/datum/antagonist/devil/proc/remove_soul", function* remove_soul(f: Frame, soul: Value) {
	f.vars = () => [soul];
	if (!truthy((yield* g.callName(f, rt.sv(f, "soulsOwned"), "Remove", [live(soul)])))) return f.dot;
	yield* g.srcCall(f, "check_regression");
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>You feel as though a soul has slipped from your grasp.</span>"]);
	yield* g.srcCall(f, "update_hud");
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/check_regression  (code/datums/antagonists/devil.dm:183)  may sleep
rt.def("/datum/antagonist/devil/proc/check_regression", function* check_regression(f: Frame) {
	if (isEqual(rt.sv(f, "form"), 3)) {
		return live(f.dot);
	}
	if ((isEqual(rt.sv(f, "form"), 2) && rt.lt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 7))) {
		yield* g.srcCall(f, "regress_blood_lizard");
	}
	if ((isEqual(rt.sv(f, "form"), 1) && rt.lt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 3))) {
		yield* g.srcCall(f, "regress_humanoid");
	}
	if (!rt.lt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 0)) return f.dot;
	yield* g.srcCall(f, "remove_spells");
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>As punishment for your failures, all of your powers except contract creation have been revoked."]);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/regress_humanoid  (code/datums/antagonists/devil.dm:195)  may sleep
rt.def("/datum/antagonist/devil/proc/regress_humanoid", function* regress_humanoid(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>Your powers weaken, have more contracts be signed to regain power."]);
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = rt.fv(f, "current", rt.sv(f, "owner"))), "set_species", [T("/datum/species/human"), 1]);
		yield* g.callName(f, live(H), "regenerate_icons", []);
	}
	yield* g.srcCall(f, "give_appropriate_spells");
	if (truthy((rt.istype(rt.gv(f, "loc", rt.fv(f, "current", rt.sv(f, "owner"))), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) {
		yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "forceMove", [rt.getStep(f, rt.fv(f, "current", rt.sv(f, "owner")), 0)]);
	}
	rt.setSv(f, "form", 0);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/regress_blood_lizard  (code/datums/antagonists/devil.dm:207)  may sleep
rt.def("/datum/antagonist/devil/proc/regress_blood_lizard", function* regress_blood_lizard(f: Frame) {
	let D: Value = null;
	f.vars = () => [D];
	yield* g.call(f, P("/proc/to_chat"), null, [(D = rt.fv(f, "current", rt.sv(f, "owner"))), "<span class='warning'>Your powers weaken, have more contracts be signed to regain power."]);
	rt.setFv(f, "loc", rt.fv(f, "oldform", live(D)), rt.fv(f, "loc", live(D)));
	yield* g.callName(f, rt.sv(f, "owner"), "transfer_to", [rt.fv(f, "oldform", live(D))]);
	yield* g.srcCall(f, "give_appropriate_spells");
	yield* g.call(f, P("/proc/qdel"), null, [live(D)]);
	rt.setSv(f, "form", 1);
	yield* g.srcCall(f, "update_hud");
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/increase_blood_lizard  (code/datums/antagonists/devil.dm:217)  may sleep
rt.def("/datum/antagonist/devil/proc/increase_blood_lizard", function* increase_blood_lizard(f: Frame) {
	let H: Value = null;
	f.vars = () => [H];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>You feel as though your humanoid form is about to shed.  You will soon turn into a blood lizard."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = rt.fv(f, "current", rt.sv(f, "owner"))), "set_species", [T("/datum/species/lizard"), 1]);
		rt.setFv(f, "underwear", live(H), "Nude");
		rt.setFv(f, "undershirt", live(H), "Nude");
		rt.setFv(f, "socks", live(H), "Nude");
		rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor", "511");
		yield* g.callName(f, live(H), "regenerate_icons", []);
	} else {
		rt.setFv(f, "color", rt.fv(f, "current", rt.sv(f, "owner")), "#501010");
	}
	yield* g.srcCall(f, "give_appropriate_spells");
	rt.setSv(f, "form", 1);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/increase_true_devil  (code/datums/antagonists/devil.dm:235)  may sleep
rt.def("/datum/antagonist/devil/proc/increase_true_devil", function* increase_true_devil(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>You feel as though your current form is about to shed.  You will soon turn into a true devil."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	(rt.modField(f, (A = (yield* g.new_(f, T("/mob/living/carbon/true_devil"), [rt.gv(f, "loc", rt.fv(f, "current", rt.sv(f, "owner")))]))), "faction", "hell", rt.bitOr));
	rt.setFv(f, "loc", rt.fv(f, "current", rt.sv(f, "owner")), live(A));
	rt.setFv(f, "oldform", live(A), rt.fv(f, "current", rt.sv(f, "owner")));
	yield* g.callName(f, rt.sv(f, "owner"), "transfer_to", [live(A)]);
	yield* g.callName(f, live(A), "set_name", []);
	yield* g.srcCall(f, "give_appropriate_spells");
	rt.setSv(f, "form", 2);
	yield* g.srcCall(f, "update_hud");
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/increase_arch_devil  (code/datums/antagonists/devil.dm:248)  may sleep
rt.def("/datum/antagonist/devil/proc/increase_arch_devil", function* increase_arch_devil(f: Frame) {
	let D: Value = null, A: Value = null;
	f.vars = () => [D, A];
	if (!truthy(rt.sv(f, "ascendable"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [(D = rt.fv(f, "current", rt.sv(f, "owner"))), "<span class='warning'>You feel as though your form is about to ascend."]);
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀'s skin begins to erupt with spikes.</span>", [live(D)]), "<span class='warning'>Your flesh begins creating a shield around yourself.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [100]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>The horns on ＀'s head slowly grow and elongate.</span>", [live(D)]), "<span class='warning'>Your body continues to mutate. Your telepathic abilities grow.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [90]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(D), "visible_message", [fmt("<span class='warning'>＀'s body begins to violently stretch and contort.</span>", [live(D)]), "<span class='warning'>You begin to rend apart the final barriers to ultimate power.</span>"]);
	yield* g.call(f, P("/proc/sleep"), null, [40]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(D), "<i><b>Yes!</b></i>"]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(D), "<i><b><span class='big'>YES!!</span></b></i>"]);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(D), "<i><b><span class='reallybig'>YE--</span></b></i>"]);
	yield* g.call(f, P("/proc/sleep"), null, [1]);
	if (!truthy(live(D))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [rt.world(), "<font size=5><span class='danger'><b>\"SLOTH, WRATH, GLUTTONY, ACEDIA, ENVY, GREED, PRIDE! FIRES OF HELL AWAKEN!!\"</font></span>"]);
	rt.op(f, "OutputReference", [rt.R.world], [rt.rsc("sound/hallucinations/veryfar_noise.ogg")], false);
	yield* g.srcCall(f, "give_appropriate_spells");
	yield* g.callName(f, live(D), "convert_to_archdevil", []);
	if (truthy((rt.istype(rt.fv(f, "loc", live(D)), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) {
		yield* g.callName(f, live(D), "forceMove", [rt.getStep(f, live(D), 0)]);
	}
	if (truthy((A = (yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "current", rt.sv(f, "owner"))]))))) {
		yield* g.call(f, P("/proc/notify_ghosts"), null, [null, fmt("An arch devil has ascended in ％！. Reach out to the devil to be given a new shell for your soul.", [rt.fv(f, "name", live(A))]), "source", rt.fv(f, "current", rt.sv(f, "owner")), "action", "attack"], rt.Args.Named);
	}
	yield* g.call(f, P("/proc/sleep"), null, [50]);
	if (!truthy(rt.gv(f, "devil_ascended", rt.fv(f, "mode", rt.gl("SSticker"))))) {
		yield* g.callName(f, rt.fv(f, "emergency", rt.gl("SSshuttle")), "request", [null, null, "set_coefficient", 0.30000001192092896], rt.Args.Named);
	}
	rt.incField(f, rt.fv(f, "mode", rt.gl("SSticker")), "devil_ascended", 1, true);
	rt.setSv(f, "form", 3);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/remove_spells  (code/datums/antagonists/devil.dm:298)  may sleep
rt.def("/datum/antagonist/devil/proc/remove_spells", function* remove_spells(f: Frame) {
	let X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [X, S, $e];
	X = null;
	rt.forList(f, 0, rt.fv(f, "spell_list", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(S = live(X)), rt.gl("devil_spells")])))) {
			yield* g.callName(f, rt.sv(f, "owner"), "RemoveSpell", [live(S)]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_summon_contract  (code/datums/antagonists/devil.dm:304)  may sleep
rt.def("/datum/antagonist/devil/proc/give_summon_contract", function* give_summon_contract(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/summon_contract"), [null]))]);
	if (isEqual(rt.sv(f, "obligation"), "fiddle")) {
		yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/violin"), [null]))]);
	} else {
		if (!isEqual(rt.sv(f, "obligation"), "danceoff")) return f.dot;
		yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/summon_dancefloor"), [null]))]);
	}
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_appropriate_spells  (code/datums/antagonists/devil.dm:311)  may sleep
rt.def("/datum/antagonist/devil/proc/give_appropriate_spells", function* give_appropriate_spells(f: Frame) {
	yield* g.srcCall(f, "remove_spells");
	yield* g.srcCall(f, "give_summon_contract");
	if ((rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 12) && truthy(rt.sv(f, "ascendable")))) {
		yield* g.srcCall(f, "give_arch_spells");
	} else {
		if (rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 7)) {
			yield* g.srcCall(f, "give_true_spells");
		} else {
			if (rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 3)) {
				yield* g.srcCall(f, "give_blood_spells");
			} else {
				if (!rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 0)) return f.dot;
				yield* g.srcCall(f, "give_base_spells");
			}
		}
	}
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_base_spells  (code/datums/antagonists/devil.dm:323)  may sleep
rt.def("/datum/antagonist/devil/proc/give_base_spells", function* give_base_spells(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork"), [null]))]);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_blood_spells  (code/datums/antagonists/devil.dm:327)  may sleep
rt.def("/datum/antagonist/devil/proc/give_blood_spells", function* give_blood_spells(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/infernal_jaunt"), [null]))]);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_true_spells  (code/datums/antagonists/devil.dm:332)  may sleep
rt.def("/datum/antagonist/devil/proc/give_true_spells", function* give_true_spells(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/greater"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/infernal_jaunt"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/sintouch"), [null]))]);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/give_arch_spells  (code/datums/antagonists/devil.dm:338)  may sleep
rt.def("/datum/antagonist/devil/proc/give_arch_spells", function* give_arch_spells(f: Frame) {
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/ascended"), [null]))]);
	yield* g.callName(f, rt.sv(f, "owner"), "AddSpell", [(yield* g.new_(f, T("/obj/effect/proc_holder/spell/targeted/sintouch/ascended"), [null]))]);
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/beginResurrectionCheck  (code/datums/antagonists/devil.dm:342)  may sleep
rt.def("/datum/antagonist/devil/proc/beginResurrectionCheck", function* beginResurrectionCheck(f: Frame, body: Value) {
	f.vars = () => [body];
	if (rt.gt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Your body has been damaged to the point that you may no longer use it.  At the cost of some of your power, you will return to life soon.  Remain in your body.</span>"]);
		yield* g.call(f, P("/proc/sleep"), null, [600]);
		if ((!truthy(live(body)) || isEqual(rt.fv(f, "stat", live(body)), 2))) {
			if (rt.gt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 0)) {
				if (truthy((yield* g.srcCall(f, "check_banishment", live(body))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Unfortunately, the mortals have finished a ritual that prevents your resurrection.</span>"]);
					return -1;
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>WE LIVE AGAIN!</span>"]);
					return (yield* g.srcCall(f, "hellish_resurrection", live(body)));
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Unfortunately, the power that stemmed from your contracts has been extinguished.  You no longer have enough power to resurrect.</span>"]);
				return -1;
			}
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='danger'> You seem to have resurrected without your hellish powers.</span>"]);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Your hellish powers are too weak to resurrect yourself.</span>"]);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// /datum/antagonist/devil/proc/check_banishment  (code/datums/antagonists/devil.dm:362)
rt.def("/datum/antagonist/devil/proc/check_banishment", function check_banishment(f: Frame, body: Value) {
	let H: Value = null, R: Value = null, count: Value = null, C: Value = null, B: Value = null;
	let $0: any, $e: any;
	f.vars = () => [H, R, count, C, B, $0, $e];
	$0 = rt.sv(f, "banish");
	if ($0 === "water") {
		if (truthy((rt.istype(live(body), T("/mob/living/carbon")) ? 1 : 0))) {
			return rt.callName(f, rt.gv(f, "reagents", (H = live(body))), "has_reagent", ["holy water"]);
		}
		return 0;
	} else if ($0 === "coffin") {
		return (live(body) && (rt.istype(rt.fv(f, "loc", live(body)), T("/obj/structure/closet/coffin")) ? 1 : 0));
	} else if ($0 === "embalm") {
		if (truthy((rt.istype(live(body), T("/mob/living/carbon")) ? 1 : 0))) {
			return rt.callName(f, rt.gv(f, "reagents", (H = live(body))), "has_reagent", ["formaldehyde"]);
		}
		return 0;
	} else if ($0 === "runes") {
		if (truthy(live(body))) {
			R = null;
			rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [0, live(body)]), T("/obj/effect/decal/cleanable/crayon"));
			while (($e = rt.next(f, 0)) !== undefined) {
				R = $e;
				if (isEqual(rt.fv(f, "name", live(R)), "rune")) {
					return 1;
				}
			}
			rt.endFor(f, 0);
		}
		return 0;
	} else if ($0 === "candles") {
		if (truthy(live(body))) {
			count = 0;
			C = null;
			rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [1, live(body)]), T("/obj/item/candle"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				count = rt.modify(live(count), rt.fv(f, "lit", live(C)), add);
			}
			rt.endFor(f, 0);
			if (rt.ge(live(count), 4)) {
				return 1;
			}
		}
		return 0;
	} else if ($0 === "destruction") {
		if (truthy(live(body))) {
			return 0;
		}
		return 1;
	} else if ($0 === "funeral") {
		if (truthy((rt.istype(live(body), T("/mob/living/carbon/human")) ? 1 : 0))) {
			if ((truthy(rt.gv(f, "w_uniform", (H = live(body)))) && truthy((rt.istype(rt.fv(f, "w_uniform", live(H)), T("/obj/item/clothing/under/burial")) ? 1 : 0)))) {
				return 1;
			}
			return 0;
		} else {
			B = null;
			rt.forList(f, 0, rt.call(f, P("/proc/range"), null, [0, live(body)]), T("/obj/item/clothing/under/burial"));
			while (($e = rt.next(f, 0)) !== undefined) {
				B = $e;
				if (isEqual(rt.fv(f, "loc", live(B)), rt.getStep(f, live(B), 0))) {
					return 1;
				}
			}
			rt.endFor(f, 0);
			return 0;
		}
	}
	return f.dot;
});

// /datum/antagonist/devil/proc/hellish_resurrection  (code/datums/antagonists/devil.dm:406)  may sleep
rt.def("/datum/antagonist/devil/proc/hellish_resurrection", function* hellish_resurrection(f: Frame, body: Value) {
	let D: Value = null;
	f.vars = () => [body, D];
	yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ (true name is: ＀) is resurrecting using hellish energy.</a>", [rt.fv(f, "name", rt.sv(f, "owner")), rt.sv(f, "truename")])]);
	if ((rt.lt(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 12) || !truthy(rt.sv(f, "ascendable")))) {
		rt.modSrcVar(f, "reviveNumber", 2, add);
		yield* g.srcCall(f, "update_hud");
	}
	if (truthy(live(body))) {
		yield* g.callName(f, live(body), "revive", [1, 0]);
		if (truthy((rt.istype(rt.fv(f, "loc", live(body)), T("/obj/effect/dummy/slaughter")) ? 1 : 0))) {
			yield* g.callName(f, live(body), "forceMove", [rt.getStep(f, live(body), 0)]);
		}
		if (truthy((rt.istype(live(body), T("/mob/living/carbon/true_devil")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "oldform", (D = live(body))))) {
				yield* g.callName(f, rt.fv(f, "oldform", live(D)), "revive", [1, 0]);
			}
		}
		if (isEqual(rt.fv(f, "stat", live(body)), 2)) {
			yield* g.srcCall(f, "create_new_body");
		}
	} else {
		yield* g.srcCall(f, "create_new_body");
	}
	yield* g.srcCall(f, "check_regression");
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/create_new_body  (code/datums/antagonists/devil.dm:425)  may sleep
rt.def("/datum/antagonist/devil/proc/create_new_body", function* create_new_body(f: Frame) {
	let targetturf: Value = null, currentMob: Value = null, H: Value = null, A: Value = null;
	f.vars = () => [targetturf, currentMob, H, A];
	if (rt.gt(rt.len(f, rt.gl("blobstart")), 0)) {
		targetturf = rt.getStep(f, rt.op(f, "PickUnweighted", [1], [rt.gl("blobstart")]), 0);
		if (!truthy((currentMob = rt.fv(f, "current", rt.sv(f, "owner"))))) {
			if (!truthy((currentMob = (yield* g.callName(f, rt.sv(f, "owner"), "get_ghost", []))))) {
				yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀'s devil resurrection failed due to client logoff.  Aborting.", [rt.fv(f, "name", rt.sv(f, "owner"))])]);
				return -1;
			}
		}
		if (!isEqual(rt.fv(f, "mind", live(currentMob)), rt.sv(f, "owner"))) {
			yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀'s devil resurrection failed due to becoming a new mob.  Aborting.", [rt.fv(f, "name", rt.sv(f, "owner"))])]);
			return -1;
		}
		yield* g.callName(f, live(currentMob), "change_mob_type", [T("/mob/living/carbon/human"), live(targetturf), null, 1]);
		yield* g.callName(f, (H = rt.fv(f, "current", rt.sv(f, "owner"))), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/under/lawyer/black"), [live(H)])), 14]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/clothing/shoes/laceup"), [live(H)])), 12]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/storage/briefcase"), [live(H)])), 4]);
		yield* g.callName(f, live(H), "equip_to_slot_or_del", [(yield* g.new_(f, T("/obj/item/weapon/pen"), [live(H)])), 15]);
		if (rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 3)) {
			yield* g.callName(f, live(H), "set_species", [T("/datum/species/lizard"), 1]);
			rt.setFv(f, "underwear", live(H), "Nude");
			rt.setFv(f, "undershirt", live(H), "Nude");
			rt.setFv(f, "socks", live(H), "Nude");
			rt.setAt(rt.gv(f, "features", rt.fv(f, "dna", live(H))), "mcolor", "511");
			yield* g.callName(f, live(H), "regenerate_icons", []);
			if (rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 7)) {
				(rt.modField(f, (A = (yield* g.new_(f, T("/mob/living/carbon/true_devil"), [live(targetturf)]))), "faction", "hell", rt.bitOr));
				yield* g.callName(f, live(H), "forceMove", [live(A)]);
				rt.setFv(f, "oldform", live(A), live(H));
				yield* g.callName(f, rt.sv(f, "owner"), "transfer_to", [live(A), 1]);
				yield* g.callName(f, live(A), "set_name", []);
				if ((rt.ge(subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber")), 12) && truthy(rt.sv(f, "ascendable")))) {
					yield* g.callName(f, live(A), "convert_to_archdevil", []);
				}
			}
		}
	} else {
		rt.throw_(f, (yield* g.new_(f, T("/exception"), ["Unable to find a blobstart landmark for hellish resurrection", "code/datums/antagonists/devil.dm", 459])));
	}
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/update_hud  (code/datums/antagonists/devil.dm:463)
rt.def("/datum/antagonist/devil/proc/update_hud", function update_hud(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	if (!truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!(truthy(rt.gv(f, "hud_used", (C = rt.fv(f, "current", rt.sv(f, "owner"))))) && truthy(rt.gv(f, "devilsouldisplay", rt.fv(f, "hud_used", live(C)))))) return f.dot;
	rt.callName(f, rt.gv(f, "devilsouldisplay", rt.fv(f, "hud_used", live(C))), "update_counter", [subtract(rt.len(f, rt.sv(f, "soulsOwned")), rt.sv(f, "reviveNumber"))]);
	return f.dot;
});

// /datum/antagonist/devil/proc/greet  (code/datums/antagonists/devil.dm:469)
rt.def("/datum/antagonist/devil/proc/greet", function greet(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), fmt("<span class='warning'><b>You remember your link to the infernal.  You are ＀, an agent of hell, a devil.  And you were sent to the plane of creation for a reason.  A greater purpose.  Convince the crew to sin, and embroiden Hell's grasp.</b></span>", [rt.sv(f, "truename")])]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'><b>However, your infernal form is not without weaknesses.</b></span>"]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "You may not use violence to coerce someone into selling their soul."]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "You may not directly and knowingly physically harm a devil, other than yourself."]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "bane"))]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "ban"))]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "obligation"))]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "banish"))]);
	rt.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='warning'>Remember, the crew can research your weaknesses if they find out your devil name.</span><br>"]);
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /datum/antagonist/devil/proc/on_gain  (code/datums/antagonists/devil.dm:481)  may sleep
rt.def("/datum/antagonist/devil/proc/on_gain", function* on_gain(f: Frame) {
	let robot_devil: Value = null, laws: Value = null, S: Value = null;
	f.vars = () => [robot_devil, laws, S];
	yield* g.callName(f, rt.sv(f, "owner"), "store_memory", [fmt("Your devilic true name is ＀<br>＀<br>You may not use violence to coerce someone into selling their soul.<br>You may not directly and knowingly physically harm a devil, other than yourself.<br>＀<br>＀<br>＀<br>", [rt.sv(f, "truename"), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "ban")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "bane")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "obligation")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "banish"))])]);
	if (truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/silicon")) ? 1 : 0))) {
		robot_devil = rt.fv(f, "current", rt.sv(f, "owner"));
		laws = rt.list("You may not use violence to coerce someone into selling their soul.", "You may not directly and knowingly physically harm a devil, other than yourself.", rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "ban")), rt.index(rt.index(rt.gl("lawlorify"), 2), rt.sv(f, "obligation")), "Accomplish your objectives at all costs.");
		yield* g.callName(f, live(robot_devil), "set_law_sixsixsix", [live(laws)]);
	}
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	if ((isEqual(rt.fv(f, "assigned_role", rt.sv(f, "owner")), "Clown") && truthy((rt.istype(rt.fv(f, "current", rt.sv(f, "owner")), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [(S = rt.fv(f, "current", rt.sv(f, "owner"))), "<span class='notice'>Your infernal nature has allowed you to overcome your clownishness.</span>"]);
		yield* g.callName(f, rt.fv(f, "dna", live(S)), "remove_mutation", ["Clumsiness"]);
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/on_removal  (code/datums/antagonists/devil.dm:494)  may sleep
rt.def("/datum/antagonist/devil/proc/on_removal", function* on_removal(f: Frame) {
	yield* g.call(f, P("/proc/to_chat"), null, [rt.fv(f, "current", rt.sv(f, "owner")), "<span class='userdanger'>Your infernal link has been severed! You are no longer a devil!</span>"]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /datum/antagonist/devil/proc/apply_innate_effects  (code/datums/antagonists/devil.dm:498)  may sleep
rt.def("/datum/antagonist/devil/proc/apply_innate_effects", function* apply_innate_effects(f: Frame) {
	yield* g.srcCall(f, "give_appropriate_spells");
	yield* g.callName(f, rt.fv(f, "current", rt.sv(f, "owner")), "grant_all_languages", [1]);
	yield* g.srcCall(f, "update_hud");
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mob_override"] });

// /datum/antagonist/devil/proc/remove_innate_effects  (code/datums/antagonists/devil.dm:504)  may sleep
rt.def("/datum/antagonist/devil/proc/remove_innate_effects", function* remove_innate_effects(f: Frame) {
	let X: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [X, S, $e];
	X = null;
	rt.forList(f, 0, rt.fv(f, "spell_list", rt.sv(f, "owner")));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [(S = live(X)), rt.gl("devil_spells")])))) {
			yield* g.callName(f, rt.sv(f, "owner"), "RemoveSpell", [live(S)]);
		}
	}
	rt.endFor(f, 0);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["mob_override"] });

rt.type(944, "/datum/fakeDevil", "/datum", {
	truename: null,
	bane: null,
	obligation: null,
	ban: null,
	banish: null,
	ascendable: null,
});

// /datum/fakeDevil/proc/New  (code/datums/antagonists/devil.dm:520)
rt.def("/datum/fakeDevil/proc/New", function New(f: Frame, name: Value) {
	f.vars = () => [name];
	if (live(name) === null) {
		name = rt.call(f, P("/proc/randomDevilName"), null, []);
	}
	rt.setSv(f, "truename", live(name));
	rt.setSv(f, "bane", rt.call(f, P("/proc/randomdevilbane"), null, []));
	rt.setSv(f, "obligation", rt.call(f, P("/proc/randomdevilobligation"), null, []));
	rt.setSv(f, "ban", rt.call(f, P("/proc/randomdevilban"), null, []));
	rt.setSv(f, "banish", rt.call(f, P("/proc/randomdevilbanish"), null, []));
	rt.setSv(f, "ascendable", rt.op(f, "Prob", [], [25]));
	return f.dot;
});
