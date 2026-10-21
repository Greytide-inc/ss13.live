// From code/modules/mob/living/brain/MMI.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(9115, "/obj/item/device/mmi", "/obj/item/device", {
	braintype: "Cyborg",
	radio: null,
	brainmob: null,
	robot: null,
	mecha: null,
	brain: null,
	laws: null,
	force_replace_ai_name: 0,
	name: "Man-Machine Interface",
	desc: "The Warrior's bland acronym, MMI, obscures the true horror of this monstrosity, that nevertheless has become standard-issue on Nanotrasen stations.",
	icon: rt.rsc("icons/obj/assemblies.dmi"),
	icon_state: "mmi_empty",
	w_class: 3,
	origin_tech: "biotech=2;programming=3;engineering=2",
});

// /obj/item/device/mmi/proc/<init>  (code/modules/mob/living/brain/MMI.dm:14)
rt.def("/obj/item/device/mmi/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "laws", rt.new_(f, T("/datum/ai_laws"), []));
	return f.dot;
});

// /obj/item/device/mmi/proc/update_icon  (code/modules/mob/living/brain/MMI.dm:19)
rt.def("/obj/item/device/mmi/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "brain"))) {
		if (truthy((rt.istype(rt.sv(f, "brain"), T("/obj/item/organ/brain/alien")) ? 1 : 0))) {
			if ((truthy(rt.sv(f, "brainmob")) && isEqual(rt.fv(f, "stat", rt.sv(f, "brainmob")), 2))) {
				rt.setSv(f, "icon_state", "mmi_alien_dead");
			} else {
				rt.setSv(f, "icon_state", "mmi_alien");
			}
			rt.setSv(f, "braintype", "Xenoborg");
		} else {
			if ((truthy(rt.sv(f, "brainmob")) && isEqual(rt.fv(f, "stat", rt.sv(f, "brainmob")), 2))) {
				rt.setSv(f, "icon_state", "mmi_dead");
			} else {
				rt.setSv(f, "icon_state", "mmi_full");
			}
			rt.setSv(f, "braintype", "Cyborg");
		}
	} else {
		rt.setSv(f, "icon_state", "mmi_empty");
	}
	return f.dot;
});

// /obj/item/device/mmi/proc/Initialize  (code/modules/mob/living/brain/MMI.dm:35)  may sleep
rt.def("/obj/item/device/mmi/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "radio", (yield* g.new_(f, T("/obj/item/device/radio"), [live(f.src)])));
	rt.setFv(f, "broadcasting", rt.sv(f, "radio"), 0);
	yield* g.callName(f, rt.sv(f, "laws"), "set_laws_config", []);
	return f.dot;
}, true);

// /obj/item/device/mmi/proc/attackby  (code/modules/mob/living/brain/MMI.dm:41)  may sleep
rt.def("/obj/item/device/mmi/proc/attackby", function* attackby(f: Frame) {
	let newbrain: Value = null, B: Value = null;
	f.vars = () => [newbrain, B];
	yield* g.callName(f, live(f.args[1]), "changeNext_move", [8]);
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/organ/brain")) ? 1 : 0))) {
		newbrain = live(f.args[0]);
		if (truthy(rt.sv(f, "brain"))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>There's already a brain in the MMI!</span>"]);
			return live(f.dot);
		}
		if (!truthy(rt.fv(f, "brainmob", live(newbrain)))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), "<span class='warning'>You aren't sure where this brain came from, but you're pretty sure it's a useless brain!</span>"]);
			return live(f.dot);
		}
		if (!truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(f.args[0]), live(f.src)])))) {
			return live(f.dot);
		}
		if (!truthy(rt.gv(f, "key", (B = rt.fv(f, "brainmob", live(newbrain)))))) {
			yield* g.callName(f, live(B), "notify_ghost_cloning", [null, "Someone has put your brain in a MMI!", "source", live(f.src)], rt.Args.Named);
		}
		yield* g.srcCall(f, "visible_message", fmt("＀ sticks ＇！ into ％！.", [live(f.args[1]), live(newbrain), live(f.src)]));
		rt.setSv(f, "brainmob", rt.fv(f, "brainmob", live(newbrain)));
		rt.setFv(f, "brainmob", live(newbrain), null);
		rt.setFv(f, "loc", rt.sv(f, "brainmob"), live(f.src));
		rt.setFv(f, "container", rt.sv(f, "brainmob"), live(f.src));
		if (!truthy(rt.fv(f, "damaged_brain", live(newbrain)))) {
			rt.setFv(f, "stat", rt.sv(f, "brainmob"), 0);
			(rt.modGl("dead_mob_list", rt.sv(f, "brainmob"), subtract));
			rt.modGl("living_mob_list", rt.sv(f, "brainmob"), add);
		}
		yield* g.callName(f, rt.sv(f, "brainmob"), "reset_perspective", []);
		rt.setSv(f, "brain", live(newbrain));
		rt.setSv(f, "name", fmt("Man-Machine Interface: ＀", [rt.fv(f, "real_name", rt.sv(f, "brainmob"))]));
		yield* g.srcCall(f, "update_icon");
	} else {
		if (truthy(rt.sv(f, "brainmob"))) {
			yield* g.callName(f, live(f.args[0]), "attack", [rt.sv(f, "brainmob"), live(f.args[1])]);
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["O", "user", "params"] });

// /obj/item/device/mmi/proc/attack_self  (code/modules/mob/living/brain/MMI.dm:82)  may sleep
rt.def("/obj/item/device/mmi/proc/attack_self", function* attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [user, $0, $1];
	if (!truthy(rt.sv(f, "brain"))) {
		rt.setFv(f, "on", rt.sv(f, "radio"), (!truthy(rt.fv(f, "on", rt.sv(f, "radio"))) ? 1 : 0));
		$0 = live(user);
		if (isEqual(rt.fv(f, "on", rt.sv(f, "radio")), 1)) {
			$1 = "on";
		} else {
			$1 = "off";
		}
		yield* g.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You toggle the MMI's radio system ＀.</span>", [$1])]);
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You unlock and upend the MMI, spilling the brain onto the floor.</span>"]);
		yield* g.srcCall(f, "eject_brain", live(user));
		yield* g.srcCall(f, "update_icon");
		rt.setSv(f, "name", "Man-Machine Interface");
	}
	return f.dot;
}, true);

// /obj/item/device/mmi/proc/eject_brain  (code/modules/mob/living/brain/MMI.dm:92)  may sleep
rt.def("/obj/item/device/mmi/proc/eject_brain", function* eject_brain(f: Frame, user: Value) {
	f.vars = () => [user];
	rt.setFv(f, "container", rt.sv(f, "brainmob"), null);
	rt.setFv(f, "loc", rt.sv(f, "brainmob"), rt.sv(f, "brain"));
	rt.setFv(f, "stat", rt.sv(f, "brainmob"), 2);
	rt.setFv(f, "emp_damage", rt.sv(f, "brainmob"), 0);
	yield* g.callName(f, rt.sv(f, "brainmob"), "reset_perspective", []);
	(rt.modGl("living_mob_list", rt.sv(f, "brainmob"), subtract));
	rt.modGl("dead_mob_list", rt.sv(f, "brainmob"), add);
	rt.setFv(f, "brainmob", rt.sv(f, "brain"), rt.sv(f, "brainmob"));
	rt.setSv(f, "brainmob", null);
	if (truthy(live(user))) {
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "brain")]);
	} else {
		yield* g.callName(f, rt.sv(f, "brain"), "forceMove", [rt.getStep(f, live(f.src), 0)]);
	}
	rt.setSv(f, "brain", null);
	return f.dot;
}, true);

// /obj/item/device/mmi/proc/transfer_identity  (code/modules/mob/living/brain/MMI.dm:109)  may sleep
rt.def("/obj/item/device/mmi/proc/transfer_identity", function* transfer_identity(f: Frame, L: Value) {
	let C: Value = null, H: Value = null, newbrain: Value = null;
	f.vars = () => [L, C, H, newbrain];
	if (!truthy(rt.sv(f, "brainmob"))) {
		rt.setSv(f, "brainmob", (yield* g.new_(f, T("/mob/living/brain"), [live(f.src)])));
	}
	rt.setFv(f, "name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(L)));
	rt.setFv(f, "real_name", rt.sv(f, "brainmob"), rt.fv(f, "real_name", live(L)));
	if (truthy((yield* g.callName(f, live(L), "has_dna", [])))) {
		C = live(L);
		if (!truthy(rt.fv(f, "stored_dna", rt.sv(f, "brainmob")))) {
			rt.setFv(f, "stored_dna", rt.sv(f, "brainmob"), (yield* g.new_(f, T("/datum/dna/stored"), [rt.sv(f, "brainmob")])));
		}
		yield* g.callName(f, rt.fv(f, "dna", live(C)), "copy_dna", [rt.fv(f, "stored_dna", rt.sv(f, "brainmob"))]);
	}
	rt.setFv(f, "container", rt.sv(f, "brainmob"), live(f.src));
	if (truthy((rt.istype(live(L), T("/mob/living/carbon/human")) ? 1 : 0))) {
		H = live(L);
		rt.setFv(f, "loc", (newbrain = (yield* g.callName(f, live(H), "getorgan", [T("/obj/item/organ/brain")]))), live(f.src));
		rt.setSv(f, "brain", live(newbrain));
	} else {
		if (!truthy(rt.sv(f, "brain"))) {
			rt.setSv(f, "brain", (yield* g.new_(f, T("/obj/item/organ/brain"), [live(f.src)])));
			rt.setFv(f, "name", rt.sv(f, "brain"), fmt("＀'s brain", [rt.fv(f, "real_name", live(L))]));
		}
	}
	rt.setSv(f, "name", fmt("Man-Machine Interface: ＀", [rt.fv(f, "real_name", rt.sv(f, "brainmob"))]));
	yield* g.srcCall(f, "update_icon");
	return live(f.dot);
}, true);

// /obj/item/device/mmi/proc/replacement_ai_name  (code/modules/mob/living/brain/MMI.dm:134)
rt.def("/obj/item/device/mmi/proc/replacement_ai_name", function replacement_ai_name(f: Frame) {
	return rt.fv(f, "name", rt.sv(f, "brainmob"));
});

// /obj/item/device/mmi/verb/Toggle_Listening  (code/modules/mob/living/brain/MMI.dm:143)
rt.def("/obj/item/device/mmi/verb/Toggle_Listening", function Toggle_Listening(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	if (truthy(rt.fv(f, "stat", rt.sv(f, "brainmob")))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "brainmob"), "<span class='warning'>Can't do that while incapacitated or dead!</span>"]);
	}
	if (!truthy(rt.fv(f, "on", rt.sv(f, "radio")))) {
		rt.call(f, P("/proc/to_chat"), null, [rt.sv(f, "brainmob"), "<span class='warning'>Your radio is disabled!</span>"]);
		return live(f.dot);
	}
	$0 = rt.sv(f, "radio");
	if (isEqual(rt.fv(f, "listening", rt.sv(f, "radio")), 1)) {
		$1 = 0;
	} else {
		$1 = 1;
	}
	rt.setFv(f, "listening", $0, $1);
	$0 = rt.sv(f, "brainmob");
	if (isEqual(rt.fv(f, "listening", rt.sv(f, "radio")), 1)) {
		$1 = "now";
	} else {
		$1 = "no longer";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>Radio is ＀ receiving broadcast.</span>", [$1])]);
	return f.dot;
}, false, { hidePopup: true, verb: { name: "Toggle Listening", category: "MMI", desc: "Toggle listening channel on or off.", src: 12 } });

// /obj/item/device/mmi/proc/emp_act  (code/modules/mob/living/brain/MMI.dm:153)  may sleep
rt.def("/obj/item/device/mmi/proc/emp_act", function* emp_act(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	if ((!truthy(rt.sv(f, "brainmob")) || truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/silicon/robot")) ? 1 : 0)))) {
		return live(f.dot);
	} else {
		$0 = live(f.args[0]);
		if ($0 === 1) {
			rt.setFv(f, "emp_damage", rt.sv(f, "brainmob"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "emp_damage", rt.sv(f, "brainmob")), (yield* g.call(f, P("/proc/rand"), null, [20, 30]))), 30])));
		} else if ($0 === 2) {
			rt.setFv(f, "emp_damage", rt.sv(f, "brainmob"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "emp_damage", rt.sv(f, "brainmob")), (yield* g.call(f, P("/proc/rand"), null, [10, 20]))), 30])));
		} else if ($0 === 3) {
			rt.setFv(f, "emp_damage", rt.sv(f, "brainmob"), (yield* g.call(f, P("/proc/min"), null, [add(rt.fv(f, "emp_damage", rt.sv(f, "brainmob")), (yield* g.call(f, P("/proc/rand"), null, [0, 10]))), 30])));
		}
		yield* g.callName(f, rt.sv(f, "brainmob"), "emote", ["alarm"]);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["severity"] });

// /obj/item/device/mmi/proc/Destroy  (code/modules/mob/living/brain/MMI.dm:167)  may sleep
rt.def("/obj/item/device/mmi/proc/Destroy", function* Destroy(f: Frame) {
	let borg: Value = null;
	f.vars = () => [borg];
	if (truthy((rt.istype(rt.sv(f, "loc"), T("/mob/living/silicon/robot")) ? 1 : 0))) {
		rt.setFv(f, "mmi", (borg = rt.sv(f, "loc")), null);
	}
	if (truthy(rt.sv(f, "brainmob"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "brainmob")]);
		rt.setSv(f, "brainmob", null);
	}
	if (truthy(rt.sv(f, "brain"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "brain")]);
		rt.setSv(f, "brain", null);
	}
	if (truthy(rt.sv(f, "mecha"))) {
		rt.setSv(f, "mecha", null);
	}
	if (truthy(rt.sv(f, "radio"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "radio")]);
		rt.setSv(f, "radio", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/device/mmi/proc/deconstruct  (code/modules/mob/living/brain/MMI.dm:185)  may sleep
rt.def("/obj/item/device/mmi/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (truthy(rt.sv(f, "brain"))) {
		yield* g.srcCall(f, "eject_brain");
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);

// /obj/item/device/mmi/proc/examine  (code/modules/mob/living/brain/MMI.dm:189)
rt.def("/obj/item/device/mmi/proc/examine", function examine(f: Frame) {
	let B: Value = null;
	f.vars = () => [B];
	rt.callSuper(f, [], rt.Args.Same);
	if (!truthy(rt.sv(f, "brainmob"))) return f.dot;
	if (((!truthy(rt.gv(f, "key", (B = rt.sv(f, "brainmob")))) || !truthy(rt.fv(f, "mind", live(B)))) || isEqual(rt.fv(f, "stat", live(B)), 2))) {
		rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The MMI indicates the brain is completely unresponsive.</span>"]);
	} else {
		if (!truthy(rt.fv(f, "client", live(B)))) {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='warning'>The MMI indicates the brain is currently inactive; it might change.</span>"]);
		} else {
			rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>The MMI indicates the brain is active.</span>"]);
		}
	}
	return f.dot;
}, false, { args: ["user"] });

rt.type(9118, "/obj/item/device/mmi/syndie", "/obj/item/device/mmi", {
	name: "Syndicate Man-Machine Interface",
	desc: "Syndicate's own brand of MMI. It enforces laws designed to help Syndicate agents achieve their goals upon cyborgs and AIs created with it.",
	origin_tech: "biotech=4;programming=4;syndicate=2",
});

// /obj/item/device/mmi/syndie/proc/New  (code/modules/mob/living/brain/MMI.dm:208)  may sleep
rt.def("/obj/item/device/mmi/syndie/proc/New", function* New(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	rt.setSv(f, "laws", (yield* g.new_(f, T("/datum/ai_laws/syndicate_override"), [])));
	rt.setFv(f, "on", rt.sv(f, "radio"), 0);
	return f.dot;
}, true);
