// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/giant_spider.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(4909, "/mob/living/simple_animal/hostile/poison", "/mob/living/simple_animal/hostile", {
	poison_per_bite: 5,
	poison_type: "toxin",
});

// giant_spider.dm:12
rt.def("/mob/living/simple_animal/hostile/poison/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	let L: Value = null;
	f.dot = (yield* parent_proc());
	if (!(f.dot && rt.istype(this.target, T("/mob/living")))) return f.dot;
	if (!(L = this.target).reagents) return f.dot;
	yield* L.reagents.add_reagent(this.poison_type, this.poison_per_bite);
	return f.dot;
}, true);

rt.type(4913, "/mob/living/simple_animal/hostile/poison/giant_spider", "/mob/living/simple_animal/hostile/poison", {
	busy: 0,
	playable_spider: 0,
	pass_flags: 1,
	name: "giant spider",
	desc: "Furry and black, it makes you shudder to look at it. This one has deep red eyes.",
	icon_state: "guard",
	icon_living: "guard",
	icon_dead: "guard_dead",
	speak_emote: null,
	emote_hear: null,
	speak_chance: 5,
	turns_per_move: 5,
	see_in_dark: 4,
	butcher_results: null,
	response_help: "pets",
	response_disarm: "gently pushes aside",
	response_harm: "hits",
	maxHealth: 200,
	health: 200,
	obj_damage: 60,
	melee_damage_lower: 15,
	melee_damage_upper: 20,
	faction: null,
	move_to_delay: 6,
	ventcrawler: 2,
	attacktext: "bites",
	attack_sound: rt.rsc("sound/weapons/bite.ogg"),
	unique_name: 1,
	gold_core_spawnable: 1,
	lighting_alpha: 192,
});

// giant_spider.dm:27
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.speak_emote = list("chitters");

	this.emote_hear = list("chitters");

	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/spiderleg"), 8]);

	this.faction = list("spiders");
	return f.dot;
});

// giant_spider.dm:55
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "activate")) return f.dot;
	if (!(rt.istype((ghost = f.usr), T("/mob/dead/observer")) && this.playable_spider)) return f.dot;
	yield* this.humanize_spider(ghost);
	return f.dot;
}, true);

// giant_spider.dm:61
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	if (yield* this.humanize_spider(user)) return f.dot;
	return (yield* parent_proc());
}, true);

// giant_spider.dm:65
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/humanize_spider", function* humanize_spider(f: Frame, user: Value) {
	let spider_ask: Value = null;
	if (this.key || !this.playable_spider) {
		return 0;
	}
	if ((spider_ask = (yield* alert("Become a spider?", "Are you australian?", "Yes", "No"))) == "No" || !this || !this || this.gc_destroyed) {
		return 1;
	}
	if (this.key) {
		to_chat(user, "<span class='notice'>Someone else already took this spider.</span>");
		return 1;
	}
	this.key = user.key;
	return 1;
}, true);

rt.type(4914, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse", "/mob/living/simple_animal/hostile/poison/giant_spider", {
	cocoon_target: null,
	fed: 0,
	poison_per_bite: 3,
	desc: "Furry and black, it makes you shudder to look at it. This one has brilliant green eyes.",
	icon_state: "nurse",
	icon_living: "nurse",
	icon_dead: "nurse_dead",
	gender: "female",
	butcher_results: null,
	maxHealth: 40,
	health: 40,
	melee_damage_lower: 5,
	melee_damage_upper: 10,
}, { global: { consumed_mobs: 719 } });

// giant_spider.dm:83
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.butcher_results = rt.alist(f, [T("/obj/item/weapon/reagent_containers/food/snacks/meat/slab/spider"), 2, T("/obj/item/weapon/reagent_containers/food/snacks/spiderleg"), 8, T("/obj/item/weapon/reagent_containers/food/snacks/spidereggs"), 4]);
	return f.dot;
});

rt.type(4918, "/mob/living/simple_animal/hostile/poison/giant_spider/ice", "/mob/living/simple_animal/hostile/poison/giant_spider", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// giant_spider.dm:108
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

rt.type(4915, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse/ice", "/mob/living/simple_animal/hostile/poison/giant_spider/nurse", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// giant_spider.dm:116
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

rt.type(4917, "/mob/living/simple_animal/hostile/poison/giant_spider/hunter/ice", "/mob/living/simple_animal/hostile/poison/giant_spider/hunter", {
	name: "giant ice spider",
	atmos_requirements: null,
	minbodytemp: 0,
	maxbodytemp: 1500,
	color: "#72e4fa",
	gold_core_spawnable: 0,
});

// giant_spider.dm:124
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/hunter/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	return f.dot;
});

// giant_spider.dm:131
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action", function handle_automated_action(f: Frame) {
	if (!parent_proc()) {
		return 0;
	}
	if (this.AIStatus != AI_IDLE) return f.dot;
	if (!this.busy && prob(1)) {
		this.stop_automated_movement = 1;
		this.Goto(pick(urange(20, this, 1)), this.move_to_delay);
		rt.spawnTail(f, 50, "/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:138");
	}
	return 1;
}, false, { waitfor: false });

// a spawn(50) body of /mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:138", function* (f: Frame) {
	this.stop_automated_movement = 0;
	walk(this, 0);
	return null;
});

// giant_spider.dm:144
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp", function GiveUp(f: Frame, C: Value) {
	rt.spawnTail(f, 100, "/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:144", C);
	return f.dot;
});

// a spawn(100) body of /mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/GiveUp: spawn at modules/mob/living/simple_animal/hostile/giant_spider.dm:144", function* (f: Frame, C: Value) {
	// only the timer of the job the spider is still on ends it (tg: an old timer dropped a newer cocoon job); a lost target ends it too
	if (this.busy == 3 && (this.cocoon_target == C || !this.cocoon_target)) {
		if (this.cocoon_target == C && get_dist(this, this.cocoon_target) > 1) {
			this.cocoon_target = null;
		}
		this.busy = 0;
		this.stop_automated_movement = 0;
	}
	return null;
});

// giant_spider.dm:152
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let can_see: Value = null, C: Value = null, W: Value = null, O: Value = null;
	if (yield* parent_proc()) {
		can_see = view(this, 10);
		if (!this.busy && prob(30)) {
			for (C of each(can_see, T("/mob/living"))) {
				if (C.stat && !rt.istype(C, T("/mob/living/simple_animal/hostile/poison/giant_spider")) && !C.anchored) {
					this.cocoon_target = C;
					this.busy = 3;
					this.Goto(C, this.move_to_delay);
					this.GiveUp(C);
					return f.dot;
				}
			}
			if (!(W = rt.locateIn(f, T("/obj/structure/spider/stickyweb"), rt.getStep(f, this, 0)))) {
				yield* this.Web();
			} else if (this.fed) {
				yield* this.LayEggs();
			} else {
				for (O of each(can_see, T("/obj"))) {
					if (O.anchored) {
						continue;
					}
					if (rt.istype(O, T("/obj/item")) || rt.istype(O, T("/obj/structure")) || rt.istype(O, T("/obj/machinery"))) {
						this.cocoon_target = O;
						this.busy = 3;
						this.stop_automated_movement = 1;
						this.Goto(O, this.move_to_delay);
						this.GiveUp(O);
					}
				}
			}
		} else if (this.busy == 3 && this.cocoon_target) {
			if (get_dist(this, this.cocoon_target) <= 1) {
				yield* this.Wrap();
			}
		}
	} else {
		this.busy = 0;
		this.stop_automated_movement = 0;
	}
	return f.dot;
}, true, { waitfor: false });

// giant_spider.dm:203
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/verb/Web", function* Web(f: Frame) {
	let _T: Value = this.loc;
	if (this.stat == 2) {
		return f.dot;
	}
	if (this.busy == 1) return f.dot;
	this.busy = 1;
	this.visible_message(fmt("<span class='notice'>％！ begins to secrete a sticky substance.</span>", [this]));
	this.stop_automated_movement = 1;
	if (yield* do_after(this, 40, { target: _T })) {
		if (this.busy == 1 && this.loc == _T) {
			yield* new_(T("/obj/structure/spider/stickyweb"), _T);
		}
	}
	this.busy = 0;
	this.stop_automated_movement = 0;
	return f.dot;
}, true, { verb: { name: "Lay Web", category: "Spider", desc: "Spread a sticky web to slow down prey." } });

// giant_spider.dm:221
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/Wrap", function* Wrap(f: Frame) {
	let choices: Value = null, L: Value = null, O: Value = null, temp_input: Value = null, C: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	if (!this.cocoon_target) {
		choices = list();
		for (L of each(view(1, this), T("/mob/living"))) {
			if (L == this || L.anchored) {
				continue;
			}
			if (rt.istype(L, T("/mob/living/simple_animal/hostile/poison/giant_spider"))) {
				continue;
			}
			if (this.Adjacent(L)) {
				choices += L;
			}
		}
		for (O of each(this.loc, T("/obj"))) {
			if (O.anchored) {
				continue;
			}
			if (this.Adjacent(O)) {
				choices += O;
			}
		}
		if ((temp_input = (yield* g.op(f, "Prompt", [0], [null, null, "What do you wish to cocoon?", this, rt.bitOr(null, choices)]))) && !this.cocoon_target) {
			this.cocoon_target = temp_input;
		}
	}
	if (this.stat != 2 && this.cocoon_target && this.Adjacent(this.cocoon_target) && !this.cocoon_target.anchored) {
		if (this.busy == 4) {
			return f.dot;
		}
		this.busy = 4;
		this.visible_message(fmt("<span class='notice'>％！ begins to secrete a sticky substance around ％！.</span>", [this, this.cocoon_target]));
		this.stop_automated_movement = 1;
		walk(this, 0);
		if (yield* do_after(this, 50, { target: this.cocoon_target })) {
			if (this.busy == 4) {
				C = (yield* new_(T("/obj/structure/spider/cocoon"), this.cocoon_target.loc));
				if (rt.istype(this.cocoon_target, T("/mob/living"))) {
					if ((L = this.cocoon_target).blood_volume && (L.stat != 2 || !rt.index(GLOB.consumed_mobs, L.tag))) {
						rt.setAt(GLOB.consumed_mobs, L.tag, 1);
						this.fed++;
						this.visible_message(fmt("<span class='danger'>％！ sticks a proboscis into ％！ and sucks a viscous substance out.</span>", [this, L]));
						yield* L.death();
					} else {
						to_chat(this, `<span class='warning'>${L} cannot sate your hunger!</span>`);
					}
				}
				yield* this.cocoon_target.forceMove(C);
				if (this.cocoon_target.density || ismob(this.cocoon_target)) {
					C.icon_state = pick("cocoon_large1", "cocoon_large2", "cocoon_large3");
				}
			}
		}
	}
	this.cocoon_target = null;
	this.busy = 0;
	this.stop_automated_movement = 0;
	return f.dot;
}, true, { verb: { name: "Wrap", category: "Spider", desc: "Wrap up prey to feast upon and objects for safe keeping." } });

// giant_spider.dm:273
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/nurse/verb/LayEggs", function* LayEggs(f: Frame) {
	let C: Value = null;
	let E: Value = rt.locateIn(f, T("/obj/structure/spider/eggcluster"), rt.getStep(f, this, 0));
	if (this.stat == 2) {
		return f.dot;
	}
	if (E) {
		to_chat(this, "<span class='warning'>There is already a cluster of eggs here!</span>");
	} else if (!this.fed) {
		to_chat(this, "<span class='warning'>You are too hungry to do this!</span>");
	} else {
		if (this.busy == 2) return f.dot;
		this.busy = 2;
		this.visible_message(fmt("<span class='notice'>％！ begins to lay a cluster of eggs.</span>", [this]));
		this.stop_automated_movement = 1;
		if (yield* do_after(this, 50, { target: this.loc })) {
			if (this.busy == 2) {
				if (!(E = rt.locateIn(f, T("/obj/structure/spider/eggcluster"), rt.getStep(f, this, 0)))) {
					C = (yield* new_(T("/obj/structure/spider/eggcluster"), this.loc));
					if (this.ckey) {
						C.player_spiders = 1;
					}
					C.poison_type = this.poison_type;
					C.poison_per_bite = this.poison_per_bite;
					C.faction = (yield* this.faction.Copy());
					this.fed--;
				}
			}
		}
		this.busy = 0;
		this.stop_automated_movement = 0;
	}
	return f.dot;
}, true, { verb: { name: "Lay Eggs", category: "Spider", desc: "Lay a clutch of eggs, but you must wrap a creature for feeding first." } });

// giant_spider.dm:299
rt.def("/mob/living/simple_animal/hostile/poison/giant_spider/proc/handle_temperature_damage", function* handle_temperature_damage(f: Frame) {
	if (this.bodytemperature < this.minbodytemp) {
		yield* this.adjustBruteLoss(20);
	} else {
		if (!(this.bodytemperature > this.maxbodytemp)) return f.dot;
		yield* this.adjustBruteLoss(20);
	}
	return f.dot;
}, true);
