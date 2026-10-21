// From code/modules/projectiles/guns/ballistic/automatic.dm (translated once from the DM; this file is now the source, edit it by hand).
import * as rt from "../../../../../../build/dist/src/translate/runtime.js";
import type { Frame, Value } from "../../../../../../build/dist/src/translate/runtime.js";
const { T, P, g, live, truthy, isEqual, add, subtract, multiply, divide, fmt } = rt;


rt.type(5202, "/obj/item/weapon/gun/ballistic/automatic", "/obj/item/weapon/gun/ballistic", {
	alarmed: 0,
	select: 1,
	origin_tech: "combat=4;materials=2",
	w_class: 3,
	can_suppress: 1,
	burst_size: 3,
	fire_delay: 2,
	actions_types: null,
});

// /obj/item/weapon/gun/ballistic/automatic/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:9)
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list(T("/datum/action/item_action/toggle_firemode")));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:22)
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any, $3: any;
	f.vars = () => [$0, $1, $2, $3];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	if (!truthy(rt.sv(f, "select"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀semi", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	if (isEqual(rt.sv(f, "select"), 1)) {
		rt.callSrc(f, "add_overlay", [fmt("＀burst", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "magazine"))) {
		$1 = fmt("-＀", [rt.fv(f, "max_ammo", rt.sv(f, "magazine"))]);
	} else {
		$1 = "";
	}
	if (truthy(rt.sv(f, "chambered"))) {
		$2 = "";
	} else {
		$2 = "-e";
	}
	if (truthy(rt.sv(f, "suppressed"))) {
		$3 = "-suppressed";
	} else {
		$3 = "";
	}
	rt.setSv(f, "icon_state", fmt("＀＀＀＀", [$0, $1, $2, $3]));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/proc/attackby  (code/modules/projectiles/guns/ballistic/automatic.dm:31)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/attackby", function* attackby(f: Frame) {
	let AM: Value = null, oldmag: Value = null;
	f.vars = () => [AM, oldmag];
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	if (truthy(live(f.dot))) {
		return live(f.dot);
	}
	if (!truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_box/magazine")) ? 1 : 0))) return f.dot;
	if (!truthy(rt.op(f, "IsType", [], [(AM = live(f.args[0])), rt.sv(f, "mag_type")]))) return f.dot;
	oldmag = rt.sv(f, "magazine");
	if (truthy((yield* g.callName(f, live(f.args[1]), "transferItemToLoc", [live(AM), live(f.src)])))) {
		rt.setSv(f, "magazine", live(AM));
		if (truthy(live(oldmag))) {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You perform a tactical reload on ％！, replacing the magazine.</span>", [live(f.src)])]);
			yield* g.callName(f, live(oldmag), "dropped", []);
			yield* g.callName(f, live(oldmag), "forceMove", [rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0)]);
			yield* g.callName(f, live(oldmag), "update_icon", []);
		} else {
			yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='notice'>You insert the magazine into ％！.</span>", [live(f.src)])]);
		}
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[1]), rt.rsc("sound/weapons/autoguninsert.ogg"), 60, 1]);
		yield* g.srcCall(f, "chamber_round");
		yield* g.callName(f, live(f.args[0]), "update_icon", []);
		yield* g.srcCall(f, "update_icon");
		return 1;
	} else {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>You cannot seem to get ％！ out of your hands!</span>", [live(f.src)])]);
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/automatic/proc/ui_action_click  (code/modules/projectiles/guns/ballistic/automatic.dm:57)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/ui_action_click", function* ui_action_click(f: Frame) {
	yield* g.srcCall(f, "burst_select");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/proc/burst_select  (code/modules/projectiles/guns/ballistic/automatic.dm:60)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/burst_select", function* burst_select(f: Frame) {
	let user: Value = null, X: Value = null, A: Value = null;
	let $e: any;
	f.vars = () => [user, X, A, $e];
	user = live(f.usr);
	rt.setSv(f, "select", (!truthy(rt.sv(f, "select")) ? 1 : 0));
	if (!truthy(rt.sv(f, "select"))) {
		rt.setSv(f, "burst_size", 1);
		rt.setSv(f, "fire_delay", 0);
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch to semi-automatic.</span>"]);
	} else {
		rt.setSv(f, "burst_size", rt.initial(f, live(f.src), "burst_size"));
		rt.setSv(f, "fire_delay", rt.initial(f, live(f.src), "fire_delay"));
		yield* g.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You switch to ＀-rnd burst.</span>", [rt.sv(f, "burst_size")])]);
	}
	yield* g.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	yield* g.srcCall(f, "update_icon");
	X = null;
	rt.forList(f, 0, rt.sv(f, "actions"));
	while (($e = rt.next(f, 0)) !== undefined) {
		X = $e;
		yield* g.callName(f, (A = live(X)), "UpdateButtonIcon", []);
	}
	rt.endFor(f, 0);
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/proc/can_shoot  (code/modules/projectiles/guns/ballistic/automatic.dm:78)
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/can_shoot", function can_shoot(f: Frame) {
	return rt.callSrc(f, "get_ammo", []);
});

// /obj/item/weapon/gun/ballistic/automatic/proc/empty_alarm  (code/modules/projectiles/guns/ballistic/automatic.dm:81)
rt.def("/obj/item/weapon/gun/ballistic/automatic/proc/empty_alarm", function empty_alarm(f: Frame) {
	if (((!truthy(rt.sv(f, "chambered")) && !truthy(rt.callSrc(f, "get_ammo", []))) && !truthy(rt.sv(f, "alarmed")))) {
		rt.call(f, P("/proc/playsound"), null, [rt.fv(f, "loc", live(f.src)), rt.rsc("sound/weapons/smg_empty_alarm.ogg"), 40, 1]);
		rt.callSrc(f, "update_icon", []);
		rt.setSv(f, "alarmed", 1);
	}
	return live(f.dot);
});

rt.type(5215, "/obj/item/weapon/gun/ballistic/automatic/c20r", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "１C-20r SMG",
	desc: "A bullpup two-round burst .45 SMG, designated 'C-20r'. Has a 'Scarborough Arms - Per falcis, per pravitas' buttstamp.",
	icon_state: "c20r",
	item_state: "c20r",
	origin_tech: "combat=5;materials=2;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	fire_delay: 2,
	burst_size: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/smgm45"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// /obj/item/weapon/gun/ballistic/automatic/c20r/proc/Initialize  (code/modules/projectiles/guns/ballistic/automatic.dm:103)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/c20r/proc/afterattack  (code/modules/projectiles/guns/ballistic/automatic.dm:107)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/afterattack", function* afterattack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "empty_alarm");
	return live(f.dot);
}, true);

// /obj/item/weapon/gun/ballistic/automatic/c20r/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:112)
rt.def("/obj/item/weapon/gun/ballistic/automatic/c20r/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "magazine"))) {
		$0 = fmt("-＀", [multiply(rt.call(f, P("/proc/Ceiling"), null, [divide(rt.callSrc(f, "get_ammo", [0]), 4)]), 4)]);
	} else {
		$0 = "";
	}
	if (truthy(rt.sv(f, "chambered"))) {
		$1 = "";
	} else {
		$1 = "-e";
	}
	if (truthy(rt.sv(f, "suppressed"))) {
		$2 = "-suppressed";
	} else {
		$2 = "";
	}
	rt.setSv(f, "icon_state", fmt("c20r＀＀＀", [$0, $1, $2]));
	return f.dot;
});

rt.type(5222, "/obj/item/weapon/gun/ballistic/automatic/wt550", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "security auto rifle",
	desc: "An outdated personal defence weapon. Uses 4.6x30mm rounds and is designated the WT-550 Automatic Rifle.",
	icon_state: "wt550",
	item_state: "arg",
	fire_delay: 2,
	can_suppress: 0,
	burst_size: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/wt550m9"),
});

// /obj/item/weapon/gun/ballistic/automatic/wt550/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:124)
rt.def("/obj/item/weapon/gun/ballistic/automatic/wt550/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/wt550/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:127)
rt.def("/obj/item/weapon/gun/ballistic/automatic/wt550/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "magazine"))) {
		$0 = fmt("-＀", [multiply(rt.call(f, P("/proc/Ceiling"), null, [divide(rt.callSrc(f, "get_ammo", [0]), 4)]), 4)]);
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("wt550＀", [$0]));
	return f.dot;
});

rt.type(5224, "/obj/item/weapon/gun/ballistic/automatic/m90", "/obj/item/weapon/gun/ballistic/automatic", {
	underbarrel: null,
	name: "１M-90gl Carbine",
	desc: "A three-round burst 5.56 toploading carbine, designated 'M-90gl'. Has an attached underbarrel grenade launcher which can be toggled on and off.",
	icon_state: "m90",
	item_state: "m90",
	origin_tech: "combat=5;materials=2;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 2,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m556"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// /obj/item/weapon/gun/ballistic/automatic/m90/proc/Initialize  (code/modules/projectiles/guns/ballistic/automatic.dm:153)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "underbarrel", (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

rt.type(5225, "/obj/item/weapon/gun/ballistic/automatic/m90/unrestricted", "/obj/item/weapon/gun/ballistic/automatic/m90", {
	pin: rt.typePath("/obj/item/device/firing_pin"),
});

// /obj/item/weapon/gun/ballistic/automatic/m90/unrestricted/proc/Initialize  (code/modules/projectiles/guns/ballistic/automatic.dm:161)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/unrestricted/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	rt.setSv(f, "underbarrel", (yield* g.new_(f, T("/obj/item/weapon/gun/ballistic/revolver/grenadelauncher/unrestricted"), [live(f.src)])));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/m90/proc/afterattack  (code/modules/projectiles/guns/ballistic/automatic.dm:166)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/afterattack", function* afterattack(f: Frame) {
	if (isEqual(rt.sv(f, "select"), 2)) {
		yield* g.callName(f, rt.sv(f, "underbarrel"), "afterattack", [live(f.args[0]), live(f.args[1]), live(f.args[2]), live(f.args[3])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	return f.dot;
}, true, { args: ["target", "user", "flag", "params"] });

// /obj/item/weapon/gun/ballistic/automatic/m90/proc/attackby  (code/modules/projectiles/guns/ballistic/automatic.dm:172)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/attackby", function* attackby(f: Frame) {
	if (truthy((rt.istype(live(f.args[0]), T("/obj/item/ammo_casing")) ? 1 : 0))) {
		if (truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.gv(f, "ammo_type", rt.fv(f, "magazine", rt.sv(f, "underbarrel")))]))) {
			yield* g.callName(f, rt.sv(f, "underbarrel"), "attack_self", []);
			yield* g.callName(f, rt.sv(f, "underbarrel"), "attackby", [live(f.args[0]), live(f.args[1]), live(f.args[2])]);
		}
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
	}
	return f.dot;
}, true, { args: ["A", "user", "params"] });

// /obj/item/weapon/gun/ballistic/automatic/m90/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:179)
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.callSuper(f, [], rt.Args.Same);
	rt.callSrc(f, "cut_overlays", []);
	$0 = rt.sv(f, "select");
	if ($0 === 0) {
		rt.callSrc(f, "add_overlay", [fmt("＀semi", [rt.initial(f, live(f.src), "icon_state")])]);
	} else if ($0 === 1) {
		rt.callSrc(f, "add_overlay", [fmt("＀burst", [rt.initial(f, live(f.src), "icon_state")])]);
	} else if ($0 === 2) {
		rt.callSrc(f, "add_overlay", [fmt("＀gren", [rt.initial(f, live(f.src), "icon_state")])]);
	}
	$0 = rt.initial(f, live(f.src), "icon_state");
	if (truthy(rt.sv(f, "magazine"))) {
		$1 = "";
	} else {
		$1 = "-e";
	}
	rt.setSv(f, "icon_state", fmt("＀＀", [$0, $1]));
	return live(f.dot);
});

// /obj/item/weapon/gun/ballistic/automatic/m90/proc/burst_select  (code/modules/projectiles/guns/ballistic/automatic.dm:191)
rt.def("/obj/item/weapon/gun/ballistic/automatic/m90/proc/burst_select", function burst_select(f: Frame) {
	let user: Value = null;
	let $0: any;
	f.vars = () => [user, $0];
	user = live(f.usr);
	$0 = rt.sv(f, "select");
	if ($0 === 0) {
		rt.setSv(f, "select", 1);
		rt.setSv(f, "burst_size", rt.initial(f, live(f.src), "burst_size"));
		rt.setSv(f, "fire_delay", rt.initial(f, live(f.src), "fire_delay"));
		rt.call(f, P("/proc/to_chat"), null, [live(user), fmt("<span class='notice'>You switch to ＀-rnd burst.</span>", [rt.sv(f, "burst_size")])]);
	} else if ($0 === 1) {
		rt.setSv(f, "select", 2);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch to grenades.</span>"]);
	} else if ($0 === 2) {
		rt.setSv(f, "select", 0);
		rt.setSv(f, "burst_size", 1);
		rt.setSv(f, "fire_delay", 0);
		rt.call(f, P("/proc/to_chat"), null, [live(user), "<span class='notice'>You switch to semi-auto.</span>"]);
	}
	rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/empty.ogg"), 100, 1]);
	rt.callSrc(f, "update_icon", []);
	return live(f.dot);
});

rt.type(5229, "/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog", "/obj/item/weapon/gun/ballistic/automatic/shotgun", {
	name: "１Bulldog Shotgun",
	desc: "A semi-auto, mag-fed shotgun for combat in narrow corridors, nicknamed 'Bulldog' by boarding parties. Compatible only with specialized 8-round drum magazines.",
	icon_state: "bulldog",
	item_state: "bulldog",
	w_class: 3,
	weapon_weight: 2,
	origin_tech: "combat=6;materials=4;syndicate=6",
	fire_sound: rt.rsc("sound/weapons/gunshot.ogg"),
	can_suppress: 0,
	burst_size: 1,
	fire_delay: 0,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m12g"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// /obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:253)
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/Initialize  (code/modules/projectiles/guns/ballistic/automatic.dm:259)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/Initialize", function* Initialize(f: Frame) {
	f.dot = (yield* g.callSuper(f, [], rt.Args.Same));
	yield* g.srcCall(f, "update_icon");
	return f.dot;
}, true);

// /obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:263)
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSrc(f, "cut_overlays", []);
	if (truthy(rt.sv(f, "magazine"))) {
		rt.callSrc(f, "add_overlay", [fmt("＀", [rt.fv(f, "icon_state", rt.sv(f, "magazine"))])]);
	}
	if (truthy(rt.sv(f, "chambered"))) {
		$0 = "";
	} else {
		$0 = "-e";
	}
	rt.setSv(f, "icon_state", fmt("bulldog＀", [$0]));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/afterattack  (code/modules/projectiles/guns/ballistic/automatic.dm:269)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/shotgun/bulldog/proc/afterattack", function* afterattack(f: Frame) {
	yield* g.callSuper(f, [], rt.Args.Same);
	yield* g.srcCall(f, "empty_alarm");
	return live(f.dot);
}, true);

rt.type(5231, "/obj/item/weapon/gun/ballistic/automatic/l6_saw", "/obj/item/weapon/gun/ballistic/automatic", {
	cover_open: 0,
	name: "１L6 SAW",
	desc: "A heavily modified 1.95x129mm light machine gun, designated 'L6 SAW'. Has 'Aussec Armoury - 2531' engraved on the receiver below the designation.",
	icon_state: "l6closed100",
	item_state: "l6closedmag",
	w_class: 5,
	slot_flags: 0,
	origin_tech: "combat=6;engineering=3;syndicate=6",
	weapon_weight: 3,
	fire_sound: rt.rsc("sound/weapons/gunshot_smg.ogg"),
	can_suppress: 0,
	burst_size: 3,
	fire_delay: 1,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/mm195x129"),
	pin: rt.typePath("/obj/item/device/firing_pin/implant/pindicate"),
});

// /obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_self  (code/modules/projectiles/guns/ballistic/automatic.dm:299)
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_self", function attack_self(f: Frame, user: Value) {
	let $0: any, $1: any;
	f.vars = () => [$0, $1];
	rt.setSv(f, "cover_open", (!truthy(rt.sv(f, "cover_open")) ? 1 : 0));
	$0 = live(user);
	if (truthy(rt.sv(f, "cover_open"))) {
		$1 = "open";
	} else {
		$1 = "close";
	}
	rt.call(f, P("/proc/to_chat"), null, [$0, fmt("<span class='notice'>You ＀ ＀'s cover.</span>", [$1, live(f.src)])]);
	if (truthy(rt.sv(f, "cover_open"))) {
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/sawopen.ogg"), 60, 1]);
	} else {
		rt.call(f, P("/proc/playsound"), null, [live(user), rt.rsc("sound/weapons/sawclose.ogg"), 60, 1]);
	}
	rt.callSrc(f, "update_icon", []);
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:309)
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/update_icon", function update_icon(f: Frame) {
	let $0: any, $1: any, $2: any;
	f.vars = () => [$0, $1, $2];
	if (truthy(rt.sv(f, "cover_open"))) {
		$0 = "open";
	} else {
		$0 = "closed";
	}
	if (truthy(rt.sv(f, "magazine"))) {
		$1 = multiply(rt.call(f, P("/proc/Ceiling"), null, [divide(rt.callSrc(f, "get_ammo", [0]), 12.5)]), 25);
	} else {
		$1 = "-empty";
	}
	if (truthy(rt.sv(f, "suppressed"))) {
		$2 = "-suppressed";
	} else {
		$2 = "";
	}
	rt.setSv(f, "icon_state", fmt("l6＀＀＀", [$0, $1, $2]));
	if (truthy(rt.sv(f, "cover_open"))) {
		$0 = "openmag";
	} else {
		$0 = "closedmag";
	}
	rt.setSv(f, "item_state", fmt("l6＀", [$0]));
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/afterattack  (code/modules/projectiles/guns/ballistic/automatic.dm:315)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/afterattack", function* afterattack(f: Frame) {
	if (truthy(rt.sv(f, "cover_open"))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s cover is open! Close it before firing!</span>", [live(f.src)])]);
	} else {
		yield* g.callSuper(f, [], rt.Args.Same);
		yield* g.srcCall(f, "update_icon");
	}
	return f.dot;
}, true, { args: ["target", "user", "flag", "params"] });

// /obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_hand  (code/modules/projectiles/guns/ballistic/automatic.dm:322)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attack_hand", function* attack_hand(f: Frame) {
	if (!isEqual(rt.sv(f, "loc"), live(f.args[0]))) {
		yield* g.callSuper(f, [], rt.Args.Same);
		return live(f.dot);
	}
	if ((!truthy(rt.sv(f, "cover_open")) || (truthy(rt.sv(f, "cover_open")) && !truthy(rt.sv(f, "magazine"))))) {
		yield* g.callSuper(f, [], rt.Args.Same);
	} else {
		if (!(truthy(rt.sv(f, "cover_open")) && truthy(rt.sv(f, "magazine")))) return f.dot;
		yield* g.callName(f, rt.sv(f, "magazine"), "update_icon", []);
		rt.setFv(f, "loc", rt.sv(f, "magazine"), rt.getStep(f, rt.fv(f, "loc", live(f.src)), 0));
		yield* g.callName(f, live(f.args[0]), "put_in_hands", [rt.sv(f, "magazine")]);
		rt.setSv(f, "magazine", null);
		yield* g.srcCall(f, "update_icon");
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[0]), fmt("<span class='notice'>You remove the magazine from ＀.</span>", [live(f.src)])]);
		yield* g.call(f, P("/proc/playsound"), null, [live(f.args[0]), rt.rsc("sound/weapons/magout.ogg"), 60, 1]);
	}
	return f.dot;
}, true, { args: ["user"] });

// /obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attackby  (code/modules/projectiles/guns/ballistic/automatic.dm:339)  may sleep
rt.def("/obj/item/weapon/gun/ballistic/automatic/l6_saw/proc/attackby", function* attackby(f: Frame) {
	if ((!truthy(rt.sv(f, "cover_open")) && truthy(rt.op(f, "IsType", [], [live(f.args[0]), rt.sv(f, "mag_type")])))) {
		yield* g.call(f, P("/proc/to_chat"), null, [live(f.args[1]), fmt("<span class='warning'>＀'s cover is closed! You can't insert a new mag.</span>", [live(f.src)])]);
		return live(f.dot);
	}
	yield* g.callSuper(f, [], rt.Args.Same);
	return f.dot;
}, true, { args: ["A", "user", "params"] });

rt.type(5235, "/obj/item/weapon/gun/ballistic/automatic/sniper_rifle", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "sniper rifle",
	desc: "A long ranged weapon that does significant damage. No, you can't quickscope.",
	icon_state: "sniper",
	item_state: "sniper",
	recoil: 2,
	weapon_weight: 3,
	fire_delay: 40,
	burst_size: 1,
	origin_tech: "combat=7",
	can_unsuppress: 1,
	can_suppress: 1,
	w_class: 3,
	zoomable: 1,
	zoom_amt: 7,
	slot_flags: 1024,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/sniper_rounds"),
});

// /obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:365)
rt.def("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:370)
rt.def("/obj/item/weapon/gun/ballistic/automatic/sniper_rifle/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "magazine"))) {
		rt.setSv(f, "icon_state", "sniper-mag");
	} else {
		rt.setSv(f, "icon_state", "sniper");
	}
	return f.dot;
});

rt.type(5238, "/obj/item/weapon/gun/ballistic/automatic/surplus", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "Surplus Rifle",
	desc: "One of countless obsolete ballistic rifles that still sees use as a cheap deterrent. Uses 10mm ammo and its bulky frame prevents one-hand firing.",
	origin_tech: "combat=3;materials=2",
	icon_state: "surplus",
	item_state: "moistnugget",
	weapon_weight: 3,
	fire_delay: 30,
	burst_size: 1,
	can_unsuppress: 1,
	can_suppress: 1,
	w_class: 5,
	slot_flags: 1024,
	actions_types: null,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/m10mm/rifle"),
});

// /obj/item/weapon/gun/ballistic/automatic/surplus/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:402)
rt.def("/obj/item/weapon/gun/ballistic/automatic/surplus/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/surplus/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:406)
rt.def("/obj/item/weapon/gun/ballistic/automatic/surplus/proc/update_icon", function update_icon(f: Frame) {
	if (truthy(rt.sv(f, "magazine"))) {
		rt.setSv(f, "icon_state", "surplus");
	} else {
		rt.setSv(f, "icon_state", "surplus-e");
	}
	return f.dot;
});

rt.type(5211, "/obj/item/weapon/gun/ballistic/automatic/laser", "/obj/item/weapon/gun/ballistic/automatic", {
	name: "laser rifle",
	desc: "Though sometimes mocked for the relatively weak firepower of their energy weapons, the logistic miracle of rechargable ammunition has given Nanotrasen a decisive edge over many a foe.",
	icon_state: "oldrifle",
	item_state: "arg",
	fire_delay: 2,
	can_suppress: 0,
	burst_size: 0,
	actions_types: null,
	fire_sound: rt.rsc("sound/weapons/laser.ogg"),
	casing_ejector: 0,
	mag_type: rt.typePath("/obj/item/ammo_box/magazine/recharge"),
});

// /obj/item/weapon/gun/ballistic/automatic/laser/proc/<init>  (code/modules/projectiles/guns/ballistic/automatic.dm:422)
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/proc/<init>", function _init_(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	$0 = rt.callSuper(f, []);
	rt.setSv(f, "actions_types", rt.list());
	return f.dot;
});

// /obj/item/weapon/gun/ballistic/automatic/laser/proc/update_icon  (code/modules/projectiles/guns/ballistic/automatic.dm:427)
rt.def("/obj/item/weapon/gun/ballistic/automatic/laser/proc/update_icon", function update_icon(f: Frame) {
	let $0: any;
	f.vars = () => [$0];
	rt.callSuper(f, [], rt.Args.Same);
	if (truthy(rt.sv(f, "magazine"))) {
		$0 = fmt("-＀", [multiply(rt.call(f, P("/proc/Ceiling"), null, [divide(rt.callSrc(f, "get_ammo", [0]), 4)]), 4)]);
	} else {
		$0 = "";
	}
	rt.setSv(f, "icon_state", fmt("oldrifle＀", [$0]));
	return live(f.dot);
});
