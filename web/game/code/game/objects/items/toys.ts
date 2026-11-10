// Based on /tg/station's code/game/objects/items/toys.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, subtract, fmt } = rt;


rt.type(9684, "/obj/item/toy/balloon", "/obj/item/toy", {
	item_state: "balloon-empty",
	name: "water balloon",
	desc: "A translucent balloon. There's nothing in it.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "waterballoon-e",
});

// toys.dm:45
rt.def("/obj/item/toy/balloon/proc/New", function* New(f: Frame) {
	yield* this.create_reagents(10);
	yield* parent_proc();
	return f.dot;
}, true);

// toys.dm:52
rt.def("/obj/item/toy/balloon/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let RD: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!rt.istype(A, T("/obj/structure/reagent_dispensers"))) return f.dot;
	if ((RD = A).reagents.total_volume <= 0) {
		to_chat(user, `<span class='warning'>${RD} is empty.</span>`);
	} else if (this.reagents.total_volume >= 10) {
		to_chat(user, `<span class='warning'>${this} is full.</span>`);
	} else {
		yield* A.reagents.trans_to(this, 10);
		to_chat(user, `<span class='notice'>You fill the balloon with the contents of ${A}.</span>`);
		this.desc = "A translucent balloon with some form of liquid sloshing around in it.";
		yield* this.update_icon();
	}
	return f.dot;
}, true);

// toys.dm:66
rt.def("/obj/item/toy/balloon/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/glass"))) {
		if (I.reagents) {
			if (I.reagents.total_volume <= 0) {
				to_chat(user, `<span class='warning'>${I} is empty.</span>`);
			} else if (this.reagents.total_volume >= 10) {
				to_chat(user, `<span class='warning'>${this} is full.</span>`);
			} else {
				this.desc = "A translucent balloon with some form of liquid sloshing around in it.";
				to_chat(user, `<span class='notice'>You fill the balloon with the contents of ${I}.</span>`);
				yield* I.reagents.trans_to(this, 10);
				yield* this.update_icon();
			}
		}
	} else if (I.is_sharp()) {
		yield* this.balloon_burst();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// toys.dm:83
rt.def("/obj/item/toy/balloon/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	if (yield* parent_proc()) return f.dot;
	yield* this.balloon_burst(hit_atom);
	return f.dot;
}, true, { waitfor: false });

// toys.dm:87
rt.def("/obj/item/toy/balloon/proc/balloon_burst", function* balloon_burst(f: Frame, AT: Value) {
	let _T: Value = null, A: Value = null;
	if (!(this.reagents.total_volume >= 1)) return f.dot;
	if (AT) {
		_T = rt.getStep(f, AT, 0);
	} else {
		_T = rt.getStep(f, this, 0);
	}
	_T.visible_message(`<span class='danger'>${this} bursts!</span>`, "<span class='italics'>You hear a pop and a splash.</span>");
	yield* this.reagents.reaction(_T);
	for (A of each(_T, T("/atom"))) {
		yield* this.reagents.reaction(A);
	}
	this.icon_state = "burst";
	yield* qdel(this);
	return f.dot;
}, true);

// toys.dm:101
rt.def("/obj/item/toy/balloon/proc/update_icon", function update_icon(f: Frame) {
	if (this.reagents.total_volume >= 1) {
		this.icon_state = "waterballoon";
		this.item_state = "balloon";
	} else {
		this.icon_state = "waterballoon-e";
		this.item_state = "balloon-empty";
	}
	return f.dot;
});

rt.type(9687, "/obj/item/toy/gun", "/obj/item/toy", {
	bullets: 7,
	item_state: "gun",
	lefthand_file: rt.rsc("icons/mob/inhands/guns_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/guns_righthand.dmi"),
	flags: 64,
	slot_flags: 512,
	w_class: 3,
	materials: null,
	attack_verb: null,
	name: "cap gun",
	desc: "Looks almost like the real thing! Ages 8 and up. Please recycle in an autolathe when you're out of caps.",
	icon: rt.rsc("icons/obj/guns/projectile.dmi"),
	icon_state: "revolver",
});

// toys.dm:143
rt.def("/obj/item/toy/gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10, "$glass", 10]);
	this.attack_verb = list("struck", "pistol whipped", "hit", "bashed");
	return f.dot;
});

// toys.dm:148
rt.def("/obj/item/toy/gun/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, fmt("There ＀ ＀ cap５ left.", [this.bullets == 1 ? "is" : "are", this.bullets]));
	return f.dot;
}, false);

// toys.dm:153
rt.def("/obj/item/toy/gun/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	if (rt.istype(A, T("/obj/item/toy/ammo/gun"))) {
		if (this.bullets >= 7) {
			to_chat(user, "<span class='warning'>It's already fully loaded!</span>");
			return 1;
		}
		if (A.amount_left <= 0) {
			to_chat(user, "<span class='warning'>There are no more caps!</span>");
			return 1;
		}
		if (A.amount_left < 7 - this.bullets) {
			rt.modField(f, this, "bullets", A.amount_left, add);
			to_chat(user, fmt("<span class='notice'>You reload ＀ cap５.</span>", [A.amount_left]));
			A.amount_left = 0;
		} else {
			to_chat(user, fmt("<span class='notice'>You reload ＀ cap５.</span>", [7 - this.bullets]));
			A.amount_left -= 7 - this.bullets;
			this.bullets = 7;
		}
		yield* A.update_icon();
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// toys.dm:176
rt.def("/obj/item/toy/gun/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	if (flag) {
		return f.dot;
	}
	if (!user.IsAdvancedToolUser()) {
		to_chat(user, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (this.bullets < 1) {
		user.show_message("<span class='warning'>*click*</span>", 2);
		playsound(user, rt.rsc("sound/weapons/empty.ogg"), 100, 1);
		return f.dot;
	}
	playsound(user, rt.rsc("sound/weapons/gunshot.ogg"), 100, 1);
	rt.incField(f, this, "bullets", -1, true);
	user.visible_message(`<span class='danger'>${user} fires ${this} at ${target}!</span>`, `<span class='danger'>You fire ${this} at ${target}!</span>`, "<span class='italics'>You hear a gunshot!</span>");
	return f.dot;
}, true);

rt.type(9689, "/obj/item/toy/ammo/gun", "/obj/item/toy/ammo", {
	amount_left: 7,
	w_class: 1,
	materials: null,
	name: "capgun ammo",
	desc: "Make sure to recyle the box in an autolathe when it gets empty.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "357OLD-7",
});

// toys.dm:196
rt.def("/obj/item/toy/ammo/gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 10, "$glass", 10]);
	return f.dot;
});

// toys.dm:200
rt.def("/obj/item/toy/ammo/gun/proc/update_icon", function update_icon(f: Frame) {
	this.icon_state = `357OLD-${this.amount_left}`;
	return f.dot;
});

// toys.dm:203
rt.def("/obj/item/toy/ammo/gun/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, fmt("There ＀ ＀ cap５ left.", [this.amount_left == 1 ? "is" : "are", this.amount_left]));
	return f.dot;
}, false);

rt.type(9690, "/obj/item/toy/sword", "/obj/item/toy", {
	active: 0,
	hacked: 0,
	item_state: "sword0",
	w_class: 2,
	attack_verb: null,
	name: "toy sword",
	desc: "A cheap, plastic replica of an energy sword. Realistic sounds! Ages 8 and up.",
	icon: rt.rsc("icons/obj/weapons.dmi"),
	icon_state: "sword0",
});

// toys.dm:221
rt.def("/obj/item/toy/sword/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		to_chat(user, "<span class='notice'>You extend the plastic blade with a quick flick of your wrist.</span>");
		playsound(user, rt.rsc("sound/weapons/saberon.ogg"), 20, 1);
		if (this.hacked) {
			this.icon_state = "swordrainbow";
			this.item_state = "swordrainbow";
		} else {
			this.icon_state = "swordblue";
			this.item_state = "swordblue";
		}
		this.w_class = WEIGHT_CLASS_BULKY;
	} else {
		to_chat(user, "<span class='notice'>You push the plastic blade back down into the handle.</span>");
		playsound(user, rt.rsc("sound/weapons/saberoff.ogg"), 20, 1);
		this.icon_state = "sword0";
		this.item_state = "sword0";
		this.w_class = WEIGHT_CLASS_SMALL;
	}
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// toys.dm:242
rt.def("/obj/item/toy/sword/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let newSaber: Value = null;
	let $0: any, $1: any, $2: any;
	if (rt.istype(W, T("/obj/item/toy/sword"))) {
		if (rt.bitAnd(W.flags, NODROP) || rt.bitAnd(this.flags, NODROP)) {
			$0 = user;
			if (rt.bitAnd(this.flags, NODROP)) {
				$1 = this;
			} else {
				$1 = W;
			}
			if (rt.bitAnd(this.flags, NODROP)) {
				$2 = W;
			} else {
				$2 = this;
			}
			to_chat($0, fmt("<span class='warning'>％！ is stuck to your hand, you can't attach it to ％！!</span>", [$1, $2]));
			return f.dot;
		} else {
			to_chat(user, "<span class='notice'>You attach the ends of the two plastic swords, making a single double-bladed toy! You're fake-cool.</span>");
			newSaber = (yield* new_(T("/obj/item/weapon/twohanded/dualsaber/toy"), user.loc));
			if (this.hacked) {
				newSaber.hacked = 1;
				newSaber.item_color = "rainbow";
			}
			yield* qdel(W);
			yield* qdel(this);
		}
	} else if (rt.istype(W, T("/obj/item/device/multitool"))) {
		if (this.hacked == 0) {
			this.hacked = 1;
			this.item_color = "rainbow";
			to_chat(user, "<span class='warning'>RNBW_ENGAGE</span>");
			if (this.active) {
				this.icon_state = "swordrainbow";
				yield* user.update_inv_hands();
			}
		} else {
			to_chat(user, "<span class='warning'>It's already fabulous!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9692, "/obj/item/toy/windupToolbox", "/obj/item/toy", {
	active: 0,
	item_state: "artistic_toolbox",
	attack_verb: null,
	name: "windup toolbox",
	desc: "A replica toolbox that rumbles when you turn the key",
	icon_state: "his_grace",
	icon: rt.rsc("icons/obj/weapons.dmi"),
});

// toys.dm:289
rt.def("/obj/item/toy/windupToolbox/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.attack_verb = list("robusted");
	return f.dot;
});

// toys.dm:292
rt.def("/obj/item/toy/windupToolbox/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (!this.active) {
		this.icon_state = "his_grace_awakened";
		to_chat(user, `<span class='warning'>You wind up ${this}, it begins to rumble.</span>`);
		this.active = 1;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/toy/windupToolbox/proc/stopRumble"))), 600);
	} else {
		to_chat(user, `${this} is already active.`);
	}
	return f.dot;
}, true);

// toys.dm:301
rt.def("/obj/item/toy/windupToolbox/proc/stopRumble", function stopRumble(f: Frame) {
	this.icon_state = rt.initial(f, this, "icon_state");
	this.active = 0;
	return f.dot;
});

rt.type(9694, "/obj/item/toy/snappop", "/obj/item/toy", {
	ash_type: rt.typePath("/obj/effect/decal/cleanable/ash"),
	w_class: 1,
	name: "snap pop",
	desc: "Wow!",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snappop",
});

// toys.dm:352
rt.def("/obj/item/toy/snappop/proc/pop_burst", function* pop_burst(f: Frame, n: Value, c: Value) {
	let s: Value = null;
	n ??= 3;
	c ??= 1;
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(n, c, this);
	yield* s.start();
	yield* new_(this.ash_type, this.loc);
	this.visible_message(`<span class='warning'>${this} explodes!</span>`, "<span class='italics'>You hear a snap!</span>");
	playsound(this, rt.rsc("sound/effects/snap.ogg"), 50, 1);
	yield* qdel(this);
	return f.dot;
}, true);

// toys.dm:362
rt.def("/obj/item/toy/snappop/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* this.pop_burst();
	return f.dot;
}, true);

// toys.dm:365
rt.def("/obj/item/toy/snappop/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	if (yield* parent_proc()) return f.dot;
	yield* this.pop_burst();
	return f.dot;
}, true, { waitfor: false });

// toys.dm:369
rt.def("/obj/item/toy/snappop/proc/Crossed", function* Crossed(f: Frame, H: Value) {
	if (!(rt.istype(H, T("/mob/living/carbon/human")) || rt.istype(H, T("/mob/living/silicon")))) return f.dot;
	let M: Value = H;
	if (!(rt.istype(H, T("/mob/living/silicon")) || M.m_intent == "run")) return f.dot;
	to_chat(M, "<span class='danger'>You step on the snap pop!</span>");
	yield* this.pop_burst(2, 0);
	return f.dot;
}, true);

rt.type(11740, "/obj/effect/decal/cleanable/ash/snappop_phoenix", "/obj/effect/decal/cleanable/ash", {
	respawn_time: 300,
});

// toys.dm:384
rt.def("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/New", function* New(f: Frame) {
	f.dot = (yield* parent_proc());
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/respawn"))), this.respawn_time);
	return f.dot;
}, true);

// toys.dm:388
rt.def("/obj/effect/decal/cleanable/ash/snappop_phoenix/proc/respawn", function* respawn(f: Frame) {
	yield* new_(T("/obj/item/toy/snappop/phoenix"), rt.getStep(f, this, 0));
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(9696, "/obj/item/toy/prize", "/obj/item/toy", {
	timer: 0,
	cooldown: 30,
	quiet: 0,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "ripleytoy",
});

// toys.dm:404
rt.def("/obj/item/toy/prize/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (this.timer < rt.worldTime(f)) {
		to_chat(user, `<span class='notice'>You play with ${this}.</span>`);
		this.timer = rt.worldTime(f) + this.cooldown;
		if (!this.quiet) {
			playsound(user, rt.rsc("sound/mecha/mechstep.ogg"), 20, 1);
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// toys.dm:413
rt.def("/obj/item/toy/prize/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.loc == user) {
		yield* this.attack_self(user);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9709, "/obj/item/toy/talking", "/obj/item/toy", {
	cooldown: 0,
	messages: null,
	span: "danger",
	recharge_time: 30,
	chattering: 0,
	phomeme: null,
	w_class: 2,
	name: "talking action figure",
	desc: "A generic action figure modeled after nothing in particular.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "owlprize",
});

// toys.dm:495
rt.def("/obj/item/toy/talking/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	f.dot = (yield* this.attack_hand(user));
	return f.dot;
}, true);

// toys.dm:498
rt.def("/obj/item/toy/talking/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let messages: Value = null, message: Value = null;
	if (!this.cooldown) {
		messages = this.generate_messages();
		this.activation_message(user);
		playsound(this.loc, rt.rsc("sound/machines/click.ogg"), 20, 1);
		rt.spawnTail(f, 0, "/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:503", messages, message);
		this.cooldown = 1;
		rt.spawnTail(f, this.recharge_time, "/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:509", messages, message);
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[89])) body of /obj/item/toy/talking/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:509", function* (f: Frame, messages: Value, message: Value) {
	this.cooldown = 0;
	return null;
});

// a spawn(0) body of /obj/item/toy/talking/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/talking/proc/attack_self: spawn at game/objects/items/toys.dm:503", function* (f: Frame, messages: Value, message: Value) {
	message = null;
	for (message of each(messages)) {
		this.toy_talk(f.args[0], message);
		yield* sleep(10);
	}
	return null;
});

// toys.dm:515
rt.def("/obj/item/toy/talking/proc/activation_message", function activation_message(f: Frame, user: Value) {
	user.visible_message(fmt("<span class='notice'>＀ pulls the string on ％！.</span>", [user, this]), fmt("<span class='notice'>You pull the string on ％！.</span>", [this]), "<span class='notice'>You hear a string being pulled.</span>");
	return f.dot;
});

// toys.dm:521
rt.def("/obj/item/toy/talking/proc/generate_messages", function generate_messages(f: Frame) {
	return list(pick(this.messages));
});

// toys.dm:524
rt.def("/obj/item/toy/talking/proc/toy_talk", function toy_talk(f: Frame, user: Value, message: Value) {
	user.loc.visible_message(`<span class='${this.span}'>${bicon(this)} ${message}</span>`);
	if (!this.chattering) return f.dot;
	chatter(message, this.phomeme, user);
	return f.dot;
});

rt.type(9710, "/obj/item/toy/talking/AI", "/obj/item/toy/talking", {
	name: "toy AI",
	desc: "A little toy model AI core with real law announcing action!",
	icon_state: "AI",
});

// toys.dm:537
rt.def("/obj/item/toy/talking/AI/proc/generate_messages", function generate_messages(f: Frame) {
	return list(generate_ion_law());
});

rt.type(9711, "/obj/item/toy/talking/codex_gigas", "/obj/item/toy/talking", {
	w_class: 2,
	recharge_time: 60,
	name: "Toy Codex Gigas",
	desc: "A tool to help you write fictional devils!",
	icon: rt.rsc("icons/obj/library.dmi"),
	icon_state: "demonomicon",
});

// toys.dm:548
rt.def("/obj/item/toy/talking/codex_gigas/proc/activation_message", function activation_message(f: Frame, user: Value) {
	user.visible_message(fmt("<span class='notice'>＀ presses the button on ％！.</span>", [user, this]), fmt("<span class='notice'>You press the button on ％！.</span>", [this]), "<span class='notice'>You hear a soft click.</span>");
	return f.dot;
});

// toys.dm:554
rt.def("/obj/item/toy/talking/codex_gigas/proc/generate_messages", function generate_messages(f: Frame) {
	let devil: Value = new_(T("/datum/fakeDevil"));
	let messages: Value = list();
	messages += `Some fun facts about: ${devil.truename}`;
	messages += `${rt.index(rt.index(GLOB.lawlorify, LORE), devil.bane)}`;
	messages += `${rt.index(rt.index(GLOB.lawlorify, LORE), devil.obligation)}`;
	messages += `${rt.index(rt.index(GLOB.lawlorify, LORE), devil.ban)}`;
	return (messages += `${rt.index(rt.index(GLOB.lawlorify, LORE), devil.banish)}`);
});

rt.type(9714, "/obj/item/toy/cards", "/obj/item/toy", {
	parentdeck: null,
	deckstyle: "nanotrasen",
	card_hitsound: null,
	card_force: 0,
	card_throwforce: 0,
	card_throw_speed: 3,
	card_throw_range: 7,
	card_attack_verb: null,
	resistance_flags: 4,
	obj_integrity: 50,
	max_integrity: 50,
});

// toys.dm:596
rt.def("/obj/item/toy/cards/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.card_attack_verb = list("attacked");
	return f.dot;
});

// toys.dm:599
rt.def("/obj/item/toy/cards/proc/apply_card_vars", function apply_card_vars(f: Frame, newobj: Value, sourceobj: Value) {
	if (rt.istype(sourceobj, T("/obj/item/toy/cards"))) return f.dot;
	return f.dot;
});

rt.type(9715, "/obj/item/toy/cards/deck", "/obj/item/toy/cards", {
	cooldown: 0,
	holo: null,
	cards: null,
	deckstyle: "nanotrasen",
	w_class: 2,
	name: "deck of cards",
	desc: "A deck of space-grade playing cards.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "deck_nanotrasen_full",
});

// toys.dm:611
rt.def("/obj/item/toy/cards/deck/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.cards = list();
	return f.dot;
});

// toys.dm:614
rt.def("/obj/item/toy/cards/deck/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.icon_state = `deck_${this.deckstyle}_full`;
	let i: Value = 2;
	while (i <= 10) {
		this.cards += `${i} of Hearts`;
		this.cards += `${i} of Spades`;
		this.cards += `${i} of Clubs`;
		this.cards += `${i} of Diamonds`;
		i++;
	}
	this.cards += "King of Hearts";
	this.cards += "King of Spades";
	this.cards += "King of Clubs";
	this.cards += "King of Diamonds";
	this.cards += "Queen of Hearts";
	this.cards += "Queen of Spades";
	this.cards += "Queen of Clubs";
	this.cards += "Queen of Diamonds";
	this.cards += "Jack of Hearts";
	this.cards += "Jack of Spades";
	this.cards += "Jack of Clubs";
	this.cards += "Jack of Diamonds";
	this.cards += "Ace of Hearts";
	this.cards += "Ace of Spades";
	this.cards += "Ace of Clubs";
	this.cards += "Ace of Diamonds";
	return f.dot;
}, true);

// toys.dm:640
rt.def("/obj/item/toy/cards/deck/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user.lying) {
		return f.dot;
	}
	if (rt.len(f, this.cards) == 0) {
		to_chat(user, "<span class='warning'>There are no more cards to draw!</span>");
		return f.dot;
	}
	let H: Value = (yield* new_(T("/obj/item/toy/cards/singlecard"), user.loc));
	if (this.holo) {
		this.holo.spawned += H;
	}
	let choice: Value = rt.index(this.cards, 1);
	H.cardname = choice;
	H.parentdeck = this;
	let O: Value = this;
	H.apply_card_vars(H, O);
	(rt.modField(f, this, "cards", choice, subtract));
	yield* H.pickup(user);
	yield* user.put_in_hands(H);
	user.visible_message(`${user} draws a card from the deck.`, "<span class='notice'>You draw a card from the deck.</span>");
	yield* this.update_icon();
	return f.dot;
}, true);

// toys.dm:661
rt.def("/obj/item/toy/cards/deck/proc/update_icon", function update_icon(f: Frame) {
	if (rt.len(f, this.cards) > 26) {
		this.icon_state = `deck_${this.deckstyle}_full`;
	} else if (rt.len(f, this.cards) > 10) {
		this.icon_state = `deck_${this.deckstyle}_half`;
	} else if (rt.len(f, this.cards) > 0) {
		this.icon_state = `deck_${this.deckstyle}_low`;
	} else {
		if (rt.len(f, this.cards) != 0) return f.dot;
		this.icon_state = `deck_${this.deckstyle}_empty`;
	}
	return f.dot;
});

// toys.dm:671
rt.def("/obj/item/toy/cards/deck/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!(this.cooldown < rt.worldTime(f) - 50)) return f.dot;
	this.cards = shuffle(this.cards);
	playsound(user, rt.rsc("sound/items/cardshuffle.ogg"), 50, 1);
	user.visible_message(`${user} shuffles the deck.`, "<span class='notice'>You shuffle the deck.</span>");
	this.cooldown = rt.worldTime(f);
	return f.dot;
});

// toys.dm:678
rt.def("/obj/item/toy/cards/deck/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let SC: Value = null, CH: Value = null;
	if (rt.istype(I, T("/obj/item/toy/cards/singlecard"))) {
		if ((SC = I).parentdeck == this) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(SC))) {
				to_chat(user, "<span class='warning'>The card is stuck to your hand, you can't add it to the deck!</span>");
				return f.dot;
			}
			this.cards += SC.cardname;
			user.visible_message(`${user} adds a card to the bottom of the deck.`, "<span class='notice'>You add the card to the bottom of the deck.</span>");
			yield* qdel(SC);
		} else {
			to_chat(user, "<span class='warning'>You can't mix cards from other decks!</span>");
		}
		yield* this.update_icon();
	} else if (rt.istype(I, T("/obj/item/toy/cards/cardhand"))) {
		if ((CH = I).parentdeck == this) {
			if (!(yield* user.temporarilyRemoveItemFromInventory(CH))) {
				to_chat(user, "<span class='warning'>The hand of cards is stuck to your hand, you can't add it to the deck!</span>");
				return f.dot;
			}
			this.cards += CH.currenthand;
			user.visible_message(`${user} puts their hand of cards in the deck.`, "<span class='notice'>You put the hand of cards in the deck.</span>");
			yield* qdel(CH);
		} else {
			to_chat(user, "<span class='warning'>You can't mix cards from other decks!</span>");
		}
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// toys.dm:706
rt.def("/obj/item/toy/cards/deck/proc/MouseDrop", function* MouseDrop(f: Frame, over_object: Value) {
	let M: Value = null, H: Value = null;
	if (!rt.istype((M = f.usr), T("/mob/living")) || f.usr.incapacitated() || f.usr.lying) {
		return f.dot;
	}
	if (this.Adjacent(f.usr)) {
		if (over_object == M && this.loc != M) {
			yield* M.put_in_hands(this);
			to_chat(f.usr, "<span class='notice'>You pick up the deck.</span>");
		} else if (rt.istype(over_object, T("/obj/screen/inventory/hand"))) {
			H = over_object;
			if (yield* M.putItemFromInventoryInHandIfPossible(this, H.held_index)) {
				to_chat(f.usr, "<span class='notice'>You pick up the deck.</span>");
			}
		}
	} else {
		to_chat(f.usr, "<span class='warning'>You can't reach it from here!</span>");
	}
	return f.dot;
}, true);

rt.type(9719, "/obj/item/toy/cards/cardhand", "/obj/item/toy/cards", {
	currenthand: null,
	choice: null,
	w_class: 1,
	name: "hand of cards",
	desc: "A number of cards not in a deck, customarily held in ones hand.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nanotrasen_hand2",
});

// toys.dm:730
rt.def("/obj/item/toy/cards/cardhand/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.currenthand = list();
	return f.dot;
});

// toys.dm:735
rt.def("/obj/item/toy/cards/cardhand/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	yield* user.set_machine(this);
	yield* this.interact(user);
	return f.dot;
}, true);

// toys.dm:739
rt.def("/obj/item/toy/cards/cardhand/proc/interact", function* interact(f: Frame, user: Value) {
	let t: Value = null, popup: Value = null;
	let dat: Value = "You have:<BR>";
	for (t of each(this.currenthand)) {
		dat += fmt("<A href='?src=＃;pick=＀'>A ＀.</A><BR>", [this, t, t]);
	}
	dat += "Which card will you remove next?";
	(popup = (yield* new_(T("/datum/browser"), user, "cardhand", "Hand of Cards", 400, 240))).set_title_image(user.browse_rsc_icon(this.icon, this.icon_state));
	popup.set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// toys.dm:750
rt.def("/obj/item/toy/cards/cardhand/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let choice: Value = null, C: Value = null, N: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (f.usr.stat || !rt.istype(f.usr, T("/mob/living/carbon/human")) || !f.usr.canmove) {
		return f.dot;
	}
	let cardUser: Value = f.usr;
	let O: Value = this;
	if (!rt.at(href_list, "pick")) return f.dot;
	if (cardUser.is_holding(this)) {
		choice = rt.at(href_list, "pick");
		C = (yield* new_(T("/obj/item/toy/cards/singlecard"), cardUser.loc));
		(rt.modField(f, this, "currenthand", choice, subtract));
		C.parentdeck = this.parentdeck;
		C.cardname = choice;
		C.apply_card_vars(C, O);
		yield* C.pickup(cardUser);
		yield* cardUser.put_in_hands(C);
		cardUser.visible_message(`<span class='notice'>${cardUser} draws a card from ${cardUser.p_their()} hand.</span>`, `<span class='notice'>You take the ${C.cardname} from your hand.</span>`);
		yield* this.interact(cardUser);
		if (rt.len(f, this.currenthand) < 3) {
			this.icon_state = `${this.deckstyle}_hand2`;
		} else if (rt.len(f, this.currenthand) < 4) {
			this.icon_state = `${this.deckstyle}_hand3`;
		} else if (rt.len(f, this.currenthand) < 5) {
			this.icon_state = `${this.deckstyle}_hand4`;
		}
		if (rt.len(f, this.currenthand) == 1) {
			(N = (yield* new_(T("/obj/item/toy/cards/singlecard"), this.loc))).parentdeck = this.parentdeck;
			N.cardname = rt.index(this.currenthand, 1);
			N.apply_card_vars(N, O);
			yield* qdel(this);
			yield* N.pickup(cardUser);
			yield* cardUser.put_in_hands(N);
			to_chat(cardUser, `<span class='notice'>You also take ${rt.index(this.currenthand, 1)} and hold it.</span>`);
			rt.op(f, "Browse", [], [cardUser, null, "window=cardhand"], false);
		}
	}
	return f.dot;
}, true);

// toys.dm:788
rt.def("/obj/item/toy/cards/cardhand/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	if (rt.istype(C, T("/obj/item/toy/cards/singlecard"))) {
		if (C.parentdeck == this.parentdeck) {
			rt.modField(f, this, "currenthand", C.cardname, add);
			user.visible_message(`${user} adds a card to ${user.p_their()} hand.`, `<span class='notice'>You add the ${C.cardname} to your hand.</span>`);
			yield* qdel(C);
			yield* this.interact(user);
			if (rt.len(f, this.currenthand) > 4) {
				this.icon_state = `${this.deckstyle}_hand5`;
			} else if (rt.len(f, this.currenthand) > 3) {
				this.icon_state = `${this.deckstyle}_hand4`;
			} else if (rt.len(f, this.currenthand) > 2) {
				this.icon_state = `${this.deckstyle}_hand3`;
			}
		} else {
			to_chat(user, "<span class='warning'>You can't mix cards from other decks!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// toys.dm:806
rt.def("/obj/item/toy/cards/cardhand/proc/apply_card_vars", function apply_card_vars(f: Frame, newobj: Value, sourceobj: Value) {
	parent_proc();
	newobj.deckstyle = sourceobj.deckstyle;
	newobj.icon_state = `${this.deckstyle}_hand2`;
	newobj.card_hitsound = sourceobj.card_hitsound;
	newobj.card_force = sourceobj.card_force;
	newobj.card_throwforce = sourceobj.card_throwforce;
	newobj.card_throw_speed = sourceobj.card_throw_speed;
	newobj.card_throw_range = sourceobj.card_throw_range;
	newobj.card_attack_verb = sourceobj.card_attack_verb;
	newobj.resistance_flags = sourceobj.resistance_flags;
	return f.dot;
}, false);

rt.type(9720, "/obj/item/toy/cards/singlecard", "/obj/item/toy/cards", {
	cardname: null,
	flipped: 0,
	w_class: 1,
	name: "card",
	desc: "a card",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "singlecard_nanotrasen_down",
	pixel_x: -5,
});

// toys.dm:829
rt.def("/obj/item/toy/cards/singlecard/proc/examine", function examine(f: Frame, user: Value) {
	let cardUser: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if ((cardUser = user).is_holding(this)) {
		cardUser.visible_message(`${cardUser} checks ${cardUser.p_their()} card.`, `<span class='notice'>The card reads: ${this.cardname}</span>`);
	} else {
		to_chat(cardUser, "<span class='warning'>You need to have the card in your hand to check it!</span>");
	}
	return f.dot;
});

// toys.dm:841
rt.def("/obj/item/toy/cards/singlecard/verb/Flip", function Flip(f: Frame) {
	if (f.usr.stat || !rt.istype(f.usr, T("/mob/living/carbon/human")) || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	if (!this.flipped) {
		this.flipped = 1;
		if (this.cardname) {
			this.icon_state = `sc_${this.cardname}_${this.deckstyle}`;
			this.name = this.cardname;
		} else {
			this.icon_state = `sc_Ace of Spades_${this.deckstyle}`;
			this.name = "What Card";
		}
		this.pixel_x = 5;
	} else {
		if (!this.flipped) return f.dot;
		this.flipped = 0;
		this.icon_state = `singlecard_down_${this.deckstyle}`;
		this.name = "card";
		this.pixel_x = -5;
	}
	return f.dot;
}, false, { verb: { name: "Flip Card", category: "Object", src: 5, range: 1 } });

// toys.dm:859
rt.def("/obj/item/toy/cards/singlecard/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null, H: Value = null, H_0: Value = null;
	if (rt.istype(I, T("/obj/item/toy/cards/singlecard"))) {
		if ((C = I).parentdeck == this.parentdeck) {
			(H = (yield* new_(T("/obj/item/toy/cards/cardhand"), user.loc))).currenthand += C.cardname;
			H.currenthand += this.cardname;
			H.parentdeck = C.parentdeck;
			H.apply_card_vars(H, C);
			to_chat(user, `<span class='notice'>You combine the ${C.cardname} and the ${this.cardname} into a hand.</span>`);
			yield* qdel(C);
			yield* qdel(this);
			yield* H.pickup(user);
			yield* user.put_in_active_hand(H);
		} else {
			to_chat(user, "<span class='warning'>You can't mix cards from other decks!</span>");
		}
	}
	if (rt.istype(I, T("/obj/item/toy/cards/cardhand"))) {
		if ((H_0 = I).parentdeck == this.parentdeck) {
			H_0.currenthand += this.cardname;
			user.visible_message(`${user} adds a card to ${user.p_their()} hand.`, `<span class='notice'>You add the ${this.cardname} to your hand.</span>`);
			yield* qdel(this);
			yield* H_0.interact(user);
			if (rt.len(f, H_0.currenthand) > 4) {
				H_0.icon_state = `${this.deckstyle}_hand5`;
			} else if (rt.len(f, H_0.currenthand) > 3) {
				H_0.icon_state = `${this.deckstyle}_hand4`;
			} else if (rt.len(f, H_0.currenthand) > 2) {
				H_0.icon_state = `${this.deckstyle}_hand3`;
			}
		} else {
			to_chat(user, "<span class='warning'>You can't mix cards from other decks!</span>");
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// toys.dm:894
rt.def("/obj/item/toy/cards/singlecard/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (f.usr.stat || !rt.istype(f.usr, T("/mob/living/carbon/human")) || !f.usr.canmove || f.usr.restrained()) {
		return f.dot;
	}
	this.Flip();
	return f.dot;
});

// toys.dm:899
rt.def("/obj/item/toy/cards/singlecard/proc/apply_card_vars", function apply_card_vars(f: Frame, newobj: Value, sourceobj: Value) {
	parent_proc();
	newobj.deckstyle = sourceobj.deckstyle;
	newobj.icon_state = `singlecard_down_${this.deckstyle}`;
	newobj.card_hitsound = sourceobj.card_hitsound;
	newobj.hitsound = newobj.card_hitsound;
	newobj.card_force = sourceobj.card_force;
	newobj.force = newobj.card_force;
	newobj.card_throwforce = sourceobj.card_throwforce;
	newobj.throwforce = newobj.card_throwforce;
	newobj.card_throw_speed = sourceobj.card_throw_speed;
	newobj.throw_speed = newobj.card_throw_speed;
	newobj.card_throw_range = sourceobj.card_throw_range;
	newobj.throw_range = newobj.card_throw_range;
	newobj.card_attack_verb = sourceobj.card_attack_verb;
	newobj.attack_verb = newobj.card_attack_verb;
	return f.dot;
}, false);

rt.type(9722, "/obj/item/toy/nuke", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	name: "１Nuclear Fission Explosive toy",
	desc: "A plastic model of a Nuclear Fission Explosive.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nuketoyidle",
});

// toys.dm:945
rt.def("/obj/item/toy/nuke/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let timeleft: Value = null;
	if (this.cooldown < rt.worldTime(f)) {
		this.cooldown = rt.worldTime(f) + 1800;
		user.visible_message(`<span class='warning'>${user} presses a button on ${this}.</span>`, `<span class='notice'>You activate ${this}, it plays a loud noise!</span>`, "<span class='italics'>You hear the click of a button.</span>");
		yield* sleep(5);
		this.icon_state = "nuketoy";
		yield* playsound(this, rt.rsc("sound/machines/alarm.ogg"), 100, 0, { surround: 0 });
		yield* sleep(135);
		this.icon_state = "nuketoycool";
		yield* sleep(this.cooldown - rt.worldTime(f));
		this.icon_state = "nuketoyidle";
	} else {
		timeleft = this.cooldown - rt.worldTime(f);
		to_chat(user, `<span class='alert'>Nothing happens, and '</span>${round(timeleft / 10)}<span class='alert'>' appears on a small display.</span>`);
	}
	return f.dot;
}, true);

rt.type(9723, "/obj/item/toy/minimeteor", "/obj/item/toy", {
	w_class: 2,
	name: "１Mini-Meteor",
	desc: "Relive the excitement of a meteor shower! SweetMeat-eor. Co is not responsible for any injuries, headaches or hearing loss caused by Mini-Meteor.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "minimeteor",
});

// toys.dm:971
rt.def("/obj/item/toy/minimeteor/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let M: Value = null;
	if (yield* parent_proc()) return f.dot;
	playsound(this, rt.rsc("sound/effects/meteorimpact.ogg"), 40, 1);
	for (M of each(urange(10, this), T("/mob"))) {
		if (!M.stat && !rt.istype(M, T("/mob/living/silicon/ai"))) {
			shake_camera(M, 3, 1);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(9679, "/obj/item/toy/carpplushie", "/obj/item/toy", {
	bitesound: rt.rsc("sound/weapons/bite.ogg"),
	item_state: "carp_plushie",
	w_class: 2,
	attack_verb: null,
	name: "space carp plushie",
	desc: "An adorable stuffed toy that resembles a space carp.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "carpplushie",
	resistance_flags: 4,
});

// toys.dm:995
rt.def("/obj/item/toy/carpplushie/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	playsound(this.loc, this.bitesound, 20, 1);
	return (yield* parent_proc());
}, true);

// toys.dm:1000
rt.def("/obj/item/toy/carpplushie/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	playsound(this.loc, this.bitesound, 20, 1);
	to_chat(user, `<span class='notice'>You pet ${this}. D'awww.</span>`);
	return (yield* parent_proc());
}, true);

rt.type(9724, "/obj/item/toy/redbutton", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	name: "big red button",
	desc: "A big, plastic red button. Reads 'From HonkCo Pranks?' on the back.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "bigred",
});

// toys.dm:1016
rt.def("/obj/item/toy/redbutton/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	if (this.cooldown < rt.worldTime(f)) {
		this.cooldown = rt.worldTime(f) + 300;
		user.visible_message(`<span class='warning'>${user} presses the big red button.</span>`, "<span class='notice'>You press the button, it plays a loud noise!</span>", "<span class='italics'>The button clicks loudly.</span>");
		yield* playsound(this, rt.rsc("sound/effects/explosionfar.ogg"), 50, 0, { surround: 0 });
		for (M of each(urange(10, this), T("/mob"))) {
			if (!M.stat && !rt.istype(M, T("/mob/living/silicon/ai"))) {
				yield* sleep(8);
				shake_camera(M, 2, 1);
			}
		}
	} else {
		to_chat(user, "<span class='alert'>Nothing happens.</span>");
	}
	return f.dot;
}, true);

rt.type(9725, "/obj/item/toy/snowball", "/obj/item/toy", {
	name: "snowball",
	desc: "A compact ball of snow. Good for throwing at people.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "snowball",
	throwforce: 12,
});

// toys.dm:1040
rt.def("/obj/item/toy/snowball/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	yield* user.drop_item();
	yield* this.throw_at(target, this.throw_range, this.throw_speed);
	return f.dot;
}, true);

// toys.dm:1044
rt.def("/obj/item/toy/snowball/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	if (yield* parent_proc()) return f.dot;
	playsound(this, rt.rsc("sound/effects/pop.ogg"), 20, 1);
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

rt.type(9726, "/obj/item/toy/beach_ball", "/obj/item/toy", {
	item_state: "beachball",
	w_class: 4,
	icon: rt.rsc("icons/misc/beach.dmi"),
	icon_state: "ball",
	name: "beach ball",
});

// toys.dm:1059
rt.def("/obj/item/toy/beach_ball/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value) {
	yield* user.drop_item();
	yield* this.throw_at(target, this.throw_range, this.throw_speed);
	return f.dot;
}, true);

rt.type(9729, "/obj/item/toy/toy_xeno", "/obj/item/toy", {
	cooldown: 0,
	w_class: 2,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "toy_xeno",
	name: "xenomorph action figure",
	desc: "MEGA presents the new Xenos Isolated action figure! Comes complete with realistic sounds! Pull back string to use.",
});

// toys.dm:1075
rt.def("/obj/item/toy/toy_xeno/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let possible_sounds: Value = null, chosen_sound: Value = null;
	if (this.cooldown <= rt.worldTime(f)) {
		this.cooldown = rt.worldTime(f) + 50;
		user.visible_message(`<span class='notice'>${user} pulls back the string on ${this}.</span>`);
		this.icon_state = `${rt.initial(f, this, "icon_state")}_used`;
		yield* sleep(5);
		this.audible_message(`<span class='danger'>${bicon(this)} Hiss!</span>`);
		possible_sounds = list(rt.rsc("sound/voice/hiss1.ogg"), rt.rsc("sound/voice/hiss2.ogg"), rt.rsc("sound/voice/hiss3.ogg"), rt.rsc("sound/voice/hiss4.ogg"));
		chosen_sound = pick(possible_sounds);
		playsound(rt.getStep(f, this, 0), chosen_sound, 50, 1);
		rt.spawnTail(f, 45, "/obj/item/toy/toy_xeno/proc/attack_self: spawn at game/objects/items/toys.dm:1084", user, possible_sounds, chosen_sound);
	} else {
		to_chat(user, `<span class='warning'>The string on ${this} hasn't rewound all the way!</span>`);
		return f.dot;
	}
	return f.dot;
}, true);

// a spawn(45) body of /obj/item/toy/toy_xeno/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/toy/toy_xeno/proc/attack_self: spawn at game/objects/items/toys.dm:1084", function* (f: Frame, user: Value, possible_sounds: Value, chosen_sound: Value) {
	if (this) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}`;
	}
	return null;
});

rt.type(9731, "/obj/item/toy/figure", "/obj/item/toy", {
	cooldown: 0,
	toysay: "What the fuck did you do?",
	toysound: rt.rsc("sound/machines/click.ogg"),
	name: "Non-Specific Action Figure action figure",
	desc: null,
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "nuketoy",
});

// toys.dm:1117
rt.def("/obj/item/toy/figure/proc/New", function* New(f: Frame) {
	this.desc = `A "Space Life" brand ${this}.`;
	yield* parent_proc();
	return f.dot;
}, true);

// toys.dm:1121
rt.def("/obj/item/toy/figure/proc/attack_self", function attack_self(f: Frame, user: Value) {
	if (!(this.cooldown <= rt.worldTime(f))) return f.dot;
	this.cooldown = rt.worldTime(f) + 50;
	to_chat(user, `<span class='notice'>The ${this} says "${this.toysay}"</span>`);
	playsound(user, this.toysound, 20, 1);
	return f.dot;
});

rt.type(9768, "/obj/item/toy/dummy", "/obj/item/toy", {
	doll_name: "Dummy",
	item_state: "doll",
	name: "ventriloquist dummy",
	desc: "It's a dummy, dummy.",
	icon: rt.rsc("icons/obj/toy.dmi"),
	icon_state: "assistant",
});

// toys.dm:1324
rt.def("/obj/item/toy/dummy/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let new_name: Value = null;
	if (!(new_name = (yield* stripped_input(f.usr, "What would you like to name the dummy?", "Input a name", this.doll_name, 42)))) {
		return f.dot;
	}
	this.doll_name = new_name;
	to_chat(user, `You name the dummy as "${this.doll_name}"`);
	this.name = `${rt.initial(f, this, "name")} - ${this.doll_name}`;
	return f.dot;
}, true);

// toys.dm:1332
rt.def("/obj/item/toy/dummy/proc/talk_into", function* talk_into(f: Frame, M: Value, message: Value, channel: Value, spans: Value, language: Value) {
	log_say(`${key_name(M)} : through dummy : ${message}`);
	yield* this.say(message, language);
	return NOPASS;
}, true);
