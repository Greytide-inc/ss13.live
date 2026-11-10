// Based on /tg/station's code/game/objects/effects/effect_system/effects_smoke.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, add, fmt } = rt;


rt.type(11925, "/obj/effect/particle_effect/smoke", "/obj/effect/particle_effect", {
	amount: 4,
	lifetime: 5,
	opaque: 1,
	anchored: 1,
	name: "smoke",
	icon: rt.rsc("icons/effects/96x96.dmi"),
	icon_state: "smoke",
	pixel_x: -32,
	pixel_y: -32,
	opacity: 0,
	layer: 5,
	mouse_opacity: 0,
	animate_movement: 0,
});

// effects_smoke.dm:22
rt.def("/obj/effect/particle_effect/smoke/proc/fade_out", function* fade_out(f: Frame, frames: Value) {
	frames ??= 16;
	if (this.alpha == 0) {
		return f.dot;
	}
	if (frames == 0) {
		frames = 1;
	}
	let step: Value = this.alpha / frames;
	let i: Value = 0;
	while (i < frames) {
		this.alpha -= step;
		if (this.alpha < 160) {
			this.set_opacity(0);
		}
		yield* stoplag();
		i++;
	}
	return f.dot;
}, true);

// effects_smoke.dm:34
rt.def("/obj/effect/particle_effect/smoke/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	yield* this.create_reagents(500);
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// effects_smoke.dm:40
rt.def("/obj/effect/particle_effect/smoke/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// effects_smoke.dm:44
rt.def("/obj/effect/particle_effect/smoke/proc/kill_smoke", function* kill_smoke(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	yield* ImmediateInvokeAsync(this, P("/obj/effect/particle_effect/smoke/proc/fade_out"));
	yield* addtimer((yield* new_(T("/datum/callback"), "some_magic_bullshit", P("/proc/qdel"), this)), 10, 8);
	return f.dot;
}, true);

// effects_smoke.dm:49
rt.def("/obj/effect/particle_effect/smoke/proc/process", function* process(f: Frame) {
	let L: Value = null;
	this.lifetime--;
	if (this.lifetime < 1) {
		yield* this.kill_smoke();
		return 0;
	}
	for (L of each(range(0, this), T("/mob/living"))) {
		yield* this.smoke_mob(L);
	}
	return 1;
}, true, { waitfor: false });

// effects_smoke.dm:58
rt.def("/obj/effect/particle_effect/smoke/proc/smoke_mob", function* smoke_mob(f: Frame, C: Value) {
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return 0;
	}
	if (this.lifetime < 1) {
		return 0;
	}
	if (C.internal !== null || C.has_smoke_protection()) {
		return 0;
	}
	if (C.smoke_delay) {
		return 0;
	}
	C.smoke_delay++;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/effect/particle_effect/smoke/proc/remove_smoke_delay"), C)), 10);
	return 1;
}, true);

// effects_smoke.dm:72
rt.def("/obj/effect/particle_effect/smoke/proc/remove_smoke_delay", function remove_smoke_delay(f: Frame, C: Value) {
	if (!C) return f.dot;
	C.smoke_delay = 0;
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living/carbon" }] });

// effects_smoke.dm:75
rt.def("/obj/effect/particle_effect/smoke/proc/spread_smoke", function* spread_smoke(f: Frame) {
	let t_loc: Value = null, _T: Value = null, foundsmoke: Value = null, L: Value = null, S: Value = null, SM: Value = null;
	if (!(t_loc = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	let newsmokes: Value = list();
	for (_T of each(t_loc.GetAtmosAdjacentTurfs(), T("/turf"))) {
		if (foundsmoke = rt.locateIn(f, T("/obj/effect/particle_effect/smoke"), _T)) {
			continue;
		}
		L = null;
		for (L of each(_T, T("/mob/living"))) {
			yield* this.smoke_mob(L);
		}
		S = (yield* new_(this.type, _T));
		yield* this.reagents.copy_to(S, this.reagents.total_volume);
		yield* S.setDir(pick(GLOB.cardinal));
		S.amount = this.amount - 1;
		S.add_atom_colour(this.color, FIXED_COLOUR_PRIORITY);
		S.lifetime = this.lifetime;
		if (S.amount > 0) {
			if (this.opaque) {
				S.set_opacity(1);
			}
			newsmokes.Add(S);
		}
	}
	if (!rt.len(f, newsmokes)) return f.dot;
	rt.spawnTail(f, 1, "/obj/effect/particle_effect/smoke/proc/spread_smoke: spawn at game/objects/effects/effect_system/effects_smoke.dm:97", t_loc, newsmokes, _T, foundsmoke, L, S, SM);
	return f.dot;
}, true);

// a spawn(1) body of /obj/effect/particle_effect/smoke/proc/spread_smoke, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/effect/particle_effect/smoke/proc/spread_smoke: spawn at game/objects/effects/effect_system/effects_smoke.dm:97", function* (f: Frame, t_loc: Value, newsmokes: Value, _T: Value, foundsmoke: Value, L: Value, S: Value, SM: Value) {
	SM = null;
	for (SM of each(newsmokes, T("/obj/effect/particle_effect/smoke"))) {
		yield* SM.spread_smoke();
	}
	return null;
});

rt.type(1521, "/datum/effect_system/smoke_spread", "/datum/effect_system", {
	amount: 10,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke"),
});

// effects_smoke.dm:107
rt.def("/datum/effect_system/smoke_spread/proc/set_up", function set_up(f: Frame, radius: Value, loca: Value) {
	radius ??= 5;
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	this.amount = radius;
	return f.dot;
});

// effects_smoke.dm:115
rt.def("/datum/effect_system/smoke_spread/proc/start", function* start(f: Frame) {
	let S: Value = null;
	if (this.holder) {
		this.location = rt.getStep(f, this.holder, 0);
	}
	(S = (yield* new_(this.effect_type, this.location))).amount = this.amount;
	if (!S.amount) return f.dot;
	yield* S.spread_smoke();
	return f.dot;
}, true);

rt.type(11926, "/obj/effect/particle_effect/smoke/bad", "/obj/effect/particle_effect/smoke", {
	lifetime: 8,
});

// effects_smoke.dm:130
rt.def("/obj/effect/particle_effect/smoke/bad/proc/smoke_mob", function* smoke_mob(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	yield* M.drop_item();
	yield* M.adjustOxyLoss(1);
	yield* M.emote("cough");
	return 1;
}, true);

// effects_smoke.dm:137
rt.def("/obj/effect/particle_effect/smoke/bad/proc/CanPass", function CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let B: Value = null;
	height ??= 0;
	if (height == 0) {
		return 1;
	}
	if (rt.istype(mover, T("/obj/item/projectile/beam"))) {
		(B = mover).damage = B.damage / 2;
	}
	return 1;
});

rt.type(1523, "/datum/effect_system/smoke_spread/freezing", "/datum/effect_system/smoke_spread", {
	blast: 0,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/freezing"),
});

// effects_smoke.dm:162
rt.def("/datum/effect_system/smoke_spread/freezing/proc/Chilled", function* Chilled(f: Frame, A: Value) {
	let _T: Value = null, G: Value = null, H: Value = null, G_gases: Value = null, U: Value = null, L: Value = null, Item: Value = null;
	if (!rt.istype(A, T("/turf/open"))) return f.dot;
	if ((_T = A).air) {
		G = _T.air;
		if (get_dist(_T, this.location) < 2) {
			G.temperature = 2;
		}
		_T.air_update_turf();
		for (H of each(_T, T("/obj/effect/hotspot"))) {
			yield* qdel(H);
			if (rt.index((G_gases = G.gases), "plasma")) {
				G.assert_gas("n2");
				rt.modAt(rt.at(G_gases, "n2"), 1, rt.index(rt.at(G_gases, "plasma"), 1), add);
				rt.setAt(rt.at(G_gases, "plasma"), 1, 0);
				G.garbage_collect();
			}
		}
	}
	for (U of each(_T, T("/obj/machinery/atmospherics/components/unary"))) {
		if (U.welded !== null && !U.welded) {
			U.welded = 1;
			yield* U.update_icon();
			U.visible_message(`<span class='danger'>${U} was frozen shut!</span>`);
		}
	}
	for (L of each(_T, T("/mob/living"))) {
		yield* L.ExtinguishMob();
	}
	for (Item of each(_T, T("/obj/item"))) {
		yield* Item.extinguish();
	}
	return f.dot;
}, true);

// effects_smoke.dm:188
rt.def("/datum/effect_system/smoke_spread/freezing/proc/set_up", function set_up(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 5;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	parent_proc();
	this.blast = f.args[2];
	return f.dot;
}, false, { args: ["radius", "loca", "blasting"] });

// effects_smoke.dm:193
rt.def("/datum/effect_system/smoke_spread/freezing/proc/start", function* start(f: Frame) {
	let _T: Value = null;
	if (this.blast) {
		for (_T of each(block(rt.locate(max(this.location.x - 2, 1), max(this.location.y - 2, 1), this.location.z), rt.locate(min(this.location.x + 2, rt.world().maxx), min(this.location.y + 2, rt.world().maxy), this.location.z)), T("/turf"))) {
			yield* this.Chilled(_T);
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(11928, "/obj/effect/particle_effect/smoke/sleeping", "/obj/effect/particle_effect/smoke", {
	lifetime: 10,
	color: "#9C3636",
});

// effects_smoke.dm:208
rt.def("/obj/effect/particle_effect/smoke/sleeping/proc/smoke_mob", function* smoke_mob(f: Frame, M: Value) {
	if (!(yield* parent_proc())) return f.dot;
	yield* M.drop_item();
	yield* M.Sleeping(200);
	yield* M.emote("cough");
	return 1;
}, true);

rt.type(11929, "/obj/effect/particle_effect/smoke/chem", "/obj/effect/particle_effect/smoke", {
	lifetime: 10,
});

// effects_smoke.dm:226
rt.def("/obj/effect/particle_effect/smoke/chem/proc/process", function* process(f: Frame) {
	let AM: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	let _T: Value = rt.getStep(f, this, 0);
	let fraction: Value = 1 / rt.initial(f, this, "lifetime");
	for (AM of each(_T, T("/atom/movable"))) {
		if (AM.type == this.type) {
			continue;
		}
		if (_T.intact && AM.level == 1) {
			continue;
		}
		yield* this.reagents.reaction(AM, TOUCH, fraction);
	}
	yield* this.reagents.reaction(_T, TOUCH, fraction);
	return 1;
}, true, { waitfor: false });

// effects_smoke.dm:240
rt.def("/obj/effect/particle_effect/smoke/chem/proc/smoke_mob", function* smoke_mob(f: Frame, M: Value) {
	let C: Value = null;
	if (this.lifetime < 1) {
		return 0;
	}
	if (!rt.istype(M, T("/mob/living/carbon"))) {
		return 0;
	}
	if ((C = M).internal !== null || C.has_smoke_protection()) {
		return 0;
	}
	let fraction: Value = 1 / rt.initial(f, this, "lifetime");
	yield* this.reagents.copy_to(C, fraction * this.reagents.total_volume);
	yield* this.reagents.reaction(M, INGEST, fraction);
	return 1;
}, true);

rt.type(1525, "/datum/effect_system/smoke_spread/chem", "/datum/effect_system/smoke_spread", {
	chemholder: null,
	effect_type: rt.typePath("/obj/effect/particle_effect/smoke/chem"),
});

// effects_smoke.dm:259
rt.def("/datum/effect_system/smoke_spread/chem/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.chemholder = (yield* new_(T("/obj")));
	let R: Value = (yield* new_(T("/datum/reagents"), 500));
	this.chemholder.reagents = R;
	R.my_atom = this.chemholder;
	return f.dot;
}, true);

// effects_smoke.dm:266
rt.def("/datum/effect_system/smoke_spread/chem/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.chemholder);
	this.chemholder = null;
	return (yield* parent_proc());
}, true);

// effects_smoke.dm:271
rt.def("/datum/effect_system/smoke_spread/chem/proc/set_up", function* set_up(f: Frame, carry: Value, radius: Value, loca: Value, silent: Value) {
	let reagent: Value = null, M: Value = null, more: Value = null;
	radius ??= 1;
	silent ??= 0;
	if (isturf(loca)) {
		this.location = loca;
	} else {
		this.location = rt.getStep(f, loca, 0);
	}
	this.amount = radius;
	yield* carry.copy_to(this.chemholder, 4 * carry.total_volume);
	if (silent) return f.dot;
	let contained: Value = "";
	for (reagent of each(carry.reagent_list)) {
		contained += ` ${reagent} `;
	}
	if (contained) {
		contained = `[${contained}]`;
	}
	let A: Value = get_area(this.location);
	let where: Value = `${A.name} | ${this.location.x}, ${this.location.y}`;
	let whereLink: Value = `<A HREF='?_src_=holder;adminplayerobservecoodjump=1;X=${this.location.x};Y=${this.location.y};Z=${this.location.z}'>${where}</a>`;
	if (carry.my_atom.fingerprintslast) {
		M = get_mob_by_key(carry.my_atom.fingerprintslast);
		more = "";
		if (M) {
			more = fmt("(<A HREF='?_src_=holder;adminmoreinfo=＃'>?</a>) (<A HREF='?_src_=holder;adminplayerobservefollow=＃'>FLW</A>) ", [M, M]);
		}
		message_admins(`Smoke: (${whereLink})${contained}. Key: ${carry.my_atom.fingerprintslast}${more}.`, 0, 1);
		log_game(`A chemical smoke reaction has taken place in (${where})${contained}. Last associated key is ${carry.my_atom.fingerprintslast}.`);
	} else {
		message_admins(`Smoke: (${whereLink})${contained}. No associated key.`, 0, 1);
		log_game(`A chemical smoke reaction has taken place in (${where})${contained}. No associated key.`);
	}
	return f.dot;
}, true);

// effects_smoke.dm:302
rt.def("/datum/effect_system/smoke_spread/chem/proc/start", function* start(f: Frame) {
	let mixcolor: Value = mix_color_from_reagents(this.chemholder.reagents.reagent_list);
	if (this.holder) {
		this.location = rt.getStep(f, this.holder, 0);
	}
	let S: Value = (yield* new_(this.effect_type, this.location));
	if (this.chemholder.reagents.total_volume > 1) {
		yield* this.chemholder.reagents.copy_to(S, this.chemholder.reagents.total_volume);
	}
	if (mixcolor) {
		S.add_atom_colour(mixcolor, FIXED_COLOUR_PRIORITY);
	}
	S.amount = this.amount;
	if (!S.amount) return f.dot;
	yield* S.spread_smoke();
	return f.dot;
}, true);
