// Based on /tg/station's code/modules/projectiles/ammunition/special.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(8665, "/obj/item/ammo_casing/magic/chaos", "/obj/item/ammo_casing/magic", {
	projectile_type: rt.typePath("/obj/item/projectile/magic"),
});

// special.dm:38
rt.def("/obj/item/ammo_casing/magic/chaos/proc/newshot", function* newshot(f: Frame) {
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(8786, "/obj/item/ammo_casing/syringegun", "/obj/item/ammo_casing", {
	name: "syringe gun spring",
	desc: "A high-power spring that throws syringes.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/dart/syringe"),
	firing_effect_type: null,
});

// special.dm:50
rt.def("/obj/item/ammo_casing/syringegun/proc/ready_proj", function* ready_proj(f: Frame) {
	let SG: Value = null, S: Value = null, D: Value = null;
	if (f.args[3] === null) {
		f.args[3] = "";
	}
	if (!this.BB) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/obj/item/weapon/gun/syringe"))) {
		if (!rt.len(f, (SG = this.loc).syringes)) {
			return f.dot;
		}
		yield* (S = rt.index(SG.syringes, 1)).reagents.trans_to(this.BB, S.reagents.total_volume);
		this.BB.name = S.name;
		(D = this.BB).piercing = S.proj_piercing;
		yield* SG.syringes.Remove(S);
		yield* qdel(S);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });

rt.type(8787, "/obj/item/ammo_casing/dnainjector", "/obj/item/ammo_casing", {
	name: "rigged syringe gun spring",
	desc: "A high-power spring that throws DNA injectors.",
	projectile_type: rt.typePath("/obj/item/projectile/bullet/dnainjector"),
	firing_effect_type: null,
});

// special.dm:74
rt.def("/obj/item/ammo_casing/dnainjector/proc/ready_proj", function* ready_proj(f: Frame) {
	let SG: Value = null, S: Value = null, D: Value = null;
	if (f.args[3] === null) {
		f.args[3] = "";
	}
	if (!this.BB) {
		return f.dot;
	}
	if (rt.istype(this.loc, T("/obj/item/weapon/gun/syringe/dna"))) {
		if (!rt.len(f, (SG = this.loc).syringes)) {
			return f.dot;
		}
		S = popleft(SG.syringes);
		D = this.BB;
		yield* S.forceMove(D);
		D.injector = S;
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["target", "user", "quiet", "zone_override"] });
