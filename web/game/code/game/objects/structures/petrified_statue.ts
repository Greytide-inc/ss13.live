// Based on /tg/station's code/game/objects/structures/petrified_statue.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(12830, "/obj/structure/statue/petrified", "/obj/structure/statue", {
	timer: 240,
	petrified_mob: null,
	anchored: 1,
	name: "statue",
	desc: "An incredibly lifelike marble carving.",
	icon_state: "human_male",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// petrified_statue.dm:14
rt.def("/obj/structure/statue/petrified/proc/New", function* New(f: Frame, loc: Value, L: Value, statue_timer: Value) {
	if (statue_timer) {
		this.timer = statue_timer;
	}
	if (L) {
		this.petrified_mob = L;
		if (L.buckled) {
			yield* L.buckled.unbuckle_mob(L, { force: 1 });
		}
		L.visible_message(`<span class='warning'>${L}'s skin rapidly turns to marble!</span>`, "<span class='userdanger'>Your body freezes up! Can't... move... can't...  think...</span>");
		yield* L.forceMove(this);
		(rt.modField(f, L, "disabilities", 2, rt.bitOr));
		L.faction += "mimic";
		(rt.modField(f, L, "status_flags", 4096, rt.bitOr));
		this.obj_integrity = L.health + 100;
		this.max_integrity = this.obj_integrity;
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSobj.processing += this;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// petrified_statue.dm:30
rt.def("/obj/structure/statue/petrified/proc/process", function* process(f: Frame) {
	if (!this.petrified_mob) {
		this.isprocessing = 0;
		GLOB.SSobj.processing -= this;
	}
	this.timer--;
	yield* this.petrified_mob.Stun(40);
	if (!(this.timer <= 0)) return f.dot;
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* qdel(this);
	return f.dot;
}, true, { waitfor: false });

// petrified_statue.dm:42
rt.def("/obj/structure/statue/petrified/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.petrified_mob) return f.dot;
	this.petrified_mob = null;
	return f.dot;
});

// petrified_statue.dm:47
rt.def("/obj/structure/statue/petrified/proc/Destroy", function* Destroy(f: Frame) {
	let S: Value = null, O: Value = null;
	if (rt.istype(this.loc, T("/mob/living/simple_animal/hostile/statue"))) {
		yield* this.forceMove((S = this.loc).loc);
		if (S.mind) {
			if (this.petrified_mob) {
				yield* S.mind.transfer_to(this.petrified_mob);
				yield* this.petrified_mob.Knockdown(100);
				to_chat(this.petrified_mob, "<span class='notice'>You slowly come back to your senses. You are in control of yourself again!</span>");
			}
		}
		yield* qdel(S);
	}
	for (O of each(this, T("/obj"))) {
		yield* O.forceMove(this.loc);
	}
	if (this.petrified_mob) {
		(rt.modField(f, this.petrified_mob, "status_flags", 16773119, rt.bitAnd));
		yield* this.petrified_mob.forceMove(this.loc);
		(rt.modField(f, this.petrified_mob, "disabilities", 16777213, rt.bitAnd));
		yield* this.petrified_mob.take_overall_damage(this.petrified_mob.health - this.obj_integrity + 100);
		this.petrified_mob.faction -= "mimic";
		this.petrified_mob = null;
	}
	return (yield* parent_proc());
}, true);

// petrified_statue.dm:70
rt.def("/obj/structure/statue/petrified/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!disassembled) {
		if (this.petrified_mob) {
			yield* this.petrified_mob.dust();
		}
	}
	this.visible_message(`<span class='danger'>${this} shatters!.</span>`);
	yield* qdel(this);
	return f.dot;
}, true);

// petrified_statue.dm:80
rt.def("/mob/living/carbon/human/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null;
	if (!isturf(this.loc)) {
		return 0;
	}
	(S = (yield* new_(T("/obj/structure/statue/petrified"), this.loc, this, statue_timer))).name = `statue of ${this.name}`;
	this.bleedsuppress = 1;
	S.copy_overlays(this);
	let newcolor: Value = list("#4d4d4d", "#969696", "#1c1c1c", "#000000");
	S.add_atom_colour(newcolor, FIXED_COLOUR_PRIORITY);
	return 1;
}, true);

// petrified_statue.dm:91
rt.def("/mob/living/carbon/monkey/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null;
	if (!isturf(this.loc)) {
		return 0;
	}
	(S = (yield* new_(T("/obj/structure/statue/petrified"), this.loc, this, statue_timer))).name = "statue of a monkey";
	S.icon_state = "monkey";
	return 1;
}, true);

// petrified_statue.dm:99
rt.def("/mob/living/simple_animal/pet/dog/corgi/proc/petrify", function* petrify(f: Frame, statue_timer: Value) {
	let S: Value = null;
	if (!isturf(this.loc)) {
		return 0;
	}
	(S = (yield* new_(T("/obj/structure/statue/petrified"), this.loc, this, statue_timer))).name = "statue of a corgi";
	S.icon_state = "corgi";
	S.desc = "If it takes forever, I will wait for you...";
	return 1;
}, true);
