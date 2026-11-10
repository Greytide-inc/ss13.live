// Based on /tg/station's code/game/objects/items/weapons/chrono_eraser.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(7127, "/obj/item/weapon/chrono_eraser", "/obj/item/weapon", {
	PA: null,
	erased_minds: null,
	name: "Timestream Eradication Device",
	desc: "The result of outlawed time-bluespace research, this device is capable of wiping a being from the timestream. They never are, they never were, they never will be.",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronobackpack",
	item_state: "backpack",
	w_class: 4,
	slot_flags: 1024,
	slowdown: 1,
	actions_types: null,
});

// chrono_eraser.dm:14
rt.def("/obj/item/weapon/chrono_eraser/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.erased_minds = list();

	this.actions_types = list(T("/datum/action/item_action/equip_unequip_TED_Gun"));
	return f.dot;
});

// chrono_eraser.dm:17
rt.def("/obj/item/weapon/chrono_eraser/proc/pass_mind", function pass_mind(f: Frame, M: Value) {
	this.erased_minds += M;
	return f.dot;
});

// chrono_eraser.dm:20
rt.def("/obj/item/weapon/chrono_eraser/proc/dropped", function* dropped(f: Frame) {
	yield* parent_proc();
	if (!this.PA) return f.dot;
	yield* qdel(this.PA);
	return f.dot;
}, true);

// chrono_eraser.dm:25
rt.def("/obj/item/weapon/chrono_eraser/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.dropped();
	return (yield* parent_proc());
}, true);

// chrono_eraser.dm:29
rt.def("/obj/item/weapon/chrono_eraser/proc/ui_action_click", function* ui_action_click(f: Frame, user: Value) {
	let C: Value = null;
	if (!rt.istype(user, T("/mob/living/carbon"))) return f.dot;
	if ((C = user).back != this) return f.dot;
	if (this.PA) {
		yield* qdel(this.PA);
	} else {
		this.PA = (yield* new_(T("/obj/item/weapon/gun/energy/chrono_gun"), this));
		yield* user.put_in_hands(this.PA);
	}
	return f.dot;
}, true);

// chrono_eraser.dm:39
rt.def("/obj/item/weapon/chrono_eraser/proc/item_action_slot_check", function item_action_slot_check(f: Frame, slot: Value, user: Value) {
	if (slot != slot_back) return f.dot;
	return 1;
});

rt.type(5164, "/obj/item/weapon/gun/energy/chrono_gun", "/obj/item/weapon/gun/energy", {
	TED: null,
	field: null,
	startpos: null,
	flags: 16386,
	name: "T.E.D. Projection Apparatus",
	desc: "It's as if they never existed in the first place.",
	icon: rt.rsc("icons/obj/chronos.dmi"),
	icon_state: "chronogun",
	item_state: "chronogun",
	w_class: 3,
	can_charge: 0,
	fire_delay: 50,
	ammo_type: null,
});

// chrono_eraser.dm:50
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.ammo_type = list(T("/obj/item/ammo_casing/energy/chrono_beam"));
	return f.dot;
});

// chrono_eraser.dm:58
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (rt.istype(this.loc, T("/obj/item/weapon/chrono_eraser"))) {
		this.TED = this.loc;
	} else {
		this.TED = (yield* new_(T("/obj/item/weapon/chrono_eraser"), this.loc));
		yield* qdel(this);
	}
	return f.dot;
}, true);

// chrono_eraser.dm:70
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/process_fire", function* process_fire(f: Frame) {
	if (this.field) {
		this.field_disconnect(this.field);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// chrono_eraser.dm:75
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/Destroy", function* Destroy(f: Frame) {
	if (this.TED) {
		this.TED.PA = null;
		this.TED = null;
	}
	if (this.field) {
		this.field_disconnect(this.field);
	}
	return (yield* parent_proc());
}, true);

// chrono_eraser.dm:83
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_connect", function field_connect(f: Frame, F: Value) {
	let user: Value = this.loc;
	if (F.gun) {
		if (rt.istype(user, T("/mob/living")) && F.captured) {
			to_chat(user, `<span class='alert'><b>FAIL: <i>${F.captured}</i> already has an existing connection.</b></span>`);
		}
		this.field_disconnect(F);
	} else {
		this.startpos = rt.getStep(f, this, 0);
		this.field = F;
		F.gun = this;
		if (!(rt.istype(user, T("/mob/living")) && F.captured)) return f.dot;
		to_chat(user, `<span class='notice'>Connection established with target: <b>${F.captured}</b></span>`);
	}
	return f.dot;
});

// chrono_eraser.dm:96
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_disconnect", function field_disconnect(f: Frame, F: Value) {
	let user: Value = null;
	if (F && this.field == F) {
		user = this.loc;
		if (F.gun == this) {
			F.gun = null;
		}
		if (rt.istype(user, T("/mob/living")) && F.captured) {
			to_chat(user, `<span class='alert'>Disconnected from target: <b>${F.captured}</b></span>`);
		}
	}
	this.field = null;
	this.startpos = null;
	return f.dot;
});

// chrono_eraser.dm:107
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/field_check", function field_check(f: Frame, F: Value) {
	let currentpos: Value = null, user: Value = null;
	if (!F) return f.dot;
	if (this.field == F) {
		currentpos = rt.getStep(f, this, 0);
		user = this.loc;
		if (currentpos == this.startpos && rt.isIn(f, this.field, view(CHRONO_BEAM_RANGE, currentpos)) && !user.lying && user.stat == 0) {
			return 1;
		}
	}
	this.field_disconnect(F);
	return 0;
});

// chrono_eraser.dm:117
rt.def("/obj/item/weapon/gun/energy/chrono_gun/proc/pass_mind", function pass_mind(f: Frame, M: Value) {
	if (!this.TED) return f.dot;
	this.TED.pass_mind(M);
	return f.dot;
});

rt.type(8846, "/obj/item/projectile/energy/chrono_beam", "/obj/item/projectile/energy", {
	gun: null,
	name: "eradication beam",
	icon_state: "chronobolt",
	range: 3,
	nodamage: 1,
});

// chrono_eraser.dm:128
rt.def("/obj/item/projectile/energy/chrono_beam/proc/fire", function fire(f: Frame) {
	this.gun = this.firer.get_active_held_item();
	if (rt.istype(this.gun, T("/obj/item/weapon/gun/energy/chrono_gun"))) {
		return parent_proc();
	}
	return 0;
}, false, { waitfor: false });

// chrono_eraser.dm:135
rt.def("/obj/item/projectile/energy/chrono_beam/proc/on_hit", function on_hit(f: Frame, target: Value) {
	if (!(target && this.gun && rt.istype(target, T("/mob/living")))) return f.dot;
	let F: Value = new_(T("/obj/effect/chrono_field"), target.loc, target, this.gun);
	this.gun.field_connect(F);
	return f.dot;
});

rt.type(11951, "/obj/effect/chrono_field", "/obj/effect", {
	captured: null,
	gun: null,
	tickstokill: 15,
	mob_underlay: null,
	preloaded: 0,
	RPpos: null,
	anchored: 1,
	name: "eradication field",
	desc: "An aura of time-bluespace energy.",
	icon: rt.rsc("icons/effects/effects.dmi"),
	icon_state: "chronofield",
	density: 0,
	blend_mode: 4,
});

// chrono_eraser.dm:163
rt.def("/obj/effect/chrono_field/proc/New", function New(f: Frame, loc: Value, target: Value, G: Value) {
	let mob_snapshot: Value = null, cached_icon: Value = null, i: Value = null, removing_frame: Value = null, mob_icon: Value = null;
	if (target && rt.istype(target, T("/mob/living")) && G) {
		target.loc = this;
		this.captured = target;
		mob_snapshot = getFlatIcon(target);
		cached_icon = new_(T("/icon"));
		i = 1;
		while (i <= CHRONO_FRAME_COUNT) {
			removing_frame = icon(rt.rsc("icons/obj/chronos.dmi"), "erasing", 2, i);
			(mob_icon = icon(mob_snapshot)).Blend(removing_frame, 2);
			cached_icon.Insert(mob_icon, `frame${i}`);
			i++;
		}
		this.mob_underlay = mutable_appearance(cached_icon, "frame1");
		this.update_icon();
		this.desc = rt.initial(f, this, "desc") + `<br><span class='info'>It appears to contain ${target.name}.</span>`;
	}
	if (this.isprocessing) return f.dot;
	this.isprocessing = 1;
	GLOB.SSobj.processing += this;
	return f.dot;
});

// chrono_eraser.dm:182
rt.def("/obj/effect/chrono_field/proc/Destroy", function* Destroy(f: Frame) {
	if (this.gun && this.gun.field_check(this)) {
		this.gun.field_disconnect(this);
	}
	return (yield* parent_proc());
}, true);

// chrono_eraser.dm:187
rt.def("/obj/effect/chrono_field/proc/update_icon", function update_icon(f: Frame) {
	let ttk_frame: Value = 1 - this.tickstokill / rt.initial(f, this, "tickstokill");
	if ((ttk_frame = max(1, min(Ceiling(ttk_frame * 22), 22))) == this.RPpos) return f.dot;
	this.RPpos = ttk_frame;
	this.mob_underlay.icon_state = `frame${this.RPpos}`;
	this.underlays = list();
	this.underlays += this.mob_underlay;
	return f.dot;
});

// chrono_eraser.dm:197
rt.def("/obj/effect/chrono_field/proc/process", function* process(f: Frame) {
	let AM: Value = null, ghost: Value = null;
	if (this.captured) {
		if (this.tickstokill > rt.initial(f, this, "tickstokill")) {
			for (AM of each(this.contents, T("/atom/movable"))) {
				AM.loc = this.loc;
			}
			yield* qdel(this);
		} else if (this.tickstokill <= 0) {
			to_chat(this.captured, "<span class='boldnotice'>As the last essence of your being is erased from time, you begin to re-experience your most enjoyable memory. You feel happy...</span>");
			ghost = (yield* this.captured.ghostize(1));
			if (this.captured.mind) {
				if (ghost) {
					ghost.mind = null;
				}
				if (this.gun) {
					this.gun.pass_mind(this.captured.mind);
				}
			}
			yield* qdel(this.captured);
			yield* qdel(this);
		} else {
			yield* this.captured.Unconscious(80);
			if (this.captured.loc != this) {
				this.captured.loc = this;
			}
			yield* this.update_icon();
			if (this.gun) {
				if (this.gun.field_check(this)) {
					this.tickstokill--;
				} else {
					this.gun = null;
					return (yield* g.callSelf(f, []));
				}
			} else {
				this.tickstokill++;
			}
		}
	} else {
		yield* qdel(this);
	}
	return f.dot;
}, true, { waitfor: false });

// chrono_eraser.dm:228
rt.def("/obj/effect/chrono_field/proc/bullet_act", function bullet_act(f: Frame, _P: Value) {
	let beam: Value = null, Pgun: Value = null;
	if (rt.istype(_P, T("/obj/item/projectile/energy/chrono_beam"))) {
		beam = _P;
		if ((Pgun = beam.gun) && rt.istype(Pgun, T("/obj/item/weapon/gun/energy/chrono_gun"))) {
			Pgun.field_connect(this);
		}
	} else {
		return 0;
	}
	return f.dot;
});

// chrono_eraser.dm:240
rt.def("/obj/effect/chrono_field/proc/return_air", function return_air(f: Frame) {
	let GM: Value = null;
	(GM = new_(T("/datum/gas_mixture"))).assert_gases("o2", "n2");
	rt.setAt(rt.index(GM.gases, "o2"), 1, 21.836596);
	rt.setAt(rt.index(GM.gases, "n2"), 1, 82.1472);
	GM.temperature = T20C;
	return GM;
});
