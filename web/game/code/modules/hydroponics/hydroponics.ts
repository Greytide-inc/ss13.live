// Based on /tg/station's code/modules/hydroponics/hydroponics.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(10772, "/obj/machinery/hydroponics/constructable", "/obj/machinery/hydroponics", {
	name: "hydroponics tray",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "hydrotray3",
});

// hydroponics.dm:41
rt.def("/obj/machinery/hydroponics/constructable/proc/New", function* New(f: Frame) {
	let B: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/hydroponics"), null))).apply_default_parts(this);
	return f.dot;
}, true);

rt.type(6758, "/obj/item/weapon/circuitboard/machine/hydroponics", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "Hydroponics Tray (Machine Board)",
	build_path: rt.typePath("/obj/machinery/hydroponics/constructable"),
	origin_tech: "programming=1;biotech=2",
});

// hydroponics.dm:49
rt.def("/obj/item/weapon/circuitboard/machine/hydroponics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// hydroponics.dm:56
rt.def("/obj/machinery/hydroponics/constructable/proc/RefreshParts", function RefreshParts(f: Frame) {
	let M: Value = null;
	let tmp_capacity: Value = 0;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		tmp_capacity += M.rating;
	}
	M = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/manipulator"))) {
		this.rating = M.rating;
	}
	this.maxwater = tmp_capacity * 50;
	this.maxnutri = tmp_capacity * 5;
	this.waterlevel = this.maxwater;
	this.nutrilevel = 3;
	return f.dot;
});

rt.type(10770, "/obj/machinery/hydroponics", "/obj/machinery", {
	waterlevel: 100,
	maxwater: 100,
	nutrilevel: 10,
	maxnutri: 10,
	pestlevel: 0,
	weedlevel: 0,
	yieldmod: 1,
	mutmod: 1,
	toxic: 0,
	age: 0,
	dead: 0,
	plant_health: null,
	lastproduce: 0,
	lastcycle: 0,
	cycledelay: 200,
	harvest: 0,
	myseed: null,
	rating: 1,
	unwrenchable: 1,
	recent_bee_visit: 0,
	using_irrigation: 0,
	self_sufficiency_req: 20,
	self_sufficiency_progress: 0,
	self_sustaining: 0,
	anchored: 1,
	name: "hydroponics tray",
	icon: rt.rsc("icons/obj/hydroponics/equipment.dmi"),
	icon_state: "hydrotray",
	density: 1,
	pixel_y: 8,
	unique_rename: 1,
});

// hydroponics.dm:67
rt.def("/obj/machinery/hydroponics/proc/Destroy", function* Destroy(f: Frame) {
	if (this.myseed) {
		yield* qdel(this.myseed);
		this.myseed = null;
	}
	return (yield* parent_proc());
}, true);

// hydroponics.dm:72
rt.def("/obj/machinery/hydroponics/constructable/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "hydrotray3", "hydrotray3", I)) {
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		if (this.using_irrigation) {
			to_chat(user, "<span class='warning'>Disconnect the hoses first!</span>");
		} else if (yield* this.default_deconstruction_crowbar(I, 1)) {
			return f.dot;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// hydroponics.dm:93
rt.def("/obj/machinery/hydroponics/proc/FindConnected", function FindConnected(f: Frame) {
	let a: Value = null, step_dir: Value = null, h: Value = null;
	let connected: Value = list();
	let processing_atoms: Value = list(this);
	while (rt.len(f, processing_atoms)) {
		a = rt.index(processing_atoms, 1);
		step_dir = null;
		for (step_dir of each(GLOB.cardinal)) {
			if ((h = rt.locateIn(f, T("/obj/machinery/hydroponics"), rt.getStep(f, a, step_dir))) && h.using_irrigation && h.density && !rt.isIn(f, h, connected) && !rt.isIn(f, h, processing_atoms)) {
				processing_atoms += h;
			}
		}
		processing_atoms -= a;
		connected += a;
	}
	return connected;
});

// hydroponics.dm:111
rt.def("/obj/machinery/hydroponics/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (!this.myseed) {
		return (yield* parent_proc());
	}
	if (rt.istype(Proj, T("/obj/item/projectile/energy/floramut"))) {
		yield* this.mutate();
	} else {
		if (rt.istype(Proj, T("/obj/item/projectile/energy/florayield"))) {
			return (yield* this.myseed.bullet_act(Proj));
		}
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// hydroponics.dm:123
rt.def("/obj/machinery/hydroponics/proc/process", function* process(f: Frame) {
	let currentTurf: Value = null, lightAmt: Value = null;
	let needs_update: Value = 0;
	if (this.myseed && this.myseed.loc != this) {
		this.myseed.loc = this;
	}
	if (this.self_sustaining) {
		this.adjustNutri(1);
		this.adjustWater(rand(3, 5));
		this.adjustWeeds(-2);
		this.adjustPests(-2);
		this.adjustToxic(-2);
	}
	if (rt.worldTime(f) > this.lastcycle + this.cycledelay) {
		this.lastcycle = rt.worldTime(f);
		if (this.myseed && !this.dead) {
			this.age++;
			if (this.age < this.myseed.maturation) {
				this.lastproduce = this.age;
			}
			needs_update = 1;
			if (prob(50)) {
				this.adjustNutri(-1 / this.rating);
			}
			if (this.nutrilevel <= 0 && !this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/weed_hardy"))) {
				yield* this.adjustHealth(-rand(1, 3));
			}
			if (isturf(this.loc)) {
				currentTurf = this.loc;
				lightAmt = currentTurf.get_lumcount();
				if (this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
					if (lightAmt < 0.2) {
						yield* this.adjustHealth(-1 / this.rating);
					}
				} else if (lightAmt < 0.4) {
					yield* this.adjustHealth(-2 / this.rating);
				}
			}
			this.adjustWater(-rand(1, 6) / this.rating);
			if (this.waterlevel <= 10 && !this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
				yield* this.adjustHealth(-rand(0, 1) / this.rating);
				if (this.waterlevel <= 0) {
					yield* this.adjustHealth(-rand(0, 2) / this.rating);
				}
			} else if (this.waterlevel > 10 && this.nutrilevel > 0) {
				yield* this.adjustHealth(rand(1, 2) / this.rating);
				if (this.myseed && prob(this.myseed.weed_chance)) {
					this.adjustWeeds(this.myseed.weed_rate);
				} else if (prob(5)) {
					this.adjustWeeds(1 / this.rating);
				}
			}
			if (this.toxic >= 40 && this.toxic < 80) {
				yield* this.adjustHealth(-1 / this.rating);
				this.adjustToxic(-rand(1, 10) / this.rating);
			} else if (this.toxic >= 80) {
				yield* this.adjustHealth(-3);
				this.adjustToxic(-rand(1, 10) / this.rating);
			} else if (this.pestlevel >= 5) {
				yield* this.adjustHealth(-1 / this.rating);
			}
			if (this.weedlevel >= 5 && !this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/weed_hardy"))) {
				yield* this.adjustHealth(-1 / this.rating);
			}
			if (this.plant_health <= 0) {
				this.plantdies();
				this.adjustWeeds(1 / this.rating);
			}
			if (this.age > this.myseed.lifespan) {
				yield* this.adjustHealth(-rand(1, 5) / this.rating);
			}
			if (this.age > this.myseed.production && this.age - this.lastproduce > this.myseed.production && !this.harvest && !this.dead) {
				yield* this.nutrimentMutation();
				if (this.myseed && this.myseed.yield != -1) {
					this.harvest = 1;
				} else {
					this.lastproduce = this.age;
				}
			}
			if (prob(5)) {
				this.adjustPests(1 / this.rating);
			}
		} else if (this.waterlevel > 10 && this.nutrilevel > 0 && prob(10)) {
			this.adjustWeeds(1 / this.rating);
		}
		if (this.weedlevel >= 10 && prob(50)) {
			if (this.myseed) {
				if (!this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/weed_hardy")) && !this.myseed.get_gene(T("/datum/plant_gene/trait/plant_type/fungal_metabolism"))) {
					yield* this.weedinvasion();
				}
			} else {
				yield* this.weedinvasion();
			}
			needs_update = 1;
		}
		if (needs_update) {
			yield* this.update_icon();
		}
	}
	return f.dot;
}, true, { waitfor: false });

// hydroponics.dm:238
rt.def("/obj/machinery/hydroponics/proc/nutrimentMutation", function* nutrimentMutation(f: Frame) {
	if (this.mutmod == 0) {
		return f.dot;
	}
	if (this.mutmod == 1) {
		if (prob(80)) {
			yield* this.mutate();
		} else if (prob(75)) {
			yield* this.hardmutate();
		}
		return f.dot;
	}
	if (this.mutmod == 2) {
		if (prob(50)) {
			yield* this.mutate();
		} else if (prob(50)) {
			yield* this.hardmutate();
		} else if (prob(50)) {
			yield* this.mutatespecie();
		}
		return f.dot;
	}
	return f.dot;
}, true);

// hydroponics.dm:258
rt.def("/obj/machinery/hydroponics/proc/update_icon", function update_icon(f: Frame) {
	let G: Value = null;
	this.cut_overlays();
	if (this.self_sustaining) {
		if (rt.istype(this, T("/obj/machinery/hydroponics/soil"))) {
			this.add_atom_colour("#ffaf00", FIXED_COLOUR_PRIORITY);
		} else {
			this.overlays += mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "gaia_blessing");
		}
		this.set_light(3);
	}
	this.update_icon_hoses();
	if (this.myseed) {
		this.update_icon_plant();
		this.update_icon_lights();
	}
	if (!this.self_sustaining) {
		if (this.myseed && this.myseed.get_gene(T("/datum/plant_gene/trait/glow"))) {
			this.set_light((G = this.myseed.get_gene(T("/datum/plant_gene/trait/glow"))).glow_range(this.myseed), G.glow_power(this.myseed), G.glow_color);
		} else {
			this.set_light(0);
		}
	}
	return f.dot;
});

// hydroponics.dm:284
rt.def("/obj/machinery/hydroponics/proc/update_icon_hoses", function update_icon_hoses(f: Frame) {
	let Dir: Value = null, t: Value = null;
	let n: Value = 0;
	for (Dir of each(GLOB.cardinal)) {
		if ((t = rt.locateIn(f, T("/obj/machinery/hydroponics"), rt.getStep(f, this, Dir))) && t.using_irrigation && this.using_irrigation) {
			n += Dir;
		}
	}
	this.icon_state = `hoses-${n}`;
	return f.dot;
});

// hydroponics.dm:292
rt.def("/obj/machinery/hydroponics/proc/update_icon_plant", function update_icon_plant(f: Frame) {
	let t_growthstate: Value = null;
	let plant_overlay: Value = mutable_appearance(this.myseed.growing_icon, { layer: 3.01 });
	if (this.dead) {
		plant_overlay.icon_state = this.myseed.icon_dead;
	} else if (this.harvest) {
		if (!this.myseed.icon_harvest) {
			plant_overlay.icon_state = `${this.myseed.icon_grow}${this.myseed.growthstages}`;
		} else {
			plant_overlay.icon_state = this.myseed.icon_harvest;
		}
	} else {
		t_growthstate = min(round(this.age / this.myseed.maturation * this.myseed.growthstages), this.myseed.growthstages);
		plant_overlay.icon_state = `${this.myseed.icon_grow}${t_growthstate}`;
	}
	this.add_overlay(plant_overlay);
	return f.dot;
});

// hydroponics.dm:306
rt.def("/obj/machinery/hydroponics/proc/update_icon_lights", function update_icon_lights(f: Frame) {
	if (this.waterlevel <= 10) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lowwater3"));
	}
	if (this.nutrilevel <= 2) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lownutri3"));
	}
	if (this.plant_health <= this.myseed.endurance / 2) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_lowhealth3"));
	}
	if (this.weedlevel >= 5 || this.pestlevel >= 5 || this.toxic >= 40) {
		this.add_overlay(mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_alert3"));
	}
	if (!this.harvest) return f.dot;
	this.add_overlay(mutable_appearance(rt.rsc("icons/obj/hydroponics/equipment.dmi"), "over_harvest3"));
	return f.dot;
});

// hydroponics.dm:319
rt.def("/obj/machinery/hydroponics/proc/examine", function examine(f: Frame, user: Value) {
	let percent_progress: Value = null;
	parent_proc();
	if (this.myseed) {
		to_chat(user, `<span class='info'>It has <span class='name'>${this.myseed.plantname}</span> planted.</span>`);
		if (this.dead) {
			to_chat(user, "<span class='warning'>It's dead!</span>");
		} else if (this.harvest) {
			to_chat(user, "<span class='info'>It's ready to harvest.</span>");
		} else if (this.plant_health <= this.myseed.endurance / 2) {
			to_chat(user, "<span class='warning'>It looks unhealthy.</span>");
		}
	} else {
		to_chat(user, `<span class='info'>${this} is empty.</span>`);
	}
	if (!this.self_sustaining) {
		to_chat(user, `<span class='info'>Water: ${this.waterlevel}/${this.maxwater}</span>`);
		to_chat(user, `<span class='info'>Nutrient: ${this.nutrilevel}/${this.maxnutri}</span>`);
		if (this.self_sufficiency_progress > 0) {
			percent_progress = round(this.self_sufficiency_progress * 100 / this.self_sufficiency_req);
			to_chat(user, `<span class='info'>Treatment for self-sustenance are ${percent_progress}% complete.</span>`);
		}
	} else {
		to_chat(user, "<span class='info'>It doesn't require any water or nutrients.</span>");
	}
	if (this.weedlevel >= 5) {
		to_chat(user, `<span class='warning'>${this} is filled with weeds!</span>`);
	}
	if (this.pestlevel >= 5) {
		to_chat(user, `<span class='warning'>${this} is filled with tiny worms!</span>`);
	}
	to_chat(user, "");
	return f.dot;
}, false);

// hydroponics.dm:352
rt.def("/obj/machinery/hydroponics/proc/weedinvasion", function* weedinvasion(f: Frame) {
	let oldPlantName: Value = null;
	this.dead = 0;
	if (this.myseed) {
		oldPlantName = this.myseed.plantname;
		yield* qdel(this.myseed);
		this.myseed = null;
	} else {
		oldPlantName = "empty tray";
	}
	const die = rand(1, 18);
	if (rt.inRange(die, 16, 18)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/reishi"), this));
	} else if (rt.inRange(die, 14, 15)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/nettle"), this));
	} else if (rt.inRange(die, 12, 13)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/harebell"), this));
	} else if (rt.inRange(die, 10, 11)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/amanita"), this));
	} else if (rt.inRange(die, 8, 9)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/chanter"), this));
	} else if (rt.inRange(die, 6, 7)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/tower"), this));
	} else if (rt.inRange(die, 4, 5)) {
		this.myseed = (yield* new_(T("/obj/item/seeds/plump"), this));
	} else {
		this.myseed = (yield* new_(T("/obj/item/seeds/starthistle"), this));
	}
	this.age = 0;
	this.plant_health = this.myseed.endurance;
	this.lastcycle = rt.worldTime(f);
	this.harvest = 0;
	this.weedlevel = 0;
	this.pestlevel = 0;
	yield* this.update_icon();
	this.visible_message(`<span class='warning'>The ${oldPlantName} is overtaken by some ${this.myseed.plantname}!</span>`);
	return f.dot;
}, true);

// hydroponics.dm:384
rt.def("/obj/machinery/hydroponics/proc/mutate", function* mutate(f: Frame, lifemut: Value, endmut: Value, productmut: Value, yieldmut: Value, potmut: Value, wrmut: Value, wcmut: Value, traitmut: Value) {
	lifemut ??= 2;
	endmut ??= 5;
	productmut ??= 1;
	yieldmut ??= 2;
	potmut ??= 25;
	wrmut ??= 2;
	wcmut ??= 5;
	traitmut ??= 0;
	if (!this.myseed) {
		return f.dot;
	}
	yield* this.myseed.mutate(lifemut, endmut, productmut, yieldmut, potmut, wrmut, wcmut, traitmut);
	return f.dot;
}, true);

// hydroponics.dm:389
rt.def("/obj/machinery/hydroponics/proc/hardmutate", function* hardmutate(f: Frame) {
	yield* this.mutate(4, 10, 2, 4, 50, 4, 10, 3);
	return f.dot;
}, true);

// hydroponics.dm:393
rt.def("/obj/machinery/hydroponics/proc/mutatespecie", function* mutatespecie(f: Frame) {
	let mutantseed: Value = null;
	if (!this.myseed || this.dead) {
		return f.dot;
	}
	let oldPlantName: Value = this.myseed.plantname;
	if (rt.len(f, this.myseed.mutatelist) > 0) {
		mutantseed = pick(this.myseed.mutatelist);
		yield* qdel(this.myseed);
		this.myseed = null;
		this.myseed = (yield* new_(mutantseed));
	} else {
		return f.dot;
	}
	yield* this.hardmutate();
	this.age = 0;
	this.plant_health = this.myseed.endurance;
	this.lastcycle = rt.worldTime(f);
	this.harvest = 0;
	this.weedlevel = 0;
	yield* sleep(5);
	yield* this.update_icon();
	this.visible_message(`<span class='warning'>${oldPlantName} suddenly mutates into ${this.myseed.plantname}!</span>`);
	return f.dot;
}, true);

// hydroponics.dm:418
rt.def("/obj/machinery/hydroponics/proc/mutateweed", function* mutateweed(f: Frame) {
	let newWeed: Value = null;
	if (this.weedlevel > 5) {
		if (this.myseed) {
			yield* qdel(this.myseed);
			this.myseed = null;
		}
		newWeed = pick(T("/obj/item/seeds/liberty"), T("/obj/item/seeds/angel"), T("/obj/item/seeds/nettle/death"), T("/obj/item/seeds/kudzu"));
		this.myseed = (yield* new_(newWeed));
		this.dead = 0;
		yield* this.hardmutate();
		this.age = 0;
		this.plant_health = this.myseed.endurance;
		this.lastcycle = rt.worldTime(f);
		this.harvest = 0;
		this.weedlevel = 0;
		yield* sleep(5);
		yield* this.update_icon();
		this.visible_message(`<span class='warning'>The mutated weeds in ${this} spawn some ${this.myseed.plantname}!</span>`);
	} else {
		to_chat(f.usr, `<span class='warning'>The few weeds in ${this} seem to react, but only for a moment...</span>`);
	}
	return f.dot;
}, true);

// hydroponics.dm:443
rt.def("/obj/machinery/hydroponics/proc/plantdies", function plantdies(f: Frame) {
	this.plant_health = 0;
	this.harvest = 0;
	this.pestlevel = 0;
	if (this.dead) return f.dot;
	this.update_icon();
	this.dead = 1;
	return f.dot;
});

// hydroponics.dm:450
rt.def("/obj/machinery/hydroponics/proc/mutatepest", function* mutatepest(f: Frame, user: Value) {
	if (this.pestlevel > 5) {
		message_admins(`${`${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`} caused spiderling pests to spawn in a hydro tray`);
		log_game(`${key_name(user)} caused spiderling pests to spawn in a hydro tray`);
		this.visible_message("<span class='warning'>The pests seem to behave oddly...</span>");
		yield* spawn_atom_to_turf(T("/obj/structure/spider/spiderling/hunter"), this, 3, 0);
	} else {
		to_chat(user, "<span class='warning'>The pests seem to behave oddly, but quickly settle down...</span>");
	}
	return f.dot;
}, true);

// hydroponics.dm:460
rt.def("/obj/machinery/hydroponics/proc/applyChemicals", function* applyChemicals(f: Frame, S: Value, user: Value) {
	let salt: Value = null;
	if (this.myseed) {
		this.myseed.on_chem_reaction(S);
	}
	if (S.has_reagent("mutagen", 5) || S.has_reagent("radium", 10) || S.has_reagent("uranium", 10)) {
		const die_2 = rand(100);
		if (rt.inRange(die_2, 91, 100)) {
			yield* this.adjustHealth(-10);
			to_chat(user, "<span class='warning'>The plant shrivels and burns.</span>");
		} else if (rt.inRange(die_2, 81, 90)) {
			yield* this.mutatespecie();
		} else if (rt.inRange(die_2, 66, 80)) {
			yield* this.hardmutate();
		} else if (rt.inRange(die_2, 41, 65)) {
			yield* this.mutate();
		} else if (rt.inRange(die_2, 21, 41)) {
			to_chat(user, "<span class='notice'>The plants don't seem to react...</span>");
		} else if (rt.inRange(die_2, 11, 20)) {
			yield* this.mutateweed();
		} else if (rt.inRange(die_2, 1, 10)) {
			yield* this.mutatepest(user);
		} else {
			to_chat(user, "<span class='notice'>Nothing happens...</span>");
		}
	} else if (S.has_reagent("mutagen", 2) || S.has_reagent("radium", 5) || S.has_reagent("uranium", 5)) {
		yield* this.hardmutate();
	} else if (S.has_reagent("mutagen", 1) || S.has_reagent("radium", 2) || S.has_reagent("uranium", 2)) {
		yield* this.mutate();
	}
	if (S.has_reagent("uranium", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("uranium") * 1));
		this.adjustToxic(round(S.get_reagent_amount("uranium") * 2));
	}
	if (S.has_reagent("radium", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("radium") * 1));
		this.adjustToxic(round(S.get_reagent_amount("radium") * 3));
	}
	if (S.has_reagent("eznutriment", 1)) {
		this.yieldmod = 1;
		this.mutmod = 1;
		this.adjustNutri(round(S.get_reagent_amount("eznutriment") * 1));
	}
	if (S.has_reagent("left4zednutriment", 1)) {
		this.yieldmod = 0;
		this.mutmod = 2;
		this.adjustNutri(round(S.get_reagent_amount("left4zednutriment") * 1));
	}
	if (S.has_reagent("robustharvestnutriment", 1)) {
		this.yieldmod = 1.3;
		this.mutmod = 0;
		this.adjustNutri(round(S.get_reagent_amount("robustharvestnutriment") * 1));
	}
	if (S.has_reagent("earthsblood")) {
		if ((this.self_sufficiency_progress += S.get_reagent_amount("earthsblood")) >= this.self_sufficiency_req) {
			this.become_self_sufficient();
		} else if (!this.self_sustaining) {
			to_chat(user, `<span class='notice'>${this} warms as it might on a spring day under a genuine Sun.</span>`);
		}
	}
	if (S.has_reagent("charcoal", 1)) {
		this.adjustToxic(-round(S.get_reagent_amount("charcoal") * 2));
	}
	if (S.has_reagent("toxin", 1)) {
		this.adjustToxic(round(S.get_reagent_amount("toxin") * 2));
	}
	if (S.has_reagent("milk", 1)) {
		this.adjustNutri(round(S.get_reagent_amount("milk") * 0.1));
		this.adjustWater(round(S.get_reagent_amount("milk") * 0.9));
	}
	if (S.has_reagent("beer", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("beer") * 0.05));
		this.adjustNutri(round(S.get_reagent_amount("beer") * 0.25));
		this.adjustWater(round(S.get_reagent_amount("beer") * 0.7));
	}
	if (S.has_reagent("fluorine", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("fluorine") * 2));
		this.adjustToxic(round(S.get_reagent_amount("flourine") * 2.5));
		this.adjustWater(-round(S.get_reagent_amount("flourine") * 0.5));
		this.adjustWeeds(-rand(1, 4));
	}
	if (S.has_reagent("chlorine", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("chlorine") * 1));
		this.adjustToxic(round(S.get_reagent_amount("chlorine") * 1.5));
		this.adjustWater(-round(S.get_reagent_amount("chlorine") * 0.5));
		this.adjustWeeds(-rand(1, 3));
	}
	if (S.has_reagent("phosphorus", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("phosphorus") * 0.75));
		this.adjustNutri(round(S.get_reagent_amount("phosphorus") * 0.1));
		this.adjustWater(-round(S.get_reagent_amount("phosphorus") * 0.5));
		this.adjustWeeds(-rand(1, 2));
	}
	if (S.has_reagent("sugar", 1)) {
		this.adjustWeeds(rand(1, 2));
		this.adjustPests(rand(1, 2));
		this.adjustNutri(round(S.get_reagent_amount("sugar") * 0.1));
	}
	if (S.has_reagent("water", 1)) {
		this.adjustWater(round(S.get_reagent_amount("water") * 1));
	}
	if (S.has_reagent("holywater", 1)) {
		this.adjustWater(round(S.get_reagent_amount("holywater") * 1));
		yield* this.adjustHealth(round(S.get_reagent_amount("holywater") * 0.1));
	}
	if (S.has_reagent("sodawater", 1)) {
		this.adjustWater(round(S.get_reagent_amount("sodawater") * 1));
		yield* this.adjustHealth(round(S.get_reagent_amount("sodawater") * 0.1));
		this.adjustNutri(round(S.get_reagent_amount("sodawater") * 0.1));
	}
	if (S.has_reagent("sacid", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("sacid") * 1));
		this.adjustToxic(round(S.get_reagent_amount("sacid") * 1.5));
		this.adjustWeeds(-rand(1, 2));
	}
	if (S.has_reagent("facid", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("facid") * 2));
		this.adjustToxic(round(S.get_reagent_amount("facid") * 3));
		this.adjustWeeds(-rand(1, 4));
	}
	if (S.has_reagent("plantbgone", 1)) {
		yield* this.adjustHealth(-round(S.get_reagent_amount("plantbgone") * 5));
		this.adjustToxic(round(S.get_reagent_amount("plantbgone") * 6));
		this.adjustWeeds(-rand(4, 8));
	}
	if (S.has_reagent("napalm", 1)) {
		if (!rt.bitAnd(this.myseed.resistance_flags, 2)) {
			yield* this.adjustHealth(-round(S.get_reagent_amount("napalm") * 6));
			this.adjustToxic(round(S.get_reagent_amount("napalm") * 7));
			this.adjustWeeds(-rand(5, 9));
		}
	}
	if (S.has_reagent("weedkiller", 1)) {
		this.adjustToxic(round(S.get_reagent_amount("weedkiller") * 0.5));
		this.adjustWeeds(-rand(1, 2));
	}
	if (S.has_reagent("pestkiller", 1)) {
		this.adjustToxic(round(S.get_reagent_amount("pestkiller") * 0.5));
		this.adjustPests(-rand(1, 2));
	}
	if (S.has_reagent("cryoxadone", 1)) {
		yield* this.adjustHealth(round(S.get_reagent_amount("cryoxadone") * 3));
		this.adjustToxic(-round(S.get_reagent_amount("cryoxadone") * 3));
	}
	if (S.has_reagent("ammonia", 1)) {
		yield* this.adjustHealth(round(S.get_reagent_amount("ammonia") * 0.5));
		this.adjustNutri(round(S.get_reagent_amount("ammonia") * 1));
		if (this.myseed) {
			this.myseed.adjust_yield(round(S.get_reagent_amount("ammonia") * 0.01));
		}
	}
	if (S.has_reagent("saltpetre", 1)) {
		yield* this.adjustHealth(round((salt = S.get_reagent_amount("saltpetre")) * 0.25));
		if (this.myseed) {
			this.myseed.adjust_production(-round(salt / 100) - prob(salt % 100));
			this.myseed.adjust_potency(round(salt * 0.5));
		}
	}
	if (S.has_reagent("ash", 1)) {
		yield* this.adjustHealth(round(S.get_reagent_amount("ash") * 0.25));
		this.adjustNutri(round(S.get_reagent_amount("ash") * 0.5));
		this.adjustWeeds(-1);
	}
	if (S.has_reagent("diethylamine", 1)) {
		yield* this.adjustHealth(round(S.get_reagent_amount("diethylamine") * 1));
		this.adjustNutri(round(S.get_reagent_amount("diethylamine") * 2));
		if (this.myseed) {
			this.myseed.adjust_yield(round(S.get_reagent_amount("diethylamine") * 0.02));
		}
		this.adjustPests(-rand(1, 2));
	}
	if (S.has_reagent("nutriment", 1)) {
		yield* this.adjustHealth(round(S.get_reagent_amount("nutriment") * 0.5));
		this.adjustNutri(round(S.get_reagent_amount("nutriment") * 1));
	}
	if (S.has_reagent("virusfood", 1)) {
		this.adjustNutri(round(S.get_reagent_amount("virusfood") * 0.5));
		yield* this.adjustHealth(-round(S.get_reagent_amount("virusfood") * 0.5));
	}
	if (S.has_reagent("blood", 1)) {
		this.adjustNutri(round(S.get_reagent_amount("blood") * 1));
		this.adjustPests(rand(2, 4));
	}
	if (S.has_reagent("strangereagent", 1)) {
		yield* this.spawnplant();
	}
	if (S.has_reagent("adminordrazine", 1)) {
		this.adjustWater(round(S.get_reagent_amount("adminordrazine") * 1));
		yield* this.adjustHealth(round(S.get_reagent_amount("adminordrazine") * 1));
		this.adjustNutri(round(S.get_reagent_amount("adminordrazine") * 1));
		this.adjustPests(-rand(1, 5));
		this.adjustWeeds(-rand(1, 5));
	}
	if (!S.has_reagent("adminordrazine", 5)) return f.dot;
	const die = rand(100);
	if (rt.inRange(die, 66, 100)) {
		yield* this.mutatespecie();
	} else if (rt.inRange(die, 33, 65)) {
		yield* this.mutateweed();
	} else if (rt.inRange(die, 1, 32)) {
		yield* this.mutatepest(user);
	} else {
		to_chat(user, "<span class='warning'>Nothing happens...</span>");
	}
	return f.dot;
}, true);

// hydroponics.dm:692
rt.def("/obj/machinery/hydroponics/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	let reagent_source: Value = null, syr: Value = null, trays: Value = null, target: Value = null, visi_msg: Value = null, irrigate: Value = null, syr_5: Value = null, split: Value = null, H: Value = null, S: Value = null, text_string: Value = null, S_0: Value = null, G: Value = null, h: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (rt.istype(O, T("/obj/item/weapon/reagent_containers"))) {
		if (rt.istype((reagent_source = O), T("/obj/item/weapon/reagent_containers/syringe"))) {
			if ((syr = reagent_source).mode != 1) {
				to_chat(user, "<span class='warning'>You can't get any extract out of this plant.</span>");
				return f.dot;
			}
		}
		if (!reagent_source.reagents.total_volume) {
			to_chat(user, `<span class='notice'>${reagent_source} is empty.</span>`);
			return 1;
		}
		trays = list(this);
		target = this.myseed ? this.myseed.plantname : this;
		visi_msg = "";
		irrigate = 0;
		if (rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/food/snacks")) || rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/pill"))) {
			visi_msg = `${user} composts ${reagent_source}, spreading it through ${target}`;
		} else {
			if (rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/syringe"))) {
				syr_5 = reagent_source;
				visi_msg = `${user} injects ${target} with ${syr_5}`;
				if (syr_5.reagents.total_volume <= syr_5.amount_per_transfer_from_this) {
					syr_5.mode = 0;
				}
			} else if (rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/spray"))) {
				visi_msg = `${user} sprays ${target} with ${reagent_source}`;
				playsound(this.loc, rt.rsc("sound/effects/spray3.ogg"), 50, 1, -6);
				irrigate = 1;
			} else if (reagent_source.amount_per_transfer_from_this) {
				visi_msg = `${user} uses ${reagent_source} on ${target}`;
				irrigate = 1;
			}
			if (rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/glass"))) {
				playsound(this.loc, rt.rsc("sound/effects/slosh.ogg"), 25, 1);
			}
		}
		if (irrigate && reagent_source.amount_per_transfer_from_this > 30 && reagent_source.reagents.total_volume >= 30 && this.using_irrigation) {
			if (rt.len(f, (trays = this.FindConnected())) > 1) {
				visi_msg += ", setting off the irrigation system";
			}
		}
		if (visi_msg) {
			this.visible_message(`<span class='notice'>${visi_msg}.</span>`);
		}
		split = round(reagent_source.amount_per_transfer_from_this / rt.len(f, trays));
		for (H of each(trays, T("/obj/machinery/hydroponics"))) {
			(S = (yield* new_(T("/datum/reagents")))).my_atom = H;
			yield* reagent_source.reagents.trans_to(S, split);
			if (rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/food/snacks")) || rt.istype(reagent_source, T("/obj/item/weapon/reagent_containers/pill"))) {
				yield* qdel(reagent_source);
			}
			yield* H.applyChemicals(S, user);
			yield* S.clear_reagents();
			yield* qdel(S);
			yield* H.update_icon();
		}
		if (reagent_source) {
			yield* reagent_source.update_icon();
		}
		return 1;
	} else if (rt.istype(O, T("/obj/item/seeds")) && !rt.istype(O, T("/obj/item/seeds/sample"))) {
		if (!this.myseed) {
			if (rt.istype(O, T("/obj/item/seeds/kudzu"))) {
				this.investigate_log(`had Kudzu planted in it by ${user.ckey}(${user}) at (${this.x},${this.y},${this.z})`, "kudzu");
			}
			if (!(yield* user.transferItemToLoc(O, this))) {
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You plant ${O}.</span>`);
			this.dead = 0;
			this.myseed = O;
			this.age = 1;
			this.plant_health = this.myseed.endurance;
			this.lastcycle = rt.worldTime(f);
			yield* this.update_icon();
		} else {
			to_chat(user, `<span class='warning'>${this} already has seeds in it!</span>`);
		}
	} else if (rt.istype(O, T("/obj/item/device/plant_analyzer"))) {
		if (this.myseed) {
			to_chat(user, `*** <B>${this.myseed.plantname}</B> ***`);
			to_chat(user, `- Plant Age: <span class='notice'>${this.age}</span>`);
			if (text_string = this.myseed.get_analyzer_text()) {
				to_chat(user, text_string);
			}
		} else {
			to_chat(user, "<B>No plant found.</B>");
		}
		to_chat(user, `- Weed level: <span class='notice'>${this.weedlevel} / 10</span>`);
		to_chat(user, `- Pest level: <span class='notice'>${this.pestlevel} / 10</span>`);
		to_chat(user, `- Toxicity level: <span class='notice'>${this.toxic} / 100</span>`);
		to_chat(user, `- Water level: <span class='notice'>${this.waterlevel} / ${this.maxwater}</span>`);
		to_chat(user, `- Nutrition level: <span class='notice'>${this.nutrilevel} / ${this.maxnutri}</span>`);
		to_chat(user, "");
	} else if (rt.istype(O, T("/obj/item/weapon/cultivator"))) {
		if (this.weedlevel > 0) {
			user.visible_message(`${user} uproots the weeds.`, `<span class='notice'>You remove the weeds from ${this}.</span>`);
			this.weedlevel = 0;
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='warning'>This plot is completely devoid of weeds! It doesn't need uprooting.</span>");
		}
	} else if (rt.istype(O, T("/obj/item/weapon/storage/bag/plants"))) {
		yield* this.attack_hand(user);
		S_0 = O;
		for (G of each(rt.locate(user.x, user.y, user.z), T("/obj/item/weapon/reagent_containers/food/snacks/grown"))) {
			if (!S_0.can_be_inserted(G)) {
				return f.dot;
			}
			yield* S_0.handle_item_insertion(G, 1);
		}
	} else if (rt.istype(O, T("/obj/item/weapon/wrench")) && this.unwrenchable) {
		if (this.using_irrigation) {
			to_chat(user, "<span class='warning'>Disconnect the hoses first!</span>");
			return f.dot;
		}
		if (!this.anchored && !this.isinspace()) {
			user.visible_message(`${user} begins to wrench ${this} into place.`, `<span class='notice'>You begin to wrench ${this} in place...</span>`);
			playsound(this.loc, O.usesound, 50, 1);
			if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
				if (this.anchored) {
					return f.dot;
				}
				this.anchored = 1;
				user.visible_message(`${user} wrenches ${this} into place.`, `<span class='notice'>You wrench ${this} in place.</span>`);
			}
		} else if (this.anchored) {
			user.visible_message(`${user} begins to unwrench ${this}.`, `<span class='notice'>You begin to unwrench ${this}...</span>`);
			playsound(this.loc, O.usesound, 50, 1);
			if (yield* do_after(user, 20 * O.toolspeed, { target: this })) {
				if (!this.anchored) {
					return f.dot;
				}
				this.anchored = 0;
				user.visible_message(`${user} unwrenches ${this}.`, `<span class='notice'>You unwrench ${this}.</span>`);
			}
		}
	} else if (rt.istype(O, T("/obj/item/weapon/wirecutters")) && this.unwrenchable) {
		this.using_irrigation = (!this.using_irrigation ? 1 : 0);
		playsound(this, O.usesound, 50, 1);
		$0 = user;
		$1 = user;
		if (this.using_irrigation) {

			$2 = "";
		} else {
			$2 = "dis";
		}
		$1 = `<span class='notice'>${$1} ${$2}connects ${this}'s irrigation hoses.</span>`;
		if (this.using_irrigation) {
			$2 = "";
		} else {
			$2 = "dis";
		}
		$0.visible_message($1, `<span class='notice'>You ${$2}connect ${this}'s irrigation hoses.</span>`);
		for (h of each(range(1, this), T("/obj/machinery/hydroponics"))) {
			yield* h.update_icon();
		}
	} else if (rt.istype(O, T("/obj/item/weapon/shovel/spade")) && this.unwrenchable) {
		if (!this.myseed && !this.weedlevel) {
			to_chat(user, `<span class='warning'>${this} doesn't have any plants or weeds!</span>`);
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} starts digging out ${this}'s plants...</span>`, `<span class='notice'>You start digging out ${this}'s plants...</span>`);
		playsound(this, rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1);
		if (!(yield* do_after(user, 50, { target: this })) || !this.myseed && !this.weedlevel) {
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} digs out the plants in ${this}!</span>`, `<span class='notice'>You dig out all of ${this}'s plants!</span>`);
		playsound(this, rt.rsc("sound/effects/shovel_dig.ogg"), 50, 1);
		if (this.myseed) {
			this.age = 0;
			this.plant_health = 0;
			if (this.harvest) {
				this.harvest = 0;
			}
			yield* qdel(this.myseed);
			this.myseed = null;
		}
		this.weedlevel = 0;
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// hydroponics.dm:864
rt.def("/obj/machinery/hydroponics/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (rt.istype(user, T("/mob/living/silicon"))) {
		return f.dot;
	}
	if (this.harvest) {
		yield* this.myseed.harvest(user);
	} else if (this.dead) {
		this.dead = 0;
		to_chat(user, `<span class='notice'>You remove the dead plant from ${this}.</span>`);
		yield* qdel(this.myseed);
		this.myseed = null;
		yield* this.update_icon();
	} else {
		yield* this.examine(user);
	}
	return f.dot;
}, true);

// hydroponics.dm:879
rt.def("/obj/machinery/hydroponics/proc/update_tray", function* update_tray(f: Frame, user: Value) {
	user ??= f.usr;
	this.harvest = 0;
	this.lastproduce = this.age;
	if (rt.istype(this.myseed, T("/obj/item/seeds/replicapod"))) {
		to_chat(user, `<span class='notice'>You harvest from the ${this.myseed.plantname}.</span>`);
	} else if (this.myseed.getYield() <= 0) {
		to_chat(user, "<span class='warning'>You fail to harvest anything useful!</span>");
	} else {
		to_chat(user, `<span class='notice'>You harvest ${this.myseed.getYield()} items from the ${this.myseed.plantname}.</span>`);
	}
	if (!this.myseed.get_gene(T("/datum/plant_gene/trait/repeated_harvest"))) {
		yield* qdel(this.myseed);
		this.myseed = null;
		this.dead = 0;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// hydroponics.dm:894
rt.def("/obj/machinery/hydroponics/proc/adjustNutri", function adjustNutri(f: Frame, adjustamt: Value) {
	this.nutrilevel = max(0, min(this.nutrilevel + adjustamt, this.maxnutri));
	return f.dot;
});

// hydroponics.dm:897
rt.def("/obj/machinery/hydroponics/proc/adjustWater", function adjustWater(f: Frame, adjustamt: Value) {
	this.waterlevel = max(0, min(this.waterlevel + adjustamt, this.maxwater));
	if (!(adjustamt > 0)) return f.dot;
	this.adjustToxic(-round(adjustamt / 4));
	return f.dot;
});

// hydroponics.dm:903
rt.def("/obj/machinery/hydroponics/proc/adjustHealth", function adjustHealth(f: Frame, adjustamt: Value) {
	if (!(this.myseed && !this.dead)) return f.dot;
	this.plant_health = max(0, min(this.plant_health + adjustamt, this.myseed.endurance));
	return f.dot;
});

// hydroponics.dm:907
rt.def("/obj/machinery/hydroponics/proc/adjustToxic", function adjustToxic(f: Frame, adjustamt: Value) {
	this.toxic = max(0, min(this.toxic + adjustamt, 100));
	return f.dot;
});

// hydroponics.dm:910
rt.def("/obj/machinery/hydroponics/proc/adjustPests", function adjustPests(f: Frame, adjustamt: Value) {
	this.pestlevel = max(0, min(this.pestlevel + adjustamt, 10));
	return f.dot;
});

// hydroponics.dm:913
rt.def("/obj/machinery/hydroponics/proc/adjustWeeds", function adjustWeeds(f: Frame, adjustamt: Value) {
	this.weedlevel = max(0, min(this.weedlevel + adjustamt, 10));
	return f.dot;
});

// hydroponics.dm:916
rt.def("/obj/machinery/hydroponics/proc/spawnplant", function* spawnplant(f: Frame) {
	let C: Value = null;
	let livingplants: Value = list(T("/mob/living/simple_animal/hostile/tree"), T("/mob/living/simple_animal/hostile/killertomato"));
	let chosen: Value = pick(livingplants);
	(C = (yield* new_(chosen))).faction = list("plants");
	return f.dot;
}, true);

// hydroponics.dm:922
rt.def("/obj/machinery/hydroponics/proc/become_self_sufficient", function become_self_sufficient(f: Frame) {
	this.visible_message(`<span class='boldnotice'>${this} begins to glow with a beautiful light!</span>`);
	this.self_sustaining = 1;
	this.update_icon();
	return f.dot;
});

// hydroponics.dm:942
rt.def("/obj/machinery/hydroponics/soil/proc/attackby", function* attackby(f: Frame, O: Value, user: Value, params: Value) {
	if (rt.istype(O, T("/obj/item/weapon/shovel")) && !rt.istype(O, T("/obj/item/weapon/shovel/spade"))) {
		to_chat(user, `<span class='notice'>You clear up ${this}!</span>`);
		yield* qdel(this);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);
