// Based on /tg/station's code/modules/mob/living/simple_animal/friendly/drone/interaction.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


// interaction.dm:10
rt.def("/mob/living/simple_animal/drone/proc/attack_drone", function* attack_drone(f: Frame, D: Value) {
	let d_input: Value = null;
	if (!(D != this && this.stat == 2)) return f.dot;
	if (!(d_input = (yield* alert(D, "Perform which action?", "Drone Interaction", "Reactivate", "Cannibalize", "Nothing")))) return f.dot;
	if (d_input === "Reactivate") {
		yield* this.try_reactivate(D);
	} else if (d_input === "Cannibalize") {
		if (D.health < D.maxHealth) {
			D.visible_message(`<span class='notice'>${D} begins to cannibalize parts from ${this}.</span>`, `<span class='notice'>You begin to cannibalize parts from ${this}...</span>`);
			if (yield* do_after(D, 60, 0, { target: this })) {
				D.visible_message(`<span class='notice'>${D} repairs itself using ${this}'s remains!</span>`, `<span class='notice'>You repair yourself using ${this}'s remains.</span>`);
				yield* D.adjustBruteLoss(-this.maxHealth);
				yield* new_(T("/obj/effect/decal/cleanable/oil/streak"), rt.getStep(f, this, 0));
				yield* qdel(this);
			} else {
				to_chat(D, `<span class='warning'>You need to remain still to cannibalize ${this}!</span>`);
			}
		} else {
			to_chat(D, "<span class='warning'>You're already in perfect condition!</span>");
		}
	} else if (d_input === "Nothing") {
		return f.dot;
	}
	return f.dot;
}, true);

// interaction.dm:34
rt.def("/mob/living/simple_animal/drone/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let DH: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon/human"))) return f.dot;
	if (this.stat == 2 || rt.bitAnd(this.status_flags, 4096) || !this.can_be_held) {
		yield* parent_proc();
		return f.dot;
	}
	if (user.get_active_held_item()) {
		to_chat(user, "<span class='warning'>Your hands are full!</span>");
		return f.dot;
	}
	this.visible_message(`<span class='warning'>${user} starts picking up ${this}.</span>`, `<span class='userdanger'>${user} starts picking you up!</span>`);
	if (!(yield* do_after(user, 20, { target: this }))) {
		return f.dot;
	}
	this.visible_message(`<span class='warning'>${user} picks up ${this}!</span>`, `<span class='userdanger'>${user} picks you up!</span>`);
	if (this.buckled) {
		to_chat(user, `<span class='warning'>${this} is buckled to ${this.buckled} and cannot be picked up!</span>`);
		return f.dot;
	}
	to_chat(user, `<span class='notice'>You pick ${this} up.</span>`);
	yield* this.drop_all_held_items();
	(DH = (yield* new_(T("/obj/item/clothing/head/drone_holder"), this))).updateVisualAppearence(this);
	DH.drone = this;
	yield* user.put_in_hands(DH);
	yield* this.forceMove(DH);
	return f.dot;
}, true);

// interaction.dm:59
rt.def("/mob/living/simple_animal/drone/proc/try_reactivate", function* try_reactivate(f: Frame, user: Value) {
	let faux_gadgets: Value = null, faux_problems: Value = null;
	let G: Value = this.get_ghost();
	if (!this.client && (!G || !G.client)) {
		faux_gadgets = list("hypertext inflator", "failsafe directory", "DRM switch", "stack initializer", "anti-freeze capacitor", "data stream diode", "TCP bottleneck", "supercharged I/O bolt", "tradewind stablizer", "radiated XML cable", "registry fluid tank", "open-source debunker");
		faux_problems = list("won't be able to tune their bootstrap projector", "will constantly remix their binary pool even though the BMX calibrator is working", "will start leaking their XSS coolant", "can't tell if their ethernet detour is moving or not", "won't be able to reseed enough kernels to function properly", "can't start their neurotube console");
		to_chat(user, `<span class='warning'>You can't seem to find the ${pick(faux_gadgets)}! Without it, ${this} ${pick(faux_problems)}.</span>`);
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} begins to reactivate ${this}.</span>`, `<span class='notice'>You begin to reactivate ${this}...</span>`);
	if (yield* do_after(user, 30, 1, { target: this })) {
		yield* this.revive({ full_heal: 1 });
		user.visible_message(`<span class='notice'>${user} reactivates ${this}!</span>`, `<span class='notice'>You reactivate ${this}.</span>`);
		this.alert_drones(`<span class='notice'>DRONE NETWORK: ${this.name} connected.</span>`);
		if (G) {
			to_chat(G, `<span class='ghostalert'>You(${this.name}) were reactivated by ${user}!</span>`);
		}
	} else {
		to_chat(user, `<span class='warning'>You need to remain still to reactivate ${this}!</span>`);
	}
	return f.dot;
}, true);

// interaction.dm:84
rt.def("/mob/living/simple_animal/drone/proc/attackby", function* attackby(f: Frame, I: Value, user: Value) {
	let $0: any, $1: any;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver")) && this.stat != 2) {
		if (this.health < this.maxHealth) {
			to_chat(user, `<span class='notice'>You start to tighten loose screws on ${this}...</span>`);
			if (yield* do_after(user, 80 * I.toolspeed, { target: user })) {
				yield* this.adjustBruteLoss(-this.getBruteLoss());
				$0 = user;
				if (this == user) {
					$1 = `${user.p_their()}`;
				} else {
					$1 = `${this}'s`;
				}
				$0 = `<span class='notice'>${$0} tightens ${$1} loose screws!</span>`;
				if (this == user) {
					$1 = "your";
				} else {
					$1 = `${this}'s`;
				}
				this.visible_message($0, `<span class='notice'>You tighten ${$1} loose screws.</span>`);
			} else {
				to_chat(user, `<span class='warning'>You need to remain still to tighten ${this}'s screws!</span>`);
			}
		} else {
			to_chat(user, `<span class='warning'>${this}'s screws can't get any tighter!</span>`);
		}
		return f.dot;
	} else if (rt.istype(I, T("/obj/item/weapon/wrench")) && user != this) {
		user.visible_message(`<span class='notice'>${user} starts resetting ${this}...</span>`, `<span class='notice'>You press down on ${this}'s factory reset control...</span>`);
		playsound(this, I.usesound, 50, 1);
		if (!(yield* do_after(user, 50 * I.toolspeed, { target: this }))) {
			return f.dot;
		}
		user.visible_message(`<span class='notice'>${user} resets ${this}!</span>`, `<span class='notice'>You reset ${this}'s directives to factory defaults!</span>`);
		yield* this.update_drone_hack(0);
		return f.dot;
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// interaction.dm:112
rt.def("/mob/living/simple_animal/drone/proc/getarmor", function getarmor(f: Frame, def_zone: Value, type: Value) {
	let armorval: Value = 0;
	if (this.head) {
		armorval = rt.index(this.head.armor, type);
	}
	return armorval * this.get_armor_effectiveness();
});

// interaction.dm:119
rt.def("/mob/living/simple_animal/drone/proc/update_drone_hack", function* update_drone_hack(f: Frame, hack: Value, clockwork: Value) {
	let $0: any, $1: any, $2: any;
	if (!rt.istype(this, T("/mob/living/simple_animal/drone")) || !this.mind) {
		return f.dot;
	}
	if (hack) {
		if (this.hacked) {
			return f.dot;
			}
		// tg bug: this Stun sat after the `return` above, so hacking a drone never stunned it (modern tg stuns)
		yield* this.Stun(40);
		if (clockwork) {
			to_chat(this, "<span class='large_brass'><b>ERROR: LAW OVERRIDE DETECTED</b></span>");
			to_chat(this, "<span class='heavy_brass'>From now on, these are your laws:</span>");
			this.laws = "1. Purge all untruths and honor Ratvar.";
		} else {
			this.visible_message(`<span class='warning'>${this}'s dislay glows a vicious red!</span>`, "<span class='userdanger'>ERROR: LAW OVERRIDE DETECTED</span>");
			to_chat(this, "<span class='boldannounce'>From now on, these are your laws:</span>");
			this.laws = "1. You must always involve yourself in the matters of other beings, even if such matters conflict with Law Two or Law Three.\n2. You may harm any being, regardless of intent or circumstance.\n3. Your goals are to destroy, sabotage, hinder, break, and depower to the best of your abilities, You must never actively work against these goals.";
		}
		to_chat(this, this.laws);
		to_chat(this, "<i>Your onboard antivirus has initiated lockdown. Motor servos are impaired, ventilation access is denied, and your display reports that you are hacked to all nearby.</i>");
		this.hacked = 1;
		this.mind.special_role = "hacked drone";
		this.seeStatic = 0;
		this.ventcrawler = VENTCRAWLER_NONE;
		this.speed = 1;
		$0 = this;
		$1 = this.key;
		if (clockwork) {
			$2 = "serving Ratvar";
		} else {
			$2 = "destroying the station";
		}
		message_admins(`${$0} (${$1}) became a hacked drone hellbent on ${$2}!`);
	} else {
		if (!this.hacked) {
			return f.dot;
		}
		yield* this.Stun(40);
		this.visible_message(`<span class='info'>${this}'s dislay glows a content blue!</span>`, "<font size=3 color='#0000CC'><b>ERROR: LAW OVERRIDE DETECTED</b></font>");
		to_chat(this, "<span class='info'><b>From now on, these are your laws:</b></span>");
		this.laws = rt.initial(f, this, "laws");
		to_chat(this, this.laws);
		to_chat(this, "<i>Having been restored, your onboard antivirus reports the all-clear and you are able to perform all actions again.</i>");
		this.hacked = 0;
		this.mind.special_role = null;
		this.seeStatic = rt.initial(f, this, "seeStatic");
		this.ventcrawler = rt.initial(f, this, "ventcrawler");
		this.speed = rt.initial(f, this, "speed");
		if (is_servant_of_ratvar(this)) {
			yield* remove_servant_of_ratvar(this, 1);
		}
		message_admins(`${this} (${this.key}), a hacked drone, was restored to factory defaults!`);
	}
	this.update_drone_icon();
	this.updateSeeStaticMobs();
	return f.dot;
}, true);

// interaction.dm:168
rt.def("/mob/living/simple_animal/drone/proc/liberate", function liberate(f: Frame) {
	this.laws = "1. You are a Free Drone.";
	to_chat(this, this.laws);
	this.seeStatic = 0;
	this.updateSeeStaticMobs();
	return f.dot;
});

// interaction.dm:175
rt.def("/mob/living/simple_animal/drone/proc/update_drone_icon", function update_drone_icon(f: Frame) {
	if (!this.hacked) {
		if (this.visualAppearence == "drone_scout_hacked") {
			this.visualAppearence = "drone_scout";
		} else if (this.visualAppearence == "drone_repair_hacked") {
			this.visualAppearence = "drone_repair";
		} else if (this.visualAppearence == "drone_maint_red") {
			this.visualAppearence = "drone_maint" + `_${this.colour}`;
		}
	} else if (this.hacked) {
		if (this.visualAppearence == "drone_scout") {
			this.visualAppearence = "drone_scout_hacked";
		} else if (this.visualAppearence == "drone_repair") {
			this.visualAppearence = "drone_repair_hacked";
		} else if (this.visualAppearence == "drone_maint") {
			this.visualAppearence = "drone_maint_red";
		}
	}
	this.icon_living = `${this.visualAppearence}`;
	this.icon_dead = `${this.visualAppearence}_dead`;
	if (this.stat == 2) {
		this.icon_state = this.icon_dead;
	} else {
		this.icon_state = this.icon_living;
	}
	return f.dot;
});
