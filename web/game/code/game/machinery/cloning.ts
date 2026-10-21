// From code/game/machinery/cloning.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10785, "/obj/machinery/clonepod", "/obj/machinery", {
	heal_level: null,
	connected: null,
	mess: 0,
	attempting: 0,
	speed_coeff: null,
	efficiency: null,
	clonemind: null,
	grab_ghost_when: "mature",
	radio: null,
	radio_key: rt.typePath("/obj/item/device/encryptionkey/headset_med"),
	radio_channel: "Medical",
	countdown: null,
	unattached_flesh: null,
	flesh_number: 0,
	anchored: 1,
	verb_say: "states",
	name: "cloning pod",
	desc: "An electronically-lockable pod for growing organic tissue.",
	density: 1,
	icon: rt.rsc("icons/obj/cloning.dmi"),
	icon_state: "pod_0",
	req_access: null,
}, { global: { brine_types: 753 } });

// /obj/machinery/clonepod/proc/<init>  (code/game/machinery/cloning.dm:18)
rt.def("/obj/machinery/clonepod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_access", rt.list(68));
	return f.dot;
});

// /obj/machinery/clonepod/proc/Initialize  (code/game/machinery/cloning.dm:48)  may sleep
rt.def("/obj/machinery/clonepod/proc/Initialize", function* Initialize(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.callName(f, (B = (yield* g.new_(f, T("/obj/item/weapon/circuitboard/machine/clonepod"), [null]))), "apply_default_parts", [live(f.src)]);
	rt.setSv(f, "countdown", (yield* g.new_(f, T("/obj/effect/countdown/clonepod"), [live(f.src)])));
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "keyslot", rt.sv(f, "radio"), (yield* g.new_(f, rt.sv(f, "radio_key"), [])));
	rt.setFv(f, "subspace_transmission", rt.sv(f, "radio"), 1);
	rt.setFv(f, "canhear_range", rt.sv(f, "radio"), 0);
	yield* g.callName(f, rt.sv(f, "radio"), "recalculateChannels", []);
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/Destroy  (code/game/machinery/cloning.dm:61)  may sleep
rt.def("/obj/machinery/clonepod/proc/Destroy", function* Destroy(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	yield* g.srcCall(f, "go_out");
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
	rt.setSv(f, "radio", null);
	yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "countdown")]);
	rt.setSv(f, "countdown", null);
	if (truthy(rt.sv(f, "connected"))) {
		yield* g.callName(f, rt.sv(f, "connected"), "DetachCloner", [live(f.src)]);
	}
	i = null;
	rt.forList(f, 0, rt.sv(f, "unattached_flesh"));
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(i)]);
	}
	rt.endFor(f, 0);
	if (truthy(rt.sv(f, "unattached_flesh"))) {
		yield* g.callName(f, rt.sv(f, "unattached_flesh"), "Cut", []);
	}
	rt.setSv(f, "unattached_flesh", null);
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/RefreshParts  (code/game/machinery/cloning.dm:77)
rt.def("/obj/machinery/clonepod/proc/RefreshParts", function RefreshParts(f: Frame) {
	let S: Value = null, _P: Value = null;
	let $e: any;
	f.vars = () => [S, _P, $e];
	rt.setSv(f, "speed_coeff", 0);
	rt.setSv(f, "efficiency", 0);
	S = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/scanning_module"));
	while (($e = rt.next(f, 0)) !== undefined) {
		S = $e;
		rt.modSrcVar(f, "efficiency", rt.fv(f, "rating", live(S)), add);
	}
	rt.endFor(f, 0);
	_P = null;
	rt.forList(f, 0, rt.sv(f, "component_parts"), T("/obj/item/weapon/stock_parts/manipulator"));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.modSrcVar(f, "speed_coeff", rt.fv(f, "rating", live(_P)), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "heal_level", add(multiply(rt.sv(f, "efficiency"), 15), 10));
	if (rt.lt(rt.sv(f, "heal_level"), 40)) {
		rt.setSv(f, "heal_level", 40);
	}
	if (!rt.gt(rt.sv(f, "heal_level"), 100)) return f.dot;
	rt.setSv(f, "heal_level", 100);
	return f.dot;
});

rt.type(6716, "/obj/item/weapon/circuitboard/machine/clonepod", "/obj/item/weapon/circuitboard/machine", {
	name: "Clone Pod (Machine Board)",
	build_path: rt.typePath("/obj/machinery/clonepod"),
	origin_tech: "programming=2;biotech=2",
	req_components: null,
});

// /obj/item/weapon/circuitboard/machine/clonepod/proc/<init>  (code/game/machinery/cloning.dm:91)
rt.def("/obj/item/weapon/circuitboard/machine/clonepod/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "req_components", rt.alist(f, [T("/obj/item/stack/cable_coil"), 2, T("/obj/item/weapon/stock_parts/scanning_module"), 2, T("/obj/item/weapon/stock_parts/manipulator"), 2, T("/obj/item/stack/sheet/glass"), 1]));
	return f.dot;
});

rt.type(6674, "/obj/item/weapon/disk/data", "/obj/item/weapon/disk", {
	fields: null,
	read_only: 0,
	name: "cloning data disk",
	icon_state: "datadisk0",
});

// /obj/item/weapon/disk/data/proc/<init>  (code/game/machinery/cloning.dm:102)
rt.def("/obj/item/weapon/disk/data/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "fields", rt.list());
	return f.dot;
});

// /obj/item/weapon/disk/data/proc/New  (code/game/machinery/cloning.dm:107)  may sleep
rt.def("/obj/item/weapon/disk/data/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "icon_state", fmt("datadisk＀", [(yield* g.call(f, P("/proc/rand"), null, [0, 6]))]));
	yield* g.srcCall(f, "add_overlay", "datadisk_gene");
	return f.dot;
}, true);

// /obj/item/weapon/disk/data/proc/attack_self  (code/game/machinery/cloning.dm:112)
rt.def("/obj/item/weapon/disk/data/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "read_only", (!truthy(rt.sv(f, "read_only")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "read_only"))) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You flip the write-protect tab to ＀.</span>", [$1])]);
	return f.dot;
});

// /obj/item/weapon/disk/data/proc/examine  (code/game/machinery/cloning.dm:116)
rt.def("/obj/item/weapon/disk/data/proc/examine", function examine(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	$0 = live(f.args[0]);
	if (truthy(rt.sv(f, "read_only"))) {
		$1 = "protected";
	} else {
		$1 = "unprotected";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("The write-protect tab is set to ＀.", [$1])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/clonepod/proc/examine  (code/game/machinery/cloning.dm:123)
rt.def("/obj/machinery/clonepod/proc/examine", function examine(f: Frame) {
	let mob_occupant: Value = null;
	f.vars = () => [mob_occupant];
	rt.callSuper(f, [], rt.Args.Same);
	mob_occupant = rt.sv(f, "occupant");
	if (truthy(rt.sv(f, "mess"))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "It's filled with blood and viscera. You swear you can see it moving..."]);
	}
	if (!(truthy(rt.callSrc(f, "is_operational", [])) && truthy(live(mob_occupant)))) return f.dot;
	if (isEqual(rt.fv(f, "stat", live(mob_occupant)), 2)) return f.dot;
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Current clone cycle is ＀% complete.", [rt.call(f, P("/proc/round"), null, [rt.callSrc(f, "get_completion", [])])])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/machinery/clonepod/proc/return_air  (code/game/machinery/cloning.dm:136)
rt.def("/obj/machinery/clonepod/proc/return_air", function return_air(f: Frame) {
	if (!truthy(rt.gl("GM"))) {
		rt.setGl("GM", rt.new_(f, T("/datum/gas_mixture/immutable/cloner"), []));
	}
	return rt.gl("GM");
});

// /obj/machinery/clonepod/proc/get_completion  (code/game/machinery/cloning.dm:142)
rt.def("/obj/machinery/clonepod/proc/get_completion", function get_completion(f: Frame) {
	let mob_occupant: Value = null;
	f.vars = () => [mob_occupant];
	f.dot = 0;
	if (!truthy((mob_occupant = rt.sv(f, "occupant")))) return f.dot;
	f.dot = multiply(100, divide(add(rt.fv(f, "health", live(mob_occupant)), 100), add(rt.sv(f, "heal_level"), 100)));
	return f.dot;
});

// /obj/machinery/clonepod/proc/attack_ai  (code/game/machinery/cloning.dm:147)
rt.def("/obj/machinery/clonepod/proc/attack_ai", function attack_ai(f: Frame, user: Value) {
	return rt.callSrc(f, "examine", [live(user)]);
});

// /obj/machinery/clonepod/proc/growclone  (code/game/machinery/cloning.dm:153)  may sleep
rt.def("/obj/machinery/clonepod/proc/growclone", function* growclone(f: Frame, ckey: Value, clonename: Value, ui: Value, se: Value, mindref: Value, mrace: Value, features: Value, factions: Value) {
	let G: Value = null, H: Value = null, B: Value = null, unclean_mutations: Value = null, M: Value = null;
	f.vars = () => [ckey, clonename, ui, se, mindref, mrace, features, factions, G, H, B, unclean_mutations, M];
	if (truthy(rt.sv(f, "panel_open"))) {
		return 0;
	}
	if ((truthy(rt.sv(f, "mess")) || truthy(rt.sv(f, "attempting")))) {
		return 0;
	}
	rt.setSv(f, "clonemind", rt.locateIn(f, live(mindref), rt.world()));
	if (!truthy((rt.istype(rt.sv(f, "clonemind"), T("/datum/mind")) ? 1 : 0))) {
		return 0;
	}
	if ((truthy(rt.fv(f, "current", rt.sv(f, "clonemind"))) && !isEqual(rt.gv(f, "stat", rt.fv(f, "current", rt.sv(f, "clonemind"))), 2))) {
		return 0;
	}
	if (truthy(rt.fv(f, "active", rt.sv(f, "clonemind")))) {
		if (!isEqual((yield* g.call(f, P("/proc/ckey"), null, [rt.fv(f, "key", rt.sv(f, "clonemind"))])), live(ckey))) {
			return 0;
		}
	} else {
		if (!truthy((G = (yield* g.callName(f, rt.sv(f, "clonemind"), "get_ghost", []))))) {
			return 0;
		}
	}
	if (truthy(rt.fv(f, "damnation_type", rt.sv(f, "clonemind")))) {
		yield* g.call(f, P("/proc/ImmediateInvokeAsync"), null, [live(f.src), P("/obj/machinery/clonepod/proc/horrifyingsound")]);
		rt.setSv(f, "mess", 1);
		rt.setSv(f, "icon_state", "pod_g");
		yield* g.srcCall(f, "update_icon");
		return 0;
	}
	rt.setSv(f, "attempting", 1);
	yield* g.callName(f, rt.sv(f, "countdown"), "start", []);
	H = (yield* g.new_(f, T("/mob/living/carbon/human"), [live(f.src)]));
	if (truthy(rt.fv(f, "changeling", rt.sv(f, "clonemind")))) {
		rt.setFv(f, "vital", (B = (yield* g.callName(f, live(H), "getorganslot", ["brain"]))), 0);
		rt.setFv(f, "decoy_override", live(B), 1);
	}
	yield* g.callName(f, live(H), "hardset_dna", [live(ui), live(se), rt.fv(f, "real_name", live(H)), null, live(mrace), live(features)]);
	if (rt.gt(rt.sv(f, "efficiency"), 2)) {
		unclean_mutations = rt.bitOr(rt.gl("not_good_mutations"), rt.gl("bad_mutations"));
		yield* g.callName(f, rt.fv(f, "dna", live(H)), "remove_mutation_group", [live(unclean_mutations)]);
	}
	if ((rt.gt(rt.sv(f, "efficiency"), 5) && truthy(rt.op(f, "Prob", [], [20])))) {
		yield* g.callName(f, live(H), "randmutvg", []);
	}
	if ((rt.lt(rt.sv(f, "efficiency"), 3) && truthy(rt.op(f, "Prob", [], [50])))) {
		if (truthy((yield* g.call(f, P("/proc/ismob"), null, [(M = (yield* g.callName(f, live(H), "randmutb", [])))])))) {
			H = live(M);
		}
	}
	rt.setFv(f, "silent", live(H), 20);
	rt.setSv(f, "occupant", live(H));
	if (!truthy(live(clonename))) {
		clonename = fmt("clone (＀)", [(yield* g.call(f, P("/proc/rand"), null, [0, 999]))]);
	}
	rt.setFv(f, "real_name", live(H), live(clonename));
	rt.setSv(f, "icon_state", "pod_1");
	yield* g.srcCall(f, "maim_clone", live(H));
	yield* g.srcCall(f, "check_brine");
	yield* g.callName(f, live(H), "Unconscious", [80]);
	yield* g.callName(f, rt.sv(f, "clonemind"), "transfer_to", [live(H)]);
	if (isEqual(rt.sv(f, "grab_ghost_when"), "fresh")) {
		yield* g.callName(f, live(H), "grab_ghost", []);
		yield* g.call(f, P("/proc/to_chat"), null, [live(H), "<span class='notice'><b>Consciousness slowly creeps over you as your body regenerates.</b><br><i>So this is what cloning feels like?</i></span>"]);
	}
	if (isEqual(rt.sv(f, "grab_ghost_when"), "mature")) {
		yield* g.callName(f, live(H), "ghostize", [1]);
		yield* g.call(f, P("/proc/to_chat"), null, [(yield* g.callName(f, live(H), "get_ghost", [1])), "<span class='notice'>Your body is beginning to regenerate in a cloning pod. You will become conscious when it is complete.</span>"]);
	}
	if (truthy(live(H))) {
		(rt.modField(f, live(H), "faction", live(factions), rt.bitOr));
		yield* g.callName(f, live(H), "set_cloned_appearance", []);
		rt.setFv(f, "suiciding", live(H), 0);
	}
	rt.setSv(f, "attempting", 0);
	return 1;
}, true);

// /obj/machinery/clonepod/proc/process  (code/game/machinery/cloning.dm:231)  may sleep
rt.def("/obj/machinery/clonepod/proc/process", function* process(f: Frame) {
	let mob_occupant: Value = null, progress: Value = null, milestone: Value = null, installed: Value = null, I: Value = null, O: Value = null, BP: Value = null, i: Value = null, O_2: Value = null, BP_2: Value = null;
	let $e: any;
	f.vars = () => [mob_occupant, progress, milestone, installed, I, O, BP, i, O_2, BP_2, $e];
	mob_occupant = rt.sv(f, "occupant");
	if (!truthy((yield* g.srcCall(f, "is_operational")))) {
		if (truthy(live(mob_occupant))) {
			yield* g.srcCall(f, "go_out");
			yield* g.srcCall(f, "connected_message", "Clone Ejected: Loss of power.");
		}
	} else {
		if ((truthy(live(mob_occupant)) && isEqual(rt.fv(f, "loc", live(mob_occupant)), live(f.src)))) {
			if (((isEqual(rt.fv(f, "stat", live(mob_occupant)), 2) || truthy(rt.fv(f, "suiciding", live(mob_occupant)))) || truthy(rt.fv(f, "hellbound", live(mob_occupant))))) {
				yield* g.srcCall(f, "connected_message", "Clone Rejected: Deceased.");
				yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("The cloning of ＀ has been aborted due to unrecoverable tissue failure.", [rt.fv(f, "real_name", live(mob_occupant))]), rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
				yield* g.srcCall(f, "go_out");
			} else {
				if (rt.gt(rt.fv(f, "cloneloss", live(mob_occupant)), subtract(100, rt.sv(f, "heal_level")))) {
					yield* g.callName(f, live(mob_occupant), "Unconscious", [80]);
					yield* g.callName(f, live(mob_occupant), "adjustCloneLoss", [rt.neg(multiply(divide(rt.sv(f, "speed_coeff"), 2), rt.fv(f, "damage_multiplier", rt.gl("config"))))]);
					progress = subtract(190, (yield* g.callName(f, live(mob_occupant), "getCloneLoss", [])));
					progress = rt.modify(live(progress), 60, add);
					milestone = divide(190, rt.sv(f, "flesh_number"));
					installed = subtract(rt.sv(f, "flesh_number"), rt.len(f, rt.sv(f, "unattached_flesh")));
					if (rt.ge(divide(live(progress), live(milestone)), live(installed))) {
						if (truthy((rt.istype((I = (yield* g.call(f, P("/proc/pick_n_take"), null, [rt.sv(f, "unattached_flesh")]))), T("/obj/item/organ")) ? 1 : 0))) {
							yield* g.callName(f, (O = live(I)), "Insert", [live(mob_occupant)]);
						} else {
							if (truthy((rt.istype(live(I), T("/obj/item/bodypart")) ? 1 : 0))) {
								yield* g.callName(f, (BP = live(I)), "attach_limb", [live(mob_occupant)]);
							}
						}
					}
					yield* g.callName(f, live(mob_occupant), "adjustBrainLoss", [rt.neg(multiply(divide(rt.sv(f, "speed_coeff"), 2), rt.fv(f, "damage_multiplier", rt.gl("config"))))]);
					yield* g.srcCall(f, "check_brine");
					yield* g.srcCall(f, "use_power", 7500);
				} else {
					if (rt.le(rt.fv(f, "cloneloss", live(mob_occupant)), subtract(100, rt.sv(f, "heal_level")))) {
						yield* g.srcCall(f, "connected_message", "Cloning Process Complete.");
						yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("The cloning cycle of ＀ is complete.", [rt.fv(f, "real_name", live(mob_occupant))]), rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
						i = null;
						rt.forList(f, 0, rt.sv(f, "unattached_flesh"));
						while (($e = rt.next(f, 0)) !== undefined) {
							i = $e;
							if (truthy((rt.istype(live(i), T("/obj/item/organ")) ? 1 : 0))) {
								yield* g.callName(f, (O_2 = live(i)), "Insert", [live(mob_occupant)]);
							} else {
								if (truthy((rt.istype(live(i), T("/obj/item/bodypart")) ? 1 : 0))) {
									yield* g.callName(f, (BP_2 = live(i)), "attach_limb", [live(mob_occupant)]);
								}
							}
						}
						rt.endFor(f, 0);
						yield* g.srcCall(f, "go_out");
					}
				}
			}
		} else {
			if (!(!truthy(live(mob_occupant)) || !isEqual(rt.fv(f, "loc", live(mob_occupant)), live(f.src)))) return f.dot;
			rt.setSv(f, "occupant", null);
			if ((!truthy(rt.sv(f, "mess")) && !truthy(rt.sv(f, "panel_open")))) {
				rt.setSv(f, "icon_state", "pod_0");
			}
			yield* g.srcCall(f, "use_power", 200);
		}
	}
	return f.dot;
}, true, { waitfor: false });

// /obj/machinery/clonepod/proc/attackby  (code/game/machinery/cloning.dm:297)  may sleep
rt.def("/obj/machinery/clonepod/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, comp: Value = null, mob_occupant: Value = null;
	f.vars = () => [_P, comp, mob_occupant];
	if (!(truthy(rt.sv(f, "occupant")) || truthy(rt.sv(f, "mess")))) {
		if (truthy((yield* g.srcCall(f, "default_deconstruction_screwdriver", live(f.args[1]), fmt("＀_maintenance", [rt.sv(f, "icon_state")]), fmt("＀", [rt.initial(f, live(f.src), "icon_state")]), live(f.args[0]))))) {
			return live(f.dot);
		}
	}
	if (truthy((yield* g.srcCall(f, "exchange_parts", live(f.args[1]), live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((yield* g.srcCall(f, "default_deconstruction_crowbar", live(f.args[0]))))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/multitool")) ? 1 : 0))) {
		if (truthy((rt.istype(rt.gv(f, "buffer", (_P = live(f.args[0]))), T("/obj/machinery/computer/cloning")) ? 1 : 0))) {
			if (!isEqual((yield* g.call(f, P("/proc/get_area"), null, [rt.fv(f, "buffer", live(_P))])), (yield* g.call(f, P("/proc/get_area"), null, [live(f.src)])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<font color = #666633>-% Cannot link machines across power zones. Buffer cleared %-</font color>"]);
				rt.setFv(f, "buffer", live(_P), null);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<font color = #666633>-% Successfully linked ＀ with ＀ %-</font color>", [rt.fv(f, "buffer", live(_P)), live(f.src)])]);
			comp = rt.fv(f, "buffer", live(_P));
			if (truthy(rt.sv(f, "connected"))) {
				yield* g.callName(f, rt.sv(f, "connected"), "DetachCloner", [live(f.src)]);
			}
			yield* g.callName(f, live(comp), "AttachCloner", [live(f.src)]);
		} else {
			rt.setFv(f, "buffer", live(_P), live(f.src));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<font color = #666633>-% Successfully stored ＃ ＀ in buffer %-</font color>", [rt.fv(f, "buffer", live(_P)), rt.gv(f, "name", rt.fv(f, "buffer", live(_P)))])]);
		}
		return live(f.dot);
	}
	mob_occupant = rt.sv(f, "occupant");
	if (truthy((yield* g.callName(f, live(f.args[0]), "GetID", [])))) {
		if (!truthy((yield* g.srcCall(f, "check_access", live(f.args[0]))))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Access Denied.</span>"]);
			return live(f.dot);
		}
		if (!(truthy(live(mob_occupant)) || truthy(rt.sv(f, "mess")))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='danger'>Error: Pod has no occupant.</span>"]);
			return live(f.dot);
		} else {
			yield* g.srcCall(f, "connected_message", "Emergency Ejection");
			yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), fmt("An emergency ejection of ＀ has occurred. Survival not guaranteed.", [rt.fv(f, "name", rt.sv(f, "clonemind"))]), rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You force an emergency ejection. </span>"]);
			yield* g.srcCall(f, "go_out");
		}
	} else {
		return (yield* g.callSuper(f, [], rt.Args.Same));
	}
	return f.dot;
}, true, { args: ["W", "user", "params"] });

// /obj/machinery/clonepod/proc/emag_act  (code/game/machinery/cloning.dm:342)  may sleep
rt.def("/obj/machinery/clonepod/proc/emag_act", function* emag_act(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!truthy(rt.sv(f, "occupant"))) {
		return live(f.dot);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='warning'>You corrupt the genetic compiler.</span>"]);
	yield* g.srcCall(f, "malfunction");
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/connected_message  (code/game/machinery/cloning.dm:349)  may sleep
rt.def("/obj/machinery/clonepod/proc/connected_message", function* connected_message(f: Frame, message: Value) {
	f.vars = () => [message];
	if ((rt.sv(f, "connected") === null || !truthy((rt.istype(rt.sv(f, "connected"), T("/obj/machinery/computer/cloning")) ? 1 : 0)))) {
		return 0;
	}
	if (!truthy(live(message))) {
		return 0;
	}
	rt.setFv(f, "temp", rt.sv(f, "connected"), live(message));
	yield* g.callName(f, rt.sv(f, "connected"), "updateUsrDialog", []);
	return 1;
}, true);

// /obj/machinery/clonepod/proc/go_out  (code/game/machinery/cloning.dm:359)  may sleep
rt.def("/obj/machinery/clonepod/proc/go_out", function* go_out(f: Frame) {
	let mob_occupant: Value = null, _T: Value = null, fl: Value = null;
	let $e: any;
	f.vars = () => [mob_occupant, _T, fl, $e];
	yield* g.callName(f, rt.sv(f, "countdown"), "stop", []);
	mob_occupant = rt.sv(f, "occupant");
	_T = rt.getStep(f, live(f.src), 0);
	if (truthy(rt.sv(f, "mess"))) {
		fl = null;
		rt.forList(f, 0, rt.sv(f, "unattached_flesh"), T("/obj"));
		while (($e = rt.next(f, 0)) !== undefined) {
			fl = $e;
			yield* g.callName(f, live(fl), "forceMove", [live(_T)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "unattached_flesh"), "Cut", []);
		rt.setSv(f, "mess", 0);
		yield* g.new_(f, T("/obj/effect/gibspawner/generic"), [rt.sv(f, "loc")]);
		yield* g.srcCall(f, "audible_message", "<span class='italics'>You hear a splat.</span>");
		rt.setSv(f, "icon_state", "pod_0");
		return live(f.dot);
	}
	if (!truthy(live(mob_occupant))) {
		return live(f.dot);
	}
	if (isEqual(rt.sv(f, "grab_ghost_when"), "mature")) {
		yield* g.callName(f, live(mob_occupant), "grab_ghost", []);
		yield* g.call(f, P("/proc/to_chat"), null, [rt.sv(f, "occupant"), "<span class='notice'><b>There is a bright flash!</b><br><i>You feel like a new being.</i></span>"]);
		yield* g.callName(f, live(mob_occupant), "flash_act", []);
	}
	yield* g.callName(f, rt.sv(f, "occupant"), "forceMove", [live(_T)]);
	rt.setSv(f, "icon_state", "pod_0");
	yield* g.callName(f, live(mob_occupant), "domutcheck", [1]);
	fl = null;
	rt.forList(f, 0, rt.sv(f, "unattached_flesh"));
	while (($e = rt.next(f, 0)) !== undefined) {
		fl = $e;
		yield* g.call(f, P("/proc/qdel"), null, [live(fl)]);
	}
	rt.endFor(f, 0);
	yield* g.callName(f, rt.sv(f, "unattached_flesh"), "Cut", []);
	rt.setSv(f, "occupant", null);
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/malfunction  (code/game/machinery/cloning.dm:392)  may sleep
rt.def("/obj/machinery/clonepod/proc/malfunction", function* malfunction(f: Frame) {
	let mob_occupant: Value = null;
	f.vars = () => [mob_occupant];
	if (!truthy((mob_occupant = rt.sv(f, "occupant")))) return f.dot;
	yield* g.srcCall(f, "connected_message", "Critical Error!");
	yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), "Critical error! Please contact a Thinktronic Systems technician, as your warranty may be affected.", rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
	rt.setSv(f, "mess", 1);
	yield* g.srcCall(f, "maim_clone", live(mob_occupant));
	rt.setSv(f, "icon_state", "pod_g");
	if (!isEqual(rt.fv(f, "mind", live(mob_occupant)), rt.sv(f, "clonemind"))) {
		yield* g.callName(f, rt.sv(f, "clonemind"), "transfer_to", [live(mob_occupant)]);
	}
	yield* g.callName(f, live(mob_occupant), "grab_ghost", []);
	yield* g.call(f, P("/proc/flash_color"), null, [null, live(mob_occupant), "flash_color", "#960000", "flash_time", 100], rt.Args.Named);
	yield* g.call(f, P("/proc/to_chat"), null, [live(mob_occupant), "<span class='warning'><b>Agony blazes across your consciousness as your body is torn apart.</b><br><i>Is this what dying is like? Yes it is.</i></span>"]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/machines/warning-buzzer.ogg"), 50, 0]);
	rt.op(f, "Output", [], [live(mob_occupant), (yield* g.call(f, P("/proc/sound"), null, [rt.rsc("sound/hallucinations/veryfar_noise.ogg"), 0, 1, 50]))], false);
	yield* g.call(f, P("/proc/addtimer"), null, [(yield* g.new_(f, T("/datum/callback"), ["some_magic_bullshit", P("/proc/qdel"), live(mob_occupant)])), 40, 8]);
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/relaymove  (code/game/machinery/cloning.dm:410)  may sleep
rt.def("/obj/machinery/clonepod/proc/relaymove", function* relaymove(f: Frame, user: Value) {
	f.vars = () => [user];
	if (!isEqual(rt.fv(f, "stat", live(user)), 0)) return f.dot;
	yield* g.srcCall(f, "go_out");
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/emp_act  (code/game/machinery/cloning.dm:414)  may sleep
rt.def("/obj/machinery/clonepod/proc/emp_act", function* emp_act(f: Frame) {
	let mob_occupant: Value = null;
	f.vars = () => [mob_occupant];
	if ((truthy((mob_occupant = rt.sv(f, "occupant"))) && truthy(rt.op(f, "Prob", [], [divide(100, multiply(live(f.args[0]), rt.sv(f, "efficiency")))])))) {
		yield* g.srcCall(f, "connected_message", (yield* g.call(f, P("/proc/Gibberish"), null, ["EMP-caused Accidental Ejection", 0])));
		yield* g.callName(f, rt.sv(f, "radio"), "talk_into", [live(f.src), (yield* g.call(f, P("/proc/Gibberish"), null, [fmt("Exposure to electromagnetic fields has caused the ejection of ＀ prematurely.", [rt.fv(f, "real_name", live(mob_occupant))]), 0])), rt.sv(f, "radio_channel"), (yield* g.srcCall(f, "get_spans")), (yield* g.srcCall(f, "get_default_language"))]);
		yield* g.srcCall(f, "go_out");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/machinery/clonepod/proc/ex_act  (code/game/machinery/cloning.dm:422)  may sleep
rt.def("/obj/machinery/clonepod/proc/ex_act", function* ex_act(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	if (!truthy(live(f.src)) || truthy(rt.fv(f, "gc_destroyed", live(f.src)))) return f.dot;
	yield* g.srcCall(f, "go_out");
	return f.dot;
}, true, { args: ["severity", "target"], waitfor: false });

// /obj/machinery/clonepod/proc/handle_atom_del  (code/game/machinery/cloning.dm:427)
rt.def("/obj/machinery/clonepod/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "occupant"))) return f.dot;
	rt.setSv(f, "occupant", null);
	rt.callName(f, rt.sv(f, "countdown"), "stop", []);
	return f.dot;
});

// /obj/machinery/clonepod/proc/horrifyingsound  (code/game/machinery/cloning.dm:432)  may sleep
rt.def("/obj/machinery/clonepod/proc/horrifyingsound", function* horrifyingsound(f: Frame) {
	let i: Value = null;
	let $e: any;
	f.vars = () => [i, $e];
	i = null;
	rt.forRange(f, 0, 1, 5, 1);
	while (($e = rt.next(f, 0)) !== undefined) {
		i = $e;
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.op(f, "PickUnweighted", [3], [rt.rsc("sound/hallucinations/growl1.ogg"), rt.rsc("sound/hallucinations/growl2.ogg"), rt.rsc("sound/hallucinations/growl3.ogg")]), 100, (yield* g.call(f, P("/proc/rand"), null, [0.949999988079071, 1.0499999523162842]))]);
		yield* g.call(f, P("/proc/sleep"), null, [1]);
	}
	rt.endFor(f, 0);
	yield* g.call(f, P("/proc/sleep"), null, [10]);
	yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/hallucinations/wail.ogg"), 100, 1]);
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/deconstruct  (code/game/machinery/cloning.dm:440)  may sleep
rt.def("/obj/machinery/clonepod/proc/deconstruct", function* deconstruct(f: Frame) {
	if (live(f.args[0]) === null) {
		f.args[0] = 1;
	}
	if (truthy(rt.sv(f, "occupant"))) {
		yield* g.srcCall(f, "go_out");
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["disassembled"] });

// /obj/machinery/clonepod/proc/maim_clone  (code/game/machinery/cloning.dm:444)  may sleep
rt.def("/obj/machinery/clonepod/proc/maim_clone", function* maim_clone(f: Frame, H: Value) {
	let fl: Value = null, zone: Value = null, BP: Value = null, o: Value = null, organ: Value = null;
	let $e: any;
	f.vars = () => [H, fl, zone, BP, o, organ, $e];
	if (!truthy(rt.sv(f, "unattached_flesh"))) {
		rt.setSv(f, "unattached_flesh", rt.list());
	} else {
		fl = null;
		rt.forList(f, 0, rt.sv(f, "unattached_flesh"));
		while (($e = rt.next(f, 0)) !== undefined) {
			fl = $e;
			yield* g.call(f, P("/proc/qdel"), null, [live(fl)]);
		}
		rt.endFor(f, 0);
		yield* g.callName(f, rt.sv(f, "unattached_flesh"), "Cut", []);
	}
	yield* g.callName(f, live(H), "setCloneLoss", [190]);
	yield* g.callName(f, live(H), "setBrainLoss", [190]);
	zone = null;
	rt.forList(f, 0, rt.gl("zones"));
	while (($e = rt.next(f, 0)) !== undefined) {
		zone = $e;
		if (truthy((BP = (yield* g.callName(f, live(H), "get_bodypart", [live(zone)]))))) {
			yield* g.callName(f, live(BP), "drop_limb", []);
			yield* g.callName(f, live(BP), "forceMove", [live(f.src)]);
			rt.modSrcVar(f, "unattached_flesh", live(BP), add);
		}
	}
	rt.endFor(f, 0);
	o = null;
	rt.forList(f, 0, rt.fv(f, "internal_organs", live(H)));
	while (($e = rt.next(f, 0)) !== undefined) {
		o = $e;
		if ((!truthy((rt.istype((organ = live(o)), T("/obj/item/organ")) ? 1 : 0)) || truthy(rt.fv(f, "vital", live(organ))))) {
			continue;
		}
		yield* g.callName(f, live(organ), "Remove", [null, live(H), "special", 1], rt.Args.Named);
		yield* g.callName(f, live(organ), "forceMove", [live(f.src)]);
		rt.modSrcVar(f, "unattached_flesh", live(organ), add);
	}
	rt.endFor(f, 0);
	rt.setSv(f, "flesh_number", rt.len(f, rt.sv(f, "unattached_flesh")));
	return f.dot;
}, true);

// /obj/machinery/clonepod/proc/check_brine  (code/game/machinery/cloning.dm:476)  may sleep
rt.def("/obj/machinery/clonepod/proc/check_brine", function* check_brine(f: Frame) {
	let bt: Value = null;
	let $e: any;
	f.vars = () => [bt, $e];
	bt = null;
	rt.forList(f, 0, rt.gl("brine_types"));
	while (($e = rt.next(f, 0)) !== undefined) {
		bt = $e;
		if (rt.lt((yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "occupant")), "get_reagent_amount", [live(bt)])), 1)) {
			yield* g.callName(f, rt.fv(f, "reagents", rt.sv(f, "occupant")), "add_reagent", [live(bt), 1]);
		}
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);
