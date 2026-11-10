// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/dog.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(5050, "/mob/living/simple_animal/pet/dog", "/mob/living/simple_animal/pet", {
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	faction: null,
	see_in_dark: 5,
	speak_chance: 1,
	turns_per_move: 10,
});

// dog.dm:11
rt.def("/mob/living/simple_animal/pet/dog/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("YAP", "Woof!", "Bark!", "AUUUUUU");
	this.speak_emote = list("barks", "woofs");
	this.emote_hear = list("barks!", "woofs!", "yaps.", "pants.");
	this.emote_see = list("shakes its head.", "chases its tail.", "shivers.");

	this.faction = list("dog");
	return f.dot;
});

rt.type(5051, "/mob/living/simple_animal/pet/dog/corgi", "/mob/living/simple_animal/pet/dog", {
	shaved: 0,
	inventory_head: null,
	inventory_back: null,
	facehugger: null,
	nofur: 0,
	name: "１corgi",
	real_name: "corgi",
	desc: "It's a corgi.",
	icon_state: "corgi",
	icon_living: "corgi",
	icon_dead: "corgi_dead",
	butcher_results: null,
	childtype: null,
	animal_species: rt.typePath("/mob/living/simple_animal/pet/dog"),
	gold_core_spawnable: 2,
});

// dog.dm:25
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/corgi"), 3, T("/obj/item/stack/sheet/animalhide/corgi"), 1]);

	this.childtype = rt.alist(f, [T("/mob/living/simple_animal/pet/dog/corgi/puppy"), 95, T("/mob/living/simple_animal/pet/dog/corgi/puppy/void"), 5]);
	return f.dot;
});

rt.type(5056, "/mob/living/simple_animal/pet/dog/pug", "/mob/living/simple_animal/pet/dog", {
	name: "１pug",
	real_name: "pug",
	desc: "It's a pug.",
	icon: rt.rsc("icons/mob/pets.dmi"),
	icon_state: "pug",
	icon_living: "pug",
	icon_dead: "pug_dead",
	butcher_results: null,
	gold_core_spawnable: 2,
});

// dog.dm:43
rt.def("/mob/living/simple_animal/pet/dog/pug/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/pug"), 3]);
	return f.dot;
});

// dog.dm:47
rt.def("/mob/living/simple_animal/pet/dog/proc/Initialize", function* Initialize(f: Frame) {
	let D: Value = null;
	f.dot = (yield* parent_proc());
	let dog_area: Value = get_area(this);
	for (D of each(dog_area, T("/obj/structure/bed/dogbed"))) {
		if (!D.owner) {
			D.update_owner(this);
			break;
		}
	}
	return f.dot;
}, true);

// dog.dm:55
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.regenerate_icons();
	return f.dot;
}, true);

// dog.dm:60
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc(gibbed);
	yield* this.regenerate_icons();
	return f.dot;
}, true);

// dog.dm:64
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* user.set_machine(this);
	if (user.stat) {
		return f.dot;
	}
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// dog.dm:85
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let armorval: Value = 0;
	if (def_zone) {
		if (def_zone == "head") {
			if (this.inventory_head) {
				armorval = rt.index(this.inventory_head.armor, type);
			}
		} else if (this.inventory_back) {
			armorval = rt.index(this.inventory_back.armor, type);
		}
		return armorval;
	} else {
		if (this.inventory_head) {
			armorval += rt.index(this.inventory_head.armor, type);
		}
		if (this.inventory_back) {
			armorval += rt.index(this.inventory_back.armor, type);
		}
	}
	return armorval * 0.5;
});

// dog.dm:100
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/razor"))) {
		if (this.shaved) {
			to_chat(user, "<span class='warning'>You can't shave this corgi, it's already been shaved!</span>");
			return f.dot;
		}
		if (this.nofur) {
			to_chat(user, "<span class='warning'> You can't shave this corgi, it doesn't have a fur coat!</span>");
			return f.dot;
		}
		user.visible_message(fmt("＀ starts to shave ＀ using ％！.", [user, this, O]), fmt("<span class='notice'>You start to shave ＀ using ％！...</span>", [this, O]));
		if (yield* do_after(user, 50, { target: this })) {
			user.visible_message(fmt("＀ shaves ＀'s hair using ％！.", [user, this, O]));
			playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 20, 1);
			this.shaved = 1;
			this.icon_living = `${rt.initial(f, this, "icon_living")}_shaved`;
			this.icon_dead = `${rt.initial(f, this, "icon_living")}_shaved_dead`;
			if (this.stat == 0) {
				this.icon_state = this.icon_living;
			} else {
				this.icon_state = this.icon_dead;
			}
		}
		return f.dot;
	}
	yield* parent_proc();
	yield* this.update_corgi_fluff();
	return f.dot;
}, true);

// dog.dm:125
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let remove_from: Value = null, add_to: Value = null, item_to_add: Value = null, allowed: Value = null, i: Value = null;
	let $e: any;
	// tg_js: incapacitated too (cuffed, stunned), as the other strip menus' canUseTopic does
	if (f.usr.stat || f.usr.incapacitated()) {
		return f.dot;
	}
	if (rt.at(href_list, "remove_inv")) {
		if (!this.Adjacent(f.usr) || !(rt.istype(f.usr, T("/mob/living/carbon/human")) || rt.istype(f.usr, T("/mob/living/carbon/monkey")) || rt.istype(f.usr, T("/mob/living/silicon/robot")) || rt.istype(f.usr, T("/mob/living/carbon/alien/humanoid")))) {
			return f.dot;
		}
		const subject = (remove_from = rt.at(href_list, "remove_inv"));
		if (subject === "head") {
			if (this.inventory_head) {
				this.inventory_head.loc = this.loc;
				this.inventory_head = null;
				yield* this.update_corgi_fluff();
				yield* this.regenerate_icons();
			} else {
				to_chat(f.usr, `<span class='danger'>There is nothing to remove from its ${remove_from}.</span>`);
				return f.dot;
			}
		} else if (subject === "back") {
			if (this.inventory_back) {
				this.inventory_back.loc = this.loc;
				this.inventory_back = null;
				yield* this.update_corgi_fluff();
				yield* this.regenerate_icons();
			} else {
				to_chat(f.usr, `<span class='danger'>There is nothing to remove from its ${remove_from}.</span>`);
				return f.dot;
			}
		}
		yield* this.show_inv(f.usr);
	} else if (rt.at(href_list, "add_inv")) {
		if (!this.Adjacent(f.usr) || !(rt.istype(f.usr, T("/mob/living/carbon/human")) || rt.istype(f.usr, T("/mob/living/carbon/monkey")) || rt.istype(f.usr, T("/mob/living/silicon/robot")) || rt.istype(f.usr, T("/mob/living/carbon/alien/humanoid")))) {
			return f.dot;
		}
		const subject = (add_to = rt.at(href_list, "add_inv"));
		if (subject === "head") {
			yield* this.place_on_head(f.usr.get_active_held_item(), f.usr);
		} else if (subject === "back") {
			if (this.inventory_back) {
				to_chat(f.usr, "<span class='warning'>It's already wearing something!</span>");
				return f.dot;
			} else {
				if (!(item_to_add = f.usr.get_active_held_item())) {
					f.usr.visible_message(`${f.usr} pets ${this}.`, `<span class='notice'>You rest your hand on ${this}'s back for a moment.</span>`);
					return f.dot;
				}
				if (!(yield* f.usr.drop_item())) {
					to_chat(f.usr, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it on ＀'s back!</span>", [item_to_add, this]));
					return f.dot;
				}
				if (rt.istype(item_to_add, T("/obj/item/weapon/grenade/plastic"))) {
					yield* item_to_add.afterattack(this, f.usr, 1);
					return f.dot;
				}
				allowed = 0;
				if (ispath(item_to_add.dog_fashion, T("/datum/dog_fashion/back"))) {
					allowed = 1;
				}
				if (!allowed) {
					to_chat(f.usr, `<span class='warning'>You set ${item_to_add} on ${this}'s back, but it falls off!</span>`);
					item_to_add.loc = this.loc;
					if (prob(25)) {
						yield* step_rand(item_to_add);
					}
					for (i of each(list(1, 2, 4, 8, 4, 8, 4, this.dir))) {
						yield* this.setDir(i);
						yield* sleep(1);
					}
					return f.dot;
				}
				yield* f.usr.drop_item();
				item_to_add.loc = this;
				this.inventory_back = item_to_add;
				yield* this.update_corgi_fluff();
				yield* this.regenerate_icons();
			}
		}
		yield* this.show_inv(f.usr);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// dog.dm:216
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/place_on_head", function* place_on_head(f: Frame, item_to_add: Value, user: Value) {
	let i: Value = null;
	if (rt.istype(item_to_add, T("/obj/item/weapon/grenade/plastic"))) {
		yield* item_to_add.afterattack(this, user, 1);
		return f.dot;
	}
	if (this.inventory_head) {
		if (user) {
			to_chat(user, `<span class='warning'>You can't put more than one hat on ${this}!</span>`);
		}
		return f.dot;
	}
	if (!item_to_add) {
		user.visible_message(`${user} pets ${this}.`, `<span class='notice'>You rest your hand on ${this}'s head for a moment.</span>`);
		return f.dot;
	}
	if (user && !(yield* user.drop_item())) {
		to_chat(user, fmt("<span class='warning'>＄！ is stuck to your hand, you cannot put it on ＀'s head!</span>", [item_to_add, this]));
		return 0;
	}
	let valid: Value = 0;
	if (ispath(item_to_add.dog_fashion, T("/datum/dog_fashion/head"))) {
		valid = 1;
	}
	if (valid) {
		if (this.health <= 0) {
			to_chat(user, `<span class ='notice'>There is merely a dull, lifeless look in ${this.real_name}'s eyes as you put the ${item_to_add} on ${this.p_them()}.</span>`);
		} else if (user) {
			user.visible_message(`${user} puts ${item_to_add} on ${this.real_name}'s head.  ${this} looks at ${user} and barks once.`, `<span class='notice'>You put ${item_to_add} on ${this.real_name}'s head.  ${this} gives you a peculiar look, then wags ${this.p_their()} tail once and barks.</span>`, "<span class='italics'>You hear a friendly-sounding bark.</span>");
		}
		item_to_add.loc = this;
		this.inventory_head = item_to_add;
		yield* this.update_corgi_fluff();
		yield* this.regenerate_icons();
	} else {
		to_chat(user, `<span class='warning'>You set ${item_to_add} on ${this}'s head, but it falls off!</span>`);
		item_to_add.loc = this.loc;
		if (prob(25)) {
			yield* step_rand(item_to_add);
		}
		for (i of each(list(1, 2, 4, 8, 4, 8, 4, this.dir))) {
			yield* this.setDir(i);
			yield* sleep(1);
		}
	}
	return valid;
}, true);

// dog.dm:262
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/update_corgi_fluff", function* update_corgi_fluff(f: Frame) {
	let DF: Value = null;
	this.name = this.real_name;
	this.desc = rt.initial(f, this, "desc");
	this.speak = list("YAP", "Woof!", "Bark!", "AUUUUUU");
	this.speak_emote = list("barks", "woofs");
	this.emote_hear = list("barks!", "woofs!", "yaps.", "pants.");
	this.emote_see = list("shakes its head.", "chases its tail.", "shivers.");
	this.desc = rt.initial(f, this, "desc");
	this.set_light(0);
	if (this.inventory_head && this.inventory_head.dog_fashion) {
		yield* g.callName(f, (DF = (yield* new_(this.inventory_head.dog_fashion, this))), "apply", [this]);
	}
	if (!(this.inventory_back && this.inventory_back.dog_fashion)) return f.dot;
	yield* g.callName(f, (DF = (yield* new_(this.inventory_back.dog_fashion, this))), "apply", [this]);
	return f.dot;
}, true);

rt.type(5052, "/mob/living/simple_animal/pet/dog/corgi/Ian", "/mob/living/simple_animal/pet/dog/corgi", {
	turns_since_scan: 0,
	movement_target: null,
	age: 0,
	record_age: 1,
	memory_saved: 0,
	saved_head: null,
	name: "Ian",
	real_name: "Ian",
	gender: "male",
	desc: "It's the HoP's beloved corgi.",
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	gold_core_spawnable: 0,
});

// dog.dm:298
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Initialize", function* Initialize(f: Frame) {
	let target: Value = null, _P: Value = null;
	yield* parent_proc();
	yield* this.Read_Memory();
	if (this.age == 0) {
		if (target = rt.getStep(f, this.loc, 0)) {
			(_P = (yield* new_(T("/mob/living/simple_animal/pet/dog/corgi/puppy"), target))).name = "Ian";
			_P.real_name = "Ian";
			_P.gender = "male";
			_P.desc = "It's the HoP's beloved corgi puppy.";
			this.Write_Memory(0);
			yield* qdel(this);
		}
	} else {
		if (this.age != this.record_age) return f.dot;
		this.icon_state = "old_corgi";
		this.icon_living = "old_corgi";
		this.icon_dead = "old_corgi_dead";
		this.desc = `At a ripe old age of ${this.record_age} Ian's not as spry as he used to be, but he'll always be the HoP's beloved corgi.`;
		this.turns_per_move = 20;
	}
	return f.dot;
}, true);

// dog.dm:320
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life", function Life(f: Frame) {
	if (GLOB.SSticker.current_state == GAME_STATE_FINISHED && !this.memory_saved) {
		this.Write_Memory(0);
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// dog.dm:325
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/death", function* death(f: Frame) {
	if (!this.memory_saved) {
		this.Write_Memory(1);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// dog.dm:330
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Read_Memory", function* Read_Memory(f: Frame) {
	let S: Value = null;
	this.age = rt.input(f, rt.R.index, null, [(S = (yield* new_(T("/savefile"), "data/npc_saves/Ian.sav"))), "age"]);
	this.record_age = rt.input(f, rt.R.index, null, [S, "record_age"]);
	this.saved_head = rt.input(f, rt.R.index, null, [S, "saved_head"]);
	if (this.age === null) {
		this.age = 0;
	}
	if (this.record_age === null) {
		this.record_age = 1;
	}
	if (!this.saved_head) return f.dot;
	yield* this.place_on_head((yield* new_(this.saved_head)));
	return f.dot;
}, true);

// dog.dm:344
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Write_Memory", function Write_Memory(f: Frame, dead: Value) {
	let S: Value = new_(T("/savefile"), "data/npc_saves/Ian.sav");
	if (!dead) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "age", this.age + 1], false);
		if (this.age + 1 > this.record_age) {
			rt.op(f, "OutputReference", [rt.R.index], [S, "record_age", this.record_age + 1], false);
		}
		if (this.inventory_head) {
			rt.op(f, "OutputReference", [rt.R.index], [S, "saved_head", this.inventory_head.type], false);
		}
	} else {
		rt.op(f, "OutputReference", [rt.R.index], [S, "age", 0], false);
		rt.op(f, "OutputReference", [rt.R.index], [S, "saved_head", null], false);
	}
	this.memory_saved = 1;
	return f.dot;
});

// dog.dm:358
rt.def("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life", function* Life(f: Frame) {
	let S: Value = null, i: Value = null;
	yield* parent_proc();
	if (!(!this.stat && !this.resting && !this.buckled)) return f.dot;
	this.turns_since_scan++;
	if (this.turns_since_scan > 5) {
		this.turns_since_scan = 0;
		if (this.movement_target && !(isturf(this.movement_target.loc) || rt.istype(this.movement_target.loc, T("/mob/living/carbon/human")))) {
			this.movement_target = null;
			this.stop_automated_movement = 0;
		}
		if (!this.movement_target || !rt.isIn(f, this.movement_target.loc, oview(this, 3))) {
			this.movement_target = null;
			this.stop_automated_movement = 0;
			for (S of each(oview(this, 3), T("/obj/item/weapon/reagent_containers/food/snacks"))) {
				if (isturf(S.loc) || rt.istype(S.loc, T("/mob/living/carbon/human"))) {
					this.movement_target = S;
					break;
				}
			}
		}
		if (this.movement_target) {
			this.stop_automated_movement = 1;
			yield* step_to(this, this.movement_target, 1);
			yield* sleep(3);
			yield* step_to(this, this.movement_target, 1);
			yield* sleep(3);
			yield* step_to(this, this.movement_target, 1);
			if (this.movement_target) {
				if (this.movement_target.loc.x < this.x) {
					yield* this.setDir(8);
				} else if (this.movement_target.loc.x > this.x) {
					yield* this.setDir(4);
				} else if (this.movement_target.loc.y < this.y) {
					yield* this.setDir(2);
				} else if (this.movement_target.loc.y > this.y) {
					yield* this.setDir(1);
				} else {
					yield* this.setDir(2);
				}
				if (!this.Adjacent(this.movement_target)) {
					return f.dot;
				}
				if (isturf(this.movement_target.loc)) {
					yield* this.movement_target.attack_animal(this);
				} else if (rt.istype(this.movement_target.loc, T("/mob/living/carbon/human"))) {
					if (prob(20)) {
						yield* this.emote("me", 1, `stares at ${this.movement_target.loc}'s ${this.movement_target} with a sad puppy-face`);
					}
				}
			}
		}
	}
	if (!prob(1)) return f.dot;
	yield* this.emote("me", 1, pick("dances around.", "chases its tail!"));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:406", S, i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/corgi/Ian/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:406", function* (f: Frame, S: Value, i: Value) {
	i = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
		yield* this.setDir(i);
		yield* sleep(1);
	}
	return null;
});

// dog.dm:414
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/regenerate_icons", function* regenerate_icons(f: Frame) {
	let head_icon: Value = null, DF: Value = null, back_icon: Value = null, facehugger_overlay: Value = null;
	this.cut_overlays();
	if (this.inventory_head) {
		if (!(DF = (yield* new_(this.inventory_head.dog_fashion, this))).obj_icon_state) {
			DF.obj_icon_state = this.inventory_head.icon_state;
		}
		if (!DF.obj_alpha) {
			DF.obj_alpha = this.inventory_head.alpha;
		}
		if (!DF.obj_color) {
			DF.obj_color = this.inventory_head.color;
		}
		if (this.health <= 0) {
			(head_icon = (yield* DF.get_overlay({ dir: 4 }))).pixel_y = -8;
			head_icon.transform = turn(head_icon.transform, 180);
		} else {
			head_icon = DF.get_overlay();
		}
		this.add_overlay(head_icon);
	}
	if (this.inventory_back) {
		if (!(DF = (yield* new_(this.inventory_back.dog_fashion, this))).obj_icon_state) {
			DF.obj_icon_state = this.inventory_back.icon_state;
		}
		if (!DF.obj_alpha) {
			DF.obj_alpha = this.inventory_back.alpha;
		}
		if (!DF.obj_color) {
			DF.obj_color = this.inventory_back.color;
		}
		if (this.health <= 0) {
			(back_icon = (yield* DF.get_overlay({ dir: 4 }))).pixel_y = -11;
			back_icon.transform = turn(back_icon.transform, 180);
		} else {
			back_icon = DF.get_overlay();
		}
		this.add_overlay(back_icon);
	}
	if (this.facehugger) {
		facehugger_overlay = mutable_appearance(rt.rsc("icons/mob/mask.dmi"));
		if (rt.istype(this, T("/mob/living/simple_animal/pet/dog/corgi/puppy"))) {
			facehugger_overlay.icon_state = "facehugger_corgipuppy";
		} else {
			facehugger_overlay.icon_state = "facehugger_corgi";
		}
		this.add_overlay(facehugger_overlay);
	}
	if (this.pcollar) {
		this.add_overlay(this.collar);
		this.add_overlay(this.pettag);
	}
	return f.dot;
}, true);

rt.type(5053, "/mob/living/simple_animal/pet/dog/corgi/puppy", "/mob/living/simple_animal/pet/dog/corgi", {
	pass_flags: 16,
	name: "１corgi puppy",
	real_name: "corgi",
	desc: "It's a corgi puppy!",
	icon_state: "puppy",
	icon_living: "puppy",
	icon_dead: "puppy_dead",
	density: 0,
	mob_size: 1,
});

// dog.dm:482
rt.def("/mob/living/simple_animal/pet/dog/corgi/puppy/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (rt.at(href_list, "remove_inv") || rt.at(href_list, "add_inv")) {
		to_chat(f.usr, `<span class='warning'>You can't fit this on ${this}!</span>`);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(5055, "/mob/living/simple_animal/pet/dog/corgi/Lisa", "/mob/living/simple_animal/pet/dog/corgi", {
	turns_since_scan: 0,
	puppies: 0,
	name: "Lisa",
	real_name: "Lisa",
	gender: "female",
	desc: "It's a corgi with a cute pink bow.",
	icon_state: "lisa",
	icon_living: "lisa",
	icon_dead: "lisa_dead",
	response_help: "pets",
	response_disarm: "bops",
	response_harm: "kicks",
	gold_core_spawnable: 0,
});

// dog.dm:522
rt.def("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	if (rt.at(href_list, "remove_inv") || rt.at(href_list, "add_inv")) {
		to_chat(f.usr, `<span class='danger'>${this} already has a cute bow!</span>`);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// dog.dm:528
rt.def("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life", function* Life(f: Frame) {
	let i: Value = null;
	yield* parent_proc();
	yield* this.make_babies();
	if (!(!this.stat && !this.resting && !this.buckled)) return f.dot;
	if (!prob(1)) return f.dot;
	yield* this.emote("me", 1, pick("dances around.", "chases her tail."));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:535", i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/corgi/Lisa/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:535", function* (f: Frame, i: Value) {
	i = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
		yield* this.setDir(i);
		yield* sleep(1);
	}
	return null;
});

// dog.dm:541
rt.def("/mob/living/simple_animal/pet/dog/pug/proc/Life", function* Life(f: Frame) {
	let i: Value = null;
	yield* parent_proc();
	if (!(!this.stat && !this.resting && !this.buckled)) return f.dot;
	if (!prob(1)) return f.dot;
	yield* this.emote("me", 1, pick("chases its tail."));
	rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/dog/pug/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:546", i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/pet/dog/pug/proc/Life, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/dog/pug/proc/Life: spawn at modules/mob/living/simple_animal/friendly/dog.dm:546", function* (f: Frame, i: Value) {
	i = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2, 1, 2, 4, 8, 4, 2))) {
		yield* this.setDir(i);
		yield* sleep(1);
	}
	return null;
});

// dog.dm:552
rt.def("/mob/living/simple_animal/pet/dog/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	f.dot = (yield* parent_proc());
	if (M.a_intent === "help") {
		yield* this.wuv(1, M);
	} else if (M.a_intent === "harm") {
		yield* this.wuv(-1, M);
	}
	return f.dot;
}, true);

// dog.dm:561
rt.def("/mob/living/simple_animal/pet/dog/proc/wuv", function* wuv(f: Frame, change: Value, M: Value) {
	if (!change) return f.dot;
	if (change > 0) {
		if (M && this.stat != 2) {
			yield* new_(T("/obj/effect/temp_visual/heart"), this.loc);
			yield* this.emote("me", 1, "yaps happily!");
		}
	} else {
		if (!(M && this.stat != 2)) return f.dot;
		yield* this.emote("me", 1, "growls!");
	}
	return f.dot;
}, true);
