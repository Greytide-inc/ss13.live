// From code/game/objects/items/weapons/chrono_eraser.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7127, "/obj/item/weapon/chrono_eraser", "/obj/item/weapon", {
	PA: null,
	erased_minds: null,
	name: "Timestream Eradication Device",
	desc: "The result of outlawed time-bluespace research, this device is capable of wiping a being from the timestream. They never are, they never were, they never will be.",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronobackpack",
	item_state: "backpack",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
});

// /obj/item/weapon/chrono_eraser/proc/<init>  (code/game/objects/items/weapons/chrono_eraser.dm:14)
rt.def("/obj/item/weapon/chrono_eraser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "erased_minds", rt.list());
	$0 = $0;
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/equip_unequip_TED_Gun")));
	return f.dot;
});

// /obj/item/weapon/chrono_eraser/proc/pass_mind  (code/game/objects/items/weapons/chrono_eraser.dm:17)
rt.def("/obj/item/weapon/chrono_eraser/proc/pass_mind", function pass_mind(f: Frame, M: Value) {
	rt.modSrcVar(f, "erased_minds", live(M), add);
	return f.dot;
});

// /obj/item/weapon/chrono_eraser/proc/dropped  (code/game/objects/items/weapons/chrono_eraser.dm:20)  may sleep
rt.def("/obj/item/weapon/chrono_eraser/proc/dropped", function* dropped(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "PA"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "PA")]);
	return f.dot;
}, true);

// /obj/item/weapon/chrono_eraser/proc/Destroy  (code/game/objects/items/weapons/chrono_eraser.dm:25)  may sleep
rt.def("/obj/item/weapon/chrono_eraser/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.srcCall(f, "dropped");
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/chrono_eraser/proc/ui_action_click  (code/game/objects/items/weapons/chrono_eraser.dm:29)  may sleep
rt.def("/obj/item/weapon/chrono_eraser/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let C: Value = null;
	f.vars = () => [user, C];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon")) ? 1 : 0))) return f.dot;
	if (!isEqual(rt.gv(f, "back", (C = live(user))), live(f.src))) return f.dot;
	if (truthy(rt.sv(f, "PA"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "PA")]);
	} else {
		rt.setSv(f, "PA", (yield* g.new_(f, T("/obj/item/weapon/gun/energy/chrono_gun"), [live(f.src)])));
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "PA")]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/chrono_eraser/proc/item_action_slot_check  (code/game/objects/items/weapons/chrono_eraser.dm:39)
rt.def("/obj/item/weapon/chrono_eraser/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (!isEqual(live(slot), 1)) return f.dot;
	return 1;
});

rt.type(5164, "/obj/item/weapon/gun/energy/chrono_gun", "/obj/item/weapon/gun/energy", {
	TED: null,
	field: null,
	startpos: null,
	flags: 16386,
	name: "T.E.D. Projection Apparatus",
	desc: "It's as if they never existed in the first place.",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronogun",
	item_state: "chronogun",
	w_class: 3,
	can_charge: 0,
	fire_delay: 50,
	ammo_type: null,
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/<init>  (code/game/objects/items/weapons/chrono_eraser.dm:50)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "ammo_type", rt.list(T("/obj/item/ammo_casing/energy/chrono_beam")));
	return f.dot;
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/Initialize  (code/game/objects/items/weapons/chrono_eraser.dm:58)  may sleep
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/chrono_eraser")) ? 1 : 0))) {
		rt.setSv(f, "TED", rt.sv(f, "loc"));
	} else {
		rt.setSv(f, "TED", (yield* g.new_(f, T("/obj/item/weapon/chrono_eraser"), [rt.fv(f, "loc", live(f.src))])));
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/chrono_gun/proc/process_fire  (code/game/objects/items/weapons/chrono_eraser.dm:70)  may sleep
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/process_fire", function* process_fire(f: Frame) {
	if (truthy(rt.sv(f, "field"))) {
		yield* g.srcCall(f, "field_disconnect", rt.sv(f, "field"));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/gun/energy/chrono_gun/proc/Destroy  (code/game/objects/items/weapons/chrono_eraser.dm:75)  may sleep
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "TED"))) {
		rt.setFv(f, "PA", rt.sv(f, "TED"), null);
		rt.setSv(f, "TED", null);
	}
	if (truthy(rt.sv(f, "field"))) {
		yield* g.srcCall(f, "field_disconnect", rt.sv(f, "field"));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/energy/chrono_gun/proc/field_connect  (code/game/objects/items/weapons/chrono_eraser.dm:83)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_connect", function field_connect(f: Frame, F: Value) {
	let user: Value = null;
	f.vars = () => [user];
	user = rt.fv(f, "loc", live(f.src));
	if (truthy(rt.fv(f, "gun", live(F)))) {
		if ((truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "captured", live(F))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'><b>FAIL: <i>＀</i> already has an existing connection.</b></span>", [rt.fv(f, "captured", live(F))])]);
		}
		rt.callName(f, live(f.src), "field_disconnect", [live(F)]);
	} else {
		rt.setSv(f, "startpos", rt.getStep(f, live(f.src), 0));
		rt.setSv(f, "field", live(F));
		rt.setFv(f, "gun", live(F), live(f.src));
		if (!(truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "captured", live(F))))) return f.dot;
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>Connection established with target: <b>＀</b></span>", [rt.fv(f, "captured", live(F))])]);
	}
	return f.dot;
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/field_disconnect  (code/game/objects/items/weapons/chrono_eraser.dm:96)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_disconnect", function field_disconnect(f: Frame, F: Value) {
	let user: Value = null;
	f.vars = () => [user];
	if ((truthy(live(F)) && isEqual(rt.sv(f, "field"), live(F)))) {
		user = rt.fv(f, "loc", live(f.src));
		if (isEqual(rt.fv(f, "gun", live(F)), live(f.src))) {
			rt.setFv(f, "gun", live(F), null);
		}
		if ((truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)) && truthy(rt.fv(f, "captured", live(F))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='alert'>Disconnected from target: <b>＀</b></span>", [rt.fv(f, "captured", live(F))])]);
		}
	}
	rt.setSv(f, "field", null);
	rt.setSv(f, "startpos", null);
	return f.dot;
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/field_check  (code/game/objects/items/weapons/chrono_eraser.dm:107)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_check", function field_check(f: Frame, F: Value) {
	let currentpos: Value = null, user: Value = null;
	f.vars = () => [currentpos, user];
	if (!truthy(live(F))) return f.dot;
	if (isEqual(rt.sv(f, "field"), live(F))) {
		currentpos = rt.getStep(f, live(f.src), 0);
		user = rt.fv(f, "loc", live(f.src));
		if ((((isEqual(live(currentpos), rt.sv(f, "startpos")) && truthy((rt.isIn(f, rt.sv(f, "field"), rt.call(f, P("/proc/view"), null, [3, live(currentpos)])) ? 1 : 0))) && !truthy(rt.fv(f, "lying", live(user)))) && isEqual(rt.fv(f, "stat", live(user)), 0))) {
			return 1;
		}
	}
	rt.callSrc(f, "field_disconnect", [live(F)]);
	return 0;
});

// /obj/item/weapon/gun/energy/chrono_gun/proc/pass_mind  (code/game/objects/items/weapons/chrono_eraser.dm:117)
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/pass_mind", function pass_mind(f: Frame, M: Value) {
	if (!truthy(rt.sv(f, "TED"))) return f.dot;
	rt.callName(f, rt.sv(f, "TED"), "pass_mind", [live(M)]);
	return f.dot;
});

rt.type(8846, "/obj/item/projectile/energy/chrono_beam", "/obj/item/projectile/energy", {
	gun: null,
	name: "eradication beam",
	icon_state: "chronobolt",
	range: 3,
	nodamage: 1,
});

// /obj/item/projectile/energy/chrono_beam/proc/fire  (code/game/objects/items/weapons/chrono_eraser.dm:128)
rt.def("/obj/item/projectile/energy/chrono_beam/proc/fire", function fire(f: Frame) {
	rt.setSv(f, "gun", rt.callName(f, rt.sv(f, "firer"), "get_active_held_item", []));
	if (truthy((rt.istype(rt.sv(f, "gun"), T("/obj/item/weapon/gun/energy/chrono_gun")) ? 1 : 0))) {
		return rt.callSuper(f, [], rt.Args.Same);
	}
	return 0;
}, false, { waitfor: false });

// /obj/item/projectile/energy/chrono_beam/proc/on_hit  (code/game/objects/items/weapons/chrono_eraser.dm:135)
rt.def("/obj/item/projectile/energy/chrono_beam/proc/on_hit", function on_hit(f: Frame, target: Value) {
	let F: Value = null;
	f.vars = () => [F];
	if (!((truthy(live(target)) && truthy(rt.sv(f, "gun"))) && truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)))) return f.dot;
	F = rt.new_(f, T("/obj/effect/chrono_field"), [rt.fv(f, "loc", live(target)), live(target), rt.sv(f, "gun")]);
	rt.callName(f, rt.sv(f, "gun"), "field_connect", [live(F)]);
	return f.dot;
});

rt.type(11951, "/obj/effect/chrono_field", "/obj/effect", {
	captured: null,
	gun: null,
	tickstokill: 15,
	mob_underlay: null,
	preloaded: 0,
	RPpos: null,
	anchored: 1,
	name: "eradication field",
	desc: "An aura of time-bluespace energy.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	density: 0,
	blend_mode: 4,
});

// /obj/effect/chrono_field/proc/New  (code/game/objects/items/weapons/chrono_eraser.dm:163)
rt.def("/obj/effect/chrono_field/proc/New", function New(f: Frame, loc: Value, target: Value, G: Value) {
	let mob_snapshot: Value = null, cached_icon: Value = null, i: Value = null, removing_frame: Value = null, mob_icon: Value = null;
	f.vars = () => [mob_snapshot, cached_icon, i, removing_frame, mob_icon];
	if (((truthy(live(target)) && truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0))) && truthy(live(G)))) {
		rt.setFv(f, "loc", live(target), live(f.src));
		rt.setFv(f, "captured", live(f.src), live(target));
		mob_snapshot = rt.call(f, P("/proc/getFlatIcon"), null, [live(target)]);
		cached_icon = rt.new_(f, T("/icon"), []);
		i = null;
		i = 1;
		while (rt.le(live(i), 22)) {
			removing_frame = rt.call(f, P("/proc/icon"), null, [rt.rsc("icons/obj/chronos.dmi"), "erasing", 2, live(i)]);
			rt.callName(f, (mob_icon = rt.call(f, P("/proc/icon"), null, [live(mob_snapshot)])), "Blend", [live(removing_frame), 2]);
			rt.callName(f, live(cached_icon), "Insert", [live(mob_icon), fmt("frame＀", [live(i)])]);
			i = rt.inc(live(i), 1);
		}
		rt.setSv(f, "mob_underlay", rt.call(f, P("/proc/mutable_appearance"), null, [live(cached_icon), "frame1"]));
		rt.callSrc(f, "update_icon", []);
		rt.setSv(f, "desc", add(rt.initial(f, live(f.src), "desc"), fmt("<br><span class='info'>It appears to contain ＀.</span>", [rt.fv(f, "name", live(target))])));
	}
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
});

// /obj/effect/chrono_field/proc/Destroy  (code/game/objects/items/weapons/chrono_eraser.dm:182)  may sleep
rt.def("/obj/effect/chrono_field/proc/Destroy", function* Destroy(f: Frame) {
	if ((truthy(rt.sv(f, "gun")) && truthy((yield* g.callName(f, rt.sv(f, "gun"), "field_check", [live(f.src)]))))) {
		yield* g.callName(f, rt.sv(f, "gun"), "field_disconnect", [live(f.src)]);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/effect/chrono_field/proc/update_icon  (code/game/objects/items/weapons/chrono_eraser.dm:187)
rt.def("/obj/effect/chrono_field/proc/update_icon", function update_icon(f: Frame) {
	let ttk_frame: Value = null;
	f.vars = () => [ttk_frame];
	ttk_frame = subtract(1, divide(rt.sv(f, "tickstokill"), rt.initial(f, live(f.src), "tickstokill")));
	if (isEqual((ttk_frame = rt.call(f, P("/proc/max"), null, [1, rt.call(f, P("/proc/min"), null, [rt.call(f, P("/proc/Ceiling"), null, [multiply(live(ttk_frame), 22)]), 22])])), rt.sv(f, "RPpos"))) return f.dot;
	rt.setSv(f, "RPpos", live(ttk_frame));
	rt.setFv(f, "icon_state", rt.sv(f, "mob_underlay"), fmt("frame＀", [rt.sv(f, "RPpos")]));
	rt.setSv(f, "underlays", rt.list());
	rt.modSrcVar(f, "underlays", rt.sv(f, "mob_underlay"), add);
	return f.dot;
});

// /obj/effect/chrono_field/proc/process  (code/game/objects/items/weapons/chrono_eraser.dm:197)  may sleep
rt.def("/obj/effect/chrono_field/proc/process", function* process(f: Frame) {
	let AM: Value = null, ghost: Value = null;
	let $e: any;
	f.vars = () => [AM, ghost, $e];
	if (truthy(rt.sv(f, "captured"))) {
		if (rt.gt(rt.sv(f, "tickstokill"), rt.initial(f, live(f.src), "tickstokill"))) {
			AM = null;
			rt.forList(f, 0, rt.sv(f, "contents"), T("/atom/movable"));
			while (($e = rt.next(f, 0)) !== undefined) {
				AM = $e;
				rt.setFv(f, "loc", live(AM), rt.sv(f, "loc"));
			}
			rt.endFor(f, 0);
			yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		} else {
			if (rt.le(rt.sv(f, "tickstokill"), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "captured"), "<span class='boldnotice'>As the last essence of your being is erased from time, you begin to re-experience your most enjoyable memory. You feel happy...</span>"]);
				ghost = (yield* g.callName(f, rt.sv(f, "captured"), "ghostize", [1]));
				if (truthy(rt.fv(f, "mind", rt.sv(f, "captured")))) {
					if (truthy(live(ghost))) {
						rt.setFv(f, "mind", live(ghost), null);
					}
					if (truthy(rt.sv(f, "gun"))) {
						yield* g.callName(f, rt.sv(f, "gun"), "pass_mind", [rt.fv(f, "mind", rt.sv(f, "captured"))]);
					}
				}
				yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "captured")]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			} else {
				yield* g.callName(f, rt.sv(f, "captured"), "Unconscious", [80]);
				if (!isEqual(rt.fv(f, "loc", rt.sv(f, "captured")), live(f.src))) {
					rt.setFv(f, "loc", rt.sv(f, "captured"), live(f.src));
				}
				yield* g.srcCall(f, "update_icon");
				if (truthy(rt.sv(f, "gun"))) {
					if (truthy((yield* g.callName(f, rt.sv(f, "gun"), "field_check", [live(f.src)])))) {
						rt.incSrcVar(f, "tickstokill", -1, true);
					} else {
						rt.setSv(f, "gun", null);
						return (yield* g.callSelf(f, []));
					}
				} else {
					rt.incSrcVar(f, "tickstokill", 1, true);
				}
			}
		}
	} else {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/chrono_field/proc/bullet_act  (code/game/objects/items/weapons/chrono_eraser.dm:228)
rt.def("/obj/effect/chrono_field/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	let beam: Value = null, Pgun: Value = null;
	f.vars = () => [beam, Pgun];
	if (truthy((rt.istype(live(_P), T("/obj/item/projectile/energy/chrono_beam")) ? 1 : 0))) {
		beam = live(_P);
		if ((truthy((Pgun = rt.fv(f, "gun", live(beam)))) && truthy((rt.istype(live(Pgun), T("/obj/item/weapon/gun/energy/chrono_gun")) ? 1 : 0)))) {
			rt.callName(f, live(Pgun), "field_connect", [live(f.src)]);
		}
	} else {
		return 0;
	}
	return f.dot;
});

// /obj/effect/chrono_field/proc/return_air  (code/game/objects/items/weapons/chrono_eraser.dm:240)
rt.def("/obj/effect/chrono_field/proc/return_air", function return_air(f: Frame) {
	let GM: Value = null;
	f.vars = () => [GM];
	rt.callName(f, (GM = rt.new_(f, T("/datum/gas_mixture"), [])), "assert_gases", ["o2", "n2"]);
	rt.setAt(rt.index(rt.fv(f, "gases", live(GM)), "o2"), 1, 21.83659553527832);
	rt.setAt(rt.index(rt.fv(f, "gases", live(GM)), "n2"), 1, 82.14720153808594);
	rt.setFv(f, "temperature", live(GM), 293.1499938964844);
	return live(GM);
});
