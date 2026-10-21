// From code/game/objects/items/stacks/tiles/tile_types.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8969, "/obj/item/stack/tile", "/obj/item/stack", {
	turf_type: null,
	mineralType: null,
	throw_speed: 3,
	throw_range: 7,
	name: "broken tile",
	singular_name: "broken tile",
	desc: "A broken tile. This should not exist.",
	icon: rt.rsc("icons/obj/tiles.dmi"),
	w_class: 3,
	force: 1,
	throwforce: 1,
	max_amount: 60,
	origin_tech: "materials=1",
	novariants: 1,
});

// /obj/item/stack/tile/proc/Initialize  (code/game/objects/items/stacks/tiles/tile_types.dm:18)  may sleep
rt.def("/obj/item/stack/tile/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-3, 3])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-3, 3])));
	return f.dot;
}, true, { args: ["mapload", "amount"] });

// /obj/item/stack/tile/proc/attackby  (code/game/objects/items/stacks/tiles/tile_types.dm:24)  may sleep
rt.def("/obj/item/stack/tile/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, new_item: Value = null, R: Value = null, replace: Value = null, sheet_type: Value = null, new_item_2: Value = null, R_3: Value = null, replace_4: Value = null;
	f.vars = () => [WT, new_item, R, replace, sheet_type, new_item_2, R_3, replace_4];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
		WT = live(f.args[0]);
		if (rt.lt((yield* g.srcCall(f, "get_amount")), 4)) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need at least four tiles to do this!</span>"]);
			return live(f.dot);
		}
		if ((truthy((yield* g.callName(f, live(WT), "is_hot", []))) && !truthy(rt.sv(f, "mineralType")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You can not reform this!</span>"]);
			return live(f.dot);
		}
		if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
			if (isEqual(rt.sv(f, "mineralType"), "plasma")) {
				yield* g.srcCall(f, "atmos_spawn_air", "plasma=5;TEMP=1000");
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ sets the plasma tiles on fire!</span>", [rt.fv(f, "name", live(f.args[1]))]), "<span class='warning'>You set the plasma tiles on fire!</span>"]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				return live(f.dot);
			}
			if (isEqual(rt.sv(f, "mineralType"), "metal")) {
				new_item = (yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.fv(f, "loc", live(f.args[1]))]));
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaped ＀ into metal with the welding tool.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You shaped ＀ into metal with the welding tool.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
				R = live(f.src);
				f.src = null;
				replace = (isEqual((yield* g.callName(f, live(f.args[1]), "get_inactive_held_item", [])), live(R)) ? 1 : 0);
				yield* g.callName(f, live(R), "use", [4]);
				if ((!truthy(live(R)) && truthy(live(replace)))) {
					yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(new_item)]);
				}
			} else {
				sheet_type = (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/item/stack/sheet/mineral/＀", [rt.sv(f, "mineralType")])]));
				new_item_2 = (yield* g.new_(f, live(sheet_type), [rt.fv(f, "loc", live(f.args[1]))]));
				yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ shaped ＀ into a sheet with the welding tool.", [rt.fv(f, "name", live(f.args[1])), live(f.src)]), fmt("<span class='notice'>You shaped ＀ into a sheet with the welding tool.</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
				R_3 = live(f.src);
				f.src = null;
				replace_4 = (isEqual((yield* g.callName(f, live(f.args[1]), "get_inactive_held_item", [])), live(R_3)) ? 1 : 0);
				yield* g.callName(f, live(R_3), "use", [4]);
				if ((!truthy(live(R_3)) && truthy(live(replace_4)))) {
					yield* g.callName(f, live(f.args[1]), "put_in_hands", [live(new_item_2)]);
				}
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

rt.type(8970, "/obj/item/stack/tile/plasteel", "/obj/item/stack/tile", {
	flags: 64,
	name: "floor tile",
	singular_name: "floor tile",
	desc: "Those could work as a pretty decent throwing weapon.",
	icon_state: "tile",
	force: 6,
	materials: null,
	throwforce: 10,
	turf_type: rt.typePath("/turf/open/floor/plasteel"),
	mineralType: "metal",
	armor: null,
	resistance_flags: 2,
});

// /obj/item/stack/tile/plasteel/proc/<init>  (code/game/objects/items/stacks/tiles/tile_types.dm:212)
rt.def("/obj/item/stack/tile/plasteel/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 100, "acid", 70]));
	return f.dot;
});

rt.type(8971, "/obj/item/stack/tile/plasteel/cyborg", "/obj/item/stack/tile/plasteel", {
	desc: "The ground you walk on.",
	materials: null,
	is_cyborg: 1,
	cost: 125,
});

// /obj/item/stack/tile/plasteel/cyborg/proc/<init>  (code/game/objects/items/stacks/tiles/tile_types.dm:222)
rt.def("/obj/item/stack/tile/plasteel/cyborg/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.list());
	return f.dot;
});
