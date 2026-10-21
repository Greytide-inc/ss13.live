// From code/game/objects/structures/crates_lockers/closets/cardboardbox.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12291, "/obj/structure/closet/cardboard", "/obj/structure/closet", {
	move_speed_multiplier: 1,
	move_delay: 0,
	egged: 0,
	mob_storage_capacity: 1,
	can_weld_shut: 0,
	cutting_tool: rt.typePath("/obj/item/weapon/wirecutters"),
	open_sound: "rustle",
	cutting_sound: rt.rsc("sound/items/poster_ripped.ogg"),
	material_drop: rt.typePath("/obj/item/stack/sheet/cardboard"),
	delivery_icon: "deliverybox",
	anchorable: 0,
	name: "large cardboard box",
	desc: "Just a box...",
	icon_state: "cardboard",
	resistance_flags: 4,
	obj_integrity: 70,
	max_integrity: 70,
	integrity_failure: 0,
});

// /obj/structure/closet/cardboard/proc/relaymove  (code/game/objects/structures/crates_lockers/closets/cardboardbox.dm:23)  may sleep
rt.def("/obj/structure/closet/cardboard/proc/relaymove", function* relaymove(f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	if ((((((((truthy(rt.sv(f, "opened")) || truthy(rt.sv(f, "move_delay"))) || truthy(rt.fv(f, "stat", live(user)))) || truthy((yield* g.callName(f, live(user), "IsStun", [])))) || truthy((yield* g.callName(f, live(user), "IsKnockdown", [])))) || truthy((yield* g.callName(f, live(user), "IsUnconscious", [])))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) || !truthy((yield* g.srcCall(f, "has_gravity", rt.sv(f, "loc")))))) {
		return live(f.dot);
	}
	rt.setSv(f, "move_delay", 1);
	if (truthy((yield* g.call(f, P("/proc/step"), null, [live(f.src), live(direction)])))) {
		rt.spawnTail(f, multiply(rt.fv(f, "walk_speed", rt.gl("config")), rt.sv(f, "move_speed_multiplier")), "/obj/structure/closet/cardboard/proc/relaymove: spawn at game/objects/structures/crates_lockers/closets/cardboardbox.dm:26", user, direction);
	} else {
		rt.setSv(f, "move_delay", 0);
	}
	return f.dot;
}, true);

// a spawn(multiply(rt.fieldI(f, rt.glob(813/*config*/), $ic[6]), rt.srcVarI(f, $ic[7]))) body of /obj/structure/closet/cardboard/proc/relaymove, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/structure/closet/cardboard/proc/relaymove: spawn at game/objects/structures/crates_lockers/closets/cardboardbox.dm:26", function* (f: Frame, user: Value, direction: Value) {
	f.vars = () => [user, direction];
	rt.setSv(f, "move_delay", 0);
	return null;
});

// /obj/structure/closet/cardboard/proc/open  (code/game/objects/structures/crates_lockers/closets/cardboardbox.dm:33)  may sleep
rt.def("/obj/structure/closet/cardboard/proc/open", function* open(f: Frame) {
	let alerted: Value = null, Snake: Value = null, L: Value = null, L_1: Value = null;
	let $e: any;
	f.vars = () => [alerted, Snake, L, L_1, $e];
	if ((truthy(rt.sv(f, "opened")) || !truthy((yield* g.srcCall(f, "can_open"))))) {
		return 0;
	}
	alerted = null;
	if (rt.lt(rt.sv(f, "egged"), rt.worldTime(f))) {
		Snake = null;
		L = null;
		rt.forList(f, 0, rt.fv(f, "contents", live(f.src)), T("/mob/living"));
		if (($e = rt.next(f, 0)) !== undefined) {
			L = $e;
			Snake = live(L);
		}
		rt.endFor(f, 0);
		if (truthy(live(Snake))) {
			alerted = (yield* g.call(f, P("/proc/viewers"), null, [7, live(f.src)]));
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.length(live(alerted)))) return f.dot;
	rt.setSv(f, "egged", add(rt.worldTime(f), 600));
	L_1 = null;
	rt.forList(f, 0, live(alerted), T("/mob/living"));
	while (($e = rt.next(f, 0)) !== undefined) {
		L_1 = $e;
		if (!truthy(rt.fv(f, "stat", live(L_1)))) {
			if (!truthy((yield* g.callName(f, live(L_1), "incapacitated", ["ignore_restraints", 1], rt.Args.Named)))) {
				yield* g.callName(f, live(L_1), "face_atom", [live(f.src)]);
			}
			yield* g.callName(f, live(L_1), "do_alert_animation", [live(L_1)]);
		}
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/chime.ogg"), 50, 0, -5]);
	return f.dot;
}, true);

// /mob/living/proc/do_alert_animation  (code/game/objects/structures/crates_lockers/closets/cardboardbox.dm:54)  may sleep
rt.def("/mob/living/proc/do_alert_animation", function* do_alert_animation(f: Frame, A: Value) {
	let I: Value = null;
	f.vars = () => [A, I];
	yield* g.call(f, P("/proc/flick_overlay_view"), null, [(I = (yield* g.call(f, P("/proc/image"), null, [rt.rsc("icons/obj/closet.dmi"), live(A), "cardboard_special", add(rt.fv(f, "layer", live(A)), 1)]))), live(A), 8]);
	rt.setFv(f, "alpha", live(I), 0);
	rt.op(f, "Animate", [2, 10], [null, live(I), "pixel_z", 32, "alpha", 255, "time", 5, "easing", 5]);
	return f.dot;
}, true);
