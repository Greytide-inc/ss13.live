// Based on /tg/station's code/modules/hydroponics/gene_modder.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10921, "/obj/machinery/plantgenes", "/obj/machinery", {
	seed: null,
	disk: null,
	core_genes: null,
	reagent_genes: null,
	trait_genes: null,
	target: null,
	operation: "",
	max_potency: 50,
	max_yield: 2,
	min_production: 12,
	max_endurance: 10,
	min_wchance: 67,
	min_wrate: 10,
	anchored: 1,
	name: "plant DNA manipulator",
	desc: "An advanced device designed to manipulate plant genetic makeup.",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "dnamod",
	density: 1,
});

// gene_modder.dm:12
rt.def("/obj/machinery/plantgenes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.core_genes = list();

	this.reagent_genes = list();

	this.trait_genes = list();
	return f.dot;
});

// gene_modder.dm:26
rt.def("/obj/machinery/plantgenes/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/plantgenes"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6756, "/obj/item/weapon/circuitboard/machine/plantgenes", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Plant DNA Manipulator (Machine Board)",
	build_path: rt.typePath("/obj/machinery/plantgenes"),
	origin_tech: "programming=3;biotech=3",
});

// gene_modder.dm:34
rt.def("/obj/item/weapon/circuitboard/machine/plantgenes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/micro_laser"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/weapon/stock_parts/scanning_module"), 1]);
	return f.dot;
});

// gene_modder.dm:41
rt.def("/obj/machinery/plantgenes/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null, SM: Value = null, ML: Value = null, wratemod: Value = null, vaultcheck: Value = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		if (M.rating > 3) {
			this.max_potency = 95;
		} else {
			this.max_potency = rt.initial(f, this, "max_potency") + M.rating ** 3;
		}
		this.max_yield = rt.initial(f, this, "max_yield") + M.rating * 2;
	}
	for (SM of each(this.component_parts, T("/obj/item/weapon/stock_parts/scanning_module"))) {
		if (SM.rating > 3) {
			this.min_production = 1;
		} else {
			this.min_production = 12 - SM.rating * 3;
		}
		this.max_endurance = rt.initial(f, this, "max_endurance") + SM.rating * 25;
	}
	for (ML of each(this.component_parts, T("/obj/item/weapon/stock_parts/micro_laser"))) {
		wratemod = ML.rating * 2.5;
		this.min_wrate = Floor(10 - wratemod, 1);
		this.min_wchance = 67 - ML.rating * 16;
	}
	for (vaultcheck of each(this.component_parts, T("/obj/item/weapon/circuitboard/machine/plantgenes"))) {
		if (rt.istype(vaultcheck, T("/obj/item/weapon/circuitboard/machine/plantgenes/vault"))) {
			this.max_potency = 100;
			this.max_yield = 10;
			this.min_production = 1;
			this.max_endurance = 100;
			this.min_wchance = 0;
			this.min_wrate = 0;
		}
	}
	return f.dot;
});

// gene_modder.dm:71
rt.def("/obj/machinery/plantgenes/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 3)) {
		this.icon_state = "dnamod-off";
	} else {
		this.icon_state = "dnamod";
	}
	if (this.seed) {
		this.add_overlay("dnamod-dna");
	}
	if (!this.panel_open) return f.dot;
	this.add_overlay("dnamod-open");
	return f.dot;
});

// gene_modder.dm:83
rt.def("/obj/machinery/plantgenes/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "dnamod", "dnamod", I)) {
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/seeds"))) {
		if (this.seed) {
			to_chat(user, "<span class='warning'>A sample is already loaded into the machine!</span>");
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.insert_seed(I);
			to_chat(user, `<span class='notice'>You add ${I} to the machine.</span>`);
			yield* this.interact(user);
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/disk/plantgene"))) {
		if (this.disk) {
			to_chat(user, "<span class='warning'>A data disk is already loaded into the machine!</span>");
		} else {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.disk = I;
			this.disk.loc = this;
			to_chat(user, `<span class='notice'>You add ${I} to the machine.</span>`);
			yield* this.interact(user);
		}
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// gene_modder.dm:118
rt.def("/obj/machinery/plantgenes/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// gene_modder.dm:123
rt.def("/obj/machinery/plantgenes/proc/interact", function* interact(f: Frame, user: Value) {
	let gene: Value = null, can_insert: Value = null, can_extract: Value = null, a: Value = null, G: Value = null;
	let $e: any;
	yield* user.set_machine(this);
	if (!user) {
		return f.dot;
	}
	let popup: Value = (yield* new_(T("/datum/browser"), user, "plantdna", "Plant DNA Manipulator", 450, 600));
	if (!(get_dist(this, user) <= 1 || rt.istype(user, T("/mob/living/silicon")))) {
		yield* popup.close();
		return f.dot;
	}
	let dat: Value = "";
	if (this.operation) {
		if (!this.seed || !this.target && this.operation != "insert") {
			this.operation = "";
			this.target = null;
			yield* this.interact(user);
			return f.dot;
		}
		if ((this.operation == "replace" || this.operation == "insert") && (!this.disk || !this.disk.gene)) {
			this.operation = "";
			this.target = null;
			yield* this.interact(user);
			return f.dot;
		}
		dat += "<div class='line'><h3>Confirm Operation</h3></div>";
		dat += `<div class='statusDisplay'>Are you sure you want to ${this.operation} `;
		if (this.operation === "remove") {
			dat += fmt("<span class='highlight'>＀</span> gene from ％<span class='highlight'>！</span>?<br>", [this.target.get_name(), this.seed]);
		} else if (this.operation === "extract") {
			dat += fmt("<span class='highlight'>＀</span> gene from ％<span class='highlight'>！</span>?<br>", [this.target.get_name(), this.seed]);
			dat += "<span class='bad'>The sample will be destroyed in process!</span>";
			if (rt.istype(this.target, T("/datum/plant_gene/core"))) {
				gene = this.target;
				if (rt.istype(this.target, T("/datum/plant_gene/core/potency"))) {
					if (rt.fv(f, "value", gene) > this.max_potency) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.max_potency}</span> potency. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.max_potency}</span> potency on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/lifespan"))) {
					if (rt.fv(f, "value", gene) > this.max_endurance) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.max_endurance}</span> lifespan. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.max_endurance}</span> Lifespan on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/endurance"))) {
					if (rt.fv(f, "value", gene) > this.max_endurance) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.max_endurance}</span> endurance. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.max_endurance}</span> endurance on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/yield"))) {
					if (rt.fv(f, "value", gene) > this.max_yield) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.max_yield}</span> yield. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.max_yield}</span> yield on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/production"))) {
					if (rt.fv(f, "value", gene) < this.min_production) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.min_production}</span> production. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.min_production}</span> production on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/weed_rate"))) {
					if (rt.fv(f, "value", gene) < this.min_wrate) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.min_wrate}</span> weed rate. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.min_wrate}</span> weed rate on extraction.`;
					}
				} else if (rt.istype(this.target, T("/datum/plant_gene/core/weed_chance"))) {
					if (rt.fv(f, "value", gene) < this.min_wchance) {
						dat += `<br><br>This device's extraction capabilities are currently limited to <span class='highlight'>${this.min_wchance}</span> weed chance. `;
						dat += `Target gene will be degraded to <span class='highlight'>${this.min_wchance}</span> weed chance on extraction.`;
					}
				}
			}
		} else if (this.operation === "replace") {
			dat += `<span class='highlight'>${this.target.get_name()}</span> gene with <span class='highlight'>${this.disk.gene.get_name()}</span>?<br>`;
		} else if (this.operation === "insert") {
			dat += fmt("<span class='highlight'>＀</span> gene into ％<span class='highlight'>！</span>?<br>", [this.disk.gene.get_name(), this.seed]);
		}
		dat += fmt("</div><div class='line'><a href='?src=＃;gene=＃;op=＀'>Confirm</a> ", [this, this.target, this.operation]);
		dat += fmt("<a href='?src=＃;abort=1'>Abort</a></div>", [this]);
		popup.set_content(dat);
		yield* popup.open();
		return f.dot;
	}
	dat += "<div class='statusDisplay'>";
	dat += fmt("<div class='line'><div class='statusLabel'>Plant Sample:</div><div class='statusValue'><a href='?src=＃;eject_seed=1'>", [this]);
	dat += this.seed ? this.seed.name : "None";
	dat += "</a></div></div>";
	dat += fmt("<div class='line'><div class='statusLabel'>Data Disk:</div><div class='statusValue'><a href='?src=＃;eject_disk=1'>", [this]);
	if (!this.disk) {
		dat += "None";
	} else if (!this.disk.gene) {
		dat += "Empty Disk";
	} else {
		dat += this.disk.gene.get_name();
	}
	if (this.disk && this.disk.read_only) {
		dat += " (RO)";
	}
	dat += "</a></div></div>";
	dat += "<br></div>";
	if (this.seed) {
		can_insert = ((this.disk && this.disk.gene) && this.disk.gene.can_add(this.seed));
		can_extract = (this.disk && (!this.disk.read_only ? 1 : 0));
		dat += "<div class='line'><h3>Core Genes</h3></div><div class='statusDisplay'><table>";
		for (a of each(this.core_genes)) {
			if (!(G = a)) {
				continue;
			}
			dat += `<tr><td width='260px'>${G.get_name()}</td><td>`;
			if (can_extract) {
				dat += fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [this, G]);
			}
			if (can_insert && rt.op(f, "IsType", [], [this.disk.gene, G.type])) {
				dat += fmt("<a href='?src=＃;gene=＃;op=replace'>Replace</a>", [this, G]);
			}
			dat += "</td></tr>";
		}
		dat += "</table></div>";
		if (this.seed.yield != -1) {
			dat += "<div class='line'><h3>Content Genes</h3></div><div class='statusDisplay'>";
			if (rt.len(f, this.reagent_genes)) {
				dat += "<table>";
				a = null;
				for (a of each(this.reagent_genes)) {
					dat += `<tr><td width='260px'>${(G = a).get_name()}</td><td>`;
					if (can_extract) {
						dat += fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [this, G]);
					}
					dat += fmt("<a href='?src=＃;gene=＃;op=remove'>Remove</a>", [this, G]);
					dat += "</td></tr>";
				}
				dat += "</table>";
			} else {
				dat += "No content-related genes detected in sample.<br>";
			}
			dat += "</div>";
			if (can_insert && rt.istype(this.disk.gene, T("/datum/plant_gene/reagent"))) {
				dat += fmt("<a href='?src=＃;op=insert'>Insert: ＀</a>", [this, this.disk.gene.get_name()]);
			}
			dat += "<div class='line'><h3>Trait Genes</h3></div><div class='statusDisplay'>";
			if (rt.len(f, this.trait_genes)) {
				dat += "<table>";
				a = null;
				for (a of each(this.trait_genes)) {
					dat += `<tr><td width='260px'>${(G = a).get_name()}</td><td>`;
					if (can_extract) {
						dat += fmt("<a href='?src=＃;gene=＃;op=extract'>Extract</a>", [this, G]);
					}
					dat += fmt("<a href='?src=＃;gene=＃;op=remove'>Remove</a>", [this, G]);
					dat += "</td></tr>";
				}
				dat += "</table>";
			} else {
				dat += "No trait-related genes detected in sample.<br>";
			}
			if (can_insert && rt.istype(this.disk.gene, T("/datum/plant_gene/trait"))) {
				dat += fmt("<a href='?src=＃;op=insert'>Insert: ＀</a>", [this, this.disk.gene.get_name()]);
			}
			dat += "</div>";
		}
	} else {
		dat += "<br>No sample found.<br><span class='highlight'>Please, insert a plant sample to use this device.</span>";
	}
	popup.set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// gene_modder.dm:272
rt.def("/obj/machinery/plantgenes/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let I: Value = null, G: Value = null, gene: Value = null, C: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "eject_seed") && !this.operation) {
		if (this.seed) {
			this.seed.loc = this.loc;
			yield* this.seed.verb_pickup();
			this.seed = null;
			this.update_genes();
			yield* this.update_icon();
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/seeds"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			this.insert_seed(I);
			to_chat(f.usr, `<span class='notice'>You add ${I} to the machine.</span>`);
		}
		yield* this.update_icon();
	} else if (rt.at(href_list, "eject_disk") && !this.operation) {
		if (this.disk) {
			this.disk.loc = this.loc;
			yield* this.disk.verb_pickup();
			this.disk = null;
			this.update_genes();
		} else if (rt.istype((I = f.usr.get_active_held_item()), T("/obj/item/weapon/disk/plantgene"))) {
			if (!(yield* f.usr.drop_item())) {
				return f.dot;
			}
			this.disk = I;
			this.disk.loc = this;
			to_chat(f.usr, `<span class='notice'>You add ${I} to the machine.</span>`);
		}
	} else if (rt.at(href_list, "op") == "insert" && this.disk && this.disk.gene && this.seed) {
		if (!this.operation) {
			this.operation = "insert";
		} else {
			if (!rt.istype(this.disk.gene, T("/datum/plant_gene/core")) && this.disk.gene.can_add(this.seed)) {
				this.seed.genes += (yield* this.disk.gene.Copy());
				if (rt.istype(this.disk.gene, T("/datum/plant_gene/reagent"))) {
					this.seed.reagents_from_genes();
				}
			}
			this.update_genes();
			this.repaint_seed();
			this.operation = "";
			this.target = null;
		}
	} else if (rt.at(href_list, "gene") && this.seed) {
		if (!(G = this.seed.get_gene(rt.at(href_list, "gene"))) || !rt.at(href_list, "op") || !rt.isIn(f, rt.at(href_list, "op"), list("remove", "extract", "replace"))) {
			yield* this.interact(f.usr);
			return f.dot;
		}
		if (!this.operation || this.target != G) {
			this.target = G;
			this.operation = rt.at(href_list, "op");
		} else if (this.operation == rt.at(href_list, "op") && this.target == G) {
			const item = rt.at(href_list, "op");
			if (item === "remove") {
				if (!rt.istype(G, T("/datum/plant_gene/core"))) {
					this.seed.genes -= G;
					if (rt.istype(G, T("/datum/plant_gene/reagent"))) {
						this.seed.reagents_from_genes();
					}
				}
				this.repaint_seed();
			} else if (item === "extract") {
				if (this.disk && !this.disk.read_only) {
					this.disk.gene = G;
					if (rt.istype(G, T("/datum/plant_gene/core"))) {
						gene = G;
						if (rt.istype(G, T("/datum/plant_gene/core/potency"))) {
							rt.setFv(f, "value", gene, min(rt.fv(f, "value", gene), this.max_potency));
						} else if (rt.istype(G, T("/datum/plant_gene/core/lifespan"))) {
							rt.setFv(f, "value", gene, min(rt.fv(f, "value", gene), this.max_endurance));
						} else if (rt.istype(G, T("/datum/plant_gene/core/endurance"))) {
							rt.setFv(f, "value", gene, min(rt.fv(f, "value", gene), this.max_endurance));
						} else if (rt.istype(G, T("/datum/plant_gene/core/production"))) {
							rt.setFv(f, "value", gene, max(rt.fv(f, "value", gene), this.min_production));
						} else if (rt.istype(G, T("/datum/plant_gene/core/yield"))) {
							rt.setFv(f, "value", gene, min(rt.fv(f, "value", gene), this.max_yield));
						} else if (rt.istype(G, T("/datum/plant_gene/core/weed_rate"))) {
							rt.setFv(f, "value", gene, max(rt.fv(f, "value", gene), this.min_wrate));
						} else if (rt.istype(G, T("/datum/plant_gene/core/weed_chance"))) {
							rt.setFv(f, "value", gene, max(rt.fv(f, "value", gene), this.min_wchance));
						}
					}
					this.disk.update_name();
					yield* qdel(this.seed);
					this.seed = null;
					yield* this.update_icon();
				}
			} else if (item === "replace") {
				if (this.disk && this.disk.gene && rt.op(f, "IsType", [], [this.disk.gene, G.type]) && rt.istype(G, T("/datum/plant_gene/core"))) {
					this.seed.genes -= G;
					C = (yield* this.disk.gene.Copy());
					this.seed.genes += C;
					C.apply_stat(this.seed);
					this.repaint_seed();
				}
			} else if (item === "insert") {
				if (this.disk && this.disk.gene && !rt.istype(this.disk.gene, T("/datum/plant_gene/core")) && this.disk.gene.can_add(this.seed)) {
					this.seed.genes += (yield* this.disk.gene.Copy());
					if (rt.istype(this.disk.gene, T("/datum/plant_gene/reagent"))) {
						this.seed.reagents_from_genes();
					}
					this.disk.gene.apply_vars(this.seed);
					this.repaint_seed();
				}
			}
			this.update_genes();
			this.operation = "";
			this.target = null;
		}
	} else if (rt.at(href_list, "abort")) {
		this.operation = "";
		this.target = null;
	}
	yield* this.interact(f.usr);
	return f.dot;
}, true);

// gene_modder.dm:385
rt.def("/obj/machinery/plantgenes/proc/insert_seed", function insert_seed(f: Frame, S: Value) {
	if (!rt.istype(S, T("/obj/item/seeds")) || this.seed) {
		return f.dot;
	}
	S.loc = this;
	this.seed = S;
	this.update_genes();
	this.update_icon();
	return f.dot;
});

// gene_modder.dm:393
rt.def("/obj/machinery/plantgenes/proc/update_genes", function update_genes(f: Frame) {
	let a: Value = null, G: Value = null;
	this.core_genes = list();
	this.reagent_genes = list();
	this.trait_genes = list();
	if (!this.seed) return f.dot;
	let gene_paths: Value = list(T("/datum/plant_gene/core/potency"), T("/datum/plant_gene/core/yield"), T("/datum/plant_gene/core/production"), T("/datum/plant_gene/core/endurance"), T("/datum/plant_gene/core/lifespan"), T("/datum/plant_gene/core/weed_rate"), T("/datum/plant_gene/core/weed_chance"));
	for (a of each(gene_paths)) {
		this.core_genes += this.seed.get_gene(a);
	}
	for (G of each(this.seed.genes, T("/datum/plant_gene/reagent"))) {
		this.reagent_genes += G;
	}
	G = null;
	for (G of each(this.seed.genes, T("/datum/plant_gene/trait"))) {
		this.trait_genes += G;
	}
	return f.dot;
});

// gene_modder.dm:417
rt.def("/obj/machinery/plantgenes/proc/repaint_seed", function repaint_seed(f: Frame) {
	if (!this.seed) {
		return f.dot;
	}
	if (copytext(this.seed.name, 1, 13) == "experimental") {
		return f.dot;
	}
	this.seed.name = "experimental " + this.seed.name;
	this.seed.icon_state = "seed-x";
	return f.dot;
});

rt.type(10922, "/obj/machinery/plantgenes/seedvault", "/obj/machinery/plantgenes", {});

// gene_modder.dm:428
rt.def("/obj/machinery/plantgenes/seedvault/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/plantgenes/vault"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6757, "/obj/item/weapon/circuitboard/machine/plantgenes/vault", "/obj/item/weapon/circuitboard/machine/plantgenes", {
	def_components: null,
	name: "alien board (Plant DNA Manipulator)",
	icon_state: "abductor_mod",
	origin_tech: "programming=5;biotech=5",
});

// gene_modder.dm:437
rt.def("/obj/item/weapon/circuitboard/machine/plantgenes/vault/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.def_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/manipulator"), T("/obj/item/weapon/stock_parts/manipulator/femto"), T("/obj/item/weapon/stock_parts/micro_laser"), T("/obj/item/weapon/stock_parts/micro_laser/quadultra"), T("/obj/item/weapon/stock_parts/scanning_module"), T("/obj/item/weapon/stock_parts/scanning_module/triphasic")]);
	return f.dot;
});

rt.type(6675, "/obj/item/weapon/disk/plantgene", "/obj/item/weapon/disk", {
	gene: null,
	read_only: 0,
	name: "plant data disk",
	desc: "A disk for storing plant genetic data.",
	icon_state: "datadisk_hydro",
	materials: null,
	unique_rename: 1,
});

// gene_modder.dm:450
rt.def("/obj/item/weapon/disk/plantgene/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.materials = rt.alist(f, ["$metal", 30, "$glass", 10]);
	return f.dot;
});

// gene_modder.dm:456
rt.def("/obj/item/weapon/disk/plantgene/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.add_overlay("datadisk_gene");
	this.pixel_x = rand(-5, 5);
	this.pixel_y = rand(-5, 5);
	return f.dot;
}, true);

// gene_modder.dm:463
rt.def("/obj/item/weapon/disk/plantgene/proc/update_name", function update_name(f: Frame) {
	if (this.gene) {
		this.name = `${this.gene.get_name()} (Plant Data Disk)`;
	} else {
		this.name = "plant data disk";
	}
	return f.dot;
});

// gene_modder.dm:468
rt.def("/obj/item/weapon/disk/plantgene/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $1: any;
	this.read_only = (!this.read_only ? 1 : 0);
	let $0: any = user;
	if (this.read_only) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	to_chat($0, `<span class='notice'>You flip the write-protect tab to ${$1}.</span>`);
	return f.dot;
});

// gene_modder.dm:472
rt.def("/obj/item/weapon/disk/plantgene/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	let $0: any = user;
	to_chat($0, `The write-protect tab is set to ${this.read_only ? "protected" : "unprotected"}.`);
	return f.dot;
}, false);
