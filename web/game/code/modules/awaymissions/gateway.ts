// Based on /tg/station's code/modules/awaymissions/gateway.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// gateway.dm:1
rt.def("/datum/controller/global_vars/proc/InitGlobalthe_gateway", function InitGlobalthe_gateway(f: Frame) {
	GLOB.the_gateway = null;
	this.gvars_datum_init_order += "the_gateway";
	return f.dot;
});

rt.type(10339, "/obj/machinery/gateway", "/obj/machinery", {
	active: 0,
	checkparts: 1,
	randomspawns: null,
	calibrated: 1,
	linked: null,
	can_link: 0,
	anchored: 1,
	name: "gateway",
	desc: "A mysterious gateway built by unknown hands, it allows for faster than light travel to far-flung locations.",
	icon: rt.rsc("icons/obj/machines/gateway.dmi"),
	icon_state: "off",
	density: 1,
	resistance_flags: 115,
});

// gateway.dm:13
rt.def("/obj/machinery/gateway/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.randomspawns = list();

	this.linked = list();
	return f.dot;
});

// gateway.dm:19
rt.def("/obj/machinery/gateway/proc/Initialize", function* Initialize(f: Frame) {
	this.randomspawns = GLOB.awaydestinations;
	yield* this.update_icon();
	if (!rt.istype(this, T("/obj/machinery/gateway/centerstation")) && !rt.istype(this, T("/obj/machinery/gateway/centeraway"))) {
		if (this.dir === 2 || this.dir === 6 || this.dir === 10) {
			this.density = 0;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// gateway.dm:28
rt.def("/obj/machinery/gateway/proc/toggleoff", function toggleoff(f: Frame) {
	let G: Value = null;
	for (G of each(this.linked, T("/obj/machinery/gateway"))) {
		G.active = 0;
		G.update_icon();
	}
	this.active = 0;
	this.update_icon();
	return f.dot;
});

// gateway.dm:35
rt.def("/obj/machinery/gateway/proc/detect", function detect(f: Frame) {
	let i: Value = null, G: Value = null;
	if (!this.can_link) {
		return 0;
	}
	this.linked = list();
	let _T: Value = this.loc;
	let ready: Value = 0;
	for (i of each(GLOB.alldirs)) {
		_T = rt.getStep(f, this.loc, i);
		if (G = rt.locateIn(f, T("/obj/machinery/gateway"), _T)) {
			this.linked.Add(G);
			continue;
		}
		ready = 0;
		this.toggleoff();
		break;
	}
	if (rt.len(f, this.linked) == 8 || !this.checkparts) {
		ready = 1;
	}
	return ready;
});

// gateway.dm:59
rt.def("/obj/machinery/gateway/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "on";
		return f.dot;
	}
	this.icon_state = "off";
	return f.dot;
});

// gateway.dm:68
rt.def("/obj/machinery/gateway/proc/attack_hand", function attack_hand(f: Frame, user: Value) {
	if (!this.detect()) {
		return f.dot;
	}
	if (!this.active) {
		this.toggleon(user);
		return f.dot;
	}
	this.toggleoff();
	return f.dot;
});

rt.type(10340, "/obj/machinery/gateway/centerstation", "/obj/machinery/gateway", {
	wait: 0,
	awaygate: null,
	density: 1,
	icon_state: "offcenter",
	use_power: 1,
	can_link: 1,
});

// gateway.dm:79
rt.def("/obj/machinery/gateway/centerstation/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	if (GLOB.the_gateway) return f.dot;
	GLOB.the_gateway = this;
	return f.dot;
}, true);

// gateway.dm:84
rt.def("/obj/machinery/gateway/centerstation/proc/Destroy", function* Destroy(f: Frame) {
	if (GLOB.the_gateway == this) {
		GLOB.the_gateway = null;
	}
	return (yield* parent_proc());
}, true);

// gateway.dm:100
rt.def("/obj/machinery/gateway/centerstation/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	this.wait = rt.worldTime(f) + GLOB.config.gateway_delay;
	this.awaygate = rt.locateIn(f, T("/obj/machinery/gateway/centeraway"), rt.world());
	return f.dot;
}, true);

// gateway.dm:107
rt.def("/obj/machinery/gateway/centerstation/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "oncenter";
		return f.dot;
	}
	this.icon_state = "offcenter";
	return f.dot;
});

// gateway.dm:112
rt.def("/obj/machinery/gateway/centerstation/proc/process", function process(f: Frame) {
	if (rt.bitAnd(this.stat, 2) && this.use_power) {
		if (this.active) {
			this.toggleoff();
		}
		return f.dot;
	}
	if (!this.active) return f.dot;
	this.use_power(5000);
	return f.dot;
}, false, { waitfor: false });

// gateway.dm:121
rt.def("/obj/machinery/gateway/centerstation/proc/toggleon", function toggleon(f: Frame, user: Value) {
	let G: Value = null;
	if (!this.detect()) {
		return f.dot;
	}
	if (!this.powered()) {
		return f.dot;
	}
	if (!this.awaygate) {
		to_chat(user, "<span class='notice'>Error: No destination found.</span>");
		return f.dot;
	}
	if (rt.worldTime(f) < this.wait) {
		to_chat(user, `<span class='notice'>Error: Warpspace triangulation in progress. Estimated time to completion: ${round((this.wait - rt.worldTime(f)) / 10 / 60)} minutes.</span>`);
		return f.dot;
	}
	for (G of each(this.linked, T("/obj/machinery/gateway"))) {
		G.active = 1;
		G.update_icon();
	}
	this.active = 1;
	this.update_icon();
	return f.dot;
});

// gateway.dm:140
rt.def("/obj/machinery/gateway/centerstation/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let M: Value = null, dest: Value = null;
	if (!this.active) {
		return f.dot;
	}
	if (!this.detect()) {
		return f.dot;
	}
	if (!this.awaygate || !this.awaygate || this.awaygate.gc_destroyed) {
		return f.dot;
	}
	if (this.awaygate.calibrated) {
		yield* AM.forceMove(rt.getStep(f, this.awaygate.loc, 2));
		yield* AM.setDir(2);
		if (ismob(AM)) {
			if ((M = AM).client) {
				M.client.move_delay = max(rt.worldTime(f) + 5, M.client.move_delay);
			}
		}
		return f.dot;
	} else {
		if (dest = pick(this.randomspawns)) {
			yield* AM.forceMove(rt.getStep(f, dest, 0));
			yield* AM.setDir(2);
			yield* this.use_power(5000);
		}
		return f.dot;
	}
}, true);

rt.type(10341, "/obj/machinery/gateway/centeraway", "/obj/machinery/gateway", {
	stationgate: null,
	density: 1,
	icon_state: "offcenter",
	use_power: 0,
	can_link: 1,
});

// gateway.dm:164
rt.def("/obj/machinery/gateway/centeraway/proc/attackby", function attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (!rt.istype(W, T("/obj/item/device/multitool"))) return f.dot;
	if (this.calibrated) {
		to_chat(user, " The gate is already calibrated, there is no work for you to do here.");
		return f.dot;
	} else {
		to_chat(user, "<span class='boldnotice'>Recalibration successful!</span>:  This gate's systems have been fine tuned.  Travel to this gate will now be on target.");
		this.calibrated = 1;
		return f.dot;
	}
});

// gateway.dm:185
rt.def("/obj/machinery/gateway/centeraway/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	yield* this.update_icon();
	this.stationgate = rt.locateIn(f, T("/obj/machinery/gateway/centerstation"), rt.world());
	return f.dot;
}, true);

// gateway.dm:192
rt.def("/obj/machinery/gateway/centeraway/proc/update_icon", function update_icon(f: Frame) {
	if (this.active) {
		this.icon_state = "oncenter";
		return f.dot;
	}
	this.icon_state = "offcenter";
	return f.dot;
});

// gateway.dm:197
rt.def("/obj/machinery/gateway/centeraway/proc/toggleon", function toggleon(f: Frame, user: Value) {
	let G: Value = null;
	if (!this.detect()) {
		return f.dot;
	}
	if (!this.stationgate) {
		to_chat(user, "<span class='notice'>Error: No destination found.</span>");
		return f.dot;
	}
	for (G of each(this.linked, T("/obj/machinery/gateway"))) {
		G.active = 1;
		G.update_icon();
	}
	this.active = 1;
	this.update_icon();
	return f.dot;
});

// gateway.dm:210
rt.def("/obj/machinery/gateway/centeraway/proc/check_exile_implant", function check_exile_implant(f: Frame, C: Value) {
	let E: Value = null;
	for (E of each(C.implants, T("/obj/item/weapon/implant/exile"))) {
		to_chat(C, " The station gate has detected your exile implant and is blocking your entry.");
		return 1;
	}
	return 0;
});

// gateway.dm:216
rt.def("/obj/machinery/gateway/centeraway/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let C: Value = null, M: Value = null;
	if (!this.detect()) {
		return f.dot;
	}
	if (!this.active) {
		return f.dot;
	}
	if (!this.stationgate || !this.stationgate || this.stationgate.gc_destroyed) {
		return f.dot;
	}
	if (rt.istype(AM, T("/mob/living/carbon"))) {
		if (this.check_exile_implant(AM)) {
			return f.dot;
		}
	} else {
		for (C of each(AM.contents, T("/mob/living/carbon"))) {
			if (this.check_exile_implant(C)) {
				yield* this.say(`Rejecting ${AM}: Exile implant detected in contained lifeform.`);
				return f.dot;
			}
		}
	}
	if (AM.has_buckled_mobs()) {
		C = null;
		for (C of each(AM.buckled_mobs, T("/mob/living/carbon"))) {
			if (this.check_exile_implant(C)) {
				yield* this.say(`Rejecting ${AM}: Exile implant detected in close proximity lifeform.`);
				return f.dot;
			}
		}
	}
	yield* AM.forceMove(rt.getStep(f, this.stationgate.loc, 2));
	yield* AM.setDir(2);
	if (!ismob(AM)) return f.dot;
	if (!(M = AM).client) return f.dot;
	M.client.move_delay = max(rt.worldTime(f) + 5, M.client.move_delay);
	return f.dot;
}, true);
