// Based on /tg/station's code/game/objects/items/body_egg.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(9457, "/obj/item/organ/body_egg", "/obj/item/organ", {
	name: "body egg",
	desc: "All slimy and yuck.",
	icon_state: "innards",
	origin_tech: "biotech=5",
	zone: "chest",
	slot: "parasite_egg",
});

// body_egg.dm:10
rt.def("/obj/item/organ/body_egg/proc/on_find", function on_find(f: Frame, finder: Value) {
	parent_proc();
	to_chat(finder, `<span class='warning'>You found an unknown alien organism in ${this.owner}'s ${this.zone}!</span>`);
	return f.dot;
}, false);

// body_egg.dm:14
rt.def("/obj/item/organ/body_egg/proc/New", function* New(f: Frame, loc: Value) {
	if (rt.istype(loc, T("/mob/living/carbon"))) {
		yield* this.Insert(loc);
	}
	return (yield* parent_proc());
}, true);

// body_egg.dm:19
rt.def("/obj/item/organ/body_egg/proc/Insert", function* Insert(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	(rt.modField(f, this.owner, "status_flags", XENO_HOST, rt.bitOr));
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSobj.processing += this;
	}
	this.owner.med_hud_set_status();
	yield* ImmediateInvokeAsync(this, P("/obj/item/organ/body_egg/proc/AddInfectionImages"), this.owner);
	return f.dot;
}, true, { args: ["M", "special"] });

// body_egg.dm:26
rt.def("/obj/item/organ/body_egg/proc/Remove", function* Remove(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	if (this.owner) {
		(rt.modField(f, this.owner, "status_flags", 16744447, rt.bitAnd));
		this.owner.med_hud_set_status();
		yield* ImmediateInvokeAsync(this, P("/obj/item/organ/body_egg/proc/RemoveInfectionImages"), this.owner);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["M", "special"] });

// body_egg.dm:34
rt.def("/obj/item/organ/body_egg/proc/process", function* process(f: Frame) {
	if (!this.owner) {
		return f.dot;
	}
	if (!rt.isIn(f, this, this.owner.internal_organs)) {
		yield* this.Remove(this.owner);
		return f.dot;
	}
	yield* this.egg_process();
	return f.dot;
}, true, { waitfor: false });

// body_egg.dm:45
rt.def("/obj/item/organ/body_egg/proc/RefreshInfectionImage", function* RefreshInfectionImage(f: Frame) {
	yield* this.RemoveInfectionImages();
	this.AddInfectionImages();
	return f.dot;
}, true);
