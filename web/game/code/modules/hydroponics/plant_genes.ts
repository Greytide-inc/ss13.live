// Based on /tg/station's code/modules/hydroponics/plant_genes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(2711, "/datum/plant_gene", "/datum", {
	name: null,
});

// plant_genes.dm:8
rt.def("/datum/plant_gene/proc/can_add", function can_add(f: Frame, S: Value) {
	return (!rt.istype(S, T("/obj/item/seeds/sample")) ? 1 : 0);
});

// plant_genes.dm:11
rt.def("/datum/plant_gene/proc/Copy", function* Copy(f: Frame) {
	return (yield* new_(this.type));
}, true);

rt.type(2712, "/datum/plant_gene/core", "/datum/plant_gene", {
	value: null,
});

// plant_genes.dm:21
rt.def("/datum/plant_gene/core/proc/get_name", function get_name(f: Frame) {
	return `${this.name} ${rt.sv(f, "value")}`;
});

// plant_genes.dm:27
rt.def("/datum/plant_gene/core/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	parent_proc();
	if (f.args[0] === null) return f.dot;
	rt.setSv(f, "value", f.args[0]);
	return f.dot;
}, false, { args: ["i"] });

// plant_genes.dm:32
rt.def("/datum/plant_gene/core/proc/Copy", function* Copy(f: Frame) {
	let C: Value = null;
	rt.setFv(f, "value", (C = (yield* parent_proc())), rt.sv(f, "value"));
	return C;
}, true);

// plant_genes.dm:37
rt.def("/datum/plant_gene/core/proc/can_add", function can_add(f: Frame, S: Value) {
	if (!parent_proc()) {
		return 0;
	}
	return S.get_gene(this.type);
}, false);

rt.type(2720, "/datum/plant_gene/reagent", "/datum/plant_gene", {
	reagent_id: "nutriment",
	rate: 0.04,
	name: "Nutriment",
});

// plant_genes.dm:104
rt.def("/datum/plant_gene/reagent/proc/get_name", function get_name(f: Frame) {
	return `${this.name} production ${this.rate * 100}%`;
});

// plant_genes.dm:107
rt.def("/datum/plant_gene/reagent/proc/set_reagent", function set_reagent(f: Frame, reag_id: Value) {
	let R: Value = null;
	this.reagent_id = reag_id;
	this.name = "UNKNOWN";
	if (!((R = rt.index(GLOB.chemical_reagents_list, reag_id)) && R.id == this.reagent_id)) return f.dot;
	this.name = R.name;
	return f.dot;
});

// plant_genes.dm:115
rt.def("/datum/plant_gene/reagent/proc/New", function New(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = null;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	parent_proc();
	if (!(f.args[0] && f.args[1])) return f.dot;
	this.set_reagent(f.args[0]);
	this.rate = f.args[1];
	return f.dot;
}, false, { args: ["reag_id", "reag_rate"] });

// plant_genes.dm:121
rt.def("/datum/plant_gene/reagent/proc/Copy", function* Copy(f: Frame) {
	let G: Value = null;
	(G = (yield* parent_proc())).name = this.name;
	G.reagent_id = this.reagent_id;
	G.rate = this.rate;
	return G;
}, true);

// plant_genes.dm:128
rt.def("/datum/plant_gene/reagent/proc/can_add", function can_add(f: Frame, S: Value) {
	let R: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	for (R of each(S.genes, T("/datum/plant_gene/reagent"))) {
		if (R.reagent_id == this.reagent_id) {
			return 0;
		}
	}
	return 1;
}, false);

rt.type(2721, "/datum/plant_gene/trait", "/datum/plant_gene", {
	rate: 0.05,
	examine_line: "",
	origin_tech: null,
	trait_id: null,
});

// plant_genes.dm:144
rt.def("/datum/plant_gene/trait/proc/Copy", function* Copy(f: Frame) {
	let G: Value = null;
	(G = (yield* parent_proc())).rate = this.rate;
	return G;
}, true);

// plant_genes.dm:149
rt.def("/datum/plant_gene/trait/proc/can_add", function can_add(f: Frame, S: Value) {
	let R: Value = null;
	if (!parent_proc()) {
		return 0;
	}
	for (R of each(S.genes, T("/datum/plant_gene/trait"))) {
		if (this.trait_id && R.trait_id == this.trait_id) {
			return 0;
		}
		if (this.type == R.type) {
			return 0;
		}
	}
	return 1;
}, false);

// plant_genes.dm:160
rt.def("/datum/plant_gene/trait/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	let tech: Value = null, t: Value = null;
	if (!this.origin_tech) {
		return f.dot;
	}
	if (G.origin_tech) {
		tech = params2list(G.origin_tech);
		for (t of each(this.origin_tech)) {
			if (rt.isIn(f, t, tech)) {
				rt.setAt(tech, t, max(text2num(rt.index(tech, t)), rt.index(this.origin_tech, t)));
			} else {
				rt.setAt(tech, t, rt.index(this.origin_tech, t));
			}
		}
		G.origin_tech = list2params(tech);
	} else {
		G.origin_tech = list2params(this.origin_tech);
	}
	return f.dot;
});

rt.type(2722, "/datum/plant_gene/trait/squash", "/datum/plant_gene/trait", {
	name: "Liquid Contents",
	examine_line: "<span class='info'>It has a lot of liquid contents inside.</span>",
	origin_tech: null,
});

// plant_genes.dm:198
rt.def("/datum/plant_gene/trait/squash/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.origin_tech = rt.alist(f, ["biotech", 5]);
	return f.dot;
});

rt.type(2723, "/datum/plant_gene/trait/slip", "/datum/plant_gene/trait", {
	name: "Slippery Skin",
	rate: 1.6,
	examine_line: "<span class='info'>It has a very slippery skin.</span>",
});

// plant_genes.dm:208
rt.def("/datum/plant_gene/trait/slip/proc/on_cross", function* on_cross(f: Frame, G: Value, target: Value) {
	let _T: Value = null;
	if (!rt.istype(target, T("/mob/living/carbon"))) return f.dot;
	let seed: Value = G.seed;
	let M: Value = target;
	if (rt.istype(G, T("/obj/item/weapon/reagent_containers/food/snacks/grown")) && ispath(G.trash, T("/obj/item/weapon/grown"))) {
		return f.dot;
	}
	let stun_len: Value = seed.potency * this.rate;
	if (!rt.istype(G, T("/obj/item/weapon/grown/bananapeel")) && (!G.reagents || !G.reagents.has_reagent("lube"))) {
		stun_len /= 3;
	}
	let knockdown: Value = min(stun_len, 140);
	if (!(yield* M.slip(knockdown, G))) return f.dot;
	for (_T of each(seed.genes, T("/datum/plant_gene/trait"))) {
		yield* _T.on_slip(G, M);
	}
	return f.dot;
}, true);

rt.type(2724, "/datum/plant_gene/trait/cell_charge", "/datum/plant_gene/trait", {
	name: "Electrical Activity",
	rate: 0.2,
	origin_tech: null,
});

// plant_genes.dm:232
rt.def("/datum/plant_gene/trait/cell_charge/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.origin_tech = rt.alist(f, ["powerstorage", 5]);
	return f.dot;
});

// plant_genes.dm:235
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_slip", function* on_slip(f: Frame, G: Value, C: Value) {
	let power: Value = null;
	if (!prob((power = G.seed.potency * this.rate))) return f.dot;
	yield* C.electrocute_act(round(power), G, 1, 1);
	return f.dot;
}, true);

// plant_genes.dm:240
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let power: Value = null;
	if (!rt.istype(target, T("/mob/living/carbon"))) return f.dot;
	let C: Value = target;
	if (!prob((power = G.seed.potency * this.rate))) return f.dot;
	yield* C.electrocute_act(round(power), G, 1, 1);
	return f.dot;
}, true);

// plant_genes.dm:247
rt.def("/datum/plant_gene/trait/cell_charge/proc/on_consume", function* on_consume(f: Frame, G: Value, target: Value) {
	let C: Value = null, newcharge: Value = null, O: Value = null;
	if (G.reagents.total_volume) return f.dot;
	let batteries_recharged: Value = 0;
	for (C of each(target.GetAllContents(), T("/obj/item/weapon/stock_parts/cell"))) {
		newcharge = min(G.seed.potency * 0.01 * C.maxcharge, C.maxcharge);
		if (C.charge < newcharge) {
			C.charge = newcharge;
			if (rt.istype(C.loc, T("/obj"))) {
				yield* (O = C.loc).update_icon();
			}
			yield* C.update_icon();
			batteries_recharged = 1;
		}
	}
	if (!batteries_recharged) return f.dot;
	to_chat(target, "<span class='notice'>Your batteries are recharged!</span>");
	return f.dot;
}, true);

rt.type(2725, "/datum/plant_gene/trait/glow", "/datum/plant_gene/trait", {
	glow_color: "#C3E381",
	name: "Bioluminescence",
	rate: 0.03,
	examine_line: "<span class='info'>It emits a soft glow.</span>",
	trait_id: "glow",
});

// plant_genes.dm:273
rt.def("/datum/plant_gene/trait/glow/proc/glow_range", function glow_range(f: Frame, S: Value) {
	return 1.4 + S.potency * this.rate;
});

// plant_genes.dm:276
rt.def("/datum/plant_gene/trait/glow/proc/glow_power", function glow_power(f: Frame, S: Value) {
	return max(S.potency * (this.rate + 0.01), 0.1);
});

// plant_genes.dm:279
rt.def("/datum/plant_gene/trait/glow/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	parent_proc();
	G.set_light(this.glow_range(G.seed), this.glow_power(G.seed), this.glow_color);
	return f.dot;
}, false);

rt.type(2726, "/datum/plant_gene/trait/glow/shadow", "/datum/plant_gene/trait/glow", {
	name: "Shadow Emission",
	rate: 0.04,
	glow_color: "#AAD84B",
});

// plant_genes.dm:290
rt.def("/datum/plant_gene/trait/glow/shadow/proc/glow_power", function glow_power(f: Frame, S: Value) {
	return -max(S.potency * (this.rate * 0.05), 0.075);
});

rt.type(2729, "/datum/plant_gene/trait/teleport", "/datum/plant_gene/trait", {
	name: "Bluespace Activity",
	rate: 0.1,
	origin_tech: null,
});

// plant_genes.dm:307
rt.def("/datum/plant_gene/trait/teleport/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.origin_tech = rt.alist(f, ["bluespace", 5]);
	return f.dot;
});

// plant_genes.dm:310
rt.def("/datum/plant_gene/trait/teleport/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let _T: Value = null;
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	let teleport_radius: Value = max(round(G.seed.potency / 10), 1);
	yield* new_(T("/obj/effect/decal/cleanable/molten_object"), (_T = rt.getStep(f, target, 0)));
	yield* do_teleport(target, _T, teleport_radius);
	return f.dot;
}, true);

// plant_genes.dm:317
rt.def("/datum/plant_gene/trait/teleport/proc/on_slip", function* on_slip(f: Frame, G: Value, C: Value) {
	let teleport_radius: Value = max(round(G.seed.potency / 10), 1);
	let _T: Value = rt.getStep(f, C, 0);
	to_chat(C, "<span class='warning'>You slip through spacetime!</span>");
	yield* do_teleport(C, _T, teleport_radius);
	if (prob(50)) {
		yield* do_teleport(G, _T, teleport_radius);
	} else {
		yield* new_(T("/obj/effect/decal/cleanable/molten_object"), _T);
		yield* qdel(G);
	}
	return f.dot;
}, true);

rt.type(2730, "/datum/plant_gene/trait/noreact", "/datum/plant_gene/trait", {
	name: "Separated Chemicals",
});

// plant_genes.dm:333
rt.def("/datum/plant_gene/trait/noreact/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	parent_proc();
	G.reagents.set_reacting(0);
	return f.dot;
}, false);

// plant_genes.dm:337
rt.def("/datum/plant_gene/trait/noreact/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	G.reagents.set_reacting(1);
	yield* G.reagents.handle_reactions();
	return f.dot;
}, true);

rt.type(2731, "/datum/plant_gene/trait/maxchem", "/datum/plant_gene/trait", {
	name: "Densified Chemicals",
	rate: 2,
});

// plant_genes.dm:347
rt.def("/datum/plant_gene/trait/maxchem/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	parent_proc();
	G.reagents.maximum_volume *= this.rate;
	return f.dot;
}, false);

rt.type(2732, "/datum/plant_gene/trait/repeated_harvest", "/datum/plant_gene/trait", {
	name: "Perennial Growth",
});

// plant_genes.dm:354
rt.def("/datum/plant_gene/trait/repeated_harvest/proc/can_add", function can_add(f: Frame, S: Value) {
	if (!parent_proc()) {
		return 0;
	}
	if (rt.istype(S, T("/obj/item/seeds/replicapod"))) {
		return 0;
	}
	return 1;
}, false);

rt.type(2733, "/datum/plant_gene/trait/battery", "/datum/plant_gene/trait", {
	name: "Capacitive Cell Production",
});

// plant_genes.dm:364
rt.def("/datum/plant_gene/trait/battery/proc/on_attackby", function* on_attackby(f: Frame, G: Value, I: Value, user: Value) {
	let C: Value = null, pocell: Value = null, CG: Value = null;
	if (!rt.istype(I, T("/obj/item/stack/cable_coil"))) return f.dot;
	if (yield* (C = I).use(5)) {
		to_chat(user, `<span class='notice'>You add some cable to ${G} and slide it inside the battery encasing.</span>`);
		(pocell = (yield* new_(T("/obj/item/weapon/stock_parts/cell/potato"), user.loc))).icon_state = G.icon_state;
		pocell.maxcharge = G.seed.potency * 20;
		if (CG = G.seed.get_gene(T("/datum/plant_gene/trait/cell_charge"))) {
			pocell.maxcharge *= CG.rate * 1000;
		}
		pocell.charge = pocell.maxcharge;
		pocell.name = `${G.name} battery`;
		pocell.desc = `A rechargable plant based power cell. This one has a power rating of ${pocell.maxcharge}, and you should not swallow it.`;
		if (G.reagents.has_reagent("plasma", 2)) {
			pocell.rigged = 1;
		}
		yield* qdel(G);
	} else {
		to_chat(user, `<span class='warning'>You need five lengths of cable to make a ${G} battery!</span>`);
	}
	return f.dot;
}, true);

rt.type(2734, "/datum/plant_gene/trait/stinging", "/datum/plant_gene/trait", {
	name: "Hypodermic Prickles",
});

// plant_genes.dm:392
rt.def("/datum/plant_gene/trait/stinging/proc/on_throw_impact", function* on_throw_impact(f: Frame, G: Value, target: Value) {
	let L: Value = null;
	if (!(rt.istype(target, T("/mob/living")) && G.reagents && G.reagents.total_volume)) return f.dot;
	if (!((L = target).reagents && (yield* L.can_inject(null, 0)))) return f.dot;
	let injecting_amount: Value = max(1, G.seed.potency * 0.2);
	let fraction: Value = min(injecting_amount / G.reagents.total_volume, 1);
	yield* G.reagents.reaction(L, INJECT, fraction);
	yield* G.reagents.trans_to(L, injecting_amount);
	to_chat(target, `<span class='danger'>You are pricked by ${G}!</span>`);
	return f.dot;
}, true);

rt.type(2735, "/datum/plant_gene/trait/smoke", "/datum/plant_gene/trait", {
	name: "gaseous decomposition",
});

// plant_genes.dm:405
rt.def("/datum/plant_gene/trait/smoke/proc/on_squash", function* on_squash(f: Frame, G: Value, target: Value) {
	let S: Value = (yield* new_(T("/datum/effect_system/smoke_spread/chem")));
	let splat_location: Value = rt.getStep(f, target, 0);
	let smoke_amount: Value = round(rt.op(f, "Sqrt", [], [G.seed.potency * 0.1]), 1);
	yield* S.attach(splat_location);
	yield* S.set_up(G.reagents, smoke_amount, splat_location, 0);
	yield* S.start();
	yield* G.reagents.clear_reagents();
	return f.dot;
}, true);

rt.type(2736, "/datum/plant_gene/trait/fire_resistance", "/datum/plant_gene/trait", {
	name: "Fire Resistance",
});

// plant_genes.dm:417
rt.def("/datum/plant_gene/trait/fire_resistance/proc/apply_vars", function apply_vars(f: Frame, S: Value) {
	if (rt.bitAnd(S.resistance_flags, FIRE_PROOF)) return f.dot;
	(rt.modField(f, S, "resistance_flags", FIRE_PROOF, rt.bitOr));
	return f.dot;
});

// plant_genes.dm:421
rt.def("/datum/plant_gene/trait/fire_resistance/proc/on_new", function on_new(f: Frame, G: Value, newloc: Value) {
	if (rt.bitAnd(G.resistance_flags, FIRE_PROOF)) return f.dot;
	(rt.modField(f, G, "resistance_flags", FIRE_PROOF, rt.bitOr));
	return f.dot;
});
