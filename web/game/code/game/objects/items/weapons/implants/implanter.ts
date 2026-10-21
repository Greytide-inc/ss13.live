// From code/game/objects/items/weapons/implants/implanter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7430, "/obj/item/weapon/implanter", "/obj/item/weapon", {
	imp: null,
	imp_type: null,
	throw_speed: 3,
	throw_range: 5,
	name: "implanter",
	desc: "A sterile automatic implant injector.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implanter0",
	item_state: "syringe_0",
	w_class: 2,
	origin_tech: "materials=2;biotech=3",
	materials: null,
});

// /obj/item/weapon/implanter/proc/<init>  (code/game/objects/items/weapons/implants/implanter.dm:11)
rt.def("/obj/item/weapon/implanter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$metal", 600, "$glass", 200]));
	return f.dot;
});

// /obj/item/weapon/implanter/proc/update_icon  (code/game/objects/items/weapons/implants/implanter.dm:18)
rt.def("/obj/item/weapon/implanter/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "imp"))) {
		rt.setSv(f, "icon_state", "implanter1");
		rt.setSv(f, "origin_tech", rt.fv(f, "origin_tech", rt.sv(f, "imp")));
	} else {
		rt.setSv(f, "icon_state", "implanter0");
		rt.setSv(f, "origin_tech", rt.initial(f, live(f.src), "origin_tech"));
	}
	return f.dot;
});

// /obj/item/weapon/implanter/proc/attack  (code/game/objects/items/weapons/implants/implanter.dm:26)  may sleep
rt.def("/obj/item/weapon/implanter/proc/attack", function* attack(f: Frame, M: Value, user: Value) {
	let _T: Value = null;
	f.vars = () => [M, user, _T];
	if (!truthy((rt.istype(live(M), T("/mob/living")) ? 1 : 0))) {
		return live(f.dot);
	}
	if (!(truthy(live(user)) && truthy(rt.sv(f, "imp")))) return f.dot;
	if (!isEqual(live(M), live(user))) {
		yield* g.callName(f, live(M), "visible_message", [fmt("<span class='warning'>＀ is attempting to implant ＀.</span>", [live(user), live(M)])]);
	}
	if (!(truthy((_T = rt.getStep(f, live(M), 0))) && (isEqual(live(M), live(user)) || truthy((yield* g.call(f, P("/proc/do_mob"), null, [live(user), live(M), 50])))))) return f.dot;
	if (!(truthy(live(f.src)) && truthy(rt.sv(f, "imp")))) return f.dot;
	if (truthy((yield* g.callName(f, rt.sv(f, "imp"), "implant", [live(M), live(user)])))) {
		if (isEqual(live(M), live(user))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You implant yourself.</span>"]);
		} else {
			yield* g.callName(f, live(M), "visible_message", [fmt("＀ has implanted ＀.", [live(user), live(M)]), fmt("<span class='notice'>＀ implants you.</span>", [live(user)])]);
		}
		rt.setSv(f, "imp", null);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ fails to implant ＀.</span>", [live(f.src), live(M)])]);
	}
	return f.dot;
}, true);

// /obj/item/weapon/implanter/proc/attackby  (code/game/objects/items/weapons/implants/implanter.dm:46)  may sleep
rt.def("/obj/item/weapon/implanter/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null;
	f.vars = () => [t];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like the label to be?", rt.sv(f, "name"), null]));
		if (!isEqual((yield* g.callName(f, live(f.args[1]), "get_active_held_item", [])), live(f.args[0]))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1) && !isEqual(rt.sv(f, "loc"), live(f.args[1])))) {
			return live(f.dot);
		}
		if (truthy(live(t))) {
			rt.setSv(f, "name", fmt("implanter (＀)", [live(t)]));
		} else {
			rt.setSv(f, "name", "implanter");
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/implanter/proc/Initialize  (code/game/objects/items/weapons/implants/implanter.dm:60)  may sleep
rt.def("/obj/item/weapon/implanter/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "imp_type"))) {
		rt.setSv(f, "imp", (yield* g.new_(f, rt.sv(f, "imp_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });
