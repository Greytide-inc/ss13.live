// Based on /tg/station's code/game/gamemodes/blob/blobs/factory.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12142, "/obj/structure/blob/factory", "/obj/structure/blob", {
	spores: null,
	naut: null,
	max_spores: 3,
	spore_delay: 0,
	spore_cooldown: 80,
	health_regen: 1,
	point_return: 25,
	name: "factory blob",
	icon: rt.rsc("icons/mob/blob.dmi"),
	icon_state: "blob_factory",
	desc: "A thick spire of tendrils.",
	obj_integrity: 200,
	max_integrity: 200,
});

// factory.dm:10
rt.def("/obj/structure/blob/factory/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.spores = list();
	return f.dot;
});

// factory.dm:19
rt.def("/obj/structure/blob/factory/proc/scannerreport", function scannerreport(f: Frame) {
	if (this.naut) {
		return "It is currently sustaining a blobbernaut, making it fragile and unable to produce blob spores.";
	}
	return "Will produce a blob spore every few seconds.";
});

// factory.dm:23
rt.def("/obj/structure/blob/factory/proc/Destroy", function* Destroy(f: Frame) {
	let spore: Value = null;
	for (spore of each(this.spores, T("/mob/living/simple_animal/hostile/blob/blobspore"))) {
		if (spore.factory == this) {
			spore.factory = null;
		}
	}
	if (this.naut) {
		this.naut.factory = null;
		to_chat(this.naut, "<span class='userdanger'>Your factory was destroyed! You feel yourself dying!</span>");
		yield* this.naut.throw_alert("nofactory", T("/obj/screen/alert/nofactory"));
	}
	this.spores = null;
	return (yield* parent_proc());
}, true);

// factory.dm:34
rt.def("/obj/structure/blob/factory/proc/Be_Pulsed", function* Be_Pulsed(f: Frame) {
	f.dot = (yield* parent_proc());
	if (this.naut) {
		return f.dot;
	}
	if (rt.len(f, this.spores) >= this.max_spores) {
		return f.dot;
	}
	if (this.spore_delay > rt.worldTime(f)) {
		return f.dot;
	}
	flick("blob_factory_glow", this);
	this.spore_delay = rt.worldTime(f) + this.spore_cooldown;
	let BS: Value = (yield* new_(T("/mob/living/simple_animal/hostile/blob/blobspore"), this.loc, this));
	if (!this.overmind) return f.dot;
	BS.overmind = this.overmind;
	yield* BS.update_icons();
	this.overmind.blob_mobs.Add(BS);
	return f.dot;
}, true);
