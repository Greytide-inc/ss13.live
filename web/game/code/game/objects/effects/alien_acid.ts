// Based on /tg/station's code/game/objects/effects/alien_acid.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11782, "/obj/effect/acid", "/obj/effect", {
	target: null,
	anchored: 1,
	gender: "plural",
	name: "acid",
	desc: "Burbling corrossive stuff.",
	icon_state: "acid",
	density: 0,
	opacity: 0,
	resistance_flags: 50,
	layer: 2.08,
});

// alien_acid.dm:24
rt.def("/obj/effect/acid/proc/New", function* New(f: Frame, loc: Value, acid_pwr: Value, acid_amt: Value) {
	yield* parent_proc(loc);
	this.target = rt.getStep(f, this, 0);
	if (acid_amt) {
		this.acid_level = min(acid_amt * acid_pwr, 12000);
	}
	this.pixel_x = this.target.pixel_x + rand(-4, 4);
	this.pixel_y = this.target.pixel_y + rand(-4, 4);
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// alien_acid.dm:39
rt.def("/obj/effect/acid/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	this.target = null;
	return (yield* parent_proc());
}, true);

// alien_acid.dm:45
rt.def("/obj/effect/acid/proc/process", function* process(f: Frame) {
	let O: Value = null, acid_used: Value = null;
	f.dot = 1;
	if (!this.target) {
		yield* qdel(this);
		return 0;
	}
	if (prob(5)) {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	for (O of each(this.target, T("/obj"))) {
		if (prob(20) && !rt.bitAnd(this.resistance_flags, UNACIDABLE)) {
			if (O.acid_level < this.acid_level * 0.3) {
				acid_used = min(this.acid_level * 0.05, 20);
				yield* O.acid_act(10, acid_used);
				this.acid_level = max(0, this.acid_level - acid_used * 10);
			}
		}
	}
	this.acid_level = max(this.acid_level - (5 + 2 * round(rt.op(f, "Sqrt", [], [this.acid_level]))), 0);
	if (!(this.acid_level <= 0)) return f.dot;
	yield* qdel(this);
	return 0;
}, true, { waitfor: false });

// alien_acid.dm:65
rt.def("/obj/effect/acid/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	let L: Value = null;
	if (!rt.istype(AM, T("/mob/living"))) return f.dot;
	if (rt.bitAnd((L = AM).movement_type, 2)) {
		return f.dot;
	}
	if (!(L.m_intent != "walk" && prob(40))) return f.dot;
	let acid_used: Value = min(this.acid_level * 0.05, 20);
	if (!(yield* L.acid_act(10, acid_used, "feet"))) return f.dot;
	this.acid_level = max(0, this.acid_level - acid_used * 10);
	playsound(L, rt.rsc("sound/weapons/sear.ogg"), 50, 1);
	to_chat(L, `<span class='userdanger'>${this} burns you!</span>`);
	return f.dot;
}, true);

rt.type(11783, "/obj/effect/acid/alien", "/obj/effect/acid", {
	target_strength: 30,
});

// alien_acid.dm:82
rt.def("/obj/effect/acid/alien/proc/process", function* process(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	if (prob(45)) {
		playsound(this.loc, rt.rsc("sound/items/welder.ogg"), 100, 1);
	}
	this.target_strength--;
	if (this.target_strength <= 0) {
		this.target.visible_message(`<span class='warning'>${this.target} collapses under its own weight into a puddle of goop and undigested debris!</span>`);
		yield* this.target.acid_melt();
		yield* qdel(this);
	} else if (this.target_strength === 24) {
		this.visible_message(`<span class='warning'>${this.target} is holding up against the acid!</span>`);
	} else if (this.target_strength === 16) {
		this.visible_message(`<span class='warning'>${this.target} is being melted by the acid!</span>`);
	} else if (this.target_strength === 8) {
		this.visible_message(`<span class='warning'>${this.target} is struggling to withstand the acid!</span>`);
	} else if (this.target_strength === 4) {
		this.visible_message(`<span class='warning'>${this.target} begins to crumble under the acid!</span>`);
	}
	return f.dot;
}, true, { waitfor: false });
