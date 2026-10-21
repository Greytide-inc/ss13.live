// From code/game/objects/effects/decals/cleanable.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(11698, "/obj/effect/decal/cleanable", "/obj/effect/decal", {
	random_icon_states: null,
	blood_state: "",
	bloodiness: 0,
	mergeable_decal: 1,
	gender: "plural",
	layer: 2.08,
});

// /obj/effect/decal/cleanable/proc/<init>  (code/game/objects/effects/decals/cleanable.dm:4)
rt.def("/obj/effect/decal/cleanable/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "random_icon_states", rt.list());
	return f.dot;
});

// /obj/effect/decal/cleanable/proc/Initialize  (code/game/objects/effects/decals/cleanable.dm:10)  may sleep
rt.def("/obj/effect/decal/cleanable/proc/Initialize", function* Initialize(f: Frame) {
	let C: Value = null;
	let $e: any;
	f.vars = () => [C, $e];
	if ((truthy(rt.sv(f, "random_icon_states")) && rt.gt(rt.length(rt.fv(f, "random_icon_states", live(f.src))), 0))) {
		rt.setFv(f, "icon_state", live(f.src), rt.op(f, "PickUnweighted", [1], [rt.fv(f, "random_icon_states", live(f.src))]));
	}
	yield* g.srcCall(f, "create_reagents", 300);
	if ((truthy(rt.fv(f, "loc", live(f.src))) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(f.src))]))))) {
		C = null;
		rt.forList(f, 0, rt.fv(f, "loc", live(f.src)), T("/obj/effect/decal/cleanable"));
		while (($e = rt.next(f, 0)) !== undefined) {
			C = $e;
			if ((!isEqual(live(C), live(f.src)) && isEqual(rt.fv(f, "type", live(C)), rt.fv(f, "type", live(f.src))))) {
				yield* g.srcCall(f, "replace_decal", live(C));
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/effect/decal/cleanable/proc/replace_decal  (code/game/objects/effects/decals/cleanable.dm:23)  may sleep
rt.def("/obj/effect/decal/cleanable/proc/replace_decal", function* replace_decal(f: Frame, C: Value) {
	f.vars = () => [C];
	if (!truthy(rt.sv(f, "mergeable_decal"))) return f.dot;
	yield* g.call(f, P("/proc/qdel"), null, [live(C)]);
	return f.dot;
}, true);

// /obj/effect/decal/cleanable/proc/attackby  (code/game/objects/effects/decals/cleanable.dm:26)  may sleep
rt.def("/obj/effect/decal/cleanable/proc/attackby", function* attackby(f: Frame) {
	let hotness: Value = null, added_heat: Value = null;
	f.vars = () => [hotness, added_heat];
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/glass")) ? 1 : 0)) || truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/reagent_containers/food/drinks")) ? 1 : 0)))) {
		if ((truthy(rt.fv(f, "reagents", live(f.src))) && truthy(rt.fv(f, "reagents", live(f.args[0]))))) {
			f.dot = 1;
			if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.src))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ isn't thick enough to scoop up!</span>", [live(f.src)])]);
				return live(f.dot);
			}
			if (rt.ge(rt.gv(f, "total_volume", rt.fv(f, "reagents", live(f.args[0]))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", live(f.args[0]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ is full!</span>", [live(f.args[0])])]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You scoop up ＀ into ＀!</span>", [live(f.src), live(f.args[0])])]);
			yield* g.callName(f, rt.sv(f, "reagents"), "trans_to", [live(f.args[0]), rt.fv(f, "total_volume", rt.sv(f, "reagents"))]);
			if (!truthy(rt.fv(f, "total_volume", rt.sv(f, "reagents")))) {
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				return live(f.dot);
			}
		}
	}
	if (truthy((yield* g.callName(f, live(f.args[0]), "is_hot", [])))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/clothing/mask/cigarette")) ? 1 : 0))) {
			return live(f.dot);
		} else {
			hotness = (yield* g.callName(f, live(f.args[0]), "is_hot", []));
			added_heat = divide(live(hotness), 100);
			rt.setFv(f, "chem_temp", rt.fv(f, "reagents", live(f.src)), (yield* g.call(f, P("/proc/min"), null, [add(rt.gv(f, "chem_temp", rt.fv(f, "reagents", live(f.src))), live(added_heat)), live(hotness)])));
			yield* g.callName(f, rt.fv(f, "reagents", live(f.src)), "handle_reactions", []);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You heat ＀ with ＀!</span>", [live(f.src), live(f.args[0])])]);
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/effect/decal/cleanable/proc/ex_act  (code/game/objects/effects/decals/cleanable.dm:54)  may sleep
rt.def("/obj/effect/decal/cleanable/proc/ex_act", function* ex_act(f: Frame) {
	let R: Value = null;
	let $e: any;
	f.vars = () => [R, $e];
	if (truthy(rt.sv(f, "reagents"))) {
		R = null;
		rt.forList(f, 0, rt.fv(f, "reagent_list", rt.sv(f, "reagents")), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			yield* g.callName(f, live(R), "on_ex_act", []);
		}
		rt.endFor(f, 0);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { waitfor: false });

// /obj/effect/decal/cleanable/proc/fire_act  (code/game/objects/effects/decals/cleanable.dm:60)  may sleep
rt.def("/obj/effect/decal/cleanable/proc/fire_act", function* fire_act(f: Frame) {
	if (truthy(rt.sv(f, "reagents"))) {
		rt.modField(f, rt.sv(f, "reagents"), "chem_temp", 30, add);
		yield* g.callName(f, rt.sv(f, "reagents"), "handle_reactions", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["exposed_temperature", "exposed_volume"] });

// /obj/effect/decal/cleanable/proc/Crossed  (code/game/objects/effects/decals/cleanable.dm:68)
rt.def("/obj/effect/decal/cleanable/proc/Crossed", function Crossed(f: Frame, O: Value) {
	let H: Value = null, S: Value = null, add_blood: Value = null;
	f.vars = () => [H, S, add_blood];
	if (!truthy((rt.istype(live(O), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!((truthy(rt.gv(f, "shoes", (H = live(O)))) && truthy(rt.sv(f, "blood_state"))) && truthy(rt.sv(f, "bloodiness")))) return f.dot;
	S = rt.fv(f, "shoes", live(H));
	add_blood = 0;
	if (rt.ge(rt.sv(f, "bloodiness"), 100)) {
		add_blood = 100;
	} else {
		add_blood = rt.sv(f, "bloodiness");
	}
	(rt.modSrcVar(f, "bloodiness", live(add_blood), subtract));
	rt.setAt(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state"), rt.call(f, P("/proc/min"), null, [100, add(rt.index(rt.fv(f, "bloody_shoes", live(S)), rt.sv(f, "blood_state")), live(add_blood))]));
	if ((truthy(rt.sv(f, "blood_DNA")) && truthy(rt.len(f, rt.sv(f, "blood_DNA"))))) {
		rt.callName(f, live(S), "add_blood", [rt.sv(f, "blood_DNA")]);
	}
	rt.setFv(f, "blood_state", live(S), rt.sv(f, "blood_state"));
	rt.callSrc(f, "update_icon", []);
	rt.callName(f, live(H), "update_inv_shoes", []);
	return f.dot;
});

// /obj/effect/decal/cleanable/proc/can_bloodcrawl_in  (code/game/objects/effects/decals/cleanable.dm:88)
rt.def("/obj/effect/decal/cleanable/proc/can_bloodcrawl_in", function can_bloodcrawl_in(f: Frame) {
	if ((!isEqual(rt.sv(f, "blood_state"), "oil") && !isEqual(rt.sv(f, "blood_state"), "no blood whatsoever"))) {
		return rt.sv(f, "bloodiness");
	} else {
		return 0;
	}
	return f.dot;
});
