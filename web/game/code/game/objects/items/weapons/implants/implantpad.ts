// From code/game/objects/items/weapons/implants/implantpad.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7445, "/obj/item/weapon/implantpad", "/obj/item/weapon", {
	case: null,
	broadcasting: null,
	listening: 1,
	throw_speed: 3,
	throw_range: 5,
	name: "implantpad",
	desc: "Used to modify implants.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implantpad-0",
	item_state: "electronic",
	w_class: 2,
});

// /obj/item/weapon/implantpad/proc/update_icon  (code/game/objects/items/weapons/implants/implantpad.dm:17)
rt.def("/obj/item/weapon/implantpad/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "case"))) {
		rt.setSv(f, "icon_state", "implantpad-1");
	} else {
		rt.setSv(f, "icon_state", "implantpad-0");
	}
	return f.dot;
});

// /obj/item/weapon/implantpad/proc/attack_hand  (code/game/objects/items/weapons/implants/implantpad.dm:23)  may sleep
rt.def("/obj/item/weapon/implantpad/proc/attack_hand", function* attack_hand(f: Frame) {
	if ((truthy(rt.sv(f, "case")) && truthy((yield* g.callName(f, live(f.args[0]), "is_holding", [live(f.src)]))))) {
		yield* g.callName(f, live(f.args[0]), "put_in_active_hand", [rt.sv(f, "case")]);
		yield* g.callName(f, rt.sv(f, "case"), "add_fingerprint", [live(f.args[0])]);
		rt.setSv(f, "case", null);
		yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
		yield* g.srcCall(f, "update_icon");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/implantpad/proc/attackby  (code/game/objects/items/weapons/implants/implantpad.dm:36)  may sleep
rt.def("/obj/item/weapon/implantpad/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/implantcase")) ? 1 : 0))) {
		if (!truthy(rt.sv(f, "case"))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setSv(f, "case", live(f.args[0]));
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["C", "user", "params"] });

// /obj/item/weapon/implantpad/proc/attack_self  (code/game/objects/items/weapons/implants/implantpad.dm:46)  may sleep
rt.def("/obj/item/weapon/implantpad/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let dat: Value = null;
	f.vars = () => [user, dat];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	dat = "<B>Implant Mini-Computer:</B><HR>";
	if (truthy(rt.sv(f, "case"))) {
		if (truthy(rt.fv(f, "imp", rt.sv(f, "case")))) {
			if (truthy((rt.istype(rt.fv(f, "imp", rt.sv(f, "case")), T("/obj/item/weapon/implant")) ? 1 : 0))) {
				dat = rt.modify(live(dat), (yield* g.callName(f, rt.fv(f, "imp", rt.sv(f, "case")), "get_data", [])), add);
			}
		} else {
			dat = rt.modify(live(dat), "The implant casing is empty.", add);
		}
	} else {
		dat = rt.modify(live(dat), "Please insert an implant casing!", add);
	}
	rt.op(f, "Browse", [], [live(user), live(dat), "window=implantpad"], false);
	yield* g.call(f, P("/proc/onclose"), null, [live(user), "implantpad"]);
	return f.dot;
}, true);

// /obj/item/weapon/implantpad/proc/Topic  (code/game/objects/items/weapons/implants/implantpad.dm:61)  may sleep
rt.def("/obj/item/weapon/implantpad/proc/Topic", function* Topic(f: Frame) {
	let M: Value = null;
	let $e: any;
	f.vars = () => [M, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.fv(f, "stat", live(f.usr)))) {
		return live(f.dot);
	}
	if ((truthy((yield* g.callName(f, rt.fv(f, "contents", live(f.usr)), "Find", [live(f.src)]))) || (rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))))) {
		yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [rt.sv(f, "loc")])))) {
			yield* g.srcCall(f, "attack_self", rt.sv(f, "loc"));
		} else {
			M = null;
			rt.forList(f, 0, (yield* g.call(f, P("/proc/viewers"), null, [1, live(f.src)])), T("/mob"));
			while (($e = rt.next(f, 0)) !== undefined) {
				M = $e;
				if (truthy(rt.fv(f, "client", live(M)))) {
					yield* g.srcCall(f, "attack_self", live(M));
				}
			}
			rt.endFor(f, 0);
		}
		yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	} else {
		rt.op(f, "Browse", [], [live(f.usr), null, "window=implantpad"], false);
	}
	return f.dot;
}, true, { args: ["href", "href_list"] });
