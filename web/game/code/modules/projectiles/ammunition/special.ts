// From code/modules/projectiles/ammunition/special.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(8665, "/obj/item/ammo_casing/magic/chaos", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic"),
});

// /obj/item/ammo_casing/magic/chaos/proc/newshot  (code/modules/projectiles/ammunition/special.dm:38)  may sleep
rt.def("/obj/item/ammo_casing/magic/chaos/proc/newshot", function* newshot(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

rt.type(8786, "/obj/item/ammo_casing/syringegun", "/obj/item/ammo_casing", {
	name: "syringe gun spring",
	desc: "A high-power spring that throws syringes.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/dart/syringe"),
	firing_effect_type: null,
});

// /obj/item/ammo_casing/syringegun/proc/ready_proj  (code/modules/projectiles/ammunition/special.dm:50)  may sleep
rt.def("/obj/item/ammo_casing/syringegun/proc/ready_proj", function* ready_proj(f: Frame) {
	let SG: Value = null, S: Value = null, D: Value = null;
	f.vars = () => [SG, S, D];
	if (live(f.args[3]) === null) {
		f.args[3] = "";
	}
	if (!truthy(rt.sv(f, "BB"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/gun/syringe")) ? 1 : 0))) {
		if (!truthy(rt.getLen(f, rt.gv(f, "syringes", (SG = rt.sv(f, "loc")))))) {
			return live(f.dot);
		}
		yield* g.callName(f, rt.gv(f, "reagents", (S = rt.index(rt.fv(f, "syringes", live(SG)), 1))), "trans_to", [rt.sv(f, "BB"), rt.gv(f, "total_volume", rt.fv(f, "reagents", live(S)))]);
		rt.setFv(f, "name", rt.sv(f, "BB"), rt.fv(f, "name", live(S)));
		rt.setFv(f, "piercing", (D = rt.sv(f, "BB")), rt.fv(f, "proj_piercing", live(S)));
		yield* g.callName(f, rt.fv(f, "syringes", live(SG)), "Remove", [live(S)]);
		yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });

rt.type(8787, "/obj/item/ammo_casing/dnainjector", "/obj/item/ammo_casing", {
	name: "rigged syringe gun spring",
	desc: "A high-power spring that throws DNA injectors.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/dnainjector"),
	firing_effect_type: null,
});

// /obj/item/ammo_casing/dnainjector/proc/ready_proj  (code/modules/projectiles/ammunition/special.dm:74)  may sleep
rt.def("/obj/item/ammo_casing/dnainjector/proc/ready_proj", function* ready_proj(f: Frame) {
	let SG: Value = null, S: Value = null, D: Value = null;
	f.vars = () => [SG, S, D];
	if (live(f.args[3]) === null) {
		f.args[3] = "";
	}
	if (!truthy(rt.sv(f, "BB"))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/obj/item/weapon/gun/syringe/dna")) ? 1 : 0))) {
		if (!truthy(rt.getLen(f, rt.gv(f, "syringes", (SG = rt.sv(f, "loc")))))) {
			return live(f.dot);
		}
		S = (yield* g.call(f, P("/proc/popleft"), null, [rt.fv(f, "syringes", live(SG))]));
		D = rt.sv(f, "BB");
		yield* g.callName(f, live(S), "forceMove", [live(D)]);
		rt.setFv(f, "injector", live(D), live(S));
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });
