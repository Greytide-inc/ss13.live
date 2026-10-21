// From code/game/objects/structures/extinguisher.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(12748, "/obj/structure/extinguisher_cabinet", "/obj/structure", {
	stored_extinguisher: null,
	opened: 0,
	anchored: 1,
	name: "extinguisher cabinet",
	desc: "A small wall mounted cabinet designed to hold a fire extinguisher.",
	icon: rt.rsc("icons/obj/wallmounts.dmi"),
	icon_state: "extinguisher_closed",
	density: 0,
	obj_integrity: 200,
	max_integrity: 200,
	integrity_failure: 50,
});

// /obj/structure/extinguisher_cabinet/proc/New  (code/game/objects/structures/extinguisher.dm:15)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/New", function* New(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	yield* g.callSuper(f, [], rt.Args.Same);
	if (truthy(live(f.args[2]))) {
		yield* g.srcCall(f, "setDir", live(f.args[1]));
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			$0 = 0;
		} else {
			if (isEqual(rt.sv(f, "dir"), 4)) {
				$0 = -27;
			} else {
				$0 = 27;
			}
		}
		rt.setSv(f, "pixel_x", $0);
		if (truthy(rt.bitAnd(rt.sv(f, "dir"), 3))) {
			if (isEqual(rt.sv(f, "dir"), 1)) {
				$0 = -30;
			} else {
				$0 = 30;
			}
		} else {
			$0 = 0;
		}
		rt.setSv(f, "pixel_y", $0);
		rt.setSv(f, "opened", 1);
		rt.setSv(f, "icon_state", "extinguisher_empty");
	} else {
		rt.setSv(f, "stored_extinguisher", (yield* g.new_(f, T("/obj/item/weapon/extinguisher"), [live(f.src)])));
	}
	return f.dot;
}, true, { args: ["loc", "ndir", "building"] });

// /obj/structure/extinguisher_cabinet/proc/Destroy  (code/game/objects/structures/extinguisher.dm:27)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/Destroy", function* Destroy(f: Frame) {
	if (truthy(rt.sv(f, "stored_extinguisher"))) {
		yield* g.call(f, P("/proc/qdel"), null, [rt.sv(f, "stored_extinguisher")]);
		rt.setSv(f, "stored_extinguisher", null);
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/structure/extinguisher_cabinet/proc/contents_explosion  (code/game/objects/structures/extinguisher.dm:33)
rt.def("/obj/structure/extinguisher_cabinet/proc/contents_explosion", function contents_explosion(f: Frame, severity: Value, target: Value) {
	if (!truthy(rt.sv(f, "stored_extinguisher"))) return f.dot;
	rt.callName(f, rt.sv(f, "stored_extinguisher"), "ex_act", [live(severity), live(target)]);
	return f.dot;
});

// /obj/structure/extinguisher_cabinet/proc/handle_atom_del  (code/game/objects/structures/extinguisher.dm:36)
rt.def("/obj/structure/extinguisher_cabinet/proc/handle_atom_del", function handle_atom_del(f: Frame, A: Value) {
	if (!isEqual(live(A), rt.sv(f, "stored_extinguisher"))) return f.dot;
	rt.setSv(f, "stored_extinguisher", null);
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/structure/extinguisher_cabinet/proc/attackby  (code/game/objects/structures/extinguisher.dm:41)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/attackby", function* attackby(f: Frame) {
	if ((truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/wrench")) ? 1 : 0)) && !truthy(rt.sv(f, "stored_extinguisher")))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You start unsecuring ＀...</span>", [rt.sv(f, "name")])]);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.fv(f, "usesound", live(f.args[0])), 50, 1]);
		if (truthy((yield* g.call(f, P("/proc/do_after"), null, [null, live(f.args[1]), null, multiply(60, rt.fv(f, "toolspeed", live(f.args[0]))), "target", live(f.src)], rt.Args.Named)))) {
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/items/deconstruct.ogg"), 50, 1]);
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You unsecure ＀.</span>", [rt.sv(f, "name")])]);
			yield* g.srcCall(f, "deconstruct", 1);
		}
		return live(f.dot);
	}
	if ((truthy((rt.istype(live(f.args[1]), T("/mob/living/silicon/robot")) ? 1 : 0)) || truthy((rt.istype(live(f.args[1]), T("/mob/living/carbon/alien")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/weapon/extinguisher")) ? 1 : 0))) {
		if ((!truthy(rt.sv(f, "stored_extinguisher")) && truthy(rt.sv(f, "opened")))) {
			if (!truthy((yield* g.callName(f, live(f.args[1]), "drop_item", [])))) {
				return live(f.dot);
			}
			rt.modSrcVar(f, "contents", live(f.args[0]), add);
			rt.setSv(f, "stored_extinguisher", live(f.args[0]));
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You place ＀ in ＀.</span>", [live(f.args[0]), live(f.src)])]);
			yield* g.srcCall(f, "update_icon");
		} else {
			yield* g.srcCall(f, "toggle_cabinet", live(f.args[1]));
		}
	} else {
		if (!isEqual(rt.fv(f, "a_intent", live(f.args[1])), "harm")) {
			yield* g.srcCall(f, "toggle_cabinet", live(f.args[1]));
		} else {
			return (yield* g.callSuper(f, [], rt.Args.Same));
		}
	}
	return f.dot;
}, true, { args: ["I", "user", "params"] });

// /obj/structure/extinguisher_cabinet/proc/attack_hand  (code/game/objects/structures/extinguisher.dm:69)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_hand", function* attack_hand(f: Frame, user: Value) {
	f.vars = () => [user];
	if ((truthy((rt.istype(live(user), T("/mob/living/silicon/robot")) ? 1 : 0)) || truthy((rt.istype(live(user), T("/mob/living/carbon/alien")) ? 1 : 0)))) {
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "stored_extinguisher"))) {
		yield* g.callName(f, live(user), "put_in_hands", [rt.sv(f, "stored_extinguisher")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You take ＀ from ＀.</span>", [rt.sv(f, "stored_extinguisher"), live(f.src)])]);
		rt.setSv(f, "stored_extinguisher", null);
		if (!truthy(rt.sv(f, "opened"))) {
			rt.setSv(f, "opened", 1);
			yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/click.ogg"), 15, 1, -3]);
		}
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.srcCall(f, "toggle_cabinet", live(user));
	}
	return f.dot;
}, true);

// /obj/structure/extinguisher_cabinet/proc/attack_tk  (code/game/objects/structures/extinguisher.dm:85)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_tk", function* attack_tk(f: Frame, user: Value) {
	f.vars = () => [user];
	if (truthy(rt.sv(f, "stored_extinguisher"))) {
		yield* g.callName(f, rt.sv(f, "stored_extinguisher"), "forceMove", [rt.sv(f, "loc")]);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You telekinetically remove ＀ from ＀.</span>", [rt.sv(f, "stored_extinguisher"), live(f.src)])]);
		rt.setSv(f, "stored_extinguisher", null);
		rt.setSv(f, "opened", 1);
		yield* g.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/click.ogg"), 15, 1, -3]);
		yield* g.srcCall(f, "update_icon");
	} else {
		yield* g.srcCall(f, "toggle_cabinet", live(user));
	}
	return f.dot;
}, true);

// /obj/structure/extinguisher_cabinet/proc/attack_paw  (code/game/objects/structures/extinguisher.dm:96)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/attack_paw", function* attack_paw(f: Frame, user: Value) {
	f.vars = () => [user];
	yield* g.srcCall(f, "attack_hand", live(user));
	return f.dot;
}, true);

// /obj/structure/extinguisher_cabinet/proc/AltClick  (code/game/objects/structures/extinguisher.dm:99)
rt.def("/obj/structure/extinguisher_cabinet/proc/AltClick", function AltClick(f: Frame, user: Value) {
	if (((truthy(rt.callName(f, live(user), "incapacitated", [])) || !truthy(rt.callSrc(f, "Adjacent", [live(user)]))) || !truthy((rt.istype(live(user), T("/mob/living")) ? 1 : 0)))) {
		return live(f.dot);
	}
	rt.callSrc(f, "toggle_cabinet", [live(user)]);
	return f.dot;
});

// /obj/structure/extinguisher_cabinet/proc/toggle_cabinet  (code/game/objects/structures/extinguisher.dm:104)
rt.def("/obj/structure/extinguisher_cabinet/proc/toggle_cabinet", function toggle_cabinet(f: Frame, user: Value) {
	if ((truthy(rt.sv(f, "opened")) && truthy(rt.sv(f, "broken")))) {
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='warning'>＀ is broken open.</span>", [live(f.src)])]);
	} else {
		rt.call(f, P("/proc/playsound"), null, [rt.sv(f, "loc"), rt.rsc("sound/machines/click.ogg"), 15, 1, -3]);
		rt.setSv(f, "opened", (!truthy(rt.sv(f, "opened")) ? 1 : 0));
		rt.callSrc(f, "update_icon", []);
	}
	return f.dot;
});

// /obj/structure/extinguisher_cabinet/proc/update_icon  (code/game/objects/structures/extinguisher.dm:112)
rt.def("/obj/structure/extinguisher_cabinet/proc/update_icon", function update_icon(f: Frame) {
	if (!truthy(rt.sv(f, "opened"))) {
		rt.setSv(f, "icon_state", "extinguisher_closed");
		return live(f.dot);
	}
	if (truthy(rt.sv(f, "stored_extinguisher"))) {
		if (truthy((rt.istype(rt.sv(f, "stored_extinguisher"), T("/obj/item/weapon/extinguisher/mini")) ? 1 : 0))) {
			rt.setSv(f, "icon_state", "extinguisher_mini");
		} else {
			rt.setSv(f, "icon_state", "extinguisher_full");
		}
	} else {
		rt.setSv(f, "icon_state", "extinguisher_empty");
	}
	return f.dot;
});

// /obj/structure/extinguisher_cabinet/proc/obj_break  (code/game/objects/structures/extinguisher.dm:124)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/obj_break", function* obj_break(f: Frame, damage_flag: Value) {
	f.vars = () => [damage_flag];
	if (!(!truthy(rt.sv(f, "broken")) && !truthy(rt.bitAnd(rt.sv(f, "flags"), 128)))) return f.dot;
	rt.setSv(f, "broken", 1);
	rt.setSv(f, "opened", 1);
	if (truthy(rt.sv(f, "stored_extinguisher"))) {
		yield* g.callName(f, rt.sv(f, "stored_extinguisher"), "forceMove", [rt.sv(f, "loc")]);
		rt.setSv(f, "stored_extinguisher", null);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/structure/extinguisher_cabinet/proc/deconstruct  (code/game/objects/structures/extinguisher.dm:134)  may sleep
rt.def("/obj/structure/extinguisher_cabinet/proc/deconstruct", function* deconstruct(f: Frame, disassembled: Value) {
	f.vars = () => [disassembled];
	if (live(disassembled) === null) {
		disassembled = 1;
	}
	if (!truthy(rt.bitAnd(rt.sv(f, "flags"), 128))) {
		if (truthy(live(disassembled))) {
			yield* g.new_(f, T("/obj/item/wallframe/extinguisher_cabinet"), [rt.sv(f, "loc")]);
		} else {
			yield* g.new_(f, T("/obj/item/stack/sheet/metal"), [rt.sv(f, "loc"), 2]);
		}
		if (truthy(rt.sv(f, "stored_extinguisher"))) {
			yield* g.callName(f, rt.sv(f, "stored_extinguisher"), "forceMove", [rt.sv(f, "loc")]);
			rt.setSv(f, "stored_extinguisher", null);
		}
	}
	yield* g.call(f, P("/proc/qdel"), null, [live(f.src)]);
	return f.dot;
}, true);
