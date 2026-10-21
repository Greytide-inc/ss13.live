// From code/game/objects/structures/guncase.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12777, "/obj/structure/guncase", "/obj/structure", {
	case_type: "",
	gun_category: rt.typePath("/obj/item/weapon/gun"),
	open: 1,
	capacity: 4,
	anchored: 0,
	name: "gun locker",
	desc: "A locker that holds guns.",
	icon: rt.rsc("icons/obj/closet.dmi"),
	icon_state: "shotguncase",
	density: 1,
	opacity: 0,
});

// /obj/structure/guncase/proc/Initialize  (code/game/objects/structures/guncase.dm:16)  may sleep
rt.def("/obj/structure/guncase/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null;
	let $e: any;
	f.vars = () => [I, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[0]))) {
		I = null;
		rt.forList(f, 0, rt.fv(f, "contents", rt.sv(f, "loc")), T("/obj/item"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			if (truthy(rt.op(f, "IsType", [], [live(I), rt.sv(f, "gun_category")]))) {
				yield* g.callName(f, live(I), "forceMove", [live(f.src)]);
			}
			if (rt.ge(rt.len(f, rt.sv(f, "contents")), rt.sv(f, "capacity"))) {
				break;
			}
		}
		rt.endFor(f, 0);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });

// /obj/structure/guncase/proc/update_icon  (code/game/objects/structures/guncase.dm:26)
rt.def("/obj/structure/guncase/proc/update_icon", function update_icon(f: Frame) {
	let gun_overlay: Value = null, i: Value = null;
	let $e: any;
	f.vars = () => [gun_overlay, i, $e];
	rt.callSrc(f, "cut_overlays", []);
	if ((truthy(rt.sv(f, "case_type")) && truthy(rt.length(rt.sv(f, "contents"))))) {
		gun_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), rt.sv(f, "case_type")]);
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "contents")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			rt.setFv(f, "pixel_x", live(gun_overlay), multiply(3, subtract(live(i), 1)));
			rt.callSrc(f, "add_overlay", [live(gun_overlay)]);
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "open"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀_open", [rt.sv(f, "icon_state")])]);
	} else {
		rt.callSrc(f, "add_overlay", [fmt("＀_door", [rt.sv(f, "icon_state")])]);
	}
	return f.dot;
});

// /obj/structure/guncase/proc/attackby  (code/game/objects/structures/guncase.dm:38)  may sleep
rt.def("/obj/structure/guncase/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/alien")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "gun_category")])) && truthy(rt.sv(f, "open")))) {
		if (rt.lt(rt.length(rt.sv(f, "contents")), rt.sv(f, "capacity"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You place ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is full.</span>", [live(f.src)])]);
		}
		return live(f.dot);
	} else {
		if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
			yield* g.srcCall(f, "update_icon");
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/guncase/proc/attack_hand  (code/game/objects/structures/guncase.dm:58)  may sleep
rt.def("/obj/structure/guncase/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/carbon/alien")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((truthy(rt.len(f, rt.sv(f, "contents"))) && truthy(rt.sv(f, "open")))) {
		yield* g.srcCall(f, "ShowWindow", live(user));
	} else {
		rt.setSv(f, "open", (!truthy(rt.sv(f, "open")) ? 1 : 0));
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true);

// /obj/structure/guncase/proc/ShowWindow  (code/game/objects/structures/guncase.dm:67)  may sleep
rt.def("/obj/structure/guncase/proc/ShowWindow", function* ShowWindow(f: Frame, user: Value) {
	let dat: Value = null, i: Value = null, I: Value = null, popup: Value = null;
	let $e: any;
	f.vars = () => [user, dat, i, I, popup, $e];
	dat = "<div class='block'>\n\t\t\t\t<h3>Stored Guns</h3>\n\t\t\t\t<table align='center'>";
	if (truthy(rt.length(rt.sv(f, "contents")))) {
		i = null;
		rt.forRange(f, 0, 1, rt.len(f, rt.sv(f, "contents")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			I = rt.index(rt.sv(f, "contents"), live(i));
			dat = rt.modify(live(dat), fmt("<tr><A href='?src=＃;retrieve=＃'>＀</A><br>", [live(f.src), live(I), rt.fv(f, "name", live(I))]), add);
		}
		rt.endFor(f, 0);
	}
	dat = rt.modify(live(dat), "</table></div>", add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "gunlocker", fmt("<div align='center'>＀</div>", [rt.sv(f, "name")]), 350, 300]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", [0]);
	return f.dot;
}, true);

// /obj/structure/guncase/proc/Topic  (code/game/objects/structures/guncase.dm:81)  may sleep
rt.def("/obj/structure/guncase/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let O: Value = null;
	f.vars = () => [href, href_list, O];
	if (!truthy(rt.at(live(href_list), "retrieve"))) return f.dot;
	if ((!truthy((O = rt.locateIn(f, rt.at(live(href_list), "retrieve"), rt.sv(f, "contents")))) || !truthy((rt.istype(live(O), T("/obj/item")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if ((!truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))) || !truthy(rt.sv(f, "open")))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0))) return f.dot;
	if (!truthy((yield* g.callName(f, live(f.usr), "put_in_hands", [live(O)])))) {
		yield* g.callName(f, live(O), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/guncase/proc/handle_atom_del  (code/game/objects/structures/guncase.dm:93)
rt.def("/obj/structure/guncase/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/guncase/proc/contents_explosion  (code/game/objects/structures/guncase.dm:96)  may sleep
rt.def("/obj/structure/guncase/proc/contents_explosion", function* contents_explosion(f: Frame, severity: Value, target: Value) {
	let A: Value = null;
	let $e: any, $t: any;
	f.vars = () => [severity, target, A, $e, $t];
	A = null;
	rt.forList(f, 0, rt.sv(f, "contents"), T("/atom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		A = $e;
		yield* g.callName(f, live(A), "ex_act", [($t = live(severity), severity = rt.inc($t, 1), $t), live(target)]);
		if (rt.gt(rt.tickUsage(f), rt.gl("current_ticklimit"))) {
			yield* g.call(f, P("/proc/stoplag"), null, []);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
