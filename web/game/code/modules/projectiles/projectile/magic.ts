// Based on /tg/station's code/modules/projectiles/projectile/magic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(8904, "/obj/item/projectile/magic/death", "/obj/item/projectile/magic", {
	name: "bolt of death",
	icon_state: "pulse1_bl",
});

// magic.dm:15
rt.def("/obj/item/projectile/magic/death/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	if (!ismob(target)) return f.dot;
	yield* (M = target).death(0);
	return f.dot;
}, true);

rt.type(8905, "/obj/item/projectile/magic/resurrection", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of resurrection",
	icon_state: "ion",
});

// magic.dm:28
rt.def("/obj/item/projectile/magic/resurrection/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let C: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	if (target.hellbound) {
		return f.dot;
	}
	if (rt.istype(target, T("/mob/living/carbon"))) {
		yield* (C = target).regenerate_limbs();
		yield* C.regenerate_organs();
	}
	if (yield* target.revive({ full_heal: 1 })) {
		yield* target.grab_ghost({ force: 1 });
		to_chat(target, "<span class='notice'>You rise with a start, you're alive!!!</span>");
	} else {
		if (target.stat == 2) return f.dot;
		to_chat(target, "<span class='notice'>You feel great!</span>");
	}
	return f.dot;
}, true);

rt.type(8906, "/obj/item/projectile/magic/teleport", "/obj/item/projectile/magic", {
	inner_tele_radius: 0,
	outer_tele_radius: 6,
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of teleportation",
	icon_state: "bluespace",
});

// magic.dm:52
rt.def("/obj/item/projectile/magic/teleport/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let stuff: Value = null, smoke: Value = null;
	f.dot = (yield* parent_proc());
	let teleammount: Value = 0;
	let teleloc: Value = target;
	if (!isturf(target)) {
		teleloc = target.loc;
	}
	for (stuff of each(teleloc, T("/atom/movable"))) {
		if (!stuff.anchored && stuff.loc) {
			if (yield* do_teleport(stuff, stuff, 10)) {
				teleammount++;
				yield* (smoke = (yield* new_(T("/datum/effect_system/smoke_spread")))).set_up(max(round(4 - teleammount), 0), stuff.loc);
				yield* smoke.start();
			}
		}
	}
	return f.dot;
}, true);

rt.type(8907, "/obj/item/projectile/magic/door", "/obj/item/projectile/magic", {
	door_types: null,
	damage: 0,
	damage_type: "oxy",
	nodamage: 1,
	name: "bolt of door creation",
	icon_state: "energy",
});

// magic.dm:71
rt.def("/obj/item/projectile/magic/door/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.door_types = list(T("/obj/structure/mineral_door/wood"), T("/obj/structure/mineral_door/iron"), T("/obj/structure/mineral_door/silver"), T("/obj/structure/mineral_door/gold"), T("/obj/structure/mineral_door/uranium"), T("/obj/structure/mineral_door/sandstone"), T("/obj/structure/mineral_door/transparent/plasma"), T("/obj/structure/mineral_door/transparent/diamond"));
	return f.dot;
});

// magic.dm:77
rt.def("/obj/item/projectile/magic/door/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let _T: Value = null;
	f.dot = (yield* parent_proc());
	if (rt.istype(target, T("/obj/machinery/door"))) {
		yield* this.OpenDoor(target);
	} else {
		if (!(rt.istype((_T = rt.getStep(f, target, 0)), T("/turf/closed")) && !rt.istype(_T, T("/turf/closed/indestructible")))) return f.dot;
		yield* this.CreateDoor(_T);
	}
	return f.dot;
}, true);

// magic.dm:86
rt.def("/obj/item/projectile/magic/door/proc/CreateDoor", function* CreateDoor(f: Frame, _T: Value) {
	let door_type: Value = pick(this.door_types);
	let D: Value = (yield* new_(door_type, _T));
	yield* _T.ChangeTurf(T("/turf/open/floor/plating"));
	yield* D.Open();
	return f.dot;
}, true);

// magic.dm:92
rt.def("/obj/item/projectile/magic/door/proc/OpenDoor", function* OpenDoor(f: Frame, D: Value) {
	let A: Value = null;
	if (rt.istype(D, T("/obj/machinery/door/airlock"))) {
		(A = D).locked = 0;
	}
	yield* D.open();
	return f.dot;
}, true);

rt.type(8908, "/obj/item/projectile/magic/change", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	name: "bolt of change",
	icon_state: "ice_1",
});

// magic.dm:105
rt.def("/obj/item/projectile/magic/change/proc/on_hit", function* on_hit(f: Frame, change: Value) {
	f.dot = (yield* parent_proc());
	yield* wabbajack(change);
	yield* qdel(this);
	return f.dot;
}, true);

// magic.dm:110
rt.def("/proc/wabbajack", function* wabbajack(f: Frame, M: Value) {
	let Robot: Value = null, W: Value = null, new_mob: Value = null, randomize: Value = null, robot: Value = null, path: Value = null, Robot_4: Value = null, path_3: Value = null, beast: Value = null, animal: Value = null, A: Value = null, H: Value = null, all_species: Value = null, speciestype: Value = null, S: Value = null, W_3: Value = null;
	let $e: any;
	if (!rt.istype(M, T("/mob/living")) || M.stat == 2 || M.notransform || rt.bitAnd(4096, M.status_flags)) {
		return f.dot;
	}
	M.notransform = 1;
	M.canmove = 0;
	M.icon = null;
	M.cut_overlays();
	M.invisibility = INVISIBILITY_ABSTRACT;
	let contents: Value = (yield* M.contents.Copy());
	if (rt.istype(M, T("/mob/living/silicon/robot"))) {
		if ((Robot = M).mmi) {
			yield* qdel(Robot.mmi);
		}
		Robot.notify_ai(NEW_BORG);
	} else {
		for (W of each(contents, T("/obj/item"))) {
			if (!(yield* M.dropItemToGround(W))) {
				yield* qdel(W);
			}
		}
	}
	const subject = (randomize = pick("monkey", "robot", "slime", "xeno", "humanoid", "animal"));
	if (subject === "monkey") {
		new_mob = (yield* new_(T("/mob/living/carbon/monkey"), M.loc));
	} else if (subject === "robot") {
		const subject_2 = (robot = pick("cyborg", "syndiborg", "drone"));
		if (subject_2 === "cyborg") {
			new_mob = (yield* new_(T("/mob/living/silicon/robot"), M.loc));
		} else if (subject_2 === "syndiborg") {
			if (prob(50)) {
				path = T("/mob/living/silicon/robot/syndicate");
			} else {
				path = T("/mob/living/silicon/robot/syndicate/medical");
			}
			new_mob = (yield* new_(path, M.loc));
		} else if (subject_2 === "drone") {
			new_mob = (yield* new_(T("/mob/living/simple_animal/drone/polymorphed"), M.loc));
		}
		if (rt.istype(new_mob, T("/mob/living/silicon"))) {
			new_mob.gender = M.gender;
			new_mob.invisibility = 0;
			new_mob.job = "Cyborg";
			yield* (Robot_4 = new_mob).mmi.transfer_identity(M);
			yield* Robot_4.clear_inherent_laws(0);
			yield* Robot_4.clear_zeroth_law(0, 0);
			Robot_4.connected_ai = null;
		}
	} else if (subject === "slime") {
		new_mob = (yield* new_(T("/mob/living/simple_animal/slime/random"), M.loc));
	} else if (subject === "xeno") {
		if (prob(50)) {
			new_mob = (yield* new_(T("/mob/living/carbon/alien/humanoid/hunter"), M.loc));
		} else {
			new_mob = (yield* new_(T("/mob/living/carbon/alien/humanoid/sentinel"), M.loc));
		}
	} else if (subject === "animal") {
		if (prob(50)) {
			const subject_2 = (beast = pick("carp", "bear", "mushroom", "statue", "bat", "goat", "killertomato", "spiderbase", "spiderhunter", "blobbernaut", "magicarp", "chaosmagicarp", "watcher", "goliath", "headcrab", "morph", "stickman", "stickdog", "lesserdragon"));
			if (subject_2 === "carp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp");
			} else if (subject_2 === "bear") {
				path_3 = T("/mob/living/simple_animal/hostile/bear");
			} else if (subject_2 === "mushroom") {
				path_3 = T("/mob/living/simple_animal/hostile/mushroom");
			} else if (subject_2 === "statue") {
				path_3 = T("/mob/living/simple_animal/hostile/statue");
			} else if (subject_2 === "bat") {
				path_3 = T("/mob/living/simple_animal/hostile/retaliate/bat");
			} else if (subject_2 === "goat") {
				path_3 = T("/mob/living/simple_animal/hostile/retaliate/goat");
			} else if (subject_2 === "killertomato") {
				path_3 = T("/mob/living/simple_animal/hostile/killertomato");
			} else if (subject_2 === "spiderbase") {
				path_3 = T("/mob/living/simple_animal/hostile/poison/giant_spider");
			} else if (subject_2 === "spiderhunter") {
				path_3 = T("/mob/living/simple_animal/hostile/poison/giant_spider/hunter");
			} else if (subject_2 === "blobbernaut") {
				path_3 = T("/mob/living/simple_animal/hostile/blob/blobbernaut/independent");
			} else if (subject_2 === "magicarp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp/ranged");
			} else if (subject_2 === "chaosmagicarp") {
				path_3 = T("/mob/living/simple_animal/hostile/carp/ranged/chaos");
			} else if (subject_2 === "watcher") {
				path_3 = T("/mob/living/simple_animal/hostile/asteroid/basilisk/watcher");
			} else if (subject_2 === "goliath") {
				path_3 = T("/mob/living/simple_animal/hostile/asteroid/goliath/beast");
			} else if (subject_2 === "headcrab") {
				path_3 = T("/mob/living/simple_animal/hostile/headcrab");
			} else if (subject_2 === "morph") {
				path_3 = T("/mob/living/simple_animal/hostile/morph");
			} else if (subject_2 === "stickman") {
				path_3 = T("/mob/living/simple_animal/hostile/stickman");
			} else if (subject_2 === "stickdog") {
				path_3 = T("/mob/living/simple_animal/hostile/stickman/dog");
			} else if (subject_2 === "lesserdragon") {
				path_3 = T("/mob/living/simple_animal/hostile/megafauna/dragon/lesser");
			}
		} else {
			const subject_2 = (animal = pick("parrot", "corgi", "crab", "pug", "cat", "mouse", "chicken", "cow", "lizard", "chick", "fox", "butterfly", "cak"));
			if (subject_2 === "parrot") {
				path_3 = T("/mob/living/simple_animal/parrot");
			} else if (subject_2 === "corgi") {
				path_3 = T("/mob/living/simple_animal/pet/dog/corgi");
			} else if (subject_2 === "crab") {
				path_3 = T("/mob/living/simple_animal/crab");
			} else if (subject_2 === "pug") {
				path_3 = T("/mob/living/simple_animal/pet/dog/pug");
			} else if (subject_2 === "cat") {
				path_3 = T("/mob/living/simple_animal/pet/cat");
			} else if (subject_2 === "mouse") {
				path_3 = T("/mob/living/simple_animal/mouse");
			} else if (subject_2 === "chicken") {
				path_3 = T("/mob/living/simple_animal/chicken");
			} else if (subject_2 === "cow") {
				path_3 = T("/mob/living/simple_animal/cow");
			} else if (subject_2 === "lizard") {
				path_3 = T("/mob/living/simple_animal/hostile/lizard");
			} else if (subject_2 === "fox") {
				path_3 = T("/mob/living/simple_animal/pet/fox");
			} else if (subject_2 === "butterfly") {
				path_3 = T("/mob/living/simple_animal/butterfly");
			} else if (subject_2 === "cak") {
				path_3 = T("/mob/living/simple_animal/pet/cat/cak");
			} else if (subject_2 === "chick") {
				path_3 = T("/mob/living/simple_animal/chick");
			}
		}
		new_mob = (yield* new_(path_3, M.loc));
	} else if (subject === "humanoid") {
		new_mob = (yield* new_(T("/mob/living/carbon/human"), M.loc));
		yield* (A = (yield* new_(T("/datum/preferences")))).copy_to(new_mob, { icon_updates: 0 });
		H = new_mob;
		if (prob(50)) {
			all_species = list();
			for (speciestype of each(typesof(T("/datum/species")) - T("/datum/species"))) {
				if (!(S = (yield* new_(speciestype))).dangerous_existence) {
					all_species += speciestype;
				}
			}
			yield* H.set_species(pick(all_species), { icon_update: 0 });
		}
		yield* H.update_body();
		yield* H.update_hair();
		yield* H.update_body_parts();
		yield* H.dna.update_dna_identity();
	}
	if (!new_mob) {
		return f.dot;
	}
	yield* new_mob.grant_language(T("/datum/language/common"));
	if (!new_mob.secondary_flags) {
		new_mob.secondary_flags = list();
	}
	rt.setAt(new_mob.secondary_flags, "omnitongue", 1);
	new_mob.logging = M.logging;
	for (W_3 of each(contents, T("/obj/item"))) {
		yield* new_mob.equip_to_appropriate_slot(W_3);
	}
	M.log_message(`<font color='orange'>became ${new_mob.real_name}.</font>`, "Attack log");
	new_mob.a_intent = "harm";
	yield* M.wabbajack_act(new_mob);
	to_chat(new_mob, `<span class='warning'>Your form morphs into that of a ${randomize}.</span>`);
	to_chat(new_mob, rt.index(GLOB.config.policies, "polymorph"));
	yield* qdel(M);
	return new_mob;
}, true);

rt.type(8909, "/obj/item/projectile/magic/animate", "/obj/item/projectile/magic", {
	damage: 0,
	damage_type: "fire",
	nodamage: 1,
	name: "bolt of animation",
	icon_state: "red_1",
});

// magic.dm:293
rt.def("/obj/item/projectile/magic/animate/proc/on_hit", function* on_hit(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* f.args[0].animate_atom_living(this.firer);
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "blocked"] });

// magic.dm:297
rt.def("/atom/proc/animate_atom_living", function* animate_atom_living(f: Frame, owner: Value) {
	let _P: Value = null, L: Value = null, S: Value = null, O: Value = null, C: Value = null;
	if ((rt.istype(this, T("/obj/item")) || rt.istype(this, T("/obj/structure"))) && !is_type_in_list(this, GLOB.protected_objects)) {
		if (rt.istype(this, T("/obj/structure/statue/petrified"))) {
			if ((_P = this).petrified_mob) {
				L = _P.petrified_mob;
				(S = (yield* new_(T("/mob/living/simple_animal/hostile/statue"), _P.loc, owner))).name = `statue of ${L.name}`;
				if (owner) {
					S.faction = list(fmt("＃", [owner]));
				}
				S.icon = _P.icon;
				S.icon_state = _P.icon_state;
				S.copy_overlays(_P, 1);
				S.color = _P.color;
				S.atom_colours = (yield* _P.atom_colours.Copy());
				if (L.mind) {
					yield* L.mind.transfer_to(S);
					if (owner) {
						to_chat(S, `<span class='userdanger'>You are an animate statue. You cannot move when monitored, but are nearly invincible and deadly when unobserved! Do not harm ${owner}, your creator.</span>`);
					}
				}
				_P.loc = S;
				return f.dot;
			}
		} else if (rt.istype((O = this), T("/obj/item/weapon/gun"))) {
			yield* new_(T("/mob/living/simple_animal/hostile/mimic/copy/ranged"), this.loc, this, owner);
		} else {
			yield* new_(T("/mob/living/simple_animal/hostile/mimic/copy"), this.loc, this, owner);
		}
	} else {
		if (!rt.istype(this, T("/mob/living/simple_animal/hostile/mimic/copy"))) return f.dot;
		C = this;
		if (!owner) return f.dot;
		C.ChangeOwner(owner);
	}
	return f.dot;
}, true);

rt.type(8912, "/obj/item/projectile/magic/aoe", "/obj/item/projectile/magic", {
	proxdet: 1,
	damage: 0,
	name: "Area Bolt",
	desc: "What the fuck does this do?!",
});

// magic.dm:356
rt.def("/obj/item/projectile/magic/aoe/proc/Range", function* Range(f: Frame) {
	let L: Value = null;
	if (this.proxdet) {
		for (L of each(range(1, rt.getStep(f, this, 0)), T("/mob/living"))) {
			if (L.stat != 2 && L != this.firer) {
				return (yield* this.Bump(L, 1));
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8913, "/obj/item/projectile/magic/aoe/lightning", "/obj/item/projectile/magic/aoe", {
	tesla_power: 20000,
	tesla_range: 15,
	tesla_boom: 0,
	chain: null,
	caster: null,
	damage: 15,
	damage_type: "fire",
	nodamage: 0,
	speed: 0.3,
	flag: "magic",
	name: "lightning bolt",
	icon_state: "tesla_projectile",
});

// magic.dm:378
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/fire", function* fire(f: Frame, setAngle: Value) {
	if (this.caster) {
		this.chain = (yield* this.caster.Beam(this, { icon_state: `lightning${rand(1, 12)}`, time: 1e+31, maxdistance: 1e+31 }));
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// magic.dm:382
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	yield* tesla_zap(this, this.tesla_range, this.tesla_power, this.tesla_boom);
	yield* qdel(this);
	return f.dot;
}, true);

// magic.dm:387
rt.def("/obj/item/projectile/magic/aoe/lightning/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chain);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(8914, "/obj/item/projectile/magic/aoe/fireball", "/obj/item/projectile/magic/aoe", {
	exp_heavy: 0,
	exp_light: 2,
	exp_flash: 3,
	exp_fire: 2,
	damage: 10,
	damage_type: "brute",
	nodamage: 0,
	name: "bolt of fireball",
	icon_state: "fireball",
});

// magic.dm:404
rt.def("/obj/item/projectile/magic/aoe/fireball/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	let _T: Value = rt.getStep(f, target, 0);
	yield* explosion(_T, -1, this.exp_heavy, this.exp_light, this.exp_flash, 0, { flame_range: this.exp_fire });
	if (!ismob(target)) return f.dot;
	yield* (M = target).take_overall_damage(0, 10);
	return f.dot;
}, true);

rt.type(8915, "/obj/item/projectile/magic/aoe/fireball/infernal", "/obj/item/projectile/magic/aoe/fireball", {
	exp_heavy: -1,
	exp_light: -1,
	exp_flash: 4,
	exp_fire: 5,
	name: "infernal fireball",
});

// magic.dm:419
rt.def("/obj/item/projectile/magic/aoe/fireball/infernal/proc/on_hit", function* on_hit(f: Frame, target: Value) {
	f.dot = (yield* parent_proc());
	let _T: Value = rt.getStep(f, target, 0);
	let i: Value = 0;
	while (i < 50) {
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/explosion"), _T, -1, this.exp_heavy, this.exp_light, this.exp_flash, 0, 0, this.exp_fire)), i);
		i += 10;
	}
	return f.dot;
}, true);
