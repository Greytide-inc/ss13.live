// Based on /tg/station's code/modules/mob/living/simple_animal/hostile/megafauna/hierophant.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


rt.type(5027, "/mob/living/simple_animal/hostile/megafauna/hierophant", "/mob/living/simple_animal/hostile/megafauna", {
	burst_range: 3,
	beam_range: 5,
	chaser_speed: 3,
	chaser_cooldown: 101,
	major_attack_cooldown: 60,
	arena_cooldown: 200,
	blinking: 0,
	spawned_beacon: null,
	timeout_time: 15,
	did_reset: 1,
	kill_phrases: null,
	target_phrases: null,
	move_to_delay: 10,
	ranged: 1,
	ranged_cooldown_time: 40,
	aggro_vision_range: 21,
	name: "hierophant",
	desc: "A massive metal club that hangs in the air as though waiting. It'll make you dance to its beat.",
	health: 2500,
	maxHealth: 2500,
	attacktext: "clubs",
	attack_sound: rt.rsc("sound/weapons/sonic_jackhammer.ogg"),
	icon_state: "hierophant",
	icon_living: "hierophant",
	friendly: "stares down",
	icon: rt.rsc("icons/mob/lavaland/hierophant_new.dmi"),
	faction: null,
	speak_emote: null,
	armour_penetration: 50,
	melee_damage_lower: 15,
	melee_damage_upper: 15,
	speed: 1,
	loot: null,
	wander: 0,
	medal_type: "Hierophant",
	score_type: "Hierophants Killed",
	del_on_death: 1,
	death_sound: rt.rsc("sound/magic/repulse.ogg"),
});

// hierophant.dm:49
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.kill_phrases = list("Wsyvgi sj irivkc xettih. Vitemvmrk...", "Irivkc wsyvgi jsyrh. Vitemvmrk...", "Jyip jsyrh. Egxmzexmrk vitemv gcgpiw...", "Kix fiex. Liepmrk...");
	this.target_phrases = list("Xevkix psgexih.", "Iriqc jsyrh.", "Eguymvih xevkix.");

	this.faction = list("boss");

	this.speak_emote = list("preaches");

	this.loot = list(T("/obj/item/weapon/hierophant_club"));
	return f.dot;
});

// hierophant.dm:79
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.internal = (yield* new_(T("/obj/item/device/gps/internal/hierophant"), this));
	this.spawned_beacon = (yield* new_(T("/obj/effect/hierophant"), this.loc));
	return f.dot;
}, true);

// hierophant.dm:84
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/spawn_crusher_loot", function* spawn_crusher_loot(f: Frame) {
	yield* new_(T("/obj/item/crusher_trophy/vortex_talisman"), rt.getStep(f, this.spawned_beacon, 0));
	return f.dot;
}, true);

// hierophant.dm:87
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Life", function* Life(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.spawned_beacon && !(!this.spawned_beacon || this.spawned_beacon.gc_destroyed) && !this.client)) return f.dot;
	if (this.target || this.loc == this.spawned_beacon.loc) {
		this.timeout_time = rt.initial(f, this, "timeout_time");
	} else {
		this.timeout_time--;
	}
	if (!(this.timeout_time <= 0 && !this.did_reset)) return f.dot;
	this.did_reset = 1;
	this.visible_message("<span class='hierophant_warning'>\"Vixyvrmrk xs fewi...\"</span>");
	yield* g.srcCall(f, "blink", this.spawned_beacon);
	yield* this.adjustHealth(min((this.health - this.maxHealth) * 0.5, -250));
	this.wander = 0;
	if (this.health > this.maxHealth * 0.9) {
		this.visible_message("<span class='hierophant'>\"Vitemvw gsqtpixi. Stivexmrk ex qebmqyq ijjmgmirgc.\"</span>");
	} else {
		this.visible_message("<span class='hierophant'>\"Vitemvw gsqtpixi. Stivexmsrep ijjmgmirgc gsqtvsqmwih.\"</span>");
	}
	return f.dot;
}, true, { waitfor: false });

// hierophant.dm:105
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/death", function* death(f: Frame) {
	if (this.health > 0 || this.stat == 2) {
		return f.dot;
	} else {
		this.stat = 2;
		this.blinking = 1;
		this.burst_range = 10;
		this.visible_message("<span class='hierophant'>\"Mrmxmexmrk wipj-hiwxvygx wiuyirgi...\"</span>");
		this.visible_message(`<span class='hierophant_warning'>${this} shrinks, releasing a massive burst of energy!</span>`);
		yield* this.burst(rt.getStep(f, this, 0));
		yield* parent_proc();
	}
	return f.dot;
}, true);

// hierophant.dm:117
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spawned_beacon);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// hierophant.dm:121
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/devour", function* devour(f: Frame, L: Value) {
	let W: Value = null;
	for (W of each(L, T("/obj/item"))) {
		if (!(yield* L.dropItemToGround(W))) {
			yield* qdel(W);
		}
	}
	this.visible_message(`<span class='hierophant_warning'>"${pick(this.kill_phrases)}"</span>`);
	this.visible_message(`<span class='hierophant_warning'>${this} annihilates ${L}!</span>`, `<span class='userdanger'>You annihilate ${L}, restoring your health!</span>`);
	yield* this.adjustHealth(-L.maxHealth * 0.5);
	yield* L.dust();
	return f.dot;
}, true);

// hierophant.dm:130
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/CanAttack", function CanAttack(f: Frame, the_target: Value) {
	f.dot = parent_proc();
	if (!rt.istype(the_target, T("/mob/living/simple_animal/hostile/asteroid/hivelordbrood"))) return f.dot;
	return 0;
}, false);

// hierophant.dm:135
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/GiveTarget", function* GiveTarget(f: Frame, new_target: Value) {
	let targets_the_same: Value = (new_target == this.target ? 1 : 0);
	f.dot = (yield* parent_proc());
	if (!(f.dot && this.target && !targets_the_same)) return f.dot;
	this.visible_message(`<span class='hierophant_warning'>"${pick(this.target_phrases)}"</span>`);
	if (!(this.spawned_beacon && this.loc == this.spawned_beacon.loc && this.did_reset)) return f.dot;
	yield* this.arena_trap(this);
	return f.dot;
}, true);

// hierophant.dm:143
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/adjustHealth", function* adjustHealth(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!(this && f.dot > 0 && !this.blinking)) return f.dot;
	this.wander = 1;
	this.did_reset = 0;
	return f.dot;
}, true, { args: ["amount", "updating_health", "forced"] });

// hierophant.dm:149
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/AttackingTarget", function* AttackingTarget(f: Frame) {
	if (this.blinking) return f.dot;
	if (this.target && rt.istype(this.target, T("/mob/living"))) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/melee_blast"), rt.getStep(f, this.target, 0));
	}
	return (yield* parent_proc());
}, true);

// hierophant.dm:155
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/DestroySurroundings", function* DestroySurroundings(f: Frame) {
	if (this.blinking) return f.dot;
	yield* parent_proc();
	return f.dot;
}, true);

// hierophant.dm:159
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Move", function* Move(f: Frame) {
	let HS: Value = null;
	if (this.blinking) return f.dot;
	let prevloc: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (!(!this.stat && f.dot)) return f.dot;
	(HS = (yield* new_(T("/obj/effect/temp_visual/hierophant/squares"), prevloc))).dir = this.dir;
	playsound(this.loc, rt.rsc("sound/mecha/mechmove04.ogg"), 150, 1, -4);
	if (!this.target) return f.dot;
	yield* this.arena_trap(this.target);
	return f.dot;
}, true);

// hierophant.dm:171
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/Goto", function Goto(f: Frame, target: Value, delay: Value, minimum_distance: Value) {
	this.wander = 1;
	if (this.blinking) return f.dot;
	parent_proc();
	return f.dot;
}, false);

// hierophant.dm:176
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/calculate_rage", function calculate_rage(f: Frame) {
	this.did_reset = 0;
	this.anger_modifier = max(0, min((this.maxHealth - this.health) / 42, 50));
	this.burst_range = rt.initial(f, this, "burst_range") + round(this.anger_modifier * 0.08);
	this.beam_range = rt.initial(f, this, "beam_range") + round(this.anger_modifier * 0.12);
	return f.dot;
});

// hierophant.dm:181
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/OpenFire", function* OpenFire(f: Frame) {
	let L: Value = null, possibilities: Value = null, cross_counter: Value = null, blink_counter: Value = null, oldcolor: Value = null, targets: Value = null, cardinal_copy: Value = null, pickedtarget: Value = null, C: Value = null, C_1: Value = null, OC: Value = null;
	this.calculate_rage();
	if (this.blinking) {
		return f.dot;
	}
	let target_slowness: Value = 0;
	if (rt.istype(this.target, T("/mob/living"))) {
		L = this.target;
		if (!this.blinking && L.stat == 2 && get_dist(this, L) > 2) {
			yield* g.srcCall(f, "blink", L);
			return f.dot;
		}
		target_slowness += (yield* L.movement_delay());
	}
	target_slowness = max(target_slowness, 1);
	this.chaser_speed = max(1, 3 - this.anger_modifier * 0.04 + (target_slowness - 1) * 0.5);
	yield* this.arena_trap(this.target);
	this.ranged_cooldown = rt.worldTime(f) + max(5, this.ranged_cooldown_time - this.anger_modifier * 0.75);
	if (prob(this.anger_modifier * 0.75)) {
		possibilities = list();
		if ((cross_counter = 1 + round(this.anger_modifier * 0.12)) > 1) {
			possibilities += "cross_blast_spam";
		}
		if (get_dist(this, this.target) > 2) {
			possibilities += "blink_spam";
		}
		if (this.chaser_cooldown < rt.worldTime(f)) {
			if (prob(this.anger_modifier * 2)) {
				possibilities = list("chaser_swarm");
			} else {
				possibilities += "chaser_swarm";
			}
		}
		if (rt.len(f, possibilities)) {
			this.ranged_cooldown = rt.worldTime(f) + max(5, this.major_attack_cooldown - this.anger_modifier * 0.75);
			blink_counter = 1 + round(this.anger_modifier * 0.08);
			const chosen = pick(possibilities);
			if (chosen === "blink_spam") {
				if (this.health < this.maxHealth * 0.5 && blink_counter > 1) {
					this.visible_message("<span class='hierophant'>\"Mx ampp rsx iwgeti.\"</span>");
					oldcolor = this.color;
					rt.op(f, "Animate", [2, 6], [null, this, "color", "#660099", "time", 6]);
					yield* sleep(6);
					while (this.health && !(!this.target || this.target.gc_destroyed) && blink_counter) {
						if (this.loc == this.target.loc || this.loc == this.target) {
							break;
						}
						blink_counter--;
						this.blinking = 0;
						yield* g.srcCall(f, "blink", this.target);
						this.blinking = 1;
						yield* sleep(4 + target_slowness);
					}
					rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 8]);
					yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
					yield* sleep(8);
					this.blinking = 0;
				} else {
					yield* g.srcCall(f, "blink", this.target);
				}
			} else if (chosen === "cross_blast_spam") {
				this.visible_message("<span class='hierophant'>\"Piezi mx rsalivi xs vyr.\"</span>");
				this.blinking = 1;
				oldcolor = this.color;
				rt.op(f, "Animate", [2, 6], [null, this, "color", "#660099", "time", 6]);
				yield* sleep(6);
				while (this.health && !(!this.target || this.target.gc_destroyed) && cross_counter) {
					cross_counter--;
					if (prob(60)) {
						yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts"), this.target);
					} else {
						yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts"), this.target);
					}
					yield* sleep(6 + target_slowness);
				}
				rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 8]);
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
				yield* sleep(8);
				this.blinking = 0;
			} else if (chosen === "chaser_swarm") {
				this.visible_message("<span class='hierophant'>\"Mx gerrsx lmhi.\"</span>");
				this.blinking = 1;
				oldcolor = this.color;
				rt.op(f, "Animate", [2, 6], [null, this, "color", "#660099", "time", 6]);
				yield* sleep(6);
				targets = this.ListTargets();
				cardinal_copy = (yield* GLOB.cardinal.Copy());
				while (this.health && rt.len(f, targets) && rt.len(f, cardinal_copy)) {
					pickedtarget = pick(targets);
					if (rt.len(f, targets) >= rt.len(f, cardinal_copy)) {
						pickedtarget = pick_n_take(targets);
					}
					if (!rt.istype(pickedtarget, T("/mob/living")) || pickedtarget.stat == 2) {
						if (!(pickedtarget = this.target) || pickedtarget.gc_destroyed || rt.istype(pickedtarget, T("/mob/living")) && pickedtarget.stat == 2) {
							break;
						}
					}
					(C = (yield* new_(T("/obj/effect/temp_visual/hierophant/chaser"), this.loc, this, pickedtarget, this.chaser_speed, 0))).moving = 3;
					C.moving_dir = pick_n_take(cardinal_copy);
					yield* sleep(8 + target_slowness);
				}
				this.chaser_cooldown = rt.worldTime(f) + rt.initial(f, this, "chaser_cooldown");
				rt.op(f, "Animate", [2, 6], [null, this, "color", oldcolor, "time", 8]);
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
				yield* sleep(8);
				this.blinking = 0;
			}
			return f.dot;
		}
	}
	if (this.chaser_cooldown < rt.worldTime(f)) {
		C_1 = (yield* new_(T("/obj/effect/temp_visual/hierophant/chaser"), this.loc, this, this.target, this.chaser_speed, 0));
		this.chaser_cooldown = rt.worldTime(f) + rt.initial(f, this, "chaser_cooldown");
		if ((prob(this.anger_modifier) || this.target.Adjacent(this)) && this.target != this) {
			(OC = (yield* new_(T("/obj/effect/temp_visual/hierophant/chaser"), this.loc, this, this.target, this.chaser_speed * 1.5, 0))).moving = 4;
			OC.moving_dir = pick(GLOB.cardinal - C_1.moving_dir);
		}
	} else if (prob(10 + this.anger_modifier * 0.5) && get_dist(this, this.target) > 2) {
		yield* g.srcCall(f, "blink", this.target);
	} else if (prob(70 - this.anger_modifier)) {
		if (prob(this.anger_modifier * (2 / target_slowness)) && this.health < this.maxHealth * 0.5) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/alldir_blasts"), this.target);
		} else if (prob(60)) {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts"), this.target);
		} else {
			yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts"), this.target);
		}
	} else {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/burst"), rt.getStep(f, this, 0));
	}
	return f.dot;
}, true);

// hierophant.dm:300
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/diagonal_blasts", function* diagonal_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	if (!(_T = rt.getStep(f, victim, 0))) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/diagonal"), _T, this);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), _T, this, 0);
	for (d of each(GLOB.diagonals)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), _T, d);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// hierophant.dm:311
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/cardinal_blasts", function* cardinal_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	if (!(_T = rt.getStep(f, victim, 0))) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/cardinal"), _T, this);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), _T, this, 0);
	for (d of each(GLOB.cardinal)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), _T, d);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// hierophant.dm:322
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/alldir_blasts", function* alldir_blasts(f: Frame, victim: Value) {
	let _T: Value = null, d: Value = null;
	if (!(_T = rt.getStep(f, victim, 0))) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), _T, this);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), _T, this, 0);
	for (d of each(GLOB.alldirs)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall"), _T, d);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// hierophant.dm:333
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blast_wall", function* blast_wall(f: Frame, _T: Value, set_dir: Value) {
	let i: Value = null;
	let $e: any;
	let range: Value = this.beam_range;
	let previousturf: Value = _T;
	let J: Value = rt.getStep(f, previousturf, set_dir);
	rt.forRange(f, 0, 1, range, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), J, this, 0);
		J = rt.getStep(f, (previousturf = J), set_dir);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }] });

// hierophant.dm:342
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_trap", function* arena_trap(f: Frame, victim: Value) {
	let d: Value = null, t: Value = null;
	let _T: Value = rt.getStep(f, victim, 0);
	if (!rt.istype(victim, T("/mob")) || victim.stat == 2 || !_T || this.arena_cooldown > rt.worldTime(f)) {
		return f.dot;
	}
	if ((rt.istype(get_area(_T), T("/area/ruin/unpowered/hierophant")) || rt.istype(get_area(this), T("/area/ruin/unpowered/hierophant"))) && victim != this) {
		return f.dot;
	}
	this.arena_cooldown = rt.worldTime(f) + rt.initial(f, this, "arena_cooldown");
	for (d of each(GLOB.cardinal)) {
		yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_squares"), _T, d);
	}
	for (t of each(block(rt.locate(max(_T.x - 11, 1), max(_T.y - 11, 1), _T.z), rt.locate(min(_T.x + 11, rt.world().maxx), min(_T.y + 11, rt.world().maxy), _T.z)))) {
		if (t && get_dist(t, _T) == 11) {
			yield* new_(T("/obj/effect/temp_visual/hierophant/wall"), t, this);
			yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, this, 0);
		}
	}
	if (!(get_dist(this, _T) >= 11)) return f.dot;
	yield* ImmediateInvokeAsync(this, P("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blink"), _T);
	return f.dot;
}, true);

// hierophant.dm:358
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/arena_squares", function* arena_squares(f: Frame, _T: Value, set_dir: Value) {
	let i: Value = null, HS: Value = null;
	let $e: any;
	let previousturf: Value = _T;
	let J: Value = rt.getStep(f, previousturf, set_dir);
	rt.forRange(f, 0, 1, 10, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		(HS = (yield* new_(T("/obj/effect/temp_visual/hierophant/squares"), J))).dir = set_dir;
		J = rt.getStep(f, (previousturf = J), set_dir);
		yield* sleep(0.5);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }, {  }] });

// hierophant.dm:368
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/blink", function* blink(f: Frame, victim: Value) {
	let t: Value = null, B: Value = null;
	if (this.blinking || !victim) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, victim, 0);
	let source: Value = rt.getStep(f, this, 0);
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), _T, this);
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), source, this);
	playsound(_T, rt.rsc("sound/magic/wand_teleport.ogg"), 200, 1);
	playsound(source, rt.rsc("sound/machines/airlockopen.ogg"), 200, 1);
	this.blinking = 1;
	yield* sleep(2);
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), _T, this);
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), source, this);
	for (t of each(block(rt.locate(max(_T.x - 1, 1), max(_T.y - 1, 1), _T.z), rt.locate(min(_T.x + 1, rt.world().maxx), min(_T.y + 1, rt.world().maxy), _T.z)))) {
		(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, this, 0))).damage = 30;
	}
	t = null;
	for (t of each(block(rt.locate(max(source.x - 1, 1), max(source.y - 1, 1), source.z), rt.locate(min(source.x + 1, rt.world().maxx), min(source.y + 1, rt.world().maxy), source.z)))) {
		(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, this, 0))).damage = 30;
	}
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 0, "time", 2, "easing", 128]);
	yield* sleep(1);
	this.visible_message(`<span class='hierophant_warning'>${this} fades out!</span>`);
	this.density = 0;
	yield* sleep(2);
	yield* this.forceMove(_T);
	yield* sleep(1);
	rt.op(f, "Animate", [2, 8], [null, this, "alpha", 255, "time", 2, "easing", 64]);
	yield* sleep(1);
	this.density = 1;
	this.visible_message(`<span class='hierophant_warning'>${this} fades in!</span>`);
	yield* sleep(1);
	this.blinking = 0;
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// hierophant.dm:401
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/melee_blast", function* melee_blast(f: Frame, victim: Value) {
	let _T: Value = null, t: Value = null;
	if (!victim) {
		return f.dot;
	}
	if (!(_T = rt.getStep(f, victim, 0))) {
		return f.dot;
	}
	yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph"), _T, this);
	playsound(_T, rt.rsc("sound/effects/bin_close.ogg"), 200, 1);
	yield* sleep(2);
	for (t of each(block(rt.locate(max(_T.x - 1, 1), max(_T.y - 1, 1), _T.z), rt.locate(min(_T.x + 1, rt.world().maxx), min(_T.y + 1, rt.world().maxy), _T.z)))) {
		yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), t, this, 0);
	}
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// hierophant.dm:413
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/burst", function* burst(f: Frame, original: Value) {
	let t: Value = null, _T: Value = null, dist: Value = null;
	playsound(original, rt.rsc("sound/machines/airlockopen.ogg"), 200, 1);
	let last_dist: Value = 0;
	for (t of each((yield* spiral_range_turfs(this.burst_range, original)))) {
		if (!(_T = t)) {
			continue;
		}
		if ((dist = get_dist(original, _T)) > last_dist) {
			last_dist = dist;
			yield* sleep(1 + min(this.burst_range - last_dist, 12) * 0.5);
		}
		yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), _T, this, 0);
	}
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// hierophant.dm:426
rt.def("/mob/living/simple_animal/hostile/megafauna/hierophant/proc/AltClickOn", function* AltClickOn(f: Frame, A: Value) {
	if (!rt.istype(A, T("/atom")) || get_dist(A, this) <= 2) {
		return f.dot;
	}
	yield* g.srcCall(f, "blink", A);
	return f.dot;
}, true);

rt.type(11660, "/obj/effect/temp_visual/hierophant", "/obj/effect/temp_visual", {
	caster: null,
	name: "vortex energy",
	layer: 3.7,
});

// hierophant.dm:437
rt.def("/obj/effect/temp_visual/hierophant/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_caster: Value) {
	f.dot = (yield* parent_proc());
	if (!new_caster) return f.dot;
	this.caster = new_caster;
	return f.dot;
}, true);

rt.type(11663, "/obj/effect/temp_visual/hierophant/squares", "/obj/effect/temp_visual/hierophant", {
	duration: 3,
	light_range: 1,
	randomdir: 0,
	icon_state: "hierophant_squares",
});

// hierophant.dm:448
rt.def("/obj/effect/temp_visual/hierophant/squares/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_caster: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(this.loc, T("/turf/closed/mineral"))) return f.dot;
	yield* (M = this.loc).gets_drilled(this.caster);
	return f.dot;
}, true);

rt.type(11661, "/obj/effect/temp_visual/hierophant/wall", "/obj/effect/temp_visual/hierophant", {
	light_range: 1,
	duration: 100,
	smooth: 1,
	name: "vortex wall",
	icon: rt.rsc("icons/turf/walls/hierophant_wall_temp.dmi"),
	icon_state: "wall",
});

// hierophant.dm:462
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_caster: Value) {
	f.dot = (yield* parent_proc());
	queue_smooth_neighbors(this);
	queue_smooth(this);
	return f.dot;
}, true);

// hierophant.dm:467
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/Destroy", function* Destroy(f: Frame) {
	queue_smooth_neighbors(this);
	return (yield* parent_proc());
}, true);

// hierophant.dm:471
rt.def("/obj/effect/temp_visual/hierophant/wall/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let _P: Value = null;
	height ??= 0;
	if (!this.caster || this.caster.gc_destroyed) {
		return 0;
	}
	if (mover == this.caster.pulledby) {
		return 1;
	}
	if (rt.istype(mover, T("/obj/item/projectile"))) {
		if ((_P = mover).firer == this.caster) {
			return 1;
		}
	}
	if (mover == this.caster) {
		return 1;
	}
	return 0;
});

rt.type(11664, "/obj/effect/temp_visual/hierophant/chaser", "/obj/effect/temp_visual/hierophant", {
	target: null,
	targetturf: null,
	moving_dir: null,
	previous_moving_dir: null,
	more_previouser_moving_dir: null,
	moving: 0,
	standard_moving_before_recalc: 4,
	tiles_per_step: 1,
	speed: 3,
	currently_seeking: 0,
	friendly_fire_check: 0,
	monster_damage_boost: 1,
	damage: 10,
	duration: 98,
});

// hierophant.dm:500
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_caster: Value, new_target: Value, new_speed: Value, is_friendly_fire: Value) {
	f.dot = (yield* parent_proc());
	this.target = new_target;
	this.friendly_fire_check = is_friendly_fire;
	if (new_speed) {
		this.speed = new_speed;
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/temp_visual/hierophant/chaser/proc/seek_target"))), 1);
	return f.dot;
}, true);

// hierophant.dm:508
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/get_target_dir", function get_target_dir(f: Frame) {
	f.dot = get_cardinal_dir(this, this.targetturf);
	if (!(f.dot != this.previous_moving_dir && f.dot == this.more_previouser_moving_dir || f.dot == 0)) return f.dot;
	let cardinal_copy: Value = GLOB.cardinal.Copy();
	cardinal_copy -= this.more_previouser_moving_dir;
	f.dot = pick(cardinal_copy);
	return f.dot;
});

// hierophant.dm:515
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/seek_target", function* seek_target(f: Frame) {
	let standard_target_dir: Value = null, _T: Value = null, i: Value = null, maybe_new_turf: Value = null;
	let $e: any;
	if (this.currently_seeking) return f.dot;
	this.currently_seeking = 1;
	this.targetturf = rt.getStep(f, this.target, 0);
	while (this.target && this && !(!this || this.gc_destroyed) && this.currently_seeking && this.x && this.y && this.targetturf) {
		if (!this.moving) {
			this.more_previouser_moving_dir = this.previous_moving_dir;
			this.previous_moving_dir = this.moving_dir;
			this.moving_dir = this.get_target_dir();
			if ((standard_target_dir = get_cardinal_dir(this, this.targetturf)) != this.previous_moving_dir && standard_target_dir == this.more_previouser_moving_dir || standard_target_dir == 0) {
				this.moving = 1;
			} else {
				this.moving = this.standard_moving_before_recalc;
			}
		}
		if (this.moving) {
			_T = rt.getStep(f, this, 0);
			i = null;
			rt.forRange(f, 0, 1, this.tiles_per_step, 1);
			while (($e = rt.next(f, 0)) !== undefined) {
				i = $e;
				if (maybe_new_turf = rt.getStep(f, _T, this.moving_dir)) {
					_T = maybe_new_turf;
				} else {
					break;
				}
			}
			rt.endFor(f, 0);
			yield* this.forceMove(_T);
			yield* this.make_blast();
			this.moving--;
			yield* sleep(this.speed);
		}
		this.targetturf = rt.getStep(f, this.target, 0);
	}
	return f.dot;
}, true);

// hierophant.dm:542
rt.def("/obj/effect/temp_visual/hierophant/chaser/proc/make_blast", function* make_blast(f: Frame) {
	let B: Value = null;
	(B = (yield* new_(T("/obj/effect/temp_visual/hierophant/blast"), this.loc, this.caster, this.friendly_fire_check))).damage = this.damage;
	B.monster_damage_boost = this.monster_damage_boost;
	return f.dot;
}, true);

rt.type(11670, "/obj/effect/temp_visual/hierophant/blast", "/obj/effect/temp_visual/hierophant", {
	damage: 10,
	monster_damage_boost: 1,
	hit_things: null,
	friendly_fire_check: 0,
	bursting: 0,
	light_range: 1,
	duration: 9,
	icon_state: "hierophant_blast",
	name: "vortex blast",
	desc: "Get out of the way!",
});

// hierophant.dm:575
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hit_things = list();
	return f.dot;
});

// hierophant.dm:580
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/Initialize", function* Initialize(f: Frame, mapload: Value, new_caster: Value, friendly_fire: Value) {
	let M: Value = null;
	f.dot = (yield* parent_proc());
	this.friendly_fire_check = friendly_fire;
	if (new_caster) {
		this.hit_things += new_caster;
	}
	if (rt.istype(this.loc, T("/turf/closed/mineral"))) {
		yield* (M = this.loc).gets_drilled(this.caster);
	}
	yield* ImmediateInvokeAsync(this, P("/obj/effect/temp_visual/hierophant/blast/proc/blast"));
	return f.dot;
}, true);

// hierophant.dm:590
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/blast", function* blast(f: Frame) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	playsound(_T, rt.rsc("sound/magic/blind.ogg"), 125, 1, -5);
	yield* sleep(6);
	this.bursting = 1;
	yield* this.do_damage(_T);
	yield* sleep(1.3);
	this.bursting = 0;
	return f.dot;
}, true);

// hierophant.dm:601
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	yield* parent_proc();
	if (!this.bursting) return f.dot;
	yield* this.do_damage(rt.getStep(f, this, 0));
	return f.dot;
}, true);

// hierophant.dm:606
rt.def("/obj/effect/temp_visual/hierophant/blast/proc/do_damage", function* do_damage(f: Frame, _T: Value) {
	let L: Value = null, limb_to_hit: Value = null, armor: Value = null, M: Value = null;
	if (!this.damage) {
		return f.dot;
	}
	for (L of each(_T.contents - this.hit_things, T("/mob/living"))) {
		this.hit_things += L;
		if (this.friendly_fire_check && this.caster && this.caster.faction_check_mob(L) || L.stat == 2) {
			continue;
		}
		if (L.client) {
			flash_color(L.client, "#660099", 1);
		}
		playsound(L, rt.rsc("sound/weapons/sear.ogg"), 50, 1, -4);
		to_chat(L, `<span class='userdanger'>You're struck by a ${this.name}!</span>`);
		limb_to_hit = L.get_bodypart(pick("head", "chest", "r_arm", "l_arm", "r_leg", "l_leg"));
		armor = L.run_armor_check(limb_to_hit, "melee", `Your armor absorbs ${this}!`, `Your armor blocks part of ${this}!`, 50, `Your armor was penetrated by ${this}!`);
		yield* L.apply_damage(this.damage, "fire", limb_to_hit, armor);
		if (this.monster_damage_boost && (rt.istype(L, T("/mob/living/simple_animal/hostile/megafauna")) || rt.istype(L, T("/mob/living/simple_animal/hostile/asteroid")))) {
			yield* L.adjustBruteLoss(this.damage);
		}
		add_logs(this.caster, L, `struck with a ${this.name}`);
	}
	for (M of each(_T.contents - this.hit_things, T("/obj/mecha"))) {
		this.hit_things += M;
		if (M.occupant) {
			if (this.friendly_fire_check && this.caster && this.caster.faction_check_mob(M.occupant)) {
				continue;
			}
			to_chat(M.occupant, `<span class='userdanger'>Your ${M.name} is struck by a ${this.name}!</span>`);
		}
		playsound(M, rt.rsc("sound/weapons/sear.ogg"), 50, 1, -4);
		yield* M.take_damage(this.damage, "fire", 0, 0);
	}
	return f.dot;
}, true);

rt.type(12086, "/obj/effect/hierophant", "/obj/effect", {
	light_range: 2,
	anchored: 1,
	name: "hierophant beacon",
	desc: "A strange beacon, allowing mass teleportation for those able to use it.",
	icon: rt.rsc("icons/obj/lavaland/artefacts.dmi"),
	icon_state: "hierophant_tele_off",
	layer: 2.5,
});

// hierophant.dm:644
rt.def("/obj/effect/hierophant/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let H: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/hierophant_club"))) {
		if ((H = I).timer > rt.worldTime(f)) {
			return f.dot;
		}
		if (H.beacon == this) {
			to_chat(user, "<span class='notice'>You start removing your hierophant beacon...</span>");
			H.timer = rt.worldTime(f) + 51;
			yield* ImmediateInvokeAsync(H, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			if (yield* do_after(user, 50, { target: this })) {
				playsound(this, rt.rsc("sound/magic/blind.ogg"), 200, 1, -4);
				yield* new_(T("/obj/effect/temp_visual/hierophant/telegraph/teleport"), rt.getStep(f, this, 0), user);
				to_chat(user, `<span class='hierophant_warning'>You collect ${this}, reattaching it to the club!</span>`);
				H.beacon = null;
				yield* user.update_action_buttons_icon();
				yield* qdel(this);
			} else {
				H.timer = rt.worldTime(f);
				yield* ImmediateInvokeAsync(H, P("/obj/item/weapon/hierophant_club/proc/prepare_icon_update"));
			}
		} else {
			to_chat(user, "<span class='hierophant_warning'>You touch the beacon with the club, but nothing happens.</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
