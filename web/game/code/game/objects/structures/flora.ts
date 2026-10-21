// From code/game/objects/structures/flora.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12471, "/obj/structure/flora/tree", "/obj/structure/flora", {
	cut: 0,
	log_amount: 10,
	name: "tree",
	density: 1,
	pixel_x: -16,
	layer: 5,
});

// /obj/structure/flora/tree/proc/attackby  (code/game/objects/structures/flora.dm:17)  may sleep
rt.def("/obj/structure/flora/tree/proc/attackby", function* attackby(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	if (((!truthy(rt.sv(f, "cut")) && truthy(rt.sv(f, "log_amount"))) && !truthy((rt.isIn(f, 128, rt.sv(f, "flags")) ? 1 : 0)))) {
		if ((truthy(rt.fv(f, "sharpness", live(f.args[0]))) && rt.gt(rt.fv(f, "force", live(f.args[0])), 0))) {
			if (truthy(rt.fv(f, "hitsound", live(f.args[0])))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.fv(f, "hitsound", live(f.args[0])), 100, 0, 0]);
			}
			yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ begins to cut down ＀ with ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You begin to cut down ＀ with ＀.</span>", [live(f.src), live(f.args[0])]), "You hear the sound of sawing."]);
			if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, divide(1000, rt.fv(f, "force", live(f.args[0]))), "target", live(f.args[1])], rt.Args.Named)))) {
				if (truthy(rt.sv(f, "cut"))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='notice'>＀ fells ＀ with the ＀.</span>", [live(f.args[1]), live(f.src), live(f.args[0])]), fmt("<span class='notice'>You fell ＀ with the ＀.</span>", [live(f.src), live(f.args[0])]), "You hear the sound of a tree falling."]);
				yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), rt.rsc("sound/effects/meteorimpact.ogg"), 100, 0, 0]);
				rt.setSv(f, "icon", rt.rsc("icons/obj/flora/pinetrees.dmi"));
				rt.setSv(f, "icon_state", "tree_stump");
				rt.setSv(f, "density", 0);
				rt.setSv(f, "pixel_x", -16);
				rt.modSrcVar(f, "name", " stump", add);
				rt.setSv(f, "cut", 1);
				i = null;
				rt.forRange(f, 0, 1, rt.sv(f, "log_amount"), 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					yield* g.new_(f, T("/obj/item/weapon/grown/log/tree"), [rt.getStep(f, live(f.src), 0)]);
				}
				rt.endFor(f, 0);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(12472, "/obj/structure/flora/tree/pine", "/obj/structure/flora/tree", {
	name: "pine tree",
	icon: rt.rsc("icons/obj/flora/pinetrees.dmi"),
	icon_state: "pine_1",
});

// /obj/structure/flora/tree/pine/proc/Initialize  (code/game/objects/structures/flora.dm:48)
rt.def("/obj/structure/flora/tree/pine/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("pine_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12473, "/obj/structure/flora/tree/pine/xmas", "/obj/structure/flora/tree/pine", {
	name: "xmas tree",
	icon_state: "pine_c",
});

// /obj/structure/flora/tree/pine/xmas/proc/Initialize  (code/game/objects/structures/flora.dm:56)
rt.def("/obj/structure/flora/tree/pine/xmas/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", "pine_c");
	return f.dot;
});

rt.type(12475, "/obj/structure/flora/tree/palm", "/obj/structure/flora/tree", {
	icon: rt.rsc("icons/misc/beach2.dmi"),
	icon_state: "palm1",
});

// /obj/structure/flora/tree/palm/proc/Initialize  (code/game/objects/structures/flora.dm:68)
rt.def("/obj/structure/flora/tree/palm/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [2], ["palm1", "palm2"]));
	rt.setSv(f, "pixel_x", 0);
	return f.dot;
});

rt.type(12474, "/obj/structure/flora/tree/dead", "/obj/structure/flora/tree", {
	icon: rt.rsc("icons/obj/flora/deadtrees.dmi"),
	icon_state: "tree_1",
});

// /obj/structure/flora/tree/dead/proc/Initialize  (code/game/objects/structures/flora.dm:79)
rt.def("/obj/structure/flora/tree/dead/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("tree_＀", [rt.call(f, P("/proc/rand"), null, [1, 6])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12476, "/obj/structure/flora/tree/jungle", "/obj/structure/flora/tree", {
	name: "tree",
	icon_state: "tree",
	desc: "It's seriously hampering your view of the jungle.",
	icon: rt.rsc("icons/obj/flora/jungletrees.dmi"),
	pixel_x: -48,
	pixel_y: -20,
});

// /obj/structure/flora/tree/jungle/proc/Initialize  (code/game/objects/structures/flora.dm:91)
rt.def("/obj/structure/flora/tree/jungle/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 6])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12479, "/obj/structure/flora/grass/brown", "/obj/structure/flora/grass", {
	icon_state: "snowgrass1bb",
});

// /obj/structure/flora/grass/brown/proc/Initialize  (code/game/objects/structures/flora.dm:109)
rt.def("/obj/structure/flora/grass/brown/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("snowgrass＀bb", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12480, "/obj/structure/flora/grass/green", "/obj/structure/flora/grass", {
	icon_state: "snowgrass1gb",
});

// /obj/structure/flora/grass/green/proc/Initialize  (code/game/objects/structures/flora.dm:117)
rt.def("/obj/structure/flora/grass/green/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("snowgrass＀gb", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12481, "/obj/structure/flora/grass/both", "/obj/structure/flora/grass", {
	icon_state: "snowgrassall1",
});

// /obj/structure/flora/grass/both/proc/Initialize  (code/game/objects/structures/flora.dm:124)
rt.def("/obj/structure/flora/grass/both/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("snowgrassall＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12484, "/obj/structure/flora/bush", "/obj/structure/flora", {
	anchored: 1,
	name: "bush",
	icon: rt.rsc("icons/obj/flora/snowflora.dmi"),
	icon_state: "snowbush1",
});

// /obj/structure/flora/bush/proc/Initialize  (code/game/objects/structures/flora.dm:136)
rt.def("/obj/structure/flora/bush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("snowbush＀", [rt.call(f, P("/proc/rand"), null, [1, 6])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12485, "/obj/structure/flora/ausbushes", "/obj/structure/flora", {
	name: "bush",
	icon: rt.rsc("icons/obj/flora/ausflora.dmi"),
	icon_state: "firstbush_1",
});

// /obj/structure/flora/ausbushes/proc/Initialize  (code/game/objects/structures/flora.dm:147)
rt.def("/obj/structure/flora/ausbushes/proc/Initialize", function Initialize(f: Frame) {
	if (isEqual(rt.sv(f, "icon_state"), "firstbush_1")) {
		rt.setSv(f, "icon_state", fmt("firstbush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12486, "/obj/structure/flora/ausbushes/reedbush", "/obj/structure/flora/ausbushes", {
	icon_state: "reedbush_1",
});

// /obj/structure/flora/ausbushes/reedbush/proc/Initialize  (code/game/objects/structures/flora.dm:155)
rt.def("/obj/structure/flora/ausbushes/reedbush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("reedbush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12487, "/obj/structure/flora/ausbushes/leafybush", "/obj/structure/flora/ausbushes", {
	icon_state: "leafybush_1",
});

// /obj/structure/flora/ausbushes/leafybush/proc/Initialize  (code/game/objects/structures/flora.dm:162)
rt.def("/obj/structure/flora/ausbushes/leafybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("leafybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12488, "/obj/structure/flora/ausbushes/palebush", "/obj/structure/flora/ausbushes", {
	icon_state: "palebush_1",
});

// /obj/structure/flora/ausbushes/palebush/proc/Initialize  (code/game/objects/structures/flora.dm:169)
rt.def("/obj/structure/flora/ausbushes/palebush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("palebush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12489, "/obj/structure/flora/ausbushes/stalkybush", "/obj/structure/flora/ausbushes", {
	icon_state: "stalkybush_1",
});

// /obj/structure/flora/ausbushes/stalkybush/proc/Initialize  (code/game/objects/structures/flora.dm:176)
rt.def("/obj/structure/flora/ausbushes/stalkybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("stalkybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12490, "/obj/structure/flora/ausbushes/grassybush", "/obj/structure/flora/ausbushes", {
	icon_state: "grassybush_1",
});

// /obj/structure/flora/ausbushes/grassybush/proc/Initialize  (code/game/objects/structures/flora.dm:183)
rt.def("/obj/structure/flora/ausbushes/grassybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("grassybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12491, "/obj/structure/flora/ausbushes/fernybush", "/obj/structure/flora/ausbushes", {
	icon_state: "fernybush_1",
});

// /obj/structure/flora/ausbushes/fernybush/proc/Initialize  (code/game/objects/structures/flora.dm:190)
rt.def("/obj/structure/flora/ausbushes/fernybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("fernybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12492, "/obj/structure/flora/ausbushes/sunnybush", "/obj/structure/flora/ausbushes", {
	icon_state: "sunnybush_1",
});

// /obj/structure/flora/ausbushes/sunnybush/proc/Initialize  (code/game/objects/structures/flora.dm:197)
rt.def("/obj/structure/flora/ausbushes/sunnybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("sunnybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12493, "/obj/structure/flora/ausbushes/genericbush", "/obj/structure/flora/ausbushes", {
	icon_state: "genericbush_1",
});

// /obj/structure/flora/ausbushes/genericbush/proc/Initialize  (code/game/objects/structures/flora.dm:204)
rt.def("/obj/structure/flora/ausbushes/genericbush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("genericbush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12494, "/obj/structure/flora/ausbushes/pointybush", "/obj/structure/flora/ausbushes", {
	icon_state: "pointybush_1",
});

// /obj/structure/flora/ausbushes/pointybush/proc/Initialize  (code/game/objects/structures/flora.dm:211)
rt.def("/obj/structure/flora/ausbushes/pointybush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("pointybush_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12495, "/obj/structure/flora/ausbushes/lavendergrass", "/obj/structure/flora/ausbushes", {
	icon_state: "lavendergrass_1",
});

// /obj/structure/flora/ausbushes/lavendergrass/proc/Initialize  (code/game/objects/structures/flora.dm:218)
rt.def("/obj/structure/flora/ausbushes/lavendergrass/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("lavendergrass_＀", [rt.call(f, P("/proc/rand"), null, [1, 4])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12496, "/obj/structure/flora/ausbushes/ywflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "ywflowers_1",
});

// /obj/structure/flora/ausbushes/ywflowers/proc/Initialize  (code/game/objects/structures/flora.dm:225)
rt.def("/obj/structure/flora/ausbushes/ywflowers/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("ywflowers_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12497, "/obj/structure/flora/ausbushes/brflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "brflowers_1",
});

// /obj/structure/flora/ausbushes/brflowers/proc/Initialize  (code/game/objects/structures/flora.dm:232)
rt.def("/obj/structure/flora/ausbushes/brflowers/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("brflowers_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12498, "/obj/structure/flora/ausbushes/ppflowers", "/obj/structure/flora/ausbushes", {
	icon_state: "ppflowers_1",
});

// /obj/structure/flora/ausbushes/ppflowers/proc/Initialize  (code/game/objects/structures/flora.dm:239)
rt.def("/obj/structure/flora/ausbushes/ppflowers/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("ppflowers_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12499, "/obj/structure/flora/ausbushes/sparsegrass", "/obj/structure/flora/ausbushes", {
	icon_state: "sparsegrass_1",
});

// /obj/structure/flora/ausbushes/sparsegrass/proc/Initialize  (code/game/objects/structures/flora.dm:246)
rt.def("/obj/structure/flora/ausbushes/sparsegrass/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("sparsegrass_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12500, "/obj/structure/flora/ausbushes/fullgrass", "/obj/structure/flora/ausbushes", {
	icon_state: "fullgrass_1",
});

// /obj/structure/flora/ausbushes/fullgrass/proc/Initialize  (code/game/objects/structures/flora.dm:253)
rt.def("/obj/structure/flora/ausbushes/fullgrass/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("fullgrass_＀", [rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(5628, "/obj/item/weapon/twohanded/required/kirbyplants", "/obj/item/weapon/twohanded/required", {
	throw_speed: 2,
	throw_range: 4,
	name: "potted plant",
	icon: rt.rsc("icons/obj/flora/plants.dmi"),
	icon_state: "plant-01",
	layer: 4.1,
	w_class: 5,
	force: 10,
	throwforce: 13,
});

// /obj/item/weapon/twohanded/required/kirbyplants/proc/equipped  (code/game/objects/structures/flora.dm:268)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/proc/equipped", function* equipped(f: Frame) {
	let I: Value = null;
	f.vars = () => [I];
	rt.setFv(f, "override", (I = (yield* g.call(f, P("/proc/image"), null, ["icon", rt.rsc("icons/obj/flora/plants.dmi"), "icon_state", rt.fv(f, "icon_state", live(f.src)), "loc", live(f.args[0])], rt.Args.Named))), 1);
	yield* g.srcCall(f, "add_alt_appearance", T("/datum/atom_hud/alternate_appearance/basic/everyone"), "sneaking_mission", live(I));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/twohanded/required/kirbyplants/proc/dropped  (code/game/objects/structures/flora.dm:274)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, live(f.args[0]), "remove_alt_appearance", ["sneaking_mission"]);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5629, "/obj/item/weapon/twohanded/required/kirbyplants/random", "/obj/item/weapon/twohanded/required/kirbyplants", {}, { global: { states: 729 } });

// /obj/item/weapon/twohanded/required/kirbyplants/random/proc/Initialize  (code/game/objects/structures/flora.dm:281)  may sleep
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/random/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.gl("states"))) {
		yield* g.srcCall(f, "generate_states");
	}
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [1], [rt.gl("states")]));
	return f.dot;
}, true);

// /obj/item/weapon/twohanded/required/kirbyplants/random/proc/generate_states  (code/game/objects/structures/flora.dm:287)
rt.def("/obj/item/weapon/twohanded/required/kirbyplants/random/proc/generate_states", function generate_states(f: Frame) {
	let i: Value = null, number: Value = null;
	let $e: any;
	f.vars = () => [i, number, $e];
	rt.setGl("states", rt.list());
	i = null;
	rt.forRange(f, 0, 1, 25, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		number = null;
		if (rt.lt(live(i), 10)) {
			number = fmt("0＀", [live(i)]);
		} else {
			number = fmt("＀", [live(i)]);
		}
		rt.modGl("states", fmt("plant-＀", [live(number)]), add);
	}
	rt.endFor(f, 0);
	rt.modGl("states", "applebush", add);
	return f.dot;
});

rt.type(12501, "/obj/structure/flora/rock", "/obj/structure/flora", {
	icon_state: "basalt",
	desc: "A volcanic rock",
	icon: rt.rsc("icons/obj/flora/rocks.dmi"),
	resistance_flags: 2,
	density: 1,
});

// /obj/structure/flora/rock/proc/Initialize  (code/game/objects/structures/flora.dm:315)
rt.def("/obj/structure/flora/rock/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 3])]));
	return f.dot;
});

rt.type(12502, "/obj/structure/flora/rock/pile", "/obj/structure/flora/rock", {
	icon_state: "lavarocks",
	desc: "A pile of rocks",
});

// /obj/structure/flora/rock/pile/proc/Initialize  (code/game/objects/structures/flora.dm:323)
rt.def("/obj/structure/flora/rock/pile/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 3])]));
	return f.dot;
});

rt.type(12482, "/obj/structure/flora/grass/jungle", "/obj/structure/flora/grass", {
	name: "jungle grass",
	desc: "Thick alien flora.",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	icon_state: "grassa",
});

// /obj/structure/flora/grass/jungle/proc/Initialize  (code/game/objects/structures/flora.dm:336)
rt.def("/obj/structure/flora/grass/jungle/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 5])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12505, "/obj/structure/flora/rock/jungle", "/obj/structure/flora/rock", {
	icon_state: "rock",
	desc: "A pile of rocks.",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	density: 0,
});

// /obj/structure/flora/rock/jungle/proc/Initialize  (code/game/objects/structures/flora.dm:352)
rt.def("/obj/structure/flora/rock/jungle/proc/Initialize", function Initialize(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 5])]));
	return f.dot;
});

rt.type(12507, "/obj/structure/flora/junglebush", "/obj/structure/flora", {
	name: "bush",
	icon: rt.rsc("icons/obj/flora/jungleflora.dmi"),
	icon_state: "busha",
});

// /obj/structure/flora/junglebush/proc/Initialize  (code/game/objects/structures/flora.dm:364)
rt.def("/obj/structure/flora/junglebush/proc/Initialize", function Initialize(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.sv(f, "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 3])]));
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

rt.type(12503, "/obj/structure/flora/rock/pile/largejungle", "/obj/structure/flora/rock/pile", {
	name: "rocks",
	icon_state: "rocks",
	icon: rt.rsc("icons/obj/flora/largejungleflora.dmi"),
	density: 0,
	pixel_x: -16,
	pixel_y: -16,
});

// /obj/structure/flora/rock/pile/largejungle/proc/Initialize  (code/game/objects/structures/flora.dm:389)
rt.def("/obj/structure/flora/rock/pile/largejungle/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.call(f, P("/proc/rand"), null, [1, 3])]));
	return f.dot;
});
