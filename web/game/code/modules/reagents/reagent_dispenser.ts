// Based on /tg/station's code/modules/reagents/reagent_dispenser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(12524, "/obj/structure/reagent_dispensers", "/obj/structure", {
	tank_volume: 1000,
	reagent_id: "water",
	anchored: 0,
	container_type: 2048,
	pressure_resistance: 202.65,
	name: "Dispenser",
	desc: "...",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "water",
	density: 1,
	obj_integrity: 300,
	max_integrity: 300,
});

// reagent_dispenser.dm:16
rt.def("/obj/structure/reagent_dispensers/proc/take_damage", function* take_damage(f: Frame) {
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
	if (!(this.tank_volume && (f.args[2] == "bullet" || f.args[2] == "laser"))) return f.dot;
	yield* this.boom();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// reagent_dispenser.dm:22
rt.def("/obj/structure/reagent_dispensers/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/reagent_containers"))) {
		return 0;
	} else {
		return (yield* parent_proc());
	}
}, true);

// reagent_dispenser.dm:28
rt.def("/obj/structure/reagent_dispensers/proc/Initialize", function* Initialize(f: Frame) {
	yield* this.create_reagents(this.tank_volume);
	yield* this.reagents.add_reagent(this.reagent_id, this.tank_volume);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// reagent_dispenser.dm:33
rt.def("/obj/structure/reagent_dispensers/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.reagents.total_volume) {
		to_chat(user, `<span class='notice'>It has ${this.reagents.total_volume} units left.</span>`);
	} else {
		to_chat(user, "<span class='danger'>It's empty.</span>");
	}
	return f.dot;
}, false);

// reagent_dispenser.dm:41
rt.def("/obj/structure/reagent_dispensers/proc/boom", function* boom(f: Frame) {
	this.visible_message(fmt("<span class='danger'>＄！ ruptures!</span>", [this]));
	yield* chem_splash(this.loc, 5, list(this.reagents));
	yield* qdel(this);
	return f.dot;
}, true);

// reagent_dispenser.dm:46
rt.def("/obj/structure/reagent_dispensers/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!disassembled) {
			yield* this.boom();
		}
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true);

rt.type(12525, "/obj/structure/reagent_dispensers/fueltank", "/obj/structure/reagent_dispensers", {
	name: "fuel tank",
	desc: "A tank full of industrial welding fuel. Do not consume.",
	icon_state: "fuel",
	reagent_id: "welding_fuel",
});

// reagent_dispenser.dm:70
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/boom", function* boom(f: Frame) {
	yield* explosion(rt.getStep(f, this, 0), 0, 1, 5, { flame_range: 5 });
	yield* qdel(this);
	return f.dot;
}, true);

// reagent_dispenser.dm:74
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.boom();
	return f.dot;
}, true);

// reagent_dispenser.dm:77
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/ex_act", function* ex_act(f: Frame) {
	yield* this.boom();
	return f.dot;
}, true, { waitfor: false });

// reagent_dispenser.dm:80
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/fire_act", function* fire_act(f: Frame, exposed_temperature: Value, exposed_volume: Value) {
	yield* this.boom();
	return f.dot;
}, true);

// reagent_dispenser.dm:83
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/tesla_act", function* tesla_act(f: Frame) {
	yield* parent_proc();
	yield* this.boom();
	return f.dot;
}, true);

// reagent_dispenser.dm:87
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/bullet_act", function* bullet_act(f: Frame) {
	let boom_message: Value = null;
	yield* parent_proc();
	if (!this || this.gc_destroyed) return f.dot;
	if (!(!f.args[0].nodamage && (f.args[0].damage_type == "fire" || f.args[0].damage_type == "brute"))) return f.dot;
	GLOB.bombers += (boom_message = `${key_name_admin(f.args[0].firer)} triggered a fueltank explosion via projectile.`);
	message_admins(boom_message);
	let log_message: Value = "triggered a fueltank explosion via projectile.";
	f.args[0].firer.log_message(log_message, "Attack log");
	log_attack(`${key_name(f.args[0].firer)} ${log_message}`);
	yield* this.boom();
	return f.dot;
}, true, { args: ["P"] });

// reagent_dispenser.dm:99
rt.def("/obj/structure/reagent_dispensers/fueltank/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null, message_admins: Value = null, message_log: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (!this.reagents.has_reagent("welding_fuel")) {
			to_chat(user, `<span class='warning'>${this} is out of fuel!</span>`);
			return f.dot;
		}
		if (!(W = I).welding) {
			if (W.reagents.has_reagent("welding_fuel", W.max_fuel)) {
				to_chat(user, `<span class='warning'>Your ${W.name} is already full!</span>`);
				return f.dot;
			}
			yield* this.reagents.trans_to(W, W.max_fuel);
			user.visible_message(`<span class='notice'>${user} refills ${user.p_their()} ${W.name}.</span>`, `<span class='notice'>You refill ${W}.</span>`);
			playsound(this, rt.rsc("sound/effects/refill.ogg"), 50, 1);
			yield* W.update_icon();
		} else {
			user.visible_message(`<span class='warning'>${user} catastrophically fails at refilling ${user.p_their()} ${W.name}!</span>`, "<span class='userdanger'>That was stupid of you.</span>");
			GLOB.bombers += (message_admins = `${key_name_admin(user)} triggered a fueltank explosion via welding tool.`);
			yield* g.call(f, P("/proc/message_admins"), null, [message_admins]);
			message_log = "triggered a fueltank explosion via welding tool.";
			user.log_message(message_log, "Attack log");
			log_attack(`${key_name(user)} ${message_log}`);
			yield* this.boom();
		}
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

rt.type(12528, "/obj/structure/reagent_dispensers/peppertank", "/obj/structure/reagent_dispensers", {
	anchored: 1,
	reagent_id: "condensedcapsaicin",
	name: "pepper spray refiller",
	desc: "Contains condensed capsaicin for use in law \"enforcement.\"",
	icon_state: "pepper",
	density: 0,
});

// reagent_dispenser.dm:134
rt.def("/obj/structure/reagent_dispensers/peppertank/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!prob(1)) return f.dot;
	this.desc = "IT'S PEPPER TIME, BITCH!";
	return f.dot;
}, true);

rt.type(12529, "/obj/structure/reagent_dispensers/water_cooler", "/obj/structure/reagent_dispensers", {
	paper_cups: 25,
	anchored: 1,
	tank_volume: 500,
	name: "liquid cooler",
	desc: "A machine that dispenses liquid to drink.",
	icon: rt.rsc("icons/obj/vending.dmi"),
	icon_state: "water_cooler",
});

// reagent_dispenser.dm:149
rt.def("/obj/structure/reagent_dispensers/water_cooler/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `There are ${this.paper_cups ? this.paper_cups : "no"} paper cups left.`);
	return f.dot;
}, false);

// reagent_dispenser.dm:153
rt.def("/obj/structure/reagent_dispensers/water_cooler/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!this.paper_cups) {
		to_chat(user, "<span class='warning'>There aren't any cups left!</span>");
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} takes a cup from ${this}.</span>`, `<span class='notice'>You take a paper cup from ${this}.</span>`);
	let S: Value = (yield* new_(T("/obj/item/weapon/reagent_containers/food/drinks/sillycup"), rt.getStep(f, this, 0)));
	yield* user.put_in_hands(S);
	this.paper_cups--;
	return f.dot;
}, true);

rt.type(12530, "/obj/structure/reagent_dispensers/beerkeg", "/obj/structure/reagent_dispensers", {
	reagent_id: "beer",
	name: "beer keg",
	desc: "Beer is liquid bread, it's good for you...",
	icon_state: "beer",
});

// reagent_dispenser.dm:169
rt.def("/obj/structure/reagent_dispensers/beerkeg/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* explosion(this.loc, 0, 3, 5, 7, 10);
	if (!this || this.gc_destroyed) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);
