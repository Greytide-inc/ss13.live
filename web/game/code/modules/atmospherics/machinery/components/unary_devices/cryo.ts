// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/cryo.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, subtract } = rt;


rt.type(10583, "/obj/machinery/atmospherics/components/unary/cryo_cell", "/obj/machinery/atmospherics/components/unary", {
	on: 0,
	autoeject: 0,
	volume: 100,
	efficiency: 1,
	sleep_factor: 750,
	unconscious_factor: 1000,
	heat_capacity: 20000,
	conduction_coefficient: 0.3,
	beaker: null,
	reagent_transfer: 0,
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	radio_channel: "Medical",
	running_bob_anim: 0,
	anchored: 1,
	name: "cryo cell",
	icon: rt.rsc("icons/obj/cryogenics.dmi"),
	icon_state: "pod-off",
	density: 1,
	obj_integrity: 350,
	max_integrity: 350,
	armor: null,
	layer: 3.3,
	state_open: 0,
});

// cryo.dm:11
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 30, "acid", 30]);
	return f.dot;
});

// cryo.dm:35
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.dot = (yield* parent_proc());
	this.initialize_directions = this.dir;
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/cryo_tube")))).apply_default_parts(this);
	this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.radio.keyslot = (yield* new_(this.radio_key));
	this.radio.subspace_transmission = 1;
	this.radio.canhear_range = 0;
	this.radio.recalculateChannels();
	return f.dot;
}, true);

rt.type(6744, "/obj/item/weapon/circuitboard/machine/cryo_tube", "/obj/item/weapon/circuitboard/machine", {
	name: "Cryotube (Machine Board)",
	build_path: rt.typePath("/obj/machinery/atmospherics/components/unary/cryo_cell"),
	origin_tech: "programming=4;biotech=3;engineering=4;plasmatech=3",
	req_components: null,
});

// cryo.dm:50
rt.def("/obj/item/weapon/circuitboard/machine/cryo_tube/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/matter_bin"), 1, T("/obj/item/stack/cable_coil"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1, T("/obj/item/stack/sheet/glass"), 2]);
	return f.dot;
});

// cryo.dm:57
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_construction", function* on_construction(f: Frame) {
	yield* parent_proc(this.dir, this.dir);
	return f.dot;
}, true);

// cryo.dm:61
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, M: Value = null;
	for (M of each(this.component_parts, T("/obj/item/weapon/stock_parts/matter_bin"))) {
		C += M.rating;
	}
	this.efficiency = rt.initial(f, this, "efficiency") * C;
	this.sleep_factor = rt.initial(f, this, "sleep_factor") * C;
	this.unconscious_factor = rt.initial(f, this, "unconscious_factor") * C;
	this.heat_capacity = rt.initial(f, this, "heat_capacity") / C;
	this.conduction_coefficient = rt.initial(f, this, "conduction_coefficient") * C;
	return f.dot;
});

// cryo.dm:71
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.radio);
	this.radio = null;
	if (this.beaker) {
		yield* qdel(this.beaker);
		this.beaker = null;
	}
	return (yield* parent_proc());
}, true);

// cryo.dm:79
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	parent_proc();
	if (!this.beaker) return f.dot;
	this.beaker.ex_act(severity, target);
	return f.dot;
}, false);

// cryo.dm:84
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A != this.beaker) return f.dot;
	this.beaker = null;
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// cryo.dm:91
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (!this.beaker) return f.dot;
	yield* this.beaker.forceMove(this.loc);
	this.beaker = null;
	return f.dot;
}, true);

// cryo.dm:95
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/update_icon", function* update_icon(f: Frame) {
	let occupant_overlay: Value = null;
	this.cut_overlays();
	if (this.state_open) {
		this.icon_state = "pod-open";
	} else if (this.occupant) {
		if (rt.istype(this.occupant, T("/mob/living/carbon/monkey"))) {
			occupant_overlay = mutable_appearance(rt.rsc("icons/obj/cryo_mobs.dmi"), "monkey");
		} else if (rt.istype(this.occupant, T("/mob/living/carbon/alien/humanoid"))) {
			if (rt.istype(this.occupant, T("/mob/living/carbon/alien/humanoid/royal"))) {
				occupant_overlay = image(rt.rsc("icons/obj/cryo_mobs.dmi"), "alienq");
			} else if (rt.istype(this.occupant, T("/mob/living/carbon/alien/humanoid/hunter"))) {
				occupant_overlay = image(rt.rsc("icons/obj/cryo_mobs.dmi"), "alienh");
			} else if (rt.istype(this.occupant, T("/mob/living/carbon/alien/humanoid/sentinel"))) {
				occupant_overlay = image(rt.rsc("icons/obj/cryo_mobs.dmi"), "aliens");
			} else {
				occupant_overlay = image(rt.rsc("icons/obj/cryo_mobs.dmi"), "aliend");
			}
		} else if (rt.istype(this.occupant, T("/mob/living/carbon/human")) || rt.istype(this.occupant, T("/mob/living/carbon/alien/larva")) || rt.istype(this.occupant, T("/mob/living/simple_animal")) && !rt.istype(this.occupant, T("/mob/living/simple_animal/hostile/megafauna"))) {
			(occupant_overlay = image(this.occupant.icon, this.occupant.icon_state)).copy_overlays(this.occupant);
		} else {
			occupant_overlay = image(rt.rsc("icons/obj/cryo_mobs.dmi"), "generic");
		}
		occupant_overlay.dir = 2;
		occupant_overlay.pixel_y = 22;
		if (this.on && this.is_operational() && !this.running_bob_anim) {
			this.icon_state = "pod-on";
			this.running_bob_anim = 1;
			yield* this.run_bob_anim(1, occupant_overlay);
		} else {
			this.icon_state = "pod-off";
			this.add_overlay(occupant_overlay);
			this.add_overlay("cover-off");
		}
	} else if (this.on && this.is_operational()) {
		this.icon_state = "pod-on";
		this.add_overlay("cover-on");
	} else {
		this.icon_state = "pod-off";
		this.add_overlay("cover-off");
	}
	if (!this.panel_open) return f.dot;
	this.add_overlay("pod-panel");
	return f.dot;
}, true);

// cryo.dm:148
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/run_bob_anim", function* run_bob_anim(f: Frame, anim_up: Value, occupant_overlay: Value) {
	if (!this.on || !this.occupant || !this.is_operational()) {
		this.running_bob_anim = 0;
		return f.dot;
	}
	this.cut_overlays();
	if (occupant_overlay.pixel_y != 23) {
		anim_up = (occupant_overlay.pixel_y == 22 ? 1 : 0);
	}
	if (anim_up) {
		occupant_overlay.pixel_y++;
	} else {
		occupant_overlay.pixel_y--;
	}
	this.add_overlay(occupant_overlay);
	this.add_overlay("cover-on");
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/run_bob_anim"), anim_up, occupant_overlay)), 7, 1);
	return f.dot;
}, true, { argTypes: [{  }, { path: "/image" }] });

// cryo.dm:163
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/process", function* process(f: Frame) {
	let mob_occupant: Value = null;
	yield* parent_proc();
	if (!this.on) {
		return f.dot;
	}
	if (!this.is_operational()) {
		this.on = 0;
		yield* this.update_icon();
		return f.dot;
	}
	let air1: Value = rt.index(this.airs, 1);
	let _T: Value = rt.getStep(f, this, 0);
	if (this.occupant) {
		if ((mob_occupant = this.occupant).health >= mob_occupant.getMaxHealth()) {
			this.on = 0;
			yield* this.update_icon();
			playsound(_T, rt.rsc("sound/machines/cryo_warning.ogg"), this.volume);
			yield* this.radio.talk_into(this, "Patient fully restored", this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
			if (this.autoeject) {
				yield* this.radio.talk_into(this, "Auto ejecting patient now", this.radio_channel, this.get_spans(), (yield* this.get_default_language()));
				yield* this.open_machine();
			}
			return f.dot;
		} else if (mob_occupant.stat == 2) {
			// tg bug: a `return` here made the auto-eject below unreachable, so a dead patient stayed in (modern tg ejects)
			if (this.autoeject) {
				yield* this.open_machine();
			}
			return f.dot;
		}
		if (rt.len(f, air1.gases)) {
			if (mob_occupant.bodytemperature < T0C) {
				yield* mob_occupant.Sleeping(mob_occupant.bodytemperature / this.sleep_factor * 2000);
				yield* mob_occupant.Unconscious(mob_occupant.bodytemperature / this.unconscious_factor * 2000);
			}
			if (this.beaker) {
				if (this.reagent_transfer == 0) {
					yield* this.beaker.reagents.trans_to(this.occupant, 1, 10 * this.efficiency);
					yield* this.beaker.reagents.reaction(this.occupant, VAPOR);
					(rt.modAt(rt.index(air1.gases, "o2"), 1, 2 / this.efficiency, subtract));
				}
				if (++this.reagent_transfer >= 10 * this.efficiency) {
					this.reagent_transfer = 0;
				}
			}
		}
	}
	return 1;
}, true, { waitfor: false });

// cryo.dm:204
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/process_atmos", function* process_atmos(f: Frame) {
	let H: Value = null, temperature_delta: Value = null, air_heat_capacity: Value = null, heat: Value = null;
	yield* parent_proc();
	if (!this.on) {
		return f.dot;
	}
	let air1: Value = rt.index(this.airs, 1);
	if (!rt.index(this.nodes, 1) || !rt.index(this.airs, 1) || !rt.len(f, air1.gases) || rt.index(rt.index(air1.gases, "o2"), 1) < 5) {
		this.on = 0;
		yield* this.update_icon();
		return f.dot;
	}
	if (!this.occupant) return f.dot;
	let mob_occupant: Value = this.occupant;
	let cold_protection: Value = 0;
	if (rt.istype((H = this.occupant), T("/mob/living/carbon/human"))) {
		cold_protection = H.get_cold_protection(air1.temperature);
	}
	if (rt.op(f, "Abs", [], [(temperature_delta = air1.temperature - mob_occupant.bodytemperature)]) > 1) {
		air_heat_capacity = air1.heat_capacity();
		heat = ((1 - cold_protection) / 10 + this.conduction_coefficient) * temperature_delta * (air_heat_capacity * this.heat_capacity / (air_heat_capacity + this.heat_capacity));
		air1.temperature = max(air1.temperature - heat / air_heat_capacity, TCMB);
		mob_occupant.bodytemperature = max(mob_occupant.bodytemperature + heat / this.heat_capacity, TCMB);
	}
	(rt.modAt(rt.index(air1.gases, "o2"), 1, 0.5 / this.efficiency, subtract));
	return f.dot;
}, true);

// cryo.dm:231
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/power_change", function* power_change(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	return f.dot;
}, true);

// cryo.dm:235
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.container_resist(user);
	return f.dot;
}, true);

// cryo.dm:238
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/open_machine", function* open_machine(f: Frame) {
	let M: Value = null, L: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	if (!this.state_open && !this.panel_open) {
		this.on = 0;
		yield* parent_proc();
	}
	for (M of each(this.contents, T("/mob"))) {
		yield* M.forceMove(rt.getStep(f, this, 0));
		if (rt.istype(M, T("/mob/living"))) {
			yield* (L = M).update_canmove();
		}
	}
	this.occupant = null;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["drop"] });

// cryo.dm:250
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/close_machine", function* close_machine(f: Frame, user: Value) {
	if (!((user === null || rt.istype(user, T("/mob/living/carbon"))) && this.state_open && !this.panel_open)) return f.dot;
	yield* parent_proc(user);
	return this.occupant;
}, true);

// cryo.dm:255
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	to_chat(user, "<span class='notice'>You struggle inside the cryotube, kicking the release with your foot... (This will take around 30 seconds.)</span>");
	this.audible_message(`<span class='notice'>You hear a thump from ${this}.</span>`);
	if (!(yield* do_after(user, 300))) return f.dot;
	if (this.occupant != user) return f.dot;
	yield* this.open_machine();
	return f.dot;
}, true);

// cryo.dm:262
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.occupant) {
		if (this.on) {
			to_chat(user, `Someone's inside ${this}!`);
		} else {
			to_chat(user, `You can barely make out a form floating in ${this}.`);
		}
	} else {
		to_chat(user, `${this} seems empty.`);
	}
	return f.dot;
}, false);

// cryo.dm:272
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (user.stat || user.lying || !this.Adjacent(user) || !user.Adjacent(target) || !rt.istype(target, T("/mob/living/carbon")) || !user.IsAdvancedToolUser()) {
		return f.dot;
	}
	yield* this.close_machine(target);
	return f.dot;
}, true);

// cryo.dm:277
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let reagentlist: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers/glass"))) {
		f.dot = 1;
		if (this.beaker) {
			to_chat(user, `<span class='warning'>A beaker is already loaded into ${this}!</span>`);
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.beaker = I;
		I.loc = this;
		user.visible_message(`${user} places ${I} in ${this}.`, `<span class='notice'>You place ${I} in ${this}.</span>`);
		reagentlist = pretty_string_from_reagent_list(I.reagents.reagent_list);
		log_game(`${key_name(user)} added an ${I} to cyro containing ${reagentlist}`);
		return f.dot;
	}
	if (!this.on && !this.occupant && !this.state_open) {
		if (this.default_deconstruction_screwdriver(user, "cell-o", "cell-off", I)) {
			return f.dot;
		}
		if (yield* this.exchange_parts(user, I)) {
			return f.dot;
		}
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		return f.dot;
	}
	if (yield* this.default_pry_open(I)) {
		return f.dot;
	}
	if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// cryo.dm:306
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.notcontained_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "cryo", this.name, 400, 550, master_ui, state))).open();
	return f.dot;
}, true);

// cryo.dm:312
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null, mob_occupant: Value = null, R: Value = null;
	let $e: any;
	rt.setAt((data = list()), "isOperating", this.on);
	let $0: any = data;
	let $1: any = "hasOccupant";
	rt.setAt($0, $1, this.occupant ? 1 : 0);
	rt.setAt(data, "isOpen", this.state_open);
	rt.setAt(data, "autoEject", this.autoeject);
	let occupantData: Value = list();
	if (this.occupant) {
		mob_occupant = this.occupant;
		rt.setAt(occupantData, "name", mob_occupant.name);
		rt.setAt(occupantData, "stat", mob_occupant.stat);
		rt.setAt(occupantData, "health", mob_occupant.health);
		rt.setAt(occupantData, "maxHealth", mob_occupant.maxHealth);
		rt.setAt(occupantData, "minHealth", -100);
		rt.setAt(occupantData, "bruteLoss", mob_occupant.getBruteLoss());
		rt.setAt(occupantData, "oxyLoss", mob_occupant.getOxyLoss());
		rt.setAt(occupantData, "toxLoss", mob_occupant.getToxLoss());
		rt.setAt(occupantData, "fireLoss", mob_occupant.getFireLoss());
		rt.setAt(occupantData, "bodyTemperature", mob_occupant.bodytemperature);
	}
	rt.setAt(data, "occupant", occupantData);
	let air1: Value = rt.index(this.airs, 1);
	rt.setAt(data, "cellTemperature", round(air1.temperature));
	rt.setAt(data, "isBeakerLoaded", this.beaker ? 1 : 0);
	let beakerContents: Value = list();
	if (this.beaker && this.beaker.reagents && rt.len(f, this.beaker.reagents.reagent_list)) {
		for (R of each(this.beaker.reagents.reagent_list, T("/datum/reagent"))) {
			beakerContents += list(rt.alist(f, ["name", R.name, "volume", R.volume]));
		}
	}
	rt.setAt(data, "beakerContents", beakerContents);
	return data;
});

// cryo.dm:346
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "power") {
		if (this.on) {
			this.on = 0;
		} else if (!this.state_open) {
			this.on = 1;
		}
		f.dot = 1;
	} else if (action === "door") {
		if (this.state_open) {
			yield* this.close_machine();
		} else {
			yield* this.open_machine();
		}
		f.dot = 1;
	} else if (action === "autoeject") {
		this.autoeject = (!this.autoeject ? 1 : 0);
		f.dot = 1;
	} else if (action === "ejectbeaker") {
		if (this.beaker) {
			yield* this.beaker.forceMove(this.loc);
			this.beaker = null;
			f.dot = 1;
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// cryo.dm:375
rt.def("/obj/machinery/atmospherics/components/unary/cryo_cell/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	yield* user.overlay_fullscreen("remote_view", T("/obj/screen/fullscreen/impaired"), 1);
	return f.dot;
}, true);
