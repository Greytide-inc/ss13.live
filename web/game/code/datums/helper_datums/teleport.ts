// Based on /tg/station's code/datums/helper_datums/teleport.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


// teleport.dm:3
rt.def("/proc/do_teleport", function* do_teleport(f: Frame) {
	let D: Value = null;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (f.args[4] === null) {
		f.args[4] = null;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	if (f.args[6] === null) {
		f.args[6] = null;
	}
	if (f.args[7] === null) {
		f.args[7] = null;
	}
	if (yield* g.callName(f, (D = (yield* new_(T("/datum/teleport/instant/science")))), "start", [f.argsList], rt.Args.List)) {
		return 1;
	}
	return 0;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

rt.type(1047, "/datum/teleport", "/datum", {
	teleatom: null,
	destination: null,
	precision: 0,
	effectin: null,
	effectout: null,
	soundin: null,
	soundout: null,
	force_teleport: 1,
});

// teleport.dm:19
rt.def("/datum/teleport/proc/start", function* start(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (f.args[4] === null) {
		f.args[4] = null;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	if (f.args[6] === null) {
		f.args[6] = null;
	}
	if (f.args[7] === null) {
		f.args[7] = null;
	}
	if (!(yield* g.callSrc(f, "initTeleport", [f.argsList], rt.Args.List))) {
		return 0;
	}
	return 1;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

// teleport.dm:24
rt.def("/datum/teleport/proc/initTeleport", function* initTeleport(f: Frame, ateleatom: Value, adestination: Value, aprecision: Value, afteleport: Value, aeffectin: Value, aeffectout: Value, asoundin: Value, asoundout: Value) {
	if (!(yield* this.setTeleatom(ateleatom))) {
		return 0;
	}
	if (!(yield* this.setDestination(adestination))) {
		return 0;
	}
	if (!(yield* this.setPrecision(aprecision))) {
		return 0;
	}
	yield* this.setEffects(aeffectin, aeffectout);
	yield* this.setForceTeleport(afteleport);
	yield* this.setSounds(asoundin, asoundout);
	return 1;
}, true);

// teleport.dm:37
rt.def("/datum/teleport/proc/setPrecision", function setPrecision(f: Frame, aprecision: Value) {
	if (isnum(aprecision)) {
		this.precision = aprecision;
		return 1;
	}
	return 0;
});

// teleport.dm:44
rt.def("/datum/teleport/proc/setDestination", function setDestination(f: Frame, adestination: Value) {
	if (rt.istype(adestination, T("/atom"))) {
		this.destination = adestination;
		return 1;
	}
	return 0;
});

// teleport.dm:51
rt.def("/datum/teleport/proc/setTeleatom", function* setTeleatom(f: Frame, ateleatom: Value) {
	if (rt.istype(ateleatom, T("/obj/effect")) && !rt.istype(ateleatom, T("/obj/effect/dummy/chameleon"))) {
		yield* qdel(ateleatom);
		return 0;
	}
	if (rt.istype(ateleatom, T("/atom/movable"))) {
		this.teleatom = ateleatom;
		return 1;
	}
	return 0;
}, true);

// teleport.dm:62
rt.def("/datum/teleport/proc/setEffects", function setEffects(f: Frame, aeffectin: Value, aeffectout: Value) {
	this.effectin = rt.istype(aeffectin, T("/datum/effect_system")) ? aeffectin : null;
	this.effectout = rt.istype(aeffectout, T("/datum/effect_system")) ? aeffectout : null;
	return 1;
});

// teleport.dm:68
rt.def("/datum/teleport/proc/setForceTeleport", function setForceTeleport(f: Frame, afteleport: Value) {
	this.force_teleport = afteleport;
	return 1;
});

// teleport.dm:73
rt.def("/datum/teleport/proc/setSounds", function setSounds(f: Frame, asoundin: Value, asoundout: Value) {
	this.soundin = isfile(asoundin) ? asoundin : null;
	this.soundout = isfile(asoundout) ? asoundout : null;
	return 1;
});

// teleport.dm:84
rt.def("/datum/teleport/proc/playSpecials", function playSpecials(f: Frame, location: Value, effect: Value, sound: Value) {
	if (!location) return f.dot;
	if (effect) {
		ImmediateInvokeAsync(f.src, P("/datum/teleport/proc/do_effect"), location, effect);
	}
	if (!sound) return f.dot;
	ImmediateInvokeAsync(f.src, P("/datum/teleport/proc/do_sound"), location, sound);
	return f.dot;
});

// teleport.dm:90
rt.def("/datum/teleport/proc/do_effect", function* do_effect(f: Frame, location: Value, effect: Value) {
	f.src = null;
	yield* effect.attach(location);
	yield* effect.start();
	return f.dot;
}, true, { argTypes: [{ path: "/atom" }, { path: "/datum/effect_system" }] });

// teleport.dm:95
rt.def("/datum/teleport/proc/do_sound", function do_sound(f: Frame, location: Value, sound: Value) {
	f.src = null;
	playsound(location, sound, 60, 1);
	return f.dot;
}, false, { argTypes: [{ path: "/atom" }, {  }] });

// teleport.dm:101
rt.def("/datum/teleport/proc/doTeleport", function* doTeleport(f: Frame) {
	let destturf: Value = null, A: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	let curturf: Value = rt.getStep(f, this.teleatom, 0);
	if (!(destturf = get_teleport_turf(rt.getStep(f, this.destination, 0), this.precision)) || !curturf || destturf.is_transition_turf()) {
		return 0;
	}
	if ((A = get_area(curturf)).noteleport) {
		return 0;
	}
	yield* this.playSpecials(curturf, this.effectin, this.soundin);
	if (this.force_teleport) {
		yield* this.teleatom.forceMove(destturf);
		if (rt.istype(this.teleatom, T("/mob/living/simple_animal/hostile/megafauna"))) {
			$0 = this.teleatom;
			$1 = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.teleatom]);
			if (curturf) {
				$2 = `${`(${curturf.x},${curturf.y},${curturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${curturf.x};Y=${curturf.y};Z=${curturf.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			$2 = `${$2}`;
			if (destturf) {
				$3 = `${`(${destturf.x},${destturf.y},${destturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${destturf.x};Y=${destturf.y};Z=${destturf.z}'>JMP</a>)`}`;
			} else {
				$3 = "nonexistent location";
			}
			message_admins(`${$0} ${$1} has teleported from ${$2} to ${`${$3}`}.`);
		}
		yield* this.playSpecials(destturf, this.effectout, this.soundout);
	} else if (yield* this.teleatom.Move(destturf)) {
		yield* this.playSpecials(destturf, this.effectout, this.soundout);
		if (rt.istype(this.teleatom, T("/mob/living/simple_animal/hostile/megafauna"))) {
			$0 = this.teleatom;
			$1 = fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [this.teleatom]);
			if (curturf) {
				$2 = `${`(${curturf.x},${curturf.y},${curturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${curturf.x};Y=${curturf.y};Z=${curturf.z}'>JMP</a>)`}`;
			} else {
				$2 = "nonexistent location";
			}
			$2 = `${$2}`;
			if (destturf) {
				$3 = `${`(${destturf.x},${destturf.y},${destturf.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${destturf.x};Y=${destturf.y};Z=${destturf.z}'>JMP</a>)`}`;
			} else {
				$3 = "nonexistent location";
			}
			message_admins(`${$0} ${$1} has teleported from ${$2} to ${`${$3}`}.`);
		}
	}
	return 1;
}, true);

// teleport.dm:125
rt.def("/datum/teleport/proc/teleport", function* teleport(f: Frame) {
	if (yield* this.teleportChecks()) {
		return (yield* this.doTeleport());
	}
	return 0;
}, true);

rt.type(1048, "/datum/teleport/instant", "/datum/teleport", {});

// teleport.dm:132
rt.def("/datum/teleport/instant/proc/start", function* start(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[3] === null) {
		f.args[3] = 1;
	}
	if (f.args[4] === null) {
		f.args[4] = null;
	}
	if (f.args[5] === null) {
		f.args[5] = null;
	}
	if (f.args[6] === null) {
		f.args[6] = null;
	}
	if (f.args[7] === null) {
		f.args[7] = null;
	}
	if (yield* parent_proc()) {
		if (yield* this.teleport()) {
			return 1;
		}
	}
	return 0;
}, true, { args: ["ateleatom", "adestination", "aprecision", "afteleport", "aeffectin", "aeffectout", "asoundin", "asoundout"] });

rt.type(1049, "/datum/teleport/instant/science", "/datum/teleport/instant", {});

// teleport.dm:141
rt.def("/datum/teleport/instant/science/proc/setEffects", function setEffects(f: Frame, aeffectin: Value, aeffectout: Value) {
	let aeffect: Value = null;
	if (aeffectin === null || aeffectout === null) {
		(aeffect = new_(T("/datum/effect_system/spark_spread"))).set_up(5, 1, this.teleatom);
		this.effectin = (this.effectin || aeffect);
		this.effectout = (this.effectout || aeffect);
		return 1;
	} else {
		return parent_proc();
	}
}, false);

// teleport.dm:151
rt.def("/datum/teleport/instant/science/proc/setPrecision", function setPrecision(f: Frame, aprecision: Value) {
	let bagholding: Value = null, MM: Value = null;
	parent_proc();
	if (rt.istype(this.teleatom, T("/obj/item/weapon/storage/backpack/holding"))) {
		this.precision = rand(1, 100);
	}
	if (rt.len(f, (bagholding = this.teleatom.search_contents_for(T("/obj/item/weapon/storage/backpack/holding"))))) {
		this.precision = max(rand(1, 100) * rt.len(f, bagholding), 100);
		if (rt.istype(this.teleatom, T("/mob/living"))) {
			to_chat((MM = this.teleatom), "<span class='warning'>The bluespace interface on your bag of holding interferes with the teleport!</span>");
		}
	}
	return 1;
}, false);

// teleport.dm:166
rt.def("/proc/find_safe_turf", function find_safe_turf(f: Frame, zlevel: Value, zlevels: Value, extended_safety_checks: Value) {
	let cycle: Value = null, x: Value = null, y: Value = null, z: Value = null, random_location: Value = null, F: Value = null, A: Value = null, A_gases: Value = null, trace_gases: Value = null, id: Value = null, pressure: Value = null, L: Value = null;
	let $e: any;
	zlevel ??= ZLEVEL_STATION;
	extended_safety_checks ??= 0;
	if (!zlevels) {
		zlevels = list(zlevel);
	}
	let cycles: Value = 1000;
	rt.forRange(f, 0, 1, cycles, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		cycle = $e;
		x = rand(1, rt.world().maxx);
		y = rand(1, rt.world().maxy);
		z = pick(zlevels);
		if (!rt.istype((random_location = rt.locate(x, y, z)), T("/turf/open/floor"))) {
			continue;
		}
		if (!(F = random_location).air) {
			continue;
		}
		A = F.air;
		A_gases = A.gases;
		trace_gases = null;
		id = null;
		for (id of each(A_gases)) {
			if (rt.isIn(f, id, GLOB.hardcoded_gases)) {
				continue;
			}
			trace_gases = 1;
			break;
		}
		if (trace_gases) {
			continue;
		}
		if (!(rt.at(A_gases, "o2") && rt.index(rt.at(A_gases, "o2"), 1) >= 16)) {
			continue;
		}
		if (rt.at(A_gases, "plasma")) {
			continue;
		}
		if (rt.at(A_gases, "co2") && rt.index(rt.at(A_gases, "co2"), 1) >= 10) {
			continue;
		}
		if (A.temperature <= 270 || A.temperature >= 360) {
			continue;
		}
		if ((pressure = A.return_pressure()) <= 20 || pressure >= 550) {
			continue;
		}
		if (extended_safety_checks) {
			if (rt.istype(F, T("/turf/open/floor/plating/lava"))) {
				if (!(L = F).is_safe()) {
					continue;
				}
			}
		}
		return F;
	}
	rt.endFor(f, 0);
	return f.dot;
});

// teleport.dm:218
rt.def("/proc/get_teleport_turfs", function get_teleport_turfs(f: Frame, center: Value, precision: Value) {
	let _T: Value = null, A: Value = null;
	precision ??= 0;
	if (!precision) {
		return list(center);
	}
	let posturfs: Value = list();
	for (_T of each(range(precision, center), T("/turf"))) {
		if (_T.is_transition_turf()) {
			continue;
		}
		if (!(A = _T.loc).noteleport) {
			posturfs.Add(_T);
		}
	}
	return posturfs;
});

// teleport.dm:230
rt.def("/proc/get_teleport_turf", function get_teleport_turf(f: Frame, center: Value, precision: Value) {
	precision ??= 0;
	return safepick(get_teleport_turfs(center, precision));
});
