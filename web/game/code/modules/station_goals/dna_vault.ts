// Based on /tg/station's code/modules/station_goals/dna_vault.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(4203, "/datum/station_goal/dna_vault", "/datum/station_goal", {
	animal_count: null,
	human_count: null,
	plant_count: null,
	name: "DNA Vault",
});

// dna_vault.dm:21
rt.def("/datum/station_goal/dna_vault/proc/New", function New(f: Frame) {
	parent_proc();
	this.animal_count = rand(15, 20);
	this.human_count = rand(round(0.75 * GLOB.SSticker.totalPlayersReady), GLOB.SSticker.totalPlayersReady);
	let non_standard_plants: Value = this.non_standard_plants_count();
	this.plant_count = rand(round(0.5 * non_standard_plants), round(0.7 * non_standard_plants));
	return f.dot;
});

// dna_vault.dm:29
rt.def("/datum/station_goal/dna_vault/proc/non_standard_plants_count", function non_standard_plants_count(f: Frame) {
	let _T: Value = null, S: Value = null;
	f.dot = 0;
	for (_T of each(typesof(T("/obj/item/seeds")) - T("/obj/item/seeds"))) {
		if (rt.initial(f, (S = _T), "rarity") > 0) {
			f.dot++;
		}
	}
	return f.dot;
});

// dna_vault.dm:35
rt.def("/datum/station_goal/dna_vault/proc/get_report", function get_report(f: Frame) {
	return `Our long term prediction systems indicate a 99% chance of system-wide cataclysm in the near future.\n\t We need you to construct a DNA Vault aboard your station.\n\n\t The DNA Vault needs to contain samples of:\n\t ${this.animal_count} unique animal data\n\t ${this.plant_count} unique non-standard plant data\n\t ${this.human_count} unique sapient humanoid DNA data\n\n\t Base vault parts are available for shipping via cargo.`;
});

// dna_vault.dm:47
rt.def("/datum/station_goal/dna_vault/proc/on_report", function on_report(f: Frame) {
	let _P: Value = null;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/misc/dna_vault"))).special_enabled = 1;
	(_P = rt.index(GLOB.SSshuttle.supply_packs, T("/datum/supply_pack/misc/dna_probes"))).special_enabled = 1;
	return f.dot;
});

// dna_vault.dm:54
rt.def("/datum/station_goal/dna_vault/proc/check_completion", function check_completion(f: Frame) {
	let V: Value = null;
	if (parent_proc()) {
		return 1;
	}
	for (V of each(GLOB.machines, T("/obj/machinery/dna_vault"))) {
		if (rt.len(f, V.animals) >= this.animal_count && rt.len(f, V.plants) >= this.plant_count && rt.len(f, V.dna) >= this.human_count) {
			return 1;
		}
	}
	return 0;
});

rt.type(9430, "/obj/item/device/dna_probe", "/obj/item/device", {
	animals: null,
	plants: null,
	dna: null,
	flags: 4,
	name: "DNA Sampler",
	desc: "Can be used to take chemical and genetic samples of pretty much anything.",
	icon: rt.rsc("icons/obj/syringe.dmi"),
	item_state: "hypo",
	icon_state: "hypo",
});

// dna_vault.dm:69
rt.def("/obj/item/device/dna_probe/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.animals = list();

	this.plants = list();

	this.dna = list();
	return f.dot;
});

// dna_vault.dm:79
rt.def("/obj/item/device/dna_probe/proc/afterattack", function afterattack(f: Frame, target: Value, user: Value, proximity: Value) {
	let H: Value = null, A: Value = null;
	parent_proc();
	if (!proximity || !target) {
		return f.dot;
	}
	if (rt.istype(target, T("/obj/machinery/hydroponics"))) {
		if (!(H = target).myseed) {
			return f.dot;
		}
		if (!H.harvest) {
			to_chat(user, "<span clas='warning'>Plant needs to be ready to harvest to perform full data scan.</span>");
			return f.dot;
		}
		if (rt.index(this.plants, H.myseed.type)) {
			to_chat(user, "<span class='notice'>Plant data already present in local storage.<span>");
			return f.dot;
		}
		rt.setAt(this.plants, H.myseed.type, 1);
		to_chat(user, "<span class='notice'>Plant data added to local storage.<span>");
	}
	if (rt.istype(target, T("/mob/living/simple_animal")) || is_type_in_typecache(target, GLOB.non_simple_animals)) {
		if (rt.istype(target, T("/mob/living/simple_animal"))) {
			if (!(A = target).healable) {
				to_chat(user, "<span class='warning'>No compatible DNA detected</span>");
				return f.dot;
			}
		}
		if (rt.index(this.animals, target.type)) {
			to_chat(user, "<span class='notice'>Animal data already present in local storage.<span>");
			return f.dot;
		}
		rt.setAt(this.animals, target.type, 1);
		to_chat(user, "<span class='notice'>Animal data added to local storage.<span>");
	}
	if (!rt.istype(target, T("/mob/living/carbon/human"))) return f.dot;
	H = target;
	if (rt.index(this.dna, H.dna.uni_identity)) {
		to_chat(user, "<span class='notice'>Humanoid data already present in local storage.<span>");
		return f.dot;
	}
	rt.setAt(this.dna, H.dna.uni_identity, 1);
	to_chat(user, "<span class='notice'>Humanoid data added to local storage.<span>");
	return f.dot;
}, false);

rt.type(6788, "/obj/item/weapon/circuitboard/machine/dna_vault", "/obj/item/weapon/circuitboard/machine", {
	name: "DNA Vault (Machine Board)",
	build_path: rt.typePath("/obj/machinery/dna_vault"),
	origin_tech: "engineering=2;combat=2;bluespace=2",
	req_components: null,
});

// dna_vault.dm:124
rt.def("/obj/item/weapon/circuitboard/machine/dna_vault/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/capacitor/super"), 5, T("/obj/item/weapon/stock_parts/manipulator/pico"), 5, T("/obj/item/stack/cable_coil"), 2]);
	return f.dot;
});

rt.type(10995, "/obj/machinery/dna_vault", "/obj/machinery", {
	animals_max: 100,
	plants_max: 100,
	dna_max: 100,
	animals: null,
	plants: null,
	dna: null,
	completed: 0,
	power_lottery: null,
	fillers: null,
	anchored: 1,
	idle_power_usage: 5000,
	light_range: 1,
	name: "DNA Vault",
	desc: "Break glass in case of apocalypse.",
	icon: rt.rsc("icons/obj/machines/dna_vault.dmi"),
	icon_state: "vault",
	density: 1,
	pixel_x: -32,
	pixel_y: -64,
});

// dna_vault.dm:145
rt.def("/obj/machinery/dna_vault/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.animals = list();

	this.plants = list();

	this.dna = list();

	this.power_lottery = list();

	this.fillers = list();
	return f.dot;
});

// dna_vault.dm:156
rt.def("/obj/machinery/dna_vault/proc/Initialize", function* Initialize(f: Frame) {
	let direct: Value = null, _T: Value = null, F: Value = null, G: Value = null;
	let $e: any;
	let occupied: Value = list();
	for (direct of each(list(4, 8, 6, 10))) {
		occupied += rt.getStep(f, this, direct);
	}
	occupied += rt.locate(this.x + 1, this.y - 2, this.z);
	occupied += rt.locate(this.x - 1, this.y - 2, this.z);
	for (_T of each(occupied)) {
		(F = (yield* new_(T("/obj/structure/filler"), _T))).parent = this;
		this.fillers += F;
	}
	if (GLOB.SSticker.mode) {
		rt.forList(f, 0, GLOB.SSticker.mode.station_goals, T("/datum/station_goal/dna_vault"));
		if (($e = rt.next(f, 0)) !== undefined) {
			G = $e;
			this.animals_max = G.animal_count;
			this.plants_max = G.plant_count;
			this.dna_max = G.human_count;
		}
		rt.endFor(f, 0);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// dna_vault.dm:176
rt.def("/obj/machinery/dna_vault/proc/Destroy", function* Destroy(f: Frame) {
	let V: Value = null, filler: Value = null;
	for (V of each(this.fillers)) {
		(filler = V).parent = null;
		yield* qdel(filler);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// dna_vault.dm:184
rt.def("/obj/machinery/dna_vault/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.physical_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	this.roll_powers(user);
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "dna_vault", this.name, 350, 400, master_ui, state))).open();
	return f.dot;
}, true);

// dna_vault.dm:192
rt.def("/obj/machinery/dna_vault/proc/roll_powers", function roll_powers(f: Frame, user: Value) {
	let possible_powers: Value = null;
	if (rt.isIn(f, user, this.power_lottery)) {
		return f.dot;
	}
	let L: Value = list();
	L += pick_n_take((possible_powers = list("Toxin Adaptation", "Lung Enhancement", "Thermal Regulation", "Neural Repathing", "Bone Reinforcement", "Leg Muscle Stimulus", "Arm Muscle Stimulus")));
	L += pick_n_take(possible_powers);
	rt.setAt(this.power_lottery, user, L);
	return f.dot;
});

// dna_vault.dm:201
rt.def("/obj/machinery/dna_vault/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, L: Value = null;
	rt.setAt((data = list()), "plants", rt.len(f, this.plants));
	rt.setAt(data, "plants_max", this.plants_max);
	rt.setAt(data, "animals", rt.len(f, this.animals));
	rt.setAt(data, "animals_max", this.animals_max);
	rt.setAt(data, "dna", rt.len(f, this.dna));
	rt.setAt(data, "dna_max", this.dna_max);
	rt.setAt(data, "completed", this.completed);
	rt.setAt(data, "used", 1);
	rt.setAt(data, "choiceA", "");
	rt.setAt(data, "choiceB", "");
	if (user && this.completed) {
		if ((L = rt.index(this.power_lottery, user)) && rt.len(f, L)) {
			rt.setAt(data, "used", 0);
			rt.setAt(data, "choiceA", rt.index(L, 1));
			rt.setAt(data, "choiceB", rt.index(L, 2));
		}
	}
	return data;
});

// dna_vault.dm:221
rt.def("/obj/machinery/dna_vault/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "gene") {
		yield* this.upgrade(f.usr, rt.at(params, "choice"));
		f.dot = 1;
	}
	return f.dot;
}, true);

// dna_vault.dm:229
rt.def("/obj/machinery/dna_vault/proc/check_goal", function check_goal(f: Frame) {
	if (!(rt.len(f, this.plants) >= this.plants_max && rt.len(f, this.animals) >= this.animals_max && rt.len(f, this.dna) >= this.dna_max)) return f.dot;
	this.completed = 1;
	return f.dot;
});

// dna_vault.dm:234
rt.def("/obj/machinery/dna_vault/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _P: Value = null, uploaded: Value = null, plant: Value = null, animal: Value = null, ui: Value = null;
	if (rt.istype(I, T("/obj/item/device/dna_probe"))) {
		_P = I;
		uploaded = 0;
		for (plant of each(_P.plants)) {
			if (!rt.index(this.plants, plant)) {
				uploaded++;
				rt.setAt(this.plants, plant, 1);
			}
		}
		for (animal of each(_P.animals)) {
			if (!rt.index(this.animals, animal)) {
				uploaded++;
				rt.setAt(this.animals, animal, 1);
			}
		}
		for (ui of each(_P.dna)) {
			if (!rt.index(this.dna, ui)) {
				uploaded++;
				rt.setAt(this.dna, ui, 1);
			}
		}
		this.check_goal();
		to_chat(user, `<span class='notice'>${uploaded} new datapoints uploaded.</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// dna_vault.dm:257
rt.def("/obj/machinery/dna_vault/proc/upgrade", function upgrade(f: Frame, H: Value, upgrade_type: Value) {
	let L: Value = null;
	if (!rt.isIn(f, upgrade_type, rt.index(this.power_lottery, H))) {
		return f.dot;
	}
	let S: Value = H.dna.species;
	if (upgrade_type === "Toxin Adaptation") {
		to_chat(H, "<span class='notice'>You feel resistant to airborne toxins.</span>");
		if (rt.locateIn(f, T("/obj/item/organ/lungs"), H.internal_organs)) {
			(L = rt.index(H.internal_organs_slot, "lungs")).tox_breath_dam_min = 0;
			L.tox_breath_dam_max = 0;
		}
		(rt.modField(f, S, "species_traits", VIRUSIMMUNE, rt.bitOr));
	} else if (upgrade_type === "Lung Enhancement") {
		to_chat(H, "<span class='notice'>Your lungs feel great.</span>");
		(rt.modField(f, S, "species_traits", NOBREATH, rt.bitOr));
	} else if (upgrade_type === "Thermal Regulation") {
		to_chat(H, "<span class='notice'>You feel fireproof.</span>");
		S.burnmod = 0.5;
		S.heatmod = 0;
	} else if (upgrade_type === "Neural Repathing") {
		to_chat(H, "<span class='notice'>Nothing can keep you down for long.</span>");
		S.stunmod = 0.5;
	} else if (upgrade_type === "Bone Reinforcement") {
		to_chat(H, "<span class='notice'>You feel tough.</span>");
		S.armor = 30;
	} else if (upgrade_type === "Leg Muscle Stimulus") {
		to_chat(H, "<span class='notice'>Your legs feel faster.</span>");
		S.speedmod = -1;
	} else if (upgrade_type === "Arm Muscle Stimulus") {
		to_chat(H, "<span class='notice'>Your arms move as fast as lightning.</span>");
		H.next_move_modifier = 0.5;
	}
	rt.setAt(this.power_lottery, H, list());
	return f.dot;
});
