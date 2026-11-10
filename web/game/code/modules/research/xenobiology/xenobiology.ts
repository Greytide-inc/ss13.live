// Based on /tg/station's code/modules/research/xenobiology/xenobiology.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10137, "/obj/item/slime_extract", "/obj/item", {
	Uses: 1,
	qdel_timer: null,
	w_class: 1,
	throw_speed: 3,
	throw_range: 6,
	origin_tech: "biotech=3",
	container_type: 1024,
	name: "slime extract",
	desc: "Goo extracted from a slime. Legends claim these to have \"magical powers\".",
	icon: rt.rsc("icons/mob/slimes.dmi"),
	icon_state: "grey slime extract",
	force: 1,
	throwforce: 0,
});

// xenobiology.dm:20
rt.def("/obj/item/slime_extract/proc/attackby", function* attackby(f: Frame, O: Value, user: Value) {
	if (rt.istype(O, T("/obj/item/slimepotion/enhancer"))) {
		if (this.Uses >= 5) {
			to_chat(user, "<span class='warning'>You cannot enhance this extract further!</span>");
			return (yield* parent_proc());
		}
		to_chat(user, "<span class='notice'>You apply the enhancer to the slime extract. It may now be reused one more time.</span>");
		this.Uses++;
		yield* qdel(O);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// xenobiology.dm:30
rt.def("/obj/item/slime_extract/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* this.create_reagents(100);
	return f.dot;
}, true);

rt.type(10093, "/obj/item/slimepotion", "/obj/item", {
	w_class: 1,
	origin_tech: "biotech=4",
	name: "slime potion",
	desc: "A hard yet gelatinous capsule excreted by a slime, containing mysterious substances.",
});

// xenobiology.dm:130
rt.def("/obj/item/slimepotion/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	if (!rt.istype(target, T("/obj/item/weapon/reagent_containers"))) return f.dot;
	to_chat(user, `<span class='notice'>You cannot transfer ${this} to ${target}! It appears the potion must be given directly to a slime to absorb.</span>`);
	return f.dot;
});

rt.type(10096, "/obj/item/slimepotion/docility", "/obj/item/slimepotion", {
	name: "docility potion",
	desc: "A potent chemical mix that nullifies a slime's hunger, causing it to become docile and tame.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potsilver",
});

// xenobiology.dm:141
rt.def("/obj/item/slimepotion/docility/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let newname: Value = null;
	if (!rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(user, "<span class='warning'>The potion only works on slimes!</span>");
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, "<span class='warning'>The slime is dead!</span>");
		return (yield* parent_proc());
	}
	M.docile = 1;
	M.nutrition = 700;
	to_chat(M, "<span class='warning'>You absorb the potion and feel your intense desire to feed melt away.</span>");
	to_chat(user, "<span class='notice'>You feed the slime the potion, removing its hunger and calming it.</span>");
	if (!(newname = copytext(sanitize((yield* g.op(f, "Prompt", [3], ["pet slime", "Name your new pet", "Would you like to give the slime a name?", user, null]))), 1, 42))) {
		newname = "pet slime";
	}
	M.name = newname;
	M.real_name = newname;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10094, "/obj/item/slimepotion/sentience", "/obj/item/slimepotion", {
	not_interested: null,
	being_used: 0,
	sentience_type: 1,
	origin_tech: "biotech=6",
	name: "intelligence potion",
	desc: "A miraculous chemical mix that grants human like intelligence to living beings.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potpink",
});

// xenobiology.dm:166
rt.def("/obj/item/slimepotion/sentience/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.not_interested = list();
	return f.dot;
});

// xenobiology.dm:171
rt.def("/obj/item/slimepotion/sentience/proc/afterattack", function* afterattack(f: Frame, M: Value, user: Value) {
	let SM: Value = null, theghost: Value = null;
	if (this.being_used || !ismob(M)) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/simple_animal")) || M.ckey) {
		to_chat(user, `<span class='warning'>${M} is already too intelligent for this to work!</span>`);
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, `<span class='warning'>${M} is dead!</span>`);
		return (yield* parent_proc());
	}
	if ((SM = M).sentience_type != this.sentience_type) {
		to_chat(user, `<span class='warning'>${this} won't work on ${SM}.</span>`);
		return (yield* parent_proc());
	}
	to_chat(user, `<span class='notice'>You offer ${this} to ${SM}...</span>`);
	this.being_used = 1;
	let candidates: Value = (yield* pollCandidatesForMob(`Do you want to play as ${SM.name}?`, "xenomorph", null, "xenomorph", 50, SM, "sentience_potion"));
	if (rt.len(f, candidates)) {
		theghost = pick(candidates);
		SM.key = theghost.key;
		yield* SM.mind.enslave_mind_to_creator(user);
		SM.sentience_act();
		to_chat(SM, "<span class='warning'>All at once it makes sense: you know what you are and who you are! Self awareness is yours!</span>");
		to_chat(SM, `<span class='userdanger'>You are grateful to be self aware and owe ${user} a great debt. Serve ${user}, and assist ${user.p_them()} in completing ${user.p_their()} goals at any cost.</span>`);
		to_chat(user, `<span class='notice'>${SM} accepts ${this} and suddenly becomes attentive and aware. It worked!</span>`);
		yield* qdel(this);
	} else {
		to_chat(user, `<span class='notice'>${SM} looks interested for a moment, but then looks back down. Maybe you should try again later.</span>`);
		this.being_used = 0;
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(10097, "/obj/item/slimepotion/transference", "/obj/item/slimepotion", {
	prompted: 0,
	animal_type: 1,
	origin_tech: "biotech=6",
	name: "consciousness transference potion",
	desc: "A strange slime-based chemical that, when used, allows the user to transfer their consciousness to a lesser being.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potorange",
});

// xenobiology.dm:215
rt.def("/obj/item/slimepotion/transference/proc/afterattack", function* afterattack(f: Frame, M: Value, user: Value) {
	let SM: Value = null;
	if (this.prompted || !ismob(M)) {
		return f.dot;
	}
	if (!rt.istype(M, T("/mob/living/simple_animal")) || M.ckey) {
		to_chat(user, `<span class='warning'>${M} already has a higher consciousness!</span>`);
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, `<span class='warning'>${M} is dead!</span>`);
		return (yield* parent_proc());
	}
	if ((SM = M).sentience_type != this.animal_type) {
		to_chat(user, `<span class='warning'>You cannot transfer your consciousness to ${SM}.</span>`);
		return (yield* parent_proc());
	}
	if (jobban_isbanned(user, "xenomorph")) {
		to_chat(user, "<span class='warning'>Your mind goes blank as you attempt to use the potion.</span>");
		return f.dot;
	}
	this.prompted = 1;
	if ((yield* alert(`This will permanently transfer your consciousness to ${SM}. Are you sure you want to do this?`, null, "Yes", "No")) == "No") {
		this.prompted = 0;
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You drink the potion then place your hands on ${SM}...</span>`);
	yield* user.mind.transfer_to(SM);
	SM.faction = (yield* user.faction.Copy());
	SM.sentience_act();
	yield* user.death();
	to_chat(SM, `<span class='notice'>In a quick flash, you feel your consciousness flow into ${SM}!</span>`);
	to_chat(SM, `<span class='warning'>You are now ${SM}. Your allegiances, alliances, and role is still the same as it was prior to consciousness transfer!</span>`);
	SM.name = `${SM.name} as ${user.real_name}`;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10098, "/obj/item/slimepotion/steroid", "/obj/item/slimepotion", {
	name: "slime steroid",
	desc: "A potent chemical mix that will cause a baby slime to generate more extract.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potred",
});

// xenobiology.dm:255
rt.def("/obj/item/slimepotion/steroid/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(user, "<span class='warning'>The steroid only works on baby slimes!</span>");
		return (yield* parent_proc());
	}
	if (M.is_adult) {
		to_chat(user, "<span class='warning'>Only baby slimes can use the steroid!</span>");
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, "<span class='warning'>The slime is dead!</span>");
		return (yield* parent_proc());
	}
	if (M.cores >= 5) {
		to_chat(user, "<span class='warning'>The slime already has the maximum amount of extract!</span>");
		return (yield* parent_proc());
	}
	to_chat(user, "<span class='notice'>You feed the slime the steroid. It will now produce one more extract.</span>");
	M.cores++;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10100, "/obj/item/slimepotion/stabilizer", "/obj/item/slimepotion", {
	name: "slime stabilizer",
	desc: "A potent chemical mix that will reduce the chance of a slime mutating.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potcyan",
});

// xenobiology.dm:285
rt.def("/obj/item/slimepotion/stabilizer/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(user, "<span class='warning'>The stabilizer only works on slimes!</span>");
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, "<span class='warning'>The slime is dead!</span>");
		return (yield* parent_proc());
	}
	if (M.mutation_chance == 0) {
		to_chat(user, "<span class='warning'>The slime already has no chance of mutating!</span>");
		return (yield* parent_proc());
	}
	to_chat(user, "<span class='notice'>You feed the slime the stabilizer. It is now less likely to mutate.</span>");
	M.mutation_chance = max(0, min(M.mutation_chance - 15, 100));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10101, "/obj/item/slimepotion/mutator", "/obj/item/slimepotion", {
	name: "slime mutator",
	desc: "A potent chemical mix that will increase the chance of a slime mutating.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potgreen",
});

// xenobiology.dm:306
rt.def("/obj/item/slimepotion/mutator/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (!rt.istype(M, T("/mob/living/simple_animal/slime"))) {
		to_chat(user, "<span class='warning'>The mutator only works on slimes!</span>");
		return (yield* parent_proc());
	}
	if (M.stat) {
		to_chat(user, "<span class='warning'>The slime is dead!</span>");
		return (yield* parent_proc());
	}
	if (M.mutator_used) {
		to_chat(user, "<span class='warning'>This slime has already consumed a mutator, any more would be far too unstable!</span>");
		return (yield* parent_proc());
	}
	if (M.mutation_chance == 100) {
		to_chat(user, "<span class='warning'>The slime is already guaranteed to mutate!</span>");
		return (yield* parent_proc());
	}
	to_chat(user, "<span class='notice'>You feed the slime the mutator. It is now more likely to mutate.</span>");
	M.mutation_chance = max(0, min(M.mutation_chance + 12, 100));
	M.mutator_used = 1;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10102, "/obj/item/slimepotion/speed", "/obj/item/slimepotion", {
	origin_tech: "biotech=5",
	name: "slime speed potion",
	desc: "A potent chemical mix that will remove the slowdown from any item.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potyellow",
});

// xenobiology.dm:332
rt.def("/obj/item/slimepotion/speed/proc/afterattack", function* afterattack(f: Frame, C: Value, user: Value) {
	let I: Value = null, V: Value = null, R: Value = null;
	yield* parent_proc();
	if (!rt.istype(C, T("/obj"))) {
		to_chat(user, "<span class='warning'>The potion can only be used on items or vehicles!</span>");
		return f.dot;
	}
	if (rt.istype(C, T("/obj/item"))) {
		if ((I = C).slowdown <= 0) {
			to_chat(user, `<span class='warning'>The ${C} can't be made any faster!</span>`);
			return (yield* parent_proc());
		}
		I.slowdown = 0;
	}
	if (rt.istype(C, T("/obj/vehicle"))) {
		V = C;
		R = V.riding_datum;
		if (V.riding_datum) {
			if (R.vehicle_move_delay <= 0) {
				to_chat(user, `<span class='warning'>The ${C} can't be made any faster!</span>`);
				return (yield* parent_proc());
			}
			R.vehicle_move_delay = 0;
		}
	}
	to_chat(user, `<span class='notice'>You slather the red gunk over the ${C}, making it faster.</span>`);
	C.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
	C.add_atom_colour("#FF0000", FIXED_COLOUR_PRIORITY);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10103, "/obj/item/slimepotion/fireproof", "/obj/item/slimepotion", {
	uses: 3,
	origin_tech: "biotech=5",
	name: "slime chill potion",
	desc: "A potent chemical mix that will fireproof any article of clothing. Has three uses.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potblue",
});

// xenobiology.dm:367
rt.def("/obj/item/slimepotion/fireproof/proc/afterattack", function* afterattack(f: Frame, C: Value, user: Value) {
	yield* parent_proc();
	if (!this.uses) {
		yield* qdel(this);
		return f.dot;
	}
	if (!rt.istype(C, T("/obj/item/clothing"))) {
		to_chat(user, "<span class='warning'>The potion can only be used on clothing!</span>");
		return f.dot;
	}
	if (C.max_heat_protection_temperature == FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT) {
		to_chat(user, `<span class='warning'>The ${C} is already fireproof!</span>`);
		return (yield* parent_proc());
	}
	to_chat(user, `<span class='notice'>You slather the blue gunk over the ${C}, fireproofing it.</span>`);
	C.name = `fireproofed ${C.name}`;
	C.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
	C.add_atom_colour("#000080", FIXED_COLOUR_PRIORITY);
	C.max_heat_protection_temperature = FIRE_IMMUNITY_SUIT_MAX_TEMP_PROTECT;
	C.heat_protection = C.body_parts_covered;
	(rt.modField(f, C, "resistance_flags", FIRE_PROOF, rt.bitOr));
	this.uses--;
	if (this.uses) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10104, "/obj/item/slimepotion/genderchange", "/obj/item/slimepotion", {
	name: "gender change potion",
	desc: "An interesting chemical mix that changes the biological gender of what its applied to. Cannot be used on things that lack gender entirely.",
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "potlightpink",
});

// xenobiology.dm:395
rt.def("/obj/item/slimepotion/genderchange/proc/attack", function* attack(f: Frame, L: Value, user: Value) {
	if (!rt.istype(L, T("/mob/living")) || L.stat == 2) {
		to_chat(user, "<span class='warning'>The potion can only be used on living things!</span>");
		return f.dot;
	}
	if (L.gender != "male" && L.gender != "female") {
		to_chat(user, "<span class='warning'>The potion can only be used on gendered things!</span>");
		return f.dot;
	}
	if (L.gender == "male") {
		L.gender = "female";
		L.visible_message(`<span class='boldnotice'>${L} suddenly looks more feminine!</span>`, "<span class='boldwarning'>You suddenly feel more feminine!</span>");
	} else {
		L.gender = "male";
		L.visible_message(`<span class='boldnotice'>${L} suddenly looks more masculine!</span>`, "<span class='boldwarning'>You suddenly feel more masculine!</span>");
	}
	yield* L.regenerate_icons();
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12095, "/obj/effect/golemrune", "/obj/effect", {
	anchored: 1,
	desc: "a strange rune used to create golems. It glows when spirits are nearby.",
	name: "rune",
	icon: rt.rsc("icons/obj/rune.dmi"),
	icon_state: "golem",
	resistance_flags: 51,
	layer: 2,
});

// xenobiology.dm:487
rt.def("/obj/effect/golemrune/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	yield* notify_ghosts(`Golem rune created in ${get_area(this)}.`, rt.rsc("sound/effects/ghost2.ogg"), { source: this });
	return f.dot;
}, true);

// xenobiology.dm:492
rt.def("/obj/effect/golemrune/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// xenobiology.dm:497
rt.def("/obj/effect/golemrune/proc/process", function process(f: Frame) {
	let ghost: Value = null, O: Value = null;
	for (O of each(this.loc, T("/mob/dead/observer"))) {
		if (!O.client) {
			continue;
		}
		if (O.mind && O.mind.current && O.mind.current.stat != 2) {
			continue;
		}
		if (O.orbiting) {
			continue;
		}
		ghost = O;
		break;
	}
	if (ghost) {
		this.icon_state = "golem2";
	} else {
		this.icon_state = "golem";
	}
	return f.dot;
}, false, { waitfor: false });

// xenobiology.dm:513
rt.def("/obj/effect/golemrune/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let ghost: Value = null, O: Value = null, G: Value = null;
	for (O of each(this.loc, T("/mob/dead/observer"))) {
		if (!O.client) {
			continue;
		}
		if (O.mind && O.mind.current && O.mind.current.stat != 2) {
			continue;
		}
		if (O.orbiting) {
			continue;
		}
		ghost = O;
		break;
	}
	if (!ghost) {
		to_chat(user, "<span class='warning'>The rune fizzles uselessly! There is no spirit nearby.</span>");
		return f.dot;
	}
	yield* (G = (yield* new_(T("/mob/living/carbon/human")))).set_species(T("/datum/species/golem/adamantine"));
	yield* G.set_cloned_appearance();
	G.real_name = G.dna.species.random_name();
	G.name = G.real_name;
	G.dna.unique_enzymes = G.dna.generate_unique_enzymes();
	G.dna.species.auto_equip(G);
	G.loc = this.loc;
	G.key = ghost.key;
	to_chat(G, `You are an adamantine golem. You move slowly, but are highly resistant to heat and cold as well as blunt trauma. You are unable to wear clothes, but can still use most tools. Serve ${user}, and assist ${user.p_them()} in completing their goals at any cost.`);
	G.mind.store_memory(`<b>Serve ${user.real_name}, your creator.</b>`);
	yield* G.mind.enslave_mind_to_creator(user);
	log_game(`${key_name(G)} was made a golem by ${key_name(user)}.`);
	log_admin(`${key_name(G)} was made a golem by ${key_name(user)}.`);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12096, "/obj/effect/timestop", "/obj/effect", {
	immune: null,
	stopped_atoms: null,
	freezerange: 2,
	duration: 140,
	anchored: 1,
	name: "chronofield",
	desc: "ZA WARUDO",
	icon: rt.rsc("icons/effects/160x160.dmi"),
	icon_state: "time",
	layer: 5,
	pixel_x: -64,
	pixel_y: -64,
	mouse_opacity: 0,
	alpha: 125,
});

// xenobiology.dm:557
rt.def("/obj/effect/timestop/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.immune = list();

	this.stopped_atoms = list();
	return f.dot;
});

// xenobiology.dm:564
rt.def("/obj/effect/timestop/proc/Initialize", function Initialize(f: Frame) {
	let M: Value = null, L: Value = null, _T: Value = null;
	f.dot = parent_proc();
	for (M of each(GLOB.living_mob_list)) {
		L = M;
		_T = null;
		for (_T of each(L.mind.spell_list, T("/obj/effect/proc_holder/spell/aoe_turf/conjure/timestop"))) {
			(rt.modSrcVar(f, "immune", L, rt.bitOr));
		}
	}
	this.timestop();
	return f.dot;
});

// xenobiology.dm:574
rt.def("/obj/effect/timestop/proc/timestop", function* timestop(f: Frame) {
	let i: Value = null, A: Value = null, M: Value = null, H: Value = null, _P: Value = null, M_1: Value = null, M_0: Value = null, _P_0: Value = null;
	let $e: any;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/magic/timeparadox2.ogg"), 100, 1, -1);
	rt.forRange(f, 0, 1, this.duration - 1, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		A = null;
		for (A of each(orange(this.freezerange, this.loc), T("/atom"))) {
			if (rt.istype(A, T("/mob/living"))) {
				if (rt.isIn(f, (M = A), this.immune)) {
					continue;
				}
				yield* M.Stun(200, 1, 1);
				M.anchored = 1;
				if (rt.istype(M, T("/mob/living/simple_animal/hostile"))) {
					(H = M).AIStatus = AI_OFF;
					yield* H.LoseTarget();
				}
				(rt.modSrcVar(f, "stopped_atoms", M, rt.bitOr));
			} else if (rt.istype(A, T("/obj/item/projectile"))) {
				(_P = A).paused = 1;
				(rt.modSrcVar(f, "stopped_atoms", _P, rt.bitOr));
			}
		}
		M_1 = null;
		for (M_1 of each(this.stopped_atoms, T("/mob/living"))) {
			if (get_dist(rt.getStep(f, M_1, 0), rt.getStep(f, this, 0)) > this.freezerange) {
				yield* this.unfreeze_mob(M_1);
				this.stopped_atoms -= M_1;
			}
		}
		yield* stoplag();
	}
	rt.endFor(f, 0);
	for (M_0 of each(this.stopped_atoms, T("/mob/living"))) {
		yield* this.unfreeze_mob(M_0);
	}
	for (_P_0 of each(this.stopped_atoms, T("/obj/item/projectile"))) {
		_P_0.paused = 0;
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// xenobiology.dm:611
rt.def("/obj/effect/timestop/proc/unfreeze_mob", function* unfreeze_mob(f: Frame, M: Value) {
	let H: Value = null;
	yield* M.AdjustStun(-200, 1, 1);
	M.anchored = 0;
	if (!rt.istype(M, T("/mob/living/simple_animal/hostile"))) return f.dot;
	(H = M).AIStatus = rt.initial(f, H, "AIStatus");
	return f.dot;
}, true);

rt.type(9004, "/obj/item/stack/tile/bluespace", "/obj/item/stack/tile", {
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	turf_type: rt.typePath("/turf/open/floor/bluespace"),
	name: "bluespace floor tile",
	singular_name: "floor tile",
	desc: "Through a series of micro-teleports these tiles let people move at incredible speeds",
	icon_state: "tile-bluespace",
	w_class: 3,
	force: 6,
	materials: null,
	throwforce: 10,
	max_amount: 60,
});

// xenobiology.dm:629
rt.def("/obj/item/stack/tile/bluespace/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);
	return f.dot;
});

rt.type(9005, "/obj/item/stack/tile/sepia", "/obj/item/stack/tile", {
	throw_speed: 3,
	throw_range: 7,
	flags: 64,
	turf_type: rt.typePath("/turf/open/floor/sepia"),
	name: "sepia floor tile",
	singular_name: "floor tile",
	desc: "Time seems to flow very slowly around these tiles",
	icon_state: "tile-sepia",
	w_class: 3,
	force: 6,
	materials: null,
	throwforce: 10,
	max_amount: 60,
});

// xenobiology.dm:645
rt.def("/obj/item/stack/tile/sepia/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);
	return f.dot;
});

rt.type(9654, "/obj/item/areaeditor/blueprints/slime", "/obj/item/areaeditor/blueprints", {
	name: "cerulean prints",
	desc: "A one use yet of blueprints made of jelly like organic material. Renaming an area to 'Xenobiology Lab' will extend the reach of the management console.",
	color: "#2956B2",
});

// xenobiology.dm:660
rt.def("/obj/item/areaeditor/blueprints/slime/proc/edit_area", function* edit_area(f: Frame) {
	let _T: Value = null;
	let success: Value = (yield* parent_proc());
	let A: Value = this.get_area(this);
	if (!success) return f.dot;
	for (_T of each(A, T("/turf"))) {
		_T.remove_atom_colour(WASHABLE_COLOUR_PRIORITY);
		_T.add_atom_colour("#2956B2", FIXED_COLOUR_PRIORITY);
	}
	yield* qdel(this);
	return f.dot;
}, true);
