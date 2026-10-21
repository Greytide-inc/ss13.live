// From code/game/objects/structures/door_assembly.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12410, "/obj/structure/door_assembly", "/obj/structure", {
	maker: null,
	overlays_file: rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"),
	state: 0,
	mineral: null,
	typetext: "",
	icontext: "",
	electronics: null,
	airlock_type: rt.typePath("/obj/machinery/door/airlock"),
	glass_type: rt.typePath("/obj/machinery/door/airlock/glass"),
	created_name: null,
	heat_proof_finished: 0,
	material: null,
	anchored: 0,
	name: "airlock assembly",
	icon: rt.rsc("icons/obj/doors/airlocks/station/public.dmi"),
	icon_state: "construction",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/structure/door_assembly/proc/New  (code/game/objects/structures/door_assembly.dm:22)  may sleep
rt.def("/obj/structure/door_assembly/proc/New", function* New(f: Frame) {
	yield* g.srcCall(f, "update_icon");
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/structure/door_assembly/proc/attackby  (code/game/objects/structures/door_assembly.dm:368)  may sleep
rt.def("/obj/structure/door_assembly/proc/attackby", function* attackby(f: Frame) {
	let t: Value = null, WT: Value = null, icontype: Value = null, optionlist: Value = null, has_solid: Value = null, has_glass: Value = null, door_check: Value = null, D: Value = null, C: Value = null, ae: Value = null, G: Value = null, M: Value = null, door: Value = null;
	let $0: any, $e: any;
	f.vars = () => [t, WT, icontype, optionlist, has_solid, has_glass, door_check, D, C, ae, G, M, door, $0, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
		if (!truthy((t = (yield* g.call(f, P("/proc/stripped_input"), null, [live(f.args[1]), "Enter the name for the door.", rt.fv(f, "name", live(f.src)), rt.fv(f, "created_name", live(f.src)), 42]))))) {
			return live(f.dot);
		}
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr)))) {
			return live(f.dot);
		}
		rt.setSv(f, "created_name", live(t));
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/airlock_painter")) ? 1 : 0))) {
			if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "can_use", [live(f.args[1])])))) {
				icontype = null;
				optionlist = null;
				if ((truthy(rt.sv(f, "mineral")) && isEqual(rt.sv(f, "mineral"), "glass"))) {
					optionlist = rt.list("Public", "Public2", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Science", "Mining");
				} else {
					optionlist = rt.list("Public", "Engineering", "Atmospherics", "Security", "Command", "Medical", "Research", "Science", "Mining", "Maintenance", "External", "High Security");
				}
				icontype = (yield* g.op(f, "Prompt", [0], [null, null, "Please select a paintjob for this airlock.", live(f.args[1]), live(optionlist)]));
				if (((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr))) || !truthy((yield* g.callName(f, live(WT), "use", [live(f.args[1])]))))) {
					return live(f.dot);
				}
				has_solid = 0;
				has_glass = 0;
				$0 = live(icontype);
				if ($0 === "Public") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/public.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "");
					rt.setSv(f, "icontext", "");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Public2") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station2/glass.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station2/overlays.dmi"));
					rt.setSv(f, "typetext", "");
					rt.setSv(f, "icontext", "");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Engineering") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/engineering.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "engineering");
					rt.setSv(f, "icontext", "eng");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Atmospherics") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/atmos.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "atmos");
					rt.setSv(f, "icontext", "atmo");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Security") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/security.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "security");
					rt.setSv(f, "icontext", "sec");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Command") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/command.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "command");
					rt.setSv(f, "icontext", "com");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Medical") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/medical.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "medical");
					rt.setSv(f, "icontext", "med");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Research") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/research.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "research");
					rt.setSv(f, "icontext", "res");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Science") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/science.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "research");
					rt.setSv(f, "icontext", "res");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Mining") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/mining.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "mining");
					rt.setSv(f, "icontext", "min");
					has_solid = 1;
					has_glass = 1;
				} else if ($0 === "Maintenance") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/station/maintenance.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/station/overlays.dmi"));
					rt.setSv(f, "typetext", "maintenance");
					rt.setSv(f, "icontext", "mai");
					has_solid = 1;
					has_glass = 0;
				} else if ($0 === "External") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/external/external.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/external/overlays.dmi"));
					rt.setSv(f, "typetext", "external");
					rt.setSv(f, "icontext", "ext");
					has_solid = 1;
					has_glass = 0;
				} else if ($0 === "High Security") {
					rt.setSv(f, "icon", rt.rsc("icons/obj/doors/airlocks/highsec/highsec.dmi"));
					rt.setSv(f, "overlays_file", rt.rsc("icons/obj/doors/airlocks/highsec/overlays.dmi"));
					rt.setSv(f, "typetext", "highsecurity");
					rt.setSv(f, "icontext", "highsec");
					has_solid = 1;
					has_glass = 0;
				}
				if (truthy(live(has_solid))) {
					rt.setSv(f, "airlock_type", (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/machinery/door/airlock/＀", [rt.sv(f, "typetext")])])));
				} else {
					rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock"));
				}
				if (truthy(live(has_glass))) {
					rt.setSv(f, "glass_type", (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/machinery/door/airlock/glass_＀", [rt.sv(f, "typetext")])])));
				} else {
					rt.setSv(f, "glass_type", T("/obj/machinery/door/airlock/glass"));
				}
				if ((truthy(rt.sv(f, "mineral")) && !isEqual(rt.sv(f, "mineral"), "glass"))) {
					rt.setSv(f, "mineral", null);
				}
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You change the paintjob on the airlock assembly.</span>"]);
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !truthy(rt.sv(f, "anchored")))) {
				if (truthy((yield* g.callName(f, (WT = live(f.args[0])), "remove_fuel", [0, live(f.args[1])])))) {
					yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("<span class='warning'>＀ disassembles the airlock assembly.</span>", [live(f.args[1])]), "You start to disassemble the airlock assembly..."]);
					yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
					if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
						if (!truthy((yield* g.callName(f, live(WT), "isOn", [])))) {
							return live(f.dot);
						}
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disassemble the airlock assembly.</span>"]);
						yield* g.srcCall(f, "deconstruct", 1);
					}
				}
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
					if (!truthy(rt.sv(f, "anchored"))) {
						door_check = 1;
						D = null;
						rt.forList(f, 0, rt.sv(f, "loc"), T("/obj/machinery/door"));
						while (($e = rt.next(f, 0)) !== undefined) {
							D = $e;
							if (!truthy(rt.fv(f, "sub_door", live(D)))) {
								door_check = 0;
								break;
							}
						}
						rt.endFor(f, 0);
						if (truthy(live(door_check))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ secures the airlock assembly to the floor.", [live(f.args[1])]), "<span class='notice'>You start to secure the airlock assembly to the floor...</span>", "<span class='italics'>You hear wrenching.</span>"]);
							if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
								if (truthy(rt.fv(f, "anchored", live(f.src)))) {
									return live(f.dot);
								}
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You secure the airlock assembly.</span>"]);
								rt.setFv(f, "name", live(f.src), "secured airlock assembly");
								rt.setFv(f, "anchored", live(f.src), 1);
							}
						} else {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "There is another door here!"]);
						}
					} else {
						yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ unsecures the airlock assembly from the floor.", [live(f.args[1])]), "<span class='notice'>You start to unsecure the airlock assembly from the floor...</span>", "<span class='italics'>You hear wrenching.</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
							if (!truthy(rt.sv(f, "anchored"))) {
								return live(f.dot);
							}
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unsecure the airlock assembly.</span>"]);
							rt.setSv(f, "name", "airlock assembly");
							rt.setSv(f, "anchored", 0);
						}
					}
				} else {
					if (((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 0)) && truthy(rt.sv(f, "anchored")))) {
						if (rt.lt((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 1)) {
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one length of cable to wire the airlock assembly!</span>"]);
							return live(f.dot);
						}
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ wires the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to wire the airlock assembly...</span>"]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
							if ((rt.lt((yield* g.callName(f, live(C), "get_amount", [])), 1) || !isEqual(rt.sv(f, "state"), 0))) {
								return live(f.dot);
							}
							yield* g.callName(f, live(C), "use", [1]);
							rt.setFv(f, "state", live(f.src), 1);
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You wire the airlock assembly.</span>"]);
							rt.setFv(f, "name", live(f.src), "wired airlock assembly");
						}
					} else {
						if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 1))) {
							yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
							yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ cuts the wires from the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to cut the wires from the airlock assembly...</span>"]);
							if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
								if (!isEqual(rt.fv(f, "state", live(f.src)), 1)) {
									return live(f.dot);
								}
								yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You cut the wires from the airlock assembly.</span>"]);
								yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.getStep(f, live(f.args[1]), 0), 1]);
								rt.setFv(f, "state", live(f.src), 0);
								rt.setFv(f, "name", live(f.src), "secured airlock assembly");
							}
						} else {
							if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/electronics/airlock")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 1))) {
								yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
								yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ installs the electronics into the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to install electronics into the airlock assembly...</span>"]);
								if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
									if (!isEqual(rt.fv(f, "state", live(f.src)), 1)) {
										return live(f.dot);
									}
									if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
										return live(f.dot);
									}
									rt.setFv(f, "loc", live(f.args[0]), live(f.src));
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install the airlock electronics.</span>"]);
									rt.setFv(f, "state", live(f.src), 2);
									rt.setFv(f, "name", live(f.src), "near finished airlock assembly");
									rt.setFv(f, "electronics", live(f.src), live(f.args[0]));
								}
							} else {
								if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 2))) {
									yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
									yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ removes the electronics from the airlock assembly.", [live(f.args[1])]), "<span class='notice'>You start to remove electronics from the airlock assembly...</span>"]);
									if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
										if (!isEqual(rt.fv(f, "state", live(f.src)), 2)) {
											return live(f.dot);
										}
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the airlock electronics.</span>"]);
										rt.setFv(f, "state", live(f.src), 1);
										rt.setFv(f, "name", live(f.src), "wired airlock assembly");
										ae = null;
										if (!truthy(rt.sv(f, "electronics"))) {
											ae = (yield* g.new_(f, T("/obj/item/weapon/electronics/airlock"), [rt.fv(f, "loc", live(f.src))]));
										} else {
											ae = rt.sv(f, "electronics");
											rt.setSv(f, "electronics", null);
											rt.setFv(f, "loc", live(ae), rt.fv(f, "loc", live(f.src)));
										}
									}
								} else {
									if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet")) ? 1 : 0)) && !truthy(rt.sv(f, "mineral")))) {
										if (truthy((G = live(f.args[0])))) {
											if (rt.ge((yield* g.callName(f, live(G), "get_amount", [])), 1)) {
												if ((truthy((rt.istype(live(G), T("/obj/item/stack/sheet/rglass")) ? 1 : 0)) || truthy((rt.istype(live(G), T("/obj/item/stack/sheet/glass")) ? 1 : 0)))) {
													yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/crowbar.ogg"), 100, 1]);
													yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds ＀ to the airlock assembly.", [live(f.args[1]), rt.fv(f, "name", live(G))]), fmt("<span class='notice'>You start to install ＀ into the airlock assembly...</span>", [rt.fv(f, "name", live(G))])]);
													if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
														if ((rt.lt((yield* g.callName(f, live(G), "get_amount", [])), 1) || truthy(rt.sv(f, "mineral")))) {
															return live(f.dot);
														}
														if (isEqual(rt.fv(f, "type", live(G)), T("/obj/item/stack/sheet/rglass"))) {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install reinforced glass windows into the airlock assembly.</span>"]);
															rt.setSv(f, "heat_proof_finished", 1);
															rt.setSv(f, "name", "near finished heat-proofed window airlock assembly");
														} else {
															yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You install regular glass windows into the airlock assembly.</span>"]);
															rt.setSv(f, "name", "near finished window airlock assembly");
														}
														yield* g.callName(f, live(G), "use", [1]);
														rt.setSv(f, "mineral", "glass");
														rt.setSv(f, "material", "glass");
														if (truthy((rt.isIn(f, rt.sv(f, "icontext"), rt.list("eng", "atmo", "sec", "com", "med", "res", "min")) ? 1 : 0))) {
															rt.setFv(f, "airlock_type", live(f.src), (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/machinery/door/airlock/＀", [rt.sv(f, "typetext")])])));
															rt.setFv(f, "glass_type", live(f.src), (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/machinery/door/airlock/glass_＀", [rt.sv(f, "typetext")])])));
														} else {
															rt.setSv(f, "airlock_type", T("/obj/machinery/door/airlock"));
															rt.setSv(f, "glass_type", T("/obj/machinery/door/airlock/glass"));
															rt.setSv(f, "typetext", "");
															rt.setSv(f, "icontext", "");
														}
													}
												} else {
													if (truthy((rt.istype(live(G), T("/obj/item/stack/sheet/mineral")) ? 1 : 0))) {
														M = rt.fv(f, "sheettype", live(G));
														if (rt.ge((yield* g.callName(f, live(G), "get_amount", [])), 2)) {
															yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/items/crowbar.ogg"), 100, 1]);
															yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ adds ＀ to the airlock assembly.", [live(f.args[1]), rt.fv(f, "name", live(G))]), fmt("<span class='notice'>You start to install ＀ into the airlock assembly...</span>", [rt.fv(f, "name", live(G))])]);
															if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 40, "target", live(f.src)], rt.Args.Named)))) {
																if ((rt.lt((yield* g.callName(f, live(G), "get_amount", [])), 2) || truthy(rt.sv(f, "mineral")))) {
																	return live(f.dot);
																}
																yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You install ＀ plating into the airlock assembly.</span>", [live(M)])]);
																yield* g.callName(f, live(G), "use", [2]);
																rt.setSv(f, "mineral", fmt("＀", [live(M)]));
																rt.setSv(f, "name", fmt("near finished ＀ airlock assembly", [live(M)]));
																rt.setSv(f, "airlock_type", (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/machinery/door/airlock/＀", [live(M)])])));
																rt.setSv(f, "glass_type", T("/obj/machinery/door/airlock/glass"));
															}
														}
													}
												}
											}
										}
									} else {
										if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && isEqual(rt.sv(f, "state"), 2))) {
											yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.fv(f, "usesound", live(f.args[0])), 100, 1]);
											yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ finishes the airlock.", [live(f.args[1])]), "<span class='notice'>You start finishing the airlock...</span>"]);
											if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
												if ((truthy(rt.fv(f, "loc", live(f.src))) && isEqual(rt.sv(f, "state"), 2))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You finish the airlock.</span>"]);
													door = null;
													if (isEqual(rt.sv(f, "mineral"), "glass")) {
														door = (yield* g.new_(f, rt.fv(f, "glass_type", live(f.src)), [rt.fv(f, "loc", live(f.src))]));
													} else {
														door = (yield* g.new_(f, rt.fv(f, "airlock_type", live(f.src)), [rt.fv(f, "loc", live(f.src))]));
													}
													rt.setFv(f, "electronics", live(door), rt.fv(f, "electronics", live(f.src)));
													rt.setFv(f, "heat_proof", live(door), rt.fv(f, "heat_proof_finished", live(f.src)));
													if (truthy(rt.gv(f, "one_access", rt.fv(f, "electronics", live(f.src))))) {
														rt.setFv(f, "req_one_access", live(door), rt.gv(f, "accesses", rt.fv(f, "electronics", live(f.src))));
													} else {
														rt.setFv(f, "req_access", live(door), rt.gv(f, "accesses", rt.fv(f, "electronics", live(f.src))));
													}
													if (truthy(rt.sv(f, "created_name"))) {
														rt.setFv(f, "name", live(door), rt.sv(f, "created_name"));
													}
													rt.setFv(f, "loc", rt.fv(f, "electronics", live(f.src)), live(door));
													yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
												}
											}
										} else {
											return (yield* g.callSuper(f, [], rt.Args.Same));
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
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/structure/door_assembly/proc/update_icon  (code/game/objects/structures/door_assembly.dm:690)
rt.def("/obj/structure/door_assembly/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "material"))) {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/get_airlock_overlay"), null, ["fill_construction", rt.sv(f, "icon")])]);
	} else {
		rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("＀_construction", [rt.sv(f, "material")]), rt.sv(f, "overlays_file")])]);
	}
	rt.callSrc(f, "add_overlay", [rt.call(f, P("/proc/get_airlock_overlay"), null, [fmt("panel_c＀", [add(rt.sv(f, "state"), 1)]), rt.sv(f, "overlays_file")])]);
	return f.dot;
});

// /obj/structure/door_assembly/proc/deconstruct  (code/game/objects/structures/door_assembly.dm:699)  may sleep
rt.def("/obj/structure/door_assembly/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	let _T: Value = null, metal_amt: Value = null, mineral_path: Value = null;
	f.vars = () => [disassembled, _T, metal_amt, mineral_path];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		_T = rt.getStep(f, live(f.src), 0);
		metal_amt = 4;
		if (!truthy(live(disassembled))) {
			metal_amt = (yield* g.call(f, P("/proc/rand"), null, [2, 4]));
		}
		yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [live(_T), live(metal_amt)]);
		if (truthy(rt.sv(f, "mineral"))) {
			if (isEqual(rt.sv(f, "mineral"), "glass")) {
				if (truthy(live(disassembled))) {
					if (truthy(rt.sv(f, "heat_proof_finished"))) {
						yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [live(_T)]);
					} else {
						yield* g.new_(f, T("/obj/item/stack/sheet/glass"), [live(_T)]);
					}
				} else {
					yield* g.new_(f, T("/obj/item/weapon/shard"), [live(_T)]);
				}
			} else {
				mineral_path = (yield* g.call(f, P("/proc/text2path"), null, [fmt("/obj/item/stack/sheet/mineral/＀", [rt.sv(f, "mineral")])]));
				yield* g.new_(f, live(mineral_path), [live(_T), 2]);
			}
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
