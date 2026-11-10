// Based on /tg/station's code/modules/mob/living/brain/brain.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(5093, "/mob/living/brain", "/mob/living", {
	container: null,
	timeofhostdeath: 0,
	emp_damage: 0,
	stored_dna: null,
	stat: 2,
	see_invisible: 25,
});

// brain.dm:10
rt.def("/mob/living/brain/proc/Initialize", function* Initialize(f: Frame) {
	let OB: Value = null;
	yield* parent_proc();
	yield* this.create_dna(this);
	yield* this.stored_dna.initialize_dna(random_blood_type());
	if (!isturf(this.loc)) return f.dot;
	this.loc = (OB = (yield* new_(T("/obj/item/organ/brain"), this.loc)));
	OB.brainmob = this;
	return f.dot;
}, true);

// brain.dm:20
rt.def("/mob/living/brain/proc/create_dna", function* create_dna(f: Frame) {
	this.stored_dna = (yield* new_(T("/datum/dna/stored"), this));
	if (this.stored_dna.species) return f.dot;
	let rando_race: Value = pick(GLOB.config.roundstart_races);
	this.stored_dna.species = (yield* new_(rando_race));
	return f.dot;
}, true);

// brain.dm:27
rt.def("/mob/living/brain/proc/Destroy", function* Destroy(f: Frame) {
	if (this.key) {
		if (this.stat != 2) {
			yield* this.death(1);
		}
		if (this.mind) {
			this.mind.current = null;
		}
		yield* this.ghostize();
	}
	this.container = null;
	return (yield* parent_proc());
}, true);

// brain.dm:36
rt.def("/mob/living/brain/proc/update_canmove", function update_canmove(f: Frame) {
	if (this.in_contents_of(T("/obj/mecha"))) {
		this.canmove = 1;
	} else {
		this.canmove = 0;
	}
	return this.canmove;
});

// brain.dm:59
rt.def("/mob/living/brain/proc/can_be_revived", function can_be_revived(f: Frame) {
	f.dot = 1;
	if (!(!this.container || this.health <= -100)) return f.dot;
	return 0;
});

// brain.dm:63
rt.def("/mob/living/brain/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	parent_proc();
	if (!this.stored_dna) return f.dot;
	this.stored_dna.real_name = this.real_name;
	return f.dot;
}, false);

// brain.dm:68
rt.def("/mob/living/brain/proc/ClickOn", function* ClickOn(f: Frame, A: Value, params: Value) {
	yield* parent_proc();
	if (!rt.istype(this.loc, T("/obj/item/device/mmi"))) return f.dot;
	let MMI: Value = this.loc;
	let M: Value = MMI.mecha;
	if (!(this == MMI.brainmob && rt.istype(M, T("/obj/mecha")))) return f.dot;
	return (yield* M.click_action(A, this, params));
}, true);
