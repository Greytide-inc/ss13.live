// Based on /tg/station's code/game/turfs/simulated/wall/misc_walls.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4418, "/turf/closed/wall/mineral/cult", "/turf/closed/wall/mineral", {
	name: "runed metal wall",
	desc: "A cold metal wall engraved with indecipherable symbols. Studying them causes your head to pound.",
	icon: rt.rsc("icons/turf/walls/cult_wall.dmi"),
	icon_state: "cult",
	canSmoothWith: null,
	smooth: 2,
	sheet_amount: 1,
	sheet_type: rt.typePath("/obj/item/stack/sheet/runed_metal"),
	girder_type: rt.typePath("/obj/structure/girder/cult"),
});

// misc_walls.dm:6
rt.def("/turf/closed/wall/mineral/cult/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});

// misc_walls.dm:13
rt.def("/turf/closed/wall/mineral/cult/proc/Initialize", function* Initialize(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/cult/turf"), this);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// misc_walls.dm:17
rt.def("/turf/closed/wall/mineral/cult/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* new_(this.sheet_type, rt.getStep(f, this, 0), this.sheet_amount);
	return f.dot;
}, true);

// misc_walls.dm:20
rt.def("/turf/closed/wall/mineral/cult/proc/Exited", function* Exited(f: Frame, AM: Value, newloc: Value) {
	let stored_pulling: Value = null;
	f.dot = (yield* parent_proc());
	if (!rt.istype(AM, T("/mob/living/simple_animal/hostile/construct/harvester"))) return f.dot;
	let H: Value = AM;
	if (!(stored_pulling = H.pulling)) return f.dot;
	yield* stored_pulling.setDir(rt.getDir(f, stored_pulling.loc, newloc));
	yield* stored_pulling.forceMove(this);
	yield* H.start_pulling(stored_pulling, 1);
	return f.dot;
}, true);

// misc_walls.dm:30
rt.def("/turf/closed/wall/mineral/cult/proc/ratvar_act", function* ratvar_act(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!rt.istype(this, T("/turf/closed/wall/mineral/cult"))) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#FAE48C";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

rt.type(4419, "/turf/closed/wall/mineral/cult/artificer", "/turf/closed/wall/mineral/cult", {
	name: "runed stone wall",
	desc: "A cold stone wall engraved with indecipherable symbols. Studying them causes your head to pound.",
});

// misc_walls.dm:42
rt.def("/turf/closed/wall/mineral/cult/artificer/proc/break_wall", function* break_wall(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/cult/turf"), rt.getStep(f, this, 0));
	return null;
}, true);

// misc_walls.dm:46
rt.def("/turf/closed/wall/mineral/cult/artificer/proc/devastate_wall", function* devastate_wall(f: Frame) {
	yield* new_(T("/obj/effect/temp_visual/cult/turf"), rt.getStep(f, this, 0));
	return f.dot;
}, true);

rt.type(4443, "/turf/closed/wall/clockwork", "/turf/closed/wall", {
	realappearence: null,
	linkedcache: null,
	name: "clockwork wall",
	desc: "A huge chunk of warm metal. The clanging of machinery emanates from within.",
	explosion_block: 2,
	hardness: 10,
	slicing_duration: 80,
	sheet_amount: 1,
	sheet_type: rt.typePath("/obj/item/stack/tile/brass"),
	girder_type: rt.typePath("/obj/structure/destructible/clockwork/wall_gear"),
});

// misc_walls.dm:62
rt.def("/turf/closed/wall/clockwork/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* new_(T("/obj/effect/temp_visual/ratvar/wall"), this);
	yield* new_(T("/obj/effect/temp_visual/ratvar/beam"), this);
	this.realappearence = (yield* new_(T("/obj/effect/clockwork/overlay/wall"), this));
	this.realappearence.linked = this;
	change_construction_value(5);
	return f.dot;
}, true);

// misc_walls.dm:70
rt.def("/turf/closed/wall/clockwork/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (!((is_servant_of_ratvar(user) || rt.istype(user, T("/mob/dead/observer"))) && this.linkedcache)) return f.dot;
	to_chat(user, "<span class='brass'>It is linked to a Tinkerer's Cache, generating components!</span>");
	return f.dot;
}, false);

// misc_walls.dm:76
rt.def("/turf/closed/wall/clockwork/proc/Destroy", function* Destroy(f: Frame) {
	if (this.linkedcache) {
		this.linkedcache.linkedwall = null;
		this.linkedcache = null;
	}
	change_construction_value(-5);
	if (this.realappearence) {
		yield* qdel(this.realappearence);
		this.realappearence = null;
	}
	return (yield* parent_proc());
}, true);

// misc_walls.dm:85
rt.def("/turf/closed/wall/clockwork/proc/ReplaceWithLattice", function* ReplaceWithLattice(f: Frame) {
	let L: Value = null;
	yield* parent_proc();
	for (L of each(this, T("/obj/structure/lattice"))) {
		yield* L.ratvar_act();
	}
	return f.dot;
}, true);

// misc_walls.dm:90
rt.def("/turf/closed/wall/clockwork/proc/narsie_act", function* narsie_act(f: Frame) {
	yield* parent_proc();
	if (!rt.istype(this, T("/turf/closed/wall/clockwork"))) return f.dot;
	let previouscolor: Value = this.color;
	this.color = "#960000";
	rt.op(f, "Animate", [2, 6], [null, this, "color", previouscolor, "time", 8]);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/atom/proc/update_atom_colour"))), 8);
	return f.dot;
}, true);

// misc_walls.dm:99
rt.def("/turf/closed/wall/clockwork/proc/dismantle_wall", function* dismantle_wall(f: Frame, devastated: Value, explode: Value) {
	let newgirder: Value = null, O: Value = null, _P: Value = null;
	devastated ??= 0;
	explode ??= 0;
	if (devastated) {
		yield* this.devastate_wall();
		yield* this.ChangeTurf(T("/turf/open/floor/plating"));
	} else {
		playsound(this, rt.rsc("sound/items/welder.ogg"), 100, 1);
		if (newgirder = (yield* this.break_wall())) {
			this.transfer_fingerprints_to(newgirder);
		}
		yield* this.ChangeTurf(T("/turf/open/floor/clockwork"));
	}
	for (O of each(this, T("/obj"))) {
		if (rt.istype(O, T("/obj/structure/sign/poster"))) {
			yield* (_P = O).roll_and_drop(this);
		} else {
			O.loc = this;
		}
	}
	return f.dot;
}, true);

// misc_walls.dm:116
rt.def("/turf/closed/wall/clockwork/proc/devastate_wall", function* devastate_wall(f: Frame) {
	let i: Value = null;
	let $e: any;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clockwork/alloy_shards/large"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 2, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clockwork/alloy_shards/medium"), this);
	}
	rt.endFor(f, 0);
	i = null;
	rt.forRange(f, 0, 1, 3, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* new_(T("/obj/item/clockwork/alloy_shards/small"), this);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

rt.type(4445, "/turf/closed/wall/ice", "/turf/closed/wall", {
	hardness: 35,
	slicing_duration: 150,
	icon: rt.rsc("icons/turf/walls/icedmetal_wall.dmi"),
	icon_state: "iced",
	desc: "A wall covered in a thick sheet of ice.",
	canSmoothWith: null,
});

// misc_walls.dm:132
rt.def("/turf/closed/wall/ice/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canSmoothWith = null;
	return f.dot;
});
