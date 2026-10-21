// From code/game/objects/items/robot/robot_parts.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9859, "/obj/item/robot_suit", "/obj/item", {
	l_arm: null,
	r_arm: null,
	l_leg: null,
	r_leg: null,
	chest: null,
	head: null,
	created_name: "",
	forced_ai: null,
	locomotion: 1,
	lawsync: 1,
	aisync: 1,
	panel_locked: 1,
	name: "cyborg endoskeleton",
	desc: "A complex metal backbone with standard limb sockets and pseudomuscle anchors.",
	icon: rt.rsc("icons/obj/robot_parts.dmi"),
	icon_state: "robo_suit",
});

// /obj/item/robot_suit/proc/New  (code/game/objects/items/robot/robot_parts.dm:26)  may sleep
rt.def("/obj/item/robot_suit/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "updateicon");
	return f.dot;
}, true);

rt.type(9860, "/obj/item/robot_suit/prebuilt", "/obj/item/robot_suit", {});

// /obj/item/robot_suit/prebuilt/proc/New  (code/game/objects/items/robot/robot_parts.dm:30)  may sleep
rt.def("/obj/item/robot_suit/prebuilt/proc/New", function* New(f: Frame) {
	rt.setSv(f, "l_arm", (yield* g.new_(f, T("/obj/item/bodypart/l_arm/robot"), [live(f.src)])));
	rt.setSv(f, "r_arm", (yield* g.new_(f, T("/obj/item/bodypart/r_arm/robot"), [live(f.src)])));
	rt.setSv(f, "l_leg", (yield* g.new_(f, T("/obj/item/bodypart/l_leg/robot"), [live(f.src)])));
	rt.setSv(f, "r_leg", (yield* g.new_(f, T("/obj/item/bodypart/r_leg/robot"), [live(f.src)])));
	rt.setSv(f, "head", (yield* g.new_(f, T("/obj/item/bodypart/head/robot"), [live(f.src)])));
	rt.setFv(f, "flash1", rt.sv(f, "head"), (yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [rt.sv(f, "head")])));
	rt.setFv(f, "flash2", rt.sv(f, "head"), (yield* g.new_(f, T("/obj/item/device/assembly/flash/handheld"), [rt.sv(f, "head")])));
	rt.setSv(f, "chest", (yield* g.new_(f, T("/obj/item/bodypart/chest/robot"), [live(f.src)])));
	rt.setFv(f, "wired", rt.sv(f, "chest"), 1);
	rt.setFv(f, "cell", rt.sv(f, "chest"), (yield* g.new_(f, T("/obj/item/weapon/stock_parts/cell/high/plus"), [rt.sv(f, "chest")])));
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true);

// /obj/item/robot_suit/proc/updateicon  (code/game/objects/items/robot/robot_parts.dm:43)
rt.def("/obj/item/robot_suit/proc/updateicon", function updateicon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "l_arm"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "l_arm"))])]);
	}
	if (truthy(rt.sv(f, "r_arm"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "r_arm"))])]);
	}
	if (truthy(rt.sv(f, "chest"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "chest"))])]);
	}
	if (truthy(rt.sv(f, "l_leg"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "l_leg"))])]);
	}
	if (truthy(rt.sv(f, "r_leg"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "r_leg"))])]);
	}
	if (!truthy(rt.sv(f, "head"))) return f.dot;
	rt.callSrc(f, "add_overlay", [fmt("＀+o", [rt.fv(f, "icon_state", rt.sv(f, "head"))])]);
	return f.dot;
});

// /obj/item/robot_suit/proc/check_completion  (code/game/objects/items/robot/robot_parts.dm:58)
rt.def("/obj/item/robot_suit/proc/check_completion", function check_completion(f: Frame) {
	if ((truthy(rt.fv(f, "l_arm", live(f.src))) && truthy(rt.fv(f, "r_arm", live(f.src))))) {
		if ((truthy(rt.fv(f, "l_leg", live(f.src))) && truthy(rt.fv(f, "r_leg", live(f.src))))) {
			if ((truthy(rt.fv(f, "chest", live(f.src))) && truthy(rt.fv(f, "head", live(f.src))))) {
				return 1;
			}
		}
	}
	return 0;
});

// /obj/item/robot_suit/proc/attackby  (code/game/objects/items/robot/robot_parts.dm:67)  may sleep
rt.def("/obj/item/robot_suit/proc/attackby", function* attackby(f: Frame) {
	let M: Value = null, B: Value = null, holding_this: Value = null, CH: Value = null, HD: Value = null, X: Value = null, BM: Value = null, O: Value = null, O_1: Value = null;
	let $e: any;
	f.vars = () => [M, B, holding_this, CH, HD, X, BM, O, O_1, $e];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/metal")) ? 1 : 0))) {
		M = live(f.args[0]);
		if ((((((!truthy(rt.sv(f, "l_arm")) && !truthy(rt.sv(f, "r_arm"))) && !truthy(rt.sv(f, "l_leg"))) && !truthy(rt.sv(f, "r_leg"))) && !truthy(rt.sv(f, "chest"))) && !truthy(rt.sv(f, "head")))) {
			if (truthy((yield* g.callName(f, live(M), "use", [1])))) {
				rt.setFv(f, "loc", (B = (yield* g.new_(f, T("/obj/item/weapon/ed209_assembly"), []))), rt.getStep(f, live(f.src), 0));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You arm the robot frame.</span>"]);
				holding_this = (isEqual((yield* g.callName(f, live(f.args[1]), "get_inactive_held_item", [])), live(f.src)) ? 1 : 0);
				yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				if (truthy(live(holding_this))) {
					yield* g.callName(f, live(f.args[1]), "put_in_inactive_hand", [live(B)]);
				}
			} else {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need one sheet of metal to start building ED-209!</span>"]);
				return live(f.dot);
			}
		}
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_leg/robot")) ? 1 : 0))) {
			if (truthy(rt.fv(f, "l_leg", live(f.src)))) {
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
				return live(f.dot);
			}
			rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, live(f.args[0]), "icon_state"));
			yield* g.callName(f, live(f.args[0]), "cut_overlays", []);
			rt.setFv(f, "l_leg", live(f.src), live(f.args[0]));
			yield* g.callName(f, live(f.src), "updateicon", []);
		} else {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_leg/robot")) ? 1 : 0))) {
				if (truthy(rt.fv(f, "r_leg", live(f.src)))) {
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
					return live(f.dot);
				}
				rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, live(f.args[0]), "icon_state"));
				yield* g.callName(f, live(f.args[0]), "cut_overlays", []);
				rt.setFv(f, "r_leg", live(f.src), live(f.args[0]));
				yield* g.callName(f, live(f.src), "updateicon", []);
			} else {
				if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/l_arm/robot")) ? 1 : 0))) {
					if (truthy(rt.fv(f, "l_arm", live(f.src)))) {
						return live(f.dot);
					}
					if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
						return live(f.dot);
					}
					rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, live(f.args[0]), "icon_state"));
					yield* g.callName(f, live(f.args[0]), "cut_overlays", []);
					rt.setFv(f, "l_arm", live(f.src), live(f.args[0]));
					yield* g.callName(f, live(f.src), "updateicon", []);
				} else {
					if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/r_arm/robot")) ? 1 : 0))) {
						if (truthy(rt.fv(f, "r_arm", live(f.src)))) {
							return live(f.dot);
						}
						if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
							return live(f.dot);
						}
						rt.setFv(f, "icon_state", live(f.args[0]), rt.initial(f, live(f.args[0]), "icon_state"));
						yield* g.callName(f, live(f.args[0]), "cut_overlays", []);
						rt.setFv(f, "r_arm", live(f.src), live(f.args[0]));
						yield* g.callName(f, live(f.src), "updateicon", []);
					} else {
						if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/chest/robot")) ? 1 : 0))) {
							CH = live(f.args[0]);
							if (truthy(rt.fv(f, "chest", live(f.src)))) {
								return live(f.dot);
							}
							if ((truthy(rt.fv(f, "wired", live(CH))) && truthy(rt.fv(f, "cell", live(CH))))) {
								if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(CH), live(f.src)])))) {
									return live(f.dot);
								}
								rt.setFv(f, "icon_state", live(CH), rt.initial(f, live(CH), "icon_state"));
								yield* g.callName(f, live(CH), "cut_overlays", []);
								rt.setFv(f, "chest", live(f.src), live(CH));
								yield* g.callName(f, live(f.src), "updateicon", []);
							} else {
								if (!truthy(rt.fv(f, "wired", live(CH)))) {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to attach wires to it first!</span>"]);
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to attach a cell to it first!</span>"]);
								}
							}
						} else {
							if (truthy((rt.istype(live(f.args[0]), T("/obj/item/bodypart/head/robot")) ? 1 : 0))) {
								HD = live(f.args[0]);
								X = null;
								rt.forList(f, 0, rt.fv(f, "contents", live(HD)));
								while (($e = rt.next(f, 0)) !== undefined) {
									X = $e;
									if (truthy((rt.istype(live(X), T("/obj/item/organ")) ? 1 : 0))) {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>There are organs inside ＀!</span>", [live(HD)])]);
										return live(f.dot);
									}
								}
								rt.endFor(f, 0);
								if (truthy(rt.fv(f, "head", live(f.src)))) {
									return live(f.dot);
								}
								if ((truthy(rt.fv(f, "flash2", live(HD))) && truthy(rt.fv(f, "flash1", live(HD))))) {
									if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(HD), live(f.src)])))) {
										return live(f.dot);
									}
									rt.setFv(f, "icon_state", live(HD), rt.initial(f, live(HD), "icon_state"));
									yield* g.callName(f, live(HD), "cut_overlays", []);
									rt.setFv(f, "head", live(f.src), live(HD));
									yield* g.callName(f, live(f.src), "updateicon", []);
								} else {
									yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need to attach a flash to it first!</span>"]);
								}
							} else {
								if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
									if (truthy((yield* g.srcCall(f, "check_completion")))) {
										yield* g.srcCall(f, "Interact", live(f.args[1]));
									} else {
										yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The endoskeleton must be assembled before debugging can begin!</span>"]);
									}
								} else {
									if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mmi")) ? 1 : 0))) {
										M = live(f.args[0]);
										if (truthy((yield* g.srcCall(f, "check_completion")))) {
											if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You can't put ＀ in, the frame has to be standing on the ground to be perfectly precise!</span>", [live(M)])]);
												return live(f.dot);
											}
											if (!truthy(rt.fv(f, "brainmob", live(M)))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Sticking an empty ＀ into the frame would sort of defeat the purpose!</span>", [rt.fv(f, "name", live(M))])]);
												return live(f.dot);
											}
											if ((!truthy(rt.gv(f, "key", (BM = rt.fv(f, "brainmob", live(M))))) || !truthy(rt.fv(f, "mind", live(BM))))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The MMI indicates that their mind is completely unresponsive; there's no point!</span>"]);
												return live(f.dot);
											}
											if (!truthy(rt.fv(f, "client", live(BM)))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The MMI indicates that their mind is currently inactive; it might change!</span>"]);
												return live(f.dot);
											}
											if ((isEqual(rt.fv(f, "stat", live(BM)), 2) || (truthy(rt.fv(f, "brain", live(M))) && truthy(rt.gv(f, "damaged_brain", rt.fv(f, "brain", live(M))))))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>Sticking a dead brain into the frame would sort of defeat the purpose!</span>"]);
												return live(f.dot);
											}
											if (truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [live(BM), "Cyborg"])))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>This ＀ does not seem to fit!</span>", [rt.fv(f, "name", live(M))])]);
												return live(f.dot);
											}
											if (!truthy((yield* g.callName(f, live(f.args[1]), "temporarilyRemoveItemFromInventory", [live(f.args[0])])))) {
												return live(f.dot);
											}
											if (!truthy((O = (yield* g.new_(f, T("/mob/living/silicon/robot"), [rt.getStep(f, rt.sv(f, "loc"), 0)]))))) {
												return live(f.dot);
											}
											if ((truthy(rt.fv(f, "laws", live(M))) && !isEqual(rt.gv(f, "id", rt.fv(f, "laws", live(M))), "default"))) {
												rt.setSv(f, "aisync", 0);
												rt.setSv(f, "lawsync", 0);
												rt.setFv(f, "laws", live(O), rt.fv(f, "laws", live(M)));
												yield* g.callName(f, rt.fv(f, "laws", live(M)), "associate", [live(O)]);
											}
											rt.setFv(f, "invisibility", live(O), 0);
											rt.setFv(f, "custom_name", live(O), rt.sv(f, "created_name"));
											rt.setFv(f, "locked", live(O), rt.sv(f, "panel_locked"));
											if (!truthy(rt.sv(f, "aisync"))) {
												rt.setSv(f, "lawsync", 0);
												rt.setFv(f, "connected_ai", live(O), null);
											} else {
												yield* g.callName(f, live(O), "notify_ai", [1]);
												if (truthy(rt.sv(f, "forced_ai"))) {
													rt.setFv(f, "connected_ai", live(O), rt.sv(f, "forced_ai"));
												}
											}
											if (!truthy(rt.sv(f, "lawsync"))) {
												rt.setFv(f, "lawupdate", live(O), 0);
												if (isEqual(rt.gv(f, "id", rt.fv(f, "laws", live(M))), "default")) {
													yield* g.callName(f, live(O), "make_laws", []);
												}
											}
											yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_antag_for_borging", [rt.fv(f, "mind", live(BM))]);
											if (!truthy((rt.istype(rt.fv(f, "laws", live(M)), T("/datum/ai_laws/ratvar")) ? 1 : 0))) {
												yield* g.call(f, P("/proc/remove_servant_of_ratvar"), null, [live(BM), 1]);
											}
											yield* g.callName(f, rt.fv(f, "mind", live(BM)), "transfer_to", [live(O)]);
											if ((truthy(rt.fv(f, "mind", live(O))) && truthy(rt.gv(f, "special_role", rt.fv(f, "mind", live(O)))))) {
												yield* g.callName(f, rt.fv(f, "mind", live(O)), "store_memory", ["As a cyborg, you must obey your silicon laws and master AI above all else. Your objectives will consider you to be dead."]);
												yield* g.call(f, P("/proc/to_chat"), null, [live(O), "<span class='userdanger'>You have been robotized!</span>"]);
												yield* g.call(f, P("/proc/to_chat"), null, [live(O), "<span class='danger'>You must obey your silicon laws and master AI above all else. Your objectives will consider you to be dead.</span>"]);
											}
											rt.setFv(f, "job", live(O), "Cyborg");
											rt.setFv(f, "cell", live(O), rt.fv(f, "cell", rt.sv(f, "chest")));
											rt.setFv(f, "loc", rt.fv(f, "cell", rt.sv(f, "chest")), live(O));
											rt.setFv(f, "cell", rt.sv(f, "chest"), null);
											yield* g.callName(f, live(f.args[0]), "forceMove", [live(O)]);
											if (truthy(rt.fv(f, "mmi", live(O)))) {
												yield* g.call(f, P("/proc/qdel"), null, [rt.fv(f, "mmi", live(O))]);
											}
											rt.setFv(f, "mmi", live(O), live(f.args[0]));
											yield* g.callName(f, live(O), "updatename", []);
											yield* g.srcCall(f, "forceMove", live(O));
											rt.setFv(f, "robot_suit", live(O), live(f.src));
											if (!truthy(rt.sv(f, "locomotion"))) {
												rt.setFv(f, "lockcharge", live(O), 1);
												yield* g.callName(f, live(O), "update_canmove", []);
												yield* g.call(f, P("/proc/to_chat"), null, [live(O), "<span class='warning'>Error: Servo motors unresponsive.</span>"]);
											}
										} else {
											yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The MMI must go in after everything else!</span>"]);
										}
									} else {
										if (truthy((rt.istype(live(f.args[0]), T("/obj/item/borg/upgrade/ai")) ? 1 : 0))) {
											M = live(f.args[0]);
											if (truthy((yield* g.srcCall(f, "check_completion")))) {
												if (!truthy((yield* g.call(f, P("/proc/isturf"), null, [rt.sv(f, "loc")])))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot install＀, the frame has to be standing on the ground to be perfectly precise!</span>", [live(M)])]);
													return live(f.dot);
												}
												if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
													yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀ is stuck to your hand!</span>", [live(M)])]);
													return live(f.dot);
												}
												yield* g.call(f, P("/proc/qdel"), null, [live(M)]);
												O_1 = (yield* g.new_(f, T("/mob/living/silicon/robot/shell"), [rt.getStep(f, live(f.src), 0)]));
												if (!truthy(rt.sv(f, "aisync"))) {
													rt.setSv(f, "lawsync", 0);
													rt.setFv(f, "connected_ai", live(O_1), null);
												} else {
													if (truthy(rt.sv(f, "forced_ai"))) {
														rt.setFv(f, "connected_ai", live(O_1), rt.sv(f, "forced_ai"));
													}
													yield* g.callName(f, live(O_1), "notify_ai", [4]);
												}
												if (!truthy(rt.sv(f, "lawsync"))) {
													rt.setFv(f, "lawupdate", live(O_1), 0);
													yield* g.callName(f, live(O_1), "make_laws", []);
												}
												rt.setFv(f, "cell", live(O_1), rt.fv(f, "cell", rt.sv(f, "chest")));
												rt.setFv(f, "loc", rt.fv(f, "cell", rt.sv(f, "chest")), live(O_1));
												rt.setFv(f, "cell", rt.sv(f, "chest"), null);
												rt.setFv(f, "locked", live(O_1), rt.sv(f, "panel_locked"));
												rt.setFv(f, "job", live(O_1), "Cyborg");
												yield* g.srcCall(f, "forceMove", live(O_1));
												rt.setFv(f, "robot_suit", live(O_1), live(f.src));
												if (!truthy(rt.sv(f, "locomotion"))) {
													rt.setFv(f, "lockcharge", live(O_1), 1);
													yield* g.callName(f, live(O_1), "update_canmove", []);
												}
											}
										} else {
											if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/pen")) ? 1 : 0))) {
												yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You need to use a multitool to name ＀!</span>", [live(f.src)])]);
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
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/item/robot_suit/proc/Interact  (code/game/objects/items/robot/robot_parts.dm:292)  may sleep
rt.def("/obj/item/robot_suit/proc/Interact", function* Interact(f: Frame, user: Value) {
	let t1: Value = null, popup: Value = null;
	let $0: any, $1: any;
	f.vars = () => [user, t1, popup, $0, $1];
	$0 = live(f.src);
	if (truthy(rt.sv(f, "created_name"))) {
		$1 = fmt("＀", [rt.sv(f, "created_name")]);
	} else {
		$1 = "Default Cyborg";
	}
	t1 = fmt("Designation: <A href='?src=＃;Name=1'>＀</a><br>\n", [$0, $1]);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "forced_ai"))) {
		$1 = fmt("＀", [rt.fv(f, "name", rt.sv(f, "forced_ai"))]);
	} else {
		$1 = "Automatic";
	}
	t1 = rt.modify(live(t1), fmt("Master AI: <A href='?src=＃;Master=1'>＀</a><br><br>\n", [$0, $1]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "lawsync"))) {
		$1 = "Open";
	} else {
		$1 = "Closed";
	}
	t1 = rt.modify(live(t1), fmt("LawSync Port: <A href='?src=＃;Law=1'>＀</a><br>\n", [$0, $1]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "aisync"))) {
		$1 = "Open";
	} else {
		$1 = "Closed";
	}
	t1 = rt.modify(live(t1), fmt("AI Connection Port: <A href='?src=＃;AI=1'>＀</a><br>\n", [$0, $1]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "locomotion"))) {
		$1 = "Unlocked";
	} else {
		$1 = "Locked";
	}
	t1 = rt.modify(live(t1), fmt("Servo Motor Functions: <A href='?src=＃;Loco=1'>＀</a><br>\n", [$0, $1]), add);
	$0 = live(f.src);
	if (truthy(rt.sv(f, "panel_locked"))) {
		$1 = "Engaged";
	} else {
		$1 = "Disengaged";
	}
	t1 = rt.modify(live(t1), fmt("Panel Lock: <A href='?src=＃;Panel=1'>＀</a><br>\n", [$0, $1]), add);
	yield* g.callName(f, (popup = (yield* g.new_(f, T("/datum/browser"), [live(user), "robotdebug", "Cyborg Boot Debug", 310, 220]))), "set_content", [live(t1)]);
	yield* g.callName(f, live(popup), "open", []);
	return f.dot;
}, true);

// /obj/item/robot_suit/proc/Topic  (code/game/objects/items/robot/robot_parts.dm:304)  may sleep
rt.def("/obj/item/robot_suit/proc/Topic", function* Topic(f: Frame, href: Value, href_list: Value) {
	let living_user: Value = null, item_in_hand: Value = null, new_name: Value = null;
	f.vars = () => [href, href_list, living_user, item_in_hand, new_name];
	if ((truthy((yield* g.callName(f, live(f.usr), "incapacitated", []))) || !truthy((yield* g.srcCall(f, "Adjacent", live(f.usr)))))) {
		return live(f.dot);
	}
	living_user = live(f.usr);
	if (!truthy((rt.istype((item_in_hand = (yield* g.callName(f, live(living_user), "get_active_held_item", []))), T("/obj/item/device/multitool")) ? 1 : 0))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(living_user), "<span class='warning'>You need a multitool!</span>"]);
		return live(f.dot);
	}
	if (truthy(rt.at(live(href_list), "Name"))) {
		new_name = (yield* g.call(f, P("/proc/reject_bad_name"), null, [(yield* g.op(f, "Prompt", [2], [rt.fv(f, "created_name", live(f.src)), "Cyborg Debug", "Enter new designation. Set to blank to reset to default.", live(f.usr), null])), 1]));
		if ((!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.usr)])), 1) && !isEqual(rt.fv(f, "loc", live(f.src)), live(f.usr)))) {
			return live(f.dot);
		}
		if (truthy(live(new_name))) {
			rt.setSv(f, "created_name", live(new_name));
		} else {
			rt.setSv(f, "created_name", "");
		}
	} else {
		if (truthy(rt.at(live(href_list), "Master"))) {
			rt.setSv(f, "forced_ai", (yield* g.call(f, P("/proc/select_active_ai"), null, [live(f.usr)])));
			if (!truthy(rt.sv(f, "forced_ai"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.usr), "<span class='error'>No active AIs detected.</span>"]);
			}
		} else {
			if (truthy(rt.at(live(href_list), "Law"))) {
				rt.setSv(f, "lawsync", (!truthy(rt.sv(f, "lawsync")) ? 1 : 0));
			} else {
				if (truthy(rt.at(live(href_list), "AI"))) {
					rt.setSv(f, "aisync", (!truthy(rt.sv(f, "aisync")) ? 1 : 0));
				} else {
					if (truthy(rt.at(live(href_list), "Loco"))) {
						rt.setSv(f, "locomotion", (!truthy(rt.sv(f, "locomotion")) ? 1 : 0));
					} else {
						if (truthy(rt.at(live(href_list), "Panel"))) {
							rt.setSv(f, "panel_locked", (!truthy(rt.sv(f, "panel_locked")) ? 1 : 0));
						}
					}
				}
			}
		}
	}
	yield* g.srcCall(f, "add_fingerprint", live(f.usr));
	yield* g.srcCall(f, "Interact", live(f.usr));
	return f.dot;
}, true);
