// Based on /tg/station's code/game/turfs/simulated/walls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4414, "/turf/closed/wall", "/turf/closed", {
	hardness: 40,
	slicing_duration: 100,
	sheet_amount: 2,
	sheet_type: rt.typePath("/obj/item/stack/sheet/metal"),
	girder_type: rt.typePath("/obj/structure/girder"),
	name: "wall",
	desc: "A huge chunk of metal used to separate rooms.",
	icon: rt.rsc("icons/turf/walls/wall.dmi"),
	icon_state: "wall",
	explosion_block: 1,
	thermal_conductivity: 0,
	heat_capacity: 312500,
	canSmoothWith: null,
	smooth: 1,
});

// walls.dm:17
rt.def("/turf/closed/wall/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/brass"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/turf/closed/wall/clockwork"));
	return f.dot;
});

// walls.dm:32
rt.def("/turf/closed/wall/proc/handle_ricochet", function handle_ricochet(f: Frame, _P: Value) {
	let p_turf: Value = rt.getStep(f, _P, 0);
	let face_direction: Value = rt.getDir(f, this, p_turf);
	let face_angle: Value = dir2angle(face_direction);
	let incidence_s: Value = get_angle_of_incidence(face_angle, _P.Angle);
	let new_angle: Value = face_angle + incidence_s;
	let new_angle_s: Value = new_angle;
	while (new_angle_s > 180) {
		new_angle_s -= 360;
	}
	while (new_angle_s < -180) {
		new_angle_s += 360;
	}
	_P.Angle = new_angle_s;
	return 1;
});

// walls.dm:47
rt.def("/turf/closed/wall/proc/dismantle_wall", function* dismantle_wall(f: Frame, devastated: Value, explode: Value) {
	let newgirder: Value = null, O: Value = null, _P: Value = null;
	devastated ??= 0;
	explode ??= 0;
	if (devastated) {
		yield* this.devastate_wall();
	} else {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		if (newgirder = (yield* this.break_wall())) {
			this.transfer_fingerprints_to(newgirder);
		}
	}
	for (O of each(this.contents, T("/obj"))) {
		if (rt.istype(O, T("/obj/structure/sign/poster"))) {
			yield* (_P = O).roll_and_drop(this);
		}
	}
	yield* this.ChangeTurf(T("/turf/open/floor/plating"));
	return f.dot;
}, true);

// walls.dm:62
rt.def("/turf/closed/wall/proc/break_wall", function* break_wall(f: Frame) {
	yield* new_(this.sheet_type, this, this.sheet_amount);
	return (yield* new_(this.girder_type, this));
}, true);

// walls.dm:66
rt.def("/turf/closed/wall/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* new_(this.sheet_type, this, this.sheet_amount);
	if (!this.girder_type) return f.dot;
	yield* new_(T("/obj/item/stack/sheet/metal"), this);
	return f.dot;
}, true);

// walls.dm:71
rt.def("/turf/closed/wall/proc/ex_act", function* ex_act(f: Frame, severity: Value, target: Value) {
	let NT: Value = null;
	if (target == this) {
		yield* this.dismantle_wall(1, 1);
		return f.dot;
	}
	if (severity === 1) {
		yield* (NT = (yield* this.ChangeTurf(this.baseturf))).contents_explosion(severity, target);
		return f.dot;
	} else if (severity === 2) {
		if (prob(50)) {
			yield* this.dismantle_wall(0, 1);
		} else {
			yield* this.dismantle_wall(1, 1);
		}
	} else if (severity === 3) {
		if (prob(this.hardness)) {
			yield* this.dismantle_wall(0, 1);
		}
	}
	if (this.density) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// walls.dm:93
rt.def("/turf/closed/wall/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!prob(50)) return f.dot;
	yield* this.dismantle_wall();
	return f.dot;
}, true);

// walls.dm:97
rt.def("/turf/closed/wall/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	yield* M.do_attack_animation(this);
	if (M.damtype === "brute") {
		playsound(this, rt.rsc("sound/weapons/punch4.ogg"), 50, 1);
		this.visible_message(`<span class='danger'>${M.name} has hit ${this}!</span>`, null, null, 3);
		if (prob(this.hardness + M.force) && M.force > 20) {
			yield* this.dismantle_wall(1);
			playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
		}
	} else if (M.damtype === "fire") {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
	} else if (M.damtype === "tox") {
		playsound(this, rt.rsc("sound/effects/spray2.ogg"), 100, 1);
		return 0;
	}
	return f.dot;
}, true);

// walls.dm:112
rt.def("/turf/closed/wall/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	user.changeNext_move(8);
	return (yield* this.attack_hand(user));
}, true);

// walls.dm:117
rt.def("/turf/closed/wall/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	M.changeNext_move(8);
	yield* M.do_attack_animation(this);
	if (!(M.environment_smash >= 2)) return f.dot;
	playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
	yield* this.dismantle_wall(1);
	return f.dot;
}, true);

// walls.dm:125
rt.def("/turf/closed/wall/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	yield* parent_proc(user, 1);
	if (prob(this.hardness)) {
		playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 100, 1);
		yield* user.say(pick(";RAAAAAAAARGH!", ";HNNNNNNNNNGGGGGGH!", ";GWAAAAAAAARRRHHH!", "NNNNNNNNGGGGGGGGHH!", ";AAAAAAARRRGH!"));
		yield* this.dismantle_wall(1);
	} else {
		playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		to_chat(user, "<span class='notice'>You punch the wall.</span>");
	}
	return 1;
}, true);

// walls.dm:136
rt.def("/turf/closed/wall/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	to_chat(user, "<span class='notice'>You push the wall but nothing happens!</span>");
	playsound(this, rt.rsc("sound/weapons/genhit.ogg"), 25, 1);
	yield* this.add_fingerprint(user);
	yield* parent_proc();
	return f.dot;
}, true);

// walls.dm:144
rt.def("/turf/closed/wall/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	user.changeNext_move(8);
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	if (!isturf(user.loc)) {
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (this.thermite) {
		if (W.is_hot()) {
			yield* this.thermitemelt(user);
			return f.dot;
		}
	}
	let _T: Value = user.loc;
	if (!((yield* this.try_wallmount(W, user, _T)) || (yield* this.try_decon(W, user, _T)) || (yield* this.try_destroy(W, user, _T)))) return f.dot;
	return f.dot;
}, true);

// walls.dm:170
rt.def("/turf/closed/wall/proc/try_wallmount", function* try_wallmount(f: Frame, W: Value, user: Value, _T: Value) {
	let F: Value = null;
	if (rt.istype(W, T("/obj/item/wallframe"))) {
		if (yield* (F = W).try_build(this, user)) {
			yield* F.attach(this, user);
		}
		return 1;
	} else if (rt.istype(W, T("/obj/item/weapon/poster"))) {
		yield* this.place_poster(W, user);
		return 1;
	}
	return 0;
}, true);

// walls.dm:184
rt.def("/turf/closed/wall/proc/try_decon", function* try_decon(f: Frame, W: Value, user: Value, _T: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			to_chat(user, "<span class='notice'>You begin slicing through the outer plating...</span>");
			playsound(this, W.usesound, 100, 1);
			if (yield* do_after(user, this.slicing_duration * W.toolspeed, { target: this })) {
				if (!rt.istype(this, T("/turf/closed/wall")) || !user || !WT || !WT.isOn() || !_T) {
					return 1;
				}
				if (user.loc == _T && user.get_active_held_item() == WT) {
					to_chat(user, "<span class='notice'>You remove the outer plating.</span>");
					yield* this.dismantle_wall();
					return 1;
				}
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/gun/energy/plasmacutter"))) {
		to_chat(user, "<span class='notice'>You begin slicing through the outer plating...</span>");
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		if (yield* do_after(user, this.slicing_duration * W.toolspeed, { target: this })) {
			if (!rt.istype(this, T("/turf/closed/wall")) || !user || !W || !_T) {
				return 1;
			}
			if (user.loc == _T && user.get_active_held_item() == W) {
				to_chat(user, "<span class='notice'>You remove the outer plating.</span>");
				yield* this.dismantle_wall();
				this.visible_message(`The wall was sliced apart by ${user}!`, "<span class='italics'>You hear metal being sliced apart.</span>");
				return 1;
			}
		}
	}
	return 0;
}, true);

// walls.dm:211
rt.def("/turf/closed/wall/proc/try_destroy", function* try_destroy(f: Frame, W: Value, user: Value, _T: Value) {
	let D: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/pickaxe/drill/jackhammer"))) {
		D = W;
		if (!rt.istype(this, T("/turf/closed/wall")) || !user || !W || !_T) {
			return 1;
		}
		if (user.loc == _T && user.get_active_held_item() == W) {
			D.playDigSound();
			yield* this.dismantle_wall();
			this.visible_message(`<span class='warning'>${user} smashes through the ${this.name} with the ${W.name}!</span>`, "<span class='italics'>You hear the grinding of metal.</span>");
			return 1;
		}
	}
	return 0;
}, true);

// walls.dm:224
rt.def("/turf/closed/wall/proc/thermitemelt", function* thermitemelt(f: Frame, user: Value) {
	let O: Value = null, burning_time: Value = null, F: Value = null;
	this.cut_overlays();
	(O = (yield* new_(T("/obj/effect/overlay"), this))).name = "thermite";
	O.desc = "Looks hot.";
	O.icon = rt.rsc("icons/effects/fire.dmi");
	O.icon_state = "2";
	O.anchored = 1;
	O.opacity = 1;
	O.density = 1;
	O.layer = 5;
	playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
	if (this.thermite >= 50) {
		burning_time = max(100, 300 - this.thermite);
		yield* (F = (yield* this.ChangeTurf(T("/turf/open/floor/plating")))).burn_tile();
		F.add_hiddenprint(user);
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), O)), burning_time, 8);
	} else {
		this.thermite = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), O)), 50, 8);
	}
	return f.dot;
}, true);

// walls.dm:248
rt.def("/turf/closed/wall/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (current_size >= STAGE_FIVE) {
		if (prob(50)) {
			yield* this.dismantle_wall();
		}
		return f.dot;
	}
	if (current_size != STAGE_FOUR) return f.dot;
	if (!prob(30)) return f.dot;
	yield* this.dismantle_wall();
	return f.dot;
}, true);

// walls.dm:257
rt.def("/turf/closed/wall/proc/narsie_act", function* narsie_act(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 20;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.ChangeTurf(T("/turf/closed/wall/mineral/cult"));
	return f.dot;
}, true, { args: ["force", "ignore_mobs", "probability"] });

// walls.dm:262
rt.def("/turf/closed/wall/proc/ratvar_act", function* ratvar_act(f: Frame, force: Value, ignore_mobs: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.ChangeTurf(T("/turf/closed/wall/clockwork"));
	return f.dot;
}, true);

// walls.dm:270
rt.def("/turf/closed/wall/proc/acid_act", function* acid_act(f: Frame) {
	if (this.explosion_block >= 2) {
		f.args[0] = min(f.args[0], 50);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["acidpwr", "acid_volume"] });

// walls.dm:275
rt.def("/turf/closed/wall/proc/acid_melt", function* acid_melt(f: Frame) {
	yield* this.dismantle_wall(1);
	return f.dot;
}, true);

// walls.dm:278
rt.def("/turf/closed/wall/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 40, "cost", 26]);
	}
	return 0;
});

// walls.dm:284
rt.def("/turf/closed/wall/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	if (passed_mode === RCD_DECONSTRUCT) {
		to_chat(user, "<span class='notice'>You deconstruct the wall.</span>");
		yield* this.ChangeTurf(T("/turf/open/floor/plating"));
		return 1;
	}
	return 0;
}, true);
