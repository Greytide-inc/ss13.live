// Based on /tg/station's code/modules/research/rdconsole.dm.
import * as rt from "#runtime";
import type { Frame, Value } from "#runtime";
const { T, g, fmt } = rt;


rt.type(10425, "/obj/machinery/computer/rdconsole", "/obj/machinery/computer", {
	files: null,
	t_disk: null,
	d_disk: null,
	linked_destroy: null,
	linked_lathe: null,
	linked_imprinter: null,
	screen: 1,
	id: 0,
	sync: 1,
	first_use: 1,
	selected_category: null,
	matching_designs: null,
	disk_slot_selected: 0,
	icon_screen: "rdcomp",
	icon_keyboard: "rd_key",
	circuit: rt.typePath("/obj/item/weapon/circuitboard/computer/rdconsole"),
	name: "R&D Console",
	req_access: null,
});

// rdconsole.dm:53
rt.def("/obj/machinery/computer/rdconsole/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.matching_designs = list();

	this.req_access = list(7);
	return f.dot;
});

// rdconsole.dm:58
rt.def("/proc/CallTechName", function CallTechName(f: Frame, ID: Value) {
	let tech: Value = null;
	if (rt.index(GLOB.tech_list, ID)) {
		return (tech = rt.index(GLOB.tech_list, ID)).name;
	}
	return "ERROR: Report This";
});

// rdconsole.dm:64
rt.def("/proc/CallMaterialName", function CallMaterialName(f: Frame, ID: Value) {
	let material: Value = null, reagent: Value = null;
	if (copytext(ID, 1, 2) == "$" && rt.index(GLOB.materials_list, ID)) {
		return (material = rt.index(GLOB.materials_list, ID)).name;
	} else if (rt.index(GLOB.chemical_reagents_list, ID)) {
		return (reagent = rt.index(GLOB.chemical_reagents_list, ID)).name;
	}
	return "ERROR: Report This";
});

// rdconsole.dm:74
rt.def("/obj/machinery/computer/rdconsole/proc/SyncRDevices", function SyncRDevices(f: Frame) {
	let D: Value = null;
	for (D of each(oview(3, this), T("/obj/machinery/r_n_d"))) {
		if (D.linked_console !== null || D.disabled || D.panel_open) {
			continue;
		}
		if (rt.istype(D, T("/obj/machinery/r_n_d/destructive_analyzer"))) {
			if (this.linked_destroy === null) {
				this.linked_destroy = D;
				D.linked_console = this;
			}
		} else if (rt.istype(D, T("/obj/machinery/r_n_d/protolathe"))) {
			if (this.linked_lathe === null) {
				this.linked_lathe = D;
				D.linked_console = this;
			}
		} else if (rt.istype(D, T("/obj/machinery/r_n_d/circuit_imprinter"))) {
			if (this.linked_imprinter === null) {
				this.linked_imprinter = D;
				D.linked_console = this;
			}
		}
	}
	this.first_use = 0;
	return f.dot;
});

// rdconsole.dm:93
rt.def("/obj/machinery/computer/rdconsole/proc/griefProtection", function* griefProtection(f: Frame) {
	let C: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	for (C of each(GLOB.machines, T("/obj/machinery/r_n_d/server/centcom"))) {
		v = null;
		for (v of each(this.files.known_tech)) {
			_T = rt.index(this.files.known_tech, v);
			yield* C.files.AddTech2Known(_T);
		}
		v = null;
		for (v of each(this.files.known_designs)) {
			D = rt.index(this.files.known_designs, v);
			C.files.AddDesign2Known(D);
		}
		yield* C.files.RefreshResearch();
	}
	return f.dot;
}, true);

// rdconsole.dm:104
rt.def("/obj/machinery/computer/rdconsole/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	this.files = (yield* new_(T("/datum/research"), this));
	this.matching_designs = list();
	if (this.id) return f.dot;
	fix_noid_research_servers();
	return f.dot;
}, true);

// rdconsole.dm:118
rt.def("/obj/machinery/computer/rdconsole/proc/attackby", function* attackby(f: Frame, D: Value, user: Value, params: Value) {
	if (rt.istype(D, T("/obj/item/weapon/disk"))) {
		if (this.t_disk || this.d_disk) {
			to_chat(user, "A disk is already loaded into the machine.");
			return f.dot;
		}
		if (rt.istype(D, T("/obj/item/weapon/disk/tech_disk"))) {
			this.t_disk = D;
		} else if (rt.istype(D, T("/obj/item/weapon/disk/design_disk"))) {
			this.d_disk = D;
		} else {
			to_chat(user, "<span class='danger'>Machine cannot accept disks in that format.</span>");
			return f.dot;
		}
		if (!(yield* user.drop_item())) {
			return f.dot;
		}
		D.loc = this;
		to_chat(user, "<span class='notice'>You add the disk to the machine!</span>");
	} else if (!(this.linked_destroy && this.linked_destroy.busy) && !(this.linked_lathe && this.linked_lathe.busy) && !(this.linked_imprinter && this.linked_imprinter.busy)) {
		f.dot = (yield* parent_proc());
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// rdconsole.dm:141
rt.def("/obj/machinery/computer/rdconsole/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	this.unlink_device("destroy");
	this.unlink_device("lathe");
	this.unlink_device("imprinter");
	parent_proc();
	return f.dot;
});

// tg_js: the one way the console lets go of a linked machine (Disconnect, deconstruction). A machine is idle or busy with
// this console's job; letting go cancels the job, so the machine goes back to idle (tg left `busy` set, and the job's end,
// finding no link, never cleared it: the machine refused all use for the rest of the round).
rt.def("/obj/machinery/computer/rdconsole/proc/unlink_device", function unlink_device(f: Frame, which: Value) {
	let D: Value = null;
	if (which === "destroy") {
		D = this.linked_destroy;
		this.linked_destroy = null;
	} else if (which === "lathe") {
		D = this.linked_lathe;
		this.linked_lathe = null;
	} else if (which === "imprinter") {
		D = this.linked_imprinter;
		this.linked_imprinter = null;
	}
	if (D) {
		D.busy = 0;
		D.linked_console = null;
	}
	return f.dot;
});

// rdconsole.dm:153
rt.def("/obj/machinery/computer/rdconsole/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (this.emagged) return f.dot;
	playsound(this.loc, rt.rsc("sound/effects/sparks4.ogg"), 75, 1);
	this.emagged = 1;
	to_chat(user, "<span class='notice'>You disable the security protocols</span>");
	return f.dot;
});

// rdconsole.dm:159
rt.def("/obj/machinery/computer/rdconsole/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let temp_screen: Value = null, n: Value = null, wait: Value = null, D: Value = null, tech: Value = null, i: Value = null, slot: Value = null, _T: Value = null, D_1: Value = null, autolathe_friendly: Value = null, x: Value = null, temp_tech: Value = null, cancontinue: Value = null, _T_2: Value = null, choice: Value = null, KT: Value = null, material: Value = null, I: Value = null, M: Value = null, S: Value = null, S_0: Value = null, server_processed: Value = null, v: Value = null, _T_3: Value = null, D_3: Value = null, being_built: Value = null, amount: Value = null, coeff: Value = null, power: Value = null, old_screen: Value = null, M_5: Value = null, key: Value = null, g2g: Value = null, enough_materials: Value = null, efficient_mats: Value = null, MAT: Value = null, R: Value = null, _P: Value = null, already_logged: Value = null, i_11: Value = null, new_item: Value = null, coeff_1: Value = null, power_2: Value = null, old_screen_3: Value = null, M_4: Value = null, g2g_4: Value = null, enough_materials_5: Value = null, efficient_mats_6: Value = null, MAT_7: Value = null, R_7: Value = null, _P_7: Value = null, new_item_8: Value = null, choice_0: Value = null, compare: Value = null, v_1: Value = null;
	let $e: any;
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.add_fingerprint(f.usr);
	yield* f.usr.set_machine(this);
	if (rt.at(href_list, "disk_slot")) {
		this.disk_slot_selected = text2num(rt.at(href_list, "disk_slot"));
	}
	if (rt.at(href_list, "menu")) {
		this.screen = (temp_screen = text2num(rt.at(href_list, "menu")));
	}
	if (rt.at(href_list, "category")) {
		this.selected_category = rt.at(href_list, "category");
	} else if (rt.at(href_list, "updt_tech")) {
		n = text2num(rt.at(href_list, "updt_tech"));
		this.screen = 0;
		wait = 50;
		if (!n) {
			wait = 0;
			for (D of each(this.t_disk.tech_stored)) {
				if (D) {
					wait += 50;
				}
			}
		}
		rt.spawnTail(f, wait, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:184", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "clear_tech")) {
		if (this.t_disk) {
			if (!(n = text2num(rt.at(href_list, "clear_tech")))) {
				rt.forRange(f, 0, 1, this.t_disk.max_tech_stored, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					rt.setAt(this.t_disk.tech_stored, i, null);
				}
				rt.endFor(f, 0);
			} else {
				rt.setAt(this.t_disk.tech_stored, n, null);
			}
		}
	} else if (rt.at(href_list, "eject_tech")) {
		if (this.t_disk) {
			this.t_disk.loc = this.loc;
			this.t_disk = null;
		}
		this.screen = 1;
	} else if (rt.at(href_list, "copy_tech")) {
		slot = text2num(rt.at(href_list, "copy_tech"));
		if (_T = rt.index(this.files.known_tech, rt.at(href_list, "copy_tech_ID"))) {
			rt.setAt(this.t_disk.tech_stored, slot, (yield* _T.copy()));
		}
		this.screen = 1.2;
	} else if (rt.at(href_list, "updt_design")) {
		n = text2num(rt.at(href_list, "updt_design"));
		this.screen = 0;
		wait = 50;
		if (!n) {
			wait = 0;
			D = null;
			for (D of each(this.d_disk.blueprints)) {
				if (D) {
					wait += 50;
				}
			}
		}
		rt.spawnTail(f, wait, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:226", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "clear_design")) {
		if (this.d_disk) {
			if (!(n = text2num(rt.at(href_list, "clear_design")))) {
				i = null;
				rt.forRange(f, 0, 1, this.d_disk.max_blueprints, 1);
				while (($e = rt.next(f, 0)) !== undefined) {
					i = $e;
					rt.setAt(this.d_disk.blueprints, i, null);
				}
				rt.endFor(f, 0);
			} else {
				rt.setAt(this.d_disk.blueprints, n, null);
			}
		}
	} else if (rt.at(href_list, "eject_design")) {
		if (this.d_disk) {
			this.d_disk.loc = this.loc;
			this.d_disk = null;
		}
		this.screen = 1;
	} else if (rt.at(href_list, "copy_design")) {
		slot = text2num(rt.at(href_list, "copy_design"));
		if (D_1 = rt.index(this.files.known_designs, rt.at(href_list, "copy_design_ID"))) {
			autolathe_friendly = 1;
			if (rt.len(f, D_1.reagents_list)) {
				autolathe_friendly = 0;
				D_1.category -= "Imported";
			} else {
				for (x of each(D_1.materials)) {
					if (!rt.isIn(f, x, list("$metal", "$glass"))) {
						autolathe_friendly = 0;
						D_1.category -= "Imported";
					}
				}
			}
			if (rt.bitAnd(D_1.build_type, 14)) {
				D_1.build_type = autolathe_friendly ? rt.bitOr(D_1.build_type, 4) : D_1.build_type;
				(rt.modField(f, D_1, "category", "Imported", rt.bitOr));
			}
			rt.setAt(this.d_disk.blueprints, slot, D_1);
		}
		this.screen = 1.4;
	} else if (rt.at(href_list, "eject_item")) {
		if (this.linked_destroy) {
			if (this.linked_destroy.busy) {
				to_chat(f.usr, "<span class='danger'>The destructive analyzer is busy at the moment.</span>");
			} else if (this.linked_destroy.loaded_item) {
				yield* this.linked_destroy.loaded_item.forceMove(this.linked_destroy.loc);
				this.linked_destroy.loaded_item = null;
				this.linked_destroy.icon_state = "d_analyzer";
				this.screen = 1;
			}
		}
	} else if (rt.at(href_list, "deconstruct")) {
		if (!this.linked_destroy || this.linked_destroy.busy || !this.linked_destroy.loaded_item) {
			yield* this.updateUsrDialog();
			return f.dot;
		}
		temp_tech = this.linked_destroy.ConvertReqString2List(this.linked_destroy.loaded_item.origin_tech);
		cancontinue = 0;
		for (_T_2 of each(temp_tech)) {
			if (this.files.IsTechHigher(_T_2, rt.index(temp_tech, _T_2))) {
				cancontinue = 1;
				break;
			}
		}
		if (!cancontinue) {
			if ((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "This item does not raise tech levels. Proceed destroying loaded item anyway?", list("Proceed", "Cancel")]))) == "Cancel" || !this.linked_destroy || !this.linked_destroy.loaded_item) {
				return f.dot;
			}
		}
		this.linked_destroy.busy = 1;
		this.screen = 0.1;
		yield* this.updateUsrDialog();
		flick("d_analyzer_process", this.linked_destroy);
		rt.spawnTail(f, 24, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:302", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "lock")) {
		if (yield* this.allowed(f.usr)) {
			this.screen = text2num(rt.at(href_list, "lock"));
		} else {
			to_chat(f.usr, "Unauthorized Access.");
		}
	} else if (rt.at(href_list, "sync")) {
		this.screen = 0;
		if (!this.sync) {
			to_chat(f.usr, "<span class='danger'>You must connect to the network first!</span>");
		} else {
			yield* this.griefProtection();
			rt.spawnTail(f, 30, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:351", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
		}
	} else if (rt.at(href_list, "togglesync")) {
		this.sync = (!this.sync ? 1 : 0);
	} else if (rt.at(href_list, "build")) {
		being_built = rt.index(this.files.known_designs, rt.at(href_list, "build"));
		amount = text2num(rt.at(href_list, "amount"));
		if (rt.len(f, being_built.make_reagents)) {
			return 0;
		}
		if (!this.linked_lathe || !being_built || !amount) {
			yield* this.updateUsrDialog();
			return f.dot;
		}
		if (this.linked_lathe.busy) {
			to_chat(f.usr, "<span class='danger'>Protolathe is busy at the moment.</span>");
			return f.dot;
		}
		coeff = this.linked_lathe.efficiency_coeff;
		power = 1000;
		old_screen = this.screen;
		amount = max(1, min(10, amount));
		for (M_5 of each(being_built.materials)) {
			power += round(rt.index(being_built.materials, M_5) * amount / 5);
		}
		power = max(3000, power);
		this.screen = 0.3;
		key = f.usr.key;
		if (!rt.bitAnd(being_built.build_type, 2)) {
			message_admins(`Protolathe exploit attempted by ${key_name(f.usr, f.usr.client)}!`);
			yield* this.updateUsrDialog();
			return f.dot;
		}
		g2g = 1;
		enough_materials = 1;
		this.linked_lathe.busy = 1;
		flick("protolathe_n", this.linked_lathe);
		yield* this.use_power(power);
		efficient_mats = list();
		for (MAT of each(being_built.materials)) {
			rt.setAt(efficient_mats, MAT, rt.index(being_built.materials, MAT) * coeff);
		}
		if (!this.linked_lathe.materials.has_materials(efficient_mats, amount)) {
			yield* this.linked_lathe.say("Not enough materials to complete prototype.");
			enough_materials = 0;
			g2g = 0;
		} else {
			for (R of each(being_built.reagents_list)) {
				if (!this.linked_lathe.reagents.has_reagent(R, rt.index(being_built.reagents_list, R) * coeff)) {
					yield* this.linked_lathe.say("Not enough reagents to complete prototype.");
					enough_materials = 0;
					g2g = 0;
				}
			}
		}
		if (enough_materials) {
			this.linked_lathe.materials.use_amount(efficient_mats, amount);
			R = null;
			for (R of each(being_built.reagents_list)) {
				yield* this.linked_lathe.reagents.remove_reagent(R, rt.index(being_built.reagents_list, R) * coeff);
			}
		}
		_P = being_built.build_path;
		coeff *= being_built.lathe_time_factor;
		rt.spawnTail(f, 32 * coeff * amount ** 0.8, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:443", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "imprint")) {
		being_built = rt.index(this.files.known_designs, rt.at(href_list, "imprint"));
		if (!this.linked_imprinter || !being_built) {
			yield* this.updateUsrDialog();
			return f.dot;
		}
		if (this.linked_imprinter.busy) {
			to_chat(f.usr, "<span class='danger'>Circuit Imprinter is busy at the moment.</span>");
			yield* this.updateUsrDialog();
			return f.dot;
		}
		coeff_1 = this.linked_imprinter.efficiency_coeff;
		power_2 = 1000;
		old_screen_3 = this.screen;
		for (M_4 of each(being_built.materials)) {
			power_2 += round(rt.index(being_built.materials, M_4) / 5);
		}
		power_2 = max(4000, power_2);
		this.screen = 0.4;
		if (!rt.bitAnd(being_built.build_type, 1)) {
			message_admins(`Circuit imprinter exploit attempted by ${key_name(f.usr, f.usr.client)}!`);
			yield* this.updateUsrDialog();
			return f.dot;
		}
		g2g_4 = 1;
		enough_materials_5 = 1;
		this.linked_imprinter.busy = 1;
		flick("circuit_imprinter_ani", this.linked_imprinter);
		yield* this.use_power(power_2);
		efficient_mats_6 = list();
		for (MAT_7 of each(being_built.materials)) {
			rt.setAt(efficient_mats_6, MAT_7, rt.index(being_built.materials, MAT_7) / coeff_1);
		}
		if (!this.linked_imprinter.materials.has_materials(efficient_mats_6)) {
			yield* this.linked_imprinter.say("Not enough materials to complete prototype.");
			enough_materials_5 = 0;
			g2g_4 = 0;
		} else {
			for (R_7 of each(being_built.reagents_list)) {
				if (!this.linked_imprinter.reagents.has_reagent(R_7, rt.index(being_built.reagents_list, R_7) / coeff_1)) {
					yield* this.linked_imprinter.say("Not enough reagents to complete prototype.");
					enough_materials_5 = 0;
					g2g_4 = 0;
				}
			}
		}
		if (enough_materials_5) {
			this.linked_imprinter.materials.use_amount(efficient_mats_6);
			R_7 = null;
			for (R_7 of each(being_built.reagents_list)) {
				yield* this.linked_imprinter.reagents.remove_reagent(R_7, rt.index(being_built.reagents_list, R_7) / coeff_1);
			}
		}
		_P_7 = being_built.build_path;
		rt.spawnTail(f, 16, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:516", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "disposeP") && this.linked_lathe) {
		yield* this.linked_lathe.reagents.del_reagent(rt.at(href_list, "disposeP"));
	} else if (rt.at(href_list, "disposeallP") && this.linked_lathe) {
		yield* this.linked_lathe.reagents.clear_reagents();
	} else if (rt.at(href_list, "ejectsheet") && this.linked_lathe) {
		yield* this.linked_lathe.materials.retrieve_sheets(text2num(rt.at(href_list, "eject_amt")), rt.at(href_list, "ejectsheet"));
	} else if (rt.at(href_list, "disposeI") && this.linked_imprinter) {
		yield* this.linked_imprinter.reagents.del_reagent(rt.at(href_list, "disposeI"));
	} else if (rt.at(href_list, "disposeallI") && this.linked_imprinter) {
		yield* this.linked_imprinter.reagents.clear_reagents();
	} else if (rt.at(href_list, "imprinter_ejectsheet") && this.linked_imprinter) {
		yield* this.linked_imprinter.materials.retrieve_sheets(text2num(rt.at(href_list, "eject_amt")), rt.at(href_list, "imprinter_ejectsheet"));
	} else if (rt.at(href_list, "find_device")) {
		this.screen = 0;
		rt.spawnTail(f, 20, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:553", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
	} else if (rt.at(href_list, "disconnect")) {
		this.unlink_device(rt.at(href_list, "disconnect"));
	} else if (rt.at(href_list, "reset")) {
		yield* this.griefProtection();
		if ((choice_0 = (yield* alert("R&D Console Database Reset", "Are you sure you want to reset the R&D console's database? Data lost cannot be recovered.", "Continue", "Cancel"))) == "Continue" && f.usr.canUseTopic(this)) {
			message_admins(fmt("＀ reset ％！'s database", [key_name_admin(f.usr), this.name]));
			log_game(fmt("＀ reset ％！'s database", [key_name_admin(f.usr), this.name]));
			this.screen = 0;
			yield* qdel(this.files);
			this.files = (yield* new_(T("/datum/research"), this));
			rt.spawnTail(f, 20, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:579", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
		}
	} else if (rt.at(href_list, "search")) {
		this.matching_designs.Cut();
		if (rt.at(href_list, "type") == "proto") {
			compare = 2;
			this.screen = 3.17;
		} else {
			compare = 1;
			this.screen = 4.17;
		}
		for (v_1 of each(this.files.known_designs)) {
			if (!rt.bitAnd((D = rt.index(this.files.known_designs, v_1)).build_type, compare)) {
				continue;
			}
			if (findtext(D.name, rt.at(href_list, "to_search"))) {
				this.matching_designs.Add(D);
			}
		}
	}
	yield* this.updateUsrDialog();
	return f.dot;
}, true);

// a spawn(20) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:579", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	this.screen = 1.6;
	yield* this.updateUsrDialog();
	return null;
});

// a spawn(20) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:553", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	this.SyncRDevices();
	this.screen = 1.7;
	yield* this.updateUsrDialog();
	return null;
});

// a spawn(16) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:516", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	if (this.linked_imprinter) {
		if (g2g_4) {
			(new_item_8 = (yield* new_(_P_7, this))).loc = this.linked_imprinter.loc;
			new_item_8.materials = (yield* efficient_mats_6.Copy());
		}
		this.screen = old_screen_3;
		this.linked_imprinter.busy = 0;
	} else {
		yield* this.say("Circuit Imprinter connection failed. Production halted.");
		this.screen = 1;
	}
	yield* this.updateUsrDialog();
	return null;
});

// a spawn(multiply(multiply(32, live(coeff)), rt.power(live(amount), 0.800000011920929))) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:443", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	if (this.linked_lathe) {
		if (g2g) {
			already_logged = 0;
			i_11 = null;
			i_11 = 0;
			while (i_11 < amount) {
				if ((new_item = (yield* new_(_P, this))).type == T("/obj/item/weapon/storage/backpack/holding")) {
					new_item.investigate_log(`built by ${key}`, "singulo");
				}
				if (!rt.istype(new_item, T("/obj/item/stack/sheet")) && !rt.istype(new_item, T("/obj/item/weapon/ore/bluespace_crystal"))) {
					new_item.materials = (yield* efficient_mats.Copy());
				}
				new_item.loc = this.linked_lathe.loc;
				if (!already_logged) {
					already_logged = 1;
				}
				i_11++;
			}
		}
		this.screen = old_screen;
		this.linked_lathe.busy = 0;
	} else {
		yield* this.say("Protolathe connection failed. Production halted.");
		this.screen = 1;
	}
	yield* this.updateUsrDialog();
	return null;
});

// a spawn(30) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:351", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	if (this) {
		S_0 = null;
		for (S_0 of each(GLOB.machines, T("/obj/machinery/r_n_d/server"))) {
			server_processed = 0;
			if (S_0.disabled) {
				continue;
			}
			if (rt.isIn(f, this.id, S_0.id_with_upload) || rt.istype(S_0, T("/obj/machinery/r_n_d/server/centcom"))) {
				v = null;
				for (v of each(this.files.known_tech)) {
					_T_3 = rt.index(this.files.known_tech, v);
					yield* S_0.files.AddTech2Known(_T_3);
				}
				v = null;
				for (v of each(this.files.known_designs)) {
					D_3 = rt.index(this.files.known_designs, v);
					S_0.files.AddDesign2Known(D_3);
				}
				yield* S_0.files.RefreshResearch();
				server_processed = 1;
			}
			if (rt.isIn(f, this.id, S_0.id_with_download) && !rt.istype(S_0, T("/obj/machinery/r_n_d/server/centcom")) || S_0.hacked) {
				v = null;
				for (v of each(S_0.files.known_tech)) {
					_T_3 = rt.index(S_0.files.known_tech, v);
					yield* this.files.AddTech2Known(_T_3);
				}
				v = null;
				for (v of each(S_0.files.known_designs)) {
					D_3 = rt.index(S_0.files.known_designs, v);
					this.files.AddDesign2Known(D_3);
				}
				yield* this.files.RefreshResearch();
				server_processed = 1;
			}
			if (!rt.istype(S_0, T("/obj/machinery/r_n_d/server/centcom")) && server_processed) {
				yield* S_0.produce_heat(100);
			}
		}
		this.screen = 1.6;
		yield* this.updateUsrDialog();
	}
	return null;
});

// a spawn(24) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:302", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	if (this.linked_destroy) {
		this.linked_destroy.busy = 0;
		if (!this.linked_destroy.loaded_item) {
			this.screen = 1;
			return f.dot;
		}
		_T_2 = null;
		for (_T_2 of each(temp_tech)) {
			KT = rt.index(this.files.known_tech, _T_2);
			this.files.UpdateTech(_T_2, rt.index(temp_tech, _T_2));
		}
		if (this.linked_lathe) {
			material = null;
			for (material of each(this.linked_destroy.loaded_item.materials)) {
				this.linked_lathe.materials.insert_amount(min(this.linked_lathe.materials.max_amount - this.linked_lathe.materials.total_amount, rt.index(this.linked_destroy.loaded_item.materials, material) * (this.linked_destroy.decon_mod / 10)), material);
			}
		}
		this.linked_destroy.loaded_item = null;
		I = null;
		for (I of each(this.linked_destroy.contents, T("/obj"))) {
			M = null;
			for (M of each(I.contents, T("/mob"))) {
				yield* M.death();
			}
			if (rt.istype(I, T("/obj/item/stack/sheet"))) {
				if ((S = I).amount > 1) {
					S.amount--;
					this.linked_destroy.loaded_item = S;
				} else {
					yield* qdel(S);
					this.linked_destroy.icon_state = "d_analyzer";
				}
			} else if (!rt.isIn(f, I, this.linked_destroy.component_parts)) {
				yield* qdel(I);
				this.linked_destroy.icon_state = "d_analyzer";
			}
		}
	}
	this.screen = 1;
	yield* this.use_power(250);
	yield* this.updateUsrDialog();
	return null;
});

// a spawn(live(wait)) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:226", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	this.screen = 1.4;
	if (this.d_disk) {
		if (!n) {
			D = null;
			for (D of each(this.d_disk.blueprints)) {
				if (D) {
					this.files.AddDesign2Known(D);
				}
			}
		} else {
			this.files.AddDesign2Known(rt.index(this.d_disk.blueprints, n));
		}
		yield* this.updateUsrDialog();
		yield* this.griefProtection();
	}
	return null;
});

// a spawn(live(wait)) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:184", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	this.screen = 1.2;
	if (this.t_disk) {
		if (!n) {
			tech = null;
			for (tech of each(this.t_disk.tech_stored)) {
				yield* this.files.AddTech2Known(tech);
			}
		} else {
			yield* this.files.AddTech2Known(rt.index(this.t_disk.tech_stored, n));
		}
		yield* this.updateUsrDialog();
		yield* this.griefProtection();
	}
	return null;
});

// rdconsole.dm:607
rt.def("/obj/machinery/computer/rdconsole/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	if (yield* parent_proc()) {
		return f.dot;
	}
	yield* this.interact(user);
	return f.dot;
}, true);

// rdconsole.dm:612
rt.def("/obj/machinery/computer/rdconsole/proc/interact", function* interact(f: Frame, user: Value) {
	let v: Value = null, _T: Value = null, i: Value = null, tech: Value = null, D: Value = null, all_mats: Value = null, M: Value = null, temp_tech: Value = null, F: Value = null, coeff: Value = null, v_2: Value = null, D_3: Value = null, temp_material: Value = null, c: Value = null, t: Value = null, all_materials: Value = null, M_8: Value = null, temp_material_3: Value = null, c_4: Value = null, t_5: Value = null, all_materials_6: Value = null, M_7: Value = null, mat_id: Value = null, M_2: Value = null, R: Value = null, temp_materials: Value = null, check_materials: Value = null, temp_materials_3: Value = null, check_materials_4: Value = null, all_materials_5: Value = null, M_6: Value = null, popup: Value = null;
	let $e: any;
	yield* user.set_machine(this);
	if (this.first_use) {
		this.SyncRDevices();
	}
	let dat: Value = "";
	yield* this.files.RefreshResearch();
	if (rt.inRange(this.screen, 2, 2.9)) {
		if (this.screen != 2.3) {
			if (this.linked_destroy === null) {
				this.screen = 2;
			} else if (this.linked_destroy.loaded_item === null) {
				this.screen = 2.1;
			} else {
				this.screen = 2.2;
			}
		}
	} else if (rt.inRange(this.screen, 3, 3.9)) {
		if (this.linked_lathe === null) {
			this.screen = 3;
		}
	} else if (rt.inRange(this.screen, 4, 4.9)) {
		if (this.linked_imprinter === null) {
			this.screen = 4;
		}
	}
	if (this.screen === 0) {
		dat += "<div class='statusDisplay'>Updating Database....</div>";
	} else if (this.screen === 0.1) {
		dat += "<div class='statusDisplay'>Processing and Updating Database...</div>";
	} else if (this.screen === 0.2) {
		dat += "<div class='statusDisplay'>SYSTEM LOCKED</div>";
		dat += fmt("<A href='?src=＃;lock=1.6'>Unlock</A>", [this]);
	} else if (this.screen === 0.3) {
		dat += "<div class='statusDisplay'>Constructing Prototype. Please Wait...</div>";
	} else if (this.screen === 0.4) {
		dat += "<div class='statusDisplay'>Imprinting Circuit. Please Wait...</div>";
	} else if (this.screen === 1) {
		dat += "<div class='statusDisplay'>";
		dat += "<h3>Main Menu:</h3><BR>";
		dat += fmt("<A href='?src=＃;menu=1.1'>Current Research Levels</A><BR>", [this]);
		if (this.t_disk) {
			dat += fmt("<A href='?src=＃;menu=1.2'>Disk Operations</A><BR>", [this]);
		} else if (this.d_disk) {
			dat += fmt("<A href='?src=＃;menu=1.4'>Disk Operations</A><BR>", [this]);
		} else {
			dat += "<span class='linkOff'>Disk Operations</span><BR>";
		}
		if (this.linked_destroy) {
			dat += fmt("<A href='?src=＃;menu=2.2'>Destructive Analyzer Menu</A><BR>", [this]);
		} else {
			dat += "<span class='linkOff'>Destructive Analyzer Menu</span><BR>";
		}
		if (this.linked_lathe) {
			dat += fmt("<A href='?src=＃;menu=3.1'>Protolathe Construction Menu</A><BR>", [this]);
		} else {
			dat += "<span class='linkOff'>Protolathe Construction Menu</span><BR>";
		}
		if (this.linked_imprinter) {
			dat += fmt("<A href='?src=＃;menu=4.1'>Circuit Construction Menu</A><BR>", [this]);
		} else {
			dat += "<span class='linkOff'>Circuit Construction Menu</span><BR>";
		}
		dat += fmt("<A href='?src=＃;menu=1.6'>Settings</A>", [this]);
		dat += "</div>";
	} else if (this.screen === 1.1) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += "<h3>Current Research Levels:</h3><BR><div class='statusDisplay'>";
		for (v of each(this.files.known_tech)) {
			if ((_T = rt.index(this.files.known_tech, v)).level <= 0) {
				continue;
			}
			dat += `${_T.name}<BR>`;
			dat += `* Level: ${_T.level}<BR>`;
			dat += `* Summary: ${_T.desc}<HR>`;
		}
		dat += "</div>";
	} else if (this.screen === 1.2) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [this]);
		dat += fmt("Disk Operations: <A href='?src=＃;clear_tech=0'>Clear Disk</A><A href='?src=＃;updt_tech=0'>Upload All</A><A href='?src=＃;eject_tech=1'>Eject Disk</A>", [this, this, this]);
		rt.forRange(f, 0, 1, this.t_disk.max_tech_stored, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dat += "<div class='statusDisplay'>";
			if (rt.index(this.t_disk.tech_stored, i)) {
				dat += `Name: ${(tech = rt.index(this.t_disk.tech_stored, i)).name}<BR>`;
				dat += `Level: ${tech.level}<BR>`;
				dat += `Description: ${tech.desc}<BR>`;
				dat += fmt("Operations: <A href='?src=＃;updt_tech=＀'>Upload to Database</A><A href='?src=＃;clear_tech=＀'>Clear Slot</A>", [this, i, this, i]);
			} else {
				dat += fmt("Empty Slot<BR>Operations: <A href='?src=＃;menu=1.3;disk_slot=＀'>Load Tech to Slot</A>", [this, i]);
			}
			dat += "</div>";
		}
		rt.endFor(f, 0);
	} else if (this.screen === 1.3) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=1.2'>Return to Disk Operations</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Load Technology to Disk:</h3><BR>";
		v = null;
		for (v of each(this.files.known_tech)) {
			if ((_T = rt.index(this.files.known_tech, v)).level <= 0) {
				continue;
			}
			dat += `${_T.name}`;
			dat += fmt("<A href='?src=＃;copy_tech=＀;copy_tech_ID=＀'>Copy to Disk</A><BR>", [this, this.disk_slot_selected, _T.id]);
		}
		dat += "</div>";
	} else if (this.screen === 1.4) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [this]);
		dat += fmt("Disk Operations: <A href='?src=＃;clear_design=0'>Clear Disk</A><A href='?src=＃;updt_design=0'>Upload All</A><A href='?src=＃;eject_design=1'>Eject Disk</A>", [this, this, this]);
		i = null;
		rt.forRange(f, 0, 1, this.d_disk.max_blueprints, 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dat += "<div class='statusDisplay'>";
			if (rt.index(this.d_disk.blueprints, i)) {
				dat += `Name: ${(D = rt.index(this.d_disk.blueprints, i)).name}<BR>`;
				if (D.build_type) {
					dat += "Lathe Types:<BR>";
					if (rt.bitAnd(D.build_type, 1)) {
						dat += "Circuit Imprinter<BR>";
					}
					if (rt.bitAnd(D.build_type, PROTOLATHE)) {
						dat += "Protolathe<BR>";
					}
					if (rt.bitAnd(D.build_type, AUTOLATHE)) {
						dat += "Autolathe<BR>";
					}
					if (rt.bitAnd(D.build_type, MECHFAB)) {
						dat += "Exosuit Fabricator<BR>";
					}
					if (rt.bitAnd(D.build_type, BIOGENERATOR)) {
						dat += "Biogenerator<BR>";
					}
					if (rt.bitAnd(D.build_type, LIMBGROWER)) {
						dat += "Limbgrower<BR>";
					}
					if (rt.bitAnd(D.build_type, SMELTER)) {
						dat += "Smelter<BR>";
					}
				}
				dat += "Required Materials:<BR>";
				all_mats = D.materials + D.reagents_list;
				M = null;
				for (M of each(all_mats)) {
					dat += `* ${CallMaterialName(M)} x ${rt.index(all_mats, M)}<BR>`;
				}
				dat += fmt("Operations: <A href='?src=＃;updt_design=＀'>Upload to Database</A> <A href='?src=＃;clear_design=＀'>Clear Slot</A>", [this, i, this, i]);
			} else {
				dat += fmt("Empty Slot<BR>Operations: <A href='?src=＃;menu=1.5;disk_slot=＀'>Load Design to Slot</A>", [this, i]);
			}
			dat += "</div>";
		}
		rt.endFor(f, 0);
	} else if (this.screen === 1.5) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=1.4'>Return to Disk Operations</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Load Design to Disk:</h3><BR>";
		v = null;
		for (v of each(this.files.known_designs)) {
			dat += `${(D = rt.index(this.files.known_designs, v)).name} `;
			dat += fmt("<A href='?src=＃;copy_design=＀;copy_design_ID=＀'>Copy to Disk</A><BR>", [this, this.disk_slot_selected, D.id]);
		}
		dat += "</div>";
	} else if (this.screen === 1.6) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><div class='statusDisplay'>", [this]);
		dat += "<h3>R&D Console Setting:</h3><BR>";
		if (this.sync) {
			dat += fmt("<A href='?src=＃;sync=1'>Sync Database with Network</A><BR>", [this]);
			dat += "<span class='linkOn'>Connect to Research Network</span><BR>";
			dat += fmt("<A href='?src=＃;togglesync=1'>Disconnect from Research Network</A><BR>", [this]);
		} else {
			dat += "<span class='linkOff'>Sync Database with Network</span><BR>";
			dat += fmt("<A href='?src=＃;togglesync=1'>Connect to Research Network</A><BR>", [this]);
			dat += "<span class='linkOn'>Disconnect from Research Network</span><BR>";
		}
		dat += fmt("<A href='?src=＃;menu=1.7'>Device Linkage Menu</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;lock=0.2'>Lock Console</A><BR>", [this]);
		dat += fmt("<A href='?src=＃;reset=1'>Reset R&D Database</A></div>", [this]);
	} else if (this.screen === 1.7) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=1.6'>Settings Menu</A><div class='statusDisplay'>", [this]);
		dat += "<h3>R&D Console Device Linkage Menu:</h3><BR>";
		dat += fmt("<A href='?src=＃;find_device=1'>Re-sync with Nearby Devices</A><BR><BR>", [this]);
		dat += "<h3>Linked Devices:</h3><BR>";
		if (this.linked_destroy) {
			dat += fmt("* Destructive Analyzer <A href='?src=＃;disconnect=destroy'>Disconnect</A><BR>", [this]);
		} else {
			dat += "* No Destructive Analyzer Linked<BR>";
		}
		if (this.linked_lathe) {
			dat += fmt("* Protolathe <A href='?src=＃;disconnect=lathe'>Disconnect</A><BR>", [this]);
		} else {
			dat += "* No Protolathe Linked<BR>";
		}
		if (this.linked_imprinter) {
			dat += fmt("* Circuit Imprinter <A href='?src=＃;disconnect=imprinter'>Disconnect</A><BR>", [this]);
		} else {
			dat += "* No Circuit Imprinter Linked<BR>";
		}
		dat += "</div>";
	} else if (this.screen === 2) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += "<div class='statusDisplay'>NO DESTRUCTIVE ANALYZER LINKED TO CONSOLE</div>";
	} else if (this.screen === 2.1) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += "<div class='statusDisplay'>No Item Loaded. Standing-by...</div>";
	} else if (this.screen === 2.2) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Deconstruction Menu</h3><BR>";
		dat += `Name: ${this.linked_destroy.loaded_item.name}<BR>`;
		dat += "Origin Tech:<BR>";
		temp_tech = this.linked_destroy.ConvertReqString2List(this.linked_destroy.loaded_item.origin_tech);
		_T = null;
		for (_T of each(temp_tech)) {
			dat += `* ${CallTechName(_T)} ${rt.index(temp_tech, _T)}`;
			if (F = rt.index(this.files.known_tech, _T)) {
				dat += ` (Current: ${F.level})`;
			}
			dat += "<BR>";
		}
		dat += "</div>Options: ";
		dat += fmt("<A href='?src=＃;deconstruct=1'>Deconstruct Item</A>", [this]);
		dat += fmt("<A href='?src=＃;eject_item=1'>Eject Item</A>", [this]);
	} else if (this.screen === 2.3) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += "<div class='statusDisplay'>Item is neither reliable enough or broken enough to learn from.</div>";
	} else if (this.screen === 3) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [this]);
		dat += "<div class='statusDisplay'>NO PROTOLATHE LINKED TO CONSOLE</div>";
	} else if (this.screen === 3.1) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A> ", [this]);
		dat += fmt("<A href='?src=＃;menu=3.2'>Material Storage</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=3.3'>Chemical Storage</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Protolathe Menu:</h3><BR>";
		dat += `<B>Material Amount:</B> ${this.linked_lathe.materials.total_amount} / ${this.linked_lathe.materials.max_amount}<BR>`;
		dat += `<B>Chemical Volume:</B> ${this.linked_lathe.reagents.total_volume} / ${this.linked_lathe.reagents.maximum_volume}<BR>`;
		dat += fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='type' value='proto'><input type='text' name='to_search'><input type='submit' value='Search'></form><HR>", [this, this]);
		dat += this.list_categories(this.linked_lathe.categories, 3.15);
	} else if (this.screen === 3.15) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [this]);
		dat += `<div class='statusDisplay'><h3>Browsing ${this.selected_category}:</h3><BR>`;
		dat += `<B>Material Amount:</B> ${this.linked_lathe.materials.total_amount} / ${this.linked_lathe.materials.max_amount}<BR>`;
		dat += `<B>Chemical Volume:</B> ${this.linked_lathe.reagents.total_volume} / ${this.linked_lathe.reagents.maximum_volume}<HR>`;
		coeff = this.linked_lathe.efficiency_coeff;
		for (v_2 of each(this.files.known_designs)) {
			D_3 = rt.index(this.files.known_designs, v_2);
			if (!rt.isIn(f, this.selected_category, D_3.category) || !rt.bitAnd(D_3.build_type, PROTOLATHE)) {
				continue;
			}
			temp_material = null;
			c = 50;
			t = null;
			all_materials = D_3.materials + D_3.reagents_list;
			M_8 = null;
			for (M_8 of each(all_materials)) {
				t = this.linked_lathe.check_mat(D_3, M_8);
				temp_material += " | ";
				if (t < 1) {
					temp_material += `<span class='bad'>${rt.index(all_materials, M_8) * coeff} ${CallMaterialName(M_8)}</span>`;
				} else {
					temp_material += ` ${rt.index(all_materials, M_8) * coeff} ${CallMaterialName(M_8)}`;
				}
				c = min(c, t);
			}
			if (c >= 1) {
				dat += fmt("<A href='?src=＃;build=＀;amount=1'>＀</A>", [this, D_3.id, D_3.name]);
				if (c >= 5) {
					dat += fmt("<A href='?src=＃;build=＀;amount=5'>x5</A>", [this, D_3.id]);
				}
				if (c >= 10) {
					dat += fmt("<A href='?src=＃;build=＀;amount=10'>x10</A>", [this, D_3.id]);
				}
				dat += `${temp_material}`;
			} else {
				dat += `<span class='linkOff'>${D_3.name}</span>${temp_material}`;
			}
			dat += "<BR>";
		}
		dat += "</div>";
	} else if (this.screen === 3.17) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [this]);
		dat += "<div class='statusDisplay'><h3>Search results:</h3><BR>";
		dat += `<B>Material Amount:</B> ${this.linked_lathe.materials.total_amount} / ${this.linked_lathe.materials.max_amount}<BR>`;
		dat += `<B>Chemical Volume:</B> ${this.linked_lathe.reagents.total_volume} / ${this.linked_lathe.reagents.maximum_volume}<HR>`;
		coeff = this.linked_lathe.efficiency_coeff;
		D = null;
		for (D of each(this.matching_designs, T("/datum/design"))) {
			temp_material_3 = null;
			c_4 = 50;
			t_5 = null;
			all_materials_6 = D.materials + D.reagents_list;
			M_7 = null;
			for (M_7 of each(all_materials_6)) {
				t_5 = this.linked_lathe.check_mat(D, M_7);
				temp_material_3 += " | ";
				if (t_5 < 1) {
					temp_material_3 += `<span class='bad'>${rt.index(all_materials_6, M_7) * coeff} ${CallMaterialName(M_7)}</span>`;
				} else {
					temp_material_3 += ` ${rt.index(all_materials_6, M_7) * coeff} ${CallMaterialName(M_7)}`;
				}
				c_4 = min(c_4, t_5);
			}
			if (c_4 >= 1) {
				dat += fmt("<A href='?src=＃;build=＀;amount=1'>＀</A>", [this, D.id, D.name]);
				if (c_4 >= 5) {
					dat += fmt("<A href='?src=＃;build=＀;amount=5'>x5</A>", [this, D.id]);
				}
				if (c_4 >= 10) {
					dat += fmt("<A href='?src=＃;build=＀;amount=10'>x10</A>", [this, D.id]);
				}
				dat += `${temp_material_3}`;
			} else {
				dat += `<span class='linkOff'>${D.name}</span>${temp_material_3}`;
			}
			dat += "<BR>";
		}
		dat += "</div>";
	} else if (this.screen === 3.2) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Material Storage:</h3><BR><HR>";
		if (!this.linked_lathe) {
			dat += "ERROR: Protolathe connection failed.";
		} else {
			for (mat_id of each(this.linked_lathe.materials.materials)) {
				dat += `* ${(M_2 = rt.index(this.linked_lathe.materials.materials, mat_id)).amount} of ${M_2.name}: `;
				if (M_2.amount >= 2000) {
					dat += fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=1'>Eject</A> ", [this, M_2.id]);
				}
				if (M_2.amount >= 10000) {
					dat += fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=5'>5x</A> ", [this, M_2.id]);
				}
				if (M_2.amount >= MINERAL_MATERIAL_AMOUNT) {
					dat += fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=50'>All</A>", [this, M_2.id]);
				}
				dat += "<BR>";
			}
		}
		dat += "</div>";
	} else if (this.screen === 3.3) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;disposeallP=1'>Disposal All Chemicals in Storage</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Chemical Storage:</h3><BR><HR>";
		for (R of each(this.linked_lathe.reagents.reagent_list, T("/datum/reagent"))) {
			dat += `${R.name}: ${R.volume}`;
			dat += fmt("<A href='?src=＃;disposeP=＀'>Purge</A><BR>", [this, R.id]);
		}
	} else if (this.screen === 4) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [this]);
		dat += "<div class='statusDisplay'>NO CIRCUIT IMPRINTER LINKED TO CONSOLE</div>";
	} else if (this.screen === 4.1) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.3'>Material Storage</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.2'>Chemical Storage</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Circuit Imprinter Menu:</h3><BR>";
		dat += `Material Amount: ${this.linked_imprinter.materials.total_amount}<BR>`;
		dat += `Chemical Volume: ${this.linked_imprinter.reagents.total_volume}<HR>`;
		dat += fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='type' value='imprint'><input type='text' name='to_search'><input type='submit' value='Search'></form><HR>", [this, this]);
		dat += this.list_categories(this.linked_imprinter.categories, 4.15);
	} else if (this.screen === 4.15) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [this]);
		dat += `<div class='statusDisplay'><h3>Browsing ${this.selected_category}:</h3><BR>`;
		dat += `Material Amount: ${this.linked_imprinter.materials.total_amount}<BR>`;
		dat += `Chemical Volume: ${this.linked_imprinter.reagents.total_volume}<HR>`;
		coeff = this.linked_imprinter.efficiency_coeff;
		v_2 = null;
		for (v_2 of each(this.files.known_designs)) {
			D_3 = rt.index(this.files.known_designs, v_2);
			if (!rt.isIn(f, this.selected_category, D_3.category) || !rt.bitAnd(D_3.build_type, IMPRINTER)) {
				continue;
			}
			temp_materials = null;
			check_materials = 1;
			all_materials_6 = D_3.materials + D_3.reagents_list;
			M_7 = null;
			for (M_7 of each(all_materials_6)) {
				temp_materials += " | ";
				if (!this.linked_imprinter.check_mat(D_3, M_7)) {
					check_materials = 0;
					temp_materials += ` <span class='bad'>${rt.index(all_materials_6, M_7) / coeff} ${CallMaterialName(M_7)}</span>`;
				} else {
					temp_materials += ` ${rt.index(all_materials_6, M_7) / coeff} ${CallMaterialName(M_7)}`;
				}
			}
			if (check_materials) {
				dat += fmt("<A href='?src=＃;imprint=＀'>＀</A>＀<BR>", [this, D_3.id, D_3.name, temp_materials]);
			} else {
				dat += `<span class='linkOff'>${D_3.name}</span>${temp_materials}<BR>`;
			}
		}
		dat += "</div>";
	} else if (this.screen === 4.17) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [this]);
		dat += "<div class='statusDisplay'><h3>Search results:</h3><BR>";
		dat += `Material Amount: ${this.linked_imprinter.materials.total_amount}<BR>`;
		dat += `Chemical Volume: ${this.linked_imprinter.reagents.total_volume}<HR>`;
		coeff = this.linked_imprinter.efficiency_coeff;
		D = null;
		for (D of each(this.matching_designs, T("/datum/design"))) {
			temp_materials_3 = null;
			check_materials_4 = 1;
			all_materials_5 = D.materials + D.reagents_list;
			M_6 = null;
			for (M_6 of each(all_materials_5)) {
				temp_materials_3 += " | ";
				if (!this.linked_imprinter.check_mat(D, M_6)) {
					check_materials_4 = 0;
					temp_materials_3 += ` <span class='bad'>${rt.index(all_materials_5, M_6) / coeff} ${CallMaterialName(M_6)}</span>`;
				} else {
					temp_materials_3 += ` ${rt.index(all_materials_5, M_6) / coeff} ${CallMaterialName(M_6)}`;
				}
			}
			if (check_materials_4) {
				dat += fmt("<A href='?src=＃;imprint=＀'>＀</A>＀<BR>", [this, D.id, D.name, temp_materials_3]);
			} else {
				dat += `<span class='linkOff'>${D.name}</span>${temp_materials_3}<BR>`;
			}
		}
		dat += "</div>";
	} else if (this.screen === 4.2) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;disposeallI=1'>Disposal All Chemicals in Storage</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Chemical Storage:</h3><BR><HR>";
		R = null;
		for (R of each(this.linked_imprinter.reagents.reagent_list, T("/datum/reagent"))) {
			dat += `${R.name}: ${R.volume}`;
			dat += fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [this, R.id]);
		}
	} else if (this.screen === 4.3) {
		dat += fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [this]);
		dat += fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A><div class='statusDisplay'>", [this]);
		dat += "<h3>Material Storage:</h3><BR><HR>";
		if (!this.linked_imprinter) {
			dat += "ERROR: Protolathe connection failed.";
		} else {
			mat_id = null;
			for (mat_id of each(this.linked_imprinter.materials.materials)) {
				dat += `* ${(M_2 = rt.index(this.linked_imprinter.materials.materials, mat_id)).amount} of ${M_2.name}: `;
				if (M_2.amount >= 2000) {
					dat += fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=1'>Eject</A> ", [this, M_2.id]);
				}
				if (M_2.amount >= 10000) {
					dat += fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=5'>5x</A> ", [this, M_2.id]);
				}
				if (M_2.amount >= MINERAL_MATERIAL_AMOUNT) {
					dat += fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=50'>All</A>", [this, M_2.id]);
				}
				dat += "<BR>";
			}
		}
		dat += "</div>";
	}
	(popup = (yield* new_(T("/datum/browser"), user, "rndconsole", this.name, 460, 550))).set_content(dat);
	yield* popup.open();
	return f.dot;
}, true);

// rdconsole.dm:1046
rt.def("/obj/machinery/computer/rdconsole/proc/list_categories", function list_categories(f: Frame, categories: Value, menu_num: Value) {
	let C: Value = null;
	if (!categories) {
		return f.dot;
	}
	let line_length: Value = 1;
	let dat: Value = "<table style='width:100%' align='center'><tr>";
	for (C of each(categories)) {
		if (line_length > 2) {
			dat += "</tr><tr>";
			line_length = 1;
		}
		dat += fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [this, C, menu_num, C]);
		line_length++;
	}
	return (dat += "</tr></table></div>");
});

rt.type(10426, "/obj/machinery/computer/rdconsole/robotics", "/obj/machinery/computer/rdconsole", {
	id: 2,
	name: "Robotics R&D Console",
	desc: "A console used to interface with R&D tools.",
	req_access: null,
	req_access_txt: "29",
});

// rdconsole.dm:1067
rt.def("/obj/machinery/computer/rdconsole/robotics/proc/<init>", function _init_(f: Frame) {
	parent_proc();
	this.req_access = null;
	return f.dot;
});

// rdconsole.dm:1071
rt.def("/obj/machinery/computer/rdconsole/robotics/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* parent_proc());
	if (!this.circuit) return f.dot;
	this.circuit.name = "R&D Console - Robotics (Computer Board)";
	this.circuit.build_path = T("/obj/machinery/computer/rdconsole/robotics");
	return f.dot;
}, true);
