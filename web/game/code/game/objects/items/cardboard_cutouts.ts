// Based on /tg/station's code/game/objects/items/cardboard_cutouts.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(9659, "/obj/item/cardboard_cutout", "/obj/item", {
	possible_appearances: null,
	pushed_over: 0,
	deceptive: 0,
	lastattacker: null,
	w_class: 4,
	name: "cardboard cutout",
	desc: "A vaguely humanoid cardboard cutout. It's completely blank.",
	icon: rt.rsc("icons/obj/cardboard_cutout.dmi"),
	icon_state: "cutout_basic",
	resistance_flags: 4,
});

// cardboard_cutouts.dm:22
rt.def("/obj/item/cardboard_cutout/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.a_intent == "help" || this.pushed_over) {
		return (yield* parent_proc());
	}
	user.visible_message(`<span class='warning'>${user} pushes over ${this}!</span>`, `<span class='danger'>You push over ${this}!</span>`);
	playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
	this.push_over();
	return f.dot;
}, true);

// cardboard_cutouts.dm:29
rt.def("/obj/item/cardboard_cutout/proc/push_over", function push_over(f: Frame) {
	this.name = rt.initial(f, this, "name");
	this.desc = `${rt.initial(f, this, "desc")} It's been pushed over.`;
	this.icon = rt.initial(f, this, "icon");
	this.icon_state = "cutout_pushed_over";
	this.remove_atom_colour(FIXED_COLOUR_PRIORITY);
	this.alpha = rt.initial(f, this, "alpha");
	this.pushed_over = 1;
	return f.dot;
});

// cardboard_cutouts.dm:38
rt.def("/obj/item/cardboard_cutout/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!this.pushed_over) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You right ${this}.</span>`);
	this.desc = rt.initial(f, this, "desc");
	this.icon = rt.initial(f, this, "icon");
	this.icon_state = rt.initial(f, this, "icon_state");
	this.pushed_over = 0;
	return f.dot;
});

// cardboard_cutouts.dm:47
rt.def("/obj/item/cardboard_cutout/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/toy/crayon"))) {
		yield* this.change_appearance(I, user);
		return f.dot;
	}
	if (rt.bitAnd(I.flags, NOBLUDGEON)) {
		return f.dot;
	}
	if (!I.force) {
		playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), this.get_clamped_volume(), 1, -1);
	} else if (I.hitsound) {
		playsound(this.loc, I.hitsound, this.get_clamped_volume(), 1, -1);
	}
	user.changeNext_move(8);
	yield* user.do_attack_animation(this);
	if (!I.force) return f.dot;
	user.visible_message(`<span class='danger'>${user} has hit ${this} with ${I}!</span>`, `<span class='danger'>You hit ${this} with ${I}!</span>`);
	if (!prob(I.force)) return f.dot;
	this.push_over();
	return f.dot;
}, true);

// cardboard_cutouts.dm:70
rt.def("/obj/item/cardboard_cutout/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	this.visible_message(`<span class='danger'>${this} has been hit by ${_P}!</span>`);
	playsound(this, rt.rsc("sound/weapons/slice.ogg"), 50, 1);
	if (!prob(_P.damage)) return f.dot;
	this.push_over();
	return f.dot;
});

// cardboard_cutouts.dm:76
rt.def("/obj/item/cardboard_cutout/proc/change_appearance", function* change_appearance(f: Frame, crayon: Value, user: Value) {
	let new_appearance: Value = null;
	if (!crayon || !user) {
		return f.dot;
	}
	if (this.pushed_over) {
		to_chat(user, `<span class='warning'>Right ${this} first!</span>`);
		return f.dot;
	}
	if (yield* crayon.check_empty(user)) {
		return f.dot;
	}
	if (crayon.is_capped) {
		to_chat(user, "<span class='warning'>Take the cap off first!</span>");
		return f.dot;
	}
	if (!(new_appearance = (yield* g.op(f, "Prompt", [1], [null, "26th Century Deception", `Choose a new appearance for ${this}.`, user, this.possible_appearances]))) || !crayon || !user.canUseTopic(this)) {
		return f.dot;
	}
	if (!(yield* do_after(user, 10, 0, this, 1))) {
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} gives ${this} a new look.</span>`, `<span class='notice'>Voila! You give ${this} a new look.</span>`);
	yield* crayon.use_charges(1);
	yield* crayon.check_empty(user);
	this.alpha = 255;
	this.icon = rt.initial(f, this, "icon");
	if (!this.deceptive) {
		this.add_atom_colour("#FFD7A7", FIXED_COLOUR_PRIORITY);
	}
	if (new_appearance === "Assistant") {
		this.name = `${pick(GLOB.first_names_male)} ${pick(GLOB.last_names)}`;
		this.desc = "A cardboat cutout of an assistant.";
		this.icon_state = "cutout_greytide";
	} else if (new_appearance === "Clown") {
		this.name = pick(GLOB.clown_names);
		this.desc = "A cardboard cutout of a clown. You get the feeling that it should be in a corner.";
		this.icon_state = "cutout_clown";
	} else if (new_appearance === "Mime") {
		this.name = pick(GLOB.mime_names);
		this.desc = "...(A cardboard cutout of a mime.)";
		this.icon_state = "cutout_mime";
	} else if (new_appearance === "Traitor") {
		this.name = `${pick("Unknown", "Captain")}`;
		this.desc = "A cardboard cutout of a traitor.";
		this.icon_state = "cutout_traitor";
	} else if (new_appearance === "Nuke Op") {
		this.name = `${pick("Unknown", "COMMS", "Telecomms", "AI", "stealthy op", "STEALTH", "sneakybeaky", "MEDIC", "Medic")}`;
		this.desc = "A cardboard cutout of a nuclear operative.";
		this.icon_state = "cutout_fluke";
	} else if (new_appearance === "Cultist") {
		this.name = "Unknown";
		this.desc = "A cardboard cutout of a cultist.";
		this.icon_state = "cutout_cultist";
	} else if (new_appearance === "Clockwork Cultist") {
		this.name = `${pick(GLOB.first_names_male)} ${pick(GLOB.last_names)}`;
		this.desc = "A cardboard cutout of a servant of Ratvar.";
		this.icon_state = "cutout_servant";
	} else if (new_appearance === "Revolutionary") {
		this.name = "Unknown";
		this.desc = "A cardboard cutout of a revolutionary.";
		this.icon_state = "cutout_viva";
	} else if (new_appearance === "Wizard") {
		this.name = `${pick(GLOB.wizard_first)}, ${pick(GLOB.wizard_second)}`;
		this.desc = "A cardboard cutout of a wizard.";
		this.icon_state = "cutout_wizard";
	} else if (new_appearance === "Shadowling") {
		this.name = "Unknown";
		this.desc = "A cardboard cutout of a shadowling.";
		this.icon_state = "cutout_shadowling";
	} else if (new_appearance === "Xenomorph") {
		this.name = `alien hunter (${rand(1, 999)})`;
		this.desc = "A cardboard cutout of a xenomorph.";
		this.icon_state = "cutout_fukken_xeno";
		if (prob(25)) {
			this.alpha = 75;
		}
	} else if (new_appearance === "Xenomorph Maid") {
		this.name = `lusty xenomorph maid (${rand(1, 999)})`;
		this.desc = "A cardboard cutout of a xenomorph maid.";
		this.icon_state = "cutout_lusty";
	} else if (new_appearance === "Swarmer") {
		this.name = `Swarmer (${rand(1, 999)})`;
		this.desc = "A cardboard cutout of a swarmer.";
		this.icon_state = "cutout_swarmer";
	} else if (new_appearance === "Ash Walker") {
		this.name = lizard_name(pick("male", "female"));
		this.desc = "A cardboard cutout of an ash walker.";
		this.icon_state = "cutout_free_antag";
	} else if (new_appearance === "Deathsquad Officer") {
		this.name = pick(GLOB.commando_names);
		this.desc = "A cardboard cutout of a death commando.";
		this.icon_state = "cutout_deathsquad";
	} else if (new_appearance === "Ian") {
		this.name = "Ian";
		this.desc = "A cardboard cutout of the HoP's beloved corgi.";
		this.icon_state = "cutout_ian";
	} else if (new_appearance === "Slaughter Demon") {
		this.name = "slaughter demon";
		this.desc = "A cardboard cutout of a slaughter demon.";
		this.icon = rt.rsc("icons/mob/mob.dmi");
		this.icon_state = "daemon";
	} else if (new_appearance === "Laughter Demon") {
		this.name = "laughter demon";
		this.desc = "A cardboard cutout of a laughter demon.";
		this.icon = rt.rsc("icons/mob/mob.dmi");
		this.icon_state = "bowmon";
	} else if (new_appearance === "Private Security Officer") {
		this.name = "Private Security Officer";
		this.desc = "A cardboard cutout of a private security officer.";
		this.icon_state = "cutout_ntsec";
	}
	return 1;
}, true);
