// Based on /tg/station's code/modules/mob/living/living.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// living.dm:2
rt.def("/mob/living/proc/Initialize", function* Initialize(f: Frame) {
	let D: Value = null, medhud: Value = null;
	f.dot = (yield* parent_proc());
	yield* this.generateStaticOverlay();
	if (rt.len(f, this.staticOverlays)) {
		for (D of each(GLOB.player_list, T("/mob/living/simple_animal/drone"))) {
			if (D && D.seeStatic) {
				if (rt.isIn(f, D.staticChoice, this.staticOverlays)) {
					(rt.modField(f, D, "staticOverlays", rt.index(this.staticOverlays, D.staticChoice), rt.bitOr));
					(rt.modField(f, D.client, "images", rt.index(this.staticOverlays, D.staticChoice), rt.bitOr));
				} else {
					(rt.modField(f, D, "staticOverlays", rt.at(this.staticOverlays, "static"), rt.bitOr));
					(rt.modField(f, D.client, "images", rt.at(this.staticOverlays, "static"), rt.bitOr));
				}
			}
		}
	}
	if (this.unique_name) {
		this.name = `${this.name} (${rand(1, 1000)})`;
		this.real_name = this.name;
	}
	(medhud = rt.index(GLOB.huds, DATA_HUD_MEDICAL_ADVANCED)).add_to_hud(this);
	this.faction += fmt("＃", [this]);
	return f.dot;
}, true);

// living.dm:22
rt.def("/mob/living/proc/prepare_huds", function* prepare_huds(f: Frame) {
	yield* parent_proc();
	yield* this.prepare_data_huds();
	return f.dot;
}, true);

// living.dm:26
rt.def("/mob/living/proc/prepare_data_huds", function* prepare_data_huds(f: Frame) {
	yield* this.med_hud_set_health();
	this.med_hud_set_status();
	return f.dot;
}, true);

// living.dm:30
rt.def("/mob/living/proc/Destroy", function* Destroy(f: Frame) {
	let s: Value = null, S: Value = null, D: Value = null, I: Value = null;
	if (rt.length(this.status_effects)) {
		for (s of each(this.status_effects)) {
			if ((S = s).on_remove_on_mob_delete) {
				yield* qdel(S);
			} else {
				yield* S.be_replaced();
			}
		}
	}
	if (this.ranged_ability) {
		yield* this.ranged_ability.remove_ranged_ability(this);
	}
	if (this.buckled) {
		yield* this.buckled.unbuckle_mob(this, { force: 1 });
	}
	yield* qdel(this.riding_datum);
	this.riding_datum = null;
	for (D of each(GLOB.player_list, T("/mob/living/simple_animal/drone"))) {
		I = null;
		for (I of each(this.staticOverlays, T("/image"))) {
			yield* D.staticOverlays.Remove(I);
			yield* D.client.images.Remove(I);
			yield* qdel(I);
		}
	}
	this.staticOverlays.len = 0;
	this.remove_from_all_data_huds();
	return (yield* parent_proc());
}, true);

// living.dm:54
rt.def("/mob/living/proc/ghostize", function* ghostize(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	let prev_client: Value = this.client;
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (!(this.ranged_ability && prev_client)) return f.dot;
	this.ranged_ability.remove_mousepointer(prev_client);
	return f.dot;
}, true, { args: ["can_reenter_corpse"] });

// living.dm:65
rt.def("/mob/living/proc/generateStaticOverlay", function* generateStaticOverlay(f: Frame) {
	let staticOverlay: Value = null;
	this.staticOverlays.Add(list("static", "blank", "letter", "animal"));
	(staticOverlay = (yield* image(getStaticIcon((yield* new_(T("/icon"), this.icon, this.icon_state))), { loc: this }))).override = 1;
	rt.setAt(this.staticOverlays, "static", staticOverlay);
	(staticOverlay = (yield* image(getBlankIcon((yield* new_(T("/icon"), this.icon, this.icon_state))), { loc: this }))).override = 1;
	rt.setAt(this.staticOverlays, "blank", staticOverlay);
	(staticOverlay = (yield* getLetterImage(this))).override = 1;
	rt.setAt(this.staticOverlays, "letter", staticOverlay);
	(staticOverlay = getRandomAnimalImage(this)).override = 1;
	rt.setAt(this.staticOverlays, "animal", staticOverlay);
	return f.dot;
}, true);

// living.dm:85
rt.def("/mob/living/proc/Bump", function* Bump(f: Frame, A: Value, yes: Value) {
	let M: Value = null, O: Value = null, AM: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (this.buckled || !yes || this.now_pushing) {
		return f.dot;
	}
	if (ismob(A)) {
		if (yield* this.MobBump((M = A))) {
			return f.dot;
		}
	}
	if (rt.istype(A, T("/obj"))) {
		if (yield* this.ObjBump((O = A))) {
			return f.dot;
		}
	}
	if (!rt.istype(A, T("/atom/movable"))) return f.dot;
	if (!(yield* this.PushAM((AM = A)))) return f.dot;
	return f.dot;
}, true);

// living.dm:103
rt.def("/mob/living/proc/Bumped", function Bumped(f: Frame, AM: Value) {
	parent_proc();
	this.last_bumped = rt.worldTime(f);
	return f.dot;
}, false);

// living.dm:109
rt.def("/mob/living/proc/MobBump", function* MobBump(f: Frame, M: Value) {
	let L: Value = null, _P: Value = null, mob_swap: Value = null, oldloc: Value = null, oldMloc: Value = null, M_passmob: Value = null, src_passmob: Value = null, I: Value = null;
	yield* this.spreadFire(M);
	if (this.now_pushing) {
		return 1;
	}
	if (rt.istype(M, T("/mob/living"))) {
		if ((L = M).pulledby && L.pulledby != this && L.restrained()) {
			if (!(rt.worldTime(f) % 5)) {
				to_chat(this, `<span class='warning'>${L} is restrained, you cannot push past.</span>`);
			}
			return 1;
		}
		if (L.pulling) {
			if (ismob(L.pulling)) {
				if ((_P = L.pulling).restrained()) {
					if (!(rt.worldTime(f) % 5)) {
						to_chat(this, `<span class='warning'>${L} is restraining ${_P}, you cannot push past.</span>`);
					}
					return 1;
				}
			}
		}
	}
	if (this.moving_diagonally) {
		return 1;
	}
	if (!M.buckled && !M.has_buckled_mobs()) {
		if (M.pulledby == this && this.a_intent == "grab") {
			mob_swap = 1;
		} else if ((M.restrained() || M.a_intent == "help") && (this.restrained() || this.a_intent == "help")) {
			mob_swap = 1;
		}
		if (mob_swap) {
			if (this.loc && !this.loc.Adjacent(M.loc)) {
				return 1;
			}
			this.now_pushing = 1;
			oldloc = this.loc;
			oldMloc = M.loc;
			M_passmob = rt.bitAnd(M.pass_flags, 16);
			src_passmob = rt.bitAnd(this.pass_flags, 16);
			(rt.modField(f, M, "pass_flags", 16, rt.bitOr));
			(rt.modSrcVar(f, "pass_flags", 16, rt.bitOr));
			yield* M.Move(oldloc);
			yield* this.Move(oldMloc);
			if (!src_passmob) {
				(rt.modSrcVar(f, "pass_flags", 16777199, rt.bitAnd));
			}
			if (!M_passmob) {
				(rt.modField(f, M, "pass_flags", 16777199, rt.bitAnd));
			}
			this.now_pushing = 0;
			return 1;
		}
	}
	if (!rt.bitAnd(M.status_flags, 8)) {
		return 1;
	}
	for (I of each(M.held_items, T("/obj/item"))) {
		if (!rt.istype(M, T("/obj/item/clothing"))) {
			if (prob(I.block_chance * 2)) {
				return 1;
			}
		}
	}
	return f.dot;
}, true);

// living.dm:186
rt.def("/mob/living/proc/PushAM", function* PushAM(f: Frame, AM: Value) {
	let W: Value = null, win: Value = null, current_dir: Value = null;
	if (this.now_pushing) {
		return 1;
	}
	if (this.moving_diagonally) {
		return 1;
	}
	if (!this.client && this.mob_size < MOB_SIZE_SMALL) {
		return f.dot;
	}
	if (AM.anchored) return f.dot;
	this.now_pushing = 1;
	let t: Value = rt.getDir(f, this, AM);
	if (rt.istype(AM, T("/obj/structure/window"))) {
		if ((W = AM).fulltile) {
			for (win of each(rt.getStep(f, W, t), T("/obj/structure/window"))) {
				this.now_pushing = 0;
				return f.dot;
			}
		}
	}
	if (this.pulling == AM) {
		yield* this.stop_pulling();
	}
	if (rt.istype(AM, T("/mob/living"))) {
		current_dir = AM.dir;
	}
	yield* step(AM, t);
	if (current_dir) {
		yield* AM.setDir(current_dir);
	}
	this.now_pushing = 0;
	return f.dot;
}, true);

// living.dm:213
rt.def("/mob/living/verb/pulled", function* pulled(f: Frame, AM: Value) {
	if (rt.istype(AM, T("/atom/movable")) && this.Adjacent(AM)) {
		yield* this.start_pulling(AM);
	} else {
		yield* this.stop_pulling();
	}
	return f.dot;
}, true, { verb: { name: "Pull", category: "Object" }, argTypes: [{ type: 12, path: "/atom/movable", source: "oview:1" }] });

// living.dm:220
rt.def("/mob/living/pointed", function* pointed(f: Frame, A: Value) {
	if (this.incapacitated()) {
		return 0;
	}
	if (rt.bitAnd(this.status_flags, FAKEDEATH)) {
		return 0;
	}
	if (!(yield* parent_proc())) {
		return 0;
	}
	this.visible_message(`<b>${this}</b> points to ${A}`);
	return 1;
}, true, { verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// living.dm:231
rt.def("/mob/living/verb/succumb", function* succumb(f: Frame, whispered: Value) {
	let $1: any;
	if (!this.InCritical()) return f.dot;
	let $0: any = this;
	if (whispered) {
		$1 = "whispered his final words";
	} else {
		$1 = "succumbed to death";
	}
	$0.log_message(`Has ${$1} with ${round(this.health, 0.1)} points of health!`, "Attack log");
	yield* this.adjustOxyLoss(this.health - -100);
	yield* this.updatehealth();
	if (!whispered) {
		to_chat(this, "<span class='notice'>You have given up life and succumbed to death.</span>");
	}
	yield* this.death();
	return f.dot;
}, true, { hidden: true, argTypes: [{ type: 1 }] });

// living.dm:240
rt.def("/mob/living/proc/incapacitated", function incapacitated(f: Frame, ignore_restraints: Value, ignore_grab: Value) {
	if (!(this.stat || this.IsUnconscious() || this.IsStun() || this.IsKnockdown() || !ignore_restraints && this.restrained(ignore_grab))) return f.dot;
	return 1;
});

// living.dm:244
rt.def("/mob/living/proc/InCritical", function InCritical(f: Frame) {
	return (((this.health < 0 ? 1 : 0) && (this.health > -100 ? 1 : 0)) && (this.stat == 1 ? 1 : 0));
});

// living.dm:284
rt.def("/mob/living/proc/mob_sleep", function* mob_sleep(f: Frame) {
	if (this.IsSleeping()) {
		to_chat(this, "<span class='notice'>You are already sleeping.</span>");
		return f.dot;
	} else if ((yield* alert(this, "You sure you want to sleep for a while?", "Sleep", "Yes", "No")) == "Yes") {
		yield* this.SetSleeping(400);
	}
	yield* this.update_canmove();
	return f.dot;
}, true, { verb: { name: "Sleep", category: "IC" } });

// living.dm:298
rt.def("/mob/living/proc/lay_down", function* lay_down(f: Frame) {
	this.resting = (!this.resting ? 1 : 0);
	let $0: any = this;
	to_chat($0, `<span class='notice'>You are now ${this.resting ? "resting" : "getting up"}.</span>`);
	yield* this.update_canmove();
	return f.dot;
}, true, { verb: { name: "Rest", category: "IC" } });

// living.dm:304
rt.def("/mob/living/proc/get_contents", function get_contents(f: Frame, Storage: Value) {
	let S: Value = null, U: Value = null, F: Value = null;
	let L: Value = list();
	if (Storage) {
		return (L += Storage.return_inv());
	}
	L += this.contents;
	for (S of each(this.contents, T("/obj/item/weapon/storage"))) {
		L += this.get_contents(S);
	}
	for (U of each(this.contents, T("/obj/item/clothing/under"))) {
		L += U.contents;
	}
	for (F of each(this.contents, T("/obj/item/weapon/folder"))) {
		L += F.contents;
	}
	return L;
});

// living.dm:331
rt.def("/mob/living/proc/get_organ_target", function get_organ_target(f: Frame) {
	let t: Value = null, def_zone: Value = null;
	let shooter: Value = this;
	if (rt.isIn(f, (t = shooter.zone_selected), list("eyes", "mouth"))) {
		t = "head";
	}
	return (def_zone = ran_zone(t));
});

// living.dm:340
rt.def("/mob/living/proc/updatehealth", function* updatehealth(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	this.health = this.maxHealth - this.getOxyLoss() - this.getToxLoss() - this.getFireLoss() - this.getBruteLoss() - this.getCloneLoss();
	yield* this.update_stat();
	yield* this.med_hud_set_health();
	this.med_hud_set_status();
	return f.dot;
}, true);

// living.dm:350
rt.def("/mob/living/proc/revive", function* revive(f: Frame, full_heal: Value, admin_revive: Value) {
	let S: Value = null, spell: Value = null;
	full_heal ??= 0;
	admin_revive ??= 0;
	if (full_heal) {
		yield* this.fully_heal(admin_revive);
	}
	if (!(this.stat == 2 && this.can_be_revived())) return f.dot;
	GLOB.dead_mob_list -= this;
	GLOB.living_mob_list += this;
	this.suiciding = 0;
	this.stat = 1;
	yield* this.blind_eyes(1);
	yield* this.updatehealth();
	yield* this.update_canmove();
	yield* this.update_sight();
	yield* this.clear_alert("oxy");
	this.reload_fullscreen();
	f.dot = 1;
	if (!this.mind) return f.dot;
	for (S of each(this.mind.spell_list)) {
		yield* (spell = S).updateButtonIcon();
	}
	return f.dot;
}, true);

// living.dm:370
rt.def("/mob/living/proc/fully_heal", function* fully_heal(f: Frame, admin_revive: Value) {
	admin_revive ??= 0;
	this.restore_blood();
	yield* this.setToxLoss(0, 0);
	yield* this.setOxyLoss(0, 0);
	yield* this.setCloneLoss(0, 0);
	this.setBrainLoss(0);
	yield* this.setStaminaLoss(0, 0);
	yield* this.SetUnconscious(0, 0);
	yield* this.SetStun(0, 0);
	yield* this.SetKnockdown(0, 0);
	yield* this.SetSleeping(0, 0);
	this.radiation = 0;
	this.nutrition = 400;
	this.bodytemperature = 310;
	yield* this.set_blindness(0);
	yield* this.set_blurriness(0);
	yield* this.set_eye_damage(0);
	yield* this.cure_nearsighted();
	yield* this.cure_blind();
	yield* this.cure_husk();
	this.disabilities = 0;
	this.hallucination = 0;
	yield* this.heal_overall_damage(100000, 100000, 0, 0, 1);
	yield* this.ExtinguishMob();
	this.fire_stacks = 0;
	yield* this.update_canmove();
	return f.dot;
}, true);

// living.dm:400
rt.def("/mob/living/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = 1;
	if (!(this.health <= -100)) return f.dot;
	return 0;
});

// living.dm:422
rt.def("/mob/living/proc/Move", function* Move(f: Frame, newloc: Value, direct: Value) {
	let pullee: Value = null, pull_dir: Value = null, M: Value = null;
	if (this.buckled && this.buckled.loc != newloc) {
		if (!this.buckled.anchored) {
			return (yield* this.buckled.Move(newloc, direct));
		}
		return 0;
	}
	if ((pullee = this.pulling) && get_dist(this, pullee) > 1) {
		yield* this.stop_pulling();
	}
	if (pullee && !isturf(pullee.loc) && pullee.loc != this.loc) {
		log_game(`DEBUG:${this}'s pull on ${pullee} wasn't broken despite ${pullee} being in ${pullee.loc}. Pull stopped manually.`);
		yield* this.stop_pulling();
	}
	let _T: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (f.dot && this.pulling && this.pulling == pullee) {
		if (this.pulling.anchored) {
			yield* this.stop_pulling();
			return f.dot;
		}
		pull_dir = rt.getDir(f, this, this.pulling);
		// Fix of 2017 tg (modern tg's rule): on the second half of a diagonal step (moving_diagonally 2, SECOND_DIAG_STEP) a pullee left diagonal
		// stays put, so it trails on the tile the puller started the diagonal from. Before, it moved again into the half-way tile and ended up
		// beside the puller, not behind.
		if (get_dist(this, this.pulling) > 1 || this.moving_diagonally != 2 && rt.bitAnd(pull_dir - 1, pull_dir)) {
			if (rt.istype(this.pulling, T("/mob/living"))) {
				if ((M = this.pulling).lying && !M.buckled && prob(M.getBruteLoss() * 200 / M.maxHealth)) {
					yield* M.makeTrail(_T);
				}
			}
			this.pulling.glide_size = this.glide_size;
			yield* this.pulling.Move(_T, rt.getDir(f, this.pulling, _T));
			if (this.pulling && get_dist(this, this.pulling) > 1) {
				yield* this.stop_pulling();
			}
		}
	}
	if (this.pulledby && this.moving_diagonally != 1 && get_dist(this, this.pulledby) > 1) {
		yield* this.pulledby.stop_pulling();
	}
	if (!(this.s_active && !(yield* this.CanReach(this.s_active, { view_only: 1 })))) return f.dot;
	yield* this.s_active.close(this);
	return f.dot;
}, true);

// living.dm:459
rt.def("/mob/living/proc/movement_delay", function movement_delay(f: Frame) {
	let _T: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	f.dot = parent_proc();
	if (rt.istype(this.loc, T("/turf/open")) && !this.is_flying()) {
		f.dot += (_T = this.loc).slowdown;
	}
	if (f.args[0]) {
		f.dot += GLOB.config.run_speed;
	} else if (this.m_intent === "run") {
		if (this.drowsyness > 0) {
			f.dot += 6;
		}
		f.dot += GLOB.config.run_speed;
	} else if (this.m_intent === "walk") {
		f.dot += GLOB.config.walk_speed;
	}
	return f.dot;
}, false, { args: ["ignorewalk"] });

// living.dm:475
rt.def("/mob/living/proc/makeTrail", function* makeTrail(f: Frame, _T: Value) {
	let C: Value = null, trail_type: Value = null, newdir: Value = null, TH: Value = null;
	if (!this.has_gravity()) {
		return f.dot;
	}
	let blood_exists: Value = 0;
	for (C of each(this.loc, T("/obj/effect/decal/cleanable/trail_holder"))) {
		blood_exists = 1;
	}
	if (!isturf(this.loc)) return f.dot;
	if (!(trail_type = this.getTrail())) return f.dot;
	let brute_ratio: Value = round(this.getBruteLoss() / this.maxHealth, 0.1);
	if (!(this.blood_volume && this.blood_volume > max(BLOOD_VOLUME_NORMAL * (1 - brute_ratio * 0.25), 0))) return f.dot;
	this.blood_volume = max(this.blood_volume - max(1, brute_ratio * 2), 0);
	if ((newdir = rt.getDir(f, _T, this.loc)) != this.dir) {
		if ((newdir = rt.bitOr(newdir, this.dir)) == 3) {
			newdir = 1;
		} else if (newdir == 12) {
			newdir = 4;
		}
	}
	if (rt.isIn(f, newdir, GLOB.cardinal) && prob(50)) {
		newdir = turn(rt.getDir(f, _T, this.loc), 180);
	}
	if (!blood_exists) {
		yield* new_(T("/obj/effect/decal/cleanable/trail_holder"), this.loc);
	}
	for (TH of each(this.loc, T("/obj/effect/decal/cleanable/trail_holder"))) {
		if ((!rt.isIn(f, newdir, TH.existing_dirs) || trail_type == "trails_1" || trail_type == "trails_2") && rt.len(f, TH.existing_dirs) <= 16) {
			TH.existing_dirs += newdir;
			TH.add_overlay((yield* image(rt.rsc("icons/effects/blood.dmi"), trail_type, { dir: newdir })));
			TH.transfer_mob_blood_dna(this);
		}
	}
	return f.dot;
}, true);

// living.dm:505
rt.def("/mob/living/carbon/human/proc/makeTrail", function* makeTrail(f: Frame, T: Value) {
	if (rt.isIn(f, NOBLOOD, this.dna.species.species_traits) || !this.bleed_rate || this.bleedsuppress) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// living.dm:510
rt.def("/mob/living/proc/getTrail", function getTrail(f: Frame) {
	if (this.getBruteLoss() < 300) {
		return pick("ltrails_1", "ltrails_2");
	}
	return pick("trails_1", "trails_2");
});

// living.dm:516
rt.def("/mob/living/proc/experience_pressure_difference", function experience_pressure_difference(f: Frame, pressure_difference: Value, direction: Value, pressure_resistance_prob_delta: Value) {
	let _T: Value = null, t: Value = null, AM: Value = null;
	pressure_resistance_prob_delta ??= 0;
	if (this.client && this.client.move_delay >= rt.worldTime(f) + rt.world().tick_lag * 2) {
		pressure_resistance_prob_delta -= 30;
	}
	let turfs_to_check: Value = list();
	if (this.has_limbs) {
		if (_T = rt.getStep(f, this, angle2dir(dir2angle(direction) + 90))) {
			turfs_to_check += _T;
		}
		if (_T = rt.getStep(f, this, angle2dir(dir2angle(direction) - 90))) {
			turfs_to_check += _T;
		}
		for (t of each(turfs_to_check)) {
			if ((_T = t).density) {
				pressure_resistance_prob_delta -= 20;
				continue;
			}
			AM = null;
			for (AM of each(_T, T("/atom/movable"))) {
				if (AM.density && AM.anchored) {
					pressure_resistance_prob_delta -= 20;
					break;
				}
			}
		}
	}
	if (this.force_moving) return f.dot;
	parent_proc(pressure_difference, direction, pressure_resistance_prob_delta);
	return f.dot;
}, false, { waitfor: false });

// living.dm:546
rt.def("/mob/living/verb/resist", function* resist(f: Frame) {
	let C: Value = null;
	if (!rt.istype(this, T("/mob/living")) || this.next_move > rt.worldTime(f) || (yield* this.incapacitated({ ignore_restraints: 1 }))) {
		return f.dot;
	}
	this.changeNext_move(20);
	if (!(yield* this.restrained({ ignore_grab: 1 })) && this.pulledby) {
		this.visible_message(`<span class='danger'>${this} resists against ${this.pulledby}'s grip!</span>`);
		yield* this.resist_grab();
		return f.dot;
	}
	if (this.buckled && this.last_special <= rt.worldTime(f)) {
		yield* this.resist_buckle();
	} else if (rt.istype(this.loc, T("/obj"))) {
		yield* (C = this.loc).container_resist(this);
	} else if (this.has_status_effect(T("/datum/status_effect/freon"))) {
		to_chat(this, "You start breaking out of the ice cube!");
		if (yield* do_mob(this, this, 40)) {
			if (this.has_status_effect(T("/datum/status_effect/freon"))) {
				to_chat(this, "You break out of the ice cube!");
				yield* this.remove_status_effect(T("/datum/status_effect/freon"));
				yield* this.update_canmove();
			}
		}
	} else {
		if (!this.canmove) return f.dot;
		if (this.on_fire) {
			yield* this.resist_fire();
		} else {
			if (!(this.last_special <= rt.worldTime(f))) return f.dot;
			yield* this.resist_restraints();
		}
	}
	return f.dot;
}, true, { verb: { name: "Resist", category: "IC" } });

// living.dm:585
rt.def("/mob/living/proc/resist_grab", function* resist_grab(f: Frame, moving_resist: Value) {
	f.dot = 1;
	if (this.pulledby.grab_state) {
		if (prob(30 / this.pulledby.grab_state)) {
			this.visible_message(`<span class='danger'>${this} has broken free of ${this.pulledby}'s grip!</span>`);
			yield* this.pulledby.stop_pulling();
			return 0;
		}
		if (moving_resist && this.client) {
			this.client.move_delay = rt.worldTime(f) + 20;
		}
	} else {
		yield* this.pulledby.stop_pulling();
		return 0;
	}
	return f.dot;
}, true);

// living.dm:597
rt.def("/mob/living/proc/resist_buckle", function* resist_buckle(f: Frame) {
	yield* this.buckled.user_unbuckle_mob(this, this);
	return f.dot;
}, true);

// living.dm:609
rt.def("/mob/living/proc/update_gravity", function* update_gravity(f: Frame, has_gravity: Value, override: Value) {
	override ??= 0;
	if (!GLOB.SSticker.HasRoundStarted()) {
		return f.dot;
	}
	if (has_gravity) {
		yield* this.clear_alert("weightless");
	} else {
		yield* this.throw_alert("weightless", T("/obj/screen/alert/weightless"));
	}
	if (override) return f.dot;
	yield* this.float((!has_gravity ? 1 : 0));
	return f.dot;
}, true);

// living.dm:622
rt.def("/mob/living/proc/float", function* float(f: Frame, on: Value) {
	if (this.throwing) {
		return f.dot;
	}
	let fixed: Value = 0;
	if (this.anchored || this.buckled && this.buckled.anchored) {
		fixed = 1;
	}
	if (on && !this.floating && !fixed) {
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", this.pixel_y + 2, "time", 10, "loop", -1]);
		yield* sleep(10);
		rt.op(f, "Animate", [2, 8], [null, this, "pixel_y", this.pixel_y - 2, "time", 10, "loop", -1]);
		this.floating = 1;
	} else {
		if (!((!on || fixed) && this.floating)) return f.dot;
		rt.op(f, "Animate", [2, 6], [null, this, "pixel_y", this.get_standard_pixel_y_offset(this.lying), "time", 10]);
		this.floating = 0;
	}
	return f.dot;
}, true);

// living.dm:636
rt.def("/mob/living/proc/stripPanelUnequip", function* stripPanelUnequip(f: Frame, what: Value, who: Value, where: Value) {
	let L: Value = null;
	if (rt.bitAnd(what.flags, NODROP)) {
		to_chat(this, fmt("<span class='warning'>You can't remove ％！, it appears to be stuck!</span>", [what.name]));
		return f.dot;
	}
	who.visible_message(`<span class='danger'>${this} tries to remove ${who}'s ${what.name}.</span>`, `<span class='userdanger'>${this} tries to remove ${who}'s ${what.name}.</span>`);
	yield* what.add_fingerprint(this);
	if (!(yield* do_mob(this, who, what.strip_delay))) return f.dot;
	if (!(what && this.Adjacent(who))) return f.dot;
	if (rt.istype(where, T("/list"))) {
		L = where;
		if (what == who.get_item_for_held_index(rt.index(L, 2))) {
			if (yield* who.dropItemToGround(what)) {
				yield* add_logs(this, who, "stripped", { addition: `of ${what}` });
			}
		}
	}
	if (what != who.get_item_by_slot(where)) return f.dot;
	if (!(yield* who.dropItemToGround(what))) return f.dot;
	yield* add_logs(this, who, "stripped", { addition: `of ${what}` });
	return f.dot;
}, true);

// living.dm:656
rt.def("/mob/living/proc/stripPanelEquip", function* stripPanelEquip(f: Frame, what: Value, who: Value, where: Value) {
	let where_list: Value = null, final_where: Value = null;
	if ((what = this.get_active_held_item()) && rt.bitAnd(what.flags, NODROP)) {
		to_chat(this, fmt("<span class='warning'>You can't put ％！ on ＀, it's stuck to your hand!</span>", [what.name, who]));
		return f.dot;
	}
	if (!what) return f.dot;
	if (rt.istype(where, T("/list"))) {
		where_list = where;
		final_where = rt.index(where, 1);
	} else {
		final_where = where;
	}
	if (!(yield* what.mob_can_equip(who, this, final_where, 1, 1))) {
		to_chat(this, fmt("<span class='warning'>＄！ doesn't fit in that place!</span>", [what.name]));
		return f.dot;
	}
	this.visible_message(`<span class='notice'>${this} tries to put ${what} on ${who}.</span>`);
	if (!(yield* do_mob(this, who, what.equip_delay_other))) return f.dot;
	if (!(what && this.Adjacent(who) && (yield* what.mob_can_equip(who, this, final_where, 1, 1)))) return f.dot;
	if (!(yield* this.temporarilyRemoveItemFromInventory(what))) return f.dot;
	if (where_list) {
		if (!(yield* who.put_in_hand(what, rt.index(where_list, 2)))) {
			yield* what.forceMove(rt.getStep(f, who, 0));
		}
	} else {
		yield* who.equip_to_slot(what, where, 1);
	}
	return f.dot;
}, true);

// living.dm:685
rt.def("/mob/living/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (current_size >= STAGE_SIX) {
		yield* this.throw_at(S, 14, 3, { spin: 1 });
	} else {
		yield* step_towards(this, S);
	}
	return f.dot;
}, true);

// living.dm:691
rt.def("/mob/living/proc/do_jitter_animation", function do_jitter_animation(f: Frame, jitteriness: Value) {
	let amplitude: Value = min(4, jitteriness / 100 + 1);
	let pixel_x_diff: Value = rand(-amplitude, amplitude);
	let pixel_y_diff: Value = rand(-amplitude / 3, amplitude / 3);
	let final_pixel_x: Value = this.get_standard_pixel_x_offset(this.lying);
	let final_pixel_y: Value = this.get_standard_pixel_y_offset(this.lying);
	rt.op(f, "Animate", [2, 10], [null, this, "pixel_x", this.pixel_x + pixel_x_diff, "pixel_y", this.pixel_y + pixel_y_diff, "time", 2, "loop", 6]);
	rt.op(f, "Animate", [2, 6], ["pixel_x", final_pixel_x, "pixel_y", final_pixel_y, "time", 2]);
	this.floating = 0;
	return f.dot;
});

// living.dm:702
rt.def("/mob/living/proc/get_temperature", function get_temperature(f: Frame, environment: Value) {
	let M: Value = null, heat_turf: Value = null, C: Value = null, G: Value = null;
	let loc_temp: Value = T0C;
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		loc_temp = (M = this.loc).return_temperature();
	} else if (rt.istype(this.loc, T("/obj/structure/transit_tube_pod"))) {
		loc_temp = environment.temperature;
	} else if (rt.istype(rt.getStep(f, this, 0), T("/turf/open/space"))) {
		loc_temp = (heat_turf = rt.getStep(f, this, 0)).temperature;
	} else if (rt.istype(this.loc, T("/obj/machinery/atmospherics/components/unary/cryo_cell"))) {
		C = this.loc;
		if ((G = rt.index(C.airs, 1)).total_moles() < 10) {
			loc_temp = environment.temperature;
		} else {
			loc_temp = G.temperature;
		}
	} else {
		loc_temp = environment.temperature;
	}
	return loc_temp;
});

// living.dm:728
rt.def("/mob/living/proc/get_standard_pixel_x_offset", function get_standard_pixel_x_offset(f: Frame, lying: Value) {
	lying ??= 0;
	return rt.initial(f, this, "pixel_x");
});

// living.dm:731
rt.def("/mob/living/proc/get_standard_pixel_y_offset", function get_standard_pixel_y_offset(f: Frame, lying: Value) {
	lying ??= 0;
	return rt.initial(f, this, "pixel_y");
});

// living.dm:734
rt.def("/mob/living/proc/Stat", function* Stat(f: Frame) {
	let G: Value = null, B: Value = null;
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!(GLOB.SSticker && GLOB.SSticker.mode)) return f.dot;
	for (G of each(GLOB.SSticker.mode.gangs, T("/datum/gang"))) {
		if (G.is_dominating) {
			stat(null, `${G.name} Gang Takeover: ${max(G.domination_time_remaining(), 0)}`);
		}
	}
	if (!rt.istype(GLOB.SSticker.mode, T("/datum/game_mode/blob"))) return f.dot;
	if (!(B = GLOB.SSticker.mode).message_sent) return f.dot;
	stat(null, `Blobs to Blob Win: ${rt.len(f, GLOB.blobs_legit)}/${B.blobwincount}`);
	return f.dot;
}, true);

// living.dm:747
rt.def("/mob/living/cancel_camera", function* cancel_camera(f: Frame) {
	yield* parent_proc();
	this.cameraFollow = null;
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// living.dm:752
rt.def("/mob/living/proc/can_track", function can_track(f: Frame, user: Value) {
	let _T: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return 0;
	}
	if (_T.z == ZLEVEL_CENTCOM) {
		return 0;
	}
	if (_T.z >= ZLEVEL_SPACEMAX) {
		return 0;
	}
	if (user !== null && this == user) {
		return 0;
	}
	if (this.invisibility || this.alpha == 0) {
		return 0;
	}
	if (this.digitalcamo || this.digitalinvis) {
		return 0;
	}
	if (!near_camera(this)) {
		return 0;
	}
	return 1;
});

// living.dm:777
rt.def("/mob/living/proc/harvest", function* harvest(f: Frame, user: Value) {
	let path: Value = null, i: Value = null;
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	if (this.butcher_results) {
		for (path of each(this.butcher_results)) {
			i = 1;
			while (i <= rt.index(this.butcher_results, path)) {
				yield* new_(path, this.loc);
				i++;
			}
			yield* this.butcher_results.Remove(path);
		}
	}
	this.visible_message(`<span class='notice'>${user} butchers ${this}.</span>`);
	yield* this.gib(0, 0, 1);
	return f.dot;
}, true);

// living.dm:788
rt.def("/mob/living/proc/canUseTopic", function canUseTopic(f: Frame, M: Value, be_close: Value, no_dextery: Value) {
	be_close ??= 0;
	no_dextery ??= 0;
	if (this.incapacitated()) {
		return f.dot;
	}
	if (no_dextery) {
		if (be_close && get_dist(M, this) <= 1) {
			return 1;
		}
	} else {
		to_chat(this, "<span class='warning'>You don't have the dexterity to do this!</span>");
	}
	return f.dot;
});

// living.dm:797
rt.def("/mob/living/proc/can_use_guns", function can_use_guns(f: Frame, G: Value) {
	if (G.trigger_guard != -1 && !this.IsAdvancedToolUser()) {
		to_chat(this, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return 0;
	}
	return 1;
});

// living.dm:804
rt.def("/mob/living/carbon/proc/update_stamina", function* update_stamina(f: Frame) {
	let total_health: Value = null;
	if (this.staminaloss) {
		if ((total_health = this.health - this.staminaloss) <= 0 && !this.stat) {
			to_chat(this, "<span class='notice'>You're too exhausted to keep going...</span>");
			yield* this.Knockdown(100);
			yield* this.setStaminaLoss(this.health - 2);
		}
	}
	this.update_health_hud();
	return f.dot;
}, true);

// living.dm:816
rt.def("/mob/living/proc/owns_soul", function owns_soul(f: Frame) {
	if (this.mind) {
		return (this.mind.soulOwner == this.mind ? 1 : 0);
	}
	return 1;
});

// living.dm:822
rt.def("/mob/living/proc/return_soul", function* return_soul(f: Frame) {
	let devilInfo: Value = null;
	this.hellbound = 0;
	if (!this.mind) return f.dot;
	if (devilInfo = this.mind.soulOwner.has_antag_datum(T("/datum/antagonist/devil"))) {
		yield* devilInfo.remove_soul(this.mind);
	}
	this.mind.soulOwner = this.mind;
	return f.dot;
}, true);

// living.dm:828
rt.def("/mob/living/proc/has_bane", function has_bane(f: Frame, banetype: Value) {
	let devilInfo: Value = null;
	return ((devilInfo = is_devil(this)) && (banetype == devilInfo.bane ? 1 : 0));
});

// living.dm:832
rt.def("/mob/living/proc/check_weakness", function* check_weakness(f: Frame, weapon: Value, attacker: Value) {
	if (this.mind && this.mind.has_antag_datum(T("/datum/antagonist/devil"))) {
		return (yield* this.check_devil_bane_multiplier(weapon, attacker));
	}
	return 1;
}, true);

// living.dm:837
rt.def("/mob/living/proc/check_acedia", function check_acedia(f: Frame) {
	let A: Value = null;
	if (this.mind && this.mind.objectives) {
		for (A of each(this.mind.objectives, T("/datum/objective/sintouched/acedia"))) {
			return 1;
		}
	}
	return 0;
});

// living.dm:843
rt.def("/mob/living/proc/throw_at", function* throw_at(f: Frame) {
	if (f.args[4] === null) {
		f.args[4] = 1;
	}
	if (f.args[5] === null) {
		f.args[5] = 0;
	}
	yield* this.stop_pulling();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// living.dm:853
rt.def("/mob/living/proc/wabbajack_act", function* wabbajack_act(f: Frame, new_mob: Value) {
	let para: Value = null, G: Value = null;
	new_mob.name = this.real_name;
	new_mob.real_name = this.real_name;
	if (this.mind) {
		yield* this.mind.transfer_to(new_mob);
	} else {
		new_mob.key = this.key;
	}
	for (para of each(this.hasparasites())) {
		(G = para).summoner = new_mob;
		yield* G.Recall();
		to_chat(G, "<span class='holoparasite'>Your summoner has changed form!</span>");
	}
	return f.dot;
}, true);

// living.dm:873
rt.def("/mob/living/proc/IgniteMob", function* IgniteMob(f: Frame) {
	if (this.fire_stacks > 0 && !this.on_fire) {
		this.on_fire = 1;
		this.visible_message(`<span class='warning'>${this} catches fire!</span>`, "<span class='userdanger'>You're set on fire!</span>");
		this.set_light(3);
		yield* this.throw_alert("fire", T("/obj/screen/alert/fire"));
		this.update_fire();
		return 1;
	}
	return 0;
}, true);

// living.dm:887
rt.def("/mob/living/proc/ExtinguishMob", function* ExtinguishMob(f: Frame) {
	if (!this.on_fire) return f.dot;
	this.on_fire = 0;
	this.fire_stacks = 0;
	this.set_light(0);
	yield* this.clear_alert("fire");
	this.update_fire();
	return f.dot;
}, true);

// living.dm:892
rt.def("/mob/living/proc/adjust_fire_stacks", function* adjust_fire_stacks(f: Frame, add_fire_stacks: Value) {
	this.fire_stacks = max(-20, min(this.fire_stacks + add_fire_stacks, 20));
	if (!(this.on_fire && this.fire_stacks <= 0)) return f.dot;
	yield* this.ExtinguishMob();
	return f.dot;
}, true);

// living.dm:899
rt.def("/mob/living/proc/spreadFire", function* spreadFire(f: Frame, L: Value) {
	if (!rt.istype(L, T("/mob/living"))) {
		return f.dot;
	}
	let L_old_on_fire: Value = L.on_fire;
	if (this.on_fire) {
		this.fire_stacks /= 2;
		L.fire_stacks += this.fire_stacks;
		if (yield* L.IgniteMob()) {
			log_game(`${key_name(this)} bumped into ${key_name(L)} and set them on fire`);
		}
	}
	if (!L_old_on_fire) return f.dot;
	L.fire_stacks /= 2;
	this.fire_stacks += L.fire_stacks;
	yield* this.IgniteMob();
	return f.dot;
}, true);

// living.dm:918
rt.def("/mob/living/proc/knockOver", function* knockOver(f: Frame, C: Value) {
	if (C.key) {
		C.visible_message(`<span class='warning'>${pick(`${C} dives out of ${this}'s way!`, `${C} stumbles over ${this}!`, `${C} jumps out of ${this}'s path!`, `${C} trips over ${this} and falls!`, `${C} topples over ${this}!`, `${C} leaps out of ${this}'s way!`)}</span>`);
	}
	yield* C.Knockdown(40);
	return f.dot;
}, true);

// living.dm:930
rt.def("/mob/living/proc/post_buckle_mob", function* post_buckle_mob(f: Frame, M: Value) {
	if (!this.riding_datum) return f.dot;
	yield* this.riding_datum.handle_vehicle_offsets();
	this.riding_datum.handle_vehicle_layer();
	return f.dot;
}, true);

// living.dm:934
rt.def("/mob/living/proc/ConveyorMove", function ConveyorMove(f: Frame) {
	if (rt.bitAnd(this.movement_type, 2) && !this.stat) {
		return f.dot;
	}
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// living.dm:939
rt.def("/mob/living/proc/can_be_pulled", function can_be_pulled(f: Frame) {
	return (parent_proc() && (!(this.buckled && this.buckled.buckle_prevents_pull) ? 1 : 0));
});

// living.dm:944
rt.def("/mob/living/proc/update_canmove", function* update_canmove(f: Frame) {
	let ko: Value = (((this.IsKnockdown() || this.IsUnconscious()) || this.stat) || rt.bitAnd(this.status_flags, FAKEDEATH));
	let chokehold: Value = (this.pulledby && (this.pulledby.grab_state >= 2 ? 1 : 0));
	let buckle_lying: Value = (!(this.buckled && !this.buckled.buckle_lying) ? 1 : 0);
	let has_legs: Value = this.get_num_legs();
	let has_arms: Value = this.get_num_arms();
	let ignore_legs: Value = this.get_leg_ignore();
	if (ko || this.resting || this.has_status_effect(T("/datum/status_effect/incapacitating/stun")) || chokehold) {
		yield* this.drop_all_held_items();
		yield* this.unset_machine();
		if (this.pulling) {
			yield* this.stop_pulling();
		}
	} else if (has_legs || ignore_legs) {
		this.lying = 0;
	}
	if (this.buckled) {
		this.lying = 90 * buckle_lying;
	} else if (!this.lying) {
		if (this.resting) {
			yield* this.fall();
		} else if (ko || !has_legs && !ignore_legs || chokehold) {
			yield* this.fall({ forced: 1 });
		}
	}
	this.canmove = (!(ko || this.resting || this.has_status_effect(T("/datum/status_effect/incapacitating/stun")) || this.has_status_effect(T("/datum/status_effect/freon")) || chokehold || this.buckled || !has_legs && !ignore_legs && !has_arms) ? 1 : 0);
	this.density = (!this.lying ? 1 : 0);
	if (this.lying) {
		if (this.layer == rt.initial(f, this, "layer")) {
			this.layer = LYING_MOB_LAYER;
		}
	} else if (this.layer == LYING_MOB_LAYER) {
		this.layer = rt.initial(f, this, "layer");
	}
	yield* this.update_transform();
	if (!this.lying && this.lying_prev) {
		if (this.client) {
			this.client.move_delay = rt.worldTime(f) + (yield* this.movement_delay());
		}
	}
	this.lying_prev = this.lying;
	return this.canmove;
}, true);
