// From code/game/objects/items/weapons/storage/toolbox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5588, "/obj/item/weapon/storage/toolbox", "/obj/item/weapon/storage", {
	latches: "single_latch",
	has_latches: 1,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "toolbox",
	desc: "Danger. Very robust.",
	icon_state: "red",
	item_state: "toolbox_red",
	force: 12,
	throwforce: 12,
	w_class: 4,
	materials: null,
	origin_tech: "combat=1;engineering=1",
	attack_verb: null,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
});

// /obj/item/weapon/storage/toolbox/proc/<init>  (code/game/objects/items/weapons/storage/toolbox.dm:12)
rt.def("/obj/item/weapon/storage/toolbox/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 500]));
	$0 = $0;
	rt.setSv(f, "attack_verb", rt.list("robusted"));
	return f.dot;
});

// /obj/item/weapon/storage/toolbox/proc/Initialize  (code/game/objects/items/weapons/storage/toolbox.dm:20)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "has_latches"))) {
		if (truthy(rt.op(f, "Prob", [], [10]))) {
			rt.setSv(f, "latches", "double_latch");
			if (truthy(rt.op(f, "Prob", [], [1]))) {
				rt.setSv(f, "latches", "triple_latch");
			}
		}
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/storage/toolbox/proc/update_icon  (code/game/objects/items/weapons/storage/toolbox.dm:29)
rt.def("/obj/item/weapon/storage/toolbox/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "has_latches"))) return f.dot;
	rt.callSrc(f, "add_overlay", [rt.sv(f, "latches")]);
	return f.dot;
});

// /obj/item/weapon/storage/toolbox/proc/suicide_act  (code/game/objects/items/weapons/storage/toolbox.dm:36)
rt.def("/obj/item/weapon/storage/toolbox/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ robusts ＀self with ＀! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src), rt.callName(f, live(user), "p_theyre", [])])]);
	return 1;
});

rt.type(5589, "/obj/item/weapon/storage/toolbox/emergency", "/obj/item/weapon/storage/toolbox", {
	name: "emergency toolbox",
	icon_state: "red",
	item_state: "toolbox_red",
});

// /obj/item/weapon/storage/toolbox/emergency/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:45)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/emergency/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.new_(f, T("/obj/item/weapon/crowbar/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/mini"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/extinguisher/mini"), [live(f.src)]);
	$0 = (yield* g.call(f, P("/proc/rand"), null, [1, 3]));
	if ($0 === 1) {
		yield* g.new_(f, T("/obj/item/device/flashlight"), [live(f.src)]);
	} else if ($0 === 2) {
		yield* g.new_(f, T("/obj/item/device/flashlight/glowstick"), [live(f.src)]);
	} else if ($0 === 3) {
		yield* g.new_(f, T("/obj/item/device/flashlight/flare"), [live(f.src)]);
	}
	yield* g.new_(f, T("/obj/item/device/radio/off"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5591, "/obj/item/weapon/storage/toolbox/mechanical", "/obj/item/weapon/storage/toolbox", {
	name: "mechanical toolbox",
	icon_state: "blue",
	item_state: "toolbox_blue",
});

// /obj/item/weapon/storage/toolbox/mechanical/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:68)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/mechanical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/analyzer"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5593, "/obj/item/weapon/storage/toolbox/electrical", "/obj/item/weapon/storage/toolbox", {
	name: "electrical toolbox",
	icon_state: "yellow",
	item_state: "toolbox_yellow",
});

// /obj/item/weapon/storage/toolbox/electrical/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:86)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/electrical/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let pickedcolor: Value = null;
	f.vars = () => [pickedcolor];
	pickedcolor = rt.op(f, "PickUnweighted", [8], ["red", "yellow", "green", "blue", "pink", "orange", "cyan", "white"]);
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/t_scanner"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, live(pickedcolor)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, live(pickedcolor)]);
	if (truthy(rt.op(f, "Prob", [], [5]))) {
		yield* g.new_(f, T("/obj/item/clothing/gloves/color/yellow"), [live(f.src)]);
	} else {
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, live(pickedcolor)]);
	}
	return f.dot;
}, true);

rt.type(5594, "/obj/item/weapon/storage/toolbox/syndicate", "/obj/item/weapon/storage/toolbox", {
	silent: 1,
	name: "suspicious looking toolbox",
	icon_state: "syndicate",
	item_state: "toolbox_syndi",
	origin_tech: "combat=2;syndicate=1;engineering=2",
	force: 15,
	throwforce: 18,
});

// /obj/item/weapon/storage/toolbox/syndicate/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:108)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/syndicate/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/screwdriver/nuke"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/largetank"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src), "red"]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/clothing/gloves/combat"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5595, "/obj/item/weapon/storage/toolbox/drone", "/obj/item/weapon/storage/toolbox", {
	name: "mechanical toolbox",
	icon_state: "blue",
	item_state: "toolbox_blue",
});

// /obj/item/weapon/storage/toolbox/drone/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:122)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/drone/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let pickedcolor: Value = null;
	f.vars = () => [pickedcolor];
	pickedcolor = rt.op(f, "PickUnweighted", [8], ["red", "yellow", "green", "blue", "pink", "orange", "cyan", "white"]);
	yield* g.new_(f, T("/obj/item/weapon/screwdriver"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil"), [live(f.src), 30, live(pickedcolor)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/device/multitool"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5597, "/obj/item/weapon/storage/toolbox/brass/prefilled", "/obj/item/weapon/storage/toolbox/brass", {});

// /obj/item/weapon/storage/toolbox/brass/prefilled/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:146)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/brass/prefilled/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, rt.sv(f, "fabricator_type"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/screwdriver/brass"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wirecutters/brass"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/wrench/brass"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar/brass"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/weldingtool/experimental/brass"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5598, "/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar", "/obj/item/weapon/storage/toolbox/brass/prefilled", {
	slab_type: rt.typePath("/obj/item/clockwork/slab"),
});

// /obj/item/weapon/storage/toolbox/brass/prefilled/ratvar/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:157)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/brass/prefilled/ratvar/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.new_(f, rt.sv(f, "slab_type"), [live(f.src)]);
	return f.dot;
}, true);

rt.type(5600, "/obj/item/weapon/storage/toolbox/artistic", "/obj/item/weapon/storage/toolbox", {
	max_combined_w_class: 20,
	storage_slots: 10,
	name: "artistic toolbox",
	desc: "A toolbox painted bright green. Why anyone would store art supplies in a toolbox is beyond you, but it has plenty of extra space.",
	icon_state: "green",
	item_state: "artistic_toolbox",
	w_class: 6,
});

// /obj/item/weapon/storage/toolbox/artistic/proc/PopulateContents  (code/game/objects/items/weapons/storage/toolbox.dm:175)  may sleep
rt.def("/obj/item/weapon/storage/toolbox/artistic/proc/PopulateContents", function* PopulateContents(f: Frame) {
	yield* g.new_(f, T("/obj/item/weapon/storage/crayons"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/weapon/crowbar"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/red"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/yellow"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/blue"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/green"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/pink"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/orange"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/cyan"), [live(f.src)]);
	yield* g.new_(f, T("/obj/item/stack/cable_coil/white"), [live(f.src)]);
	return f.dot;
}, true);
