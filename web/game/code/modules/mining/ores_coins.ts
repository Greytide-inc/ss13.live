// Based on /tg/station's code/modules/mining/ores_coins.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(7036, "/obj/item/weapon/ore", "/obj/item/weapon", {
	points: 0,
	refined_type: null,
	name: "rock",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "ore",
});

// ores_coins.dm:16
rt.def("/obj/item/weapon/ore/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if ((yield* (W = I).remove_fuel(15)) && this.refined_type) {
			yield* new_(this.refined_type, rt.getStep(f, this.loc, 0));
			yield* qdel(this);
		} else if (W.isOn()) {
			to_chat(user, `<span class='info'>Not enough fuel to smelt ${this}.</span>`);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ores_coins.dm:27
rt.def("/obj/item/weapon/ore/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let OB: Value = null, F: Value = null, H: Value = null, thing: Value = null, R: Value = null, L: Value = null, box: Value = null;
	if (rt.istype(this.loc, T("/turf/open/floor/plating/asteroid"))) {
		F = this.loc;
		if (rt.istype(AM, T("/mob/living/carbon/human"))) {
			H = AM;
			for (thing of each(H.get_storage_slots())) {
				if (rt.istype(thing, T("/obj/item/weapon/storage/bag/ore"))) {
					OB = thing;
					break;
				}
			}
			thing = null;
			for (thing of each(H.held_items)) {
				if (rt.istype(thing, T("/obj/item/weapon/storage/bag/ore"))) {
					OB = thing;
					break;
				}
			}
		} else if (rt.istype(AM, T("/mob/living/silicon/robot"))) {
			R = AM;
			thing = null;
			for (thing of each(R.module_active)) {
				if (rt.istype(thing, T("/obj/item/weapon/storage/bag/ore"))) {
					OB = thing;
					break;
				}
			}
		}
		if (OB) {
			yield* F.attackby(OB, AM);
			if (rt.istype((L = AM).pulling, T("/obj/structure/ore_box"))) {
				yield* (box = L.pulling).attackby(OB, AM);
			}
		}
	}
	return (yield* parent_proc());
}, true);

rt.type(7040, "/obj/item/weapon/ore/uranium", "/obj/item/weapon/ore", {
	points: 30,
	name: "uranium ore",
	icon_state: "Uranium ore",
	origin_tech: "materials=5",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/uranium"),
});

// ores_coins.dm:60
rt.def("/obj/item/weapon/ore/uranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$uranium", 2000]);
	return f.dot;
});

rt.type(7041, "/obj/item/weapon/ore/iron", "/obj/item/weapon/ore", {
	points: 1,
	name: "iron ore",
	icon_state: "Iron ore",
	origin_tech: "materials=1",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/metal"),
});

// ores_coins.dm:68
rt.def("/obj/item/weapon/ore/iron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 2000]);
	return f.dot;
});

rt.type(7042, "/obj/item/weapon/ore/glass", "/obj/item/weapon/ore", {
	points: 1,
	name: "sand pile",
	icon_state: "Glass ore",
	origin_tech: "materials=1",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/glass"),
	w_class: 1,
});

// ores_coins.dm:76
rt.def("/obj/item/weapon/ore/glass/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$glass", 2000]);
	return f.dot;
});

// ores_coins.dm:81
rt.def("/obj/item/weapon/ore/glass/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let G: Value = null, SS: Value = null, SA: Value = null;
	to_chat(user, "<span class='notice'>You use the sand to make sandstone.</span>");
	let sandAmt: Value = 1;
	for (G of each(user.loc, T("/obj/item/weapon/ore/glass"))) {
		sandAmt += 1;
		yield* qdel(G);
	}
	while (sandAmt > 0) {
		SS = (yield* new_(T("/obj/item/stack/sheet/mineral/sandstone"), user.loc));
		if (sandAmt >= SS.max_amount) {
			SS.amount = SS.max_amount;
		} else {
			SS.amount = sandAmt;
			SA = null;
			for (SA of each(user.loc, T("/obj/item/stack/sheet/mineral/sandstone"))) {
				if (SA != SS && SA.amount < SA.max_amount) {
					yield* SA.attackby(SS, user);
				}
			}
		}
		sandAmt -= SS.max_amount;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// ores_coins.dm:100
rt.def("/obj/item/weapon/ore/glass/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let C: Value = null;
	if ((yield* parent_proc()) || !rt.istype(hit_atom, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if ((C = hit_atom).head && rt.bitAnd(C.head.flags_cover, HEADCOVERSEYES)) {
		this.visible_message(`<span class='danger'>${C}'s headgear blocks the sand!</span>`);
		return f.dot;
	}
	if (C.wear_mask && rt.bitAnd(C.wear_mask.flags_cover, MASKCOVERSEYES)) {
		this.visible_message(`<span class='danger'>${C}'s mask blocks the sand!</span>`);
		return f.dot;
	}
	if (C.glasses && rt.bitAnd(C.glasses.flags_cover, GLASSESCOVERSEYES)) {
		this.visible_message(`<span class='danger'>${C}'s glasses block the sand!</span>`);
		return f.dot;
	}
	yield* C.adjust_blurriness(6);
	yield* C.adjustStaminaLoss(15);
	C.confused += 5;
	to_chat(C, fmt("<span class='userdanger'>＄！ gets into your eyes! The pain, it burns!</span>", [this]));
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(7044, "/obj/item/weapon/ore/plasma", "/obj/item/weapon/ore", {
	points: 15,
	name: "plasma ore",
	icon_state: "Plasma ore",
	origin_tech: "plasmatech=2;materials=2",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/plasma"),
});

// ores_coins.dm:127
rt.def("/obj/item/weapon/ore/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$plasma", 2000]);
	return f.dot;
});

// ores_coins.dm:131
rt.def("/obj/item/weapon/ore/plasma/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if ((W = I).welding) {
			to_chat(user, `<span class='warning'>You can't hit a high enough temperature to smelt ${this} properly!</span>`);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

rt.type(7045, "/obj/item/weapon/ore/silver", "/obj/item/weapon/ore", {
	points: 16,
	name: "silver ore",
	icon_state: "Silver ore",
	origin_tech: "materials=3",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/silver"),
});

// ores_coins.dm:144
rt.def("/obj/item/weapon/ore/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$silver", 2000]);
	return f.dot;
});

rt.type(7046, "/obj/item/weapon/ore/gold", "/obj/item/weapon/ore", {
	points: 18,
	name: "gold ore",
	icon_state: "Gold ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/gold"),
});

// ores_coins.dm:152
rt.def("/obj/item/weapon/ore/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 2000]);
	return f.dot;
});

rt.type(7047, "/obj/item/weapon/ore/diamond", "/obj/item/weapon/ore", {
	points: 50,
	name: "diamond ore",
	icon_state: "Diamond ore",
	origin_tech: "materials=6",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/diamond"),
});

// ores_coins.dm:160
rt.def("/obj/item/weapon/ore/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$diamond", 2000]);
	return f.dot;
});

rt.type(7048, "/obj/item/weapon/ore/bananium", "/obj/item/weapon/ore", {
	points: 60,
	name: "bananium ore",
	icon_state: "Clown ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/bananium"),
});

// ores_coins.dm:168
rt.def("/obj/item/weapon/ore/bananium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bananium", 2000]);
	return f.dot;
});

rt.type(7049, "/obj/item/weapon/ore/titanium", "/obj/item/weapon/ore", {
	points: 50,
	name: "titanium ore",
	icon_state: "Titanium ore",
	origin_tech: "materials=4",
	materials: null,
	refined_type: rt.typePath("/obj/item/stack/sheet/mineral/titanium"),
});

// ores_coins.dm:176
rt.def("/obj/item/weapon/ore/titanium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$titanium", 2000]);
	return f.dot;
});

rt.type(5631, "/obj/item/weapon/twohanded/required/gibtonite", "/obj/item/weapon/twohanded/required", {
	primed: 0,
	det_time: 100,
	quality: 1,
	attacher: "UNKNOWN",
	det_timer: null,
	throw_range: 0,
	name: "gibtonite ore",
	desc: "Extremely explosive if struck with mining equipment, Gibtonite is often used by miners to speed up their work by using it as a mining charge. This material is illegal to possess by unauthorized personnel under space law.",
	icon: rt.rsc("icons/obj/mining.dmi"),
	icon_state: "Gibtonite ore",
	item_state: "Gibtonite ore",
	w_class: 4,
});

// ores_coins.dm:199
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// ores_coins.dm:204
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (!this.wires && rt.istype(I, T("/obj/item/device/assembly/igniter"))) {
		user.visible_message(`${user} attaches ${I} to ${this}.`, `<span class='notice'>You attach ${I} to ${this}.</span>`);
		this.wires = (yield* new_(T("/datum/wires/explosive/gibtonite"), this));
		this.attacher = key_name(user);
		yield* qdel(I);
		this.add_overlay("Gibtonite_igniter");
		return f.dot;
	}
	if (this.wires && !this.primed) {
		if (is_wire_tool(I)) {
			yield* this.wires.interact(user);
			return f.dot;
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/pickaxe")) || rt.istype(I, T("/obj/item/weapon/resonator")) || I.force >= 10) {
		yield* this.GibtoniteReaction(user);
		return f.dot;
	}
	if (this.primed) {
		if (rt.istype(I, T("/obj/item/device/mining_scanner")) || rt.istype(I, T("/obj/item/device/t_scanner/adv_mining_scanner")) || rt.istype(I, T("/obj/item/device/multitool"))) {
			this.primed = 0;
			if (this.det_timer) {
				yield* deltimer(this.det_timer);
			}
			user.visible_message("The chain reaction was stopped! ...The ore's quality looks diminished.", "<span class='notice'>You stopped the chain reaction. ...The ore's quality looks diminished.</span>");
			this.icon_state = "Gibtonite ore";
			this.quality = 1;
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ores_coins.dm:233
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.wires) {
		yield* this.wires.interact(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// ores_coins.dm:238
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/bullet_act", function* bullet_act(f: Frame, P: Value) {
	yield* this.GibtoniteReaction(P.firer);
	yield* parent_proc();
	return f.dot;
}, true);

// ores_coins.dm:242
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/ex_act", function* ex_act(f: Frame) {
	yield* this.GibtoniteReaction(null, 1);
	return f.dot;
}, true, { waitfor: false });

// ores_coins.dm:247
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/GibtoniteReaction", function* GibtoniteReaction(f: Frame, user: Value, triggered_by: Value) {
	let $0: any, $1: any, $2: any;
	triggered_by ??= 0;
	if (this.primed) return f.dot;
	this.primed = 1;
	playsound(this, rt.rsc("sound/effects/hit_on_shattered_glass.ogg"), 50, 1);
	this.icon_state = "Gibtonite active";
	let bombturf: Value = rt.getStep(f, this, 0);
	let A: Value = get_area(bombturf);
	let notify_admins: Value = 0;
	if (this.z != 5) {
		notify_admins = 1;
	}
	if (notify_admins) {
		if (triggered_by == 1) {
			$0 = this.name;
			if (bombturf) {
				$1 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			message_admins(`An explosion has triggered a ${$0} to detonate at ${`${$1}`}.`);
		} else if (triggered_by == 2) {
			$0 = this.name;
			if (bombturf) {
				$1 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
			} else {
				$1 = "nonexistent location";
			}
			message_admins(`A signal has triggered a ${$0} to detonate at ${`${$1}`}. Igniter attacher: ${`${key_name_admin(this.attacher)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.attacher])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.attacher])}`}`);
		} else {
			$0 = `${key_name_admin(this.attacher)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [this.attacher])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.attacher])}`;
			$1 = this.name;
			if (bombturf) {
				$2 = `${`(${bombturf.x},${bombturf.y},${bombturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${bombturf.x};Y=${bombturf.y};Z=${bombturf.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			message_admins(`${$0} has triggered a ${$1} to detonate at ${`${$2}`}.`);
		}
	}
	if (triggered_by == 1) {
		log_game(`An explosion has primed a ${this.name} for detonation at ${A}${`(${bombturf.x},${bombturf.y},${bombturf.z})`}`);
	} else if (triggered_by == 2) {
		log_game(`A signal has primed a ${this.name} for detonation at ${A}${`(${bombturf.x},${bombturf.y},${bombturf.z})`}. Igniter attacher: ${key_name(this.attacher)}.`);
	} else {
		user.visible_message(fmt("<span class='warning'>＀ strikes ％！, causing a chain reaction!</span>", [user, this]), fmt("<span class='danger'>You strike ％！, causing a chain reaction.</span>", [this]));
		log_game(`${key_name(user)} has primed a ${this.name} for detonation at ${A}${`(${bombturf.x},${bombturf.y},${bombturf.z})`}`);
	}
	this.det_timer = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/twohanded/required/gibtonite/proc/detonate"), notify_admins)), this.det_time, 8));
	return f.dot;
}, true);

// ores_coins.dm:275
rt.def("/obj/item/weapon/twohanded/required/gibtonite/proc/detonate", function* detonate(f: Frame, notify_admins: Value) {
	if (!this.primed) return f.dot;
	if (this.quality === 3) {
		yield* explosion(this, 2, 4, 9, { adminlog: notify_admins });
	} else if (this.quality === 2) {
		yield* explosion(this, 1, 2, 5, { adminlog: notify_admins });
	} else if (this.quality === 1) {
		yield* explosion(this, 0, 1, 3, { adminlog: notify_admins });
	}
	yield* qdel(this);
	return f.dot;
}, true);

// ores_coins.dm:285
rt.def("/obj/item/weapon/ore/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(0, 16) - 8;
	this.pixel_y = rand(0, 8) - 8;
	return f.dot;
}, true);

rt.type(7516, "/obj/item/weapon/coin", "/obj/item/weapon", {
	string_attached: null,
	sideslist: null,
	cmineral: null,
	cooldown: 0,
	value: 1,
	flags: 64,
	icon: rt.rsc("icons/obj/economy.dmi"),
	name: "coin",
	icon_state: "coin__heads",
	force: 1,
	throwforce: 2,
	w_class: 1,
});

// ores_coins.dm:312
rt.def("/obj/item/weapon/coin/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.pixel_x = rand(0, 16) - 8;
	this.pixel_y = rand(0, 8) - 8;
	return f.dot;
}, true);

// ores_coins.dm:317
rt.def("/obj/item/weapon/coin/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!rt.sv(f, "value")) return f.dot;
	to_chat(user, fmt("<span class='info'>It's worth ＀ credit５.</span>", [rt.sv(f, "value")]));
	return f.dot;
}, false);

rt.type(7517, "/obj/item/weapon/coin/gold", "/obj/item/weapon/coin", {
	cmineral: "gold",
	value: 50,
	name: "gold coin",
	icon_state: "coin_gold_heads",
	materials: null,
});

// ores_coins.dm:326
rt.def("/obj/item/weapon/coin/gold/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$gold", 400]);
	return f.dot;
});

rt.type(7518, "/obj/item/weapon/coin/silver", "/obj/item/weapon/coin", {
	cmineral: "silver",
	value: 20,
	name: "silver coin",
	icon_state: "coin_silver_heads",
	materials: null,
});

// ores_coins.dm:333
rt.def("/obj/item/weapon/coin/silver/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$silver", 400]);
	return f.dot;
});

rt.type(7519, "/obj/item/weapon/coin/diamond", "/obj/item/weapon/coin", {
	cmineral: "diamond",
	value: 500,
	name: "diamond coin",
	icon_state: "coin_diamond_heads",
	materials: null,
});

// ores_coins.dm:340
rt.def("/obj/item/weapon/coin/diamond/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$diamond", 400]);
	return f.dot;
});

rt.type(7520, "/obj/item/weapon/coin/iron", "/obj/item/weapon/coin", {
	cmineral: "iron",
	value: 1,
	name: "iron coin",
	icon_state: "coin_iron_heads",
	materials: null,
});

// ores_coins.dm:347
rt.def("/obj/item/weapon/coin/iron/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 400]);
	return f.dot;
});

rt.type(7521, "/obj/item/weapon/coin/plasma", "/obj/item/weapon/coin", {
	cmineral: "plasma",
	value: 100,
	name: "plasma coin",
	icon_state: "coin_plasma_heads",
	materials: null,
});

// ores_coins.dm:354
rt.def("/obj/item/weapon/coin/plasma/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$plasma", 400]);
	return f.dot;
});

rt.type(7522, "/obj/item/weapon/coin/uranium", "/obj/item/weapon/coin", {
	cmineral: "uranium",
	value: 80,
	name: "uranium coin",
	icon_state: "coin_uranium_heads",
	materials: null,
});

// ores_coins.dm:361
rt.def("/obj/item/weapon/coin/uranium/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$uranium", 400]);
	return f.dot;
});

rt.type(7523, "/obj/item/weapon/coin/clown", "/obj/item/weapon/coin", {
	cmineral: "bananium",
	value: 1000,
	name: "bananium coin",
	icon_state: "coin_bananium_heads",
	materials: null,
});

// ores_coins.dm:368
rt.def("/obj/item/weapon/coin/clown/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$bananium", 400]);
	return f.dot;
});

rt.type(7526, "/obj/item/weapon/coin/twoheaded", "/obj/item/weapon/coin", {
	cmineral: "iron",
	sideslist: null,
	value: 1,
	icon_state: "coin_iron_heads",
	desc: "Hey, this coin's the same on both sides!",
	materials: null,
});

// ores_coins.dm:386
rt.def("/obj/item/weapon/coin/twoheaded/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.sideslist = list("heads");
	this.materials = rt.alist(f, ["$metal", 400]);
	return f.dot;
});

// ores_coins.dm:399
rt.def("/obj/item/weapon/coin/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let CC: Value = null;
	if (rt.istype(W, T("/obj/item/stack/cable_coil"))) {
		CC = W;
		if (this.string_attached) {
			to_chat(user, "<span class='warning'>There already is a string attached to this coin!</span>");
			return f.dot;
		}
		if (yield* CC.use(1)) {
			this.add_overlay("coin_string_overlay");
			this.string_attached = 1;
			to_chat(user, "<span class='notice'>You attach a string to the coin.</span>");
		} else {
			to_chat(user, "<span class='warning'>You need one length of cable to attach a string to the coin!</span>");
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (!this.string_attached) {
			yield* parent_proc();
			return f.dot;
		}
		(CC = (yield* new_(T("/obj/item/stack/cable_coil"), user.loc))).amount = 1;
		yield* CC.update_icon();
		this.overlays = list();
		this.string_attached = null;
		to_chat(user, "<span class='notice'>You detach the string from the coin.</span>");
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// ores_coins.dm:427
rt.def("/obj/item/weapon/coin/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!(this.cooldown < rt.worldTime(f))) return f.dot;
	if (this.string_attached) {
		to_chat(user, "<span class='warning'>The coin won't flip very well with something attached!</span>");
		return f.dot;
	}
	let coinflip: Value = pick(this.sideslist);
	this.cooldown = rt.worldTime(f) + 15;
	flick(`coin_${this.cmineral}_flip`, this);
	this.icon_state = `coin_${this.cmineral}_${coinflip}`;
	playsound(user.loc, rt.rsc("sound/items/coinflip.ogg"), 50, 1);
	let oldloc: Value = this.loc;
	yield* sleep(15);
	if (!(this.loc == oldloc && user && !user.incapacitated())) return f.dot;
	user.visible_message(`${user} has flipped ${this}. It lands on ${coinflip}.`, `<span class='notice'>You flip ${this}. It lands on ${coinflip}.</span>`, "<span class='italics'>You hear the clattering of loose change.</span>");
	return f.dot;
}, true);
