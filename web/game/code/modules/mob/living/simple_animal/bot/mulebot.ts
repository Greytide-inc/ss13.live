// Based on /tg/station's code/modules/mob/living/simple_animal/bot/mulebot.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(5041, "/mob/living/simple_animal/bot/mulebot", "/mob/living/simple_animal/bot", {
	load: null,
	passenger: null,
	target: null,
	loaddir: 0,
	home_destination: "",
	reached_target: 1,
	auto_return: 1,
	auto_pickup: 1,
	report_delivery: 1,
	cell: null,
	bloodiness: 0,
	anchored: 1,
	buckle_lying: 0,
	radio_channel: "Supply",
	bot_type: 2,
	model: "MULE",
	name: "１MULEbot",
	desc: "A Multiple Utility Load Effector bot.",
	icon_state: "mulebot0",
	density: 1,
	animate_movement: 1,
	health: 50,
	maxHealth: 50,
	damage_coeff: null,
	a_intent: "harm",
	mob_size: 3,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_cargo"),
	bot_core_type: rt.typePath("/obj/machinery/bot_core/mulebot"),
	suffix: "",
});

// mulebot.dm:20
rt.def("/mob/living/simple_animal/bot/mulebot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.damage_coeff = rt.alist(f, ["brute", 0.5, "fire", 0.7, "tox", 0, "clone", 0, "stamina", 0, "oxy", 0]);
	return f.dot;
});

// mulebot.dm:50
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Initialize", function* Initialize(f: Frame) {
	yield* parent_proc();
	this.wires = (yield* new_(T("/datum/wires/mulebot"), this));
	let J: Value = (yield* new_(T("/datum/job/cargo_tech")));
	this.access_card.access = J.get_access();
	this.prev_access = this.access_card.access;
	this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
	this.cell.charge = 2000;
	this.cell.maxcharge = 2000;
	GLOB.mulebot_count += 1;
	if (this.suffix) return f.dot;
	this.set_suffix(`#${GLOB.mulebot_count}`);
	return f.dot;
}, true);

// mulebot.dm:65
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Destroy", function* Destroy(f: Frame) {
	yield* this.unload(0);
	yield* qdel(this.wires);
	this.wires = null;
	return (yield* parent_proc());
}, true);

// mulebot.dm:73
rt.def("/mob/living/simple_animal/bot/mulebot/proc/set_suffix", function set_suffix(f: Frame, suffix: Value) {
	this.suffix = suffix;
	if (this.paicard) {
		this.bot_name = `ÿ\u0016MULEbot (${suffix})`;
	} else {
		this.name = `ÿ\u0016MULEbot (${suffix})`;
	}
	return f.dot;
});

// mulebot.dm:78
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bot_reset", function bot_reset(f: Frame) {
	parent_proc();
	this.reached_target = 0;
	return f.dot;
});

// mulebot.dm:82
rt.def("/mob/living/simple_animal/bot/mulebot/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let C: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		yield* parent_proc();
		if (this.open) {
			this.on = 0;
		}
	} else if (rt.istype(I, T("/obj/item/weapon/stock_parts/cell")) && this.open && !this.cell) {
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		(C = I).loc = this;
		this.cell = C;
		this.visible_message(`${user} inserts a cell into ${this}.`, `<span class='notice'>You insert the new cell into ${this}.</span>`);
	} else if (rt.istype(I, T("/obj/item/weapon/crowbar")) && this.open && this.cell) {
		yield* this.cell.add_fingerprint(f.usr);
		this.cell.loc = this.loc;
		this.cell = null;
		this.visible_message(`${user} crowbars out the power cell from ${this}.`, `<span class='notice'>You pry the powercell out of ${this}.</span>`);
	} else {
		if (is_wire_tool(I) && this.open) {
			return (yield* this.attack_hand(user));
		}
		if (this.load && ismob(this.load)) {
			if (prob(1 + I.force * 2)) {
				yield* this.unload(0);
				user.visible_message(fmt("<span class='danger'>＀ knocks ＀ off ＀ with ％！!</span>", [user, this.load, this, I]), fmt("<span class='danger'>You knock ＀ off ＀ with ％！!</span>", [this.load, this, I]));
			} else {
				to_chat(user, fmt("<span class='warning'>You hit ＀ with ％！ but to no effect!</span>", [this, I]));
				yield* parent_proc();
			}
		} else {
			yield* parent_proc();
		}
	}
	yield* this.update_icon();
	return f.dot;
}, true);

// mulebot.dm:116
rt.def("/mob/living/simple_animal/bot/mulebot/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged < 1) {
		this.emagged = 1;
	}
	if (!this.open) {
		this.locked = (!this.locked ? 1 : 0);
		to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the ${this}'s controls!</span>`);
	}
	flick("mulebot-emagged", this);
	playsound(this.loc, rt.rsc("sound/effects/sparks1.ogg"), 100, 0);
	return f.dot;
});

// mulebot.dm:126
rt.def("/mob/living/simple_animal/bot/mulebot/proc/update_icon", function update_icon(f: Frame) {
	if (this.open) {
		this.icon_state = "mulebot-hatch";
	} else {
		this.icon_state = `mulebot${this.wires.is_cut("Avoidance")}`;
	}
	this.cut_overlays();
	if (this.load && !ismob(this.load)) {
		this.load.pixel_y = rt.initial(f, this.load, "pixel_y") + 9;
		if (this.load.layer < this.layer) {
			this.load.layer = this.layer + 0.01;
		}
		this.add_overlay(this.load);
	}
	return f.dot;
});

// mulebot.dm:138
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ex_act", function* ex_act(f: Frame, severity: Value) {
	let i: Value = null;
	yield* this.unload(0);
	if (severity === 1) {
		yield* qdel(this);
	} else if (severity === 2) {
		i = 1;
		while (i < 3) {
			yield* this.wires.cut_random();
			i++;
		}
	} else if (severity === 3) {
		yield* this.wires.cut_random();
	}
	return f.dot;
}, true, { waitfor: false });

// mulebot.dm:150
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bullet_act", function* bullet_act(f: Frame, Proj: Value) {
	if (!(yield* parent_proc())) return f.dot;
	if (prob(50) && this.load !== null) {
		yield* this.unload(0);
	}
	if (!prob(25)) return f.dot;
	this.visible_message(`<span class='danger'>Something shorts out inside ${this}!</span>`);
	yield* this.wires.cut_random();
	return f.dot;
}, true);

// mulebot.dm:158
rt.def("/mob/living/simple_animal/bot/mulebot/proc/interact", function* interact(f: Frame, user: Value) {
	if (this.open && !rt.istype(user, T("/mob/living/silicon/ai"))) {
		yield* this.wires.interact(user);
	} else {
		if (this.wires.is_cut("Recieve") && rt.istype(user, T("/mob/living/silicon/ai"))) {
			return f.dot;
		}
		yield* this.ui_interact(user);
	}
	return f.dot;
}, true);

// mulebot.dm:167
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "mulebot", this.name, 600, 375, master_ui, state))).open();
	return f.dot;
}, true);

// mulebot.dm:173
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	rt.setAt((data = list()), "on", this.on);
	rt.setAt(data, "locked", this.locked);
	rt.setAt(data, "siliconUser", user.has_unlimited_silicon_privilege);
	let $0: any = data;
	let $1: any = "mode";
	rt.setAt($0, $1, this.mode ? rt.index(this.mode_name, this.mode) : "Ready");
	rt.setAt(data, "modeStatus", "");
	if (this.mode === BOT_IDLE || this.mode === BOT_DELIVER || this.mode === BOT_GO_HOME) {
		rt.setAt(data, "modeStatus", "good");
	} else if (this.mode === BOT_BLOCKED || this.mode === BOT_NAV || this.mode === BOT_WAIT_FOR_NAV) {
		rt.setAt(data, "modeStatus", "average");
	} else if (this.mode === BOT_NO_ROUTE) {
		rt.setAt(data, "modeStatus", "bad");
	}
	rt.setAt(data, "load", this.load ? this.load.name : null);
	rt.setAt(data, "destination", this.destination ? this.destination : null);
	rt.setAt(data, "cell", this.cell ? 1 : 0);
	rt.setAt(data, "cellPercent", this.cell ? this.cell.percent() : null);
	rt.setAt(data, "autoReturn", this.auto_return);
	rt.setAt(data, "autoPickup", this.auto_pickup);
	rt.setAt(data, "reportDelivery", this.report_delivery);
	rt.setAt(data, "haspai", this.paicard ? 1 : 0);
	return data;
});

// mulebot.dm:198
rt.def("/mob/living/simple_animal/bot/mulebot/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if ((yield* parent_proc()) || this.locked && !f.usr.has_unlimited_silicon_privilege) {
		return f.dot;
	}
	if (action === "lock") {
		if (f.usr.has_unlimited_silicon_privilege) {
			this.locked = (!this.locked ? 1 : 0);
			f.dot = 1;
		}
	} else if (action === "power") {
		if (this.on) {
			yield* this.turn_off();
		} else if (this.cell && !this.open) {
			if (!(yield* this.turn_on())) {
				to_chat(f.usr, `<span class='warning'>You can't switch on ${this}!</span>`);
				return f.dot;
			}
		}
		f.dot = 1;
	} else {
		yield* this.bot_control(action, f.usr);
		f.dot = 1;
	}
	return f.dot;
}, true);

// mulebot.dm:218
rt.def("/mob/living/simple_animal/bot/mulebot/proc/bot_control", function* bot_control(f: Frame, command: Value, user: Value, pda: Value) {
	let new_dest: Value = null, new_id: Value = null, new_home: Value = null;
	pda ??= 0;
	if (pda && this.wires.is_cut("Recieve")) {
		return f.dot;
	}
	if (command === "stop") {
		if (this.mode >= BOT_DELIVER) {
			this.bot_reset();
		}
	} else if (command === "go") {
		if (this.mode == BOT_IDLE) {
			yield* this.start();
		}
	} else if (command === "home") {
		if (this.mode == BOT_IDLE || this.mode == BOT_DELIVER) {
			this.start_home();
		}
	} else if (command === "destination") {
		if (new_dest = (yield* g.op(f, "Prompt", [1], [this.destination, this.name, "Enter Destination:", user, GLOB.deliverybeacontags]))) {
			yield* this.set_destination(new_dest);
		}
	} else if (command === "setid") {
		if (new_id = (yield* stripped_input(user, "Enter ID:", this.name, this.suffix, 42))) {
			this.set_suffix(new_id);
		}
	} else if (command === "sethome") {
		if (new_home = (yield* g.op(f, "Prompt", [1], [this.home_destination, this.name, "Enter Home:", user, GLOB.deliverybeacontags]))) {
			this.home_destination = new_home;
		}
	} else if (command === "unload") {
		if (this.load && this.mode != 1) {
			if (this.loc == this.target) {
				yield* this.unload(this.loaddir);
			} else {
				yield* this.unload(0);
			}
		}
	} else if (command === "autoret") {
		this.auto_return = (!this.auto_return ? 1 : 0);
	} else if (command === "autopick") {
		this.auto_pickup = (!this.auto_pickup ? 1 : 0);
	} else if (command === "report") {
		this.report_delivery = (!this.report_delivery ? 1 : 0);
	} else if (command === "ejectpai") {
		yield* this.ejectpairemote(user);
	}
	return f.dot;
}, true);

// mulebot.dm:260
rt.def("/mob/living/simple_animal/bot/mulebot/proc/get_controls", function get_controls(f: Frame, user: Value) {
	let dat: Value = null;
	let $0: any, $1: any;
	let ai: Value = (rt.istype(user, T("/mob/living/silicon")) ? 1 : 0);
	dat += "<h3>Multiple Utility Load Effector Mk. V</h3>";
	dat += `<b>ID:</b> ${this.suffix}<BR>`;
	dat += `<b>Power:</b> ${this.on ? "On" : "Off"}<BR>`;
	dat += "<h3>Status</h3>";
	dat += "<div class='statusDisplay'>";
	if (this.mode === 0) {
		dat += "<span class='good'>Ready</span>";
	} else if (this.mode === BOT_DELIVER) {
		dat += `<span class='good'>${rt.index(this.mode_name, BOT_DELIVER)}</span>`;
	} else if (this.mode === BOT_GO_HOME) {
		dat += `<span class='good'>${rt.index(this.mode_name, BOT_GO_HOME)}</span>`;
	} else if (this.mode === BOT_BLOCKED) {
		dat += `<span class='average'>${rt.index(this.mode_name, BOT_BLOCKED)}</span>`;
	} else if (this.mode === BOT_NAV || this.mode === BOT_WAIT_FOR_NAV) {
		dat += `<span class='average'>${rt.index(this.mode_name, BOT_NAV)}</span>`;
	} else if (this.mode === BOT_NO_ROUTE) {
		dat += `<span class='bad'>${rt.index(this.mode_name, BOT_NO_ROUTE)}</span>`;
	}
	dat += "</div>";
	dat += `<b>Current Load:</b> ${this.load ? this.load.name : "<i>none</i>"}<BR>`;
	dat += `<b>Destination:</b> ${!this.destination ? "<i>none</i>" : this.destination}<BR>`;
	dat += `<b>Power level:</b> ${this.cell ? this.cell.percent() : 0}%`;
	if (this.locked && !ai && !IsAdminGhost(user)) {
		dat += fmt("&nbsp;<br /><div class='notice'>Controls are locked</div><A href='byond://?src=＃;op=unlock'>Unlock Controls</A>", [this]);
	} else {
		dat += fmt("&nbsp;<br /><div class='notice'>Controls are unlocked</div><A href='byond://?src=＃;op=lock'>Lock Controls</A><BR><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=power'>Toggle Power</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=stop'>Stop</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=go'>Proceed</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=home'>Return to Home</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=destination'>Set Destination</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=setid'>Set Bot ID</A><BR>", [this]);
		dat += fmt("<A href='byond://?src=＃;op=sethome'>Set Home</A><BR>", [this]);
		$0 = this;
		if (this.auto_return) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat += fmt("<A href='byond://?src=＃;op=autoret'>Toggle Auto Return Home</A> (＀)<BR>", [$0, $1]);
		$0 = this;
		if (this.auto_pickup) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat += fmt("<A href='byond://?src=＃;op=autopick'>Toggle Auto Pickup Crate</A> (＀)<BR>", [$0, $1]);
		$0 = this;
		if (this.report_delivery) {
			$1 = "On";
		} else {
			$1 = "Off";
		}
		dat += fmt("<A href='byond://?src=＃;op=report'>Toggle Delivery Reporting</A> (＀)<BR>", [$0, $1]);
		if (this.load) {
			dat += fmt("<A href='byond://?src=＃;op=unload'>Unload Now</A><BR>", [this]);
		}
		dat += "<div class='notice'>The maintenance hatch is closed.</div>";
	}
	return dat;
});

// mulebot.dm:310
rt.def("/mob/living/simple_animal/bot/mulebot/proc/has_power", function has_power(f: Frame) {
	return ((((!this.open ? 1 : 0) && this.cell) && (this.cell.charge > 0 ? 1 : 0)) && ((!this.wires.is_cut("Main Power 1") ? 1 : 0) && (!this.wires.is_cut("Main Power 2") ? 1 : 0)));
});

// mulebot.dm:313
rt.def("/mob/living/simple_animal/bot/mulebot/proc/buzz", function buzz(f: Frame, type: Value) {
	if (type === SIGH) {
		this.audible_message(`${this} makes a sighing buzz.`, "<span class='italics'>You hear an electronic buzzing sound.</span>");
		playsound(this.loc, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 0);
	} else if (type === ANNOYED) {
		this.audible_message(`${this} makes an annoyed buzzing sound.`, "<span class='italics'>You hear an electronic buzzing sound.</span>");
		playsound(this.loc, rt.rsc("sound/machines/buzz-two.ogg"), 50, 0);
	} else if (type === DELIGHT) {
		this.audible_message(`${this} makes a delighted ping!`, "<span class='italics'>You hear a ping.</span>");
		playsound(this.loc, rt.rsc("sound/machines/ping.ogg"), 50, 0);
	}
	return f.dot;
});

// mulebot.dm:329
rt.def("/mob/living/simple_animal/bot/mulebot/proc/MouseDrop_T", function* MouseDrop_T(f: Frame, AM: Value, user: Value) {
	if (user.incapacitated() || user.lying) {
		return f.dot;
	}
	if (!rt.istype(AM, T("/atom/movable"))) {
		return f.dot;
	}
	yield* this.load(AM);
	return f.dot;
}, true);

// mulebot.dm:339
rt.def("/mob/living/simple_animal/bot/mulebot/proc/load", function* load(f: Frame, AM: Value) {
	let CRATE: Value = null, O: Value = null;
	if (this.load || AM.anchored) {
		return f.dot;
	}
	if (!isturf(AM.loc)) {
		return f.dot;
	}
	if (rt.istype(AM, T("/obj/structure/closet/crate"))) {
		CRATE = AM;
	} else if (!this.wires.is_cut("Load Check")) {
		this.buzz(SIGH);
		return f.dot;
	}
	if (CRATE) {
		yield* CRATE.close();
	}
	if (rt.istype(AM, T("/obj"))) {
		if ((O = AM).has_buckled_mobs() || rt.locateIn(f, T("/mob"), AM)) {
			this.buzz(SIGH);
			return f.dot;
		}
	}
	if (rt.istype(AM, T("/mob/living"))) {
		if (!(yield* this.load_mob(AM))) {
			return f.dot;
		}
	} else {
		AM.loc = this;
	}
	this.load = AM;
	this.mode = BOT_IDLE;
	yield* this.update_icon();
	return f.dot;
}, true);

// mulebot.dm:374
rt.def("/mob/living/simple_animal/bot/mulebot/proc/load_mob", function* load_mob(f: Frame, M: Value) {
	this.can_buckle = 1;
	if (yield* this.buckle_mob(M)) {
		this.passenger = M;
		this.load = M;
		this.can_buckle = 0;
		return 1;
	}
	return 0;
}, true);

// mulebot.dm:382
rt.def("/mob/living/simple_animal/bot/mulebot/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	if (rt.isIn(f, M, this.buckled_mobs)) {
		M.pixel_y = rt.initial(f, M, "pixel_y") + 9;
		if (M.layer < this.layer) {
			M.layer = this.layer + 0.01;
		}
	} else {
		this.load = null;
		M.layer = rt.initial(f, M, "layer");
		M.pixel_y = rt.initial(f, M, "pixel_y");
	}
	return f.dot;
});

// mulebot.dm:396
rt.def("/mob/living/simple_animal/bot/mulebot/proc/unload", function* unload(f: Frame, dirn: Value) {
	let _T: Value = null, newT: Value = null;
	if (!this.load) {
		return f.dot;
	}
	this.mode = BOT_IDLE;
	this.cut_overlays();
	yield* this.unbuckle_all_mobs();
	if (!this.load) return f.dot;
	this.load.loc = this.loc;
	this.load.pixel_y = rt.initial(f, this.load, "pixel_y");
	this.load.layer = rt.initial(f, this.load, "layer");
	this.load.plane = rt.initial(f, this.load, "plane");
	if (dirn) {
		_T = this.loc;
		newT = rt.getStep(f, _T, dirn);
		if (yield* this.load.CanPass(this.load, newT)) {
			yield* step(this.load, dirn);
		}
	}
	this.load = null;
	return f.dot;
}, true);

// mulebot.dm:420
rt.def("/mob/living/simple_animal/bot/mulebot/proc/call_bot", function* call_bot(f: Frame) {
	let dest_area: Value = null;
	yield* parent_proc();
	if (!(this.path && rt.len(f, this.path))) return f.dot;
	this.target = this.ai_waypoint;
	this.destination = format_text((dest_area = get_area(this.target)).name);
	this.pathset = 1;
	yield* this.start();
	return f.dot;
}, true);

// mulebot.dm:430
rt.def("/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action", function* handle_automated_action(f: Frame) {
	let i: Value = null;
	if (!this.has_power()) {
		this.on = 0;
		return f.dot;
	}
	if (!this.on) return f.dot;
	let speed: Value = (this.wires.is_cut("Motor 1") ? 0 : 1) + (this.wires.is_cut("Motor 2") ? 0 : 2);
	let num_steps: Value = 0;
	if (speed === 0) {
	} else if (speed === 1) {
		num_steps = 10;
	} else if (speed === 2) {
		num_steps = 5;
	} else if (speed === 3) {
		num_steps = 3;
	}
	if (!num_steps) return f.dot;
	yield* this.process_bot();
	num_steps--;
	if (this.mode == 0) return f.dot;
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:451", speed, num_steps, i);
	return f.dot;
}, true, { waitfor: false });

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/handle_automated_action, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/handle_automated_action: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:451", function* (f: Frame, speed: Value, num_steps: Value, i: Value) {
	i = null;
	i = num_steps;
	while (i > 0) {
		yield* sleep(2);
		yield* this.process_bot();
		i--;
	}
	return null;
});

// mulebot.dm:457
rt.def("/mob/living/simple_animal/bot/mulebot/proc/process_bot", function* process_bot(f: Frame) {
	let next: Value = null, B: Value = null, newdir: Value = null, oldloc: Value = null, moved: Value = null;
	if (!this.on || this.client) {
		return f.dot;
	}
	yield* this.update_icon();
	if (this.mode === BOT_IDLE) {
		return f.dot;
	} else if (this.mode === BOT_DELIVER || this.mode === BOT_GO_HOME || this.mode === BOT_BLOCKED) {
		if (this.loc == this.target) {
			yield* this.at_target();
			return f.dot;
		} else if (rt.len(f, this.path) > 0 && this.target) {
			next = rt.index(this.path, 1);
			this.reached_target = 0;
			if (next == this.loc) {
				this.path -= next;
				return f.dot;
			}
			if (isturf(next)) {
				if (this.bloodiness) {
					B = (yield* new_(T("/obj/effect/decal/cleanable/blood/tracks"), this.loc));
					if (this.blood_DNA && rt.len(f, this.blood_DNA)) {
						(rt.modField(f, B, "blood_DNA", (yield* this.blood_DNA.Copy()), rt.bitOr));
					}
					if ((newdir = rt.getDir(f, next, this.loc)) == this.dir) {
						yield* B.setDir(newdir);
					} else {
						if ((newdir = rt.bitOr(newdir, this.dir)) == 3) {
							newdir = 1;
						} else if (newdir == 12) {
							newdir = 4;
						}
						yield* B.setDir(newdir);
					}
					this.bloodiness--;
				}
				oldloc = this.loc;
				moved = (yield* step_towards(this, next));
				if (this.cell) {
					yield* this.cell.use(1);
				}
				if (moved && oldloc != this.loc) {
					this.blockcount = 0;
					this.path -= this.loc;
					if (this.destination == this.home_destination) {
						this.mode = BOT_GO_HOME;
					} else {
						this.mode = BOT_DELIVER;
					}
				} else {
					this.blockcount++;
					this.mode = BOT_BLOCKED;
					if (this.blockcount == 3) {
						this.buzz(ANNOYED);
					}
					if (this.blockcount > 10) {
						this.buzz(SIGH);
						this.mode = BOT_WAIT_FOR_NAV;
						this.blockcount = 0;
						rt.spawnTail(f, 20, "/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:522", next, B, newdir, oldloc, moved);
						return f.dot;
					}
					return f.dot;
				}
			} else {
				this.buzz(ANNOYED);
				this.mode = BOT_NAV;
				return f.dot;
			}
		} else {
			this.mode = BOT_NAV;
			return f.dot;
		}
	} else if (this.mode === BOT_NAV) {
		this.mode = BOT_WAIT_FOR_NAV;
		rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:542", next, B, newdir, oldloc, moved);
	}
	return f.dot;
}, true);

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/process_bot, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:542", function* (f: Frame, next: Value, B: Value, newdir: Value, oldloc: Value, moved: Value) {
	yield* this.calc_path();
	if (rt.len(f, this.path) > 0) {
		this.blockcount = 0;
		this.mode = 14;
		this.buzz(2);
	} else {
		this.buzz(0);
		this.mode = 17;
	}
	return null;
});

// a spawn(20) body of /mob/living/simple_animal/bot/mulebot/proc/process_bot, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/process_bot: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:522", function* (f: Frame, next: Value, B: Value, newdir: Value, oldloc: Value, moved: Value) {
	yield* this.calc_path({ avoid: next });
	if (rt.len(f, this.path) > 0) {
		this.buzz(2);
	}
	this.mode = 14;
	return null;
});

// mulebot.dm:558
rt.def("/mob/living/simple_animal/bot/mulebot/proc/calc_path", function* calc_path(f: Frame, avoid: Value) {
	this.path = (yield* get_path_to(this, this.target, P("/turf/proc/Distance_cardinal"), 0, 250, { id: this.access_card, exclude: avoid }));
	return f.dot;
}, true);

// mulebot.dm:564
rt.def("/mob/living/simple_animal/bot/mulebot/proc/set_destination", function* set_destination(f: Frame, new_dest: Value) {
	this.new_destination = new_dest;
	yield* this.get_nav();
	return f.dot;
}, true);

// mulebot.dm:569
rt.def("/mob/living/simple_animal/bot/mulebot/proc/start", function* start(f: Frame) {
	if (!this.on) {
		return f.dot;
	}
	if (this.destination == this.home_destination) {
		this.mode = BOT_GO_HOME;
	} else {
		this.mode = BOT_DELIVER;
	}
	yield* this.update_icon();
	yield* this.get_nav();
	return f.dot;
}, true);

// mulebot.dm:581
rt.def("/mob/living/simple_animal/bot/mulebot/proc/start_home", function start_home(f: Frame) {
	if (!this.on) {
		return f.dot;
	}
	rt.spawnTail(f, 0, "/mob/living/simple_animal/bot/mulebot/proc/start_home: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:583");
	this.update_icon();
	return f.dot;
});

// a spawn(0) body of /mob/living/simple_animal/bot/mulebot/proc/start_home, a named tail so a world snapshot can hold it while it waits.
rt.tail("/mob/living/simple_animal/bot/mulebot/proc/start_home: spawn at modules/mob/living/simple_animal/bot/mulebot.dm:583", function* (f: Frame) {
	yield* this.set_destination(this.home_destination);
	this.mode = 14;
	return null;
});

// mulebot.dm:590
rt.def("/mob/living/simple_animal/bot/mulebot/proc/at_target", function* at_target(f: Frame) {
	let AM: Value = null, A: Value = null;
	if (!this.reached_target) {
		this.radio_channel = "Supply";
		this.audible_message(`${this} makes a chiming sound!`, "<span class='italics'>You hear a chime.</span>");
		playsound(this.loc, rt.rsc("sound/machines/chime.ogg"), 50, 0);
		this.reached_target = 1;
		if (this.pathset) {
			this.loaddir = this.dir;
			if (this.calling_ai) {
				to_chat(this.calling_ai, `<span class='notice'>${bicon(this)} ${this} wirelessly plays a chiming sound!</span>`);
				playsound(this.calling_ai, rt.rsc("sound/machines/chime.ogg"), 40, 0);
				this.calling_ai = null;
				this.radio_channel = "AI Private";
			}
		}
		if (this.load) {
			if (this.report_delivery) {
				yield* this.speak(`Destination <b>${this.destination}</b> reached. Unloading ${this.load}.`, this.radio_channel);
			}
			yield* this.unload(this.loaddir);
		} else if (this.auto_pickup) {
			if (this.wires.is_cut("Load Check")) {
				for (A of each(rt.getStep(f, this.loc, this.loaddir), T("/atom/movable"))) {
					if (!A.anchored) {
						AM = A;
						break;
					}
				}
			} else {
				AM = rt.locateIn(f, T("/obj/structure/closet/crate"), rt.getStep(f, this.loc, this.loaddir));
			}
			if (AM && AM.Adjacent(this)) {
				yield* this.load(AM);
				if (this.report_delivery) {
					yield* this.speak(`Now loading ${this.load} at <b>${get_area(this)}</b>.`, this.radio_channel);
				}
			}
		}
		if (this.auto_return && this.home_destination && this.destination != this.home_destination) {
			this.start_home();
			this.mode = BOT_BLOCKED;
		} else {
			this.bot_reset();
		}
	}
	return f.dot;
}, true);

// mulebot.dm:636
rt.def("/mob/living/simple_animal/bot/mulebot/proc/Bump", function* Bump(f: Frame, obs: Value) {
	let L: Value = null;
	if (this.wires.is_cut("Avoidance")) {
		if (rt.istype(obs, T("/mob/living"))) {
			if (rt.istype((L = obs), T("/mob/living/silicon/robot"))) {
				this.visible_message(`<span class='danger'>${this} bumps into ${L}!</span>`);
			} else if (!this.paicard) {
				add_logs(this, L, "knocked down");
				this.visible_message(`<span class='danger'>${this} knocks over ${L}!</span>`);
				yield* L.Knockdown(160);
			}
		}
	}
	return (yield* parent_proc());
}, true);

// mulebot.dm:651
rt.def("/mob/living/simple_animal/bot/mulebot/proc/RunOver", function* RunOver(f: Frame, H: Value) {
	let _T: Value = null, blood_dna: Value = null;
	add_logs(this, H, "run over", null, `(DAMTYPE: ${uppertext("brute")})`);
	H.visible_message(`<span class='danger'>${this} drives over ${H}!</span>`, `<span class='userdanger'>${this} drives over you!<span>`);
	playsound(this.loc, rt.rsc("sound/effects/splat.ogg"), 50, 1);
	let damage: Value = rand(5, 15);
	yield* H.apply_damage(2 * damage, "brute", "head", this.run_armor_check("head", "melee"));
	yield* H.apply_damage(2 * damage, "brute", "chest", this.run_armor_check("chest", "melee"));
	yield* H.apply_damage(0.5 * damage, "brute", "l_leg", this.run_armor_check("l_leg", "melee"));
	yield* H.apply_damage(0.5 * damage, "brute", "r_leg", this.run_armor_check("r_leg", "melee"));
	yield* H.apply_damage(0.5 * damage, "brute", "l_arm", this.run_armor_check("l_arm", "melee"));
	yield* H.apply_damage(0.5 * damage, "brute", "r_arm", this.run_armor_check("r_arm", "melee"));
	yield* (_T = rt.getStep(f, this, 0)).add_mob_blood(H);
	if (blood_dna = H.get_blood_dna_list()) {
		this.transfer_blood_dna(blood_dna);
	}
	this.bloodiness += 4;
	return f.dot;
}, true);

// mulebot.dm:674
rt.def("/mob/living/simple_animal/bot/mulebot/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	if (user.incapacitated()) {
		return f.dot;
	}
	if (this.load != user) return f.dot;
	yield* this.unload(0);
	return f.dot;
}, true);

// mulebot.dm:682
rt.def("/mob/living/simple_animal/bot/mulebot/proc/get_nav", function* get_nav(f: Frame) {
	let NB: Value = null, direction: Value = null;
	if (!this.on || this.wires.is_cut("Beacon")) {
		return f.dot;
	}
	for (NB of each(GLOB.deliverybeacons, T("/obj/machinery/navbeacon"))) {
		if (NB.location == this.new_destination) {
			this.destination = this.new_destination;
			this.target = NB.loc;
			if (direction = NB.dir) {
				this.loaddir = text2num(direction);
			} else {
				this.loaddir = 0;
			}
			yield* this.update_icon();
			if (this.destination) {
				yield* this.calc_path();
			}
		}
	}
	return f.dot;
}, true);

// mulebot.dm:701
rt.def("/mob/living/simple_animal/bot/mulebot/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.cell) {
		yield* this.cell.emp_act(severity);
	}
	if (this.load) {
		yield* this.load.emp_act(severity);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// mulebot.dm:708
rt.def("/mob/living/simple_animal/bot/mulebot/proc/explode", function* explode(f: Frame) {
	let Tsec: Value = null;
	this.visible_message(`<span class='boldannounce'>${this} blows apart!</span>`);
	yield* new_(T("/obj/item/device/assembly/prox_sensor"), (Tsec = rt.getStep(f, this, 0)));
	yield* new_(T("/obj/item/stack/rods"), Tsec);
	yield* new_(T("/obj/item/stack/rods"), Tsec);
	yield* new_(T("/obj/item/stack/cable_coil/cut"), Tsec);
	if (this.cell) {
		this.cell.loc = Tsec;
		yield* this.cell.update_icon();
		this.cell = null;
	}
	yield* do_sparks(3, 1, this);
	yield* new_(T("/obj/effect/decal/cleanable/oil"), this.loc);
	yield* parent_proc();
	return f.dot;
}, true);

// mulebot.dm:727
rt.def("/mob/living/simple_animal/bot/mulebot/proc/remove_air", function* remove_air(f: Frame, amount: Value) {
	if (this.loc) {
		return (yield* this.loc.remove_air(amount));
	}
	return null;
}, true);

// mulebot.dm:732
rt.def("/mob/living/simple_animal/bot/mulebot/resist", function* resist(f: Frame) {
	yield* parent_proc();
	if (!this.load) return f.dot;
	yield* this.unload();
	return f.dot;
}, true, { verb: { name: "Resist", category: "IC" } });

// mulebot.dm:737
rt.def("/mob/living/simple_animal/bot/mulebot/proc/UnarmedAttack", function* UnarmedAttack(f: Frame, A: Value) {
	if (isturf(A) && isturf(this.loc) && this.loc.Adjacent(A) && this.load) {
		yield* this.unload(rt.getDir(f, this.loc, A));
	} else {
		yield* parent_proc();
	}
	return f.dot;
}, true);

// mulebot.dm:743
rt.def("/mob/living/simple_animal/bot/mulebot/proc/insertpai", function* insertpai(f: Frame, user: Value, card: Value) {
	if (!(yield* parent_proc())) return f.dot;
	this.visible_message(`${this} safeties are locked on.`);
	return f.dot;
}, true);

rt.type(10945, "/obj/machinery/bot_core/mulebot", "/obj/machinery/bot_core", {
	req_access: null,
});

// mulebot.dm:751
rt.def("/obj/machinery/bot_core/mulebot/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = list(31);
	return f.dot;
});
