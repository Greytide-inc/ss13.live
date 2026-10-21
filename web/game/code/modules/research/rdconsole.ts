// From code/modules/research/rdconsole.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


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

// /obj/machinery/computer/rdconsole/proc/<init>  (code/modules/research/rdconsole.dm:53)
rt.def("/obj/machinery/computer/rdconsole/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "matching_designs", rt.list());
	$0 = $0;
	rt.setSv(f, "req_access", rt.list(7));
	return f.dot;
});

// /proc/CallTechName  (code/modules/research/rdconsole.dm:58)
rt.def("/proc/CallTechName", function CallTechName(f: Frame, ID: Value) {
	let tech: Value = null;
	f.vars = () => [tech];
	if (truthy(rt.index(rt.gl("tech_list"), live(ID)))) {
		return rt.gv(f, "name", (tech = rt.index(rt.gl("tech_list"), live(ID))));
	}
	return "ERROR: Report This";
});

// /proc/CallMaterialName  (code/modules/research/rdconsole.dm:64)
rt.def("/proc/CallMaterialName", function CallMaterialName(f: Frame, ID: Value) {
	let material: Value = null, reagent: Value = null;
	f.vars = () => [material, reagent];
	if ((isEqual(rt.call(f, P("/proc/copytext"), null, [live(ID), 1, 2]), "$") && truthy(rt.index(rt.gl("materials_list"), live(ID))))) {
		return rt.gv(f, "name", (material = rt.index(rt.gl("materials_list"), live(ID))));
	} else {
		if (truthy(rt.index(rt.gl("chemical_reagents_list"), live(ID)))) {
			return rt.gv(f, "name", (reagent = rt.index(rt.gl("chemical_reagents_list"), live(ID))));
		}
	}
	return "ERROR: Report This";
});

// /obj/machinery/computer/rdconsole/proc/SyncRDevices  (code/modules/research/rdconsole.dm:74)
rt.def("/obj/machinery/computer/rdconsole/proc/SyncRDevices", function SyncRDevices(f: Frame) {
	let D: Value = null;
	let $e: any;
	f.vars = () => [D, $e];
	D = null;
	rt.forList(f, 0, rt.call(f, P("/proc/oview"), null, [3, live(f.src)]), T("/obj/machinery/r_n_d"));
	while (($e = rt.next(f, 0)) !== undefined) {
		D = $e;
		if (((rt.fv(f, "linked_console", live(D)) !== null || truthy(rt.fv(f, "disabled", live(D)))) || truthy(rt.fv(f, "panel_open", live(D))))) {
			continue;
		}
		if (truthy((rt.istype(live(D), T("/obj/machinery/r_n_d/destructive_analyzer")) ? 1 : 0))) {
			if (rt.sv(f, "linked_destroy") === null) {
				rt.setSv(f, "linked_destroy", live(D));
				rt.setFv(f, "linked_console", live(D), live(f.src));
			}
		} else {
			if (truthy((rt.istype(live(D), T("/obj/machinery/r_n_d/protolathe")) ? 1 : 0))) {
				if (rt.sv(f, "linked_lathe") === null) {
					rt.setSv(f, "linked_lathe", live(D));
					rt.setFv(f, "linked_console", live(D), live(f.src));
				}
			} else {
				if (truthy((rt.istype(live(D), T("/obj/machinery/r_n_d/circuit_imprinter")) ? 1 : 0))) {
					if (rt.sv(f, "linked_imprinter") === null) {
						rt.setSv(f, "linked_imprinter", live(D));
						rt.setFv(f, "linked_console", live(D), live(f.src));
					}
				}
			}
		}
	}
	rt.endFor(f, 0);
	rt.setSv(f, "first_use", 0);
	return f.dot;
});

// /obj/machinery/computer/rdconsole/proc/griefProtection  (code/modules/research/rdconsole.dm:93)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/griefProtection", function* griefProtection(f: Frame) {
	let C: Value = null, v: Value = null, _T: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [C, v, _T, D, $e];
	C = null;
	rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server/centcom"));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		v = null;
		rt.forList(f, 1, rt.fv(f, "known_tech", rt.sv(f, "files")));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v));
			yield* g.callName(f, rt.fv(f, "files", live(C)), "AddTech2Known", [live(_T)]);
		}
		rt.endFor(f, 1);
		v = null;
		rt.forList(f, 1, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 1)) !== undefined) {
			v = $e;
			D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
			yield* g.callName(f, rt.fv(f, "files", live(C)), "AddDesign2Known", [live(D)]);
		}
		rt.endFor(f, 1);
		yield* g.callName(f, rt.fv(f, "files", live(C)), "RefreshResearch", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/computer/rdconsole/proc/Initialize  (code/modules/research/rdconsole.dm:104)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research"), [live(f.src)])));
	rt.setSv(f, "matching_designs", rt.list());
	if (truthy(rt.sv(f, "id"))) return f.dot;
	yield* g.call(f, P("/proc/fix_noid_research_servers"), null, []);
	return f.dot;
}, true);

// /obj/machinery/computer/rdconsole/proc/attackby  (code/modules/research/rdconsole.dm:118)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk")) ? 1 : 0))) {
		if ((truthy(rt.sv(f, "t_disk")) || truthy(rt.sv(f, "d_disk")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "A disk is already loaded into the machine."]);
			return live(f.dot);
		}
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/tech_disk")) ? 1 : 0))) {
			rt.setSv(f, "t_disk", live(f.args[0]));
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/disk/design_disk")) ? 1 : 0))) {
				rt.setSv(f, "d_disk", live(f.args[0]));
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Machine cannot accept disks in that format.</span>"]);
				return live(f.dot);
			}
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
			return live(f.dot);
		}
		rt.setFv(f, "loc", live(f.args[0]), live(f.src));
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add the disk to the machine!</span>"]);
	} else {
		if (((!(truthy(rt.sv(f, "linked_destroy")) && truthy(rt.fv(f, "busy", rt.sv(f, "linked_destroy")))) && !(truthy(rt.sv(f, "linked_lathe")) && truthy(rt.fv(f, "busy", rt.sv(f, "linked_lathe"))))) && !(truthy(rt.sv(f, "linked_imprinter")) && truthy(rt.fv(f, "busy", rt.sv(f, "linked_imprinter")))))) {
			f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return f.dot;
}, true, { args: ["D", "user", "params"] });

// /obj/machinery/computer/rdconsole/proc/on_deconstruction  (code/modules/research/rdconsole.dm:141)
rt.def("/obj/machinery/computer/rdconsole/proc/on_deconstruction", function on_deconstruction(f: Frame) {
	if (truthy(rt.sv(f, "linked_destroy"))) {
		rt.setFv(f, "linked_console", rt.sv(f, "linked_destroy"), null);
		rt.setSv(f, "linked_destroy", null);
	}
	if (truthy(rt.sv(f, "linked_lathe"))) {
		rt.setFv(f, "linked_console", rt.sv(f, "linked_lathe"), null);
		rt.setSv(f, "linked_lathe", null);
	}
	if (truthy(rt.sv(f, "linked_imprinter"))) {
		rt.setFv(f, "linked_console", rt.sv(f, "linked_imprinter"), null);
		rt.setSv(f, "linked_imprinter", null);
	}
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
});

// /obj/machinery/computer/rdconsole/proc/emag_act  (code/modules/research/rdconsole.dm:153)
rt.def("/obj/machinery/computer/rdconsole/proc/emag_act", function emag_act(f: Frame, user: Value) {
	if (truthy(rt.sv(f, "emagged"))) return f.dot;
	rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/effects/sparks4.ogg"), 75, 1]);
	rt.setSv(f, "emagged", 1);
	rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You disable the security protocols</span>"]);
	return f.dot;
});

// /obj/machinery/computer/rdconsole/proc/Topic  (code/modules/research/rdconsole.dm:159)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/Topic", function* Topic(f: Frame) {
	let temp_screen: Value = null, n: Value = null, wait: Value = null, D: Value = null, tech: Value = null, i: Value = null, slot: Value = null, _T: Value = null, D_1: Value = null, autolathe_friendly: Value = null, x: Value = null, temp_tech: Value = null, cancontinue: Value = null, _T_2: Value = null, choice: Value = null, KT: Value = null, material: Value = null, I: Value = null, M: Value = null, S: Value = null, S_0: Value = null, server_processed: Value = null, v: Value = null, _T_3: Value = null, D_3: Value = null, being_built: Value = null, amount: Value = null, coeff: Value = null, power: Value = null, old_screen: Value = null, M_5: Value = null, key: Value = null, g2g: Value = null, enough_materials: Value = null, efficient_mats: Value = null, MAT: Value = null, R: Value = null, _P: Value = null, already_logged: Value = null, i_11: Value = null, new_item: Value = null, coeff_1: Value = null, power_2: Value = null, old_screen_3: Value = null, M_4: Value = null, g2g_4: Value = null, enough_materials_5: Value = null, efficient_mats_6: Value = null, MAT_7: Value = null, R_7: Value = null, _P_7: Value = null, new_item_8: Value = null, choice_0: Value = null, compare: Value = null, v_1: Value = null;
	let $0: any, $1: any, $e: any;
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1, $0, $1, $e];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.callName(f, live(f.usr), "set_machine", [live(f.src)]);
	if (truthy(rt.at(live(f.args[1]), "disk_slot"))) {
		rt.setSv(f, "disk_slot_selected", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "disk_slot")])));
	}
	if (truthy(rt.at(live(f.args[1]), "menu"))) {
		rt.setSv(f, "screen", (temp_screen = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "menu")]))));
	}
	if (truthy(rt.at(live(f.args[1]), "category"))) {
		rt.setSv(f, "selected_category", rt.at(live(f.args[1]), "category"));
	} else {
		if (truthy(rt.at(live(f.args[1]), "updt_tech"))) {
			n = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "updt_tech")]));
			rt.setSv(f, "screen", 0);
			wait = 50;
			if (!truthy(live(n))) {
				wait = 0;
				D = null;
				rt.forList(f, 0, rt.fv(f, "tech_stored", rt.sv(f, "t_disk")));
				while (($e = rt.next(f, 0)) !== undefined) {
					D = $e;
					if (truthy(live(D))) {
						wait = rt.modify(live(wait), 50, add);
					}
				}
				rt.endFor(f, 0);
			}
			rt.spawnTail(f, live(wait), "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:184", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
		} else {
			if (truthy(rt.at(live(f.args[1]), "clear_tech"))) {
				if (truthy(rt.sv(f, "t_disk"))) {
					if (!truthy((n = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "clear_tech")]))))) {
						i = null;
						rt.forRange(f, 0, 1, rt.fv(f, "max_tech_stored", rt.sv(f, "t_disk")), 1);
						while (($e = rt.next(f, 0)) !== undefined) {
							i = $e;
							rt.setAt(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(i), null);
						}
						rt.endFor(f, 0);
					} else {
						rt.setAt(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(n), null);
					}
				}
			} else {
				if (truthy(rt.at(live(f.args[1]), "eject_tech"))) {
					if (truthy(rt.sv(f, "t_disk"))) {
						rt.setFv(f, "loc", rt.sv(f, "t_disk"), rt.fv(f, "loc", live(f.src)));
						rt.setSv(f, "t_disk", null);
					}
					rt.setSv(f, "screen", 1);
				} else {
					if (truthy(rt.at(live(f.args[1]), "copy_tech"))) {
						slot = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "copy_tech")]));
						if (truthy((_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), rt.at(live(f.args[1]), "copy_tech_ID"))))) {
							rt.setAt(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(slot), (yield* g.callName(f, live(_T), "copy", [])));
						}
						rt.setSv(f, "screen", 1.2000000476837158);
					} else {
						if (truthy(rt.at(live(f.args[1]), "updt_design"))) {
							n = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "updt_design")]));
							rt.setSv(f, "screen", 0);
							wait = 50;
							if (!truthy(live(n))) {
								wait = 0;
								D = null;
								rt.forList(f, 0, rt.fv(f, "blueprints", rt.sv(f, "d_disk")));
								while (($e = rt.next(f, 0)) !== undefined) {
									D = $e;
									if (truthy(live(D))) {
										wait = rt.modify(live(wait), 50, add);
									}
								}
								rt.endFor(f, 0);
							}
							rt.spawnTail(f, live(wait), "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:226", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
						} else {
							if (truthy(rt.at(live(f.args[1]), "clear_design"))) {
								if (truthy(rt.sv(f, "d_disk"))) {
									if (!truthy((n = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "clear_design")]))))) {
										i = null;
										rt.forRange(f, 0, 1, rt.fv(f, "max_blueprints", rt.sv(f, "d_disk")), 1);
										while (($e = rt.next(f, 0)) !== undefined) {
											i = $e;
											rt.setAt(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(i), null);
										}
										rt.endFor(f, 0);
									} else {
										rt.setAt(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(n), null);
									}
								}
							} else {
								if (truthy(rt.at(live(f.args[1]), "eject_design"))) {
									if (truthy(rt.sv(f, "d_disk"))) {
										rt.setFv(f, "loc", rt.sv(f, "d_disk"), rt.fv(f, "loc", live(f.src)));
										rt.setSv(f, "d_disk", null);
									}
									rt.setSv(f, "screen", 1);
								} else {
									if (truthy(rt.at(live(f.args[1]), "copy_design"))) {
										slot = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "copy_design")]));
										if (truthy((D_1 = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), rt.at(live(f.args[1]), "copy_design_ID"))))) {
											autolathe_friendly = 1;
											if (truthy(rt.getLen(f, rt.fv(f, "reagents_list", live(D_1))))) {
												autolathe_friendly = 0;
												(rt.modField(f, live(D_1), "category", "Imported", subtract));
											} else {
												x = null;
												rt.forList(f, 0, rt.fv(f, "materials", live(D_1)));
												while (($e = rt.next(f, 0)) !== undefined) {
													x = $e;
													if (!truthy((rt.isIn(f, live(x), rt.list("$metal", "$glass")) ? 1 : 0))) {
														autolathe_friendly = 0;
														(rt.modField(f, live(D_1), "category", "Imported", subtract));
													}
												}
												rt.endFor(f, 0);
											}
											if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D_1)), 14))) {
												$0 = live(D_1);
												if (truthy(live(autolathe_friendly))) {
													$1 = rt.bitOr(rt.fv(f, "build_type", live(D_1)), 4);
												} else {
													$1 = rt.fv(f, "build_type", live(D_1));
												}
												rt.setFv(f, "build_type", $0, $1);
												(rt.modField(f, live(D_1), "category", "Imported", rt.bitOr));
											}
											rt.setAt(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(slot), live(D_1));
										}
										rt.setSv(f, "screen", 1.399999976158142);
									} else {
										if (truthy(rt.at(live(f.args[1]), "eject_item"))) {
											if (truthy(rt.sv(f, "linked_destroy"))) {
												if (truthy(rt.fv(f, "busy", rt.sv(f, "linked_destroy")))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>The destructive analyzer is busy at the moment.</span>"]);
												} else {
													if (truthy(rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")))) {
														yield* g.callName(f, rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")), "forceMove", [rt.fv(f, "loc", rt.sv(f, "linked_destroy"))]);
														rt.setFv(f, "loaded_item", rt.sv(f, "linked_destroy"), null);
														rt.setFv(f, "icon_state", rt.sv(f, "linked_destroy"), "d_analyzer");
														rt.setSv(f, "screen", 1);
													}
												}
											}
										} else {
											if (truthy(rt.at(live(f.args[1]), "deconstruct"))) {
												if (((!truthy(rt.sv(f, "linked_destroy")) || truthy(rt.fv(f, "busy", rt.sv(f, "linked_destroy")))) || !truthy(rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy"))))) {
													yield* g.srcCall(f, "updateUsrDialog");
													return live(f.dot);
												}
												temp_tech = (yield* g.callName(f, rt.sv(f, "linked_destroy"), "ConvertReqString2List", [rt.gv(f, "origin_tech", rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")))]));
												cancontinue = 0;
												_T_2 = null;
												rt.forList(f, 0, live(temp_tech));
												while (($e = rt.next(f, 0)) !== undefined) {
													_T_2 = $e;
													if (truthy((yield* g.callName(f, rt.sv(f, "files"), "IsTechHigher", [live(_T_2), rt.index(live(temp_tech), live(_T_2))])))) {
														cancontinue = 1;
														break;
													}
												}
												rt.endFor(f, 0);
												if (!truthy(live(cancontinue))) {
													if (((isEqual((choice = (yield* g.op(f, "Prompt", [0], [null, null, null, "This item does not raise tech levels. Proceed destroying loaded item anyway?", rt.list("Proceed", "Cancel")]))), "Cancel") || !truthy(rt.sv(f, "linked_destroy"))) || !truthy(rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy"))))) {
														return live(f.dot);
													}
												}
												rt.setFv(f, "busy", rt.sv(f, "linked_destroy"), 1);
												rt.setSv(f, "screen", 0.10000000149011612);
												yield* g.srcCall(f, "updateUsrDialog");
												yield* g.call(f, P("/proc/flick"), null, ["d_analyzer_process", rt.sv(f, "linked_destroy")]);
												rt.spawnTail(f, 24, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:302", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
											} else {
												if (truthy(rt.at(live(f.args[1]), "lock"))) {
													if (truthy((yield* g.callName(f, live(f.src), "allowed", [live(f.usr)])))) {
														rt.setSv(f, "screen", (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "lock")])));
													} else {
														yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "Unauthorized Access."]);
													}
												} else {
													if (truthy(rt.at(live(f.args[1]), "sync"))) {
														rt.setSv(f, "screen", 0);
														if (!truthy(rt.sv(f, "sync"))) {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>You must connect to the network first!</span>"]);
														} else {
															yield* g.srcCall(f, "griefProtection");
															rt.spawnTail(f, 30, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:351", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
														}
													} else {
														if (truthy(rt.at(live(f.args[1]), "togglesync"))) {
															rt.setSv(f, "sync", (!truthy(rt.sv(f, "sync")) ? 1 : 0));
														} else {
															if (truthy(rt.at(live(f.args[1]), "build"))) {
																being_built = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), rt.at(live(f.args[1]), "build"));
																amount = (yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "amount")]));
																if (truthy(rt.getLen(f, rt.fv(f, "make_reagents", live(being_built))))) {
																	return 0;
																}
																if (((!truthy(rt.sv(f, "linked_lathe")) || !truthy(live(being_built))) || !truthy(live(amount)))) {
																	yield* g.srcCall(f, "updateUsrDialog");
																	return live(f.dot);
																}
																if (truthy(rt.fv(f, "busy", rt.sv(f, "linked_lathe")))) {
																	yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Protolathe is busy at the moment.</span>"]);
																	return live(f.dot);
																}
																coeff = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_lathe"));
																power = 1000;
																old_screen = rt.sv(f, "screen");
																amount = (yield* g.call(f, P("/proc/max"), null, [1, (yield* g.call(f, P("/proc/min"), null, [10, live(amount)]))]));
																M_5 = null;
																rt.forList(f, 0, rt.fv(f, "materials", live(being_built)));
																while (($e = rt.next(f, 0)) !== undefined) {
																	M_5 = $e;
																	power = rt.modify(live(power), (yield* g.call(f, P("/proc/round"), null, [divide(multiply(rt.index(rt.fv(f, "materials", live(being_built)), live(M_5)), live(amount)), 5)])), add);
																}
																rt.endFor(f, 0);
																power = (yield* g.call(f, P("/proc/max"), null, [3000, live(power)]));
																rt.setSv(f, "screen", 0.30000001192092896);
																key = rt.fv(f, "key", live(f.usr));
																if (!truthy(rt.bitAnd(rt.fv(f, "build_type", live(being_built)), 2))) {
																	yield* g.call(f, P("/proc/message_admins"), null, [fmt("Protolathe exploit attempted by ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr), rt.fv(f, "client", live(f.usr))]))])]);
																	yield* g.srcCall(f, "updateUsrDialog");
																	return live(f.dot);
																}
																g2g = 1;
																enough_materials = 1;
																rt.setFv(f, "busy", rt.sv(f, "linked_lathe"), 1);
																yield* g.call(f, P("/proc/flick"), null, ["protolathe_n", rt.sv(f, "linked_lathe")]);
																yield* g.srcCall(f, "use_power", live(power));
																efficient_mats = rt.list();
																MAT = null;
																rt.forList(f, 0, rt.fv(f, "materials", live(being_built)));
																while (($e = rt.next(f, 0)) !== undefined) {
																	MAT = $e;
																	rt.setAt(live(efficient_mats), live(MAT), multiply(rt.index(rt.fv(f, "materials", live(being_built)), live(MAT)), live(coeff)));
																}
																rt.endFor(f, 0);
																if (!truthy((yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_lathe")), "has_materials", [live(efficient_mats), live(amount)])))) {
																	yield* g.callName(f, rt.sv(f, "linked_lathe"), "say", ["Not enough materials to complete prototype."]);
																	enough_materials = 0;
																	g2g = 0;
																} else {
																	R = null;
																	rt.forList(f, 0, rt.fv(f, "reagents_list", live(being_built)));
																	while (($e = rt.next(f, 0)) !== undefined) {
																		R = $e;
																		if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_lathe")), "has_reagent", [live(R), multiply(rt.index(rt.fv(f, "reagents_list", live(being_built)), live(R)), live(coeff))])))) {
																			yield* g.callName(f, rt.sv(f, "linked_lathe"), "say", ["Not enough reagents to complete prototype."]);
																			enough_materials = 0;
																			g2g = 0;
																		}
																	}
																	rt.endFor(f, 0);
																}
																if (truthy(live(enough_materials))) {
																	yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_lathe")), "use_amount", [live(efficient_mats), live(amount)]);
																	R = null;
																	rt.forList(f, 0, rt.fv(f, "reagents_list", live(being_built)));
																	while (($e = rt.next(f, 0)) !== undefined) {
																		R = $e;
																		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_lathe")), "remove_reagent", [live(R), multiply(rt.index(rt.fv(f, "reagents_list", live(being_built)), live(R)), live(coeff))]);
																	}
																	rt.endFor(f, 0);
																}
																_P = rt.fv(f, "build_path", live(being_built));
																(coeff = rt.modify(live(coeff), rt.fv(f, "lathe_time_factor", live(being_built)), multiply));
																rt.spawnTail(f, multiply(multiply(32, live(coeff)), rt.power(live(amount), 0.800000011920929)), "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:443", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
															} else {
																if (truthy(rt.at(live(f.args[1]), "imprint"))) {
																	being_built = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), rt.at(live(f.args[1]), "imprint"));
																	if ((!truthy(rt.sv(f, "linked_imprinter")) || !truthy(live(being_built)))) {
																		yield* g.srcCall(f, "updateUsrDialog");
																		return live(f.dot);
																	}
																	if (truthy(rt.fv(f, "busy", rt.sv(f, "linked_imprinter")))) {
																		yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='danger'>Circuit Imprinter is busy at the moment.</span>"]);
																		yield* g.srcCall(f, "updateUsrDialog");
																		return live(f.dot);
																	}
																	coeff_1 = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_imprinter"));
																	power_2 = 1000;
																	old_screen_3 = rt.sv(f, "screen");
																	M_4 = null;
																	rt.forList(f, 0, rt.fv(f, "materials", live(being_built)));
																	while (($e = rt.next(f, 0)) !== undefined) {
																		M_4 = $e;
																		power_2 = rt.modify(live(power_2), (yield* g.call(f, P("/proc/round"), null, [divide(rt.index(rt.fv(f, "materials", live(being_built)), live(M_4)), 5)])), add);
																	}
																	rt.endFor(f, 0);
																	power_2 = (yield* g.call(f, P("/proc/max"), null, [4000, live(power_2)]));
																	rt.setSv(f, "screen", 0.4000000059604645);
																	if (!truthy(rt.bitAnd(rt.fv(f, "build_type", live(being_built)), 1))) {
																		yield* g.call(f, P("/proc/message_admins"), null, [fmt("Circuit imprinter exploit attempted by ＀!", [(yield* g.call(f, P("/proc/key_name"), null, [live(f.usr), rt.fv(f, "client", live(f.usr))]))])]);
																		yield* g.srcCall(f, "updateUsrDialog");
																		return live(f.dot);
																	}
																	g2g_4 = 1;
																	enough_materials_5 = 1;
																	rt.setFv(f, "busy", rt.sv(f, "linked_imprinter"), 1);
																	yield* g.call(f, P("/proc/flick"), null, ["circuit_imprinter_ani", rt.sv(f, "linked_imprinter")]);
																	yield* g.srcCall(f, "use_power", live(power_2));
																	efficient_mats_6 = rt.list();
																	MAT_7 = null;
																	rt.forList(f, 0, rt.fv(f, "materials", live(being_built)));
																	while (($e = rt.next(f, 0)) !== undefined) {
																		MAT_7 = $e;
																		rt.setAt(live(efficient_mats_6), live(MAT_7), divide(rt.index(rt.fv(f, "materials", live(being_built)), live(MAT_7)), live(coeff_1)));
																	}
																	rt.endFor(f, 0);
																	if (!truthy((yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_imprinter")), "has_materials", [live(efficient_mats_6)])))) {
																		yield* g.callName(f, rt.sv(f, "linked_imprinter"), "say", ["Not enough materials to complete prototype."]);
																		enough_materials_5 = 0;
																		g2g_4 = 0;
																	} else {
																		R_7 = null;
																		rt.forList(f, 0, rt.fv(f, "reagents_list", live(being_built)));
																		while (($e = rt.next(f, 0)) !== undefined) {
																			R_7 = $e;
																			if (!truthy((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")), "has_reagent", [live(R_7), divide(rt.index(rt.fv(f, "reagents_list", live(being_built)), live(R_7)), live(coeff_1))])))) {
																				yield* g.callName(f, rt.sv(f, "linked_imprinter"), "say", ["Not enough reagents to complete prototype."]);
																				enough_materials_5 = 0;
																				g2g_4 = 0;
																			}
																		}
																		rt.endFor(f, 0);
																	}
																	if (truthy(live(enough_materials_5))) {
																		yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_imprinter")), "use_amount", [live(efficient_mats_6)]);
																		R_7 = null;
																		rt.forList(f, 0, rt.fv(f, "reagents_list", live(being_built)));
																		while (($e = rt.next(f, 0)) !== undefined) {
																			R_7 = $e;
																			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")), "remove_reagent", [live(R_7), divide(rt.index(rt.fv(f, "reagents_list", live(being_built)), live(R_7)), live(coeff_1))]);
																		}
																		rt.endFor(f, 0);
																	}
																	_P_7 = rt.fv(f, "build_path", live(being_built));
																	rt.spawnTail(f, 16, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:516", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
																} else {
																	if ((truthy(rt.at(live(f.args[1]), "disposeP")) && truthy(rt.sv(f, "linked_lathe")))) {
																		yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_lathe")), "del_reagent", [rt.at(live(f.args[1]), "disposeP")]);
																	} else {
																		if ((truthy(rt.at(live(f.args[1]), "disposeallP")) && truthy(rt.sv(f, "linked_lathe")))) {
																			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_lathe")), "clear_reagents", []);
																		} else {
																			if ((truthy(rt.at(live(f.args[1]), "ejectsheet")) && truthy(rt.sv(f, "linked_lathe")))) {
																				yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_lathe")), "retrieve_sheets", [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "eject_amt")])), rt.at(live(f.args[1]), "ejectsheet")]);
																			} else {
																				if ((truthy(rt.at(live(f.args[1]), "disposeI")) && truthy(rt.sv(f, "linked_imprinter")))) {
																					yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")), "del_reagent", [rt.at(live(f.args[1]), "disposeI")]);
																				} else {
																					if ((truthy(rt.at(live(f.args[1]), "disposeallI")) && truthy(rt.sv(f, "linked_imprinter")))) {
																						yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")), "clear_reagents", []);
																					} else {
																						if ((truthy(rt.at(live(f.args[1]), "imprinter_ejectsheet")) && truthy(rt.sv(f, "linked_imprinter")))) {
																							yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_imprinter")), "retrieve_sheets", [(yield* g.call(f, P("/proc/text2num"), null, [rt.at(live(f.args[1]), "eject_amt")])), rt.at(live(f.args[1]), "imprinter_ejectsheet")]);
																						} else {
																							if (truthy(rt.at(live(f.args[1]), "find_device"))) {
																								rt.setSv(f, "screen", 0);
																								rt.spawnTail(f, 20, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:553", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
																							} else {
																								if (truthy(rt.at(live(f.args[1]), "disconnect"))) {
																									$0 = rt.at(live(f.args[1]), "disconnect");
																									if ($0 === "destroy") {
																										rt.setFv(f, "linked_console", rt.sv(f, "linked_destroy"), null);
																										rt.setSv(f, "linked_destroy", null);
																									} else if ($0 === "lathe") {
																										rt.setFv(f, "linked_console", rt.sv(f, "linked_lathe"), null);
																										rt.setSv(f, "linked_lathe", null);
																									} else if ($0 === "imprinter") {
																										rt.setFv(f, "linked_console", rt.sv(f, "linked_imprinter"), null);
																										rt.setSv(f, "linked_imprinter", null);
																									}
																								} else {
																									if (truthy(rt.at(live(f.args[1]), "reset"))) {
																										yield* g.srcCall(f, "griefProtection");
																										if ((isEqual((choice_0 = (yield* g.call(f, P("/proc/alert"), null, ["R&D Console Database Reset", "Are you sure you want to reset the R&D console's database? Data lost cannot be recovered.", "Continue", "Cancel"]))), "Continue") && truthy((yield* g.callName(f, live(f.usr), "canUseTopic", [live(f.src)]))))) {
																											yield* g.call(f, P("/proc/message_admins"), null, [fmt("＀ reset ％！'s database", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "name", live(f.src))])]);
																											yield* g.call(f, P("/proc/log_game"), null, [fmt("＀ reset ％！'s database", [(yield* g.call(f, P("/proc/key_name_admin"), null, [live(f.usr)])), rt.fv(f, "name", live(f.src))])]);
																											rt.setSv(f, "screen", 0);
																											yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "files")]);
																											rt.setSv(f, "files", (yield* g.new_(f, T("/datum/research"), [live(f.src)])));
																											rt.spawnTail(f, 20, "/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:579", temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1);
																										}
																									} else {
																										if (truthy(rt.at(live(f.args[1]), "search"))) {
																											compare = null;
																											yield* g.callName(f, rt.sv(f, "matching_designs"), "Cut", []);
																											if (isEqual(rt.at(live(f.args[1]), "type"), "proto")) {
																												compare = 2;
																												rt.setSv(f, "screen", 3.1700000762939453);
																											} else {
																												compare = 1;
																												rt.setSv(f, "screen", 4.170000076293945);
																											}
																											v_1 = null;
																											rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
																											while (($e = rt.next(f, 0)) !== undefined) {
																												v_1 = $e;
																												if (!truthy(rt.bitAnd(rt.gv(f, "build_type", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v_1)))), live(compare)))) {
																													continue;
																												}
																												if (truthy((yield* g.call(f, P("/proc/findtext"), null, [rt.fv(f, "name", live(D)), rt.at(live(f.args[1]), "to_search")])))) {
																													yield* g.callName(f, rt.sv(f, "matching_designs"), "Add", [live(D)]);
																												}
																											}
																											rt.endFor(f, 0);
																										}
																									}
																								}
																							}
																						}
																					}
																				}
																			}
																		}
																	}
																}
															}
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return live(f.dot);
}, true, { args: ["href", "href_list"] });

// a spawn(20) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:579", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1];
	rt.setSv(f, "screen", 1.600000023841858);
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// a spawn(20) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:553", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1];
	yield* g.srcCall(f, "SyncRDevices");
	rt.setSv(f, "screen", 1.7000000476837158);
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// a spawn(16) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:516", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1];
	if (truthy(rt.sv(f, "linked_imprinter"))) {
		if (truthy(live(g2g_4))) {
			rt.setFv(f, "loc", (new_item_8 = (yield* g.new_(f, live(_P_7), [live(f.src)]))), rt.fv(f, "loc", rt.sv(f, "linked_imprinter")));
			rt.setFv(f, "materials", live(new_item_8), (yield* g.callName(f, live(efficient_mats_6), "Copy", [])));
		}
		rt.setSv(f, "screen", live(old_screen_3));
		rt.setFv(f, "busy", rt.sv(f, "linked_imprinter"), 0);
	} else {
		yield* g.srcCall(f, "say", "Circuit Imprinter connection failed. Production halted.");
		rt.setSv(f, "screen", 1);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// a spawn(multiply(multiply(32, live(coeff)), rt.power(live(amount), 0.800000011920929))) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:443", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1];
	if (truthy(rt.sv(f, "linked_lathe"))) {
		if (truthy(live(g2g))) {
			already_logged = 0;
			i_11 = null;
			i_11 = 0;
			while (rt.lt(live(i_11), live(amount))) {
				if (isEqual(rt.gv(f, "type", (new_item = (yield* g.new_(f, live(_P), [live(f.src)])))), T("/obj/item/weapon/storage/backpack/holding"))) {
					yield* g.callName(f, live(new_item), "investigate_log", [fmt("built by ＀", [live(key)]), "singulo"]);
				}
				if ((!truthy((rt.istype(live(new_item), T("/obj/item/stack/sheet")) ? 1 : 0)) && !truthy((rt.istype(live(new_item), T("/obj/item/weapon/ore/bluespace_crystal")) ? 1 : 0)))) {
					rt.setFv(f, "materials", live(new_item), (yield* g.callName(f, live(efficient_mats), "Copy", [])));
				}
				rt.setFv(f, "loc", live(new_item), rt.fv(f, "loc", rt.sv(f, "linked_lathe")));
				if (!truthy(live(already_logged))) {
					already_logged = 1;
				}
				i_11 = rt.inc(live(i_11), 1);
			}
		}
		rt.setSv(f, "screen", live(old_screen));
		rt.setFv(f, "busy", rt.sv(f, "linked_lathe"), 0);
	} else {
		yield* g.srcCall(f, "say", "Protolathe connection failed. Production halted.");
		rt.setSv(f, "screen", 1);
	}
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// a spawn(30) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:351", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	let $e: any;
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1, $e];
	if (truthy(live(f.src))) {
		S_0 = null;
		rt.forList(f, 0, rt.gl("machines"), T("/obj/machinery/r_n_d/server"));
		while (($e = rt.next(f, 0)) !== undefined) {
			S_0 = $e;
			server_processed = 0;
			if (truthy(rt.fv(f, "disabled", live(S_0)))) {
				continue;
			}
			if ((truthy((rt.isIn(f, rt.sv(f, "id"), rt.fv(f, "id_with_upload", live(S_0))) ? 1 : 0)) || truthy((rt.istype(live(S_0), T("/obj/machinery/r_n_d/server/centcom")) ? 1 : 0)))) {
				v = null;
				rt.forList(f, 1, rt.fv(f, "known_tech", rt.sv(f, "files")));
				while (($e = rt.next(f, 1)) !== undefined) {
					v = $e;
					_T_3 = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v));
					yield* g.callName(f, rt.fv(f, "files", live(S_0)), "AddTech2Known", [live(_T_3)]);
				}
				rt.endFor(f, 1);
				v = null;
				rt.forList(f, 1, rt.fv(f, "known_designs", rt.sv(f, "files")));
				while (($e = rt.next(f, 1)) !== undefined) {
					v = $e;
					D_3 = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v));
					yield* g.callName(f, rt.fv(f, "files", live(S_0)), "AddDesign2Known", [live(D_3)]);
				}
				rt.endFor(f, 1);
				yield* g.callName(f, rt.fv(f, "files", live(S_0)), "RefreshResearch", []);
				server_processed = 1;
			}
			if (((truthy((rt.isIn(f, rt.sv(f, "id"), rt.fv(f, "id_with_download", live(S_0))) ? 1 : 0)) && !truthy((rt.istype(live(S_0), T("/obj/machinery/r_n_d/server/centcom")) ? 1 : 0))) || truthy(rt.fv(f, "hacked", live(S_0))))) {
				v = null;
				rt.forList(f, 1, rt.gv(f, "known_tech", rt.fv(f, "files", live(S_0))));
				while (($e = rt.next(f, 1)) !== undefined) {
					v = $e;
					_T_3 = rt.index(rt.gv(f, "known_tech", rt.fv(f, "files", live(S_0))), live(v));
					yield* g.callName(f, rt.sv(f, "files"), "AddTech2Known", [live(_T_3)]);
				}
				rt.endFor(f, 1);
				v = null;
				rt.forList(f, 1, rt.gv(f, "known_designs", rt.fv(f, "files", live(S_0))));
				while (($e = rt.next(f, 1)) !== undefined) {
					v = $e;
					D_3 = rt.index(rt.gv(f, "known_designs", rt.fv(f, "files", live(S_0))), live(v));
					yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(D_3)]);
				}
				rt.endFor(f, 1);
				yield* g.callName(f, rt.sv(f, "files"), "RefreshResearch", []);
				server_processed = 1;
			}
			if ((!truthy((rt.istype(live(S_0), T("/obj/machinery/r_n_d/server/centcom")) ? 1 : 0)) && truthy(live(server_processed)))) {
				yield* g.callName(f, live(S_0), "produce_heat", [100]);
			}
		}
		rt.endFor(f, 0);
		rt.setSv(f, "screen", 1.600000023841858);
		yield* g.srcCall(f, "updateUsrDialog");
	}
	return null;
});

// a spawn(24) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:302", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	let $e: any;
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1, $e];
	if (truthy(rt.sv(f, "linked_destroy"))) {
		rt.setFv(f, "busy", rt.sv(f, "linked_destroy"), 0);
		if (!truthy(rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")))) {
			rt.setSv(f, "screen", 1);
			return live(f.dot);
		}
		_T_2 = null;
		rt.forList(f, 0, live(temp_tech));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T_2 = $e;
			KT = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(_T_2));
			yield* g.callName(f, rt.sv(f, "files"), "UpdateTech", [live(_T_2), rt.index(live(temp_tech), live(_T_2))]);
		}
		rt.endFor(f, 0);
		if (truthy(rt.sv(f, "linked_lathe"))) {
			material = null;
			rt.forList(f, 0, rt.gv(f, "materials", rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy"))));
			while (($e = rt.next(f, 0)) !== undefined) {
				material = $e;
				yield* g.callName(f, rt.fv(f, "materials", rt.sv(f, "linked_lathe")), "insert_amount", [(yield* g.call(f, P("/proc/min"), null, [subtract(rt.gv(f, "max_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))), rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe")))), multiply(rt.index(rt.gv(f, "materials", rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy"))), live(material)), divide(rt.fv(f, "decon_mod", rt.sv(f, "linked_destroy")), 10))])), live(material)]);
			}
			rt.endFor(f, 0);
		}
		rt.setFv(f, "loaded_item", rt.sv(f, "linked_destroy"), null);
		I = null;
		rt.forList(f, 0, rt.fv(f, "contents", rt.sv(f, "linked_destroy")), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			I = $e;
			M = null;
			rt.forList(f, 1, rt.fv(f, "contents", live(I)), T("/mob"));
			while (($e = rt.next(f, 1)) !== undefined) {
				M = $e;
				yield* g.callName(f, live(M), "death", []);
			}
			rt.endFor(f, 1);
			if (truthy((rt.istype(live(I), T("/obj/item/stack/sheet")) ? 1 : 0))) {
				if (rt.gt(rt.gv(f, "amount", (S = live(I))), 1)) {
					rt.incField(f, live(S), "amount", -1, true);
					rt.setFv(f, "loaded_item", rt.sv(f, "linked_destroy"), live(S));
				} else {
					yield* g.call(f, P("/proc/qdel"), null, [live(S)]);
					rt.setFv(f, "icon_state", rt.sv(f, "linked_destroy"), "d_analyzer");
				}
			} else {
				if (!truthy((rt.isIn(f, live(I), rt.fv(f, "component_parts", rt.sv(f, "linked_destroy"))) ? 1 : 0))) {
					yield* g.call(f, P("/proc/qdel"), null, [live(I)]);
					rt.setFv(f, "icon_state", rt.sv(f, "linked_destroy"), "d_analyzer");
				}
			}
		}
		rt.endFor(f, 0);
	}
	rt.setSv(f, "screen", 1);
	yield* g.srcCall(f, "use_power", 250);
	yield* g.srcCall(f, "updateUsrDialog");
	return null;
});

// a spawn(live(wait)) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:226", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	let $e: any;
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1, $e];
	rt.setSv(f, "screen", 1.399999976158142);
	if (truthy(rt.sv(f, "d_disk"))) {
		if (!truthy(live(n))) {
			D = null;
			rt.forList(f, 0, rt.fv(f, "blueprints", rt.sv(f, "d_disk")));
			while (($e = rt.next(f, 0)) !== undefined) {
				D = $e;
				if (truthy(live(D))) {
					yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [live(D)]);
				}
			}
			rt.endFor(f, 0);
		} else {
			yield* g.callName(f, rt.sv(f, "files"), "AddDesign2Known", [rt.index(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(n))]);
		}
		yield* g.srcCall(f, "updateUsrDialog");
		yield* g.srcCall(f, "griefProtection");
	}
	return null;
});

// a spawn(live(wait)) body of /obj/machinery/computer/rdconsole/proc/Topic, a named tail so a world snapshot can hold it while it waits.
rt.tail("/obj/machinery/computer/rdconsole/proc/Topic: spawn at modules/research/rdconsole.dm:184", function* (f: Frame, temp_screen: Value, n: Value, wait: Value, D: Value, tech: Value, i: Value, slot: Value, _T: Value, D_1: Value, autolathe_friendly: Value, x: Value, temp_tech: Value, cancontinue: Value, _T_2: Value, choice: Value, KT: Value, material: Value, I: Value, M: Value, S: Value, S_0: Value, server_processed: Value, v: Value, _T_3: Value, D_3: Value, being_built: Value, amount: Value, coeff: Value, power: Value, old_screen: Value, M_5: Value, key: Value, g2g: Value, enough_materials: Value, efficient_mats: Value, MAT: Value, R: Value, _P: Value, already_logged: Value, i_11: Value, new_item: Value, coeff_1: Value, power_2: Value, old_screen_3: Value, M_4: Value, g2g_4: Value, enough_materials_5: Value, efficient_mats_6: Value, MAT_7: Value, R_7: Value, _P_7: Value, new_item_8: Value, choice_0: Value, compare: Value, v_1: Value) {
	let $e: any;
	f.vars = () => [temp_screen, n, wait, D, tech, i, slot, _T, D_1, autolathe_friendly, x, temp_tech, cancontinue, _T_2, choice, KT, material, I, M, S, S_0, server_processed, v, _T_3, D_3, being_built, amount, coeff, power, old_screen, M_5, key, g2g, enough_materials, efficient_mats, MAT, R, _P, already_logged, i_11, new_item, coeff_1, power_2, old_screen_3, M_4, g2g_4, enough_materials_5, efficient_mats_6, MAT_7, R_7, _P_7, new_item_8, choice_0, compare, v_1, $e];
	rt.setSv(f, "screen", 1.2000000476837158);
	if (truthy(rt.sv(f, "t_disk"))) {
		if (!truthy(live(n))) {
			tech = null;
			rt.forList(f, 0, rt.fv(f, "tech_stored", rt.sv(f, "t_disk")));
			while (($e = rt.next(f, 0)) !== undefined) {
				tech = $e;
				yield* g.callName(f, rt.sv(f, "files"), "AddTech2Known", [live(tech)]);
			}
			rt.endFor(f, 0);
		} else {
			yield* g.callName(f, rt.sv(f, "files"), "AddTech2Known", [rt.index(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(n))]);
		}
		yield* g.srcCall(f, "updateUsrDialog");
		yield* g.srcCall(f, "griefProtection");
	}
	return null;
});

// /obj/machinery/computer/rdconsole/proc/attack_hand  (code/modules/research/rdconsole.dm:607)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/attack_hand", function* attack_hand(f: Frame) {
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) {
		return live(f.dot);
	}
	yield* g.srcCall(f, "interact", live(f.args[0]));
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/computer/rdconsole/proc/interact  (code/modules/research/rdconsole.dm:612)  may sleep
rt.def("/obj/machinery/computer/rdconsole/proc/interact", function* interact(f: Frame, user: Value) {
	let dat: Value = null, v: Value = null, _T: Value = null, i: Value = null, tech: Value = null, D: Value = null, all_mats: Value = null, M: Value = null, temp_tech: Value = null, F: Value = null, coeff: Value = null, v_2: Value = null, D_3: Value = null, temp_material: Value = null, c: Value = null, t: Value = null, all_materials: Value = null, M_8: Value = null, temp_material_3: Value = null, c_4: Value = null, t_5: Value = null, all_materials_6: Value = null, M_7: Value = null, mat_id: Value = null, M_2: Value = null, R: Value = null, temp_materials: Value = null, check_materials: Value = null, temp_materials_3: Value = null, check_materials_4: Value = null, all_materials_5: Value = null, M_6: Value = null, popup: Value = null;
	let $0: any, $e: any;
	f.vars = () => [user, dat, v, _T, i, tech, D, all_mats, M, temp_tech, F, coeff, v_2, D_3, temp_material, c, t, all_materials, M_8, temp_material_3, c_4, t_5, all_materials_6, M_7, mat_id, M_2, R, temp_materials, check_materials, temp_materials_3, check_materials_4, all_materials_5, M_6, popup, $0, $e];
	yield* g.callName(f, live(user), "set_machine", [live(f.src)]);
	if (truthy(rt.sv(f, "first_use"))) {
		yield* g.srcCall(f, "SyncRDevices");
	}
	dat = "";
	yield* g.callName(f, rt.sv(f, "files"), "RefreshResearch", []);
	$0 = rt.sv(f, "screen");
	if (rt.inRange($0, 2, 2.9000000953674316)) {
		if (!isEqual(rt.sv(f, "screen"), 2.299999952316284)) {
			if (rt.sv(f, "linked_destroy") === null) {
				rt.setSv(f, "screen", 2);
			} else {
				if (rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")) === null) {
					rt.setSv(f, "screen", 2.0999999046325684);
				} else {
					rt.setSv(f, "screen", 2.200000047683716);
				}
			}
		}
	} else if (rt.inRange($0, 3, 3.9000000953674316)) {
		if (rt.sv(f, "linked_lathe") === null) {
			rt.setSv(f, "screen", 3);
		}
	} else if (rt.inRange($0, 4, 4.900000095367432)) {
		if (rt.sv(f, "linked_imprinter") === null) {
			rt.setSv(f, "screen", 4);
		}
	}
	$0 = rt.sv(f, "screen");
	if ($0 === 0) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Updating Database....</div>", add);
	} else if ($0 === 0.10000000149011612) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Processing and Updating Database...</div>", add);
	} else if ($0 === 0.20000000298023224) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>SYSTEM LOCKED</div>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;lock=1.6'>Unlock</A>", [live(f.src)]), add);
	} else if ($0 === 0.30000001192092896) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Constructing Prototype. Please Wait...</div>", add);
	} else if ($0 === 0.4000000059604645) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Imprinting Circuit. Please Wait...</div>", add);
	} else if ($0 === 1) {
		dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
		dat = rt.modify(live(dat), "<h3>Main Menu:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.1'>Current Research Levels</A><BR>", [live(f.src)]), add);
		if (truthy(rt.sv(f, "t_disk"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.2'>Disk Operations</A><BR>", [live(f.src)]), add);
		} else {
			if (truthy(rt.sv(f, "d_disk"))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.4'>Disk Operations</A><BR>", [live(f.src)]), add);
			} else {
				dat = rt.modify(live(dat), "<span class='linkOff'>Disk Operations</span><BR>", add);
			}
		}
		if (truthy(rt.sv(f, "linked_destroy"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=2.2'>Destructive Analyzer Menu</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Destructive Analyzer Menu</span><BR>", add);
		}
		if (truthy(rt.sv(f, "linked_lathe"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.1'>Protolathe Construction Menu</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Protolathe Construction Menu</span><BR>", add);
		}
		if (truthy(rt.sv(f, "linked_imprinter"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.1'>Circuit Construction Menu</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Circuit Construction Menu</span><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.6'>Settings</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 1.100000023841858) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Current Research Levels:</h3><BR><div class='statusDisplay'>", add);
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_tech", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (rt.le(rt.gv(f, "level", (_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v)))), 0)) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("＀<BR>", [rt.fv(f, "name", live(_T))]), add);
			dat = rt.modify(live(dat), fmt("* Level: ＀<BR>", [rt.fv(f, "level", live(_T))]), add);
			dat = rt.modify(live(dat), fmt("* Summary: ＀<HR>", [rt.fv(f, "desc", live(_T))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 1.2000000476837158) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("Disk Operations: <A href='?src=＃;clear_tech=0'>Clear Disk</A><A href='?src=＃;updt_tech=0'>Upload All</A><A href='?src=＃;eject_tech=1'>Eject Disk</A>", [live(f.src), live(f.src), live(f.src)]), add);
		i = null;
		rt.forRange(f, 0, 1, rt.fv(f, "max_tech_stored", rt.sv(f, "t_disk")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
			if (truthy(rt.index(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(i)))) {
				dat = rt.modify(live(dat), fmt("Name: ＀<BR>", [rt.gv(f, "name", (tech = rt.index(rt.fv(f, "tech_stored", rt.sv(f, "t_disk")), live(i))))]), add);
				dat = rt.modify(live(dat), fmt("Level: ＀<BR>", [rt.fv(f, "level", live(tech))]), add);
				dat = rt.modify(live(dat), fmt("Description: ＀<BR>", [rt.fv(f, "desc", live(tech))]), add);
				dat = rt.modify(live(dat), fmt("Operations: <A href='?src=＃;updt_tech=＀'>Upload to Database</A><A href='?src=＃;clear_tech=＀'>Clear Slot</A>", [live(f.src), live(i), live(f.src), live(i)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("Empty Slot<BR>Operations: <A href='?src=＃;menu=1.3;disk_slot=＀'>Load Tech to Slot</A>", [live(f.src), live(i)]), add);
			}
			dat = rt.modify(live(dat), "</div>", add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1.2999999523162842) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.2'>Return to Disk Operations</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Load Technology to Disk:</h3><BR>", add);
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_tech", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			if (rt.le(rt.gv(f, "level", (_T = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(v)))), 0)) {
				continue;
			}
			dat = rt.modify(live(dat), fmt("＀", [rt.fv(f, "name", live(_T))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;copy_tech=＀;copy_tech_ID=＀'>Copy to Disk</A><BR>", [live(f.src), rt.sv(f, "disk_slot_selected"), rt.fv(f, "id", live(_T))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 1.399999976158142) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("Disk Operations: <A href='?src=＃;clear_design=0'>Clear Disk</A><A href='?src=＃;updt_design=0'>Upload All</A><A href='?src=＃;eject_design=1'>Eject Disk</A>", [live(f.src), live(f.src), live(f.src)]), add);
		i = null;
		rt.forRange(f, 0, 1, rt.fv(f, "max_blueprints", rt.sv(f, "d_disk")), 1);
		while (($e = rt.next(f, 0)) !== undefined) {
			i = $e;
			dat = rt.modify(live(dat), "<div class='statusDisplay'>", add);
			if (truthy(rt.index(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(i)))) {
				dat = rt.modify(live(dat), fmt("Name: ＀<BR>", [rt.gv(f, "name", (D = rt.index(rt.fv(f, "blueprints", rt.sv(f, "d_disk")), live(i))))]), add);
				if (truthy(rt.fv(f, "build_type", live(D)))) {
					dat = rt.modify(live(dat), "Lathe Types:<BR>", add);
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 1))) {
						dat = rt.modify(live(dat), "Circuit Imprinter<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 2))) {
						dat = rt.modify(live(dat), "Protolathe<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 4))) {
						dat = rt.modify(live(dat), "Autolathe<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 16))) {
						dat = rt.modify(live(dat), "Exosuit Fabricator<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 32))) {
						dat = rt.modify(live(dat), "Biogenerator<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 64))) {
						dat = rt.modify(live(dat), "Limbgrower<BR>", add);
					}
					if (truthy(rt.bitAnd(rt.fv(f, "build_type", live(D)), 128))) {
						dat = rt.modify(live(dat), "Smelter<BR>", add);
					}
				}
				dat = rt.modify(live(dat), "Required Materials:<BR>", add);
				all_mats = add(rt.fv(f, "materials", live(D)), rt.fv(f, "reagents_list", live(D)));
				M = null;
				rt.forList(f, 1, live(all_mats));
				while (($e = rt.next(f, 1)) !== undefined) {
					M = $e;
					dat = rt.modify(live(dat), fmt("* ＀ x ＀<BR>", [(yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M)])), rt.index(live(all_mats), live(M))]), add);
				}
				rt.endFor(f, 1);
				dat = rt.modify(live(dat), fmt("Operations: <A href='?src=＃;updt_design=＀'>Upload to Database</A> <A href='?src=＃;clear_design=＀'>Clear Slot</A>", [live(f.src), live(i), live(f.src), live(i)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("Empty Slot<BR>Operations: <A href='?src=＃;menu=1.5;disk_slot=＀'>Load Design to Slot</A>", [live(f.src), live(i)]), add);
			}
			dat = rt.modify(live(dat), "</div>", add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 1.5) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.4'>Return to Disk Operations</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Load Design to Disk:</h3><BR>", add);
		v = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v = $e;
			dat = rt.modify(live(dat), fmt("＀ ", [rt.gv(f, "name", (D = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v))))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;copy_design=＀;copy_design_ID=＀'>Copy to Disk</A><BR>", [live(f.src), rt.sv(f, "disk_slot_selected"), rt.fv(f, "id", live(D))]), add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 1.600000023841858) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>R&D Console Setting:</h3><BR>", add);
		if (truthy(rt.sv(f, "sync"))) {
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;sync=1'>Sync Database with Network</A><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), "<span class='linkOn'>Connect to Research Network</span><BR>", add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;togglesync=1'>Disconnect from Research Network</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "<span class='linkOff'>Sync Database with Network</span><BR>", add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;togglesync=1'>Connect to Research Network</A><BR>", [live(f.src)]), add);
			dat = rt.modify(live(dat), "<span class='linkOn'>Disconnect from Research Network</span><BR>", add);
		}
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.7'>Device Linkage Menu</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;lock=0.2'>Lock Console</A><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;reset=1'>Reset R&D Database</A></div>", [live(f.src)]), add);
	} else if ($0 === 1.7000000476837158) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.6'>Settings Menu</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>R&D Console Device Linkage Menu:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;find_device=1'>Re-sync with Nearby Devices</A><BR><BR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Linked Devices:</h3><BR>", add);
		if (truthy(rt.sv(f, "linked_destroy"))) {
			dat = rt.modify(live(dat), fmt("* Destructive Analyzer <A href='?src=＃;disconnect=destroy'>Disconnect</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "* No Destructive Analyzer Linked<BR>", add);
		}
		if (truthy(rt.sv(f, "linked_lathe"))) {
			dat = rt.modify(live(dat), fmt("* Protolathe <A href='?src=＃;disconnect=lathe'>Disconnect</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "* No Protolathe Linked<BR>", add);
		}
		if (truthy(rt.sv(f, "linked_imprinter"))) {
			dat = rt.modify(live(dat), fmt("* Circuit Imprinter <A href='?src=＃;disconnect=imprinter'>Disconnect</A><BR>", [live(f.src)]), add);
		} else {
			dat = rt.modify(live(dat), "* No Circuit Imprinter Linked<BR>", add);
		}
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 2) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'>NO DESTRUCTIVE ANALYZER LINKED TO CONSOLE</div>", add);
	} else if ($0 === 2.0999999046325684) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'>No Item Loaded. Standing-by...</div>", add);
	} else if ($0 === 2.200000047683716) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Deconstruction Menu</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("Name: ＀<BR>", [rt.gv(f, "name", rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")))]), add);
		dat = rt.modify(live(dat), "Origin Tech:<BR>", add);
		temp_tech = (yield* g.callName(f, rt.sv(f, "linked_destroy"), "ConvertReqString2List", [rt.gv(f, "origin_tech", rt.fv(f, "loaded_item", rt.sv(f, "linked_destroy")))]));
		_T = null;
		rt.forList(f, 0, live(temp_tech));
		while (($e = rt.next(f, 0)) !== undefined) {
			_T = $e;
			dat = rt.modify(live(dat), fmt("* ＀ ＀", [(yield* g.call(f, P("/proc/CallTechName"), null, [live(_T)])), rt.index(live(temp_tech), live(_T))]), add);
			if (truthy((F = rt.index(rt.fv(f, "known_tech", rt.sv(f, "files")), live(_T))))) {
				dat = rt.modify(live(dat), fmt(" (Current: ＀)", [rt.fv(f, "level", live(F))]), add);
			}
			dat = rt.modify(live(dat), "<BR>", add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>Options: ", add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;deconstruct=1'>Deconstruct Item</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;eject_item=1'>Eject Item</A>", [live(f.src)]), add);
	} else if ($0 === 2.299999952316284) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'>Item is neither reliable enough or broken enough to learn from.</div>", add);
	} else if ($0 === 3) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'>NO PROTOLATHE LINKED TO CONSOLE</div>", add);
	} else if ($0 === 3.0999999046325684) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A> ", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.2'>Material Storage</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.3'>Chemical Storage</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Protolathe Menu:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("<B>Material Amount:</B> ＀ / ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))), rt.gv(f, "max_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe")))]), add);
		dat = rt.modify(live(dat), fmt("<B>Chemical Volume:</B> ＀ / ＀<BR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe")))]), add);
		dat = rt.modify(live(dat), fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='type' value='proto'><input type='text' name='to_search'><input type='submit' value='Search'></form><HR>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), (yield* g.srcCall(f, "list_categories", rt.fv(f, "categories", rt.sv(f, "linked_lathe")), 3.1500000953674316)), add);
	} else if ($0 === 3.1500000953674316) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<div class='statusDisplay'><h3>Browsing ＀:</h3><BR>", [rt.sv(f, "selected_category")]), add);
		dat = rt.modify(live(dat), fmt("<B>Material Amount:</B> ＀ / ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))), rt.gv(f, "max_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe")))]), add);
		dat = rt.modify(live(dat), fmt("<B>Chemical Volume:</B> ＀ / ＀<HR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe")))]), add);
		coeff = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_lathe"));
		v_2 = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v_2 = $e;
			D_3 = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v_2));
			if ((!truthy((rt.isIn(f, rt.sv(f, "selected_category"), rt.fv(f, "category", live(D_3))) ? 1 : 0)) || !truthy(rt.bitAnd(rt.fv(f, "build_type", live(D_3)), 2)))) {
				continue;
			}
			temp_material = null;
			c = 50;
			t = null;
			all_materials = add(rt.fv(f, "materials", live(D_3)), rt.fv(f, "reagents_list", live(D_3)));
			M_8 = null;
			rt.forList(f, 1, live(all_materials));
			while (($e = rt.next(f, 1)) !== undefined) {
				M_8 = $e;
				t = (yield* g.callName(f, rt.sv(f, "linked_lathe"), "check_mat", [live(D_3), live(M_8)]));
				temp_material = rt.modify(live(temp_material), " | ", add);
				if (rt.lt(live(t), 1)) {
					temp_material = rt.modify(live(temp_material), fmt("<span class='bad'>＀ ＀</span>", [multiply(rt.index(live(all_materials), live(M_8)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_8)]))]), add);
				} else {
					temp_material = rt.modify(live(temp_material), fmt(" ＀ ＀", [multiply(rt.index(live(all_materials), live(M_8)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_8)]))]), add);
				}
				c = (yield* g.call(f, P("/proc/min"), null, [live(c), live(t)]));
			}
			rt.endFor(f, 1);
			if (rt.ge(live(c), 1)) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=1'>＀</A>", [live(f.src), rt.fv(f, "id", live(D_3)), rt.fv(f, "name", live(D_3))]), add);
				if (rt.ge(live(c), 5)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=5'>x5</A>", [live(f.src), rt.fv(f, "id", live(D_3))]), add);
				}
				if (rt.ge(live(c), 10)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=10'>x10</A>", [live(f.src), rt.fv(f, "id", live(D_3))]), add);
				}
				dat = rt.modify(live(dat), fmt("＀", [live(temp_material)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>＀", [rt.fv(f, "name", live(D_3)), live(temp_material)]), add);
			}
			dat = rt.modify(live(dat), "<BR>", add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 3.1700000762939453) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'><h3>Search results:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("<B>Material Amount:</B> ＀ / ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))), rt.gv(f, "max_amount", rt.fv(f, "materials", rt.sv(f, "linked_lathe")))]), add);
		dat = rt.modify(live(dat), fmt("<B>Chemical Volume:</B> ＀ / ＀<HR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe"))), rt.gv(f, "maximum_volume", rt.fv(f, "reagents", rt.sv(f, "linked_lathe")))]), add);
		coeff = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_lathe"));
		D = null;
		rt.forList(f, 0, rt.sv(f, "matching_designs"), T("/datum/design"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			temp_material_3 = null;
			c_4 = 50;
			t_5 = null;
			all_materials_6 = add(rt.fv(f, "materials", live(D)), rt.fv(f, "reagents_list", live(D)));
			M_7 = null;
			rt.forList(f, 1, live(all_materials_6));
			while (($e = rt.next(f, 1)) !== undefined) {
				M_7 = $e;
				t_5 = (yield* g.callName(f, rt.sv(f, "linked_lathe"), "check_mat", [live(D), live(M_7)]));
				temp_material_3 = rt.modify(live(temp_material_3), " | ", add);
				if (rt.lt(live(t_5), 1)) {
					temp_material_3 = rt.modify(live(temp_material_3), fmt("<span class='bad'>＀ ＀</span>", [multiply(rt.index(live(all_materials_6), live(M_7)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_7)]))]), add);
				} else {
					temp_material_3 = rt.modify(live(temp_material_3), fmt(" ＀ ＀", [multiply(rt.index(live(all_materials_6), live(M_7)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_7)]))]), add);
				}
				c_4 = (yield* g.call(f, P("/proc/min"), null, [live(c_4), live(t_5)]));
			}
			rt.endFor(f, 1);
			if (rt.ge(live(c_4), 1)) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=1'>＀</A>", [live(f.src), rt.fv(f, "id", live(D)), rt.fv(f, "name", live(D))]), add);
				if (rt.ge(live(c_4), 5)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=5'>x5</A>", [live(f.src), rt.fv(f, "id", live(D))]), add);
				}
				if (rt.ge(live(c_4), 10)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;build=＀;amount=10'>x10</A>", [live(f.src), rt.fv(f, "id", live(D))]), add);
				}
				dat = rt.modify(live(dat), fmt("＀", [live(temp_material_3)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>＀", [rt.fv(f, "name", live(D)), live(temp_material_3)]), add);
			}
			dat = rt.modify(live(dat), "<BR>", add);
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 3.200000047683716) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Material Storage:</h3><BR><HR>", add);
		if (!truthy(rt.sv(f, "linked_lathe"))) {
			dat = rt.modify(live(dat), "ERROR: Protolathe connection failed.", add);
		} else {
			mat_id = null;
			rt.forList(f, 0, rt.gv(f, "materials", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))));
			while (($e = rt.next(f, 0)) !== undefined) {
				mat_id = $e;
				dat = rt.modify(live(dat), fmt("* ＀ of ＀: ", [rt.gv(f, "amount", (M_2 = rt.index(rt.gv(f, "materials", rt.fv(f, "materials", rt.sv(f, "linked_lathe"))), live(mat_id)))), rt.fv(f, "name", live(M_2))]), add);
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 2000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=1'>Eject</A> ", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 10000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=5'>5x</A> ", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 2000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;ejectsheet=＀;eject_amt=50'>All</A>", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				dat = rt.modify(live(dat), "<BR>", add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 3.299999952316284) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=3.1'>Protolathe Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeallP=1'>Disposal All Chemicals in Storage</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Chemical Storage:</h3><BR><HR>", add);
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "linked_lathe"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			dat = rt.modify(live(dat), fmt("＀: ＀", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeP=＀'>Purge</A><BR>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 4) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A><HR>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'>NO CIRCUIT IMPRINTER LINKED TO CONSOLE</div>", add);
	} else if ($0 === 4.099999904632568) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.3'>Material Storage</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.2'>Chemical Storage</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Circuit Imprinter Menu:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("Material Amount: ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_imprinter")))]), add);
		dat = rt.modify(live(dat), fmt("Chemical Volume: ＀<HR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")))]), add);
		dat = rt.modify(live(dat), fmt("<form name='search' action='?src=＃'><input type='hidden' name='src' value='＃'><input type='hidden' name='search' value='to_search'><input type='hidden' name='type' value='imprint'><input type='text' name='to_search'><input type='submit' value='Search'></form><HR>", [live(f.src), live(f.src)]), add);
		dat = rt.modify(live(dat), (yield* g.srcCall(f, "list_categories", rt.fv(f, "categories", rt.sv(f, "linked_imprinter")), 4.150000095367432)), add);
	} else if ($0 === 4.150000095367432) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<div class='statusDisplay'><h3>Browsing ＀:</h3><BR>", [rt.sv(f, "selected_category")]), add);
		dat = rt.modify(live(dat), fmt("Material Amount: ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_imprinter")))]), add);
		dat = rt.modify(live(dat), fmt("Chemical Volume: ＀<HR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")))]), add);
		coeff = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_imprinter"));
		v_2 = null;
		rt.forList(f, 0, rt.fv(f, "known_designs", rt.sv(f, "files")));
		while (($e = rt.next(f, 0)) !== undefined) {
			v_2 = $e;
			D_3 = rt.index(rt.fv(f, "known_designs", rt.sv(f, "files")), live(v_2));
			if ((!truthy((rt.isIn(f, rt.sv(f, "selected_category"), rt.fv(f, "category", live(D_3))) ? 1 : 0)) || !truthy(rt.bitAnd(rt.fv(f, "build_type", live(D_3)), 1)))) {
				continue;
			}
			temp_materials = null;
			check_materials = 1;
			all_materials_6 = add(rt.fv(f, "materials", live(D_3)), rt.fv(f, "reagents_list", live(D_3)));
			M_7 = null;
			rt.forList(f, 1, live(all_materials_6));
			while (($e = rt.next(f, 1)) !== undefined) {
				M_7 = $e;
				temp_materials = rt.modify(live(temp_materials), " | ", add);
				if (!truthy((yield* g.callName(f, rt.sv(f, "linked_imprinter"), "check_mat", [live(D_3), live(M_7)])))) {
					check_materials = 0;
					temp_materials = rt.modify(live(temp_materials), fmt(" <span class='bad'>＀ ＀</span>", [divide(rt.index(live(all_materials_6), live(M_7)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_7)]))]), add);
				} else {
					temp_materials = rt.modify(live(temp_materials), fmt(" ＀ ＀", [divide(rt.index(live(all_materials_6), live(M_7)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_7)]))]), add);
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(check_materials))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;imprint=＀'>＀</A>＀<BR>", [live(f.src), rt.fv(f, "id", live(D_3)), rt.fv(f, "name", live(D_3)), live(temp_materials)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>＀<BR>", [rt.fv(f, "name", live(D_3)), live(temp_materials)]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 4.170000076293945) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<div class='statusDisplay'><h3>Search results:</h3><BR>", add);
		dat = rt.modify(live(dat), fmt("Material Amount: ＀<BR>", [rt.gv(f, "total_amount", rt.fv(f, "materials", rt.sv(f, "linked_imprinter")))]), add);
		dat = rt.modify(live(dat), fmt("Chemical Volume: ＀<HR>", [rt.gv(f, "total_volume", rt.fv(f, "reagents", rt.sv(f, "linked_imprinter")))]), add);
		coeff = rt.fv(f, "efficiency_coeff", rt.sv(f, "linked_imprinter"));
		D = null;
		rt.forList(f, 0, rt.sv(f, "matching_designs"), T("/datum/design"));
		while (($e = rt.next(f, 0)) !== undefined) {
			D = $e;
			temp_materials_3 = null;
			check_materials_4 = 1;
			all_materials_5 = add(rt.fv(f, "materials", live(D)), rt.fv(f, "reagents_list", live(D)));
			M_6 = null;
			rt.forList(f, 1, live(all_materials_5));
			while (($e = rt.next(f, 1)) !== undefined) {
				M_6 = $e;
				temp_materials_3 = rt.modify(live(temp_materials_3), " | ", add);
				if (!truthy((yield* g.callName(f, rt.sv(f, "linked_imprinter"), "check_mat", [live(D), live(M_6)])))) {
					check_materials_4 = 0;
					temp_materials_3 = rt.modify(live(temp_materials_3), fmt(" <span class='bad'>＀ ＀</span>", [divide(rt.index(live(all_materials_5), live(M_6)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_6)]))]), add);
				} else {
					temp_materials_3 = rt.modify(live(temp_materials_3), fmt(" ＀ ＀", [divide(rt.index(live(all_materials_5), live(M_6)), live(coeff)), (yield* g.call(f, P("/proc/CallMaterialName"), null, [live(M_6)]))]), add);
				}
			}
			rt.endFor(f, 1);
			if (truthy(live(check_materials_4))) {
				dat = rt.modify(live(dat), fmt("<A href='?src=＃;imprint=＀'>＀</A>＀<BR>", [live(f.src), rt.fv(f, "id", live(D)), rt.fv(f, "name", live(D)), live(temp_materials_3)]), add);
			} else {
				dat = rt.modify(live(dat), fmt("<span class='linkOff'>＀</span>＀<BR>", [rt.fv(f, "name", live(D)), live(temp_materials_3)]), add);
			}
		}
		rt.endFor(f, 0);
		dat = rt.modify(live(dat), "</div>", add);
	} else if ($0 === 4.199999809265137) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeallI=1'>Disposal All Chemicals in Storage</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Chemical Storage:</h3><BR><HR>", add);
		R = null;
		rt.forList(f, 0, rt.gv(f, "reagent_list", rt.fv(f, "reagents", rt.sv(f, "linked_imprinter"))), T("/datum/reagent"));
		while (($e = rt.next(f, 0)) !== undefined) {
			R = $e;
			dat = rt.modify(live(dat), fmt("＀: ＀", [rt.fv(f, "name", live(R)), rt.fv(f, "volume", live(R))]), add);
			dat = rt.modify(live(dat), fmt("<A href='?src=＃;disposeI=＀'>Purge</A><BR>", [live(f.src), rt.fv(f, "id", live(R))]), add);
		}
		rt.endFor(f, 0);
	} else if ($0 === 4.300000190734863) {
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=1.0'>Main Menu</A>", [live(f.src)]), add);
		dat = rt.modify(live(dat), fmt("<A href='?src=＃;menu=4.1'>Circuit Imprinter Menu</A><div class='statusDisplay'>", [live(f.src)]), add);
		dat = rt.modify(live(dat), "<h3>Material Storage:</h3><BR><HR>", add);
		if (!truthy(rt.sv(f, "linked_imprinter"))) {
			dat = rt.modify(live(dat), "ERROR: Protolathe connection failed.", add);
		} else {
			mat_id = null;
			rt.forList(f, 0, rt.gv(f, "materials", rt.fv(f, "materials", rt.sv(f, "linked_imprinter"))));
			while (($e = rt.next(f, 0)) !== undefined) {
				mat_id = $e;
				dat = rt.modify(live(dat), fmt("* ＀ of ＀: ", [rt.gv(f, "amount", (M_2 = rt.index(rt.gv(f, "materials", rt.fv(f, "materials", rt.sv(f, "linked_imprinter"))), live(mat_id)))), rt.fv(f, "name", live(M_2))]), add);
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 2000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=1'>Eject</A> ", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 10000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=5'>5x</A> ", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				if (rt.ge(rt.fv(f, "amount", live(M_2)), 2000)) {
					dat = rt.modify(live(dat), fmt("<A href='?src=＃;imprinter_ejectsheet=＀;eject_amt=50'>All</A>", [live(f.src), rt.fv(f, "id", live(M_2))]), add);
				}
				dat = rt.modify(live(dat), "<BR>", add);
			}
			rt.endFor(f, 0);
		}
		dat = rt.modify(live(dat), "</div>", add);
	}
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "rndconsole", rt.sv(f, "name"), 460, 550]))), "set_content", [live(dat)]);
	yield* g.callName(f, live(popup), "open", []);
	return live(f.dot);
}, true);

// /obj/machinery/computer/rdconsole/proc/list_categories  (code/modules/research/rdconsole.dm:1046)
rt.def("/obj/machinery/computer/rdconsole/proc/list_categories", function list_categories(f: Frame, categories: Value, menu_num: Value) {
	let line_length: Value = null, dat: Value = null, C: Value = null;
	let $e: any;
	f.vars = () => [line_length, dat, C, $e];
	if (!truthy(live(categories))) {
		return live(f.dot);
	}
	line_length = 1;
	dat = "<table style='width:100%' align='center'><tr>";
	C = null;
	rt.forList(f, 0, live(categories));
	while (($e = rt.next(f, 0)) !== undefined) {
		C = $e;
		if (rt.gt(live(line_length), 2)) {
			dat = rt.modify(live(dat), "</tr><tr>", add);
			line_length = 1;
		}
		dat = rt.modify(live(dat), fmt("<td><A href='?src=＃;category=＀;menu=＀'>＀</A></td>", [live(f.src), live(C), live(menu_num), live(C)]), add);
		line_length = rt.inc(live(line_length), 1);
	}
	rt.endFor(f, 0);
	return (dat = rt.modify(live(dat), "</tr></table></div>", add));
});

rt.type(10426, "/obj/machinery/computer/rdconsole/robotics", "/obj/machinery/computer/rdconsole", {
	id: 2,
	name: "Robotics R&D Console",
	desc: "A console used to interface with R&D tools.",
	req_access: null,
	req_access_txt: "29",
});

// /obj/machinery/computer/rdconsole/robotics/proc/<init>  (code/modules/research/rdconsole.dm:1067)
rt.def("/obj/machinery/computer/rdconsole/robotics/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", null);
	return f.dot;
});

// /obj/machinery/computer/rdconsole/robotics/proc/Initialize  (code/modules/research/rdconsole.dm:1071)  may sleep
rt.def("/obj/machinery/computer/rdconsole/robotics/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (!truthy(rt.sv(f, "circuit"))) return f.dot;
	rt.setFv(f, "name", rt.sv(f, "circuit"), "R&D Console - Robotics (Computer Board)");
	rt.setFv(f, "build_path", rt.sv(f, "circuit"), T("/obj/machinery/computer/rdconsole/robotics"));
	return f.dot;
}, true);
