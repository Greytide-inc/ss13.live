// Based on /tg/station's code/game/objects/structures/plasticflaps.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12859, "/obj/structure/plasticflaps", "/obj/structure", {
	state: 0,
	anchored: 1,
	name: "plastic flaps",
	desc: "Definitely can't get past those. No way.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "plasticflaps",
	armor: null,
	density: 0,
	layer: 4.1,
});

// plasticflaps.dm:6
rt.def("/obj/structure/plasticflaps/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 100, "bullet", 80, "laser", 80, "energy", 100, "bomb", 50, "bio", 100, "rad", 100, "fire", 50, "acid", 50]);
	return f.dot;
});

// plasticflaps.dm:13
rt.def("/obj/structure/plasticflaps/proc/examine", function examine(f: Frame, user: Value) {
	f.dot = parent_proc();
	if (this.state === PLASTIC_FLAPS_NORMAL) {
		to_chat(user, `<span class='notice'>${this} are <b>screwed</b> to the floor.</span>`);
	} else if (this.state === PLASTIC_FLAPS_DETACHED) {
		to_chat(user, `<span class='notice'>${this} are no longer <i>screwed</i> to the floor, and the flaps can be <b>cut</b> apart.</span>`);
	}
	return f.dot;
}, false);

// plasticflaps.dm:21
rt.def("/obj/structure/plasticflaps/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let _P: Value = null;
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.state == PLASTIC_FLAPS_NORMAL) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} unscrews ${this} from the floor.</span>`, `<span class='notice'>You start to unscrew ${this} from the floor...</span>`, "You hear rustling noises.");
			if (yield* do_after(user, 100 * W.toolspeed, { target: this })) {
				if (this.state != PLASTIC_FLAPS_NORMAL) {
					return f.dot;
				}
				this.state = PLASTIC_FLAPS_DETACHED;
				this.anchored = PLASTIC_FLAPS_NORMAL;
				to_chat(user, `<span class='notice'>You unscrew ${this} from the floor.</span>`);
			}
		} else if (this.state == PLASTIC_FLAPS_DETACHED) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} screws ${this} to the floor.</span>`, `<span class='notice'>You start to screw ${this} to the floor...</span>`, "You hear rustling noises.");
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				if (this.state != PLASTIC_FLAPS_DETACHED) {
					return f.dot;
				}
				this.state = PLASTIC_FLAPS_NORMAL;
				this.anchored = PLASTIC_FLAPS_DETACHED;
				to_chat(user, `<span class='notice'>You screw ${this} from the floor.</span>`);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.state == PLASTIC_FLAPS_DETACHED) {
			playsound(this.loc, W.usesound, 100, 1);
			user.visible_message(`<span class='warning'>${user} cuts apart ${this}.</span>`, `<span class='notice'>You start to cut apart ${this}.</span>`, "You hear cutting.");
			if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
				if (this.state != PLASTIC_FLAPS_DETACHED) {
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You cut apart ${this}.</span>`);
				yield* (_P = (yield* new_(T("/obj/item/stack/sheet/plastic/five"), this.loc))).add_fingerprint(user);
				yield* qdel(this);
			}
		}
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// plasticflaps.dm:56
rt.def("/obj/structure/plasticflaps/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value, to_dir: Value, caller: Value) {
	let M: Value = null;
	if (rt.istype(caller, T("/mob/living"))) {
		if (rt.istype(caller, T("/mob/living/simple_animal/bot"))) {
			return 1;
		}
		if (!(M = caller).ventcrawler && M.mob_size != MOB_SIZE_TINY) {
			return 0;
		}
	}
	return 1;
});

// plasticflaps.dm:67
rt.def("/obj/structure/plasticflaps/proc/CanPass", function CanPass(f: Frame) {
	let C: Value = null, M: Value = null;
	if (rt.istype(f.args[0], T("/atom/movable")) && f.args[0].checkpass(2)) {
		return prob(60);
	}
	let B: Value = f.args[0];
	if (rt.istype(f.args[0], T("/obj/structure/bed")) && (B.has_buckled_mobs() || B.density)) {
		return 0;
	}
	if (rt.istype(f.args[0], T("/obj/structure/closet/cardboard"))) {
		if ((C = f.args[0]).move_delay) {
			return 0;
		}
	}
	if (rt.istype(f.args[0], T("/obj/mecha"))) {
		return 0;
	} else if (rt.istype(f.args[0], T("/mob/living"))) {
		M = f.args[0];
		if (rt.istype(f.args[0], T("/mob/living/simple_animal/bot"))) {
			return 1;
		}
		if (M.buckled && rt.istype(M.buckled, T("/mob/living/simple_animal/bot/mulebot"))) {
			return 1;
		}
		if (!M.lying && !M.ventcrawler && M.mob_size != MOB_SIZE_TINY) {
			return 0;
		}
	}
	return parent_proc();
}, false, { args: ["A", "T"] });

// plasticflaps.dm:94
rt.def("/obj/structure/plasticflaps/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* new_(T("/obj/item/stack/sheet/plastic/five"), this.loc);
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12860, "/obj/structure/plasticflaps/mining", "/obj/structure/plasticflaps", {
	CanAtmosPass: 0,
	name: "airtight plastic flaps",
	desc: "Heavy duty, airtight, plastic flaps.",
});

// plasticflaps.dm:104
rt.def("/obj/structure/plasticflaps/mining/proc/New", function* New(f: Frame) {
	this.air_update_turf(1);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// plasticflaps.dm:108
rt.def("/obj/structure/plasticflaps/mining/proc/Destroy", function* Destroy(f: Frame) {
	let oldloc: Value = this.loc;
	f.dot = (yield* parent_proc());
	if (!oldloc) return f.dot;
	oldloc.air_update_turf(1);
	return f.dot;
}, true);
