// Based on /tg/station's code/modules/mob/living/silicon/pai/pai.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4839, "/mob/living/silicon/pai", "/mob/living/silicon", {
	network: "SS13",
	current: null,
	ram: 100,
	software: null,
	userDNA: null,
	card: null,
	speakStatement: "states",
	speakExclamation: "declares",
	speakDoubleExclamation: "alarms",
	speakQuery: "queries",
	cable: null,
	master: null,
	master_dna: null,
	temp: null,
	screen: null,
	subscreen: null,
	pda: null,
	secHUD: 0,
	medHUD: 0,
	medicalActive1: null,
	medicalActive2: null,
	securityActive1: null,
	securityActive2: null,
	hackdoor: null,
	hackprogress: 0,
	sradio: null,
	holoform: 0,
	canholo: 1,
	access_card: null,
	chassis: "repairbot",
	possible_chassis: null,
	emitterhealth: 20,
	emittermaxhealth: 20,
	emitterregen: 0.25,
	emittercd: 50,
	emitteroverloadcd: 100,
	emittersemicd: 0,
	overload_ventcrawl: 0,
	overload_bulletblock: 0,
	overload_maxhealth: 0,
	silent: 0,
	hit_slowdown: 0,
	brightness_power: 5,
	slowdown: 0,
	available_software: null,
	pass_flags: 17,
	name: "pAI",
	icon: rt.rsc("icons/mob/pai.dmi"),
	icon_state: "repairbot",
	mouse_opacity: 2,
	density: 0,
	luminosity: 0,
	mob_size: 0,
	desc: "A generic pAI mobile hard-light holographics emitter. It seems to be deactivated.",
	weather_immunities: null,
	health: 500,
	maxHealth: 500,
	canmove: 0,
});

// pai.dm:18
rt.def("/mob/living/silicon/pai/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.software = list();
	this.possible_chassis = list("cat", "mouse", "monkey", "corgi", "fox", "repairbot", "rabbit");
	this.available_software = rt.alist(f, ["crew manifest", 5, "digital messenger", 5, "medical records", 15, "security records", 15, "door jack", 30, "atmosphere sensor", 5, "security HUD", 20, "medical HUD", 20, "universal translator", 35, "remote signaller", 5]);

	this.weather_immunities = list("ash");
	return f.dot;
});

// pai.dm:77
rt.def("/mob/living/silicon/pai/proc/movement_delay", function movement_delay(f: Frame) {
	f.dot = parent_proc();
	f.dot += this.slowdown;
	return f.dot;
});

// pai.dm:81
rt.def("/mob/living/silicon/pai/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.pai_list -= this;
	return (yield* parent_proc());
}, true);

// pai.dm:85
rt.def("/mob/living/silicon/pai/proc/Initialize", function* Initialize(f: Frame) {
	let newcardloc: Value = null, AS: Value = null, AC: Value = null, AR: Value = null, AL: Value = null, ALM: Value = null;
	let _P: Value = this.loc;
	if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	GLOB.pai_list += this;
	yield* this.make_laws();
	this.canmove = 0;
	if (!rt.istype(_P, T("/obj/item/device/paicard"))) {
		(_P = (yield* new_(T("/obj/item/device/paicard"), (newcardloc = _P)))).setPersonality(this);
	}
	this.loc = _P;
	this.card = _P;
	this.sradio = (yield* new_(T("/obj/item/radio/integrated/signal"), this));
	if (!this.radio) {
		this.radio = (yield* new_(T("/obj/item/device/radio"), this));
	}
	this.pda = (yield* new_(T("/obj/item/device/pda/ai/pai"), this));
	rt.spawnTail(f, 5, "/mob/living/silicon/pai/proc/Initialize: spawn at modules/mob/living/silicon/pai/pai.dm:102", _P, newcardloc, AS, AC, AR, AL, ALM);
	yield* parent_proc();
	AS = (yield* new_(T("/datum/action/innate/pai/shell")));
	AC = (yield* new_(T("/datum/action/innate/pai/chassis")));
	AR = (yield* new_(T("/datum/action/innate/pai/rest")));
	AL = (yield* new_(T("/datum/action/innate/pai/light")));
	ALM = (yield* new_(T("/datum/action/language_menu")));
	yield* AS.Grant(this);
	yield* AC.Grant(this);
	yield* AR.Grant(this);
	yield* AL.Grant(this);
	yield* ALM.Grant(this);
	this.emittersemicd = 1;
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/mob/living/silicon/pai/proc/emittercool"))), 600);
	return f.dot;
}, true);

// a spawn(5) body of /mob/living/silicon/pai/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/silicon/pai/proc/Initialize: spawn at modules/mob/living/silicon/pai/pai.dm:102", function* (f: Frame, _P: Value, newcardloc: Value, AS: Value, AC: Value, AR: Value, AL: Value, ALM: Value) {
	this.pda.ownjob = "pAI Messenger";
	this.pda.owner = `${this}`;
	this.pda.name = this.pda.owner + " (" + this.pda.ownjob + ")";
	return null;
});

// pai.dm:124
rt.def("/mob/living/silicon/pai/proc/make_laws", function make_laws(f: Frame) {
	this.laws = new_(T("/datum/ai_laws/pai"));
	return 1;
});

// pai.dm:128
rt.def("/mob/living/silicon/pai/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	rt.op(f, "BrowseResource", [], [f.usr, rt.rsc("html/paigrid.png"), null], false);
	if (!this.client) return f.dot;
	this.client.perspective = 1;
	if (this.holoform) {
		this.client.eye = this;
	} else {
		this.client.eye = this.card;
	}
	return f.dot;
}, true);

// pai.dm:138
rt.def("/mob/living/silicon/pai/proc/Stat", function* Stat(f: Frame) {
	yield* parent_proc();
	if (!statpanel("Status")) return f.dot;
	if (!this.stat) {
		stat(null, `Emitter Integrity: ${this.emitterhealth * (100 / this.emittermaxhealth)}`);
	} else {
		stat(null, "Systems nonfunctional");
	}
	return f.dot;
}, true);

rt.type(157, "/datum/action/innate/pai", "/datum/action/innate", {
	P: null,
	name: "PAI Action",
});

// pai.dm:167
rt.def("/datum/action/innate/pai/proc/Trigger", function Trigger(f: Frame) {
	if (!rt.istype(this.owner, T("/mob/living/silicon/pai"))) {
		return 0;
	}
	this.P = this.owner;
	return f.dot;
});

rt.type(158, "/datum/action/innate/pai/shell", "/datum/action/innate/pai", {
	name: "Toggle Holoform",
	button_icon_state: "pai_holoform",
	background_icon_state: "bg_tech",
});

// pai.dm:177
rt.def("/datum/action/innate/pai/shell/proc/Trigger", function* Trigger(f: Frame) {
	yield* parent_proc();
	if (this.P.holoform) {
		yield* this.P.fold_in(0);
	} else {
		yield* this.P.fold_out();
	}
	return f.dot;
}, true);

rt.type(159, "/datum/action/innate/pai/chassis", "/datum/action/innate/pai", {
	name: "Holochassis Appearence Composite",
	button_icon_state: "pai_chassis",
	background_icon_state: "bg_tech",
});

// pai.dm:189
rt.def("/datum/action/innate/pai/chassis/proc/Trigger", function* Trigger(f: Frame) {
	yield* parent_proc();
	yield* this.P.choose_chassis();
	return f.dot;
}, true);

rt.type(160, "/datum/action/innate/pai/rest", "/datum/action/innate/pai", {
	name: "Rest",
	button_icon_state: "pai_rest",
	background_icon_state: "bg_tech",
});

// pai.dm:198
rt.def("/datum/action/innate/pai/rest/proc/Trigger", function* Trigger(f: Frame) {
	yield* parent_proc();
	yield* this.P.lay_down();
	return f.dot;
}, true);

rt.type(161, "/datum/action/innate/pai/light", "/datum/action/innate/pai", {
	name: "Toggle Integrated Lights",
	button_icon_state: "emp",
	background_icon_state: "bg_tech",
});

// pai.dm:206
rt.def("/datum/action/innate/pai/light/proc/Trigger", function Trigger(f: Frame) {
	parent_proc();
	this.P.toggle_integrated_light();
	return f.dot;
});

// pai.dm:210
rt.def("/mob/living/silicon/pai/proc/Process_Spacemove", function* Process_Spacemove(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) {
		this.slowdown = 2;
		return 1;
	}
	this.slowdown = rt.initial(f, this, "slowdown");
	return 1;
}, true, { args: ["movement_dir"] });

// pai.dm:218
rt.def("/mob/living/silicon/pai/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `A personal AI in holochassis mode. Its master ID string seems to be ${this.master}.`);
	return f.dot;
}, false);

// pai.dm:222
rt.def("/mob/living/silicon/pai/proc/Life", function* Life(f: Frame) {
	let _T: Value = null;
	if (this.stat == 2) {
		return f.dot;
	}
	if (this.cable) {
		if (get_dist(this, this.cable) > 1) {
			(_T = rt.getStep(f, this.loc, 0)).visible_message(`<span class='warning'>${this.cable} rapidly retracts back into its spool.</span>`, "<span class='italics'>You hear a click and the sound of wire spooling rapidly.</span>");
			yield* qdel(this.cable);
			this.cable = null;
		}
	}
	this.silent = max(this.silent - 1, 0);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true, { waitfor: false });

// pai.dm:234
rt.def("/mob/living/silicon/pai/proc/updatehealth", function updatehealth(f: Frame) {
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	this.health = this.maxHealth - this.getBruteLoss() - this.getFireLoss();
	this.update_stat();
	return f.dot;
});

// pai.dm:241
rt.def("/mob/living/silicon/pai/proc/process", function process(f: Frame) {
	this.emitterhealth = max(-50, min(this.emitterhealth + this.emitterregen, this.emittermaxhealth));
	this.hit_slowdown = max(0, min(this.hit_slowdown - 1, 100));
	return f.dot;
}, false, { waitfor: false });
