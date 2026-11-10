// Based on /tg/station's code/modules/hydroponics/seeds.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(9984, "/obj/item/seeds", "/obj/item", {
	plantname: "Plants",
	product: null,
	species: "",
	growing_icon: rt.rsc("icons/obj/hydroponics/growing.dmi"),
	icon_grow: null,
	icon_dead: null,
	icon_harvest: null,
	lifespan: 25,
	endurance: 15,
	maturation: 6,
	production: 6,
	yield: 3,
	potency: 10,
	growthstages: 6,
	rarity: 0,
	mutatelist: null,
	genes: null,
	reagents_add: null,
	weed_rate: 1,
	weed_chance: 5,
	w_class: 1,
	icon: rt.rsc("icons/obj/hydroponics/seeds.dmi"),
	icon_state: "seed",
	resistance_flags: 4,
});

// seeds.dm:27
rt.def("/obj/item/seeds/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.mutatelist = list();

	this.genes = list();

	this.reagents_add = list();
	return f.dot;
});

// seeds.dm:39
rt.def("/obj/item/seeds/proc/New", function* New(f: Frame) {
	let p: Value = null, reag_id: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	this.pixel_x = rand(-8, 8);
	this.pixel_y = rand(-8, 8);
	if (!this.icon_grow) {
		this.icon_grow = `${this.species}-grow`;
	}
	if (!this.icon_dead) {
		this.icon_dead = `${this.species}-dead`;
	}
	if (!this.icon_harvest && !this.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")) && this.yield != -1) {
		this.icon_harvest = `${this.species}-harvest`;
	}
	if (f.args[1]) return f.dot;
	this.genes += (yield* new_(T("/datum/plant_gene/core/lifespan"), this.lifespan));
	this.genes += (yield* new_(T("/datum/plant_gene/core/endurance"), this.endurance));
	this.genes += (yield* new_(T("/datum/plant_gene/core/weed_rate"), this.weed_rate));
	this.genes += (yield* new_(T("/datum/plant_gene/core/weed_chance"), this.weed_chance));
	if (this.yield != -1) {
		this.genes += (yield* new_(T("/datum/plant_gene/core/yield"), this.yield));
		this.genes += (yield* new_(T("/datum/plant_gene/core/production"), this.production));
	}
	if (this.potency != -1) {
		this.genes += (yield* new_(T("/datum/plant_gene/core/potency"), this.potency));
	}
	for (p of each(this.genes)) {
		if (ispath(p)) {
			this.genes -= p;
			this.genes += (yield* new_(p));
		}
	}
	for (reag_id of each(this.reagents_add)) {
		this.genes += (yield* new_(T("/datum/plant_gene/reagent"), reag_id, rt.index(this.reagents_add, reag_id)));
	}
	return f.dot;
}, true, { args: ["loc", "nogenes"] });

// seeds.dm:72
rt.def("/obj/item/seeds/proc/Copy", function* Copy(f: Frame) {
	let S: Value = null, _g: Value = null, G: Value = null;
	(S = (yield* new_(this.type, null, 1))).lifespan = this.lifespan;
	S.endurance = this.endurance;
	S.maturation = this.maturation;
	S.production = this.production;
	S.yield = this.yield;
	S.potency = this.potency;
	S.weed_rate = this.weed_rate;
	S.weed_chance = this.weed_chance;
	S.genes = list();
	for (_g of each(this.genes)) {
		G = _g;
		S.genes += (yield* G.Copy());
	}
	S.reagents_add = (yield* this.reagents_add.Copy());
	return S;
}, true);

// seeds.dm:90
rt.def("/obj/item/seeds/proc/get_gene", function get_gene(f: Frame, typepath: Value) {
	return rt.locateIn(f, typepath, this.genes);
});

// seeds.dm:93
rt.def("/obj/item/seeds/proc/reagents_from_genes", function reagents_from_genes(f: Frame) {
	let R: Value = null;
	this.reagents_add = list();
	for (R of each(this.genes, T("/datum/plant_gene/reagent"))) {
		rt.setAt(this.reagents_add, R.reagent_id, R.rate);
	}
	return f.dot;
});

// seeds.dm:98
rt.def("/obj/item/seeds/proc/mutate", function* mutate(f: Frame, lifemut: Value, endmut: Value, productmut: Value, yieldmut: Value, potmut: Value, wrmut: Value, wcmut: Value, traitmut: Value) {
	lifemut ??= 2;
	endmut ??= 5;
	productmut ??= 1;
	yieldmut ??= 2;
	potmut ??= 25;
	wrmut ??= 2;
	wcmut ??= 5;
	traitmut ??= 0;
	this.adjust_lifespan(rand(-lifemut, lifemut));
	this.adjust_endurance(rand(-endmut, endmut));
	this.adjust_production(rand(-productmut, productmut));
	this.adjust_yield(rand(-yieldmut, yieldmut));
	this.adjust_potency(rand(-potmut, potmut));
	this.adjust_weed_rate(rand(-wrmut, wrmut));
	this.adjust_weed_chance(rand(-wcmut, wcmut));
	if (!prob(traitmut)) return f.dot;
	yield* this.add_random_traits(1, 1);
	return f.dot;
}, true);

// seeds.dm:111
rt.def("/obj/item/seeds/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	let rating: Value = null, H: Value = null;
	if (rt.istype(Proj, T("/obj/item/projectile/energy/florayield"))) {
		rating = 1;
		if (rt.istype(this.loc, T("/obj/machinery/hydroponics"))) {
			rating = (H = this.loc).rating;
		}
		if (this.yield == 0) {
			this.adjust_yield(1 * rating);
		} else if (prob(1 / (this.yield * this.yield) * 100)) {
			this.adjust_yield(1 * rating);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// seeds.dm:127
rt.def("/obj/item/seeds/proc/getYield", function getYield(f: Frame) {
	let return_yield: Value = this.yield;
	let parent: Value = this.loc;
	if (rt.istype(this.loc, T("/obj/machinery/hydroponics"))) {
		if (parent.yieldmod == 0) {
			return_yield = min(return_yield, 1);
		} else {
			return_yield *= parent.yieldmod;
		}
	}
	return return_yield;
});

// seeds.dm:140
rt.def("/obj/item/seeds/proc/harvest", function* harvest(f: Frame, user: Value) {
	let product_name: Value = null, t_prod: Value = null;
	user ??= f.usr;
	let parent: Value = this.loc;
	let t_amount: Value = 0;
	let result: Value = list();
	let output_loc: Value = parent.Adjacent(user) ? user.loc : parent.loc;
	while (t_amount < this.getYield()) {
		t_prod = (yield* new_(this.product, output_loc, this));
		result.Add(t_prod);
		if (!t_prod) {
			return f.dot;
		}
		t_amount++;
		product_name = t_prod.name;
	}
	if (this.getYield() >= 1) {
	}
	yield* parent.update_tray();
	return result;
}, true);

// seeds.dm:160
rt.def("/obj/item/seeds/proc/prepare_result", function* prepare_result(f: Frame, _T: Value) {
	let reagent_id: Value = null;
	if (!_T.reagents) return f.dot;
	for (reagent_id of each(this.reagents_add)) {
		if (reagent_id == "blood") {
			yield* _T.reagents.add_reagent(reagent_id, 1 + round(this.potency * rt.index(this.reagents_add, reagent_id), 1), rt.alist(f, ["blood_type", "O-"]));
			continue;
		}
		yield* _T.reagents.add_reagent(reagent_id, 1 + round(this.potency * rt.index(this.reagents_add, reagent_id), 1));
	}
	return 1;
}, true);

// seeds.dm:172
rt.def("/obj/item/seeds/proc/adjust_yield", function adjust_yield(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.yield == -1) return f.dot;
	this.yield = max(0, min(this.yield + adjustamt, 10));
	if (this.yield <= 0 && this.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
		this.yield = 1;
	}
	if (!(C = this.get_gene(T("/datum/plant_gene/core/yield")))) return f.dot;
	rt.setFv(f, "value", C, this.yield);
	return f.dot;
});

// seeds.dm:182
rt.def("/obj/item/seeds/proc/adjust_lifespan", function adjust_lifespan(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.lifespan = max(10, min(this.lifespan + adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/lifespan")))) return f.dot;
	rt.setFv(f, "value", C, this.lifespan);
	return f.dot;
});

// seeds.dm:188
rt.def("/obj/item/seeds/proc/adjust_endurance", function adjust_endurance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.endurance = max(10, min(this.endurance + adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/endurance")))) return f.dot;
	rt.setFv(f, "value", C, this.endurance);
	return f.dot;
});

// seeds.dm:194
rt.def("/obj/item/seeds/proc/adjust_production", function adjust_production(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.yield == -1) return f.dot;
	this.production = max(1, min(this.production + adjustamt, 10));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/production")))) return f.dot;
	rt.setFv(f, "value", C, this.production);
	return f.dot;
});

// seeds.dm:201
rt.def("/obj/item/seeds/proc/adjust_potency", function adjust_potency(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.potency == -1) return f.dot;
	this.potency = max(0, min(this.potency + adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/potency")))) return f.dot;
	rt.setFv(f, "value", C, this.potency);
	return f.dot;
});

// seeds.dm:208
rt.def("/obj/item/seeds/proc/adjust_weed_rate", function adjust_weed_rate(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.weed_rate = max(0, min(this.weed_rate + adjustamt, 10));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/weed_rate")))) return f.dot;
	rt.setFv(f, "value", C, this.weed_rate);
	return f.dot;
});

// seeds.dm:214
rt.def("/obj/item/seeds/proc/adjust_weed_chance", function adjust_weed_chance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.weed_chance = max(0, min(this.weed_chance + adjustamt, 67));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/weed_chance")))) return f.dot;
	rt.setFv(f, "value", C, this.weed_chance);
	return f.dot;
});

// seeds.dm:222
rt.def("/obj/item/seeds/proc/set_yield", function set_yield(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.yield == -1) return f.dot;
	this.yield = max(0, min(adjustamt, 10));
	if (this.yield <= 0 && this.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
		this.yield = 1;
	}
	if (!(C = this.get_gene(T("/datum/plant_gene/core/yield")))) return f.dot;
	rt.setFv(f, "value", C, this.yield);
	return f.dot;
});

// seeds.dm:232
rt.def("/obj/item/seeds/proc/set_lifespan", function set_lifespan(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.lifespan = max(10, min(adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/lifespan")))) return f.dot;
	rt.setFv(f, "value", C, this.lifespan);
	return f.dot;
});

// seeds.dm:238
rt.def("/obj/item/seeds/proc/set_endurance", function set_endurance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.endurance = max(10, min(adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/endurance")))) return f.dot;
	rt.setFv(f, "value", C, this.endurance);
	return f.dot;
});

// seeds.dm:244
rt.def("/obj/item/seeds/proc/set_production", function set_production(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.yield == -1) return f.dot;
	this.production = max(1, min(adjustamt, 10));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/production")))) return f.dot;
	rt.setFv(f, "value", C, this.production);
	return f.dot;
});

// seeds.dm:251
rt.def("/obj/item/seeds/proc/set_potency", function set_potency(f: Frame, adjustamt: Value) {
	let C: Value = null;
	if (this.potency == -1) return f.dot;
	this.potency = max(0, min(adjustamt, 100));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/potency")))) return f.dot;
	rt.setFv(f, "value", C, this.potency);
	return f.dot;
});

// seeds.dm:258
rt.def("/obj/item/seeds/proc/set_weed_rate", function set_weed_rate(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.weed_rate = max(0, min(adjustamt, 10));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/weed_rate")))) return f.dot;
	rt.setFv(f, "value", C, this.weed_rate);
	return f.dot;
});

// seeds.dm:264
rt.def("/obj/item/seeds/proc/set_weed_chance", function set_weed_chance(f: Frame, adjustamt: Value) {
	let C: Value = null;
	this.weed_chance = max(0, min(adjustamt, 67));
	if (!(C = this.get_gene(T("/datum/plant_gene/core/weed_chance")))) return f.dot;
	rt.setFv(f, "value", C, this.weed_chance);
	return f.dot;
});

// seeds.dm:271
rt.def("/obj/item/seeds/proc/get_analyzer_text", function get_analyzer_text(f: Frame) {
	let traits: Value = null;
	let text: Value = "";
	if (!this.get_gene(T("/datum/plant_gene/trait/plant_type/weed_hardy")) && !this.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism")) && !this.get_gene(T("/datum/plant_gene/trait/plant_type/alien_properties"))) {
		text += "- Plant type: Normal plant\n";
	}
	if (this.get_gene(T("/datum/plant_gene/trait/plant_type/weed_hardy"))) {
		text += "- Plant type: Weed. Can grow in nutrient-poor soil.\n";
	}
	if (this.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
		text += "- Plant type: Mushroom. Can grow in dry soil.\n";
	}
	if (this.get_gene(T("/datum/plant_gene/trait/plant_type/alien_properties"))) {
		text += "- Plant type: <span class='warning'>UNKNOWN</span> \n";
	}
	if (this.potency != -1) {
		text += `- Potency: ${this.potency}\n`;
	}
	if (this.yield != -1) {
		text += `- Yield: ${this.yield}\n`;
	}
	text += `- Maturation speed: ${this.maturation}\n`;
	if (this.yield != -1) {
		text += `- Production speed: ${this.production}\n`;
	}
	text += `- Endurance: ${this.endurance}\n`;
	text += `- Lifespan: ${this.lifespan}\n`;
	text += `- Weed Growth Rate: ${this.weed_rate}\n`;
	text += `- Weed Vulnerability: ${this.weed_chance}\n`;
	if (this.rarity) {
		text += `- Species Discovery Value: ${this.rarity}\n`;
	}
	let all_traits: Value = "";
	for (traits of each(this.genes, T("/datum/plant_gene/trait"))) {
		if (rt.istype(traits, T("/datum/plant_gene/trait/plant_type"))) {
			continue;
		}
		all_traits += ` ${traits.get_name()}`;
	}
	text += `- Plant Traits:${all_traits}\n`;
	return (text += "*---------*");
});

// seeds.dm:308
rt.def("/obj/item/seeds/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let text: Value = null;
	if (rt.istype(O, T("/obj/item/device/plant_analyzer"))) {
		to_chat(user, fmt("<span class='info'>*---------*\n This is ＇<span class='name'>！</span>.</span>", [this]));
		if (text = this.get_analyzer_text()) {
			to_chat(user, `<span class='notice'>${text}</span>`);
		}
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// seeds.dm:349
rt.def("/obj/item/seeds/proc/randomize_stats", function randomize_stats(f: Frame) {
	this.set_lifespan(rand(25, 60));
	this.set_endurance(rand(15, 35));
	this.set_production(rand(2, 10));
	this.set_yield(rand(1, 10));
	this.set_potency(rand(10, 35));
	this.set_weed_rate(rand(1, 10));
	this.set_weed_chance(rand(5, 100));
	this.maturation = rand(6, 12);
	return f.dot;
});

// seeds.dm:359
rt.def("/obj/item/seeds/proc/add_random_reagents", function* add_random_reagents(f: Frame, lower: Value, upper: Value) {
	let i: Value = null, random_amount: Value = null, R: Value = null;
	let $e: any;
	lower ??= 0;
	upper ??= 2;
	let amount_random_reagents: Value = rand(lower, upper);
	rt.forRange(f, 0, 1, amount_random_reagents, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		random_amount = rand(4, 15) * 0.01;
		if ((R = (yield* new_(T("/datum/plant_gene/reagent"), get_random_reagent_id(), random_amount))).can_add(this)) {
			this.genes += R;
		} else {
			yield* qdel(R);
		}
	}
	rt.endFor(f, 0);
	this.reagents_from_genes();
	return f.dot;
}, true);

// seeds.dm:370
rt.def("/obj/item/seeds/proc/add_random_traits", function* add_random_traits(f: Frame, lower: Value, upper: Value) {
	let i: Value = null, random_trait: Value = null, _T: Value = null;
	let $e: any;
	lower ??= 0;
	upper ??= 2;
	let amount_random_traits: Value = rand(lower, upper);
	rt.forRange(f, 0, 1, amount_random_traits, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		random_trait = pick(typesof(T("/datum/plant_gene/trait")) - T("/datum/plant_gene/trait") - typesof(T("/datum/plant_gene/trait/plant_type")));
		if ((_T = (yield* new_(random_trait))).can_add(this)) {
			this.genes += _T;
		} else {
			yield* qdel(_T);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// seeds.dm:380
rt.def("/obj/item/seeds/proc/add_random_plant_type", function* add_random_plant_type(f: Frame, normal_plant_chance: Value) {
	let _P: Value = null;
	normal_plant_chance ??= 75;
	if (!prob(normal_plant_chance)) return f.dot;
	let random_plant_type: Value = pick(typesof(T("/datum/plant_gene/trait/plant_type")) - T("/datum/plant_gene/trait/plant_type"));
	if ((_P = (yield* new_(random_plant_type))).can_add(this)) {
		this.genes += _P;
	} else {
		yield* qdel(_P);
	}
	return f.dot;
}, true);
