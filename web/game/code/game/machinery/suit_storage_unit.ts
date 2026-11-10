// Based on /tg/station's code/game/machinery/suit_storage_unit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P } = rt;


rt.type(10831, "/obj/machinery/suit_storage_unit", "/obj/machinery", {
	suit: null,
	helmet: null,
	mask: null,
	storage: null,
	suit_type: null,
	helmet_type: null,
	mask_type: null,
	storage_type: null,
	locked: 0,
	safeties: 1,
	uv: 0,
	uv_super: 0,
	uv_cycles: 6,
	anchored: 1,
	state_open: 0,
	panel_open: 0,
	name: "suit storage unit",
	desc: "An industrial unit made to hold space suits. It comes with a built-in UV cauterization mechanism. A small warning label advises that organic matter should not be placed into the unit.",
	icon: rt.rsc("icons/obj/suitstorage.dmi"),
	icon_state: "close",
	density: 1,
	obj_integrity: 250,
	max_integrity: 250,
});

// suit_storage_unit.dm:106
rt.def("/obj/machinery/suit_storage_unit/proc/New", function* New(f: Frame) {
	yield* parent_proc();
	this.wires = (yield* new_(T("/datum/wires/suit_storage_unit"), this));
	if (this.suit_type) {
		this.suit = (yield* new_(this.suit_type, this));
	}
	if (this.helmet_type) {
		this.helmet = (yield* new_(this.helmet_type, this));
	}
	if (this.mask_type) {
		this.mask = (yield* new_(this.mask_type, this));
	}
	if (this.storage_type) {
		this.storage = (yield* new_(this.storage_type, this));
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// suit_storage_unit.dm:120
rt.def("/obj/machinery/suit_storage_unit/proc/Destroy", function* Destroy(f: Frame) {
	if (this.suit) {
		yield* qdel(this.suit);
		this.suit = null;
	}
	if (this.helmet) {
		yield* qdel(this.helmet);
		this.helmet = null;
	}
	if (this.mask) {
		yield* qdel(this.mask);
		this.mask = null;
	}
	if (this.storage) {
		yield* qdel(this.storage);
		this.storage = null;
	}
	return (yield* parent_proc());
}, true);

// suit_storage_unit.dm:134
rt.def("/obj/machinery/suit_storage_unit/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (this.uv) {
		if (this.uv_super) {
			this.add_overlay("super");
		} else if (this.occupant) {
			this.add_overlay("uvhuman");
		} else {
			this.add_overlay("uv");
		}
	} else if (this.state_open) {
		if (rt.bitAnd(this.stat, 1)) {
			this.add_overlay("broken");
		} else {
			this.add_overlay("open");
			if (this.suit) {
				this.add_overlay("suit");
			}
			if (this.helmet) {
				this.add_overlay("helm");
			}
			if (this.storage) {
				this.add_overlay("storage");
			}
		}
	} else {
		if (!this.occupant) return f.dot;
		this.add_overlay("human");
	}
	return f.dot;
});

// suit_storage_unit.dm:158
rt.def("/obj/machinery/suit_storage_unit/proc/power_change", function* power_change(f: Frame) {
	yield* parent_proc();
	if (!this.is_operational() && this.state_open) {
		yield* this.open_machine();
		yield* this.dump_contents();
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// suit_storage_unit.dm:165
rt.def("/obj/machinery/suit_storage_unit/proc/dump_contents", function* dump_contents(f: Frame) {
	yield* this.dropContents();
	this.helmet = null;
	this.suit = null;
	this.mask = null;
	this.storage = null;
	this.occupant = null;
	return f.dot;
}, true);

// suit_storage_unit.dm:173
rt.def("/obj/machinery/suit_storage_unit/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* this.open_machine();
		yield* this.dump_contents();
		yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
	}
	yield* qdel(this);
	return f.dot;
}, true);

// suit_storage_unit.dm:180
rt.def("/obj/machinery/suit_storage_unit/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, A: Value, user: Value) {
	if (user.stat || user.lying || !this.Adjacent(user) || !this.Adjacent(A) || !rt.istype(A, T("/mob/living"))) {
		return f.dot;
	}
	let target: Value = A;
	if (!this.state_open) {
		to_chat(user, "<span class='warning'>The unit's doors are shut!</span>");
		return f.dot;
	}
	if (!this.is_operational()) {
		to_chat(user, "<span class='warning'>The unit is not operational!</span>");
		return f.dot;
	}
	if (this.occupant || this.helmet || this.suit || this.storage) {
		to_chat(user, "<span class='warning'>It's too cluttered inside to fit in!</span>");
		return f.dot;
	}
	if (target == user) {
		user.visible_message(`<span class='warning'>${user} starts squeezing into ${this}!</span>`, `<span class='notice'>You start working your way into ${this}...</span>`);
	} else {
		target.visible_message(`<span class='warning'>${user} starts shoving ${target} into ${this}!</span>`, `<span class='userdanger'>${user} starts shoving you into ${this}!</span>`);
	}
	if (!(yield* do_mob(user, target, 30))) return f.dot;
	if (this.occupant || this.helmet || this.suit || this.storage) {
		return f.dot;
	}
	if (target == user) {
		user.visible_message(`<span class='warning'>${user} slips into ${this} and closes the door behind them!</span>`, `<span class=notice'>You slip into ${this}'s cramped space and shut its door.</span>`);
	} else {
		target.visible_message(`<span class='warning'>${user} pushes ${target} into ${this} and shuts its door!<span>`, `<span class='userdanger'>${user} shoves you into ${this} and shuts the door!</span>`);
	}
	yield* this.close_machine(target);
	yield* this.add_fingerprint(user);
	return f.dot;
}, true);

// suit_storage_unit.dm:210
rt.def("/obj/machinery/suit_storage_unit/proc/cook", function* cook(f: Frame) {
	let mob_occupant: Value = null, I: Value = null;
	if (this.uv_cycles) {
		this.uv_cycles--;
		this.uv = 1;
		this.locked = 1;
		yield* this.update_icon();
		if (this.occupant) {
			mob_occupant = this.occupant;
			if (this.uv_super) {
				yield* mob_occupant.adjustFireLoss(rand(20, 36));
			} else {
				yield* mob_occupant.adjustFireLoss(rand(10, 16));
			}
			yield* mob_occupant.emote("scream");
		}
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/suit_storage_unit/proc/cook"))), 50);
	} else {
		this.uv_cycles = rt.initial(f, this, "uv_cycles");
		this.uv = 0;
		this.locked = 0;
		if (this.uv_super) {
			this.visible_message(`<span class='warning'>${this}'s door creaks open with a loud whining noise. A cloud of foul black smoke escapes from its chamber.</span>`);
			playsound(this, rt.rsc("sound/machines/airlock_alien_prying.ogg"), 50, 1);
			this.helmet = null;
			yield* qdel(this.helmet);
			this.suit = null;
			yield* qdel(this.suit);
			this.mask = null;
			yield* qdel(this.mask);
			this.storage = null;
			yield* qdel(this.storage);
			yield* this.wires.cut_all();
		} else {
			if (!this.occupant) {
				this.visible_message(`<span class='notice'>${this}'s door slides open. The glowing yellow lights dim to a gentle green.</span>`);
			} else {
				this.visible_message(`<span class='warning'>${this}'s door slides open, barraging you with the nauseating smell of charred flesh.</span>`);
			}
			playsound(this, rt.rsc("sound/machines/airlockclose.ogg"), 25, 1);
			for (I of each(this, T("/obj/item"))) {
				I.clean_blood();
				I.fingerprints = list();
			}
		}
		yield* this.open_machine(0);
		if (!this.occupant) return f.dot;
		yield* this.dump_contents();
	}
	return f.dot;
}, true);

// suit_storage_unit.dm:253
rt.def("/obj/machinery/suit_storage_unit/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	let s: Value = null;
	if (prob(prb)) return f.dot;
	yield* (s = (yield* new_(T("/datum/effect_system/spark_spread")))).set_up(5, 1, this);
	yield* s.start();
	if (!(yield* electrocute_mob(user, this, this, 1, 1))) return f.dot;
	return 1;
}, true);

// suit_storage_unit.dm:261
rt.def("/obj/machinery/suit_storage_unit/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.container_resist(user);
	return f.dot;
}, true);

// suit_storage_unit.dm:264
rt.def("/obj/machinery/suit_storage_unit/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.add_fingerprint(user);
	if (this.locked) {
		this.visible_message(`<span class='notice'>You see ${user} kicking against the doors of ${this}!</span>`, "<span class='notice'>You start kicking against the doors...</span>");
		yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/suit_storage_unit/proc/resist_open"), user)), 300);
	} else {
		yield* this.open_machine();
		yield* this.dump_contents();
	}
	return f.dot;
}, true);

// suit_storage_unit.dm:273
rt.def("/obj/machinery/suit_storage_unit/proc/resist_open", function* resist_open(f: Frame, user: Value) {
	if (!(!this.state_open && this.occupant && rt.isIn(f, user, this) && user.stat == 0)) return f.dot;
	this.visible_message(`<span class='notice'>You see ${user} bursts out of ${this}!</span>`, `<span class='notice'>You escape the cramped confines of ${this}!</span>`);
	yield* this.open_machine();
	return f.dot;
}, true, { argTypes: [{ type: 8, path: "/mob" }] });

// suit_storage_unit.dm:278
rt.def("/obj/machinery/suit_storage_unit/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.state_open && this.is_operational()) {
		if (rt.istype(I, T("/obj/item/clothing/suit/space"))) {
			if (this.suit) {
				to_chat(user, "<span class='warning'>The unit already contains a suit!.</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.suit = I;
		} else if (rt.istype(I, T("/obj/item/clothing/head/helmet"))) {
			if (this.helmet) {
				to_chat(user, "<span class='warning'>The unit already contains a helmet!</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.helmet = I;
		} else if (rt.istype(I, T("/obj/item/clothing/mask"))) {
			if (this.mask) {
				to_chat(user, "<span class='warning'>The unit already contains a mask!</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.mask = I;
		} else {
			if (this.storage) {
				to_chat(user, "<span class='warning'>The auxiliary storage compartment is full!</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			this.storage = I;
		}
		I.loc = this;
		this.visible_message(`<span class='notice'>${user} inserts ${I} into ${this}</span>`, `<span class='notice'>You load ${I} into ${this}.</span>`);
		yield* this.update_icon();
		return f.dot;
	}
	if (this.panel_open && is_wire_tool(I)) {
		yield* this.wires.interact(user);
	}
	if (!this.state_open) {
		if (this.default_deconstruction_screwdriver(user, "panel", "close", I)) {
			return f.dot;
		}
	}
	if (yield* this.default_pry_open(I)) {
		yield* this.dump_contents();
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// suit_storage_unit.dm:326
rt.def("/obj/machinery/suit_storage_unit/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.notcontained_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "suit_storage_unit", this.name, 400, 305, master_ui, state))).open();
	return f.dot;
}, true);

// suit_storage_unit.dm:332
rt.def("/obj/machinery/suit_storage_unit/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	rt.setAt((data = list()), "locked", this.locked);
	rt.setAt(data, "open", this.state_open);
	rt.setAt(data, "safeties", this.safeties);
	rt.setAt(data, "uv_active", this.uv);
	rt.setAt(data, "uv_super", this.uv_super);
	if (this.helmet) {
		rt.setAt(data, "helmet", this.helmet.name);
	}
	if (this.suit) {
		rt.setAt(data, "suit", this.suit.name);
	}
	if (this.mask) {
		rt.setAt(data, "mask", this.mask.name);
	}
	if (this.storage) {
		rt.setAt(data, "storage", this.storage.name);
	}
	if (this.occupant) {
		rt.setAt(data, "occupied", 1);
	}
	return data;
});

// suit_storage_unit.dm:351
rt.def("/obj/machinery/suit_storage_unit/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let mob_occupant: Value = null, item_name: Value = null, I: Value = null;
	let $0: any, $1: any, $2: any;
	if ((yield* parent_proc()) || this.uv) {
		return f.dot;
	}
	if (action === "door") {
		if (this.state_open) {
			yield* this.close_machine();
		} else {
			yield* this.open_machine(0);
			if (this.occupant) {
				yield* this.dump_contents();
			}
		}
		f.dot = 1;
	} else if (action === "lock") {
		this.locked = (!this.locked ? 1 : 0);
		f.dot = 1;
	} else if (action === "uv") {
		if (this.occupant && this.safeties) {
			return f.dot;
		} else if (!this.helmet && !this.mask && !this.suit && !this.storage && !this.occupant) {
			return f.dot;
		} else {
			if (this.occupant) {
				$0 = (mob_occupant = this.occupant);
				$1 = this;
				if (!mob_occupant.stat) {
					$2 = "alive";
				} else {
					$2 = "away";
				}
				to_chat($0, `<span class='userdanger'>${$1}'s confines grow warm, then hot, then scorching. You're being burned ${$2}!</span>`);
			}
			yield* this.cook();
			f.dot = 1;
		}
	} else if (action === "dispense") {
		if (!this.state_open) {
			return f.dot;
		}
		if (rt.isIn(f, (item_name = rt.at(params, "item")), GLOB.valid_items)) {
			I = rt.index(this.vars, item_name);
			rt.setAt(this.vars, item_name, null);
			if (I) {
				yield* I.forceMove(this.loc);
			}
		}
		f.dot = 1;
	}
	yield* this.update_icon();
	return f.dot;
}, true);
