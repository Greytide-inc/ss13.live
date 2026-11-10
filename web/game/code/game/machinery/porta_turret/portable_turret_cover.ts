// Based on /tg/station's code/game/machinery/porta_turret/portable_turret_cover.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10871, "/obj/machinery/porta_turret_cover", "/obj/machinery", {
	parent_turret: null,
	anchored: 1,
	name: "turret",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turretCover",
	layer: 3.6,
	density: 0,
	obj_integrity: 80,
	max_integrity: 80,
});

// portable_turret_cover.dm:19
rt.def("/obj/machinery/porta_turret_cover/proc/Destroy", function* Destroy(f: Frame) {
	if (this.parent_turret) {
		this.parent_turret.cover = null;
		this.parent_turret.invisibility = 0;
		this.parent_turret = null;
	}
	return (yield* parent_proc());
}, true);

// portable_turret_cover.dm:29
rt.def("/obj/machinery/porta_turret_cover/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	return (yield* this.parent_turret.attack_ai(user));
}, true);

// portable_turret_cover.dm:37
rt.def("/obj/machinery/porta_turret_cover/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.dot = (yield* parent_proc());
	if (f.dot) {
		return f.dot;
	}
	return (yield* this.parent_turret.attack_hand(user));
}, true);

// portable_turret_cover.dm:45
rt.def("/obj/machinery/porta_turret_cover/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench")) && !this.parent_turret.on) {
		if (this.parent_turret.raised) {
			return f.dot;
		}
		if (!this.parent_turret.anchored) {
			this.parent_turret.anchored = 1;
			to_chat(user, "<span class='notice'>You secure the exterior bolts on the turret.</span>");
			this.parent_turret.invisibility = 0;
			yield* this.parent_turret.update_icon();
		} else {
			this.parent_turret.anchored = 0;
			to_chat(user, "<span class='notice'>You unsecure the exterior bolts on the turret.</span>");
			this.parent_turret.invisibility = INVISIBILITY_MAXIMUM;
			yield* this.parent_turret.update_icon();
			yield* qdel(this);
		}
	} else if (I.GetID()) {
		if (yield* this.parent_turret.allowed(user)) {
			this.parent_turret.locked = (!this.parent_turret.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>Controls are now ${this.parent_turret.locked ? "locked" : "unlocked"}.</span>`);
			yield* this.updateUsrDialog();
		} else {
			to_chat(user, "<span class='notice'>Access denied.</span>");
		}
	} else if (rt.istype(I, T("/obj/item/device/multitool")) && !this.parent_turret.locked) {
		(M = I).buffer = this.parent_turret;
		to_chat(user, `<span class='notice'>You add ${this.parent_turret} to multitool buffer.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// portable_turret_cover.dm:76
rt.def("/obj/machinery/porta_turret_cover/proc/attacked_by", function* attacked_by(f: Frame, I: Value, user: Value) {
	yield* this.parent_turret.attacked_by(I, user);
	return f.dot;
}, true);

// portable_turret_cover.dm:79
rt.def("/obj/machinery/porta_turret_cover/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.parent_turret.attack_alien(user);
	return f.dot;
}, true);

// portable_turret_cover.dm:82
rt.def("/obj/machinery/porta_turret_cover/proc/attack_animal", function* attack_animal(f: Frame, user: Value) {
	yield* this.parent_turret.attack_animal(user);
	return f.dot;
}, true);

// portable_turret_cover.dm:85
rt.def("/obj/machinery/porta_turret_cover/proc/attack_hulk", function* attack_hulk(f: Frame, user: Value, does_attack_animation: Value) {
	does_attack_animation ??= 0;
	return (yield* this.parent_turret.attack_hulk(user));
}, true);

// portable_turret_cover.dm:91
rt.def("/obj/machinery/porta_turret_cover/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.parent_turret.emagged) return f.dot;
	to_chat(user, `<span class='notice'>You short out ${this.parent_turret}'s threat assessment circuits.</span>`);
	this.visible_message(`${this.parent_turret} hums oddly...`);
	this.parent_turret.emagged = 1;
	this.parent_turret.on = 0;
	rt.spawnTail(f, 40, "/obj/machinery/porta_turret_cover/proc/emag_act: spawn at game/machinery/porta_turret/portable_turret_cover.dm:96", user);
	return f.dot;
});

// a spawn(40) body of /obj/machinery/porta_turret_cover/proc/emag_act, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/porta_turret_cover/proc/emag_act: spawn at game/machinery/porta_turret/portable_turret_cover.dm:96", function* (f: Frame, user: Value) {
	this.parent_turret.on = 1;
	return null;
});
