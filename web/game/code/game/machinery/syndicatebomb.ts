// Based on /tg/station's code/game/machinery/syndicatebomb.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10849, "/obj/machinery/syndicatebomb", "/obj/machinery", {
	minimum_timer: 90,
	timer_set: 90,
	maximum_timer: 60000,
	can_unanchor: 1,
	open_panel: 0,
	active: 0,
	defused: 0,
	payload: rt.typePath("/obj/item/weapon/bombcore"),
	beepsound: rt.rsc("sound/items/timer.ogg"),
	delayedbig: 0,
	delayedlittle: 0,
	countdown: null,
	next_beep: null,
	detonation_timer: null,
	explode_now: 0,
	anchored: 0,
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	name: "syndicate bomb",
	icon_state: "syndicate-bomb",
	desc: "A large and menacing device. Can be bolted down with a wrench.",
	density: 0,
	layer: 3.7,
	resistance_flags: 34,
});

// syndicatebomb.dm:35
rt.def("/obj/machinery/syndicatebomb/proc/try_detonate", function* try_detonate(f: Frame, ignore_active: Value) {
	ignore_active ??= 0;
	f.dot = (((rt.isIn(f, this.payload, this) ? 1 : 0) && (this.active || ignore_active)) && (!this.defused ? 1 : 0));
	if (!f.dot) return f.dot;
	yield* this.payload.detonate();
	return f.dot;
}, true);

// syndicatebomb.dm:40
rt.def("/obj/machinery/syndicatebomb/proc/obj_break", function* obj_break(f: Frame) {
	if (yield* this.try_detonate()) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// syndicatebomb.dm:44
rt.def("/obj/machinery/syndicatebomb/proc/obj_destruction", function* obj_destruction(f: Frame) {
	if (yield* this.try_detonate()) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// syndicatebomb.dm:48
rt.def("/obj/machinery/syndicatebomb/proc/process", function* process(f: Frame) {
	let volume: Value = null;
	if (!this.active) {
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
		this.detonation_timer = null;
		this.next_beep = null;
		yield* this.countdown.stop();
		return f.dot;
	}
	if (this.next_beep !== null && this.next_beep <= rt.worldTime(f)) {
		const seconds_remaining = this.seconds_remaining();
		if (rt.inRange(seconds_remaining, 0, 5)) {
			volume = 50;
		} else if (rt.inRange(seconds_remaining, 5, 10)) {
			volume = 40;
		} else if (rt.inRange(seconds_remaining, 10, 15)) {
			volume = 30;
		} else if (rt.inRange(seconds_remaining, 15, 20)) {
			volume = 20;
		} else if (rt.inRange(seconds_remaining, 20, 25)) {
			volume = 10;
		} else {
			volume = 5;
		}
		playsound(this.loc, this.beepsound, volume, 0);
		this.next_beep = rt.worldTime(f) + 10;
	}
	if (this.active && !this.defused && (this.detonation_timer <= rt.worldTime(f) || this.explode_now)) {
		this.active = 0;
		this.timer_set = rt.initial(f, this, "timer_set");
		yield* this.update_icon();
		yield* this.try_detonate(1);
	} else {
		if (!(!this.active || this.defused)) return f.dot;
		if (!rt.isIn(f, (this.defused && this.payload), this)) return f.dot;
		yield* this.payload.defuse();
		yield* this.countdown.stop();
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
	}
	return f.dot;
}, true, { waitfor: false });

// syndicatebomb.dm:86
rt.def("/obj/machinery/syndicatebomb/proc/New", function* New(f: Frame) {
	this.wires = (yield* new_(T("/datum/wires/syndicatebomb"), this));
	if (this.payload) {
		this.payload = (yield* new_(this.payload, this));
	}
	yield* this.update_icon();
	this.countdown = (yield* new_(T("/obj/effect/countdown/syndicatebomb"), this));
	yield* parent_proc();
	return f.dot;
}, true);

// syndicatebomb.dm:94
rt.def("/obj/machinery/syndicatebomb/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	if (this.countdown) {
		yield* qdel(this.countdown);
		this.countdown = null;
	}
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// syndicatebomb.dm:103
rt.def("/obj/machinery/syndicatebomb/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `A digital display on it reads "${this.seconds_remaining()}".`);
	return f.dot;
}, false);

// syndicatebomb.dm:107
rt.def("/obj/machinery/syndicatebomb/proc/update_icon", function update_icon(f: Frame) {
	let $0: any = rt.initial(f, this, "icon_state");
	this.icon_state = `${$0}${this.active ? "-active" : "-inactive"}${this.open_panel ? "-wires" : ""}`;
	return f.dot;
});

// syndicatebomb.dm:111
rt.def("/obj/machinery/syndicatebomb/proc/seconds_remaining", function seconds_remaining(f: Frame) {
	if (this.active) {
		f.dot = max(0, round((this.detonation_timer - rt.worldTime(f)) / 10));
	} else {
		f.dot = this.timer_set;
	}
	return f.dot;
});

// syndicatebomb.dm:116
rt.def("/obj/machinery/syndicatebomb/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, old_integ: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench")) && this.can_unanchor) {
		if (!this.anchored) {
			if (!isturf(this.loc) || rt.istype(this.loc, T("/turf/open/space"))) {
				to_chat(user, "<span class='notice'>The bomb must be placed on solid ground to attach it.</span>");
			} else {
				to_chat(user, "<span class='notice'>You firmly wrench the bomb to the floor.</span>");
				playsound(this.loc, I.usesound, 50, 1);
				this.anchored = 1;
				if (this.active) {
					to_chat(user, "<span class='notice'>The bolts lock in place.</span>");
				}
			}
		} else if (!this.active) {
			to_chat(user, "<span class='notice'>You wrench the bomb from the floor.</span>");
			playsound(this.loc, I.usesound, 50, 1);
			this.anchored = 0;
		} else {
			to_chat(user, "<span class='warning'>The bolts are locked down!</span>");
		}
	} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		this.open_panel = (!this.open_panel ? 1 : 0);
		yield* this.update_icon();
		to_chat(user, `<span class='notice'>You ${this.open_panel ? "open" : "close"} the wire panel.</span>`);
	} else if (is_wire_tool(I) && this.open_panel) {
		yield* this.wires.interact(user);
	} else if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		if (this.open_panel && this.wires.is_all_cut()) {
			if (this.payload) {
				to_chat(user, `<span class='notice'>You carefully pry out ${this.payload}.</span>`);
				this.payload.loc = user.loc;
				this.payload = null;
			} else {
				to_chat(user, "<span class='warning'>There isn't anything in here to remove!</span>");
			}
		} else if (this.open_panel) {
			to_chat(user, "<span class='warning'>The wires connecting the shell to the explosives are holding it down!</span>");
		} else {
			to_chat(user, "<span class='warning'>The cover is screwed on, it won't pry off!</span>");
		}
	} else if (rt.istype(I, T("/obj/item/weapon/bombcore"))) {
		if (!this.payload) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.payload = I;
			to_chat(user, `<span class='notice'>You place ${this.payload} into ${this}.</span>`);
			this.payload.loc = this;
		} else {
			to_chat(user, `<span class='warning'>${this.payload} is already loaded into ${this}! You'll have to remove it first.</span>`);
		}
	} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (this.payload || !this.wires.is_all_cut() || !this.open_panel) {
			return f.dot;
		}
		if (!(WT = I).isOn()) {
			return f.dot;
		}
		if (WT.get_fuel() < 5) {
			to_chat(user, "<span class='warning'>You need more fuel to complete this task!</span>");
			return f.dot;
		}
		playsound(this.loc, WT.usesound, 50, 1);
		to_chat(user, `<span class='notice'>You start to cut the ${this} apart...</span>`);
		if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
			if (!WT.isOn() || !(yield* WT.remove_fuel(5, user))) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You cut the ${this} apart.</span>`);
			yield* new_(T("/obj/item/stack/sheet/plasteel"), this.loc, 5);
			yield* qdel(this);
		}
	} else {
		old_integ = this.obj_integrity;
		f.dot = (yield* parent_proc());
		if (!(old_integ > this.obj_integrity && this.active && !this.defused && rt.isIn(f, this.payload, this))) return f.dot;
		to_chat(user, "<span class='warning'>That seems like a really bad idea...</span>");
	}
	return f.dot;
}, true);

// syndicatebomb.dm:188
rt.def("/obj/machinery/syndicatebomb/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	yield* this.interact(user);
	return f.dot;
}, true);

// syndicatebomb.dm:194
rt.def("/obj/machinery/syndicatebomb/proc/interact", function* interact(f: Frame, user: Value) {
	yield* this.wires.interact(user);
	if (this.open_panel) return f.dot;
	if (!this.active) {
		yield* this.settings(user);
	} else {
		if (!this.anchored) return f.dot;
		to_chat(user, "<span class='warning'>The bomb is bolted to the floor!</span>");
	}
	return f.dot;
}, true);

// syndicatebomb.dm:203
rt.def("/obj/machinery/syndicatebomb/proc/activate", function activate(f: Frame) {
	this.active = 1;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	this.countdown.start();
	this.next_beep = rt.worldTime(f) + 10;
	this.detonation_timer = rt.worldTime(f) + this.timer_set * 10;
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 30, 1);
	return f.dot;
});

// syndicatebomb.dm:210
rt.def("/obj/machinery/syndicatebomb/proc/settings", function* settings(f: Frame, user: Value) {
	let bombturf: Value = null, A: Value = null;
	let new_timer: Value = (yield* g.op(f, "Prompt", [32], [`${this.timer_set}`, "Timer", "Please set the timer.", user, null]));
	if (get_dist(this, user) <= 1 && rt.istype(user, T("/mob/living"))) {
		this.timer_set = max(this.minimum_timer, min(new_timer, this.maximum_timer));
		this.loc.visible_message(`<span class='notice'>${bicon(this)} timer set for ${this.timer_set} seconds.</span>`);
	}
	if (!((yield* alert(user, "Would you like to start the countdown now?", null, "Yes", "No")) == "Yes" && get_dist(this, user) <= 1 && rt.istype(user, T("/mob/living")))) return f.dot;
	if (this.defused || this.active) {
		if (this.defused) {
			this.loc.visible_message(`<span class='warning'>${bicon(this)} Device error: User intervention required.</span>`);
		}
		return f.dot;
	} else {
		this.loc.visible_message(`<span class='danger'>${bicon(this)} ${this.timer_set} seconds until detonation, please clear the area.</span>`);
		yield* this.activate();
		yield* this.update_icon();
		yield* this.add_fingerprint(user);
		bombturf = rt.getStep(f, this, 0);
		A = get_area(bombturf);
		if (!(this.payload && !rt.istype(this.payload, T("/obj/item/weapon/bombcore/training")))) return f.dot;
		message_admins(`${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has primed a ${this.name} (${this.payload}) for detonation at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}</a>.`);
		log_game(`${key_name(user)} has primed a ${this.name} (${this.payload}) for detonation at ${A.name}${`(${bombturf.x},${bombturf.y},${bombturf.z})`}`);
		this.payload.adminlog = `The ${this.name} that ${key_name(user)} had primed detonated!`;
	}
	return f.dot;
}, true);

rt.type(10853, "/obj/machinery/syndicatebomb/empty", "/obj/machinery/syndicatebomb", {
	payload: null,
	open_panel: 1,
	timer_set: 120,
	name: "bomb",
	icon_state: "base-bomb",
	desc: "An ominous looking device designed to detonate an explosive payload. Can be bolted down using a wrench.",
});

// syndicatebomb.dm:261
rt.def("/obj/machinery/syndicatebomb/empty/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.wires.cut_all();
	return f.dot;
}, true);

rt.type(6941, "/obj/item/weapon/bombcore", "/obj/item/weapon", {
	adminlog: null,
	range_heavy: 3,
	range_medium: 9,
	range_light: 17,
	range_flame: 17,
	name: "bomb payload",
	desc: "A powerful secondary explosive of syndicate design and unknown composition, it should be stable under normal conditions...",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bombcore",
	item_state: "eshield0",
	w_class: 3,
	origin_tech: "syndicate=5;combat=6",
	resistance_flags: 4,
});

// Empty in tg.
rt.def("/obj/item/weapon/bombcore/proc/defuse");

// syndicatebomb.dm:288
rt.def("/obj/item/weapon/bombcore/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	yield* this.detonate();
	return f.dot;
}, true, { waitfor: false });

// syndicatebomb.dm:292
rt.def("/obj/item/weapon/bombcore/proc/burn", function* burn(f: Frame) {
	yield* this.detonate();
	yield* parent_proc();
	return f.dot;
}, true);

// syndicatebomb.dm:297
rt.def("/obj/item/weapon/bombcore/proc/detonate", function* detonate(f: Frame) {
	if (this.adminlog) {
		message_admins(this.adminlog);
		log_game(this.adminlog);
	}
	yield* explosion(rt.getStep(f, this, 0), this.range_heavy, this.range_medium, this.range_light, { flame_range: this.range_flame });
	if (this.loc && rt.istype(this.loc, T("/obj/machinery/syndicatebomb"))) {
		yield* qdel(this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6942, "/obj/item/weapon/bombcore/training", "/obj/item/weapon/bombcore", {
	defusals: 0,
	attempts: 0,
	name: "dummy payload",
	desc: "A nanotrasen replica of a syndicate payload. Its not intended to explode but to announce that it WOULD have exploded, then rewire itself to allow for more training.",
	origin_tech: null,
});

// syndicatebomb.dm:318
rt.def("/obj/item/weapon/bombcore/training/proc/reset", function* reset(f: Frame) {
	let holder: Value = null;
	if (!rt.istype((holder = this.loc), T("/obj/machinery/syndicatebomb"))) return f.dot;
	if (holder.wires) {
		yield* holder.wires.repair();
		holder.wires.shuffle_wires();
	}
	holder.defused = 0;
	holder.open_panel = 0;
	holder.delayedbig = 0;
	holder.delayedlittle = 0;
	yield* holder.update_icon();
	yield* holder.updateDialog();
	return f.dot;
}, true);

// syndicatebomb.dm:331
rt.def("/obj/item/weapon/bombcore/training/proc/detonate", function* detonate(f: Frame) {
	let holder: Value = null;
	if (rt.istype((holder = this.loc), T("/obj/machinery/syndicatebomb"))) {
		this.attempts++;
		holder.loc.visible_message(`<span class='danger'>${bicon(holder)} Alert: Bomb has detonated. Your score is now ${this.defusals} for ${this.attempts}. Resetting wires...</span>`);
		yield* this.reset();
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

// syndicatebomb.dm:340
rt.def("/obj/item/weapon/bombcore/training/proc/defuse", function* defuse(f: Frame) {
	let holder: Value = null;
	if (!rt.istype((holder = this.loc), T("/obj/machinery/syndicatebomb"))) return f.dot;
	this.attempts++;
	this.defusals++;
	holder.loc.visible_message(`<span class='notice'>${bicon(holder)} Alert: Bomb has been defused. Your score is now ${this.defusals} for ${this.attempts}! Resetting wires in 5 seconds...</span>`);
	yield* sleep(50);
	if (!rt.istype(holder, T("/obj/machinery/syndicatebomb"))) return f.dot;
	yield* this.reset();
	return f.dot;
}, true);

rt.type(6943, "/obj/item/weapon/bombcore/badmin", "/obj/item/weapon/bombcore", {
	name: "badmin payload",
	desc: "If you're seeing this someone has either made a mistake or gotten dangerously savvy with var editing!",
	origin_tech: null,
});

// syndicatebomb.dm:355
rt.def("/obj/item/weapon/bombcore/badmin/proc/defuse", function* defuse(f: Frame) {
	let B: Value = null;
	yield* qdel((B = this.loc));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6944, "/obj/item/weapon/bombcore/badmin/summon", "/obj/item/weapon/bombcore/badmin", {
	summon_path: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/cookie"),
	amt_summon: 1,
});

// syndicatebomb.dm:365
rt.def("/obj/item/weapon/bombcore/badmin/summon/proc/detonate", function* detonate(f: Frame) {
	let B: Value = this.loc;
	yield* spawn_and_random_walk(this.summon_path, this, this.amt_summon, { walk_chance: 50, admin_spawn: 1 });
	yield* qdel(B);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6945, "/obj/item/weapon/bombcore/badmin/summon/clown", "/obj/item/weapon/bombcore/badmin/summon", {
	summon_path: rt.typePath("/mob/living/simple_animal/hostile/retaliate/clown"),
	amt_summon: 100,
});

// syndicatebomb.dm:374
rt.def("/obj/item/weapon/bombcore/badmin/summon/clown/proc/defuse", function* defuse(f: Frame) {
	playsound(this.loc, rt.rsc("sound/misc/sadtrombone.ogg"), 50);
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(6949, "/obj/item/weapon/bombcore/chemical", "/obj/item/weapon/bombcore", {
	beakers: null,
	max_beakers: 1,
	spread_range: 5,
	temp_boost: 50,
	time_release: 0,
	name: "chemical payload",
	desc: "An explosive payload designed to spread chemicals, dangerous or otherwise, across a large area. It is able to hold up to four chemical containers, and must be loaded before use.",
	origin_tech: "combat=4;materials=3",
	icon_state: "chemcore",
});

// syndicatebomb.dm:400
rt.def("/obj/item/weapon/bombcore/chemical/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.beakers = list();
	return f.dot;
});

// syndicatebomb.dm:408
rt.def("/obj/item/weapon/bombcore/chemical/proc/detonate", function* detonate(f: Frame) {
	let total_volume: Value = null, RC: Value = null, fraction: Value = null, reactants: Value = null, RC_3: Value = null, G: Value = null, S: Value = null, G_2: Value = null;
	if (this.time_release > 0) {
		total_volume = 0;
		for (RC of each(this.beakers, T("/obj/item/weapon/reagent_containers"))) {
			total_volume += RC.reagents.total_volume;
		}
		if (total_volume < this.time_release) {
			if (this.loc && rt.istype(this.loc, T("/obj/machinery/syndicatebomb"))) {
				yield* qdel(this.loc);
			}
			yield* qdel(this);
			return f.dot;
		}
		fraction = this.time_release / total_volume;
		(reactants = (yield* new_(T("/datum/reagents"), this.time_release))).my_atom = this;
		for (RC_3 of each(this.beakers, T("/obj/item/weapon/reagent_containers"))) {
			yield* RC_3.reagents.trans_to(reactants, RC_3.reagents.total_volume * fraction, 1, 1, 1);
		}
		yield* chem_splash(rt.getStep(f, this, 0), this.spread_range, list(reactants), this.temp_boost);
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/bombcore/chemical/proc/detonate"))), 10);
	}
	let reactants_0: Value = list();
	for (G of each(this.beakers, T("/obj/item/weapon/reagent_containers/glass"))) {
		reactants_0 += G.reagents;
	}
	for (S of each(this.beakers, T("/obj/item/slime_extract"))) {
		if (S.Uses) {
			G_2 = null;
			for (G_2 of each(this.beakers, T("/obj/item/weapon/reagent_containers/glass"))) {
				yield* G_2.reagents.trans_to(S, G_2.reagents.total_volume);
			}
			if (S && S.reagents && S.reagents.total_volume) {
				reactants_0 += S.reagents;
			}
		}
	}
	if (!(yield* chem_splash(rt.getStep(f, this, 0), this.spread_range, reactants_0, this.temp_boost))) {
		playsound(this.loc, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
		return f.dot;
	}
	if (this.adminlog) {
		message_admins(this.adminlog);
		log_game(this.adminlog);
	}
	playsound(this.loc, rt.rsc("sound/effects/bamf.ogg"), 75, 1, 5);
	if (this.loc && rt.istype(this.loc, T("/obj/machinery/syndicatebomb"))) {
		yield* qdel(this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// syndicatebomb.dm:459
rt.def("/obj/item/weapon/bombcore/chemical/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let B: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/crowbar")) && rt.len(f, this.beakers) > 0) {
		playsound(this.loc, I.usesound, 50, 1);
		for (B of each(this.beakers, T("/obj/item"))) {
			B.loc = rt.getStep(f, this, 0);
			this.beakers -= B;
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/reagent_containers/glass/beaker")) || rt.istype(I, T("/obj/item/weapon/reagent_containers/glass/bottle"))) {
		if (rt.len(f, this.beakers) < this.max_beakers) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.beakers += I;
			to_chat(user, `<span class='notice'>You load ${this} with ${I}.</span>`);
			I.loc = this;
		} else {
			to_chat(user, `<span class='warning'>The ${I} wont fit! The ${this} can only hold up to ${this.max_beakers} containers.</span>`);
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// syndicatebomb.dm:478
rt.def("/obj/item/weapon/bombcore/chemical/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	let MB: Value = null, G: Value = null, LG: Value = null, S: Value = null, B: Value = null;
	yield* parent_proc();
	if (MB = rt.locateIn(f, T("/obj/item/weapon/stock_parts/matter_bin"), this)) {
		this.max_beakers += MB.rating;
		yield* qdel(MB);
	}
	for (G of each(this, T("/obj/item/weapon/grenade/chem_grenade"))) {
		if (rt.istype(G, T("/obj/item/weapon/grenade/chem_grenade/large"))) {
			LG = G;
			this.max_beakers += 1;
			this.spread_range += 2;
			this.temp_boost += 50;
			S = null;
			for (S of each(LG.beakers, T("/obj/item/slime_extract"))) {
				if (rt.len(f, this.beakers) < this.max_beakers) {
					this.beakers += S;
					S.loc = this;
				} else {
					S.loc = rt.getStep(f, this, 0);
				}
			}
		}
		if (rt.istype(G, T("/obj/item/weapon/grenade/chem_grenade/cryo"))) {
			this.spread_range -= 1;
			this.temp_boost -= 100;
		}
		if (rt.istype(G, T("/obj/item/weapon/grenade/chem_grenade/pyro"))) {
			this.temp_boost += 150;
		}
		if (rt.istype(G, T("/obj/item/weapon/grenade/chem_grenade/adv_release"))) {
			this.time_release += 50;
		}
		B = null;
		for (B of each(G, T("/obj/item/weapon/reagent_containers/glass"))) {
			if (rt.len(f, this.beakers) < this.max_beakers) {
				this.beakers += B;
				B.loc = this;
			} else {
				B.loc = rt.getStep(f, this, 0);
			}
		}
		yield* qdel(G);
	}
	return f.dot;
}, true);

rt.type(9225, "/obj/item/device/syndicatedetonator", "/obj/item/device", {
	timer: 0,
	detonated: 0,
	existant: 0,
	name: "big red button",
	desc: "Your standard issue bomb synchronizing button. Five second safety delay to prevent 'accidents'",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bigred",
	item_state: "electronic",
	w_class: 1,
	origin_tech: "syndicate=3",
});

// syndicatebomb.dm:535
rt.def("/obj/item/device/syndicatedetonator/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let B: Value = null, _T: Value = null, A: Value = null, log_str: Value = null;
	let $0: any, $1: any, $e: any;
	if (!(this.timer < rt.worldTime(f))) return f.dot;
	for (B of each(GLOB.machines, T("/obj/machinery/syndicatebomb"))) {
		if (B.active) {
			B.detonation_timer = rt.worldTime(f) + BUTTON_DELAY;
			this.detonated++;
		}
		this.existant++;
	}
	playsound(user, rt.rsc("sound/machines/click.ogg"), 20, 1);
	to_chat(user, `<span class='notice'>${this.existant} found, ${this.detonated} triggered.</span>`);
	if (this.detonated) {
		_T = rt.getStep(f, this, 0);
		A = get_area(_T);
		this.detonated--;
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (this.detonated) {
			$1 = "syndicate bombs";
		} else {
			$1 = "a syndicate bomb";
		}
		GLOB.bombers += (log_str = `${$0} has remotely detonated ${$1} using a ${this.name} at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}</a>.`);
		message_admins(log_str);
		$0 = key_name(user);
		if (this.detonated) {
			$1 = "syndicate bombs";
		} else {
			$1 = "a syndicate bomb";
		}
		log_game(`${$0} has remotely detonated ${$1} using a ${this.name} at ${A.name}${`(${_T.x},${_T.y},${_T.z})`}`);
	}
	this.detonated = 0;
	this.existant = 0;
	this.timer = rt.worldTime(f) + 60;
	return f.dot;
});
