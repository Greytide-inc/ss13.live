// Based on /tg/station's code/game/mecha/mecha_wreckage.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12556, "/obj/structure/mecha_wreckage", "/obj/structure", {
	welder_salvage: null,
	wirecutters_salvage: null,
	crowbar_salvage: null,
	salvage_num: 5,
	AI: null,
	anchored: 0,
	name: "exosuit wreckage",
	desc: "Remains of some unfortunate mecha. Completely unrepairable, but perhaps something can be salvaged.",
	icon: rt.rsc("icons/mecha/mecha.dmi"),
	density: 1,
	opacity: 0,
});

// mecha_wreckage.dm:13
rt.def("/obj/structure/mecha_wreckage/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.welder_salvage = list(T("/obj/item/stack/sheet/plasteel"), T("/obj/item/stack/sheet/metal"), T("/obj/item/stack/rods"));

	this.wirecutters_salvage = list(T("/obj/item/stack/cable_coil"));

	this.crowbar_salvage = list();
	return f.dot;
});

// mecha_wreckage.dm:20
rt.def("/obj/structure/mecha_wreckage/proc/New", function* New(f: Frame, loc: Value, AI_pilot: Value) {
	yield* parent_proc();
	if (!AI_pilot) return f.dot;
	this.AI = AI_pilot;
	yield* this.AI.apply_damage(150, "fire");
	yield* this.AI.death();
	yield* this.AI.forceMove(this);
	this.add_overlay(mutable_appearance(rt.rsc("icons/obj/projectiles.dmi"), "green_laser"));
	this.AI.controlled_mech = null;
	this.AI.remote_control = null;
	return f.dot;
}, true);

// mecha_wreckage.dm:31
rt.def("/obj/structure/mecha_wreckage/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!this.AI) return f.dot;
	to_chat(user, "<span class='notice'>The AI recovery beacon is active.</span>");
	return f.dot;
}, false);

// mecha_wreckage.dm:36
rt.def("/obj/structure/mecha_wreckage/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let WT: Value = null, type: Value = null, N: Value = null, type_0: Value = null, N_1: Value = null, S: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
		if (this.salvage_num <= 0) {
			to_chat(user, `<span class='warning'>You don't see anything that can be cut with ${I}!</span>`);
			return f.dot;
		}
		WT = I;
		if (this.welder_salvage && rt.len(f, this.welder_salvage) && (yield* WT.remove_fuel(0, user))) {
			if (type = prob(70) ? pick(this.welder_salvage) : null) {
				N = (yield* new_(type, rt.getStep(f, user, 0)));
				user.visible_message(`${user} cuts ${N} from ${this}.`, `<span class='notice'>You cut ${N} from ${this}.</span>`);
				if (rt.istype(N, T("/obj/item/mecha_parts/part"))) {
					this.welder_salvage -= type;
				}
				this.salvage_num--;
			} else {
				to_chat(user, `<span class='warning'>You fail to salvage anything valuable from ${this}!</span>`);
			}
		} else {
			return f.dot;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/wirecutters"))) {
		if (this.salvage_num <= 0) {
			to_chat(user, `<span class='warning'>You don't see anything that can be cut with ${I}!</span>`);
			return f.dot;
		} else if (this.wirecutters_salvage && rt.len(f, this.wirecutters_salvage)) {
			if (type_0 = prob(70) ? pick(this.wirecutters_salvage) : null) {
				N_1 = (yield* new_(type_0, rt.getStep(f, user, 0)));
				user.visible_message(`${user} cuts ${N_1} from ${this}.`, `<span class='notice'>You cut ${N_1} from ${this}.</span>`);
				this.salvage_num--;
			} else {
				to_chat(user, `<span class='warning'>You fail to salvage anything valuable from ${this}!</span>`);
			}
		}
	} else {
		if (!rt.istype(I, T("/obj/item/weapon/crowbar"))) return f.dot;
		if (this.crowbar_salvage && rt.len(f, this.crowbar_salvage)) {
			if (S = pick(this.crowbar_salvage)) {
				S.loc = rt.getStep(f, user, 0);
				this.crowbar_salvage -= S;
				user.visible_message(`${user} pries ${S} from ${this}.`, `<span class='notice'>You pry ${S} from ${this}.</span>`);
			}
			return f.dot;
		} else {
			to_chat(user, `<span class='warning'>You don't see anything that can be pried with ${I}!</span>`);
		}
	}
	return f.dot;
}, true);

// mecha_wreckage.dm:80
rt.def("/obj/structure/mecha_wreckage/proc/transfer_ai", function* transfer_ai(f: Frame) {
	if (!(yield* parent_proc())) {
		return f.dot;
	}
	if (f.args[0] == AI_TRANS_TO_CARD) {
		if (!this.AI) {
			to_chat(f.args[1], "<span class='warning'>No AI backups found.</span>");
			return f.dot;
		}
		this.cut_overlays();
		yield* this.AI.forceMove(f.args[3]);
		f.args[3].AI = this.AI;
		if (this.AI.client) {
			to_chat(this.AI, "The remains of your file system have been recovered on a mobile storage device.");
		} else {
			yield* this.AI.notify_ghost_cloning("You have been recovered from the wreckage!", { source: f.args[3] });
		}
		to_chat(f.args[1], `<span class='boldnotice'>Backup files recovered</span>: ${this.AI.name} (${rand(1000, 9999)}.exe) salvaged from ${this.name} and stored within local memory.`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true, { args: ["interaction", "user", "null", "card"] });

rt.type(12557, "/obj/structure/mecha_wreckage/gygax", "/obj/structure/mecha_wreckage", {
	name: "１Gygax wreckage",
	icon_state: "gygax-broken",
});

// mecha_wreckage.dm:106
rt.def("/obj/structure/mecha_wreckage/gygax/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/part/gygax_torso"), T("/obj/item/mecha_parts/part/gygax_head"), T("/obj/item/mecha_parts/part/gygax_left_arm"), T("/obj/item/mecha_parts/part/gygax_right_arm"), T("/obj/item/mecha_parts/part/gygax_left_leg"), T("/obj/item/mecha_parts/part/gygax_right_leg"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);

rt.type(12563, "/obj/structure/mecha_wreckage/ripley", "/obj/structure/mecha_wreckage", {
	name: "１Ripley wreckage",
	icon_state: "ripley-broken",
});

// mecha_wreckage.dm:149
rt.def("/obj/structure/mecha_wreckage/ripley/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/part/ripley_torso"), T("/obj/item/mecha_parts/part/ripley_left_arm"), T("/obj/item/mecha_parts/part/ripley_right_arm"), T("/obj/item/mecha_parts/part/ripley_left_leg"), T("/obj/item/mecha_parts/part/ripley_right_leg"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);

rt.type(12564, "/obj/structure/mecha_wreckage/ripley/firefighter", "/obj/structure/mecha_wreckage/ripley", {
	name: "１Firefighter wreckage",
	icon_state: "firefighter-broken",
});

// mecha_wreckage.dm:167
rt.def("/obj/structure/mecha_wreckage/ripley/firefighter/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/part/ripley_torso"), T("/obj/item/mecha_parts/part/ripley_left_arm"), T("/obj/item/mecha_parts/part/ripley_right_arm"), T("/obj/item/mecha_parts/part/ripley_left_leg"), T("/obj/item/mecha_parts/part/ripley_right_leg"), T("/obj/item/clothing/suit/fire"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);

rt.type(12566, "/obj/structure/mecha_wreckage/honker", "/obj/structure/mecha_wreckage", {
	name: "１H.O.N.K wreckage",
	icon_state: "honker-broken",
	desc: "All is right in the universe.",
});

// mecha_wreckage.dm:192
rt.def("/obj/structure/mecha_wreckage/honker/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/chassis/honker"), T("/obj/item/mecha_parts/part/honker_torso"), T("/obj/item/mecha_parts/part/honker_head"), T("/obj/item/mecha_parts/part/honker_left_arm"), T("/obj/item/mecha_parts/part/honker_right_arm"), T("/obj/item/mecha_parts/part/honker_left_leg"), T("/obj/item/mecha_parts/part/honker_right_leg"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);

rt.type(12567, "/obj/structure/mecha_wreckage/durand", "/obj/structure/mecha_wreckage", {
	name: "１Durand wreckage",
	icon_state: "durand-broken",
});

// mecha_wreckage.dm:213
rt.def("/obj/structure/mecha_wreckage/durand/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/part/durand_torso"), T("/obj/item/mecha_parts/part/durand_head"), T("/obj/item/mecha_parts/part/durand_left_arm"), T("/obj/item/mecha_parts/part/durand_right_arm"), T("/obj/item/mecha_parts/part/durand_left_leg"), T("/obj/item/mecha_parts/part/durand_right_leg"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);

rt.type(12569, "/obj/structure/mecha_wreckage/odysseus", "/obj/structure/mecha_wreckage", {
	name: "１Odysseus wreckage",
	icon_state: "odysseus-broken",
});

// mecha_wreckage.dm:238
rt.def("/obj/structure/mecha_wreckage/odysseus/proc/New", function* New(f: Frame) {
	let part: Value = null;
	yield* parent_proc();
	let parts: Value = list(T("/obj/item/mecha_parts/part/odysseus_torso"), T("/obj/item/mecha_parts/part/odysseus_head"), T("/obj/item/mecha_parts/part/odysseus_left_arm"), T("/obj/item/mecha_parts/part/odysseus_right_arm"), T("/obj/item/mecha_parts/part/odysseus_left_leg"), T("/obj/item/mecha_parts/part/odysseus_right_leg"));
	let i: Value = 0;
	while (i < 2) {
		if (rt.len(f, parts) && prob(40)) {
			this.welder_salvage += (part = pick(parts));
			parts -= part;
		}
		i++;
	}
	return f.dot;
}, true);
