// Based on /tg/station's code/modules/mob/mob_movement.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// mob_movement.dm:2
rt.def("/mob/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/obj/item/projectile")) || mover.throwing) {
		return ((!this.density ? 1 : 0) || this.lying);
	}
	if (mover.checkpass(16)) {
		return 1;
	}
	if (this.buckled == mover) {
		return 1;
	}
	if (ismob(mover)) {
		if (rt.isIn(f, mover, this.buckled_mobs)) {
			return 1;
		}
	}
	return (((!mover.density ? 1 : 0) || (!this.density ? 1 : 0)) || this.lying);
});

// mob_movement.dm:21
rt.def("/client/verb/moveup", function* moveup(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 1), 1);
	return f.dot;
}, true, { verb: { name: ".moveup" } });

// mob_movement.dm:26
rt.def("/client/verb/movedown", function* movedown(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 2), 2);
	return f.dot;
}, true, { verb: { name: ".movedown" } });

// mob_movement.dm:31
rt.def("/client/verb/moveright", function* moveright(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 4), 4);
	return f.dot;
}, true, { verb: { name: ".moveright" } });

// mob_movement.dm:36
rt.def("/client/verb/moveleft", function* moveleft(f: Frame) {
	yield* this.Move(rt.getStep(f, this.mob, 8), 8);
	return f.dot;
}, true, { verb: { name: ".moveleft" } });

// mob_movement.dm:39
rt.def("/client/proc/Northeast", function Northeast(f: Frame) {
	this.swap_hand();
	return f.dot;
});

// mob_movement.dm:44
rt.def("/client/proc/Southeast", function* Southeast(f: Frame) {
	yield* this.attack_self();
	return f.dot;
}, true);

// mob_movement.dm:49
rt.def("/client/proc/Southwest", function Southwest(f: Frame) {
	let C: Value = null;
	if (rt.istype(f.usr, T("/mob/living/carbon"))) {
		(C = f.usr).toggle_throw_mode();
	} else {
		to_chat(f.usr, "<span class='danger'>This mob type cannot throw items.</span>");
	}
	return f.dot;
});

// mob_movement.dm:58
rt.def("/client/proc/Northwest", function* Northwest(f: Frame) {
	if (!f.usr.get_active_held_item()) {
		to_chat(f.usr, "<span class='warning'>You have nothing to drop in your hand!</span>");
		return f.dot;
	}
	yield* f.usr.drop_item();
	return f.dot;
}, true);

// mob_movement.dm:67
rt.def("/client/verb/delete_key_pressed", function* delete_key_pressed(f: Frame) {
	if (!f.usr.pulling) {
		to_chat(f.usr, "<span class='notice'>You are not pulling anything.</span>");
		return f.dot;
	}
	yield* f.usr.stop_pulling();
	return f.dot;
}, true, { hidden: true });

// mob_movement.dm:77
rt.def("/client/verb/swap_hand", function swap_hand(f: Frame) {
	if (!this.mob) return f.dot;
	this.mob.swap_hand();
	return f.dot;
}, false, { verb: { name: "Swap hands", category: "IC" } });

// mob_movement.dm:82
rt.def("/client/verb/attack_self", function* attack_self(f: Frame) {
	if (this.mob) {
		yield* this.mob.mode();
	}
	return f.dot;
}, true, { hidden: true });

// mob_movement.dm:88
rt.def("/client/verb/drop_item", function* drop_item(f: Frame) {
	if (!rt.istype(this.mob, T("/mob/living/silicon/robot"))) {
		yield* this.mob.drop_item_v();
	}
	return f.dot;
}, true, { hidden: true });

// Empty in tg.
rt.def("/client/verb/Center", undefined, false, { verb: { name: ".center" } });

// mob_movement.dm:94
rt.def("/client/proc/Center", function* Center(f: Frame) {
	let O: Value = null;
	if (rt.istype(this.mob.loc, T("/obj"))) {
		O = this.mob.loc;
		if (this.mob.canmove) {
			return (yield* O.relaymove(this.mob, 0));
		}
	}
	return f.dot;
}, true);

// mob_movement.dm:102
rt.def("/client/proc/Move_object", function* Move_object(f: Frame, direct: Value) {
	if (this.mob && this.mob.control_object) {
		if (this.mob.control_object.density) {
			yield* step(this.mob.control_object, direct);
			if (!this.mob.control_object) {
				return f.dot;
			}
			yield* this.mob.control_object.setDir(direct);
		} else {
			this.mob.control_object.loc = rt.getStep(f, this.mob.control_object, direct);
		}
	}
	return f.dot;
}, true);

// mob_movement.dm:115
rt.def("/client/proc/Move", function* Move(f: Frame, n: Value, direct: Value) {
	let L: Value = null, O: Value = null;
	if (rt.worldTime(f) < this.move_delay) {
		return 0;
	}
	let old_move_delay: Value = this.move_delay;
	this.move_delay = rt.worldTime(f) + rt.world().tick_lag;
	if (!this.mob || !this.mob.loc) {
		return 0;
	}
	if (this.mob.notransform) {
		return 0;
	}
	if (this.mob.control_object) {
		return (yield* this.Move_object(direct));
	}
	if (!rt.istype(this.mob, T("/mob/living"))) {
		this.mob.glide_size = max(1, min(32 / max((yield* this.mob.movement_delay()) / rt.world().tick_lag, 1), 32));
		return (yield* this.mob.Move(n, direct));
	}
	if (this.mob.stat == 2) {
		yield* this.mob.ghostize();
		return 0;
	}
	if (this.moving) {
		return 0;
	}
	if (this.mob.force_moving) {
		return 0;
	}
	if (rt.istype(this.mob, T("/mob/living"))) {
		if ((L = this.mob).incorporeal_move) {
			yield* this.Process_Incorpmove(direct);
			return 0;
		}
	}
	if (this.mob.remote_control) {
		return (yield* this.mob.remote_control.relaymove(this.mob, direct));
	}
	if (rt.istype(this.mob, T("/mob/living/silicon/ai"))) {
		return (yield* this.AIMove(n, direct, this.mob));
	}
	if (yield* this.Process_Grab()) {
		return f.dot;
	}
	if (this.mob.buckled) {
		return (yield* this.mob.buckled.relaymove(this.mob, direct));
	}
	if (!this.mob.canmove) {
		return 0;
	}
	if (rt.istype(this.mob.loc, T("/obj")) || ismob(this.mob.loc)) {
		return (yield* (O = this.mob.loc).relaymove(this.mob, direct));
	}
	if (!(yield* this.mob.Process_Spacemove(direct))) {
		return 0;
	}
	this.moving = 1;
	let delay: Value = (yield* this.mob.movement_delay());
	this.mob.glide_size = max(1, min(32 / max(delay / rt.world().tick_lag, 1), 32));
	if (old_move_delay + delay * 1.25 + 0.75 > rt.worldTime(f)) {
		this.move_delay = old_move_delay + delay;
	} else {
		this.move_delay = delay + rt.worldTime(f);
	}
	if (this.mob.confused) {
		if (this.mob.confused > 40) {
			yield* step(this.mob, pick(GLOB.cardinal));
		} else if (prob(this.mob.confused * 1.5)) {
			yield* step(this.mob, angle2dir(dir2angle(direct) + pick(90, -90)));
		} else if (prob(this.mob.confused * 3)) {
			yield* step(this.mob, angle2dir(dir2angle(direct) + pick(45, -45)));
		} else {
			yield* step(this.mob, direct);
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	this.moving = 0;
	if (this.mob && f.dot) {
		if (this.mob.throwing) {
			yield* this.mob.throwing.finalize(0);
		}
	}
	return f.dot;
}, true);

// mob_movement.dm:192
rt.def("/mob/proc/Moved", function* Moved(f: Frame, oldLoc: Value, dir: Value) {
	let O: Value = null;
	f.dot = (yield* parent_proc());
	for (O of each(this.contents, T("/obj"))) {
		yield* O.on_mob_move(dir, this, oldLoc);
	}
	return f.dot;
}, true);

// mob_movement.dm:197
rt.def("/mob/proc/setDir", function* setDir(f: Frame, newDir: Value) {
	let O: Value = null;
	f.dot = (yield* parent_proc());
	for (O of each(this.contents, T("/obj"))) {
		yield* O.on_mob_turn(newDir, this);
	}
	return f.dot;
}, true);

// mob_movement.dm:206
rt.def("/client/proc/Process_Grab", function* Process_Grab(f: Frame) {
	if (!this.mob.pulledby) return f.dot;
	if (yield* this.mob.incapacitated({ ignore_restraints: 1 })) {
		this.move_delay = rt.worldTime(f) + 10;
		return 1;
	} else if (yield* this.mob.restrained({ ignore_grab: 1 })) {
		this.move_delay = rt.worldTime(f) + 10;
		to_chat(this, "<span class='warning'>You're restrained! You can't move!</span>");
		return 1;
	} else {
		return (yield* this.mob.resist_grab(1));
	}
}, true);

// mob_movement.dm:222
rt.def("/client/proc/Process_Incorpmove", function* Process_Incorpmove(f: Frame, direct: Value) {
	let L: Value = null, locx: Value = null, locy: Value = null, limit: Value = null, _T: Value = null, stepTurf: Value = null, S: Value = null, R: Value = null;
	let $e: any;
	let mobloc: Value = rt.getStep(f, this.mob, 0);
	if (!rt.istype(this.mob, T("/mob/living"))) {
		return f.dot;
	}
	const incorporeal_move = (L = this.mob).incorporeal_move;
	if (incorporeal_move === INCORPOREAL_MOVE_BASIC) {
		L.loc = rt.getStep(f, L, direct);
		yield* L.setDir(direct);
	} else if (incorporeal_move === INCORPOREAL_MOVE_SHADOW) {
		if (prob(50)) {
			if (direct === INCORPOREAL_MOVE_BASIC) {
				locx = mobloc.x;
				if ((locy = mobloc.y + INCORPOREAL_MOVE_SHADOW) > rt.world().maxy) {
					return f.dot;
				}
			} else if (direct === 2) {
				locx = mobloc.x;
				if ((locy = mobloc.y - 2) < 1) {
					return f.dot;
				}
			} else if (direct === 4) {
				locy = mobloc.y;
				if ((locx = mobloc.x + 2) > rt.world().maxx) {
					return f.dot;
				}
			} else if (direct === 8) {
				locy = mobloc.y;
				if ((locx = mobloc.x - 2) < 1) {
					return f.dot;
				}
			} else {
				return f.dot;
			}
			L.loc = rt.locate(locx, locy, mobloc.z);
			limit = 2;
			for (_T of each(getline(mobloc, L.loc), T("/turf"))) {
				yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja/shadow"), _T, L.dir);
				limit--;
				if (limit <= 0) {
					break;
				}
			}
		} else {
			yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja/shadow"), mobloc, L.dir);
			L.loc = rt.getStep(f, L, direct);
		}
		yield* L.setDir(direct);
	} else if (incorporeal_move === INCORPOREAL_MOVE_JAUNT) {
		stepTurf = rt.getStep(f, L, direct);
		for (S of each(stepTurf, T("/obj/effect/decal/cleanable/salt"))) {
			to_chat(L, `<span class='warning'>${S} bars your passage!</span>`);
			if (rt.istype(L, T("/mob/living/simple_animal/revenant"))) {
				(R = L).reveal(20);
				R.stun(20);
			}
			return f.dot;
		}
		if (rt.bitAnd(stepTurf.flags, 1)) {
			to_chat(L, "<span class='warning'>Holy energies block your path.</span>");
		} else {
			L.loc = rt.getStep(f, L, direct);
			yield* L.setDir(direct);
		}
	}
	return 1;
}, true);

// mob_movement.dm:290
rt.def("/mob/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	let backup: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (yield* parent_proc()) {
		return 1;
	}
	if (backup = (yield* this.get_spacemove_backup())) {
		if (rt.istype(backup, T("/atom/movable")) && f.args[0] && !backup.anchored) {
			if (yield* backup.newtonian_move(turn(f.args[0], 180))) {
				to_chat(this, `<span class='info'>You push off of ${backup} to propel yourself.</span>`);
			}
		}
		return 1;
	}
	return 0;
}, true, { args: ["movement_dir"] });

// mob_movement.dm:301
rt.def("/mob/proc/get_spacemove_backup", function* get_spacemove_backup(f: Frame) {
	let A: Value = null, turf: Value = null, AM: Value = null, M: Value = null;
	for (A of each(orange(1, rt.getStep(f, this, 0)))) {
		if (isarea(A)) {
			continue;
		}
		if (isturf(A)) {
			if (rt.istype((turf = A), T("/turf/open/space"))) {
				continue;
			}
			if (!turf.density && !this.mob_negates_gravity()) {
				continue;
			}
			return A;
		} else {
			if ((AM = A) == this.buckled) {
				continue;
			}
			if (ismob(AM)) {
				if ((M = AM).buckled) {
					continue;
				}
			}
			if (!(yield* AM.CanPass(this)) || AM.density) {
				if (AM.anchored) {
					return AM;
				}
				if (this.pulling == AM) {
					continue;
				}
				f.dot = AM;
			}
		}
	}
	return f.dot;
}, true);

// mob_movement.dm:327
rt.def("/mob/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return this.has_gravity();
});

// mob_movement.dm:334
rt.def("/mob/proc/Move_Pulled", function* Move_Pulled(f: Frame, A: Value) {
	let L: Value = null;
	if (!this.pulling) {
		return f.dot;
	}
	if (this.pulling.anchored || !this.pulling.Adjacent(this)) {
		yield* this.stop_pulling();
		return f.dot;
	}
	if (rt.istype(this.pulling, T("/mob/living"))) {
		if ((L = this.pulling).buckled && L.buckled.buckle_prevents_pull) {
			yield* this.stop_pulling();
			return f.dot;
		}
	}
	if (A == this.loc && this.pulling.density) {
		return f.dot;
	}
	if (!(yield* this.Process_Spacemove(rt.getDir(f, this.pulling.loc, A)))) {
		return f.dot;
	}
	yield* step(this.pulling, rt.getDir(f, this.pulling.loc, A));
	return f.dot;
}, true);

// mob_movement.dm:363
rt.def("/client/proc/check_has_body_select", function check_has_body_select(f: Frame) {
	return (((this.mob && this.mob.hud_used) && this.mob.hud_used.zone_select) && (rt.istype(this.mob.hud_used.zone_select, T("/obj/screen/zone_sel")) ? 1 : 0));
});

// mob_movement.dm:369
rt.def("/client/verb/body_toggle_head", function body_toggle_head(f: Frame) {
	let next_in_line: Value = null, selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	if (this.mob.zone_selected === "head") {
		next_in_line = "eyes";
	} else if (this.mob.zone_selected === "eyes") {
		next_in_line = "mouth";
	} else {
		next_in_line = "head";
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone(next_in_line, this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-toggle-head" } });

// mob_movement.dm:388
rt.def("/client/verb/body_r_arm", function body_r_arm(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("r_arm", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-r-arm" } });

// mob_movement.dm:398
rt.def("/client/verb/body_chest", function body_chest(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("chest", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-chest" } });

// mob_movement.dm:408
rt.def("/client/verb/body_l_arm", function body_l_arm(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("l_arm", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-l-arm" } });

// mob_movement.dm:418
rt.def("/client/verb/body_r_leg", function body_r_leg(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("r_leg", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-r-leg" } });

// mob_movement.dm:428
rt.def("/client/verb/body_groin", function body_groin(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("groin", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-groin" } });

// mob_movement.dm:438
rt.def("/client/verb/body_l_leg", function body_l_leg(f: Frame) {
	let selector: Value = null;
	if (!this.check_has_body_select()) {
		return f.dot;
	}
	(selector = this.mob.hud_used.zone_select).set_selected_zone("l_leg", this.mob);
	return f.dot;
}, false, { hidden: true, verb: { name: "body-l-leg" } });

// mob_movement.dm:449
rt.def("/client/verb/toggle_walk_run", function* toggle_walk_run(f: Frame) {
	if (!this.mob) return f.dot;
	yield* this.mob.toggle_move_intent();
	return f.dot;
}, true, { hidden: true, verb: { name: "toggle-walk-run" } });

// mob_movement.dm:452
rt.def("/mob/proc/toggle_move_intent", function* toggle_move_intent(f: Frame) {
	let selector: Value = null;
	if (!(this.hud_used && this.hud_used.static_inventory)) return f.dot;
	for (selector of each(this.hud_used.static_inventory, T("/obj/screen/mov_intent"))) {
		yield* selector.toggle(this);
	}
	return f.dot;
}, true);
