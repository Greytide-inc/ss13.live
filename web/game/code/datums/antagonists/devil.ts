// Based on /tg/station's code/datums/antagonists/devil.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// devil.dm:16
rt.def("/datum/controller/global_vars/proc/InitGlobalallDevils", function InitGlobalallDevils(f: Frame) {
	GLOB.allDevils = list();
	this.gvars_datum_init_order += "allDevils";
	return f.dot;
});

// devil.dm:17
rt.def("/datum/controller/global_vars/proc/InitGloballawlorify", function InitGloballawlorify(f: Frame) {
	GLOB.lawlorify = rt.alist(f, [1, rt.alist(f, ["food", "This devil seems to always offer its victims food before slaughtering them.", "fiddle", "This devil will never turn down a musical challenge.", "danceoff", "This devil will never turn down a dance off.", "greet", "This devil seems to only be able to converse with people it knows the name of.", "presenceknown", "This devil seems to be unable to attack from stealth.", "sayname", "He will always chant his name upon killing someone.", "announcekill", "This devil always loudly announces his kills for the world to hear.", "answername", "This devil always responds to his truename.", "silver", "Silver seems to gravely injure this devil.", "salt", "Throwing salt at this devil will hinder his ability to use infernal powers temporarily.", "light", "Bright flashes will disorient the devil, likely causing him to flee.", "iron", "Cold iron will slowly injure him, until he can purge it from his system.", "whiteclothes", "Wearing clean white clothing will help ward off this devil.", "harvest", "Presenting the labors of a harvest will disrupt the devil.", "toolbox", "That which holds the means of creation also holds the means of the devil's undoing.", "hurtwoman", "This devil seems to prefer hunting men.", "chapel", "This devil avoids holy ground.", "hurtpriest", "The annointed clergy appear to be immune to his powers.", "avoidwater", "The devil seems to have some sort of aversion to water, though it does not appear to harm him.", "strikeunconcious", "This devil only shows interest in those who are awake.", "hurtlizard", "This devil will not strike a lizardman first.", "hurtanimal", "This devil avoids hurting animals.", "water", "To banish the devil, you must infuse its body with holy water.", "coffin", "This devil will return to life if its remains are not placed within a coffin.", "embalm", "To banish the devil, you must inject its lifeless body with embalming fluid.", "runes", "This devil will resurrect after death, unless its remains are within a rune.", "candles", "A large number of nearby lit candles will prevent it from resurrecting.", "destruction", "Its corpse must be utterly destroyed to prevent resurrection.", "funeral", "If clad in funeral garments, this devil will be unable to resurrect.  Should the clothes not fit, lay them gently on top of the devil's corpse."]), 2, rt.alist(f, ["food", "When not acting in self defense, you must always offer your victim food before harming them.", "fiddle", "When not in immediate danger, if you are challenged to a musical duel, you must accept it.  You are not obligated to duel the same person twice.", "danceoff", "When not in immediate danger, if you are challenged to a dance off, you must accept it. You are not obligated to face off with the same person twice.", "greet", "You must always greet other people by their last name before talking with them.", "presenceknown", "You must always make your presence known before attacking.", "sayname", "You must always say your true name after you kill someone.", "announcekill", "Upon killing someone, you must make your deed known to all within earshot, over comms if reasonably possible.", "answername", "If you are not under attack, you must always respond to your true name.", "hurtwoman", "You must never harm a female outside of self defense.", "chapel", "You must never attempt to enter the chapel.", "hurtpriest", "You must never attack a priest.", "avoidwater", "You must never willingly touch a wet surface.", "strikeunconcious", "You must never strike an unconscious person.", "hurtlizard", "You must never harm a lizardman outside of self defense.", "hurtanimal", "You must never harm a non-sentient creature or robot outside of self defense.", "silver", "Silver, in all of its forms shall be your downfall.", "salt", "Salt will disrupt your magical abilities.", "light", "Blinding lights will prevent you from using offensive powers for a time.", "iron", "Cold wrought iron shall act as poison to you.", "whiteclothes", "Those clad in pristine white garments will strike you true.", "harvest", "The fruits of the harvest shall be your downfall.", "toolbox", "Toolboxes are bad news for you, for some reason.", "water", "If your corpse is filled with holy water, you will be unable to resurrect.", "coffin", "If your corpse is in a coffin, you will be unable to resurrect.", "embalm", "If your corpse is embalmed, you will be unable to resurrect.", "runes", "If your corpse is placed within a rune, you will be unable to resurrect.", "candles", "If your corpse is near lit candles, you will be unable to resurrect.", "destruction", "If your corpse is destroyed, you will be unable to resurrect.", "funeral", "If your corpse is clad in funeral garments, you will be unable to resurrect."])]);
	this.gvars_datum_init_order += "lawlorify";
	return f.dot;
});

// devil.dm:83
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_pre_title", function InitGlobaldevil_pre_title(f: Frame) {
	GLOB.devil_pre_title = list("Dark ", "Hellish ", "Fallen ", "Fiery ", "Sinful ", "Blood ", "Fluffy ");
	this.gvars_datum_init_order += "devil_pre_title";
	return f.dot;
});

// devil.dm:84
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_title", function InitGlobaldevil_title(f: Frame) {
	GLOB.devil_title = list("Lord ", "Prelate ", "Count ", "Viscount ", "Vizier ", "Elder ", "Adept ");
	this.gvars_datum_init_order += "devil_title";
	return f.dot;
});

// devil.dm:85
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_syllable", function InitGlobaldevil_syllable(f: Frame) {
	GLOB.devil_syllable = list("hal", "ve", "odr", "neit", "ci", "quon", "mya", "folth", "wren", "geyr", "hil", "niet", "twou", "phi", "coa");
	this.gvars_datum_init_order += "devil_syllable";
	return f.dot;
});

// devil.dm:86
rt.def("/datum/controller/global_vars/proc/InitGlobaldevil_suffix", function InitGlobaldevil_suffix(f: Frame) {
	GLOB.devil_suffix = list(" the Red", " the Soulless", " the Master", ", the Lord of all things", ", Jr.");
	this.gvars_datum_init_order += "devil_suffix";
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

// devil.dm:95
rt.def("/datum/antagonist/devil/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.soulsOwned = new_(T("/list"));
	return f.dot;
});

// devil.dm:114
rt.def("/datum/antagonist/devil/proc/New", function New(f: Frame) {
	parent_proc();
	this.truename = randomDevilName();
	this.ban = randomdevilban();
	this.bane = randomdevilbane();
	this.obligation = randomdevilobligation();
	this.banish = randomdevilbanish();
	rt.setAt(GLOB.allDevils, lowertext(this.truename), this);
	return f.dot;
});

// devil.dm:124
rt.def("/proc/devilInfo", function devilInfo(f: Frame, name: Value) {
	if (rt.index(GLOB.allDevils, lowertext(name))) {
		return rt.index(GLOB.allDevils, lowertext(name));
	}
	let devil: Value = new_(T("/datum/fakeDevil"), name);
	rt.setAt(GLOB.allDevils, lowertext(name), devil);
	return devil;
});

// devil.dm:132
rt.def("/proc/randomDevilName", function randomDevilName(f: Frame) {
	let name: Value = "";
	if (prob(65)) {
		if (prob(35)) {
			name = pick(GLOB.devil_pre_title);
		}
		name += pick(GLOB.devil_title);
	}
	let probability: Value = 100;
	name += pick(GLOB.devil_syllable);
	while (prob(probability)) {
		name += pick(GLOB.devil_syllable);
		probability -= 20;
	}
	if (prob(40)) {
		name += pick(GLOB.devil_suffix);
	}
	return name;
});

// devil.dm:147
rt.def("/proc/randomdevilobligation", function randomdevilobligation(f: Frame) {
	return pick("food", "fiddle", "danceoff", "greet", "presenceknown", "sayname", "announcekill", "answername");
});

// devil.dm:150
rt.def("/proc/randomdevilban", function randomdevilban(f: Frame) {
	return pick("hurtwoman", "chapel", "hurtpriest", "avoidwater", "strikeunconcious", "hurtlizard", "hurtanimal");
});

// devil.dm:153
rt.def("/proc/randomdevilbane", function randomdevilbane(f: Frame) {
	return pick("salt", "light", "iron", "whiteclothes", "silver", "harvest", "toolbox");
});

// devil.dm:156
rt.def("/proc/randomdevilbanish", function randomdevilbanish(f: Frame) {
	return pick("water", "coffin", "embalm", "runes", "candles", "destruction", "funeral");
});

// devil.dm:159
rt.def("/datum/antagonist/devil/proc/add_soul", function* add_soul(f: Frame, soul: Value) {
	if (this.soulsOwned.Find(soul)) {
		return f.dot;
	}
	this.soulsOwned += soul;
	this.owner.current.nutrition = NUTRITION_LEVEL_FULL;
	to_chat(this.owner.current, "<span class='warning'>You feel satiated as you received a new soul.</span>");
	this.update_hud();
	const subject = rt.len(f, this.soulsOwned) - this.reviveNumber;
	if (subject === 0) {
		to_chat(this.owner.current, "<span class='warning'>Your hellish powers have been restored.");
		yield* this.give_appropriate_spells();
	} else if (subject === BLOOD_THRESHOLD) {
		yield* this.increase_blood_lizard();
	} else if (subject === TRUE_THRESHOLD) {
		yield* this.increase_true_devil();
	} else if (subject === ARCH_THRESHOLD) {
		yield* this.increase_arch_devil();
	}
	return f.dot;
}, true);

// devil.dm:177
rt.def("/datum/antagonist/devil/proc/remove_soul", function* remove_soul(f: Frame, soul: Value) {
	if (!(yield* this.soulsOwned.Remove(soul))) return f.dot;
	yield* this.check_regression();
	to_chat(this.owner.current, "<span class='warning'>You feel as though a soul has slipped from your grasp.</span>");
	this.update_hud();
	return f.dot;
}, true);

// devil.dm:183
rt.def("/datum/antagonist/devil/proc/check_regression", function* check_regression(f: Frame) {
	if (this.form == ARCH_DEVIL) {
		return f.dot;
	}
	if (this.form == TRUE_DEVIL && rt.len(f, this.soulsOwned) - this.reviveNumber < TRUE_THRESHOLD) {
		yield* this.regress_blood_lizard();
	}
	if (this.form == BLOOD_LIZARD && rt.len(f, this.soulsOwned) - this.reviveNumber < BLOOD_THRESHOLD) {
		yield* this.regress_humanoid();
	}
	if (!(rt.len(f, this.soulsOwned) - this.reviveNumber < 0)) return f.dot;
	yield* this.remove_spells();
	to_chat(this.owner.current, "<span class='warning'>As punishment for your failures, all of your powers except contract creation have been revoked.");
	return f.dot;
}, true);

// devil.dm:195
rt.def("/datum/antagonist/devil/proc/regress_humanoid", function* regress_humanoid(f: Frame) {
	let H: Value = null;
	to_chat(this.owner.current, "<span class='warning'>Your powers weaken, have more contracts be signed to regain power.");
	if (rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
		yield* (H = this.owner.current).set_species(T("/datum/species/human"), 1);
		yield* H.regenerate_icons();
	}
	yield* this.give_appropriate_spells();
	if (rt.istype(this.owner.current.loc, T("/obj/effect/dummy/slaughter"))) {
		yield* this.owner.current.forceMove(rt.getStep(f, this.owner.current, 0));
	}
	this.form = BASIC_DEVIL;
	return f.dot;
}, true);

// devil.dm:207
rt.def("/datum/antagonist/devil/proc/regress_blood_lizard", function* regress_blood_lizard(f: Frame) {
	let D: Value = null;
	to_chat((D = this.owner.current), "<span class='warning'>Your powers weaken, have more contracts be signed to regain power.");
	D.oldform.loc = D.loc;
	yield* this.owner.transfer_to(D.oldform);
	yield* this.give_appropriate_spells();
	yield* qdel(D);
	this.form = BLOOD_LIZARD;
	this.update_hud();
	return f.dot;
}, true);

// devil.dm:217
rt.def("/datum/antagonist/devil/proc/increase_blood_lizard", function* increase_blood_lizard(f: Frame) {
	let H: Value = null;
	to_chat(this.owner.current, "<span class='warning'>You feel as though your humanoid form is about to shed.  You will soon turn into a blood lizard.");
	yield* sleep(50);
	if (rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
		yield* (H = this.owner.current).set_species(T("/datum/species/lizard"), 1);
		H.underwear = "Nude";
		H.undershirt = "Nude";
		H.socks = "Nude";
		rt.setAt(H.dna.features, "mcolor", "511");
		yield* H.regenerate_icons();
	} else {
		this.owner.current.color = "#501010";
	}
	yield* this.give_appropriate_spells();
	this.form = BLOOD_LIZARD;
	return f.dot;
}, true);

// devil.dm:235
rt.def("/datum/antagonist/devil/proc/increase_true_devil", function* increase_true_devil(f: Frame) {
	let A: Value = null;
	to_chat(this.owner.current, "<span class='warning'>You feel as though your current form is about to shed.  You will soon turn into a true devil.");
	yield* sleep(50);
	(rt.modField(f, (A = (yield* new_(T("/mob/living/carbon/true_devil"), this.owner.current.loc))), "faction", "hell", rt.bitOr));
	this.owner.current.loc = A;
	A.oldform = this.owner.current;
	yield* this.owner.transfer_to(A);
	A.set_name();
	yield* this.give_appropriate_spells();
	this.form = TRUE_DEVIL;
	this.update_hud();
	return f.dot;
}, true);

// devil.dm:248
rt.def("/datum/antagonist/devil/proc/increase_arch_devil", function* increase_arch_devil(f: Frame) {
	let D: Value = null, A: Value = null;
	if (!this.ascendable) {
		return f.dot;
	}
	to_chat((D = this.owner.current), "<span class='warning'>You feel as though your form is about to ascend.");
	yield* sleep(50);
	if (!D) {
		return f.dot;
	}
	D.visible_message(`<span class='warning'>${D}'s skin begins to erupt with spikes.</span>`, "<span class='warning'>Your flesh begins creating a shield around yourself.</span>");
	yield* sleep(100);
	if (!D) {
		return f.dot;
	}
	D.visible_message(`<span class='warning'>The horns on ${D}'s head slowly grow and elongate.</span>`, "<span class='warning'>Your body continues to mutate. Your telepathic abilities grow.</span>");
	yield* sleep(90);
	if (!D) {
		return f.dot;
	}
	D.visible_message(`<span class='warning'>${D}'s body begins to violently stretch and contort.</span>`, "<span class='warning'>You begin to rend apart the final barriers to ultimate power.</span>");
	yield* sleep(40);
	if (!D) {
		return f.dot;
	}
	to_chat(D, "<i><b>Yes!</b></i>");
	yield* sleep(10);
	if (!D) {
		return f.dot;
	}
	to_chat(D, "<i><b><span class='big'>YES!!</span></b></i>");
	yield* sleep(10);
	if (!D) {
		return f.dot;
	}
	to_chat(D, "<i><b><span class='reallybig'>YE--</span></b></i>");
	yield* sleep(1);
	if (!D) {
		return f.dot;
	}
	to_chat(rt.world(), "<font size=5><span class='danger'><b>\"SLOTH, WRATH, GLUTTONY, ACEDIA, ENVY, GREED, PRIDE! FIRES OF HELL AWAKEN!!\"</font></span>");
	rt.op(f, "OutputReference", [rt.R.world], [rt.rsc("sound/hallucinations/veryfar_noise.ogg")], false);
	yield* this.give_appropriate_spells();
	D.convert_to_archdevil();
	if (rt.istype(D.loc, T("/obj/effect/dummy/slaughter"))) {
		yield* D.forceMove(rt.getStep(f, D, 0));
	}
	if (A = get_area(this.owner.current)) {
		yield* notify_ghosts(fmt("An arch devil has ascended in ％！. Reach out to the devil to be given a new shell for your soul.", [A.name]), { source: this.owner.current, action: "attack" });
	}
	yield* sleep(50);
	if (!GLOB.SSticker.mode.devil_ascended) {
		yield* GLOB.SSshuttle.emergency.request(null, { set_coefficient: 0.3 });
	}
	GLOB.SSticker.mode.devil_ascended++;
	this.form = ARCH_DEVIL;
	return f.dot;
}, true);

// devil.dm:298
rt.def("/datum/antagonist/devil/proc/remove_spells", function* remove_spells(f: Frame) {
	let X: Value = null, S: Value = null;
	for (X of each(this.owner.spell_list)) {
		if (is_type_in_typecache((S = X), GLOB.devil_spells)) {
			yield* this.owner.RemoveSpell(S);
		}
	}
	return f.dot;
}, true);

// devil.dm:304
rt.def("/datum/antagonist/devil/proc/give_summon_contract", function* give_summon_contract(f: Frame) {
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/summon_contract"), null)));
	if (this.obligation == "fiddle") {
		yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/violin"), null)));
	} else {
		if (this.obligation != "danceoff") return f.dot;
		yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/summon_dancefloor"), null)));
	}
	return f.dot;
}, true);

// devil.dm:311
rt.def("/datum/antagonist/devil/proc/give_appropriate_spells", function* give_appropriate_spells(f: Frame) {
	yield* this.remove_spells();
	yield* this.give_summon_contract();
	if (rt.len(f, this.soulsOwned) - this.reviveNumber >= ARCH_THRESHOLD && this.ascendable) {
		yield* this.give_arch_spells();
	} else if (rt.len(f, this.soulsOwned) - this.reviveNumber >= TRUE_THRESHOLD) {
		yield* this.give_true_spells();
	} else if (rt.len(f, this.soulsOwned) - this.reviveNumber >= BLOOD_THRESHOLD) {
		yield* this.give_blood_spells();
	} else {
		if (!(rt.len(f, this.soulsOwned) - this.reviveNumber >= 0)) return f.dot;
		yield* this.give_base_spells();
	}
	return f.dot;
}, true);

// devil.dm:323
rt.def("/datum/antagonist/devil/proc/give_base_spells", function* give_base_spells(f: Frame) {
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork"), null)));
	return f.dot;
}, true);

// devil.dm:327
rt.def("/datum/antagonist/devil/proc/give_blood_spells", function* give_blood_spells(f: Frame) {
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/infernal_jaunt"), null)));
	return f.dot;
}, true);

// devil.dm:332
rt.def("/datum/antagonist/devil/proc/give_true_spells", function* give_true_spells(f: Frame) {
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/greater"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/aimed/fireball/hellish"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/infernal_jaunt"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/sintouch"), null)));
	return f.dot;
}, true);

// devil.dm:338
rt.def("/datum/antagonist/devil/proc/give_arch_spells", function* give_arch_spells(f: Frame) {
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/conjure_item/summon_pitchfork/ascended"), null)));
	yield* this.owner.AddSpell((yield* new_(T("/obj/effect/proc_holder/spell/targeted/sintouch/ascended"), null)));
	return f.dot;
}, true);

// devil.dm:342
rt.def("/datum/antagonist/devil/proc/beginResurrectionCheck", function* beginResurrectionCheck(f: Frame, body: Value) {
	if (rt.len(f, this.soulsOwned) - this.reviveNumber > 0) {
		to_chat(this.owner.current, "<span class='userdanger'>Your body has been damaged to the point that you may no longer use it.  At the cost of some of your power, you will return to life soon.  Remain in your body.</span>");
		yield* sleep(DEVILRESURRECTTIME);
		if (!body || body.stat == 2) {
			if (rt.len(f, this.soulsOwned) - this.reviveNumber > 0) {
				if (this.check_banishment(body)) {
					to_chat(this.owner.current, "<span class='userdanger'>Unfortunately, the mortals have finished a ritual that prevents your resurrection.</span>");
					return -1;
				} else {
					to_chat(this.owner.current, "<span class='userdanger'>WE LIVE AGAIN!</span>");
					return (yield* this.hellish_resurrection(body));
				}
			} else {
				to_chat(this.owner.current, "<span class='userdanger'>Unfortunately, the power that stemmed from your contracts has been extinguished.  You no longer have enough power to resurrect.</span>");
				return -1;
			}
		} else {
			to_chat(this.owner.current, "<span class='danger'> You seem to have resurrected without your hellish powers.</span>");
		}
	} else {
		to_chat(this.owner.current, "<span class='userdanger'>Your hellish powers are too weak to resurrect yourself.</span>");
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// devil.dm:362
rt.def("/datum/antagonist/devil/proc/check_banishment", function check_banishment(f: Frame, body: Value) {
	let H: Value = null, R: Value = null, count: Value = null, C: Value = null, B: Value = null;
	let $e: any;
	if (this.banish === "water") {
		if (rt.istype(body, T("/mob/living/carbon"))) {
			return (H = body).reagents.has_reagent("holy water");
		}
		return 0;
	} else if (this.banish === "coffin") {
		return (body && (rt.istype(body.loc, T("/obj/structure/closet/coffin")) ? 1 : 0));
	} else if (this.banish === "embalm") {
		if (rt.istype(body, T("/mob/living/carbon"))) {
			return (H = body).reagents.has_reagent("formaldehyde");
		}
		return 0;
	} else if (this.banish === "runes") {
		if (body) {
			for (R of each(range(0, body), T("/obj/effect/decal/cleanable/crayon"))) {
				if (R.name == "rune") {
					return 1;
				}
			}
		}
		return 0;
	} else if (this.banish === "candles") {
		if (body) {
			count = 0;
			for (C of each(range(1, body), T("/obj/item/candle"))) {
				count += C.lit;
			}
			if (count >= 4) {
				return 1;
			}
		}
		return 0;
	} else if (this.banish === "destruction") {
		if (body) {
			return 0;
		}
		return 1;
	} else if (this.banish === "funeral") {
		if (rt.istype(body, T("/mob/living/carbon/human"))) {
			if ((H = body).w_uniform && rt.istype(H.w_uniform, T("/obj/item/clothing/under/burial"))) {
				return 1;
			}
			return 0;
		} else {
			for (B of each(range(0, body), T("/obj/item/clothing/under/burial"))) {
				if (B.loc == rt.getStep(f, B, 0)) {
					return 1;
				}
			}
			return 0;
		}
	}
	return f.dot;
});

// devil.dm:406
rt.def("/datum/antagonist/devil/proc/hellish_resurrection", function* hellish_resurrection(f: Frame, body: Value) {
	let D: Value = null;
	message_admins(`${this.owner.name} (true name is: ${this.truename}) is resurrecting using hellish energy.</a>`);
	if (rt.len(f, this.soulsOwned) - this.reviveNumber < ARCH_THRESHOLD || !this.ascendable) {
		this.reviveNumber += LOSS_PER_DEATH;
		this.update_hud();
	}
	if (body) {
		yield* body.revive(1, 0);
		if (rt.istype(body.loc, T("/obj/effect/dummy/slaughter"))) {
			yield* body.forceMove(rt.getStep(f, body, 0));
		}
		if (rt.istype(body, T("/mob/living/carbon/true_devil"))) {
			if ((D = body).oldform) {
				yield* D.oldform.revive(1, 0);
			}
		}
		if (body.stat == 2) {
			yield* this.create_new_body();
		}
	} else {
		yield* this.create_new_body();
	}
	yield* this.check_regression();
	return f.dot;
}, true);

// devil.dm:425
rt.def("/datum/antagonist/devil/proc/create_new_body", function* create_new_body(f: Frame) {
	let targetturf: Value = null, currentMob: Value = null, H: Value = null, A: Value = null;
	if (rt.len(f, GLOB.blobstart) > 0) {
		targetturf = rt.getStep(f, pick(GLOB.blobstart), 0);
		if (!(currentMob = this.owner.current)) {
			if (!(currentMob = this.owner.get_ghost())) {
				message_admins(`${this.owner.name}'s devil resurrection failed due to client logoff.  Aborting.`);
				return -1;
			}
		}
		if (currentMob.mind != this.owner) {
			message_admins(`${this.owner.name}'s devil resurrection failed due to becoming a new mob.  Aborting.`);
			return -1;
		}
		yield* currentMob.change_mob_type(T("/mob/living/carbon/human"), targetturf, null, 1);
		yield* (H = this.owner.current).equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/under/lawyer/black"), H)), slot_w_uniform);
		yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/clothing/shoes/laceup"), H)), slot_shoes);
		yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/storage/briefcase"), H)), slot_hands);
		yield* H.equip_to_slot_or_del((yield* new_(T("/obj/item/weapon/pen"), H)), slot_l_store);
		if (rt.len(f, this.soulsOwned) - this.reviveNumber >= BLOOD_THRESHOLD) {
			yield* H.set_species(T("/datum/species/lizard"), 1);
			H.underwear = "Nude";
			H.undershirt = "Nude";
			H.socks = "Nude";
			rt.setAt(H.dna.features, "mcolor", "511");
			yield* H.regenerate_icons();
			if (rt.len(f, this.soulsOwned) - this.reviveNumber >= TRUE_THRESHOLD) {
				(rt.modField(f, (A = (yield* new_(T("/mob/living/carbon/true_devil"), targetturf))), "faction", "hell", rt.bitOr));
				yield* H.forceMove(A);
				A.oldform = H;
				yield* this.owner.transfer_to(A, 1);
				A.set_name();
				if (rt.len(f, this.soulsOwned) - this.reviveNumber >= ARCH_THRESHOLD && this.ascendable) {
					A.convert_to_archdevil();
				}
			}
		}
	} else {
		rt.throw_(f, (yield* new_(T("/exception"), "Unable to find a blobstart landmark for hellish resurrection", "code/datums/antagonists/devil.dm", 459)));
	}
	return f.dot;
}, true);

// devil.dm:463
rt.def("/datum/antagonist/devil/proc/update_hud", function update_hud(f: Frame) {
	let C: Value = null;
	if (!rt.istype(this.owner.current, T("/mob/living/carbon"))) return f.dot;
	if (!((C = this.owner.current).hud_used && C.hud_used.devilsouldisplay)) return f.dot;
	C.hud_used.devilsouldisplay.update_counter(rt.len(f, this.soulsOwned) - this.reviveNumber);
	return f.dot;
});

// devil.dm:469
rt.def("/datum/antagonist/devil/proc/greet", function greet(f: Frame) {
	to_chat(this.owner.current, `<span class='warning'><b>You remember your link to the infernal.  You are ${this.truename}, an agent of hell, a devil.  And you were sent to the plane of creation for a reason.  A greater purpose.  Convince the crew to sin, and embroiden Hell's grasp.</b></span>`);
	to_chat(this.owner.current, "<span class='warning'><b>However, your infernal form is not without weaknesses.</b></span>");
	to_chat(this.owner.current, "You may not use violence to coerce someone into selling their soul.");
	to_chat(this.owner.current, "You may not directly and knowingly physically harm a devil, other than yourself.");
	to_chat(this.owner.current, rt.index(rt.index(GLOB.lawlorify, LAW), this.bane));
	to_chat(this.owner.current, rt.index(rt.index(GLOB.lawlorify, LAW), this.ban));
	to_chat(this.owner.current, rt.index(rt.index(GLOB.lawlorify, LAW), this.obligation));
	to_chat(this.owner.current, rt.index(rt.index(GLOB.lawlorify, LAW), this.banish));
	to_chat(this.owner.current, "<span class='warning'>Remember, the crew can research your weaknesses if they find out your devil name.</span><br>");
	f.dot = parent_proc();
	return f.dot;
});

// devil.dm:481
rt.def("/datum/antagonist/devil/proc/on_gain", function* on_gain(f: Frame) {
	let robot_devil: Value = null, laws: Value = null, S: Value = null;
	this.owner.store_memory(`Your devilic true name is ${this.truename}<br>${rt.index(rt.index(GLOB.lawlorify, LAW), this.ban)}<br>You may not use violence to coerce someone into selling their soul.<br>You may not directly and knowingly physically harm a devil, other than yourself.<br>${rt.index(rt.index(GLOB.lawlorify, LAW), this.bane)}<br>${rt.index(rt.index(GLOB.lawlorify, LAW), this.obligation)}<br>${rt.index(rt.index(GLOB.lawlorify, LAW), this.banish)}<br>`);
	if (rt.istype(this.owner.current, T("/mob/living/silicon"))) {
		robot_devil = this.owner.current;
		laws = list("You may not use violence to coerce someone into selling their soul.", "You may not directly and knowingly physically harm a devil, other than yourself.", rt.index(rt.index(GLOB.lawlorify, LAW), this.ban), rt.index(rt.index(GLOB.lawlorify, LAW), this.obligation), "Accomplish your objectives at all costs.");
		yield* robot_devil.set_law_sixsixsix(laws);
	}
	yield* sleep(10);
	if (this.owner.assigned_role == "Clown" && rt.istype(this.owner.current, T("/mob/living/carbon/human"))) {
		to_chat((S = this.owner.current), "<span class='notice'>Your infernal nature has allowed you to overcome your clownishness.</span>");
		yield* S.dna.remove_mutation("Clumsiness");
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// devil.dm:494
rt.def("/datum/antagonist/devil/proc/on_removal", function* on_removal(f: Frame) {
	to_chat(this.owner.current, "<span class='userdanger'>Your infernal link has been severed! You are no longer a devil!</span>");
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// devil.dm:498
rt.def("/datum/antagonist/devil/proc/apply_innate_effects", function* apply_innate_effects(f: Frame, mob_override: Value) {
	yield* this.give_appropriate_spells();
	yield* this.owner.current.grant_all_languages(1);
	this.update_hud();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// devil.dm:504
rt.def("/datum/antagonist/devil/proc/remove_innate_effects", function* remove_innate_effects(f: Frame, mob_override: Value) {
	let X: Value = null, S: Value = null;
	for (X of each(this.owner.spell_list)) {
		if (is_type_in_typecache((S = X), GLOB.devil_spells)) {
			yield* this.owner.RemoveSpell(S);
		}
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(944, "/datum/fakeDevil", "/datum", {
	truename: null,
	bane: null,
	obligation: null,
	ban: null,
	banish: null,
	ascendable: null,
});

// devil.dm:520
rt.def("/datum/fakeDevil/proc/New", function New(f: Frame, name: Value) {
	name ??= randomDevilName();
	this.truename = name;
	this.bane = randomdevilbane();
	this.obligation = randomdevilobligation();
	this.ban = randomdevilban();
	this.banish = randomdevilbanish();
	this.ascendable = prob(25);
	return f.dot;
});
