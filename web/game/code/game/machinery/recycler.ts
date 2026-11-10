// Based on /tg/station's code/game/machinery/recycler.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10814, "/obj/machinery/recycler", "/obj/machinery", {
	safety_mode: 0,
	icon_name: "grinder-o",
	blood: 0,
	eat_dir: 8,
	amount_produced: 50,
	materials: null,
	crush_damage: 1000,
	eat_victim_items: 1,
	item_recycle_sound: rt.rsc("sound/items/welder.ogg"),
	anchored: 1,
	name: "recycler",
	desc: "A large crushing machine used to recycle small items inefficiently. There are lights on the side.",
	icon: rt.rsc("icons/obj/recycling.dmi"),
	icon_state: "grinder-o0",
	layer: 4.5,
	density: 1,
});

// recycler.dm:22
rt.def("/obj/machinery/recycler/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	this.materials = (yield* new_(T("/datum/material_container"), this, list("$metal", "$glass", "$plasma", "$silver", "$gold", "$diamond", "$uranium", "$bananium", "$titanium")));
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/recycler"), null))).apply_default_parts(this);
	yield* this.update_icon();
	return f.dot;
}, true);

rt.type(6728, "/obj/item/weapon/circuitboard/machine/recycler", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Recycler (Machine Board)",
	build_path: rt.typePath("/obj/machinery/recycler"),
	origin_tech: "programming=2;engineering=2",
});

// recycler.dm:32
rt.def("/obj/item/weapon/circuitboard/machine/recycler/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 1]);
	return f.dot;
});

// recycler.dm:39
rt.def("/obj/machinery/recycler/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null, M: Value = null;
	let amt_made: Value = 0;
	let mat_mod: Value = 0;
	for (B of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		mat_mod = 2 * B.rating;
	}
	mat_mod *= 50000;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		amt_made = 12.5 * M.rating;
	}
	this.materials.max_amount = mat_mod;
	this.amount_produced = min(50, amt_made) + 50;
	return f.dot;
});

// recycler.dm:48
rt.def("/obj/machinery/recycler/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The power light is ${rt.bitAnd(this.stat, 2) ? "off" : "on"}.`);
	to_chat(user, `The safety-mode light is ${this.safety_mode ? "on" : "off"}.`);
	to_chat(user, `The safety-sensors status light is ${this.emagged ? "off" : "on"}.`);
	return f.dot;
}, false);

// recycler.dm:54
rt.def("/obj/machinery/recycler/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// recycler.dm:59
rt.def("/obj/machinery/recycler/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "grinder-oOpen", "grinder-o0", I)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// recycler.dm:76
rt.def("/obj/machinery/recycler/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	this.emagged = 1;
	if (this.safety_mode) {
		this.safety_mode = 0;
		this.update_icon();
	}
	playsound(this.loc, "sparks", 75, 1, -1);
	to_chat(user, `<span class='notice'>You use the cryptographic sequencer on the ${this.name}.</span>`);
	return f.dot;
});

// recycler.dm:85
rt.def("/obj/machinery/recycler/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	let is_powered: Value = (!rt.bitAnd(this.stat, 3) ? 1 : 0);
	if (this.safety_mode) {
		is_powered = 0;
	}
	let $0: any = this.icon_name + `${is_powered}`;
	this.icon_state = $0 + `${this.blood ? "bld" : ""}`;
	return f.dot;
});

// recycler.dm:93
rt.def("/obj/machinery/recycler/proc/Bump", function* Bump(f: Frame, AM: Value) {
	yield* parent_proc();
	if (!AM) return f.dot;
	yield* this.Bumped(AM);
	return f.dot;
}, true);

// recycler.dm:100
rt.def("/obj/machinery/recycler/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let move_dir: Value = null;
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!this.anchored) {
		return f.dot;
	}
	if (this.safety_mode) {
		return f.dot;
	}
	if ((move_dir = rt.getDir(f, this.loc, AM.loc)) != this.eat_dir) return f.dot;
	yield* this.eat(AM);
	return f.dot;
}, true);

// recycler.dm:113
rt.def("/obj/machinery/recycler/proc/eat", function* eat(f: Frame, AM0: Value, sound: Value) {
	let to_eat: Value = null, i: Value = null, AM: Value = null, as_head: Value = null, as_mmi: Value = null, brain_holder: Value = null;
	sound ??= 1;
	if (rt.istype(AM0, T("/obj/item"))) {
		to_eat = AM0.GetAllContents();
	} else {
		to_eat = list(AM0);
	}
	let items_recycled: Value = 0;
	for (i of each(to_eat)) {
		AM = i;
		as_head = AM;
		as_mmi = AM;
		brain_holder = ((((rt.istype(AM, T("/obj/item/organ/brain")) ? 1 : 0) || ((rt.istype(as_head, T("/obj/item/bodypart/head")) ? 1 : 0) && as_head.brain)) || ((rt.istype(as_mmi, T("/obj/item/device/mmi")) ? 1 : 0) && as_mmi.brain)) || (rt.istype(AM, T("/mob/living/brain")) ? 1 : 0));
		if (rt.istype(AM, T("/mob/living")) || brain_holder) {
			if (this.emagged) {
				if (!brain_holder) {
					yield* this.crush_living(AM);
				}
			} else {
				yield* this.emergency_stop(AM);
			}
		} else if (rt.istype(AM, T("/obj/item"))) {
			yield* this.recycle_item(AM);
			items_recycled++;
		} else {
			playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0);
			AM.loc = this.loc;
		}
	}
	if (!(items_recycled && sound)) return f.dot;
	playsound(this.loc, this.item_recycle_sound, 50, 1);
	return f.dot;
}, true);

// recycler.dm:142
rt.def("/obj/machinery/recycler/proc/recycle_item", function* recycle_item(f: Frame, I: Value) {
	let material_amount: Value = null;
	I.loc = this.loc;
	if (!(material_amount = this.materials.get_item_material_amount(I))) {
		yield* qdel(I);
		return f.dot;
	}
	yield* this.materials.insert_item(I, { multiplier: this.amount_produced / 100 });
	yield* qdel(I);
	yield* this.materials.retrieve_all();
	return f.dot;
}, true);

// recycler.dm:154
rt.def("/obj/machinery/recycler/proc/emergency_stop", function* emergency_stop(f: Frame, L: Value) {
	playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0);
	this.safety_mode = 1;
	yield* this.update_icon();
	L.loc = this.loc;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/recycler/proc/reboot"))), 100);
	return f.dot;
}, true);

// recycler.dm:161
rt.def("/obj/machinery/recycler/proc/reboot", function reboot(f: Frame) {
	playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 50, 0);
	this.safety_mode = 0;
	this.update_icon();
	return f.dot;
});

// recycler.dm:167
rt.def("/obj/machinery/recycler/proc/crush_living", function* crush_living(f: Frame, L: Value) {
	let I: Value = null;
	L.loc = this.loc;
	if (rt.istype(L, T("/mob/living/silicon"))) {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 50, 1);
	} else {
		playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	}
	let gib: Value = 1;
	if (rt.istype(L, T("/mob/living/carbon"))) {
		gib = 0;
		if (L.stat == 0) {
			yield* L.say("ARRRRRRRRRRRGH!!!");
		}
		yield* this.add_mob_blood(L);
	}
	if (!this.blood && !rt.istype(L, T("/mob/living/silicon"))) {
		this.blood = 1;
		yield* this.update_icon();
	}
	if (this.eat_victim_items) {
		for (I of each(L.get_equipped_items(), T("/obj/item"))) {
			if (yield* L.dropItemToGround(I)) {
				yield* this.eat(I, { sound: 0 });
			}
		}
	}
	yield* L.Unconscious(100);
	if (gib || this.emagged == 2) {
		yield* L.gib();
	} else {
		if (this.emagged != 1) return f.dot;
		yield* L.adjustBruteLoss(this.crush_damage);
	}
	return f.dot;
}, true);
