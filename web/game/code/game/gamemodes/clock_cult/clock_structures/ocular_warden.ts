// Based on /tg/station's code/game/gamemodes/clock_cult/clock_structures/ocular_warden.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12162, "/obj/structure/destructible/clockwork/ocular_warden", "/obj/structure/destructible/clockwork", {
	damage_per_tick: 2.7,
	sight_range: 3,
	target: null,
	idle_messages: null,
	clockwork_desc: "A fragile turret which will automatically attack nearby unrestrained non-Servants that can see it.",
	unanchored_icon: "ocular_warden_unwrenched",
	construction_value: 15,
	name: "ocular warden",
	desc: "A large brass eye with tendrils trailing below it and a wide red iris.",
	icon_state: "ocular_warden",
	obj_integrity: 25,
	max_integrity: 25,
	layer: 4.25,
	break_message: "<span class='warning'>The warden's eye gives a glare of utter hate before falling dark!</span>",
	debris: null,
	resistance_flags: 35,
});

// ocular_warden.dm:13
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.idle_messages = list(" sulkily glares around.", " lazily drifts from side to side.", " looks around for something to burn.", " slowly turns in circles.");

	this.debris = rt.alist(f, [T("/obj/item/clockwork/component/belligerent_eye/blind_eye"), 1]);
	return f.dot;
});

// ocular_warden.dm:21
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/Initialize", function Initialize(f: Frame) {
	f.dot = parent_proc();
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSfastprocess.processing += this;
	return f.dot;
});

// ocular_warden.dm:25
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return (yield* parent_proc());
}, true);

// ocular_warden.dm:29
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/examine", function examine(f: Frame, user: Value) {
	let $1: any;
	parent_proc();
	let $0: any = user;
	if (this.target) {
		$1 = `<b>It's fixated on ${this.target}!</b>`;
	} else {
		$1 = "Its gaze is wandering aimlessly.";
	}
	to_chat($0, `<span class='brass'>${$1}</span>`);
	return f.dot;
}, false);

// ocular_warden.dm:37
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	let W: Value = null;
	if (this.anchored) {
		if (this.obj_integrity <= this.max_integrity * 0.25) {
			if (!silent) {
				to_chat(user, `<span class='warning'>${this} is too damaged to unsecure!</span>`);
			}
			return 1;
		}
	} else {
		for (W of each(orange(3, this), T("/obj/structure/destructible/clockwork/ocular_warden"))) {
			if (!silent) {
				to_chat(user, "<span class='neovgre'>You sense another ocular warden too near this location. Activating this one this close would cause them to fight.</span>");
			}
			return 1;
		}
	}
	return 2;
});

// ocular_warden.dm:49
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/ratvar_act", function ratvar_act(f: Frame) {
	parent_proc();
	if (GLOB.ratvar_awakens) {
		this.damage_per_tick = 10;
		this.sight_range = 6;
	} else {
		this.damage_per_tick = rt.initial(f, this, "damage_per_tick");
		this.sight_range = rt.initial(f, this, "sight_range");
	}
	return f.dot;
});

// ocular_warden.dm:58
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/process", function* process(f: Frame) {
	let L: Value = null, R: Value = null, M: Value = null;
	let $0: any, $1: any, $2: any;
	if (!this.anchored) {
		this.lose_target();
		return f.dot;
	}
	let validtargets: Value = (yield* this.acquire_nearby_targets());
	if (this.target) {
		if (!rt.isIn(f, this.target, validtargets)) {
			this.lose_target();
		} else {
			if (rt.istype(this.target, T("/mob/living"))) {
				if (!(L = this.target).null_rod_check()) {
					if (rt.istype(L, T("/mob/living/simple_animal/revenant"))) {
						if ((R = L).revealed) {
							R.unreveal_time += 2;
						} else {
							R.reveal(10);
						}
					}
					if (prob(50)) {
						L.playsound_local(null, rt.rsc("sound/machines/clockcult/ocularwarden-dot1.ogg"), 50, 1);
					} else {
						L.playsound_local(null, rt.rsc("sound/machines/clockcult/ocularwarden-dot2.ogg"), 50, 1);
					}
					$0 = L;
					if (!iscultist(L)) {
						$1 = this.damage_per_tick;
					} else {
						$1 = this.damage_per_tick * 2;
					}
					yield* $0.adjustFireLoss($1 * this.get_efficiency_mod());
					if (GLOB.ratvar_awakens && L) {
						yield* L.adjust_fire_stacks(this.damage_per_tick);
						yield* L.IgniteMob();
					}
				}
			} else if (rt.istype(this.target, T("/obj/mecha"))) {
				yield* (M = this.target).take_damage(this.damage_per_tick * this.get_efficiency_mod(), "fire", "melee", 1, rt.getDir(f, this, M));
			}
			yield* new_(T("/obj/effect/temp_visual/ratvar/ocular_warden"), rt.getStep(f, this.target, 0));
			yield* this.setDir(rt.getDir(f, rt.getStep(f, this, 0), rt.getStep(f, this.target, 0)));
		}
	}
	if (this.target) return f.dot;
	if (rt.len(f, validtargets)) {
		this.target = pick(validtargets);
		playsound(this, rt.rsc("sound/machines/clockcult/ocularwarden-target.ogg"), 50, 1);
		this.visible_message(`<span class='warning'>${this} swivels to face ${this.target}!</span>`);
		if (rt.istype(this.target, T("/mob/living"))) {
			$0 = (L = this.target);
			$1 = this;
			if (GLOB.ratvar_awakens) {
				$2 = "melts you alive";
			} else {
				$2 = "burns you";
			}
			to_chat($0, `<span class='heavy_brass'>"I SEE YOU!"</span>\n<span class='userdanger'>${$1}'s gaze ${$2}!</span>`);
		} else if (rt.istype(this.target, T("/obj/mecha"))) {
			to_chat((M = this.target).occupant, "<span class='heavy_brass'>\"I SEE YOU!\"</span>");
		}
	} else {
		if (!prob(0.5)) return f.dot;
		if (prob(50)) {
			this.visible_message(`<span class='notice'>${this}${pick(this.idle_messages)}</span>`);
		} else {
			yield* this.setDir(pick(GLOB.cardinal));
		}
	}
	return f.dot;
}, true, { waitfor: false });

// ocular_warden.dm:108
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/acquire_nearby_targets", function* acquire_nearby_targets(f: Frame) {
	let L: Value = null, B: Value = null, BI: Value = null, H: Value = null, N: Value = null, M: Value = null;
	f.dot = list();
	for (L of each(viewers(this.sight_range, this), T("/mob/living"))) {
		if (B = L.bible_check()) {
			if (!rt.bitAnd(B.resistance_flags, 8)) {
				to_chat(L, `<span class='warning'>Your ${B.name} bursts into flames!</span>`);
			}
			BI = null;
			for (BI of each(L.GetAllContents(), T("/obj/item/weapon/storage/book/bible"))) {
				if (!rt.bitAnd(BI.resistance_flags, 8)) {
					yield* BI.fire_act();
				}
			}
			continue;
		}
		if (is_servant_of_ratvar(L) || rt.bitAnd(L.disabilities, 1) || L.null_rod_check()) {
			continue;
		}
		if (L.stat || L.restrained() || L.buckled || L.lying || rt.istype(L.buckled, T("/obj/structure/destructible/clockwork/geis_binding"))) {
			continue;
		}
		if (rt.istype(L, T("/mob/living/simple_animal/hostile"))) {
			if (rt.istype((H = L), T("/mob/living/simple_animal/hostile/megafauna")) || !H.mind && H.AIStatus == AI_OFF) {
				continue;
			}
			if (rt.isIn(f, "ratvar", H.faction) || rt.isIn(f, "neutral", H.faction)) {
				continue;
			}
		} else if (!L.mind) {
			continue;
		}
		f.dot += L;
	}
	for (N of each(GLOB.mechas_list)) {
		if (get_dist((M = N), this) <= this.sight_range && M.occupant && !is_servant_of_ratvar(M.occupant) && rt.isIn(f, M, view(this.sight_range, this))) {
			f.dot += M;
		}
	}
	return f.dot;
}, true);

// ocular_warden.dm:137
rt.def("/obj/structure/destructible/clockwork/ocular_warden/proc/lose_target", function lose_target(f: Frame) {
	if (!this.target) {
		return 0;
	}
	this.target = null;
	this.visible_message(`<span class='warning'>${this} settles and seems almost disappointed.</span>`);
	return 1;
});
