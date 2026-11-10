// Based on /tg/station's code/modules/projectiles/guns/ballistic.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, fmt } = rt;


rt.type(5201, "/obj/item/weapon/gun/ballistic", "/obj/item/weapon/gun", {
	spawnwithmagazine: 1,
	magazine: null,
	casing_ejector: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm"),
	desc: "Now comes in flavors like GUN. Uses 10mm ammo, for some reason",
	name: "projectile gun",
	icon_state: "pistol",
	origin_tech: "combat=2;materials=2",
	w_class: 3,
});

// ballistic.dm:13
rt.def("/obj/item/weapon/gun/ballistic/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.spawnwithmagazine) {
		yield* this.update_icon();
		return f.dot;
	}
	if (!this.magazine) {
		this.magazine = (yield* new_(this.mag_type, this));
	}
	yield* this.chamber_round();
	yield* this.update_icon();
	return f.dot;
}, true);

// ballistic.dm:23
rt.def("/obj/item/weapon/gun/ballistic/proc/update_icon", function update_icon(f: Frame) {
	parent_proc();
	if (this.current_skin) {
		this.icon_state = `${this.current_skin}${this.suppressed ? "-suppressed" : ""}${this.sawn_state ? "-sawn" : ""}`;
	} else {
		this.icon_state = `${rt.initial(f, this, "icon_state")}${this.suppressed ? "-suppressed" : ""}${this.sawn_state ? "-sawn" : ""}`;
	}
	return f.dot;
});

// ballistic.dm:31
rt.def("/obj/item/weapon/gun/ballistic/proc/process_chamber", function* process_chamber(f: Frame, empty_chamber: Value) {
	let AC: Value = null;
	empty_chamber ??= 1;
	if (rt.istype((AC = this.chambered), T("/obj/item/ammo_casing"))) {
		if (this.casing_ejector) {
			yield* AC.forceMove(rt.getStep(f, this, 0));
			AC.SpinAnimation(10, 1);
			this.chambered = null;
		} else if (empty_chamber) {
			this.chambered = null;
		}
	}
	yield* this.chamber_round();
	return f.dot;
}, true);

// ballistic.dm:43
rt.def("/obj/item/weapon/gun/ballistic/proc/chamber_round", function* chamber_round(f: Frame) {
	if (this.chambered || !this.magazine) {
		return f.dot;
	} else {
		if (!this.magazine.ammo_count()) return f.dot;
		this.chambered = this.magazine.get_round();
		yield* this.chambered.forceMove(this);
	}
	return f.dot;
}, true);

// ballistic.dm:50
rt.def("/obj/item/weapon/gun/ballistic/proc/can_shoot", function can_shoot(f: Frame) {
	if (!this.magazine || !this.magazine.ammo_count(0)) {
		return 0;
	}
	return 1;
});

// ballistic.dm:55
rt.def("/obj/item/weapon/gun/ballistic/proc/attackby", function* attackby(f: Frame, A: Value, user: Value, params: Value) {
	let AM: Value = null, S: Value = null;
	yield* parent_proc();
	if (rt.istype(A, T("/obj/item/ammo_box/magazine"))) {
		AM = A;
		if (!this.magazine && rt.op(f, "IsType", [], [AM, this.mag_type])) {
			if (yield* user.transferItemToLoc(AM, this)) {
				this.magazine = AM;
				to_chat(user, fmt("<span class='notice'>You load a new magazine into ％！.</span>", [this]));
				yield* this.chamber_round();
				yield* A.update_icon();
				yield* this.update_icon();
				return 1;
			} else {
				to_chat(user, fmt("<span class='warning'>You cannot seem to get ％！ out of your hands!</span>", [this]));
				return f.dot;
			}
		} else if (this.magazine) {
			to_chat(user, fmt("<span class='notice'>There's already a magazine in ％！.</span>", [this]));
		}
	}
	if (rt.istype(A, T("/obj/item/weapon/suppressor"))) {
		S = A;
		if (this.can_suppress) {
			if (!this.suppressed) {
				if (!(yield* user.transferItemToLoc(A, this))) {
					return f.dot;
				}
				to_chat(user, `<span class='notice'>You screw ${S} onto ${this}.</span>`);
				this.suppressed = A;
				S.oldsound = this.fire_sound;
				S.initial_w_class = this.w_class;
				this.fire_sound = rt.rsc("sound/weapons/gunshot_silenced.ogg");
				this.w_class = WEIGHT_CLASS_NORMAL;
				yield* this.update_icon();
				return f.dot;
			} else {
				to_chat(user, `<span class='warning'>${this} already has a suppressor!</span>`);
				return f.dot;
			}
		} else {
			to_chat(user, `<span class='warning'>You can't seem to figure out how to fit ${S} on ${this}!</span>`);
			return f.dot;
		}
	}
	return 0;
}, true);

// ballistic.dm:94
rt.def("/obj/item/weapon/gun/ballistic/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	let S: Value = null;
	if (this.loc == user) {
		if (this.suppressed && this.can_unsuppress) {
			S = this.suppressed;
			if (!user.is_holding(this)) {
				yield* parent_proc();
				return f.dot;
			}
			to_chat(user, `<span class='notice'>You unscrew ${this.suppressed} from ${this}.</span>`);
			yield* user.put_in_hands(this.suppressed);
			this.fire_sound = S.oldsound;
			this.w_class = S.initial_w_class;
			this.suppressed = 0;
			yield* this.update_icon();
			return f.dot;
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// ballistic.dm:110
rt.def("/obj/item/weapon/gun/ballistic/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let AC: Value = this.chambered;
	if (this.magazine) {
		this.magazine.loc = rt.getStep(f, this.loc, 0);
		yield* user.put_in_hands(this.magazine);
		yield* this.magazine.update_icon();
		this.magazine = null;
		to_chat(user, fmt("<span class='notice'>You pull the magazine out of ％！.</span>", [this]));
	} else if (this.chambered) {
		AC.loc = rt.getStep(f, this, 0);
		AC.SpinAnimation(10, 1);
		this.chambered = null;
		to_chat(user, fmt("<span class='notice'>You unload the round from ％！'s chamber.</span>", [this]));
	} else {
		to_chat(user, fmt("<span class='notice'>There's no magazine in ％！.</span>", [this]));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// ballistic.dm:129
rt.def("/obj/item/weapon/gun/ballistic/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, fmt("Has ＀ round５ remaining.", [this.get_ammo()]));
	return f.dot;
}, false);

// ballistic.dm:134
rt.def("/obj/item/weapon/gun/ballistic/proc/get_ammo", function get_ammo(f: Frame, countchambered: Value) {
	countchambered ??= 1;
	let boolets: Value = 0;
	if (this.chambered && countchambered) {
		boolets++;
	}
	if (this.magazine) {
		boolets += this.magazine.ammo_count();
	}
	return boolets;
});

// ballistic.dm:141
rt.def("/obj/item/weapon/gun/ballistic/proc/suicide_act", function* suicide_act(f: Frame, user: Value) {
	if (this.chambered && this.chambered.BB && (yield* this.can_trigger_gun(user)) && !this.chambered.BB.nodamage) {
		user.visible_message(`<span class='suicide'>${user} is putting the barrel of ${this} in ${user.p_their()} mouth.  It looks like ${user.p_theyre()} trying to commit suicide!</span>`);
		yield* sleep(25);
		if (user.is_holding(this)) {
			yield* this.process_fire(user, user, 0, { zone_override: "head" });
			user.visible_message(`<span class='suicide'>${user} blows ${user.p_their()} brain${user.p_s()} out with ${this}!</span>`);
			return 1;
		} else {
			user.visible_message(`<span class='suicide'>${user} panics and starts choking to death!</span>`);
			return 8;
		}
	} else {
		user.visible_message(`<span class='suicide'>${user} is pretending to blow ${user.p_their()} brain${user.p_s()} out with ${this}! It looks like ${user.p_theyre()} trying to commit suicide!</b></span>`);
		playsound(this.loc, rt.rsc("sound/weapons/empty.ogg"), 50, 1, -1);
		return 8;
	}
}, true);

// ballistic.dm:159
rt.def("/obj/item/weapon/gun/ballistic/proc/sawoff", function* sawoff(f: Frame, user: Value) {
	if (this.sawn_state == 1) {
		to_chat(user, fmt("<span class='warning'>＄！ is already shortened!</span>", [this]));
		return f.dot;
	}
	user.changeNext_move(8);
	user.visible_message(fmt("＀ begins to shorten ％！.", [user, this]), fmt("<span class='notice'>You begin to shorten ％！...</span>", [this]));
	if (yield* this.blow_up(user)) {
		user.visible_message(fmt("<span class='danger'>＄！ goes off!</span>", [this]), fmt("<span class='danger'>＄！ goes off in your face!</span>", [this]));
		return f.dot;
	}
	if (!(yield* do_after(user, 30, { target: this }))) return f.dot;
	if (this.sawn_state == 1) {
		return f.dot;
	}
	user.visible_message(fmt("＀ shortens ％！!", [user, this]), fmt("<span class='notice'>You shorten ％！.</span>", [this]));
	this.name = `sawn-off ${this.name}`;
	this.desc = this.sawn_desc;
	this.w_class = WEIGHT_CLASS_NORMAL;
	this.item_state = "gun";
	(rt.modSrcVar(f, "slot_flags", 16776191, rt.bitAnd));
	(rt.modSrcVar(f, "slot_flags", SLOT_BELT, rt.bitOr));
	this.sawn_state = 1;
	yield* this.update_icon();
	return 1;
}, true);

// ballistic.dm:187
rt.def("/obj/item/weapon/gun/ballistic/proc/blow_up", function* blow_up(f: Frame, user: Value) {
	let AC: Value = null;
	f.dot = 0;
	for (AC of each(this.magazine.stored_ammo, T("/obj/item/ammo_casing"))) {
		if (AC.BB) {
			yield* this.process_fire(user, user, 0);
			f.dot = 1;
		}
	}
	return f.dot;
}, true);
