// Based on /tg/station's code/game/machinery/deployable.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12544, "/obj/structure/barricade", "/obj/structure", {
	proj_pass_rate: 50,
	material: 1,
	anchored: 1,
	name: "chest high wall",
	desc: "Looks like this would make good cover.",
	density: 1,
	obj_integrity: 100,
	max_integrity: 100,
});

// deployable.dm:22
rt.def("/obj/structure/barricade/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* this.make_debris();
	}
	yield* qdel(this);
	return f.dot;
}, true);

// deployable.dm:30
rt.def("/obj/structure/barricade/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && user.a_intent != "harm" && this.material == METAL) {
		WT = I;
		if (this.obj_integrity < this.max_integrity) {
			if (yield* WT.remove_fuel(0, user)) {
				to_chat(user, `<span class='notice'>You begin repairing ${this}...</span>`);
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
					this.obj_integrity = max(0, min(this.obj_integrity + 20, this.max_integrity));
				}
			}
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// deployable.dm:42
rt.def("/obj/structure/barricade/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let proj: Value = null;
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.locateIn(f, T("/obj/structure/barricade"), rt.getStep(f, mover, 0))) {
		return 1;
	} else if (rt.istype(mover, T("/obj/item/projectile"))) {
		if (!this.anchored) {
			return 1;
		}
		if ((proj = mover).firer && this.Adjacent(proj.firer)) {
			return 1;
		}
		if (prob(this.proj_pass_rate)) {
			return 1;
		}
		return 0;
	} else {
		return (!this.density ? 1 : 0);
	}
});

rt.type(12545, "/obj/structure/barricade/wooden", "/obj/structure/barricade", {
	material: 2,
	name: "wooden barricade",
	desc: "This space is blocked off by a wooden barricade.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "woodenbarricade",
});

// deployable.dm:70
rt.def("/obj/structure/barricade/wooden/proc/make_debris", function* make_debris(f: Frame) {
	yield* new_(T("/obj/item/stack/sheet/mineral/wood"), rt.getStep(f, this, 0), 3);
	return f.dot;
}, true);

rt.type(12546, "/obj/structure/barricade/sandbags", "/obj/structure/barricade", {
	proj_pass_rate: 20,
	pass_flags: 32,
	material: 3,
	smooth: 1,
	name: "sandbags",
	desc: "Bags of sand. Self explanatory.",
	icon: rt.rsc("icons/obj/smooth_structures/sandbags.dmi"),
	icon_state: "sandbags",
	obj_integrity: 280,
	max_integrity: 280,
	climbable: 1,
	canSmoothWith: null,
});

// deployable.dm:85
rt.def("/obj/structure/barricade/sandbags/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = list(T("/obj/structure/barricade/sandbags"), T("/turf/closed/wall"), T("/turf/closed/wall/r_wall"), T("/obj/structure/falsewall"), T("/obj/structure/falsewall/reinforced"), T("/turf/closed/wall/rust"), T("/turf/closed/wall/r_wall/rust"), T("/obj/structure/barricade/security"));
	return f.dot;
});

rt.type(12547, "/obj/structure/barricade/security", "/obj/structure/barricade", {
	deploy_time: 40,
	deploy_message: 1,
	anchored: 0,
	proj_pass_rate: 20,
	name: "security barrier",
	desc: "A deployable barrier. Provides good cover in fire fights.",
	icon: rt.rsc("icons/obj/objects.dmi"),
	icon_state: "barrier0",
	density: 0,
	obj_integrity: 180,
	max_integrity: 180,
	armor: null,
});

// deployable.dm:98
rt.def("/obj/structure/barricade/security/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 10, "bullet", 50, "laser", 50, "energy", 50, "bomb", 10, "bio", 100, "rad", 100, "fire", 10, "acid", 0]);
	return f.dot;
});

// deployable.dm:105
rt.def("/obj/structure/barricade/security/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/barricade/security/proc/deploy"))), this.deploy_time);
	return f.dot;
}, true);

// deployable.dm:109
rt.def("/obj/structure/barricade/security/proc/deploy", function deploy(f: Frame) {
	this.icon_state = "barrier1";
	this.density = 1;
	this.anchored = 1;
	if (!this.deploy_message) return f.dot;
	this.visible_message(`<span class='warning'>${this} deploys!</span>`);
	return f.dot;
});

rt.type(6880, "/obj/item/weapon/grenade/barrier", "/obj/item/weapon/grenade", {
	mode: "single",
	name: "barrier grenade",
	desc: "Instant cover. Alt+click to toggle modes.",
	icon: rt.rsc("icons/obj/grenade.dmi"),
	icon_state: "flashbang",
	item_state: "flashbang",
	actions_types: null,
});

// deployable.dm:122
rt.def("/obj/item/weapon/grenade/barrier/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/toggle_barrier_spread"));
	return f.dot;
});

// deployable.dm:126
rt.def("/obj/item/weapon/grenade/barrier/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living")) || user.incapacitated()) {
		return f.dot;
	}
	this.toggle_mode(user);
	return f.dot;
});

// deployable.dm:131
rt.def("/obj/item/weapon/grenade/barrier/proc/toggle_mode", function toggle_mode(f: Frame, user: Value) {
	if (this.mode === "single") {
		this.mode = "vertical";
	} else if (this.mode === "vertical") {
		this.mode = "horizontal";
	} else if (this.mode === "horizontal") {
		this.mode = "single";
	}
	to_chat(user, `${this} is now in ${this.mode} mode.`);
	return f.dot;
});

// deployable.dm:142
rt.def("/obj/item/weapon/grenade/barrier/proc/prime", function* prime(f: Frame) {
	let target_turf: Value = null, target_turf2: Value = null;
	yield* new_(T("/obj/structure/barricade/security"), rt.getStep(f, this.loc, 0));
	if (this.mode === "vertical") {
		if (!is_blocked_turf((target_turf = rt.getStep(f, this, 1)))) {
			yield* new_(T("/obj/structure/barricade/security"), target_turf);
		}
		if (!is_blocked_turf((target_turf2 = rt.getStep(f, this, 2)))) {
			yield* new_(T("/obj/structure/barricade/security"), target_turf2);
		}
	} else if (this.mode === "horizontal") {
		if (!is_blocked_turf((target_turf = rt.getStep(f, this, 4)))) {
			yield* new_(T("/obj/structure/barricade/security"), target_turf);
		}
		if (!is_blocked_turf((target_turf2 = rt.getStep(f, this, 8)))) {
			yield* new_(T("/obj/structure/barricade/security"), target_turf2);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// deployable.dm:163
rt.def("/obj/item/weapon/grenade/barrier/proc/ui_action_click", function ui_action_click(f: Frame, user: Value) {
	this.toggle_mode(user);
	return f.dot;
});
