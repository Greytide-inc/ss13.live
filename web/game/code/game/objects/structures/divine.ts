// Based on /tg/station's code/game/objects/structures/divine.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12728, "/obj/structure/sacrificealtar", "/obj/structure", {
	anchored: 1,
	can_buckle: 1,
	name: "sacrificial altar",
	desc: "An altar designed to perform blood sacrifice for a deity.",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "sacrificealtar",
	density: 0,
});

// divine.dm:11
rt.def("/obj/structure/sacrificealtar/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let L: Value = null;
	yield* parent_proc();
	if (!this.has_buckled_mobs()) {
		return f.dot;
	}
	if (!(L = rt.locateIn(f, T("/mob/living"), this.buckled_mobs))) {
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You attempt to sacrifice ${L} by invoking the sacrificial ritual.</span>`);
	yield* L.gib();
	message_admins(`${key_name_admin(user)} has sacrificed ${key_name_admin(L)} on the sacrifical altar.`);
	return f.dot;
}, true);

rt.type(12729, "/obj/structure/healingfountain", "/obj/structure", {
	time_between_uses: 1800,
	last_process: 0,
	anchored: 1,
	name: "healing fountain",
	desc: "A fountain containing the waters of life.",
	icon: rt.rsc("icons/obj/hand_of_god_structures.dmi"),
	icon_state: "fountain",
	density: 1,
});

// divine.dm:32
rt.def("/obj/structure/healingfountain/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.last_process + this.time_between_uses > rt.worldTime(f)) {
		to_chat(user, "<span class='notice'>The fountain appears to be empty.</span>");
		return f.dot;
	}
	this.last_process = rt.worldTime(f);
	to_chat(user, "<span class='notice'>The water feels warm and soothing as you touch it. The fountain immediately dries up shortly afterwards.</span>");
	yield* user.reagents.add_reagent("godblood", 20);
	yield* this.update_icons();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/structure/healingfountain/proc/update_icons"))), this.time_between_uses);
	return f.dot;
}, true);

// divine.dm:43
rt.def("/obj/structure/healingfountain/proc/update_icons", function update_icons(f: Frame) {
	if (this.last_process + this.time_between_uses > rt.worldTime(f)) {
		this.icon_state = "fountain";
	} else {
		this.icon_state = "fountain-red";
	}
	return f.dot;
});
