// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/_drone.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(4841, "/mob/living/simple_animal/drone", "/mob/living/simple_animal", {
	staticChoice: "static",
	staticChoices: null,
	picked: 0,
	colour: "grey",
	drone_overlays: null,
	laws: "1. You may not involve yourself in the matters of another being, even if such matters conflict with Law Two or Law Three, unless the other being is another Drone.\n2. You may not harm any being, regardless of intent or circumstance.\n3. Your goals are to build, maintain, repair, improve, and provide power to the best of your abilities, You must never actively work against these goals.",
	light_on: 0,
	heavy_emp_damage: 25,
	alarms: null,
	internal_storage: null,
	head: null,
	default_hatmask: null,
	seeStatic: 1,
	visualAppearence: "drone_maint",
	hacked: 0,
	can_be_held: 1,
	flavortext: "\n<big><span class='warning'>DO NOT INTERFERE WITH THE ROUND AS A DRONE OR YOU WILL BE DRONE BANNED</span></big>\n<span class='notify'>Drones are a ghost role that are allowed to fix the station and build things. Interfering with the round as a drone is against the rules.</span>\n<span class='notify'>Actions that constitute interference include, but are not limited to:</span>\n<span class='notify'>     - Interacting with round critical objects (IDs, weapons, contraband, powersinks, bombs, etc.)</span>\n<span class='notify'>     - Interacting with living beings (communication, attacking, healing, etc.)</span>\n<span class='notify'>     - Interacting with non-living beings (dragging bodies, looting bodies, etc.)</span>\n<span class='warning'>These rules are at admin discretion and will be heavily enforced.</span>\n<span class='warning'><u>If you do not have the regular drone laws, follow your laws to the best of your ability.</u></span>",
	default_storage: rt.typePath("/obj/item/weapon/storage/backpack/duffelbag/drone"),
	pass_flags: 17,
	initial_language_holder: rt.typePath("/datum/language_holder/drone"),
	hud_possible: null,
	name: "Drone",
	desc: "A maintenance drone, an expendable robot built to perform station repairs.",
	icon: rt.rsc("icons/mob/drone.dmi"),
	icon_state: "drone_maint_grey",
	icon_living: "drone_maint_grey",
	icon_dead: "drone_maint_dead",
	health: 30,
	maxHealth: 30,
	unsuitable_atmos_damage: 0,
	wander: 0,
	speed: 0,
	ventcrawler: 2,
	healable: 0,
	density: 0,
	sight: 24,
	status_flags: 11,
	gender: "neuter",
	voice_name: "synthesized chirp",
	speak_emote: null,
	bubble_icon: "machine",
	mob_size: 1,
	has_unlimited_silicon_privilege: 1,
	damage_coeff: null,
	staticOverlays: null,
	unique_name: 1,
	faction: null,
	dextrous: 1,
	dextrous_hud_type: rt.typePath("/datum/hud/dextrous/drone"),
});

// _drone.dm:54
rt.def("/mob/living/simple_animal/drone/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.hud_possible = list("8", "9", "15");
	this.staticChoices = list("static", "blank", "letter", "animal");

	this.drone_overlays = rt.op(f, "CreateMultidimensionalList", [1], [2]);

	this.alarms = rt.alist(f, ["Atmosphere", list(), "Fire", list(), "Power", list()]);

	this.speak_emote = list("chirps");
	this.damage_coeff = rt.alist(f, ["brute", 1, "fire", 1, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);

	this.staticOverlays = list();
	this.faction = list("neutral", "silicon", "turret");
	return f.dot;
});

// _drone.dm:81
rt.def("/mob/living/simple_animal/drone/proc/Initialize", function* Initialize(f: Frame) {
	let I: Value = null, SF: Value = null, diag_hud: Value = null;
	f.dot = (yield* parent_proc());
	this.access_card = (yield* new_(T("/obj/item/weapon/card/id"), this));
	let C: Value = (yield* new_(T("/datum/job/captain")));
	this.access_card.access = C.get_access();
	if (this.default_storage) {
		yield* this.equip_to_slot_or_del((I = (yield* new_(this.default_storage, this))), slot_generic_dextrous_storage);
	}
	if (this.default_hatmask) {
		yield* this.equip_to_slot_or_del((I = (yield* new_(this.default_hatmask, this))), slot_head);
	}
	(rt.modField(f, this.access_card, "flags", NODROP, rt.bitOr));
	this.alert_drones(`<span class='notice'>DRONE NETWORK: ${this.name} connected.</span>`);
	if (this.seeStatic) {
		yield* (SF = (yield* new_(T("/datum/action/generic/drone/select_filter"), this))).Grant(this);
	} else {
		this.verbs -= P("/mob/living/simple_animal/drone/verb/toggle_statics");
	}
	(diag_hud = rt.index(GLOB.huds, DATA_HUD_DIAGNOSTIC)).add_to_hud(this);
	return f.dot;
}, true);

// _drone.dm:110
rt.def("/mob/living/simple_animal/drone/proc/med_hud_set_health", function med_hud_set_health(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "9");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	holder.icon_state = `huddiag${RoundDiagBar(this.health / this.maxHealth)}`;
	return f.dot;
});

// _drone.dm:116
rt.def("/mob/living/simple_animal/drone/proc/med_hud_set_status", function med_hud_set_status(f: Frame) {
	let holder: Value = rt.at(this.hud_list, "8");
	let I: Value = icon(this.icon, this.icon_state, this.dir);
	holder.pixel_y = I.Height() - rt.world().icon_size;
	if (this.stat == 2) {
		holder.icon_state = "huddead2";
	} else if (this.incapacitated()) {
		holder.icon_state = "hudoffline";
	} else {
		holder.icon_state = "hudstat";
	}
	return f.dot;
});

// _drone.dm:126
rt.def("/mob/living/simple_animal/drone/proc/Destroy", function* Destroy(f: Frame) {
	yield* qdel(this.access_card);
	return (yield* parent_proc());
}, true);

// _drone.dm:130
rt.def("/mob/living/simple_animal/drone/proc/Login", function* Login(f: Frame) {
	yield* parent_proc();
	this.check_laws();
	if (this.flavortext) {
		to_chat(this, `${this.flavortext}`);
	}
	this.updateSeeStaticMobs();
	if (this.picked) return f.dot;
	yield* this.pickVisualAppearence();
	return f.dot;
}, true);

// _drone.dm:143
rt.def("/mob/living/simple_animal/drone/proc/death", function* death(f: Frame, gibbed: Value) {
	yield* parent_proc(gibbed);
	if (this.internal_storage) {
		yield* this.dropItemToGround(this.internal_storage);
	}
	if (this.head) {
		yield* this.dropItemToGround(this.head);
	}
	this.alert_drones(`<span class='danger'>DRONE NETWORK: ${this.name} is not responding.</span>`);
	return f.dot;
}, true);

// _drone.dm:153
rt.def("/mob/living/simple_animal/drone/proc/gib", function* gib(f: Frame) {
	yield* this.dust();
	return f.dot;
}, true);

// _drone.dm:156
rt.def("/mob/living/simple_animal/drone/proc/ratvar_act", function* ratvar_act(f: Frame) {
	let R: Value = null;
	if (rt.bitAnd(this.status_flags, 4096)) {
		return f.dot;
	}
	if (this.internal_storage) {
		yield* this.dropItemToGround(this.internal_storage);
	}
	if (this.head) {
		yield* this.dropItemToGround(this.head);
	}
	yield* (R = (yield* new_(T("/mob/living/simple_animal/drone/cogscarab/ratvar"), this.loc))).setDir(this.dir);
	if (this.mind) {
		yield* this.mind.transfer_to(R, 1);
	} else {
		R.key = this.key;
	}
	yield* qdel(this);
	return f.dot;
}, true);

// _drone.dm:173
rt.def("/mob/living/simple_animal/drone/proc/examine", function examine(f: Frame, user: Value) {
	let I: Value = null;
	let $0: any, $1: any, $e: any;
	let msg: Value = fmt("<span class='info'>*---------*\nThis is ＀ ＇<b>！</b>!\n", [bicon(this), this]);
	for (I of each(this.held_items, T("/obj/item"))) {
		if (!rt.bitAnd(I.flags, ABSTRACT)) {
			if (I.blood_DNA) {
				$0 = bicon(I);
				if (I.gender == "plural") {
					$1 = "some";
				} else {
					$1 = "a";
				}
				msg += `<span class='warning'>It has ${$0} ${$1} blood-stained ${I.name} in its ${this.get_held_index_name(this.get_held_index_of_item(I))}!</span>\n`;
			} else {
				msg += fmt("It has ＀ ＇！ in its ＀.\n", [bicon(I), I, this.get_held_index_name(this.get_held_index_of_item(I))]);
			}
		}
	}
	if (this.internal_storage && !rt.bitAnd(this.internal_storage.flags, ABSTRACT)) {
		if (this.internal_storage.blood_DNA) {
			$0 = bicon(this.internal_storage);
			if (this.internal_storage.gender == "plural") {
				$1 = "some";
			} else {
				$1 = "a";
			}
			msg += `<span class='warning'>It is holding ${$0} ${$1} blood-stained ${this.internal_storage.name} in its internal storage!</span>\n`;
		} else {
			msg += fmt("It is holding ＀ ＇！ in its internal storage.\n", [bicon(this.internal_storage), this.internal_storage]);
		}
	}
	if (this.head && !rt.bitAnd(this.head.flags, ABSTRACT)) {
		if (this.head.blood_DNA) {
			$0 = bicon(this.head);
			if (this.head.gender == "plural") {
				$1 = "some";
			} else {
				$1 = "a";
			}
			msg += `<span class='warning'>It is wearing ${$0} ${$1} blood-stained ${this.head.name} on its head!</span>\n`;
		} else {
			msg += fmt("It is wearing ＀ ＇！ on its head.\n", [bicon(this.head), this.head]);
		}
	}
	if (!this.client && this.stat != 2) {
		msg += "Its status LED is blinking at a steady rate.\n";
	}
	if (this.hacked) {
		msg += "<span class='warning'>Its display is glowing red!</span>\n";
	}
	if (this.health != this.maxHealth) {
		if (this.health > this.maxHealth * 0.33) {
			msg += "<span class='warning'>Its screws are slightly loose.</span>\n";
		} else {
			msg += "<span class='boldwarning'>Its screws are very loose!</span>\n";
		}
	}
	if (this.stat == 2) {
		if (this.client) {
			msg += "<span class='deadsay'>A message repeatedly flashes on its display: \"REBOOT -- REQUIRED\".</span>\n";
		} else {
			msg += "<span class='deadsay'>A message repeatedly flashes on its display: \"ERROR -- OFFLINE\".</span>\n";
		}
	}
	msg += "*---------*</span>";
	to_chat(user, msg);
	return f.dot;
});

// _drone.dm:227
rt.def("/mob/living/simple_animal/drone/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	yield* this.Stun(100);
	to_chat(this, "<span class='danger'><b>ER@%R: MME^RY CO#RU9T!</b> R&$b@0tin)...</span>");
	if (severity != 1) return f.dot;
	yield* this.adjustBruteLoss(this.heavy_emp_damage);
	to_chat(this, "<span class='userdanger'>HeAV% DA%^MMA+G TO I/O CIR!%UUT!</span>");
	return f.dot;
}, true);

// _drone.dm:235
rt.def("/mob/living/simple_animal/drone/proc/triggerAlarm", function triggerAlarm(f: Frame, _class: Value, A: Value, O: Value, alarmsource: Value) {
	let I: Value = null, alarm: Value = null, sources: Value = null;
	if (alarmsource.z != this.z) {
		return f.dot;
	}
	if (this.stat == 2) return f.dot;
	let L: Value = rt.index(this.alarms, _class);
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			sources = rt.index(alarm, 2);
			if (!rt.isIn(f, alarmsource, sources)) {
				sources += alarmsource;
			}
			return f.dot;
		}
	}
	rt.setAt(L, A.name, list(A, list(alarmsource)));
	to_chat(this, `--- ${_class} alarm detected in ${A.name}!`);
	return f.dot;
});

// _drone.dm:251
rt.def("/mob/living/simple_animal/drone/proc/cancelAlarm", function cancelAlarm(f: Frame, _class: Value, A: Value, origin: Value) {
	let I: Value = null, alarm: Value = null, srcs: Value = null;
	if (this.stat == 2) return f.dot;
	let L: Value = rt.index(this.alarms, _class);
	let cleared: Value = 0;
	for (I of each(L)) {
		if (I == A.name) {
			alarm = rt.index(L, I);
			srcs = rt.index(alarm, 2);
			if (rt.isIn(f, origin, srcs)) {
				srcs -= origin;
			}
			if (rt.len(f, srcs) == 0) {
				cleared = 1;
				L -= I;
			}
		}
	}
	if (!cleared) return f.dot;
	to_chat(this, `--- ${_class} alarm in ${A.name} has been cleared.`);
	return f.dot;
});

// _drone.dm:271
rt.def("/mob/living/simple_animal/drone/proc/flash_act", function* flash_act(f: Frame) {
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!f.args[2]) return f.dot;
	return (yield* parent_proc());
}, true, { args: ["intensity", "override_blindness_check", "affect_silicon"] });

// _drone.dm:277
rt.def("/mob/living/simple_animal/drone/proc/mob_has_gravity", function mob_has_gravity(f: Frame) {
	return (parent_proc() || this.mob_negates_gravity());
});
