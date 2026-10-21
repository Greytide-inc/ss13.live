// From code/modules/projectiles/ammunition.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8654, "/obj/item/ammo_casing", "/obj/item", {
	fire_sound: null,
	caliber: null,
	projectile_type: null,
	BB: null,
	pellets: 1,
	variance: 0,
	randomspread: 0,
	delay: 0,
	click_cooldown_override: 0,
	firing_effect_type: rt.typePath("/obj/effect/temp_visual/dir_setting/firing_effect"),
	flags: 64,
	name: "bullet casing",
	desc: "A bullet casing.",
	icon: rt.rsc("icons/obj/ammo.dmi"),
	icon_state: "s-casing",
	slot_flags: 512,
	throwforce: 0,
	w_class: 1,
});

// /obj/item/ammo_casing/proc/New  (code/modules/projectiles/ammunition.dm:23)  may sleep
rt.def("/obj/item/ammo_casing/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "projectile_type"))) {
		rt.setSv(f, "BB", (yield* g.new_(f, rt.sv(f, "projectile_type"), [live(f.src)])));
	}
	rt.setSv(f, "pixel_x", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	rt.setSv(f, "pixel_y", (yield* g.call(f, P("/proc/rand"), null, [-10, 10])));
	yield* g.srcCall(f, "setDir", rt.op(f, "PickUnweighted", [1], [rt.gl("alldirs")]));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/ammo_casing/proc/update_icon  (code/modules/projectiles/ammunition.dm:32)
rt.def("/obj/item/ammo_casing/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "BB"))) {
		$1 = "-live";
	} else {
		$1 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	$0 = rt.initial(f, live(f.src), "desc");
	if (truthy(rt.sv(f, "BB"))) {
		$1 = "";
	} else {
		$1 = " This one is spent";
	}
	rt.setSv(f, "desc", fmt("＀＀", [$0, $1]));
	return f.dot;
});

// /obj/item/ammo_casing/proc/newshot  (code/modules/projectiles/ammunition.dm:38)  may sleep
rt.def("/obj/item/ammo_casing/proc/newshot", function* newshot(f: Frame) {
	if (truthy(rt.sv(f, "BB"))) return f.dot;
	rt.setSv(f, "BB", (yield* g.new_(f, rt.sv(f, "projectile_type"), [live(f.src)])));
	return f.dot;
}, true);

// /obj/item/ammo_casing/proc/attackby  (code/modules/projectiles/ammunition.dm:42)  may sleep
rt.def("/obj/item/ammo_casing/proc/attackby", function* attackby(f: Frame) {
	let box: Value = null, boolets: Value = null, bullet: Value = null;
	let $e: any;
	f.vars = () => [box, boolets, bullet, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_box")) ? 1 : 0))) {
		box = live(f.args[0]);
		if (truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
			boolets = 0;
			bullet = null;
			rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/item/ammo_casing"));
			while (($e = rt.next(f, 0)) !== undefined) {
				bullet = $e;
				if (rt.ge(rt.getLen(f, rt.fv(f, "stored_ammo", live(box))), rt.fv(f, "max_ammo", live(box)))) {
					break;
				}
				if (truthy(rt.fv(f, "BB", live(bullet)))) {
					if (truthy((yield* g.callName(f, live(box), "give_round", [live(bullet), 0])))) {
						boolets = rt.inc(live(boolets), 1);
					}
				} else {
					continue;
				}
			}
			rt.endFor(f, 0);
			if (rt.gt(live(boolets), 0)) {
				yield* g.callName(f, live(box), "update_icon", []);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You collect ＀ shell５. ＀ now contains ＀ shell５.</span>", [live(boolets), live(box), rt.getLen(f, rt.fv(f, "stored_ammo", live(box)))])]);
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You fail to collect anything!</span>"]);
			}
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });
