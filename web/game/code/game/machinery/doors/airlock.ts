// Based on /tg/station's code/game/machinery/doors/airlock.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10210, "/obj/machinery/door/airlock", "/obj/machinery/door", {
	id_tag: null,
	frequency: null,
	radio_connection: null,
	normal_integrity: 300,
	security_level: 0,
	aiControlDisabled: 0,
	hackProof: 0,
	secondsMainPowerLost: 0,
	secondsBackupPowerLost: 0,
	spawnPowerRestoreRunning: 0,
	lights: 1,
	aiDisabledIdScanner: 0,
	aiHacking: 0,
	closeOther: null,
	closeOtherId: null,
	lockdownbyai: 0,
	justzap: 0,
	electronics: null,
	hasShocked: 0,
	charge: null,
	note: null,
	detonated: 0,
	doorOpen: rt.rsc("sound/machines/airlock.ogg"),
	doorClose: rt.rsc("sound/machines/airlockclose.ogg"),
	doorDeni: rt.rsc("sound/machines/deniedbeep.ogg"),
	boltUp: rt.rsc("sound/machines/boltsup.ogg"),
	boltDown: rt.rsc("sound/machines/boltsdown.ogg"),
	noPower: rt.rsc("sound/machines/doorclick.ogg"),
	airlock_material: null,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	note_overlay_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	cyclelinkeddir: 0,
	cyclelinkedairlock: null,
	shuttledocked: 0,
	delayed_close_requested: 0,
	air_tight: 0,
	prying_so_hard: 0,
	explosion_block: 1,
	hud_possible: null,
	name: "airlock",
	icon: rt.rsc("icons/obj/doors/airlocks/station/public.dmi"),
	icon_state: "closed",
	obj_integrity: 300,
	max_integrity: 300,
	integrity_failure: 70,
	damage_deflection: 20,
	secondsElectrified: 0,
	assemblytype: rt.typePath("/obj/structure/door_assembly/door_assembly_0"),
	normalspeed: 1,
	autoclose: 1,
}, { global: { airlock_overlays: 745 } });

// airlock.dm:94
rt.def("/obj/machinery/door/airlock/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("14");
	return f.dot;
});

// airlock.dm:102
rt.def("/obj/machinery/door/airlock/proc/Initialize", function* Initialize(f: Frame) {
	let diag_hud: Value = null;
	f.dot = (yield* parent_proc());
	this.wires = (yield* new_(T("/datum/wires/airlock"), this));
	if (this.cyclelinkeddir) {
		this.cyclelinkairlock();
	}
	if (this.frequency) {
		yield* this.set_frequency(this.frequency);
	}
	if (this.closeOtherId !== null) {
		yield* addtimer((yield* new_(T("/datum/callback"), P("/obj/machinery/door/airlock/proc/update_other_id"))), 5);
	}
	if (this.glass) {
		this.airlock_material = "glass";
	}
	if (this.security_level > AIRLOCK_SECURITY_METAL) {
		this.obj_integrity = this.normal_integrity * AIRLOCK_INTEGRITY_MULTIPLIER;
		this.max_integrity = this.normal_integrity * AIRLOCK_INTEGRITY_MULTIPLIER;
	} else {
		this.obj_integrity = this.normal_integrity;
		this.max_integrity = this.normal_integrity;
	}
	if (this.damage_deflection == AIRLOCK_DAMAGE_DEFLECTION_N && this.security_level > AIRLOCK_SECURITY_METAL) {
		this.damage_deflection = AIRLOCK_DAMAGE_DEFLECTION_R;
	}
	yield* this.prepare_huds();
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	this.diag_hud_set_electrified();
	yield* this.update_icon();
	return f.dot;
}, true);

// airlock.dm:130
rt.def("/obj/machinery/door/airlock/proc/update_other_id", function update_other_id(f: Frame) {
	let A: Value = null;
	for (A of each(GLOB.airlocks, T("/obj/machinery/door/airlock"))) {
		if (A.closeOtherId == this.closeOtherId && A != this) {
			this.closeOther = A;
			break;
		}
	}
	return f.dot;
});

// airlock.dm:137
rt.def("/obj/machinery/door/airlock/proc/cyclelinkairlock", function cyclelinkairlock(f: Frame) {
	let FoundDoor: Value = null;
	if (this.cyclelinkedairlock) {
		this.cyclelinkedairlock.cyclelinkedairlock = null;
		this.cyclelinkedairlock = null;
	}
	if (!this.cyclelinkeddir) {
		return f.dot;
	}
	let limit: Value = rt.world().view;
	let _T: Value = rt.getStep(f, this, 0);
	while (true) {
		_T = rt.getStep(f, _T, this.cyclelinkeddir);
		if ((FoundDoor = rt.locateIn(f, T("/obj/machinery/door/airlock"), _T)) && FoundDoor.cyclelinkeddir != rt.getDir(f, FoundDoor, this)) {
			FoundDoor = null;
		}
		limit--;
		if (!(!FoundDoor && limit)) break;
	}
	if (!FoundDoor) {
		return f.dot;
	}
	FoundDoor.cyclelinkedairlock = this;
	this.cyclelinkedairlock = FoundDoor;
	return f.dot;
});

// airlock.dm:157
rt.def("/obj/machinery/door/airlock/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value) {
	f.dot = (yield* parent_proc());
	if (var_name === "cyclelinkeddir") {
		this.cyclelinkairlock();
	}
	return f.dot;
}, true);

// airlock.dm:164
rt.def("/obj/machinery/door/airlock/proc/lock", function lock(f: Frame) {
	this.bolt();
	return f.dot;
});

// airlock.dm:170
rt.def("/obj/machinery/door/airlock/proc/bolt", function bolt(f: Frame) {
	if (this.locked) {
		return f.dot;
	}
	this.locked = 1;
	playsound(this, this.boltDown, 30, 0, 3);
	this.update_icon();
	return f.dot;
});

// airlock.dm:174
rt.def("/obj/machinery/door/airlock/proc/unlock", function unlock(f: Frame) {
	this.unbolt();
	return f.dot;
});

// airlock.dm:177
rt.def("/obj/machinery/door/airlock/proc/unbolt", function unbolt(f: Frame) {
	if (!this.locked) {
		return f.dot;
	}
	this.locked = 0;
	playsound(this, this.boltUp, 30, 0, 3);
	this.update_icon();
	return f.dot;
});

// airlock.dm:184
rt.def("/obj/machinery/door/airlock/proc/narsie_act", function* narsie_act(f: Frame) {
	let _T: Value = rt.getStep(f, this, 0);
	let runed: Value = prob(20);
	if (this.glass) {
		if (runed) {
			yield* new_(T("/obj/machinery/door/airlock/cult/glass"), _T);
		} else {
			yield* new_(T("/obj/machinery/door/airlock/cult/unruned/glass"), _T);
		}
	} else if (runed) {
		yield* new_(T("/obj/machinery/door/airlock/cult"), _T);
	} else {
		yield* new_(T("/obj/machinery/door/airlock/cult/unruned"), _T);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// airlock.dm:200
rt.def("/obj/machinery/door/airlock/proc/ratvar_act", function* ratvar_act(f: Frame) {
	if (this.glass) {
		yield* new_(T("/obj/machinery/door/airlock/clockwork/brass"), rt.getStep(f, this, 0));
	} else {
		yield* new_(T("/obj/machinery/door/airlock/clockwork"), rt.getStep(f, this, 0));
	}
	yield* qdel(this);
	return f.dot;
}, true);

// airlock.dm:206
rt.def("/obj/machinery/door/airlock/proc/Destroy", function* Destroy(f: Frame) {
	let D: Value = null;
	yield* qdel(this.wires);
	this.wires = null;
	if (this.charge) {
		yield* qdel(this.charge);
		this.charge = null;
	}
	yield* qdel(this.electronics);
	this.electronics = null;
	if (this.cyclelinkedairlock) {
		if (this.cyclelinkedairlock.cyclelinkedairlock == this) {
			this.cyclelinkedairlock.cyclelinkedairlock = null;
		}
		this.cyclelinkedairlock = null;
	}
	if (this.id_tag) {
		for (D of each(GLOB.machines, T("/obj/machinery/doorButtons"))) {
			D.removeMe(this);
		}
	}
	yield* qdel(this.note);
	return (yield* parent_proc());
}, true);

// airlock.dm:222
rt.def("/obj/machinery/door/airlock/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (A != this.note) return f.dot;
	this.note = null;
	this.update_icon();
	return f.dot;
});

// airlock.dm:227
rt.def("/obj/machinery/door/airlock/proc/bumpopen", function* bumpopen(f: Frame, user: Value) {
	if (!rt.istype(f.usr, T("/mob/living/silicon"))) {
		if (this.isElectrified()) {
			if (!this.justzap) {
				if (yield* this.shock(user, 100)) {
					this.justzap = 1;
					rt.spawnTail(f, 10, "/obj/machinery/door/airlock/proc/bumpopen: spawn at game/machinery/doors/airlock.dm:232");
					return f.dot;
				}
			} else {
				return f.dot;
			}
		} else if (user.hallucination > 50 && rt.istype(user, T("/mob/living/carbon/human")) && prob(10) && this.operating == 0) {
			yield* this.hallucinate_shock(user);
			return f.dot;
		}
	}
	if (this.cyclelinkedairlock) {
		if (!this.shuttledocked && !this.emergency && !this.cyclelinkedairlock.shuttledocked && !this.cyclelinkedairlock.emergency && (yield* this.allowed(user))) {
			if (this.cyclelinkedairlock.operating) {
				this.cyclelinkedairlock.delayed_close_requested = 1;
			} else {
				yield* addtimer((yield* new_(T("/datum/callback"), this.cyclelinkedairlock, P("/obj/machinery/door/airlock/proc/close"))), 2);
			}
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// a spawn(10) body of /obj/machinery/door/airlock/proc/bumpopen, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/bumpopen: spawn at game/machinery/doors/airlock.dm:232", function* (f: Frame) {
	this.justzap = 0;
	return null;
});

// airlock.dm:249
rt.def("/obj/machinery/door/airlock/proc/hallucinate_shock", function* hallucinate_shock(f: Frame, user: Value) {
	let shock_image: Value = (yield* image(user, user, { dir: user.dir }));
	let electrocution_skeleton_anim: Value = (yield* image(rt.rsc("icons/mob/human.dmi"), user, { icon_state: "electrocuted_base", layer: ABOVE_MOB_LAYER }));
	shock_image.color = "#000000";
	shock_image.override = 1;
	electrocution_skeleton_anim.appearance_flags = 2;
	to_chat(user, "<span class='userdanger'>You feel a powerful shock course through your body!</span>");
	if (user.client) {
		(rt.modField(f, user.client, "images", shock_image, rt.bitOr));
		(rt.modField(f, user.client, "images", electrocution_skeleton_anim, rt.bitOr));
	}
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/airlock/proc/reset_hallucinate_shock_animation"), user, shock_image, electrocution_skeleton_anim)), 40);
	user.playsound_local(rt.getStep(f, this, 0), "sparks", 100, 1);
	user.staminaloss += 50;
	yield* user.Stun(40);
	user.jitteriness += 1000;
	user.do_jitter_animation(user.jitteriness);
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/airlock/proc/hallucinate_shock_drop"), user)), 20);
	return f.dot;
}, true);

// airlock.dm:268
rt.def("/obj/machinery/door/airlock/proc/reset_hallucinate_shock_animation", function reset_hallucinate_shock_animation(f: Frame, user: Value, shock_image: Value, electrocution_skeleton_anim: Value) {
	if (!user.client) return f.dot;
	user.client.images.Remove(shock_image);
	user.client.images.Remove(electrocution_skeleton_anim);
	return f.dot;
}, false, { argTypes: [{ type: 8, path: "/mob/living" }, {  }, {  }] });

// airlock.dm:273
rt.def("/obj/machinery/door/airlock/proc/hallucinate_shock_drop", function* hallucinate_shock_drop(f: Frame, user: Value) {
	user.jitteriness = max(user.jitteriness - 990, 10);
	yield* user.Knockdown(60);
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob/living" }] });

// airlock.dm:277
rt.def("/obj/machinery/door/airlock/proc/isElectrified", function isElectrified(f: Frame) {
	if (this.secondsElectrified != NOT_ELECTRIFIED) {
		return 1;
	}
	return 0;
});

// airlock.dm:282
rt.def("/obj/machinery/door/airlock/proc/canAIControl", function canAIControl(f: Frame, user: Value) {
	return ((this.aiControlDisabled != 1 ? 1 : 0) && (!this.isAllPowerCut() ? 1 : 0));
});

// airlock.dm:285
rt.def("/obj/machinery/door/airlock/proc/canAIHack", function canAIHack(f: Frame) {
	return (((this.aiControlDisabled == 1 ? 1 : 0) && (!this.hackProof ? 1 : 0)) && (!this.isAllPowerCut() ? 1 : 0));
});

// airlock.dm:288
rt.def("/obj/machinery/door/airlock/proc/hasPower", function hasPower(f: Frame) {
	return (((this.secondsMainPowerLost == 0 ? 1 : 0) || (this.secondsBackupPowerLost == 0 ? 1 : 0)) && (!rt.bitAnd(this.stat, 2) ? 1 : 0));
});

// airlock.dm:291
rt.def("/obj/machinery/door/airlock/proc/requiresID", function requiresID(f: Frame) {
	return (!(this.wires.is_cut("ID Scan") || this.aiDisabledIdScanner) ? 1 : 0);
});

// airlock.dm:294
rt.def("/obj/machinery/door/airlock/proc/isAllPowerCut", function isAllPowerCut(f: Frame) {
	if (!((this.wires.is_cut("Main Power 1") || this.wires.is_cut("Main Power 2")) && (this.wires.is_cut("Auxiliary Power 1") || this.wires.is_cut("Auxiliary Power 2")))) return f.dot;
	return 1;
});

// airlock.dm:298
rt.def("/obj/machinery/door/airlock/proc/regainMainPower", function regainMainPower(f: Frame) {
	if (!(this.secondsMainPowerLost > 0)) return f.dot;
	this.secondsMainPowerLost = 0;
	return f.dot;
});

// airlock.dm:302
rt.def("/obj/machinery/door/airlock/proc/loseMainPower", function loseMainPower(f: Frame) {
	let cont: Value = null;
	if (this.secondsMainPowerLost <= 0) {
		this.secondsMainPowerLost = 60;
		if (this.secondsBackupPowerLost < 10) {
			this.secondsBackupPowerLost = 10;
		}
	}
	if (this.spawnPowerRestoreRunning) return f.dot;
	this.spawnPowerRestoreRunning = 1;
	rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/loseMainPower: spawn at game/machinery/doors/airlock.dm:308", cont);
	return f.dot;
});

// a spawn(0) body of /obj/machinery/door/airlock/proc/loseMainPower, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/loseMainPower: spawn at game/machinery/doors/airlock.dm:308", function* (f: Frame, cont: Value) {
	cont = 1;
	while (cont) {
		yield* sleep(10);
		if (!this || this.gc_destroyed) {
			return f.dot;
		}
		cont = 0;
		if (this.secondsMainPowerLost > 0) {
			if (!this.wires.is_cut("Main Power 1") && !this.wires.is_cut("Main Power 2")) {
				this.secondsMainPowerLost -= 1;
				yield* this.updateDialog();
			}
			cont = 1;
		}
		if (this.secondsBackupPowerLost > 0) {
			if (!this.wires.is_cut("Auxiliary Power 1") && !this.wires.is_cut("Auxiliary Power 2")) {
				this.secondsBackupPowerLost -= 1;
				yield* this.updateDialog();
			}
			cont = 1;
		}
	}
	this.spawnPowerRestoreRunning = 0;
	yield* this.updateDialog();
	return null;
});

// airlock.dm:330
rt.def("/obj/machinery/door/airlock/proc/loseBackupPower", function loseBackupPower(f: Frame) {
	if (!(this.secondsBackupPowerLost < 60)) return f.dot;
	this.secondsBackupPowerLost = 60;
	return f.dot;
});

// airlock.dm:334
rt.def("/obj/machinery/door/airlock/proc/regainBackupPower", function regainBackupPower(f: Frame) {
	if (!(this.secondsBackupPowerLost > 0)) return f.dot;
	this.secondsBackupPowerLost = 0;
	return f.dot;
});

// airlock.dm:341
rt.def("/obj/machinery/door/airlock/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	if (!this.hasPower()) {
		return 0;
	}
	if (this.hasShocked > rt.worldTime(f)) {
		return 0;
	}
	if (!prob(prb)) {
		return 0;
	}
	yield* do_sparks(5, 1, this);
	let check_range: Value = 1;
	if (yield* electrocute_mob(user, get_area(this), this, 1, check_range)) {
		this.hasShocked = rt.worldTime(f) + 10;
		return 1;
	} else {
		return 0;
	}
}, true);

// airlock.dm:356
rt.def("/obj/machinery/door/airlock/proc/update_icon", function update_icon(f: Frame, state: Value, override: Value) {
	state ??= 0;
	override ??= 0;
	if (this.operating && !override) {
		return f.dot;
	}
	if (state === 0) {
		if (this.density) {
			state = AIRLOCK_CLOSED;
		} else {
			state = AIRLOCK_OPEN;
		}
		this.icon_state = "";
	} else if (state === AIRLOCK_OPEN || state === AIRLOCK_CLOSED) {
		this.icon_state = "";
	} else if (state === AIRLOCK_DENY || state === AIRLOCK_OPENING || state === AIRLOCK_CLOSING || state === AIRLOCK_EMAG) {
		this.icon_state = "nonexistenticonstate";
	}
	this.set_airlock_overlays(state);
	return f.dot;
});

// airlock.dm:380
rt.def("/obj/machinery/door/airlock/proc/set_airlock_overlays", function set_airlock_overlays(f: Frame, state: Value) {
	let frame_overlay: Value = null, filling_overlay: Value = null, lights_overlay: Value = null, panel_overlay: Value = null, weld_overlay: Value = null, damag_overlay: Value = null, sparks_overlay: Value = null, note_overlay: Value = null;
	let notetype: Value = this.note_type();
	if (state === AIRLOCK_CLOSED) {
		frame_overlay = get_airlock_overlay("closed", this.icon);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_closed`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_closed", this.icon);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_closed_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_closed", this.overlays_file);
			}
		}
		if (this.welded) {
			weld_overlay = get_airlock_overlay("welded", this.overlays_file);
		}
		if (this.obj_integrity < this.integrity_failure) {
			damag_overlay = get_airlock_overlay("sparks_broken", this.overlays_file);
		} else if (this.obj_integrity < 0.75 * this.max_integrity) {
			damag_overlay = get_airlock_overlay("sparks_damaged", this.overlays_file);
		}
		if (this.lights && this.hasPower()) {
			if (this.locked) {
				lights_overlay = get_airlock_overlay("lights_bolts", this.overlays_file);
			} else if (this.emergency) {
				lights_overlay = get_airlock_overlay("lights_emergency", this.overlays_file);
			}
		}
		if (this.note) {
			note_overlay = get_airlock_overlay(notetype, this.note_overlay_file);
		}
	} else if (state === AIRLOCK_DENY) {
		if (!this.hasPower()) {
			return f.dot;
		}
		frame_overlay = get_airlock_overlay("closed", this.icon);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_closed`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_closed", this.icon);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_closed_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_closed", this.overlays_file);
			}
		}
		if (this.obj_integrity < this.integrity_failure) {
			damag_overlay = get_airlock_overlay("sparks_broken", this.overlays_file);
		} else if (this.obj_integrity < 0.75 * this.max_integrity) {
			damag_overlay = get_airlock_overlay("sparks_damaged", this.overlays_file);
		}
		if (this.welded) {
			weld_overlay = get_airlock_overlay("welded", this.overlays_file);
		}
		lights_overlay = get_airlock_overlay("lights_denied", this.overlays_file);
		if (this.note) {
			note_overlay = get_airlock_overlay(notetype, this.note_overlay_file);
		}
	} else if (state === AIRLOCK_EMAG) {
		frame_overlay = get_airlock_overlay("closed", this.icon);
		sparks_overlay = get_airlock_overlay("sparks", this.overlays_file);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_closed`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_closed", this.icon);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_closed_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_closed", this.overlays_file);
			}
		}
		if (this.obj_integrity < this.integrity_failure) {
			damag_overlay = get_airlock_overlay("sparks_broken", this.overlays_file);
		} else if (this.obj_integrity < 0.75 * this.max_integrity) {
			damag_overlay = get_airlock_overlay("sparks_damaged", this.overlays_file);
		}
		if (this.welded) {
			weld_overlay = get_airlock_overlay("welded", this.overlays_file);
		}
		if (this.note) {
			note_overlay = get_airlock_overlay(notetype, this.note_overlay_file);
		}
	} else if (state === AIRLOCK_CLOSING) {
		frame_overlay = get_airlock_overlay("closing", this.icon);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_closing`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_closing", this.icon);
		}
		if (this.lights && this.hasPower()) {
			lights_overlay = get_airlock_overlay("lights_closing", this.overlays_file);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_closing_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_closing", this.overlays_file);
			}
		}
		if (this.note) {
			note_overlay = get_airlock_overlay(`${notetype}_closing`, this.note_overlay_file);
		}
	} else if (state === AIRLOCK_OPEN) {
		frame_overlay = get_airlock_overlay("open", this.icon);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_open`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_open", this.icon);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_open_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_open", this.overlays_file);
			}
		}
		if (this.obj_integrity < 0.75 * this.max_integrity) {
			damag_overlay = get_airlock_overlay("sparks_open", this.overlays_file);
		}
		if (this.note) {
			note_overlay = get_airlock_overlay(`${notetype}_open`, this.note_overlay_file);
		}
	} else if (state === AIRLOCK_OPENING) {
		frame_overlay = get_airlock_overlay("opening", this.icon);
		if (this.airlock_material) {
			filling_overlay = get_airlock_overlay(`${this.airlock_material}_opening`, this.overlays_file);
		} else {
			filling_overlay = get_airlock_overlay("fill_opening", this.icon);
		}
		if (this.lights && this.hasPower()) {
			lights_overlay = get_airlock_overlay("lights_opening", this.overlays_file);
		}
		if (this.panel_open) {
			if (this.security_level) {
				panel_overlay = get_airlock_overlay("panel_opening_protected", this.overlays_file);
			} else {
				panel_overlay = get_airlock_overlay("panel_opening", this.overlays_file);
			}
		}
		if (this.note) {
			note_overlay = get_airlock_overlay(`${notetype}_opening`, this.note_overlay_file);
		}
	}
	this.cut_overlays();
	this.add_overlay(frame_overlay);
	this.add_overlay(filling_overlay);
	this.add_overlay(lights_overlay);
	this.add_overlay(panel_overlay);
	this.add_overlay(weld_overlay);
	this.add_overlay(sparks_overlay);
	this.add_overlay(damag_overlay);
	this.add_overlay(note_overlay);
	return f.dot;
});

// airlock.dm:512
rt.def("/proc/get_airlock_overlay", function get_airlock_overlay(f: Frame, icon_state: Value, icon_file: Value) {
	let A: Value = null;
	pass(A);
	let airlock_overlays: Value = GLOB.airlock_overlays;
	let iconkey: Value = `${icon_state}${icon_file}`;
	if (f.dot = rt.index(airlock_overlays, iconkey)) return f.dot;
	f.dot = (rt.setAt(airlock_overlays, iconkey, mutable_appearance(icon_file, icon_state)));
	return f.dot;
});

// airlock.dm:519
rt.def("/obj/machinery/door/airlock/proc/do_animate", function* do_animate(f: Frame, animation: Value) {
	if (animation === "opening") {
		yield* this.update_icon(AIRLOCK_OPENING);
	} else if (animation === "closing") {
		yield* this.update_icon(AIRLOCK_CLOSING);
	} else if (animation === "deny") {
		if (this.stat) return f.dot;
		yield* this.update_icon(AIRLOCK_DENY);
		playsound(this, this.doorDeni, 50, 0, 3);
		yield* sleep(6);
		yield* this.update_icon(AIRLOCK_CLOSED);
	}
	return f.dot;
}, true);

// airlock.dm:532
rt.def("/obj/machinery/door/airlock/proc/examine", function* examine(f: Frame, user: Value) {
	yield* parent_proc();
	if (this.charge && !this.panel_open && get_dist(user, this) <= 1) {
		to_chat(user, "<span class='warning'>The maintenance panel seems haphazardly fastened.</span>");
	}
	if (this.charge && this.panel_open) {
		to_chat(user, "<span class='warning'>Something is wired up to the airlock's electronics!</span>");
	}
	if (this.note) {
		if (!(get_dist(user, this) <= 1)) {
			to_chat(user, `There's a ${this.note.name} pinned to the front. You can't read it from here.`);
		} else {
			to_chat(user, `There's a ${this.note.name} pinned to the front...`);
			yield* this.note.examine(user);
		}
	}
	if (this.panel_open) {
		if (this.security_level === AIRLOCK_SECURITY_NONE) {
			to_chat(user, "Wires are exposed!");
		} else if (this.security_level === AIRLOCK_SECURITY_METAL) {
			to_chat(user, "Wires are hidden behind welded metal cover");
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_I_S) {
			to_chat(user, "There is some shredded plasteel inside");
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_I) {
			to_chat(user, "Wires are behind inner layer of plasteel");
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_O_S) {
			to_chat(user, "There is some shredded plasteel inside");
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_O) {
			to_chat(user, "There is welded plasteel cover hiding wires");
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL) {
			to_chat(user, "There is protective grille over panel");
		}
	} else {
		if (!this.security_level) return f.dot;
		if (this.security_level == AIRLOCK_SECURITY_METAL) {
			to_chat(user, "It looks a bit stronger");
		} else {
			to_chat(user, "It looks very robust");
		}
	}
	return f.dot;
}, true);

// airlock.dm:567
rt.def("/obj/machinery/door/airlock/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	if (!this.canAIControl(user)) {
		if (this.canAIHack()) {
			yield* this.hack(user);
			return f.dot;
		} else {
			to_chat(user, "<span class='warning'>Airlock AI control has been blocked with a firewall. Unable to hack.</span>");
		}
	}
	if (this.emagged) {
		to_chat(user, "<span class='warning'>Unable to interface: Airlock is unresponsive.</span>");
		return f.dot;
	}
	if (this.detonated) {
		to_chat(user, "<span class='warning'>Unable to interface. Airlock control panel damaged.</span>");
		return f.dot;
	}
	yield* user.set_machine(this);
	let t1: Value = "<B>Airlock Control</B><br>\n";
	if (this.secondsMainPowerLost > 0) {
		if (!this.wires.is_cut("Main Power 1") && !this.wires.is_cut("Main Power 2")) {
			t1 += `Main power is offline for ${this.secondsMainPowerLost} seconds.<br>\n`;
		} else {
			t1 += "Main power is offline indefinitely.<br>\n";
		}
	} else {
		t1 += "Main power is online.";
	}
	if (this.secondsBackupPowerLost > 0) {
		if (!this.wires.is_cut("Auxiliary Power 1") && !this.wires.is_cut("Auxiliary Power 2")) {
			t1 += `Backup power is offline for ${this.secondsBackupPowerLost} seconds.<br>\n`;
		} else {
			t1 += "Backup power is offline indefinitely.<br>\n";
		}
	} else if (this.secondsMainPowerLost > 0) {
		t1 += "Backup power is online.";
	} else {
		t1 += "Backup power is offline, but will turn on if main power fails.";
	}
	t1 += "<br>\n";
	if (this.wires.is_cut("ID Scan")) {
		t1 += "IdScan wire is cut.<br>\n";
	} else if (this.aiDisabledIdScanner) {
		t1 += fmt("IdScan disabled. <A href='?src=＃;aiEnable=1'>Enable?</a><br>\n", [this]);
	} else {
		t1 += fmt("IdScan enabled. <A href='?src=＃;aiDisable=1'>Disable?</a><br>\n", [this]);
	}
	if (this.emergency) {
		t1 += fmt("Emergency Access Override is enabled. <A href='?src=＃;aiDisable=11'>Disable?</a><br>\n", [this]);
	} else {
		t1 += fmt("Emergency Access Override is disabled. <A href='?src=＃;aiEnable=11'>Enable?</a><br>\n", [this]);
	}
	if (this.wires.is_cut("Main Power 1")) {
		t1 += "Main Power Input wire is cut.<br>\n";
	}
	if (this.wires.is_cut("Main Power 2")) {
		t1 += "Main Power Output wire is cut.<br>\n";
	}
	if (this.secondsMainPowerLost == 0) {
		t1 += fmt("<A href='?src=＃;aiDisable=2'>Temporarily disrupt main power?</a>.<br>\n", [this]);
	}
	if (this.secondsBackupPowerLost == 0) {
		t1 += fmt("<A href='?src=＃;aiDisable=3'>Temporarily disrupt backup power?</a>.<br>\n", [this]);
	}
	if (this.wires.is_cut("Auxiliary Power 1")) {
		t1 += "Backup Power Input wire is cut.<br>\n";
	}
	if (this.wires.is_cut("Auxiliary Power 2")) {
		t1 += "Backup Power Output wire is cut.<br>\n";
	}
	if (this.wires.is_cut("Bolts")) {
		t1 += "Door bolt drop wire is cut.<br>\n";
	} else if (!this.locked) {
		t1 += fmt("Door bolts are up. <A href='?src=＃;aiDisable=4'>Drop them?</a><br>\n", [this]);
	} else {
		t1 += "Door bolts are down.";
		if (this.hasPower()) {
			t1 += fmt(" <A href='?src=＃;aiEnable=4'>Raise?</a><br>\n", [this]);
		} else {
			t1 += " Cannot raise door bolts due to power failure.<br>\n";
		}
	}
	if (this.wires.is_cut("Bolt Lights")) {
		t1 += "Door bolt lights wire is cut.<br>\n";
	} else if (!this.lights) {
		t1 += fmt("Door bolt lights are off. <A href='?src=＃;aiEnable=10'>Enable?</a><br>\n", [this]);
	} else {
		t1 += fmt("Door bolt lights are on. <A href='?src=＃;aiDisable=10'>Disable?</a><br>\n", [this]);
	}
	if (this.wires.is_cut("High Voltage Ground")) {
		t1 += "Electrification wire is cut.<br>\n";
	}
	if (this.secondsElectrified == ELECTRIFIED_PERMANENT) {
		t1 += fmt("Door is electrified indefinitely. <A href='?src=＃;aiDisable=5'>Un-electrify it?</a><br>\n", [this]);
	} else if (this.secondsElectrified > NOT_ELECTRIFIED) {
		t1 += fmt("Door is electrified temporarily (＀ seconds). <A href='?src=＃;aiDisable=5'>Un-electrify it?</a><br>\n", [this.secondsElectrified, this]);
	} else {
		t1 += fmt("Door is not electrified. <A href='?src=＃;aiEnable=5'>Electrify it for 30 seconds?</a> Or, <A href='?src=＃;aiEnable=6'>Electrify it indefinitely until someone cancels the electrification?</a><br>\n", [this, this]);
	}
	if (this.wires.is_cut("Safety")) {
		t1 += "Door force sensors not responding.</a><br>\n";
	} else if (this.safe) {
		t1 += fmt("Door safeties operating normally.  <A href='?src=＃;aiDisable=8'>Override?</a><br>\n", [this]);
	} else {
		t1 += fmt("Danger.  Door safeties disabled.  <A href='?src=＃;aiEnable=8'>Restore?</a><br>\n", [this]);
	}
	if (this.wires.is_cut("Timing")) {
		t1 += "Door timing circuitry not responding.</a><br>\n";
	} else if (this.normalspeed) {
		t1 += fmt("Door timing circuitry operating normally.  <A href='?src=＃;aiDisable=9'>Override?</a><br>\n", [this]);
	} else {
		t1 += fmt("Warning.  Door timing circuitry operating abnormally.  <A href='?src=＃;aiEnable=9'>Restore?</a><br>\n", [this]);
	}
	if (this.welded) {
		t1 += "Door appears to have been welded shut.<br>\n";
	} else if (!this.locked) {
		if (this.density) {
			t1 += fmt("<A href='?src=＃;aiEnable=7'>Open door</a><br>\n", [this]);
		} else {
			t1 += fmt("<A href='?src=＃;aiDisable=7'>Close door</a><br>\n", [this]);
		}
	}
	t1 += fmt("<p><a href='?src=＃;close=1'>Close</a></p>\n", [this]);
	rt.op(f, "Browse", [], [user, t1, "window=airlock"], false);
	onclose(user, "airlock");
	return f.dot;
}, true);

// airlock.dm:687
rt.def("/obj/machinery/door/airlock/proc/hack", function* hack(f: Frame, user: Value) {
	if (this.aiHacking != 0) return f.dot;
	this.aiHacking = 1;
	to_chat(user, "Airlock AI control has been blocked. Beginning fault-detection.");
	yield* sleep(50);
	if (this.canAIControl(user)) {
		to_chat(user, "Alert cancelled. Airlock control has been restored without our assistance.");
		this.aiHacking = 0;
		return f.dot;
	} else if (!this.canAIHack()) {
		to_chat(user, "Connection lost! Unable to hack airlock.");
		this.aiHacking = 0;
		return f.dot;
	}
	to_chat(user, "Fault confirmed: airlock control wire disabled or cut.");
	yield* sleep(20);
	to_chat(user, "Attempting to hack into airlock. This may take some time.");
	yield* sleep(200);
	if (this.canAIControl(user)) {
		to_chat(user, "Alert cancelled. Airlock control has been restored without our assistance.");
		this.aiHacking = 0;
		return f.dot;
	} else if (!this.canAIHack()) {
		to_chat(user, "Connection lost! Unable to hack airlock.");
		this.aiHacking = 0;
		return f.dot;
	}
	to_chat(user, "Upload access confirmed. Loading control program into airlock software.");
	yield* sleep(170);
	if (this.canAIControl(user)) {
		to_chat(user, "Alert cancelled. Airlock control has been restored without our assistance.");
		this.aiHacking = 0;
		return f.dot;
	} else if (!this.canAIHack()) {
		to_chat(user, "Connection lost! Unable to hack airlock.");
		this.aiHacking = 0;
		return f.dot;
	}
	to_chat(user, "Transfer complete. Forcing airlock to execute program.");
	yield* sleep(50);
	this.aiControlDisabled = 2;
	to_chat(user, "Receiving control information from airlock.");
	yield* sleep(10);
	this.aiHacking = 0;
	if (!user) return f.dot;
	yield* this.attack_ai(user);
	return f.dot;
}, true, { waitfor: false });

// airlock.dm:733
rt.def("/obj/machinery/door/airlock/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	return (yield* this.attack_hand(user));
}, true);

// airlock.dm:736
rt.def("/obj/machinery/door/airlock/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let H: Value = null;
	if (!(rt.istype(user, T("/mob/living/silicon")) || IsAdminGhost(user))) {
		if (this.isElectrified()) {
			if (yield* this.shock(user, 100)) {
				return f.dot;
			}
		}
	}
	if (rt.istype(user, T("/mob/living/carbon/human")) && prob(40) && this.density) {
		if ((H = user).getBrainLoss() >= 60 && this.Adjacent(user)) {
			playsound(this.loc, rt.rsc("sound/effects/bang.ogg"), 25, 1);
			if (!rt.istype(H.head, T("/obj/item/clothing/head/helmet"))) {
				H.visible_message(`<span class='danger'>${user} headbutts the airlock.</span>`, "<span class='userdanger'>You headbutt the airlock!</span>");
				yield* H.Knockdown(100);
				yield* H.apply_damage(10, "brute", "head");
			} else {
				this.visible_message(`<span class='danger'>${user} headbutts the airlock. Good thing ${user.p_theyre()} wearing a helmet.</span>`);
			}
			return f.dot;
		}
	}
	if (this.panel_open) {
		if (this.security_level) {
			to_chat(user, "<span class='warning'>Wires are protected!</span>");
			return f.dot;
		}
		yield* this.wires.interact(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// airlock.dm:767
rt.def("/obj/machinery/door/airlock/proc/Topic", function* Topic(f: Frame) {
	let code: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) {
		yield* parent_proc();
	}
	if (f.usr.incapacitated() && !IsAdminGhost(f.usr)) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	if (rt.at(f.args[1], "close")) {
		rt.op(f, "Browse", [], [f.usr, null, "window=airlock"], false);
		if (f.usr.machine == this) {
			yield* f.usr.unset_machine();
			return f.dot;
		}
	}
	if (get_dist(this, f.usr) <= 1 && isturf(this.loc) && this.panel_open) {
		yield* f.usr.set_machine(this);
	}
	if (rt.istype(f.usr, T("/mob/living/silicon")) && this.canAIControl(f.usr) || IsAdminGhost(f.usr)) {
		if (rt.at(f.args[1], "aiDisable")) {
			const subject = (code = text2num(rt.at(f.args[1], "aiDisable")));
			if (subject === 1) {
				if (this.wires.is_cut("ID Scan")) {
					to_chat(f.usr, "The IdScan wire has been cut - So, you can't disable it, but it is already disabled anyways.");
				} else if (this.aiDisabledIdScanner) {
					to_chat(f.usr, "You've already disabled the IdScan feature.");
				} else {
					this.aiDisabledIdScanner = 1;
				}
			} else if (subject === 2) {
				if (this.secondsMainPowerLost == 0) {
					this.loseMainPower();
					yield* this.update_icon();
				} else {
					to_chat(f.usr, "Main power is already offline.");
				}
			} else if (subject === 3) {
				if (this.secondsBackupPowerLost == 0) {
					this.loseBackupPower();
					yield* this.update_icon();
				} else {
					to_chat(f.usr, "Backup power is already offline.");
				}
			} else if (subject === 4) {
				if (this.wires.is_cut("Bolts")) {
					to_chat(f.usr, "You can't drop the door bolts - The door bolt dropping wire has been cut.");
				} else {
					this.bolt();
				}
			} else if (subject === 5) {
				if (this.wires.is_cut("High Voltage Ground")) {
					to_chat(f.usr, "Can't un-electrify the airlock - The electrification wire is cut.");
				} else if (this.isElectrified()) {
					this.set_electrified(0);
				}
			} else if (subject === 8) {
				if (this.wires.is_cut("Safety")) {
					to_chat(f.usr, "Control to door sensors is disabled.");
				} else if (this.safe) {
					this.safe = 0;
				} else {
					to_chat(f.usr, "Firmware reports safeties already overriden.");
				}
			} else if (subject === 9) {
				if (this.wires.is_cut("Timing")) {
					to_chat(f.usr, "Control to door timing circuitry has been severed.");
				} else if (this.normalspeed) {
					this.normalspeed = 0;
				} else {
					to_chat(f.usr, "Door timing circuitry already accelerated.");
				}
			} else if (subject === 7) {
				if (this.welded) {
					to_chat(f.usr, "The airlock has been welded shut!");
				} else if (this.locked) {
					to_chat(f.usr, "The door bolts are down!");
				} else if (!this.density) {
					yield* this.close();
				} else {
					yield* this.open();
				}
			} else if (subject === 10) {
				if (this.wires.is_cut("Bolt Lights")) {
					to_chat(f.usr, "Control to door bolt lights has been severed.</a>");
				} else if (this.lights) {
					this.lights = 0;
					yield* this.update_icon();
				} else {
					to_chat(f.usr, "Door bolt lights are already disabled!");
				}
			} else if (subject === 11) {
				if (this.emergency) {
					this.emergency = 0;
					yield* this.update_icon();
				} else {
					to_chat(f.usr, "Emergency access is already disabled!");
				}
			}
		} else if (rt.at(f.args[1], "aiEnable")) {
			const subject = (code = text2num(rt.at(f.args[1], "aiEnable")));
			if (subject === 1) {
				if (this.wires.is_cut("ID Scan")) {
					to_chat(f.usr, "You can't enable IdScan - The IdScan wire has been cut.");
				} else if (this.aiDisabledIdScanner) {
					this.aiDisabledIdScanner = 0;
				} else {
					to_chat(f.usr, "The IdScan feature is not disabled.");
				}
			} else if (subject === 4) {
				if (this.wires.is_cut("Bolts")) {
					to_chat(f.usr, "The door bolt drop wire is cut - you can't raise the door bolts.<br>\n");
				} else if (!this.locked) {
					to_chat(f.usr, "The door bolts are already up.<br>\n");
				} else if (this.hasPower()) {
					this.unbolt();
				} else {
					to_chat(f.usr, "Cannot raise door bolts due to power failure.<br>\n");
				}
			} else if (subject === 5) {
				if (this.wires.is_cut("High Voltage Ground")) {
					to_chat(f.usr, "The electrification wire has been cut.<br>\n");
				} else if (this.secondsElectrified == ELECTRIFIED_PERMANENT) {
					to_chat(f.usr, "The door is already indefinitely electrified. You'd have to un-electrify it before you can re-electrify it with a non-forever duration.<br>\n");
				} else if (this.isElectrified()) {
					to_chat(f.usr, "The door is already electrified. You can't re-electrify it while it's already electrified.<br>\n");
				} else {
					this.shockedby += `[${time_stamp()}]${f.usr}(ckey:${f.usr.ckey})`;
					add_logs(f.usr, this, "electrified");
					this.set_electrified(30);
					rt.spawnTail(f, 10, "/obj/machinery/door/airlock/proc/Topic: spawn at game/machinery/doors/airlock.dm:907", code);
				}
			} else if (subject === 6) {
				if (this.wires.is_cut("High Voltage Ground")) {
					to_chat(f.usr, "The electrification wire has been cut.<br>\n");
				} else if (this.secondsElectrified == ELECTRIFIED_PERMANENT) {
					to_chat(f.usr, "The door is already indefinitely electrified.<br>\n");
				} else if (this.isElectrified()) {
					to_chat(f.usr, "The door is already electrified. You can't re-electrify it while it's already electrified.<br>\n");
				} else {
					this.shockedby += `[${time_stamp()}]${f.usr}(ckey:${f.usr.ckey})`;
					add_logs(f.usr, this, "electrified");
					this.set_electrified(ELECTRIFIED_PERMANENT);
				}
			} else if (subject === 8) {
				if (this.wires.is_cut("Safety")) {
					to_chat(f.usr, "Control to door sensors is disabled.");
				} else if (!this.safe) {
					this.safe = 1;
					yield* this.updateUsrDialog();
				} else {
					to_chat(f.usr, "Firmware reports safeties already in place.");
				}
			} else if (subject === 9) {
				if (this.wires.is_cut("Timing")) {
					to_chat(f.usr, "Control to door timing circuitry has been severed.");
				} else if (!this.normalspeed) {
					this.normalspeed = 1;
					yield* this.updateUsrDialog();
				} else {
					to_chat(f.usr, "Door timing circuitry currently operating normally.");
				}
			} else if (subject === 7) {
				if (this.welded) {
					to_chat(f.usr, "The airlock has been welded shut!");
				} else if (this.locked) {
					to_chat(f.usr, "The door bolts are down!");
				} else if (this.density) {
					yield* this.open();
				} else {
					yield* this.close();
				}
			} else if (subject === 10) {
				if (this.wires.is_cut("Bolt Lights")) {
					to_chat(f.usr, "Control to door bolt lights has been severed.</a>");
				} else if (!this.lights) {
					this.lights = 1;
					yield* this.update_icon();
					yield* this.updateUsrDialog();
				} else {
					to_chat(f.usr, "Door bolt lights are already enabled!");
				}
			} else if (subject === 11) {
				if (!this.emergency) {
					this.emergency = 1;
					yield* this.update_icon();
				} else {
					to_chat(f.usr, "Emergency access is already enabled!");
				}
			}
		}
	}
	yield* this.add_fingerprint(f.usr);
	if (f.args[2]) return f.dot;
	yield* this.updateUsrDialog();
	return f.dot;
}, true, { args: ["href", "href_list", "nowindow"] });

// a spawn(10) body of /obj/machinery/door/airlock/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/Topic: spawn at game/machinery/doors/airlock.dm:907", function* (f: Frame, code: Value) {
	while (this.secondsElectrified > 0) {
		this.secondsElectrified--;
		if (this.secondsElectrified <= 0) {
			this.set_electrified(0);
		}
		yield* this.updateUsrDialog();
		yield* sleep(10);
	}
	return null;
});

// airlock.dm:980
rt.def("/obj/machinery/door/airlock/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let S: Value = null, WT: Value = null, W: Value = null, cable: Value = null;
	let $0: any, $1: any;
	if (!rt.istype(user, T("/mob/living/silicon")) && !IsAdminGhost(user)) {
		if (this.isElectrified()) {
			if (yield* this.shock(user, 75)) {
				return f.dot;
			}
		}
	}
	yield* this.add_fingerprint(user);
	if (this.panel_open) {
		if (this.security_level === AIRLOCK_SECURITY_NONE) {
			if (rt.istype(C, T("/obj/item/stack/sheet/metal"))) {
				if ((S = C).amount < 2) {
					to_chat(user, `<span class='warning'>You need at least 2 metal sheets to reinforce ${this}.</span>`);
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You start reinforcing ${this}</span>`);
				if (yield* do_after(user, 20, 1, { target: this })) {
					if (!this.panel_open || !(yield* S.use(2))) {
						return f.dot;
					}
					user.visible_message(fmt("<span class='notice'>＀ reinforce ％！ with metal.</span>", [user, this]), fmt("<span class='notice'>You reinforce ％！ with metal.</span>", [this]));
					this.security_level = AIRLOCK_SECURITY_METAL;
					yield* this.update_icon();
				}
				return f.dot;
			} else if (rt.istype(C, T("/obj/item/stack/sheet/plasteel"))) {
				if ((S = C).amount < 2) {
					to_chat(user, `<span class='warning'>You need at least 2 plasteel sheets to reinforce ${this}.</span>`);
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You start reinforcing ${this}.</span>`);
				if (yield* do_after(user, 20, 1, { target: this })) {
					if (!this.panel_open || !(yield* S.use(2))) {
						return f.dot;
					}
					user.visible_message(fmt("<span class='notice'>＀ reinforce ％！ with plasteel.</span>", [user, this]), fmt("<span class='notice'>You reinforce ％！ with plasteel.</span>", [this]));
					this.security_level = AIRLOCK_SECURITY_PLASTEEL;
					yield* this.modify_max_integrity(this.normal_integrity * AIRLOCK_INTEGRITY_MULTIPLIER);
					this.damage_deflection = AIRLOCK_DAMAGE_DEFLECTION_R;
					yield* this.update_icon();
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_METAL) {
			if (rt.istype(C, T("/obj/item/weapon/weldingtool"))) {
				if (!(yield* (WT = C).remove_fuel(2, user))) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You begin cutting the panel's shielding...</span>");
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
					if (!this.panel_open || !WT.isOn()) {
						return f.dot;
					}
					playsound(this.loc, WT.usesound, 50, 1);
					user.visible_message(fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [user, this]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [this]), "<span class='italics'>You hear welding.</span>");
					this.security_level = AIRLOCK_SECURITY_NONE;
					yield* spawn_atom_to_turf(T("/obj/item/stack/sheet/metal"), user.loc, 2);
					yield* this.update_icon();
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_I_S) {
			if (rt.istype(C, T("/obj/item/weapon/crowbar"))) {
				W = C;
				to_chat(user, "<span class='notice'>You start removing the inner layer of shielding...</span>");
				playsound(this, W.usesound, 100, 1);
				if (yield* do_after(user, 40 * W.toolspeed, 1, { target: this })) {
					if (!this.panel_open) {
						return f.dot;
					}
					if (this.security_level != AIRLOCK_SECURITY_PLASTEEL_I_S) {
						return f.dot;
					}
					user.visible_message(fmt("<span class='notice'>＀ remove ％！'s shielding.</span>", [user, this]), fmt("<span class='notice'>You remove ％！'s inner shielding.</span>", [this]));
					this.security_level = AIRLOCK_SECURITY_NONE;
					yield* this.modify_max_integrity(this.normal_integrity);
					this.damage_deflection = AIRLOCK_DAMAGE_DEFLECTION_N;
					yield* spawn_atom_to_turf(T("/obj/item/stack/sheet/plasteel"), user.loc, 1);
					yield* this.update_icon();
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_I) {
			if (rt.istype(C, T("/obj/item/weapon/weldingtool"))) {
				if (!(yield* (WT = C).remove_fuel(2, user))) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You begin cutting the inner layer of shielding...</span>");
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
					if (!this.panel_open || !WT.isOn()) {
						return f.dot;
					}
					playsound(this.loc, WT.usesound, 50, 1);
					user.visible_message(fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [user, this]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [this]), "<span class='italics'>You hear welding.</span>");
					this.security_level = AIRLOCK_SECURITY_PLASTEEL_I_S;
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_O_S) {
			if (rt.istype(C, T("/obj/item/weapon/crowbar"))) {
				W = C;
				to_chat(user, "<span class='notice'>You start removing outer layer of shielding...</span>");
				playsound(this, W.usesound, 100, 1);
				if (yield* do_after(user, 40 * W.toolspeed, 1, { target: this })) {
					if (!this.panel_open) {
						return f.dot;
					}
					if (this.security_level != AIRLOCK_SECURITY_PLASTEEL_O_S) {
						return f.dot;
					}
					user.visible_message(fmt("<span class='notice'>＀ remove ％！'s shielding.</span>", [user, this]), fmt("<span class='notice'>You remove ％！'s shielding.</span>", [this]));
					this.security_level = AIRLOCK_SECURITY_PLASTEEL_I;
					yield* spawn_atom_to_turf(T("/obj/item/stack/sheet/plasteel"), user.loc, 1);
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL_O) {
			if (rt.istype(C, T("/obj/item/weapon/weldingtool"))) {
				if (!(yield* (WT = C).remove_fuel(2, user))) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You begin cutting the outer layer of shielding...</span>");
				playsound(this.loc, WT.usesound, 40, 1);
				if (yield* do_after(user, 40 * WT.toolspeed, 1, { target: this })) {
					if (!this.panel_open || !WT.isOn()) {
						return f.dot;
					}
					playsound(this.loc, WT.usesound, 50, 1);
					user.visible_message(fmt("<span class='notice'>＀ cuts through ％！'s shielding.</span>", [user, this]), fmt("<span class='notice'>You cut through ％！'s shielding.</span>", [this]), "<span class='italics'>You hear welding.</span>");
					this.security_level = AIRLOCK_SECURITY_PLASTEEL_O_S;
				}
				return f.dot;
			}
		} else if (this.security_level === AIRLOCK_SECURITY_PLASTEEL) {
			if (rt.istype(C, T("/obj/item/weapon/wirecutters"))) {
				W = C;
				if (this.hasPower() && (yield* this.shock(user, 60))) {
					return f.dot;
				}
				to_chat(user, "<span class='notice'>You start cutting through the outer grille.</span>");
				playsound(this, W.usesound, 100, 1);
				if (yield* do_after(user, 10 * W.toolspeed, 1, { target: this })) {
					if (!this.panel_open) {
						return f.dot;
					}
					user.visible_message(fmt("<span class='notice'>＀ cut through ％！'s outer grille.</span>", [user, this]), fmt("<span class='notice'>You cut through ％！'s outer grille.</span>", [this]));
					this.security_level = AIRLOCK_SECURITY_PLASTEEL_O;
				}
				return f.dot;
			}
		}
	}
	if (rt.istype(C, T("/obj/item/weapon/screwdriver"))) {
		if (this.panel_open && this.detonated) {
			to_chat(user, `<span class='warning'>${this} has no maintenance panel!</span>`);
			return f.dot;
		}
		this.panel_open = (!this.panel_open ? 1 : 0);
		$0 = user;
		if (this.panel_open) {
			$1 = "open";
		} else {
			$1 = "close";
		}
		to_chat($0, `<span class='notice'>You ${$1} the maintenance panel of the airlock.</span>`);
		playsound(this.loc, C.usesound, 50, 1);
		yield* this.update_icon();
	} else if (rt.istype(C, T("/obj/item/weapon/wirecutters")) && this.note) {
		user.visible_message(`<span class='notice'>${user} cuts down ${this.note} from ${this}.</span>`, `<span class='notice'>You remove ${this.note} from ${this}.</span>`);
		playsound(this, rt.rsc("sound/items/wirecutter.ogg"), 50, 1);
		yield* this.note.forceMove(rt.getStep(f, user, 0));
		this.note = null;
		yield* this.update_icon();
	} else {
		if (is_wire_tool(C)) {
			return (yield* this.attack_hand(user));
		}
		if (rt.istype(C, T("/obj/item/weapon/pai_cable"))) {
			yield* (cable = C).plugin(this, user);
		} else if (rt.istype(C, T("/obj/item/weapon/airlock_painter"))) {
			yield* this.change_paintjob(C, user);
		} else if (rt.istype(C, T("/obj/item/device/doorCharge"))) {
			if (!this.panel_open || this.security_level) {
				to_chat(user, `<span class='warning'>The maintenance panel must be open to apply ${C}!</span>`);
				return f.dot;
			}
			if (this.emagged) {
				return f.dot;
			}
			if (this.charge && !this.detonated) {
				to_chat(user, "<span class='warning'>There's already a charge hooked up to this door!</span>");
				return f.dot;
			}
			if (this.detonated) {
				to_chat(user, "<span class='warning'>The maintenance panel is destroyed!</span>");
				return f.dot;
			}
			to_chat(user, `<span class='warning'>You apply ${C}. Next time someone opens the door, it will explode.</span>`);
			yield* user.drop_item();
			this.panel_open = 0;
			yield* this.update_icon();
			yield* C.forceMove(this);
			this.charge = C;
		} else if (rt.istype(C, T("/obj/item/weapon/paper")) || rt.istype(C, T("/obj/item/weapon/photo"))) {
			if (this.note) {
				to_chat(user, "<span class='warning'>There's already something pinned to this airlock! Use wirecutters to remove it.<spa>");
				return f.dot;
			}
			if (!(yield* user.transferItemToLoc(C, this))) {
				to_chat(user, `<span class='warning'>For some reason, you can't attach ${C}!</span>`);
				return f.dot;
			}
			user.visible_message(`<span class='notice'>${user} pins ${C} to ${this}.</span>`, `<span class='notice'>You pin ${C} to ${this}.</span>`);
			this.note = C;
			yield* this.update_icon();
		} else {
			return (yield* parent_proc());
		}
	}
	return f.dot;
}, true);

// airlock.dm:1170
rt.def("/obj/machinery/door/airlock/proc/try_to_weld", function* try_to_weld(f: Frame, W: Value, user: Value) {
	let $0: any, $1: any, $2: any;
	if (!(!this.operating && this.density)) return f.dot;
	if (user.a_intent != "help") {
		if (yield* W.remove_fuel(0, user)) {
			$0 = user;
			$1 = user;
			if (this.welded) {

				$2 = "unwelding";
			} else {
				$2 = "welding";
			}
			$1 = `${$1} is ${$2} the airlock.`;
			if (this.welded) {
				$2 = "unwelding";
			} else {
				$2 = "welding";
			}
			$0.visible_message($1, `<span class='notice'>You begin ${$2} the airlock...</span>`, "<span class='italics'>You hear welding.</span>");
			playsound(this.loc, W.usesound, 40, 1);
			if (yield* do_after(user, 40 * W.toolspeed, 1, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/airlock/proc/weld_checks"), W, user)) })) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				this.welded = (!this.welded ? 1 : 0);
				$0 = user;
				$1 = user.name;
				if (this.welded) {
					$2 = "welded shut";
				} else {
					$2 = "unwelded";
				}
				$1 = `${$1} has ${$2} ${this}.`;
				if (this.welded) {
					$2 = "weld the airlock shut";
				} else {
					$2 = "unweld the airlock";
				}
				$0.visible_message($1, `<span class='notice'>You ${$2}.</span>`);
				yield* this.update_icon();
			}
		}
	} else if (this.obj_integrity < this.max_integrity) {
		if (yield* W.remove_fuel(0, user)) {
			user.visible_message(`${user} is welding the airlock.`, "<span class='notice'>You begin repairing the airlock...</span>", "<span class='italics'>You hear welding.</span>");
			playsound(this.loc, W.usesound, 40, 1);
			if (yield* do_after(user, 40 * W.toolspeed, 1, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/airlock/proc/weld_checks"), W, user)) })) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 50, 1);
				this.obj_integrity = this.max_integrity;
				(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
				user.visible_message(`${user.name} has repaired ${this}.`, "<span class='notice'>You finish repairing the airlock.</span>");
				yield* this.update_icon();
			}
		}
	} else {
		to_chat(user, "<span class='notice'>The airlock doesn't need repairing.</span>");
	}
	return f.dot;
}, true);

// airlock.dm:1201
rt.def("/obj/machinery/door/airlock/proc/weld_checks", function weld_checks(f: Frame, W: Value, user: Value) {
	return ((((((!this.operating ? 1 : 0) && this.density) && user) && W) && W.isOn()) && user.loc);
}, false, { argTypes: [{ type: 4, path: "/obj/item/weapon/weldingtool" }, { type: 8, path: "/mob" }] });

// airlock.dm:1205
rt.def("/obj/machinery/door/airlock/proc/try_to_crowbar", function* try_to_crowbar(f: Frame, I: Value, user: Value) {
	let beingcrowbarred: Value = null, F: Value = null, time_to_open: Value = null, result: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		beingcrowbarred = 1;
	} else {
		beingcrowbarred = 0;
	}
	if (this.panel_open && this.charge) {
		to_chat(user, `<span class='notice'>You carefully start removing ${this.charge} from ${this}...</span>`);
		playsound(rt.getStep(f, this, 0), I.usesound, 50, 1);
		if (!(yield* do_after(user, 150 * I.toolspeed, { target: this }))) {
			to_chat(user, `<span class='warning'>You slip and ${this.charge} detonates!</span>`);
			yield* this.charge.ex_act(1);
			yield* user.Knockdown(60);
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} removes ${this.charge} from ${this}.</span>`, `<span class='notice'>You gently pry out ${this.charge} from ${this} and unhook its wires.</span>`);
		yield* this.charge.forceMove(rt.getStep(f, user, 0));
		this.charge = null;
		return f.dot;
	}
	if (beingcrowbarred && this.density && this.welded && !this.operating && this.panel_open && !this.hasPower() && !this.locked) {
		playsound(this.loc, I.usesound, 100, 1);
		user.visible_message(`${user} removes the electronics from the airlock assembly.`, "<span class='notice'>You start to remove electronics from the airlock assembly...</span>");
		if (yield* do_after(user, 40 * I.toolspeed, { target: this })) {
			if (this.loc) {
				yield* this.deconstruct(1, user);
				return f.dot;
			}
		}
	} else if (this.hasPower()) {
		to_chat(user, "<span class='warning'>The airlock's motors resist your efforts to force it!</span>");
	} else if (this.locked) {
		to_chat(user, "<span class='warning'>The airlock's bolts prevent it from being forced!</span>");
	} else if (!this.welded && !this.operating) {
		if (beingcrowbarred == 0) {
			if ((F = I).wielded) {
				rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1238", I, user, beingcrowbarred, F, time_to_open, result);
			} else {
				to_chat(user, "<span class='warning'>You need to be wielding the fire axe to do that!</span>");
			}
		} else {
			rt.spawnTail(f, 0, "/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1246", I, user, beingcrowbarred, F, time_to_open, result);
		}
	}
	if (!rt.istype(I, T("/obj/item/weapon/crowbar/power"))) return f.dot;
	if (this.isElectrified()) {
		yield* this.shock(user, 100);
		return f.dot;
	}
	if (!this.density) {
		return f.dot;
	}
	if (this.locked) {
		to_chat(user, "<span class='warning'>The bolts are down, it won't budge!</span>");
		return f.dot;
	}
	if (this.welded) {
		to_chat(user, "<span class='warning'>It's welded, it won't budge!</span>");
		return f.dot;
	}
	time_to_open = 5;
	if (!(this.hasPower() && !this.prying_so_hard)) return f.dot;
	time_to_open = 50;
	playsound(this, rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1);
	this.prying_so_hard = 1;
	result = (yield* do_after(user, time_to_open, { target: this }));
	this.prying_so_hard = 0;
	if (!result) return f.dot;
	yield* this.open(2);
	if (!(this.density && !(yield* this.open(2)))) return f.dot;
	to_chat(user, `<span class='warning'>Despite your attempts, the ${this} refuses to open.</span>`);
	return f.dot;
}, true);

// a spawn(0) body of /obj/machinery/door/airlock/proc/try_to_crowbar, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1246", function* (f: Frame, I: Value, user: Value, beingcrowbarred: Value, F: Value, time_to_open: Value, result: Value) {
	if (this.density) {
		yield* this.open(2);
	} else {
		yield* this.close(2);
	}
	return null;
});

// a spawn(0) body of /obj/machinery/door/airlock/proc/try_to_crowbar, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/door/airlock/proc/try_to_crowbar: spawn at game/machinery/doors/airlock.dm:1238", function* (f: Frame, I: Value, user: Value, beingcrowbarred: Value, F: Value, time_to_open: Value, result: Value) {
	if (this.density) {
		yield* this.open(2);
	} else {
		yield* this.close(2);
	}
	return null;
});

// airlock.dm:1281
rt.def("/obj/machinery/door/airlock/plasma/proc/attackby", function* attackby(f: Frame, C: Value, user: Value, params: Value) {
	let $0: any, $1: any;
	if (C.is_hot() > 300) {
		$0 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (this) {
			$1 = `${`(${this.x},${this.y},${this.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${this.x};Y=${this.y};Z=${this.z}'>JMP</a>)`}`;
		} else {
			$1 = "nonexistent location";
		}
		message_admins(`Plasma airlock ignited by ${$0} in ${`${$1}`}`);
		log_game(`Plasma wall ignited by ${key_name(user)} in ${`(${this.x},${this.y},${this.z})`}`);
		yield* this.ignite(C.is_hot());
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// airlock.dm:1290
rt.def("/obj/machinery/door/airlock/proc/open_failure_reason", function open_failure_reason(f: Frame) {
	if (this.operating) {
		return null;
	}
	if (this.locked) {
		return "it's bolted!";
	}
	if (this.welded) {
		return "it's welded!";
	}
	if (!this.hasPower() || this.wires.is_cut("Open")) {
		return "no power!";
	}
	return null;
});

// airlock.dm:1300
rt.def("/obj/machinery/door/airlock/proc/open", function* open(f: Frame, forced: Value) {
	let H: Value = null;
	forced ??= 0;
	if (this.operating || this.welded || this.locked) {
		return 0;
	}
	if (!forced) {
		if (!this.hasPower() || this.wires.is_cut("Open")) {
			return 0;
		}
	}
	if (this.charge && !this.detonated) {
		this.panel_open = 1;
		yield* this.update_icon(AIRLOCK_OPENING);
		this.visible_message(`<span class='warning'>${this}'s panel is blown off in a spray of deadly shrapnel!</span>`);
		this.charge.loc = rt.getStep(f, this, 0);
		yield* this.charge.ex_act(1);
		this.detonated = 1;
		this.charge = null;
		for (H of each(orange(2, this), T("/mob/living/carbon/human"))) {
			yield* H.Unconscious(160);
			yield* H.adjust_fire_stacks(20);
			yield* H.IgniteMob();
			yield* H.apply_damage(40, "brute", "chest");
		}
		return f.dot;
	}
	if (forced < 2) {
		if (this.emagged) {
			return 0;
		}
		yield* this.use_power(50);
		playsound(this.loc, this.doorOpen, 30, 1);
		if (this.closeOther !== null && rt.istype(this.closeOther, T("/obj/machinery/door/airlock")) && !this.closeOther.density) {
			yield* this.closeOther.close();
		}
	} else {
		playsound(this.loc, rt.rsc("sound/machines/airlockforced.ogg"), 30, 1);
	}
	if (this.autoclose && this.normalspeed) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/proc/autoclose"))), 150);
	} else if (this.autoclose && !this.normalspeed) {
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/proc/autoclose"))), 15);
	}
	if (!this.density) {
		return 1;
	}
	this.operating = 1;
	yield* this.update_icon(AIRLOCK_OPENING, 1);
	this.set_opacity(0);
	yield* sleep(5);
	this.density = 0;
	yield* sleep(9);
	this.layer = OPEN_DOOR_LAYER;
	yield* this.update_icon(AIRLOCK_OPEN, 1);
	this.set_opacity(0);
	this.operating = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	if (this.delayed_close_requested) {
		this.delayed_close_requested = 0;
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/airlock/proc/close"))), 2);
	}
	return 1;
}, true);

// airlock.dm:1355
rt.def("/obj/machinery/door/airlock/proc/close", function* close(f: Frame, forced: Value) {
	let M: Value = null, killthis: Value = null;
	forced ??= 0;
	if (this.operating || this.welded || this.locked) {
		return f.dot;
	}
	if (!forced) {
		if (!this.hasPower() || this.wires.is_cut("Bolts")) {
			return f.dot;
		}
	}
	if (this.safe) {
		for (M of each(rt.getStep(f, this, 0), T("/atom/movable"))) {
			if (M.density && M != this) {
				yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/door/proc/autoclose"))), 60);
				return f.dot;
			}
		}
	}
	if (forced < 2) {
		if (this.emagged) {
			return f.dot;
		}
		yield* this.use_power(50);
		playsound(this.loc, this.doorClose, 30, 1);
	} else {
		playsound(this.loc, rt.rsc("sound/machines/airlockforced.ogg"), 30, 1);
	}
	if (killthis = rt.locateIn(f, T("/obj/structure/window"), rt.getStep(f, this, 0))) {
		yield* killthis.ex_act(2);
	}
	if (this.density) {
		return 1;
	}
	this.operating = 1;
	yield* this.update_icon(AIRLOCK_CLOSING, 1);
	this.layer = CLOSED_DOOR_LAYER;
	if (this.air_tight) {
		this.density = 1;
	}
	yield* sleep(5);
	this.density = AIRLOCK_CLOSED;
	if (!this.safe) {
		yield* this.crush();
	}
	yield* sleep(9);
	yield* this.update_icon(AIRLOCK_CLOSED, 1);
	if (this.visible && !this.glass) {
		this.set_opacity(1);
	}
	this.operating = 0;
	this.delayed_close_requested = 0;
	this.air_update_turf(1);
	this.update_freelook_sight();
	if (this.safe) {
		yield* this.CheckForMobs();
	}
	return 1;
}, true);

// airlock.dm:1404
rt.def("/obj/machinery/door/airlock/proc/prison_open", function* prison_open(f: Frame) {
	if (this.emagged) {
		return f.dot;
	}
	this.locked = 0;
	yield* this.open();
	this.locked = 1;
	return f.dot;
}, true);

// airlock.dm:1411
rt.def("/obj/machinery/door/airlock/proc/change_paintjob", function* change_paintjob(f: Frame, W: Value, user: Value) {
	let optionlist: Value = null;
	if (!W.can_use(user)) {
		return f.dot;
	}
	if (this.airlock_material == "glass") {
		optionlist = list("Public", "Public2", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance");
	} else {
		optionlist = list("Public", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Mining", "Maintenance", "External", "High Security");
	}
	let paintjob: Value = (yield* g.op(f, "Prompt", [0], [null, null, "Please select a paintjob for this airlock.", user, optionlist]));
	if (!(get_dist(this, f.usr) <= 1) && this.loc != f.usr || !(yield* W.use(user))) {
		return f.dot;
	}
	if (paintjob === "Public") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/public.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_0");
	} else if (paintjob === "Public2") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_glass");
	} else if (paintjob === "Engineering") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_eng");
	} else if (paintjob === "Atmospherics") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_atmo");
	} else if (paintjob === "Security") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/security.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_sec");
	} else if (paintjob === "Command") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/command.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_com");
	} else if (paintjob === "Medical") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/medical.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_med");
	} else if (paintjob === "Research") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/research.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_research");
	} else if (paintjob === "Mining") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/mining.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_min");
	} else if (paintjob === "Maintenance") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_mai");
	} else if (paintjob === "External") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/external/external.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_ext");
	} else if (paintjob === "High Security") {
		this.icon = rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi");
		this.overlays_file = rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi");
		this.assemblytype = T("/obj/structure/door_assembly/door_assembly_highsecurity");
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// airlock.dm:1476
rt.def("/obj/machinery/door/airlock/proc/CanAStarPass", function CanAStarPass(f: Frame, ID: Value) {
	return ((!this.density ? 1 : 0) || ((this.check_access(ID) && (!this.locked ? 1 : 0)) && this.hasPower()));
});

// airlock.dm:1479
rt.def("/obj/machinery/door/airlock/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	if (!(!this.operating && this.density && this.hasPower() && !this.emagged)) return f.dot;
	this.operating = 1;
	yield* this.update_icon(AIRLOCK_EMAG, 1);
	yield* sleep(6);
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	this.operating = 0;
	if (!(yield* this.open())) {
		yield* this.update_icon(AIRLOCK_CLOSED, 1);
	}
	this.emagged = 1;
	this.desc = "<span class='warning'>Its access panel is smoking slightly.</span>";
	this.lights = 0;
	this.locked = 1;
	this.loseMainPower();
	this.loseBackupPower();
	return f.dot;
}, true);

// airlock.dm:1496
rt.def("/obj/machinery/door/airlock/proc/attack_alien", function* attack_alien(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.isElectrified()) {
		yield* this.shock(user, 100);
		return f.dot;
	}
	if (!this.density) {
		return f.dot;
	}
	if (this.locked || this.welded) {
		to_chat(user, `<span class='warning'>${this} refuses to budge!</span>`);
		return f.dot;
	}
	user.visible_message(`<span class='warning'>${user} begins prying open ${this}.</span>`, `<span class='noticealien'>You begin digging your claws into ${this} with all your might!</span>`, "<span class='warning'>You hear groaning metal...</span>");
	let time_to_open: Value = 5;
	if (this.hasPower()) {
		time_to_open = 50;
		playsound(this, rt.rsc("sound/machines/airlock_alien_prying.ogg"), 100, 1);
	}
	if (!(yield* do_after(user, time_to_open, { target: this }))) return f.dot;
	if (!(this.density && !(yield* this.open(2)))) return f.dot;
	to_chat(user, `<span class='warning'>Despite your efforts, ${this} managed to resist your attempts to open it!</span>`);
	return f.dot;
}, true);

// airlock.dm:1520
rt.def("/obj/machinery/door/airlock/proc/hostile_lockdown", function* hostile_lockdown(f: Frame, origin: Value) {
	if (!(this.canAIControl(this) && !this.stat)) return f.dot;
	this.locked = 0;
	this.safe = 0;
	yield* this.close();
	this.bolt();
	this.set_electrified(ELECTRIFIED_PERMANENT);
	if (!origin) return f.dot;
	this.shockedby += `[${time_stamp()}]${origin}(ckey:${origin.ckey})`;
	return f.dot;
}, true);

// airlock.dm:1532
rt.def("/obj/machinery/door/airlock/proc/disable_lockdown", function* disable_lockdown(f: Frame) {
	if (!(this.canAIControl(this) && !this.stat)) return f.dot;
	this.unbolt();
	this.set_electrified(NOT_ELECTRIFIED);
	yield* this.open();
	this.safe = 1;
	return f.dot;
}, true);

// airlock.dm:1540
rt.def("/obj/machinery/door/airlock/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (!(!rt.bitAnd(this.stat, 1) && !rt.bitAnd(this.flags, NODECONSTRUCT))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	if (!this.panel_open) {
		this.panel_open = 1;
	}
	yield* this.wires.cut_all();
	yield* this.update_icon();
	return f.dot;
}, true);

// airlock.dm:1548
rt.def("/obj/machinery/door/airlock/proc/set_electrified", function set_electrified(f: Frame, seconds: Value) {
	this.secondsElectrified = seconds;
	this.diag_hud_set_electrified();
	return f.dot;
});

// airlock.dm:1552
rt.def("/obj/machinery/door/airlock/proc/take_damage", function* take_damage(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = "brute";
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	f.dot = (yield* parent_proc());
	if (!(this.obj_integrity < 0.75 * this.max_integrity)) return f.dot;
	yield* this.update_icon();
	return f.dot;
}, true, { args: ["damage_amount", "damage_type", "damage_flag", "sound_effect", "attack_dir"] });

// airlock.dm:1558
rt.def("/obj/machinery/door/airlock/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value, user: Value) {
	let A: Value = null, ae: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.assemblytype) {
			(A = (yield* new_(this.assemblytype, this.loc))).heat_proof_finished = this.heat_proof;
		} else {
			A = (yield* new_(T("/obj/structure/door_assembly/door_assembly_0"), this.loc));
		}
		A.created_name = this.name;
		if (!disassembled) {
			if (A) {
				A.obj_integrity = A.max_integrity * 0.5;
			}
		} else if (this.emagged) {
			if (user) {
				to_chat(user, "<span class='warning'>You discard the damaged electronics.</span>");
			}
		} else {
			if (user) {
				to_chat(user, "<span class='notice'>You remove the airlock electronics.</span>");
			}
			if (!this.electronics) {
				ae = (yield* new_(T("/obj/item/weapon/electronics/airlock"), this.loc));
				this.gen_access();
				if (rt.len(f, this.req_one_access)) {
					ae.one_access = 1;
					ae.accesses = this.req_one_access;
				} else {
					ae.accesses = this.req_access;
				}
			} else {
				ae = this.electronics;
				this.electronics = null;
				ae.loc = this.loc;
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// airlock.dm:1594
rt.def("/obj/machinery/door/airlock/proc/rcd_vals", function rcd_vals(f: Frame, user: Value, the_rcd: Value) {
	if (the_rcd.mode === RCD_DECONSTRUCT) {
		return rt.alist(f, ["mode", RCD_DECONSTRUCT, "delay", 50, "cost", 32]);
	}
	return 0;
});

// airlock.dm:1600
rt.def("/obj/machinery/door/airlock/proc/rcd_act", function* rcd_act(f: Frame, user: Value, the_rcd: Value, passed_mode: Value) {
	if (passed_mode === RCD_DECONSTRUCT) {
		to_chat(user, "<span class='notice'>You deconstruct the airlock.</span>");
		yield* qdel(this);
		return 1;
	}
	return 0;
}, true);

// airlock.dm:1608
rt.def("/obj/machinery/door/airlock/proc/note_type", function note_type(f: Frame) {
	if (!this.note) {
		return f.dot;
	} else {
		if (rt.istype(this.note, T("/obj/item/weapon/paper"))) {
			return "note";
		}
		if (!rt.istype(this.note, T("/obj/item/weapon/photo"))) return f.dot;
		return "photo";
	}
});
