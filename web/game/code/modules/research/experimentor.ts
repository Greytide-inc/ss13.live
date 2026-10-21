// From code/modules/research/experimentor.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10972, "/obj/machinery/r_n_d/experimentor", "/obj/machinery/r_n_d", {
	recentlyExperimented: 0,
	trackedIan: null,
	trackedRuntime: null,
	badThingCoeff: 0,
	resetTime: 15,
	cloneMode: 0,
	cloneCount: 0,
	item_reactions: null,
	valid_items: null,
	critical_items: null,
	anchored: 1,
	use_power: 1,
	name: "１E.X.P.E.R.I-MENTOR",
	desc: "A \"replacement\" for the deconstructive analyzer with a slight tendency to catastrophically fail.",
	icon: rt.rsc("icons/obj/machines/heavy_lathe.dmi"),
	icon_state: "h_lathe",
	density: 1,
});

// /obj/machinery/r_n_d/experimentor/proc/<init>  (code/modules/research/experimentor.dm:33)
rt.def("/obj/machinery/r_n_d/experimentor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "item_reactions", rt.list());
	$0 = $0;
	rt.setSv(f, "valid_items", rt.list());
	$0 = $0;
	rt.setSv(f, "critical_items", rt.list());
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/ConvertReqString2List  (code/modules/research/experimentor.dm:38)
rt.def("/obj/machinery/r_n_d/experimentor/proc/ConvertReqString2List", function ConvertReqString2List(f: Frame, source_list: Value) {
	let temp_list: Value = null, O: Value = null;
	let $e: any;
	f.vars = () => [temp_list, O, $e];
	temp_list = rt.call(f, P("/proc/params2list"), null, [live(source_list)]);
	O = null;
	rt.forList(f, 0, live(temp_list));
	while (($e = rt.next(f, 0)) !== undefined) {
		O = $e;
		rt.setAt(live(temp_list), live(O), rt.call(f, P("/proc/text2num"), null, [rt.index(live(temp_list), live(O))]));
	}
	rt.endFor(f, 0);
	return live(temp_list);
});

// /obj/machinery/r_n_d/experimentor/proc/SetTypeReactions  (code/modules/research/experimentor.dm:59)
rt.def("/obj/machinery/r_n_d/experimentor/proc/SetTypeReactions", function SetTypeReactions(f: Frame) {
	let probWeight: Value = null, I: Value = null, tempCheck: Value = null;
	let $e: any;
	f.vars = () => [probWeight, I, tempCheck, $e];
	probWeight = 0;
	I = null;
	rt.forList(f, 0, rt.call(f, P("/proc/typesof"), null, [T("/obj/item")]));
	while (($e = rt.next(f, 0)) !== undefined) {
		I = $e;
		if (truthy((rt.istype(live(I), T("/obj/item/weapon/relic")) ? 1 : 0))) {
			rt.setAt(rt.sv(f, "item_reactions"), fmt("＀", [live(I)]), 7);
		} else {
			rt.setAt(rt.sv(f, "item_reactions"), fmt("＀", [live(I)]), rt.op(f, "PickUnweighted", [6], [1, 2, 3, 4, 5, 6]));
		}
		if (((truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/stock_parts")])) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/grenade/chem_grenade")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/kitchen")])))) {
			if (rt.initial(f, (tempCheck = live(I)), "icon_state") !== null) {
				rt.modSrcVar(f, "valid_items", 15, add);
				rt.modSrcVar(f, "valid_items", live(I), add);
				probWeight = rt.inc(live(probWeight), 1);
			}
		}
		if (truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/reagent_containers/food")]))) {
			if (rt.initial(f, (tempCheck = live(I)), "icon_state") !== null) {
				rt.modSrcVar(f, "valid_items", rt.call(f, P("/proc/rand"), null, [1, rt.call(f, P("/proc/max"), null, [2, subtract(35, live(probWeight))])]), add);
				rt.modSrcVar(f, "valid_items", live(I), add);
			}
		}
		if (((((((truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/construction/rcd")])) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/grenade")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/device/aicard")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/weapon/storage/backpack/holding")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/slime_extract")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/device/onetankbomb")]))) || truthy(rt.call(f, P("/proc/ispath"), null, [live(I), T("/obj/item/device/transfer_valve")])))) {
			if (rt.initial(f, (tempCheck = live(I)), "icon_state") !== null) {
				rt.modSrcVar(f, "critical_items", live(I), add);
			}
		}
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/Initialize  (code/modules/research/experimentor.dm:84)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/experimentor"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "trackedIan", rt.locateIn(f, T("/mob/living/simple_animal/pet/dog/corgi/Ian"), rt.gl("mob_list")));
	rt.setSv(f, "trackedRuntime", rt.locateIn(f, T("/mob/living/simple_animal/pet/cat/Runtime"), rt.gl("mob_list")));
	yield* g.srcCall(f, "SetTypeReactions");
	return f.dot;
}, true);

rt.type(6781, "/obj/item/weapon/circuitboard/machine/experimentor", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "E.X.P.E.R.I-MENTOR (Machine Board)",
	build_path: rt.typePath("/obj/machinery/r_n_d/experimentor"),
	origin_tech: "magnets=1;engineering=1;programming=1;biotech=1;bluespace=2",
});

// /obj/item/weapon/circuitboard/machine/experimentor/proc/<init>  (code/modules/research/experimentor.dm:96)
rt.def("/obj/item/weapon/circuitboard/machine/experimentor/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/weapon/stock_parts/scanning_module"), 1, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/weapon/stock_parts/micro_laser"), 2]));
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/RefreshParts  (code/modules/research/experimentor.dm:102)
rt.def("/obj/machinery/r_n_d/experimentor/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((rt.gt(rt.sv(f, "resetTime"), 0) && rt.ge(subtract(rt.sv(f, "resetTime"), rt.fv(f, "rating", live(M))), 1))) {
			(rt.modSrcVar(f, "resetTime", rt.fv(f, "rating", live(M)), subtract));
		}
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/scanning_module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modSrcVar(f, "badThingCoeff", multiply(rt.fv(f, "rating", live(M)), 2), add);
	}
	rt.endFor(f, 0);
	M = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/micro_laser"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		rt.modSrcVar(f, "badThingCoeff", rt.fv(f, "rating", live(M)), add);
	}
	rt.endFor(f, 0);
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/checkCircumstances  (code/modules/research/experimentor.dm:112)
rt.def("/obj/machinery/r_n_d/experimentor/proc/checkCircumstances", function checkCircumstances(f: Frame, O: Value) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((rt.istype(live(O), T("/obj/item/device/transfer_valve")) ? 1 : 0))) {
		if (((!truthy(rt.gv(f, "tank_one", (_T = live(O)))) || !truthy(rt.fv(f, "tank_two", live(_T)))) || !truthy(rt.fv(f, "attached_device", live(_T))))) {
			return 0;
		}
	}
	return 1;
});

// /obj/machinery/r_n_d/experimentor/proc/Insert_Item  (code/modules/research/experimentor.dm:119)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/Insert_Item", function* Insert_Item(f: Frame, O: Value, user: Value) {
	let temp_tech: Value = null;
	f.vars = () => [O, user, temp_tech];
	if (isEqual(rt.fv(f, "a_intent", live(user)), "harm")) return f.dot;
	f.dot = 1;
	if (!truthy((yield* g.srcCall(f, "is_insertion_ready", live(user))))) {
		return live(f.dot);
	}
	if (!truthy((yield* g.srcCall(f, "checkCircumstances", live(O))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>The ＀ is not yet valid for the ＀ and must be completed!</span>", [live(O), live(f.src)])]);
		return live(f.dot);
	}
	if (!truthy(rt.fv(f, "origin_tech", live(O)))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>This doesn't seem to have a tech origin!</span>"]);
		return live(f.dot);
	}
	if (isEqual(rt.getLen(f, (temp_tech = (yield* g.srcCall(f, "ConvertReqString2List", rt.fv(f, "origin_tech", live(O)))))), 0)) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You cannot experiment on this item!</span>"]);
		return live(f.dot);
	}
	if (!truthy((yield* g.callName(f, live(user), "drop_item", [])))) {
		return live(f.dot);
	}
	rt.setSv(f, "loaded_item", live(O));
	rt.setFv(f, "loc", live(O), live(f.src));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You add the ＀ to the machine.</span>", [rt.fv(f, "name", live(O))])]);
	yield* g.call(f, P("/proc/flick"), null, ["h_lathe_load", live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/experimentor/proc/default_deconstruction_crowbar  (code/modules/research/experimentor.dm:143)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame, O: Value) {
	f.vars = () => [O];
	yield* g.srcCall(f, "ejectItem");
	yield* g.callSuper(f, [live(O)]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/experimentor/proc/attack_hand  (code/modules/research/experimentor.dm:147)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let dat: Value = null, D: Value = null, _T: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, D, _T, popup, $e];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<center>";
	if (!truthy(rt.sv(f, "linked_console"))) {
		dat = rt.modify(live(dat), fmt("<b><a href='byond://?src=＃;function=search'>Scan for R&D Console</A></b><br>", [live(f.src)]), add);
	}
	if (truthy(rt.sv(f, "loaded_item"))) {
		dat = rt.modify(live(dat), fmt("<b>Loaded Item:</b> ＀<br>", [rt.sv(f, "loaded_item")]), add);
		dat = rt.modify(live(dat), "<b>Technology</b>:<br>", add);
		D = (yield* g.srcCall(f, "ConvertReqString2List", rt.fv(f, "origin_tech", rt.sv(f, "loaded_item"))));
		_T = null;
		rt.forList(f, 0, live(D));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			dat = rt.modify(live(dat), fmt("＀<br>", [live(_T)]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "<br><br>Available tests:", add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Poke</A></b>", [live(f.src), rt.sv(f, "loaded_item"), 1]), add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀;'>Irradiate</A></b>", [live(f.src), rt.sv(f, "loaded_item"), 2]), add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Gas</A></b>", [live(f.src), rt.sv(f, "loaded_item"), 3]), add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Burn</A></b>", [live(f.src), rt.sv(f, "loaded_item"), 4]), add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Freeze</A></b>", [live(f.src), rt.sv(f, "loaded_item"), 5]), add);
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Destroy</A></b><br>", [live(f.src), rt.sv(f, "loaded_item"), 6]), add);
		if (truthy((rt.istype(rt.sv(f, "loaded_item"), T("/obj/item/weapon/relic")) ? 1 : 0))) {
			dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;item=＃;function=＀'>Discover</A></b><br>", [live(f.src), rt.sv(f, "loaded_item"), 7]), add);
		}
		dat = rt.modify(live(dat), fmt("<br><b><a href='byond://?src=＃;function=eject'>Eject</A>", [live(f.src)]), add);
	} else {
		dat = rt.modify(live(dat), "<b>Nothing loaded.</b>", add);
	}
	dat = rt.modify(live(dat), fmt("<br><a href='byond://?src=＃;function=refresh'>Refresh</A><br>", [live(f.src)]), add);
	dat = rt.modify(live(dat), fmt("<br><a href='byond://?src=＃;close=1'>Close</A><br></center>", [live(f.src)]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "experimentor", "Experimentor", 700, 400, live(f.src)]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "experimentor"]);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/experimentor/proc/matchReaction  (code/modules/research/experimentor.dm:178)
rt.def("/obj/machinery/r_n_d/experimentor/proc/matchReaction", function matchReaction(f: Frame, matching: Value, reaction: Value) {
	let D: Value = null, tor: Value = null;
	f.vars = () => [D, tor];
	if (truthy((D = live(matching)))) {
		if (truthy(rt.callName(f, rt.sv(f, "item_reactions"), "Find", [fmt("＀", [rt.fv(f, "type", live(D))])]))) {
			if (isEqual((tor = rt.index(rt.sv(f, "item_reactions"), fmt("＀", [rt.fv(f, "type", live(D))]))), rt.call(f, P("/proc/text2num"), null, [live(reaction)]))) {
				return live(tor);
			} else {
				return 8;
			}
		} else {
			return 8;
		}
	} else {
		return 8;
	}
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/ejectItem  (code/modules/research/experimentor.dm:193)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/ejectItem", function* ejectItem(f: Frame, _delete: Value) {
	let type_to_make: Value = null, dropturf: Value = null;
	f.vars = () => [_delete, type_to_make, dropturf];
	if (live(_delete) === null) {
		_delete = 0;
	}
	if (!truthy(rt.sv(f, "loaded_item"))) return f.dot;
	if ((truthy(rt.sv(f, "cloneMode")) && rt.gt(rt.sv(f, "cloneCount"), 0))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>A duplicate ＀ pops out!</span>", [rt.sv(f, "loaded_item")]));
		type_to_make = rt.fv(f, "type", rt.sv(f, "loaded_item"));
		yield* g.new_(f, live(type_to_make), [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]), 0)]);
		rt.incSrcVar(f, "cloneCount", -1, false);
		if (isEqual(rt.sv(f, "cloneCount"), 0)) {
			rt.setSv(f, "cloneMode", 0);
		}
		return live(f.dot);
	}
	if (!truthy((dropturf = rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/view"), null, [1, live(f.src)]))]), 0)))) {
		dropturf = rt.getStep(f, live(f.src), 0);
	}
	rt.setFv(f, "loc", rt.sv(f, "loaded_item"), live(dropturf));
	if (truthy(live(_delete))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "loaded_item")]);
	}
	rt.setSv(f, "loaded_item", null);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/experimentor/proc/throwSmoke  (code/modules/research/experimentor.dm:210)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/throwSmoke", function* throwSmoke(f: Frame, where: Value) {
	let smoke: Value = null;
	f.vars = () => [where, smoke];
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, live(where)]);
	yield* g.callName(f, live(smoke), "start", []);
	return f.dot;
}, true);

// /obj/machinery/r_n_d/experimentor/proc/pickWeighted  (code/modules/research/experimentor.dm:217)
rt.def("/obj/machinery/r_n_d/experimentor/proc/pickWeighted", function pickWeighted(f: Frame, from: Value) {
	let result: Value = null, counter: Value = null, probtocheck: Value = null;
	f.vars = () => [result, counter, probtocheck];
	result = 0;
	counter = 1;
	while (!truthy(live(result))) {
		if (truthy(rt.op(f, "Prob", [], [(probtocheck = rt.index(live(from), live(counter)))]))) {
			result = 1;
			return rt.index(live(from), add(live(counter), 1));
		}
		if (rt.lt(add(live(counter), 2), rt.len(f, live(from)))) {
			counter = add(live(counter), 2);
		} else {
			counter = 1;
		}
	}
	return f.dot;
});

// /obj/machinery/r_n_d/experimentor/proc/experiment  (code/modules/research/experimentor.dm:229)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/experiment", function* experiment(f: Frame, exp: Value, exp_on: Value) {
	let chosenchem: Value = null, criticalReaction: Value = null, m: Value = null, target: Value = null, throwing: Value = null, _T: Value = null, reagentdecal: Value = null, savedName: Value = null, newPath: Value = null, CG: Value = null, R: Value = null, smoke: Value = null, C: Value = null, start: Value = null, M: Value = null, MT: Value = null, FB: Value = null, env: Value = null, transfer_moles: Value = null, removed: Value = null, heat_capacity: Value = null, smoke_2: Value = null, material: Value = null, AM: Value = null, throwAt: Value = null, AM_3: Value = null, counter: Value = null, cast: Value = null, a: Value = null, b: Value = null, globalMalf: Value = null, m_3: Value = null;
	let $0: any, $e: any;
	f.vars = () => [exp, exp_on, chosenchem, criticalReaction, m, target, throwing, _T, reagentdecal, savedName, newPath, CG, R, smoke, C, start, M, MT, FB, env, transfer_moles, removed, heat_capacity, smoke_2, material, AM, throwAt, AM_3, counter, cast, a, b, globalMalf, m_3, $0, $e];
	rt.setSv(f, "recentlyExperimented", 1);
	rt.setSv(f, "icon_state", "h_lathe_wloop");
	chosenchem = null;
	if (truthy((rt.isIn(f, rt.fv(f, "type", live(exp_on)), rt.sv(f, "critical_items")) ? 1 : 0))) {
		$0 = 1;
	} else {
		$0 = 0;
	}
	criticalReaction = $0;
	if (isEqual(live(exp), 1)) {
		yield* g.srcCall(f, "visible_message", fmt("＀ prods at ＀ with mechanical arms.", [live(f.src), live(exp_on)]));
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("＀ is gripped in just the right way, enhancing its focus.", [live(exp_on)]));
			rt.incSrcVar(f, "badThingCoeff", 1, true);
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions and destroys ＀, lashing its arms out at nearby people!</span>", [live(f.src), live(exp_on)]));
				m = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)])), T("/mob/living"));
				while (($e = rt.next(f, 0)) !== undefined) {
					m = $e;
					yield* g.callName(f, live(m), "apply_damage", [15, "brute", rt.op(f, "PickUnweighted", [3], ["head", "chest", "groin"])]);
					yield* g.srcCall(f, "investigate_log", fmt("Experimentor dealt minor brute to ＀.", [live(m)]), "experimentor");
				}
				rt.endFor(f, 0);
				yield* g.srcCall(f, "ejectItem", 1);
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions!</span>", [live(f.src)]));
					exp = 6;
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
						yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions, throwing the ＀!</span>", [live(f.src), live(exp_on)]));
						if (truthy((target = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/oview"), null, [7, live(f.src)])))))) {
							throwing = rt.sv(f, "loaded_item");
							yield* g.srcCall(f, "investigate_log", fmt("Experimentor has thrown ＀ at ＀", [rt.sv(f, "loaded_item"), live(target)]), "experimentor");
							yield* g.srcCall(f, "ejectItem");
							if (truthy(live(throwing))) {
								yield* g.callName(f, live(throwing), "throw_at", [live(target), 10, 1]);
							}
						}
					}
				}
			}
		}
	}
	if (isEqual(live(exp), 2)) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ reflects radioactive rays at ＀!</span>", [live(f.src), live(exp_on)]));
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("＀ has activated an unknown subroutine!", [live(exp_on)]));
			rt.setSv(f, "cloneMode", 1);
			rt.setSv(f, "cloneCount", rt.sv(f, "badThingCoeff"));
			yield* g.srcCall(f, "investigate_log", fmt("Experimentor has made a clone of ＀", [live(exp_on)]), "experimentor");
			yield* g.srcCall(f, "ejectItem");
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions, melting ＀ and leaking radiation!</span>", [live(f.src), live(exp_on)]));
				yield* g.call(f, P("/proc/radiation_pulse"), null, [rt.getStep(f, live(f.src), 0), 1, 1, 25, 1]);
				yield* g.srcCall(f, "ejectItem", 1);
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, spewing toxic waste!</span>", [live(f.src)]));
					_T = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)])), T("/turf"));
					while (($e = rt.next(f, 0)) !== undefined) {
						_T = $e;
						if (!truthy(rt.fv(f, "density", live(_T)))) {
							if (truthy(rt.op(f, "Prob", [], [95]))) {
								yield* g.callName(f, rt.gv(f, "reagents", (reagentdecal = (yield* g.new_(f, T("/obj/effect/decal/cleanable/greenglow"), [live(_T)])))), "add_reagent", ["radium", 7]);
							}
						}
					}
					rt.endFor(f, 0);
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
						savedName = fmt("＀", [live(exp_on)]);
						yield* g.srcCall(f, "ejectItem", 1);
						newPath = (yield* g.srcCall(f, "pickWeighted", rt.sv(f, "valid_items")));
						rt.setSv(f, "loaded_item", (yield* g.new_(f, live(newPath), [live(f.src)])));
						yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, transforming ＀ into ＀!</span>", [live(f.src), live(savedName), rt.sv(f, "loaded_item")]));
						yield* g.srcCall(f, "investigate_log", fmt("Experimentor has transformed ＀ into ＀", [live(savedName), rt.sv(f, "loaded_item")]), "experimentor");
						if (truthy((rt.istype(rt.sv(f, "loaded_item"), T("/obj/item/weapon/grenade/chem_grenade")) ? 1 : 0))) {
							yield* g.callName(f, (CG = rt.sv(f, "loaded_item")), "prime", []);
						}
						yield* g.srcCall(f, "ejectItem");
					}
				}
			}
		}
	}
	if (isEqual(live(exp), 3)) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ fills its chamber with gas, ＀ included.</span>", [live(f.src), live(exp_on)]));
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("＀ achieves the perfect mix!", [live(exp_on)]));
			yield* g.new_(f, T("/obj/item/stack/sheet/mineral/plasma"), [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]), 0)]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ destroys ＀, leaking dangerous gas!</span>", [live(f.src), live(exp_on)]));
				chosenchem = rt.op(f, "PickUnweighted", [8], ["carbon", "radium", "toxin", "condensedcapsaicin", "mushroomhallucinogen", "space_drugs", "ethanol", "beepskysmash"]);
				rt.setFv(f, "my_atom", (R = (yield* g.new_(f, T("/datum/reagents"), [50]))), live(f.src));
				yield* g.callName(f, live(R), "add_reagent", [live(chosenchem), 50]);
				yield* g.srcCall(f, "investigate_log", fmt("Experimentor has released ＀ smoke.", [live(chosenchem)]), "experimentor");
				yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, live(R), null, 0, null, live(f.src), "silent", 1], rt.Args.Named);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
				yield* g.callName(f, live(smoke), "start", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
				yield* g.srcCall(f, "ejectItem", 1);
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s chemical chamber has sprung a leak!</span>", [live(f.src)]));
					chosenchem = rt.op(f, "PickUnweighted", [3], ["mutationtoxin", "nanomachines", "sacid"]);
					rt.setFv(f, "my_atom", (R = (yield* g.new_(f, T("/datum/reagents"), [50]))), live(f.src));
					yield* g.callName(f, live(R), "add_reagent", [live(chosenchem), 50]);
					yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, live(R), null, 0, null, live(f.src), "silent", 1], rt.Args.Named);
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
					yield* g.callName(f, live(smoke), "start", []);
					yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
					yield* g.srcCall(f, "ejectItem", 1);
					yield* g.srcCall(f, "warn_admins", live(f.usr), fmt("＀ smoke", [live(chosenchem)]));
					yield* g.srcCall(f, "investigate_log", fmt("Experimentor has released <font color='red'>＀</font> smoke!", [live(chosenchem)]), "experimentor");
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
						yield* g.srcCall(f, "visible_message", fmt("＀ malfunctions, spewing harmless gas.", [live(f.src)]));
						yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", live(f.src)));
					} else {
						if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
							yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ melts ＀, ionizing the air around it!</span>", [live(f.src), live(exp_on)]));
							yield* g.call(f, P("/proc/empulse"), null, [rt.fv(f, "loc", live(f.src)), 4, 6]);
							yield* g.srcCall(f, "investigate_log", "Experimentor has generated an Electromagnetic Pulse.", "experimentor");
							yield* g.srcCall(f, "ejectItem", 1);
						}
					}
				}
			}
		}
	}
	if (isEqual(live(exp), 4)) {
		yield* g.srcCall(f, "visible_message", fmt("＀ raises ＀'s temperature.", [live(f.src), live(exp_on)]));
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s emergency coolant system gives off a small ding!</span>", [live(f.src)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
			C = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]), 0)]));
			chosenchem = rt.op(f, "PickUnweighted", [3], ["plasma", "capsaicin", "ethanol"]);
			yield* g.callName(f, rt.fv(f, "reagents", live(C)), "remove_any", [25]);
			yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", [live(chosenchem), 50]);
			rt.setFv(f, "name", live(C), "Cup of Suspicious Liquid");
			rt.setFv(f, "desc", live(C), "It has a large hazard symbol printed on the side in fading ink.");
			yield* g.srcCall(f, "investigate_log", fmt("Experimentor has made a cup of ＀ coffee.", [live(chosenchem)]), "experimentor");
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				start = rt.getStep(f, live(f.src), 0);
				M = rt.locateIn(f, T("/mob/living"), (yield* g.call(f, P("/proc/view"), null, [live(f.src), 3])));
				if (truthy((MT = rt.getStep(f, live(M), 0)))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ dangerously overheats, launching a flaming fuel orb!</span>", [live(f.src)]));
					yield* g.srcCall(f, "investigate_log", fmt("Experimentor has launched a <font color='red'>fireball</font> at ＀!", [live(M)]), "experimentor");
					rt.setFv(f, "original", (FB = (yield* g.new_(f, T("/obj/item/projectile/magic/aoe/fireball"), [live(start)]))), live(MT));
					rt.setFv(f, "current", live(FB), live(start));
					rt.setFv(f, "yo", live(FB), subtract(rt.fv(f, "y", live(MT)), rt.fv(f, "y", live(start))));
					rt.setFv(f, "xo", live(FB), subtract(rt.fv(f, "x", live(MT)), rt.fv(f, "x", live(start))));
					yield* g.callName(f, live(FB), "fire", []);
				}
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions, melting ＀ and releasing a burst of flame!</span>", [live(f.src), live(exp_on)]));
					yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.src)), null, -1, null, 0, null, 0, null, 0, null, 0, "flame_range", 2], rt.Args.Named);
					yield* g.srcCall(f, "investigate_log", "Experimentor started a fire.", "experimentor");
					yield* g.srcCall(f, "ejectItem", 1);
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
						yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, melting ＀ and leaking hot air!</span>", [live(f.src), live(exp_on)]));
						env = (yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "return_air", []));
						transfer_moles = multiply(0.25, (yield* g.callName(f, live(env), "total_moles", [])));
						if (truthy((removed = (yield* g.callName(f, live(env), "remove", [live(transfer_moles)]))))) {
							if ((isEqual((heat_capacity = (yield* g.callName(f, live(removed), "heat_capacity", []))), 0) || live(heat_capacity) === null)) {
								heat_capacity = 1;
							}
							rt.setFv(f, "temperature", live(removed), (yield* g.call(f, P("/proc/min"), null, [divide(add(multiply(rt.fv(f, "temperature", live(removed)), live(heat_capacity)), 100000), live(heat_capacity)), 1000])));
						}
						yield* g.callName(f, live(env), "merge", [live(removed)]);
						yield* g.srcCall(f, "air_update_turf");
						yield* g.srcCall(f, "investigate_log", "Experimentor has released hot air.", "experimentor");
						yield* g.srcCall(f, "ejectItem", 1);
					} else {
						if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
							yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, activating its emergency coolant systems!</span>", [live(f.src)]));
							yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", live(f.src)));
							m = null;
							rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)])), T("/mob/living"));
							while (($e = rt.next(f, 0)) !== undefined) {
								m = $e;
								yield* g.callName(f, live(m), "apply_damage", [5, "fire", rt.op(f, "PickUnweighted", [3], ["head", "chest", "groin"])]);
								yield* g.srcCall(f, "investigate_log", fmt("Experimentor has dealt minor burn damage to ＀", [live(m)]), "experimentor");
							}
							rt.endFor(f, 0);
							yield* g.srcCall(f, "ejectItem");
						}
					}
				}
			}
		}
	}
	if (isEqual(live(exp), 5)) {
		yield* g.srcCall(f, "visible_message", fmt("＀ lowers ＀'s temperature.", [live(f.src), live(exp_on)]));
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s emergency coolant system gives off a small ding!</span>", [live(f.src)]));
			C = (yield* g.new_(f, T("/obj/item/weapon/reagent_containers/food/drinks/coffee"), [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]), 0)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/ding.ogg"), 50, 1]);
			chosenchem = rt.op(f, "PickUnweighted", [3], ["uranium", "frostoil", "ephedrine"]);
			yield* g.callName(f, rt.fv(f, "reagents", live(C)), "remove_any", [25]);
			yield* g.callName(f, rt.fv(f, "reagents", live(C)), "add_reagent", [live(chosenchem), 50]);
			rt.setFv(f, "name", live(C), "Cup of Suspicious Liquid");
			rt.setFv(f, "desc", live(C), "It has a large hazard symbol printed on the side in fading ink.");
			yield* g.srcCall(f, "investigate_log", fmt("Experimentor has made a cup of ＀ coffee.", [live(chosenchem)]), "experimentor");
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ malfunctions, shattering ＀ and releasing a dangerous cloud of coolant!</span>", [live(f.src), live(exp_on)]));
				rt.setFv(f, "my_atom", (R = (yield* g.new_(f, T("/datum/reagents"), [50]))), live(f.src));
				yield* g.callName(f, live(R), "add_reagent", ["frostoil", 50]);
				yield* g.srcCall(f, "investigate_log", "Experimentor has released frostoil gas.", "experimentor");
				yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread/chem"), []))), "set_up", [null, live(R), null, 0, null, live(f.src), "silent", 1], rt.Args.Named);
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/smoke.ogg"), 50, 1, -3]);
				yield* g.callName(f, live(smoke), "start", []);
				yield* g.call(f, P("/proc/qdel"), null, [live(R)]);
				yield* g.srcCall(f, "ejectItem", 1);
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, shattering ＀ and leaking cold air!</span>", [live(f.src), live(exp_on)]));
					env = (yield* g.callName(f, rt.fv(f, "loc", live(f.src)), "return_air", []));
					transfer_moles = multiply(0.25, (yield* g.callName(f, live(env), "total_moles", [])));
					if (truthy((removed = (yield* g.callName(f, live(env), "remove", [live(transfer_moles)]))))) {
						if ((isEqual((heat_capacity = (yield* g.callName(f, live(removed), "heat_capacity", []))), 0) || live(heat_capacity) === null)) {
							heat_capacity = 1;
						}
						rt.setFv(f, "temperature", live(removed), divide(subtract(multiply(rt.fv(f, "temperature", live(removed)), live(heat_capacity)), 75000), live(heat_capacity)));
					}
					yield* g.callName(f, live(env), "merge", [live(removed)]);
					yield* g.srcCall(f, "air_update_turf");
					yield* g.srcCall(f, "investigate_log", "Experimentor has released cold air.", "experimentor");
					yield* g.srcCall(f, "ejectItem", 1);
				} else {
					if (truthy(rt.op(f, "Prob", [], [subtract(50, rt.sv(f, "badThingCoeff"))]))) {
						yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ malfunctions, releasing a flurry of chilly air as ＀ pops out!</span>", [live(f.src), live(exp_on)]));
						yield* g.callName(f, (smoke_2 = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.fv(f, "loc", live(f.src))]);
						yield* g.callName(f, live(smoke_2), "start", []);
						yield* g.srcCall(f, "ejectItem");
					}
				}
			}
		}
	}
	if (isEqual(live(exp), 6)) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ activates the crushing mechanism, ＀ is destroyed!</span>", [live(exp_on), live(exp_on)]));
		if (truthy(rt.fv(f, "linked_lathe", rt.sv(f, "linked_console")))) {
			material = null;
			rt.forList(f, 0, rt.fv(f, "materials", live(exp_on)));
			while (($e = rt.next(f, 0)) !== undefined) {
				material = $e;
				yield* g.callName(f, rt.gv(f, "materials", rt.fv(f, "linked_lathe", rt.sv(f, "linked_console"))), "insert_amount", [(yield* g.call(f, P("/proc/min"), null, [subtract(rt.gv(f, "max_amount", rt.gv(f, "materials", rt.fv(f, "linked_lathe", rt.sv(f, "linked_console")))), rt.gv(f, "total_amount", rt.gv(f, "materials", rt.fv(f, "linked_lathe", rt.sv(f, "linked_console"))))), rt.index(rt.fv(f, "materials", live(exp_on)), live(material))])), live(material)]);
			}
			rt.endFor(f, 0);
		}
		if ((truthy(rt.op(f, "Prob", [], [35])) && truthy(live(criticalReaction)))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s crushing mechanism slowly and smoothly descends, flattening the ＀!</span>", [live(f.src), live(exp_on)]));
			yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.getStep(f, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [1, live(f.src)]))]), 0)]);
		} else {
			if (truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))]))) {
				yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s crusher goes way too many levels too high, crushing right through space-time!</span>", [live(f.src)]));
				yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/supermatter.ogg"), 50, 1, -3]);
				yield* g.srcCall(f, "investigate_log", "Experimentor has triggered the 'throw things' reaction.", "experimentor");
				AM = null;
				rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [7, live(f.src)])), T("/atom/movable"));
				while (($e = rt.next(f, 0)) !== undefined) {
					AM = $e;
					if (!truthy(rt.fv(f, "anchored", live(AM)))) {
						yield* g.callName(f, live(AM), "throw_at", [live(f.src), 10, 1]);
					}
				}
				rt.endFor(f, 0);
			} else {
				if (truthy(rt.op(f, "Prob", [], [subtract(35, rt.sv(f, "badThingCoeff"))]))) {
					yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀'s crusher goes one level too high, crushing right into space-time!</span>", [live(f.src)]));
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/supermatter.ogg"), 50, 1, -3]);
					yield* g.srcCall(f, "investigate_log", "Experimentor has triggered the 'minor throw things' reaction.", "experimentor");
					throwAt = rt.list();
					AM_3 = null;
					rt.forList(f, 0, (yield* g.call(f, P("/proc/oview"), null, [7, live(f.src)])), T("/atom/movable"));
					while (($e = rt.next(f, 0)) !== undefined) {
						AM_3 = $e;
						if (!truthy(rt.fv(f, "anchored", live(AM_3)))) {
							yield* g.callName(f, live(throwAt), "Add", [live(AM_3)]);
						}
					}
					rt.endFor(f, 0);
					counter = null;
					counter = 1;
					while (rt.lt(live(counter), rt.len(f, live(throwAt)))) {
						yield* g.callName(f, (cast = rt.index(live(throwAt), live(counter))), "throw_at", [rt.op(f, "PickUnweighted", [1], [live(throwAt)]), 10, 1]);
						counter = rt.inc(live(counter), 1);
					}
				}
			}
		}
		yield* g.srcCall(f, "ejectItem", 1);
	}
	if (isEqual(live(exp), 8)) {
		a = rt.op(f, "PickUnweighted", [4], ["rumbles", "shakes", "vibrates", "shudders"]);
		b = rt.op(f, "PickUnweighted", [5], ["crushes", "spins", "viscerates", "smashes", "insults"]);
		yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ ＀, and ＀, the experiment was a failure.</span>", [live(exp_on), live(a), live(b)]));
	}
	if (isEqual(live(exp), 7)) {
		yield* g.srcCall(f, "visible_message", fmt("＀ scans the ＀, revealing its true nature!", [live(f.src), live(exp_on)]));
		yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/supermatter.ogg"), 50, 3, -1]);
		yield* g.callName(f, (R = rt.sv(f, "loaded_item")), "reveal", []);
		yield* g.srcCall(f, "investigate_log", fmt("Experimentor has revealed a relic with <span class='danger'>＀</span> effect.", [rt.fv(f, "realProc", live(R))]), "experimentor");
		yield* g.srcCall(f, "ejectItem");
	}
	if ((truthy(rt.op(f, "Prob", [], [subtract(20, rt.sv(f, "badThingCoeff"))])) && truthy(rt.sv(f, "loaded_item")))) {
		if (rt.lt((globalMalf = (yield* g.call(f, P("/proc/rand"), null, [1, 100]))), 15)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀'s onboard detection system has malfunctioned!</span>", [live(f.src)]));
			rt.setAt(rt.sv(f, "item_reactions"), fmt("＀", [rt.fv(f, "type", live(exp_on))]), rt.op(f, "PickUnweighted", [6], [1, 2, 3, 4, 5, 6]));
			yield* g.srcCall(f, "ejectItem");
		}
		if ((rt.gt(live(globalMalf), 16) && rt.lt(live(globalMalf), 35))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ melts ＀, ian-izing the air around it!</span>", [live(f.src), live(exp_on)]));
			yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", live(f.src)));
			if (truthy(rt.sv(f, "trackedIan"))) {
				yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", rt.sv(f, "trackedIan")));
				rt.setFv(f, "loc", rt.sv(f, "trackedIan"), rt.fv(f, "loc", live(f.src)));
				yield* g.srcCall(f, "investigate_log", "Experimentor has stolen Ian!", "experimentor");
			} else {
				yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi"), [rt.fv(f, "loc", live(f.src))]);
				yield* g.srcCall(f, "investigate_log", "Experimentor has spawned a new corgi.", "experimentor");
			}
			yield* g.srcCall(f, "ejectItem", 1);
		}
		if ((rt.gt(live(globalMalf), 36) && rt.lt(live(globalMalf), 50))) {
			yield* g.srcCall(f, "visible_message", "<span class='warning'>Experimentor draws the life essence of those nearby!</span>");
			m_3 = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/view"), null, [4, live(f.src)])), T("/mob/living"));
			while (($e = rt.next(f, 0)) !== undefined) {
				m_3 = $e;
				yield* g.call(f, P("/proc/to_chat"), null, [live(m_3), fmt("<span class='danger'>You feel your flesh being torn from you, mists of blood drifting to ＀!</span>", [live(f.src)])]);
				yield* g.callName(f, live(m_3), "apply_damage", [50, "brute", "chest"]);
				yield* g.srcCall(f, "investigate_log", fmt("Experimentor has taken 50 brute a blood sacrifice from ＀", [live(m_3)]), "experimentor");
			}
			rt.endFor(f, 0);
		}
		if ((rt.gt(live(globalMalf), 51) && rt.lt(live(globalMalf), 75))) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ encounters a run-time error!</span>", [live(f.src)]));
			yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", live(f.src)));
			if (truthy(rt.sv(f, "trackedRuntime"))) {
				yield* g.srcCall(f, "throwSmoke", rt.fv(f, "loc", rt.sv(f, "trackedRuntime")));
				rt.setFv(f, "loc", rt.sv(f, "trackedRuntime"), rt.fv(f, "loc", live(f.src)));
				yield* g.srcCall(f, "investigate_log", "Experimentor has stolen Runtime!", "experimentor");
			} else {
				yield* g.new_(f, T("/mob/living/simple_animal/pet/cat"), [rt.fv(f, "loc", live(f.src))]);
				yield* g.srcCall(f, "investigate_log", "Experimentor failed to steal runtime, and instead spawned a new cat.", "experimentor");
			}
			yield* g.srcCall(f, "ejectItem", 1);
		}
		if (rt.gt(live(globalMalf), 76)) {
			yield* g.srcCall(f, "visible_message", fmt("<span class='warning'>＀ begins to smoke and hiss, shaking violently!</span>", [live(f.src)]));
			yield* g.srcCall(f, "use_power", 500000);
			yield* g.srcCall(f, "investigate_log", "Experimentor has drained power from its APC", "experimentor");
		}
	}
	rt.spawnTail(f, rt.sv(f, "resetTime"), "/obj/machinery/r_n_d/experimentor/proc/experiment: spawn at modules/research/experimentor.dm:507", exp, exp_on, chosenchem, criticalReaction, m, target, throwing, _T, reagentdecal, savedName, newPath, CG, R, smoke, C, start, M, MT, FB, env, transfer_moles, removed, heat_capacity, smoke_2, material, AM, throwAt, AM_3, counter, cast, a, b, globalMalf, m_3);
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[171])) body of /obj/machinery/r_n_d/experimentor/proc/experiment, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/r_n_d/experimentor/proc/experiment: spawn at modules/research/experimentor.dm:507", function* (f: Frame, exp: Value, exp_on: Value, chosenchem: Value, criticalReaction: Value, m: Value, target: Value, throwing: Value, _T: Value, reagentdecal: Value, savedName: Value, newPath: Value, CG: Value, R: Value, smoke: Value, C: Value, start: Value, M: Value, MT: Value, FB: Value, env: Value, transfer_moles: Value, removed: Value, heat_capacity: Value, smoke_2: Value, material: Value, AM: Value, throwAt: Value, AM_3: Value, counter: Value, cast: Value, a: Value, b: Value, globalMalf: Value, m_3: Value) {
	f.vars = () => [exp, exp_on, chosenchem, criticalReaction, m, target, throwing, _T, reagentdecal, savedName, newPath, CG, R, smoke, C, start, M, MT, FB, env, transfer_moles, removed, heat_capacity, smoke_2, material, AM, throwAt, AM_3, counter, cast, a, b, globalMalf, m_3];
	rt.setSv(f, "icon_state", "h_lathe");
	rt.setSv(f, "recentlyExperimented", 0);
	return null;
});

// /obj/machinery/r_n_d/experimentor/proc/Topic  (code/modules/research/experimentor.dm:512)  may sleep
rt.def("/obj/machinery/r_n_d/experimentor/proc/Topic", function* Topic(f: Frame) {
	let scantype: Value = null, process: Value = null, D: Value = null, dotype: Value = null, temp_tech: Value = null, _T: Value = null;
	let $e: any;
	f.vars = () => [scantype, process, D, dotype, temp_tech, _T, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	scantype = rt.at(live(f.args[1]), "function");
	process = rt.locateIn(f, rt.at(live(f.args[1]), "item"), live(f.src));
	if (truthy(rt.at(live(f.args[1]), "close"))) {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=experimentor"], false);
		return live(f.dot);
	} else {
		if (isEqual(live(scantype), "search")) {
			if (truthy((D = rt.locateIn(f, T("/obj/machinery/computer/rdconsole"), (yield* g.call(f, P("/proc/oview"), null, [3, live(f.src)])))))) {
				rt.setSv(f, "linked_console", live(D));
			}
		} else {
			if (isEqual(live(scantype), "eject")) {
				yield* g.srcCall(f, "ejectItem");
			} else {
				if (isEqual(live(scantype), "refresh")) {
					yield* g.callName(f, live(f.src), "updateUsrDialog", []);
				} else {
					if (truthy(rt.sv(f, "recentlyExperimented"))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ has been used too recently!</span>", [live(f.src)])]);
						return live(f.dot);
					} else {
						if (!truthy(rt.sv(f, "loaded_item"))) {
							yield* g.srcCall(f, "updateUsrDialog");
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='warning'>＀ is not currently loaded!</span>", [live(f.src)])]);
							return live(f.dot);
						} else {
							if ((!truthy(live(process)) || !isEqual(live(process), rt.sv(f, "loaded_item")))) {
								yield* g.srcCall(f, "updateUsrDialog");
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='danger'>Interface failure detected in ＀. Please try again.</span>", [live(f.src)])]);
								return live(f.dot);
							}
						}
					}
					dotype = null;
					if (isEqual((yield* g.call(f, P("/proc/text2num"), null, [live(scantype)])), 7)) {
						dotype = 7;
					} else {
						dotype = (yield* g.srcCall(f, "matchReaction", live(process), live(scantype)));
					}
					yield* g.srcCall(f, "experiment", live(dotype), live(process));
					yield* g.srcCall(f, "use_power", 750);
					if (!isEqual(live(dotype), 8)) {
						if ((truthy(live(process)) && truthy(rt.fv(f, "origin_tech", live(process))))) {
							temp_tech = (yield* g.srcCall(f, "ConvertReqString2List", rt.fv(f, "origin_tech", live(process))));
							_T = null;
							rt.forList(f, 0, live(temp_tech));
							while (($e = rt.next(f, 0)) !== undefined) {
								_T = $e;
								yield* g.callName(f, rt.fv(f, "files", rt.sv(f, "linked_console")), "UpdateTech", [live(_T), rt.index(live(temp_tech), live(_T))]);
							}
							rt.endFor(f, 0);
						}
					}
				}
			}
		}
	}
	yield* g.callName(f, live(f.src), "updateUsrDialog", []);
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// /obj/machinery/r_n_d/experimentor/proc/warn_admins  (code/modules/research/experimentor.dm:559)
rt.def("/obj/machinery/r_n_d/experimentor/proc/warn_admins", function warn_admins(f: Frame, user: Value, ReactionName: Value) {
	let _T: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [_T, $0, $1, $2];
	_T = rt.getStep(f, live(f.src), 0);
	$0 = live(ReactionName);
	$1 = fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
	if (truthy(live(_T))) {
		$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	} else {
		$2 = "nonexistent location";
	}
	rt.call(f, P("/proc/message_admins"), null, [fmt("Experimentor reaction: ＀ generated by ＀ at ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	rt.call(f, P("/proc/log_game"), null, [fmt("Experimentor reaction: ＀ generated by ＀ in (＀,＀,＀)", [live(ReactionName), rt.call(f, P("/proc/key_name"), null, [live(user)]), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
	return f.dot;
});

rt.type(7646, "/obj/item/weapon/relic", "/obj/item/weapon", {
	realName: "defined object",
	revealed: 0,
	realProc: null,
	cooldownMax: 60,
	cooldown: null,
	name: "strange object",
	desc: "What mysteries could this hold?",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	origin_tech: "combat=1;plasmatech=1;powerstorage=1;materials=1",
});

// /obj/item/weapon/relic/proc/Initialize  (code/modules/research/experimentor.dm:594)  may sleep
rt.def("/obj/item/weapon/relic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "icon_state", rt.op(f, "PickUnweighted", [9], ["shock_kit", "armor-igniter-analyzer", "infra-igniter0", "infra-igniter1", "radio-multitool", "prox-radio1", "radio-radio", "timer-multitool0", "radio-igniter-tank"]));
	rt.setSv(f, "realName", fmt("＀ ＀", [rt.op(f, "PickUnweighted", [7], ["broken", "twisted", "spun", "improved", "silly", "regular", "badly made"]), rt.op(f, "PickUnweighted", [5], ["device", "object", "toy", "illegal tech", "weapon"])]));
	return f.dot;
}, true);

// /obj/item/weapon/relic/proc/reveal  (code/modules/research/experimentor.dm:603)
rt.def("/obj/item/weapon/relic/proc/reveal", function reveal(f: Frame) {
	if (truthy(rt.sv(f, "revealed"))) {
		return live(f.dot);
	}
	rt.setSv(f, "revealed", 1);
	rt.setSv(f, "name", rt.sv(f, "realName"));
	rt.setSv(f, "cooldownMax", rt.call(f, P("/proc/rand"), null, [60, 300]));
	rt.setSv(f, "realProc", rt.op(f, "PickUnweighted", [7], ["teleport", "explode", "rapidDupe", "petSpray", "flash", "clean", "corgicannon"]));
	rt.setSv(f, "origin_tech", rt.op(f, "PickUnweighted", [5], [fmt("engineering=＀", [rt.call(f, P("/proc/rand"), null, [2, 5])]), fmt("magnets=＀", [rt.call(f, P("/proc/rand"), null, [2, 5])]), fmt("plasmatech=＀", [rt.call(f, P("/proc/rand"), null, [2, 5])]), fmt("programming=＀", [rt.call(f, P("/proc/rand"), null, [2, 5])]), fmt("powerstorage=＀", [rt.call(f, P("/proc/rand"), null, [2, 5])])]));
	return f.dot;
});

// /obj/item/weapon/relic/proc/attack_self  (code/modules/research/experimentor.dm:611)  may sleep
rt.def("/obj/item/weapon/relic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "revealed"))) {
		if (truthy(rt.sv(f, "cooldown"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ does not react!</span>", [live(f.src)])]);
			return live(f.dot);
		} else {
			if (isEqual(rt.fv(f, "loc", live(f.src)), live(user))) {
				rt.setSv(f, "cooldown", 1);
				yield* g.callDyn(f, live(f.src), rt.sv(f, "realProc"), [live(user)]);
				rt.spawnTail(f, rt.sv(f, "cooldownMax"), "/obj/item/weapon/relic/proc/attack_self: spawn at modules/research/experimentor.dm:616", user);
			}
		}
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You aren't quite sure what to do with this yet.</span>"]);
	}
	return f.dot;
}, true);

// a spawn(rt.srcVarI(f, $ic[205])) body of /obj/item/weapon/relic/proc/attack_self, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/attack_self: spawn at modules/research/experimentor.dm:616", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setSv(f, "cooldown", 0);
	return null;
});

// /obj/item/weapon/relic/proc/throwSmoke  (code/modules/research/experimentor.dm:624)  may sleep
rt.def("/obj/item/weapon/relic/proc/throwSmoke", function* throwSmoke(f: Frame, where: Value) {
	let smoke: Value = null;
	f.vars = () => [where, smoke];
	yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [0, rt.getStep(f, live(where), 0)]);
	yield* g.callName(f, live(smoke), "start", []);
	return f.dot;
}, true, { argTypes: [{ path: "/turf" }] });

// /obj/item/weapon/relic/proc/corgicannon  (code/modules/research/experimentor.dm:629)  may sleep
rt.def("/obj/item/weapon/relic/proc/corgicannon", function* corgicannon(f: Frame, user: Value) {
	let C: Value = null;
	f.vars = () => [user, C];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", (yield* g.call(f, P("/proc/rand"), null, [25, 50])), 1]);
	yield* g.callName(f, (C = (yield* g.new_(f, T("/mob/living/simple_animal/pet/dog/corgi"), [rt.getStep(f, live(user), 0)]))), "throw_at", [null, rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [10, live(user)]))]), null, 10, null, (yield* g.call(f, P("/proc/rand"), null, [3, 8])), "callback", (yield* g.new_(f, T("/datum/callback"), [live(f.src), P("/obj/item/weapon/relic/proc/throwSmoke"), live(C)]))], rt.Args.Named);
	yield* g.srcCall(f, "warn_admins", live(user), "Corgi Cannon", 0);
	return f.dot;
}, true);

// /obj/item/weapon/relic/proc/clean  (code/modules/research/experimentor.dm:635)  may sleep
rt.def("/obj/item/weapon/relic/proc/clean", function* clean(f: Frame, user: Value) {
	let CL: Value = null;
	f.vars = () => [user, CL];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", (yield* g.call(f, P("/proc/rand"), null, [25, 50])), 1]);
	yield* g.callName(f, (CL = (yield* g.new_(f, T("/obj/item/weapon/grenade/chem_grenade/cleaner"), [rt.getStep(f, live(user), 0)]))), "prime", []);
	yield* g.srcCall(f, "warn_admins", live(user), "Smoke", 0);
	return f.dot;
}, true);

// /obj/item/weapon/relic/proc/flash  (code/modules/research/experimentor.dm:641)  may sleep
rt.def("/obj/item/weapon/relic/proc/flash", function* flash(f: Frame, user: Value) {
	let CB: Value = null;
	f.vars = () => [user, CB];
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), "sparks", (yield* g.call(f, P("/proc/rand"), null, [25, 50])), 1]);
	yield* g.callName(f, (CB = (yield* g.new_(f, T("/obj/item/weapon/grenade/flashbang"), [rt.fv(f, "loc", live(user))]))), "prime", []);
	yield* g.srcCall(f, "warn_admins", live(user), "Flash");
	return f.dot;
}, true);

// /obj/item/weapon/relic/proc/petSpray  (code/modules/research/experimentor.dm:647)  may sleep
rt.def("/obj/item/weapon/relic/proc/petSpray", function* petSpray(f: Frame, user: Value) {
	let message: Value = null, animals: Value = null, counter: Value = null, valid_animals: Value = null, mobType: Value = null;
	f.vars = () => [user, message, animals, counter, valid_animals, mobType];
	yield* g.srcCall(f, "visible_message", (message = fmt("<span class='danger'>＀ begans to shake, and in the distance the sound of rampaging animals arises!</span>", [live(f.src)])));
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), live(message)]);
	animals = (yield* g.call(f, P("/proc/rand"), null, [1, 25]));
	counter = null;
	valid_animals = rt.list(T("/mob/living/simple_animal/parrot"), T("/mob/living/simple_animal/butterfly"), T("/mob/living/simple_animal/pet/cat"), T("/mob/living/simple_animal/pet/dog/corgi"), T("/mob/living/simple_animal/crab"), T("/mob/living/simple_animal/pet/fox"), T("/mob/living/simple_animal/hostile/lizard"), T("/mob/living/simple_animal/mouse"), T("/mob/living/simple_animal/pet/dog/pug"), T("/mob/living/simple_animal/hostile/bear"), T("/mob/living/simple_animal/hostile/poison/bees"), T("/mob/living/simple_animal/hostile/carp"));
	counter = 1;
	while (rt.lt(live(counter), live(animals))) {
		mobType = rt.op(f, "PickUnweighted", [1], [live(valid_animals)]);
		yield* g.new_(f, live(mobType), [rt.getStep(f, live(f.src), 0)]);
		counter = rt.inc(live(counter), 1);
	}
	yield* g.srcCall(f, "warn_admins", live(user), "Mass Mob Spawn");
	if (!truthy(rt.op(f, "Prob", [], [60]))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ falls apart!</span>", [live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/weapon/relic/proc/rapidDupe  (code/modules/research/experimentor.dm:662)  may sleep
rt.def("/obj/item/weapon/relic/proc/rapidDupe", function* rapidDupe(f: Frame, user: Value) {
	let dupes: Value = null, counter: Value = null, max: Value = null, R: Value = null;
	f.vars = () => [user, dupes, counter, max, R];
	yield* g.srcCall(f, "audible_message", fmt("＀ emits a loud pop!", [live(f.src)]));
	dupes = rt.list();
	counter = null;
	max = (yield* g.call(f, P("/proc/rand"), null, [5, 10]));
	counter = 1;
	while (rt.lt(live(counter), live(max))) {
		rt.setFv(f, "name", (R = (yield* g.new_(f, rt.fv(f, "type", live(f.src)), [rt.getStep(f, live(f.src), 0)]))), rt.sv(f, "name"));
		rt.setFv(f, "desc", live(R), rt.sv(f, "desc"));
		rt.setFv(f, "realName", live(R), rt.sv(f, "realName"));
		rt.setFv(f, "realProc", live(R), rt.sv(f, "realProc"));
		rt.setFv(f, "revealed", live(R), 1);
		(dupes = rt.modify(live(dupes), live(R), rt.bitOr));
		yield* g.callName(f, live(R), "throw_at", [rt.op(f, "PickUnweighted", [1], [(yield* g.call(f, P("/proc/oview"), null, [7, rt.getStep(f, live(f.src), 0)]))]), 10, 1]);
		counter = rt.inc(live(counter), 1);
	}
	counter = 0;
	rt.spawnTail(f, (yield* g.call(f, P("/proc/rand"), null, [10, 100])), "/obj/item/weapon/relic/proc/rapidDupe: spawn at modules/research/experimentor.dm:674", user, dupes, counter, max, R);
	yield* g.srcCall(f, "warn_admins", live(user), "Rapid duplicator", 0);
	return f.dot;
}, true);

// a spawn((yield* g.call(f, P("/proc/rand"), null, [10, 100]))) body of /obj/item/weapon/relic/proc/rapidDupe, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/rapidDupe: spawn at modules/research/experimentor.dm:674", function* (f: Frame, user: Value, dupes: Value, counter: Value, max: Value, R: Value) {
	f.vars = () => [user, dupes, counter, max, R];
	counter = 1;
	while (rt.le(live(counter), rt.len(f, live(dupes)))) {
		yield* g.call(f, P("/proc/qdel"), null, [(R = rt.index(live(dupes), live(counter)))]);
		counter = rt.inc(live(counter), 1);
	}
	return null;
});

// /obj/item/weapon/relic/proc/explode  (code/modules/research/experimentor.dm:683)
rt.def("/obj/item/weapon/relic/proc/explode", function explode(f: Frame, user: Value) {
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='danger'>＀ begins to heat up!</span>", [live(f.src)])]);
	rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [35, 100]), "/obj/item/weapon/relic/proc/explode: spawn at modules/research/experimentor.dm:683", user);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [35, 100])) body of /obj/item/weapon/relic/proc/explode, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/explode: spawn at modules/research/experimentor.dm:683", function* (f: Frame, user: Value) {
	f.vars = () => [user];
	if (isEqual(rt.fv(f, "loc", live(f.src)), live(user))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>The ＀'s top opens, releasing a powerful blast!</span>", [live(f.src)]));
		yield* g.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(user)), null, -1, null, (yield* g.call(f, P("/proc/rand"), null, [1, 5])), null, (yield* g.call(f, P("/proc/rand"), null, [1, 5])), null, (yield* g.call(f, P("/proc/rand"), null, [1, 5])), null, (yield* g.call(f, P("/proc/rand"), null, [1, 5])), "flame_range", 2], rt.Args.Named);
		yield* g.srcCall(f, "warn_admins", live(user), "Explosion");
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	}
	return null;
});

// /obj/item/weapon/relic/proc/teleport  (code/modules/research/experimentor.dm:692)
rt.def("/obj/item/weapon/relic/proc/teleport", function teleport(f: Frame, user: Value) {
	let userturf: Value = null;
	f.vars = () => [userturf];
	rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>The ＀ begins to vibrate!</span>", [live(f.src)])]);
	rt.spawnTail(f, rt.call(f, P("/proc/rand"), null, [10, 30]), "/obj/item/weapon/relic/proc/teleport: spawn at modules/research/experimentor.dm:692", user, userturf);
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [10, 30])) body of /obj/item/weapon/relic/proc/teleport, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/item/weapon/relic/proc/teleport: spawn at modules/research/experimentor.dm:692", function* (f: Frame, user: Value, userturf: Value) {
	f.vars = () => [user, userturf];
	userturf = rt.getStep(f, live(user), 0);
	if ((isEqual(rt.fv(f, "loc", live(f.src)), live(user)) && !isEqual(rt.fv(f, "z", live(userturf)), 1))) {
		yield* g.srcCall(f, "visible_message", fmt("<span class='notice'>The ＀ twists and bends, relocating itself!</span>", [live(f.src)]));
		yield* g.srcCall(f, "throwSmoke", live(userturf));
		yield* g.call(f, P("/proc/do_teleport"), null, [null, live(user), null, live(userturf), null, 8, "asoundin", rt.rsc("sound/effects/phasein.ogg")], rt.Args.Named);
		yield* g.srcCall(f, "throwSmoke", rt.getStep(f, live(user), 0));
		yield* g.srcCall(f, "warn_admins", live(user), "Teleport", 0);
	}
	return null;
});

// /obj/item/weapon/relic/proc/warn_admins  (code/modules/research/experimentor.dm:704)
rt.def("/obj/item/weapon/relic/proc/warn_admins", function warn_admins(f: Frame, user: Value, RelicType: Value, priority: Value) {
	let _T: Value = null, log_msg: Value = null;
	let $0: any, $1: any, $2: any;
	f.vars = () => [priority, _T, log_msg, $0, $1, $2];
	if (live(priority) === null) {
		priority = 1;
	}
	_T = rt.getStep(f, live(f.src), 0);
	log_msg = fmt("＀ relic used by ＀ in (＀,＀,＀)", [live(RelicType), rt.call(f, P("/proc/key_name"), null, [live(user)]), rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]);
	if (truthy(live(priority))) {
		$0 = live(RelicType);
		$1 = fmt("＀＀ ＀", [rt.call(f, P("/proc/key_name_admin"), null, [live(user)]), fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [live(user)]), fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [live(user)])]);
		if (truthy(live(_T))) {
			$2 = fmt("＀ ＀", [fmt("(＀,＀,＀)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))]), fmt("(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=＀;Y=＀;Z=＀'>JMP</a>)", [rt.fv(f, "x", live(_T)), rt.fv(f, "y", live(_T)), rt.fv(f, "z", live(_T))])]);
		} else {
			$2 = "nonexistent location";
		}
		rt.call(f, P("/proc/message_admins"), null, [fmt("＀ relic activated by ＀ in ＀", [$0, $1, fmt("＀", [$2])]), 0, 1]);
	}
	rt.call(f, P("/proc/log_game"), null, [live(log_msg)]);
	rt.callSrc(f, "investigate_log", [live(log_msg), "experimentor"]);
	return f.dot;
});
