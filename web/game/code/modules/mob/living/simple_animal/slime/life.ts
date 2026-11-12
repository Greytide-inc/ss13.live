// Based on /tg/station's code/modules/mob/living/simple_animal/slime/life.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


// life.dm:16
rt.def("/mob/living/simple_animal/slime/proc/Life", function* Life(f: Frame) {
	if (this.notransform) {
		return f.dot;
	}
	if (!(yield* parent_proc())) return f.dot;
	if (this.buckled) {
		yield* this.handle_feeding();
	}
	if (this.stat) return f.dot;
	yield* this.handle_nutrition();
	yield* this.handle_targets();
	if (this.ckey) return f.dot;
	this.handle_mood();
	yield* this.handle_speech();
	return f.dot;
}, true, { waitfor: false });

// life.dm:28
rt.def("/mob/living/simple_animal/slime/proc/update_stat", function* update_stat(f: Frame) {
	if (this.stat == 1 && this.health > 0) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// life.dm:34
rt.def("/mob/living/simple_animal/slime/proc/AIprocess", function* AIprocess(f: Frame) {
	let sleeptime: Value = null;
	if (this.AIproc || this.stat || this.client) {
		return f.dot;
	}
	let hungry: Value = 0;
	if (this.nutrition < this.get_starve_nutrition()) {
		hungry = 2;
	} else if (this.nutrition < this.get_grow_nutrition() && prob(25) || this.nutrition < this.get_hunger_nutrition()) {
		hungry = 1;
	}
	this.AIproc = 1;
	while (this.AIproc && this.stat != 2 && (this.attacked || hungry || this.rabid || this.buckled)) {
		if (this.buckled) {
			break;
		}
		if (!this.Target || this.client) {
			break;
		}
		if (this.Target.health <= -70 || this.Target.stat == 2) {
			this.Target = null;
			this.AIproc = 0;
			break;
		}
		if (this.Target) {
			if (rt.locateIn(f, T("/mob/living/simple_animal/slime"), this.Target.buckled_mobs)) {
				this.Target = null;
				this.AIproc = 0;
				break;
			}
			if (!this.AIproc) {
				break;
			}
			if (rt.isIn(f, this.Target, view(1, this))) {
				if (rt.istype(this.Target, T("/mob/living/silicon"))) {
					if (!this.Atkcool) {
						this.Atkcool = 1;
						rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:69", hungry, sleeptime);
						if (this.Target.Adjacent(this)) {
							yield* this.Target.attack_slime(this);
						}
					}
					// tg returned here, skipping the `AIproc = 0` below: every later AIprocess quit at once (no hunting, no feeding).
					break;
				}
				if (!this.Target.lying && prob(80)) {
					if (this.Target.client && this.Target.health >= 20) {
						if (!this.Atkcool) {
							this.Atkcool = 1;
							rt.spawnTail(f, 45, "/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:80", hungry, sleeptime);
							if (this.Target.Adjacent(this)) {
								yield* this.Target.attack_slime(this);
							}
						}
					} else if (!this.Atkcool && this.Target.Adjacent(this)) {
						yield* this.Feedon(this.Target);
					}
				} else if (!this.Atkcool && this.Target.Adjacent(this)) {
					yield* this.Feedon(this.Target);
				}
			} else if (rt.isIn(f, this.Target, view(7, this))) {
				if (!this.Target.Adjacent(this)) {
					yield* step_to(this, this.Target);
				}
			} else {
				this.Target = null;
				this.AIproc = 0;
				break;
			}
		}
		if ((sleeptime = (yield* this.movement_delay())) <= 0) {
			sleeptime = 1;
		}
		yield* sleep(sleeptime + 2);
	}
	this.AIproc = 0;
	return f.dot;
}, true);

// a spawn(45) body of /mob/living/simple_animal/slime/proc/AIprocess, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:80", function* (f: Frame, hungry: Value, sleeptime: Value) {
	this.Atkcool = 0;
	return null;
});

// a spawn(45) body of /mob/living/simple_animal/slime/proc/AIprocess, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/slime/proc/AIprocess: spawn at modules/mob/living/simple_animal/slime/life.dm:69", function* (f: Frame, hungry: Value, sleeptime: Value) {
	this.Atkcool = 0;
	return null;
});

// life.dm:112
rt.def("/mob/living/simple_animal/slime/proc/handle_environment", function* handle_environment(f: Frame, environment: Value) {
	let bz_percentage: Value = null, stasis: Value = null;
	if (!environment) {
		return f.dot;
	}
	let loc_temp: Value = this.get_temperature(environment);
	if ((this.bodytemperature += this.adjust_body_temperature(this.bodytemperature, loc_temp, 1)) < 278.15) {
		if (this.bodytemperature <= 233.15) {
			this.Tempstun = 1;
		}
		if (this.bodytemperature <= 223.15) {
			if (this.bodytemperature <= 50) {
				yield* this.adjustBruteLoss(200);
			} else {
				yield* this.adjustBruteLoss(round(rt.op(f, "Sqrt", [], [this.bodytemperature])) * 2);
			}
		}
	} else {
		this.Tempstun = 0;
	}
	if (this.stat != 2) {
		bz_percentage = 0;
		if (rt.isIn(f, "bz", environment.gases)) {
			bz_percentage = rt.index(rt.index(environment.gases, "bz"), 1) / environment.total_moles();
		}
		stasis = (((bz_percentage >= 0.05 ? 1 : 0) && (this.bodytemperature < 373.15 ? 1 : 0)) || this.force_stasis);
		if (this.stat == 0 && stasis) {
			to_chat(this, "<span class='danger'>Nerve gas in the air has put you in stasis!</span>");
			this.stat = 1;
			this.powerlevel = 0;
			this.rabid = 0;
			yield* this.update_canmove();
			yield* this.regenerate_icons();
		} else if (this.stat == 1 && !stasis) {
			to_chat(this, "<span class='notice'>You wake up from the stasis.</span>");
			this.stat = 0;
			yield* this.update_canmove();
			yield* this.regenerate_icons();
		}
	}
	yield* this.updatehealth();
	return f.dot;
}, true);

// life.dm:160
rt.def("/mob/living/simple_animal/slime/proc/adjust_body_temperature", function adjust_body_temperature(f: Frame, current: Value, loc_temp: Value, boost: Value) {
	let increments: Value = null, temp_change: Value = null;
	let temperature: Value = current;
	let difference: Value = rt.op(f, "Abs", [], [current - loc_temp]);
	if (difference > 50) {
		increments = difference / 5;
	} else {
		increments = difference / 10;
	}
	let change: Value = increments * boost;
	if (current < loc_temp) {
		temperature = min(loc_temp, temperature + change);
	} else if (current > loc_temp) {
		temperature = max(loc_temp, temperature - change);
	}
	return (temp_change = temperature - current);
});

// life.dm:177
rt.def("/mob/living/simple_animal/slime/proc/handle_status_effects", function* handle_status_effects(f: Frame) {
	yield* parent_proc();
	if (!(prob(30) && !this.stat)) return f.dot;
	yield* this.adjustBruteLoss(-1);
	return f.dot;
}, true);

// life.dm:182
rt.def("/mob/living/simple_animal/slime/proc/handle_feeding", function* handle_feeding(f: Frame) {
	let C: Value = null, SA: Value = null, totaldamage: Value = null;
	if (!ismob(this.buckled)) {
		return f.dot;
	}
	let M: Value = this.buckled;
	if (this.stat) {
		yield* this.Feedstop({ silent: 1 });
	}
	if (M.stat == 2) {
		if (!this.client) {
			if (!this.rabid && !this.attacked) {
				if (M.LAssailant && M.LAssailant != M) {
					if (prob(50)) {
						if (!rt.isIn(f, M.LAssailant, this.Friends)) {
							rt.setAt(this.Friends, M.LAssailant, 1);
						} else {
							rt.incAt(this.Friends, M.LAssailant, 1, false);
						}
					}
				}
			}
		} else {
			to_chat(this, "<i>This subject does not have a strong enough life energy anymore...</i>");
		}
		if (M.client && rt.istype(M, T("/mob/living/carbon/human"))) {
			if (prob(85)) {
				this.rabid = 1;
			}
		}
		yield* this.Feedstop();
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		yield* (C = M).adjustCloneLoss(rand(2, 4));
		yield* C.adjustToxLoss(rand(1, 2));
		if (prob(10) && C.client) {
			to_chat(C, `<span class='userdanger'>${pick("You can feel your body becoming weak!", "You feel like you're about to die!", "You feel every part of your body screaming in agony!", "A low, rolling pain passes through your body!", "Your body feels as if it's falling apart!", "You feel extremely weak!", "A sharp, deep pain bathes every inch of your body!")}</span>`);
		}
	} else if (rt.istype(M, T("/mob/living/simple_animal"))) {
		SA = M;
		totaldamage = 0;
		totaldamage += (yield* SA.adjustCloneLoss(rand(2, 4)));
		if ((totaldamage += (yield* SA.adjustToxLoss(rand(1, 2)))) <= 0) {
			yield* this.Feedstop(0, 0);
			return f.dot;
		}
	} else {
		yield* this.Feedstop(0, 0);
		return f.dot;
	}
	this.add_nutrition(rand(7, 15) * GLOB.config.damage_multiplier);
	yield* this.adjustBruteLoss(-3);
	return f.dot;
}, true);

// life.dm:248
rt.def("/mob/living/simple_animal/slime/proc/handle_nutrition", function* handle_nutrition(f: Frame) {
	if (this.docile) {
		this.nutrition = 700;
		return f.dot;
	}
	if (prob(15)) {
		this.nutrition -= 1 + this.is_adult;
	}
	if (this.nutrition <= 0) {
		this.nutrition = 0;
		if (prob(75)) {
			yield* this.adjustBruteLoss(rand(0, 5));
		}
	} else if (this.nutrition >= this.get_grow_nutrition() && this.amount_grown < SLIME_EVOLUTION_THRESHOLD) {
		this.nutrition -= 20;
		this.amount_grown++;
		yield* this.update_action_buttons_icon();
	}
	if (!(this.amount_grown >= SLIME_EVOLUTION_THRESHOLD && !this.buckled && !this.Target && !this.ckey)) return f.dot;
	if (this.is_adult) {
		yield* this.Reproduce();
	} else {
		yield* this.Evolve();
	}
	return f.dot;
}, true);

// life.dm:268
rt.def("/mob/living/simple_animal/slime/proc/add_nutrition", function add_nutrition(f: Frame, nutrition_to_add: Value) {
	nutrition_to_add ??= 0;
	this.nutrition = min(this.nutrition + nutrition_to_add, this.get_max_nutrition());
	if (this.nutrition >= this.get_grow_nutrition()) {
		if (this.powerlevel < 10) {
			if (prob(30 - this.powerlevel * 2)) {
				this.powerlevel++;
			}
		}
	} else {
		if (!(this.nutrition >= this.get_hunger_nutrition() + 100)) return f.dot;
		if (!(this.powerlevel < 5)) return f.dot;
		if (!prob(25 - this.powerlevel * 5)) return f.dot;
		this.powerlevel++;
	}
	return f.dot;
});

// life.dm:283
rt.def("/mob/living/simple_animal/slime/proc/handle_targets", function* handle_targets(f: Frame) {
	let nofriend: Value = null, targets: Value = null, L: Value = null, H: Value = null, C: Value = null;
	if (this.Tempstun) {
		if (!this.buckled) {
			this.canmove = 0;
		}
	} else {
		this.canmove = 1;
	}
	if (this.attacked > 50) {
		this.attacked = 50;
	}
	if (this.attacked > 0) {
		this.attacked--;
	}
	if (this.Discipline > 0) {
		if (this.Discipline >= 5 && this.rabid) {
			if (prob(60)) {
				this.rabid = 0;
			}
		}
		if (prob(10)) {
			this.Discipline--;
		}
	}
	if (this.client) return f.dot;
	if (!this.canmove) {
		return f.dot;
	}
	if (this.buckled) {
		return f.dot;
	}
	if (this.Target) {
		--this.target_patience;
		if (this.target_patience <= 0 || this.SStun > rt.worldTime(f) || this.Discipline || this.attacked || this.docile) {
			this.target_patience = 0;
			this.Target = null;
		}
	}
	if (this.AIproc && this.SStun > rt.worldTime(f)) {
		return f.dot;
	}
	let hungry: Value = 0;
	if (this.nutrition < this.get_starve_nutrition()) {
		hungry = 2;
	} else if (this.nutrition < this.get_grow_nutrition() && prob(25) || this.nutrition < this.get_hunger_nutrition()) {
		hungry = 1;
	}
	if (hungry == 2 && !this.client) {
		if (rt.len(f, this.Friends) > 0 && prob(1)) {
			nofriend = pick(this.Friends);
			rt.incAt(this.Friends, nofriend, -1, false);
		}
	}
	if (!this.Target) {
		if (this.will_hunt() && hungry || this.attacked || this.rabid) {
			targets = list();
			for (L of each(view(7, this), T("/mob/living"))) {
				if (rt.istype(L, T("/mob/living/simple_animal/slime")) || L.stat == 2) {
					continue;
				}
				if (rt.isIn(f, L, this.Friends)) {
					continue;
				}
				if (rt.istype(L, T("/mob/living/silicon")) && (this.rabid || this.attacked)) {
					targets += L;
				}
				if (rt.istype(L, T("/mob/living/carbon/human"))) {
					H = L;
					if (rt.isIn(f, this.type, H.dna.species.ignored_by)) {
						continue;
					}
				}
				if (rt.locateIn(f, T("/mob/living/simple_animal/slime"), L.buckled_mobs)) {
					continue;
				}
				targets += L;
			}
			if (rt.len(f, targets) > 0) {
				if (this.attacked || this.rabid || hungry == 2) {
					this.Target = rt.index(targets, 1);
				} else {
					for (C of each(targets, T("/mob/living/carbon"))) {
						if (!this.Discipline && prob(5)) {
							if (rt.istype(C, T("/mob/living/carbon/human")) || rt.istype(C, T("/mob/living/carbon/alien/humanoid"))) {
								this.Target = C;
								break;
							}
						}
						if (rt.istype(C, T("/mob/living/carbon/alien/larva")) || rt.istype(C, T("/mob/living/carbon/monkey"))) {
							this.Target = C;
							break;
						}
					}
				}
			}
		}
		if (this.Target) {
			this.target_patience = rand(5, 7);
			if (this.is_adult) {
				this.target_patience += 3;
			}
		}
	}
	if (!this.Target) {
		if (this.Leader) {
			if (this.holding_still) {
				this.holding_still = max(this.holding_still - 1, 0);
			} else if (this.canmove && isturf(this.loc)) {
				yield* step_to(this, this.Leader);
			}
		} else if (hungry) {
			if (this.holding_still) {
				this.holding_still = max(this.holding_still - hungry, 0);
			} else if (this.canmove && isturf(this.loc) && prob(50)) {
				yield* step(this, pick(GLOB.cardinal));
			}
		} else if (this.holding_still) {
			this.holding_still = max(this.holding_still - 1, 0);
		} else if (this.docile && this.pulledby) {
			this.holding_still = 10;
		} else if (this.canmove && isturf(this.loc) && prob(33)) {
			yield* step(this, pick(GLOB.cardinal));
		}
	} else {
		if (this.AIproc) return f.dot;
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/slime/proc/AIprocess"));
	}
	return f.dot;
}, true);

// life.dm:405
rt.def("/mob/living/simple_animal/slime/proc/handle_mood", function handle_mood(f: Frame) {
	let newmood: Value = "";
	if (this.rabid || this.attacked) {
		newmood = "angry";
	} else if (this.docile) {
		newmood = ":3";
	} else if (this.Target) {
		newmood = "mischevous";
	}
	if (!newmood) {
		if (this.Discipline && prob(25)) {
			newmood = "pout";
		} else if (prob(1)) {
			newmood = pick("sad", ":3", "pout");
		}
	}
	if ((this.mood == "sad" || this.mood == ":3" || this.mood == "pout") && !newmood) {
		if (prob(75)) {
			newmood = this.mood;
		}
	}
	if (newmood == this.mood) return f.dot;
	this.mood = newmood;
	this.regenerate_icons();
	return f.dot;
});

// life.dm:430
rt.def("/mob/living/simple_animal/slime/proc/handle_speech", function* handle_speech(f: Frame) {
	let to_say: Value = null, who: Value = null, phrase: Value = null, L: Value = null, t: Value = null, slimes_near: Value = null, dead_slimes: Value = null, friends_near: Value = null, L_5: Value = null, phrases: Value = null, M: Value = null;
	if (rt.len(f, this.speech_buffer) > 0) {
		who = rt.index(this.speech_buffer, 1);
		if (findtext((phrase = rt.index(this.speech_buffer, 2)), num2text(this.number)) || findtext(phrase, "slimes")) {
			if (findtext(phrase, "hello") || findtext(phrase, "hi")) {
				to_say = pick("Hello...", "Hi...");
			} else if (findtext(phrase, "follow")) {
				if (this.Leader) {
					if (this.Leader == who) {
						to_say = pick("Yes...", "Lead...", "Follow...");
					} else if (rt.index(this.Friends, who) > rt.index(this.Friends, this.Leader)) {
						this.Leader = who;
						to_say = `Yes... I follow ${who}...`;
					} else {
						to_say = `No... I follow ${this.Leader}...`;
					}
				} else if (rt.index(this.Friends, who) >= SLIME_FRIENDSHIP_FOLLOW) {
					this.Leader = who;
					to_say = "I follow...";
				} else {
					to_say = pick("No...", "I no follow...");
				}
			} else if (findtext(phrase, "stop")) {
				if (this.buckled) {
					if (rt.index(this.Friends, who) >= SLIME_FRIENDSHIP_STOPEAT) {
						yield* this.Feedstop();
						this.Target = null;
						if (rt.index(this.Friends, who) < SLIME_FRIENDSHIP_STOPEAT_NOANGRY) {
							rt.incAt(this.Friends, who, -1, false);
							to_say = "Grrr...";
						} else {
							to_say = "Fine...";
						}
					}
				} else if (this.Target) {
					if (rt.index(this.Friends, who) >= SLIME_FRIENDSHIP_STOPCHASE) {
						this.Target = null;
						if (rt.index(this.Friends, who) < SLIME_FRIENDSHIP_STOPCHASE_NOANGRY) {
							rt.incAt(this.Friends, who, -1, false);
							to_say = "Grrr...";
						} else {
							to_say = "Fine...";
						}
					}
				} else if (this.Leader) {
					if (this.Leader == who) {
						to_say = "Yes... I stay...";
						this.Leader = null;
					} else if (rt.index(this.Friends, who) > rt.index(this.Friends, this.Leader)) {
						this.Leader = null;
						to_say = "Yes... I stop...";
					} else {
						to_say = "No... keep follow...";
					}
				}
			} else if (findtext(phrase, "stay")) {
				if (this.Leader) {
					if (this.Leader == who) {
						this.holding_still = rt.index(this.Friends, who) * 10;
						to_say = "Yes... stay...";
					} else if (rt.index(this.Friends, who) > rt.index(this.Friends, this.Leader)) {
						this.holding_still = (rt.index(this.Friends, who) - rt.index(this.Friends, this.Leader)) * 10;
						to_say = "Yes... stay...";
					} else {
						to_say = "No... keep follow...";
					}
				} else if (rt.index(this.Friends, who) >= SLIME_FRIENDSHIP_STAY) {
					this.holding_still = rt.index(this.Friends, who) * 10;
					to_say = "Yes... stay...";
				} else {
					to_say = "No... won't stay...";
				}
			} else if (findtext(phrase, "attack")) {
				if (this.rabid && prob(20)) {
					this.Target = who;
					yield* this.AIprocess();
					to_say = "ATTACK!?!?";
				} else if (rt.index(this.Friends, who) >= SLIME_FRIENDSHIP_ATTACK) {
					for (L of each(view(7, this) - list(this, who), T("/mob/living"))) {
						if (findtext(phrase, lowertext(L.name))) {
							if (rt.istype(L, T("/mob/living/simple_animal/slime"))) {
								to_say = `NO... ${L} slime friend`;
								rt.incAt(this.Friends, who, -1, false);
							} else if (!rt.index(this.Friends, L) || rt.index(this.Friends, L) < 1) {
								this.Target = L;
								yield* this.AIprocess();
								to_say = `Ok... I attack ${this.Target}`;
							} else {
								to_say = `No... like ${L} ...`;
								rt.incAt(this.Friends, who, -1, false);
							}
							break;
						}
					}
				} else {
					to_say = "No... no listen";
				}
			}
		}
		this.speech_buffer = list();
	}
	if (to_say) {
		yield* this.say(to_say);
	} else if (prob(1)) {
		yield* this.emote(pick("bounce", "sway", "light", "vibrate", "jiggle"));
	} else {
		t = 10;
		slimes_near = 0;
		dead_slimes = 0;
		friends_near = list();
		for (L_5 of each(view(7, this), T("/mob/living"))) {
			if (rt.istype(L_5, T("/mob/living/simple_animal/slime")) && L_5 != this) {
				slimes_near++;
				if (L_5.stat == 2) {
					dead_slimes++;
				}
			}
			if (rt.isIn(f, L_5, this.Friends)) {
				t += 20;
				friends_near += L_5;
			}
		}
		if (this.nutrition < this.get_hunger_nutrition()) {
			t += 10;
		}
		if (this.nutrition < this.get_starve_nutrition()) {
			t += 10;
		}
		if (!(prob(2) && prob(t))) return f.dot;
		phrases = list();
		if (this.Target) {
			phrases += `${this.Target}... look yummy...`;
		}
		if (this.nutrition < this.get_starve_nutrition()) {
			phrases += "So... hungry...";
			phrases += "Very... hungry...";
			phrases += "Need... food...";
			phrases += "Must... eat...";
		} else if (this.nutrition < this.get_hunger_nutrition()) {
			phrases += "Hungry...";
			phrases += "Where food?";
			phrases += "I want to eat...";
		}
		phrases += "Rawr...";
		phrases += "Blop...";
		phrases += "Blorble...";
		if (this.rabid || this.attacked) {
			phrases += "Hrr...";
			phrases += "Nhuu...";
			phrases += "Unn...";
		}
		if (this.mood == ":3") {
			phrases += "Purr...";
		}
		if (this.attacked) {
			phrases += "Grrr...";
		}
		if (this.bodytemperature < 273.15) {
			phrases += "Cold...";
		}
		if (this.bodytemperature < 243.15) {
			phrases += "So... cold...";
			phrases += "Very... cold...";
		}
		if (this.bodytemperature < 223.15) {
			phrases += "...";
			phrases += "C... c...";
		}
		if (this.buckled) {
			phrases += "Nom...";
			phrases += "Yummy...";
		}
		if (this.powerlevel > 3) {
			phrases += "Bzzz...";
		}
		if (this.powerlevel > 5) {
			phrases += "Zap...";
		}
		if (this.powerlevel > 8) {
			phrases += "Zap... Bzz...";
		}
		if (this.mood == "sad") {
			phrases += "Bored...";
		}
		if (slimes_near) {
			phrases += "Slime friend...";
		}
		if (slimes_near > 1) {
			phrases += "Slime friends...";
		}
		if (dead_slimes) {
			phrases += "What happened?";
		}
		if (!slimes_near) {
			phrases += "Lonely...";
		}
		for (M of each(friends_near)) {
			phrases += `${M}... friend...`;
			if (this.nutrition < this.get_hunger_nutrition()) {
				phrases += `${M}... feed me...`;
			}
		}
		yield* this.say(pick(phrases));
	}
	return f.dot;
}, true);

// life.dm:600
rt.def("/mob/living/simple_animal/slime/proc/get_max_nutrition", function get_max_nutrition(f: Frame) {
	if (this.is_adult) {
		return 1200;
	} else {
		return 1000;
	}
});

// life.dm:606
rt.def("/mob/living/simple_animal/slime/proc/get_grow_nutrition", function get_grow_nutrition(f: Frame) {
	if (this.is_adult) {
		return 1000;
	} else {
		return 800;
	}
});

// life.dm:612
rt.def("/mob/living/simple_animal/slime/proc/get_hunger_nutrition", function get_hunger_nutrition(f: Frame) {
	if (this.is_adult) {
		return 600;
	} else {
		return 500;
	}
});

// life.dm:618
rt.def("/mob/living/simple_animal/slime/proc/get_starve_nutrition", function get_starve_nutrition(f: Frame) {
	if (this.is_adult) {
		return 300;
	} else {
		return 200;
	}
});

// life.dm:625
rt.def("/mob/living/simple_animal/slime/proc/will_hunt", function will_hunt(f: Frame, hunger: Value) {
	hunger ??= -1;
	if (this.docile) {
		return 0;
	}
	if (hunger == 2 || this.rabid || this.attacked) {
		return 1;
	}
	if (this.Leader) {
		return 0;
	}
	if (this.holding_still) {
		return 0;
	}
	return 1;
});
