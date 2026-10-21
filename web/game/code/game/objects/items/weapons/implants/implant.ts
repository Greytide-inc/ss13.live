// From code/game/objects/items/weapons/implants/implant.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7399, "/obj/item/weapon/implant", "/obj/item/weapon", {
	activated: 1,
	imp_in: null,
	allow_multiple: 0,
	uses: -1,
	flags: 16384,
	name: "implant",
	icon: rt.rsc("icons/obj/implants.dmi"),
	icon_state: "generic",
	origin_tech: "materials=2;biotech=3;programming=2",
	actions_types: null,
	item_color: "b",
});

// /obj/item/weapon/implant/proc/<init>  (code/game/objects/items/weapons/implants/implant.dm:6)
rt.def("/obj/item/weapon/implant/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/hands_free/activate")));
	return f.dot;
});

// /obj/item/weapon/implant/proc/ui_action_click  (code/game/objects/items/weapons/implants/implant.dm:22)  may sleep
rt.def("/obj/item/weapon/implant/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "activate", "action_button");
	return f.dot;
}, true);

// /obj/item/weapon/implant/proc/implant  (code/game/objects/items/weapons/implants/implant.dm:42)  may sleep
rt.def("/obj/item/weapon/implant/proc/implant", function* implant(f: Frame, target: Value, user: Value, silent: Value) {
	let X: Value = null, imp_e: Value = null, A: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [target, user, silent, X, imp_e, A, H, $e];
	if (live(silent) === null) {
		silent = 0;
	}
	if (!truthy(rt.fv(f, "implants", live(target)))) {
		rt.setFv(f, "implants", live(target), rt.list());
	}
	if ((!truthy((yield* g.callName(f, live(target), "can_be_implanted", []))) || !truthy((yield* g.srcCall(f, "can_be_implanted_in", live(target)))))) {
		return 0;
	}
	X = null;
	rt.forList(f, 0, rt.fv(f, "implants", live(target)));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		if (truthy(rt.op(f, "IsType", [], [live(X), rt.sv(f, "type")]))) {
			imp_e = live(X);
			if (!truthy(rt.sv(f, "allow_multiple"))) {
				if (rt.lt(rt.fv(f, "uses", live(imp_e)), multiply(rt.initial(f, live(imp_e), "uses"), 2))) {
					if (isEqual(rt.sv(f, "uses"), -1)) {
						rt.setFv(f, "uses", live(imp_e), -1);
					} else {
						rt.setFv(f, "uses", live(imp_e), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "uses", live(imp_e)), rt.sv(f, "uses")), multiply(rt.initial(f, live(imp_e), "uses"), 2)])));
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
					return 1;
				} else {
					return 0;
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.setFv(f, "loc", live(f.src), live(target));
	rt.setSv(f, "imp_in", live(target));
	rt.modField(f, live(target), "implants", live(f.src), add);
	if (truthy(rt.sv(f, "activated"))) {
		X = null;
		rt.forList(f, 0, rt.sv(f, "actions"));
		while (($e = rt.next(f, 0)) !== undefined) {
			X = $e;
			yield* g.callName(f, (A = live(X)), "Grant", [live(target)]);
		}
		rt.endFor(f, 0);
	}
	if (truthy((rt.istype(live(target), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(target)), "sec_hud_set_implants", []);
	}
	if (truthy(live(user))) {
		yield* g.call(f, P("/proc/add_logs"), null, [null, live(user), null, live(target), null, "implanted", "object", fmt("＀", [rt.sv(f, "name")])], rt.Args.Named);
	}
	return 1;
}, true);

// /obj/item/weapon/implant/proc/removed  (code/game/objects/items/weapons/implants/implant.dm:76)  may sleep
rt.def("/obj/item/weapon/implant/proc/removed", function* removed(f: Frame, source: Value, silent: Value, special: Value) {
	let X: Value = null, A: Value = null, H: Value = null;
	let $e: any;
	f.vars = () => [source, silent, special, X, A, H, $e];
	if (live(silent) === null) {
		silent = 0;
	}
	if (live(special) === null) {
		special = 0;
	}
	rt.setFv(f, "loc", live(f.src), null);
	rt.setSv(f, "imp_in", null);
	(rt.modField(f, live(source), "implants", live(f.src), subtract));
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "Grant", [live(source)]);
	}
	rt.endFor(f, 0);
	if (truthy((rt.istype(live(source), T("/mob/living/carbon/human")) ? 1 : 0))) {
		yield* g.callName(f, (H = live(source)), "sec_hud_set_implants", []);
	}
	return 1;
}, true);

// /obj/item/weapon/implant/proc/Destroy  (code/game/objects/items/weapons/implants/implant.dm:90)  may sleep
rt.def("/obj/item/weapon/implant/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "imp_in"))) {
		yield* g.srcCall(f, "removed", rt.sv(f, "imp_in"));
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/implant/proc/get_data  (code/game/objects/items/weapons/implants/implant.dm:94)
rt.def("/obj/item/weapon/implant/proc/get_data", function get_data(f: Frame) {
	return "No information available";
});

// /obj/item/weapon/implant/proc/dropped  (code/game/objects/items/weapons/implants/implant.dm:98)  may sleep
rt.def("/obj/item/weapon/implant/proc/dropped", function* dropped(f: Frame) {
	f.dot = 1;
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });
