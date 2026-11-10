// Based on /tg/station's code/modules/mob/living/simple_animal/slime/powers.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(165, "/datum/action/innate/slime", "/datum/action/innate", {
	needs_growth: 0,
	check_flags: 8,
	background_icon_state: "bg_alien",
});

// powers.dm:14
rt.def("/datum/action/innate/slime/proc/IsAvailable", function IsAvailable(f: Frame) {
	if (!parent_proc()) return f.dot;
	let S: Value = this.owner;
	if (this.needs_growth == GROWTH_NEEDED) {
		if (S.amount_grown >= SLIME_EVOLUTION_THRESHOLD) {
			return 1;
		}
		return 0;
	}
	return 1;
});

// powers.dm:29
rt.def("/mob/living/simple_animal/slime/verb/Feed", function* Feed(f: Frame) {
	let C: Value = null, M: Value = null;
	if (this.stat) {
		return 0;
	}
	let choices: Value = list();
	for (C of each(view(1, this), T("/mob/living"))) {
		if (C != this && this.Adjacent(C)) {
			choices += C;
		}
	}
	if (!(M = (yield* g.op(f, "Prompt", [0], [null, null, "Who do you wish to feed on?", this, rt.bitOr(null, choices)])))) {
		return 0;
	}
	if (!(yield* this.CanFeedon(M))) return f.dot;
	yield* this.Feedon(M);
	return 1;
}, true, { verb: { category: "Slime", desc: "This will let you feed on any valid creature in the surrounding area. This should also be used to halt the feeding process." } });

rt.type(166, "/datum/action/innate/slime/feed", "/datum/action/innate/slime", {
	name: "Feed",
	button_icon_state: "slimeeat",
});

// powers.dm:47
rt.def("/datum/action/innate/slime/feed/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null;
	yield* (S = this.owner).Feed();
	return f.dot;
}, true);

// powers.dm:51
rt.def("/mob/living/simple_animal/slime/proc/CanFeedon", function* CanFeedon(f: Frame, M: Value) {
	if (!this.Adjacent(M)) {
		return 0;
	}
	if (this.buckled) {
		yield* this.Feedstop();
		return 0;
	}
	if (rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(this, "<span class='warning'><i>I can't latch onto another slime...</i></span>");
		return 0;
	}
	if (this.docile) {
		to_chat(this, "<span class='notice'><i>I'm not hungry anymore...</i></span>");
		return 0;
	}
	if (this.stat) {
		to_chat(this, "<span class='warning'><i>I must be conscious to do this...</i></span>");
		return 0;
	}
	if (M.stat == 2) {
		to_chat(this, "<span class='warning'><i>This subject does not have a strong enough life energy...</i></span>");
		return 0;
	}
	if (rt.locateIn(f, T("/mob/living/simple_animal/slime"), M.buckled_mobs)) {
		to_chat(this, "<span class='warning'><i>Another slime is already feeding on this subject...</i></span>");
		return 0;
	}
	return 1;
}, true);

// powers.dm:80
rt.def("/mob/living/simple_animal/slime/proc/Feedon", function* Feedon(f: Frame, M: Value) {
	yield* M.unbuckle_all_mobs({ force: 1 });
	if (yield* M.buckle_mob(this, { force: 1 })) {
		this.layer = M.layer + 0.01;
		M.visible_message(`<span class='danger'>${this.name} has latched onto ${M}!</span>`, `<span class='userdanger'>${this.name} has latched onto ${M}!</span>`);
	} else {
		to_chat(this, "<span class='warning'><i>I have failed to latch onto the subject!</i></span>");
	}
	return f.dot;
}, true);

// powers.dm:90
rt.def("/mob/living/simple_animal/slime/proc/Feedstop", function* Feedstop(f: Frame, silent: Value, living: Value) {
	silent ??= 0;
	living ??= 1;
	if (!this.buckled) return f.dot;
	if (!living) {
		to_chat(this, `<span class='warning'>${pick("This subject is incompatible", "This subject does not have life energy", "This subject is empty", "I am not satisified", "I can not feed from this subject", "I do not feel nourished", "This subject is not food")}!</span>`);
	}
	if (!silent) {
		this.visible_message(`<span class='warning'>${this} has let go of ${this.buckled}!</span>`, "<span class='notice'><i>I stopped feeding.</i></span>");
	}
	this.layer = rt.initial(f, this, "layer");
	yield* this.buckled.unbuckle_mob(this, { force: 1 });
	return f.dot;
}, true);

// powers.dm:106
rt.def("/mob/living/simple_animal/slime/verb/Evolve", function* Evolve(f: Frame) {
	let E: Value = null;
	if (this.stat) {
		to_chat(this, "<i>I must be conscious to do this...</i>");
		return f.dot;
	}
	if (!this.is_adult) {
		if (this.amount_grown >= 10) {
			this.is_adult = 1;
			this.maxHealth = 200;
			this.amount_grown = 0;
			for (E of each(this.actions, T("/datum/action/innate/slime/evolve"))) {
				yield* E.Remove(this);
			}
			yield* this.regenerate_icons();
			this.update_name();
		} else {
			to_chat(this, "<i>I am not ready to evolve yet...</i>");
		}
	} else {
		to_chat(this, "<i>I have already evolved...</i>");
	}
	return f.dot;
}, true, { verb: { category: "Slime", desc: "This will let you evolve from baby to adult slime." } });

rt.type(167, "/datum/action/innate/slime/evolve", "/datum/action/innate/slime", {
	needs_growth: 1,
	name: "Evolve",
	button_icon_state: "slimegrow",
});

// powers.dm:128
rt.def("/datum/action/innate/slime/evolve/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null, A: Value = null;
	yield* (S = this.owner).Evolve();
	if (!S.is_adult) return f.dot;
	yield* (A = (yield* new_(T("/datum/action/innate/slime/reproduce")))).Grant(S);
	return f.dot;
}, true);

// powers.dm:139
rt.def("/mob/living/simple_animal/slime/verb/Reproduce", function* Reproduce(f: Frame) {
	let babies: Value = null, new_nutrition: Value = null, new_powerlevel: Value = null, i: Value = null, child_colour: Value = null, M: Value = null, new_slime: Value = null;
	if (this.stat) {
		to_chat(this, "<i>I must be conscious to do this...</i>");
		return f.dot;
	}
	if (this.is_adult) {
		if (this.amount_grown >= 10) {
			if (this.stat) {
				to_chat(this, "<i>I must be conscious to do this...</i>");
				return f.dot;
			}
			babies = list();
			new_nutrition = round(this.nutrition * 0.9);
			new_powerlevel = round(this.powerlevel / 4);
			i = 1;
			while (i <= 4) {
				child_colour = null;
				if (this.mutation_chance >= 100) {
					child_colour = "rainbow";
				} else if (prob(this.mutation_chance)) {
					child_colour = rt.index(this.slime_mutation, rand(1, 4));
				} else {
					child_colour = this.colour;
				}
				M = null;
				M = (yield* new_(T("/mob/living/simple_animal/slime"), this.loc, child_colour));
				if (this.ckey) {
					M.nutrition = new_nutrition;
				}
				M.powerlevel = new_powerlevel;
				if (i != 1) {
					yield* step_away(M, this);
				}
				M.Friends = (yield* this.Friends.Copy());
				babies += M;
				M.mutation_chance = max(0, min(this.mutation_chance + rand(5, -5), 100));
				i++;
			}
			(new_slime = pick(babies)).a_intent = "harm";
			if (this.mind) {
				yield* this.mind.transfer_to(new_slime);
			} else {
				new_slime.key = this.key;
			}
			yield* qdel(this);
		} else {
			to_chat(this, "<i>I am not ready to reproduce yet...</i>");
		}
	} else {
		to_chat(this, "<i>I am not old enough to reproduce yet...</i>");
	}
	return f.dot;
}, true, { verb: { category: "Slime", desc: "This will make you split into four Slimes." } });

rt.type(168, "/datum/action/innate/slime/reproduce", "/datum/action/innate/slime", {
	needs_growth: 1,
	name: "Reproduce",
	button_icon_state: "slimesplit",
});

// powers.dm:189
rt.def("/datum/action/innate/slime/reproduce/proc/Activate", function* Activate(f: Frame) {
	let S: Value = null;
	yield* (S = this.owner).Reproduce();
	return f.dot;
}, true);
