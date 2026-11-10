// Based on /tg/station's code/game/machinery/syndicatebeacon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10305, "/obj/machinery/power/singularity_beacon", "/obj/machinery/power", {
	cooldown: 0,
	active: 0,
	icontype: "beacon",
	anchored: 0,
	verb_say: "states",
	name: "ominous beacon",
	desc: "This looks suspicious...",
	icon: rt.rsc("icons/obj/singularity.dmi"),
	icon_state: "beacon",
	density: 1,
	layer: 3.7,
	stat: 0,
});

// syndicatebeacon.dm:22
rt.def("/obj/machinery/power/singularity_beacon/proc/Activate", function Activate(f: Frame, user: Value) {
	let singulo: Value = null;
	if (this.surplus() < 1500) {
		if (user) {
			to_chat(user, "<span class='notice'>The connected wire doesn't have enough current.</span>");
		}
		return f.dot;
	}
	for (singulo of each(GLOB.singularities, T("/obj/singularity"))) {
		if (singulo.z == this.z) {
			singulo.target = this;
		}
	}
	this.icon_state = `${this.icontype}1`;
	this.active = 1;
	if (!user) return f.dot;
	to_chat(user, "<span class='notice'>You activate the beacon.</span>");
	return f.dot;
});

// syndicatebeacon.dm:35
rt.def("/obj/machinery/power/singularity_beacon/proc/Deactivate", function Deactivate(f: Frame, user: Value) {
	let singulo: Value = null;
	for (singulo of each(GLOB.singularities, T("/obj/singularity"))) {
		if (singulo.target == this) {
			singulo.target = null;
		}
	}
	this.icon_state = `${this.icontype}0`;
	this.active = 0;
	if (!user) return f.dot;
	to_chat(user, "<span class='notice'>You deactivate the beacon.</span>");
	return f.dot;
});

// syndicatebeacon.dm:50
rt.def("/obj/machinery/power/singularity_beacon/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (this.anchored) {
		return this.active ? this.Deactivate(user) : this.Activate(user);
	}
	to_chat(user, "<span class='warning'>You need to screw the beacon to the floor first!</span>");
	return f.dot;
});

// syndicatebeacon.dm:57
rt.def("/obj/machinery/power/singularity_beacon/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.active) {
			to_chat(user, "<span class='warning'>You need to deactivate the beacon first!</span>");
			return f.dot;
		}
		if (this.anchored) {
			this.anchored = 0;
			to_chat(user, "<span class='notice'>You unscrew the beacon from the floor.</span>");
			yield* this.disconnect_from_network();
			return f.dot;
		} else {
			if (!(yield* this.connect_to_network())) {
				to_chat(user, "<span class='warning'>This device must be placed over an exposed, powered cable node!</span>");
				return f.dot;
			}
			this.anchored = 1;
			to_chat(user, "<span class='notice'>You screw the beacon to the floor and attach the cable.</span>");
			return f.dot;
		}
	} else {
		return (yield* parent_proc());
	}
}, true);

// syndicatebeacon.dm:79
rt.def("/obj/machinery/power/singularity_beacon/proc/Destroy", function* Destroy(f: Frame) {
	if (this.active) {
		yield* this.Deactivate();
	}
	return (yield* parent_proc());
}, true);

// syndicatebeacon.dm:84
rt.def("/obj/machinery/power/singularity_beacon/proc/process", function* process(f: Frame) {
	let singulo: Value = null;
	if (!this.active) {
		return f.dot;
	}
	if (this.surplus() > 1500) {
		this.add_load(1500);
		if (this.cooldown <= rt.worldTime(f)) {
			this.cooldown = rt.worldTime(f) + 100;
			for (singulo of each(GLOB.singularities, T("/obj/singularity"))) {
				if (singulo.z == this.z) {
					yield* this.say(`The ${singulo} is now ${get_dist(this, singulo)} standard lengths away to the ${dir2text(rt.getDir(f, this, singulo))}`);
				}
			}
		}
	} else {
		yield* this.Deactivate();
		yield* this.say("Insufficient charge detected - powering down");
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(9222, "/obj/item/device/sbeacondrop", "/obj/item/device", {
	droptype: rt.typePath("/obj/machinery/power/singularity_beacon/syndicate"),
	name: "suspicious beacon",
	icon: rt.rsc("icons/obj/radio.dmi"),
	icon_state: "beacon",
	desc: "A label on it reads: <i>Warning: Activating this device will send a special beacon to your location</i>.",
	origin_tech: "bluespace=6;syndicate=5",
	w_class: 2,
});

// syndicatebeacon.dm:116
rt.def("/obj/item/device/sbeacondrop/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	if (user) {
		to_chat(user, "<span class='notice'>Locked In.</span>");
		yield* new_(this.droptype, user.loc);
		playsound(this, rt.rsc("sound/effects/pop.ogg"), 100, 1, 1);
		yield* qdel(this);
	}
	return f.dot;
}, true);
