// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/mouse.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5085, "/mob/living/simple_animal/mouse", "/mob/living/simple_animal", {
	body_color: null,
	chew_probability: 1,
	icon_living: "mouse_gray",
	icon_dead: "mouse_gray_dead",
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "splats",
	pass_flags: 21,
	gold_core_spawnable: 2,
	name: "mouse",
	desc: "It's a nasty, ugly, evil, disease-ridden rodent.",
	icon_state: "mouse_gray",
	see_in_dark: 6,
	maxHealth: 5,
	health: 5,
	butcher_results: null,
	density: 0,
	ventcrawler: 2,
	mob_size: 0,
});

// mouse.dm:8
rt.def("/mob/living/simple_animal/mouse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak = list("Squeek!", "SQUEEK!", "Squeek?");

	this.speak_emote = list("squeeks");

	this.emote_hear = list("squeeks.");
	this.emote_see = list("runs in a circle.", "shakes.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab"), 1]);
	return f.dot;
});

// mouse.dm:29
rt.def("/mob/living/simple_animal/mouse/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!this.body_color) {
		this.body_color = pick(list("brown", "gray", "white"));
	}
	this.icon_state = `mouse_${this.body_color}`;
	this.icon_living = `mouse_${this.body_color}`;
	this.icon_dead = `mouse_${this.body_color}_dead`;
	return f.dot;
}, true);

// mouse.dm:38
rt.def("/mob/living/simple_animal/mouse/proc/splat", function* splat(f: Frame) {
	this.health = 0;
	this.icon_dead = `mouse_${this.body_color}_splat`;
	yield* this.death();
	return f.dot;
}, true);

// mouse.dm:43
rt.def("/mob/living/simple_animal/mouse/proc/death", function* death(f: Frame, gibbed: Value, toast: Value) {
	let M: Value = null;
	if (!this.ckey) {
		yield* parent_proc(1);
		(M = (yield* new_(T("/obj/item/trash/deadmouse"), this.loc))).icon_state = this.icon_dead;
		M.name = this.name;
		if (toast) {
			M.add_atom_colour("#3A3A3A", FIXED_COLOUR_PRIORITY);
			M.desc = "It's toast.";
		}
		yield* qdel(this);
	} else {
		yield* parent_proc(gibbed);
	}
	return f.dot;
}, true);

// mouse.dm:56
rt.def("/mob/living/simple_animal/mouse/proc/Crossed", function Crossed(f: Frame, AM: Value) {
	let M: Value = null;
	if (rt.istype(AM, T("/mob/living/carbon/human"))) {
		if (!this.stat) {
			to_chat((M = AM), `<span class='notice'>${bicon(this)} Squeek!</span>`);
			playsound(this, rt.rsc("sound/effects/mousesqueek.ogg"), 100, 1);
		}
	}
	parent_proc();
	return f.dot;
}, false);

// mouse.dm:64
rt.def("/mob/living/simple_animal/mouse/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let F: Value = null, C: Value = null;
	if (!prob(this.chew_probability)) return f.dot;
	if (!(rt.istype((F = rt.getStep(f, this, 0)), T("/turf/open/floor")) && !F.intact)) return f.dot;
	if (!((C = rt.locateIn(f, T("/obj/structure/cable"), F)) && prob(15))) return f.dot;
	if (C.avail()) {
		this.visible_message(`<span class='warning'>${this} chews through the ${C}. It's toast!</span>`);
		playsound(this, rt.rsc("sound/effects/sparks2.ogg"), 100, 1);
		yield* C.deconstruct();
		yield* this.death({ toast: 1 });
	} else {
		yield* C.deconstruct();
		this.visible_message(`<span class='warning'>${this} chews through the ${C}.</span>`);
	}
	return f.dot;
}, true, { waitfor: false });
