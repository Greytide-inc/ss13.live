// Based on /tg/station's code/controllers/subsystem/npcpool.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(31, "/datum/controller/subsystem/npcpool", "/datum/controller/subsystem", {
	canBeUsed: null,
	needsDelegate: null,
	needsAssistant: null,
	processing: null,
	currentrun: null,
	stage: null,
	z_has_client: null,
	name: "NPC Pool",
	flags: 69,
	priority: 20,
	runlevels: 12,
});

// npcpool.dm:6
rt.def("/datum/controller/subsystem/npcpool/proc/New", function* New(f: Frame) {
	if (GLOB.SSnpcpool != this) {
		if (rt.istype(GLOB.SSnpcpool, T("/datum/controller/subsystem/npcpool"))) {
			yield* this.Recover();
			yield* qdel(GLOB.SSnpcpool);
		}
		GLOB.SSnpcpool = this;
	}
	this.PreInit();
	return f.dot;
}, true);

// npcpool.dm:12
rt.def("/datum/controller/subsystem/npcpool/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.canBeUsed = list();

	this.needsDelegate = list();

	this.needsAssistant = list();

	this.processing = list();

	this.currentrun = list();

	this.z_has_client = list();
	return f.dot;
});

// npcpool.dm:22
rt.def("/datum/controller/subsystem/npcpool/proc/stat_entry", function* stat_entry(f: Frame) {
	yield* parent_proc(`NPCS:${rt.len(f, this.processing)}|D:${rt.len(f, this.needsDelegate)}|A:${rt.len(f, this.needsAssistant)}|U:${rt.len(f, this.canBeUsed)}`);
	return f.dot;
}, true);

// npcpool.dm:25
rt.def("/datum/controller/subsystem/npcpool/proc/stop_processing", function stop_processing(f: Frame, I: Value) {
	this.processing -= I;
	this.currentrun -= I;
	this.needsDelegate -= I;
	this.canBeUsed -= I;
	this.needsAssistant -= I;
	return f.dot;
});

// npcpool.dm:32
rt.def("/datum/controller/subsystem/npcpool/proc/npc_z_asleep", function npc_z_asleep(f: Frame, H: Value) {
	let _T: Value = null;
	if (H.target) {
		return 0;
	}
	if (!(_T = rt.getStep(f, H, 0))) {
		return 0;
	}
	return (!rt.index(this.z_has_client, `${_T.z}`) ? 1 : 0);
});

// npcpool.dm:48
rt.def("/datum/controller/subsystem/npcpool/proc/fire", function fire(f: Frame, resumed: Value) {
	let C: Value = null, _T: Value = null, SA: Value = null, thing: Value = null, checkInRange: Value = null, check: Value = null, candidate: Value = null, helpProb: Value = null, chfac: Value = null, canfac: Value = null, facCount: Value = null, C_8: Value = null;
	let $0: any, $e: any;
	resumed ??= 0;
	if (!resumed) {
		this.currentrun = GLOB.simple_animals.Copy();
		this.stage = 0;
		this.z_has_client.len = 0;
		for (C of each(GLOB.clients, T("/client"))) {
			if (_T = rt.getStep(f, C.mob, 0)) {
				rt.setAt(this.z_has_client, `${_T.z}`, 1);
			}
			if (C.eye && C.eye != C.mob) {
				if (_T = rt.getStep(f, C.eye, 0)) {
					rt.setAt(this.z_has_client, `${_T.z}`, 1);
				}
			}
		}
	}
	let currentrun: Value = this.currentrun;
	if (this.stage == 0) {
		while (rt.len(f, currentrun)) {
			SA = rt.index(currentrun, rt.len(f, currentrun));
			--currentrun.len;
			if (!SA.ckey && !(rt.istype(SA, T("/mob/living/simple_animal/hostile")) && this.npc_z_asleep(SA))) {
				if (SA.stat != 2) {
					SA.handle_automated_movement();
				}
				if (SA.stat != 2) {
					SA.handle_automated_action();
				}
				if (SA.stat != 2) {
					SA.handle_automated_speech();
				}
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				return f.dot;
			}
		}
		this.stage = 1;
		currentrun = this.processing.Copy();
		this.currentrun = currentrun;
	}
	let canBeUsed: Value = this.canBeUsed;
	if (this.stage == 1) {
		while (rt.len(f, currentrun)) {
			thing = rt.index(currentrun, rt.len(f, currentrun));
			--currentrun.len;
			thing.InteractiveProcess();
			checkInRange = view(MAX_RANGE_FIND, thing);
			if (thing.IsDeadOrIncap(0) || !rt.locateIn(f, thing.TARGET, checkInRange)) {
				this.needsDelegate += thing;
			} else if (rt.bitAnd(thing.doing, FIGHTING)) {
				this.needsAssistant += thing;
			} else {
				canBeUsed += thing;
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				return f.dot;
			}
		}
		this.stage = 2;
		currentrun = this.needsDelegate;
		this.currentrun = currentrun;
	}
	if (this.stage == 2) {
		while (rt.len(f, currentrun) && rt.len(f, canBeUsed)) {
			check = rt.index(currentrun, rt.len(f, currentrun));
			candidate = rt.index(canBeUsed, rt.len(f, canBeUsed));
			--currentrun.len;
			helpProb = 0;
			chfac = check.faction;
			canfac = candidate.faction;
			facCount = rt.length(chfac) * rt.length(canfac);
			C_8 = null;
			for (C_8 of each(chfac)) {
				if (rt.isIn(f, C_8, canfac)) {
					if ((helpProb = min(100, helpProb + 25)) >= 100) {
						break;
					}
				}
			}
			if (facCount == 1 && helpProb) {
				helpProb = 100;
			}
			if (prob(helpProb) && candidate.takeDelegate(check)) {
				--canBeUsed.len;
				candidate.eye_color = "red";
				candidate.update_icons();
			}
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2 ? this.pause() : 0) {
				return f.dot;
			}
		}
		this.stage = 3;
		currentrun = this.needsAssistant;
		this.currentrun = currentrun;
	}
	while (rt.len(f, currentrun) && rt.len(f, canBeUsed)) {
		check = rt.index(currentrun, rt.len(f, currentrun));
		candidate = rt.index(canBeUsed, rt.len(f, canBeUsed));
		--currentrun.len;
		helpProb = 0;
		chfac = check.faction;
		canfac = candidate.faction;
		facCount = rt.length(chfac) * rt.length(canfac);
		C_8 = null;
		for (C_8 of each(chfac)) {
			if (rt.isIn(f, C_8, canfac)) {
				if ((helpProb = min(100, helpProb + 25)) >= 100) {
					break;
				}
			}
		}
		if (facCount == 1 && helpProb) {
			helpProb = 100;
		}
		if (prob(helpProb) && candidate.takeDelegate(check, 0)) {
			--canBeUsed.len;
			candidate.eye_color = "yellow";
			candidate.update_icons();
		}
		$0 = (!rt.len(f, currentrun) ? 1 : 0);
		if (!$0) {
			if (rt.tickUsage(f) > GLOB.current_ticklimit || this.state != 2) {
				$0 = this.pause();
			} else {
				$0 = 0;
			}
		}
		if ($0) {
			return f.dot;
		}
	}
	return f.dot;
});
