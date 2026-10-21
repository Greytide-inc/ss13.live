// From code/game/gamemodes/changeling/evolution_menu.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /datum/changeling/proc/purchasePower  (code/game/gamemodes/changeling/evolution_menu.dm:5)  may sleep
rt.def("/datum/changeling/proc/purchasePower", function* purchasePower(f: Frame, user: Value, sting_name: Value) {
	let thepower: Value = null, path: Value = null, S: Value = null;
	let $e: any;
	f.vars = () => [user, sting_name, thepower, path, S, $e];
	thepower = null;
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/effect/proc_holder/changeling")])), T("/obj/effect/proc_holder/changeling")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (isEqual(rt.initial(f, (S = live(path)), "name"), live(sting_name))) {
			thepower = (yield* g.new_(f, live(path), []));
			break;
		}
	}
	rt.endFor(f, 0);
	if (!truthy(live(thepower))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "This is awkward. Changeling power purchase failed, please report this bug to a coder!"]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "absorbedcount"), rt.fv(f, "req_dna", live(thepower)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We lack the energy to evolve this ability!"]);
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "has_sting", live(thepower))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We have already evolved this ability!"]);
		return live(f.dot);
	}
	if (rt.lt(rt.fv(f, "dna_cost", live(thepower)), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We cannot evolve this ability."]);
		return live(f.dot);
	}
	if (rt.lt(rt.sv(f, "geneticpoints"), rt.fv(f, "dna_cost", live(thepower)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We have reached our capacity for abilities."]);
		return live(f.dot);
	}
	if (truthy(rt.bitAnd(rt.fv(f, "status_flags", live(user)), 8192))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "We lack the energy to evolve new abilities right now."]);
		return live(f.dot);
	}
	(rt.modSrcVar(f, "geneticpoints", rt.fv(f, "dna_cost", live(thepower)), subtract));
	rt.modSrcVar(f, "purchasedpowers", live(thepower), add);
	yield* g.callName(f, live(thepower), "on_purchase", [live(user)]);
	return f.dot;
}, true);

// /datum/changeling/proc/lingRespec  (code/game/gamemodes/changeling/evolution_menu.dm:41)  may sleep
rt.def("/datum/changeling/proc/lingRespec", function* lingRespec(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>We can't remove our evolutions in this form!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "canrespec"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>We have removed our evolutions from this form, and are now ready to readapt.</span>"]);
		yield* g.callName(f, live(user), "remove_changeling_powers", [1]);
		rt.setSv(f, "canrespec", 0);
		yield* g.callName(f, live(user), "make_changeling", [1]);
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>You lack the power to readapt your evolutions!</span>"]);
		return 0;
	}
	return f.dot;
}, true);

// /mob/proc/make_changeling  (code/game/gamemodes/changeling/evolution_menu.dm:55)  may sleep
rt.def("/mob/proc/make_changeling", function* make_changeling(f: Frame, is_respec: Value) {
	let path: Value = null, S: Value = null, C: Value = null, prof: Value = null, B: Value = null;
	let $e: any;
	f.vars = () => [is_respec, path, S, C, prof, B, $e];
	if (!truthy(rt.sv(f, "mind"))) {
		return live(f.dot);
	}
	if ((!truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0)) && !truthy((rt.istype(live(f.src), T("/mob/living/carbon/monkey")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "changeling", rt.sv(f, "mind")))) {
		rt.setFv(f, "changeling", rt.sv(f, "mind"), (yield* g.new_(f, T("/datum/changeling"), [rt.sv(f, "gender")])));
	}
	if (truthy(rt.gv(f, "purchasedpowers", rt.fv(f, "changeling", rt.sv(f, "mind"))))) {
		yield* g.srcCall(f, "remove_changeling_powers", 1);
	}
	path = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/effect/proc_holder/changeling")])), T("/obj/effect/proc_holder/changeling")));
	while (($e = rt.next(f, 0)) !== undefined) {
		path = $e;
		if (!truthy(rt.gv(f, "dna_cost", (S = (yield* g.new_(f, live(path), [])))))) {
			if (!truthy((yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "has_sting", [live(S)])))) {
				rt.modField(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "purchasedpowers", live(S), add);
			}
			yield* g.callName(f, live(S), "on_purchase", [live(f.src), live(is_respec)]);
		}
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype((C = live(f.src)), T("/mob/living/carbon/human")) ? 1 : 0))) {
		prof = (yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "add_new_profile", [live(C), live(f.src)]));
		rt.setFv(f, "first_prof", rt.fv(f, "changeling", rt.sv(f, "mind")), live(prof));
		if (truthy((B = (yield* g.callName(f, live(C), "getorganslot", ["brain"]))))) {
			rt.setFv(f, "vital", live(B), 0);
			rt.setFv(f, "decoy_override", live(B), 1);
		}
	}
	return 1;
}, true);

// /datum/changeling/proc/reset  (code/game/gamemodes/changeling/evolution_menu.dm:86)
rt.def("/datum/changeling/proc/reset", function reset(f: Frame) {
	rt.setSv(f, "chosen_sting", null);
	rt.setSv(f, "geneticpoints", rt.initial(f, live(f.src), "geneticpoints"));
	rt.setSv(f, "sting_range", rt.initial(f, live(f.src), "sting_range"));
	rt.setSv(f, "chem_storage", rt.initial(f, live(f.src), "chem_storage"));
	rt.setSv(f, "chem_recharge_rate", rt.initial(f, live(f.src), "chem_recharge_rate"));
	rt.setSv(f, "chem_charges", rt.call(f, P("/proc/min"), null, [rt.sv(f, "chem_charges"), rt.sv(f, "chem_storage")]));
	rt.setSv(f, "chem_recharge_slowdown", rt.initial(f, live(f.src), "chem_recharge_slowdown"));
	rt.setSv(f, "mimicing", "");
	return f.dot;
});

// /mob/proc/remove_changeling_powers  (code/game/gamemodes/changeling/evolution_menu.dm:95)  may sleep
rt.def("/mob/proc/remove_changeling_powers", function* remove_changeling_powers(f: Frame, keep_free_powers: Value) {
	let p: Value = null;
	let $e: any;
	f.vars = () => [keep_free_powers, p, $e];
	if (live(keep_free_powers) === null) {
		keep_free_powers = 0;
	}
	if (!(truthy((rt.istype(live(f.src), T("/mob/living/carbon/human")) ? 1 : 0)) || truthy((rt.istype(live(f.src), T("/mob/living/carbon/monkey")) ? 1 : 0)))) return f.dot;
	if ((truthy(rt.sv(f, "mind")) && truthy(rt.fv(f, "changeling", rt.sv(f, "mind"))))) {
		rt.setFv(f, "changeling_speak", rt.fv(f, "changeling", rt.sv(f, "mind")), 0);
		yield* g.callName(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "reset", []);
		p = null;
		rt.forList(f, 0, rt.gv(f, "purchasedpowers", rt.fv(f, "changeling", rt.sv(f, "mind"))), T("/obj/effect/proc_holder/changeling"));
		while (($e = rt.next(f, 0)) !== undefined) {
			p = $e;
			if (((isEqual(rt.fv(f, "dna_cost", live(p)), 0) && truthy(live(keep_free_powers))) || truthy(rt.fv(f, "always_keep", live(p))))) {
				continue;
			}
			(rt.modField(f, rt.fv(f, "changeling", rt.sv(f, "mind")), "purchasedpowers", live(p), subtract));
			yield* g.callName(f, live(p), "on_refund", [live(f.src)]);
		}
		rt.endFor(f, 0);
	}
	if (!truthy(rt.sv(f, "hud_used"))) return f.dot;
	rt.setFv(f, "icon_state", rt.fv(f, "lingstingdisplay", rt.sv(f, "hud_used")), null);
	rt.setFv(f, "invisibility", rt.fv(f, "lingstingdisplay", rt.sv(f, "hud_used")), 101);
	return f.dot;
}, true);

// /datum/changeling/proc/has_sting  (code/game/gamemodes/changeling/evolution_menu.dm:109)
rt.def("/datum/changeling/proc/has_sting", function has_sting(f: Frame, power: Value) {
	let _P: Value = null;
	let $e: any;
	f.vars = () => [_P, $e];
	_P = null;
	rt.forList(f, 0, rt.sv(f, "purchasedpowers"), T("/obj/effect/proc_holder/changeling"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		if (isEqual(rt.initial(f, live(power), "name"), rt.fv(f, "name", live(_P)))) {
			return 1;
		}
	}
	rt.endFor(f, 0);
	return 0;
});
