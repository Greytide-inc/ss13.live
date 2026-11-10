// Based on /tg/station's code/modules/power/smes.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10302, "/obj/machinery/power/smes", "/obj/machinery/power", {
	capacity: 5000000,
	charge: 0,
	input_attempt: 1,
	inputting: 1,
	input_level: 50000,
	input_level_max: 200000,
	input_available: 0,
	output_attempt: 1,
	outputting: 1,
	output_level: 50000,
	output_level_max: 200000,
	output_used: 0,
	terminal: null,
	anchored: 1,
	name: "power storage unit",
	desc: "A high-capacity superconducting magnetic energy storage (SMES) unit.",
	icon_state: "smes",
	density: 1,
	use_power: 0,
});

// smes.dm:42
rt.def("/obj/machinery/power/smes/proc/examine", function examine(f: Frame, user: Value) {
	parent_proc();
	if (this.terminal) return f.dot;
	to_chat(user, "<span class='warning'>This SMES has no power terminal!</span>");
	return f.dot;
}, false);

// smes.dm:47
rt.def("/obj/machinery/power/smes/proc/New", function* New(f: Frame) {
	let B: Value = null, d: Value = null, _T: Value = null, term: Value = null;
	yield* parent_proc();
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/smes"), null))).apply_default_parts(this);
	rt.spawnTail(f, 5, "/obj/machinery/power/smes/proc/New: spawn at modules/power/smes.dm:51", B, d, _T, term);
	return f.dot;
}, true);

// a spawn(5) body of /obj/machinery/power/smes/proc/New, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/power/smes/proc/New: spawn at modules/power/smes.dm:51", function* (f: Frame, B: Value, d: Value, _T: Value, term: Value) {
	let $e: any;
	d = null;
	rt.forList(f, 0, GLOB.cardinal);
	blk38: {
		while (($e = rt.next(f, 0)) !== undefined) {
			d = $e;
			_T = rt.getStep(f, this, d);
			term = null;
			for (term of each(_T, T("/obj/machinery/power/terminal"))) {
				if (term && term.dir == turn(d, 180)) {
					this.terminal = term;
					break blk38;
				}
			}
		}
		rt.endFor(f, 0);
	}
	if (!this.terminal) {
		(rt.modSrcVar(f, "stat", 1, rt.bitOr));
		return f.dot;
	}
	this.terminal.master = this;
	yield* this.update_icon();
	return null;
});

rt.type(6769, "/obj/item/weapon/circuitboard/machine/smes", "/obj/item/weapon/circuitboard/machine", {
	def_components: null,
	name: "SMES (Machine Board)",
	build_path: rt.typePath("/obj/machinery/power/smes"),
	origin_tech: "programming=3;powerstorage=3;engineering=3",
	req_components: null,
});

// smes.dm:75
rt.def("/obj/item/weapon/circuitboard/machine/smes/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.def_components = rt.alist(f, [T("/obj/item/weapon/stock_parts/cell"), T("/obj/item/weapon/stock_parts/cell/high/empty")]);

	this.req_components = rt.alist(f, [T("/obj/item/stack/cable_coil"), 5, T("/obj/item/weapon/stock_parts/cell"), 5, T("/obj/item/weapon/stock_parts/capacitor"), 1]);
	return f.dot;
});

// smes.dm:81
rt.def("/obj/machinery/power/smes/proc/RefreshParts", function RefreshParts(f: Frame) {
	let C: Value = null, CP: Value = null, PC: Value = null;
	let IO: Value = 0;
	let MC: Value = 0;
	for (CP of each(this.component_parts, T("/obj/item/weapon/stock_parts/capacitor"))) {
		IO += CP.rating;
	}
	this.input_level_max = rt.initial(f, this, "input_level_max") * IO;
	this.output_level_max = rt.initial(f, this, "output_level_max") * IO;
	for (PC of each(this.component_parts, T("/obj/item/weapon/stock_parts/cell"))) {
		MC += PC.maxcharge;
		C += PC.charge;
	}
	this.capacity = MC / 15000 * 1000000;
	if (!(!rt.initial(f, this, "charge") && !this.charge)) return f.dot;
	this.charge = C / 15000 * 1000000;
	return f.dot;
});

// smes.dm:94
rt.def("/obj/machinery/power/smes/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let _T: Value = null, term: Value = null, dir: Value = null, _T_1: Value = null, C: Value = null, N: Value = null;
	let $0: any, $1: any, $2: any, $e: any;
	if (this.default_deconstruction_screwdriver(user, `${rt.initial(f, this, "icon_state")}-o`, rt.initial(f, this, "icon_state"), I)) {
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.default_change_direction_wrench(user, I)) {
		this.terminal = null;
		_T = rt.getStep(f, this, this.dir);
		for (term of each(_T, T("/obj/machinery/power/terminal"))) {
			if (term && term.dir == turn(this.dir, 180)) {
				this.terminal = term;
				this.terminal.master = this;
				to_chat(user, "<span class='notice'>Terminal found.</span>");
				break;
			}
		}
		if (!this.terminal) {
			to_chat(user, "<span class='alert'>No power terminal found.</span>");
			return f.dot;
		}
		(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
		yield* this.update_icon();
		return f.dot;
	}
	if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/stack/cable_coil"))) {
		if (rt.bitAnd((dir = rt.getDir(f, user, this)), dir - 1)) {
			return f.dot;
		}
		if (this.terminal) {
			to_chat(user, "<span class='warning'>This SMES already has a power terminal!</span>");
			return f.dot;
		}
		if (!this.panel_open) {
			to_chat(user, "<span class='warning'>You must open the maintenance panel first!</span>");
			return f.dot;
		}
		if ((_T_1 = rt.getStep(f, user, 0)).intact) {
			to_chat(user, "<span class='warning'>You must first remove the floor plating!</span>");
			return f.dot;
		}
		if ((C = I).get_amount() < 10) {
			to_chat(user, "<span class='warning'>You need more wires!</span>");
			return f.dot;
		}
		to_chat(user, "<span class='notice'>You start building the power terminal...</span>");
		playsound(this.loc, rt.rsc("sound/items/deconstruct.ogg"), 50, 1);
		if ((yield* do_after(user, 20, { target: this })) && C.get_amount() >= 10) {
			if (C.get_amount() < 10 || !C) {
				return f.dot;
			}
			N = _T_1.get_cable_node();
			if (prob(50) && (yield* electrocute_mob(f.usr, N, N, 1, 1))) {
				yield* do_sparks(5, 1, this);
				return f.dot;
			}
			yield* C.use(10);
			user.visible_message(`${user.name} has built a power terminal.`, "<span class='notice'>You build the power terminal.</span>");
			yield* this.make_terminal(_T_1);
			yield* this.terminal.connect_to_network();
		}
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/wirecutters")) && this.terminal && this.panel_open) {
		yield* this.terminal.dismantle(user, I);
		return f.dot;
	}
	_T = rt.getStep(f, this, 0);
	if (yield* this.default_deconstruction_crowbar(I)) {
		$0 = this;
		$1 = `${key_name_admin(user)}${fmt("(<a href='?_src_=holder;adminmoreinfo=＃'>?</a>)", [user])} ${fmt("(<a href='?_src_=holder;adminplayerobservefollow=＃'>FLW</a>)", [user])}`;
		if (_T) {
			$2 = `${`(${_T.x},${_T.y},${_T.z})`} ${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`;
		} else {
			$2 = "nonexistent location";
		}
		message_admins(`${$0} has been deconstructed by ${$1} in ${`${$2}`}`, 0, 1);
		log_game(`${this} has been deconstructed by ${key_name(user)}`);
		this.investigate_log(`SMES deconstructed by ${key_name(user)}`, "singulo");
		return f.dot;
	} else if (this.panel_open && rt.istype(I, T("/obj/item/weapon/crowbar"))) {
		return f.dot;
	}
	return (yield* parent_proc());
}, true);

// smes.dm:183
rt.def("/obj/machinery/power/smes/proc/default_deconstruction_crowbar", function* default_deconstruction_crowbar(f: Frame, C: Value) {
	if (rt.istype(C, T("/obj/item/weapon/crowbar")) && this.terminal) {
		to_chat(f.usr, "<span class='warning'>You must first remove the power terminal!</span>");
		return 0;
	}
	return (yield* parent_proc());
}, true);

// smes.dm:190
rt.def("/obj/machinery/power/smes/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	let cell: Value = null;
	for (cell of each(this.component_parts, T("/obj/item/weapon/stock_parts/cell"))) {
		cell.charge = this.charge / this.capacity * cell.maxcharge;
	}
	return f.dot;
});

// smes.dm:194
rt.def("/obj/machinery/power/smes/proc/Destroy", function* Destroy(f: Frame) {
	let A: Value = null, _T: Value = null;
	if (GLOB.SSticker && GLOB.SSticker.IsRoundInProgress()) {
		A = get_area(this);
		_T = rt.getStep(f, this, 0);
		message_admins(`SMES deleted at ${A}${`(<a href='?_src_=holder;adminplayerobservecoodjump=1;X=${_T.x};Y=${_T.y};Z=${_T.z}'>JMP</a>)`}`);
		log_game(`SMES deleted at ${A}${`(${_T.x},${_T.y},${_T.z})`}`);
		this.investigate_log(`<font color='red'>deleted</font> at ${A}${`(${_T.x},${_T.y},${_T.z})`}`, "singulo");
	}
	if (this.terminal) {
		this.disconnect_terminal();
	}
	return (yield* parent_proc());
}, true);

// smes.dm:207
rt.def("/obj/machinery/power/smes/proc/make_terminal", function* make_terminal(f: Frame, _T: Value) {
	this.terminal = (yield* new_(T("/obj/machinery/power/terminal"), _T));
	yield* this.terminal.setDir(rt.getDir(f, _T, this));
	this.terminal.master = this;
	(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
	return f.dot;
}, true);

// smes.dm:214
rt.def("/obj/machinery/power/smes/proc/disconnect_terminal", function disconnect_terminal(f: Frame) {
	if (!this.terminal) return f.dot;
	this.terminal.master = null;
	this.terminal = null;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	return f.dot;
});

// smes.dm:220
rt.def("/obj/machinery/power/smes/proc/update_icon", function update_icon(f: Frame) {
	let clevel: Value = null;
	this.cut_overlays();
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (this.panel_open) {
		return f.dot;
	}
	if (this.outputting) {
		this.add_overlay("smes-op1");
	} else {
		this.add_overlay("smes-op0");
	}
	if (this.inputting) {
		this.add_overlay("smes-oc1");
	} else if (this.input_attempt) {
		this.add_overlay("smes-oc0");
	}
	if (!((clevel = this.chargedisplay()) > 0)) return f.dot;
	this.add_overlay(`smes-og${clevel}`);
	return f.dot;
});

// smes.dm:244
rt.def("/obj/machinery/power/smes/proc/chargedisplay", function chargedisplay(f: Frame) {
	return max(0, min(round(5.5 * this.charge / this.capacity), 5));
});

// smes.dm:247
rt.def("/obj/machinery/power/smes/proc/process", function process(f: Frame) {
	let load: Value = null;
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	let last_disp: Value = this.chargedisplay();
	let last_chrg: Value = this.inputting;
	let last_onln: Value = this.outputting;
	if (this.terminal && this.input_attempt) {
		this.input_available = this.terminal.surplus();
		if (this.inputting) {
			if (this.input_available > 0) {
				this.charge += (load = min(min((this.capacity - this.charge) / SMESRATE, this.input_level), this.input_available)) * SMESRATE;
				this.add_load(load);
			} else {
				this.inputting = 0;
			}
		} else if (this.input_attempt && this.input_available > 0) {
			this.inputting = 1;
		}
	} else {
		this.inputting = 0;
	}
	if (this.output_attempt) {
		if (this.outputting) {
			this.output_used = min(this.charge / SMESRATE, this.output_level);
			this.charge -= this.output_used * SMESRATE;
			this.add_avail(this.output_used);
			if (this.output_used < 0.0001) {
				this.outputting = 0;
				this.investigate_log("lost power and turned <font color='red'>off</font>", "singulo");
			}
		} else if (this.output_attempt && this.charge > this.output_level && this.output_level > 0) {
			this.outputting = 1;
		} else {
			this.output_used = 0;
		}
	} else {
		this.outputting = 0;
	}
	if (!(last_disp != this.chargedisplay() || last_chrg != this.inputting || last_onln != this.outputting)) return f.dot;
	this.update_icon();
	return f.dot;
}, false, { waitfor: false });

// smes.dm:305
rt.def("/obj/machinery/power/smes/proc/restore", function restore(f: Frame) {
	if (rt.bitAnd(this.stat, 1)) {
		return f.dot;
	}
	if (!this.outputting) {
		this.output_used = 0;
		return f.dot;
	}
	let excess: Value = this.powernet.netexcess;
	excess = min(this.output_used, excess);
	excess = min((this.capacity - this.charge) / SMESRATE, excess);
	let clev: Value = this.chargedisplay();
	this.charge += excess * SMESRATE;
	this.powernet.netexcess -= excess;
	this.output_used -= excess;
	if (clev != this.chargedisplay()) {
		this.update_icon();
	}
	return f.dot;
});

// smes.dm:333
rt.def("/obj/machinery/power/smes/proc/add_load", function add_load(f: Frame, amount: Value) {
	if (!(this.terminal && this.terminal.powernet)) return f.dot;
	this.terminal.powernet.load += amount;
	return f.dot;
});

// smes.dm:338
rt.def("/obj/machinery/power/smes/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "smes", this.name, 340, 440, master_ui, state))).open();
	return f.dot;
}, true);

// smes.dm:344
rt.def("/obj/machinery/power/smes/proc/ui_data", function ui_data(f: Frame) {
	let data: Value = null;
	return (data = rt.alist(f, ["capacityPercent", round(100 * this.charge / this.capacity, 0.1), "capacity", this.capacity, "charge", this.charge, "inputAttempt", this.input_attempt, "inputting", this.inputting, "inputLevel", this.input_level, "inputLevelMax", this.input_level_max, "inputAvailable", this.input_available, "outputAttempt", this.output_attempt, "outputting", this.outputting, "outputLevel", this.output_level, "outputLevelMax", this.output_level_max, "outputUsed", this.output_used]));
});

// smes.dm:364
rt.def("/obj/machinery/power/smes/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let target: Value = null, adjust: Value = null;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "tryinput") {
		this.input_attempt = (!this.input_attempt ? 1 : 0);
		this.log_smes(f.usr.ckey);
		yield* this.update_icon();
		f.dot = 1;
	} else if (action === "tryoutput") {
		this.output_attempt = (!this.output_attempt ? 1 : 0);
		this.log_smes(f.usr.ckey);
		yield* this.update_icon();
		f.dot = 1;
	} else if (action === "input") {
		target = rt.at(params, "target");
		adjust = text2num(rt.at(params, "adjust"));
		if (target == "input") {
			if ((target = (yield* g.op(f, "Prompt", [33], [null, this.input_level, this.name, `New input target (0-${this.input_level_max}):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (target == "min") {
			target = 0;
			f.dot = 1;
		} else if (target == "max") {
			target = this.input_level_max;
			f.dot = 1;
		} else if (adjust) {
			target = this.input_level + adjust;
			f.dot = 1;
		} else if (text2num(target) !== null) {
			target = text2num(target);
			f.dot = 1;
		}
		if (f.dot) {
			this.input_level = max(0, min(target, this.input_level_max));
			this.log_smes(f.usr.ckey);
		}
	} else if (action === "output") {
		target = rt.at(params, "target");
		adjust = text2num(rt.at(params, "adjust"));
		if (target == "input") {
			if ((target = (yield* g.op(f, "Prompt", [33], [null, this.output_level, this.name, `New output target (0-${this.output_level_max}):`, null]))) !== null && !(yield* parent_proc())) {
				f.dot = 1;
			}
		} else if (target == "min") {
			target = 0;
			f.dot = 1;
		} else if (target == "max") {
			target = this.output_level_max;
			f.dot = 1;
		} else if (adjust) {
			target = this.output_level + adjust;
			f.dot = 1;
		} else if (text2num(target) !== null) {
			target = text2num(target);
			f.dot = 1;
		}
		if (!f.dot) return f.dot;
		this.output_level = max(0, min(target, this.output_level_max));
		this.log_smes(f.usr.ckey);
	}
	return f.dot;
}, true);

// smes.dm:423
rt.def("/obj/machinery/power/smes/proc/log_smes", function log_smes(f: Frame, user: Value) {
	let $0: any, $4: any, $5: any;
	user ??= "";
	if (this.input_level > this.output_level) {
		$0 = "<font color='green'>";
	} else {
		$0 = "<font color='red'>";
	}
	let $1: any = this.input_level;
	let $2: any = this.output_level;
	let $3: any = this.charge;
	if (this.output_attempt) {
		$4 = "<font color='green'>on</font>";
	} else {
		$4 = "<font color='red'>off</font>";
	}
	if (this.input_attempt) {
		$5 = "<font color='green'>auto</font>";
	} else {
		$5 = "<font color='red'>off</font>";
	}
	this.investigate_log(`input/output; ${$0}${$1}/${$2}</font> | Charge: ${$3} | Output-mode: ${$4} | Input-mode: ${$5} by ${user}`, "singulo");
	return f.dot;
});

// smes.dm:427
rt.def("/obj/machinery/power/smes/proc/emp_act", function* emp_act(f: Frame, severity: Value) {
	this.input_attempt = rand(0, 1);
	this.inputting = this.input_attempt;
	this.output_attempt = rand(0, 1);
	this.outputting = this.output_attempt;
	this.output_level = rand(0, this.output_level_max);
	this.input_level = rand(0, this.input_level_max);
	this.charge -= 1000000 / severity;
	if (this.charge < 0) {
		this.charge = 0;
	}
	yield* this.update_icon();
	this.log_smes("an emp");
	yield* parent_proc();
	return f.dot;
}, true);

rt.type(10304, "/obj/machinery/power/smes/magical", "/obj/machinery/power/smes", {
	name: "magical power storage unit",
	desc: "A high-capacity superconducting magnetic energy storage (SMES) unit. Magically produces power.",
});

// smes.dm:450
rt.def("/obj/machinery/power/smes/magical/proc/process", function process(f: Frame) {
	this.capacity = 1e+31;
	this.charge = 1e+31;
	parent_proc();
	return f.dot;
}, false, { waitfor: false });
