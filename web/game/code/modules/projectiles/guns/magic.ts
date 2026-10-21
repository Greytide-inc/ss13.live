// From code/modules/projectiles/guns/magic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5111, "/obj/item/weapon/gun/magic", "/obj/item/weapon/gun", {
	max_charges: 6,
	charges: 0,
	recharge_rate: 4,
	charge_tick: 0,
	can_charge: 1,
	ammo_type: null,
	no_den_usage: null,
	flags: 64,
	name: "staff of nothing",
	desc: "This staff is boring to watch because even though it came first you've seen everything it can do in other staves for years.",
	icon: rt.rsc("icons/obj/guns/magic.dmi"),
	icon_state: "staffofnothing",
	item_state: "staff",
	fire_sound: rt.rsc("sound/weapons/emitter.ogg"),
	w_class: 5,
	origin_tech: null,
	clumsy_check: 0,
	trigger_guard: -1,
	lefthand_file: rt.rsc("icons/mob/inhands/items_lefthand.dmi"),
	righthand_file: rt.rsc("icons/mob/inhands/items_righthand.dmi"),
	pin: rt.typePath("/obj/item/device/firing_pin/magic"),
});

// /obj/item/weapon/gun/magic/proc/afterattack  (code/modules/projectiles/guns/magic.dm:27)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/afterattack", function* afterattack(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (truthy(rt.sv(f, "no_den_usage"))) {
		if (truthy((rt.istype((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[1])]))), T("/area/wizard_station")) ? 1 : 0))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You know better than to violate the security of The Den, best wait until you leave to use ＀.<span>", [live(f.src)])]);
			return live(f.dot);
		} else {
			rt.setSv(f, "no_den_usage", 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "flag"] });

// /obj/item/weapon/gun/magic/proc/recharge_newshot  (code/modules/projectiles/guns/magic.dm:39)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/recharge_newshot", function* recharge_newshot(f: Frame) {
	if (!((truthy(rt.sv(f, "charges")) && truthy(rt.sv(f, "chambered"))) && !truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "chambered"), "newshot", []);
	return f.dot;
}, true);

// /obj/item/weapon/gun/magic/proc/process_chamber  (code/modules/projectiles/guns/magic.dm:43)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/process_chamber", function* process_chamber(f: Frame) {
	if (!(truthy(rt.sv(f, "chambered")) && !truthy(rt.fv(f, "BB", rt.sv(f, "chambered"))))) return f.dot;
	rt.incSrcVar(f, "charges", -1, true);
	yield* g.srcCall(f, "recharge_newshot");
	return f.dot;
}, true);

// /obj/item/weapon/gun/magic/proc/Initialize  (code/modules/projectiles/guns/magic.dm:48)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "charges", rt.sv(f, "max_charges"));
	rt.setSv(f, "chambered", (yield* g.new_(f, rt.sv(f, "ammo_type"), [live(f.src)])));
	if (!truthy(rt.sv(f, "can_charge"))) return f.dot;
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/weapon/gun/magic/proc/Destroy  (code/modules/projectiles/guns/magic.dm:57)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "can_charge"))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/magic/proc/process  (code/modules/projectiles/guns/magic.dm:62)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/process", function* process(f: Frame) {
	rt.incSrcVar(f, "charge_tick", 1, true);
	if ((rt.lt(rt.sv(f, "charge_tick"), rt.sv(f, "recharge_rate")) || rt.ge(rt.sv(f, "charges"), rt.sv(f, "max_charges")))) {
		return 0;
	}
	rt.setSv(f, "charge_tick", 0);
	rt.incSrcVar(f, "charges", 1, true);
	if (isEqual(rt.sv(f, "charges"), 1)) {
		yield* g.srcCall(f, "recharge_newshot");
	}
	return 1;
}, true, { waitfor: false });

// /obj/item/weapon/gun/magic/proc/shoot_with_empty_chamber  (code/modules/projectiles/guns/magic.dm:75)
rt.def("/obj/item/weapon/gun/magic/proc/shoot_with_empty_chamber", function shoot_with_empty_chamber(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ whizzles quietly.<span>", [rt.sv(f, "name")])]);
	return f.dot;
});

// /obj/item/weapon/gun/magic/proc/suicide_act  (code/modules/projectiles/guns/magic.dm:78)
rt.def("/obj/item/weapon/gun/magic/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is twisting ＀ above ＀ head, releasing a magical blast! It looks like ＀ trying to commit suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_theyre", [])])]);
	rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.sv(f, "fire_sound"), 50, 1, -1]);
	return 2;
});

// /obj/item/weapon/gun/magic/proc/vv_edit_var  (code/modules/projectiles/guns/magic.dm:83)  may sleep
rt.def("/obj/item/weapon/gun/magic/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	$0 = live(f.args[0]);
	if ($0 === "charges") {
		yield* g.srcCall(f, "recharge_newshot");
	}
	return f.dot;
}, true, { args: ["var_name", "var_value"] });
