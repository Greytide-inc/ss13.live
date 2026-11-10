// Based on /tg/station's code/game/objects/effects/decals/cleanable/humans.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(11707, "/obj/effect/decal/cleanable/blood", "/obj/effect/decal/cleanable", {
	viruses: null,
	blood_DNA: null,
	name: "blood",
	desc: "It's red and gooey. Perhaps it's the chef's cooking?",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "floor1",
	random_icon_states: null,
	blood_state: "blood",
	bloodiness: 100,
});

// humans.dm:7
rt.def("/obj/effect/decal/cleanable/blood/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.viruses = list();

	this.blood_DNA = list();
	this.random_icon_states = list("floor1", "floor2", "floor3", "floor4", "floor5", "floor6", "floor7");
	return f.dot;
});

// humans.dm:13
rt.def("/obj/effect/decal/cleanable/blood/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	for (D of each(this.viruses, T("/datum/disease"))) {
		yield* D.cure(0);
	}
	this.viruses = null;
	return (yield* parent_proc());
}, true);

// humans.dm:19
rt.def("/obj/effect/decal/cleanable/blood/proc/replace_decal", function* replace_decal(f: Frame, C: Value) {
	if (C.blood_DNA) {
		(rt.modSrcVar(f, "blood_DNA", (yield* C.blood_DNA.Copy()), rt.bitOr));
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11710, "/obj/effect/decal/cleanable/blood/old", "/obj/effect/decal/cleanable/blood", {
	name: "dried blood",
	desc: "Looks like it's been here a while.  Eew.",
	bloodiness: 0,
});

// humans.dm:29
rt.def("/obj/effect/decal/cleanable/blood/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.icon_state += "-old";
	rt.setAt(this.blood_DNA, "Non-human DNA", "A+");
	return f.dot;
}, true);

rt.type(11712, "/obj/effect/decal/cleanable/blood/tracks", "/obj/effect/decal/cleanable/blood", {
	icon_state: "tracks",
	desc: "They look like tracks left by wheels.",
	random_icon_states: null,
});

// humans.dm:39
rt.def("/obj/effect/decal/cleanable/blood/tracks/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = null;
	return f.dot;
});

rt.type(11736, "/obj/effect/decal/cleanable/trail_holder", "/obj/effect/decal/cleanable", {
	existing_dirs: null,
	random_icon_states: null,
	blood_DNA: null,
	name: "blood",
	icon_state: "ltrails_1",
	desc: "Your instincts say you shouldn't be following these.",
});

// humans.dm:46
rt.def("/obj/effect/decal/cleanable/trail_holder/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = null;

	this.existing_dirs = list();

	this.blood_DNA = list();
	return f.dot;
});

rt.type(11713, "/obj/effect/decal/cleanable/blood/gibs", "/obj/effect/decal/cleanable/blood", {
	name: "gibs",
	desc: "They look bloody and gruesome.",
	icon: rt.rsc("icons/effects/blood.dmi"),
	icon_state: "gibbl5",
	layer: 2.5,
	random_icon_states: null,
	mergeable_decal: 0,
});

// humans.dm:64
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.reagents.add_reagent("liquidgibs", 5);
	return f.dot;
}, true);

// humans.dm:72
rt.def("/obj/effect/decal/cleanable/blood/gibs/proc/streak", function* streak(f: Frame, directions: Value) {
	let b: Value = null, D: Value = null, ND: Value = null;
	let direction: Value = pick(directions);
	let i: Value = 0;
	while (i < rt.op(f, "PickWeighted", [4], [100, 1, 200, 2, 150, 3, 100, 50])) {
		yield* sleep(2);
		if (i > 0) {
			b = (yield* new_(T("/obj/effect/decal/cleanable/blood/splatter"), this.loc));
			D = null;
			for (D of each(this.viruses, T("/datum/disease"))) {
				ND = (yield* D.Copy(1));
				b.viruses += ND;
				ND.holder = b;
			}
		}
		if (!(yield* step_to(this, rt.getStep(f, this, direction), 0))) {
			break;
		}
		i++;
	}
	return f.dot;
}, true, { waitfor: false });

rt.type(11717, "/obj/effect/decal/cleanable/blood/gibs/torso", "/obj/effect/decal/cleanable/blood/gibs", {
	random_icon_states: null,
});

// humans.dm:94
rt.def("/obj/effect/decal/cleanable/blood/gibs/torso/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.random_icon_states = list("gibtorso");
	return f.dot;
});

rt.type(11720, "/obj/effect/decal/cleanable/blood/gibs/old", "/obj/effect/decal/cleanable/blood/gibs", {
	name: "old rotting gibs",
	desc: "Space Jesus, why didn't anyone clean this up?  It smells terrible.",
	bloodiness: 0,
});

// humans.dm:108
rt.def("/obj/effect/decal/cleanable/blood/gibs/old/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.setDir(pick(1, 2, 4, 8));
	this.icon_state += "-old";
	rt.setAt(this.blood_DNA, "Non-human DNA", "A+");
	return f.dot;
}, true);

rt.type(11723, "/obj/effect/decal/cleanable/blood/footprints", "/obj/effect/decal/cleanable/blood", {
	entered_dirs: 0,
	exited_dirs: 0,
	shoe_types: null,
	name: "footprints",
	icon: rt.rsc("icons/effects/footprints.dmi"),
	icon_state: "nothingwhatsoever",
	desc: "WHOSE FOOTPRINTS ARE THESE?",
	random_icon_states: null,
	blood_state: "blood",
});

// humans.dm:137
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.shoe_types = list();

	this.random_icon_states = null;
	return f.dot;
});

// humans.dm:140
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/Crossed", function Crossed(f: Frame, O: Value) {
	let H: Value = null, S: Value = null;
	if (rt.istype(O, T("/mob/living/carbon/human"))) {
		H = O;
		if ((S = H.shoes) && rt.index(S.bloody_shoes, this.blood_state)) {
			rt.setAt(S.bloody_shoes, this.blood_state, max(rt.index(S.bloody_shoes, this.blood_state) - BLOOD_LOSS_PER_STEP, 0));
			(rt.modSrcVar(f, "entered_dirs", H.dir, rt.bitOr));
			(rt.modSrcVar(f, "shoe_types", H.shoes.type, rt.bitOr));
		}
	}
	this.update_icon();
	return f.dot;
});

// humans.dm:150
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/Uncrossed", function Uncrossed(f: Frame, O: Value) {
	let H: Value = null, S: Value = null;
	if (rt.istype(O, T("/mob/living/carbon/human"))) {
		H = O;
		if ((S = H.shoes) && rt.index(S.bloody_shoes, this.blood_state)) {
			rt.setAt(S.bloody_shoes, this.blood_state, max(rt.index(S.bloody_shoes, this.blood_state) - BLOOD_LOSS_PER_STEP, 0));
			(rt.modSrcVar(f, "exited_dirs", H.dir, rt.bitOr));
			(rt.modSrcVar(f, "shoe_types", H.shoes.type, rt.bitOr));
		}
	}
	this.update_icon();
	return f.dot;
});

// humans.dm:160
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/update_icon", function update_icon(f: Frame) {
	let Ddir: Value = null, bloodstep_overlay: Value = null;
	this.cut_overlays();
	for (Ddir of each(GLOB.cardinal)) {
		if (rt.bitAnd(this.entered_dirs, Ddir)) {
			if (!(bloodstep_overlay = rt.index(GLOB.bloody_footprints_cache, `entered-${this.blood_state}-${Ddir}`))) {
				rt.setAt(GLOB.bloody_footprints_cache, `entered-${this.blood_state}-${Ddir}`, (bloodstep_overlay = image(this.icon, `${this.blood_state}1`, { dir: Ddir })));
			}
			this.add_overlay(bloodstep_overlay);
		}
		if (rt.bitAnd(this.exited_dirs, Ddir)) {
			if (!(bloodstep_overlay = rt.index(GLOB.bloody_footprints_cache, `exited-${this.blood_state}-${Ddir}`))) {
				rt.setAt(GLOB.bloody_footprints_cache, `exited-${this.blood_state}-${Ddir}`, (bloodstep_overlay = image(this.icon, `${this.blood_state}2`, { dir: Ddir })));
			}
			this.add_overlay(bloodstep_overlay);
		}
	}
	this.alpha = BLOODY_FOOTPRINT_BASE_ALPHA + this.bloodiness;
	return f.dot;
});

// humans.dm:178
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/examine", function examine(f: Frame, user: Value) {
	let shoe: Value = null, S: Value = null;
	f.dot = parent_proc();
	if (rt.len(f, this.shoe_types)) {
		f.dot += "You recognise the footprints as belonging to:\n";
		for (shoe of each(this.shoe_types)) {
			f.dot += `some <B>${rt.initial(f, (S = shoe), "name")}</B> ${bicon(rt.initial(f, S, "icon"))}\n`;
		}
	}
	to_chat(user, f.dot);
	return f.dot;
}, false);

// humans.dm:188
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/replace_decal", function* replace_decal(f: Frame, C: Value) {
	if (this.blood_state != C.blood_state) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// humans.dm:193
rt.def("/obj/effect/decal/cleanable/blood/footprints/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	if (this.blood_state != "oil" && this.blood_state != "no blood whatsoever") {
		return 1;
	}
	return 0;
});
