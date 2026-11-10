// Based on /tg/station's code/modules/atmospherics/machinery/components/unary_devices/vent_scrubber.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10609, "/obj/machinery/atmospherics/components/unary/vent_scrubber", "/obj/machinery/atmospherics/components/unary", {
	id_tag: null,
	on: 0,
	scrubbing: 1,
	scrub_CO2: 1,
	scrub_Toxins: 0,
	scrub_N2O: 0,
	scrub_BZ: 0,
	scrub_Freon: 0,
	scrub_WaterVapor: 0,
	volume_rate: 200,
	widenet: 0,
	adjacent_turfs: null,
	frequency: 1439,
	radio_connection: null,
	radio_filter_out: null,
	radio_filter_in: null,
	can_unwrench: 1,
	welded: 0,
	level: 1,
	name: "air scrubber",
	desc: "Has a valve and pump attached to it.",
	icon_state: "scrub_map",
	use_power: 1,
	idle_power_usage: 10,
	active_power_usage: 60,
	layer: 2.46,
});

// vent_scrubber.dm:30
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.adjacent_turfs = list();
	return f.dot;
});

// vent_scrubber.dm:38
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (this.id_tag) return f.dot;
	this.assign_uid();
	this.id_tag = num2text(this.uid);
	return f.dot;
}, true);

// vent_scrubber.dm:48
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, I: Value = null;
	(A = get_area(this)).air_scrub_names -= this.id_tag;
	A.air_scrub_info -= this.id_tag;
	if (GLOB.SSradio) {
		yield* GLOB.SSradio.remove_object(this, this.frequency);
	}
	this.radio_connection = null;
	for (I of each(this.adjacent_turfs)) {
		I = null;
	}
	return (yield* parent_proc());
}, true);

// vent_scrubber.dm:62
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/auto_use_power", function auto_use_power(f: Frame) {
	if (!this.powered(this.power_channel)) {
		return 0;
	}
	if (!this.on || this.welded) {
		return 0;
	}
	if (rt.bitAnd(this.stat, 3)) {
		return 0;
	}
	let amount: Value = this.idle_power_usage;
	if (rt.bitAnd(this.scrubbing, SCRUBBING)) {
		if (this.scrub_CO2) {
			amount += this.idle_power_usage;
		}
		if (this.scrub_Toxins) {
			amount += this.idle_power_usage;
		}
		if (this.scrub_N2O) {
			amount += this.idle_power_usage;
		}
		if (this.scrub_BZ) {
			amount += this.idle_power_usage;
		}
		if (this.scrub_Freon) {
			amount += this.idle_power_usage;
		}
		if (this.scrub_WaterVapor) {
			amount += this.idle_power_usage;
		}
	} else {
		amount = this.active_power_usage;
	}
	if (this.widenet) {
		amount += amount * (rt.len(f, this.adjacent_turfs) * (rt.len(f, this.adjacent_turfs) / 2));
	}
	this.use_power(amount, this.power_channel);
	return 1;
});

// vent_scrubber.dm:93
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/update_icon_nopipes", function update_icon_nopipes(f: Frame) {
	this.cut_overlays();
	if (this.showpipe) {
		this.add_overlay(this.getpipeimage(this.icon, "scrub_cap", this.initialize_directions));
	}
	if (this.welded) {
		this.icon_state = "scrub_welded";
		return f.dot;
	}
	if (!rt.index(this.nodes, 1) || !this.on || rt.bitAnd(this.stat, 3)) {
		this.icon_state = "scrub_off";
		return f.dot;
	}
	if (rt.bitAnd(this.scrubbing, 1)) {
		this.icon_state = "scrub_on";
	} else {
		this.icon_state = "scrub_purge";
	}
	return f.dot;
});

// vent_scrubber.dm:111
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/set_frequency", function* set_frequency(f: Frame, new_frequency: Value) {
	yield* GLOB.SSradio.remove_object(this, this.frequency);
	this.frequency = new_frequency;
	this.radio_connection = GLOB.SSradio.add_object(this, this.frequency, this.radio_filter_in);
	return f.dot;
}, true);

// vent_scrubber.dm:116
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/broadcast_status", function* broadcast_status(f: Frame) {
	let signal: Value = null, A: Value = null;
	if (!this.radio_connection) {
		return 0;
	}
	(signal = (yield* new_(T("/datum/signal")))).transmission_method = 1;
	signal.source = this;
	signal.data = rt.alist(f, ["tag", this.id_tag, "frequency", this.frequency, "device", "VS", "timestamp", rt.worldTime(f), "power", this.on, "scrubbing", this.scrubbing, "widenet", this.widenet, "filter_co2", this.scrub_CO2, "filter_toxins", this.scrub_Toxins, "filter_n2o", this.scrub_N2O, "filter_bz", this.scrub_BZ, "filter_freon", this.scrub_Freon, "filter_water_vapor", this.scrub_WaterVapor, "sigtype", "status"]);
	if (!rt.index((A = get_area(this)).air_scrub_names, this.id_tag)) {
		this.name = `ÿ\u0016${A.name} air scrubber #${rt.len(f, A.air_scrub_names) + 1}`;
		rt.setAt(A.air_scrub_names, this.id_tag, this.name);
	}
	rt.setAt(A.air_scrub_info, this.id_tag, signal.data);
	yield* this.radio_connection.post_signal(this, signal, this.radio_filter_out);
	return 1;
}, true);

// vent_scrubber.dm:150
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/atmosinit", function* atmosinit(f: Frame) {
	this.radio_filter_in = this.frequency == rt.initial(f, this, "frequency") ? GLOB.RADIO_FROM_AIRALARM : null;
	this.radio_filter_out = this.frequency == rt.initial(f, this, "frequency") ? GLOB.RADIO_TO_AIRALARM : null;
	if (this.frequency) {
		yield* this.set_frequency(this.frequency);
	}
	yield* this.broadcast_status();
	this.check_turfs();
	yield* parent_proc();
	return f.dot;
}, true);

// vent_scrubber.dm:159
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process_atmos", function* process_atmos(f: Frame) {
	let tile: Value = null;
	yield* parent_proc();
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.index(this.nodes, 1)) {
		this.on = 0;
	}
	if (!this.on || this.welded) {
		return 0;
	}
	yield* this.scrub(this.loc);
	if (!this.widenet) return f.dot;
	for (tile of each(this.adjacent_turfs, T("/turf"))) {
		yield* this.scrub(tile);
	}
	return f.dot;
}, true);

// vent_scrubber.dm:172
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/scrub", function* scrub(f: Frame, tile: Value) {
	let should_we_scrub: Value = null, id: Value = null, transfer_moles: Value = null, removed: Value = null, removed_gases: Value = null, filtered_out: Value = null, filtered_gases: Value = null, transfer_moles_3: Value = null, removed_4: Value = null;
	if (!rt.istype(tile, T("/turf"))) {
		return 0;
	}
	let environment: Value = tile.return_air();
	let air_contents: Value = rt.index(this.airs, 1);
	let env_gases: Value = environment.gases;
	if (rt.bitAnd(this.scrubbing, 1)) {
		should_we_scrub = 0;
		for (id of each(env_gases)) {
			if (id == "n2" || id == "o2") {
				continue;
			}
			if (rt.index(rt.index(env_gases, id), 1)) {
				should_we_scrub = 1;
				break;
			}
		}
		if (should_we_scrub) {
			transfer_moles = min(1, this.volume_rate / environment.volume) * environment.total_moles();
			if ((removed = (yield* tile.remove_air(transfer_moles))) === null) {
				return f.dot;
			}
			removed_gases = removed.gases;
			filtered_out = (yield* new_(T("/datum/gas_mixture")));
			filtered_gases = filtered_out.gases;
			filtered_out.temperature = removed.temperature;
			if (this.scrub_Toxins && rt.at(removed_gases, "plasma")) {
				filtered_out.assert_gas("plasma");
				rt.setAt(rt.at(filtered_gases, "plasma"), 1, rt.index(rt.at(removed_gases, "plasma"), 1));
				rt.setAt(rt.index(removed.gases, "plasma"), 1, 0);
			}
			if (this.scrub_CO2 && rt.at(removed_gases, "co2")) {
				filtered_out.assert_gas("co2");
				rt.setAt(rt.index(filtered_out.gases, "co2"), 1, rt.index(rt.at(removed_gases, "co2"), 1));
				rt.setAt(rt.index(removed.gases, "co2"), 1, 0);
			}
			if (rt.at(removed_gases, "agent_b")) {
				filtered_out.assert_gas("agent_b");
				rt.setAt(rt.index(filtered_out.gases, "agent_b"), 1, rt.index(rt.at(removed_gases, "agent_b"), 1));
				rt.setAt(rt.index(removed.gases, "agent_b"), 1, 0);
			}
			if (this.scrub_N2O && rt.at(removed_gases, "n2o")) {
				filtered_out.assert_gas("n2o");
				rt.setAt(rt.index(filtered_out.gases, "n2o"), 1, rt.index(rt.at(removed_gases, "n2o"), 1));
				rt.setAt(rt.index(removed.gases, "n2o"), 1, 0);
			}
			if (this.scrub_BZ && rt.at(removed_gases, "bz")) {
				filtered_out.assert_gas("bz");
				rt.setAt(rt.index(filtered_out.gases, "bz"), 1, rt.index(rt.at(removed_gases, "bz"), 1));
				rt.setAt(rt.index(removed.gases, "bz"), 1, 0);
			}
			if (this.scrub_Freon && rt.at(removed_gases, "freon")) {
				filtered_out.assert_gas("freon");
				rt.setAt(rt.index(filtered_out.gases, "freon"), 1, rt.index(rt.at(removed_gases, "freon"), 1));
				rt.setAt(rt.index(removed.gases, "freon"), 1, 0);
			}
			if (this.scrub_WaterVapor && rt.at(removed_gases, "water_vapor")) {
				filtered_out.assert_gas("water_vapor");
				rt.setAt(rt.index(filtered_out.gases, "water_vapor"), 1, rt.index(rt.at(removed_gases, "water_vapor"), 1));
				rt.setAt(rt.index(removed.gases, "water_vapor"), 1, 0);
			}
			removed.garbage_collect();
			yield* air_contents.merge(filtered_out);
			yield* tile.assume_air(removed);
			tile.air_update_turf();
		}
	} else {
		if (air_contents.return_pressure() >= 5066.25) {
			return f.dot;
		}
		transfer_moles_3 = environment.total_moles() * (this.volume_rate / environment.volume);
		removed_4 = (yield* tile.remove_air(transfer_moles_3));
		yield* air_contents.merge(removed_4);
		tile.air_update_turf();
	}
	this.update_parents();
	return 1;
}, true);

// vent_scrubber.dm:265
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/process", function process(f: Frame) {
	if (!this.widenet) return f.dot;
	this.check_turfs();
	return f.dot;
}, false, { waitfor: false });

// vent_scrubber.dm:270
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/check_turfs", function check_turfs(f: Frame) {
	let _T: Value = null;
	this.adjacent_turfs.Cut();
	if (!rt.istype((_T = rt.getStep(f, this, 0)), T("/turf"))) return f.dot;
	this.adjacent_turfs = _T.GetAtmosAdjacentTurfs({ alldir: 1 });
	return f.dot;
});

// vent_scrubber.dm:277
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/receive_signal", function* receive_signal(f: Frame, signal: Value) {
	if (rt.bitAnd(this.stat, 3)) {
		return f.dot;
	}
	if (!rt.index(signal.data, "tag") || rt.index(signal.data, "tag") != this.id_tag || rt.index(signal.data, "sigtype") != "command") {
		return 0;
	}
	if (rt.isIn(f, "power", signal.data)) {
		this.on = text2num(rt.index(signal.data, "power"));
	}
	if (rt.isIn(f, "power_toggle", signal.data)) {
		this.on = (!this.on ? 1 : 0);
	}
	if (rt.isIn(f, "widenet", signal.data)) {
		this.widenet = text2num(rt.index(signal.data, "widenet"));
	}
	if (rt.isIn(f, "toggle_widenet", signal.data)) {
		this.widenet = (!this.widenet ? 1 : 0);
	}
	if (rt.isIn(f, "scrubbing", signal.data)) {
		this.scrubbing = text2num(rt.index(signal.data, "scrubbing"));
	}
	if (rt.isIn(f, "toggle_scrubbing", signal.data)) {
		this.scrubbing = (!this.scrubbing ? 1 : 0);
	}
	if (rt.isIn(f, "co2_scrub", signal.data)) {
		this.scrub_CO2 = text2num(rt.index(signal.data, "co2_scrub"));
	}
	if (rt.isIn(f, "toggle_co2_scrub", signal.data)) {
		this.scrub_CO2 = (!this.scrub_CO2 ? 1 : 0);
	}
	if (rt.isIn(f, "tox_scrub", signal.data)) {
		this.scrub_Toxins = text2num(rt.index(signal.data, "tox_scrub"));
	}
	if (rt.isIn(f, "toggle_tox_scrub", signal.data)) {
		this.scrub_Toxins = (!this.scrub_Toxins ? 1 : 0);
	}
	if (rt.isIn(f, "n2o_scrub", signal.data)) {
		this.scrub_N2O = text2num(rt.index(signal.data, "n2o_scrub"));
	}
	if (rt.isIn(f, "toggle_n2o_scrub", signal.data)) {
		this.scrub_N2O = (!this.scrub_N2O ? 1 : 0);
	}
	if (rt.isIn(f, "bz_scrub", signal.data)) {
		this.scrub_BZ = text2num(rt.index(signal.data, "bz_scrub"));
	}
	if (rt.isIn(f, "toggle_bz_scrub", signal.data)) {
		this.scrub_BZ = (!this.scrub_BZ ? 1 : 0);
	}
	if (rt.isIn(f, "freon_scrub", signal.data)) {
		this.scrub_Freon = text2num(rt.index(signal.data, "freon_scrub"));
	}
	if (rt.isIn(f, "toggle_freon_scrub", signal.data)) {
		this.scrub_Freon = (!this.scrub_Freon ? 1 : 0);
	}
	if (rt.isIn(f, "water_vapor_scrub", signal.data)) {
		this.scrub_WaterVapor = text2num(rt.index(signal.data, "water_vapor_scrub"));
	}
	if (rt.isIn(f, "toggle_water_vapor_scrub", signal.data)) {
		this.scrub_WaterVapor = (!this.scrub_WaterVapor ? 1 : 0);
	}
	if (rt.isIn(f, "init", signal.data)) {
		this.name = rt.index(signal.data, "init");
		return f.dot;
	}
	if (rt.isIn(f, "status", signal.data)) {
		yield* this.broadcast_status();
		return f.dot;
	}
	yield* this.broadcast_status();
	yield* this.update_icon();
	return f.dot;
}, true);

// vent_scrubber.dm:340
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon_nopipes();
	return f.dot;
});

// vent_scrubber.dm:344
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let WT: Value = null;
	if (rt.istype(W, T("/obj/item/weapon/weldingtool"))) {
		if (yield* (WT = W).remove_fuel(0, user)) {
			playsound(this.loc, WT.usesound, 40, 1);
			to_chat(user, "<span class='notice'>Now welding the scrubber.</span>");
			if (yield* do_after(user, 20 * W.toolspeed, { target: this })) {
				if (!this || !WT.isOn()) {
					return f.dot;
				}
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				if (!this.welded) {
					user.visible_message(`${user} welds the scrubber shut.`, "You weld the scrubber shut.", "You hear welding.");
					this.welded = 1;
				} else {
					user.visible_message(`${user} unwelds the scrubber.`, "You unweld the scrubber.", "You hear welding.");
					this.welded = 0;
				}
				yield* this.update_icon();
				this.pipe_vision_img = (yield* image(this, this.loc, { layer: ABOVE_HUD_LAYER, dir: this.dir }));
				this.pipe_vision_img.plane = ABOVE_HUD_PLANE;
			}
			return 0;
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// vent_scrubber.dm:367
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_unwrench", function can_unwrench(f: Frame, user: Value) {
	if (!parent_proc()) return f.dot;
	if (!rt.bitAnd(this.stat, 2) && this.on) {
		to_chat(user, `<span class='warning'>You cannot unwrench ${this}, turn it off first!</span>`);
	} else {
		return 1;
	}
	return f.dot;
}, false);

// vent_scrubber.dm:374
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/can_crawl_through", function can_crawl_through(f: Frame) {
	return (!this.welded ? 1 : 0);
});

// vent_scrubber.dm:377
rt.def("/obj/machinery/atmospherics/components/unary/vent_scrubber/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	if (!this.welded || !(yield* do_after(user, 20, { target: this }))) {
		return f.dot;
	}
	user.visible_message(`${user} furiously claws at ${this}!`, "You manage to clear away the stuff blocking the scrubber.", "You hear loud scraping noises.");
	this.welded = 0;
	yield* this.update_icon();
	this.pipe_vision_img = (yield* image(this, this.loc, { layer: ABOVE_HUD_LAYER, dir: this.dir }));
	this.pipe_vision_img.plane = ABOVE_HUD_PLANE;
	playsound(this.loc, rt.rsc("sound/weapons/bladeslice.ogg"), 100, 1);
	return f.dot;
}, true);
