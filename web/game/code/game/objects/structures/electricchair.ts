// Based on /tg/station's code/game/objects/structures/electricchair.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12732, "/obj/structure/chair/e_chair", "/obj/structure/chair", {
	part: null,
	last_time: 1,
	name: "electric chair",
	desc: "Looks absolutely SHOCKING!\n<span class='notice'>Alt-click to rotate it clockwise.</span>",
	icon_state: "echair0",
	item_chair: null,
});

// electricchair.dm:10
rt.def("/obj/structure/chair/e_chair/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.add_overlay(mutable_appearance(rt.rsc("icons/obj/chairs.dmi"), "echair_over", 5));
	return f.dot;
}, true);

// electricchair.dm:14
rt.def("/obj/structure/chair/e_chair/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!rt.istype(W, T("/obj/item/weapon/wrench"))) return f.dot;
	let C: Value = (yield* new_(T("/obj/structure/chair"), this.loc));
	playsound(this.loc, W.usesound, 50, 1);
	yield* C.setDir(this.dir);
	this.part.loc = this.loc;
	this.part.master = null;
	this.part = null;
	yield* qdel(this);
	return f.dot;
}, true);

// electricchair.dm:24
rt.def("/obj/structure/chair/e_chair/proc/shock", function* shock(f: Frame) {
	let A: Value = null, s: Value = null, m: Value = null, buckled_mob: Value = null;
	if (this.last_time + 50 > rt.worldTime(f)) {
		return f.dot;
	}
	this.last_time = rt.worldTime(f);
	if (!isarea((A = get_area(this)))) {
		return f.dot;
	}
	if (!A.powered(1)) {
		return f.dot;
	}
	yield* A.use_power(1, 5000);
	flick("echair_shock", this);
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(12, 1, this);
	yield* s.start();
	if (this.has_buckled_mobs()) {
		for (m of each(this.buckled_mobs)) {
			yield* (buckled_mob = m).electrocute_act(85, this, 1);
			to_chat(buckled_mob, "<span class='userdanger'>You feel a deep shock course through your body!</span>");
			yield* addtimer((yield* new_(T("/datum/callback"), buckled_mob, P("/mob/living/proc/electrocute_act"), 85, this, 1)), 1);
		}
	}
	this.visible_message("<span class='danger'>The electric chair went off!</span>", "<span class='italics'>You hear a deep sharp shock!</span>");
	return f.dot;
}, true);
