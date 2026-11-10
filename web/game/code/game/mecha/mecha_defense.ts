// Based on /tg/station's code/game/mecha/mecha_defense.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


// mecha_defense.dm:2
rt.def("/obj/mecha/proc/get_armour_facing", function get_armour_facing(f: Frame, relative_dir: Value) {
	if (relative_dir === 0) {
		return rt.index(this.facing_modifiers, 3);
	} else if (relative_dir === 45 || relative_dir === 90 || relative_dir === 270 || relative_dir === 315) {
		return rt.index(this.facing_modifiers, 2);
	} else if (relative_dir === 225 || relative_dir === 180 || relative_dir === 135) {
		return rt.index(this.facing_modifiers, 1);
	}
	return 1;
});

// mecha_defense.dm:12
rt.def("/obj/mecha/proc/take_damage", function* take_damage(f: Frame) {
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
	yield* this.spark_system.start();
	const subject = f.args[2];
	if (subject === "fire") {
		yield* this.check_for_internal_damage(list(1, 2));
	} else if (subject === "melee") {
		yield* this.check_for_internal_damage(list(2, 8, 16));
	} else {
		yield* this.check_for_internal_damage(list(1, 2, 8, 16, 4));
	}
	if (f.dot >= 5 || prob(33)) {
		this.occupant_message("<span class='userdanger'>Taking damage!</span>");
	}
	this.log_append_to_last(`Took ${f.args[0]} points of damage. Damage type: "${f.args[1]}".`, 1);
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// mecha_defense.dm:27
rt.def("/obj/mecha/proc/run_obj_armor", function* run_obj_armor(f: Frame) {
	let B: Value = null, facing_modifier: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	let booster_deflection_modifier: Value = 1;
	let booster_damage_modifier: Value = 1;
	if (f.args[2] == "bullet" || f.args[2] == "laser" || f.args[2] == "energy") {
		for (B of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment/antiproj_armor_booster"))) {
			if (yield* B.projectile_react()) {
				booster_deflection_modifier = B.deflect_coeff;
				booster_damage_modifier = B.damage_coeff;
				break;
			}
		}
	} else if (f.args[2] == "melee") {
		B = null;
		for (B of each(this.equipment, T("/obj/item/mecha_parts/mecha_equipment/anticcw_armor_booster"))) {
			if (yield* B.attack_react()) {
				booster_deflection_modifier *= B.deflect_coeff;
				booster_damage_modifier *= B.damage_coeff;
				break;
			}
		}
	}
	if (f.args[3]) {
		booster_damage_modifier /= (facing_modifier = this.get_armour_facing(dir2angle(f.args[3]) - dir2angle(this)));
		booster_deflection_modifier *= facing_modifier;
	}
	if (prob(this.deflect_chance * booster_deflection_modifier)) {
		this.visible_message(`<span class='danger'>${this}'s armour deflects the attack!</span>`);
		this.log_append_to_last("Armor saved.");
		return 0;
	}
	if (!f.dot) return f.dot;
	f.dot *= booster_damage_modifier;
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// mecha_defense.dm:56
rt.def("/obj/mecha/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	user.changeNext_move(8);
	yield* user.do_attack_animation(this, "punch");
	playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 40, 1, -1);
	user.visible_message(`<span class='danger'>${user} hits ${this.name}. Nothing happens</span>`, null, null, 3);
	this.log_message(`Attack by hand/paw. Attacker - ${user}.`, 1);
	this.log_append_to_last("Armor saved.");
	return f.dot;
}, true);

// mecha_defense.dm:64
rt.def("/obj/mecha/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// mecha_defense.dm:68
rt.def("/obj/mecha/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	this.log_message(`Attack by alien. Attacker - ${user}.`, 1);
	playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 100, 1);
	yield* this.attack_generic(user, 15, "brute", "melee", 0);
	return f.dot;
}, true);

// mecha_defense.dm:73
rt.def("/obj/mecha/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	let play_soundeffect: Value = null, animal_damage: Value = null;
	this.log_message(`Attack by simple animal. Attacker - ${user}.`, 1);
	if (!user.melee_damage_upper && !user.obj_damage) {
		yield* user.emote("custom", { message: `${user.friendly} ${this}.` });
		return 0;
	} else {
		play_soundeffect = 1;
		if (user.environment_smash) {
			play_soundeffect = 0;
			playsound(this, rt.rsc("sound/effects/bang.ogg"), 50, 1);
		}
		animal_damage = rand(user.melee_damage_lower, user.melee_damage_upper);
		if (user.obj_damage) {
			animal_damage = user.obj_damage;
		}
		animal_damage = min(animal_damage, 20 * user.environment_smash);
		yield* this.attack_generic(user, animal_damage, user.melee_damage_type, "melee", play_soundeffect);
		add_logs(user, this, "attacked");
		return 1;
	}
}, true);

// mecha_defense.dm:95
rt.def("/obj/mecha/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	this.log_message(`Attack by hulk. Attacker - ${user}.`, 1);
	add_logs(user, this, "punched", "hulk powers");
	return f.dot;
}, true);

// mecha_defense.dm:101
rt.def("/obj/mecha/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.take_damage(30, "brute", "melee", 0, rt.getDir(f, this, B));
	return f.dot;
}, true);

// mecha_defense.dm:107
rt.def("/obj/mecha/proc/hitby", function* hitby(f: Frame, A: Value) {
	this.log_message(`Hit by ${A}.`, 1);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mecha_defense.dm:112
rt.def("/obj/mecha/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	this.log_message(`Hit by projectile. Type: ${Proj.name}(${Proj.flag}).`, 1);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mecha_defense.dm:116
rt.def("/obj/mecha/proc/ex_act", function ex_act(f: Frame) {
	this.log_message(`Affected by explosion of severity: ${f.args[0]}.`, 1);
	if (prob(this.deflect_chance)) {
		f.args[0]++;
		this.log_append_to_last(`Armor saved, changing severity to ${f.args[0]}.`);
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["severity", "target"], waitfor: false });

// mecha_defense.dm:123
rt.def("/obj/mecha/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	let X: Value = null, ME: Value = null, Y: Value = null, MT: Value = null;
	severity++;
	for (X of each(this.equipment)) {
		(ME = X).ex_act(severity, target);
	}
	for (Y of each(this.trackers)) {
		(MT = Y).ex_act(severity, target);
	}
	if (!this.occupant) return f.dot;
	this.occupant.ex_act(severity, target);
	return f.dot;
});

// mecha_defense.dm:134
rt.def("/obj/mecha/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.occupant) return f.dot;
	this.occupant = null;
	this.icon_state = rt.initial(f, this, "icon_state") + "-open";
	this.setDir(this.dir_in);
	return f.dot;
});

// mecha_defense.dm:140
rt.def("/obj/mecha/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.get_charge()) {
		yield* this.use_power(this.cell.charge / 3 / (severity * 2));
		yield* this.take_damage(30 / severity, "fire", "energy", 1);
	}
	this.log_message("EMP detected", 1);
	yield* this.check_for_internal_damage(list(1, 2, 16, 4), 1);
	return f.dot;
}, true);

// mecha_defense.dm:147
rt.def("/obj/mecha/proc/temperature_expose", function* temperature_expose(f: Frame, air: Value, exposed_temperature: Value, exposed_volume: Value) {
	if (!(exposed_temperature > this.max_temperature)) return f.dot;
	this.log_message("Exposed to dangerous temperature.", 1);
	yield* this.take_damage(5, "fire", 0, 1);
	return f.dot;
}, true);

// mecha_defense.dm:153
rt.def("/obj/mecha/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let E: Value = null, id_card: Value = null, pda: Value = null, CC: Value = null, C: Value = null, WT: Value = null;
	if (rt.istype(W, T("/obj/item/device/mmi"))) {
		if (yield* this.mmi_move_inside(W, user)) {
			to_chat(user, `${this}-${W} interface initialized successfully.`);
		} else {
			to_chat(user, `${this}-${W} interface initialization failed.`);
		}
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/mecha_parts/mecha_equipment"))) {
		E = W;
		rt.spawnTail(f, 0, "/obj/mecha/proc/attackby: spawn at game/mecha/mecha_defense.dm:162", E, id_card, pda, CC, C, WT);
		return f.dot;
	}
	if (W.GetID()) {
		if (this.add_req_access || this.maint_access) {
			if (this.internals_access_allowed(user)) {
				if (rt.istype(W, T("/obj/item/weapon/card/id"))) {
					id_card = W;
				} else {
					id_card = (pda = W).id;
				}
				this.output_maintenance_dialog(id_card, user);
				return f.dot;
			} else {
				to_chat(user, "<span class='warning'>Invalid ID: Access denied.</span>");
			}
		} else {
			to_chat(user, "<span class='warning'>Maintenance protocols disabled by operator.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.state == 1) {
			this.state = 2;
			to_chat(user, "<span class='notice'>You undo the securing bolts.</span>");
		} else if (this.state == 2) {
			this.state = 1;
			to_chat(user, "<span class='notice'>You tighten the securing bolts.</span>");
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		if (this.state == 2) {
			this.state = 3;
			to_chat(user, "<span class='notice'>You open the hatch to the power unit.</span>");
		} else if (this.state == 3) {
			this.state = 2;
			to_chat(user, "<span class='notice'>You close the hatch to the power unit.</span>");
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		if (this.state == 3 && rt.bitAnd(this.internal_damage, 4)) {
			if (yield* (CC = W).use(2)) {
				this.clearInternalDamage(4);
				to_chat(user, "<span class='notice'>You replace the fused wires.</span>");
			} else {
				to_chat(user, "<span class='warning'>You need two lengths of cable to fix this mech!</span>");
			}
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && user.a_intent != "harm") {
		if (rt.bitAnd(this.internal_damage, 2)) {
			this.clearInternalDamage(2);
			to_chat(user, "<span class='notice'>You repair the damaged temperature controller.</span>");
		} else if (this.state == 3 && this.cell) {
			yield* this.cell.forceMove(this.loc);
			this.cell = null;
			this.state = 4;
			to_chat(user, "<span class='notice'>You unscrew and pry out the powercell.</span>");
			this.log_message("Powercell removed");
		} else if (this.state == 4 && this.cell) {
			this.state = 3;
			to_chat(user, "<span class='notice'>You screw the cell in place.</span>");
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell"))) {
		if (this.state == 4) {
			if (!this.cell) {
				if (!(yield* user.drop_item())) {
					return f.dot;
				}
				C = W;
				to_chat(user, "<span class='notice'>You install the powercell.</span>");
				yield* C.forceMove(this);
				this.cell = C;
				this.log_message("Powercell installed");
			} else {
				to_chat(user, "<span class='notice'>There's already a powercell installed.</span>");
			}
		}
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm") {
		user.changeNext_move(8);
		WT = W;
		if (this.obj_integrity < this.max_integrity) {
			if (yield* WT.remove_fuel(0, user)) {
				if (rt.bitAnd(this.internal_damage, 8)) {
					this.clearInternalDamage(8);
					to_chat(user, "<span class='notice'>You repair the damaged gas tank.</span>");
				} else {
					user.visible_message(`<span class='notice'>${user} repairs some damage to ${this.name}.</span>`);
					this.obj_integrity += min(10, this.max_integrity - this.obj_integrity);
				}
			} else {
				to_chat(user, "<span class='warning'>The welder must be on for this task!</span>");
				return 1;
			}
		} else {
			to_chat(user, `<span class='warning'>The ${this.name} is at full integrity!</span>`);
		}
		return 1;
	} else if (rt.istype(W, T("/obj/item/mecha_parts/mecha_tracking"))) {
		if (!(yield* user.transferItemToLoc(W, this))) {
			to_chat(user, fmt("<span class='warning'>％！ is stuck to your hand, you cannot put it in ％！!</span>", [W, this]));
			return f.dot;
		}
		this.trackers += W;
		user.visible_message(`${user} attaches ${W} to ${this}.`, `<span class='notice'>You attach ${W} to ${this}.</span>`);
		this.diag_hud_set_mechtracking();
		return f.dot;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// a spawn(0) body of /obj/mecha/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/mecha/proc/attackby: spawn at game/mecha/mecha_defense.dm:162", function* (f: Frame, E: Value, id_card: Value, pda: Value, CC: Value, C: Value, WT: Value) {
	if (E.can_attach(this)) {
		if (!(yield* f.args[1].drop_item())) {
			return f.dot;
		}
		yield* E.attach(this);
		f.args[1].visible_message(`${f.args[1]} attaches ${f.args[0]} to ${this}.`, `<span class='notice'>You attach ${f.args[0]} to ${this}.</span>`);
	} else {
		to_chat(f.args[1], `<span class='warning'>You were unable to attach ${f.args[0]} to ${this}!</span>`);
	}
	return null;
});

// mecha_defense.dm:270
rt.def("/obj/mecha/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	this.log_message(`Attacked by ${I}. Attacker - ${user}`);
	yield* parent_proc();
	return f.dot;
}, true);

// mecha_defense.dm:274
rt.def("/obj/mecha/proc/mech_toxin_damage", function* mech_toxin_damage(f: Frame, target: Value) {
	playsound(this, rt.rsc("sound/effects/spray2.ogg"), 50, 1);
	if (!target.reagents) return f.dot;
	if (target.reagents.get_reagent_amount("cryptobiolin") + this.force < this.force * 2) {
		yield* target.reagents.add_reagent("cryptobiolin", this.force / 2);
	}
	if (!(target.reagents.get_reagent_amount("toxin") + this.force < this.force * 2)) return f.dot;
	yield* target.reagents.add_reagent("toxin", this.force / 2.5);
	return f.dot;
}, true);

// mecha_defense.dm:283
rt.def("/obj/mecha/proc/mech_melee_attack", function* mech_melee_attack(f: Frame, M: Value) {
	if (!this.has_charge(this.melee_energy_drain)) {
		return 0;
	}
	yield* this.use_power(this.melee_energy_drain);
	if (!(M.damtype == "brute" || M.damtype == "fire")) return f.dot;
	add_logs(M.occupant, this, "attacked", M, `(INTENT: ${uppertext(M.occupant.a_intent)}) (DAMTYPE: ${uppertext(M.damtype)})`);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mecha_defense.dm:291
rt.def("/obj/mecha/proc/full_repair", function full_repair(f: Frame, charge_cell: Value) {
	this.obj_integrity = this.max_integrity;
	if (this.cell && charge_cell) {
		this.cell.charge = this.cell.maxcharge;
	}
	if (rt.bitAnd(this.internal_damage, 1)) {
		this.clearInternalDamage(1);
	}
	if (rt.bitAnd(this.internal_damage, 2)) {
		this.clearInternalDamage(2);
	}
	if (rt.bitAnd(this.internal_damage, 4)) {
		this.clearInternalDamage(4);
	}
	if (rt.bitAnd(this.internal_damage, 8)) {
		this.clearInternalDamage(8);
	}
	if (!rt.bitAnd(this.internal_damage, 16)) return f.dot;
	this.clearInternalDamage(16);
	return f.dot;
});

// mecha_defense.dm:307
rt.def("/obj/mecha/proc/narsie_act", function* narsie_act(f: Frame) {
	if (!this.occupant) return f.dot;
	let L: Value = this.occupant;
	yield* this.go_out(1);
	if (!L) return f.dot;
	yield* L.narsie_act();
	return f.dot;
}, true);

// mecha_defense.dm:313
rt.def("/obj/mecha/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let L: Value = null;
	if (!((GLOB.ratvar_awakens || GLOB.clockwork_gateway_activated) && this.occupant)) return f.dot;
	if (is_servant_of_ratvar(this.occupant)) {
		this.full_repair(1);
	} else {
		L = this.occupant;
		yield* this.go_out(1);
		if (!L) return f.dot;
		yield* L.ratvar_act();
	}
	return f.dot;
}, true);

// mecha_defense.dm:323
rt.def("/obj/mecha/proc/do_attack_animation", function* do_attack_animation(f: Frame) {
	if (!f.args[3]) {
		if (this.selected) {
			f.args[2] = this.selected;
		} else if (!f.args[1]) {
			f.args[1] = "smash";
			if (this.damtype == "fire") {
				f.args[1] = "mech_fire";
			} else if (this.damtype == "tox") {
				f.args[1] = "mech_toxin";
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["A", "visual_effect_icon", "used_item", "no_effect", "end_pixel_y"] });
