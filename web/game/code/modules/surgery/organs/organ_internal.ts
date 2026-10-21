// From code/modules/surgery/organs/organ_internal.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9439, "/obj/item/organ", "/obj/item", {
	owner: null,
	status: 1,
	zone: "chest",
	slot: null,
	vital: 0,
	name: "organ",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	origin_tech: "biotech=3",
	w_class: 2,
	throwforce: 0,
});

// /obj/item/organ/proc/Insert  (code/modules/surgery/organs/organ_internal.dm:16)  may sleep
rt.def("/obj/item/organ/proc/Insert", function* Insert(f: Frame, M: Value, special: Value, drop_if_replaced: Value) {
	let replaced: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [M, special, drop_if_replaced, replaced, X, A, $e];
	if (live(special) === null) {
		special = 0;
	}
	if (live(drop_if_replaced) === null) {
		drop_if_replaced = 1;
	}
	if ((!truthy((rt.istype(live(M), T("/mob/living/carbon")) ? 1 : 0)) || isEqual(rt.sv(f, "owner"), live(M)))) {
		return live(f.dot);
	}
	if (truthy((replaced = (yield* g.callName(f, live(M), "getorganslot", [rt.sv(f, "slot")]))))) {
		yield* g.callName(f, live(replaced), "Remove", [null, live(M), "special", 1], rt.Args.Named);
		if (truthy(live(drop_if_replaced))) {
			yield* g.callName(f, live(replaced), "forceMove", [rt.getStep(f, live(f.src), 0)]);
		} else {
			yield* g.call(f, P("/proc/qdel"), null, [live(replaced)]);
		}
	}
	rt.setSv(f, "owner", live(M));
	(rt.modField(f, live(M), "internal_organs", live(f.src), rt.bitOr));
	rt.setAt(rt.fv(f, "internal_organs_slot", live(M)), rt.sv(f, "slot"), live(f.src));
	rt.setSv(f, "loc", null);
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Grant", [live(M)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/organ/proc/Remove  (code/modules/surgery/organs/organ_internal.dm:39)  may sleep
rt.def("/obj/item/organ/proc/Remove", function* Remove(f: Frame, M: Value, special: Value) {
	let X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [M, special, X, A, $e];
	if (live(special) === null) {
		special = 0;
	}
	rt.setSv(f, "owner", null);
	if (truthy(live(M))) {
		(rt.modField(f, live(M), "internal_organs", live(f.src), subtract));
		if (isEqual(rt.index(rt.fv(f, "internal_organs_slot", live(M)), rt.sv(f, "slot")), live(f.src))) {
			yield* g.callName(f, rt.fv(f, "internal_organs_slot", live(M)), "Remove", [rt.sv(f, "slot")]);
		}
		if (((truthy(rt.sv(f, "vital")) && !truthy(live(special))) && !truthy(rt.bitAnd(rt.fv(f, "status_flags", live(M)), 4096)))) {
			yield* g.callName(f, live(M), "death", []);
		}
	}
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Remove", [live(M)]);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/organ/proc/examine  (code/modules/surgery/organs/organ_internal.dm:56)
rt.def("/obj/item/organ/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (!(isEqual(rt.sv(f, "status"), 2) && truthy(rt.sv(f, "crit_fail")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>＀ seems to be broken!</span>", [live(f.src)])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/organ/proc/prepare_eat  (code/modules/surgery/organs/organ_internal.dm:62)  may sleep
rt.def("/obj/item/organ/proc/prepare_eat", function* prepare_eat(f: Frame) {
	let S: Value = null;
	f.vars = () => [S];
	rt.setFv(f, "name", (S = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/snacks/organ"), []))), rt.sv(f, "name"));
	rt.setFv(f, "desc", live(S), rt.sv(f, "desc"));
	rt.setFv(f, "icon", live(S), rt.sv(f, "icon"));
	rt.setFv(f, "icon_state", live(S), rt.sv(f, "icon_state"));
	rt.setFv(f, "origin_tech", live(S), rt.sv(f, "origin_tech"));
	rt.setFv(f, "w_class", live(S), rt.sv(f, "w_class"));
	return live(S);
}, true);

rt.type(6357, "/obj/item/weapon/reagent_containers/food/snacks/organ", "/obj/item/weapon/reagent_containers/food/snacks", {
	name: "appendix",
	icon_state: "appendix",
	icon: rt.rsc("icons/obj/surgery.dmi"),
	list_reagents: null,
});

// /obj/item/weapon/reagent_containers/food/snacks/organ/proc/<init>  (code/modules/surgery/organs/organ_internal.dm:76)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/organ/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "list_reagents", rt.alist(f, ["nutriment", 5]));
	return f.dot;
});

// /obj/item/organ/proc/Destroy  (code/modules/surgery/organs/organ_internal.dm:83)  may sleep
rt.def("/obj/item/organ/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "owner"))) {
		yield* g.callSrc(f, "Remove", [null, rt.sv(f, "owner"), "special", 1], rt.Args.Named);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/organ/proc/attack  (code/modules/surgery/organs/organ_internal.dm:87)  may sleep
rt.def("/obj/item/organ/proc/attack", function* attack(f: Frame) {
	let H: Value = null, S: Value = null;
	f.vars = () => [H, S];
	if ((isEqual(live(f.args[0]), live(f.args[1])) && truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/human")) ? 1 : 0)))) {
		H = live(f.args[1]);
		if (isEqual(rt.sv(f, "status"), 1)) {
			if (truthy((S = (yield* g.srcCall(f, "prepare_eat"))))) {
				yield* g.callName(f, live(H), "drop_item", []);
				yield* g.callName(f, live(H), "put_in_active_hand", [live(S)]);
				yield* g.callName(f, live(S), "attack", [live(H), live(H)]);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
			}
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["M", "user"] });

// /mob/living/carbon/proc/regenerate_organs  (code/modules/surgery/organs/organ_internal.dm:111)  may sleep
rt.def("/mob/living/carbon/proc/regenerate_organs", function* regenerate_organs(f: Frame) {
	let breathes: Value = null, blooded: Value = null, L: Value = null, H: Value = null, _T: Value = null, E: Value = null, ears: Value = null;
	f.vars = () => [breathes, blooded, L, H, _T, E, ears];
	breathes = 1;
	blooded = 1;
	if ((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna"))))) {
		if (truthy((rt.isIn(f, 10, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
			breathes = 0;
		}
		if (truthy((rt.isIn(f, 12, rt.gv(f, "species_traits", rt.fv(f, "species", rt.sv(f, "dna")))) ? 1 : 0))) {
			blooded = 0;
		}
	}
	if ((truthy(live(breathes)) && !truthy((yield* g.srcCall(f, "getorganslot", "lungs"))))) {
		yield* g.callName(f, (L = (yield* g.new_(f, T("/obj/item/organ/lungs"), []))), "Insert", [live(f.src)]);
	}
	if ((truthy(live(blooded)) && !truthy((yield* g.srcCall(f, "getorganslot", "heart"))))) {
		yield* g.callName(f, (H = (yield* g.new_(f, T("/obj/item/organ/heart"), []))), "Insert", [live(f.src)]);
	}
	if (!truthy((yield* g.srcCall(f, "getorganslot", "tongue")))) {
		_T = null;
		if (((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna")))) && truthy(rt.gv(f, "mutanttongue", rt.fv(f, "species", rt.sv(f, "dna")))))) {
			_T = (yield* g.new_(f, rt.gv(f, "mutanttongue", rt.fv(f, "species", rt.sv(f, "dna"))), []));
		} else {
			_T = (yield* g.new_(f, T("/obj/item/organ/tongue"), []));
		}
		yield* g.callName(f, live(_T), "Insert", [live(f.src)]);
	}
	if (!truthy((yield* g.srcCall(f, "getorganslot", "eye_sight")))) {
		E = null;
		if (((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna")))) && truthy(rt.gv(f, "mutanteyes", rt.fv(f, "species", rt.sv(f, "dna")))))) {
			E = (yield* g.new_(f, rt.gv(f, "mutanteyes", rt.fv(f, "species", rt.sv(f, "dna"))), []));
		} else {
			E = (yield* g.new_(f, T("/obj/item/organ/eyes"), []));
		}
		yield* g.callName(f, live(E), "Insert", [live(f.src)]);
	}
	if (truthy((yield* g.srcCall(f, "getorganslot", "ears")))) return f.dot;
	ears = null;
	if (((truthy(rt.sv(f, "dna")) && truthy(rt.fv(f, "species", rt.sv(f, "dna")))) && truthy(rt.gv(f, "mutantears", rt.fv(f, "species", rt.sv(f, "dna")))))) {
		ears = (yield* g.new_(f, rt.gv(f, "mutantears", rt.fv(f, "species", rt.sv(f, "dna"))), []));
	} else {
		ears = (yield* g.new_(f, T("/obj/item/organ/ears"), []));
	}
	yield* g.callName(f, live(ears), "Insert", [live(f.src)]);
	return f.dot;
}, true);
