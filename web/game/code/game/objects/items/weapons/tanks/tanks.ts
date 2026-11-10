// Based on /tg/station's code/game/objects/items/weapons/tanks/tanks.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7446, "/obj/item/weapon/tank", "/obj/item/weapon", {
	air_contents: null,
	distribute_pressure: 101.325,
	integrity: 3,
	volume: 70,
	flags: 64,
	pressure_resistance: 506.625,
	throw_speed: 1,
	throw_range: 4,
	name: "tank",
	icon: rt.rsc("icons/obj/tank.dmi"),
	slot_flags: 1024,
	hitsound: rt.rsc("sound/weapons/smash.ogg"),
	force: 5,
	throwforce: 10,
	actions_types: null,
	armor: null,
});

// tanks.dm:12
rt.def("/obj/item/weapon/tank/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.actions_types = list(T("/datum/action/item_action/set_internals"));
	this.armor = rt.alist(f, ["melee", 0, "bullet", 0, "laser", 0, "energy", 0, "bomb", 10, "bio", 0, "rad", 0, "fire", 80, "acid", 30]);
	return f.dot;
});

// tanks.dm:20
rt.def("/obj/item/weapon/tank/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	yield* this.toggle_internals(user);
	return f.dot;
}, true);

// tanks.dm:23
rt.def("/obj/item/weapon/tank/proc/toggle_internals", function* toggle_internals(f: Frame, user: Value) {
	let H: Value = null;
	if (!rt.istype((H = user), T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	if (H.internal == this) {
		to_chat(H, `<span class='notice'>You close ${this} valve.</span>`);
		H.internal = null;
		H.update_internals_hud_icon(0);
	} else {
		if (!H.getorganslot("breathing_tube")) {
			if (!H.wear_mask) {
				to_chat(H, "<span class='warning'>You need a mask!</span>");
				return f.dot;
			}
			if (H.wear_mask.mask_adjusted) {
				yield* H.wear_mask.adjustmask(H);
			}
			if (!rt.bitAnd(H.wear_mask.flags, MASKINTERNALS)) {
				to_chat(H, `<span class='warning'>${H.wear_mask} can't use ${this}!</span>`);
				return f.dot;
			}
		}
		if (H.internal) {
			to_chat(H, `<span class='notice'>You switch your internals to ${this}.</span>`);
		} else {
			to_chat(H, `<span class='notice'>You open ${this} valve.</span>`);
		}
		H.internal = this;
		H.update_internals_hud_icon(1);
	}
	yield* H.update_action_buttons_icon();
	return f.dot;
}, true);

// tanks.dm:52
rt.def("/obj/item/weapon/tank/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.air_contents = (yield* new_(T("/datum/gas_mixture"), this.volume));
	this.air_contents.temperature = T20C;
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
}, true);

// tanks.dm:61
rt.def("/obj/item/weapon/tank/proc/Destroy", function* Destroy(f: Frame) {
	if (this.air_contents) {
		yield* qdel(this.air_contents);
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// tanks.dm:67
rt.def("/obj/item/weapon/tank/proc/examine", function examine(f: Frame, user: Value) {
	let descriptive: Value = null;
	let icon: Value = this;
	parent_proc();
	if (rt.istype(this.loc, T("/obj/item/assembly"))) {
		icon = this.loc;
	}
	if (!(get_dist(this, user) <= 1)) {
		if (icon == this) {
			to_chat(user, "<span class='notice'>If you want any more information you'll need to get closer.</span>");
		}
		return f.dot;
	}
	to_chat(user, `<span class='notice'>The pressure gauge reads ${this.air_contents.return_pressure()} kPa.</span>`);
	let celsius_temperature: Value = this.air_contents.temperature - T0C;
	if (celsius_temperature < 20) {
		descriptive = "cold";
	} else if (celsius_temperature < 40) {
		descriptive = "room temperature";
	} else if (celsius_temperature < 80) {
		descriptive = "lukewarm";
	} else if (celsius_temperature < 100) {
		descriptive = "warm";
	} else if (celsius_temperature < 300) {
		descriptive = "hot";
	} else {
		descriptive = "furiously hot";
	}
	to_chat(user, `<span class='notice'>It feels ${descriptive}.</span>`);
	return f.dot;
}, false);

// tanks.dm:96
rt.def("/obj/item/weapon/tank/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	let location: Value = null;
	if (!(B && B.loc == this.loc)) return f.dot;
	if (!(location = rt.getStep(f, this, 0))) {
		yield* qdel(this);
	}
	if (this.air_contents) {
		yield* location.assume_air(this.air_contents);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// tanks.dm:107
rt.def("/obj/item/weapon/tank/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null;
	disassembled ??= 1;
	if (!disassembled) {
		if (_T = rt.getStep(f, this, 0)) {
			yield* _T.assume_air(this.air_contents);
			this.air_update_turf();
		}
		playsound(this.loc, rt.rsc("sound/effects/spray.ogg"), 10, 1, -3);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// tanks.dm:116
rt.def("/obj/item/weapon/tank/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	let W: Value = null;
	let H: Value = user;
	user.visible_message(`<span class='suicide'>${user} is putting ${this}'s valve to ${user.p_their()} lips! It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
	playsound(this.loc, rt.rsc("sound/effects/spray.ogg"), 10, 1, -3);
	if (!(!H || H.gc_destroyed) && this.air_contents && this.air_contents.return_pressure() >= 1000) {
		for (W of each(H, T("/obj/item"))) {
			yield* H.dropItemToGround(W);
			if (prob(50)) {
				yield* step(W, pick(GLOB.alldirs));
			}
		}
		(rt.modField(f, H, "status_flags", DISFIGURED, rt.bitOr));
		H.bleed_rate = 5;
		yield* H.gib_animation();
		yield* sleep(3);
		yield* H.adjustBruteLoss(1000);
		yield* H.spawn_gibs();
		yield* H.spill_organs();
		yield* H.spread_bodyparts();
	}
	return 1;
}, true);

// tanks.dm:136
rt.def("/obj/item/weapon/tank/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/device/analyzer")) && get_dist(user, this) <= 1) {
		this.atmosanalyzer_scan(this.air_contents, user);
	} else if (rt.istype(W, T("/obj/item/device/assembly_holder"))) {
		yield* this.bomb_assemble(W, user);
	} else {
		f.dot = (yield* parent_proc());
	}
	return f.dot;
}, true);

// tanks.dm:147
rt.def("/obj/item/weapon/tank/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.hands_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "tanks", this.name, 420, 200, master_ui, state))).open();
	return f.dot;
}, true);

// tanks.dm:153
rt.def("/obj/item/weapon/tank/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, C: Value = null;
	let $0: any = (data = list());
	let $1: any = "tankPressure";
	rt.setAt($0, $1, round(this.air_contents.return_pressure() ? this.air_contents.return_pressure() : 0));
	rt.setAt(data, "releasePressure", round(this.distribute_pressure ? this.distribute_pressure : 0));
	rt.setAt(data, "defaultReleasePressure", round(16));
	rt.setAt(data, "minReleasePressure", round(0));
	rt.setAt(data, "maxReleasePressure", round(303.97498));
	if (!rt.istype((C = user), T("/mob/living/carbon"))) {
		C = this.loc.loc;
	}
	if (!rt.istype(C, T("/mob/living/carbon"))) {
		return data;
	}
	if (C.internal == this) {
		rt.setAt(data, "connected", 1);
	}
	return data;
});

// tanks.dm:172
rt.def("/obj/item/weapon/tank/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let pressure: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "pressure") {
		if ((pressure = rt.at(params, "pressure")) == "reset") {
			pressure = 16;
			f.dot = 1;
		} else if (pressure == "min") {
			pressure = 0;
			f.dot = 1;
		} else if (pressure == "max") {
			pressure = 303.97498;
			f.dot = 1;
		} else if (pressure == "input") {
			if ((pressure = (yield* g.op(f, "Prompt", [33], [null, this.distribute_pressure, this.name, `New release pressure (${0}-${303.97498} kPa):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (text2num(pressure) !== null) {
			pressure = text2num(pressure);
			f.dot = 1;
		}
		if (!f.dot) return f.dot;
		this.distribute_pressure = max(0, min(round(pressure), 303.97498));
	}
	return f.dot;
}, true);

// tanks.dm:197
rt.def("/obj/item/weapon/tank/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	return (yield* this.air_contents.remove(amount));
}, true);

// tanks.dm:203
rt.def("/obj/item/weapon/tank/proc/assume_air", function* assume_air(f: Frame, giver: Value) {
	yield* this.air_contents.merge(giver);
	yield* this.check_status();
	return 1;
}, true);

// tanks.dm:209
rt.def("/obj/item/weapon/tank/proc/remove_air_volume", function* remove_air_volume(f: Frame, volume_to_return: Value) {
	let tank_pressure: Value = null, moles_needed: Value = null;
	if (!this.air_contents) {
		return null;
	}
	if ((tank_pressure = this.air_contents.return_pressure()) < this.distribute_pressure) {
		this.distribute_pressure = tank_pressure;
	}
	return (yield* this.remove_air((moles_needed = this.distribute_pressure * volume_to_return / (R_IDEAL_GAS_EQUATION * this.air_contents.temperature))));
}, true);

// tanks.dm:222
rt.def("/obj/item/weapon/tank/proc/process", function* process(f: Frame) {
	yield* this.air_contents.react();
	yield* this.check_status();
	return f.dot;
}, true, { waitfor: false });

// tanks.dm:229
rt.def("/obj/item/weapon/tank/proc/check_status", function* check_status(f: Frame) {
	let pressure: Value = null, range: Value = null, epicenter: Value = null, _T: Value = null, leaked_gas: Value = null;
	if (!this.air_contents) {
		return 0;
	}
	if ((pressure = this.air_contents.return_pressure()) > TANK_FRAGMENT_PRESSURE) {
		if (!rt.istype(this.loc, T("/obj/item/device/transfer_valve"))) {
			message_admins(`Explosive tank rupture! Last key to touch the tank was ${this.fingerprintslast}.`);
			log_game(`Explosive tank rupture! Last key to touch the tank was ${this.fingerprintslast}.`);
		}
		yield* this.air_contents.react();
		yield* this.air_contents.react();
		yield* this.air_contents.react();
		pressure = this.air_contents.return_pressure();
		range = (pressure - TANK_FRAGMENT_PRESSURE) / 607.94995;
		yield* explosion((epicenter = rt.getStep(f, this.loc, 0)), round(range * 0.25), round(range * 0.5), round(range), round(range * 1.5));
		if (rt.istype(this.loc, T("/obj/item/device/transfer_valve"))) {
			yield* qdel(this.loc);
		} else {
			yield* qdel(this);
		}
	} else if (pressure > 3546.375) {
		if (this.integrity <= 0) {
			if (!(_T = rt.getStep(f, this, 0))) {
				return f.dot;
			}
			yield* _T.assume_air(this.air_contents);
			playsound(this.loc, rt.rsc("sound/effects/spray.ogg"), 10, 1, -3);
			yield* qdel(this);
		} else {
			this.integrity--;
		}
	} else if (pressure > 3039.75) {
		if (this.integrity <= 0) {
			if (!(_T = rt.getStep(f, this, 0))) {
				return f.dot;
			}
			leaked_gas = (yield* this.air_contents.remove_ratio(0.25));
			yield* _T.assume_air(leaked_gas);
		} else {
			this.integrity--;
		}
	} else {
		if (!(this.integrity < 3)) return f.dot;
		this.integrity++;
	}
	return f.dot;
}, true);
