// From code/modules/paperwork/handlabeler.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7617, "/obj/item/weapon/hand_labeler", "/obj/item/weapon", {
	label: null,
	labels_left: 30,
	mode: 0,
	name: "hand labeler",
	desc: "A combined label printer and applicator in a portable device, designed to be easy to operate and use.",
	icon: rt.rsc("icons/obj/bureaucracy.dmi"),
	icon_state: "labeler0",
	item_state: "flight",
});

// /obj/item/weapon/hand_labeler/proc/suicide_act  (code/modules/paperwork/handlabeler.dm:12)
rt.def("/obj/item/weapon/hand_labeler/proc/suicide_act", function suicide_act(f: Frame, user: Value) {
	let old_real_name: Value = null, A: Value = null, their_card: Value = null;
	let $e: any;
	f.vars = () => [old_real_name, A, their_card, $e];
	rt.callName(f, live(user), "visible_message", [fmt("<span class='suicide'>＀ is pointing ＀ at ＀self. ＀ going to label ＀self as a suicide!</span>", [live(user), live(f.src), rt.callName(f, live(user), "p_them", []), rt.callName(f, live(user), "p_theyre", [1]), rt.callName(f, live(user), "p_them", [])])]);
	rt.setSv(f, "labels_left", rt.call(f, P("/proc/max"), null, [subtract(rt.sv(f, "labels_left"), 1), 0]));
	old_real_name = rt.fv(f, "real_name", live(user));
	rt.modField(f, live(user), "real_name", " (suicide)", add);
	A = null;
	rt.forList(f, 0, rt.callName(f, live(user), "GetAllContents", []), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		if (truthy((rt.istype(live(A), T("/obj/item/weapon/card/id")) ? 1 : 0))) {
			if (!isEqual(rt.gv(f, "registered_name", (their_card = live(A))), live(old_real_name))) {
				continue;
			}
			rt.setFv(f, "registered_name", live(their_card), rt.fv(f, "real_name", live(user)));
			rt.callName(f, live(their_card), "update_label", []);
		}
	}
	rt.endFor(f, 0);
	rt.modField(f, rt.fv(f, "mind", live(user)), "name", " (suicide)", add);
	rt.setSv(f, "mode", 1);
	rt.setSv(f, "icon_state", fmt("labeler＀", [rt.sv(f, "mode")]));
	rt.setSv(f, "label", "suicide");
	return 8;
});

// /obj/item/weapon/hand_labeler/proc/afterattack  (code/modules/paperwork/handlabeler.dm:39)
rt.def("/obj/item/weapon/hand_labeler/proc/afterattack", function afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	if (!truthy(live(proximity))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "mode"))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "labels_left"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No labels left!</span>"]);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "label")) || !truthy(rt.length(rt.sv(f, "label"))))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>No text set!</span>"]);
		return live(f.dot);
	}
	if (rt.gt(add(rt.length(rt.fv(f, "name", live(A))), rt.length(rt.sv(f, "label"))), 64)) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Label too big!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.call(f, P("/proc/ismob"), null, [live(A)]))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You can't label creatures!</span>"]);
		return live(f.dot);
	}
	rt.callName(f, live(user), "visible_message", [fmt("＀ labels ＀ as ＀.", [live(user), live(A), rt.sv(f, "label")]), fmt("<span class='notice'>You label ＀ as ＀.</span>", [live(A), rt.sv(f, "label")])]);
	rt.setFv(f, "name", live(A), fmt("＀ (＀)", [rt.fv(f, "name", live(A)), rt.sv(f, "label")]));
	rt.incSrcVar(f, "labels_left", -1, true);
	return f.dot;
});

// /obj/item/weapon/hand_labeler/proc/attack_self  (code/modules/paperwork/handlabeler.dm:63)  may sleep
rt.def("/obj/item/weapon/hand_labeler/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let str: Value = null;
	f.vars = () => [user, str];
	if (!truthy((yield* g.callName(f, live(user), "IsAdvancedToolUser", [])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>You don't have the dexterity to use ＀!</span>", [live(f.src)])]);
		return live(f.dot);
	}
	rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
	rt.setSv(f, "icon_state", fmt("labeler＀", [rt.sv(f, "mode")]));
	if (truthy(rt.sv(f, "mode"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You turn on ＀.</span>", [live(f.src)])]);
		if ((!truthy((str = (yield* g.call(f, P("/proc/copytext"), null, [(yield* g.call(f, P("/proc/reject_bad_text"), null, [(yield* g.op(f, "Prompt", [2], ["", "Set label", "Label text?", live(user), null]))])), 1, 42])))) || !truthy(rt.length(live(str))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>Invalid text!</span>"]);
			return live(f.dot);
		}
		rt.setSv(f, "label", live(str));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You set the text to '＀'.</span>", [live(str)])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You turn off ＀.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/hand_labeler/proc/attackby  (code/modules/paperwork/handlabeler.dm:81)  may sleep
rt.def("/obj/item/weapon/hand_labeler/proc/attackby", function* attackby(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/hand_labeler_refill")) ? 1 : 0))) return f.dot;
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert ＀ into ＀.</span>", [live(f.args[0]), live(f.src)])]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.args[0])]);
	rt.setSv(f, "labels_left", rt.initial(f, live(f.src), "labels_left"));
	return f.dot;
}, true, { args: ["I", "user", "params"] });

rt.type(7618, "/obj/item/weapon/hand_labeler/borg", "/obj/item/weapon/hand_labeler", {
	name: "cyborg-hand labeler",
});

// /obj/item/weapon/hand_labeler/borg/proc/afterattack  (code/modules/paperwork/handlabeler.dm:91)  may sleep
rt.def("/obj/item/weapon/hand_labeler/borg/proc/afterattack", function* afterattack(f: Frame, A: Value, user: Value, proximity: Value) {
	let borgy: Value = null, starting_labels: Value = null, diff: Value = null, cost: Value = null;
	f.vars = () => [A, user, proximity, borgy, starting_labels, diff, cost];
	yield* g.callSuper(f, [live(A), live(user), live(proximity)]);
	if (!truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		return live(f.dot);
	}
	borgy = live(user);
	starting_labels = rt.initial(f, live(f.src), "labels_left");
	if (!truthy((diff = subtract(live(starting_labels), rt.sv(f, "labels_left"))))) return f.dot;
	rt.setSv(f, "labels_left", live(starting_labels));
	cost = multiply(live(diff), 50);
	if (!truthy(rt.fv(f, "cell", live(borgy)))) return f.dot;
	yield* g.callName(f, rt.fv(f, "cell", live(borgy)), "use", [live(cost)]);
	return f.dot;
}, true);
