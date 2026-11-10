// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/farm_animals.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4934, "/mob/living/simple_animal/hostile/retaliate/goat", "/mob/living/simple_animal/hostile/retaliate", {
	udder: null,
	name: "goat",
	desc: "Not known for their pleasant disposition.",
	icon_state: "goat",
	icon_living: "goat",
	icon_dead: "goat_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	see_in_dark: 6,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	faction: null,
	attack_same: 1,
	attacktext: "kicks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	health: 40,
	maxHealth: 40,
	melee_damage_lower: 1,
	melee_damage_upper: 2,
	environment_smash: 0,
	stop_automated_movement_when_pulled: 1,
	blood_volume: 560,
});

// farm_animals.dm:9
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("EHEHEHEHEH", "eh?");

	this.speak_emote = list("brays");

	this.emote_hear = list("brays.");
	this.emote_see = list("shakes its head.", "stamps a foot.", "glares around.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 4]);

	this.faction = list("neutral");
	return f.dot;
});

// farm_animals.dm:33
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Initialize", function* Initialize(f: Frame) {
	this.udder = (yield* new_(T("/obj/item/udder")));
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// farm_animals.dm:37
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.udder);
	this.udder = null;
	return (yield* parent_proc());
}, true);

// farm_animals.dm:42
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Life", function* Life(f: Frame) {
	let direction: Value = null, step: Value = null;
	f.dot = (yield* parent_proc());
	if (f.dot) {
		if (!rt.len(f, this.enemies) && prob(1)) {
			this.Retaliate();
		}
		if (rt.len(f, this.enemies) && prob(10)) {
			this.enemies = list();
			yield* this.LoseTarget();
			this.visible_message(`<span class='notice'>${this} calms down.</span>`);
		}
	}
	if (this.stat != 0) return f.dot;
	yield* this.udder.generateMilk();
	yield* this.eat_plants();
	if (this.pulledby) return f.dot;
	for (direction of each(shuffle(list(1, 2, 4, 8, 5, 6, 9, 10)))) {
		if (step = rt.getStep(f, this, direction)) {
			if (rt.locateIn(f, T("/obj/structure/spacevine"), (step || rt.locateIn(f, T("/obj/structure/glowshroom"), step)))) {
				yield* this.Move(step, rt.getDir(f, this, step));
			}
		}
	}
	return f.dot;
}, true, { waitfor: false });

// farm_animals.dm:63
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Retaliate", function Retaliate(f: Frame) {
	parent_proc();
	this.visible_message(`<span class='danger'>${this} gets an evil-looking gleam in ${this.p_their()} eye.</span>`);
	return f.dot;
});

// farm_animals.dm:67
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/Move", function* Move(f: Frame) {
	yield* parent_proc();
	if (this.stat) return f.dot;
	yield* this.eat_plants();
	return f.dot;
}, true);

// farm_animals.dm:73
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/eat_plants", function* eat_plants(f: Frame) {
	let SV: Value = null, GS: Value = null;
	let eaten: Value = 0;
	if (SV = rt.locateIn(f, T("/obj/structure/spacevine"), this.loc)) {
		yield* SV.eat(this);
		eaten = 1;
	}
	if (GS = rt.locateIn(f, T("/obj/structure/glowshroom"), this.loc)) {
		yield* qdel(GS);
		eaten = 1;
	}
	if (!(eaten && prob(10))) return f.dot;
	yield* this.say("Nom");
	return f.dot;
}, true);

// farm_animals.dm:87
rt.def("/mob/living/simple_animal/hostile/retaliate/goat/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.stat == 0 && rt.istype(O, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.udder.milkAnimal(O, user);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(5082, "/mob/living/simple_animal/cow", "/mob/living/simple_animal", {
	udder: null,
	icon_living: "cow",
	icon_dead: "cow_dead",
	icon_gib: "cow_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	attack_sound: rt.rsc("sound/weapons/punch1.ogg"),
	gold_core_spawnable: 2,
	name: "cow",
	desc: "Known for their milk, just don't tip them over.",
	icon_state: "cow",
	gender: "female",
	see_in_dark: 6,
	butcher_results: null,
	health: 50,
	maxHealth: 50,
	blood_volume: 560,
});

// farm_animals.dm:104
rt.def("/mob/living/simple_animal/cow/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("moo?", "moo", "MOOOOOO");
	this.speak_emote = list("moos", "moos hauntingly");

	this.emote_hear = list("brays.");

	this.emote_see = list("shakes its head.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 6]);
	return f.dot;
});

// farm_animals.dm:122
rt.def("/mob/living/simple_animal/cow/proc/Initialize", function* Initialize(f: Frame) {
	this.udder = (yield* new_(T("/obj/item/udder")));
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// farm_animals.dm:126
rt.def("/mob/living/simple_animal/cow/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.udder);
	this.udder = null;
	return (yield* parent_proc());
}, true);

// farm_animals.dm:131
rt.def("/mob/living/simple_animal/cow/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (this.stat == 0 && rt.istype(O, T("/obj/item/weapon/reagent_containers/glass"))) {
		yield* this.udder.milkAnimal(O, user);
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// farm_animals.dm:138
rt.def("/mob/living/simple_animal/cow/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.stat != 0) return f.dot;
	yield* this.udder.generateMilk();
	return f.dot;
}, true, { waitfor: false });

// farm_animals.dm:143
rt.def("/mob/living/simple_animal/cow/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let external: Value = null, internal: Value = null, text: Value = null;
	if (!this.stat && M.a_intent == "disarm" && this.icon_state != this.icon_dead) {
		M.visible_message(`<span class='warning'>${M} tips over ${this}.</span>`, `<span class='notice'>You tip over ${this}.</span>`);
		to_chat(this, `<span class='userdanger'>You are tipped over by ${M}!</span>`);
		yield* this.Knockdown(60);
		this.icon_state = this.icon_dead;
		rt.spawnTail(f, rand(20, 50), "/mob/living/simple_animal/cow/proc/attack_hand: spawn at modules/mob/living/simple_animal/friendly/farm_animals.dm:148", external, internal, text);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [20, 50]))) body of /mob/living/simple_animal/cow/proc/attack_hand, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/cow/proc/attack_hand: spawn at modules/mob/living/simple_animal/friendly/farm_animals.dm:148", function* (f: Frame, external: Value, internal: Value, text: Value) {
	if (!this.stat && f.args[0]) {
		this.icon_state = this.icon_living;
		external = null;
		internal = null;
		const chosen = pick(1, 2, 3, 4);
		if (chosen === 1 || chosen === 2 || chosen === 3) {
			text = pick("imploringly.", "pleadingly.", "with a resigned expression.");
			external = `${this} looks at ${f.args[0]} ${text}`;
			internal = `You look at ${f.args[0]} ${text}`;
		} else if (chosen === 4) {
			external = `${this} seems resigned to its fate.`;
			internal = "You resign yourself to your fate.";
		}
		this.visible_message(`<span class='notice'>${external}</span>`, `<span class='revennotice'>${internal}</span>`);
	}
	return null;
});

rt.type(5083, "/mob/living/simple_animal/chick", "/mob/living/simple_animal", {
	amount_grown: 0,
	icon_living: "chick",
	icon_dead: "chick_dead",
	icon_gib: "chick_gib",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 2,
	turns_per_move: 2,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	pass_flags: 21,
	gold_core_spawnable: 2,
	name: "１chick",
	desc: "Adorable! They make such a racket though.",
	icon_state: "chick",
	gender: "female",
	density: 0,
	butcher_results: null,
	health: 3,
	maxHealth: 3,
	ventcrawler: 2,
	mob_size: 0,
});

// farm_animals.dm:177
rt.def("/mob/living/simple_animal/chick/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Cherp.", "Cherp?", "Chirrup.", "Cheep!");

	this.speak_emote = list("cheeps");

	this.emote_hear = list("cheeps.");
	this.emote_see = list("pecks at the ground.", "flaps its tiny wings.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]);
	return f.dot;
});

// farm_animals.dm:197
rt.def("/mob/living/simple_animal/chick/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.pixel_x = rand(-6, 6);
	this.pixel_y = rand(0, 10);
	return f.dot;
}, true);

// farm_animals.dm:202
rt.def("/mob/living/simple_animal/chick/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	if (!(!this.stat && !this.ckey)) return f.dot;
	if (!((this.amount_grown += rand(1, 2)) >= 100)) return f.dot;
	yield* new_(T("/mob/living/simple_animal/chicken"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(5084, "/mob/living/simple_animal/chick/holo", "/mob/living/simple_animal/chick", {});

// farm_animals.dm:212
rt.def("/mob/living/simple_animal/chick/holo/proc/Life", function Life(f: Frame) {
	parent_proc();
	this.amount_grown = 0;
	return f.dot;
}, false, { waitfor: false });

rt.type(5069, "/mob/living/simple_animal/chicken", "/mob/living/simple_animal", {
	eggsleft: 0,
	eggsFertile: 1,
	body_color: null,
	icon_prefix: "chicken",
	feedMessages: null,
	layMessage: null,
	validColors: null,
	egg_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg"),
	food_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/grown/wheat"),
	pass_flags: 17,
	name: "１chicken",
	desc: "Hopefully the eggs are good this season.",
	gender: "female",
	icon_state: "chicken_brown",
	icon_living: "chicken_brown",
	icon_dead: "chicken_brown_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	density: 0,
	speak_chance: 2,
	turns_per_move: 3,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	attacktext: "kicks",
	health: 15,
	maxHealth: 15,
	ventcrawler: 2,
	mob_size: 1,
	gold_core_spawnable: 2,
}, { global: { chicken_count: 725 } });

// farm_animals.dm:224
rt.def("/mob/living/simple_animal/chicken/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.feedMessages = list("It clucks happily.", "It clucks happily.");
	this.layMessage = list("lays an egg.", "squats down and croons.", "begins making a huge racket.", "begins clucking raucously.");
	this.validColors = list("brown", "black", "white");
	this.speak = list("Cluck!", "BWAAAAARK BWAK BWAK BWAK!", "Bwaak bwak.");
	this.speak_emote = list("clucks", "croons");

	this.emote_hear = list("clucks.");
	this.emote_see = list("pecks at the ground.", "flaps its wings viciously.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]);
	return f.dot;
});

// farm_animals.dm:252
rt.def("/mob/living/simple_animal/chicken/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.body_color) {
		this.body_color = pick(this.validColors);
	}
	this.icon_state = `${this.icon_prefix}_${this.body_color}`;
	this.icon_living = `${this.icon_prefix}_${this.body_color}`;
	this.icon_dead = `${this.icon_prefix}_${this.body_color}_dead`;
	this.pixel_x = rand(-6, 6);
	this.pixel_y = rand(0, 10);
	++GLOB.chicken_count;
	return f.dot;
}, true);

// farm_animals.dm:263
rt.def("/mob/living/simple_animal/chicken/proc/Destroy", function* Destroy(f: Frame) {
	--GLOB.chicken_count;
	return (yield* parent_proc());
}, true);

// farm_animals.dm:267
rt.def("/mob/living/simple_animal/chicken/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let feedmsg: Value = null;
	if (rt.op(f, "IsType", [], [O, this.food_type])) {
		if (!this.stat && this.eggsleft < 8) {
			feedmsg = `${user} feeds ${O} to ${this.name}! ${pick(this.feedMessages)}`;
			user.visible_message(feedmsg);
			yield* user.drop_item();
			yield* qdel(O);
			this.eggsleft += rand(1, 4);
		} else {
			to_chat(user, `<span class='warning'>${this.name} doesn't seem hungry!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// farm_animals.dm:281
rt.def("/mob/living/simple_animal/chicken/proc/Life", function* Life(f: Frame) {
	let E: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	if (!(!this.stat && prob(3) && this.eggsleft > 0 && this.egg_type)) return f.dot;
	this.visible_message(`${this} ${pick(this.layMessage)}`);
	this.eggsleft--;
	(E = (yield* new_(this.egg_type, rt.getStep(f, this, 0)))).pixel_x = rand(-6, 6);
	E.pixel_y = rand(-6, 6);
	if (!this.eggsFertile) return f.dot;
	if (!(GLOB.chicken_count < MAX_CHICKENS && prob(25))) return f.dot;
	if (E.isprocessing) return f.dot;
	E.isprocessing = 1;
	GLOB.SSobj.processing += E;
	return f.dot;
}, true, { waitfor: false });

// farm_animals.dm:296
rt.def("/obj/item/weapon/reagent_containers/food/snacks/egg/proc/process", function* process(f: Frame) {
	if (isturf(this.loc)) {
		if ((this.amount_grown += rand(1, 2)) >= 100) {
			this.visible_message(`${this} hatches with a quiet cracking sound.`);
			yield* new_(T("/mob/living/simple_animal/chick"), rt.getStep(f, this, 0));
			this.isprocessing = 0;
			GLOB.SSobj.processing -= this;
			yield* qdel(this);
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(10121, "/obj/item/udder", "/obj/item", {
	name: "udder",
});

// farm_animals.dm:311
rt.def("/obj/item/udder/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.create_reagents(50);
	yield* this.reagents.add_reagent("milk", 20);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// farm_animals.dm:316
rt.def("/obj/item/udder/proc/generateMilk", function* generateMilk(f: Frame) {
	if (!prob(5)) return f.dot;
	yield* this.reagents.add_reagent("milk", rand(5, 10));
	return f.dot;
}, true);

// farm_animals.dm:320
rt.def("/obj/item/udder/proc/milkAnimal", function* milkAnimal(f: Frame, O: Value, user: Value) {
	let G: Value = null, transfered: Value = null;
	if ((G = O).reagents.total_volume >= G.volume) {
		to_chat(user, `<span class='danger'>${O} is full.</span>`);
		return f.dot;
	}
	if (transfered = (yield* this.reagents.trans_to(O, rand(5, 10)))) {
		user.visible_message(fmt("＀ milks ＀ using ％！.", [user, this, O]), fmt("<span class='notice'>You milk ＀ using ％！.</span>", [this, O]));
	} else {
		to_chat(user, "<span class='danger'>The udder is dry. Wait a bit longer...</span>");
	}
	return f.dot;
}, true);
