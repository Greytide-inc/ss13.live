// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/pet.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5049, "/mob/living/simple_animal/pet", "/mob/living/simple_animal", {
	pcollar: null,
	collar: "",
	pettag: "",
	icon: rt.rsc("icons/mob/pets.dmi"),
	mob_size: 1,
	blood_volume: 560,
});

// pet.dm:10
rt.def("/mob/living/simple_animal/pet/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let _P: Value = null, i: Value = null;
	if (rt.istype(O, T("/obj/item/clothing/neck/petcollar")) && !this.pcollar) {
		this.pcollar = (_P = O);
		this.collar = `${this.icon_state}collar`;
		this.pettag = `${this.icon_state}tag`;
		yield* this.regenerate_icons();
		to_chat(user, `<span class='notice'>You put the ${_P} around ${this}'s neck.</span>`);
		if (_P.tagname) {
			this.real_name = `ÿ\u0015${_P.tagname}`;
			this.name = this.real_name;
		}
		yield* qdel(_P);
		return f.dot;
	}
	if (rt.istype(O, T("/obj/item/weapon/newspaper"))) {
		if (!this.stat) {
			user.visible_message(`${user} baps ${this.name} on the nose with the rolled up ${O}.`);
			rt.spawnTail(f, 0, "/mob/living/simple_animal/pet/proc/attackby: spawn at modules/mob/living/simple_animal/friendly/pet.dm:25", _P, i);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/pet/proc/attackby, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/pet/proc/attackby: spawn at modules/mob/living/simple_animal/friendly/pet.dm:25", function* (f: Frame, _P: Value, i: Value) {
	i = null;
	for (i of each(list(1, 2, 4, 8, 4, 2, 1, 2))) {
		yield* this.setDir(i);
		yield* sleep(1);
	}
	return null;
});

// pet.dm:33
rt.def("/mob/living/simple_animal/pet/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	if (!this.pcollar) return f.dot;
	this.pcollar = (yield* new_(T("/obj/item/clothing/neck/petcollar"), this));
	yield* this.regenerate_icons();
	return f.dot;
}, true);

// pet.dm:39
rt.def("/mob/living/simple_animal/pet/proc/revive", function* revive(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (!(yield* parent_proc())) return f.dot;
	yield* this.regenerate_icons();
	f.dot = 1;
	return f.dot;
}, true, { args: ["full_heal", "admin_revive"] });

// pet.dm:44
rt.def("/mob/living/simple_animal/pet/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc(gibbed);
	yield* this.regenerate_icons();
	return f.dot;
}, true);

// pet.dm:48
rt.def("/mob/living/simple_animal/pet/proc/regenerate_icons", function regenerate_icons(f: Frame) {
	this.cut_overlays();
	if (this.collar) {
		this.add_overlay(this.collar);
	}
	if (!this.pettag) return f.dot;
	this.add_overlay(this.pettag);
	return f.dot;
});
