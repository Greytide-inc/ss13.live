// Based on /tg/station's code/game/machinery/flasher.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T } = rt;


rt.type(10792, "/obj/machinery/flasher", "/obj/machinery", {
	bulb: null,
	id: null,
	range: 2,
	last_flash: 0,
	strength: 100,
	base_state: "mflash",
	anchored: 1,
	name: "mounted flash",
	desc: "A wall-mounted flashbulb device.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mflash1",
	obj_integrity: 250,
	max_integrity: 250,
	integrity_failure: 100,
});

// flasher.dm:29
rt.def("/obj/machinery/flasher/proc/New", function* New(f: Frame) {
	let $0: any;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	yield* parent_proc();
	if (f.args[2]) {
		yield* this.setDir(f.args[1]);
		if (rt.bitAnd(this.dir, 3)) {
			$0 = 0;
		} else if (this.dir == 4) {
			$0 = -28;
		} else {
			$0 = 28;
		}
		this.pixel_x = $0;
		if (rt.bitAnd(this.dir, 3)) {
			if (this.dir == 1) {
				$0 = -28;
			} else {
				$0 = 28;
			}
		} else {
			$0 = 0;
		}
		this.pixel_y = $0;
	} else {
		this.bulb = (yield* new_(T("/obj/item/device/assembly/flash/handheld"), this));
	}
	return f.dot;
}, true, { args: ["loc", "ndir", "built"] });

// flasher.dm:39
rt.def("/obj/machinery/flasher/proc/Destroy", function* Destroy(f: Frame) {
	if (this.bulb) {
		yield* qdel(this.bulb);
		this.bulb = null;
	}
	return (yield* parent_proc());
}, true);

// flasher.dm:44
rt.def("/obj/machinery/flasher/proc/power_change", function power_change(f: Frame) {
	if (this.powered() && this.anchored && this.bulb) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
		if (this.bulb.crit_fail) {
			this.icon_state = `${this.base_state}1-p`;
		} else {
			this.icon_state = `${this.base_state}1`;
		}
	} else {
		(rt.modSrcVar(f, "stat", 2, rt.bitOr));
		this.icon_state = `${this.base_state}1-p`;
	}
	return f.dot;
});

// flasher.dm:56
rt.def("/obj/machinery/flasher/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	yield* this.add_fingerprint(user);
	if (rt.istype(W, T("/obj/item/weapon/wirecutters"))) {
		if (this.bulb) {
			user.visible_message(`${user} begins to disconnect ${this}'s flashbulb.`, `<span class='notice'>You begin to disconnect ${this}'s flashbulb...</span>`);
			playsound(this.loc, W.usesound, 100, 1);
			if ((yield* do_after(user, 30 * W.toolspeed, { target: this })) && this.bulb) {
				user.visible_message(`${user} has disconnected ${this}'s flashbulb!`, `<span class='notice'>You disconnect ${this}'s flashbulb.</span>`);
				yield* this.bulb.forceMove(this.loc);
				this.bulb = null;
				yield* this.power_change();
			}
		}
	} else if (rt.istype(W, T("/obj/item/device/assembly/flash/handheld"))) {
		if (!this.bulb) {
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			user.visible_message(`${user} installs ${W} into ${this}.`, `<span class='notice'>You install ${W} into ${this}.</span>`);
			yield* W.forceMove(this);
			this.bulb = W;
			yield* this.power_change();
		} else {
			to_chat(user, `<span class='warning'>A flashbulb is already installed in ${this}!</span>`);
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		if (!this.bulb) {
			to_chat(user, "<span class='notice'>You start unsecuring the flasher frame...</span>");
			playsound(this.loc, W.usesound, 50, 1);
			if (yield* do_after(user, 40 * W.toolspeed, { target: this })) {
				to_chat(user, "<span class='notice'>You unsecure the flasher frame.</span>");
				yield* this.deconstruct(1);
			}
		} else {
			to_chat(user, `<span class='warning'>Remove a flashbulb from ${this} first!</span>`);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// flasher.dm:93
rt.def("/obj/machinery/flasher/proc/attack_ai", function* attack_ai(f: Frame) {
	if (!this.anchored) return f.dot;
	return (yield* this.flash());
}, true);

// flasher.dm:96
rt.def("/obj/machinery/flasher/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 10) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// flasher.dm:101
rt.def("/obj/machinery/flasher/proc/flash", function* flash(f: Frame) {
	let L: Value = null;
	if (!this.powered() || !this.bulb) {
		return f.dot;
	}
	if (this.bulb.crit_fail || this.last_flash && rt.worldTime(f) < this.last_flash + 150) {
		return f.dot;
	}
	if (!(yield* this.bulb.flash_recharge(30))) {
		yield* this.power_change();
		return f.dot;
	}
	this.bulb.times_used++;
	playsound(this.loc, rt.rsc("sound/weapons/flash.ogg"), 100, 1);
	flick(`${this.base_state}_flash`, this);
	this.last_flash = rt.worldTime(f);
	yield* this.use_power(1000);
	for (L of each(viewers(this, null), T("/mob/living"))) {
		if (get_dist(this, L) > this.range) {
			continue;
		}
		if (yield* L.flash_act({ affect_silicon: 1 })) {
			yield* L.Knockdown(this.strength);
		}
	}
	return 1;
}, true);

// flasher.dm:128
rt.def("/obj/machinery/flasher/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (!rt.bitAnd(this.stat, 3)) {
		if (this.bulb && prob(75 / severity)) {
			yield* this.flash();
			yield* this.bulb.burn_out();
			yield* this.power_change();
		}
	}
	yield* parent_proc();
	return f.dot;
}, true);

// flasher.dm:136
rt.def("/obj/machinery/flasher/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (rt.bitAnd(this.stat, 1)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	if (!this.bulb) return f.dot;
	yield* this.bulb.burn_out();
	yield* this.power_change();
	return f.dot;
}, true);

// flasher.dm:144
rt.def("/obj/machinery/flasher/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let F: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.bulb) {
			yield* this.bulb.forceMove(this.loc);
			this.bulb = null;
		}
		if (disassembled) {
			this.transfer_fingerprints_to((F = (yield* new_(T("/obj/item/wallframe/flasher"), rt.getStep(f, this, 0)))));
			F.id = this.id;
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		} else {
			yield* new_(T("/obj/item/stack/sheet/metal"), this.loc, 2);
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

rt.type(10793, "/obj/machinery/flasher/portable", "/obj/machinery/flasher", {
	strength: 80,
	anchored: 0,
	base_state: "pflash",
	name: "portable flasher",
	desc: "A portable flashing device. Wrench to activate and deactivate. Cannot detect slow movements.",
	icon_state: "pflash1-p",
	density: 1,
});

// flasher.dm:158
rt.def("/obj/machinery/flasher/portable/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.proximity_monitor = (yield* new_(T("/datum/proximity_monitor"), this, 0));
	return f.dot;
}, true);

// flasher.dm:162
rt.def("/obj/machinery/flasher/portable/proc/HasProximity", function* HasProximity(f: Frame, AM: Value) {
	let M: Value = null;
	if (this.last_flash && rt.worldTime(f) < this.last_flash + 150) {
		return f.dot;
	}
	if (!rt.istype(AM, T("/mob/living/carbon"))) return f.dot;
	if (!((M = AM).m_intent != "walk" && this.anchored)) return f.dot;
	yield* this.flash();
	return f.dot;
}, true);

// flasher.dm:171
rt.def("/obj/machinery/flasher/portable/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	if (rt.istype(W, T("/obj/item/weapon/wrench"))) {
		playsound(this.loc, W.usesound, 100, 1);
		if (!this.anchored && !this.isinspace()) {
			to_chat(user, `<span class='notice'>${this} is now secured.</span>`);
			this.add_overlay(`${this.base_state}-s`);
			this.anchored = 1;
			yield* this.power_change();
			yield* this.proximity_monitor.SetRange(this.range);
		} else {
			to_chat(user, `<span class='notice'>${this} can now be moved.</span>`);
			this.cut_overlays();
			this.anchored = 0;
			yield* this.power_change();
			yield* this.proximity_monitor.SetRange(0);
		}
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

rt.type(9542, "/obj/item/wallframe/flasher", "/obj/item/wallframe", {
	id: null,
	name: "mounted flash frame",
	desc: "Used for building wall-mounted flashers.",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	icon_state: "mflash_frame",
	result_path: rt.typePath("/obj/machinery/flasher"),
});

// flasher.dm:199
rt.def("/obj/item/wallframe/flasher/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	to_chat(user, `<span class='notice'>Its channel ID is '${this.id}'.</span>`);
	return f.dot;
}, false);

// flasher.dm:203
rt.def("/obj/item/wallframe/flasher/proc/after_attach", function after_attach(f: Frame, O: Value) {
	let F: Value = null;
	parent_proc();
	(F = O).id = this.id;
	return f.dot;
}, false);
