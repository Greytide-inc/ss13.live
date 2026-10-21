// From code/game/objects/structures/ai_core.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12708, "/obj/structure/AIcore", "/obj/structure", {
	state: 0,
	laws: null,
	circuit: null,
	brain: null,
	anchored: 0,
	density: 1,
	name: "１AI core",
	icon: rt.rsc("icons/mob/ai.dmi"),
	icon_state: "0",
	obj_integrity: 500,
	max_integrity: 500,
});

// /obj/structure/AIcore/proc/<init>  (code/game/objects/structures/ai_core.dm:10)
rt.def("/obj/structure/AIcore/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.new_(f, T("/datum/ai_laws"), []));
	return f.dot;
});

// /obj/structure/AIcore/proc/New  (code/game/objects/structures/ai_core.dm:15)  may sleep
rt.def("/obj/structure/AIcore/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.callName(f, rt.sv(f, "laws"), "set_laws_config", []);
	return f.dot;
}, true);

// /obj/structure/AIcore/proc/Destroy  (code/game/objects/structures/ai_core.dm:20)  may sleep
rt.def("/obj/structure/AIcore/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "circuit"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "circuit")]);
		rt.setSv(f, "circuit", null);
	}
	if (truthy(rt.sv(f, "brain"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "brain")]);
		rt.setSv(f, "brain", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/AIcore/proc/attackby  (code/game/objects/structures/ai_core.dm:28)  may sleep
rt.def("/obj/structure/AIcore/proc/attackby", function* attackby(f: Frame) {
	let WT: Value = null, C: Value = null, A: Value = null, G: Value = null, module: Value = null, M: Value = null;
	let $0: any;
	f.vars = () => [WT, C, A, G, module, M, $0];
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0))) {
		return (yield* g.srcCall(f, "default_unfasten_wrench", live(f.args[1]), live(f.args[0]), 20));
	}
	if (!truthy(rt.sv(f, "anchored"))) {
		if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/weldingtool")) ? 1 : 0))) {
			if (!isEqual(rt.sv(f, "state"), 0)) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The core must be empty to deconstruct it!</span>"]);
				return live(f.dot);
			}
			if (!truthy((yield* g.callName(f, (WT = live(f.args[0])), "isOn", [])))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>The welder must be on for this task!</span>"]);
				return live(f.dot);
			}
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(WT)), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to deconstruct the frame...</span>"]);
			if (((((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(20, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named))) && truthy(live(f.src))) && isEqual(rt.sv(f, "state"), 0)) && truthy(live(WT))) && truthy((yield* g.callName(f, live(WT), "remove_fuel", [0, live(f.args[1])]))))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You deconstruct the frame.</span>"]);
				yield* g.srcCall(f, "deconstruct", 1);
			}
			return live(f.dot);
		}
	} else {
		$0 = rt.sv(f, "state");
		if ($0 === 0) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/circuitboard/aicore")) ? 1 : 0))) {
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You place the circuit board inside the frame.</span>"]);
				yield* g.srcCall(f, "update_icon");
				rt.setSv(f, "state", 1);
				rt.setSv(f, "circuit", live(f.args[0]));
				yield* g.callName(f, live(f.args[0]), "forceMove", [live(f.src)]);
				return live(f.dot);
			}
		} else if ($0 === 1) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You screw the circuit board into place.</span>"]);
				rt.setSv(f, "state", 2);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the circuit board.</span>"]);
				rt.setSv(f, "state", 0);
				yield* g.srcCall(f, "update_icon");
				yield* g.callName(f, rt.sv(f, "circuit"), "forceMove", [rt.sv(f, "loc")]);
				rt.setSv(f, "circuit", null);
				return live(f.dot);
			}
		} else if ($0 === 2) {
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0)) && truthy(rt.sv(f, "circuit")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You unfasten the circuit board.</span>"]);
				rt.setSv(f, "state", 1);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/cable_coil")) ? 1 : 0))) {
				if (rt.ge((yield* g.callName(f, (C = live(f.args[0])), "get_amount", [])), 5)) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to add cables to the frame...</span>"]);
					if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && isEqual(rt.sv(f, "state"), 2)) && truthy((yield* g.callName(f, live(C), "use", [5]))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You add cables to the frame.</span>"]);
						rt.setSv(f, "state", 3);
						yield* g.srcCall(f, "update_icon");
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need five lengths of cable to wire the AI core!</span>"]);
				}
				return live(f.dot);
			}
		} else if ($0 === 3) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wirecutters")) ? 1 : 0))) {
				if (truthy(rt.sv(f, "brain"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Get that ＀ out of there first!</span>", [rt.fv(f, "name", rt.sv(f, "brain"))])]);
				} else {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the cables.</span>"]);
					rt.setSv(f, "state", 2);
					yield* g.srcCall(f, "update_icon");
					rt.setFv(f, "amount", (A = (yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc")]))), 5);
				}
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/stack/sheet/rglass")) ? 1 : 0))) {
				if (rt.ge((yield* g.callName(f, (G = live(f.args[0])), "get_amount", [])), 2)) {
					yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You start to put in the glass panel...</span>"]);
					if (((truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, 20, "target", live(f.src)], rt.Args.Named))) && isEqual(rt.sv(f, "state"), 3)) && truthy((yield* g.callName(f, live(G), "use", [2]))))) {
						yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You put in the glass panel.</span>"]);
						rt.setSv(f, "state", 4);
						yield* g.srcCall(f, "update_icon");
					}
				} else {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You need two sheets of reinforced glass to insert them into the AI core!</span>"]);
				}
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/aiModule")) ? 1 : 0))) {
				if ((truthy(rt.sv(f, "brain")) && !isEqual(rt.gv(f, "id", rt.fv(f, "laws", rt.sv(f, "brain"))), "default"))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>The installed ＀ already has set laws!</span>", [rt.fv(f, "name", rt.sv(f, "brain"))])]);
					return live(f.dot);
				}
				yield* g.callName(f, (module = live(f.args[0])), "install", [rt.sv(f, "laws"), live(f.args[1])]);
				return live(f.dot);
			}
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/device/mmi")) ? 1 : 0)) && !truthy(rt.sv(f, "brain")))) {
				if (!truthy(rt.gv(f, "brainmob", (M = live(f.args[0]))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Sticking an empty ＀ into the frame would sort of defeat the purpose!</span>", [rt.fv(f, "name", live(M))])]);
					return live(f.dot);
				}
				if (isEqual(rt.gv(f, "stat", rt.fv(f, "brainmob", live(M))), 2)) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Sticking a dead ＀ into the frame would sort of defeat the purpose!</span>", [rt.fv(f, "name", live(M))])]);
					return live(f.dot);
				}
				if (!truthy(rt.gv(f, "client", rt.fv(f, "brainmob", live(M))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>Sticking an inactive ＀ into the frame would sort of defeat the purpose.</span>", [rt.fv(f, "name", live(M))])]);
					return live(f.dot);
				}
				if (((truthy(rt.gl("config")) && !truthy(rt.fv(f, "allow_ai", rt.gl("config")))) || truthy((yield* g.call(f, P("/proc/jobban_isbanned"), null, [rt.fv(f, "brainmob", live(M)), "AI"]))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>This ＀ does not seem to fit!</span>", [rt.fv(f, "name", live(M))])]);
					return live(f.dot);
				}
				if (!truthy(rt.gv(f, "mind", rt.fv(f, "brainmob", live(M))))) {
					yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>This ＀ is mindless!</span>", [rt.fv(f, "name", live(M))])]);
					return live(f.dot);
				}
				if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
					return live(f.dot);
				}
				yield* g.callName(f, live(M), "forceMove", [live(f.src)]);
				rt.setSv(f, "brain", live(M));
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You add ＀ to the frame.</span>", [rt.fv(f, "name", live(M))])]);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
			if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0)) && truthy(rt.sv(f, "brain")))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the brain.</span>"]);
				yield* g.callName(f, rt.sv(f, "brain"), "forceMove", [rt.sv(f, "loc")]);
				rt.setSv(f, "brain", null);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
		} else if ($0 === 4) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/crowbar")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You remove the glass panel.</span>"]);
				rt.setSv(f, "state", 3);
				yield* g.srcCall(f, "update_icon");
				yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [rt.sv(f, "loc"), 2]);
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You connect the monitor.</span>"]);
				if (truthy(rt.sv(f, "brain"))) {
					yield* g.callName(f, rt.fv(f, "mode", rt.gl("SSticker")), "remove_antag_for_borging", [rt.gv(f, "mind", rt.fv(f, "brainmob", rt.sv(f, "brain")))]);
					if (!truthy((rt.istype(rt.fv(f, "laws", rt.sv(f, "brain")), T("/datum/ai_laws/ratvar")) ? 1 : 0))) {
						yield* g.call(f, P("/proc/remove_servant_of_ratvar"), null, [rt.fv(f, "brainmob", rt.sv(f, "brain")), 1]);
					}
					A = (yield* g.new_(f, T("/mob/living/silicon/ai"), [rt.sv(f, "loc"), rt.sv(f, "laws"), rt.fv(f, "brainmob", rt.sv(f, "brain"))]));
					if (truthy(rt.fv(f, "force_replace_ai_name", rt.sv(f, "brain")))) {
						yield* g.callName(f, live(A), "fully_replace_character_name", [rt.fv(f, "name", live(A)), (yield* g.callName(f, rt.sv(f, "brain"), "replacement_ai_name", []))]);
					}
					yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
				} else {
					rt.setSv(f, "state", 5);
					yield* g.srcCall(f, "update_icon");
				}
				return live(f.dot);
			}
		} else if ($0 === 5) {
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/device/aicard")) ? 1 : 0))) {
				yield* g.callName(f, live(f.args[0]), "transfer_ai", ["INACTIVE", "AICARD", live(f.src), live(f.args[1])]);
				return live(f.dot);
			}
			if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/screwdriver")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='notice'>You disconnect the monitor.</span>"]);
				rt.setSv(f, "state", 4);
				yield* g.srcCall(f, "update_icon");
				return live(f.dot);
			}
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true, { args: ["P", "user", "params"] });

// /obj/structure/AIcore/proc/update_icon  (code/game/objects/structures/ai_core.dm:204)
rt.def("/obj/structure/AIcore/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.sv(f, "state");
	if ($0 === 0) {
		rt.setSv(f, "icon_state", "0");
	} else if ($0 === 1) {
		rt.setSv(f, "icon_state", "1");
	} else if ($0 === 2) {
		rt.setSv(f, "icon_state", "2");
	} else if ($0 === 3) {
		if (truthy(rt.sv(f, "brain"))) {
			rt.setSv(f, "icon_state", "3b");
		} else {
			rt.setSv(f, "icon_state", "3");
		}
	} else if ($0 === 4) {
		rt.setSv(f, "icon_state", "4");
	} else if ($0 === 5) {
		rt.setSv(f, "icon_state", "ai-empty");
	}
	return f.dot;
});

// /obj/structure/AIcore/proc/deconstruct  (code/game/objects/structures/ai_core.dm:222)  may sleep
rt.def("/obj/structure/AIcore/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (isEqual(rt.sv(f, "state"), 4)) {
		yield* g.new_(f, T("/obj/item/stack/sheet/rglass"), [rt.sv(f, "loc"), 2]);
	}
	if (rt.ge(rt.sv(f, "state"), 3)) {
		yield* g.new_(f, T("/obj/item/stack/cable_coil"), [rt.sv(f, "loc"), 5]);
	}
	if (truthy(rt.sv(f, "circuit"))) {
		yield* g.callName(f, rt.sv(f, "circuit"), "forceMove", [rt.sv(f, "loc")]);
		rt.setSv(f, "circuit", null);
	}
	yield* g.new_(f, T("/obj/item/stack/sheet/plasteel"), [rt.sv(f, "loc"), 4]);
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

rt.type(12709, "/obj/structure/AIcore/deactivated", "/obj/structure/AIcore", {
	anchored: 1,
	state: 5,
	name: "inactive AI",
	icon_state: "ai-empty",
});

// /obj/structure/AIcore/deactivated/proc/New  (code/game/objects/structures/ai_core.dm:239)  may sleep
rt.def("/obj/structure/AIcore/deactivated/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "circuit", (yield* g.new_(f, T("/obj/item/weapon/circuitboard"), [live(f.src)])));
	return f.dot;
}, true);

// /atom/proc/transfer_ai  (code/game/objects/structures/ai_core.dm:252)
rt.def("/atom/proc/transfer_ai", function transfer_ai(f: Frame, interaction: Value, user: Value, AI: Value, card: Value) {
	if (truthy((rt.istype(live(card), T("/obj/item/device/aicard")) ? 1 : 0))) {
		if (truthy(rt.fv(f, "flush", live(card)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='boldannounce'>ERROR</span>: AI flush is in progress, cannot execute transfer protocol."]);
			return 0;
		}
	}
	return 1;
});

// /obj/structure/AIcore/proc/transfer_ai  (code/game/objects/structures/ai_core.dm:260)  may sleep
rt.def("/obj/structure/AIcore/proc/transfer_ai", function* transfer_ai(f: Frame) {
	if ((!isEqual(rt.sv(f, "state"), 5) || !truthy((yield* g.callSuper(f, [], rt.Args.Same))))) {
		return live(f.dot);
	}
	if (isEqual(live(f.args[0]), 2)) {
		rt.setFv(f, "control_disabled", live(f.args[2]), 0);
		rt.setFv(f, "radio_enabled", live(f.args[2]), 1);
		yield* g.callName(f, live(f.args[2]), "forceMove", [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[2]), "You have been uploaded to a stationary terminal. Remote device connection restored."]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='boldnotice'>Transfer successful</span>: ＀ (＀.exe) installed and executed successfully. Local copy has been removed.", [rt.fv(f, "name", live(f.args[2])), (yield* g.call(f, P("/proc/rand"), null, [1000, 9999]))])]);
		rt.setFv(f, "AI", live(f.args[3]), null);
		yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "There is no AI loaded on this terminal!"]);
	}
	return f.dot;
}, true, { args: ["interaction", "user", "AI", "card"] });
