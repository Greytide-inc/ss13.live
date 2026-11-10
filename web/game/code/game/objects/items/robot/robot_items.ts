// Based on /tg/station's code/game/objects/items/robot/robot_items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(9807, "/obj/item/borg/stun", "/obj/item/borg", {
	charge_cost: 30,
	name: "electrically-charged arm",
	icon_state: "elecarm",
});

// robot_items.dm:14
rt.def("/obj/item/borg/stun/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let H: Value = null, R: Value = null;
	if (rt.istype(M, T("/mob/living/carbon/human"))) {
		if (yield* (H = M).check_shields(this, 0, `${M}'s ${this.name}`, 1)) {
			playsound(M, rt.rsc("sound/weapons/genhit.ogg"), 50, 1);
			return 0;
		}
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if (!(yield* (R = user).cell.use(this.charge_cost))) {
			return f.dot;
		}
	}
	yield* user.do_attack_animation(M);
	yield* M.Knockdown(100);
	yield* M.apply_effect("stutter", 5);
	M.visible_message(`<span class='danger'>${user} has prodded ${M} with ${this}!</span>`, `<span class='userdanger'>${user} has prodded you with ${this}!</span>`);
	playsound(this.loc, rt.rsc("sound/weapons/egloves.ogg"), 50, 1, -1);
	add_logs(user, M, "stunned", this, `(INTENT: ${uppertext(user.a_intent)})`);
	return f.dot;
}, true);

rt.type(9808, "/obj/item/borg/cyborghug", "/obj/item/borg", {
	mode: 0,
	ccooldown: 0,
	scooldown: 0,
	shockallowed: 0,
	boop: 0,
	name: "Hugging Module",
	icon_state: "hugmodule",
	desc: "For when a someone really needs a hug.",
});

// robot_items.dm:46
rt.def("/obj/item/borg/cyborghug/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let _P: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((_P = user).emagged && this.shockallowed == 1) {
			if (this.mode < 3) {
				this.mode++;
			} else {
				this.mode = 0;
			}
		} else if (this.mode < 1) {
			this.mode++;
		} else {
			this.mode = 0;
		}
	}
	if (this.mode === 0) {
		to_chat(user, "Power reset. Hugs!");
	} else if (this.mode === 1) {
		to_chat(user, "Power increased!");
	} else if (this.mode === 2) {
		to_chat(user, "BZZT. Electrifying arms...");
	} else if (this.mode === 3) {
		to_chat(user, "ERROR: ARM ACTUATORS OVERLOADED.");
	}
	return f.dot;
});

// robot_items.dm:68
rt.def("/obj/item/borg/cyborghug/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	if (M == user) {
		return f.dot;
	}
	if (this.mode === 0) {
		if (M.health >= 0) {
			if (user.zone_selected == "head") {
				user.visible_message(`<span class='notice'>${user} playfully boops ${M} on the head!</span>`, `<span class='notice'>You playfully boop ${M} on the head!</span>`);
				yield* user.do_attack_animation(M, "boop");
				playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1, -1);
			} else if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if (M.lying) {
					user.visible_message(`<span class='notice'>${user} shakes ${M} trying to get ${M.p_them()} up!</span>`, `<span class='notice'>You shake ${M} trying to get ${M.p_them()} up!</span>`);
				} else {
					user.visible_message(`<span class='notice'>${user} hugs ${M} to make ${M.p_them()} feel better!</span>`, `<span class='notice'>You hug ${M} to make ${M.p_them()} feel better!</span>`);
				}
				if (M.resting) {
					M.resting = 0;
					yield* M.update_canmove();
				}
			} else {
				user.visible_message(`<span class='notice'>${user} pets ${M}!</span>`, `<span class='notice'>You pet ${M}!</span>`);
			}
			playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
		}
	} else if (this.mode === 1) {
		if (M.health >= 0) {
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				if (M.lying) {
					user.visible_message(`<span class='notice'>${user} shakes ${M} trying to get ${M.p_them()} up!</span>`, `<span class='notice'>You shake ${M} trying to get ${M.p_them()} up!</span>`);
				} else if (user.zone_selected == "head") {
					user.visible_message(`<span class='warning'>${user} bops ${M} on the head!</span>`, `<span class='warning'>You bop ${M} on the head!</span>`);
					yield* user.do_attack_animation(M, "punch");
				} else {
					user.visible_message(`<span class='warning'>${user} hugs ${M} in a firm bear-hug! ${M} looks uncomfortable...</span>`, `<span class='warning'>You hug ${M} firmly to make ${M.p_them()} feel better! ${M} looks uncomfortable...</span>`);
				}
				if (M.resting) {
					M.resting = 0;
					yield* M.update_canmove();
				}
			} else {
				user.visible_message(`<span class='warning'>${user} bops ${M} on the head!</span>`, `<span class='warning'>You bop ${M} on the head!</span>`);
			}
			playsound(this.loc, rt.rsc("sound/weapons/tap.ogg"), 50, 1, -1);
		}
	} else if (this.mode === 2) {
		if (this.scooldown < rt.worldTime(f)) {
			if (M.health >= 0) {
				if (rt.istype(M, T("/mob/living/carbon/human")) || rt.istype(M, T("/mob/living/carbon/monkey"))) {
					yield* M.electrocute_act(5, `${user}`, { safety: 1 });
					user.visible_message(`<span class='userdanger'>${user} electrocutes ${M} with their touch!</span>`, `<span class='danger'>You electrocute ${M} with your touch!</span>`);
					yield* M.update_canmove();
				} else if (!rt.istype(M, T("/mob/living/silicon/robot"))) {
					yield* M.adjustFireLoss(10);
					user.visible_message(`<span class='userdanger'>${user} shocks ${M}!</span>`, `<span class='danger'>You shock ${M}!</span>`);
				} else {
					user.visible_message(`<span class='userdanger'>${user} shocks ${M}. It does not seem to have an effect</span>`, `<span class='danger'>You shock ${M} to no effect.</span>`);
				}
				playsound(this.loc, rt.rsc("sound/effects/sparks2.ogg"), 50, 1, -1);
				user.cell.charge -= 500;
				this.scooldown = rt.worldTime(f) + 20;
			}
		}
	} else if (this.mode === 3) {
		if (!(this.ccooldown < rt.worldTime(f))) return f.dot;
		if (!(M.health >= 0)) return f.dot;
		if (rt.istype(M, T("/mob/living/carbon/human"))) {
			user.visible_message(`<span class='userdanger'>${user} crushes ${M} in their grip!</span>`, `<span class='danger'>You crush ${M} in your grip!</span>`);
		} else {
			user.visible_message(`<span class='userdanger'>${user} crushes ${M}!</span>`, `<span class='danger'>You crush ${M}!</span>`);
		}
		playsound(this.loc, rt.rsc("sound/weapons/smash.ogg"), 50, 1, -1);
		yield* M.adjustBruteLoss(15);
		user.cell.charge -= 300;
		this.ccooldown = rt.worldTime(f) + 10;
	}
	return f.dot;
}, true);

rt.type(9811, "/obj/item/borg/charger", "/obj/item/borg", {
	mode: "draw",
	flags: 4,
	name: "power connector",
	icon_state: "charger_draw",
}, { global: { charge_items: 741, charge_machines: 1054 } });

// robot_items.dm:160
rt.def("/obj/item/borg/charger/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// robot_items.dm:163
rt.def("/obj/item/borg/charger/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.icon_state = `charger_${this.mode}`;
	return f.dot;
});

// robot_items.dm:167
rt.def("/obj/item/borg/charger/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (this.mode == "draw") {
		this.mode = "charge";
	} else {
		this.mode = "draw";
	}
	to_chat(user, `<span class='notice'>You toggle ${this} to "${this.mode}" mode.</span>`);
	this.update_icon();
	return f.dot;
});

// robot_items.dm:175
rt.def("/obj/item/borg/charger/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value) {
	let M: Value = null, cell: Value = null, E: Value = null, draw: Value = null;
	if (!proximity_flag || !rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	if (this.mode == "draw") {
		if (is_type_in_list(target, GLOB.charge_machines)) {
			if (rt.bitAnd((M = target).stat, 3) || !M.anchored) {
				to_chat(user, `<span class='warning'>${M} is unpowered!</span>`);
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You connect to ${M}'s power line...</span>`);
			while (yield* do_after(user, 15, { target: M, progress: 0 })) {
				if (!user || !user.cell || this.mode != "draw") {
					return f.dot;
				}
				if (rt.bitAnd(M.stat, 3) || !M.anchored) {
					break;
				}
				if (!(yield* user.cell.give(150))) {
					break;
				}
				yield* M.use_power(200);
			}
			to_chat(user, "<span class='notice'>You stop charging youself.</span>");
		} else if (is_type_in_list(target, GLOB.charge_items)) {
			if (!rt.istype((cell = target), T("/obj/item/weapon/stock_parts/cell"))) {
				cell = rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), target);
			}
			if (!cell) {
				to_chat(user, `<span class='warning'>${target} has no power cell!</span>`);
				return f.dot;
			}
			if (rt.istype(target, T("/obj/item/weapon/gun/energy"))) {
				if (!(E = target).can_charge) {
					to_chat(user, `<span class='warning'>${target} has no power port!</span>`);
					return f.dot;
				}
			}
			if (!cell.charge) {
				to_chat(user, `<span class='warning'>${target} has no power!</span>`);
			}
			to_chat(user, `<span class='notice'>You connect to ${target}'s power port...</span>`);
			while (yield* do_after(user, 15, { target: target, progress: 0 })) {
				if (!user || !user.cell || this.mode != "draw") {
					return f.dot;
				}
				if (!cell || !target) {
					return f.dot;
				}
				if (cell != target && cell.loc != target) {
					return f.dot;
				}
				draw = min(cell.charge, cell.chargerate * 0.5, user.cell.maxcharge - user.cell.charge);
				if (!(yield* cell.use(draw))) {
					break;
				}
				if (!(yield* user.cell.give(draw))) {
					break;
				}
				yield* target.update_icon();
			}
			to_chat(user, "<span class='notice'>You stop charging youself.</span>");
		}
	} else {
		if (!is_type_in_list(target, GLOB.charge_items)) return f.dot;
		if (!rt.istype((cell = target), T("/obj/item/weapon/stock_parts/cell"))) {
			cell = rt.locateIn(f, T("/obj/item/weapon/stock_parts/cell"), target);
		}
		if (!cell) {
			to_chat(user, `<span class='warning'>${target} has no power cell!</span>`);
			return f.dot;
		}
		if (rt.istype(target, T("/obj/item/weapon/gun/energy"))) {
			if (!(E = target).can_charge) {
				to_chat(user, `<span class='warning'>${target} has no power port!</span>`);
				return f.dot;
			}
		}
		if (cell.charge >= cell.maxcharge) {
			to_chat(user, `<span class='warning'>${target} is already charged!</span>`);
		}
		to_chat(user, `<span class='notice'>You connect to ${target}'s power port...</span>`);
		while (yield* do_after(user, 15, { target: target, progress: 0 })) {
			if (!user || !user.cell || this.mode != "charge") {
				return f.dot;
			}
			if (!cell || !target) {
				return f.dot;
			}
			if (cell != target && cell.loc != target) {
				return f.dot;
			}
			draw = min(user.cell.charge, cell.chargerate * 0.5, cell.maxcharge - cell.charge);
			if (!(yield* user.cell.use(draw))) {
				break;
			}
			if (!(yield* cell.give(draw))) {
				break;
			}
			yield* target.update_icon();
		}
		to_chat(user, `<span class='notice'>You stop charging ${target}.</span>`);
	}
	return f.dot;
}, true);

rt.type(9359, "/obj/item/device/harmalarm", "/obj/item/device", {
	cooldown: 0,
	emagged: 0,
	name: "Sonic Harm Prevention Tool",
	desc: "Releases a harmless blast that confuses most organics. For when the harm is JUST TOO MUCH",
	icon_state: "megaphone",
});

// robot_items.dm:284
rt.def("/obj/item/device/harmalarm/proc/emag_act", function emag_act(f: Frame, user: Value) {
	this.emagged = (!this.emagged ? 1 : 0);
	if (this.emagged) {
		to_chat(user, `<font color='red'>You short out the safeties on the ${this}!</font>`);
	} else {
		to_chat(user, `<font color='red'>You reset the safeties on the ${this}!</font>`);
	}
	return f.dot;
});

// robot_items.dm:291
rt.def("/obj/item/device/harmalarm/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null, M: Value = null, C: Value = null, bang_effect: Value = null;
	let $e: any;
	let safety: Value = (!this.emagged ? 1 : 0);
	if (this.cooldown > rt.worldTime(f)) {
		to_chat(user, "<font color='red'>The device is still recharging!</font>");
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((R = user).cell.charge < 1200) {
			to_chat(user, "<font color='red'>You don't have enough charge to do this!</font>");
			return f.dot;
		}
		R.cell.charge -= 1000;
		if (R.emagged) {
			safety = 0;
		}
	}
	if (safety == 1) {
		user.visible_message(`<font color='red' size='2'>${user} blares out a near-deafening siren from its speakers!</font>`, "<span class='userdanger'>The siren pierces your hearing and confuses you!</span>", "<span class='danger'>The siren pierces your hearing!</span>");
		for (M of each(get_hearers_in_view(9, user), T("/mob/living/carbon"))) {
			if (M.get_ear_protection() == 0) {
				M.confused += 6;
			}
		}
		this.audible_message("<font color='red' size='7'>HUMAN HARM</font>");
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/ai/harmalarm.ogg"), 70, 3);
		this.cooldown = rt.worldTime(f) + 200;
		log_game(`${user.ckey}(${user}) used a Cyborg Harm Alarm in (${user.x},${user.y},${user.z})`);
		if (rt.istype(user, T("/mob/living/silicon/robot"))) {
			to_chat((R = user).connected_ai, `<br><span class='notice'>NOTICE - Peacekeeping 'HARM ALARM' used by: ${user}</span><br>`);
		}
		return f.dot;
	}
	if (safety != 0) return f.dot;
	user.audible_message("<font color='red' size='7'>BZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZT</font>");
	for (C of each(get_hearers_in_view(9, user), T("/mob/living/carbon"))) {
		const subject = (bang_effect = (yield* C.soundbang_act(2, 0, 0, 5)));
		if (subject === 1) {
			C.confused += 5;
			C.stuttering += 10;
			C.Jitter(10);
		} else if (subject === 2) {
			yield* C.Knockdown(40);
			C.confused += 10;
			C.stuttering += 15;
			C.Jitter(25);
		}
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/machines/warning-buzzer.ogg"), 130, 3);
	this.cooldown = rt.worldTime(f) + 600;
	log_game(`${user.ckey}(${user}) used an emagged Cyborg Harm Alarm in (${user.x},${user.y},${user.z})`);
	return f.dot;
}, true);

rt.type(9812, "/obj/item/borg/lollipop", "/obj/item/borg", {
	candy: 30,
	candymax: 30,
	charge_delay: 10,
	charging: 0,
	mode: 1,
	firedelay: 0,
	hitspeed: 2,
	hitdamage: 0,
	emaggedhitdamage: 3,
	name: "lollipop fabricator",
	desc: "Reward good humans with this. Toggle in-module to switch between dispensing and high velocity ejection modes.",
	icon_state: "lollipop",
});

// robot_items.dm:355
rt.def("/obj/item/borg/lollipop/proc/equipped", function* equipped(f: Frame) {
	yield* this.check_amount();
	return f.dot;
}, true);

// robot_items.dm:358
rt.def("/obj/item/borg/lollipop/proc/dropped", function* dropped(f: Frame) {
	yield* this.check_amount();
	return f.dot;
}, true);

// robot_items.dm:363
rt.def("/obj/item/borg/lollipop/proc/check_amount", function* check_amount(f: Frame) {
	if (this.charging) {
		return f.dot;
	}
	if (!(this.candy < this.candymax)) return f.dot;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/borg/lollipop/proc/charge_lollipops"))), this.charge_delay);
	this.charging = 1;
	return f.dot;
}, true);

// robot_items.dm:368
rt.def("/obj/item/borg/lollipop/proc/charge_lollipops", function* charge_lollipops(f: Frame) {
	this.candy++;
	this.charging = 0;
	yield* this.check_amount();
	return f.dot;
}, true);

// robot_items.dm:373
rt.def("/obj/item/borg/lollipop/proc/dispense", function* dispense(f: Frame, A: Value, user: Value) {
	let _T: Value = null, O: Value = null;
	if (this.candy <= 0) {
		to_chat(user, "<span class='warning'>No lollipops left in storage!</span>");
		return 0;
	}
	if (!(_T = rt.getStep(f, A, 0)) || !rt.istype(_T, T("/turf")) || !rt.istype(_T, T("/turf/open"))) {
		return 0;
	}
	if (rt.istype(A, T("/obj"))) {
		if ((O = A).density) {
			return 0;
		}
	}
	yield* new_(T("/obj/item/weapon/reagent_containers/food/snacks/lollipop"), _T);
	this.candy--;
	yield* this.check_amount();
	to_chat(user, "<span class='notice'>Dispensing lollipop...</span>");
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	return 1;
}, true);

// robot_items.dm:391
rt.def("/obj/item/borg/lollipop/proc/shootL", function* shootL(f: Frame, target: Value, user: Value, params: Value) {
	let A: Value = null;
	if (this.candy <= 0) {
		to_chat(user, "<span class='warning'>Not enough lollipops left!</span>");
		return 0;
	}
	this.candy--;
	(A = (yield* new_(T("/obj/item/ammo_casing/caseless/lollipop"), this))).BB.damage = this.hitdamage;
	if (this.hitdamage) {
		A.BB.nodamage = 0;
	}
	A.BB.speed = 0.5;
	playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 50, 1);
	yield* A.fire_casing(target, user, params, 0, 0, null, 0);
	user.visible_message(`<span class='warning'>${user} blasts a flying lollipop at ${target}!</span>`);
	yield* this.check_amount();
	return f.dot;
}, true);

// robot_items.dm:406
rt.def("/obj/item/borg/lollipop/proc/shootG", function* shootG(f: Frame, target: Value, user: Value, params: Value) {
	let A: Value = null;
	if (this.candy <= 0) {
		to_chat(user, "<span class='warning'>Not enough gumballs left!</span>");
		return 0;
	}
	this.candy--;
	(A = (yield* new_(T("/obj/item/ammo_casing/caseless/gumball"), this))).BB.damage = this.hitdamage;
	if (this.hitdamage) {
		A.BB.nodamage = 0;
	}
	A.BB.speed = 0.5;
	A.BB.color = rt.op(f, "Rgb", [1, 3], [rand(0, 255), rand(0, 255), rand(0, 255)]);
	playsound(this.loc, rt.rsc("sound/weapons/bulletflyby3.ogg"), 50, 1);
	yield* A.fire_casing(target, user, params, 0, 0, null, 0);
	user.visible_message(`<span class='warning'>${user} shoots a high-velocity gumball at ${target}!</span>`);
	yield* this.check_amount();
	return f.dot;
}, true);

// robot_items.dm:422
rt.def("/obj/item/borg/lollipop/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value, click_params: Value) {
	let R: Value = null;
	yield* this.check_amount();
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if (!(yield* (R = user).cell.use(12))) {
			to_chat(user, "<span class='warning'>Not enough power.</span>");
			return 0;
		}
		if (R.emagged) {
			this.hitdamage = this.emaggedhitdamage;
		}
	}
	if (this.mode === 1) {
		if (!proximity) {
			return 0;
		}
		yield* this.dispense(target, user);
	} else if (this.mode === 2) {
		yield* this.shootL(target, user, click_params);
	} else if (this.mode === 3) {
		yield* this.shootG(target, user, click_params);
	}
	this.hitdamage = rt.initial(f, this, "hitdamage");
	return f.dot;
}, true);

// robot_items.dm:442
rt.def("/obj/item/borg/lollipop/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.mode === 1) {
		this.mode++;
		to_chat(user, "<span class='notice'>Module is now throwing lollipops.</span>");
	} else if (this.mode === 2) {
		this.mode++;
		to_chat(user, "<span class='notice'>Module is now blasting gumballs.</span>");
	} else if (this.mode === 3) {
		this.mode = 1;
		to_chat(user, "<span class='notice'>Module is now dispensing lollipops.</span>");
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8792, "/obj/item/projectile/bullet/reusable/gumball", "/obj/item/projectile/bullet/reusable", {
	name: "gumball",
	desc: "Oh noes! A fast-moving gumball!",
	icon_state: "gumball",
	ammo_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/gumball/cyborg"),
	nodamage: 1,
});

// robot_items.dm:469
rt.def("/obj/item/projectile/bullet/reusable/gumball/proc/handle_drop", function* handle_drop(f: Frame) {
	let S: Value = null;
	if (this.dropped) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	(S = (yield* new_(this.ammo_type, _T))).color = this.color;
	this.dropped = 1;
	return f.dot;
}, true);

rt.type(8793, "/obj/item/projectile/bullet/reusable/lollipop", "/obj/item/projectile/bullet/reusable", {
	color2: "#000000",
	name: "lollipop",
	desc: "Oh noes! A fast-moving lollipop!",
	icon_state: "lollipop_1",
	ammo_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/lollipop/cyborg"),
	nodamage: 1,
});

// robot_items.dm:490
rt.def("/obj/item/projectile/bullet/reusable/lollipop/proc/New", function* New(f: Frame) {
	let S: Value = null, head: Value = null;
	this.color2 = (S = (yield* new_(this.ammo_type, this))).headcolor;
	(head = mutable_appearance(rt.rsc("icons/obj/projectiles.dmi"), "lollipop_2")).color = this.color2;
	this.add_overlay(head);
	return f.dot;
}, true);

// robot_items.dm:497
rt.def("/obj/item/projectile/bullet/reusable/lollipop/proc/handle_drop", function* handle_drop(f: Frame) {
	let S: Value = null;
	if (this.dropped) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	(S = (yield* new_(this.ammo_type, _T))).change_head_color(this.color2);
	this.dropped = 1;
	return f.dot;
}, true);

rt.type(9813, "/obj/item/borg/projectile_dampen", "/obj/item/borg", {
	maxenergy: 1500,
	energy: 1500,
	energy_recharge: 7.5,
	energy_recharge_cyborg_drain_coefficient: 0.4,
	cyborg_cell_critical_percentage: 0.05,
	host: null,
	dampening_field: null,
	projectile_damage_coefficient: 0.5,
	projectile_damage_tick_ecost_coefficient: 2,
	projectile_speed_coefficient: 1.5,
	projectile_tick_speed_ecost: 15,
	tracked: null,
	projectile_effect: null,
	field_radius: 3,
	active: 0,
	cycle_delay: 0,
	name: "Hyperkinetic Dampening projector",
	desc: "A device that projects a dampening field that weakenss kinetic energy above a certain threshold. <span class='boldnotice'>Projects a field that drains power per second while active, that will weaken and slow damaging projectiles inside its field.</span> Still being a prototype, it tends to induce a charge on ungrounded metallic surfaces.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "shield",
});

// robot_items.dm:535
rt.def("/obj/item/borg/projectile_dampen/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.projectile_effect = image(rt.rsc("icons/effects/fields.dmi"), "projectile_dampen_effect");
	this.tracked = list();
	this.icon_state = "shield0";
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	this.host = this.loc;
	return f.dot;
}, true);

// robot_items.dm:543
rt.def("/obj/item/borg/projectile_dampen/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSfastprocess.processing -= this;
	return (yield* parent_proc());
}, true);

// robot_items.dm:547
rt.def("/obj/item/borg/projectile_dampen/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.cycle_delay > rt.worldTime(f)) {
		to_chat(user, fmt("<span class='boldwarning'>％！ is still recycling its projectors!</span>", [this]));
		return f.dot;
	}
	this.cycle_delay = rt.worldTime(f) + 20;
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		yield* this.activate_field(user);
	} else {
		yield* this.deactivate_field();
	}
	yield* this.update_icon();
	let $0: any = user;
	to_chat($0, `<span class='boldnotice'>You ${this.active ? "activate" : "deactivate"} the ${this}.</span>`);
	return f.dot;
}, true);

// robot_items.dm:560
rt.def("/obj/item/borg/projectile_dampen/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `${rt.initial(f, this, "icon_state")}${this.active}`;
	return f.dot;
});

// robot_items.dm:563
rt.def("/obj/item/borg/projectile_dampen/proc/activate_field", function* activate_field(f: Frame) {
	if (rt.istype(this.dampening_field, T("/datum/proximity_monitor/advanced"))) {
		yield* qdel(this.dampening_field);
		this.dampening_field = null;
	}
	this.dampening_field = (yield* make_field(T("/datum/proximity_monitor/advanced/peaceborg_dampener"), rt.alist(f, ["current_range", this.field_radius, "host", this, "projector", this])));
	return f.dot;
}, true);

// robot_items.dm:568
rt.def("/obj/item/borg/projectile_dampen/proc/deactivate_field", function* deactivate_field(f: Frame) {
	let _P: Value = null;
	yield* qdel(this.dampening_field);
	this.dampening_field = null;
	this.visible_message(fmt("<span class='warning'>＄！ shuts off!</span>", [this]));
	for (_P of each(this.tracked)) {
		this.restore_projectile(_P);
	}
	return f.dot;
}, true);

// robot_items.dm:574
rt.def("/obj/item/borg/projectile_dampen/proc/dropped", function* dropped(f: Frame) {
	f.dot = (yield* parent_proc());
	this.host = this.loc;
	return f.dot;
}, true);

// robot_items.dm:578
rt.def("/obj/item/borg/projectile_dampen/proc/equipped", function* equipped(f: Frame) {
	f.dot = (yield* parent_proc());
	this.host = this.loc;
	return f.dot;
}, true);

// robot_items.dm:582
rt.def("/obj/item/borg/projectile_dampen/proc/on_mob_death", function* on_mob_death(f: Frame) {
	yield* this.deactivate_field();
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// robot_items.dm:586
rt.def("/obj/item/borg/projectile_dampen/proc/process", function* process(f: Frame) {
	yield* this.process_recharge();
	yield* this.process_usage();
	yield* this.update_location();
	return f.dot;
}, true, { waitfor: false });

// robot_items.dm:592
rt.def("/obj/item/borg/projectile_dampen/proc/update_location", function* update_location(f: Frame) {
	if (!this.dampening_field) return f.dot;
	yield* this.dampening_field.HandleMove();
	return f.dot;
}, true);

// robot_items.dm:596
rt.def("/obj/item/borg/projectile_dampen/proc/process_usage", function* process_usage(f: Frame) {
	let I: Value = null, _P: Value = null;
	let usage: Value = 0;
	for (I of each(this.tracked)) {
		if (!(_P = I).stun && _P.nodamage) {
			continue;
		}
		usage += this.projectile_tick_speed_ecost;
		usage += rt.index(this.tracked, I) * this.projectile_damage_tick_ecost_coefficient;
	}
	this.energy = max(0, min(this.energy - usage, this.maxenergy));
	if (!(this.energy <= 0)) return f.dot;
	yield* this.deactivate_field();
	this.visible_message(`<span class='warning'>The ${this} blinks "ENERGY DEPLETED"</span>`);
	return f.dot;
}, true);

// robot_items.dm:608
rt.def("/obj/item/borg/projectile_dampen/proc/process_recharge", function* process_recharge(f: Frame) {
	if (!rt.istype(this.host, T("/mob/living/silicon/robot"))) {
		if (rt.istype(this.host.loc, T("/mob/living/silicon/robot"))) {
			this.host = this.host.loc;
		} else {
			this.energy = max(0, min(this.energy + this.energy_recharge, this.maxenergy));
			return f.dot;
		}
	}
	if (!(this.host.cell.charge >= this.host.cell.maxcharge * this.cyborg_cell_critical_percentage && this.energy < this.maxenergy)) return f.dot;
	yield* this.host.cell.use(this.energy_recharge * this.energy_recharge_cyborg_drain_coefficient);
	this.energy += this.energy_recharge;
	return f.dot;
}, true);

// robot_items.dm:619
rt.def("/obj/item/borg/projectile_dampen/proc/dampen_projectile", function dampen_projectile(f: Frame, _P: Value, track_projectile: Value) {
	track_projectile ??= 1;
	if (rt.index(this.tracked, _P)) {
		return f.dot;
	}
	if (track_projectile) {
		rt.setAt(this.tracked, _P, _P.damage);
	}
	_P.damage *= this.projectile_damage_coefficient;
	_P.speed *= this.projectile_speed_coefficient;
	_P.add_overlay(this.projectile_effect);
	return f.dot;
});

// robot_items.dm:628
rt.def("/obj/item/borg/projectile_dampen/proc/restore_projectile", function restore_projectile(f: Frame, _P: Value) {
	this.tracked -= _P;
	_P.damage *= 1 / this.projectile_damage_coefficient;
	_P.speed *= 1 / this.projectile_speed_coefficient;
	_P.cut_overlay(this.projectile_effect);
	return f.dot;
});

rt.type(9822, "/obj/item/borg/sight/hud/med", "/obj/item/borg/sight/hud", {
	name: "medical hud",
	icon_state: "healthhud",
});

// robot_items.dm:677
rt.def("/obj/item/borg/sight/hud/med/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.hud = (yield* new_(T("/obj/item/clothing/glasses/hud/health"), this));
	return f.dot;
}, true);

rt.type(9823, "/obj/item/borg/sight/hud/sec", "/obj/item/borg/sight/hud", {
	name: "security hud",
	icon_state: "securityhud",
});

// robot_items.dm:687
rt.def("/obj/item/borg/sight/hud/sec/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.hud = (yield* new_(T("/obj/item/clothing/glasses/hud/security"), this));
	return f.dot;
}, true);
