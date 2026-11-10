// Based on /tg/station's code/game/objects/items/weapons/flamethrower.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, multiply, fmt } = rt;


rt.type(7229, "/obj/item/weapon/flamethrower", "/obj/item/weapon", {
	status: 0,
	lit: 0,
	operating: 0,
	weldtool: null,
	igniter: null,
	ptank: null,
	warned_admins: 0,
	create_full: 0,
	create_with_tank: 0,
	igniter_type: rt.typePath("/obj/item/device/assembly/igniter"),
	flags: 64,
	throw_speed: 1,
	throw_range: 5,
	name: "flamethrower",
	desc: "You are a firestarter!",
	icon: rt.rsc("icons/obj/flamethrower.dmi"),
	icon_state: "flamethrowerbase",
	item_state: "flamethrower_0",
	force: 3,
	throwforce: 10,
	w_class: 3,
	materials: null,
	origin_tech: "combat=1;plasmatech=2;engineering=2",
	resistance_flags: 2,
});

// flamethrower.dm:13
rt.def("/obj/item/weapon/flamethrower/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 500]);
	return f.dot;
});

// flamethrower.dm:30
rt.def("/obj/item/weapon/flamethrower/proc/Destroy", function* Destroy(f: Frame) {
	if (this.weldtool) {
		yield* qdel(this.weldtool);
	}
	if (this.igniter) {
		yield* qdel(this.igniter);
	}
	if (this.ptank) {
		yield* qdel(this.ptank);
	}
	return (yield* parent_proc());
}, true);

// flamethrower.dm:38
rt.def("/obj/item/weapon/flamethrower/proc/process", function* process(f: Frame) {
	let location: Value = null, M: Value = null;
	if (!this.lit || !this.igniter) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
		return null;
	}
	if (rt.istype((location = this.loc), T("/mob"))) {
		if ((M = location).is_holding(this)) {
			location = M.loc;
		}
	}
	if (!isturf(location)) return f.dot;
	yield* this.igniter.flamethrower_process(location);
	return f.dot;
}, true, { waitfor: false });

// flamethrower.dm:51
rt.def("/obj/item/weapon/flamethrower/proc/update_icon", function* update_icon(f: Frame) {
	let M: Value = null;
	this.cut_overlays();
	if (this.igniter) {
		this.add_overlay(`+igniter${this.status}`);
	}
	if (this.ptank) {
		this.add_overlay("+ptank");
	}
	if (this.lit) {
		this.add_overlay("+lit");
		this.item_state = "flamethrower_1";
	} else {
		this.item_state = "flamethrower_0";
	}
	if (ismob(this.loc)) {
		yield* (M = this.loc).update_inv_hands();
	}
	return f.dot;
}, true);

// flamethrower.dm:69
rt.def("/obj/item/weapon/flamethrower/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let H: Value = null, target_turf: Value = null;
	if (flag) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/carbon/human"))) {
		if ((H = user).dna.check_mutation("Hulk")) {
			to_chat(user, "<span class='warning'>Your meaty finger is much too large for the trigger guard!</span>");
			return f.dot;
		}
		if (rt.isIn(f, NOGUNS, H.dna.species.species_traits)) {
			to_chat(user, "<span class='warning'>Your fingers don't fit in the trigger guard!</span>");
			return f.dot;
		}
	}
	if (!(user && user.get_active_held_item() == this)) return f.dot;
	if (!(target_turf = rt.getStep(f, target, 0))) return f.dot;
	let turflist: Value = getline(user, target_turf);
	add_logs(user, target, "flamethrowered", this);
	yield* this.flame_turf(turflist);
	return f.dot;
}, true);

// flamethrower.dm:85
rt.def("/obj/item/weapon/flamethrower/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _T: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !this.status) {
		_T = rt.getStep(f, this, 0);
		if (this.weldtool) {
			yield* this.weldtool.forceMove(_T);
			this.weldtool = null;
		}
		if (this.igniter) {
			yield* this.igniter.forceMove(_T);
			this.igniter = null;
		}
		if (this.ptank) {
			yield* this.ptank.forceMove(_T);
			this.ptank = null;
		}
		yield* new_(T("/obj/item/stack/rods"), _T);
		yield* qdel(this);
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver")) && this.igniter && !this.lit) {
		this.status = (!this.status ? 1 : 0);
		$0 = user;
		$1 = this.igniter;
		if (this.status) {

			$2 = "secured";
		} else {
			$2 = "unsecured";
		}
		to_chat($0, `<span class='notice'>${$1} is now ${$2}!</span>`);
		yield* this.update_icon();
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/device/assembly/igniter"))) {
		if ((I = W).secured) {
			return f.dot;
		}
		if (this.igniter) {
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		this.igniter = I;
		yield* this.update_icon();
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/weapon/tank/internals/plasma"))) {
		if (this.ptank) {
			if (yield* user.transferItemToLoc(W, this)) {
				yield* this.ptank.forceMove(rt.getStep(f, this, 0));
				this.ptank = W;
				to_chat(user, `<span class='notice'>You swap the plasma tank in ${this}!</span>`);
			}
			return f.dot;
		}
		if (!(yield* user.transferItemToLoc(W, this))) {
			return f.dot;
		}
		this.ptank = W;
		yield* this.update_icon();
		return f.dot;
	} else if (rt.istype(W, T("/obj/item/device/analyzer")) && this.ptank) {
		this.atmosanalyzer_scan(this.ptank.air_contents, user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// flamethrower.dm:138
rt.def("/obj/item/weapon/flamethrower/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* this.toggle_igniter(user);
	return f.dot;
}, true);

// flamethrower.dm:141
rt.def("/obj/item/weapon/flamethrower/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	if (!(this.ptank && rt.istype(user, T("/mob/living")) && !user.incapacitated() && this.Adjacent(user))) return f.dot;
	yield* user.put_in_hands(this.ptank);
	this.ptank = null;
	to_chat(user, `<span class='notice'>You remove the plasma tank from ${this}!</span>`);
	return f.dot;
}, true);

// flamethrower.dm:147
rt.def("/obj/item/weapon/flamethrower/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.ptank) return f.dot;
	to_chat(user, fmt("<span class='notice'>＄！ has ％！ attached. Alt-click to remove it.</span>", [this, this.ptank]));
	return f.dot;
}, false);

// flamethrower.dm:152
rt.def("/obj/item/weapon/flamethrower/proc/toggle_igniter", function* toggle_igniter(f: Frame, user: Value) {
	if (!this.ptank) {
		to_chat(user, "<span class='notice'>Attach a plasma tank first!</span>");
		return f.dot;
	}
	if (!this.status) {
		to_chat(user, "<span class='notice'>Secure the igniter first!</span>");
		return f.dot;
	}
	let $0: any = user;
	to_chat($0, `<span class='notice'>You ${this.lit ? "extinguish" : "ignite"} ${this}!</span>`);
	this.lit = (!this.lit ? 1 : 0);
	if (this.lit) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
		if (!this.warned_admins) {
			message_admins(`${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} has lit a flamethrower.`);
			this.warned_admins = 1;
		}
	} else {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// flamethrower.dm:170
rt.def("/obj/item/weapon/flamethrower/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	yield* parent_proc();
	this.weldtool = rt.locateIn(f, T("/obj/item/weapon/weldingtool"), this.contents);
	this.igniter = rt.locateIn(f, T("/obj/item/device/assembly/igniter"), this.contents);
	this.weldtool.status = 0;
	this.igniter.secured = 0;
	this.status = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// flamethrower.dm:180
rt.def("/obj/item/weapon/flamethrower/proc/flame_turf", function* flame_turf(f: Frame, turflist: Value) {
	let _T: Value = null, turfs_sharing_with_prev: Value = null, M: Value = null;
	if (!this.lit || this.operating) {
		return f.dot;
	}
	this.operating = 1;
	let previousturf: Value = rt.getStep(f, this, 0);
	for (_T of each(turflist, T("/turf"))) {
		if (_T == previousturf) {
			continue;
		}
		turfs_sharing_with_prev = (yield* previousturf.GetAtmosAdjacentTurfs({ alldir: 1 }));
		if (!rt.isIn(f, _T, turfs_sharing_with_prev)) {
			break;
		}
		if (this.igniter) {
			yield* this.igniter.ignite_turf(this, _T);
		} else {
			yield* this.default_ignite(_T);
		}
		yield* sleep(1);
		previousturf = _T;
	}
	this.operating = 0;
	for (M of each(viewers(1, this.loc), T("/mob"))) {
		if (M.client && M.machine == this) {
			yield* this.attack_self(M);
		}
	}
	return f.dot;
}, true);

// flamethrower.dm:205
rt.def("/obj/item/weapon/flamethrower/proc/default_ignite", function* default_ignite(f: Frame, target: Value, release_amount: Value) {
	let air_transfer: Value = null;
	release_amount ??= 0.05;
	if (rt.index((air_transfer = (yield* this.ptank.air_contents.remove_ratio(release_amount))).gases, "plasma")) {
		(rt.modAt(rt.index(air_transfer.gases, "plasma"), 1, 5, multiply));
	}
	yield* target.assume_air(air_transfer);
	yield* target.hotspot_expose(this.ptank.air_contents.temperature * 2 + 380, 500);
	GLOB.SSair.add_to_active(target, 0);
	return f.dot;
}, true);

// flamethrower.dm:216
rt.def("/obj/item/weapon/flamethrower/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	f.dot = (yield* parent_proc());
	if (!this.create_full) return f.dot;
	if (!this.weldtool) {
		this.weldtool = (yield* new_(T("/obj/item/weapon/weldingtool"), this));
	}
	this.weldtool.status = 0;
	if (!this.igniter) {
		this.igniter = (yield* new_(this.igniter_type, this));
	}
	this.igniter.secured = 0;
	this.status = 1;
	if (this.create_with_tank) {
		this.ptank = (yield* new_(T("/obj/item/weapon/tank/internals/plasma/full"), this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// flamethrower.dm:236
rt.def("/obj/item/weapon/flamethrower/proc/hit_reaction", function* hit_reaction(f: Frame, owner: Value, hitby: Value, attack_text: Value, final_block_chance: Value, damage: Value, attack_type: Value) {
	attack_text ??= "the attack";
	final_block_chance ??= 0;
	damage ??= 0;
	attack_type ??= 1;
	let _P: Value = hitby;
	if (!(damage && attack_type == 3 && _P.damage_type != "stamina" && prob(15))) return f.dot;
	owner.visible_message(`<span class='danger'>${attack_text} hits the fueltank on ${owner}'s ${this}, rupturing it! What a shot!</span>`);
	let target_turf: Value = rt.getStep(f, owner, 0);
	yield* this.igniter.ignite_turf(this, target_turf, { release_amount: 100 });
	yield* qdel(this.ptank);
	return 1;
}, true);

// flamethrower.dm:246
rt.def("/obj/item/device/assembly/igniter/proc/flamethrower_process", function* flamethrower_process(f: Frame, location: Value) {
	yield* location.hotspot_expose(700, 2);
	return f.dot;
}, true);

// flamethrower.dm:252
rt.def("/obj/item/device/assembly/igniter/proc/ignite_turf", function* ignite_turf(f: Frame, F: Value, location: Value, release_amount: Value) {
	release_amount ??= 0.05;
	yield* F.default_ignite(location, release_amount);
	return f.dot;
}, true);
