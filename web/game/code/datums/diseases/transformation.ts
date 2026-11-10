// Based on /tg/station's code/datums/diseases/transformation.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(962, "/datum/disease/transformation", "/datum/disease", {
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/carbon/human"),
	name: "Transformation",
	max_stages: 5,
	spread_text: "Acute",
	spread_flags: 1,
	cure_text: "A coder's love (theoretical).",
	agent: "Shenanigans",
	severity: "Harmful",
	stage_prob: 10,
	visibility_flags: 3,
	disease_flags: 1,
	viable_mobtypes: null,
});

// transformation.dm:13
rt.def("/datum/disease/transformation/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.stage1 = list("You feel unremarkable.");

	this.stage2 = list("You feel boring.");

	this.stage3 = list("You feel utterly plain.");

	this.stage4 = list("You feel white bread.");

	this.stage5 = list("Oh the humanity!");

	this.viable_mobtypes = list(T("/mob/living/carbon/human"), T("/mob/living/carbon/monkey"), T("/mob/living/carbon/alien"));
	return f.dot;
});

// transformation.dm:21
rt.def("/datum/disease/transformation/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 1) {
		if (prob(this.stage_prob) && this.stage1) {
			to_chat(this.affected_mob, pick(this.stage1));
		}
	} else if (this.stage === 2) {
		if (prob(this.stage_prob) && this.stage2) {
			to_chat(this.affected_mob, pick(this.stage2));
		}
	} else if (this.stage === 3) {
		if (prob(this.stage_prob * 2) && this.stage3) {
			to_chat(this.affected_mob, pick(this.stage3));
		}
	} else if (this.stage === 4) {
		if (prob(this.stage_prob * 2) && this.stage4) {
			to_chat(this.affected_mob, pick(this.stage4));
		}
	} else if (this.stage === 5) {
		yield* this.do_disease_transformation(this.affected_mob);
	}
	return f.dot;
}, true);

// transformation.dm:39
rt.def("/datum/disease/transformation/proc/do_disease_transformation", function* do_disease_transformation(f: Frame, affected_mob: Value) {
	let W: Value = null, I: Value = null, new_mob: Value = null;
	if (!(rt.istype(affected_mob, T("/mob/living/carbon")) && affected_mob.stat != 2)) return f.dot;
	if (this.stage5) {
		to_chat(affected_mob, pick(this.stage5));
	}
	if (jobban_isbanned(affected_mob, this.new_form)) {
		yield* affected_mob.death(1);
		return f.dot;
	}
	if (affected_mob.notransform) {
		return f.dot;
	}
	affected_mob.notransform = 1;
	for (W of each(affected_mob.get_equipped_items(), T("/obj/item"))) {
		yield* affected_mob.dropItemToGround(W);
	}
	for (I of each(affected_mob.held_items, T("/obj/item"))) {
		yield* affected_mob.dropItemToGround(I);
	}
	if (rt.istype((new_mob = (yield* new_(this.new_form, affected_mob.loc))), T("/mob/living"))) {
		new_mob.a_intent = "harm";
		if (affected_mob.mind) {
			yield* affected_mob.mind.transfer_to(new_mob);
		} else {
			new_mob.key = affected_mob.key;
		}
	}
	new_mob.name = affected_mob.real_name;
	new_mob.real_name = new_mob.name;
	yield* qdel(affected_mob);
	return f.dot;
}, true);

rt.type(963, "/datum/disease/transformation/jungle_fever", "/datum/disease/transformation", {
	name: "Jungle Fever",
	cure_text: "Bananas",
	cures: null,
	spread_text: "Monkey Bites",
	spread_flags: 1,
	permeability_mod: 1,
	cure_chance: 1,
	disease_flags: 6,
	longevity: 30,
	desc: "Monkeys with this disease will bite humans, causing humans to mutate into a monkey.",
	severity: "BIOHAZARD THREAT!",
	stage_prob: 4,
	visibility_flags: 0,
	agent: "Kongey Vibrion M-909",
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	viable_mobtypes: null,
	new_form: rt.typePath("/mob/living/carbon/monkey"),
});

// transformation.dm:69
rt.def("/datum/disease/transformation/jungle_fever/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("banana");
	this.stage1 = null;
	this.stage2 = null;
	this.stage3 = null;
	this.stage4 = list("<span class='warning'>Your back hurts.</span>", "<span class='warning'>You breathe through your mouth.</span>", "<span class='warning'>You have a craving for bananas.</span>", "<span class='warning'>Your mind feels clouded.</span>");

	this.stage5 = list("<span class='warning'>You feel like monkeying around.</span>");

	this.viable_mobtypes = list(T("/mob/living/carbon/monkey"), T("/mob/living/carbon/human"));
	return f.dot;
});

// transformation.dm:92
rt.def("/datum/disease/transformation/jungle_fever/proc/do_disease_transformation", function* do_disease_transformation(f: Frame, affected_mob: Value) {
	if (rt.istype(affected_mob, T("/mob/living/carbon/monkey"))) return f.dot;
	GLOB.SSticker.mode.add_monkey(affected_mob.mind);
	yield* affected_mob.monkeyize(311);
	return f.dot;
}, true);

// transformation.dm:97
rt.def("/datum/disease/transformation/jungle_fever/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 2) {
		if (prob(2)) {
			to_chat(this.affected_mob, `<span class='notice'>Your ${pick("back", "arm", "leg", "elbow", "head")} itches.</span>`);
		}
	} else if (this.stage === 3) {
		if (prob(4)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a stabbing pain in your head.</span>");
			this.affected_mob.confused += 10;
		}
	} else if (this.stage === 4) {
		if (!prob(3)) return f.dot;
		yield* this.affected_mob.say(pick("Eeek, ook ook!", "Eee-eeek!", "Eeee!", "Ungh, ungh."));
	}
	return f.dot;
}, true);

// transformation.dm:111
rt.def("/datum/disease/transformation/jungle_fever/proc/cure", function* cure(f: Frame) {
	GLOB.SSticker.mode.remove_monkey(this.affected_mob.mind);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(964, "/datum/disease/transformation/robot", "/datum/disease/transformation", {
	name: "Robotic Transformation",
	cure_text: "An injection of copper.",
	cures: null,
	cure_chance: 5,
	agent: "R2D2 Nanomachines",
	desc: "This disease, actually acute nanomachine infection, converts the victim into a cyborg.",
	severity: "Dangerous!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/silicon/robot"),
});

// transformation.dm:119
rt.def("/datum/disease/transformation/robot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("copper");
	this.stage1 = null;
	this.stage2 = list("Your joints feel stiff.", "<span class='danger'>Beep...boop..</span>");
	this.stage3 = list("<span class='danger'>Your joints feel very stiff.</span>", "Your skin feels loose.", "<span class='danger'>You can feel something move...inside.</span>");
	this.stage4 = list("<span class='danger'>Your skin feels very loose.</span>", "<span class='danger'>You can feel... something...inside you.</span>");

	this.stage5 = list("<span class='danger'>Your skin feels as if it's about to burst off!</span>");
	return f.dot;
});

// transformation.dm:134
rt.def("/datum/disease/transformation/robot/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 3) {
		if (prob(8)) {
			yield* this.affected_mob.say(pick("Beep, boop", "beep, beep!", "Boop...bop"));
		}
		if (prob(4)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a stabbing pain in your head.</span>");
			yield* this.affected_mob.Unconscious(40);
		}
	} else if (this.stage === 4) {
		if (!prob(20)) return f.dot;
		yield* this.affected_mob.say(pick("beep, beep!", "Boop bop boop beep.", "kkkiiiill mmme", "I wwwaaannntt tttoo dddiiieeee..."));
	}
	return f.dot;
}, true);

rt.type(965, "/datum/disease/transformation/xeno", "/datum/disease/transformation", {
	name: "Xenomorph Transformation",
	cure_text: "Spaceacillin & Glycerol",
	cures: null,
	cure_chance: 5,
	agent: "Rip-LEY Alien Microbes",
	desc: "This disease changes the victim into a xenomorph.",
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/carbon/alien/humanoid/hunter"),
});

// transformation.dm:161
rt.def("/datum/disease/transformation/xeno/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("spaceacillin", "glycerol");
	this.stage1 = null;
	this.stage2 = list("Your throat feels scratchy.", "<span class='danger'>Kill...</span>");
	this.stage3 = list("<span class='danger'>Your throat feels very scratchy.</span>", "Your skin feels tight.", "<span class='danger'>You can feel something move...inside.</span>");
	this.stage4 = list("<span class='danger'>Your skin feels very tight.</span>", "<span class='danger'>Your blood boils!</span>", "<span class='danger'>You can feel... something...inside you.</span>");

	this.stage5 = list("<span class='danger'>Your skin feels as if it's about to burst off!</span>");
	return f.dot;
});

// transformation.dm:165
rt.def("/datum/disease/transformation/xeno/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 3) {
		if (prob(4)) {
			to_chat(this.affected_mob, "<span class='danger'>You feel a stabbing pain in your head.</span>");
			yield* this.affected_mob.Unconscious(40);
		}
	} else if (this.stage === 4) {
		if (!prob(20)) return f.dot;
		yield* this.affected_mob.say(pick("You look delicious.", "Going to... devour you...", "Hsssshhhhh!"));
	}
	return f.dot;
}, true);

rt.type(966, "/datum/disease/transformation/slime", "/datum/disease/transformation", {
	name: "Advanced Mutation Transformation",
	cure_text: "frost oil",
	cures: null,
	cure_chance: 80,
	agent: "Advanced Mutation Toxin",
	desc: "This highly concentrated extract converts anything into more of itself.",
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/slime/random"),
});

// transformation.dm:179
rt.def("/datum/disease/transformation/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("frostoil");

	this.stage1 = list("You don't feel very well.");

	this.stage2 = list("Your skin feels a little slimy.");
	this.stage3 = list("<span class='danger'>Your appendages are melting away.</span>", "<span class='danger'>Your limbs begin to lose their shape.</span>");

	this.stage4 = list("<span class='danger'>You are turning into a slime.</span>");

	this.stage5 = list("<span class='danger'>You have become a slime.</span>");
	return f.dot;
});

// transformation.dm:193
rt.def("/datum/disease/transformation/slime/proc/stage_act", function* stage_act(f: Frame) {
	let human: Value = null;
	yield* parent_proc();
	if (this.stage === 1) {
		if (rt.istype(this.affected_mob, T("/mob/living/carbon/human")) && this.affected_mob.dna && this.affected_mob.dna.species.id == "slime") {
			this.stage = 5;
		}
	} else if (this.stage === 3) {
		if (!rt.istype(this.affected_mob, T("/mob/living/carbon/human"))) return f.dot;
		if ((human = this.affected_mob).dna.species.id == "slime") return f.dot;
		yield* human.set_species(T("/datum/species/jelly/slime"));
	}
	return f.dot;
}, true);

rt.type(967, "/datum/disease/transformation/corgi", "/datum/disease/transformation", {
	name: "The Barkening",
	cure_text: "Death",
	cures: null,
	agent: "Fell Doge Majicks",
	desc: "This disease transforms the victim into a corgi.",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/pet/dog/corgi"),
});

// transformation.dm:207
rt.def("/datum/disease/transformation/corgi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("adminordrazine");

	this.stage1 = list("BARK.");

	this.stage2 = list("You feel the need to wear silly hats.");
	this.stage3 = list("<span class='danger'>Must... eat... chocolate....</span>", "<span class='danger'>YAP</span>");

	this.stage4 = list("<span class='danger'>Visions of washing machines assail your mind!</span>");

	this.stage5 = list("<span class='danger'>AUUUUUU!!!</span>");
	return f.dot;
});

// transformation.dm:219
rt.def("/datum/disease/transformation/corgi/proc/stage_act", function* stage_act(f: Frame) {
	yield* parent_proc();
	if (this.stage === 3) {
		if (prob(8)) {
			yield* this.affected_mob.say(pick("YAP", "Woof!"));
		}
	} else if (this.stage === 4) {
		if (!prob(20)) return f.dot;
		yield* this.affected_mob.say(pick("Bark!", "AUUUUUU"));
	}
	return f.dot;
}, true);

rt.type(968, "/datum/disease/transformation/morph", "/datum/disease/transformation", {
	name: "Gluttony's Blessing",
	cure_text: "nothing",
	cures: null,
	agent: "Gluttony's Blessing",
	desc: "A 'gift' from somewhere terrible.",
	stage_prob: 20,
	severity: "BIOHAZARD THREAT!",
	visibility_flags: 0,
	stage1: null,
	stage2: null,
	stage3: null,
	stage4: null,
	stage5: null,
	new_form: rt.typePath("/mob/living/simple_animal/hostile/morph"),
});

// transformation.dm:231
rt.def("/datum/disease/transformation/morph/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cures = list("adminordrazine");

	this.stage1 = list("Your stomach rumbles.");

	this.stage2 = list("Your skin feels saggy.");
	this.stage3 = list("<span class='danger'>Your appendages are melting away.</span>", "<span class='danger'>Your limbs begin to lose their shape.</span>");

	this.stage4 = list("<span class='danger'>You're ravenous.</span>");

	this.stage5 = list("<span class='danger'>You have become a morph.</span>");
	return f.dot;
});
