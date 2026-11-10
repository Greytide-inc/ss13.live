// Based on /tg/station's code/modules/reagents/chemistry/machinery/chem_master.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g } = rt;


rt.type(10979, "/obj/machinery/chem_master", "/obj/machinery", {
	beaker: null,
	bottle: null,
	mode: 1,
	condi: 0,
	screen: "home",
	analyzeVars: null,
	useramount: 30,
	anchored: 1,
	use_power: 1,
	idle_power_usage: 20,
	name: "ChemMaster 3000",
	desc: "Used to seperate chemicals and distribute them in a variety of forms.",
	density: 1,
	icon: rt.rsc("icons/obj/chemical.dmi"),
	icon_state: "mixer0",
	resistance_flags: 34,
	layer: 2.9,
});

// chem_master.dm:16
rt.def("/obj/machinery/chem_master/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.analyzeVars = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	return f.dot;
});

// chem_master.dm:21
rt.def("/obj/machinery/chem_master/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	yield* this.create_reagents(100);
	this.add_overlay("waitlight");
	yield* (B = (yield* new_(T("/obj/item/weapon/circuitboard/machine/chem_master"), null))).apply_default_parts(this);
	f.dot = (yield* parent_proc());
	return f.dot;
}, true);

rt.type(6777, "/obj/item/weapon/circuitboard/machine/chem_master", "/obj/item/weapon/circuitboard/machine", {
	req_components: null,
	name: "ChemMaster 3000 (Machine Board)",
	build_path: rt.typePath("/obj/machinery/chem_master"),
	origin_tech: "materials=3;programming=2;biotech=3",
});

// chem_master.dm:31
rt.def("/obj/item/weapon/circuitboard/machine/chem_master/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_components = rt.alist(f, [T("/obj/item/weapon/reagent_containers/glass/beaker"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 1, T("/obj/item/weapon/stock_parts/console_screen"), 1]);
	return f.dot;
});

// chem_master.dm:37
rt.def("/obj/item/weapon/circuitboard/machine/chem_master/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	let new_name: Value = null, new_path: Value = null;
	if (rt.istype(I, T("/obj/item/weapon/screwdriver"))) {
		new_name = "ChemMaster";
		new_path = T("/obj/machinery/chem_master");
		if (this.build_path == T("/obj/machinery/chem_master")) {
			new_name = "CondiMaster";
			new_path = T("/obj/machinery/chem_master/condimaster");
		}
		this.build_path = new_path;
		this.name = `${new_name} 3000 (Machine Board)`;
		to_chat(user, `<span class='notice'>You change the circuit board setting to "${new_name}".</span>`);
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// chem_master.dm:52
rt.def("/obj/machinery/chem_master/proc/RefreshParts", function RefreshParts(f: Frame) {
	let B: Value = null;
	this.reagents.maximum_volume = 0;
	for (B of each(this.component_parts, T("/obj/item/weapon/reagent_containers/glass/beaker"))) {
		this.reagents.maximum_volume += B.reagents.maximum_volume;
	}
	return f.dot;
});

// chem_master.dm:57
rt.def("/obj/machinery/chem_master/proc/ex_act", function ex_act(f: Frame, severity: Value, target: Value) {
	if (!(severity < 3)) return f.dot;
	parent_proc();
	return f.dot;
}, false, { waitfor: false });

// chem_master.dm:61
rt.def("/obj/machinery/chem_master/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	parent_proc();
	if (this.beaker) {
		this.beaker.ex_act(severity, target);
	}
	if (!this.bottle) return f.dot;
	this.bottle.ex_act(severity, target);
	return f.dot;
}, false);

// chem_master.dm:68
rt.def("/obj/machinery/chem_master/proc/handle_atom_del", function* handle_atom_del(f: Frame, A: Value) {
	yield* parent_proc();
	if (A == this.beaker) {
		this.beaker = null;
		yield* this.reagents.clear_reagents();
		this.icon_state = "mixer0";
	} else {
		if (A != this.bottle) return f.dot;
		this.bottle = null;
	}
	return f.dot;
}, true);

// chem_master.dm:78
rt.def("/obj/machinery/chem_master/proc/blob_act", function* blob_act(f: Frame, B: Value) {
	if (!prob(50)) return f.dot;
	yield* qdel(this);
	return f.dot;
}, true);

// chem_master.dm:82
rt.def("/obj/machinery/chem_master/proc/power_change", function power_change(f: Frame) {
	if (this.powered()) {
		(rt.modSrcVar(f, "stat", 16777213, rt.bitAnd));
	} else {
		rt.spawnTail(f, rand(0, 15), "/obj/machinery/chem_master/proc/power_change: spawn at modules/reagents/chemistry/machinery/chem_master.dm:83");
	}
	return f.dot;
});

// a spawn(rt.call(f, P("/proc/rand"), null, [0, 15])) body of /obj/machinery/chem_master/proc/power_change, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/chem_master/proc/power_change: spawn at modules/reagents/chemistry/machinery/chem_master.dm:83", function* (f: Frame) {
	(rt.modSrcVar(f, "stat", 2, rt.bitOr));
	return null;
});

// chem_master.dm:89
rt.def("/obj/machinery/chem_master/proc/attackby", function* attackby(f: Frame, I: Value, user: Value, params: Value) {
	if (this.default_deconstruction_screwdriver(user, "mixer0_nopower", "mixer0", I)) {
		if (this.beaker) {
			this.beaker.loc = this.loc;
			this.beaker = null;
			yield* this.reagents.clear_reagents();
		}
		if (this.bottle) {
			this.bottle.loc = this.loc;
			this.bottle = null;
		}
		return f.dot;
	} else if (yield* this.exchange_parts(user, I)) {
		return f.dot;
	} else if (yield* this.default_deconstruction_crowbar(I)) {
		return f.dot;
	}
	if (yield* this.default_unfasten_wrench(user, I)) {
		return f.dot;
	}
	if (rt.istype(I, T("/obj/item/weapon/reagent_containers")) && rt.bitAnd(I.container_type, OPENCONTAINER)) {
		f.dot = 1;
		if (this.panel_open) {
			to_chat(user, `<span class='warning'>You can't use the ${this.name} while its panel is opened!</span>`);
			return f.dot;
		}
		if (this.beaker) {
			to_chat(user, "<span class='warning'>A container is already loaded in the machine!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.beaker = I;
		this.beaker.loc = this;
		to_chat(user, "<span class='notice'>You add the beaker to the machine.</span>");
		yield* this.updateUsrDialog();
		this.icon_state = "mixer1";
	} else if (!this.condi && rt.istype(I, T("/obj/item/weapon/storage/pill_bottle"))) {
		if (this.bottle) {
			to_chat(user, "<span class='warning'>A pill bottle is already loaded into the machine!</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		this.bottle = I;
		this.bottle.loc = this;
		to_chat(user, "<span class='notice'>You add the pill bottle into the dispenser slot.</span>");
		yield* this.updateUsrDialog();
	} else {
		return (yield* parent_proc());
	}
	return f.dot;
}, true);

// chem_master.dm:141
rt.def("/obj/machinery/chem_master/proc/ui_interact", function* ui_interact(f: Frame, user: Value, ui_key: Value, ui: Value, force_open: Value, master_ui: Value, state: Value) {
	ui_key ??= "main";
	force_open ??= 0;
	state ??= GLOB.default_state;
	if (ui = (yield* GLOB.SStgui.try_update_ui(user, this, ui_key, ui, force_open))) return f.dot;
	yield* (ui = (yield* new_(T("/datum/tgui"), user, this, ui_key, "chem_master", this.name, 500, 550, master_ui, state))).open();
	return f.dot;
}, true);

// chem_master.dm:148
rt.def("/obj/machinery/chem_master/proc/ui_data", function ui_data(f: Frame, user: Value) {
	let data: Value = null, R: Value = null, N: Value = null;
	let $e: any;
	let $0: any = (data = list());
	let $1: any = "isBeakerLoaded";
	rt.setAt($0, $1, this.beaker ? 1 : 0);
	rt.setAt(data, "beakerCurrentVolume", this.beaker ? this.beaker.reagents.total_volume : null);
	rt.setAt(data, "beakerMaxVolume", this.beaker ? this.beaker.volume : null);
	rt.setAt(data, "mode", this.mode);
	rt.setAt(data, "condi", this.condi);
	rt.setAt(data, "screen", this.screen);
	rt.setAt(data, "analyzeVars", this.analyzeVars);
	rt.setAt(data, "isPillBottleLoaded", this.bottle ? 1 : 0);
	if (this.bottle) {
		rt.setAt(data, "pillBotContent", rt.len(f, this.bottle.contents));
		rt.setAt(data, "pillBotMaxContent", this.bottle.storage_slots);
	}
	let beakerContents: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (this.beaker) {
		for (R of each(this.beaker.reagents.reagent_list, T("/datum/reagent"))) {
			beakerContents.Add(list(rt.alist(f, ["name", R.name, "id", R.id, "volume", R.volume])));
		}
		rt.setAt(data, "beakerContents", beakerContents);
	}
	let bufferContents: Value = rt.op(f, "CreateMultidimensionalList", [1], [0]);
	if (this.reagents.total_volume) {
		for (N of each(this.reagents.reagent_list, T("/datum/reagent"))) {
			bufferContents.Add(list(rt.alist(f, ["name", N.name, "id", N.id, "volume", N.volume])));
		}
		rt.setAt(data, "bufferContents", bufferContents);
	}
	return data;
});

// chem_master.dm:179
rt.def("/obj/machinery/chem_master/proc/ui_act", function* ui_act(f: Frame, action: Value, params: Value) {
	let id: Value = null, amount: Value = null, many: Value = null, vol_each: Value = null, name: Value = null, _P: Value = null, i: Value = null, name_1: Value = null, _P_2: Value = null, amount_full: Value = null, vol_part: Value = null, R: Value = null, state: Value = null, _T: Value = null;
	let $0: any, $1: any, $2: any, $3: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	if (action === "eject") {
		if (this.beaker) {
			this.beaker.loc = this.loc;
			this.beaker = null;
			yield* this.reagents.clear_reagents();
			this.icon_state = "mixer0";
			f.dot = 1;
		}
	} else if (action === "ejectp") {
		if (this.bottle) {
			this.bottle.loc = this.loc;
			this.bottle = null;
			f.dot = 1;
		}
	} else if (action === "transferToBuffer") {
		if (this.beaker) {
			id = rt.at(params, "id");
			if ((amount = text2num(rt.at(params, "amount"))) > 0) {
				yield* this.beaker.reagents.trans_id_to(this, id, amount);
				f.dot = 1;
			} else if (amount == -1) {
				this.useramount = (yield* g.op(f, "Prompt", [33], [null, this.useramount, this.name, "Enter the Amount you want to transfer:", null]));
				if (this.useramount > 0) {
					yield* this.beaker.reagents.trans_id_to(this, id, this.useramount);
					f.dot = 1;
				}
			}
		}
	} else if (action === "transferFromBuffer") {
		id = rt.at(params, "id");
		if ((amount = text2num(rt.at(params, "amount"))) > 0) {
			if (this.mode) {
				yield* this.reagents.trans_id_to(this.beaker, id, amount);
				f.dot = 1;
			} else {
				yield* this.reagents.remove_reagent(id, amount);
				f.dot = 1;
			}
		}
	} else if (action === "toggleMode") {
		this.mode = (!this.mode ? 1 : 0);
		f.dot = 1;
	} else if (action === "createPill") {
		many = rt.at(params, "many");
		if (this.reagents.total_volume == 0) {
			return f.dot;
		}
		if (!this.condi) {
			amount = 1;
			vol_each = min(this.reagents.total_volume, 50);
			if (text2num(many)) {
				if (!(amount = max(0, min(round((yield* g.op(f, "Prompt", [33], [amount, "How many pills?", "Max 10. Buffer content will be split evenly.", f.usr, null]))), 10)))) {
					return f.dot;
				}
				vol_each = min(this.reagents.total_volume / amount, 50);
			}
			if (!(name = (yield* stripped_input(f.usr, "Name:", "Name your pill!", `${this.reagents.get_master_reagent_name()} (${vol_each}u)`, 42))) || !this.reagents.total_volume || !this || !this || this.gc_destroyed || !(yield* f.usr.canUseTopic(this, { be_close: 1 }))) {
				return f.dot;
			}
			i = 0;
			while (i < amount) {
				if (this.bottle && rt.len(f, this.bottle.contents) < this.bottle.storage_slots) {
					_P = (yield* new_(T("/obj/item/weapon/reagent_containers/pill"), this.bottle));
				} else {
					_P = (yield* new_(T("/obj/item/weapon/reagent_containers/pill"), this.loc));
				}
				_P.name = trim(`${name} pill`);
				_P.pixel_x = rand(-7, 7);
				_P.pixel_y = rand(-7, 7);
				yield* this.reagents.trans_to(_P, vol_each);
				i++;
			}
		} else {
			if (!(name_1 = (yield* stripped_input(f.usr, "Name:", "Name your pack!", this.reagents.get_master_reagent_name(), 42))) || !this.reagents.total_volume || !this || !this || this.gc_destroyed || !(yield* f.usr.canUseTopic(this, { be_close: 1 }))) {
				return f.dot;
			}
			(_P_2 = (yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment/pack"), this.loc))).originalname = name_1;
			_P_2.name = trim(`${name_1} pack`);
			_P_2.desc = `A small condiment pack. The label says it contains ${name_1}.`;
			yield* this.reagents.trans_to(_P_2, 10);
		}
		f.dot = 1;
	} else if (action === "createPatch") {
		many = rt.at(params, "many");
		if (this.reagents.total_volume == 0) {
			return f.dot;
		}
		amount = 1;
		vol_each = min(this.reagents.total_volume, 40);
		if (text2num(many)) {
			if (!(amount = max(0, min(round((yield* g.op(f, "Prompt", [33], [amount, "How many patches?", "Max 10. Buffer content will be split evenly.", f.usr, null]))), 10)))) {
				return f.dot;
			}
			vol_each = min(this.reagents.total_volume / amount, 40);
		}
		if (!(name = (yield* stripped_input(f.usr, "Name:", "Name your patch!", `${this.reagents.get_master_reagent_name()} (${vol_each}u)`, 42))) || !this.reagents.total_volume || !this || !this || this.gc_destroyed || !(yield* f.usr.canUseTopic(this, { be_close: 1 }))) {
			return f.dot;
		}
		_P = null;
		i = 0;
		while (i < amount) {
			(_P = (yield* new_(T("/obj/item/weapon/reagent_containers/pill/patch"), this.loc))).name = trim(`${name} patch`);
			_P.pixel_x = rand(-7, 7);
			_P.pixel_y = rand(-7, 7);
			yield* this.reagents.trans_to(_P, vol_each);
			i++;
		}
		f.dot = 1;
	} else if (action === "createBottle") {
		many = rt.at(params, "many");
		if (this.reagents.total_volume == 0) {
			return f.dot;
		}
		if (this.condi) {
			$0 = f.usr;
			$1 = "Name:";
			$2 = "Name your bottle!";
			if (this.reagents.total_volume) {
				$3 = this.reagents.get_master_reagent_name();
			} else {
				$3 = " ";
			}
			if (!(name_1 = (yield* stripped_input($0, $1, $2, $3, 42))) || !this.reagents.total_volume || !this || !this || this.gc_destroyed || !(yield* f.usr.canUseTopic(this, { be_close: 1 }))) {
				return f.dot;
			}
			(_P_2 = (yield* new_(T("/obj/item/weapon/reagent_containers/food/condiment"), this.loc))).originalname = name_1;
			_P_2.name = trim(`${name_1} bottle`);
			yield* this.reagents.trans_to(_P_2, _P_2.volume);
		} else {
			amount_full = 0;
			vol_part = min(this.reagents.total_volume, 30);
			if (text2num(many)) {
				amount_full = round(this.reagents.total_volume / 30);
				vol_part = this.reagents.total_volume % 30;
			}
			$0 = f.usr;
			$1 = "Name:";
			$2 = "Name your bottle!";
			if (this.reagents.total_volume) {
				$3 = this.reagents.get_master_reagent_name();
			} else {
				$3 = " ";
			}
			if (!(name = (yield* stripped_input($0, $1, $2, $3, 42))) || !this.reagents.total_volume || !this || !this || this.gc_destroyed || !(yield* f.usr.canUseTopic(this, { be_close: 1 }))) {
				return f.dot;
			}
			_P = null;
			i = 0;
			while (i < amount_full) {
				(_P = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle"), this.loc))).pixel_x = rand(-7, 7);
				_P.pixel_y = rand(-7, 7);
				_P.name = trim(`${name} bottle`);
				yield* this.reagents.trans_to(_P, 30);
				i++;
			}
			if (vol_part) {
				(_P = (yield* new_(T("/obj/item/weapon/reagent_containers/glass/bottle"), this.loc))).name = trim(`${name} bottle`);
				yield* this.reagents.trans_to(_P, vol_part);
			}
		}
		f.dot = 1;
	} else if (action === "analyze") {
		if (R = rt.index(GLOB.chemical_reagents_list, rt.at(params, "id"))) {
			state = "Unknown";
			if (rt.initial(f, R, "reagent_state") == 1) {
				state = "Solid";
			} else if (rt.initial(f, R, "reagent_state") == 2) {
				state = "Liquid";
			} else if (rt.initial(f, R, "reagent_state") == 3) {
				state = "Gas";
			}
			_P_2 = 3;
			_T = rt.initial(f, R, "metabolization_rate") * 20;
			this.analyzeVars = rt.alist(f, ["name", rt.initial(f, R, "name"), "state", state, "color", rt.initial(f, R, "color"), "description", rt.initial(f, R, "description"), "metaRate", _T, "overD", rt.initial(f, R, "overdose_threshold"), "addicD", rt.initial(f, R, "addiction_threshold")]);
			this.screen = "analyze";
			return f.dot;
		}
	} else if (action === "goScreen") {
		this.screen = rt.at(params, "screen");
		f.dot = 1;
	}
	return f.dot;
}, true);
