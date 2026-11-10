// Based on /tg/station's code/game/gamemodes/blob/theblob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12139, "/obj/structure/blob", "/obj/structure", {
	point_return: 0,
	health_regen: 2,
	pulse_timestamp: 0,
	heal_timestamp: 0,
	brute_resist: 0.5,
	fire_resist: 1,
	atmosblock: 0,
	overmind: null,
	light_range: 2,
	anchored: 1,
	name: "blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	desc: "A thick wall of writhing tendrils.",
	density: 0,
	opacity: 0,
	layer: 3.7,
	obj_integrity: 30,
	max_integrity: 30,
	armor: null,
});

// theblob.dm:14
rt.def("/obj/structure/blob/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 80, "acid", 70]);
	return f.dot;
});

// theblob.dm:25
rt.def("/obj/structure/blob/proc/Initialize", function* Initialize(f: Frame) {
	let Ablob: Value = null;
	if ((Ablob = get_area(this.loc)).blob_allowed) {
		GLOB.blobs_legit += this;
	}
	GLOB.blobs += this;
	yield* this.setDir(pick(GLOB.cardinal));
	yield* this.update_icon();
	f.dot = (yield* parent_proc());
	yield* this.ConsumeTile();
	if (!this.atmosblock) return f.dot;
	this.CanAtmosPass = 0;
	this.air_update_turf(1);
	return f.dot;
}, true);

// theblob.dm:43
rt.def("/obj/structure/blob/proc/Destroy", function* Destroy(f: Frame) {
	if (this.atmosblock) {
		this.atmosblock = 0;
		this.air_update_turf(1);
	}
	GLOB.blobs_legit -= this;
	GLOB.blobs -= this;
	playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	return (yield* parent_proc());
}, true);

// theblob.dm:53
rt.def("/obj/structure/blob/proc/Adjacent", function Adjacent(f: Frame, neighbour: Value) {
	let A: Value = null, B: Value = null, C: Value = null;
	f.dot = parent_proc();
	if (!f.dot) return f.dot;
	let result: Value = 0;
	let direction: Value = rt.getDir(f, this, neighbour);
	let dirs: Value = rt.alist(f, [`${9}`, list(1, 8), `${5}`, list(1, 4), `${6}`, list(2, 4), `${10}`, list(2, 8)]);
	for (A of each(dirs)) {
		if (direction == text2num(A)) {
			B = null;
			for (B of each(rt.index(dirs, A))) {
				if (C = rt.locateIn(f, T("/obj/structure/blob"), rt.getStep(f, this, B))) {
					result++;
				}
			}
		}
	}
	f.dot -= result - 1;
	return f.dot;
}, false);

// theblob.dm:70
rt.def("/obj/structure/blob/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/atom/movable")) && mover.checkpass(8)) {
		return 1;
	}
	return 0;
});

// theblob.dm:78
rt.def("/obj/structure/blob/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, dir: Value, caller: Value) {
	f.dot = 0;
	if (!rt.istype(caller, T("/atom/movable"))) return f.dot;
	let mover: Value = caller;
	f.dot = (f.dot || mover.checkpass(8));
	return f.dot;
});

// theblob.dm:84
rt.def("/obj/structure/blob/proc/update_icon", function update_icon(f: Frame) {
	if (this.overmind) {
		this.add_atom_colour(this.overmind.blob_reagent_datum.color, 4);
	} else {
		this.remove_atom_colour(4);
	}
	return f.dot;
});

// theblob.dm:89
rt.def("/obj/structure/blob/proc/process", function* process(f: Frame) {
	yield* this.Life();
	return f.dot;
}, true, { waitfor: false });

// theblob.dm:95
rt.def("/obj/structure/blob/proc/Pulse_Area", function* Pulse_Area(f: Frame, pulsing_overmind: Value, claim_range: Value, pulse_range: Value, expand_range: Value) {
	let B: Value = null, L: Value = null, B_3: Value = null, distance: Value = null, expand_probablity: Value = null, can_expand: Value = null, newB: Value = null;
	pulsing_overmind ??= this.overmind;
	claim_range ??= 10;
	pulse_range ??= 3;
	expand_range ??= 2;
	yield* this.Be_Pulsed();
	let expanded: Value = 0;
	if (prob(70) && (yield* this.expand())) {
		expanded = 1;
	}
	let blobs_to_affect: Value = list();
	for (B of each(urange(claim_range, this, 1), T("/obj/structure/blob"))) {
		blobs_to_affect += B;
	}
	shuffle_inplace(blobs_to_affect);
	for (L of each(blobs_to_affect)) {
		if (!(B_3 = L).overmind && !rt.istype(B_3, T("/obj/structure/blob/core")) && prob(30)) {
			B_3.overmind = pulsing_overmind;
			yield* B_3.update_icon();
		}
		distance = get_dist(rt.getStep(f, this, 0), rt.getStep(f, B_3, 0));
		expand_probablity = max(20 - distance * 8, 1);
		if (B_3.Adjacent(this)) {
			expand_probablity = 20;
		}
		if (distance <= expand_range) {
			can_expand = 1;
			if (rt.len(f, blobs_to_affect) >= 120 && B_3.heal_timestamp > rt.worldTime(f)) {
				can_expand = 0;
			}
			if (can_expand && B_3.pulse_timestamp <= rt.worldTime(f) && prob(expand_probablity)) {
				if (newB = (yield* B_3.expand(null, null, (!expanded ? 1 : 0)))) {
					if (expanded) {
						yield* qdel(newB);
					}
					expanded = 1;
				}
			}
		}
		if (distance <= pulse_range) {
			yield* B_3.Be_Pulsed();
		}
	}
	return f.dot;
}, true);

// theblob.dm:126
rt.def("/obj/structure/blob/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	if (this.pulse_timestamp <= rt.worldTime(f)) {
		yield* this.ConsumeTile();
		if (this.heal_timestamp <= rt.worldTime(f)) {
			this.obj_integrity = min(this.max_integrity, this.obj_integrity + this.health_regen);
			this.heal_timestamp = rt.worldTime(f) + 20;
		}
		yield* this.update_icon();
		this.pulse_timestamp = rt.worldTime(f) + 10;
		return 1;
	}
	return 0;
}, true);

// theblob.dm:137
rt.def("/obj/structure/blob/proc/ConsumeTile", function* ConsumeTile(f: Frame) {
	let A: Value = null;
	for (A of each(this.loc, T("/atom"))) {
		yield* A.blob_act(this);
	}
	if (!rt.istype(this.loc, T("/turf/closed/wall"))) return f.dot;
	yield* this.loc.blob_act(this);
	return f.dot;
}, true);

// theblob.dm:143
rt.def("/obj/structure/blob/proc/blob_attack_animation", function* blob_attack_animation(f: Frame, A: Value, controller: Value) {
	let O: Value = null, BO: Value = null;
	yield* (O = (yield* new_(T("/obj/effect/temp_visual/blob"), this.loc))).setDir(this.dir);
	if (controller) {
		BO = controller;
		O.color = BO.blob_reagent_datum.color;
		O.alpha = 200;
	} else if (this.overmind) {
		O.color = this.overmind.blob_reagent_datum.color;
	}
	if (A) {
		yield* O.do_attack_animation(A);
	}
	return O;
}, true);

// theblob.dm:156
rt.def("/obj/structure/blob/proc/expand", function* expand(f: Frame, _T: Value, controller: Value, expand_reaction: Value) {
	let dirs: Value = null, i: Value = null, dirn: Value = null, A: Value = null, B: Value = null;
	let $e: any;
	expand_reaction ??= 1;
	if (!_T) {
		dirs = list(1, 2, 4, 8);
		rt.forRange(f, 0, 1, 4, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dirn = pick(dirs);
			yield* dirs.Remove(dirn);
			_T = rt.getStep(f, this, dirn);
			if (!rt.locateIn(f, T("/obj/structure/blob"), _T)) {
				break;
			}
			_T = null;
		}
		rt.endFor(f, 0);
	}
	if (!_T) {
		return 0;
	}
	let make_blob: Value = 1;
	if (rt.istype(_T, T("/turf/open/space")) && !rt.locateIn(f, T("/obj/structure/lattice"), _T) && prob(80)) {
		make_blob = 0;
		playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	}
	yield* this.ConsumeTile();
	if (!(yield* _T.CanPass(this, _T, 5))) {
		make_blob = 0;
		yield* _T.blob_act(this);
	}
	for (A of each(_T, T("/atom"))) {
		if (!(yield* A.CanPass(this, _T, 5))) {
			make_blob = 0;
		}
		yield* A.blob_act(this);
	}
	if (make_blob) {
		B = (yield* new_(T("/obj/structure/blob/normal"), this.loc));
		if (controller) {
			B.overmind = controller;
		} else {
			B.overmind = this.overmind;
		}
		B.density = 1;
		if (yield* _T.Enter(B, this)) {
			B.density = rt.initial(f, B, "density");
			B.loc = _T;
			yield* B.update_icon();
			if (B.overmind && expand_reaction) {
				yield* B.overmind.blob_reagent_datum.expand_reaction(this, B, _T, controller);
			}
			return B;
		} else {
			yield* this.blob_attack_animation(_T, controller);
			yield* _T.blob_act(this);
			yield* qdel(B);
			return null;
		}
	} else {
		yield* this.blob_attack_animation(_T, controller);
	}
	return null;
}, true);

// theblob.dm:207
rt.def("/obj/structure/blob/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!(severity > 0)) return f.dot;
	if (this.overmind) {
		yield* this.overmind.blob_reagent_datum.emp_reaction(this, severity);
	}
	if (!prob(100 - severity * 30)) return f.dot;
	yield* new_(T("/obj/effect/temp_visual/emp"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

// theblob.dm:214
rt.def("/obj/structure/blob/proc/tesla_act", function* tesla_act(f: Frame, power: Value) {
	yield* parent_proc();
	if (this.overmind) {
		if (this.overmind.blob_reagent_datum.tesla_reaction(this, power)) {
			yield* this.take_damage(power / 400, "fire", "energy");
		}
	} else {
		yield* this.take_damage(power / 400, "fire", "energy");
	}
	return f.dot;
}, true);

// theblob.dm:222
rt.def("/obj/structure/blob/proc/extinguish", function* extinguish(f: Frame) {
	yield* parent_proc();
	if (!this.overmind) return f.dot;
	yield* this.overmind.blob_reagent_datum.extinguish_reaction(this);
	return f.dot;
}, true);

// theblob.dm:230
rt.def("/obj/structure/blob/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/device/analyzer"))) {
		user.changeNext_move(8);
		to_chat(user, "<b>The analyzer beeps once, then reports:</b><br>");
		rt.op(f, "Output", [], [user, rt.rsc("sound/machines/ping.ogg")], false);
		this.chemeffectreport(user);
		this.typereport(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// theblob.dm:241
rt.def("/obj/structure/blob/proc/chemeffectreport", function chemeffectreport(f: Frame, user: Value) {
	if (this.overmind) {
		to_chat(user, `<b>Material: <font color="${this.overmind.blob_reagent_datum.color}">${this.overmind.blob_reagent_datum.name}</font><span class='notice'>.</span></b>`);
		to_chat(user, `<b>Material Effects:</b> <span class='notice'>${this.overmind.blob_reagent_datum.analyzerdescdamage}</span>`);
		to_chat(user, `<b>Material Properties:</b> <span class='notice'>${this.overmind.blob_reagent_datum.analyzerdesceffect}</span><br>`);
	} else {
		to_chat(user, "<b>No Material Detected!</b><br>");
	}
	return f.dot;
});

// theblob.dm:248
rt.def("/obj/structure/blob/proc/typereport", function typereport(f: Frame, user: Value) {
	to_chat(user, `<b>Blob Type:</b> <span class='notice'>${uppertext(rt.initial(f, this, "name"))}</span>`);
	to_chat(user, `<b>Health:</b> <span class='notice'>${this.obj_integrity}/${this.max_integrity}</span>`);
	to_chat(user, `<b>Effects:</b> <span class='notice'>${this.scannerreport()}</span>`);
	return f.dot;
});

// theblob.dm:253
rt.def("/obj/structure/blob/proc/attack_animal", function* attack_animal(f: Frame, M: Value) {
	if (rt.isIn(f, "blob", M.faction)) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// theblob.dm:258
rt.def("/obj/structure/blob/proc/play_attack_sound", function play_attack_sound(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		if (damage_amount) {
			playsound(this.loc, rt.rsc("sound/effects/attackblob.ogg"), 50, 1);
		} else {
			playsound(this, rt.rsc("sound/weapons/tap.ogg"), 50, 1);
		}
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	return f.dot;
});

// theblob.dm:268
rt.def("/obj/structure/blob/proc/run_obj_armor", function* run_obj_armor(f: Frame, damage_amount: Value, damage_type: Value, damage_flag: Value, attack_dir: Value) {
	damage_flag ??= 0;
	if (damage_type === "brute") {
		damage_amount *= this.brute_resist;
	} else if (damage_type === "fire") {
		damage_amount *= this.fire_resist;
	} else if (damage_type === "clone") {
	} else {
		return 0;
	}
	let armor_protection: Value = 0;
	if (damage_flag) {
		armor_protection = rt.index(this.armor, damage_flag);
	}
	damage_amount = round(damage_amount * (100 - armor_protection) * 0.01, 0.1);
	if (this.overmind && damage_flag) {
		damage_amount = (yield* this.overmind.blob_reagent_datum.damage_reaction(this, damage_amount, damage_type, damage_flag));
	}
	return damage_amount;
}, true);

// theblob.dm:285
rt.def("/obj/structure/blob/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.obj_integrity > 0)) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// theblob.dm:291
rt.def("/obj/structure/blob/proc/obj_destruction", function* obj_destruction(f: Frame, damage_flag: Value) {
	if (this.overmind) {
		yield* this.overmind.blob_reagent_datum.death_reaction(this, damage_flag);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// theblob.dm:295
rt.def("/obj/structure/blob/proc/change_to", function* change_to(f: Frame, type: Value, controller: Value) {
	if (!ispath(type)) {
		rt.throw_(f, (yield* new_(T("/exception"), "change_to(): invalid type for blob", "code/game/gamemodes/blob/theblob.dm", 296)));
		return f.dot;
	}
	let B: Value = (yield* new_(type, this.loc));
	if (controller) {
		B.overmind = controller;
	}
	B.creation_action();
	yield* B.update_icon();
	yield* B.setDir(this.dir);
	yield* qdel(this);
	return B;
}, true);

// theblob.dm:308
rt.def("/obj/structure/blob/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let hud_to_check: Value = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED);
	if (user.research_scanner || rt.index(hud_to_check.hudusers, user)) {
		to_chat(user, "<b>Your HUD displays an extensive report...</b><br>");
		this.chemeffectreport(user);
		this.typereport(user);
	} else {
		to_chat(user, `It seems to be made of ${this.get_chem_name()}.`);
	}
	return f.dot;
}, false);

// theblob.dm:318
rt.def("/obj/structure/blob/proc/scannerreport", function scannerreport(f: Frame) {
	return "A generic blob. Looks like someone forgot to override this proc, adminhelp this.";
});

// theblob.dm:322
rt.def("/obj/structure/blob/proc/get_chem_name", function get_chem_name(f: Frame) {
	if (this.overmind) {
		return this.overmind.blob_reagent_datum.name;
	}
	return "an unknown variant";
});

rt.type(12140, "/obj/structure/blob/normal", "/obj/structure/blob", {
	light_range: 0,
	health_regen: 1,
	brute_resist: 0.25,
	name: "normal blob",
	icon_state: "blob",
	obj_integrity: 21,
	max_integrity: 25,
});

// theblob.dm:335
rt.def("/obj/structure/blob/normal/proc/scannerreport", function scannerreport(f: Frame) {
	if (this.obj_integrity <= 15) {
		return "Currently weak to brute damage.";
	}
	return "N/A";
});

// theblob.dm:340
rt.def("/obj/structure/blob/normal/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.obj_integrity <= 15) {
		this.icon_state = "blob_damaged";
		this.name = "fragile blob";
		this.desc = "A thin lattice of slightly twitching tendrils.";
		this.brute_resist = 0.5;
	} else {
		this.icon_state = "blob";
		this.name = "blob";
		this.desc = "A thick wall of writhing tendrils.";
		this.brute_resist = 0.25;
	}
	return f.dot;
});
