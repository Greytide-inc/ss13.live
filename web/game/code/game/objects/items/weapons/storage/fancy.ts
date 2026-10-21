// From code/game/objects/items/weapons/storage/fancy.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5551, "/obj/item/weapon/storage/fancy", "/obj/item/weapon/storage", {
	icon_type: "donut",
	spawn_type: null,
	fancy_open: 0,
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "donutbox6",
	name: "donut box",
	resistance_flags: 4,
});

// /obj/item/weapon/storage/fancy/proc/PopulateContents  (code/game/objects/items/weapons/storage/fancy.dm:26)  may sleep
rt.def("/obj/item/weapon/storage/fancy/proc/PopulateContents", function* PopulateContents(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, rt.sv(f, "storage_slots"), 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.new_(f, rt.sv(f, "spawn_type"), [live(f.src)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/storage/fancy/proc/update_icon  (code/game/objects/items/weapons/storage/fancy.dm:31)
rt.def("/obj/item/weapon/storage/fancy/proc/update_icon", function update_icon(f: Frame, itemremoved: Value) {
	let total_contents: Value = null;
	f.vars = () => [itemremoved, total_contents];
	if (live(itemremoved) === null) {
		itemremoved = 0;
	}
	if (truthy(rt.sv(f, "fancy_open"))) {
		total_contents = subtract(rt.getLen(f, rt.fv(f, "contents", live(f.src))), live(itemremoved));
		rt.setSv(f, "icon_state", fmt("＀box＀", [rt.sv(f, "icon_type"), live(total_contents)]));
	} else {
		rt.setSv(f, "icon_state", fmt("＀box", [rt.sv(f, "icon_type")]));
	}
	return f.dot;
});

// /obj/item/weapon/storage/fancy/proc/examine  (code/game/objects/items/weapons/storage/fancy.dm:37)
rt.def("/obj/item/weapon/storage/fancy/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "fancy_open"))) return f.dot;
	if (isEqual(rt.len(f, rt.sv(f, "contents")), 1)) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("There is one ＀ left.", [rt.fv(f, "icon_type", live(f.src))])]);
	} else {
		$0 = live(f.args[0]);
		if (rt.le(rt.len(f, rt.sv(f, "contents")), 0)) {
			$1 = "no";
		} else {
			$1 = fmt("＀", [rt.getLen(f, rt.fv(f, "contents", live(f.src)))]);
		}
		rt.call(f, P("/proc/to_chat"), null, [$0, fmt("There are ＀ ＀s left.", [$1, rt.fv(f, "icon_type", live(f.src))])]);
	}
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/storage/fancy/proc/attack_self  (code/game/objects/items/weapons/storage/fancy.dm:45)
rt.def("/obj/item/weapon/storage/fancy/proc/attack_self", function attack_self(f: Frame, user: Value) {
	rt.setSv(f, "fancy_open", (!truthy(rt.sv(f, "fancy_open")) ? 1 : 0));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/storage/fancy/proc/content_can_dump  (code/game/objects/items/weapons/storage/fancy.dm:49)  may sleep
rt.def("/obj/item/weapon/storage/fancy/proc/content_can_dump", function* content_can_dump(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(live(f.dot))) return f.dot;
	rt.setSv(f, "fancy_open", 1);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["dest_object", "user"] });

// /obj/item/weapon/storage/fancy/proc/handle_item_insertion  (code/game/objects/items/weapons/storage/fancy.dm:56)  may sleep
rt.def("/obj/item/weapon/storage/fancy/proc/handle_item_insertion", function* handle_item_insertion(f: Frame) {
	if (live(f.args[1]) === null) {
		f.args[1] = 0;
	}
	rt.setSv(f, "fancy_open", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "prevent_warning", "user"] });

// /obj/item/weapon/storage/fancy/proc/remove_from_storage  (code/game/objects/items/weapons/storage/fancy.dm:60)  may sleep
rt.def("/obj/item/weapon/storage/fancy/proc/remove_from_storage", function* remove_from_storage(f: Frame) {
	if (live(f.args[2]) === null) {
		f.args[2] = 0;
	}
	rt.setSv(f, "fancy_open", 1);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["W", "new_location", "burn"] });

rt.type(5552, "/obj/item/weapon/storage/fancy/donut_box", "/obj/item/weapon/storage/fancy", {
	icon_type: "donut",
	fancy_open: 1,
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "donutbox6",
	name: "donut box",
	storage_slots: 6,
	spawn_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/donut"),
	can_hold: null,
});

// /obj/item/weapon/storage/fancy/donut_box/proc/<init>  (code/game/objects/items/weapons/storage/fancy.dm:72)
rt.def("/obj/item/weapon/storage/fancy/donut_box/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/donut")));
	return f.dot;
});

rt.type(5553, "/obj/item/weapon/storage/fancy/egg_box", "/obj/item/weapon/storage/fancy", {
	icon_type: "egg",
	icon: rt.rsc("icons/obj/food/containers.dmi"),
	icon_state: "eggbox",
	name: "egg box",
	storage_slots: 12,
	spawn_type: rt.typePath("/obj/item/weapon/reagent_containers/food/snacks/egg"),
	can_hold: null,
});

// /obj/item/weapon/storage/fancy/egg_box/proc/<init>  (code/game/objects/items/weapons/storage/fancy.dm:86)
rt.def("/obj/item/weapon/storage/fancy/egg_box/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/reagent_containers/food/snacks/egg")));
	return f.dot;
});

rt.type(5555, "/obj/item/weapon/storage/fancy/cigarettes", "/obj/item/weapon/storage/fancy", {
	icon_type: "cigarette",
	name: "１Space Cigarettes packet",
	desc: "The most popular brand of cigarettes, sponsors of the Space Olympics.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig",
	item_state: "cigpacket",
	w_class: 1,
	throwforce: 0,
	slot_flags: 512,
	storage_slots: 6,
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/space_cigarette"),
	can_hold: null,
});

// /obj/item/weapon/storage/fancy/cigarettes/proc/<init>  (code/game/objects/items/weapons/storage/fancy.dm:122)
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/clothing/mask/cigarette"), T("/obj/item/weapon/lighter")));
	return f.dot;
});

// /obj/item/weapon/storage/fancy/cigarettes/proc/AltClick  (code/game/objects/items/weapons/storage/fancy.dm:127)  may sleep
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/AltClick", function* AltClick(f: Frame, user: Value) {
	let lighter: Value = null;
	let $e: any;
	f.vars = () => [user, lighter, $e];
	if (truthy((yield* g.callName(f, live(user), "get_active_held_item", [])))) {
		return live(f.dot);
	}
	lighter = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/weapon/lighter"));
	if (($e = rt.next(f, 0)) !== undefined) {
		lighter = $e;
		yield* g.srcCall(f, "remove_from_storage", live(lighter), rt.fv(f, "loc", live(user)));
		yield* g.callName(f, live(user), "put_in_active_hand", [live(lighter)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/storage/fancy/cigarettes/proc/update_icon  (code/game/objects/items/weapons/storage/fancy.dm:135)
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/update_icon", function update_icon(f: Frame) {
	let i: Value = null, C: Value = null, inserted_overlay: Value = null;
	let $e: any;
	f.vars = () => [i, C, inserted_overlay, $e];
	if ((truthy(rt.sv(f, "fancy_open")) || !truthy(rt.len(f, rt.sv(f, "contents"))))) {
		rt.callSrc(f, "cut_overlays", []);
		if (!truthy(rt.len(f, rt.sv(f, "contents")))) {
			rt.setSv(f, "icon_state", fmt("＀_empty", [rt.initial(f, live(f.src), "icon_state")]));
		} else {
			rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
			rt.callSrc(f, "add_overlay", [fmt("＀_open", [rt.sv(f, "icon_state")])]);
			i = rt.len(f, rt.sv(f, "contents"));
			C = null;
			rt.forList(f, 0, rt.sv(f, "contents"));
			while (($e = rt.next(f, 0)) !== undefined) {
				C = $e;
				rt.setFv(f, "pixel_x", (inserted_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon")])), multiply(1, subtract(live(i), 1)));
				if (truthy((rt.istype(live(C), T("/obj/item/weapon/lighter/greyscale")) ? 1 : 0))) {
					rt.setFv(f, "icon_state", live(inserted_overlay), "lighter_in");
				} else {
					if (truthy((rt.istype(live(C), T("/obj/item/weapon/lighter")) ? 1 : 0))) {
						rt.setFv(f, "icon_state", live(inserted_overlay), "zippo_in");
					} else {
						rt.setFv(f, "icon_state", live(inserted_overlay), "cigarette");
					}
				}
				rt.callSrc(f, "add_overlay", [live(inserted_overlay)]);
				i = rt.inc(live(i), -1);
			}
			rt.endFor(f, 0);
		}
	} else {
		rt.callSrc(f, "cut_overlays", []);
	}
	return f.dot;
});

// /obj/item/weapon/storage/fancy/cigarettes/proc/attack  (code/game/objects/items/weapons/storage/fancy.dm:158)  may sleep
rt.def("/obj/item/weapon/storage/fancy/cigarettes/proc/attack", function* attack(f: Frame) {
	let cig: Value = null, W: Value = null;
	f.vars = () => [cig, W];
	if (!truthy((yield* g.call(f, P("/proc/ismob"), null, [live(f.args[0])])))) {
		return live(f.dot);
	}
	if (truthy((cig = rt.locateIn(f, T("/obj/item/clothing/mask/cigarette"), rt.sv(f, "contents"))))) {
		if (((isEqual(live(f.args[0]), live(f.args[1])) && rt.gt(rt.len(f, rt.sv(f, "contents")), 0)) && !truthy(rt.fv(f, "wear_mask", live(f.args[1]))))) {
			yield* g.srcCall(f, "remove_from_storage", (W = live(cig)), live(f.args[0]));
			yield* g.callName(f, live(f.args[0]), "equip_to_slot_if_possible", [live(W), 2]);
			(rt.modSrcVar(f, "contents", live(W), subtract));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You take a ＀ out of the pack.</span>", [rt.sv(f, "icon_type")])]);
		} else {
			yield* g.callSuper(f, [], rt.Args.Same);
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>There are no ＀s left in the pack.</span>", [rt.sv(f, "icon_type")])]);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

rt.type(5567, "/obj/item/weapon/storage/fancy/rollingpapers", "/obj/item/weapon/storage/fancy", {
	icon_type: "rolling paper",
	name: "rolling paper pack",
	desc: "A pack of NanoTrasen brand rolling papers.",
	w_class: 1,
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cig_paper_pack",
	storage_slots: 10,
	spawn_type: rt.typePath("/obj/item/weapon/rollingpaper"),
	can_hold: null,
});

// /obj/item/weapon/storage/fancy/rollingpapers/proc/<init>  (code/game/objects/items/weapons/storage/fancy.dm:229)
rt.def("/obj/item/weapon/storage/fancy/rollingpapers/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/weapon/rollingpaper")));
	return f.dot;
});

// /obj/item/weapon/storage/fancy/rollingpapers/proc/update_icon  (code/game/objects/items/weapons/storage/fancy.dm:233)
rt.def("/obj/item/weapon/storage/fancy/rollingpapers/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.len(f, rt.sv(f, "contents")))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("＀_empty", [rt.sv(f, "icon_state")])]);
	return f.dot;
});

rt.type(5564, "/obj/item/weapon/storage/fancy/cigarettes/cigars", "/obj/item/weapon/storage/fancy/cigarettes", {
	icon_type: "premium cigar",
	name: "１premium cigar case",
	desc: "A case of premium cigars. Very expensive.",
	icon: rt.rsc("icons/obj/cigarettes.dmi"),
	icon_state: "cigarcase",
	w_class: 3,
	storage_slots: 5,
	spawn_type: rt.typePath("/obj/item/clothing/mask/cigarette/cigar"),
	can_hold: null,
});

// /obj/item/weapon/storage/fancy/cigarettes/cigars/proc/<init>  (code/game/objects/items/weapons/storage/fancy.dm:248)
rt.def("/obj/item/weapon/storage/fancy/cigarettes/cigars/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "can_hold", rt.list(T("/obj/item/clothing/mask/cigarette/cigar")));
	return f.dot;
});

// /obj/item/weapon/storage/fancy/cigarettes/cigars/proc/update_icon  (code/game/objects/items/weapons/storage/fancy.dm:253)
rt.def("/obj/item/weapon/storage/fancy/cigarettes/cigars/proc/update_icon", function update_icon(f: Frame) {
	let cigar_overlay: Value = null, c: Value = null;
	f.vars = () => [cigar_overlay, c];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "fancy_open"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_open", [rt.sv(f, "icon_state")])]);
		cigar_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), rt.sv(f, "icon_type")]);
		c = null;
		c = rt.len(f, rt.sv(f, "contents"));
		while (rt.ge(live(c), 1)) {
			rt.setFv(f, "pixel_x", live(cigar_overlay), multiply(4, subtract(live(c), 1)));
			rt.callSrc(f, "add_overlay", [live(cigar_overlay)]);
			c = rt.inc(live(c), -1);
		}
	} else {
		rt.setSv(f, "icon_state", "cigarcase");
	}
	return f.dot;
});
