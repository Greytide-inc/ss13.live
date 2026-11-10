// Based on /tg/station's code/modules/mob/living/simple_animal/slime/slime.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(4851, "/mob/living/simple_animal/slime", "/mob/living/simple_animal", {
	AIproc: 0,
	Atkcool: 0,
	Tempstun: 0,
	Discipline: 0,
	SStun: 0,
	is_adult: 0,
	docile: 0,
	cores: 1,
	mutation_chance: 30,
	powerlevel: 0,
	amount_grown: 0,
	number: 0,
	Target: null,
	Leader: null,
	attacked: 0,
	rabid: 0,
	holding_still: 0,
	target_patience: 0,
	Friends: null,
	speech_buffer: null,
	mood: "",
	mutator_used: 0,
	force_stasis: 0,
	colour: "grey",
	slime_mutation: null,
	coretype: rt.typePath("/obj/item/slime_extract/grey"),
	pass_flags: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/slime"),
	verb_say: "blorbles",
	verb_ask: "inquisitively blorbles",
	verb_exclaim: "loudly blorbles",
	verb_yell: "loudly blorbles",
	name: "grey baby slime (123)",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "grey baby slime",
	ventcrawler: 2,
	gender: "neuter",
	faction: null,
	harm_intent_damage: 5,
	icon_living: "grey baby slime",
	icon_dead: "grey baby slime dead",
	response_help: "pets",
	response_disarm: "shoos",
	response_harm: "stomps on",
	emote_see: null,
	speak_emote: null,
	bubble_icon: "slime",
	atmos_requirements: null,
	maxHealth: 150,
	health: 150,
	healable: 0,
	nutrition: 700,
	see_in_dark: 8,
	status_flags: 12,
}, { global: { slime_colours: 713, slime_name_regex: 1043 } });

// slime.dm:59
rt.def("/mob/living/simple_animal/slime/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.Friends = list();

	this.speech_buffer = list();

	this.slime_mutation = rt.op(f, "CreateMultidimensionalList", [1], [4]);
	this.faction = list("slime", "neutral");
	this.emote_see = list("jiggles", "bounces in place");

	this.speak_emote = list("blorbles");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// slime.dm:80
rt.def("/mob/living/simple_animal/slime/proc/Initialize", function* Initialize(f: Frame) {
	let F: Value = null, R: Value = null, E: Value = null;
	if (f.args[1] === null) {
		f.args[1] = "grey";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* (F = (yield* new_(T("/datum/action/innate/slime/feed")))).Grant(this);
	this.is_adult = f.args[2];
	if (this.is_adult) {
		yield* (R = (yield* new_(T("/datum/action/innate/slime/reproduce")))).Grant(this);
		this.health = 200;
		this.maxHealth = 200;
	} else {
		yield* (E = (yield* new_(T("/datum/action/innate/slime/evolve")))).Grant(this);
	}
	yield* this.create_reagents(100);
	this.set_colour(f.args[1]);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["mapload", "new_colour", "new_is_adult"] });

// slime.dm:98
rt.def("/mob/living/simple_animal/slime/proc/set_colour", function set_colour(f: Frame, new_colour: Value) {
	let sanitizedcolour: Value = null;
	this.colour = new_colour;
	this.update_name();
	this.slime_mutation = this.mutation_table(this.colour);
	this.coretype = text2path(`/obj/item/slime_extract/${(sanitizedcolour = replacetext(this.colour, " ", ""))}`);
	this.regenerate_icons();
	return f.dot;
});

// slime.dm:106
rt.def("/mob/living/simple_animal/slime/proc/update_name", function update_name(f: Frame) {
	if (!GLOB.slime_name_regex.Find(this.name)) return f.dot;
	this.number = rand(1, 1000);
	let $0: any = this.colour;
	this.name = `${$0} ${this.is_adult ? "adult" : "baby"} slime (${this.number})`;
	this.real_name = this.name;
	return f.dot;
});

// slime.dm:115
rt.def("/mob/living/simple_animal/slime/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	let icon_text: Value = null;
	this.cut_overlays();
	let $0: any = this.colour;
	this.icon_dead = `${(icon_text = `${$0} ${this.is_adult ? "adult" : "baby"} slime`)} dead`;
	if (this.stat != 2) {
		this.icon_state = icon_text;
		if (this.mood && !this.stat) {
			this.add_overlay(`aslime-${this.mood}`);
		}
	} else {
		this.icon_state = this.icon_dead;
	}
	parent_proc();
	return f.dot;
});

// slime.dm:127
rt.def("/mob/living/simple_animal/slime/proc/movement_delay", function movement_delay(f: Frame) {
	let health_deficiency: Value = null;
	if (this.bodytemperature >= 330.23) {
		return -1;
	}
	f.dot = parent_proc();
	if ((health_deficiency = 100 - this.health) >= 45) {
		f.dot += health_deficiency / 25;
	}
	if (this.bodytemperature < 183.222) {
		f.dot += (283.222 - this.bodytemperature) / 10 * 1.75;
	}
	if (this.reagents) {
		if (this.reagents.has_reagent("morphine")) {
			f.dot *= 2;
		}
		if (this.reagents.has_reagent("frostoil")) {
			f.dot *= 5;
		}
	}
	if (this.health <= 0) {
		f.dot *= 2;
	}
	f.dot += GLOB.config.slime_delay;
	return f.dot;
});

// slime.dm:152
rt.def("/mob/living/simple_animal/slime/proc/ObjBump", function* ObjBump(f: Frame, O: Value) {
	if (!(!this.client && this.powerlevel > 0)) return f.dot;
	let probab: Value = 10;
	if (rt.inRange(this.powerlevel, 1, 2)) {
		probab = 20;
	} else if (rt.inRange(this.powerlevel, 3, 4)) {
		probab = 30;
	} else if (rt.inRange(this.powerlevel, 5, 6)) {
		probab = 40;
	} else if (rt.inRange(this.powerlevel, 7, 8)) {
		probab = 60;
	} else if (this.powerlevel === 9) {
		probab = 70;
	} else if (this.powerlevel === 10) {
		probab = 95;
	}
	if (!prob(probab)) return f.dot;
	if (!(rt.istype(O, T("/obj/structure/window")) || rt.istype(O, T("/obj/structure/grille")))) return f.dot;
	if (!(this.nutrition <= this.get_hunger_nutrition() && !this.Atkcool)) return f.dot;
	if (!(this.is_adult || prob(5))) return f.dot;
	yield* O.attack_slime(this);
	this.Atkcool = 1;
	rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/ObjBump: spawn at modules/mob/living/simple_animal/slime/slime.dm:173", O, probab);
	return f.dot;
}, true);

// a spawn(45) body of /mob/living/simple_animal/slime/proc/ObjBump, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/ObjBump: spawn at modules/mob/living/simple_animal/slime/slime.dm:173", function* (f: Frame, O: Value, probab: Value) {
	this.Atkcool = 0;
	return null;
});

// slime.dm:180
rt.def("/mob/living/simple_animal/slime/proc/Stat", function* Stat(f: Frame) {
	if (!(yield* parent_proc())) return f.dot;
	if (!this.docile) {
		stat(null, `Nutrition: ${this.nutrition}/${this.get_max_nutrition()}`);
	}
	if (this.amount_grown >= SLIME_EVOLUTION_THRESHOLD) {
		if (this.is_adult) {
			stat(null, "You can reproduce!");
		} else {
			stat(null, "You can evolve!");
		}
	}
	if (this.stat == 1) {
		stat(null, "You are knocked out by high levels of BZ!");
	} else {
		stat(null, `Power Level: ${this.powerlevel}`);
	}
	return f.dot;
}, true);

// slime.dm:197
rt.def("/mob/living/simple_animal/slime/proc/adjustFireLoss", function* adjustFireLoss(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		f.args[0] = -rt.op(f, "Abs", [], [f.args[0]]);
	}
	return (yield* parent_proc());
}, true, { args: ["amount", "updating_health", "forced"] });

// slime.dm:202
rt.def("/mob/living/simple_animal/slime/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (!Proj) {
		return f.dot;
	}
	this.attacked += 10;
	if (Proj.damage_type == "fire") {
		yield* this.adjustBruteLoss(-rt.op(f, "Abs", [], [Proj.damage]));
		yield* Proj.on_hit(this);
	} else {
		yield* parent_proc(Proj);
	}
	return 0;
}, true);

// slime.dm:214
rt.def("/mob/living/simple_animal/slime/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.powerlevel = 0;
	yield* parent_proc();
	return f.dot;
}, true);

// slime.dm:217
rt.def("/mob/living/simple_animal/slime/proc/MouseDrop", function* MouseDrop(f: Frame, A: Value) {
	let Food: Value = null;
	if (rt.istype(A, T("/mob/living")) && A != this && f.usr == this) {
		if (yield* this.CanFeedon((Food = A))) {
			yield* this.Feedon(Food);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// slime.dm:233
rt.def("/mob/living/simple_animal/slime/proc/attack_slime", function* attack_slime(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (M == this) {
		return f.dot;
	}
	if (this.buckled) {
		yield* this.Feedstop({ silent: 1 });
		this.visible_message(`<span class='danger'>${M} pulls ${this} off!</span>`);
		return f.dot;
	}
	this.attacked += 5;
	if (this.nutrition >= 100) {
		this.nutrition -= 50 + 40 * M.is_adult;
		M.add_nutrition(50 + 40 * M.is_adult);
	}
	if (!(this.health > 0)) return f.dot;
	yield* M.adjustBruteLoss(-10 + -10 * M.is_adult);
	yield* M.updatehealth();
	return f.dot;
}, true);

// slime.dm:249
rt.def("/mob/living/simple_animal/slime/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.attacked += 10;
	return f.dot;
}, true);

// slime.dm:255
rt.def("/mob/living/simple_animal/slime/proc/attack_paw", function* attack_paw(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	this.attacked += 10;
	return f.dot;
}, true);

// slime.dm:259
rt.def("/mob/living/simple_animal/slime/proc/attack_larva", function* attack_larva(f: Frame, L: Value) {
	if (!(yield* parent_proc())) return f.dot;
	this.attacked += 10;
	return f.dot;
}, true);

// slime.dm:263
rt.def("/mob/living/simple_animal/slime/proc/attack_hulk", function* attack_hulk(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0].a_intent != "harm") return f.dot;
	yield* this.discipline_slime(f.args[0]);
	return (yield* parent_proc());
}, true, { args: ["user", "does_attack_animation"] });

// slime.dm:271
rt.def("/mob/living/simple_animal/slime/proc/attack_hand", function* attack_hand(f: Frame, M: Value) {
	let S: Value = null;
	if (this.buckled) {
		yield* M.do_attack_animation(this, "disarm");
		if (this.buckled == M) {
			if (prob(60)) {
				this.visible_message(fmt("<span class='warning'>＀ attempts to wrestle ％！ off!</span>", [M, this.name]));
				playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
			} else {
				this.visible_message(fmt("<span class='warning'>＀ manages to wrestle ％！ off!</span>", [M, this.name]));
				playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
				yield* this.discipline_slime(M);
			}
		} else if (prob(30)) {
			this.visible_message(fmt("<span class='warning'>＀ attempts to wrestle ％！ off of ＀!</span>", [M, this.name, this.buckled]));
			playsound(this.loc, rt.rsc("sound/weapons/punchmiss.ogg"), 25, 1, -1);
		} else {
			this.visible_message(fmt("<span class='warning'>＀ manages to wrestle ％！ off of ＀!</span>", [M, this.name, this.buckled]));
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
			yield* this.discipline_slime(M);
		}
	} else {
		if (this.stat == 2 && rt.len(f, this.surgeries)) {
			if (M.a_intent == "help") {
				for (S of each(this.surgeries, T("/datum/surgery"))) {
					if (yield* S.next_step(M)) {
						return 1;
					}
				}
			}
		}
		if (!(yield* parent_proc())) return f.dot;
		this.attacked += 10;
	}
	return f.dot;
}, true);

// slime.dm:303
rt.def("/mob/living/simple_animal/slime/proc/attack_alien", function* attack_alien(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	this.attacked += 10;
	yield* this.discipline_slime(M);
	return f.dot;
}, true);

// slime.dm:309
rt.def("/mob/living/simple_animal/slime/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let S: Value = null, force_effect: Value = null;
	if (this.stat == 2 && rt.len(f, this.surgeries)) {
		if (user.a_intent == "help") {
			for (S of each(this.surgeries, T("/datum/surgery"))) {
				if (yield* S.next_step(user)) {
					return 1;
				}
			}
		}
	}
	if (rt.istype(W, T("/obj/item/stack/sheet/mineral/plasma")) && !this.stat) {
		if (rt.isIn(f, user, this.Friends)) {
			rt.incAt(this.Friends, user, 1, false);
		} else {
			rt.setAt(this.Friends, user, 1);
		}
		to_chat(user, "<span class='notice'>You feed the slime the plasma. It chirps happily.</span>");
		yield* (S = W).use(1);
		return f.dot;
	}
	if (W.force > 0) {
		this.attacked += 10;
		if (prob(25)) {
			yield* user.do_attack_animation(this);
			user.changeNext_move(8);
			to_chat(user, `<span class='danger'>${W} passes right through ${this}!</span>`);
			return f.dot;
		}
		if (this.Discipline && prob(50)) {
			this.Discipline = 0;
		}
	}
	if (W.force >= 3) {
		force_effect = 2 * W.force;
		if (this.is_adult) {
			force_effect = round(W.force / 2);
		}
		if (prob(10 + force_effect)) {
			yield* this.discipline_slime(user);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// slime.dm:341
rt.def("/mob/living/simple_animal/slime/proc/apply_water", function* apply_water(f: Frame) {
	yield* this.adjustBruteLoss(rand(15, 20));
	if (!this.client) {
		if (this.Target) {
			this.Target = null;
			++this.Discipline;
		}
	}
	return f.dot;
}, true);

// slime.dm:350
rt.def("/mob/living/simple_animal/slime/proc/examine", function examine(f: Frame, user: Value) {
	let msg: Value = fmt("<span class='info'>*---------*\nThis is ＀ ＇<EM>！</EM>!\n", [bicon(this), this]);
	if (this.stat == 2) {
		msg += "<span class='deadsay'>It is limp and unresponsive.</span>\n";
	} else {
		if (this.stat == 1) {
			msg += "<span class='deadsay'>It appears to be alive but unresponsive.</span>\n";
		}
		if (this.getBruteLoss()) {
			msg += "<span class='warning'>";
			if (this.getBruteLoss() < 40) {
				msg += "It has some punctures in its flesh!";
			} else {
				msg += "<B>It has severe punctures and tears in its flesh!</B>";
			}
			msg += "</span>\n";
		}
		if (rt.inRange(this.powerlevel, 2, 3)) {
			msg += "It is flickering gently with a little electrical activity.\n";
		} else if (rt.inRange(this.powerlevel, 4, 5)) {
			msg += "It is glowing gently with moderate levels of electrical activity.\n";
		} else if (rt.inRange(this.powerlevel, 6, 9)) {
			msg += "<span class='warning'>It is glowing brightly with high levels of electrical activity.</span>\n";
		} else if (this.powerlevel === 10) {
			msg += "<span class='warning'><B>It is radiating with massive levels of electrical activity!</B></span>\n";
		}
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});

// slime.dm:385
rt.def("/mob/living/simple_animal/slime/proc/discipline_slime", function* discipline_slime(f: Frame, user: Value) {
	if (this.stat) {
		return f.dot;
	}
	if (prob(80) && !this.client) {
		this.Discipline++;
		if (!this.is_adult) {
			if (this.Discipline == 1) {
				this.attacked = 0;
			}
		}
	}
	if (this.Target) {
		this.Target = null;
	}
	if (this.buckled) {
		yield* this.Feedstop({ silent: 1 });
	}
	this.SStun = rt.worldTime(f) + rand(20, 60);
	rt.spawnTail(f, 0, "/mob/living/simple_animal/slime/proc/discipline_slime: spawn at modules/mob/living/simple_animal/slime/slime.dm:398", user);
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/slime/proc/discipline_slime, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/discipline_slime: spawn at modules/mob/living/simple_animal/slime/slime.dm:398", function* (f: Frame, user: Value) {
	this.canmove = 0;
	if (user) {
		yield* step_away(this, user, 15);
	}
	yield* sleep(3);
	if (user) {
		yield* step_away(this, user, 15);
	}
	yield* this.update_canmove();
	return null;
});

// slime.dm:417
rt.def("/mob/living/simple_animal/slime/proc/get_mob_buckling_height", function get_mob_buckling_height(f: Frame, seat: Value) {
	if (!parent_proc()) return f.dot;
	return 3;
}, false);

rt.type(4853, "/mob/living/simple_animal/slime/random", "/mob/living/simple_animal/slime", {});

// slime.dm:421
rt.def("/mob/living/simple_animal/slime/random/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_colour: Value, new_is_adult: Value) {
	f.dot = (yield* parent_proc(mapload, pick(GLOB.slime_colours), prob(50)));
	return f.dot;
}, true);
