// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/extra_drone_types.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(4845, "/mob/living/simple_animal/drone/syndrone", "/mob/living/simple_animal/drone", {
	picked: 1,
	initial_language_holder: rt.typePath("/datum/language_holder/drone/syndicate"),
	heavy_emp_damage: 10,
	laws: "1. Interfere.\n2. Kill.\n3. Destroy.",
	seeStatic: 0,
	hacked: 1,
	flavortext: null,
	name: "Syndrone",
	desc: "A modified maintenance drone. This one brings with it the feeling of terror.",
	icon_state: "drone_synd",
	icon_living: "drone_synd",
	health: 30,
	maxHealth: 120,
	faction: null,
	speak_emote: null,
	bubble_icon: "syndibot",
	default_storage: rt.typePath("/obj/item/device/radio/uplink"),
	default_hatmask: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi"),
});

// extra_drone_types.dm:21
rt.def("/mob/living/simple_animal/drone/syndrone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.faction = list("syndicate");

	this.speak_emote = list("hisses");
	return f.dot;
});

// extra_drone_types.dm:36
rt.def("/mob/living/simple_animal/drone/syndrone/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.internal_storage.hidden_uplink.telecrystals = 10;
	return f.dot;
}, true);

// extra_drone_types.dm:40
rt.def("/mob/living/simple_animal/drone/syndrone/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	to_chat(this, "<span class='notice'>You can kill and eat other drones to increase your health!</span>");
	return f.dot;
}, true);

rt.type(4846, "/mob/living/simple_animal/drone/syndrone/badass", "/mob/living/simple_animal/drone/syndrone", {
	name: "Badass Syndrone",
	default_hatmask: rt.typePath("/obj/item/clothing/head/helmet/space/hardsuit/syndi/elite"),
	default_storage: rt.typePath("/obj/item/device/radio/uplink/nuclear"),
});

// extra_drone_types.dm:49
rt.def("/mob/living/simple_animal/drone/syndrone/badass/proc/Initialize", function* Initialize(f: Frame) {
	let W: Value = null;
	yield* parent_proc();
	this.internal_storage.hidden_uplink.telecrystals = 30;
	yield* (W = (yield* new_(T("/obj/item/weapon/implant/weapons_auth"), this))).implant(this);
	return f.dot;
}, true);

rt.type(4847, "/mob/living/simple_animal/drone/snowflake", "/mob/living/simple_animal/drone", {
	default_hatmask: rt.typePath("/obj/item/clothing/head/chameleon/drone"),
});

// extra_drone_types.dm:58
rt.def("/mob/living/simple_animal/drone/snowflake/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.desc += " This drone appears to have a complex holoprojector built on its 'head'.";
	return f.dot;
}, true);

rt.type(4849, "/mob/living/simple_animal/drone/polymorphed", "/mob/living/simple_animal/drone", {
	default_hatmask: null,
	picked: 1,
	default_storage: null,
});

// extra_drone_types.dm:82
rt.def("/mob/living/simple_animal/drone/polymorphed/proc/Initialize", function* Initialize(f: Frame) {
	let colour: Value = null;
	f.dot = (yield* parent_proc());
	this.liberate();
	this.visualAppearence = pick("drone_maint", "drone_repair", "drone_scout");
	if (this.visualAppearence == "drone_maint") {
		colour = pick("grey", "blue", "red", "green", "pink", "orange");
		this.icon_state = `${this.visualAppearence}_${colour}`;
	} else {
		this.icon_state = this.visualAppearence;
	}
	this.icon_living = this.icon_state;
	this.icon_dead = `${this.visualAppearence}_dead`;
	return f.dot;
}, true);

rt.type(4842, "/mob/living/simple_animal/drone/cogscarab", "/mob/living/simple_animal/drone", {
	pass_flags: 1,
	verb_ask: "requests",
	verb_exclaim: "proclaims",
	verb_whisper: "imparts",
	verb_yell: "harangues",
	initial_language_holder: rt.typePath("/datum/language_holder/clockmob"),
	light_color: "#E42742",
	name: "cogscarab",
	desc: "A strange, drone-like machine. It constantly emits the hum of gears.",
	icon_state: "drone_clock",
	icon_living: "drone_clock",
	icon_dead: "drone_clock_dead",
	picked: 1,
	health: 50,
	maxHealth: 50,
	harm_intent_damage: 5,
	density: 1,
	speed: 1,
	ventcrawler: 0,
	faction: null,
	speak_emote: null,
	bubble_icon: "clock",
	heavy_emp_damage: 0,
	laws: "0. Purge all untruths and honor Ratvar.",
	seeStatic: 0,
	hacked: 1,
	visualAppearence: "drone_clock",
	can_be_held: 0,
	flavortext: "<span class='heavy_brass'>You are a cogscarab</span><b>, a clockwork creation of Ratvar. As a cogscarab, you have low health, an inbuilt fabricator that can convert brass to power, a set of relatively fast tools, </b><span class='heavy_brass'>can communicate over the Hierophant Network with :b</span><b>, and are immune to extreme temperatures and pressures. \nYour goal is to serve the Justiciar and his servants by repairing and defending all they create.</b>",
	default_storage: rt.typePath("/obj/item/weapon/storage/toolbox/brass/prefilled"),
});

// extra_drone_types.dm:144
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.set_light(2, 0.5);
	yield* qdel(this.access_card);
	this.access_card = null;
	this.verbs -= P("/mob/living/simple_animal/drone/verb/check_laws");
	this.verbs -= P("/mob/living/simple_animal/drone/verb/toggle_light");
	this.verbs -= P("/mob/living/simple_animal/drone/verb/drone_ping");
	return f.dot;
}, true);

// extra_drone_types.dm:153
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Login", function* Login(f: Frame) {
	let $1: any;
	yield* parent_proc();
	yield* add_servant_of_ratvar(this, 1);
	let $0: any = this;
	if (GLOB.ratvar_awakens) {
		$1 = "";
	} else {
		$1 = ", <i>excluding a clockwork slab</i>";
	}
	to_chat($0, `<b>You yourself are one of these servants, and will be able to utilize almost anything they can${$1}.</b>`);
	return f.dot;
}, true);

// extra_drone_types.dm:161
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/alert_drones", function alert_drones(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[0] == `<span class='notice'>DRONE NETWORK: ${this.name} connected.</span>`) {
		f.args[0] = `<span class='brass'><i>Hierophant Network:</i> ${this.name} activated.</span>`;
	} else if (f.args[0] == `<span class='danger'>DRONE NETWORK: ${this.name} is not responding.</span>`) {
		f.args[0] = `<span class='brass'><i>Hierophant Network:</i></span> <span class='alloy'>${this.name} disabled.</span>`;
	}
	parent_proc();
	return f.dot;
}, false, { args: ["msg", "dead_can_hear"] });

// extra_drone_types.dm:168
rt.def("/mob/living/simple_animal/drone/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	if (rt.istype(I, T("/obj/item/weapon/screwdriver")) && this.stat == 2) {
		yield* this.try_reactivate(user);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// extra_drone_types.dm:174
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/try_reactivate", function* try_reactivate(f: Frame, user: Value) {
	if (!is_servant_of_ratvar(user)) {
		to_chat(user, `<span class='warning'>You fiddle around with ${this} to no avail.</span>`);
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// extra_drone_types.dm:185
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/get_armor_effectiveness", function get_armor_effectiveness(f: Frame) {
	if (GLOB.ratvar_awakens) {
		return 1;
	}
	return parent_proc();
});

// extra_drone_types.dm:197
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/drone_chat", function drone_chat(f: Frame, msg: Value) {
	titled_hierophant_message(this, msg, "nezbere", "brass", "Construct");
	return f.dot;
});

// extra_drone_types.dm:200
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/ratvar_act", function* ratvar_act(f: Frame) {
	yield* this.fully_heal(1);
	return f.dot;
}, true);

// extra_drone_types.dm:203
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/update_icons", function update_icons(f: Frame) {
	if (this.stat != 2) {
		if (this.incapacitated()) {
			this.icon_state = `${this.visualAppearence}_flipped`;
		} else {
			this.icon_state = this.visualAppearence;
		}
	} else {
		this.icon_state = `${this.visualAppearence}_dead`;
	}
	return f.dot;
});

// extra_drone_types.dm:212
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Stun", function* Stun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// extra_drone_types.dm:217
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/SetStun", function* SetStun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// extra_drone_types.dm:222
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/AdjustStun", function* AdjustStun(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canstun"] });

// extra_drone_types.dm:227
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/Knockdown", function* Knockdown(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });

// extra_drone_types.dm:232
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/SetKnockdown", function* SetKnockdown(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });

// extra_drone_types.dm:237
rt.def("/mob/living/simple_animal/drone/cogscarab/proc/AdjustKnockdown", function* AdjustKnockdown(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	f.dot = (yield* parent_proc());
	if (!f.dot) return f.dot;
	yield* this.update_icons();
	return f.dot;
}, true, { args: ["amount", "updating", "ignore_canknockdown"] });
