// Based on /tg/station's code/modules/ninja/energy_katana.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(7604, "/obj/item/weapon/dash", "/obj/item/weapon", {
	max_charges: 3,
	current_charges: 3,
	charge_rate: 30,
	dash_toggled: 1,
	bypass_density: 0,
	beam_icon_state: "blur",
	start_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/ninja/phase/out"),
	end_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/ninja/phase"),
	dash_beam_type: rt.typePath("/obj/effect/ebeam"),
	name: "abstract dash weapon",
});

// energy_katana.dm:16
rt.def("/obj/item/weapon/dash/proc/charge", function charge(f: Frame) {
	this.current_charges = max(0, min(this.current_charges + 1, this.max_charges));
	if (!rt.istype(this.loc, T("/mob/living"))) return f.dot;
	to_chat(this.loc, `<span class='notice'>${this} now has ${this.current_charges}/${this.max_charges} charges.</span>`);
	return f.dot;
});

// energy_katana.dm:21
rt.def("/obj/item/weapon/dash/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $1: any;
	this.dash_toggled = (!this.dash_toggled ? 1 : 0);
	let $0: any = user;
	if (this.dash_toggled) {
		$1 = "enable";
	} else {
		$1 = "disable";
	}
	to_chat($0, `<span class='notice'>You ${$1} the dash function on ${this}.</span>`);
	return f.dot;
});

// energy_katana.dm:26
rt.def("/obj/item/weapon/dash/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	if (!this.dash_toggled) return f.dot;
	yield* this.dash(user, target);
	return f.dot;
}, true);

// energy_katana.dm:30
rt.def("/obj/item/weapon/dash/proc/dash", function* dash(f: Frame, user: Value, target: Value) {
	let turf: Value = null, A: Value = null;
	if (!this.current_charges) {
		return f.dot;
	}
	if (this.Adjacent(target)) {
		return f.dot;
	}
	if (target.density) {
		return f.dot;
	}
	let _T: Value = rt.getStep(f, target, 0);
	if (!this.bypass_density) {
		for (turf of each(getline(rt.getStep(f, user, 0), _T), T("/turf"))) {
			A = null;
			for (A of each(turf, T("/atom"))) {
				if (A.density) {
					return f.dot;
				}
			}
		}
	}
	if (!rt.isIn(f, target, view(user.client.view, rt.getStep(f, user, 0)))) return f.dot;
	let spot1: Value = (yield* new_(this.start_effect_type, _T, user.dir));
	yield* user.forceMove(_T);
	playsound(_T, rt.rsc("sound/magic/blink.ogg"), 25, 1);
	playsound(_T, "sparks", 50, 1);
	let spot2: Value = (yield* new_(this.end_effect_type, rt.getStep(f, user, 0), user.dir));
	yield* spot1.Beam(spot2, this.beam_icon_state, { time: 2, maxdistance: 20, beam_type: this.dash_beam_type });
	this.current_charges--;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/weapon/dash/proc/charge"))), this.charge_rate);
	return f.dot;
}, true);

rt.type(7605, "/obj/item/weapon/dash/energy_katana", "/obj/item/weapon/dash", {
	spark_system: null,
	bypass_density: 1,
	name: "energy katana",
	desc: "A katana infused with strong energy.",
	icon_state: "energy_katana",
	item_state: "energy_katana",
	force: 40,
	throwforce: 20,
	block_chance: 50,
	armour_penetration: 50,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	slot_flags: 512,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	resistance_flags: 35,
});

// energy_katana.dm:80
rt.def("/obj/item/weapon/dash/energy_katana/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	if (this.dash_toggled) {
		return (yield* parent_proc());
	}
	if (!(proximity_flag && (rt.istype(target, T("/obj")) || rt.istype(target, T("/mob/living/silicon"))))) return f.dot;
	yield* this.spark_system.start();
	playsound(user, "sparks", 50, 1);
	playsound(user, rt.rsc("sound/weapons/blade1.ogg"), 50, 1);
	yield* target.emag_act(user);
	return f.dot;
}, true);

// energy_katana.dm:92
rt.def("/obj/item/weapon/dash/energy_katana/proc/throw_impact", function* throw_impact(f: Frame, hit_atom: Value) {
	let H: Value = null, SN: Value = null;
	if (rt.istype(hit_atom, T("/mob/living/carbon/human"))) {
		if (rt.istype((H = hit_atom).wear_suit, T("/obj/item/clothing/suit/space/space_ninja"))) {
			if ((SN = H.wear_suit).energyKatana == this) {
				yield* this.returnToOwner(H, 0, 1);
				return f.dot;
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true, { waitfor: false });

// energy_katana.dm:103
rt.def("/obj/item/weapon/dash/energy_katana/proc/returnToOwner", function* returnToOwner(f: Frame, user: Value, doSpark: Value, caught: Value) {
	doSpark ??= 1;
	caught ??= 0;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	yield* this.forceMove(rt.getStep(f, user, 0));
	if (doSpark) {
		yield* this.spark_system.start();
		playsound(rt.getStep(f, this, 0), "sparks", 50, 1);
	}
	let msg: Value = "";
	if (yield* user.put_in_hands(this)) {
		msg = "Your Energy Katana teleports into your hand!";
	} else if (yield* user.equip_to_slot_if_possible(this, slot_belt, 0, 1, 1)) {
		msg = "Your Energy Katana teleports back to you, sheathing itself as it does so!</span>";
	} else {
		msg = "Your Energy Katana teleports to your location!";
	}
	if (caught) {
		if (this.loc == user) {
			msg = "You catch your Energy Katana!";
		} else {
			msg = "Your Energy Katana lands at your feet!";
		}
	}
	if (!msg) return f.dot;
	to_chat(user, `<span class='notice'>${msg}</span>`);
	return f.dot;
}, true);

// energy_katana.dm:130
rt.def("/obj/item/weapon/dash/energy_katana/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.spark_system = (yield* new_(T("/datum/effect_system/spark_spread")));
	yield* this.spark_system.set_up(5, 0, this);
	yield* this.spark_system.attach(this);
	return f.dot;
}, true);

// energy_katana.dm:136
rt.def("/obj/item/weapon/dash/energy_katana/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.spark_system);
	this.spark_system = null;
	return (yield* parent_proc());
}, true);
