// Based on /tg/station's code/modules/power/apc.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, P, g, fmt } = rt;


rt.type(10301, "/obj/machinery/power/apc", "/obj/machinery/power", {
	lon_range: 1.5,
	area: null,
	areastring: null,
	cell: null,
	start_charge: 90,
	cell_type: 2500,
	opened: 0,
	shorted: 0,
	lighting: 3,
	equipment: 3,
	environ: 3,
	operating: 1,
	charging: 0,
	chargemode: 1,
	chargecount: 0,
	locked: 1,
	coverlocked: 1,
	aidisabled: 0,
	tdir: null,
	terminal: null,
	lastused_light: 0,
	lastused_equip: 0,
	lastused_environ: 0,
	lastused_total: 0,
	main_status: 0,
	malfhack: 0,
	malfai: null,
	has_electronics: 0,
	overload: 1,
	beenhit: 0,
	occupier: null,
	transfer_in_progress: 0,
	longtermpower: 10,
	auto_name: 0,
	failure_timer: 0,
	force_update: 0,
	update_state: -1,
	update_overlay: -1,
	icon_update_needed: 0,
	anchored: 1,
	name: "area power controller",
	desc: "A control terminal for the area electrical systems.",
	icon_state: "apc0",
	use_power: 0,
	req_access: null,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
	resistance_flags: 2,
	powernet: 0,
});

// apc.dm:103
rt.def("/obj/machinery/power/apc/proc/connect_to_network", function* connect_to_network(f: Frame) {
	if (!this.terminal) return f.dot;
	yield* this.terminal.connect_to_network();
	return f.dot;
}, true);

// apc.dm:106
rt.def("/obj/machinery/power/apc/proc/New", function* New(f: Frame) {
	let $0: any;
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (!this.req_access) {
		this.req_access = list(11);
	}
	if (!this.armor) {
		this.armor = rt.alist(f, ["melee", 20, "bullet", 20, "laser", 10, "energy", 100, "bomb", 30, "bio", 100, "rad", 100, "fire", 90, "acid", 50]);
	}
	yield* parent_proc();
	GLOB.apcs_list += this;
	this.wires = (yield* new_(T("/datum/wires/apc"), this));
	if (f.args[2]) {
		yield* this.setDir(f.args[1]);
	}
	this.tdir = this.dir;
	yield* this.setDir(2);
	if (this.auto_name) {
		this.name = `ÿ\u0016${get_area(this)} APC`;
	}
	if (rt.bitAnd(this.tdir, 3)) {
		$0 = 0;
	} else if (this.tdir == 4) {
		$0 = 24;
	} else {
		$0 = -24;
	}
	this.pixel_x = $0;
	if (rt.bitAnd(this.tdir, 3)) {
		if (this.tdir == 1) {
			$0 = 24;
		} else {
			$0 = -24;
		}
	} else {
		$0 = 0;
	}
	this.pixel_y = $0;
	if (!f.args[2]) return f.dot;
	this.area = get_area(this);
	this.opened = 1;
	this.operating = 0;
	this.name = `${this.area.name} APC`;
	(rt.modSrcVar(f, "stat", MAINT, rt.bitOr));
	yield* this.update_icon();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/power/apc/proc/update"))), 5);
	return f.dot;
}, true, { args: ["loc", "ndir", "building"] });

// apc.dm:136
rt.def("/obj/machinery/power/apc/proc/Destroy", function* Destroy(f: Frame) {
	GLOB.apcs_list -= this;
	if (this.malfai && this.operating) {
		this.malfai.malf_picker.processing_time = max(0, min(this.malfai.malf_picker.processing_time - 10, 1000));
	}
	this.area.power_light = 0;
	this.area.power_equip = 0;
	this.area.power_environ = 0;
	yield* this.area.power_change();
	if (this.occupier) {
		yield* this.malfvacate(1);
	}
	yield* qdel(this.wires);
	this.wires = null;
	if (this.cell) {
		yield* qdel(this.cell);
	}
	if (this.terminal) {
		this.disconnect_terminal();
	}
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

// apc.dm:155
rt.def("/obj/machinery/power/apc/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	if (A != this.cell) return f.dot;
	this.cell = null;
	yield* this.update_icon();
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// apc.dm:163
rt.def("/obj/machinery/power/apc/proc/make_terminal", function* make_terminal(f: Frame) {
	this.terminal = (yield* new_(T("/obj/machinery/power/terminal"), this.loc));
	yield* this.terminal.setDir(this.tdir);
	this.terminal.master = this;
	return f.dot;
}, true);

// apc.dm:168
rt.def("/obj/machinery/power/apc/proc/Initialize", function* Initialize(f: Frame, mapload: Value) {
	let A: Value = null;
	f.dot = (yield* parent_proc());
	if (!mapload) {
		return f.dot;
	}
	this.has_electronics = 2;
	if (this.cell_type) {
		this.cell = (yield* new_(T("/obj/item/weapon/stock_parts/cell"), this));
		this.cell.maxcharge = this.cell_type;
		this.cell.charge = this.start_charge * this.cell.maxcharge / 100;
	}
	if (isarea((A = this.loc.loc)) && this.areastring === null) {
		this.area = A;
	} else {
		this.area = get_area_by_name(this.areastring);
	}
	yield* this.update_icon();
	yield* this.make_terminal();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/power/apc/proc/update"))), 5);
	return f.dot;
}, true);

// apc.dm:192
rt.def("/obj/machinery/power/apc/proc/examine", function examine(f: Frame, user: Value) {
	let $0: any, $1: any;
	parent_proc();
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.opened) {
		if (this.has_electronics && this.terminal) {
			$0 = user;
			if (this.opened == 2) {
				$1 = "removed";
			} else {
				$1 = "open";
			}
			to_chat($0, `The cover is ${$1} and the power cell is ${this.cell ? "installed" : "missing"}.`);
		} else {
			to_chat(user, `It's ${!this.terminal ? "not" : ""} wired up.`);
			to_chat(user, `The electronics are${!this.has_electronics ? "n't" : ""} installed.`);
		}
	} else if (rt.bitAnd(this.stat, MAINT)) {
		to_chat(user, "The cover is closed. Something is wrong with it. It doesn't work.");
	} else if (this.malfhack) {
		to_chat(user, "The cover is broken. It may be hard to force it open.");
	} else {
		to_chat(user, "The cover is closed.");
	}
	return f.dot;
}, false);

// apc.dm:214
rt.def("/obj/machinery/power/apc/proc/update_icon", function update_icon(f: Frame) {
	let update: Value = null, basestate: Value = null, O: Value = null;
	if (!(update = this.check_updates())) {
		this.icon_update_needed = 0;
		return f.dot;
	}
	if (rt.bitAnd(update, 1)) {
		if (rt.bitAnd(this.update_state, UPSTATE_ALLGOOD)) {
			this.icon_state = "apc0";
		} else if (rt.bitAnd(this.update_state, 6)) {
			basestate = `apc${this.cell ? "2" : "1"}`;
			if (rt.bitAnd(this.update_state, UPSTATE_OPENED1)) {
				if (rt.bitAnd(this.update_state, 24)) {
					this.icon_state = "apcmaint";
				} else {
					this.icon_state = basestate;
				}
			} else if (rt.bitAnd(this.update_state, UPSTATE_OPENED2)) {
				if (rt.bitAnd(this.update_state, UPSTATE_BROKE) || this.malfhack) {
					this.icon_state = `${basestate}-b-nocover`;
				} else {
					this.icon_state = `${basestate}-nocover`;
				}
			}
		} else if (rt.bitAnd(this.update_state, UPSTATE_BROKE)) {
			this.icon_state = "apc-b";
		} else if (rt.bitAnd(this.update_state, UPSTATE_BLUESCREEN)) {
			this.icon_state = "apcemag";
		} else if (rt.bitAnd(this.update_state, UPSTATE_WIREEXP)) {
			this.icon_state = "apcewires";
		} else if (rt.bitAnd(this.update_state, UPSTATE_MAINT)) {
			this.icon_state = "apc0";
		}
	}
	if (!rt.bitAnd(this.update_state, UPSTATE_ALLGOOD)) {
		this.cut_overlays();
	}
	if (rt.bitAnd(update, 2)) {
		this.cut_overlays();
		if (!rt.bitAnd(this.stat, 9) && rt.bitAnd(this.update_state, UPSTATE_ALLGOOD)) {
			O = list(`apcox-${this.locked}`, `apco3-${this.charging}`);
			if (this.operating) {
				O += `apco0-${this.equipment}`;
				O += `apco1-${this.lighting}`;
				O += `apco2-${this.environ}`;
			}
			this.add_overlay(O);
		}
	}
	if (rt.bitAnd(this.update_state, UPSTATE_ALLGOOD)) {
		if (this.charging === 0) {
			this.light_color = "#FA8282";
		} else if (this.charging === 1) {
			this.light_color = "#6496FA";
		} else if (this.charging === 2) {
			this.light_color = "#64C864";
		}
		this.set_light(this.lon_range);
	} else if (rt.bitAnd(this.update_state, UPSTATE_BLUESCREEN)) {
		this.light_color = "#6496FA";
		this.set_light(this.lon_range);
	} else {
		this.set_light(0);
	}
	this.icon_update_needed = 0;
	return f.dot;
});

// apc.dm:279
rt.def("/obj/machinery/power/apc/proc/check_updates", function check_updates(f: Frame) {
	let last_update_state: Value = this.update_state;
	let last_update_overlay: Value = this.update_overlay;
	this.update_state = 0;
	this.update_overlay = 0;
	if (this.cell) {
		(rt.modSrcVar(f, "update_state", 1, rt.bitOr));
	}
	if (rt.bitAnd(this.stat, 1)) {
		(rt.modSrcVar(f, "update_state", UPSTATE_BROKE, rt.bitOr));
	}
	if (rt.bitAnd(this.stat, MAINT)) {
		(rt.modSrcVar(f, "update_state", UPSTATE_MAINT, rt.bitOr));
	}
	if (this.opened) {
		if (this.opened == 1) {
			(rt.modSrcVar(f, "update_state", UPSTATE_OPENED1, rt.bitOr));
		}
		if (this.opened == APC_UPOVERLAY_CHARGEING1) {
			(rt.modSrcVar(f, "update_state", UPSTATE_OPENED2, rt.bitOr));
		}
	} else if (this.emagged || this.malfai) {
		(rt.modSrcVar(f, "update_state", UPSTATE_BLUESCREEN, rt.bitOr));
	} else if (this.panel_open) {
		(rt.modSrcVar(f, "update_state", UPSTATE_WIREEXP, rt.bitOr));
	}
	if (this.update_state <= APC_UPOVERLAY_CHARGEING0) {
		(rt.modSrcVar(f, "update_state", UPSTATE_ALLGOOD, rt.bitOr));
	}
	if (this.operating) {
		(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_OPERATING, rt.bitOr));
	}
	if (rt.bitAnd(this.update_state, UPSTATE_ALLGOOD)) {
		if (this.locked) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_LOCKED, rt.bitOr));
		}
		if (!this.charging) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_CHARGEING0, rt.bitOr));
		} else if (this.charging == 1) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_CHARGEING1, rt.bitOr));
		} else if (this.charging == 2) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_CHARGEING2, rt.bitOr));
		}
		if (!this.equipment) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_EQUIPMENT0, rt.bitOr));
		} else if (this.equipment == 1) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_EQUIPMENT1, rt.bitOr));
		} else if (this.equipment == 2) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_EQUIPMENT2, rt.bitOr));
		}
		if (!this.lighting) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_LIGHTING0, rt.bitOr));
		} else if (this.lighting == 1) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_LIGHTING1, rt.bitOr));
		} else if (this.lighting == 2) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_LIGHTING2, rt.bitOr));
		}
		if (!this.environ) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_ENVIRON0, rt.bitOr));
		} else if (this.environ == 1) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_ENVIRON1, rt.bitOr));
		} else if (this.environ == 2) {
			(rt.modSrcVar(f, "update_overlay", APC_UPOVERLAY_ENVIRON2, rt.bitOr));
		}
	}
	let results: Value = 0;
	if (last_update_state == this.update_state && last_update_overlay == this.update_overlay) {
		return 0;
	}
	if (last_update_state != this.update_state) {
		results += 1;
	}
	if (last_update_overlay != this.update_overlay) {
		results += 2;
	}
	return results;
});

// apc.dm:355
rt.def("/obj/machinery/power/apc/proc/attackby", function* attackby(f: Frame, W: Value, user: Value, params: Value) {
	let host_turf: Value = null, C: Value = null, _T: Value = null, N: Value = null, WT: Value = null;
	if (rt.istype(user, T("/mob/living/silicon")) && get_dist(this, user) > 1) {
		return (yield* this.attack_hand(user));
	}
	if (rt.istype(W, T("/obj/item/weapon/crowbar"))) {
		if (this.opened) {
			if (this.has_electronics == 1) {
				if (this.terminal) {
					to_chat(user, "<span class='warning'>Disconnect the wires first!</span>");
					return f.dot;
				}
				playsound(this.loc, W.usesound, 50, 1);
				to_chat(user, "<span class='notice'>You are trying to remove the power control board...</span>");
				if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
					if (this.has_electronics == 1) {
						this.has_electronics = 0;
						if (rt.bitAnd(this.stat, 1)) {
							user.visible_message(`${user.name} has broken the power control board inside ${this.name}!`, "<span class='notice'>You break the charred power control board and remove the remains.</span>", "<span class='italics'>You hear a crack.</span>");
							return f.dot;
						} else if (this.emagged) {
							this.emagged = 0;
							user.visible_message(`${user.name} has discarded emaged power control board from ${this.name}!`, "<span class='notice'>You discarded shorten board.</span>");
							return f.dot;
						} else if (this.malfhack) {
							user.visible_message(`${user.name} has discarded strangely programmed power control board from ${this.name}!`, "<span class='notice'>You discarded strangely programmed board.</span>");
							this.malfai = null;
							this.malfhack = 0;
							return f.dot;
						} else {
							user.visible_message(`${user.name} has removed the power control board from ${this.name}!`, "<span class='notice'>You remove the power control board.</span>");
							yield* new_(T("/obj/item/weapon/electronics/apc"), this.loc);
							return f.dot;
						}
					}
				}
			} else if (this.opened != 2) {
				this.opened = 0;
				this.coverlocked = 1;
				yield* this.update_icon();
				return f.dot;
			}
		} else if (!rt.bitAnd(this.stat, 1)) {
			if (this.coverlocked && !rt.bitAnd(this.stat, MAINT)) {
				to_chat(user, "<span class='warning'>The cover is locked and cannot be opened!</span>");
				return f.dot;
			} else if (this.panel_open) {
				to_chat(user, "<span class='warning'>Exposed wires prevents you from opening it!</span>");
				return f.dot;
			} else {
				this.opened = 1;
				yield* this.update_icon();
				return f.dot;
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/stock_parts/cell")) && this.opened) {
		if (this.cell) {
			to_chat(user, "<span class='warning'>There is a power cell already installed!</span>");
			return f.dot;
		} else {
			if (rt.bitAnd(this.stat, MAINT)) {
				to_chat(user, "<span class='warning'>There is no connector for your power cell!</span>");
				return f.dot;
			}
			if (!(yield* user.drop_item())) {
				return f.dot;
			}
			yield* W.forceMove(this);
			this.cell = W;
			user.visible_message(`${user.name} has inserted the power cell to ${this.name}!`, "<span class='notice'>You insert the power cell.</span>");
			this.chargecount = 0;
			yield* this.update_icon();
		}
	} else if (rt.istype(W, T("/obj/item/weapon/screwdriver"))) {
		if (this.opened) {
			if (this.cell) {
				to_chat(user, "<span class='warning'>Close the APC first!</span>");
				return f.dot;
			} else {
				if (this.has_electronics == 1) {
					this.has_electronics = 2;
					(rt.modSrcVar(f, "stat", 16777207, rt.bitAnd));
					playsound(this.loc, W.usesound, 50, 1);
					to_chat(user, "<span class='notice'>You screw the circuit electronics into place.</span>");
				} else if (this.has_electronics == 2) {
					this.has_electronics = 1;
					(rt.modSrcVar(f, "stat", MAINT, rt.bitOr));
					playsound(this.loc, W.usesound, 50, 1);
					to_chat(user, "<span class='notice'>You unfasten the electronics.</span>");
				} else {
					to_chat(user, "<span class='warning'>There is nothing to secure!</span>");
					return f.dot;
				}
				yield* this.update_icon();
			}
		} else if (this.emagged) {
			to_chat(user, "<span class='warning'>The interface is broken!</span>");
		} else if (rt.bitAnd(this.stat, 8) && !this.opened) {
			yield* parent_proc();
		} else {
			this.panel_open = (!this.panel_open ? 1 : 0);
			to_chat(user, `The wires have been ${this.panel_open ? "exposed" : "unexposed"}`);
			yield* this.update_icon();
		}
	} else if (W.GetID()) {
		if (this.emagged) {
			to_chat(user, "<span class='warning'>The interface is broken!</span>");
		} else if (this.opened) {
			to_chat(user, "<span class='warning'>You must close the cover to swipe an ID card!</span>");
		} else if (this.panel_open) {
			to_chat(user, "<span class='warning'>You must close the panel!</span>");
		} else if (rt.bitAnd(this.stat, 9)) {
			to_chat(user, "<span class='warning'>Nothing happens!</span>");
		} else if ((yield* this.allowed(f.usr)) && !this.wires.is_cut("ID Scan") && !this.malfhack) {
			this.locked = (!this.locked ? 1 : 0);
			to_chat(user, `<span class='notice'>You ${this.locked ? "lock" : "unlock"} the APC interface.</span>`);
			yield* this.update_icon();
		} else {
			to_chat(user, "<span class='warning'>Access denied.</span>");
		}
	} else if (rt.istype(W, T("/obj/item/stack/cable_coil")) && this.opened) {
		if (!(host_turf = rt.getStep(f, this, 0))) {
			rt.throw_(f, (yield* new_(T("/exception"), "attackby on APC when it's not on a turf", "code/modules/power/apc.dm", 478)));
			return f.dot;
		}
		if (host_turf.intact) {
			to_chat(user, "<span class='warning'>You must remove the floor plating in front of the APC first!</span>");
			return f.dot;
		} else if (this.terminal) {
			to_chat(user, "<span class='warning'>This APC is already wired!</span>");
			return f.dot;
		} else if (this.has_electronics == 0) {
			to_chat(user, "<span class='warning'>There is nothing to wire!</span>");
			return f.dot;
		}
		if ((C = W).get_amount() < 10) {
			to_chat(user, "<span class='warning'>You need ten lengths of cable for APC!</span>");
			return f.dot;
		}
		user.visible_message(`${user.name} adds cables to the APC frame.`, "<span class='notice'>You start adding cables to the APC frame...</span>");
		playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		if (yield* do_after(user, 20, { target: this })) {
			if (C.get_amount() < 10 || !C) {
				return f.dot;
			}
			if (C.get_amount() >= 10 && !this.terminal && this.opened && this.has_electronics > 0) {
				_T = rt.getStep(f, this, 0);
				N = _T.get_cable_node();
				if (prob(50) && (yield* electrocute_mob(f.usr, N, N, 1, 1))) {
					yield* do_sparks(5, 1, this);
					return f.dot;
				}
				yield* C.use(10);
				to_chat(user, "<span class='notice'>You add cables to the APC frame.</span>");
				yield* this.make_terminal();
				yield* this.terminal.connect_to_network();
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/wirecutters")) && this.terminal && this.opened) {
		yield* this.terminal.dismantle(user, W);
	} else if (rt.istype(W, T("/obj/item/weapon/electronics/apc")) && this.opened) {
		if (this.has_electronics != 0) {
			to_chat(user, "<span class='warning'>You cannot put the board inside, there already is one!</span>");
			return f.dot;
		} else if (rt.bitAnd(this.stat, 1)) {
			to_chat(user, "<span class='warning'>You cannot put the board inside, the frame is damaged!</span>");
			return f.dot;
		}
		user.visible_message(`${user.name} inserts the power control board into ${this}.`, "<span class='notice'>You start to insert the power control board into the frame...</span>");
		playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		if (yield* do_after(user, 10, { target: this })) {
			if (this.has_electronics == 0) {
				this.has_electronics = 1;
				this.locked = 1;
				to_chat(user, "<span class='notice'>You place the power control board inside the frame.</span>");
				yield* qdel(W);
			}
		}
	} else if (rt.istype(W, T("/obj/item/weapon/weldingtool")) && this.opened && this.has_electronics == 0 && !this.terminal) {
		if ((WT = W).get_fuel() < 3) {
			to_chat(user, "<span class='warning'>You need more welding fuel to complete this task!</span>");
			return f.dot;
		}
		user.visible_message(`${user.name} welds ${this}.`, "<span class='notice'>You start welding the APC frame...</span>", "<span class='italics'>You hear welding.</span>");
		playsound(this.loc, WT.usesound, 50, 1);
		if (yield* do_after(user, 50 * W.toolspeed, { target: this })) {
			if (!this || !(yield* WT.remove_fuel(3, user))) {
				return f.dot;
			}
			if (rt.bitAnd(this.stat, 1) || this.opened == 2) {
				yield* new_(T("/obj/item/stack/sheet/metal"), this.loc);
				user.visible_message(`${user.name} has cut ${this} apart with ${W}.`, "<span class='notice'>You disassembled the broken APC frame.</span>");
			} else {
				yield* new_(T("/obj/item/wallframe/apc"), this.loc);
				user.visible_message(`${user.name} has cut ${this} from the wall with ${W}.`, "<span class='notice'>You cut the APC frame from the wall.</span>");
			}
			yield* qdel(this);
			return f.dot;
		}
	} else if (rt.istype(W, T("/obj/item/wallframe/apc")) && this.opened) {
		if (!(rt.bitAnd(this.stat, 1) || this.opened == 2 || this.obj_integrity < this.max_integrity)) {
			to_chat(user, "<span class='warning'>You found no reason for repairing this APC</span>");
			return f.dot;
		}
		if (!rt.bitAnd(this.stat, 1) && this.opened == 2) {
			user.visible_message(`${user.name} replaces missing APC's cover.`, "<span class='notice'>You begin to replace APC's cover...</span>");
			if (yield* do_after(user, 20, { target: this })) {
				to_chat(user, "<span class='notice'>You replace missing APC's cover.</span>");
				yield* qdel(W);
				this.opened = 1;
				yield* this.update_icon();
			}
			return f.dot;
		}
		if (this.has_electronics) {
			to_chat(user, "<span class='warning'>You cannot repair this APC until you remove the electronics still inside!</span>");
			return f.dot;
		}
		user.visible_message(`${user.name} replaces the damaged APC frame with a new one.`, "<span class='notice'>You begin to replace the damaged APC frame...</span>");
		if (yield* do_after(user, 50, { target: this })) {
			to_chat(user, "<span class='notice'>You replace the damaged APC frame with a new one.</span>");
			yield* qdel(W);
			(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
			this.obj_integrity = this.max_integrity;
			if (this.opened == 2) {
				this.opened = 1;
			}
			yield* this.update_icon();
		}
	} else if (this.panel_open && !this.opened && is_wire_tool(W)) {
		yield* this.wires.interact(user);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// apc.dm:588
rt.def("/obj/machinery/power/apc/proc/run_obj_armor", function run_obj_armor(f: Frame) {
	if (f.args[2] === null) {
		f.args[2] = 0;
	}
	if (f.args[2] == "melee" && f.args[0] < 15 && (!rt.bitAnd(this.stat, 1) || this.malfai)) {
		return 0;
	}
	f.dot = parent_proc();
	return f.dot;
}, false, { args: ["damage_amount", "damage_type", "damage_flag", "attack_dir"] });

// apc.dm:594
rt.def("/obj/machinery/power/apc/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	yield* this.set_broken();
	return f.dot;
}, true);

// apc.dm:598
rt.def("/obj/machinery/power/apc/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	disassembled ??= 1;
	if (rt.bitAnd(this.flags, NODECONSTRUCT)) return f.dot;
	if (!rt.bitAnd(this.stat, 1)) {
		yield* this.set_broken();
	}
	if (this.opened == 2) return f.dot;
	this.opened = 2;
	this.visible_message("<span class='warning'>The APC cover is knocked down!</span>");
	yield* this.update_icon();
	return f.dot;
}, true);

// apc.dm:607
rt.def("/obj/machinery/power/apc/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (!(!this.emagged && !this.malfhack)) return f.dot;
	if (this.opened) {
		to_chat(user, "<span class='warning'>You must close the cover to swipe an ID card!</span>");
	} else if (this.panel_open) {
		to_chat(user, "<span class='warning'>You must close the panel first!</span>");
	} else if (rt.bitAnd(this.stat, 9)) {
		to_chat(user, "<span class='warning'>Nothing happens!</span>");
	} else {
		flick("apc-spark", this);
		this.emagged = 1;
		this.locked = 0;
		to_chat(user, "<span class='notice'>You emag the APC interface.</span>");
		this.update_icon();
	}
	return f.dot;
});

// apc.dm:624
rt.def("/obj/machinery/power/apc/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (!user) {
		return f.dot;
	}
	if (f.usr == user && this.opened && !rt.istype(user, T("/mob/living/silicon"))) {
		if (this.cell) {
			user.visible_message(fmt("＀ removes ％！ from ＀!", [user, this.cell, this]), fmt("<span class='notice'>You remove ％！.</span>", [this.cell]));
			yield* user.put_in_hands(this.cell);
			yield* this.cell.update_icon();
			this.cell = null;
			this.charging = 0;
			yield* this.update_icon();
		}
		return f.dot;
	}
	if (rt.bitAnd(this.stat, MAINT) && !this.opened) {
		return f.dot;
	}
	yield* parent_proc();
	return f.dot;
}, true);

// apc.dm:641
rt.def("/obj/machinery/power/apc/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	let $2: any;
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (!(ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open)))) {
		yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "apc", this.name, 535, 515, master_ui, state))).open();
	}
	if (!ui) return f.dot;
	let $0: any = ui;
	let $1: any = "state";
	if (this.failure_timer) {
		$2 = 1;
	} else {
		$2 = 0;
	}
	yield* g.callName(f, $0, "set_autoupdate", [$1, $2], rt.Args.Named);
	return f.dot;
}, true);

// apc.dm:650
rt.def("/obj/machinery/power/apc/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null;
	let $9: any;
	let $0: any = "locked";
	let $1: any = this.locked;
	let $2: any = "failTime";
	let $3: any = this.failure_timer;
	let $4: any = "isOperating";
	let $5: any = this.operating;
	let $6: any = "externalPower";
	let $7: any = this.main_status;
	let $8: any = "powerCellStatus";
	if (this.cell) {
		$9 = this.cell.percent();
	} else {
		$9 = null;
	}
	return (data = rt.alist(f, [$0, $1, $2, $3, $4, $5, $6, $7, $8, $9, "chargeMode", this.chargemode, "chargingStatus", this.charging, "totalLoad", this.lastused_total, "coverLocked", this.coverlocked, "siliconUser", (user.has_unlimited_silicon_privilege || user.using_power_flow_console()), "malfStatus", this.get_malf_status(user), "powerChannels", list(rt.alist(f, ["title", "Equipment", "powerLoad", this.lastused_equip, "status", this.equipment, "topicParams", rt.alist(f, ["auto", rt.alist(f, ["eqp", 3]), "on", rt.alist(f, ["eqp", 2]), "off", rt.alist(f, ["eqp", 1])])]), rt.alist(f, ["title", "Lighting", "powerLoad", this.lastused_light, "status", this.lighting, "topicParams", rt.alist(f, ["auto", rt.alist(f, ["lgt", 3]), "on", rt.alist(f, ["lgt", 2]), "off", rt.alist(f, ["lgt", 1])])]), rt.alist(f, ["title", "Environment", "powerLoad", this.lastused_environ, "status", this.environ, "topicParams", rt.alist(f, ["auto", rt.alist(f, ["env", 3]), "on", rt.alist(f, ["env", 2]), "off", rt.alist(f, ["env", 1])])]))]));
});

// apc.dm:700
rt.def("/obj/machinery/power/apc/proc/get_malf_status", function get_malf_status(f: Frame, malf: Value) {
	if (rt.istype(malf, T("/mob/living/silicon/ai")) && malf.malf_picker) {
		if (this.malfai == (malf.parent || malf)) {
			if (this.occupier == malf) {
				return 3;
			} else if (rt.istype(malf.loc, T("/obj/machinery/power/apc"))) {
				return 4;
			} else {
				return 2;
			}
		} else {
			return 1;
		}
	} else {
		return 0;
	}
});

// apc.dm:714
rt.def("/obj/machinery/power/apc/proc/report", function report(f: Frame) {
	let $0: any = this.area.name;
	let $1: any = this.equipment;
	let $2: any = this.lighting;
	let $3: any = this.environ;
	let $4: any = this.lastused_equip + this.lastused_light + this.lastused_environ;
	return `${$0} : ${$1}/${$2}/${$3} (${$4}) : ${this.cell ? this.cell.percent() : "N/C"} (${this.charging})`;
});

// apc.dm:717
rt.def("/obj/machinery/power/apc/proc/update", function* update(f: Frame) {
	if (this.operating && !this.shorted && !this.failure_timer) {
		this.area.power_light = (this.lighting > 1 ? 1 : 0);
		this.area.power_equip = (this.equipment > 1 ? 1 : 0);
		this.area.power_environ = (this.environ > 1 ? 1 : 0);
	} else {
		this.area.power_light = 0;
		this.area.power_equip = 0;
		this.area.power_environ = 0;
	}
	yield* this.area.power_change();
	return f.dot;
}, true);

// apc.dm:728
rt.def("/obj/machinery/power/apc/proc/can_use", function can_use(f: Frame, user: Value, loud: Value) {
	let AI: Value = null, robot: Value = null;
	loud ??= 0;
	if (IsAdminGhost(user)) {
		return 1;
	}
	if (user.has_unlimited_silicon_privilege) {
		AI = user;
		robot = user;
		if (this.aidisabled || this.malfhack && rt.istype(this.malfai, T("/mob/living/silicon/ai")) && (rt.istype(AI, T("/mob/living/silicon/ai")) && this.malfai != AI && this.malfai != AI.parent || rt.istype(robot, T("/mob/living/silicon/robot")) && rt.isIn(f, robot, this.malfai.connected_robots))) {
			if (!loud) {
				to_chat(user, fmt("<span class='danger'>＄！ has eee disabled!</span>", [this]));
			}
			return 0;
		}
	}
	return 1;
});

// apc.dm:747
rt.def("/obj/machinery/power/apc/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	if ((yield* parent_proc()) || !this.can_use(f.usr, 1) || this.locked && !f.usr.has_unlimited_silicon_privilege && !this.failure_timer) {
		return f.dot;
	}
	if (action === "lock") {
		if (f.usr.has_unlimited_silicon_privilege) {
			if (this.emagged || rt.bitAnd(this.stat, 9)) {
				to_chat(f.usr, "The APC does not respond to the command.");
			} else {
				this.locked = (!this.locked ? 1 : 0);
				yield* this.update_icon();
				f.dot = 1;
			}
		}
	} else if (action === "cover") {
		this.coverlocked = (!this.coverlocked ? 1 : 0);
		f.dot = 1;
	} else if (action === "breaker") {
		yield* this.toggle_breaker();
		f.dot = 1;
	} else if (action === "charge") {
		this.chargemode = (!this.chargemode ? 1 : 0);
		if (!this.chargemode) {
			this.charging = 0;
			yield* this.update_icon();
		}
		f.dot = 1;
	} else if (action === "channel") {
		if (rt.at(params, "eqp")) {
			this.equipment = this.setsubsystem(text2num(rt.at(params, "eqp")));
			yield* this.update_icon();
			yield* this.update();
		} else if (rt.at(params, "lgt")) {
			this.lighting = this.setsubsystem(text2num(rt.at(params, "lgt")));
			yield* this.update_icon();
			yield* this.update();
		} else if (rt.at(params, "env")) {
			this.environ = this.setsubsystem(text2num(rt.at(params, "env")));
			yield* this.update_icon();
			yield* this.update();
		}
		f.dot = 1;
	} else if (action === "overload") {
		if (f.usr.has_unlimited_silicon_privilege) {
			yield* this.overload_lighting();
			f.dot = 1;
		}
	} else if (action === "hack") {
		if (this.get_malf_status(f.usr)) {
			yield* this.malfhack(f.usr);
		}
	} else if (action === "occupy") {
		if (this.get_malf_status(f.usr)) {
			yield* this.malfoccupy(f.usr);
		}
	} else if (action === "deoccupy") {
		if (this.get_malf_status(f.usr)) {
			yield* this.malfvacate();
		}
	} else if (action === "reboot") {
		this.failure_timer = 0;
		yield* this.update_icon();
		yield* this.update();
	}
	return 1;
}, true);

// apc.dm:804
rt.def("/obj/machinery/power/apc/proc/toggle_breaker", function* toggle_breaker(f: Frame) {
	this.operating = (!this.operating ? 1 : 0);
	yield* this.update();
	yield* this.update_icon();
	return f.dot;
}, true);

// apc.dm:809
rt.def("/obj/machinery/power/apc/proc/malfhack", function* malfhack(f: Frame, malf: Value) {
	let A: Value = null;
	if (!rt.istype(malf, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (this.get_malf_status(malf) != 1) {
		return f.dot;
	}
	if (malf.malfhacking) {
		to_chat(malf, "You are already hacking an APC.");
		return f.dot;
	}
	to_chat(malf, "Beginning override of APC systems. This takes some time, and you cannot perform other actions during the process.");
	malf.malfhack = this;
	malf.malfhacking = (yield* addtimer((yield* new_(T("/datum/callback"), malf, P("/mob/living/silicon/ai/proc/malfhacked"), this)), 600, 8));
	(A = (yield* malf.throw_alert("hackingapc", T("/obj/screen/alert/hackingapc")))).target = this;
	return f.dot;
}, true);

// apc.dm:825
rt.def("/obj/machinery/power/apc/proc/malfoccupy", function* malfoccupy(f: Frame, malf: Value) {
	if (!rt.istype(malf, T("/mob/living/silicon/ai"))) {
		return f.dot;
	}
	if (rt.istype(malf.loc, T("/obj/machinery/power/apc"))) {
		to_chat(malf, "<span class='warning'>You must evacuate your current APC first!</span>");
		return f.dot;
	}
	if (!malf.can_shunt) {
		to_chat(malf, "<span class='warning'>You cannot shunt!</span>");
		return f.dot;
	}
	if (this.z != ZLEVEL_STATION) {
		return f.dot;
	}
	this.occupier = (yield* new_(T("/mob/living/silicon/ai"), this, malf.laws, malf));
	yield* this.occupier.adjustOxyLoss(malf.getOxyLoss());
	if (!findtext(this.occupier.name, "APC Copy")) {
		this.occupier.name = `${malf.name} APC Copy`;
	}
	if (malf.parent) {
		this.occupier.parent = malf.parent;
	} else {
		this.occupier.parent = malf;
	}
	malf.shunted = 1;
	this.occupier.eyeobj.name = `${this.occupier.name} (AI Eye)`;
	if (malf.parent) {
		yield* qdel(malf);
	}
	this.occupier.verbs += P("/mob/living/silicon/ai/proc/corereturn");
	yield* this.occupier.cancel_camera();
	return f.dot;
}, true);

// apc.dm:852
rt.def("/obj/machinery/power/apc/proc/malfvacate", function* malfvacate(f: Frame, forced: Value) {
	let _P: Value = null;
	if (!this.occupier) {
		return f.dot;
	}
	if (this.occupier.parent && this.occupier.parent.stat != 2) {
		yield* this.occupier.mind.transfer_to(this.occupier.parent);
		this.occupier.parent.shunted = 0;
		yield* this.occupier.parent.setOxyLoss(this.occupier.getOxyLoss());
		yield* this.occupier.parent.cancel_camera();
		this.occupier.parent.verbs -= P("/mob/living/silicon/ai/proc/corereturn");
		yield* qdel(this.occupier);
	} else {
		to_chat(this.occupier, "<span class='danger'>Primary core damaged, unable to return core processes.</span>");
		if (!forced) return f.dot;
		this.occupier.loc = this.loc;
		yield* this.occupier.death();
		yield* this.occupier.gib();
		for (_P of each(GLOB.pinpointer_list, T("/obj/item/weapon/pinpointer"))) {
			_P.switch_mode_to(TRACK_NUKE_DISK);
			_P.nuke_warning = 0;
		}
	}
	return f.dot;
}, true);

// apc.dm:872
rt.def("/obj/machinery/power/apc/proc/transfer_ai", function* transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	let _T: Value = null;
	if (card.AI) {
		to_chat(user, `<span class='warning'>${card} is already occupied!</span>`);
		return f.dot;
	}
	if (!this.occupier) {
		to_chat(user, `<span class='warning'>There's nothing in ${this} to transfer!</span>`);
		return f.dot;
	}
	if (!this.occupier.mind || !this.occupier.client) {
		to_chat(user, `<span class='warning'>${this.occupier} is either inactive or destroyed!</span>`);
		return f.dot;
	}
	if (!this.occupier.parent.stat) {
		to_chat(user, `<span class='warning'>${this.occupier} is refusing all attempts at transfer!</span>`);
		return f.dot;
	}
	if (this.transfer_in_progress) {
		to_chat(user, "<span class='warning'>There's already a transfer in progress!</span>");
		return f.dot;
	}
	if (interaction != AI_TRANS_TO_CARD || this.occupier.stat) {
		return f.dot;
	}
	if (!(_T = rt.getStep(f, user, 0))) {
		return f.dot;
	}
	this.transfer_in_progress = 1;
	user.visible_message(`<span class='notice'>${user} slots ${card} into ${this}...</span>`, "<span class='notice'>Transfer process initiated. Sending request for AI approval...</span>");
	playsound(this, rt.rsc("sound/machines/click.ogg"), 50, 1);
	rt.op(f, "OutputReference", [rt.R.srcVar("occupier")], [sound(rt.rsc("sound/misc/notice2.ogg"))], false);
	if ((yield* alert(this.occupier, fmt("＀ is attempting to transfer you to ＇！. Do you consent to this?", [user, card.name]), "APC Transfer", "Yes - Transfer Me", "No - Keep Me Here")) == "No - Keep Me Here") {
		to_chat(user, "<span class='danger'>AI denied transfer request. Process terminated.</span>");
		playsound(this, rt.rsc("sound/machines/buzz-sigh.ogg"), 50, 1);
		this.transfer_in_progress = 0;
		return f.dot;
	}
	if (user.loc != _T) {
		to_chat(user, "<span class='danger'>Location changed. Process terminated.</span>");
		to_chat(this.occupier, `<span class='warning'>${user} moved away! Transfer canceled.</span>`);
		this.transfer_in_progress = 0;
		return f.dot;
	}
	to_chat(user, `<span class='notice'>AI accepted request. Transferring stored intelligence to ${card}...</span>`);
	to_chat(this.occupier, `<span class='notice'>Transfer starting. You will be moved to ${card} shortly.</span>`);
	if (!(yield* do_after(user, 50, { target: this }))) {
		to_chat(this.occupier, `<span class='warning'>${user} was interrupted! Transfer canceled.</span>`);
		this.transfer_in_progress = 0;
		return f.dot;
	}
	if (!this.occupier || !card) {
		this.transfer_in_progress = 0;
		return f.dot;
	}
	user.visible_message(`<span class='notice'>${user} transfers ${this.occupier} to ${card}!</span>`, `<span class='notice'>Transfer complete! ${this.occupier} is now stored in ${card}.</span>`);
	to_chat(this.occupier, `<span class='notice'>Transfer complete! You've been stored in ${user}'s ${card.name}.</span>`);
	yield* this.occupier.forceMove(card);
	card.AI = this.occupier;
	this.occupier.parent.shunted = 0;
	yield* this.occupier.cancel_camera();
	this.occupier = null;
	this.transfer_in_progress = 0;
	return f.dot;
}, true);

// apc.dm:927
rt.def("/obj/machinery/power/apc/proc/surplus", function surplus(f: Frame) {
	if (this.terminal) {
		return this.terminal.surplus();
	}
	return 0;
});

// apc.dm:932
rt.def("/obj/machinery/power/apc/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!(this.terminal && this.terminal.powernet)) return f.dot;
	this.terminal.powernet.load += amount;
	return f.dot;
});

// apc.dm:937
rt.def("/obj/machinery/power/apc/proc/avail", function avail(f: Frame) {
	if (this.terminal) {
		return this.terminal.avail();
	}
	return 0;
});

// apc.dm:943
rt.def("/obj/machinery/power/apc/proc/process", function* process(f: Frame) {
	let cellused: Value = null, ch: Value = null;
	if (this.icon_update_needed) {
		yield* this.update_icon();
	}
	if (rt.bitAnd(this.stat, 9)) {
		return f.dot;
	}
	if (!this.area.requires_power) {
		return f.dot;
	}
	if (this.failure_timer) {
		yield* this.update();
		this.queue_icon_update();
		this.failure_timer--;
		this.force_update = 1;
		return f.dot;
	}
	this.lastused_light = this.area.usage(6);
	this.lastused_light += this.area.usage(2);
	this.lastused_equip = this.area.usage(1);
	this.lastused_equip += this.area.usage(5);
	this.lastused_environ = this.area.usage(3);
	this.lastused_environ += this.area.usage(7);
	this.area.clear_usage();
	this.lastused_total = this.lastused_light + this.lastused_equip + this.lastused_environ;
	let last_lt: Value = this.lighting;
	let last_eq: Value = this.equipment;
	let last_en: Value = this.environ;
	let last_ch: Value = this.charging;
	let excess: Value = this.surplus();
	if (!this.avail()) {
		this.main_status = 0;
	} else if (excess < 0) {
		this.main_status = 1;
	} else {
		this.main_status = 2;
	}
	if (this.cell && !this.shorted) {
		cellused = min(this.cell.charge, GLOB.CELLRATE * this.lastused_total);
		yield* this.cell.use(cellused);
		if (excess > this.lastused_total) {
			yield* this.cell.give(cellused);
			this.add_load(cellused / GLOB.CELLRATE);
		} else if (this.cell.charge / GLOB.CELLRATE + excess >= this.lastused_total) {
			this.cell.charge = min(this.cell.maxcharge, this.cell.charge + GLOB.CELLRATE * excess);
			this.add_load(excess);
			this.charging = 0;
		} else {
			this.charging = 0;
			this.chargecount = 0;
			this.equipment = this.autoset(this.equipment, 0);
			this.lighting = this.autoset(this.lighting, 0);
			this.environ = this.autoset(this.environ, 0);
		}
		if (this.charging && this.longtermpower < 10) {
			this.longtermpower += 1;
		} else if (this.longtermpower > -10) {
			this.longtermpower -= 2;
		}
		if (this.cell.charge <= 0) {
			this.equipment = this.autoset(this.equipment, 0);
			this.lighting = this.autoset(this.lighting, 0);
			this.environ = this.autoset(this.environ, 0);
			this.area.poweralert(0, this);
		} else if (this.cell.percent() < 15 && this.longtermpower < 0) {
			this.equipment = this.autoset(this.equipment, 2);
			this.lighting = this.autoset(this.lighting, 2);
			this.environ = this.autoset(this.environ, 1);
			this.area.poweralert(0, this);
		} else if (this.cell.percent() < 30 && this.longtermpower < 0) {
			this.equipment = this.autoset(this.equipment, 2);
			this.lighting = this.autoset(this.lighting, 1);
			this.environ = this.autoset(this.environ, 1);
			this.area.poweralert(0, this);
		} else {
			this.equipment = this.autoset(this.equipment, 1);
			this.lighting = this.autoset(this.lighting, 1);
			this.environ = this.autoset(this.environ, 1);
			this.area.poweralert(1, this);
			if (this.cell.percent() > 75) {
				this.area.poweralert(1, this);
			}
		}
		if (this.chargemode && this.charging == 1 && this.operating) {
			if (excess > 0) {
				this.add_load((ch = min(excess * GLOB.CELLRATE, this.cell.maxcharge * GLOB.CHARGELEVEL)) / GLOB.CELLRATE);
				yield* this.cell.give(ch);
			} else {
				this.charging = 0;
				this.chargecount = 0;
			}
		}
		if (this.cell.charge >= this.cell.maxcharge) {
			this.cell.charge = this.cell.maxcharge;
			this.charging = 2;
		}
		if (this.chargemode) {
			if (!this.charging) {
				if (excess > this.cell.maxcharge * GLOB.CHARGELEVEL) {
					this.chargecount++;
				} else {
					this.chargecount = 0;
				}
				if (this.chargecount == 10) {
					this.chargecount = 0;
					this.charging = 1;
				}
			}
		} else {
			this.charging = 0;
			this.chargecount = 0;
		}
	} else {
		this.charging = 0;
		this.chargecount = 0;
		this.equipment = this.autoset(this.equipment, 0);
		this.lighting = this.autoset(this.lighting, 0);
		this.environ = this.autoset(this.environ, 0);
		this.area.poweralert(0, this);
	}
	if (last_lt != this.lighting || last_eq != this.equipment || last_en != this.environ || this.force_update) {
		this.force_update = 0;
		this.queue_icon_update();
		yield* this.update();
	} else {
		if (last_ch == this.charging) return f.dot;
		this.queue_icon_update();
	}
	return f.dot;
}, true, { waitfor: false });

// apc.dm:1104
rt.def("/obj/machinery/power/apc/proc/autoset", function autoset(f: Frame, val: Value, on: Value) {
	if (on == 0) {
		if (val == 2) {
			return 0;
		} else if (val == 3) {
			return 1;
		}
	} else if (on == 1) {
		if (val == 1) {
			return 3;
		}
	} else if (on == 2) {
		if (val == 3) {
			return 1;
		}
	}
	return val;
});

// apc.dm:1118
rt.def("/obj/machinery/power/apc/proc/reset", function* reset(f: Frame, wire: Value) {
	if (wire === "ID Scan") {
		this.locked = 1;
	} else if (wire === "Main Power 1" || wire === "Main Power 2") {
		if (!this.wires.is_cut("Main Power 1") && !this.wires.is_cut("Main Power 2")) {
			this.shorted = 0;
		}
	} else if (wire === "AI Connection") {
		if (!this.wires.is_cut("AI Connection")) {
			this.aidisabled = 0;
		}
	} else if (wire === "emp") {
		this.equipment = 3;
		this.environ = 3;
		yield* this.update_icon();
		yield* this.update();
	}
	return f.dot;
}, true);

// apc.dm:1136
rt.def("/obj/machinery/power/apc/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	if (this.cell) {
		yield* this.cell.emp_act(severity);
	}
	if (this.occupier) {
		yield* this.occupier.emp_act(severity);
	}
	this.lighting = 0;
	this.equipment = 0;
	this.environ = 0;
	yield* this.update_icon();
	yield* this.update();
	yield* addtimer((yield* new_(T("/datum/callback"), this, P("/obj/machinery/power/apc/proc/reset"), "emp")), 600);
	yield* parent_proc();
	return f.dot;
}, true);

// apc.dm:1148
rt.def("/obj/machinery/power/apc/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	yield* this.set_broken();
	return f.dot;
}, true);

// apc.dm:1152
rt.def("/obj/machinery/power/apc/proc/disconnect_terminal", function disconnect_terminal(f: Frame) {
	if (!this.terminal) return f.dot;
	this.terminal.master = null;
	this.terminal = null;
	return f.dot;
});

// apc.dm:1156
rt.def("/obj/machinery/power/apc/proc/set_broken", function* set_broken(f: Frame) {
	if (this.malfai && this.operating) {
		this.malfai.malf_picker.processing_time = max(0, min(this.malfai.malf_picker.processing_time - 10, 1000));
	}
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	this.operating = 0;
	if (this.occupier) {
		yield* this.malfvacate(1);
	}
	yield* this.update_icon();
	yield* this.update();
	return f.dot;
}, true);

// apc.dm:1168
rt.def("/obj/machinery/power/apc/proc/overload_lighting", function* overload_lighting(f: Frame) {
	if (!this.operating || this.shorted) {
		return f.dot;
	}
	if (!(this.cell && this.cell.charge >= 20)) return f.dot;
	yield* this.cell.use(20);
	yield* ImmediateInvokeAsync(this, P("/obj/machinery/power/apc/proc/break_lights"));
	return f.dot;
}, true);

// apc.dm:1175
rt.def("/obj/machinery/power/apc/proc/break_lights", function* break_lights(f: Frame) {
	let A: Value = null, L: Value = null;
	for (A of each(this.area.related, T("/area"))) {
		L = null;
		for (L of each(A, T("/obj/machinery/light"))) {
			L.on = 1;
			yield* L.break_light_tube();
			L.on = 0;
			yield* stoplag();
		}
	}
	return f.dot;
}, true);

// apc.dm:1183
rt.def("/obj/machinery/power/apc/proc/shock", function* shock(f: Frame, user: Value, prb: Value) {
	if (!prob(prb)) {
		return 0;
	}
	yield* do_sparks(5, 1, this);
	if (rt.istype(user, T("/mob/living/carbon/alien"))) {
		return 0;
	}
	if (yield* electrocute_mob(user, this, this, 1, 1)) {
		return 1;
	} else {
		return 0;
	}
}, true);

// apc.dm:1194
rt.def("/obj/machinery/power/apc/proc/setsubsystem", function setsubsystem(f: Frame, val: Value) {
	if (this.cell && this.cell.charge > 0) {
		return val == 1 ? 0 : val;
	}
	if (val == 3) {
		return 1;
	} else {
		return 0;
	}
});

// apc.dm:1203
rt.def("/obj/machinery/power/apc/proc/energy_fail", function energy_fail(f: Frame, duration: Value) {
	let M: Value = null, A: Value = null, I: Value = null;
	for (M of each(this.area.contents, T("/obj/machinery"))) {
		if (M.critical_machine) {
			return f.dot;
		}
	}
	for (A of each(GLOB.ai_list)) {
		if (get_area((I = A)) == this.area) {
			return f.dot;
		}
	}
	this.failure_timer = max(this.failure_timer, round(duration));
	return f.dot;
});
