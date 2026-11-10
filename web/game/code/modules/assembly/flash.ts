// Based on /tg/station's code/modules/assembly/flash.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9369, "/obj/item/device/assembly/flash", "/obj/item/device/assembly", {
	times_used: 0,
	last_used: 0,
	name: "flash",
	desc: "A powerful and versatile flashbulb device, with applications ranging from disorienting attackers to acting as visual receptors in robot production.",
	icon_state: "flash",
	item_state: "flashtool",
	throwforce: 0,
	w_class: 1,
	materials: null,
	origin_tech: "magnets=2;combat=1",
	crit_fail: 0,
});

// flash.dm:8
rt.def("/obj/item/device/assembly/flash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 300, "$glass", 300]);
	return f.dot;
});

// flash.dm:17
rt.def("/obj/item/device/assembly/flash/proc/update_icon", function* update_icon(f: Frame, flash: Value) {
	flash ??= 0;
	this.cut_overlays();
	this.attached_overlays = list();
	if (this.crit_fail) {
		this.add_overlay("flashburnt");
		this.attached_overlays += "flashburnt";
	}
	if (flash) {
		this.add_overlay("flash-f");
		this.attached_overlays += "flash-f";
		rt.spawnTail(f, 5, "/obj/item/device/assembly/flash/proc/update_icon: spawn at modules/assembly/flash.dm:26", flash);
	}
	if (!this.holder) return f.dot;
	yield* this.holder.update_icon();
	return f.dot;
}, true);

// a spawn(5) body of /obj/item/device/assembly/flash/proc/update_icon, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/assembly/flash/proc/update_icon: spawn at modules/assembly/flash.dm:26", function* (f: Frame, flash: Value) {
	yield* this.update_icon();
	return null;
});

// flash.dm:32
rt.def("/obj/item/device/assembly/flash/proc/clown_check", function* clown_check(f: Frame, user: Value) {
	if (rt.bitAnd(user.disabilities, 256) && prob(50)) {
		yield* this.flash_carbon(user, user, 15, 0);
		return 0;
	}
	return 1;
}, true);

// flash.dm:38
rt.def("/obj/item/device/assembly/flash/proc/activate", function* activate(f: Frame) {
	let _T: Value = null, M: Value = null;
	if (!(yield* this.try_use_flash())) {
		return 0;
	}
	(_T = rt.getStep(f, this, 0)).visible_message(`<span class='disarm'>${this} emits a blinding light!</span>`);
	for (M of each(viewers(3, _T), T("/mob/living/carbon"))) {
		yield* this.flash_carbon(M, null, 5, 0);
	}
	return f.dot;
}, true);

// flash.dm:47
rt.def("/obj/item/device/assembly/flash/proc/burn_out", function* burn_out(f: Frame) {
	let M: Value = null, _T: Value = null;
	if (!this.crit_fail) {
		this.crit_fail = 1;
		yield* this.update_icon();
	}
	if (ismob(this.loc)) {
		(M = this.loc).visible_message(`<span class='danger'>${this} burns out!</span>`, `<span class='userdanger'>${this} burns out!</span>`);
	} else {
		(_T = rt.getStep(f, this, 0)).visible_message(`<span class='danger'>${this} burns out!</span>`);
	}
	return f.dot;
}, true);

// flash.dm:59
rt.def("/obj/item/device/assembly/flash/proc/flash_recharge", function* flash_recharge(f: Frame, interval: Value) {
	interval ??= 10;
	if (prob(this.times_used * 3)) {
		yield* this.burn_out();
		return 0;
	}
	let deciseconds_passed: Value = rt.worldTime(f) - this.last_used;
	let seconds: Value = deciseconds_passed / 10;
	while (seconds >= interval) {
		this.times_used--;
		seconds -= interval;
	}
	this.last_used = rt.worldTime(f);
	this.times_used = max(0, this.times_used);
	return 1;
}, true);

// flash.dm:72
rt.def("/obj/item/device/assembly/flash/proc/try_use_flash", function* try_use_flash(f: Frame, user: Value) {
	yield* this.flash_recharge(10);
	if (this.crit_fail) {
		return 0;
	}
	playsound(this.loc, rt.rsc("sound/weapons/flash.ogg"), 100, 1);
	yield* this.update_icon(1);
	this.times_used++;
	if (user && !(yield* this.clown_check(user))) {
		return 0;
	}
	return 1;
}, true);

// flash.dm:88
rt.def("/obj/item/device/assembly/flash/proc/flash_carbon", function* flash_carbon(f: Frame, M: Value, user: Value, power: Value, targeted: Value) {
	power ??= 15;
	targeted ??= 1;
	add_logs(user, M, "flashed", this);
	if (user && targeted) {
		if (yield* M.flash_act(1, 1)) {
			M.confused += power;
			yield* this.terrible_conversion_proc(M, user);
			yield* M.Knockdown(rand(80, 120));
			this.visible_message(`<span class='disarm'>${user} blinds ${M} with the flash!</span>`);
			to_chat(user, `<span class='danger'>You blind ${M} with the flash!</span>`);
			to_chat(M, `<span class='userdanger'>${user} blinds you with the flash!</span>`);
		} else {
			this.visible_message(`<span class='disarm'>${user} fails to blind ${M} with the flash!</span>`);
			to_chat(user, `<span class='warning'>You fail to blind ${M} with the flash!</span>`);
			to_chat(M, `<span class='danger'>${user} fails to blind you with the flash!</span>`);
		}
	} else {
		if (!(yield* M.flash_act())) return f.dot;
		M.confused += power;
	}
	return f.dot;
}, true);

// flash.dm:106
rt.def("/obj/item/device/assembly/flash/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let R: Value = null;
	if (!(yield* this.try_use_flash(user))) {
		return 0;
	}
	if (rt.istype(M, T("/mob/living/carbon"))) {
		yield* this.flash_carbon(M, user, 5, 1);
		return 1;
	} else if (rt.istype(M, T("/mob/living/silicon"))) {
		R = M;
		add_logs(user, R, "flashed", this);
		yield* this.update_icon(1);
		yield* M.Knockdown(rand(80, 120));
		R.confused += 5;
		yield* R.flash_act({ affect_silicon: 1 });
		user.visible_message(`<span class='disarm'>${user} overloads ${R}'s sensors with the flash!</span>`, `<span class='danger'>You overload ${R}'s sensors with the flash!</span>`);
		return 1;
	}
	user.visible_message(`<span class='disarm'>${user} fails to blind ${M} with the flash!</span>`, `<span class='warning'>You fail to blind ${M} with the flash!</span>`);
	return f.dot;
}, true);

// flash.dm:129
rt.def("/obj/item/device/assembly/flash/proc/attack_self", function* attack_self(f: Frame, user: Value, flag: Value, emp: Value) {
	let M: Value = null;
	flag ??= 0;
	emp ??= 0;
	if (this.holder) {
		return 0;
	}
	if (!(yield* this.try_use_flash(user))) {
		return 0;
	}
	user.visible_message(`<span class='disarm'>${user}'s flash emits a blinding light!</span>`, "<span class='danger'>Your flash emits a blinding light!</span>");
	for (M of each(oviewers(3, null), T("/mob/living/carbon"))) {
		yield* this.flash_carbon(M, user, 1, 0);
	}
	return f.dot;
}, true);

// flash.dm:137
rt.def("/obj/item/device/assembly/flash/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!(yield* this.try_use_flash())) {
		return 0;
	}
	if (rt.istype(this.loc, T("/mob/living/carbon"))) {
		yield* this.flash_carbon(this.loc, null, 10, 0);
	}
	yield* this.burn_out();
	yield* parent_proc();
	return f.dot;
}, true);

// flash.dm:146
rt.def("/obj/item/device/assembly/flash/proc/terrible_conversion_proc", function* terrible_conversion_proc(f: Frame, H: Value, user: Value) {
	let resisted: Value = null;
	if (!(rt.istype(H, T("/mob/living/carbon/human")) && rt.istype(user, T("/mob/living/carbon/human")) && H.stat != 2)) return f.dot;
	if (!(user.mind && rt.isIn(f, user.mind, GLOB.SSticker.mode.head_revolutionaries))) return f.dot;
	if (H.client) {
		if (H.stat == 0) {
			H.mind_initialize();
			if (!H.isloyal()) {
				if (rt.isIn(f, user.mind, GLOB.SSticker.mode.head_revolutionaries)) {
					if (yield* GLOB.SSticker.mode.add_revolutionary(H.mind)) {
						yield* H.Stun(60);
						this.times_used--;
					} else {
						resisted = 1;
					}
				}
			} else {
				resisted = 1;
			}
			if (resisted) {
				to_chat(user, "<span class='warning'>This mind seems resistant to the flash!</span>");
			}
		} else {
			to_chat(user, "<span class='warning'>They must be conscious before you can convert them!</span>");
		}
	} else {
		to_chat(user, "<span class='warning'>This mind is so vacant that it is not susceptible to influence!</span>");
	}
	return f.dot;
}, true);

rt.type(9370, "/obj/item/device/assembly/flash/cyborg", "/obj/item/device/assembly/flash", {
	origin_tech: null,
});

// flash.dm:174
rt.def("/obj/item/device/assembly/flash/cyborg/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/borgflash"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

// flash.dm:178
rt.def("/obj/item/device/assembly/flash/cyborg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/borgflash"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

rt.type(9373, "/obj/item/device/assembly/flash/armimplant", "/obj/item/device/assembly/flash", {
	flashcd: 20,
	overheat: 0,
	I: null,
	name: "photon projector",
	desc: "A high-powered photon projector implant normally used for lighting purposes, but also doubles as a flashbulb weapon. Self-repair protocals fix the flashbulb if it ever burns out.",
});

// flash.dm:201
rt.def("/obj/item/device/assembly/flash/armimplant/proc/burn_out", function* burn_out(f: Frame) {
	if (this.I && this.I.owner) {
		to_chat(this.I.owner, "<span class='warning'>Your photon projector implant overheats and deactivates!</span>");
		yield* this.I.Retract();
	}
	this.overheat = 0;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/assembly/flash/armimplant/proc/cooldown"))), this.flashcd * 2);
	return f.dot;
}, true);

// flash.dm:209
rt.def("/obj/item/device/assembly/flash/armimplant/proc/try_use_flash", function* try_use_flash(f: Frame, user: Value) {
	if (this.overheat) {
		if (this.I && this.I.owner) {
			to_chat(this.I.owner, "<span class='warning'>Your photon projector is running too hot to be used again so quickly!</span>");
		}
		return 0;
	}
	this.overheat = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/assembly/flash/armimplant/proc/cooldown"))), this.flashcd);
	playsound(this.loc, rt.rsc("sound/weapons/flash.ogg"), 100, 1);
	yield* this.update_icon(1);
	return 1;
}, true);

rt.type(9374, "/obj/item/device/assembly/flash/shield", "/obj/item/device/assembly/flash", {
	throw_speed: 2,
	throw_range: 3,
	name: "strobe shield",
	desc: "A shield with a built in, high intensity light capable of blinding and disorienting suspects. Takes regular handheld flashes as bulbs.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "flashshield",
	item_state: "flashshield",
	slot_flags: 1024,
	force: 10,
	throwforce: 5,
	w_class: 4,
	materials: null,
	origin_tech: "materials=3;combat=4",
	attack_verb: null,
	block_chance: 50,
	armor: null,
});

// flash.dm:234
rt.def("/obj/item/device/assembly/flash/shield/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 7500, "$metal", 1000]);
	this.attack_verb = list("shoved", "bashed");
	this.armor = rt.alist(f, ["melee", 50, "bullet", 50, "laser", 50, "energy", 0, "bomb", 30, "bio", 0, "rad", 0, "fire", 80, "acid", 70]);
	return f.dot;
});

// flash.dm:241
rt.def("/obj/item/device/assembly/flash/shield/proc/flash_recharge", function* flash_recharge(f: Frame, interval: Value) {
	interval ??= 10;
	if (this.times_used >= 4) {
		yield* this.burn_out();
		return 0;
	}
	return 1;
}, true);

// flash.dm:247
rt.def("/obj/item/device/assembly/flash/shield/proc/attackby", function* attackby(f: Frame, W: Value, user: Value) {
	let flash: Value = null;
	if (rt.istype(W, T("/obj/item/device/assembly/flash/handheld"))) {
		if ((flash = W).crit_fail) {
			to_chat(user, "No sense replacing it with a broken bulb.");
			return f.dot;
		} else {
			to_chat(user, "You begin to replace the bulb.");
			if (yield* do_after(user, 20, { target: this })) {
				if (flash.crit_fail || !flash || !flash || flash.gc_destroyed) {
					return f.dot;
				}
				this.crit_fail = 0;
				this.times_used = 0;
				playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
				yield* this.update_icon();
				flash.crit_fail = 1;
				yield* flash.update_icon();
				return f.dot;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flash.dm:267
rt.def("/obj/item/device/assembly/flash/shield/proc/update_icon", function* update_icon(f: Frame, flash: Value) {
	flash ??= 0;
	this.item_state = "flashshield";
	this.item_state = "flashshield";
	if (this.crit_fail) {
		this.icon_state = "riot";
		this.item_state = "riot";
	} else if (flash) {
		this.item_state = "flashshield_flash";
		this.item_state = "flashshield_flash";
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/device/assembly/flash/shield/proc/update_icon"))), 5);
	}
	if (!this.holder) return f.dot;
	yield* this.holder.update_icon();
	return f.dot;
}, true);

// flash.dm:282
rt.def("/obj/item/device/assembly/flash/shield/proc/hit_reaction", function* hit_reaction(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = "the attack";
	}
	if (f.args[3] === null) {
		f.args[3] = 0;
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = 1;
	}
	yield* this.activate();
	return (yield* parent_proc());
}, true, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });
