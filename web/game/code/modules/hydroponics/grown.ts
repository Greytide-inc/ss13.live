// From code/modules/hydroponics/grown.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6257, "/obj/item/weapon/reagent_containers/food/snacks/grown", "/obj/item/weapon/reagent_containers/food/snacks", {
	seed: null,
	plantname: "",
	bitesize_mod: 0,
	splat_type: rt.typePath("/obj/effect/decal/cleanable/plant_smudge"),
	dried_type: -1,
	icon: rt.rsc("icons/obj/hydroponics/harvest.dmi"),
	resistance_flags: 4,
	origin_tech: "biotech=1",
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/New  (code/modules/hydroponics/grown.dm:21)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/New", function* New(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (live(f.args[1]) === null) {
		f.args[1] = null;
	}
	rt.setSv(f, "tastes", rt.alist(f, ["name", 1]));
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[1]))) {
		rt.setSv(f, "seed", (yield* g.callName(f, live(f.args[1]), "Copy", [])));
	} else {
		if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "seed")])))) {
			rt.setSv(f, "seed", (yield* g.new_(f, rt.sv(f, "seed"), [])));
			yield* g.callName(f, rt.sv(f, "seed"), "adjust_potency", [subtract(50, rt.fv(f, "potency", rt.sv(f, "seed")))]);
		}
	}
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-5, 5])));
	if (isEqual(rt.sv(f, "dried_type"), -1)) {
		rt.setSv(f, "dried_type", rt.fv(f, "type", live(f.src)));
	}
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "on_new", [live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "seed"), "prepare_result", [live(f.src)]);
	(rt.modSrcVar(f, "transform", (yield* g.call(f, P("/proc/TransformUsingVariable"), null, [rt.fv(f, "potency", rt.sv(f, "seed")), 100, 0.5])), multiply));
	yield* g.srcCall(f, "add_juice");
	return f.dot;
}, true, { args: ["newloc", "new_seed"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/add_juice  (code/modules/hydroponics/grown.dm:48)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/add_juice", function add_juice(f: Frame) {
	if (truthy(rt.sv(f, "reagents"))) {
		if (truthy(rt.sv(f, "bitesize_mod"))) {
			rt.setSv(f, "bitesize", add(1, rt.call(f, P("/proc/round"), null, [divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "bitesize_mod"))])));
		}
		return 1;
	}
	return 0;
});

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/examine  (code/modules/hydroponics/grown.dm:53)
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/examine", function examine(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		if (truthy(rt.fv(f, "examine_line", live(_T)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), rt.fv(f, "examine_line", live(_T))]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/attackby  (code/modules/hydroponics/grown.dm:60)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/attackby", function* attackby(f: Frame) {
	let msg: Value = null, reag_txt: Value = null, reagent_id: Value = null, R: Value = null, amt: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [msg, reag_txt, reagent_id, R, amt, _T, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/plant_analyzer")) ? 1 : 0))) {
		msg = fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>.\n", [live(f.src)]);
		if (truthy(rt.sv(f, "seed"))) {
			msg = rt.modify(live(msg), (yield* g.callName(f, rt.sv(f, "seed"), "get_analyzer_text", [])), add);
		}
		reag_txt = "";
		if (truthy(rt.sv(f, "seed"))) {
			reagent_id = null;
			rt.forList(f, 0, rt.fv(f, "reagents_add", rt.sv(f, "seed")));
			while (($e = rt.next(f, 0)) !== undefined) {
				reagent_id = $e;
				R = rt.index(rt.gl("chemical_reagents_list"), live(reagent_id));
				amt = (yield* g.callName(f, rt.sv(f, "reagents"), "get_reagent_amount", [live(reagent_id)]));
				reag_txt = rt.modify(live(reag_txt), fmt("\n<span class='info'>- ＀: ＀</span>", [rt.fv(f, "name", live(R)), live(amt)]), add);
			}
			rt.endFor(f, 0);
		}
		if (truthy(live(reag_txt))) {
			msg = rt.modify(live(msg), live(reag_txt), add);
			msg = rt.modify(live(msg), "<br><span class='info'>*---------*</span>", add);
		}
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), live(msg)]);
	} else {
		if (!truthy(rt.sv(f, "seed"))) return f.dot;
		_T = null;
		rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.callName(f, live(_T), "on_attackby", [live(f.src), live(f.args[0]), live(f.args[1])]);
		}
		rt.endFor(f, 0);
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/attack_self  (code/modules/hydroponics/grown.dm:84)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/attack_self", function* attack_self(f: Frame) {
	if ((truthy(rt.sv(f, "seed")) && truthy((yield* g.callName(f, rt.sv(f, "seed"), "get_gene", [T("/datum/plant_gene/trait/squash")]))))) {
		yield* g.srcCall(f, "squash", live(f.args[0]));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/throw_impact  (code/modules/hydroponics/grown.dm:89)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/throw_impact", function* throw_impact(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	if (!truthy(rt.sv(f, "seed"))) return f.dot;
	_T = null;
	rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_T = $e;
		yield* g.callName(f, live(_T), "on_throw_impact", [live(f.src), live(f.args[0])]);
	}
	rt.endFor(f, 0);
	if (!truthy((yield* g.callName(f, rt.sv(f, "seed"), "get_gene", [T("/datum/plant_gene/trait/squash")])))) return f.dot;
	yield* g.srcCall(f, "squash", live(f.args[0]));
	return f.dot;
}, true, { args: ["hit_atom"], waitfor: false });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/squash  (code/modules/hydroponics/grown.dm:97)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/squash", function* squash(f: Frame, target: Value) {
	let _T: Value = null, O: Value = null, trait: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [target, _T, O, trait, A, $e];
	_T = rt.getStep(f, live(target), 0);
	if (truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "splat_type"), T("/obj/effect/decal/cleanable/plant_smudge")])))) {
		if (truthy(rt.sv(f, "filling_color"))) {
			rt.setFv(f, "color", (O = (yield* g.new_(f, rt.sv(f, "splat_type"), [live(_T)]))), rt.sv(f, "filling_color"));
			rt.setFv(f, "name", live(O), fmt("＀ smudge", [rt.sv(f, "name")]));
		}
	} else {
		if (truthy(rt.sv(f, "splat_type"))) {
			yield* g.new_(f, rt.sv(f, "splat_type"), [live(_T)]);
		}
	}
	if (truthy(rt.sv(f, "trash"))) {
		yield* g.srcCall(f, "generate_trash", live(_T));
	}
	yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ has been squashed.</span>", [live(f.src)]), "<span class='italics'>You hear a smack.</span>");
	if (truthy(rt.sv(f, "seed"))) {
		trait = null;
		rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
		while (($e = rt.next(f, 0)) !== undefined) {
			trait = $e;
			yield* g.callName(f, live(trait), "on_squash", [live(f.src), live(target)]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(_T)]);
	A = null;
	rt.forList(f, 0, live(_T));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, rt.sv(f, "reagents"), "reaction", [live(A)]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/On_Consume  (code/modules/hydroponics/grown.dm:121)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/On_Consume", function* On_Consume(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon")) ? 1 : 0))) {
		if (truthy(rt.sv(f, "seed"))) {
			_T = null;
			rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
			while (($e = rt.next(f, 0)) !== undefined) {
				_T = $e;
				yield* g.callName(f, live(_T), "on_consume", [live(f.src), live(f.usr)]);
			}
			rt.endFor(f, 0);
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/Crossed  (code/modules/hydroponics/grown.dm:129)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/Crossed", function* Crossed(f: Frame) {
	let _T: Value = null;
	let $e: any;
	f.vars = () => [_T, $e];
	if (truthy(rt.sv(f, "seed"))) {
		_T = null;
		rt.forList(f, 0, rt.fv(f, "genes", rt.sv(f, "seed")), T("/datum/plant_gene/trait"));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			yield* g.callName(f, live(_T), "on_cross", [live(f.src), live(f.args[0])]);
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["AM"] });

// /obj/item/weapon/reagent_containers/food/snacks/grown/proc/generate_trash  (code/modules/hydroponics/grown.dm:135)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/proc/generate_trash", function* generate_trash(f: Frame) {
	if ((truthy(rt.sv(f, "trash")) && truthy((yield* g.call(f, P("/proc/ispath"), null, [rt.sv(f, "trash"), T("/obj/item/weapon/grown")]))))) {
		f.dot = (yield* g.new_(f, rt.sv(f, "trash"), [live(f.args[0]), rt.sv(f, "seed")]));
		rt.setSv(f, "trash", null);
		return live(f.dot);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["location"] });

rt.type(6258, "/obj/item/weapon/reagent_containers/food/snacks/grown/shell", "/obj/item/weapon/reagent_containers/food/snacks/grown", {});

// /obj/item/weapon/reagent_containers/food/snacks/grown/shell/proc/attack_self  (code/modules/hydroponics/grown.dm:145)  may sleep
rt.def("/obj/item/weapon/reagent_containers/food/snacks/grown/shell/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let _T: Value = null;
	f.vars = () => [user, _T];
	_T = null;
	if (!truthy(rt.sv(f, "trash"))) return f.dot;
	_T = (yield* g.srcCall(f, "generate_trash"));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	yield* g.callName(f, live(user), "putItemFromInventoryInHandIfPossible", [live(_T), rt.fv(f, "active_hand_index", live(user)), 1]);
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You open ＀'s shell, revealing ＇！.</span>", [live(f.src), live(_T)])]);
	return f.dot;
}, true);
