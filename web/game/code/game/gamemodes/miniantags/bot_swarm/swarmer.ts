// Based on /tg/station's code/game/gamemodes/miniantags/bot_swarm/swarmer.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(9213, "/obj/item/device/unactivated_swarmer", "/obj/item/device", {
	name: "unactivated swarmer",
	desc: "A currently unactivated swarmer. Swarmers can self activate at any time, it would be wise to immediately dispose of this.",
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	icon_state: "swarmer_unactivated",
	origin_tech: "bluespace=4;materials=4;programming=7",
	materials: null,
});

// swarmer.dm:8
rt.def("/obj/item/device/unactivated_swarmer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10000, "$glass", 4000]);
	return f.dot;
});

// swarmer.dm:12
rt.def("/obj/item/device/unactivated_swarmer/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.crit_fail) {
		yield* notify_ghosts(`An unactivated swarmer has been created in ${get_area(this)}!`, { enter_link: fmt("<a href=?src=＃;ghostjoin=1>(Click to enter)</a>", [this]), source: this, action: "attack" });
	}
	yield* parent_proc();
	return f.dot;
}, true);

// swarmer.dm:17
rt.def("/obj/item/device/unactivated_swarmer/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let ghost: Value = null;
	if (!rt.at(href_list, "ghostjoin")) return f.dot;
	if (!rt.istype((ghost = f.usr), T("/mob/dead/observer"))) return f.dot;
	yield* this.attack_ghost(ghost);
	return f.dot;
}, true);

// swarmer.dm:23
rt.def("/obj/item/device/unactivated_swarmer/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* parent_proc();
	if (!(rt.istype(W, T("/obj/item/weapon/screwdriver")) && !this.crit_fail)) return f.dot;
	user.visible_message(`<span class='warning'>${f.usr.name} deactivates ${this}.</span>`, `<span class='notice'>After some fiddling, you find a way to disable ${this}'s power source.</span>`, "<span class='italics'>You hear clicking.</span>");
	this.name = "deactivated swarmer";
	this.desc = "A shell of swarmer that was completely powered down. It can no longer activate itself.";
	this.crit_fail = 1;
	return f.dot;
}, true);

// swarmer.dm:34
rt.def("/obj/item/device/unactivated_swarmer/proc/attack_ghost", function* attack_ghost(f: Frame, user: Value) {
	let be_swarmer: Value = null, S: Value = null;
	if (this.crit_fail) {
		to_chat(user, "This swarmer shell is completely depowered. You cannot activate it.");
		return f.dot;
	}
	if ((be_swarmer = (yield* alert("Become a swarmer? (Warning, You can no longer be cloned!)", null, "Yes", "No"))) == "No") {
		return f.dot;
	}
	if (this.crit_fail) {
		to_chat(user, "Swarmer has been depowered.");
		return f.dot;
	}
	if (!this || this.gc_destroyed) {
		to_chat(user, "Swarmer has been occupied by someone else.");
		return f.dot;
	}
	(S = (yield* new_(T("/mob/living/simple_animal/hostile/swarmer"), rt.getStep(f, this.loc, 0)))).key = user.key;
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(4883, "/mob/living/simple_animal/hostile/swarmer", "/mob/living/simple_animal/hostile", {
	resources: 0,
	max_resources: 100,
	login_text_dump: "\n\t<b>You are a swarmer, a weapon of a long dead civilization. Until further orders from your original masters are received, you must continue to consume and replicate.</b>\n\t<b>Clicking on any object will try to consume it, either deconstructing it into its components, destroying it, or integrating any materials it has into you if successful.</b>\n\t<b>Ctrl-Clicking on a mob will attempt to remove it from the area and place it in a safe environment for storage.</b>\n\t<b>Objectives:</b>\n\t1. Consume resources and replicate until there are no more resources left.\n\t2. Ensure that this location is fit for invasion at a later date; do not perform actions that would render it dangerous or inhospitable.\n\t3. Biological resources will be harvested at a later date; do not harm them.\n\t",
	initial_language_holder: rt.typePath("/datum/language_holder/swarmer"),
	hud_possible: null,
	pass_flags: 1,
	light_color: "#7DE1E1",
	name: "Swarmer",
	unique_name: 1,
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	desc: "A robot of unknown design, they seek only to consume materials and replicate themselves indefinitely.",
	speak_emote: null,
	bubble_icon: "swarmer",
	health: 40,
	maxHealth: 40,
	status_flags: 8,
	icon_state: "swarmer",
	icon_living: "swarmer",
	icon_dead: "swarmer_unactivated",
	icon_gib: null,
	wander: 0,
	harm_intent_damage: 5,
	minbodytemp: 0,
	maxbodytemp: 500,
	atmos_requirements: null,
	unsuitable_atmos_damage: 0,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	melee_damage_type: "stamina",
	damage_coeff: null,
	obj_damage: 0,
	environment_smash: 0,
	attacktext: "shocks",
	attack_sound: rt.rsc("sound/effects/empulse.ogg"),
	friendly: "pinches",
	speed: 0,
	faction: null,
	AIStatus: 3,
	mob_size: 0,
	ventcrawler: 2,
	ranged: 1,
	projectiletype: rt.typePath("/obj/item/projectile/beam/disabler"),
	ranged_cooldown_time: 20,
	projectilesound: rt.rsc("sound/weapons/taser2.ogg"),
	loot: null,
	del_on_death: 1,
	deathmessage: "explodes with a sharp pop!",
});

// swarmer.dm:64
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("15", "8", "9");

	this.speak_emote = list("tones");
	this.atmos_requirements = rt.alist(f, ["min_oxy", 0, "max_oxy", 0, "min_tox", 0, "max_tox", 0, "min_co2", 0, "max_co2", 0, "min_n2", 0, "max_n2", 0]);
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);

	this.faction = list("swarmer");

	this.loot = list(T("/obj/effect/decal/cleanable/robot_debris"), T("/obj/item/weapon/ore/bluespace_crystal"));
	return f.dot;
});

// swarmer.dm:117
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	to_chat(this, this.login_text_dump);
	return f.dot;
}, true);

// swarmer.dm:121
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	yield* parent_proc();
	this.verbs -= P("/mob/living/verb/pulled");
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	return f.dot;
}, true);

// swarmer.dm:129
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "9");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = `huddiag${RoundDiagBar(this.health / this.maxHealth)}`;
	return f.dot;
});

// swarmer.dm:135
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "8");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = "hudstat";
	return f.dot;
});

// swarmer.dm:140
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	stat("Resources:", this.resources);
	return f.dot;
}, true);

// swarmer.dm:145
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/handle_inherent_channels", function* handle_inherent_channels(f: Frame, message: Value, message_mode: Value) {
	if (message_mode == "binary") {
		this.swarmer_chat(message);
		return 3;
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// swarmer.dm:152
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(parent_proc(), "robot");
});

// swarmer.dm:155
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/emp_act", function* emp_act(f: Frame) {
	if (this.health > 1) {
		yield* this.adjustHealth(this.health - 1);
	} else {
		yield* this.death();
	}
	return f.dot;
}, true);

// swarmer.dm:161
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CanPass", function CanPass(f: Frame, O: Value) {
	if (rt.istype(O, T("/obj/item/projectile/beam/disabler"))) {
		return 1;
	}
	if (rt.istype(O, T("/mob/living/simple_animal/hostile/swarmer"))) {
		return 1;
	}
	parent_proc();
	return f.dot;
}, false);

// swarmer.dm:169
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (!rt.istype(this.target, T("/mob/living"))) {
		return (yield* this.target.swarmer_act(this));
	}
	return (yield* parent_proc());
}, true);

// swarmer.dm:175
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CtrlClickOn", function* CtrlClickOn(f: Frame, A: Value) {
	yield* this.face_atom(A);
	if (!isturf(this.loc)) {
		return f.dot;
	}
	if (this.next_move > rt.worldTime(f)) {
		return f.dot;
	}
	if (!A.Adjacent(this)) {
		return f.dot;
	}
	yield* A.swarmer_act(this);
	return f.dot;
}, true);

// swarmer.dm:185
rt.def("/atom/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:192
rt.def("/obj/proc/swarmer_act", function* swarmer_act(f: Frame) {
	if (rt.bitAnd(this.resistance_flags, INDESTRUCTIBLE)) {
		return 0;
	}
	return (yield* parent_proc());
}, true);

// swarmer.dm:197
rt.def("/obj/item/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	return (yield* S.Integrate(this));
}, true);

// swarmer.dm:200
rt.def("/obj/item/proc/IntegrateAmount", function IntegrateAmount(f: Frame) {
	if (rt.at(this.materials, "$metal") || rt.at(this.materials, "$glass")) {
		return 1;
	}
	return 0;
});

rt.type(12467, "/obj/structure/swarmer", "/obj/structure", {
	lon_range: 1,
	light_color: "#7DE1E1",
	anchored: 1,
	name: "swarmer ui",
	desc: null,
	gender: "neuter",
	icon: rt.rsc("icons/mob/swarmer.dmi"),
	icon_state: "ui_light",
	layer: 4,
	resistance_flags: 50,
	obj_integrity: 30,
	max_integrity: 30,
});

// swarmer.dm:232
rt.def("/obj/structure/swarmer/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	if (S.AIStatus == AI_ON) {
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

rt.type(11699, "/obj/effect/decal/cleanable/robot_debris", "/obj/effect/decal/cleanable", {
	name: "robot debris",
	desc: "It's a useless heap of junk... <i>or is it?</i>",
	icon: rt.rsc("icons/mob/robots.dmi"),
	icon_state: "gib1",
	layer: 2.5,
	random_icon_states: null,
	blood_state: "oil",
	bloodiness: 100,
	mergeable_decal: 0,
});

// swarmer.dm:241
rt.def("/obj/effect/decal/cleanable/robot_debris/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	yield* qdel(this);
	return 1;
}, true);

// swarmer.dm:249
rt.def("/turf/open/floor/plating/lava/proc/swarmer_act", function* swarmer_act(f: Frame) {
	if (!this.is_safe()) {
		yield* new_(T("/obj/structure/lattice/catwalk/swarmer_catwalk"), this);
	}
	return 0;
}, true);

// swarmer.dm:260
rt.def("/obj/machinery/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DismantleMachine(this);
	return 1;
}, true);

// swarmer.dm:264
rt.def("/obj/machinery/light/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:268
rt.def("/obj/machinery/door/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	let _T: Value = null;
	let isonshuttle: Value = (rt.istype(get_area(this), T("/area/shuttle")) ? 1 : 0);
	for (_T of each(range(1, this), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/space")) || !isonshuttle && (rt.istype(_T.loc, T("/area/shuttle")) || rt.istype(_T.loc, T("/area/space"))) || isonshuttle && !rt.istype(_T.loc, T("/area/shuttle"))) {
			to_chat(S, "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>");
			S.target = null;
			return 0;
		}
	}
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:278
rt.def("/obj/machinery/camera/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	yield* this.toggle_cam(S, 0);
	return 1;
}, true);

// swarmer.dm:283
rt.def("/obj/machinery/particle_accelerator/control_box/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:287
rt.def("/obj/machinery/field/generator/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:291
rt.def("/obj/machinery/gravity_generator/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:295
rt.def("/obj/machinery/vending/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:299
rt.def("/obj/machinery/turretid/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisIntegrate(this);
	return 1;
}, true);

// swarmer.dm:303
rt.def("/obj/machinery/chem_dispenser/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>The volatile chemicals in this machine would destroy us. Aborting.</span>");
	return 0;
});

// swarmer.dm:307
rt.def("/obj/machinery/nuclearbomb/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This device's destruction would result in the extermination of everything in the area. Aborting.</span>");
	return 0;
});

// swarmer.dm:311
rt.def("/obj/machinery/dominator/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This device is attempting to corrupt our entire network; attempting to interact with it is too risky. Aborting.</span>");
	return 0;
});

// swarmer.dm:315
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Searching... sensor malfunction! Target lost. Aborting.</span>");
	return 0;
});

// swarmer.dm:319
rt.def("/obj/effect/rune/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Searching... sensor malfunction! Target lost. Aborting.</span>");
	return 0;
});

// swarmer.dm:323
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Destroying this object would cause a chain reaction. Aborting.</span>");
	return 0;
});

// swarmer.dm:327
rt.def("/obj/structure/cable/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>");
	return 0;
});

// swarmer.dm:331
rt.def("/obj/machinery/portable_atmospherics/canister/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>An inhospitable area may be created as a result of destroying this object. Aborting.</span>");
	return 0;
});

// swarmer.dm:335
rt.def("/obj/machinery/telecomms/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This communications relay should be preserved, it will be a useful resource to our masters in the future. Aborting.</span>");
	return 0;
});

// swarmer.dm:339
rt.def("/obj/machinery/message_server/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This communications relay should be preserved, it will be a useful resource to our masters in the future. Aborting.</span>");
	return 0;
});

// swarmer.dm:343
rt.def("/obj/machinery/deepfryer/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This kitchen appliance should be preserved, it will make delicious unhealthy snacks for our masters in the future. Aborting.</span>");
	return 0;
});

// swarmer.dm:347
rt.def("/obj/machinery/power/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>");
	return 0;
});

// swarmer.dm:351
rt.def("/obj/machinery/gateway/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This bluespace source will be important to us later. Aborting.</span>");
	return 0;
});

// swarmer.dm:355
rt.def("/turf/closed/wall/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	let _T: Value = null;
	let isonshuttle: Value = (rt.istype(this.loc, T("/area/shuttle")) ? 1 : 0);
	for (_T of each(range(1, this), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/space")) || !isonshuttle && (rt.istype(_T.loc, T("/area/shuttle")) || rt.istype(_T.loc, T("/area/space"))) || isonshuttle && !rt.istype(_T.loc, T("/area/shuttle"))) {
			to_chat(S, "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>");
			S.target = null;
			return 1;
		}
	}
	return (yield* parent_proc());
}, true);

// swarmer.dm:364
rt.def("/obj/structure/window/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	let _T: Value = null;
	let isonshuttle: Value = (rt.istype(get_area(this), T("/area/shuttle")) ? 1 : 0);
	for (_T of each(range(1, this), T("/turf"))) {
		if (rt.istype(_T, T("/turf/open/space")) || !isonshuttle && (rt.istype(_T.loc, T("/area/shuttle")) || rt.istype(_T.loc, T("/area/space"))) || isonshuttle && !rt.istype(_T.loc, T("/area/shuttle"))) {
			to_chat(S, "<span class='warning'>Destroying this object has the potential to cause a hull breach. Aborting.</span>");
			S.target = null;
			return 1;
		}
	}
	return (yield* parent_proc());
}, true);

// swarmer.dm:373
rt.def("/obj/item/stack/cable_coil/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This object does not contain enough materials to work with.</span>");
	return 0;
});

// swarmer.dm:377
rt.def("/obj/machinery/porta_turret/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>Attempting to dismantle this machine would result in an immediate counterattack. Aborting.</span>");
	return 0;
});

// swarmer.dm:381
rt.def("/mob/living/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* S.DisperseTarget(this);
	return 1;
}, true);

// swarmer.dm:385
rt.def("/mob/living/simple_animal/slime/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This biological resource is somehow resisting our bluespace transceiver. Aborting.</span>");
	return 0;
});

rt.type(10763, "/obj/machinery/droneDispenser/swarmer", "/obj/machinery/droneDispenser", {
	name: "swarmer fabricator",
	desc: "An alien machine of unknown origin. It whirs and hums with green-blue light, the air above it shimmering.",
	icon: rt.rsc("icons/obj/machines/gateway.dmi"),
	icon_state: "toffcenter",
	icon_off: "toffcenter",
	icon_on: "toffcenter",
	icon_recharging: "toffcenter",
	icon_creating: "offcenter",
	metal_cost: 0,
	glass_cost: 0,
	cooldownTime: 300,
	maximum_idle: 0,
	dispense_type: rt.typePath("/obj/item/device/unactivated_swarmer"),
	begin_create_message: "hums softly as an interface appears above it, scrolling by at unreadable speed.",
	end_create_message: "materializes a strange shell, which drops to the ground.",
	recharging_text: "Its lights are slowly increasing in brightness.",
	work_sound: rt.rsc("sound/effects/empulse.ogg"),
	create_sound: rt.rsc("sound/effects/phasein.ogg"),
	break_sound: rt.rsc("sound/effects/empulse.ogg"),
	break_message: "slowly falls dark, lights stuttering.",
});

// swarmer.dm:389
rt.def("/obj/machinery/droneDispenser/swarmer/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This object is receiving unactivated swarmer shells to help us. Aborting.</span>");
	return 0;
});

// swarmer.dm:393
rt.def("/obj/structure/destructible/clockwork/massive/celestial_gateway/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This object is multiplying existing resources. Aborting.</span>");
	return 0;
});

// swarmer.dm:397
rt.def("/obj/structure/lattice/catwalk/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	let A: Value = null, C: Value = null;
	f.dot = (yield* parent_proc());
	let here: Value = rt.getStep(f, this, 0);
	for (A of each(here.contents)) {
		if (rt.istype((C = A), T("/obj/structure/cable"))) {
			to_chat(S, "<span class='warning'>Disrupting the power grid would bring no benefit to us. Aborting.</span>");
			return 0;
		}
	}
	return f.dot;
}, true);

// swarmer.dm:407
rt.def("/obj/item/device/unactivated_swarmer/proc/swarmer_act", function* swarmer_act(f: Frame, S: Value) {
	yield* parent_proc();
	return 0;
}, true);

rt.type(10771, "/obj/machinery/hydroponics/soil", "/obj/machinery/hydroponics", {
	name: "soil",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "soil",
	density: 0,
	use_power: 0,
	unwrenchable: 0,
});

// swarmer.dm:414
rt.def("/obj/machinery/hydroponics/soil/proc/swarmer_act", function swarmer_act(f: Frame, S: Value) {
	to_chat(S, "<span class='warning'>This object does not contain enough materials to work with.</span>");
	return 0;
});

// swarmer.dm:420
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Fabricate", function* Fabricate(f: Frame, fabrication_object: Value, fabrication_cost: Value) {
	fabrication_cost ??= 0;
	if (!isturf(this.loc)) {
		to_chat(this, "<span class='warning'>This is not a suitable location for fabrication. We need more space.</span>");
	}
	if (this.resources >= fabrication_cost) {
		this.resources -= fabrication_cost;
	} else {
		to_chat(this, "<span class='warning'>You do not have the necessary resources to fabricate this object.</span>");
		return 0;
	}
	return (yield* new_(fabrication_object, this.loc));
}, true);

// swarmer.dm:430
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/Integrate", function* Integrate(f: Frame, target: Value) {
	let I: Value = null, S: Value = null;
	let resource_gain: Value = target.IntegrateAmount();
	if (this.resources + resource_gain > this.max_resources) {
		to_chat(this, "<span class='warning'>We cannot hold more materials!</span>");
		return 1;
	}
	if (resource_gain) {
		this.resources += resource_gain;
		yield* this.do_attack_animation(target);
		this.changeNext_move(8);
		(I = (yield* new_(T("/obj/effect/temp_visual/swarmer/integrate"), rt.getStep(f, target, 0)))).pixel_x = target.pixel_x;
		I.pixel_y = target.pixel_y;
		I.pixel_z = target.pixel_z;
		if (rt.istype(target, T("/obj/item/stack"))) {
			yield* (S = target).use(1);
			if (S.amount) {
				return 1;
			}
		}
		yield* qdel(target);
		return 1;
	} else {
		to_chat(this, fmt("<span class='warning'>％！ is incompatible with our internal matter recycler.</span>", [target]));
	}
	return 0;
}, true);

// swarmer.dm:455
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DisIntegrate", function* DisIntegrate(f: Frame, target: Value) {
	yield* new_(T("/obj/effect/temp_visual/swarmer/disintegration"), rt.getStep(f, target, 0));
	yield* this.do_attack_animation(target);
	this.changeNext_move(8);
	yield* target.ex_act(3);
	return f.dot;
}, true);

// swarmer.dm:462
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DisperseTarget", function* DisperseTarget(f: Frame, target: Value) {
	let F: Value = null, S: Value = null;
	if (target == this) {
		return f.dot;
	}
	if (this.z != ZLEVEL_STATION && this.z != ZLEVEL_LAVALAND) {
		to_chat(this, "<span class='warning'>Our bluespace transceiver cannot locate a viable bluespace link, our teleportation abilities are useless in this area.</span>");
		return f.dot;
	}
	to_chat(this, "<span class='info'>Attempting to remove this being from our presence.</span>");
	if (!(yield* do_mob(this, target, 30))) {
		return f.dot;
	}
	if (this.z === ZLEVEL_STATION) {
		F = (yield* find_safe_turf({ zlevels: ZLEVEL_STATION, extended_safety_checks: 1 }));
	} else if (this.z === ZLEVEL_LAVALAND) {
		F = (yield* find_safe_turf({ zlevels: ZLEVEL_LAVALAND, extended_safety_checks: 1 }));
	}
	if (!F) {
		return f.dot;
	}
	let H: Value = target;
	if (rt.istype(target, T("/mob/living/carbon/human")) && !H.handcuffed) {
		H.handcuffed = (yield* new_(T("/obj/item/weapon/restraints/handcuffs/energy/used"), H));
		yield* H.update_handcuffed();
		add_logs(this, H, "handcuffed");
	}
	yield* (S = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(4, 0, rt.getStep(f, target, 0));
	yield* S.start();
	playsound(this, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
	yield* do_teleport(target, F, 0);
	return f.dot;
}, true);

// swarmer.dm:498
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/DismantleMachine", function* DismantleMachine(f: Frame, target: Value) {
	let D: Value = null, M: Value = null, I: Value = null, N: Value = null, C: Value = null;
	yield* this.do_attack_animation(target);
	to_chat(this, "<span class='info'>We begin to dismantle this machine. We will need to be uninterrupted.</span>");
	(D = (yield* new_(T("/obj/effect/temp_visual/swarmer/dismantle"), rt.getStep(f, target, 0)))).pixel_x = target.pixel_x;
	D.pixel_y = target.pixel_y;
	D.pixel_z = target.pixel_z;
	if (!(yield* do_mob(this, target, 100))) return f.dot;
	to_chat(this, "<span class='info'>Dismantling complete.</span>");
	(M = (yield* new_(T("/obj/item/stack/sheet/metal"), target.loc))).amount = 5;
	for (I of each(target.component_parts, T("/obj/item"))) {
		I.loc = M.loc;
	}
	(N = (yield* new_(T("/obj/effect/temp_visual/swarmer/disintegration"), rt.getStep(f, target, 0)))).pixel_x = target.pixel_x;
	N.pixel_y = target.pixel_y;
	N.pixel_z = target.pixel_z;
	yield* target.dropContents();
	if (rt.istype(target, T("/obj/machinery/computer"))) {
		if ((C = target).circuit) {
			C.circuit.loc = M.loc;
		}
	}
	yield* qdel(target);
	return f.dot;
}, true);

rt.type(11530, "/obj/effect/temp_visual/swarmer/disintegration", "/obj/effect/temp_visual/swarmer", {
	icon_state: "disintegrate",
	duration: 10,
});

// swarmer.dm:531
rt.def("/obj/effect/temp_visual/swarmer/disintegration/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	playsound(this.loc, "sparks", 100, 1);
	return f.dot;
}, true);

// swarmer.dm:557
rt.def("/obj/structure/swarmer/proc/Initialize", function Initialize(f: Frame, mapload: Value) {
	parent_proc();
	this.set_light(this.lon_range);
	return f.dot;
}, false);

// swarmer.dm:561
rt.def("/obj/structure/swarmer/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 80, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// swarmer.dm:568
rt.def("/obj/structure/swarmer/proc/emp_act", function* emp_act(f: Frame) {
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12468, "/obj/structure/swarmer/trap", "/obj/structure/swarmer", {
	name: "swarmer trap",
	desc: "A quickly assembled trap that electrifies living beings and overwhelms machine sensors. Will not retain its form if damaged enough.",
	icon_state: "trap",
	obj_integrity: 10,
	max_integrity: 10,
	density: 0,
});

// swarmer.dm:579
rt.def("/obj/structure/swarmer/trap/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	if (rt.istype(AM, T("/mob/living"))) {
		if (!rt.istype((L = AM), T("/mob/living/simple_animal/hostile/swarmer"))) {
			playsound(this.loc, rt.rsc("sound/effects/snap.ogg"), 50, 1, -1);
			yield* L.electrocute_act(0, this, 1, 1, 1);
			if (rt.istype(L, T("/mob/living/silicon/robot"))) {
				yield* L.Knockdown(100);
			}
			yield* qdel(this);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// swarmer.dm:593
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateTrap", function* CreateTrap(f: Frame) {
	if (rt.locateIn(f, T("/obj/structure/swarmer/trap"), this.loc)) {
		to_chat(this, "<span class='warning'>There is already a trap here. Aborting.</span>");
		return f.dot;
	}
	yield* this.Fabricate(T("/obj/structure/swarmer/trap"), 5);
	return f.dot;
}, true, { verb: { name: "Create trap", category: "Swarmer", desc: "Creates a simple trap that will non-lethally electrocute anything that steps on it. Costs 5 resources" } });

// swarmer.dm:603
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateBarricade", function* CreateBarricade(f: Frame) {
	if (rt.locateIn(f, T("/obj/structure/swarmer/blockade"), this.loc)) {
		to_chat(this, "<span class='warning'>There is already a blockade here. Aborting.</span>");
		return f.dot;
	}
	if (this.resources < 5) {
		to_chat(this, "<span class='warning'>We do not have the resources for this!</span>");
		return f.dot;
	}
	if (!(yield* do_mob(this, this, 10))) return f.dot;
	yield* this.Fabricate(T("/obj/structure/swarmer/blockade"), 5);
	return f.dot;
}, true, { verb: { name: "Create barricade", category: "Swarmer", desc: "Creates a barricade that will stop anything but swarmers and disabler beams from passing through." } });

rt.type(12469, "/obj/structure/swarmer/blockade", "/obj/structure/swarmer", {
	light_range: 1,
	name: "swarmer blockade",
	desc: "A quickly assembled energy blockade. Will not retain its form if damaged enough, but disabler beams and swarmers pass right through.",
	icon_state: "barricade",
	obj_integrity: 50,
	max_integrity: 50,
});

// swarmer.dm:622
rt.def("/obj/structure/swarmer/blockade/proc/CanPass", function CanPass(f: Frame, O: Value) {
	if (rt.istype(O, T("/mob/living/simple_animal/hostile/swarmer"))) {
		return 1;
	}
	if (!rt.istype(O, T("/obj/item/projectile/beam/disabler"))) return f.dot;
	return 1;
});

// swarmer.dm:631
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/CreateSwarmer", function* CreateSwarmer(f: Frame) {
	let createtype: Value = null;
	to_chat(this, "<span class='info'>We are attempting to replicate ourselves. We will need to stand still until the process is complete.</span>");
	if (this.resources < 50) {
		to_chat(this, "<span class='warning'>We do not have the resources for this!</span>");
		return f.dot;
	}
	if (!isturf(this.loc)) {
		to_chat(this, "<span class='warning'>This is not a suitable location for replicating ourselves. We need more room.</span>");
		return f.dot;
	}
	if (!(yield* do_mob(this, this, 100))) return f.dot;
	if (!((createtype = this.SwarmerTypeToCreate()) && (yield* this.Fabricate(createtype, 50)))) return f.dot;
	playsound(this.loc, rt.rsc("sound/items/poster_being_created.ogg"), 50, 1, -1);
	return f.dot;
}, true, { verb: { name: "Replicate", category: "Swarmer", desc: "Creates a shell for a new swarmer. Swarmers will self activate." } });

// swarmer.dm:645
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/SwarmerTypeToCreate", function SwarmerTypeToCreate(f: Frame) {
	return T("/obj/item/device/unactivated_swarmer");
});

// swarmer.dm:652
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/RepairSelf", function* RepairSelf(f: Frame) {
	if (!isturf(this.loc)) {
		return f.dot;
	}
	to_chat(this, "<span class='info'>Attempting to repair damage to our body, stand by...</span>");
	if (!(yield* do_mob(this, this, 100))) return f.dot;
	yield* this.adjustHealth(-100);
	to_chat(this, "<span class='info'>We successfully repaired ourselves.</span>");
	return f.dot;
}, true, { verb: { name: "Self Repair", category: "Swarmer", desc: "Attempts to repair damage to our body. You will have to remain motionless until repairs are complete." } });

// swarmer.dm:660
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/ToggleLight", function ToggleLight(f: Frame) {
	if (!this.light_range) {
		this.set_light(3);
	} else {
		this.set_light(0);
	}
	return f.dot;
});

// swarmer.dm:666
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/swarmer_chat", function swarmer_chat(f: Frame, msg: Value) {
	let M: Value = null, link: Value = null;
	let rendered: Value = `<B>Swarm communication - ${this}</b> ${this.say_quote(msg, this.get_spans())}`;
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (rt.istype(M, T("/mob/living/simple_animal/hostile/swarmer"))) {
			to_chat(M, rendered);
		}
		if (rt.istype(M, T("/mob/dead/observer"))) {
			link = fmt("<a href=?src=＃;follow=＃>(F)</a>", [M, this]);
			to_chat(M, `${link} ${rendered}`);
		}
	}
	return f.dot;
});

// swarmer.dm:675
rt.def("/mob/living/simple_animal/hostile/swarmer/proc/ContactSwarmers", function* ContactSwarmers(f: Frame) {
	let message: Value = null;
	if (!(message = (yield* g.op(f, "Prompt", [2], [null, "Swarmer contact", "Announce to other swarmers", this, null])))) return f.dot;
	this.swarmer_chat(message);
	return f.dot;
}, true);
