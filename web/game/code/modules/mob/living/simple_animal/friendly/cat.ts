// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/cat.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, fmt } = rt;


rt.type(5057, "/mob/living/simple_animal/pet/cat", "/mob/living/simple_animal/pet", {
	turns_since_scan: 0,
	movement_target: null,
	pass_flags: 1,
	name: "cat",
	desc: "Kitty!!",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "cat2",
	icon_living: "cat2",
	icon_dead: "cat2_dead",
	gender: "male",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	see_in_dark: 6,
	ventcrawler: 2,
	mob_size: 1,
	minbodytemp: 200,
	maxbodytemp: 400,
	unsuitable_atmos_damage: 1,
	animal_species: rt.typePath("/mob/living/simple_animal/pet/cat"),
	childtype: null,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "kicks",
	gold_core_spawnable: 2,
});

// cat.dm:24
rt.def("/mob/living/simple_animal/pet/cat/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Meow!", "Esp!", "Purr!", "HSSSSS");
	this.speak_emote = list("purrs", "meows");
	this.emote_hear = list("meows", "mews");
	this.emote_see = list("shakes its head", "shivers");

	this.childtype = list(T("/mob/living/simple_animal/pet/cat/kitten"));

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]);
	return f.dot;
});

// cat.dm:34
rt.def("/mob/living/simple_animal/pet/cat/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.verbs += P("/mob/living/proc/lay_down");
	return f.dot;
}, true);

// cat.dm:38
rt.def("/mob/living/simple_animal/pet/cat/proc/update_canmove", function* update_canmove(f: Frame) {
	yield* parent_proc();
	if (!this.client) return f.dot;
	if (this.resting) {
		this.icon_state = `${this.icon_living}_rest`;
	} else {
		this.icon_state = `${this.icon_living}`;
	}
	return f.dot;
}, true);

rt.type(5061, "/mob/living/simple_animal/pet/cat/Runtime", "/mob/living/simple_animal/pet/cat", {
	family: null,
	children: null,
	cats_deployed: 0,
	memory_saved: 0,
	name: "Runtime",
	desc: "GCAT",
	icon_state: "cat",
	icon_living: "cat",
	icon_dead: "cat_dead",
	gender: "female",
	gold_core_spawnable: 0,
});

// cat.dm:83
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.family = list();

	this.children = list();
	return f.dot;
});

// cat.dm:89
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Initialize", function* Initialize(f: Frame) {
	if (prob(5)) {
		this.icon_state = "original";
		this.icon_living = "original";
		this.icon_dead = "original_dead";
	}
	yield* this.Read_Memory();
	yield* parent_proc();
	return f.dot;
}, true);

// cat.dm:97
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Life", function* Life(f: Frame) {
	if (!this.cats_deployed && GLOB.SSticker.current_state >= GAME_STATE_SETTING_UP) {
		yield* this.Deploy_The_Cats();
	}
	if (!this.stat && GLOB.SSticker.current_state == GAME_STATE_FINISHED && !this.memory_saved) {
		this.Write_Memory();
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// cat.dm:104
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/make_babies", function* make_babies(f: Frame) {
	let baby: Value = null;
	if (!(baby = (yield* parent_proc()))) return f.dot;
	this.children += baby;
	return baby;
}, true);

// cat.dm:110
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/death", function* death(f: Frame) {
	if (!this.memory_saved) {
		this.Write_Memory(1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// cat.dm:115
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	this.family = rt.input(f, rt.R.index, null, [(S = new_(T("/savefile"), "data/npc_saves/Runtime.sav")), "family"]);
	if (this.family !== null) return f.dot;
	this.family = list();
	return f.dot;
});

// cat.dm:122
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value) {
	let C: Value = null;
	let S: Value = new_(T("/savefile"), "data/npc_saves/Runtime.sav");
	this.family = list();
	if (!dead) {
		for (C of each(this.children, T("/mob/living/simple_animal/pet/cat/kitten"))) {
			if (rt.op(f, "IsType", [], [C, this.type]) || C.stat || !C.z || !C.butcher_results) {
				continue;
			}
			if (rt.isIn(f, C.type, this.family)) {
				rt.modAt(this.family, C.type, 1, add);
			} else {
				rt.setAt(this.family, C.type, 1);
			}
		}
	}
	rt.op(f, "OutputReference", [rt.R.index], [S, "family", this.family], false);
	this.memory_saved = 1;
	return f.dot;
});

// cat.dm:137
rt.def("/mob/living/simple_animal/pet/cat/Runtime/proc/Deploy_The_Cats", function* Deploy_The_Cats(f: Frame) {
	let cat_type: Value = null, i: Value = null;
	let $e: any;
	this.cats_deployed = 1;
	for (cat_type of each(this.family)) {
		if (rt.index(this.family, cat_type) > 0) {
			i = null;
			rt.forRange(f, 1, 1, min(rt.index(this.family, cat_type), 100), 1);
			while (($e = rt.next(f, 1)) !== undefined) {
				i = $e;
				yield* new_(cat_type, this.loc);
			}
			rt.endFor(f, 1);
		}
	}
	return f.dot;
}, true);

// cat.dm:148
rt.def("/mob/living/simple_animal/pet/cat/proc/Life", function* Life(f: Frame) {
	let M: Value = null, _T: Value = null, snack: Value = null;
	if (!this.stat && !this.buckled && !this.client) {
		if (prob(1)) {
			yield* this.emote("me", 1, pick("stretches out for a belly rub.", "wags its tail.", "lies down."));
			this.icon_state = `${this.icon_living}_rest`;
			this.resting = 1;
			yield* this.update_canmove();
		} else if (prob(1)) {
			yield* this.emote("me", 1, pick("sits down.", "crouches on its hind legs.", "looks alert."));
			this.icon_state = `${this.icon_living}_sit`;
			this.resting = 1;
			yield* this.update_canmove();
		} else if (prob(1)) {
			if (this.resting) {
				yield* this.emote("me", 1, pick("gets up and meows.", "walks around.", "stops resting."));
				this.icon_state = `${this.icon_living}`;
				this.resting = 0;
				yield* this.update_canmove();
			} else {
				yield* this.emote("me", 1, pick("grooms its fur.", "twitches its whiskers.", "shakes out its coat."));
			}
		}
	}
	if (this.loc && isturf(this.loc)) {
		if (!this.stat && !this.resting && !this.buckled) {
			for (M of each(view(1, this), T("/mob/living/simple_animal/mouse"))) {
				if (!M.stat && this.Adjacent(M)) {
					yield* this.emote("me", 1, fmt("splats ％！!", [M]));
					yield* M.splat();
					this.movement_target = null;
					this.stop_automated_movement = 0;
					break;
				}
			}
			for (_T of each(view(1, this), T("/obj/item/toy/cattoy"))) {
				if (_T.cooldown < rt.worldTime(f) - 400) {
					yield* this.emote("me", 1, fmt("bats ％！ around with its paw!", [_T]));
					_T.cooldown = rt.worldTime(f);
				}
			}
		}
	}
	yield* parent_proc();
	yield* this.make_babies();
	if (!(!this.stat && !this.resting && !this.buckled)) return f.dot;
	this.turns_since_scan++;
	if (!(this.turns_since_scan > 5)) return f.dot;
	walk_to(this, 0);
	this.turns_since_scan = 0;
	if (this.movement_target && !(isturf(this.movement_target.loc) || rt.istype(this.movement_target.loc, T("/mob/living/carbon/human")))) {
		this.movement_target = null;
		this.stop_automated_movement = 0;
	}
	if (!this.movement_target || !rt.isIn(f, this.movement_target.loc, oview(this, 3))) {
		this.movement_target = null;
		this.stop_automated_movement = 0;
		for (snack of each(oview(this, 3), T("/mob/living/simple_animal/mouse"))) {
			if (isturf(snack.loc) && !snack.stat) {
				this.movement_target = snack;
				break;
			}
		}
	}
	if (!this.movement_target) return f.dot;
	this.stop_automated_movement = 1;
	walk_to(this, this.movement_target, 0, 3);
	return f.dot;
}, true, { waitfor: false });

// cat.dm:207
rt.def("/mob/living/simple_animal/pet/cat/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	f.dot = (yield* parent_proc());
	if (M.a_intent === "help") {
		yield* this.wuv(1, M);
	} else if (M.a_intent === "harm") {
		yield* this.wuv(-1, M);
	}
	return f.dot;
}, true);

// cat.dm:216
rt.def("/mob/living/simple_animal/pet/cat/proc/wuv", function* wuv(f: Frame, change: Value, M: Value) {
	if (!change) return f.dot;
	if (change > 0) {
		if (M && this.stat != 2) {
			yield* new_(T("/obj/effect/temp_visual/heart"), this.loc);
			yield* this.emote("me", 1, "purrs!");
		}
	} else {
		if (!(M && this.stat != 2)) return f.dot;
		yield* this.emote("me", 1, "hisses!");
	}
	return f.dot;
}, true);

rt.type(5063, "/mob/living/simple_animal/pet/cat/cak", "/mob/living/simple_animal/pet/cat", {
	name: "Keeki",
	desc: "It's a cat made out of cake.",
	icon_state: "cak",
	icon_living: "cak",
	icon_dead: "cak_dead",
	health: 50,
	maxHealth: 50,
	gender: "female",
	harm_intent_damage: 10,
	butcher_results: null,
	response_harm: "takes a bite out of",
	attacked_sound: rt.rsc("sound/items/eatfood.ogg"),
	deathmessage: "loses its false life and collapses!",
	death_sound: "bodyfall",
});

// cat.dm:234
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/organ/brain"), 1, T("/obj/item/organ/heart"), 1, T("/obj/item/weapon/reagent_containers/food/snacks/cakeslice/birthday"), 3, T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 2]);
	return f.dot;
});

// cat.dm:242
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/CheckParts", function* CheckParts(f: Frame, parts: Value) {
	let B: Value = null, new_name: Value = null;
	yield* parent_proc();
	if (!(B = rt.locateIn(f, T("/obj/item/organ/brain"), this.contents)) || !B.brainmob || !B.brainmob.mind) {
		return f.dot;
	}
	yield* B.brainmob.mind.transfer_to(this);
	to_chat(this, "<font size=3><b>Y</b></font><b>ou are a cak! You're a harmless cat/cake hybrid that everyone loves. People can take bites out of you if they're hungry, but you regenerate health so quickly that it generally doesn't matter. You're remarkably resilient to any damage besides this and it's hard for you to really die at all. You should go around and bring happiness and free cake to the station!</b>");
	if (!(new_name = (yield* stripped_input(this, "Enter your name, or press \"Cancel\" to stick with Keeki.", "Name Change")))) return f.dot;
	to_chat(this, "<span class='notice'>Your name is now <b>\"new_name\"</b>!</span>");
	this.name = new_name;
	return f.dot;
}, true);

// cat.dm:256
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/Life", function* Life(f: Frame) {
	let D: Value = null;
	yield* parent_proc();
	if (this.stat) {
		return f.dot;
	}
	if (this.health < this.maxHealth) {
		yield* this.adjustBruteLoss(-8);
	}
	for (D of each(range(1, this), T("/obj/item/weapon/reagent_containers/food/snacks/donut"))) {
		if (D.icon_state != "donut2") {
			D.name = "frosted donut";
			D.icon_state = "donut2";
			yield* D.reagents.add_reagent("sprinkles", 2);
			D.bonus_reagents = rt.alist(f, ["sprinkles", 2, "sugar", 1]);
			D.filling_color = "#FF69B4";
		}
	}
	return f.dot;
}, true, { waitfor: false });

// cat.dm:270
rt.def("/mob/living/simple_animal/pet/cat/cak/proc/attack_hand", function* attack_hand(f: Frame, L: Value) {
	yield* parent_proc();
	if (!(L.a_intent == "harm" && L.reagents && !this.stat)) return f.dot;
	yield* L.reagents.add_reagent("nutriment", 0.4);
	yield* L.reagents.add_reagent("vitamin", 0.4);
	return f.dot;
}, true);
