// Based on /tg/station's code/modules/recycling/disposal-unit.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10984, "/obj/machinery/disposal", "/obj/machinery", {
	air_contents: null,
	full_pressure: 0,
	pressure_charging: 1,
	flush: 0,
	trunk: null,
	flushing: 0,
	flush_every_ticks: 30,
	flush_count: 0,
	last_sound: 0,
	stored: null,
	anchored: 1,
	interact_open: 1,
	icon: rt.rsc("icons/obj/atmospherics/pipes/disposal.dmi"),
	density: 1,
	on_blueprints: 1,
	armor: null,
	obj_integrity: 200,
	max_integrity: 200,
	resistance_flags: 2,
});

// disposal-unit.dm:11
rt.def("/obj/machinery/disposal/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 100, "bomb", 0, "bio", 100, "rad", 100, "fire", 90, "acid", 30]);
	return f.dot;
});

// disposal-unit.dm:30
rt.def("/obj/machinery/disposal/proc/Initialize", function* Initialize(f: Frame, mapload: Value, make_from: Value) {
	f.dot = (yield* parent_proc());
	if (make_from) {
		yield* this.setDir(make_from.dir);
		make_from.loc = 0;
		this.stored = make_from;
	} else {
		this.stored = (yield* new_(T("/obj/structure/disposalconstruct"), 0, DISP_END_BIN, this.dir));
	}
	this.trunk_check();
	this.air_contents = (yield* new_(T("/datum/gas_mixture")));
	yield* this.update_icon();
	return f.dot;
}, true);

// disposal-unit.dm:45
rt.def("/obj/machinery/disposal/proc/trunk_check", function trunk_check(f: Frame) {
	this.trunk = rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), this.loc);
	if (!this.trunk) {
		this.pressure_charging = 0;
		this.flush = 0;
	} else {
		if (rt.initial(f, this, "pressure_charging")) {
			this.pressure_charging = 1;
		}
		this.flush = rt.initial(f, this, "flush");
		this.trunk.linked = this;
	}
	return f.dot;
});

// disposal-unit.dm:56
rt.def("/obj/machinery/disposal/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.eject();
	if (this.trunk) {
		this.trunk.linked = null;
	}
	return (yield* parent_proc());
}, true);

// disposal-unit.dm:62
rt.def("/obj/machinery/disposal/proc/singularity_pull", function* singularity_pull(f: Frame, S: Value, current_size: Value) {
	if (!(current_size >= STAGE_FIVE)) return f.dot;
	yield* this.deconstruct();
	return f.dot;
}, true);

// disposal-unit.dm:66
rt.def("/obj/machinery/disposal/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	yield* parent_proc();
	return INITIALIZE_HINT_LATELOAD;
}, true);

// disposal-unit.dm:71
rt.def("/obj/machinery/disposal/proc/LateInitialize", function* LateInitialize(f: Frame) {
	let env: Value = null;
	let L: Value = this.loc;
	(env = (yield* new_(T("/datum/gas_mixture")))).copy_from(L.return_air());
	let removed: Value = (yield* env.remove(6.06625));
	yield* this.air_contents.merge(removed);
	this.trunk_check();
	return f.dot;
}, true);

// disposal-unit.dm:79
rt.def("/obj/machinery/disposal/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let W: Value = null;
	let $0: any, $1: any;
	yield* this.add_fingerprint(user);
	if (!this.pressure_charging && !this.full_pressure && !this.flush) {
		if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
			this.panel_open = (!this.panel_open ? 1 : 0);
			playsound(rt.getStep(f, this, 0), I.usesound, 50, 1);
			$0 = user;
			if (this.panel_open) {
				$1 = "remove";
			} else {
				$1 = "attach";
			}
			to_chat($0, `<span class='notice'>You ${$1} the screws around the power connection.</span>`);
			return f.dot;
		} else if (rt.istype(I, T("/obj/item/weapon/weldingtool")) && this.panel_open) {
			if (yield* (W = I).remove_fuel(0, user)) {
				playsound(this.loc, rt.rsc("sound/items/welder2.ogg"), 100, 1);
				to_chat(user, fmt("<span class='notice'>You start slicing the floorweld off ％！...</span>", [this]));
				if ((yield* do_after(user, 20 * I.toolspeed, { target: this })) && this.panel_open) {
					if (!W.isOn()) {
						return f.dot;
					}
					to_chat(user, fmt("<span class='notice'>You slice the floorweld off ％！.</span>", [this]));
					yield* this.deconstruct();
				}
			}
			return f.dot;
		}
	}
	if (user.a_intent != "harm") {
		if (!(yield* user.drop_item()) || rt.bitAnd(I.flags, ABSTRACT)) {
			return f.dot;
		}
		yield* this.place_item_in_disposal(I, user);
		yield* this.update_icon();
		return 1;
	} else {
		return (yield* parent_proc());
	}
}, true);

// disposal-unit.dm:108
rt.def("/obj/machinery/disposal/proc/place_item_in_disposal", function* place_item_in_disposal(f: Frame, I: Value, user: Value) {
	yield* I.forceMove(this);
	user.visible_message(fmt("＀ places ％！ into ％！.", [user.name, I, this]), fmt("<span class='notice'>You place ％！ into ％！.</span>", [I, this]));
	return f.dot;
}, true);

// disposal-unit.dm:113
rt.def("/obj/machinery/disposal/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, target: Value, user: Value) {
	if (!rt.istype(target, T("/mob/living"))) return f.dot;
	yield* this.stuff_mob_in(target, user);
	return f.dot;
}, true);

// disposal-unit.dm:117
rt.def("/obj/machinery/disposal/proc/stuff_mob_in", function* stuff_mob_in(f: Frame, target: Value, user: Value) {
	if (!rt.istype(user, T("/mob/living/carbon")) && !user.ventcrawler) {
		return f.dot;
	}
	if (!isturf(user.loc)) {
		return f.dot;
	}
	if (target.buckled || target.has_buckled_mobs()) {
		return f.dot;
	}
	if (target.mob_size > MOB_SIZE_HUMAN) {
		to_chat(user, `<span class='warning'>${target} doesn't fit inside ${this}!</span>`);
		return f.dot;
	}
	yield* this.add_fingerprint(user);
	if (user == target) {
		user.visible_message(`${user} starts climbing into ${this}.`, `<span class='notice'>You start climbing into ${this}...</span>`);
	} else {
		target.visible_message(`<span class='danger'>${user} starts putting ${target} into ${this}.</span>`, `<span class='userdanger'>${user} starts putting you into ${this}!</span>`);
	}
	if (!(yield* do_mob(user, target, 20))) return f.dot;
	if (!this.loc) {
		return f.dot;
	}
	yield* target.forceMove(this);
	if (user == target) {
		user.visible_message(`${user} climbs into ${this}.`, `<span class='notice'>You climb into ${this}.</span>`);
	} else {
		target.visible_message(`<span class='danger'>${user} has placed ${target} in ${this}.</span>`, `<span class='userdanger'>${user} has placed ${target} in ${this}.</span>`);
		yield* add_logs(user, target, "stuffed", { addition: `into ${this}` });
		target.LAssailant = user;
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// disposal-unit.dm:144
rt.def("/obj/machinery/disposal/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	yield* this.attempt_escape(user);
	return f.dot;
}, true);

// disposal-unit.dm:148
rt.def("/obj/machinery/disposal/proc/container_resist", function* container_resist(f: Frame, user: Value) {
	yield* this.attempt_escape(user);
	return f.dot;
}, true);

// disposal-unit.dm:153
rt.def("/obj/machinery/disposal/proc/attempt_escape", function* attempt_escape(f: Frame, user: Value) {
	if (this.flushing) {
		return f.dot;
	}
	yield* this.go_out(user);
	return f.dot;
}, true);

// disposal-unit.dm:157
rt.def("/obj/machinery/disposal/proc/go_out", function* go_out(f: Frame, user: Value) {
	yield* user.forceMove(this.loc);
	yield* this.update_icon();
	return f.dot;
}, true);

// disposal-unit.dm:162
rt.def("/obj/machinery/disposal/proc/attack_paw", function attack_paw(f: Frame, user: Value) {
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	this.flush = (!this.flush ? 1 : 0);
	this.update_icon();
	return f.dot;
});

// disposal-unit.dm:169
rt.def("/obj/machinery/disposal/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	yield* this.interact(user, 1);
	return f.dot;
}, true);

// disposal-unit.dm:173
rt.def("/obj/machinery/disposal/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (user && user.loc == this) {
		to_chat(f.usr, "<span class='warning'>You cannot reach the controls from inside!</span>");
		return f.dot;
	}
	yield* this.interact(user, 0);
	return f.dot;
}, true);

// disposal-unit.dm:180
rt.def("/obj/machinery/disposal/proc/eject", function* eject(f: Frame) {
	let AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (AM of each(this, T("/atom/movable"))) {
		yield* AM.forceMove(_T);
		AM.pipe_eject(0);
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// disposal-unit.dm:192
rt.def("/obj/machinery/disposal/proc/flush", function* flush(f: Frame) {
	let H: Value = null;
	this.flushing = 1;
	this.flushAnimation();
	yield* sleep(10);
	if (this.last_sound < rt.worldTime(f) + 1) {
		playsound(this, rt.rsc("sound/machines/disposalflush.ogg"), 50, 0, 0);
		this.last_sound = rt.worldTime(f);
	}
	yield* sleep(5);
	if (!this || this.gc_destroyed) {
		return f.dot;
	}
	this.newHolderDestination((H = (yield* new_(T("/obj/structure/disposalholder")))));
	yield* H.init(this);
	this.air_contents = (yield* new_(T("/datum/gas_mixture")));
	yield* H.start(this);
	this.flushing = 0;
	this.flush = 0;
	return f.dot;
}, true);

// disposal-unit.dm:209
rt.def("/obj/machinery/disposal/proc/newHolderDestination", function newHolderDestination(f: Frame, H: Value) {
	let O: Value = null;
	for (O of each(this, T("/obj/item/smallDelivery"))) {
		H.tomail = 1;
		return f.dot;
	}
	return f.dot;
});

// disposal-unit.dm:214
rt.def("/obj/machinery/disposal/proc/flushAnimation", function flushAnimation(f: Frame) {
	flick(`${this.icon_state}-flush`, this);
	return f.dot;
});

// disposal-unit.dm:218
rt.def("/obj/machinery/disposal/proc/power_change", function power_change(f: Frame) {
	parent_proc();
	this.update_icon();
	return f.dot;
});

// disposal-unit.dm:224
rt.def("/obj/machinery/disposal/proc/expel", function* expel(f: Frame, H: Value) {
	let target: Value = null, AM: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	playsound(this, rt.rsc("sound/machines/hiss.ogg"), 50, 0, 0);
	if (!H) return f.dot;
	for (AM of each(H, T("/atom/movable"))) {
		target = get_offset_target_turf(this.loc, rand(5) - rand(5), rand(5) - rand(5));
		yield* AM.forceMove(_T);
		AM.pipe_eject(0);
		yield* AM.throw_at(target, 5, 1);
	}
	yield* H.vent_gas(this.loc);
	yield* qdel(H);
	return f.dot;
}, true);

// disposal-unit.dm:239
rt.def("/obj/machinery/disposal/proc/deconstruct", function* deconstruct(f: Frame) {
	let AM: Value = null;
	if (f.args[0] === null) {
		f.args[0] = 1;
	}
	let _T: Value = this.loc;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (this.stored) {
			yield* this.stored.forceMove(_T);
			this.transfer_fingerprints_to(this.stored);
			this.stored.anchored = 0;
			this.stored.density = 1;
			yield* this.stored.update_icon();
		}
	}
	for (AM of each(this, T("/atom/movable"))) {
		yield* AM.forceMove(_T);
	}
	yield* parent_proc();
	return f.dot;
}, true, { args: ["disassembled"] });

// disposal-unit.dm:253
rt.def("/obj/machinery/disposal/proc/storage_contents_dump_act", function* storage_contents_dump_act(f: Frame, src_object: Value, user: Value) {
	let I: Value = null;
	for (I of each(src_object, T("/obj/item"))) {
		if (user.s_active != src_object) {
			if (yield* I.on_found(user)) {
				return f.dot;
			}
		}
		yield* src_object.remove_from_storage(I, this);
	}
	return 1;
}, true);

rt.type(10985, "/obj/machinery/disposal/bin", "/obj/machinery/disposal", {
	name: "disposal unit",
	desc: "A pneumatic waste disposal unit.",
	icon_state: "disposal",
});

// disposal-unit.dm:274
rt.def("/obj/machinery/disposal/bin/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null, O: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/storage/bag/trash"))) {
		_T = I;
		to_chat(user, "<span class='warning'>You empty the bag.</span>");
		for (O of each(_T.contents, T("/obj/item"))) {
			yield* _T.remove_from_storage(O, this);
		}
		yield* _T.update_icon();
		yield* this.update_icon();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// disposal-unit.dm:288
rt.def("/obj/machinery/disposal/bin/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (user.loc == this) {
		to_chat(user, "<span class='warning'>You cannot reach the controls from inside!</span>");
		return f.dot;
	}
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "disposal_unit", this.name, 300, 200, master_ui, state))).open();
	return f.dot;
}, true);

// disposal-unit.dm:299
rt.def("/obj/machinery/disposal/bin/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "flush", this.flush);
	rt.setAt(data, "full_pressure", this.full_pressure);
	rt.setAt(data, "pressure_charging", this.pressure_charging);
	rt.setAt(data, "panel_open", this.panel_open);
	let per: Value = max(0, min(100 * this.air_contents.return_pressure() / 5.06625, 100));
	rt.setAt(data, "per", round(per, 1));
	rt.setAt(data, "isai", (rt.istype(user, T("/mob/living/silicon/ai")) ? 1 : 0));
	return data;
});

// disposal-unit.dm:310
rt.def("/obj/machinery/disposal/bin/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "handle-0") {
		this.flush = 0;
		yield* this.update_icon();
		f.dot = 1;
	} else if (action === "handle-1") {
		if (!this.panel_open) {
			this.flush = 1;
			yield* this.update_icon();
		}
		f.dot = 1;
	} else if (action === "pump-0") {
		if (this.pressure_charging) {
			this.pressure_charging = 0;
			yield* this.update_icon();
		}
		f.dot = 1;
	} else if (action === "pump-1") {
		if (!this.pressure_charging) {
			this.pressure_charging = 1;
			yield* this.update_icon();
		}
		f.dot = 1;
	} else if (action === "eject") {
		yield* this.eject();
		f.dot = 1;
	}
	return f.dot;
}, true);

// disposal-unit.dm:337
rt.def("/obj/machinery/disposal/bin/proc/CanPass", function* CanPass(f: Frame, mover: Value, target: Value, height: Value) {
	let I: Value = null;
	height ??= 0;
	if (rt.istype(mover, T("/obj/item")) && mover.throwing) {
		if (rt.istype((I = mover), T("/obj/item/projectile"))) {
			return f.dot;
		}
		if (prob(75)) {
			yield* I.forceMove(this);
			this.visible_message(`<span class='notice'>${I} lands in ${this}.</span>`);
			yield* this.update_icon();
		} else {
			this.visible_message(`<span class='notice'>${I} bounces off of ${this}'s rim!</span>`);
		}
		return 0;
	} else {
		return (yield* parent_proc(mover, target, height));
	}
}, true);

// disposal-unit.dm:352
rt.def("/obj/machinery/disposal/bin/proc/flush", function* flush(f: Frame) {
	yield* parent_proc();
	this.full_pressure = 0;
	this.pressure_charging = 1;
	yield* this.update_icon();
	return f.dot;
}, true);

// disposal-unit.dm:358
rt.def("/obj/machinery/disposal/bin/proc/update_icon", function update_icon(f: Frame) {
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 1)) {
		this.pressure_charging = 0;
		this.flush = 0;
		return f.dot;
	}
	if (this.flush) {
		this.add_overlay("dispover-handle");
	}
	if (rt.bitAnd(this.stat, 2) || this.panel_open) {
		return f.dot;
	}
	if (rt.len(f, this.contents) > 0) {
		this.add_overlay("dispover-full");
	}
	if (this.pressure_charging) {
		this.add_overlay("dispover-charge");
	} else {
		if (!this.full_pressure) return f.dot;
		this.add_overlay("dispover-ready");
	}
	return f.dot;
});

// disposal-unit.dm:385
rt.def("/obj/machinery/disposal/bin/proc/process", function* process(f: Frame) {
	let L: Value = null, env: Value = null, pressure_delta: Value = null, transfer_moles: Value = null, removed: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	this.flush_count++;
	if (this.flush_count >= this.flush_every_ticks) {
		if (rt.len(f, this.contents)) {
			if (this.full_pressure) {
				rt.spawnTail(f, 0, "/obj/machinery/disposal/bin/proc/process: spawn at modules/recycling/disposal-unit.dm:392", L, env, pressure_delta, transfer_moles, removed);
			}
		}
		this.flush_count = 0;
	}
	yield* this.updateDialog();
	if (this.flush && this.air_contents.return_pressure() >= 5.06625) {
		yield* ImmediateInvokeAsync(this, P("/obj/machinery/disposal/bin/proc/flush"));
	}
	if (rt.bitAnd(this.stat, 2)) {
		return f.dot;
	}
	yield* this.use_power(100);
	if (!this.pressure_charging) {
		return f.dot;
	}
	yield* this.use_power(500);
	L = this.loc;
	env = L.return_air();
	pressure_delta = 5.1169124 - this.air_contents.return_pressure();
	if (env.temperature > 0) {
		transfer_moles = 0.1 * pressure_delta * this.air_contents.volume / (env.temperature * R_IDEAL_GAS_EQUATION);
		removed = (yield* env.remove(transfer_moles));
		yield* this.air_contents.merge(removed);
		this.air_update_turf();
	}
	if (this.air_contents.return_pressure() >= 5.06625) {
		this.full_pressure = 1;
		this.pressure_charging = 0;
		yield* this.update_icon();
	}
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /obj/machinery/disposal/bin/proc/process, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/disposal/bin/proc/process: spawn at modules/recycling/disposal-unit.dm:392", function* (f: Frame, L: Value, env: Value, pressure_delta: Value, transfer_moles: Value, removed: Value) {
	yield* this.flush();
	return null;
});

// disposal-unit.dm:435
rt.def("/obj/machinery/disposal/bin/proc/get_remote_view_fullscreens", function* get_remote_view_fullscreens(f: Frame, user: Value) {
	if (!(user.stat == 2 || !rt.bitAnd(user.sight, 12))) return f.dot;
	yield* user.overlay_fullscreen("remote_view", T("/obj/screen/fullscreen/impaired"), 2);
	return f.dot;
}, true);

rt.type(10986, "/obj/machinery/disposal/deliveryChute", "/obj/machinery/disposal", {
	pressure_charging: 0,
	name: "delivery chute",
	desc: "A chute for big and small packages alike!",
	density: 1,
	icon_state: "intake",
});

// disposal-unit.dm:448
rt.def("/obj/machinery/disposal/deliveryChute/proc/Initialize", function* Initialize(f: Frame, mapload: Value, make_from: Value) {
	f.dot = (yield* parent_proc());
	this.stored.ptype = DISP_END_CHUTE;
	rt.spawnTail(f, 5, "/obj/machinery/disposal/deliveryChute/proc/Initialize: spawn at modules/recycling/disposal-unit.dm:450");
	return f.dot;
}, true);

// a spawn(5) body of /obj/machinery/disposal/deliveryChute/proc/Initialize, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/disposal/deliveryChute/proc/Initialize: spawn at modules/recycling/disposal-unit.dm:450", function* (f: Frame) {
	this.trunk = rt.locateIn(f, T("/obj/structure/disposalpipe/trunk"), this.loc);
	if (this.trunk) {
		this.trunk.linked = this;
	}
	return null;
});

// disposal-unit.dm:456
rt.def("/obj/machinery/disposal/deliveryChute/proc/place_item_in_disposal", function* place_item_in_disposal(f: Frame, I: Value, user: Value) {
	if (!I.disposalEnterTry()) return f.dot;
	yield* parent_proc();
	yield* this.flush();
	return f.dot;
}, true);

// disposal-unit.dm:461
rt.def("/obj/machinery/disposal/deliveryChute/proc/Bumped", function* Bumped(f: Frame, AM: Value) {
	let O: Value = null, M: Value = null;
	if (!AM.disposalEnterTry()) {
		return f.dot;
	}
	if (this.dir === 1) {
		if (AM.loc.y != this.loc.y + 1) {
			return f.dot;
		}
	} else if (this.dir === 4) {
		if (AM.loc.x != this.loc.x + 1) {
			return f.dot;
		}
	} else if (this.dir === 2) {
		if (AM.loc.y != this.loc.y - 1) {
			return f.dot;
		}
	} else if (this.dir === 8) {
		if (AM.loc.x != this.loc.x - 1) {
			return f.dot;
		}
	}
	if (rt.istype(AM, T("/obj"))) {
		(O = AM).loc = this;
	} else if (ismob(AM)) {
		M = AM;
		if (prob(2)) {
			to_chat(M, "<span class='warning'>You hit the edge of the chute.</span>");
			return f.dot;
		}
		yield* M.forceMove(this);
	}
	yield* this.flush();
	return f.dot;
}, true);

// disposal-unit.dm:497
rt.def("/obj/machinery/disposal/deliveryChute/proc/newHolderDestination", function newHolderDestination(f: Frame, H: Value) {
	H.destinationTag = 1;
	return f.dot;
});
