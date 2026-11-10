// Based on /tg/station's code/modules/holodeck/items.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(7490, "/obj/item/weapon/holo/esword/green", "/obj/item/weapon/holo/esword", {});

// items.dm:27
rt.def("/obj/item/weapon/holo/esword/green/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.item_color = "green";
	return f.dot;
}, true);

rt.type(7491, "/obj/item/weapon/holo/esword/red", "/obj/item/weapon/holo/esword", {});

// items.dm:32
rt.def("/obj/item/weapon/holo/esword/red/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.item_color = "red";
	return f.dot;
}, true);

rt.type(7489, "/obj/item/weapon/holo/esword", "/obj/item/weapon/holo", {
	active: 0,
	throw_speed: 2,
	throw_range: 5,
	name: "holographic energy sword",
	desc: "May the force be with you. Sorta",
	icon_state: "sword0",
	force: 3,
	throwforce: 0,
	w_class: 2,
	hitsound: "swing_hit",
	armour_penetration: 50,
});

// items.dm:37
rt.def("/obj/item/weapon/holo/esword/proc/hit_reaction", function hit_reaction(f: Frame) {
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
	if (this.active) {
		return parent_proc();
	}
	return 0;
}, false, { args: ["owner", "hitby", "attack_text", "final_block_chance", "damage", "attack_type"] });

// items.dm:41
rt.def("/obj/item/weapon/holo/esword/proc/attack", function* attack(f: Frame, target: Value, user: Value) {
	yield* parent_proc();
	return f.dot;
}, true);

// items.dm:44
rt.def("/obj/item/weapon/holo/esword/proc/New", function* New(f: Frame) {
	this.item_color = pick("red", "blue", "green", "purple");
	yield* parent_proc();
	return f.dot;
}, true);

// items.dm:48
rt.def("/obj/item/weapon/holo/esword/proc/attack_self", function attack_self(f: Frame, user: Value) {
	this.active = (!this.active ? 1 : 0);
	if (this.active) {
		this.force = 30;
		this.icon_state = `sword${this.item_color}`;
		this.w_class = WEIGHT_CLASS_BULKY;
		this.hitsound = rt.rsc("sound/weapons/blade1.ogg");
		playsound(user, rt.rsc("sound/weapons/saberon.ogg"), 20, 1);
		to_chat(user, `<span class='warning'>${this} is now active.</span>`);
	} else {
		this.force = 3;
		this.icon_state = "sword0";
		this.w_class = WEIGHT_CLASS_SMALL;
		this.hitsound = "swing_hit";
		playsound(user, rt.rsc("sound/weapons/saberoff.ogg"), 20, 1);
		to_chat(user, `<span class='warning'>${this} can now be concealed.</span>`);
	}
	return f.dot;
});

rt.type(9728, "/obj/item/toy/beach_ball/holoball/dodgeball", "/obj/item/toy/beach_ball/holoball", {
	item_state: "dodgeball",
	name: "dodgeball",
	icon_state: "dodgeball",
	desc: "Used for playing the most violent and degrading of childhood games.",
});

// items.dm:82
rt.def("/obj/item/toy/beach_ball/holoball/dodgeball/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	yield* parent_proc();
	if (!rt.istype(hit_atom, T("/mob/living/carbon/human"))) return f.dot;
	let M: Value = hit_atom;
	playsound(this, rt.rsc("sound/items/dodgeball.ogg"), 50, 1);
	yield* M.apply_damage(10, "stamina");
	if (!prob(5)) return f.dot;
	yield* M.Knockdown(60);
	this.visible_message(`<span class='danger'>${M} is knocked right off ${M.p_their()} feet!</span>`);
	return f.dot;
}, true, { waitfor: false });

rt.type(12937, "/obj/structure/holohoop", "/obj/structure", {
	anchored: 1,
	name: "basketball hoop",
	desc: "Boom, shakalaka!",
	icon: rt.rsc("icons/obj/basketball.dmi"),
	icon_state: "hoop",
	density: 1,
});

// items.dm:104
rt.def("/obj/structure/holohoop/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!(get_dist(this, user) < 2)) return f.dot;
	if (!(yield* user.drop_item(this))) return f.dot;
	this.visible_message(fmt("<span class='warning'> ＀ dunks ＀ into ％！!</span>", [user, W, this]));
	return f.dot;
}, true);

// items.dm:109
rt.def("/obj/structure/holohoop/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	if (user.pulling && user.a_intent == "grab" && rt.istype(user.pulling, T("/mob/living"))) {
		L = user.pulling;
		if (user.grab_state < 1) {
			to_chat(user, "<span class='warning'>You need a better grip to do that!</span>");
			return f.dot;
		}
		L.loc = this.loc;
		yield* L.Knockdown(100);
		this.visible_message(fmt("<span class='danger'>＀ dunks ＀ into ％！!</span>", [user, L, this]));
		yield* user.stop_pulling();
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// items.dm:122
rt.def("/obj/structure/holohoop/proc/CanPass", function* CanPass(f: Frame) {
	let I: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (rt.istype(f.args[0], T("/obj/item")) && f.args[0].throwing) {
		if (rt.istype((I = f.args[0]), T("/obj/item/projectile"))) {
			return f.dot;
		}
		if (prob(50)) {
			yield* I.forceMove(rt.getStep(f, this, 0));
			this.visible_message(`<span class='warning'>Swish! ${I} lands in ${this}.</span>`);
		} else {
			this.visible_message(`<span class='danger'>${I} bounces off of ${this}'s rim!</span>`);
		}
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true, { args: ["mover", "target", "height"] });

rt.type(10915, "/obj/machinery/readybutton", "/obj/machinery", {
	ready: 0,
	currentarea: null,
	eventstarted: 0,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 2,
	active_power_usage: 6,
	power_channel: 3,
	name: "ready declaration device",
	desc: "This device is used to declare ready. If all devices in an area are ready, the event will begin!",
	icon: rt.rsc("icons/obj/monitors.dmi"),
	icon_state: "auth_off",
});

// items.dm:157
rt.def("/obj/machinery/readybutton/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	to_chat(user, "The station AI is not to interact with these devices");
	return f.dot;
});

// items.dm:161
rt.def("/obj/machinery/readybutton/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	to_chat(user, "<span class='warning'>You are too primitive to use this device!</span>");
	return f.dot;
});

// items.dm:165
rt.def("/obj/machinery/readybutton/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	to_chat(user, "The device is a solid button, there's nothing you can do with it!");
	return f.dot;
});

// items.dm:168
rt.def("/obj/machinery/readybutton/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let button: Value = null;
	if (user.stat || rt.bitAnd(this.stat, 3)) {
		to_chat(user, "<span class='warning'>This device is not powered!</span>");
		return f.dot;
	}
	this.currentarea = get_area(this.loc);
	if (!this.currentarea) {
		yield* qdel(this);
	}
	if (this.eventstarted) {
		to_chat(f.usr, "<span class='warning'>The event has already begun!</span>");
		return f.dot;
	}
	this.ready = (!this.ready ? 1 : 0);
	yield* this.update_icon();
	let numbuttons: Value = 0;
	let numready: Value = 0;
	for (button of each(this.currentarea, T("/obj/machinery/readybutton"))) {
		numbuttons++;
		if (button.ready) {
			numready++;
		}
	}
	if (numbuttons != numready) return f.dot;
	yield* this.begin_event();
	return f.dot;
}, true);

// items.dm:196
rt.def("/obj/machinery/readybutton/proc/update_icon", function update_icon(f: Frame) {
	if (this.ready) {
		this.icon_state = "auth_on";
	} else {
		this.icon_state = "auth_off";
	}
	return f.dot;
});

// items.dm:204
rt.def("/obj/machinery/readybutton/proc/begin_event", function* begin_event(f: Frame) {
	let W: Value = null, M: Value = null;
	this.eventstarted = 1;
	for (W of each(this.currentarea, T("/obj/structure/window"))) {
		if (rt.bitAnd(W.flags, NODECONSTRUCT)) {
			yield* qdel(W);
		}
	}
	for (M of each(this.currentarea, T("/mob"))) {
		to_chat(M, "FIGHT!");
	}
	return f.dot;
}, true);

rt.type(10917, "/obj/machinery/conveyor/holodeck", "/obj/machinery/conveyor", {});

// items.dm:214
rt.def("/obj/machinery/conveyor/holodeck/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (yield* user.drop_item()) {
		I.loc = this.loc;
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
