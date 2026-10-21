// From code/_onclick/telekinesis.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


// /atom/proc/attack_tk  (code/_onclick/telekinesis.dm:14)  may sleep
rt.def("/atom/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy(rt.fv(f, "stat", live(user))) || !truthy((yield* g.call(f, P("/proc/tkMaxRangeCheck"), null, [live(user), live(f.src)]))))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/telekinesis"), [rt.sv(f, "loc")]);
	yield* g.callName(f, live(user), "UnarmedAttack", [live(f.src), 0]);
	return live(f.dot);
}, true);

// /obj/proc/attack_tk  (code/_onclick/telekinesis.dm:21)  may sleep
rt.def("/obj/proc/attack_tk", function* attack_tk(f: Frame) {
	if (truthy(rt.fv(f, "stat", live(f.args[0])))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "anchored"))) {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	yield* g.srcCall(f, "attack_tk_grab", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/proc/attack_tk  (code/_onclick/telekinesis.dm:28)  may sleep
rt.def("/obj/item/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.fv(f, "stat", live(user)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "attack_tk_grab", live(user));
	return f.dot;
}, true);

// /obj/proc/attack_tk_grab  (code/_onclick/telekinesis.dm:33)  may sleep
rt.def("/obj/proc/attack_tk_grab", function* attack_tk_grab(f: Frame, user: Value) {
	let O: Value = null;
	f.vars = () => [user, O];
	rt.setFv(f, "tk_user", (O = (yield* g.new_(f, T("/obj/item/tk_grab"), [live(f.src)]))), live(user));
	if (!truthy((yield* g.callName(f, live(O), "focus_object", [live(f.src)])))) return f.dot;
	yield* g.callName(f, live(user), "put_in_active_hand", [live(O)]);
	return f.dot;
}, true);

// /obj/item/proc/attack_self_tk  (code/_onclick/telekinesis.dm:53)  may sleep
rt.def("/obj/item/proc/attack_self_tk", function* attack_self_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_self", live(user));
	return f.dot;
}, true);

rt.type(7650, "/obj/item/tk_grab", "/obj/item", {
	focus: null,
	tk_user: null,
	flags: 16516,
	name: "Telekinetic Grab",
	desc: "Magic",
	icon: rt.rsc("icons/obj/magic.dmi"),
	icon_state: "2",
	w_class: 6,
	layer: 20,
	plane: 20,
});

// /obj/item/tk_grab/proc/Initialize  (code/_onclick/telekinesis.dm:79)  may sleep
rt.def("/obj/item/tk_grab/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "isprocessing", live(f.src)))) return f.dot;
	rt.setFv(f, "isprocessing", live(f.src), 1);
	rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), add);
	return f.dot;
}, true);

// /obj/item/tk_grab/proc/Destroy  (code/_onclick/telekinesis.dm:83)  may sleep
rt.def("/obj/item/tk_grab/proc/Destroy", function* Destroy(f: Frame) {
	rt.setFv(f, "isprocessing", live(f.src), 0);
	(rt.modField(f, rt.gl("SSfastprocess"), "processing", live(f.src), subtract));
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/tk_grab/proc/process  (code/_onclick/telekinesis.dm:87)  may sleep
rt.def("/obj/item/tk_grab/proc/process", function* process(f: Frame) {
	if (!truthy((yield* g.srcCall(f, "check_if_focusable", rt.sv(f, "focus"))))) return f.dot;
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { waitfor: false });

// /obj/item/tk_grab/proc/dropped  (code/_onclick/telekinesis.dm:91)  may sleep
rt.def("/obj/item/tk_grab/proc/dropped", function* dropped(f: Frame) {
	if ((((truthy(rt.sv(f, "focus")) && truthy(live(f.args[0]))) && !isEqual(rt.sv(f, "loc"), live(f.args[0]))) && !isEqual(rt.sv(f, "loc"), rt.fv(f, "loc", live(f.args[0]))))) {
		if (truthy((yield* g.callName(f, rt.sv(f, "focus"), "Adjacent", [rt.sv(f, "loc")])))) {
			rt.setFv(f, "loc", rt.sv(f, "focus"), rt.sv(f, "loc"));
		}
	}
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/tk_grab/proc/equipped  (code/_onclick/telekinesis.dm:98)  may sleep
rt.def("/obj/item/tk_grab/proc/equipped", function* equipped(f: Frame, user: Value, slot: Value) {
	f.vars = () => [user, slot];
	if (isEqual(live(slot), 4)) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return live(f.dot);
}, true);

// /obj/item/tk_grab/proc/attack_self  (code/_onclick/telekinesis.dm:107)  may sleep
rt.def("/obj/item/tk_grab/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "focus"))) {
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "focus")) || truthy(rt.fv(f, "gc_destroyed", rt.sv(f, "focus"))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	yield* g.callName(f, rt.sv(f, "focus"), "attack_self_tk", [live(user)]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/tk_grab/proc/afterattack  (code/_onclick/telekinesis.dm:116)  may sleep
rt.def("/obj/item/tk_grab/proc/afterattack", function* afterattack(f: Frame, target: Value, user: Value, proximity: Value, params: Value) {
	let I: Value = null;
	f.vars = () => [target, user, proximity, params, I];
	if ((!truthy(live(target)) || !truthy(live(user)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "focus"))) {
		yield* g.srcCall(f, "focus_object", live(target));
		return live(f.dot);
	} else {
		if (!truthy((yield* g.srcCall(f, "check_if_focusable", rt.sv(f, "focus"))))) {
			return live(f.dot);
		}
	}
	if (isEqual(live(target), rt.sv(f, "focus"))) {
		yield* g.callName(f, live(target), "attack_self_tk", [live(user)]);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	}
	if (((!truthy((yield* g.call(f, P("/proc/isturf"), null, [live(target)]))) && truthy((rt.istype(rt.sv(f, "focus"), T("/obj/item")) ? 1 : 0))) && truthy((yield* g.callName(f, live(target), "Adjacent", [rt.sv(f, "focus")]))))) {
		yield* g.srcCall(f, "apply_focus_overlay");
		yield* g.callName(f, (I = rt.sv(f, "focus")), "melee_attack_chain", [rt.sv(f, "tk_user"), live(target), live(params)]);
		if (truthy((yield* g.srcCall(f, "check_if_focusable", rt.sv(f, "focus"))))) {
			yield* g.callName(f, rt.sv(f, "focus"), "do_attack_animation", [live(target), null, rt.sv(f, "focus")]);
		}
	} else {
		yield* g.srcCall(f, "apply_focus_overlay");
		yield* g.callName(f, rt.sv(f, "focus"), "throw_at", [live(target), 10, 1, live(user)]);
	}
	yield* g.callName(f, live(user), "changeNext_move", [8]);
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /proc/tkMaxRangeCheck  (code/_onclick/telekinesis.dm:144)
rt.def("/proc/tkMaxRangeCheck", function tkMaxRangeCheck(f: Frame, user: Value, target: Value) {
	let d: Value = null;
	f.vars = () => [d];
	if (rt.gt((d = rt.call(f, P("/proc/get_dist"), null, [live(user), live(target)])), 15)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class ='warning'>Your mind won't reach that far.</span>"]);
		return live(f.dot);
	}
	return 1;
});

// /obj/item/tk_grab/proc/focus_object  (code/_onclick/telekinesis.dm:154)  may sleep
rt.def("/obj/item/tk_grab/proc/focus_object", function* focus_object(f: Frame, target: Value) {
	f.vars = () => [target];
	if (!truthy((yield* g.srcCall(f, "check_if_focusable", live(target))))) {
		return live(f.dot);
	}
	rt.setSv(f, "focus", live(target));
	yield* g.srcCall(f, "update_icon");
	yield* g.srcCall(f, "apply_focus_overlay");
	return 1;
}, true);

// /obj/item/tk_grab/proc/check_if_focusable  (code/_onclick/telekinesis.dm:162)  may sleep
rt.def("/obj/item/tk_grab/proc/check_if_focusable", function* check_if_focusable(f: Frame, target: Value) {
	f.vars = () => [target];
	if (((((!truthy(rt.sv(f, "tk_user")) || !truthy((rt.istype(rt.sv(f, "tk_user"), T("/mob/living/carbon")) ? 1 : 0))) || (!truthy(live(target)) || truthy(rt.fv(f, "gc_destroyed", live(target))))) || !truthy((rt.istype(live(target), T("/obj")) ? 1 : 0))) || !truthy((yield* g.callName(f, rt.fv(f, "dna", rt.sv(f, "tk_user")), "check_mutation", ["Telekinesis"]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	if (((!truthy((yield* g.call(f, P("/proc/tkMaxRangeCheck"), null, [rt.sv(f, "tk_user"), live(target)]))) || truthy(rt.fv(f, "anchored", live(target)))) || !truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", live(target))]))))) {
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
		return live(f.dot);
	}
	return 1;
}, true);

// /obj/item/tk_grab/proc/apply_focus_overlay  (code/_onclick/telekinesis.dm:171)  may sleep
rt.def("/obj/item/tk_grab/proc/apply_focus_overlay", function* apply_focus_overlay(f: Frame) {
	if (!truthy(rt.sv(f, "focus"))) {
		return live(f.dot);
	}
	yield* g.new_(f, T("/obj/effect/temp_visual/telekinesis"), [rt.getStep(f, rt.sv(f, "focus"), 0)]);
	return f.dot;
}, true);

// /obj/item/tk_grab/proc/update_icon  (code/_onclick/telekinesis.dm:176)
rt.def("/obj/item/tk_grab/proc/update_icon", function update_icon(f: Frame) {
	let old_layer: Value = null, old_plane: Value = null;
	f.vars = () => [old_layer, old_plane];
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "focus"))) return f.dot;
	old_layer = rt.fv(f, "layer", rt.sv(f, "focus"));
	old_plane = rt.fv(f, "plane", rt.sv(f, "focus"));
	rt.setFv(f, "layer", rt.sv(f, "focus"), add(rt.sv(f, "layer"), 0.009999999776482582));
	rt.setFv(f, "plane", rt.sv(f, "focus"), 20);
	rt.callSrc(f, "add_overlay", [rt.sv(f, "focus")]);
	rt.setFv(f, "layer", rt.sv(f, "focus"), live(old_layer));
	rt.setFv(f, "plane", rt.sv(f, "focus"), live(old_plane));
	return f.dot;
});

// /obj/item/tk_grab/proc/suicide_act  (code/_onclick/telekinesis.dm:187)
rt.def("/obj/item/tk_grab/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is using ＀ telekinesis to choke ＀self! It looks like ＀ trying to commit suicide!</span>", [live(user), rt.callName(f, live(user), "p_their", []), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_theyre", [])])]);
	return 8;
});
