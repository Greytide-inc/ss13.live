// From code/game/objects/structures/crates_lockers/closets/bodybag.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12289, "/obj/structure/closet/body_bag", "/obj/structure/closet", {
	foldedbag_path: rt.typePath("/obj/item/bodybag"),
	tagged: 0,
	mob_storage_capacity: 2,
	open_sound: rt.rsc("sound/items/zip.ogg"),
	close_sound: rt.rsc("sound/items/zip.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/cloth"),
	delivery_icon: null,
	anchorable: 0,
	name: "body bag",
	desc: "A plastic bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bodybag",
	density: 0,
	integrity_failure: 0,
});

// /obj/structure/closet/body_bag/proc/attackby  (code/game/objects/structures/crates_lockers/closets/bodybag.dm:19)  may sleep
rt.def("/obj/structure/closet/body_bag/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let t: Value = null;
	f.vars = () => [I, user, params, t];
	if ((truthy((rt.istype(live(I), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(I), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(user), "What would you like the label to be?", rt.sv(f, "name"), null, 53]));
		if (!isEqual((yield* g.callName(f, live(user), "get_active_held_item", [])), live(I))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(user)])), 1) && !isEqual(rt.sv(f, "loc"), live(user)))) {
			return live(f.dot);
		}
		if (truthy(live(t))) {
			rt.setSv(f, "name", fmt("body bag - ＀", [live(t)]));
			rt.setSv(f, "tagged", 1);
			yield* g.srcCall(f, "update_icon");
		} else {
			rt.setSv(f, "name", "body bag");
		}
		return live(f.dot);
	} else {
		if (!truthy((rt.istype(live(I), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) return f.dot;
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You cut the tag off ＀.</span>", [live(f.src)])]);
		rt.setSv(f, "name", "body bag");
		rt.setSv(f, "tagged", 0);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/structure/closet/body_bag/proc/update_icon  (code/game/objects/structures/crates_lockers/closets/bodybag.dm:39)
rt.def("/obj/structure/closet/body_bag/proc/update_icon", function update_icon(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "tagged"))) return f.dot;
	rt.callSrc(f, "add_overlay", ["bodybag_label"]);
	return f.dot;
});

// /obj/structure/closet/body_bag/proc/close  (code/game/objects/structures/crates_lockers/closets/bodybag.dm:44)  may sleep
rt.def("/obj/structure/closet/body_bag/proc/close", function* close(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		rt.setSv(f, "density", 0);
		return 1;
	}
	return 0;
}, true);

// /obj/structure/closet/body_bag/proc/MouseDrop  (code/game/objects/structures/crates_lockers/closets/bodybag.dm:50)  may sleep
rt.def("/obj/structure/closet/body_bag/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(live(f.args[0]), live(f.usr)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) && (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) || truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)])))))) return f.dot;
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.sv(f, "opened"))) {
		return 0;
	}
	if (truthy(rt.len(f, rt.sv(f, "contents")))) {
		return 0;
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ folds up ＀.</span>", [live(f.usr), live(f.src)]));
	B = (yield* g.new_(f, rt.sv(f, "foldedbag_path"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(B)]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });

rt.type(12290, "/obj/structure/closet/body_bag/bluespace", "/obj/structure/closet/body_bag", {
	foldedbag_path: rt.typePath("/obj/item/bodybag/bluespace"),
	mob_storage_capacity: 15,
	max_mob_size: 3,
	name: "bluespace body bag",
	desc: "A bluespace body bag designed for the storage and transportation of cadavers.",
	icon: rt.rsc("icons/obj/bodybag.dmi"),
	icon_state: "bluebodybag",
});

// /obj/structure/closet/body_bag/bluespace/proc/MouseDrop  (code/game/objects/structures/crates_lockers/closets/bodybag.dm:74)  may sleep
rt.def("/obj/structure/closet/body_bag/bluespace/proc/MouseDrop", function* MouseDrop(f: Frame) {
	let B: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [B, A, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!((isEqual(live(f.args[0]), live(f.usr)) && truthy((yield* g.srcCall(f, "Adjacent", live(f.usr))))) && (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) || truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)])))))) return f.dot;
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return 0;
	}
	if (truthy(rt.sv(f, "opened"))) {
		return 0;
	}
	if (rt.ge(rt.len(f, rt.sv(f, "contents")), divide(rt.sv(f, "mob_storage_capacity"), 2))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>There are too many things inside of ＀ to fold it up!</span>", [live(f.src)])]);
		return 0;
	}
	B = null;
	rt.forList(f, 0, live(f.src), T("/obj/item/bodybag/bluespace"));
	while (($e = rt.next(f, 0)) !== undefined) {
		B = $e;
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't recursively fold bluespace body bags!</span>"]);
		return 0;
	}
	rt.endFor(f, 0);
	yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>＀ folds up ＀.</span>", [live(f.usr), live(f.src)]));
	B = (yield* g.new_(f, rt.sv(f, "foldedbag_path"), [rt.getStep(f, live(f.src), 0)]));
	yield* g.callName(f, live(f.usr), "put_in_hands", [live(B)]);
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "forceMove", [live(B)]);
		if (truthy((rt.istype(live(A), T("/mob/living")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(A), "<span class='userdanger'>You're suddenly forced into a tiny, compressed space!</span>"]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["over_object", "src_location", "over_location"] });
