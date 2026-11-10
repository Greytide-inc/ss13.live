// Based on /tg/station's code/game/objects/effects/decals/crayon.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, subtract } = rt;


rt.type(11705, "/obj/effect/decal/cleanable/crayon", "/obj/effect/decal/cleanable", {
	do_icon_rotate: 1,
	name: "rune",
	desc: "Graffiti. Damn kids.",
	icon: rt.rsc("icons/effects/crayondecal.dmi"),
	icon_state: "rune1",
	gender: "neuter",
});

// crayon.dm:10
rt.def("/obj/effect/decal/cleanable/crayon/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	if (f.args[1] === null) {
		f.args[1] = "#FFFFFF";
	}
	if (f.args[2] === null) {
		f.args[2] = "rune1";
	}
	if (f.args[3] === null) {
		f.args[3] = "rune";
	}
	if (f.args[4] === null) {
		f.args[4] = 0;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	yield* parent_proc();
	this.name = f.args[3];
	this.desc = `A ${this.name} vandalizing the station.`;
	if (f.args[2] == "poseur tag") {
		f.args[2] = pick(GLOB.gang_name_pool);
	}
	if (f.args[5]) {
		this.icon = f.args[5];
	}
	this.icon_state = f.args[2];
	if (f.args[4] && this.do_icon_rotate) {
		(M = matrix()).Turn(f.args[4]);
		this.transform = M;
	}
	this.add_atom_colour(f.args[1], FIXED_COLOUR_PRIORITY);
	return f.dot;
}, true, { args: ["mapload", "main", "type", "e_name", "rotation", "alt_icon"] });

rt.type(11706, "/obj/effect/decal/cleanable/crayon/gang", "/obj/effect/decal/cleanable/crayon", {
	gang: null,
	user_mind: null,
	territory: null,
	layer: 3.6,
	do_icon_rotate: 0,
});

// crayon.dm:37
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/Initialize", function* Initialize(f: Frame, mapload: Value, G: Value, e_name: Value, rotation: Value, user: Value) {
	e_name ??= "gang tag";
	rotation ??= 0;
	if (!this.type || !G) {
		yield* qdel(this);
	}
	this.user_mind = user.mind;
	this.territory = get_area(this);
	this.gang = G;
	let newcolor: Value = G.color_hex;
	this.icon_state = G.name;
	(rt.modField(f, G, "territory_new", rt.alist(f, [this.territory.type, this.territory.name]), rt.bitOr));
	this.set_mind_owner(this.user_mind);
	yield* parent_proc(mapload, newcolor, this.icon_state, e_name, rotation);
	return f.dot;
}, true);

// crayon.dm:50
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/set_mind_owner", function set_mind_owner(f: Frame, mind: Value) {
	if (rt.istype(this.user_mind, T("/datum/mind")) && rt.istype(this.gang, T("/datum/gang")) && rt.istype(rt.index(this.gang.tags_by_mind, this.user_mind), T("/list"))) {
		(rt.modAt(this.gang.tags_by_mind, this.user_mind, this, subtract));
	}
	if (!rt.istype(mind, T("/datum/mind"))) return f.dot;
	if (!rt.istype(rt.index(this.gang.tags_by_mind, mind), T("/list"))) {
		rt.setAt(this.gang.tags_by_mind, mind, list());
	}
	rt.modAt(this.gang.tags_by_mind, mind, this, add);
	this.user_mind = mind;
	return f.dot;
});

// crayon.dm:60
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/Destroy", function* Destroy(f: Frame) {
	if (this.gang) {
		this.gang.territory -= this.territory.type;
		this.set_mind_owner(null);
		this.gang.territory_new -= this.territory.type;
		(rt.modField(f, this.gang, "territory_lost", rt.alist(f, [this.territory.type, this.territory.name]), rt.bitOr));
	}
	return (yield* parent_proc());
}, true);
