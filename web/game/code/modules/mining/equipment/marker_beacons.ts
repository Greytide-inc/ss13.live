// From code/modules/mining/equipment/marker_beacons.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/controller/global_vars/proc/InitGlobalmarker_beacon_colors  (code/modules/mining/equipment/marker_beacons.dm:2)
rt.def("/datum/controller/global_vars/proc/InitGlobalmarker_beacon_colors", function InitGlobalmarker_beacon_colors(f: Frame) {
	rt.setGl("marker_beacon_colors", rt.alist(f, ["Random", 0, "Burgundy", "#FA644B", "Bronze", "#FA9632", "Yellow", "#E1E17D", "Lime", "#AFC84B", "Olive", "#64C864", "Jade", "#7DE1AF", "Teal", "#40CEFF", "Cerulean", "#6496FA", "Indigo", "#6496FA", "Purple", "#952CF4", "Violet", "#9B51FF", "Fuchsia", "#E17DE1"]));
	rt.modSrcVar(f, "gvars_datum_init_order", "marker_beacon_colors", add);
	return f.dot;
});

rt.type(9111, "/obj/item/stack/marker_beacon", "/obj/item/stack", {
	picked_color: "random",
	singular_name: "marker beacon",
	merge_type: rt.typePath("/obj/item/stack/marker_beacon"),
	max_amount: 100,
	novariants: 1,
	name: "marker beacon",
	desc: "Prism-brand path illumination devices. Used by miners to mark paths and warn of danger.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "marker",
});

// /obj/item/stack/marker_beacon/proc/Initialize  (code/modules/mining/equipment/marker_beacons.dm:35)  may sleep
rt.def("/obj/item/stack/marker_beacon/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/item/stack/marker_beacon/proc/examine  (code/modules/mining/equipment/marker_beacons.dm:39)
rt.def("/obj/item/stack/marker_beacon/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Use in-hand to place a ＀.</span>", [rt.sv(f, "singular_name")])]);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Alt-click to select a color. Current color is ＀.</span>", [rt.sv(f, "picked_color")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/stack/marker_beacon/proc/update_icon  (code/modules/mining/equipment/marker_beacons.dm:44)
rt.def("/obj/item/stack/marker_beacon/proc/update_icon", function update_icon(f: Frame) {
	rt.setSv(f, "icon_state", fmt("＀＀", [rt.initial(f, live(f.src), "icon_state"), rt.call(f, P("/proc/lowertext"), null, [rt.sv(f, "picked_color")])]));
	return f.dot;
});

// /obj/item/stack/marker_beacon/proc/attack_self  (code/modules/mining/equipment/marker_beacons.dm:47)  may sleep
rt.def("/obj/item/stack/marker_beacon/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let M: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, M, $0, $1];
	if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(user))])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You need more space to place a ＀ here.</span>", [rt.sv(f, "singular_name")])]);
		return live(f.dot);
	}
	if (truthy(rt.locateIn(f, T("/obj/structure/marker_beacon"), rt.fv(f, "loc", live(user))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>There is already a ＀ here.</span>", [rt.sv(f, "singular_name")])]);
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "use", 1)))) return f.dot;
	$0 = live(user);
	if (truthy(rt.sv(f, "amount"))) {
		$1 = "a";
	} else {
		$1 = "the";
	}
	yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You activate and anchor ＀ ＀ in place.</span>", [$1, rt.sv(f, "singular_name")])]);
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/machines/click.ogg"), 50, 1]);
	yield* g.srcCall(f, "transfer_fingerprints_to", (M = (yield* g.new_(f, T("/obj/structure/marker_beacon"), [rt.fv(f, "loc", live(user)), rt.sv(f, "picked_color")]))));
	return f.dot;
}, true);

// /obj/item/stack/marker_beacon/proc/AltClick  (code/modules/mining/equipment/marker_beacons.dm:60)  may sleep
rt.def("/obj/item/stack/marker_beacon/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let input_color: Value = null;
	f.vars = () => [user, input_color];
	if ((truthy((yield* g.callName(f, live(user), "incapacitated", []))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1)) {
		return live(f.dot);
	}
	input_color = (yield* g.op(f, "Prompt", [1], [null, "Beacon Color", "Choose a color.", live(user), rt.gl("marker_beacon_colors")]));
	if (((truthy((yield* g.callName(f, live(user), "incapacitated", []))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1))) {
		return live(f.dot);
	}
	if (!truthy(live(input_color))) return f.dot;
	rt.setSv(f, "picked_color", live(input_color));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(12957, "/obj/structure/marker_beacon", "/obj/structure", {
	remove_speed: 15,
	picked_color: null,
	anchored: 1,
	light_range: 2,
	light_power: 3,
	name: "marker beacon",
	desc: "A Prism-brand path illumination device. It is anchored in place and glowing steadily.",
	icon: rt.rsc("icons/obj/lighting.dmi"),
	icon_state: "marker",
	layer: 2.6,
	armor: null,
	obj_integrity: 50,
	max_integrity: 50,
});

// /obj/structure/marker_beacon/proc/<init>  (code/modules/mining/equipment/marker_beacons.dm:78)
rt.def("/obj/structure/marker_beacon/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "armor", rt.alist(f, ["melee", 50, "bullet", 75, "laser", 75, "energy", 75, "bomb", 25, "bio", 100, "rad", 100, "fire", 25, "acid", 0]));
	return f.dot;
});

// /obj/structure/marker_beacon/proc/Initialize  (code/modules/mining/equipment/marker_beacons.dm:88)
rt.def("/obj/structure/marker_beacon/proc/Initialize", function Initialize(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "picked_color", live(f.args[1]));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { args: ["mapload", "set_color"] });

// /obj/structure/marker_beacon/proc/deconstruct  (code/modules/mining/equipment/marker_beacons.dm:93)  may sleep
rt.def("/obj/structure/marker_beacon/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let M: Value = null;
	f.vars = () => [disassembled, M];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		rt.setFv(f, "picked_color", (M = (yield* g.new_(f, T("/obj/item/stack/marker_beacon"), [rt.sv(f, "loc")]))), rt.sv(f, "picked_color"));
		yield* g.callName(f, live(M), "update_icon", []);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/marker_beacon/proc/examine  (code/modules/mining/equipment/marker_beacons.dm:100)
rt.def("/obj/structure/marker_beacon/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>Alt-click to select a color. Current color is ＀.</span>", [rt.sv(f, "picked_color")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/structure/marker_beacon/proc/update_icon  (code/modules/mining/equipment/marker_beacons.dm:104)
rt.def("/obj/structure/marker_beacon/proc/update_icon", function update_icon(f: Frame) {
	while (!truthy(rt.sv(f, "picked_color")) || !truthy(rt.index(rt.gl("marker_beacon_colors"), rt.sv(f, "picked_color")))) {
		rt.setSv(f, "picked_color", rt.op(f, "PickUnweighted", [1], [rt.gl("marker_beacon_colors")]));
	}
	rt.setSv(f, "icon_state", fmt("＀＀-on", [rt.initial(f, live(f.src), "icon_state"), rt.call(f, P("/proc/lowertext"), null, [rt.sv(f, "picked_color")])]));
	rt.callSrc(f, "set_light", [rt.sv(f, "light_range"), rt.sv(f, "light_power"), rt.index(rt.gl("marker_beacon_colors"), rt.sv(f, "picked_color"))]);
	return f.dot;
});

// /obj/structure/marker_beacon/proc/attack_hand  (code/modules/mining/equipment/marker_beacons.dm:110)  may sleep
rt.def("/obj/structure/marker_beacon/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let M: Value = null;
	f.vars = () => [user, M];
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You start picking ＀ up...</span>", [live(f.src)])]);
	if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "remove_speed"), "target", live(f.src)], rt.Args.Named)))) return f.dot;
	rt.setFv(f, "picked_color", (M = (yield* g.new_(f, T("/obj/item/stack/marker_beacon"), [rt.sv(f, "loc")]))), rt.sv(f, "picked_color"));
	yield* g.callName(f, live(M), "update_icon", []);
	yield* g.srcCall(f, "transfer_fingerprints_to", live(M));
	if (!truthy((yield* g.callName(f, live(user), "put_in_hands", [live(M), 1])))) return f.dot;
	yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/structure/marker_beacon/proc/attackby  (code/modules/mining/equipment/marker_beacons.dm:121)  may sleep
rt.def("/obj/structure/marker_beacon/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/marker_beacon")) ? 1 : 0))) {
		M = live(f.args[0]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start picking ＀ up...</span>", [live(f.src)])]);
		if ((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, rt.sv(f, "remove_speed"), "target", live(f.src)], rt.Args.Named))) && rt.le(add(rt.fv(f, "amount", live(M)), 1), rt.fv(f, "max_amount", live(M))))) {
			yield* g.callName(f, live(M), "add", [1]);
			yield* g.call(f, P("/proc/playsound"), null, [live(f.src), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/marker_beacon/proc/AltClick  (code/modules/mining/equipment/marker_beacons.dm:132)  may sleep
rt.def("/obj/structure/marker_beacon/proc/AltClick", function* AltClick(f: Frame) {
	let input_color: Value = null;
	f.vars = () => [input_color];
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", []))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
		return live(f.dot);
	}
	input_color = (yield* g.op(f, "Prompt", [1], [null, "Beacon Color", "Choose a color.", live(f.args[0]), rt.gl("marker_beacon_colors")]));
	if (((truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", []))) || !truthy((rt.istype(live(f.args[0]), T("/mob/living")) ? 1 : 0))) || !rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1))) {
		return live(f.dot);
	}
	if (!truthy(live(input_color))) return f.dot;
	rt.setSv(f, "picked_color", live(input_color));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["user"] });
