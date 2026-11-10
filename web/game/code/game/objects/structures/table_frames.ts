// Based on /tg/station's code/game/objects/structures/table_frames.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(12203, "/obj/structure/table_frame", "/obj/structure", {
	framestack: rt.typePath("/obj/item/stack/rods"),
	framestackamount: 2,
	anchored: 0,
	name: "table frame",
	desc: "Four metal legs with four framing rods for a table. You could easily pass through this.",
	icon: rt.rsc("icons/obj/structures.dmi"),
	icon_state: "table_frame",
	density: 0,
	layer: 2.75,
	obj_integrity: 100,
	max_integrity: 100,
});

// table_frames.dm:26
rt.def("/obj/structure/table_frame/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _P: Value = null, M: Value = null, G: Value = null, S: Value = null, C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/wrench"))) {
		to_chat(user, `<span class='notice'>You start disassembling ${this}...</span>`);
		playsound(this.loc, I.usesound, 50, 1);
		if (yield* do_after(user, 30 * I.toolspeed, { target: this })) {
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
			yield* this.deconstruct(1);
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/plasteel"))) {
		if ((_P = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one plasteel sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${_P} to ${this}...</span>`);
		if ((yield* do_after(user, 50, { target: this })) && (yield* _P.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/reinforced"));
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/metal"))) {
		if ((M = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one metal sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${M} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* M.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table"));
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/glass"))) {
		if ((G = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one glass sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${G} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* G.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/glass"));
		}
	} else if (rt.istype(I, T("/obj/item/stack/sheet/mineral/silver"))) {
		if ((S = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one silver sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${S} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* S.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/optable"));
		}
	} else if (rt.istype(I, T("/obj/item/stack/tile/carpet/black"))) {
		if ((C = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one  black carpet sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${C} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* C.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/wood/fancy/black"));
		}
	} else if (rt.istype(I, T("/obj/item/stack/tile/carpet"))) {
		if ((C = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one carpet sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${C} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* C.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/wood/fancy"));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// table_frames.dm:84
rt.def("/obj/structure/table_frame/proc/make_new_table", function* make_new_table(f: Frame, table_type: Value) {
	let _T: Value = null;
	(_T = (yield* new_(table_type, this.loc))).frame = this.type;
	_T.framestack = this.framestack;
	_T.framestackamount = this.framestackamount;
	yield* qdel(this);
	return f.dot;
}, true);

// table_frames.dm:91
rt.def("/obj/structure/table_frame/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	yield* new_(this.framestack, rt.getStep(f, this, 0), this.framestackamount);
	yield* qdel(this);
	return f.dot;
}, true);

// table_frames.dm:95
rt.def("/obj/structure/table_frame/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* new_(T("/obj/structure/table_frame/wood"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

// table_frames.dm:99
rt.def("/obj/structure/table_frame/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* new_(T("/obj/structure/table_frame/brass"), this.loc);
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(12206, "/obj/structure/table_frame/wood", "/obj/structure/table_frame", {
	framestack: rt.typePath("/obj/item/stack/sheet/mineral/wood"),
	framestackamount: 2,
	name: "wooden table frame",
	desc: "Four wooden legs with four framing wooden rods for a wooden table. You could easily pass through this.",
	icon_state: "wood_frame",
	resistance_flags: 4,
});

// table_frames.dm:115
rt.def("/obj/structure/table_frame/wood/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null, C: Value = null;
	if (rt.istype(I, T("/obj/item/stack/sheet/mineral/wood"))) {
		if ((W = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one wood sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${W} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* W.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/wood"));
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/stack/tile/carpet"))) {
		if ((C = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one carpet sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${C} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* C.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/wood/poker"));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(12204, "/obj/structure/table_frame/brass", "/obj/structure/table_frame", {
	name: "brass table frame",
	desc: "Four pieces of brass arranged in a square. It's slightly warm to the touch.",
	icon_state: "brass_frame",
	resistance_flags: 34,
	framestack: rt.typePath("/obj/item/stack/tile/brass"),
	framestackamount: 1,
});

// table_frames.dm:144
rt.def("/obj/structure/table_frame/brass/proc/New", function* New(f: Frame) {
	change_construction_value(1);
	yield* parent_proc();
	return f.dot;
}, true);

// table_frames.dm:148
rt.def("/obj/structure/table_frame/brass/proc/Destroy", function* Destroy(f: Frame) {
	change_construction_value(-1);
	return (yield* parent_proc());
}, true);

// table_frames.dm:152
rt.def("/obj/structure/table_frame/brass/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	if (rt.istype(I, T("/obj/item/stack/tile/brass"))) {
		if ((W = I).get_amount() < 1) {
			to_chat(user, "<span class='warning'>You need one brass sheet to do this!</span>");
			return f.dot;
		}
		to_chat(user, `<span class='notice'>You start adding ${W} to ${this}...</span>`);
		if ((yield* do_after(user, 20, { target: this })) && (yield* W.use(1))) {
			yield* this.make_new_table(T("/obj/structure/table/reinforced/brass"));
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// table_frames.dm:164
rt.def("/obj/structure/table_frame/brass/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* parent_proc();
	if (!this) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);
