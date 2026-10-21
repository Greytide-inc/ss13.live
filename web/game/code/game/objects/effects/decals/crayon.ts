// From code/game/objects/effects/decals/crayon.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11705, "/obj/effect/decal/cleanable/crayon", "/obj/effect/decal/cleanable", {
	do_icon_rotate: 1,
	name: "rune",
	desc: "Graffiti. Damn kids.",
	icon: rt.rsc("icons/effects/crayondecal.dmi"),
	icon_state: "rune1",
	gender: "neuter",
});

// /obj/effect/decal/cleanable/crayon/proc/Initialize  (code/game/objects/effects/decals/crayon.dm:10)  may sleep
rt.def("/obj/effect/decal/cleanable/crayon/proc/Initialize", function* Initialize(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (live(f.args[1]) === null) {
		f.args[1] = "#FFFFFF";
	}
	if (live(f.args[2]) === null) {
		f.args[2] = "rune1";
	}
	if (live(f.args[3]) === null) {
		f.args[3] = "rune";
	}
	if (live(f.args[4]) === null) {
		f.args[4] = 0;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = null;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "name", live(f.args[3]));
	rt.setSv(f, "desc", fmt("A ＀ vandalizing the station.", [rt.sv(f, "name")]));
	if (isEqual(live(f.args[2]), "poseur tag")) {
		f.args[2] = rt.op(f, "PickUnweighted", [1], [rt.gl("gang_name_pool")]);
	}
	if (truthy(live(f.args[5]))) {
		rt.setSv(f, "icon", live(f.args[5]));
	}
	rt.setSv(f, "icon_state", live(f.args[2]));
	if ((truthy(live(f.args[4])) && truthy(rt.sv(f, "do_icon_rotate")))) {
		yield* g.callName(f, (M = (yield* g.call(f, P("/proc/matrix"), null, []))), "Turn", [live(f.args[4])]);
		rt.setFv(f, "transform", live(f.src), live(M));
	}
	yield* g.srcCall(f, "add_atom_colour", live(f.args[1]), 4);
	return f.dot;
}, true, { args: ["mapload", "main", "type", "e_name", "rotation", "alt_icon"] });

rt.type(11706, "/obj/effect/decal/cleanable/crayon/gang", "/obj/effect/decal/cleanable/crayon", {
	gang: null,
	user_mind: null,
	territory: null,
	layer: 3.6,
	do_icon_rotate: 0,
});

// /obj/effect/decal/cleanable/crayon/gang/proc/Initialize  (code/game/objects/effects/decals/crayon.dm:37)  may sleep
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/Initialize", function* Initialize(f: Frame, mapload: Value, G: Value, e_name: Value, rotation: Value, user: Value) {
	let newcolor: Value = null;
	f.vars = () => [mapload, G, e_name, rotation, user, newcolor];
	if (live(e_name) === null) {
		e_name = "gang tag";
	}
	if (live(rotation) === null) {
		rotation = 0;
	}
	if ((!truthy(rt.sv(f, "type")) || !truthy(live(G)))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	rt.setSv(f, "user_mind", rt.fv(f, "mind", live(user)));
	rt.setSv(f, "territory", (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])));
	rt.setSv(f, "gang", live(G));
	newcolor = rt.fv(f, "color_hex", live(G));
	rt.setSv(f, "icon_state", rt.fv(f, "name", live(G)));
	(rt.modField(f, live(G), "territory_new", rt.alist(f, [rt.fv(f, "type", rt.sv(f, "territory")), rt.fv(f, "name", rt.sv(f, "territory"))]), rt.bitOr));
	yield* g.srcCall(f, "set_mind_owner", rt.sv(f, "user_mind"));
	yield* g.callSuper(f, [live(mapload), live(newcolor), rt.sv(f, "icon_state"), live(e_name), live(rotation)]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/crayon/gang/proc/set_mind_owner  (code/game/objects/effects/decals/crayon.dm:50)
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/set_mind_owner", function set_mind_owner(f: Frame, mind: Value) {
	if (((truthy((rt.istype(rt.sv(f, "user_mind"), T("/datum/mind")) ? 1 : 0)) && truthy((rt.istype(rt.sv(f, "gang"), T("/datum/gang")) ? 1 : 0))) && truthy((rt.istype(rt.index(rt.fv(f, "tags_by_mind", rt.sv(f, "gang")), rt.sv(f, "user_mind")), T("/list")) ? 1 : 0)))) {
		(rt.modAt(rt.fv(f, "tags_by_mind", rt.sv(f, "gang")), rt.sv(f, "user_mind"), live(f.src), subtract));
	}
	if (!truthy((rt.istype(live(mind), T("/datum/mind")) ? 1 : 0))) return f.dot;
	if (!truthy((rt.istype(rt.index(rt.fv(f, "tags_by_mind", rt.sv(f, "gang")), live(mind)), T("/list")) ? 1 : 0))) {
		rt.setAt(rt.fv(f, "tags_by_mind", rt.sv(f, "gang")), live(mind), rt.list());
	}
	rt.modAt(rt.fv(f, "tags_by_mind", rt.sv(f, "gang")), live(mind), live(f.src), add);
	rt.setSv(f, "user_mind", live(mind));
	return f.dot;
});

// /obj/effect/decal/cleanable/crayon/gang/proc/Destroy  (code/game/objects/effects/decals/crayon.dm:60)  may sleep
rt.def("/obj/effect/decal/cleanable/crayon/gang/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "gang"))) {
		(rt.modField(f, rt.sv(f, "gang"), "territory", rt.fv(f, "type", rt.sv(f, "territory")), subtract));
		yield* g.srcCall(f, "set_mind_owner", null);
		(rt.modField(f, rt.sv(f, "gang"), "territory_new", rt.fv(f, "type", rt.sv(f, "territory")), subtract));
		(rt.modField(f, rt.sv(f, "gang"), "territory_lost", rt.alist(f, [rt.fv(f, "type", rt.sv(f, "territory")), rt.fv(f, "name", rt.sv(f, "territory"))]), rt.bitOr));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
