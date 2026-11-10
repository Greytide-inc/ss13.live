// Based on /tg/station's code/game/objects/items/devices/chameleonproj.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9228, "/obj/item/device/chameleon", "/obj/item/device", {
	can_use: 1,
	active_dummy: null,
	saved_appearance: null,
	flags: 68,
	throw_speed: 3,
	throw_range: 5,
	name: "chameleon-projector",
	icon_state: "shield0",
	slot_flags: 512,
	item_state: "electronic",
	throwforce: 5,
	w_class: 2,
	origin_tech: "syndicate=4;magnets=4",
});

// chameleonproj.dm:17
rt.def("/obj/item/device/chameleon/proc/New", function* New(f: Frame) {
	let butt: Value = null;
	yield* parent_proc();
	this.saved_appearance = rt.initial(f, (butt = T("/obj/item/weapon/cigbutt")), "appearance");
	return f.dot;
}, true);

// chameleonproj.dm:22
rt.def("/obj/item/device/chameleon/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	yield* this.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:26
rt.def("/obj/item/device/chameleon/proc/equipped", function* equipped(f: Frame) {
	yield* parent_proc();
	yield* this.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:30
rt.def("/obj/item/device/chameleon/proc/attack_self", function* attack_self(f: Frame) {
	yield* this.toggle();
	return f.dot;
}, true);

// chameleonproj.dm:33
rt.def("/obj/item/device/chameleon/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let temp: Value = null;
	if (!proximity) {
		return f.dot;
	}
	if (!this.check_sprite(target)) {
		return f.dot;
	}
	if (this.active_dummy) return f.dot;
	if (!(rt.istype(target, T("/obj/item")) && !rt.istype(target, T("/obj/item/weapon/disk/nuclear")))) return f.dot;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/weapons/flash.ogg"), 100, 1, -6);
	to_chat(user, `<span class='notice'>Scanned ${target}.</span>`);
	(temp = (yield* new_(T("/obj")))).appearance = target.appearance;
	temp.layer = rt.initial(f, target, "layer");
	temp.plane = rt.initial(f, target, "plane");
	this.saved_appearance = temp.appearance;
	return f.dot;
}, true);

// chameleonproj.dm:47
rt.def("/obj/item/device/chameleon/proc/check_sprite", function check_sprite(f: Frame, target: Value) {
	if (rt.isIn(f, target.icon_state, icon_states(target.icon))) {
		return 1;
	}
	return 0;
});

// chameleonproj.dm:52
rt.def("/obj/item/device/chameleon/proc/toggle", function* toggle(f: Frame) {
	let C: Value = null;
	if (!this.can_use || !this.saved_appearance) {
		return f.dot;
	}
	if (this.active_dummy) {
		yield* this.eject_all();
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 100, 1, -6);
		yield* qdel(this.active_dummy);
		this.active_dummy = null;
		to_chat(f.usr, fmt("<span class='notice'>You deactivate ％！.</span>", [this]));
		yield* new_(T("/obj/effect/temp_visual/emp/pulse"), rt.getStep(f, this, 0));
	} else {
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/pop.ogg"), 100, 1, -6);
		yield* (C = (yield* new_(T("/obj/effect/dummy/chameleon"), f.usr.loc))).activate(f.usr, this.saved_appearance, this);
		to_chat(f.usr, fmt("<span class='notice'>You activate ％！.</span>", [this]));
		yield* new_(T("/obj/effect/temp_visual/emp/pulse"), rt.getStep(f, this, 0));
	}
	return f.dot;
}, true);

// chameleonproj.dm:69
rt.def("/obj/item/device/chameleon/proc/disrupt", function* disrupt(f: Frame, delete_dummy: Value) {
	let M: Value = null, spark_system: Value = null;
	delete_dummy ??= 1;
	if (!this.active_dummy) return f.dot;
	for (M of each(this.active_dummy, T("/mob"))) {
		to_chat(M, "<span class='danger'>Your chameleon-projector deactivates.</span>");
	}
	yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, this);
	yield* spark_system.attach(this);
	yield* spark_system.start();
	yield* this.eject_all();
	if (delete_dummy) {
		yield* qdel(this.active_dummy);
	}
	this.active_dummy = null;
	this.can_use = 0;
	rt.spawnTail(f, 50, "/obj/item/device/chameleon/proc/disrupt: spawn at game/objects/items/devices/chameleonproj.dm:80", delete_dummy, M, spark_system);
	return f.dot;
}, true);

// a spawn(50) body of /obj/item/device/chameleon/proc/disrupt, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/device/chameleon/proc/disrupt: spawn at game/objects/items/devices/chameleonproj.dm:80", function* (f: Frame, delete_dummy: Value, M: Value, spark_system: Value) {
	this.can_use = 1;
	return null;
});

// chameleonproj.dm:83
rt.def("/obj/item/device/chameleon/proc/eject_all", function* eject_all(f: Frame) {
	let A: Value = null, M: Value = null;
	for (A of each(this.active_dummy, T("/atom/movable"))) {
		A.loc = this.active_dummy.loc;
		if (ismob(A)) {
			yield* (M = A).reset_perspective(null);
		}
	}
	return f.dot;
}, true);

rt.type(11948, "/obj/effect/dummy/chameleon", "/obj/effect/dummy", {
	can_move: 0,
	master: null,
	name: "",
	desc: "",
	density: 0,
});

// chameleonproj.dm:97
rt.def("/obj/effect/dummy/chameleon/proc/activate", function activate(f: Frame, M: Value, saved_appearance: Value, C: Value) {
	this.appearance = saved_appearance;
	M.loc = this;
	this.master = C;
	this.master.active_dummy = this;
	return f.dot;
});

// chameleonproj.dm:103
rt.def("/obj/effect/dummy/chameleon/proc/attackby", function* attackby(f: Frame) {
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:106
rt.def("/obj/effect/dummy/chameleon/proc/attack_hand", function* attack_hand(f: Frame) {
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:109
rt.def("/obj/effect/dummy/chameleon/proc/attack_animal", function* attack_animal(f: Frame) {
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:112
rt.def("/obj/effect/dummy/chameleon/proc/attack_slime", function* attack_slime(f: Frame) {
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:115
rt.def("/obj/effect/dummy/chameleon/proc/attack_alien", function* attack_alien(f: Frame) {
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:118
rt.def("/obj/effect/dummy/chameleon/proc/ex_act", function* ex_act(f: Frame, S: Value, _T: Value) {
	yield* this.contents_explosion(S, _T);
	yield* this.master.disrupt();
	return f.dot;
}, true, { waitfor: false });

// chameleonproj.dm:122
rt.def("/obj/effect/dummy/chameleon/proc/bullet_act", function* bullet_act(f: Frame) {
	yield* parent_proc();
	yield* this.master.disrupt();
	return f.dot;
}, true);

// chameleonproj.dm:126
rt.def("/obj/effect/dummy/chameleon/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	let amount: Value = null;
	if (rt.istype(this.loc, T("/turf/open/space")) || !direction) {
		return f.dot;
	}
	if (this.can_move < rt.worldTime(f)) {
		if (rt.inRange(user.bodytemperature, 300, 1e+31)) {
			amount = 10;
		} else if (rt.inRange(user.bodytemperature, 295, 300)) {
			amount = 13;
		} else if (rt.inRange(user.bodytemperature, 280, 295)) {
			amount = 16;
		} else if (rt.inRange(user.bodytemperature, 260, 280)) {
			amount = 20;
		} else {
			amount = 25;
		}
		this.can_move = rt.worldTime(f) + amount;
		yield* step(this, direction);
	}
	return f.dot;
}, true);

// chameleonproj.dm:148
rt.def("/obj/effect/dummy/chameleon/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.master.disrupt(0);
	return (yield* parent_proc());
}, true);
