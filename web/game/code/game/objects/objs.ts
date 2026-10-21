// From code/game/objects/objs.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /obj/proc/vv_edit_var  (code/game/objects/objs.dm:31)  may sleep
rt.def("/obj/proc/vv_edit_var", function* vv_edit_var(f: Frame) {
	let O: Value = null;
	let $0: any;
	f.vars = () => [O, $0];
	$0 = live(f.args[0]);
	if ($0 === "dangerous_possession") {
		return 0;
	} else if ($0 === "control_object") {
		if ((truthy((rt.istype((O = live(f.args[1])), T("/obj")) ? 1 : 0)) && truthy(rt.fv(f, "dangerous_possession", live(O))))) {
			return 0;
		}
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["vname", "vval"] });

// /obj/proc/Initialize  (code/game/objects/objs.dm:41)
rt.def("/obj/proc/Initialize", function Initialize(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "armor"))) {
		rt.setSv(f, "armor", rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 0, "acid", 0]));
	}
	if (!(truthy(rt.sv(f, "on_blueprints")) && truthy(rt.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) return f.dot;
	_T = rt.sv(f, "loc");
	if (truthy(rt.sv(f, "force_blueprints"))) {
		rt.callName(f, live(_T), "add_blueprints", [live(f.src)]);
	} else {
		rt.callName(f, live(_T), "add_blueprints_preround", [live(f.src)]);
	}
	return f.dot;
});

// /obj/proc/Destroy  (code/game/objects/objs.dm:52)  may sleep
rt.def("/obj/proc/Destroy", function* Destroy(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 0;
	}
	if (!truthy((rt.istype(live(f.src), T("/obj/machinery")) ? 1 : 0))) {
		rt.setFv(f, "isprocessing", live(f.src), 0);
		(rt.modField(f, rt.gl("SSobj"), "processing", live(f.src), subtract));
	}
	yield* g.callName(f, rt.gl("SStgui"), "close_uis", [live(f.src)]);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["force"] });

// /obj/proc/throw_at  (code/game/objects/objs.dm:58)  may sleep
rt.def("/obj/proc/throw_at", function* throw_at(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if (live(f.args[4]) === null) {
		f.args[4] = 1;
	}
	if (live(f.args[5]) === null) {
		f.args[5] = 0;
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "secondary_flags", live(f.src)))) {
		$0 = rt.index(rt.fv(f, "secondary_flags", live(f.src)), "frozen");
	} else {
		$0 = 0;
	}
	if (!truthy($0)) return f.dot;
	yield* g.srcCall(f, "visible_message", fmt("<span class='danger'>＀ shatters into a million pieces!</span>", [live(f.src)]));
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true, { args: ["target", "range", "speed", "thrower", "spin", "diagonals_first", "callback"] });

// /obj/proc/assume_air  (code/game/objects/objs.dm:65)  may sleep
rt.def("/obj/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	f.vars = () => [giver];
	if (truthy(rt.sv(f, "loc"))) {
		return (yield* g.callName(f, rt.sv(f, "loc"), "assume_air", [live(giver)]));
	}
	return null;
}, true);

// /obj/proc/remove_air  (code/game/objects/objs.dm:71)  may sleep
rt.def("/obj/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	f.vars = () => [amount];
	if (truthy(rt.sv(f, "loc"))) {
		return (yield* g.callName(f, rt.sv(f, "loc"), "remove_air", [live(amount)]));
	}
	return null;
}, true);

// /obj/proc/return_air  (code/game/objects/objs.dm:77)
rt.def("/obj/proc/return_air", function return_air(f: Frame) {
	if (truthy(rt.sv(f, "loc"))) {
		return rt.callName(f, rt.sv(f, "loc"), "return_air", []);
	}
	return null;
});

// /obj/proc/handle_internal_lifeform  (code/game/objects/objs.dm:87)  may sleep
rt.def("/obj/proc/handle_internal_lifeform", function* handle_internal_lifeform(f: Frame, lifeform_inside_me: Value, breath_request: Value) {
	let environment: Value = null, breath_percentage: Value = null;
	f.vars = () => [lifeform_inside_me, breath_request, environment, breath_percentage];
	if (rt.gt(live(breath_request), 0)) {
		environment = (yield* g.srcCall(f, "return_air"));
		breath_percentage = divide(0.5, (yield* g.callName(f, live(environment), "return_volume", [])));
		return (yield* g.srcCall(f, "remove_air", multiply((yield* g.callName(f, live(environment), "total_moles", [])), live(breath_percentage))));
	} else {
		return null;
	}
	return f.dot;
}, true);

// /obj/proc/updateUsrDialog  (code/game/objects/objs.dm:97)  may sleep
rt.def("/obj/proc/updateUsrDialog", function* updateUsrDialog(f: Frame) {
	let is_in_use: Value = null, nearby: Value = null, M: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [is_in_use, nearby, M, H, $e];
	if (!truthy(rt.sv(f, "in_use"))) return f.dot;
	is_in_use = 0;
	nearby = (yield* g.call(f, P("/proc/viewers"), null, [1, live(f.src)]));
	M = null;
	rt.forList(f, 0, live(nearby), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "client", live(M))) && isEqual(rt.fv(f, "machine", live(M)), live(f.src)))) {
			is_in_use = 1;
			yield* g.callName(f, live(f.src), "attack_hand", [live(M)]);
		}
	}
	rt.endFor(f, 0);
	if (((truthy((rt.istype(live(f.usr), T("/mob/living/silicon/ai")) ? 1 : 0)) || truthy((rt.istype(live(f.usr), T("/mob/living/silicon/robot")) ? 1 : 0))) || truthy((yield* g.call(f, P("/proc/IsAdminGhost"), null, [live(f.usr)]))))) {
		if (!truthy((rt.isIn(f, live(f.usr), live(nearby)) ? 1 : 0))) {
			if ((truthy(rt.fv(f, "client", live(f.usr))) && isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src)))) {
				is_in_use = 1;
				yield* g.callName(f, live(f.src), "attack_ai", [live(f.usr)]);
			}
		}
	}
	if (truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(f.usr);
		if (!truthy((rt.isIn(f, live(f.usr), live(nearby)) ? 1 : 0))) {
			if ((truthy(rt.fv(f, "client", live(f.usr))) && isEqual(rt.fv(f, "machine", live(f.usr)), live(f.src)))) {
				if (truthy((yield* g.callName(f, rt.fv(f, "dna", live(H)), "check_mutation", ["Telekinesis"])))) {
					is_in_use = 1;
					yield* g.callName(f, live(f.src), "attack_hand", [live(f.usr)]);
				}
			}
		}
	}
	rt.setSv(f, "in_use", live(is_in_use));
	return f.dot;
}, true);

// /obj/proc/updateDialog  (code/game/objects/objs.dm:122)  may sleep
rt.def("/obj/proc/updateDialog", function* updateDialog(f: Frame) {
	let nearby: Value = null, is_in_use: Value = null, M: Value = null, ai_in_use: Value = null;
	let $e: any;
	f.vars = () => [nearby, is_in_use, M, ai_in_use, $e];
	if (!truthy(rt.sv(f, "in_use"))) return f.dot;
	nearby = (yield* g.call(f, P("/proc/viewers"), null, [1, live(f.src)]));
	is_in_use = 0;
	M = null;
	rt.forList(f, 0, live(nearby), T("/mob"));
	while (($e = rt.next(f, 0)) !== undefined) {
		M = $e;
		if ((truthy(rt.fv(f, "client", live(M))) && isEqual(rt.fv(f, "machine", live(M)), live(f.src)))) {
			is_in_use = 1;
			yield* g.callName(f, live(f.src), "interact", [live(M)]);
		}
	}
	rt.endFor(f, 0);
	if (!(!truthy((ai_in_use = (yield* g.call(f, P("/proc/AutoUpdateAI"), null, [live(f.src)])))) && !truthy(live(is_in_use)))) return f.dot;
	rt.setSv(f, "in_use", 0);
	return f.dot;
}, true);

// /obj/proc/attack_ghost  (code/game/objects/objs.dm:135)  may sleep
rt.def("/obj/proc/attack_ghost", function* attack_ghost(f: Frame) {
	if (!isEqual((yield* g.srcCall(f, "ui_interact", live(f.args[0]))), -1)) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

// /mob/proc/unset_machine  (code/game/objects/objs.dm:147)  may sleep
rt.def("/mob/proc/unset_machine", function* unset_machine(f: Frame) {
	if (!truthy(rt.sv(f, "machine"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "machine"), "on_unset_machine", [live(f.src)]);
	rt.setSv(f, "machine", null);
	return f.dot;
}, true);

// /mob/proc/set_machine  (code/game/objects/objs.dm:155)  may sleep
rt.def("/mob/proc/set_machine", function* set_machine(f: Frame, O: Value) {
	f.vars = () => [O];
	if (truthy(rt.fv(f, "machine", live(f.src)))) {
		yield* g.srcCall(f, "unset_machine");
	}
	rt.setFv(f, "machine", live(f.src), live(O));
	if (!truthy((rt.istype(live(O), T("/obj")) ? 1 : 0))) return f.dot;
	rt.setFv(f, "in_use", live(O), 1);
	return f.dot;
}, true);

// /obj/item/proc/updateSelfDialog  (code/game/objects/objs.dm:163)  may sleep
rt.def("/obj/item/proc/updateSelfDialog", function* updateSelfDialog(f: Frame) {
	let M: Value = null;
	f.vars = () => [M];
	if (!((truthy((rt.istype((M = rt.fv(f, "loc", live(f.src))), T("/mob")) ? 1 : 0)) && truthy(rt.fv(f, "client", live(M)))) && isEqual(rt.fv(f, "machine", live(M)), live(f.src)))) return f.dot;
	yield* g.callName(f, live(f.src), "attack_self", [live(M)]);
	return f.dot;
}, true);

// /obj/proc/singularity_pull  (code/game/objects/objs.dm:170)  may sleep
rt.def("/obj/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	f.vars = () => [S, current_size];
	if (!(!truthy(rt.sv(f, "anchored")) || rt.ge(live(current_size), 9))) return f.dot;
	yield* g.call(f, P("/proc/step_towards"), null, [live(f.src), live(S)]);
	return f.dot;
}, true);

// /obj/proc/get_spans  (code/game/objects/objs.dm:174)
rt.def("/obj/proc/get_spans", function get_spans(f: Frame) {
	return rt.bitOr(rt.callSuper(f, [], rt.Args.Same), "robot");
});

// /obj/proc/storage_contents_dump_act  (code/game/objects/objs.dm:177)  may sleep
rt.def("/obj/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let _T: Value = null;
	f.vars = () => [src_object, user, _T];
	return (yield* g.callName(f, (_T = rt.getStep(f, live(f.src), 0)), "storage_contents_dump_act", [live(src_object), live(user)]));
}, true);

// /obj/proc/CanAStarPass  (code/game/objects/objs.dm:181)
rt.def("/obj/proc/CanAStarPass", function CanAStarPass(f: Frame) {
	f.dot = (!truthy(rt.sv(f, "density")) ? 1 : 0);
	return f.dot;
});

// /obj/proc/vv_get_dropdown  (code/game/objects/objs.dm:193)
rt.def("/obj/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = rt.callSuper(f, [], rt.Args.Same);
	rt.setAt(live(f.dot), "Delete all of type", fmt("?_src_=vars;delall=＃", [live(f.src)]));
	return f.dot;
});

// /obj/proc/examine  (code/game/objects/objs.dm:197)
rt.def("/obj/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "unique_rename"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Use a pen on it to rename it or change its description.</span>"]);
	}
	if (!(truthy(rt.sv(f, "unique_reskin")) && !truthy(rt.sv(f, "current_skin")))) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>Alt-click it to reskin it.</span>"]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/proc/AltClick  (code/game/objects/objs.dm:204)  may sleep
rt.def("/obj/proc/AltClick", function* AltClick(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!((truthy(rt.sv(f, "unique_reskin")) && !truthy(rt.sv(f, "current_skin"))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.args[0]), live(f.src)])), 1))) return f.dot;
	if (truthy((yield* g.callName(f, live(f.args[0]), "incapacitated", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>You can't do that right now!</span>"]);
		return live(f.dot);
	}
	yield* g.srcCall(f, "reskin_obj", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/proc/reskin_obj  (code/game/objects/objs.dm:212)  may sleep
rt.def("/obj/proc/reskin_obj", function* reskin_obj(f: Frame, M: Value) {
	let choice: Value = null;
	f.vars = () => [M, choice];
	if (!truthy(rt.length(rt.sv(f, "unique_reskin")))) {
		return live(f.dot);
	}
	choice = (yield* g.op(f, "Prompt", [1], [null, "Reskin Object", fmt("Warning, you can only reskin ＀ once!", [live(f.src)]), live(M), rt.sv(f, "unique_reskin")]));
	if (!((((!(!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) && truthy(live(choice))) && !truthy(rt.sv(f, "current_skin"))) && !truthy((yield* g.callName(f, live(M), "incapacitated", [])))) && rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(M), live(f.src)])), 1))) return f.dot;
	if (!truthy(rt.index(rt.sv(f, "unique_reskin"), live(choice)))) {
		return live(f.dot);
	}
	rt.setSv(f, "current_skin", live(choice));
	rt.setSv(f, "icon_state", rt.index(rt.sv(f, "unique_reskin"), live(choice)));
	yield* g.call(f, P("/proc/to_chat"), null, [live(M), fmt("＀ is now skinned as '＀.'", [live(f.src), live(choice)])]);
	return f.dot;
}, true);
