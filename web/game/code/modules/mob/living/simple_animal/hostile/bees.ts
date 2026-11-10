// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/bees.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4910, "/mob/living/simple_animal/hostile/poison/bees", "/mob/living/simple_animal/hostile/poison", {
	beegent: null,
	beehome: null,
	idle: 0,
	isqueen: 0,
	icon_base: "bee",
	pass_flags: 21,
	name: "bee",
	desc: "Buzzy buzzy bee, stingy sti- Ouch!",
	icon_state: "",
	icon_living: "",
	icon: rt.rsc("icons/mob/bees.dmi"),
	gender: "female",
	speak_emote: null,
	emote_hear: null,
	turns_per_move: 0,
	melee_damage_lower: 1,
	melee_damage_upper: 1,
	attacktext: "stings",
	response_help: "shoos",
	response_disarm: "swats away",
	response_harm: "squashes",
	maxHealth: 10,
	health: 10,
	faction: null,
	move_to_delay: 0,
	obj_damage: 0,
	environment_smash: 0,
	mouse_opacity: 2,
	mob_size: 0,
	movement_type: 2,
	gold_core_spawnable: 1,
	search_objects: 1,
	atmos_requirements: null,
	minbodytemp: 0,
	del_on_death: 1,
});

// bees.dm:20
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("buzzes");

	this.emote_hear = list("buzzes");

	this.faction = list("hostile");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// bees.dm:59
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.generate_bee_visuals();
	return f.dot;
}, true);

// bees.dm:65
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Destroy", function* Destroy(f: Frame) {
	if (this.beehome) {
		this.beehome.bees -= this;
		this.beehome = null;
	}
	this.beegent = null;
	return (yield* parent_proc());
}, true);

// bees.dm:73
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/death", function* death(f: Frame, gibbed: Value) {
	if (this.beehome) {
		this.beehome.bees -= this;
		this.beehome = null;
	}
	this.beegent = null;
	yield* parent_proc();
	return f.dot;
}, true);

// bees.dm:80
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.beehome) return f.dot;
	to_chat(user, "<span class='warning'>This bee is homeless!</span>");
	return f.dot;
}, false);

// bees.dm:87
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/generate_bee_visuals", function generate_bee_visuals(f: Frame) {
	this.cut_overlays();
	let col: Value = "#e5e500";
	if (this.beegent && this.beegent.color) {
		col = this.beegent.color;
	}
	this.add_overlay(`${this.icon_base}_base`);
	GLOB.greyscale_overlay = (GLOB.greyscale_overlay || mutable_appearance(rt.rsc("icons/mob/bees.dmi")));
	GLOB.greyscale_overlay.icon_state = `${this.icon_base}_grey`;
	GLOB.greyscale_overlay.color = col;
	this.add_overlay(GLOB.greyscale_overlay);
	this.add_overlay(`${this.icon_base}_wings`);
	return f.dot;
});

// bees.dm:106
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	let H: Value = null;
	f.dot = parent_proc();
	if (!f.dot) {
		return 0;
	}
	if (!rt.istype(the_target, T("/mob/living"))) return f.dot;
	return (!(H = the_target).bee_friendly() ? 1 : 0);
}, false);

// bees.dm:115
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/Found", function Found(f: Frame, A: Value) {
	let Hydro: Value = null, H: Value = null;
	if (rt.istype(A, T("/obj/machinery/hydroponics"))) {
		if ((Hydro = A).myseed && !Hydro.dead && !Hydro.recent_bee_visit) {
			(rt.modSrcVar(f, "wanted_objects", typecacheof(T("/obj/machinery/hydroponics")), rt.bitOr));
			return 1;
		}
	}
	if (rt.istype(A, T("/mob/living"))) {
		return (!(H = A).bee_friendly() ? 1 : 0);
	}
	return 0;
});

// bees.dm:128
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let Hydro: Value = null, BB: Value = null, L: Value = null;
	if (rt.istype(this.target, T("/obj/machinery/hydroponics"))) {
		this.pollinate((Hydro = this.target));
	} else if (this.target == this.beehome) {
		this.loc = (BB = this.target);
		this.target = null;
		this.wanted_objects -= typecacheof(T("/obj/structure/beebox"));
		return f.dot;
	} else {
		f.dot = (yield* parent_proc());
		if (!(f.dot && this.beegent && rt.istype(this.target, T("/mob/living")))) return f.dot;
		if (!(L = this.target).reagents) return f.dot;
		yield* this.beegent.reaction_mob(L, INJECT);
		yield* L.reagents.add_reagent(this.beegent.id, rand(1, 5));
	}
	return f.dot;
}, true);

// bees.dm:147
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/assign_reagent", function assign_reagent(f: Frame, R: Value) {
	if (!rt.istype(R, T("/datum/reagent"))) return f.dot;
	this.beegent = R;
	this.name = `${rt.initial(f, this, "name")} (${R.name})`;
	this.generate_bee_visuals();
	return f.dot;
});

// bees.dm:154
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/pollinate", function pollinate(f: Frame, Hydro: Value) {
	let growth: Value = null;
	if (!rt.istype(Hydro, T("/obj/machinery/hydroponics")) || !Hydro.myseed || Hydro.dead || Hydro.recent_bee_visit) {
		this.target = null;
		return f.dot;
	}
	this.target = null;
	this.wanted_objects -= typecacheof(T("/obj/machinery/hydroponics"));
	Hydro.recent_bee_visit = 1;
	rt.spawnTail(f, BEE_TRAY_RECENT_VISIT, "/mob/living/simple_animal/hostile/poison/bees/proc/pollinate: spawn at modules/mob/living/simple_animal/hostile/bees.dm:161", Hydro, growth);
	growth = this.health;
	Hydro.adjustHealth(growth * 0.5);
	if (prob(BEE_POLLINATE_PEST_CHANCE)) {
		Hydro.adjustPests(-10);
	}
	if (prob(BEE_POLLINATE_YIELD_CHANCE)) {
		Hydro.myseed.adjust_yield(1);
		Hydro.yieldmod = 2;
	}
	if (prob(BEE_POLLINATE_POTENCY_CHANCE)) {
		Hydro.myseed.adjust_potency(1);
	}
	if (!this.beehome) return f.dot;
	this.beehome.bee_resources = min(this.beehome.bee_resources + growth, 100);
	return f.dot;
});

// a spawn(200) body of /mob/living/simple_animal/hostile/poison/bees/proc/pollinate, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/bees/proc/pollinate: spawn at modules/mob/living/simple_animal/hostile/bees.dm:161", function* (f: Frame, Hydro: Value, growth: Value) {
	if (Hydro) {
		Hydro.recent_bee_visit = 0;
	}
	return null;
});

// bees.dm:181
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let BB: Value = null;
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		return f.dot;
	}
	if (!this.isqueen) {
		if (this.loc == this.beehome) {
			this.idle = min(100, ++this.idle);
			if (this.idle >= BEE_IDLE_ROAMING && prob(BEE_PROB_GOROAM)) {
				this.loc = rt.getStep(f, this.beehome, 0);
			}
		} else {
			this.idle = max(0, --this.idle);
			if (this.idle <= BEE_IDLE_GOHOME && prob(BEE_PROB_GOHOME)) {
				if (!(yield* this.FindTarget())) {
					(rt.modSrcVar(f, "wanted_objects", typecacheof(T("/obj/structure/beebox")), rt.bitOr));
					this.target = this.beehome;
				}
			}
		}
	}
	if (this.beehome) return f.dot;
	for (BB of each(view(this.vision_range, this), T("/obj/structure/beebox"))) {
		if (this.reagent_incompatible(BB.queen_bee) || rt.len(f, BB.bees) >= BB.get_max_bees()) {
			continue;
		}
		(rt.modField(f, BB, "bees", this, rt.bitOr));
		this.beehome = BB;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(4911, "/mob/living/simple_animal/hostile/poison/bees/toxin", "/mob/living/simple_animal/hostile/poison/bees", {});

// bees.dm:204
rt.def("/mob/living/simple_animal/hostile/poison/bees/toxin/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let R: Value = pick(typesof(T("/datum/reagent/toxin")));
	this.assign_reagent(rt.index(GLOB.chemical_reagents_list, rt.initial(f, R, "id")));
	return f.dot;
}, true);

rt.type(4912, "/mob/living/simple_animal/hostile/poison/bees/queen", "/mob/living/simple_animal/hostile/poison/bees", {
	icon_base: "queen",
	isqueen: 1,
	name: "queen bee",
	desc: "She's the queen of bees, BZZ BZZ!",
});

// bees.dm:222
rt.def("/mob/living/simple_animal/hostile/poison/bees/queen/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.beegent && rt.istype(this.target, T("/mob/living")))) return f.dot;
	let L: Value = this.target;
	yield* this.beegent.reaction_mob(L, TOUCH);
	yield* L.reagents.add_reagent(this.beegent.id, rand(1, 5));
	return f.dot;
}, true);

// bees.dm:235
rt.def("/mob/living/simple_animal/hostile/poison/bees/proc/reagent_incompatible", function reagent_incompatible(f: Frame, B: Value) {
	if (!B) {
		return 0;
	}
	if (B.beegent && this.beegent && B.beegent.id != this.beegent.id || B.beegent && !this.beegent || !B.beegent && this.beegent) {
		return 1;
	}
	return 0;
});

rt.type(10129, "/obj/item/queen_bee", "/obj/item", {
	queen: null,
	item_state: "",
	name: "queen bee",
	desc: "She's the queen of bees, BZZ BZZ!",
	icon_state: "queen_item",
	icon: rt.rsc("icons/mob/bees.dmi"),
});

// bees.dm:252
rt.def("/obj/item/queen_bee/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let S: Value = null, qb: Value = null, R: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/syringe"))) {
		if ((S = I).reagents.has_reagent("royal_bee_jelly")) {
			if (S.reagents.has_reagent("royal_bee_jelly", 5)) {
				yield* S.reagents.remove_reagent("royal_bee_jelly", 5);
				(qb = (yield* new_(T("/obj/item/queen_bee"), rt.getStep(f, user, 0)))).queen = (yield* new_(T("/mob/living/simple_animal/hostile/poison/bees/queen"), qb));
				if (this.queen && this.queen.beegent) {
					qb.queen.assign_reagent(this.queen.beegent);
				}
				yield* user.put_in_active_hand(qb);
				user.visible_message(`<span class='notice'>${user} injects ${this} with royal bee jelly, causing it to split into two bees, MORE BEES!</span>`, `<span class ='warning'>You inject ${this} with royal bee jelly, causing it to split into two bees, MORE BEES!</span>`);
			} else {
				to_chat(user, "<span class='warning'>You don't have enough royal bee jelly to split a bee in two!</span>");
			}
		} else if ((R = rt.index(GLOB.chemical_reagents_list, S.reagents.get_master_reagent_id())) && S.reagents.has_reagent(R.id, 5)) {
			yield* S.reagents.remove_reagent(R.id, 5);
			this.queen.assign_reagent(R);
			user.visible_message(`<span class='warning'>${user} injects ${this}'s genome with ${R.name}, mutating it's DNA!</span>`, `<span class='warning'>You inject ${this}'s genome with ${R.name}, mutating it's DNA!</span>`);
			this.name = this.queen.name;
		} else {
			to_chat(user, "<span class='warning'>You don't have enough units of that chemical to modify the bee's DNA!</span>");
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10130, "/obj/item/queen_bee/bought", "/obj/item/queen_bee", {});

// bees.dm:278
rt.def("/obj/item/queen_bee/bought/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.queen = (yield* new_(T("/mob/living/simple_animal/hostile/poison/bees/queen"), this));
	return f.dot;
}, true);

// bees.dm:283
rt.def("/obj/item/queen_bee/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.queen);
	this.queen = null;
	return (yield* parent_proc());
}, true);
