// Based on /tg/station's code/game/machinery/porta_turret/portable_turret_construct.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10870, "/obj/machinery/porta_turret_construct", "/obj/machinery", {
	build_step: 0,
	finish_name: "turret",
	installed_gun: null,
	name: "turret frame",
	icon: rt.rsc("icons/obj/turrets.dmi"),
	icon_state: "turret_frame",
	density: 1,
});

// portable_turret_construct.dm:22
rt.def("/obj/machinery/porta_turret_construct/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let M: Value = null, WT: Value = null, E: Value = null, turret: Value = null, t: Value = null;
	if (this.build_step === PTURRET_UNSECURED) {
		if (rt.istype(I, T("/obj/item/weapon/wrench")) && !this.anchored) {
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You secure the external bolts.</span>");
			this.anchored = 1;
			this.build_step = PTURRET_BOLTED;
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/crowbar")) && !this.anchored) {
			playsound(this.loc, I.usesound, 75, 1);
			to_chat(user, "<span class='notice'>You dismantle the turret construction.</span>");
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 5);
			yield* qdel(this);
			return f.dot;
		}
	} else if (this.build_step === PTURRET_BOLTED) {
		if (rt.istype(I, T("/obj/item/stack/sheet/metal"))) {
			if (yield* (M = I).use(2)) {
				to_chat(user, "<span class='notice'>You add some metal armor to the interior frame.</span>");
				this.build_step = PTURRET_START_INTERNAL_ARMOUR;
				this.icon_state = "turret_frame2";
			} else {
				to_chat(user, "<span class='warning'>You need two sheets of metal to continue construction!</span>");
			}
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, I.usesound, 75, 1);
			to_chat(user, "<span class='notice'>You unfasten the external bolts.</span>");
			this.anchored = 0;
			this.build_step = PTURRET_UNSECURED;
			return f.dot;
		}
	} else if (this.build_step === PTURRET_START_INTERNAL_ARMOUR) {
		if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You bolt the metal armor into place.</span>");
			this.build_step = PTURRET_INTERNAL_ARMOUR_ON;
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
			if (!(WT = I).isOn()) {
				return f.dot;
			}
			if (WT.get_fuel() < 5) {
				to_chat(user, "<span class='warning'>You need more fuel to complete this task!</span>");
				return f.dot;
			}
			playsound(this.loc, WT.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You start to remove the turret's interior metal armor...</span>");
			if (yield* do_after(user, 20 * I.toolspeed, { target: this })) {
				if (!WT.isOn() || !(yield* WT.remove_fuel(5, user))) {
					return f.dot;
				}
				this.build_step = PTURRET_BOLTED;
				to_chat(user, "<span class='notice'>You remove the turret's interior metal armor.</span>");
				yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
				return f.dot;
			}
		}
	} else if (this.build_step === PTURRET_INTERNAL_ARMOUR_ON) {
		if (rt.istype(I, T("/obj/item/weapon/gun/energy"))) {
			E = I;
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* E.forceMove(this);
			this.installed_gun = E;
			to_chat(user, `<span class='notice'>You add ${I} to the turret.</span>`);
			this.build_step = PTURRET_GUN_EQUIPPED;
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
			playsound(this.loc, I.usesound, 100, 1);
			to_chat(user, "<span class='notice'>You remove the turret's metal armor bolts.</span>");
			this.build_step = PTURRET_START_INTERNAL_ARMOUR;
			return f.dot;
		}
	} else if (this.build_step === PTURRET_GUN_EQUIPPED) {
		if (rt.istype(I, T("/obj/item/device/assembly/prox_sensor"))) {
			this.build_step = PTURRET_SENSORS_ON;
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			to_chat(user, "<span class='notice'>You add the proximity sensor to the turret.</span>");
			yield* qdel(I);
			return f.dot;
		}
	} else if (this.build_step === PTURRET_SENSORS_ON) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, I.usesound, 100, 1);
			this.build_step = PTURRET_CLOSED;
			to_chat(user, "<span class='notice'>You close the internal access hatch.</span>");
			return f.dot;
		}
	} else if (this.build_step === PTURRET_CLOSED) {
		if (rt.istype(I, T("/obj/item/stack/sheet/metal"))) {
			if (yield* (M = I).use(2)) {
				to_chat(user, "<span class='notice'>You add some metal armor to the exterior frame.</span>");
				this.build_step = PTURRET_START_EXTERNAL_ARMOUR;
			} else {
				to_chat(user, "<span class='warning'>You need two sheets of metal to continue construction!</span>");
			}
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			playsound(this.loc, I.usesound, 100, 1);
			this.build_step = PTURRET_SENSORS_ON;
			to_chat(user, "<span class='notice'>You open the internal access hatch.</span>");
			return f.dot;
		}
	} else if (this.build_step === PTURRET_START_EXTERNAL_ARMOUR) {
		if (rt.istype(I, T("/obj/item/weapon/weldingtool"))) {
			if (!(WT = I).isOn()) {
				return f.dot;
			}
			if (WT.get_fuel() < 5) {
				to_chat(user, "<span class='warning'>You need more fuel to complete this task!</span>");
			}
			playsound(this.loc, WT.usesound, 50, 1);
			to_chat(user, "<span class='notice'>You begin to weld the turret's armor down...</span>");
			if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
				if (!WT.isOn() || !(yield* WT.remove_fuel(5, user))) {
					return f.dot;
				}
				this.build_step = PTURRET_EXTERNAL_ARMOUR_ON;
				to_chat(user, "<span class='notice'>You weld the turret's armor down.</span>");
				if (rt.istype(this.installed_gun, T("/obj/item/weapon/gun/energy/laser/bluetag")) || rt.istype(this.installed_gun, T("/obj/item/weapon/gun/energy/laser/redtag"))) {
					turret = (yield* new_(T("/obj/machinery/porta_turret/lasertag"), this.loc));
				} else {
					turret = (yield* new_(T("/obj/machinery/porta_turret"), this.loc));
				}
				turret.name = this.finish_name;
				turret.installation = this.installed_gun.type;
				yield* turret.setup(this.installed_gun);
				yield* qdel(this);
			}
		} else if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
			playsound(this.loc, I.usesound, 75, 1);
			to_chat(user, "<span class='notice'>You pry off the turret's exterior armor.</span>");
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
			this.build_step = PTURRET_CLOSED;
			return f.dot;
		}
	}
	if (rt.istype(I, T("/obj/item/weapon/pen"))) {
		if (!(t = (yield* stripped_input(user, "Enter new turret name", this.name, this.finish_name)))) {
			return f.dot;
		}
		if (!this.Adjacent(user)) {
			return f.dot;
		}
		this.finish_name = t;
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// portable_turret_construct.dm:183
rt.def("/obj/machinery/porta_turret_construct/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (this.build_step === PTURRET_GUN_EQUIPPED) {
		this.build_step = PTURRET_INTERNAL_ARMOUR_ON;
		yield* this.installed_gun.forceMove(this.loc);
		to_chat(user, `<span class='notice'>You remove ${this.installed_gun} from the turret frame.</span>`);
		this.installed_gun = null;
	} else if (this.build_step === PTURRET_SENSORS_ON) {
		to_chat(user, "<span class='notice'>You remove the prox sensor from the turret frame.</span>");
		yield* new_(T("/obj/item/device/assembly/prox_sensor"), this.loc);
		this.build_step = PTURRET_GUN_EQUIPPED;
	}
	return f.dot;
}, true);

// portable_turret_construct.dm:201
rt.def("/obj/machinery/porta_turret_construct/proc/Destroy", function* Destroy(f: Frame) {
	if (this.installed_gun) {
		yield* qdel(this.installed_gun);
		this.installed_gun = null;
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);
