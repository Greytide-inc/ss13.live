// Based on /tg/station's code/modules/mob/mob.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, truthy, fmt } = rt;


// mob.dm:2
rt.def("/mob/proc/Destroy", function* Destroy(f: Frame) {
	let M: Value = null, observe: Value = null, infection: Value = null, cc: Value = null;
	yield* this.set_typing_indicator(0);
	GLOB.mob_list -= this;
	GLOB.dead_mob_list -= this;
	GLOB.living_mob_list -= this;
	GLOB.all_clockwork_mobs -= this;
	GLOB.mob_directory -= this.tag;
	if (this.observers && rt.len(f, this.observers)) {
		for (M of each(this.observers)) {
			yield* (observe = M).reset_perspective(null);
		}
	}
	yield* qdel(this.hud_used);
	if (this.mind && this.mind.current == this) {
		yield* this.spellremove(this);
	}
	for (infection of each(this.viruses)) {
		yield* qdel(infection);
	}
	for (cc of each(this.client_colours)) {
		yield* qdel(cc);
	}
	this.client_colours = null;
	yield* this.ghostize();
	yield* parent_proc();
	return QDEL_HINT_HARDDEL;
}, true);

// mob.dm:25
rt.def("/mob/proc/Initialize", function* Initialize(f: Frame) {
	let v: Value = null, AA: Value = null;
	this.tag = `mob_${rt.incGl("next_mob_id", 1, true)}`;
	GLOB.mob_list += this;
	rt.setAt(GLOB.mob_directory, this.tag, this);
	if (this.stat == 2) {
		GLOB.dead_mob_list += this;
	} else {
		GLOB.living_mob_list += this;
	}
	yield* this.prepare_huds();
	this.can_ride_typecache = typecacheof(this.can_ride_typecache);
	for (v of each(GLOB.active_alternate_appearances)) {
		if (!v) {
			continue;
		}
		(AA = v).onNewMob(this);
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// mob.dm:42
rt.def("/atom/proc/prepare_huds", function prepare_huds(f: Frame) {
	let hud: Value = null, I: Value = null;
	this.hud_list = list();
	for (hud of each(this.hud_possible)) {
		(I = image(rt.rsc("icons/mob/hud.dmi"), this, "")).appearance_flags = 10;
		rt.setAt(this.hud_list, hud, I);
	}
	return f.dot;
});

// mob.dm:52
rt.def("/mob/proc/Cell", function Cell(f: Frame) {
	let id: Value = null, gas: Value = null;
	if (!this.loc) {
		return 0;
	}
	let environment: Value = this.loc.return_air();
	let t: Value = `<span class='notice'>Coordinates: ${this.x},${this.y} \n</span>`;
	t += `<span class='danger'>Temperature: ${environment.temperature} \n</span>`;
	for (id of each(environment.gases)) {
		if (rt.index((gas = rt.index(environment.gases, id)), 1)) {
			t += `<span class='notice'>${rt.index(rt.index(gas, 3), 2)}: ${rt.index(gas, 1)} \n</span>`;
		}
	}
	to_chat(f.usr, t);
	return f.dot;
}, false, { hidden: true, verb: { category: "Admin" } });

// mob.dm:67
rt.def("/mob/proc/show_message", function show_message(f: Frame, msg: Value, type: Value, alt_msg: Value, alt_type: Value) {
	if (!this.client) {
		return f.dot;
	}
	msg = copytext(msg, 1, 1024);
	if (type) {
		if (rt.bitAnd(type, 1) && this.eye_blind) {
			if (!alt_msg) {
				return f.dot;
			} else {
				msg = alt_msg;
				type = alt_type;
			}
		}
		if (rt.bitAnd(type, 2) && !this.can_hear()) {
			if (!alt_msg) {
				return f.dot;
			} else {
				msg = alt_msg;
				if (rt.bitAnd((type = alt_type), 1) && this.eye_blind) {
					return f.dot;
				}
			}
		}
	}
	if (this.stat == 1) {
		if (rt.bitAnd(type, 2)) {
			to_chat(this, "<I>... You can almost hear something ...</I>");
		}
	} else {
		to_chat(this, msg);
	}
	return f.dot;
});

// mob.dm:105
rt.def("/atom/proc/visible_message", function visible_message(f: Frame, message: Value, self_message: Value, blind_message: Value, vision_distance: Value, ignored_mob: Value) {
	let _T: Value = null, M: Value = null, msg: Value = null, C: Value = null, MT: Value = null;
	let $e: any;
	if (!(_T = rt.getStep(f, this, 0))) {
		return f.dot;
	}
	let range: Value = 7;
	if (vision_distance) {
		range = vision_distance;
	}
	// stress2c: only mobs with a client get the message, and a hearer is never further than `range` tiles from _T. With no
	// player's mob that close, skip the view() and the hearer scan. TG_CHECK_VISMSG=1 scans anyway and counts any client
	// mob found after the pre-check said there was none.
	let near = 0;
	for (C of each(GLOB.clients, T("/client"))) {
		MT = C.mob ? rt.getStep(f, C.mob, 0) : null;
		if (MT && MT.z == _T.z && get_dist(MT, _T) <= range) {
			near = 1;
			break;
		}
	}
	const vchk = truthy(vismsg_check_mode());
	if (!near && !vchk) {
		return f.dot;
	}
	for (M of each(get_hearers_in_view(range, this), T("/mob"))) {
		if (!M.client) {
			continue;
		}
		if (vchk) vismsg_check(near);
		if (M == ignored_mob) {
			continue;
		}
		msg = message;
		if (M == this) {
			if (self_message) {
				msg = self_message;
			}
		} else if (M.see_invisible < this.invisibility || _T != this.loc && _T != this) {
			if (blind_message) {
				msg = blind_message;
			} else {
				continue;
			}
		} else if (_T.lighting_object) {
			if (_T.lighting_object.invisibility <= M.see_invisible && _T.is_softly_lit()) {
				if (blind_message) {
					msg = blind_message;
				} else {
					continue;
				}
			}
		}
		M.show_message(msg, 1, blind_message, 2);
	}
	return f.dot;
});

// mob.dm:146
rt.def("/mob/proc/audible_message", function audible_message(f: Frame, message: Value, deaf_message: Value, hearing_distance: Value, self_message: Value) {
	let M: Value = null, msg: Value = null;
	let range: Value = 7;
	if (hearing_distance) {
		range = hearing_distance;
	}
	for (M of each(get_hearers_in_view(range, this), T("/mob"))) {
		msg = message;
		if (self_message && M == this) {
			msg = self_message;
		}
		M.show_message(msg, 2, deaf_message, 1);
	}
	return f.dot;
});

// mob.dm:162
rt.def("/atom/proc/audible_message", function audible_message(f: Frame, message: Value, deaf_message: Value, hearing_distance: Value) {
	let M: Value = null;
	let range: Value = 7;
	if (hearing_distance) {
		range = hearing_distance;
	}
	for (M of each(get_hearers_in_view(range, this), T("/mob"))) {
		M.show_message(message, 2, deaf_message, 1);
	}
	return f.dot;
});

// mob.dm:174
rt.def("/mob/proc/get_item_by_slot", function get_item_by_slot(f: Frame, slot_id: Value) {
	return null;
});

// mob.dm:184
rt.def("/mob/proc/attack_ui", function* attack_ui(f: Frame, slot: Value) {
	let W: Value = null, I: Value = null;
	if (rt.istype((W = this.get_active_held_item()), T("/obj/item"))) {
		if (yield* this.equip_to_slot_if_possible(W, slot, 0, 0, 0)) {
			return 1;
		}
	}
	if (!W) {
		if (rt.istype((I = this.get_item_by_slot(slot)), T("/obj/item"))) {
			yield* I.attack_hand(this);
		}
	}
	return 0;
}, true);

// mob.dm:203
rt.def("/mob/proc/equip_to_slot_if_possible", function* equip_to_slot_if_possible(f: Frame, W: Value, slot: Value, qdel_on_fail: Value, disable_warning: Value, redraw_mob: Value, bypass_equip_delay_self: Value) {
	qdel_on_fail ??= 0;
	disable_warning ??= 0;
	redraw_mob ??= 1;
	bypass_equip_delay_self ??= 0;
	if (!rt.istype(W, T("/obj/item"))) {
		return 0;
	}
	if (!(yield* W.mob_can_equip(this, null, slot, disable_warning, bypass_equip_delay_self))) {
		if (qdel_on_fail) {
			yield* qdel(W);
		} else if (!disable_warning) {
			to_chat(this, "<span class='warning'>You are unable to equip that!</span>");
		}
		return 0;
	}
	yield* this.equip_to_slot(W, slot, redraw_mob);
	return 1;
}, true);

// mob.dm:222
rt.def("/mob/proc/equip_to_slot_or_del", function* equip_to_slot_or_del(f: Frame, W: Value, slot: Value) {
	return (yield* this.equip_to_slot_if_possible(W, slot, 1, 1, 0, 1));
}, true);

// mob.dm:227
rt.def("/mob/proc/equip_to_appropriate_slot", function* equip_to_appropriate_slot(f: Frame, W: Value) {
	let slot_priority: Value = null, slot: Value = null;
	if (!rt.istype(W, T("/obj/item"))) {
		return 0;
	}
	if (!(slot_priority = W.slot_equipment_priority)) {
		slot_priority = list(slot_back, slot_wear_id, slot_w_uniform, slot_wear_suit, slot_wear_mask, slot_head, slot_neck, slot_shoes, slot_gloves, slot_ears, slot_glasses, slot_belt, slot_s_store, slot_l_store, slot_r_store, slot_generic_dextrous_storage);
	}
	for (slot of each(slot_priority)) {
		if (yield* this.equip_to_slot_if_possible(W, slot, 0, 1, 1)) {
			return 1;
		}
	}
	return 0;
}, true);

// mob.dm:250
rt.def("/mob/proc/reset_perspective", function reset_perspective(f: Frame, A: Value) {
	if (!this.client) return f.dot;
	if (rt.istype(A, T("/atom/movable"))) {
		this.client.perspective = 1;
		this.client.eye = A;
	} else if (isturf(this.loc)) {
		this.client.eye = this.client.mob;
		this.client.perspective = 0;
	} else {
		this.client.perspective = 1;
		this.client.eye = this.loc;
	}
	return 1;
});

// mob.dm:263
rt.def("/mob/living/proc/reset_perspective", function* reset_perspective(f: Frame, A: Value) {
	let AT: Value = null;
	if (!(yield* parent_proc())) return f.dot;
	yield* this.update_sight();
	if (this.client.eye != this) {
		yield* (AT = this.client.eye).get_remote_view_fullscreens(this);
	} else {
		yield* this.clear_fullscreen("remote_view", 0);
	}
	this.update_pipe_vision();
	return f.dot;
}, true);

// mob.dm:280
rt.def("/mob/verb/examinate", function* examinate(f: Frame, A: Value) {
	if (is_blind(this)) {
		to_chat(this, "<span class='notice'>Something is there but you can't see it.</span>");
		return f.dot;
	}
	yield* this.face_atom(A);
	yield* A.examine(this);
	return f.dot;
}, true, { verb: { name: "Examine", category: "IC" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// mob.dm:295
rt.def("/mob/verb/pointed", function* pointed(f: Frame, A: Value) {
	let tile: Value = null;
	if (!this || !isturf(this.loc) || !rt.isIn(f, A, view(this.loc))) {
		return 0;
	}
	if (rt.istype(A, T("/obj/effect/temp_visual/point"))) {
		return 0;
	}
	if (!(tile = rt.getStep(f, A, 0))) {
		return 0;
	}
	yield* new_(T("/obj/effect/temp_visual/point"), A, this.invisibility);
	return 1;
}, true, { verb: { name: "Point To", category: "Object" }, argTypes: [{ type: 28, path: "/atom", source: "view" }] });

// mob.dm:310
rt.def("/mob/proc/start_pulling", function* start_pulling(f: Frame, AM: Value, supress_message: Value) {
	supress_message ??= 0;
	if (!AM || !this) {
		return 0;
	}
	if (!AM.can_be_pulled(this)) {
		return 0;
	}
	if (this.throwing || this.incapacitated()) {
		return 0;
	}
	// tg_js, tg e165969821 (2021): a pull ring (A pulls B pulls A) made Move() recurse forever. Break the chain that leads back to us.
	// Only mobs pull here (2017 tg keeps `pulling` on /mob), so the chain is followed through mobs only.
	let M: Value = rt.istype(AM, T("/mob")) ? AM.pulling : null;
	for (let hops = 0; M && hops < 50; hops++) {
		if (M == this) {
			yield* AM.stop_pulling();
			break;
		}
		M = rt.istype(M, T("/mob")) ? M.pulling : null;
	}
	M = null;
	yield* AM.add_fingerprint(this);
	if (this.pulling) {
		if (AM == this.pulling) {
			return f.dot;
		}
		yield* this.stop_pulling();
	}
	this.changeNext_move(10);
	if (AM.pulledby) {
		if (!supress_message) {
			this.visible_message(`<span class='danger'>${this} has pulled ${AM} from ${AM.pulledby}'s grip.</span>`);
		}
		yield* AM.pulledby.stop_pulling();
	}
	this.pulling = AM;
	AM.pulledby = this;
	if (!supress_message) {
		playsound(this.loc, rt.rsc("sound/weapons/thudswoosh.ogg"), 50, 1, -1);
	}
	this.update_pull_hud_icon();
	if (!ismob(AM)) return f.dot;
	M = AM;
	if (!supress_message) {
		this.visible_message(`<span class='warning'>${this} has grabbed ${M} passively!</span>`);
	}
	if (!rt.istype(this, T("/mob/living/carbon"))) {
		M.LAssailant = null;
	} else {
		M.LAssailant = f.usr;
	}
	return f.dot;
}, true);

// mob.dm:350
rt.def("/mob/proc/spin", function* spin(f: Frame, spintime: Value, speed: Value) {
	let D: Value = this.dir;
	if (spintime < 1 || speed < 1 || !spintime || !speed) {
		return f.dot;
	}
	while (spintime >= speed) {
		yield* sleep(speed);
		if (D === 1) {
			D = 4;
		} else if (D === 2) {
			D = 8;
		} else if (D === 4) {
			D = 2;
		} else if (D === 8) {
			D = 1;
		}
		yield* this.setDir(D);
		spintime -= speed;
	}
	return f.dot;
}, true, { waitfor: false });

// mob.dm:372
rt.def("/mob/verb/stop_pulling", function* stop_pulling(f: Frame) {
	let L: Value = null;
	if (!this.pulling) return f.dot;
	this.pulling.pulledby = null;
	if (rt.istype(this.pulling, T("/mob/living"))) {
		yield* (L = this.pulling).update_canmove();
	}
	this.pulling = null;
	this.grab_state = 0;
	this.update_pull_hud_icon();
	return f.dot;
}, true, { verb: { name: "Stop Pulling", category: "IC" } });

// mob.dm:382
rt.def("/mob/proc/update_pull_hud_icon", function update_pull_hud_icon(f: Frame) {
	if (!this.hud_used) return f.dot;
	if (!this.hud_used.pull_icon) return f.dot;
	this.hud_used.pull_icon.update_icon(this);
	return f.dot;
});

// mob.dm:390
rt.def("/mob/verb/mode", function* mode(f: Frame) {
	let I: Value = null;
	if (rt.istype(this.loc, T("/obj/mecha"))) {
		return f.dot;
	}
	if (this.incapacitated()) {
		return f.dot;
	}
	if (!(I = this.get_active_held_item())) return f.dot;
	yield* I.attack_self(this);
	yield* this.update_inv_hands();
	return f.dot;
}, true, { verb: { name: "Activate Held Object", category: "Object", src: 10 } });

// mob.dm:418
rt.def("/mob/verb/memory", function memory(f: Frame) {
	if (this.mind) {
		this.mind.show_memory(this);
	} else {
		to_chat(this, "You don't have a mind datum for some reason, so you can't look at your notes, if you had any.");
	}
	return f.dot;
}, false, { verb: { name: "Notes", category: "IC", desc: "View your character's notes memory." } });

// mob.dm:426
rt.def("/mob/verb/add_memory", function add_memory(f: Frame, msg: Value) {
	if (this.mind) {
		// tg_js, tg 0fa87b7bbd (2019): one note per 5 seconds (notes were spammed to bloat the round).
		if (rt.worldTime(f) < this.memory_throttle_time) return f.dot;
		this.memory_throttle_time = rt.worldTime(f) + 50;
		msg = sanitize((msg = copytext(msg, 1, 1024)));
		this.mind.store_memory(msg);
	} else {
		to_chat(this, "You don't have a mind datum for some reason, so you can't add a note to it.");
	}
	return f.dot;
}, false, { verb: { name: "Add Note", category: "IC" }, argTypes: [{ type: 64 }] });

// mob.dm:438
rt.def("/mob/verb/abandon_mob", function* abandon_mob(f: Frame) {
	if (!GLOB.abandon_allowed) {
		return f.dot;
	}
	if (this.stat != 2 || !GLOB.SSticker) {
		to_chat(f.usr, "<span class='boldnotice'>You must be dead to use this!</span>");
		return f.dot;
	}
	log_game(`${f.usr.name}/${f.usr.key} used abandon mob.`);
	to_chat(f.usr, "<span class='boldnotice'>Please roleplay correctly!</span>");
	if (!this.client) {
		log_game(`${f.usr.key} AM failed due to disconnect.`);
		return f.dot;
	}
	this.client.screen.Cut();
	this.client.screen += GLOB.void;
	if (!this.client) {
		log_game(`${f.usr.key} AM failed due to disconnect.`);
		return f.dot;
	}
	let M: Value = (yield* new_(T("/mob/dead/new_player")));
	if (!this.client) {
		log_game(`${f.usr.key} AM failed due to disconnect.`);
		yield* qdel(M);
		return f.dot;
	}
	M.key = this.key;
	return f.dot;
}, true, { verb: { name: "Respawn", category: "OOC" } });

// mob.dm:472
rt.def("/mob/verb/cancel_camera", function* cancel_camera(f: Frame) {
	yield* this.reset_perspective(null);
	yield* this.unset_machine();
	return f.dot;
}, true, { verb: { name: "Cancel Camera View", category: "OOC" } });

// mob.dm:489
rt.def("/mob/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let t1: Value = null, slot: Value = null, hand_index: Value = null, what: Value = null;
	// tg_js: only your own windows (every mach_close link names the reader's own mob); any player could unset another's machine
	if (rt.at(href_list, "mach_close") && f.usr == this) {
		t1 = `window=${rt.at(href_list, "mach_close")}`;
		yield* this.unset_machine();
		rt.op(f, "Browse", [], [this, null, t1], false);
	}
	if (rt.at(href_list, "refresh")) {
		// tg_js: only a mob can be shown an inventory (a console as machine was an undefined-proc runtime; no link sends refresh to a mob)
		if (rt.istype(this.machine, T("/mob")) && get_dist(this, f.usr) <= 1) {
			yield* this.show_inv(this.machine);
		}
	}
	if (f.usr.canUseTopic(this, 1, 1)) {
		if (rt.at(href_list, "item")) {
			slot = text2num(rt.at(href_list, "item"));
			hand_index = text2num(rt.at(href_list, "hand_index"));
			// tg_js: a hand is a whole number the mob has (0.5 was a list-index runtime, 3 a hand that isn't there)
			if (hand_index && !(Number.isInteger(hand_index) && hand_index >= 1 && hand_index <= rt.len(f, this.held_items))) return f.dot;
			if (hand_index) {
				what = this.get_item_for_held_index(hand_index);
				slot = list(slot, hand_index);
			} else {
				what = this.get_item_by_slot(slot);
			}
			if (what) {
				if (!rt.bitAnd(what.flags, 128)) {
					yield* f.usr.stripPanelUnequip(what, this, slot);
				}
			} else {
				yield* f.usr.stripPanelEquip(what, this, slot);
			}
		}
	}
	if (f.usr.machine != this) return f.dot;
	if (this.Adjacent(f.usr)) {
		yield* this.show_inv(f.usr);
	} else {
		rt.op(f, "Browse", [], [f.usr, null, fmt("window=mob＃", [this])], false);
	}
	return f.dot;
}, true);

// mob.dm:531
rt.def("/mob/proc/MouseDrop", function* MouseDrop(f: Frame, M: Value) {
	yield* parent_proc();
	if (M != f.usr) {
		return f.dot;
	}
	if (f.usr == this) {
		return f.dot;
	}
	if (!this.Adjacent(f.usr)) {
		return f.dot;
	}
	if (rt.istype(M, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	yield* this.show_inv(f.usr);
	return f.dot;
}, true);

// mob.dm:543
rt.def("/mob/proc/is_active", function is_active(f: Frame) {
	return (0 >= f.usr.stat ? 1 : 0);
});

// mob.dm:549
rt.def("/mob/proc/see", function see(f: Frame, message: Value) {
	if (!this.is_active()) {
		return 0;
	}
	to_chat(this, message);
	return 1;
});

// mob.dm:559
rt.def("/mob/proc/Stat", function* Stat(f: Frame) {
	let cached: Value = null, ETA: Value = null, _T: Value = null, SS: Value = null, overrides: Value = null, I: Value = null, A: Value = null;
	let $e: any;
	yield* parent_proc();
	if (statpanel("Status")) {
		if (this.client) {
			stat(null, `Ping: ${round(this.client.lastping, 1)}ms (Average: ${round(this.client.avgping, 1)}ms)`);
		}
		stat(null, `Map: ${GLOB.SSmapping.config.map_name}`);
		if (cached = GLOB.SSmapping.next_map_config) {
			stat(null, `Next Map: ${cached.map_name}`);
		}
		stat(null, `Server Time: ${time2text(rt.world().timeofday, "YYYY-MM-DD hh:mm:ss")}`);
		stat(null, `Station Time: ${worldtime2text()}`);
		stat(null, `Time Dilation: ${round(GLOB.SStime_track.time_dilation_current, 1)}% AVG:(${round(GLOB.SStime_track.time_dilation_avg_fast, 1)}%, ${round(GLOB.SStime_track.time_dilation_avg, 1)}%, ${round(GLOB.SStime_track.time_dilation_avg_slow, 1)}%)`);
		if (GLOB.SSshuttle.emergency) {
			if (ETA = GLOB.SSshuttle.emergency.getModeStr()) {
				stat(null, `${ETA} ${GLOB.SSshuttle.emergency.getTimerStr()}`);
			}
		}
	}
	if (this.client && this.client.holder) {
		if (statpanel("MC")) {
			_T = rt.getStep(f, this.client.eye, 0);
			stat("Location:", `(${_T.x},${_T.y},${_T.z})`);
			stat("CPU:", `${rt.world().cpu}`);
			stat("Instances:", `${rt.len(f, rt.world().contents)}`);
			yield* GLOB.GLOB.stat_entry();
			yield* GLOB.config.stat_entry();
			stat(null);
			if (GLOB.Master) {
				yield* GLOB.Master.stat_entry();
			} else {
				stat("Master Controller:", "ERROR");
			}
			if (GLOB.Failsafe) {
				yield* GLOB.Failsafe.stat_entry();
			} else {
				stat("Failsafe Controller:", "ERROR");
			}
			if (GLOB.Master) {
				stat(null);
				for (SS of each(GLOB.Master.subsystems, T("/datum/controller/subsystem"))) {
					yield* SS.stat_entry();
				}
			}
			yield* GLOB.cameranet.stat_entry();
		}
		if (statpanel("Tickets")) {
			yield* GLOB.ahelp_tickets.stat_entry();
		}
	}
	if (this.listed_turf && this.client) {
		if (!this.TurfAdjacent(this.listed_turf)) {
			this.listed_turf = null;
		} else {
			statpanel(this.listed_turf.name, null, this.listed_turf);
			overrides = list();
			for (I of each(this.client.images, T("/image"))) {
				if (I.loc && I.loc.loc == this.listed_turf && I.override) {
					overrides += I.loc;
				}
			}
			for (A of each(this.listed_turf, T("/atom"))) {
				if (!A.mouse_opacity) {
					continue;
				}
				if (A.invisibility > this.see_invisible) {
					continue;
				}
				if (rt.len(f, overrides) && rt.isIn(f, A, overrides)) {
					continue;
				}
				statpanel(this.listed_turf.name, null, A);
			}
		}
	}
	if (this.mind) {
		this.add_spells_to_statpanel(this.mind.spell_list);
		if (this.mind.changeling) {
			this.add_stings_to_statpanel(this.mind.changeling.purchasedpowers);
		}
	}
	this.add_spells_to_statpanel(this.mob_spell_list);
	return f.dot;
}, true);

// mob.dm:628
rt.def("/mob/proc/add_spells_to_statpanel", function add_spells_to_statpanel(f: Frame, spells: Value) {
	let S: Value = null;
	let $e: any;
	for (S of each(spells, T("/obj/effect/proc_holder/spell"))) {
		if (S.can_be_cast_by(this)) {
			if (S.charge_type === "recharge") {
				statpanel(`${S.panel}`, `${S.charge_counter / 10}/${S.charge_max / 10}`, S);
			} else if (S.charge_type === "charges") {
				statpanel(`${S.panel}`, `${S.charge_counter}/${S.charge_max}`, S);
			} else if (S.charge_type === "holdervar") {
				statpanel(`${S.panel}`, `${S.holder_var_type} ${S.holder_var_amount}`, S);
			}
		}
	}
	return f.dot;
});

// mob.dm:639
rt.def("/mob/proc/add_stings_to_statpanel", function add_stings_to_statpanel(f: Frame, stings: Value) {
	let S: Value = null;
	let $e: any;
	for (S of each(stings, T("/obj/effect/proc_holder/changeling"))) {
		if (S.chemical_cost >= 0 && S.can_be_used_by(this)) {
			statpanel(`${S.panel}`, S.chemical_cost > 0 ? `${S.chemical_cost}` : "", S);
		}
	}
	return f.dot;
});

// mob.dm:645
rt.def("/mob/proc/canface", function canface(f: Frame) {
	if (!this.canmove) {
		return 0;
	}
	if (this.client.moving) {
		return 0;
	}
	if (rt.worldTime(f) < this.client.move_delay) {
		return 0;
	}
	if (this.stat == 2) {
		return 0;
	}
	if (this.anchored) {
		return 0;
	}
	if (this.notransform) {
		return 0;
	}
	if (this.restrained()) {
		return 0;
	}
	return 1;
});

// mob.dm:662
rt.def("/mob/proc/fall", function* fall(f: Frame, forced: Value) {
	yield* this.drop_all_held_items();
	return f.dot;
}, true);

// mob.dm:666
rt.def("/mob/verb/eastface", function* eastface(f: Frame) {
	if (!this.canface()) {
		return 0;
	}
	yield* this.setDir(4);
	this.client.move_delay += (yield* this.movement_delay());
	return 1;
}, true, { hidden: true });

// mob.dm:675
rt.def("/mob/verb/westface", function* westface(f: Frame) {
	if (!this.canface()) {
		return 0;
	}
	yield* this.setDir(8);
	this.client.move_delay += (yield* this.movement_delay());
	return 1;
}, true, { hidden: true });

// mob.dm:684
rt.def("/mob/verb/northface", function* northface(f: Frame) {
	if (!this.canface()) {
		return 0;
	}
	yield* this.setDir(1);
	this.client.move_delay += (yield* this.movement_delay());
	return 1;
}, true, { hidden: true });

// mob.dm:693
rt.def("/mob/verb/southface", function* southface(f: Frame) {
	if (!this.canface()) {
		return 0;
	}
	yield* this.setDir(2);
	this.client.move_delay += (yield* this.movement_delay());
	return 1;
}, true, { hidden: true });

// mob.dm:713
rt.def("/mob/proc/get_ghost", function get_ghost(f: Frame, even_if_they_cant_reenter: Value) {
	even_if_they_cant_reenter ??= 0;
	if (!this.mind) return f.dot;
	return this.mind.get_ghost(even_if_they_cant_reenter);
});

// mob.dm:717
rt.def("/mob/proc/grab_ghost", function* grab_ghost(f: Frame, force: Value) {
	if (!this.mind) return f.dot;
	return (yield* this.mind.grab_ghost({ force: force }));
}, true);

// mob.dm:720
rt.def("/mob/proc/notify_ghost_cloning", function* notify_ghost_cloning(f: Frame, message: Value, sound: Value, source: Value, flashwindow: Value) {
	let ghost: Value = null;
	message ??= "Someone is trying to revive you. Re-enter your corpse if you want to be revived!";
	sound ??= rt.rsc("sound/effects/genetics.ogg");
	if (!(ghost = this.get_ghost())) return f.dot;
	yield* ghost.notify_cloning(message, sound, source, flashwindow);
	return ghost;
}, true);

// mob.dm:726
rt.def("/mob/proc/AddSpell", function* AddSpell(f: Frame, S: Value) {
	this.mob_spell_list += S;
	yield* S.action.Grant(this);
	return f.dot;
}, true);

// mob.dm:730
rt.def("/mob/proc/RemoveSpell", function* RemoveSpell(f: Frame, spell: Value) {
	let X: Value = null, S: Value = null;
	if (!spell) {
		return f.dot;
	}
	for (X of each(this.mob_spell_list)) {
		if (rt.op(f, "IsType", [], [(S = X), spell])) {
			this.mob_spell_list -= S;
			yield* qdel(S);
		}
	}
	return f.dot;
}, true);

// mob.dm:740
rt.def("/mob/proc/shuttleRotate", function* shuttleRotate(f: Frame, rotation: Value) {
	yield* this.setDir(angle2dir(rotation + dir2angle(this.dir)));
	return f.dot;
}, true);

// mob.dm:744
rt.def("/mob/proc/buckle_mob", function* buckle_mob(f: Frame) {
	let old_density: Value = null, can_step: Value = null;
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (f.args[0].buckled) {
		return 0;
	}
	let _T: Value = rt.getStep(f, this, 0);
	if (f.args[0].loc != _T) {
		old_density = this.density;
		this.density = 0;
		can_step = (yield* step_towards(f.args[0], _T));
		this.density = old_density;
		if (!can_step) {
			return 0;
		}
	}
	return (yield* parent_proc());
}, true, { args: ["M", "force", "check_loc"] });

// mob.dm:758
rt.def("/mob/proc/post_buckle_mob", function post_buckle_mob(f: Frame, M: Value) {
	let height: Value = null;
	if (rt.isIn(f, M, this.buckled_mobs)) {
		height = M.get_mob_buckling_height(this);
		M.pixel_y = rt.initial(f, M, "pixel_y") + height;
		if (M.layer < this.layer) {
			M.layer = this.layer + 0.1;
		}
	} else {
		M.layer = rt.initial(f, M, "layer");
		M.pixel_y = rt.initial(f, M, "pixel_y");
	}
	return f.dot;
});

// mob.dm:769
rt.def("/mob/proc/get_mob_buckling_height", function get_mob_buckling_height(f: Frame, seat: Value) {
	let L: Value = null;
	if (rt.istype(seat, T("/mob/living"))) {
		if ((L = seat).mob_size <= MOB_SIZE_SMALL) {
			return 0;
		}
	}
	return 9;
});

// mob.dm:785
rt.def("/mob/proc/can_see_reagents", function can_see_reagents(f: Frame) {
	let H: Value = null, CL: Value = null;
	if (this.stat == 2) {
		return 1;
	}
	if (this.has_unlimited_silicon_privilege) {
		return 1;
	}
	if (rt.istype(this, T("/mob/living/carbon/human"))) {
		if ((H = this).head && rt.istype(H.head, T("/obj/item/clothing"))) {
			if ((CL = H.head).scan_reagents) {
				return 1;
			}
		}
		if (H.wear_mask && H.wear_mask.scan_reagents) {
			return 1;
		}
		if (H.glasses && rt.istype(H.glasses, T("/obj/item/clothing"))) {
			if ((CL = H.glasses).scan_reagents) {
				return 1;
			}
		}
	}
	return 0;
});

// mob.dm:809
rt.def("/mob/proc/faction_check_mob", function faction_check_mob(f: Frame, target: Value, exact_match: Value) {
	let faction_src: Value = null, faction_target: Value = null;
	if (exact_match) {
		faction_src = this.faction.Copy();
		faction_target = target.faction.Copy();
		if (!rt.isIn(f, fmt("＃", [this]), faction_target)) {
			faction_src -= fmt("＃", [this]);
		}
		if (!rt.isIn(f, fmt("＃", [target]), faction_src)) {
			faction_target -= fmt("＃", [target]);
		}
		return faction_check(faction_src, faction_target, 1);
	}
	return faction_check(this.faction, target.faction, 0);
});

// mob.dm:821
rt.def("/proc/faction_check", function faction_check(f: Frame, faction_A: Value, faction_B: Value, exact_match: Value) {
	let match_list: Value = null, length: Value = null;
	if (exact_match) {
		match_list = rt.bitAnd(faction_A, faction_B);
		if (length = rt.length(match_list)) {
			return (length == rt.length(faction_A) ? 1 : 0);
		}
	} else {
		return rt.length((match_list = rt.bitAnd(faction_A, faction_B)));
	}
	return 0;
});

// mob.dm:834
rt.def("/mob/proc/fully_replace_character_name", function fully_replace_character_name(f: Frame, oldname: Value, newname: Value) {
	let _T: Value = null, obj: Value = null;
	if (!newname) {
		return 0;
	}
	this.real_name = newname;
	this.name = newname;
	if (this.mind) {
		this.mind.name = newname;
	}
	if (oldname) {
		this.replace_records_name(oldname, newname);
		this.replace_identification_name(oldname, newname);
		for (_T of each(GLOB.SSticker.minds, T("/datum/mind"))) {
			obj = null;
			for (obj of each(_T.objectives, T("/datum/objective"))) {
				if (obj.target && obj.target.current && obj.target.current.real_name == this.name) {
					obj.update_explanation_text();
				}
			}
		}
	}
	return 1;
});

// mob.dm:860
rt.def("/mob/proc/replace_identification_name", function replace_identification_name(f: Frame, oldname: Value, newname: Value) {
	let A: Value = null, ID: Value = null, PDA: Value = null;
	let searching: Value = this.GetAllContents();
	let search_id: Value = 1;
	let search_pda: Value = 1;
	for (A of each(searching)) {
		if (search_id && rt.istype(A, T("/obj/item/weapon/card/id"))) {
			if ((ID = A).registered_name == oldname) {
				ID.registered_name = newname;
				ID.update_label();
				if (!search_pda) {
					break;
				}
				search_id = 0;
			}
		} else if (search_pda && rt.istype(A, T("/obj/item/device/pda"))) {
			if ((PDA = A).owner == oldname) {
				PDA.owner = newname;
				PDA.update_label();
				if (!search_id) {
					break;
				}
				search_pda = 0;
			}
		}
	}
	return f.dot;
});

// mob.dm:890
rt.def("/mob/proc/update_sight", function update_sight(f: Frame) {
	this.sync_lighting_plane_alpha();
	return f.dot;
});

// mob.dm:894
rt.def("/mob/proc/sync_lighting_plane_alpha", function sync_lighting_plane_alpha(f: Frame) {
	let L: Value = null;
	if (!this.hud_used) return f.dot;
	if (!(L = rt.index(this.hud_used.plane_masters, `${LIGHTING_PLANE}`))) return f.dot;
	L.alpha = this.lighting_alpha;
	return f.dot;
});

// mob.dm:899
rt.def("/mob/living/proc/vv_edit_var", function* vv_edit_var(f: Frame, var_name: Value, var_value: Value) {
	if (var_name === "stat") {
		if (this.stat == 2 && var_value < 2) {
			GLOB.dead_mob_list -= this;
			GLOB.living_mob_list += this;
		}
		if (this.stat < 2 && var_value == 2) {
			GLOB.living_mob_list -= this;
			GLOB.dead_mob_list += this;
		}
	}
	f.dot = (yield* parent_proc());
	if (var_name === "knockdown") {
		yield* this.SetKnockdown(var_value);
	} else if (var_name === "stun") {
		yield* this.SetStun(var_value);
	} else if (var_name === "unconscious") {
		yield* this.SetUnconscious(var_value);
	} else if (var_name === "sleeping") {
		yield* this.SetSleeping(var_value);
	} else if (var_name === "eye_blind") {
		yield* this.set_blindness(var_value);
	} else if (var_name === "eye_damage") {
		yield* this.set_eye_damage(var_value);
	} else if (var_name === "eye_blurry") {
		yield* this.set_blurriness(var_value);
	} else if (var_name === "maxHealth") {
		yield* this.updatehealth();
	} else if (var_name === "resize") {
		yield* this.update_transform();
	} else if (var_name === "lighting_alpha") {
		this.sync_lighting_plane_alpha();
	}
	return f.dot;
}, true);

// mob.dm:941
rt.def("/mob/proc/vv_get_dropdown", function vv_get_dropdown(f: Frame) {
	f.dot = parent_proc();
	rt.setAt((f.dot += "---"), "Gib", fmt("?_src_=vars;gib=＃", [this]));
	rt.setAt(f.dot, "Give Spell", fmt("?_src_=vars;give_spell=＃", [this]));
	rt.setAt(f.dot, "Remove Spell", fmt("?_src_=vars;remove_spell=＃", [this]));
	rt.setAt(f.dot, "Give Disease", fmt("?_src_=vars;give_disease=＃", [this]));
	rt.setAt(f.dot, "Toggle Godmode", fmt("?_src_=vars;godmode=＃", [this]));
	rt.setAt(f.dot, "Drop Everything", fmt("?_src_=vars;drop_everything=＃", [this]));
	rt.setAt(f.dot, "Regenerate Icons", fmt("?_src_=vars;regenerateicons=＃", [this]));
	rt.setAt(f.dot, "Make Space Ninja", fmt("?_src_=vars;ninja=＃", [this]));
	rt.setAt(f.dot, "Show player panel", fmt("?_src_=vars;mob_player_panel=＃", [this]));
	rt.setAt(f.dot, "Toggle Build Mode", fmt("?_src_=vars;build_mode=＃", [this]));
	rt.setAt(f.dot, "Assume Direct Control", fmt("?_src_=vars;direct_control=＃", [this]));
	rt.setAt(f.dot, "Offer Control to Ghosts", fmt("?_src_=vars;offer_control=＃", [this]));
	return f.dot;
});

// mob.dm:957
rt.def("/mob/proc/vv_get_var", function vv_get_var(f: Frame, var_name: Value) {
	if (var_name === "logging") {
		return debug_variable(var_name, this.logging, 0, this, 0);
	}
	f.dot = parent_proc();
	return f.dot;
}, false);

// mob.dm:966
rt.def("/mob/verb/open_language_menu", function* open_language_menu(f: Frame) {
	let H: Value = null;
	yield* (H = (yield* this.get_language_holder())).open_language_menu(f.usr);
	return f.dot;
}, true, { verb: { name: "Open Language Menu", category: "IC" } });
