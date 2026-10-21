// From code/game/objects/items/weapons/holosign_creator.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7234, "/obj/item/weapon/holosign_creator", "/obj/item/weapon", {
	signs: null,
	max_signs: 10,
	creation_time: 0,
	holocreator_busy: 0,
	holosign_type: rt.typePath("/obj/structure/holosign/wetsign"),
	throw_speed: 3,
	throw_range: 7,
	flags: 4,
	name: "holographic sign projector",
	desc: "A handy-dandy holographic projector that displays a janitorial sign.",
	icon: rt.rsc("icons/obj/device.dmi"),
	icon_state: "signmaker",
	item_state: "electronic",
	force: 0,
	w_class: 2,
	throwforce: 0,
	origin_tech: "magnets=1;programming=3",
});

// /obj/item/weapon/holosign_creator/proc/<init>  (code/game/objects/items/weapons/holosign_creator.dm:14)
rt.def("/obj/item/weapon/holosign_creator/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "signs", rt.list());
	return f.dot;
});

// /obj/item/weapon/holosign_creator/proc/afterattack  (code/game/objects/items/weapons/holosign_creator.dm:22)  may sleep
rt.def("/obj/item/weapon/holosign_creator/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, flag: Value) {
	let _T: Value = null, H: Value = null;
	f.vars = () => [target, user, flag, _T, H];
	if (!truthy(live(flag))) return f.dot;
	if (!truthy((yield* g.srcCall(f, "check_allowed_items", live(target), 1)))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(target), 0);
	if (truthy((H = rt.locateIn(f, rt.sv(f, "holosign_type"), live(_T))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You use ＀ to deactivate ＀.</span>", [live(f.src), live(H)])]);
		yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	} else {
		if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T), 1])))) return f.dot;
		if (truthy(rt.sv(f, "holocreator_busy"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is busy creating a hologram.</span>", [live(f.src)])]);
			return live(f.dot);
		}
		if (rt.lt(rt.len(f, rt.sv(f, "signs")), rt.sv(f, "max_signs"))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/click.ogg"), 20, 1]);
			if (truthy(rt.sv(f, "creation_time"))) {
				rt.setSv(f, "holocreator_busy", 1);
				if (!truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(user), null, rt.sv(f, "creation_time"), "target", live(target)], rt.Args.Named)))) {
					rt.setSv(f, "holocreator_busy", 0);
					return live(f.dot);
				}
				rt.setSv(f, "holocreator_busy", 0);
				if (rt.ge(rt.len(f, rt.sv(f, "signs")), rt.sv(f, "max_signs"))) {
					return live(f.dot);
				}
				if (truthy((yield* g.call(f, P("/proc/is_blocked_turf"), null, [live(_T), 1])))) {
					return live(f.dot);
				}
			}
			H = (yield* g.new_(f, rt.sv(f, "holosign_type"), [rt.getStep(f, live(target), 0), live(f.src)]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You create ＇！ with ＀.</span>", [live(H), live(f.src)])]);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀ is projecting at max capacity!</span>", [live(f.src)])]);
		}
	}
	return f.dot;
}, true);

// /obj/item/weapon/holosign_creator/proc/attack_self  (code/game/objects/items/weapons/holosign_creator.dm:55)  may sleep
rt.def("/obj/item/weapon/holosign_creator/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let H: Value = null;
	let $e: any;
	f.vars = () => [user, H, $e];
	if (!truthy(rt.len(f, rt.sv(f, "signs")))) return f.dot;
	H = null;
	rt.forList(f, 0, rt.sv(f, "signs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You clear all active holograms.</span>"]);
	return f.dot;
}, true);

rt.type(7238, "/obj/item/weapon/holosign_creator/cyborg", "/obj/item/weapon/holosign_creator", {
	shock: 0,
	creation_time: 15,
	max_signs: 9,
	name: "Energy Barrier Projector",
	desc: "A holographic projector that creates fragile energy fields",
	holosign_type: rt.typePath("/obj/structure/holosign/barrier/cyborg"),
});

// /obj/item/weapon/holosign_creator/cyborg/proc/attack_self  (code/game/objects/items/weapons/holosign_creator.dm:94)  may sleep
rt.def("/obj/item/weapon/holosign_creator/cyborg/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let R: Value = null, H: Value = null, H_0: Value = null;
	let $e: any;
	f.vars = () => [user, R, H, H_0, $e];
	if (truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		R = live(user);
		if (truthy(rt.sv(f, "shock"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You clear all active holograms, and reset your projector to normal.</span>"]);
			rt.setSv(f, "holosign_type", T("/obj/structure/holosign/barrier/cyborg"));
			rt.setSv(f, "creation_time", 5);
			if (truthy(rt.len(f, rt.sv(f, "signs")))) {
				H = null;
				rt.forList(f, 0, rt.sv(f, "signs"));
				while (($e = rt.next(f, 0)) !== undefined) {
					H = $e;
					yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
				}
				rt.endFor(f, 0);
			}
			rt.setSv(f, "shock", 0);
			return live(f.dot);
		} else {
			if ((truthy(rt.fv(f, "emagged", live(R))) && !truthy(rt.sv(f, "shock")))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You clear all active holograms, and overload your energy projector!</span>"]);
				rt.setSv(f, "holosign_type", T("/obj/structure/holosign/barrier/cyborg/hacked"));
				rt.setSv(f, "creation_time", 30);
				if (truthy(rt.len(f, rt.sv(f, "signs")))) {
					H = null;
					rt.forList(f, 0, rt.sv(f, "signs"));
					while (($e = rt.next(f, 0)) !== undefined) {
						H = $e;
						yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
					}
					rt.endFor(f, 0);
				}
				rt.setSv(f, "shock", 1);
				return live(f.dot);
			} else {
				if (truthy(rt.len(f, rt.sv(f, "signs")))) {
					H = null;
					rt.forList(f, 0, rt.sv(f, "signs"));
					while (($e = rt.next(f, 0)) !== undefined) {
						H = $e;
						yield* g.call(f, P("/proc/qdel"), null, [live(H)]);
					}
					rt.endFor(f, 0);
					yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You clear all active holograms.</span>"]);
				}
			}
		}
	}
	if (!truthy(rt.len(f, rt.sv(f, "signs")))) return f.dot;
	H_0 = null;
	rt.forList(f, 0, rt.sv(f, "signs"));
	while (($e = rt.next(f, 0)) !== undefined) {
		H_0 = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(H_0)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You clear all active holograms.</span>"]);
	return f.dot;
}, true);
