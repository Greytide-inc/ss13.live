// Based on /tg/station's code/game/objects/items/weapons/grenades/chem_grenade.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(6881, "/obj/item/weapon/grenade/chem_grenade", "/obj/item/weapon/grenade", {
	stage: 1,
	beakers: null,
	allowed_containers: null,
	affected_area: 3,
	nadeassembly: null,
	assemblyattacher: null,
	ignition_temp: 10,
	threatscale: 1,
	no_splash: 0,
	name: "chemical grenade",
	desc: "A custom made grenade.",
	icon_state: "chemg",
	item_state: "flashbang",
	w_class: 2,
	force: 2,
});

// chem_grenade.dm:13
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.beakers = list();

	this.allowed_containers = list(T("/obj/item/weapon/reagent_containers/glass/beaker"), T("/obj/item/weapon/reagent_containers/glass/bottle"));
	return f.dot;
});

// chem_grenade.dm:23
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.create_reagents(1000);
	this.stage_change();
	return f.dot;
}, true);

// chem_grenade.dm:28
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/examine", function examine(f: Frame, user: Value) {
	this.display_timer = ((this.stage == 3 ? 1 : 0) && (!this.nadeassembly ? 1 : 0));
	parent_proc();
	return f.dot;
}, false);

// chem_grenade.dm:33
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let bombturf: Value = null, A: Value = null, C: Value = null;
	if (!(this.stage == 3 && !this.active)) return f.dot;
	if (this.nadeassembly) {
		yield* this.nadeassembly.attack_self(user);
	} else {
		if (!(yield* this.clown_check(user))) return f.dot;
		bombturf = rt.getStep(f, this, 0);
		A = get_area(bombturf);
		message_admins(`${`${key_name_admin(f.usr)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [f.usr])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [f.usr])}`} has primed a ${this.name} for detonation at ${A.name}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}.`);
		log_game(`${key_name(f.usr)} has primed a ${this.name} for detonation at ${A.name} ${`(${bombturf.x},${bombturf.y},${bombturf.z})`}.`);
		to_chat(user, fmt("<span class='warning'>You prime the ＀! ＀ second５!</span>", [this.name, this.det_time / 10]));
		playsound(user.loc, rt.rsc("sound/weapons/armbomb.ogg"), 60, 1);
		this.active = 1;
		this.icon_state = rt.initial(f, this, "icon_state") + "_active";
		if (rt.istype(user, T("/mob/living/carbon"))) {
			(C = user).throw_mode_on();
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/chem_grenade/proc/prime"))), this.det_time);
	}
	return f.dot;
}, true);

// chem_grenade.dm:53
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let A: Value = null, C: Value = null, O: Value = null;
	let $e: any;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		if (this.stage == 2) {
			if (rt.len(f, this.beakers)) {
				this.stage_change(3);
				to_chat(user, `<span class='notice'>You lock the ${rt.initial(f, this, "name")} assembly.</span>`);
				playsound(this.loc, I.usesound, 25, -3);
			} else {
				to_chat(user, `<span class='warning'>You need to add at least one beaker before locking the ${rt.initial(f, this, "name")} assembly!</span>`);
			}
		} else if (this.stage == 3 && !this.nadeassembly) {
			this.det_time = this.det_time == 50 ? 30 : 50;
			to_chat(user, fmt("<span class='notice'>You modify the time delay. It's set for ＀ second５.</span>", [this.det_time / 10]));
		} else if (this.stage == 1) {
			to_chat(user, "<span class='warning'>You need to add an activation mechanism!</span>");
		}
	} else if (this.stage == 2 && is_type_in_list(I, this.allowed_containers)) {
		f.dot = 1;
		if (rt.len(f, this.beakers) == 2) {
			to_chat(user, `<span class='warning'>${this} can not hold more containers!</span>`);
			return f.dot;
		} else if (I.reagents.total_volume) {
			if (!(yield* user.transferItemToLoc(I, this))) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You add ${I} to the ${rt.initial(f, this, "name")} assembly.</span>`);
			this.beakers += I;
		} else {
			to_chat(user, `<span class='warning'>${I} is empty!</span>`);
		}
	} else if (this.stage == 1 && rt.istype(I, T("/obj/item/device/assembly_holder"))) {
		f.dot = 1;
		if ((rt.istype((A = I).a_left, T("/obj/item/device/assembly/igniter")) ? 1 : 0) == (rt.istype(A.a_right, T("/obj/item/device/assembly/igniter")) ? 1 : 0)) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(I, this))) {
			return f.dot;
		}
		this.nadeassembly = A;
		A.master = this;
		this.assemblyattacher = user.ckey;
		this.stage_change(2);
		to_chat(user, `<span class='notice'>You add ${A} to the ${rt.initial(f, this, "name")} assembly.</span>`);
	} else if (this.stage == 1 && rt.istype(I, T("/obj/item/stack/cable_coil"))) {
		if (yield* (C = I).use(1)) {
			this.det_time = 50;
			this.stage_change(2);
			to_chat(user, `<span class='notice'>You rig the ${rt.initial(f, this, "name")} assembly.</span>`);
		} else {
			to_chat(user, "<span class='warning'>You need one length of coil to wire the assembly!</span>");
			return f.dot;
		}
	} else if (this.stage == 3 && rt.istype(I, T("/obj/item/weapon/wirecutters")) && !this.active) {
		this.stage_change(2);
		to_chat(user, `<span class='notice'>You unlock the ${rt.initial(f, this, "name")} assembly.</span>`);
	} else if (this.stage == 2 && rt.istype(I, T("/obj/item/weapon/wrench"))) {
		if (rt.len(f, this.beakers)) {
			for (O of each(this.beakers, T("/obj"))) {
				O.loc = rt.getStep(f, this, 0);
			}
			this.beakers = list();
			to_chat(user, `<span class='notice'>You open the ${rt.initial(f, this, "name")} assembly and remove the payload.</span>`);
			return f.dot;
		}
		if (this.nadeassembly) {
			this.nadeassembly.loc = rt.getStep(f, this, 0);
			this.nadeassembly.master = null;
			this.nadeassembly = null;
		} else {
			yield* new_(T("/obj/item/stack/cable_coil"), rt.getStep(f, this, 0), 1);
		}
		this.stage_change(1);
		to_chat(user, `<span class='notice'>You remove the activation mechanism from the ${rt.initial(f, this, "name")} assembly.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// chem_grenade.dm:130
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/stage_change", function stage_change(f: Frame, N: Value) {
	if (N) {
		this.stage = N;
	}
	if (this.stage == 1) {
		this.name = `${rt.initial(f, this, "name")} casing`;
		this.desc = `A do it yourself ${rt.initial(f, this, "name")}!`;
		this.icon_state = rt.initial(f, this, "icon_state");
	} else if (this.stage == 2) {
		this.name = `unsecured ${rt.initial(f, this, "name")}`;
		this.desc = `An unsecured ${rt.initial(f, this, "name")} assembly.`;
		this.icon_state = `${rt.initial(f, this, "icon_state")}_ass`;
	} else {
		if (this.stage != 3) return f.dot;
		this.name = rt.initial(f, this, "name");
		this.desc = rt.initial(f, this, "desc");
		this.icon_state = `${rt.initial(f, this, "icon_state")}_locked`;
	}
	return f.dot;
});

// chem_grenade.dm:147
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/receive_signal", function* receive_signal(f: Frame) {
	yield* this.prime();
	return f.dot;
}, true);

// chem_grenade.dm:152
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	if (!this.nadeassembly) return f.dot;
	yield* this.nadeassembly.Crossed(AM);
	return f.dot;
}, true);

// chem_grenade.dm:156
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/on_found", function* on_found(f: Frame, finder: Value) {
	if (!this.nadeassembly) return f.dot;
	yield* this.nadeassembly.on_found(finder);
	return f.dot;
}, true);

// chem_grenade.dm:159
rt.def("/obj/item/weapon/grenade/chem_grenade/proc/prime", function* prime(f: Frame) {
	let G: Value = null, O: Value = null, M: Value = null, last: Value = null, _T: Value = null, A: Value = null, DA: Value = null;
	if (this.stage != 3) {
		return f.dot;
	}
	let reactants: Value = list();
	for (G of each(this.beakers, T("/obj/item/weapon/reagent_containers/glass"))) {
		reactants += G.reagents;
	}
	if (!(yield* chem_splash(rt.getStep(f, this, 0), this.affected_area, reactants, this.ignition_temp, this.threatscale)) && !this.no_splash) {
		playsound(this.loc, rt.rsc("sound/items/screwdriver2.ogg"), 50, 1);
		if (rt.len(f, this.beakers)) {
			for (O of each(this.beakers, T("/obj"))) {
				O.loc = rt.getStep(f, this, 0);
			}
			this.beakers = list();
		}
		this.stage_change(1);
		return f.dot;
	}
	if (this.nadeassembly) {
		M = (yield* get_mob_by_ckey(this.assemblyattacher));
		last = (yield* get_mob_by_ckey(this.nadeassembly.fingerprintslast));
		_T = rt.getStep(f, this, 0);
		A = get_area(_T);
		message_admins(`grenade primed by an assembly, attached by ${`${key_name_admin(M)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [M])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [M])}`} and last touched by ${`${key_name_admin(last)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [last])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [last])}`} (${this.nadeassembly.a_left.name} and ${this.nadeassembly.a_right.name}) at ${A.name} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}</a>.`);
		log_game(`grenade primed by an assembly, attached by ${key_name(M)} and last touched by ${key_name(last)} (${this.nadeassembly.a_left.name} and ${this.nadeassembly.a_right.name}) at ${A.name} ${`(${_T.x},${_T.y},${_T.z})`}`);
	}
	let DT: Value = rt.getStep(f, this, 0);
	log_game(`A grenade detonated at ${(DA = get_area(DT)).name} ${`(${DT.x},${DT.y},${DT.z})`}`);
	yield* this.update_mob();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(6882, "/obj/item/weapon/grenade/chem_grenade/large", "/obj/item/weapon/grenade/chem_grenade", {
	allowed_containers: null,
	affected_area: 5,
	ignition_temp: 25,
	threatscale: 1.1,
	name: "large grenade",
	desc: "A custom made large grenade. It affects a larger area.",
	icon_state: "large_grenade",
	origin_tech: "combat=3;engineering=3",
});

// chem_grenade.dm:196
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.allowed_containers = list(T("/obj/item/weapon/reagent_containers/glass"), T("/obj/item/weapon/reagent_containers/food/condiment"), T("/obj/item/weapon/reagent_containers/food/drinks"));
	return f.dot;
});

// chem_grenade.dm:204
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/prime", function* prime(f: Frame) {
	let S: Value = null, G: Value = null;
	if (this.stage != 3) {
		return f.dot;
	}
	for (S of each(this.beakers, T("/obj/item/slime_extract"))) {
		if (S.Uses) {
			G = null;
			for (G of each(this.beakers, T("/obj/item/weapon/reagent_containers/glass"))) {
				yield* G.reagents.trans_to(S, G.reagents.total_volume);
			}
			if (S) {
				if (S.reagents && S.reagents.total_volume) {
					G = null;
					for (G of each(this.beakers, T("/obj/item/weapon/reagent_containers/glass"))) {
						yield* S.reagents.trans_to(G, S.reagents.total_volume);
					}
				} else {
					yield* S.forceMove(rt.getStep(f, this, 0));
					this.no_splash = 1;
				}
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chem_grenade.dm:229
rt.def("/obj/item/weapon/grenade/chem_grenade/large/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/slime_extract")) && this.stage == 2) {
		if (!(yield* user.transferItemToLoc(I, this))) {
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You add ${I} to the ${rt.initial(f, this, "name")} assembly.</span>`);
		this.beakers += I;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(6885, "/obj/item/weapon/grenade/chem_grenade/adv_release", "/obj/item/weapon/grenade/chem_grenade", {
	unit_spread: 10,
	name: "advanced release grenade",
	desc: "A custom made advanced release grenade. It is able to be detonated more than once. Can be configured using a multitool.",
	icon_state: "timeg",
	origin_tech: "combat=3;engineering=4",
});

// chem_grenade.dm:260
rt.def("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/multitool"))) {
		if (rt.inRange(this.unit_spread, 0, 24)) {
			this.unit_spread += 5;
		} else if (rt.inRange(this.unit_spread, 25, 99)) {
			this.unit_spread += 25;
		} else {
			this.unit_spread = 5;
		}
		to_chat(user, `<span class='notice'> You set the time release to ${this.unit_spread} units per detonation.</span>`);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chem_grenade.dm:273
rt.def("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/prime", function* prime(f: Frame) {
	let RC: Value = null, reactants: Value = null, RC_3: Value = null, M: Value = null, last: Value = null, _T: Value = null, A: Value = null, DA: Value = null;
	if (this.stage != 3) {
		return f.dot;
	}
	let total_volume: Value = 0;
	for (RC of each(this.beakers, T("/obj/item/weapon/reagent_containers"))) {
		total_volume += RC.reagents.total_volume;
	}
	if (!total_volume) {
		yield* qdel(this);
		yield* qdel(this.nadeassembly);
		return f.dot;
	}
	let fraction: Value = this.unit_spread / total_volume;
	(reactants = (yield* new_(T("/datum/reagents"), this.unit_spread))).my_atom = this;
	for (RC_3 of each(this.beakers, T("/obj/item/weapon/reagent_containers"))) {
		yield* RC_3.reagents.trans_to(reactants, RC_3.reagents.total_volume * fraction, this.threatscale, 1, 1);
	}
	yield* chem_splash(rt.getStep(f, this, 0), this.affected_area, list(reactants), this.ignition_temp, this.threatscale);
	if (this.nadeassembly) {
		M = (yield* get_mob_by_ckey(this.assemblyattacher));
		last = (yield* get_mob_by_ckey(this.nadeassembly.fingerprintslast));
		_T = rt.getStep(f, this, 0);
		A = get_area(_T);
		message_admins(fmt("grenade primed by an assembly, attached by ＀<A HREF='?_src_=holder;adminmoreinfo=＃'>(?)</A> (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) and last touched by ＀<A HREF='?_src_=holder;adminmoreinfo=＃'>(?)</A> (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) (＀ and ＀) at <A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>＀ (JMP)</a>.", [key_name_admin(M), M, M, key_name_admin(last), last, last, this.nadeassembly.a_left.name, this.nadeassembly.a_right.name, _T.x, _T.y, _T.z, A.name]));
		log_game(`grenade primed by an assembly, attached by ${key_name(M)} and last touched by ${key_name(last)} (${this.nadeassembly.a_left.name} and ${this.nadeassembly.a_right.name}) at ${A.name} (${_T.x}, ${_T.y}, ${_T.z})`);
	} else {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/grenade/chem_grenade/adv_release/proc/prime"))), this.det_time);
	}
	let DT: Value = rt.getStep(f, this, 0);
	log_game(`A grenade detonated at ${(DA = get_area(DT)).name} (${DT.x}, ${DT.y}, ${DT.z})`);
	return f.dot;
}, true);

rt.type(6886, "/obj/item/weapon/grenade/chem_grenade/metalfoam", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "metal foam grenade",
	desc: "Used for emergency sealing of air breaches.",
});

// chem_grenade.dm:317
rt.def("/obj/item/weapon/grenade/chem_grenade/metalfoam/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent("aluminium", 30);
	yield* B2.reagents.add_reagent("foaming_agent", 10);
	yield* B2.reagents.add_reagent("facid", 10);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6887, "/obj/item/weapon/grenade/chem_grenade/incendiary", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "incendiary grenade",
	desc: "Used for clearing rooms of living things.",
});

// chem_grenade.dm:335
rt.def("/obj/item/weapon/grenade/chem_grenade/incendiary/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent("phosphorus", 25);
	yield* B2.reagents.add_reagent("stable_plasma", 25);
	yield* B2.reagents.add_reagent("sacid", 25);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6888, "/obj/item/weapon/grenade/chem_grenade/antiweed", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "weedkiller grenade",
	desc: "Used for purging large areas of invasive plant species. Contents under pressure. Do not directly inhale contents.",
});

// chem_grenade.dm:353
rt.def("/obj/item/weapon/grenade/chem_grenade/antiweed/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent("plantbgone", 25);
	yield* B1.reagents.add_reagent("potassium", 25);
	yield* B2.reagents.add_reagent("phosphorus", 25);
	yield* B2.reagents.add_reagent("sugar", 25);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6889, "/obj/item/weapon/grenade/chem_grenade/cleaner", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "cleaner grenade",
	desc: "BLAM!-brand foaming space cleaner. In a special applicator for rapid cleaning of wide areas.",
});

// chem_grenade.dm:372
rt.def("/obj/item/weapon/grenade/chem_grenade/cleaner/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent("fluorosurfactant", 40);
	yield* B2.reagents.add_reagent("water", 40);
	yield* B2.reagents.add_reagent("cleaner", 10);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6890, "/obj/item/weapon/grenade/chem_grenade/ez_clean", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "cleaner grenade",
	desc: "Waffle Co.-brand foaming space cleaner. In a special applicator for rapid cleaning of wide areas.",
});

// chem_grenade.dm:390
rt.def("/obj/item/weapon/grenade/chem_grenade/ez_clean/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	yield* B1.reagents.add_reagent("fluorosurfactant", 40);
	yield* B2.reagents.add_reagent("water", 40);
	yield* B2.reagents.add_reagent("ez_clean", 60);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6891, "/obj/item/weapon/grenade/chem_grenade/teargas", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "teargas grenade",
	desc: "Used for nonlethal riot control. Contents under pressure. Do not directly inhale contents.",
});

// chem_grenade.dm:409
rt.def("/obj/item/weapon/grenade/chem_grenade/teargas/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/large"), this));
	yield* B1.reagents.add_reagent("condensedcapsaicin", 60);
	yield* B1.reagents.add_reagent("potassium", 40);
	yield* B2.reagents.add_reagent("phosphorus", 40);
	yield* B2.reagents.add_reagent("sugar", 40);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6892, "/obj/item/weapon/grenade/chem_grenade/facid", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "acid grenade",
	desc: "Used for melting armoured opponents.",
});

// chem_grenade.dm:428
rt.def("/obj/item/weapon/grenade/chem_grenade/facid/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	yield* B1.reagents.add_reagent("facid", 290);
	yield* B1.reagents.add_reagent("potassium", 10);
	yield* B2.reagents.add_reagent("phosphorus", 10);
	yield* B2.reagents.add_reagent("sugar", 10);
	yield* B2.reagents.add_reagent("facid", 280);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6893, "/obj/item/weapon/grenade/chem_grenade/colorful", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "colorful grenade",
	desc: "Used for wide scale painting projects.",
});

// chem_grenade.dm:448
rt.def("/obj/item/weapon/grenade/chem_grenade/colorful/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent("colorful_reagent", 25);
	yield* B1.reagents.add_reagent("potassium", 25);
	yield* B2.reagents.add_reagent("phosphorus", 25);
	yield* B2.reagents.add_reagent("sugar", 25);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6894, "/obj/item/weapon/grenade/chem_grenade/glitter", "/obj/item/weapon/grenade/chem_grenade", {
	glitter_type: "glitter",
	stage: 3,
	name: "generic glitter grenade",
	desc: "You shouldn't see this description.",
});

// chem_grenade.dm:467
rt.def("/obj/item/weapon/grenade/chem_grenade/glitter/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker"), this));
	yield* B1.reagents.add_reagent(this.glitter_type, 25);
	yield* B1.reagents.add_reagent("potassium", 25);
	yield* B2.reagents.add_reagent("phosphorus", 25);
	yield* B2.reagents.add_reagent("sugar", 25);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6898, "/obj/item/weapon/grenade/chem_grenade/clf3", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "clf3 grenade",
	desc: "BURN!-brand foaming clf3. In a special applicator for rapid purging of wide areas.",
});

// chem_grenade.dm:500
rt.def("/obj/item/weapon/grenade/chem_grenade/clf3/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	yield* B1.reagents.add_reagent("fluorosurfactant", 250);
	yield* B1.reagents.add_reagent("clf3", 50);
	yield* B2.reagents.add_reagent("water", 250);
	yield* B2.reagents.add_reagent("clf3", 50);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6899, "/obj/item/weapon/grenade/chem_grenade/bioterrorfoam", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "Bio terror foam grenade",
	desc: "Tiger Cooperative chemical foam grenade. Causes temporary irration, blindness, confusion, mutism, and mutations to carbon based life forms. Contains additional spore toxin",
});

// chem_grenade.dm:518
rt.def("/obj/item/weapon/grenade/chem_grenade/bioterrorfoam/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	yield* B1.reagents.add_reagent("cryptobiolin", 75);
	yield* B1.reagents.add_reagent("water", 50);
	yield* B1.reagents.add_reagent("mutetoxin", 50);
	yield* B1.reagents.add_reagent("spore", 75);
	yield* B1.reagents.add_reagent("itching_powder", 50);
	yield* B2.reagents.add_reagent("fluorosurfactant", 150);
	yield* B2.reagents.add_reagent("mutagen", 150);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);

rt.type(6900, "/obj/item/weapon/grenade/chem_grenade/tuberculosis", "/obj/item/weapon/grenade/chem_grenade", {
	stage: 3,
	name: "Fungal tuberculosis grenade",
	desc: "WARNING: GRENADE WILL RELEASE DEADLY SPORES CONTAINING ACTIVE AGENTS. SEAL SUIT AND AIRFLOW BEFORE USE.",
});

// chem_grenade.dm:538
rt.def("/obj/item/weapon/grenade/chem_grenade/tuberculosis/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	let B1: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	let B2: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/beaker/bluespace"), this));
	yield* B1.reagents.add_reagent("potassium", 50);
	yield* B1.reagents.add_reagent("phosphorus", 50);
	yield* B1.reagents.add_reagent("fungalspores", 200);
	yield* B2.reagents.add_reagent("blood", 250);
	yield* B2.reagents.add_reagent("sugar", 50);
	this.beakers += B1;
	this.beakers += B2;
	return f.dot;
}, true);
