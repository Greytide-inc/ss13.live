// Based on /tg/station's code/game/objects/items/weapons/pneumaticCannon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7323, "/obj/item/weapon/pneumatic_cannon", "/obj/item/weapon", {
	maxWeightClass: 20,
	loadedWeightClass: 0,
	tank: null,
	gasPerThrow: 3,
	loadedItems: null,
	pressureSetting: 1,
	checktank: 1,
	range_multiplier: 1,
	throw_amount: 20,
	fire_mode: 1,
	automatic: 0,
	clumsyCheck: 1,
	name: "pneumatic cannon",
	desc: "A gas-powered cannon that can fire any object loaded into it.",
	w_class: 4,
	force: 8,
	attack_verb: null,
	icon: rt.rsc("icons/obj/pneumaticCannon.dmi"),
	icon_state: "pneumaticCannon",
	item_state: "bulldog",
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
	armor: null,
});

// pneumaticCannon.dm:21
rt.def("/obj/item/weapon/pneumatic_cannon/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.loadedItems = list();
	this.attack_verb = list("bludgeoned", "smashed", "beaten");
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 60, "acid", 50]);
	return f.dot;
});

// pneumaticCannon.dm:34
rt.def("/obj/item/weapon/pneumatic_cannon/proc/examine", function* examine(f: Frame, user: Value) {
	let I: Value = null;
	yield* parent_proc();
	let out: Value = list();
	if (!(get_dist(user, this) <= 1)) {
		out += "<span class='notice'>You'll need to get closer to see any more.</span>";
		return f.dot;
	}
	for (I of each(this.loadedItems, T("/obj/item"))) {
		out += fmt("<span class='info'>＀ It has ％！ loaded.</span>", [bicon(I), I]);
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	if (this.tank) {
		out += fmt("<span class='notice'>＀ It has ％！ mounted onto it.</span>", [bicon(this.tank), this.tank]);
	}
	to_chat(user, out.Join("<br>"));
	return f.dot;
}, true);

// pneumaticCannon.dm:47
rt.def("/obj/item/weapon/pneumatic_cannon/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let IT: Value = null, IW: Value = null;
	if (user.a_intent == "harm") {
		return (yield* parent_proc());
	}
	if (rt.istype(W, T("/obj/item/weapon/tank/internals"))) {
		if (!this.tank) {
			if ((IT = W).volume <= 3) {
				to_chat(user, fmt("<span class='warning'>＄！ is too small for ％！.</span>", [IT, this]));
				return f.dot;
			}
			yield* this.updateTank(W, 0, user);
		}
	} else if (W.type == this.type) {
		to_chat(user, "<span class='warning'>You're fairly certain that putting a pneumatic cannon inside another pneumatic cannon would cause a spacetime disruption.</span>");
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (this.pressureSetting === 1) {
			this.pressureSetting = 2;
		} else if (this.pressureSetting === 2) {
			this.pressureSetting = 3;
		} else if (this.pressureSetting === 3) {
			this.pressureSetting = 1;
		}
		to_chat(user, fmt("<span class='notice'>You tweak ％！'s pressure output to ＀.</span>", [this, this.pressureSetting]));
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.tank) {
			yield* this.updateTank(this.tank, 1, user);
		}
	} else if (this.loadedWeightClass >= this.maxWeightClass) {
		to_chat(user, fmt("<span class='warning'>＄！ can't hold any more items!</span>", [this]));
	} else {
		if (!rt.istype(W, T("/obj/item"))) return f.dot;
		yield* this.load_item((IW = W), user);
	}
	return f.dot;
}, true);

// pneumaticCannon.dm:77
rt.def("/obj/item/weapon/pneumatic_cannon/proc/can_load_item", function can_load_item(f: Frame, I: Value, user: Value) {
	if (this.loadedWeightClass + I.w_class > this.maxWeightClass) {
		if (user) {
			to_chat(user, fmt("<span class='warning'>＄！ won't fit into ％！!</span>", [I, this]));
		}
		return 0;
	}
	if (I.w_class > this.w_class) {
		if (user) {
			to_chat(user, fmt("<span class='warning'>＄！ is too large to fit into ％！!</span>", [I, this]));
		}
		return 0;
	}
	return 1;
});

// pneumaticCannon.dm:88
rt.def("/obj/item/weapon/pneumatic_cannon/proc/load_item", function* load_item(f: Frame, I: Value, user: Value) {
	if (!this.can_load_item(I, user)) {
		return 0;
	}
	if (user) {
		if (!(yield* user.transferItemToLoc(I, this))) {
			return 0;
		}
		to_chat(user, fmt("<span class='notice'>You load ％！ into ％！.</span>", [I, this]));
	} else {
		yield* I.forceMove(this);
	}
	this.loadedItems += I;
	this.loadedWeightClass += I.w_class;
	return 1;
}, true);

// pneumaticCannon.dm:101
rt.def("/obj/item/weapon/pneumatic_cannon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value, params: Value) {
	if (flag && user.a_intent == "harm") {
		return f.dot;
	}
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* this.Fire(user, target);
	return f.dot;
}, true);

// pneumaticCannon.dm:108
rt.def("/obj/item/weapon/pneumatic_cannon/proc/Fire", function* Fire(f: Frame, user: Value, target: Value) {
	let possible_targets: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human")) && !target) {
		return f.dot;
	}
	let discharge: Value = 0;
	if (user.dna.check_mutation("Hulk")) {
		to_chat(user, "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>");
		return f.dot;
	}
	if (rt.isIn(f, NOGUNS, user.dna.species.species_traits)) {
		to_chat(user, "<span class='warning'>Your fingers don't fit in the trigger guard!</span>");
		return f.dot;
	}
	if (!this.loadedItems || !this.loadedWeightClass) {
		to_chat(user, fmt("<span class='warning'>＄！ has nothing loaded.</span>", [this]));
		return f.dot;
	}
	if (!this.tank && this.checktank) {
		to_chat(user, fmt("<span class='warning'>＄！ can't fire without a source of gas.</span>", [this]));
		return f.dot;
	}
	if (this.tank && !(yield* this.tank.air_contents.remove(this.gasPerThrow * this.pressureSetting))) {
		to_chat(user, fmt("<span class='warning'>＄！ lets out a weak hiss and doesn't react!</span>", [this]));
		return f.dot;
	}
	if (rt.bitAnd(user.disabilities, 256) && prob(75) && this.clumsyCheck) {
		user.visible_message(`<span class='warning'>${user} loses their grip on ${this}, causing it to go off!</span>`, `<span class='userdanger'>${this} slips out of your hands and goes off!</span>`);
		yield* user.drop_item();
		if (prob(10)) {
			target = rt.getStep(f, user, 0);
		} else {
			target = pick((possible_targets = range(3, this)));
		}
		discharge = 1;
	}
	if (!discharge) {
		user.visible_message(fmt("<span class='danger'>＀ fires ％！!</span>", [user, this]), fmt("<span class='danger'>You fire ％！!</span>", [this]));
	}
	add_logs(user, target, "fired at", this);
	let _T: Value = this.get_target(target, rt.getStep(f, this, 0));
	playsound(this.loc, rt.rsc("sound/weapons/sonic_jackhammer.ogg"), 50, 1);
	yield* this.fire_items(_T, user);
	if (!(this.pressureSetting >= 3 && user)) return f.dot;
	user.visible_message(`<span class='warning'>${user} is thrown down by the force of the cannon!</span>`, `<span class='userdanger'>${this} slams into your shoulder, knocking you down!`);
	yield* user.Knockdown(60);
	return f.dot;
}, true);

// pneumaticCannon.dm:147
rt.def("/obj/item/weapon/pneumatic_cannon/proc/fire_items", function* fire_items(f: Frame, target: Value, user: Value) {
	let ITD: Value = null, i: Value = null, I: Value = null;
	let $e: any;
	if (this.fire_mode == 1) {
		for (ITD of each(this.loadedItems, T("/obj/item"))) {
			if (!(yield* this.throw_item(target, ITD, user))) {
				break;
			}
		}
	} else {
		rt.forRange(f, 0, 1, this.throw_amount, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			if (!rt.len(f, this.loadedItems)) {
				break;
			}
			I = null;
			if (this.fire_mode == PCANNON_FILO) {
				I = rt.index(this.loadedItems, rt.len(f, this.loadedItems));
			} else {
				I = rt.index(this.loadedItems, 1);
			}
			if (!(yield* this.throw_item(target, I, user))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true);

// pneumaticCannon.dm:164
rt.def("/obj/item/weapon/pneumatic_cannon/proc/throw_item", function* throw_item(f: Frame, target: Value, I: Value, user: Value) {
	if (!rt.istype(I, T("/obj/item"))) {
		return 0;
	}
	this.loadedItems -= I;
	this.loadedWeightClass -= I.w_class;
	yield* I.forceMove(rt.getStep(f, this, 0));
	yield* I.throw_at(target, this.pressureSetting * 10 * this.range_multiplier, this.pressureSetting * 2, user);
	return 1;
}, true);

// pneumaticCannon.dm:173
rt.def("/obj/item/weapon/pneumatic_cannon/proc/get_target", function get_target(f: Frame, target: Value, starting: Value) {
	let newtarget: Value = null;
	if (this.range_multiplier == 1) {
		return target;
	}
	let x_o: Value = target.x - starting.x;
	let y_o: Value = target.y - starting.y;
	let new_x: Value = max(0, min(starting.x + x_o * this.range_multiplier, rt.world().maxx));
	let new_y: Value = max(0, min(starting.y + y_o * this.range_multiplier, rt.world().maxy));
	return (newtarget = rt.locate(new_x, new_y, starting.z));
});

// pneumaticCannon.dm:192
rt.def("/obj/item/weapon/pneumatic_cannon/proc/updateTank", function* updateTank(f: Frame, thetank: Value, removing: Value, user: Value) {
	removing ??= 0;
	if (removing) {
		if (!this.tank) {
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You detach ％！ from ％！.</span>", [thetank, this]));
		this.tank.loc = rt.getStep(f, user, 0);
		yield* user.put_in_hands(this.tank);
		this.tank = null;
	}
	if (!removing) {
		if (this.tank) {
			to_chat(user, fmt("<span class='warning'>＄！ already has a tank.</span>", [this]));
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(thetank, this))) {
			return f.dot;
		}
		to_chat(user, fmt("<span class='notice'>You hook ％！ up to ％！.</span>", [thetank, this]));
		this.tank = thetank;
	}
	yield* this.update_icons();
	return f.dot;
}, true);

// pneumaticCannon.dm:209
rt.def("/obj/item/weapon/pneumatic_cannon/proc/update_icons", function update_icons(f: Frame) {
	this.cut_overlays();
	if (!this.tank) {
		return f.dot;
	}
	this.add_overlay(this.tank.icon_state);
	this.update_icon();
	return f.dot;
});

// pneumaticCannon.dm:216
rt.def("/obj/item/weapon/pneumatic_cannon/proc/fill_with_type", function* fill_with_type(f: Frame, type: Value, amount: Value) {
	let i: Value = null, I: Value = null;
	let $e: any;
	if (!ispath(type, T("/obj/item"))) {
		return 0;
	}
	let loaded: Value = 0;
	rt.forRange(f, 0, 1, amount, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		if (!(yield* this.load_item((I = (yield* new_(type))), null))) {
			yield* qdel(I);
			return loaded;
		}
		loaded++;
		if (rt.tickUsage(f) > GLOB.current_ticklimit) {
			yield* stoplag();
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(7325, "/obj/item/weapon/pneumatic_cannon/pie", "/obj/item/weapon/pneumatic_cannon", {
	gasPerThrow: 0,
	checktank: 0,
	range_multiplier: 3,
	fire_mode: 3,
	throw_amount: 1,
	maxWeightClass: 150,
	clumsyCheck: 0,
	name: "pie cannon",
	desc: "Load cream pie for optimal results",
	force: 10,
	icon_state: "piecannon",
});

// pneumaticCannon.dm:241
rt.def("/obj/item/weapon/pneumatic_cannon/pie/proc/can_load_item", function can_load_item(f: Frame, I: Value, user: Value) {
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/food/snacks/pie"))) {
		return parent_proc();
	}
	to_chat(user, `<span class='warning'>${this} only accepts pies!</span>`);
	return 0;
}, false);

rt.type(7326, "/obj/item/weapon/pneumatic_cannon/pie/selfcharge", "/obj/item/weapon/pneumatic_cannon/pie", {
	charge_amount: 1,
	charge_ticks: 1,
	charge_tick: 0,
	automatic: 1,
	maxWeightClass: 60,
});

// pneumaticCannon.dm:254
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// pneumaticCannon.dm:258
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// pneumaticCannon.dm:262
rt.def("/obj/item/weapon/pneumatic_cannon/pie/selfcharge/proc/process", function* process(f: Frame) {
	if (!(++this.charge_tick >= this.charge_ticks)) return f.dot;
	yield* this.fill_with_type(T("/obj/item/weapon/reagent_containers/food/snacks/pie/cream"), this.charge_amount);
	return f.dot;
}, true, { waitfor: false });
