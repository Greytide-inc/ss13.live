// From code/modules/assembly/holder.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9387, "/obj/item/device/assembly_holder", "/obj/item/device", {
	a_left: null,
	a_right: null,
	flags: 64,
	throw_speed: 2,
	throw_range: 7,
	name: "Assembly",
	icon: rt.rsc("icons/obj/assemblies/new_assemblies.dmi"),
	icon_state: "holder",
	item_state: "assembly",
	throwforce: 5,
	w_class: 2,
});

// /obj/item/device/assembly_holder/proc/assemble  (code/modules/assembly/holder.dm:20)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/assemble", function* assemble(f: Frame, A: Value, A2: Value, user: Value) {
	f.vars = () => [A, A2, user];
	yield* g.srcCall(f, "attach", live(A), live(user));
	yield* g.srcCall(f, "attach", live(A2), live(user));
	rt.setSv(f, "name", fmt("＀-＀ assembly", [rt.fv(f, "name", live(A)), rt.fv(f, "name", live(A2))]));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/attach  (code/modules/assembly/holder.dm:27)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/attach", function* attach(f: Frame, A: Value, user: Value) {
	f.vars = () => [A, user];
	if (!truthy((yield* g.callName(f, live(A), "remove_item_from_storage", [live(f.src)])))) {
		if (truthy(live(user))) {
			yield* g.callName(f, live(user), "transferItemToLoc", [live(A), live(f.src)]);
		} else {
			yield* g.callName(f, live(A), "forceMove", [live(f.src)]);
		}
	}
	rt.setFv(f, "holder", live(A), live(f.src));
	yield* g.callName(f, live(A), "toggle_secure", []);
	if (!truthy(rt.sv(f, "a_left"))) {
		rt.setSv(f, "a_left", live(A));
	} else {
		rt.setSv(f, "a_right", live(A));
	}
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/update_icon  (code/modules/assembly/holder.dm:40)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/update_icon", function* update_icon(f: Frame) {
	let O: Value = null, right: Value = null, O_1: Value = null;
	let $e: any;
	f.vars = () => [O, right, O_1, $e];
	yield* g.srcCall(f, "cut_overlays");
	if (truthy(rt.sv(f, "a_left"))) {
		yield* g.srcCall(f, "add_overlay", fmt("＀_left", [rt.fv(f, "icon_state", rt.sv(f, "a_left"))]));
		O = null;
		rt.forList(f, 0, rt.fv(f, "attached_overlays", rt.sv(f, "a_left")));
		while (($e = rt.next(f, 0)) !== undefined) {
			O = $e;
			yield* g.srcCall(f, "add_overlay", fmt("＀_l", [live(O)]));
		}
		rt.endFor(f, 0);
	}
	if (truthy(rt.sv(f, "a_right"))) {
		rt.setFv(f, "transform", (right = (yield* g.call(f, P("/proc/mutable_appearance"), null, [rt.sv(f, "icon"), fmt("＀_left", [rt.fv(f, "icon_state", rt.sv(f, "a_right"))])]))), (yield* g.call(f, P("/proc/matrix"), null, [-1, 0, 0, 0, 1, 0])));
		O_1 = null;
		rt.forList(f, 0, rt.fv(f, "attached_overlays", rt.sv(f, "a_right")));
		while (($e = rt.next(f, 0)) !== undefined) {
			O_1 = $e;
			yield* g.callName(f, live(right), "add_overlay", [fmt("＀_l", [live(O_1)])]);
		}
		rt.endFor(f, 0);
		yield* g.srcCall(f, "add_overlay", live(right));
	}
	if (!truthy(rt.sv(f, "master"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "master"), "update_icon", []);
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/Crossed  (code/modules/assembly/holder.dm:58)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/Crossed", function* Crossed(f: Frame, AM: Value) {
	f.vars = () => [AM];
	if (truthy(rt.sv(f, "a_left"))) {
		yield* g.callName(f, rt.sv(f, "a_left"), "Crossed", [live(AM)]);
	}
	if (!truthy(rt.sv(f, "a_right"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "a_right"), "Crossed", [live(AM)]);
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/on_found  (code/modules/assembly/holder.dm:64)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/on_found", function* on_found(f: Frame, finder: Value) {
	f.vars = () => [finder];
	if (truthy(rt.sv(f, "a_left"))) {
		yield* g.callName(f, rt.sv(f, "a_left"), "on_found", [live(finder)]);
	}
	if (!truthy(rt.sv(f, "a_right"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "a_right"), "on_found", [live(finder)]);
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/Move  (code/modules/assembly/holder.dm:69)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/Move", function* Move(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if ((truthy(rt.sv(f, "a_left")) && truthy(rt.sv(f, "a_right")))) {
		yield* g.callName(f, rt.sv(f, "a_left"), "holder_movement", []);
		yield* g.callName(f, rt.sv(f, "a_right"), "holder_movement", []);
	}
	return live(f.dot);
}, true);

// /obj/item/device/assembly_holder/proc/attack_hand  (code/modules/assembly/holder.dm:76)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((truthy(rt.sv(f, "a_left")) && truthy(rt.sv(f, "a_right")))) {
		yield* g.callName(f, rt.sv(f, "a_left"), "holder_movement", []);
		yield* g.callName(f, rt.sv(f, "a_right"), "holder_movement", []);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return live(f.dot);
}, true);

// /obj/item/device/assembly_holder/proc/attackby  (code/modules/assembly/holder.dm:83)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/attackby", function* attackby(f: Frame) {
	let _T: Value = null;
	f.vars = () => [_T];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
		if (!truthy((_T = rt.getStep(f, live(f.src), 0)))) {
			return 0;
		}
		if (truthy(rt.sv(f, "a_left"))) {
			rt.setFv(f, "holder", rt.sv(f, "a_left"), null);
			rt.setFv(f, "loc", rt.sv(f, "a_left"), live(_T));
		}
		if (truthy(rt.sv(f, "a_right"))) {
			rt.setFv(f, "holder", rt.sv(f, "a_right"), null);
			rt.setFv(f, "loc", rt.sv(f, "a_right"), live(_T));
		}
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/device/assembly_holder/proc/attack_self  (code/modules/assembly/holder.dm:98)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any;
	f.vars = () => [user, $0];
	yield* g.callName(f, live(f.src), "add_fingerprint", [live(user)]);
	if ((!truthy(rt.sv(f, "a_left")) || !truthy(rt.sv(f, "a_right")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='danger'>Assembly part missing!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.op(f, "IsType", [], [rt.sv(f, "a_left"), rt.fv(f, "type", rt.sv(f, "a_right"))]))) {
		$0 = (yield* g.call(f, P("/proc/alert"), null, ["Which side would you like to use?", null, "Left", "Right"]));
		if ($0 === "Left") {
			yield* g.callName(f, rt.sv(f, "a_left"), "attack_self", [live(user)]);
		} else if ($0 === "Right") {
			yield* g.callName(f, rt.sv(f, "a_right"), "attack_self", [live(user)]);
		}
		return live(f.dot);
	} else {
		yield* g.callName(f, rt.sv(f, "a_left"), "attack_self", [live(user)]);
		yield* g.callName(f, rt.sv(f, "a_right"), "attack_self", [live(user)]);
	}
	return f.dot;
}, true);

// /obj/item/device/assembly_holder/proc/process_activation  (code/modules/assembly/holder.dm:115)  may sleep
rt.def("/obj/item/device/assembly_holder/proc/process_activation", function* process_activation(f: Frame, D: Value, normal: Value, special: Value) {
	f.vars = () => [D, normal, special];
	if (live(normal) === null) {
		normal = 1;
	}
	if (live(special) === null) {
		special = 1;
	}
	if (!truthy(live(D))) {
		return 0;
	}
	if (((truthy(live(normal)) && truthy(rt.sv(f, "a_right"))) && truthy(rt.sv(f, "a_left")))) {
		if (!isEqual(rt.sv(f, "a_right"), live(D))) {
			yield* g.callName(f, rt.sv(f, "a_right"), "pulsed", [0]);
		}
		if (!isEqual(rt.sv(f, "a_left"), live(D))) {
			yield* g.callName(f, rt.sv(f, "a_left"), "pulsed", [0]);
		}
	}
	if (truthy(rt.sv(f, "master"))) {
		yield* g.callName(f, rt.sv(f, "master"), "receive_signal", []);
	}
	return 1;
}, true);
