// Based on /tg/station's code/modules/mob/living/simple_animal/parrot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(5074, "/mob/living/simple_animal/parrot", "/mob/living/simple_animal", {
	parrot_damage_upper: 10,
	parrot_state: 4,
	parrot_sleep_max: 25,
	parrot_sleep_dur: 25,
	parrot_dam_zone: null,
	parrot_speed: 5,
	parrot_lastmove: null,
	parrot_stuck: 0,
	parrot_stuck_threshold: 10,
	speech_buffer: null,
	speech_shuffle_rate: 20,
	available_channels: null,
	ears: null,
	parrot_interest: null,
	parrot_perch: null,
	held_item: null,
	desired_perches: null,
	pass_flags: 17,
	name: "parrot",
	desc: "The parrot squaks, \"It's a Parrot! BAWWK!\"",
	icon: rt.rsc("icons/mob/animal.dmi"),
	icon_state: "parrot_fly",
	icon_living: "parrot_fly",
	icon_dead: "parrot_dead",
	density: 0,
	health: 80,
	maxHealth: 80,
	speak: null,
	speak_emote: null,
	emote_hear: null,
	emote_see: null,
	speak_chance: 1,
	turns_per_move: 5,
	butcher_results: null,
	melee_damage_upper: 10,
	melee_damage_lower: 5,
	response_help: "pets",
	response_disarm: "gently moves aside",
	response_harm: "swats",
	stop_automated_movement: 1,
	a_intent: "harm",
	attacktext: "chomps",
	friendly: "grooms",
	mob_size: 1,
	movement_type: 2,
	gold_core_spawnable: 2,
});

// parrot.dm:76
rt.def("/mob/living/simple_animal/parrot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.parrot_dam_zone = list("chest", "head", "l_arm", "l_leg", "r_arm", "r_leg");

	this.speech_buffer = list();

	this.available_channels = list();
	this.speak = list("Hi!", "Hello!", "Cracker?", "BAWWWWK george mellons griffing me!");
	this.speak_emote = list("squawks", "says", "yells");
	this.emote_hear = list("squawks.", "bawks!");

	this.emote_see = list("flutters its wings.");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/cracker"), 1]);

	this.desired_perches = list(T("/obj/structure/frame/computer"), T("/obj/structure/displaycase"), T("/obj/structure/filingcabinet"), T("/obj/machinery/teleport"), T("/obj/machinery/computer"), T("/obj/machinery/clonepod"), T("/obj/machinery/dna_scannernew"), T("/obj/machinery/telecomms"), T("/obj/machinery/nuclearbomb"), T("/obj/machinery/particle_accelerator"), T("/obj/machinery/recharge_station"), T("/obj/machinery/smartfridge"), T("/obj/machinery/suit_storage_unit"));
	return f.dot;
});

// parrot.dm:103
rt.def("/mob/living/simple_animal/parrot/proc/Initialize", function* Initialize(f: Frame) {
	let headset: Value = null;
	yield* parent_proc();
	if (!this.ears) {
		headset = pick(T("/obj/item/device/radio/headset/headset_sec"), T("/obj/item/device/radio/headset/headset_eng"), T("/obj/item/device/radio/headset/headset_med"), T("/obj/item/device/radio/headset/headset_sci"), T("/obj/item/device/radio/headset/headset_cargo"));
		this.ears = (yield* new_(headset, this));
	}
	this.parrot_sleep_dur = this.parrot_sleep_max;
	this.verbs.Add(P("/mob/living/simple_animal/parrot/proc/steal_from_ground"), P("/mob/living/simple_animal/parrot/proc/steal_from_mob"), P("/mob/living/simple_animal/parrot/verb/drop_held_item_player"), P("/mob/living/simple_animal/parrot/proc/perch_player"), P("/mob/living/simple_animal/parrot/proc/toggle_mode"), P("/mob/living/simple_animal/parrot/proc/perch_mob_player"));
	return f.dot;
}, true);

// parrot.dm:123
rt.def("/mob/living/simple_animal/parrot/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.stat) return f.dot;
	to_chat(user, pick("This parrot is no more", "This is a late parrot", "This is an ex-parrot"));
	return f.dot;
}, false);

// parrot.dm:129
rt.def("/mob/living/simple_animal/parrot/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.held_item) {
		this.held_item.loc = this.loc;
		this.held_item = null;
	}
	walk(this, 0);
	if (this.buckled) {
		yield* this.buckled.unbuckle_mob(this, { force: 1 });
	}
	this.buckled = null;
	this.pixel_x = rt.initial(f, this, "pixel_x");
	this.pixel_y = rt.initial(f, this, "pixel_y");
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

// parrot.dm:142
rt.def("/mob/living/simple_animal/parrot/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat("Held Item", this.held_item);
	stat("Mode", this.a_intent);
	return f.dot;
}, true);

// parrot.dm:148
rt.def("/mob/living/simple_animal/parrot/proc/Hear", function* Hear(f: Frame, message: Value, speaker: Value, message_langs: Value, raw_message: Value, radio_freq: Value, spans: Value, message_mode: Value) {
	if (speaker != this && prob(50)) {
		if (!radio_freq || prob(10)) {
			if (rt.len(f, this.speech_buffer) >= 500) {
				this.speech_buffer -= pick(this.speech_buffer);
			}
			(rt.modSrcVar(f, "speech_buffer", html_decode(raw_message), rt.bitOr));
		}
	}
	if (speaker == this && !this.client) {
		return message;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// parrot.dm:158
rt.def("/mob/living/simple_animal/parrot/proc/radio", function* radio(f: Frame, message: Value, message_mode: Value, spans: Value, language: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot != 0) {
		return f.dot;
	}
	if (message_mode === "headset") {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, null, spans, language);
		}
		return 3;
	} else if (message_mode === "department") {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, message_mode, spans, language);
		}
		return 3;
	}
	if (rt.isIn(f, message_mode, GLOB.radiochannels)) {
		if (this.ears) {
			yield* this.ears.talk_into(this, message, message_mode, spans, language);
			return 3;
		}
	}
	return 0;
}, true);

// parrot.dm:184
rt.def("/mob/living/simple_animal/parrot/proc/show_inv", function* show_inv(f: Frame, user: Value) {
	yield* user.set_machine(this);
	// tg_js: one `strip` tgui window instead of the HTML popup (modules/mob/strip.ts)
	yield* this.ui_interact(user);
	return f.dot;
}, true);

// parrot.dm:198
rt.def("/mob/living/simple_animal/parrot/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let remove_from: Value = null, possible_phrase: Value = null, add_to: Value = null, item_to_add: Value = null, headset_to_add: Value = null, ch: Value = null;
	let $e: any;
	if (f.usr.incapacitated() || !f.usr.Adjacent(this.loc)) {
		return f.dot;
	}
	if (!(rt.istype(f.usr, T("/mob/living/carbon/human")) || rt.istype(f.usr, T("/mob/living/carbon/monkey")) || rt.istype(f.usr, T("/mob/living/silicon/robot")) || rt.istype(f.usr, T("/mob/living/carbon/alien/humanoid")))) return f.dot;
	if (rt.at(href_list, "remove_inv")) {
		if ((remove_from = rt.at(href_list, "remove_inv")) === "ears") {
			if (this.ears) {
				if (!this.stat) {
					if (rt.len(f, this.available_channels)) {
						yield* this.say(`${pick(this.available_channels)} BAWWWWWK LEAVE THE HEADSET BAWKKKKK!`);
					} else {
						yield* this.say("BAWWWWWK LEAVE THE HEADSET BAWKKKKK!");
					}
				}
				this.ears.loc = this.loc;
				this.ears = null;
				for (possible_phrase of each(this.speak)) {
					if (rt.isIn(f, copytext(possible_phrase, 1, 3), GLOB.department_radio_keys)) {
						possible_phrase = copytext(possible_phrase, 3);
					}
				}
			} else {
				to_chat(f.usr, `<span class='warning'>There is nothing to remove from its ${remove_from}!</span>`);
				return f.dot;
			}
		}
	} else if (rt.at(href_list, "add_inv")) {
		add_to = rt.at(href_list, "add_inv");
		if (!f.usr.get_active_held_item()) {
			to_chat(f.usr, `<span class='warning'>You have nothing in your hand to put on its ${add_to}!</span>`);
			return f.dot;
		}
		if (add_to === "ears") {
			if (this.ears) {
				to_chat(f.usr, "<span class='warning'>It's already wearing something!</span>");
				return f.dot;
			} else {
				if (!(item_to_add = f.usr.get_active_held_item())) {
					return f.dot;
				}
				if (!rt.istype(item_to_add, T("/obj/item/device/radio/headset"))) {
					to_chat(f.usr, "<span class='warning'>This object won't fit!</span>");
					return f.dot;
				}
				headset_to_add = item_to_add;
				yield* f.usr.drop_item();
				headset_to_add.loc = this;
				this.ears = headset_to_add;
				to_chat(f.usr, `<span class='notice'>You fit the headset onto ${this}.</span>`);
				clearlist(this.available_channels);
				for (ch of each(headset_to_add.channels)) {
					if (ch === "Engineering") {
						this.available_channels.Add(":e");
					} else if (ch === "Command") {
						this.available_channels.Add(":c");
					} else if (ch === "Security") {
						this.available_channels.Add(":s");
					} else if (ch === "Science") {
						this.available_channels.Add(":n");
					} else if (ch === "Medical") {
						this.available_channels.Add(":m");
					} else if (ch === "Supply") {
						this.available_channels.Add(":u");
					} else if (ch === "Service") {
						this.available_channels.Add(":v");
					}
				}
				if (headset_to_add.translate_binary) {
					this.available_channels.Add(":b");
				}
			}
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// parrot.dm:280
rt.def("/mob/living/simple_animal/parrot/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	yield* parent_proc();
	if (this.client) {
		return f.dot;
	}
	if (!this.stat && M.a_intent == "harm") {
		this.icon_state = "parrot_fly";
		if (this.parrot_state == PARROT_PERCH) {
			this.parrot_sleep_dur = this.parrot_sleep_max;
		}
		this.parrot_interest = M;
		this.parrot_state = PARROT_SWOOP;
		if (this.health > 30) {
			(rt.modSrcVar(f, "parrot_state", PARROT_ATTACK, rt.bitOr));
		} else {
			(rt.modSrcVar(f, "parrot_state", PARROT_FLEE, rt.bitOr));
			yield* this.drop_held_item(0);
		}
	}
	if (!this.stat && M.a_intent == "help") {
		yield* this.handle_automated_speech(1);
	}
	return f.dot;
}, true);

// parrot.dm:303
rt.def("/mob/living/simple_animal/parrot/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	yield* this.attack_hand(M);
	return f.dot;
}, true);

// parrot.dm:306
rt.def("/mob/living/simple_animal/parrot/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	yield* this.attack_hand(M);
	return f.dot;
}, true);

// parrot.dm:310
rt.def("/mob/living/simple_animal/parrot/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.dot = (yield* parent_proc());
	if (this.client) {
		return f.dot;
	}
	if (this.parrot_state == PARROT_PERCH) {
		this.parrot_sleep_dur = this.parrot_sleep_max;
	}
	if (!(M.melee_damage_upper > 0 && !this.stat)) return f.dot;
	this.parrot_interest = M;
	this.parrot_state = 18;
	this.icon_state = "parrot_fly";
	return f.dot;
}, true);

// parrot.dm:325
rt.def("/mob/living/simple_animal/parrot/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (!this.stat && !this.client && !rt.istype(O, T("/obj/item/stack/medical")) && !rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/cracker"))) {
		if (O.force) {
			if (this.parrot_state == PARROT_PERCH) {
				this.parrot_sleep_dur = this.parrot_sleep_max;
			}
			this.parrot_interest = user;
			this.parrot_state = PARROT_SWOOP;
			if (this.health > 30) {
				(rt.modSrcVar(f, "parrot_state", PARROT_ATTACK, rt.bitOr));
			} else {
				(rt.modSrcVar(f, "parrot_state", PARROT_FLEE, rt.bitOr));
			}
			this.icon_state = "parrot_fly";
			yield* this.drop_held_item(0);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/reagent_containers/food/snacks/cracker"))) {
		yield* qdel(O);
		yield* user.drop_item();
		if (this.health < this.maxHealth) {
			yield* this.adjustBruteLoss(-10);
		}
		this.speak_chance *= 1.27;
		this.speech_shuffle_rate += 10;
		to_chat(user, `<span class='notice'>${this} eagerly devours the cracker.</span>`);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// parrot.dm:351
rt.def("/mob/living/simple_animal/parrot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	yield* parent_proc();
	if (!this.stat && !this.client) {
		if (this.parrot_state == PARROT_PERCH) {
			this.parrot_sleep_dur = this.parrot_sleep_max;
		}
		this.parrot_interest = null;
		this.parrot_state = 68;
		this.icon_state = "parrot_fly";
		yield* this.drop_held_item(0);
	}
	return f.dot;
}, true);

// parrot.dm:368
rt.def("/mob/living/simple_animal/parrot/proc/Life", function Life(f: Frame) {
	parent_proc();
	if (!(this.pulledby && this.stat == 0)) return f.dot;
	this.icon_state = "parrot_fly";
	if (!this.client) {
		this.parrot_state = PARROT_WANDER;
	}
	return f.dot;
}, false, { waitfor: false });

// parrot.dm:383
rt.def("/mob/living/simple_animal/parrot/proc/handle_automated_speech", function handle_automated_speech(f: Frame) {
	parent_proc();
	if (!(rt.len(f, this.speech_buffer) && prob(this.speech_shuffle_rate))) return f.dot;
	if (rt.len(f, this.speak)) {
		this.speak.Remove(pick(this.speak));
	}
	this.speak.Add(pick(this.speech_buffer));
	return f.dot;
}, false, { waitfor: false });

// parrot.dm:392
rt.def("/mob/living/simple_animal/parrot/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	let newspeak: Value = null, possible_phrase: Value = null, useradio: Value = null, AM: Value = null, L: Value = null;
	let $0: any, $e: any;
	if (!isturf(this.loc) || !this.canmove || this.buckled) {
		return f.dot;
	}
	if (this.parrot_state == PARROT_PERCH) {
		if (this.parrot_perch && this.parrot_perch.loc != this.loc) {
			if (rt.isIn(f, this.parrot_perch, view(this))) {
				this.parrot_state = 34;
				this.icon_state = "parrot_fly";
				return f.dot;
			} else {
				this.parrot_state = PARROT_WANDER;
				this.icon_state = "parrot_fly";
				return f.dot;
			}
		}
		if (--this.parrot_sleep_dur) {
			return f.dot;
		} else {
			this.parrot_sleep_dur = this.parrot_sleep_max;
			if (rt.len(f, this.speak)) {
				newspeak = list();
				if (rt.len(f, this.available_channels) && this.ears) {
					for (possible_phrase of each(this.speak)) {
						useradio = 0;
						if (prob(50)) {
							useradio = 1;
						}
						if (rt.isIn(f, copytext(possible_phrase, 1, 2), GLOB.department_radio_prefixes) && rt.isIn(f, copytext(possible_phrase, 2, 3), GLOB.department_radio_keys)) {
							if (useradio) {
								$0 = pick(this.available_channels);
							} else {
								$0 = "";
							}
							possible_phrase = `${$0}${copytext(possible_phrase, 3)}`;
						} else {
							if (useradio) {
								$0 = pick(this.available_channels);
							} else {
								$0 = "";
							}
							possible_phrase = `${$0}${possible_phrase}`;
						}
						newspeak.Add(possible_phrase);
					}
				} else {
					possible_phrase = null;
					for (possible_phrase of each(this.speak)) {
						if (rt.isIn(f, copytext(possible_phrase, 1, 2), GLOB.department_radio_prefixes) && rt.isIn(f, copytext(possible_phrase, 2, 3), GLOB.department_radio_keys)) {
							possible_phrase = copytext(possible_phrase, 3);
						}
						newspeak.Add(possible_phrase);
					}
				}
				this.speak = newspeak;
			}
			this.parrot_interest = (yield* this.search_for_item());
			if (this.parrot_interest) {
				yield* this.emote("me", 1, `looks in ${this.parrot_interest}'s direction and takes flight.`);
				this.parrot_state = 10;
				this.icon_state = "parrot_fly";
			}
			return f.dot;
		}
	} else if (this.parrot_state == PARROT_WANDER) {
		walk(this, 0);
		this.parrot_interest = null;
		if (prob(90)) {
			yield* step(this, pick(GLOB.cardinal));
			return f.dot;
		}
		if (!this.held_item && !this.parrot_perch) {
			if (AM = this.search_for_perch_and_item()) {
				if (rt.istype(AM, T("/obj/item")) || rt.istype(AM, T("/mob/living"))) {
					this.parrot_interest = AM;
					yield* this.emote("me", 1, `turns and flies towards ${this.parrot_interest}.`);
					this.parrot_state = 10;
					return f.dot;
				} else {
					this.parrot_perch = AM;
					this.parrot_state = 34;
					return f.dot;
				}
			}
			return f.dot;
		}
		if (rt.isIn(f, (this.parrot_interest && this.parrot_interest), view(this))) {
			this.parrot_state = 10;
			return f.dot;
		}
		if (rt.isIn(f, (this.parrot_perch && this.parrot_perch), view(this))) {
			this.parrot_state = 34;
			return f.dot;
		} else {
			this.parrot_perch = this.search_for_perch();
			if (this.parrot_perch) {
				this.parrot_state = 34;
				return f.dot;
			}
		}
	} else if (this.parrot_state == 10) {
		walk(this, 0);
		if (!this.parrot_interest || this.held_item) {
			this.parrot_state = 34;
			return f.dot;
		}
		if (!rt.isIn(f, this.parrot_interest, view(this))) {
			this.parrot_state = 34;
			return f.dot;
		}
		if (this.Adjacent(this.parrot_interest)) {
			if (rt.istype(this.parrot_interest, T("/mob/living"))) {
				yield* this.steal_from_mob();
			} else if (!this.parrot_perch || this.parrot_interest.loc != this.parrot_perch.loc) {
				this.held_item = this.parrot_interest;
				this.parrot_interest.loc = this;
				this.visible_message(`${this} grabs ${this.held_item}!`, `<span class='notice'>You grab ${this.held_item}!</span>`, "<span class='italics'>You hear the sounds of wings flapping furiously.</span>");
			}
			this.parrot_interest = null;
			this.parrot_state = 34;
			return f.dot;
		}
		walk_to(this, this.parrot_interest, 1, this.parrot_speed);
		if (this.isStuck()) {
			return f.dot;
		}
		return f.dot;
	} else if (this.parrot_state == 34) {
		walk(this, 0);
		if (!this.parrot_perch || !isturf(this.parrot_perch.loc)) {
			this.parrot_perch = null;
			this.parrot_state = PARROT_WANDER;
			return f.dot;
		}
		if (this.Adjacent(this.parrot_perch)) {
			this.loc = this.parrot_perch.loc;
			yield* this.drop_held_item();
			this.parrot_state = PARROT_PERCH;
			this.icon_state = "parrot_sit";
			return f.dot;
		}
		walk_to(this, this.parrot_perch, 1, this.parrot_speed);
		if (this.isStuck()) {
			return f.dot;
		}
		return f.dot;
	} else if (this.parrot_state == 66) {
		walk(this, 0);
		if (!this.parrot_interest || !rt.istype(this.parrot_interest, T("/mob/living"))) {
			this.parrot_state = PARROT_WANDER;
		}
		walk_away(this, this.parrot_interest, 1, this.parrot_speed);
		if (this.isStuck()) {
			return f.dot;
		}
		return f.dot;
	} else if (this.parrot_state == 18) {
		if (!this.parrot_interest || !rt.istype(this.parrot_interest, T("/mob/living"))) {
			this.parrot_interest = null;
			this.parrot_state = PARROT_WANDER;
			return f.dot;
		}
		L = this.parrot_interest;
		if (this.melee_damage_upper == 0) {
			this.melee_damage_upper = this.parrot_damage_upper;
			this.a_intent = "harm";
		}
		if (this.Adjacent(this.parrot_interest)) {
			if (L.stat) {
				this.parrot_interest = null;
				if (!this.held_item) {
					this.held_item = this.steal_from_ground();
					if (!this.held_item) {
						this.held_item = (yield* this.steal_from_mob());
					}
				}
				if (rt.isIn(f, this.parrot_perch, view(this))) {
					this.parrot_state = 34;
				} else {
					this.parrot_state = PARROT_WANDER;
				}
				return f.dot;
			}
			this.attacktext = pick("claws at", "chomps");
			yield* L.attack_animal(this);
		} else {
			walk_to(this, this.parrot_interest, 1, this.parrot_speed);
			if (this.isStuck()) {
				return f.dot;
			}
		}
		return f.dot;
	} else {
		walk(this, 0);
		this.parrot_interest = null;
		this.parrot_perch = null;
		yield* this.drop_held_item();
		this.parrot_state = PARROT_WANDER;
		return f.dot;
	}
	return f.dot;
}, true, { waitfor: false });

// parrot.dm:604
rt.def("/mob/living/simple_animal/parrot/proc/movement_delay", function movement_delay(f: Frame) {
	if (this.client && this.stat == 0 && this.icon_state != "parrot_fly") {
		this.icon_state = "parrot_fly";
	}
	return parent_proc();
});

// parrot.dm:612
rt.def("/mob/living/simple_animal/parrot/proc/isStuck", function isStuck(f: Frame) {
	if (this.parrot_lastmove) {
		if (this.parrot_lastmove == this.loc) {
			if (this.parrot_stuck_threshold >= ++this.parrot_stuck) {
				this.parrot_state = PARROT_WANDER;
				this.parrot_stuck = 0;
				this.parrot_lastmove = null;
				return 1;
			}
		} else {
			this.parrot_lastmove = null;
		}
	} else {
		this.parrot_lastmove = this.loc;
	}
	return 0;
});

// parrot.dm:626
rt.def("/mob/living/simple_animal/parrot/proc/search_for_item", function* search_for_item(f: Frame) {
	let item: Value = null, AM: Value = null, I: Value = null, C: Value = null, I_3: Value = null;
	for (AM of each(view(this), T("/atom/movable"))) {
		if (this.parrot_perch && AM.loc == this.parrot_perch.loc || AM.loc == this) {
			continue;
		}
		if (rt.istype(AM, T("/obj/item"))) {
			if ((I = AM).w_class < WEIGHT_CLASS_SMALL) {
				item = I;
			}
		} else if (rt.istype(AM, T("/mob/living/carbon"))) {
			C = AM;
			I_3 = null;
			for (I_3 of each(C.held_items, T("/obj/item"))) {
				if (I_3.w_class <= WEIGHT_CLASS_SMALL) {
					item = I_3;
					break;
				}
			}
		}
		if (item) {
			if (!(yield* AStar(this, rt.getStep(f, item, 0), P("/turf/proc/Distance_cardinal")))) {
				item = null;
				continue;
			}
			return item;
		}
	}
	return null;
}, true);

// parrot.dm:649
rt.def("/mob/living/simple_animal/parrot/proc/search_for_perch", function search_for_perch(f: Frame) {
	let O: Value = null, path: Value = null;
	for (O of each(view(this), T("/obj"))) {
		path = null;
		for (path of each(this.desired_perches)) {
			if (rt.op(f, "IsType", [], [O, path])) {
				return O;
			}
		}
	}
	return null;
});

// parrot.dm:657
rt.def("/mob/living/simple_animal/parrot/proc/search_for_perch_and_item", function search_for_perch_and_item(f: Frame) {
	let AM: Value = null, perch_path: Value = null, I: Value = null, C: Value = null, I_2: Value = null;
	for (AM of each(view(this), T("/atom/movable"))) {
		perch_path = null;
		for (perch_path of each(this.desired_perches)) {
			if (rt.op(f, "IsType", [], [AM, perch_path])) {
				return AM;
			}
		}
		if (this.parrot_perch && AM.loc == this.parrot_perch.loc || AM.loc == this) {
			continue;
		}
		if (rt.istype(AM, T("/obj/item"))) {
			if ((I = AM).w_class <= WEIGHT_CLASS_SMALL) {
				return I;
			}
		}
		if (rt.istype(AM, T("/mob/living/carbon"))) {
			C = AM;
			I_2 = null;
			for (I_2 of each(C.held_items, T("/obj/item"))) {
				if (I_2.w_class <= WEIGHT_CLASS_SMALL) {
					return C;
				}
			}
		}
	}
	return null;
});

// parrot.dm:691
rt.def("/mob/living/simple_animal/parrot/proc/steal_from_ground", function steal_from_ground(f: Frame) {
	let I: Value = null;
	if (this.stat) {
		return -1;
	}
	if (this.held_item) {
		to_chat(this, `<span class='warning'>You are already holding ${this.held_item}!</span>`);
		return 1;
	}
	for (I of each(view(1, this), T("/obj/item"))) {
		if (I.loc != this && I.w_class <= 2) {
			if (!this.client && this.parrot_perch && I.loc == this.parrot_perch.loc) {
				continue;
			}
			this.held_item = I;
			I.loc = this;
			this.visible_message(`${this} grabs ${this.held_item}!`, `<span class='notice'>You grab ${this.held_item}!</span>`, "<span class='italics'>You hear the sounds of wings flapping furiously.</span>");
			return this.held_item;
		}
	}
	to_chat(this, "<span class='warning'>There is nothing of interest to take!</span>");
	return 0;
}, false, { verb: { name: "Steal from ground", category: "Parrot", desc: "Grabs a nearby item." } });

// parrot.dm:719
rt.def("/mob/living/simple_animal/parrot/proc/steal_from_mob", function* steal_from_mob(f: Frame) {
	let stolen_item: Value = null, C: Value = null, I: Value = null;
	if (this.stat) {
		return -1;
	}
	if (this.held_item) {
		to_chat(this, `<span class='warning'>You are already holding ${this.held_item}!</span>`);
		return 1;
	}
	for (C of each(view(1, this), T("/mob/living/carbon"))) {
		I = null;
		for (I of each(C.held_items, T("/obj/item"))) {
			if (I.w_class <= 2) {
				stolen_item = I;
				break;
			}
		}
		if (stolen_item) {
			yield* C.transferItemToLoc(stolen_item, this, 1);
			this.held_item = stolen_item;
			this.visible_message(`${this} grabs ${this.held_item} out of ${C}'s hand!`, `<span class='notice'>You snag ${this.held_item} out of ${C}'s hand!</span>`, "<span class='italics'>You hear the sounds of wings flapping furiously.</span>");
			return this.held_item;
		}
	}
	to_chat(this, "<span class='warning'>There is nothing of interest to take!</spawn>");
	return 0;
}, true, { verb: { name: "Steal from mob", category: "Parrot", desc: "Steals an item right out of a person's hand!" } });

// parrot.dm:747
rt.def("/mob/living/simple_animal/parrot/verb/drop_held_item_player", function* drop_held_item_player(f: Frame) {
	if (this.stat) {
		return f.dot;
	}
	yield* this.drop_held_item();
	return f.dot;
}, true, { verb: { name: "Drop held item", category: "Parrot", desc: "Drop the item you're holding." } });

// parrot.dm:759
rt.def("/mob/living/simple_animal/parrot/proc/drop_held_item", function* drop_held_item(f: Frame, drop_gently: Value) {
	let G: Value = null;
	drop_gently ??= 1;
	if (this.stat) {
		return -1;
	}
	if (!this.held_item) {
		if (this == f.usr) {
			to_chat(this, "<span class='danger'>You have nothing to drop!</span>");
		}
		return 0;
	}
	if (rt.istype(this.held_item, T("/obj/item/weapon/reagent_containers/food/snacks/cracker")) && drop_gently) {
		yield* qdel(this.held_item);
		this.held_item = null;
		if (this.health < this.maxHealth) {
			yield* this.adjustBruteLoss(-10);
		}
		yield* this.emote("me", 1, `${this} eagerly downs the cracker.`);
		return 1;
	}
	if (!drop_gently) {
		if (rt.istype(this.held_item, T("/obj/item/weapon/grenade"))) {
			(G = this.held_item).loc = this.loc;
			yield* G.prime();
			to_chat(this, `You let go of ${this.held_item}!`);
			this.held_item = null;
			return 1;
		}
	}
	to_chat(this, `You drop ${this.held_item}.`);
	this.held_item.loc = this.loc;
	this.held_item = null;
	return 1;
}, true, { verb: { name: "Drop held item", category: "Parrot", desc: "Drop the item you're holding." } });

// parrot.dm:795
rt.def("/mob/living/simple_animal/parrot/proc/perch_player", function perch_player(f: Frame) {
	let AM: Value = null, perch_path: Value = null;
	if (this.stat || !this.client) {
		return f.dot;
	}
	if (this.icon_state == "parrot_fly") {
		for (AM of each(view(this, 1), T("/atom/movable"))) {
			perch_path = null;
			for (perch_path of each(this.desired_perches)) {
				if (rt.op(f, "IsType", [], [AM, perch_path])) {
					this.loc = AM.loc;
					this.icon_state = "parrot_sit";
					return f.dot;
				}
			}
		}
	}
	to_chat(this, "<span class='warning'>There is no perch nearby to sit on!</span>");
	return f.dot;
}, false, { verb: { name: "Sit", category: "Parrot", desc: "Sit on a nice comfy perch." } });

// parrot.dm:814
rt.def("/mob/living/simple_animal/parrot/proc/perch_mob_player", function* perch_mob_player(f: Frame) {
	let H: Value = null;
	if (this.stat || !this.client) {
		return f.dot;
	}
	if (this.icon_state == "parrot_fly") {
		for (H of each(view(this, 1), T("/mob/living/carbon/human"))) {
			if (H.has_buckled_mobs() && rt.len(f, H.buckled_mobs) >= H.max_buckled_mobs) {
				continue;
			}
			yield* this.perch_on_human(H);
			return f.dot;
		}
		to_chat(this, "<span class='warning'>There is nobody nearby that you can sit on!</span>");
	} else {
		this.icon_state = "parrot_fly";
		this.parrot_state = PARROT_WANDER;
		if (this.buckled) {
			to_chat(this, `<span class='notice'>You are no longer sitting on ${this.buckled}'s shoulder.</span>`);
			yield* this.buckled.unbuckle_mob(this, { force: 1 });
		}
		this.buckled = null;
		this.pixel_x = rt.initial(f, this, "pixel_x");
		this.pixel_y = rt.initial(f, this, "pixel_y");
	}
	return f.dot;
}, true, { verb: { name: "Sit on Human's Shoulder", category: "Parrot", desc: "Sit on a nice comfy human being!" } });

// parrot.dm:837
rt.def("/mob/living/simple_animal/parrot/proc/perch_on_human", function* perch_on_human(f: Frame, H: Value) {
	if (!H) {
		return f.dot;
	}
	this.loc = rt.getStep(f, H, 0);
	yield* H.buckle_mob(this, { force: 1 });
	this.pixel_y = 9;
	this.pixel_x = pick(-8, 8);
	this.icon_state = "parrot_sit";
	this.parrot_state = PARROT_PERCH;
	to_chat(this, `<span class='notice'>You sit on ${H}'s shoulder.</span>`);
	return f.dot;
}, true);

// parrot.dm:853
rt.def("/mob/living/simple_animal/parrot/proc/toggle_mode", function toggle_mode(f: Frame) {
	if (this.stat || !this.client) {
		return f.dot;
	}
	if (this.melee_damage_upper) {
		this.melee_damage_upper = 0;
		this.a_intent = "help";
	} else {
		this.melee_damage_upper = this.parrot_damage_upper;
		this.a_intent = "harm";
	}
	to_chat(this, `You will now ${this.a_intent} others...`);
	return f.dot;
}, false, { verb: { name: "Toggle mode", category: "Parrot", desc: "Time to bear those claws!" } });

rt.type(5075, "/mob/living/simple_animal/parrot/Poly", "/mob/living/simple_animal/parrot", {
	memory_saved: 0,
	rounds_survived: 0,
	longest_survival: 0,
	longest_deathstreak: 0,
	name: "Poly",
	desc: "Poly the Parrot. An expert on quantum cracker theory.",
	speak: null,
	gold_core_spawnable: 0,
	speak_chance: 3,
});

// parrot.dm:880
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Initialize", function* Initialize(f: Frame) {
	this.ears = (yield* new_(T("/obj/item/device/radio/headset/headset_eng"), this));
	this.available_channels = list(":e");
	yield* this.Read_Memory();
	if (this.rounds_survived == this.longest_survival) {
		this.speak += pick(`...${this.longest_survival}.`, "The things I've seen!", "I have lived many lives!", "What are you before me?");
		this.desc += ` Old as sin, and just as loud. Claimed to be ${this.rounds_survived}.`;
		this.speak_chance = 20;
		this.add_atom_colour("#EEEE22", FIXED_COLOUR_PRIORITY);
	} else if (this.rounds_survived == this.longest_deathstreak) {
		this.speak += pick("What are you waiting for!", "Violence breeds violence!", "Blood! Blood!", "Strike me down if you dare!");
		this.desc += ` The squawks of ${-this.rounds_survived} dead parrots ring out in your ears...`;
		this.add_atom_colour("#BB7777", FIXED_COLOUR_PRIORITY);
	} else if (this.rounds_survived > 0) {
		this.speak += pick("...again?", "No, It was over!", "Let me out!", "It never ends!");
		this.desc += ` Over ${this.rounds_survived} shifts without a "terrible" "accident"!`;
	} else {
		this.speak += pick("...alive?", "This isn't parrot heaven!", "I live, I die, I live again!", "The void fades!");
	}
	yield* parent_proc();
	return f.dot;
}, true);

// parrot.dm:901
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Life", function Life(f: Frame) {
	if (!this.stat && GLOB.SSticker.current_state == GAME_STATE_FINISHED && !this.memory_saved) {
		this.rounds_survived = max(++this.rounds_survived, 1);
		if (this.rounds_survived > this.longest_survival) {
			this.longest_survival = this.rounds_survived;
		}
		this.Write_Memory();
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// parrot.dm:909
rt.def("/mob/living/simple_animal/parrot/Poly/proc/death", function* death(f: Frame, gibbed: Value) {
	let go_ghost: Value = null, G: Value = null;
	if (!this.memory_saved) {
		go_ghost = 0;
		if (this.rounds_survived == this.longest_survival || this.rounds_survived == this.longest_deathstreak || prob(0.666)) {
			go_ghost = 1;
		}
		this.rounds_survived = min(--this.rounds_survived, 0);
		if (this.rounds_survived < this.longest_deathstreak) {
			this.longest_deathstreak = this.rounds_survived;
		}
		this.Write_Memory();
		if (go_ghost) {
			G = (yield* new_(T("/mob/living/simple_animal/parrot/Poly/ghost"), this.loc));
			if (this.mind) {
				yield* this.mind.transfer_to(G);
			} else {
				G.key = this.key;
			}
		}
	}
	yield* parent_proc(gibbed);
	return f.dot;
}, true);

// parrot.dm:926
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Read_Memory", function Read_Memory(f: Frame) {
	let S: Value = null;
	this.speech_buffer = rt.input(f, rt.R.index, null, [(S = new_(T("/savefile"), "data/npc_saves/Poly.sav")), "phrases"]);
	this.rounds_survived = rt.input(f, rt.R.index, null, [S, "roundssurvived"]);
	this.longest_survival = rt.input(f, rt.R.index, null, [S, "longestsurvival"]);
	this.longest_deathstreak = rt.input(f, rt.R.index, null, [S, "longestdeathstreak"]);
	if (rt.istype(this.speech_buffer, T("/list"))) return f.dot;
	this.speech_buffer = list();
	return f.dot;
});

// parrot.dm:936
rt.def("/mob/living/simple_animal/parrot/Poly/proc/Write_Memory", function Write_Memory(f: Frame) {
	let S: Value = new_(T("/savefile"), "data/npc_saves/Poly.sav");
	if (rt.istype(this.speech_buffer, T("/list"))) {
		rt.op(f, "OutputReference", [rt.R.index], [S, "phrases", this.speech_buffer], false);
	}
	rt.op(f, "OutputReference", [rt.R.index], [S, "roundssurvived", this.rounds_survived], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "longestsurvival", this.longest_survival], false);
	rt.op(f, "OutputReference", [rt.R.index], [S, "longestdeathstreak", this.longest_deathstreak], false);
	this.memory_saved = 1;
	return f.dot;
});

rt.type(5076, "/mob/living/simple_animal/parrot/Poly/ghost", "/mob/living/simple_animal/parrot/Poly", {
	name: "The Ghost of Poly",
	desc: "Doomed to squawk the earth.",
	color: "#FFFFFF77",
	speak_chance: 20,
	status_flags: 4096,
	incorporeal_move: 1,
	butcher_results: null,
});

// parrot.dm:951
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/ectoplasm"), 1]);
	return f.dot;
});

// parrot.dm:955
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/Initialize", function* Initialize(f: Frame) {
	this.memory_saved = 1;
	yield* parent_proc();
	return f.dot;
}, true);

// parrot.dm:958
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_speech", function handle_automated_speech(f: Frame) {
	if (ismob(this.loc)) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// parrot.dm:963
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/handle_automated_movement", function* handle_automated_movement(f: Frame) {
	if (rt.istype(this.parrot_interest, T("/mob/living"))) {
		if (!rt.istype(this.parrot_interest, T("/mob/living/carbon/human"))) {
			this.parrot_interest = null;
		} else if (this.parrot_state == 18 && this.Adjacent(this.parrot_interest)) {
			walk_to(this, this.parrot_interest, 0, this.parrot_speed);
			yield* this.Possess(this.parrot_interest);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// parrot.dm:972
rt.def("/mob/living/simple_animal/parrot/Poly/ghost/proc/Possess", function* Possess(f: Frame, H: Value) {
	let _P: Value = null;
	if (!rt.istype(H, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	(_P = (yield* new_(T("/datum/disease/parrot_possession")))).parrot = this;
	this.loc = H;
	yield* H.ContractDisease(_P);
	this.parrot_interest = null;
	H.visible_message(`<span class='danger'>${this} dive bombs into ${H}'s chest and vanishes!</span>`, `<span class='userdanger'>${this} dive bombs into your chest, vanishing! This can't be good!</span>`);
	return f.dot;
}, true);
