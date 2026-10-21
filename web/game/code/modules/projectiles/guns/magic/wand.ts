// From code/modules/projectiles/guns/magic/wand.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5113, "/obj/item/weapon/gun/magic/wand", "/obj/item/weapon/gun/magic", {
	variable_charges: 1,
	name: "wand of nothing",
	desc: "It's not just a stick, it's a MAGIC stick!",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic"),
	icon_state: "nothingwand",
	item_state: "wand",
	w_class: 2,
	can_charge: 0,
	max_charges: 100,
});

// /obj/item/weapon/gun/magic/wand/proc/Initialize  (code/modules/projectiles/guns/magic/wand.dm:13)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/proc/Initialize", function* Initialize(f: Frame) {
	if ((truthy(rt.op(f, "Prob", [], [75])) && truthy(rt.sv(f, "variable_charges")))) {
		if (truthy(rt.op(f, "Prob", [], [33]))) {
			rt.setSv(f, "max_charges", (yield* g.call(f, P("/proc/Ceiling"), null, [divide(rt.sv(f, "max_charges"), 3)])));
		} else {
			rt.setSv(f, "max_charges", (yield* g.call(f, P("/proc/Ceiling"), null, [divide(rt.sv(f, "max_charges"), 2)])));
		}
	}
	return (yield* g.callSuper(f, [], rt.Args.Same));
}, true);

// /obj/item/weapon/gun/magic/wand/proc/examine  (code/modules/projectiles/guns/magic/wand.dm:21)
rt.def("/obj/item/weapon/gun/magic/wand/proc/examine", function examine(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("Has ＀ charge５ remaining.", [rt.sv(f, "charges")])]);
	return f.dot;
}, false, { args: ["user"] });

// /obj/item/weapon/gun/magic/wand/proc/update_icon  (code/modules/projectiles/guns/magic/wand.dm:25)
rt.def("/obj/item/weapon/gun/magic/wand/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "charges"))) {
		$1 = "";
	} else {
		$1 = "-drained";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	return f.dot;
});

// /obj/item/weapon/gun/magic/wand/proc/attack  (code/modules/projectiles/guns/magic/wand.dm:28)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/proc/attack", function* attack(f: Frame) {
	if (isEqual(live(f.args[0]), live(f.args[1]))) {
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/gun/magic/wand/proc/afterattack  (code/modules/projectiles/guns/magic/wand.dm:33)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/proc/afterattack", function* afterattack(f: Frame) {
	let A: Value = null;
	f.vars = () => [A];
	if (!truthy(rt.sv(f, "charges"))) {
		yield* g.srcCall(f, "shoot_with_empty_chamber", live(f.args[1]));
		return live(f.dot);
	}
	if (isEqual(live(f.args[0]), live(f.args[1]))) {
		if (truthy(rt.sv(f, "no_den_usage"))) {
			if (truthy((rt.istype((A = (yield* g.call(f, P("/proc/get_area"), null, [live(f.args[1])]))), T("/area/wizard_station")) ? 1 : 0))) {
				yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You know better than to violate the security of The Den, best wait until you leave to use ＀.<span>", [live(f.src)])]);
				return live(f.dot);
			} else {
				rt.setSv(f, "no_den_usage", 0);
			}
		}
		yield* g.srcCall(f, "zap_self", live(f.args[1]));
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true, { args: ["target", "user"] });

// /obj/item/weapon/gun/magic/wand/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:51)
rt.def("/obj/item/weapon/gun/magic/wand/proc/zap_self", function zap_self(f: Frame, user: Value) {
	rt.callName(f, live(user), "visible_message", [fmt("<span class='danger'>＀ zaps ＀self with ＀.</span>", [live(user), rt.callName(f, live(user), "p_them", []), live(f.src)])]);
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.sv(f, "fire_sound"), 50, 1]);
	rt.callName(f, live(user), "log_message", [fmt("zapped ＀self with a <b>＀</b>", [rt.callName(f, live(user), "p_them", []), live(f.src)]), "Attack log"]);
	return f.dot;
});

rt.type(5118, "/obj/item/weapon/gun/magic/wand/death", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of death",
	desc: "This deadly wand overwhelms the victim's body with pure energy, slaying them without fail.",
	fire_sound: rt.rsc("sound/magic/wandodeath.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/death"),
	icon_state: "deathwand",
	max_charges: 3,
});

// /obj/item/weapon/gun/magic/wand/death/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:69)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/death/proc/zap_self", function* zap_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='warning'>You irradiate yourself with pure energy! ＀</span>", [rt.op(f, "PickUnweighted", [4], ["Do not pass go. Do not collect 200 zorkmids.", "You feel more confident in your spell casting skills.", "You Die...", "Do you want your possessions identified?"])])]);
	yield* g.callName(f, live(f.args[0]), "adjustOxyLoss", [500]);
	rt.incSrcVar(f, "charges", -1, true);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5116, "/obj/item/weapon/gun/magic/wand/resurrection", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of healing",
	desc: "This wand uses healing magics to heal and revive. They are rarely utilized within the Wizard Federation for some reason.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/heal"),
	fire_sound: rt.rsc("sound/magic/staff_healing.ogg"),
	icon_state: "revivewand",
	max_charges: 10,
});

// /obj/item/weapon/gun/magic/wand/resurrection/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:90)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/resurrection/proc/zap_self", function* zap_self(f: Frame) {
	let C: Value = null;
	f.vars = () => [C];
	yield* g.callName(f, live(f.args[0]), "revive", ["full_heal", 1], rt.Args.Named);
	if (truthy((rt.istype(live(f.args[0]), T("/mob/living/carbon")) ? 1 : 0))) {
		yield* g.callName(f, (C = live(f.args[0])), "regenerate_limbs", []);
		yield* g.callName(f, live(C), "regenerate_organs", []);
	}
	yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel great!</span>"]);
	rt.incSrcVar(f, "charges", -1, true);
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5119, "/obj/item/weapon/gun/magic/wand/polymorph", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of polymorph",
	desc: "This wand is attuned to chaos and will radically alter the victim's form.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/change"),
	icon_state: "polywand",
	fire_sound: rt.rsc("sound/magic/staff_change.ogg"),
	max_charges: 10,
});

// /obj/item/weapon/gun/magic/wand/polymorph/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:112)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/polymorph/proc/zap_self", function* zap_self(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.call(f, P("/proc/wabbajack"), null, [live(f.args[0])]);
	rt.incSrcVar(f, "charges", -1, true);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5120, "/obj/item/weapon/gun/magic/wand/teleport", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of teleportation",
	desc: "This wand will wrench targets through space and time to move them somewhere else.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/teleport"),
	fire_sound: rt.rsc("sound/magic/wand_teleport.ogg"),
	icon_state: "telewand",
	max_charges: 10,
	no_den_usage: 1,
});

// /obj/item/weapon/gun/magic/wand/teleport/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:130)  may sleep
rt.def("/obj/item/weapon/gun/magic/wand/teleport/proc/zap_self", function* zap_self(f: Frame) {
	let smoke: Value = null;
	f.vars = () => [smoke];
	if (truthy((yield* g.call(f, P("/proc/do_teleport"), null, [live(f.args[0]), live(f.args[0]), 10])))) {
		yield* g.callName(f, (smoke = (yield* g.new_(f, T("/datum/effect_system/smoke_spread"), []))), "set_up", [3, rt.fv(f, "loc", live(f.args[0]))]);
		yield* g.callName(f, live(smoke), "start", []);
		rt.incSrcVar(f, "charges", -1, true);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["user"] });

rt.type(5121, "/obj/item/weapon/gun/magic/wand/door", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of door creation",
	desc: "This particular wand can create doors in any wall for the unscrupulous wizard who shuns teleportation magics.",
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/door"),
	icon_state: "doorwand",
	fire_sound: rt.rsc("sound/magic/staff_door.ogg"),
	max_charges: 20,
	no_den_usage: 1,
});

// /obj/item/weapon/gun/magic/wand/door/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:151)
rt.def("/obj/item/weapon/gun/magic/wand/door/proc/zap_self", function zap_self(f: Frame) {
	rt.call(f, P("/proc/to_chat"), null, [live(f.args[0]), "<span class='notice'>You feel vaguely more open with your feelings.</span>"]);
	rt.incSrcVar(f, "charges", -1, true);
	rt.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, false, { args: ["user"] });

rt.type(5114, "/obj/item/weapon/gun/magic/wand/fireball", "/obj/item/weapon/gun/magic/wand", {
	name: "wand of fireball",
	desc: "This wand shoots scorching balls of fire that explode into destructive flames.",
	fire_sound: rt.rsc("sound/magic/fireball.ogg"),
	ammo_type: rt.typePath("/obj/item/ammo_casing/magic/fireball"),
	icon_state: "firewand",
	max_charges: 8,
});

// /obj/item/weapon/gun/magic/wand/fireball/proc/zap_self  (code/modules/projectiles/guns/magic/wand.dm:168)
rt.def("/obj/item/weapon/gun/magic/wand/fireball/proc/zap_self", function zap_self(f: Frame) {
	rt.callSuper(f, [], rt.Args.Same);
	rt.call(f, P("/proc/explosion"), null, [null, rt.fv(f, "loc", live(f.args[0])), null, -1, null, 0, null, 2, null, 3, null, 0, "flame_range", 2], rt.Args.Named);
	rt.incSrcVar(f, "charges", -1, true);
	return f.dot;
}, false, { args: ["user"] });
