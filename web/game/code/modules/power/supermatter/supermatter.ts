// Based on /tg/station's code/modules/power/supermatter/supermatter.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, add, fmt } = rt;


rt.type(10329, "/obj/machinery/power/supermatter_shard", "/obj/machinery/power", {
	gasefficency: 0.125,
	base_icon_state: "darkmatter_shard",
	damage: 0,
	damage_archived: 0,
	safe_alert: "Crystalline hyperstructure returning to safe operating levels.",
	warning_point: 50,
	warning_alert: "Danger! Crystal hyperstructure instability!",
	damage_penalty_point: 550,
	emergency_point: 700,
	emergency_alert: "CRYSTAL DELAMINATION IMMINENT.",
	explosion_point: 900,
	emergency_issued: 0,
	explosion_power: 12,
	temp_factor: 30,
	lastwarning: 0,
	power: 0,
	n2comp: 0,
	freoncomp: 0,
	plasmacomp: 0,
	o2comp: 0,
	co2comp: 0,
	n2ocomp: 0,
	combined_gas: 0,
	gasmix_power_ratio: 0,
	dynamic_heat_modifier: 1,
	dynamic_heat_resistance: 1,
	powerloss_inhibitor: 1,
	powerloss_dynamic_scaling: 0,
	power_transmission_bonus: 0,
	mole_heat_penalty: 0,
	freon_transmit_modifier: 1,
	matter_power: 0,
	config_bullet_energy: 2,
	config_hallucination_power: 0.1,
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_eng"),
	engineering_channel: "Engineering",
	common_channel: null,
	has_been_powered: 0,
	has_reached_emergency: 0,
	takes_damage: 1,
	produces_gas: 1,
	countdown: null,
	anchored: 0,
	light_range: 4,
	name: "supermatter shard",
	desc: "A strangely translucent and iridescent crystal that looks like it used to be part of a larger structure.",
	icon: rt.rsc("icons/obj/supermatter.dmi"),
	icon_state: "darkmatter_shard",
	density: 1,
	resistance_flags: 115,
	critical_machine: 1,
});

// supermatter.dm:138
rt.def("/obj/machinery/power/supermatter_shard/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	GLOB.SSair.atmos_machinery += this;
	this.countdown = (yield* new_(T("/obj/effect/countdown/supermatter"), this));
	yield* this.countdown.start();
	(rt.modGl("poi_list", this, rt.bitOr));
	this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	this.radio.keyslot = (yield* new_(this.radio_key));
	this.radio.listening = 0;
	this.radio.recalculateChannels();
	this.investigate_log("has been created.", "supermatter");
	return f.dot;
}, true);

// supermatter.dm:151
rt.def("/obj/machinery/power/supermatter_shard/proc/Destroy", function* Destroy(f: Frame) {
	this.investigate_log("has been destroyed.", "supermatter");
	GLOB.SSair.atmos_machinery -= this;
	yield* qdel(this.radio);
	this.radio = null;
	GLOB.poi_list -= this;
	yield* qdel(this.countdown);
	this.countdown = null;
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// supermatter.dm:159
rt.def("/obj/machinery/power/supermatter_shard/proc/examine", function examine(f: Frame, user: Value) {
	let H: Value = null;
	parent_proc();
	if (!rt.istype(user, T("/mob/living/carbon/human"))) {
		return f.dot;
	}
	let range: Value = min(7, round(this.power ** 0.25));
	for (H of each(viewers(range, this), T("/mob/living/carbon/human"))) {
		if (H != user) {
			continue;
		}
		if (!rt.istype(H.glasses, T("/obj/item/clothing/glasses/meson"))) {
			to_chat(H, "<span class='danger'>You get headaches just from looking at it.</span>");
		}
		return f.dot;
	}
	return f.dot;
}, false);

// supermatter.dm:172
rt.def("/obj/machinery/power/supermatter_shard/proc/get_spans", function get_spans(f: Frame) {
	return list("robot");
});

// supermatter.dm:177
rt.def("/obj/machinery/power/supermatter_shard/proc/get_status", function get_status(f: Frame) {
	let _T: Value = null, air: Value = null;
	if (!(_T = rt.getStep(f, this, 0))) {
		return SUPERMATTER_ERROR;
	}
	if (!(air = _T.return_air())) {
		return SUPERMATTER_ERROR;
	}
	if (this.get_integrity() < SUPERMATTER_DELAM_PERCENT) {
		return SUPERMATTER_DELAMINATING;
	}
	if (this.get_integrity() < SUPERMATTER_EMERGENCY_PERCENT) {
		return SUPERMATTER_EMERGENCY;
	}
	if (this.get_integrity() < SUPERMATTER_DANGER_PERCENT) {
		return SUPERMATTER_DANGER;
	}
	if (this.get_integrity() < SUPERMATTER_WARNING_PERCENT || air.temperature > CRITICAL_TEMPERATURE) {
		return SUPERMATTER_WARNING;
	}
	if (air.temperature > 8000) {
		return SUPERMATTER_NOTIFY;
	}
	if (this.power > 5) {
		return SUPERMATTER_NORMAL;
	}
	return SUPERMATTER_INACTIVE;
});

// supermatter.dm:204
rt.def("/obj/machinery/power/supermatter_shard/proc/get_integrity", function get_integrity(f: Frame) {
	let integrity: Value = this.damage / this.explosion_point;
	return (integrity = (integrity = round(100 - integrity * 100)) < 0 ? 0 : integrity);
});

// supermatter.dm:210
rt.def("/obj/machinery/power/supermatter_shard/proc/explode", function* explode(f: Frame) {
	let M: Value = null, S: Value = null, E: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.z == this.z) {
			rt.op(f, "Output", [], [M, rt.rsc("sound/magic/charge.ogg")], false);
			to_chat(M, "<span class='boldannounce'>You feel reality distort for a moment...</span>");
		}
	}
	if (this.combined_gas > MOLE_PENALTY_THRESHOLD) {
		this.investigate_log("has collapsed into a singularity.", "supermatter");
		if (_T) {
			(S = (yield* new_(T("/obj/singularity"), _T))).energy = 800;
			yield* S.consume(this);
		}
	} else {
		this.investigate_log("has exploded.", "supermatter");
		yield* explosion(rt.getStep(f, _T, 0), this.explosion_power * max(this.gasmix_power_ratio, 0.205) * 0.5, this.explosion_power * max(this.gasmix_power_ratio, 0.205) + 2, this.explosion_power * max(this.gasmix_power_ratio, 0.205) + 4, this.explosion_power * max(this.gasmix_power_ratio, 0.205) + 6, 1, 1);
		if (this.power > POWER_PENALTY_THRESHOLD) {
			this.investigate_log("has spawned additional energy balls.", "supermatter");
			(E = (yield* new_(T("/obj/singularity/energy_ball"), _T))).energy = this.power;
		}
		yield* qdel(this);
	}
	return f.dot;
}, true);

// supermatter.dm:231
rt.def("/obj/machinery/power/supermatter_shard/proc/process_atmos", function* process_atmos(f: Frame) {
	let _T: Value = null, removed: Value = null, removed_matter: Value = null, l: Value = null, D: Value = null, rads: Value = null, stability: Value = null, mob: Value = null, L: Value = null, H: Value = null, rads_7: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if ((_T = this.loc) === null) {
		return PROCESS_KILL;
	}
	if (!rt.istype(_T, T("/turf"))) {
		return f.dot;
	}
	let env: Value = _T.return_air();
	if (this.produces_gas) {
		removed = (yield* env.remove(this.gasefficency * env.total_moles()));
	} else {
		removed = (yield* new_(T("/datum/gas_mixture")));
	}
	if (!removed || !removed.total_moles() || rt.istype(_T, T("/turf/open/space"))) {
		if (this.takes_damage) {
			this.damage += max((this.power - 1600) / 10, 0);
		}
		return 1;
	}
	this.damage_archived = this.damage;
	if (this.takes_damage) {
		this.damage = max(this.damage + max(removed.temperature - 313.15 * this.dynamic_heat_resistance, 0) * this.mole_heat_penalty / 150 * DAMAGE_INCREASE_MULTIPLIER, 0);
		this.damage = max(this.damage + max(this.power - POWER_PENALTY_THRESHOLD, 0) / 500 * DAMAGE_INCREASE_MULTIPLIER, 0);
		this.damage = max(this.damage + max(this.combined_gas - MOLE_PENALTY_THRESHOLD, 0) / 80 * DAMAGE_INCREASE_MULTIPLIER, 0);
		if (this.combined_gas < MOLE_PENALTY_THRESHOLD) {
			this.damage = max(this.damage + min(removed.temperature - 313.15, 0) / 150, 0);
		}
		this.damage = min(this.damage_archived + DAMAGE_HARDCAP * this.explosion_point, this.damage);
		if (this.damage > this.damage_archived && prob(10)) {
			playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/empulse.ogg"), 50, 1);
		}
	}
	removed.assert_gases("o2", "plasma", "co2", "n2o", "n2", "freon");
	this.combined_gas = max(removed.total_moles(), 0);
	this.plasmacomp = max(rt.index(rt.index(removed.gases, "plasma"), 1) / this.combined_gas, 0);
	this.o2comp = max(rt.index(rt.index(removed.gases, "o2"), 1) / this.combined_gas, 0);
	this.co2comp = max(rt.index(rt.index(removed.gases, "co2"), 1) / this.combined_gas, 0);
	this.n2ocomp = max(rt.index(rt.index(removed.gases, "n2o"), 1) / this.combined_gas, 0);
	this.n2comp = max(rt.index(rt.index(removed.gases, "n2"), 1) / this.combined_gas, 0);
	this.freoncomp = max(rt.index(rt.index(removed.gases, "freon"), 1) / this.combined_gas, 0);
	this.gasmix_power_ratio = min(max(this.plasmacomp + this.o2comp + this.co2comp - this.n2comp - this.freoncomp, 0), 1);
	this.dynamic_heat_modifier = max(this.plasmacomp * PLASMA_HEAT_PENALTY + this.o2comp * OXYGEN_HEAT_PENALTY + this.co2comp * CO2_HEAT_PENALTY + this.n2comp * NITROGEN_HEAT_MODIFIER, 0.5);
	this.dynamic_heat_resistance = max(this.n2ocomp * N2O_HEAT_RESISTANCE, 1);
	this.power_transmission_bonus = max(this.plasmacomp * PLASMA_TRANSMIT_MODIFIER + this.o2comp * OXYGEN_TRANSMIT_MODIFIER, 0);
	this.freon_transmit_modifier = max(1 - this.freoncomp * FREON_TRANSMIT_PENALTY, 0);
	this.mole_heat_penalty = max(this.combined_gas / MOLE_HEAT_PENALTY, 0.25);
	if (this.combined_gas > POWERLOSS_INHIBITION_MOLE_THRESHOLD && this.co2comp > POWERLOSS_INHIBITION_GAS_THRESHOLD) {
		this.powerloss_dynamic_scaling = max(0, min(this.powerloss_dynamic_scaling + max(-0.02, min(this.co2comp - this.powerloss_dynamic_scaling, 0.02)), 1));
	} else {
		this.powerloss_dynamic_scaling = max(0, min(this.powerloss_dynamic_scaling - 0.05, 1));
	}
	this.powerloss_inhibitor = max(0, min(1 - this.powerloss_dynamic_scaling * max(1, min(this.combined_gas / POWERLOSS_INHIBITION_MOLE_BOOST_THRESHOLD, 1.5)), 1));
	if (this.matter_power) {
		removed_matter = max(this.matter_power / MATTER_POWER_CONVERSION, 40);
		this.power = max(this.power + removed_matter, 0);
		this.matter_power = max(this.matter_power - removed_matter, 0);
	}
	let temp_factor: Value = 50;
	if (this.gasmix_power_ratio > 0.8) {
		this.icon_state = `${this.base_icon_state}_glow`;
	} else {
		temp_factor = 30;
		this.icon_state = this.base_icon_state;
	}
	this.power = max(removed.temperature * temp_factor / T0C * this.gasmix_power_ratio + this.power, 0);
	this.transfer_energy();
	let device_energy: Value = this.power * REACTION_POWER_MODIFIER;
	removed.temperature += device_energy * this.dynamic_heat_modifier / THERMAL_RELEASE_MODIFIER;
	removed.temperature = max(0, min(removed.temperature, 2500 * this.dynamic_heat_modifier));
	rt.modAt(rt.index(removed.gases, "plasma"), 1, max(device_energy * this.dynamic_heat_modifier / PLASMA_RELEASE_MODIFIER, 0), add);
	rt.modAt(rt.index(removed.gases, "o2"), 1, max((device_energy + removed.temperature * this.dynamic_heat_modifier - T0C) / OXYGEN_RELEASE_MODIFIER, 0), add);
	if (this.combined_gas < 50) {
		rt.setAt(rt.index(removed.gases, "freon"), 1, max((rt.index(rt.index(removed.gases, "freon"), 1) + device_energy) * this.freoncomp / FREON_BREEDING_MODIFIER, 0));
	}
	if (this.produces_gas) {
		yield* env.merge(removed);
		this.air_update_turf();
	}
	for (l of each(view(this, min(7, round(this.power ** 0.25))), T("/mob/living/carbon/human"))) {
		if (!rt.istype(l.glasses, T("/obj/item/clothing/glasses/meson"))) {
			D = rt.op(f, "Sqrt", [], [1 / max(1, get_dist(l, this))]);
			l.hallucination += this.power * this.config_hallucination_power * D;
			l.hallucination = max(200, min(0, l.hallucination));
		}
	}
	l = null;
	for (l of each(range(this, round((this.power / 100) ** 0.25)), T("/mob/living"))) {
		rads = this.power / 10 * rt.op(f, "Sqrt", [], [1 / max(get_dist(l, this), 1)]);
		yield* l.rad_act(rads);
	}
	if (this.power > POWER_PENALTY_THRESHOLD || this.damage > this.damage_penalty_point) {
		if (this.power > POWER_PENALTY_THRESHOLD) {
			yield* playsound(this.loc, rt.rsc("sound/weapons/emitter2.ogg"), 100, 1, { extrarange: 10 });
			yield* this.supermatter_zap(this, 5, min(this.power * 2, 20000));
			yield* this.supermatter_zap(this, 5, min(this.power * 2, 20000));
			if (this.power > SEVERE_POWER_PENALTY_THRESHOLD) {
				yield* this.supermatter_zap(this, 5, min(this.power * 2, 20000));
				if (this.power > CRITICAL_POWER_PENALTY_THRESHOLD) {
					yield* this.supermatter_zap(this, 5, min(this.power * 2, 20000));
				}
			}
		} else if (this.damage > this.damage_penalty_point && prob(20)) {
			yield* playsound(this.loc, rt.rsc("sound/weapons/emitter2.ogg"), 100, 1, { extrarange: 10 });
			yield* this.supermatter_zap(this, 5, max(4000, min(this.power * 2, 20000)));
		}
		if (prob(15) && this.power > POWER_PENALTY_THRESHOLD) {
			yield* this.supermatter_pull(this, this.power / 750);
		}
		if (prob(5)) {
			yield* this.supermatter_anomaly_gen(this, "flux_anomaly", rand(5, 10));
		}
		if (this.power > SEVERE_POWER_PENALTY_THRESHOLD && prob(5) || prob(1)) {
			yield* this.supermatter_anomaly_gen(this, "gravitational_anomaly", rand(5, 10));
		}
		if (this.power > SEVERE_POWER_PENALTY_THRESHOLD && prob(2) || prob(0.3) && this.power > POWER_PENALTY_THRESHOLD) {
			yield* this.supermatter_anomaly_gen(this, "pyro_anomaly", rand(5, 10));
		}
	}
	if (this.damage > this.warning_point) {
		$0 = rt.world().timeofday;
		$1 = 864000;
		if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
			$2 = update_midnight_rollover();
		} else {
			$2 = GLOB.midnight_rollovers;
		}
		if (($0 + $1 * $2 - this.lastwarning) / 10 >= WARNING_DELAY) {
			stability = num2text(round(this.damage / this.explosion_point * 100));
			if (this.damage > this.emergency_point) {
				yield* this.radio.talk_into(this, `${this.emergency_alert} Instability: ${stability}%`, this.common_channel, this.get_spans(), (yield* this.get_default_language()));
				$0 = rt.world().timeofday;
				$1 = 864000;
				if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
					$2 = update_midnight_rollover();
				} else {
					$2 = GLOB.midnight_rollovers;
				}
				this.lastwarning = $0 + $1 * $2;
				if (!this.has_reached_emergency) {
					this.investigate_log("has reached the emergency point for the first time.", "supermatter");
					message_admins(`${this} has reached the emergency point ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}.`);
					this.has_reached_emergency = 1;
				}
			} else if (this.damage >= this.damage_archived) {
				yield* this.radio.talk_into(this, `${this.warning_alert} Instability: ${stability}%`, this.engineering_channel, this.get_spans(), (yield* this.get_default_language()));
				$0 = rt.world().timeofday;
				$1 = 864000;
				if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
					$2 = update_midnight_rollover();
				} else {
					$2 = GLOB.midnight_rollovers;
				}
				this.lastwarning = $0 + $1 * $2 - 300;
			} else {
				yield* this.radio.talk_into(this, `${this.safe_alert} Instability: ${stability}%`, this.engineering_channel, this.get_spans(), (yield* this.get_default_language()));
				$0 = rt.world().timeofday;
				$1 = 864000;
				if (GLOB.rollovercheck_last_timeofday != rt.world().timeofday) {
					$2 = update_midnight_rollover();
				} else {
					$2 = GLOB.midnight_rollovers;
				}
				this.lastwarning = $0 + $1 * $2;
			}
			if (this.power > POWER_PENALTY_THRESHOLD) {
				yield* this.radio.talk_into(this, "Warning: Hyperstructure has reached dangerous power level.", this.engineering_channel, this.get_spans(), (yield* this.get_default_language()));
				if (this.powerloss_inhibitor < 0.5) {
					yield* this.radio.talk_into(this, "DANGER: CHARGE INERTIA CHAIN REACTION IN PROGRESS.", this.engineering_channel, this.get_spans(), (yield* this.get_default_language()));
				}
			}
			if (this.combined_gas > MOLE_PENALTY_THRESHOLD) {
				yield* this.radio.talk_into(this, "Warning: Critical coolant mass reached.", this.engineering_channel, this.get_spans(), (yield* this.get_default_language()));
			}
		}
		if (this.damage > this.explosion_point) {
			for (mob of each(GLOB.living_mob_list)) {
				if (rt.istype((L = mob), T("/mob/living")) && L.z == this.z) {
					if (rt.istype(mob, T("/mob/living/carbon/human"))) {
						(H = mob).hallucination += max(50, min(300, DETONATION_HALLUCINATION * rt.op(f, "Sqrt", [], [1 / (get_dist(mob, this) + 1)])));
					}
					rads_7 = DETONATION_RADS * rt.op(f, "Sqrt", [], [1 / (get_dist(L, this) + 1)]);
					yield* L.rad_act(rads_7);
				}
			}
			yield* this.explode();
		}
	}
	this.power -= (this.power / 500) ** 3 * this.powerloss_inhibitor;
	return 1;
}, true);

// supermatter.dm:428
rt.def("/obj/machinery/power/supermatter_shard/proc/bullet_act", function bullet_act(f: Frame, Proj: Value) {
	let L: Value = null;
	if (!rt.istype((L = this.loc), T("/turf")) || rt.istype(L, T("/turf/open/space"))) {
		return 0;
	}
	if (!rt.istype(Proj.firer, T("/obj/machinery/power/emitter"))) {
		this.investigate_log(`has been hit by ${Proj} fired by ${Proj.firer}`, "supermatter");
	}
	if (Proj.flag != "bullet") {
		this.power += Proj.damage * this.config_bullet_energy;
		if (!this.has_been_powered) {
			this.investigate_log("has been powered for the first time.", "supermatter");
			message_admins(`${this} has been powered for the first time ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}.`);
			this.has_been_powered = 1;
		}
	} else if (this.takes_damage) {
		this.damage += Proj.damage * this.config_bullet_energy;
	}
	return 0;
});

// supermatter.dm:446
rt.def("/obj/machinery/power/supermatter_shard/proc/singularity_act", function* singularity_act(f: Frame) {
	let M: Value = null;
	let gain: Value = 100;
	this.investigate_log("Supermatter shard consumed by singularity.", "singulo");
	message_admins("Singularity has consumed a supermatter shard and can now become stage six.");
	this.visible_message(`<span class='userdanger'>${this} is consumed by the singularity!</span>`);
	for (M of each(GLOB.mob_list, T("/mob"))) {
		if (M.z == this.z) {
			rt.op(f, "Output", [], [M, rt.rsc("sound/effects/supermatter.ogg")], false);
			to_chat(M, "<span class='boldannounce'>A horrible screeching fills your ears, and a wave of dread washes over you...</span>");
		}
	}
	yield* qdel(this);
	return gain;
}, true);

// supermatter.dm:457
rt.def("/obj/machinery/power/supermatter_shard/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!(B && !rt.istype(this.loc, T("/turf/open/space")))) return f.dot;
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	this.damage += B.obj_integrity * 0.5;
	if (B.obj_integrity > 100) {
		B.visible_message(fmt("<span class='danger'>＄！ strikes at ％！ and flinches away!</span>", [B, this]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
		yield* B.take_damage(100, "fire");
	} else {
		B.visible_message(fmt("<span class='danger'>＄！ strikes at ％！ and rapidly flashes to ash.</span>", [B, this]), "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
		yield* this.Consume(B);
	}
	return f.dot;
}, true);

// supermatter.dm:470
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	let C: Value = null, rip_u: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon"))) return f.dot;
	to_chat((C = user), "<span class='userdanger'>That was a really dumb idea.</span>");
	yield* (rip_u = C.get_bodypart("head")).dismember("fire");
	return f.dot;
}, true);

// supermatter.dm:477
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// supermatter.dm:481
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_robot", function* attack_robot(f: Frame, user: Value) {
	if (this.Adjacent(user)) {
		return (yield* this.attack_hand(user));
	}
	to_chat(user, "<span class='warning'>You attempt to interface with the control circuits but find they are not connected to your network. Maybe in a future firmware update.</span>");
	return f.dot;
}, true);

// supermatter.dm:487
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	to_chat(user, "<span class='warning'>You attempt to interface with the control circuits but find they are not connected to your network. Maybe in a future firmware update.</span>");
	return f.dot;
});

// supermatter.dm:490
rt.def("/obj/machinery/power/supermatter_shard/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	user.visible_message(fmt("<span class='danger'>＄！ reaches out and touches ％！, inducing a resonance... ＀ body starts to glow and bursts into flames before flashing into ash.</span>", [user, this, user.p_their()]), fmt("<span class='userdanger'>You reach out and touch ％！. Everything starts burning and all you can hear is ringing. Your last thought is \"That was not a wise decision.\"</span>", [this]), "<span class='italics'>You hear an unearthly noise as a wave of heat washes over you.</span>");
	this.investigate_log(`has been attacked (hand) by ${user}`, "supermatter");
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	yield* this.Consume(user);
	return f.dot;
}, true);

// supermatter.dm:501
rt.def("/obj/machinery/power/supermatter_shard/proc/transfer_energy", function transfer_energy(f: Frame) {
	let R: Value = null;
	for (R of each(GLOB.rad_collectors, T("/obj/machinery/power/rad_collector"))) {
		if (R.z == this.z && get_dist(R, this) <= 15) {
			R.receive_pulse(this.power * (1 + this.power_transmission_bonus) / 10 * this.freon_transmit_modifier);
		}
	}
	return f.dot;
});

// supermatter.dm:506
rt.def("/obj/machinery/power/supermatter_shard/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!rt.istype(W, T("/obj/item")) || rt.bitAnd(W.flags, ABSTRACT) || !rt.istype(user, T("/mob/living"))) {
		return f.dot;
	}
	if (rt.istype(W, T("/obj/item/weapon/scalpel/supermatter"))) {
		playsound(this, W.usesound, 100, 1);
		to_chat(user, fmt("<span class='notice'>You carefully begin to scrape ％！ with ％！...</span>", [this, W]));
		if (yield* do_after(user, 60 * W.toolspeed, 1, this)) {
			to_chat(user, fmt("<span class='notice'>You extract a sliver from ％！. ＄！ begins to react violently!</span>", [this, this]));
			yield* new_(T("/obj/item/nuke_core/supermatter_sliver"), user.loc);
			this.matter_power += 200;
		}
	} else {
		if (!(yield* user.dropItemToGround(W))) return f.dot;
		user.visible_message(fmt("<span class='danger'>As ＀ touches ％！ with ＇！, silence fills the room...</span>", [user, this, W]), fmt("<span class='userdanger'>You touch ％！ with ％！, and everything suddenly goes silent.</span>\n<span class='notice'>＄！ flashes into dust as you flinch away from ％！.</span>", [this, W, W, this]), "<span class='italics'>Everything suddenly goes silent.</span>");
		this.investigate_log(`has been attacked (${W}) by ${user}`, "supermatter");
		yield* this.Consume(W);
		playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
		yield* radiation_pulse(rt.getStep(f, this, 0), 1, 1, 150, 1);
	}
	return f.dot;
}, true);

// supermatter.dm:527
rt.def("/obj/machinery/power/supermatter_shard/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	if (rt.istype(AM, T("/mob/living"))) {
		AM.visible_message(fmt("<span class='danger'>＄！ slams into ％！ inducing a resonance... ＀ body starts to glow and catch flame before flashing into ash.</span>", [AM, this, AM.p_their()]), fmt("<span class='userdanger'>You slam into ％！ as your ears are filled with unearthly ringing. Your last thought is \"Oh, fuck.\"</span>", [this]), "<span class='italics'>You hear an unearthly noise as a wave of heat washes over you.</span>");
	} else if (rt.istype(AM, T("/obj")) && !rt.istype(AM, T("/obj/effect"))) {
		AM.visible_message(fmt("<span class='danger'>＄！ smacks into ％！ and rapidly flashes to ash.</span>", [AM, this]), null, "<span class='italics'>You hear a loud crack as you are washed with a wave of heat.</span>");
	} else {
		return f.dot;
	}
	playsound(rt.getStep(f, this, 0), rt.rsc("sound/effects/supermatter.ogg"), 50, 1);
	yield* this.Consume(AM);
	return f.dot;
}, true);

// supermatter.dm:542
rt.def("/obj/machinery/power/supermatter_shard/proc/Consume", function* Consume(f: Frame, AM: Value) {
	let user: Value = null, L: Value = null;
	if (rt.istype(AM, T("/mob/living"))) {
		user = AM;
		message_admins(`${this} has consumed ${key_name_admin(user)} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}.`);
		this.investigate_log(`has consumed ${key_name(user)}.`, "supermatter");
		yield* user.dust();
		this.matter_power += 200;
	} else if (rt.istype(AM, T("/obj/singularity"))) {
		return f.dot;
	} else if (rt.istype(AM, T("/obj")) && !rt.istype(AM, T("/obj/effect"))) {
		this.investigate_log(`has consumed ${AM}.`, "supermatter");
		yield* qdel(AM);
	}
	this.matter_power += 200;
	yield* radiation_pulse(rt.getStep(f, this, 0), 4, 10, 500, 1);
	for (L of each(range(10), T("/mob/living"))) {
		this.investigate_log(`has irradiated ${L} after consuming ${AM}.`, "supermatter");
		if (rt.isIn(f, L, view())) {
			L.show_message(fmt("<span class='danger'>As ％！ slowly stops resonating, you find your skin covered in new radiation burns.</span>", [this]), 1, "<span class='danger'>The unearthly ringing subsides and you notice you have new radiation burns.</span>", 2);
		} else {
			L.show_message("<span class='italics'>You hear an uneartly ringing and notice your skin is covered in fresh radiation burns.</span>", 2);
		}
	}
	return f.dot;
}, true);

// supermatter.dm:582
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_pull", function* supermatter_pull(f: Frame, center: Value, pull_range: Value) {
	let _P: Value = null, pulled_object: Value = null, H: Value = null;
	pull_range ??= 10;
	yield* playsound(this.loc, rt.rsc("sound/weapons/marauder.ogg"), 100, 1, { extrarange: 7 });
	for (_P of each(orange(pull_range, center), T("/atom"))) {
		if (rt.istype(_P, T("/atom/movable"))) {
			pulled_object = _P;
			if (rt.istype(_P, T("/mob/living/carbon/human"))) {
				yield* (H = _P).apply_effect(40, "knockdown", 0);
			}
			if (pulled_object && !pulled_object.anchored && !rt.istype(_P, T("/mob/living/carbon/human"))) {
				yield* step_towards(pulled_object, center);
				yield* step_towards(pulled_object, center);
				yield* step_towards(pulled_object, center);
				yield* step_towards(pulled_object, center);
			}
		}
	}
	return f.dot;
}, true);

// supermatter.dm:596
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_anomaly_gen", function* supermatter_anomaly_gen(f: Frame, anomalycenter: Value, type: Value, anomalyrange: Value) {
	let L: Value = null, A: Value = null;
	type ??= "flux_anomaly";
	anomalyrange ??= 5;
	if (!(L = pick(orange(anomalyrange, anomalycenter)))) return f.dot;
	if (type === "flux_anomaly") {
		(A = (yield* new_(T("/obj/effect/anomaly/flux"), L, 300))).explosive = 0;
	} else if (type === "gravitational_anomaly") {
		yield* new_(T("/obj/effect/anomaly/grav"), L, 250);
	} else if (type === "pyro_anomaly") {
		yield* new_(T("/obj/effect/anomaly/pyro"), L, 200);
	}
	return f.dot;
}, true);

// supermatter.dm:609
rt.def("/obj/machinery/power/supermatter_shard/proc/supermatter_zap", function* supermatter_zap(f: Frame, zapstart: Value, range: Value, power: Value) {
	let target_atom: Value = null, target_mob: Value = null, target_machine: Value = null, target_structure: Value = null, Z: Value = null, H: Value = null, A: Value = null, X: Value = null, M: Value = null, Y: Value = null, O: Value = null, zapdir: Value = null;
	range ??= 3;
	f.dot = zapstart.dir;
	if (power < 1000) {
		return f.dot;
	}
	let arctargetsmob: Value = list();
	let arctargetsmachine: Value = list();
	let arctargetsstructure: Value = list();
	if (prob(20)) {
		for (Z of each(oview(zapstart, range + 2), T("/mob/living"))) {
			arctargetsmob += Z;
		}
	}
	if (rt.len(f, arctargetsmob)) {
		H = pick(arctargetsmob);
		A = H;
		target_mob = H;
		target_atom = A;
	} else {
		for (X of each(oview(zapstart, range + 2), T("/obj/machinery"))) {
			arctargetsmachine += X;
		}
		if (rt.len(f, arctargetsmachine)) {
			M = pick(arctargetsmachine);
			A = M;
			target_machine = M;
			target_atom = A;
		} else {
			for (Y of each(oview(zapstart, range + 2), T("/obj/structure"))) {
				arctargetsstructure += Y;
			}
			if (rt.len(f, arctargetsstructure)) {
				O = pick(arctargetsstructure);
				A = O;
				target_structure = O;
				target_atom = A;
			}
		}
	}
	if (target_atom) {
		yield* zapstart.Beam(target_atom, { icon_state: "nzcrentrs_power", time: 5 });
		if (zapdir = rt.getDir(f, zapstart, target_atom)) {
			f.dot = zapdir;
		}
	}
	if (target_mob) {
		yield* target_mob.electrocute_act(rand(5, 10), "Supermatter Discharge Bolt", 1, { stun: 0 });
		if (prob(15)) {
			yield* this.supermatter_zap(target_mob, 5, power / 2);
			yield* this.supermatter_zap(target_mob, 5, power / 2);
		} else {
			yield* this.supermatter_zap(target_mob, 5, power / 1.5);
		}
	} else if (target_machine) {
		if (prob(15)) {
			yield* this.supermatter_zap(target_machine, 5, power / 2);
			yield* this.supermatter_zap(target_machine, 5, power / 2);
		} else {
			yield* this.supermatter_zap(target_machine, 5, power / 1.5);
		}
	} else {
		if (!target_structure) return f.dot;
		if (prob(15)) {
			yield* this.supermatter_zap(target_structure, 5, power / 2);
			yield* this.supermatter_zap(target_structure, 5, power / 2);
		} else {
			yield* this.supermatter_zap(target_structure, 5, power / 1.5);
		}
	}
	return f.dot;
}, true);
