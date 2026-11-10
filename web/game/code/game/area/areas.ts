// Based on /tg/station's code/game/area/areas.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g } = rt;


// areas.dm:68
rt.def("/datum/controller/global_vars/proc/InitGlobalteleportlocs", function InitGlobalteleportlocs(f: Frame) {
	GLOB.teleportlocs = list();
	this.gvars_datum_init_order += "teleportlocs";
	return f.dot;
});

// areas.dm:71
rt.def("/proc/process_teleport_locs", function* process_teleport_locs(f: Frame) {
	let V: Value = null, AR: Value = null, picked: Value = null;
	for (V of each(GLOB.sortedAreas)) {
		if (rt.istype((AR = V), T("/area/shuttle")) || AR.noteleport) {
			continue;
		}
		if (rt.index(GLOB.teleportlocs, AR.name)) {
			continue;
		}
		if ((picked = safepick(get_area_turfs(AR.type))) && picked.z == ZLEVEL_STATION) {
			rt.setAt(GLOB.teleportlocs, AR.name, AR);
		}
	}
	yield* sortTim(GLOB.teleportlocs, P("/proc/cmp_text_dsc"));
	return f.dot;
}, true);

// areas.dm:92
rt.def("/proc/area_contents", function area_contents(f: Frame, A: Value) {
	let LSA: Value = null;
	if (!rt.istype(A, T("/area"))) {
		return null;
	}
	let contents: Value = list();
	for (LSA of each(A.related, T("/area"))) {
		contents += LSA.contents;
	}
	return contents;
});

// areas.dm:102
rt.def("/area/proc/Initialize", function* Initialize(f: Frame) {
	this.icon_state = "";
	this.layer = AREA_LAYER;
	this.uid = rt.incGl("global_uid", 1, false);
	this.related = list(this);
	this.map_name = this.name;
	if (this.requires_power) {
		this.luminosity = 0;
	} else {
		this.power_light = DYNAMIC_LIGHTING_ENABLED;
		this.power_equip = DYNAMIC_LIGHTING_ENABLED;
		this.power_environ = DYNAMIC_LIGHTING_ENABLED;
		if (this.dynamic_lighting == DYNAMIC_LIGHTING_FORCED) {
			this.dynamic_lighting = DYNAMIC_LIGHTING_ENABLED;
			this.luminosity = DYNAMIC_LIGHTING_DISABLED;
		} else if (this.dynamic_lighting != DYNAMIC_LIGHTING_IFSTARLIGHT) {
			this.dynamic_lighting = DYNAMIC_LIGHTING_DISABLED;
		}
	}
	if (this.dynamic_lighting == DYNAMIC_LIGHTING_IFSTARLIGHT) {
		this.dynamic_lighting = GLOB.config.starlight ? DYNAMIC_LIGHTING_ENABLED : DYNAMIC_LIGHTING_DISABLED;
	}
	yield* parent_proc();
	yield* this.power_change();
	this.blend_mode = 4;
	if (this.dynamic_lighting) return f.dot;
	this.add_overlay(T("/obj/effect/fullbright"));
	return f.dot;
}, true);

// areas.dm:133
rt.def("/area/proc/Destroy", function* Destroy(f: Frame) {
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return (yield* parent_proc());
}, true);

// areas.dm:137
rt.def("/area/proc/poweralert", function poweralert(f: Frame, state: Value, source: Value) {
	let C: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null;
	if (state == this.poweralm) return f.dot;
	this.poweralm = state;
	if (!rt.istype(source, T("/obj"))) return f.dot;
	let cameras: Value = list();
	for (C of each(this, T("/obj/machinery/camera"))) {
		cameras += C;
	}
	for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
		if (state == 1) {
			aiPlayer.cancelAlarm("Power", this, source);
		} else {
			aiPlayer.triggerAlarm("Power", this, cameras, source);
		}
	}
	for (a of each(GLOB.machines, T("/obj/machinery/computer/station_alert"))) {
		if (state == 1) {
			a.cancelAlarm("Power", this, source);
		} else {
			a.triggerAlarm("Power", this, cameras, source);
		}
	}
	for (D of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
		if (state == 1) {
			D.cancelAlarm("Power", this, source);
		} else {
			D.triggerAlarm("Power", this, cameras, source);
		}
	}
	for (p of each(GLOB.alarmdisplay, T("/datum/computer_file/program/alarm_monitor"))) {
		if (state == 1) {
			p.cancelAlarm("Power", this, source);
		} else {
			p.triggerAlarm("Power", this, cameras, source);
		}
	}
	return f.dot;
});

// areas.dm:167
rt.def("/area/proc/atmosalert", function atmosalert(f: Frame, danger_level: Value, source: Value) {
	let cameras: Value = null, RA: Value = null, C: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null, aiPlayer_0: Value = null, a_0: Value = null, D_0: Value = null, p_0: Value = null;
	if (danger_level != this.atmosalm) {
		if (danger_level == 2) {
			cameras = list();
			for (RA of each(this.related, T("/area"))) {
				C = null;
				for (C of each(RA, T("/obj/machinery/camera"))) {
					cameras += C;
				}
			}
			for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
				aiPlayer.triggerAlarm("Atmosphere", this, cameras, source);
			}
			for (a of each(GLOB.machines, T("/obj/machinery/computer/station_alert"))) {
				a.triggerAlarm("Atmosphere", this, cameras, source);
			}
			for (D of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
				D.triggerAlarm("Atmosphere", this, cameras, source);
			}
			for (p of each(GLOB.alarmdisplay, T("/datum/computer_file/program/alarm_monitor"))) {
				p.triggerAlarm("Atmosphere", this, cameras, source);
			}
		} else if (this.atmosalm == 2) {
			for (aiPlayer_0 of each(GLOB.player_list, T("/mob/living/silicon"))) {
				aiPlayer_0.cancelAlarm("Atmosphere", this, source);
			}
			for (a_0 of each(GLOB.machines, T("/obj/machinery/computer/station_alert"))) {
				a_0.cancelAlarm("Atmosphere", this, source);
			}
			for (D_0 of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
				D_0.cancelAlarm("Atmosphere", this, source);
			}
			for (p_0 of each(GLOB.alarmdisplay, T("/datum/computer_file/program/alarm_monitor"))) {
				p_0.cancelAlarm("Atmosphere", this, source);
			}
		}
		this.atmosalm = danger_level;
		return 1;
	}
	return 0;
});

// areas.dm:200
rt.def("/area/proc/ModifyFiredoors", function ModifyFiredoors(f: Frame, opening: Value) {
	let FD: Value = null, D: Value = null, cont: Value = null, I: Value = null, A: Value = null;
	let $0: any, $1: any, $e: any;
	if (!this.firedoors) return f.dot;
	this.firedoors_last_closed_on = rt.worldTime(f);
	for (FD of each(this.firedoors)) {
		D = FD;
		if ((cont = (!D.welded ? 1 : 0)) && opening) {
			I = null;
			for (I of each(D.affecting_areas)) {
				if ((A = I).fire) {
					cont = 0;
					break;
				}
			}
		}
		if (cont && D.is_operational()) {
			if (D.operating) {
				$0 = D;
				if (opening) {
					$1 = 1;
				} else {
					$1 = 2;
				}
				$0.nextstate = $1;
			} else if (!rt.bitXor(D.density, opening)) {
				$0 = D;
				if (opening) {
					$1 = P("/obj/machinery/door/firedoor/proc/open");
				} else {
					$1 = P("/obj/machinery/door/firedoor/proc/close");
				}
				ImmediateInvokeAsync($0, $1);
			}
		}
	}
	return f.dot;
});

// areas.dm:216
rt.def("/area/proc/firealert", function firealert(f: Frame, source: Value) {
	let RA: Value = null, F: Value = null, C: Value = null, a: Value = null, aiPlayer: Value = null, D: Value = null, p: Value = null;
	if (this.always_unpowered == 1) {
		return f.dot;
	}
	let cameras: Value = list();
	for (RA of each(this.related, T("/area"))) {
		if (!RA.fire) {
			RA.set_fire_alarm_effect();
			RA.ModifyFiredoors(0);
			F = null;
			for (F of each(RA, T("/obj/machinery/firealarm"))) {
				F.update_icon();
			}
		}
		C = null;
		for (C of each(RA, T("/obj/machinery/camera"))) {
			cameras += C;
		}
	}
	for (a of each(GLOB.machines, T("/obj/machinery/computer/station_alert"))) {
		a.triggerAlarm("Fire", this, cameras, source);
	}
	for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
		aiPlayer.triggerAlarm("Fire", this, cameras, source);
	}
	for (D of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
		D.triggerAlarm("Fire", this, cameras, source);
	}
	for (p of each(GLOB.alarmdisplay, T("/datum/computer_file/program/alarm_monitor"))) {
		p.triggerAlarm("Fire", this, cameras, source);
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// areas.dm:242
rt.def("/area/proc/firereset", function firereset(f: Frame, source: Value) {
	let RA: Value = null, F: Value = null, aiPlayer: Value = null, a: Value = null, D: Value = null, p: Value = null;
	for (RA of each(this.related, T("/area"))) {
		if (RA.fire) {
			RA.fire = 0;
			RA.mouse_opacity = 0;
			RA.updateicon();
			RA.ModifyFiredoors(1);
			F = null;
			for (F of each(RA, T("/obj/machinery/firealarm"))) {
				F.update_icon();
			}
		}
	}
	for (aiPlayer of each(GLOB.player_list, T("/mob/living/silicon"))) {
		aiPlayer.cancelAlarm("Fire", this, source);
	}
	for (a of each(GLOB.machines, T("/obj/machinery/computer/station_alert"))) {
		a.cancelAlarm("Fire", this, source);
	}
	for (D of each(GLOB.mob_list, T("/mob/living/simple_animal/drone"))) {
		D.cancelAlarm("Fire", this, source);
	}
	for (p of each(GLOB.alarmdisplay, T("/datum/computer_file/program/alarm_monitor"))) {
		p.cancelAlarm("Fire", this, source);
	}
	this.isprocessing = 0;
	GLOB.SSobj.processing -= this;
	return f.dot;
});

// areas.dm:263
rt.def("/area/proc/process", function process(f: Frame) {
	let RA: Value = null;
	if (!(this.firedoors_last_closed_on + 100 < rt.worldTime(f))) return f.dot;
	for (RA of each(this.related, T("/area"))) {
		RA.ModifyFiredoors(0);
	}
	return f.dot;
}, false, { waitfor: false });

// areas.dm:269
rt.def("/area/proc/close_and_lock_door", function* close_and_lock_door(f: Frame, DOOR: Value) {
	yield* DOOR.close();
	if (!DOOR.density) return f.dot;
	DOOR.lock();
	return f.dot;
}, true, { waitfor: false });

// areas.dm:274
rt.def("/area/proc/burglaralert", function* burglaralert(f: Frame, trigger: Value) {
	let RA: Value = null, DOOR: Value = null, C: Value = null, SILICON: Value = null;
	if (this.always_unpowered == 1) {
		return f.dot;
	}
	let cameras: Value = list();
	for (RA of each(this.related, T("/area"))) {
		RA.set_fire_alarm_effect();
		DOOR = null;
		for (DOOR of each(RA, T("/obj/machinery/door"))) {
			yield* this.close_and_lock_door(DOOR);
		}
		C = null;
		for (C of each(RA, T("/obj/machinery/camera"))) {
			cameras += C;
		}
	}
	for (SILICON of each(GLOB.player_list, T("/mob/living/silicon"))) {
		if (SILICON.triggerAlarm("Burglar", this, cameras, trigger)) {
			yield* addtimer((yield* new_(T("/datum/callback"), SILICON, P("/mob/living/silicon/proc/cancelAlarm"), "Burglar", this, trigger)), 600);
		}
	}
	return f.dot;
}, true);

// areas.dm:295
rt.def("/area/proc/set_fire_alarm_effect", function set_fire_alarm_effect(f: Frame) {
	this.fire = 1;
	this.updateicon();
	this.mouse_opacity = 0;
	return f.dot;
});

// areas.dm:311
rt.def("/area/proc/partyalert", function partyalert(f: Frame) {
	if (this.name == "Space") {
		return f.dot;
	}
	if (this.party) return f.dot;
	this.party = 1;
	this.updateicon();
	this.mouse_opacity = 0;
	return f.dot;
});

// areas.dm:319
rt.def("/area/proc/partyreset", function partyreset(f: Frame) {
	let D: Value = null;
	if (!this.party) return f.dot;
	this.party = 0;
	this.mouse_opacity = 0;
	this.updateicon();
	for (D of each(this, T("/obj/machinery/door/firedoor"))) {
		if (!D.welded) {
			if (D.operating) {
				D.nextstate = 1;
			} else if (D.density) {
				ImmediateInvokeAsync(D, P("/obj/machinery/door/firedoor/proc/open"));
			}
		}
	}
	return f.dot;
});

// areas.dm:331
rt.def("/area/proc/updateicon", function updateicon(f: Frame) {
	if ((this.fire || this.eject || this.party) && (!this.requires_power || this.power_environ)) {
		if (this.fire && !this.eject && !this.party) {
			this.icon_state = "blue";
		} else if (!this.fire && this.eject && !this.party) {
			this.icon_state = "red";
		} else if (this.party && !this.fire && !this.eject) {
			this.icon_state = "party";
		} else {
			this.icon_state = "blue-red";
		}
	} else {
		this.icon_state = null;
	}
	return f.dot;
});

rt.type(13103, "/area/space", "/area", {
	requires_power: 1,
	always_unpowered: 1,
	power_light: 0,
	power_equip: 0,
	power_environ: 0,
	valid_territory: 0,
	outdoors: 1,
	ambientsounds: null,
	blob_allowed: 0,
	icon_state: "space",
	dynamic_lighting: 0,
});

// areas.dm:344
rt.def("/area/space/proc/updateicon", function updateicon(f: Frame) {
	this.icon_state = null;
	return f.dot;
});

// areas.dm:354
rt.def("/area/proc/powered", function powered(f: Frame, chan: Value) {
	if (!this.requires_power) {
		return 1;
	}
	if (this.always_unpowered) {
		return 0;
	}
	if (chan === 1) {
		return this.power_equip;
	} else if (chan === 2) {
		return this.power_light;
	} else if (chan === 3) {
		return this.power_environ;
	}
	return 0;
});

// areas.dm:374
rt.def("/area/proc/power_change", function* power_change(f: Frame) {
	let RA: Value = null, M: Value = null;
	for (RA of each(this.related, T("/area"))) {
		M = null;
		for (M of each(RA, T("/obj/machinery"))) {
			yield* M.power_change();
		}
		RA.updateicon();
	}
	return f.dot;
}, true);

// areas.dm:381
rt.def("/area/proc/usage", function usage(f: Frame, chan: Value) {
	let used: Value = 0;
	if (chan === 2) {
		used += this.used_light;
	} else if (chan === 1) {
		used += this.used_equip;
	} else if (chan === 3) {
		used += this.used_environ;
	} else if (chan === TOTAL) {
		used += this.used_light + this.used_equip + this.used_environ;
	} else if (chan === 5) {
		used += this.static_equip;
	} else if (chan === 6) {
		used += this.static_light;
	} else if (chan === 7) {
		used += this.static_environ;
	}
	return used;
});

// areas.dm:399
rt.def("/area/proc/addStaticPower", function addStaticPower(f: Frame, value: Value, powerchannel: Value) {
	if (powerchannel === 5) {
		this.static_equip += value;
	} else if (powerchannel === 6) {
		this.static_light += value;
	} else if (powerchannel === 7) {
		this.static_environ += value;
	}
	return f.dot;
});

// areas.dm:414
rt.def("/area/proc/use_power", function use_power(f: Frame, amount: Value, chan: Value) {
	if (chan === 1) {
		this.used_equip += amount;
	} else if (chan === 2) {
		this.used_light += amount;
	} else if (chan === 3) {
		this.used_environ += amount;
	}
	return f.dot;
});

// areas.dm:425
rt.def("/area/proc/Entered", function* Entered(f: Frame, A: Value) {
	let L: Value = null;
	if (!rt.istype(A, T("/mob/living"))) {
		return f.dot;
	}
	if (!(L = A).ckey) {
		return f.dot;
	}
	if (L.client && !L.client.ambience_playing && rt.bitAnd(L.client.prefs.toggles, 256)) {
		L.client.ambience_playing = 1;
		rt.op(f, "Output", [], [L, (yield* g.call(f, P("/proc/sound"), null, [null, rt.rsc("sound/ambience/shipambience.ogg"), "repeat", 1, "wait", 0, "volume", 35, "channel", 2], rt.Args.Named))], false);
	}
	if (!(L.client && rt.bitAnd(L.client.prefs.toggles, 4))) {
		return f.dot;
	}
	if (!prob(35)) return f.dot;
	let sound: Value = pick(this.ambientsounds);
	if (L.client.played) return f.dot;
	rt.op(f, "Output", [], [L, (yield* g.call(f, P("/proc/sound"), null, [null, sound, "repeat", 0, "wait", 0, "volume", 25, "channel", 1], rt.Args.Named))], false);
	L.client.played = 1;
	yield* sleep(600);
	if (!(L && L.client)) return f.dot;
	L.client.played = 0;
	return f.dot;
}, true, { waitfor: false });

// areas.dm:451
rt.def("/atom/proc/has_gravity", function has_gravity(f: Frame, _T: Value) {
	if (!_T || !isturf(_T)) {
		_T = rt.getStep(f, this, 0);
	}
	let A: Value = get_area(_T);
	if (rt.istype(_T, T("/turf/open/space"))) {
		return 0;
	} else if (A && A.has_gravity) {
		return 1;
	} else if (_T && rt.index(GLOB.gravity_generators, `${_T.z}`) && rt.length(rt.index(GLOB.gravity_generators, `${_T.z}`))) {
		return 1;
	}
	return 0;
});

// areas.dm:465
rt.def("/area/proc/setup", function* setup(f: Frame, a_name: Value) {
	this.name = a_name;
	this.power_equip = 0;
	this.power_light = 0;
	this.power_environ = 0;
	this.always_unpowered = 0;
	this.valid_territory = 0;
	this.blob_allowed = 0;
	yield* this.addSorted();
	return f.dot;
}, true);
