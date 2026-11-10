// Based on /tg/station's code/game/machinery/doppler_array.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// doppler_array.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobaldoppler_arrays", function InitGlobaldoppler_arrays(f: Frame) {
	GLOB.doppler_arrays = list();
	this.gvars_datum_init_order += "doppler_arrays";
	return f.dot;
});

rt.type(10788, "/obj/machinery/doppler_array", "/obj/machinery", {
	integrated: 0,
	max_dist: 100,
	anchored: 1,
	verb_say: "states coldly",
	name: "tachyon-doppler array",
	desc: "A highly precise directional sensor array which measures the release of quants from decaying tachyons. The doppler shifting of the mirror-image formed by these quants can reveal the size, location and temporal affects of energetic disturbances within a large radius ahead of the array.\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon: rt.rsc("icons/obj/machines/research.dmi"),
	icon_state: "tdoppler",
	density: 1,
});

// doppler_array.dm:15
rt.def("/obj/machinery/doppler_array/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	GLOB.doppler_arrays += this;
	return f.dot;
}, true);

// doppler_array.dm:19
rt.def("/obj/machinery/doppler_array/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.doppler_arrays -= this;
	return (yield* parent_proc());
}, true);

// doppler_array.dm:26
rt.def("/obj/machinery/doppler_array/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/wrench"))) {
		if (!this.anchored && !this.isinspace()) {
			this.anchored = 1;
			yield* this.power_change();
			to_chat(user, `<span class='notice'>You fasten ${this}.</span>`);
		} else if (this.anchored) {
			this.anchored = 0;
			yield* this.power_change();
			to_chat(user, `<span class='notice'>You unfasten ${this}.</span>`);
		}
		playsound(this.loc, O.usesound, 50, 1);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// doppler_array.dm:44
rt.def("/obj/machinery/doppler_array/verb/rotate", function rotate(f: Frame) {
	if (!f.usr || !isturf(f.usr.loc)) {
		return f.dot;
	}
	if (f.usr.stat || f.usr.restrained() || !f.usr.canmove) {
		return f.dot;
	}
	this.setDir(turn(this.dir, 90));
	return f.dot;
}, false, { verb: { name: "Rotate Tachyon-doppler Dish", category: "Object", src: 3, range: 1 } });

// doppler_array.dm:52
rt.def("/obj/machinery/doppler_array/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living")) || user.incapacitated()) {
		to_chat(user, "<span class='warning'>You can't do that right now!</span>");
		return f.dot;
	}
	if (!(get_dist(this, user) <= 1)) {
		return f.dot;
	} else {
		this.rotate();
	}
	return f.dot;
});

// doppler_array.dm:62
rt.def("/obj/machinery/doppler_array/proc/sense_explosion", function* sense_explosion(f: Frame, epicenter: Value, devastation_range: Value, heavy_impact_range: Value, light_impact_range: Value, took: Value, orig_dev_range: Value, orig_heavy_range: Value, orig_light_range: Value) {
	let zone: Value = null, helm: Value = null, message: Value = null;
	if (rt.bitAnd(this.stat, 2)) {
		return f.dot;
	}
	if ((zone = rt.getStep(f, this, 0)).z != epicenter.z) {
		return f.dot;
	}
	let distance: Value = get_dist(epicenter, zone);
	let direct: Value = rt.getDir(f, zone, epicenter);
	if (distance > this.max_dist) {
		return f.dot;
	}
	if (!rt.bitAnd(direct, this.dir) && !this.integrated) {
		return f.dot;
	}
	let messages: Value = list("Explosive disturbance detected.", `Epicenter at: grid (${epicenter.x},${epicenter.y}). Temporal displacement of tachyons: ${took} seconds.`, `Factual: Epicenter radius: ${devastation_range}. Outer radius: ${heavy_impact_range}. Shockwave radius: ${light_impact_range}.`);
	if (devastation_range < orig_dev_range || heavy_impact_range < orig_heavy_range || light_impact_range < orig_light_range) {
		messages += `Theoretical: Epicenter radius: ${orig_dev_range}. Outer radius: ${orig_heavy_range}. Shockwave radius: ${orig_light_range}.`;
	}
	if (this.integrated) {
		if (!(helm = this.loc) || !rt.istype(helm, T("/obj/item/clothing/head/helmet/space/hardsuit"))) {
			return f.dot;
		}
		helm.display_visor_message(`Explosion detected! Epicenter: ${devastation_range}, Outer: ${heavy_impact_range}, Shock: ${light_impact_range}`);
	} else {
		for (message of each(messages)) {
			yield* this.say(message);
		}
	}
	return f.dot;
}, true);

// doppler_array.dm:96
rt.def("/obj/machinery/doppler_array/proc/power_change", function power_change(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-broken`;
	} else if (this.powered() && this.anchored) {
		this.icon_state = rt.initial(f, this, "icon_state");
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}-off`;
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	}
	return f.dot;
});
