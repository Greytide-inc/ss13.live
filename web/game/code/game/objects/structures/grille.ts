// Based on /tg/station's code/game/objects/structures/grille.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12230, "/obj/structure/grille", "/obj/structure", {
	rods_type: rt.typePath("/obj/item/stack/rods"),
	rods_amount: 2,
	rods_broken: 1,
	grille_type: null,
	broken_type: rt.typePath("/obj/structure/grille/broken"),
	anchored: 1,
	flags: 64,
	pressure_resistance: 506.625,
	desc: "A flimsy lattice of metal rods, with screws to secure it to the floor.",
	name: "grille",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "grille",
	density: 1,
	layer: 2.9,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
	integrity_failure: 20,
});

// grille.dm:11
rt.def("/obj/structure/grille/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 50, "bullet", 70, "laser", 70, "energy", 100, "bomb", 10, "bio", 100, "rad", 100, "fire", 0, "acid", 0]);
	return f.dot;
});

// grille.dm:22
rt.def("/obj/structure/grille/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 20, "cost", 5]);
	} else if (the_rcd.mode === RCD_WINDOWGRILLE) {
		if (the_rcd.window_type == T("/obj/structure/window/reinforced/fulltile")) {
			return rt.alist(f, ["mode", RCD_WINDOWGRILLE, "delay", 40, "cost", 12]);
		}
		return rt.alist(f, ["mode", RCD_WINDOWGRILLE, "delay", 20, "cost", 8]);
	}
	return 0;
});

// grille.dm:32
rt.def("/obj/structure/grille/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	let WD: Value = null;
	if (passed_mode === RCD_DECONSTRUCT) {
		to_chat(user, "<span class='notice'>You deconstruct the grille.</span>");
		yield* qdel(this);
		return 1;
	} else if (passed_mode === RCD_WINDOWGRILLE) {
		if (rt.locateIn(f, T("/obj/structure/window"), this.loc)) {
			return 0;
		}
		to_chat(user, "<span class='notice'>You construct the window.</span>");
		(WD = (yield* new_(the_rcd.window_type, this.loc))).anchored = 1;
		return 1;
	}
	return 0;
}, true);

// grille.dm:48
rt.def("/obj/structure/grille/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (this.broken) {
		yield* new_(T("/obj/structure/grille/ratvar/broken"), this.loc);
	} else {
		yield* new_(T("/obj/structure/grille/ratvar"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// grille.dm:54
rt.def("/obj/structure/grille/proc/Bumped", function* Bumped(f: Frame, user: Value) {
	let AM: Value = null;
	if (!ismob(user)) return f.dot;
	let tile_density: Value = 0;
	for (AM of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
		if (AM == this) {
			continue;
		}
		if (AM.density && AM.layer >= this.layer) {
			tile_density = 1;
			break;
		}
	}
	if (tile_density) return f.dot;
	yield* this.shock(user, 70);
	return f.dot;
}, true);

// grille.dm:67
rt.def("/obj/structure/grille/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	yield* this.attack_hand(user);
	return f.dot;
}, true);

// grille.dm:73
rt.def("/obj/structure/grille/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	if (user.a_intent != "harm") return f.dot;
	if (!(yield* this.shock(user, 70))) {
		yield* parent_proc(user, 1);
	}
	return 1;
}, true);

// grille.dm:79
rt.def("/obj/structure/grille/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	yield* user.do_attack_animation(this, "kick");
	user.visible_message(`<span class='warning'>${user} hits ${this}.</span>`, null, null, 3);
	if (yield* this.shock(user, 70)) return f.dot;
	yield* this.take_damage(rand(5, 10), "brute", "melee", 1);
	return f.dot;
}, true);

// grille.dm:86
rt.def("/obj/structure/grille/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* user.do_attack_animation(this);
	user.changeNext_move(8);
	user.visible_message(`<span class='warning'>${user} mangles ${this}.</span>`, null, null, 3);
	if (yield* this.shock(user, 70)) return f.dot;
	yield* this.take_damage(20, "brute", "melee", 1);
	return f.dot;
}, true);

// grille.dm:94
rt.def("/obj/structure/grille/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(4)) {
		return 1;
	} else {
		if (rt.istype(mover, T("/obj/item/projectile")) && this.density) {
			return prob(30);
		}
		return (!this.density ? 1 : 0);
	}
});

// grille.dm:104
rt.def("/obj/structure/grille/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = (!this.density ? 1 : 0);
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(4));
	return f.dot;
});

// grille.dm:110
rt.def("/obj/structure/grille/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let R: Value = null, ST: Value = null, dir_to_set: Value = null, WINDOW: Value = null, WD: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	user.changeNext_move(8);
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (!(yield* this.shock(user, 100))) {
			playsound(this.loc, W.usesound, 100, 1);
			yield* this.deconstruct();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && (isturf(this.loc) || this.anchored)) {
		if (!(yield* this.shock(user, 90))) {
			playsound(this.loc, W.usesound, 100, 1);
			this.anchored = (!this.anchored ? 1 : 0);
			$0 = user;
			$1 = user;
			if (this.anchored) {

				$2 = "fastens";
			} else {
				$2 = "unfastens";
			}
			$1 = `<span class='notice'>${$1} ${$2} ${this}.</span>`;
			if (this.anchored) {
				$2 = `fasten ${this} to`;
			} else {
				$2 = `unfasten ${this} from`;
			}
			$0.visible_message($1, `<span class='notice'>You ${$2} the floor.</span>`);
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/stack/rods")) && this.broken) {
		R = W;
		if (!(yield* this.shock(user, 90))) {
			user.visible_message(`<span class='notice'>${user} rebuilds the broken grille.</span>`, "<span class='notice'>You rebuild the broken grille.</span>");
			yield* new_(this.grille_type, this.loc);
			yield* R.use(1);
			yield* qdel(this);
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/stack/sheet/rglass")) || rt.istype(W, T("/obj/item/stack/sheet/glass"))) {
		if (!this.broken) {
			if ((ST = W).get_amount() < 2) {
				to_chat(user, "<span class='warning'>You need at least two sheets of glass for that!</span>");
				return f.dot;
			}
			dir_to_set = 10;
			if (!this.anchored) {
				to_chat(user, `<span class='warning'>${this} needs to be fastened to the floor first!</span>`);
				return f.dot;
			}
			for (WINDOW of each(this.loc, T("/obj/structure/window"))) {
				to_chat(user, "<span class='warning'>There is already a window there!</span>");
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You start placing the window...</span>");
			if (yield* do_after(user, 20, { target: this })) {
				if (!this.loc || !this.anchored) {
					return f.dot;
				}
				WINDOW = null;
				for (WINDOW of each(this.loc, T("/obj/structure/window"))) {
					return f.dot;
				}
				if (rt.istype(W, T("/obj/item/stack/sheet/rglass"))) {
					WD = (yield* new_(T("/obj/structure/window/reinforced/fulltile"), this.loc));
				} else {
					WD = (yield* new_(T("/obj/structure/window/fulltile"), this.loc));
				}
				yield* WD.setDir(dir_to_set);
				WD.ini_dir = dir_to_set;
				WD.anchored = 0;
				WD.state = 0;
				yield* ST.use(2);
				to_chat(user, `<span class='notice'>You place ${WD} on ${this}.</span>`);
			}
			return f.dot;
		}
	} else {
		if (!(rt.istype(W, T("/obj/item/weapon/shard")) || !(yield* this.shock(user, 70)))) return f.dot;
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// grille.dm:171
rt.def("/obj/structure/grille/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/effects/grillehit.ogg"), 80, 1);
		} else {
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 80, 1);
	}
	return f.dot;
});

// grille.dm:182
rt.def("/obj/structure/grille/proc/deconstruct", function* deconstruct(f: Frame) {
	let R: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (!this.loc) {
		return f.dot;
	}
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		this.transfer_fingerprints_to((R = (yield* new_(this.rods_type, this.loc, this.rods_amount))));
		yield* qdel(this);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

// grille.dm:191
rt.def("/obj/structure/grille/proc/obj_break", function* obj_break(f: Frame) {
	let R: Value = null;
	if (!(!this.broken && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	yield* new_(this.broken_type, this.loc);
	this.transfer_fingerprints_to((R = (yield* new_(this.rods_type, this.loc, this.rods_broken))));
	yield* qdel(this);
	return f.dot;
}, true);

// grille.dm:202
rt.def("/obj/structure/grille/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let C: Value = null, s: Value = null;
	if (!this.anchored || this.broken) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	if (!(get_dist(this, user) <= 1)) {
		return 0;
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (C = _T.get_cable_node()) {
		if (yield* electrocute_mob(user, C, this, 1, 1)) {
			yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(3, 1, this);
			yield* s.start();
			return 1;
		} else {
			return 0;
		}
	}
	return 0;
}, true);

// grille.dm:221
rt.def("/obj/structure/grille/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!this.broken) {
		if (exposed_temperature > 1773.15) {
			yield* this.take_damage(1, "fire", 0, 0);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// grille.dm:227
rt.def("/obj/structure/grille/proc/hitby", function* hitby(f: Frame, AM: Value) {
	let _T: Value = null, C: Value = null;
	if (rt.istype(AM, T("/obj"))) {
		if (prob(50) && this.anchored && !this.broken) {
			_T = rt.getStep(f, this, 0);
			if (C = _T.get_cable_node()) {
				yield* playsound(this.loc, rt.rsc("sound/magic/lightningshock.ogg"), 100, 1, { extrarange: 5 });
				yield* tesla_zap(this, 3, C.powernet.avail * 0.01);
				C.powernet.load += C.powernet.avail * 0.0375;
			}
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(12231, "/obj/structure/grille/ratvar", "/obj/structure/grille", {
	icon_state: "ratvargrille",
	name: "cog grille",
	desc: "A strangely-shaped grille.",
	broken_type: rt.typePath("/obj/structure/grille/ratvar/broken"),
});

// grille.dm:258
rt.def("/obj/structure/grille/ratvar/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.broken) {
		yield* new_(T("/obj/effect/temp_visual/ratvar/grille/broken"), rt.getStep(f, this, 0));
	} else {
		yield* new_(T("/obj/effect/temp_visual/ratvar/grille"), rt.getStep(f, this, 0));
		yield* new_(T("/obj/effect/temp_visual/ratvar/beam/grille"), rt.getStep(f, this, 0));
	}
	return f.dot;
}, true);

// grille.dm:266
rt.def("/obj/structure/grille/ratvar/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* this.take_damage(rand(1, 3), "brute");
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);
