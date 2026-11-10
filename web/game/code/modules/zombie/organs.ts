// Based on /tg/station's code/modules/zombie/organs.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9536, "/obj/item/organ/zombie_infection", "/obj/item/organ", {
	old_species: rt.typePath("/datum/species/human"),
	living_transformation_time: 30,
	converts_living: 0,
	revive_time_min: 450,
	revive_time_max: 700,
	timer_id: null,
	zone: "head",
	slot: "zombie_infection",
	name: "festering ooze",
	desc: "A black web of pus and vicera.",
	icon_state: "blacktumor",
	origin_tech: "biotech=5",
});

// organs.dm:17
rt.def("/obj/item/organ/zombie_infection/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (rt.istype(this.loc, T("/mob/living/carbon"))) {
		yield* this.Insert(this.loc);
	}
	GLOB.zombie_infection_list += this;
	return f.dot;
}, true);

// organs.dm:23
rt.def("/obj/item/organ/zombie_infection/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.zombie_infection_list -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// organs.dm:27
rt.def("/obj/item/organ/zombie_infection/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:31
rt.def("/obj/item/organ/zombie_infection/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	f.dot = (yield* parent_proc());
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (is_species(f.args[0], T("/datum/species/zombie")) && this.old_species) {
		yield* f.args[0].set_species(this.old_species);
	}
	if (!this.timer_id) return f.dot;
	yield* deltimer(this.timer_id);
	return f.dot;
}, true, { args: ["M", "special"] });

// organs.dm:39
rt.def("/obj/item/organ/zombie_infection/proc/on_find", function on_find(f: Frame, finder: Value) {
	to_chat(finder, "<span class='warning'>Inside the head is a disgusting black web of pus and vicera, bound tightly around the brain like some biological harness.</span>");
	return f.dot;
});

// organs.dm:44
rt.def("/obj/item/organ/zombie_infection/proc/process", function* process(f: Frame) {
	if (!this.owner) {
		return f.dot;
	}
	if (!rt.isIn(f, this, this.owner.internal_organs)) {
		yield* this.Remove(this.owner);
	}
	if (this.timer_id) {
		return f.dot;
	}
	if (this.owner.stat != 2 && !this.converts_living) {
		return f.dot;
	}
	if (!is_species(this.owner, T("/datum/species/zombie"))) {
		to_chat(this.owner, "<span class='cultlarge'>You can feel your heart stopping, but something isn't right... life has not abandoned your broken form. You can only feel a deep and immutable hunger that not even death can stop, you will rise again!</span>");
	}
	let revive_time: Value = rand(this.revive_time_min, this.revive_time_max);
	let flags: Value = 8;
	this.timer_id = (yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/item/organ/zombie_infection/proc/zombify"))), revive_time, flags));
	return f.dot;
}, true, { waitfor: false });

// organs.dm:64
rt.def("/obj/item/organ/zombie_infection/proc/zombify", function* zombify(f: Frame) {
	let $3: any;
	this.timer_id = null;
	if (!is_species(this.owner, T("/datum/species/zombie"))) {
		this.old_species = this.owner.dna.species.type;
		yield* this.owner.set_species(T("/datum/species/zombie/infectious"));
	}
	if (!this.converts_living && this.owner.stat != 2) {
		return f.dot;
	}
	let stand_up: Value = ((this.owner.stat == 2 ? 1 : 0) || (this.owner.stat == 1 ? 1 : 0));
	if (!(yield* this.owner.revive({ full_heal: 1 }))) {
		return f.dot;
	}
	yield* this.owner.grab_ghost();
	let $0: any = this.owner;
	let $1: any = this.owner;
	let $2: any = this.owner.p_they();
	if (stand_up) {
		$3 = ` stagger to ${this.owner.p_their()} feet and`;
	} else {
		$3 = "";
	}
	$0.visible_message(`<span class='danger'>${$1} suddenly convulses, as ${$2}${$3} gain a ravenous hunger in ${this.owner.p_their()} eyes!</span>`, "<span class='alien'>You HUNGER!</span>");
	playsound(this.owner.loc, rt.rsc("sound/hallucinations/far_noise.ogg"), 50, 1);
	this.owner.do_jitter_animation(this.living_transformation_time);
	yield* this.owner.Stun(this.living_transformation_time);
	to_chat(this.owner, "<span class='alertalien'>You are now a zombie!</span>");
	return f.dot;
}, true);
