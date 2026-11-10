// Based on /tg/station's code/game/gamemodes/miniantags/abduction/gland.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(9441, "/obj/item/organ/heart/gland", "/obj/item/organ/heart", {
	cooldown_low: 300,
	cooldown_high: 300,
	next_activation: 0,
	uses: null,
	human_only: 0,
	active: 0,
	name: "fleshy mass",
	desc: "A nausea-inducing hunk of twisting flesh and metal.",
	icon: rt.rsc("icons/obj/abductor.dmi"),
	icon_state: "gland",
	status: 2,
	origin_tech: "materials=4;biotech=7;abductor=3",
	beating: 1,
});

// gland.dm:17
rt.def("/obj/item/organ/heart/gland/proc/ownerCheck", function ownerCheck(f: Frame) {
	if (rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		return 1;
	}
	if (!this.human_only && rt.istype(this.owner, T("/mob/living/carbon"))) {
		return 1;
	}
	return 0;
});

// gland.dm:25
rt.def("/obj/item/organ/heart/gland/proc/Start", function Start(f: Frame) {
	this.active = 1;
	this.next_activation = rt.worldTime(f) + rand(this.cooldown_low, this.cooldown_high);
	return f.dot;
});

// gland.dm:30
rt.def("/obj/item/organ/heart/gland/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.active = 0;
	if (rt.initial(f, this, "uses") == 1) {
		this.uses = rt.initial(f, this, "uses");
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// gland.dm:35
rt.def("/obj/item/organ/heart/gland/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (!(f.args[1] != 2 && this.uses)) return f.dot;
	yield* this.Start();
	return f.dot;
}, true, { args: ["M", "special"] });

// gland.dm:40
rt.def("/obj/item/organ/heart/gland/proc/on_life", function* on_life(f: Frame) {
	if (!this.beating) {
		this.beating = 1;
	}
	if (!this.active) {
		return f.dot;
	}
	if (!this.ownerCheck()) {
		this.active = 0;
		return f.dot;
	}
	if (this.next_activation <= rt.worldTime(f)) {
		yield* this.activate();
		this.uses--;
		this.next_activation = rt.worldTime(f) + rand(this.cooldown_low, this.cooldown_high);
	}
	if (this.uses) return f.dot;
	this.active = 0;
	return f.dot;
}, true);

rt.type(9442, "/obj/item/organ/heart/gland/heals", "/obj/item/organ/heart/gland", {
	cooldown_low: 200,
	cooldown_high: 400,
	uses: -1,
	icon_state: "health",
});

// gland.dm:65
rt.def("/obj/item/organ/heart/gland/heals/proc/activate", function* activate(f: Frame) {
	to_chat(this.owner, "<span class='notice'>You feel curiously revitalized.</span>");
	yield* this.owner.adjustBruteLoss(-20);
	yield* this.owner.adjustOxyLoss(-20);
	yield* this.owner.adjustFireLoss(-20);
	return f.dot;
}, true);

rt.type(9443, "/obj/item/organ/heart/gland/slime", "/obj/item/organ/heart/gland", {
	cooldown_low: 600,
	cooldown_high: 1200,
	uses: -1,
	icon_state: "slime",
});

// gland.dm:77
rt.def("/obj/item/organ/heart/gland/slime/proc/activate", function* activate(f: Frame) {
	let Slime: Value = null;
	to_chat(this.owner, "<span class='warning'>You feel nauseous!</span>");
	yield* this.owner.vomit(20);
	(Slime = (yield* new_(T("/mob/living/simple_animal/slime"), rt.getStep(f, this.owner, 0), "grey"))).Friends = list(this.owner);
	Slime.Leader = this.owner;
	return f.dot;
}, true);

rt.type(9444, "/obj/item/organ/heart/gland/mindshock", "/obj/item/organ/heart/gland", {
	cooldown_low: 300,
	cooldown_high: 300,
	uses: -1,
	origin_tech: "materials=4;biotech=4;magnets=6;abductor=3",
	icon_state: "mindshock",
});

// gland.dm:93
rt.def("/obj/item/organ/heart/gland/mindshock/proc/activate", function activate(f: Frame) {
	let H: Value = null;
	to_chat(this.owner, "<span class='notice'>You get a headache.</span>");
	let _T: Value = rt.getStep(f, this.owner, 0);
	for (H of each(orange(4, _T), T("/mob/living/carbon"))) {
		if (H == this.owner) {
			continue;
		}
		to_chat(H, "<span class='alien'>You hear a buzz in your head.</span>");
		H.confused += 20;
	}
	return f.dot;
});

rt.type(9445, "/obj/item/organ/heart/gland/pop", "/obj/item/organ/heart/gland", {
	cooldown_low: 900,
	cooldown_high: 1800,
	uses: -1,
	human_only: 1,
	icon_state: "species",
});

// gland.dm:110
rt.def("/obj/item/organ/heart/gland/pop/proc/activate", function* activate(f: Frame) {
	to_chat(this.owner, "<span class='notice'>You feel unlike yourself.</span>");
	let species: Value = pick(list(T("/datum/species/lizard"), T("/datum/species/jelly/slime"), T("/datum/species/pod"), T("/datum/species/fly"), T("/datum/species/jelly")));
	yield* this.owner.set_species(species);
	return f.dot;
}, true);

rt.type(9446, "/obj/item/organ/heart/gland/ventcrawling", "/obj/item/organ/heart/gland", {
	cooldown_low: 1800,
	cooldown_high: 2400,
	uses: 1,
	origin_tech: "materials=4;biotech=5;bluespace=4;abductor=3",
	icon_state: "vent",
});

// gland.dm:122
rt.def("/obj/item/organ/heart/gland/ventcrawling/proc/activate", function activate(f: Frame) {
	to_chat(this.owner, "<span class='notice'>You feel very stretchy.</span>");
	this.owner.ventcrawler = VENTCRAWLER_ALWAYS;
	return f.dot;
});

rt.type(9447, "/obj/item/organ/heart/gland/viral", "/obj/item/organ/heart/gland", {
	cooldown_low: 1800,
	cooldown_high: 2400,
	uses: 1,
	icon_state: "viral",
});

// gland.dm:133
rt.def("/obj/item/organ/heart/gland/viral/proc/activate", function* activate(f: Frame) {
	let D: Value = null;
	to_chat(this.owner, "<span class='warning'>You feel sick.</span>");
	let virus_type: Value = pick(T("/datum/disease/beesease"), T("/datum/disease/brainrot"), T("/datum/disease/magnitis"));
	(D = (yield* new_(virus_type))).carrier = 1;
	this.owner.viruses += D;
	D.affected_mob = this.owner;
	D.holder = this.owner;
	this.owner.med_hud_set_status();
	return f.dot;
}, true);

rt.type(9448, "/obj/item/organ/heart/gland/emp", "/obj/item/organ/heart/gland", {
	cooldown_low: 900,
	cooldown_high: 1600,
	uses: 10,
	origin_tech: "materials=4;biotech=4;magnets=6;abductor=3",
	icon_state: "emp",
});

// gland.dm:151
rt.def("/obj/item/organ/heart/gland/emp/proc/activate", function* activate(f: Frame) {
	to_chat(this.owner, "<span class='warning'>You feel a spike of pain in your head.</span>");
	yield* empulse(rt.getStep(f, this.owner, 0), 2, 5, 1);
	return f.dot;
}, true);

rt.type(9449, "/obj/item/organ/heart/gland/spiderman", "/obj/item/organ/heart/gland", {
	cooldown_low: 450,
	cooldown_high: 900,
	uses: 10,
	icon_state: "spider",
});

// gland.dm:161
rt.def("/obj/item/organ/heart/gland/spiderman/proc/activate", function* activate(f: Frame) {
	to_chat(this.owner, "<span class='warning'>You feel something crawling in your skin.</span>");
	(rt.modField(f, this.owner, "faction", "spiders", rt.bitOr));
	yield* new_(T("/obj/structure/spider/spiderling"), this.owner.loc);
	return f.dot;
}, true);

rt.type(9450, "/obj/item/organ/heart/gland/egg", "/obj/item/organ/heart/gland", {
	cooldown_low: 300,
	cooldown_high: 400,
	uses: -1,
	icon_state: "egg",
});

// gland.dm:172
rt.def("/obj/item/organ/heart/gland/egg/proc/activate", function* activate(f: Frame) {
	let egg: Value = null;
	to_chat(this.owner, "<span class='boldannounce'>You lay an egg!</span>");
	yield* (egg = (yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/egg"), this.owner.loc))).reagents.add_reagent("sacid", 20);
	egg.desc += " It smells bad.";
	return f.dot;
}, true);

rt.type(9451, "/obj/item/organ/heart/gland/bloody", "/obj/item/organ/heart/gland", {
	cooldown_low: 200,
	cooldown_high: 400,
	uses: -1,
});

// gland.dm:183
rt.def("/obj/item/organ/heart/gland/bloody/proc/activate", function* activate(f: Frame) {
	let _T: Value = null, H: Value = null;
	this.owner.blood_volume -= 20;
	this.owner.visible_message(`<span class='danger'>${this.owner}'s skin erupts with blood!</span>`, "<span class='userdanger'>Blood pours from your skin!</span>");
	for (_T of each(oview(3, this.owner), T("/turf"))) {
		yield* this.owner.add_splatter_floor(_T);
	}
	for (H of each(oview(3, this.owner), T("/mob/living/carbon/human"))) {
		yield* H.add_mob_blood(this.owner);
	}
	return f.dot;
}, true);

rt.type(9452, "/obj/item/organ/heart/gland/bodysnatch", "/obj/item/organ/heart/gland", {
	cooldown_low: 600,
	cooldown_high: 600,
	human_only: 1,
	uses: 1,
});

// gland.dm:200
rt.def("/obj/item/organ/heart/gland/bodysnatch/proc/activate", function* activate(f: Frame) {
	let C: Value = null;
	to_chat(this.owner, "<span class='warning'>You feel something moving around inside you...</span>");
	if (rt.istype(this.owner, T("/mob/living/carbon/human"))) {
		yield* (C = (yield* new_(T("/obj/structure/spider/cocoon/abductor"), rt.getStep(f, this.owner, 0)))).Copy(this.owner);
		yield* C.Start();
	}
	yield* this.owner.adjustBruteLoss(40);
	yield* this.owner.add_splatter_floor();
	return f.dot;
}, true);

rt.type(12461, "/obj/structure/spider/cocoon/abductor", "/obj/structure/spider/cocoon", {
	hatch_time: 0,
	name: "slimy cocoon",
	desc: "Something is moving inside.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "cocoon_large3",
	color: "#0a780a",
	density: 1,
});

// gland.dm:219
rt.def("/obj/structure/spider/cocoon/abductor/proc/Copy", function* Copy(f: Frame, H: Value) {
	let clone: Value = null;
	yield* (clone = (yield* new_(T("/mob/living/carbon/human/interactive/greytide"), this))).hardset_dna(H.dna.uni_identity, H.dna.struc_enzymes, H.real_name, H.dna.blood_type, H.dna.species.type, H.dna.features);
	return f.dot;
}, true);

// gland.dm:223
rt.def("/obj/structure/spider/cocoon/abductor/proc/Start", function Start(f: Frame) {
	this.hatch_time = rt.worldTime(f) + 600;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// gland.dm:227
rt.def("/obj/structure/spider/cocoon/abductor/proc/process", function* process(f: Frame) {
	let M: Value = null;
	if (!(rt.worldTime(f) > this.hatch_time)) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	for (M of each(this.contents, T("/mob"))) {
		this.visible_message(`<span class='warning'>${this} hatches!</span>`);
		M.loc = this.loc;
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(9453, "/obj/item/organ/heart/gland/plasma", "/obj/item/organ/heart/gland", {
	cooldown_low: 1200,
	cooldown_high: 1800,
	uses: -1,
	origin_tech: "materials=4;biotech=4;plasmatech=6;abductor=3",
});

// gland.dm:242
rt.def("/obj/item/organ/heart/gland/plasma/proc/activate", function* activate(f: Frame) {
	let _T: Value = null;
	to_chat(this.owner, "<span class='warning'>You feel bloated.</span>");
	yield* sleep(150);
	if (!this.owner) {
		return f.dot;
	}
	to_chat(this.owner, "<span class='userdanger'>A massive stomachache overcomes you.</span>");
	yield* sleep(50);
	if (!this.owner) {
		return f.dot;
	}
	this.owner.visible_message(`<span class='danger'>${this.owner} vomits a cloud of plasma!</span>`);
	if (rt.istype((_T = rt.getStep(f, this.owner, 0)), T("/turf/open"))) {
		_T.atmos_spawn_air(`plasma=50;TEMP=${T20C}`);
	}
	yield* this.owner.vomit();
	return f.dot;
}, true);
