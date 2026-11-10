// Based on /tg/station's code/game/machinery/machinery.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, fmt } = rt;


rt.type(10208, "/obj/machinery", "/obj", {
	stat: 0,
	emagged: 0,
	use_power: 1,
	idle_power_usage: 0,
	active_power_usage: 0,
	power_channel: 1,
	component_parts: null,
	uid: null,
	panel_open: 0,
	state_open: 0,
	critical_machine: 0,
	occupant_typecache: null,
	occupant: null,
	unsecuring_tool: rt.typePath("/obj/item/weapon/wrench"),
	interact_open: 0,
	interact_offline: 0,
	speed_process: 0,
	verb_say: "beeps",
	verb_yell: "blares",
	pressure_resistance: 15,
	name: "machinery",
	icon: rt.rsc("icons/obj/stationobjs.dmi"),
	obj_integrity: 200,
	max_integrity: 200,
}, { global: { gl_uid: 759 } });

// machinery.dm:121
rt.def("/obj/machinery/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.occupant_typecache = list(T("/mob/living"));
	return f.dot;
});

// machinery.dm:129
rt.def("/obj/machinery/proc/Initialize", function* Initialize(f: Frame) {
	if (!this.armor) {
		this.armor = rt.alist(f, ["melee", 25, "bullet", 10, "laser", 10, "energy", 0, "bomb", 0, "bio", 0, "rad", 0, "fire", 50, "acid", 70]);
	}
	f.dot = (yield* parent_proc());
	GLOB.machines += this;
	if (!this.speed_process) {
		if (!this.isprocessing) {
			this.isprocessing = 1;
			GLOB.SSmachines.processing += this;
		}
	} else if (!this.isprocessing) {
		this.isprocessing = 1;
		GLOB.SSfastprocess.processing += this;
	}
	yield* this.power_change();
	this.occupant_typecache = typecacheof(this.occupant_typecache);
	return f.dot;
}, true);

// machinery.dm:142
rt.def("/obj/machinery/proc/Destroy", function* Destroy(f: Frame) {
	yield* GLOB.machines.Remove(this);
	if (!this.speed_process) {
		this.isprocessing = 0;
		GLOB.SSmachines.processing -= this;
	} else {
		this.isprocessing = 0;
		GLOB.SSfastprocess.processing -= this;
	}
	yield* this.dropContents();
	return (yield* parent_proc());
}, true);

// machinery.dm:160
rt.def("/obj/machinery/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.use_power && !this.stat) {
		yield* this.use_power(7500 / severity);
		yield* new_(T("/obj/effect/temp_visual/emp"), this.loc);
	}
	yield* parent_proc();
	return f.dot;
}, true);

// machinery.dm:169
rt.def("/obj/machinery/proc/open_machine", function* open_machine(f: Frame, drop: Value) {
	drop ??= 1;
	this.state_open = 1;
	this.density = 0;
	if (drop) {
		yield* this.dropContents();
	}
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// machinery.dm:174
rt.def("/obj/machinery/proc/dropContents", function* dropContents(f: Frame) {
	let A: Value = null, L: Value = null;
	let _T: Value = rt.getStep(f, this, 0);
	for (A of each(this.contents, T("/atom/movable"))) {
		yield* A.forceMove(_T);
		if (rt.istype(A, T("/mob/living"))) {
			yield* (L = A).update_canmove();
		}
	}
	this.occupant = null;
	return f.dot;
}, true);

// machinery.dm:185
rt.def("/obj/machinery/proc/close_machine", function* close_machine(f: Frame, target: Value) {
	let am: Value = null, AM: Value = null, L: Value = null;
	this.state_open = 0;
	this.density = 1;
	if (!target) {
		for (am of each(this.loc)) {
			if (!is_type_in_typecache(am, this.occupant_typecache)) {
				continue;
			}
			if ((AM = am).has_buckled_mobs()) {
				continue;
			}
			if (rt.istype(AM, T("/mob/living"))) {
				if ((L = am).buckled) {
					continue;
				}
			}
			target = am;
		}
	}
	let mobtarget: Value = target;
	if (target && !target.has_buckled_mobs() && (!rt.istype(target, T("/mob/living")) || !mobtarget.buckled)) {
		this.occupant = target;
		yield* target.forceMove(this);
	}
	yield* this.updateUsrDialog();
	yield* this.update_icon();
	return f.dot;
}, true);

// machinery.dm:206
rt.def("/obj/machinery/proc/auto_use_power", function auto_use_power(f: Frame) {
	if (!this.powered(this.power_channel)) {
		return 0;
	}
	if (this.use_power == 1) {
		this.use_power(this.idle_power_usage, this.power_channel);
	} else if (this.use_power >= 2) {
		this.use_power(this.active_power_usage, this.power_channel);
	}
	return 1;
});

// machinery.dm:215
rt.def("/obj/machinery/proc/is_operational", function is_operational(f: Frame) {
	return (!rt.bitAnd(this.stat, 11) ? 1 : 0);
});

// machinery.dm:218
rt.def("/obj/machinery/proc/is_interactable", function is_interactable(f: Frame) {
	if (rt.bitAnd(this.stat, 3) && !this.interact_offline) {
		return 0;
	}
	if (this.panel_open && !this.interact_open) {
		return 0;
	}
	return 1;
});

// machinery.dm:228
rt.def("/obj/machinery/proc/interact", function* interact(f: Frame, user: Value, special_state: Value) {
	yield* this.add_fingerprint(user);
	if (special_state) {
		yield* this.ui_interact(user, { state: special_state });
	} else {
		yield* this.ui_interact(user);
	}
	return f.dot;
}, true);

// machinery.dm:235
rt.def("/obj/machinery/proc/ui_status", function ui_status(f: Frame, user: Value) {
	if (this.is_interactable()) {
		return parent_proc();
	}
	return UI_CLOSE;
}, false);

// machinery.dm:240
rt.def("/obj/machinery/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	yield* this.add_fingerprint(f.usr);
	return (yield* parent_proc());
}, true);

// machinery.dm:244
rt.def("/obj/machinery/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	yield* parent_proc();
	if (!this.is_interactable()) {
		return 1;
	}
	if (!f.usr.canUseTopic(this)) {
		return 1;
	}
	yield* this.add_fingerprint(f.usr);
	return 0;
}, true);

// machinery.dm:258
rt.def("/obj/machinery/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	if (user.a_intent != "harm") {
		return (yield* this.attack_hand(user));
	}
	user.changeNext_move(8);
	yield* user.do_attack_animation(this, "punch");
	user.visible_message(fmt("<span class='danger'>＀ smashes against ％！ with its paws.</span>", [user.name, this.name]), null, null, 3);
	yield* this.take_damage(4, "brute", "melee", 1);
	return f.dot;
}, true);

// machinery.dm:268
rt.def("/obj/machinery/proc/attack_ai", function* attack_ai(f: Frame, user: Value) {
	let R: Value = null;
	if (rt.istype(user, T("/mob/living/silicon/robot"))) {
		if ((R = user).client && R.client.eye == R && !R.low_power_mode) {
			return (yield* this.attack_hand(user));
		}
	} else {
		return (yield* this.attack_hand(user));
	}
	return f.dot;
}, true);

// machinery.dm:278
rt.def("/obj/machinery/proc/attack_hand", function* attack_hand(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 1;
	}
	if (f.args[2] === null) {
		f.args[2] = 1;
	}
	if (yield* parent_proc()) {
		return 1;
	}
	if ((f.args[0].lying || f.args[0].stat) && !IsAdminGhost(f.args[0])) {
		return 1;
	}
	if (!f.args[0].IsAdvancedToolUser() && !IsAdminGhost(f.args[0])) {
		to_chat(f.usr, "<span class='warning'>You don't have the dexterity to do this!</span>");
		return 1;
	}
	if (!this.is_interactable()) {
		return 1;
	}
	if (f.args[2]) {
		yield* f.args[0].set_machine(this);
	}
	yield* this.interact(f.args[0]);
	yield* this.add_fingerprint(f.args[0]);
	return 0;
}, true, { args: ["user", "check_power", "set_machine"] });

// machinery.dm:294
rt.def("/obj/machinery/proc/CheckParts", function* CheckParts(f: Frame, parts_list: Value) {
	yield* parent_proc();
	yield* this.RefreshParts();
	return f.dot;
}, true);

// machinery.dm:301
rt.def("/obj/machinery/proc/assign_uid", function assign_uid(f: Frame) {
	this.uid = GLOB.gl_uid;
	GLOB.gl_uid++;
	return f.dot;
});

// machinery.dm:305
rt.def("/obj/machinery/proc/default_pry_open", function* default_pry_open(f: Frame, C: Value) {
	f.dot = ((!(this.state_open || this.panel_open || this.is_operational() || rt.bitAnd(this.flags, NODECONSTRUCT)) ? 1 : 0) && (rt.istype(C, T("/obj/item/weapon/crowbar")) ? 1 : 0));
	if (!f.dot) return f.dot;
	playsound(this.loc, C.usesound, 50, 1);
	this.visible_message(fmt("<span class='notice'>＀ pries open ％！.</span>", [f.usr, this]), fmt("<span class='notice'>You pry open ％！.</span>", [this]));
	yield* this.open_machine();
	return 1;
}, true);

// machinery.dm:313
rt.def("/obj/machinery/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame, C: Value, ignore_panel: Value) {
	ignore_panel ??= 0;
	f.dot = (((rt.istype(C, T("/obj/item/weapon/crowbar")) ? 1 : 0) && (this.panel_open || ignore_panel)) && (!rt.bitAnd(this.flags, NODECONSTRUCT) ? 1 : 0));
	if (!f.dot) return f.dot;
	playsound(this.loc, C.usesound, 50, 1);
	yield* this.deconstruct(1);
	return f.dot;
}, true);

// machinery.dm:319
rt.def("/obj/machinery/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let I: Value = null;
	disassembled ??= 1;
	if (!rt.bitAnd(this.flags, NODECONSTRUCT)) {
		yield* this.on_deconstruction();
		if (this.component_parts && rt.len(f, this.component_parts)) {
			yield* this.spawn_frame(disassembled);
			for (I of each(this.component_parts, T("/obj/item"))) {
				yield* I.forceMove(this.loc);
			}
		}
	}
	yield* qdel(this);
	return f.dot;
}, true);

// machinery.dm:328
rt.def("/obj/machinery/proc/spawn_frame", function* spawn_frame(f: Frame, disassembled: Value) {
	let M: Value = null;
	f.dot = (M = (yield* new_(T("/obj/structure/frame/machine"), this.loc)));
	M.anchored = this.anchored;
	if (!disassembled) {
		M.obj_integrity = M.max_integrity * 0.5;
	}
	this.transfer_fingerprints_to(M);
	M.state = 2;
	M.icon_state = "box_1";
	return f.dot;
}, true);

// machinery.dm:338
rt.def("/obj/machinery/proc/obj_break", function obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// machinery.dm:343
rt.def("/obj/machinery/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!this.occupant) return f.dot;
	this.occupant.ex_act(severity, target);
	return f.dot;
});

// machinery.dm:346
rt.def("/obj/machinery/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	if (A != this.occupant) return f.dot;
	this.occupant = null;
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// machinery.dm:352
rt.def("/obj/machinery/proc/default_deconstruction_screwdriver", function default_deconstruction_screwdriver(f: Frame, user: Value, icon_state_open: Value, icon_state_closed: Value, S: Value) {
	if (rt.istype(S, T("/obj/item/weapon/screwdriver")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		playsound(this.loc, S.usesound, 50, 1);
		if (!this.panel_open) {
			this.panel_open = 1;
			this.icon_state = icon_state_open;
			to_chat(user, `<span class='notice'>You open the maintenance hatch of ${this}.</span>`);
		} else {
			this.panel_open = 0;
			this.icon_state = icon_state_closed;
			to_chat(user, `<span class='notice'>You close the maintenance hatch of ${this}.</span>`);
		}
		return 1;
	}
	return 0;
});

// machinery.dm:366
rt.def("/obj/machinery/proc/default_change_direction_wrench", function* default_change_direction_wrench(f: Frame, user: Value, W: Value) {
	if (this.panel_open && rt.istype(W, T("/obj/item/weapon/wrench"))) {
		playsound(this.loc, W.usesound, 50, 1);
		yield* this.setDir(turn(this.dir, -90));
		to_chat(user, `<span class='notice'>You rotate ${this}.</span>`);
		return 1;
	}
	return 0;
}, true);

// machinery.dm:374
rt.def("/obj/proc/can_be_unfasten_wrench", function can_be_unfasten_wrench(f: Frame, user: Value, silent: Value) {
	if (!rt.istype(this.loc, T("/turf/open/floor")) && !this.anchored) {
		to_chat(user, `<span class='warning'>${this} needs to be on the floor to be secured!</span>`);
		return FAILED_UNFASTEN;
	}
	return SUCCESSFUL_UNFASTEN;
});

// machinery.dm:380
rt.def("/obj/proc/default_unfasten_wrench", function* default_unfasten_wrench(f: Frame, user: Value, W: Value, time: Value) {
	let can_be_unfasten: Value = null, prev_anchored: Value = null;
	time ??= 20;
	if (rt.istype(W, T("/obj/item/weapon/wrench")) && !rt.bitAnd(this.flags, NODECONSTRUCT)) {
		if (!(can_be_unfasten = this.can_be_unfasten_wrench(user)) || can_be_unfasten == FAILED_UNFASTEN) {
			return can_be_unfasten;
		}
		if (time) {
			to_chat(user, `<span class='notice'>You begin ${this.anchored ? "un" : ""}securing ${this}...</span>`);
		}
		playsound(this.loc, W.usesound, 50, 1);
		prev_anchored = this.anchored;
		if (!time || (yield* do_after(user, time * W.toolspeed, { target: this, extra_checks: (yield* new_(T("/datum/callback"), this, P("/obj/proc/unfasten_wrench_check"), prev_anchored, user)) }))) {
			to_chat(user, `<span class='notice'>You ${this.anchored ? "un" : ""}secure ${this}.</span>`);
			this.anchored = (!this.anchored ? 1 : CANT_UNFASTEN);
			playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, FAILED_UNFASTEN);
			return SUCCESSFUL_UNFASTEN;
		}
		return FAILED_UNFASTEN;
	}
	return CANT_UNFASTEN;
}, true);

// machinery.dm:398
rt.def("/obj/proc/unfasten_wrench_check", function unfasten_wrench_check(f: Frame, prev_anchored: Value, user: Value) {
	if (this.anchored != prev_anchored) {
		return 0;
	}
	if (this.can_be_unfasten_wrench(user, 1) != SUCCESSFUL_UNFASTEN) {
		return 0;
	}
	return 1;
}, false, { argTypes: [{  }, { type: 8, path: "/mob" }] });

// machinery.dm:405
rt.def("/obj/machinery/proc/exchange_parts", function* exchange_parts(f: Frame, user: Value, W: Value) {
	let CB: Value = null, _P: Value = null, A: Value = null, D: Value = null, B: Value = null;
	if (!rt.istype(W, T("/obj/item/weapon/storage/part_replacer"))) {
		return f.dot;
	}
	if (rt.bitAnd(this.flags, NODECONSTRUCT) && !W.works_from_distance) {
		return f.dot;
	}
	let shouldplaysound: Value = 0;
	if (this.component_parts) {
		if (this.panel_open || W.works_from_distance) {
			CB = rt.locateIn(f, T("/obj/item/weapon/circuitboard/machine"), this.component_parts);
			if (W.works_from_distance) {
				this.display_parts(user);
			}
			for (A of each(this.component_parts, T("/obj/item/weapon/stock_parts"))) {
				D = null;
				for (D of each(CB.req_components)) {
					if (ispath(A.type, D)) {
						_P = D;
						break;
					}
				}
				B = null;
				for (B of each(W.contents, T("/obj/item/weapon/stock_parts"))) {
					if (rt.op(f, "IsType", [], [B, _P]) && rt.op(f, "IsType", [], [A, _P])) {
						if (B.rating > A.rating) {
							yield* W.remove_from_storage(B, this);
							yield* W.handle_item_insertion(A, 1);
							this.component_parts -= A;
							this.component_parts += B;
							B.loc = null;
							to_chat(user, `<span class='notice'>${A.name} replaced with ${B.name}.</span>`);
							shouldplaysound = 1;
							break;
						}
					}
				}
			}
			yield* this.RefreshParts();
		} else {
			this.display_parts(user);
		}
		if (shouldplaysound) {
			W.play_rped_sound();
		}
		return 1;
	}
	return 0;
}, true);

// machinery.dm:441
rt.def("/obj/machinery/proc/display_parts", function display_parts(f: Frame, user: Value) {
	let C: Value = null;
	to_chat(user, "<span class='notice'>Following parts detected in the machine:</span>");
	for (C of each(this.component_parts, T("/obj/item"))) {
		to_chat(user, `<span class='notice'>${bicon(C)} ${C.name}</span>`);
	}
	return f.dot;
});

// machinery.dm:446
rt.def("/obj/machinery/proc/examine", function examine(f: Frame, user: Value) {
	let healthpercent: Value = null;
	parent_proc();
	if (rt.bitAnd(this.stat, 1)) {
		to_chat(user, "<span class='notice'>It looks broken and non functional.</span>");
	}
	if (!rt.bitAnd(this.resistance_flags, INDESTRUCTIBLE)) {
		if (rt.bitAnd(this.resistance_flags, 8)) {
			to_chat(user, "<span class='warning'>It's on fire!</span>");
		}
		const subject = (healthpercent = this.obj_integrity / this.max_integrity * 100);
		if (rt.inRange(subject, 50, 99)) {
			to_chat(user, "It looks slightly damaged.");
		} else if (rt.inRange(subject, 25, 50)) {
			to_chat(user, "It appears heavily damaged.");
		} else if (rt.inRange(subject, 0, 25)) {
			to_chat(user, "<span class='warning'>It's falling apart!</span>");
		}
	}
	if (!(user.research_scanner && this.component_parts)) return f.dot;
	this.display_parts(user);
	return f.dot;
}, false);

// machinery.dm:476
rt.def("/obj/machinery/proc/hiIsValidClient", function hiIsValidClient(f: Frame, hclient: Value, hi: Value) {
	if (hclient.client.mob && (hclient.client.mob.stat == 0 || IsAdminGhost(hclient.client.mob))) {
		if (rt.istype(hclient.client.mob, T("/mob/living/silicon/ai")) || IsAdminGhost(hclient.client.mob)) {
			return 1;
		} else {
			return ((hclient.client.mob.machine == this ? 1 : 0) && this.Adjacent(hclient.client.mob));
		}
	} else {
		return 0;
	}
});

// machinery.dm:484
rt.def("/obj/machinery/proc/hiOnHide", function* hiOnHide(f: Frame, hclient: Value) {
	if (!(hclient.client.mob && hclient.client.mob.machine == this)) return f.dot;
	yield* hclient.client.mob.unset_machine();
	return f.dot;
}, true);

// machinery.dm:491
rt.def("/obj/machinery/proc/tesla_act", function* tesla_act(f: Frame) {
	if (f.args[1] === null) {
		f.args[1] = 0;
	}
	yield* parent_proc();
	if (prob(85) && f.args[1]) {
		yield* explosion(this.loc, 1, 2, 4, { flame_range: 2, adminlog: 0, smoke: 0 });
	} else if (prob(50)) {
		yield* this.emp_act(2);
	} else {
		yield* this.ex_act(2);
	}
	return f.dot;
}, true, { args: ["power", "explosive"] });

// machinery.dm:500
rt.def("/obj/machinery/proc/Exited", function Exited(f: Frame, AM: Value, newloc: Value) {
	f.dot = parent_proc();
	if (AM != this.occupant) return f.dot;
	this.occupant = null;
	return f.dot;
}, false);
