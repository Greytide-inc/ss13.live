// From code/game/machinery/iv_drip.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10799, "/obj/machinery/iv_drip", "/obj/machinery", {
	attached: null,
	mode: 1,
	beaker: null,
	drip_containers: null,
	anchored: 0,
	name: "１IV drip",
	icon: rt.rsc("icons/obj/iv_drip.dmi"),
	icon_state: "iv_drip",
	mouse_drag_pointer: 1,
});

// /obj/machinery/iv_drip/proc/<init>  (code/game/machinery/iv_drip.dm:10)
rt.def("/obj/machinery/iv_drip/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "drip_containers", rt.list(T("/obj/item/weapon/reagent_containers/blood"), T("/obj/item/weapon/reagent_containers/food"), T("/obj/item/weapon/reagent_containers/glass")));
	return f.dot;
});

// /obj/machinery/iv_drip/proc/Initialize  (code/game/machinery/iv_drip.dm:15)  may sleep
rt.def("/obj/machinery/iv_drip/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "update_icon");
	rt.setSv(f, "drip_containers", (yield* g.call(f, P("/proc/typecacheof"), null, [rt.sv(f, "drip_containers")])));
	return f.dot;
}, true);

// /obj/machinery/iv_drip/proc/update_icon  (code/game/machinery/iv_drip.dm:22)
rt.def("/obj/machinery/iv_drip/proc/update_icon", function update_icon(f: Frame) {
	let filling_overlay: Value = null, percent: Value = null;
	let $0: any;
	f.vars = () => [filling_overlay, percent, $0];
	if (truthy(rt.sv(f, "attached"))) {
		if (truthy(rt.sv(f, "mode"))) {
			rt.setSv(f, "icon_state", "injecting");
		} else {
			rt.setSv(f, "icon_state", "donating");
		}
	} else {
		if (truthy(rt.sv(f, "mode"))) {
			rt.setSv(f, "icon_state", "injectidle");
		} else {
			rt.setSv(f, "icon_state", "donateidle");
		}
	}
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	if (truthy(rt.sv(f, "attached"))) {
		rt.callSrc(f, "add_overlay", ["beakeractive"]);
	} else {
		rt.callSrc(f, "add_overlay", ["beakeridle"]);
	}
	if (!truthy(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))) return f.dot;
	filling_overlay = rt.call(f, P("/proc/mutable_appearance"), null, [rt.rsc("icons/obj/iv_drip.dmi"), "reagent"]);
	$0 = (percent = rt.call(f, P("/proc/round"), null, [multiply(divide(rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.fv(f, "volume", rt.sv(f, "beaker"))), 100)]));
	if (rt.inRange($0, 0, 9)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent0");
	} else if (rt.inRange($0, 10, 24)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent10");
	} else if (rt.inRange($0, 25, 49)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent25");
	} else if (rt.inRange($0, 50, 74)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent50");
	} else if (rt.inRange($0, 75, 79)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent75");
	} else if (rt.inRange($0, 80, 90)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent80");
	} else if (rt.inRange($0, 91, 9.999999848243207e+30)) {
		rt.setFv(f, "icon_state", live(filling_overlay), "reagent100");
	}
	rt.setFv(f, "color", live(filling_overlay), rt.list("#0000", "#0000", "#0000", "#000f", rt.call(f, P("/proc/mix_color_from_reagents"), null, [rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker")))])));
	rt.callSrc(f, "add_overlay", [live(filling_overlay)]);
	return f.dot;
});

// /obj/machinery/iv_drip/proc/MouseDrop  (code/game/machinery/iv_drip.dm:62)
rt.def("/obj/machinery/iv_drip/proc/MouseDrop", function MouseDrop(f: Frame, target: Value) {
	if (((!truthy((rt.istype(live(f.usr), T("/mob/living/carbon/human")) ? 1 : 0)) || !truthy(rt.callName(f, live(f.usr), "canUseTopic", [live(f.src), 1]))) || !truthy((rt.istype(live(target), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "attached"))) {
		rt.callSrc(f, "visible_message", [fmt("<span class='warning'>＀ is detached from ％！.</span>", [rt.sv(f, "attached"), live(f.src)])]);
		rt.setSv(f, "attached", null);
		rt.callSrc(f, "update_icon", []);
		return live(f.dot);
	}
	if (!truthy(rt.callName(f, live(target), "has_dna", []))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The drip beeps: Warning, incompatible creature!</span>"]);
		return live(f.dot);
	}
	if (!(truthy(rt.callSrc(f, "Adjacent", [live(target)])) && truthy(rt.callName(f, live(f.usr), "Adjacent", [live(target)])))) return f.dot;
	if (truthy(rt.sv(f, "beaker"))) {
		rt.callName(f, live(f.usr), "visible_message", [fmt("<span class='warning'>＀ attaches ％！ to ％！.</span>", [live(f.usr), live(f.src), live(target)]), fmt("<span class='notice'>You attach ％！ to ％！.</span>", [live(f.src), live(target)])]);
		rt.setSv(f, "attached", live(target));
		if (!truthy(rt.fv(f, "isprocessing", live(f.src)))) {
			rt.setFv(f, "isprocessing", live(f.src), 1);
			rt.modField(f, rt.gl("SSmachines"), "processing", live(f.src), add);
		}
		rt.callSrc(f, "update_icon", []);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>There's nothing attached to the IV drip!</span>"]);
	}
	return f.dot;
});

// /obj/machinery/iv_drip/proc/attackby  (code/game/machinery/iv_drip.dm:86)  may sleep
rt.def("/obj/machinery/iv_drip/proc/attackby", function* attackby(f: Frame) {
	if (truthy((yield* g.call(f, P("/proc/is_type_in_typecache"), null, [live(f.args[0]), rt.sv(f, "drip_containers")])))) {
		if (rt.sv(f, "beaker") !== null) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a reagent container loaded!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		rt.setSv(f, "beaker", live(f.args[0]));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You attach ％！ to ％！.</span>", [live(f.args[0]), live(f.src)])]);
		yield* g.srcCall(f, "update_icon");
		return live(f.dot);
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/iv_drip/proc/deconstruct  (code/game/machinery/iv_drip.dm:102)  may sleep
rt.def("/obj/machinery/iv_drip/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc")]);
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/machinery/iv_drip/proc/process  (code/game/machinery/iv_drip.dm:107)  may sleep
rt.def("/obj/machinery/iv_drip/proc/process", function* process(f: Frame) {
	let transfer_amount: Value = null, fraction: Value = null, amount: Value = null;
	f.vars = () => [transfer_amount, fraction, amount];
	if (!truthy(rt.sv(f, "attached"))) {
		return 26;
	}
	if (!(rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), rt.sv(f, "attached")])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.fv(f, "loc", rt.sv(f, "attached"))]))))) {
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "attached"), "<span class='userdanger'>The IV drip needle is ripped out of you!</span>"]);
		yield* g.callName(f, rt.sv(f, "attached"), "apply_damage", [3, "brute", rt.op(f, "PickUnweighted", [2], ["r_arm", "l_arm"])]);
		rt.setSv(f, "attached", null);
		yield* g.srcCall(f, "update_icon");
		return 26;
	}
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	if (truthy(rt.sv(f, "mode"))) {
		if (rt.gt(rt.fv(f, "volume", rt.sv(f, "beaker")), 0)) {
			transfer_amount = 5;
			if (truthy((rt.istype(rt.sv(f, "beaker"), T("/obj/item/weapon/reagent_containers/blood")) ? 1 : 0))) {
				transfer_amount = 10;
			}
			fraction = (yield* g.call(f, P("/proc/min"), null, [divide(live(transfer_amount), rt.fv(f, "volume", rt.sv(f, "beaker"))), 1]));
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "reaction", [rt.sv(f, "attached"), 5, live(fraction), 0]);
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "beaker")), "trans_to", [rt.sv(f, "attached"), live(transfer_amount)]);
			yield* g.srcCall(f, "update_icon");
		}
	} else {
		if (isEqual((amount = (yield* g.call(f, P("/proc/min"), null, [(amount = subtract(rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker"))))), 4]))), 0)) {
			if (truthy(rt.op(f, "Prob", [], [5]))) {
				yield* g.srcCall(f, "visible_message", fmt("＄！ pings.", [live(f.src)]));
			}
			return live(f.dot);
		}
		if ((rt.lt(rt.fv(f, "blood_volume", rt.sv(f, "attached")), 475) && truthy(rt.op(f, "Prob", [], [5])))) {
			yield* g.srcCall(f, "visible_message", fmt("＄！ beeps loudly.", [live(f.src)]));
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/twobeep.ogg"), 50, 1]);
		}
		yield* g.callName(f, rt.sv(f, "attached"), "transfer_blood_to", [rt.sv(f, "beaker"), live(amount)]);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/iv_drip/proc/attack_hand  (code/game/machinery/iv_drip.dm:147)
rt.def("/obj/machinery/iv_drip/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!truthy((rt.istype(live(user), T("/mob/living/carbon/human")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "attached"))) {
		rt.callSrc(f, "visible_message", [fmt("＀ is detached from ％！", [rt.sv(f, "attached"), live(f.src)])]);
		rt.setSv(f, "attached", null);
		rt.callSrc(f, "update_icon", []);
		return live(f.dot);
	} else {
		if (truthy(rt.sv(f, "beaker"))) {
			rt.callSrc(f, "eject_beaker", [live(user)]);
		} else {
			rt.callSrc(f, "toggle_mode", []);
		}
	}
	return f.dot;
});

// /obj/machinery/iv_drip/verb/eject_beaker  (code/game/machinery/iv_drip.dm:164)
rt.def("/obj/machinery/iv_drip/verb/eject_beaker", function eject_beaker(f: Frame, user: Value) {
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't do that!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "stat", live(f.usr)))) {
		return live(f.dot);
	}
	if (!truthy(rt.sv(f, "beaker"))) return f.dot;
	rt.setFv(f, "loc", rt.sv(f, "beaker"), rt.getStep(f, live(f.src), 0));
	rt.setSv(f, "beaker", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Remove IV Container", category: "Object", src: 1, range: 1 }, argTypes: [{ type: 8, path: "/mob" }] });

// /obj/machinery/iv_drip/verb/toggle_mode  (code/game/machinery/iv_drip.dm:181)
rt.def("/obj/machinery/iv_drip/verb/toggle_mode", function toggle_mode(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (!truthy((rt.istype(live(f.usr), T("/mob/living")) ? 1 : 0))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='warning'>You can't do that!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.fv(f, "stat", live(f.usr)))) {
		return live(f.dot);
	}
	rt.setSv(f, "mode", (!truthy(rt.sv(f, "mode")) ? 1 : 0));
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "mode"))) {
		$1 = "injecting";
	} else {
		$1 = "taking blood";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The IV drip is now ＀.", [$1])]);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
}, false, { verb: { name: "Toggle Mode", category: "Object", src: 1, range: 1 } });

// /obj/machinery/iv_drip/proc/examine  (code/game/machinery/iv_drip.dm:194)
rt.def("/obj/machinery/iv_drip/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	if ((!truthy((rt.isIn(f, live(f.usr), rt.call(f, P("/proc/view"), null, [2])) ? 1 : 0)) && !isEqual(live(f.usr), rt.sv(f, "loc")))) {
		return live(f.dot);
	}
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "mode"))) {
		$1 = "injecting";
	} else {
		$1 = "taking blood";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The IV drip is ＀.", [$1])]);
	if (truthy(rt.sv(f, "beaker"))) {
		if ((truthy(rt.fv(f, "reagents", rt.sv(f, "beaker"))) && truthy(rt.getLen(f, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "beaker"))))))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>Attached is ＇！ with ＀ units of liquid.</span>", [rt.sv(f, "beaker"), rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "beaker")))])]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>Attached is an empty ＀.</span>", [rt.fv(f, "name", rt.sv(f, "beaker"))])]);
		}
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='notice'>No chemicals are attached.</span>"]);
	}
	$0 = live(f.usr);
	if (truthy(rt.sv(f, "attached"))) {
		$1 = rt.sv(f, "attached");
	} else {
		$1 = "No one";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>＀ is attached.</span>", [$1])]);
	return f.dot;
}, false, { verb: { src: 1 } });
