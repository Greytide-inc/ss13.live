// From code/modules/ninja/energy_katana.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7604, "/obj/item/weapon/dash", "/obj/item/weapon", {
	max_charges: 3,
	current_charges: 3,
	charge_rate: 30,
	dash_toggled: 1,
	bypass_density: 0,
	beam_icon_state: "blur",
	start_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/ninja/phase/out"),
	end_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/ninja/phase"),
	dash_beam_type: rt.typePath("/obj/effect/ebeam"),
	name: "abstract dash weapon",
});

// /obj/item/weapon/dash/proc/charge  (code/modules/ninja/energy_katana.dm:16)
rt.def("/obj/item/weapon/dash/proc/charge", function charge(f: Frame) {
	rt.setSv(f, "current_charges", rt.call(f, P("/proc/max"), null, [0, rt.call(f, P("/proc/min"), null, [add(rt.sv(f, "current_charges"), 1), rt.sv(f, "max_charges")])]));
	if (!truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living")) ? 1 : 0))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "loc"), fmt("<span class='notice'>＀ now has ＀/＀ charges.</span>", [live(f.src), rt.sv(f, "current_charges"), rt.sv(f, "max_charges")])]);
	return f.dot;
});

// /obj/item/weapon/dash/proc/attack_self  (code/modules/ninja/energy_katana.dm:21)
rt.def("/obj/item/weapon/dash/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "dash_toggled", (!truthy(rt.sv(f, "dash_toggled")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "dash_toggled"))) {
		$1 = "enable";
	} else {
		$1 = "disable";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ the dash function on ＀.</span>", [$1, live(f.src)])]);
	return f.dot;
});

// /obj/item/weapon/dash/proc/afterattack  (code/modules/ninja/energy_katana.dm:26)  may sleep
rt.def("/obj/item/weapon/dash/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity_flag: Value, click_parameters: Value) {
	f.vars = () => [target, user, proximity_flag, click_parameters];
	if (!truthy(rt.sv(f, "dash_toggled"))) return f.dot;
	yield* g.srcCall(f, "dash", live(user), live(target));
	return live(f.dot);
}, true);

// /obj/item/weapon/dash/proc/dash  (code/modules/ninja/energy_katana.dm:30)  may sleep
rt.def("/obj/item/weapon/dash/proc/dash", function* dash(f: Frame, user: Value, target: Value) {
	let _T: Value = null, turf: Value = null, A: Value = null, spot1: Value = null, spot2: Value = null;
	let $e: any;
	f.vars = () => [user, target, _T, turf, A, spot1, spot2, $e];
	if (!truthy(rt.sv(f, "current_charges"))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "Adjacent", live(target))))) {
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "density", live(target)))) {
		return live(f.dot);
	}
	_T = rt.getStep(f, live(target), 0);
	if (!truthy(rt.sv(f, "bypass_density"))) {
		turf = null;
		rt.forList(f, 0, (yield* g.call(f, P("/proc/getline"), null, [rt.getStep(f, live(user), 0), live(_T)])), T("/turf"));
		while (($e = rt.next(f, 0)) !== undefined) {
			turf = $e;
			A = null;
			rt.forList(f, 1, live(turf), T("/atom"));
			while (($e = rt.next(f, 1)) !== undefined) {
				A = $e;
				if (truthy(rt.fv(f, "density", live(A)))) {
					return live(f.dot);
				}
			}
			rt.endFor(f, 1);
		}
		rt.endFor(f, 0);
	}
	if (!truthy((rt.isIn(f, live(target), (yield* g.call(f, P("/proc/view"), null, [rt.gv(f, "view", rt.fv(f, "client", live(user))), rt.getStep(f, live(user), 0)]))) ? 1 : 0))) return f.dot;
	spot1 = (yield* g.new_(f, rt.sv(f, "start_effect_type"), [live(_T), rt.fv(f, "dir", live(user))]));
	yield* g.callName(f, live(user), "forceMove", [live(_T)]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), rt.rsc("sound/magic/blink.ogg"), 25, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(_T), "sparks", 50, 1]);
	spot2 = (yield* g.new_(f, rt.sv(f, "end_effect_type"), [rt.getStep(f, live(user), 0), rt.fv(f, "dir", live(user))]));
	yield* g.callName(f, live(spot1), "Beam", [null, live(spot2), null, rt.sv(f, "beam_icon_state"), "time", 2, "maxdistance", 20, "beam_type", rt.sv(f, "dash_beam_type")], rt.Args.Named);
	rt.incSrcVar(f, "current_charges", -1, true);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/dash/proc/charge")])), rt.sv(f, "charge_rate")]);
	return f.dot;
}, true);

rt.type(7605, "/obj/item/weapon/dash/energy_katana", "/obj/item/weapon/dash", {
	spark_system: null,
	bypass_density: 1,
	name: "energy katana",
	desc: "A katana infused with strong energy.",
	icon_state: "energy_katana",
	item_state: "energy_katana",
	force: 40,
	throwforce: 20,
	block_chance: 50,
	armour_penetration: 50,
	w_class: 3,
	hitsound: rt.rsc("sound/weapons/bladeslice.ogg"),
	attack_verb: null,
	slot_flags: 512,
	sharpness: 1,
	obj_integrity: 200,
	max_integrity: 200,
	resistance_flags: 35,
});

// /obj/item/weapon/dash/energy_katana/proc/afterattack  (code/modules/ninja/energy_katana.dm:80)  may sleep
rt.def("/obj/item/weapon/dash/energy_katana/proc/afterattack", function* afterattack(f: Frame) {
	if (truthy(rt.sv(f, "dash_toggled"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	if (!(truthy(live(f.args[2])) && (truthy((rt.istype(live(f.args[0]), T("/obj")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/mob/living/silicon")) ? 1 : 0))))) return f.dot;
	yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), "sparks", 50, 1]);
	yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/weapons/blade1.ogg"), 50, 1]);
	yield* g.callName(f, live(f.args[0]), "emag_act", [live(f.args[1])]);
	return f.dot;
}, true, { args: ["target", "user", "proximity_flag", "click_parameters"] });

// /obj/item/weapon/dash/energy_katana/proc/throw_impact  (code/modules/ninja/energy_katana.dm:92)  may sleep
rt.def("/obj/item/weapon/dash/energy_katana/proc/throw_impact", function* throw_impact(f: Frame) {
	let H: Value = null, SN: Value = null;
	f.vars = () => [H, SN];
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon/human")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.gv(f, "wear_suit", (H = live(f.args[0]))), T("/obj/item/clothing/suit/space/space_ninja")) ? 1 : 0))) {
			if (isEqual(rt.gv(f, "energyKatana", (SN = rt.fv(f, "wear_suit", live(H)))), live(f.src))) {
				yield* g.srcCall(f, "returnToOwner", live(H), 0, 1);
				return live(f.dot);
			}
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/dash/energy_katana/proc/returnToOwner  (code/modules/ninja/energy_katana.dm:103)  may sleep
rt.def("/obj/item/weapon/dash/energy_katana/proc/returnToOwner", function* returnToOwner(f: Frame, user: Value, doSpark: Value, caught: Value) {
	let msg: Value = null;
	f.vars = () => [user, doSpark, caught, msg];
	if (live(doSpark) === null) {
		doSpark = 1;
	}
	if (live(caught) === null) {
		caught = 0;
	}
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "forceMove", rt.getStep(f, live(user), 0));
	if (truthy(live(doSpark))) {
		yield* g.callName(f, rt.sv(f, "spark_system"), "start", []);
		yield* g.call(f, P("/proc/playsound"), null, [rt.getStep(f, live(f.src), 0), "sparks", 50, 1]);
	}
	msg = "";
	if (truthy((yield* g.callName(f, live(user), "put_in_hands", [live(f.src)])))) {
		msg = "Your Energy Katana teleports into your hand!";
	} else {
		if (truthy((yield* g.callName(f, live(user), "equip_to_slot_if_possible", [live(f.src), 5, 0, 1, 1])))) {
			msg = "Your Energy Katana teleports back to you, sheathing itself as it does so!</span>";
		} else {
			msg = "Your Energy Katana teleports to your location!";
		}
	}
	if (truthy(live(caught))) {
		if (isEqual(rt.sv(f, "loc"), live(user))) {
			msg = "You catch your Energy Katana!";
		} else {
			msg = "Your Energy Katana lands at your feet!";
		}
	}
	if (!truthy(live(msg))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>＀</span>", [live(msg)])]);
	return f.dot;
}, true);

// /obj/item/weapon/dash/energy_katana/proc/Initialize  (code/modules/ninja/energy_katana.dm:130)  may sleep
rt.def("/obj/item/weapon/dash/energy_katana/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "spark_system", (yield* g.new_(f, T("/datum/effect_system/spark_spread"), [])));
	yield* g.callName(f, rt.sv(f, "spark_system"), "set_up", [5, 0, live(f.src)]);
	yield* g.callName(f, rt.sv(f, "spark_system"), "attach", [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/dash/energy_katana/proc/Destroy  (code/modules/ninja/energy_katana.dm:136)  may sleep
rt.def("/obj/item/weapon/dash/energy_katana/proc/Destroy", function* Destroy(f: Frame) {
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "spark_system")]);
	rt.setSv(f, "spark_system", null);
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);
