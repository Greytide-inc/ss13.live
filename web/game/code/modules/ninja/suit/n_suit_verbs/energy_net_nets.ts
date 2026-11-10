// Based on /tg/station's code/modules/ninja/suit/n_suit_verbs/energy_net_nets.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(12967, "/obj/structure/energy_net", "/obj/structure", {
	affecting: null,
	master: null,
	anchored: 1,
	name: "energy net",
	desc: "It's a net made of green energy.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "energynet",
	density: 1,
	opacity: 0,
	mouse_opacity: 1,
	layer: 4.5,
	obj_integrity: 25,
	max_integrity: 25,
});

// energy_net_nets.dm:25
rt.def("/obj/structure/energy_net/proc/play_attack_sound", function play_attack_sound(f: Frame, damage: Value, damage_type: Value, damage_flag: Value) {
	damage_type ??= "brute";
	damage_flag ??= 0;
	if (damage_type === "brute") {
		playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 80, 1);
	} else if (damage_type === "fire") {
		playsound(this.loc, rt.rsc("sound/weapons/slash.ogg"), 80, 1);
	}
	return f.dot;
});

// energy_net_nets.dm:33
rt.def("/obj/structure/energy_net/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, O: Value = null;
	if (this.affecting) {
		(M = this.affecting).anchored = 0;
		for (O of each(viewers(this, 3), T("/mob"))) {
			O.show_message(`${M.name} was recovered from the energy net!`, 1, "<span class='italics'>You hear a grunt.</span>", 2);
		}
		if (this.master) {
			to_chat(this.master, "<span class='userdanger'>ERROR</span>: unable to initiate transport protocol. Procedure terminated.");
		}
	}
	return (yield* parent_proc());
}, true);

// energy_net_nets.dm:46
rt.def("/obj/structure/energy_net/proc/process", function* process(f: Frame, M: Value) {
	let W: Value = null, H: Value = null, spark_system: Value = null;
	let check: Value = 30;
	let mob_name: Value = this.affecting.name;
	M.notransform = 1;
	while (M !== null && this !== null && check > 0) {
		check--;
		yield* sleep(10);
	}
	if (M === null || M.loc != this.loc) {
		if (this.master !== null) {
			to_chat(this.master, fmt("<span class='userdanger'>ERROR</span>: unable to locate ％！. Procedure terminated.", [mob_name]));
		}
		yield* qdel(this);
		M.notransform = 0;
		return f.dot;
	}
	if (this !== null) {
		this.density = 0;
		this.invisibility = INVISIBILITY_ABSTRACT;
		(rt.modSrcVar(f, "resistance_flags", INDESTRUCTIBLE, rt.bitOr));
		for (W of each(M, T("/obj/item"))) {
			if (rt.istype(M, T("/mob/living/carbon/human"))) {
				H = M;
				if (W == H.w_uniform) {
					continue;
				}
				if (W == H.shoes) {
					continue;
				}
			}
			yield* M.dropItemToGround(W);
		}
		playsound(M.loc, rt.rsc("sound/effects/sparks4.ogg"), 50, 1);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja/phase/out"), rt.getStep(f, M, 0), M.dir);
		this.visible_message(`${M} suddenly vanishes!`);
		yield* M.forceMove(pick(GLOB.holdingfacility));
		to_chat(M, "<span class='danger'>You appear in a strange place!</span>");
		if (this.master !== null) {
			to_chat(this.master, fmt("<span class='notice'><b>SUCCESS</b>: transport procedure of ％！ complete.</span>", [this.affecting]));
		}
		M.notransform = 0;
		yield* (spark_system = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 0, M.loc);
		yield* spark_system.start();
		playsound(M.loc, rt.rsc("sound/effects/phasein.ogg"), 25, 1);
		playsound(M.loc, rt.rsc("sound/effects/sparks2.ogg"), 50, 1);
		yield* new_(T("/obj/effect/temp_visual/dir_setting/ninja/phase"), rt.getStep(f, M, 0), M.dir);
		yield* qdel(this);
	} else {
		to_chat(M, "<span class='notice'>You are free of the net!</span>");
		M.notransform = 0;
	}
	return f.dot;
}, true, { waitfor: false });

// energy_net_nets.dm:100
rt.def("/obj/structure/energy_net/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand());
}, true);
