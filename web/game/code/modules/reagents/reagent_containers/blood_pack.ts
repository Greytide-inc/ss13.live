// From code/modules/reagents/reagent_containers/blood_pack.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(6498, "/obj/item/weapon/reagent_containers/blood", "/obj/item/weapon/reagent_containers", {
	blood_type: null,
	labelled: 0,
	volume: 200,
	name: "blood pack",
	desc: "Contains blood used for transfusion. Must be attached to an IV drip.",
	icon: rt.rsc("icons/obj/bloodpack.dmi"),
	icon_state: "empty",
});

// /obj/item/weapon/reagent_containers/blood/proc/Initialize  (code/modules/reagents/reagent_containers/blood_pack.dm:11)  may sleep
rt.def("/obj/item/weapon/reagent_containers/blood/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (rt.sv(f, "blood_type") === null) return f.dot;
	yield* g.callName(f, rt.sv(f, "reagents"), "add_reagent", ["blood", 200, rt.alist(f, ["donor", null, "viruses", null, "blood_DNA", null, "blood_type", rt.sv(f, "blood_type"), "resistances", null, "trace_chem", null])]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/blood/proc/on_reagent_change  (code/modules/reagents/reagent_containers/blood_pack.dm:18)
rt.def("/obj/item/weapon/reagent_containers/blood/proc/on_reagent_change", function on_reagent_change(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	if (truthy(rt.sv(f, "reagents"))) {
		if (((truthy((B = rt.callName(f, rt.sv(f, "reagents"), "has_reagent", ["blood"]))) && truthy(rt.fv(f, "data", live(B)))) && truthy(rt.index(rt.fv(f, "data", live(B)), "blood_type")))) {
			rt.setSv(f, "blood_type", rt.index(rt.fv(f, "data", live(B)), "blood_type"));
		} else {
			rt.setSv(f, "blood_type", null);
		}
	}
	rt.callSrc(f, "update_pack_name", []);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/reagent_containers/blood/proc/update_pack_name  (code/modules/reagents/reagent_containers/blood_pack.dm:27)
rt.def("/obj/item/weapon/reagent_containers/blood/proc/update_pack_name", function update_pack_name(f: Frame) {
	if (truthy(rt.sv(f, "labelled"))) return f.dot;
	if (truthy(rt.sv(f, "blood_type"))) {
		rt.setSv(f, "name", fmt("blood pack - ＀", [rt.sv(f, "blood_type")]));
	} else {
		rt.setSv(f, "name", "blood pack");
	}
	return f.dot;
});

// /obj/item/weapon/reagent_containers/blood/proc/update_icon  (code/modules/reagents/reagent_containers/blood_pack.dm:34)
rt.def("/obj/item/weapon/reagent_containers/blood/proc/update_icon", function update_icon(f: Frame) {
	let percent: Value = null;
	let $0: any;
	f.vars = () => [percent, $0];
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.fv(f, "total_volume", rt.sv(f, "reagents")), rt.sv(f, "volume")), 100)]));
	if (rt.inRange($0, 0, 9)) {
		rt.setSv(f, "icon_state", "empty");
	} else if (rt.inRange($0, 10, 50)) {
		rt.setSv(f, "icon_state", "half");
	} else if (rt.inRange($0, 51, 9.999999848243207e+30)) {
		rt.setSv(f, "icon_state", "full");
	}
	return f.dot;
});

rt.type(6499, "/obj/item/weapon/reagent_containers/blood/random", "/obj/item/weapon/reagent_containers/blood", {});

// /obj/item/weapon/reagent_containers/blood/random/proc/Initialize  (code/modules/reagents/reagent_containers/blood_pack.dm:44)  may sleep
rt.def("/obj/item/weapon/reagent_containers/blood/random/proc/Initialize", function* Initialize(f: Frame) {
	rt.setSv(f, "blood_type", rt.op(f, "PickUnweighted", [7], ["A+", "A-", "B+", "B-", "O+", "O-", "L"]));
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/item/weapon/reagent_containers/blood/proc/attackby  (code/modules/reagents/reagent_containers/blood_pack.dm:73)  may sleep
rt.def("/obj/item/weapon/reagent_containers/blood/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null;
	f.vars = () => [t];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/toy/crayon")) ? 1 : 0)))) {
		t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like to label the blood pack?", rt.sv(f, "name"), null, 53]));
		if (!truthy((yield* g.callName(f, live(f.args[1]), "canUseTopic", [live(f.src)])))) {
			return live(f.dot);
		}
		if (!isEqual((yield* g.callName(f, live(f.args[1]), "get_active_held_item", [])), live(f.args[0]))) {
			return live(f.dot);
		}
		if (!isEqual(rt.sv(f, "loc"), live(f.args[1]))) {
			return live(f.dot);
		}
		if (truthy(live(t))) {
			rt.setSv(f, "labelled", 1);
			rt.setSv(f, "name", fmt("blood pack - ＀", [live(t)]));
		} else {
			rt.setSv(f, "labelled", 0);
			yield* g.srcCall(f, "update_pack_name");
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
