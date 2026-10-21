// From code/game/machinery/PDApainter.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(10810, "/obj/machinery/pdapainter", "/obj/machinery", {
	storedpda: null,
	colorlist: null,
	anchored: 1,
	name: "１PDA painter",
	desc: "A PDA painting machine. To use, simply insert your PDA and choose the desired preset paint scheme.",
	icon: rt.rsc("icons/obj/pda.dmi"),
	icon_state: "pdapainter",
	density: 1,
	obj_integrity: 200,
	max_integrity: 200,
});

// /obj/machinery/pdapainter/proc/<init>  (code/game/machinery/PDApainter.dm:9)
rt.def("/obj/machinery/pdapainter/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "colorlist", rt.list());
	return f.dot;
});

// /obj/machinery/pdapainter/proc/update_icon  (code/game/machinery/PDApainter.dm:15)
rt.def("/obj/machinery/pdapainter/proc/update_icon", function update_icon(f: Frame) {
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
		rt.setSv(f, "icon_state", fmt("＀-broken", [rt.initial(f, live(f.src), "icon_state")]));
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "storedpda"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀-closed", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	if (truthy(rt.callSrc(f, "powered", []))) {
		rt.setSv(f, "icon_state", rt.initial(f, live(f.src), "icon_state"));
	} else {
		rt.setSv(f, "icon_state", fmt("＀-off", [rt.initial(f, live(f.src), "icon_state")]));
	}
	return live(f.dot);
});

// /obj/machinery/pdapainter/proc/New  (code/game/machinery/PDApainter.dm:32)  may sleep
rt.def("/obj/machinery/pdapainter/proc/New", function* New(f: Frame) {
	let blocked: Value = null, _P: Value = null, D: Value = null;
	let $e: any;
	f.vars = () => [blocked, _P, D, $e];
	yield* g.callSuper(f, [], rt.Args.Same);
	blocked = rt.list(T("/obj/item/device/pda/ai/pai"), T("/obj/item/device/pda/ai"), T("/obj/item/device/pda/heads"), T("/obj/item/device/pda/clear"), T("/obj/item/device/pda/syndicate"));
	_P = null;
	rt.forList(f, 0, subtract((yield* g.call(f, P("/proc/typesof"), null, [T("/obj/item/device/pda")])), live(blocked)));
	while (($e = rt.next(f, 0)) !== undefined) {
		_P = $e;
		rt.setFv(f, "name", (D = (yield* g.new_(f, live(_P), []))), rt.fv(f, "icon_state", live(D)));
		rt.modField(f, live(f.src), "colorlist", live(D), add);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/machinery/pdapainter/proc/Destroy  (code/game/machinery/PDApainter.dm:46)  may sleep
rt.def("/obj/machinery/pdapainter/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "storedpda"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "storedpda")]);
		rt.setSv(f, "storedpda", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/machinery/pdapainter/proc/on_deconstruction  (code/game/machinery/PDApainter.dm:52)  may sleep
rt.def("/obj/machinery/pdapainter/proc/on_deconstruction", function* on_deconstruction(f: Frame) {
	if (!truthy(rt.sv(f, "storedpda"))) return f.dot;
	yield* g.callName(f, rt.sv(f, "storedpda"), "forceMove", [rt.sv(f, "loc")]);
	rt.setSv(f, "storedpda", null);
	return f.dot;
}, true);

// /obj/machinery/pdapainter/proc/contents_explosion  (code/game/machinery/PDApainter.dm:57)
rt.def("/obj/machinery/pdapainter/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!truthy(rt.sv(f, "storedpda"))) return f.dot;
	rt.callName(f, rt.sv(f, "storedpda"), "ex_act", [live(severity), live(target)]);
	return f.dot;
});

// /obj/machinery/pdapainter/proc/handle_atom_del  (code/game/machinery/PDApainter.dm:60)
rt.def("/obj/machinery/pdapainter/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "storedpda"))) return f.dot;
	rt.setSv(f, "storedpda", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/pdapainter/proc/attackby  (code/game/machinery/PDApainter.dm:65)  may sleep
rt.def("/obj/machinery/pdapainter/proc/attackby", function* attackby(f: Frame) {
	let _P: Value = null, WT: Value = null;
	f.vars = () => [_P, WT];
	if (truthy((yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]))))) {
		yield* g.srcCall(f, "power_change");
		return live(f.dot);
	} else {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/pda")) ? 1 : 0))) {
			if (truthy(rt.sv(f, "storedpda"))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There is already a PDA inside!</span>"]);
				return live(f.dot);
			} else {
				if (truthy((rt.istype((_P = (yield* g.callName(f, live(f.args[1]), "get_active_held_item", []))), T("/obj/item/device/pda")) ? 1 : 0))) {
					if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
						return live(f.dot);
					}
					rt.setSv(f, "storedpda", live(_P));
					rt.setFv(f, "loc", live(_P), live(f.src));
					yield* g.callName(f, live(_P), "add_fingerprint", [live(f.args[1])]);
					yield* g.srcCall(f, "update_icon");
				}
			}
		} else {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0)) && !isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm"))) {
				WT = live(f.args[0]);
				if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) {
					if (truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])])))) {
						yield* g.callName(f, live(f.args[1]), "visible_message", [fmt("＀ is repairing ＀.", [live(f.args[1]), live(f.src)]), fmt("<span class='notice'>You begin repairing ＀...</span>", [live(f.src)]), "<span class='italics'>You hear welding.</span>"]);
						yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 40, 1]);
						if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(40, rt.fv(f, "toolspeed", live(WT))), null, 1, "target", live(f.src)], rt.Args.Named)))) {
							if ((!truthy((yield* g.callName(f, live(WT), "isOn", []))) || !truthy(rt.bitAnd(rt.sv(f, "stat"), 1)))) {
								return live(f.dot);
							}
							yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You repair ＀.</span>", [live(f.src)])]);
							yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/welder2.ogg"), 50, 1]);
							(rt.modSrcVar(f, "stat", 16777214, rt.bitAnd));
							rt.setSv(f, "obj_integrity", rt.sv(f, "max_integrity"));
							yield* g.srcCall(f, "update_icon");
						}
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>＀ does not need repairs.</span>", [live(f.src)])]);
				}
			} else {
				return (yield* g.callSuper(f, [], rt.Args.Same));
			}
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/machinery/pdapainter/proc/deconstruct  (code/game/machinery/PDApainter.dm:105)
rt.def("/obj/machinery/pdapainter/proc/deconstruct", function deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) return f.dot;
	if (truthy(rt.bitAnd(rt.sv(f, "stat"), 1))) return f.dot;
	(rt.modSrcVar(f, "stat", 1, rt.bitOr));
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/machinery/pdapainter/proc/attack_hand  (code/game/machinery/PDApainter.dm:111)  may sleep
rt.def("/obj/machinery/pdapainter/proc/attack_hand", function* attack_hand(f: Frame) {
	let _P: Value = null;
	f.vars = () => [_P];
	if (truthy((yield* g.callSuper(f, [], rt.Args.Same)))) return f.dot;
	yield* g.srcCall(f, "add_fingerprint", live(f.args[0]));
	if (truthy(rt.sv(f, "storedpda"))) {
		_P = null;
		if (!truthy((_P = (yield* g.op(f, "Prompt", [1], [null, "PDA Painting", "Select your color!", live(f.args[0]), rt.sv(f, "colorlist")]))))) {
			return live(f.dot);
		}
		if (!rt.le((yield* g.call(f, P("/proc/get_dist"), null, [live(f.src), live(f.args[0])])), 1)) {
			return live(f.dot);
		}
		if (!truthy(rt.sv(f, "storedpda"))) {
			return live(f.dot);
		}
		rt.setFv(f, "icon_state", rt.sv(f, "storedpda"), rt.fv(f, "icon_state", live(_P)));
		rt.setFv(f, "desc", rt.sv(f, "storedpda"), rt.fv(f, "desc", live(_P)));
		yield* g.srcCall(f, "ejectpda");
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>＄！ is empty.</span>", [live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/machinery/pdapainter/verb/ejectpda  (code/game/machinery/PDApainter.dm:136)
rt.def("/obj/machinery/pdapainter/verb/ejectpda", function ejectpda(f: Frame) {
	if (((truthy(rt.fv(f, "stat", live(f.usr))) || truthy(rt.callName(f, live(f.usr), "restrained", []))) || !truthy(rt.fv(f, "canmove", live(f.usr))))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "storedpda"))) {
		rt.setFv(f, "loc", rt.sv(f, "storedpda"), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
		rt.setSv(f, "storedpda", null);
		rt.callSrc(f, "update_icon", []);
	} else {
		rt.call(f, P("/proc/to_chat"), null, [live(f.usr), fmt("<span class='notice'>The ＀ is empty.</span>", [live(f.src)])]);
	}
	return f.dot;
}, false, { verb: { name: "Eject PDA", category: "Object", src: 3, range: 1 } });

// /obj/machinery/pdapainter/proc/power_change  (code/game/machinery/PDApainter.dm:148)
rt.def("/obj/machinery/pdapainter/proc/power_change", function power_change(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});
