// From code/game/objects/items/weapons/implants/implantcase.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(7418, "/obj/item/weapon/implantcase", "/obj/item/weapon", {
	imp: null,
	imp_type: null,
	throw_speed: 2,
	throw_range: 5,
	name: "implant case",
	desc: "A glass case containing an implant.",
	icon: rt.rsc("icons/obj/items.dmi"),
	icon_state: "implantcase-0",
	item_state: "implantcase",
	w_class: 1,
	origin_tech: "materials=1;biotech=2",
	materials: null,
});

// /obj/item/weapon/implantcase/proc/<init>  (code/game/objects/items/weapons/implants/implantcase.dm:11)
rt.def("/obj/item/weapon/implantcase/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "materials", rt.alist(f, ["$glass", 500]));
	return f.dot;
});

// /obj/item/weapon/implantcase/proc/update_icon  (code/game/objects/items/weapons/implants/implantcase.dm:18)
rt.def("/obj/item/weapon/implantcase/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "imp"))) {
		rt.setSv(f, "icon_state", fmt("implantcase-＀", [rt.fv(f, "item_color", rt.sv(f, "imp"))]));
		rt.setSv(f, "origin_tech", rt.fv(f, "origin_tech", rt.sv(f, "imp")));
		rt.setSv(f, "reagents", rt.fv(f, "reagents", rt.sv(f, "imp")));
	} else {
		rt.setSv(f, "icon_state", "implantcase-0");
		rt.setSv(f, "origin_tech", rt.initial(f, live(f.src), "origin_tech"));
		rt.setSv(f, "reagents", null);
	}
	return f.dot;
});

// /obj/item/weapon/implantcase/proc/attackby  (code/game/objects/items/weapons/implants/implantcase.dm:28)  may sleep
rt.def("/obj/item/weapon/implantcase/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null, I: Value = null;
	f.vars = () => [t, I];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "What would you like the label to be?", rt.sv(f, "name"), null]));
		if (!isEqual((yield* g.callName(f, live(f.args[1]), "get_active_held_item", [])), live(f.args[0]))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[1])])), 1) && !isEqual(rt.sv(f, "loc"), live(f.args[1])))) {
			return live(f.dot);
		}
		if (truthy(live(t))) {
			rt.setSv(f, "name", fmt("implant case - '＀'", [live(t)]));
		} else {
			rt.setSv(f, "name", "implant case");
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/implanter")) ? 1 : 0))) {
			if (truthy(rt.gv(f, "imp", (I = live(f.args[0]))))) {
				if ((truthy(rt.sv(f, "imp")) || truthy(rt.gv(f, "imp_in", rt.fv(f, "imp", live(I)))))) {
					return live(f.dot);
				}
				rt.setFv(f, "loc", rt.fv(f, "imp", live(I)), live(f.src));
				rt.setSv(f, "imp", rt.fv(f, "imp", live(I)));
				rt.setFv(f, "imp", live(I), null);
				yield* g.srcCall(f, "update_icon");
				yield* g.callName(f, live(I), "update_icon", []);
			} else {
				if (truthy(rt.sv(f, "imp"))) {
					if (truthy(rt.fv(f, "imp", live(I)))) {
						return live(f.dot);
					}
					rt.setFv(f, "loc", rt.sv(f, "imp"), live(I));
					rt.setFv(f, "imp", live(I), rt.sv(f, "imp"));
					rt.setSv(f, "imp", null);
					yield* g.srcCall(f, "update_icon");
				}
				yield* g.callName(f, live(I), "update_icon", []);
			}
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/weapon/implantcase/proc/Initialize  (code/game/objects/items/weapons/implants/implantcase.dm:62)  may sleep
rt.def("/obj/item/weapon/implantcase/proc/Initialize", function* Initialize(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "imp_type"))) {
		rt.setSv(f, "imp", (yield* g.new_(f, rt.sv(f, "imp_type"), [live(f.src)])));
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["mapload"] });
